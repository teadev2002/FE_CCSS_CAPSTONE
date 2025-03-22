import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

const CharacterImageManager = ({ images, setImages }) => {
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (newImageUrl) {
      const newImage = {
        imageId: `IMG${Date.now()}`,
        urlImage: newImageUrl,
      };
      setImages([...images, newImage]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="image-management">
      <h4>Images</h4>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <TextField
          label="Add Image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddImage}
          style={{ marginLeft: 8 }}
          disabled={!newImageUrl}
        >
          Add
        </Button>
      </div>
      <div className="image-preview" style={{ display: "flex" }}>
        {images.map((image, index) => (
          <div key={index} className="image-preview-item">
            <img
              src={image.urlImage}
              alt={`Character ${index + 1}`}
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                marginRight: 8,
              }}
            />
            <IconButton onClick={() => handleRemoveImage(index)} color="error">
              🗑️
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterImageManager;
