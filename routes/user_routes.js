const router = require('express').Router();
const userController = require('../controllers/user_controller');

router.post("/signup", userController.userSignup);

router.post('/login', userController.userLogin);

module.exports = router;