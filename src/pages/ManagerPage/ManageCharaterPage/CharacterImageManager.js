//boot
import React, { useState } from "react";
import Button from "react-bootstrap/Button";

const CharacterImageManager = ({ imageFiles, setImageFiles, disabled }) => {
  const [previews, setPreviews] = useState([]);

  const handleAddFiles = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = [...(imageFiles || []), ...files];
    setImageFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = (imageFiles || []).filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setPreviews(newPreviews);
  };

  return (
    <div className="image-management">
      <h4>Images</h4>
      <div className="d-flex align-items-center mb-3">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleAddFiles}
          disabled={disabled}
          className="form-control me-2"
          style={{ width: "auto" }}
        />
      </div>
      <div className="image-preview d-flex flex-wrap">
        {previews.map((preview, index) => (
          <div key={index} className="image-preview-item me-2 mb-2">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="img-thumbnail"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
              }}
            />
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemoveFile(index)}
              disabled={disabled}
              className="mt-1"
            >
              🗑️
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterImageManager;
