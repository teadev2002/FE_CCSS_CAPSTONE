import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import CharacterActions from "./CharacterActions";

const CharacterList = ({ characters, onEdit, onDelete }) => {
  const columns = [
    // {
    //   field: "characterId",
    //   headerName: "Character ID",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    // {
    //   field: "categoryId",
    //   headerName: "Category ID",
    //   width: 120,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "characterName",
      headerName: "Character Name",
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
      field: "price",
      headerName: "Price ($)",
      width: 120,
      type: "number",
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
      field: "maxHeight",
      headerName: "Max Height (cm)",
      width: 120,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "maxWeight",
      headerName: "Max Weight (kg)",
      width: 120,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "minHeight",
      headerName: "Min Height (cm)",
      width: 120,
      type: "number",
      align: "center",
      headerAlign: "center",
    },
    {
      field: "minWeight",
      headerName: "Min Weight (kg)",
      width: 120,
      type: "number",
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
        <CharacterActions
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
        rows={characters}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.characterId}
        disableSelectionOnClick
      />
    </Paper>
  );
};

export default CharacterList;
