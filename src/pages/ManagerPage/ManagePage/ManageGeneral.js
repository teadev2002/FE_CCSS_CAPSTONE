// src/components/ManageGeneral.jsx
import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import "../../../styles/Manager/ManageGeneral.scss";

const ManageGeneral = () => {
  // Initial status data (mock data for demonstration)
  const [statuses, setStatuses] = useState([
    {
      id: "S001",
      statusRequest: "Pending",
      statusContract: "Draft",
      statusTask: "Not Started",
    },
    {
      id: "S002",
      statusRequest: "Approved",
      statusContract: "Signed",
      statusTask: "In Progress",
    },
    {
      id: "S003",
      statusRequest: "Rejected",
      statusContract: "Expired",
      statusTask: "Completed",
    },
    {
      id: "S004",
      statusRequest: "Pending",
      statusContract: "Draft",
      statusTask: "Not Started",
    },
    {
      id: "S005",
      statusRequest: "Approved",
      statusContract: "Signed",
      statusTask: "In Progress",
    },
    {
      id: "S006",
      statusRequest: "Rejected",
      statusContract: "Expired",
      statusTask: "Completed",
    },
  ]);

  // State for modal visibility and form data
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    statusRequest: "",
    statusContract: "",
    statusTask: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Changed to 10
  const rowsPerPageOptions = [10, 20, 30];

  // Calculate pagination
  const totalPages = Math.ceil(statuses.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStatuses = statuses.slice(startIndex, endIndex);

  // Handle modal open/close
  const handleShowModal = (status = null) => {
    if (status) {
      // Edit mode
      setIsEditing(true);
      setCurrentStatus(status);
      setFormData({ ...status });
    } else {
      // Add mode
      setIsEditing(false);
      setFormData({
        id: "",
        statusRequest: "",
        statusContract: "",
        statusTask: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentStatus(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update status
      const updatedStatuses = statuses.map((status) =>
        status.id === currentStatus.id ? formData : status
      );
      setStatuses(updatedStatuses);
    } else {
      // Add new status
      setStatuses([...statuses, formData]);
    }
    handleCloseModal();
  };

  // Handle delete status
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this status?")) {
      setStatuses(statuses.filter((status) => status.id !== id));
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
    <div className="manage-general">
      <h2 className="manage-general-title">Manage Statuses</h2>
      <Button
        variant="primary"
        onClick={() => handleShowModal()}
        className="mb-3 add-status-btn"
      >
        Add New Status
      </Button>

      {/* Table wrapped in Card */}
      <Card className="status-table-card">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Status Request</th>
                <th className="text-center">Status Contract</th>
                <th className="text-center">Status Task</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStatuses.map((status) => (
                <tr key={status.id}>
                  <td className="text-center">{status.id}</td>
                  <td className="text-center">{status.statusRequest}</td>
                  <td className="text-center">{status.statusContract}</td>
                  <td className="text-center">{status.statusTask}</td>
                  <td className="text-center">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleShowModal(status)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(status.id)}
                    >
                      Delete
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

      {/* Modal for Add/Edit Status */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="status-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Status" : "Add New Status"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                required
                disabled={isEditing}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status Request</Form.Label>
              <Form.Select
                name="statusRequest"
                value={formData.statusRequest}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status Contract</Form.Label>
              <Form.Select
                name="statusContract"
                value={formData.statusContract}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Draft">Draft</option>
                <option value="Signed">Signed</option>
                <option value="Expired">Expired</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status Task</Form.Label>
              <Form.Select
                name="statusTask"
                value={formData.statusTask}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? "Update" : "Add"} Status
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageGeneral;
