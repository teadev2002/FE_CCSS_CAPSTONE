// src/components/CosplayerForm.jsx
import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import CosplayerImageManager from "./CosplayerImageManager";

const CosplayerForm = ({ show, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState(
    initialData || {
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

  const [errors, setErrors] = useState({});

  // Hàm validate dữ liệu
  const validateForm = () => {
    const newErrors = {};

    // Validate Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate Password (chỉ khi thêm mới)
    if (!isEditing && !formData.password) {
      newErrors.password = "Password is required";
    } else if (!isEditing && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Validate Birthday
    if (!formData.birthday) {
      newErrors.birthday = "Birthday is required";
    } else {
      const today = new Date();
      const birthDate = new Date(formData.birthday);
      if (birthDate > today) {
        newErrors.birthday = "Birthday cannot be in the future";
      }
    }

    // Validate Phone
    const phoneRegex = /^\d{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10-15 digits";
    }

    // Validate Task Quantity
    if (
      formData.taskQuantity !== "" &&
      (isNaN(formData.taskQuantity) || formData.taskQuantity < 0)
    ) {
      newErrors.taskQuantity = "Task Quantity must be a non-negative number";
    }

    // Validate Height
    if (
      formData.height !== "" &&
      (isNaN(formData.height) || formData.height < 0)
    ) {
      newErrors.height = "Height must be a non-negative number";
    }

    // Validate Weight
    if (
      formData.weight !== "" &&
      (isNaN(formData.weight) || formData.weight < 0)
    ) {
      newErrors.weight = "Weight must be a non-negative number";
    }

    // Validate Average Star
    if (
      formData.averageStar !== "" &&
      (isNaN(formData.averageStar) ||
        formData.averageStar < 0 ||
        formData.averageStar > 5)
    ) {
      newErrors.averageStar = "Average Star must be between 0 and 5";
    }

    // Validate Salary Index
    if (
      formData.salaryIndex !== "" &&
      (isNaN(formData.salaryIndex) || formData.salaryIndex < 0)
    ) {
      newErrors.salaryIndex = "Salary Index must be a non-negative number";
    }

    // Validate Role ID
    if (!formData.roleId.trim()) {
      newErrors.roleId = "Role ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Xử lý các ô số để không cho phép giá trị âm
    if (
      ["taskQuantity", "height", "weight", "salaryIndex"].includes(name) &&
      value !== "" &&
      Number(value) < 0
    ) {
      return; // Không cho phép nhập số âm
    }

    // Xử lý Average Star để không vượt quá 5
    if (name === "averageStar" && value !== "" && Number(value) > 5) {
      return; // Không cho phép nhập số lớn hơn 5
    }

    setFormData({ ...formData, [name]: value });

    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
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
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!isEditing}
              disabled={isEditing}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
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
              isInvalid={!!errors.birthday}
            />
            <Form.Control.Feedback type="invalid">
              {errors.birthday}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phone}
            </Form.Control.Feedback>
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
              isInvalid={!!errors.taskQuantity}
            />
            <Form.Control.Feedback type="invalid">
              {errors.taskQuantity}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Height (cm)</Form.Label>
            <Form.Control
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              min="0"
              isInvalid={!!errors.height}
            />
            <Form.Control.Feedback type="invalid">
              {errors.height}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              min="0"
              isInvalid={!!errors.weight}
            />
            <Form.Control.Feedback type="invalid">
              {errors.weight}
            </Form.Control.Feedback>
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
              isInvalid={!!errors.averageStar}
            />
            <Form.Control.Feedback type="invalid">
              {errors.averageStar}
            </Form.Control.Feedback>
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
              isInvalid={!!errors.salaryIndex}
            />
            <Form.Control.Feedback type="invalid">
              {errors.salaryIndex}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role ID</Form.Label>
            <Form.Control
              type="text"
              name="roleId"
              value={formData.roleId}
              onChange={handleInputChange}
              required
              isInvalid={!!errors.roleId}
            />
            <Form.Control.Feedback type="invalid">
              {errors.roleId}
            </Form.Control.Feedback>
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
