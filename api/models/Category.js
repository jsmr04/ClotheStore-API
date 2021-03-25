const mongoose = require('mongoose')
const Schema = mongoose.Schema


const Category = mongoose.model('Category', new Schema({
    name: String,
    dateTime: String,
    url: String,
    active: Boolean, 
}))

module.exports = Category