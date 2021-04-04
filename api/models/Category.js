const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Category = mongoose.model('Category', new Schema({
    name: String,
    url: String,
    active: Boolean, 
},{
    timestamps: true,
}))

module.exports = Category