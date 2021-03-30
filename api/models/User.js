const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = mongoose.model('User', new Schema({
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    role: { type: String, default: 'customer' },
    firstName: String,
    lastName: String,
    address: String,
    state: String,
    country: String,
    url: String,
    active: { type: Boolean, default: true }, 
}, {
    timestamps: true,
}))

module.exports = User