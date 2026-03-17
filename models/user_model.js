const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userModel = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

//HASH THE PASSWORD BEFORE TO DATABASE
userModel.pre('save', async function (next) {
    try {
        if (!this.isModified("password")) return;

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        
    } catch (err) {
        throw err;
    }
});

module.exports = mongoose.model("UserModel", userModel);