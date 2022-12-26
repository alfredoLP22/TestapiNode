const { User } = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helper/jwt.helper');

const loginUser = async(req,res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({where: { username } });

    if ( !user ) {
        return res.status(404).json({
            ok: false,
            msg: 'User not found'
        });
    }
    
    const validPassword = bcrypt.compareSync( password, user.dataValues.password );
    
    if ( !validPassword ) {
        return res.status(400).json({
            ok: false,
            msg: 'Password not valid'
        });
    }

    const token = await generateJWT( user.dataValues.id );

    return res.status(200).json({
        ok: true,
        token
    });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Something wrong happens'
        });
    }
}

const registerUser = async(req,res) => {
    const { username, password, name } = req.body;

    const userExists = await User.findOne({where: { username } });

    if(userExists) {
        return res.json({
            ok: false,
            msg: `username ${username} are in used`
        });
    }
    try {
        const user = await User.create({username, password, name});
        
        const token = await generateJWT( user.dataValues.id );

        delete user.dataValues.password;

        return res.status(200).json({
            ok: true,
            msg: 'User registered',
            user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error in register action'
        })
    }
}

module.exports = {
    loginUser,
    registerUser
}