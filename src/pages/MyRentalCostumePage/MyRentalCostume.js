//============== sua ngay oke
// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
// import {
//   Pagination,
//   Modal,
//   Input,
//   Button,
//   Tabs,
//   Spin,
//   Image,
//   DatePicker,
// } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyRentalCostume.scss";
// import { jwtDecode } from "jwt-decode";
// import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";
// import PaymentService from "../../services/PaymentService/PaymentService.js";
// import { FileText, DollarSign, Calendar, CreditCard, Eye } from "lucide-react";
// import dayjs from "dayjs";
// import { useDebounce } from "use-debounce";
// import MyCustomerCharacter from "../MyCustomerCharacterPage/MyCustomerCharacter.js";
// import ViewMyRentalCostume from "./ViewMyRentalCostume"; // Import component mới

// const { TabPane } = Tabs;
// const { TextArea } = Input;

// const MyRentalCostume = () => {
//   const [requests, setRequests] = useState([]);
//   const [contracts, setContracts] = useState([]);
//   const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
//   const [filteredDepositContracts, setFilteredDepositContracts] = useState([]);
//   const [filteredRefundContracts, setFilteredRefundContracts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPendingPage, setCurrentPendingPage] = useState(1);
//   const [currentDepositPage, setCurrentDepositPage] = useState(1);
//   const [currentRefundPage, setCurrentRefundPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
//   const [isViewModalVisible, setIsViewModalVisible] = useState(false);
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
//   const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);
//   const [isConfirmDepositModalVisible, setIsConfirmDepositModalVisible] =
//     useState(false);
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false); // State cho modal ViewMyRentalCostume
//   const [selectedRequestId, setSelectedRequestId] = useState(null);
//   const [selectedContractId, setSelectedContractId] = useState(null);
//   const [modalData, setModalData] = useState({
//     name: "",
//     description: "",
//     startDate: null,
//     endDate: null,
//     characters: [],
//     fullRequestData: null,
//   });
//   const [refundData, setRefundData] = useState({
//     bankAccount: "",
//     bankName: "",
//   });
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [currentCharacterPage, setCurrentCharacterPage] = useState(1);

//   const itemsPerPage = 5;
//   const charactersPerPage = 2;
//   const accessToken = localStorage.getItem("accessToken");
//   const decoded = jwtDecode(accessToken);
//   const accountId = decoded?.Id;

//   // Hàm định dạng ngày
//   const formatDate = (date) => {
//     if (!date || date === "null" || date === "undefined" || date === "") {
//       console.log(`formatDate: Empty or invalid input - ${date}`);
//       return "N/A";
//     }

//     if (dayjs.isDayjs(date)) {
//       return date.format("DD/MM/YYYY");
//     }

//     const formats = [
//       "DD/MM/YYYY",
//       "HH:mm DD/MM/YYYY",
//       "YYYY-MM-DD",
//       "YYYY/MM/DD",
//       "MM/DD/YYYY",
//       "HH:mm DD-MM-YYYY",
//       "D/M/YYYY",
//       "DD/M/YYYY",
//       "D/MM/YYYY",
//     ];

//     const parsedDate = dayjs(date, formats, true);
//     console.log(
//       `formatDate: Input=${date}, Parsed=${
//         parsedDate.isValid() ? parsedDate.format() : "invalid"
//       }`
//     );

//     return parsedDate.isValid()
//       ? parsedDate.format("DD/MM/YYYY")
//       : "Invalid Date";
//   };

//   // API getRequestByRequestId
//   const getRequestByRequestId = async (id) => {
//     try {
//       const response = await MyRentalCostumeService.getRequestByRequestId(id); // Giả sử service đã được cập nhật
//       return response;
//     } catch (error) {
//       console.error("Error fetching request details:", error);
//       throw error;
//     }
//   };

//   // Lấy danh sách requests và tính deposit
//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true);
//       try {
//         const data = await MyRentalCostumeService.GetAllRequestByAccountId(
//           accountId
//         );
//         console.log("Requests API Response:", data);
//         const requestsArray = Array.isArray(data) ? data : [];

//         const enrichedRequests = await Promise.all(
//           requestsArray
//             .filter((request) => request?.serviceId === "S001")
//             .map(async (request) => {
//               const characters = request.charactersListResponse || [];
//               let totalDeposit = 0;

//               const characterDetails = await Promise.all(
//                 characters.map(async (char) => {
//                   const characterData =
//                     await MyRentalCostumeService.getCharacterById(
//                       char.characterId
//                     );
//                   const deposit =
//                     (characterData.price || 0) * (char.quantity || 0) * 5;
//                   return { ...char, price: characterData.price || 0, deposit };
//                 })
//               );

//               totalDeposit = characterDetails.reduce(
//                 (sum, char) => sum + char.deposit,
//                 0
//               );

//               return {
//                 ...request,
//                 startDate: formatDate(request.startDate),
//                 endDate: formatDate(request.endDate),
//                 deposit: totalDeposit,
//                 charactersListResponse: characterDetails,
//               };
//             })
//         );

//         setRequests(enrichedRequests);
//       } catch (error) {
//         console.error("Failed to fetch requests:", error);
//         toast.error(
//           error.response?.data?.message || "Failed to load requests."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, [accountId]);

//   // Lấy danh sách contracts
//   useEffect(() => {
//     const fetchContracts = async () => {
//       setLoading(true);
//       try {
//         const data = await MyRentalCostumeService.getAllContractByAccountId(
//           accountId
//         );
//         console.log("Contracts API Response:", data);
//         const contractsArray = Array.isArray(data) ? data : [];
//         const formattedContracts = contractsArray.map((contract) => ({
//           ...contract,
//           startDate: formatDate(contract.startDate),
//           endDate: formatDate(contract.endDate),
//         }));
//         setContracts(formattedContracts);
//       } catch (error) {
//         console.error("Failed to fetch contracts:", error);
//         toast.error(
//           error.response?.data?.message || "Failed to load contracts."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchContracts();
//   }, [accountId]);

//   // Lọc requests chưa có contract (Pending hoặc Browsed)
//   useEffect(() => {
//     const contractRequestIds = contracts.map((contract) => contract.requestId);
//     const filtered = requests
//       .filter((request) => !contractRequestIds.includes(request.requestId))
//       .filter(
//         (request) =>
//           (request?.name?.toLowerCase?.() || "").includes(
//             debouncedSearchTerm.toLowerCase()
//           ) || (request?.startDate || "").includes(debouncedSearchTerm)
//       );
//     setFilteredPendingRequests(filtered);
//     setCurrentPendingPage(1);
//   }, [debouncedSearchTerm, requests, contracts]);

//   // Lọc contracts chưa thanh toán cọc (Active)
//   useEffect(() => {
//     const filtered = contracts
//       .filter((contract) => contract.status === "Active")
//       .filter(
//         (contract) =>
//           (contract?.contractName?.toLowerCase?.() || "").includes(
//             debouncedSearchTerm.toLowerCase()
//           ) || (contract?.startDate || "").includes(debouncedSearchTerm)
//       );
//     setFilteredDepositContracts(filtered);
//     setCurrentDepositPage(1);
//   }, [debouncedSearchTerm, contracts]);

//   // Lọc contracts có trạng thái Progressing và liên quan đến serviceId S001
//   useEffect(() => {
//     const filtered = contracts
//       .filter((contract) => contract.status === "Progressing")
//       .filter((contract) => {
//         const relatedRequest = requests.find(
//           (req) => req.requestId === contract.requestId
//         );
//         return relatedRequest && relatedRequest.serviceId === "S001";
//       })
//       .filter(
//         (contract) =>
//           (contract?.contractName?.toLowerCase?.() || "").includes(
//             debouncedSearchTerm.toLowerCase()
//           ) || (contract?.startDate || "").includes(debouncedSearchTerm)
//       );
//     setFilteredRefundContracts(filtered);
//     setCurrentRefundPage(1);
//   }, [debouncedSearchTerm, contracts, requests]);

//   const paginate = (data, page, perPage) => {
//     const start = (page - 1) * perPage;
//     return data.slice(start, start + perPage);
//   };

//   const handleViewRequest = async (requestId) => {
//     setLoading(true);
//     setSelectedRequestId(requestId);
//     try {
//       const requestDetails = await getRequestByRequestId(requestId);
//       console.log("Request Details:", requestDetails);
//       const characters = requestDetails.charactersListResponse || [];

//       const characterDetailsPromises = characters.map(async (char) => {
//         const characterData = await MyRentalCostumeService.getCharacterById(
//           char.characterId
//         );
//         return {
//           characterId: char.characterId,
//           characterName: characterData.characterName,
//           maxHeight: characterData.maxHeight || 0,
//           maxWeight: characterData.maxWeight || 0,
//           minHeight: characterData.minHeight || 0,
//           minWeight: characterData.minWeight || 0,
//           quantity: char.quantity || 0,
//           urlImage: characterData.images?.[0]?.urlImage || "",
//           description: characterData.description || "",
//           price: characterData.price || 0,
//         };
//       });

//       const detailedCharacters = await Promise.all(characterDetailsPromises);

//       const dateFormats = [
//         "DD/MM/YYYY",
//         "HH:mm DD/MM/YYYY",
//         "YYYY-MM-DD",
//         "YYYY/MM/DD",
//         "MM/DD/YYYY",
//         "HH:mm DD-MM-YYYY",
//         "D/M/YYYY",
//         "DD/M/YYYY",
//         "D/MM/YYYY",
//       ];
//       const parsedStartDate = requestDetails.startDate
//         ? dayjs(requestDetails.startDate, dateFormats, true)
//         : null;
//       const parsedEndDate = requestDetails.endDate
//         ? dayjs(requestDetails.endDate, dateFormats, true)
//         : null;

//       console.log(
//         `Parsed Dates: startDate=${
//           parsedStartDate?.format("DD/MM/YYYY") || "null"
//         }, endDate=${parsedEndDate?.format("DD/MM/YYYY") || "null"}`
//       );

//       setModalData({
//         name: requestDetails.name || "",
//         description: requestDetails.description || "",
//         startDate: parsedStartDate?.isValid() ? parsedStartDate : null,
//         endDate: parsedEndDate?.isValid() ? parsedEndDate : null,
//         characters: detailedCharacters,
//         fullRequestData: {
//           ...requestDetails,
//           startDate: formatDate(requestDetails.startDate),
//           endDate: formatDate(requestDetails.endDate),
//         },
//       });

//       if (requestDetails.status === "Pending") {
//         setIsEditModalVisible(true);
//       } else {
//         setIsViewModalVisible(true);
//       }
//       setCurrentCharacterPage(1);
//     } catch (error) {
//       console.error("Failed to fetch request details:", error);
//       toast.error("Failed to load request details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewDetail = (requestId) => {
//     setSelectedRequestId(requestId);
//     setIsDetailModalVisible(true);
//   };

//   const handleSubmitEdit = async () => {
//     const { characters, startDate, endDate, description } = modalData;
//     if (characters.some((char) => char.quantity <= 0)) {
//       toast.error("All quantities must be positive numbers!");
//       return;
//     }
//     if (!modalData.fullRequestData) {
//       toast.error("Request data is missing!");
//       return;
//     }
//     if (!startDate || !endDate) {
//       toast.error("Start Date and End Date are required!");
//       return;
//     }
//     if (endDate.isBefore(startDate)) {
//       toast.error("End Date must be after Start Date!");
//       return;
//     }

//     try {
//       const formattedStartDate = formatDate(startDate);
//       const formattedEndDate = formatDate(endDate);

//       if (
//         formattedStartDate === "Invalid Date" ||
//         formattedEndDate === "Invalid Date"
//       ) {
//         toast.error("Invalid date format!");
//         return;
//       }

//       const updatedData = {
//         name: modalData.fullRequestData.name || "Unnamed Request",
//         description: description || "",
//         price: modalData.fullRequestData.price || 100000,
//         startDate: formattedStartDate,
//         endDate: formattedEndDate,
//         location: modalData.fullRequestData.location || "q tan binh",
//         serviceId: modalData.fullRequestData.serviceId || "S001",
//         packageId: "",
//         listUpdateRequestCharacters: characters.map((char) => ({
//           characterId: char.characterId,
//           cosplayerId: null,
//           description: char.description || "",
//           quantity: char.quantity,
//           listUpdateRequestDates: [
//             {
//               requestDateId: "",
//               startDate: formattedStartDate,
//               endDate: formattedEndDate,
//             },
//           ],
//         })),
//       };

//       console.log("UpdateRequest Payload:", updatedData);

//       const response = await MyRentalCostumeService.UpdateRequest(
//         selectedRequestId,
//         updatedData
//       );
//       setRequests((prev) =>
//         prev.map((req) =>
//           req.requestId === selectedRequestId
//             ? {
//                 ...req,
//                 charactersListResponse:
//                   response.charactersListResponse || req.charactersListResponse,
//                 startDate: formattedStartDate,
//                 endDate: formattedEndDate,
//                 deposit: req.deposit,
//               }
//             : req
//         )
//       );
//       toast.success("Costumes updated successfully!");
//       setIsEditModalVisible(false);
//     } catch (error) {
//       console.error("Error updating request:", error);
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to update costumes. Please try again."
//       );
//     }
//   };

//   const handleCharacterChange = (characterId, field, value) => {
//     setModalData((prev) => ({
//       ...prev,
//       characters: prev.characters.map((char) =>
//         char.characterId === characterId
//           ? { ...char, [field]: field === "quantity" ? Number(value) : value }
//           : char
//       ),
//     }));
//   };

//   const handleDateChange = (field, date) => {
//     setModalData((prev) => ({
//       ...prev,
//       [field]: date,
//     }));
//   };

//   const handleConfirmDeposit = async (request) => {
//     setSelectedRequestId(request.requestId);
//     try {
//       const requestDetails = await getRequestByRequestId(request.requestId);
//       const characters = requestDetails.charactersListResponse || [];

//       const characterDetailsPromises = characters.map(async (char) => {
//         const characterData = await MyRentalCostumeService.getCharacterById(
//           char.characterId
//         );
//         return {
//           price: characterData.price || 0,
//           quantity: char.quantity || 0,
//         };
//       });

//       const detailedCharacters = await Promise.all(characterDetailsPromises);
//       const totalDeposit = detailedCharacters.reduce(
//         (sum, char) => sum + char.price * 5 * char.quantity,
//         0
//       );

//       setPaymentAmount(totalDeposit);
//       setIsConfirmDepositModalVisible(true);
//     } catch (error) {
//       console.error("Error calculating deposit:", error);
//       toast.error("Failed to calculate deposit amount.");
//     }
//   };

//   const handleConfirmDepositOk = async () => {
//     if (!selectedRequestId) {
//       toast.error("Request ID is missing!");
//       return;
//     }
//     setLoading(true);
//     try {
//       await MyRentalCostumeService.addContractCostume(selectedRequestId, 100);

//       const requestData = await MyRentalCostumeService.GetAllRequestByAccountId(
//         accountId
//       );
//       const enrichedRequests = await Promise.all(
//         (Array.isArray(requestData) ? requestData : [])
//           .filter((req) => req?.serviceId === "S001")
//           .map(async (request) => {
//             const characters = request.charactersListResponse || [];
//             let totalDeposit = 0;

//             const characterDetails = await Promise.all(
//               characters.map(async (char) => {
//                 const characterData =
//                   await MyRentalCostumeService.getCharacterById(
//                     char.characterId
//                   );
//                 const deposit =
//                   (characterData.price || 0) * (char.quantity || 0) * 5;
//                 return { ...char, price: characterData.price || 0, deposit };
//               })
//             );

//             totalDeposit = characterDetails.reduce(
//               (sum, char) => sum + char.deposit,
//               0
//             );

//             return {
//               ...request,
//               startDate: formatDate(request.startDate),
//               endDate: formatDate(request.endDate),
//               deposit: totalDeposit,
//               charactersListResponse: characterDetails,
//             };
//           })
//       );
//       setRequests(enrichedRequests);

//       const contractDataUpdated =
//         await MyRentalCostumeService.getAllContractByAccountId(accountId);
//       setContracts(
//         Array.isArray(contractDataUpdated)
//           ? contractDataUpdated.map((contract) => ({
//               ...contract,
//               startDate: formatDate(contract.startDate),
//               endDate: formatDate(contract.endDate),
//             }))
//           : []
//       );

//       toast.success(
//         "Deposit confirmed! Please proceed to payment in the Deposit Payment tab."
//       );
//       setIsConfirmDepositModalVisible(false);
//     } catch (error) {
//       console.error("Error confirming deposit:", error);
//       toast.error(error.message || "Failed to confirm deposit.");
//     } finally {
//       setLoading(false);
//       setSelectedRequestId(null);
//     }
//   };

//   const handlePayment = async (contract) => {
//     setSelectedContractId(contract.contractId);
//     try {
//       const requestDetails = await getRequestByRequestId(contract.requestId);
//       const characters = requestDetails.charactersListResponse || [];

//       const characterDetailsPromises = characters.map(async (char) => {
//         const characterData = await MyRentalCostumeService.getCharacterById(
//           char.characterId
//         );
//         return {
//           price: characterData.price || 0,
//           quantity: char.quantity || 0,
//         };
//       });

//       const detailedCharacters = await Promise.all(characterDetailsPromises);
//       const totalDeposit = detailedCharacters.reduce(
//         (sum, char) => sum + char.price * 5 * char.quantity,
//         0
//       );

//       setPaymentAmount(totalDeposit);
//       setIsPaymentModalVisible(true);
//     } catch (error) {
//       console.error("Error calculating deposit:", error);
//       toast.error("Failed to calculate deposit amount.");
//     }
//   };

//   const handlePaymentConfirm = async () => {
//     if (!selectedContractId) {
//       toast.error("Contract ID is missing!");
//       return;
//     }
//     setLoading(true);
//     try {
//       const paymentData = {
//         fullName: decoded?.AccountName || "User",
//         orderInfo: `Deposit for ${modalData.name || "Costume Rental"}`,
//         amount: paymentAmount,
//         purpose: 1,
//         accountId: accountId,
//         contractId: selectedContractId,
//       };

//       const paymentUrl = await PaymentService.DepositPayment(paymentData);

//       const contractDataUpdated =
//         await MyRentalCostumeService.getAllContractByAccountId(accountId);
//       setContracts(
//         Array.isArray(contractDataUpdated)
//           ? contractDataUpdated.map((contract) => ({
//               ...contract,
//               startDate: formatDate(contract.startDate),
//               endDate: formatDate(contract.endDate),
//             }))
//           : []
//       );

//       toast.success("Payment successful! Redirecting to payment gateway...");
//       window.location.href = paymentUrl;
//     } catch (error) {
//       console.error("Error in payment process:", error);
//       toast.error(error.message || "Failed to process payment.");
//     } finally {
//       setLoading(false);
//       setIsPaymentModalVisible(false);
//       setSelectedContractId(null);
//     }
//   };

//   const handleRefundRequest = (contract) => {
//     setSelectedContractId(contract.contractId);
//     setIsRefundModalVisible(true);
//   };

//   const handleRefundConfirm = () => {
//     const { bankAccount, bankName } = refundData;
//     if (!bankAccount.trim() || !bankName.trim()) {
//       toast.error("Bank account and name cannot be empty!");
//       return;
//     }
//     toast.success("Refund request submitted!");
//     setIsRefundModalVisible(false);
//     setRefundData({ bankAccount: "", bankName: "" });
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       Pending: "primary",
//       Browsed: "success",
//       Cancel: "secondary",
//       Active: "warning",
//       Progressing: "info",
//       Completed: "success",
//     };
//     return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
//   };

//   const currentPendingItems = paginate(
//     filteredPendingRequests,
//     currentPendingPage,
//     itemsPerPage
//   );
//   const currentDepositItems = paginate(
//     filteredDepositContracts,
//     currentDepositPage,
//     itemsPerPage
//   );
//   const currentRefundItems = paginate(
//     filteredRefundContracts,
//     currentRefundPage,
//     itemsPerPage
//   );

//   return (
//     <div className="rental-management bg-light min-vh-100">
//       <Container className="py-5">
//         <h1 className="text-center mb-5 fw-bold title-rental-management">
//           <span>Rental Management</span>
//         </h1>

//         <div className="filter-section bg-white p-4 rounded shadow mb-5">
//           <Row>
//             <Col md={12}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name or date..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input"
//               />
//             </Col>
//           </Row>
//         </div>

//         <Tabs defaultActiveKey="1" type="card">
//           <TabPane tab="My Requests" key="1">
//             {loading ? (
//               <Spin tip="Loading..." />
//             ) : currentPendingItems.length === 0 ? (
//               <p className="text-center">No pending requests found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentPendingItems.map((req) => (
//                     <Col key={req.requestId} xs={12}>
//                       <Card className="rental-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div>
//                                   <h3 className="rental-title">{req.name}</h3>
//                                   <div className="text-muted small">
//                                     <DollarSign size={16} /> Unit Price / day:{" "}
//                                     {(req.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small">
//                                     <DollarSign size={16} /> Deposit:{" "}
//                                     {(req.deposit || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small">
//                                     <Calendar size={16} /> Start Date:{" "}
//                                     {req.startDate}
//                                   </div>
//                                   <div className="text-muted small">
//                                     <Calendar size={16} /> Return Date:{" "}
//                                     {req.endDate}
//                                   </div>
//                                   {getStatusBadge(req.status)}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="d-flex gap-2 align-items-center">
//                               <Button
//                                 type="primary"
//                                 size="small"
//                                 className="btn-view"
//                                 onClick={() => handleViewRequest(req.requestId)}
//                               >
//                                 <Eye size={16} />{" "}
//                                 {req.status === "Pending" ? "Edit" : "View"}
//                               </Button>
//                               <Button
//                                 size="small"
//                                 className="btn-detail"
//                                 onClick={() => handleViewDetail(req.requestId)}
//                               >
//                                 <Eye size={16} /> View Detail
//                               </Button>
//                               {req.status === "Browsed" && (
//                                 <Button
//                                   size="small"
//                                   className="btn-deposit"
//                                   onClick={() => handleConfirmDeposit(req)}
//                                 >
//                                   <CreditCard size={16} /> Confirm Deposit
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Pagination
//                   current={currentPendingPage}
//                   pageSize={itemsPerPage}
//                   total={filteredPendingRequests.length}
//                   onChange={(page) => setCurrentPendingPage(page)}
//                   showSizeChanger={false}
//                   style={{ marginTop: "20px", textAlign: "right" }}
//                 />
//               </>
//             )}
//           </TabPane>

//           <TabPane tab="Deposit Payment" key="2">
//             {loading ? (
//               <Spin tip="Loading..." />
//             ) : currentDepositItems.length === 0 ? (
//               <p className="text-center">
//                 No contracts awaiting payment found.
//               </p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentDepositItems.map((contract) => (
//                     <Col key={contract.contractId} xs={12}>
//                       <Card className="rental-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div>
//                                   <h3 className="rental-title">
//                                     {contract.contractName}
//                                   </h3>
//                                   <div className="text-muted small">
//                                     <DollarSign size={16} /> Total Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small">
//                                     <Calendar size={16} /> Start Date:{" "}
//                                     {contract.startDate}
//                                   </div>
//                                   <div className="text-muted small">
//                                     <Calendar size={16} /> Return Date:{" "}
//                                     {contract.endDate}
//                                   </div>
//                                   {getStatusBadge(contract.status)}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="d-flex gap-2 align-items-center">
//                               <Button
//                                 type="primary"
//                                 size="small"
//                                 className="btn-view"
//                                 onClick={() =>
//                                   handleViewRequest(contract.requestId)
//                                 }
//                               >
//                                 <Eye size={16} /> View
//                               </Button>
//                               <Button
//                                 size="small"
//                                 className="btn-deposit"
//                                 onClick={() => handlePayment(contract)}
//                               >
//                                 <CreditCard size={16} /> Pay Now
//                               </Button>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Pagination
//                   current={currentDepositPage}
//                   pageSize={itemsPerPage}
//                   total={filteredDepositContracts.length}
//                   onChange={(page) => setCurrentDepositPage(page)}
//                   showSizeChanger={false}
//                   style={{ marginTop: "20px", textAlign: "right" }}
//                 />
//               </>
//             )}
//           </TabPane>

//           <TabPane tab="Refund Requests" key="3">
//             {loading ? (
//               <Spin tip="Loading..." />
//             ) : currentRefundItems.length === 0 ? (
//               <p className="text-center">No progressing contracts found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentRefundItems.map((contract) => (
//                     <Col key={contract.contractId} xs={12}>
//                       <Card className="rental-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div>
//                                   <h3 className="rental-title">
//                                     {contract.contractName}
//                                   </h3>
//                                   <div className="text-muted small">
//                                     <DollarSign size={16} /> Total Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small">
//                                     <Calendar size={16} /> Start Date:{" "}
//                                     {contract.startDate}
//                                   </div>
//                                   <div className="text-muted small">
//                                     <Calendar size={16} /> Return Date:{" "}
//                                     {contract.endDate}
//                                   </div>
//                                   {getStatusBadge(contract.status)}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="d-flex gap-2 align-items-center">
//                               <Button
//                                 type="primary"
//                                 size="small"
//                                 className="btn-view"
//                                 onClick={() =>
//                                   handleViewRequest(contract.requestId)
//                                 }
//                               >
//                                 <Eye size={16} /> View
//                               </Button>
//                               <Button
//                                 size="small"
//                                 className="btn-refund"
//                                 onClick={() => handleRefundRequest(contract)}
//                               >
//                                 <CreditCard size={16} /> Request Refund
//                               </Button>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <Pagination
//                   current={currentRefundPage}
//                   pageSize={itemsPerPage}
//                   total={filteredRefundContracts.length}
//                   onChange={(page) => setCurrentRefundPage(page)}
//                   showSizeChanger={false}
//                   style={{ marginTop: "20px", textAlign: "right" }}
//                 />
//               </>
//             )}
//           </TabPane>
//         </Tabs>

//         <Modal
//           title="Edit Costume Request"
//           open={isEditModalVisible}
//           onOk={handleSubmitEdit}
//           onCancel={() => setIsEditModalVisible(false)}
//           okText="Submit"
//           width={800}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Input value={modalData.name} readOnly />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <TextArea
//                 value={modalData.description}
//                 onChange={(e) =>
//                   setModalData({ ...modalData, description: e.target.value })
//                 }
//                 rows={3}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Start Date</Form.Label>
//               <DatePicker
//                 value={modalData.startDate}
//                 format="DD/MM/YYYY"
//                 onChange={(date) => handleDateChange("startDate", date)}
//                 style={{ width: "100%" }}
//                 placeholder="Select start date"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>End Date</Form.Label>
//               <DatePicker
//                 value={modalData.endDate}
//                 format="DD/MM/YYYY"
//                 onChange={(date) => handleDateChange("endDate", date)}
//                 style={{ width: "100%" }}
//                 placeholder="Select end date"
//               />
//             </Form.Group>
//             <h5>Costumes</h5>
//             {modalData.characters.length === 0 ? (
//               <p>No costumes found.</p>
//             ) : (
//               <>
//                 {paginate(
//                   modalData.characters,
//                   currentCharacterPage,
//                   charactersPerPage
//                 ).map((char) => (
//                   <Card key={char.characterId} className="mb-3">
//                     <Card.Body>
//                       <Row>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Costume Name</Form.Label>
//                             <Input value={char.characterName} readOnly />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Description</Form.Label>
//                             <Input
//                               value={char.description}
//                               onChange={(e) =>
//                                 handleCharacterChange(
//                                   char.characterId,
//                                   "description",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Enter description"
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Max Height (cm)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.maxHeight}
//                               readOnly
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Max Weight (kg)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.maxWeight}
//                               readOnly
//                             />
//                           </Form.Group>
//                         </Col>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Min Height (cm)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.minHeight}
//                               readOnly
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Min Weight (kg)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.minWeight}
//                               readOnly
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Quantity</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.quantity}
//                               onChange={(e) =>
//                                 handleCharacterChange(
//                                   char.characterId,
//                                   "quantity",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Enter quantity"
//                             />
//                           </Form.Group>
//                           {char.urlImage && (
//                             <Image
//                               src={char.urlImage}
//                               alt="Costume Preview"
//                               width={100}
//                               preview
//                               style={{ display: "block", marginTop: "10px" }}
//                             />
//                           )}
//                         </Col>
//                       </Row>
//                     </Card.Body>
//                   </Card>
//                 ))}
//                 <Pagination
//                   current={currentCharacterPage}
//                   pageSize={charactersPerPage}
//                   total={modalData.characters.length}
//                   onChange={(page) => setCurrentCharacterPage(page)}
//                   showSizeChanger={false}
//                   style={{ textAlign: "right" }}
//                 />
//               </>
//             )}
//           </Form>
//         </Modal>

//         <Modal
//           title="View Costume Request"
//           open={isViewModalVisible}
//           onCancel={() => setIsViewModalVisible(false)}
//           footer={[
//             <Button key="close" onClick={() => setIsViewModalVisible(false)}>
//               Close
//             </Button>,
//           ]}
//           width={800}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Name</Form.Label>
//               <Input value={modalData.name} disabled />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <TextArea value={modalData.description} disabled rows={3} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Start Date</Form.Label>
//               <Input
//                 value={modalData.fullRequestData?.startDate || "N/A"}
//                 disabled
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>End Date</Form.Label>
//               <Input
//                 value={modalData.fullRequestData?.endDate || "N/A"}
//                 disabled
//               />
//             </Form.Group>
//             <h5>Costumes</h5>
//             {modalData.characters.length === 0 ? (
//               <p>No costumes found.</p>
//             ) : (
//               <>
//                 {paginate(
//                   modalData.characters,
//                   currentCharacterPage,
//                   charactersPerPage
//                 ).map((char) => (
//                   <Card key={char.characterId} className="mb-3">
//                     <Card.Body>
//                       <Row>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Character ID</Form.Label>
//                             <Input value={char.characterId} disabled />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Description</Form.Label>
//                             <Input value={char.description} disabled />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Max Height (cm)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.maxHeight}
//                               disabled
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Max Weight (kg)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.maxWeight}
//                               disabled
//                             />
//                           </Form.Group>
//                         </Col>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Min Height (cm)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.minHeight}
//                               disabled
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Min Weight (kg)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.minWeight}
//                               disabled
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Quantity</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.quantity}
//                               disabled
//                             />
//                           </Form.Group>
//                           {char.urlImage && (
//                             <Image
//                               src={char.urlImage}
//                               alt="Costume Preview"
//                               width={100}
//                               preview
//                               style={{ display: "block", marginTop: "10px" }}
//                             />
//                           )}
//                         </Col>
//                       </Row>
//                     </Card.Body>
//                   </Card>
//                 ))}
//                 <Pagination
//                   current={currentCharacterPage}
//                   pageSize={charactersPerPage}
//                   total={modalData.characters.length}
//                   onChange={(page) => setCurrentCharacterPage(page)}
//                   showSizeChanger={false}
//                   style={{ textAlign: "right" }}
//                 />
//               </>
//             )}
//           </Form>
//         </Modal>

//         <Modal
//           title="Confirm Deposit"
//           open={isConfirmDepositModalVisible}
//           onOk={handleConfirmDepositOk}
//           onCancel={() => setIsConfirmDepositModalVisible(false)}
//           okText="Confirm"
//           confirmLoading={loading}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Deposit Amount (VND)</Form.Label>
//               <Input value={paymentAmount.toLocaleString()} readOnly />
//             </Form.Group>
//             <p style={{ color: "#888", fontSize: "12px" }}>
//               Note: This amount will be refunded after the costume rental is
//               completed.
//             </p>
//           </Form>
//         </Modal>

//         <Modal
//           title="Pay Deposit"
//           open={isPaymentModalVisible}
//           onOk={handlePaymentConfirm}
//           onCancel={() => setIsPaymentModalVisible(false)}
//           okText="Pay Now"
//           confirmLoading={loading}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Amount (VND)</Form.Label>
//               <Input value={paymentAmount.toLocaleString()} readOnly />
//             </Form.Group>
//             <p style={{ color: "#888", fontSize: "12px" }}>
//               Note: This amount will be refunded after the costume rental is
//               completed.
//             </p>
//           </Form>
//         </Modal>

//         <Modal
//           title="Request Refund"
//           open={isRefundModalVisible}
//           onOk={handleRefundConfirm}
//           onCancel={() => setIsRefundModalVisible(false)}
//           okText="Submit Refund"
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Bank Account Number</Form.Label>
//               <Input
//                 value={refundData.bankAccount}
//                 onChange={(e) =>
//                   setRefundData({ ...refundData, bankAccount: e.target.value })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Bank Name</Form.Label>
//               <Input
//                 value={refundData.bankName}
//                 onChange={(e) =>
//                   setRefundData({ ...refundData, bankName: e.target.value })
//                 }
//               />
//             </Form.Group>
//           </Form>
//         </Modal>

//         <ViewMyRentalCostume
//           visible={isDetailModalVisible}
//           onCancel={() => setIsDetailModalVisible(false)}
//           requestId={selectedRequestId}
//           getRequestByRequestId={getRequestByRequestId}
//         />
//       </Container>
//       <MyCustomerCharacter />
//     </div>
//   );
// };

// export default MyRentalCostume;

/////////////////////////////////////////// tu sua edit
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import {
  Pagination,
  Modal,
  Input,
  Button,
  Tabs,
  Spin,
  Image,
  DatePicker,
} from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyRentalCostume.scss";
import { jwtDecode } from "jwt-decode";
import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";
import PaymentService from "../../services/PaymentService/PaymentService.js";
import { FileText, DollarSign, Calendar, CreditCard, Eye } from "lucide-react";
import dayjs from "dayjs";
import { useDebounce } from "use-debounce";
import MyCustomerCharacter from "../MyCustomerCharacterPage/MyCustomerCharacter.js";
import ViewMyRentalCostume from "./ViewMyRentalCostume";

const { TabPane } = Tabs;
const { TextArea } = Input;

const MyRentalCostume = () => {
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [filteredDepositContracts, setFilteredDepositContracts] = useState([]);
  const [filteredRefundContracts, setFilteredRefundContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentDepositPage, setCurrentDepositPage] = useState(1);
  const [currentRefundPage, setCurrentRefundPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);
  const [isConfirmDepositModalVisible, setIsConfirmDepositModalVisible] =
    useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [modalData, setModalData] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    characters: [],
    fullRequestData: null,
  });
  const [refundData, setRefundData] = useState({
    bankAccount: "",
    bankName: "",
  });
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [currentCharacterPage, setCurrentCharacterPage] = useState(1);

  const itemsPerPage = 5;
  const charactersPerPage = 2;
  const accessToken = localStorage.getItem("accessToken");
  const decoded = jwtDecode(accessToken);
  const accountId = decoded?.Id;

  // Date formatting function
  const formatDate = (date) => {
    if (!date || date === "null" || date === "undefined" || date === "") {
      console.log(`formatDate: Empty or invalid input - ${date}`);
      return "N/A";
    }

    if (dayjs.isDayjs(date)) {
      return date.format("DD/MM/YYYY");
    }

    const formats = [
      "DD/MM/YYYY",
      "HH:mm DD/MM/YYYY",
      "YYYY-MM-DD",
      "YYYY/MM/DD",
      "MM/DD/YYYY",
      "HH:mm DD-MM-YYYY",
      "D/M/YYYY",
      "DD/M/YYYY",
      "D/MM/YYYY",
    ];

    const parsedDate = dayjs(date, formats, true);
    console.log(
      `formatDate: Input=${date}, Parsed=${
        parsedDate.isValid() ? parsedDate.format() : "invalid"
      }`
    );

    return parsedDate.isValid()
      ? parsedDate.format("DD/MM/YYYY")
      : "Invalid Date";
  };

  // API to fetch request by requestId
  const getRequestByRequestId = async (id) => {
    try {
      const response = await MyRentalCostumeService.getRequestByRequestId(id);
      return response;
    } catch (error) {
      console.error("Error fetching request details:", error);
      throw error;
    }
  };

  // Fetch requests and calculate deposit
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await MyRentalCostumeService.GetAllRequestByAccountId(
          accountId
        );
        console.log("Requests API Response:", data);
        const requestsArray = Array.isArray(data) ? data : [];

        const enrichedRequests = await Promise.all(
          requestsArray
            .filter((request) => request?.serviceId === "S001")
            .map(async (request) => {
              const characters = request.charactersListResponse || [];
              let totalDeposit = 0;

              const characterDetails = await Promise.all(
                characters.map(async (char) => {
                  const characterData =
                    await MyRentalCostumeService.getCharacterById(
                      char.characterId
                    );
                  const deposit =
                    (characterData.price || 0) * (char.quantity || 0) * 5;
                  return { ...char, price: characterData.price || 0, deposit };
                })
              );

              totalDeposit = characterDetails.reduce(
                (sum, char) => sum + char.deposit,
                0
              );

              return {
                ...request,
                startDate: formatDate(request.startDate),
                endDate: formatDate(request.endDate),
                deposit: totalDeposit,
                charactersListResponse: characterDetails,
              };
            })
        );

        setRequests(enrichedRequests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error(
          error.response?.data?.message || "Failed to load requests."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [accountId]);

  // Fetch contracts
  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const data = await MyRentalCostumeService.getAllContractByAccountId(
          accountId
        );
        console.log("Contracts API Response:", data);
        const contractsArray = Array.isArray(data) ? data : [];
        const formattedContracts = contractsArray.map((contract) => ({
          ...contract,
          startDate: formatDate(contract.startDate),
          endDate: formatDate(contract.endDate),
        }));
        setContracts(formattedContracts);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
        toast.error(
          error.response?.data?.message || "Failed to load contracts."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [accountId]);

  // Filter requests without contracts (Pending or Browsed)
  useEffect(() => {
    const contractRequestIds = contracts.map((contract) => contract.requestId);
    const filtered = requests
      .filter((request) => !contractRequestIds.includes(request.requestId))
      .filter(
        (request) =>
          (request?.name?.toLowerCase?.() || "").includes(
            debouncedSearchTerm.toLowerCase()
          ) || (request?.startDate || "").includes(debouncedSearchTerm)
      );
    setFilteredPendingRequests(filtered);
    setCurrentPendingPage(1);
  }, [debouncedSearchTerm, requests, contracts]);

  // Filter contracts awaiting deposit payment (Active)
  useEffect(() => {
    const filtered = contracts
      .filter((contract) => contract.status === "Active")
      .filter(
        (contract) =>
          (contract?.contractName?.toLowerCase?.() || "").includes(
            debouncedSearchTerm.toLowerCase()
          ) || (contract?.startDate || "").includes(debouncedSearchTerm)
      );
    setFilteredDepositContracts(filtered);
    setCurrentDepositPage(1);
  }, [debouncedSearchTerm, contracts]);

  // Filter contracts in Progressing status related to serviceId S001
  useEffect(() => {
    const filtered = contracts
      .filter((contract) => contract.status === "Progressing")
      .filter((contract) => {
        const relatedRequest = requests.find(
          (req) => req.requestId === contract.requestId
        );
        return relatedRequest && relatedRequest.serviceId === "S001";
      })
      .filter(
        (contract) =>
          (contract?.contractName?.toLowerCase?.() || "").includes(
            debouncedSearchTerm.toLowerCase()
          ) || (contract?.startDate || "").includes(debouncedSearchTerm)
      );
    setFilteredRefundContracts(filtered);
    setCurrentRefundPage(1);
  }, [debouncedSearchTerm, contracts, requests]);

  const paginate = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  // Handle viewing request details
  const handleViewRequest = async (requestId) => {
    setLoading(true);
    setSelectedRequestId(requestId);
    try {
      const requestDetails = await getRequestByRequestId(requestId);
      console.log("Request Details:", requestDetails);
      const characters = requestDetails.charactersListResponse || [];

      const characterDetailsPromises = characters.map(async (char) => {
        const characterData = await MyRentalCostumeService.getCharacterById(
          char.characterId
        );
        return {
          characterId: char.characterId,
          characterName: characterData.characterName,
          maxHeight: characterData.maxHeight || 0,
          maxWeight: characterData.maxWeight || 0,
          minHeight: characterData.minHeight || 0,
          minWeight: characterData.minWeight || 0,
          quantity: char.quantity || 0,
          urlImage: characterData.images?.[0]?.urlImage || "",
          description: characterData.description || "",
          price: characterData.price || 0,
          maxQuantity: characterData.maxQuantity || 10, // Assume API provides maxQuantity, default to 10 if not
        };
      });

      const detailedCharacters = await Promise.all(characterDetailsPromises);

      const dateFormats = [
        "DD/MM/YYYY",
        "HH:mm DD/MM/YYYY",
        "YYYY-MM-DD",
        "YYYY/MM/DD",
        "MM/DD/YYYY",
        "HH:mm DD-MM-YYYY",
        "D/M/YYYY",
        "DD/M/YYYY",
        "D/MM/YYYY",
      ];
      const parsedStartDate = requestDetails.startDate
        ? dayjs(requestDetails.startDate, dateFormats, true)
        : null;
      const parsedEndDate = requestDetails.endDate
        ? dayjs(requestDetails.endDate, dateFormats, true)
        : null;

      console.log(
        `Parsed Dates: startDate=${
          parsedStartDate?.format("DD/MM/YYYY") || "null"
        }, endDate=${parsedEndDate?.format("DD/MM/YYYY") || "null"}`
      );

      setModalData({
        name: requestDetails.name || "",
        description: requestDetails.description || "",
        startDate: parsedStartDate?.isValid() ? parsedStartDate : null,
        endDate: parsedEndDate?.isValid() ? parsedEndDate : null,
        characters: detailedCharacters,
        fullRequestData: {
          ...requestDetails,
          startDate: formatDate(requestDetails.startDate),
          endDate: formatDate(requestDetails.endDate),
        },
      });

      if (requestDetails.status === "Pending") {
        setIsEditModalVisible(true);
      } else {
        setIsViewModalVisible(true);
      }
      setCurrentCharacterPage(1);
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      toast.error("Failed to load request details.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (requestId) => {
    setSelectedRequestId(requestId);
    setIsDetailModalVisible(true);
  };

  // Handle submission of edited request
  const handleSubmitEdit = async () => {
    const { characters, startDate, endDate, description } = modalData;

    // Validate required fields
    if (!startDate || !endDate) {
      toast.error("Start Date and End Date are required!");
      return;
    }

    // Validate end date is not before start date
    if (endDate.isBefore(startDate)) {
      toast.error("End Date must be on or after Start Date!");
      return;
    }

    // Validate rental period does not exceed 5 days
    if (endDate.diff(startDate, "day") > 5) {
      toast.error("The rental period cannot exceed 5 days!");
      return;
    }

    // Validate quantities
    for (const char of characters) {
      if (char.quantity <= 0) {
        toast.error(`Quantity for ${char.characterName} must be positive!`);
        return;
      }
      if (char.quantity > (char.maxQuantity || Number.MAX_SAFE_INTEGER)) {
        toast.error(
          `Quantity for ${char.characterName} exceeds available stock (${char.maxQuantity})!`
        );
        return;
      }
    }

    // Proceed with submission
    try {
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      if (
        formattedStartDate === "Invalid Date" ||
        formattedEndDate === "Invalid Date"
      ) {
        toast.error("Invalid date format!");
        return;
      }

      const updatedData = {
        name: modalData.fullRequestData.name || "Unnamed Request",
        description: description || "",
        price: modalData.fullRequestData.price || 100000,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        location: modalData.fullRequestData.location || "q tan binh",
        serviceId: modalData.fullRequestData.serviceId || "S001",
        packageId: "",
        listUpdateRequestCharacters: characters.map((char) => ({
          characterId: char.characterId,
          cosplayerId: null,
          description: char.description || "",
          quantity: char.quantity,
          listUpdateRequestDates: [
            {
              requestDateId: "",
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            },
          ],
        })),
      };

      console.log("UpdateRequest Payload:", updatedData);

      const response = await MyRentalCostumeService.UpdateRequest(
        selectedRequestId,
        updatedData
      );
      setRequests((prev) =>
        prev.map((req) =>
          req.requestId === selectedRequestId
            ? {
                ...req,
                charactersListResponse:
                  response.charactersListResponse || req.charactersListResponse,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                deposit: req.deposit,
              }
            : req
        )
      );
      toast.success("Costumes updated successfully!");
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update costumes. Please try again."
      );
    }
  };

  // Handle character information changes
  const handleCharacterChange = (characterId, field, value) => {
    setModalData((prev) => ({
      ...prev,
      characters: prev.characters.map((char) =>
        char.characterId === characterId
          ? {
              ...char,
              [field]:
                field === "quantity"
                  ? Math.min(
                      Number(value) > 0 ? Number(value) : 0,
                      char.maxQuantity || Number.MAX_SAFE_INTEGER
                    )
                  : value,
            }
          : char
      ),
    }));
  };

  // Handle date changes
  const handleDateChange = (field, date) => {
    setModalData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleConfirmDeposit = async (request) => {
    setSelectedRequestId(request.requestId);
    try {
      const requestDetails = await getRequestByRequestId(request.requestId);
      const characters = requestDetails.charactersListResponse || [];

      const characterDetailsPromises = characters.map(async (char) => {
        const characterData = await MyRentalCostumeService.getCharacterById(
          char.characterId
        );
        return {
          price: characterData.price || 0,
          quantity: char.quantity || 0,
        };
      });

      const detailedCharacters = await Promise.all(characterDetailsPromises);
      const totalDeposit = detailedCharacters.reduce(
        (sum, char) => sum + char.price * 5 * char.quantity,
        0
      );

      setPaymentAmount(totalDeposit);
      setIsConfirmDepositModalVisible(true);
    } catch (error) {
      console.error("Error calculating deposit:", error);
      toast.error("Failed to calculate deposit amount.");
    }
  };

  const handleConfirmDepositOk = async () => {
    if (!selectedRequestId) {
      toast.error("Request ID is missing!");
      return;
    }
    setLoading(true);
    try {
      await MyRentalCostumeService.addContractCostume(selectedRequestId, 100);

      const requestData = await MyRentalCostumeService.GetAllRequestByAccountId(
        accountId
      );
      const enrichedRequests = await Promise.all(
        (Array.isArray(requestData) ? requestData : [])
          .filter((req) => req?.serviceId === "S001")
          .map(async (request) => {
            const characters = request.charactersListResponse || [];
            let totalDeposit = 0;

            const characterDetails = await Promise.all(
              characters.map(async (char) => {
                const characterData =
                  await MyRentalCostumeService.getCharacterById(
                    char.characterId
                  );
                const deposit =
                  (characterData.price || 0) * (char.quantity || 0) * 5;
                return { ...char, price: characterData.price || 0, deposit };
              })
            );

            totalDeposit = characterDetails.reduce(
              (sum, char) => sum + char.deposit,
              0
            );

            return {
              ...request,
              startDate: formatDate(request.startDate),
              endDate: formatDate(request.endDate),
              deposit: totalDeposit,
              charactersListResponse: characterDetails,
            };
          })
      );
      setRequests(enrichedRequests);

      const contractDataUpdated =
        await MyRentalCostumeService.getAllContractByAccountId(accountId);
      setContracts(
        Array.isArray(contractDataUpdated)
          ? contractDataUpdated.map((contract) => ({
              ...contract,
              startDate: formatDate(contract.startDate),
              endDate: formatDate(contract.endDate),
            }))
          : []
      );

      toast.success(
        "Deposit confirmed successfully! Please proceed to payment in the Deposit Payment tab."
      );
      setIsConfirmDepositModalVisible(false);
    } catch (error) {
      console.error("Error confirming deposit:", error);
      toast.error(error.message || "Failed to confirm deposit.");
    } finally {
      setLoading(false);
      setSelectedRequestId(null);
    }
  };

  const handlePayment = async (contract) => {
    setSelectedContractId(contract.contractId);
    try {
      const requestDetails = await getRequestByRequestId(contract.requestId);
      const characters = requestDetails.charactersListResponse || [];

      const characterDetailsPromises = characters.map(async (char) => {
        const characterData = await MyRentalCostumeService.getCharacterById(
          char.characterId
        );
        return {
          price: characterData.price || 0,
          quantity: char.quantity || 0,
        };
      });

      const detailedCharacters = await Promise.all(characterDetailsPromises);
      const totalDeposit = detailedCharacters.reduce(
        (sum, char) => sum + char.price * 5 * char.quantity,
        0
      );

      setPaymentAmount(totalDeposit);
      setIsPaymentModalVisible(true);
    } catch (error) {
      console.error("Error calculating deposit:", error);
      toast.error("Failed to calculate deposit amount.");
    }
  };

  const handlePaymentConfirm = async () => {
    if (!selectedContractId) {
      toast.error("Contract ID is missing!");
      return;
    }
    setLoading(true);
    try {
      const paymentData = {
        fullName: decoded?.AccountName || "User",
        orderInfo: `Deposit for ${modalData.name || "Costume Rental"}`,
        amount: paymentAmount,
        purpose: 1,
        accountId: accountId,
        contractId: selectedContractId,
      };

      const paymentUrl = await PaymentService.DepositPayment(paymentData);

      const contractDataUpdated =
        await MyRentalCostumeService.getAllContractByAccountId(accountId);
      setContracts(
        Array.isArray(contractDataUpdated)
          ? contractDataUpdated.map((contract) => ({
              ...contract,
              startDate: formatDate(contract.startDate),
              endDate: formatDate(contract.endDate),
            }))
          : []
      );

      toast.success("Payment successful! Redirecting to payment gateway...");
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Error in payment process:", error);
      toast.error(error.message || "Failed to process payment.");
    } finally {
      setLoading(false);
      setIsPaymentModalVisible(false);
      setSelectedContractId(null);
    }
  };

  const handleRefundRequest = (contract) => {
    setSelectedContractId(contract.contractId);
    setIsRefundModalVisible(true);
  };

  const handleRefundConfirm = () => {
    const { bankAccount, bankName } = refundData;
    if (!bankAccount.trim() || !bankName.trim()) {
      toast.error("Bank account number and bank name cannot be empty!");
      return;
    }
    toast.success("Refund request submitted!");
    setIsRefundModalVisible(false);
    setRefundData({ bankAccount: "", bankName: "" });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Cancel: "secondary",
      Active: "warning",
      Progressing: "info",
      Completed: "success",
    };
    return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
  };

  const currentPendingItems = paginate(
    filteredPendingRequests,
    currentPendingPage,
    itemsPerPage
  );
  const currentDepositItems = paginate(
    filteredDepositContracts,
    currentDepositPage,
    itemsPerPage
  );
  const currentRefundItems = paginate(
    filteredRefundContracts,
    currentRefundPage,
    itemsPerPage
  );

  return (
    <div className="rental-management bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-rental-management">
          <span>Costume Rental Management</span>
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row>
            <Col md={12}>
              <Form.Control
                type="text"
                placeholder="Search by name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </Col>
          </Row>
        </div>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="My Requests" key="1">
            {loading ? (
              <Spin tip="Loading..." />
            ) : currentPendingItems.length === 0 ? (
              <p className="text-center">No pending requests found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentPendingItems.map((req) => (
                    <Col key={req.requestId} xs={12}>
                      <Card className="rental-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div>
                                  <h3 className="rental-title">{req.name}</h3>
                                  <div className="text-muted small">
                                    <DollarSign size={16} /> Unit Price / day:{" "}
                                    {(req.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small">
                                    <DollarSign size={16} /> Deposit:{" "}
                                    {(req.deposit || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small">
                                    <Calendar size={16} /> Start Date:{" "}
                                    {req.startDate}
                                  </div>
                                  <div className="text-muted small">
                                    <Calendar size={16} /> Return Date:{" "}
                                    {req.endDate}
                                  </div>
                                  {getStatusBadge(req.status)}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <Button
                                type="primary"
                                size="small"
                                className="btn-view"
                                onClick={() => handleViewRequest(req.requestId)}
                              >
                                <Eye size={16} />{" "}
                                {req.status === "Pending" ? "Edit" : "View"}
                              </Button>
                              <Button
                                size="small"
                                className="btn-detail"
                                onClick={() => handleViewDetail(req.requestId)}
                              >
                                <Eye size={16} /> View Details
                              </Button>
                              {req.status === "Browsed" && (
                                <Button
                                  size="small"
                                  className="btn-deposit"
                                  onClick={() => handleConfirmDeposit(req)}
                                >
                                  <CreditCard size={16} /> Confirm Deposit
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Pagination
                  current={currentPendingPage}
                  pageSize={itemsPerPage}
                  total={filteredPendingRequests.length}
                  onChange={(page) => setCurrentPendingPage(page)}
                  showSizeChanger={false}
                  style={{ marginTop: "20px", textAlign: "right" }}
                />
              </>
            )}
          </TabPane>

          <TabPane tab="Deposit Payment" key="2">
            {loading ? (
              <Spin tip="Loading..." />
            ) : currentDepositItems.length === 0 ? (
              <p className="text-center">
                No contracts awaiting payment found.
              </p>
            ) : (
              <>
                <Row className="g-4">
                  {currentDepositItems.map((contract) => (
                    <Col key={contract.contractId} xs={12}>
                      <Card className="rental-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div>
                                  <h3 className="rental-title">
                                    {contract.contractName}
                                  </h3>
                                  <div className="text-muted small">
                                    <DollarSign size={16} /> Total Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small">
                                    <Calendar size={16} /> Start Date:{" "}
                                    {contract.startDate}
                                  </div>
                                  <div className="text-muted small">
                                    <Calendar size={16} /> Return Date:{" "}
                                    {contract.endDate}
                                  </div>
                                  {getStatusBadge(contract.status)}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <Button
                                type="primary"
                                size="small"
                                className="btn-view"
                                onClick={() =>
                                  handleViewRequest(contract.requestId)
                                }
                              >
                                <Eye size={16} /> View
                              </Button>
                              <Button
                                size="small"
                                className="btn-deposit"
                                onClick={() => handlePayment(contract)}
                              >
                                <CreditCard size={16} /> Pay Now
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Pagination
                  current={currentDepositPage}
                  pageSize={itemsPerPage}
                  total={filteredDepositContracts.length}
                  onChange={(page) => setCurrentDepositPage(page)}
                  showSizeChanger={false}
                  style={{ marginTop: "20px", textAlign: "right" }}
                />
              </>
            )}
          </TabPane>

          <TabPane tab="Refund Requests" key="3">
            {loading ? (
              <Spin tip="Loading..." />
            ) : currentRefundItems.length === 0 ? (
              <p className="text-center">No progressing contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentRefundItems.map((contract) => (
                    <Col key={contract.contractId} xs={12}>
                      <Card className="rental-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div>
                                  <h3 className="rental-title">
                                    {contract.contractName}
                                  </h3>
                                  <div className="text-muted small">
                                    <DollarSign size={16} /> Total Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small">
                                    <Calendar size={16} /> Start Date:{" "}
                                    {contract.startDate}
                                  </div>
                                  <div className="text-muted small">
                                    <Calendar size={16} /> Return Date:{" "}
                                    {contract.endDate}
                                  </div>
                                  {getStatusBadge(contract.status)}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                              <Button
                                type="primary"
                                size="small"
                                className="btn-view"
                                onClick={() =>
                                  handleViewRequest(contract.requestId)
                                }
                              >
                                <Eye size={16} /> View
                              </Button>
                              <Button
                                size="small"
                                className="btn-refund"
                                onClick={() => handleRefundRequest(contract)}
                              >
                                <CreditCard size={16} /> Request Refund
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Pagination
                  current={currentRefundPage}
                  pageSize={itemsPerPage}
                  total={filteredRefundContracts.length}
                  onChange={(page) => setCurrentRefundPage(page)}
                  showSizeChanger={false}
                  style={{ marginTop: "20px", textAlign: "right" }}
                />
              </>
            )}
          </TabPane>
        </Tabs>

        <Modal
          title="Edit Costume Request"
          open={isEditModalVisible}
          onOk={handleSubmitEdit}
          onCancel={() => setIsEditModalVisible(false)}
          okText="Submit"
          width={800}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Input value={modalData.name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <TextArea
                value={modalData.description}
                onChange={(e) =>
                  setModalData({ ...modalData, description: e.target.value })
                }
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <DatePicker
                value={modalData.startDate}
                format="DD/MM/YYYY"
                onChange={(date) => handleDateChange("startDate", date)}
                style={{ width: "100%" }}
                placeholder="Select start date"
                disabledDate={(current) =>
                  current && current <= dayjs().endOf("day")
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <DatePicker
                value={modalData.endDate}
                format="DD/MM/YYYY"
                onChange={(date) => handleDateChange("endDate", date)}
                style={{ width: "100%" }}
                placeholder="Select end date"
                disabledDate={(current) =>
                  current &&
                  (current < modalData.startDate ||
                    (modalData.startDate &&
                      current > modalData.startDate.add(5, "day")))
                }
              />
            </Form.Group>
            <h5>Costumes</h5>
            {modalData.characters.length === 0 ? (
              <p>No costumes found.</p>
            ) : (
              <>
                {paginate(
                  modalData.characters,
                  currentCharacterPage,
                  charactersPerPage
                ).map((char) => (
                  <Card key={char.characterId} className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Costume Name</Form.Label>
                            <Input value={char.characterName} readOnly />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Input
                              value={char.description}
                              onChange={(e) =>
                                handleCharacterChange(
                                  char.characterId,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Enter description"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxHeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxWeight}
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.minHeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.minWeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Quantity (Max: {char.maxQuantity})
                            </Form.Label>
                            <Input
                              type="number"
                              value={char.quantity}
                              onChange={(e) =>
                                handleCharacterChange(
                                  char.characterId,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              placeholder="Enter quantity"
                              min={1}
                              max={char.maxQuantity || 10}
                            />
                          </Form.Group>
                          {char.urlImage && (
                            <Image
                              src={char.urlImage}
                              alt="Costume Preview"
                              width={100}
                              preview
                              style={{ display: "block", marginTop: "10px" }}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Pagination
                  current={currentCharacterPage}
                  pageSize={charactersPerPage}
                  total={modalData.characters.length}
                  onChange={(page) => setCurrentCharacterPage(page)}
                  showSizeChanger={false}
                  style={{ textAlign: "right" }}
                />
              </>
            )}
          </Form>
        </Modal>

        <Modal
          title="View Costume Request"
          open={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={800}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Input value={modalData.name} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <TextArea value={modalData.description} disabled rows={3} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Input
                value={modalData.fullRequestData?.startDate || "N/A"}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Input
                value={modalData.fullRequestData?.endDate || "N/A"}
                disabled
              />
            </Form.Group>
            <h5>Costumes</h5>
            {modalData.characters.length === 0 ? (
              <p>No costumes found.</p>
            ) : (
              <>
                {paginate(
                  modalData.characters,
                  currentCharacterPage,
                  charactersPerPage
                ).map((char) => (
                  <Card key={char.characterId} className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Character ID</Form.Label>
                            <Input value={char.characterId} disabled />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Input value={char.description} disabled />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxHeight}
                              disabled
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxWeight}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.minHeight}
                              disabled
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.minWeight}
                              disabled
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Input
                              type="number"
                              value={char.quantity}
                              disabled
                            />
                          </Form.Group>
                          {char.urlImage && (
                            <Image
                              src={char.urlImage}
                              alt="Costume Preview"
                              width={100}
                              preview
                              style={{ display: "block", marginTop: "10px" }}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Pagination
                  current={currentCharacterPage}
                  pageSize={charactersPerPage}
                  total={modalData.characters.length}
                  onChange={(page) => setCurrentCharacterPage(page)}
                  showSizeChanger={false}
                  style={{ textAlign: "right" }}
                />
              </>
            )}
          </Form>
        </Modal>

        <Modal
          title="Confirm Deposit"
          open={isConfirmDepositModalVisible}
          onOk={handleConfirmDepositOk}
          onCancel={() => setIsConfirmDepositModalVisible(false)}
          okText="Confirm"
          confirmLoading={loading}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Deposit Amount (VND)</Form.Label>
              <Input value={paymentAmount.toLocaleString()} readOnly />
            </Form.Group>
            <p style={{ color: "#888", fontSize: "12px" }}>
              Note: This amount will be refunded after the costume rental is
              completed.
            </p>
          </Form>
        </Modal>

        <Modal
          title="Pay Deposit"
          open={isPaymentModalVisible}
          onOk={handlePaymentConfirm}
          onCancel={() => setIsPaymentModalVisible(false)}
          okText="Pay Now"
          confirmLoading={loading}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount (VND)</Form.Label>
              <Input value={paymentAmount.toLocaleString()} readOnly />
            </Form.Group>
            <p style={{ color: "#888", fontSize: "12px" }}>
              Note: This amount will be refunded after the costume rental is
              completed.
            </p>
          </Form>
        </Modal>

        <Modal
          title="Request Refund"
          open={isRefundModalVisible}
          onOk={handleRefundConfirm}
          onCancel={() => setIsRefundModalVisible(false)}
          okText="Submit Refund Request"
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Bank Account Number</Form.Label>
              <Input
                value={refundData.bankAccount}
                onChange={(e) =>
                  setRefundData({ ...refundData, bankAccount: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bank Name</Form.Label>
              <Input
                value={refundData.bankName}
                onChange={(e) =>
                  setRefundData({ ...refundData, bankName: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal>

        <ViewMyRentalCostume
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          requestId={selectedRequestId}
          getRequestByRequestId={getRequestByRequestId}
          style={{ width: "70%" }}
        />
      </Container>
      <MyCustomerCharacter />
    </div>
  );
};

export default MyRentalCostume;
