const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Product = mongoose.model('Product', new Schema({
    code: { type:String, require: true, unique: true, index:true, trim: true },
    name: { type:String, require: true, trim: true },
    description: { type:String, trim: true }, 
    classification: String,
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' }, 
    size: [String],
    stock: Number,
    price: Number,
    active: { type:Boolean, default: true }, 
    pictures: [{ name:String, url:String }]
}, {
    timestamps:true
}))

module.exports = Product