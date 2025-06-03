import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button, Image, Spin } from "antd";
import { Eye } from "lucide-react";
import RefundService from "../../../services/RefundService/RefundService.js";
import { toast } from "react-toastify";

const ViewRefundButton = ({ refund }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [refundImage, setRefundImage] = useState(null);
  const [refundImage2, setRefundImage2] = useState(null);

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
      if (response.contractId) {
        const imageResponse =
          await RefundService.getImageRefundMoneybyContractId(
            response.contractId
          );
        console.log("Image API response:", imageResponse);
        setRefundImage2(imageResponse[0]); // Assuming the API returns an array
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
    setRefundImage2(null);
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
        View
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="refund-modal"
        backdropClassName="custom-backdrop"
        style={{ zIndex: 1050 }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>
            View Refund Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin size="large" />
            </div>
          ) : selectedRefund ? (
            <div className="refund-details">
              <p>
                <strong>Bank Number:</strong>{" "}
                {selectedRefund.numberBank || "Customer infor"}
              </p>
              <p>
                <strong>Bank Name:</strong>{" "}
                {selectedRefund.bankName || "Customer infor"}
              </p>
              <p>
                <strong>Account Holder:</strong>{" "}
                {selectedRefund.accountBankName || "Customer infor"}
              </p>
              <p>
                <strong>Price Damage:</strong>{" "}
                {selectedRefund.price
                  ? selectedRefund.price.toLocaleString()
                  : 0}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                {selectedRefund.amount
                  ? selectedRefund.amount.toLocaleString()
                  : 0}
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
                      zIndex: 1060,
                    }}
                    fallback="https://via.placeholder.com/150?text=No+Image"
                    onError={() => toast.error("Failed to load image.")}
                  />
                ) : (
                  <i>No image available</i>
                )}
                <p>
                  <strong>Created Date:</strong>{" "}
                  {selectedRefund.createDate || "N/A"}
                </p>
                {refundImage2 && refundImage2.urlImage ? (
                  <Image
                    src={refundImage2.urlImage}
                    alt="Refund Money"
                    width="20%"
                    style={{
                      objectFit: "contain",
                    }}
                    preview={{
                      maskClassName: "custom-preview-mask",
                      zIndex: 1060,
                    }}
                    fallback="https://via.placeholder.com/150?text=No+Image"
                    onError={() => toast.error("Failed to load image.")}
                  />
                ) : (
                  <i>Banking image</i>
                )}
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

export default ViewRefundButton;
