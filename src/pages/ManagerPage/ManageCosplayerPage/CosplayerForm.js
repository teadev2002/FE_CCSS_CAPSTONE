// src/components/CosplayerForm.jsx
import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import CosplayerImageManager from "./CosplayerImageManager";

const CosplayerForm = ({ show, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState(
    initialData || {
      accountId: "",
      name: "",
      email: "",
      password: "",
      description: "",
      birthday: new Date().toISOString().split("T")[0],
      phone: "",
      isActive: true,
      onTask: false,
      leader: "",
      code: "",
      taskQuantity: "",
      height: "",
      weight: "",
      averageStar: "",
      salaryIndex: "",
      roleId: "",
      images: [],
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      className="cosplayer-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Edit Cosplayer" : "Add New Cosplayer"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Account ID</Form.Label>
            <Form.Control
              type="text"
              name="accountId"
              value={formData.accountId}
              onChange={handleInputChange}
              required
              disabled={isEditing}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!isEditing}
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
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              label="Active"
              name="isActive"
              checked={formData.isActive}
              onChange={handleSwitchChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              label="On Task"
              name="onTask"
              checked={formData.onTask}
              onChange={handleSwitchChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Leader</Form.Label>
            <Form.Control
              type="text"
              name="leader"
              value={formData.leader}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Code</Form.Label>
            <Form.Control
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Task Quantity</Form.Label>
            <Form.Control
              type="number"
              name="taskQuantity"
              value={formData.taskQuantity}
              onChange={handleInputChange}
              min="0"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Height (cm)</Form.Label>
            <Form.Control
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              min="0"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              min="0"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Average Star</Form.Label>
            <Form.Control
              type="number"
              name="averageStar"
              value={formData.averageStar}
              onChange={handleInputChange}
              min="0"
              max="5"
              step="0.1"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Salary Index</Form.Label>
            <Form.Control
              type="number"
              name="salaryIndex"
              value={formData.salaryIndex}
              onChange={handleInputChange}
              min="0"
              step="0.1"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role ID</Form.Label>
            <Form.Control
              type="text"
              name="roleId"
              value={formData.roleId}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <CosplayerImageManager
            images={formData.images}
            setImages={(images) => setFormData({ ...formData, images })}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {isEditing ? "Update" : "Add"} Cosplayer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CosplayerForm;
