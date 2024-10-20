import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image) {
      setMessage("Name and image are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Image upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter image name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImageUpload;
