const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //Get the Token from the Header
    const token = req.header('x-auth-token');

    //Check if not Token
    if (!token) {
        return res.status(401).json({ msg: 'No Token, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.account = decoded.account;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid.' });
    }
}