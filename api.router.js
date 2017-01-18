const express = require('express');
var AWS = require('aws-sdk');
var router = express.Router();

// This is a router that is using the asw-sdk node module which is the offical Amazon module
var s3 = new AWS.S3();

router.get('/uploadusingsdk', function (req, res, next) {
  res.send('api route')
  var myBucket = 'blackbeltapple';
  var myKey = 'benedict88.jpg';

  // s3.createBucket({Bucket: myBucket}, function(err, data) {
  //   if (err) {
  //    console.log(err);
  //   } else {
     params = {Bucket: myBucket, Key: myKey, Body: 'Hello!'};
     s3.putObject(params, function(err, data) {
         if (err) {
             console.log(err)
         } else {
             console.log('Successfully uploaded data to ', myBucket, myKey);
         }
      });
  //   }
  // });
});


module.exports = router;
