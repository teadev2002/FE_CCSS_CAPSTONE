// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Table,
//   Modal as BootstrapModal,
//   Form,
//   Card,
//   Pagination,
//   Dropdown,
// } from "react-bootstrap";
// import { Button, Popconfirm, Modal, Input, List, message, Select } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
// import "../../../styles/Manager/ManageContract.scss";

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

// const mockRequests = [
//   {
//     requestId: "38d236b6-3233-4df8-a46f-6e8aa64be6df",
//     accountId: "A003",
//     name: "Nammmmmmmm",
//     description: "qw",
//     price: 120000,
//     status: "Pending",
//     startDate: "2025-04-12T18:29:00",
//     endDate: "2025-04-16T08:00:00",
//     location: "q1",
//     serviceId: "S001",
//     packageId: null,
//     contractId: null,
//     charactersListResponse: [
//       {
//         characterId: "CH002",
//         cosplayerId: null,
//         description: "Naruto’s rival",
//         quantity: 1,
//         maxHeight: 185,
//         maxWeight: 85,
//         minHeight: 165,
//         minWeight: 55,
//         characterImages: [
//           {
//             characterImageId: "CI002",
//             urlImage: "https://example.com/img2.jpg",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     requestId: "a7b9c8d2-4567-4e5f-9a1b-2c3d4e5f6a7b",
//     accountId: "A004",
//     name: "Anime Event",
//     description: "Cosplay event for anime fans",
//     price: 200000,
//     status: "Approved",
//     startDate: "2025-05-01T10:00:00",
//     endDate: "2025-05-02T18:00:00",
//     location: "District 7",
//     serviceId: "S002",
//     packageId: null,
//     contractId: null,
//     charactersListResponse: [
//       {
//         characterId: "CH003",
//         cosplayerId: null,
//         description: "Dragon Ball protagonist",
//         quantity: 2,
//         maxHeight: 190,
//         maxWeight: 90,
//         minHeight: 170,
//         minWeight: 60,
//         characterImages: [
//           {
//             characterImageId: "CI003",
//             urlImage: "https://example.com/img3.jpg",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     requestId: "e9f0a1b2-6789-4c5d-8e2f-3a4b5c6d7e8f",
//     accountId: "A005",
//     name: "Comic Con",
//     description: "Large-scale cosplay convention",
//     price: 300000,
//     status: "Pending",
//     startDate: "2025-06-15T09:00:00",
//     endDate: "2025-06-16T17:00:00",
//     location: "District 1",
//     serviceId: "S003",
//     packageId: null,
//     contractId: null,
//     charactersListResponse: [
//       {
//         characterId: "CH004",
//         cosplayerId: null,
//         description: "One Piece captain",
//         quantity: 3,
//         maxHeight: 180,
//         maxWeight: 80,
//         minHeight: 160,
//         minWeight: 50,
//         characterImages: [
//           {
//             characterImageId: "CI004",
//             urlImage: "https://example.com/img4.jpg",
//           },
//         ],
//       },
//     ],
//   },
// ];

// const ManageContract = () => {
//   const [tabValue, setTabValue] = useState(0);
//   const [contracts, setContracts] = useState([]);
//   const [requests, setRequests] = useState(mockRequests);
//   const [loading, setLoading] = useState(true);
//   const [selectedContractType, setSelectedContractType] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [formData, setFormData] = useState({
//     contractName: "",
//     price: "",
//     status: "",
//     startDate: "",
//     endDate: "",
//   });
//   const [isViewModalVisible, setIsViewModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     name: "",
//     description: "",
//     startDate: "",
//     endDate: "",
//     location: "",
//     price: 0,
//     listRequestCharacters: [],
//   });
//   const [searchContract, setSearchContract] = useState("");
//   const [searchRequest, setSearchRequest] = useState("");
//   const [sortContract, setSortContract] = useState({
//     field: "status",
//     order: "asc",
//   });
//   const [sortRequest, setSortRequest] = useState({
//     field: "status",
//     order: "asc",
//   });
//   const [currentPageContract, setCurrentPageContract] = useState(1);
//   const [currentPageRequest, setCurrentPageRequest] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 15, 30];

//   useEffect(() => {
//     let isMounted = true;

//     const fetchContracts = async () => {
//       try {
//         setLoading(true);
//         const data = await ManageContractService.getAllContracts();
//         console.log("Fetched contracts:", data);
//         if (isMounted) {
//           setContracts(data);
//           setLoading(false);
//         }
//       } catch (error) {
//         if (isMounted) {
//           console.error("Failed to fetch contracts:", error);
//           toast.warn(
//             error.response?.data?.message || "Failed to fetch contracts"
//           );
//           setLoading(false);
//         }
//       }
//     };

//     fetchContracts();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   // Contracts Filtering and Sorting
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
//       const valueA = a[sort.field] ? a[sort.field].toLowerCase() : "";
//       const valueB = b[sort.field] ? b[sort.field].toLowerCase() : "";
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

//   // Requests Filtering and Sorting
//   const filterAndSortRequests = (data, search, sort) => {
//     let filtered = [...data];

//     if (search) {
//       filtered = filtered.filter((item) => {
//         const name = item.name ? item.name.toLowerCase() : "";
//         const status = item.status ? item.status.toLowerCase() : "";
//         return (
//           name.includes(search.toLowerCase()) ||
//           status.includes(search.toLowerCase())
//         );
//       });
//     }

//     return filtered.sort((a, b) => {
//       const valueA = a[sort.field] ? a[sort.field].toLowerCase() : "";
//       const valueB = b[sort.field] ? b[sort.field].toLowerCase() : "";
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

//   useEffect(() => {
//     if (currentPageRequest > totalPagesRequest && totalPagesRequest > 0) {
//       setCurrentPageRequest(1);
//     }
//   }, [totalPagesRequest, currentPageRequest]);

//   const paginatedRequests = paginateData(filteredRequests, currentPageRequest);

//   function paginateData(data, page) {
//     const startIndex = (page - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex);
//   }

//   // Contract Modal Handlers
//   const handleShowModal = (item = null) => {
//     if (item) {
//       setIsEditing(true);
//       setCurrentItem(item);
//       setFormData({
//         contractName: item.contractName || "",
//         price: item.price || "",
//         status: item.status || "",
//         startDate: item.startDate || "",
//         endDate: item.endDate || "",
//       });
//     } else {
//       setIsEditing(false);
//       setFormData({
//         contractName: selectedContractType || "",
//         price: "",
//         status: "",
//         startDate: "",
//         endDate: "",
//       });
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setIsEditing(false);
//     setCurrentItem(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (isEditing) {
//       const updatedContracts = contracts.map((con) =>
//         con.contractId === currentItem.contractId
//           ? { ...con, ...formData }
//           : con
//       );
//       setContracts(updatedContracts);
//       toast.success("Contract updated successfully!");
//     } else {
//       setContracts([
//         ...contracts,
//         { ...formData, contractId: Date.now().toString() },
//       ]);
//       toast.success("Contract added successfully!");
//     }
//     handleCloseModal();
//   };

//   const handleDeleteContract = (contractId) => {
//     setContracts(contracts.filter((con) => con.contractId !== contractId));
//     toast.success("Contract deleted successfully!");
//   };

//   const handleViewDetail = async (contract) => {
//     if (contract.contractName === "Cosplay Rental") {
//       try {
//         const requestData = await ManageContractService.getRequestByRequestId(
//           contract.requestId
//         );
//         setModalData({
//           name: requestData.name || contract.contractName,
//           description: requestData.description || "",
//           startDate: contract.startDate,
//           endDate: contract.endDate,
//           location: requestData.location || "N/A",
//           price: contract.price || 0,
//           listRequestCharacters: contract.contractCharacters || [],
//         });
//         setIsViewModalVisible(true);
//       } catch (error) {
//         console.error("Failed to fetch contract details:", error);
//         message.warn(
//           error.response?.data?.message || "Failed to fetch contract details"
//         );
//       }
//     }
//   };

//   const handleModalConfirm = () => {
//     setIsViewModalVisible(false);
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

//         {/* Requests Tab */}
//         <CustomTabPanel value={tabValue} index={0}>
//           <div className="table-container">
//             <Card className="status-table-card">
//               <Card.Body>
//                 <div className="table-header">
//                   <h3>Approved Requests</h3>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "10px",
//                     }}
//                   >
//                     <Form.Control
//                       type="text"
//                       placeholder="Search ..."
//                       value={searchRequest}
//                       onChange={(e) => setSearchRequest(e.target.value)}
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
//                           onClick={() => handleSortRequest("name")}
//                         >
//                           Name
//                           {sortRequest.field === "name" &&
//                             (sortRequest.order === "asc" ? (
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
//                           onClick={() => handleSortRequest("status")}
//                         >
//                           Status
//                           {sortRequest.field === "status" &&
//                             (sortRequest.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             ))}
//                         </span>
//                       </th>
//                       <th className="text-center">Start Date</th>
//                       <th className="text-center">End Date</th>
//                       <th className="text-center">Location</th>
//                       <th className="text-center">Characters</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedRequests.length === 0 ? (
//                       <tr>
//                         <td colSpan="7" className="text-center">
//                           No requests found
//                         </td>
//                       </tr>
//                     ) : (
//                       paginatedRequests.map((req) => (
//                         <tr key={req.requestId}>
//                           <td className="text-center">{req.name || "N/A"}</td>
//                           <td className="text-center">
//                             {req.price ? req.price.toLocaleString() : "N/A"}
//                           </td>
//                           <td className="text-center">{req.status || "N/A"}</td>
//                           <td className="text-center">
//                             {req.startDate || "N/A"}
//                           </td>
//                           <td className="text-center">
//                             {req.endDate || "N/A"}
//                           </td>
//                           <td className="text-center">
//                             {req.location || "N/A"}
//                           </td>
//                           <td className="text-center">
//                             {req.charactersListResponse?.length > 0
//                               ? req.charactersListResponse
//                                   .map((char) => char.description || "N/A")
//                                   .join(", ")
//                               : "N/A"}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </Table>
//                 <PaginationControls
//                   currentPage={currentPageRequest}
//                   totalPages={totalPagesRequest}
//                   totalEntries={filteredRequests.length}
//                   rowsPerPage={rowsPerPage}
//                   onPageChange={handlePageChangeRequest}
//                   onRowsPerPageChange={handleRowsPerPageChange}
//                   rowsPerPageOptions={rowsPerPageOptions}
//                 />
//               </Card.Body>
//             </Card>
//           </div>
//         </CustomTabPanel>

//         {/* Contracts Tab */}
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
//                       <th className="text-center">Start Date</th>
//                       <th className="text-center">End Date</th>
//                       <th className="text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedContracts.length === 0 ? (
//                       <tr>
//                         <td colSpan="6" className="text-center">
//                           No contracts found
//                         </td>
//                       </tr>
//                     ) : (
//                       paginatedContracts.map((con) => (
//                         <tr key={con.contractId}>
//                           <td className="text-center">
//                             {con.contractName || "N/A"}
//                           </td>
//                           <td className="text-center">
//                             {con.price ? con.price.toLocaleString() : "N/A"}
//                           </td>
//                           <td className="text-center">{con.status || "N/A"}</td>
//                           <td className="text-center">
//                             {con.startDate || "N/A"}
//                           </td>
//                           <td className="text-center">
//                             {con.endDate || "N/A"}
//                           </td>
//                           <td className="text-center">
//                             {con.contractName === "Cosplay Rental" && (
//                               <Button
//                                 type="default"
//                                 size="small"
//                                 onClick={() => handleViewDetail(con)}
//                                 style={{ marginRight: "8px" }}
//                               >
//                                 View Detail
//                               </Button>
//                             )}
//                             <Popconfirm
//                               title="Are you sure to delete this contract?"
//                               onConfirm={() =>
//                                 handleDeleteContract(con.contractId)
//                               }
//                               okText="Yes"
//                               cancelText="No"
//                             >
//                               <Button type="primary" danger size="small">
//                                 Delete
//                               </Button>
//                             </Popconfirm>
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

//       {/* Contract Edit/Add Modal */}
//       <BootstrapModal show={showModal} onHide={handleCloseModal} centered>
//         <BootstrapModal.Header closeButton>
//           <BootstrapModal.Title>
//             {isEditing ? "Edit Contract" : "Add Contract"}
//           </BootstrapModal.Title>
//         </BootstrapModal.Header>
//         <BootstrapModal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-2">
//               <Form.Label>Contract Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="contractName"
//                 value={formData.contractName}
//                 onChange={handleInputChange}
//                 required
//                 disabled
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Price</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Status</Form.Label>
//               <Form.Select
//                 name="status"
//                 value={formData.status}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Select Status</option>
//                 <option value="Draft">Draft</option>
//                 <option value="Signed">Signed</option>
//                 <option value="Expired">Expired</option>
//                 <option value="Completed">Completed</option>
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>Start Date</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="startDate"
//                 value={formData.startDate}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-2">
//               <Form.Label>End Date</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="endDate"
//                 value={formData.endDate}
//                 onChange={handleInputChange}
//                 required
//               />
//             </Form.Group>
//           </Form>
//         </BootstrapModal.Body>
//         <BootstrapModal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSubmit}>
//             {isEditing ? "Update" : "Add"}
//           </Button>
//         </BootstrapModal.Footer>
//       </BootstrapModal>

//       {/* Contract Detail Modal */}
//       <Modal
//         title="View Detail Contract"
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
//         <p>
//           <strong>Name:</strong>
//         </p>
//         <Input
//           value={modalData.name}
//           onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
//           placeholder="Your account name"
//           style={{ width: "250px" }}
//         />
//         <p>
//           <strong>Description:</strong>
//         </p>
//         <TextArea
//           value={modalData.description}
//           onChange={(e) =>
//             setModalData({ ...modalData, description: e.target.value })
//           }
//           placeholder="Enter description"
//           style={{ width: "300px" }}
//         />
//         <p>
//           <strong>Start DateTime:</strong> {modalData.startDate || "N/A"}
//         </p>
//         <p>
//           <strong>End DateTime:</strong> {modalData.endDate || "N/A"}
//         </p>
//         <p>
//           <strong>Location:</strong> {modalData.location || "N/A"}
//         </p>
//         <p>
//           <strong>Coupon ID:</strong> {"N/A"}
//         </p>
//         <h4>List of Requested Characters:</h4>
//         <List
//           dataSource={modalData.listRequestCharacters}
//           renderItem={(item, index) => (
//             <List.Item key={index}>
//               <p>
//                 {item.cosplayerName || "N/A"} - {item.characterName || "N/A"} -
//                 Quantity: {item.quantity || 0} - Price:{" "}
//                 {item.price ? item.price.toLocaleString() : 0} VND
//               </p>
//             </List.Item>
//           )}
//         />
//         <p>
//           <strong>Total Price:</strong>{" "}
//           {modalData.price ? modalData.price.toLocaleString() : 0} VND
//         </p>
//       </Modal>
//     </div>
//   );
// };

// const PaginationControls = ({
//   currentPage,
//   totalPages,
//   totalEntries,
//   onPageChange,
//   rowsPerPage,
//   onRowsPerPageChange,
//   rowsPerPageOptions,
// }) => {
//   const startEntry = (currentPage - 1) * rowsPerPage + 1;
//   const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
//   const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

//   return (
//     <div className="pagination-controls">
//       <div className="pagination-info">
//         <span className="showing-entries">{showingText}</span>
//         <div className="rows-per-page" style={{ marginLeft: "20px" }}>
//           <span>Rows per page: </span>
//           <Dropdown onSelect={(value) => onRowsPerPageChange(Number(value))}>
//             <Dropdown.Toggle variant="secondary" id="dropdown-rows-per-page">
//               {rowsPerPage}
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               {rowsPerPageOptions.map((option) => (
//                 <Dropdown.Item key={option} eventKey={option}>
//                   {option}
//                 </Dropdown.Item>
//               ))}
//             </Dropdown.Menu>
//           </Dropdown>
//         </div>
//       </div>
//       <Pagination>
//         <Pagination.First
//           onClick={() => onPageChange(1)}
//           disabled={currentPage === 1}
//         />
//         <Pagination.Prev
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         />
//         {[...Array(totalPages).keys()].map((page) => (
//           <Pagination.Item
//             key={page + 1}
//             active={page + 1 === currentPage}
//             onClick={() => onPageChange(page + 1)}
//           >
//             {page + 1}
//           </Pagination.Item>
//         ))}
//         <Pagination.Next
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         />
//         <Pagination.Last
//           onClick={() => onPageChange(totalPages)}
//           disabled={currentPage === totalPages}
//         />
//       </Pagination>
//     </div>
//   );
// };

// export default ManageContract;

//======================================================================request them tinh nang
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Modal as BootstrapModal,
  Form,
  Card,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { Button, Popconfirm, Modal, Input, List, message, Select } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
import "../../../styles/Manager/ManageContract.scss";

const { TextArea } = Input;
const { Option } = Select;

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

const mockRequests = [
  {
    requestId: "38d236b6-3233-4df8-a46f-6e8aa64be6df",
    accountId: "A003",
    name: "Nammmmmmmm",
    description: "qw",
    price: 120000,
    status: "Pending",
    startDate: "2025-04-12T18:29:00",
    endDate: "2025-04-16T08:00:00",
    location: "q1",
    serviceId: "S001",
    packageId: null,
    contractId: null,
    charactersListResponse: [
      {
        characterId: "CH002",
        cosplayerId: null,
        description: "Naruto’s rival",
        quantity: 1,
        maxHeight: 185,
        maxWeight: 85,
        minHeight: 165,
        minWeight: 55,
        characterImages: [
          {
            characterImageId: "CI002",
            urlImage: "https://example.com/img2.jpg",
          },
        ],
      },
    ],
  },
  {
    requestId: "a7b9c8d2-4567-4e5f-9a1b-2c3d4e5f6a7b",
    accountId: "A004",
    name: "Anime Event",
    description: "Cosplay event for anime fans",
    price: 200000,
    status: "Approved",
    startDate: "2025-05-01T10:00:00",
    endDate: "2025-05-02T18:00:00",
    location: "District 7",
    serviceId: "S002",
    packageId: null,
    contractId: null,
    charactersListResponse: [
      {
        characterId: "CH003",
        cosplayerId: null,
        description: "Dragon Ball protagonist",
        quantity: 2,
        maxHeight: 190,
        maxWeight: 90,
        minHeight: 170,
        minWeight: 60,
        characterImages: [
          {
            characterImageId: "CI003",
            urlImage: "https://example.com/img3.jpg",
          },
        ],
      },
    ],
  },
  {
    requestId: "e9f0a1b2-6789-4c5d-8e2f-3a4b5c6d7e8f",
    accountId: "A005",
    name: "Comic Con",
    description: "Large-scale cosplay convention",
    price: 300000,
    status: "Pending",
    startDate: "2025-06-15T09:00:00",
    endDate: "2025-06-16T17:00:00",
    location: "District 1",
    serviceId: "S003",
    packageId: null,
    contractId: null,
    charactersListResponse: [
      {
        characterId: "CH004",
        cosplayerId: null,
        description: "One Piece captain",
        quantity: 3,
        maxHeight: 180,
        maxWeight: 80,
        minHeight: 160,
        minWeight: 50,
        characterImages: [
          {
            characterImageId: "CI004",
            urlImage: "https://example.com/img4.jpg",
          },
        ],
      },
    ],
  },
];

const ManageContract = () => {
  const [tabValue, setTabValue] = useState(0);
  const [contracts, setContracts] = useState([]);
  const [requests, setRequests] = useState(mockRequests);
  const [loading, setLoading] = useState(true);
  const [selectedContractType, setSelectedContractType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRequestBased, setIsRequestBased] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    contractName: "",
    price: "",
    status: "",
    startDate: "",
    endDate: "",
    requestId: "",
  });
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isRequestViewModalVisible, setIsRequestViewModalVisible] =
    useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    price: 0,
    listRequestCharacters: [],
  });
  const [requestModalData, setRequestModalData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    price: 0,
    charactersListResponse: [],
  });
  const [searchContract, setSearchContract] = useState("");
  const [searchRequest, setSearchRequest] = useState("");
  const [sortContract, setSortContract] = useState({
    field: "status",
    order: "asc",
  });
  const [sortRequest, setSortRequest] = useState({
    field: "status",
    order: "asc",
  });
  const [currentPageContract, setCurrentPageContract] = useState(1);
  const [currentPageRequest, setCurrentPageRequest] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 15, 30];

  useEffect(() => {
    let isMounted = true;

    const fetchContracts = async () => {
      try {
        setLoading(true);
        const data = await ManageContractService.getAllContracts();
        console.log("Fetched contracts:", data);
        if (isMounted) {
          setContracts(data);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch contracts:", error);
          toast.warn(
            error.response?.data?.message || "Failed to fetch contracts"
          );
          setLoading(false);
        }
      }
    };

    fetchContracts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Contracts Filtering and Sorting
  const filterAndSortContracts = (data, search, sort) => {
    let filtered = [...data];

    if (selectedContractType) {
      filtered = filtered.filter(
        (item) =>
          item.contractName &&
          item.contractName.toLowerCase() === selectedContractType.toLowerCase()
      );
    }

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
      const valueA = a[sort.field] ? a[sort.field].toLowerCase() : "";
      const valueB = b[sort.field] ? b[sort.field].toLowerCase() : "";
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredContracts = filterAndSortContracts(
    contracts,
    searchContract,
    sortContract
  );

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

  // Requests Filtering and Sorting
  const filterAndSortRequests = (data, search, sort) => {
    let filtered = [...data];

    if (search) {
      filtered = filtered.filter((item) => {
        const name = item.name ? item.name.toLowerCase() : "";
        const status = item.status ? item.status.toLowerCase() : "";
        return (
          name.includes(search.toLowerCase()) ||
          status.includes(search.toLowerCase())
        );
      });
    }

    return filtered.sort((a, b) => {
      const valueA = a[sort.field] ? a[sort.field].toLowerCase() : "";
      const valueB = b[sort.field] ? b[sort.field].toLowerCase() : "";
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredRequests = filterAndSortRequests(
    requests,
    searchRequest,
    sortRequest
  );

  const totalPagesRequest = useMemo(() => {
    return Math.ceil(filteredRequests.length / rowsPerPage);
  }, [filteredRequests.length, rowsPerPage]);

  useEffect(() => {
    if (currentPageRequest > totalPagesRequest && totalPagesRequest > 0) {
      setCurrentPageRequest(1);
    }
  }, [totalPagesRequest, currentPageRequest]);

  const paginatedRequests = paginateData(filteredRequests, currentPageRequest);

  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  // Contract Modal Handlers
  const handleShowModal = (item = null, request = null) => {
    if (item) {
      // Editing an existing contract
      setIsEditing(true);
      setIsRequestBased(false);
      setCurrentItem(item);
      setFormData({
        contractName: item.contractName || "",
        price: item.price || "",
        status: item.status || "",
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        requestId: item.requestId || "",
      });
    } else if (request) {
      // Creating a contract from a request
      if (request.contractId) {
        toast.warn("This request already has an associated contract!");
        return;
      }
      setIsEditing(false);
      setIsRequestBased(true);
      setCurrentItem(request);
      setFormData({
        contractName: "",
        price: request.price || "",
        status: "Draft",
        startDate: request.startDate || "",
        endDate: request.endDate || "",
        requestId: request.requestId || "",
      });
    } else {
      // Creating a new contract (not request-based)
      setIsEditing(false);
      setIsRequestBased(false);
      setFormData({
        contractName: selectedContractType || "",
        price: "",
        status: "",
        startDate: "",
        endDate: "",
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
      contractName: "",
      price: "",
      status: "",
      startDate: "",
      endDate: "",
      requestId: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.contractName) {
      toast.warn("Contract Name is required!");
      return;
    }
    if (isEditing) {
      const updatedContracts = contracts.map((con) =>
        con.contractId === currentItem.contractId
          ? { ...con, ...formData }
          : con
      );
      setContracts(updatedContracts);
      toast.success("Contract updated successfully!");
    } else {
      const newContract = {
        ...formData,
        contractId: Date.now().toString(),
        contractCharacters: isRequestBased
          ? currentItem.charactersListResponse.map((char) => ({
              characterName: char.description,
              quantity: char.quantity,
              cosplayerName: char.cosplayerId || null,
            }))
          : [],
      };
      setContracts([...contracts, newContract]);
      if (isRequestBased) {
        setRequests(
          requests.map((req) =>
            req.requestId === currentItem.requestId
              ? { ...req, contractId: newContract.contractId }
              : req
          )
        );
      }
      toast.success("Contract added successfully!");
    }
    handleCloseModal();
  };

  const handleDeleteContract = (contractId) => {
    setContracts(contracts.filter((con) => con.contractId !== contractId));
    setRequests(
      requests.map((req) =>
        req.contractId === contractId ? { ...req, contractId: null } : req
      )
    );
    toast.success("Contract deleted successfully!");
  };

  // Contract View Detail
  const handleViewContractDetail = async (contract) => {
    if (contract.contractName === "Cosplay Rental") {
      try {
        const requestData = await ManageContractService.getRequestByRequestId(
          contract.requestId
        );
        setModalData({
          name: requestData.name || contract.contractName,
          description: requestData.description || "",
          startDate: contract.startDate,
          endDate: contract.endDate,
          location: requestData.location || "N/A",
          price: contract.price || 0,
          listRequestCharacters: contract.contractCharacters || [],
        });
        setIsViewModalVisible(true);
      } catch (error) {
        console.error("Failed to fetch contract details:", error);
        message.warn(
          error.response?.data?.message || "Failed to fetch contract details"
        );
      }
    }
  };

  // Request View Detail
  const handleViewRequestDetail = (request) => {
    setRequestModalData({
      name: request.name || "",
      description: request.description || "",
      startDate: request.startDate || "",
      endDate: request.endDate || "",
      location: request.location || "",
      price: request.price || 0,
      charactersListResponse: request.charactersListResponse || [],
    });
    setIsRequestViewModalVisible(true);
  };

  const handleRequestModalConfirm = () => {
    setIsRequestViewModalVisible(false);
    setRequestModalData({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      price: 0,
      charactersListResponse: [],
    });
  };

  const handleModalConfirm = () => {
    setIsViewModalVisible(false);
  };

  const handleEditInViewModal = () => {
    message.info("Edit functionality not implemented yet");
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
      <h2 className="manage-general-title">Browsed Requests & Contracts</h2>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="manage tabs"
            style={{
              marginLeft: "20vh",
            }}
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

        {/* Requests Tab */}
        <CustomTabPanel value={tabValue} index={0}>
          <div className="table-container">
            <Card className="status-table-card">
              <Card.Body>
                <div className="table-header">
                  <h3>Approved Requests</h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Form.Control
                      type="text"
                      placeholder="Search ..."
                      value={searchRequest}
                      onChange={(e) => setSearchRequest(e.target.value)}
                      className="search-input"
                    />
                  </div>
                </div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSortRequest("name")}
                        >
                          Name
                          {sortRequest.field === "name" &&
                            (sortRequest.order === "asc" ? (
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
                          onClick={() => handleSortRequest("status")}
                        >
                          Status
                          {sortRequest.field === "status" &&
                            (sortRequest.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            ))}
                        </span>
                      </th>
                      <th className="text-center">Start Date</th>
                      <th className="text-center">End Date</th>
                      <th className="text-center">Location</th>
                      <th className="text-center">Characters</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No requests found
                        </td>
                      </tr>
                    ) : (
                      paginatedRequests.map((req) => (
                        <tr key={req.requestId}>
                          <td className="text-center">{req.name || "N/A"}</td>
                          <td className="text-center">
                            {req.price ? req.price.toLocaleString() : "N/A"}
                          </td>
                          <td className="text-center">{req.status || "N/A"}</td>
                          <td className="text-center">
                            {req.startDate || "N/A"}
                          </td>
                          <td className="text-center">
                            {req.endDate || "N/A"}
                          </td>
                          <td className="text-center">
                            {req.location || "N/A"}
                          </td>
                          <td className="text-center">
                            {req.charactersListResponse?.length > 0
                              ? req.charactersListResponse
                                  .map((char) => char.description || "N/A")
                                  .join(", ")
                              : "N/A"}
                          </td>
                          <td className="text-center">
                            <Button
                              type="default"
                              size="small"
                              onClick={() => handleViewRequestDetail(req)}
                              style={{ marginRight: "8px" }}
                            >
                              View Detail
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleShowModal(null, req)}
                              style={{ marginRight: "8px" }}
                            >
                              Create Contract
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                <PaginationControls
                  currentPage={currentPageRequest}
                  totalPages={totalPagesRequest}
                  totalEntries={filteredRequests.length}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handlePageChangeRequest}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={rowsPerPageOptions}
                />
              </Card.Body>
            </Card>
          </div>
        </CustomTabPanel>

        {/* Contracts Tab */}
        <CustomTabPanel value={tabValue} index={1}>
          <div className="table-container">
            <Card className="status-table-card">
              <Card.Body>
                <div className="table-header">
                  <h3>Contracts</h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Select
                      value={selectedContractType}
                      onChange={(value) => setSelectedContractType(value)}
                      style={{ width: 200 }}
                    >
                      <Option value="">All</Option>
                      <Option value="Cosplay Rental">Cosplay Rental</Option>
                      <Option value="Character Rental">Character Rental</Option>
                      <Option value="Event Rental">Event Organization</Option>
                    </Select>
                    <Form.Control
                      type="text"
                      placeholder="Search ..."
                      value={searchContract}
                      onChange={(e) => setSearchContract(e.target.value)}
                      className="search-input"
                    />
                  </div>
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
                      <th className="text-center">Start Date</th>
                      <th className="text-center">End Date</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContracts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No contracts found
                        </td>
                      </tr>
                    ) : (
                      paginatedContracts.map((con) => (
                        <tr key={con.contractId}>
                          <td className="text-center">
                            {con.contractName || "N/A"}
                          </td>
                          <td className="text-center">
                            {con.price ? con.price.toLocaleString() : "N/A"}
                          </td>
                          <td className="text-center">{con.status || "N/A"}</td>
                          <td className="text-center">
                            {con.startDate || "N/A"}
                          </td>
                          <td className="text-center">
                            {con.endDate || "N/A"}
                          </td>
                          <td className="text-center">
                            {con.contractName === "Cosplay Rental" && (
                              <Button
                                type="default"
                                size="small"
                                onClick={() => handleViewContractDetail(con)}
                                style={{ marginRight: "8px" }}
                              >
                                View Detail
                              </Button>
                            )}
                            <Popconfirm
                              title="Are you sure to delete this contract?"
                              onConfirm={() =>
                                handleDeleteContract(con.contractId)
                              }
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="primary" danger size="small">
                                Delete
                              </Button>
                            </Popconfirm>
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

      {/* Contract Edit/Add Modal */}
      <BootstrapModal show={showModal} onHide={handleCloseModal} centered>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>
            {isEditing ? "Edit Contract" : "Add Contract"}
          </BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Contract Name</Form.Label>
              {isRequestBased || isEditing ? (
                <Form.Control
                  type="text"
                  name="contractName"
                  value={formData.contractName}
                  onChange={handleInputChange}
                  required
                  disabled={isEditing}
                />
              ) : (
                <Form.Select
                  name="contractName"
                  value={formData.contractName}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Contract Name</option>
                  <option value="Cosplay Rental">Cosplay Rental</option>
                  <option value="Character Rental">Character Rental</option>
                  <option value="Event Rental">Event Organization</option>
                </Form.Select>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Draft">Draft</option>
                <option value="Signed">Signed</option>
                <option value="Expired">Expired</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="text"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="text"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Form>
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </BootstrapModal.Footer>
      </BootstrapModal>

      {/* Contract Detail Modal */}
      <Modal
        title="View Detail Contract"
        open={isViewModalVisible}
        onOk={handleModalConfirm}
        onCancel={() => setIsViewModalVisible(false)}
        okText="OK"
        footer={[
          <Button key="edit" type="primary" onClick={handleEditInViewModal}>
            Edit
          </Button>,
          <Button key="ok" type="primary" onClick={handleModalConfirm}>
            OK
          </Button>,
        ]}
      >
        <p>
          <strong>Name:</strong>
        </p>
        <Input
          value={modalData.name}
          onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
          placeholder="Your account name"
          style={{ width: "250px" }}
        />
        <p>
          <strong>Description:</strong>
        </p>
        <TextArea
          value={modalData.description}
          onChange={(e) =>
            setModalData({ ...modalData, description: e.target.value })
          }
          placeholder="Enter description"
          style={{ width: "300px" }}
        />
        <p>
          <strong>Start DateTime:</strong> {modalData.startDate || "N/A"}
        </p>
        <p>
          <strong>End DateTime:</strong> {modalData.endDate || "N/A"}
        </p>
        <p>
          <strong>Location:</strong> {modalData.location || "N/A"}
        </p>
        <p>
          <strong>Coupon ID:</strong> {"N/A"}
        </p>
        <h4>List of Requested Characters:</h4>
        <List
          dataSource={modalData.listRequestCharacters}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <p>
                {item.cosplayerName || "N/A"} - {item.characterName || "N/A"} -
                Quantity: {item.quantity || 0} - Price:{" "}
                {item.price ? item.price.toLocaleString() : 0} VND
              </p>
            </List.Item>
          )}
        />
        <p>
          <strong>Total Price:</strong>{" "}
          {modalData.price ? modalData.price.toLocaleString() : 0} VND
        </p>
      </Modal>

      {/* Request Detail Modal */}
      <Modal
        title="View Detail Request"
        open={isRequestViewModalVisible}
        onOk={handleRequestModalConfirm}
        onCancel={() => setIsRequestViewModalVisible(false)}
        okText="OK"
        footer={[
          <Button key="ok" type="primary" onClick={handleRequestModalConfirm}>
            OK
          </Button>,
        ]}
      >
        <p>
          <strong>Name:</strong> {requestModalData.name || "N/A"}
        </p>
        <p>
          <strong>Description:</strong> {requestModalData.description || "N/A"}
        </p>
        <p>
          <strong>Start DateTime:</strong> {requestModalData.startDate || "N/A"}
        </p>
        <p>
          <strong>End DateTime:</strong> {requestModalData.endDate || "N/A"}
        </p>
        <p>
          <strong>Location:</strong> {requestModalData.location || "N/A"}
        </p>
        <p>
          <strong>Price:</strong>{" "}
          {requestModalData.price ? requestModalData.price.toLocaleString() : 0}{" "}
          VND
        </p>
        <h4>List of Requested Characters:</h4>
        <List
          dataSource={requestModalData.charactersListResponse}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <p>
                {item.description || "N/A"} - Quantity: {item.quantity || 0}
                {item.maxHeight && item.minHeight
                  ? ` - Height: ${item.minHeight}-${item.maxHeight}cm`
                  : ""}
                {item.maxWeight && item.minWeight
                  ? ` - Weight: ${item.minWeight}-${item.maxWeight}kg`
                  : ""}
              </p>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  totalEntries,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions,
}) => {
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  return (
    <div className="pagination-controls">
      <div className="pagination-info">
        <span className="showing-entries">{showingText}</span>
        <div className="rows-per-page" style={{ marginLeft: "20px" }}>
          <span>Rows per page: </span>
          <Dropdown onSelect={(value) => onRowsPerPageChange(Number(value))}>
            <Dropdown.Toggle variant="secondary" id="dropdown-rows-per-page">
              {rowsPerPage}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {rowsPerPageOptions.map((option) => (
                <Dropdown.Item key={option} eventKey={option}>
                  {option}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <Pagination>
        <Pagination.First
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages).keys()].map((page) => (
          <Pagination.Item
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => onPageChange(page + 1)}
          >
            {page + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default ManageContract;
