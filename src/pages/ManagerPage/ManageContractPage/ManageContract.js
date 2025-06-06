// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Table,
//   Form,
//   Card,
//   Pagination as BootstrapPagination,
//   Modal as BootstrapModal, // Thêm import này
// } from "react-bootstrap";
// import { Button, Popconfirm, Dropdown, Menu, Pagination } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
// import "../../../styles/Manager/ManageContract.scss";
// import dayjs from "dayjs";
// import ViewManageRentCosplayer from "../ManageRequestPage/ViewManageRentCosplayer.js"; // Import ViewMyRentCos

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
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isRequestBased, setIsRequestBased] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [formData, setFormData] = useState({
//     customerName: "",
//     deposit: "",
//     requestId: "",
//   });
//   const [searchContract, setSearchContract] = useState("");
//   const [searchRequest, setSearchRequest] = useState("");
//   const [sortContract, setSortContract] = useState({
//     field: " ",
//     order: " ",
//   });
//   const [sortRequest, setSortRequest] = useState({
//     field: " ",
//     order: " ",
//   });
//   const [currentPageContract, setCurrentPageContract] = useState(1);
//   const [currentPageRequest, setCurrentPageRequest] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 15, 30];

//   useEffect(() => {
//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Fetch all contracts and filter by serviceId === "S002"
//         try {
//           const contractData = await ManageContractService.getAllContracts();
//           const validContracts = await Promise.all(
//             contractData.map(async (con) => {
//               if (!con.contractId || !con.requestId) return null;
//               try {
//                 const request =
//                   await ManageContractService.getRequestByRequestId(
//                     con.requestId
//                   );
//                 if (request?.serviceId === "S002") {
//                   return {
//                     ...con,
//                     contractName: con.contractName || "N/A",
//                     price: con.price || 0,
//                     status: con.status || "N/A",
//                     createDate: con.createDate || "N/A",
//                     startDate: con.startDate || "N/A",
//                     endDate: con.endDate || "N/A",
//                     requestId: con.requestId || "",
//                   };
//                 }
//                 return null;
//               } catch (error) {
//                 console.warn(
//                   `Failed to fetch request for contract ${con.contractId}:`,
//                   error
//                 );
//                 return null;
//               }
//             })
//           );

//           const filteredContracts = validContracts.filter(
//             (con) => con !== null
//           );

//           if (isMounted) {
//             setContracts(filteredContracts);
//             if (filteredContracts.length === 0) {
//               console.log("No valid contracts found for Hire Cosplayer.");
//             }
//           }
//         } catch (contractError) {
//           console.error("Failed to fetch contracts:", contractError);
//           console.log(
//             "Could not fetch contracts: " +
//               (contractError.response?.data?.message || contractError.message)
//           );
//         }

//         // Fetch all requests
//         try {
//           const requestData = await ManageContractService.getAllRequests();
//           const formattedData = requestData
//             .filter(
//               (req) =>
//                 ["browsed", "approved"].includes(req.status?.toLowerCase()) &&
//                 req.serviceId === "S002"
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
//                 serviceId: "S002",
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
//           if (isMounted) {
//             setRequests(formattedData);
//             if (formattedData.length === 0) {
//               console.log(
//                 "No requests with status Browsed or Approved found for Hire Cosplayer."
//               );
//             } else {
//               console.log(
//                 `Fetched ${formattedData.length} requests for Hire Cosplayer.`
//               );
//             }
//           }
//         } catch (requestError) {
//           console.error("Failed to fetch requests:", requestError);
//           console.log(
//             "Could not fetch requests: " +
//               (requestError.response?.data?.message || requestError.message)
//           );
//         }
//       } catch (error) {
//         if (isMounted) {
//           console.error("Unexpected error:", error);
//           console.log("Unexpected error: " + error.message);
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

//   const filterAndSortContracts = (data, search) => {
//     let filtered = [...data];

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
//       let valueA = a[sortContract.field] || "";
//       let valueB = b[sortContract.field] || "";

//       if (sortContract.field === "price") {
//         valueA = valueA || 0;
//         valueB = valueB || 0;
//         return sortContract.order === "asc" ? valueA - valueB : valueB - valueA;
//       }

//       valueA = valueA ? String(valueA).toLowerCase() : "";
//       valueB = valueB ? String(valueB).toLowerCase() : "";
//       return sortContract.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredContracts = filterAndSortContracts(contracts, searchContract);

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

//   const filterAndSortRequests = (data, search) => {
//     let filtered = [...data];

//     // Filter out requests that have associated contracts
//     const contractRequestIds = contracts.map((con) => con.requestId);
//     filtered = filtered.filter((req) => !contractRequestIds.includes(req.id));

//     if (search) {
//       filtered = filtered.filter((item) =>
//         Object.values(item).some((val) =>
//           String(val).toLowerCase().includes(search.toLowerCase())
//         )
//       );
//     }

//     return filtered.sort((a, b) => {
//       let valueA = a[sortRequest.field];
//       let valueB = b[sortRequest.field];

//       if (sortRequest.field === "price") {
//         valueA = valueA || 0;
//         valueB = valueB || 0;
//         return sortRequest.order === "asc" ? valueA - valueB : valueB - valueA;
//       }

//       valueA = valueA ? String(valueA).toLowerCase() : "";
//       valueB = valueB ? String(valueB).toLowerCase() : "";
//       return sortRequest.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredRequests = filterAndSortRequests(requests, searchRequest);

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
//         console.log("This request already has an associated contract!");
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
//       console.log("Request ID is required to create a contract!");
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
//         setRequests((prev) =>
//           prev.map((req) =>
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
//       console.log(
//         "Failed to create contract: " +
//           (error.response?.data?.message || error.message)
//       );
//       console.error("Error creating contract:", error);
//     }
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

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ width: "100%" }}>
//         <LinearProgress />
//       </Box>
//     );
//   }

//   return (
//     <div className="manage-general">
//       <h2 className="manage-general-title">
//         Hire Cosplayer Requests & Contracts
//       </h2>
//       <Box sx={{ width: "100%" }}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             aria-label="manage tabs"
//             style={{ marginLeft: "20vh" }}
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
//                   <Form.Control
//                     type="text"
//                     placeholder="Search requests..."
//                     value={searchRequest}
//                     onChange={(e) => setSearchRequest(e.target.value)}
//                     className="search-input"
//                   />
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
//                             <ViewManageRentCosplayer
//                               requestId={req.id}
//                               style={{ marginRight: "8px" }}
//                             />
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
//                   <Form.Control
//                     type="text"
//                     placeholder="Search ..."
//                     value={searchContract}
//                     onChange={(e) => setSearchContract(e.target.value)}
//                     className="search-input"
//                   />
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
//                       <th className="text-center">Contract Owner</th>
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
//                             {con.createBy || "N/A"}
//                           </td>
//                           <td className="text-center">
//                             {con.price ? con.price.toLocaleString() : "N/A"}
//                           </td>
//                           <td className="text-center">{con.status || "N/A"}</td>
//                           <td className="text-center">{con.createDate}</td>
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
//                             <ViewManageRentCosplayer
//                               requestId={con.requestId}
//                               style={{ marginRight: "8px" }}
//                               disabled={!con.contractId}
//                             />
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

// chuyển tab gọi api

// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Table,
//   Form,
//   Card,
//   Modal as BootstrapModal,
//   Badge,
// } from "react-bootstrap";
// import { Button, Dropdown, Menu, Pagination } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
// import "../../../styles/Manager/ManageContract.scss";
// import dayjs from "dayjs";
// import ViewManageRentCosplayer from "../ManageRequestPage/ViewManageRentCosplayer.js";
// import { withWarn } from "antd/es/modal/confirm.js";

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
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isRequestBased, setIsRequestBased] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [formData, setFormData] = useState({
//     customerName: "",
//     deposit: "",
//     requestId: "",
//   });
//   const [searchContract, setSearchContract] = useState("");
//   const [searchRequest, setSearchRequest] = useState("");
//   const [sortContract, setSortContract] = useState({
//     field: "",
//     order: "",
//   });
//   const [sortRequest, setSortRequest] = useState({
//     field: "",
//     order: "",
//   });
//   const [currentPageContract, setCurrentPageContract] = useState(1);
//   const [currentPageRequest, setCurrentPageRequest] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 15, 30];
//   const [lastFetchTime, setLastFetchTime] = useState(0);
//   const minInterval = 5000; // 5-second throttle

//   const formatDate = (date) =>
//     date && dayjs(date).isValid() ? dayjs(date).format("DD/MM/YYYY") : "N/A";

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
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Deposited":
//         return "warning"; // #ffc107
//       case "Feedbacked":
//         return "info"; // #17a2b8
//       case "Completed":
//         return "success"; // #28a745
//       case "Cancel":
//         return "danger"; // #dc3545
//       case "Created":
//         return "warning-orange"; // #fd7e14
//       default:
//         return "success";
//     }
//   };

//   const fetchData = async () => {
//     const currentTime = Date.now();
//     if (currentTime - lastFetchTime < minInterval) {
//       console.log("⏳ Skipping API call due to throttling");
//       return;
//     }

//     let isMounted = true;
//     try {
//       setLoading(true);

//       // Fetch contracts
//       try {
//         const contractData = await ManageContractService.getAllContracts();
//         const validContracts = await Promise.all(
//           contractData.map(async (con) => {
//             if (!con.contractId || !con.requestId) return null;
//             try {
//               const request = await ManageContractService.getRequestByRequestId(
//                 con.requestId
//               );
//               if (request?.serviceId === "S002") {
//                 return {
//                   ...con,
//                   contractName: con.contractName || "N/A",
//                   price: con.price || 0,
//                   status: con.status || "N/A",
//                   createDate: con.createDate || "N/A",
//                   startDate: con.startDate || "N/A",
//                   endDate: con.endDate || "N/A",
//                   requestId: con.requestId || "",
//                   createBy: con.createBy || "N/A",
//                 };
//               }
//               return null;
//             } catch (error) {
//               console.warn(
//                 `Failed to fetch request for contract ${con.contractId}:`,
//                 error
//               );
//               return null;
//             }
//           })
//         );

//         const filteredContracts = validContracts.filter((con) => con !== null);
//         if (isMounted) {
//           setContracts(filteredContracts);
//           if (filteredContracts.length === 0) {
//             console.log("No valid contracts found for Hire Cosplayer.");
//           }
//         }
//       } catch (contractError) {
//         console.error("Failed to fetch contracts:", contractError);
//         toast.error(
//           contractError.response?.data?.message || "Failed to fetch contracts"
//         );
//       }

//       // Fetch requests
//       try {
//         const requestData = await ManageContractService.getAllRequests();
//         const formattedData = requestData
//           .filter(
//             (req) =>
//               ["browsed", "approved"].includes(req.status?.toLowerCase()) &&
//               req.serviceId === "S002"
//           )
//           .map((req) => {
//             let startDate = req.startDate || "N/A";
//             let endDate = req.endDate || "N/A";
//             if (
//               req.charactersListResponse?.length > 0 &&
//               req.charactersListResponse[0]?.requestDateResponses?.length > 0
//             ) {
//               const dateResponse =
//                 req.charactersListResponse[0].requestDateResponses[0];
//               startDate = dateResponse.startDate;
//               endDate = dateResponse.endDate;
//             }
//             return {
//               id: req.requestId,
//               serviceId: "S002",
//               name: req.name || "N/A",
//               description: req.description || "N/A",
//               location: req.location || "N/A",
//               price: req.price || 0,
//               deposit: req.deposit || 0,
//               statusRequest: mapStatus(req.status),
//               startDate,
//               endDate,
//               reason: req.reason || "",
//               contractId: req.contractId || null,
//               charactersListResponse: req.charactersListResponse || [],
//             };
//           });
//         if (isMounted) {
//           setRequests(formattedData);
//           if (formattedData.length === 0) {
//             console.log(
//               "No requests with status Browsed or Approved found for Hire Cosplayer."
//             );
//           } else {
//             console.log(
//               `Fetched ${formattedData.length} requests for Hire Cosplayer.`
//             );
//           }
//         }
//       } catch (requestError) {
//         console.error("Failed to fetch requests:", requestError);
//         toast.error(
//           requestError.response?.data?.message || "Failed to fetch requests"
//         );
//       }
//     } catch (error) {
//       if (isMounted) {
//         console.error("Unexpected error:", error);
//         toast.error("Unexpected error occurred");
//       }
//     } finally {
//       if (isMounted) {
//         setLoading(false);
//         setLastFetchTime(currentTime);
//       }
//     }

//     return () => {
//       isMounted = false;
//     };
//   };

//   useEffect(() => {
//     // Initial data fetch
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         console.log("🔄 Browser tab active, fetching data...");
//         fetchData();
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []); // Empty dependency array to set up listener once

//   const paginateData = (data, page, perPage = rowsPerPage) => {
//     const startIndex = (page - 1) * perPage;
//     const endIndex = startIndex + perPage;
//     return data.slice(startIndex, endIndex);
//   };

//   const filterAndSortContracts = (data, search) => {
//     let filtered = [...data];

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

//     if (sortContract.field) {
//       filtered.sort((a, b) => {
//         let valueA = a[sortContract.field] || "";
//         let valueB = b[sortContract.field] || "";

//         if (sortContract.field === "price") {
//           valueA = valueA || 0;
//           valueB = valueB || 0;
//           return sortContract.order === "asc"
//             ? valueA - valueB
//             : valueB - valueA;
//         }

//         valueA = valueA ? String(valueA).toLowerCase() : "";
//         valueB = valueB ? String(valueB).toLowerCase() : "";
//         return sortContract.order === "asc"
//           ? valueA.localeCompare(valueB)
//           : valueB.localeCompare(valueA);
//       });
//     }

//     return filtered;
//   };

//   const filterAndSortRequests = (data, search) => {
//     let filtered = [...data];

//     const contractRequestIds = contracts.map((con) => con.requestId);
//     filtered = filtered.filter((req) => !contractRequestIds.includes(req.id));

//     if (search) {
//       filtered = filtered.filter((item) =>
//         Object.values(item).some((val) =>
//           String(val).toLowerCase().includes(search.toLowerCase())
//         )
//       );
//     }

//     if (sortRequest.field) {
//       filtered.sort((a, b) => {
//         let valueA = a[sortRequest.field] || "";
//         let valueB = b[sortRequest.field] || "";

//         if (sortRequest.field === "price") {
//           valueA = valueA || 0;
//           valueB = valueB || 0;
//           return sortRequest.order === "asc"
//             ? valueA - valueB
//             : valueB - valueA;
//         }

//         valueA = valueA ? String(valueA).toLowerCase() : "";
//         valueB = valueB ? String(valueB).toLowerCase() : "";
//         return sortRequest.order === "asc"
//           ? valueA.localeCompare(valueB)
//           : valueB.localeCompare(valueA);
//       });
//     }

//     return filtered;
//   };

//   const filteredContracts = filterAndSortContracts(contracts, searchContract);
//   const filteredRequests = filterAndSortRequests(requests, searchRequest);

//   const totalPagesContract = useMemo(() => {
//     return Math.ceil(filteredContracts.length / rowsPerPage);
//   }, [filteredContracts.length, rowsPerPage]);

//   const totalPagesRequest = useMemo(() => {
//     return Math.ceil(filteredRequests.length / rowsPerPage);
//   }, [filteredRequests.length, rowsPerPage]);

//   const paginatedContracts = paginateData(
//     filteredContracts,
//     currentPageContract
//   );
//   const paginatedRequests = paginateData(filteredRequests, currentPageRequest);
//   const totalEntries = filteredRequests.length;

//   useEffect(() => {
//     if (currentPageContract > totalPagesContract && totalPagesContract > 0) {
//       setCurrentPageContract(1);
//     }
//   }, [totalPagesContract, currentPageContract]);

//   useEffect(() => {
//     if (currentPageRequest > totalPagesRequest && totalPagesRequest > 0) {
//       setCurrentPageRequest(1);
//     }
//   }, [totalPagesRequest, currentPageRequest]);

//   const handleShowModal = (item = null, request = null) => {
//     if (request && request.contractId) {
//       toast.error("This request already has an associated contract!");
//       return;
//     }
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
//       toast.error("Request ID is required!");
//       return;
//     }
//     const depositValue = parseFloat(formData.deposit.replace("%", ""));
//     if (isNaN(depositValue) || depositValue < 0) {
//       toast.error("Invalid deposit value!");
//       return;
//     }

//     try {
//       const newContract = await ManageContractService.createContract(
//         formData.requestId,
//         depositValue
//       );
//       setContracts((prev) => [...prev, newContract]);
//       setRequests((prev) =>
//         prev.filter((req) => req.id !== newContract.requestId)
//       );
//       toast.success("Contract created successfully!");
//       handleCloseModal();
//       setTimeout(() => {
//         window.location.reload();
//       }, 500);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to create contract");
//       console.error("Error creating contract:", error);
//     }
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

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ width: "100%" }}>
//         <LinearProgress />
//       </Box>
//     );
//   }

//   return (
//     <div className="manage-general">
//       <h2 className="manage-general-title">
//         Hire Cosplayer Requests & Contracts
//       </h2>
//       <Box sx={{ width: "100%" }}>
//         <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <Tabs
//             value={tabValue}
//             onChange={handleTabChange}
//             aria-label="manage tabs"
//             style={{ marginLeft: "20vh" }}
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
//                   <Form.Control
//                     type="text"
//                     placeholder="Search requests..."
//                     value={searchRequest}
//                     onChange={(e) => setSearchRequest(e.target.value)}
//                     className="search-input"
//                   />
//                 </div>
//                 <Table striped bordered hover responsive>
//                   <thead
//                     style={{
//                       background: " linear-gradient(135deg, #510545, #22668a",
//                       fontWeight: "bold",
//                       color: "white",
//                     }}
//                   >
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
//                             <Badge
//                               bg={getStatusColor(req.price)}
//                               className="highlight-field"
//                             >
//                               {req.price ? req.price.toLocaleString() : "N/A"}
//                             </Badge>
//                           </td>
//                           <td>
//                             <Badge
//                               bg={getStatusColor(req.statusRequest)}
//                               className="highlight-field"
//                             >
//                               {req.statusRequest || "N/A"}
//                             </Badge>
//                           </td>
//                           <td>{formatDate(req.startDate)}</td>
//                           <td>{formatDate(req.endDate)}</td>
//                           <td>{req.reason}</td>
//                           <td>
//                             <ViewManageRentCosplayer
//                               requestId={req.id}
//                               style={{ marginRight: "8px" }}
//                             />
//                             <Button
//                               type="primary"
//                               onClick={() => handleShowModal(null, req)}
//                             >
//                               + Contract
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
//                   <Form.Control
//                     type="text"
//                     placeholder="Search ..."
//                     value={searchContract}
//                     onChange={(e) => setSearchContract(e.target.value)}
//                     className="search-input"
//                   />
//                 </div>
//                 <Table striped bordered hover responsive>
//                   <thead
//                     style={{
//                       background: " linear-gradient(135deg, #510545, #22668a",
//                       fontWeight: "bold",
//                       color: "white",
//                     }}
//                   >
//                     <tr>
//                       <th className="text-center">
//                         <span
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
//                       <th className="text-center">Contract Owner</th>
//                       <th className="text-center">Price</th>
//                       <th className="text-center">
//                         <span onClick={() => handleSortContract("status")}>
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
//                             {con.createBy || "N/A"}
//                           </td>
//                           <td className="text-center">
//                             <Badge
//                               bg={getStatusColor(con.price)}
//                               className="highlight-field"
//                             >
//                               {con.price ? con.price.toLocaleString() : "N/A"}
//                             </Badge>
//                           </td>
//                           <td className="text-center">
//                             <Badge
//                               bg={getStatusColor(con.status)}
//                               className="highlight-field"
//                             >
//                               {con.status || "N/A"}
//                             </Badge>
//                           </td>
//                           <td className="text-center">{con.createDate}</td>
//                           <td className="text-center">
//                             {formatDate(con.startDate)}
//                           </td>
//                           <td className="text-center">
//                             {formatDate(con.endDate)}
//                           </td>
//                           <td className="text-center">
//                             <ViewManageRentCosplayer
//                               requestId={con.requestId}
//                               style={{ marginRight: "8px" }}
//                               disabled={!con.contractId}
//                             />
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

// fix loi date time
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Form,
  Card,
  Modal as BootstrapModal,
  Badge,
} from "react-bootstrap";
import { Button, Dropdown, Menu, Pagination } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
import "../../../styles/Manager/ManageContract.scss";
import dayjs from "dayjs";
import ViewManageRentCosplayer from "../ManageRequestPage/ViewManageRentCosplayer.js";

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
  const [searchContract, setSearchContract] = useState("");
  const [searchRequest, setSearchRequest] = useState("");
  const [sortContract, setSortContract] = useState({
    field: "",
    order: "",
  });
  const [sortRequest, setSortRequest] = useState({
    field: "",
    order: "",
  });
  const [currentPageContract, setCurrentPageContract] = useState(1);
  const [currentPageRequest, setCurrentPageRequest] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 15, 30];
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const minInterval = 5000; // 5-second throttle

  const formatDate = (date) => {
    if (
      !date ||
      date === "N/A" ||
      !dayjs(
        date,
        [
          "HH:mm DD/MM/YYYY",
          "DD/MM/YYYY",
          "YYYY-MM-DD",
          "YYYY-MM-DDTHH:mm:ss.SSSZ",
        ],
        true
      ).isValid()
    ) {
      return "N/A";
    }
    const parsedDate = dayjs(date, [
      "HH:mm DD/MM/YYYY",
      "DD/MM/YYYY",
      "YYYY-MM-DD",
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
    ]);
    if (parsedDate.hour() === 0 && parsedDate.minute() === 0) {
      return parsedDate.format("DD/MM/YYYY");
    }
    return parsedDate.format("HH:mm DD/MM/YYYY");
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Deposited":
        return "warning"; // #ffc107
      case "Feedbacked":
        return "info"; // #17a2b8
      case "Completed":
        return "success"; // #28a745
      case "Cancel":
        return "danger"; // #dc3545
      case "Created":
        return "warning-orange"; // #fd7e14
      default:
        return "success";
    }
  };

  const fetchData = async () => {
    const currentTime = Date.now();
    if (currentTime - lastFetchTime < minInterval) {
      console.log("⏳ Skipping API call due to throttling");
      return;
    }

    let isMounted = true;
    try {
      setLoading(true);

      // Fetch contracts
      try {
        const contractData = await ManageContractService.getAllContracts();
        const validContracts = await Promise.all(
          contractData.map(async (con) => {
            if (!con.contractId || !con.requestId) return null;
            try {
              const request = await ManageContractService.getRequestByRequestId(
                con.requestId
              );
              if (request?.serviceId === "S002") {
                return {
                  ...con,
                  contractName: con.contractName ?? "N/A",
                  price: con.price ?? 0,
                  status: con.status ?? "N/A",
                  createDate: formatDate(con.createDate) ?? "N/A",
                  startDate: formatDate(con.startDate) ?? "N/A",
                  endDate: formatDate(con.endDate) ?? "N/A",
                  requestId: con.requestId ?? "",
                  createBy: con.createBy ?? "N/A",
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

        const filteredContracts = validContracts.filter((con) => con !== null);
        if (isMounted) {
          setContracts(filteredContracts);
          if (filteredContracts.length === 0) {
            console.log("No valid contracts found for Hire Cosplayer.");
          }
        }
      } catch (contractError) {
        console.error("Failed to fetch contracts:", contractError);
        toast.error(
          contractError.response?.data?.message || "Failed to fetch contracts"
        );
      }

      // Fetch requests
      try {
        const requestData = await ManageContractService.getAllRequests();
        const formattedData = requestData
          .filter(
            (req) =>
              ["browsed", "approved"].includes(req.status?.toLowerCase()) &&
              req.serviceId === "S002"
          )
          .map((req) => {
            let startDate = formatDate(req.startDate) ?? "N/A";
            let endDate = formatDate(req.endDate) ?? "N/A";

            return {
              id: req.requestId,
              serviceId: "S002",
              name: req.name ?? "N/A",
              description: req.description ?? "N/A",
              location: req.location ?? "N/A",
              price: req.price ?? 0,
              deposit: req.deposit ?? 0,
              statusRequest: mapStatus(req.status),
              startDate,
              endDate,
              reason: req.reason ?? "",
              contractId: req.contractId ?? null,
              charactersListResponse: req.charactersListResponse ?? [],
            };
          });
        if (isMounted) {
          setRequests(formattedData);
          if (formattedData.length === 0) {
            console.log(
              "No requests with status Browsed or Approved found for Hire Cosplayer."
            );
          } else {
            console.log(
              `Fetched ${formattedData.length} requests for Hire Cosplayer.`
            );
          }
        }
      } catch (requestError) {
        console.error("Failed to fetch requests:", requestError);
        toast.error(
          requestError.response?.data?.message || "Failed to fetch requests"
        );
      }
    } catch (error) {
      if (isMounted) {
        console.error("Unexpected error:", error);
        toast.error("Unexpected error occurred");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
        setLastFetchTime(currentTime);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("🔄 Browser tab active, fetching data...");
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const paginateData = (data, page, perPage = rowsPerPage) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
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

    if (sortContract.field) {
      filtered.sort((a, b) => {
        let valueA = a[sortContract.field] ?? "";
        let valueB = b[sortContract.field] ?? "";

        if (sortContract.field === "price") {
          valueA = valueA || 0;
          valueB = valueB || 0;
          return sortContract.order === "asc"
            ? valueA - valueB
            : valueB - valueA;
        }

        valueA = valueA ? String(valueA).toLowerCase() : "";
        valueB = valueB ? String(valueB).toLowerCase() : "";
        return sortContract.order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    return filtered;
  };

  const filterAndSortRequests = (data, search) => {
    let filtered = [...data];

    const contractRequestIds = contracts.map((con) => con.requestId);
    filtered = filtered.filter((req) => !contractRequestIds.includes(req.id));

    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (sortRequest.field) {
      filtered.sort((a, b) => {
        let valueA = a[sortRequest.field] ?? "";
        let valueB = b[sortRequest.field] ?? "";

        if (sortRequest.field === "price") {
          valueA = valueA || 0;
          valueB = valueB || 0;
          return sortRequest.order === "asc"
            ? valueA - valueB
            : valueB - valueA;
        }

        valueA = valueA ? String(valueA).toLowerCase() : "";
        valueB = valueB ? String(valueB).toLowerCase() : "";
        return sortContract.order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      });
    }

    return filtered;
  };

  const filteredContracts = filterAndSortContracts(contracts, searchContract);
  const filteredRequests = filterAndSortRequests(requests, searchRequest);

  const totalPagesContract = useMemo(() => {
    return Math.ceil(filteredContracts.length / rowsPerPage);
  }, [filteredContracts.length, rowsPerPage]);

  const totalPagesRequest = useMemo(() => {
    return Math.ceil(filteredRequests.length / rowsPerPage);
  }, [filteredRequests.length, rowsPerPage]);

  const paginatedContracts = paginateData(
    filteredContracts,
    currentPageContract
  );
  const paginatedRequests = paginateData(filteredRequests, currentPageRequest);
  const totalEntries = filteredRequests.length;

  useEffect(() => {
    if (currentPageContract > totalPagesContract && totalPagesContract > 0) {
      setCurrentPageContract(1);
    }
  }, [totalPagesContract, currentPageContract]);

  useEffect(() => {
    if (currentPageRequest > totalPagesRequest && totalPagesRequest > 0) {
      setCurrentPageRequest(1);
    }
  }, [totalPagesRequest, currentPageRequest]);

  const handleShowModal = (item = null, request = null) => {
    if (request && request.contractId) {
      toast.error("This request already has an associated contract!");
      return;
    }
    if (item) {
      setIsEditing(true);
      setIsRequestBased(false);
      setCurrentItem(item);
      setFormData({
        customerName: item.customerName ?? "N/A",
        deposit: item.deposit ?? "0",
        requestId: item.requestId ?? "",
      });
    } else if (request) {
      setIsEditing(false);
      setIsRequestBased(true);
      setCurrentItem(request);
      setFormData({
        customerName: request.name ?? "N/A",
        deposit: request.deposit ? `${request.deposit}%` : "0%",
        requestId: request.id ?? "",
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
      toast.error("Request ID is required!");
      return;
    }
    const depositValue = parseFloat(formData.deposit.replace("%", ""));
    if (isNaN(depositValue) || depositValue < 0) {
      toast.error("Invalid deposit value!");
      return;
    }

    try {
      const newContract = await ManageContractService.createContract(
        formData.requestId,
        depositValue
      );
      setContracts((prev) => [
        ...prev,
        {
          ...newContract,
          contractName: newContract.contractName ?? "N/A",
          price: newContract.price ?? 0,
          status: newContract.status ?? "N/A",
          createDate: formatDate(newContract.createDate) ?? "N/A",
          startDate: formatDate(newContract.startDate) ?? "N/A",
          endDate: formatDate(newContract.endDate) ?? "N/A",
          requestId: newContract.requestId ?? "",
          createBy: newContract.createBy ?? "N/A",
        },
      ]);
      setRequests((prev) =>
        prev.filter((req) => req.id !== newContract.requestId)
      );
      toast.success("Contract created successfully!");
      handleCloseModal();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create contract");
      console.error("Error creating contract:", error);
    }
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
    <div className="manage-general">
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
                  <thead
                    style={{
                      background: " linear-gradient(135deg, #510545, #22668a",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
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
                            <Badge
                              bg={getStatusColor(req.price)}
                              className="highlight-field"
                            >
                              {req.price ? req.price.toLocaleString() : "N/A"}
                            </Badge>
                          </td>
                          <td>
                            <Badge
                              bg={getStatusColor(req.statusRequest)}
                              className="highlight-field"
                            >
                              {req.statusRequest || "N/A"}
                            </Badge>
                          </td>
                          <td>{req.startDate}</td>
                          <td>{req.endDate}</td>
                          <td>
                            <ViewManageRentCosplayer
                              requestId={req.id}
                              style={{ marginRight: "8px" }}
                            />
                            <Button
                              type="primary"
                              onClick={() => handleShowModal(null, req)}
                            >
                              + Contract
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center">
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
                  <thead
                    style={{
                      background: " linear-gradient(135deg, #510545, #22668a",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    <tr>
                      <th className="text-center">
                        <span
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
                      <th className="text-center">Contract Owner</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">
                        <span onClick={() => handleSortContract("status")}>
                          Status
                          {sortContract.field === "status" &&
                            (sortContract.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            ))}
                        </span>
                      </th>
                      <th className="text-center">
                        <span onClick={() => handleSortContract("createDate")}>
                          Contract Created Date
                          {sortContract.field === "createDate" &&
                            (sortContract.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            ))}
                        </span>
                      </th>
                      <th className="text-center">
                        <span onClick={() => handleSortContract("startDate")}>
                          Start Date
                          {sortContract.field === "startDate" &&
                            (sortContract.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            ))}
                        </span>
                      </th>
                      <th className="text-center">
                        <span onClick={() => handleSortContract("endDate")}>
                          End Date
                          {sortContract.field === "endDate" &&
                            (sortContract.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            ))}
                        </span>
                      </th>
                      <th className="text-center">Actions</th>
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
                            {con.createBy || "N/A"}
                          </td>
                          <td className="text-center">
                            <Badge
                              bg={getStatusColor(con.price)}
                              className="highlight-field"
                            >
                              {con.price ? con.price.toLocaleString() : "N/A"}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <Badge
                              bg={getStatusColor(con.status)}
                              className="highlight-field"
                            >
                              {con.status || "N/A"}
                            </Badge>
                          </td>
                          <td className="text-center">{con.createDate}</td>
                          <td className="text-center">{con.startDate}</td>
                          <td className="text-center">{con.endDate}</td>
                          <td className="text-center">
                            <ViewManageRentCosplayer
                              requestId={con.requestId}
                              style={{ marginRight: "8px" }}
                              disabled={!con.contractId}
                            />
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
                <strong> Name</strong>
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
