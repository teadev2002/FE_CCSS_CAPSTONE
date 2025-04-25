//// ========================= ở trên vẫn bị lỗi thg char đổi nó ko có data thời gian gắn vào thg cũ, th cũ bị xóa di
// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
// import {
//   Pagination,
//   Modal,
//   Button,
//   Tabs,
//   Radio,
//   message,
//   Collapse,
// } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyEventOrganize.scss";
// import ViewMyEventOrganize from "./ViewMyEventOrganize";
// import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
// import DetailEventOrganizationPageService from "../../services/DetailEventOrganizationPageService/DetailEventOrganizationPageService";
// import {
//   FileText,
//   Calendar,
//   Eye,
//   CreditCard,
//   DollarSign,
//   MapPin,
// } from "lucide-react";
// import dayjs from "dayjs";
// import { jwtDecode } from "jwt-decode";

// const { TabPane } = Tabs;
// const { Panel } = Collapse;

// const formatDate = (date) => {
//   if (!date || date === "null" || date === "undefined" || date === "")
//     return "N/A";
//   const parsedDate = dayjs(
//     date,
//     ["DD/MM/YYYY", "YYYY-MM-DD", "HH:mm DD/MM/YYYY"],
//     true
//   );
//   return parsedDate.isValid()
//     ? parsedDate.format("DD/MM/YYYY")
//     : "Invalid Date";
// };

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
//   const [isViewDetailsModalVisible, setIsViewDetailsModalVisible] =
//     useState(false);
//   const [selectedRequestId, setSelectedRequestId] = useState(null);
//   const [modalData, setModalData] = useState({
//     requestId: "",
//     name: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     location: "",
//     packageId: "",
//     listCharacters: [],
//     status: "",
//     price: 0,
//     deposit: null,
//     accountId: "",
//     serviceId: "",
//     reason: null,
//     totalDate: 0,
//     accountCouponId: null,
//   });
//   const [depositAmount, setDepositAmount] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [packages, setPackages] = useState([]);
//   const [characters, setCharacters] = useState([]);
//   const [packagePrice, setPackagePrice] = useState(0);
//   const [characterPrices, setCharacterPrices] = useState({});

//   const itemsPerPage = 5;

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

//         const formattedRequests = filteredRequests.map((request) => ({
//           requestId: request.requestId,
//           name: request.name || "N/A",
//           description: request.description || "N/A",
//           startDate: formatDate(request.startDate),
//           endDate: formatDate(request.endDate),
//           location: request.location || "N/A",
//           packageId: request.packageId || "N/A",
//           listCharacters: (request.charactersListResponse || []).map(
//             (char) => ({
//               requestCharacterId: char.requestCharacterId || "",
//               characterId: char.characterId,
//               characterName: char.characterName || "Unknown Character",
//               quantity: char.quantity || 1,
//               description: char.description || "N/A",
//               characterImages: char.characterImages || [],
//               requestDateResponses: char.requestDateResponses || [],
//               maxHeight: char.maxHeight,
//               maxWeight: char.maxWeight,
//               minHeight: char.minHeight,
//               minWeight: char.minWeight,
//               status: char.status,
//             })
//           ),
//           status: request.status || "Unknown",
//           price: request.price || 0,
//           deposit: request.deposit || null,
//           serviceId: request.serviceId,
//         }));

//         setRequests(formattedRequests);
//       } catch (error) {
//         toast.error("Failed to load requests. Please try again later.");
//         console.error("Error fetching requests:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchPackages = async () => {
//       try {
//         const data = await DetailEventOrganizationPageService.getAllPackages();
//         setPackages(data || []);
//       } catch (error) {
//         console.error("Error fetching packages:", error);
//       }
//     };

//     const fetchCharacters = async () => {
//       try {
//         const data = await MyEventOrganizeService.getAllCharacters();
//         const formattedCharacters = data.map((char) => ({
//           characterId: char.characterId,
//           characterName: char.characterName,
//           price: char.price,
//           description: char.description,
//           maxHeight: char.maxHeight,
//           maxWeight: char.maxWeight,
//           minHeight: char.minHeight,
//           minWeight: char.minWeight,
//           images: char.images || [],
//           isActive: char.isActive,
//           categoryId: char.categoryId,
//           createDate: char.createDate,
//           updateDate: char.updateDate,
//         }));
//         setCharacters(formattedCharacters || []);
//       } catch (error) {
//         console.error("Error fetching characters:", error);
//         toast.error("Failed to load characters.");
//       }
//     };

//     fetchRequests();
//     fetchPackages();
//     fetchCharacters();
//   }, [accountId]);

//   useEffect(() => {
//     if (requests.length > 0) {
//       const filterByStatusAndSearch = (status) =>
//         requests
//           .filter((request) => request.status === status)
//           .filter(
//             (request) =>
//               request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//               request.startDate.includes(searchTerm)
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

//   useEffect(() => {
//     const calculatePrice = async () => {
//       if (
//         !modalData.packageId ||
//         !modalData.startDate ||
//         !modalData.endDate ||
//         !modalData.listCharacters.length
//       ) {
//         setModalData((prev) => ({ ...prev, price: 0 }));
//         return;
//       }

//       try {
//         const packageData = await MyEventOrganizeService.getPackageById(
//           modalData.packageId
//         );
//         const pkgPrice = packageData.price || 0;
//         setPackagePrice(pkgPrice);

//         const charPricePromises = modalData.listCharacters.map(async (char) => {
//           if (char.characterId) {
//             const charData = await MyEventOrganizeService.getCharacterById(
//               char.characterId
//             );
//             return { [char.characterId]: charData.price || 0 };
//           }
//           return {};
//         });
//         const charPriceResults = await Promise.all(charPricePromises);
//         const newCharPrices = Object.assign({}, ...charPriceResults);
//         setCharacterPrices(newCharPrices);

//         const start = dayjs(modalData.startDate, "DD/MM/YYYY");
//         const end = dayjs(modalData.endDate, "DD/MM/YYYY");
//         const totalDays = end.diff(start, "day") + 1;

//         const totalCharPrice = modalData.listCharacters.reduce((sum, char) => {
//           const charPrice = newCharPrices[char.characterId] || 0;
//           return sum + charPrice * (char.quantity || 1);
//         }, 0);

//         const newPrice = pkgPrice + totalCharPrice * totalDays;
//         setModalData((prev) => ({ ...prev, price: newPrice }));
//       } catch (error) {
//         console.error("Error calculating price:", error);
//         toast.error("Failed to calculate price.");
//       }
//     };

//     if (isViewEditModalVisible && modalData.status === "Pending") {
//       calculatePrice();
//     }
//   }, [
//     modalData.packageId,
//     modalData.listCharacters,
//     modalData.startDate,
//     modalData.endDate,
//     isViewEditModalVisible,
//   ]);

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
//     if (!request?.requestId) {
//       toast.error("Invalid request data");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await MyEventOrganizeService.getRequestByRequestId(
//         request.requestId
//       );
//       setModalData({
//         requestId: response.requestId || "",
//         name: response.name || "",
//         description: response.description || "",
//         startDate: response.startDate ? formatDate(response.startDate) : "",
//         endDate: response.endDate ? formatDate(response.endDate) : "",
//         location: response.location || "",
//         packageId: response.packageId || "",
//         listCharacters: (response.charactersListResponse || []).map((char) => ({
//           requestCharacterId: char.requestCharacterId || "",
//           characterId: char.characterId || "",
//           characterName: char.characterName || "Unknown Character",
//           quantity: char.quantity || 1,
//           description: char.description || "",
//           cosplayerId: char.cosplayerId || null,
//           characterImages: char.characterImages || [],
//           requestDateResponses: (char.requestDateResponses || []).map(
//             (date) => ({
//               requestDateId: date.requestDateId || "",
//               startDate: date.startDate || "",
//               endDate: date.endDate || "",
//               totalHour: date.totalHour || 0,
//               reason: date.reason || "",
//               status: date.status || 0,
//             })
//           ),
//           maxHeight: char.maxHeight,
//           maxWeight: char.maxWeight,
//           minHeight: char.minHeight,
//           minWeight: char.minWeight,
//           status: char.status,
//         })),
//         status: response.status || "Unknown",
//         price: response.price || 0,
//         deposit: response.deposit || null,
//         accountId: response.accountId || "",
//         serviceId: response.serviceId || "",
//         reason: response.reason || null,
//         totalDate: response.totalDate || 0,
//         accountCouponId: response.accountCouponId || null,
//       });
//       setIsViewEditModalVisible(true);
//     } catch (error) {
//       toast.error("Failed to load request details.");
//       console.error("Error fetching request details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetailsRequest = (requestId) => {
//     if (!requestId) {
//       toast.error("Invalid request ID");
//       return;
//     }
//     setSelectedRequestId(requestId);
//     setIsViewDetailsModalVisible(true);
//   };

//   const handleAddCharacter = () => {
//     setModalData({
//       ...modalData,
//       listCharacters: [
//         ...modalData.listCharacters,
//         {
//           requestCharacterId: "",
//           characterId: "",
//           characterName: "",
//           quantity: 1,
//           description: "shared",
//           requestDateResponses: [],
//         },
//       ],
//     });
//   };

//   const handleRemoveCharacter = (charIndex) => {
//     const updatedCharacters = modalData.listCharacters.filter(
//       (_, index) => index !== charIndex
//     );
//     setModalData({ ...modalData, listCharacters: updatedCharacters });
//   };

//   const handleViewEditConfirm = async () => {
//     if (modalData.status !== "Pending") {
//       setIsViewEditModalVisible(false);
//       return;
//     }

//     if (!modalData.packageId) {
//       toast.error("Package is required!");
//       return;
//     }
//     if (modalData.listCharacters.some((char) => !char.characterId)) {
//       toast.error("All characters must have a selected character!");
//       return;
//     }
//     if (
//       modalData.listCharacters.some(
//         (char) => !char.quantity || char.quantity < 1
//       )
//     ) {
//       toast.error("All characters must have a valid quantity (minimum 1)!");
//       return;
//     }

//     try {
//       const requestData = {
//         name: modalData.name,
//         description: modalData.description,
//         price: modalData.price,
//         startDate: modalData.startDate,
//         endDate: modalData.endDate,
//         location: modalData.location,
//         serviceId: modalData.serviceId || "S003",
//         packageId: modalData.packageId,
//         listUpdateRequestCharacters: modalData.listCharacters.map((char) => ({
//           requestCharacterId: char.requestCharacterId || null,
//           characterId: char.characterId,
//           description: char.description || "shared",
//           quantity: char.quantity || 1,
//         })),
//       };

//       await MyEventOrganizeService.updateEventOrganizationRequest(
//         modalData.requestId,
//         requestData
//       );

//       setRequests((prev) =>
//         prev.map((req) =>
//           req.requestId === modalData.requestId
//             ? {
//                 ...req,
//                 packageId: modalData.packageId,
//                 price: modalData.price,
//                 listCharacters: modalData.listCharacters.map((char) => ({
//                   requestCharacterId: char.requestCharacterId,
//                   characterId: char.characterId,
//                   characterName: char.characterName,
//                   quantity: char.quantity,
//                   description: char.description,
//                   characterImages: char.characterImages,
//                   requestDateResponses: char.requestDateResponses,
//                   maxHeight: char.maxHeight,
//                   maxWeight: char.maxWeight,
//                   minHeight: char.minHeight,
//                   minWeight: char.minWeight,
//                   status: char.status,
//                 })),
//               }
//             : req
//         )
//       );
//       toast.success("Request updated successfully!");
//       setIsViewEditModalVisible(false);
//     } catch (error) {
//       toast.error("Failed to update request. Please try again.");
//       console.error("Error updating request:", error);
//     }
//   };

//   const handleDepositRequest = (request) => {
//     if (!request?.requestId || !request?.price) {
//       toast.error("Invalid request or price data");
//       return;
//     }
//     setSelectedRequestId(request.requestId);
//     setModalData({
//       requestId: request.requestId,
//       name: request.name,
//       description: request.description,
//       startDate: request.startDate,
//       endDate: request.endDate,
//       location: request.location,
//       packageId: request.packageId,
//       listCharacters: request.listCharacters,
//       status: request.status,
//       price: request.price,
//       deposit: request.deposit,
//       serviceId: request.serviceId,
//     });
//     setIsDepositModalVisible(true);
//   };

//   const handleDepositConfirm = async () => {
//     if (depositAmount === null) {
//       message.warning("Please select a deposit amount.");
//       return;
//     }
//     const depositValue =
//       depositAmount === 50 ? modalData.price * 0.5 : modalData.price;
//     try {
//       await MyEventOrganizeService.updateDeposit(selectedRequestId, {
//         deposit: depositAmount,
//         status: "Active",
//       });
//       setRequests((prev) =>
//         prev.map((req) =>
//           req.requestId === selectedRequestId
//             ? { ...req, status: "Active", deposit: depositAmount }
//             : req
//         )
//       );
//       toast.success(
//         `Deposit of ${depositValue.toLocaleString()} VND confirmed! Moving to Payment Deposit Contract tab.`
//       );
//     } catch (error) {
//       toast.error("Failed to update deposit. Please try again.");
//       console.error("Error updating deposit:", error);
//     }
//     setIsDepositModalVisible(false);
//     setDepositAmount(null);
//     setSelectedRequestId(null);
//   };

//   const handlePaymentRequest = (contract) => {
//     if (!contract?.requestId) {
//       toast.error("Invalid contract data");
//       return;
//     }
//     setSelectedRequestId(contract.requestId);
//     setModalData({
//       requestId: contract.requestId,
//       name: contract.name,
//       description: contract.description,
//       startDate: contract.startDate,
//       endDate: contract.endDate,
//       location: contract.location,
//       packageId: contract.packageId,
//       listCharacters: contract.listCharacters,
//       status: contract.status,
//       price: contract.price,
//       deposit: contract.deposit,
//       serviceId: contract.serviceId,
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
//           <span>My Event Organization</span>
//         </h1>

//         <div className="filter-section bg-white p-4 rounded shadow mb-5">
//           <Row className="align-items-center g-3">
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
//                                       {request.name}
//                                     </h3>
//                                     {getStatusBadge(request.status)}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date: {request.startDate}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     End Date: {request.endDate}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <DollarSign size={16} className="me-1" />
//                                     Total Price:{" "}
//                                     {(request.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <MapPin size={16} className="me-1" />
//                                     Location: {request.location}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                                 {request.status === "Pending" && (
//                                   <Button
//                                     type="primary"
//                                     size="small"
//                                     className="btn-view-edit"
//                                     onClick={() =>
//                                       handleViewEditRequest(request)
//                                     }
//                                     aria-label="Edit request"
//                                   >
//                                     <Eye size={16} className="me-1" />
//                                     Edit
//                                   </Button>
//                                 )}
//                                 <Button
//                                   type="default"
//                                   size="small"
//                                   className="btn-view-details"
//                                   onClick={() =>
//                                     handleViewDetailsRequest(request.requestId)
//                                   }
//                                   aria-label="View request details"
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   View Details
//                                 </Button>
//                                 {request.status === "Browsed" && (
//                                   <Button
//                                     size="small"
//                                     className="btn-deposit"
//                                     onClick={() =>
//                                       handleDepositRequest(request)
//                                     }
//                                     aria-label="Choose deposit"
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
//                                       {contract.name}
//                                     </h3>
//                                     {getStatusBadge("Active")}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date: {contract.startDate}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     End Date: {contract.endDate}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Total Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Deposit:{" "}
//                                     {contract.deposit
//                                       ? `${contract.deposit}%`
//                                       : "N/A"}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Status: Awaiting Payment
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view-edit"
//                                   onClick={() =>
//                                     handleViewEditRequest(contract)
//                                   }
//                                   aria-label="View contract"
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   View
//                                 </Button>
//                                 <Button
//                                   type="default"
//                                   size="small"
//                                   className="btn-view-details"
//                                   onClick={() =>
//                                     handleViewDetailsRequest(contract.requestId)
//                                   }
//                                   aria-label="View contract details"
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   View Details
//                                 </Button>
//                                 <Button
//                                   size="small"
//                                   className="btn-payment"
//                                   onClick={() => handlePaymentRequest(contract)}
//                                   aria-label="Make payment"
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
//                                       {contract.name}
//                                     </h3>
//                                     {getStatusBadge(contract.status)}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date: {contract.startDate}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     End Date: {contract.endDate}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Total Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     Deposit:{" "}
//                                     {contract.deposit
//                                       ? `${contract.deposit}%`
//                                       : "N/A"}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view-edit"
//                                   onClick={() =>
//                                     handleViewEditRequest(contract)
//                                   }
//                                   aria-label="View contract"
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   View
//                                 </Button>
//                                 <Button
//                                   type="default"
//                                   size="small"
//                                   className="btn-view-details"
//                                   onClick={() =>
//                                     handleViewDetailsRequest(contract.requestId)
//                                   }
//                                   aria-label="View contract details"
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   View Details
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
//               ? "Edit Event Request"
//               : "View Event Request"
//           }
//           open={isViewEditModalVisible}
//           onOk={handleViewEditConfirm}
//           onCancel={() => setIsViewEditModalVisible(false)}
//           okText={modalData.status === "Pending" ? "Save" : "Close"}
//           cancelText="Cancel"
//           cancelButtonProps={{
//             style: {
//               display: modalData.status === "Pending" ? "inline" : "none",
//             },
//           }}
//           width={800}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Name</strong>
//               </Form.Label>
//               <p>{modalData.name}</p>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Package</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <Form.Select
//                   value={modalData.packageId}
//                   onChange={(e) =>
//                     setModalData({ ...modalData, packageId: e.target.value })
//                   }
//                 >
//                   <option value="">Select Package</option>
//                   {packages.map((pkg) => (
//                     <option key={pkg.packageId} value={pkg.packageId}>
//                       {pkg.packageName} - {pkg.price.toLocaleString()} VND
//                     </option>
//                   ))}
//                 </Form.Select>
//               ) : (
//                 <p>
//                   {packages.find((pkg) => pkg.packageId === modalData.packageId)
//                     ?.packageName || modalData.packageId}
//                 </p>
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Characters</strong>
//               </Form.Label>
//               {modalData.status === "Pending" ? (
//                 <>
//                   {(modalData.listCharacters || []).map((char, charIndex) => (
//                     <Row key={charIndex} className="mb-2 align-items-center">
//                       <Col md={9}>
//                         <Form.Select
//                           value={char.characterId}
//                           onChange={(e) => {
//                             const selectedChar = characters.find(
//                               (c) => c.characterId === e.target.value
//                             );
//                             const updatedCharacters = [
//                               ...modalData.listCharacters,
//                             ];
//                             updatedCharacters[charIndex] = {
//                               ...updatedCharacters[charIndex],
//                               characterId: e.target.value,
//                               characterName: selectedChar?.characterName || "",
//                             };
//                             setModalData({
//                               ...modalData,
//                               listCharacters: updatedCharacters,
//                             });
//                           }}
//                         >
//                           <option value="">Select Character</option>
//                           {characters.map((c) => (
//                             <option key={c.characterId} value={c.characterId}>
//                               {c.characterName} - {c.price.toLocaleString()} VND
//                             </option>
//                           ))}
//                         </Form.Select>
//                       </Col>
//                       <Col md={3}>
//                         <Button
//                           type="danger"
//                           size="small"
//                           onClick={() => handleRemoveCharacter(charIndex)}
//                         >
//                           Remove
//                         </Button>
//                       </Col>
//                     </Row>
//                   ))}
//                   <Button
//                     type="dashed"
//                     onClick={handleAddCharacter}
//                     className="mt-2"
//                   >
//                     Add Character
//                   </Button>
//                 </>
//               ) : (
//                 <p>
//                   {modalData.listCharacters
//                     .map((char) => char.characterName)
//                     .join(", ")}
//                 </p>
//               )}
//             </Form.Group>
//             <Collapse>
//               <Panel header="Additional Details" key="1">
//                 <div
//                   style={{ display: "flex", justifyContent: "space-between" }}
//                 >
//                   <div>
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Description</strong>
//                       </Form.Label>
//                       <p>{modalData.description}</p>
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Start Date</strong>
//                       </Form.Label>
//                       <p>{modalData.startDate}</p>
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>End Date</strong>
//                       </Form.Label>
//                       <p>{modalData.endDate}</p>
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Location</strong>
//                       </Form.Label>
//                       <p>{modalData.location}</p>
//                     </Form.Group>
//                   </div>
//                   <div>
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Total Price</strong>
//                       </Form.Label>
//                       <p>{(modalData.price || 0).toLocaleString()} VND</p>
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Deposit</strong>
//                       </Form.Label>
//                       <p>
//                         {modalData.deposit ? `${modalData.deposit}%` : "N/A"}
//                       </p>
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Total Date</strong>
//                       </Form.Label>
//                       <p>{modalData.totalDate}</p>
//                     </Form.Group>
//                     {modalData.reason && (
//                       <Form.Group className="mb-3">
//                         <Form.Label>
//                           <strong>Reason</strong>
//                         </Form.Label>
//                         <p>{modalData.reason}</p>
//                       </Form.Group>
//                     )}
//                   </div>
//                 </div>

//                 <Collapse>
//                   <Panel header="Character Details" key="2">
//                     {(modalData.listCharacters || []).map((char, charIndex) => (
//                       <Collapse key={charIndex}>
//                         <Panel
//                           header={`Character: ${char.characterName} (Qty: ${char.quantity})`}
//                           key={charIndex}
//                         >
//                           <p>Description: {char.description}</p>
//                           <p>Max Height: {char.maxHeight}</p>
//                           <p>Max Weight: {char.maxWeight}</p>
//                           <p>Min Height: {char.minHeight}</p>
//                           <p>Min Weight: {char.minWeight}</p>
//                           {char.status !== "Pending" && (
//                             <p>Status: {char.status}</p>
//                           )}
//                           <Collapse>
//                             <Panel header="Character Images" key="images">
//                               {char.characterImages.length > 0 ? (
//                                 <ul>
//                                   {char.characterImages.map((img, idx) => (
//                                     <li key={idx}>
//                                       <img
//                                         src={img.urlImage}
//                                         style={{
//                                           maxWidth: "100px",
//                                           maxHeight: "100px",
//                                         }}
//                                       />
//                                     </li>
//                                   ))}
//                                 </ul>
//                               ) : (
//                                 <p>No images available.</p>
//                               )}
//                             </Panel>
//                             <Panel header="Request Dates" key="dates">
//                               {char.requestDateResponses.length > 0 ? (
//                                 <ul>
//                                   {char.requestDateResponses.map(
//                                     (date, idx) => (
//                                       <li key={idx}>
//                                         Date: {formatDate(date.startDate)} -{" "}
//                                         {formatDate(date.endDate)} (Total Hours:{" "}
//                                         {date.totalHour})
//                                         {date.reason && (
//                                           <>
//                                             <br />
//                                             Reason: {date.reason}
//                                           </>
//                                         )}
//                                         {date.status !== 0 && (
//                                           <>
//                                             <br />
//                                             Status: {date.status}
//                                           </>
//                                         )}
//                                       </li>
//                                     )
//                                   )}
//                                 </ul>
//                               ) : (
//                                 <p>No request dates available.</p>
//                               )}
//                             </Panel>
//                           </Collapse>
//                         </Panel>
//                       </Collapse>
//                     ))}
//                   </Panel>
//                 </Collapse>
//               </Panel>
//             </Collapse>
//           </Form>
//         </Modal>

//         <Modal
//           title="View Event Details"
//           open={isViewDetailsModalVisible}
//           onOk={() => setIsViewDetailsModalVisible(false)}
//           onCancel={() => setIsViewDetailsModalVisible(false)}
//           okText="Close"
//           cancelText="Cancel"
//           width={800}
//           style={{ top: 20 }}
//           bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
//         >
//           <ViewMyEventOrganize requestId={selectedRequestId} />
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

// fix button choose deposit ==============================================
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import {
  Pagination,
  Modal,
  Button,
  Tabs,
  Radio,
  message,
  Collapse,
} from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyEventOrganize.scss";
import ViewMyEventOrganize from "./ViewMyEventOrganize";
import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
import DetailEventOrganizationPageService from "../../services/DetailEventOrganizationPageService/DetailEventOrganizationPageService";
import {
  FileText,
  Calendar,
  Eye,
  CreditCard,
  DollarSign,
  MapPin,
} from "lucide-react";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

const { TabPane } = Tabs;
const { Panel } = Collapse;

const formatDate = (date) => {
  if (!date || date === "null" || date === "undefined" || date === "")
    return "N/A";
  const parsedDate = dayjs(
    date,
    ["DD/MM/YYYY", "YYYY-MM-DD", "HH:mm DD/MM/YYYY"],
    true
  );
  return parsedDate.isValid()
    ? parsedDate.format("DD/MM/YYYY")
    : "Invalid Date";
};

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
  const [isViewDetailsModalVisible, setIsViewDetailsModalVisible] =
    useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [modalData, setModalData] = useState({
    requestId: "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    packageId: "",
    listCharacters: [],
    status: "",
    price: 0,
    deposit: null,
    accountId: "",
    serviceId: "",
    reason: null,
    totalDate: 0,
    accountCouponId: null,
  });
  const [depositAmount, setDepositAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [packages, setPackages] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [packagePrice, setPackagePrice] = useState(0);
  const [characterPrices, setCharacterPrices] = useState({});

  const itemsPerPage = 5;

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

        const formattedRequests = filteredRequests.map((request) => ({
          requestId: request.requestId,
          name: request.name || "N/A",
          description: request.description || "N/A",
          startDate: formatDate(request.startDate),
          endDate: formatDate(request.endDate),
          location: request.location || "N/A",
          packageId: request.packageId || "N/A",
          charactersListResponse: (request.charactersListResponse || []).map(
            (char) => ({
              requestCharacterId: char.requestCharacterId || "",
              characterId: char.characterId,
              characterName: char.characterName || "Unknown Character",
              cosplayerId: char.cosplayerId || null,
              quantity: char.quantity || 1,
              description: char.description || "N/A",
              characterImages: char.characterImages || [],
              requestDateResponses: char.requestDateResponses || [],
              maxHeight: char.maxHeight,
              maxWeight: char.maxWeight,
              minHeight: char.minHeight,
              minWeight: char.minWeight,
              status: char.status,
            })
          ),
          status: request.status || "Unknown",
          price: request.price || 0,
          deposit: request.deposit || null,
          serviceId: request.serviceId,
        }));

        setRequests(formattedRequests);
      } catch (error) {
        toast.error("Failed to load requests. Please try again later.");
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPackages = async () => {
      try {
        const data = await DetailEventOrganizationPageService.getAllPackages();
        setPackages(data || []);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    const fetchCharacters = async () => {
      try {
        const data = await MyEventOrganizeService.getAllCharacters();
        const formattedCharacters = data.map((char) => ({
          characterId: char.characterId,
          characterName: char.characterName,
          price: char.price,
          description: char.description,
          maxHeight: char.maxHeight,
          maxWeight: char.maxWeight,
          minHeight: char.minHeight,
          minWeight: char.minWeight,
          images: char.images || [],
          isActive: char.isActive,
          categoryId: char.categoryId,
          createDate: char.createDate,
          updateDate: char.updateDate,
        }));
        setCharacters(formattedCharacters || []);
      } catch (error) {
        console.error("Error fetching characters:", error);
        toast.error("Failed to load characters.");
      }
    };

    fetchRequests();
    fetchPackages();
    fetchCharacters();
  }, [accountId]);

  useEffect(() => {
    if (requests.length > 0) {
      const filterByStatusAndSearch = (status) =>
        requests
          .filter((request) => request.status === status)
          .filter(
            (request) =>
              request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              request.startDate.includes(searchTerm)
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

  useEffect(() => {
    const calculatePrice = async () => {
      if (
        !modalData.packageId ||
        !modalData.startDate ||
        !modalData.endDate ||
        !modalData.listCharacters.length
      ) {
        setModalData((prev) => ({ ...prev, price: 0 }));
        return;
      }

      try {
        const packageData = await MyEventOrganizeService.getPackageById(
          modalData.packageId
        );
        const pkgPrice = packageData.price || 0;
        setPackagePrice(pkgPrice);

        const charPricePromises = modalData.listCharacters.map(async (char) => {
          if (char.characterId) {
            const charData = await MyEventOrganizeService.getCharacterById(
              char.characterId
            );
            return { [char.characterId]: charData.price || 0 };
          }
          return {};
        });
        const charPriceResults = await Promise.all(charPricePromises);
        const newCharPrices = Object.assign({}, ...charPriceResults);
        setCharacterPrices(newCharPrices);

        const start = dayjs(modalData.startDate, "DD/MM/YYYY");
        const end = dayjs(modalData.endDate, "DD/MM/YYYY");
        const totalDays = end.diff(start, "day") + 1;

        const totalCharPrice = modalData.listCharacters.reduce((sum, char) => {
          const charPrice = newCharPrices[char.characterId] || 0;
          return sum + charPrice * (char.quantity || 1);
        }, 0);

        const newPrice = pkgPrice + totalCharPrice * totalDays;
        setModalData((prev) => ({ ...prev, price: newPrice }));
      } catch (error) {
        console.error("Error calculating price:", error);
        toast.error("Failed to calculate price.");
      }
    };

    if (isViewEditModalVisible && modalData.status === "Pending") {
      calculatePrice();
    }
  }, [
    modalData.packageId,
    modalData.listCharacters,
    modalData.startDate,
    modalData.endDate,
    isViewEditModalVisible,
  ]);

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

  const handleViewEditRequest = async (request) => {
    if (!request?.requestId) {
      toast.error("Invalid request data");
      return;
    }

    setLoading(true);
    try {
      const response = await MyEventOrganizeService.getRequestByRequestId(
        request.requestId
      );
      setModalData({
        requestId: response.requestId || "",
        name: response.name || "",
        description: response.description || "",
        startDate: response.startDate ? formatDate(response.startDate) : "",
        endDate: response.endDate ? formatDate(response.endDate) : "",
        location: response.location || "",
        packageId: response.packageId || "",
        listCharacters: (response.charactersListResponse || []).map((char) => ({
          requestCharacterId: char.requestCharacterId || "",
          characterId: char.characterId || "",
          characterName: char.characterName || "Unknown Character",
          cosplayerId: char.cosplayerId || null,
          quantity: char.quantity || 1,
          description: char.description || "",
          characterImages: char.characterImages || [],
          requestDateResponses: (char.requestDateResponses || []).map(
            (date) => ({
              requestDateId: date.requestDateId || "",
              startDate: date.startDate || "",
              endDate: date.endDate || "",
              totalHour: date.totalHour || 0,
              reason: date.reason || "",
              status: date.status || 0,
            })
          ),
          maxHeight: char.maxHeight,
          maxWeight: char.maxWeight,
          minHeight: char.minHeight,
          minWeight: char.minWeight,
          status: char.status,
        })),
        status: response.status || "Unknown",
        price: response.price || 0,
        deposit: response.deposit || null,
        accountId: response.accountId || "",
        serviceId: response.serviceId || "",
        reason: response.reason || null,
        totalDate: response.totalDate || 0,
        accountCouponId: response.accountCouponId || null,
      });
      setIsViewEditModalVisible(true);
    } catch (error) {
      toast.error("Failed to load request details.");
      console.error("Error fetching request details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetailsRequest = (requestId) => {
    if (!requestId) {
      toast.error("Invalid request ID");
      return;
    }
    setSelectedRequestId(requestId);
    setIsViewDetailsModalVisible(true);
  };

  const handleAddCharacter = () => {
    setModalData({
      ...modalData,
      listCharacters: [
        ...modalData.listCharacters,
        {
          requestCharacterId: "",
          characterId: "",
          characterName: "",
          cosplayerId: null,
          quantity: 1,
          description: "shared",
          requestDateResponses: [],
        },
      ],
    });
  };

  const handleRemoveCharacter = (charIndex) => {
    const updatedCharacters = modalData.listCharacters.filter(
      (_, index) => index !== charIndex
    );
    setModalData({ ...modalData, listCharacters: updatedCharacters });
  };

  const handleViewEditConfirm = async () => {
    if (modalData.status !== "Pending") {
      setIsViewEditModalVisible(false);
      return;
    }

    if (!modalData.packageId) {
      toast.error("Package is required!");
      return;
    }
    if (modalData.listCharacters.some((char) => !char.characterId)) {
      toast.error("All characters must have a selected character!");
      return;
    }
    if (
      modalData.listCharacters.some(
        (char) => !char.quantity || char.quantity < 1
      )
    ) {
      toast.error("All characters must have a valid quantity (minimum 1)!");
      return;
    }

    try {
      const requestData = {
        name: modalData.name,
        description: modalData.description,
        price: modalData.price,
        startDate: modalData.startDate,
        endDate: modalData.endDate,
        location: modalData.location,
        serviceId: modalData.serviceId || "S003",
        packageId: modalData.packageId,
        listUpdateRequestCharacters: modalData.listCharacters.map((char) => ({
          requestCharacterId: char.requestCharacterId || null,
          characterId: char.characterId,
          description: char.description || "shared",
          quantity: char.quantity || 1,
        })),
      };

      await MyEventOrganizeService.updateEventOrganizationRequest(
        modalData.requestId,
        requestData
      );

      setRequests((prev) =>
        prev.map((req) =>
          req.requestId === modalData.requestId
            ? {
                ...req,
                packageId: modalData.packageId,
                price: modalData.price,
                charactersListResponse: modalData.listCharacters.map(
                  (char) => ({
                    requestCharacterId: char.requestCharacterId,
                    characterId: char.characterId,
                    characterName: char.characterName,
                    cosplayerId: char.cosplayerId,
                    quantity: char.quantity,
                    description: char.description,
                    characterImages: char.characterImages,
                    requestDateResponses: char.requestDateResponses,
                    maxHeight: char.maxHeight,
                    maxWeight: char.maxWeight,
                    minHeight: char.minHeight,
                    minWeight: char.minWeight,
                    status: char.status,
                  })
                ),
              }
            : req
        )
      );
      toast.success("Request updated successfully!");
      setIsViewEditModalVisible(false);
    } catch (error) {
      toast.error("Failed to update request. Please try again.");
      console.error("Error updating request:", error);
    }
  };

  const handleDepositRequest = (request) => {
    if (!request?.requestId || !request?.price) {
      toast.error("Invalid request or price data");
      return;
    }
    setSelectedRequestId(request.requestId);
    setModalData({
      requestId: request.requestId,
      name: request.name,
      description: request.description,
      startDate: request.startDate,
      endDate: request.endDate,
      location: request.location,
      packageId: request.packageId,
      listCharacters: request.charactersListResponse,
      status: request.status,
      price: request.price,
      deposit: request.deposit,
      serviceId: request.serviceId,
    });
    setIsDepositModalVisible(true);
  };

  const handleDepositConfirm = async () => {
    if (depositAmount === null) {
      message.warning("Please select a deposit amount.");
      return;
    }
    const depositValue =
      depositAmount === 50 ? modalData.price * 0.5 : modalData.price;
    try {
      await MyEventOrganizeService.updateDeposit(selectedRequestId, {
        deposit: depositAmount,
        status: "Active",
      });
      setRequests((prev) =>
        prev.map((req) =>
          req.requestId === selectedRequestId
            ? { ...req, status: "Active", deposit: depositAmount }
            : req
        )
      );
      toast.success(
        `Deposit of ${depositValue.toLocaleString()} VND confirmed! Moving to Payment Deposit Contract tab.`
      );
    } catch (error) {
      toast.error("Failed to update deposit. Please try again.");
      console.error("Error updating deposit:", error);
    }
    setIsDepositModalVisible(false);
    setDepositAmount(null);
    setSelectedRequestId(null);
  };

  const handlePaymentRequest = (contract) => {
    if (!contract?.requestId) {
      toast.error("Invalid contract data");
      return;
    }
    setSelectedRequestId(contract.requestId);
    setModalData({
      requestId: contract.requestId,
      name: contract.name,
      description: contract.description,
      startDate: contract.startDate,
      endDate: contract.endDate,
      location: contract.location,
      packageId: contract.packageId,
      listCharacters: contract.charactersListResponse,
      status: contract.status,
      price: contract.price,
      deposit: contract.deposit,
      serviceId: contract.serviceId,
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
          <span>My Event Organization</span>
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row className="align-items-center g-3">
            <Col md={12}>
              <Form.Control
                type="text"
                placeholder="Search by name or date (DD/MM/YYYY)..."
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
                                      {request.name}
                                    </h3>
                                    {getStatusBadge(request.status)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date: {request.startDate}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    End Date: {request.endDate}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <DollarSign size={16} className="me-1" />
                                    Total Price:{" "}
                                    {(request.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <MapPin size={16} className="me-1" />
                                    Location: {request.location}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                                {request.status === "Pending" && (
                                  <Button
                                    type="primary"
                                    size="small"
                                    className="btn-view-edit"
                                    onClick={() =>
                                      handleViewEditRequest(request)
                                    }
                                    aria-label="Edit request"
                                  >
                                    <Eye size={16} className="me-1" />
                                    Edit
                                  </Button>
                                )}
                                <Button
                                  type="default"
                                  size="small"
                                  className="btn-view-details"
                                  onClick={() =>
                                    handleViewDetailsRequest(request.requestId)
                                  }
                                  aria-label="View request details"
                                >
                                  <Eye size={16} className="me-1" />
                                  View Details
                                </Button>
                                {request.status === "Browsed" &&
                                  request.charactersListResponse?.length > 0 &&
                                  request.charactersListResponse.every(
                                    (char) => char.cosplayerId != null
                                  ) && (
                                    <Button
                                      size="small"
                                      className="btn-deposit"
                                      onClick={() =>
                                        handleDepositRequest(request)
                                      }
                                      aria-label="Choose deposit"
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
                                      {contract.name}
                                    </h3>
                                    {getStatusBadge("Active")}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date: {contract.startDate}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    End Date: {contract.endDate}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Total Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Deposit:{" "}
                                    {contract.deposit
                                      ? `${contract.deposit}%`
                                      : "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Status: Awaiting Payment
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view-edit"
                                  onClick={() =>
                                    handleViewEditRequest(contract)
                                  }
                                  aria-label="View contract"
                                >
                                  <Eye size={16} className="me-1" />
                                  View
                                </Button>
                                <Button
                                  type="default"
                                  size="small"
                                  className="btn-view-details"
                                  onClick={() =>
                                    handleViewDetailsRequest(contract.requestId)
                                  }
                                  aria-label="View contract details"
                                >
                                  <Eye size={16} className="me-1" />
                                  View Details
                                </Button>
                                <Button
                                  size="small"
                                  className="btn-payment"
                                  onClick={() => handlePaymentRequest(contract)}
                                  aria-label="Make payment"
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
                                      {contract.name}
                                    </h3>
                                    {getStatusBadge(contract.status)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date: {contract.startDate}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    End Date: {contract.endDate}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Total Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Deposit:{" "}
                                    {contract.deposit
                                      ? `${contract.deposit}%`
                                      : "N/A"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view-edit"
                                  onClick={() =>
                                    handleViewEditRequest(contract)
                                  }
                                  aria-label="View contract"
                                >
                                  <Eye size={16} className="me-1" />
                                  View
                                </Button>
                                <Button
                                  type="default"
                                  size="small"
                                  className="btn-view-details"
                                  onClick={() =>
                                    handleViewDetailsRequest(contract.requestId)
                                  }
                                  aria-label="View contract details"
                                >
                                  <Eye size={16} className="me-1" />
                                  View Details
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
              ? "Edit Event Request"
              : "View Event Request"
          }
          open={isViewEditModalVisible}
          onOk={handleViewEditConfirm}
          onCancel={() => setIsViewEditModalVisible(false)}
          okText={modalData.status === "Pending" ? "Save" : "Close"}
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              display: modalData.status === "Pending" ? "inline" : "none",
            },
          }}
          width={800}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Name</strong>
              </Form.Label>
              <p>{modalData.name}</p>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Package</strong>
              </Form.Label>
              {modalData.status === "Pending" ? (
                <Form.Select
                  value={modalData.packageId}
                  onChange={(e) =>
                    setModalData({ ...modalData, packageId: e.target.value })
                  }
                >
                  <option value="">Select Package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.packageId} value={pkg.packageId}>
                      {pkg.packageName} - {pkg.price.toLocaleString()} VND
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <p>
                  {packages.find((pkg) => pkg.packageId === modalData.packageId)
                    ?.packageName || modalData.packageId}
                </p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Characters</strong>
              </Form.Label>
              {modalData.status === "Pending" ? (
                <>
                  {(modalData.listCharacters || []).map((char, charIndex) => (
                    <Row key={charIndex} className="mb-2 align-items-center">
                      <Col md={9}>
                        <Form.Select
                          value={char.characterId}
                          onChange={(e) => {
                            const selectedChar = characters.find(
                              (c) => c.characterId === e.target.value
                            );
                            const updatedCharacters = [
                              ...modalData.listCharacters,
                            ];
                            updatedCharacters[charIndex] = {
                              ...updatedCharacters[charIndex],
                              characterId: e.target.value,
                              characterName: selectedChar?.characterName || "",
                            };
                            setModalData({
                              ...modalData,
                              listCharacters: updatedCharacters,
                            });
                          }}
                        >
                          <option value="">Select Character</option>
                          {characters.map((c) => (
                            <option key={c.characterId} value={c.characterId}>
                              {c.characterName} - {c.price.toLocaleString()} VND
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={3}>
                        <Button
                          type="danger"
                          size="small"
                          onClick={() => handleRemoveCharacter(charIndex)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="dashed"
                    onClick={handleAddCharacter}
                    className="mt-2"
                  >
                    Add Character
                  </Button>
                </>
              ) : (
                <p>
                  {modalData.listCharacters
                    .map((char) => char.characterName)
                    .join(", ")}
                </p>
              )}
            </Form.Group>
            <Collapse>
              <Panel header="Additional Details" key="1">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <strong>Description</strong>
                      </Form.Label>
                      <p>{modalData.description}</p>
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
                      <p>{modalData.location}</p>
                    </Form.Group>
                  </div>
                  <div>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <strong>Total Price</strong>
                      </Form.Label>
                      <p>{(modalData.price || 0).toLocaleString()} VND</p>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <strong>Deposit</strong>
                      </Form.Label>
                      <p>
                        {modalData.deposit ? `${modalData.deposit}%` : "N/A"}
                      </p>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <strong>Total Date</strong>
                      </Form.Label>
                      <p>{modalData.totalDate}</p>
                    </Form.Group>
                    {modalData.reason && (
                      <Form.Group className="mb-3">
                        <Form.Label>
                          <strong>Reason</strong>
                        </Form.Label>
                        <p>{modalData.reason}</p>
                      </Form.Group>
                    )}
                  </div>
                </div>

                <Collapse>
                  <Panel header="Character Details" key="2">
                    {(modalData.listCharacters || []).map((char, charIndex) => (
                      <Collapse key={charIndex}>
                        <Panel
                          header={`Character: ${char.characterName} (Qty: ${char.quantity})`}
                          key={charIndex}
                        >
                          <p>Description: {char.description}</p>
                          <p>Max Height: {char.maxHeight}</p>
                          <p>Max Weight: {char.maxWeight}</p>
                          <p>Min Height: {char.minHeight}</p>
                          <p>Min Weight: {char.minWeight}</p>
                          {char.status !== "Pending" && (
                            <p>Status: {char.status}</p>
                          )}
                          <Collapse>
                            <Panel header="Character Images" key="images">
                              {char.characterImages.length > 0 ? (
                                <ul>
                                  {char.characterImages.map((img, idx) => (
                                    <li key={idx}>
                                      <img
                                        src={img.urlImage}
                                        style={{
                                          maxWidth: "100px",
                                          maxHeight: "100px",
                                        }}
                                      />
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p>No images available.</p>
                              )}
                            </Panel>
                            <Panel header="Request Dates" key="dates">
                              {char.requestDateResponses.length > 0 ? (
                                <ul>
                                  {char.requestDateResponses.map(
                                    (date, idx) => (
                                      <li key={idx}>
                                        Date: {formatDate(date.startDate)} -{" "}
                                        {formatDate(date.endDate)} (Total Hours:{" "}
                                        {date.totalHour})
                                        {date.reason && (
                                          <>
                                            <br />
                                            Reason: {date.reason}
                                          </>
                                        )}
                                        {date.status !== 0 && (
                                          <>
                                            <br />
                                            Status: {date.status}
                                          </>
                                        )}
                                      </li>
                                    )
                                  )}
                                </ul>
                              ) : (
                                <p>No request dates available.</p>
                              )}
                            </Panel>
                          </Collapse>
                        </Panel>
                      </Collapse>
                    ))}
                  </Panel>
                </Collapse>
              </Panel>
            </Collapse>
          </Form>
        </Modal>

        <Modal
          title="View Event Details"
          open={isViewDetailsModalVisible}
          onOk={() => setIsViewDetailsModalVisible(false)}
          onCancel={() => setIsViewDetailsModalVisible(false)}
          okText="Close"
          cancelText="Cancel"
          width={800}
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <ViewMyEventOrganize requestId={selectedRequestId} />
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
