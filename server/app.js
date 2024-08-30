// app.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const dotenv = require("dotenv");
const File = require("./models/File");

dotenv.config({ path: "../.env" });

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Configure AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload route
app.post(
  "/upload",
  upload.fields([{ name: "image" }, { name: "video" }]),
  async (req, res) => {
    console.log("received");

    try {
      const files = req.files;

      const filePromises = Object.keys(files).map(async (key) => {
        const file = files[key][0];

        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${Date.now()}_${file.originalname}`,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: "public-read", // This makes the file publicly accessible
        };

        const data = new PutObjectCommand(params);
        const response = await s3.send(data);

        const newFile = new File({
          file_name: file.originalname,
          file_type: file.mimetype,
          file_size: file.size,
          s3_url: data.Location,
        });

        await newFile.save();

        return newFile;
      });

      const uploadedFiles = await Promise.all(filePromises);

      res.json({
        message: "Files uploaded successfully",
        files: uploadedFiles,
      });
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
