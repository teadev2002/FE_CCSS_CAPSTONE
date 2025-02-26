import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";

const CharacterRequestModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    characterName: "",
    description: "",
    images: [],
    requestDate: new Date().toLocaleDateString("en-GB"), // Format as dd/mm/yyyy
    agreeToTerms: false,
  });

  const handleImageChange = (e) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: [...Array.from(e.target.files)],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Character Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Character Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter character name"
              value={formData.characterName}
              onChange={(e) =>
                setFormData({ ...formData, characterName: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter character description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Character Images</Form.Label>
            <div className="upload-container">
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <div className="upload-icon">
                <Upload size={24} />
              </div>
            </div>
            {formData.images.length > 0 && (
              <small className="text-muted">
                {formData.images.length} file(s) selected
              </small>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Request Date</Form.Label>
            <Form.Control
              type="text"
              value={formData.requestDate}
              readOnly
              className="bg-light"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Agree to terms: request must be submitted 1 month in advance"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreeToTerms: e.target.checked })
              }
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!formData.agreeToTerms}
            >
              Submit Request
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CharacterRequestModal;
