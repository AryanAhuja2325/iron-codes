const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isAlphanumeric(value);
            },
            message: 'Username must be alphanumeric'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: 'Requires proper email format'
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isStrongPassword(value);
            },
            message: 'Password is not strong enough'
        }
    },
    linkedin: {
        type: String,
        default: null,
        validate: {
            validator: function (value) {
                if (value)
                    return validator.isURL(value);
                return true;
            },
            message: 'Not a valid URL'
        }
    },
    github: {
        type: String,
        default: null,
        validate: {
            validator: function (value) {
                if (value)
                    return validator.isURL(value);
                return true;
            },
            message: 'Not a valid URL'
        }
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getJwt = function () {
    return jwt.sign(
        { id: this._id },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
    );
};
module.exports = mongoose.model('User', userSchema);