import React, { useState, useEffect } from "react";
import { Table, Form, Card } from "react-bootstrap";
import {
  Button,
  Popconfirm,
  Modal,
  Dropdown,
  Pagination,
  Menu,
  Image,
} from "antd";
import { ArrowUp, ArrowDown } from "lucide-react";
import RequestCustomerCharacterService from "../../../services/ManageServicePages/ManageRequestCustomerCharacter/RequestCustomerCharacterService.js"; // Đường dẫn tới service
import "../../../styles/Manager/ManageRequestCustomerCharacter.scss";

const ManageRequestCustomerCharacter = () => {
  const [characters, setCharacters] = useState([]);
  const [searchCharacter, setSearchCharacter] = useState("");
  const [sortCharacter, setSortCharacter] = useState({
    field: "customerCharacterId",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const rowsPerPageOptions = [2, 5, 10];
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch data từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data =
          await RequestCustomerCharacterService.getRequestCustomerCharacter();
        setCharacters(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return filtered.sort((a, b) => {
      const valueA = a[sort.field]?.toString().toLowerCase() || "";
      const valueB = b[sort.field]?.toString().toLowerCase() || "";
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredCharacters = filterAndSortData(
    characters,
    searchCharacter,
    sortCharacter
  );
  const totalPages = Math.ceil(filteredCharacters.length / rowsPerPage);
  const paginatedCharacters = paginateData(filteredCharacters, currentPage);

  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  const handleSort = (field) => {
    setSortCharacter((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleShowEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      status: item.status,
      reason: item.reason || "",
      price: item.price || "",
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentItem(null);
  };

  const handleShowViewModal = async (item) => {
    try {
      const detailedData =
        await RequestCustomerCharacterService.getRequestCustomerCharacter(
          item.customerCharacterId
        );
      setCurrentItem(detailedData[0]); // Lấy phần tử đầu tiên từ mảng response
      setShowViewModal(true);
    } catch (error) {
      console.error("Failed to fetch character details:", error);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedCharacters = characters.map((char) =>
      char.customerCharacterId === currentItem.customerCharacterId
        ? { ...char, ...formData }
        : char
    );
    setCharacters(updatedCharacters);
    handleCloseEditModal();
  };

  const handleDelete = (id) => {
    setCharacters(characters.filter((char) => char.customerCharacterId !== id));
  };

  const PaginationControls = ({
    currentPage,
    totalPages,
    onPageChange,
    rowsPerPage,
    onRowsPerPageChange,
    rowsPerPageOptions,
    totalEntries,
    showingEntries,
  }) => (
    <div className="pagination-controls">
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "20px" }}>
          Showing {showingEntries} of {totalEntries} entries
        </span>
        <div className="rows-per-page">
          <span>Rows per page:</span>
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => onRowsPerPageChange(Number(key))}>
                {rowsPerPageOptions.map((option) => (
                  <Menu.Item key={option}>{option}</Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button>{rowsPerPage} ▼</Button>
          </Dropdown>
        </div>
      </div>
      <Pagination
        current={currentPage}
        total={totalEntries}
        pageSize={rowsPerPage}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </div>
  );

  return (
    <div className="manage-general">
      <h2 className="manage-general-title">
        Manage Request Customer Character
      </h2>
      <div className="table-container">
        <Card className="status-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Characters</h3>
              <Form.Control
                type="text"
                placeholder="Search characters..."
                value={searchCharacter}
                onChange={(e) => setSearchCharacter(e.target.value)}
                className="search-input"
              />
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("customerCharacterId")}>
                        Customer Character ID{" "}
                        {sortCharacter.field === "customerCharacterId" &&
                          (sortCharacter.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSort("createBy")}>
                        Account ID{" "}
                        {sortCharacter.field === "createBy" &&
                          (sortCharacter.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSort("categoryId")}>
                        Category ID{" "}
                        {sortCharacter.field === "categoryId" &&
                          (sortCharacter.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSort("createDate")}>
                        Create Date{" "}
                        {sortCharacter.field === "createDate" &&
                          (sortCharacter.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSort("status")}>
                        Status{" "}
                        {sortCharacter.field === "status" &&
                          (sortCharacter.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCharacters.length > 0 ? (
                      paginatedCharacters.map((item) => (
                        <tr key={item.customerCharacterId}>
                          <td>{item.customerCharacterId}</td>
                          <td>{item.createBy}</td>{" "}
                          {/* Account ID thay bằng createBy */}
                          <td>{item.categoryId}</td>
                          <td>{item.createDate}</td>
                          <td>{item.status}</td>
                          <td>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleShowEditModal(item)}
                              style={{ marginRight: "8px" }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              onClick={() => handleShowViewModal(item)}
                              style={{ marginRight: "8px" }}
                            >
                              View
                            </Button>
                            <Popconfirm
                              title="Are you sure to delete this character?"
                              onConfirm={() =>
                                handleDelete(item.customerCharacterId)
                              }
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="primary" danger size="small">
                                Delete
                              </Button>
                            </Popconfirm>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No characters found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={rowsPerPageOptions}
                  totalEntries={filteredCharacters.length}
                  showingEntries={paginatedCharacters.length}
                />
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Edit Character Request"
        open={showEditModal}
        onCancel={handleCloseEditModal}
        footer={[
          <Button key="cancel" onClick={handleCloseEditModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Update
          </Button>,
        ]}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status || ""}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending 🔃</option>
              <option value="Accept">Accept ✅</option>
              <option value="Rejected">Rejected ❌</option>
              <option value="Completed">Completed 🎉</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Reason</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="reason"
              value={formData.reason || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Price (VND)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title="Character Request Details"
        open={showViewModal}
        onCancel={handleCloseViewModal}
        footer={[
          <Button key="close" onClick={handleCloseViewModal}>
            Close
          </Button>,
        ]}
      >
        {currentItem ? (
          <div>
            <p>
              <strong>Customer Character ID:</strong>{" "}
              {currentItem.customerCharacterId}
            </p>
            <p>
              <strong>Category ID:</strong> {currentItem.categoryId}
            </p>
            <p>
              <strong>Name:</strong> {currentItem.name}
            </p>
            <p>
              <strong>Description:</strong> {currentItem.description}
            </p>
            <p>
              <strong>Max Height (cm):</strong> {currentItem.maxHeight}
            </p>
            <p>
              <strong>Max Weight (kg):</strong> {currentItem.maxWeight}
            </p>
            <p>
              <strong>Min Height (cm):</strong> {currentItem.minHeight}
            </p>
            <p>
              <strong>Min Weight (kg):</strong> {currentItem.minWeight}
            </p>
            <p>
              <strong>Status:</strong> {currentItem.status}
            </p>
            <p>
              <strong>Create Date:</strong> {currentItem.createDate}
            </p>
            <p>
              <strong>Update Date:</strong> {currentItem.updateDate || "N/A"}
            </p>
            <p>
              <strong>Create By (Account ID):</strong> {currentItem.createBy}
            </p>
            <p>
              <strong>Reason:</strong> {currentItem.reason || "N/A"}
            </p>
            <p>
              <strong>Images:</strong>
            </p>
            {currentItem.customerCharacterImageResponses &&
            currentItem.customerCharacterImageResponses.length > 0 ? (
              <div>
                {currentItem.customerCharacterImageResponses.map((img) => (
                  <div key={img.customerCharacterImageId}>
                    <Image
                      src={img.urlImage}
                      alt="Character Image"
                      width={100}
                      style={{ margin: "5px" }}
                    />
                    <p>Create Date: {img.createDate}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No images available</p>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

export default ManageRequestCustomerCharacter;
