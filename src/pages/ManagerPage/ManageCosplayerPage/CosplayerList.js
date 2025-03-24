// src/components/CosplayerList.jsx
import React, { useState } from "react";
import { Table, Card, Pagination, Dropdown } from "react-bootstrap";
import CosplayerActions from "./CosplayerActions";

const CosplayerList = ({ cosplayers, onEdit, onDelete }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set to 10 by default
  const rowsPerPageOptions = [10, 20, 30];

  // Calculate pagination
  const totalPages = Math.ceil(cosplayers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCosplayers = cosplayers.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  return (
    <Card className="cosplayer-table-card">
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead className="table-header">
            <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Description</th>
              <th className="text-center">Birthday</th>
              <th className="text-center">Phone</th>
              <th className="text-center">Active</th>
              <th className="text-center">On Task</th>
              <th className="text-center">Leader</th>
              <th className="text-center">Task Quantity</th>
              <th className="text-center">Height (cm)</th>
              <th className="text-center">Weight (kg)</th>
              <th className="text-center">Average Star</th>
              <th className="text-center">Salary Index</th>
              <th className="text-center">Images</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCosplayers.map((cosplayer) => (
              <tr key={cosplayer.accountId}>
                <td className="text-center">{cosplayer.name}</td>
                <td className="text-center">{cosplayer.email}</td>
                <td className="text-center">{cosplayer.description}</td>
                <td className="text-center">{cosplayer.birthday}</td>
                <td className="text-center">{cosplayer.phone}</td>
                <td className="text-center">
                  {cosplayer.isActive ? "Yes" : "No"}
                </td>
                <td className="text-center">
                  {cosplayer.onTask ? "Yes" : "No"}
                </td>
                <td className="text-center">{cosplayer.leader}</td>
                <td className="text-center">{cosplayer.taskQuantity}</td>
                <td className="text-center">{cosplayer.height}</td>
                <td className="text-center">{cosplayer.weight}</td>
                <td className="text-center">{cosplayer.averageStar}</td>
                <td className="text-center">{cosplayer.salaryIndex}</td>
                <td className="text-center">{`${cosplayer.images.length} image${
                  cosplayer.images.length !== 1 ? "s" : ""
                }`}</td>
                <td className="text-center">
                  <CosplayerActions
                    row={cosplayer}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination Controls */}
        <div className="d-flex justify-content-between align-items-center pagination-controls">
          <div className="rows-per-page">
            <span>Rows per page: </span>
            <Dropdown
              onSelect={(value) => handleRowsPerPageChange(Number(value))}
              className="d-inline-block"
            >
              <Dropdown.Toggle variant="secondary" id="dropdown-rows-per-page">
                {rowsPerPage}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {rowsPerPageOptions.map((option) => (
                  <Dropdown.Item key={option} eventKey={option}>
                    {option}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CosplayerList;
