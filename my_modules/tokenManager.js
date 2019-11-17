const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const createToken = function (id) {
    return new Promise(resolve => {
        const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), id: id }, process.env.JWT_PRIVATE_KEY);
        resolve(token)
    })
}

const getPayload = (token) => {
    return new Promise(resolve =>{
            const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
            resolve(payload);
    })
}

const checkToken = (req, res) => {
    return new Promise(resolve =>{
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if(typeof bearerHeader !== 'undefined') {
          // Split at the space
          const bearer = bearerHeader.split(' ');
          // Get token from array
          const bearerToken = bearer[1];
          // Set the token
          resolve(bearerToken);
        } else {
          // Forbidden
          res.sendStatus(403);
        }
    })
}

async function verifyToken(req, res, next) {
    try {
        const token = await checkToken(req, res);
        const payload = await getPayload(token);
        res.locals.user = payload.id;
        next();
    } catch (err) {
        console.log(err)
        res.sendStatus(403);
    }
}

exports.createToken = createToken;
exports.verifyToken = verifyToken;