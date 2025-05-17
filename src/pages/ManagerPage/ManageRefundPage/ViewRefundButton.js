import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "antd";
import RefundService from "../../../services/RefundService/RefundService.js";
import { toast } from "react-toastify";

const ViewRefundButton = ({ refund }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);

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
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching refund details:", error);
      toast.error("Failed to load refund details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRefund(null);
  };

  return (
    <>
      <Button
        type="default"
        size="small"
        onClick={handleOpenModal}
        className="action-btn view-btn"
        loading={loading}
        disabled={loading || !refund?.contractRefundId}
      >
        View
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="refund-modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>View Refund Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRefund ? (
            <div className="refund-details">
              <p>
                <strong>Bank Number:</strong>{" "}
                {selectedRefund.numberBank || "N/A"}
              </p>
              <p>
                <strong>Bank Name:</strong> {selectedRefund.bankName || "N/A"}
              </p>
              <p>
                <strong>Account Holder:</strong>{" "}
                {selectedRefund.accountBankName || "N/A"}
              </p>
              <p>
                <strong>Created Date:</strong>{" "}
                {selectedRefund.createDate || "N/A"}
              </p>
              <p>
                <strong>Updated Date:</strong>{" "}
                {selectedRefund.updateDate || "N/A"}
              </p>
              <p>
                <strong>Price:</strong>{" "}
                {selectedRefund.price
                  ? selectedRefund.price.toLocaleString()
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

// ở trên còn thiếu chưa xem dc hình
