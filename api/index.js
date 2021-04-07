//Libraries
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

//Routes
const categories = require('./routes/categories')
const storage = require('./routes/storage')
const auth = require('./routes/auth')
const products = require('./routes/products')
const orders = require('./routes/orders')
const statistics = require('./routes/statistics')

const app = express()

//Plugins
app.use(bodyParser.json( { limit: '50mb' } ) )
app.use(cors())

//Connect to mongo atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false, useCreateIndex:true })

//Apply routes
app.use('/api/categories', categories)
app.use('/api/storage', storage)
app.use('/api/auth', auth)
app.use('/api/products', products)
app.use('/api/orders', orders)
app.use('/api/statistics', statistics)

module.exports = app