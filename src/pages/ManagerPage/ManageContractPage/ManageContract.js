//============================================sua cai view======================

// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Table,
//   Modal as BootstrapModal,
//   Form,
//   Card,
//   Pagination as BootstrapPagination,
// } from "react-bootstrap";
// import {
//   Button,
//   Popconfirm,
//   Modal,
//   Input,
//   List,
//   message,
//   Select,
//   Dropdown,
//   Menu,
//   Pagination,
//   Image,
//   Tooltip,
// } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import { Link } from "react-router-dom";
// import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
// import "../../../styles/Manager/ManageContract.scss";
// import dayjs from "dayjs";

// const splitDateTime = (dateTime) => {
//   if (!dateTime || typeof dateTime !== "string") {
//     return { date: "N/A", time: "N/A" };
//   }

//   const regex = /^(\d{2}:\d{2})\s(\d{2}\/\d{2}\/\d{4})$/;
//   const match = dateTime.match(regex);

//   if (!match) {
//     return { date: "N/A", time: "N/A" };
//   }

//   const [, time, date] = match;
//   return { date, time };
// };

// const { TextArea } = Input;
// const { Option } = Select;

// function CustomTabPanel(props) {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`simple-tabpanel-${index}`}
//       aria-labelledby={`simple-tab-${index}`}
//       {...other}
//     >
//       {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//     </div>
//   );
// }

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

// const ManageContract = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const [contracts, setContracts] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedContractType, setSelectedContractType] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isRequestBased, setIsRequestBased] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [formData, setFormData] = useState({
//     customerName: "",
//     deposit: "",
//     requestId: "",
//   });
//   const [isViewModalVisible, setIsViewModalVisible] = useState(false);
//   const [isRequestViewModalVisible, setIsRequestViewModalVisible] =
//     useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [viewData, setViewData] = useState(null);
//   const [cosplayerData, setCosplayerData] = useState({});
//   const [tooltipLoading, setTooltipLoading] = useState({});
//   const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
//   const charactersPerPage = 2;
//   const [searchContract, setSearchContract] = useState("");
//   const [searchRequest, setSearchRequest] = useState("");
//   const [sortContract, setSortContract] = useState({
//     field: "status",
//     order: "asc",
//   });
//   const [sortRequest, setSortRequest] = useState({
//     field: "statusRequest",
//     order: "asc",
//   });
//   const [currentPageContract, setCurrentPageContract] = useState(1);
//   const [currentPageRequest, setCurrentPageRequest] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 15, 30];
//   const [selectedService, setSelectedService] = useState("All");

//   const handleCompleteContract = async (contractId) => {
//     if (!contractId) {
//       console.error("contractId không hợp lệ:", contractId);
//       toast.error("Không thể hoàn thành hợp đồng: ID không hợp lệ.");
//       return;
//     }

//     try {
//       await ManageContractService.updateContractStatus(contractId, "Completed");
//       setContracts((prevContracts) =>
//         prevContracts.map((con) =>
//           con.contractId === contractId ? { ...con, status: "Completed" } : con
//         )
//       );
//       toast.success("Hợp đồng đã được hoàn thành thành công!");
//     } catch (error) {
//       console.error("Lỗi khi hoàn thành hợp đồng:", {
//         message: error.message,
//         status: error.response?.status,
//         data: error.response?.data,
//       });
//       toast.error(
//         error.response?.data?.message || "Lỗi khi hoàn thành hợp đồng."
//       );
//     }
//   };

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
//     quantity,
//     totalHours,
//     characterPrice,
//     totalDays
//   ) => {
//     if (
//       !salaryIndex ||
//       !quantity ||
//       !totalHours ||
//       characterPrice == null ||
//       totalDays == null ||
//       isNaN(salaryIndex) ||
//       isNaN(quantity) ||
//       isNaN(totalHours) ||
//       isNaN(characterPrice) ||
//       isNaN(totalDays)
//     ) {
//       console.warn("Invalid input for calculateCosplayerPrice:", {
//         salaryIndex,
//         quantity,
//         totalHours,
//         characterPrice,
//         totalDays,
//       });
//       return 0;
//     }
//     return (totalHours * salaryIndex + totalDays * characterPrice) * quantity;
//   };

//   const calculateTotalPrice = (characters) => {
//     if (!characters || characters.length === 0) return 0;
//     return characters.reduce((total, char) => {
//       const price = calculateCosplayerPrice(
//         char.salaryIndex,
//         char.quantity,
//         char.totalHours,
//         char.characterPrice,
//         char.totalDays
//       );
//       return total + (isNaN(price) ? 0 : price);
//     }, 0);
//   };

//   const fetchCosplayerData = async (cosplayerId) => {
//     if (!cosplayerId || cosplayerData[cosplayerId]) return;
//     try {
//       setTooltipLoading((prev) => ({ ...prev, [cosplayerId]: true }));
//       const response =
//         await ManageContractService.getNameCosplayerInRequestByCosplayerId(
//           cosplayerId
//         );
//       setCosplayerData((prev) => ({ ...prev, [cosplayerId]: response }));
//     } catch (error) {
//       console.error(
//         `Failed to fetch cosplayer data for ID ${cosplayerId}:`,
//         error
//       );
//       setCosplayerData((prev) => ({ ...prev, [cosplayerId]: null }));
//     } finally {
//       setTooltipLoading((prev) => ({ ...prev, [cosplayerId]: false }));
//     }
//   };

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         try {
//           const contractData = await ManageContractService.getAllContracts();
//           console.log("Fetched contracts:", contractData);

//           // Kiểm tra và lọc các hợp đồng thiếu contractId
//           const validContracts = contractData.filter((con) => {
//             if (!con.contractId) {
//               console.warn("Hợp đồng thiếu contractId:", con);
//               return false;
//             }
//             return true;
//           });

//           if (isMounted) {
//             setContracts(validContracts);
//             if (validContracts.length === 0) {
//               toast.warn("Không tìm thấy hợp đồng hợp lệ.");
//             }
//           }
//         } catch (contractError) {
//           console.error("Failed to fetch contracts:", contractError);
//           toast.warn(
//             "Could not fetch contracts: " +
//               (contractError.response?.data?.message || contractError.message)
//           );
//         }

//         try {
//           const requestData = await ManageContractService.getAllRequests();
//           console.log("Raw request data:", requestData);
//           const formattedData = requestData
//             .filter((req) =>
//               ["browsed", "approved"].includes(req.status?.toLowerCase())
//             )
//             .map((req) => {
//               let startDate = req.startDate || "N/A";
//               let endDate = req.endDate || "N/A";
//               if (
//                 req.charactersListResponse?.length > 0 &&
//                 req.charactersListResponse[0]?.requestDateResponses?.length > 0
//               ) {
//                 const dateResponse =
//                   req.charactersListResponse[0].requestDateResponses[0];
//                 startDate = dateResponse.startDate;
//                 endDate = dateResponse.endDate;
//               }
//               return {
//                 id: req.requestId,
//                 serviceId: req.serviceId || "Unknown",
//                 name: req.name || "N/A",
//                 description: req.description || "N/A",
//                 location: req.location || "N/A",
//                 price: req.price || 0,
//                 deposit: req.deposit || 0,
//                 statusRequest: mapStatus(req.status),
//                 startDate,
//                 endDate,
//                 reason: req.reason || "",
//                 contractId: req.contractId || null,
//                 charactersListResponse: req.charactersListResponse || [],
//               };
//             });
//           console.log("Formatted requests:", formattedData);
//           if (isMounted) {
//             setRequests(formattedData);
//             if (requestData.length === 0) {
//               toast.info("No requests found from API.");
//             } else if (formattedData.length === 0) {
//               toast.info("No requests with status Browsed or Approved found.");
//             } else {
//               toast.success(
//                 `Fetched ${formattedData.length} requests with status Browsed or Approved.`
//               );
//             }
//           }
//         } catch (requestError) {
//           console.error("Failed to fetch requests:", {
//             message: requestError.message,
//             status: requestError.response?.status,
//             data: requestError.response?.data,
//           });
//           toast.error(
//             "Could not fetch requests: " +
//               (requestError.response?.data?.message || requestError.message)
//           );
//         }
//       } catch (error) {
//         if (isMounted) {
//           console.error("Unexpected error:", error);
//           toast.error("Unexpected error: " + error.message);
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const mapStatus = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return "Pending";
//       case "browsed":
//         return "Browsed";
//       case "approved":
//         return "Approved";
//       case "cancel":
//         return "Cancel";
//       default:
//         return "Unknown";
//     }
//   };

//   const filterAndSortContracts = (data, search, sort) => {
//     let filtered = [...data];

//     if (selectedContractType) {
//       filtered = filtered.filter(
//         (item) =>
//           item.contractName &&
//           item.contractName.toLowerCase() === selectedContractType.toLowerCase()
//       );
//     }

//     if (search) {
//       filtered = filtered.filter((item) => {
//         const name = item.contractName ? item.contractName.toLowerCase() : "";
//         const status = item.status ? item.status.toLowerCase() : "";
//         return (
//           name.includes(search.toLowerCase()) ||
//           status.includes(search.toLowerCase())
//         );
//       });
//     }

//     return filtered.sort((a, b) => {
//       let valueA = a[sort.field] || "";
//       let valueB = b[sort.field] || "";

//       if (sort.field === "price") {
//         valueA = valueA || 0;
//         valueB = valueB || 0;
//         return sort.order === "asc" ? valueA - valueB : valueB - valueA;
//       }

//       valueA = valueA ? String(valueA).toLowerCase() : "";
//       valueB = valueB ? String(valueB).toLowerCase() : "";
//       return sort.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredContracts = filterAndSortContracts(
//     contracts,
//     searchContract,
//     sortContract
//   );

//   const totalPagesContract = useMemo(() => {
//     return Math.ceil(filteredContracts.length / rowsPerPage);
//   }, [filteredContracts.length, rowsPerPage]);

//   useEffect(() => {
//     if (currentPageContract > totalPagesContract && totalPagesContract > 0) {
//       setCurrentPageContract(1);
//     }
//   }, [totalPagesContract, currentPageContract]);

//   const paginatedContracts = paginateData(
//     filteredContracts,
//     currentPageContract
//   );

//   const filterAndSortRequests = (data, search, sort) => {
//     let filtered = [...data];

//     // Lọc bỏ requests có requestId trùng với requestId của bất kỳ contract nào
//     const contractRequestIds = contracts.map((con) => con.requestId);
//     filtered = filtered.filter((req) => !contractRequestIds.includes(req.id));

//     if (selectedService !== "All") {
//       filtered = filtered.filter((item) => item.serviceId === selectedService);
//     }

//     if (search) {
//       filtered = filtered.filter((item) =>
//         Object.values(item).some((val) =>
//           String(val).toLowerCase().includes(search.toLowerCase())
//         )
//       );
//     }

//     return filtered.sort((a, b) => {
//       let valueA = a[sort.field];
//       let valueB = b[sort.field];

//       if (sort.field === "price") {
//         valueA = valueA || 0;
//         valueB = valueB || 0;
//         return sort.order === "asc" ? valueA - valueB : valueB - valueA;
//       }

//       valueA = valueA ? String(valueA).toLowerCase() : "";
//       valueB = valueB ? String(valueB).toLowerCase() : "";
//       return sort.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredRequests = filterAndSortRequests(
//     requests,
//     searchRequest,
//     sortRequest
//   );

//   const totalPagesRequest = useMemo(() => {
//     return Math.ceil(filteredRequests.length / rowsPerPage);
//   }, [filteredRequests.length, rowsPerPage]);

//   const totalEntries = filteredRequests.length;

//   useEffect(() => {
//     if (currentPageRequest > totalPagesRequest && totalPagesRequest > 0) {
//       setCurrentPageRequest(1);
//     }
//   }, [totalPagesRequest, currentPageRequest]);

//   const paginatedRequests = paginateData(filteredRequests, currentPageRequest);

//   function paginateData(data, page, perPage = rowsPerPage) {
//     const startIndex = (page - 1) * perPage;
//     const endIndex = startIndex + perPage;
//     return data.slice(startIndex, endIndex);
//   }

//   const handleShowModal = (item = null, request = null) => {
//     if (item) {
//       setIsEditing(true);
//       setIsRequestBased(false);
//       setCurrentItem(item);
//       setFormData({
//         customerName: item.customerName || "N/A",
//         deposit: item.deposit || "0",
//         requestId: item.requestId || "",
//       });
//     } else if (request) {
//       if (request.contractId) {
//         toast.warn("This request already has an associated contract!");
//         return;
//       }
//       setIsEditing(false);
//       setIsRequestBased(true);
//       setCurrentItem(request);
//       setFormData({
//         customerName: request.name || "N/A",
//         deposit: request.deposit ? `${request.deposit}%` : "0%",
//         requestId: request.id || "",
//       });
//     } else {
//       setIsEditing(false);
//       setIsRequestBased(false);
//       setFormData({
//         customerName: "",
//         deposit: "",
//         requestId: "",
//       });
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setIsEditing(false);
//     setIsRequestBased(false);
//     setCurrentItem(null);
//     setFormData({
//       customerName: "",
//       deposit: "",
//       requestId: "",
//     });
//   };

//   const handleSubmit = async () => {
//     if (!formData.requestId) {
//       toast.warn("Request ID is required to create a contract!");
//       return;
//     }

//     try {
//       const depositValue = parseFloat(formData.deposit.replace("%", "")) || 0;
//       const newContract = await ManageContractService.createContract(
//         formData.requestId,
//         depositValue
//       );

//       setContracts([...contracts, newContract]);

//       if (isRequestBased) {
//         setRequests(
//           requests.map((req) =>
//             req.id === currentItem.id
//               ? { ...req, contractId: newContract.contractId }
//               : req
//           )
//         );
//       }

//       toast.success("Contract created successfully!");
//       window.location.reload();
//       handleCloseModal();
//     } catch (error) {
//       toast.error(
//         "Failed to create contract: " +
//           (error.response?.data?.message || error.message)
//       );
//       console.error("Error creating contract:", error);
//     }
//   };

//   const handleDeleteContract = (contractId) => {
//     setContracts(contracts.filter((con) => con.contractId !== contractId));
//     setRequests(
//       requests.map((req) =>
//         req.contractId === contractId ? { ...req, contractId: null } : req
//       )
//     );
//     toast.success("Contract deleted successfully!");
//   };

//   const handleViewContractDetail = async (contract) => {
//     try {
//       const requestData = await ManageContractService.getRequestByRequestId(
//         contract.requestId
//       );
//       if (!requestData) {
//         throw new Error("Request data not found");
//       }

//       const serviceId = requestData.serviceId;

//       if (serviceId === "S002") {
//         const formattedData = {
//           name: requestData.name || "N/A",
//           description: requestData.description || "N/A",
//           location: requestData.location || "N/A",
//           deposit: requestData.deposit || "N/A",
//           listRequestCharacters: [],
//           price: 0,
//           status: mapStatus(requestData.status),
//           reason: requestData.reason || null,
//         };

//         const charactersList = requestData.charactersListResponse || [];
//         if (charactersList.length > 0) {
//           const listRequestCharacters = await Promise.all(
//             charactersList.map(async (char) => {
//               const { totalHours, totalDays } = calculateCharacterDuration(
//                 char.requestDateResponses || []
//               );

//               let cosplayerName = "Not Assigned";
//               let salaryIndex = 1;
//               let characterPrice = 0;
//               let characterName = "Unknown";

//               try {
//                 const characterData =
//                   await ManageContractService.getCharacterById(
//                     char.characterId
//                   );
//                 characterName = characterData?.characterName || "Unknown";
//                 characterPrice = Number(characterData?.price) || 0;
//               } catch (error) {
//                 console.warn(
//                   `Failed to fetch character for ID ${char.characterId}:`,
//                   error
//                 );
//               }

//               if (char.cosplayerId) {
//                 try {
//                   const cosplayerData =
//                     await ManageContractService.getNameCosplayerInRequestByCosplayerId(
//                       char.cosplayerId
//                     );
//                   cosplayerName = cosplayerData?.name || "Not Assigned";
//                   salaryIndex = Number(cosplayerData?.salaryIndex) || 1;
//                 } catch (error) {
//                   console.warn(
//                     `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
//                     error
//                   );
//                 }
//               }

//               const price = calculateCosplayerPrice(
//                 salaryIndex,
//                 Number(char.quantity) || 1,
//                 totalHours,
//                 characterPrice,
//                 totalDays
//               );

//               return {
//                 cosplayerId: char.cosplayerId || null,
//                 characterId: char.characterId,
//                 cosplayerName,
//                 characterName,
//                 characterPrice,
//                 quantity: Number(char.quantity) || 1,
//                 salaryIndex,
//                 totalHours,
//                 totalDays,
//                 price,
//                 requestDates: (char.requestDateResponses || []).map((date) => ({
//                   startDate: date.startDate,
//                   endDate: date.endDate,
//                 })),
//                 status: char.status || "Unknown",
//               };
//             })
//           );

//           formattedData.listRequestCharacters = listRequestCharacters;
//           formattedData.price = listRequestCharacters.reduce(
//             (total, char) => total + char.price,
//             0
//           );
//         }

//         setViewData(formattedData);
//         setIsRequestViewModalVisible(true);
//         setCurrentCharacterPage(1);
//       } else {
//         setModalData({
//           name: requestData.name || contract.contractName || "N/A",
//           description: requestData.description || "",
//           startDate: contract.startDate || "N/A",
//           endDate: contract.endDate || "N/A",
//           location: requestData.location || "N/A",
//           price: contract.price || 0,
//           listRequestCharacters: contract.contractCharacters || [],
//         });
//         setIsViewModalVisible(true);
//       }
//     } catch (error) {
//       console.error("Failed to fetch contract details:", error);
//       message.warn(
//         error.response?.data?.message || "Failed to fetch contract details"
//       );
//     }
//   };

//   const handleViewRequestDetail = async (id) => {
//     try {
//       const data = await ManageContractService.getRequestByRequestId(id);
//       if (!data) {
//         throw new Error("Request data not found");
//       }

//       const request = requests.find((req) => req.id === id);
//       const serviceId = request?.serviceId;

//       if (serviceId === "S002") {
//         const formattedData = {
//           name: data.name || "N/A",
//           description: data.description || "N/A",
//           location: data.location || "N/A",
//           deposit: data.deposit || "N/A",
//           listRequestCharacters: [],
//           price: 0,
//           status: mapStatus(data.status),
//           reason: data.reason || null,
//         };

//         const charactersList = data.charactersListResponse || [];
//         if (charactersList.length > 0) {
//           const listRequestCharacters = await Promise.all(
//             charactersList.map(async (char) => {
//               const { totalHours, totalDays } = calculateCharacterDuration(
//                 char.requestDateResponses || []
//               );

//               let cosplayerName = "Not Assigned";
//               let salaryIndex = 1;
//               let characterPrice = 0;
//               let characterName = "Unknown";

//               try {
//                 const characterData =
//                   await ManageContractService.getCharacterById(
//                     char.characterId
//                   );
//                 characterName = characterData?.characterName || "Unknown";
//                 characterPrice = Number(characterData?.price) || 0;
//               } catch (error) {
//                 console.warn(
//                   `Failed to fetch character for ID ${char.characterId}:`,
//                   error
//                 );
//               }

//               if (char.cosplayerId) {
//                 try {
//                   const cosplayerData =
//                     await ManageContractService.getNameCosplayerInRequestByCosplayerId(
//                       char.cosplayerId
//                     );
//                   cosplayerName = cosplayerData?.name || "Not Assigned";
//                   salaryIndex = Number(cosplayerData?.salaryIndex) || 1;
//                 } catch (error) {
//                   console.warn(
//                     `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
//                     error
//                   );
//                 }
//               }

//               const price = calculateCosplayerPrice(
//                 salaryIndex,
//                 Number(char.quantity) || 1,
//                 totalHours,
//                 characterPrice,
//                 totalDays
//               );

//               return {
//                 cosplayerId: char.cosplayerId || null,
//                 characterId: char.characterId,
//                 cosplayerName,
//                 characterName,
//                 characterPrice,
//                 quantity: Number(char.quantity) || 1,
//                 salaryIndex,
//                 totalHours,
//                 totalDays,
//                 price,
//                 requestDates: (char.requestDateResponses || []).map((date) => ({
//                   startDate: date.startDate,
//                   endDate: date.endDate,
//                 })),
//               };
//             })
//           );

//           formattedData.listRequestCharacters = listRequestCharacters;
//           formattedData.price = listRequestCharacters.reduce(
//             (total, char) => total + char.price,
//             0
//           );
//         }

//         setViewData(formattedData);
//       }
//       setIsRequestViewModalVisible(true);
//       setCurrentCharacterPage(1);
//     } catch (error) {
//       toast.error("Failed to fetch request details");
//       console.error("Error in handleViewRequestDetail:", error);
//     }
//   };

//   const handleRequestModalConfirm = () => {
//     setIsRequestViewModalVisible(false);
//     setViewData(null);
//     setCosplayerData({});
//   };

//   const handleModalConfirm = () => {
//     setIsViewModalVisible(false);
//     setModalData(null);
//   };

//   const handleEditInViewModal = () => {
//     message.info("Edit functionality not implemented yet");
//   };

//   const handleSortContract = (field) => {
//     setSortContract((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPageContract(1);
//   };

//   const handleSortRequest = (field) => {
//     setSortRequest((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPageRequest(1);
//   };

//   const handlePageChangeContract = (page) => setCurrentPageContract(page);
//   const handlePageChangeRequest = (page) => setCurrentPageRequest(page);

//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPageContract(1);
//     setCurrentPageRequest(1);
//   };

//   const handleServiceFilterChange = (value) => {
//     setSelectedService(value);
//     setCurrentPageRequest(1);
//   };

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   const serviceMenu = (
//     <Menu onClick={({ key }) => handleServiceFilterChange(key)}>
//       <Menu.Item key="All">All Services</Menu.Item>
//       <Menu.Item key="S001">Hire Costume</Menu.Item>
//       <Menu.Item key="S002">Hire Cosplayer</Menu.Item>
//       <Menu.Item key="S003">Event Organization</Menu.Item>
//     </Menu>
//   );

//   if (loading) {
//     return (
//       <Box sx={{ width: "100%" }}>
//         <LinearProgress />
//       </Box>
//     );
//   }

//   return (
//     <div className="manage-general">
//       <h2 className="manage-general-title">Browsed Requests & Contracts</h2>
//       <Box sx={{ width: "100%" }}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             aria-label="manage tabs"
//             style={{
//               marginLeft: "20vh",
//             }}
//           >
//             <Tab
//               label="Approved Requests"
//               {...a11yProps(0)}
//               style={{ color: "white" }}
//             />
//             <Tab
//               label="Contracts"
//               {...a11yProps(1)}
//               style={{ color: "white" }}
//             />
//           </Tabs>
//         </Box>

//         <CustomTabPanel value={tabValue} index={0}>
//           <div className="table-container">
//             <Card className="status-table-card">
//               <Card.Body>
//                 <div className="table-header">
//                   <h3>Approved Requests</h3>
//                   <div style={{ display: "flex", gap: "10px" }}>
//                     <Form.Control
//                       type="text"
//                       placeholder="Search requests..."
//                       value={searchRequest}
//                       onChange={(e) => setSearchRequest(e.target.value)}
//                       className="search-input"
//                     />
//                     <Dropdown overlay={serviceMenu}>
//                       <Button>
//                         {selectedService === "All"
//                           ? "All Services"
//                           : selectedService === "S001"
//                           ? "Hire Costume"
//                           : selectedService === "S002"
//                           ? "Hire Cosplayer"
//                           : "Event Organization"}{" "}
//                         ▼
//                       </Button>
//                     </Dropdown>
//                   </div>
//                 </div>
//                 <Table striped bordered hover responsive>
//                   <thead>
//                     <tr>
//                       <th onClick={() => handleSortRequest("name")}>
//                         Name{" "}
//                         {sortRequest.field === "name" &&
//                           (sortRequest.order === "asc" ? (
//                             <ArrowUp size={16} />
//                           ) : (
//                             <ArrowDown size={16} />
//                           ))}
//                       </th>
//                       <th onClick={() => handleSortRequest("description")}>
//                         Description{" "}
//                         {sortRequest.field === "description" &&
//                           (sortRequest.order === "asc" ? (
//                             <ArrowUp size={16} />
//                           ) : (
//                             <ArrowDown size={16} />
//                           ))}
//                       </th>
//                       <th>Location</th>
//                       <th onClick={() => handleSortRequest("price")}>
//                         Price{" "}
//                         {sortRequest.field === "price" &&
//                           (sortRequest.order === "asc" ? (
//                             <ArrowUp size={16} />
//                           ) : (
//                             <ArrowDown size={16} />
//                           ))}
//                       </th>
//                       <th onClick={() => handleSortRequest("statusRequest")}>
//                         Status{" "}
//                         {sortRequest.field === "statusRequest" &&
//                           (sortRequest.order === "asc" ? (
//                             <ArrowUp size={16} />
//                           ) : (
//                             <ArrowDown size={16} />
//                           ))}
//                       </th>
//                       <th onClick={() => handleSortRequest("startDate")}>
//                         Start Date{" "}
//                         {sortRequest.field === "startDate" &&
//                           (sortRequest.order === "asc" ? (
//                             <ArrowUp size={16} />
//                           ) : (
//                             <ArrowDown size={16} />
//                           ))}
//                       </th>
//                       <th onClick={() => handleSortRequest("endDate")}>
//                         End Date{" "}
//                         {sortRequest.field === "endDate" &&
//                           (sortRequest.order === "asc" ? (
//                             <ArrowUp size={16} />
//                           ) : (
//                             <ArrowDown size={16} />
//                           ))}
//                       </th>
//                       <th onClick={() => handleSortRequest("reason")}>
//                         Reason{" "}
//                         {sortRequest.field === "reason" &&
//                           (sortRequest.order === "asc" ? (
//                             <ArrowUp size={16} />
//                           ) : (
//                             <ArrowDown size={16} />
//                           ))}
//                       </th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedRequests.length > 0 ? (
//                       paginatedRequests.map((req) => (
//                         <tr key={req.id}>
//                           <td>{req.name}</td>
//                           <td>{req.description}</td>
//                           <td>{req.location}</td>
//                           <td>
//                             {req.price ? req.price.toLocaleString() : "N/A"}
//                           </td>
//                           <td>{req.statusRequest}</td>
//                           <td>{req.startDate}</td>
//                           <td>{req.endDate}</td>
//                           <td>{req.reason}</td>
//                           <td>
//                             <Button
//                               size="small"
//                               onClick={() => handleViewRequestDetail(req.id)}
//                               style={{ marginRight: "8px" }}
//                             >
//                               View
//                             </Button>
//                             <Button
//                               type="primary"
//                               size="small"
//                               onClick={() => handleShowModal(null, req)}
//                             >
//                               Create Contract
//                             </Button>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="9" className="text-center">
//                           No requests found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//                 <PaginationControls
//                   currentPage={currentPageRequest}
//                   totalPages={totalPagesRequest}
//                   totalEntries={totalEntries}
//                   showingEntries={paginatedRequests.length}
//                   rowsPerPage={rowsPerPage}
//                   onPageChange={handlePageChangeRequest}
//                   onRowsPerPageChange={handleRowsPerPageChange}
//                   rowsPerPageOptions={rowsPerPageOptions}
//                 />
//               </Card.Body>
//             </Card>
//           </div>
//         </CustomTabPanel>

//         <CustomTabPanel value={tabValue} index={1}>
//           <div className="table-container">
//             <Card className="status-table-card">
//               <Card.Body>
//                 <div className="table-header">
//                   <h3>Contracts</h3>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                     }}
//                   >
//                     <Select
//                       value={selectedContractType}
//                       onChange={(value) => setSelectedContractType(value)}
//                       style={{ width: 200 }}
//                     >
//                       <Option value="">All</Option>
//                       <Option value="Cosplay Rental">Cosplay Rental</Option>
//                       <Option value="Character Rental">Character Rental</Option>
//                       <Option value="Event Rental">Event Organization</Option>
//                     </Select>
//                     <Form.Control
//                       type="text"
//                       placeholder="Search ..."
//                       value={searchContract}
//                       onChange={(e) => setSearchContract(e.target.value)}
//                       className="search-input"
//                     />
//                   </div>
//                 </div>
//                 <Table striped bordered hover responsive>
//                   <thead>
//                     <tr>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSortContract("contractName")}
//                         >
//                           Contract Name
//                           {sortContract.field === "contractName" &&
//                             (sortContract.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             ))}
//                         </span>
//                       </th>
//                       <th className="text-center">Price</th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSortContract("status")}
//                         >
//                           Status
//                           {sortContract.field === "status" &&
//                             (sortContract.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             ))}
//                         </span>
//                       </th>
//                       <th className="text-center">Contract Created Date</th>
//                       <th className="text-center">Start Date</th>
//                       <th className="text-center">End Date</th>
//                       <th className="text-center">Actions</th>
//                       <th className="text-center">Complete Contract</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedContracts.length === 0 ? (
//                       <tr>
//                         <td colSpan="8" className="text-center">
//                           No contracts found
//                         </td>
//                       </tr>
//                     ) : (
//                       paginatedContracts.map((con, index) => (
//                         <tr key={con.contractId || `contract-${index}`}>
//                           <td className="text-center">
//                             {con.contractName || "N/A"}
//                           </td>
//                           <td className="text-center">
//                             {con.price ? con.price.toLocaleString() : "N/A"}
//                           </td>
//                           <td className="text-center">{con.status || "N/A"}</td>
//                           <td className="text-center">
//                             {con.createDate && dayjs(con.createDate).isValid()
//                               ? dayjs(con.createDate).format("HH:mm DD/MM/YYYY")
//                               : "N/A"}
//                           </td>
//                           <td className="text-center">
//                             {con.startDate &&
//                             dayjs(con.startDate, "HH:mm DD/MM/YYYY").isValid()
//                               ? dayjs(con.startDate, "HH:mm DD/MM/YYYY").format(
//                                   "DD/MM/YYYY"
//                                 )
//                               : "N/A"}
//                           </td>
//                           <td className="text-center">
//                             {con.endDate &&
//                             dayjs(con.endDate, "HH:mm DD/MM/YYYY").isValid()
//                               ? dayjs(con.endDate, "HH:mm DD/MM/YYYY").format(
//                                   "DD/MM/YYYY"
//                                 )
//                               : "N/A"}
//                           </td>
//                           <td className="text-center">
//                             <Button
//                               type="default"
//                               size="small"
//                               onClick={() => handleViewContractDetail(con)}
//                               style={{ marginRight: "8px" }}
//                               disabled={!con.contractId}
//                             >
//                               View Detail
//                             </Button>
//                           </td>
//                           <td className="text-center">
//                             {con.contractId &&
//                             con.status === "FinalSettlement" ? (
//                               <Popconfirm
//                                 title="Bạn có chắc chắn muốn hoàn thành hợp đồng này?"
//                                 onConfirm={() =>
//                                   handleCompleteContract(con.contractId)
//                                 }
//                                 okText="Có"
//                                 cancelText="Không"
//                               >
//                                 <Button type="primary" size="small">
//                                   Completed
//                                 </Button>
//                               </Popconfirm>
//                             ) : (
//                               "-"
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </Table>

//                 <PaginationControls
//                   currentPage={currentPageContract}
//                   totalPages={totalPagesContract}
//                   totalEntries={filteredContracts.length}
//                   rowsPerPage={rowsPerPage}
//                   onPageChange={handlePageChangeContract}
//                   onRowsPerPageChange={handleRowsPerPageChange}
//                   rowsPerPageOptions={rowsPerPageOptions}
//                 />
//               </Card.Body>
//             </Card>
//           </div>
//         </CustomTabPanel>
//       </Box>

//       <BootstrapModal show={showModal} onHide={handleCloseModal} centered>
//         <BootstrapModal.Header closeButton>
//           <BootstrapModal.Title>
//             {isEditing ? "Edit Contract" : "Add Contract"}
//           </BootstrapModal.Title>
//         </BootstrapModal.Header>
//         <BootstrapModal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Customer Name</strong>
//               </Form.Label>
//               <Form.Control
//                 type="text"
//                 value={formData.customerName}
//                 readOnly
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>
//                 <strong>Deposit</strong>
//               </Form.Label>
//               <Form.Control type="text" value={formData.deposit} readOnly />
//             </Form.Group>
//           </Form>
//         </BootstrapModal.Body>
//         <BootstrapModal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Cancel
//           </Button>
//           {!isEditing && (
//             <Button variant="primary" onClick={handleSubmit}>
//               Add
//             </Button>
//           )}
//         </BootstrapModal.Footer>
//       </BootstrapModal>

//       <Modal
//         title="Contract Details"
//         open={isViewModalVisible}
//         onOk={handleModalConfirm}
//         onCancel={() => setIsViewModalVisible(false)}
//         okText="OK"
//         footer={[
//           <Button key="edit" type="primary" onClick={handleEditInViewModal}>
//             Edit
//           </Button>,
//           <Button key="ok" type="primary" onClick={handleModalConfirm}>
//             OK
//           </Button>,
//         ]}
//       >
//         {modalData ? (
//           <div>
//             <p>
//               <strong>Name:</strong>
//             </p>
//             <Input
//               value={modalData.name}
//               onChange={(e) =>
//                 setModalData({ ...modalData, name: e.target.value })
//               }
//               placeholder="Your account name"
//               style={{ width: "250px" }}
//             />
//             <p>
//               <strong>Description:</strong>
//             </p>
//             <TextArea
//               value={modalData.description}
//               onChange={(e) =>
//                 setModalData({ ...modalData, description: e.target.value })
//               }
//               placeholder="Enter description"
//               style={{ width: "300px" }}
//             />
//             <p>
//               <strong>Start DateTime:</strong> {modalData.startDate || "N/A"}
//             </p>
//             <p>
//               <strong>End DateTime:</strong> {modalData.endDate || "N/A"}
//             </p>
//             <p>
//               <strong>Location:</strong> {modalData.location || "N/A"}
//             </p>
//             <p>
//               <strong>Coupon ID:</strong> {"N/A"}
//             </p>
//             <h4>List of Requested Characters:</h4>
//             <List
//               dataSource={modalData.listRequestCharacters}
//               setCurrentCharacterPage
//               renderItem={(item, index) => (
//                 <List.Item key={index}>
//                   <p>
//                     {item.cosplayerName || "N/A"} -{" "}
//                     {item.characterName || "N/A"} - Quantity:{" "}
//                     {item.quantity || 0} - Price:{" "}
//                     {item.price ? item.price.toLocaleString() : 0} VND
//                   </p>
//                 </List.Item>
//               )}
//             />
//             <p>
//               <strong>Total Price:</strong>{" "}
//               {modalData.price ? modalData.price.toLocaleString() : 0} VND
//             </p>
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </Modal>

//       <Modal
//         title="Details"
//         open={isRequestViewModalVisible}
//         onCancel={handleRequestModalConfirm}
//         footer={[
//           <Button key="close" onClick={handleRequestModalConfirm}>
//             Close
//           </Button>,
//         ]}
//         width={800}
//       >
//         {viewData ? (
//           viewData.characters ? (
//             <div>
//               <Form.Group className="mb-3">
//                 <Form.Label>Name</Form.Label>
//                 <Form.Control value={viewData.name} readOnly />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Start Date</Form.Label>
//                 <Form.Control value={viewData.startDate} readOnly />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>End Date</Form.Label>
//                 <Form.Control value={viewData.endDate} readOnly />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Location</Form.Label>
//                 <Form.Control value={viewData.location} readOnly />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={3}
//                   value={viewData.description}
//                   readOnly
//                 />
//               </Form.Group>
//               <h5>Costumes</h5>
//               {viewData.characters.length === 0 ? (
//                 <p>No costumes found.</p>
//               ) : (
//                 <>
//                   {paginateData(
//                     viewData.characters,
//                     currentCharacterPage,
//                     charactersPerPage
//                   ).map((char) => (
//                     <Card key={char.characterId} className="mb-3">
//                       <Card.Body>
//                         <div className="row">
//                           <div className="col-md-6">
//                             <Form.Group className="mb-3">
//                               <Form.Label>Character ID</Form.Label>
//                               <Form.Control value={char.characterId} readOnly />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Description</Form.Label>
//                               <Form.Control value={char.description} readOnly />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Max Height (cm)</Form.Label>
//                               <Form.Control
//                                 type="number"
//                                 value={char.maxHeight}
//                                 readOnly
//                               />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Max Weight (kg)</Form.Label>
//                               <Form.Control
//                                 type="number"
//                                 value={char.maxWeight}
//                                 readOnly
//                               />
//                             </Form.Group>
//                           </div>
//                           <div className="col-md-6">
//                             <Form.Group className="mb-3">
//                               <Form.Label>Min Height (cm)</Form.Label>
//                               <Form.Control
//                                 type="number"
//                                 value={char.minHeight}
//                                 readOnly
//                               />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Min Weight (kg)</Form.Label>
//                               <Form.Control
//                                 type="number"
//                                 value={char.minWeight}
//                                 readOnly
//                               />
//                             </Form.Group>
//                             <Form.Group className="mb-3">
//                               <Form.Label>Quantity</Form.Label>
//                               <Form.Control
//                                 type="number"
//                                 value={char.quantity}
//                                 readOnly
//                               />
//                             </Form.Group>
//                             {char.urlImage && (
//                               <Image
//                                 src={char.urlImage}
//                                 alt="Costume Preview"
//                                 width={100}
//                                 preview
//                                 style={{ display: "block", marginTop: "10px" }}
//                               />
//                             )}
//                           </div>
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   ))}
//                   <Pagination
//                     current={currentCharacterPage}
//                     pageSize={charactersPerPage}
//                     total={viewData.characters.length}
//                     onChange={(page) => setCurrentCharacterPage(page)}
//                     showSizeChanger={false}
//                     style={{ textAlign: "right" }}
//                   />
//                 </>
//               )}
//             </div>
//           ) : (
//             <div>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   <strong>Name:</strong>
//                 </Form.Label>
//                 <Input value={viewData.name} readOnly />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   <strong>Description:</strong>
//                 </Form.Label>
//                 <TextArea value={viewData.description} readOnly rows={4} />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   <strong>Location:</strong>
//                 </Form.Label>
//                 <Input value={viewData.location} readOnly />
//               </Form.Group>
//               {viewData.deposit && (
//                 <Form.Group className="mb-3">
//                   <Form.Label>
//                     <strong>Deposit:</strong>
//                   </Form.Label>
//                   <Input value={viewData.deposit} readOnly suffix="%" />
//                 </Form.Group>
//               )}
//               {viewData.listRequestCharacters.length > 0 && (
//                 <>
//                   <h4>List of Requested Characters:</h4>
//                   <ul>
//                     {viewData.listRequestCharacters.map((item, index) => (
//                       <li key={index}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             width: "100%",
//                           }}
//                         >
//                           <div style={{ flex: 1 }}>
//                             <p>
//                               <Tooltip
//                                 title={
//                                   item.cosplayerId ? (
//                                     tooltipLoading[item.cosplayerId] ? (
//                                       "Loading..."
//                                     ) : cosplayerData[item.cosplayerId] ? (
//                                       <div>
//                                         <p>
//                                           <strong>Name:</strong>{" "}
//                                           {cosplayerData[item.cosplayerId].name}
//                                         </p>
//                                         <p>
//                                           <strong>Email:</strong>{" "}
//                                           {
//                                             cosplayerData[item.cosplayerId]
//                                               .email
//                                           }
//                                         </p>
//                                         <p>
//                                           <strong>Description:</strong>{" "}
//                                           {cosplayerData[item.cosplayerId]
//                                             .description || "N/A"}
//                                         </p>
//                                         <p>
//                                           <strong>Height:</strong>{" "}
//                                           {cosplayerData[item.cosplayerId]
//                                             .height || "N/A"}{" "}
//                                           cm
//                                         </p>
//                                         <p>
//                                           <strong>Weight:</strong>{" "}
//                                           {cosplayerData[item.cosplayerId]
//                                             .weight || "N/A"}{" "}
//                                           kg
//                                         </p>
//                                         <p>
//                                           <strong>Average Star:</strong>{" "}
//                                           {cosplayerData[item.cosplayerId]
//                                             .averageStar || "N/A"}
//                                         </p>
//                                         <p>
//                                           <Link
//                                             target="_blank"
//                                             to={`/user-profile/${item.cosplayerId}`}
//                                             style={{ color: "#1890ff" }}
//                                           >
//                                             View Profile
//                                           </Link>
//                                         </p>
//                                       </div>
//                                     ) : (
//                                       "Failed to load cosplayer data"
//                                     )
//                                   ) : (
//                                     "No cosplayer assigned"
//                                   )
//                                 }
//                                 onOpenChange={(open) =>
//                                   open &&
//                                   item.cosplayerId &&
//                                   fetchCosplayerData(item.cosplayerId)
//                                 }
//                               >
//                                 <strong
//                                   style={{
//                                     cursor: item.cosplayerId
//                                       ? "pointer"
//                                       : "default",
//                                   }}
//                                 >
//                                   {item.cosplayerName}
//                                 </strong>
//                               </Tooltip>{" "}
//                               as <strong>{item.characterName}</strong>
//                             </p>
//                             <p className="d-flex">
//                               <strong>Status: </strong> &nbsp;
//                               <i>
//                                 <u>{item.status}</u>
//                               </i>
//                             </p>
//                             <p>
//                               Quantity: {item.quantity} | Hourly Rate:{" "}
//                               {item.salaryIndex.toLocaleString()} VND/h |
//                               Character Price:{" "}
//                               {item.characterPrice.toLocaleString()} VND/day
//                             </p>
//                             <p>
//                               <strong>Request Dates:</strong>
//                             </p>
//                             <ul>
//                               {item.requestDates.map((date, idx) => (
//                                 <li key={idx}>
//                                   {date.startDate} - {date.endDate}
//                                 </li>
//                               ))}
//                             </ul>
//                             <Tooltip
//                               title={`Price = [(${item.totalHours.toFixed(
//                                 2
//                               )} hours × ${item.salaryIndex} VND/h) + ($ {
//                                 item.totalDays
//                               } days × ${item.characterPrice} VND/day)] × ${
//                                 item.quantity
//                               }`}
//                             >
//                               <p>
//                                 Price:{" "}
//                                 <strong>
//                                   {item.price.toLocaleString()} VND
//                                 </strong>
//                               </p>
//                             </Tooltip>
//                           </div>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </>
//               )}
//               {!viewData.characters &&
//                 viewData.listRequestCharacters.length === 0 && (
//                   <p>No characters requested.</p>
//                 )}
//               <p>
//                 <strong>Total Price:</strong>{" "}
//                 <strong>
//                   {viewData && !isNaN(viewData.price)
//                     ? viewData.price.toLocaleString()
//                     : "0"}{" "}
//                   VND
//                 </strong>
//               </p>
//               {viewData.status === "Cancel" && viewData.reason && (
//                 <h4 className="reason-text">
//                   <strong>Reason:</strong>{" "}
//                   <span style={{ color: "red" }}>{viewData.reason}</span>
//                 </h4>
//               )}
//             </div>
//           )
//         ) : (
//           <p>Loading...</p>
//         )}
//       </Modal>
//     </div>
//   );
// };

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   totalEntries,
//   showingEntries,
//   onPageChange,
//   rowsPerPage,
//   onRowsPerPageChange,
//   rowsPerPageOptions,
// }) => (
//   <div
//     className="pagination-controls"
//     style={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//     }}
//   >
//     <div style={{ display: "flex", alignItems: "center" }}>
//       <span style={{ marginRight: "20px" }}>
//         Showing {showingEntries} of {totalEntries} entries
//       </span>
//       <div className="rows-per-page" style={{ display: "flex", gap: "10px" }}>
//         <span>Rows per page:</span>
//         <Dropdown
//           overlay={
//             <Menu onClick={({ key }) => onRowsPerPageChange(Number(key))}>
//               {rowsPerPageOptions.map((option) => (
//                 <Menu.Item key={option}>{option}</Menu.Item>
//               ))}
//             </Menu>
//           }
//         >
//           <Button>{rowsPerPage} ▼</Button>
//         </Dropdown>
//       </div>
//     </div>
//     <Pagination
//       current={currentPage}
//       total={totalEntries}
//       pageSize={rowsPerPage}
//       onChange={onPageChange}
//       showSizeChanger={false}
//     />
//   </div>
// );

// export default ManageContract;

//=================================== tách component, file này xử lí Service S002: Thuê cosplayer

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Modal as BootstrapModal,
  Form,
  Card,
  Pagination as BootstrapPagination,
} from "react-bootstrap";
import {
  Button,
  Popconfirm,
  Modal,
  Input,
  List,
  message,
  Pagination,
  Tooltip,
  Dropdown,
  Menu,
} from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Link } from "react-router-dom";
import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
import "../../../styles/Manager/ManageContract.scss";
import dayjs from "dayjs";
import ManageContractRentalCostume from "./ManageContractRentalCostume";
import ManageContractEventOrganzie from "./ManageContractEventOrganize.js";
const { TextArea } = Input;

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ManageContract = () => {
  const [tabValue, setTabValue] = useState(0);
  const [contracts, setContracts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRequestBased, setIsRequestBased] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    deposit: "",
    requestId: "",
  });
  const [isRequestViewModalVisible, setIsRequestViewModalVisible] =
    useState(false);
  const [viewData, setViewData] = useState(null);
  const [cosplayerData, setCosplayerData] = useState({});
  const [tooltipLoading, setTooltipLoading] = useState({});
  const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
  const charactersPerPage = 2;
  const [searchContract, setSearchContract] = useState("");
  const [searchRequest, setSearchRequest] = useState("");
  const [sortContract, setSortContract] = useState({
    field: "status",
    order: "asc",
  });
  const [sortRequest, setSortRequest] = useState({
    field: "statusRequest",
    order: "asc",
  });
  const [currentPageContract, setCurrentPageContract] = useState(1);
  const [currentPageRequest, setCurrentPageRequest] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 15, 30];

  const handleCompleteContract = async (contractId) => {
    if (!contractId) {
      console.log("Invalid contract ID.");
      return;
    }

    try {
      await ManageContractService.updateContractStatus(contractId, "Completed");
      setContracts((prev) =>
        prev.map((con) =>
          con.contractId === contractId ? { ...con, status: "Completed" } : con
        )
      );
      toast.success("Contract completed successfully!");
    } catch (error) {
      console.error("Error completing contract:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete contract."
      );
    }
  };

  const calculateCharacterDuration = (requestDateResponses) => {
    let totalHours = 0;
    const uniqueDays = new Set();

    (requestDateResponses || []).forEach((dateResponse) => {
      const start = dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY");
      const end = dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY");

      if (start.isValid() && end.isValid() && start < end) {
        totalHours += end.diff(start, "hour", true);
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

  const calculateCosplayerPrice = (
    salaryIndex,
    quantity,
    totalHours,
    characterPrice,
    totalDays
  ) => {
    if (
      !salaryIndex ||
      !quantity ||
      !totalHours ||
      characterPrice == null ||
      totalDays == null ||
      isNaN(salaryIndex) ||
      isNaN(quantity) ||
      isNaN(totalHours) ||
      isNaN(characterPrice) ||
      isNaN(totalDays)
    ) {
      return 0;
    }
    return (totalHours * salaryIndex + totalDays * characterPrice) * quantity;
  };

  const fetchCosplayerData = async (cosplayerId) => {
    if (!cosplayerId || cosplayerData[cosplayerId]) return;
    try {
      setTooltipLoading((prev) => ({ ...prev, [cosplayerId]: true }));
      const response =
        await ManageContractService.getNameCosplayerInRequestByCosplayerId(
          cosplayerId
        );
      setCosplayerData((prev) => ({ ...prev, [cosplayerId]: response }));
    } catch (error) {
      console.error(
        `Failed to fetch cosplayer data for ID ${cosplayerId}:`,
        error
      );
      setCosplayerData((prev) => ({ ...prev, [cosplayerId]: null }));
    } finally {
      setTooltipLoading((prev) => ({ ...prev, [cosplayerId]: false }));
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all contracts and filter by serviceId === "S002"
        try {
          const contractData = await ManageContractService.getAllContracts();
          const validContracts = await Promise.all(
            contractData.map(async (con) => {
              if (!con.contractId || !con.requestId) return null;
              try {
                const request =
                  await ManageContractService.getRequestByRequestId(
                    con.requestId
                  );
                if (request?.serviceId === "S002") {
                  return {
                    ...con,
                    contractName: con.contractName || "N/A",
                    price: con.price || 0,
                    status: con.status || "N/A",
                    createDate: con.createDate || "N/A",
                    startDate: con.startDate || "N/A",
                    endDate: con.endDate || "N/A",
                    requestId: con.requestId || "",
                  };
                }
                return null;
              } catch (error) {
                console.warn(
                  `Failed to fetch request for contract ${con.contractId}:`,
                  error
                );
                return null;
              }
            })
          );

          const filteredContracts = validContracts.filter(
            (con) => con !== null
          );

          if (isMounted) {
            setContracts(filteredContracts);
            if (filteredContracts.length === 0) {
              toast.warn("No valid contracts found for Hire Cosplayer.");
            }
          }
        } catch (contractError) {
          console.error("Failed to fetch contracts:", contractError);
          toast.warn(
            "Could not fetch contracts: " +
              (contractError.response?.data?.message || contractError.message)
          );
        }

        // Fetch all requests
        try {
          const requestData = await ManageContractService.getAllRequests();
          const formattedData = requestData
            .filter(
              (req) =>
                ["browsed", "approved"].includes(req.status?.toLowerCase()) &&
                req.serviceId === "S002"
            )
            .map((req) => {
              let startDate = req.startDate || "N/A";
              let endDate = req.endDate || "N/A";
              if (
                req.charactersListResponse?.length > 0 &&
                req.charactersListResponse[0]?.requestDateResponses?.length > 0
              ) {
                const dateResponse =
                  req.charactersListResponse[0].requestDateResponses[0];
                startDate = dateResponse.startDate;
                endDate = dateResponse.endDate;
              }
              return {
                id: req.requestId,
                serviceId: "S002",
                name: req.name || "N/A",
                description: req.description || "N/A",
                location: req.location || "N/A",
                price: req.price || 0,
                deposit: req.deposit || 0,
                statusRequest: mapStatus(req.status),
                startDate,
                endDate,
                reason: req.reason || "",
                contractId: req.contractId || null,
                charactersListResponse: req.charactersListResponse || [],
              };
            });
          if (isMounted) {
            setRequests(formattedData);
            if (formattedData.length === 0) {
              toast.info(
                "No requests with status Browsed or Approved found for Hire Cosplayer."
              );
            } else {
              toast.success(
                `Fetched ${formattedData.length} requests for Hire Cosplayer.`
              );
            }
          }
        } catch (requestError) {
          console.error("Failed to fetch requests:", requestError);
          toast.error(
            "Could not fetch requests: " +
              (requestError.response?.data?.message || requestError.message)
          );
        }
      } catch (error) {
        if (isMounted) {
          console.error("Unexpected error:", error);
          toast.error("Unexpected error: " + error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const mapStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Pending";
      case "browsed":
        return "Browsed";
      case "approved":
        return "Approved";
      case "cancel":
        return "Cancel";
      default:
        return "Unknown";
    }
  };

  const filterAndSortContracts = (data, search) => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter((item) => {
        const name = item.contractName ? item.contractName.toLowerCase() : "";
        const status = item.status ? item.status.toLowerCase() : "";
        return (
          name.includes(search.toLowerCase()) ||
          status.includes(search.toLowerCase())
        );
      });
    }

    return filtered.sort((a, b) => {
      let valueA = a[sortContract.field] || "";
      let valueB = b[sortContract.field] || "";

      if (sortContract.field === "price") {
        valueA = valueA || 0;
        valueB = valueB || 0;
        return sortContract.order === "asc" ? valueA - valueB : valueB - valueA;
      }

      valueA = valueA ? String(valueA).toLowerCase() : "";
      valueB = valueB ? String(valueB).toLowerCase() : "";
      return sortContract.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredContracts = filterAndSortContracts(contracts, searchContract);

  const totalPagesContract = useMemo(() => {
    return Math.ceil(filteredContracts.length / rowsPerPage);
  }, [filteredContracts.length, rowsPerPage]);

  useEffect(() => {
    if (currentPageContract > totalPagesContract && totalPagesContract > 0) {
      setCurrentPageContract(1);
    }
  }, [totalPagesContract, currentPageContract]);

  const paginatedContracts = paginateData(
    filteredContracts,
    currentPageContract
  );

  const filterAndSortRequests = (data, search) => {
    let filtered = [...data];

    // Filter out requests that have associated contracts
    const contractRequestIds = contracts.map((con) => con.requestId);
    filtered = filtered.filter((req) => !contractRequestIds.includes(req.id));

    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    return filtered.sort((a, b) => {
      let valueA = a[sortRequest.field];
      let valueB = b[sortRequest.field];

      if (sortRequest.field === "price") {
        valueA = valueA || 0;
        valueB = valueB || 0;
        return sortRequest.order === "asc" ? valueA - valueB : valueB - valueA;
      }

      valueA = valueA ? String(valueA).toLowerCase() : "";
      valueB = valueB ? String(valueB).toLowerCase() : "";
      return sortRequest.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredRequests = filterAndSortRequests(requests, searchRequest);

  const totalPagesRequest = useMemo(() => {
    return Math.ceil(filteredRequests.length / rowsPerPage);
  }, [filteredRequests.length, rowsPerPage]);

  const totalEntries = filteredRequests.length;

  useEffect(() => {
    if (currentPageRequest > totalPagesRequest && totalPagesRequest > 0) {
      setCurrentPageRequest(1);
    }
  }, [totalPagesRequest, currentPageRequest]);

  const paginatedRequests = paginateData(filteredRequests, currentPageRequest);

  function paginateData(data, page, perPage = rowsPerPage) {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
  }

  const handleShowModal = (item = null, request = null) => {
    if (item) {
      setIsEditing(true);
      setIsRequestBased(false);
      setCurrentItem(item);
      setFormData({
        customerName: item.customerName || "N/A",
        deposit: item.deposit || "0",
        requestId: item.requestId || "",
      });
    } else if (request) {
      if (request.contractId) {
        toast.warn("This request already has an associated contract!");
        return;
      }
      setIsEditing(false);
      setIsRequestBased(true);
      setCurrentItem(request);
      setFormData({
        customerName: request.name || "N/A",
        deposit: request.deposit ? `${request.deposit}%` : "0%",
        requestId: request.id || "",
      });
    } else {
      setIsEditing(false);
      setIsRequestBased(false);
      setFormData({
        customerName: "",
        deposit: "",
        requestId: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setIsRequestBased(false);
    setCurrentItem(null);
    setFormData({
      customerName: "",
      deposit: "",
      requestId: "",
    });
  };

  const handleSubmit = async () => {
    if (!formData.requestId) {
      toast.warn("Request ID is required to create a contract!");
      return;
    }

    try {
      const depositValue = parseFloat(formData.deposit.replace("%", "")) || 0;
      const newContract = await ManageContractService.createContract(
        formData.requestId,
        depositValue
      );

      setContracts([...contracts, newContract]);

      if (isRequestBased) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === currentItem.id
              ? { ...req, contractId: newContract.contractId }
              : req
          )
        );
      }

      toast.success("Contract created successfully!");
      window.location.reload();
      handleCloseModal();
    } catch (error) {
      toast.error(
        "Failed to create contract: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Error creating contract:", error);
    }
  };

  const handleViewContractDetail = async (contract) => {
    try {
      const requestData = await ManageContractService.getRequestByRequestId(
        contract.requestId
      );
      if (!requestData) {
        throw new Error("Request data not found");
      }

      const formattedData = {
        name: requestData.name || "N/A",
        description: requestData.description || "N/A",
        location: requestData.location || "N/A",
        deposit: requestData.deposit || "N/A",
        listRequestCharacters: [],
        price: 0,
        status: mapStatus(requestData.status),
        reason: requestData.reason || null,
      };

      const charactersList = requestData.charactersListResponse || [];
      if (charactersList.length > 0) {
        const listRequestCharacters = await Promise.all(
          charactersList.map(async (char) => {
            const { totalHours, totalDays } = calculateCharacterDuration(
              char.requestDateResponses || []
            );

            let cosplayerName = "Not Assigned";
            let salaryIndex = 1;
            let characterPrice = 0;
            let characterName = "Unknown";

            try {
              const characterData =
                await ManageContractService.getCharacterById(char.characterId);
              characterName = characterData?.characterName || "Unknown";
              characterPrice = Number(characterData?.price) || 0;
            } catch (error) {
              console.warn(
                `Failed to fetch character for ID ${char.characterId}:`,
                error
              );
            }

            if (char.cosplayerId) {
              try {
                const cosplayerData =
                  await ManageContractService.getNameCosplayerInRequestByCosplayerId(
                    char.cosplayerId
                  );
                cosplayerName = cosplayerData?.name || "Not Assigned";
                salaryIndex = Number(cosplayerData?.salaryIndex) || 1;
              } catch (error) {
                console.warn(
                  `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
                  error
                );
              }
            }

            const price = calculateCosplayerPrice(
              salaryIndex,
              Number(char.quantity) || 1,
              totalHours,
              characterPrice,
              totalDays
            );

            return {
              cosplayerId: char.cosplayerId || null,
              characterId: char.characterId,
              cosplayerName,
              characterName,
              characterPrice,
              quantity: Number(char.quantity) || 1,
              salaryIndex,
              totalHours,
              totalDays,
              price,
              requestDates: (char.requestDateResponses || []).map((date) => ({
                startDate: date.startDate,
                endDate: date.endDate,
              })),
              status: char.status || "Unknown",
            };
          })
        );

        formattedData.listRequestCharacters = listRequestCharacters;
        formattedData.price = listRequestCharacters.reduce(
          (total, char) => total + char.price,
          0
        );
      }

      setViewData(formattedData);
      setIsRequestViewModalVisible(true);
      setCurrentCharacterPage(1);
    } catch (error) {
      console.error("Failed to fetch contract details:", error);
      message.warn(
        error.response?.data?.message || "Failed to fetch contract details"
      );
    }
  };

  const handleViewRequestDetail = async (id) => {
    try {
      const data = await ManageContractService.getRequestByRequestId(id);
      if (!data) {
        throw new Error("Request data not found");
      }

      const formattedData = {
        name: data.name || "N/A",
        description: data.description || "N/A",
        location: data.location || "N/A",
        deposit: data.deposit || "N/A",
        listRequestCharacters: [],
        price: 0,
        status: mapStatus(data.status),
        reason: data.reason || null,
      };

      const charactersList = data.charactersListResponse || [];
      if (charactersList.length > 0) {
        const listRequestCharacters = await Promise.all(
          charactersList.map(async (char) => {
            const { totalHours, totalDays } = calculateCharacterDuration(
              char.requestDateResponses || []
            );

            let cosplayerName = "Not Assigned";
            let salaryIndex = 1;
            let characterPrice = 0;
            let characterName = "Unknown";

            try {
              const characterData =
                await ManageContractService.getCharacterById(char.characterId);
              characterName = characterData?.characterName || "Unknown";
              characterPrice = Number(characterData?.price) || 0;
            } catch (error) {
              console.warn(
                `Failed to fetch character for ID ${char.characterId}:`,
                error
              );
            }

            if (char.cosplayerId) {
              try {
                const cosplayerData =
                  await ManageContractService.getNameCosplayerInRequestByCosplayerId(
                    char.cosplayerId
                  );
                cosplayerName = cosplayerData?.name || "Not Assigned";
                salaryIndex = Number(cosplayerData?.salaryIndex) || 1;
              } catch (error) {
                console.warn(
                  `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
                  error
                );
              }
            }

            const price = calculateCosplayerPrice(
              salaryIndex,
              Number(char.quantity) || 1,
              totalHours,
              characterPrice,
              totalDays
            );

            return {
              cosplayerId: char.cosplayerId || null,
              characterId: char.characterId,
              cosplayerName,
              characterName,
              characterPrice,
              quantity: Number(char.quantity) || 1,
              salaryIndex,
              totalHours,
              totalDays,
              price,
              requestDates: (char.requestDateResponses || []).map((date) => ({
                startDate: date.startDate,
                endDate: date.endDate,
              })),
            };
          })
        );

        formattedData.listRequestCharacters = listRequestCharacters;
        formattedData.price = listRequestCharacters.reduce(
          (total, char) => total + char.price,
          0
        );
      }

      setViewData(formattedData);
      setIsRequestViewModalVisible(true);
      setCurrentCharacterPage(1);
    } catch (error) {
      toast.error("Failed to fetch request details");
      console.error("Error in handleViewRequestDetail:", error);
    }
  };

  const handleRequestModalConfirm = () => {
    setIsRequestViewModalVisible(false);
    setViewData(null);
    setCosplayerData({});
  };

  const handleSortContract = (field) => {
    setSortContract((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPageContract(1);
  };

  const handleSortRequest = (field) => {
    setSortRequest((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPageRequest(1);
  };

  const handlePageChangeContract = (page) => setCurrentPageContract(page);
  const handlePageChangeRequest = (page) => setCurrentPageRequest(page);

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPageContract(1);
    setCurrentPageRequest(1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <div className="manage-general  ">
      <h2 className="manage-general-title">
        Hire Cosplayer Requests & Contracts
      </h2>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="manage tabs"
            style={{ marginLeft: "20vh" }}
          >
            <Tab
              label="Approved Requests"
              {...a11yProps(0)}
              style={{ color: "white" }}
            />
            <Tab
              label="Contracts"
              {...a11yProps(1)}
              style={{ color: "white" }}
            />
          </Tabs>
        </Box>

        <CustomTabPanel value={tabValue} index={0}>
          <div className="table-container">
            <Card className="status-table-card">
              <Card.Body>
                <div className="table-header">
                  <h3>Approved Requests</h3>
                  <Form.Control
                    type="text"
                    placeholder="Search requests..."
                    value={searchRequest}
                    onChange={(e) => setSearchRequest(e.target.value)}
                    className="search-input"
                  />
                </div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th onClick={() => handleSortRequest("name")}>
                        Name{" "}
                        {sortRequest.field === "name" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSortRequest("description")}>
                        Description{" "}
                        {sortRequest.field === "description" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th>Location</th>
                      <th onClick={() => handleSortRequest("price")}>
                        Price{" "}
                        {sortRequest.field === "price" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSortRequest("statusRequest")}>
                        Status{" "}
                        {sortRequest.field === "statusRequest" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSortRequest("startDate")}>
                        Start Date{" "}
                        {sortRequest.field === "startDate" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSortRequest("endDate")}>
                        End Date{" "}
                        {sortRequest.field === "endDate" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSortRequest("reason")}>
                        Reason{" "}
                        {sortRequest.field === "reason" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.length > 0 ? (
                      paginatedRequests.map((req) => (
                        <tr key={req.id}>
                          <td>{req.name}</td>
                          <td>{req.description}</td>
                          <td>{req.location}</td>
                          <td>
                            {req.price ? req.price.toLocaleString() : "N/A"}
                          </td>
                          <td>{req.statusRequest}</td>
                          <td>{req.startDate}</td>
                          <td>{req.endDate}</td>
                          <td>{req.reason}</td>
                          <td>
                            <Button
                              size="small"
                              onClick={() => handleViewRequestDetail(req.id)}
                              style={{ marginRight: "8px" }}
                            >
                              View
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleShowModal(null, req)}
                            >
                              Create Contract
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <PaginationControls
                  currentPage={currentPageRequest}
                  totalPages={totalPagesRequest}
                  totalEntries={totalEntries}
                  showingEntries={paginatedRequests.length}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handlePageChangeRequest}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={rowsPerPageOptions}
                />
              </Card.Body>
            </Card>
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={1}>
          <div className="table-container">
            <Card className="status-table-card">
              <Card.Body>
                <div className="table-header">
                  <h3>Contracts</h3>
                  <Form.Control
                    type="text"
                    placeholder="Search ..."
                    value={searchContract}
                    onChange={(e) => setSearchContract(e.target.value)}
                    className="search-input"
                  />
                </div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSortContract("contractName")}
                        >
                          Contract Name
                          {sortContract.field === "contractName" &&
                            (sortContract.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            ))}
                        </span>
                      </th>
                      <th className="text-center">Price</th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSortContract("status")}
                        >
                          Status
                          {sortContract.field === "status" &&
                            (sortContract.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            ))}
                        </span>
                      </th>
                      <th className="text-center">Contract Created Date</th>
                      <th className="text-center">Start Date</th>
                      <th className="text-center">End Date</th>
                      <th className="text-center">Actions</th>
                      <th className="text-center">Complete Contract</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContracts.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No contracts found
                        </td>
                      </tr>
                    ) : (
                      paginatedContracts.map((con, index) => (
                        <tr key={con.contractId || `contract-${index}`}>
                          <td className="text-center">
                            {con.contractName || "N/A"}
                          </td>
                          <td className="text-center">
                            {con.price ? con.price.toLocaleString() : "N/A"}
                          </td>
                          <td className="text-center">{con.status || "N/A"}</td>
                          <td className="text-center">{con.createDate}</td>
                          <td className="text-center">
                            {con.startDate &&
                            dayjs(con.startDate, "HH:mm DD/MM/YYYY").isValid()
                              ? dayjs(con.startDate, "HH:mm DD/MM/YYYY").format(
                                  "DD/MM/YYYY"
                                )
                              : "N/A"}
                          </td>
                          <td className="text-center">
                            {con.endDate &&
                            dayjs(con.endDate, "HH:mm DD/MM/YYYY").isValid()
                              ? dayjs(con.endDate, "HH:mm DD/MM/YYYY").format(
                                  "DD/MM/YYYY"
                                )
                              : "N/A"}
                          </td>
                          <td className="text-center">
                            <Button
                              type="default"
                              size="small"
                              onClick={() => handleViewContractDetail(con)}
                              style={{ marginRight: "8px" }}
                              disabled={!con.contractId}
                            >
                              View Detail
                            </Button>
                          </td>
                          <td className="text-center">
                            {con.contractId &&
                            con.status === "FinalSettlement" ? (
                              <Popconfirm
                                title="Are you sure you want to complete this contract?"
                                onConfirm={() =>
                                  handleCompleteContract(con.contractId)
                                }
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button type="primary" size="small">
                                  Complete
                                </Button>
                              </Popconfirm>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>

                <PaginationControls
                  currentPage={currentPageContract}
                  totalPages={totalPagesContract}
                  totalEntries={filteredContracts.length}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handlePageChangeContract}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={rowsPerPageOptions}
                />
              </Card.Body>
            </Card>
          </div>
        </CustomTabPanel>
      </Box>

      <BootstrapModal show={showModal} onHide={handleCloseModal} centered>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>
            {isEditing ? "Edit Contract" : "Add Contract"}
          </BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Customer Name</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.customerName}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Deposit</strong>
              </Form.Label>
              <Form.Control type="text" value={formData.deposit} readOnly />
            </Form.Group>
          </Form>
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          {!isEditing && (
            <Button variant="primary" onClick={handleSubmit}>
              Add
            </Button>
          )}
        </BootstrapModal.Footer>
      </BootstrapModal>

      <Modal
        title="Details"
        open={isRequestViewModalVisible}
        onCancel={handleRequestModalConfirm}
        footer={[
          <Button key="close" onClick={handleRequestModalConfirm}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {viewData ? (
          <div>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Name:</strong>
              </Form.Label>
              <Input value={viewData.name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Description:</strong>
              </Form.Label>
              <TextArea value={viewData.description} readOnly rows={4} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Location:</strong>
              </Form.Label>
              <Input value={viewData.location} readOnly />
            </Form.Group>
            {viewData.deposit && (
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Deposit:</strong>
                </Form.Label>
                <Input value={viewData.deposit} readOnly suffix="%" />
              </Form.Group>
            )}
            {viewData.listRequestCharacters.length > 0 && (
              <>
                <h4>List of Requested Characters:</h4>
                <ul>
                  {viewData.listRequestCharacters.map((item, index) => (
                    <li key={index}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <p>
                            <Tooltip
                              title={
                                item.cosplayerId ? (
                                  tooltipLoading[item.cosplayerId] ? (
                                    "Loading..."
                                  ) : cosplayerData[item.cosplayerId] ? (
                                    <div>
                                      <p>
                                        <strong>Name:</strong>{" "}
                                        {cosplayerData[item.cosplayerId].name}
                                      </p>
                                      <p>
                                        <strong>Email:</strong>{" "}
                                        {cosplayerData[item.cosplayerId].email}
                                      </p>
                                      <p>
                                        <strong>Description:</strong>{" "}
                                        {cosplayerData[item.cosplayerId]
                                          .description || "N/A"}
                                      </p>
                                      <p>
                                        <strong>Height:</strong>{" "}
                                        {cosplayerData[item.cosplayerId]
                                          .height || "N/A"}{" "}
                                        cm
                                      </p>
                                      <p>
                                        <strong>Weight:</strong>{" "}
                                        {cosplayerData[item.cosplayerId]
                                          .weight || "N/A"}{" "}
                                        kg
                                      </p>
                                      <p>
                                        <strong>Average Star:</strong>{" "}
                                        {cosplayerData[item.cosplayerId]
                                          .averageStar || "N/A"}
                                      </p>
                                      <p>
                                        <Link
                                          target="_blank"
                                          to={`/user-profile/${item.cosplayerId}`}
                                          style={{ color: "#1890ff" }}
                                        >
                                          View Profile
                                        </Link>
                                      </p>
                                    </div>
                                  ) : (
                                    "Failed to load cosplayer data"
                                  )
                                ) : (
                                  "No cosplayer assigned"
                                )
                              }
                              onOpenChange={(open) =>
                                open &&
                                item.cosplayerId &&
                                fetchCosplayerData(item.cosplayerId)
                              }
                            >
                              <strong
                                style={{
                                  cursor: item.cosplayerId
                                    ? "pointer"
                                    : "default",
                                }}
                              >
                                {item.cosplayerName}
                              </strong>
                            </Tooltip>{" "}
                            as <strong>{item.characterName}</strong>
                          </p>
                          <p className="d-flex">
                            <strong>Status: </strong>
                            <i>
                              <u>{item.status}</u>
                            </i>
                          </p>
                          <p>
                            Quantity: {item.quantity} | Hourly Rate:{" "}
                            {item.salaryIndex.toLocaleString()} VND/h |
                            Character Price:{" "}
                            {item.characterPrice.toLocaleString()} VND/day
                          </p>
                          <p>
                            <strong>Request Dates:</strong>
                          </p>
                          <ul>
                            {item.requestDates.map((date, idx) => (
                              <li key={idx}>
                                {date.startDate} - {date.endDate}
                              </li>
                            ))}
                          </ul>
                          <Tooltip
                            title={`Price = [(${item.totalHours.toFixed(
                              2
                            )} hours × ${item.salaryIndex} VND/h) + (${
                              item.totalDays
                            } days × ${item.characterPrice} VND/day)] × ${
                              item.quantity
                            }`}
                          >
                            <p>
                              Price:{" "}
                              <strong>{item.price.toLocaleString()} VND</strong>
                            </p>
                          </Tooltip>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {!viewData.listRequestCharacters.length && (
              <p>No characters requested.</p>
            )}
            <p>
              <strong>Total Price:</strong>{" "}
              <strong>
                {viewData && !isNaN(viewData.price)
                  ? viewData.price.toLocaleString()
                  : "0"}{" "}
                VND
              </strong>
            </p>
            {viewData.status === "Cancel" && viewData.reason && (
              <h4 className="reason-text">
                <strong>Reason:</strong>{" "}
                <span style={{ color: "red" }}>{viewData.reason}</span>
              </h4>
            )}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
      <ManageContractRentalCostume />
      <ManageContractEventOrganzie />
    </div>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  totalEntries,
  showingEntries,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions,
}) => (
  <div
    className="pagination-controls"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ marginRight: "20px" }}>
        Showing {showingEntries} of {totalEntries} entries
      </span>
      <div className="rows-per-page" style={{ display: "flex", gap: "10px" }}>
        <span>Rows per page:</span>
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => onRowsPerPageChange(Number(key))}>
              {rowsPerPageOptions.map((option) => (
                <Menu.Item key={option}>{option}</Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button>{rowsPerPage} ▼</Button>
        </Dropdown>
      </div>
    </div>
    <Pagination
      current={currentPage}
      total={totalEntries}
      pageSize={rowsPerPage}
      onChange={onPageChange}
      showSizeChanger={false}
    />
  </div>
);

export default ManageContract;
