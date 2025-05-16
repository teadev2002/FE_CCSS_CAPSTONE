import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { Button } from "antd";
import RefundService from "../../../services/RefundService/RefundService.js";

const RefundButton = ({ visible, onCancel, contractId }) => {
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setImages(selectedFiles);
  };

  const handleConfirmRefund = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await RefundService.sendRefund(
        contractId,
        price,
        description,
        images
      );
      console.log("Refund processed successfully:", response);

      setPrice("");
      setDescription("");
      setImages([]);
      onCancel(false);
    } catch (error) {
      setError("Failed to process refund. Please try again.");
      console.error("Refund error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        size="small"
        onClick={() => onCancel(true)}
        className="action-btn refund-btn"
      >
        Refund
      </Button>

      <Modal
        show={visible}
        onHide={() => onCancel(false)}
        centered
        className="refund-modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>Process Refund</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="refund-details">
            <p>
              <strong>Contract ID:</strong> {contractId || "N/A"}
            </p>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter the refund price"
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description for this refund"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {images.length > 0 && (
                <div className="mt-2">
                  <p>Selected Images: {images.length}</p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    {images.map((image, index) => (
                      <div key={index} style={{ textAlign: "center" }}>
                        <img
                          src={URL.createObjectURL(image)}
                          alt={image.name}
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <p style={{ fontSize: "12px", marginTop: "5px" }}>
                          {image.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <p>Are you sure you want to process this refund?</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="default" onClick={() => onCancel(false)}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleConfirmRefund}
            disabled={!price || loading}
            loading={loading}
          >
            Confirm Refund
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RefundButton;
