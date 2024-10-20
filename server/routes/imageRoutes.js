const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const Image = require("../models/imageModel");
const router = express.Router();
const path = require("path");

// S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to upload image
router.post("/upload", upload.single("image"), async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  if (!file || !name) {
    return res.status(400).json({ message: "Image and name are required" });
  }

  // Upload to S3
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_${path.extname(file.originalname)}`, // File name
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const s3Response = await s3.upload(params).promise();
    const imageUrl = s3Response.Location;

    // Save metadata to MongoDB
    const newImage = new Image({ name, imageUrl });
    await newImage.save();

    res.status(201).json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    console.error("Error uploading to S3:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

module.exports = router;
