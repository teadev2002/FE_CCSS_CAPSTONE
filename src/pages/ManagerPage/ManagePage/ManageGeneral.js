import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import "../../../styles/Manager/ManageGeneral.scss"; // For custom styles

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
  ]);

  // State for modal visibility and form data
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    statusRequest: "",
    statusContract: "",
    statusTask: "",
  });

  // Define columns for DataGrid
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "statusRequest",
      headerName: "Status Request",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "statusContract",
      headerName: "Status Contract",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "statusTask",
      headerName: "Status Task",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      align: "center",
      headerAlign: "center",
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
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

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
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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

  return (
    <div className="manage-general">
      <h2 className="manage-general-title">Manage Statuses</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleShowModal()}
        style={{ marginBottom: 16 }}
      >
        Add New Status
      </Button>

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
          rows={statuses}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.id} // Use id as the unique ID
          disableSelectionOnClick
        />
      </Paper>

      {/* Modal for Add/Edit Status */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {isEditing ? "Edit Status" : "Add New Status"}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              disabled={isEditing} // Prevent editing ID during update
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status Request</InputLabel>
              <Select
                name="statusRequest"
                value={formData.statusRequest}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status Contract</InputLabel>
              <Select
                name="statusContract"
                value={formData.statusContract}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Signed">Signed</MenuItem>
                <MenuItem value="Expired">Expired</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status Task</InputLabel>
              <Select
                name="statusTask"
                value={formData.statusTask}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? "Update" : "Add"} Status
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageGeneral;
