// UploadForm.js
import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const handleImageChange = (e) => setImage(e.target.files[0]);
  const handleVideoChange = (e) => setVideo(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Files uploaded successfully:", res.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div>
        <label>Upload Video:</label>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
      </div>
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadForm;
