// src/components/CosplayerActions.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { Popconfirm } from "antd";

const CosplayerActions = ({ row, onEdit, onDelete }) => {
  return (
    <div className="cosplayer-actions">
      <Button
        variant="outline-primary"
        size="sm"
        onClick={() => onEdit(row)}
        className="me-2"
      >
        🛠️
      </Button>
      <Popconfirm
        title="Delete Cosplayer"
        description="Are you sure you want to delete this cosplayer?"
        okText="Yes"
        cancelText="No"
        onConfirm={() => onDelete(row.accountId)}
      >
        <Button variant="outline-danger" size="sm">
          🗑️
        </Button>
      </Popconfirm>
    </div>
  );
};

export default CosplayerActions;
