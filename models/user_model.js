const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
        unique: true,
        required:  true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
}, { timestamps: true });

//HASH THE PASSWORD BEFORE TO DATABASE
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified("password")) return;

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

     
    } catch (err) {
        throw err;
    }
});

// for login camparing the password
userSchema.methods.comparePassword = async function(userPassword) {
    try {
       return await bcrypt.compare(userPassword, this.password);
    } catch (err) {
        throw err;
    }
}

module.exports = mongoose.model("UserModel", userSchema);