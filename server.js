const express = require('express');
const bodyParser = require('body-parser');
// var fileUpload = require('express-fileupload');
var s3 = require('s3');
var client = require('./s3init.js');
var apiRouter = require('./api.router')

var multer = require('multer');
var upload = multer({dest: './forupload/'})


const app = express();

// app.use(fileUpload());
app.use(bodyParser.json());

app.get('/', function (req, res, next) {
  res.send('Hello World - Spike File');
});

// Node module: MULTER
// This route tests multer
// This does upload the file from the HTTP request and puts it in the 'dest' folder on local machine (/for upload)
// It gives it a hashed name.
// Sent test request using postman:  attach file in body (in 'form-data' mode) with key 'filename'. No headers set explicitly
// If not working correctly, try a new tab in postman with fresh request
// req.file returns us the following file details:
// {
//   "fieldname": "filename",
//   "originalname": "egghead-react-cheat-sheet-0-14-7.pdf",
//   "encoding": "7bit",
//   "mimetype": "application/pdf",
//   "destination": "./forupload/",
//   "filename": "c328ee52c1607a82d52d27e819a97ecb",
//   "path": "forupload/c328ee52c1607a82d52d27e819a97ecb",
//   "size": 265151
// }
app.post('/multer', upload.single('filename'), function (req, res, next) {
  console.log('req.file ', req.file);
  res.send({reqfile: req.file})
});


// Node module: express-fileupload
// Low # downloads, so not going to use this module
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
      Key: "wednesday0700xd.jpg",
      // other options supported by putObject, except Body and ContentLength.
      // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
    },
  };
  var uploader = client.uploadFile(params);
  uploader.on('error', function(err) {
    console.error("Unable to upload. Error summary: ", err.statusCode, err.message);
    console.log("Full error: ", err);
  });
  uploader.on('progress', function() {
    // console.log("progress", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function(file) {
    console.log("done uploading: ", file);
  });
// res.send('Upload route');
});

app.use('/api', apiRouter);

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening port 3000');
});
