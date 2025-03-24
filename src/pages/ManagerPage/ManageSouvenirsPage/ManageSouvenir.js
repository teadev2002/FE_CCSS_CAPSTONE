// src/components/ManageSouvenir.jsx
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
  FormCheck,
} from "react-bootstrap";
import "../../../styles/Manager/ManageSouvenir.scss";

const ManageSouvenir = () => {
  // Mock data combining Product and ProductImage tables
  const [products, setProducts] = useState([
    {
      productId: "P001",
      productName: "Cosplay Keychain",
      description: "A keychain featuring a popular anime character.",
      quantity: 50,
      price: 10,
      createDate: "2025-01-01",
      updateDate: "2025-01-02",
      isActive: true,
      urlImage:
        "https://th.bing.com/th/id/OIP.Dud8is2v6yWRRtgZ8ZzE1wHaJ8?rs=1&pid=ImgDetMain",
    },
    {
      productId: "P002",
      productName: "Anime Poster",
      description: "A high-quality poster of your favorite anime.",
      quantity: 30,
      price: 15,
      createDate: "2025-01-03",
      updateDate: "2025-01-04",
      isActive: true,
      urlImage:
        "https://th.bing.com/th/id/OIP.LjAoRHobbppTPYTJy-vZ4gHaLc?rs=1&pid=ImgDetMain",
    },
    {
      productId: "P003",
      productName: "Character Figurine",
      description: "A detailed figurine of a cosplay character.",
      quantity: 20,
      price: 25,
      createDate: "2025-01-05",
      updateDate: "2025-01-06",
      isActive: false,
      urlImage:
        "https://i.etsystatic.com/14159039/r/il/e604d4/1383896438/il_fullxfull.1383896438_in21.jpg",
    },
  ]);

  // State for modal visibility and form data
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    description: "",
    quantity: "",
    price: "",
    createDate: "",
    updateDate: "",
    isActive: true,
    urlImage: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set to 10 by default
  const rowsPerPageOptions = [10, 20, 30];

  // Calculate pagination
  const totalPages = Math.ceil(products.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  // Handle modal open/close
  const handleShowModal = (product = null) => {
    if (product) {
      // Edit mode
      setIsEditing(true);
      setCurrentProduct(product);
      setFormData({ ...product });
    } else {
      // Add mode
      setIsEditing(false);
      setFormData({
        productId: "",
        productName: "",
        description: "",
        quantity: "",
        price: "",
        createDate: new Date().toISOString().split("T")[0], // Default to today
        updateDate: new Date().toISOString().split("T")[0], // Default to today
        isActive: true,
        urlImage: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentProduct(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle switch change for isActive
  const handleSwitchChange = (e) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update product
      const updatedProducts = products.map((product) =>
        product.productId === currentProduct.productId ? formData : product
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      setProducts([...products, formData]);
    }
    handleCloseModal();
  };

  // Handle delete product
  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(
        products.filter((product) => product.productId !== productId)
      );
    }
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  return (
    <div className="manage-souvenirs">
      <h2 className="manage-souvenirs-title">Manage Souvenirs</h2>
      <Button
        variant="primary"
        onClick={() => handleShowModal()}
        className="mb-3 add-souvenir-btn"
      >
        Add New Souvenir
      </Button>

      {/* Table wrapped in Card */}
      <Card className="souvenir-table-card">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead className="table-header">
              <tr>
                <th className="text-center">Product Name</th>
                <th className="text-center">Description</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Price ($)</th>
                <th className="text-center">Create Date</th>
                <th className="text-center">Update Date</th>
                <th className="text-center">Active</th>
                <th className="text-center">Image</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.productId}>
                  <td className="text-center">{product.productName}</td>
                  <td className="text-center">{product.description}</td>
                  <td className="text-center">{product.quantity}</td>
                  <td className="text-center">{product.price}</td>
                  <td className="text-center">{product.createDate}</td>
                  <td className="text-center">{product.updateDate}</td>
                  <td className="text-center">
                    {product.isActive ? "Yes" : "No"}
                  </td>
                  <td className="text-center">
                    <img
                      src={product.urlImage}
                      alt={product.productName}
                      className="souvenir-image"
                    />
                  </td>
                  <td className="text-center">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleShowModal(product)}
                      className="me-2"
                    >
                      🛠️
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.productId)}
                    >
                      🗑️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center pagination-controls">
            <div className="rows-per-page">
              <span>Rows per page: </span>
              <Dropdown
                onSelect={(value) => handleRowsPerPageChange(Number(value))}
                className="d-inline-block"
              >
                <Dropdown.Toggle
                  variant="secondary"
                  id="dropdown-rows-per-page"
                >
                  {rowsPerPage}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {rowsPerPageOptions.map((option) => (
                    <Dropdown.Item key={option} eventKey={option}>
                      {option}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <Pagination>
              <Pagination.First
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item
                  key={page + 1}
                  active={page + 1 === currentPage}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </Card.Body>
      </Card>

      {/* Modal for Add/Edit Souvenir */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="souvenir-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Souvenir" : "Add New Souvenir"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                required
                disabled={isEditing}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
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
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Create Date</Form.Label>
              <Form.Control
                type="date"
                name="createDate"
                value={formData.createDate}
                onChange={handleInputChange}
                required
                disabled={isEditing}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Update Date</Form.Label>
              <Form.Control
                type="date"
                name="updateDate"
                value={formData.updateDate}
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
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                name="urlImage"
                value={formData.urlImage}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? "Update" : "Add"} Souvenir
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageSouvenir;
