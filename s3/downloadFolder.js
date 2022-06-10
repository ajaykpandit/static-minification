const {minifyJS} = require('../newMinifier');
// SETTINGS
const AWS_KEY = '<aws_key>';
const AWS_SECRET = '<aws_secret>';
const BUCKET = '<bucket>';
const PREFIX = '<prefix>';

const async = require('async');
const fs = require('fs');
const AWS = require('aws-sdk');


AWS.config.update({accessKeyId: AWS_KEY, secretAccessKey: AWS_SECRET});
var s3 = new AWS.S3();

const params = {
    Bucket: BUCKET,
    Prefix: PREFIX
}

s3.listObjects(params, function (err, data) {
    if (err) return console.log(err);

    async.eachSeries(data.Contents, function (fileObj, callback) {
        var key = fileObj.Key;
        console.log('Downloading: ' + key);

        var fileParams = {
            Bucket: BUCKET,
            Key: key
        }

        s3.getObject(fileParams, async function (err, fileContents) {
            if (err) {
                callback(err);
            } else {
                // Read the file
                var contents = fileContents.Body.toString();

                
                await fs.writeFileSync(key, contents);
                try {
                    await minifyJS(key);
                } catch (e) {
                    console.log(e.toString());
                }
                callback();
            }
        });
    }, function (err) {
        if (err) {
            console.log('Failed: ' + err);
        } else {
            console.log('Finished');
        }
    });
});
