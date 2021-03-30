const express = require("express");
const { v2: cloudinary } = require("cloudinary");

const router = express.Router();

//TODO: a environment variable must be used here
//cloudinary.config(JSON.parse(process.env.CLOUDINARY_CONFIG));
cloudinary.config({
    cloud_name: "clothestore",
    api_key: "777218474427326",
    api_secret: "ZVFwj0S5HeRDkO8FBy8i--OVXJA",
  });
//CLOUDINARY_CONFIG

router.post("/", (req, res) => {
  uploadFileToCloudinary(req.body.folder, req.body.base64string).then((x) => {
      console.log(x)
    if (x.public_id) {
      res.status(200).send({ id: x.public_id, url: x.secure_url });
    } else {
      res.status(400).send(x);
    }
  })
  .catch(()=>{
    res.sendStatus(400);
  })
});

const uploadFileToCloudinary = async (folder, base64string) => {
  try {
    return await cloudinary.uploader.upload(base64string, {
      folder: folder,
    });
  } catch (e) {
    return e;
  }
};

module.exports = router;
// const { v2:cloudinary } = require('cloudinary')

// base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="

// //Cloudinary configuration
// cloudinary.config({
//     cloud_name: 'clothestore',
//     api_key: '777218474427326',
//     api_secret: 'ZVFwj0S5HeRDkO8FBy8i--OVXJA'
// })

// // cloudinary.uploader.upload('./my_image.png', (result, error) =>{
// //     console.log('-- RESULT --')
// //     console.log(result)
// //     console.log('-- ERROR --')
// //     console.log(error)
// // })
