/////// fix chọn cosplayer có requestCharacterId cùng characterId > 1
// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Spinner,
//   Alert,
//   Tabs,
//   Tab,
// } from "react-bootstrap";
// import { Select, notification } from "antd";
// import { Save, Eye } from "lucide-react";
// import ManageAssignTaskService from "../../../services/ManageServicePages/ManageAssignTaskService/ManageAssignTaskService.js";
// import "../../../styles/Manager/ManageAssignTask.scss";
// import dayjs from "dayjs";

// const { Option } = Select;

// const formatDate = (date) => {
//   if (!date || date === "null" || date === "undefined" || date === "") {
//     return "N/A";
//   }
//   if (dayjs.isDayjs(date)) {
//     return date.format("DD/MM/YYYY");
//   }
//   const formats = [
//     "DD/MM/YYYY",
//     "HH:mm DD/MM/YYYY",
//     "YYYY-MM-DD",
//     "YYYY/MM/DD",
//     "MM/DD/YYYY",
//     "HH:mm DD-MM-YYYY",
//     "D/M/YYYY",
//     "DD/M/YYYY",
//     "D/MM/YYYY",
//     "HH:mm DD/MM/YYYY Z",
//     "YYYY-MM-DDTHH:mm:ss",
//   ];
//   const parsedDate = dayjs(date, formats, true);
//   return parsedDate.isValid()
//     ? parsedDate.format("DD/MM/YYYY")
//     : "Invalid Date";
// };

// const ManageAssignTask = () => {
//   const [requests, setRequests] = useState([]);
//   const [assignedRequests, setAssignedRequests] = useState([]);
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [cosplayersByRequestCharacter, setCosplayersByRequestCharacter] =
//     useState({});
//   const [assignments, setAssignments] = useState(new Map());
//   const [selectedCosplayers, setSelectedCosplayers] = useState(new Set());
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [preferredCosplayer, setPreferredCosplayer] = useState(null);
//   const [activeTab, setActiveTab] = useState("pending");
//   const [isViewingAssigned, setIsViewingAssigned] = useState(false);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       setIsLoading(true);
//       setError("");
//       try {
//         const allRequests = await ManageAssignTaskService.getAllRequests();
//         const filteredRequests = allRequests.filter(
//           (req) => req.serviceId === "S003" && req.status === "Browsed"
//         );

//         const pendingRequests = [];
//         const assignedRequests = [];

//         for (const req of filteredRequests) {
//           try {
//             const requestDetails =
//               await ManageAssignTaskService.getRequestByRequestId(
//                 req.requestId
//               );
//             const hasUnassignedCharacter =
//               requestDetails.charactersListResponse.some(
//                 (character) => character.cosplayerId === null
//               );

//             if (hasUnassignedCharacter) {
//               pendingRequests.push(requestDetails);
//             } else {
//               assignedRequests.push(requestDetails);
//             }
//           } catch (error) {
//             console.error(`Error fetching request ${req.requestId}:`, error);
//           }
//         }

//         if (pendingRequests.length === 0 && activeTab === "pending") {
//           setError("Not found any request To assign task.");
//         }

//         setRequests(pendingRequests);
//         setAssignedRequests(assignedRequests);
//       } catch (error) {
//         setError("Lỗi khi tải danh sách request.");
//         console.error("Error fetching requests:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [activeTab]);

//   const handleAssignTaskClick = async (request) => {
//     setSelectedRequest(request);
//     setAssignments(new Map());
//     setCosplayersByRequestCharacter({});
//     setSelectedCosplayers(new Set());
//     setPreferredCosplayer(null);
//     setError("");
//     setIsLoading(true);
//     setIsViewingAssigned(false);

//     try {
//       const requestDetails =
//         await ManageAssignTaskService.getRequestByRequestId(request.requestId);

//       if (!requestDetails.charactersListResponse?.length) {
//         setError("Request không có nhân vật nào.");
//         setIsLoading(false);
//         return;
//       }

//       const cosplayersMap = {};
//       let hasAvailableCosplayers = false;

//       for (const character of requestDetails.charactersListResponse) {
//         if (character.cosplayerId !== null) {
//           cosplayersMap[character.requestCharacterId] = [];
//           continue;
//         }

//         const dates = character.requestDateResponses.map((date) => ({
//           startDate: date.startDate,
//           endDate: date.endDate,
//         }));

//         if (dates.length === 0) {
//           setError(
//             `Không tìm thấy ngày yêu cầu cho nhân vật ${
//               character.characterName || character.characterId
//             }`
//           );
//           cosplayersMap[character.requestCharacterId] = [];
//           continue;
//         }

//         let cosplayers = [];
//         try {
//           if (preferredCosplayer) {
//             const response = await ManageAssignTaskService.ChangeCosplayerFree({
//               characterId: character.characterId,
//               dates,
//               accountId: preferredCosplayer.accountId,
//             });
//             if (response && response.length > 0) {
//               cosplayers.push(response[0]);
//             }
//           }

//           const response = await ManageAssignTaskService.ChangeCosplayerFree({
//             characterId: character.characterId,
//             dates,
//           });

//           const uniqueCosplayers = new Map();
//           [...cosplayers, ...(response || [])].forEach((cosplayer) => {
//             if (!uniqueCosplayers.has(cosplayer.accountId)) {
//               uniqueCosplayers.set(cosplayer.accountId, {
//                 accountId: cosplayer.accountId,
//                 name: cosplayer.name,
//                 height: cosplayer.height ?? 0,
//                 weight: cosplayer.weight ?? 0,
//                 averageStar:
//                   cosplayer.averageStar || cosplayer.salaryIndex || "N/A",
//               });
//             }
//           });

//           cosplayers = Array.from(uniqueCosplayers.values());
//           cosplayers.sort(
//             (a, b) => (b.averageStar || 0) - (a.averageStar || 0)
//           );

//           const requiredQuantity = character.quantity || 1;
//           if (cosplayers.length < requiredQuantity) {
//             setError(
//               `Not enough cosplayer for character ${
//                 character.characterName || character.characterId
//               }. Need ${requiredQuantity} cosplayer, Only have ${
//                 cosplayers.length
//               }.`
//             );
//           } else {
//             hasAvailableCosplayers = true;
//           }

//           cosplayersMap[character.requestCharacterId] = cosplayers;
//         } catch (error) {
//           console.error(
//             `Lỗi khi lấy cosplayer cho ${character.characterId}:`,
//             error
//           );
//           cosplayersMap[character.requestCharacterId] = [];
//         }
//       }

//       setCosplayersByRequestCharacter(cosplayersMap);

//       if (
//         !hasAvailableCosplayers &&
//         requestDetails.charactersListResponse.every(
//           (c) => c.cosplayerId !== null
//         )
//       ) {
//         setError("Tất cả nhân vật trong yêu cầu này đã được gán cosplayer.");
//       } else if (!hasAvailableCosplayers) {
//         setError("Không có cosplayer nào khả dụng cho các nhân vật chưa gán.");
//       }
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//           "Lỗi khi tải cosplayer hoặc chi tiết request."
//       );
//       console.error("Error in handleAssignTaskClick:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleViewAssignedRequest = (request) => {
//     setSelectedRequest(request);
//     setAssignments(new Map());
//     setCosplayersByRequestCharacter({});
//     setSelectedCosplayers(new Set());
//     setPreferredCosplayer(null);
//     setError("");
//     setIsViewingAssigned(true);
//   };

//   const handleCloseView = () => {
//     setSelectedRequest(null);
//     setIsViewingAssigned(false);
//   };

//   const handleAssignment = useCallback(
//     (requestCharacterId, cosplayerIds) => {
//       setAssignments((prev) => {
//         const newAssignments = new Map(prev);
//         const selectedCosplayerSet = new Set();
//         prev.forEach((cosplayers) => {
//           cosplayers.forEach((cosplayerId) =>
//             selectedCosplayerSet.add(cosplayerId)
//           );
//         });

//         // Loại bỏ cosplayer trùng trong cùng requestCharacterId
//         const uniqueCosplayerIds = [...new Set(cosplayerIds)].filter(
//           (cosplayerId) =>
//             !selectedCosplayerSet.has(cosplayerId) ||
//             cosplayerIds.includes(cosplayerId)
//         );
//         newAssignments.set(requestCharacterId, uniqueCosplayerIds);

//         if (!preferredCosplayer && uniqueCosplayerIds.length > 0) {
//           const selectedCosplayer = cosplayersByRequestCharacter[
//             requestCharacterId
//           ]?.find((c) => c.accountId === uniqueCosplayerIds[0]);
//           setPreferredCosplayer(selectedCosplayer || null);
//         }

//         setSelectedCosplayers((prev) => {
//           const newSet = new Set();
//           newAssignments.forEach((cosplayers) => {
//             cosplayers.forEach((cosplayerId) => newSet.add(cosplayerId));
//           });
//           return newSet;
//         });

//         return newAssignments;
//       });
//     },
//     [cosplayersByRequestCharacter, preferredCosplayer]
//   );

//   const handleSubmit = useCallback(async () => {
//     if (!selectedRequest) return;

//     setIsLoading(true);
//     try {
//       for (const character of selectedRequest.charactersListResponse) {
//         const cosplayerIds =
//           assignments.get(character.requestCharacterId) || [];
//         const requiredQuantity = character.quantity || 1;
//         if (
//           character.cosplayerId === null &&
//           cosplayerIds.length !== requiredQuantity
//         ) {
//           throw new Error(
//             `Character ${
//               character.characterName || character.characterId
//             } Need ${requiredQuantity} cosplayer,  ${cosplayerIds.length}.`
//           );
//         }
//       }

//       const tasksToSubmit = [];
//       assignments.forEach((cosplayerIds, requestCharacterId) => {
//         cosplayerIds.forEach((cosplayerId) => {
//           tasksToSubmit.push({
//             cosplayerId,
//             requestCharacterId,
//           });
//         });
//       });

//       await ManageAssignTaskService.assignTask(
//         selectedRequest.requestId,
//         tasksToSubmit
//       );

//       notification.success({
//         message: "Success",
//         description: "Assign task successfully!",
//       });

//       setRequests((prev) =>
//         prev.filter((req) => req.requestId !== selectedRequest.requestId)
//       );
//       setAssignedRequests((prev) => [...prev, selectedRequest]);
//       setSelectedRequest(null);
//       setAssignments(new Map());
//       setCosplayersByRequestCharacter({});
//       setSelectedCosplayers(new Set());
//       setPreferredCosplayer(null);
//       setIsViewingAssigned(false);
//     } catch (error) {
//       notification.error({
//         message: "Lỗi",
//         description: error.response?.data?.message || "Lỗi khi phân công task",
//       });
//       console.error("Error in handleSubmit:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedRequest, assignments]);

//   const getCosplayerOptions = (requestCharacterId) => {
//     const cosplayers = cosplayersByRequestCharacter[requestCharacterId] || [];
//     if (!cosplayers.length) {
//       return [
//         {
//           value: "",
//           label: "Choose cosplayer ",
//           disabled: true,
//         },
//       ];
//     }
//     return cosplayers
//       .filter((c) => !selectedCosplayers.has(c.accountId))
//       .map((c) => ({
//         value: c.accountId,
//         label: `${c.name} (H: ${c.height}cm, W: ${c.weight}kg, Rate: ${
//           c.averageStar || "N/A"
//         })`,
//         disabled: false,
//       }));
//   };

//   const isCharacterFullyAssigned = (requestCharacterId, quantity) => {
//     const selectedCosplayers = assignments.get(requestCharacterId) || [];
//     return selectedCosplayers.length >= (quantity || 1);
//   };

//   const canSubmit = useCallback(() => {
//     if (!selectedRequest || isLoading || isViewingAssigned) return false;
//     return selectedRequest.charactersListResponse.every(
//       (character) =>
//         character.cosplayerId !== null ||
//         isCharacterFullyAssigned(
//           character.requestCharacterId,
//           character.quantity
//         )
//     );
//   }, [selectedRequest, assignments, isLoading, isViewingAssigned]);

//   return (
//     <div className="mat-page-wrapper">
//       <Container className="mat-container">
//         <h1 className="mat-title">Task Assignment Management</h1>

//         <Tabs
//           activeKey={activeTab}
//           onSelect={(key) => {
//             setActiveTab(key);
//             setSelectedRequest(null);
//             setIsViewingAssigned(false);
//           }}
//           className="mb-4"
//         >
//           <Tab eventKey="pending" title="Pending Requests">
//             {isLoading && (
//               <div className="text-center">
//                 <Spinner animation="border" />
//               </div>
//             )}

//             {error && (
//               <Alert variant="danger" className="mt-3">
//                 {error}
//               </Alert>
//             )}

//             {!isLoading && requests.length === 0 && !error && (
//               <Alert variant="info" className="mt-3">
//                 No requests need to be assigned.
//               </Alert>
//             )}

//             <Row className="mt-4">
//               {requests.map((request) => (
//                 <Col
//                   xs={12}
//                   md={6}
//                   lg={4}
//                   key={request.requestId}
//                   className="mb-4"
//                 >
//                   <Card className="mat-details-card">
//                     <Card.Body>
//                       <Card.Title>Request: {request.name}</Card.Title>
//                       <Card.Text>
//                         <strong>ID:</strong> {request.requestId}
//                         <br />
//                         <strong>Status:</strong> {request.status}
//                         <br />
//                         <strong>Time:</strong> {formatDate(request.startDate)} -{" "}
//                         {formatDate(request.endDate)}
//                         <br />
//                         <strong>Location:</strong> {request.location}
//                       </Card.Text>
//                       <Button
//                         variant="primary"
//                         onClick={() => handleAssignTaskClick(request)}
//                         disabled={isLoading}
//                         className="mat-assign-button"
//                       >
//                         Assign Task
//                       </Button>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           </Tab>
//           <Tab eventKey="assigned" title="Assigned Requests">
//             {isLoading && (
//               <div className="text-center">
//                 <Spinner animation="border" />
//               </div>
//             )}

//             {!isLoading && assignedRequests.length === 0 && (
//               <Alert variant="info" className="mt-3">
//                 No assigned requests found.
//               </Alert>
//             )}

//             <Row className="mt-4">
//               {assignedRequests.map((request) => (
//                 <Col
//                   xs={12}
//                   md={6}
//                   lg={4}
//                   key={request.requestId}
//                   className="mb-4"
//                 >
//                   <Card className="mat-details-card">
//                     <Card.Body>
//                       <Card.Title>Request: {request.name}</Card.Title>
//                       <Card.Text>
//                         <strong>ID:</strong> {request.requestId}
//                         <br />
//                         <strong>Status:</strong> {request.status}
//                         <br />
//                         <strong>Time:</strong> {formatDate(request.startDate)} -{" "}
//                         {formatDate(request.endDate)}
//                         <br />
//                         <strong>Location:</strong> {request.location}
//                       </Card.Text>
//                       <Button
//                         variant="info"
//                         onClick={() => handleViewAssignedRequest(request)}
//                         disabled={isLoading}
//                         className="mat-view-button"
//                       >
//                         <Eye size={20} className="mat-icon" /> View
//                       </Button>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           </Tab>
//         </Tabs>

//         {selectedRequest && (
//           <div className="mat-content mt-4">
//             <h3>
//               {isViewingAssigned ? "Viewing" : "Assigning to"} request:{" "}
//               {selectedRequest.name}
//             </h3>
//             <Button
//               variant="secondary"
//               onClick={handleCloseView}
//               className="mb-3"
//             >
//               Back to List
//             </Button>
//             <Row>
//               {selectedRequest.charactersListResponse.map((character) => {
//                 const quantity = character.quantity || 1;
//                 const isAssigned = character.cosplayerId !== null;
//                 return (
//                   <Col
//                     xs={12}
//                     sm={6}
//                     md={4}
//                     key={character.requestCharacterId}
//                     className="mb-4"
//                   >
//                     <Card className="mat-character-card">
//                       {character.characterImages[0]?.urlImage && (
//                         <Card.Img
//                           variant="top"
//                           src={character.characterImages[0].urlImage}
//                           alt={character.description || "Character"}
//                           className="mat-character-image"
//                         />
//                       )}
//                       <Card.Body>
//                         <Card.Title>
//                           {character.characterName || "Unnamed Character"} (Cần:{" "}
//                           {quantity} cosplayer)
//                         </Card.Title>
//                         <Card.Text>
//                           <strong>Description:</strong>{" "}
//                           {character.description || "N/A"}
//                           <br />
//                           <strong>Height:</strong> {character.minHeight}-
//                           {character.maxHeight}cm
//                           <br />
//                           <strong>Weight:</strong> {character.minWeight}-
//                           {character.maxWeight}kg
//                           <br />
//                           {isAssigned && (
//                             <>
//                               <strong>Cosplayer:</strong>{" "}
//                               {character.cosplayerId}
//                             </>
//                           )}
//                           <br />
//                           <strong>Dates:</strong>{" "}
//                           {character.requestDateResponses.map((date) => (
//                             <div key={date.requestDateId}>
//                               {date.startDate} - {date.endDate}
//                             </div>
//                           ))}
//                         </Card.Text>
//                         {!isAssigned && !isViewingAssigned && (
//                           <>
//                             {[...Array(quantity)].map((_, index) => (
//                               <Select
//                                 key={`${character.requestCharacterId}-${index}`}
//                                 placeholder={`Chọn cosplayer ${index + 1}`}
//                                 value={
//                                   assignments.get(
//                                     character.requestCharacterId
//                                   )?.[index] || ""
//                                 }
//                                 onChange={(value) => {
//                                   const currentCosplayers =
//                                     assignments.get(
//                                       character.requestCharacterId
//                                     ) || [];
//                                   const newCosplayers = [...currentCosplayers];
//                                   newCosplayers[index] = value;
//                                   handleAssignment(
//                                     character.requestCharacterId,
//                                     newCosplayers.filter(Boolean)
//                                   );
//                                 }}
//                                 options={getCosplayerOptions(
//                                   character.requestCharacterId
//                                 )}
//                                 disabled={isLoading}
//                                 showSearch
//                                 optionFilterProp="label"
//                                 className="mat-select"
//                                 style={{ width: "100%", marginBottom: "10px" }}
//                               />
//                             ))}
//                           </>
//                         )}
//                       </Card.Body>
//                       <Card.Footer
//                         className={`mat-status ${
//                           isAssigned ||
//                           isCharacterFullyAssigned(
//                             character.requestCharacterId,
//                             quantity
//                           )
//                             ? "mat-status-assigned"
//                             : "mat-status-unassigned"
//                         }`}
//                       >
//                         {isAssigned
//                           ? "Assigned"
//                           : isCharacterFullyAssigned(
//                               character.requestCharacterId,
//                               quantity
//                             )
//                           ? "Assigned"
//                           : `Unassigned (${
//                               (
//                                 assignments.get(character.requestCharacterId) ||
//                                 []
//                               ).length
//                             }/${quantity})`}
//                       </Card.Footer>
//                     </Card>
//                   </Col>
//                 );
//               })}
//             </Row>

//             {!isViewingAssigned && (
//               <div className="mat-actions mt-4">
//                 <Button
//                   variant="success"
//                   onClick={handleSubmit}
//                   disabled={!canSubmit()}
//                   className="mat-submit-button"
//                 >
//                   {isLoading ? (
//                     <Spinner animation="border" size="sm" />
//                   ) : (
//                     <>
//                       <Save size={20} className="mat-icon" /> Save Assignments
//                     </>
//                   )}
//                 </Button>
//               </div>
//             )}
//           </div>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default ManageAssignTask;

//paging
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Pagination,
} from "react-bootstrap";
import { Select, notification } from "antd";
import { Save, Eye } from "lucide-react";
import ManageAssignTaskService from "../../../services/ManageServicePages/ManageAssignTaskService/ManageAssignTaskService.js";
import "../../../styles/Manager/ManageAssignTask.scss";
import dayjs from "dayjs";

const { Option } = Select;

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
    "HH:mm DD/MM/YYYY Z",
    "YYYY-MM-DDTHH:mm:ss",
  ];
  const parsedDate = dayjs(date, formats, true);
  return parsedDate.isValid()
    ? parsedDate.format("DD/MM/YYYY")
    : "Invalid Date";
};

const ManageAssignTask = () => {
  const [requests, setRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cosplayersByRequestCharacter, setCosplayersByRequestCharacter] =
    useState({});
  const [assignments, setAssignments] = useState(new Map());
  const [selectedCosplayers, setSelectedCosplayers] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [preferredCosplayer, setPreferredCosplayer] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [isViewingAssigned, setIsViewingAssigned] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      setError("");
      try {
        const allRequests = await ManageAssignTaskService.getAllRequests();
        const filteredRequests = allRequests.filter(
          (req) => req.serviceId === "S003" && req.status === "Browsed"
        );

        const pendingRequests = [];
        const assignedRequests = [];

        for (const req of filteredRequests) {
          try {
            const requestDetails =
              await ManageAssignTaskService.getRequestByRequestId(
                req.requestId
              );
            const hasUnassignedCharacter =
              requestDetails.charactersListResponse.some(
                (character) => character.cosplayerId === null
              );

            if (hasUnassignedCharacter) {
              pendingRequests.push(requestDetails);
            } else {
              assignedRequests.push(requestDetails);
            }
          } catch (error) {
            console.error(`Error fetching request ${req.requestId}:`, error);
          }
        }

        if (pendingRequests.length === 0 && activeTab === "pending") {
          setError("Not found any request To assign task.");
        }

        setRequests(pendingRequests);
        setAssignedRequests(assignedRequests);
        setCurrentPage(1);
      } catch (error) {
        setError("Lỗi khi tải danh sách request.");
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [activeTab]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAssignedRequests = assignedRequests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(assignedRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAssignTaskClick = async (request) => {
    setSelectedRequest(request);
    setAssignments(new Map());
    setCosplayersByRequestCharacter({});
    setSelectedCosplayers(new Set());
    setPreferredCosplayer(null);
    setError("");
    setIsLoading(true);
    setIsViewingAssigned(false);

    try {
      const requestDetails =
        await ManageAssignTaskService.getRequestByRequestId(request.requestId);

      if (!requestDetails.charactersListResponse?.length) {
        setError("Request không có nhân vật nào.");
        setIsLoading(false);
        return;
      }

      const cosplayersMap = {};
      let hasAvailableCosplayers = false;

      for (const character of requestDetails.charactersListResponse) {
        if (character.cosplayerId !== null) {
          cosplayersMap[character.requestCharacterId] = [];
          continue;
        }

        const dates = character.requestDateResponses.map((date) => ({
          startDate: date.startDate,
          endDate: date.endDate,
        }));

        if (dates.length === 0) {
          setError(
            `Không tìm thấy ngày yêu cầu cho nhân vật ${
              character.characterName || character.characterId
            }`
          );
          cosplayersMap[character.requestCharacterId] = [];
          continue;
        }

        let cosplayers = [];
        try {
          if (preferredCosplayer) {
            const response = await ManageAssignTaskService.ChangeCosplayerFree({
              characterId: character.characterId,
              dates,
              accountId: preferredCosplayer.accountId,
            });
            if (response && response.length > 0) {
              cosplayers.push(response[0]);
            }
          }

          const response = await ManageAssignTaskService.ChangeCosplayerFree({
            characterId: character.characterId,
            dates,
          });

          const uniqueCosplayers = new Map();
          [...cosplayers, ...(response || [])].forEach((cosplayer) => {
            if (!uniqueCosplayers.has(cosplayer.accountId)) {
              uniqueCosplayers.set(cosplayer.accountId, {
                accountId: cosplayer.accountId,
                name: cosplayer.name,
                height: cosplayer.height ?? 0,
                weight: cosplayer.weight ?? 0,
                averageStar:
                  cosplayer.averageStar || cosplayer.salaryIndex || "N/A",
              });
            }
          });

          cosplayers = Array.from(uniqueCosplayers.values());
          cosplayers.sort(
            (a, b) => (b.averageStar || 0) - (a.averageStar || 0)
          );

          const requiredQuantity = character.quantity || 1;
          if (cosplayers.length < requiredQuantity) {
            setError(
              `Not enough cosplayer for character ${
                character.characterName || character.characterId
              }. Need ${requiredQuantity} cosplayer, Only have ${
                cosplayers.length
              }.`
            );
          } else {
            hasAvailableCosplayers = true;
          }

          cosplayersMap[character.requestCharacterId] = cosplayers;
        } catch (error) {
          console.error(
            `Lỗi khi lấy cosplayer cho ${character.characterId}:`,
            error
          );
          cosplayersMap[character.requestCharacterId] = [];
        }
      }

      setCosplayersByRequestCharacter(cosplayersMap);

      if (
        !hasAvailableCosplayers &&
        requestDetails.charactersListResponse.every(
          (c) => c.cosplayerId !== null
        )
      ) {
        setError("Tất cả nhân vật trong yêu cầu này đã được gán cosplayer.");
      } else if (!hasAvailableCosplayers) {
        setError("Không có cosplayer nào khả dụng cho các nhân vật chưa gán.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Lỗi khi tải cosplayer hoặc chi tiết request."
      );
      console.error("Error in handleAssignTaskClick:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAssignedRequest = (request) => {
    setSelectedRequest(request);
    setAssignments(new Map());
    setCosplayersByRequestCharacter({});
    setSelectedCosplayers(new Set());
    setPreferredCosplayer(null);
    setError("");
    setIsViewingAssigned(true);
  };

  const handleCloseView = () => {
    setSelectedRequest(null);
    setIsViewingAssigned(false);
  };

  const handleAssignment = useCallback(
    (requestCharacterId, cosplayerIds) => {
      setAssignments((prev) => {
        const newAssignments = new Map(prev);
        const selectedCosplayerSet = new Set();
        prev.forEach((cosplayers) => {
          cosplayers.forEach((cosplayerId) =>
            selectedCosplayerSet.add(cosplayerId)
          );
        });

        const uniqueCosplayerIds = [...new Set(cosplayerIds)].filter(
          (cosplayerId) =>
            !selectedCosplayerSet.has(cosplayerId) ||
            cosplayerIds.includes(cosplayerId)
        );
        newAssignments.set(requestCharacterId, uniqueCosplayerIds);

        if (!preferredCosplayer && uniqueCosplayerIds.length > 0) {
          const selectedCosplayer = cosplayersByRequestCharacter[
            requestCharacterId
          ]?.find((c) => c.accountId === uniqueCosplayerIds[0]);
          setPreferredCosplayer(selectedCosplayer || null);
        }

        setSelectedCosplayers((prev) => {
          const newSet = new Set();
          newAssignments.forEach((cosplayers) => {
            cosplayers.forEach((cosplayerId) => newSet.add(cosplayerId));
          });
          return newSet;
        });

        return newAssignments;
      });
    },
    [cosplayersByRequestCharacter, preferredCosplayer]
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedRequest) return;

    setIsLoading(true);
    try {
      for (const character of selectedRequest.charactersListResponse) {
        const cosplayerIds =
          assignments.get(character.requestCharacterId) || [];
        const requiredQuantity = character.quantity || 1;
        if (
          character.cosplayerId === null &&
          cosplayerIds.length !== requiredQuantity
        ) {
          throw new Error(
            `Character ${
              character.characterName || character.characterId
            } Need ${requiredQuantity} cosplayer,  ${cosplayerIds.length}.`
          );
        }
      }

      const tasksToSubmit = [];
      assignments.forEach((cosplayerIds, requestCharacterId) => {
        cosplayerIds.forEach((cosplayerId) => {
          tasksToSubmit.push({
            cosplayerId,
            requestCharacterId,
          });
        });
      });

      await ManageAssignTaskService.assignTask(
        selectedRequest.requestId,
        tasksToSubmit
      );

      notification.success({
        message: "Success",
        description: "Assign task successfully!",
      });

      setRequests((prev) =>
        prev.filter((req) => req.requestId !== selectedRequest.requestId)
      );
      setAssignedRequests((prev) => [...prev, selectedRequest]);
      setSelectedRequest(null);
      setAssignments(new Map());
      setCosplayersByRequestCharacter({});
      setSelectedCosplayers(new Set());
      setPreferredCosplayer(null);
      setIsViewingAssigned(false);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Lỗi khi phân công task",
      });
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRequest, assignments]);

  const getCosplayerOptions = (requestCharacterId) => {
    const cosplayers = cosplayersByRequestCharacter[requestCharacterId] || [];
    if (!cosplayers.length) {
      return [
        {
          value: "",
          label: "Choose cosplayer ",
          disabled: true,
        },
      ];
    }
    return cosplayers
      .filter((c) => !selectedCosplayers.has(c.accountId))
      .map((c) => ({
        value: c.accountId,
        label: `${c.name} (H: ${c.height}cm, W: ${c.weight}kg, Rate: ${
          c.averageStar || "N/A"
        })`,
        disabled: false,
      }));
  };

  const isCharacterFullyAssigned = (requestCharacterId, quantity) => {
    const selectedCosplayers = assignments.get(requestCharacterId) || [];
    return selectedCosplayers.length >= (quantity || 1);
  };

  const canSubmit = useCallback(() => {
    if (!selectedRequest || isLoading || isViewingAssigned) return false;
    return selectedRequest.charactersListResponse.every(
      (character) =>
        character.cosplayerId !== null ||
        isCharacterFullyAssigned(
          character.requestCharacterId,
          character.quantity
        )
    );
  }, [selectedRequest, assignments, isLoading, isViewingAssigned]);

  return (
    <div className="mat-page-wrapper">
      <Container className="mat-container">
        <h1 className="mat-title">Task Assignment Management</h1>

        <Tabs
          activeKey={activeTab}
          onSelect={(key) => {
            setActiveTab(key);
            setSelectedRequest(null);
            setIsViewingAssigned(false);
            setCurrentPage(1);
          }}
          className="mb-4"
        >
          <Tab eventKey="pending" title="Pending Requests">
            {isLoading && (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            )}

            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}

            {!isLoading && requests.length === 0 && !error && (
              <Alert variant="info" className="mt-3">
                No requests need to be assigned.
              </Alert>
            )}

            <Row className="mt-4">
              {requests.map((request) => (
                <Col
                  xs={12}
                  md={6}
                  lg={4}
                  key={request.requestId}
                  className="mb-4"
                >
                  <Card className="mat-details-card">
                    <Card.Body>
                      <Card.Title>Request: {request.name}</Card.Title>
                      <Card.Text>
                        <strong>Status:</strong> {request.status}
                        <br />
                        <strong>Time:</strong> {formatDate(request.startDate)} -{" "}
                        {formatDate(request.endDate)}
                        <br />
                        <strong>Location:</strong> {request.location}
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => handleAssignTaskClick(request)}
                        disabled={isLoading}
                        className="mat-assign-button"
                      >
                        Assign Task
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab>
          <Tab eventKey="assigned" title="Assigned Requests">
            {isLoading && (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            )}

            {!isLoading && assignedRequests.length === 0 && (
              <Alert variant="info" className="mt-3">
                No assigned requests found.
              </Alert>
            )}

            <Row className="mt-4">
              {currentAssignedRequests.map((request) => (
                <Col
                  xs={12}
                  md={6}
                  lg={4}
                  key={request.requestId}
                  className="mb-4"
                >
                  <Card className="mat-details-card">
                    <Card.Body>
                      <Card.Title>Request: {request.name}</Card.Title>
                      <Card.Text>
                        <strong>Status:</strong> {request.status}
                        <br />
                        <strong>Time:</strong> {formatDate(request.startDate)} -{" "}
                        {formatDate(request.endDate)}
                        <br />
                        <strong>Location:</strong> {request.location}
                      </Card.Text>
                      <Button
                        variant="info"
                        onClick={() => handleViewAssignedRequest(request)}
                        disabled={isLoading}
                        className="mat-view-button"
                      >
                        <Eye size={20} className="mat-icon" /> View
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination Controls */}
            {assignedRequests.length > 0 && (
              <div className="d-flex justify-content-center mt-4">
                <Pagination>
                  <Pagination.First
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            )}
          </Tab>
        </Tabs>

        {selectedRequest && (
          <div className="mat-content mt-4">
            <h3>
              {isViewingAssigned ? "Viewing" : "Assigning to"} request:{" "}
              {selectedRequest.name}
            </h3>
            <Button
              variant="secondary"
              onClick={handleCloseView}
              className="mb-3"
            >
              Back to List
            </Button>
            <Row>
              {selectedRequest.charactersListResponse.map((character) => {
                const quantity = character.quantity || 1;
                const isAssigned = character.cosplayerId !== null;
                return (
                  <Col
                    xs={12}
                    sm={6}
                    md={4}
                    key={character.requestCharacterId}
                    className="mb-4"
                  >
                    <Card className="mat-character-card">
                      {character.characterImages[0]?.urlImage && (
                        <Card.Img
                          variant="top"
                          src={character.characterImages[0].urlImage}
                          alt={character.description || "Character"}
                          className="mat-character-image"
                        />
                      )}
                      <Card.Body>
                        <Card.Title>
                          {character.characterName || "Unnamed Character"}
                        </Card.Title>
                        <Card.Text>
                          <strong>Description:</strong>{" "}
                          {character.description || "N/A"}
                          <br />
                          <strong>Height:</strong> {character.minHeight}-
                          {character.maxHeight}cm
                          <br />
                          <strong>Weight:</strong> {character.minWeight}-
                          {character.maxWeight}kg
                          <br />
                          {isAssigned && (
                            <>
                              <strong>Cosplayer:</strong>{" "}
                              {character.cosplayerId}
                            </>
                          )}
                          <br />
                          <strong>Dates:</strong>{" "}
                          {character.requestDateResponses.map((date) => (
                            <div key={date.requestDateId}>
                              {date.startDate} - {date.endDate}
                            </div>
                          ))}
                        </Card.Text>
                        {!isAssigned && !isViewingAssigned && (
                          <>
                            {[...Array(quantity)].map((_, index) => (
                              <Select
                                key={`${character.requestCharacterId}-${index}`}
                                placeholder={`Chọn cosplayer ${index + 1}`}
                                value={
                                  assignments.get(
                                    character.requestCharacterId
                                  )?.[index] || ""
                                }
                                onChange={(value) => {
                                  const currentCosplayers =
                                    assignments.get(
                                      character.requestCharacterId
                                    ) || [];
                                  const newCosplayers = [...currentCosplayers];
                                  newCosplayers[index] = value;
                                  handleAssignment(
                                    character.requestCharacterId,
                                    newCosplayers.filter(Boolean)
                                  );
                                }}
                                options={getCosplayerOptions(
                                  character.requestCharacterId
                                )}
                                disabled={isLoading}
                                showSearch
                                optionFilterProp="label"
                                className="mat-select"
                                style={{ width: "100%", marginBottom: "10px" }}
                              />
                            ))}
                          </>
                        )}
                      </Card.Body>
                      <Card.Footer
                        className={`mat-status ${
                          isAssigned ||
                          isCharacterFullyAssigned(
                            character.requestCharacterId,
                            quantity
                          )
                            ? "mat-status-assigned"
                            : "mat-status-unassigned"
                        }`}
                      >
                        {isAssigned
                          ? "Assigned"
                          : isCharacterFullyAssigned(
                              character.requestCharacterId,
                              quantity
                            )
                          ? "Assigned"
                          : `Unassigned (${
                              (
                                assignments.get(character.requestCharacterId) ||
                                []
                              ).length
                            }/${quantity})`}
                      </Card.Footer>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            {!isViewingAssigned && (
              <div className="mat-actions mt-4">
                <Button
                  variant="success"
                  onClick={handleSubmit}
                  disabled={!canSubmit()}
                  className="mat-submit-button"
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <>
                      <Save size={20} className="mat-icon" /> Save Assignments
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default ManageAssignTask;
