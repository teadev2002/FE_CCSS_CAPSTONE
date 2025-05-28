import React, { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { Button } from "antd";
import RefundService from "../../services/RefundService/RefundService.js";
import { toast } from "react-toastify";

const EditRefund = ({ refund }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    numberBank: "",
    bankName: "",
    accountBankName: "",
    price: 0,
    amount: 0,
    description: "",
    status: "Pending",
  });

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
      setFormData({
        numberBank: response.numberBank || "",
        bankName: response.bankName || "",
        accountBankName: response.accountBankName || "",
        price: response.price || 0,
        amount: response.amount || 0,
        description: response.description || "",
        status: response.status || "Pending",
      });
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
    setFormData({
      numberBank: "",
      bankName: "",
      accountBankName: "",
      price: 0,
      amount: 0,
      description: "",
      status: "Pending",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!refund?.contractId) {
      toast.error("Invalid contract ID.");
      return;
    }

    setLoading(true);
    try {
      // Update refund details
      await RefundService.updateRefund(
        refund.contractRefundId,
        refund.contractId,
        formData.numberBank,
        formData.bankName,
        formData.accountBankName,
        formData.price,
        formData.description
      );
      console.log(
        "Refund updated for contractRefundId:",
        refund.contractRefundId
      );

      toast.success("Refund updated successfully.");
      setTimeout(() => {
        window.location.reload();
      }, 500);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating refund:", error);
      toast.error("Failed to update refund.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="default"
        onClick={handleOpenModal}
        className="action-btn edit-btn"
        loading={loading}
        disabled={loading || !refund?.contractRefundId}
      >
        Update Refund
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="refund-modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Title style={{ textAlign: "center" }}>Update Refund</Modal.Title>

        <Modal.Body>
          <Form>
            <div className="two-column-layout">
              {/* Left Column: Bank-related fields */}

              <i>
                <span>
                  ⚠️If you enter incorrect information, the system will not be
                  responsible.
                </span>
              </i>
              <div className="column-left">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Form.Group
                    className="mb-3"
                    style={{ flex: 1, marginRight: "10px" }}
                  >
                    <Form.Label>Bank Number</Form.Label>
                    <Form.Control
                      type="number"
                      name="numberBank"
                      value={formData.numberBank}
                      onChange={handleInputChange}
                      placeholder="Enter bank number"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" style={{ flex: 1 }}>
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Enter bank name"
                      required
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
                    required
                  />
                </Form.Group>
              </div>

              {/* Right Column: Refund-related fields */}
              <div className="column-right">
                <Form.Group className="mb-3">
                  <Form.Label>Price Damage</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Money Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder=""
                    min="0"
                    step="0.01"
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="default" onClick={handleCloseModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSaveChanges}
            loading={loading}
            disabled={
              loading ||
              !formData.accountBankName ||
              !formData.numberBank ||
              !formData.bankName
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditRefund;
