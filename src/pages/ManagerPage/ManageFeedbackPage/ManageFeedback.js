// import React, { useState, useEffect } from "react";
// import { Table, Modal, Card, Pagination, Dropdown, Form } from "react-bootstrap";
// import { Button, message } from "antd";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import "../../../styles/Manager/ManageFeedback.scss";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import ManageFeedbackService from "../../../services/ManageServicePages/ManageFeedbackService/ManageFeedbackService";

// // Định dạng ngày hiển thị
// const formatDateForDisplay = (dateString) => {
//   if (!dateString) return "N/A";
//   const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//   if (dateRegex.test(dateString)) {
//     const [year, month, day] = dateString.split("-");
//     return `${day}/${month}/${year}`;
//   }
//   const date = new Date(dateString);
//   if (!isNaN(date.getTime())) {
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   }
//   return "N/A";
// };

// const ManageFeedback = () => {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [accounts, setAccounts] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortFeedback, setSortFeedback] = useState({
//     field: "name",
//     order: "asc",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const rowsPerPageOptions = [10, 20, 30];

//   // Lấy dữ liệu feedback và account
//   const fetchFeedbacks = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Lấy danh sách feedback
//       const feedbackData = await ManageFeedbackService.getAllFeedbacks();
//       setFeedbacks(feedbackData);

//       // Lấy chi tiết account cho mỗi accountId
//       const accountIds = [...new Set(feedbackData.map((fb) => fb.accountId))];
//       const accountPromises = accountIds.map((id) =>
//         ManageFeedbackService.getAccountById(id)
//       );
//       const accountResults = await Promise.all(accountPromises);
//       const accountMap = accountResults.reduce((acc, account) => {
//         acc[account.accountId] = account;
//         return acc;
//       }, {});
//       setAccounts(accountMap);
//     } catch (error) {
//       setError("Failed to fetch feedbacks or accounts.");
//       message.error("Failed to fetch feedbacks or accounts.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFeedbacks();
//   }, []);

//   // Lọc và sắp xếp dữ liệu
//   const filterAndSortData = (data, search, sort) => {
//     let filtered = [...data];
//     if (search) {
//       filtered = filtered.filter((item) => {
//         const account = accounts[item.accountId] || {};
//         return (
//           account.name?.toLowerCase().includes(search.toLowerCase()) ||
//           account.email?.toLowerCase().includes(search.toLowerCase()) ||
//           item.description?.toLowerCase().includes(search.toLowerCase())
//         );
//       });
//     }
//     return filtered.sort((a, b) => {
//       const accountA = accounts[a.accountId] || {};
//       const accountB = accounts[b.accountId] || {};
//       let valueA, valueB;
//       if (sort.field === "star" || sort.field === "description") {
//         valueA = String(a[sort.field] || "").toLowerCase();
//         valueB = String(b[sort.field] || "").toLowerCase();
//       } else if (sort.field === "averageStar") {
//         valueA = String(accountA.averageStar || 0);
//         valueB = String(accountB.averageStar || 0);
//       } else {
//         valueA = String(accountA[sort.field] || "").toLowerCase();
//         valueB = String(accountB[sort.field] || "").toLowerCase();
//       }
//       return sort.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredFeedbacks = filterAndSortData(feedbacks, searchTerm, sortFeedback);
//   const totalEntries = filteredFeedbacks.length;
//   const totalPages = Math.ceil(totalEntries / rowsPerPage);
//   const paginatedFeedbacks = paginateData(filteredFeedbacks, currentPage);

//   function paginateData(data, page) {
//     const startIndex = (page - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex);
//   }

//   const startEntry = (currentPage - 1) * rowsPerPage + 1;
//   const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
//   const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

//   // Xử lý hiển thị modal chi tiết
//   const handleShowDetails = (feedback) => {
//     const account = accounts[feedback.accountId] || {};
//     setSelectedAccount(account);
//     setShowDetailsModal(true);
//   };

//   const handleCloseDetails = () => {
//     setShowDetailsModal(false);
//     setSelectedAccount(null);
//   };

//   // Xử lý tìm kiếm
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   // Xử lý sắp xếp
//   const handleSort = (field) => {
//     setSortFeedback((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPage(1);
//   };

//   // Xử lý phân trang
//   const handlePageChange = (page) => setCurrentPage(page);

//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="manage-feedback">
//       <h2 className="manage-feedback-title">Manage Feedbacks</h2>
//       <div className="table-container">
//         <Card className="feedback-table-card">
//           <Card.Body>
//             <div className="table-header">
//               <h3>Feedbacks</h3>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name, email, or description..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="search-input"
//               />
//               <div></div>
//             </div>
//             {isLoading && (
//               <Box sx={{ width: "100%", marginY: 2 }}>
//                 <LinearProgress />
//               </Box>
//             )}
//             {error && <p className="error-message">{error}</p>}
//             {!isLoading && !error && (
//               <>
//                 <Table striped bordered hover responsive>
//                   <thead>
//                     <tr>
//                       <th className="text-center">
//                         <span className="sortable" onClick={() => handleSort("star")}>
//                           Star
//                           {sortFeedback.field === "star" ? (
//                             sortFeedback.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("description")}
//                         >
//                           Feedback
//                           {sortFeedback.field === "description" ? (
//                             sortFeedback.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span className="sortable" onClick={() => handleSort("name")}>
//                           Cosplayer's Name
//                           {sortFeedback.field === "name" ? (
//                             sortFeedback.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span className="sortable" onClick={() => handleSort("email")}>
//                           Email
//                           {sortFeedback.field === "email" ? (
//                             sortFeedback.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("averageStar")}
//                         >
//                           Average Star
//                           {sortFeedback.field === "averageStar" ? (
//                             sortFeedback.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedFeedbacks.length === 0 ? (
//                       <tr>
//                         <td colSpan="6" className="text-center text-muted">
//                           No feedback found {searchTerm && "matching your search"}.
//                         </td>
//                       </tr>
//                     ) : (
//                       paginatedFeedbacks.map((feedback, index) => {
//                         const account = accounts[feedback.accountId] || {};
//                         return (
//                           <tr key={index}>
//                             <td className="text-center">{feedback.star} ⭐</td>
//                             <td className="text-center">{feedback.description}</td>
//                             <td className="text-center">{account.name || "N/A"}</td>
//                             <td className="text-center">{account.email || "N/A"}</td>
//                             <td className="text-center">
//                               {account.averageStar ? `${account.averageStar} ⭐` : "N/A"}
//                             </td>
//                             <td className="text-center">
//                               <Button
//                                 type="primary"
//                                 size="small"
//                                 onClick={() => handleShowDetails(feedback)}
//                               >
//                                 Cosplayer Details
//                               </Button>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </Table>
//                 <div className="pagination-controls">
//                   <div className="pagination-info">
//                     <span>{showingText}</span>
//                     <div className="rows-per-page">
//                       <span>Rows per page: </span>
//                       <Dropdown
//                         onSelect={(value) => handleRowsPerPageChange(Number(value))}
//                         className="d-inline-block"
//                       >
//                         <Dropdown.Toggle
//                           variant="secondary"
//                           id="dropdown-rows-per-page"
//                         >
//                           {rowsPerPage}
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu>
//                           {rowsPerPageOptions.map((option) => (
//                             <Dropdown.Item key={option} eventKey={option}>
//                               {option}
//                             </Dropdown.Item>
//                           ))}
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </div>
//                   </div>
//                   <Pagination>
//                     <Pagination.First
//                       onClick={() => handlePageChange(1)}
//                       disabled={currentPage === 1}
//                     />
//                     <Pagination.Prev
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                     />
//                     {[...Array(totalPages).keys()].map((page) => (
//                       <Pagination.Item
//                         key={page + 1}
//                         active={page + 1 === currentPage}
//                         onClick={() => handlePageChange(page + 1)}
//                       >
//                         {page + 1}
//                       </Pagination.Item>
//                     ))}
//                     <Pagination.Next
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                     />
//                     <Pagination.Last
//                       onClick={() => handlePageChange(totalPages)}
//                       disabled={currentPage === totalPages}
//                     />
//                   </Pagination>
//                 </div>
//               </>
//             )}
//           </Card.Body>
//         </Card>
//       </div>

//       {/* Modal hiển thị chi tiết cosplayer */}
//       <Modal
//         show={showDetailsModal}
//         onHide={handleCloseDetails}
//         centered
//         backdrop="static"
//         className="feedback-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Cosplayer Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedAccount ? (
//             <div className="cosplayer-details">
//               <p><strong>Name:</strong> {selectedAccount.name || "N/A"}</p>
//               <p><strong>Email:</strong> {selectedAccount.email || "N/A"}</p>
//               <p><strong>Average Star:</strong> {selectedAccount.averageStar ? `${selectedAccount.averageStar} ⭐` : "N/A"}</p>
//               <p><strong>Birthday:</strong> {formatDateForDisplay(selectedAccount.birthday)}</p>
//               <p><strong>Phone:</strong> {selectedAccount.phone || "N/A"}</p>
//               <p><strong>Height:</strong> {selectedAccount.height ? `${selectedAccount.height} cm` : "N/A"}</p>
//               <p><strong>Weight:</strong> {selectedAccount.weight ? `${selectedAccount.weight} kg` : "N/A"}</p>
//               <p><strong>Salary Index:</strong> {selectedAccount.salaryIndex || "N/A"}</p>
//               <p><strong>Description:</strong> {selectedAccount.description || "N/A"}</p>
//             </div>
//           ) : (
//             <p>No details available.</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button type="default" onClick={handleCloseDetails}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ManageFeedback;

//----------------------------------------------------------------------------------------------------//

//sửa ngày 26/05/2025

// import React, { useState, useEffect } from "react";
// import { Table, Modal, Card, Pagination, Dropdown, Form } from "react-bootstrap";
// import { Button, message } from "antd";
// import { ArrowUp, ArrowDown, PlusCircle } from "lucide-react"; // Thêm PlusCircle để đồng bộ nút Add
// import "../../../styles/Manager/ManageFeedback.scss";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import ManageFeedbackService from "../../../services/ManageServicePages/ManageFeedbackService/ManageFeedbackService";

// // Định dạng ngày hiển thị
// const formatDateForDisplay = (dateString) => {
//   if (!dateString) return "N/A";
//   const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//   if (dateRegex.test(dateString)) {
//     const [year, month, day] = dateString.split("-");
//     return `${day}/${month}/${year}`;
//   }
//   const date = new Date(dateString);
//   if (!isNaN(date.getTime())) {
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   }
//   return "N/A";
// };

// const ManageFeedback = () => {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [accounts, setAccounts] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortFeedback, setSortFeedback] = useState({
//     field: "name",
//     order: "asc",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const rowsPerPageOptions = [10, 20, 30];

//   // Lấy dữ liệu feedback và account
//   const fetchFeedbacks = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       // Lấy danh sách feedback
//       const feedbackData = await ManageFeedbackService.getAllFeedbacks();
//       setFeedbacks(feedbackData);

//       // Lấy chi tiết account cho mỗi accountId
//       const accountIds = [...new Set(feedbackData.map((fb) => fb.accountId))];
//       const accountPromises = accountIds.map((id) =>
//         ManageFeedbackService.getAccountById(id)
//       );
//       const accountResults = await Promise.all(accountPromises);
//       const accountMap = accountResults.reduce((acc, account) => {
//         acc[account.accountId] = account;
//         return acc;
//       }, {});
//       setAccounts(accountMap);
//     } catch (error) {
//       setError("Failed to fetch feedbacks or accounts.");
//       message.error("Failed to fetch feedbacks or accounts.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFeedbacks();
//   }, []);

//   // Lọc và sắp xếp dữ liệu
//   const filterAndSortData = (data, search, sort) => {
//     let filtered = [...data];
//     if (search) {
//       filtered = filtered.filter((item) => {
//         const account = accounts[item.accountId] || {};
//         return (
//           account.name?.toLowerCase().includes(search.toLowerCase()) ||
//           account.email?.toLowerCase().includes(search.toLowerCase()) ||
//           item.description?.toLowerCase().includes(search.toLowerCase())
//         );
//       });
//     }
//     return filtered.sort((a, b) => {
//       const accountA = accounts[a.accountId] || {};
//       const accountB = accounts[b.accountId] || {};
//       let valueA, valueB;
//       if (sort.field === "star" || sort.field === "description") {
//         valueA = String(a[sort.field] || "").toLowerCase();
//         valueB = String(b[sort.field] || "").toLowerCase();
//       } else if (sort.field === "averageStar") {
//         valueA = String(accountA.averageStar || 0);
//         valueB = String(accountB.averageStar || 0);
//       } else {
//         valueA = String(accountA[sort.field] || "").toLowerCase();
//         valueB = String(accountB[sort.field] || "").toLowerCase();
//       }
//       return sort.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredFeedbacks = filterAndSortData(feedbacks, searchTerm, sortFeedback);
//   const totalEntries = filteredFeedbacks.length;
//   const totalPages = Math.ceil(totalEntries / rowsPerPage);
//   const paginatedFeedbacks = paginateData(filteredFeedbacks, currentPage);

//   function paginateData(data, page) {
//     const startIndex = (page - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex);
//   }

//   const startEntry = (currentPage - 1) * rowsPerPage + 1;
//   const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
//   const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

//   // Xử lý hiển thị modal chi tiết
//   const handleShowDetails = (feedback) => {
//     const account = accounts[feedback.accountId] || {};
//     setSelectedAccount(account);
//     setShowDetailsModal(true);
//   };

//   const handleCloseDetails = () => {
//     setShowDetailsModal(false);
//     setSelectedAccount(null);
//   };

//   // Xử lý tìm kiếm
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   // Xử lý sắp xếp
//   const handleSort = (field) => {
//     setSortFeedback((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPage(1);
//   };

//   // Xử lý phân trang
//   const handlePageChange = (page) => setCurrentPage(page);

//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="manage-feedback">
//       {/* Tiêu đề chính của trang, đồng bộ với ManageSouvenir */}
//       <h2 className="manage-feedback-title">Manage Feedbacks</h2>
//       <div className="table-container">
//         <Card className="feedback-table-card">
//           <Card.Body>
//             {/* Phần đầu bảng với tiêu đề, ô tìm kiếm và nút thêm mới */}
//             <div className="table-header">
//               <h3>Feedbacks</h3>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name, email, or description..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="search-input"
//               />
//               {/* Placeholder div to reserve space for the button */}
//               <div className="button-placeholder">
//                 {/* Commented out button */}
//                 {/* <Button
//       type="primary"
//       style={{
//         padding: "20px 7px",
//         fontSize: "14px",
//         borderRadius: "4px",
//         background: "linear-gradient(135deg, #510545, #22668a)",
//         border: "none",
//         color: "#fff",
//         display: "flex",
//         alignItems: "center",
//       }}
//       onMouseEnter={(e) => (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")}
//       onMouseLeave={(e) => (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")}
//     >
//       <PlusCircle size={16} style={{ marginRight: "8px" }} />
//       Add New Feedback
//     </Button> */}
//               </div>
//             </div>
//             {/* Hiển thị thanh loading khi đang tải dữ liệu */}
//             {isLoading && (
//               <Box sx={{ width: "100%", marginY: 2 }}>
//                 <LinearProgress />
//               </Box>
//             )}
//             {/* Hiển thị thông báo lỗi nếu có */}
//             {error && <p className="error-message">{error}</p>}
//             {!isLoading && !error && (
//               <>
//                 {/* Bảng hiển thị danh sách phản hồi */}
//                 <Table striped bordered hover responsive>
//                   <thead>
//                     <tr>
//                       <th className="text-center">
//                         <span className="sortable" onClick={() => handleSort("star")}>
//                           Star
//                           {sortFeedback.field === "star" ? (
//                             sortFeedback.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("description")}
//                         >
//                           Feedback
//                           {sortFeedback.field === "description" ? (
//                             sortFeedback.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span className="sortable" onClick={() => handleSort("name")}>
//                           Cosplayer's Name
//                           {sortFeedback.field === "name" ? (
//                             sortFeedback.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span className="sortable" onClick={() => handleSort("email")}>
//                           Email
//                           {sortFeedback.field === "email" ? (
//                             sortFeedback.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("averageStar")}
//                         >
//                           Average Star
//                           {sortFeedback.field === "averageStar" ? (
//                             sortFeedback.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedFeedbacks.length === 0 ? (
//                       <tr>
//                         <td colSpan="6" className="text-center text-muted">
//                           No feedback found {searchTerm && "matching your search"}.
//                         </td>
//                       </tr>
//                     ) : (
//                       paginatedFeedbacks.map((feedback, index) => {
//                         const account = accounts[feedback.accountId] || {};
//                         return (
//                           <tr key={index}>
//                             <td className="text-center">{feedback.star} ⭐</td>
//                             <td className="text-center">{feedback.description?.length > 50 ? `${feedback.description.substring(0, 50)}...` : feedback.description}</td> {/* Cắt ngắn mô tả để đồng bộ với ManageSouvenir */}
//                             <td className="text-center">{account.name || "N/A"}</td>
//                             <td className="text-center">{account.email || "N/A"}</td>
//                             <td className="text-center">
//                               {account.averageStar ? `${account.averageStar} ⭐` : "N/A"}
//                             </td>
//                             <td className="text-center">
//                               {/* Đồng bộ style nút Cosplayer Details với nút Edit của ManageSouvenir */}
//                               <Button
//                                 type="primary"
//                                 size="small"
//                                 onClick={() => handleShowDetails(feedback)}
//                                 style={{
//                                   padding: "17px 14px",
//                                   fontSize: "14px",
//                                   borderRadius: "4px",
//                                   background: "linear-gradient(135deg, #510545, #22668a)",
//                                   border: "none",
//                                   color: "#fff",
//                                   marginRight: "8px",
//                                 }}
//                                 onMouseEnter={(e) => (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")}
//                                 onMouseLeave={(e) => (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")}
//                               >
//                                 Cosplayer Details
//                               </Button>
//                             </td>
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </Table>
//                 {/* Phần điều khiển phân trang, đồng bộ với ManageSouvenir */}
//                 <div className="pagination-controls">
//                   <div className="pagination-info">
//                     <span>{showingText}</span>
//                     <div className="rows-per-page">
//                       <span>Rows per page: </span>
//                       <Dropdown
//                         onSelect={(value) => handleRowsPerPageChange(Number(value))}
//                         className="d-inline-block"
//                       >
//                         <Dropdown.Toggle
//                           variant="secondary"
//                           id="dropdown-rows-per-page"
//                           style={{
//                             padding: "4px 8px",
//                             fontSize: "14px",
//                             borderRadius: "4px",
//                             background: "#e0e0e0",
//                             border: "none",
//                             color: "#333",
//                           }}
//                         >
//                           {rowsPerPage}
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu>
//                           {rowsPerPageOptions.map((option) => (
//                             <Dropdown.Item key={option} eventKey={option}>
//                               {option}
//                             </Dropdown.Item>
//                           ))}
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </div>
//                   </div>
//                   <Pagination>
//                     <Pagination.First
//                       onClick={() => handlePageChange(1)}
//                       disabled={currentPage === 1}
//                     />
//                     <Pagination.Prev
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                     />
//                     {[...Array(totalPages).keys()].map((page) => (
//                       <Pagination.Item
//                         key={page + 1}
//                         active={page + 1 === currentPage}
//                         onClick={() => handlePageChange(page + 1)}
//                       >
//                         {page + 1}
//                       </Pagination.Item>
//                     ))}
//                     <Pagination.Next
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                     />
//                     <Pagination.Last
//                       onClick={() => handlePageChange(totalPages)}
//                       disabled={currentPage === totalPages}
//                     />
//                   </Pagination>
//                 </div>
//               </>
//             )}
//           </Card.Body>
//         </Card>
//       </div>

//       {/* Modal hiển thị chi tiết cosplayer, đồng bộ với modal của ManageSouvenir */}
//       <Modal
//         show={showDetailsModal}
//         onHide={handleCloseDetails}
//         centered
//         className="feedback-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Cosplayer Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedAccount ? (
//             <div className="cosplayer-details">
//               <p><strong>Name:</strong> {selectedAccount.name || "N/A"}</p>
//               <p><strong>Email:</strong> {selectedAccount.email || "N/A"}</p>
//               <p><strong>Average Star:</strong> {selectedAccount.averageStar ? `${selectedAccount.averageStar} ⭐` : "N/A"}</p>
//               <p><strong>Birthday:</strong> {formatDateForDisplay(selectedAccount.birthday)}</p>
//               <p><strong>Phone:</strong> {selectedAccount.phone || "N/A"}</p>
//               <p><strong>Height:</strong> {selectedAccount.height ? `${selectedAccount.height} cm` : "N/A"}</p>
//               <p><strong>Weight:</strong> {selectedAccount.weight ? `${selectedAccount.weight} kg` : "N/A"}</p>
//               <p><strong>Salary Index:</strong> {selectedAccount.salaryIndex || "N/A"}</p>
//               <p><strong>Description:</strong> {selectedAccount.description || "N/A"}</p>
//             </div>
//           ) : (
//             <p>No details available.</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           {/* Đồng bộ style nút Close với nút Cancel của ManageSouvenir */}
//           <Button
//             type="default"
//             onClick={handleCloseDetails}
//             style={{
//               padding: "5px 12px",
//               fontSize: "14px",
//               borderRadius: "4px",
//               background: "#e0e0e0",
//               border: "none",
//               color: "#333",
//             }}
//             onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
//             onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ManageFeedback;

//----------------------------------------------------------------------------------------------------//

//sửa ngày 03/06/2025

import React, { useState, useEffect } from "react";
import { Table, Modal, Card, Pagination, Dropdown, Form } from "react-bootstrap";
import { Button, message } from "antd";
import { ArrowUp, ArrowDown, PlusCircle } from "lucide-react";
import "../../../styles/Manager/ManageFeedback.scss";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ManageFeedbackService from "../../../services/ManageServicePages/ManageFeedbackService/ManageFeedbackService";

// Định dạng ngày hiển thị
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "N/A";
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(dateString)) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return "N/A";
};

const ManageFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortFeedback, setSortFeedback] = useState({
    field: "star", // Default to 'star' since 'name' sorting is removed
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const rowsPerPageOptions = [10, 20, 30];

  // Lấy dữ liệu feedback và account
  const fetchFeedbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const feedbackData = await ManageFeedbackService.getAllFeedbacks();
      setFeedbacks(feedbackData);

      const accountIds = [...new Set(feedbackData.map((fb) => fb.accountId))];
      const accountPromises = accountIds.map((id) =>
        ManageFeedbackService.getAccountById(id)
      );
      const accountResults = await Promise.all(accountPromises);
      const accountMap = accountResults.reduce((acc, account) => {
        acc[account.accountId] = account;
        return acc;
      }, {});
      setAccounts(accountMap);
    } catch (error) {
      setError("Failed to fetch feedbacks or accounts.");
      message.error("Failed to fetch feedbacks or accounts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Lọc và sắp xếp dữ liệu
  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter((item) => {
        const account = accounts[item.accountId] || {};
        return (
          account.name?.toLowerCase().includes(search.toLowerCase()) ||
          account.email?.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    return filtered.sort((a, b) => {
      const accountA = accounts[a.accountId] || {};
      const accountB = accounts[b.accountId] || {};
      let valueA, valueB;
      if (sort.field === "star") {
        valueA = Number(a.star || 0);
        valueB = Number(b.star || 0);
      } else if (sort.field === "averageStar") {
        valueA = Number(accountA.averageStar || 0);
        valueB = Number(accountB.averageStar || 0);
      } else {
        return 0; // No sorting for other fields
      }
      return sort.order === "asc" ? valueA - valueB : valueB - valueA;
    });
  };

  const filteredFeedbacks = filterAndSortData(feedbacks, searchTerm, sortFeedback);
  const totalEntries = filteredFeedbacks.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedFeedbacks = paginateData(filteredFeedbacks, currentPage);

  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  const handleShowDetails = (feedback) => {
    const account = accounts[feedback.accountId] || {};
    setSelectedAccount(account);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedAccount(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý sắp xếp chỉ cho Star và Average Star
  const handleSort = (field) => {
    if (field !== "star" && field !== "averageStar") return; // Chỉ cho phép sort Star và Average Star
    setSortFeedback((prev) => ({
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

  return (
    <div className="manage-feedback">
      <h2 className="manage-feedback-title">Manage Feedbacks</h2>
      <div className="table-container">
        <Card className="feedback-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Feedbacks</h3>
              <Form.Control
                type="text"
                placeholder="Search by name, email, or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <div className="button-placeholder"></div>
            </div>
            {isLoading && (
              <Box sx={{ width: "100%", marginY: 2 }}>
                <LinearProgress />
              </Box>
            )}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("star")}
                        >
                          Star
                          {sortFeedback.field === "star" ? (
                            sortFeedback.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Feedback</th>
                      <th className="text-center">Cosplayer's Name</th>
                      <th className="text-center">Email</th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("averageStar")}
                        >
                          Average Star
                          {sortFeedback.field === "averageStar" ? (
                            sortFeedback.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFeedbacks.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">
                          No feedback found {searchTerm && "matching your search"}.
                        </td>
                      </tr>
                    ) : (
                      paginatedFeedbacks.map((feedback, index) => {
                        const account = accounts[feedback.accountId] || {};
                        return (
                          <tr key={index}>
                            <td className="text-center">{feedback.star} ⭐</td>
                            <td className="text-center">
                              {feedback.description?.length > 50
                                ? `${feedback.description.substring(0, 50)}...`
                                : feedback.description}
                            </td>
                            <td className="text-center">{account.name || "N/A"}</td>
                            <td className="text-center">{account.email || "N/A"}</td>
                            <td className="text-center">
                              {account.averageStar ? `${account.averageStar} ⭐` : "N/A"}
                            </td>
                            <td className="text-center">
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => handleShowDetails(feedback)}
                                style={{
                                  padding: "17px 14px",
                                  fontSize: "14px",
                                  borderRadius: "4px",
                                  background: "linear-gradient(135deg, #510545, #22668a)",
                                  border: "none",
                                  color: "#fff",
                                  marginRight: "8px",
                                }}
                                onMouseEnter={(e) =>
                                (e.target.style.background =
                                  "linear-gradient(135deg, #22668a, #510545)")
                                }
                                onMouseLeave={(e) =>
                                (e.target.style.background =
                                  "linear-gradient(135deg, #510545, #22668a)")
                                }
                              >
                                Cosplayer Details
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
                          style={{
                            padding: "4px 8px",
                            fontSize: "14px",
                            borderRadius: "4px",
                            background: "#e0e0e0",
                            border: "none",
                            color: "#333",
                          }}
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
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      <Modal
        show={showDetailsModal}
        onHide={handleCloseDetails}
        centered
        className="feedback-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cosplayer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAccount ? (
            <div className="cosplayer-details">
              <p><strong>Name:</strong> {selectedAccount.name || "N/A"}</p>
              <p><strong>Email:</strong> {selectedAccount.email || "N/A"}</p>
              <p><strong>Average Star:</strong> {selectedAccount.averageStar ? `${selectedAccount.averageStar} ⭐` : "N/A"}</p>
              <p><strong>Birthday:</strong> {formatDateForDisplay(selectedAccount.birthday)}</p>
              <p><strong>Phone:</strong> {selectedAccount.phone || "N/A"}</p>
              <p><strong>Height:</strong> {selectedAccount.height ? `${selectedAccount.height} cm` : "N/A"}</p>
              <p><strong>Weight:</strong> {selectedAccount.weight ? `${selectedAccount.weight} kg` : "N/A"}</p>
              <p><strong>Salary Index:</strong> {selectedAccount.salaryIndex || "N/A"}</p>
              <p><strong>Description:</strong> {selectedAccount.description || "N/A"}</p>
            </div>
          ) : (
            <p>No details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="default"
            onClick={handleCloseDetails}
            style={{
              padding: "5px 12px",
              fontSize: "14px",
              borderRadius: "4px",
              background: "#e0e0e0",
              border: "none",
              color: "#333",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
            onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageFeedback;