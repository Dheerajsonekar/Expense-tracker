const AWS = require("aws-sdk");

exports.uploadToS3 = async (data, filename) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const ACCESS_KEY = process.env.ACCESS_KEY;
  const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

  const s3bucket = new AWS.S3({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  });

  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };

    const s3response = await new Promise((resolve, reject) => {
      s3bucket.upload(params, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });

    console.log("File successfully uploaded to S3:", s3response.Location);
    return s3response.Location; // Return the file URL
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw error;
  }
};
