import React from "react";
import Button from "react-bootstrap/Button";
import { Popconfirm } from "antd"; // Chỉ giữ Popconfirm, bỏ message

const CharacterActions = ({ row, onEdit, onDelete }) => {
  const handleConfirmDelete = () => {
    onDelete(row.characterId); // Gọi hàm onDelete, thông báo sẽ được xử lý trong ManageCharacter.jsx
  };

  const handleCancelDelete = () => {
    // Không cần thông báo ở đây, chỉ hủy hành động
  };

  return (
    <div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => onEdit(row)}
        className="me-2"
      >
        Edit
      </Button>
      <Popconfirm
        title="Delete the character"
        description="Are you sure you want to delete this character?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button variant="danger" size="sm">
          Delete
        </Button>
      </Popconfirm>
    </div>
  );
};

export default CharacterActions;
