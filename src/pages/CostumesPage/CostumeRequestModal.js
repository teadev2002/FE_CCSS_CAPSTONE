import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CostumeRequestService from "../../services/CostumeService/CostumeService.js";

const CostumeRequestModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
    minHeight: "",
    maxHeight: "",
    minWeight: "",
    maxWeight: "",
    images: [],
    requestDate: new Date().toLocaleDateString("en-GB"), // Format as dd/mm/yyyy
    createBy: "",
    agreeToTerms: false,
  });

  const [categories, setCategories] = useState([]); // Danh sách danh mục từ API
  const [loading, setLoading] = useState(false); // Trạng thái loading khi gửi yêu cầu

  // Lấy danh sách categories và createBy từ token khi modal mở
  useEffect(() => {
    if (show) {
      const fetchInitialData = async () => {
        try {
          // Lấy danh sách danh mục
          const categoriesData = await CostumeRequestService.getCategories();
          setCategories(categoriesData);

          // Lấy createBy từ token
          const token = localStorage.getItem("accessToken");
          if (token) {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?.Id; // Lấy Id từ token
            if (userId) {
              setFormData((prev) => ({ ...prev, createBy: userId }));
            } else {
              throw new Error("User ID not found in token");
            }
          } else {
            throw new Error("Access token not found");
          }
        } catch (error) {
          console.error("Error fetching initial data:", error);
          toast.error(error.message || "Failed to load initial data");
        }
      };

      fetchInitialData();
    }
  }, [show]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: [...Array.from(e.target.files)],
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.name) {
      toast.error("Please enter a name");
      return;
    }
    if (!formData.description) {
      toast.error("Please enter a description");
      return;
    }
    if (!formData.minHeight || formData.minHeight <= 0) {
      toast.error("Please enter a valid minimum height (greater than 0)");
      return;
    }
    if (!formData.maxHeight || formData.maxHeight <= 0) {
      toast.error("Please enter a valid maximum height (greater than 0)");
      return;
    }
    if (!formData.minWeight || formData.minWeight <= 0) {
      toast.error("Please enter a valid minimum weight (greater than 0)");
      return;
    }
    if (!formData.maxWeight || formData.maxWeight <= 0) {
      toast.error("Please enter a valid maximum weight (greater than 0)");
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    if (!formData.createBy) {
      toast.error("User ID (createBy) is missing");
      return;
    }

    setLoading(true);
    try {
      // Gửi yêu cầu tạo CustomerCharacter
      const result = await CostumeRequestService.createCustomerCharacter({
        categoryId: formData.categoryId,
        name: formData.name,
        description: formData.description,
        minHeight: Number(formData.minHeight),
        maxHeight: Number(formData.maxHeight),
        minWeight: Number(formData.minWeight),
        maxWeight: Number(formData.maxWeight),
        createBy: formData.createBy,
        images: formData.images,
      });

      if (result === true) {
        toast.success("Costume request submitted successfully!");
        handleClose();
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error submitting costume request:", error);
      toast.error(error.message || "Failed to submit costume request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Costume Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* CategoryId (hiển thị name, lưu value là id) */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter costume name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Enter costume description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* MinHeight */}
          <Form.Group className="mb-3">
            <Form.Label>Min Height (cm)</Form.Label>
            <Form.Control
              type="number"
              name="minHeight"
              placeholder="Enter min height"
              value={formData.minHeight}
              onChange={handleChange}
              required
              min="0"
            />
          </Form.Group>

          {/* MaxHeight */}
          <Form.Group className="mb-3">
            <Form.Label>Max Height (cm)</Form.Label>
            <Form.Control
              type="number"
              name="maxHeight"
              placeholder="Enter max height"
              value={formData.maxHeight}
              onChange={handleChange}
              required
              min="0"
            />
          </Form.Group>

          {/* MinWeight */}
          <Form.Group className="mb-3">
            <Form.Label>Min Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              name="minWeight"
              placeholder="Enter min weight"
              value={formData.minWeight}
              onChange={handleChange}
              required
              min="0"
            />
          </Form.Group>

          {/* MaxWeight */}
          <Form.Group className="mb-3">
            <Form.Label>Max Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              name="maxWeight"
              placeholder="Enter max weight"
              value={formData.maxWeight}
              onChange={handleChange}
              required
              min="0"
            />
          </Form.Group>

          {/* CreateBy (read-only) */}
          <Form.Group className="mb-3">
            <Form.Label>Created By</Form.Label>
            <Form.Control
              type="text"
              name="createBy"
              value={formData.createBy}
              readOnly
              className="bg-light"
            />
          </Form.Group>

          {/* Images */}
          <Form.Group className="mb-3">
            <Form.Label>Costume Images</Form.Label>
            <div className="upload-container">
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <div className="upload-icon">
                <Upload size={24} />
              </div>
            </div>
            {formData.images.length > 0 && (
              <small className="text-muted">
                {formData.images.length} file(s) selected
              </small>
            )}
          </Form.Group>

          {/* Request Date */}
          <Form.Group className="mb-3">
            <Form.Label>Request Date</Form.Label>
            <Form.Control
              type="text"
              value={formData.requestDate}
              readOnly
              className="bg-light"
            />
          </Form.Group>

          {/* Agree to Terms */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Agree to terms: request must be submitted 1 month in advance"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreeToTerms: e.target.checked })
              }
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!formData.agreeToTerms || loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CostumeRequestModal;
