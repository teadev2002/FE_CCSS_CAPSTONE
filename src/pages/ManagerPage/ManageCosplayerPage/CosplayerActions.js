// src/components/CosplayerActions.jsx
import React from "react";
import { Button } from "react-bootstrap";

const CosplayerActions = ({ row, onEdit, onDelete }) => {
  return (
    <div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => onEdit(row)}
        className="me-2"
      >
        🛠️
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(row.accountId)}
      >
        🗑️
      </Button>
    </div>
  );
};

export default CosplayerActions;
