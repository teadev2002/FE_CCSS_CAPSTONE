import React, { useState, useMemo } from "react";
import { Table } from "react-bootstrap";
import { Pagination, Image, Select, Button, Popconfirm, Spin } from "antd";
import { ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "react-toastify";

const CharacterList = ({
  characters,
  onEdit,
  onDelete,
  loading,
  searchTerm,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const sortableFields = [
    "price",
    "quantity",
    "maxHeight",
    "maxWeight",
    "minHeight",
    "minWeight",
  ];

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (character.characterName &&
          character.characterName.toLowerCase().includes(searchLower)) ||
        (character.description &&
          character.description.toLowerCase().includes(searchLower))
      );
    });
  }, [characters, searchTerm]);

  const sortedCharacters = useMemo(() => {
    if (!sortField) return filteredCharacters;
    return [...filteredCharacters].sort((a, b) => {
      const valueA = a[sortField] ?? 0;
      const valueB = b[sortField] ?? 0;
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    });
  }, [filteredCharacters, sortField, sortOrder]);

  const totalRows = sortedCharacters.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCharacters = sortedCharacters.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="character-list">
      {loading ? (
        <div className="loading-spinner">
          {" "}
          <Spin className="loading-spinner" />
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Character Name</th>
                <th>Description</th>
                {sortableFields.map((field) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    style={{ cursor: "pointer" }}
                  >
                    {field.charAt(0).toUpperCase() +
                      field.slice(1).replace(/([A-Z])/g, " $1")}
                    {sortField === field &&
                      (sortOrder === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                ))}
                <th>Images</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCharacters.length > 0 ? (
                paginatedCharacters.map((character) => (
                  <tr key={character.characterId}>
                    <td>{character.characterName}</td>
                    <td>{character.description}</td>
                    <td>{character.price}</td>
                    <td>{character.quantity}</td>
                    <td>{character.maxHeight}</td>
                    <td>{character.maxWeight}</td>
                    <td>{character.minHeight}</td>
                    <td>{character.minWeight}</td>
                    <td>
                      {character.images && character.images.length > 0 ? (
                        <div className="image-gallery">
                          <Image.PreviewGroup>
                            {character.images.map((image, index) => (
                              <Image
                                key={index}
                                src={image.urlImage}
                                alt={`Image ${index + 1}`}
                                width={80}
                                height={80}
                                style={{ objectFit: "cover", marginRight: 8 }}
                              />
                            ))}
                          </Image.PreviewGroup>
                        </div>
                      ) : (
                        "No images"
                      )}
                    </td>
                    <td>
                      <Button
                        type="primary"
                        onClick={() => onEdit(character)}
                        style={{ marginRight: 8 }}
                        aria-label="Edit character"
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Are you sure to delete this character?"
                        onConfirm={() => onDelete(character.characterId)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="primary"
                          danger
                          aria-label="Delete character"
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center">
                    No characters found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className="pagination-controls d-flex justify-content-between align-items-center mt-3">
            <div className="rows-per-page">
              <span>Rows per page:</span>
              <Select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                style={{ width: 80, marginLeft: 8 }}
              >
                {[5, 10, 15, 25].map((value) => (
                  <Select.Option key={value} value={value}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Pagination
              current={currentPage}
              total={totalRows}
              pageSize={rowsPerPage}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
            <span>
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + rowsPerPage, totalRows)} of {totalRows}{" "}
              entries
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default CharacterList;
