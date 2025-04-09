//=== api edit

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
// import { Pagination, Modal, Input, Button, Tabs, Radio, message } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyEventOrganize.scss";
// import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
// import { FileText, Calendar, Eye, CreditCard } from "lucide-react";
// import dayjs from "dayjs";

// const { TabPane } = Tabs;
// const { TextArea } = Input;

// const MyEventOrganize = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
//   const [filteredActiveContracts, setFilteredActiveContracts] = useState([]);
//   const [filteredCompletedContracts, setFilteredCompletedContracts] = useState(
//     []
//   );
//   const [loading, setLoading] = useState(false);
//   const [currentPendingPage, setCurrentPendingPage] = useState(1);
//   const [currentActivePage, setCurrentActivePage] = useState(1);
//   const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isViewEditModalVisible, setIsViewEditModalVisible] = useState(false);
//   const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
//   const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     requestId: "",
//     name: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     location: "",
//     packageName: "",
//     listCharacters: [],
//     status: "",
//     price: 0,
//   });
//   const [depositAmount, setDepositAmount] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [selectedRequestId, setSelectedRequestId] = useState(null);

//   const itemsPerPage = 5;
//   const accountId = "447fb184-4754-4ca5-be94-6606e0b54ddc"; // Giả định accountId

//   // Lấy dữ liệu từ API khi component mount
//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true);
//       try {
//         const data = await MyEventOrganizeService.getAllRequestByAccountId(
//           accountId
//         );
//         const filteredRequests = (Array.isArray(data) ? data : []).filter(
//           (request) => request.serviceId === "S003"
//         );

//         const requestsWithPackageName = await Promise.all(
//           filteredRequests.map(async (request) => {
//             let packageName = "N/A";
//             if (request.packageId) {
//               try {
//                 const packageData = await MyEventOrganizeService.getPackageById(
//                   request.packageId
//                 );
//                 packageName = packageData.packageName || "N/A";
//               } catch (error) {
//                 console.warn(
//                   `Failed to fetch packageName for packageId ${request.packageId}`
//                 );
//               }
//             }
//             return {
//               requestId: request.requestId,
//               name: request.name || "N/A",
//               description: request.description || "N/A",
//               startDate: request.startDate,
//               endDate: request.endDate,
//               location: request.location || "N/A",
//               packageName,
//               listCharacters:
//                 request.charactersListResponse?.map((char) => ({
//                   characterId: char.characterId,
//                   characterName: char.description || "Unknown Character",
//                   quantity: char.quantity,
//                 })) || [],
//               status: request.status || "Unknown",
//               price: request.price || 0,
//               serviceId: request.serviceId,
//             };
//           })
//         );

//         setRequests(requestsWithPackageName);
//       } catch (error) {
//         toast.error("Failed to load requests. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [accountId]);

//   // Phân loại và lọc dữ liệu theo trạng thái
//   useEffect(() => {
//     if (requests.length > 0) {
//       const filterByStatusAndSearch = (status) =>
//         requests
//           .filter((request) => request.status === status)
//           .filter(
//             (request) =>
//               request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//               dayjs(request.startDate)
//                 .format("HH:mm DD/MM/YYYY")
//                 .includes(searchTerm)
//           );

//       setFilteredPendingRequests(
//         filterByStatusAndSearch("Pending").concat(
//           filterByStatusAndSearch("Browsed")
//         )
//       );
//       setFilteredActiveContracts(filterByStatusAndSearch("Active"));
//       setFilteredCompletedContracts(filterByStatusAndSearch("Completed"));
//     }
//   }, [searchTerm, requests]);

//   // Xử lý phân trang cho từng tab
//   const paginateItems = (items, currentPage) => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return items.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   const currentPendingItems = paginateItems(
//     filteredPendingRequests,
//     currentPendingPage
//   );
//   const currentActiveItems = paginateItems(
//     filteredActiveContracts,
//     currentActivePage
//   );
//   const currentCompletedItems = paginateItems(
//     filteredCompletedContracts,
//     currentCompletedPage
//   );

//   const handlePendingPageChange = (page) => setCurrentPendingPage(page);
//   const handleActivePageChange = (page) => setCurrentActivePage(page);
//   const handleCompletedPageChange = (page) => setCurrentCompletedPage(page);

//   // Xử lý xem và chỉnh sửa
//   const handleViewEditRequest = (request) => {
//     setModalData({
//       requestId: request.requestId,
//       name: request.name || "",
//       description: request.description || "",
//       startDate: request.startDate
//         ? dayjs(request.startDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       endDate: request.endDate
//         ? dayjs(request.endDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       location: request.location || "",
//       packageName: request.packageName || "N/A",
//       listCharacters: request.listCharacters || [],
//       status: request.status || "N/A",
//       price: request.price || 0,
//     });
//     setIsViewEditModalVisible(true);
//   };

//   const handleViewEditConfirm = async () => {
//     if (!modalData.name.trim()) {
//       toast.error("Event name cannot be empty!");
//       return;
//     }

//     if (modalData.status === "Pending") {
//       try {
//         const requestData = {
//           name: modalData.name,
//           startDate: modalData.startDate,
//           endDate: modalData.endDate,
//           location: modalData.location,
//           serviceId: "S003", // Giá trị cố định dựa trên yêu cầu
//           listUpdateRequestCharacters: modalData.listCharacters.map((char) => ({
//             characterId: char.characterId,
//             cosplayerId: null, // Không có cosplayerId trong UI, để null
//             description: char.characterName,
//             quantity: char.quantity,
//           })),
//         };

//         await MyEventOrganizeService.editRequest(
//           modalData.requestId,
//           requestData
//         );

//         // Cập nhật state local sau khi API thành công
//         setRequests((prev) =>
//           prev.map((req) =>
//             req.requestId === modalData.requestId
//               ? { ...req, ...modalData }
//               : req
//           )
//         );
//         toast.success("Request updated successfully!");
//       } catch (error) {
//         toast.error("Failed to update request. Please try again.");
//       }
//     }

//     setIsViewEditModalVisible(false);
//   };

//   // Xử lý chọn mức deposit
//   const handleDepositRequest = (request) => {
//     setSelectedRequestId(request.requestId);
//     setModalData({
//       requestId: request.requestId,
//       name: request.name || "N/A",
//       description: request.description || "N/A",
//       startDate: request.startDate
//         ? dayjs(request.startDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       endDate: request.endDate
//         ? dayjs(request.endDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       location: request.location || "N/A",
//       packageName: request.packageName || "N/A",
//       listCharacters: request.listCharacters || [],
//       status: request.status || "N/A",
//       price: request.price || 0,
//     });
//     setIsDepositModalVisible(true);
//   };

//   const handleDepositConfirm = () => {
//     if (depositAmount === null) {
//       message.warning("Please select a deposit amount.");
//       return;
//     }
//     const depositValue =
//       depositAmount === 50 ? modalData.price * 0.5 : modalData.price;
//     toast.success(
//       `Deposit of ${depositValue.toLocaleString()} VND confirmed! Moving to Payment Deposit Contract tab.`
//     );
//     setRequests((prev) =>
//       prev.map((req) =>
//         req.requestId === selectedRequestId ? { ...req, status: "Active" } : req
//       )
//     );
//     setIsDepositModalVisible(false);
//     setDepositAmount(null);
//     setSelectedRequestId(null);
//   };

//   // Xử lý thanh toán deposit
//   const handlePaymentRequest = (contract) => {
//     setSelectedRequestId(contract.requestId);
//     setModalData({
//       requestId: contract.requestId,
//       name: contract.name || "N/A",
//       description: contract.description || "N/A",
//       startDate: contract.startDate
//         ? dayjs(contract.startDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       endDate: contract.endDate
//         ? dayjs(contract.endDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       location: contract.location || "N/A",
//       packageName: contract.packageName || "N/A",
//       listCharacters: contract.listCharacters || [],
//       status: contract.status || "N/A",
//       price: contract.price || 0,
//     });
//     setIsPaymentModalVisible(true);
//   };

//   const handlePaymentConfirm = () => {
//     if (paymentMethod === null) {
//       message.warning("Please select a payment method.");
//       return;
//     }
//     toast.success(
//       `Payment via ${paymentMethod} completed! Moving to Completed Contract tab.`
//     );
//     setRequests((prev) =>
//       prev.map((req) =>
//         req.requestId === selectedRequestId
//           ? { ...req, status: "Completed" }
//           : req
//       )
//     );
//     setIsPaymentModalVisible(false);
//     setPaymentMethod(null);
//     setSelectedRequestId(null);
//   };

//   // Badge trạng thái
//   const getStatusBadge = (status) => {
//     const statusColors = {
//       Pending: "primary",
//       Browsed: "success",
//       Active: "warning",
//       Completed: "success",
//     };
//     return (
//       <Badge bg={statusColors[status] || "secondary"}>
//         {status || "Unknown"}
//       </Badge>
//     );
//   };

//   return (
//     <div className="my-event-organize bg-light min-vh-100">
//       <Container className="py-5">
//         <h1 className="text-center mb-5 fw-bold title-my-event">
//           <span>My Event Organize</span>
//         </h1>

//         <div className="filter-section bg-white p-4 rounded shadow mb-5">
//           <Row className="align-items-center g-3">
//             <Col md={12}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name or date (HH:mm DD/MM/YYYY)..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input"
//               />
//             </Col>
//           </Row>
//         </div>

//         <Tabs defaultActiveKey="1" type="card">
//           <TabPane tab="Request Pending and Choose Deposit" key="1">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : currentPendingItems.length === 0 ? (
//               <p className="text-center">No pending requests found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentPendingItems.map((request) => (
//                     <Col key={request.requestId} xs={12}>
//                       <Card className="event-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="event-title mb-0">
//                                       {request.name || "N/A"}
//                                     </h3>
//                                     {getStatusBadge(request.status)}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date:{" "}
//                                     {dayjs(request.startDate).format(
//                                       "HH:mm DD/MM/YYYY"
//                                     ) || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Package: {request.packageName || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Price:{" "}
//                                     {(request.price || 0).toLocaleString()} VND
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end">
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view-edit"
//                                   onClick={() => handleViewEditRequest(request)}
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   {request.status === "Pending"
//                                     ? "View/Edit"
//                                     : "View"}
//                                 </Button>
//                                 {request.status === "Browsed" && (
//                                   <Button
//                                     size="small"
//                                     className="btn-deposit"
//                                     onClick={() =>
//                                       handleDepositRequest(request)
//                                     }
//                                   >
//                                     <CreditCard size={16} className="me-1" />
//                                     Choose Deposit
//                                   </Button>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Row className="mt-5 align-items-center">
//                   <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//                     <p className="mb-0">
//                       Showing{" "}
//                       <strong>
//                         {(currentPendingPage - 1) * itemsPerPage + 1}
//                       </strong>{" "}
//                       to{" "}
//                       <strong>
//                         {Math.min(
//                           currentPendingPage * itemsPerPage,
//                           filteredPendingRequests.length
//                         )}
//                       </strong>{" "}
//                       of <strong>{filteredPendingRequests.length}</strong>{" "}
//                       results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentPendingPage}
//                       pageSize={itemsPerPage}
//                       total={filteredPendingRequests.length}
//                       onChange={handlePendingPageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>

//           <TabPane tab="Payment Deposit Contract" key="2">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : currentActiveItems.length === 0 ? (
//               <p className="text-center">No active contracts found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentActiveItems.map((contract) => (
//                     <Col key={contract.requestId} xs={12}>
//                       <Card className="event-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="event-title mb-0">
//                                       {contract.name || "N/A"}
//                                     </h3>
//                                     {getStatusBadge("Active")}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date:{" "}
//                                     {dayjs(contract.startDate).format(
//                                       "HH:mm DD/MM/YYYY"
//                                     ) || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Package: {contract.packageName || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Status: Awaiting Payment
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end">
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view-edit"
//                                   onClick={() =>
//                                     handleViewEditRequest(contract)
//                                   }
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   View
//                                 </Button>
//                                 <Button
//                                   size="small"
//                                   className="btn-payment"
//                                   onClick={() => handlePaymentRequest(contract)}
//                                 >
//                                   <CreditCard size={16} className="me-1" />
//                                   Payment Deposit
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Row className="mt-5 align-items-center">
//                   <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//                     <p className="mb-0">
//                       Showing{" "}
//                       <strong>
//                         {(currentActivePage - 1) * itemsPerPage + 1}
//                       </strong>{" "}
//                       to{" "}
//                       <strong>
//                         {Math.min(
//                           currentActivePage * itemsPerPage,
//                           filteredActiveContracts.length
//                         )}
//                       </strong>{" "}
//                       of <strong>{filteredActiveContracts.length}</strong>{" "}
//                       results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentActivePage}
//                       pageSize={itemsPerPage}
//                       total={filteredActiveContracts.length}
//                       onChange={handleActivePageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>

//           <TabPane tab="Completed Contract" key="3">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : currentCompletedItems.length === 0 ? (
//               <p className="text-center">No completed contracts found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentCompletedItems.map((contract) => (
//                     <Col key={contract.requestId} xs={12}>
//                       <Card className="event-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="event-title mb-0">
//                                       {contract.name || "N/A"}
//                                     </h3>
//                                     {getStatusBadge(contract.status)}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date:{" "}
//                                     {dayjs(contract.startDate).format(
//                                       "HH:mm DD/MM/YYYY"
//                                     ) || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Package: {contract.packageName || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <Button
//                                 type="primary"
//                                 size="small"
//                                 className="btn-view-edit"
//                                 onClick={() => handleViewEditRequest(contract)}
//                               >
//                                 <Eye size={16} className="me-1" />
//                                 View
//                               </Button>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Row className="mt-5 align-items-center">
//                   <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//                     <p className="mb-0">
//                       Showing{" "}
//                       <strong>
//                         {(currentCompletedPage - 1) * itemsPerPage + 1}
//                       </strong>{" "}
//                       to{" "}
//                       <strong>
//                         {Math.min(
//                           currentCompletedPage * itemsPerPage,
//                           filteredCompletedContracts.length
//                         )}
//                       </strong>{" "}
//                       of <strong>{filteredCompletedContracts.length}</strong>{" "}
//                       results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentCompletedPage}
//                       pageSize={itemsPerPage}
//                       total={filteredCompletedContracts.length}
//                       onChange={handleCompletedPageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>
//         </Tabs>

//         {/* Modal tích hợp View/Edit */}
//         <Modal
//           title={
//             modalData.status === "Pending"
//               ? "View/Edit Event Request"
//               : "View Event Request"
//           }
//           open={isViewEditModalVisible}
//           onOk={
//             modalData.status === "Pending"
//               ? handleViewEditConfirm
//               : () => setIsViewEditModalVisible(false)
//           }
//           onCancel={() => setIsViewEditModalVisible(false)}
//           okText={modalData.status === "Pending" ? "Save" : "Close"}
//           cancelText="Cancel"
//           cancelButtonProps={{
//             style: {
//               display: modalData.status === "Pending" ? "inline" : "none",
//             },
//           }}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Name</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <Input
//                   value={modalData.name}
//                   onChange={(e) =>
//                     setModalData({ ...modalData, name: e.target.value })
//                   }
//                   placeholder="Enter event name"
//                 />
//               ) : (
//                 <p>{modalData.name}</p>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Description</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <TextArea
//                   value={modalData.description}
//                   onChange={(e) =>
//                     setModalData({ ...modalData, description: e.target.value })
//                   }
//                   placeholder="Enter description"
//                 />
//               ) : (
//                 <p>{modalData.description}</p>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Start Date</strong>
//               </Form.Label>
//               <p>{modalData.startDate}</p>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>End Date</strong>
//               </Form.Label>
//               <p>{modalData.endDate}</p>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Location</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <Input
//                   value={modalData.location}
//                   onChange={(e) =>
//                     setModalData({ ...modalData, location: e.target.value })
//                   }
//                   placeholder="Enter location"
//                 />
//               ) : (
//                 <p>{modalData.location}</p>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Package</strong>
//               </Form.Label>
//               <p>{modalData.packageName}</p>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Price</strong>
//               </Form.Label>
//               <p>{(modalData.price || 0).toLocaleString()} VND</p>
//             </Form.Group>
//             <h4>List of Characters:</h4>
//             {(modalData.listCharacters || []).length > 0 ? (
//               <ul>
//                 {(modalData.listCharacters || []).map((char, index) => (
//                   <li key={index}>
//                     {char.characterName} - Quantity: {char.quantity}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No characters requested.</p>
//             )}
//           </Form>
//         </Modal>

//         {/* Modal chọn mức deposit */}
//         <Modal
//           title="Choose Deposit Amount"
//           open={isDepositModalVisible}
//           onOk={handleDepositConfirm}
//           onCancel={() => {
//             setIsDepositModalVisible(false);
//             setDepositAmount(null);
//           }}
//           okText="Accept"
//           cancelText="Cancel"
//         >
//           <p>Total Price: {(modalData.price || 0).toLocaleString()} VND</p>
//           <p>Please select a deposit amount:</p>
//           <Radio.Group
//             onChange={(e) => setDepositAmount(e.target.value)}
//             value={depositAmount}
//           >
//             <Radio value={50}>
//               Deposit 50% ({((modalData.price || 0) * 0.5).toLocaleString()}{" "}
//               VND)
//             </Radio>
//             <Radio value={100}>
//               Deposit 100% {(modalData.price || 0).toLocaleString()} VND
//             </Radio>
//           </Radio.Group>
//         </Modal>

//         {/* Modal thanh toán deposit */}
//         <Modal
//           title="Payment Deposit"
//           open={isPaymentModalVisible}
//           onOk={handlePaymentConfirm}
//           onCancel={() => {
//             setIsPaymentModalVisible(false);
//             setPaymentMethod(null);
//           }}
//           okText="Confirm Payment"
//           cancelText="Cancel"
//         >
//           <p>Total Price: {(modalData.price || 0).toLocaleString()} VND</p>
//           <p>Please select a payment method:</p>
//           <Radio.Group
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             value={paymentMethod}
//           >
//             <Radio value="MoMo">MoMo</Radio>
//             <Radio value="VNPay">VNPay</Radio>
//           </Radio.Group>
//         </Modal>
//       </Container>
//     </div>
//   );
// };

// export default MyEventOrganize;

//============== xem ten cosplayer trong request ===============//
// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
// import { Pagination, Modal, Input, Button, Tabs, Radio, message } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyEventOrganize.scss";
// import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
// import { FileText, Calendar, Eye, CreditCard } from "lucide-react";
// import dayjs from "dayjs";

// const { TabPane } = Tabs;
// const { TextArea } = Input;

// const MyEventOrganize = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
//   const [filteredActiveContracts, setFilteredActiveContracts] = useState([]);
//   const [filteredCompletedContracts, setFilteredCompletedContracts] = useState(
//     []
//   );
//   const [loading, setLoading] = useState(false);
//   const [currentPendingPage, setCurrentPendingPage] = useState(1);
//   const [currentActivePage, setCurrentActivePage] = useState(1);
//   const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isViewEditModalVisible, setIsViewEditModalVisible] = useState(false);
//   const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
//   const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     requestId: "",
//     name: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     location: "",
//     packageName: "",
//     listCharacters: [],
//     status: "",
//     price: 0,
//   });
//   const [depositAmount, setDepositAmount] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [selectedRequestId, setSelectedRequestId] = useState(null);

//   const itemsPerPage = 5;
//   const accountId = "447fb184-4754-4ca5-be94-6606e0b54ddc"; // Giả định accountId

//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true);
//       try {
//         const data = await MyEventOrganizeService.getAllRequestByAccountId(
//           accountId
//         );
//         const filteredRequests = (Array.isArray(data) ? data : []).filter(
//           (request) => request.serviceId === "S003"
//         );

//         const requestsWithPackageName = await Promise.all(
//           filteredRequests.map(async (request) => {
//             let packageName = "N/A";
//             if (request.packageId) {
//               try {
//                 const packageData = await MyEventOrganizeService.getPackageById(
//                   request.packageId
//                 );
//                 packageName = packageData.packageName || "N/A";
//               } catch (error) {
//                 console.warn(
//                   `Failed to fetch packageName for packageId ${request.packageId}`
//                 );
//               }
//             }
//             return {
//               requestId: request.requestId,
//               name: request.name || "N/A",
//               description: request.description || "N/A",
//               startDate: request.startDate,
//               endDate: request.endDate,
//               location: request.location || "N/A",
//               packageName,
//               listCharacters:
//                 request.charactersListResponse?.map((char) => ({
//                   characterId: char.characterId,
//                   characterName: char.description || "Unknown Character",
//                   quantity: char.quantity,
//                 })) || [],
//               status: request.status || "Unknown",
//               price: request.price || 0,
//               serviceId: request.serviceId,
//             };
//           })
//         );

//         setRequests(requestsWithPackageName);
//       } catch (error) {
//         toast.error("Failed to load requests. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [accountId]);

//   useEffect(() => {
//     if (requests.length > 0) {
//       const filterByStatusAndSearch = (status) =>
//         requests
//           .filter((request) => request.status === status)
//           .filter(
//             (request) =>
//               request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//               dayjs(request.startDate)
//                 .format("HH:mm DD/MM/YYYY")
//                 .includes(searchTerm)
//           );

//       setFilteredPendingRequests(
//         filterByStatusAndSearch("Pending").concat(
//           filterByStatusAndSearch("Browsed")
//         )
//       );
//       setFilteredActiveContracts(filterByStatusAndSearch("Active"));
//       setFilteredCompletedContracts(filterByStatusAndSearch("Completed"));
//     }
//   }, [searchTerm, requests]);

//   const paginateItems = (items, currentPage) => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return items.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   const currentPendingItems = paginateItems(
//     filteredPendingRequests,
//     currentPendingPage
//   );
//   const currentActiveItems = paginateItems(
//     filteredActiveContracts,
//     currentActivePage
//   );
//   const currentCompletedItems = paginateItems(
//     filteredCompletedContracts,
//     currentCompletedPage
//   );

//   const handlePendingPageChange = (page) => setCurrentPendingPage(page);
//   const handleActivePageChange = (page) => setCurrentActivePage(page);
//   const handleCompletedPageChange = (page) => setCurrentCompletedPage(page);

//   const handleViewEditRequest = async (request) => {
//     try {
//       const requestData = await MyEventOrganizeService.getRequestByRequestId(
//         request.requestId
//       );
//       const charactersList = requestData?.charactersListResponse || [];

//       const listCharacters = await Promise.all(
//         charactersList.map(async (char) => {
//           let cosplayerName = "Not Assigned";
//           if (char.cosplayerId) {
//             try {
//               const cosplayerData =
//                 await MyEventOrganizeService.getNameCosplayerInRequestByCosplayerId(
//                   char.cosplayerId
//                 );
//               cosplayerName = cosplayerData?.name || "Unknown";
//             } catch (error) {
//               console.warn(
//                 `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
//                 error
//               );
//             }
//           }
//           return {
//             characterId: char.characterId,
//             characterName: char.description || "Unknown Character",
//             cosplayerName,
//             quantity: char.quantity,
//           };
//         })
//       );

//       setModalData({
//         requestId: request.requestId,
//         name: requestData.name || request.name || "",
//         description: requestData.description || request.description || "",
//         startDate: requestData.startDate
//           ? dayjs(requestData.startDate).format("HH:mm DD/MM/YYYY")
//           : "N/A",
//         endDate: requestData.endDate
//           ? dayjs(requestData.endDate).format("HH:mm DD/MM/YYYY")
//           : "N/A",
//         location: requestData.location || request.location || "",
//         packageName: request.packageName || "N/A",
//         listCharacters,
//         status: requestData.status || request.status || "N/A",
//         price: requestData.price || request.price || 0,
//       });
//       setIsViewEditModalVisible(true);
//     } catch (error) {
//       toast.error("Failed to fetch request details");
//       console.error("Error in handleViewEditRequest:", error);
//     }
//   };

//   const handleViewEditConfirm = async () => {
//     if (!modalData.name.trim()) {
//       toast.error("Event name cannot be empty!");
//       return;
//     }

//     if (modalData.status === "Pending") {
//       try {
//         const requestData = {
//           name: modalData.name,
//           startDate: modalData.startDate,
//           endDate: modalData.endDate,
//           location: modalData.location,
//           serviceId: "S003",
//           listUpdateRequestCharacters: modalData.listCharacters.map((char) => ({
//             characterId: char.characterName,
//             cosplayerId: null, // Không chỉnh sửa cosplayerId qua UI
//             description: char.characterName,
//             quantity: char.quantity,
//           })),
//         };

//         await MyEventOrganizeService.editRequest(
//           modalData.requestId,
//           requestData
//         );

//         setRequests((prev) =>
//           prev.map((req) =>
//             req.requestId === modalData.requestId
//               ? { ...req, ...modalData }
//               : req
//           )
//         );
//         toast.success("Request updated successfully!");
//       } catch (error) {
//         toast.error("Failed to update request. Please try again.");
//       }
//     }

//     setIsViewEditModalVisible(false);
//   };

//   const handleDepositRequest = (request) => {
//     setSelectedRequestId(request.requestId);
//     setModalData({
//       requestId: request.requestId,
//       name: request.name || "N/A",
//       description: request.description || "N/A",
//       startDate: request.startDate
//         ? dayjs(request.startDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       endDate: request.endDate
//         ? dayjs(request.endDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       location: request.location || "N/A",
//       packageName: request.packageName || "N/A",
//       listCharacters: request.listCharacters || [],
//       status: request.status || "N/A",
//       price: request.price || 0,
//     });
//     setIsDepositModalVisible(true);
//   };

//   const handleDepositConfirm = () => {
//     if (depositAmount === null) {
//       message.warning("Please select a deposit amount.");
//       return;
//     }
//     const depositValue =
//       depositAmount === 50 ? modalData.price * 0.5 : modalData.price;
//     toast.success(
//       `Deposit of ${depositValue.toLocaleString()} VND confirmed! Moving to Payment Deposit Contract tab.`
//     );
//     setRequests((prev) =>
//       prev.map((req) =>
//         req.requestId === selectedRequestId ? { ...req, status: "Active" } : req
//       )
//     );
//     setIsDepositModalVisible(false);
//     setDepositAmount(null);
//     setSelectedRequestId(null);
//   };

//   const handlePaymentRequest = (contract) => {
//     setSelectedRequestId(contract.requestId);
//     setModalData({
//       requestId: contract.requestId,
//       name: contract.name || "N/A",
//       description: contract.description || "N/A",
//       startDate: contract.startDate
//         ? dayjs(contract.startDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       endDate: contract.endDate
//         ? dayjs(contract.endDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       location: contract.location || "N/A",
//       packageName: contract.packageName || "N/A",
//       listCharacters: contract.listCharacters || [],
//       status: contract.status || "N/A",
//       price: contract.price || 0,
//     });
//     setIsPaymentModalVisible(true);
//   };

//   const handlePaymentConfirm = () => {
//     if (paymentMethod === null) {
//       message.warning("Please select a payment method.");
//       return;
//     }
//     toast.success(
//       `Payment via ${paymentMethod} completed! Moving to Completed Contract tab.`
//     );
//     setRequests((prev) =>
//       prev.map((req) =>
//         req.requestId === selectedRequestId
//           ? { ...req, status: "Completed" }
//           : req
//       )
//     );
//     setIsPaymentModalVisible(false);
//     setPaymentMethod(null);
//     setSelectedRequestId(null);
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       Pending: "primary",
//       Browsed: "success",
//       Active: "warning",
//       Completed: "success",
//     };
//     return (
//       <Badge bg={statusColors[status] || "secondary"}>
//         {status || "Unknown"}
//       </Badge>
//     );
//   };

//   return (
//     <div className="my-event-organize bg-light min-vh-100">
//       <Container className="py-5">
//         <h1 className="text-center mb-5 fw-bold title-my-event">
//           <span>My Event Organize</span>
//         </h1>

//         <div className="filter-section bg-white p-4 rounded shadow mb-5">
//           <Row className="align-items-center g-3">
//             <Col md={12}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name or date (HH:mm DD/MM/YYYY)..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input"
//               />
//             </Col>
//           </Row>
//         </div>

//         <Tabs defaultActiveKey="1" type="card">
//           <TabPane tab="Request Pending and Choose Deposit" key="1">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : currentPendingItems.length === 0 ? (
//               <p className="text-center">No pending requests found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentPendingItems.map((request) => (
//                     <Col key={request.requestId} xs={12}>
//                       <Card className="event-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="event-title mb-0">
//                                       {request.name || "N/A"}
//                                     </h3>
//                                     {getStatusBadge(request.status)}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date:{" "}
//                                     {dayjs(request.startDate).format(
//                                       "HH:mm DD/MM/YYYY"
//                                     ) || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Package: {request.packageName || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Price:{" "}
//                                     {(request.price || 0).toLocaleString()} VND
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end">
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view-edit"
//                                   onClick={() => handleViewEditRequest(request)}
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   {request.status === "Pending"
//                                     ? "View/Edit"
//                                     : "View"}
//                                 </Button>
//                                 {request.status === "Browsed" && (
//                                   <Button
//                                     size="small"
//                                     className="btn-deposit"
//                                     onClick={() =>
//                                       handleDepositRequest(request)
//                                     }
//                                   >
//                                     <CreditCard size={16} className="me-1" />
//                                     Choose Deposit
//                                   </Button>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Row className="mt-5 align-items-center">
//                   <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//                     <p className="mb-0">
//                       Showing{" "}
//                       <strong>
//                         {(currentPendingPage - 1) * itemsPerPage + 1}
//                       </strong>{" "}
//                       to{" "}
//                       <strong>
//                         {Math.min(
//                           currentPendingPage * itemsPerPage,
//                           filteredPendingRequests.length
//                         )}
//                       </strong>{" "}
//                       of <strong>{filteredPendingRequests.length}</strong>{" "}
//                       results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentPendingPage}
//                       pageSize={itemsPerPage}
//                       total={filteredPendingRequests.length}
//                       onChange={handlePendingPageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>

//           <TabPane tab="Payment Deposit Contract" key="2">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : currentActiveItems.length === 0 ? (
//               <p className="text-center">No active contracts found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentActiveItems.map((contract) => (
//                     <Col key={contract.requestId} xs={12}>
//                       <Card className="event-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="event-title mb-0">
//                                       {contract.name || "N/A"}
//                                     </h3>
//                                     {getStatusBadge("Active")}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date:{" "}
//                                     {dayjs(contract.startDate).format(
//                                       "HH:mm DD/MM/YYYY"
//                                     ) || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Package: {contract.packageName || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Status: Awaiting Payment
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end">
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view-edit"
//                                   onClick={() =>
//                                     handleViewEditRequest(contract)
//                                   }
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   View
//                                 </Button>
//                                 <Button
//                                   size="small"
//                                   className="btn-payment"
//                                   onClick={() => handlePaymentRequest(contract)}
//                                 >
//                                   <CreditCard size={16} className="me-1" />
//                                   Payment Deposit
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Row className="mt-5 align-items-center">
//                   <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//                     <p className="mb-0">
//                       Showing{" "}
//                       <strong>
//                         {(currentActivePage - 1) * itemsPerPage + 1}
//                       </strong>{" "}
//                       to{" "}
//                       <strong>
//                         {Math.min(
//                           currentActivePage * itemsPerPage,
//                           filteredActiveContracts.length
//                         )}
//                       </strong>{" "}
//                       of <strong>{filteredActiveContracts.length}</strong>{" "}
//                       results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentActivePage}
//                       pageSize={itemsPerPage}
//                       total={filteredActiveContracts.length}
//                       onChange={handleActivePageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>

//           <TabPane tab="Completed Contract" key="3">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : currentCompletedItems.length === 0 ? (
//               <p className="text-center">No completed contracts found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentCompletedItems.map((contract) => (
//                     <Col key={contract.requestId} xs={12}>
//                       <Card className="event-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="event-title mb-0">
//                                       {contract.name || "N/A"}
//                                     </h3>
//                                     {getStatusBadge(contract.status)}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date:{" "}
//                                     {dayjs(contract.startDate).format(
//                                       "HH:mm DD/MM/YYYY"
//                                     ) || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Package: {contract.packageName || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <Button
//                                 type="primary"
//                                 size="small"
//                                 className="btn-view-edit"
//                                 onClick={() => handleViewEditRequest(contract)}
//                               >
//                                 <Eye size={16} className="me-1" />
//                                 View
//                               </Button>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Row className="mt-5 align-items-center">
//                   <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//                     <p className="mb-0">
//                       Showing{" "}
//                       <strong>
//                         {(currentCompletedPage - 1) * itemsPerPage + 1}
//                       </strong>{" "}
//                       to{" "}
//                       <strong>
//                         {Math.min(
//                           currentCompletedPage * itemsPerPage,
//                           filteredCompletedContracts.length
//                         )}
//                       </strong>{" "}
//                       of <strong>{filteredCompletedContracts.length}</strong>{" "}
//                       results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentCompletedPage}
//                       pageSize={itemsPerPage}
//                       total={filteredCompletedContracts.length}
//                       onChange={handleCompletedPageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>
//         </Tabs>

//         <Modal
//           title={
//             modalData.status === "Pending"
//               ? "View/Edit Event Request"
//               : "View Event Request"
//           }
//           open={isViewEditModalVisible}
//           onOk={
//             modalData.status === "Pending"
//               ? handleViewEditConfirm
//               : () => setIsViewEditModalVisible(false)
//           }
//           onCancel={() => setIsViewEditModalVisible(false)}
//           okText={modalData.status === "Pending" ? "Save" : "Close"}
//           cancelText="Cancel"
//           cancelButtonProps={{
//             style: {
//               display: modalData.status === "Pending" ? "inline" : "none",
//             },
//           }}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Name</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <Input
//                   value={modalData.name}
//                   onChange={(e) =>
//                     setModalData({ ...modalData, name: e.target.value })
//                   }
//                   placeholder="Enter event name"
//                 />
//               ) : (
//                 <p>{modalData.name}</p>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Description</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <TextArea
//                   value={modalData.description}
//                   onChange={(e) =>
//                     setModalData({ ...modalData, description: e.target.value })
//                   }
//                   placeholder="Enter description"
//                 />
//               ) : (
//                 <p>{modalData.description}</p>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Start Date</strong>
//               </Form.Label>
//               <p>{modalData.startDate}</p>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>End Date</strong>
//               </Form.Label>
//               <p>{modalData.endDate}</p>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Location</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <Input
//                   value={modalData.location}
//                   onChange={(e) =>
//                     setModalData({ ...modalData, location: e.target.value })
//                   }
//                   placeholder="Enter location"
//                 />
//               ) : (
//                 <p>{modalData.location}</p>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Package</strong>
//               </Form.Label>
//               <p>{modalData.packageName}</p>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Price</strong>
//               </Form.Label>
//               <p>{(modalData.price || 0).toLocaleString()} VND</p>
//             </Form.Group>
//             <h4>List of Characters:</h4>
//             {(modalData.listCharacters || []).length > 0 ? (
//               <ul>
//                 {(modalData.listCharacters || []).map((char, index) => (
//                   <li key={index}>
//                     {char.characterName} - Cosplayer: {char.cosplayerName} -
//                     Quantity: {char.quantity}
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No characters requested.</p>
//             )}
//           </Form>
//         </Modal>

//         <Modal
//           title="Choose Deposit Amount"
//           open={isDepositModalVisible}
//           onOk={handleDepositConfirm}
//           onCancel={() => {
//             setIsDepositModalVisible(false);
//             setDepositAmount(null);
//           }}
//           okText="Accept"
//           cancelText="Cancel"
//         >
//           <p>Total Price: {(modalData.price || 0).toLocaleString()} VND</p>
//           <p>Please select a deposit amount:</p>
//           <Radio.Group
//             onChange={(e) => setDepositAmount(e.target.value)}
//             value={depositAmount}
//           >
//             <Radio value={50}>
//               Deposit 50% ({((modalData.price || 0) * 0.5).toLocaleString()}{" "}
//               VND)
//             </Radio>
//             <Radio value={100}>
//               Deposit 100% {(modalData.price || 0).toLocaleString()} VND
//             </Radio>
//           </Radio.Group>
//         </Modal>

//         <Modal
//           title="Payment Deposit"
//           open={isPaymentModalVisible}
//           onOk={handlePaymentConfirm}
//           onCancel={() => {
//             setIsPaymentModalVisible(false);
//             setPaymentMethod(null);
//           }}
//           okText="Confirm Payment"
//           cancelText="Cancel"
//         >
//           <p>Total Price: {(modalData.price || 0).toLocaleString()} VND</p>
//           <p>Please select a payment method:</p>
//           <Radio.Group
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             value={paymentMethod}
//           >
//             <Radio value="MoMo">MoMo</Radio>
//             <Radio value="VNPay">VNPay</Radio>
//           </Radio.Group>
//         </Modal>
//       </Container>
//     </div>
//   );
// };

// export default MyEventOrganize;

//======= chỉnh lại giá và list cos char
// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
// import { Pagination, Modal, Input, Button, Tabs, Radio, message } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyEventOrganize.scss";
// import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
// import { FileText, Calendar, Eye, CreditCard } from "lucide-react";
// import dayjs from "dayjs";
// import { jwtDecode } from "jwt-decode";

// const { TabPane } = Tabs;
// const { TextArea } = Input;

// const MyEventOrganize = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
//   const [filteredActiveContracts, setFilteredActiveContracts] = useState([]);
//   const [filteredCompletedContracts, setFilteredCompletedContracts] = useState(
//     []
//   );
//   const [loading, setLoading] = useState(false);
//   const [currentPendingPage, setCurrentPendingPage] = useState(1);
//   const [currentActivePage, setCurrentActivePage] = useState(1);
//   const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [isViewEditModalVisible, setIsViewEditModalVisible] = useState(false);
//   const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
//   const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     requestId: "",
//     name: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     location: "",
//     packageName: "",
//     packagePrice: 0,
//     listCharacters: [],
//     status: "",
//     price: 0,
//   });
//   const [depositAmount, setDepositAmount] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [selectedRequestId, setSelectedRequestId] = useState(null);

//   const itemsPerPage = 5;

//   // Lấy accountId từ accessToken
//   const getAccountIdFromToken = () => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         return decodedToken.Id || decodedToken.sub || decodedToken.accountId;
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   const accountId = getAccountIdFromToken();

//   useEffect(() => {
//     const fetchRequests = async () => {
//       if (!accountId) {
//         toast.error("No valid account ID found. Please log in again.");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const data = await MyEventOrganizeService.getAllRequestByAccountId(
//           accountId
//         );
//         const filteredRequests = (Array.isArray(data) ? data : []).filter(
//           (request) => request.serviceId === "S003"
//         );

//         const requestsWithDetails = await Promise.all(
//           filteredRequests.map(async (request) => {
//             let packageName = "N/A";
//             let packagePrice = 0;
//             if (request.packageId) {
//               try {
//                 const packageData = await MyEventOrganizeService.getPackageById(
//                   request.packageId
//                 );
//                 packageName = packageData.packageName || "N/A";
//                 packagePrice = packageData.price || 0;
//               } catch (error) {
//                 console.warn(
//                   `Failed to fetch package for packageId ${request.packageId}:`,
//                   error
//                 );
//               }
//             }

//             const charactersList = request.charactersListResponse || [];
//             let totalCharactersPrice = 0;
//             const listCharacters = await Promise.all(
//               charactersList.map(async (char) => {
//                 let cosplayerName = "Not Assigned";
//                 let salaryIndex = 1;
//                 let characterPrice = 0;
//                 let characterName = "Unknown Character";

//                 // Lấy thông tin character
//                 try {
//                   const characterData =
//                     await MyEventOrganizeService.getCharacterById(
//                       char.characterId
//                     );
//                   characterName =
//                     characterData.characterName || "Unknown Character";
//                   characterPrice = characterData.price || 0;
//                 } catch (error) {
//                   console.warn(
//                     `Failed to fetch character for ID ${char.characterId}:`,
//                     error
//                   );
//                 }

//                 // Lấy thông tin cosplayer nếu có
//                 if (char.cosplayerId) {
//                   try {
//                     const cosplayerData =
//                       await MyEventOrganizeService.getNameCosplayerInRequestByCosplayerId(
//                         char.cosplayerId
//                       );
//                     cosplayerName = cosplayerData?.name || "Unknown";
//                     salaryIndex = cosplayerData?.salaryIndex || 1;
//                   } catch (error) {
//                     console.warn(
//                       `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
//                       error
//                     );
//                   }
//                 }

//                 const price = characterPrice * char.quantity * salaryIndex;
//                 totalCharactersPrice += price;

//                 return {
//                   characterId: char.characterId,
//                   characterName,
//                   cosplayerName,
//                   quantity: char.quantity,
//                   price,
//                 };
//               })
//             );

//             const totalPrice = packagePrice + totalCharactersPrice;

//             return {
//               requestId: request.requestId,
//               name: request.name || "N/A",
//               description: request.description || "N/A",
//               startDate: request.startDate,
//               endDate: request.endDate,
//               location: request.location || "N/A",
//               packageName,
//               packagePrice,
//               listCharacters,
//               status: request.status || "Unknown",
//               price: totalPrice,
//               serviceId: request.serviceId,
//             };
//           })
//         );

//         setRequests(requestsWithDetails);
//       } catch (error) {
//         toast.error("Failed to load requests. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [accountId]);

//   useEffect(() => {
//     if (requests.length > 0) {
//       const filterByStatusAndSearch = (status) =>
//         requests
//           .filter((request) => request.status === status)
//           .filter(
//             (request) =>
//               request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//               dayjs(request.startDate)
//                 .format("HH:mm DD/MM/YYYY")
//                 .includes(searchTerm)
//           );

//       setFilteredPendingRequests(
//         filterByStatusAndSearch("Pending").concat(
//           filterByStatusAndSearch("Browsed")
//         )
//       );
//       setFilteredActiveContracts(filterByStatusAndSearch("Active"));
//       setFilteredCompletedContracts(filterByStatusAndSearch("Completed"));
//     }
//   }, [searchTerm, requests]);

//   const paginateItems = (items, currentPage) => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return items.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   const currentPendingItems = paginateItems(
//     filteredPendingRequests,
//     currentPendingPage
//   );
//   const currentActiveItems = paginateItems(
//     filteredActiveContracts,
//     currentActivePage
//   );
//   const currentCompletedItems = paginateItems(
//     filteredCompletedContracts,
//     currentCompletedPage
//   );

//   const handlePendingPageChange = (page) => setCurrentPendingPage(page);
//   const handleActivePageChange = (page) => setCurrentActivePage(page);
//   const handleCompletedPageChange = (page) => setCurrentCompletedPage(page);

//   const handleViewEditRequest = (request) => {
//     setModalData({
//       requestId: request.requestId,
//       name: request.name,
//       description: request.description,
//       startDate: request.startDate
//         ? dayjs(request.startDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       endDate: request.endDate
//         ? dayjs(request.endDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       location: request.location,
//       packageName: request.packageName,
//       packagePrice: request.packagePrice,
//       listCharacters: request.listCharacters,
//       status: request.status,
//       price: request.price,
//     });
//     setIsViewEditModalVisible(true);
//   };

//   const handleViewEditConfirm = async () => {
//     if (!modalData.name.trim()) {
//       toast.error("Event name cannot be empty!");
//       return;
//     }

//     if (modalData.status === "Pending") {
//       try {
//         const requestData = {
//           name: modalData.name,
//           startDate: modalData.startDate,
//           endDate: modalData.endDate,
//           location: modalData.location,
//           serviceId: "S003",
//           listUpdateRequestCharacters: modalData.listCharacters.map((char) => ({
//             characterId: char.characterId,
//             cosplayerId: null,
//             description: char.characterName,
//             quantity: char.quantity,
//           })),
//         };

//         await MyEventOrganizeService.editRequest(
//           modalData.requestId,
//           requestData
//         );

//         setRequests((prev) =>
//           prev.map((req) =>
//             req.requestId === modalData.requestId
//               ? { ...req, ...modalData }
//               : req
//           )
//         );
//         toast.success("Request updated successfully!");
//       } catch (error) {
//         toast.error("Failed to update request. Please try again.");
//       }
//     }

//     setIsViewEditModalVisible(false);
//   };

//   const handleDepositRequest = (request) => {
//     setSelectedRequestId(request.requestId);
//     setModalData({
//       requestId: request.requestId,
//       name: request.name,
//       description: request.description,
//       startDate: request.startDate
//         ? dayjs(request.startDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       endDate: request.endDate
//         ? dayjs(request.endDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       location: request.location,
//       packageName: request.packageName,
//       packagePrice: request.packagePrice,
//       listCharacters: request.listCharacters,
//       status: request.status,
//       price: request.price,
//     });
//     setIsDepositModalVisible(true);
//   };

//   const handleDepositConfirm = () => {
//     if (depositAmount === null) {
//       message.warning("Please select a deposit amount.");
//       return;
//     }
//     const depositValue =
//       depositAmount === 50 ? modalData.price * 0.5 : modalData.price;
//     toast.success(
//       `Deposit of ${depositValue.toLocaleString()} VND confirmed! Moving to Payment Deposit Contract tab.`
//     );
//     setRequests((prev) =>
//       prev.map((req) =>
//         req.requestId === selectedRequestId ? { ...req, status: "Active" } : req
//       )
//     );
//     setIsDepositModalVisible(false);
//     setDepositAmount(null);
//     setSelectedRequestId(null);
//   };

//   const handlePaymentRequest = (contract) => {
//     setSelectedRequestId(contract.requestId);
//     setModalData({
//       requestId: contract.requestId,
//       name: contract.name,
//       description: contract.description,
//       startDate: contract.startDate
//         ? dayjs(contract.startDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       endDate: contract.endDate
//         ? dayjs(contract.endDate).format("HH:mm DD/MM/YYYY")
//         : "N/A",
//       location: contract.location,
//       packageName: contract.packageName,
//       packagePrice: contract.packagePrice,
//       listCharacters: contract.listCharacters,
//       status: contract.status,
//       price: contract.price,
//     });
//     setIsPaymentModalVisible(true);
//   };

//   const handlePaymentConfirm = () => {
//     if (paymentMethod === null) {
//       message.warning("Please select a payment method.");
//       return;
//     }
//     toast.success(
//       `Payment via ${paymentMethod} completed! Moving to Completed Contract tab.`
//     );
//     setRequests((prev) =>
//       prev.map((req) =>
//         req.requestId === selectedRequestId
//           ? { ...req, status: "Completed" }
//           : req
//       )
//     );
//     setIsPaymentModalVisible(false);
//     setPaymentMethod(null);
//     setSelectedRequestId(null);
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       Pending: "primary",
//       Browsed: "success",
//       Active: "warning",
//       Completed: "success",
//     };
//     return (
//       <Badge bg={statusColors[status] || "secondary"}>
//         {status || "Unknown"}
//       </Badge>
//     );
//   };

//   return (
//     <div className="my-event-organize bg-light min-vh-100">
//       <Container className="py-5">
//         <h1 className="text-center mb-5 fw-bold title-my-event">
//           <span>My Event Organize</span>
//         </h1>

//         <div className="filter-section bg-white p-4 rounded shadow mb-5">
//           <Row className="align-items-center g-3">
//             <Col md={12}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name or date (HH:mm DD/MM/YYYY)..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input"
//               />
//             </Col>
//           </Row>
//         </div>

//         <Tabs defaultActiveKey="1" type="card">
//           <TabPane tab="Request Pending and Choose Deposit" key="1">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : currentPendingItems.length === 0 ? (
//               <p className="text-center">No pending requests found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentPendingItems.map((request) => (
//                     <Col key={request.requestId} xs={12}>
//                       <Card className="event-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="event-title mb-0">
//                                       {request.name || "N/A"}
//                                     </h3>
//                                     {getStatusBadge(request.status)}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date:{" "}
//                                     {dayjs(request.startDate).format(
//                                       "HH:mm DD/MM/YYYY"
//                                     ) || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Package: {request.packageName || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Total Price:{" "}
//                                     {(request.price || 0).toLocaleString()} VND
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end">
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view-edit"
//                                   onClick={() => handleViewEditRequest(request)}
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   {request.status === "Pending"
//                                     ? "View/Edit"
//                                     : "View"}
//                                 </Button>
//                                 {request.status === "Browsed" && (
//                                   <Button
//                                     size="small"
//                                     className="btn-deposit"
//                                     onClick={() =>
//                                       handleDepositRequest(request)
//                                     }
//                                   >
//                                     <CreditCard size={16} className="me-1" />
//                                     Choose Deposit
//                                   </Button>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Row className="mt-5 align-items-center">
//                   <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//                     <p className="mb-0">
//                       Showing{" "}
//                       <strong>
//                         {(currentPendingPage - 1) * itemsPerPage + 1}
//                       </strong>{" "}
//                       to{" "}
//                       <strong>
//                         {Math.min(
//                           currentPendingPage * itemsPerPage,
//                           filteredPendingRequests.length
//                         )}
//                       </strong>{" "}
//                       of <strong>{filteredPendingRequests.length}</strong>{" "}
//                       results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentPendingPage}
//                       pageSize={itemsPerPage}
//                       total={filteredPendingRequests.length}
//                       onChange={handlePendingPageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>

//           <TabPane tab="Payment Deposit Contract" key="2">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : currentActiveItems.length === 0 ? (
//               <p className="text-center">No active contracts found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentActiveItems.map((contract) => (
//                     <Col key={contract.requestId} xs={12}>
//                       <Card className="event-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="event-title mb-0">
//                                       {contract.name || "N/A"}
//                                     </h3>
//                                     {getStatusBadge("Active")}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date:{" "}
//                                     {dayjs(contract.startDate).format(
//                                       "HH:mm DD/MM/YYYY"
//                                     ) || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Package: {contract.packageName || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Total Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Status: Awaiting Payment
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end">
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view-edit"
//                                   onClick={() =>
//                                     handleViewEditRequest(contract)
//                                   }
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   View
//                                 </Button>
//                                 <Button
//                                   size="small"
//                                   className="btn-payment"
//                                   onClick={() => handlePaymentRequest(contract)}
//                                 >
//                                   <CreditCard size={16} className="me-1" />
//                                   Payment Deposit
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Row className="mt-5 align-items-center">
//                   <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//                     <p className="mb-0">
//                       Showing{" "}
//                       <strong>
//                         {(currentActivePage - 1) * itemsPerPage + 1}
//                       </strong>{" "}
//                       to{" "}
//                       <strong>
//                         {Math.min(
//                           currentActivePage * itemsPerPage,
//                           filteredActiveContracts.length
//                         )}
//                       </strong>{" "}
//                       of <strong>{filteredActiveContracts.length}</strong>{" "}
//                       results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentActivePage}
//                       pageSize={itemsPerPage}
//                       total={filteredActiveContracts.length}
//                       onChange={handleActivePageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>

//           <TabPane tab="Completed Contract" key="3">
//             {loading ? (
//               <p className="text-center">Loading...</p>
//             ) : currentCompletedItems.length === 0 ? (
//               <p className="text-center">No completed contracts found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentCompletedItems.map((contract) => (
//                     <Col key={contract.requestId} xs={12}>
//                       <Card className="event-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="event-title mb-0">
//                                       {contract.name || "N/A"}
//                                     </h3>
//                                     {getStatusBadge(contract.status)}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date:{" "}
//                                     {dayjs(contract.startDate).format(
//                                       "HH:mm DD/MM/YYYY"
//                                     ) || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Package: {contract.packageName || "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Total Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <Button
//                                 type="primary"
//                                 size="small"
//                                 className="btn-view-edit"
//                                 onClick={() => handleViewEditRequest(contract)}
//                               >
//                                 <Eye size={16} className="me-1" />
//                                 View
//                               </Button>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Row className="mt-5 align-items-center">
//                   <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//                     <p className="mb-0">
//                       Showing{" "}
//                       <strong>
//                         {(currentCompletedPage - 1) * itemsPerPage + 1}
//                       </strong>{" "}
//                       to{" "}
//                       <strong>
//                         {Math.min(
//                           currentCompletedPage * itemsPerPage,
//                           filteredCompletedContracts.length
//                         )}
//                       </strong>{" "}
//                       of <strong>{filteredCompletedContracts.length}</strong>{" "}
//                       results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentCompletedPage}
//                       pageSize={itemsPerPage}
//                       total={filteredCompletedContracts.length}
//                       onChange={handleCompletedPageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>
//         </Tabs>

//         <Modal
//           title={
//             modalData.status === "Pending"
//               ? "View/Edit Event Request"
//               : "View Event Request"
//           }
//           open={isViewEditModalVisible}
//           onOk={
//             modalData.status === "Pending"
//               ? handleViewEditConfirm
//               : () => setIsViewEditModalVisible(false)
//           }
//           onCancel={() => setIsViewEditModalVisible(false)}
//           okText={modalData.status === "Pending" ? "Save" : "Close"}
//           cancelText="Cancel"
//           cancelButtonProps={{
//             style: {
//               display: modalData.status === "Pending" ? "inline" : "none",
//             },
//           }}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Name</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <Input
//                   value={modalData.name}
//                   onChange={(e) =>
//                     setModalData({ ...modalData, name: e.target.value })
//                   }
//                   placeholder="Enter event name"
//                 />
//               ) : (
//                 <p>{modalData.name}</p>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Description</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <TextArea
//                   value={modalData.description}
//                   onChange={(e) =>
//                     setModalData({ ...modalData, description: e.target.value })
//                   }
//                   placeholder="Enter description"
//                 />
//               ) : (
//                 <p>{modalData.description}</p>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Start Date</strong>
//               </Form.Label>
//               <p>{modalData.startDate}</p>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>End Date</strong>
//               </Form.Label>
//               <p>{modalData.endDate}</p>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Location</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <Input
//                   value={modalData.location}
//                   onChange={(e) =>
//                     setModalData({ ...modalData, location: e.target.value })
//                   }
//                   placeholder="Enter location"
//                 />
//               ) : (
//                 <p>{modalData.location}</p>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Package</strong>
//               </Form.Label>
//               <p>
//                 {modalData.packageName} -{" "}
//                 {(modalData.packagePrice || 0).toLocaleString()} VND
//               </p>
//             </Form.Group>
//             <h4>List of Requested Characters:</h4>
//             {(modalData.listCharacters || []).length > 0 ? (
//               <ul>
//                 {(modalData.listCharacters || []).map((item, index) => (
//                   <li key={index}>
//                     {item.cosplayerName} - {item.characterName} - Quantity:{" "}
//                     {item.quantity} - Price: {item.price.toLocaleString()} VND
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No characters requested.</p>
//             )}
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Total Price</strong>
//               </Form.Label>
//               <p>{(modalData.price || 0).toLocaleString()} VND</p>
//             </Form.Group>
//           </Form>
//         </Modal>

//         <Modal
//           title="Choose Deposit Amount"
//           open={isDepositModalVisible}
//           onOk={handleDepositConfirm}
//           onCancel={() => {
//             setIsDepositModalVisible(false);
//             setDepositAmount(null);
//           }}
//           okText="Accept"
//           cancelText="Cancel"
//         >
//           <p>Total Price: {(modalData.price || 0).toLocaleString()} VND</p>
//           <p>Please select a deposit amount:</p>
//           <Radio.Group
//             onChange={(e) => setDepositAmount(e.target.value)}
//             value={depositAmount}
//           >
//             <Radio value={50}>
//               Deposit 50% ({((modalData.price || 0) * 0.5).toLocaleString()}{" "}
//               VND)
//             </Radio>
//             <Radio value={100}>
//               Deposit 100% {(modalData.price || 0).toLocaleString()} VND
//             </Radio>
//           </Radio.Group>
//         </Modal>

//         <Modal
//           title="Payment Deposit"
//           open={isPaymentModalVisible}
//           onOk={handlePaymentConfirm}
//           onCancel={() => {
//             setIsPaymentModalVisible(false);
//             setPaymentMethod(null);
//           }}
//           okText="Confirm Payment"
//           cancelText="Cancel"
//         >
//           <p>Total Price: {(modalData.price || 0).toLocaleString()} VND</p>
//           <p>Please select a payment method:</p>
//           <Radio.Group
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             value={paymentMethod}
//           >
//             <Radio value="MoMo">MoMo</Radio>
//             <Radio value="VNPay">VNPay</Radio>
//           </Radio.Group>
//         </Modal>
//       </Container>
//     </div>
//   );
// };

// export default MyEventOrganize;

//====================== sua lai ======================
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import { Pagination, Modal, Input, Button, Tabs, Radio, message } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyEventOrganize.scss";
import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
import { FileText, Calendar, Eye, CreditCard } from "lucide-react";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

const { TabPane } = Tabs;
const { TextArea } = Input;

const MyEventOrganize = () => {
  const [requests, setRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [filteredActiveContracts, setFilteredActiveContracts] = useState([]);
  const [filteredCompletedContracts, setFilteredCompletedContracts] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentActivePage, setCurrentActivePage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewEditModalVisible, setIsViewEditModalVisible] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    requestId: "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    packageName: "",
    packagePrice: 0,
    listCharacters: [],
    status: "",
    price: 0,
  });
  const [depositAmount, setDepositAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const itemsPerPage = 5;

  // Lấy accountId từ accessToken
  const getAccountIdFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.Id || decodedToken.sub || decodedToken.accountId;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  const accountId = getAccountIdFromToken();

  useEffect(() => {
    const fetchRequests = async () => {
      if (!accountId) {
        toast.error("No valid account ID found. Please log in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await MyEventOrganizeService.getAllRequestByAccountId(
          accountId
        );
        const filteredRequests = (Array.isArray(data) ? data : []).filter(
          (request) => request.serviceId === "S003"
        );

        const requestsWithDetails = await Promise.all(
          filteredRequests.map(async (request) => {
            let packageName = "N/A";
            let packagePrice = 0;
            if (request.packageId) {
              try {
                const packageData = await MyEventOrganizeService.getPackageById(
                  request.packageId
                );
                packageName = packageData.packageName || "N/A";
                packagePrice = packageData.price || 0;
              } catch (error) {
                console.warn(
                  `Failed to fetch package for packageId ${request.packageId}:`,
                  error
                );
              }
            }

            const charactersList = request.charactersListResponse || [];
            let totalCharactersPrice = 0;
            const listCharacters = await Promise.all(
              charactersList.map(async (char) => {
                let characterPrice = 0;
                let characterName = "Unknown Character";

                // Lấy thông tin character
                try {
                  const characterData =
                    await MyEventOrganizeService.getCharacterById(
                      char.characterId
                    );
                  characterName =
                    characterData.characterName || "Unknown Character";
                  characterPrice = characterData.price || 0;
                } catch (error) {
                  console.warn(
                    `Failed to fetch character for ID ${char.characterId}:`,
                    error
                  );
                }

                const price = characterPrice * (char.quantity || 0);
                totalCharactersPrice += price;

                return {
                  characterId: char.characterId,
                  characterName,
                  quantity: char.quantity,
                  price,
                };
              })
            );

            const totalPrice = packagePrice + totalCharactersPrice;

            return {
              requestId: request.requestId,
              name: request.name || "N/A",
              description: request.description || "N/A",
              startDate: request.startDate,
              endDate: request.endDate,
              location: request.location || "N/A",
              packageName,
              packagePrice,
              listCharacters,
              status: request.status || "Unknown",
              price: totalPrice,
              serviceId: request.serviceId,
            };
          })
        );

        setRequests(requestsWithDetails);
      } catch (error) {
        toast.error("Failed to load requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [accountId]);

  useEffect(() => {
    if (requests.length > 0) {
      const filterByStatusAndSearch = (status) =>
        requests
          .filter((request) => request.status === status)
          .filter(
            (request) =>
              request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              dayjs(request.startDate)
                .format("HH:mm DD/MM/YYYY")
                .includes(searchTerm)
          );

      setFilteredPendingRequests(
        filterByStatusAndSearch("Pending").concat(
          filterByStatusAndSearch("Browsed")
        )
      );
      setFilteredActiveContracts(filterByStatusAndSearch("Active"));
      setFilteredCompletedContracts(filterByStatusAndSearch("Completed"));
    }
  }, [searchTerm, requests]);

  const paginateItems = (items, currentPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const currentPendingItems = paginateItems(
    filteredPendingRequests,
    currentPendingPage
  );
  const currentActiveItems = paginateItems(
    filteredActiveContracts,
    currentActivePage
  );
  const currentCompletedItems = paginateItems(
    filteredCompletedContracts,
    currentCompletedPage
  );

  const handlePendingPageChange = (page) => setCurrentPendingPage(page);
  const handleActivePageChange = (page) => setCurrentActivePage(page);
  const handleCompletedPageChange = (page) => setCurrentCompletedPage(page);

  const handleViewEditRequest = (request) => {
    setModalData({
      requestId: request.requestId,
      name: request.name,
      description: request.description,
      startDate: request.startDate
        ? dayjs(request.startDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      endDate: request.endDate
        ? dayjs(request.endDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      location: request.location,
      packageName: request.packageName,
      packagePrice: request.packagePrice,
      listCharacters: request.listCharacters,
      status: request.status,
      price: request.price,
    });
    setIsViewEditModalVisible(true);
  };

  const handleViewEditConfirm = async () => {
    if (!modalData.name.trim()) {
      toast.error("Event name cannot be empty!");
      return;
    }

    if (modalData.status === "Pending") {
      try {
        const requestData = {
          name: modalData.name,
          description: modalData.description,
          startDate: modalData.startDate,
          endDate: modalData.endDate,
          location: modalData.location,
          serviceId: "S003",
          listUpdateRequestCharacters: modalData.listCharacters.map((char) => ({
            characterId: char.characterId,
            cosplayerId: null,
            description: char.characterName,
            quantity: char.quantity,
          })),
        };

        await MyEventOrganizeService.editRequest(
          modalData.requestId,
          requestData
        );

        setRequests((prev) =>
          prev.map((req) =>
            req.requestId === modalData.requestId
              ? { ...req, ...modalData }
              : req
          )
        );
        toast.success("Request updated successfully!");
      } catch (error) {
        toast.error("Failed to update request. Please try again.");
      }
    }

    setIsViewEditModalVisible(false);
  };

  const handleDepositRequest = (request) => {
    setSelectedRequestId(request.requestId);
    setModalData({
      requestId: request.requestId,
      name: request.name,
      description: request.description,
      startDate: request.startDate
        ? dayjs(request.startDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      endDate: request.endDate
        ? dayjs(request.endDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      location: request.location,
      packageName: request.packageName,
      packagePrice: request.packagePrice,
      listCharacters: request.listCharacters,
      status: request.status,
      price: request.price,
    });
    setIsDepositModalVisible(true);
  };

  const handleDepositConfirm = () => {
    if (depositAmount === null) {
      message.warning("Please select a deposit amount.");
      return;
    }
    const depositValue =
      depositAmount === 50 ? modalData.price * 0.5 : modalData.price;
    toast.success(
      `Deposit of ${depositValue.toLocaleString()} VND confirmed! Moving to Payment Deposit Contract tab.`
    );
    setRequests((prev) =>
      prev.map((req) =>
        req.requestId === selectedRequestId ? { ...req, status: "Active" } : req
      )
    );
    setIsDepositModalVisible(false);
    setDepositAmount(null);
    setSelectedRequestId(null);
  };

  const handlePaymentRequest = (contract) => {
    setSelectedRequestId(contract.requestId);
    setModalData({
      requestId: contract.requestId,
      name: contract.name,
      description: contract.description,
      startDate: contract.startDate
        ? dayjs(contract.startDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      endDate: contract.endDate
        ? dayjs(contract.endDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      location: contract.location,
      packageName: contract.packageName,
      packagePrice: contract.packagePrice,
      listCharacters: contract.listCharacters,
      status: contract.status,
      price: contract.price,
    });
    setIsPaymentModalVisible(true);
  };

  const handlePaymentConfirm = () => {
    if (paymentMethod === null) {
      message.warning("Please select a payment method.");
      return;
    }
    toast.success(
      `Payment via ${paymentMethod} completed! Moving to Completed Contract tab.`
    );
    setRequests((prev) =>
      prev.map((req) =>
        req.requestId === selectedRequestId
          ? { ...req, status: "Completed" }
          : req
      )
    );
    setIsPaymentModalVisible(false);
    setPaymentMethod(null);
    setSelectedRequestId(null);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Active: "warning",
      Completed: "success",
    };
    return (
      <Badge bg={statusColors[status] || "secondary"}>
        {status || "Unknown"}
      </Badge>
    );
  };

  return (
    <div className="my-event-organize bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-my-event">
          <span>My Event Organize</span>
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row className="align-items-center g-3">
            <Col md={12}>
              <Form.Control
                type="text"
                placeholder="Search by name or date (HH:mm DD/MM/YYYY)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </Col>
          </Row>
        </div>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Request Pending and Choose Deposit" key="1">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentPendingItems.length === 0 ? (
              <p className="text-center">No pending requests found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentPendingItems.map((request) => (
                    <Col key={request.requestId} xs={12}>
                      <Card className="event-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="event-title mb-0">
                                      {request.name || "N/A"}
                                    </h3>
                                    {getStatusBadge(request.status)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date:{" "}
                                    {dayjs(request.startDate).format(
                                      "HH:mm DD/MM/YYYY"
                                    ) || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Package: {request.packageName || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Total Price:{" "}
                                    {(request.price || 0).toLocaleString()} VND
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view-edit"
                                  onClick={() => handleViewEditRequest(request)}
                                >
                                  <Eye size={16} className="me-1" />
                                  {request.status === "Pending"
                                    ? "View/Edit"
                                    : "View"}
                                </Button>
                                {request.status === "Browsed" && (
                                  <Button
                                    size="small"
                                    className="btn-deposit"
                                    onClick={() =>
                                      handleDepositRequest(request)
                                    }
                                  >
                                    <CreditCard size={16} className="me-1" />
                                    Choose Deposit
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Row className="mt-5 align-items-center">
                  <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                    <p className="mb-0">
                      Showing{" "}
                      <strong>
                        {(currentPendingPage - 1) * itemsPerPage + 1}
                      </strong>{" "}
                      to{" "}
                      <strong>
                        {Math.min(
                          currentPendingPage * itemsPerPage,
                          filteredPendingRequests.length
                        )}
                      </strong>{" "}
                      of <strong>{filteredPendingRequests.length}</strong>{" "}
                      results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentPendingPage}
                      pageSize={itemsPerPage}
                      total={filteredPendingRequests.length}
                      onChange={handlePendingPageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>

          <TabPane tab="Payment Deposit Contract" key="2">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentActiveItems.length === 0 ? (
              <p className="text-center">No active contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentActiveItems.map((contract) => (
                    <Col key={contract.requestId} xs={12}>
                      <Card className="event-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="event-title mb-0">
                                      {contract.name || "N/A"}
                                    </h3>
                                    {getStatusBadge("Active")}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date:{" "}
                                    {dayjs(contract.startDate).format(
                                      "HH:mm DD/MM/YYYY"
                                    ) || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Package: {contract.packageName || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Total Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Status: Awaiting Payment
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view-edit"
                                  onClick={() =>
                                    handleViewEditRequest(contract)
                                  }
                                >
                                  <Eye size={16} className="me-1" />
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  className="btn-payment"
                                  onClick={() => handlePaymentRequest(contract)}
                                >
                                  <CreditCard size={16} className="me-1" />
                                  Payment Deposit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Row className="mt-5 align-items-center">
                  <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                    <p className="mb-0">
                      Showing{" "}
                      <strong>
                        {(currentActivePage - 1) * itemsPerPage + 1}
                      </strong>{" "}
                      to{" "}
                      <strong>
                        {Math.min(
                          currentActivePage * itemsPerPage,
                          filteredActiveContracts.length
                        )}
                      </strong>{" "}
                      of <strong>{filteredActiveContracts.length}</strong>{" "}
                      results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentActivePage}
                      pageSize={itemsPerPage}
                      total={filteredActiveContracts.length}
                      onChange={handleActivePageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>

          <TabPane tab="Completed Contract" key="3">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentCompletedItems.length === 0 ? (
              <p className="text-center">No completed contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentCompletedItems.map((contract) => (
                    <Col key={contract.requestId} xs={12}>
                      <Card className="event-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="event-title mb-0">
                                      {contract.name || "N/A"}
                                    </h3>
                                    {getStatusBadge(contract.status)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date:{" "}
                                    {dayjs(contract.startDate).format(
                                      "HH:mm DD/MM/YYYY"
                                    ) || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Package: {contract.packageName || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Total Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <Button
                                type="primary"
                                size="small"
                                className="btn-view-edit"
                                onClick={() => handleViewEditRequest(contract)}
                              >
                                <Eye size={16} className="me-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Row className="mt-5 align-items-center">
                  <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                    <p className="mb-0">
                      Showing{" "}
                      <strong>
                        {(currentCompletedPage - 1) * itemsPerPage + 1}
                      </strong>{" "}
                      to{" "}
                      <strong>
                        {Math.min(
                          currentCompletedPage * itemsPerPage,
                          filteredCompletedContracts.length
                        )}
                      </strong>{" "}
                      of <strong>{filteredCompletedContracts.length}</strong>{" "}
                      results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentCompletedPage}
                      pageSize={itemsPerPage}
                      total={filteredCompletedContracts.length}
                      onChange={handleCompletedPageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>
        </Tabs>

        <Modal
          title={
            modalData.status === "Pending"
              ? "View/Edit Event Request"
              : "View Event Request"
          }
          open={isViewEditModalVisible}
          onOk={
            modalData.status === "Pending"
              ? handleViewEditConfirm
              : () => setIsViewEditModalVisible(false)
          }
          onCancel={() => setIsViewEditModalVisible(false)}
          okText={modalData.status === "Pending" ? "Save" : "Close"}
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              display: modalData.status === "Pending" ? "inline" : "none",
            },
          }}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Name</strong>
              </Form.Label>
              {modalData.status === "Pending" ? (
                <Input
                  value={modalData.name}
                  onChange={(e) =>
                    setModalData({ ...modalData, name: e.target.value })
                  }
                  placeholder="Enter event name"
                />
              ) : (
                <p>{modalData.name}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Description</strong>
              </Form.Label>
              {modalData.status === "Pending" ? (
                <TextArea
                  value={modalData.description}
                  onChange={(e) =>
                    setModalData({ ...modalData, description: e.target.value })
                  }
                  placeholder="Enter description"
                />
              ) : (
                <p>{modalData.description}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Start Date</strong>
              </Form.Label>
              <p>{modalData.startDate}</p>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>End Date</strong>
              </Form.Label>
              <p>{modalData.endDate}</p>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Location</strong>
              </Form.Label>
              {modalData.status === "Pending" ? (
                <Input
                  value={modalData.location}
                  onChange={(e) =>
                    setModalData({ ...modalData, location: e.target.value })
                  }
                  placeholder="Enter location"
                />
              ) : (
                <p>{modalData.location}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Package</strong>
              </Form.Label>
              <p>
                {modalData.packageName} -{" "}
                {(modalData.packagePrice || 0).toLocaleString()} VND
              </p>
            </Form.Group>
            <h4>List of Requested Characters:</h4>
            {(modalData.listCharacters || []).length > 0 ? (
              <ul>
                {(modalData.listCharacters || []).map((item, index) => (
                  <li key={index}>
                    {item.characterName} - Quantity: {item.quantity} - Price:{" "}
                    {item.price.toLocaleString()} VND
                  </li>
                ))}
              </ul>
            ) : (
              <p>No characters requested.</p>
            )}
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Total Price</strong>
              </Form.Label>
              <p>{(modalData.price || 0).toLocaleString()} VND</p>
            </Form.Group>
          </Form>
        </Modal>

        <Modal
          title="Choose Deposit Amount"
          open={isDepositModalVisible}
          onOk={handleDepositConfirm}
          onCancel={() => {
            setIsDepositModalVisible(false);
            setDepositAmount(null);
          }}
          okText="Accept"
          cancelText="Cancel"
        >
          <p>Total Price: {(modalData.price || 0).toLocaleString()} VND</p>
          <p>Please select a deposit amount:</p>
          <Radio.Group
            onChange={(e) => setDepositAmount(e.target.value)}
            value={depositAmount}
          >
            <Radio value={50}>
              Deposit 50% ({((modalData.price || 0) * 0.5).toLocaleString()}{" "}
              VND)
            </Radio>
            <Radio value={100}>
              Deposit 100% {(modalData.price || 0).toLocaleString()} VND
            </Radio>
          </Radio.Group>
        </Modal>

        <Modal
          title="Payment Deposit"
          open={isPaymentModalVisible}
          onOk={handlePaymentConfirm}
          onCancel={() => {
            setIsPaymentModalVisible(false);
            setPaymentMethod(null);
          }}
          okText="Confirm Payment"
          cancelText="Cancel"
        >
          <p>Total Price: {(modalData.price || 0).toLocaleString()} VND</p>
          <p>Please select a payment method:</p>
          <Radio.Group
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
          >
            <Radio value="MoMo">MoMo</Radio>
            <Radio value="VNPay">VNPay</Radio>
          </Radio.Group>
        </Modal>
      </Container>
    </div>
  );
};

export default MyEventOrganize;
