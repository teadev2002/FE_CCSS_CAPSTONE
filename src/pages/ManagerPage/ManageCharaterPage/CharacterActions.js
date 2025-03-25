import React from "react";
import Button from "react-bootstrap/Button";

const CharacterActions = ({ row, onEdit, onDelete }) => {
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
      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(row.characterId)}
      >
        Delete
      </Button>
    </div>
  );
};

export default CharacterActions;
