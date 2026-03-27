const router = require('express').Router();
const userController = require('../controllers/user_controller');
const authMiddleware = require('../middleware/auth_middleware');

router.post('/refresh', userController.refreshToken);

router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        status: true,
        user: req.user
    });
});
/*
1774435112 - 1774435052 = 60 seconds, i put it in 
*/

router.post("/signup", userController.userSignup);

router.post('/login', userController.userLogin);


module.exports = router;