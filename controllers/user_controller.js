const userService = require('../services/user_service');

class UserController {
    static async register(req, res, next) {
        try {
            const { email, password } = req.body;

            ///check required fields
            if (!email && !password) {
                return res.status(400).json({
                    status: false,
                    message: 'Email and Password is required!'
                });
            }
            ///check required fields
            if (!email && password) {
                return res.status(400).json({
                    status: false,
                    message: 'Email is required!'
                });
            }
            ///email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                return res.status(400).json({
                    status: false,
                    message: 'Invalid email format!'
                });
            }

            ///check required fields
            if (email && !password) {
                return res.status(400).json({
                    status: false,
                    message: 'Password is required!'
                });
            }

            //Password validation
            if(password.length < 6) {
                return res.status(400).json({
                    status: false,
                    message: 'Password must be at least 6 characters'
                });
            }
            ///check required fields
            if (!email || !password) {
                return res.status(400).json({
                    status: false,
                    message: 'Incorrect email and password!'
                });
            }


            const user = await userService.registerUser({ email, password });
            res.status(201).json({ status: true, message: "User registered succesfully", data: user });
        } catch (err) {
            //Duplicate email checker
            if (err.code === 11000){
                return res.status(400).json({
                    status: false,
                    message: 'Email already exists'
                });
            }

            res.status(500).json({
                status: false,
                message: "User is not registered",
                error: err.message,
            });
        }
    }
}

module.exports = UserController;