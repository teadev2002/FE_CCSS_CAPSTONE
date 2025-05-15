import React from "react";
import { Modal } from "react-bootstrap";
import { Button } from "antd";

const ViewButton = ({ refund, showModal, setShowModal, setSelectedRefund }) => {
  const handleOpenModal = () => {
    setSelectedRefund(refund);
    setShowModal(true);
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
          {refund ? (
            <div className="refund-details">
              <p>
                <strong>Refund ID:</strong> {refund.contractRefundId}
              </p>
              <p>
                <strong>Contract ID:</strong> {refund.contractId}
              </p>
              <p>
                <strong>Bank Number:</strong> {refund.numberBank || "N/A"}
              </p>
              <p>
                <strong>Bank Name:</strong> {refund.bankName || "N/A"}
              </p>
              <p>
                <strong>Account Holder:</strong>{" "}
                {refund.accountBankName || "N/A"}
              </p>
              <p>
                <strong>Created Date:</strong> {refund.createDate}
              </p>
              <p>
                <strong>Updated Date:</strong> {refund.updateDate || "N/A"}
              </p>
              <p>
                <strong>Price:</strong> {refund.price}
              </p>
              <p>
                <strong>Description:</strong> {refund.description}
              </p>
              <p>
                <strong>Type:</strong> {refund.type}
              </p>
              <p>
                <strong>Status:</strong> {refund.status}
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

export default ViewButton;
