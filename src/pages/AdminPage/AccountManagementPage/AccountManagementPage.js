// src/pages/AccountManagementPage.jsx

// Nhập các thư viện và thành phần cần thiết
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Form, InputGroup, Button, Dropdown } from "react-bootstrap";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Star, Pencil, Lock } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Image } from "antd";
import AccountManagementService from "../../../services/AdminService/AccountManagementService";
import "../../../styles/Admin/AccountManagementPage.scss";

// Thành phần chính của trang quản lý tài khoản
const AccountManagementPage = () => {
  // --- Quản lý trạng thái ---

  // Trạng thái lưu trữ dữ liệu tài khoản theo vai trò
  const [accounts, setAccounts] = useState({
    customers: [],
    cosplayers: [],
    consultants: [],
    managers: [],
    admins: [],
  });

  // Trạng thái cho ô tìm kiếm (tên và email)
  const [searchTerms, setSearchTerms] = useState({
    customers: { name: "", email: "" },
    cosplayers: { name: "", email: "" },
    consultants: { name: "", email: "" },
    managers: { name: "", email: "" },
    admins: { name: "", email: "" },
  });

  // Trạng thái cho lỗi tìm kiếm
  const [searchErrors, setSearchErrors] = useState({
    customers: { name: "", email: "" },
    cosplayers: { name: "", email: "" },
    consultants: { name: "", email: "" },
    managers: { name: "", email: "" },
    admins: { name: "", email: "" },
  });

  // Trạng thái cho phân trang
  const [pagination, setPagination] = useState({
    customers: { currentPage: 1, pageSize: 10 },
    cosplayers: { currentPage: 1, pageSize: 10 },
    consultants: { currentPage: 1, pageSize: 10 },
    managers: { currentPage: 1, pageSize: 10 },
    admins: { currentPage: 1, pageSize: 10 },
  });

  // Ánh xạ mã vai trò (roleId) với tên vai trò
  const roleMapping = {
    R001: "admins",
    R002: "managers",
    R003: "consultants",
    R004: "cosplayers",
    R005: "customers",
  };

  // --- Hàm xử lý logic ---

  // Kiểm tra tính hợp lệ của tên tìm kiếm
  const validateName = (value) => {
    if (value.length > 50) return "Name must not exceed 50 characters.";
    if (!/^[a-zA-Z0-9\s-.]*$/.test(value)) return "Name contains invalid characters.";
    return "";
  };

  // Kiểm tra tính hợp lệ của email tìm kiếm
  const validateEmail = (value) => {
    if (value.length > 100) return "Email must not exceed 100 characters.";
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format.";
    return "";
  };

  // Xử lý sự kiện thay đổi giá trị tìm kiếm (chỉ cập nhật state)
  const handleSearchChange = (role, field, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [role]: { ...prev[role], [field]: value },
    }));

    // Chỉ validate tên ngay lập tức, không validate email ở đây
    if (field === "name") {
      const error = validateName(value);
      setSearchErrors((prev) => ({
        ...prev,
        [role]: { ...prev[role], name: error },
      }));
      if (error) toast.error(error);
    }

    // Reset về trang 1 khi tìm kiếm
    setPagination((prev) => ({
      ...prev,
      [role]: { ...prev[role], currentPage: 1 },
    }));
  };

  // Xử lý sự kiện khi rời khỏi ô nhập liệu (validate email)
  const handleSearchBlur = (role, field, value) => {
    if (field === "email") {
      const error = validateEmail(value);
      setSearchErrors((prev) => ({
        ...prev,
        [role]: { ...prev[role], email: error },
      }));
      if (error) toast.error(error);
    }
  };

  // Lọc danh sách tài khoản dựa trên từ khóa tìm kiếm
  const filterAccounts = (role) => {
    const { name, email } = searchTerms[role];
    return accounts[role].filter((account) => {
      const nameMatch = name
        ? account.name.toLowerCase().includes(name.trim().toLowerCase())
        : true;
      const emailMatch = email
        ? account.email.toLowerCase().includes(email.trim().toLowerCase())
        : true;
      return nameMatch && emailMatch;
    });
  };

  // Phân trang danh sách tài khoản
  const paginateAccounts = (role) => {
    const filtered = filterAccounts(role);
    const { currentPage, pageSize } = pagination[role];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filtered.slice(startIndex, endIndex);
  };

  // Xử lý chuyển trang
  const handlePageChange = (role, page) => {
    setPagination((prev) => ({
      ...prev,
      [role]: { ...prev[role], currentPage: page },
    }));
  };

  // Xử lý thay đổi số lượng tài khoản mỗi trang
  const handlePageSizeChange = (role, size) => {
    setPagination((prev) => ({
      ...prev,
      [role]: { currentPage: 1, pageSize: parseInt(size) },
    }));
  };

  // Lấy URL ảnh avatar
  const getAvatarUrl = (images) => {
    if (!images || images.length === 0) {
      return "https://via.placeholder.com/40?text=No+Image";
    }
    const avatarImage = images.find((img) => img.isAvatar) || images[0];
    return avatarImage.urlImage;
  };

  // Lấy danh sách ảnh để xem trước
  const getImageList = (images) => {
    if (!images || images.length === 0) {
      return ["https://via.placeholder.com/40?text=No+Image"];
    }
    return images.map((img) => img.urlImage);
  };

  // Xử lý sự kiện nhấn nút Edit
  const handleEdit = (accountId) => {
    toast.info(`Edit account ${accountId} clicked`);
    // TODO: Thêm logic chuyển hướng hoặc mở form chỉnh sửa
  };

  // Xử lý sự kiện nhấn nút Disable
  const handleDisable = (accountId) => {
    toast.info(`Disable account ${accountId} clicked`);
    // TODO: Thêm logic gọi API để vô hiệu hóa tài khoản
  };

  // --- Gọi API ---

  // Lấy dữ liệu tài khoản khi component được gắn kết
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const roles = ["R001", "R002", "R003", "R004", "R005"];
        const fetchedAccounts = {
          admins: [],
          managers: [],
          consultants: [],
          cosplayers: [],
          customers: [],
        };

        for (const roleId of roles) {
          const data = await AccountManagementService.getAccountsByRole(roleId);
          const roleKey = roleMapping[roleId];
          fetchedAccounts[roleKey] = Array.isArray(data) ? data : [data];
        }

        setAccounts(fetchedAccounts);
      } catch (error) {
        toast.error(error.message || "Failed to load account data");
      }
    };

    fetchAccounts();
  }, []);

  // --- Hàm render bảng tài khoản ---

  // Hàm tạo bảng tài khoản cho từng vai trò
  const renderAccountTable = (role, title) => {
    const filteredAccounts = filterAccounts(role);
    const paginatedAccounts = paginateAccounts(role);
    const { currentPage, pageSize } = pagination[role];
    const totalPages = Math.ceil(filteredAccounts.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, filteredAccounts.length);

    return (
      <Col lg={12}>
        <Card className="mb-4">
          <Card.Header>
            <h5>{title}</h5>
          </Card.Header>
          <Card.Body>
            <div className="search-container mb-3">
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <InputGroup>
                        <InputGroup.Text>
                          <Search size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          placeholder="Search by name..."
                          value={searchTerms[role].name}
                          onChange={(e) => handleSearchChange(role, "name", e.target.value)}
                          onBlur={(e) => handleSearchBlur(role, "name", e.target.value)}
                          isInvalid={!!searchErrors[role].name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {searchErrors[role].name}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <InputGroup>
                        <InputGroup.Text>
                          <Search size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          placeholder="Search by email..."
                          value={searchTerms[role].email}
                          onChange={(e) => handleSearchChange(role, "email", e.target.value)}
                          onBlur={(e) => handleSearchBlur(role, "email", e.target.value)}
                          isInvalid={!!searchErrors[role].email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {searchErrors[role].email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </div>
            <Table responsive className="aligned-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-name">Name</th>
                  <th className="col-email">Email</th>
                  {role === "cosplayers" && <th className="col-average-star">Average Star</th>}
                  <th className="col-avatar">Avatar</th>
                  <th className="col-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAccounts.map((account) => (
                  <tr key={account.accountId}>
                    <td className="col-id">{account.accountId}</td>
                    <td className="col-name">{account.name}</td>
                    <td className="col-email">{account.email}</td>
                    {role === "cosplayers" && (
                      <td className="col-average-star">
                        {account.averageStar ? (
                          <div className="rating-cell">
                            {account.averageStar}
                            <Star size={14} className="star-filled ms-1" />
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    )}
                    <td className="col-avatar">
                      <Image
                        src={getAvatarUrl(account.images)}
                        alt={`${account.name}'s avatar`}
                        width={40}
                        height={40}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                        preview={{
                          src: getAvatarUrl(account.images),
                          srcList: getImageList(account.images),
                        }}
                      />
                    </td>
                    <td className="col-action">
                      <div className="action-cell">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(account.accountId)}
                        >
                          <Pencil size={14} className="me-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="action-btn disable-btn"
                          onClick={() => handleDisable(account.accountId)}
                        >
                          <Lock size={14} className="me-1" />
                          Disable
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {filteredAccounts.length === 0 ? (
              <p className="text-center mt-3">No accounts found.</p>
            ) : (
              <div className="pagination-container mt-3">
                <div className="pagination-info">
                  Showing {startIndex}-{endIndex} of {filteredAccounts.length} accounts
                </div>
                <div className="pagination-controls">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(role, 1)}
                    className="pagination-btn"
                  >
                    <ChevronsLeft size={16} />
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(role, currentPage - 1)}
                    className="pagination-btn"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="pagination-page">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(role, currentPage + 1)}
                    className="pagination-btn"
                  >
                    <ChevronRight size={16} />
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(role, totalPages)}
                    className="pagination-btn"
                  >
                    <ChevronsRight size={16} />
                  </Button>
                  <Dropdown
                    onSelect={(size) => handlePageSizeChange(role, size)}
                    className="pagination-dropdown"
                  >
                    <Dropdown.Toggle variant="outline-primary" size="sm">
                      {pageSize} per page
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {[5, 10, 20].map((size) => (
                        <Dropdown.Item key={size} eventKey={size}>
                          {size} per page
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  // --- Giao diện người dùng ---

  return (
    <div className="account-management">
      <h1>Account Management</h1>
      <Row>
        {renderAccountTable("customers", "Customer Accounts")}
        {renderAccountTable("cosplayers", "Cosplayer Accounts")}
        {renderAccountTable("consultants", "Consultant Accounts")}
        {renderAccountTable("managers", "Manager Accounts")}
        {renderAccountTable("admins", "Admin Accounts")}
      </Row>
    </div>
  );
};

// Xuất component
export default AccountManagementPage;