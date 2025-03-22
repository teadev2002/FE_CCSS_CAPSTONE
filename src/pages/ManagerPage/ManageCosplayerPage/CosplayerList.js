import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import CosplayerActions from "./CosplayerActions";

const CosplayerList = ({ cosplayers, onEdit, onDelete }) => {
  const columns = [
    // {
    //   field: "accountId",
    //   headerName: "Account ID",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
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
      field: "birthday",
      headerName: "Birthday",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "phone",
      headerName: "Phone",
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
      field: "onTask",
      headerName: "On Task",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "leader",
      headerName: "Leader",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "code",
    //   headerName: "Code",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "taskQuantity",
      headerName: "Task Quantity",
      width: 120,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "height",
      headerName: "Height (cm)",
      width: 120,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "weight",
      headerName: "Weight (kg)",
      width: 120,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "averageStar",
      headerName: "Average Star",
      width: 120,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "salaryIndex",
      headerName: "Salary Index",
      width: 120,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    // {
    //   field: "roleId",
    //   headerName: "Role ID",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "images",
      headerName: "Images",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        `${params.value.length} image${params.value.length !== 1 ? "s" : ""}`,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <CosplayerActions
          row={params.row}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];

  return (
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
        rows={cosplayers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.accountId}
        disableSelectionOnClick
      />
    </Paper>
  );
};

export default CosplayerList;
// Create: CosplayerForm xử lý form thêm mới, gọi onSubmit để thêm vào danh sách.

// Read: CosplayerList hiển thị danh sách cosplayers trong DataGrid.

// Update: CosplayerForm xử lý form chỉnh sửa, gọi onSubmit để cập nhật.

// Delete: CosplayerActions cung cấp nút Delete, gọi onDelete để xóa.
