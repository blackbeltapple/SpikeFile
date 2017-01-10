const express = require('express');
const bodyParser = require('body-parser');
// var fileUpload = require('express-fileupload');
var s3 = require('s3');
var client = require('./s3init.js');

var multer = require('multer');
var upload = multer({dest: './forupload/'})


const app = express();

// app.use(fileUpload());
app.use(bodyParser.json());

app.get('/', function (req, res, next) {
  res.send('Hello World - Spike File');
});

// Node module: MULTER
// This does upload the file from the HTTP request and puts it in the 'dest' folder
// It gives it a hashed name. req.file gives us file details
// Sent test request using postman - attached file in boy with key 'filename', no headers set explicitly
// If not working correctly, try a new tab in postman with fresh request
app.post('/multer', upload.single('filename'), function (req, res, next) {
  console.log('req.file ', req.file);
});

// Node module: express-fileupload
// Low # downloads, so ditching this module
//
// app.post('/uploadfromrequest', function (req, res, next) {
//   console.log('HELLO')
//   console.log('req.files ', req.files);
//   // res.send('Watch the demo!');
// });

// S3 upload of file from local folder to S3 bucket worked fine.
app.get('/uploadlocal', function (req, res, next) {
  var params = {
  localFile: "forupload/benedict.jpg",
  s3Params: {
    Bucket: "blackbeltapple",
    Key: "benedict2.jpg",
    // other options supported by putObject, except Body and ContentLength.
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
  },
  };
  var uploader = client.uploadFile(params);
  uploader.on('error', function(err) {
  console.error("unable to upload:", err.stack);
  });
  uploader.on('progress', function() {
  console.log("progress", uploader.progressMd5Amount,
            uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
  console.log("done uploading");
  });
// res.send('Upload route');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening port 3000');
});
