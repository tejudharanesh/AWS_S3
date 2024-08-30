// models/File.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // If you have a user system
  file_name: String,
  file_type: String,
  file_size: Number,
  s3_url: String,
  upload_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
