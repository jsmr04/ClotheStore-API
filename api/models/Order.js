const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Order = mongoose.model('Order', new Schema({
    orderId: { type:String, require: true, unique: true, index:true, trim: true },
    address: String,
    cardCVV: Number,
    cardExpDate: String,
    cardName: String,
    cardNumber: String,
    city : String,
    country: String,
    email: String,
    fullName: String,
    items: [{ product_id:{ type: Schema.Types.ObjectId, ref: 'User' }, 
              code: String, 
              name: String, 
              price: Number, 
              quantity: Number, 
              size: String,
              subTotal: Number,
            }],
    shippingFee: Number,
    state: String,
    status: String,
    subTotal: Number,
    tax: Number,
    total: Number,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' }, 
    zip: String,
},{
    timestamps: true,
}))

module.exports = Order