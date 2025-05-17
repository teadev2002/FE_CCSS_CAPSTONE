// validate price damage:
import React, { useState, useEffect } from "react";
import { Modal, Form } from "react-bootstrap";
import { Button } from "antd";
import RefundService from "../../../services/RefundService/RefundService.js";
import { toast } from "react-toastify";

const RefundButton = ({ visible, onCancel, contractId }) => {
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState(null); // Store the amount from API

  // Fetch contract data to get the amount
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const contractData = await RefundService.getContractByContractId(
          contractId
        );
        setAmount(contractData.amount); // Set the amount from the contract
      } catch (error) {
        setError("Failed to fetch contract data.");
        console.error("Error fetching contract data:", error);
      }
    };

    if (visible && contractId) {
      fetchContractData();
    }
  }, [visible, contractId]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setImages(selectedFiles);
  };

  const handleConfirmRefund = async () => {
    // Validate price against amount
    if (parseFloat(price) > parseFloat(amount)) {
      setError(`Price Damage cannot exceed the contract amount of ${amount}.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await RefundService.sendRefund(
        contractId,
        price,
        description,
        images
      );
      toast.success("Refund processed successfully:", response);
      setTimeout(() => {
        window.location.reload();
      }, 500);
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
        className="refund vinhome-grand-park-modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Title style={{ textAlign: "center", marginTop: "20px" }}>
          Process Refund
        </Modal.Title>

        <Modal.Body>
          <div className="refund-details">
            <Form.Group className="mb-3">
              <Form.Label>Price Damage</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter the refund price"
                min="0"
                step="0.01"
                isInvalid={parseFloat(price) > parseFloat(amount)}
              />
              <Form.Control.Feedback type="invalid">
                Price Damage cannot exceed the contract amount of {amount}.
              </Form.Control.Feedback>
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

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Upload Images</Form.Label>
              <div
                style={{
                  border: "2px dashed #ccc",
                  padding: "20px",
                  borderRadius: "8px",
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="customFileInput"
                />
                <label
                  htmlFor="customFileInput"
                  style={{ cursor: "pointer", color: "#007bff" }}
                >
                  Click to select images
                </label>
              </div>

              {images.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2">Selected Images ({images.length}):</p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(100px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {images.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "8px",
                          padding: "6px",
                          textAlign: "center",
                          backgroundColor: "#fff",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={image.name}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <div
                          style={{
                            fontSize: "11px",
                            marginTop: "6px",
                            wordBreak: "break-all",
                          }}
                        >
                          {image.name}
                        </div>
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
            disabled={!price || loading || amount === null}
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
