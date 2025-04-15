import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { Button, Popconfirm } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../../../styles/Manager/ManageFestival.scss";

const ManageFestival = () => {
  // Initial ticket data (unchanged)
  const [tickets, setTickets] = useState([
    { ticketId: "T001", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T002", quantity: 3, price: 50, eventId: "E002" },
    { ticketId: "T003", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T004", quantity: 3, price: 50, eventId: "E002" },
    { ticketId: "T005", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T006", quantity: 3, price: 50, eventId: "E002" },
    { ticketId: "T007", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T008", quantity: 3, price: 50, eventId: "E002" },
    { ticketId: "T009", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T010", quantity: 3, price: 50, eventId: "E002" },
    { ticketId: "T011", quantity: 2, price: 50, eventId: "E001" },
    { ticketId: "T012", quantity: 3, price: 50, eventId: "E002" },
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

  // Search and sort states
  const [searchTicket, setSearchTicket] = useState("");
  const [sortTicket, setSortTicket] = useState({
    field: "ticketId",
    order: "asc",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 30];

  // Filter and sort data
  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.ticketId.toLowerCase().includes(search.toLowerCase()) ||
          item.eventId.toLowerCase().includes(search.toLowerCase()) ||
          String(item.quantity).includes(search) ||
          String(item.price).includes(search)
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

  const filteredTickets = filterAndSortData(tickets, searchTicket, sortTicket);
  const totalEntries = filteredTickets.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedTickets = paginateData(filteredTickets, currentPage);

  // Pagination logic
  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  // Calculate "Showing x to x of x entries"
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  // Handle modal open/close
  const handleShowModal = (ticket = null) => {
    if (ticket) {
      setIsEditing(true);
      setCurrentTicket(ticket);
      setFormData({ ...ticket });
    } else {
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
      const updatedTickets = tickets.map((ticket) =>
        ticket.ticketId === currentTicket.ticketId ? { ...formData } : ticket
      );
      setTickets(updatedTickets);
      toast.success("Ticket updated successfully!");
    } else {
      setTickets([...tickets, { ...formData }]);
      toast.success("Ticket added successfully!");
    }
    handleCloseModal();
  };

  // Handle delete ticket
  const handleDelete = (ticketId) => {
    setTickets(tickets.filter((ticket) => ticket.ticketId !== ticketId));
    toast.success("Ticket deleted successfully!");
  };

  // Sort handler
  const handleSort = (field) => {
    setSortTicket((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="manage-festival">
      <h2 className="manage-festival-title">Festival Tickets Management</h2>
      <div className="table-container">
        <Card className="ticket-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Tickets</h3>
              <Form.Control
                type="text"
                placeholder="Search by ID, Quantity, Price, or Event..."
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                className="search-input"
              />
              <Button type="primary" onClick={() => handleShowModal()}>
                Add New Ticket
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("ticketId")}
                    >
                      Ticket ID
                      {sortTicket.field === "ticketId" &&
                        (sortTicket.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("quantity")}
                    >
                      Quantity
                      {sortTicket.field === "quantity" &&
                        (sortTicket.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("price")}
                    >
                      Price ($)
                      {sortTicket.field === "price" &&
                        (sortTicket.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("eventId")}
                    >
                      Event ID
                      {sortTicket.field === "eventId" &&
                        (sortTicket.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
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
                        type="primary"
                        size="small"
                        onClick={() => handleShowModal(ticket)}
                        style={{ marginRight: "8px" }}
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Are you sure to delete this ticket?"
                        onConfirm={() => handleDelete(ticket.ticketId)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="primary" danger size="small">
                          Delete
                        </Button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))}
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
          </Card.Body>
        </Card>
      </div>

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
