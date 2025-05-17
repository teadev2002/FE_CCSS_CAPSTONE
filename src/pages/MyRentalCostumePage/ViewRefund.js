import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Image, Spin } from "antd";
import RefundService from "../../services/RefundService/RefundService.js";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";

const ViewRefund = ({ refund }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [refundImage, setRefundImage] = useState(null);

  const handleOpenModal = async () => {
    if (!refund?.contractRefundId) {
      console.error("Invalid or missing contractRefundId:", refund);
      toast.error("Invalid refund data.");
      return;
    }

    setLoading(true);
    try {
      console.log(
        "Fetching refund for contractRefundId:",
        refund.contractRefundId
      );
      const response = await RefundService.GetContractRefundByContractRefundId(
        refund.contractRefundId
      );
      console.log("API response:", response);
      setSelectedRefund(response);

      // Fetch refund image using contractId
      if (response.contractId) {
        const imageResponse =
          await RefundService.getContractRefundImagebyContractId(
            response.contractId
          );
        console.log("Image API response:", imageResponse);
        setRefundImage(imageResponse[0]); // Assuming the API returns an array
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error fetching refund details or image:", error);
      toast.error("Failed to load refund details or image.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRefund(null);
    setRefundImage(null);
  };

  return (
    <>
      <Button
        type="default"
        onClick={handleOpenModal}
        className="action-btn view-btn"
        loading={loading}
        disabled={loading || !refund?.contractRefundId}
        aria-label="View refund details"
      >
        <Eye size={16} />
        Refund Details
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="refund-modal"
        backdropClassName="custom-backdrop"
        style={{ zIndex: 1050 }} // Ensure modal is above other elements
      >
        <Modal.Title style={{ textAlign: "center", padding: "16px" }}>
          View Refund Details
        </Modal.Title>

        <Modal.Body>
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin size="large" />
            </div>
          ) : selectedRefund ? (
            <div className="refund-details">
              <p>
                <strong>Bank Number:</strong>{" "}
                {selectedRefund.numberBank || "..."}
              </p>
              <p>
                <strong>Bank Name:</strong> {selectedRefund.bankName || "..."}
              </p>
              <p>
                <strong>Account Holder:</strong>{" "}
                {selectedRefund.accountBankName || "..."}
              </p>

              <p>
                <strong>Price Damage:</strong>{" "}
                {selectedRefund.price
                  ? selectedRefund.price.toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                {selectedRefund.amount
                  ? selectedRefund.amount.toLocaleString()
                  : "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedRefund.description || "N/A"}
              </p>
              <p>
                <strong>Type:</strong> {selectedRefund.type || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {selectedRefund.status || "N/A"}
              </p>
              <div className="refund-image">
                <p>
                  <strong>Refund Image:</strong>
                </p>
                {refundImage && refundImage.urlImage ? (
                  <Image
                    src={refundImage.urlImage}
                    alt="Refund"
                    width="20%"
                    style={{
                      objectFit: "contain",
                    }}
                    preview={{
                      maskClassName: "custom-preview-mask",
                      zIndex: 1060, // Ensure preview is above modal
                    }}
                    fallback="https://via.placeholder.com/150?text=No+Image"
                    onError={() => toast.error("Failed to load image.")}
                  />
                ) : (
                  <p>No image available</p>
                )}
                <p>
                  <strong>Created Date:</strong>{" "}
                  {selectedRefund.createDate || "N/A"}
                </p>
                <p>
                  <strong>Updated Date:</strong>{" "}
                  {selectedRefund.updateDate || "Not Yet"}
                </p>
              </div>
            </div>
          ) : (
            <p>No refund selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="default" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewRefund;
