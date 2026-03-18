const userModel = require('../models/user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserService {
    static async userSignup({ userName, phoneNumber, email, password }) {
        try {
            const createUser = new userModel({ userName, phoneNumber, email, password });
            return await createUser.save();
        } catch (err) {
            throw err;
        }
    }

    static async userLogin({ email, password }) {
        //find email from database and Hide password in response
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error('User not found!');
        }

        ///Single method -1 (without function model - not safe)
        // const isMatch = await bcrypt.comparePassword(password, user.password);

        ///from model file
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid password!');
        }

        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        //remove password before sending response
        user._doc.password = undefined;

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    static generateAccessToken(user) {
        return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
    }

    static generateRefreshToken(user) {
        return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    }
}

module.exports = UserService;