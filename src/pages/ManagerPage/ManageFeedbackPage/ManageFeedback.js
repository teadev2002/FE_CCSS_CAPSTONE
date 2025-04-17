import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { Button, Popconfirm, message, Select } from "antd";
import { toast } from "react-toastify";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../../../styles/Manager/ManageFeedback.scss";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const { Option } = Select;

const initialFeedbacks = [
  {
    id: "FB001",
    customer: "John Doe",
    cosplayerName: "Alice Smith",
    service: "Hire Cosplayer",
    rating: 5,
    comment: "Alice was fantastic, very professional and friendly!",
    date: "2025-04-10",
  },
  {
    id: "FB002",
    customer: "Jane Roe",
    cosplayerName: "Bob Johnson",
    service: "Hire Cosplayer",
    rating: 3,
    comment: "Good performance overall, but arrived a bit late.",
    date: "2025-04-08",
  },
  {
    id: "FB003",
    customer: "Emily Brown",
    cosplayerName: "Clara Lee",
    service: "Hire Cosplayer",
    rating: 4,
    comment: "Great costume and interaction with guests!",
    date: "2025-04-05",
  },
];

const ManageFeedback = () => {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
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
  const [sortFeedback, setSortFeedback] = useState({
    field: "cosplayerName",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 30];

  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.customer.toLowerCase().includes(search.toLowerCase()) ||
          item.cosplayerName.toLowerCase().includes(search.toLowerCase()) ||
          item.comment.toLowerCase().includes(search.toLowerCase())
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

  const filteredFeedbacks = filterAndSortData(feedbacks, searchTerm, sortFeedback);
  const totalEntries = filteredFeedbacks.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedFeedbacks = paginateData(filteredFeedbacks, currentPage);

  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

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

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing && currentFeedback?.id) {
        const updatedFeedbacks = feedbacks.map((fb) =>
          fb.id === currentFeedback.id
            ? { ...fb, rating: formData.rating, comment: formData.comment }
            : fb
        );
        setFeedbacks(updatedFeedbacks);
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

  const handleDelete = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedFeedbacks = feedbacks.filter((fb) => fb.id !== id);
      setFeedbacks(updatedFeedbacks);
      message.success("Feedback deleted successfully!");
    } catch (error) {
      setError("Failed to delete feedback.");
      message.error("Failed to delete feedback.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortFeedback((prev) => ({
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

  return (
    <div className="manage-feedback">
      <h2 className="manage-feedback-title">Manage Feedbacks</h2>
      <div className="table-container">
        <Card className="feedback-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Feedbacks</h3>
              <Form.Control
                type="text"
                placeholder="Search by customer, cosplayer, or comment..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <div></div>
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
                      <th className="text-center">Customer</th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("cosplayerName")}
                        >
                          Cosplayer
                          {sortFeedback.field === "cosplayerName" ? (
                            sortFeedback.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Service</th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("rating")}
                        >
                          Rating
                          {sortFeedback.field === "rating" ? (
                            sortFeedback.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Comment</th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("date")}
                        >
                          Date
                          {sortFeedback.field === "date" ? (
                            sortFeedback.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFeedbacks.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No feedback found {searchTerm && "matching your search"}.
                        </td>
                      </tr>
                    ) : (
                      paginatedFeedbacks.map((feedback) => (
                        <tr key={feedback.id}>
                          <td className="text-center">{feedback.customer}</td>
                          <td className="text-center">{feedback.cosplayerName}</td>
                          <td className="text-center">{feedback.service}</td>
                          <td className="text-center">{feedback.rating} ⭐</td>
                          <td className="text-center">{feedback.comment}</td>
                          <td className="text-center">{feedback.date}</td>
                          <td className="text-center">
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleShowModal(feedback)}
                              style={{ marginRight: "8px" }}
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
        className="feedback-modal"
      >
        <Modal.Header closeButton={!isLoading}>
          <Modal.Title>Edit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && !isLoading && <p className="error-message">{error}</p>}
          <Form onSubmit={handleSubmit}>
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