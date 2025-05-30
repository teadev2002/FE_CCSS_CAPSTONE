// còn lỗi   update
//select categoryId=========================
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CharacterImageManager from "./CharacterImageManager";
import CategoryService from "../../../services/CategoryService/CategoryService.js";

const CharacterForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
  loading,
}) => {
  const [formData, setFormData] = useState(
    initialData
      ? {
          ...initialData,
          imageFiles: [],
        }
      : {
          characterId: "",
          categoryId: "",
          characterName: "",
          description: "",
          price: "",
          maxHeight: "",
          maxWeight: "",
          minHeight: "",
          minWeight: "",
          quantity: "",
          imageFiles: [],
        }
  );

  const [categories, setCategories] = useState([]); // State để lưu danh sách category
  const [categoryLoading, setCategoryLoading] = useState(false); // State để quản lý trạng thái tải category
  const [categoryError, setCategoryError] = useState(null); // State để quản lý lỗi khi gọi API category

  // Gọi API để lấy danh sách category khi form mở
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      try {
        const data = await CategoryService.getAllCategories();
        setCategories(data);
        setCategoryError(null);
      } catch (err) {
        setCategoryError(err.message);
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Cập nhật formData khi initialData thay đổi
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        imageFiles: [],
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={open} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? "Edit Character" : "Add New Character"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* <Form.Group className="mb-3">
            <Form.Label>Character ID</Form.Label>
            <Form.Control
              type="text"
              name="characterId"
              value={formData.characterId || ""}
              onChange={handleInputChange}
              required
              disabled={isEditing || loading}
            />
          </Form.Group> */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="categoryId"
              value={formData.categoryId || ""}
              onChange={handleInputChange}
              required
              disabled={loading || categoryLoading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </Form.Select>
            {categoryLoading && <p>Loading categories...</p>}
            {categoryError && <p className="text-danger">{categoryError}</p>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Character Name</Form.Label>
            <Form.Control
              type="text"
              name="characterName"
              value={formData.characterName || ""}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity || ""}
              onChange={handleInputChange}
              required
              min="0"
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Max Height (cm)</Form.Label>
            <Form.Control
              type="number"
              name="maxHeight"
              value={formData.maxHeight || ""}
              onChange={handleInputChange}
              required
              min="0"
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Max Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              name="maxWeight"
              value={formData.maxWeight || ""}
              onChange={handleInputChange}
              required
              min="0"
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Min Height (cm)</Form.Label>
            <Form.Control
              type="number"
              name="minHeight"
              value={formData.minHeight || ""}
              onChange={handleInputChange}
              required
              min="0"
              disabled={loading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Min Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              name="minWeight"
              value={formData.minWeight || ""}
              onChange={handleInputChange}
              required
              min="0"
              disabled={loading}
            />
          </Form.Group>
          <CharacterImageManager
            imageFiles={formData.imageFiles}
            setImageFiles={(files) =>
              setFormData({ ...formData, imageFiles: files })
            }
            disabled={loading}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {isEditing ? "Update" : "Add"} Character
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CharacterForm;
