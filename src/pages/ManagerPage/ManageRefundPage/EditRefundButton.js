import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { Button } from "antd";

const EditRefundButton = ({
  refund,
  showModal,
  setShowModal,
  setSelectedRefund,
}) => {
  const [formData, setFormData] = useState({
    numberBank: refund?.numberBank || "",
    bankName: refund?.bankName || "",
    accountBankName: refund?.accountBankName || "",
    price: refund?.price || 0,
    description: refund?.description || "",
    status: refund?.status || "Pending",
  });

  const [images, setImages] = useState([]); // State for image files

  const handleOpenModal = () => {
    setSelectedRefund(refund);
    setShowModal(true);
    setFormData({
      numberBank: refund?.numberBank || "",
      bankName: refund?.bankName || "",
      accountBankName: refund?.accountBankName || "",
      price: refund?.price || 0,
      description: refund?.description || "",
      status: refund?.status || "Pending",
    });
    setImages([]);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRefund(null);
    setImages([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
  };

  const handleSaveChanges = () => {
    const updatedData = {
      ...formData,
      images: images,
    };
    console.log("Updated refund data:", updatedData);
    handleCloseModal();
  };

  return (
    <>
      <Button
        type="default"
        size="small"
        onClick={handleOpenModal}
        className="action-btn edit-btn"
      >
        Edit
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="refund-modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Refund</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {refund ? (
            <div className="refund-details">
              <Form>
                <div className="two-column-layout">
                  {/* Left Column: Bank-related fields */}
                  <div className="column-left">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label>Bank Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="numberBank"
                          value={formData.numberBank}
                          onChange={handleInputChange}
                          placeholder="Enter bank number"
                        />
                      </Form.Group>{" "}
                      <Form.Group className="mb-3">
                        <Form.Label>Bank Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          placeholder="Enter bank name"
                        />
                      </Form.Group>
                    </div>
                    <Form.Group className="mb-3">
                      <Form.Label>Account Holder</Form.Label>
                      <Form.Control
                        type="text"
                        name="accountBankName"
                        value={formData.accountBankName}
                        onChange={handleInputChange}
                        placeholder="Enter account holder name"
                      />
                    </Form.Group>
                  </div>

                  {/* Right Column: Refund-related fields */}
                  <div className="column-right">
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Enter price"
                        min="0"
                        step="0.01"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter description"
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
                          <ul>
                            {images.map((image, index) => (
                              <li key={index}>{image.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Processed">Processed</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
              </Form>
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
            onClick={handleSaveChanges}
            disabled={!formData.price}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditRefundButton;
