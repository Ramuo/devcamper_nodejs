const express = require('express');
const {
    register, 
    login, 
    getMe,
    forgortPassword,
    resetPassword
} = require('../controllers/auth');


const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgortPassword);
router.put('/resetpassword/:resettoken', resetPassword);


module.exports = router;