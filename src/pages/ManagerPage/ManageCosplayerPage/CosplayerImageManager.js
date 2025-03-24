// src/components/CosplayerImageManager.jsx
import React, { useState } from "react";
import { Form, Button, CloseButton } from "react-bootstrap";

const CosplayerImageManager = ({ images, setImages }) => {
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
      <div className="d-flex align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Add Image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          className="me-2"
        />
        <Button
          variant="primary"
          onClick={handleAddImage}
          disabled={!newImageUrl}
        >
          Add
        </Button>
      </div>
      <div className="image-preview d-flex">
        {images.map((image, index) => (
          <div key={index} className="image-preview-item">
            <img
              src={image.urlImage}
              alt={`Cosplayer ${index + 1}`}
              className="preview-image"
            />
            <CloseButton onClick={() => handleRemoveImage(index)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CosplayerImageManager;
