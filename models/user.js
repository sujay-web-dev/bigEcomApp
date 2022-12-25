const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required'],
        maxlength: [40, 'Name should be under 40 Characters']
    },
    email: {
        type: String,
        required: [true, 'Email is Required'],
        validate: [validator.isEmail, "Enter Valid Email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is Required'],
        minlength: [6, "Minimum 6 Char"],
        select: false
    },
    role: {
        type: String,
        default: 'user',
    },
    photo: {
        id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Encrypt password before save - HOOKS
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

// Validate the password with passed on user password
userSchema.methods.isValidatedPassword = async function (userSendPassword) {
    return await bcrypt.compare(userSendPassword, this.password)
}

// Create and Return JWT token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })
}

// Generate forgot password token (string)
userSchema.methods.getForgotPasswordToken = function () {
    // Generate a long and Random String
    const forgotToken = crypto.randomBytes(20).toString('hex');

    // Getting a hash - Make sure to get a hash on backend
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    // Time of Token
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000

    return forgotToken
}



module.exports = mongoose.model('User', userSchema)