const jwt = require('jsonwebtoken');

const validatedJWT = (req, res, next) => {

    // Leer el Token
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'Token are not provide in request'
        });
    }

    try {
        
        const { uuid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uuid = uuid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token are not valid'
        });
    }
 
}
module.exports = {
    validatedJWT
}