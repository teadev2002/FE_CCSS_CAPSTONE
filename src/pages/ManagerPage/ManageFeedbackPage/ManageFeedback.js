import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import { Button, Popconfirm, message, Input, Select } from "antd";
import { toast } from "react-toastify";
import { ArrowDownUp, ArrowDownAZ } from "lucide-react";
import "../../../styles/Manager/ManageFeedback.scss";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const { Option } = Select;

// Dữ liệu tĩnh giả lập (thay bằng API sau này)
const initialFeedbacks = [
  {
    id: "FB001",
    customer: "John Doe",
    cosplayer: "Alice Smith",
    service: "Hire Cosplayer",
    rating: 5,
    comment: "Alice was fantastic, very professional and friendly!",
    date: "2025-04-10",
  },
  {
    id: "FB002",
    customer: "Jane Roe",
    cosplayer: "Bob Johnson",
    service: "Hire Cosplayer",
    rating: 3,
    comment: "Good performance, but arrived a bit late.",
    date: "2025-04-08",
  },
  {
    id: "FB003",
    customer: "Emily Brown",
    cosplayer: "Clara Lee",
    service: "Hire Cosplayer",
    rating: 4,
    comment: "Great costume and interaction with guests!",
    date: "2025-04-05",
  },
];

const ManageFeedback = () => {
  // State quản lý dữ liệu và giao diện
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState(initialFeedbacks);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rowsPerPageOptions = [5, 10, 20];

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = feedbacks.filter(
      (fb) =>
        fb.customer.toLowerCase().includes(term) ||
        fb.cosplayer.toLowerCase().includes(term) ||
        fb.comment.toLowerCase().includes(term)
    );
    setFilteredFeedbacks(filtered);
    setCurrentPage(1);
  };

  // Xử lý sắp xếp
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    const sorted = [...filteredFeedbacks].sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (valA == null && valB == null) return 0;
      if (valA == null) return order === "asc" ? -1 : 1;
      if (valB == null) return order === "asc" ? 1 : -1;
      if (typeof valA === "string") {
        return valA.localeCompare(valB) * (order === "asc" ? 1 : -1);
      }
      return (valA < valB ? -1 : 1) * (order === "asc" ? 1 : -1);
    });
    setFilteredFeedbacks(sorted);
  };

  // Phân trang
  const totalPages = Math.ceil(filteredFeedbacks.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, endIndex);

  // Xử lý modal
  const handleShowModal = (feedback = null) => {
    if (feedback) {
      setIsEditing(true);
      setCurrentFeedback(feedback);
      setFormData({
        rating: feedback.rating,
        comment: feedback.comment,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentFeedback(null);
    setFormData({ rating: 5, comment: "" });
  };

  // Xử lý thay đổi input
  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit form (mô phỏng API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing && currentFeedback?.id) {
        // Mô phỏng cập nhật feedback
        const updatedFeedbacks = feedbacks.map((fb) =>
          fb.id === currentFeedback.id
            ? { ...fb, rating: formData.rating, comment: formData.comment }
            : fb
        );
        setFeedbacks(updatedFeedbacks);
        setFilteredFeedbacks(
          filteredFeedbacks.map((fb) =>
            fb.id === currentFeedback.id
              ? { ...fb, rating: formData.rating, comment: formData.comment }
              : fb
          )
        );
        toast.success("Feedback updated successfully!");
      }
      handleCloseModal();
    } catch (error) {
      setError("Failed to save feedback.");
      toast.error("Failed to save feedback.");
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xóa với Popconfirm
  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      // Mô phỏng xóa feedback
      const updatedFeedbacks = feedbacks.filter((fb) => fb.id !== id);
      setFeedbacks(updatedFeedbacks);
      setFilteredFeedbacks(filteredFeedbacks.filter((fb) => fb.id !== id));
      message.success("Feedback deleted successfully!");
    } catch (error) {
      setError("Failed to delete feedback.");
      message.error("Failed to delete feedback.");
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

  // Render giao diện
  return (
    <div className="manage-feedback">
      <h2 className="manage-feedback-title">Manage Feedback</h2>
      <div className="table-container">
        <Card className="feedback-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Feedbacks</h3>
              <div className="table-controls">
                <Input
                  placeholder="Search by customer, cosplayer, or comment"
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: 200, marginRight: 10 }}
                  prefix="🔍"
                  size="middle"
                />
                <Dropdown
                  onSelect={handleRowsPerPageChange}
                  className="rows-per-page-dropdown"
                >
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="dropdown-rows-per-page"
                    size="sm"
                  >
                    {rowsPerPage} rows
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {rowsPerPageOptions.map((option) => (
                      <Dropdown.Item key={option} eventKey={option}>
                        {option} rows
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            {isLoading && (
              <Box sx={{ width: "100%", marginY: 2 }}>
                <LinearProgress />
              </Box>
            )}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && (
              <>
                <Table striped bordered hover responsive size="sm">
                  <thead className="table-light">
                    <tr>
                      <th onClick={() => handleSort("id")}>
                        ID <ArrowDownAZ />
                      </th>
                      <th onClick={() => handleSort("customer")}>
                        Customer <ArrowDownAZ />
                      </th>
                      <th onClick={() => handleSort("cosplayer")}>
                        Cosplayer <ArrowDownAZ />
                      </th>
                      <th onClick={() => handleSort("service")}>
                        Service <ArrowDownAZ />
                      </th>
                      <th onClick={() => handleSort("rating")}>
                        Rating <ArrowDownUp size={20} />
                      </th>
                      <th onClick={() => handleSort("comment")}>
                        Comment <ArrowDownAZ />
                      </th>
                      <th onClick={() => handleSort("date")}>
                        Date <ArrowDownUp size={20} />
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFeedbacks.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-muted">
                          No feedback found {searchTerm && "matching your search"}.
                        </td>
                      </tr>
                    ) : (
                      paginatedFeedbacks.map((feedback) => (
                        <tr key={feedback.id}>
                          <td>{feedback.id}</td>
                          <td>{feedback.customer}</td>
                          <td>{feedback.cosplayer}</td>
                          <td>{feedback.service}</td>
                          <td>{feedback.rating} ⭐</td>
                          <td title={feedback.comment}>
                            {feedback.comment.length > 50
                              ? `${feedback.comment.substring(0, 50)}...`
                              : feedback.comment}
                          </td>
                          <td>{feedback.date}</td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleShowModal(feedback)}
                              style={{
                                backgroundColor: "#1890ff",
                                borderColor: "#1890ff",
                                color: "#fff",
                                fontSize: "14px",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                marginRight: "8px",
                                boxShadow: "none",
                              }}
                            >
                              Edit
                            </Button>
                            <Popconfirm
                              title="Delete the feedback"
                              description="Are you sure to delete this feedback?"
                              onConfirm={() => handleDelete(feedback.id)}
                              onCancel={() => message.info("Cancelled")}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                type="primary"
                                danger
                                size="small"
                                style={{
                                  backgroundColor: "#ff4d4f",
                                  borderColor: "#ff4d4f",
                                  color: "#fff",
                                  fontSize: "14px",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  boxShadow: "none",
                                }}
                              >
                                Delete
                              </Button>
                            </Popconfirm>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                {totalPages > 1 && (
                  <div className="pagination-controls">
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
        className="feedback-modal"
      >
        <Modal.Header closeButton={!isLoading}>
          <Modal.Title>Edit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && !isLoading && <p className="error-message">{error}</p>}
          <Form onSubmit={handleSubmit}>
            {isEditing && (
              <Form.Group className="mb-3">
                <Form.Label>Feedback ID</Form.Label>
                <Form.Control
                  type="text"
                  value={currentFeedback?.id}
                  readOnly
                  disabled
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Select
                value={formData.rating}
                onChange={(value) => handleInputChange("rating", value)}
                style={{ width: "100%" }}
                disabled={isLoading}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Option key={star} value={star}>
                    {star} ⭐
                  </Option>
                ))}
              </Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comment"
                value={formData.comment}
                onChange={(e) => handleInputChange("comment", e.target.value)}
                required
                disabled={isLoading}
                placeholder="Enter feedback comment"
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
            {isLoading ? "Saving..." : "Update Feedback"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageFeedback;