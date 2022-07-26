const env = require('dotenv')
const jwt = require('jsonwebtoken');
env.config();

const authenticateToken = (req, res, next) => {
    const { authorization } = req.headers;
    const token =  authorization && authorization.split(' ')[1];
    if (token == null) return res.sendStatus(401) 
    
    jwt.verify(token, process.env.ACCES_TOKEN_SECRET, (err, user) =>{
        if (err) return res.sendStatus(403)
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;