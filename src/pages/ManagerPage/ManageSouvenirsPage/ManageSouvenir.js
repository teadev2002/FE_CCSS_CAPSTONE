import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
  FormCheck,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import SourvenirService from "../../../services/ManageServicePages/ManageSouvenirService/SouvenirService.js";
import "../../../styles/Manager/ManageSouvenir.scss";
import { Image, Popconfirm, message } from "antd"; // Import Popconfirm và message từ antd
import { toast } from "react-toastify";
import { ArrowDownUp, ArrowDownAZ } from "lucide-react";

const PLACEHOLDER_IMAGE_URL =
  "https://www.elegantthemes.com/blog/wp-content/uploads/2020/08/000-http-error-codes.png"; // Placeholder cho hình ảnh lỗi

const ManageSouvenir = () => {
  // State quản lý dữ liệu và giao diện
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    quantity: "",
    price: "",
    isActive: true,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rowsPerPageOptions = [5, 10, 20, 30];

  // Fetch danh sách sản phẩm
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SourvenirService.getAllProducts();
      const processedData = data.map((product) => {
        let displayImageUrl = PLACEHOLDER_IMAGE_URL;
        if (
          product.productImages &&
          Array.isArray(product.productImages) &&
          product.productImages.length > 0 &&
          product.productImages[0]?.urlImage
        ) {
          displayImageUrl = product.productImages[0].urlImage;
        }
        return { ...product, displayImageUrl };
      });
      setProducts(processedData);
      setFilteredProducts(processedData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch products."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = products.filter(
      (product) =>
        (product.productName?.toLowerCase() || "").includes(term) ||
        (product.description?.toLowerCase() || "").includes(term)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  // Xử lý sắp xếp
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    const sorted = [...filteredProducts].sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (valA == null && valB == null) return 0;
      if (valA == null) return order === "asc" ? -1 : 1;
      if (valB == null) return order === "asc" ? 1 : -1;
      if (typeof valA === "string" && typeof valB === "string") {
        return valA.localeCompare(valB) * (order === "asc" ? 1 : -1);
      }
      return (valA < valB ? -1 : 1) * (order === "asc" ? 1 : -1);
    });
    setFilteredProducts(sorted);
  };

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Xử lý modal
  const handleShowModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
      setFormData({
        productId: product.productId,
        productName: product.productName ?? "",
        description: product.description ?? "",
        quantity: product.quantity ?? "",
        price: product.price ?? "",
        isActive: product.isActive ?? true,
      });
      setSelectedFiles([]);
    } else {
      setIsEditing(false);
      setCurrentProduct(null);
      setFormData({
        productName: "",
        description: "",
        quantity: "",
        price: "",
        isActive: true,
      });
      setSelectedFiles([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentProduct(null);
    setSelectedFiles([]);
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? (value === "" ? "" : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing && currentProduct?.productId) {
        const payload = {
          productName: formData.productName,
          description: formData.description,
          quantity: Number(formData.quantity) || 0,
          price: Number(formData.price) || 0,
          isActive: formData.isActive,
        };
        await SourvenirService.updateProduct(currentProduct.productId, payload);
      } else {
        const productData = {
          ProductName: formData.productName,
          Description: formData.description,
          Quantity: Number(formData.quantity) || 0,
          Price: Number(formData.price) || 0,
          IsActive: formData.isActive,
        };
        await SourvenirService.createProduct(productData, selectedFiles);
      }
      handleCloseModal();
      await fetchProducts();
      toast.success("Product saved successfully!");
    } catch (error) {
      console.error("Error submitting form:", error.response || error);
      setError(
        error.response?.data?.title ||
          error.response?.data?.message ||
          error.message ||
          "Failed to save souvenir."
      );
      toast.error("Failed to save souvenir.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa với Popconfirm
  const handleDelete = async (productId) => {
    setIsLoading(true);
    setError(null);
    try {
      await SourvenirService.deleteProduct(productId);
      await fetchProducts();
      message.success("Product deleted successfully!"); // Thông báo thành công
    } catch (error) {
      console.error("Error deleting product:", error.response || error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete souvenir."
      );
      message.error("Failed to delete souvenir."); // Thông báo lỗi
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý phân trang
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = PLACEHOLDER_IMAGE_URL;
  };

  // Render giao diện
  return (
    <div className="manage-souvenirs container mt-4">
      <h2 className="manage-souvenirs-title text-center mb-4">
        Manage Souvenirs
      </h2>

      <Row className="mb-3 g-2 align-items-center">
        <Col xs="auto">
          <span className="me-2">Rows per page:</span>
          <Dropdown
            onSelect={handleRowsPerPageChange}
            className="d-inline-block"
          >
            <Dropdown.Toggle
              variant="outline-secondary"
              id="dropdown-rows-per-page"
              size="sm"
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
        </Col>
        <Col></Col>
        <Col xs={12} md={5} lg={4}>
          <InputGroup size="sm">
            <Form.Control
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={handleSearch}
            />
            <InputGroup.Text>🔍</InputGroup.Text>
          </InputGroup>
        </Col>
        <Col></Col>
        <Col xs="auto">
          <Button
            variant="primary"
            onClick={() => handleShowModal()}
            size="sm"
            className="add-souvenir-btn"
          >
            + Add New Souvenir
          </Button>
        </Col>
      </Row>

      {isLoading && <div className="text-center my-3">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!isLoading && !error && (
        <Card className="souvenir-table-card shadow-sm">
          <Card.Body>
            <Table striped bordered hover responsive size="sm">
              <thead className="table-light">
                <tr>
                  <th onClick={() => handleSort("productName")}>
                    Product Name <ArrowDownAZ />
                  </th>
                  <th onClick={() => handleSort("description")}>
                    Description <ArrowDownAZ />
                  </th>
                  <th onClick={() => handleSort("quantity")}>
                    Quantity <ArrowDownUp size={20} />
                  </th>
                  <th onClick={() => handleSort("price")}>
                    Price ($) <ArrowDownUp size={20} />
                  </th>
                  <th onClick={() => handleSort("createDate")}>
                    Created <ArrowDownUp size={20} />
                  </th>
                  <th onClick={() => handleSort("updateDate")}>Updated</th>
                  <th onClick={() => handleSort("isActive")}>Active</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No souvenirs found {searchTerm && "matching your search"}.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product) => (
                    <tr key={product.productId}>
                      <td>{product.productName}</td>
                      <td title={product.description}>
                        {product.description?.length > 50
                          ? `${product.description.substring(0, 50)}...`
                          : product.description}
                      </td>
                      <td className="text-end">{product.quantity}</td>
                      <td className="text-end">{product.price?.toFixed(2)}</td>
                      <td>
                        {product.createDate
                          ? new Date(product.createDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        {product.updateDate
                          ? new Date(product.updateDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge ${
                            product.isActive ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {product.isActive ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="text-center">
                        <Image
                          width={50}
                          height={50}
                          src={product.displayImageUrl}
                          alt={product.productName}
                          onError={handleImageError}
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleShowModal(product)}
                          className="me-2"
                          title="Edit"
                        >
                          🛠️
                        </Button>
                        <Popconfirm
                          title="Delete the product"
                          description="Are you sure to delete this product?"
                          onConfirm={() => handleDelete(product.productId)}
                          onCancel={() => message.info("Cancelled")}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            variant="outline-danger"
                            size="sm"
                            title="Delete"
                          >
                            🗑️
                          </Button>
                        </Popconfirm>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <Pagination size="sm">
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
            )}
          </Card.Body>
        </Card>
      )}

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        backdrop="static"
        className="souvenir-modal"
      >
        <Modal.Header closeButton={!isLoading}>
          <Modal.Title>
            {isEditing ? "Edit Souvenir" : "Add New Souvenir"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && !isLoading && (
            <div className="alert alert-danger">{error}</div>
          )}
          <Form onSubmit={handleSubmit}>
            {isEditing && (
              <Form.Group className="mb-3">
                <Form.Label>Product ID</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.productId}
                  readOnly
                  disabled
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="Enter product name"
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
                disabled={isLoading}
                placeholder="Enter description"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    disabled={isLoading}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
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
                    disabled={isLoading}
                    placeholder="0.00"
                  />
                </Form.Group>
              </Col>
            </Row>
            {!isEditing && (
              <Form.Group className="mb-3">
                <Form.Label>Upload Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="modalIsActiveSwitch"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleSwitchChange}
                disabled={isLoading}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : (isEditing ? "Update" : "Add") + " Souvenir"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageSouvenir;
