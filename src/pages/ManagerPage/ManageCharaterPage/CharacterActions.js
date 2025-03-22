import React from "react";
import Button from "@mui/material/Button";

const CharacterActions = ({ row, onEdit, onDelete }) => {
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
        onClick={() => onDelete(row.characterId)}
      >
        Delete
      </Button>
    </div>
  );
};

export default CharacterActions;
