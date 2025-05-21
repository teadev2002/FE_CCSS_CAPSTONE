// export default MyEventOrganize;
// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
// import {
//   Pagination,
//   Modal,
//   Button,
//   Tabs,
//   Radio,
//   message,
//   Input,
//   List,
//   Spin,
//   Rate,
//   Collapse,
//   Checkbox,
// } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyEventOrganize.scss";
// import ViewMyEventOrganize from "./ViewMyEventOrganize";
// import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
// import DetailEventOrganizationPageService from "../../services/DetailEventOrganizationPageService/DetailEventOrganizationPageService";
// import FeedbackHireCosplayer from "../MyHistoryPage/FeedbackHireCosplayer";
// import {
//   FileText,
//   Calendar,
//   Eye,
//   CreditCard,
//   DollarSign,
//   MapPin,
//   File,
//   Star,
//   CircleDollarSign,
//   Package,
//   User,
// } from "lucide-react";
// import { LoadingOutlined } from "@ant-design/icons";
// import dayjs from "dayjs";
// import { jwtDecode } from "jwt-decode";
// import EditEventOrganize from "./EditEventOrganize"; // Import component mới

// const { TabPane } = Tabs;
// const { TextArea } = Input;
// const { Panel } = Collapse;

// const formatDate = (date) =>
//   !date || date === "null" || date === "undefined" || date === ""
//     ? "N/A"
//     : dayjs(
//         date,
//         ["HH:mm DD/MM/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
//         true
//       ).isValid()
//     ? dayjs(date, ["HH:mm DD/MM/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).format(
//         "DD/MM/YYYY"
//       )
//     : "Invalid Date";

// const MyEventOrganize = () => {
//   const { id: accountId } = useParams();
//   const [requests, setRequests] = useState([]);
//   const [contracts, setContracts] = useState([]);
//   const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
//   const [filteredCreatedContracts, setFilteredCreatedContracts] = useState([]);
//   const [filteredDepositedContracts, setFilteredDepositedContracts] = useState(
//     []
//   );
//   const [filteredCompletedContracts, setFilteredCompletedContracts] = useState(
//     []
//   );
//   const [loading, setLoading] = useState(false);
//   const [currentPendingPage, setCurrentPendingPage] = useState(1);
//   const [currentCreatedPage, setCurrentCreatedPage] = useState(1);
//   const [currentDepositedPage, setCurrentDepositedPage] = useState(1);
//   const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatuses, setSelectedStatuses] = useState([
//     "Pending",
//     "Browsed",
//     "Cancel",
//   ]);
//   const [isViewDetailsModalVisible, setIsViewDetailsModalVisible] =
//     useState(false);
//   const [isViewEditModalVisible, setIsViewEditModalVisible] = useState(false);
//   const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
//   const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
//   const [isRemainingPaymentModalVisible, setIsRemainingPaymentModalVisible] =
//     useState(false);
//   const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
//   const [isViewFeedbackModalVisible, setIsViewFeedbackModalVisible] =
//     useState(false);
//   const [selectedRequestId, setSelectedRequestId] = useState(null);
//   const [selectedFeedbackData, setSelectedFeedbackData] = useState(null);
//   const [viewFeedbackData, setViewFeedbackData] = useState({
//     contractId: "",
//     feedbacks: [],
//     cosplayerNames: {},
//   });
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
//     contractId: "",
//   });
//   const [depositAmount, setDepositAmount] = useState(null);
//   const [characters, setCharacters] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [paymentData, setPaymentData] = useState({
//     fullName: "",
//     amount: 0,
//     contractId: "",
//   });
//   const [remainingPaymentData, setRemainingPaymentData] = useState({
//     fullName: "",
//     amount: 0,
//     contractId: "",
//   });
//   const [paymentLoading, setPaymentLoading] = useState(false);
//   const [packagePrice, setPackagePrice] = useState(0);
//   const [characterPrices, setCharacterPrices] = useState({});
//   const [depositStatus, setDepositStatus] = useState({});
//   const itemsPerPage = 5;

//   const getAccountIdFromToken = () => {
//     const token = localStorage.getItem("accessToken");
//     if (!token) return null;
//     try {
//       const decodedToken = jwtDecode(token);
//       return decodedToken.Id || decodedToken.sub || decodedToken.accountId;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return null;
//     }
//   };

//   const effectiveAccountId = accountId || getAccountIdFromToken();

//   // Hàm xử lý thay đổi checkbox
//   const handleStatusFilterChange = (status) => {
//     setSelectedStatuses((prev) => {
//       const newStatuses = prev.includes(status)
//         ? prev.filter((s) => s !== status) // Bỏ chọn
//         : [...prev, status]; // Chọn
//       console.log("Selected Statuses:", newStatuses); // Log để debug
//       return newStatuses;
//     });
//     setCurrentPendingPage(1); // Reset về trang đầu tiên
//   };

//   useEffect(() => {
//     const fetchRequests = async () => {
//       if (!effectiveAccountId) {
//         toast.error("No valid account ID found.");
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       try {
//         const data = await MyEventOrganizeService.getAllRequestByAccountId(
//           effectiveAccountId
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
//           reason: request.reason || null,
//           packageId: request.packageId || "N/A",
//           charactersListResponse: (request.charactersListResponse || []).map(
//             (char) => ({
//               requestCharacterId: char.requestCharacterId || "",
//               characterId: char.characterId,
//               characterName: char.characterName || "Unknown Character",
//               cosplayerId: char.cosplayerId || null,
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
//         toast.error("Failed to load requests.");
//         console.error("Error fetching requests:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchContracts = async () => {
//       if (!effectiveAccountId) {
//         toast.error("No valid account ID found.");
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       try {
//         const contractData =
//           await MyEventOrganizeService.getAllContractByAccountId(
//             effectiveAccountId
//           );
//         const filteredContracts = [];
//         const seenContractIds = new Set(); // Kiểm tra trùng lặp contractId
//         for (const contract of contractData) {
//           if (seenContractIds.has(contract.contractId)) {
//             console.warn(`Duplicate contract ID: ${contract.contractId}`);
//             continue;
//           }
//           seenContractIds.add(contract.contractId);
//           try {
//             const requestData =
//               await MyEventOrganizeService.getRequestByRequestId(
//                 contract.requestId
//               );
//             if (requestData.serviceId === "S003") {
//               filteredContracts.push({
//                 contractId: contract.contractId,
//                 requestId: contract.requestId,
//                 contractName: contract.contractName || "N/A",
//                 packageName: contract.packageName || "N/A",
//                 price: contract.price || 0,
//                 amount: contract.amount || 0,
//                 deposit: contract.deposit || 0,
//                 status: contract.status || "Unknown",
//                 startDate: formatDate(contract.startDate),
//                 endDate: formatDate(contract.endDate),
//                 createBy: contract.createBy || "N/A",
//                 createDate: formatDate(contract.createDate),
//                 urlPdf: contract.urlPdf || "",
//                 charactersListResponse: (
//                   requestData.charactersListResponse || []
//                 ).map((char) => ({
//                   requestCharacterId: char.requestCharacterId || "",
//                   characterId: char.characterId,
//                   characterName: char.characterName || "Unknown Character",
//                   cosplayerId: char.cosplayerId || null,
//                   quantity: char.quantity || 1,
//                   description: char.description || "N/A",
//                   characterImages: char.characterImages || [],
//                   requestDateResponses: char.requestDateResponses || [],
//                   maxHeight: char.maxHeight,
//                   maxWeight: char.maxWeight,
//                   minHeight: char.minHeight,
//                   minWeight: char.minWeight,
//                   status: char.status,
//                 })),
//                 description: requestData.description || "N/A",
//                 location: requestData.location || "N/A",
//                 packageId: requestData.packageId || "N/A",
//                 serviceId: requestData.serviceId,
//               });
//             }
//           } catch (error) {
//             console.error(
//               `Error fetching request for contract ${contract.contractId}:`,
//               error
//             );
//           }
//         }
//         setContracts(filteredContracts);
//       } catch (error) {
//         toast.error("Failed to load contracts.");
//         console.error("Error fetching contracts:", error);
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
//     fetchContracts();
//     fetchPackages();
//     fetchCharacters();
//   }, [effectiveAccountId]);

//   useEffect(() => {
//     if (requests.length > 0) {
//       const filterByStatusAndSearch = () =>
//         requests
//           .filter((request) =>
//             selectedStatuses.length === 0
//               ? false // Nếu không chọn trạng thái nào, không hiển thị yêu cầu
//               : selectedStatuses.includes(request.status)
//           )
//           .filter(
//             (request) =>
//               request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//               request.startDate.includes(searchTerm)
//           );
//       setFilteredPendingRequests(filterByStatusAndSearch());
//     }

//     const filterContractsBySearch = (contracts) =>
//       contracts.filter(
//         (contract) =>
//           contract.contractName
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           contract.startDate.includes(searchTerm)
//       );

//     setFilteredCreatedContracts(
//       filterContractsBySearch(contracts.filter((c) => c.status === "Created"))
//     );
//     setFilteredDepositedContracts(
//       filterContractsBySearch(contracts.filter((c) => c.status === "Deposited"))
//     );
//     setFilteredCompletedContracts(
//       filterContractsBySearch(
//         contracts.filter(
//           (c) =>
//             c.status === "Completed" ||
//             c.status === "FinalSettlement" ||
//             c.status === "Feedbacked"
//         )
//       )
//     );
//   }, [searchTerm, requests, contracts, selectedStatuses]);

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
//         const totalCharPrice = modalData.listCharacters.reduce(
//           (sum, char) =>
//             sum + (newCharPrices[char.characterId] || 0) * (char.quantity || 1),
//           0
//         );
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

//   useEffect(() => {
//     const fetchDepositStatus = async () => {
//       const status = {};
//       for (const request of filteredPendingRequests) {
//         try {
//           const response = await MyEventOrganizeService.getRequestByRequestId(
//             request.requestId
//           );
//           status[request.requestId] = parseFloat(response.deposit) > 1;
//         } catch (error) {
//           console.error(
//             `Error fetching deposit for request ${request.requestId}:`,
//             error
//           );
//           status[request.requestId] = false;
//         }
//       }
//       setDepositStatus(status);
//     };

//     if (filteredPendingRequests.length > 0) {
//       fetchDepositStatus();
//     }
//   }, [filteredPendingRequests]);

//   const paginateItems = (items, currentPage) => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return items.slice(indexOfFirstItem, indexOfLastItem);
//   };

//   const currentPendingItems = paginateItems(
//     filteredPendingRequests,
//     currentPendingPage
//   );
//   const currentCreatedItems = paginateItems(
//     filteredCreatedContracts,
//     currentCreatedPage
//   );
//   const currentDepositedItems = paginateItems(
//     filteredDepositedContracts,
//     currentDepositedPage
//   );
//   const currentCompletedItems = paginateItems(
//     filteredCompletedContracts,
//     currentCompletedPage
//   );

//   const handlePendingPageChange = (page) => setCurrentPendingPage(page);
//   const handleCreatedPageChange = (page) => setCurrentCreatedPage(page);
//   const handleDepositedPageChange = (page) => setCurrentDepositedPage(page);
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
//           cosplayerId: char.cosplayerId || null,
//           quantity: char.quantity || 1,
//           description: char.description || "",
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
//       listCharacters: request.charactersListResponse,
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
//     try {
//       await MyEventOrganizeService.chooseDeposit(selectedRequestId, {
//         deposit: depositAmount.toString(),
//       });
//       setRequests((prev) =>
//         prev.map((req) =>
//           req.requestId === selectedRequestId
//             ? { ...req, deposit: depositAmount }
//             : req
//         )
//       );
//       toast.success(`Deposit of ${depositAmount}% confirmed!`);
//     } catch (error) {
//       toast.error("Failed to update deposit.");
//       console.error("Error updating deposit:", error);
//     }
//     setIsDepositModalVisible(false);
//     setDepositAmount(null);
//     setSelectedRequestId(null);
//   };

//   const handlePaymentRequest = (contract) => {
//     if (!contract?.requestId || !contract?.contractId) {
//       toast.error("Invalid contract data");
//       return;
//     }
//     setSelectedRequestId(contract.requestId);
//     setModalData({
//       requestId: contract.requestId,
//       name: contract.contractName,
//       description: contract.description,
//       startDate: contract.startDate,
//       endDate: contract.endDate,
//       location: contract.location,
//       packageId: contract.packageId,
//       listCharacters: contract.charactersListResponse,
//       status: contract.status,
//       price: contract.price,
//       deposit: contract.deposit,
//       serviceId: contract.serviceId,
//       contractId: contract.contractId,
//     });
//     setPaymentData({
//       fullName: contract.createBy || "",
//       amount: (contract.price * contract.deposit) / 100,
//       contractId: contract.contractId,
//     });
//     setIsPaymentModalVisible(true);
//   };

//   const handlePaymentConfirm = async () => {
//     if (!effectiveAccountId) {
//       toast.error("No valid account ID found.");
//       return;
//     }
//     if (!paymentData.fullName.trim()) {
//       toast.error("Full name cannot be empty!");
//       return;
//     }
//     setPaymentLoading(true);
//     try {
//       const paymentRequestData = {
//         fullName: paymentData.fullName,
//         orderInfo: `Deposit for contract ${paymentData.contractId}`,
//         amount: paymentData.amount,
//         purpose: 1,
//         accountId: effectiveAccountId,
//         ticketId: "",
//         ticketQuantity: "",
//         contractId: paymentData.contractId,
//         orderpaymentId: "",
//         isWeb: true,
//       };
//       const paymentUrl = await MyEventOrganizeService.DepositPayment(
//         paymentRequestData
//       );
//       window.location.href = paymentUrl;
//       toast.success("Redirecting to payment gateway...");
//     } catch (error) {
//       console.error("Error initiating deposit payment:", error);
//       toast.error(error.message || "Failed to process payment!");
//     } finally {
//       setPaymentLoading(false);
//       setIsPaymentModalVisible(false);
//       setSelectedRequestId(null);
//       setPaymentData({ fullName: "", amount: 0, contractId: "" });
//     }
//   };
//   // thay doi khi can validate completed
//   const handleRemainingPaymentRequest = async (contract) => {
//     if (!contract?.requestId || !contract?.contractId) {
//       toast.error("Invalid contract data");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Fetch tasks for the contract using MyEventOrganizeService
//       const tasks = await MyEventOrganizeService.getTaskByContractId(
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
//           "Cannot proceed with remaining payment: Not all tasks are completed."
//         );
//         return;
//       }

//       // If all tasks are completed, proceed with setting modal data
//       setSelectedRequestId(contract.requestId);
//       setModalData({
//         requestId: contract.requestId,
//         name: contract.contractName,
//         description: contract.description,
//         startDate: contract.startDate,
//         endDate: contract.endDate,
//         location: contract.location,
//         packageId: contract.packageId,
//         listCharacters: contract.charactersListResponse,
//         status: contract.status,
//         price: contract.price,
//         deposit: contract.deposit,
//         serviceId: contract.serviceId,
//         contractId: contract.contractId,
//       });
//       setRemainingPaymentData({
//         fullName: contract.createBy || "",
//         amount: contract.amount,
//         contractId: contract.contractId,
//       });
//       setIsRemainingPaymentModalVisible(true);
//     } catch (error) {
//       console.error("Error checking tasks for remaining payment:", error);
//       toast.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRemainingPaymentConfirm = async () => {
//     if (!effectiveAccountId) {
//       toast.error("No valid account ID found.");
//       return;
//     }
//     if (!remainingPaymentData.fullName.trim()) {
//       toast.error("Full name cannot be empty!");
//       return;
//     }
//     setPaymentLoading(true);
//     try {
//       const paymentRequestData = {
//         fullName: remainingPaymentData.fullName,
//         orderInfo: `Remaining payment for contract ${remainingPaymentData.contractId}`,
//         amount: remainingPaymentData.amount,
//         purpose: 2,
//         accountId: effectiveAccountId,
//         ticketId: "",
//         ticketQuantity: "",
//         contractId: remainingPaymentData.contractId,
//         orderpaymentId: "",
//         isWeb: true,
//       };
//       const paymentUrl = await MyEventOrganizeService.DepositPayment(
//         paymentRequestData
//       );
//       window.location.href = paymentUrl;
//       toast.success("Redirecting to payment gateway...");
//     } catch (error) {
//       console.error("Error initiating remaining payment:", error);
//       toast.error(error.message || "Failed to process payment!");
//     } finally {
//       setPaymentLoading(false);
//       setIsRemainingPaymentModalVisible(false);
//       setSelectedRequestId(null);
//       setRemainingPaymentData({ fullName: "", amount: 0, contractId: "" });
//     }
//   };

//   const handleFeedback = async (contractId) => {
//     try {
//       setLoading(true);
//       const contractCharacters =
//         await MyEventOrganizeService.getContractCharacters(contractId);
//       if (!contractCharacters || contractCharacters.length === 0) {
//         toast.error("No characters available for feedback.");
//         return;
//       }
//       setSelectedFeedbackData({ contractId, contractCharacters });
//       setIsFeedbackModalVisible(true);
//     } catch (error) {
//       console.error("Error fetching contract characters:", error);
//       toast.error(error.message || "Failed to load feedback data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewFeedback = async (contractId) => {
//     if (!contractId) {
//       toast.error("Invalid contract ID.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const feedbackData = await MyEventOrganizeService.getFeedbackByContractId(
//         effectiveAccountId,
//         contractId
//       );
//       if (!feedbackData.feedbacks || feedbackData.feedbacks.length === 0) {
//         toast.info("No feedback available for this contract.");
//         setViewFeedbackData({
//           contractId,
//           feedbacks: [],
//           cosplayerNames: {},
//         });
//       } else {
//         setViewFeedbackData({
//           contractId: feedbackData.contractId,
//           feedbacks: feedbackData.feedbacks,
//           cosplayerNames: feedbackData.cosplayerNames,
//         });
//       }
//       setIsViewFeedbackModalVisible(true);
//     } catch (error) {
//       console.error("Error fetching feedback:", error);
//       toast.error(error.message || "Failed to load feedback.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFeedbackSubmit = async (feedbackData) => {
//     try {
//       // setLoading(true);
//       await MyEventOrganizeService.createFeedback(
//         effectiveAccountId,
//         selectedFeedbackData.contractId,
//         {
//           feedbacks: feedbackData,
//         }
//       );
//       toast.success("Feedback submitted successfully!");

//       setIsFeedbackModalVisible(false);
//       setSelectedFeedbackData(null);
//       handleViewFeedback(selectedFeedbackData.contractId);
//       const contractData =
//         await MyEventOrganizeService.getAllContractByAccountId(
//           effectiveAccountId
//         );
//       const filteredContracts = [];
//       const seenContractIds = new Set();
//       for (const contract of contractData) {
//         if (seenContractIds.has(contract.contractId)) {
//           console.warn(`Duplicate contract ID: ${contract.contractId}`);
//           continue;
//         }
//         seenContractIds.add(contract.contractId);
//         try {
//           const requestData =
//             await MyEventOrganizeService.getRequestByRequestId(
//               contract.requestId
//             );
//           if (requestData.serviceId === "S003") {
//             filteredContracts.push({
//               contractId: contract.contractId,
//               requestId: contract.requestId,
//               contractName: contract.contractName || "N/A",
//               packageName: contract.packageName || "N/A",
//               price: contract.price || 0,
//               amount: contract.amount || 0,
//               deposit: contract.deposit || 0,
//               status: contract.status || "Unknown",
//               startDate: formatDate(contract.startDate),
//               endDate: formatDate(contract.endDate),
//               createBy: contract.createBy || "N/A",
//               createDate: formatDate(contract.createDate),
//               urlPdf: contract.urlPdf || "",
//               charactersListResponse: (
//                 requestData.charactersListResponse || []
//               ).map((char) => ({
//                 requestCharacterId: char.requestCharacterId || "",
//                 characterId: char.characterId,
//                 characterName: char.characterName || "Unknown Character",
//                 cosplayerId: char.cosplayerId || null,
//                 quantity: char.quantity || 1,
//                 description: char.description || "N/A",
//                 characterImages: char.characterImages || [],
//                 requestDateResponses: char.requestDateResponses || [],
//                 maxHeight: char.maxHeight,
//                 maxWeight: char.maxWeight,
//                 minHeight: char.minHeight,
//                 minWeight: char.minWeight,
//                 status: char.status,
//               })),
//               description: requestData.description || "N/A",
//               location: requestData.location || "N/A",
//               packageId: requestData.packageId || "N/A",
//               serviceId: requestData.serviceId,
//             });
//           }
//         } catch (error) {
//           console.error(
//             `Error fetching request for contract ${contract.contractId}:`,
//             error
//           );
//         }
//       }
//       setContracts(filteredContracts);
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//       toast.error(error.message || "Failed to submit feedback.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewPdf = (urlPdf) => {
//     if (!urlPdf) {
//       toast.error("No PDF URL available.");
//       return;
//     }
//     window.open(urlPdf, "_blank");
//   };

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       Pending: "primary",
//       Browsed: "success",
//       Created: "warning",
//       Deposited: "warning",
//       Completed: "success",
//       FinalSettlement: "success",
//       Feedbacked: "success",
//     };
//     return (
//       <Badge bg={statusColors[status] || "secondary"}>
//         {status || "Unknown"}
//       </Badge>
//     );
//   };

//   const RenderPendingItems = ({
//     items,
//     totalItems,
//     currentPage,
//     onPageChange,
//   }) => {
//     if (loading) {
//       return (
//         <div className="text-center">
//           <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
//         </div>
//       );
//     }
//     if (items.length === 0) {
//       return <p className="text-center">No pending requests found.</p>;
//     }
//     return (
//       <>
//         <Row className="g-4">
//           {items.map((request) => {
//             const isDepositMade = depositStatus[request.requestId] || false;
//             return (
//               <Col key={request.requestId} xs={12}>
//                 <Card className="event-card shadow">
//                   <Card.Body>
//                     <div className="d-flex flex-column flex-md-row gap-4">
//                       <div className="flex-grow-1">
//                         <div className="d-flex gap-3 position-relative">
//                           <div className="icon-circle">
//                             <FileText size={24} />
//                           </div>
//                           <div className="flex-grow-1">
//                             <div className="d-flex justify-content-between align-items-start">
//                               <h3 className="event-title mb-0">
//                                 {request.name} {getStatusBadge(request.status)}
//                               </h3>
//                             </div>
//                             <div className="text-muted small mt-1">
//                               <Calendar size={16} className="me-1" />
//                               Start Date: {request.startDate}
//                             </div>
//                             <div className="text-muted small mt-1">
//                               <Calendar size={16} className="me-1" />
//                               End Date: {request.endDate}
//                             </div>
//                             <div className="text-muted small mt-1">
//                               <DollarSign size={16} className="me-1" />
//                               Total Price:{" "}
//                               {(request.price || 0).toLocaleString()} VND
//                             </div>
//                             <div className="text-muted small mt-1">
//                               <MapPin size={16} className="me-1" />
//                               Location: {request.location}
//                             </div>
//                             {request.status === "Cancel" && request.reason && (
//                               <div
//                                 className="reason-text mt-1"
//                                 style={{ color: "red" }}
//                               >
//                                 <FileText size={16} className="me-1" />
//                                 Reason: {request.reason}
//                               </div>
//                             )}
//                             {request.status === "Browsed" &&
//                               request.charactersListResponse?.length > 0 &&
//                               request.charactersListResponse.every(
//                                 (char) => char.cosplayerId != null
//                               ) &&
//                               !isDepositMade && (
//                                 <div
//                                   className="position-absolute"
//                                   style={{
//                                     bottom: 0,
//                                     right: 0,
//                                     background: "#1890ff",
//                                     color: "white",
//                                     padding: "4px 8px",
//                                     borderRadius: "4px",
//                                     fontSize: "12px",
//                                   }}
//                                 >
//                                   Cosplayer is Assigned, please choose Deposit
//                                 </div>
//                               )}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-md-end">
//                         <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                           {request.status === "Pending" && (
//                             <Button
//                               type="primary"
//                               className="btn-view-edit"
//                               onClick={() => handleViewEditRequest(request)}
//                               aria-label="Edit request"
//                             >
//                               <Eye size={16} className="me-1" />
//                               Edit
//                             </Button>
//                           )}
//                           <Button
//                             type="default"
//                             className="btn-view-details"
//                             onClick={() =>
//                               handleViewDetailsRequest(request.requestId)
//                             }
//                             aria-label="View request details"
//                           >
//                             <Eye size={16} className="me-1" />
//                             View Details
//                           </Button>
//                           {request.status === "Browsed" &&
//                             request.charactersListResponse?.length > 0 &&
//                             request.charactersListResponse.every(
//                               (char) => char.cosplayerId != null
//                             ) && (
//                               <Button
//                                 className="btn-deposit"
//                                 onClick={() => handleDepositRequest(request)}
//                                 aria-label="Choose deposit"
//                                 disabled={isDepositMade}
//                               >
//                                 <CreditCard size={16} className="me-1" />
//                                 Choose Deposit
//                               </Button>
//                             )}
//                         </div>
//                       </div>
//                     </div>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             );
//           })}
//         </Row>
//         <Row className="mt-5 align-items-center">
//           <Col xs={12} sm={6} className="mb-3 mb-sm-0">
//             <p className="mb-0">
//               Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
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

//   const RenderItemList = ({
//     items,
//     totalItems,
//     currentPage,
//     onPageChange,
//     onAction,
//     actionLabel,
//     actionIcon,
//     isCompletedTab = false,
//   }) => {
//     console.log("Completed Contracts Items:", items);
//     if (loading) {
//       return (
//         <div className="text-center">
//           <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
//         </div>
//       );
//     }
//     if (items.length === 0) {
//       return <p className="text-center">No items found.</p>;
//     }
//     return (
//       <>
//         <Row className="g-4">
//           {items.map((item) => (
//             <Col key={item.contractId} xs={12}>
//               <Card className="event-card shadow">
//                 <Card.Body>
//                   <div className="d-flex flex-column flex-md-row gap-4">
//                     <div className="flex-grow-1">
//                       <div className="d-flex gap-3">
//                         <div className="icon-circle">
//                           <FileText size={24} />
//                         </div>
//                         <div className="flex-grow-1">
//                           <div className="d-flex justify-content-between align-items-start">
//                             <h3 className="event-title mb-0">
//                               {item.contractName} &nbsp;
//                               {getStatusBadge(item.status)}
//                             </h3>
//                           </div>
//                           <div className="text-muted small mt-1">
//                             <Calendar size={16} className="me-1" />
//                             Start Date: {item.startDate}
//                           </div>
//                           <div className="text-muted small mt-1">
//                             <Calendar size={16} className="me-1" />
//                             End Date: {item.endDate}
//                           </div>
//                           <div className="text-muted small mt-1">
//                             <DollarSign size={16} className="me-1" />
//                             Total Price: {(
//                               item.price || 0
//                             ).toLocaleString()}{" "}
//                             VND
//                           </div>
//                           {item.deposit && (
//                             <div className="text-muted small mt-1">
//                               <CircleDollarSign size={16} className="me-1" />
//                               Deposit: {item.deposit}%
//                             </div>
//                           )}
//                           {item.status && item.status === "Deposited" && (
//                             <div className="text-muted small mt-1">
//                               <DollarSign size={16} className="me-1" />
//                               Amount:{" "}
//                               {(item.amount > 0
//                                 ? item.amount
//                                 : 0
//                               ).toLocaleString()}{" "}
//                               VND
//                             </div>
//                           )}

//                           {item.packageName && (
//                             <div className="text-muted small mt-1">
//                               <Package size={16} className="me-1" />
//                               Package Name: {item.packageName}
//                             </div>
//                           )}

//                           <div className="text-muted small mt-1">
//                             <MapPin size={16} className="me-1" />
//                             Location: {item.location}
//                           </div>
//                           {item.createBy && (
//                             <div className="text-muted small mt-1">
//                               <User size={16} className="me-1" />
//                               Created By: {item.createBy}
//                             </div>
//                           )}
//                           {item.createDate && (
//                             <div className="text-muted small mt-1">
//                               <Calendar size={16} className="me-1" />
//                               Create Date: {item.createDate}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-md-end">
//                       <div className="d-flex gap-2 justify-content-md-end flex-wrap">
//                         <Button
//                           type="primary"
//                           className="btn-view-edit"
//                           onClick={() =>
//                             handleViewDetailsRequest(item.requestId)
//                           }
//                           aria-label="View contract"
//                         >
//                           <Eye size={16} className="me-1" />
//                           View
//                         </Button>
//                         {onAction && (
//                           <Button
//                             type="default"
//                             className="btn-action"
//                             onClick={() => onAction(item)}
//                             aria-label={actionLabel}
//                           >
//                             {actionIcon}
//                             {actionLabel}
//                           </Button>
//                         )}
//                         {item.urlPdf &&
//                           typeof item.urlPdf === "string" &&
//                           item.urlPdf.trim() !== "" && (
//                             <Button
//                               type="default"
//                               className="btn-view-pdf"
//                               onClick={() => handleViewPdf(item.urlPdf)}
//                               aria-label="View Contract PDF"
//                             >
//                               <File size={16} className="me-1" />
//                               View Contract PDF
//                             </Button>
//                           )}
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
//               Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
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
//             <div className="status-filter mb-4">
//               <strong>Filter by Status: </strong>
//               <Checkbox
//                 checked={selectedStatuses.includes("Pending")}
//                 onChange={() => handleStatusFilterChange("Pending")}
//               >
//                 Pending
//               </Checkbox>
//               <Checkbox
//                 checked={selectedStatuses.includes("Browsed")}
//                 onChange={() => handleStatusFilterChange("Browsed")}
//               >
//                 Browsed
//               </Checkbox>
//               <Checkbox
//                 checked={selectedStatuses.includes("Cancel")}
//                 onChange={() => handleStatusFilterChange("Cancel")}
//               >
//                 Cancel
//               </Checkbox>
//             </div>
//             <RenderPendingItems
//               items={currentPendingItems}
//               totalItems={filteredPendingRequests.length}
//               currentPage={currentPendingPage}
//               onPageChange={handlePendingPageChange}
//             />
//           </TabPane>
//           <TabPane tab="Payment Deposit Contract" key="2">
//             <RenderItemList
//               items={currentCreatedItems}
//               totalItems={filteredCreatedContracts.length}
//               currentPage={currentCreatedPage}
//               onPageChange={handleCreatedPageChange}
//               onAction={(contract) => handlePaymentRequest(contract)}
//               actionLabel="Payment Deposit"
//               actionIcon={<CreditCard size={16} className="me-1" />}
//             />
//           </TabPane>
//           <TabPane tab="Remaining Payment" key="3">
//             <RenderItemList
//               items={currentDepositedItems}
//               totalItems={filteredDepositedContracts.length}
//               currentPage={currentDepositedPage}
//               onPageChange={handleDepositedPageChange}
//               onAction={(contract) => handleRemainingPaymentRequest(contract)}
//               actionLabel="Payment Amount"
//               actionIcon={<CreditCard size={16} className="me-1" />}
//             />
//           </TabPane>
//           <TabPane tab="Completed Contract" key="4">
//             <RenderItemList
//               items={currentCompletedItems}
//               totalItems={filteredCompletedContracts.length} // Sửa lỗi cú pháp
//               currentPage={currentCompletedPage}
//               onPageChange={handleCompletedPageChange}
//               isCompletedTab={true}
//             />
//           </TabPane>
//         </Tabs>
//         {/* Các modal khác */}
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
//           <p>Total price: {(modalData.price || 0).toLocaleString()} VND</p>
//           <p>Please select deposit:</p>
//           <Radio.Group
//             onChange={(e) => setDepositAmount(e.target.value)}
//             value={depositAmount}
//           >
//             <Radio value={30}>
//               30% ({((modalData.price || 0) * 0.3).toLocaleString()})
//             </Radio>
//             <Radio value={50}>
//               50% ({((modalData.price || 0) * 0.5).toLocaleString()})
//             </Radio>
//             <Radio value={70}>
//               70% ({((modalData.price || 0) * 0.7).toLocaleString()})
//             </Radio>
//           </Radio.Group>
//         </Modal>
//         <Modal
//           title="Payment Deposit"
//           open={isPaymentModalVisible}
//           onOk={handlePaymentConfirm}
//           onCancel={() => {
//             setIsPaymentModalVisible(false);
//             setPaymentData({ fullName: "", amount: 0, contractId: "" });
//           }}
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
//                 value={paymentData.fullName}
//                 onChange={(e) =>
//                   setPaymentData({ ...paymentData, fullName: e.target.value })
//                 }
//                 placeholder="Enter your full name"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Amount (VND)</strong>
//               </Form.Label>
//               <Input value={paymentData.amount.toLocaleString()} readOnly />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Purpose</strong>
//               </Form.Label>
//               <Input value="Deposit Contract" readOnly />
//             </Form.Group>
//           </Form>
//         </Modal>
//         <Modal
//           title="Remaining Payment"
//           open={isRemainingPaymentModalVisible}
//           onOk={handleRemainingPaymentConfirm}
//           onCancel={() => {
//             setIsRemainingPaymentModalVisible(false);
//             setRemainingPaymentData({
//               fullName: "",
//               amount: 0,
//               contractId: "",
//             });
//           }}
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
//                 value={remainingPaymentData.fullName}
//                 onChange={(e) =>
//                   setRemainingPaymentData({
//                     ...remainingPaymentData,
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
//                 value={remainingPaymentData.amount.toLocaleString()}
//                 readOnly
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Purpose</strong>
//               </Form.Label>
//               <Input value="Complete Amount" readOnly />
//             </Form.Group>
//           </Form>
//         </Modal>
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
//               accountId={effectiveAccountId}
//               onCancel={() => {
//                 setIsFeedbackModalVisible(false);
//                 setSelectedFeedbackData(null);
//               }}
//               onSuccess={handleFeedbackSubmit}
//             />
//           )}
//         </Modal>
//         <Modal
//           title={`Feedback for Contract ${viewFeedbackData.contractId}`}
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
//             <div className="text-center">
//               <Spin
//                 indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
//               />
//             </div>
//           ) : viewFeedbackData.feedbacks.length > 0 ? (
//             <List
//               dataSource={viewFeedbackData.feedbacks}
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
//         {/* Tích hợp component EditEventOrganize */}
//         <EditEventOrganize
//           visible={isViewEditModalVisible}
//           onOk={() => setIsViewEditModalVisible(false)}
//           onCancel={() => setIsViewEditModalVisible(false)}
//           modalData={modalData}
//           setModalData={setModalData}
//           packages={packages}
//           characters={characters}
//           requests={requests}
//           setRequests={setRequests}
//         />
//       </Container>
//     </div>
//   );
// };
// export default MyEventOrganize;

// huy va loc contract =======================================
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import {
  Pagination,
  Modal,
  Button,
  Tabs,
  Radio,
  message,
  Input,
  List,
  Spin,
  Rate,
  Checkbox,
} from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyEventOrganize.scss";
import ViewMyEventOrganize from "./ViewMyEventOrganize";
import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
import DetailEventOrganizationPageService from "../../services/DetailEventOrganizationPageService/DetailEventOrganizationPageService";
import FeedbackHireCosplayer from "../MyHistoryPage/FeedbackHireCosplayer";
import {
  FileText,
  Calendar,
  Eye,
  CreditCard,
  DollarSign,
  MapPin,
  File,
  Star,
  CircleDollarSign,
  Package,
  User,
} from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import EditEventOrganize from "./EditEventOrganize";

const { TabPane } = Tabs;
const { TextArea } = Input;

const formatDate = (date) =>
  !date || date === "null" || date === "undefined" || date === ""
    ? "N/A"
    : dayjs(
        date,
        ["HH:mm DD/MM/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
        true
      ).isValid()
    ? dayjs(date, ["HH:mm DD/MM/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).format(
        "DD/MM/YYYY"
      )
    : "Invalid Date";

const MyEventOrganize = () => {
  const { id: accountId } = useParams();
  const [requests, setRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [filteredCreatedContracts, setFilteredCreatedContracts] = useState([]);
  const [filteredDepositedContracts, setFilteredDepositedContracts] = useState(
    []
  );
  const [filteredCompletedContracts, setFilteredCompletedContracts] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentCreatedPage, setCurrentCreatedPage] = useState(1);
  const [currentDepositedPage, setCurrentDepositedPage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([
    "Pending",
    "Browsed",
    "Cancel",
  ]);
  const [isViewDetailsModalVisible, setIsViewDetailsModalVisible] =
    useState(false);
  const [isViewEditModalVisible, setIsViewEditModalVisible] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isRemainingPaymentModalVisible, setIsRemainingPaymentModalVisible] =
    useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [isViewFeedbackModalVisible, setIsViewFeedbackModalVisible] =
    useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelContractId, setCancelContractId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedFeedbackData, setSelectedFeedbackData] = useState(null);
  const [viewFeedbackData, setViewFeedbackData] = useState({
    contractId: "",
    feedbacks: [],
    cosplayerNames: {},
  });
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
    contractId: "",
  });
  const [depositAmount, setDepositAmount] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [packages, setPackages] = useState([]);
  const [paymentData, setPaymentData] = useState({
    fullName: "",
    amount: 0,
    contractId: "",
  });
  const [remainingPaymentData, setRemainingPaymentData] = useState({
    fullName: "",
    amount: 0,
    contractId: "",
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [packagePrice, setPackagePrice] = useState(0);
  const [characterPrices, setCharacterPrices] = useState({});
  const [depositStatus, setDepositStatus] = useState({});
  const itemsPerPage = 5;

  const getAccountIdFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.Id || decodedToken.sub || decodedToken.accountId;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const effectiveAccountId = accountId || getAccountIdFromToken();

  const handleStatusFilterChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
    setCurrentPendingPage(1);
  };

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
      const requestStatus = response.status;

      if (requestStatus === "Browsed") {
        setIsViewEditModalVisible(false);
        toast.info("Status request has changed, please reload the page!");
        setLoading(false);
        return;
      } else if (requestStatus === "Pending") {
        setIsViewEditModalVisible(true);
      } else {
        setIsViewEditModalVisible(false);
        toast.warn("Request status does not allow editing.");
        setLoading(false);
        return;
      }

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
    } catch (error) {
      console.error("Error fetching request details:", error);
      toast.error("Failed to load request details.");
      setIsViewEditModalVisible(false);
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
    try {
      await MyEventOrganizeService.chooseDeposit(selectedRequestId, {
        deposit: depositAmount.toString(),
      });
      setRequests((prev) =>
        prev.map((req) =>
          req.requestId === selectedRequestId
            ? { ...req, deposit: depositAmount }
            : req
        )
      );
      toast.success(`Deposit of ${depositAmount}% confirmed!`);
    } catch (error) {
      toast.error("Failed to update deposit.");
      console.error("Error updating deposit:", error);
    }
    setIsDepositModalVisible(false);
    setDepositAmount(null);
    setSelectedRequestId(null);
    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  const handlePaymentRequest = (contract) => {
    if (!contract?.requestId || !contract?.contractId) {
      toast.error("Invalid contract data");
      return;
    }
    setSelectedRequestId(contract.requestId);
    setModalData({
      requestId: contract.requestId,
      name: contract.contractName,
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
      contractId: contract.contractId,
    });
    setPaymentData({
      fullName: contract.createBy || "",
      amount: (contract.price * contract.deposit) / 100,
      contractId: contract.contractId,
    });
    setIsPaymentModalVisible(true);
  };

  const handlePaymentConfirm = async () => {
    if (!effectiveAccountId) {
      toast.error("No valid account ID found.");
      return;
    }
    if (!paymentData.fullName.trim()) {
      toast.error("Full name cannot be empty!");
      return;
    }
    setPaymentLoading(true);
    try {
      const paymentRequestData = {
        fullName: paymentData.fullName,
        orderInfo: `Deposit for contract ${paymentData.contractId}`,
        amount: paymentData.amount,
        purpose: 1,
        accountId: effectiveAccountId,
        ticketId: "",
        ticketQuantity: "",
        contractId: paymentData.contractId,
        orderpaymentId: "",
        isWeb: true,
      };
      const paymentUrl = await MyEventOrganizeService.DepositPayment(
        paymentRequestData
      );
      window.location.href = paymentUrl;
      toast.success("Redirecting to payment gateway...");
    } catch (error) {
      console.error("Error initiating deposit payment:", error);
      toast.error(error.message || "Failed to process payment!");
    } finally {
      setPaymentLoading(false);
      setIsPaymentModalVisible(false);
      setSelectedRequestId(null);
      setPaymentData({ fullName: "", amount: 0, contractId: "" });
    }
  };

  const handleRemainingPaymentRequest = async (contract) => {
    if (!contract?.requestId || !contract?.contractId) {
      toast.error("Invalid contract data");
      return;
    }
    setLoading(true);
    try {
      const tasks = await MyEventOrganizeService.getTaskByContractId(
        contract.contractId
      );
      if (!Array.isArray(tasks)) {
        throw new Error("Invalid tasks data received.");
      }
      const allTasksCompleted = tasks.every(
        (task) => task.status === "Completed"
      );
      if (!allTasksCompleted) {
        toast.error(
          "Cannot proceed with remaining payment: Not all tasks are completed."
        );
        return;
      }
      setSelectedRequestId(contract.requestId);
      setModalData({
        requestId: contract.requestId,
        name: contract.contractName,
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
        contractId: contract.contractId,
      });
      setRemainingPaymentData({
        fullName: contract.createBy || "",
        amount: contract.amount,
        contractId: contract.contractId,
      });
      setIsRemainingPaymentModalVisible(true);
    } catch (error) {
      console.error("Error checking tasks for remaining payment:", error);
      toast.error(error.message || "Failed to process remaining payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemainingPaymentConfirm = async () => {
    if (!effectiveAccountId) {
      toast.error("No valid account ID found.");
      return;
    }
    if (!remainingPaymentData.fullName.trim()) {
      toast.error("Full name cannot be empty!");
      return;
    }
    setPaymentLoading(true);
    try {
      const paymentRequestData = {
        fullName: remainingPaymentData.fullName,
        orderInfo: `Remaining payment for contract ${remainingPaymentData.contractId}`,
        amount: remainingPaymentData.amount,
        purpose: 2,
        accountId: effectiveAccountId,
        ticketId: "",
        ticketQuantity: "",
        contractId: remainingPaymentData.contractId,
        orderpaymentId: "",
        isWeb: true,
      };
      const paymentUrl = await MyEventOrganizeService.DepositPayment(
        paymentRequestData
      );
      window.location.href = paymentUrl;
      toast.success("Redirecting to payment gateway...");
    } catch (error) {
      console.error("Error initiating remaining payment:", error);
      toast.error(error.message || "Failed to process payment!");
    } finally {
      setPaymentLoading(false);
      setIsRemainingPaymentModalVisible(false);
      setSelectedRequestId(null);
      setRemainingPaymentData({ fullName: "", amount: 0, contractId: "" });
    }
  };

  const handleFeedback = async (contractId) => {
    try {
      setLoading(true);
      const contractCharacters =
        await MyEventOrganizeService.getContractCharacters(contractId);
      if (!contractCharacters || contractCharacters.length === 0) {
        toast.error("No characters available for feedback.");
        return;
      }
      setSelectedFeedbackData({ contractId, contractCharacters });
      setIsFeedbackModalVisible(true);
    } catch (error) {
      console.error("Error fetching contract characters:", error);
      toast.error(error.message || "Failed to load feedback data.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewFeedback = async (contractId) => {
    if (!contractId) {
      toast.error("Invalid contract ID.");
      return;
    }
    setLoading(true);
    try {
      const feedbackData = await MyEventOrganizeService.getFeedbackByContractId(
        effectiveAccountId,
        contractId
      );
      if (!feedbackData.feedbacks || feedbackData.feedbacks.length === 0) {
        toast.info("No feedback available for this contract.");
        setViewFeedbackData({
          contractId,
          feedbacks: [],
          cosplayerNames: {},
        });
      } else {
        setViewFeedbackData({
          contractId: feedbackData.contractId,
          feedbacks: feedbackData.feedbacks,
          cosplayerNames: feedbackData.cosplayerNames,
        });
      }
      setIsViewFeedbackModalVisible(true);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error(error.message || "Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (feedbackData) => {
    try {
      await MyEventOrganizeService.createFeedback(
        effectiveAccountId,
        selectedFeedbackData.contractId,
        { feedbacks: feedbackData }
      );
      toast.success("Feedback submitted successfully!");
      setIsFeedbackModalVisible(false);
      setSelectedFeedbackData(null);
      handleViewFeedback(selectedFeedbackData.contractId);
      const contractData =
        await MyEventOrganizeService.getAllContractByAccountId(
          effectiveAccountId
        );
      const filteredContracts = [];
      const seenContractIds = new Set();
      for (const contract of contractData) {
        if (seenContractIds.has(contract.contractId)) {
          console.warn(`Duplicate contract ID: ${contract.contractId}`);
          continue;
        }
        seenContractIds.add(contract.contractId);
        try {
          const requestData =
            await MyEventOrganizeService.getRequestByRequestId(
              contract.requestId
            );
          if (requestData.serviceId === "S003") {
            filteredContracts.push({
              contractId: contract.contractId,
              requestId: contract.requestId,
              contractName: contract.contractName || "N/A",
              packageName: contract.packageName || "N/A",
              price: contract.price || 0,
              amount: contract.amount || 0,
              deposit: contract.deposit || 0,
              status: contract.status || "Unknown",
              startDate: formatDate(contract.startDate),
              endDate: formatDate(contract.endDate),
              createBy: contract.createBy || "N/A",
              createDate: formatDate(contract.createDate),
              urlPdf: contract.urlPdf || "",
              reason: contract.reason || null,
              charactersListResponse: (
                requestData.charactersListResponse || []
              ).map((char) => ({
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
              })),
              description: requestData.description || "N/A",
              location: requestData.location || "N/A",
              packageId: requestData.packageId || "N/A",
              serviceId: requestData.serviceId,
            });
          }
        } catch (error) {
          console.error(
            `Error fetching request for contract ${contract.contractId}:`,
            error
          );
        }
      }
      setContracts(filteredContracts);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPdf = (urlPdf) => {
    if (!urlPdf) {
      toast.error("No PDF URL available.");
      return;
    }
    window.open(urlPdf, "_blank");
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
      await MyEventOrganizeService.cancelContract(
        cancelContractId,
        encodedReason
      );
      toast.success("Contract canceled successfully!");
      const contractData =
        await MyEventOrganizeService.getAllContractByAccountId(
          effectiveAccountId
        );
      const filteredContracts = [];
      const seenContractIds = new Set();
      for (const contract of contractData) {
        if (seenContractIds.has(contract.contractId)) {
          console.warn(`Duplicate contract ID: ${contract.contractId}`);
          continue;
        }
        seenContractIds.add(contract.contractId);
        try {
          const requestData =
            await MyEventOrganizeService.getRequestByRequestId(
              contract.requestId
            );
          if (requestData.serviceId === "S003") {
            filteredContracts.push({
              contractId: contract.contractId,
              requestId: contract.requestId,
              contractName: contract.contractName || "N/A",
              packageName: contract.packageName || "N/A",
              price: contract.price || 0,
              amount: contract.amount || 0,
              deposit: contract.deposit || 0,
              status: contract.status || "Unknown",
              startDate: formatDate(contract.startDate),
              endDate: formatDate(contract.endDate),
              createBy: contract.createBy || "N/A",
              createDate: formatDate(contract.createDate),
              urlPdf: contract.urlPdf || "",
              reason: contract.reason || null,
              charactersListResponse: (
                requestData.charactersListResponse || []
              ).map((char) => ({
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
              })),
              description: requestData.description || "N/A",
              location: requestData.location || "N/A",
              packageId: requestData.packageId || "N/A",
              serviceId: requestData.serviceId,
            });
          }
        } catch (error) {
          console.error(
            `Error fetching request for contract ${contract.contractId}:`,
            error
          );
        }
      }
      setContracts(filteredContracts);
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
      if (!effectiveAccountId) {
        toast.error("No valid account ID found.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await MyEventOrganizeService.getAllRequestByAccountId(
          effectiveAccountId
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
          reason: request.reason || null,
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
        toast.error("Failed to load requests.");
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchContracts = async () => {
      if (!effectiveAccountId) {
        toast.error("No valid account ID found.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const contractData =
          await MyEventOrganizeService.getAllContractByAccountId(
            effectiveAccountId
          );
        const filteredContracts = [];
        const seenContractIds = new Set();
        for (const contract of contractData) {
          if (seenContractIds.has(contract.contractId)) {
            console.warn(`Duplicate contract ID: ${contract.contractId}`);
            continue;
          }
          seenContractIds.add(contract.contractId);
          try {
            const requestData =
              await MyEventOrganizeService.getRequestByRequestId(
                contract.requestId
              );
            if (requestData.serviceId === "S003") {
              filteredContracts.push({
                contractId: contract.contractId,
                requestId: contract.requestId,
                contractName: contract.contractName || "N/A",
                packageName: contract.packageName || "N/A",
                price: contract.price || 0,
                amount: contract.amount || 0,
                deposit: contract.deposit || 0,
                status: contract.status || "Unknown",
                startDate: formatDate(contract.startDate),
                endDate: formatDate(contract.endDate),
                createBy: contract.createBy || "N/A",
                createDate: formatDate(contract.createDate),
                urlPdf: contract.urlPdf || "",
                reason: contract.reason || null,
                charactersListResponse: (
                  requestData.charactersListResponse || []
                ).map((char) => ({
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
                })),
                description: requestData.description || "N/A",
                location: requestData.location || "N/A",
                packageId: requestData.packageId || "N/A",
                serviceId: requestData.serviceId,
              });
            }
          } catch (error) {
            console.error(
              `Error fetching request for contract ${contract.contractId}:`,
              error
            );
          }
        }
        setContracts(filteredContracts);
      } catch (error) {
        toast.error("Failed to load contracts.");
        console.error("Error fetching contracts:", error);
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
    fetchContracts();
    fetchPackages();
    fetchCharacters();
  }, [effectiveAccountId]);

  useEffect(() => {
    if (requests.length > 0) {
      const contractRequestIds = new Set(contracts.map((c) => c.requestId));
      let filtered = requests
        .filter((request) => !contractRequestIds.has(request.requestId))
        .filter((request) =>
          selectedStatuses.length === 0
            ? false
            : selectedStatuses.includes(request.status)
        )
        .filter(
          (request) =>
            request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.startDate.includes(searchTerm)
        );
      setFilteredPendingRequests(filtered);
    }

    const filterContractsBySearch = (contracts) =>
      contracts.filter(
        (contract) =>
          contract.contractName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          contract.startDate.includes(searchTerm)
      );

    setFilteredCreatedContracts(
      filterContractsBySearch(
        contracts.filter((c) => c.status === "Created" || c.status === "Cancel")
      )
    );
    setFilteredDepositedContracts(
      filterContractsBySearch(contracts.filter((c) => c.status === "Deposited"))
    );
    setFilteredCompletedContracts(
      filterContractsBySearch(
        contracts.filter(
          (c) =>
            c.status === "Completed" ||
            c.status === "FinalSettlement" ||
            c.status === "Feedbacked"
        )
      )
    );
  }, [searchTerm, requests, contracts, selectedStatuses]);

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
        const totalCharPrice = modalData.listCharacters.reduce(
          (sum, char) =>
            sum + (newCharPrices[char.characterId] || 0) * (char.quantity || 1),
          0
        );
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

  useEffect(() => {
    const fetchDepositStatus = async () => {
      const status = {};
      for (const request of filteredPendingRequests) {
        try {
          const response = await MyEventOrganizeService.getRequestByRequestId(
            request.requestId
          );
          status[request.requestId] = parseFloat(response.deposit) > 1;
        } catch (error) {
          console.error(
            `Error fetching deposit for request ${request.requestId}:`,
            error
          );
          status[request.requestId] = false;
        }
      }
      setDepositStatus(status);
    };

    if (filteredPendingRequests.length > 0) {
      fetchDepositStatus();
    }
  }, [filteredPendingRequests]);

  const paginateItems = (items, currentPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const currentPendingItems = paginateItems(
    filteredPendingRequests,
    currentPendingPage
  );
  const currentCreatedItems = paginateItems(
    filteredCreatedContracts,
    currentCreatedPage
  );
  const currentDepositedItems = paginateItems(
    filteredDepositedContracts,
    currentDepositedPage
  );
  const currentCompletedItems = paginateItems(
    filteredCompletedContracts,
    currentCompletedPage
  );

  const handlePendingPageChange = (page) => setCurrentPendingPage(page);
  const handleCreatedPageChange = (page) => setCurrentCreatedPage(page);
  const handleDepositedPageChange = (page) => setCurrentDepositedPage(page);
  const handleCompletedPageChange = (page) => setCurrentCompletedPage(page);

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Created: "warning",
      Deposited: "warning",
      Completed: "success",
      FinalSettlement: "success",
      Feedbacked: "success",
      Cancel: "danger",
    };
    return (
      <Badge bg={statusColors[status] || "secondary"}>
        {status || "Unknown"}
      </Badge>
    );
  };

  const RenderPendingItems = ({
    items,
    totalItems,
    currentPage,
    onPageChange,
  }) => {
    if (loading) {
      return (
        <div className="text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      );
    }
    if (items.length === 0) {
      return <p className="text-center">No pending requests found.</p>;
    }
    return (
      <>
        <Row className="g-4">
          {items.map((request) => {
            const isDepositMade = depositStatus[request.requestId] || false;
            return (
              <Col key={request.requestId} xs={12}>
                <Card className="event-card shadow">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row gap-4">
                      <div className="flex-grow-1">
                        <div className="d-flex gap-3 position-relative">
                          <div className="icon-circle">
                            <FileText size={24} />
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <h3 className="event-title mb-0">
                                {request.name} {getStatusBadge(request.status)}
                              </h3>
                            </div>
                            <div>
                              <Calendar size={16} className="me-1" />
                              Start Date: {request.startDate}
                            </div>
                            <div>
                              <Calendar size={16} className="me-1" />
                              End Date: {request.endDate}
                            </div>
                            <div>
                              <DollarSign size={16} className="me-1" />
                              Total Price:{" "}
                              {(request.price || 0).toLocaleString()} VND
                            </div>
                            <div>
                              <MapPin size={16} className="me-1" />
                              Location: {request.location}
                            </div>
                            {request.status === "Cancel" && request.reason && (
                              <div
                                className="reason-text mt-1"
                                style={{ color: "red" }}
                              >
                                <FileText size={16} className="me-1" />
                                Reason: {request.reason}
                              </div>
                            )}
                            {request.status === "Browsed" &&
                              request.charactersListResponse?.length > 0 &&
                              request.charactersListResponse.every(
                                (char) => char.cosplayerId != null
                              ) &&
                              !isDepositMade && (
                                <div
                                  className="position-absolute"
                                  style={{
                                    bottom: 0,
                                    right: 0,
                                    background: "#1890ff",
                                    color: "white",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                  }}
                                >
                                  Cosplayer is Assigned, please choose Deposit
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="text-md-end">
                        <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                          {request.status === "Pending" && (
                            <Button
                              type="primary"
                              className="btn-view-edit"
                              onClick={() => handleViewEditRequest(request)}
                              aria-label="Edit request"
                            >
                              <Eye size={16} className="me-1" />
                              Edit
                            </Button>
                          )}
                          <Button
                            type="default"
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
                                className="btn-deposit"
                                onClick={() => handleDepositRequest(request)}
                                aria-label="Choose deposit"
                                disabled={isDepositMade}
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
            );
          })}
        </Row>
        <Row className="mt-5 align-items-center">
          <Col xs={12} sm={6} className="mb-3 mb-sm-0">
            <p className="mb-0">
              Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
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

  const RenderItemList = ({
    items,
    totalItems,
    currentPage,
    onPageChange,
    onAction,
    actionLabel,
    actionIcon,
    isCompletedTab = false,
  }) => {
    if (loading) {
      return (
        <div className="text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      );
    }
    if (items.length === 0) {
      return <p className="text-center">No items found.</p>;
    }
    return (
      <>
        <Row className="g-4">
          {items.map((item) => (
            <Col key={item.contractId} xs={12}>
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
                              {item.contractName} {getStatusBadge(item.status)}
                            </h3>
                          </div>
                          {item.packageName && (
                            <div>
                              <Package size={16} className="me-1" />
                              Package Name: {item.packageName}
                            </div>
                          )}

                          <div>
                            <DollarSign size={16} className="me-1" />
                            Total Price: {(
                              item.price || 0
                            ).toLocaleString()}{" "}
                            VND
                          </div>
                          {item.deposit && (
                            <div>
                              <DollarSign size={16} className="me-1" />
                              Deposit: {item.deposit}%
                            </div>
                          )}
                          {item.status === "Deposited" && (
                            <div>
                              <DollarSign size={16} className="me-1" />
                              Amount: {(item.amount || 0).toLocaleString()} VND
                            </div>
                          )}
                          <div>
                            <Calendar size={16} className="me-1" />
                            Start Date: {item.startDate}
                          </div>
                          <div>
                            <Calendar size={16} className="me-1" />
                            End Date: {item.endDate}
                          </div>
                          {item.createDate && (
                            <div>
                              <Calendar size={16} className="me-1" />
                              Create Date: {item.createDate}
                            </div>
                          )}
                          {item.createBy && (
                            <div>
                              <User size={16} className="me-1" />
                              Created By: {item.createBy}
                            </div>
                          )}

                          {item.location && (
                            <div>
                              <MapPin size={16} className="me-1" />
                              Location: {item.location}
                            </div>
                          )}

                          {item.status === "Cancel" && item.reason && (
                            <div
                              className="reason-text mt-1"
                              style={{ color: "red" }}
                            >
                              <FileText size={16} className="me-1" />
                              Reason: {item.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-md-end">
                      <div className="d-flex gap-2 justify-content-md-end flex-wrap">
                        <Button
                          type="primary"
                          className="btn-view-edit"
                          onClick={() =>
                            handleViewDetailsRequest(item.requestId)
                          }
                          aria-label="View contract"
                        >
                          <Eye size={16} className="me-1" />
                          View
                        </Button>
                        {(onAction && item.status === "Created") ||
                          (item.status === "Deposited" && (
                            <Button
                              type="default"
                              className="btn-action"
                              onClick={() => onAction(item)}
                              aria-label={actionLabel}
                            >
                              {actionIcon}
                              {actionLabel}
                            </Button>
                          ))}
                        {item.urlPdf &&
                          typeof item.urlPdf === "string" &&
                          item.urlPdf.trim() !== "" && (
                            <Button
                              type="default"
                              className="btn-view-pdf"
                              onClick={() => handleViewPdf(item.urlPdf)}
                              aria-label="View Contract PDF"
                            >
                              <File size={16} className="me-1" />
                              View Contract PDF
                            </Button>
                          )}
                        {item.status === "Created" && (
                          <Button
                            type="default"
                            className="btn-cancel btn-outline-danger"
                            onClick={() =>
                              handleCancelContract(item.contractId)
                            }
                            aria-label="Cancel Contract"
                          >
                            <FileText size={16} className="me-1" />
                            Cancel Contract
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
              Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
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
            <div className="status-filter mb-4">
              <strong>Filter by Status: </strong>
              <Checkbox
                checked={selectedStatuses.includes("Pending")}
                onChange={() => handleStatusFilterChange("Pending")}
              >
                Pending
              </Checkbox>
              <Checkbox
                checked={selectedStatuses.includes("Browsed")}
                onChange={() => handleStatusFilterChange("Browsed")}
              >
                Browsed
              </Checkbox>
              <Checkbox
                checked={selectedStatuses.includes("Cancel")}
                onChange={() => handleStatusFilterChange("Cancel")}
              >
                Cancel
              </Checkbox>
            </div>
            <RenderPendingItems
              items={currentPendingItems}
              totalItems={filteredPendingRequests.length}
              currentPage={currentPendingPage}
              onPageChange={handlePendingPageChange}
            />
          </TabPane>
          <TabPane tab="Payment Deposit Contract" key="2">
            <RenderItemList
              items={currentCreatedItems}
              totalItems={filteredCreatedContracts.length}
              currentPage={currentCreatedPage}
              onPageChange={handleCreatedPageChange}
              onAction={(contract) => handlePaymentRequest(contract)}
              actionLabel="Payment Deposit"
              actionIcon={<CreditCard size={16} className="me-1" />}
            />
          </TabPane>
          <TabPane tab="Remaining Payment" key="3">
            <RenderItemList
              items={currentDepositedItems}
              totalItems={filteredDepositedContracts.length}
              currentPage={currentDepositedPage}
              onPageChange={handleDepositedPageChange}
              onAction={(contract) => handleRemainingPaymentRequest(contract)}
              actionLabel="Payment Amount"
              actionIcon={<CreditCard size={16} className="me-1" />}
            />
          </TabPane>
          <TabPane tab="Completed Contract" key="4">
            <RenderItemList
              items={currentCompletedItems}
              totalItems={filteredCompletedContracts.length}
              currentPage={currentCompletedPage}
              onPageChange={handleCompletedPageChange}
              isCompletedTab={true}
            />
          </TabPane>
        </Tabs>
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
          <p>Total price: {(modalData.price || 0).toLocaleString()} VND</p>
          <p>Please select deposit:</p>
          <Radio.Group
            onChange={(e) => setDepositAmount(e.target.value)}
            value={depositAmount}
          >
            <Radio value={30}>
              30% ({((modalData.price || 0) * 0.3).toLocaleString()})
            </Radio>
            <Radio value={50}>
              50% ({((modalData.price || 0) * 0.5).toLocaleString()})
            </Radio>
            <Radio value={70}>
              70% ({((modalData.price || 0) * 0.7).toLocaleString()})
            </Radio>
          </Radio.Group>
        </Modal>
        <Modal
          title="Payment Deposit"
          open={isPaymentModalVisible}
          onOk={handlePaymentConfirm}
          onCancel={() => {
            setIsPaymentModalVisible(false);
            setPaymentData({ fullName: "", amount: 0, contractId: "" });
          }}
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
                value={paymentData.fullName}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, fullName: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Amount (VND)</strong>
              </Form.Label>
              <Input value={paymentData.amount.toLocaleString()} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Purpose</strong>
              </Form.Label>
              <Input value="Deposit Contract" readOnly />
            </Form.Group>
          </Form>
        </Modal>
        <Modal
          title="Remaining Payment"
          open={isRemainingPaymentModalVisible}
          onOk={handleRemainingPaymentConfirm}
          onCancel={() => {
            setIsRemainingPaymentModalVisible(false);
            setRemainingPaymentData({
              fullName: "",
              amount: 0,
              contractId: "",
            });
          }}
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
                value={remainingPaymentData.fullName}
                onChange={(e) =>
                  setRemainingPaymentData({
                    ...remainingPaymentData,
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
                value={remainingPaymentData.amount.toLocaleString()}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Purpose</strong>
              </Form.Label>
              <Input value="Complete Amount" readOnly />
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
              accountId={effectiveAccountId}
              onCancel={() => {
                setIsFeedbackModalVisible(false);
                setSelectedFeedbackData(null);
              }}
              onSuccess={handleFeedbackSubmit}
            />
          )}
        </Modal>
        <Modal
          title={`Feedback`}
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
            <div className="text-center">
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
              />
            </div>
          ) : viewFeedbackData.feedbacks.length > 0 ? (
            <List
              dataSource={viewFeedbackData.feedbacks}
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
        <EditEventOrganize
          visible={isViewEditModalVisible}
          onOk={() => setIsViewEditModalVisible(false)}
          onCancel={() => setIsViewEditModalVisible(false)}
          modalData={modalData}
          setModalData={setModalData}
          packages={packages}
          characters={characters}
          requests={requests}
          setRequests={setRequests}
        />
      </Container>
    </div>
  );
};

export default MyEventOrganize;
