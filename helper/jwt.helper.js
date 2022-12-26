const jwt = require('jsonwebtoken');

const generateJWT = (uuid) => {
    return new Promise( (resolve,reject) => {
        
        const payload = {
            uuid,
        }

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '24h'
        }, (err,token) =>{
            if(err) {
                console.log(err);
                reject('Can not generate json web token');
            }else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJWT
}