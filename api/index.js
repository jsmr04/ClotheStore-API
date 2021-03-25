//Libraries
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

//Routes
const categories = require('./routes/categories')

const app = express()

//Plugins
app.use(bodyParser.json())
app.use(cors())

//Connect to mongo atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false })

//Apply routes
app.use('/api/categories', categories)

// app.get('*', (req, res)=>{
//     res.send('HELLO!')
// })

module.exports = app