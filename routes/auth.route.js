const Router = require('express');
const { check } = require('express-validator');
const { loginUser, registerUser } = require('../controllers/auth.controller');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [], loginUser);
router.post('/register',
    [ 
        check('username','username is required to register your profile').not().isEmpty(),
        check('name','name is not provide to register').not().isEmpty(),
        check('password','name is not provide to register').not().isEmpty(),
        validateFields
    ],
    registerUser
);

module.exports = router;