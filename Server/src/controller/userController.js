const router = require('express').Router();
const env = require('dotenv')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const authenticateToken = require('../utils/auth');

const refreshTokens = [];
env.config();

const isValidString = input => {
    return input != null && typeof input === 'string' && input.trim().length > 0;
}

const generateAccessToken = user => {
    return jwt.sign(user, process.env.ACCES_TOKEN_SECRET, { expiresIn: '15m' });
}

const generateRefreshToken = user => {
    const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(token);
    return token;
}

router.get('/validate', authenticateToken, (req, res) => {
    return res.status(200).json(req.user);
})

router.get('/all', async (req, res) => {
    const all = await User.find({});
    return res.status(200).json(all);
 })

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!isValidString(name) || !isValidString(email) || !isValidString(password)){
        return res.status(400).send('Invalid input');
    } 
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await new User({
            name: name,
            email: email,
            password: hashedPassword,
        }).save();
        return res.status(201).json(user);
    } catch (error) {
        return res.status(400).send(error);
    }
})

router.delete('/logout', (req, res) => {
    const { token } = req.body;
    if (!token || token == null) return res.sendStatus(401);
    refreshTokens = refreshTokens.filter(refreshToken => refreshToken !== token)
    res.sendStatus(204)
})

router.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token || token == null) return res.sendStatus(401);
    if (!refreshTokens.includes(token)) return res.sendStatus(403);
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
        if (err) return res.sendStatus(403);
        const accessToken =  generateAccessToken({ name: user.name });
        res.status(200).json({ accessToken: accessToken })
    })
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!isValidString(email) || !isValidString(password)) return res.sendStatus(400);
    
    try {
        const user = await User.findOne({ email });
        if (user != null && await bcrypt.compare(password, user.password)) {
            const accessToken = generateAccessToken(user.toJSON());
            const refreshToken = generateRefreshToken(user.toJSON());
            return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
        } else 
        return res.sendStatus(400) ;
    } catch (error) {
        return res.status(400).send(error);
    } 
})

module.exports = router;