import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import "../../../styles/Manager/ManageFestival.scss"; // Optional: For custom styles

const ManageFestival = () => {
  // Initial ticket data (mock data updated for new fields)
  const [tickets, setTickets] = useState([
    {
      ticketId: "T001",
      quantity: 2,
      price: 50, // Price per ticket (totalPrice = quantity * price in real app)
      eventId: "E001",
    },
    {
      ticketId: "T002",
      quantity: 3,
      price: 50,
      eventId: "E002",
    },
  ]);

  // State for modal visibility and form data
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [formData, setFormData] = useState({
    ticketId: "",
    quantity: "",
    price: "",
    eventId: "",
  });

  // Define columns for DataGrid with centered text
  const columns = [
    {
      field: "ticketId",
      headerName: "Ticket ID",
      width: 150,
      align: "center", // Center-align cell content
      headerAlign: "center", // Center-align header
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 120,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: "Price ($)",
      width: 120,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "eventId",
      headerName: "Event ID",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      align: "center", // Center-align cell content
      headerAlign: "center", // Center-align header
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleShowModal(params.row)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.ticketId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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

  return (
    <div className="manage-festival">
      <h2 className="manage-festival-title">Festival Ticket Management</h2>
      {/* <Button
        variant="contained"
        color="primary"
        onClick={() => handleShowModal()}
        style={{ marginBottom: 16, marginLeft: "29vh" }}
      >
        Add New Ticket
      </Button> */}

      {/* DataGrid wrapped in Paper */}
      <Paper
        elevation={3}
        style={{
          height: 400,
          width: "70%",
          margin: "0 auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
          textAlign: "center",
        }}
      >
        <DataGrid
          rows={tickets}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.ticketId} // Use ticketId as the unique ID
          disableSelectionOnClick
        />
      </Paper>

      {/* Modal for Add/Edit Ticket */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {isEditing ? "Edit Ticket" : "Add New Ticket"}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Ticket ID"
              name="ticketId"
              value={formData.ticketId}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              disabled={isEditing} // Prevent editing ticketId during update
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Price ($)"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              label="Event ID"
              name="eventId"
              value={formData.eventId}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? "Update" : "Add"} Ticket
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageFestival;
