import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import CosplayerImageManager from "./CosplayerImageManager";

const CosplayerForm = ({ open, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState(
    initialData || {
      accountId: "",
      name: "",
      email: "",
      password: "",
      description: "",
      birthday: new Date().toISOString().split("T")[0],
      phone: "",
      isActive: true,
      onTask: false,
      leader: "",
      code: "",
      taskQuantity: "",
      height: "",
      weight: "",
      averageStar: "",
      salaryIndex: "",
      roleId: "",
      images: [],
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? "Edit Cosplayer" : "Add New Cosplayer"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Account ID"
            name="accountId"
            value={formData.accountId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            disabled={isEditing}
          />
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required={!isEditing}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            label="Birthday"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleSwitchChange}
                name="isActive"
                color="primary"
              />
            }
            label="Active"
            style={{ margin: "16px 0" }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.onTask}
                onChange={handleSwitchChange}
                name="onTask"
                color="primary"
              />
            }
            label="On Task"
            style={{ margin: "16px 0" }}
          />
          <TextField
            label="Leader"
            name="leader"
            value={formData.leader}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Code"
            name="code"
            value={formData.code}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Task Quantity"
            name="taskQuantity"
            type="number"
            value={formData.taskQuantity}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Average Star"
            name="averageStar"
            type="number"
            value={formData.averageStar}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
          />
          <TextField
            label="Salary Index"
            name="salaryIndex"
            type="number"
            value={formData.salaryIndex}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            inputProps={{ min: 0, step: 0.1 }}
          />
          <TextField
            label="Role ID"
            name="roleId"
            value={formData.roleId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <CosplayerImageManager
            images={formData.images}
            setImages={(images) => setFormData({ ...formData, images })}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {isEditing ? "Update" : "Add"} Cosplayer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CosplayerForm;
// Create: CosplayerForm xử lý form thêm mới, gọi onSubmit để thêm vào danh sách.

// Read: CosplayerList hiển thị danh sách cosplayers trong DataGrid.

// Update: CosplayerForm xử lý form chỉnh sửa, gọi onSubmit để cập nhật.

// Delete: CosplayerActions cung cấp nút Delete, gọi onDelete để xóa.
