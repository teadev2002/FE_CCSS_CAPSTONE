// src/components/CosplayerList.jsx
import React, { useState } from "react";
import { Table, Card, Pagination } from "react-bootstrap";
import CosplayerActions from "./CosplayerActions";
import "../../../styles/Manager/ManageCosplayer.scss";

const CosplayerList = ({
  cosplayers,
  onEdit,
  onDelete,
  rowsPerPage,
  setRowsPerPage,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPageOptions = [5, 10, 20, 30]; // Thêm tùy chọn 5 như trong hình

  const totalPages = Math.ceil(cosplayers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCosplayers = cosplayers.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Card className="cosplayer-table-card">
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead className="table-header">
            <tr>
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              {/* <th className="text-center">Description</th>
              <th className="text-center">Birthday</th>
              <th className="text-center">Phone</th> */}
              <th className="text-center">Active</th>
              <th className="text-center">On Task</th>
              <th className="text-center">Leader</th>
              <th className="text-center">Task Quantity</th>
              {/* <th className="text-center">Height (cm)</th>
              <th className="text-center">Weight (kg)</th>
              <th className="text-center">Average Star</th> */}
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
                {/* <td className="text-center">{cosplayer.description}</td>
                <td className="text-center">{cosplayer.birthday}</td>
                <td className="text-center">{cosplayer.phone}</td> */}
                <td className="text-center">
                  {cosplayer.isActive ? "Yes" : "No"}
                </td>
                <td className="text-center">
                  {cosplayer.onTask ? "Yes" : "No"}
                </td>
                <td className="text-center">{cosplayer.leader}</td>
                <td className="text-center">{cosplayer.taskQuantity}</td>
                {/* <td className="text-center">{cosplayer.height}</td>
                <td className="text-center">{cosplayer.weight}</td>
                <td className="text-center">{cosplayer.averageStar}</td> */}
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

        <div className="pagination-controls">
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
