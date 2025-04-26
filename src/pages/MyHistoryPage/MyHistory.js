////////////////////////////////////////// them view feedback ==============================================
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
//   Tooltip,
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
//   Eye,
// } from "lucide-react";
// import MyHistoryService from "../../services/HistoryService/MyHistoryService";
// import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
// import EditRequestHireCosplayer from "./EditRequestHireCosplayer";
// import PaymentService from "../../services/PaymentService/PaymentService.js";
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
//   const [feedbacks, setFeedbacks] = useState([]);
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
//   const [sortOption, setSortOption] = useState("Date Desc");
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
//   const [isViewModalVisible, setIsViewModalVisible] = useState(false);
//   const [viewRequestId, setViewRequestId] = useState(null);
//   const [modalData, setModalData] = useState({
//     name: "",
//     description: "",
//     location: "",
//     deposit: "N/A",
//     listRequestCharacters: [],
//     price: 0,
//     status: "Unknown",
//     reason: null,
//   });
//   const [isViewFeedbackModalVisible, setIsViewFeedbackModalVisible] =
//     useState(false);
//   const [viewFeedbackData, setViewFeedbackData] = useState({
//     contractId: "",
//     feedbacks: [],
//     cosplayerNames: {},
//   });
//   const isMounted = useRef(true);

//   const itemsPerPage = 5;

//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   const calculateCharacterDuration = (requestDateResponses) => {
//     let totalHours = 0;
//     const uniqueDays = new Set();

//     (requestDateResponses || []).forEach((dateResponse) => {
//       const start = dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY");
//       const end = dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY");

//       if (start.isValid() && end.isValid() && start < end) {
//         const durationHours = end.diff(start, "hour", true);
//         totalHours += durationHours;

//         let current = start.startOf("day");
//         const endDay = end.startOf("day");
//         while (current <= endDay) {
//           uniqueDays.add(current.format("DD/MM/YYYY"));
//           current = current.add(1, "day");
//         }
//       }
//     });

//     return { totalHours, totalDays: uniqueDays.size };
//   };

//   const calculateCosplayerPrice = (
//     salaryIndex,
//     characterPrice,
//     quantity,
//     totalHours,
//     totalDays
//   ) => {
//     if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
//     return (totalHours * salaryIndex + totalDays * characterPrice) * quantity;
//   };

//   const formatDate = (dateTime) => {
//     if (!dateTime) return "N/A";
//     const parsed = dayjs(dateTime, "HH:mm DD/MM/YYYY");
//     return parsed.isValid() ? parsed.format("DD/MM/YYYY") : "N/A";
//   };

//   const handleEditRequest = (requestId) => {
//     setEditRequestId(requestId);
//     setIsEditModalVisible(true);
//   };

//   // const handleEditSuccess = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const updatedRequest = await MyHistoryService.getRequestByRequestId(
//   //       editRequestId
//   //     );
//   //     if (!updatedRequest) throw new Error("Updated request not found");

//   //     const charactersList = updatedRequest.charactersListResponse || [];
//   //     const characterDetails = await Promise.all(
//   //       charactersList.map(async (char) => {
//   //         const { totalHours, totalDays } = calculateCharacterDuration(
//   //           char.requestDateResponses || []
//   //         );

//   //         let salaryIndex = 1;
//   //         if (char.cosplayerId) {
//   //           try {
//   //             const cosplayerData =
//   //               await RequestService.getNameCosplayerInRequestByCosplayerId(
//   //                 char.cosplayerId
//   //               );
//   //             salaryIndex = cosplayerData?.salaryIndex || 1;
//   //           } catch (error) {
//   //             console.warn(
//   //               `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//   //               error
//   //             );
//   //           }
//   //         }
//   //         const characterData = await MyHistoryService.getCharacterById(
//   //           char.characterId
//   //         );
//   //         return {
//   //           salaryIndex,
//   //           characterPrice: characterData?.price || 0,
//   //           quantity: char.quantity || 1,
//   //           totalHours,
//   //           totalDays,
//   //         };
//   //       })
//   //     );

//   //     const totalPrice = characterDetails.reduce(
//   //       (total, char) =>
//   //         total +
//   //         calculateCosplayerPrice(
//   //           char.salaryIndex,
//   //           char.characterPrice,
//   //           char.quantity,
//   //           char.totalHours,
//   //           char.totalDays
//   //         ),
//   //       0
//   //     );

//   //     setRequests((prevRequests) =>
//   //       prevRequests.map((req) =>
//   //         req.requestId === editRequestId
//   //           ? {
//   //               ...req,
//   //               name: updatedRequest.name || req.name,
//   //               description: updatedRequest.description || req.description,
//   //               location: updatedRequest.location || req.location,
//   //               price: totalPrice,
//   //               status: updatedRequest.status || req.status,
//   //               reason: updatedRequest.reason || req.reason,
//   //               charactersListResponse: updatedRequest.charactersListResponse,
//   //             }
//   //           : req
//   //       )
//   //     );

//   //     toast.success("Request updated successfully!");
//   //   } catch (error) {
//   //     console.error("Failed to refresh requests after edit:", error);
//   //     toast.error("Failed to refresh requests. Please try again.");
//   //   } finally {
//   //     setIsEditModalVisible(false);
//   //     setEditRequestId(null);
//   //     setLoading(false);
//   //   }
//   // };

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

//   const handleViewFeedback = async () => {
//     setLoading(true);
//     try {
//       const { contractId, feedbacks } =
//         await MyHistoryService.getFeedbackByContractId(accountId);

//       const namePromises = feedbacks.map(async (feedback) => {
//         try {
//           const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
//             feedback.accountId
//           );
//           return [feedback.accountId, cosplayerData?.name || "Unknown"];
//         } catch (error) {
//           console.warn(
//             `Failed to fetch cosplayer data for ID ${feedback.accountId}:`,
//             error
//           );
//           return [feedback.accountId, "Unknown"];
//         }
//       });
//       const namesArray = await Promise.all(namePromises);
//       const cosplayerNames = Object.fromEntries(namesArray);

//       setViewFeedbackData({
//         contractId,
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

//   const handleViewRequest = async (requestId) => {
//     setLoading(true);
//     setViewRequestId(requestId);
//     setIsViewModalVisible(true);
//     try {
//       const data = await MyHistoryService.getRequestByRequestId(requestId);
//       if (!data) throw new Error("Request data not found");

//       const formattedData = {
//         name: data.name || "N/A",
//         description: data.description || "N/A",
//         location: data.location || "N/A",
//         deposit: data.deposit || "N/A",
//         listRequestCharacters: [],
//         price: 0,
//         status: data.status || "Unknown",
//         reason: data.reason || null,
//       };

//       const charactersList = data.charactersListResponse || [];
//       const sharedRequestDates = [];
//       const dateSet = new Set();
//       charactersList.forEach((char) => {
//         const dates = char.requestDateResponses || [];
//         dates.forEach((date) => {
//           const dateKey = `${date.startDate}-${date.endDate}`;
//           if (!dateSet.has(dateKey)) {
//             dateSet.add(dateKey);
//             sharedRequestDates.push({
//               startDate: date.startDate || "",
//               endDate: date.endDate || "",
//             });
//           }
//         });
//       });

//       if (charactersList.length > 0) {
//         const listRequestCharacters = await Promise.all(
//           charactersList.map(async (char) => {
//             const { totalHours, totalDays } =
//               calculateCharacterDuration(sharedRequestDates);

//             let cosplayerName = "Not Assigned";
//             let salaryIndex = 1;
//             let characterPrice = 0;

//             const characterData = await MyHistoryService.getCharacterById(
//               char.characterId
//             );
//             characterPrice = characterData?.price || 0;

//             if (char.cosplayerId) {
//               try {
//                 const cosplayerData =
//                   await RequestService.getNameCosplayerInRequestByCosplayerId(
//                     char.cosplayerId
//                   );
//                 cosplayerName = cosplayerData?.name || "Unknown";
//                 salaryIndex = cosplayerData?.salaryIndex || 1;
//               } catch (cosplayerError) {
//                 console.warn(
//                   `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                   cosplayerError
//                 );
//               }
//             }

//             const price = calculateCosplayerPrice(
//               salaryIndex,
//               characterPrice,
//               char.quantity || 1,
//               totalHours,
//               totalDays
//             );

//             return {
//               cosplayerId: char.cosplayerId || null,
//               characterId: char.characterId,
//               cosplayerName,
//               characterName: characterData?.characterName || "Unknown",
//               characterImage: char.characterImages?.[0]?.urlImage || "",
//               quantity: char.quantity || 1,
//               salaryIndex,
//               characterPrice,
//               totalHours,
//               totalDays,
//               price,
//               requestDates: sharedRequestDates,
//               status: char.status || "Unknown",
//             };
//           })
//         );

//         formattedData.listRequestCharacters = listRequestCharacters;
//         formattedData.price = listRequestCharacters.reduce(
//           (total, char) => total + char.price,
//           0
//         );
//       }

//       if (isMounted.current) {
//         setModalData(formattedData);
//       }
//     } catch (error) {
//       console.error("Failed to fetch request details:", error);
//       if (isMounted.current) {
//         toast.error("Failed to load request details.");
//       }
//     } finally {
//       if (isMounted.current) {
//         setLoading(false);
//       }
//     }
//   };

//   const handleModalConfirm = () => {
//     if (!modalData.name.trim()) {
//       toast.error("Name cannot be empty!");
//       return;
//     }
//     if (modalData.listRequestCharacters.length === 0) {
//       toast.error("Please include at least one character in the request!");
//       return;
//     }
//     setIsViewModalVisible(false);
//     setViewRequestId(null);
//   };

//   useEffect(() => {
//     const fetchRequests = async () => {
//       if (!accountId) return;
//       setLoading(true);
//       try {
//         const data = await MyHistoryService.GetAllRequestByAccountId(accountId);
//         const requestsArray = Array.isArray(data) ? data : [data];
//         const filteredRequests = await Promise.all(
//           requestsArray
//             .filter((request) => request.serviceId === "S002")
//             .map(async (request) => {
//               const charactersList = request.charactersListResponse || [];

//               const characterDetails = await Promise.all(
//                 charactersList.map(async (char) => {
//                   const { totalHours, totalDays } = calculateCharacterDuration(
//                     char.requestDateResponses || []
//                   );

//                   let salaryIndex = 1;
//                   if (char.cosplayerId) {
//                     try {
//                       const cosplayerData =
//                         await RequestService.getNameCosplayerInRequestByCosplayerId(
//                           char.cosplayerId
//                         );
//                       salaryIndex = cosplayerData?.salaryIndex || 1;
//                     } catch (error) {
//                       console.warn(
//                         `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                         error
//                       );
//                     }
//                   }
//                   const characterData = await MyHistoryService.getCharacterById(
//                     char.characterId
//                   );

//                   return {
//                     salaryIndex,
//                     characterPrice: characterData?.price || 0,
//                     quantity: char.quantity || 1,
//                     totalHours,
//                     totalDays,
//                   };
//                 })
//               );

//               const totalPrice = characterDetails.reduce(
//                 (total, char) =>
//                   total +
//                   calculateCosplayerPrice(
//                     char.salaryIndex,
//                     char.characterPrice,
//                     char.quantity,
//                     char.totalHours,
//                     char.totalDays
//                   ),
//                 0
//               );

//               return {
//                 ...request,
//                 price: totalPrice,
//                 reason: request.reason || null,
//               };
//             })
//         );
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
//         const filteredContracts = contractsArray.filter((contract) =>
//           validRequestIds.includes(contract.requestId)
//         );

//         setContracts(filteredContracts.filter((c) => c.status === "Created"));
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

//   useEffect(() => {
//     let filtered = requests
//       .filter(
//         (request) =>
//           request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           formatDate(request.startDate).includes(searchTerm)
//       )
//       .filter((request) => statusFilter.includes(request.status));

//     filtered.sort((a, b) => {
//       if (sortOption === "date-desc") {
//         return (
//           dayjs(b.startDate, "HH:mm DD/MM/YYYY") -
//           dayjs(a.startDate, "HH:mm DD/MM/YYYY")
//         );
//       } else if (sortOption === "date-asc") {
//         return (
//           dayjs(a.startDate, "HH:mm DD/MM/YYYY") -
//           dayjs(b.startDate, "HH:mm DD/MM/YYYY")
//         );
//       } else if (sortOption === "price-desc") {
//         return (b.price || 0) - (a.price || 0);
//       } else if (sortOption === "price-asc") {
//         return (a.price || 0) - (b.price || 0);
//       }
//       return 0;
//     });

//     setFilteredPendingRequests(filtered);
//     setCurrentPendingPage(1);
//   }, [searchTerm, requests, sortOption, statusFilter]);

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

//   useEffect(() => {
//     if (selectedRequestId && depositAmount !== null && paymentLoading) {
//       const processPayment = async () => {
//         try {
//           await MyHistoryService.depositRequest(
//             selectedRequestId,
//             depositAmount
//           );
//           toast.success("Choose Deposit successful!");
//           const requestData = await MyHistoryService.GetAllRequestByAccountId(
//             accountId
//           );
//           const filteredRequests = (
//             Array.isArray(requestData) ? requestData : [requestData]
//           )
//             .filter((req) => req.serviceId === "S002")
//             .map((req) => {
//               const charactersList = req.charactersListResponse || [];
//               const characterDetails = charactersList.map((char) => {
//                 const { totalHours, totalDays } = calculateCharacterDuration(
//                   char.requestDateResponses || []
//                 );
//                 return {
//                   salaryIndex: char.cosplayerId ? 1 : 1,
//                   characterPrice: char.characterPrice || 0,
//                   quantity: char.quantity || 1,
//                   totalHours,
//                   totalDays,
//                 };
//               });
//               const totalPrice = characterDetails.reduce(
//                 (total, char) =>
//                   total +
//                   calculateCosplayerPrice(
//                     char.salaryIndex,
//                     char.characterPrice,
//                     char.quantity,
//                     char.totalHours,
//                     char.totalDays
//                   ),
//                 0
//               );
//               return {
//                 ...req,
//                 price: totalPrice,
//                 reason: req.reason || null,
//               };
//             });
//           setRequests(filteredRequests);

//           const contractData = await MyHistoryService.getAllContractByAccountId(
//             accountId
//           );
//           const validRequestIds = filteredRequests.map((req) => req.requestId);
//           const filteredContracts = (
//             Array.isArray(contractData) ? contractData : [contractData]
//           ).filter((contract) => validRequestIds.includes(contract.requestId));

//           setContracts(filteredContracts.filter((c) => c.status === "Created"));
//           setProgressingContracts(
//             filteredContracts.filter((c) => c.status === "Deposited")
//           );
//           setCompletedContracts(
//             filteredContracts.filter(
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

//   const handlePayment = (requestId) => {
//     setSelectedRequestId(requestId);
//     setIsPaymentModalVisible(true);
//   };

//   const handlePaymentConfirm = () => {
//     if (depositAmount === null) {
//       message.warning("Please select a deposit amount.");
//       return;
//     }
//     setPaymentLoading(true);
//   };

//   const handleDepositPayment = (contract) => {
//     setDepositData({
//       fullName: contract.createBy || "",
//       amount:
//         contract.price - (contract.price * (100 - contract.deposit)) / 100,
//       contractId: contract.contractId,
//     });
//     setIsDepositModalVisible(true);
//   };

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

//   const handleCompleteContractPayment = (contract) => {
//     setCompletePaymentData({
//       fullName: contract.createBy || "",
//       amount:
//         contract.price -
//         (contract.price - (contract.price * (100 - contract.deposit)) / 100),
//       contractId: contract.contractId,
//     });
//     setIsCompletePaymentModalVisible(true);
//   };

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

//   const handleViewContractPdf = (urlPdf) => {
//     if (urlPdf) {
//       window.open(urlPdf, "_blank");
//     } else {
//       toast.error("PDF URL not available for this contract.");
//     }
//   };

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

//   const getStatusBadge = (status) => {
//     const statusColors = {
//       Pending: "primary",
//       Browsed: "success",
//       Cancel: "secondary",
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
//           style={{
//             width: "100%",
//           }}
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
//                         <div className="flex-grow-1">
//                           <div className="d-flex justify-content-between align-items-start">
//                             <h3 className="history-title mb-0">
//                               {item.name || item.contractName || "N/A"}
//                             </h3>
//                             {getStatusBadge(item.status)}
//                           </div>
//                           <div className="text-muted small mt-1">
//                             <DollarSign size={16} className="me-1" />
//                             Total Price: {(
//                               item.price || 0
//                             ).toLocaleString()}{" "}
//                             VND
//                           </div>
//                           <div className="text-muted small mt-1">
//                             <Calendar size={16} className="me-1" />
//                             Start Date: {formatDate(item.startDate)}
//                           </div>
//                           <div className="text-muted small mt-1">
//                             <Calendar size={16} className="me-1" />
//                             End Date: {formatDate(item.endDate)}
//                           </div>
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
//                         <Button
//                           type="primary"
//                           size="small"
//                           className="btn-view"
//                           onClick={() => handleViewRequest(item.requestId)}
//                         >
//                           <Eye size={16} className="me-1" />
//                           View
//                         </Button>
//                         {item.status === "Pending" && onEdit && (
//                           <Button
//                             size="small"
//                             className="btn-edit"
//                             onClick={() => onEdit(item.requestId)}
//                           >
//                             <Edit size={16} className="me-1" />
//                             Edit
//                           </Button>
//                         )}
//                         {onAction && (
//                           <Button
//                             size="small"
//                             className="btn-action"
//                             onClick={() => onAction(item)}
//                           >
//                             {actionIcon}
//                             {actionLabel}
//                           </Button>
//                         )}
//                         {isCompletedTab && item.status === "Completed" && (
//                           <Button
//                             size="small"
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
//                             size="small"
//                             className="btn-view-feedback"
//                             onClick={() => handleViewFeedback()}
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
//             <RenderItemList
//               items={currentContractItems}
//               totalItems={totalContractItems}
//               currentPage={currentContractPage}
//               onPageChange={handleContractPageChange}
//               onAction={handleDepositPayment}
//               actionLabel="Deposit Payment"
//               actionIcon={<CreditCard size={16} className="me-1" />}
//             />
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
//                                       {contract.contractName || "N/A"}
//                                     </h3>
//                                     {getStatusBadge(contract.status)}
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <DollarSign size={16} className="me-1" />
//                                     Total Price:{" "}
//                                     {(contract.price || 0).toLocaleString()} VND
//                                   </div>
//                                   <div className="text-muted small mt-1">
//                                     <Calendar size={16} className="me-1" />
//                                     Start Date: {formatDate(contract.startDate)}
//                                   </div>
//                                   <div className="text-muted small mt-1">
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
//                                 <Button
//                                   type="primary"
//                                   size="small"
//                                   className="btn-view"
//                                   onClick={() =>
//                                     handleViewRequest(contract.requestId)
//                                   }
//                                 >
//                                   <Eye size={16} className="me-1" />
//                                   View
//                                 </Button>
//                                 <Button
//                                   size="small"
//                                   className="btn-view-pdf"
//                                   onClick={() =>
//                                     handleViewContractPdf(contract.urlPdf)
//                                   }
//                                 >
//                                   <FileText size={16} className="me-1" />
//                                   View Contract PDF
//                                 </Button>
//                                 <Button
//                                   size="small"
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
//               actionIcon={<FileText size={16} className="me-1" />}
//               isCompletedTab={true}
//             />
//           </TabPane>
//         </Tabs>

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
//               <Input value="Tiền cọc hợp đồng" readOnly />
//             </Form.Group>
//           </Form>
//         </Modal>

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
//               <Input value="Tất toán hợp đồng" readOnly />
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
//               accountId={accountId}
//               onCancel={() => {
//                 setIsFeedbackModalVisible(false);
//                 setSelectedFeedbackData(null);
//               }}
//             />
//           )}
//         </Modal>

//         <Modal
//           title={`View Your Feedback `}
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
//           {viewFeedbackData.feedbacks.length > 0 ? (
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
//             <p>No feedback available.</p>
//           )}
//         </Modal>

//         <Modal
//           title="View Your Request"
//           open={isViewModalVisible}
//           onOk={handleModalConfirm}
//           onCancel={() => {
//             setIsViewModalVisible(false);
//             setViewRequestId(null);
//           }}
//           okText="OK"
//           width={800}
//         >
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Name:</strong>
//               </Form.Label>
//               <Input value={modalData.name} readOnly />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Description:</strong>
//               </Form.Label>
//               <TextArea value={modalData.description} readOnly rows={4} />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Location:</strong>
//               </Form.Label>
//               <Input value={modalData.location} readOnly />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Deposit:</strong>
//               </Form.Label>
//               <Input value={modalData.deposit} readOnly suffix="%" />
//             </Form.Group>
//           </Form>
//           <h4>List of Requested Characters:</h4>
//           <List
//             dataSource={modalData.listRequestCharacters}
//             renderItem={(item, index) => (
//               <List.Item key={index}>
//                 <div
//                   style={{
//                     display: "flex",
//                     alignItems: "center",
//                     width: "100%",
//                   }}
//                 >
//                   <div style={{ flex: 1 }}>
//                     <div
//                       style={{
//                         display: index === 0 ? "block" : "none",
//                       }}
//                     >
//                       <p>
//                         <strong>Request Dates (for All Cosplayers):</strong>
//                       </p>
//                       <ul>
//                         {item.requestDates.length > 0 ? (
//                           item.requestDates.map((date, idx) => (
//                             <li key={idx}>
//                               {date.startDate} - {date.endDate}
//                             </li>
//                           ))
//                         ) : (
//                           <li>No date-time data available</li>
//                         )}
//                       </ul>
//                     </div>
//                     <p>
//                       <strong>{item.cosplayerName}</strong> as{" "}
//                       <strong>{item.characterName}</strong>
//                     </p>
//                     <p className="d-flex">
//                       <strong>Status: &nbsp; </strong>
//                       <i>
//                         <u>{item.status}</u>
//                       </i>
//                     </p>
//                     <p>
//                       Quantity: {item.quantity} | Hourly Rate:{" "}
//                       {item.salaryIndex.toLocaleString()} VND/h | Character
//                       Price: {item.characterPrice.toLocaleString()} VND/day
//                     </p>
//                     <Tooltip
//                       title={`Price = [(${item.totalHours.toFixed(2)} hours × ${
//                         item.salaryIndex
//                       } VND/h) + (${item.totalDays} days × ${
//                         item.characterPrice
//                       } VND/day)] × ${item.quantity}`}
//                     >
//                       <p>
//                         Price:{" "}
//                         <strong>{item.price.toLocaleString()} VND</strong>
//                       </p>
//                     </Tooltip>
//                   </div>
//                 </div>
//               </List.Item>
//             )}
//           />
//           <p>
//             <strong>Total Price:</strong>{" "}
//             <strong>{modalData.price.toLocaleString()} VND</strong>
//           </p>
//           {modalData.status === "Cancel" && modalData.reason && (
//             <h4 className="reason-text">
//               <strong>Reason:</strong>{" "}
//               <span style={{ color: "red" }}>{modalData.reason}</span>
//             </h4>
//           )}
//         </Modal>

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

// tính lại price==============================================================
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
  Tooltip,
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
  Eye,
} from "lucide-react";
import MyHistoryService from "../../services/HistoryService/MyHistoryService";
import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
import EditRequestHireCosplayer from "./EditRequestHireCosplayer";
import PaymentService from "../../services/PaymentService/PaymentService.js";
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
  const [feedbacks, setFeedbacks] = useState([]);
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
  const [sortOption, setSortOption] = useState("Date Desc");
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
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewRequestId, setViewRequestId] = useState(null);
  const [modalData, setModalData] = useState({
    name: "",
    description: "",
    location: "",
    deposit: "N/A",
    listRequestCharacters: [],
    price: 0,
    status: "Unknown",
    reason: null,
  });
  const [isViewFeedbackModalVisible, setIsViewFeedbackModalVisible] =
    useState(false);
  const [viewFeedbackData, setViewFeedbackData] = useState({
    contractId: "",
    feedbacks: [],
    cosplayerNames: {},
  });
  const isMounted = useRef(true);

  const itemsPerPage = 5;

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const calculateCharacterDuration = (requestDateResponses) => {
    let totalHours = 0;
    const uniqueDays = new Set();

    (requestDateResponses || []).forEach((dateResponse) => {
      const start = dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY");
      const end = dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY");

      if (start.isValid() && end.isValid() && start < end) {
        const durationHours = end.diff(start, "hour", true);
        totalHours += durationHours;

        let current = start.startOf("day");
        const endDay = end.startOf("day");
        while (current <= endDay) {
          uniqueDays.add(current.format("DD/MM/YYYY"));
          current = current.add(1, "day");
        }
      }
    });

    return { totalHours, totalDays: uniqueDays.size };
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return "N/A";
    const parsed = dayjs(dateTime, "HH:mm DD/MM/YYYY");
    return parsed.isValid() ? parsed.format("DD/MM/YYYY") : "N/A";
  };

  const handleEditRequest = (requestId) => {
    setEditRequestId(requestId);
    setIsEditModalVisible(true);
  };

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

  const handleViewFeedback = async () => {
    setLoading(true);
    try {
      const { contractId, feedbacks } =
        await MyHistoryService.getFeedbackByContractId(accountId);

      const namePromises = feedbacks.map(async (feedback) => {
        try {
          const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
            feedback.accountId
          );
          return [feedback.accountId, cosplayerData?.name || "Unknown"];
        } catch (error) {
          console.warn(
            `Failed to fetch cosplayer data for ID ${feedback.accountId}:`,
            error
          );
          return [feedback.accountId, "Unknown"];
        }
      });
      const namesArray = await Promise.all(namePromises);
      const cosplayerNames = Object.fromEntries(namesArray);

      setViewFeedbackData({
        contractId,
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

  const handleViewRequest = async (requestId) => {
    setLoading(true);
    setViewRequestId(requestId);
    setIsViewModalVisible(true);
    try {
      const data = await MyHistoryService.getRequestByRequestId(requestId);
      if (!data) throw new Error("Request data not found");

      const formattedData = {
        name: data.name || "N/A",
        description: data.description || "N/A",
        location: data.location || "N/A",
        deposit: data.deposit || "N/A",
        listRequestCharacters: [],
        price: data.price || 0, // Lấy giá từ API
        status: data.status || "Unknown",
        reason: data.reason || null,
      };

      const charactersList = data.charactersListResponse || [];
      const sharedRequestDates = [];
      const dateSet = new Set();
      charactersList.forEach((char) => {
        const dates = char.requestDateResponses || [];
        dates.forEach((date) => {
          const dateKey = `${date.startDate}-${date.endDate}`;
          if (!dateSet.has(dateKey)) {
            dateSet.add(dateKey);
            sharedRequestDates.push({
              startDate: date.startDate || "",
              endDate: date.endDate || "",
              totalHour: date.totalHour || 0, // Lấy totalHour từ API
            });
          }
        });
      });

      if (charactersList.length > 0) {
        const listRequestCharacters = await Promise.all(
          charactersList.map(async (char) => {
            const { totalHours } =
              calculateCharacterDuration(sharedRequestDates);

            let cosplayerName = "Not Assigned";
            let salaryIndex = 1;
            let characterPrice = 0;

            const characterData = await MyHistoryService.getCharacterById(
              char.characterId
            );
            characterPrice = characterData?.price || 0;

            if (char.cosplayerId) {
              try {
                const cosplayerData =
                  await MyHistoryService.gotoHistoryByAccountId(
                    char.cosplayerId
                  );
                cosplayerName = cosplayerData?.name || "Unknown";
                salaryIndex = cosplayerData?.salaryIndex || 1;
              } catch (cosplayerError) {
                console.warn(
                  `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
                  cosplayerError
                );
              }
            }

            return {
              cosplayerId: char.cosplayerId || null,
              characterId: char.characterId,
              cosplayerName,
              characterName: characterData?.characterName || "Unknown",
              characterImage: char.characterImages?.[0]?.urlImage || "",
              quantity: char.quantity || 1,
              salaryIndex,
              characterPrice,
              totalHours,
              requestDates: sharedRequestDates,
              status: char.status || "Unknown",
            };
          })
        );

        formattedData.listRequestCharacters = listRequestCharacters;
      }

      if (isMounted.current) {
        setModalData(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      if (isMounted.current) {
        toast.error("Failed to load request details.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleModalConfirm = () => {
    if (!modalData.name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }
    if (modalData.listRequestCharacters.length === 0) {
      toast.error("Please include at least one character in the request!");
      return;
    }
    setIsViewModalVisible(false);
    setViewRequestId(null);
  };

  useEffect(() => {
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
            price: request.price || 0, // Lấy giá từ API
            reason: request.reason || null,
            startDate: request.startDate || "",
            endDate: request.endDate || "",
            charactersListResponse: request.charactersListResponse || [],
          }));
        setRequests(filteredRequests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error("Failed to load requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [accountId]);

  useEffect(() => {
    const fetchContracts = async () => {
      if (!accountId || requests.length === 0) return;
      setLoading(true);
      try {
        const data = await MyHistoryService.getAllContractByAccountId(
          accountId
        );
        const contractsArray = Array.isArray(data) ? data : [data];
        const validRequestIds = requests.map((req) => req.requestId);
        const filteredContracts = contractsArray.filter((contract) =>
          validRequestIds.includes(contract.requestId)
        );

        setContracts(filteredContracts.filter((c) => c.status === "Created"));
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
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
        toast.error("Failed to load contracts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [accountId, requests]);

  useEffect(() => {
    let filtered = requests
      .filter(
        (request) =>
          request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formatDate(request.startDate).includes(searchTerm)
      )
      .filter((request) => statusFilter.includes(request.status));

    filtered.sort((a, b) => {
      if (sortOption === "date-desc") {
        return (
          dayjs(b.startDate, "HH:mm DD/MM/YYYY") -
          dayjs(a.startDate, "HH:mm DD/MM/YYYY")
        );
      } else if (sortOption === "date-asc") {
        return (
          dayjs(a.startDate, "HH:mm DD/MM/YYYY") -
          dayjs(b.startDate, "HH:mm DD/MM/YYYY")
        );
      } else if (sortOption === "price-desc") {
        return (b.price || 0) - (a.price || 0);
      } else if (sortOption === "price-asc") {
        return (a.price || 0) - (b.price || 0);
      }
      return 0;
    });

    setFilteredPendingRequests(filtered);
    setCurrentPendingPage(1);
  }, [searchTerm, requests, sortOption, statusFilter]);

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

  useEffect(() => {
    if (selectedRequestId && depositAmount !== null && paymentLoading) {
      const processPayment = async () => {
        try {
          await MyHistoryService.depositRequest(
            selectedRequestId,
            depositAmount
          );
          toast.success("Choose Deposit successful!");
          const requestData = await MyHistoryService.GetAllRequestByAccountId(
            accountId
          );
          const filteredRequests = (
            Array.isArray(requestData) ? requestData : [requestData]
          )
            .filter((req) => req.serviceId === "S002")
            .map((req) => ({
              ...req,
              price: req.price || 0, // Lấy giá từ API
              reason: req.reason || null,
              startDate: req.startDate || "",
              endDate: req.endDate || "",
              charactersListResponse: req.charactersListResponse || [],
            }));
          setRequests(filteredRequests);

          const contractData = await MyHistoryService.getAllContractByAccountId(
            accountId
          );
          const validRequestIds = filteredRequests.map((req) => req.requestId);
          const filteredContracts = (
            Array.isArray(contractData) ? contractData : [contractData]
          ).filter((contract) => validRequestIds.includes(contract.requestId));

          setContracts(filteredContracts.filter((c) => c.status === "Created"));
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

  const handlePayment = (requestId) => {
    setSelectedRequestId(requestId);
    setIsPaymentModalVisible(true);
  };

  const handlePaymentConfirm = () => {
    if (depositAmount === null) {
      message.warning("Please select a deposit amount.");
      return;
    }
    setPaymentLoading(true);
  };

  const handleDepositPayment = (contract) => {
    setDepositData({
      fullName: contract.createBy || "",
      amount:
        contract.price - (contract.price * (100 - contract.deposit)) / 100,
      contractId: contract.contractId,
    });
    setIsDepositModalVisible(true);
  };

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

  const handleCompleteContractPayment = (contract) => {
    setCompletePaymentData({
      fullName: contract.createBy || "",
      amount:
        contract.price -
        (contract.price - (contract.price * (100 - contract.deposit)) / 100),
      contractId: contract.contractId,
    });
    setIsCompletePaymentModalVisible(true);
  };

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

  const handleViewContractPdf = (urlPdf) => {
    if (urlPdf) {
      window.open(urlPdf, "_blank");
    } else {
      toast.error("PDF URL not available for this contract.");
    }
  };

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

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Cancel: "secondary",
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
          style={{
            width: "100%",
          }}
        >
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 100,
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
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h3 className="history-title mb-0">
                              {item.name || item.contractName || "N/A"}
                            </h3>
                            {getStatusBadge(item.status)}
                          </div>
                          <div className="text-muted small mt-1">
                            <DollarSign size={16} className="me-1" />
                            Total Price: {(
                              item.price || 0
                            ).toLocaleString()}{" "}
                            VND
                          </div>
                          <div className="text-muted small mt-1">
                            <Calendar size={16} className="me-1" />
                            Start Date: {formatDate(item.startDate)}
                          </div>
                          <div className="text-muted small mt-1">
                            <Calendar size={16} className="me-1" />
                            End Date: {formatDate(item.endDate)}
                          </div>
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
                        <Button
                          type="primary"
                          size="small"
                          className="btn-view"
                          onClick={() => handleViewRequest(item.requestId)}
                        >
                          <Eye size={16} className="me-1" />
                          View
                        </Button>
                        {item.status === "Pending" && onEdit && (
                          <Button
                            size="small"
                            className="btn-edit"
                            onClick={() => onEdit(item.requestId)}
                          >
                            <Edit size={16} className="me-1" />
                            Edit
                          </Button>
                        )}
                        {onAction && (
                          <Button
                            size="small"
                            className="btn-action"
                            onClick={() => onAction(item)}
                          >
                            {actionIcon}
                            {actionLabel}
                          </Button>
                        )}
                        {isCompletedTab && item.status === "Completed" && (
                          <Button
                            size="small"
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
                            size="small"
                            className="btn-view-feedback"
                            onClick={() => handleViewFeedback()}
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
                  <Option value="date-desc">Date: Newest First</Option>
                  <Option value="date-asc">Date: Oldest First</Option>
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
            <RenderItemList
              items={currentContractItems}
              totalItems={totalContractItems}
              currentPage={currentContractPage}
              onPageChange={handleContractPageChange}
              onAction={handleDepositPayment}
              actionLabel="Deposit Payment"
              actionIcon={<CreditCard size={16} className="me-1" />}
            />
          </TabPane>
          <TabPane tab="Complete Payment" key="3">
            {loading ? (
              <Flex align="center" gap="middle">
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />}
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
                                      {contract.contractName || "N/A"}
                                    </h3>
                                    {getStatusBadge(contract.status)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <DollarSign size={16} className="me-1" />
                                    Total Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date: {formatDate(contract.startDate)}
                                  </div>
                                  <div className="text-muted small mt-1">
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
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view"
                                  onClick={() =>
                                    handleViewRequest(contract.requestId)
                                  }
                                >
                                  <Eye size={16} className="me-1" />
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  className="btn-view-pdf"
                                  onClick={() =>
                                    handleViewContractPdf(contract.urlPdf)
                                  }
                                >
                                  <FileText size={16} className="me-1" />
                                  View Contract PDF
                                </Button>
                                <Button
                                  size="small"
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
              actionIcon={<FileText size={16} className="me-1" />}
              isCompletedTab={true}
            />
          </TabPane>
        </Tabs>

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
              <Input value="Tiền cọc hợp đồng" readOnly />
            </Form.Group>
          </Form>
        </Modal>

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
              <Input value="Tất toán hợp đồng" readOnly />
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
              accountId={accountId}
              onCancel={() => {
                setIsFeedbackModalVisible(false);
                setSelectedFeedbackData(null);
              }}
            />
          )}
        </Modal>

        <Modal
          title={`View Your Feedback `}
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
          {viewFeedbackData.feedbacks.length > 0 ? (
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
            <p>No feedback available.</p>
          )}
        </Modal>

        <Modal
          title="View Your Request"
          open={isViewModalVisible}
          onOk={handleModalConfirm}
          onCancel={() => {
            setIsViewModalVisible(false);
            setViewRequestId(null);
          }}
          okText="OK"
          width={800}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Name:</strong>
              </Form.Label>
              <Input value={modalData.name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Description:</strong>
              </Form.Label>
              <TextArea value={modalData.description} readOnly rows={4} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Location:</strong>
              </Form.Label>
              <Input value={modalData.location} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Deposit:</strong>
              </Form.Label>
              <Input value={modalData.deposit} readOnly suffix="%" />
            </Form.Group>
          </Form>
          <h4>List of Requested Characters:</h4>
          <List
            dataSource={modalData.listRequestCharacters}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: index === 0 ? "block" : "none",
                      }}
                    >
                      <p>
                        <strong>Request Dates (for All Cosplayers):</strong>
                      </p>
                      <ul>
                        {item.requestDates.length > 0 ? (
                          item.requestDates.map((date, idx) => (
                            <li key={idx}>
                              {date.startDate} - {date.endDate} (Total Hours:{" "}
                              {date.totalHour || 0})
                            </li>
                          ))
                        ) : (
                          <li>No date-time data available</li>
                        )}
                      </ul>
                    </div>
                    <p>
                      <strong>{item.cosplayerName}</strong> as{" "}
                      <strong>{item.characterName}</strong>
                    </p>
                    <p className="d-flex">
                      <strong>Status: </strong> &nbsp;
                      <i>
                        <u>{item.status}</u>
                      </i>
                    </p>
                    <p>
                      Quantity: {item.quantity} | Hourly Rate:{" "}
                      {item.salaryIndex.toLocaleString()} VND/h | Character
                      Price: {item.characterPrice.toLocaleString()} VND
                    </p>
                  </div>
                </div>
              </List.Item>
            )}
          />
          <p>
            <strong>Total Price:</strong>{" "}
            <strong>{modalData.price.toLocaleString()} VND</strong>
          </p>
          {modalData.status === "Cancel" && modalData.reason && (
            <h4 className="reason-text">
              <strong>Reason:</strong>{" "}
              <span style={{ color: "red" }}>{modalData.reason}</span>
            </h4>
          )}
        </Modal>

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
