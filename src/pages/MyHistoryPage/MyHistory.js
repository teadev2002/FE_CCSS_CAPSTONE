// // loc full tab =========================================================================
// import React, { useState, useEffect, useRef } from "react";
// import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
// import {
//   Pagination,
//   Modal,
//   Input,
//   List,
//   Button,
//   Radio,
//   message,
//   Tabs,
//   Select,
//   Checkbox,
//   Flex,
//   Spin,
//   Rate,
// } from "antd";
// import { LoadingOutlined } from "@ant-design/icons";
// import { useParams } from "react-router-dom";

// import {
//   FileText,
//   DollarSign,
//   Calendar,
//   CreditCard,
//   Banknote,
//   Star,
//   Edit,
//   MapPin,
// } from "lucide-react";
// import MyHistoryService from "../../services/HistoryService/MyHistoryService";
// import EditRequestHireCosplayer from "./EditRequestHireCosplayer";
// import PaymentService from "../../services/PaymentService/PaymentService.js";
// import ViewMyRentCos from "./ViewMyRentCos.js";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyHistory.scss";
// import dayjs from "dayjs";
// import FeedbackHireCosplayer from "./FeedbackHireCosplayer";

// const { TextArea } = Input;
// const { TabPane } = Tabs;
// const { Option } = Select;

// const MyHistory = () => {
//   const { id: accountId } = useParams();
//   const [requests, setRequests] = useState([]);
//   const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
//   const [contracts, setContracts] = useState([]);
//   const [filteredContracts, setFilteredContracts] = useState([]);
//   const [progressingContracts, setProgressingContracts] = useState([]);
//   const [filteredProgressingContracts, setFilteredProgressingContracts] =
//     useState([]);
//   const [completedContracts, setCompletedContracts] = useState([]);
//   const [filteredCompletedContracts, setFilteredCompletedContracts] = useState(
//     []
//   );
//   const [loading, setLoading] = useState(false);
//   const [currentPendingPage, setCurrentPendingPage] = useState(1);
//   const [currentContractPage, setCurrentContractPage] = useState(1);
//   const [currentProgressingPage, setCurrentProgressingPage] = useState(1);
//   const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("normal");
//   const [statusFilter, setStatusFilter] = useState([
//     "Pending",
//     "Browsed",
//     "Cancel",
//   ]);
//   const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
//   const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
//   const [isCompletePaymentModalVisible, setIsCompletePaymentModalVisible] =
//     useState(false);
//   const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
//   const [selectedFeedbackData, setSelectedFeedbackData] = useState(null);
//   const [selectedRequestId, setSelectedRequestId] = useState(null);
//   const [depositAmount, setDepositAmount] = useState(null);
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [depositData, setDepositData] = useState({
//     fullName: "",
//     amount: 0,
//     contractId: "",
//   });
//   const [completePaymentData, setCompletePaymentData] = useState({
//     fullName: "",
//     amount: 0,
//     contractId: "",
//   });
//   const [isEditModalVisible, setIsEditModalVisible] = useState(false);
//   const [editRequestId, setEditRequestId] = useState(null);
//   const [isViewFeedbackModalVisible, setIsViewFeedbackModalVisible] =
//     useState(false);
//   const [viewFeedbackData, setViewFeedbackData] = useState({
//     contractId: "",
//     feedbacks: [],
//     cosplayerNames: {},
//   });
//   const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
//   const [cancelContractId, setCancelContractId] = useState(null);
//   const [cancelReason, setCancelReason] = useState("");

//   const isMounted = useRef(true);
//   const cosplayerNameCache = useRef({});
//   const itemsPerPage = 5;

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   // Format date for display
//   const formatDate = (dateTime) => {
//     if (!dateTime) return "N/A";
//     const parsed = dayjs(dateTime, "HH:mm DD/MM/YYYY");
//     return parsed.isValid() ? parsed.format("DD/MM/YYYY") : "N/A";
//   };

//   // Fetch all requests for the account
//   useEffect(() => {
//     const fetchRequests = async () => {
//       if (!accountId) return;
//       setLoading(true);
//       try {
//         const data = await MyHistoryService.GetAllRequestByAccountId(accountId);
//         const requestsArray = Array.isArray(data) ? data : [data];
//         const filteredRequests = requestsArray
//           .filter((request) => request.serviceId === "S002")
//           .map((request) => ({
//             ...request,
//             price: request.price || 0,
//             reason: request.reason || null,
//             startDate: request.startDate || "",
//             endDate: request.endDate || "",
//             charactersListResponse: request.charactersListResponse || [],
//           }));
//         setRequests(filteredRequests);
//       } catch (error) {
//         console.error("Failed to fetch requests:", error);
//         toast.error("Failed to load requests. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, [accountId]);

//   // Fetch all contracts for the account
//   useEffect(() => {
//     const fetchContracts = async () => {
//       if (!accountId || requests.length === 0) return;
//       setLoading(true);
//       try {
//         const data = await MyHistoryService.getAllContractByAccountId(
//           accountId
//         );
//         const contractsArray = Array.isArray(data) ? data : [data];
//         const validRequestIds = requests.map((req) => req.requestId);

//         // Filter contracts and remove duplicates based on requestId
//         const filteredContracts = Array.from(
//           new Map(
//             contractsArray
//               .filter((contract) =>
//                 validRequestIds.includes(contract.requestId)
//               )
//               .map((contract) => [contract.requestId, contract])
//           ).values()
//         );

//         // Categorize contracts by status
//         setContracts(
//           filteredContracts.filter(
//             (c) => c.status === "Created" || c.status === "Cancel"
//           )
//         );
//         setProgressingContracts(
//           filteredContracts.filter((c) => c.status === "Deposited")
//         );
//         setCompletedContracts(
//           filteredContracts.filter(
//             (c) =>
//               c.status === "FinalSettlement" ||
//               c.status === "Completed" ||
//               c.status === "Feedbacked"
//           )
//         );
//       } catch (error) {
//         console.error("Failed to fetch contracts:", error);
//         toast.error("Failed to load contracts. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContracts();
//   }, [accountId, requests]);

//   // Filter pending requests for Tab 1
//   useEffect(() => {
//     // Collect requestIds from all contracts
//     const allContractRequestIds = [
//       ...contracts.map((contract) => contract.requestId),
//       ...progressingContracts.map((contract) => contract.requestId),
//       ...completedContracts.map((contract) => contract.requestId),
//     ];

//     // Use Set to remove duplicates
//     const contractRequestIds = new Set(allContractRequestIds);

//     let filtered = requests
//       // Exclude requests with requestId matching any contract
//       .filter((request) => !contractRequestIds.has(request.requestId))
//       // Filter by searchTerm
//       .filter(
//         (request) =>
//           request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           formatDate(request.startDate).includes(searchTerm)
//       )
//       // Filter by statusFilter
//       .filter((request) => statusFilter.includes(request.status));

//     // Sort based on sortOption
//     if (sortOption !== "normal") {
//       filtered.sort((a, b) => {
//         if (sortOption === "price-desc") {
//           return (b.price || 0) - (a.price || 0);
//         } else if (sortOption === "price-asc") {
//           return (a.price || 0) - (b.price || 0);
//         }
//         return 0;
//       });
//     }

//     setFilteredPendingRequests(filtered);
//     setCurrentPendingPage(1);
//   }, [
//     searchTerm,
//     requests,
//     sortOption,
//     statusFilter,
//     contracts,
//     progressingContracts,
//     completedContracts,
//   ]);

//   // Filter contracts for Tab 2
//   useEffect(() => {
//     const filtered = contracts.filter(
//       (contract) =>
//         (contract.contractName || "")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         formatDate(contract.startDate).includes(searchTerm)
//     );
//     setFilteredContracts(filtered);
//     setCurrentContractPage(1);
//   }, [searchTerm, contracts]);

//   // Filter progressing contracts for Tab 3
//   useEffect(() => {
//     const filtered = progressingContracts.filter(
//       (contract) =>
//         (contract.contractName || "")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         formatDate(contract.startDate).includes(searchTerm)
//     );
//     setFilteredProgressingContracts(filtered);
//     setCurrentProgressingPage(1);
//   }, [searchTerm, progressingContracts]);

//   // Filter completed contracts for Tab 4
//   useEffect(() => {
//     const filtered = completedContracts.filter(
//       (contract) =>
//         (contract.contractName || "")
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         formatDate(contract.startDate).includes(searchTerm)
//     );
//     setFilteredCompletedContracts(filtered);
//     setCurrentCompletedPage(1);
//   }, [searchTerm, completedContracts]);

//   // Pagination calculations
//   const pendingIndexOfLastItem = currentPendingPage * itemsPerPage;
//   const pendingIndexOfFirstItem = pendingIndexOfLastItem - itemsPerPage;
//   const currentPendingItems = filteredPendingRequests.slice(
//     pendingIndexOfFirstItem,
//     pendingIndexOfLastItem
//   );
//   const totalPendingItems = filteredPendingRequests.length;

//   const contractIndexOfLastItem = currentContractPage * itemsPerPage;
//   const contractIndexOfFirstItem = contractIndexOfLastItem - itemsPerPage;
//   const currentContractItems = filteredContracts.slice(
//     contractIndexOfFirstItem,
//     contractIndexOfLastItem
//   );
//   const totalContractItems = filteredContracts.length;

//   const progressingIndexOfLastItem = currentProgressingPage * itemsPerPage;
//   const progressingIndexOfFirstItem = progressingIndexOfLastItem - itemsPerPage;
//   const currentProgressingItems = filteredProgressingContracts.slice(
//     progressingIndexOfFirstItem,
//     progressingIndexOfLastItem
//   );
//   const totalProgressingItems = filteredProgressingContracts.length;

//   const completedIndexOfLastItem = currentCompletedPage * itemsPerPage;
//   const completedIndexOfFirstItem = completedIndexOfLastItem - itemsPerPage;
//   const currentCompletedItems = filteredCompletedContracts.slice(
//     completedIndexOfFirstItem,
//     completedIndexOfLastItem
//   );
//   const totalCompletedItems = filteredCompletedContracts.length;

//   // Pagination handlers
//   const handlePendingPageChange = (page) => {
//     setCurrentPendingPage(page);
//   };

//   const handleContractPageChange = (page) => {
//     setCurrentContractPage(page);
//   };

//   const handleProgressingPageChange = (page) => {
//     setCurrentProgressingPage(page);
//   };

//   const handleCompletedPageChange = (page) => {
//     setCurrentCompletedPage(page);
//   };

//   // Handle edit request
//   // const handleEditRequest = (requestId) => {
//   //   setEditRequestId(requestId);
//   //   setIsEditModalVisible(true);
//   // };
//   const handleEditRequest = async (requestId) => {
//     setEditRequestId(requestId);
//     try {
//       const requestDetails = await MyHistoryService.getRequestByRequestId(
//         requestId
//       );
//       const requestStatus = requestDetails.status;

//       if (requestStatus === "Browsed") {
//         setIsEditModalVisible(false);
//         toast.info("Status request has changed, please reload the page!");
//       } else if (requestStatus === "Pending") {
//         setIsEditModalVisible(true);
//       } else {
//         setIsEditModalVisible(false);
//         toast.warn("Request status does not allow editing.");
//       }
//     } catch (error) {
//       console.error("Failed to fetch request details:", error);
//       toast.error("Failed to load request details.");
//       setIsEditModalVisible(false);
//     }
//   };
//   // Handle edit success and refresh requests
//   const handleEditSuccess = async () => {
//     setLoading(true);
//     try {
//       const updatedRequest = await MyHistoryService.getRequestByRequestId(
//         editRequestId
//       );
//       if (!updatedRequest) throw new Error("Updated request not found");

//       setRequests((prevRequests) =>
//         prevRequests.map((req) =>
//           req.requestId === editRequestId
//             ? {
//                 ...req,
//                 name: updatedRequest.name || req.name,
//                 description: updatedRequest.description || req.description,
//                 location: updatedRequest.location || req.location,
//                 price: updatedRequest.price || req.price,
//                 status: updatedRequest.status || req.status,
//                 reason: updatedRequest.reason || req.reason,
//                 startDate: updatedRequest.startDate || req.startDate,
//                 endDate: updatedRequest.endDate || req.endDate,
//                 charactersListResponse:
//                   updatedRequest.charactersListResponse ||
//                   req.charactersListResponse,
//               }
//             : req
//         )
//       );

//       toast.success("Request updated successfully!");
//     } catch (error) {
//       console.error("Failed to refresh requests after edit:", error);
//       toast.error("Failed to refresh requests. Please try again.");
//     } finally {
//       setIsEditModalVisible(false);
//       setEditRequestId(null);
//       setLoading(false);
//     }
//   };

//   // Handle feedback for a contract
//   const handleFeedback = async (contractId) => {
//     try {
//       setLoading(true);
//       const contractCharacters = await MyHistoryService.getContractCharacters(
//         contractId
//       );
//       setSelectedFeedbackData({ contractId, contractCharacters });
//       setIsFeedbackModalVisible(true);
//     } catch (error) {
//       console.error("Error fetching contract characters:", error);
//       toast.error("Không thể tải dữ liệu feedback.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Validate feedback data
//   const isValidFeedback = (feedback) => {
//     return (
//       feedback &&
//       typeof feedback.star === "number" &&
//       feedback.star >= 0 &&
//       feedback.star <= 5 &&
//       typeof feedback.accountId === "string"
//     );
//   };

//   // Handle viewing feedback for a contract
//   const handleViewFeedback = async (contractId) => {
//     setLoading(true);
//     try {
//       const { contractId: fetchedContractId, feedbacks } =
//         await MyHistoryService.getFeedbackByContractId(contractId);

//       let failedNameFetches = 0;
//       const namePromises = feedbacks.map(async (feedback) => {
//         if (cosplayerNameCache.current[feedback.accountId]) {
//           return [
//             feedback.accountId,
//             cosplayerNameCache.current[feedback.accountId],
//           ];
//         }
//         try {
//           const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
//             feedback.accountId
//           );
//           const name = cosplayerData?.name || "Unknown";
//           cosplayerNameCache.current[feedback.accountId] = name;
//           return [feedback.accountId, name];
//         } catch (error) {
//           failedNameFetches++;
//           console.warn(
//             `Failed to fetch cosplayer data for ID ${feedback.accountId}:`,
//             error
//           );
//           return [feedback.accountId, "Unknown"];
//         }
//       });
//       const namesArray = await Promise.all(namePromises);
//       const cosplayerNames = Object.fromEntries(namesArray);

//       if (failedNameFetches > 0) {
//         toast.warning(
//           `${failedNameFetches} cosplayer name(s) could not be fetched.`
//         );
//       }

//       setViewFeedbackData({
//         contractId: fetchedContractId,
//         feedbacks,
//         cosplayerNames,
//       });
//       setIsViewFeedbackModalVisible(true);
//     } catch (error) {
//       console.error("Error fetching feedback:", error);
//       toast.error(error.message || "Failed to load feedback.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Process deposit payment
//   useEffect(() => {
//     if (selectedRequestId && depositAmount !== null && paymentLoading) {
//       const processPayment = async () => {
//         try {
//           await MyHistoryService.depositRequest(
//             selectedRequestId,
//             depositAmount
//           );
//           toast.success("Choose Deposit successful!");

//           // Update requests
//           const requestData = await MyHistoryService.GetAllRequestByAccountId(
//             accountId
//           );
//           const filteredRequests = (
//             Array.isArray(requestData) ? requestData : [requestData]
//           )
//             .filter((req) => req.serviceId === "S002")
//             .map((req) => ({
//               ...req,
//               price: req.price || 0,
//               reason: req.reason || null,
//               startDate: req.startDate || "",
//               endDate: req.endDate || "",
//               charactersListResponse: req.charactersListResponse || [],
//             }));
//           setRequests(filteredRequests);

//           // Update contracts
//           const contractData = await MyHistoryService.getAllContractByAccountId(
//             accountId
//           );
//           const validRequestIds = filteredRequests.map((req) => req.requestId);
//           const filteredContracts = (
//             Array.isArray(contractData) ? contractData : [contractData]
//           ).filter((contract) => validRequestIds.includes(contract.requestId));

//           // Remove duplicates
//           const uniqueContracts = Array.from(
//             new Map(filteredContracts.map((c) => [c.requestId, c])).values()
//           );

//           setContracts(
//             uniqueContracts.filter(
//               (c) => c.status === "Created" || c.status === "Cancel"
//             )
//           );
//           setProgressingContracts(
//             uniqueContracts.filter((c) => c.status === "Deposited")
//           );
//           setCompletedContracts(
//             uniqueContracts.filter(
//               (c) =>
//                 c.status === "FinalSettlement" ||
//                 c.status === "Completed" ||
//                 c.status === "Feedbacked"
//             )
//           );
//         } catch (error) {
//           toast.error("Cannot payment, waiting for manager to browsed!");
//         } finally {
//           setPaymentLoading(false);
//           setIsPaymentModalVisible(false);
//           setSelectedRequestId(null);
//           setDepositAmount(null);
//         }
//       };
//       processPayment();
//     }
//   }, [selectedRequestId, depositAmount, paymentLoading, accountId]);

//   // Handle cancel contract
//   const handleCancelContract = (contractId) => {
//     setCancelContractId(contractId);
//     setCancelReason("");
//     setIsCancelModalVisible(true);
//   };

//   // Confirm cancel contract
//   const handleCancelConfirm = async () => {
//     if (!cancelReason.trim()) {
//       toast.error("Please provide a reason for cancellation!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const encodedReason = encodeURIComponent(cancelReason);
//       await MyHistoryService.cancelContract(cancelContractId, encodedReason);
//       toast.success("Contract canceled successfully!");

//       // Update contracts
//       const contractData = await MyHistoryService.getAllContractByAccountId(
//         accountId
//       );
//       const validRequestIds = requests.map((req) => req.requestId);
//       const filteredContracts = (
//         Array.isArray(contractData) ? contractData : [contractData]
//       ).filter((contract) => validRequestIds.includes(contract.requestId));

//       // Remove duplicates
//       const uniqueContracts = Array.from(
//         new Map(filteredContracts.map((c) => [c.requestId, c])).values()
//       );

//       setContracts(
//         uniqueContracts.filter(
//           (c) => c.status === "Created" || c.status === "Cancel"
//         )
//       );
//       setProgressingContracts(
//         uniqueContracts.filter((c) => c.status === "Deposited")
//       );
//       setCompletedContracts(
//         uniqueContracts.filter(
//           (c) =>
//             c.status === "FinalSettlement" ||
//             c.status === "Completed" ||
//             c.status === "Feedbacked"
//         )
//       );
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         "Failed to cancel contract. Please try again.";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//       setIsCancelModalVisible(false);
//       setCancelContractId(null);
//       setCancelReason("");
//     }
//   };

//   // Handle payment selection
//   const handlePayment = (requestId) => {
//     setSelectedRequestId(requestId);
//     setIsPaymentModalVisible(true);
//   };

//   // Confirm payment
//   const handlePaymentConfirm = () => {
//     if (depositAmount === null) {
//       message.warning("Please select a deposit amount.");
//       return;
//     }
//     setPaymentLoading(true);
//   };

//   // Handle deposit payment
//   const handleDepositPayment = (contract) => {
//     setDepositData({
//       fullName: contract.createBy || "",
//       amount:
//         contract.price - (contract.price * (100 - contract.deposit)) / 100,
//       contractId: contract.contractId,
//     });
//     setIsDepositModalVisible(true);
//   };

//   // Confirm deposit payment
//   const handleDepositConfirm = async () => {
//     if (!depositData.fullName.trim()) {
//       toast.error("Full name cannot be empty!");
//       return;
//     }

//     setPaymentLoading(true);
//     try {
//       const paymentRequestData = {
//         fullName: depositData.fullName,
//         orderInfo: "",
//         amount: depositData.amount,
//         purpose: 1,
//         accountId: accountId,
//         ticketId: "",
//         ticketQuantity: "",
//         contractId: depositData.contractId,
//         orderpaymentId: "",
//         isWeb: true,
//       };

//       const paymentUrl = await PaymentService.DepositPayment(
//         paymentRequestData
//       );
//       window.location.href = paymentUrl;
//       toast.success("Redirecting to payment gateway...");
//     } catch (error) {
//       toast.error(error.message || "Failed to process payment!");
//     } finally {
//       setPaymentLoading(false);
//       setIsDepositModalVisible(false);
//     }
//   };

//   // Handle complete contract payment
//   // Handle complete contract payment
//   const handleCompleteContractPayment = async (contract) => {
//     setLoading(true);
//     try {
//       // Fetch tasks for the contract
//       const tasks = await MyHistoryService.getTaskByContractId(
//         contract.contractId
//       );

//       // Check if tasks is an array and all tasks have status "Completed"
//       if (!Array.isArray(tasks)) {
//         throw new Error("Invalid tasks data received.");
//       }

//       const allTasksCompleted = tasks.every(
//         (task) => task.status === "Completed"
//       );

//       if (!allTasksCompleted) {
//         toast.error(
//           "Cannot proceed with payment: Not all tasks are completed."
//         );
//         return;
//       }

//       // If all tasks are completed, proceed to open the payment modal
//       setCompletePaymentData({
//         fullName: contract.createBy || "",
//         amount:
//           contract.price -
//           (contract.price - (contract.price * (100 - contract.deposit)) / 100),
//         contractId: contract.contractId,
//       });
//       setIsCompletePaymentModalVisible(true);
//     } catch (error) {
//       console.error("Error checking tasks for payment:", error);
//       toast.error("Failed to verify tasks. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   // Confirm complete payment
//   const handleCompletePaymentConfirm = async () => {
//     if (!completePaymentData.fullName.trim()) {
//       toast.error("Full name cannot be empty!");
//       return;
//     }

//     setPaymentLoading(true);
//     try {
//       const paymentRequestData = {
//         fullName: completePaymentData.fullName,
//         orderInfo: "",
//         amount: completePaymentData.amount,
//         purpose: 2,
//         accountId: accountId,
//         ticketId: "",
//         ticketQuantity: "",
//         contractId: completePaymentData.contractId,
//         orderpaymentId: "",
//         isWeb: true,
//       };

//       const paymentUrl = await PaymentService.DepositPayment(
//         paymentRequestData
//       );
//       window.location.href = paymentUrl;
//       toast.success("Redirecting to payment gateway...");
//     } catch (error) {
//       toast.error(error.message || "Failed to process payment!");
//     } finally {
//       setPaymentLoading(false);
//       setIsCompletePaymentModalVisible(false);
//     }
//   };

//   // View contract PDF
//   const handleViewContractPdf = (urlPdf) => {
//     if (urlPdf) {
//       window.open(urlPdf, "_blank");
//     } else {
//       toast.error("PDF URL not available for this contract.");
//     }
//   };

//   // Render status badge
//   const getStatusBadge = (status) => {
//     const statusColors = {
//       Pending: "primary",
//       Browsed: "success",
//       Cancel: "danger",
//       Created: "info",
//       Deposited: "warning",
//       Completed: "success",
//       Feedbacked: "success",
//     };
//     return (
//       <Badge bg={statusColors[status] || "secondary"}>
//         {status || "Unknown"}
//       </Badge>
//     );
//   };

//   // Render list of items (used in Tabs 1 and 4)
//   const RenderItemList = ({
//     items,
//     totalItems,
//     currentPage,
//     onPageChange,
//     onAction,
//     actionLabel,
//     actionIcon,
//     onEdit,
//     isCompletedTab = false,
//   }) => {
//     if (loading) {
//       return (
//         <Flex
//           align="center"
//           justify="center"
//           gap="middle"
//           style={{ width: "100%" }}
//         >
//           <Spin
//             indicator={
//               <LoadingOutlined
//                 style={{
//                   fontSize: 100,
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//                 spin
//               />
//             }
//           />
//         </Flex>
//       );
//     }
//     if (items.length === 0) {
//       return <p className="text-center">No items found.</p>;
//     }

//     return (
//       <>
//         <Row className="g-4">
//           {items.map((item) => (
//             <Col key={item.requestId} xs={12}>
//               <Card className="history-card shadow">
//                 <Card.Body>
//                   <div className="d-flex flex-column flex-md-row gap-4">
//                     <div className="flex-grow-1">
//                       <div className="d-flex gap-3">
//                         <div className="icon-circle">
//                           <FileText size={24} />
//                         </div>
//                         <div
//                           className="flex-grow-1"
//                           style={{ marginBottom: "10px" }}
//                         >
//                           <div className="d-flex justify-content-between align-items-start">
//                             <h3 className="history-title mb-0">
//                               {item.name || item.contractName || "N/A"}{" "}
//                               {getStatusBadge(item.status)}
//                             </h3>
//                           </div>
//                           <div>
//                             <DollarSign size={16} className="me-1" />
//                             Total Price: {(
//                               item.price || 0
//                             ).toLocaleString()}{" "}
//                             VND
//                           </div>
//                           <div>
//                             <Calendar size={16} className="me-1" />
//                             Start Date: {formatDate(item.startDate)}
//                           </div>
//                           <div>
//                             <Calendar size={16} className="me-1" />
//                             End Date: {formatDate(item.endDate)}
//                           </div>
//                           {item.location && (
//                             <div>
//                               <MapPin size={16} className="me-1" />
//                               Location: {item.location || "N/A"}
//                             </div>
//                           )}

//                           {item.status === "Cancel" && item.reason && (
//                             <div className="reason-text mt-1">
//                               <FileText size={16} className="me-1" />
//                               Reason: {item.reason}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-md-end">
//                       <div className="d-flex gap-2 justify-content-md-end">
//                         <ViewMyRentCos requestId={item.requestId} />
//                         {item.status === "Pending" && onEdit && (
//                           <Button
//                             className="btn-edit"
//                             onClick={() => onEdit(item.requestId)}
//                           >
//                             <Edit size={16} className="me-1" />
//                             Edit
//                           </Button>
//                         )}
//                         {onAction && (
//                           <Button
//                             className="btn-action"
//                             onClick={() => onAction(item)}
//                           >
//                             {actionIcon}
//                             {actionLabel}
//                           </Button>
//                         )}
//                         {isCompletedTab && item.status === "Completed" && (
//                           <Button
//                             className="btn-feedback"
//                             onClick={() => handleFeedback(item.contractId)}
//                             disabled={item.status === "Feedbacked"}
//                           >
//                             <Star size={16} className="me-1" />
//                             Feedback
//                           </Button>
//                         )}
//                         {isCompletedTab && item.status === "Feedbacked" && (
//                           <Button
//                             className="btn-view-feedback"
//                             onClick={() => handleViewFeedback(item.contractId)}
//                           >
//                             <Star size={16} className="me-1" />
//                             View Feedback
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//         <Row className="mt-5 align-items-center">
//           <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//             <p className="mb-0">
//               Showing{" "}
//               <strong>{currentPage * itemsPerPage - itemsPerPage + 1}</strong>{" "}
//               to{" "}
//               <strong>
//                 {Math.min(currentPage * itemsPerPage, totalItems)}
//               </strong>{" "}
//               of <strong>{totalItems}</strong> results
//             </p>
//           </Col>
//           <Col xs={12} sm={6} className="d-flex justify-content-end">
//             <Pagination
//               current={currentPage}
//               pageSize={itemsPerPage}
//               total={totalItems}
//               onChange={onPageChange}
//               showSizeChanger={false}
//             />
//           </Col>
//         </Row>
//       </>
//     );
//   };
//   return (
//     <div className="my-history bg-light min-vh-100">
//       <Container className="py-5">
//         <h1 className="text-center mb-5 fw-bold title-my-history">
//           <span>My History Rental Cosplayers</span>
//         </h1>

//         {/* Filter Section */}
//         <div className="filter-section bg-white p-4 rounded shadow mb-5">
//           <Row className="align-items-center g-3">
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

//         {/* Tabs */}
//         <Tabs defaultActiveKey="1" type="card">
//           <TabPane tab="Confirm Pending" key="1">
//             <Row
//               className="align-items-center g-3"
//               style={{ marginBottom: "20px" }}
//             >
//               <Col md={3}>
//                 <Select
//                   style={{ width: "100%" }}
//                   value={sortOption}
//                   onChange={(value) => setSortOption(value)}
//                 >
//                   <Option value="normal">Normal</Option>
//                   <Option value="price-desc">Price: High to Low</Option>
//                   <Option value="price-asc">Price: Low to High</Option>
//                 </Select>
//               </Col>
//               <Col md={6}>
//                 <Checkbox.Group
//                   options={[
//                     { label: "Pending", value: "Pending" },
//                     { label: "Browsed", value: "Browsed" },
//                     { label: "Cancel", value: "Cancel" },
//                   ]}
//                   value={statusFilter}
//                   onChange={(checkedValues) =>
//                     setStatusFilter(
//                       checkedValues.length
//                         ? checkedValues
//                         : ["Pending", "Browsed", "Cancel"]
//                     )
//                   }
//                 />
//               </Col>
//             </Row>
//             <RenderItemList
//               items={currentPendingItems}
//               totalItems={totalPendingItems}
//               currentPage={currentPendingPage}
//               onPageChange={handlePendingPageChange}
//               onEdit={handleEditRequest}
//             />
//           </TabPane>
//           <TabPane tab="Pay Contract Deposit" key="2">
//             {loading ? (
//               <Flex align="center" gap="middle">
//                 <Spin
//                   indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />}
//                 />
//               </Flex>
//             ) : currentContractItems.length === 0 ? (
//               <p className="text-center">No contracts found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentContractItems.map((contract) => (
//                     <Col key={contract.requestId} xs={12}>
//                       <Card className="history-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="history-title mb-0">
//                                       {contract.contractName || "N/A"}{" "}
//                                       {getStatusBadge(contract.status)}
//                                     </h3>
//                                   </div>
//                                   <div>
//                                     <DollarSign size={16} className="me-1" />
//                                     Total Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div>
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date: {formatDate(contract.startDate)}
//                                   </div>
//                                   <div>
//                                     <Calendar size={16} className="me-1" />
//                                     End Date: {formatDate(contract.endDate)}
//                                   </div>
//                                   {contract.status === "Cancel" &&
//                                     contract.reason && (
//                                       <div className="reason-text mt-1">
//                                         <FileText size={16} className="me-1" />
//                                         Reason: {contract.reason}
//                                       </div>
//                                     )}
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end">
//                                 <ViewMyRentCos requestId={contract.requestId} />
//                                 <Button
//                                   className="btn-view-pdf"
//                                   onClick={() =>
//                                     handleViewContractPdf(contract.urlPdf)
//                                   }
//                                 >
//                                   <FileText size={16} className="me-1" />
//                                   View Contract PDF
//                                 </Button>
//                                 {contract.status === "Created" && (
//                                   <>
//                                     <Button
//                                       className="btn-action"
//                                       onClick={() =>
//                                         handleDepositPayment(contract)
//                                       }
//                                     >
//                                       <CreditCard size={16} className="me-1" />
//                                       Deposit Payment
//                                     </Button>
//                                     <Button
//                                       className="btn-cancel btn-outline-danger"
//                                       onClick={() =>
//                                         handleCancelContract(
//                                           contract.contractId
//                                         )
//                                       }
//                                     >
//                                       <FileText size={16} className="me-1" />
//                                       Cancel Contract
//                                     </Button>
//                                   </>
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
//                       Showing <strong>{contractIndexOfFirstItem + 1}</strong> to{" "}
//                       <strong>
//                         {Math.min(contractIndexOfLastItem, totalContractItems)}
//                       </strong>{" "}
//                       of <strong>{totalContractItems}</strong> results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentContractPage}
//                       pageSize={itemsPerPage}
//                       total={totalContractItems}
//                       onChange={handleContractPageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>
//           <TabPane tab="Complete Payment" key="3">
//             {loading ? (
//               <Flex align="center" gap="middle">
//                 <Spin
//                   indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />}
//                 />
//               </Flex>
//             ) : currentProgressingItems.length === 0 ? (
//               <p className="text-center">No deposited contracts found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentProgressingItems.map((contract) => (
//                     <Col key={contract.requestId} xs={12}>
//                       <Card className="history-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column flex-md-row gap-4">
//                             <div className="flex-grow-1">
//                               <div className="d-flex gap-3">
//                                 <div className="icon-circle">
//                                   <FileText size={24} />
//                                 </div>
//                                 <div className="flex-grow-1">
//                                   <div className="d-flex justify-content-between align-items-start">
//                                     <h3 className="history-title mb-0">
//                                       {contract.contractName || "N/A"} &nbsp;
//                                       {getStatusBadge(contract.status)}
//                                     </h3>
//                                   </div>
//                                   <div>
//                                     <DollarSign size={16} className="me-1" />
//                                     Total Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div>
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date: {formatDate(contract.startDate)}
//                                   </div>
//                                   <div>
//                                     <Banknote size={16} className="me-1" />
//                                     Remaining Amount:{" "}
//                                     {(
//                                       contract.price -
//                                       (contract.price -
//                                         (contract.price *
//                                           (100 - contract.deposit)) /
//                                           100)
//                                     ).toLocaleString()}{" "}
//                                     VND
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="text-md-end">
//                               <div className="d-flex gap-2 justify-content-md-end">
//                                 <ViewMyRentCos requestId={contract.requestId} />
//                                 <Button
//                                   className="btn-view-pdf"
//                                   onClick={() =>
//                                     handleViewContractPdf(contract.urlPdf)
//                                   }
//                                 >
//                                   <FileText size={16} className="me-1" />
//                                   View Contract PDF
//                                 </Button>
//                                 <Button
//                                   className="btn-complete-payment"
//                                   onClick={() =>
//                                     handleCompleteContractPayment(contract)
//                                   }
//                                 >
//                                   <CreditCard size={16} className="me-1" />
//                                   Complete Payment
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
//                       Showing <strong>{progressingIndexOfFirstItem + 1}</strong>{" "}
//                       to{" "}
//                       <strong>
//                         {Math.min(
//                           progressingIndexOfLastItem,
//                           totalProgressingItems
//                         )}
//                       </strong>{" "}
//                       of <strong>{totalProgressingItems}</strong> results
//                     </p>
//                   </Col>
//                   <Col xs={12} sm={6} className="d-flex justify-content-end">
//                     <Pagination
//                       current={currentProgressingPage}
//                       pageSize={itemsPerPage}
//                       total={totalProgressingItems}
//                       onChange={handleProgressingPageChange}
//                       showSizeChanger={false}
//                     />
//                   </Col>
//                 </Row>
//               </>
//             )}
//           </TabPane>
//           <TabPane tab="Finish Contract" key="4">
//             <RenderItemList
//               items={currentCompletedItems}
//               totalItems={totalCompletedItems}
//               currentPage={currentCompletedPage}
//               onPageChange={handleCompletedPageChange}
//               onAction={(contract) => handleViewContractPdf(contract.urlPdf)}
//               actionLabel="View Contract PDF"
//               actionIcon={<FileText size={20} />}
//               isCompletedTab={true}
//             />
//           </TabPane>
//         </Tabs>

//         {/* Payment Modal */}
//         <Modal
//           title="Select Payment Amount"
//           open={isPaymentModalVisible}
//           onOk={handlePaymentConfirm}
//           onCancel={() => {
//             setIsPaymentModalVisible(false);
//             setDepositAmount(null);
//           }}
//           okText="Confirm Deposit"
//           cancelText="Cancel"
//           confirmLoading={paymentLoading}
//         >
//           <p>Please select a deposit amount:</p>
//           <Radio.Group
//             onChange={(e) => setDepositAmount(e.target.value)}
//             value={depositAmount}
//           >
//             <Radio value={30}>30%</Radio>
//             <Radio value={50}>50%</Radio>
//             <Radio value={70}>70%</Radio>
//           </Radio.Group>
//         </Modal>

//         {/* Deposit Payment Modal */}
//         <Modal
//           title="Deposit Payment"
//           open={isDepositModalVisible}
//           onOk={handleDepositConfirm}
//           onCancel={() => setIsDepositModalVisible(false)}
//           okText="Purchase"
//           cancelText="Cancel"
//           confirmLoading={paymentLoading}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Full Name</strong>
//               </Form.Label>
//               <Input
//                 value={depositData.fullName}
//                 onChange={(e) =>
//                   setDepositData({ ...depositData, fullName: e.target.value })
//                 }
//                 placeholder="Enter your full name"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Amount (VND)</strong>
//               </Form.Label>
//               <Input value={depositData.amount.toLocaleString()} readOnly />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Purpose</strong>
//               </Form.Label>
//               <Input value="Contract Deposit" readOnly />
//             </Form.Group>
//           </Form>
//         </Modal>

//         {/* Complete Payment Modal */}
//         <Modal
//           title="Complete Contract Payment"
//           open={isCompletePaymentModalVisible}
//           onOk={handleCompletePaymentConfirm}
//           onCancel={() => setIsCompletePaymentModalVisible(false)}
//           okText="Pay Now"
//           cancelText="Cancel"
//           confirmLoading={paymentLoading}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Full Name</strong>
//               </Form.Label>
//               <Input
//                 value={completePaymentData.fullName}
//                 onChange={(e) =>
//                   setCompletePaymentData({
//                     ...completePaymentData,
//                     fullName: e.target.value,
//                   })
//                 }
//                 placeholder="Enter your full name"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Amount (VND)</strong>
//               </Form.Label>
//               <Input
//                 value={completePaymentData.amount.toLocaleString()}
//                 readOnly
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Purpose</strong>
//               </Form.Label>
//               <Input value="Contract settlement" readOnly />
//             </Form.Group>
//           </Form>
//         </Modal>

//         {/* Cancel Contract Modal */}
//         <Modal
//           title="Cancel Contract"
//           open={isCancelModalVisible}
//           onOk={handleCancelConfirm}
//           onCancel={() => {
//             setIsCancelModalVisible(false);
//             setCancelContractId(null);
//             setCancelReason("");
//           }}
//           okText="Confirm Cancel"
//           cancelText="Close"
//           confirmLoading={loading}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Reason for Cancellation</strong>
//               </Form.Label>
//               <TextArea
//                 value={cancelReason}
//                 onChange={(e) => setCancelReason(e.target.value)}
//                 placeholder="Please provide the reason for canceling the contract"
//                 rows={4}
//               />
//             </Form.Group>
//           </Form>
//         </Modal>

//         {/* Feedback Modal */}
//         <Modal
//           title="Feedback"
//           open={isFeedbackModalVisible}
//           onCancel={() => {
//             setIsFeedbackModalVisible(false);
//             setSelectedFeedbackData(null);
//           }}
//           footer={null}
//           width={600}
//         >
//           {selectedFeedbackData && (
//             <FeedbackHireCosplayer
//               contractId={selectedFeedbackData.contractId}
//               contractCharacters={selectedFeedbackData.contractCharacters}
//               accountId={accountId}
//               onCancel={() => {
//                 setIsFeedbackModalVisible(false);
//                 setSelectedFeedbackData(null);
//               }}
//             />
//           )}
//         </Modal>

//         {/* View Feedback Modal */}
//         <Modal
//           title={`Your Feedback`}
//           open={isViewFeedbackModalVisible}
//           onCancel={() => {
//             setIsViewFeedbackModalVisible(false);
//             setViewFeedbackData({
//               contractId: "",
//               feedbacks: [],
//               cosplayerNames: {},
//             });
//           }}
//           footer={null}
//           width={600}
//         >
//           {loading ? (
//             <Flex align="center" justify="center" style={{ padding: "20px" }}>
//               <Spin
//                 indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
//               />
//             </Flex>
//           ) : viewFeedbackData.feedbacks.length > 0 ? (
//             <List
//               dataSource={viewFeedbackData.feedbacks.filter(isValidFeedback)}
//               renderItem={(feedback) => (
//                 <div
//                   style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}
//                 >
//                   <div style={{ width: "100%" }}>
//                     <p>
//                       <strong>Cosplayer:</strong>{" "}
//                       {viewFeedbackData.cosplayerNames[feedback.accountId] ||
//                         "Unknown"}
//                     </p>
//                     {feedback.createdAt && (
//                       <p>
//                         <strong>Submitted:</strong> {feedback.createdAt}
//                       </p>
//                     )}
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Rating</strong>
//                       </Form.Label>
//                       <Rate value={feedback.star} disabled />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Description</strong>
//                       </Form.Label>
//                       <TextArea
//                         value={
//                           feedback.description || "No description provided"
//                         }
//                         readOnly
//                         rows={3}
//                       />
//                     </Form.Group>
//                   </div>
//                 </div>
//               )}
//             />
//           ) : (
//             <p>No feedback available for this contract.</p>
//           )}
//         </Modal>

//         {/* Edit Request Modal */}
//         <EditRequestHireCosplayer
//           visible={isEditModalVisible}
//           requestId={editRequestId}
//           onCancel={() => {
//             setIsEditModalVisible(false);
//             setEditRequestId(null);
//           }}
//           onSuccess={handleEditSuccess}
//         />
//       </Container>
//     </div>
//   );
// };

// export default MyHistory;

// bùa =================================================
import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import {
  Pagination,
  Modal,
  Input,
  List,
  Button,
  Radio,
  message,
  Tabs,
  Select,
  Checkbox,
  Flex,
  Spin,
  Rate,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";

import {
  FileText,
  DollarSign,
  Calendar,
  CreditCard,
  Banknote,
  Star,
  Edit,
  MapPin,
} from "lucide-react";
import MyHistoryService from "../../services/HistoryService/MyHistoryService";
import EditRequestHireCosplayer from "./EditRequestHireCosplayer";
import PaymentService from "../../services/PaymentService/PaymentService.js";
import ViewMyRentCos from "./ViewMyRentCos.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyHistory.scss";
import dayjs from "dayjs";
import FeedbackHireCosplayer from "./FeedbackHireCosplayer";

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const MyHistory = () => {
  const { id: accountId } = useParams();
  const [requests, setRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [progressingContracts, setProgressingContracts] = useState([]);
  const [filteredProgressingContracts, setFilteredProgressingContracts] =
    useState([]);
  const [completedContracts, setCompletedContracts] = useState([]);
  const [filteredCompletedContracts, setFilteredCompletedContracts] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentContractPage, setCurrentContractPage] = useState(1);
  const [currentProgressingPage, setCurrentProgressingPage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("normal");
  const [statusFilter, setStatusFilter] = useState([
    "Pending",
    "Browsed",
    "Cancel",
  ]);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isCompletePaymentModalVisible, setIsCompletePaymentModalVisible] =
    useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [selectedFeedbackData, setSelectedFeedbackData] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [depositAmount, setDepositAmount] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [depositData, setDepositData] = useState({
    fullName: "",
    amount: 0,
    contractId: "",
  });
  const [completePaymentData, setCompletePaymentData] = useState({
    fullName: "",
    amount: 0,
    contractId: "",
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRequestId, setEditRequestId] = useState(null);
  const [isViewFeedbackModalVisible, setIsViewFeedbackModalVisible] =
    useState(false);
  const [viewFeedbackData, setViewFeedbackData] = useState({
    contractId: "",
    feedbacks: [],
    cosplayerNames: {},
  });
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelContractId, setCancelContractId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const isMounted = useRef(true);
  const cosplayerNameCache = useRef({});
  const itemsPerPage = 5;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Format date for display
  const formatDate = (dateTime) => {
    if (!dateTime) return "N/A";
    const parsed = dayjs(dateTime, "HH:mm DD/MM/YYYY");
    return parsed.isValid() ? parsed.format("DD/MM/YYYY") : "N/A";
  };
  const fetchRequests = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const data = await MyHistoryService.GetAllRequestByAccountId(accountId);
      const requestsArray = Array.isArray(data) ? data : [data];
      const filteredRequests = requestsArray
        .filter((request) => request.serviceId === "S002")
        .map((request) => ({
          ...request,
          price: request.price || 0,
          reason: request.reason || null,
          startDate: request.startDate || "",
          endDate: request.endDate || "",
          charactersListResponse: request.charactersListResponse || [],
        }));
      if (isMounted.current) {
        setRequests(filteredRequests);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Failed to load requests. Please try again.");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchRequests();
  }, [accountId]);

  const fetchContracts = async () => {
    if (!accountId || requests.length === 0) return;
    setLoading(true);
    try {
      const data = await MyHistoryService.getAllContractByAccountId(accountId);
      const contractsArray = Array.isArray(data) ? data : [data];
      const validRequestIds = requests.map((req) => req.requestId);

      // Filter contracts and remove duplicates based on requestId
      const filteredContracts = Array.from(
        new Map(
          contractsArray
            .filter((contract) => validRequestIds.includes(contract.requestId))
            .map((contract) => [contract.requestId, contract])
        ).values()
      );

      if (isMounted.current) {
        setContracts(
          filteredContracts.filter(
            (c) => c.status === "Created" || c.status === "Cancel"
          )
        );
        setProgressingContracts(
          filteredContracts.filter((c) => c.status === "Deposited")
        );
        setCompletedContracts(
          filteredContracts.filter(
            (c) =>
              c.status === "FinalSettlement" ||
              c.status === "Completed" ||
              c.status === "Feedbacked"
          )
        );
      }
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
      toast.error("Failed to load contracts. Please try again.");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchContracts();
  }, [accountId, requests]);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("🔄 Tab active lại, gọi APIs...");
        fetchRequests();
        fetchContracts();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [accountId, requests]);
  // Fetch all requests for the account

  // Filter pending requests for Tab 1
  useEffect(() => {
    // Collect requestIds from all contracts
    const allContractRequestIds = [
      ...contracts.map((contract) => contract.requestId),
      ...progressingContracts.map((contract) => contract.requestId),
      ...completedContracts.map((contract) => contract.requestId),
    ];

    // Use Set to remove duplicates
    const contractRequestIds = new Set(allContractRequestIds);

    let filtered = requests
      // Exclude requests with requestId matching any contract
      .filter((request) => !contractRequestIds.has(request.requestId))
      // Filter by searchTerm
      .filter(
        (request) =>
          request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formatDate(request.startDate).includes(searchTerm)
      )
      // Filter by statusFilter
      .filter((request) => statusFilter.includes(request.status));

    // Sort based on sortOption
    if (sortOption !== "normal") {
      filtered.sort((a, b) => {
        if (sortOption === "price-desc") {
          return (b.price || 0) - (a.price || 0);
        } else if (sortOption === "price-asc") {
          return (a.price || 0) - (b.price || 0);
        }
        return 0;
      });
    }

    setFilteredPendingRequests(filtered);
    setCurrentPendingPage(1);
  }, [
    searchTerm,
    requests,
    sortOption,
    statusFilter,
    contracts,
    progressingContracts,
    completedContracts,
  ]);

  // Filter contracts for Tab 2
  useEffect(() => {
    const filtered = contracts.filter(
      (contract) =>
        (contract.contractName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        formatDate(contract.startDate).includes(searchTerm)
    );
    setFilteredContracts(filtered);
    setCurrentContractPage(1);
  }, [searchTerm, contracts]);

  // Filter progressing contracts for Tab 3
  useEffect(() => {
    const filtered = progressingContracts.filter(
      (contract) =>
        (contract.contractName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        formatDate(contract.startDate).includes(searchTerm)
    );
    setFilteredProgressingContracts(filtered);
    setCurrentProgressingPage(1);
  }, [searchTerm, progressingContracts]);

  // Filter completed contracts for Tab 4
  useEffect(() => {
    const filtered = completedContracts.filter(
      (contract) =>
        (contract.contractName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        formatDate(contract.startDate).includes(searchTerm)
    );
    setFilteredCompletedContracts(filtered);
    setCurrentCompletedPage(1);
  }, [searchTerm, completedContracts]);

  // Pagination calculations
  const pendingIndexOfLastItem = currentPendingPage * itemsPerPage;
  const pendingIndexOfFirstItem = pendingIndexOfLastItem - itemsPerPage;
  const currentPendingItems = filteredPendingRequests.slice(
    pendingIndexOfFirstItem,
    pendingIndexOfLastItem
  );
  const totalPendingItems = filteredPendingRequests.length;

  const contractIndexOfLastItem = currentContractPage * itemsPerPage;
  const contractIndexOfFirstItem = contractIndexOfLastItem - itemsPerPage;
  const currentContractItems = filteredContracts.slice(
    contractIndexOfFirstItem,
    contractIndexOfLastItem
  );
  const totalContractItems = filteredContracts.length;

  const progressingIndexOfLastItem = currentProgressingPage * itemsPerPage;
  const progressingIndexOfFirstItem = progressingIndexOfLastItem - itemsPerPage;
  const currentProgressingItems = filteredProgressingContracts.slice(
    progressingIndexOfFirstItem,
    progressingIndexOfLastItem
  );
  const totalProgressingItems = filteredProgressingContracts.length;

  const completedIndexOfLastItem = currentCompletedPage * itemsPerPage;
  const completedIndexOfFirstItem = completedIndexOfLastItem - itemsPerPage;
  const currentCompletedItems = filteredCompletedContracts.slice(
    completedIndexOfFirstItem,
    completedIndexOfLastItem
  );
  const totalCompletedItems = filteredCompletedContracts.length;

  // Pagination handlers
  const handlePendingPageChange = (page) => {
    setCurrentPendingPage(page);
  };

  const handleContractPageChange = (page) => {
    setCurrentContractPage(page);
  };

  const handleProgressingPageChange = (page) => {
    setCurrentProgressingPage(page);
  };

  const handleCompletedPageChange = (page) => {
    setCurrentCompletedPage(page);
  };

  const handleEditRequest = async (requestId) => {
    setEditRequestId(requestId);
    try {
      const requestDetails = await MyHistoryService.getRequestByRequestId(
        requestId
      );
      const requestStatus = requestDetails.status;

      if (requestStatus === "Browsed") {
        setIsEditModalVisible(false);
        toast.info("Status request has changed, please reload the page!");
      } else if (requestStatus === "Pending") {
        setIsEditModalVisible(true);
      } else {
        setIsEditModalVisible(false);
        toast.warn("Request status does not allow editing.");
      }
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      toast.error("Failed to load request details.");
      setIsEditModalVisible(false);
    }
  };
  // Handle edit success and refresh requests
  const handleEditSuccess = async () => {
    setLoading(true);
    try {
      const updatedRequest = await MyHistoryService.getRequestByRequestId(
        editRequestId
      );
      if (!updatedRequest) throw new Error("Updated request not found");

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.requestId === editRequestId
            ? {
                ...req,
                name: updatedRequest.name || req.name,
                description: updatedRequest.description || req.description,
                location: updatedRequest.location || req.location,
                price: updatedRequest.price || req.price,
                status: updatedRequest.status || req.status,
                reason: updatedRequest.reason || req.reason,
                startDate: updatedRequest.startDate || req.startDate,
                endDate: updatedRequest.endDate || req.endDate,
                charactersListResponse:
                  updatedRequest.charactersListResponse ||
                  req.charactersListResponse,
              }
            : req
        )
      );

      toast.success("Request updated successfully!");
    } catch (error) {
      console.error("Failed to refresh requests after edit:", error);
      toast.error("Failed to refresh requests. Please try again.");
    } finally {
      setIsEditModalVisible(false);
      setEditRequestId(null);
      setLoading(false);
    }
  };

  // Handle feedback for a contract
  const handleFeedback = async (contractId) => {
    try {
      setLoading(true);
      const contractCharacters = await MyHistoryService.getContractCharacters(
        contractId
      );
      setSelectedFeedbackData({ contractId, contractCharacters });
      setIsFeedbackModalVisible(true);
    } catch (error) {
      console.error("Error fetching contract characters:", error);
      toast.error("Không thể tải dữ liệu feedback.");
    } finally {
      setLoading(false);
    }
  };

  // Validate feedback data
  const isValidFeedback = (feedback) => {
    return (
      feedback &&
      typeof feedback.star === "number" &&
      feedback.star >= 0 &&
      feedback.star <= 5 &&
      typeof feedback.accountId === "string"
    );
  };

  // Handle viewing feedback for a contract
  const handleViewFeedback = async (contractId) => {
    setLoading(true);
    try {
      const { contractId: fetchedContractId, feedbacks } =
        await MyHistoryService.getFeedbackByContractId(contractId);

      let failedNameFetches = 0;
      const namePromises = feedbacks.map(async (feedback) => {
        if (cosplayerNameCache.current[feedback.accountId]) {
          return [
            feedback.accountId,
            cosplayerNameCache.current[feedback.accountId],
          ];
        }
        try {
          const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
            feedback.accountId
          );
          const name = cosplayerData?.name || "Unknown";
          cosplayerNameCache.current[feedback.accountId] = name;
          return [feedback.accountId, name];
        } catch (error) {
          failedNameFetches++;
          console.warn(
            `Failed to fetch cosplayer data for ID ${feedback.accountId}:`,
            error
          );
          return [feedback.accountId, "Unknown"];
        }
      });
      const namesArray = await Promise.all(namePromises);
      const cosplayerNames = Object.fromEntries(namesArray);

      if (failedNameFetches > 0) {
        toast.warning(
          `${failedNameFetches} cosplayer name(s) could not be fetched.`
        );
      }

      setViewFeedbackData({
        contractId: fetchedContractId,
        feedbacks,
        cosplayerNames,
      });
      setIsViewFeedbackModalVisible(true);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error(error.message || "Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  // Process deposit payment
  useEffect(() => {
    if (selectedRequestId && depositAmount !== null && paymentLoading) {
      const processPayment = async () => {
        try {
          await MyHistoryService.depositRequest(
            selectedRequestId,
            depositAmount
          );
          toast.success("Choose Deposit successful!");

          // Update requests
          const requestData = await MyHistoryService.GetAllRequestByAccountId(
            accountId
          );
          const filteredRequests = (
            Array.isArray(requestData) ? requestData : [requestData]
          )
            .filter((req) => req.serviceId === "S002")
            .map((req) => ({
              ...req,
              price: req.price || 0,
              reason: req.reason || null,
              startDate: req.startDate || "",
              endDate: req.endDate || "",
              charactersListResponse: req.charactersListResponse || [],
            }));
          setRequests(filteredRequests);

          // Update contracts
          const contractData = await MyHistoryService.getAllContractByAccountId(
            accountId
          );
          const validRequestIds = filteredRequests.map((req) => req.requestId);
          const filteredContracts = (
            Array.isArray(contractData) ? contractData : [contractData]
          ).filter((contract) => validRequestIds.includes(contract.requestId));

          // Remove duplicates
          const uniqueContracts = Array.from(
            new Map(filteredContracts.map((c) => [c.requestId, c])).values()
          );

          setContracts(
            uniqueContracts.filter(
              (c) => c.status === "Created" || c.status === "Cancel"
            )
          );
          setProgressingContracts(
            uniqueContracts.filter((c) => c.status === "Deposited")
          );
          setCompletedContracts(
            uniqueContracts.filter(
              (c) =>
                c.status === "FinalSettlement" ||
                c.status === "Completed" ||
                c.status === "Feedbacked"
            )
          );
        } catch (error) {
          toast.error("Cannot payment, waiting for manager to browsed!");
        } finally {
          setPaymentLoading(false);
          setIsPaymentModalVisible(false);
          setSelectedRequestId(null);
          setDepositAmount(null);
        }
      };
      processPayment();
    }
  }, [selectedRequestId, depositAmount, paymentLoading, accountId]);

  // Handle cancel contract
  const handleCancelContract = (contractId) => {
    setCancelContractId(contractId);
    setCancelReason("");
    setIsCancelModalVisible(true);
  };

  // Confirm cancel contract
  const handleCancelConfirm = async () => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation!");
      return;
    }

    setLoading(true);
    try {
      const encodedReason = encodeURIComponent(cancelReason);
      await MyHistoryService.cancelContract(cancelContractId, encodedReason);
      toast.success("Contract canceled successfully!");

      // Update contracts
      const contractData = await MyHistoryService.getAllContractByAccountId(
        accountId
      );
      const validRequestIds = requests.map((req) => req.requestId);
      const filteredContracts = (
        Array.isArray(contractData) ? contractData : [contractData]
      ).filter((contract) => validRequestIds.includes(contract.requestId));

      // Remove duplicates
      const uniqueContracts = Array.from(
        new Map(filteredContracts.map((c) => [c.requestId, c])).values()
      );

      setContracts(
        uniqueContracts.filter(
          (c) => c.status === "Created" || c.status === "Cancel"
        )
      );
      setProgressingContracts(
        uniqueContracts.filter((c) => c.status === "Deposited")
      );
      setCompletedContracts(
        uniqueContracts.filter(
          (c) =>
            c.status === "FinalSettlement" ||
            c.status === "Completed" ||
            c.status === "Feedbacked"
        )
      );
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

  // Handle payment selection
  const handlePayment = (requestId) => {
    setSelectedRequestId(requestId);
    setIsPaymentModalVisible(true);
  };

  // Confirm payment
  const handlePaymentConfirm = () => {
    if (depositAmount === null) {
      message.warning("Please select a deposit amount.");
      return;
    }
    setPaymentLoading(true);
  };

  // Handle deposit payment
  const handleDepositPayment = (contract) => {
    setDepositData({
      fullName: contract.createBy || "",
      amount:
        contract.price - (contract.price * (100 - contract.deposit)) / 100,
      contractId: contract.contractId,
    });
    setIsDepositModalVisible(true);
  };

  // Confirm deposit payment
  const handleDepositConfirm = async () => {
    if (!depositData.fullName.trim()) {
      toast.error("Full name cannot be empty!");
      return;
    }

    setPaymentLoading(true);
    try {
      const paymentRequestData = {
        fullName: depositData.fullName,
        orderInfo: "",
        amount: depositData.amount,
        purpose: 1,
        accountId: accountId,
        ticketId: "",
        ticketQuantity: "",
        contractId: depositData.contractId,
        orderpaymentId: "",
        isWeb: true,
      };

      const paymentUrl = await PaymentService.DepositPayment(
        paymentRequestData
      );
      window.location.href = paymentUrl;
      toast.success("Redirecting to payment gateway...");
    } catch (error) {
      toast.error(error.message || "Failed to process payment!");
    } finally {
      setPaymentLoading(false);
      setIsDepositModalVisible(false);
    }
  };

  // Handle complete contract payment
  // Handle complete contract payment
  const handleCompleteContractPayment = async (contract) => {
    setLoading(true);
    try {
      // Fetch tasks for the contract
      const tasks = await MyHistoryService.getTaskByContractId(
        contract.contractId
      );

      // Check if tasks is an array and all tasks have status "Completed"
      if (!Array.isArray(tasks)) {
        throw new Error("Invalid tasks data received.");
      }

      const allTasksCompleted = tasks.every(
        (task) => task.status === "Completed"
      );

      if (!allTasksCompleted) {
        toast.error(
          "Cannot proceed with payment: Not all tasks are completed."
        );
        return;
      }

      // If all tasks are completed, proceed to open the payment modal
      setCompletePaymentData({
        fullName: contract.createBy || "",
        amount:
          contract.price -
          (contract.price - (contract.price * (100 - contract.deposit)) / 100),
        contractId: contract.contractId,
      });
      setIsCompletePaymentModalVisible(true);
    } catch (error) {
      console.error("Error checking tasks for payment:", error);
      toast.error("Failed to verify tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Confirm complete payment
  const handleCompletePaymentConfirm = async () => {
    if (!completePaymentData.fullName.trim()) {
      toast.error("Full name cannot be empty!");
      return;
    }

    setPaymentLoading(true);
    try {
      const paymentRequestData = {
        fullName: completePaymentData.fullName,
        orderInfo: "",
        amount: completePaymentData.amount,
        purpose: 2,
        accountId: accountId,
        ticketId: "",
        ticketQuantity: "",
        contractId: completePaymentData.contractId,
        orderpaymentId: "",
        isWeb: true,
      };

      const paymentUrl = await PaymentService.DepositPayment(
        paymentRequestData
      );
      window.location.href = paymentUrl;
      toast.success("Redirecting to payment gateway...");
    } catch (error) {
      toast.error(error.message || "Failed to process payment!");
    } finally {
      setPaymentLoading(false);
      setIsCompletePaymentModalVisible(false);
    }
  };

  // View contract PDF
  const handleViewContractPdf = (urlPdf) => {
    if (urlPdf) {
      window.open(urlPdf, "_blank");
    } else {
      toast.error("PDF URL not available for this contract.");
    }
  };

  // Render status badge
  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Cancel: "danger",
      Created: "info",
      Deposited: "warning",
      Completed: "success",
      Feedbacked: "success",
    };
    return (
      <Badge bg={statusColors[status] || "secondary"}>
        {status || "Unknown"}
      </Badge>
    );
  };

  // Render list of items (used in Tabs 1 and 4)
  const RenderItemList = ({
    items,
    totalItems,
    currentPage,
    onPageChange,
    onAction,
    actionLabel,
    actionIcon,
    onEdit,
    isCompletedTab = false,
  }) => {
    if (loading) {
      return (
        <Flex
          align="center"
          justify="center"
          gap="middle"
          style={{ width: "100%" }}
        >
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                spin
              />
            }
          />
        </Flex>
      );
    }
    if (items.length === 0) {
      return <p className="text-center">No items found.</p>;
    }

    return (
      <>
        <Row className="g-4">
          {items.map((item) => (
            <Col key={item.requestId} xs={12}>
              <Card className="history-card shadow">
                <Card.Body>
                  <div className="d-flex flex-column flex-md-row gap-4">
                    <div className="flex-grow-1">
                      <div className="d-flex gap-3">
                        <div className="icon-circle">
                          <FileText size={24} />
                        </div>
                        <div
                          className="flex-grow-1"
                          style={{ marginBottom: "10px" }}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <h3 className="history-title mb-0">
                              {item.name || item.contractName || "N/A"}{" "}
                              {getStatusBadge(item.status)}
                            </h3>
                          </div>
                          <div>
                            <DollarSign size={16} className="me-1" />
                            Total Price: {(
                              item.price || 0
                            ).toLocaleString()}{" "}
                            VND
                          </div>
                          <div>
                            <Calendar size={16} className="me-1" />
                            Start Date: {formatDate(item.startDate)}
                          </div>
                          <div>
                            <Calendar size={16} className="me-1" />
                            End Date: {formatDate(item.endDate)}
                          </div>
                          {item.location && (
                            <div>
                              <MapPin size={16} className="me-1" />
                              Location: {item.location || "N/A"}
                            </div>
                          )}

                          {item.status === "Cancel" && item.reason && (
                            <div className="reason-text mt-1">
                              <FileText size={16} className="me-1" />
                              Reason: {item.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-md-end">
                      <div className="d-flex gap-2 justify-content-md-end">
                        <ViewMyRentCos requestId={item.requestId} />
                        {item.status === "Pending" && onEdit && (
                          <Button
                            className="btn-edit"
                            onClick={() => onEdit(item.requestId)}
                          >
                            <Edit size={16} className="me-1" />
                            Edit
                          </Button>
                        )}
                        {onAction && (
                          <Button
                            className="btn-action"
                            onClick={() => onAction(item)}
                          >
                            {actionIcon}
                            {actionLabel}
                          </Button>
                        )}
                        {isCompletedTab && item.status === "Completed" && (
                          <Button
                            className="btn-feedback"
                            onClick={() => handleFeedback(item.contractId)}
                            disabled={item.status === "Feedbacked"}
                          >
                            <Star size={16} className="me-1" />
                            Feedback
                          </Button>
                        )}
                        {isCompletedTab && item.status === "Feedbacked" && (
                          <Button
                            className="btn-view-feedback"
                            onClick={() => handleViewFeedback(item.contractId)}
                          >
                            <Star size={16} className="me-1" />
                            View Feedback
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
              <strong>{currentPage * itemsPerPage - itemsPerPage + 1}</strong>{" "}
              to{" "}
              <strong>
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </strong>{" "}
              of <strong>{totalItems}</strong> results
            </p>
          </Col>
          <Col xs={12} sm={6} className="d-flex justify-content-end">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={totalItems}
              onChange={onPageChange}
              showSizeChanger={false}
            />
          </Col>
        </Row>
      </>
    );
  };
  return (
    <div className="my-history bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-my-history">
          <span>My History Rental Cosplayers</span>
        </h1>

        {/* Filter Section */}
        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row className="align-items-center g-3">
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

        {/* Tabs */}
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Confirm Pending" key="1">
            <Row
              className="align-items-center g-3"
              style={{ marginBottom: "20px" }}
            >
              <Col md={3}>
                <Select
                  style={{ width: "100%" }}
                  value={sortOption}
                  onChange={(value) => setSortOption(value)}
                >
                  <Option value="normal">Normal</Option>
                  <Option value="price-desc">Price: High to Low</Option>
                  <Option value="price-asc">Price: Low to High</Option>
                </Select>
              </Col>
              <Col md={6}>
                <Checkbox.Group
                  options={[
                    { label: "Pending", value: "Pending" },
                    { label: "Browsed", value: "Browsed" },
                    { label: "Cancel", value: "Cancel" },
                  ]}
                  value={statusFilter}
                  onChange={(checkedValues) =>
                    setStatusFilter(
                      checkedValues.length
                        ? checkedValues
                        : ["Pending", "Browsed", "Cancel"]
                    )
                  }
                />
              </Col>
            </Row>
            <RenderItemList
              items={currentPendingItems}
              totalItems={totalPendingItems}
              currentPage={currentPendingPage}
              onPageChange={handlePendingPageChange}
              onEdit={handleEditRequest}
            />
          </TabPane>
          <TabPane tab="Pay Contract Deposit" key="2">
            {loading ? (
              <Flex
                align="center"
                justify="center"
                gap="middle"
                style={{ width: "100%" }}
              >
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 50,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      spin
                    />
                  }
                />
              </Flex>
            ) : currentContractItems.length === 0 ? (
              <p className="text-center">No contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentContractItems.map((contract) => (
                    <Col key={contract.requestId} xs={12}>
                      <Card className="history-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="history-title mb-0">
                                      {contract.contractName || "N/A"}{" "}
                                      {getStatusBadge(contract.status)}
                                    </h3>
                                  </div>
                                  <div>
                                    <DollarSign size={16} className="me-1" />
                                    Total Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div>
                                    <Calendar size={16} className="me-1" />
                                    Start Date: {formatDate(contract.startDate)}
                                  </div>
                                  <div>
                                    <Calendar size={16} className="me-1" />
                                    End Date: {formatDate(contract.endDate)}
                                  </div>
                                  {contract.status === "Cancel" &&
                                    contract.reason && (
                                      <div className="reason-text mt-1">
                                        <FileText size={16} className="me-1" />
                                        Reason: {contract.reason}
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end">
                                <ViewMyRentCos requestId={contract.requestId} />
                                <Button
                                  className="btn-view-pdf"
                                  onClick={() =>
                                    handleViewContractPdf(contract.urlPdf)
                                  }
                                >
                                  <FileText size={16} className="me-1" />
                                  View Contract PDF
                                </Button>
                                {contract.status === "Created" && (
                                  <>
                                    <Button
                                      className="btn-action"
                                      onClick={() =>
                                        handleDepositPayment(contract)
                                      }
                                    >
                                      <CreditCard size={16} className="me-1" />
                                      Deposit Payment
                                    </Button>
                                    <Button
                                      className="btn-cancel btn-outline-danger"
                                      onClick={() =>
                                        handleCancelContract(
                                          contract.contractId
                                        )
                                      }
                                    >
                                      <FileText size={16} className="me-1" />
                                      Cancel Contract
                                    </Button>
                                  </>
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
                      Showing <strong>{contractIndexOfFirstItem + 1}</strong> to{" "}
                      <strong>
                        {Math.min(contractIndexOfLastItem, totalContractItems)}
                      </strong>{" "}
                      of <strong>{totalContractItems}</strong> results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentContractPage}
                      pageSize={itemsPerPage}
                      total={totalContractItems}
                      onChange={handleContractPageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>
          <TabPane tab="Complete Payment" key="3">
            {loading ? (
              <Flex
                align="center"
                justify="center"
                gap="middle"
                style={{ width: "100%" }}
              >
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{
                        fontSize: 50,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      spin
                    />
                  }
                />
              </Flex>
            ) : currentProgressingItems.length === 0 ? (
              <p className="text-center">No deposited contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentProgressingItems.map((contract) => (
                    <Col key={contract.requestId} xs={12}>
                      <Card className="history-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="history-title mb-0">
                                      {contract.contractName || "N/A"} &nbsp;
                                      {getStatusBadge(contract.status)}
                                    </h3>
                                  </div>
                                  <div>
                                    <DollarSign size={16} className="me-1" />
                                    Total Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div>
                                    <Calendar size={16} className="me-1" />
                                    Start Date: {formatDate(contract.startDate)}
                                  </div>
                                  <div>
                                    <Banknote size={16} className="me-1" />
                                    Remaining Amount:{" "}
                                    {(
                                      contract.price -
                                      (contract.price -
                                        (contract.price *
                                          (100 - contract.deposit)) /
                                          100)
                                    ).toLocaleString()}{" "}
                                    VND
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end">
                                <ViewMyRentCos requestId={contract.requestId} />
                                <Button
                                  className="btn-view-pdf"
                                  onClick={() =>
                                    handleViewContractPdf(contract.urlPdf)
                                  }
                                >
                                  <FileText size={16} className="me-1" />
                                  View Contract PDF
                                </Button>
                                <Button
                                  className="btn-complete-payment"
                                  onClick={() =>
                                    handleCompleteContractPayment(contract)
                                  }
                                >
                                  <CreditCard size={16} className="me-1" />
                                  Complete Payment
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
                      Showing <strong>{progressingIndexOfFirstItem + 1}</strong>{" "}
                      to{" "}
                      <strong>
                        {Math.min(
                          progressingIndexOfLastItem,
                          totalProgressingItems
                        )}
                      </strong>{" "}
                      of <strong>{totalProgressingItems}</strong> results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentProgressingPage}
                      pageSize={itemsPerPage}
                      total={totalProgressingItems}
                      onChange={handleProgressingPageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>
          <TabPane tab="Finish Contract" key="4">
            <RenderItemList
              items={currentCompletedItems}
              totalItems={totalCompletedItems}
              currentPage={currentCompletedPage}
              onPageChange={handleCompletedPageChange}
              onAction={(contract) => handleViewContractPdf(contract.urlPdf)}
              actionLabel="View Contract PDF"
              actionIcon={<FileText size={20} />}
              isCompletedTab={true}
            />
          </TabPane>
        </Tabs>

        {/* Payment Modal */}
        <Modal
          title="Select Payment Amount"
          open={isPaymentModalVisible}
          onOk={handlePaymentConfirm}
          onCancel={() => {
            setIsPaymentModalVisible(false);
            setDepositAmount(null);
          }}
          okText="Confirm Deposit"
          cancelText="Cancel"
          confirmLoading={paymentLoading}
        >
          <p>Please select a deposit amount:</p>
          <Radio.Group
            onChange={(e) => setDepositAmount(e.target.value)}
            value={depositAmount}
          >
            <Radio value={30}>30%</Radio>
            <Radio value={50}>50%</Radio>
            <Radio value={70}>70%</Radio>
          </Radio.Group>
        </Modal>

        {/* Deposit Payment Modal */}
        <Modal
          title="Deposit Payment"
          open={isDepositModalVisible}
          onOk={handleDepositConfirm}
          onCancel={() => setIsDepositModalVisible(false)}
          okText="Purchase"
          cancelText="Cancel"
          confirmLoading={paymentLoading}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Full Name</strong>
              </Form.Label>
              <Input
                value={depositData.fullName}
                onChange={(e) =>
                  setDepositData({ ...depositData, fullName: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Amount (VND)</strong>
              </Form.Label>
              <Input value={depositData.amount.toLocaleString()} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Purpose</strong>
              </Form.Label>
              <Input value="Contract Deposit" readOnly />
            </Form.Group>
          </Form>
        </Modal>

        {/* Complete Payment Modal */}
        <Modal
          title="Complete Contract Payment"
          open={isCompletePaymentModalVisible}
          onOk={handleCompletePaymentConfirm}
          onCancel={() => setIsCompletePaymentModalVisible(false)}
          okText="Pay Now"
          cancelText="Cancel"
          confirmLoading={paymentLoading}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Full Name</strong>
              </Form.Label>
              <Input
                value={completePaymentData.fullName}
                onChange={(e) =>
                  setCompletePaymentData({
                    ...completePaymentData,
                    fullName: e.target.value,
                  })
                }
                placeholder="Enter your full name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Amount (VND)</strong>
              </Form.Label>
              <Input
                value={completePaymentData.amount.toLocaleString()}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Purpose</strong>
              </Form.Label>
              <Input value="Contract settlement" readOnly />
            </Form.Group>
          </Form>
        </Modal>

        {/* Cancel Contract Modal */}
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

        {/* Feedback Modal */}
        <Modal
          title="Feedback"
          open={isFeedbackModalVisible}
          onCancel={() => {
            setIsFeedbackModalVisible(false);
            setSelectedFeedbackData(null);
          }}
          footer={null}
          width={600}
        >
          {selectedFeedbackData && (
            <FeedbackHireCosplayer
              contractId={selectedFeedbackData.contractId}
              contractCharacters={selectedFeedbackData.contractCharacters}
              accountId={accountId}
              onCancel={() => {
                setIsFeedbackModalVisible(false);
                setSelectedFeedbackData(null);
              }}
            />
          )}
        </Modal>

        {/* View Feedback Modal */}
        <Modal
          title={`Your Feedback`}
          open={isViewFeedbackModalVisible}
          onCancel={() => {
            setIsViewFeedbackModalVisible(false);
            setViewFeedbackData({
              contractId: "",
              feedbacks: [],
              cosplayerNames: {},
            });
          }}
          footer={null}
          width={600}
        >
          {loading ? (
            <Flex align="center" justify="center" style={{ padding: "20px" }}>
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            </Flex>
          ) : viewFeedbackData.feedbacks.length > 0 ? (
            <List
              dataSource={viewFeedbackData.feedbacks.filter(isValidFeedback)}
              renderItem={(feedback) => (
                <div
                  style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}
                >
                  <div style={{ width: "100%" }}>
                    <p>
                      <strong>Cosplayer:</strong>{" "}
                      {viewFeedbackData.cosplayerNames[feedback.accountId] ||
                        "Unknown"}
                    </p>
                    {feedback.createdAt && (
                      <p>
                        <strong>Submitted:</strong> {feedback.createdAt}
                      </p>
                    )}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <strong>Rating</strong>
                      </Form.Label>
                      <Rate value={feedback.star} disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <strong>Description</strong>
                      </Form.Label>
                      <TextArea
                        value={
                          feedback.description || "No description provided"
                        }
                        readOnly
                        rows={3}
                      />
                    </Form.Group>
                  </div>
                </div>
              )}
            />
          ) : (
            <p>No feedback available for this contract.</p>
          )}
        </Modal>

        {/* Edit Request Modal */}
        <EditRequestHireCosplayer
          visible={isEditModalVisible}
          requestId={editRequestId}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditRequestId(null);
          }}
          onSuccess={handleEditSuccess}
        />
      </Container>
    </div>
  );
};

export default MyHistory;
