// import React, { useState, useEffect } from "react";
// import { Table, Form, Card } from "react-bootstrap";
// import {
//   Button,
//   Modal,
//   Dropdown,
//   Pagination,
//   Image,
//   Menu,
//   Tooltip,
//   Input,
// } from "antd";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import "../../../styles/Manager/ManageRequest.scss";
// import RequestService from "../../../services/ManageServicePages/ManageRequestService/RequestService.js";
// import dayjs from "dayjs";

// const { TextArea } = Input;

// const ManageRequest = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [formData, setFormData] = useState({ status: "", reason: "" });
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteItemId, setDeleteItemId] = useState(null);
//   const [deleteReason, setDeleteReason] = useState("");
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [searchRequest, setSearchRequest] = useState("");
//   const [sortRequest, setSortRequest] = useState({
//     field: "statusRequest",
//     order: "asc",
//   });
//   const [currentPageRequest, setCurrentPageRequest] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 20, 50];
//   const [selectedService, setSelectedService] = useState("All");
//   const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
//   const charactersPerPage = 2;
//   const [cosplayerData, setCosplayerData] = useState({});
//   const [tooltipLoading, setTooltipLoading] = useState({});

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

//   const fetchCosplayerData = async (cosplayerId) => {
//     if (!cosplayerId || cosplayerData[cosplayerId]) return;
//     try {
//       setTooltipLoading((prev) => ({ ...prev, [cosplayerId]: true }));
//       const response =
//         await RequestService.getNameCosplayerInRequestByCosplayerId(
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
//     const fetchRequests = async () => {
//       try {
//         const data = await RequestService.getAllRequests();
//         const formattedData = data.map((req) => {
//           let startDate = req.startDate || "N/A";
//           let endDate = req.endDate || "N/A";
//           if (
//             req.charactersListResponse &&
//             req.charactersListResponse.length > 0 &&
//             req.charactersListResponse[0].requestDateResponses &&
//             req.charactersListResponse[0].requestDateResponses.length > 0
//           ) {
//             const dateResponse =
//               req.charactersListResponse[0].requestDateResponses[0];
//             startDate = dateResponse.startDate
//               ? dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY").format(
//                   "HH:mm DD/MM/YYYY"
//                 )
//               : "N/A";
//             endDate = dateResponse.endDate
//               ? dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY").format(
//                   "HH:mm DD/MM/YYYY"
//                 )
//               : "N/A";
//           }

//           return {
//             id: req.requestId,
//             serviceId: req.serviceId || "Unknown",
//             name: req.name || "N/A",
//             description: req.description || "N/A",
//             location: req.location || "N/A",
//             price: req.price || 0,
//             statusRequest: mapStatus(req.status),
//             startDate,
//             endDate,
//             reason: req.reason || "",
//           };
//         });
//         setRequests(formattedData);
//         setLoading(false);
//       } catch (error) {
//         toast.error("Failed to fetch requests from API");
//         console.error("Fetch error:", error);
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, []);

//   const mapStatus = (status) => {
//     switch (status) {
//       case "Pending":
//         return "Pending";
//       case "Browsed":
//         return "Browsed";
//       case "Cancel":
//         return "Cancel";
//       default:
//         return "Unknown";
//     }
//   };

//   const mapStatusToNumber = (status) => {
//     switch (status) {
//       case "Pending":
//         return 0;
//       case "Browsed":
//         return 1;
//       case "Cancel":
//         return 2;
//       default:
//         return 0;
//     }
//   };

//   const filterAndSortData = (data, search, sort) => {
//     let filtered = [...data];
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
//         : valueB.localeCompare(valueB);
//     });
//   };

//   const filteredRequests = filterAndSortData(
//     requests,
//     searchRequest,
//     sortRequest
//   );
//   const totalPagesRequest = Math.ceil(filteredRequests.length / rowsPerPage);
//   const paginatedRequests = paginateData(filteredRequests, currentPageRequest);
//   const totalEntries = filteredRequests.length;

//   function paginateData(data, page, perPage = rowsPerPage) {
//     const startIndex = (page - 1) * perPage;
//     const endIndex = startIndex + perPage;
//     return data.slice(startIndex, endIndex);
//   }

//   const handleShowModal = (item) => {
//     setIsEditing(true);
//     setCurrentItem(item);
//     setFormData({ status: item.statusRequest, reason: "" });
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setIsEditing(false);
//     setCurrentItem(null);
//     setFormData({ status: "", reason: "" });
//   };

//   const handleShowDeleteModal = (id) => {
//     setDeleteItemId(id);
//     setDeleteReason("");
//     setShowDeleteModal(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setShowDeleteModal(false);
//     setDeleteItemId(null);
//     setDeleteReason("");
//   };

//   const handleShowViewModal = async (id) => {
//     try {
//       const data = await RequestService.getRequestByRequestId(id);
//       if (!data) {
//         throw new Error("Request data not found");
//       }

//       const request = requests.find((req) => req.id === id);
//       const serviceId = request?.serviceId;

//       if (serviceId === "S001") {
//         const characters = data.charactersListResponse || [];
//         const formattedData = {
//           name: data.name || "N/A",
//           description: data.description || "N/A",
//           startDate: data.startDate
//             ? dayjs(data.startDate, "HH:mm DD/MM/YYYY").format(
//                 "HH:mm DD/MM/YYYY"
//               )
//             : "N/A",
//           endDate: data.endDate
//             ? dayjs(data.endDate, "HH:mm DD/MM/YYYY").format("HH:mm DD/MM/YYYY")
//             : "N/A",
//           location: data.location || "N/A",
//           characters: characters.map((char) => ({
//             characterId: char.characterId,
//             maxHeight: char.maxHeight || 0,
//             maxWeight: char.maxWeight || 0,
//             minHeight: char.minHeight || 0,
//             minWeight: char.minWeight || 0,
//             quantity: char.quantity || 0,
//             urlImage: char.characterImages?.[0]?.urlImage || "",
//             description: char.description || "",
//           })),
//         };
//         setViewData(formattedData);
//       } else if (serviceId === "S002") {
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

//               const characterData = await RequestService.getCharacterById(
//                 char.characterId
//               );
//               characterName = characterData?.characterName || "Unknown";
//               characterPrice = characterData?.price || 0;

//               if (char.cosplayerId) {
//                 try {
//                   const cosplayerData =
//                     await RequestService.getNameCosplayerInRequestByCosplayerId(
//                       char.cosplayerId
//                     );
//                   cosplayerName = cosplayerData?.name || "Unknown";
//                   salaryIndex = cosplayerData?.salaryIndex || 1;
//                 } catch (cosplayerError) {
//                   console.warn(
//                     `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                     cosplayerError
//                   );
//                 }
//               }

//               const price = calculateCosplayerPrice(
//                 salaryIndex,
//                 characterPrice,
//                 char.quantity || 1,
//                 totalHours,
//                 totalDays
//               );

//               return {
//                 cosplayerId: char.cosplayerId || null,
//                 characterId: char.characterId,
//                 cosplayerName,
//                 characterName,
//                 characterPrice,
//                 quantity: char.quantity || 1,
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
//       } else {
//         const formattedData = {
//           id: data.requestId,
//           name: data.name || "N/A",
//           description: data.description || "N/A",
//           price: 0,
//           status: mapStatus(data.status),
//           startDateTime: data.startDate
//             ? dayjs(data.startDate, "HH:mm DD/MM/YYYY").format(
//                 "HH:mm DD/MM/YYYY"
//               )
//             : "N/A",
//           endDateTime: data.endDate
//             ? dayjs(data.endDate, "HH:mm DD/MM/YYYY").format("HH:mm DD/MM/YYYY")
//             : "N/A",
//           location: data.location || "N/A",
//           listRequestCharacters: [],
//         };

//         let packagePrice = 0;
//         if (serviceId === "S003" && data.packageId) {
//           try {
//             const packageData = await RequestService.getPackageById(
//               data.packageId
//             );
//             packagePrice = packageData?.price || 0;
//           } catch (error) {
//             console.warn(
//               `Failed to fetch package for ID ${data.packageId}:`,
//               error
//             );
//           }
//         }

//         const charactersList = data.charactersListResponse || [];
//         let totalCharactersPrice = 0;

//         if (charactersList.length > 0) {
//           const listRequestCharacters = await Promise.all(
//             charactersList.map(async (char) => {
//               let cosplayerName = "Not Assigned";
//               let salaryIndex = 1;
//               let characterPrice = 0;
//               let characterName = "Unknown";

//               try {
//                 const characterData = await RequestService.getCharacterById(
//                   char.characterId
//                 );
//                 characterName = characterData?.characterName || "Unknown";
//                 characterPrice = characterData?.price || 0;
//               } catch (error) {
//                 console.warn(
//                   `Failed to fetch character for ID ${char.characterId}:`,
//                   error
//                 );
//               }

//               if (char.cosplayerId) {
//                 try {
//                   const cosplayerData =
//                     await RequestService.getNameCosplayerInRequestByCosplayerId(
//                       char.cosplayerId
//                     );
//                   cosplayerName = cosplayerData?.name || "Not Assigned";
//                   salaryIndex = cosplayerData?.salaryIndex || 1;
//                 } catch (error) {
//                   console.warn(
//                     `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
//                     error
//                   );
//                 }
//               }

//               const price = characterPrice * (char.quantity || 0) * salaryIndex;
//               totalCharactersPrice += price;

//               return {
//                 cosplayerId: char.cosplayerId || null,
//                 characterId: char.characterId,
//                 cosplayerName,
//                 characterName,
//                 quantity: char.quantity || 0,
//                 salaryIndex,
//                 price,
//               };
//             })
//           );

//           formattedData.listRequestCharacters = listRequestCharacters;
//         }

//         formattedData.price = packagePrice + totalCharactersPrice;
//         setViewData(formattedData);
//       }
//       setShowViewModal(true);
//       setCurrentCharacterPage(1);
//     } catch (error) {
//       toast.error("Failed to fetch request details");
//       console.error("Error in handleShowViewModal:", error);
//     }
//   };

//   const handleCloseViewModal = () => {
//     setShowViewModal(false);
//     setViewData(null);
//     setCosplayerData({});
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const requestStatus = mapStatusToNumber(formData.status);
//     if (requestStatus === 2 && !formData.reason.trim()) {
//       toast.error("Reason is required when canceling a request");
//       return;
//     }
//     try {
//       await RequestService.UpdateRequestStatusById(
//         currentItem.id,
//         requestStatus,
//         formData.reason
//       );
//       const updatedRequests = requests.map((req) =>
//         req.id === currentItem.id
//           ? { ...req, statusRequest: formData.status }
//           : req
//       );
//       setRequests(updatedRequests);
//       toast.success("Request status updated successfully!");
//       handleCloseModal();
//     } catch (error) {
//       toast.error("Failed to update request status");
//       console.error("Update error:", error);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteReason.trim()) {
//       toast.error("Reason is required when deleting a request");
//       return;
//     }
//     try {
//       await RequestService.DeleteRequestByRequestId(deleteItemId, deleteReason);
//       setRequests(requests.filter((req) => req.id !== deleteItemId));
//       toast.success("Request deleted successfully!");
//       handleCloseDeleteModal();
//     } catch (error) {
//       toast.error("Failed to delete request");
//       console.error("Delete error:", error);
//     }
//   };

//   const handleSort = (field) => {
//     setSortRequest((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPageRequest(1);
//   };

//   const handlePageChange = (page) => setCurrentPageRequest(page);
//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPageRequest(1);
//   };

//   const handleServiceFilterChange = (value) => {
//     setSelectedService(value);
//     setCurrentPageRequest(1);
//   };

//   const serviceMenu = (
//     <Menu onClick={({ key }) => handleServiceFilterChange(key)}>
//       <Menu.Item key="All">All Services</Menu.Item>
//       <Menu.Item key="S001">Hire Costume</Menu.Item>
//       <Menu.Item key="S002">Hire Cosplayer</Menu.Item>
//       <Menu.Item key="S003">Event Organization</Menu.Item>
//     </Menu>
//   );

//   if (loading) return <div>Loading requests...</div>;

//   return (
//     <div className="manage-general">
//       <h2 className="manage-general-title">Manage Requests</h2>
//       <div className="table-container">
//         <Card className="status-table-card">
//           <Card.Body>
//             <div className="table-header">
//               <h3>Requests</h3>
//               <div style={{ display: "flex", gap: "10px" }}>
//                 <Form.Control
//                   type="text"
//                   placeholder="Search requests..."
//                   value={searchRequest}
//                   onChange={(e) => setSearchRequest(e.target.value)}
//                   className="search-input"
//                 />
//                 <Dropdown overlay={serviceMenu}>
//                   <Button>
//                     {selectedService === "All"
//                       ? "All Services"
//                       : selectedService === "S001"
//                       ? "Hire Costume"
//                       : selectedService === "S002"
//                       ? "Hire Cosplayer"
//                       : "Event Organization"}{" "}
//                     ▼
//                   </Button>
//                 </Dropdown>
//               </div>
//             </div>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th onClick={() => handleSort("name")}>
//                     Name{" "}
//                     {sortRequest.field === "name" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("description")}>
//                     Description{" "}
//                     {sortRequest.field === "description" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th>Location</th>
//                   <th onClick={() => handleSort("price")}>
//                     Price{" "}
//                     {sortRequest.field === "price" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("statusRequest")}>
//                     Status{" "}
//                     {sortRequest.field === "statusRequest" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("startDate")}>
//                     Start Date{" "}
//                     {sortRequest.field === "startDate" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("endDate")}>
//                     End Date{" "}
//                     {sortRequest.field === "endDate" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("reason")}>
//                     Reason{" "}
//                     {sortRequest.field === "reason" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedRequests.length > 0 ? (
//                   paginatedRequests.map((req) => (
//                     <tr key={req.id}>
//                       <td>{req.name}</td>
//                       <td>{req.description}</td>
//                       <td>{req.location}</td>
//                       <td>{req.price.toLocaleString()}</td>
//                       <td>{req.statusRequest}</td>
//                       <td>{req.startDate}</td>
//                       <td>{req.endDate}</td>
//                       <td>{req.reason}</td>
//                       <td>
//                         {req.statusRequest !== "Cancel" ? (
//                           <Button
//                             type="primary"
//                             size="small"
//                             onClick={() => handleShowModal(req)}
//                             style={{ marginRight: "8px" }}
//                           >
//                             Edit
//                           </Button>
//                         ) : (
//                           <Button
//                             type="primary"
//                             size="small"
//                             disabled
//                             style={{ marginRight: "8px" }}
//                           >
//                             Edit
//                           </Button>
//                         )}
//                         <Button
//                           size="small"
//                           onClick={() => handleShowViewModal(req.id)}
//                           style={{ marginRight: "8px" }}
//                         >
//                           View
//                         </Button>
//                         <Button
//                           type="primary"
//                           danger
//                           size="small"
//                           onClick={() => handleShowDeleteModal(req.id)}
//                         >
//                           Delete
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="text-center">
//                       No requests found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//             <PaginationControls
//               currentPage={currentPageRequest}
//               totalPages={totalPagesRequest}
//               onPageChange={handlePageChange}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleRowsPerPageChange}
//               rowsPerPageOptions={rowsPerPageOptions}
//               totalEntries={totalEntries}
//               showingEntries={paginatedRequests.length}
//             />
//           </Card.Body>
//         </Card>
//       </div>

//       <Modal
//         title="Edit Request Status"
//         open={showModal}
//         onCancel={handleCloseModal}
//         footer={[
//           <Button key="cancel" onClick={handleCloseModal}>
//             Cancel
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             onClick={handleSubmit}
//             disabled={formData.status === "Cancel" && !formData.reason.trim()}
//           >
//             Update
//           </Button>,
//         ]}
//       >
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-2">
//             <Form.Label>Status</Form.Label>
//             <Form.Select
//               name="status"
//               value={formData.status}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select Status</option>
//               <option value="Pending">Pending 🔃</option>
//               <option value="Browsed">Browsed ✅</option>
//               <option value="Cancel">Cancel ❌</option>
//             </Form.Select>
//           </Form.Group>
//           {formData.status === "Cancel" && (
//             <Form.Group className="mb-2">
//               <Form.Label>Reason</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="reason"
//                 value={formData.reason}
//                 onChange={handleInputChange}
//                 placeholder="Enter reason for cancellation"
//                 required
//               />
//             </Form.Group>
//           )}
//         </Form>
//       </Modal>

//       <Modal
//         title="Delete Request"
//         open={showDeleteModal}
//         onCancel={handleCloseDeleteModal}
//         footer={[
//           <Button key="cancel" onClick={handleCloseDeleteModal}>
//             Cancel
//           </Button>,
//           <Button
//             key="delete"
//             type="primary"
//             danger
//             onClick={handleDelete}
//             disabled={!deleteReason.trim()}
//           >
//             Delete
//           </Button>,
//         ]}
//       >
//         <Form>
//           <Form.Group className="mb-2">
//             <Form.Label>Reason for Deletion</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               value={deleteReason}
//               onChange={(e) => setDeleteReason(e.target.value)}
//               placeholder="Enter reason for deletion"
//               required
//             />
//           </Form.Group>
//         </Form>
//       </Modal>

//       <Modal
//         title="Request Details"
//         open={showViewModal}
//         onCancel={handleCloseViewModal}
//         footer={[
//           <Button key="close" onClick={handleCloseViewModal}>
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
//                               )} hours × ${item.salaryIndex} VND/h) + (${
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
//                 <strong>{viewData.price.toLocaleString()} VND</strong>
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
//   onPageChange,
//   rowsPerPage,
//   onRowsPerPageChange,
//   rowsPerPageOptions,
//   totalEntries,
//   showingEntries,
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

// export default ManageRequest;

// sua lai edit=============================================================================
// import React, { useState, useEffect } from "react";
// import { Table, Form, Card } from "react-bootstrap";
// import {
//   Button,
//   Modal,
//   Dropdown,
//   Pagination,
//   Image,
//   Menu,
//   Tooltip,
//   Input,
// } from "antd";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import "../../../styles/Manager/ManageRequest.scss";
// import RequestService from "../../../services/ManageServicePages/ManageRequestService/RequestService.js";
// import dayjs from "dayjs";

// const { TextArea } = Input;

// const ManageRequest = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [formData, setFormData] = useState({ status: "", reason: "" });
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteItemId, setDeleteItemId] = useState(null);
//   const [deleteReason, setDeleteReason] = useState("");
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [searchRequest, setSearchRequest] = useState("");
//   const [sortRequest, setSortRequest] = useState({
//     field: "statusRequest",
//     order: "asc",
//   });
//   const [currentPageRequest, setCurrentPageRequest] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 20, 50];
//   const [selectedService, setSelectedService] = useState("All");
//   const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
//   const charactersPerPage = 2;
//   const [cosplayerData, setCosplayerData] = useState({});
//   const [tooltipLoading, setTooltipLoading] = useState({});

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

//   const fetchCosplayerData = async (cosplayerId) => {
//     if (!cosplayerId || cosplayerData[cosplayerId]) return;
//     try {
//       setTooltipLoading((prev) => ({ ...prev, [cosplayerId]: true }));
//       const response =
//         await RequestService.getNameCosplayerInRequestByCosplayerId(
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
//     const fetchRequests = async () => {
//       try {
//         const data = await RequestService.getAllRequests();
//         const formattedData = data.map((req) => {
//           let startDate = req.startDate || "N/A";
//           let endDate = req.endDate || "N/A";
//           if (
//             req.charactersListResponse &&
//             req.charactersListResponse.length > 0 &&
//             req.charactersListResponse[0].requestDateResponses &&
//             req.charactersListResponse[0].requestDateResponses.length > 0
//           ) {
//             const dateResponse =
//               req.charactersListResponse[0].requestDateResponses[0];
//             startDate = dateResponse.startDate
//               ? dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY").format(
//                   "HH:mm DD/MM/YYYY"
//                 )
//               : "N/A";
//             endDate = dateResponse.endDate
//               ? dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY").format(
//                   "HH:mm DD/MM/YYYY"
//                 )
//               : "N/A";
//           }

//           return {
//             id: req.requestId,
//             serviceId: req.serviceId || "Unknown",
//             name: req.name || "N/A",
//             description: req.description || "N/A",
//             location: req.location || "N/A",
//             price: req.price || 0,
//             statusRequest: mapStatus(req.status),
//             startDate,
//             endDate,
//             reason: req.reason || "",
//           };
//         });
//         setRequests(formattedData);
//         setLoading(false);
//       } catch (error) {
//         toast.error("Failed to fetch requests from API");
//         console.error("Fetch error:", error);
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, []);

//   const mapStatus = (status) => {
//     switch (status) {
//       case "Pending":
//         return "Pending";
//       case "Browsed":
//         return "Browsed";
//       case "Cancel":
//         return "Cancel";
//       default:
//         return "Unknown";
//     }
//   };

//   const mapStatusToNumber = (status) => {
//     switch (status) {
//       case "Pending":
//         return 0;
//       case "Browsed":
//         return 1;
//       case "Cancel":
//         return 2;
//       default:
//         return 0;
//     }
//   };

//   const filterAndSortData = (data, search, sort) => {
//     let filtered = [...data];
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
//         : valueB.localeCompare(valueB);
//     });
//   };

//   const filteredRequests = filterAndSortData(
//     requests,
//     searchRequest,
//     sortRequest
//   );
//   const totalPagesRequest = Math.ceil(filteredRequests.length / rowsPerPage);
//   const paginatedRequests = paginateData(filteredRequests, currentPageRequest);
//   const totalEntries = filteredRequests.length;

//   function paginateData(data, page, perPage = rowsPerPage) {
//     const startIndex = (page - 1) * perPage;
//     const endIndex = startIndex + perPage;
//     return data.slice(startIndex, endIndex);
//   }

//   const handleShowModal = (item) => {
//     setIsEditing(true);
//     setCurrentItem(item);
//     setFormData({ status: item.statusRequest, reason: "" });
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setIsEditing(false);
//     setCurrentItem(null);
//     setFormData({ status: "", reason: "" });
//   };

//   const handleShowDeleteModal = (id) => {
//     setDeleteItemId(id);
//     setDeleteReason("");
//     setShowDeleteModal(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setShowDeleteModal(false);
//     setDeleteItemId(null);
//     setDeleteReason("");
//   };

//   const handleShowViewModal = async (id) => {
//     try {
//       const data = await RequestService.getRequestByRequestId(id);
//       if (!data) {
//         throw new Error("Request data not found");
//       }

//       const request = requests.find((req) => req.id === id);
//       const serviceId = request?.serviceId;

//       if (serviceId === "S001") {
//         const characters = data.charactersListResponse || [];
//         const formattedData = {
//           name: data.name || "N/A",
//           description: data.description || "N/A",
//           startDate: data.startDate
//             ? dayjs(data.startDate, "HH:mm DD/MM/YYYY").format(
//                 "HH:mm DD/MM/YYYY"
//               )
//             : "N/A",
//           endDate: data.endDate
//             ? dayjs(data.endDate, "HH:mm DD/MM/YYYY").format("HH:mm DD/MM/YYYY")
//             : "N/A",
//           location: data.location || "N/A",
//           characters: characters.map((char) => ({
//             characterId: char.characterId,
//             maxHeight: char.maxHeight || 0,
//             maxWeight: char.maxWeight || 0,
//             minHeight: char.minHeight || 0,
//             minWeight: char.minWeight || 0,
//             quantity: char.quantity || 0,
//             urlImage: char.characterImages?.[0]?.urlImage || "",
//             description: char.description || "",
//           })),
//         };
//         setViewData(formattedData);
//       } else if (serviceId === "S002") {
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

//               const characterData = await RequestService.getCharacterById(
//                 char.characterId
//               );
//               characterName = characterData?.characterName || "Unknown";
//               characterPrice = characterData?.price || 0;

//               if (char.cosplayerId) {
//                 try {
//                   const cosplayerData =
//                     await RequestService.getNameCosplayerInRequestByCosplayerId(
//                       char.cosplayerId
//                     );
//                   cosplayerName = cosplayerData?.name || "Unknown";
//                   salaryIndex = cosplayerData?.salaryIndex || 1;
//                 } catch (cosplayerError) {
//                   console.warn(
//                     `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                     cosplayerError
//                   );
//                 }
//               }

//               const price = calculateCosplayerPrice(
//                 salaryIndex,
//                 characterPrice,
//                 char.quantity || 1,
//                 totalHours,
//                 totalDays
//               );

//               return {
//                 cosplayerId: char.cosplayerId || null,
//                 characterId: char.characterId,
//                 cosplayerName,
//                 characterName,
//                 characterPrice,
//                 quantity: char.quantity || 1,
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
//       } else {
//         const formattedData = {
//           id: data.requestId,
//           name: data.name || "N/A",
//           description: data.description || "N/A",
//           price: 0,
//           status: mapStatus(data.status),
//           startDateTime: data.startDate
//             ? dayjs(data.startDate, "HH:mm DD/MM/YYYY").format(
//                 "HH:mm DD/MM/YYYY"
//               )
//             : "N/A",
//           endDateTime: data.endDate
//             ? dayjs(data.endDate, "HH:mm DD/MM/YYYY").format("HH:mm DD/MM/YYYY")
//             : "N/A",
//           location: data.location || "N/A",
//           listRequestCharacters: [],
//         };

//         let packagePrice = 0;
//         if (serviceId === "S003" && data.packageId) {
//           try {
//             const packageData = await RequestService.getPackageById(
//               data.packageId
//             );
//             packagePrice = packageData?.price || 0;
//           } catch (error) {
//             console.warn(
//               `Failed to fetch package for ID ${data.packageId}:`,
//               error
//             );
//           }
//         }

//         const charactersList = data.charactersListResponse || [];
//         let totalCharactersPrice = 0;

//         if (charactersList.length > 0) {
//           const listRequestCharacters = await Promise.all(
//             charactersList.map(async (char) => {
//               let cosplayerName = "Not Assigned";
//               let salaryIndex = 1;
//               let characterPrice = 0;
//               let characterName = "Unknown";

//               try {
//                 const characterData = await RequestService.getCharacterById(
//                   char.characterId
//                 );
//                 characterName = characterData?.characterName || "Unknown";
//                 characterPrice = characterData?.price || 0;
//               } catch (error) {
//                 console.warn(
//                   `Failed to fetch character for ID ${char.characterId}:`,
//                   error
//                 );
//               }

//               if (char.cosplayerId) {
//                 try {
//                   const cosplayerData =
//                     await RequestService.getNameCosplayerInRequestByCosplayerId(
//                       char.cosplayerId
//                     );
//                   cosplayerName = cosplayerData?.name || "Not Assigned";
//                   salaryIndex = cosplayerData?.salaryIndex || 1;
//                 } catch (error) {
//                   console.warn(
//                     `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
//                     error
//                   );
//                 }
//               }

//               const price = characterPrice * (char.quantity || 0) * salaryIndex;
//               totalCharactersPrice += price;

//               return {
//                 cosplayerId: char.cosplayerId || null,
//                 characterId: char.characterId,
//                 cosplayerName,
//                 characterName,
//                 quantity: char.quantity || 0,
//                 salaryIndex,
//                 price,
//               };
//             })
//           );

//           formattedData.listRequestCharacters = listRequestCharacters;
//         }

//         formattedData.price = packagePrice + totalCharactersPrice;
//         setViewData(formattedData);
//       }
//       setShowViewModal(true);
//       setCurrentCharacterPage(1);
//     } catch (error) {
//       toast.error("Failed to fetch request details");
//       console.error("Error in handleShowViewModal:", error);
//     }
//   };

//   const handleCloseViewModal = () => {
//     setShowViewModal(false);
//     setViewData(null);
//     setCosplayerData({});
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const requestStatus = mapStatusToNumber(formData.status);
//     if (requestStatus === 2 && !formData.reason.trim()) {
//       toast.error("Reason is required when canceling a request");
//       return;
//     }
//     try {
//       await RequestService.UpdateRequestStatusById(
//         currentItem.id,
//         requestStatus,
//         formData.reason
//       );
//       const updatedRequests = requests.map((req) =>
//         req.id === currentItem.id
//           ? { ...req, statusRequest: formData.status }
//           : req
//       );
//       setRequests(updatedRequests);
//       toast.success("Request status updated successfully!");
//       handleCloseModal();
//     } catch (error) {
//       toast.error("Failed to update request status");
//       console.error("Update error:", error);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteReason.trim()) {
//       toast.error("Reason is required when deleting a request");
//       return;
//     }
//     try {
//       await RequestService.DeleteRequestByRequestId(deleteItemId, deleteReason);
//       setRequests(requests.filter((req) => req.id !== deleteItemId));
//       toast.success("Request deleted successfully!");
//       handleCloseDeleteModal();
//     } catch (error) {
//       toast.error("Failed to delete request");
//       console.error("Delete error:", error);
//     }
//   };

//   const handleSort = (field) => {
//     setSortRequest((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPageRequest(1);
//   };

//   const handlePageChange = (page) => setCurrentPageRequest(page);
//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPageRequest(1);
//   };

//   const handleServiceFilterChange = (value) => {
//     setSelectedService(value);
//     setCurrentPageRequest(1);
//   };

//   const serviceMenu = (
//     <Menu onClick={({ key }) => handleServiceFilterChange(key)}>
//       <Menu.Item key="All">All Services</Menu.Item>
//       <Menu.Item key="S001">Hire Costume</Menu.Item>
//       <Menu.Item key="S002">Hire Cosplayer</Menu.Item>
//       <Menu.Item key="S003">Event Organization</Menu.Item>
//     </Menu>
//   );

//   if (loading) return <div>Loading requests...</div>;

//   return (
//     <div className="manage-general">
//       <h2 className="manage-general-title">Manage Requests</h2>
//       <div className="table-container">
//         <Card className="status-table-card">
//           <Card.Body>
//             <div className="table-header">
//               <h3>Requests</h3>
//               <div style={{ display: "flex", gap: "10px" }}>
//                 <Form.Control
//                   type="text"
//                   placeholder="Search requests..."
//                   value={searchRequest}
//                   onChange={(e) => setSearchRequest(e.target.value)}
//                   className="search-input"
//                 />
//                 <Dropdown overlay={serviceMenu}>
//                   <Button>
//                     {selectedService === "All"
//                       ? "All Services"
//                       : selectedService === "S001"
//                       ? "Hire Costume"
//                       : selectedService === "S002"
//                       ? "Hire Cosplayer"
//                       : "Event Organization"}{" "}
//                     ▼
//                   </Button>
//                 </Dropdown>
//               </div>
//             </div>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th onClick={() => handleSort("name")}>
//                     Name{" "}
//                     {sortRequest.field === "name" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("description")}>
//                     Description{" "}
//                     {sortRequest.field === "description" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th>Location</th>
//                   <th onClick={() => handleSort("price")}>
//                     Price{" "}
//                     {sortRequest.field === "price" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("statusRequest")}>
//                     Status{" "}
//                     {sortRequest.field === "statusRequest" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("startDate")}>
//                     Start Date{" "}
//                     {sortRequest.field === "startDate" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("endDate")}>
//                     End Date{" "}
//                     {sortRequest.field === "endDate" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("reason")}>
//                     Reason{" "}
//                     {sortRequest.field === "reason" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedRequests.length > 0 ? (
//                   paginatedRequests.map((req) => (
//                     <tr key={req.id}>
//                       <td>{req.name}</td>
//                       <td>{req.description}</td>
//                       <td>{req.location}</td>
//                       <td>{req.price.toLocaleString()}</td>
//                       <td>{req.statusRequest}</td>
//                       <td>{req.startDate}</td>
//                       <td>{req.endDate}</td>
//                       <td>{req.reason}</td>
//                       <td>
//                         {req.statusRequest === "Pending" ? (
//                           <Button
//                             type="primary"
//                             size="small"
//                             onClick={() => handleShowModal(req)}
//                             style={{ marginRight: "8px" }}
//                           >
//                             Edit
//                           </Button>
//                         ) : (
//                           <Button
//                             type="primary"
//                             size="small"
//                             disabled
//                             style={{ marginRight: "8px" }}
//                           >
//                             Edit
//                           </Button>
//                         )}
//                         <Button
//                           size="small"
//                           onClick={() => handleShowViewModal(req.id)}
//                           style={{ marginRight: "8px" }}
//                         >
//                           View
//                         </Button>
//                         <Button
//                           type="primary"
//                           danger
//                           size="small"
//                           onClick={() => handleShowDeleteModal(req.id)}
//                         >
//                           Delete
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="text-center">
//                       No requests found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//             <PaginationControls
//               currentPage={currentPageRequest}
//               totalPages={totalPagesRequest}
//               onPageChange={handlePageChange}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleRowsPerPageChange}
//               rowsPerPageOptions={rowsPerPageOptions}
//               totalEntries={totalEntries}
//               showingEntries={paginatedRequests.length}
//             />
//           </Card.Body>
//         </Card>
//       </div>

//       <Modal
//         title="Edit Request Status"
//         open={showModal}
//         onCancel={handleCloseModal}
//         footer={[
//           <Button key="cancel" onClick={handleCloseModal}>
//             Cancel
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             onClick={handleSubmit}
//             disabled={formData.status === "Cancel" && !formData.reason.trim()}
//           >
//             Update
//           </Button>,
//         ]}
//       >
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-2">
//             <Form.Label>Status</Form.Label>
//             <Form.Select
//               name="status"
//               value={formData.status}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select Status</option>
//               {/* <option value="Pending">Pending 🔃</option> */}
//               <option value="Browsed">Browsed ✅</option>
//               <option value="Cancel">Cancel ❌</option>
//             </Form.Select>
//           </Form.Group>
//           {formData.status === "Cancel" && (
//             <Form.Group className="mb-2">
//               <Form.Label>Reason</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="reason"
//                 value={formData.reason}
//                 onChange={handleInputChange}
//                 placeholder="Enter reason for cancellation"
//                 required
//               />
//             </Form.Group>
//           )}
//         </Form>
//       </Modal>

//       <Modal
//         title="Delete Request"
//         open={showDeleteModal}
//         onCancel={handleCloseDeleteModal}
//         footer={[
//           <Button key="cancel" onClick={handleCloseDeleteModal}>
//             Cancel
//           </Button>,
//           <Button
//             key="delete"
//             type="primary"
//             danger
//             onClick={handleDelete}
//             disabled={!deleteReason.trim()}
//           >
//             Delete
//           </Button>,
//         ]}
//       >
//         <Form>
//           <Form.Group className="mb-2">
//             <Form.Label>Reason for Deletion</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               value={deleteReason}
//               onChange={(e) => setDeleteReason(e.target.value)}
//               placeholder="Enter reason for deletion"
//               required
//             />
//           </Form.Group>
//         </Form>
//       </Modal>

//       <Modal
//         title="Request Details"
//         open={showViewModal}
//         onCancel={handleCloseViewModal}
//         footer={[
//           <Button key="close" onClick={handleCloseViewModal}>
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
//                               )} hours × ${item.salaryIndex} VND/h) + (${
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
//                 <strong>{viewData.price.toLocaleString()} VND</strong>
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
//   onPageChange,
//   rowsPerPage,
//   onRowsPerPageChange,
//   rowsPerPageOptions,
//   totalEntries,
//   showingEntries,
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

// export default ManageRequest;

/// mock data date if N/A
// import React, { useState, useEffect } from "react";
// import { Table, Form, Card } from "react-bootstrap";
// import {
//   Button,
//   Modal,
//   Dropdown,
//   Pagination,
//   Image,
//   Menu,
//   Tooltip,
//   Input,
// } from "antd";
// import { toast } from "react-toastify";
// import { Link } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import "../../../styles/Manager/ManageRequest.scss";
// import RequestService from "../../../services/ManageServicePages/ManageRequestService/RequestService.js";
// import dayjs from "dayjs";
// import minMax from "dayjs/plugin/minMax";
// dayjs.extend(minMax);

// const { TextArea } = Input;

// const ManageRequest = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [formData, setFormData] = useState({ status: "", reason: "" });
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteItemId, setDeleteItemId] = useState(null);
//   const [deleteReason, setDeleteReason] = useState("");
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [viewData, setViewData] = useState(null);
//   const [searchRequest, setSearchRequest] = useState("");
//   const [sortRequest, setSortRequest] = useState({
//     field: "statusRequest",
//     order: "asc",
//   });
//   const [currentPageRequest, setCurrentPageRequest] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 20, 50];
//   const [selectedService, setSelectedService] = useState("All");
//   const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
//   const charactersPerPage = 2;
//   const [cosplayerData, setCosplayerData] = useState({});
//   const [tooltipLoading, setTooltipLoading] = useState({});

//   // Hàm tạo dữ liệu mock cho ngày tháng
//   const generateMockDates = () => {
//     const currentDate = dayjs(); // Ngày hiện tại: 19/04/2025
//     const mockStartDate = currentDate.add(1, "day").format("DD/MM/YYYY"); // Ngày mai: 20/04/2025
//     const mockEndDate = currentDate.add(3, "day").format("DD/MM/YYYY"); // 3 ngày sau: 22/04/2025
//     return { startDate: mockStartDate, endDate: mockEndDate };
//   };

//   // Hàm tính khoảng thời gian ngày đầu và ngày cuối từ requestDateResponses
//   const getRequestDateRange = (charactersListResponse) => {
//     const allDates = [];
//     charactersListResponse?.forEach((char) => {
//       (char.requestDateResponses || []).forEach((date) => {
//         allDates.push(dayjs(date.startDate, "HH:mm DD/MM/YYYY"));
//         allDates.push(dayjs(date.endDate, "HH:mm DD/MM/YYYY"));
//       });
//     });

//     if (allDates.length === 0) {
//       // Nếu không có dữ liệu ngày, trả về dữ liệu mock
//       return generateMockDates();
//     }

//     const startDate = dayjs.min(allDates).format("DD/MM/YYYY");
//     const endDate = dayjs.max(allDates).format("DD/MM/YYYY");

//     return { startDate, endDate };
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
//     characterPrice,
//     quantity,
//     totalHours,
//     totalDays
//   ) => {
//     if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
//     return (totalHours * salaryIndex + totalDays * characterPrice) * quantity;
//   };

//   const fetchCosplayerData = async (cosplayerId) => {
//     if (!cosplayerId || cosplayerData[cosplayerId]) return;
//     try {
//       setTooltipLoading((prev) => ({ ...prev, [cosplayerId]: true }));
//       const response =
//         await RequestService.getNameCosplayerInRequestByCosplayerId(
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
//     const fetchRequests = async () => {
//       try {
//         const data = await RequestService.getAllRequests();
//         const formattedData = data.map((req) => {
//           const { startDate, endDate } = req.charactersListResponse
//             ? getRequestDateRange(req.charactersListResponse)
//             : req.startDate && req.endDate
//             ? { startDate: req.startDate, endDate: req.endDate }
//             : generateMockDates(); // Sử dụng mock nếu không có dữ liệu

//           return {
//             id: req.requestId,
//             serviceId: req.serviceId || "Unknown",
//             name: req.name || "N/A",
//             description: req.description || "N/A",
//             location: req.location || "N/A",
//             price: req.price || 0,
//             statusRequest: mapStatus(req.status),
//             startDate,
//             endDate,
//             reason: req.reason || "",
//           };
//         });
//         setRequests(formattedData);
//         setLoading(false);
//       } catch (error) {
//         toast.error("Failed to fetch requests from API");
//         console.error("Fetch error:", error);
//         setLoading(false);
//       }
//     };
//     fetchRequests();
//   }, []);

//   const mapStatus = (status) => {
//     switch (status) {
//       case "Pending":
//         return "Pending";
//       case "Browsed":
//         return "Browsed";
//       case "Cancel":
//         return "Cancel";
//       default:
//         return "Unknown";
//     }
//   };

//   const mapStatusToNumber = (status) => {
//     switch (status) {
//       case "Pending":
//         return 0;
//       case "Browsed":
//         return 1;
//       case "Cancel":
//         return 2;
//       default:
//         return 0;
//     }
//   };

//   const filterAndSortData = (data, search, sort) => {
//     let filtered = [...data];
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

//       if (sort.field === "startDate" || sort.field === "endDate") {
//         valueA = dayjs(valueA, "DD/MM/YYYY"); // Không cần kiểm tra N/A vì đã thay thế
//         valueB = dayjs(valueB, "DD/MM/YYYY");
//         return sort.order === "asc" ? valueA.diff(valueB) : valueB.diff(valueA);
//       }

//       valueA = valueA ? String(valueA).toLowerCase() : "";
//       valueB = valueB ? String(valueB).toLowerCase() : "";
//       return sort.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredRequests = filterAndSortData(
//     requests,
//     searchRequest,
//     sortRequest
//   );
//   const totalPagesRequest = Math.ceil(filteredRequests.length / rowsPerPage);
//   const paginatedRequests = paginateData(filteredRequests, currentPageRequest);
//   const totalEntries = filteredRequests.length;

//   function paginateData(data, page, perPage = rowsPerPage) {
//     const startIndex = (page - 1) * perPage;
//     const endIndex = startIndex + perPage;
//     return data.slice(startIndex, endIndex);
//   }

//   const handleShowModal = (item) => {
//     setIsEditing(true);
//     setCurrentItem(item);
//     setFormData({ status: item.statusRequest, reason: "" });
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setIsEditing(false);
//     setCurrentItem(null);
//     setFormData({ status: "", reason: "" });
//   };

//   const handleShowDeleteModal = (id) => {
//     setDeleteItemId(id);
//     setDeleteReason("");
//     setShowDeleteModal(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setShowDeleteModal(false);
//     setDeleteItemId(null);
//     setDeleteReason("");
//   };

//   const handleShowViewModal = async (id) => {
//     try {
//       const data = await RequestService.getRequestByRequestId(id);
//       if (!data) {
//         throw new Error("Request data not found");
//       }

//       const request = requests.find((req) => req.id === id);
//       const serviceId = request?.serviceId;

//       const { startDate, endDate } = data.charactersListResponse
//         ? getRequestDateRange(data.charactersListResponse)
//         : data.startDate && data.endDate
//         ? { startDate: data.startDate, endDate: data.endDate }
//         : generateMockDates();

//       if (serviceId === "S001") {
//         const characters = data.charactersListResponse || [];
//         const formattedData = {
//           name: data.name || "N/A",
//           description: data.description || "N/A",
//           startDate: startDate,
//           endDate: endDate,
//           location: data.location || "N/A",
//           characters: characters.map((char) => ({
//             characterId: char.characterId,
//             maxHeight: char.maxHeight || 0,
//             maxWeight: char.maxWeight || 0,
//             minHeight: char.minHeight || 0,
//             minWeight: char.minWeight || 0,
//             quantity: char.quantity || 0,
//             urlImage: char.characterImages?.[0]?.urlImage || "",
//             description: char.description || "",
//           })),
//         };
//         setViewData(formattedData);
//       } else if (serviceId === "S002") {
//         const formattedData = {
//           name: data.name || "N/A",
//           description: data.description || "N/A",
//           location: data.location || "N/A",
//           deposit: data.deposit || "N/A",
//           listRequestCharacters: [],
//           price: 0,
//           status: mapStatus(data.status),
//           reason: data.reason || null,
//           startDate: startDate,
//           endDate: endDate,
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

//               const characterData = await RequestService.getCharacterById(
//                 char.characterId
//               );
//               characterName = characterData?.characterName || "Unknown";
//               characterPrice = characterData?.price || 0;

//               if (char.cosplayerId) {
//                 try {
//                   const cosplayerData =
//                     await RequestService.getNameCosplayerInRequestByCosplayerId(
//                       char.cosplayerId
//                     );
//                   cosplayerName = cosplayerData?.name || "Unknown";
//                   salaryIndex = cosplayerData?.salaryIndex || 1;
//                 } catch (cosplayerError) {
//                   console.warn(
//                     `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                     cosplayerError
//                   );
//                 }
//               }

//               const price = calculateCosplayerPrice(
//                 salaryIndex,
//                 characterPrice,
//                 char.quantity || 1,
//                 totalHours,
//                 totalDays
//               );

//               return {
//                 cosplayerId: char.cosplayerId || null,
//                 characterId: char.characterId,
//                 cosplayerName,
//                 characterName,
//                 characterPrice,
//                 quantity: char.quantity || 1,
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
//       } else {
//         const formattedData = {
//           id: data.requestId,
//           name: data.name || "N/A",
//           description: data.description || "N/A",
//           price: 0,
//           status: mapStatus(data.status),
//           startDate: startDate,
//           endDate: endDate,
//           location: data.location || "N/A",
//           listRequestCharacters: [],
//         };

//         let packagePrice = 0;
//         if (serviceId === "S003" && data.packageId) {
//           try {
//             const packageData = await RequestService.getPackageById(
//               data.packageId
//             );
//             packagePrice = packageData?.price || 0;
//           } catch (error) {
//             console.warn(
//               `Failed to fetch package for ID ${data.packageId}:`,
//               error
//             );
//           }
//         }

//         const charactersList = data.charactersListResponse || [];
//         let totalCharactersPrice = 0;

//         if (charactersList.length > 0) {
//           const listRequestCharacters = await Promise.all(
//             charactersList.map(async (char) => {
//               let cosplayerName = "Not Assigned";
//               let salaryIndex = 1;
//               let characterPrice = 0;
//               let characterName = "Unknown";

//               try {
//                 const characterData = await RequestService.getCharacterById(
//                   char.characterId
//                 );
//                 characterName = characterData?.characterName || "Unknown";
//                 characterPrice = characterData?.price || 0;
//               } catch (error) {
//                 console.warn(
//                   `Failed to fetch character for ID ${char.characterId}:`,
//                   error
//                 );
//               }

//               if (char.cosplayerId) {
//                 try {
//                   const cosplayerData =
//                     await RequestService.getNameCosplayerInRequestByCosplayerId(
//                       char.cosplayerId
//                     );
//                   cosplayerName = cosplayerData?.name || "Not Assigned";
//                   salaryIndex = cosplayerData?.salaryIndex || 1;
//                 } catch (error) {
//                   console.warn(
//                     `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
//                     error
//                   );
//                 }
//               }

//               const price = characterPrice * (char.quantity || 0) * salaryIndex;
//               totalCharactersPrice += price;

//               return {
//                 cosplayerId: char.cosplayerId || null,
//                 characterId: char.characterId,
//                 cosplayerName,
//                 characterName,
//                 quantity: char.quantity || 0,
//                 salaryIndex,
//                 price,
//               };
//             })
//           );

//           formattedData.listRequestCharacters = listRequestCharacters;
//         }

//         formattedData.price = packagePrice + totalCharactersPrice;
//         setViewData(formattedData);
//       }
//       setShowViewModal(true);
//       setCurrentCharacterPage(1);
//     } catch (error) {
//       toast.error("Failed to fetch request details");
//       console.error("Error in handleShowViewModal:", error);
//     }
//   };

//   const handleCloseViewModal = () => {
//     setShowViewModal(false);
//     setViewData(null);
//     setCosplayerData({});
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const requestStatus = mapStatusToNumber(formData.status);
//     if (requestStatus === 2 && !formData.reason.trim()) {
//       toast.error("Reason is required when canceling a request");
//       return;
//     }
//     try {
//       await RequestService.UpdateRequestStatusById(
//         currentItem.id,
//         requestStatus,
//         formData.reason
//       );
//       const updatedRequests = requests.map((req) =>
//         req.id === currentItem.id
//           ? { ...req, statusRequest: formData.status, reason: formData.reason }
//           : req
//       );
//       setRequests(updatedRequests);
//       toast.success("Request status updated successfully!");
//       handleCloseModal();
//     } catch (error) {
//       toast.error("Failed to update request status");
//       console.error("Update error:", error);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteReason.trim()) {
//       toast.error("Reason is required when deleting a request");
//       return;
//     }
//     try {
//       await RequestService.DeleteRequestByRequestId(deleteItemId, deleteReason);
//       setRequests(requests.filter((req) => req.id !== deleteItemId));
//       toast.success("Request deleted successfully!");
//       handleCloseDeleteModal();
//     } catch (error) {
//       toast.error("Failed to delete request");
//       console.error("Delete error:", error);
//     }
//   };

//   const handleSort = (field) => {
//     setSortRequest((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPageRequest(1);
//   };

//   const handlePageChange = (page) => setCurrentPageRequest(page);
//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPageRequest(1);
//   };

//   const handleServiceFilterChange = (value) => {
//     setSelectedService(value);
//     setCurrentPageRequest(1);
//   };

//   const serviceMenu = (
//     <Menu onClick={({ key }) => handleServiceFilterChange(key)}>
//       <Menu.Item key="All">All Services</Menu.Item>
//       <Menu.Item key="S001">Hire Costume</Menu.Item>
//       <Menu.Item key="S002">Hire Cosplayer</Menu.Item>
//       <Menu.Item key="S003">Event Organization</Menu.Item>
//     </Menu>
//   );

//   if (loading) return <div>Loading requests...</div>;

//   return (
//     <div className="manage-general">
//       <h2 className="manage-general-title">Manage Requests</h2>
//       <div className="table-container">
//         <Card className="status-table-card">
//           <Card.Body>
//             <div className="table-header">
//               <h3>Requests</h3>
//               <div style={{ display: "flex", gap: "10px" }}>
//                 <Form.Control
//                   type="text"
//                   placeholder="Search requests..."
//                   value={searchRequest}
//                   onChange={(e) => setSearchRequest(e.target.value)}
//                   className="search-input"
//                 />
//                 <Dropdown overlay={serviceMenu}>
//                   <Button>
//                     {selectedService === "All"
//                       ? "All Services"
//                       : selectedService === "S001"
//                       ? "Hire Costume"
//                       : selectedService === "S002"
//                       ? "Hire Cosplayer"
//                       : "Event Organization"}{" "}
//                     ▼
//                   </Button>
//                 </Dropdown>
//               </div>
//             </div>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th onClick={() => handleSort("name")}>
//                     Name{" "}
//                     {sortRequest.field === "name" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("description")}>
//                     Description{" "}
//                     {sortRequest.field === "description" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th>Location</th>
//                   <th onClick={() => handleSort("price")}>
//                     Price{" "}
//                     {sortRequest.field === "price" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("statusRequest")}>
//                     Status{" "}
//                     {sortRequest.field === "statusRequest" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("startDate")}>
//                     Start Date{" "}
//                     {sortRequest.field === "startDate" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("endDate")}>
//                     End Date{" "}
//                     {sortRequest.field === "endDate" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th onClick={() => handleSort("reason")}>
//                     Reason{" "}
//                     {sortRequest.field === "reason" &&
//                       (sortRequest.order === "asc" ? (
//                         <ArrowUp size={16} />
//                       ) : (
//                         <ArrowDown size={16} />
//                       ))}
//                   </th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedRequests.length > 0 ? (
//                   paginatedRequests.map((req) => (
//                     <tr key={req.id}>
//                       <td>{req.name}</td>
//                       <td>{req.description}</td>
//                       <td>{req.location}</td>
//                       <td>{req.price.toLocaleString()}</td>
//                       <td>{req.statusRequest}</td>
//                       <td>{req.startDate}</td>
//                       <td>{req.endDate}</td>
//                       <td>{req.reason}</td>
//                       <td>
//                         {req.statusRequest === "Pending" ? (
//                           <Button
//                             type="primary"
//                             size="small"
//                             onClick={() => handleShowModal(req)}
//                             style={{ marginRight: "8px" }}
//                           >
//                             Edit
//                           </Button>
//                         ) : (
//                           <Button
//                             type="primary"
//                             size="small"
//                             disabled
//                             style={{ marginRight: "8px" }}
//                           >
//                             Edit
//                           </Button>
//                         )}
//                         <Button
//                           size="small"
//                           onClick={() => handleShowViewModal(req.id)}
//                           style={{ marginRight: "8px" }}
//                         >
//                           View
//                         </Button>
//                         <Button
//                           type="primary"
//                           danger
//                           size="small"
//                           onClick={() => handleShowDeleteModal(req.id)}
//                         >
//                           Delete
//                         </Button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="text-center">
//                       No requests found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//             <PaginationControls
//               currentPage={currentPageRequest}
//               totalPages={totalPagesRequest}
//               onPageChange={handlePageChange}
//               rowsPerPage={rowsPerPage}
//               onRowsPerPageChange={handleRowsPerPageChange}
//               rowsPerPageOptions={rowsPerPageOptions}
//               totalEntries={totalEntries}
//               showingEntries={paginatedRequests.length}
//             />
//           </Card.Body>
//         </Card>
//       </div>

//       <Modal
//         title="Edit Request Status"
//         open={showModal}
//         onCancel={handleCloseModal}
//         footer={[
//           <Button key="cancel" onClick={handleCloseModal}>
//             Cancel
//           </Button>,
//           <Button
//             key="submit"
//             type="primary"
//             onClick={handleSubmit}
//             disabled={formData.status === "Cancel" && !formData.reason.trim()}
//           >
//             Update
//           </Button>,
//         ]}
//       >
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-2">
//             <Form.Label>Status</Form.Label>
//             <Form.Select
//               name="status"
//               value={formData.status}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select Status</option>
//               <option value="Browsed">Browsed ✅</option>
//               <option value="Cancel">Cancel ❌</option>
//             </Form.Select>
//           </Form.Group>
//           {formData.status === "Cancel" && (
//             <Form.Group className="mb-2">
//               <Form.Label>Reason</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="reason"
//                 value={formData.reason}
//                 onChange={handleInputChange}
//                 placeholder="Enter reason for cancellation"
//                 required
//               />
//             </Form.Group>
//           )}
//         </Form>
//       </Modal>

//       <Modal
//         title="Delete Request"
//         open={showDeleteModal}
//         onCancel={handleCloseDeleteModal}
//         footer={[
//           <Button key="cancel" onClick={handleCloseDeleteModal}>
//             Cancel
//           </Button>,
//           <Button
//             key="delete"
//             type="primary"
//             danger
//             onClick={handleDelete}
//             disabled={!deleteReason.trim()}
//           >
//             Delete
//           </Button>,
//         ]}
//       >
//         <Form>
//           <Form.Group className="mb-2">
//             <Form.Label>Reason for Deletion</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               value={deleteReason}
//               onChange={(e) => setDeleteReason(e.target.value)}
//               placeholder="Enter reason for deletion"
//               required
//             />
//           </Form.Group>
//         </Form>
//       </Modal>

//       <Modal
//         title="Request Details"
//         open={showViewModal}
//         onCancel={handleCloseViewModal}
//         footer={[
//           <Button key="close" onClick={handleCloseViewModal}>
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
//                   <strong>Start Date:</strong>
//                 </Form.Label>
//                 <Input value={viewData.startDate} readOnly />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   <strong>End Date:</strong>
//                 </Form.Label>
//                 <Input value={viewData.endDate} readOnly />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   <strong>Location:</strong>
//                 </Form.Label>
//                 <Input value={viewData.location} readOnly />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   <strong>Description:</strong>
//                 </Form.Label>
//                 <TextArea value={viewData.description} readOnly rows={4} />
//               </Form.Group>
//               {viewData.deposit && (
//                 <Form.Group className="mb-3">
//                   <Form.Label>
//                     <strong>Deposit:</strong>
//                   </Form.Label>
//                   <Input value={viewData.deposit} readOnly suffix="%" />
//                 </Form.Group>
//               )}
//               {viewData.listRequestCharacters?.length > 0 && (
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
//                               )} hours × ${item.salaryIndex} VND/h) + (${
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
//                 viewData.listRequestCharacters?.length === 0 && (
//                   <p>No characters requested.</p>
//                 )}
//               <p>
//                 <strong>Total Price:</strong>{" "}
//                 <strong>{viewData.price.toLocaleString()} VND</strong>
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
//   onPageChange,
//   rowsPerPage,
//   onRowsPerPageChange,
//   rowsPerPageOptions,
//   totalEntries,
//   showingEntries,
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

// export default ManageRequest;

///========================================== tích hợp api check

import React, { useState, useEffect } from "react";
import { Table, Form, Card } from "react-bootstrap";
import {
  Button,
  Modal,
  Dropdown,
  Pagination,
  Image,
  Menu,
  Tooltip,
  Input,
} from "antd";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../../../styles/Manager/ManageRequest.scss";
import RequestService from "../../../services/ManageServicePages/ManageRequestService/RequestService.js";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
dayjs.extend(minMax);

const { TextArea } = Input;

const ManageRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ status: "", reason: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [searchRequest, setSearchRequest] = useState("");
  const [sortRequest, setSortRequest] = useState({
    field: "statusRequest",
    order: "asc",
  });
  const [currentPageRequest, setCurrentPageRequest] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 50];
  const [selectedService, setSelectedService] = useState("All");
  const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
  const charactersPerPage = 2;
  const [cosplayerData, setCosplayerData] = useState({});
  const [tooltipLoading, setTooltipLoading] = useState({});

  // Hàm tạo dữ liệu mock cho ngày tháng
  const generateMockDates = () => {
    const currentDate = dayjs(); // Ngày hiện tại: 19/04/2025
    const mockStartDate = currentDate.add(1, "day").format("DD/MM/YYYY"); // Ngày mai: 20/04/2025
    const mockEndDate = currentDate.add(3, "day").format("DD/MM/YYYY"); // 3 ngày sau: 22/04/2025
    return { startDate: mockStartDate, endDate: mockEndDate };
  };

  // Hàm tính khoảng thời gian ngày đầu và ngày cuối từ requestDateResponses
  const getRequestDateRange = (charactersListResponse) => {
    const allDates = [];
    charactersListResponse?.forEach((char) => {
      (char.requestDateResponses || []).forEach((date) => {
        allDates.push(dayjs(date.startDate, "HH:mm DD/MM/YYYY"));
        allDates.push(dayjs(date.endDate, "HH:mm DD/MM/YYYY"));
      });
    });

    if (allDates.length === 0) {
      // Nếu không có dữ liệu ngày, trả về dữ liệu mock
      return generateMockDates();
    }

    const startDate = dayjs.min(allDates).format("DD/MM/YYYY");
    const endDate = dayjs.max(allDates).format("DD/MM/YYYY");

    return { startDate, endDate };
  };

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

  const calculateCosplayerPrice = (
    salaryIndex,
    characterPrice,
    quantity,
    totalHours,
    totalDays
  ) => {
    if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
    return (totalHours * salaryIndex + totalDays * characterPrice) * quantity;
  };

  const fetchCosplayerData = async (cosplayerId) => {
    if (!cosplayerId || cosplayerData[cosplayerId]) return;
    try {
      setTooltipLoading((prev) => ({ ...prev, [cosplayerId]: true }));
      const response =
        await RequestService.getNameCosplayerInRequestByCosplayerId(
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
    const fetchRequests = async () => {
      try {
        const data = await RequestService.getAllRequests();
        const formattedData = data.map((req) => {
          const { startDate, endDate } = req.charactersListResponse
            ? getRequestDateRange(req.charactersListResponse)
            : req.startDate && req.endDate
            ? { startDate: req.startDate, endDate: req.endDate }
            : generateMockDates(); // Sử dụng mock nếu không có dữ liệu

          return {
            id: req.requestId,
            serviceId: req.serviceId || "Unknown",
            name: req.name || "N/A",
            description: req.description || "N/A",
            location: req.location || "N/A",
            price: req.price || 0,
            statusRequest: mapStatus(req.status),
            startDate,
            endDate,
            reason: req.reason || "",
          };
        });
        setRequests(formattedData);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch requests from API");
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const mapStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Pending";
      case "Browsed":
        return "Browsed";
      case "Cancel":
        return "Cancel";
      default:
        return "Unknown";
    }
  };

  const mapStatusToNumber = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Browsed":
        return 1;
      case "Cancel":
        return 2;
      default:
        return 0;
    }
  };

  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (selectedService !== "All") {
      filtered = filtered.filter((item) => item.serviceId === selectedService);
    }
    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return filtered.sort((a, b) => {
      let valueA = a[sort.field];
      let valueB = b[sort.field];

      if (sort.field === "price") {
        valueA = valueA || 0;
        valueB = valueB || 0;
        return sort.order === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (sort.field === "startDate" || sort.field === "endDate") {
        valueA = dayjs(valueA, "DD/MM/YYYY"); // Không cần kiểm tra N/A vì đã thay thế
        valueB = dayjs(valueB, "DD/MM/YYYY");
        return sort.order === "asc" ? valueA.diff(valueB) : valueB.diff(valueA);
      }

      valueA = valueA ? String(valueA).toLowerCase() : "";
      valueB = valueB ? String(valueB).toLowerCase() : "";
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredRequests = filterAndSortData(
    requests,
    searchRequest,
    sortRequest
  );
  const totalPagesRequest = Math.ceil(filteredRequests.length / rowsPerPage);
  const paginatedRequests = paginateData(filteredRequests, currentPageRequest);
  const totalEntries = filteredRequests.length;

  function paginateData(data, page, perPage = rowsPerPage) {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
  }

  const handleShowModal = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setFormData({ status: item.statusRequest, reason: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentItem(null);
    setFormData({ status: "", reason: "" });
  };

  const handleShowDeleteModal = (id) => {
    setDeleteItemId(id);
    setDeleteReason("");
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteItemId(null);
    setDeleteReason("");
  };

  const handleShowViewModal = async (id) => {
    try {
      const data = await RequestService.getRequestByRequestId(id);
      if (!data) {
        throw new Error("Request data not found");
      }

      const request = requests.find((req) => req.id === id);
      const serviceId = request?.serviceId;

      const { startDate, endDate } = data.charactersListResponse
        ? getRequestDateRange(data.charactersListResponse)
        : data.startDate && data.endDate
        ? { startDate: data.startDate, endDate: data.endDate }
        : generateMockDates();

      if (serviceId === "S001") {
        const characters = data.charactersListResponse || [];
        const formattedData = {
          name: data.name || "N/A",
          description: data.description || "N/A",
          startDate: startDate,
          endDate: endDate,
          location: data.location || "N/A",
          characters: characters.map((char) => ({
            characterId: char.characterId,
            maxHeight: char.maxHeight || 0,
            maxWeight: char.maxWeight || 0,
            minHeight: char.minHeight || 0,
            minWeight: char.minWeight || 0,
            quantity: char.quantity || 0,
            urlImage: char.characterImages?.[0]?.urlImage || "",
            description: char.description || "",
          })),
        };
        setViewData(formattedData);
      } else if (serviceId === "S002") {
        const formattedData = {
          name: data.name || "N/A",
          description: data.description || "N/A",
          location: data.location || "N/A",
          deposit: data.deposit || "N/A",
          listRequestCharacters: [],
          price: 0,
          status: mapStatus(data.status),
          reason: data.reason || null,
          startDate: startDate,
          endDate: endDate,
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

              const characterData = await RequestService.getCharacterById(
                char.characterId
              );
              characterName = characterData?.characterName || "Unknown";
              characterPrice = characterData?.price || 0;

              if (char.cosplayerId) {
                try {
                  const cosplayerData =
                    await RequestService.getNameCosplayerInRequestByCosplayerId(
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

              const price = calculateCosplayerPrice(
                salaryIndex,
                characterPrice,
                char.quantity || 1,
                totalHours,
                totalDays
              );

              return {
                cosplayerId: char.cosplayerId || null,
                characterId: char.characterId,
                cosplayerName,
                characterName,
                characterPrice,
                quantity: char.quantity || 1,
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
      } else {
        const formattedData = {
          id: data.requestId,
          name: data.name || "N/A",
          description: data.description || "N/A",
          price: 0,
          status: mapStatus(data.status),
          startDate: startDate,
          endDate: endDate,
          location: data.location || "N/A",
          listRequestCharacters: [],
        };

        let packagePrice = 0;
        if (serviceId === "S003" && data.packageId) {
          try {
            const packageData = await RequestService.getPackageById(
              data.packageId
            );
            packagePrice = packageData?.price || 0;
          } catch (error) {
            console.warn(
              `Failed to fetch package for ID ${data.packageId}:`,
              error
            );
          }
        }

        const charactersList = data.charactersListResponse || [];
        let totalCharactersPrice = 0;

        if (charactersList.length > 0) {
          const listRequestCharacters = await Promise.all(
            charactersList.map(async (char) => {
              let cosplayerName = "Not Assigned";
              let salaryIndex = 1;
              let characterPrice = 0;
              let characterName = "Unknown";

              try {
                const characterData = await RequestService.getCharacterById(
                  char.characterId
                );
                characterName = characterData?.characterName || "Unknown";
                characterPrice = characterData?.price || 0;
              } catch (error) {
                console.warn(
                  `Failed to fetch character for ID ${char.characterId}:`,
                  error
                );
              }

              if (char.cosplayerId) {
                try {
                  const cosplayerData =
                    await RequestService.getNameCosplayerInRequestByCosplayerId(
                      char.cosplayerId
                    );
                  cosplayerName = cosplayerData?.name || "Not Assigned";
                  salaryIndex = cosplayerData?.salaryIndex || 1;
                } catch (error) {
                  console.warn(
                    `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
                    error
                  );
                }
              }

              const price = characterPrice * (char.quantity || 0) * salaryIndex;
              totalCharactersPrice += price;

              return {
                cosplayerId: char.cosplayerId || null,
                characterId: char.characterId,
                cosplayerName,
                characterName,
                quantity: char.quantity || 0,
                salaryIndex,
                price,
              };
            })
          );

          formattedData.listRequestCharacters = listRequestCharacters;
        }

        formattedData.price = packagePrice + totalCharactersPrice;
        setViewData(formattedData);
      }
      setShowViewModal(true);
      setCurrentCharacterPage(1);
    } catch (error) {
      toast.error("Failed to fetch request details");
      console.error("Error in handleShowViewModal:", error);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewData(null);
    setCosplayerData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Trong file ManageRequest.js, cập nhật hàm handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestStatus = mapStatusToNumber(formData.status);
    if (requestStatus === 2 && !formData.reason.trim()) {
      toast.error("Reason is required when canceling a request");
      return;
    }
    try {
      // Gọi hàm checkAndUpdateRequestStatus
      const result = await RequestService.checkAndUpdateRequestStatus(
        currentItem.id,
        requestStatus,
        formData.reason
      );

      if (result.success) {
        // Cập nhật danh sách requests nếu thành công
        const updatedRequests = requests.map((req) =>
          req.id === currentItem.id
            ? {
                ...req,
                statusRequest: formData.status,
                reason: formData.reason,
              }
            : req
        );
        setRequests(updatedRequests);
        toast.success(result.message);
        handleCloseModal();
      } else {
        // Hiển thị thông báo lỗi nếu không thể cập nhật
        toast.error(result.message, { autoClose: 5000 });
      }
    } catch (error) {
      toast.error(error.message || "Failed to update request status");
      console.error("Update error:", error);
    }
  };
  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      toast.error("Reason is required when deleting a request");
      return;
    }
    try {
      await RequestService.DeleteRequestByRequestId(deleteItemId, deleteReason);
      setRequests(requests.filter((req) => req.id !== deleteItemId));
      toast.success("Request deleted successfully!");
      handleCloseDeleteModal();
    } catch (error) {
      toast.error("Failed to delete request");
      console.error("Delete error:", error);
    }
  };

  const handleSort = (field) => {
    setSortRequest((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPageRequest(1);
  };

  const handlePageChange = (page) => setCurrentPageRequest(page);
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPageRequest(1);
  };

  const handleServiceFilterChange = (value) => {
    setSelectedService(value);
    setCurrentPageRequest(1);
  };

  const serviceMenu = (
    <Menu onClick={({ key }) => handleServiceFilterChange(key)}>
      <Menu.Item key="All">All Services</Menu.Item>
      <Menu.Item key="S001">Hire Costume</Menu.Item>
      <Menu.Item key="S002">Hire Cosplayer</Menu.Item>
      <Menu.Item key="S003">Event Organization</Menu.Item>
    </Menu>
  );

  if (loading) return <div>Loading requests...</div>;

  return (
    <div className="manage-general">
      <h2 className="manage-general-title">Manage Requests</h2>
      <div className="table-container">
        <Card className="status-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Requests</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Control
                  type="text"
                  placeholder="Search requests..."
                  value={searchRequest}
                  onChange={(e) => setSearchRequest(e.target.value)}
                  className="search-input"
                />
                <Dropdown overlay={serviceMenu}>
                  <Button>
                    {selectedService === "All"
                      ? "All Services"
                      : selectedService === "S001"
                      ? "Hire Costume"
                      : selectedService === "S002"
                      ? "Hire Cosplayer"
                      : "Event Organization"}{" "}
                    ▼
                  </Button>
                </Dropdown>
              </div>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")}>
                    Name{" "}
                    {sortRequest.field === "name" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th onClick={() => handleSort("description")}>
                    Description{" "}
                    {sortRequest.field === "description" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th>Location</th>
                  <th onClick={() => handleSort("price")}>
                    Price{" "}
                    {sortRequest.field === "price" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th onClick={() => handleSort("statusRequest")}>
                    Status{" "}
                    {sortRequest.field === "statusRequest" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th onClick={() => handleSort("startDate")}>
                    Start Date{" "}
                    {sortRequest.field === "startDate" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th onClick={() => handleSort("endDate")}>
                    End Date{" "}
                    {sortRequest.field === "endDate" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th onClick={() => handleSort("reason")}>
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
                      <td>{req.price.toLocaleString()}</td>
                      <td>{req.statusRequest}</td>
                      <td>{req.startDate}</td>
                      <td>{req.endDate}</td>
                      <td>{req.reason}</td>
                      <td>
                        {req.statusRequest === "Pending" ? (
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleShowModal(req)}
                            style={{ marginRight: "8px" }}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            size="small"
                            disabled
                            style={{ marginRight: "8px" }}
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          size="small"
                          onClick={() => handleShowViewModal(req.id)}
                          style={{ marginRight: "8px" }}
                        >
                          View
                        </Button>
                        <Button
                          type="primary"
                          danger
                          size="small"
                          onClick={() => handleShowDeleteModal(req.id)}
                        >
                          Delete
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
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={rowsPerPageOptions}
              totalEntries={totalEntries}
              showingEntries={paginatedRequests.length}
            />
          </Card.Body>
        </Card>
      </div>

      <Modal
        title="Edit Request Status"
        open={showModal}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            disabled={formData.status === "Cancel" && !formData.reason.trim()}
          >
            Update
          </Button>,
        ]}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Browsed">Browsed ✅</option>
              <option value="Cancel">Cancel ❌</option>
            </Form.Select>
          </Form.Group>
          {formData.status === "Cancel" && (
            <Form.Group className="mb-2">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Enter reason for cancellation"
                required
              />
            </Form.Group>
          )}
        </Form>
      </Modal>

      <Modal
        title="Delete Request"
        open={showDeleteModal}
        onCancel={handleCloseDeleteModal}
        footer={[
          <Button key="cancel" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={handleDelete}
            disabled={!deleteReason.trim()}
          >
            Delete
          </Button>,
        ]}
      >
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Reason for Deletion</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Enter reason for deletion"
              required
            />
          </Form.Group>
        </Form>
      </Modal>

      <Modal
        title="Request Details"
        open={showViewModal}
        onCancel={handleCloseViewModal}
        footer={[
          <Button key="close" onClick={handleCloseViewModal}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {viewData ? (
          viewData.characters ? (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control value={viewData.name} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control value={viewData.startDate} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control value={viewData.endDate} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control value={viewData.location} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={viewData.description}
                  readOnly
                />
              </Form.Group>
              <h5>Costumes</h5>
              {viewData.characters.length === 0 ? (
                <p>No costumes found.</p>
              ) : (
                <>
                  {paginateData(
                    viewData.characters,
                    currentCharacterPage,
                    charactersPerPage
                  ).map((char) => (
                    <Card key={char.characterId} className="mb-3">
                      <Card.Body>
                        <div className="row">
                          <div className="col-md-6">
                            <Form.Group className="mb-3">
                              <Form.Label>Character ID</Form.Label>
                              <Form.Control value={char.characterId} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Description</Form.Label>
                              <Form.Control value={char.description} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Max Height (cm)</Form.Label>
                              <Form.Control
                                type="number"
                                value={char.maxHeight}
                                readOnly
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Max Weight (kg)</Form.Label>
                              <Form.Control
                                type="number"
                                value={char.maxWeight}
                                readOnly
                              />
                            </Form.Group>
                          </div>
                          <div className="col-md-6">
                            <Form.Group className="mb-3">
                              <Form.Label>Min Height (cm)</Form.Label>
                              <Form.Control
                                type="number"
                                value={char.minHeight}
                                readOnly
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Min Weight (kg)</Form.Label>
                              <Form.Control
                                type="number"
                                value={char.minWeight}
                                readOnly
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Quantity</Form.Label>
                              <Form.Control
                                type="number"
                                value={char.quantity}
                                readOnly
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
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                  <Pagination
                    current={currentCharacterPage}
                    pageSize={charactersPerPage}
                    total={viewData.characters.length}
                    onChange={(page) => setCurrentCharacterPage(page)}
                    showSizeChanger={false}
                    style={{ textAlign: "right" }}
                  />
                </>
              )}
            </div>
          ) : (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Name:</strong>
                </Form.Label>
                <Input value={viewData.name} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Start Date:</strong>
                </Form.Label>
                <Input value={viewData.startDate} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>End Date:</strong>
                </Form.Label>
                <Input value={viewData.endDate} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Location:</strong>
                </Form.Label>
                <Input value={viewData.location} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Description:</strong>
                </Form.Label>
                <TextArea value={viewData.description} readOnly rows={4} />
              </Form.Group>
              {viewData.deposit && (
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>Deposit:</strong>
                  </Form.Label>
                  <Input value={viewData.deposit} readOnly suffix="%" />
                </Form.Group>
              )}
              {viewData.listRequestCharacters?.length > 0 && (
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
                                          {
                                            cosplayerData[item.cosplayerId]
                                              .email
                                          }
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
                              <strong>Status: </strong> &nbsp;
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
                                <strong>
                                  {item.price.toLocaleString()} VND
                                </strong>
                              </p>
                            </Tooltip>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {!viewData.characters &&
                viewData.listRequestCharacters?.length === 0 && (
                  <p>No characters requested.</p>
                )}
              <p>
                <strong>Total Price:</strong>{" "}
                <strong>{viewData.price.toLocaleString()} VND</strong>
              </p>
              {viewData.status === "Cancel" && viewData.reason && (
                <h4 className="reason-text">
                  <strong>Reason:</strong>{" "}
                  <span style={{ color: "red" }}>{viewData.reason}</span>
                </h4>
              )}
            </div>
          )
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions,
  totalEntries,
  showingEntries,
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

export default ManageRequest;
