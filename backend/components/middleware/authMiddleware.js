const User = require('../../modal/Users')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

const authMiddleware = async (req, res, next) => {

    try {
        const token = req?.cookies?.authToken
        if (!token) return res.status(400).json({ status: false, message: "Access Denied" })

        jwt.verify(token, SECRET_KEY, async (err, decode) => {
            const user = await User.findById(decode?.id)
            if (!user) return res.status(400).json({ status: false, message: "Invalid Token" })

            req.user = {
                id: user?.id,
                name: user?.name,
                email: user?.email
            }
            next();
        })
    } catch (error) {
        return res.status(400).json({ status: false, message: 'Something went wrong', error: error.message });
    }

}

module.exports = authMiddleware;