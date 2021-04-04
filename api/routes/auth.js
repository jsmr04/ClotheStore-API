const express = require("express");
const crypto = require("crypto");
const Users = require("../models/User");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//constants
const ITERATIONS = 10000;
const KEYLEN = 64;
const ENCRYPTION_METHOD = "sha1";
const ONE_YEAR = 60 * 60 * 24 * 365; // One year in seconds

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  //Generate salt
  crypto.randomBytes(16, (error, salt) => {
    const newSalt = salt.toString("base64");

    //Generate encrypted password
    crypto.pbkdf2(
      password,
      newSalt,
      ITERATIONS,
      KEYLEN,
      ENCRYPTION_METHOD,
      (error, key) => {
        const encryptedPassword = key.toString("base64");

        //Try to find user
        Users.findOne({ email })
          .exec()
          .then((user) => {
            if (user) {
              return res.status(400).send("This user already exists");
            }

            //Create new user
            User.create({
              email,
              password: encryptedPassword,
              salt: newSalt,
            }).then(() => {
              res.send("User created successfully");
            });
          });
      }
    );
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    //Get user
    .then((user) => {
      if (!user) {
        return res.status(400).send("User and password do not match");
      }

      //Encrypt password using salt
      crypto.pbkdf2(
        password,
        user.salt,
        ITERATIONS,
        KEYLEN,
        ENCRYPTION_METHOD,
        (error, key) => {
          const encryptedPassword = key.toString("base64");
          //Validate encrypted password
          if (user.password === encryptedPassword) {
            const token = signToken(user._id);
            return res.send({ _id:user._id, token });
          }else{
            return res.status(400).send("User and password do not match");
          }
        }
      );
    });
});

router.put("/user-info/", (req, res) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const address = req.body.address;
  const state = req.body.state;
  const country = req.body.country;
  const city = req.body.city;
  const zip = req.body.zip;
  const url = req.body.url;

  const userData = {
    firstName,
    lastName,
    address,
    state,
    country,
    city,
    zip,
    url,
  };

  console.log(userData)

  User.findOne({ email }).then((user) => {
    if (user) {
      User.findOneAndUpdate({ email }, userData).then(() => {
        res.sendStatus(200);
      });
    } else {
      res.status(400).send("User does not exist")
    }
  });
});

router.get("/user-info/", (req, res) => {
  User.find()
    .exec()
    .then((users) => {
      const newUsers = users.map((user) => {
        const newUser = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          address: user.address,
          country: user.country,
          city: user.city,
          state: user.state,
          url: user.url,
          active: user.active,
          role: user.role,
          zip: user.zip,
        };

        return newUser;
      });

      res.send(newUsers);
    });
});

router.get("/user-info/:id", (req, res) => {

  User.findById(req.params.id)
    .exec()
    .then((user) => {
        
      if (!user){
        return res.status(400).send("User does not exist")
      }  

      const newUser = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        address: user.address,
        country: user.country,
        city: user.city,
        state: user.state,
        url: user.url,
        active: user.active,
        role: user.role,
        zip: user.zip,
      };

      res.send(newUser);
    });
});

const signToken = (_id) => {
  return jwt.sign({ _id }, "secret", {
    expiresIn: ONE_YEAR,
  });
};

module.exports = router;
