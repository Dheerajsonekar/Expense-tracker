const AWS = require("aws-sdk");



exports.uploadToS3 = async (data, filename) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const ACCESS_KEY = process.env.ACCESS_KEY;
    const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;
  
    const s3bucket = new AWS.S3({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_ACCESS_KEY,
    });
  
    s3bucket.createBucket(() => {
      const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read",
      };
      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log("something went wrong", err);
        } else {
          console.log("success", s3response);
          return s3response.Location;
        }
      });
    });
  }