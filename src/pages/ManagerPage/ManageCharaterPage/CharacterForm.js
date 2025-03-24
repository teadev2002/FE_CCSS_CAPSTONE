// DA CALL DC API, BI LOI IMAGE
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import CharacterImageManager from "./CharacterImageManager";

const CharacterForm = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
  loading,
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      characterId: "",
      categoryId: "",
      characterName: "",
      description: "",
      price: "",
      isActive: true,
      maxHeight: "",
      maxWeight: "",
      minHeight: "",
      minWeight: "",
      quantity: "",
      createDate: new Date().toISOString().split("T")[0],
      updateDate: new Date().toISOString().split("T")[0],
      images: [],
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (e) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? "Edit Character" : "Add New Character"}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Character ID"
            name="characterId"
            value={formData.characterId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            disabled={isEditing || loading}
          />
          <TextField
            label="Category ID"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            label="Character Name"
            name="characterName"
            value={formData.characterName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleSwitchChange}
                name="isActive"
                color="primary"
                disabled={loading}
              />
            }
            label="Active"
            style={{ margin: "16px 0" }}
          />
          <TextField
            label="Max Height (cm)"
            name="maxHeight"
            type="number"
            value={formData.maxHeight}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0 }}
            disabled={loading}
          />
          <TextField
            label="Max Weight (kg)"
            name="maxWeight"
            type="number"
            value={formData.maxWeight}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0 }}
            disabled={loading}
          />
          <TextField
            label="Min Height (cm)"
            name="minHeight"
            type="number"
            value={formData.minHeight}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0 }}
            disabled={loading}
          />
          <TextField
            label="Min Weight (kg)"
            name="minWeight"
            type="number"
            value={formData.minWeight}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 0 }}
            disabled={loading}
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
            inputProps={{ min: 0 }}
            disabled={loading}
          />
          <TextField
            label="Create Date"
            name="createDate"
            type="date"
            value={formData.createDate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            disabled={isEditing || loading}
          />
          <TextField
            label="Update Date"
            name="updateDate"
            type="date"
            value={formData.updateDate}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            disabled={loading}
          />
          <CharacterImageManager
            images={formData.images}
            setImages={(images) => setFormData({ ...formData, images })}
            disabled={loading}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={loading}>
          {isEditing ? "Update" : "Add"} Character
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CharacterForm;
