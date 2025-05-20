// bỏ lọc tabs 2 và 3===============================================================================================
// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
// import {
//   Pagination,
//   Modal,
//   Input,
//   Button,
//   Tabs,
//   Spin,
//   DatePicker,
//   Select,
//   Checkbox,
// } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyRentalCostume.scss";
// import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";
// import PaymentService from "../../services/PaymentService/PaymentService.js";
// import RefundService from "../../services/RefundService/RefundService.js";
// import { FileText, DollarSign, Calendar, Eye, File, User } from "lucide-react";
// import dayjs from "dayjs";
// import { useDebounce } from "use-debounce";
// import MyCustomerCharacter from "../MyCustomerCharacterPage/MyCustomerCharacter.js";
// import ViewMyRentalCostume from "./ViewMyRentalCostume";
// import { useParams } from "react-router-dom";
// import EditRentalCostume from "./EditRentalCostume";
// import ViewDeliveryRentalCostume from "./ViewDeliveryRentalCostume";
// import ViewRefund from "./ViewRefund";
// import EditRefund from "./EditRefund";

// const { TabPane } = Tabs;
// const { TextArea } = Input;
// const { Option } = Select;

// const MyRentalCostume = () => {
//   const { id: accountId } = useParams();
//   const [requests, setRequests] = useState([]);
//   const [contracts, setContracts] = useState([]);
//   const [refunds, setRefunds] = useState([]);
//   const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
//   const [filteredDepositContracts, setFilteredDepositContracts] = useState([]);
//   const [filteredRefunds, setFilteredRefunds] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPendingPage, setCurrentPendingPage] = useState(1);
//   const [currentDepositPage, setCurrentDepositPage] = useState(1);
//   const [currentRefundPage, setCurrentRefundPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
//   const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);
//   const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
//   const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
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
//     price: "",
//     description: "",
//   });
//   const [paymentAmount, setPaymentAmount] = useState(0);
//   const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
//   const [sortField, setSortField] = useState("date");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [statusFilters, setStatusFilters] = useState({
//     Pending: true,
//     Browsed: true,
//     Cancel: true,
//   });
//   const [contractStatusFilters, setContractStatusFilters] = useState({
//     Cancel: true,
//     Created: true,
//     Deposited: true,
//     Refund: true,
//     Completed: true,
//     Expired: true,
//     RefundOverdue: true,
//   });
//   const [refundStatusFilters, setRefundStatusFilters] = useState({
//     Pending: true,
//     Paid: true,
//   });

//   const itemsPerPage = 5;
//   const charactersPerPage = 2;

//   const formatDate = (date) => {
//     if (!date || date === "null" || date === "undefined" || date === "") {
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
//     return parsedDate.isValid()
//       ? parsedDate.format("DD/MM/YYYY")
//       : "Invalid Date";
//   };

//   const sortData = (data, field, order) => {
//     return [...data].sort((a, b) => {
//       let valueA, valueB;
//       if (field === "price") {
//         valueA = a.price || 0;
//         valueB = b.price || 0;
//       } else if (field === "deposit") {
//         valueA = a.deposit || 0;
//         valueB = b.deposit || 0;
//       } else if (field === "date") {
//         valueA = dayjs(a.startDate || a.createDate, "DD/MM/YYYY").unix() || 0;
//         valueB = dayjs(b.startDate || b.createDate, "DD/MM/YYYY").unix() || 0;
//       }
//       return order === "asc" ? valueA - valueB : valueB - valueA;
//     });
//   };

//   const getRequestByRequestId = async (id) => {
//     try {
//       const response = await MyRentalCostumeService.getRequestByRequestId(id);
//       return response;
//     } catch (error) {
//       console.error("Error fetching request details:", error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     const fetchRequests = async () => {
//       setLoading(true);
//       try {
//         const data = await MyRentalCostumeService.GetAllRequestByAccountId(
//           accountId
//         );
//         const requestsArray = Array.isArray(data) ? data : [];
//         const formattedRequests = requestsArray
//           .filter((request) => request?.serviceId === "S001")
//           .map((request) => ({
//             ...request,
//             startDate: formatDate(request.startDate),
//             endDate: formatDate(request.endDate),
//             price: request.price || 0,
//             deposit: request.deposit || 0,
//             charactersListResponse: request.charactersListResponse || [],
//           }));
//         setRequests(formattedRequests);
//       } catch (error) {
//         console.error("Failed to fetch requests:", error);
//         toast.error(
//           error.response?.data?.message || "Failed to load requests."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (accountId) fetchRequests();
//   }, [accountId]);

//   useEffect(() => {
//     const fetchContracts = async () => {
//       setLoading(true);
//       try {
//         const data = await MyRentalCostumeService.getAllContractByAccountId(
//           accountId
//         );
//         const contractsArray = Array.isArray(data) ? data : [];
//         const formattedContracts = contractsArray.map((contract) => ({
//           ...contract,
//           startDate: formatDate(contract.startDate),
//           endDate: formatDate(contract.endDate),
//           price: contract.price || 0,
//           deposit: contract.deposit || 0,
//           amount: contract.amount || 0,
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
//     if (accountId) fetchContracts();
//   }, [accountId]);

//   useEffect(() => {
//     const fetchRefunds = async () => {
//       setLoading(true);
//       try {
//         const data = await RefundService.getAllContractRefundByAccountId(
//           accountId
//         );
//         const refundsArray = Array.isArray(data) ? data : [];
//         const formattedRefunds = refundsArray.map((refund) => ({
//           ...refund,
//           createDate: formatDate(refund.createDate),
//           updateDate: formatDate(refund.updateDate),
//           price: refund.price || 0,
//         }));
//         setRefunds(formattedRefunds);
//       } catch (error) {
//         console.error("Failed to fetch refunds:", error);
//         toast.error(error.response?.data?.message || "Failed to load refunds.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (accountId) fetchRefunds();
//   }, [accountId]);

//   useEffect(() => {
//     const contractRequestIds = contracts
//       .filter((contract) => contract)
//       .map((contract) => contract.requestId);
//     let filtered = requests
//       .filter((request) => !contractRequestIds.includes(request.requestId))
//       .filter(
//         (request) =>
//           (request?.name?.toLowerCase?.() || "").includes(
//             debouncedSearchTerm.toLowerCase()
//           ) || (request?.startDate || "").includes(debouncedSearchTerm)
//       );
//     filtered = filtered.filter((request) => statusFilters[request.status]);
//     filtered = sortData(filtered, sortField, sortOrder);
//     setFilteredPendingRequests(filtered);
//     setCurrentPendingPage(1);
//   }, [
//     debouncedSearchTerm,
//     requests,
//     contracts,
//     sortField,
//     sortOrder,
//     statusFilters,
//   ]);

//   // lọc tab 2 & 3

//   // useEffect(() => {
//   //   const filterDepositContracts = async () => {
//   //     setLoading(true);
//   //     try {
//   //       const data = await MyRentalCostumeService.getAllContractByAccountId(
//   //         accountId
//   //       );
//   //       const contractsArray = Array.isArray(data) ? data : [];
//   //       const refundedContractIds = refunds.map((refund) => refund.contractId);
//   //       const filtered = await Promise.all(
//   //         contractsArray.map(async (contract) => {
//   //           try {
//   //             const request = await getRequestByRequestId(contract.requestId);
//   //             if (
//   //               request.serviceId === "S001" &&
//   //               !refundedContractIds.includes(contract.contractId)
//   //             ) {
//   //               return {
//   //                 ...contract,
//   //                 startDate: formatDate(contract.startDate),
//   //                 endDate: formatDate(contract.endDate),
//   //                 price: contract.price || 0,
//   //                 deposit: contract.deposit || request.deposit || 0,
//   //                 reason: contract.reason
//   //                   ? contract.reason.trim().toLowerCase()
//   //                   : "",
//   //                 amount: contract.amount || 0,
//   //                 createBy: contract.createBy || "",
//   //                 createDate: formatDate(contract.createDate) || "",
//   //               };
//   //             }
//   //             return null;
//   //           } catch (error) {
//   //             console.error(
//   //               `Error fetching request ${contract.requestId}:`,
//   //               error
//   //             );
//   //             return null;
//   //           }
//   //         })
//   //       );
//   //       let validContracts = filtered
//   //         .filter((contract) => contract !== null)
//   //         .filter(
//   //           (contract) =>
//   //             (contract?.contractName?.toLowerCase?.() || "").includes(
//   //               debouncedSearchTerm.toLowerCase()
//   //             ) || (contract?.startDate || "").includes(debouncedSearchTerm)
//   //         )
//   //         .filter((contract) => contractStatusFilters[contract.status]);
//   //       validContracts = sortData(validContracts, sortField, sortOrder);
//   //       setFilteredDepositContracts(validContracts);
//   //       setCurrentDepositPage(1);
//   //     } catch (error) {
//   //       console.error("Failed to fetch deposit contracts:", error);
//   //       toast.error("Failed to load deposit contracts.");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   if (accountId) filterDepositContracts();
//   // }, [
//   //   debouncedSearchTerm,
//   //   accountId,
//   //   sortField,
//   //   sortOrder,
//   //   contractStatusFilters,
//   //   refunds,
//   // ]);

//   useEffect(() => {
//     const filterDepositContracts = async () => {
//       setLoading(true);
//       try {
//         const data = await MyRentalCostumeService.getAllContractByAccountId(
//           accountId
//         );
//         const contractsArray = Array.isArray(data) ? data : [];
//         const filtered = await Promise.all(
//           contractsArray.map(async (contract) => {
//             try {
//               const request = await getRequestByRequestId(contract.requestId);
//               if (request.serviceId === "S001") {
//                 return {
//                   ...contract,
//                   startDate: formatDate(contract.startDate),
//                   endDate: formatDate(contract.endDate),
//                   price: contract.price || 0,
//                   deposit: contract.deposit || request.deposit || 0,
//                   reason: contract.reason
//                     ? contract.reason.trim().toLowerCase()
//                     : "",
//                   amount: contract.amount || 0,
//                   createBy: contract.createBy || "",
//                   createDate: formatDate(contract.createDate) || "",
//                 };
//               }
//               return null;
//             } catch (error) {
//               console.error(
//                 `Error fetching request ${contract.requestId}:`,
//                 error
//               );
//               return null;
//             }
//           })
//         );
//         let validContracts = filtered
//           .filter((contract) => contract !== null)
//           .filter(
//             (contract) =>
//               (contract?.contractName?.toLowerCase?.() || "").includes(
//                 debouncedSearchTerm.toLowerCase()
//               ) || (contract?.startDate || "").includes(debouncedSearchTerm)
//           )
//           .filter((contract) => contractStatusFilters[contract.status]);
//         validContracts = sortData(validContracts, sortField, sortOrder);
//         setFilteredDepositContracts(validContracts);
//         setCurrentDepositPage(1);
//       } catch (error) {
//         console.error("Failed to fetch deposit contracts:", error);
//         toast.error("Failed to load deposit contracts.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (accountId) filterDepositContracts();
//   }, [
//     debouncedSearchTerm,
//     accountId,
//     sortField,
//     sortOrder,
//     contractStatusFilters,
//   ]);
//   useEffect(() => {
//     let filtered = refunds
//       .filter(
//         (refund) =>
//           (refund?.description?.toLowerCase?.() || "").includes(
//             debouncedSearchTerm.toLowerCase()
//           ) || (refund?.createDate || "").includes(debouncedSearchTerm)
//       )
//       .filter((refund) => refundStatusFilters[refund.status]);
//     filtered = sortData(filtered, sortField, sortOrder);
//     setFilteredRefunds(filtered);
//     setCurrentRefundPage(1);
//   }, [debouncedSearchTerm, refunds, sortField, sortOrder, refundStatusFilters]);

//   const paginate = (data, page, perPage) => {
//     const start = (page - 1) * perPage;
//     return data.slice(start, start + perPage);
//   };

//   const handleContractStatusFilterChange = (status) => {
//     setContractStatusFilters((prev) => ({
//       ...prev,
//       [status]: !prev[status],
//     }));
//   };

//   const handleStatusFilterChange = (status) => {
//     setStatusFilters((prev) => ({
//       ...prev,
//       [status]: !prev[status],
//     }));
//   };

//   const handleRefundStatusFilterChange = (status) => {
//     setRefundStatusFilters((prev) => ({
//       ...prev,
//       [status]: !prev[status],
//     }));
//   };

//   const handleEditRequest = async (requestId) => {
//     setLoading(true);
//     setSelectedRequestId(requestId);
//     try {
//       const requestDetails = await getRequestByRequestId(requestId);
//       const characters = requestDetails.charactersListResponse || [];

//       const characterDetailsPromises = characters.map(async (char) => {
//         const characterData = await MyRentalCostumeService.getCharacterById(
//           char.characterId
//         );
//         return {
//           characterId: char.characterId,
//           characterName: characterData.characterName || "",
//           maxHeight: characterData.maxHeight || 0,
//           maxWeight: characterData.maxWeight || 0,
//           minHeight: characterData.minHeight || 0,
//           minWeight: characterData.minWeight || 0,
//           quantity: char.quantity || 0,
//           urlImage: characterData.images?.[0]?.urlImage || "",
//           description: characterData.description || "",
//           price: characterData.price || 0,
//           maxQuantity: characterData.maxQuantity || 10,
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
//           price: requestDetails.price || 0,
//           deposit: requestDetails.deposit || 0,
//         },
//       });

//       setIsEditModalVisible(true);
//       setCurrentCharacterPage(1);
//     } catch (error) {
//       console.error("Failed to fetch request details:", error);
//       toast.error("Failed to load request details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitEdit = (
//     response,
//     newPrice,
//     formattedStartDate,
//     formattedEndDate,
//     deposit
//   ) => {
//     setRequests((prev) =>
//       prev.map((req) =>
//         req.requestId === selectedRequestId
//           ? {
//               ...req,
//               price: newPrice,
//               charactersListResponse:
//                 response.charactersListResponse || req.charactersListResponse,
//               startDate: formattedStartDate,
//               endDate: formattedEndDate,
//               deposit: deposit,
//             }
//           : req
//       )
//     );
//     setIsEditModalVisible(false);
//   };

//   const handleViewDetail = (requestId) => {
//     setSelectedRequestId(requestId);
//     setIsDetailModalVisible(true);
//   };

//   const handlePayment = async (contract) => {
//     setSelectedContractId(contract.contractId);
//     try {
//       const requestDetails = await getRequestByRequestId(contract.requestId);
//       setPaymentAmount(requestDetails.deposit || 0);
//       setIsPaymentModalVisible(true);
//     } catch (error) {
//       console.error("Error fetching deposit:", error);
//       toast.error("Failed to retrieve deposit amount.");
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
//         fullName: "User",
//         orderInfo: `Deposit for ${modalData.name || "Costume Rental"}`,
//         amount: paymentAmount,
//         purpose: 1,
//         accountId: accountId,
//         contractId: selectedContractId,
//         isWeb: true,
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
//               price: contract.price || 0,
//               deposit: contract.deposit || 0,
//               amount: contract.amount || 0,
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

//   const handleViewDelivery = (contractId) => {
//     setSelectedContractId(contractId);
//     setIsDeliveryModalVisible(true);
//   };

//   const handleCloseDeliveryModal = () => {
//     setIsDeliveryModalVisible(false);
//     setSelectedContractId(null);
//   };

//   const handleRefundRequest = (contract) => {
//     setSelectedContractId(contract.contractId);
//     setIsRefundModalVisible(true);
//   };

//   const handleRefundConfirm = async () => {
//     const { bankAccount, bankName, price, description } = refundData;
//     if (
//       !bankAccount.trim() ||
//       !bankName.trim() ||
//       !price ||
//       !description.trim()
//     ) {
//       toast.error(
//         "Bank account, bank name, price, and description are required!"
//       );
//       return;
//     }
//     setLoading(true);
//     try {
//       await RefundService.sendRefund(selectedContractId, price, description);
//       const updatedRefunds =
//         await RefundService.getAllContractRefundByAccountId(accountId);
//       setRefunds(
//         Array.isArray(updatedRefunds)
//           ? updatedRefunds.map((refund) => ({
//               ...refund,
//               createDate: formatDate(refund.createDate),
//               updateDate: formatDate(refund.updateDate),
//               price: refund.price || 0,
//             }))
//           : []
//       );
//       toast.success("Refund request submitted!");
//       setIsRefundModalVisible(false);
//       setRefundData({
//         bankAccount: "",
//         bankName: "",
//         price: "",
//         description: "",
//       });
//       setSelectedContractId(null);
//     } catch (error) {
//       console.error("Error submitting refund:", error);
//       toast.error("Failed to submit refund request.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       Pending: "primary",
//       Browsed: "success",
//       Cancel: "danger",
//       Active: "warning",
//       Created: "warning",
//       Deposited: "success",
//       Refund: "info",
//       Completed: "success",
//       Paid: "success",
//     };
//     return <Badge bg={statusColors[status] || "warning"}>{status}</Badge>;
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
//     filteredRefunds,
//     currentRefundPage,
//     itemsPerPage
//   );

//   return (
//     <div className="rental-management bg-light min-vh-100">
//       <Container className="py-5">
//         <h1 className="text-center mb-5 fw-bold title-rental-management">
//           <span>Costume Rental Management</span>
//         </h1>

//         <div className="filter-section bg-white p-4 rounded shadow mb-5">
//           <Row>
//             <Col md={6}>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name, date, or description..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input"
//               />
//             </Col>
//             <Col md={3}>
//               <Select
//                 style={{ width: "100%" }}
//                 value={sortField}
//                 onChange={(value) => setSortField(value)}
//               >
//                 <Option value="price">Sort by Price</Option>
//                 <Option value="deposit">Sort by Deposit</Option>
//                 <Option value="date">Sort by Date</Option>
//               </Select>
//             </Col>
//             <Col md={3}>
//               <Select
//                 style={{ width: "100%" }}
//                 value={sortOrder}
//                 onChange={(value) => setSortOrder(value)}
//               >
//                 <Option value="asc">Ascending</Option>
//                 <Option value="desc">Descending</Option>
//               </Select>
//             </Col>
//           </Row>
//         </div>

//         <Tabs defaultActiveKey="1" type="card">
//           <TabPane tab="My Requests" key="1">
//             <Row className="mt-0" style={{ margin: "10px 0" }}>
//               <Col>
//                 <h6>Filter by Status: </h6>
//                 <Checkbox
//                   checked={statusFilters.Pending}
//                   onChange={() => handleStatusFilterChange("Pending")}
//                 >
//                   Pending
//                 </Checkbox>
//                 <Checkbox
//                   checked={statusFilters.Browsed}
//                   onChange={() => handleStatusFilterChange("Browsed")}
//                 >
//                   Browsed
//                 </Checkbox>
//                 <Checkbox
//                   checked={statusFilters.Cancel}
//                   onChange={() => handleStatusFilterChange("Cancel")}
//                 >
//                   Cancel
//                 </Checkbox>
//               </Col>
//             </Row>
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
//                           <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div>
//                                   <h3 className="rental-title">
//                                     {req.name} {getStatusBadge(req.status)}
//                                   </h3>
//                                   <div className="text-muted small">
//                                     <DollarSign size={16} /> Price:{" "}
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
//                                   {req.reason && (
//                                     <div className="small">
//                                       <FileText size={16} />{" "}
//                                       <strong style={{ color: "red" }}>
//                                         Reason: {req.reason}
//                                       </strong>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                               {req.status === "Pending" && (
//                                 <Button
//                                   type="primary"
//                                   className="btn-edit"
//                                   onClick={() =>
//                                     handleEditRequest(req.requestId)
//                                   }
//                                 >
//                                   <Eye size={16} /> Edit
//                                 </Button>
//                               )}
//                               <Button
//                                 className="btn-detail"
//                                 onClick={() => handleViewDetail(req.requestId)}
//                               >
//                                 <Eye size={16} /> Request Details
//                               </Button>
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

//           <TabPane tab="My Contract" key="2">
//             <Row className="mt-0" style={{ margin: "10px 0" }}>
//               <Col>
//                 <h6>Filter by Status: </h6>
//                 {Object.keys(contractStatusFilters).map((status) => (
//                   <Checkbox
//                     key={status}
//                     checked={contractStatusFilters[status]}
//                     onChange={() => handleContractStatusFilterChange(status)}
//                   >
//                     {status}
//                   </Checkbox>
//                 ))}
//               </Col>
//             </Row>
//             {loading ? (
//               <Spin tip="Loading..." />
//             ) : currentDepositItems.length === 0 ? (
//               <p className="text-center">
//                 No contracts found for the selected statuses. Please adjust the
//                 filters or wait for admin to create contracts.
//               </p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentDepositItems.map((contract) => (
//                     <Col key={contract.contractId} xs={12}>
//                       <Card className="rental-card shadow">
//                         <Card.Body>
//                           <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div>
//                                   <h3 className="rental-title">
//                                     {contract.contractName}{" "}
//                                     {getStatusBadge(contract.status)}
//                                   </h3>
//                                   <div className="text-muted small">
//                                     <User size={16} /> Contract Owner:{" "}
//                                     {contract.createBy}
//                                   </div>

//                                   <div className="text-muted small">
//                                     <DollarSign size={16} /> Deposit:{" "}
//                                     {(contract.deposit || 0).toLocaleString()}{" "}
//                                     VND
//                                   </div>
//                                   <div className="text-muted small">
//                                     <DollarSign size={16} /> Total Hire Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small">
//                                     <DollarSign size={16} /> Refund Amount:{" "}
//                                     {(contract.amount || 0).toLocaleString()}{" "}
//                                     VND
//                                   </div>
//                                   <div className="text-muted small">
//                                     <Calendar size={16} /> Start Date:{" "}
//                                     {contract.startDate}
//                                   </div>
//                                   <div className="text-muted small">
//                                     <Calendar size={16} /> Return Date:{" "}
//                                     {contract.endDate}
//                                   </div>
//                                   <div className="text-muted small">
//                                     <Calendar size={16} /> Created Date:{" "}
//                                     {contract.createDate}
//                                   </div>

//                                   {contract.reason && (
//                                     <div className="text-muted small">
//                                       <FileText size={16} />{" "}
//                                       <strong style={{ color: "red" }}>
//                                         Reason: {contract.reason}
//                                       </strong>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                               {contract.status === "Refund" && (
//                                 <i>Refund Processing</i>
//                               )}
//                               {contract.status === "Created" && (
//                                 <Button
//                                   className="btn-deposit"
//                                   onClick={() => handlePayment(contract)}
//                                 >
//                                   <DollarSign size={16} /> Pay Now
//                                 </Button>
//                               )}
//                               <Button
//                                 className="btn-detail"
//                                 onClick={() =>
//                                   handleViewDetail(contract.requestId)
//                                 }
//                               >
//                                 <Eye size={16} /> Request Details
//                               </Button>
//                               {contract.status !== "Created" && (
//                                 <Button
//                                   type="default"
//                                   onClick={() =>
//                                     handleViewDelivery(contract.contractId)
//                                   }
//                                 >
//                                   <Eye size={16} /> View Delivery
//                                 </Button>
//                               )}

//                               <Button
//                                 className="btn-pdf"
//                                 disabled={!contract.urlPdf}
//                                 onClick={() =>
//                                   window.open(contract.urlPdf, "_blank")
//                                 }
//                               >
//                                 <File size={16} /> View Contract PDF
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

//           <TabPane tab="My Refunds" key="3">
//             <Row className="mt-0" style={{ margin: "10px 0" }}>
//               <Col>
//                 <h6>Filter by Status: </h6>
//                 <Checkbox
//                   checked={refundStatusFilters.Pending}
//                   onChange={() => handleRefundStatusFilterChange("Pending")}
//                 >
//                   Pending
//                 </Checkbox>
//                 <Checkbox
//                   checked={refundStatusFilters.Paid}
//                   onChange={() => handleRefundStatusFilterChange("Paid")}
//                 >
//                   Paid
//                 </Checkbox>
//               </Col>
//             </Row>
//             {loading ? (
//               <Spin tip="Loading..." />
//             ) : currentRefundItems.length === 0 ? (
//               <p className="text-center">No refunds found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentRefundItems.map((refund) => {
//                     const contract = contracts.find(
//                       (c) => c.contractId === refund.contractId
//                     );
//                     return (
//                       <Col key={refund.contractRefundId} xs={12}>
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
//                                       {" "}
//                                       Refund Status{" "}
//                                       {getStatusBadge(refund.status)}
//                                     </h3>
//                                     <div className="text-muted small">
//                                       <DollarSign size={16} /> Price Damage:{" "}
//                                       {(refund.price || 0).toLocaleString()} VND
//                                     </div>
//                                     <div className="text-muted small">
//                                       <DollarSign size={16} /> Refund Amount:{" "}
//                                       {(refund.amount || 0).toLocaleString()}
//                                     </div>
//                                     <div className="text-muted small">
//                                       <FileText size={16} /> Description:{" "}
//                                       {refund.description || "N/A"}
//                                     </div>

//                                     <div className="text-muted small">
//                                       <Calendar size={16} /> Created Date:{" "}
//                                       {refund.createDate}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                               <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                                 <ViewRefund refund={refund} />
//                                 {refund.status === "Pending" && (
//                                   <EditRefund refund={refund} />
//                                 )}
//                               </div>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     );
//                   })}
//                 </Row>
//                 <Pagination
//                   current={currentRefundPage}
//                   pageSize={itemsPerPage}
//                   total={filteredRefunds.length}
//                   onChange={(page) => setCurrentRefundPage(page)}
//                   showSizeChanger={false}
//                   style={{ marginTop: "20px", textAlign: "right" }}
//                 />
//               </>
//             )}
//           </TabPane>
//         </Tabs>

//         <EditRentalCostume
//           visible={isEditModalVisible}
//           onCancel={() => setIsEditModalVisible(false)}
//           onSubmit={handleSubmitEdit}
//           modalData={modalData}
//           setModalData={setModalData}
//           selectedRequestId={selectedRequestId}
//           currentCharacterPage={currentCharacterPage}
//           setCurrentCharacterPage={setCurrentCharacterPage}
//           charactersPerPage={charactersPerPage}
//         />

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
//           title="Refund"
//           open={isRefundModalVisible}
//           onOk={handleRefundConfirm}
//           onCancel={() => setIsRefundModalVisible(false)}
//           okText="Submit Refund"
//           confirmLoading={loading}
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
//             <Form.Group className="mb-3">
//               <Form.Label>Price (VND)</Form.Label>
//               <Input
//                 type="number"
//                 value={refundData.price}
//                 onChange={(e) =>
//                   setRefundData({ ...refundData, price: e.target.value })
//                 }
//                 min="0"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <TextArea
//                 rows={3}
//                 value={refundData.description}
//                 onChange={(e) =>
//                   setRefundData({ ...refundData, description: e.target.value })
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
//           style={{ width: "70%" }}
//         />

//         <ViewDeliveryRentalCostume
//           visible={isDeliveryModalVisible}
//           onCancel={handleCloseDeliveryModal}
//           contractId={selectedContractId}
//         />
//       </Container>
//       <MyCustomerCharacter />
//     </div>
//   );
// };

// export default MyRentalCostume;

// them cancelcontract ====================================================================================================
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import {
  Pagination,
  Modal,
  Input,
  Button,
  Tabs,
  Spin,
  DatePicker,
  Select,
  Checkbox,
} from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyRentalCostume.scss";
import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";
import PaymentService from "../../services/PaymentService/PaymentService.js";
import RefundService from "../../services/RefundService/RefundService.js";
import { FileText, DollarSign, Calendar, Eye, File, User } from "lucide-react";
import dayjs from "dayjs";
import { useDebounce } from "use-debounce";
import MyCustomerCharacter from "../MyCustomerCharacterPage/MyCustomerCharacter.js";
import ViewMyRentalCostume from "./ViewMyRentalCostume";
import { useParams } from "react-router-dom";
import EditRentalCostume from "./EditRentalCostume";
import ViewDeliveryRentalCostume from "./ViewDeliveryRentalCostume";
import ViewRefund from "./ViewRefund";
import EditRefund from "./EditRefund";

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const MyRentalCostume = () => {
  const { id: accountId } = useParams();
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [refunds, setRefunds] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [filteredDepositContracts, setFilteredDepositContracts] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentDepositPage, setCurrentDepositPage] = useState(1);
  const [currentRefundPage, setCurrentRefundPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [cancelContractId, setCancelContractId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
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
    price: "",
    description: "",
  });
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
  const [sortField, setSortField] = useState("normal");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilters, setStatusFilters] = useState({
    Pending: true,
    Browsed: true,
    Cancel: true,
  });
  const [contractStatusFilters, setContractStatusFilters] = useState({
    Cancel: true,
    Created: true,
    Deposited: true,
    Refund: true,
    Completed: true,
    Expired: true,
    RefundOverdue: true,
  });
  const [refundStatusFilters, setRefundStatusFilters] = useState({
    Pending: true,
    Paid: true,
  });

  const itemsPerPage = 5;
  const charactersPerPage = 2;

  const formatDate = (date) => {
    if (!date || date === "null" || date === "undefined" || date === "") {
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
    return parsedDate.isValid()
      ? parsedDate.format("DD/MM/YYYY")
      : "Invalid Date";
  };

  const sortData = (data, field, order) => {
    if (field === "normal") {
      return [...data]; // Return data as-is, no sorting
    }
    return [...data].sort((a, b) => {
      let valueA, valueB;
      if (field === "price") {
        valueA = a.price || 0;
        valueB = b.price || 0;
      } else if (field === "deposit") {
        valueA = a.deposit || 0;
        valueB = b.deposit || 0;
      }
      return order === "asc" ? valueA - valueB : valueB - valueA;
    });
  };

  const getRequestByRequestId = async (id) => {
    try {
      const response = await MyRentalCostumeService.getRequestByRequestId(id);
      return response;
    } catch (error) {
      console.error("Error fetching request details:", error);
      throw error;
    }
  };

  const handleCancelContract = (contractId) => {
    setCancelContractId(contractId);
    setCancelReason("");
    setIsCancelModalVisible(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation!");
      return;
    }
    setLoading(true);
    try {
      const encodedReason = encodeURIComponent(cancelReason);
      await MyRentalCostumeService.cancelContract(
        cancelContractId,
        encodedReason
      );
      toast.success("Contract canceled successfully!");
      const contractData =
        await MyRentalCostumeService.getAllContractByAccountId(accountId);
      const formattedContracts = Array.isArray(contractData)
        ? contractData.map((contract) => ({
            ...contract,
            startDate: formatDate(contract.startDate),
            endDate: formatDate(contract.endDate),
            price: contract.price || 0,
            deposit: contract.deposit || 0,
            amount: contract.amount || 0,
            reason: contract.reason || null,
          }))
        : [];
      setContracts(formattedContracts);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to cancel contract. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setIsCancelModalVisible(false);
      setCancelContractId(null);
      setCancelReason("");
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await MyRentalCostumeService.GetAllRequestByAccountId(
          accountId
        );
        const requestsArray = Array.isArray(data) ? data : [];
        const formattedRequests = requestsArray
          .filter((request) => request?.serviceId === "S001")
          .map((request) => ({
            ...request,
            startDate: formatDate(request.startDate),
            endDate: formatDate(request.endDate),
            price: request.price || 0,
            deposit: request.deposit || 0,
            charactersListResponse: request.charactersListResponse || [],
          }));
        setRequests(formattedRequests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error(
          error.response?.data?.message || "Failed to load requests."
        );
      } finally {
        setLoading(false);
      }
    };
    if (accountId) fetchRequests();
  }, [accountId]);

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const data = await MyRentalCostumeService.getAllContractByAccountId(
          accountId
        );
        const contractsArray = Array.isArray(data) ? data : [];
        const formattedContracts = contractsArray.map((contract) => ({
          ...contract,
          startDate: formatDate(contract.startDate),
          endDate: formatDate(contract.endDate),
          price: contract.price || 0,
          deposit: contract.deposit || 0,
          amount: contract.amount || 0,
          reason: contract.reason || null,
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
    if (accountId) fetchContracts();
  }, [accountId]);

  useEffect(() => {
    const fetchRefunds = async () => {
      setLoading(true);
      try {
        const data = await RefundService.getAllContractRefundByAccountId(
          accountId
        );
        const refundsArray = Array.isArray(data) ? data : [];
        const formattedRefunds = refundsArray.map((refund) => ({
          ...refund,
          createDate: formatDate(refund.createDate),
          updateDate: formatDate(refund.updateDate),
          price: refund.price || 0,
        }));
        setRefunds(formattedRefunds);
      } catch (error) {
        console.error("Failed to fetch refunds:", error);
        toast.error(error.response?.data?.message || "Failed to load refunds.");
      } finally {
        setLoading(false);
      }
    };
    if (accountId) fetchRefunds();
  }, [accountId]);

  useEffect(() => {
    const contractRequestIds = contracts
      .filter((contract) => contract)
      .map((contract) => contract.requestId);
    let filtered = requests
      .filter((request) => !contractRequestIds.includes(request.requestId))
      .filter(
        (request) =>
          (request?.name?.toLowerCase?.() || "").includes(
            debouncedSearchTerm.toLowerCase()
          ) || (request?.startDate || "").includes(debouncedSearchTerm)
      );
    filtered = filtered.filter((request) => statusFilters[request.status]);
    filtered = sortData(filtered, sortField, sortOrder);
    setFilteredPendingRequests(filtered);
    setCurrentPendingPage(1);
  }, [
    debouncedSearchTerm,
    requests,
    contracts,
    sortField,
    sortOrder,
    statusFilters,
  ]);

  useEffect(() => {
    const filterDepositContracts = async () => {
      setLoading(true);
      try {
        const data = await MyRentalCostumeService.getAllContractByAccountId(
          accountId
        );
        const contractsArray = Array.isArray(data) ? data : [];
        const filtered = await Promise.all(
          contractsArray.map(async (contract) => {
            try {
              const request = await getRequestByRequestId(contract.requestId);
              if (request.serviceId === "S001") {
                return {
                  ...contract,
                  startDate: formatDate(contract.startDate),
                  endDate: formatDate(contract.endDate),
                  price: contract.price || 0,
                  deposit: contract.deposit || request.deposit || 0,
                  reason: contract.reason
                    ? contract.reason.trim().toLowerCase()
                    : "",
                  amount: contract.amount || 0,
                  createBy: contract.createBy || "",
                  createDate: formatDate(contract.createDate) || "",
                };
              }
              return null;
            } catch (error) {
              console.error(
                `Error fetching request ${contract.requestId}:`,
                error
              );
              return null;
            }
          })
        );
        let validContracts = filtered
          .filter((contract) => contract !== null)
          .filter(
            (contract) =>
              (contract?.contractName?.toLowerCase?.() || "").includes(
                debouncedSearchTerm.toLowerCase()
              ) || (contract?.startDate || "").includes(debouncedSearchTerm)
          )
          .filter((contract) => contractStatusFilters[contract.status]);
        validContracts = sortData(validContracts, sortField, sortOrder);
        setFilteredDepositContracts(validContracts);
        setCurrentDepositPage(1);
      } catch (error) {
        console.error("Failed to fetch deposit contracts:", error);
        toast.error("Failed to load deposit contracts.");
      } finally {
        setLoading(false);
      }
    };
    if (accountId) filterDepositContracts();
  }, [
    debouncedSearchTerm,
    accountId,
    sortField,
    sortOrder,
    contractStatusFilters,
  ]);

  useEffect(() => {
    let filtered = refunds
      .filter(
        (refund) =>
          (refund?.description?.toLowerCase?.() || "").includes(
            debouncedSearchTerm.toLowerCase()
          ) || (refund?.createDate || "").includes(debouncedSearchTerm)
      )
      .filter((refund) => refundStatusFilters[refund.status]);
    filtered = sortData(filtered, sortField, sortOrder);
    setFilteredRefunds(filtered);
    setCurrentRefundPage(1);
  }, [debouncedSearchTerm, refunds, sortField, sortOrder, refundStatusFilters]);

  const paginate = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  const handleContractStatusFilterChange = (status) => {
    setContractStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleRefundStatusFilterChange = (status) => {
    setRefundStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleEditRequest = async (requestId) => {
    setLoading(true);
    setSelectedRequestId(requestId);
    try {
      const requestDetails = await getRequestByRequestId(requestId);

      // Kiểm tra trạng thái của request
      const requestStatus = requestDetails.status;
      if (requestStatus === "Browsed") {
        setIsEditModalVisible(false);
        toast.info("Status request has changed, please reload the page!");
        setLoading(false);
        return;
      } else if (requestStatus === "Pending") {
        setIsEditModalVisible(true);
      } else {
        // Xử lý các trạng thái khác nếu cần
        setIsEditModalVisible(false);
        toast.warn("Request status does not allow editing.");
        setLoading(false);
        return;
      }

      const characters = requestDetails.charactersListResponse || [];

      const characterDetailsPromises = characters.map(async (char) => {
        const characterData = await MyRentalCostumeService.getCharacterById(
          char.characterId
        );
        return {
          characterId: char.characterId,
          characterName: characterData.characterName || "",
          maxHeight: characterData.maxHeight || 0,
          maxWeight: characterData.maxWeight || 0,
          minHeight: characterData.minHeight || 0,
          minWeight: characterData.minWeight || 0,
          quantity: char.quantity || 0,
          urlImage: characterData.images?.[0]?.urlImage || "",
          description: characterData.description || "",
          price: characterData.price || 0,
          maxQuantity: characterData.maxQuantity || 10,
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
          price: requestDetails.price || 0,
          deposit: requestDetails.deposit || 0,
        },
      });

      setCurrentCharacterPage(1);
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      toast.error("Failed to load request details.");
      setIsEditModalVisible(false); // Đảm bảo modal không hiển thị nếu có lỗi
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitEdit = (
    response,
    newPrice,
    formattedStartDate,
    formattedEndDate,
    deposit
  ) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.requestId === selectedRequestId
          ? {
              ...req,
              price: newPrice,
              charactersListResponse:
                response.charactersListResponse || req.charactersListResponse,
              startDate: formattedStartDate,
              endDate: formattedEndDate,
              deposit: deposit,
            }
          : req
      )
    );
    setIsEditModalVisible(false);
  };

  const handleViewDetail = (requestId) => {
    setSelectedRequestId(requestId);
    setIsDetailModalVisible(true);
  };

  const handlePayment = async (contract) => {
    setSelectedContractId(contract.contractId);
    try {
      const requestDetails = await getRequestByRequestId(contract.requestId);
      setPaymentAmount(requestDetails.deposit || 0);
      setIsPaymentModalVisible(true);
    } catch (error) {
      console.error("Error fetching deposit:", error);
      toast.error("Failed to retrieve deposit amount.");
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
        fullName: "User",
        orderInfo: `Deposit for ${modalData.name || "Costume Rental"}`,
        amount: paymentAmount,
        purpose: 1,
        accountId: accountId,
        contractId: selectedContractId,
        isWeb: true,
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
              price: contract.price || 0,
              deposit: contract.deposit || 0,
              amount: contract.amount || 0,
              reason: contract.reason || null,
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

  const handleViewDelivery = (contractId) => {
    setSelectedContractId(contractId);
    setIsDeliveryModalVisible(true);
  };

  const handleCloseDeliveryModal = () => {
    setIsDeliveryModalVisible(false);
    setSelectedContractId(null);
  };

  const handleRefundRequest = (contract) => {
    setSelectedContractId(contract.contractId);
    setIsRefundModalVisible(true);
  };

  const handleRefundConfirm = async () => {
    const { bankAccount, bankName, price, description } = refundData;
    if (
      !bankAccount.trim() ||
      !bankName.trim() ||
      !price ||
      !description.trim()
    ) {
      toast.error(
        "Bank account, bank name, price, and description are required!"
      );
      return;
    }
    setLoading(true);
    try {
      await RefundService.sendRefund(selectedContractId, price, description);
      const updatedRefunds =
        await RefundService.getAllContractRefundByAccountId(accountId);
      setRefunds(
        Array.isArray(updatedRefunds)
          ? updatedRefunds.map((refund) => ({
              ...refund,
              createDate: formatDate(refund.createDate),
              updateDate: formatDate(refund.updateDate),
              price: refund.price || 0,
            }))
          : []
      );
      toast.success("Refund request submitted!");
      setIsRefundModalVisible(false);
      setRefundData({
        bankAccount: "",
        bankName: "",
        price: "",
        description: "",
      });
      setSelectedContractId(null);
    } catch (error) {
      console.error("Error submitting refund:", error);
      toast.error("Failed to submit refund request.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Cancel: "danger",
      Active: "warning",
      Created: "warning",
      Deposited: "success",
      Refund: "info",
      Completed: "success",
      Paid: "success",
      Expired: "danger",
      RefundOverdue: "warning",
    };
    return <Badge bg={statusColors[status] || "warning"}>{status}</Badge>;
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
    filteredRefunds,
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
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by name, date, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </Col>
            <Col md={3}>
              <Select
                style={{ width: "100%" }}
                value={sortField}
                onChange={(value) => setSortField(value)}
              >
                <Option value="normal">Normal</Option>
                <Option value="price">Sort by Price</Option>
                <Option value="deposit">Sort by Deposit</Option>
              </Select>
            </Col>
            <Col md={3}>
              <Select
                style={{ width: "100%" }}
                value={sortOrder}
                onChange={(value) => setSortOrder(value)}
              >
                <Option value="asc">Ascending</Option>
                <Option value="desc">Descending</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="My Requests" key="1">
            <Row className="mt-0" style={{ margin: "10px 0" }}>
              <Col>
                <h6>Filter by Status: </h6>
                <Checkbox
                  checked={statusFilters.Pending}
                  onChange={() => handleStatusFilterChange("Pending")}
                >
                  Pending
                </Checkbox>
                <Checkbox
                  checked={statusFilters.Browsed}
                  onChange={() => handleStatusFilterChange("Browsed")}
                >
                  Browsed
                </Checkbox>
                <Checkbox
                  checked={statusFilters.Cancel}
                  onChange={() => handleStatusFilterChange("Cancel")}
                >
                  Cancel
                </Checkbox>
              </Col>
            </Row>
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
                                  <div className="text-muted small">
                                    <DollarSign size={16} /> Price:{" "}
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
                                  {req.reason && (
                                    <div className="small">
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
                              {req.status === "Pending" && (
                                <Button
                                  type="primary"
                                  className="btn-edit"
                                  onClick={() =>
                                    handleEditRequest(req.requestId)
                                  }
                                >
                                  <Eye size={16} /> Edit
                                </Button>
                              )}
                              <Button
                                className="btn-detail"
                                onClick={() => handleViewDetail(req.requestId)}
                              >
                                <Eye size={16} /> Request Details
                              </Button>
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

          <TabPane tab="My Contract" key="2">
            <Row className="mt-0" style={{ margin: "10px 0" }}>
              <Col>
                <h6>Filter by Status: </h6>
                {Object.keys(contractStatusFilters).map((status) => (
                  <Checkbox
                    key={status}
                    checked={contractStatusFilters[status]}
                    onChange={() => handleContractStatusFilterChange(status)}
                  >
                    {status}
                  </Checkbox>
                ))}
              </Col>
            </Row>
            {loading ? (
              <Spin tip="Loading..." />
            ) : currentDepositItems.length === 0 ? (
              <p className="text-center">
                No contracts found for the selected statuses. Please adjust the
                filters or wait for admin to create contracts.
              </p>
            ) : (
              <>
                <Row className="g-4">
                  {currentDepositItems.map((contract) => (
                    <Col key={contract.contractId} xs={12}>
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
                                    {contract.contractName}{" "}
                                    {getStatusBadge(contract.status)}
                                  </h3>
                                  <div className="text-muted small">
                                    <User size={16} /> Contract Owner:{" "}
                                    {contract.createBy}
                                  </div>
                                  <div className="text-muted small">
                                    <DollarSign size={16} /> Deposit:{" "}
                                    {(contract.deposit || 0).toLocaleString()}{" "}
                                    VND
                                  </div>
                                  <div className="text-muted small">
                                    <DollarSign size={16} /> Total Hire Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small">
                                    <DollarSign size={16} /> Refund Amount:{" "}
                                    {(contract.amount || 0).toLocaleString()}{" "}
                                    VND
                                  </div>
                                  <div className="text-muted small">
                                    <Calendar size={16} /> Start Date:{" "}
                                    {contract.startDate}
                                  </div>
                                  <div className="text-muted small">
                                    <Calendar size={16} /> Return Date:{" "}
                                    {contract.endDate}
                                  </div>
                                  <div className="text-muted small">
                                    <Calendar size={16} /> Created Date:{" "}
                                    {contract.createDate}
                                  </div>
                                  {contract.reason && (
                                    <div className="text-muted small">
                                      <FileText size={16} />{" "}
                                      <strong style={{ color: "red" }}>
                                        Reason: {contract.reason}
                                      </strong>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                              {contract.status === "Refund" && (
                                <i>Refund Processing</i>
                              )}
                              {contract.status === "Created" && (
                                <>
                                  <Button
                                    className="btn-deposit"
                                    onClick={() => handlePayment(contract)}
                                  >
                                    <DollarSign size={16} /> Pay Now
                                  </Button>
                                </>
                              )}
                              <Button
                                className="btn-detail"
                                onClick={() =>
                                  handleViewDetail(contract.requestId)
                                }
                              >
                                <Eye size={16} /> Request Details
                              </Button>
                              {contract.status !== "Created" && (
                                <Button
                                  type="default"
                                  onClick={() =>
                                    handleViewDelivery(contract.contractId)
                                  }
                                >
                                  <Eye size={16} /> View Delivery
                                </Button>
                              )}
                              <Button
                                className="btn-pdf"
                                disabled={!contract.urlPdf}
                                onClick={() =>
                                  window.open(contract.urlPdf, "_blank")
                                }
                              >
                                <File size={16} /> View Contract PDF
                              </Button>
                              {contract.status === "Created" && (
                                <>
                                  <Button
                                    type="default"
                                    className="btn-cancel btn-outline-danger"
                                    onClick={() =>
                                      handleCancelContract(contract.contractId)
                                    }
                                    aria-label="Cancel Contract"
                                  >
                                    <FileText size={16} className="me-1" />
                                    Cancel Contract
                                  </Button>
                                </>
                              )}
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

          <TabPane tab="My Refunds" key="3">
            <Row className="mt-0" style={{ margin: "10px 0" }}>
              <Col>
                <h6>Filter by Status: </h6>
                <Checkbox
                  checked={refundStatusFilters.Pending}
                  onChange={() => handleRefundStatusFilterChange("Pending")}
                >
                  Pending
                </Checkbox>
                <Checkbox
                  checked={refundStatusFilters.Paid}
                  onChange={() => handleRefundStatusFilterChange("Paid")}
                >
                  Paid
                </Checkbox>
              </Col>
            </Row>
            {loading ? (
              <Spin tip="Loading..." />
            ) : currentRefundItems.length === 0 ? (
              <p className="text-center">No refunds found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentRefundItems.map((refund) => {
                    const contract = contracts.find(
                      (c) => c.contractId === refund.contractId
                    );
                    return (
                      <Col key={refund.contractRefundId} xs={12}>
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
                                      Refund Status{" "}
                                      {getStatusBadge(refund.status)}
                                    </h3>
                                    <div className="text-muted small">
                                      <DollarSign size={16} /> Price Damage:{" "}
                                      {(refund.price || 0).toLocaleString()} VND
                                    </div>
                                    <div className="text-muted small">
                                      <DollarSign size={16} /> Refund Amount:{" "}
                                      {(refund.amount || 0).toLocaleString()}
                                    </div>
                                    <div className="text-muted small">
                                      <FileText size={16} /> Description:{" "}
                                      {refund.description || "N/A"}
                                    </div>
                                    <div className="text-muted small">
                                      <Calendar size={16} /> Created Date:{" "}
                                      {refund.createDate}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                                <ViewRefund refund={refund} />
                                {refund.status === "Pending" && (
                                  <EditRefund refund={refund} />
                                )}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
                <Pagination
                  current={currentRefundPage}
                  pageSize={itemsPerPage}
                  total={filteredRefunds.length}
                  onChange={(page) => setCurrentRefundPage(page)}
                  showSizeChanger={false}
                  style={{ marginTop: "20px", textAlign: "right" }}
                />
              </>
            )}
          </TabPane>
        </Tabs>

        <EditRentalCostume
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          onSubmit={handleSubmitEdit}
          modalData={modalData}
          setModalData={setModalData}
          selectedRequestId={selectedRequestId}
          currentCharacterPage={currentCharacterPage}
          setCurrentCharacterPage={setCurrentCharacterPage}
          charactersPerPage={charactersPerPage}
        />

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
          title="Refund"
          open={isRefundModalVisible}
          onOk={handleRefundConfirm}
          onCancel={() => setIsRefundModalVisible(false)}
          okText="Submit Refund"
          confirmLoading={loading}
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
            <Form.Group className="mb-3">
              <Form.Label>Price (VND)</Form.Label>
              <Input
                type="number"
                value={refundData.price}
                onChange={(e) =>
                  setRefundData({ ...refundData, price: e.target.value })
                }
                min="0"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <TextArea
                rows={3}
                value={refundData.description}
                onChange={(e) =>
                  setRefundData({ ...refundData, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal>

        <Modal
          title="Cancel Contract"
          open={isCancelModalVisible}
          onOk={handleCancelConfirm}
          onCancel={() => {
            setIsCancelModalVisible(false);
            setCancelContractId(null);
            setCancelReason("");
          }}
          okText="Confirm Cancel"
          cancelText="Close"
          confirmLoading={loading}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Reason for Cancellation</strong>
              </Form.Label>
              <TextArea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide the reason for canceling the contract"
                rows={4}
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

        <ViewDeliveryRentalCostume
          visible={isDeliveryModalVisible}
          onCancel={handleCloseDeliveryModal}
          contractId={selectedContractId}
        />
      </Container>
      <MyCustomerCharacter />
    </div>
  );
};

export default MyRentalCostume;
