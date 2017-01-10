const express = require('express');
const bodyParser = require('body-parser');
var s3 = require('s3');
var client = require('./s3init.js');


const app = express();

app.use(bodyParser.json())

app.get('/', function (req, res, next) {
  res.send('Hello World - Spike File');
});

app.get('/demo', function (req, res, next) {
  res.send('Watch the demo!');
});

app.get('/upload', function (req, res, next) {
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
