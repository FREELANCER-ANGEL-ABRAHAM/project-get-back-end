const config = require('../config')
const aws = require('aws-sdk');
const nanoid = require('nanoid').nanoid;
const mime = require('mime');

const s3 = new aws.S3();

async function uploadFileToS3(fileToUpload) {
  const file = fileToUpload;
  if (!file) {
    throw {
      code: 'NO_FILE_PROVIDED',
      message: 'Please provide a file to upload',
    };
  }
  const fileExt = mime.getExtension(file.mimetype);
  const fileKey = `${nanoid()}.${fileExt}`;
  const fileURL = `https://${config.AWS_S3_BUCKET}.s3.amazonaws.com/${fileKey}`;

  await new Promise((resolve, reject) =>
    s3.putObject(
      {
        Bucket: config.AWS_S3_BUCKET,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
      function (err, resp) {
        err ? reject(err) : resolve(resp);
      },
    ),
  );

  return fileURL;
}

module.exports = { uploadFileToS3 };
