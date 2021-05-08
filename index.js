const express = require('express');
const bodyParser= require('body-parser')
const multer = require('multer');
fs = require('fs-extra');
var cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/form.html');
})

  // SET STORAGE
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
  
  var upload = multer({ storage: storage })

  app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
      console.log(req.file.originalname);
    var finalImg = {
          contentType: req.file.mimetype,
          image:  new Buffer(encode_image, 'base64')
      };


    var imgupload = req.file.originalname;
    var tmp = imgupload.split('.');
    var fileExten = tmp[tmp.length - 1];
    var imgName = tmp[0];

    cloudinary.uploader.upload("data:image/png;base64,"+encode_image, 
        {resource_type: "image", public_id: "myfolder/mysubfolder/"+imgName,
        overwrite: true, notification_url: "https://mysite.example.com/notify_endpoint"},
        function(error, result) {console.log(result, error)});
      // aplicar efeito e devolver
      var img =  cloudinary.image("myfolder/mysubfolder/"+imgName+"."+fileExten, { effect: "pixelate_faces"})
      res.send(img)  
  })

  app.post('/uploadphoto', upload.single('picture'), (req, res) => {
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');
    // Define a JSONobject for the image attributes for saving to database
      
    var finalImg = {
          contentType: req.file.mimetype,
          image:  new Buffer(encode_image, 'base64')
      };
    db.collection('quotes').insertOne(finalImg, (err, result) => {
        console.log(result)
    
        if (err) return console.log(err)
    
        console.log('saved to database')
        res.redirect('/')
      
        
      })
})
  

app.listen(3000, function () {
  console.log('Starting hello-world server...PEPESSRU');
})
