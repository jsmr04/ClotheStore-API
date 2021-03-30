const express = require('express')
const crypto = require('crypto')
const Users = require('../models/User')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

router.post('/register', async (req, res)=>{
    const {email, password} = req.body

    //Generate salt
    crypto.randomBytes (16, (error, salt) =>{
        const newSalt = salt.toString('base64')

        //Generate encrypted password
        crypto.pbkdf2(password, newSalt, 10000, 64, 'sha1', (error, key)=>{
            const encryptedPassword = key.toString('base64')

            //Try to find user
            Users.findOne({ email }).exec()
            .then(user => {
                if (user){
                    return res.send('This user already exists')
                }

                //Create new user
                User.create({ email, password: encryptedPassword, salt: newSalt })
                .then(()=>{
                    res.send('User created successfully')
                })
            })
        })
    })
})

router.post('/signin', ()=>{
    const { email, password } = req.body
    User.findOne({ email })
    .then(() =>{
        if(!user){
            return res.send('User and password do not match')
        }

        crypto.pbkdf2(password, user.salt, 10000, 64, 'sha1', (error, key) =>{
            const encryptedPassword = key.toString('base64')
            if (user.password === encryptedPassword){
                const token = signToken(user._id)
                return res.send({ token })
            }

        })
    })
})

const signToken = (_id)=>{
    return jwt.sign({ _id }, 'secret', {
        expiresIn: 60 * 60 * 24 * 365,
    })   
}

module.exports = router