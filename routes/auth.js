const express = require('express')
const router = express.Router()
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const verifyToken = require('../middleware/auth')

const User = require('../models/user')

// get
router.get('/', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user)
            return res.status(400).json({ success: false, message: 'user not found' })
        res.json({ success: true, user })
    } catch (error) {

    }
})

// post
router.post('/register', async (req, res) => {

    const { username, password } = req.body
    if (!username || !password)
        return res.status(400).json({ success: false, message: 'Missing username and/or password' })

    try {
        const user = await User.findOne({ username })
        if (user)
            return res
                .status(400)
                .json({ success: false, message: 'username already taken' })

        const hashedPassword = await argon2.hash(password)
        const newUser = new User({ username, password: hashedPassword })
        await newUser.save()

        const accessToken = jwt.sign({
            userId: newUser._id
        }, process.env.ACCESS_TOKEN_SECRET)

        res.json({
            success: true,
            message: 'User created successfully',
            accessToken
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Có lỗi gì đó' })
    }
})

// login

router.post('/login', async (req, res) => {

    const { username, password } = req.body

    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: 'Missing username and/or password' })

    try {
        const user = await User.findOne({ username })
        if (!user)
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'Incorrect username or password'
                })

        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid)
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'Incorrect username or password'
                })

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)
        res
            .json({
                success: true,
                message: 'Đăng nhập thành công',
                accessToken
            })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal server error' })
    }


})


module.exports = router
