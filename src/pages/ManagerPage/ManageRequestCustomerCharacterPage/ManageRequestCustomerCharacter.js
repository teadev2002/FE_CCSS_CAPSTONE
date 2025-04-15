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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequestCustomerCharacterService from "../../../services/ManageServicePages/ManageRequestCustomerCharacter/RequestCustomerCharacterService.js";
import "../../../styles/Manager/ManageRequestCustomerCharacter.scss";

const ManageRequestCustomerCharacter = () => {
  const [characters, setCharacters] = useState([]);
  const [searchCharacter, setSearchCharacter] = useState("");
  const [sortCharacter, setSortCharacter] = useState({
    field: "customerCharacterId",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 30];
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({});
  const [accounts, setAccounts] = useState({});
  const [submitting, setSubmitting] = useState(false); // State để kiểm soát trạng thái submit

  // Fetch data từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data =
          await RequestCustomerCharacterService.getRequestCustomerCharacter();
        setCharacters(data);

        const categoryIds = [...new Set(data.map((item) => item.categoryId))];
        const accountIds = [...new Set(data.map((item) => item.createBy))];

        const categoryPromises = categoryIds.map((id) =>
          RequestCustomerCharacterService.getCategoryById(id)
        );
        const categoryResponses = await Promise.all(categoryPromises);
        const categoriesData = categoryResponses.reduce((acc, category) => {
          acc[category.categoryId] = category;
          return acc;
        }, {});
        setCategories(categoriesData);

        const accountPromises = accountIds.map((id) =>
          RequestCustomerCharacterService.getAccountCustomerCharacter(id)
        );
        const accountResponses = await Promise.all(accountPromises);
        const accountsData = accountResponses.reduce((acc, account) => {
          acc[account.accountId] = account;
          return acc;
        }, {});
        setAccounts(accountsData);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
        toast.error("Failed to load data.");
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
    setFormData({});
  };

  const handleShowViewModal = async (item) => {
    try {
      const detailedData =
        await RequestCustomerCharacterService.getRequestCustomerCharacterById(
          item.customerCharacterId
        );
      setCurrentItem(detailedData[0]);
      setShowViewModal(true);
    } catch (error) {
      console.error("Failed to fetch character details:", error);
      toast.error("Failed to load character details.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.status) {
      toast.error("Please select a status.");
      return;
    }

    if (
      formData.status === "Accept" &&
      (!formData.price || formData.price <= 0)
    ) {
      toast.error(
        "Price is required and must be greater than 0 when status is Accept."
      );
      return;
    }

    if (formData.status === "Reject" && !formData.reason) {
      toast.error("Reason is required when status is Reject.");
      return;
    }

    setSubmitting(true);
    try {
      // Gọi API updateCustomerCharacterStatus
      await RequestCustomerCharacterService.updateCustomerCharacterStatus({
        customerCharacterId: currentItem.customerCharacterId,
        status: formData.status,
        reason: formData.reason || undefined, // Gửi undefined nếu không có reason
        price: formData.price ? Number(formData.price) : undefined, // Gửi undefined nếu không có price
      });

      // Cập nhật state characters
      const updatedCharacters = characters.map((char) =>
        char.customerCharacterId === currentItem.customerCharacterId
          ? {
            ...char,
            status: formData.status,
            reason: formData.reason,
            price: formData.price,
          }
          : char
      );
      setCharacters(updatedCharacters);

      toast.success("Customer character updated successfully!");
      handleCloseEditModal();
    } catch (error) {
      console.error("Failed to update customer character:", error);
      toast.error(error.message || "Failed to update customer character.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setCharacters(characters.filter((char) => char.customerCharacterId !== id));
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories[categoryId];
    return category ? category.categoryName : "N/A";
  };

  const getAccountNameById = (accountId) => {
    const account = accounts[accountId];
    return account ? account.name : "N/A";
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
        Manage Customer Character Requests
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
                      <th
                        onClick={() => handleSort("customerCharacterId")}
                        style={{ display: "none" }}
                      >
                        Customer Character ID{" "}
                        {sortCharacter.field === "customerCharacterId" &&
                          (sortCharacter.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSort("createBy")}>
                        Account Name{" "}
                        {sortCharacter.field === "createBy" &&
                          (sortCharacter.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSort("categoryId")}>
                        Category Name{" "}
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
                          <td style={{ display: "none" }}>
                            {item.customerCharacterId}
                          </td>
                          <td>{getAccountNameById(item.createBy)}</td>
                          <td>{getCategoryNameById(item.categoryId)}</td>
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
          <Button
            key="cancel"
            onClick={handleCloseEditModal}
            disabled={submitting}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={submitting}
            disabled={submitting}
          >
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
              <option value="Reject">Reject ❌</option>
              <option value="Completed">Completed 🎉</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>
              Reason{" "}
              {formData.status === "Reject" && (
                <span style={{ color: "red" }}>*</span>
              )}
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="reason"
              value={formData.reason || ""}
              onChange={handleInputChange}
              required={formData.status === "Reject"}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>
              Price (VND){" "}
              {formData.status === "Accept" && (
                <span style={{ color: "red" }}>*</span>
              )}
            </Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleInputChange}
              required={formData.status === "Accept"}
              min="0"
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
            <p style={{ display: "none" }}>
              <strong>Customer Character ID:</strong>{" "}
              {currentItem.customerCharacterId}
            </p>
            <p>
              <strong>Category Name:</strong>{" "}
              {getCategoryNameById(currentItem.categoryId)}
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
              <strong>Created By:</strong>{" "}
              {getAccountNameById(currentItem.createBy)}
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
