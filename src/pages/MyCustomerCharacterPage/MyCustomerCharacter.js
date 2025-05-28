// import React, { useState, useEffect, useMemo } from "react";
// import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
// import {
//   Pagination,
//   Modal,
//   Input,
//   Button,
//   Tabs,
//   Image,
//   Spin,
//   Select,
// } from "antd";
// import { FileText, Calendar, Eye, Delete } from "lucide-react";
// import { useDebounce } from "use-debounce";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyCustomerCharacter.scss";
// import RequestCustomerCharacterService from "../../services/MyCustomerCharacterService/MyCustomerCharacterService.js";

// const { TabPane } = Tabs;
// const { Option } = Select;

// const MyCustomerCharacter = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
//   const [filteredAcceptRequests, setFilteredAcceptRequests] = useState([]);
//   const [filteredRejectRequests, setFilteredRejectRequests] = useState([]);
//   const [filteredCompletedRequests, setFilteredCompletedRequests] = useState(
//     []
//   );
//   const [currentPendingPage, setCurrentPendingPage] = useState(1);
//   const [currentAcceptPage, setCurrentAcceptPage] = useState(1);
//   const [currentRejectPage, setCurrentRejectPage] = useState(1);
//   const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     customerCharacterId: "",
//     name: "",
//     description: "",
//     categoryId: "",
//     createDate: "",
//     status: "",
//     maxHeight: 0,
//     maxWeight: 0,
//     minHeight: 0,
//     minWeight: 0,
//     updateDate: null,
//     createBy: "",
//     reason: null,
//     images: [],
//   });
//   const [newImages, setNewImages] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [accounts, setAccounts] = useState({});
//   const [loading, setLoading] = useState(false);

//   const itemsPerPage = 5;

//   // Lấy accountId từ token
//   const accessToken = localStorage.getItem("accessToken");
//   const decoded = jwtDecode(accessToken);
//   const accountId = decoded?.Id;

//   // Gọi API để lấy danh sách yêu cầu, categories và thông tin accounts
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const requestData =
//           await RequestCustomerCharacterService.getRequestCustomerCharacterByAccountId(
//             accountId
//           );
//         setRequests(Array.isArray(requestData) ? requestData : []);

//         const categoryData =
//           await RequestCustomerCharacterService.getAllCategory();
//         setCategories(Array.isArray(categoryData) ? categoryData : []);

//         const accountIds = [...new Set(requestData.map((req) => req.createBy))];
//         const accountPromises = accountIds.map((id) =>
//           RequestCustomerCharacterService.getAccountCustomerCharacter(id)
//         );
//         const accountResponses = await Promise.all(accountPromises);
//         const accountsData = accountResponses.reduce((acc, account) => {
//           acc[account.accountId] = account;
//           return acc;
//         }, {});
//         setAccounts(accountsData);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//         toast.error("Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [accountId]);

//   // Hàm chuyển đổi createDate sang định dạng DD/MM/YYYY
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     if (isNaN(date)) return "";
//     return date.toLocaleDateString("en-GB"); // Định dạng DD/MM/YYYY
//   };

//   // Lọc các requests theo trạng thái và từ khóa tìm kiếm
//   const filteredRequests = useMemo(() => {
//     const searchLower = debouncedSearchTerm.toLowerCase();

//     const filterByStatusAndSearch = (status) =>
//       requests.filter((req) => {
//         const matchesStatus = req.status === status;
//         const formattedDate = formatDate(req.createDate);
//         const matchesSearch =
//           req.name.toLowerCase().includes(searchLower) ||
//           formattedDate.includes(debouncedSearchTerm);
//         return matchesStatus && (debouncedSearchTerm ? matchesSearch : true);
//       });

//     return {
//       pending: filterByStatusAndSearch("Pending"),
//       accept: filterByStatusAndSearch("Accept"),
//       reject: filterByStatusAndSearch("Reject"),
//       completed: filterByStatusAndSearch("Completed"),
//     };
//   }, [debouncedSearchTerm, requests]);

//   useEffect(() => {
//     setFilteredPendingRequests(filteredRequests.pending);
//     setFilteredAcceptRequests(filteredRequests.accept);
//     setFilteredRejectRequests(filteredRequests.reject);
//     setFilteredCompletedRequests(filteredRequests.completed);

//     setCurrentPendingPage(1);
//     setCurrentAcceptPage(1);
//     setCurrentRejectPage(1);
//     setCurrentCompletedPage(1);
//   }, [filteredRequests]);

//   const paginate = (data, page, perPage) => {
//     const start = (page - 1) * perPage;
//     return data.slice(start, start + perPage);
//   };

//   const handleOpenModal = (request) => {
//     setModalData({
//       customerCharacterId: request.customerCharacterId,
//       name: request.name,
//       description: request.description,
//       categoryId: request.categoryId,
//       createDate: request.createDate,
//       status: request.status,
//       maxHeight: request.maxHeight,
//       maxWeight: request.maxWeight,
//       minHeight: request.minHeight,
//       minWeight: request.minWeight,
//       updateDate: request.updateDate,
//       createBy: request.createBy,
//       reason: request.reason,
//       images: request.customerCharacterImageResponses || [],
//     });
//     setNewImages([]);
//     setIsModalVisible(true);
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setNewImages(files);
//   };

//   const handleRemoveImage = (imageId) => {
//     setModalData((prev) => ({
//       ...prev,
//       images: prev.images.filter(
//         (img) => img.customerCharacterImageId !== imageId
//       ),
//     }));
//   };

//   const handleUpdateRequest = async () => {
//     setLoading(true);
//     try {
//       const updateData = {
//         accountId: accountId,
//         customerCharacterRequestId: modalData.customerCharacterId,
//         name: modalData.name,
//         description: modalData.description,
//         categoryId: modalData.categoryId,
//         minHeight: modalData.minHeight,
//         maxHeight: modalData.maxHeight,
//         minWeight: modalData.minWeight,
//         maxWeight: modalData.maxWeight,
//         images: newImages,
//       };

//       const response =
//         await RequestCustomerCharacterService.UpdateCustomerCharacter(
//           updateData
//         );

//       setRequests((prev) =>
//         prev.map((req) =>
//           req.customerCharacterId === modalData.customerCharacterId
//             ? {
//                 ...req,
//                 ...modalData,
//                 customerCharacterImageResponses:
//                   response.images || modalData.images,
//               }
//             : req
//         )
//       );

//       toast.success("Customer character updated successfully!");
//       setIsModalVisible(false);
//       setNewImages([]);
//     } catch (error) {
//       console.error("Failed to update customer character:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to update customer character."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setModalData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const getCategoryNameById = (categoryId) => {
//     const category = categories.find((cat) => cat.categoryId === categoryId);
//     return category ? category.categoryName : "N/A";
//   };

//   const getAccountNameById = (accountId) => {
//     const account = accounts[accountId];
//     return account ? account.name : "N/A";
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       Pending: "primary",
//       Accept: "success",
//       Reject: "danger",
//       Completed: "success",
//     };
//     return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
//   };

//   const isEditable = modalData.status === "Pending";

//   const currentPendingItems = paginate(
//     filteredPendingRequests,
//     currentPendingPage,
//     itemsPerPage
//   );
//   const currentAcceptItems = paginate(
//     filteredAcceptRequests,
//     currentAcceptPage,
//     itemsPerPage
//   );
//   const currentRejectItems = paginate(
//     filteredRejectRequests,
//     currentRejectPage,
//     itemsPerPage
//   );
//   const currentCompletedItems = paginate(
//     filteredCompletedRequests,
//     currentCompletedPage,
//     itemsPerPage
//   );

//   return (
//     <div className="rental-management bg-light min-vh-100">
//       <Container className="py-5">
//         <h1 className="text-center mb-5 fw-bold title-rental-management">
//           <span>My Request Customer Character</span>
//         </h1>

//         <div className="filter-section bg-white p-4 rounded shadow mb-5">
//           <Row>
//             <Col md={12}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name or date (DD/MM/YYYY)..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input"
//               />
//             </Col>
//           </Row>
//         </div>

//         {loading ? (
//           <Spin
//             tip="Loading..."
//             style={{ display: "block", textAlign: "center" }}
//           />
//         ) : (
//           <Tabs defaultActiveKey="1" type="card">
//             <TabPane tab="Pending Requests" key="1">
//               {currentPendingItems.length === 0 ? (
//                 <p className="text-center">No pending requests found.</p>
//               ) : (
//                 <>
//                   <Row className="g-4">
//                     {currentPendingItems.map((req) => (
//                       <Col key={req.customerCharacterId} xs={12}>
//                         <Card className="rental-card shadow">
//                           <Card.Body>
//                             <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
//                               <div className="flex-grow-1">
//                                 <div className="d-flex gap-3">
//                                   <div className="icon-circle">
//                                     <FileText size={24} />
//                                   </div>
//                                   <div>
//                                     <h3 className="rental-title">{req.name}</h3>

//                                     <div className="text-muted small">
//                                       <Calendar size={16} /> Create Date:{" "}
//                                       {formatDate(req.createDate)}
//                                     </div>
//                                     <div className="text-muted small">
//                                       <FileText size={16} /> Description:{" "}
//                                       {req.description}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="d-flex gap-2 align-items-center">
//                                 {getStatusBadge(req.status)}
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view"
//                                   onClick={() => handleOpenModal(req)}
//                                 >
//                                   <Eye size={16} /> View
//                                 </Button>
//                               </div>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                   <Pagination
//                     current={currentPendingPage}
//                     pageSize={itemsPerPage}
//                     total={filteredPendingRequests.length}
//                     onChange={(page) => setCurrentPendingPage(page)}
//                     showSizeChanger={false}
//                     style={{ marginTop: "20px", textAlign: "right" }}
//                   />
//                 </>
//               )}
//             </TabPane>

//             <TabPane tab="Accept Requests" key="2">
//               {currentAcceptItems.length === 0 ? (
//                 <p className="text-center">No accept requests found.</p>
//               ) : (
//                 <>
//                   <Row className="g-4">
//                     {currentAcceptItems.map((req) => (
//                       <Col key={req.customerCharacterId} xs={12}>
//                         <Card className="rental-card shadow">
//                           <Card.Body>
//                             <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
//                               <div className="flex-grow-1">
//                                 <div className="d-flex gap-3">
//                                   <div className="icon-circle">
//                                     <FileText size={24} />
//                                   </div>
//                                   <div>
//                                     <h3 className="rental-title">{req.name}</h3>
//                                     <div className="text-muted small">
//                                       <Calendar size={16} /> Create Date:{" "}
//                                       {formatDate(req.createDate)}
//                                     </div>
//                                     <div className="text-muted small">
//                                       <FileText size={16} /> Description:{" "}
//                                       {req.description}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="d-flex gap-2 align-items-center">
//                                 {getStatusBadge(req.status)}
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view"
//                                   onClick={() => handleOpenModal(req)}
//                                 >
//                                   <Eye size={16} /> View
//                                 </Button>
//                               </div>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                   <Pagination
//                     current={currentAcceptPage}
//                     pageSize={itemsPerPage}
//                     total={filteredAcceptRequests.length}
//                     onChange={(page) => setCurrentAcceptPage(page)}
//                     showSizeChanger={false}
//                     style={{ marginTop: "20px", textAlign: "right" }}
//                   />
//                 </>
//               )}
//             </TabPane>

//             <TabPane tab="Reject Requests" key="3">
//               {currentRejectItems.length === 0 ? (
//                 <p className="text-center">No reject requests found.</p>
//               ) : (
//                 <>
//                   <Row className="g-4">
//                     {currentRejectItems.map((req) => (
//                       <Col key={req.customerCharacterId} xs={12}>
//                         <Card className="rental-card shadow">
//                           <Card.Body>
//                             <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
//                               <div className="flex-grow-1">
//                                 <div className="d-flex gap-3">
//                                   <div className="icon-circle">
//                                     <FileText size={24} />
//                                   </div>
//                                   <div>
//                                     <h3 className="rental-title">{req.name}</h3>
//                                     <div className="text-muted small">
//                                       <Calendar size={16} /> Create Date:{" "}
//                                       {formatDate(req.createDate)}
//                                     </div>
//                                     <div className="text-muted small">
//                                       <FileText size={16} /> Description:{" "}
//                                       {req.description}
//                                     </div>
//                                     <div className="text-muted small">
//                                       <FileText size={16} />{" "}
//                                       <strong style={{ color: "red" }}>
//                                         Reason: {req.reason}
//                                       </strong>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="d-flex gap-2 align-items-center">
//                                 {getStatusBadge(req.status)}
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view"
//                                   onClick={() => handleOpenModal(req)}
//                                 >
//                                   <Eye size={16} /> View
//                                 </Button>
//                               </div>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                   <Pagination
//                     current={currentRejectPage}
//                     pageSize={itemsPerPage}
//                     total={filteredRejectRequests.length}
//                     onChange={(page) => setCurrentRejectPage(page)}
//                     showSizeChanger={false}
//                     style={{ marginTop: "20px", textAlign: "right" }}
//                   />
//                 </>
//               )}
//             </TabPane>

//             <TabPane tab="Completed Requests" key="4">
//               {currentCompletedItems.length === 0 ? (
//                 <p className="text-center">No completed requests found.</p>
//               ) : (
//                 <>
//                   <Row className="g-4">
//                     {currentCompletedItems.map((req) => (
//                       <Col key={req.customerCharacterId} xs={12}>
//                         <Card className="rental-card shadow">
//                           <Card.Body>
//                             <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
//                               <div className="flex-grow-1">
//                                 <div className="d-flex gap-3">
//                                   <div className="icon-circle">
//                                     <FileText size={24} />
//                                   </div>
//                                   <div>
//                                     <h3 className="rental-title">{req.name}</h3>
//                                     <div className="text-muted small">
//                                       <Calendar size={16} /> Create Date:{" "}
//                                       {formatDate(req.createDate)}
//                                     </div>
//                                     <div className="text-muted small">
//                                       <FileText size={16} /> Description:{" "}
//                                       {req.description}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="d-flex gap-2 align-items-center">
//                                 {getStatusBadge(req.status)}
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view"
//                                   onClick={() => handleOpenModal(req)}
//                                 >
//                                   <Eye size={16} /> View
//                                 </Button>
//                               </div>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                   <Pagination
//                     current={currentCompletedPage}
//                     pageSize={itemsPerPage}
//                     total={filteredCompletedRequests.length}
//                     onChange={(page) => setCurrentCompletedPage(page)}
//                     showSizeChanger={false}
//                     style={{ marginTop: "20px", textAlign: "right" }}
//                   />
//                 </>
//               )}
//             </TabPane>
//           </Tabs>
//         )}

//         {/* Modal hợp nhất View và Edit */}
//         <Modal
//           title={
//             isEditable
//               ? "Edit Customer Character Request"
//               : "View Customer Character Request"
//           }
//           open={isModalVisible}
//           onOk={
//             isEditable ? handleUpdateRequest : () => setIsModalVisible(false)
//           }
//           onCancel={() => setIsModalVisible(false)}
//           okText={isEditable ? "Update" : "Close"}
//           cancelText="Cancel"
//           confirmLoading={loading}
//           width={600}
//           footer={
//             isEditable
//               ? [
//                   <Button key="cancel" onClick={() => setIsModalVisible(false)}>
//                     Cancel
//                   </Button>,
//                   <Button
//                     key="update"
//                     type="primary"
//                     onClick={handleUpdateRequest}
//                     loading={loading}
//                   >
//                     Update
//                   </Button>,
//                 ]
//               : [
//                   <Button key="close" onClick={() => setIsModalVisible(false)}>
//                     Close
//                   </Button>,
//                 ]
//           }
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Input
//                 value={modalData.name}
//                 onChange={(e) => handleInputChange("name", e.target.value)}
//                 disabled={true}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Input.TextArea
//                 value={modalData.description}
//                 onChange={(e) =>
//                   handleInputChange("description", e.target.value)
//                 }
//                 rows={3}
//                 disabled={!isEditable}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Category</Form.Label>
//               {isEditable ? (
//                 <Select
//                   value={modalData.categoryId}
//                   onChange={(value) => handleInputChange("categoryId", value)}
//                   style={{ width: "100%" }}
//                 >
//                   {categories.map((category) => (
//                     <Option
//                       key={category.categoryId}
//                       value={category.categoryId}
//                     >
//                       {category.categoryName}
//                     </Option>
//                   ))}
//                 </Select>
//               ) : (
//                 <Input
//                   value={getCategoryNameById(modalData.categoryId)}
//                   disabled
//                 />
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Max Height (cm)</Form.Label>
//               <Input
//                 type="number"
//                 value={modalData.maxHeight}
//                 onChange={(e) =>
//                   handleInputChange("maxHeight", Number(e.target.value))
//                 }
//                 disabled={!isEditable}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Max Weight (kg)</Form.Label>
//               <Input
//                 type="number"
//                 value={modalData.maxWeight}
//                 onChange={(e) =>
//                   handleInputChange("maxWeight", Number(e.target.value))
//                 }
//                 disabled={!isEditable}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Min Height (cm)</Form.Label>
//               <Input
//                 type="number"
//                 value={modalData.minHeight}
//                 onChange={(e) =>
//                   handleInputChange("minHeight", Number(e.target.value))
//                 }
//                 disabled={!isEditable}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Min Weight (kg)</Form.Label>
//               <Input
//                 type="number"
//                 value={modalData.minWeight}
//                 onChange={(e) =>
//                   handleInputChange("minWeight", Number(e.target.value))
//                 }
//                 disabled={!isEditable}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Create Date</Form.Label>
//               <Input value={formatDate(modalData.createDate)} disabled />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Update Date</Form.Label>
//               <Input
//                 value={
//                   modalData.updateDate
//                     ? formatDate(modalData.updateDate)
//                     : "N/A"
//                 }
//                 disabled
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Created By</Form.Label>
//               <Input value={getAccountNameById(modalData.createBy)} disabled />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Status</Form.Label>
//               <Input value={modalData.status} disabled />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Reason</Form.Label>
//               <Input value={modalData.reason || "N/A"} disabled />
//             </Form.Group>
//             <h5>Images</h5>
//             {modalData.images.length === 0 ? (
//               <p>No images available.</p>
//             ) : (
//               modalData.images.map((img) => (
//                 <div
//                   key={img.customerCharacterImageId}
//                   className="mb-3 d-flex align-items-center"
//                 >
//                   <Image
//                     src={img.urlImage}
//                     alt="Character Image"
//                     width={100}
//                     preview
//                     style={{ display: "block", marginRight: "10px" }}
//                   />
//                   <div>
//                     <p>Create Date: {formatDate(img.createDate)}</p>
//                     {isEditable && (
//                       <Button
//                         danger
//                         size="small"
//                         onClick={() =>
//                           handleRemoveImage(img.customerCharacterImageId)
//                         }
//                       >
//                         <Delete size={16} /> Remove
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//             {isEditable && (
//               <Form.Group className="mb-3">
//                 <Form.Label>Upload New Images</Form.Label>
//                 <Input
//                   type="file"
//                   multiple
//                   onChange={handleImageUpload}
//                   accept="image/*"
//                 />
//                 {newImages.length > 0 && (
//                   <p>Selected {newImages.length} new image(s)</p>
//                 )}
//               </Form.Group>
//             )}
//           </Form>
//         </Modal>
//       </Container>
//     </div>
//   );
// };

// export default MyCustomerCharacter;

/// them filter =======================================================
// import React, { useState, useEffect, useMemo } from "react";
// import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
// import {
//   Pagination,
//   Modal,
//   Input,
//   Button,
//   Tabs,
//   Image,
//   Spin,
//   Select,
// } from "antd";
// import { FileText, Calendar, Eye, Delete } from "lucide-react";
// import { useDebounce } from "use-debounce";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyCustomerCharacter.scss";
// import RequestCustomerCharacterService from "../../services/MyCustomerCharacterService/MyCustomerCharacterService.js";

// const { TabPane } = Tabs;
// const { Option } = Select;

// const MyCustomerCharacter = () => {
//   const [requests, setRequests] = useState([]);
//   const [filteredAllRequests, setFilteredAllRequests] = useState([]);
//   const [filteredRejectRequests, setFilteredRejectRequests] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentRejectPage, setCurrentRejectPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
//   const [selectedStatuses, setSelectedStatuses] = useState([
//     "Pending",
//     "Accept",
//     "Completed",
//   ]); // State cho checkbox
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     customerCharacterId: "",
//     name: "",
//     description: "",
//     categoryId: "",
//     createDate: "",
//     status: "",
//     maxHeight: 0,
//     maxWeight: 0,
//     minHeight: 0,
//     minWeight: 0,
//     updateDate: null,
//     createBy: "",
//     reason: null,
//     images: [],
//   });
//   const [newImages, setNewImages] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [accounts, setAccounts] = useState({});
//   const [loading, setLoading] = useState(false);

//   const itemsPerPage = 5;

//   // Lấy accountId từ token
//   const accessToken = localStorage.getItem("accessToken");
//   const decoded = jwtDecode(accessToken);
//   const accountId = decoded?.Id;

//   // Gọi API để lấy danh sách yêu cầu, categories và thông tin accounts
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const requestData =
//           await RequestCustomerCharacterService.getRequestCustomerCharacterByAccountId(
//             accountId
//           );
//         setRequests(Array.isArray(requestData) ? requestData : []);

//         const categoryData =
//           await RequestCustomerCharacterService.getAllCategory();
//         setCategories(Array.isArray(categoryData) ? categoryData : []);

//         const accountIds = [...new Set(requestData.map((req) => req.createBy))];
//         const accountPromises = accountIds.map((id) =>
//           RequestCustomerCharacterService.getAccountCustomerCharacter(id)
//         );
//         const accountResponses = await Promise.all(accountPromises);
//         const accountsData = accountResponses.reduce((acc, account) => {
//           acc[account.accountId] = account;
//           return acc;
//         }, {});
//         setAccounts(accountsData);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//         toast.error("Failed to load data.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [accountId]);

//   // Hàm chuyển đổi createDate sang định dạng DD/MM/YYYY
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     if (isNaN(date)) return "";
//     return date.toLocaleDateString("en-GB");
//   };

//   // Xử lý thay đổi checkbox
//   const handleStatusFilterChange = (status) => {
//     setSelectedStatuses((prev) =>
//       prev.includes(status)
//         ? prev.filter((s) => s !== status)
//         : [...prev, status]
//     );
//     setCurrentPage(1); // Reset về trang đầu khi thay đổi bộ lọc
//   };

//   // Lọc các requests theo trạng thái và từ khóa tìm kiếm
//   const filteredRequests = useMemo(() => {
//     const searchLower = debouncedSearchTerm.toLowerCase();
//     const statusesToFilter =
//       selectedStatuses.length > 0
//         ? selectedStatuses
//         : ["Pending", "Accept", "Completed"]; // Nếu không chọn trạng thái, hiển thị tất cả

//     const filterByStatusAndSearch = (statuses) =>
//       requests.filter((req) => {
//         const matchesStatus = statuses.includes(req.status);
//         const formattedDate = formatDate(req.createDate);
//         const matchesSearch =
//           req.name.toLowerCase().includes(searchLower) ||
//           formattedDate.includes(debouncedSearchTerm);
//         return matchesStatus && (debouncedSearchTerm ? matchesSearch : true);
//       });

//     return {
//       all: filterByStatusAndSearch(statusesToFilter),
//       reject: filterByStatusAndSearch(["Reject"]),
//     };
//   }, [debouncedSearchTerm, requests, selectedStatuses]);

//   useEffect(() => {
//     setFilteredAllRequests(filteredRequests.all);
//     setFilteredRejectRequests(filteredRequests.reject);
//     setCurrentPage(1);
//     setCurrentRejectPage(1);
//   }, [filteredRequests]);

//   const paginate = (data, page, perPage) => {
//     const start = (page - 1) * perPage;
//     return data.slice(start, start + perPage);
//   };

//   const handleOpenModal = (request) => {
//     setModalData({
//       customerCharacterId: request.customerCharacterId,
//       name: request.name,
//       description: request.description,
//       categoryId: request.categoryId,
//       createDate: request.createDate,
//       status: request.status,
//       maxHeight: request.maxHeight,
//       maxWeight: request.maxWeight,
//       minHeight: request.minHeight,
//       minWeight: request.minWeight,
//       updateDate: request.updateDate,
//       createBy: request.createBy,
//       reason: request.reason,
//       images: request.customerCharacterImageResponses || [],
//     });
//     setNewImages([]);
//     setIsModalVisible(true);
//   };

//   // const handleImageUpload = (e) => {
//   //   const files = Array.from(e.target.files);
//   //   setNewImages(files);
//   // };
//   const handleImageUpload = (event) => {
//     const files = Array.from(event.target.files);
//     const imageUrls = files.map((file) => URL.createObjectURL(file));
//     setNewImages(imageUrls);
//   };
//   React.useEffect(() => {
//     return () => {
//       newImages.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [newImages]);
//   const handleRemoveImage = (imageId) => {
//     setModalData((prev) => ({
//       ...prev,
//       images: prev.images.filter(
//         (img) => img.customerCharacterImageId !== imageId
//       ),
//     }));
//   };

//   const handleUpdateRequest = async () => {
//     setLoading(true);
//     try {
//       const updateData = {
//         accountId: accountId,
//         customerCharacterRequestId: modalData.customerCharacterId,
//         name: modalData.name,
//         description: modalData.description,
//         categoryId: modalData.categoryId,
//         minHeight: modalData.minHeight,
//         maxHeight: modalData.maxHeight,
//         minWeight: modalData.minWeight,
//         maxWeight: modalData.maxWeight,
//         images: newImages,
//       };

//       const response =
//         await RequestCustomerCharacterService.UpdateCustomerCharacter(
//           updateData
//         );

//       setRequests((prev) =>
//         prev.map((req) =>
//           req.customerCharacterId === modalData.customerCharacterId
//             ? {
//                 ...req,
//                 ...modalData,
//                 customerCharacterImageResponses:
//                   response.images || modalData.images,
//               }
//             : req
//         )
//       );

//       toast.success("Customer character updated successfully!");
//       setIsModalVisible(false);
//       setNewImages([]);
//     } catch (error) {
//       console.error("Failed to update customer character:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to update customer character."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setModalData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const getCategoryNameById = (categoryId) => {
//     const category = categories.find((cat) => cat.categoryId === categoryId);
//     return category ? category.categoryName : "N/A";
//   };

//   const getAccountNameById = (accountId) => {
//     const account = accounts[accountId];
//     return account ? account.name : "N/A";
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       Pending: "primary",
//       Accept: "warning",
//       Reject: "danger",
//       Completed: "success",
//     };
//     return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
//   };

//   const isEditable = modalData.status === "Pending";

//   const currentAllItems = paginate(
//     filteredAllRequests,
//     currentPage,
//     itemsPerPage
//   );
//   const currentRejectItems = paginate(
//     filteredRejectRequests,
//     currentRejectPage,
//     itemsPerPage
//   );

//   return (
//     <div className="rental-management bg-light min-vh-100">
//       <Container className="py-5">
//         <h1 className="text-center mb-5 fw-bold title-rental-management">
//           <span>My Request Character</span>
//         </h1>

//         <div className="filter-section bg-white p-4 rounded shadow mb-5">
//           <Row>
//             <Col md={12}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name or date (DD/MM/YYYY)..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input mb-3"
//               />
//             </Col>
//           </Row>
//         </div>

//         {loading ? (
//           <Spin
//             tip="Loading..."
//             style={{ display: "block", textAlign: "center" }}
//           />
//         ) : (
//           <Tabs defaultActiveKey="1" type="card">
//             <TabPane tab="All Requests" key="1">
//               <Col md={12}>
//                 <Form.Label>Filter by Status:</Form.Label>
//                 <div className="d-flex gap-3" style={{ marginLeft: "10px" }}>
//                   {["Pending", "Accept", "Completed"].map((status) => (
//                     <Form.Check
//                       key={status}
//                       type="checkbox"
//                       label={status}
//                       checked={selectedStatuses.includes(status)}
//                       onChange={() => handleStatusFilterChange(status)}
//                     />
//                   ))}
//                 </div>
//               </Col>
//               {currentAllItems.length === 0 ? (
//                 <p className="text-center">No requests found.</p>
//               ) : (
//                 <>
//                   <Row className="g-4">
//                     {currentAllItems.map((req) => (
//                       <Col key={req.customerCharacterId} xs={12}>
//                         <Card className="rental-card shadow">
//                           <Card.Body>
//                             <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                               <div className="flex-grow-1">
//                                 <div className="d-flex gap-3">
//                                   <div className="icon-circle">
//                                     <FileText size={24} />
//                                   </div>
//                                   <div>
//                                     <h3 className="rental-title">
//                                       {req.name} &nbsp;{" "}
//                                       {getStatusBadge(req.status)}
//                                     </h3>
//                                     <div className="text-muted small">
//                                       <Calendar size={16} /> Create Date:{" "}
//                                       {req.createDate}
//                                     </div>
//                                     <div className="text-muted small">
//                                       <FileText size={16} /> Description:{" "}
//                                       {req.description}
//                                     </div>
//                                     {req.reason && (
//                                       <div className="text-muted small">
//                                         <FileText size={16} />{" "}
//                                         <strong style={{ color: "red" }}>
//                                           Reason: {req.reason}
//                                         </strong>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                                 <Button
//                                   type="primary"
//                                   className="btn-view"
//                                   onClick={() => handleOpenModal(req)}
//                                 >
//                                   <Eye size={16} /> View
//                                 </Button>
//                               </div>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                   <Pagination
//                     current={currentPage}
//                     pageSize={itemsPerPage}
//                     total={filteredAllRequests.length}
//                     onChange={(page) => setCurrentPage(page)}
//                     showSizeChanger={false}
//                     style={{ marginTop: "20px", textAlign: "right" }}
//                   />
//                 </>
//               )}
//             </TabPane>

//             <TabPane tab="Reject Requests" key="3">
//               {currentRejectItems.length === 0 ? (
//                 <p className="text-center">No reject requests found.</p>
//               ) : (
//                 <>
//                   <Row className="g-4">
//                     {currentRejectItems.map((req) => (
//                       <Col key={req.customerCharacterId} xs={12}>
//                         <Card className="rental-card shadow">
//                           <Card.Body>
//                             <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                               <div className="flex-grow-1">
//                                 <div className="d-flex gap-3">
//                                   <div className="icon-circle">
//                                     <FileText size={24} />
//                                   </div>
//                                   <div>
//                                     <h3 className="rental-title">
//                                       {req.name} &nbsp;{" "}
//                                       {getStatusBadge(req.status)}
//                                     </h3>
//                                     <div className="text-muted small">
//                                       <Calendar size={16} /> Create Date:{" "}
//                                       {req.createDate}
//                                     </div>
//                                     <div className="text-muted small">
//                                       <FileText size={16} /> Description:{" "}
//                                       {req.description}
//                                     </div>
//                                     <div className="text-muted small">
//                                       <FileText size={16} />{" "}
//                                       <strong style={{ color: "red" }}>
//                                         Reason: {req.reason}
//                                       </strong>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                                 <Button
//                                   type="primary"
//                                   className="btn-view"
//                                   onClick={() => handleOpenModal(req)}
//                                 >
//                                   <Eye size={16} /> View
//                                 </Button>
//                               </div>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                   <Pagination
//                     current={currentRejectPage}
//                     pageSize={itemsPerPage}
//                     total={filteredRejectRequests.length}
//                     onChange={(page) => setCurrentRejectPage(page)}
//                     showSizeChanger={false}
//                     style={{ marginTop: "20px", textAlign: "right" }}
//                   />
//                 </>
//               )}
//             </TabPane>
//           </Tabs>
//         )}

//         {/* Modal hợp nhất View và Edit */}
//         <Modal
//           title={
//             isEditable
//               ? "Edit Customer Character Request"
//               : "View Customer Character Request"
//           }
//           open={isModalVisible}
//           onOk={
//             isEditable ? handleUpdateRequest : () => setIsModalVisible(false)
//           }
//           onCancel={() => setIsModalVisible(false)}
//           okText={isEditable ? "Update" : "Close"}
//           cancelText="Cancel"
//           confirmLoading={loading}
//           width={600}
//           footer={
//             isEditable
//               ? [
//                   <Button key="cancel" onClick={() => setIsModalVisible(false)}>
//                     Cancel
//                   </Button>,
//                   <Button
//                     key="update"
//                     type="primary"
//                     onClick={handleUpdateRequest}
//                     loading={loading}
//                   >
//                     Update
//                   </Button>,
//                 ]
//               : [
//                   <Button key="close" onClick={() => setIsModalVisible(false)}>
//                     Close
//                   </Button>,
//                 ]
//           }
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Input
//                 value={modalData.name}
//                 onChange={(e) => handleInputChange("name", e.target.value)}
//                 disabled={true}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Input.TextArea
//                 value={modalData.description}
//                 onChange={(e) =>
//                   handleInputChange("description", e.target.value)
//                 }
//                 rows={3}
//                 disabled={!isEditable}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Category</Form.Label>
//               {isEditable ? (
//                 <Select
//                   value={modalData.categoryId}
//                   onChange={(value) => handleInputChange("categoryId", value)}
//                   style={{ width: "100%" }}
//                 >
//                   {categories.map((category) => (
//                     <Option
//                       key={category.categoryId}
//                       value={category.categoryId}
//                     >
//                       {category.categoryName}
//                     </Option>
//                   ))}
//                 </Select>
//               ) : (
//                 <Input
//                   value={getCategoryNameById(modalData.categoryId)}
//                   disabled
//                 />
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Max Height (cm)</Form.Label>
//               <Input
//                 type="number"
//                 value={modalData.maxHeight}
//                 onChange={(e) =>
//                   handleInputChange("maxHeight", Number(e.target.value))
//                 }
//                 disabled={!isEditable}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Max Weight (kg)</Form.Label>
//               <Input
//                 type="number"
//                 value={modalData.maxWeight}
//                 onChange={(e) =>
//                   handleInputChange("maxWeight", Number(e.target.value))
//                 }
//                 disabled={!isEditable}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Min Height (cm)</Form.Label>
//               <Input
//                 type="number"
//                 value={modalData.minHeight}
//                 onChange={(e) =>
//                   handleInputChange("minHeight", Number(e.target.value))
//                 }
//                 disabled={!isEditable}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Min Weight (kg)</Form.Label>
//               <Input
//                 type="number"
//                 value={modalData.minWeight}
//                 onChange={(e) =>
//                   handleInputChange("minWeight", Number(e.target.value))
//                 }
//                 disabled={!isEditable}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Create Date</Form.Label>
//               <Input value={formatDate(modalData.createDate)} disabled />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Update Date</Form.Label>
//               <Input
//                 value={
//                   modalData.updateDate
//                     ? formatDate(modalData.updateDate)
//                     : "N/A"
//                 }
//                 disabled
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Created By</Form.Label>
//               <Input value={getAccountNameById(modalData.createBy)} disabled />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Status</Form.Label>
//               <Input value={modalData.status} disabled />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Reason</Form.Label>
//               <Input value={modalData.reason || "N/A"} disabled />
//             </Form.Group>
//             <h5>Images</h5>
//             {modalData.images.length === 0 ? (
//               <p>No images available.</p>
//             ) : (
//               modalData.images.map((img) => (
//                 <div
//                   key={img.customerCharacterImageId}
//                   className="mb-3 d-flex align-items-center"
//                 >
//                   <Image
//                     src={img.urlImage}
//                     alt="Character Image"
//                     width={100}
//                     preview
//                     style={{ display: "block", marginRight: "10px" }}
//                   />
//                   <div>
//                     <p>Create Date: {formatDate(img.createDate)}</p>
//                     {isEditable && (
//                       <Button
//                         danger
//                         size="small"
//                         onClick={() =>
//                           handleRemoveImage(img.customerCharacterImageId)
//                         }
//                       >
//                         <Delete size={16} /> Remove
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//             {isEditable && (
//               <Form.Group className="mb-3">
//                 <Form.Label>Upload New Images</Form.Label>
//                 <Form.Control
//                   type="file"
//                   multiple
//                   onChange={handleImageUpload}
//                   accept="image/*"
//                 />
//                 {newImages.length > 0 && (
//                   <div>
//                     <p>Selected {newImages.length} new image(s)</p>
//                     <div
//                       style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
//                     >
//                       {newImages.map((imageUrl, index) => (
//                         <Image
//                           key={index}
//                           src={imageUrl}
//                           alt={`Preview ${index + 1}`}
//                           style={{
//                             maxWidth: "200px",
//                             maxHeight: "200px",
//                             objectFit: "cover",
//                             margin: "5px",
//                           }}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </Form.Group>
//             )}
//           </Form>
//         </Modal>
//       </Container>
//     </div>
//   );
// };

// export default MyCustomerCharacter;

/// fix edit
import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import {
  Pagination,
  Modal,
  Input,
  Button,
  Tabs,
  Image,
  Spin,
  Select,
} from "antd";
import { FileText, Calendar, Eye, Delete, User } from "lucide-react";
import { useDebounce } from "use-debounce";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyCustomerCharacter.scss";
import RequestCustomerCharacterService from "../../services/MyCustomerCharacterService/MyCustomerCharacterService.js";

const { TabPane } = Tabs;
const { Option } = Select;

const MyCustomerCharacter = () => {
  const [requests, setRequests] = useState([]);
  const [filteredAllRequests, setFilteredAllRequests] = useState([]);
  const [filteredRejectRequests, setFilteredRejectRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRejectPage, setCurrentRejectPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [selectedStatuses, setSelectedStatuses] = useState([
    "Pending",
    "Accept",
    "Completed",
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    customerCharacterId: "",
    name: "",
    description: "",
    categoryId: "",
    createDate: "",
    status: "",
    maxHeight: 0,
    maxWeight: 0,
    minHeight: 0,
    minWeight: 0,
    updateDate: null,
    createBy: "",
    reason: null,
    images: [],
  });
  const [newImages, setNewImages] = useState([]); // Store File objects
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Store URLs for previews
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;

  // Get accountId from token
  const accessToken = localStorage.getItem("accessToken");
  const decoded = jwtDecode(accessToken);
  const accountId = decoded?.Id;

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const requestData =
          await RequestCustomerCharacterService.getRequestCustomerCharacterByAccountId(
            accountId
          );
        setRequests(Array.isArray(requestData) ? requestData : []);

        const categoryData =
          await RequestCustomerCharacterService.getAllCategory();
        setCategories(Array.isArray(categoryData) ? categoryData : []);

        const accountIds = [...new Set(requestData.map((req) => req.createBy))];
        const accountPromises = accountIds.map((id) =>
          RequestCustomerCharacterService.getAccountCustomerCharacter(id)
        );
        const accountResponses = await Promise.all(accountPromises);
        const accountsData = accountResponses.reduce((acc, account) => {
          acc[account.accountId] = account;
          return acc;
        }, {});
        setAccounts(accountsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accountId]);

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
    setCurrentPage(1);
  };

  // Filter requests
  const filteredRequests = useMemo(() => {
    const searchLower = debouncedSearchTerm.toLowerCase();
    const statusesToFilter =
      selectedStatuses.length > 0
        ? selectedStatuses
        : ["Pending", "Accept", "Completed"];

    const filterByStatusAndSearch = (statuses) =>
      requests.filter((req) => {
        const matchesStatus = statuses.includes(req.status);
        const formattedDate = req.createDate;
        const matchesSearch =
          req.name.toLowerCase().includes(searchLower) ||
          formattedDate.includes(debouncedSearchTerm);
        return matchesStatus && (debouncedSearchTerm ? matchesSearch : true);
      });

    return {
      all: filterByStatusAndSearch(statusesToFilter),
      reject: filterByStatusAndSearch(["Reject"]),
    };
  }, [debouncedSearchTerm, requests, selectedStatuses]);

  useEffect(() => {
    setFilteredAllRequests(filteredRequests.all);
    setFilteredRejectRequests(filteredRequests.reject);
    setCurrentPage(1);
    setCurrentRejectPage(1);
  }, [filteredRequests]);

  const paginate = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  const handleOpenModal = (request) => {
    setModalData({
      customerCharacterId: request.customerCharacterId,
      name: request.name,
      description: request.description,
      categoryId: request.categoryId,
      createDate: request.createDate,
      status: request.status,
      maxHeight: request.maxHeight,
      maxWeight: request.maxWeight,
      minHeight: request.minHeight,
      minWeight: request.minWeight,
      updateDate: request.updateDate,
      createBy: request.createBy,
      reason: request.reason,
      images: request.customerCharacterImageResponses || [],
    });
    setNewImages([]);
    setNewImagePreviews([]);
    setIsModalVisible(true);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setNewImages(files); // Store File objects
    setNewImagePreviews(imageUrls); // Store preview URLs
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  const handleRemoveImage = (imageId) => {
    setModalData((prev) => ({
      ...prev,
      images: prev.images.filter(
        (img) => img.customerCharacterImageId !== imageId
      ),
    }));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateRequest = async () => {
    setLoading(true);
    try {
      const updateData = {
        accountId: accountId,
        customerCharacterRequestId: modalData.customerCharacterId,
        name: modalData.name,
        description: modalData.description,
        categoryId: modalData.categoryId,
        minHeight: Number(modalData.minHeight),
        maxHeight: Number(modalData.maxHeight),
        minWeight: Number(modalData.minWeight),
        maxWeight: Number(modalData.maxWeight),
        images: newImages, // Send File objects
      };

      const response =
        await RequestCustomerCharacterService.UpdateCustomerCharacter(
          updateData
        );

      setRequests((prev) =>
        prev.map((req) =>
          req.customerCharacterId === modalData.customerCharacterId
            ? {
                ...req,
                ...modalData,
                customerCharacterImageResponses:
                  response.images || modalData.images,
              }
            : req
        )
      );

      toast.success("Customer character updated successfully!");
      setIsModalVisible(false);
      setNewImages([]);
      setNewImagePreviews([]);
    } catch (error) {
      console.error("Failed to update customer character:", error);
      toast.error(
        error.response?.data?.message || "Failed to update customer character."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setModalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getCategoryNameById = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    return category ? category.categoryName : "N/A";
  };

  const getAccountNameById = (accountId) => {
    const account = accounts[accountId];
    return account ? account.name : "N/A";
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Accept: "warning",
      Reject: "danger",
      Completed: "success",
    };
    return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
  };

  const isEditable = modalData.status === "Pending";

  const currentAllItems = paginate(
    filteredAllRequests,
    currentPage,
    itemsPerPage
  );
  const currentRejectItems = paginate(
    filteredRejectRequests,
    currentRejectPage,
    itemsPerPage
  );

  return (
    <div className="rental-management bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-rental-management">
          My Request Character
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row>
            <Col md={12}>
              <Form.Control
                type="text"
                placeholder="Search by name or date (DD/MM/YYYY)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input mb-3"
              />
            </Col>
          </Row>
        </div>

        {loading ? (
          <Spin
            tip="Loading..."
            style={{ display: "block", textAlign: "center" }}
          />
        ) : (
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="All Requests" key="1">
              <Col md={12}>
                <Form.Label>Filter by Status:</Form.Label>
                <div className="d-flex gap-3" style={{ marginLeft: "10px" }}>
                  {["Pending", "Accept", "Completed"].map((status) => (
                    <Form.Check
                      key={status}
                      type="checkbox"
                      label={status}
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusFilterChange(status)}
                    />
                  ))}
                </div>
              </Col>
              {currentAllItems.length === 0 ? (
                <p className="text-center">No requests found.</p>
              ) : (
                <>
                  <Row className="g-4">
                    {currentAllItems.map((req) => (
                      <Col key={req.customerCharacterId} xs={12}>
                        <Card className="rental-card shadow">
                          <Card.Body>
                            <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                              <div className="flex-grow-1">
                                <div className="d-flex gap-3">
                                  <div className="icon-circle">
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <h3 className="rental-title">
                                      {req.name} {getStatusBadge(req.status)}
                                    </h3>
                                    <div>
                                      <User size={16} /> Create by:{" "}
                                      {getAccountNameById(req.createBy)}
                                    </div>
                                    <div>
                                      <Calendar size={16} /> Create Date:{" "}
                                      {req.createDate}
                                    </div>
                                    <div>
                                      <FileText size={16} /> Description:{" "}
                                      {req.description}
                                    </div>
                                    {req.reason && (
                                      <div>
                                        <FileText size={16} />{" "}
                                        <strong style={{ color: "red" }}>
                                          Reason: {req.reason}
                                        </strong>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                                <Button
                                  type="primary"
                                  className="btn-view"
                                  onClick={() => handleOpenModal(req)}
                                >
                                  <Eye size={16} />{" "}
                                  {req.status === "Pending" ? "Edit" : "View"}
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={filteredAllRequests.length}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    style={{ marginTop: "20px", textAlign: "right" }}
                  />
                </>
              )}
            </TabPane>

            <TabPane tab="Reject Requests" key="3">
              {currentRejectItems.length === 0 ? (
                <p className="text-center">No reject requests found.</p>
              ) : (
                <>
                  <Row className="g-4">
                    {currentRejectItems.map((req) => (
                      <Col key={req.customerCharacterId} xs={12}>
                        <Card className="rental-card shadow">
                          <Card.Body>
                            <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                              <div className="flex-grow-1">
                                <div className="d-flex gap-3">
                                  <div className="icon-circle">
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <h3 className="rental-title">
                                      {req.name} &nbsp;{" "}
                                      {getStatusBadge(req.status)}
                                    </h3>
                                    <div>
                                      <User size={16} /> Create by:{" "}
                                      {getAccountNameById(req.createBy)}
                                    </div>
                                    <div>
                                      <Calendar size={16} /> Create Date:{" "}
                                      {req.createDate}
                                    </div>
                                    <div>
                                      <FileText size={16} /> Description:{" "}
                                      {req.description}
                                    </div>
                                    <div>
                                      <FileText size={16} />{" "}
                                      <strong style={{ color: "red" }}>
                                        Reason: {req.reason}
                                      </strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                                <Button
                                  type="primary"
                                  className="btn-view"
                                  onClick={() => handleOpenModal(req)}
                                >
                                  <Eye size={16} /> View
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Pagination
                    current={currentRejectPage}
                    pageSize={itemsPerPage}
                    total={filteredRejectRequests.length}
                    onChange={(page) => setCurrentRejectPage(page)}
                    showSizeChanger={false}
                    style={{ marginTop: "20px", textAlign: "right" }}
                  />
                </>
              )}
            </TabPane>
          </Tabs>
        )}

        <Modal
          title={
            isEditable
              ? "Edit Customer Character Request"
              : "View Customer Character Request"
          }
          open={isModalVisible}
          onOk={
            isEditable ? handleUpdateRequest : () => setIsModalVisible(false)
          }
          onCancel={() => setIsModalVisible(false)}
          okText={isEditable ? "Update" : "Close"}
          cancelText="Cancel"
          confirmLoading={loading}
          width={600}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>,
            isEditable && (
              <Button
                key="update"
                type="primary"
                onClick={handleUpdateRequest}
                loading={loading}
              >
                Update
              </Button>
            ),
          ].filter(Boolean)}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Input
                value={modalData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Input.TextArea
                value={modalData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              {isEditable ? (
                <Select
                  value={modalData.categoryId}
                  onChange={(value) => handleInputChange("categoryId", value)}
                  style={{ width: "100%" }}
                >
                  {categories.map((category) => (
                    <Option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Input
                  value={getCategoryNameById(modalData.categoryId)}
                  disabled
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Height (cm)</Form.Label>
              <Input
                type="number"
                value={modalData.maxHeight}
                onChange={(e) =>
                  handleInputChange("maxHeight", Number(e.target.value))
                }
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Weight (kg)</Form.Label>
              <Input
                type="number"
                value={modalData.maxWeight}
                onChange={(e) =>
                  handleInputChange("maxWeight", Number(e.target.value))
                }
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Min Height (cm)</Form.Label>
              <Input
                type="number"
                value={modalData.minHeight}
                onChange={(e) =>
                  handleInputChange("minHeight", Number(e.target.value))
                }
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Min Weight (kg)</Form.Label>
              <Input
                type="number"
                value={modalData.minWeight}
                onChange={(e) =>
                  handleInputChange("minWeight", Number(e.target.value))
                }
                disabled={!isEditable}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Create Date</Form.Label>
              <Input value={modalData.createDate} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Update Date</Form.Label>
              <Input
                value={modalData.updateDate ? modalData.updateDate : "N/A"}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Created By</Form.Label>
              <Input value={getAccountNameById(modalData.createBy)} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Input value={modalData.status} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Input value={modalData.reason || "N/A"} disabled />
            </Form.Group>
            <h5>Existing Images</h5>
            {modalData.images.length === 0 ? (
              <p>No images available.</p>
            ) : (
              modalData.images.map((img) => (
                <div
                  key={img.customerCharacterImageId}
                  className="mb-3 d-flex align-items-center"
                >
                  <Image
                    src={img.urlImage}
                    alt="Character Image"
                    width={100}
                    preview
                    style={{ display: "block", marginRight: "10px" }}
                  />
                  <div>
                    <p>Create Date: {img.createDate}</p>
                    {isEditable && (
                      <Button
                        danger
                        size="small"
                        onClick={() =>
                          handleRemoveImage(img.customerCharacterImageId)
                        }
                      >
                        <Delete size={16} /> Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
            {isEditable && (
              <Form.Group className="mb-3">
                <Form.Label>Upload New Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                {newImagePreviews.length > 0 && (
                  <div>
                    <p>Selected {newImagePreviews.length} new image(s)</p>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                    >
                      {newImagePreviews.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center"
                          style={{ position: "relative" }}
                        >
                          <Image
                            src={imageUrl}
                            alt={`Preview ${index + 1}`}
                            style={{
                              maxWidth: "200px",
                              maxHeight: "200px",
                              objectFit: "cover",
                              margin: "5px",
                            }}
                          />
                          <Button
                            danger
                            size="small"
                            onClick={() => handleRemoveNewImage(index)}
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                            }}
                          >
                            <Delete size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Form.Group>
            )}
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default MyCustomerCharacter;
