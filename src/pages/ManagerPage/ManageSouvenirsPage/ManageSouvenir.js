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
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import "../../../styles/Manager/ManageSouvenir.scss";

const ManageSouvenir = () => {
  // Mock data combining Product and ProductImage tables
  const [products, setProducts] = useState([
    {
      productId: "P001",
      productName: "Cosplay Keychain",
      description: "A keychain featuring a popular anime character.",
      quantity: 50,
      price: 10,
      createDate: "2025-01-01",
      updateDate: "2025-01-02",
      isActive: true,
      urlImage:
        "https://th.bing.com/th/id/OIP.Dud8is2v6yWRRtgZ8ZzE1wHaJ8?rs=1&pid=ImgDetMain",
    },
    {
      productId: "P002",
      productName: "Anime Poster",
      description: "A high-quality poster of your favorite anime.",
      quantity: 30,
      price: 15,
      createDate: "2025-01-03",
      updateDate: "2025-01-04",
      isActive: true,
      urlImage:
        "https://th.bing.com/th/id/OIP.LjAoRHobbppTPYTJy-vZ4gHaLc?rs=1&pid=ImgDetMain",
    },
    {
      productId: "P003",
      productName: "Character Figurine",
      description: "A detailed figurine of a cosplay character.",
      quantity: 20,
      price: 25,
      createDate: "2025-01-05",
      updateDate: "2025-01-06",
      isActive: false,
      urlImage:
        "https://i.etsystatic.com/14159039/r/il/e604d4/1383896438/il_fullxfull.1383896438_in21.jpg",
    },
  ]);

  // State for modal visibility and form data
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    description: "",
    quantity: "",
    price: "",
    createDate: "",
    updateDate: "",
    isActive: true,
    urlImage: "",
  });

  // Define columns for DataGrid (for managers)
  const columns = [
    {
      field: "productId",
      headerName: "Product ID",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "productName",
      headerName: "Product Name",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      align: "center",
      headerAlign: "center",
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
      field: "createDate",
      headerName: "Create Date",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "updateDate",
      headerName: "Update Date",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "urlImage",
      headerName: "Image",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.productName}
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
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
            onClick={() => handleDelete(params.row.productId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Handle modal open/close
  const handleShowModal = (product = null) => {
    if (product) {
      // Edit mode
      setIsEditing(true);
      setCurrentProduct(product);
      setFormData({ ...product });
    } else {
      // Add mode
      setIsEditing(false);
      setFormData({
        productId: "",
        productName: "",
        description: "",
        quantity: "",
        price: "",
        createDate: new Date().toISOString().split("T")[0], // Default to today
        updateDate: new Date().toISOString().split("T")[0], // Default to today
        isActive: true,
        urlImage: "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEditing(false);
    setCurrentProduct(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle switch change for isActive
  const handleSwitchChange = (e) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Update product
      const updatedProducts = products.map((product) =>
        product.productId === currentProduct.productId ? formData : product
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      setProducts([...products, formData]);
    }
    handleCloseModal();
  };

  // Handle delete product
  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(
        products.filter((product) => product.productId !== productId)
      );
    }
  };

  return (
    <div className="manage-souvenirs">
      <h2 className="manage-souvenirs-title">Manage Souvenirs</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleShowModal()}
        style={{ marginBottom: 16 }}
      >
        Add New Souvenir
      </Button>

      {/* DataGrid wrapped in Paper */}
      <Paper
        elevation={3}
        style={{
          height: 400,
          width: "90%",
          margin: "0 auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.9)",
          textAlign: "center",
        }}
      >
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.productId} // Use productId as the unique ID
          disableSelectionOnClick
        />
      </Paper>

      {/* Modal for Add/Edit Souvenir */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {isEditing ? "Edit Souvenir" : "Add New Souvenir"}
        </DialogTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Product ID"
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
              disabled={isEditing} // Prevent editing productId during update
            />
            <TextField
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
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
              required
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
              label="Create Date"
              name="createDate"
              type="date"
              value={formData.createDate}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
              disabled={isEditing} // Prevent editing createDate during update
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
            <TextField
              label="Image URL"
              name="urlImage"
              value={formData.urlImage}
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
            {isEditing ? "Update" : "Add"} Souvenir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageSouvenir;
