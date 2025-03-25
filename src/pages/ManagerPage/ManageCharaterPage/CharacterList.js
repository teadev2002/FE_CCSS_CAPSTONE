//boot
import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import CharacterActions from "./CharacterActions";

const CharacterList = ({ characters, onEdit, onDelete }) => {
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State cho sắp xếp
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" hoặc "desc"

  // Các field có thể sắp xếp
  const sortableFields = [
    "price",
    "quantity",
    "maxHeight",
    "maxWeight",
    "minHeight",
    "minWeight",
  ];

  // Logic tìm kiếm
  const filteredCharacters = characters.filter((character) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (character.characterName &&
        character.characterName.toLowerCase().includes(searchLower)) ||
      (character.description &&
        character.description.toLowerCase().includes(searchLower))
    );
  });

  // Logic sắp xếp
  const sortedCharacters = [...filteredCharacters].sort((a, b) => {
    if (!sortField) return 0;

    const valueA = a[sortField];
    const valueB = b[sortField];

    if (sortOrder === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  // Logic phân trang
  const totalRows = sortedCharacters.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCharacters = sortedCharacters.slice(startIndex, endIndex);

  // Xử lý khi thay đổi số rows mỗi trang
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  // Xử lý khi nhấn nút phân trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Xử lý khi nhấn vào tiêu đề cột để sắp xếp
  const handleSort = (field) => {
    if (sortField === field) {
      // Nếu đang sắp xếp theo field này, đảo ngược thứ tự
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Nếu sắp xếp field mới, mặc định là tăng dần
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset về trang đầu tiên khi sắp xếp
  };

  // Xử lý khi thay đổi ô tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Tạo các nút phân trang
  const paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <div
      className="table-responsive"
      style={{ width: "90%", margin: "0 auto" }}
    >
      {/* Ô tìm kiếm */}
      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-50 mx-auto"
        />
      </div>

      <div className="d-flex justify-content-between mb-3">
        <div>
          <Form.Label>Rows per page:</Form.Label>
          <Form.Select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            style={{ width: "auto", display: "inline-block", marginLeft: 8 }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
          </Form.Select>
        </div>
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, totalRows)} of{" "}
          {totalRows} entries
        </div>
      </div>

      <Table striped bordered hover className="shadow-sm">
        <thead>
          <tr>
            <th className="text-center">Character Name</th>
            <th className="text-center">Description</th>
            <th
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("price")}
            >
              Price ($){" "}
              {sortField === "price" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("quantity")}
            >
              Quantity{" "}
              {sortField === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("maxHeight")}
            >
              Max Height (cm){" "}
              {sortField === "maxHeight" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("maxWeight")}
            >
              Max Weight (kg){" "}
              {sortField === "maxWeight" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("minHeight")}
            >
              Min Height (cm){" "}
              {sortField === "minHeight" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="text-center"
              style={{ cursor: "pointer" }}
              onClick={() => handleSort("minWeight")}
            >
              Min Weight (kg){" "}
              {sortField === "minWeight" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="text-center">Images</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCharacters.map((character) => (
            <tr key={character.characterId}>
              <td className="text-center">{character.characterName}</td>
              <td className="text-center">{character.description}</td>
              <td className="text-center">{character.price}</td>
              <td className="text-center">{character.quantity}</td>
              <td className="text-center">{character.maxHeight}</td>
              <td className="text-center">{character.maxWeight}</td>
              <td className="text-center">{character.minHeight}</td>
              <td className="text-center">{character.minWeight}</td>
              <td className="text-center">
                {character.images && character.images.length > 0 ? (
                  <div className="d-flex flex-wrap justify-content-center">
                    {character.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.urlImage}
                        alt={`Image ${index + 1}`}
                        className="img-thumbnail me-1 mb-1"
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                    ))}
                  </div>
                ) : (
                  "No images"
                )}
              </td>
              <td className="text-center">
                <CharacterActions
                  row={character}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center mt-3">
        <Pagination>{paginationItems}</Pagination>
      </div>
    </div>
  );
};

export default CharacterList;
