const userService = require('../services/user_service');
const jwt = require('jsonwebtoken');

//is for : frontend can handle the req and res
class UserController {
    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({
                    status: false,
                    message: "Refresh token required"
                });
            }

            // VERIFY refresh token
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET
            );

            // generate new access token
            const newAccessToken = jwt.sign(
                { id: decoded.id },
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '1m' }
            );

            return res.status(200).json({
                status: true,
                accessToken: newAccessToken
            });

        } catch (err) {
            return res.status(401).json({
                status: false,
                message: "Invalid or expired refresh token"
            });
        }
    }

    static async userSignup(req, res, next) {
        try {
            const { userName, phoneNumber, email, password } = req.body;

            ///check required fields
            if (!userName && !phoneNumber && !email && !password) {
                return res.status(400).json({
                    status: false,
                    message: 'All fields are required!'
                });
            }
            ///check required fields
            if (!userName) {
                return res.status(400).json({
                    status: false,
                    message: 'Please enter your name!'
                });
            }
            ///check required fields
            if (!phoneNumber) {
                return res.status(400).json({
                    status: false,
                    message: 'Please enter your mobile number!'
                });
            }

            if (phoneNumber.length < 10) {
                return res.status(400).json({
                    status: false,
                    message: 'Mobile number should be 10!'
                });
            }

            ///check required fields
            if (!email) {
                return res.status(400).json({
                    status: false,
                    message: 'Email is required!'
                });
            }
            ///email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid email format!'
                });
            }

            ///check required fields
            if (!password) {
                return res.status(400).json({
                    status: false,
                    message: 'Password is required!'
                });
            }

            //Password validation
            if (password.length < 6) {
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


            const user = await userService.userSignup({ userName, phoneNumber, email, password });
            return res.status(201).json({ status: true, message: "User registered succesfully", data: user });
        } catch (err) {
            //Duplicate email checker
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue)[0];

                const fieldName = field == 'email' ? 'Email' : field == 'phoneNumber' ? 'Phone number' : field;
                return res.status(400).json({
                    status: false,
                    message: `${fieldName} already exists`
                });
            }

            return res.status(500).json({
                status: false,
                message: "User is not registered",
                error: err.message,
            });
        }
    }

    static async userLogin(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email && !password) {
                return res.status(400).json({
                    status: false,
                    message: 'Email and password is required!'
                });
            }

            if (!email) {
                return res.status(400).json({
                    status: false,
                    message: 'Email is required!'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid email format!'
                })
            }

            if (!password) {
                return res.status(400).json({
                    status: false,
                    message: 'Password is required!'
                });
            }

            //Password validation
            if (password.length < 6) {
                return res.status(400).json({
                    status: false,
                    message: 'Password must be at least 6 characters'
                });
            }

            const user = await userService.userLogin({ email, password });

            return res.status(200).json({
                status: true,
                message: 'Login Successfully',
                data: { user: user.user, accessToken: user.accessToken, refreshToken: user.refreshToken },

            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                // message: 'Account not found! Create a account first!',
                message: err.message,
            });
        }
    }
}

module.exports = UserController;