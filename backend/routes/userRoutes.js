const express = require('express')
const router = express.Router()
const User = require('../modal/Users')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../components/middleware/authMiddleware');
//Register

const SECRET_KEY = process.env.SECRET_KEY

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ status: false, message: "All files are require" })

        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ status: false, message: "Email Already registered" });

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({ name, email, password: hashPassword });
        await newUser.save();

        return res.status(201).json({ status: true, message: "Register successful" })
    } catch (error) {
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message })
    }
})

//Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ status: false, message: "All files are require" })

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ status: true, message: "Invalid Credential" })
        }

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1hr' })

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000, //1 hr
        })

        return res.status(201).json({ status: true, message: "Login successful" })
    } catch (error) {
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message })
    }
})

//Profile
router.post('/profile', authMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        return res.status(201).json({ status: true, message: 'Profile Data', data: userData });

    } catch (error) {
        return res.status(400).json({ status: false, message: "Something went wrong", error: error.message })
    }
})

router.post("/logout", (req, res) => {
    res.clearCookie('authToken');
    res.status(201).json({ status: true, message: "logout success" })

})

module.exports = router;