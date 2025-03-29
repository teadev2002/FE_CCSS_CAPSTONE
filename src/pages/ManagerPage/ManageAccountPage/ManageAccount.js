import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
  Button as BootstrapButton,
} from "react-bootstrap";
import { Button, Popconfirm, Image } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../../../styles/Manager/ManageAccount.scss";

const ManageAccount = () => {
  const [accounts, setAccounts] = useState([
    {
      accountId: "A001",
      avatar:
        "https://th.bing.com/th/id/OIP.x7XLoIlBDvp_ojNq4ubfPgHaEK?rs=1&pid=ImgDetMain",
      email: "john.doe@example.com",
      userName: "johndoe123",
      phone: "123-456-7890",
    },
    {
      accountId: "A002",
      avatar:
        "https://th.bing.com/th/id/OIF.Od7o1O6JjQ0EZCMmyF2AwQ?rs=1&pid=ImgDetMain",
      email: "jane.smith@example.com",
      userName: "janesmith456",
      phone: "987-654-3210",
    },
  ]);

  // State for modal visibility and form data
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [formData, setFormData] = useState({
    avatar: "",
    email: "",
    userName: "",
    phone: "",
  });

  // Search and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAccount, setSortAccount] = useState({
    field: "email",
    order: "asc",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rowsPerPageOptions = [5, 10, 20, 30];

  // Filter and sort data
  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.email.toLowerCase().includes(search.toLowerCase()) ||
          item.userName.toLowerCase().includes(search.toLowerCase()) ||
          item.phone.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      const valueA = String(a[sort.field]).toLowerCase();
      const valueB = String(b[sort.field]).toLowerCase();
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredAccounts = filterAndSortData(accounts, searchTerm, sortAccount);
  const totalEntries = filteredAccounts.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedAccounts = paginateData(filteredAccounts, currentPage);

  // Pagination logic
  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  // Calculate "Showing x to x of x entries"
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  // Handle modal open/close
  const handleShowModal = (account = null) => {
    if (account) {
      setIsEditing(true);
      setCurrentAccount(account);
      setFormData({ ...account });
    } else {
      setIsEditing(false);
      setFormData({
        avatar: "",
        email: "",
        userName: "",
        phone: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentAccount(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedAccounts = accounts.map((account) =>
        account.accountId === currentAccount.accountId
          ? { ...formData, accountId: currentAccount.accountId }
          : account
      );
      setAccounts(updatedAccounts);
      toast.success("Account updated successfully!");
    } else {
      setAccounts([...accounts, { ...formData, accountId: `A${Date.now()}` }]);
      toast.success("Account added successfully!");
    }
    handleCloseModal();
  };

  // Handle delete account
  const handleDelete = (accountId) => {
    setAccounts(accounts.filter((account) => account.accountId !== accountId));
    toast.success("Account deleted successfully!");
  };

  // Sort handler
  const handleSort = (field) => {
    setSortAccount((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="manage-account">
      <h2 className="manage-account-title">Manage Accounts</h2>
      <div className="table-container">
        <Card className="account-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Accounts</h3>
              <Form.Control
                type="text"
                placeholder="Search by Email, UserName, or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Button type="primary" onClick={() => handleShowModal()}>
                Add New Account
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("avatar")}
                    >
                      Avatar
                      {sortAccount.field === "avatar" &&
                        (sortAccount.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      {sortAccount.field === "email" &&
                        (sortAccount.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("userName")}
                    >
                      UserName
                      {sortAccount.field === "userName" &&
                        (sortAccount.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("phone")}
                    >
                      Phone
                      {sortAccount.field === "phone" &&
                        (sortAccount.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAccounts.map((account) => (
                  <tr key={account.accountId}>
                    <td className="text-center">
                      {account.avatar ? (
                        <Image
                          src={account.avatar}
                          alt="Avatar"
                          width={50}
                          height={50}
                          style={{ objectFit: "cover" }}
                          preview={{ mask: "Zoom" }}
                        />
                      ) : (
                        "No avatar"
                      )}
                    </td>
                    <td className="text-center">{account.email}</td>
                    <td className="text-center">{account.userName}</td>
                    <td className="text-center">{account.phone}</td>
                    <td className="text-center">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleShowModal(account)}
                        style={{ marginRight: "8px" }}
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Are you sure to delete this account?"
                        onConfirm={() => handleDelete(account.accountId)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="primary" danger size="small">
                          Delete
                        </Button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="pagination-controls">
              <div className="pagination-info">
                <span>{showingText}</span>
                <div className="rows-per-page">
                  <span>Rows per page: </span>
                  <Dropdown
                    onSelect={(value) => handleRowsPerPageChange(Number(value))}
                    className="d-inline-block"
                  >
                    <Dropdown.Toggle
                      variant="secondary"
                      id="dropdown-rows-per-page"
                    >
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
      </div>

      {/* Modal for Add/Edit Account */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="account-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Account" : "Add New Account"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Avatar URL</Form.Label>
              <Form.Control
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>UserName</Form.Label>
              <Form.Control
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <BootstrapButton variant="secondary" onClick={handleCloseModal}>
            Cancel
          </BootstrapButton>
          <BootstrapButton variant="primary" onClick={handleSubmit}>
            {isEditing ? "Update" : "Add"} Account
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageAccount;
