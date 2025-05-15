import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { Button } from "antd";

const ViewRefundButton = ({
  refund,
  showModal,
  setShowModal,
  setSelectedRefund,
}) => {
  // State to manage Price, Description, and Images
  const [price, setPrice] = useState(refund?.price || "");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [reason, setReason] = useState(""); // For the "Reason for Refund" field

  const handleOpenModal = () => {
    setSelectedRefund(refund);
    setShowModal(true);
    // Pre-fill the Price field with the refund's price
    setPrice(refund?.price || "");
    // Reset other fields when opening the modal
    setDescription("");
    setImages([]);
    setReason("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRefund(null);
    // Reset form fields when closing the modal
    setPrice("");
    setDescription("");
    setImages([]);
    setReason("");
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
  };

  const handleConfirmRefund = () => {
    // Log the entered values (replace this with an API call to process the refund)
    console.log(`Processing refund for ID: ${refund.contractRefundId}`);
    console.log("Price:", price);
    console.log("Description:", description);
    console.log("Images:", images);
    console.log("Reason for Refund:", reason);

    // You can add API call logic here, e.g.:
    // const formData = new FormData();
    // formData.append("price", price);
    // formData.append("description", description);
    // formData.append("reason", reason);
    // images.forEach((image, index) => {
    //   formData.append(`image-${index}`, image);
    // });
    // await api.processRefund(refund.contractRefundId, formData);

    handleCloseModal();
  };

  return (
    <>
      <Button
        type="primary"
        size="small"
        onClick={handleOpenModal}
        className="action-btn refund-btn"
      >
        Refund
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="refund-modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>Process Refund</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {refund ? (
            <div className="refund-details">
              <p>
                <strong>Refund ID:</strong> {refund.contractRefundId}
              </p>
              <p>
                <strong>Contract ID:</strong> {refund.contractId}
              </p>
              <p>
                <strong>Status:</strong> {refund.status}
              </p>

              {/* Price Input */}
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

              {/* Description Input */}
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

              {/* Images Input */}
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
                    <ul>
                      {images.map((image, index) => (
                        <li key={index}>{image.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>

              <p>Are you sure you want to process this refund?</p>
            </div>
          ) : (
            <p>No refund selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="default" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleConfirmRefund}
            disabled={!price || !reason} // Disable button if Price or Reason is empty
          >
            Confirm Refund
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewRefundButton;
