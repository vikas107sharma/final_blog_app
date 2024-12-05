const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../modal/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../components/middleware/authMiddleware');

// Constants
const SECRET_KEY = process.env.SECRET_KEY;

// Validation Middleware
const validateRegister = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Error Handler Middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
    }
    next();
};

// Routes
// Register
router.post('/register', validateRegister, handleValidationErrors, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ status: false, message: 'Email already registered' });

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashPassword });
        await newUser.save();

        return res.status(201).json({ status: true, message: 'Register successful' });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Something went wrong', error: error.message });
    }
});

// Login
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ status: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1hr' });

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000, // 1 hr
        });

        return res.status(200).json({ status: true, message: 'Login successful' });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Something went wrong', error: error.message });
    }
});

// Profile
router.post('/profile', authMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        return res.status(200).json({ status: true, message: 'Profile Data', data: userData });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Something went wrong', error: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.status(200).json({ status: true, message: 'Logout successful' });
});

module.exports = router;
