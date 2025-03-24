// src/components/ManageFestival.jsx
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
import "../../../styles/Manager/ManageFestival.scss";

const ManageFestival = () => {
  // Initial ticket data (mock data updated for new fields)
  const [tickets, setTickets] = useState([
    { ticketId: "T001", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T002", quantity: 3, price: 50, eventId: "E002" },
    { ticketId: "T001", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T002", quantity: 3, price: 50, eventId: "E002" },
    { ticketId: "T001", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T002", quantity: 3, price: 50, eventId: "E002" },
    { ticketId: "T001", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T002", quantity: 3, price: 50, eventId: "E002" },
    { ticketId: "T001", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T002", quantity: 3, price: 50, eventId: "E002" },
    { ticketId: "T001", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T002", quantity: 3, price: 50, eventId: "E002" },
  ]);

  // State for modal visibility and form data
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [formData, setFormData] = useState({
    ticketId: "",
    quantity: "",
    price: "",
    eventId: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set to 10 by default
  const rowsPerPageOptions = [10, 20, 30];

  // Calculate pagination
  const totalPages = Math.ceil(tickets.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedTickets = tickets.slice(startIndex, endIndex);

  // Handle modal open/close
  const handleShowModal = (ticket = null) => {
    if (ticket) {
      // Edit mode
      setIsEditing(true);
      setCurrentTicket(ticket);
      setFormData({ ...ticket });
    } else {
      // Add mode
      setIsEditing(false);
      setFormData({
        ticketId: "",
        quantity: "",
        price: "",
        eventId: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentTicket(null);
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
      // Update ticket
      const updatedTickets = tickets.map((ticket) =>
        ticket.ticketId === currentTicket.ticketId ? formData : ticket
      );
      setTickets(updatedTickets);
    } else {
      // Add new ticket
      setTickets([...tickets, formData]);
    }
    handleCloseModal();
  };

  // Handle delete ticket
  const handleDelete = (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      setTickets(tickets.filter((ticket) => ticket.ticketId !== ticketId));
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
    <div className="manage-festival">
      <h2 className="manage-festival-title">Festival Ticket Management</h2>
      <Button
        variant="primary"
        onClick={() => handleShowModal()}
        className="mb-3 add-ticket-btn"
      >
        Add New Ticket
      </Button>

      {/* Table wrapped in Card */}
      <Card className="ticket-table-card">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead className="table-header">
              <tr>
                <th className="text-center">Ticket ID</th>
                <th className="text-center">Quantity</th>
                <th className="text-center">Price ($)</th>
                <th className="text-center">Event ID</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTickets.map((ticket) => (
                <tr key={ticket.ticketId}>
                  <td className="text-center">{ticket.ticketId}</td>
                  <td className="text-center">{ticket.quantity}</td>
                  <td className="text-center">{ticket.price}</td>
                  <td className="text-center">{ticket.eventId}</td>
                  <td className="text-center">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleShowModal(ticket)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(ticket.ticketId)}
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

      {/* Modal for Add/Edit Ticket */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="ticket-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Ticket" : "Add New Ticket"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Ticket ID</Form.Label>
              <Form.Control
                type="text"
                name="ticketId"
                value={formData.ticketId}
                onChange={handleInputChange}
                required
                disabled={isEditing}
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
                min="1"
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
              <Form.Label>Event ID</Form.Label>
              <Form.Control
                type="text"
                name="eventId"
                value={formData.eventId}
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
            {isEditing ? "Update" : "Add"} Ticket
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageFestival;
