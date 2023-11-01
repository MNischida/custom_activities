const JWT = require('jsonwebtoken');

module.exports = (body) => {
    if (!body) {
        return new Error('Invalid jwtdata');
    }

    return JWT.verify(body.toString('utf8'), process.env.JWT, {
        algorithm: 'HS256'
    });
};