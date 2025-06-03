// import React, { useState, useEffect } from "react";
// import { Card, Row, Col, Table, Form, InputGroup, Button, Dropdown, Modal } from "react-bootstrap";
// import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Star, Eye, Lock, Unlock } from "lucide-react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Image } from "antd";
// import AccountManagementService from "../../../services/AdminService/AccountManagementService";
// import "../../../styles/Admin/AccountManagementPage.scss";

// // Component trang quản lý tài khoản
// const AccountManagementPage = () => {
//   // --- Quản lý trạng thái ---

//   // Trạng thái lưu trữ dữ liệu tài khoản theo vai trò
//   const [accounts, setAccounts] = useState({
//     customers: [],
//     cosplayers: [],
//     consultants: [],
//     managers: [],
//     admins: [],
//   });

//   // Trạng thái cho ô tìm kiếm (tên và email)
//   const [searchTerms, setSearchTerms] = useState({
//     customers: { name: "", email: "" },
//     cosplayers: { name: "", email: "" },
//     consultants: { name: "", email: "" },
//     managers: { name: "", email: "" },
//     admins: { name: "", email: "" },
//   });

//   // Trạng thái cho lỗi tìm kiếm
//   const [searchErrors, setSearchErrors] = useState({
//     customers: { name: "", email: "" },
//     cosplayers: { name: "", email: "" },
//     consultants: { name: "", email: "" },
//     managers: { name: "", email: "" },
//     admins: { name: "", email: "" },
//   });

//   // Trạng thái cho phân trang
//   const [pagination, setPagination] = useState({
//     customers: { currentPage: 1, pageSize: 10 },
//     cosplayers: { currentPage: 1, pageSize: 10 },
//     consultants: { currentPage: 1, pageSize: 10 },
//     managers: { currentPage: 1, pageSize: 10 },
//     admins: { currentPage: 1, pageSize: 10 },
//   });

//   // Trạng thái cho bộ lọc trạng thái tài khoản
//   const [statusFilters, setStatusFilters] = useState({
//     customers: "all",
//     cosplayers: "all",
//     consultants: "all",
//     managers: "all",
//     admins: "all",
//   });

//   // Trạng thái cho modal chi tiết tài khoản
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState(null);

//   // Trạng thái cho modal xác nhận disable/enable
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [confirmAction, setConfirmAction] = useState(null);

//   // Ánh xạ mã vai trò (roleId) với tên vai trò
//   const roleMapping = {
//     R001: "admins",
//     R002: "managers",
//     R003: "consultants",
//     R004: "cosplayers",
//     R005: "customers",
//   };

//   // --- Hàm xử lý logic ---

//   // Kiểm tra tính hợp lệ của tên tìm kiếm
//   const validateName = (value) => {
//     if (value.length > 50) return "Name must not exceed 50 characters.";
//     if (!/^[a-zA-Z0-9\s-.]*$/.test(value)) return "Name contains invalid characters.";
//     return "";
//   };

//   // Kiểm tra tính hợp lệ của email tìm kiếm
//   const validateEmail = (value) => {
//     if (value.length > 100) return "Email must not exceed 100 characters.";
//     if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format.";
//     return "";
//   };

//   // Xử lý sự kiện thay đổi giá trị tìm kiếm
//   const handleSearchChange = (role, field, value) => {
//     setSearchTerms((prev) => ({
//       ...prev,
//       [role]: { ...prev[role], [field]: value },
//     }));

//     if (field === "name") {
//       const error = validateName(value);
//       setSearchErrors((prev) => ({
//         ...prev,
//         [role]: { ...prev[role], name: error },
//       }));
//       if (error) toast.error(error);
//     }

//     setPagination((prev) => ({
//       ...prev,
//       [role]: { ...prev[role], currentPage: 1 },
//     }));
//   };

//   // Xử lý sự kiện khi rời khỏi ô nhập liệu (validate email)
//   const handleSearchBlur = (role, field, value) => {
//     if (field === "email") {
//       const error = validateEmail(value);
//       setSearchErrors((prev) => ({
//         ...prev,
//         [role]: { ...prev[role], email: error },
//       }));
//       if (error) toast.error(error);
//     }
//   };

//   // Xử lý thay đổi bộ lọc trạng thái
//   const handleStatusFilterChange = (role, filter) => {
//     setStatusFilters((prev) => ({
//       ...prev,
//       [role]: filter,
//     }));
//     setPagination((prev) => ({
//       ...prev,
//       [role]: { ...prev[role], currentPage: 1 },
//     }));
//   };

//   // Lọc danh sách tài khoản dựa trên từ khóa tìm kiếm và trạng thái
//   const filterAccounts = (role) => {
//     const { name, email } = searchTerms[role];
//     const statusFilter = statusFilters[role];
//     return accounts[role].filter((account) => {
//       const nameMatch = name
//         ? account.name.toLowerCase().includes(name.trim().toLowerCase())
//         : true;
//       const emailMatch = email
//         ? account.email.toLowerCase().includes(email.trim().toLowerCase())
//         : true;
//       const statusMatch =
//         statusFilter === "all"
//           ? true
//           : statusFilter === "active"
//             ? account.isActive === true
//             : account.isActive === false;
//       return nameMatch && emailMatch && statusMatch;
//     });
//   };

//   // Phân trang danh sách tài khoản
//   const paginateAccounts = (role) => {
//     const filtered = filterAccounts(role);
//     const { currentPage, pageSize } = pagination[role];
//     const startIndex = (currentPage - 1) * pageSize;
//     const endIndex = startIndex + pageSize;
//     return filtered.slice(startIndex, endIndex);
//   };

//   // Xử lý chuyển trang
//   const handlePageChange = (role, page) => {
//     setPagination((prev) => ({
//       ...prev,
//       [role]: { ...prev[role], currentPage: page },
//     }));
//   };

//   // Xử lý thay đổi số lượng tài khoản mỗi trang
//   const handlePageSizeChange = (role, size) => {
//     setPagination((prev) => ({
//       ...prev,
//       [role]: { currentPage: 1, pageSize: parseInt(size) },
//     }));
//   };

//   // Lấy URL ảnh avatar
//   const getAvatarUrl = (images) => {
//     if (!images || images.length === 0) {
//       return "https://via.placeholder.com/40?text=No+Image";
//     }
//     const avatarImage = images.find((img) => img.isAvatar) || images[0];
//     return avatarImage.urlImage;
//   };

//   // Lấy danh sách ảnh để xem trước
//   const getImageList = (images) => {
//     if (!images || images.length === 0) {
//       return ["https://via.placeholder.com/40?text=No+Image"];
//     }
//     return images.map((img) => img.urlImage);
//   };

//   // Xử lý sự kiện nhấn nút View Details
//   const handleViewDetails = async (accountId) => {
//     try {
//       const accountData = await AccountManagementService.getAccountById(accountId);
//       // Log dữ liệu images để debug
//       console.log("Images from API:", accountData.images);
//       // Loại bỏ hình ảnh trùng lặp dựa trên urlImage
//       if (accountData.images && Array.isArray(accountData.images)) {
//         const uniqueImages = Array.from(
//           new Map(accountData.images.map((img) => [img.urlImage, img])).values()
//         );
//         accountData.images = uniqueImages;
//         console.log("Unique images after deduplication:", uniqueImages);
//       }
//       setSelectedAccount(accountData);
//       setShowModal(true);
//     } catch (error) {
//       toast.error(error.message || "Failed to load account details");
//     }
//   };

//   // Xử lý sự kiện nhấn nút Disable/Enable (hiển thị modal xác nhận)
//   const handleToggleStatus = (accountId, currentStatus, role) => {
//     setConfirmAction({
//       accountId,
//       currentStatus,
//       role,
//       action: currentStatus ? "disable" : "enable",
//     });
//     setShowConfirmModal(true);
//   };

//   // Xác nhận hành động disable/enable
//   const confirmToggleStatus = async () => {
//     if (!confirmAction) return;
//     const { accountId, currentStatus, role } = confirmAction;
//     const newStatus = !currentStatus;
//     try {
//       await AccountManagementService.updateAccountStatus(accountId, newStatus);
//       toast.success(`Account ${newStatus ? "enabled" : "disabled"} successfully`);
//       // Cập nhật danh sách tài khoản
//       setAccounts((prev) => ({
//         ...prev,
//         [role]: prev[role].map((account) =>
//           account.accountId === accountId ? { ...account, isActive: newStatus } : account
//         ),
//       }));
//       // Cập nhật selectedAccount nếu đang mở modal
//       if (selectedAccount && selectedAccount.accountId === accountId) {
//         setSelectedAccount((prev) => ({ ...prev, isActive: newStatus }));
//       }
//     } catch (error) {
//       toast.error(error.message || `Failed to ${newStatus ? "enable" : "disable"} account`);
//     } finally {
//       setShowConfirmModal(false);
//       setConfirmAction(null);
//     }
//   };

//   // Hủy xác nhận
//   const cancelToggleStatus = () => {
//     setShowConfirmModal(false);
//     setConfirmAction(null);
//   };

//   // Đóng modal chi tiết
//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedAccount(null);
//   };

//   // Định dạng giá thuê cosplayer
//   const formatHourlyRate = (rate) => {
//     return `${rate.toLocaleString("vi-VN")}/h VND`;
//   };

//   // --- Gọi API ---

//   // Lấy dữ liệu tài khoản khi component được gắn kết
//   useEffect(() => {
//     const fetchAccounts = async () => {
//       try {
//         const roles = ["R001", "R002", "R003", "R004", "R005"];
//         const fetchedAccounts = {
//           admins: [],
//           managers: [],
//           consultants: [],
//           cosplayers: [],
//           customers: [],
//         };

//         for (const roleId of roles) {
//           const data = await AccountManagementService.getAccountsByRole(roleId);
//           const roleKey = roleMapping[roleId];
//           fetchedAccounts[roleKey] = Array.isArray(data) ? data : [data];
//         }

//         setAccounts(fetchedAccounts);
//       } catch (error) {
//         toast.error(error.message || "Failed to load account data");
//       }
//     };

//     fetchAccounts();
//   }, []);

//   // --- Hàm render bảng tài khoản ---

//   // Hàm tạo bảng tài khoản cho từng vai trò
//   const renderAccountTable = (role, title) => {
//     const filteredAccounts = filterAccounts(role);
//     const paginatedAccounts = paginateAccounts(role);
//     const { currentPage, pageSize } = pagination[role];
//     const totalPages = Math.ceil(filteredAccounts.length / pageSize);
//     const startIndex = (currentPage - 1) * pageSize + 1;
//     const endIndex = Math.min(currentPage * pageSize, filteredAccounts.length);

//     // Các tùy chọn bộ lọc trạng thái
//     const statusFilterOptions = [
//       { value: "all", label: "All Accounts" },
//       { value: "active", label: "Active Accounts" },
//       { value: "blocked", label: "Disabled Accounts" },
//     ];

//     return (
//       <Col lg={12}>
//         <Card className="mb-5 account-table-card">
//           <Card.Header className="d-flex justify-content-between align-items-center">
//             <h5>{title}</h5>
//             <Dropdown onSelect={(value) => handleStatusFilterChange(role, value)}>
//               <Dropdown.Toggle variant="outline-secondary" size="sm">
//                 {statusFilterOptions.find((opt) => opt.value === statusFilters[role])?.label}
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 {statusFilterOptions.map((option) => (
//                   <Dropdown.Item key={option.value} eventKey={option.value}>
//                     {option.label}
//                   </Dropdown.Item>
//                 ))}
//               </Dropdown.Menu>
//             </Dropdown>
//           </Card.Header>
//           <Card.Body>
//             <div className="search-container mb-3">
//               <Form>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Group>
//                       <InputGroup>
//                         <InputGroup.Text>
//                           <Search size={16} />
//                         </InputGroup.Text>
//                         <Form.Control
//                           type="text"
//                           placeholder="Search by name..."
//                           value={searchTerms[role].name}
//                           onChange={(e) => handleSearchChange(role, "name", e.target.value)}
//                           onBlur={(e) => handleSearchBlur(role, "name", e.target.value)}
//                           isInvalid={!!searchErrors[role].name}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {searchErrors[role].name}
//                         </Form.Control.Feedback>
//                       </InputGroup>
//                     </Form.Group>
//                   </Col>
//                   <Col md={6}>
//                     <Form.Group>
//                       <InputGroup>
//                         <InputGroup.Text>
//                           <Search size={16} />
//                         </InputGroup.Text>
//                         <Form.Control
//                           type="email"
//                           placeholder="Search by email..."
//                           value={searchTerms[role].email}
//                           onChange={(e) => handleSearchChange(role, "email", e.target.value)}
//                           onBlur={(e) => handleSearchBlur(role, "email", e.target.value)}
//                           isInvalid={!!searchErrors[role].email}
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {searchErrors[role].email}
//                         </Form.Control.Feedback>
//                       </InputGroup>
//                     </Form.Group>
//                   </Col>
//                 </Row>
//               </Form>
//             </div>
//             <Table responsive className="aligned-table">
//               <thead>
//                 <tr>
//                   <th className="col-id">ID</th>
//                   <th className="col-name">Name</th>
//                   <th className="col-email">Email</th>
//                   {role === "cosplayers" && <th className="col-average-star">Average Star</th>}
//                   <th className="col-avatar">Avatar</th>
//                   <th className="col-action">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedAccounts.map((account, index) => (
//                   <tr key={account.accountId} className={index % 2 === 0 ? "even-row" : "odd-row"}>
//                     <td className="col-id">{account.accountId}</td>
//                     <td className="col-name">{account.name}</td>
//                     <td className="col-email">{account.email}</td>
//                     {role === "cosplayers" && (
//                       <td className="col-average-star">
//                         {account.averageStar ? (
//                           <div className="rating-cell">
//                             {account.averageStar}
//                             <Star size={14} className="star-filled ms-1" />
//                           </div>
//                         ) : (
//                           "N/A"
//                         )}
//                       </td>
//                     )}
//                     <td className="col-avatar">
//                       <Image
//                         src={getAvatarUrl(account.images)}
//                         alt={`${account.name}'s avatar`}
//                         width={40}
//                         height={40}
//                         style={{
//                           borderRadius: "50%",
//                           objectFit: "cover",
//                           cursor: "pointer",
//                         }}
//                         preview={{
//                           src: getAvatarUrl(account.images),
//                           srcList: getImageList(account.images),
//                         }}
//                       />
//                     </td>
//                     <td className="col-action">
//                       <div className="action-cell">
//                         <Button
//                           variant="outline-primary"
//                           size="sm"
//                           className="action-btn view-details-btn"
//                           onClick={() => handleViewDetails(account.accountId)}
//                         >
//                           <Eye size={14} className="me-1" />
//                           View Details
//                         </Button>
//                         <Button
//                           variant={account.isActive ? "outline-danger" : "outline-success"}
//                           size="sm"
//                           className="action-btn status-btn"
//                           onClick={() => handleToggleStatus(account.accountId, account.isActive, role)}
//                         >
//                           {account.isActive ? (
//                             <>
//                               <Lock size={14} className="me-1" />
//                               Disable
//                             </>
//                           ) : (
//                             <>
//                               <Unlock size={14} className="me-1" />
//                               Enable
//                             </>
//                           )}
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             {filteredAccounts.length === 0 ? (
//               <p className="text-center mt-3">No accounts found.</p>
//             ) : (
//               <div className="pagination-container mt-3">
//                 <div className="pagination-info">
//                   Showing {startIndex}-{endIndex} of {filteredAccounts.length} accounts
//                 </div>
//                 <div className="pagination-controls">
//                   <Button
//                     variant="outline-primary"
//                     size="sm"
//                     disabled={currentPage === 1}
//                     onClick={() => handlePageChange(role, 1)}
//                     className="pagination-btn"
//                   >
//                     <ChevronsLeft size={16} />
//                   </Button>
//                   <Button
//                     variant="outline-primary"
//                     size="sm"
//                     disabled={currentPage === 1}
//                     onClick={() => handlePageChange(role, currentPage - 1)}
//                     className="pagination-btn"
//                   >
//                     <ChevronLeft size={16} />
//                   </Button>
//                   <span className="pagination-page">
//                     Page {currentPage} of {totalPages}
//                   </span>
//                   <Button
//                     variant="outline-primary"
//                     size="sm"
//                     disabled={currentPage === totalPages}
//                     onClick={() => handlePageChange(role, currentPage + 1)}
//                     className="pagination-btn"
//                   >
//                     <ChevronRight size={16} />
//                   </Button>
//                   <Button
//                     variant="outline-primary"
//                     size="sm"
//                     disabled={currentPage === totalPages}
//                     onClick={() => handlePageChange(role, totalPages)}
//                     className="pagination-btn"
//                   >
//                     <ChevronsRight size={16} />
//                   </Button>
//                   <Dropdown
//                     onSelect={(size) => handlePageSizeChange(role, size)}
//                     className="pagination-dropdown"
//                   >
//                     <Dropdown.Toggle variant="outline-primary" size="sm">
//                       {pageSize} per page
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       {[5, 10, 20].map((size) => (
//                         <Dropdown.Item key={size} eventKey={size}>
//                           {size} per page
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </div>
//               </div>
//             )}
//           </Card.Body>
//         </Card>
//       </Col>
//     );
//   };

//   // --- Giao diện người dùng ---

//   return (
//     <div className="account-management">
//       <h1>Account Management</h1>
//       <Row>
//         {renderAccountTable("customers", "Customer Accounts")}
//         {renderAccountTable("cosplayers", "Cosplayer Accounts")}
//         {renderAccountTable("consultants", "Consultant Accounts")}
//         {renderAccountTable("managers", "Manager Accounts")}
//         {renderAccountTable("admins", "Admin Accounts")}
//       </Row>

//       {/* Modal chi tiết tài khoản */}
//       <Modal
//         show={showModal}
//         onHide={handleCloseModal}
//         centered
//         size="lg"
//         style={{
//           zIndex: 1050,
//         }}
//       >
//         <Modal.Header
//           closeButton
//           style={{
//             background: "linear-gradient(135deg, #3498db, #2ecc71)",
//             color: "#fff",
//             borderBottom: "none",
//             padding: "1.5rem",
//             position: "relative",
//           }}
//         >
//           <Modal.Title style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.5px" }}>
//             Account Details
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body
//           style={{
//             padding: "2rem",
//             background: "#fff",
//             borderRadius: "0 0 16px 16px",
//             maxHeight: "70vh",
//             overflowY: "auto",
//           }}
//         >
//           {selectedAccount ? (
//             <div style={{ width: "100%" }}>
//               <Row>
//                 <Col md={6} style={{ marginBottom: "2rem" }}>
//                   <h6
//                     style={{
//                       fontSize: "1.25rem",
//                       fontWeight: 600,
//                       color: "#1a1a2e",
//                       marginBottom: "1rem",
//                       position: "relative",
//                     }}
//                   >
//                     Basic Information
//                     <span
//                       style={{
//                         display: "block",
//                         width: "40px",
//                         height: "3px",
//                         background: "linear-gradient(135deg, #3498db, #2ecc71)",
//                         marginTop: "0.5rem",
//                         borderRadius: "2px",
//                       }}
//                     />
//                   </h6>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "0.75rem",
//                       padding: "0.5rem 0",
//                       borderBottom: "1px solid #e9ecef",
//                     }}
//                   >
//                     <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
//                       Account ID:
//                     </span>
//                     <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
//                       {selectedAccount.accountId}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "0.75rem",
//                       padding: "0.5rem 0",
//                       borderBottom: "1px solid #e9ecef",
//                     }}
//                   >
//                     <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
//                       Name:
//                     </span>
//                     <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
//                       {selectedAccount.name}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "0.75rem",
//                       padding: "0.5rem 0",
//                       borderBottom: "1px solid #e9ecef",
//                     }}
//                   >
//                     <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
//                       Email:
//                     </span>
//                     <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
//                       {selectedAccount.email}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "0.75rem",
//                       padding: "0.5rem 0",
//                       borderBottom: "1px solid #e9ecef",
//                     }}
//                   >
//                     <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
//                       Phone:
//                     </span>
//                     <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
//                       {selectedAccount.phone || "N/A"}
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "0.75rem",
//                       padding: "0.5rem 0",
//                       borderBottom: "1px solid #e9ecef",
//                     }}
//                   >
//                     <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
//                       Birthday:
//                     </span>
//                     <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
//                       {selectedAccount.birthday}
//                     </span>
//                   </div>
//                 </Col>
//                 {roleMapping["R004"] === "cosplayers" && selectedAccount.height && (
//                   <Col md={6} style={{ marginBottom: "2rem" }}>
//                     <h6
//                       style={{
//                         fontSize: "1.25rem",
//                         fontWeight: 600,
//                         color: "#1a1a2e",
//                         marginBottom: "1rem",
//                         position: "relative",
//                       }}
//                     >
//                       Cosplayer Details
//                       <span
//                         style={{
//                           display: "block",
//                           width: "40px",
//                           height: "3px",
//                           background: "linear-gradient(135deg, #3498db, #2ecc71)",
//                           marginTop: "0.5rem",
//                           borderRadius: "2px",
//                         }}
//                       />
//                     </h6>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         marginBottom: "0.75rem",
//                         padding: "0.5rem 0",
//                         borderBottom: "1px solid #e9ecef",
//                       }}
//                     >
//                       <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
//                         Average Star:
//                       </span>
//                       <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
//                         {selectedAccount.averageStar ? (
//                           <span style={{ display: "flex", alignItems: "center" }}>
//                             {selectedAccount.averageStar}
//                             <Star
//                               size={14}
//                               style={{ color: "#f1c40f", fill: "#f1c40f", marginLeft: "0.25rem" }}
//                             />
//                           </span>
//                         ) : (
//                           "N/A"
//                         )}
//                       </span>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         marginBottom: "0.75rem",
//                         padding: "0.5rem 0",
//                         borderBottom: "1px solid #e9ecef",
//                       }}
//                     >
//                       <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
//                         Height:
//                       </span>
//                       <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
//                         {selectedAccount.height} cm
//                       </span>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         marginBottom: "0.75rem",
//                         padding: "0.5rem 0",
//                         borderBottom: "1px solid #e9ecef",
//                       }}
//                     >
//                       <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
//                         Weight:
//                       </span>
//                       <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
//                         {selectedAccount.weight} kg
//                       </span>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         marginBottom: "0.75rem",
//                         padding: "0.5rem 0",
//                         borderBottom: "1px solid #e9ecef",
//                       }}
//                     >
//                       <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
//                         Hourly Rate:
//                       </span>
//                       <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
//                         {formatHourlyRate(selectedAccount.salaryIndex)}
//                       </span>
//                     </div>
//                   </Col>
//                 )}
//               </Row>
//               <div style={{ marginTop: "2rem" }}>
//                 <h6
//                   style={{
//                     fontSize: "1.25rem",
//                     fontWeight: 600,
//                     color: "#1a1a2e",
//                     marginBottom: "1rem",
//                     position: "relative",
//                   }}
//                 >
//                   Images
//                   <span
//                     style={{
//                       display: "block",
//                       width: "40px",
//                       height: "3px",
//                       background: "linear-gradient(135deg, #3498db, #2ecc71)",
//                       marginTop: "0.5rem",
//                       borderRadius: "2px",
//                     }}
//                   />
//                 </h6>
//                 {selectedAccount.images && selectedAccount.images.length > 0 ? (
//                   <div
//                     style={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: "1.5rem",
//                       marginTop: "1rem",
//                     }}
//                   >
//                     {selectedAccount.images.map((img, index) => (
//                       <img
//                         key={`${img.urlImage}-${index}`} // Sử dụng urlImage và index làm key để đảm bảo duy nhất
//                         src={img.urlImage}
//                         alt={`Account image ${index + 1}`}
//                         style={{
//                           width: "250px",
//                           height: "250px",
//                           objectFit: "cover",
//                           borderRadius: "12px",
//                           boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
//                           transition: "transform 0.3s ease, box-shadow 0.3s ease",
//                         }}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <p style={{ color: "#6c757d", fontStyle: "italic", marginTop: "1rem" }}>
//                     No images available
//                   </p>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <p style={{ textAlign: "center", color: "#2c3e50" }}>
//               Loading account details...
//             </p>
//           )}
//         </Modal.Body>
//         <Modal.Footer
//           style={{
//             padding: "1.5rem",
//             borderTop: "none",
//             background: "#fff",
//             display: "flex",
//             justifyContent: "flex-end",
//             gap: "1rem",
//           }}
//         >
//           <Button
//             variant="secondary"
//             onClick={handleCloseModal}
//             style={{
//               background: "#6c757d",
//               border: "none",
//               borderRadius: "8px",
//               padding: "0.5rem 1.5rem",
//               fontSize: "0.9rem",
//               transition: "background 0.3s ease",
//             }}
//             onMouseOver={(e) => (e.target.style.background = "#5c636a")}
//             onMouseOut={(e) => (e.target.style.background = "#6c757d")}
//           >
//             Close
//           </Button>
//           {selectedAccount && (
//             <Button
//               variant={selectedAccount.isActive ? "danger" : "success"}
//               onClick={() =>
//                 handleToggleStatus(
//                   selectedAccount.accountId,
//                   selectedAccount.isActive,
//                   roleMapping["R004"] === "cosplayers" && selectedAccount.height
//                     ? "cosplayers"
//                     : roleMapping[
//                     Object.keys(roleMapping).find((key) =>
//                       roleMapping[key] ===
//                       Object.keys(accounts).find((r) =>
//                         accounts[r].some((acc) => acc.accountId === selectedAccount.accountId)
//                       )
//                     )
//                     ]
//                 )
//               }
//               style={{
//                 background: selectedAccount.isActive ? "#e74c3c" : "#2ecc71",
//                 border: "none",
//                 borderRadius: "8px",
//                 padding: "0.5rem 1.5rem",
//                 fontSize: "0.9rem",
//                 fontWeight: 600,
//                 transition: "transform 0.3s ease, box-shadow 0.3s ease",
//               }}
//               onMouseOver={(e) =>
//                 (e.target.style.background = selectedAccount.isActive ? "#c0392b" : "#27ae60")
//               }
//               onMouseOut={(e) =>
//                 (e.target.style.background = selectedAccount.isActive ? "#e74c3c" : "#2ecc71")
//               }
//             >
//               {selectedAccount.isActive ? "Disable Account" : "Enable Account"}
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>

//       {/* Modal xác nhận disable/enable */}
//       <Modal
//         show={showConfirmModal}
//         onHide={cancelToggleStatus}
//         centered
//         size="sm"
//         style={{
//           zIndex: 1050,
//         }}
//       >
//         <Modal.Header
//           closeButton
//           style={{
//             background: "linear-gradient(135deg, #3498db, #2ecc71)",
//             color: "#fff",
//             borderBottom: "none",
//             padding: "1rem",
//             textAlign: "center",
//           }}
//         >
//           <Modal.Title style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0 auto", marginLeft: "0px" }}>
//             Confirm Action
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body
//           style={{
//             padding: "1.5rem",
//             textAlign: "center",
//             fontSize: "1rem",
//             color: "#2c3e50",
//           }}
//         >
//           <p style={{ margin: 0 }}>
//             Are you sure you want to {confirmAction?.action} this account?
//           </p>
//         </Modal.Body>
//         <Modal.Footer
//           style={{
//             padding: "1rem",
//             borderTop: "none",
//             display: "flex",
//             justifyContent: "center",
//             gap: "1rem",
//           }}
//         >
//           <Button
//             variant="secondary"
//             onClick={cancelToggleStatus}
//             style={{
//               background: "#6c757d",
//               border: "none",
//               borderRadius: "8px",
//               padding: "0.5rem 1.5rem",
//               fontSize: "0.9rem",
//               transition: "background 0.3s ease",
//             }}
//             onMouseOver={(e) => (e.target.style.background = "#5c636a")}
//             onMouseOut={(e) => (e.target.style.background = "#6c757d")}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant={confirmAction?.action === "disable" ? "danger" : "success"}
//             onClick={confirmToggleStatus}
//             style={{
//               background: confirmAction?.action === "disable" ? "#e74c3c" : "#2ecc71",
//               border: "none",
//               borderRadius: "8px",
//               padding: "0.5rem 1.5rem",
//               fontSize: "0.9rem",
//               fontWeight: 600,
//               transition: "transform 0.3s ease, box-shadow 0.3s ease",
//             }}
//             onMouseOver={(e) =>
//             (e.target.style.background =
//               confirmAction?.action === "disable" ? "#c0392b" : "#27ae60")
//             }
//             onMouseOut={(e) =>
//             (e.target.style.background =
//               confirmAction?.action === "disable" ? "#e74c3c" : "#2ecc71")
//             }
//           >
//             Confirm
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AccountManagementPage;

//-------------------------------------------------------------------------------//

//sửa ngày 02/06/2025

import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Form, InputGroup, Button, Dropdown, Modal } from "react-bootstrap";
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Star, Eye, Lock, Unlock, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Image } from "antd";
import AccountManagementService from "../../../services/AdminService/AccountManagementService";
import "../../../styles/Admin/AccountManagementPage.scss";

// Component trang quản lý tài khoản
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

  // Trạng thái cho bộ lọc trạng thái tài khoản
  const [statusFilters, setStatusFilters] = useState({
    customers: "all",
    cosplayers: "all",
    consultants: "all",
    managers: "all",
    admins: "all",
  });

  // Trạng thái cho modal chi tiết tài khoản
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Trạng thái cho modal xác nhận disable/enable
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // Trạng thái cho modal tạo tài khoản
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    roleId: "",
    name: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    phone: "",
    height: "",
    weight: "",
    salaryIndex: "",
  });
  const [createErrors, setCreateErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Trạng thái cho modal xác nhận tạo tài khoản
  const [showCreateConfirmModal, setShowCreateConfirmModal] = useState(false);

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

  // Xử lý sự kiện thay đổi giá trị tìm kiếm
  const handleSearchChange = (role, field, value) => {
    setSearchTerms((prev) => ({
      ...prev,
      [role]: { ...prev[role], [field]: value },
    }));

    if (field === "name") {
      const error = validateName(value);
      setSearchErrors((prev) => ({
        ...prev,
        [role]: { ...prev[role], name: error },
      }));
      if (error) toast.error(error);
    }

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

  // Xử lý thay đổi bộ lọc trạng thái
  const handleStatusFilterChange = (role, filter) => {
    setStatusFilters((prev) => ({
      ...prev,
      [role]: filter,
    }));
    setPagination((prev) => ({
      ...prev,
      [role]: { ...prev[role], currentPage: 1 },
    }));
  };

  // Lọc danh sách tài khoản dựa trên từ khóa tìm kiếm và trạng thái
  const filterAccounts = (role) => {
    const { name, email } = searchTerms[role];
    const statusFilter = statusFilters[role];
    return accounts[role].filter((account) => {
      const nameMatch = name
        ? account.name.toLowerCase().includes(name.trim().toLowerCase())
        : true;
      const emailMatch = email
        ? account.email.toLowerCase().includes(email.trim().toLowerCase())
        : true;
      const statusMatch =
        statusFilter === "all"
          ? true
          : statusFilter === "active"
            ? account.isActive === true
            : account.isActive === false;
      return nameMatch && emailMatch && statusMatch;
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

  // Xử lý sự kiện nhấn nút View Details
  const handleViewDetails = async (accountId) => {
    try {
      const accountData = await AccountManagementService.getAccountById(accountId);
      console.log("Images from API:", accountData.images);
      if (accountData.images && Array.isArray(accountData.images)) {
        const uniqueImages = Array.from(
          new Map(accountData.images.map((img) => [img.urlImage, img])).values()
        );
        accountData.images = uniqueImages;
        console.log("Unique images after deduplication:", uniqueImages);
      }
      setSelectedAccount(accountData);
      setShowModal(true);
    } catch (error) {
      toast.error(error.message || "Failed to load account details");
    }
  };

  // Xử lý sự kiện nhấn nút Disable/Enable
  const handleToggleStatus = (accountId, currentStatus, role) => {
    setConfirmAction({
      accountId,
      currentStatus,
      role,
      action: currentStatus ? "disable" : "enable",
    });
    setShowConfirmModal(true);
  };

  // Xác nhận hành động disable/enable
  const confirmToggleStatus = async () => {
    if (!confirmAction) return;
    const { accountId, currentStatus, role } = confirmAction;
    const newStatus = !currentStatus;
    try {
      await AccountManagementService.updateAccountStatus(accountId, newStatus);
      toast.success(`Account ${newStatus ? "enabled" : "disabled"} successfully`);
      setAccounts((prev) => ({
        ...prev,
        [role]: prev[role].map((account) =>
          account.accountId === accountId ? { ...account, isActive: newStatus } : account
        ),
      }));
      if (selectedAccount && selectedAccount.accountId === accountId) {
        setSelectedAccount((prev) => ({ ...prev, isActive: newStatus }));
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${newStatus ? "enable" : "disable"} account`);
    } finally {
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  // Hủy xác nhận
  const cancelToggleStatus = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  // Đóng modal chi tiết
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAccount(null);
  };

  // Định dạng giá thuê cosplayer
  const formatHourlyRate = (rate) => {
    return `${rate.toLocaleString("vi-VN")}/h VND`;
  };

  // Xử lý mở modal tạo tài khoản
  const handleShowCreateModal = (role) => {
    const roleIdMap = {
      admins: "R001",
      managers: "R002",
      consultants: "R003",
      cosplayers: "R004",
    };
    setCreateFormData({
      roleId: roleIdMap[role] || "",
      name: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      birthday: "",
      phone: "",
      height: "",
      weight: "",
      salaryIndex: "",
    });
    setCreateErrors({});
    setShowCreateModal(true);
  };

  // Xử lý đóng modal tạo tài khoản
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({});
    setCreateErrors({});
  };

  // Xử lý thay đổi input trong modal tạo tài khoản
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Kiểm tra dữ liệu form tạo tài khoản
  const validateCreateForm = () => {
    const newErrors = {};

    // Name
    if (!createFormData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (createFormData.name.length > 50) {
      newErrors.name = "Name must not exceed 50 characters.";
    } else if (!/^[a-zA-Z0-9\s-.]*$/.test(createFormData.name)) {
      newErrors.name = "Name contains invalid characters.";
    }

    // Email
    if (!createFormData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(createFormData.email)) {
      newErrors.email = "Email is invalid.";
    } else if (createFormData.email.length > 100) {
      newErrors.email = "Email must not exceed 100 characters.";
    }

    // UserName
    if (!createFormData.userName.trim()) {
      newErrors.userName = "Username is required.";
    } else if (createFormData.userName.length > 50) {
      newErrors.userName = "Username must not exceed 50 characters.";
    } else if (!/^[a-zA-Z0-9\s-.]*$/.test(createFormData.userName)) {
      newErrors.userName = "Username contains invalid characters.";
    }

    // Password
    if (!createFormData.password) {
      newErrors.password = "Password is required.";
    } else if (createFormData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Confirm Password
    if (createFormData.confirmPassword !== createFormData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Phone
    if (!createFormData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\+?\d{10,}$/.test(createFormData.phone)) {
      newErrors.phone = "Phone number is invalid (e.g., +1234567890).";
    }

    // Birthday
    if (!createFormData.birthday) {
      newErrors.birthday = "Birthday is required.";
    } else {
      const today = new Date();
      const birthday = new Date(createFormData.birthday);
      if (birthday > today) {
        newErrors.birthday = "Birthday cannot be in the future.";
      } else {
        const age = today.getFullYear() - birthday.getFullYear();
        const monthDiff = today.getMonth() - birthday.getMonth();
        const dayDiff = today.getDate() - birthday.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          if (age - 1 < 18) {
            newErrors.birthday = "You must be 18 years or older.";
          }
        } else if (age < 18) {
          newErrors.birthday = "You must be 18 years or older.";
        }
      }
    }

    // Height (Cosplayer only)
    if (createFormData.roleId === "R004") {
      if (!createFormData.height) {
        newErrors.height = "Height is required.";
      } else if (isNaN(createFormData.height) || createFormData.height <= 0) {
        newErrors.height = "Height must be a positive number.";
      } else if (createFormData.height > 300) {
        newErrors.height = "Height cannot exceed 300 cm.";
      }
    }

    // Weight (Cosplayer only)
    if (createFormData.roleId === "R004") {
      if (!createFormData.weight) {
        newErrors.weight = "Weight is required.";
      } else if (isNaN(createFormData.weight) || createFormData.weight <= 0) {
        newErrors.weight = "Weight must be a positive number.";
      } else if (createFormData.weight > 500) {
        newErrors.weight = "Weight cannot exceed 500 kg.";
      }
    }

    // Salary Index (Cosplayer only)
    if (createFormData.roleId === "R004") {
      if (!createFormData.salaryIndex) {
        newErrors.salaryIndex = "Salary rate is required.";
      } else if (isNaN(createFormData.salaryIndex) || createFormData.salaryIndex <= 0) {
        newErrors.salaryIndex = "Salary rate must be a positive number.";
      }
    }

    return newErrors;
  };

  // Xử lý submit form tạo tài khoản
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateCreateForm();
    setCreateErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Mở modal xác nhận thay vì gọi API
      setShowCreateConfirmModal(true);
    }
  };

  const confirmCreateAccount = async () => {
    setIsLoading(true);
    try {
      const payload = {
        roleId: createFormData.roleId,
        name: createFormData.name,
        email: createFormData.email,
        userName: createFormData.userName,
        password: createFormData.password,
        birthday: formatDateToDDMMYYYY(createFormData.birthday),
        phone: createFormData.phone,
        height: createFormData.roleId === "R004" ? Number(createFormData.height) : 0,
        weight: createFormData.roleId === "R004" ? Number(createFormData.weight) : 0,
        salaryIndex: createFormData.roleId === "R004" ? Number(createFormData.salaryIndex) : 0,
      };
      await AccountManagementService.createAccount(payload);
      toast.success("Account created successfully!");
      const data = await AccountManagementService.getAccountsByRole(createFormData.roleId);
      setAccounts((prev) => ({
        ...prev,
        [roleMapping[createFormData.roleId]]: Array.isArray(data) ? data : [data],
      }));
      handleCloseCreateModal();
    } catch (error) {
      toast.error(error.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
      setShowCreateConfirmModal(false); // Đóng modal xác nhận
    }
  };

  const cancelCreateConfirm = () => {
    setShowCreateConfirmModal(false);
  };

  // Định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
  const formatDateToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Tính ngày tối đa cho phép chọn (18 năm trước)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split("T")[0];
  };

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

  const renderAccountTable = (role, title) => {
    const filteredAccounts = filterAccounts(role);
    const paginatedAccounts = paginateAccounts(role);
    const { currentPage, pageSize } = pagination[role];
    const totalPages = Math.ceil(filteredAccounts.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, filteredAccounts.length);

    const statusFilterOptions = [
      { value: "all", label: "All Accounts" },
      { value: "active", label: "Active Accounts" },
      { value: "blocked", label: "Disabled Accounts" },
    ];

    return (
      <Col lg={12}>
        <Card className="mb-5 account-table-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5>{title}</h5>
            <div className="d-flex align-items-center gap-2">
              {role !== "customers" && (
                <Button
                  size="sm"
                  onClick={() => handleShowCreateModal(role)}
                  style={{
                    background: "linear-gradient(135deg, #3498db, #2ecc71)",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "background 0.3s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background = "linear-gradient(135deg, #2ecc71, #3498db)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background = "linear-gradient(135deg, #3498db, #2ecc71)")
                  }
                >
                  <PlusCircle size={14} />
                  Create Account
                </Button>
              )}
              <Dropdown onSelect={(value) => handleStatusFilterChange(role, value)}>
                <Dropdown.Toggle variant="outline-secondary" size="sm">
                  {statusFilterOptions.find((opt) => opt.value === statusFilters[role])?.label}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {statusFilterOptions.map((option) => (
                    <Dropdown.Item key={option.value} eventKey={option.value}>
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
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
                {paginatedAccounts.map((account, index) => (
                  <tr key={account.accountId} className={index % 2 === 0 ? "even-row" : "odd-row"}>
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
                          className="action-btn view-details-btn"
                          onClick={() => handleViewDetails(account.accountId)}
                        >
                          <Eye size={14} className="me-1" />
                          View Details
                        </Button>
                        <Button
                          variant={account.isActive ? "outline-danger" : "outline-success"}
                          size="sm"
                          className="action-btn status-btn"
                          onClick={() => handleToggleStatus(account.accountId, account.isActive, role)}
                        >
                          {account.isActive ? (
                            <>
                              <Lock size={14} className="me-1" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Unlock size={14} className="me-1" />
                              Enable
                            </>
                          )}
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

      {/* Modal chi tiết tài khoản */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        style={{ zIndex: 1050 }}
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #3498db, #2ecc71)",
            color: "#fff",
            borderBottom: "none",
            padding: "1.5rem",
          }}
        >
          <Modal.Title style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.5px" }}>
            Account Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: "2rem",
            background: "#fff",
            borderRadius: "0 0 16px 16px",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          {selectedAccount ? (
            <div style={{ width: "100%" }}>
              <Row>
                <Col md={6} style={{ marginBottom: "2rem" }}>
                  <h6
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#1a1a2e",
                      marginBottom: "1rem",
                    }}
                  >
                    Basic Information
                    <span
                      style={{
                        display: "block",
                        width: "40px",
                        height: "3px",
                        background: "linear-gradient(135deg, #3498db, #2ecc71)",
                        marginTop: "0.5rem",
                        borderRadius: "2px",
                      }}
                    />
                  </h6>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #e9ecef",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
                      Account ID:
                    </span>
                    <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
                      {selectedAccount.accountId}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #e9ecef",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
                      Name:
                    </span>
                    <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
                      {selectedAccount.name}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #e9ecef",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
                      Email:
                    </span>
                    <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
                      {selectedAccount.email}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #e9ecef",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
                      Phone:
                    </span>
                    <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
                      {selectedAccount.phone || "N/A"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid #e9ecef",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
                      Birthday:
                    </span>
                    <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
                      {selectedAccount.birthday}
                    </span>
                  </div>
                </Col>
                {roleMapping["R004"] === "cosplayers" && selectedAccount.height && (
                  <Col md={6} style={{ marginBottom: "2rem" }}>
                    <h6
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#1a1a2e",
                        marginBottom: "1rem",
                      }}
                    >
                      Cosplayer Details
                      <span
                        style={{
                          display: "block",
                          width: "40px",
                          height: "3px",
                          background: "linear-gradient(135deg, #3498db, #2ecc71)",
                          marginTop: "0.5rem",
                          borderRadius: "2px",
                        }}
                      />
                    </h6>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid #e9ecef",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
                        Average Star:
                      </span>
                      <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
                        {selectedAccount.averageStar ? (
                          <span style={{ display: "flex", alignItems: "center" }}>
                            {selectedAccount.averageStar}
                            <Star
                              size={14}
                              style={{ color: "#f1c40f", fill: "#f1c40f", marginLeft: "0.25rem" }}
                            />
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid #e9ecef",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
                        Height:
                      </span>
                      <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
                        {selectedAccount.height} cm
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid #e9ecef",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
                        Weight:
                      </span>
                      <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
                        {selectedAccount.weight} kg
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.75rem",
                        padding: "0.5rem 0",
                        borderBottom: "1px solid #e9ecef",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: "#2c3e50", width: "120px" }}>
                        Hourly Rate:
                      </span>
                      <span style={{ color: "#34495e", flex: 1, fontSize: "0.95rem" }}>
                        {selectedAccount.salaryIndex.toLocaleString("vi-VN")} VND/h
                      </span>
                    </div>
                  </Col>
                )}
              </Row>
              <div style={{ marginTop: "2rem" }}>
                <h6
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#1a1a2e",
                    marginBottom: "1rem",
                  }}
                >
                  Images
                  <span
                    style={{
                      display: "block",
                      width: "40px",
                      height: "3px",
                      background: "linear-gradient(135deg, #3498db, #2ecc71)",
                      marginTop: "0.5rem",
                      borderRadius: "2px",
                    }}
                  />
                </h6>
                {selectedAccount.images && selectedAccount.images.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "1.5rem",
                      marginTop: "1rem",
                    }}
                  >
                    {selectedAccount.images.map((img, index) => (
                      <img
                        key={`${img.urlImage}-${index}`}
                        src={img.urlImage}
                        alt={`Account image ${index + 1}`}
                        style={{
                          width: "250px",
                          height: "250px",
                          objectFit: "cover",
                          borderRadius: "12px",
                          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#6c757d", fontStyle: "italic", marginTop: "1rem" }}>
                    No images available
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#2c3e50" }}>
              Loading account details...
            </p>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{
            padding: "1.5rem",
            borderTop: "none",
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            gap: "1rem",
          }}
        >
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            style={{
              background: "#6c757d",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.5rem",
              fontSize: "0.9rem",
            }}
          >
            Close
          </Button>
          {selectedAccount && (
            <Button
              variant={selectedAccount.isActive ? "danger" : "success"}
              onClick={() =>
                handleToggleStatus(
                  selectedAccount.accountId,
                  selectedAccount.isActive,
                  roleMapping[
                  Object.keys(roleMapping).find((key) =>
                    roleMapping[key] ===
                    Object.keys(accounts).find((r) =>
                      accounts[r].some((acc) => acc.accountId === selectedAccount.accountId)
                    )
                  )
                  ]
                )
              }
              style={{
                background: selectedAccount.isActive ? "#e74c3c" : "#2ecc71",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1.5rem",
                fontSize: "0.9rem",
              }}
            >
              {selectedAccount.isActive ? "Disable Account" : "Enable Account"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận disable/enable */}
      <Modal
        show={showConfirmModal}
        onHide={cancelToggleStatus}
        centered
        size="sm"
        style={{ zIndex: 1050 }}
      >
        <Modal.Header
          closeButton
          style={{
            background: "linear-gradient(135deg, #3498db, #2ecc71)",
            color: "white",
            borderBottom: "none",
            padding: "1rem",
          }}
        >
          <Modal.Title style={{ fontSize: 18, fontWeight: 600, margin: "0 auto" }}>
            Confirm Action
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            padding: "1.5rem",
            textAlign: "center",
            fontSize: "1rem",
            color: "#2c3e50",
          }}
        >
          <p style={{ margin: 0 }}>
            Are you sure you want to {confirmAction?.action} this account?
          </p>
        </Modal.Body>
        <Modal.Footer
          style={{
            padding: "1rem",
            borderTop: "none",
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Button
            variant="secondary"
            onClick={cancelToggleStatus}
            style={{
              background: "#6c757d",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.5rem",
              fontSize: "0.9rem",
            }}
          >
            Cancel
          </Button>
          <Button
            variant={confirmAction?.action === "disable" ? "danger" : "success"}
            onClick={confirmToggleStatus}
            style={{
              background: confirmAction?.action === "disable" ? "#e74c3c" : "#2ecc71",
              border: "none",
              borderRadius: "8px",
              padding: "0.5rem 1.5rem",
              fontSize: "0.9rem",
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal tạo tài khoản */}
      <Modal
        show={showCreateModal}
        onHide={handleCloseCreateModal}
        centered
        style={{ zIndex: 1050 }}
      >
        <Modal.Header
          closeButton={!isLoading}
          style={{
            background: "linear-gradient(135deg, #3498db, #2ecc71)",
            color: "#fff",
            borderBottom: "none",
            padding: "1rem",
          }}
        >
          <Modal.Title style={{ fontSize: 18, fontWeight: 600 }}>
            Create Account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "1.5rem" }}>
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={createFormData.name}
                onChange={handleCreateInputChange}
                isInvalid={!!createErrors.name}
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                {createErrors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={createFormData.email}
                onChange={handleCreateInputChange}
                isInvalid={!!createErrors.email}
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                {createErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="userName"
                value={createFormData.userName}
                onChange={handleCreateInputChange}
                isInvalid={!!createErrors.userName}
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                {createErrors.userName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={createFormData.password}
                onChange={handleCreateInputChange}
                isInvalid={!!createErrors.password}
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                {createErrors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={createFormData.confirmPassword}
                onChange={handleCreateInputChange}
                isInvalid={!!createErrors.confirmPassword}
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                {createErrors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBirthday">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                name="birthday"
                value={createFormData.birthday}
                onChange={handleCreateInputChange}
                max={getMaxDate()}
                isInvalid={!!createErrors.birthday}
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                {createErrors.birthday}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={createFormData.phone}
                onChange={handleCreateInputChange}
                isInvalid={!!createErrors.phone}
                disabled={isLoading}
              />
              <Form.Control.Feedback type="invalid">
                {createErrors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            {createFormData.roleId === "R004" && (
              <>
                <Form.Group className="mb-3" controlId="formHeight">
                  <Form.Label>Height (cm)</Form.Label>
                  <Form.Control
                    type="number"
                    name="height"
                    value={createFormData.height}
                    onChange={handleCreateInputChange}
                    isInvalid={!!createErrors.height}
                    disabled={isLoading}
                    min="0"
                    step="0.01"
                  />
                  <Form.Control.Feedback type="invalid">
                    {createErrors.height}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formWeight">
                  <Form.Label>Weight (kg)</Form.Label>
                  <Form.Control
                    type="number"
                    name="weight"
                    value={createFormData.weight}
                    onChange={handleCreateInputChange}
                    isInvalid={!!createErrors.weight}
                    disabled={isLoading}
                    min="0"
                    step="0.01"
                  />
                  <Form.Control.Feedback type="invalid">
                    {createErrors.weight}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formSalaryIndex">
                  <Form.Label>Hourly Rate (VND)</Form.Label>
                  <Form.Control
                    type="number"
                    name="salaryIndex"
                    value={createFormData.salaryIndex}
                    onChange={handleCreateInputChange}
                    isInvalid={!!createErrors.salaryIndex}
                    disabled={isLoading}
                    min="0"
                    step="1"
                  />
                  <Form.Control.Feedback type="invalid">
                    {createErrors.salaryIndex}
                  </Form.Control.Feedback>
                </Form.Group>
              </>
            )}

            <Modal.Footer style={{ borderTop: "none", padding: "1rem 0" }}>
              <Button
                variant="secondary"
                onClick={handleCloseCreateModal}
                disabled={isLoading}
                style={{
                  background: "#6c757d",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1.5rem",
                  fontSize: "0.9rem",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                style={{
                  background: "linear-gradient(135deg, #3498db, #2ecc71)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1.5rem",
                  fontSize: "0.9rem",
                }}
              >
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
        {/* Modal xác nhận tạo tài khoản */}
        <Modal
          show={showCreateConfirmModal}
          onHide={cancelCreateConfirm}
          centered
          size="sm"
          style={{ zIndex: 1050 }}
        >
          <Modal.Header
            closeButton
            style={{
              background: "linear-gradient(135deg, #3498db, #2ecc71)",
              color: "white",
              borderBottom: "none",
              padding: "1rem",
            }}
          >
            <Modal.Title style={{ fontSize: 18, fontWeight: 600, margin: "0 auto" }}>
              Confirm Action
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              padding: "1.5rem",
              textAlign: "center",
              fontSize: "1rem",
              color: "#2c3e50",
            }}
          >
            <p style={{ margin: 0 }}>Are you sure you want to create this account?</p>
          </Modal.Body>
          <Modal.Footer
            style={{
              padding: "1rem",
              borderTop: "none",
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <Button
              variant="secondary"
              onClick={cancelCreateConfirm}
              disabled={isLoading}
              style={{
                background: "#6c757d",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1.5rem",
                fontSize: "0.9rem",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={confirmCreateAccount}
              disabled={isLoading}
              style={{
                background: "linear-gradient(135deg, #3498db, #2ecc71)",
                border: "none",
                borderRadius: "8px",
                padding: "0.5rem 1.5rem",
                fontSize: "0.9rem",
              }}
            >
              {isLoading ? "Creating..." : "Confirm"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Modal>
    </div>
  );
};

export default AccountManagementPage;