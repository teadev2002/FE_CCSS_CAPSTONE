import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
  FormCheck,
  Row,
  Col,
} from "react-bootstrap";
import SourvenirService from "../../../services/ManageServicePages/ManageSouvenirService/SouvenirService.js";
import "../../../styles/Manager/ManageSouvenir.scss";
import { Image, Popconfirm, message, Button } from "antd";
import { toast } from "react-toastify";
import { ArrowUp, ArrowDown } from "lucide-react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const PLACEHOLDER_IMAGE_URL =
  "https://www.elegantthemes.com/blog/wp-content/uploads/2020/08/000-http-error-codes.png";

const ManageSouvenir = () => {
  const [products, setProducts] = useState([]);
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
  const [sortSouvenir, setSortSouvenir] = useState({
    field: "productName",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 30];

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
    } catch (error) {
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

  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          (item.productName?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (item.description?.toLowerCase() || "").includes(search.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      const valueA = String(a[sort.field]).toLowerCase();
      const valueB = String(b[sort.field]).toLowerCase();
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredProducts = filterAndSortData(products, searchTerm, sortSouvenir);
  const totalEntries = filteredProducts.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedProducts = paginateData(filteredProducts, currentPage);

  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  const handleShowModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
      setFormData({
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

  const handleDelete = async (productId) => {
    setIsLoading(true);
    setError(null);
    try {
      await SourvenirService.deleteProduct(productId);
      await fetchProducts();
      message.success("Product deleted successfully!");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to delete souvenir."
      );
      message.error("Failed to delete souvenir.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortSouvenir((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = PLACEHOLDER_IMAGE_URL;
  };

  return (
    <div className="manage-souvenirs">
      <h2 className="manage-souvenirs-title">Manage Souvenirs</h2>
      <div className="table-container">
        <Card className="souvenir-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Souvenirs</h3>
              <Form.Control
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <Button
                type="primary"
                onClick={() => handleShowModal()}
              >
                Add New Souvenir
              </Button>
            </div>
            {isLoading && (
              <Box sx={{ width: "100%", marginY: 2 }}>
                <LinearProgress />
              </Box>
            )}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("productName")}
                        >
                          Product Name
                          {sortSouvenir.field === "productName" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Description</th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("quantity")}
                        >
                          Quantity
                          {sortSouvenir.field === "quantity" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("price")}
                        >
                          Price ($)
                          {sortSouvenir.field === "price" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("createDate")}
                        >
                          Created Date
                          {sortSouvenir.field === "createDate" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("updateDate")}
                        >
                          Updated Date
                          {sortSouvenir.field === "updateDate" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("isActive")}
                        >
                          Active
                          {sortSouvenir.field === "isActive" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Image</th>
                      <th className="text-center">Actions</th>
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
                          <td className="text-center">{product.productName}</td>
                          <td className="text-center">{product.description?.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}</td>
                          <td className="text-center">{product.quantity}</td>
                          <td className="text-center">{product.price?.toFixed(2)}</td>
                          <td className="text-center">{product.createDate ? new Date(product.createDate).toLocaleDateString() : "N/A"}</td>
                          <td className="text-center">{product.updateDate ? new Date(product.updateDate).toLocaleDateString() : "N/A"}</td>
                          <td className="text-center">{product.isActive ? "Yes" : "No"}</td>
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
                          <td className="text-center">
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleShowModal(product)}
                              style={{ marginRight: "8px" }}
                            >
                              Edit
                            </Button>
                            <Popconfirm
                              title="Delete the product"
                              description="Are you sure to delete this product?"
                              onConfirm={() => handleDelete(product.productId)}
                              onCancel={() => message.info("Cancelled")}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="primary" danger size="small">
                                Delete
                              </Button>
                            </Popconfirm>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                <div className="pagination-controls">
                  <div className="pagination-info">
                    <span>{showingText}</span>
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
              </>
            )}
          </Card.Body>
        </Card>
      </div>

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
            <p className="error-message">{error}</p>
          )}
          <Form onSubmit={handleSubmit}>
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
            type="default"
            onClick={handleCloseModal}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
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