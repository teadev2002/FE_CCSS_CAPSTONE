import React from "react";
import Button from "@mui/material/Button";

const CosplayerActions = ({ row, onEdit, onDelete }) => {
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => onEdit(row)}
        style={{ marginRight: 8 }}
      >
        Edit
      </Button>
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() => onDelete(row.accountId)}
      >
        Delete
      </Button>
    </div>
  );
};

export default CosplayerActions;
// Create: CosplayerForm xử lý form thêm mới, gọi onSubmit để thêm vào danh sách.

// Read: CosplayerList hiển thị danh sách cosplayers trong DataGrid.

// Update: CosplayerForm xử lý form chỉnh sửa, gọi onSubmit để cập nhật.

// Delete: CosplayerActions cung cấp nút Delete, gọi onDelete để xóa.
