// ModalConfirmSignUp.js
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// import apiClient from "../../api/apiClient"; // Import your API client
import { apiClient, formDataClient } from "../../api/apiClient.js";
const ModalConfirmSignUp = ({ show, onHide, email }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Verification code is required.");
      return;
    }

    try {
      // Call the PATCH /api/Auth endpoint to verify the code
      const response = await apiClient.patch("/api/Auth", null, {
        params: {
          email,
          code,
        },
      });

      // On success (status 200), show success toast and navigate to /login
      toast.success("Sign up successful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });

      // Close the modal and navigate to /login
      onHide();
      setTimeout(() => {
        navigate("/login");
      }, 2100);
    } catch (err) {
      // Handle errors (e.g., invalid code)
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Verify Your Signup</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Hidden email field (for reference, not visible to user) */}
          <Form.Group
            className="mb-3"
            controlId="formEmail"
            style={{ display: "none" }}
          >
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} readOnly />
          </Form.Group>

          {/* Verification code input */}
          <Form.Group className="mb-3" controlId="formCode">
            <Form.Label>Verification Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the code sent to your email"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Verify
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalConfirmSignUp;
