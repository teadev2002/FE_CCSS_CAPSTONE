// fix change coslayer
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Form, Modal, Input, List, Button, Popconfirm } from "antd";
// import { Edit, Plus, Delete, ChevronDown, ChevronUp } from "lucide-react";
// import dayjs from "dayjs";
// import MyHistoryService from "../../services/HistoryService/MyHistoryService";
// import { toast } from "react-toastify";
// import AddCosplayerInReq from "./AddCosplayerInReq";
// import debounce from "lodash/debounce";

// const { TextArea } = Input;

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught in ErrorBoundary:", error, errorInfo);
//     if (error.message.includes("ResizeObserver")) {
//       console.warn("ResizeObserver error detected:", error);
//     }
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div>
//           Something went wrong: {this.state.error?.message || "Unknown error"}.
//           Please try again.
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const EditRequestHireCosplayer = ({
//   visible,
//   requestId,
//   onCancel,
//   onSuccess,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [requestData, setRequestData] = useState({
//     name: "",
//     description: "",
//     startDate: null,
//     endDate: null,
//     location: "",
//     serviceId: "S002",
//     packageId: null,
//     totalDate: 0,
//     listUpdateRequestCharacters: [],
//   });
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [changeCosplayerVisible, setChangeCosplayerVisible] = useState(false);
//   const [availableCosplayers, setAvailableCosplayers] = useState([]);
//   const [currentCharacterIndex, setCurrentCharacterIndex] = useState(null);
//   const [existingCosplayerIds, setExistingCosplayerIds] = useState(new Set());
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortField, setSortField] = useState("averageStar");
//   const [sortOrder, setSortOrder] = useState("descend");
//   const [characterPage, setCharacterPage] = useState(1);
//   const [addCosplayerVisible, setAddCosplayerVisible] = useState(false);
//   const [deletingItems, setDeletingItems] = useState(new Set()); // New state for items being deleted
//   const [expandedDates, setExpandedDates] = useState(new Set()); // For custom toggle
//   const charactersPerPage = 2;
//   const rowsPerPage = 8;
//   const modalContentRef = useRef(null);

//   // Custom ResizeObserver with debounce
//   useEffect(() => {
//     if (!modalContentRef.current) return;

//     const debouncedResizeHandler = debounce(() => {
//       // Minimal resize handling
//     }, 200);

//     const resizeObserver = new ResizeObserver(debouncedResizeHandler);
//     resizeObserver.observe(modalContentRef.current);

//     return () => {
//       resizeObserver.disconnect();
//     };
//   }, [visible]);

//   // Calculate price for a single cosplayer
//   const calculateCosplayerPrice = (
//     salaryIndex,
//     characterPrice,
//     totalHours,
//     totalDays
//   ) => {
//     if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
//     return totalHours * salaryIndex + characterPrice * totalDays;
//   };

//   // Calculate total price for all cosplayers
//   const calculateTotalPrice = (characters) => {
//     return characters.reduce((total, char) => {
//       const totalHours = char.listUpdateRequestDates.reduce(
//         (sum, date) => sum + (date.totalHour || 0),
//         0
//       );

//       let totalDays = 0;
//       if (char.listUpdateRequestDates.length > 0) {
//         const startDate = dayjs(
//           char.listUpdateRequestDates[0].startDate,
//           "HH:mm DD/MM/YYYY"
//         );
//         const endDate = dayjs(
//           char.listUpdateRequestDates.slice(-1)[0].endDate,
//           "HH:mm DD/MM/YYYY"
//         );
//         if (startDate.isValid() && endDate.isValid()) {
//           totalDays = endDate.diff(startDate, "day") + 1;
//         } else {
//           console.warn(
//             "Invalid date format for cosplayer:",
//             char.cosplayerName
//           );
//         }
//       }

//       return (
//         total +
//         calculateCosplayerPrice(
//           char.salaryIndex,
//           char.characterPrice || 0,
//           totalHours,
//           totalDays
//         )
//       );
//     }, 0);
//   };

//   // Recalculate totalPrice
//   useEffect(() => {
//     const price = calculateTotalPrice(requestData.listUpdateRequestCharacters);
//     setTotalPrice(price);
//   }, [requestData.listUpdateRequestCharacters]);

//   const fetchRequestData = useCallback(async () => {
//     if (!requestId) return;
//     setLoading(true);
//     try {
//       const data = await MyHistoryService.getRequestByRequestId(requestId);
//       if (!data) throw new Error("Request data not found");

//       const charactersList = data.charactersListResponse || [];
//       const existingIds = new Set(
//         charactersList.map((char) => char.cosplayerId).filter(Boolean)
//       );
//       setExistingCosplayerIds(existingIds);

//       const listUpdateRequestCharacters = await Promise.all(
//         charactersList.map(async (char) => {
//           let cosplayerName = "Not Assigned";
//           let cosplayerId = char.cosplayerId || null;
//           let characterName = "Unknown";
//           let characterPrice = 0;
//           let salaryIndex = 1;
//           let averageStar = 0;
//           let height = 0;
//           let weight = 0;

//           if (char.cosplayerId) {
//             try {
//               const cosplayerData =
//                 await MyHistoryService.gotoHistoryByAccountId(char.cosplayerId);
//               cosplayerName = cosplayerData?.name || "Unknown";
//               salaryIndex = cosplayerData?.salaryIndex || 1;
//               cosplayerId = cosplayerData?.accountId || char.cosplayerId;
//               averageStar = cosplayerData?.averageStar || 0;
//               height = cosplayerData?.height || 0;
//               weight = cosplayerData?.weight || 0;
//             } catch (cosplayerError) {
//               console.warn(
//                 `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                 cosplayerError
//               );
//             }
//           }

//           try {
//             const characterData = await MyHistoryService.getCharacterById(
//               char.characterId
//             );
//             characterName = characterData?.characterName || "Unknown";
//             characterPrice = characterData?.price || 0;
//           } catch (characterError) {
//             console.warn(
//               `Failed to fetch character data for ID ${char.characterId}:`,
//               characterError
//             );
//           }

//           return {
//             requestCharacterId: char.requestCharacterId || null,
//             characterId: char.characterId,
//             cosplayerId,
//             cosplayerName,
//             characterName,
//             characterPrice,
//             salaryIndex,
//             averageStar,
//             height,
//             weight,
//             description: char.description || "",
//             quantity: char.quantity || 1,
//             listUpdateRequestDates: (char.requestDateResponses || []).map(
//               (date) => ({
//                 requestDateId: date.requestDateId || null,
//                 startDate: date.startDate || "",
//                 endDate: date.endDate || "",
//                 totalHour: date.totalHour || 0,
//               })
//             ),
//           };
//         })
//       );

//       const startDate = charactersList[0]?.requestDateResponses[0]?.startDate
//         ? dayjs(
//             charactersList[0].requestDateResponses[0].startDate,
//             "HH:mm DD/MM/YYYY"
//           )
//         : null;
//       const endDate = charactersList[0]?.requestDateResponses.slice(-1)[0]
//         ?.endDate
//         ? dayjs(
//             charactersList[0].requestDateResponses.slice(-1)[0].endDate,
//             "HH:mm DD/MM/YYYY"
//           )
//         : null;

//       setRequestData({
//         name: data.name || "",
//         description: data.description || "",
//         startDate,
//         endDate,
//         location: data.location || "",
//         serviceId: data.serviceId || "S002",
//         packageId: null,
//         totalDate: data.totalDate || 0,
//         listUpdateRequestCharacters,
//       });

//       form.setFieldsValue({
//         name: data.name || "",
//         description: data.description || "",
//         location: data.location || "",
//       });
//     } catch (error) {
//       console.error("Failed to fetch request details:", error);
//       toast.error("Failed to load request details.");
//     } finally {
//       setLoading(false);
//     }
//   }, [requestId, form]);

//   useEffect(() => {
//     if (visible && requestId) {
//       fetchRequestData();
//     }
//   }, [visible, requestId, fetchRequestData]);

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();
//       const formattedData = {
//         name: values.name,
//         description: values.description,
//         price: totalPrice,
//         startDate: requestData.startDate
//           ? requestData.startDate.format("DD/MM/YYYY")
//           : "",
//         endDate: requestData.endDate
//           ? requestData.endDate.format("DD/MM/YYYY")
//           : "",
//         location: values.location,
//         serviceId: requestData.serviceId,
//         packageId: null,
//         listUpdateRequestCharacters:
//           requestData.listUpdateRequestCharacters.map((char) => ({
//             requestCharacterId: char.requestCharacterId || null,
//             characterId: char.characterId,
//             cosplayerId: char.cosplayerId,
//             description: char.description,
//             quantity: char.quantity,
//           })),
//       };

//       setLoading(true);
//       const response = await MyHistoryService.editRequest(
//         requestId,
//         formattedData
//       );
//       console.log(response?.message || "Request updated successfully!");
//       onSuccess();
//       onCancel();
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to update request. Please try again.";
//       toast.error(errorMessage);
//       console.error("Failed to update request:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangeCosplayer = async (
//     characterId,
//     currentCosplayerId,
//     index
//   ) => {
//     const dates = requestData.listUpdateRequestCharacters[
//       index
//     ].listUpdateRequestDates.map((date) => ({
//       startDate: date.startDate,
//       endDate: date.endDate,
//     }));
//     try {
//       const data = {
//         characterId,
//         dates,
//         checkAccountRequest: true,
//       };
//       const available = await MyHistoryService.ChangeCosplayer(data);

//       // Filter out cosplayers already assigned to other characters, except the current cosplayer
//       const uniqueAvailable = available.filter((cos) => {
//         const normalizedAccountId = cos.accountId?.toString().toLowerCase();
//         // Include the current cosplayer or those not in existingCosplayerIds
//         return (
//           normalizedAccountId ===
//             currentCosplayerId?.toString().toLowerCase() ||
//           !existingCosplayerIds.has(normalizedAccountId)
//         );
//       });

//       // Fetch additional cosplayer data
//       const uniqueCosplayers = await Promise.all(
//         uniqueAvailable.map(async (cos) => {
//           try {
//             const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
//               cos.accountId
//             );
//             return {
//               name: cosplayerData.name || cos.name || "Unknown",
//               accountId: cosplayerData.accountId || cos.accountId,
//               averageStar: cosplayerData.averageStar || cos.averageStar || 0,
//               height: cosplayerData.height || cos.height || 0,
//               weight: cosplayerData.weight || cos.weight || 0,
//               salaryIndex: cosplayerData.salaryIndex || cos.salaryIndex || 0,
//             };
//           } catch (cosplayerError) {
//             console.warn(
//               `Failed to fetch cosplayer data for ID ${cos.accountId}:`,
//               cosplayerError
//             );
//             return null;
//           }
//         })
//       );

//       // Remove null entries and ensure no duplicates
//       const finalCosplayers = uniqueCosplayers
//         .filter((cosplayer) => cosplayer !== null)
//         .reduce((acc, cosplayer) => {
//           const normalizedAccountId = cosplayer.accountId
//             .toString()
//             .toLowerCase();
//           if (
//             !acc.some(
//               (c) =>
//                 c.accountId.toString().toLowerCase() === normalizedAccountId
//             )
//           ) {
//             acc.push(cosplayer);
//           }
//           return acc;
//         }, []);

//       setAvailableCosplayers(finalCosplayers);
//       setCurrentCharacterIndex(index);
//       setChangeCosplayerVisible(true);
//     } catch (error) {
//       console.error("Error fetching available cosplayers:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to load available cosplayers."
//       );
//     }
//   };
//   const handleCosplayerSelect = async (accountId) => {
//     const selectedCosplayer = availableCosplayers.find(
//       (cos) => cos.accountId === accountId
//     );
//     if (selectedCosplayer && currentCharacterIndex !== null) {
//       const updatedCharacters = [...requestData.listUpdateRequestCharacters];
//       const char = updatedCharacters[currentCharacterIndex];
//       const previousCosplayerId = char.cosplayerId;

//       char.cosplayerId = accountId;
//       char.cosplayerName = selectedCosplayer.name;
//       char.averageStar = selectedCosplayer.averageStar;
//       char.height = selectedCosplayer.height;
//       char.weight = selectedCosplayer.weight;
//       char.salaryIndex = selectedCosplayer.salaryIndex;

//       setRequestData((prev) => ({
//         ...prev,
//         listUpdateRequestCharacters: updatedCharacters,
//       }));

//       setExistingCosplayerIds((prev) => {
//         const newSet = new Set(prev);
//         if (previousCosplayerId) newSet.delete(previousCosplayerId);
//         newSet.add(accountId);
//         return newSet;
//       });

//       setChangeCosplayerVisible(false);
//       setCurrentCharacterIndex(null);
//     }
//   };
//   const handleAddCosplayer = () => {
//     setAddCosplayerVisible(true);
//   };

//   const handleAddCosplayerSuccess = async () => {
//     try {
//       await fetchRequestData();
//       if (requestData.listUpdateRequestCharacters.length === 0) {
//         toast.warn(
//           "No characters found after adding cosplayer. Please verify the request."
//         );
//       }
//       setAddCosplayerVisible(false);
//     } catch (error) {
//       toast.error("Failed to refresh request data after adding cosplayer.");
//       console.error("Error refreshing request data:", error);
//     }
//   };

//   // Debounced delete handler
//   const performDelete = useCallback(
//     debounce(async (index, character) => {
//       setDeleteLoading(true);
//       try {
//         await MyHistoryService.DeleteCosplayerInReq(
//           character.requestCharacterId
//         );
//         toast.success("Cosplayer deleted successfully!");

//         if (character.cosplayerId) {
//           setExistingCosplayerIds((prev) => {
//             const newSet = new Set(prev);
//             newSet.delete(character.cosplayerId);
//             return newSet;
//           });
//         }

//         await fetchRequestData();

//         setCharacterPage((prev) => {
//           const newTotalPages = Math.ceil(
//             requestData.listUpdateRequestCharacters.length / charactersPerPage
//           );
//           return prev > newTotalPages ? Math.max(1, newTotalPages) : prev;
//         });
//       } catch (error) {
//         toast.error(
//           error.message || "Failed to delete cosplayer. Please try again."
//         );
//         console.error("Error deleting cosplayer:", error);
//       } finally {
//         setDeleteLoading(false);
//         setDeletingItems((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(character.requestCharacterId);
//           return newSet;
//         });
//       }
//     }, 300),
//     [
//       fetchRequestData,
//       requestData.listUpdateRequestCharacters,
//       charactersPerPage,
//     ]
//   );

//   const handleDeleteCosplayer = (index) => {
//     if (requestData.listUpdateRequestCharacters.length <= 1) {
//       toast.error(
//         "Cannot delete the last cosplayer. At least one cosplayer is required."
//       );
//       return;
//     }

//     const character = requestData.listUpdateRequestCharacters[index];
//     if (!character.requestCharacterId) {
//       toast.error("Invalid request character ID.");
//       return;
//     }

//     // Mark item as deleting for fade-out effect
//     setDeletingItems((prev) => {
//       const newSet = new Set(prev);
//       newSet.add(character.requestCharacterId);
//       return newSet;
//     });

//     // Delay actual deletion to allow animation
//     setTimeout(() => {
//       performDelete(index, character);
//     }, 300);
//   };

//   const handleSort = (field) => {
//     setSortField(field);
//     setSortOrder(sortOrder === "ascend" ? "descend" : "ascend");
//     setCurrentPage(1);
//   };

//   const sortedCosplayers = [...availableCosplayers].sort((a, b) => {
//     if (!a[sortField] && !b[sortField]) return 0;
//     if (!a[sortField]) return 1;
//     if (!b[sortField]) return -1;
//     return sortOrder === "ascend"
//       ? a[sortField] - b[sortField]
//       : b[sortField] - a[sortField];
//   });

//   const paginatedCosplayers = sortedCosplayers.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const totalPages = Math.ceil(availableCosplayers.length / rowsPerPage);

//   const handlePageChange = (page) => {
//     setCurrentPage(page < 1 ? 1 : page > totalPages ? totalPages : page);
//   };

//   const totalCharacterPages = Math.ceil(
//     requestData.listUpdateRequestCharacters.length / charactersPerPage
//   );
//   const paginatedCharacters = requestData.listUpdateRequestCharacters.slice(
//     (characterPage - 1) * charactersPerPage,
//     characterPage * charactersPerPage
//   );

//   const handleCharacterPageChange = (page) => {
//     setCharacterPage(
//       page < 1 ? 1 : page > totalCharacterPages ? totalCharacterPages : page
//     );
//   };

//   const getCosplayerPrice = (char) => {
//     const totalHours = char.listUpdateRequestDates.reduce(
//       (sum, date) => sum + (date.totalHour || 0),
//       0
//     );

//     let totalDays = 0;
//     if (char.listUpdateRequestDates.length > 0) {
//       const startDate = dayjs(
//         char.listUpdateRequestDates[0].startDate,
//         "HH:mm DD/MM/YYYY"
//       );
//       const endDate = dayjs(
//         char.listUpdateRequestDates.slice(-1)[0].endDate,
//         "HH:mm DD/MM/YYYY"
//       );
//       if (startDate.isValid() && endDate.isValid()) {
//         totalDays = endDate.diff(startDate, "day") + 1;
//       }
//     }

//     return calculateCosplayerPrice(
//       char.salaryIndex,
//       char.characterPrice || 0,
//       totalHours,
//       totalDays
//     );
//   };

//   const toggleDates = (requestCharacterId) => {
//     setExpandedDates((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(requestCharacterId)) {
//         newSet.delete(requestCharacterId);
//       } else {
//         newSet.add(requestCharacterId);
//       }
//       return newSet;
//     });
//   };

//   return (
//     <ErrorBoundary>
//       <Modal
//         title="Edit Request for Hiring Cosplayer"
//         open={visible}
//         onOk={handleSubmit}
//         onCancel={onCancel}
//         okText="Save Changes"
//         cancelText="Cancel"
//         confirmLoading={loading}
//         width={1000}
//       >
//         <div ref={modalContentRef}>
//           {loading ? (
//             <div className="text-center">Loading...</div>
//           ) : (
//             <>
//               <Form form={form} layout="vertical">
//                 <Form.Item
//                   name="name"
//                   label="Name"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter the request name",
//                     },
//                   ]}
//                 >
//                   <Input placeholder="Enter request name" />
//                 </Form.Item>
//                 <Form.Item name="description" label="Description">
//                   <TextArea rows={4} placeholder="Enter request description" />
//                 </Form.Item>
//                 <Form.Item
//                   name="location"
//                   label="Location"
//                   rules={[
//                     { required: true, message: "Please enter the location" },
//                   ]}
//                 >
//                   <Input placeholder="Enter location" />
//                 </Form.Item>
//               </Form>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "16px",
//                 }}
//               >
//                 <h4>
//                   List of Requested Characters (Total Price:{" "}
//                   {totalPrice.toLocaleString()} VND)
//                 </h4>
//                 <Button
//                   type="primary"
//                   icon={<Plus size={16} />}
//                   onClick={handleAddCosplayer}
//                 >
//                   Add Cosplayer
//                 </Button>
//               </div>
//               <i style={{ color: "gray" }}>
//                 *Note: Unit Price hire cosplayer = (Total Hours × Hourly Rate) +
//                 (Character Price × Total Days)
//               </i>
//               {paginatedCharacters.length === 0 ? (
//                 <div className="text-center" style={{ marginTop: "16px" }}>
//                   No characters available.
//                 </div>
//               ) : (
//                 <List
//                   dataSource={paginatedCharacters}
//                   renderItem={(item, index) => (
//                     <List.Item
//                       key={item.requestCharacterId || `character-${index}`}
//                       style={{
//                         padding: "16px 0",
//                         opacity: deletingItems.has(item.requestCharacterId)
//                           ? 0.3
//                           : 1,
//                         transition: "opacity 0.3s ease",
//                       }}
//                     >
//                       <div style={{ width: "100%" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             marginBottom: "10px",
//                           }}
//                         >
//                           <div style={{ flex: 1 }}>
//                             <p style={{ margin: 0 }}>
//                               <span>Cosplayer Name: </span>
//                               <strong>{item.cosplayerName}</strong>
//                               {item.averageStar && (
//                                 <span> | Rating: {item.averageStar}/5</span>
//                               )}
//                               {item.height && (
//                                 <span> | Height: {item.height}cm</span>
//                               )}
//                               {item.weight && (
//                                 <span> | Weight: {item.weight}kg</span>
//                               )}
//                               {item.salaryIndex && (
//                                 <span>
//                                   {" "}
//                                   | Hourly Rate:{" "}
//                                   {item.salaryIndex.toLocaleString()} VND/h
//                                 </span>
//                               )}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Character <strong>{item.characterName}</strong>{" "}
//                               Price: {item.characterPrice.toLocaleString()} VND
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Quantity: {item.quantity}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Description: {item.description}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               <strong>
//                                 Price:{" "}
//                                 {getCosplayerPrice(item).toLocaleString()} VND
//                               </strong>
//                             </p>
//                           </div>
//                           <div style={{ display: "flex", gap: "8px" }}>
//                             <Button
//                               onClick={() =>
//                                 handleChangeCosplayer(
//                                   item.characterId,
//                                   item.cosplayerId,
//                                   requestData.listUpdateRequestCharacters.indexOf(
//                                     item
//                                   )
//                                 )
//                               }
//                               disabled={deletingItems.has(
//                                 item.requestCharacterId
//                               )}
//                             >
//                               Change Cosplayer
//                             </Button>
//                             <Popconfirm
//                               title="Are you sure you want to delete this cosplayer?"
//                               description={`This will remove ${item.cosplayerName} (${item.characterName}) from the request.`}
//                               onConfirm={() =>
//                                 handleDeleteCosplayer(
//                                   requestData.listUpdateRequestCharacters.indexOf(
//                                     item
//                                   )
//                                 )
//                               }
//                               okText="Yes"
//                               cancelText="No"
//                               placement="topRight"
//                             >
//                               <Button
//                                 danger
//                                 icon={<Delete size={16} />}
//                                 loading={
//                                   deleteLoading &&
//                                   deletingItems.has(item.requestCharacterId)
//                                 }
//                                 disabled={deletingItems.has(
//                                   item.requestCharacterId
//                                 )}
//                               >
//                                 Delete
//                               </Button>
//                             </Popconfirm>
//                           </div>
//                         </div>
//                         <div
//                           style={{
//                             marginTop: "8px",
//                             border: "1px solid #f0f0f0",
//                             borderRadius: "4px",
//                           }}
//                         >
//                           <Button
//                             type="link"
//                             onClick={() => toggleDates(item.requestCharacterId)}
//                             style={{
//                               width: "100%",
//                               textAlign: "left",
//                               padding: "8px 16px",
//                             }}
//                           >
//                             Request Dates
//                             {expandedDates.has(item.requestCharacterId) ? (
//                               <ChevronUp size={16} style={{ float: "right" }} />
//                             ) : (
//                               <ChevronDown
//                                 size={16}
//                                 style={{ float: "right" }}
//                               />
//                             )}
//                           </Button>
//                           {expandedDates.has(item.requestCharacterId) && (
//                             <List
//                               dataSource={item.listUpdateRequestDates}
//                               renderItem={(date, dateIndex) => (
//                                 <List.Item
//                                   key={
//                                     date.requestDateId || `date-${dateIndex}`
//                                   }
//                                   style={{
//                                     padding: "5px 16px",
//                                     borderBottom: "none",
//                                   }}
//                                 >
//                                   <div
//                                     style={{
//                                       display: "flex",
//                                       gap: "10px",
//                                       alignItems: "center",
//                                     }}
//                                   >
//                                     <span>
//                                       {date.startDate} - {date.endDate} (Total
//                                       Hours: {date.totalHour || 0})
//                                     </span>
//                                   </div>
//                                 </List.Item>
//                               )}
//                             />
//                           )}
//                         </div>
//                       </div>
//                     </List.Item>
//                   )}
//                 />
//               )}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "16px",
//                   marginTop: "16px",
//                 }}
//               >
//                 <Button
//                   onClick={() => handleCharacterPageChange(characterPage - 1)}
//                   disabled={characterPage === 1}
//                 >
//                   Previous
//                 </Button>
//                 <span>
//                   Page {characterPage} of {totalCharacterPages}
//                 </span>
//                 <Button
//                   onClick={() => handleCharacterPageChange(characterPage + 1)}
//                   disabled={characterPage === totalCharacterPages}
//                 >
//                   Next
//                 </Button>
//               </div>
//               <Modal
//                 title="Change Cosplayer"
//                 open={changeCosplayerVisible}
//                 onOk={() => setChangeCosplayerVisible(false)}
//                 onCancel={() => setChangeCosplayerVisible(false)}
//                 okText="Close"
//                 cancelText="Cancel"
//                 footer={
//                   <>
//                     <Button
//                       onClick={() =>
//                         handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
//                       }
//                     >
//                       Previous
//                     </Button>
//                     <span>
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <Button
//                       onClick={() =>
//                         handlePageChange(
//                           currentPage < totalPages
//                             ? currentPage + 1
//                             : totalPages
//                         )
//                       }
//                     >
//                       Next
//                     </Button>
//                     <Button
//                       className="btn btn-outline-danger"
//                       onClick={() => handleSort("salaryIndex")}
//                       style={{ marginBottom: "5px" }}
//                     >
//                       Hourly Salary{" "}
//                       {sortField === "salaryIndex" &&
//                         (sortOrder === "ascend" ? "↑" : "↓")}
//                     </Button>
//                   </>
//                 }
//               >
//                 <List
//                   dataSource={paginatedCosplayers}
//                   renderItem={(cosplayer) => (
//                     <List.Item
//                       key={cosplayer.accountId}
//                       onClick={() => handleCosplayerSelect(cosplayer.accountId)}
//                       style={{
//                         cursor: "pointer",
//                         padding: "12px 16px",
//                         borderBottom: "1px solid #f0f0f0",
//                         transition: "background-color 0.2s",
//                       }}
//                     >
//                       <div
//                         style={{
//                           display: "grid",
//                           gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
//                           gap: "16px",
//                           width: "100%",
//                           alignItems: "center",
//                         }}
//                       >
//                         <span
//                           style={{
//                             textOverflow: "ellipsis",
//                             overflow: "hidden",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           {cosplayer.name}
//                         </span>
//                         <span> {cosplayer.averageStar}/5</span>
//                         <span> {cosplayer.height}cm</span>
//                         <span> {cosplayer.weight}kg</span>
//                         <span>{cosplayer.salaryIndex.toLocaleString()}</span>
//                       </div>
//                     </List.Item>
//                   )}
//                 />
//               </Modal>
//               <AddCosplayerInReq
//                 visible={addCosplayerVisible}
//                 requestId={requestId}
//                 onCancel={() => setAddCosplayerVisible(false)}
//                 onSuccess={handleAddCosplayerSuccess}
//               />
//             </>
//           )}
//         </div>
//       </Modal>
//     </ErrorBoundary>
//   );
// };

// export default EditRequestHireCosplayer;

/// check bằng 2 api ở change cosplayer
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Form, Modal, Input, List, Button, Popconfirm } from "antd";
// import { Edit, Plus, Delete, ChevronDown, ChevronUp } from "lucide-react";
// import dayjs from "dayjs";
// import MyHistoryService from "../../services/HistoryService/MyHistoryService";
// import { toast } from "react-toastify";
// import AddCosplayerInReq from "./AddCosplayerInReq";
// import debounce from "lodash/debounce";
// const { TextArea } = Input;

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught in ErrorBoundary:", error, errorInfo);
//     if (error.message.includes("ResizeObserver")) {
//       console.warn("ResizeObserver error detected:", error);
//     }
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div>
//           Something went wrong: {this.state.error?.message || "Unknown error"}.
//           Please try again.
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const EditRequestHireCosplayer = ({
//   visible,
//   requestId,
//   onCancel,
//   onSuccess,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [requestData, setRequestData] = useState({
//     name: "",
//     description: "",
//     startDate: null,
//     endDate: null,
//     location: "",
//     serviceId: "S002",
//     packageId: null,
//     totalDate: 0,
//     listUpdateRequestCharacters: [],
//   });
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [changeCosplayerVisible, setChangeCosplayerVisible] = useState(false);
//   const [availableCosplayers, setAvailableCosplayers] = useState([]);
//   const [currentCharacterIndex, setCurrentCharacterIndex] = useState(null);
//   const [existingCosplayerIds, setExistingCosplayerIds] = useState(new Set());
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortField, setSortField] = useState("averageStar");
//   const [sortOrder, setSortOrder] = useState("descend");
//   const [characterPage, setCharacterPage] = useState(1);
//   const [addCosplayerVisible, setAddCosplayerVisible] = useState(false);
//   const [deletingItems, setDeletingItems] = useState(new Set()); // New state for items being deleted
//   const [expandedDates, setExpandedDates] = useState(new Set()); // For custom toggle
//   const charactersPerPage = 2;
//   const rowsPerPage = 8;
//   const modalContentRef = useRef(null);
//   const [bookedCosplayerIds, setBookedCosplayerIds] = useState(new Set()); // Track booked cosplayer IDs
//   // Custom ResizeObserver with debounce
//   useEffect(() => {
//     if (!modalContentRef.current) return;

//     const debouncedResizeHandler = debounce(() => {
//       // Minimal resize handling
//     }, 200);

//     const resizeObserver = new ResizeObserver(debouncedResizeHandler);
//     resizeObserver.observe(modalContentRef.current);

//     return () => {
//       resizeObserver.disconnect();
//     };
//   }, [visible]);

//   // Calculate price for a single cosplayer
//   const calculateCosplayerPrice = (
//     salaryIndex,
//     characterPrice,
//     totalHours,
//     totalDays
//   ) => {
//     if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
//     return totalHours * salaryIndex + characterPrice * totalDays;
//   };

//   // Calculate total price for all cosplayers
//   const calculateTotalPrice = (characters) => {
//     return characters.reduce((total, char) => {
//       const totalHours = char.listUpdateRequestDates.reduce(
//         (sum, date) => sum + (date.totalHour || 0),
//         0
//       );

//       let totalDays = 0;
//       if (char.listUpdateRequestDates.length > 0) {
//         const startDate = dayjs(
//           char.listUpdateRequestDates[0].startDate,
//           "HH:mm DD/MM/YYYY"
//         );
//         const endDate = dayjs(
//           char.listUpdateRequestDates.slice(-1)[0].endDate,
//           "HH:mm DD/MM/YYYY"
//         );
//         if (startDate.isValid() && endDate.isValid()) {
//           totalDays = endDate.diff(startDate, "day") + 1;
//         } else {
//           console.warn(
//             "Invalid date format for cosplayer:",
//             char.cosplayerName
//           );
//         }
//       }

//       return (
//         total +
//         calculateCosplayerPrice(
//           char.salaryIndex,
//           char.characterPrice || 0,
//           totalHours,
//           totalDays
//         )
//       );
//     }, 0);
//   };

//   // Recalculate totalPrice
//   useEffect(() => {
//     const price = calculateTotalPrice(requestData.listUpdateRequestCharacters);
//     setTotalPrice(price);
//   }, [requestData.listUpdateRequestCharacters]);

//   const fetchRequestData = useCallback(async () => {
//     if (!requestId) return;
//     setLoading(true);
//     try {
//       const data = await MyHistoryService.getRequestByRequestId(requestId);
//       if (!data) throw new Error("Request data not found");

//       const charactersList = data.charactersListResponse || [];
//       const existingIds = new Set(
//         charactersList.map((char) => char.cosplayerId).filter(Boolean)
//       );
//       setExistingCosplayerIds(existingIds);

//       const listUpdateRequestCharacters = await Promise.all(
//         charactersList.map(async (char) => {
//           let cosplayerName = "Not Assigned";
//           let cosplayerId = char.cosplayerId || null;
//           let characterName = "Unknown";
//           let characterPrice = 0;
//           let salaryIndex = 1;
//           let averageStar = 0;
//           let height = 0;
//           let weight = 0;

//           if (char.cosplayerId) {
//             try {
//               const cosplayerData =
//                 await MyHistoryService.gotoHistoryByAccountId(char.cosplayerId);
//               cosplayerName = cosplayerData?.name || "Unknown";
//               salaryIndex = cosplayerData?.salaryIndex || 1;
//               cosplayerId = cosplayerData?.accountId || char.cosplayerId;
//               averageStar = cosplayerData?.averageStar || 0;
//               height = cosplayerData?.height || 0;
//               weight = cosplayerData?.weight || 0;
//             } catch (cosplayerError) {
//               console.warn(
//                 `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                 cosplayerError
//               );
//             }
//           }

//           try {
//             const characterData = await MyHistoryService.getCharacterById(
//               char.characterId
//             );
//             characterName = characterData?.characterName || "Unknown";
//             characterPrice = characterData?.price || 0;
//           } catch (characterError) {
//             console.warn(
//               `Failed to fetch character data for ID ${char.characterId}:`,
//               characterError
//             );
//           }

//           return {
//             requestCharacterId: char.requestCharacterId || null,
//             characterId: char.characterId,
//             cosplayerId,
//             cosplayerName,
//             characterName,
//             characterPrice,
//             salaryIndex,
//             averageStar,
//             height,
//             weight,
//             description: char.description || "",
//             quantity: char.quantity || 1,
//             listUpdateRequestDates: (char.requestDateResponses || []).map(
//               (date) => ({
//                 requestDateId: date.requestDateId || null,
//                 startDate: date.startDate || "",
//                 endDate: date.endDate || "",
//                 totalHour: date.totalHour || 0,
//               })
//             ),
//           };
//         })
//       );

//       const startDate = charactersList[0]?.requestDateResponses[0]?.startDate
//         ? dayjs(
//             charactersList[0].requestDateResponses[0].startDate,
//             "HH:mm DD/MM/YYYY"
//           )
//         : null;
//       const endDate = charactersList[0]?.requestDateResponses.slice(-1)[0]
//         ?.endDate
//         ? dayjs(
//             charactersList[0].requestDateResponses.slice(-1)[0].endDate,
//             "HH:mm DD/MM/YYYY"
//           )
//         : null;

//       setRequestData({
//         name: data.name || "",
//         description: data.description || "",
//         startDate,
//         endDate,
//         location: data.location || "",
//         serviceId: data.serviceId || "S002",
//         packageId: null,
//         totalDate: data.totalDate || 0,
//         listUpdateRequestCharacters,
//       });

//       form.setFieldsValue({
//         name: data.name || "",
//         description: data.description || "",
//         location: data.location || "",
//       });
//     } catch (error) {
//       console.error("Failed to fetch request details:", error);
//       toast.error("Failed to load request details.");
//     } finally {
//       setLoading(false);
//     }
//   }, [requestId, form]);

//   useEffect(() => {
//     if (visible && requestId) {
//       fetchRequestData();
//     }
//   }, [visible, requestId, fetchRequestData]);

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();

//       // Step 1: Re-fetch request data to ensure latest state
//       setLoading(true);
//       const latestRequestData = await MyHistoryService.getRequestByRequestId(
//         requestId
//       );
//       if (!latestRequestData || !latestRequestData.charactersListResponse) {
//         throw new Error("Failed to fetch latest request data.");
//       }

//       // Step 2: Validate cosplayer assignments for conflicts
//       for (const char of requestData.listUpdateRequestCharacters) {
//         if (!char.cosplayerId || !char.listUpdateRequestDates.length) {
//           continue; // Skip unassigned characters or those without dates
//         }

//         const dates = char.listUpdateRequestDates.map((date) => ({
//           startDate: date.startDate,
//           endDate: date.endDate,
//         }));

//         if (dates.length === 0) {
//           throw new Error(
//             `No date ranges found for character ${
//               char.characterName || char.characterId
//             }.`
//           );
//         }

//         const conflicts =
//           await MyHistoryService.getAllRequestCharacterByListDate(dates);

//         for (const conflict of conflicts) {
//           if (
//             conflict.cosplayerId &&
//             conflict.cosplayerId.toString().toLowerCase() ===
//               char.cosplayerId.toString().toLowerCase()
//           ) {
//             // Fetch cosplayer name for error message
//             let cosplayerName = char.cosplayerName || "Unknown Cosplayer";
//             if (!cosplayerName.includes("Unknown")) {
//               try {
//                 const cosplayerData =
//                   await MyHistoryService.gotoHistoryByAccountId(
//                     char.cosplayerId
//                   );
//                 cosplayerName = cosplayerData?.name || "Unknown Cosplayer";
//               } catch (error) {
//                 console.warn(
//                   `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                   error
//                 );
//               }
//             }
//             throw new Error(
//               `Cosplayer ${cosplayerName} is already booked for character ${
//                 char.characterName || char.characterId
//               } during the selected time.`
//             );
//           }
//         }
//       }

//       // Step 3: Prepare and submit updated request
//       const formattedData = {
//         name: values.name,
//         description: values.description,
//         price: totalPrice,
//         startDate: requestData.startDate
//           ? requestData.startDate.format("DD/MM/YYYY")
//           : "",
//         endDate: requestData.endDate
//           ? requestData.endDate.format("DD/MM/YYYY")
//           : "",
//         location: values.location,
//         serviceId: requestData.serviceId,
//         packageId: null,
//         listUpdateRequestCharacters:
//           requestData.listUpdateRequestCharacters.map((char) => ({
//             requestCharacterId: char.requestCharacterId || null,
//             characterId: char.characterId,
//             cosplayerId: char.cosplayerId,
//             description: char.description,
//             quantity: char.quantity,
//           })),
//       };

//       const response = await MyHistoryService.editRequest(
//         requestId,
//         formattedData
//       );
//       console.log(response?.message || "Request updated successfully!");
//       onSuccess();
//       onCancel();
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to update request. Please try again.";
//       toast.error(errorMessage);
//       console.error("Failed to update request:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangeCosplayer = async (
//     characterId,
//     currentCosplayerId,
//     index
//   ) => {
//     const dates = requestData.listUpdateRequestCharacters[
//       index
//     ].listUpdateRequestDates.map((date) => ({
//       startDate: date.startDate,
//       endDate: date.endDate,
//     }));

//     if (dates.length === 0) {
//       toast.error("No date ranges available for this character.");
//       return;
//     }

//     try {
//       // Step 1: Fetch available cosplayers
//       const data = {
//         characterId,
//         dates,
//         checkAccountRequest: true,
//       };
//       const available = await MyHistoryService.ChangeCosplayer(data);

//       // Step 2: Fetch booked cosplayers using getAllRequestCharacterByListDate
//       const conflicts = await MyHistoryService.getAllRequestCharacterByListDate(
//         dates
//       );
//       const bookedIds = new Set(
//         conflicts
//           .map((conflict) => conflict.cosplayerId)
//           .filter(Boolean)
//           .map((id) => id.toString().toLowerCase())
//       );
//       setBookedCosplayerIds(bookedIds);

//       // In cosplayer data

//       // Step 3: Filter out cosplayers already assigned to other characters, except the current cosplayer
//       const uniqueAvailable = available.filter((cos) => {
//         const normalizedAccountId = cos.accountId?.toString().toLowerCase();
//         return (
//           normalizedAccountId ===
//             currentCosplayerId?.toString().toLowerCase() ||
//           !existingCosplayerIds.has(normalizedAccountId)
//         );
//       });

//       // Step 4: Fetch additional cosplayer data and add isBooked flag
//       const uniqueCosplayers = await Promise.all(
//         uniqueAvailable.map(async (cos) => {
//           try {
//             const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
//               cos.accountId
//             );
//             return {
//               name: cosplayerData.name || cos.name || "Unknown",
//               accountId: cosplayerData.accountId || cos.accountId,
//               averageStar: cosplayerData.averageStar || cos.averageStar || 0,
//               height: cosplayerData.height || cos.height || 0,
//               weight: cosplayerData.weight || cos.weight || 0,
//               salaryIndex: cosplayerData.salaryIndex || cos.salaryIndex || 0,
//               isBooked: bookedIds.has(
//                 (cosplayerData.accountId || cos.accountId)
//                   .toString()
//                   .toLowerCase()
//               ), // Flag if booked
//             };
//           } catch (cosplayerError) {
//             console.warn(
//               `Failed to fetch cosplayer data for ID ${cos.accountId}:`,
//               cosplayerError
//             );
//             return null;
//           }
//         })
//       );

//       // Step 5: Remove null entries and ensure no duplicates
//       const finalCosplayers = uniqueCosplayers
//         .filter((cosplayer) => cosplayer !== null)
//         .reduce((acc, cosplayer) => {
//           const normalizedAccountId = cosplayer.accountId
//             .toString()
//             .toLowerCase();
//           if (
//             !acc.some(
//               (c) =>
//                 c.accountId.toString().toLowerCase() === normalizedAccountId
//             )
//           ) {
//             acc.push(cosplayer);
//           }
//           return acc;
//         }, []);

//       if (finalCosplayers.length === 0) {
//         toast.warn("No available cosplayers found for this character.");
//       }

//       setAvailableCosplayers(finalCosplayers);
//       setCurrentCharacterIndex(index);
//       setChangeCosplayerVisible(true);
//     } catch (error) {
//       console.error("Error fetching available cosplayers:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to load available cosplayers."
//       );
//     }
//   };

//   const handleCosplayerSelect = async (accountId) => {
//     const selectedCosplayer = availableCosplayers.find(
//       (cos) => cos.accountId === accountId
//     );
//     if (!selectedCosplayer) {
//       toast.error("Selected cosplayer not found.");
//       return;
//     }
//     if (selectedCosplayer.isBooked) {
//       toast.error(
//         `${selectedCosplayer.name} is already booked during the selected time.`
//       );
//       return;
//     }
//     if (currentCharacterIndex !== null) {
//       const updatedCharacters = [...requestData.listUpdateRequestCharacters];
//       const char = updatedCharacters[currentCharacterIndex];
//       const previousCosplayerId = char.cosplayerId;

//       char.cosplayerId = accountId;
//       char.cosplayerName = selectedCosplayer.name;
//       char.averageStar = selectedCosplayer.averageStar;
//       char.height = selectedCosplayer.height;
//       char.weight = selectedCosplayer.weight;
//       char.salaryIndex = selectedCosplayer.salaryIndex;

//       setRequestData((prev) => ({
//         ...prev,
//         listUpdateRequestCharacters: updatedCharacters,
//       }));

//       setExistingCosplayerIds((prev) => {
//         const newSet = new Set(prev);
//         if (previousCosplayerId) newSet.delete(previousCosplayerId);
//         newSet.add(accountId);
//         return newSet;
//       });

//       setChangeCosplayerVisible(false);
//       setCurrentCharacterIndex(null);
//     }
//   };
//   const handleAddCosplayer = () => {
//     setAddCosplayerVisible(true);
//   };

//   const handleAddCosplayerSuccess = async () => {
//     try {
//       await fetchRequestData();
//       if (requestData.listUpdateRequestCharacters.length === 0) {
//         toast.warn(
//           "No characters found after adding cosplayer. Please verify the request."
//         );
//       }
//       setAddCosplayerVisible(false);
//     } catch (error) {
//       toast.error("Failed to refresh request data after adding cosplayer.");
//       console.error("Error refreshing request data:", error);
//     }
//   };

//   // Debounced delete handler
//   const performDelete = useCallback(
//     debounce(async (index, character) => {
//       setDeleteLoading(true);
//       try {
//         await MyHistoryService.DeleteCosplayerInReq(
//           character.requestCharacterId
//         );
//         toast.success("Cosplayer deleted successfully!");

//         if (character.cosplayerId) {
//           setExistingCosplayerIds((prev) => {
//             const newSet = new Set(prev);
//             newSet.delete(character.cosplayerId);
//             return newSet;
//           });
//         }

//         await fetchRequestData();

//         setCharacterPage((prev) => {
//           const newTotalPages = Math.ceil(
//             requestData.listUpdateRequestCharacters.length / charactersPerPage
//           );
//           return prev > newTotalPages ? Math.max(1, newTotalPages) : prev;
//         });
//       } catch (error) {
//         toast.error(
//           error.message || "Failed to delete cosplayer. Please try again."
//         );
//         console.error("Error deleting cosplayer:", error);
//       } finally {
//         setDeleteLoading(false);
//         setDeletingItems((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(character.requestCharacterId);
//           return newSet;
//         });
//       }
//     }, 300),
//     [
//       fetchRequestData,
//       requestData.listUpdateRequestCharacters,
//       charactersPerPage,
//     ]
//   );

//   const handleDeleteCosplayer = (index) => {
//     if (requestData.listUpdateRequestCharacters.length <= 1) {
//       toast.error(
//         "Cannot delete the last cosplayer. At least one cosplayer is required."
//       );
//       return;
//     }

//     const character = requestData.listUpdateRequestCharacters[index];
//     if (!character.requestCharacterId) {
//       toast.error("Invalid request character ID.");
//       return;
//     }

//     // Mark item as deleting for fade-out effect
//     setDeletingItems((prev) => {
//       const newSet = new Set(prev);
//       newSet.add(character.requestCharacterId);
//       return newSet;
//     });

//     // Delay actual deletion to allow animation
//     setTimeout(() => {
//       performDelete(index, character);
//     }, 300);
//   };

//   const handleSort = (field) => {
//     setSortField(field);
//     setSortOrder(sortOrder === "ascend" ? "descend" : "ascend");
//     setCurrentPage(1);
//   };

//   const sortedCosplayers = [...availableCosplayers].sort((a, b) => {
//     if (!a[sortField] && !b[sortField]) return 0;
//     if (!a[sortField]) return 1;
//     if (!b[sortField]) return -1;
//     return sortOrder === "ascend"
//       ? a[sortField] - b[sortField]
//       : b[sortField] - a[sortField];
//   });

//   const unbookedCosplayers = sortedCosplayers.filter(
//     (cosplayer) => !cosplayer.isBooked
//   );
//   const totalPages = Math.ceil(unbookedCosplayers.length / rowsPerPage);
//   const paginatedCosplayers = unbookedCosplayers.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page < 1 ? 1 : page > totalPages ? totalPages : page);
//   };

//   const totalCharacterPages = Math.ceil(
//     requestData.listUpdateRequestCharacters.length / charactersPerPage
//   );
//   const paginatedCharacters = requestData.listUpdateRequestCharacters.slice(
//     (characterPage - 1) * charactersPerPage,
//     characterPage * charactersPerPage
//   );

//   const handleCharacterPageChange = (page) => {
//     setCharacterPage(
//       page < 1 ? 1 : page > totalCharacterPages ? totalCharacterPages : page
//     );
//   };

//   const getCosplayerPrice = (char) => {
//     const totalHours = char.listUpdateRequestDates.reduce(
//       (sum, date) => sum + (date.totalHour || 0),
//       0
//     );

//     let totalDays = 0;
//     if (char.listUpdateRequestDates.length > 0) {
//       const startDate = dayjs(
//         char.listUpdateRequestDates[0].startDate,
//         "HH:mm DD/MM/YYYY"
//       );
//       const endDate = dayjs(
//         char.listUpdateRequestDates.slice(-1)[0].endDate,
//         "HH:mm DD/MM/YYYY"
//       );
//       if (startDate.isValid() && endDate.isValid()) {
//         totalDays = endDate.diff(startDate, "day") + 1;
//       }
//     }

//     return calculateCosplayerPrice(
//       char.salaryIndex,
//       char.characterPrice || 0,
//       totalHours,
//       totalDays
//     );
//   };

//   const toggleDates = (requestCharacterId) => {
//     setExpandedDates((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(requestCharacterId)) {
//         newSet.delete(requestCharacterId);
//       } else {
//         newSet.add(requestCharacterId);
//       }
//       return newSet;
//     });
//   };

//   return (
//     <ErrorBoundary>
//       <Modal
//         title="Edit Request for Hiring Cosplayer"
//         open={visible}
//         onOk={handleSubmit}
//         onCancel={onCancel}
//         okText="Save Changes"
//         cancelText="Cancel"
//         confirmLoading={loading}
//         width={1000}
//       >
//         <div ref={modalContentRef}>
//           {loading ? (
//             <div className="text-center">Loading...</div>
//           ) : (
//             <>
//               <Form form={form} layout="vertical">
//                 <Form.Item
//                   name="name"
//                   label="Name"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter the request name",
//                     },
//                   ]}
//                 >
//                   <Input placeholder="Enter request name" />
//                 </Form.Item>
//                 <Form.Item name="description" label="Description">
//                   <TextArea rows={4} placeholder="Enter request description" />
//                 </Form.Item>
//                 <Form.Item
//                   name="location"
//                   label="Location"
//                   rules={[
//                     { required: true, message: "Please enter the location" },
//                   ]}
//                 >
//                   <Input placeholder="Enter location" />
//                 </Form.Item>
//               </Form>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "16px",
//                 }}
//               >
//                 <h4>
//                   List of Requested Characters (Total Price:{" "}
//                   {totalPrice.toLocaleString()} VND)
//                 </h4>
//                 <Button
//                   type="primary"
//                   icon={<Plus size={16} />}
//                   onClick={handleAddCosplayer}
//                 >
//                   Add Cosplayer
//                 </Button>
//               </div>
//               <i style={{ color: "gray" }}>
//                 *Note: Unit Price hire cosplayer = (Total Hours × Hourly Rate) +
//                 (Character Price × Total Days)
//               </i>
//               {paginatedCharacters.length === 0 ? (
//                 <div className="text-center" style={{ marginTop: "16px" }}>
//                   No characters available.
//                 </div>
//               ) : (
//                 <List
//                   dataSource={paginatedCharacters}
//                   renderItem={(item, index) => (
//                     <List.Item
//                       key={item.requestCharacterId || `character-${index}`}
//                       style={{
//                         padding: "16px 0",
//                         opacity: deletingItems.has(item.requestCharacterId)
//                           ? 0.3
//                           : 1,
//                         transition: "opacity 0.3s ease",
//                       }}
//                     >
//                       <div style={{ width: "100%" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             marginBottom: "10px",
//                           }}
//                         >
//                           <div style={{ flex: 1 }}>
//                             <p style={{ margin: 0 }}>
//                               <span>Cosplayer Name: </span>
//                               <strong>{item.cosplayerName}</strong>
//                               {item.averageStar && (
//                                 <span> | Rating: {item.averageStar}/5</span>
//                               )}
//                               {item.height && (
//                                 <span> | Height: {item.height}cm</span>
//                               )}
//                               {item.weight && (
//                                 <span> | Weight: {item.weight}kg</span>
//                               )}
//                               {item.salaryIndex && (
//                                 <span>
//                                   {" "}
//                                   | Hourly Rate:{" "}
//                                   {item.salaryIndex.toLocaleString()} VND/h
//                                 </span>
//                               )}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Character <strong>{item.characterName}</strong>{" "}
//                               Price: {item.characterPrice.toLocaleString()} VND
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Quantity: {item.quantity}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Description: {item.description}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               <strong>
//                                 Price:{" "}
//                                 {getCosplayerPrice(item).toLocaleString()} VND
//                               </strong>
//                             </p>
//                           </div>
//                           <div style={{ display: "flex", gap: "8px" }}>
//                             <Button
//                               onClick={() =>
//                                 handleChangeCosplayer(
//                                   item.characterId,
//                                   item.cosplayerId,
//                                   requestData.listUpdateRequestCharacters.indexOf(
//                                     item
//                                   )
//                                 )
//                               }
//                               disabled={deletingItems.has(
//                                 item.requestCharacterId
//                               )}
//                             >
//                               Change Cosplayer
//                             </Button>
//                             <Popconfirm
//                               title="Are you sure you want to delete this cosplayer?"
//                               description={`This will remove ${item.cosplayerName} (${item.characterName}) from the request.`}
//                               onConfirm={() =>
//                                 handleDeleteCosplayer(
//                                   requestData.listUpdateRequestCharacters.indexOf(
//                                     item
//                                   )
//                                 )
//                               }
//                               okText="Yes"
//                               cancelText="No"
//                               placement="topRight"
//                             >
//                               <Button
//                                 danger
//                                 icon={<Delete size={16} />}
//                                 loading={
//                                   deleteLoading &&
//                                   deletingItems.has(item.requestCharacterId)
//                                 }
//                                 disabled={deletingItems.has(
//                                   item.requestCharacterId
//                                 )}
//                               >
//                                 Delete
//                               </Button>
//                             </Popconfirm>
//                           </div>
//                         </div>
//                         <div
//                           style={{
//                             marginTop: "8px",
//                             border: "1px solid #f0f0f0",
//                             borderRadius: "4px",
//                           }}
//                         >
//                           <Button
//                             type="link"
//                             onClick={() => toggleDates(item.requestCharacterId)}
//                             style={{
//                               width: "100%",
//                               textAlign: "left",
//                               padding: "8px 16px",
//                             }}
//                           >
//                             Request Dates
//                             {expandedDates.has(item.requestCharacterId) ? (
//                               <ChevronUp size={16} style={{ float: "right" }} />
//                             ) : (
//                               <ChevronDown
//                                 size={16}
//                                 style={{ float: "right" }}
//                               />
//                             )}
//                           </Button>
//                           {expandedDates.has(item.requestCharacterId) && (
//                             <List
//                               dataSource={item.listUpdateRequestDates}
//                               renderItem={(date, dateIndex) => (
//                                 <List.Item
//                                   key={
//                                     date.requestDateId || `date-${dateIndex}`
//                                   }
//                                   style={{
//                                     padding: "5px 16px",
//                                     borderBottom: "none",
//                                   }}
//                                 >
//                                   <div
//                                     style={{
//                                       display: "flex",
//                                       gap: "10px",
//                                       alignItems: "center",
//                                     }}
//                                   >
//                                     <span>
//                                       {date.startDate} - {date.endDate} (Total
//                                       Hours: {date.totalHour || 0})
//                                     </span>
//                                   </div>
//                                 </List.Item>
//                               )}
//                             />
//                           )}
//                         </div>
//                       </div>
//                     </List.Item>
//                   )}
//                 />
//               )}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "16px",
//                   marginTop: "16px",
//                 }}
//               >
//                 <Button
//                   onClick={() => handleCharacterPageChange(characterPage - 1)}
//                   disabled={characterPage === 1}
//                 >
//                   Previous
//                 </Button>
//                 <span>
//                   Page {characterPage} of {totalCharacterPages}
//                 </span>
//                 <Button
//                   onClick={() => handleCharacterPageChange(characterPage + 1)}
//                   disabled={characterPage === totalCharacterPages}
//                 >
//                   Next
//                 </Button>
//               </div>
//               <Modal
//                 title="Change Cosplayer"
//                 open={changeCosplayerVisible}
//                 onOk={() => setChangeCosplayerVisible(false)}
//                 onCancel={() => setChangeCosplayerVisible(false)}
//                 okText="Close"
//                 cancelText="Cancel"
//                 footer={
//                   <>
//                     <Button
//                       onClick={() =>
//                         handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
//                       }
//                     >
//                       Previous
//                     </Button>
//                     <span>
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <Button
//                       onClick={() =>
//                         handlePageChange(
//                           currentPage < totalPages
//                             ? currentPage + 1
//                             : totalPages
//                         )
//                       }
//                     >
//                       Next
//                     </Button>
//                     <Button
//                       className="btn btn-outline-danger"
//                       onClick={() => handleSort("salaryIndex")}
//                       style={{ marginBottom: "5px" }}
//                     >
//                       Hourly Salary{" "}
//                       {sortField === "salaryIndex" &&
//                         (sortOrder === "ascend" ? "↑" : "↓")}
//                     </Button>
//                   </>
//                 }
//               >
//                 {unbookedCosplayers.length === 0 ? (
//                   <div className="text-center">
//                     No available cosplayers for the selected time.
//                   </div>
//                 ) : (
//                   <List
//                     dataSource={paginatedCosplayers}
//                     renderItem={(cosplayer) => (
//                       <List.Item
//                         key={cosplayer.accountId}
//                         onClick={() =>
//                           handleCosplayerSelect(cosplayer.accountId)
//                         }
//                         style={{
//                           display: cosplayer.isBooked ? "none" : "block",
//                           cursor: "pointer",
//                           padding: "12px 16px",
//                           borderBottom: "1px solid #f0f0f0",
//                           transition: "background-color 0.2s",
//                         }}
//                       >
//                         <div
//                           className="cosplayer-row"
//                           style={{
//                             display: "grid",
//                             gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
//                             gap: "16px",
//                             width: "100%",
//                             alignItems: "center",
//                           }}
//                         >
//                           <span
//                             style={{
//                               textOverflow: "ellipsis",
//                               overflow: "hidden",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {cosplayer.name}
//                           </span>
//                           <span>{cosplayer.averageStar}/5</span>
//                           <span>{cosplayer.height}cm</span>
//                           <span>{cosplayer.weight}kg</span>
//                           <span>{cosplayer.salaryIndex.toLocaleString()}</span>
//                         </div>
//                       </List.Item>
//                     )}
//                   />
//                 )}
//               </Modal>
//               <AddCosplayerInReq
//                 visible={addCosplayerVisible}
//                 requestId={requestId}
//                 onCancel={() => setAddCosplayerVisible(false)}
//                 onSuccess={handleAddCosplayerSuccess}
//               />
//             </>
//           )}
//         </div>
//       </Modal>
//     </ErrorBoundary>
//   );
// };

// export default EditRequestHireCosplayer;

// fix bug ko thể lưu cosplayer cũ:
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Form, Modal, Input, List, Button, Popconfirm } from "antd";
// import { Edit, Plus, Delete, ChevronDown, ChevronUp } from "lucide-react";
// import dayjs from "dayjs";
// import MyHistoryService from "../../services/HistoryService/MyHistoryService";
// import { toast } from "react-toastify";
// import AddCosplayerInReq from "./AddCosplayerInReq";
// import debounce from "lodash/debounce";
// const { TextArea } = Input;

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught in ErrorBoundary:", error, errorInfo);
//     if (error.message.includes("ResizeObserver")) {
//       console.warn("ResizeObserver error detected:", error);
//     }
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div>
//           Something went wrong: {this.state.error?.message || "Unknown error"}.
//           Please try again.
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const EditRequestHireCosplayer = ({
//   visible,
//   requestId,
//   onCancel,
//   onSuccess,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [requestData, setRequestData] = useState({
//     name: "",
//     description: "",
//     startDate: null,
//     endDate: null,
//     location: "",
//     serviceId: "S002",
//     packageId: null,
//     totalDate: 0,
//     listUpdateRequestCharacters: [],
//   });
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [changeCosplayerVisible, setChangeCosplayerVisible] = useState(false);
//   const [availableCosplayers, setAvailableCosplayers] = useState([]);
//   const [currentCharacterIndex, setCurrentCharacterIndex] = useState(null);
//   const [existingCosplayerIds, setExistingCosplayerIds] = useState(new Set());
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortField, setSortField] = useState("averageStar");
//   const [sortOrder, setSortOrder] = useState("descend");
//   const [characterPage, setCharacterPage] = useState(1);
//   const [addCosplayerVisible, setAddCosplayerVisible] = useState(false);
//   const [deletingItems, setDeletingItems] = useState(new Set()); // New state for items being deleted
//   const [expandedDates, setExpandedDates] = useState(new Set()); // For custom toggle
//   const charactersPerPage = 2;
//   const rowsPerPage = 8;
//   const modalContentRef = useRef(null);
//   const [bookedCosplayerIds, setBookedCosplayerIds] = useState(new Set()); // Track booked cosplayer IDs
//   // Custom ResizeObserver with debounce
//   useEffect(() => {
//     if (!modalContentRef.current) return;

//     const debouncedResizeHandler = debounce(() => {
//       // Minimal resize handling
//     }, 200);

//     const resizeObserver = new ResizeObserver(debouncedResizeHandler);
//     resizeObserver.observe(modalContentRef.current);

//     return () => {
//       resizeObserver.disconnect();
//     };
//   }, [visible]);

//   // Calculate price for a single cosplayer
//   const calculateCosplayerPrice = (
//     salaryIndex,
//     characterPrice,
//     totalHours,
//     totalDays
//   ) => {
//     if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
//     return totalHours * salaryIndex + characterPrice * totalDays;
//   };

//   // Calculate total price for all cosplayers
//   const calculateTotalPrice = (characters) => {
//     return characters.reduce((total, char) => {
//       const totalHours = char.listUpdateRequestDates.reduce(
//         (sum, date) => sum + (date.totalHour || 0),
//         0
//       );

//       let totalDays = 0;
//       if (char.listUpdateRequestDates.length > 0) {
//         const startDate = dayjs(
//           char.listUpdateRequestDates[0].startDate,
//           "HH:mm DD/MM/YYYY"
//         );
//         const endDate = dayjs(
//           char.listUpdateRequestDates.slice(-1)[0].endDate,
//           "HH:mm DD/MM/YYYY"
//         );
//         if (startDate.isValid() && endDate.isValid()) {
//           totalDays = endDate.diff(startDate, "day") + 1;
//         } else {
//           console.warn(
//             "Invalid date format for cosplayer:",
//             char.cosplayerName
//           );
//         }
//       }

//       return (
//         total +
//         calculateCosplayerPrice(
//           char.salaryIndex,
//           char.characterPrice || 0,
//           totalHours,
//           totalDays
//         )
//       );
//     }, 0);
//   };

//   // Recalculate totalPrice
//   useEffect(() => {
//     const price = calculateTotalPrice(requestData.listUpdateRequestCharacters);
//     setTotalPrice(price);
//   }, [requestData.listUpdateRequestCharacters]);

//   const fetchRequestData = useCallback(async () => {
//     if (!requestId) return;
//     setLoading(true);
//     try {
//       const data = await MyHistoryService.getRequestByRequestId(requestId);
//       if (!data) throw new Error("Request data not found");

//       const charactersList = data.charactersListResponse || [];
//       const existingIds = new Set(
//         charactersList.map((char) => char.cosplayerId).filter(Boolean)
//       );
//       setExistingCosplayerIds(existingIds);

//       const listUpdateRequestCharacters = await Promise.all(
//         charactersList.map(async (char) => {
//           let cosplayerName = "Not Assigned";
//           let cosplayerId = char.cosplayerId || null;
//           let characterName = "Unknown";
//           let characterPrice = 0;
//           let salaryIndex = 1;
//           let averageStar = 0;
//           let height = 0;
//           let weight = 0;

//           if (char.cosplayerId) {
//             try {
//               const cosplayerData =
//                 await MyHistoryService.gotoHistoryByAccountId(char.cosplayerId);
//               cosplayerName = cosplayerData?.name || "Unknown";
//               salaryIndex = cosplayerData?.salaryIndex || 1;
//               cosplayerId = cosplayerData?.accountId || char.cosplayerId;
//               averageStar = cosplayerData?.averageStar || 0;
//               height = cosplayerData?.height || 0;
//               weight = cosplayerData?.weight || 0;
//             } catch (cosplayerError) {
//               console.warn(
//                 `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                 cosplayerError
//               );
//             }
//           }

//           try {
//             const characterData = await MyHistoryService.getCharacterById(
//               char.characterId
//             );
//             characterName = characterData?.characterName || "Unknown";
//             characterPrice = characterData?.price || 0;
//           } catch (characterError) {
//             console.warn(
//               `Failed to fetch character data for ID ${char.characterId}:`,
//               characterError
//             );
//           }

//           return {
//             requestCharacterId: char.requestCharacterId || null,
//             characterId: char.characterId,
//             cosplayerId,
//             cosplayerName,
//             characterName,
//             characterPrice,
//             salaryIndex,
//             averageStar,
//             height,
//             weight,
//             description: char.description || "",
//             quantity: char.quantity || 1,
//             listUpdateRequestDates: (char.requestDateResponses || []).map(
//               (date) => ({
//                 requestDateId: date.requestDateId || null,
//                 startDate: date.startDate || "",
//                 endDate: date.endDate || "",
//                 totalHour: date.totalHour || 0,
//               })
//             ),
//           };
//         })
//       );

//       const startDate = charactersList[0]?.requestDateResponses[0]?.startDate
//         ? dayjs(
//             charactersList[0].requestDateResponses[0].startDate,
//             "HH:mm DD/MM/YYYY"
//           )
//         : null;
//       const endDate = charactersList[0]?.requestDateResponses.slice(-1)[0]
//         ?.endDate
//         ? dayjs(
//             charactersList[0].requestDateResponses.slice(-1)[0].endDate,
//             "HH:mm DD/MM/YYYY"
//           )
//         : null;

//       setRequestData({
//         name: data.name || "",
//         description: data.description || "",
//         startDate,
//         endDate,
//         location: data.location || "",
//         serviceId: data.serviceId || "S002",
//         packageId: null,
//         totalDate: data.totalDate || 0,
//         listUpdateRequestCharacters,
//       });

//       form.setFieldsValue({
//         name: data.name || "",
//         description: data.description || "",
//         location: data.location || "",
//       });
//     } catch (error) {
//       console.error("Failed to fetch request details:", error);
//       toast.error("Failed to load request details.");
//     } finally {
//       setLoading(false);
//     }
//   }, [requestId, form]);

//   useEffect(() => {
//     if (visible && requestId) {
//       fetchRequestData();
//     }
//   }, [visible, requestId, fetchRequestData]);

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();

//       // Step 1: Re-fetch request data to ensure latest state
//       setLoading(true);
//       const latestRequestData = await MyHistoryService.getRequestByRequestId(
//         requestId
//       );
//       if (!latestRequestData || !latestRequestData.charactersListResponse) {
//         throw new Error("Failed to fetch latest request data.");
//       }

//       // Step 2: Validate cosplayer assignments for conflicts
//       for (const char of requestData.listUpdateRequestCharacters) {
//         if (!char.cosplayerId || !char.listUpdateRequestDates.length) {
//           continue; // Skip unassigned characters or those without dates
//         }

//         const dates = char.listUpdateRequestDates.map((date) => ({
//           startDate: date.startDate,
//           endDate: date.endDate,
//         }));

//         if (dates.length === 0) {
//           throw new Error(
//             `No date ranges found for character ${
//               char.characterName || char.characterId
//             }.`
//           );
//         }

//         const conflicts =
//           await MyHistoryService.getAllRequestCharacterByListDate(dates);
//         if (!conflicts || !Array.isArray(conflicts)) {
//           console.warn(
//             "Invalid conflicts response from getAllRequestCharacterByListDate"
//           );
//           throw new Error("Failed to verify cosplayer availability.");
//         }

//         // Filter out conflicts belonging to the current request
//         const bookedCosplayerIds = new Set(
//           conflicts
//             .filter((conflict) => conflict.requestId !== requestId)
//             .map((conflict) => conflict.cosplayerId?.toString().toLowerCase())
//             .filter(Boolean)
//         );

//         if (bookedCosplayerIds.has(char.cosplayerId.toString().toLowerCase())) {
//           let cosplayerName = char.cosplayerName || "Unknown Cosplayer";
//           try {
//             const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
//               char.cosplayerId
//             );
//             cosplayerName = cosplayerData?.name || "Unknown Cosplayer";
//           } catch (error) {
//             console.warn(
//               `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//               error
//             );
//           }
//           throw new Error(
//             `Cosplayer ${cosplayerName} is already booked for character ${
//               char.characterName || char.characterId
//             } during the selected time in another request.`
//           );
//         }
//       }

//       // Step 3: Prepare and submit updated request
//       const formattedData = {
//         name: values.name,
//         description: values.description,
//         price: totalPrice,
//         startDate: requestData.startDate
//           ? requestData.startDate.format("DD/MM/YYYY")
//           : "",
//         endDate: requestData.endDate
//           ? requestData.endDate.format("DD/MM/YYYY")
//           : "",
//         location: values.location,
//         serviceId: requestData.serviceId,
//         packageId: null,
//         listUpdateRequestCharacters:
//           requestData.listUpdateRequestCharacters.map((char) => ({
//             requestCharacterId: char.requestCharacterId || null,
//             characterId: char.characterId,
//             cosplayerId: char.cosplayerId,
//             description: char.description,
//             quantity: char.quantity,
//           })),
//       };

//       const response = await MyHistoryService.editRequest(
//         requestId,
//         formattedData
//       );
//       console.log(response?.message || "Request updated successfully!");
//       console.log("Request updated successfully!");
//       onSuccess();
//       onCancel();
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to update request. Please try again.";
//       toast.error(errorMessage);
//       console.error("Failed to update request:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangeCosplayer = async (
//     characterId,
//     currentCosplayerId,
//     index
//   ) => {
//     const dates = requestData.listUpdateRequestCharacters[
//       index
//     ].listUpdateRequestDates.map((date) => ({
//       startDate: date.startDate,
//       endDate: date.endDate,
//     }));

//     if (dates.length === 0) {
//       toast.error("No date ranges available for this character.");
//       return;
//     }

//     try {
//       // Step 1: Fetch available cosplayers
//       const data = {
//         characterId,
//         dates,
//         checkAccountRequest: true,
//       };
//       const available = await MyHistoryService.ChangeCosplayer(data);

//       // Step 2: Fetch booked cosplayers using getAllRequestCharacterByListDate
//       const conflicts = await MyHistoryService.getAllRequestCharacterByListDate(
//         dates
//       );
//       if (!conflicts || !Array.isArray(conflicts)) {
//         console.warn(
//           "Invalid conflicts response from getAllRequestCharacterByListDate"
//         );
//         toast.error("Failed to load available cosplayers.");
//         return;
//       }
//       const bookedCosplayerIds = new Set(
//         conflicts
//           .filter((conflict) => conflict.requestId !== requestId)
//           .map((conflict) => conflict.cosplayerId?.toString().toLowerCase())
//           .filter(Boolean)
//       );
//       setBookedCosplayerIds(bookedCosplayerIds);

//       // Step 3: Filter out cosplayers already assigned to other characters, except the current cosplayer
//       const uniqueAvailable = available.filter((cos) => {
//         const normalizedAccountId = cos.accountId?.toString().toLowerCase();
//         return (
//           normalizedAccountId ===
//             currentCosplayerId?.toString().toLowerCase() ||
//           !existingCosplayerIds.has(normalizedAccountId)
//         );
//       });

//       // Step 4: Fetch additional cosplayer data and add isBooked flag
//       const uniqueCosplayers = await Promise.all(
//         uniqueAvailable.map(async (cos) => {
//           try {
//             const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
//               cos.accountId
//             );
//             return {
//               name: cosplayerData.name || cos.name || "Unknown",
//               accountId: cosplayerData.accountId || cos.accountId,
//               averageStar: cosplayerData.averageStar || cos.averageStar || 0,
//               height: cosplayerData.height || cos.height || 0,
//               weight: cosplayerData.weight || cos.weight || 0,
//               salaryIndex: cosplayerData.salaryIndex || cos.salaryIndex || 0,
//               isBooked: bookedCosplayerIds.has(
//                 (cosplayerData.accountId || cos.accountId)
//                   .toString()
//                   .toLowerCase()
//               ), // Flag if booked
//             };
//           } catch (cosplayerError) {
//             console.warn(
//               `Failed to fetch cosplayer data for ID ${cos.accountId}:`,
//               cosplayerError
//             );
//             return null;
//           }
//         })
//       );

//       // Step 5: Remove null entries and ensure no duplicates
//       const finalCosplayers = uniqueCosplayers
//         .filter((cosplayer) => cosplayer !== null)
//         .reduce((acc, cosplayer) => {
//           const normalizedAccountId = cosplayer.accountId
//             .toString()
//             .toLowerCase();
//           if (
//             !acc.some(
//               (c) =>
//                 c.accountId.toString().toLowerCase() === normalizedAccountId
//             )
//           ) {
//             acc.push(cosplayer);
//           }
//           return acc;
//         }, []);

//       if (finalCosplayers.length === 0) {
//         toast.warn("No available cosplayers found for this character.");
//       }

//       setAvailableCosplayers(finalCosplayers);
//       setCurrentCharacterIndex(index);
//       setChangeCosplayerVisible(true);
//     } catch (error) {
//       console.error("Error fetching available cosplayers:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to load available cosplayers."
//       );
//     }
//   };

//   const handleCosplayerSelect = async (accountId) => {
//     const selectedCosplayer = availableCosplayers.find(
//       (cos) => cos.accountId === accountId
//     );
//     if (!selectedCosplayer) {
//       toast.error("Selected cosplayer not found.");
//       return;
//     }
//     if (selectedCosplayer.isBooked) {
//       toast.error(
//         `${selectedCosplayer.name} is already booked during the selected time in another request.`
//       );
//       return;
//     }
//     if (currentCharacterIndex !== null) {
//       const updatedCharacters = [...requestData.listUpdateRequestCharacters];
//       const char = updatedCharacters[currentCharacterIndex];
//       const previousCosplayerId = char.cosplayerId;

//       char.cosplayerId = accountId;
//       char.cosplayerName = selectedCosplayer.name;
//       char.averageStar = selectedCosplayer.averageStar;
//       char.height = selectedCosplayer.height;
//       char.weight = selectedCosplayer.weight;
//       char.salaryIndex = selectedCosplayer.salaryIndex;

//       setRequestData((prev) => ({
//         ...prev,
//         listUpdateRequestCharacters: updatedCharacters,
//       }));

//       setExistingCosplayerIds((prev) => {
//         const newSet = new Set(prev);
//         if (previousCosplayerId) newSet.delete(previousCosplayerId);
//         newSet.add(accountId);
//         return newSet;
//       });

//       setChangeCosplayerVisible(false);
//       setCurrentCharacterIndex(null);
//     }
//   };
//   const handleAddCosplayer = () => {
//     setAddCosplayerVisible(true);
//   };

//   const handleAddCosplayerSuccess = async () => {
//     try {
//       await fetchRequestData();
//       if (requestData.listUpdateRequestCharacters.length === 0) {
//         toast.warn(
//           "No characters found after adding cosplayer. Please verify the request."
//         );
//       }
//       setAddCosplayerVisible(false);
//     } catch (error) {
//       toast.error("Failed to refresh request data after adding cosplayer.");
//       console.error("Error refreshing request data:", error);
//     }
//   };

//   // Debounced delete handler
//   const performDelete = useCallback(
//     debounce(async (index, character) => {
//       setDeleteLoading(true);
//       try {
//         await MyHistoryService.DeleteCosplayerInReq(
//           character.requestCharacterId
//         );
//         toast.success("Cosplayer deleted successfully!");

//         if (character.cosplayerId) {
//           setExistingCosplayerIds((prev) => {
//             const newSet = new Set(prev);
//             newSet.delete(character.cosplayerId);
//             return newSet;
//           });
//         }

//         await fetchRequestData();

//         setCharacterPage((prev) => {
//           const newTotalPages = Math.ceil(
//             requestData.listUpdateRequestCharacters.length / charactersPerPage
//           );
//           return prev > newTotalPages ? Math.max(1, newTotalPages) : prev;
//         });
//       } catch (error) {
//         toast.error(
//           error.message || "Failed to delete cosplayer. Please try again."
//         );
//         console.error("Error deleting cosplayer:", error);
//       } finally {
//         setDeleteLoading(false);
//         setDeletingItems((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(character.requestCharacterId);
//           return newSet;
//         });
//       }
//     }, 300),
//     [
//       fetchRequestData,
//       requestData.listUpdateRequestCharacters,
//       charactersPerPage,
//     ]
//   );

//   const handleDeleteCosplayer = (index) => {
//     if (requestData.listUpdateRequestCharacters.length <= 1) {
//       toast.error(
//         "Cannot delete the last cosplayer. At least one cosplayer is required."
//       );
//       return;
//     }

//     const character = requestData.listUpdateRequestCharacters[index];
//     if (!character.requestCharacterId) {
//       toast.error("Invalid request character ID.");
//       return;
//     }

//     // Mark item as deleting for fade-out effect
//     setDeletingItems((prev) => {
//       const newSet = new Set(prev);
//       newSet.add(character.requestCharacterId);
//       return newSet;
//     });

//     // Delay actual deletion to allow animation
//     setTimeout(() => {
//       performDelete(index, character);
//     }, 300);
//   };

//   const handleSort = (field) => {
//     setSortField(field);
//     setSortOrder(sortOrder === "ascend" ? "descend" : "ascend");
//     setCurrentPage(1);
//   };

//   const sortedCosplayers = [...availableCosplayers].sort((a, b) => {
//     if (!a[sortField] && !b[sortField]) return 0;
//     if (!a[sortField]) return 1;
//     if (!b[sortField]) return -1;
//     return sortOrder === "ascend"
//       ? a[sortField] - b[sortField]
//       : b[sortField] - a[sortField];
//   });

//   const unbookedCosplayers = sortedCosplayers.filter(
//     (cosplayer) => !cosplayer.isBooked
//   );
//   const totalPages = Math.ceil(unbookedCosplayers.length / rowsPerPage);
//   const paginatedCosplayers = unbookedCosplayers.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page < 1 ? 1 : page > totalPages ? totalPages : page);
//   };

//   const totalCharacterPages = Math.ceil(
//     requestData.listUpdateRequestCharacters.length / charactersPerPage
//   );
//   const paginatedCharacters = requestData.listUpdateRequestCharacters.slice(
//     (characterPage - 1) * charactersPerPage,
//     characterPage * charactersPerPage
//   );

//   const handleCharacterPageChange = (page) => {
//     setCharacterPage(
//       page < 1 ? 1 : page > totalCharacterPages ? totalCharacterPages : page
//     );
//   };

//   const getCosplayerPrice = (char) => {
//     const totalHours = char.listUpdateRequestDates.reduce(
//       (sum, date) => sum + (date.totalHour || 0),
//       0
//     );

//     let totalDays = 0;
//     if (char.listUpdateRequestDates.length > 0) {
//       const startDate = dayjs(
//         char.listUpdateRequestDates[0].startDate,
//         "HH:mm DD/MM/YYYY"
//       );
//       const endDate = dayjs(
//         char.listUpdateRequestDates.slice(-1)[0].endDate,
//         "HH:mm DD/MM/YYYY"
//       );
//       if (startDate.isValid() && endDate.isValid()) {
//         totalDays = endDate.diff(startDate, "day") + 1;
//       }
//     }

//     return calculateCosplayerPrice(
//       char.salaryIndex,
//       char.characterPrice || 0,
//       totalHours,
//       totalDays
//     );
//   };

//   const toggleDates = (requestCharacterId) => {
//     setExpandedDates((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(requestCharacterId)) {
//         newSet.delete(requestCharacterId);
//       } else {
//         newSet.add(requestCharacterId);
//       }
//       return newSet;
//     });
//   };

//   return (
//     <ErrorBoundary>
//       <Modal
//         title="Edit Request for Hiring Cosplayer"
//         open={visible}
//         onOk={handleSubmit}
//         onCancel={onCancel}
//         okText="Save Changes"
//         cancelText="Cancel"
//         confirmLoading={loading}
//         width={1000}
//       >
//         <div ref={modalContentRef}>
//           {loading ? (
//             <div className="text-center">Loading...</div>
//           ) : (
//             <>
//               <Form form={form} layout="vertical">
//                 <Form.Item
//                   name="name"
//                   label="Name"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter the request name",
//                     },
//                   ]}
//                 >
//                   <Input placeholder="Enter request name" />
//                 </Form.Item>
//                 <Form.Item name="description" label="Description">
//                   <TextArea rows={4} placeholder="Enter request description" />
//                 </Form.Item>
//                 <Form.Item
//                   name="location"
//                   label="Location"
//                   rules={[
//                     { required: true, message: "Please enter the location" },
//                   ]}
//                 >
//                   <Input placeholder="Enter location" />
//                 </Form.Item>
//               </Form>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "16px",
//                 }}
//               >
//                 <h4>
//                   List of Requested Characters (Total Price:{" "}
//                   {totalPrice.toLocaleString()} VND)
//                 </h4>
//                 <Button
//                   type="primary"
//                   icon={<Plus size={16} />}
//                   onClick={handleAddCosplayer}
//                 >
//                   Add Cosplayer
//                 </Button>
//               </div>
//               <i style={{ color: "gray" }}>
//                 *Note: Unit Price hire cosplayer = (Total Hours × Hourly Rate) +
//                 (Character Price × Total Days)
//               </i>
//               {paginatedCharacters.length === 0 ? (
//                 <div className="text-center" style={{ marginTop: "16px" }}>
//                   No characters available.
//                 </div>
//               ) : (
//                 <List
//                   dataSource={paginatedCharacters}
//                   renderItem={(item, index) => (
//                     <List.Item
//                       key={item.requestCharacterId || `character-${index}`}
//                       style={{
//                         padding: "16px 0",
//                         opacity: deletingItems.has(item.requestCharacterId)
//                           ? 0.3
//                           : 1,
//                         transition: "opacity 0.3s ease",
//                       }}
//                     >
//                       <div style={{ width: "100%" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             marginBottom: "10px",
//                           }}
//                         >
//                           <div style={{ flex: 1 }}>
//                             <p style={{ margin: 0 }}>
//                               <span>Cosplayer Name: </span>
//                               <strong>{item.cosplayerName}</strong>
//                               {item.averageStar && (
//                                 <span> | Rating: {item.averageStar}/5</span>
//                               )}
//                               {item.height && (
//                                 <span> | Height: {item.height}cm</span>
//                               )}
//                               {item.weight && (
//                                 <span> | Weight: {item.weight}kg</span>
//                               )}
//                               {item.salaryIndex && (
//                                 <span>
//                                   {" "}
//                                   | Hourly Rate:{" "}
//                                   {item.salaryIndex.toLocaleString()} VND/h
//                                 </span>
//                               )}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Character <strong>{item.characterName}</strong>{" "}
//                               Price: {item.characterPrice.toLocaleString()} VND
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Quantity: {item.quantity}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Description: {item.description}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               <strong>
//                                 Price:{" "}
//                                 {getCosplayerPrice(item).toLocaleString()} VND
//                               </strong>
//                             </p>
//                           </div>
//                           <div style={{ display: "flex", gap: "8px" }}>
//                             <Button
//                               onClick={() =>
//                                 handleChangeCosplayer(
//                                   item.characterId,
//                                   item.cosplayerId,
//                                   requestData.listUpdateRequestCharacters.indexOf(
//                                     item
//                                   )
//                                 )
//                               }
//                               disabled={deletingItems.has(
//                                 item.requestCharacterId
//                               )}
//                             >
//                               Change Cosplayer
//                             </Button>
//                             <Popconfirm
//                               title="Are you sure you want to delete this cosplayer?"
//                               description={`This will remove ${item.cosplayerName} (${item.characterName}) from the request.`}
//                               onConfirm={() =>
//                                 handleDeleteCosplayer(
//                                   requestData.listUpdateRequestCharacters.indexOf(
//                                     item
//                                   )
//                                 )
//                               }
//                               okText="Yes"
//                               cancelText="No"
//                               placement="topRight"
//                             >
//                               <Button
//                                 danger
//                                 icon={<Delete size={16} />}
//                                 loading={
//                                   deleteLoading &&
//                                   deletingItems.has(item.requestCharacterId)
//                                 }
//                                 disabled={deletingItems.has(
//                                   item.requestCharacterId
//                                 )}
//                               >
//                                 Delete
//                               </Button>
//                             </Popconfirm>
//                           </div>
//                         </div>
//                         <div
//                           style={{
//                             marginTop: "8px",
//                             border: "1px solid #f0f0f0",
//                             borderRadius: "4px",
//                           }}
//                         >
//                           <Button
//                             type="link"
//                             onClick={() => toggleDates(item.requestCharacterId)}
//                             style={{
//                               width: "100%",
//                               textAlign: "left",
//                               padding: "8px 16px",
//                             }}
//                           >
//                             Request Dates
//                             {expandedDates.has(item.requestCharacterId) ? (
//                               <ChevronUp size={16} style={{ float: "right" }} />
//                             ) : (
//                               <ChevronDown
//                                 size={16}
//                                 style={{ float: "right" }}
//                               />
//                             )}
//                           </Button>
//                           {expandedDates.has(item.requestCharacterId) && (
//                             <List
//                               dataSource={item.listUpdateRequestDates}
//                               renderItem={(date, dateIndex) => (
//                                 <List.Item
//                                   key={
//                                     date.requestDateId || `date-${dateIndex}`
//                                   }
//                                   style={{
//                                     padding: "5px 16px",
//                                     borderBottom: "none",
//                                   }}
//                                 >
//                                   <div
//                                     style={{
//                                       display: "flex",
//                                       gap: "10px",
//                                       alignItems: "center",
//                                     }}
//                                   >
//                                     <span>
//                                       {date.startDate} - {date.endDate} (Total
//                                       Hours: {date.totalHour || 0})
//                                     </span>
//                                   </div>
//                                 </List.Item>
//                               )}
//                             />
//                           )}
//                         </div>
//                       </div>
//                     </List.Item>
//                   )}
//                 />
//               )}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "16px",
//                   marginTop: "16px",
//                 }}
//               >
//                 <Button
//                   onClick={() => handleCharacterPageChange(characterPage - 1)}
//                   disabled={characterPage === 1}
//                 >
//                   Previous
//                 </Button>
//                 <span>
//                   Page {characterPage} of {totalCharacterPages}
//                 </span>
//                 <Button
//                   onClick={() => handleCharacterPageChange(characterPage + 1)}
//                   disabled={characterPage === totalCharacterPages}
//                 >
//                   Next
//                 </Button>
//               </div>
//               <Modal
//                 title="Change Cosplayer"
//                 open={changeCosplayerVisible}
//                 onOk={() => setChangeCosplayerVisible(false)}
//                 onCancel={() => setChangeCosplayerVisible(false)}
//                 okText="Close"
//                 cancelText="Cancel"
//                 footer={
//                   <>
//                     <Button
//                       onClick={() =>
//                         handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
//                       }
//                     >
//                       Previous
//                     </Button>
//                     <span>
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <Button
//                       onClick={() =>
//                         handlePageChange(
//                           currentPage < totalPages
//                             ? currentPage + 1
//                             : totalPages
//                         )
//                       }
//                     >
//                       Next
//                     </Button>
//                     <Button
//                       className="btn btn-outline-danger"
//                       onClick={() => handleSort("salaryIndex")}
//                       style={{ marginBottom: "5px" }}
//                     >
//                       Hourly Salary{" "}
//                       {sortField === "salaryIndex" &&
//                         (sortOrder === "ascend" ? "↑" : "↓")}
//                     </Button>
//                   </>
//                 }
//               >
//                 {unbookedCosplayers.length === 0 ? (
//                   <div className="text-center">
//                     No available cosplayers for the selected time.
//                   </div>
//                 ) : (
//                   <List
//                     dataSource={paginatedCosplayers}
//                     renderItem={(cosplayer) => (
//                       <List.Item
//                         key={cosplayer.accountId}
//                         onClick={() =>
//                           handleCosplayerSelect(cosplayer.accountId)
//                         }
//                         style={{
//                           display: cosplayer.isBooked ? "none" : "block",
//                           cursor: "pointer",
//                           padding: "12px 16px",
//                           borderBottom: "1px solid #f0f0f0",
//                           transition: "background-color 0.2s",
//                         }}
//                       >
//                         <div
//                           className="cosplayer-row"
//                           style={{
//                             display: "grid",
//                             gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
//                             gap: "16px",
//                             width: "100%",
//                             alignItems: "center",
//                           }}
//                         >
//                           <span
//                             style={{
//                               textOverflow: "ellipsis",
//                               overflow: "hidden",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {cosplayer.name}
//                           </span>
//                           <span>{cosplayer.averageStar}/5</span>
//                           <span>{cosplayer.height}cm</span>
//                           <span>{cosplayer.weight}kg</span>
//                           <span>{cosplayer.salaryIndex.toLocaleString()}</span>
//                         </div>
//                       </List.Item>
//                     )}
//                   />
//                 )}
//               </Modal>
//               <AddCosplayerInReq
//                 visible={addCosplayerVisible}
//                 requestId={requestId}
//                 onCancel={() => setAddCosplayerVisible(false)}
//                 onSuccess={handleAddCosplayerSuccess}
//               />
//             </>
//           )}
//         </div>
//       </Modal>
//     </ErrorBoundary>
//   );
// };

// export default EditRequestHireCosplayer;

// check before save changes
// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { Form, Modal, Input, List, Button, Popconfirm } from "antd";
// import { Edit, Plus, Delete, ChevronDown, ChevronUp } from "lucide-react";
// import dayjs from "dayjs";
// import MyHistoryService from "../../services/HistoryService/MyHistoryService";
// import { toast } from "react-toastify";
// import AddCosplayerInReq from "./AddCosplayerInReq";
// import debounce from "lodash/debounce";
// const { TextArea } = Input;

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false, error: null };

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error("Error caught in ErrorBoundary:", error, errorInfo);
//     if (error.message.includes("ResizeObserver")) {
//       console.warn("ResizeObserver error detected:", error);
//     }
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div>
//           Something went wrong: {this.state.error?.message || "Unknown error"}.
//           Please try again.
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

// const EditRequestHireCosplayer = ({
//   visible,
//   requestId,
//   onCancel,
//   onSuccess,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [requestData, setRequestData] = useState({
//     name: "",
//     description: "",
//     startDate: null,
//     endDate: null,
//     location: "",
//     serviceId: "S002",
//     packageId: null,
//     totalDate: 0,
//     listUpdateRequestCharacters: [],
//   });
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [changeCosplayerVisible, setChangeCosplayerVisible] = useState(false);
//   const [availableCosplayers, setAvailableCosplayers] = useState([]);
//   const [currentCharacterIndex, setCurrentCharacterIndex] = useState(null);
//   const [existingCosplayerIds, setExistingCosplayerIds] = useState(new Set());
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortField, setSortField] = useState("averageStar");
//   const [sortOrder, setSortOrder] = useState("descend");
//   const [characterPage, setCharacterPage] = useState(1);
//   const [addCosplayerVisible, setAddCosplayerVisible] = useState(false);
//   const [deletingItems, setDeletingItems] = useState(new Set()); // New state for items being deleted
//   const [expandedDates, setExpandedDates] = useState(new Set()); // For custom toggle
//   const charactersPerPage = 2;
//   const rowsPerPage = 8;
//   const modalContentRef = useRef(null);
//   const [bookedCosplayerIds, setBookedCosplayerIds] = useState(new Set()); // Track booked cosplayer IDs
//   // Custom ResizeObserver with debounce
//   useEffect(() => {
//     if (!modalContentRef.current) return;

//     const debouncedResizeHandler = debounce(() => {
//       // Minimal resize handling
//     }, 200);

//     const resizeObserver = new ResizeObserver(debouncedResizeHandler);
//     resizeObserver.observe(modalContentRef.current);

//     return () => {
//       resizeObserver.disconnect();
//     };
//   }, [visible]);

//   // Calculate price for a single cosplayer
//   const calculateCosplayerPrice = (
//     salaryIndex,
//     characterPrice,
//     totalHours,
//     totalDays
//   ) => {
//     if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
//     return totalHours * salaryIndex + characterPrice * totalDays;
//   };

//   // Calculate total price for all cosplayers
//   const calculateTotalPrice = (characters) => {
//     return characters.reduce((total, char) => {
//       const totalHours = char.listUpdateRequestDates.reduce(
//         (sum, date) => sum + (date.totalHour || 0),
//         0
//       );

//       let totalDays = 0;
//       if (char.listUpdateRequestDates.length > 0) {
//         const startDate = dayjs(
//           char.listUpdateRequestDates[0].startDate,
//           "HH:mm DD/MM/YYYY"
//         );
//         const endDate = dayjs(
//           char.listUpdateRequestDates.slice(-1)[0].endDate,
//           "HH:mm DD/MM/YYYY"
//         );
//         if (startDate.isValid() && endDate.isValid()) {
//           totalDays = endDate.diff(startDate, "day") + 1;
//         } else {
//           console.warn(
//             "Invalid date format for cosplayer:",
//             char.cosplayerName
//           );
//         }
//       }

//       return (
//         total +
//         calculateCosplayerPrice(
//           char.salaryIndex,
//           char.characterPrice || 0,
//           totalHours,
//           totalDays
//         )
//       );
//     }, 0);
//   };

//   // Recalculate totalPrice
//   useEffect(() => {
//     const price = calculateTotalPrice(requestData.listUpdateRequestCharacters);
//     setTotalPrice(price);
//   }, [requestData.listUpdateRequestCharacters]);

//   const fetchRequestData = useCallback(async () => {
//     if (!requestId) return;
//     setLoading(true);
//     try {
//       const data = await MyHistoryService.getRequestByRequestId(requestId);
//       if (!data) throw new Error("Request data not found");

//       const charactersList = data.charactersListResponse || [];
//       const existingIds = new Set(
//         charactersList.map((char) => char.cosplayerId).filter(Boolean)
//       );
//       setExistingCosplayerIds(existingIds);

//       const listUpdateRequestCharacters = await Promise.all(
//         charactersList.map(async (char) => {
//           let cosplayerName = "Not Assigned";
//           let cosplayerId = char.cosplayerId || null;
//           let characterName = "Unknown";
//           let characterPrice = 0;
//           let salaryIndex = 1;
//           let averageStar = 0;
//           let height = 0;
//           let weight = 0;

//           if (char.cosplayerId) {
//             try {
//               const cosplayerData =
//                 await MyHistoryService.gotoHistoryByAccountId(char.cosplayerId);
//               cosplayerName = cosplayerData?.name || "Unknown";
//               salaryIndex = cosplayerData?.salaryIndex || 1;
//               cosplayerId = cosplayerData?.accountId || char.cosplayerId;
//               averageStar = cosplayerData?.averageStar || 0;
//               height = cosplayerData?.height || 0;
//               weight = cosplayerData?.weight || 0;
//             } catch (cosplayerError) {
//               console.warn(
//                 `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//                 cosplayerError
//               );
//             }
//           }

//           try {
//             const characterData = await MyHistoryService.getCharacterById(
//               char.characterId
//             );
//             characterName = characterData?.characterName || "Unknown";
//             characterPrice = characterData?.price || 0;
//           } catch (characterError) {
//             console.warn(
//               `Failed to fetch character data for ID ${char.characterId}:`,
//               characterError
//             );
//           }

//           return {
//             requestCharacterId: char.requestCharacterId || null,
//             characterId: char.characterId,
//             cosplayerId,
//             cosplayerName,
//             characterName,
//             characterPrice,
//             salaryIndex,
//             averageStar,
//             height,
//             weight,
//             description: char.description || "",
//             quantity: char.quantity || 1,
//             listUpdateRequestDates: (char.requestDateResponses || []).map(
//               (date) => ({
//                 requestDateId: date.requestDateId || null,
//                 startDate: date.startDate || "",
//                 endDate: date.endDate || "",
//                 totalHour: date.totalHour || 0,
//               })
//             ),
//           };
//         })
//       );

//       const startDate = charactersList[0]?.requestDateResponses[0]?.startDate
//         ? dayjs(
//             charactersList[0].requestDateResponses[0].startDate,
//             "HH:mm DD/MM/YYYY"
//           )
//         : null;
//       const endDate = charactersList[0]?.requestDateResponses.slice(-1)[0]
//         ?.endDate
//         ? dayjs(
//             charactersList[0].requestDateResponses.slice(-1)[0].endDate,
//             "HH:mm DD/MM/YYYY"
//           )
//         : null;

//       setRequestData({
//         name: data.name || "",
//         description: data.description || "",
//         startDate,
//         endDate,
//         location: data.location || "",
//         serviceId: data.serviceId || "S002",
//         packageId: null,
//         totalDate: data.totalDate || 0,
//         listUpdateRequestCharacters,
//       });

//       form.setFieldsValue({
//         name: data.name || "",
//         description: data.description || "",
//         location: data.location || "",
//       });
//     } catch (error) {
//       console.error("Failed to fetch request details:", error);
//       toast.error("Failed to load request details.");
//     } finally {
//       setLoading(false);
//     }
//   }, [requestId, form]);

//   useEffect(() => {
//     if (visible && requestId) {
//       fetchRequestData();
//     }
//   }, [visible, requestId, fetchRequestData]);

//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();

//       // Step 1: Re-fetch request data to ensure latest state
//       setLoading(true);
//       const latestRequestData = await MyHistoryService.getRequestByRequestId(
//         requestId
//       );
//       if (!latestRequestData || !latestRequestData.charactersListResponse) {
//         throw new Error("Failed to fetch latest request data.");
//       }

//       // Step 2: Check request status
//       if (latestRequestData.status === "Browsed") {
//         toast.warn(
//           "Your Status request has been change, please reload this page"
//         );
//         setLoading(false);
//         setTimeout(() => {
//           window.location.reload();
//         }, 2500);
//         return; // Stop further execution
//       }

//       // Step 3: Validate cosplayer assignments for conflicts
//       for (const char of requestData.listUpdateRequestCharacters) {
//         if (!char.cosplayerId || !char.listUpdateRequestDates.length) {
//           continue; // Skip unassigned characters or those without dates
//         }

//         const dates = char.listUpdateRequestDates.map((date) => ({
//           startDate: date.startDate,
//           endDate: date.endDate,
//         }));

//         if (dates.length === 0) {
//           throw new Error(
//             `No date ranges found for character ${
//               char.characterName || char.characterId
//             }.`
//           );
//         }

//         const conflicts =
//           await MyHistoryService.getAllRequestCharacterByListDate(dates);
//         if (!conflicts || !Array.isArray(conflicts)) {
//           console.warn(
//             "Invalid conflicts response from getAllRequestCharacterByListDate"
//           );
//           throw new Error("Failed to verify cosplayer availability.");
//         }

//         // Filter out conflicts belonging to the current request
//         const bookedCosplayerIds = new Set(
//           conflicts
//             .filter((conflict) => conflict.requestId !== requestId)
//             .map((conflict) => conflict.cosplayerId?.toString().toLowerCase())
//             .filter(Boolean)
//         );

//         if (bookedCosplayerIds.has(char.cosplayerId.toString().toLowerCase())) {
//           let cosplayerName = char.cosplayerName || "Unknown Cosplayer";
//           try {
//             const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
//               char.cosplayerId
//             );
//             cosplayerName = cosplayerData?.name || "Unknown Cosplayer";
//           } catch (error) {
//             console.warn(
//               `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
//               error
//             );
//           }
//           throw new Error(
//             `Cosplayer ${cosplayerName} is already booked for character ${
//               char.characterName || char.characterId
//             } during the selected time in another request.`
//           );
//         }
//       }

//       // Step 4: Prepare and submit updated request
//       const formattedData = {
//         name: values.name,
//         description: values.description,
//         price: totalPrice,
//         startDate: requestData.startDate
//           ? requestData.startDate.format("DD/MM/YYYY")
//           : "",
//         endDate: requestData.endDate
//           ? requestData.endDate.format("DD/MM/YYYY")
//           : "",
//         location: values.location,
//         serviceId: requestData.serviceId,
//         packageId: null,
//         listUpdateRequestCharacters:
//           requestData.listUpdateRequestCharacters.map((char) => ({
//             requestCharacterId: char.requestCharacterId || null,
//             characterId: char.characterId,
//             cosplayerId: char.cosplayerId,
//             description: char.description,
//             quantity: char.quantity,
//           })),
//       };

//       const response = await MyHistoryService.editRequest(
//         requestId,
//         formattedData
//       );
//       console.log(response?.message || "Request updated successfully!");
//       console.log("Request updated successfully!");
//       onSuccess();
//       onCancel();
//     } catch (error) {
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to update request. Please try again.";
//       toast.error(errorMessage);
//       console.error("Failed to update request:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangeCosplayer = async (
//     characterId,
//     currentCosplayerId,
//     index
//   ) => {
//     const dates = requestData.listUpdateRequestCharacters[
//       index
//     ].listUpdateRequestDates.map((date) => ({
//       startDate: date.startDate,
//       endDate: date.endDate,
//     }));

//     if (dates.length === 0) {
//       toast.error("No date ranges available for this character.");
//       return;
//     }

//     try {
//       // Step 1: Fetch available cosplayers
//       const data = {
//         characterId,
//         dates,
//         checkAccountRequest: true,
//       };
//       const available = await MyHistoryService.ChangeCosplayer(data);

//       // Step 2: Fetch booked cosplayers using getAllRequestCharacterByListDate
//       const conflicts = await MyHistoryService.getAllRequestCharacterByListDate(
//         dates
//       );
//       if (!conflicts || !Array.isArray(conflicts)) {
//         console.warn(
//           "Invalid conflicts response from getAllRequestCharacterByListDate"
//         );
//         toast.error("Failed to load available cosplayers.");
//         return;
//       }
//       const bookedCosplayerIds = new Set(
//         conflicts
//           .filter((conflict) => conflict.requestId !== requestId)
//           .map((conflict) => conflict.cosplayerId?.toString().toLowerCase())
//           .filter(Boolean)
//       );
//       setBookedCosplayerIds(bookedCosplayerIds);

//       // Step 3: Filter out cosplayers already assigned to other characters, except the current cosplayer
//       const uniqueAvailable = available.filter((cos) => {
//         const normalizedAccountId = cos.accountId?.toString().toLowerCase();
//         return (
//           normalizedAccountId ===
//             currentCosplayerId?.toString().toLowerCase() ||
//           !existingCosplayerIds.has(normalizedAccountId)
//         );
//       });

//       // Step 4: Fetch additional cosplayer data and add isBooked flag
//       const uniqueCosplayers = await Promise.all(
//         uniqueAvailable.map(async (cos) => {
//           try {
//             const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
//               cos.accountId
//             );
//             return {
//               name: cosplayerData.name || cos.name || "Unknown",
//               accountId: cosplayerData.accountId || cos.accountId,
//               averageStar: cosplayerData.averageStar || cos.averageStar || 0,
//               height: cosplayerData.height || cos.height || 0,
//               weight: cosplayerData.weight || cos.weight || 0,
//               salaryIndex: cosplayerData.salaryIndex || cos.salaryIndex || 0,
//               isBooked: bookedCosplayerIds.has(
//                 (cosplayerData.accountId || cos.accountId)
//                   .toString()
//                   .toLowerCase()
//               ), // Flag if booked
//             };
//           } catch (cosplayerError) {
//             console.warn(
//               `Failed to fetch cosplayer data for ID ${cos.accountId}:`,
//               cosplayerError
//             );
//             return null;
//           }
//         })
//       );

//       // Step 5: Remove null entries and ensure no duplicates
//       const finalCosplayers = uniqueCosplayers
//         .filter((cosplayer) => cosplayer !== null)
//         .reduce((acc, cosplayer) => {
//           const normalizedAccountId = cosplayer.accountId
//             .toString()
//             .toLowerCase();
//           if (
//             !acc.some(
//               (c) =>
//                 c.accountId.toString().toLowerCase() === normalizedAccountId
//             )
//           ) {
//             acc.push(cosplayer);
//           }
//           return acc;
//         }, []);

//       if (finalCosplayers.length === 0) {
//         toast.warn("No available cosplayers found for this character.");
//       }

//       setAvailableCosplayers(finalCosplayers);
//       setCurrentCharacterIndex(index);
//       setChangeCosplayerVisible(true);
//     } catch (error) {
//       console.error("Error fetching available cosplayers:", error);
//       toast.error(
//         error.response?.data?.message || "Failed to load available cosplayers."
//       );
//     }
//   };

//   const handleCosplayerSelect = async (accountId) => {
//     const selectedCosplayer = availableCosplayers.find(
//       (cos) => cos.accountId === accountId
//     );
//     if (!selectedCosplayer) {
//       toast.error("Selected cosplayer not found.");
//       return;
//     }
//     if (selectedCosplayer.isBooked) {
//       toast.error(
//         `${selectedCosplayer.name} is already booked during the selected time in another request.`
//       );
//       return;
//     }
//     if (currentCharacterIndex !== null) {
//       const updatedCharacters = [...requestData.listUpdateRequestCharacters];
//       const char = updatedCharacters[currentCharacterIndex];
//       const previousCosplayerId = char.cosplayerId;

//       char.cosplayerId = accountId;
//       char.cosplayerName = selectedCosplayer.name;
//       char.averageStar = selectedCosplayer.averageStar;
//       char.height = selectedCosplayer.height;
//       char.weight = selectedCosplayer.weight;
//       char.salaryIndex = selectedCosplayer.salaryIndex;

//       setRequestData((prev) => ({
//         ...prev,
//         listUpdateRequestCharacters: updatedCharacters,
//       }));

//       setExistingCosplayerIds((prev) => {
//         const newSet = new Set(prev);
//         if (previousCosplayerId) newSet.delete(previousCosplayerId);
//         newSet.add(accountId);
//         return newSet;
//       });

//       setChangeCosplayerVisible(false);
//       setCurrentCharacterIndex(null);
//     }
//   };
//   const handleAddCosplayer = () => {
//     setAddCosplayerVisible(true);
//   };

//   const handleAddCosplayerSuccess = async () => {
//     try {
//       await fetchRequestData();
//       if (requestData.listUpdateRequestCharacters.length === 0) {
//         toast.warn(
//           "No characters found after adding cosplayer. Please verify the request."
//         );
//       }
//       setAddCosplayerVisible(false);
//     } catch (error) {
//       toast.error("Failed to refresh request data after adding cosplayer.");
//       console.error("Error refreshing request data:", error);
//     }
//   };

//   // Debounced delete handler
//   const performDelete = useCallback(
//     debounce(async (index, character) => {
//       setDeleteLoading(true);
//       try {
//         await MyHistoryService.DeleteCosplayerInReq(
//           character.requestCharacterId
//         );
//         toast.success("Cosplayer deleted successfully!");

//         if (character.cosplayerId) {
//           setExistingCosplayerIds((prev) => {
//             const newSet = new Set(prev);
//             newSet.delete(character.cosplayerId);
//             return newSet;
//           });
//         }

//         await fetchRequestData();

//         setCharacterPage((prev) => {
//           const newTotalPages = Math.ceil(
//             requestData.listUpdateRequestCharacters.length / charactersPerPage
//           );
//           return prev > newTotalPages ? Math.max(1, newTotalPages) : prev;
//         });
//       } catch (error) {
//         toast.error(
//           error.message || "Failed to delete cosplayer. Please try again."
//         );
//         console.error("Error deleting cosplayer:", error);
//       } finally {
//         setDeleteLoading(false);
//         setDeletingItems((prev) => {
//           const newSet = new Set(prev);
//           newSet.delete(character.requestCharacterId);
//           return newSet;
//         });
//       }
//     }, 300),
//     [
//       fetchRequestData,
//       requestData.listUpdateRequestCharacters,
//       charactersPerPage,
//     ]
//   );

//   const handleDeleteCosplayer = (index) => {
//     if (requestData.listUpdateRequestCharacters.length <= 1) {
//       toast.error(
//         "Cannot delete the last cosplayer. At least one cosplayer is required."
//       );
//       return;
//     }

//     const character = requestData.listUpdateRequestCharacters[index];
//     if (!character.requestCharacterId) {
//       toast.error("Invalid request character ID.");
//       return;
//     }

//     // Mark item as deleting for fade-out effect
//     setDeletingItems((prev) => {
//       const newSet = new Set(prev);
//       newSet.add(character.requestCharacterId);
//       return newSet;
//     });

//     // Delay actual deletion to allow animation
//     setTimeout(() => {
//       performDelete(index, character);
//     }, 300);
//   };

//   const handleSort = (field) => {
//     setSortField(field);
//     setSortOrder(sortOrder === "ascend" ? "descend" : "ascend");
//     setCurrentPage(1);
//   };

//   const sortedCosplayers = [...availableCosplayers].sort((a, b) => {
//     if (!a[sortField] && !b[sortField]) return 0;
//     if (!a[sortField]) return 1;
//     if (!b[sortField]) return -1;
//     return sortOrder === "ascend"
//       ? a[sortField] - b[sortField]
//       : b[sortField] - a[sortField];
//   });

//   const unbookedCosplayers = sortedCosplayers.filter(
//     (cosplayer) => !cosplayer.isBooked
//   );
//   const totalPages = Math.ceil(unbookedCosplayers.length / rowsPerPage);
//   const paginatedCosplayers = unbookedCosplayers.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page < 1 ? 1 : page > totalPages ? totalPages : page);
//   };

//   const totalCharacterPages = Math.ceil(
//     requestData.listUpdateRequestCharacters.length / charactersPerPage
//   );
//   const paginatedCharacters = requestData.listUpdateRequestCharacters.slice(
//     (characterPage - 1) * charactersPerPage,
//     characterPage * charactersPerPage
//   );

//   const handleCharacterPageChange = (page) => {
//     setCharacterPage(
//       page < 1 ? 1 : page > totalCharacterPages ? totalCharacterPages : page
//     );
//   };

//   const getCosplayerPrice = (char) => {
//     const totalHours = char.listUpdateRequestDates.reduce(
//       (sum, date) => sum + (date.totalHour || 0),
//       0
//     );

//     let totalDays = 0;
//     if (char.listUpdateRequestDates.length > 0) {
//       const startDate = dayjs(
//         char.listUpdateRequestDates[0].startDate,
//         "HH:mm DD/MM/YYYY"
//       );
//       const endDate = dayjs(
//         char.listUpdateRequestDates.slice(-1)[0].endDate,
//         "HH:mm DD/MM/YYYY"
//       );
//       if (startDate.isValid() && endDate.isValid()) {
//         totalDays = endDate.diff(startDate, "day") + 1;
//       }
//     }

//     return calculateCosplayerPrice(
//       char.salaryIndex,
//       char.characterPrice || 0,
//       totalHours,
//       totalDays
//     );
//   };

//   const toggleDates = (requestCharacterId) => {
//     setExpandedDates((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(requestCharacterId)) {
//         newSet.delete(requestCharacterId);
//       } else {
//         newSet.add(requestCharacterId);
//       }
//       return newSet;
//     });
//   };

//   return (
//     <ErrorBoundary>
//       <Modal
//         title="Edit Request for Hiring Cosplayer"
//         open={visible}
//         onOk={handleSubmit}
//         onCancel={onCancel}
//         okText="Save Changes"
//         cancelText="Cancel"
//         confirmLoading={loading}
//         width={1000}
//       >
//         <div ref={modalContentRef}>
//           {loading ? (
//             <div className="text-center">Loading...</div>
//           ) : (
//             <>
//               <Form form={form} layout="vertical">
//                 <Form.Item
//                   name="name"
//                   label="Name"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please enter the request name",
//                     },
//                   ]}
//                 >
//                   <Input placeholder="Enter request name" />
//                 </Form.Item>
//                 <Form.Item name="description" label="Description">
//                   <TextArea rows={4} placeholder="Enter request description" />
//                 </Form.Item>
//                 <Form.Item
//                   name="location"
//                   label="Location"
//                   rules={[
//                     { required: true, message: "Please enter the location" },
//                   ]}
//                 >
//                   <Input placeholder="Enter location" />
//                 </Form.Item>
//               </Form>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginBottom: "16px",
//                 }}
//               >
//                 <h4>
//                   List of Requested Characters (Total Price:{" "}
//                   {totalPrice.toLocaleString()} VND)
//                 </h4>
//                 <Button
//                   type="primary"
//                   icon={<Plus size={16} />}
//                   onClick={handleAddCosplayer}
//                 >
//                   Add Cosplayer
//                 </Button>
//               </div>
//               <i style={{ color: "gray" }}>
//                 *Note: Unit Price hire cosplayer = (Total Hours × Hourly Rate) +
//                 (Character Price × Total Days)
//               </i>
//               {paginatedCharacters.length === 0 ? (
//                 <div className="text-center" style={{ marginTop: "16px" }}>
//                   No characters available.
//                 </div>
//               ) : (
//                 <List
//                   dataSource={paginatedCharacters}
//                   renderItem={(item, index) => (
//                     <List.Item
//                       key={item.requestCharacterId || `character-${index}`}
//                       style={{
//                         padding: "16px 0",
//                         opacity: deletingItems.has(item.requestCharacterId)
//                           ? 0.3
//                           : 1,
//                         transition: "opacity 0.3s ease",
//                       }}
//                     >
//                       <div style={{ width: "100%" }}>
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             marginBottom: "10px",
//                           }}
//                         >
//                           <div style={{ flex: 1 }}>
//                             <p style={{ margin: 0 }}>
//                               <span>Cosplayer Name: </span>
//                               <strong>{item.cosplayerName}</strong>
//                               {item.averageStar && (
//                                 <span> | Rating: {item.averageStar}/5</span>
//                               )}
//                               {item.height && (
//                                 <span> | Height: {item.height}cm</span>
//                               )}
//                               {item.weight && (
//                                 <span> | Weight: {item.weight}kg</span>
//                               )}
//                               {item.salaryIndex && (
//                                 <span>
//                                   {" "}
//                                   | Hourly Rate:{" "}
//                                   {item.salaryIndex.toLocaleString()} VND/h
//                                 </span>
//                               )}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Character <strong>{item.characterName}</strong>{" "}
//                               Price: {item.characterPrice.toLocaleString()} VND
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Quantity: {item.quantity}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               Description: {item.description}
//                             </p>
//                             <p style={{ margin: "4px 0" }}>
//                               <strong>
//                                 Price:{" "}
//                                 {getCosplayerPrice(item).toLocaleString()} VND
//                               </strong>
//                             </p>
//                           </div>
//                           <div style={{ display: "flex", gap: "8px" }}>
//                             <Button
//                               onClick={() =>
//                                 handleChangeCosplayer(
//                                   item.characterId,
//                                   item.cosplayerId,
//                                   requestData.listUpdateRequestCharacters.indexOf(
//                                     item
//                                   )
//                                 )
//                               }
//                               disabled={deletingItems.has(
//                                 item.requestCharacterId
//                               )}
//                             >
//                               Change Cosplayer
//                             </Button>
//                             <Popconfirm
//                               title="Are you sure you want to delete this cosplayer?"
//                               description={`This will remove ${item.cosplayerName} (${item.characterName}) from the request.`}
//                               onConfirm={() =>
//                                 handleDeleteCosplayer(
//                                   requestData.listUpdateRequestCharacters.indexOf(
//                                     item
//                                   )
//                                 )
//                               }
//                               okText="Yes"
//                               cancelText="No"
//                               placement="topRight"
//                             >
//                               <Button
//                                 danger
//                                 icon={<Delete size={16} />}
//                                 loading={
//                                   deleteLoading &&
//                                   deletingItems.has(item.requestCharacterId)
//                                 }
//                                 disabled={deletingItems.has(
//                                   item.requestCharacterId
//                                 )}
//                               >
//                                 Delete
//                               </Button>
//                             </Popconfirm>
//                           </div>
//                         </div>
//                         <div
//                           style={{
//                             marginTop: "8px",
//                             border: "1px solid #f0f0f0",
//                             borderRadius: "4px",
//                           }}
//                         >
//                           <Button
//                             type="link"
//                             onClick={() => toggleDates(item.requestCharacterId)}
//                             style={{
//                               width: "100%",
//                               textAlign: "left",
//                               padding: "8px 16px",
//                             }}
//                           >
//                             Request Dates
//                             {expandedDates.has(item.requestCharacterId) ? (
//                               <ChevronUp size={16} style={{ float: "right" }} />
//                             ) : (
//                               <ChevronDown
//                                 size={16}
//                                 style={{ float: "right" }}
//                               />
//                             )}
//                           </Button>
//                           {expandedDates.has(item.requestCharacterId) && (
//                             <List
//                               dataSource={item.listUpdateRequestDates}
//                               renderItem={(date, dateIndex) => (
//                                 <List.Item
//                                   key={
//                                     date.requestDateId || `date-${dateIndex}`
//                                   }
//                                   style={{
//                                     padding: "5px 16px",
//                                     borderBottom: "none",
//                                   }}
//                                 >
//                                   <div
//                                     style={{
//                                       display: "flex",
//                                       gap: "10px",
//                                       alignItems: "center",
//                                     }}
//                                   >
//                                     <span>
//                                       {date.startDate} - {date.endDate} (Total
//                                       Hours: {date.totalHour || 0})
//                                     </span>
//                                   </div>
//                                 </List.Item>
//                               )}
//                             />
//                           )}
//                         </div>
//                       </div>
//                     </List.Item>
//                   )}
//                 />
//               )}
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "16px",
//                   marginTop: "16px",
//                 }}
//               >
//                 <Button
//                   onClick={() => handleCharacterPageChange(characterPage - 1)}
//                   disabled={characterPage === 1}
//                 >
//                   Previous
//                 </Button>
//                 <span>
//                   Page {characterPage} of {totalCharacterPages}
//                 </span>
//                 <Button
//                   onClick={() => handleCharacterPageChange(characterPage + 1)}
//                   disabled={characterPage === totalCharacterPages}
//                 >
//                   Next
//                 </Button>
//               </div>
//               <Modal
//                 title="Change Cosplayer"
//                 open={changeCosplayerVisible}
//                 onOk={() => setChangeCosplayerVisible(false)}
//                 onCancel={() => setChangeCosplayerVisible(false)}
//                 okText="Close"
//                 cancelText="Cancel"
//                 footer={
//                   <div>
//                     <Button
//                       className="btn btn-outline-danger"
//                       onClick={() => handleSort("salaryIndex")}
//                       style={{ marginBottom: "5px" }}
//                     >
//                       Hourly Salary{" "}
//                       {sortField === "salaryIndex" &&
//                         (sortOrder === "ascend" ? "↑" : "↓")}
//                     </Button>
//                     <Button
//                       onClick={() =>
//                         handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
//                       }
//                     >
//                       Previous
//                     </Button>
//                     <span>
//                       Page {currentPage} of {totalPages}
//                     </span>
//                     <Button
//                       onClick={() =>
//                         handlePageChange(
//                           currentPage < totalPages
//                             ? currentPage + 1
//                             : totalPages
//                         )
//                       }
//                     >
//                       Next
//                     </Button>
//                     <Button className="btn btn-primary">Done</Button>
//                   </div>
//                 }
//               >
//                 {unbookedCosplayers.length === 0 ? (
//                   <div className="text-center">
//                     No available cosplayers for the selected time.
//                   </div>
//                 ) : (
//                   <List
//                     dataSource={paginatedCosplayers}
//                     renderItem={(cosplayer) => (
//                       <List.Item
//                         key={cosplayer.accountId}
//                         onClick={() =>
//                           handleCosplayerSelect(cosplayer.accountId)
//                         }
//                         style={{
//                           display: cosplayer.isBooked ? "none" : "block",
//                           cursor: "pointer",
//                           padding: "12px 16px",
//                           borderBottom: "1px solid #f0f0f0",
//                           transition: "background-color 0.2s",
//                         }}
//                       >
//                         <div
//                           className="cosplayer-row"
//                           style={{
//                             display: "grid",
//                             gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
//                             gap: "16px",
//                             width: "100%",
//                             alignItems: "center",
//                           }}
//                         >
//                           <span
//                             style={{
//                               textOverflow: "ellipsis",
//                               overflow: "hidden",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {cosplayer.name}
//                           </span>
//                           <span>{cosplayer.averageStar}/5</span>
//                           <span>{cosplayer.height}cm</span>
//                           <span>{cosplayer.weight}kg</span>
//                           <span>{cosplayer.salaryIndex.toLocaleString()}</span>
//                         </div>
//                       </List.Item>
//                     )}
//                   />
//                 )}
//               </Modal>
//               <AddCosplayerInReq
//                 visible={addCosplayerVisible}
//                 requestId={requestId}
//                 onCancel={() => setAddCosplayerVisible(false)}
//                 onSuccess={handleAddCosplayerSuccess}
//               />
//             </>
//           )}
//         </div>
//       </Modal>
//     </ErrorBoundary>
//   );
// };

// export default EditRequestHireCosplayer;

// fix change cosplayer
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Form, Modal, Input, List, Button, Popconfirm } from "antd";
import { Edit, Plus, Delete, ChevronDown, ChevronUp } from "lucide-react";
import dayjs from "dayjs";
import MyHistoryService from "../../services/HistoryService/MyHistoryService";
import { toast } from "react-toastify";
import AddCosplayerInReq from "./AddCosplayerInReq";
import debounce from "lodash/debounce";
const { TextArea } = Input;

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
    if (error.message.includes("ResizeObserver")) {
      console.warn("ResizeObserver error detected:", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          Something went wrong: {this.state.error?.message || "Unknown error"}.
          Please try again.
        </div>
      );
    }
    return this.props.children;
  }
}

const EditRequestHireCosplayer = ({
  visible,
  requestId,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [requestData, setRequestData] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    location: "",
    serviceId: "S002",
    packageId: null,
    totalDate: 0,
    listUpdateRequestCharacters: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [changeCosplayerVisible, setChangeCosplayerVisible] = useState(false);
  const [availableCosplayers, setAvailableCosplayers] = useState([]);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(null);
  const [existingCosplayerIds, setExistingCosplayerIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("averageStar");
  const [sortOrder, setSortOrder] = useState("descend");
  const [characterPage, setCharacterPage] = useState(1);
  const [addCosplayerVisible, setAddCosplayerVisible] = useState(false);
  const [deletingItems, setDeletingItems] = useState(new Set()); // New state for items being deleted
  const [expandedDates, setExpandedDates] = useState(new Set()); // For custom toggle
  const charactersPerPage = 2;
  const rowsPerPage = 8;
  const modalContentRef = useRef(null);
  const [bookedCosplayerIds, setBookedCosplayerIds] = useState(new Set()); // Track booked cosplayer IDs
  const [selectedCosplayerId, setSelectedCosplayerId] = useState(null); // Thêm state mới

  // Custom ResizeObserver with debounce
  useEffect(() => {
    if (!modalContentRef.current) return;

    const debouncedResizeHandler = debounce(() => {
      // Minimal resize handling
    }, 200);

    const resizeObserver = new ResizeObserver(debouncedResizeHandler);
    resizeObserver.observe(modalContentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [visible]);

  // Calculate price for a single cosplayer
  const calculateCosplayerPrice = (
    salaryIndex,
    characterPrice,
    totalHours,
    totalDays
  ) => {
    if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
    return totalHours * salaryIndex + characterPrice * totalDays;
  };

  // Calculate total price for all cosplayers
  const calculateTotalPrice = (characters) => {
    return characters.reduce((total, char) => {
      const totalHours = char.listUpdateRequestDates.reduce(
        (sum, date) => sum + (date.totalHour || 0),
        0
      );

      let totalDays = 0;
      if (char.listUpdateRequestDates.length > 0) {
        const startDate = dayjs(
          char.listUpdateRequestDates[0].startDate,
          "HH:mm DD/MM/YYYY"
        );
        const endDate = dayjs(
          char.listUpdateRequestDates.slice(-1)[0].endDate,
          "HH:mm DD/MM/YYYY"
        );
        if (startDate.isValid() && endDate.isValid()) {
          totalDays = endDate.diff(startDate, "day") + 1;
        } else {
          console.warn(
            "Invalid date format for cosplayer:",
            char.cosplayerName
          );
        }
      }

      return (
        total +
        calculateCosplayerPrice(
          char.salaryIndex,
          char.characterPrice || 0,
          totalHours,
          totalDays
        )
      );
    }, 0);
  };

  // Recalculate totalPrice
  useEffect(() => {
    const price = calculateTotalPrice(requestData.listUpdateRequestCharacters);
    setTotalPrice(price);
  }, [requestData.listUpdateRequestCharacters]);

  const fetchRequestData = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    try {
      const data = await MyHistoryService.getRequestByRequestId(requestId);
      if (!data) throw new Error("Request data not found");

      const charactersList = data.charactersListResponse || [];
      const existingIds = new Set(
        charactersList.map((char) => char.cosplayerId).filter(Boolean)
      );
      setExistingCosplayerIds(existingIds);

      const listUpdateRequestCharacters = await Promise.all(
        charactersList.map(async (char) => {
          let cosplayerName = "Not Assigned";
          let cosplayerId = char.cosplayerId || null;
          let characterName = "Unknown";
          let characterPrice = 0;
          let salaryIndex = 1;
          let averageStar = 0;
          let height = 0;
          let weight = 0;

          if (char.cosplayerId) {
            try {
              const cosplayerData =
                await MyHistoryService.gotoHistoryByAccountId(char.cosplayerId);
              cosplayerName = cosplayerData?.name || "Unknown";
              salaryIndex = cosplayerData?.salaryIndex || 1;
              cosplayerId = cosplayerData?.accountId || char.cosplayerId;
              averageStar = cosplayerData?.averageStar || 0;
              height = cosplayerData?.height || 0;
              weight = cosplayerData?.weight || 0;
            } catch (cosplayerError) {
              console.warn(
                `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
                cosplayerError
              );
            }
          }

          try {
            const characterData = await MyHistoryService.getCharacterById(
              char.characterId
            );
            characterName = characterData?.characterName || "Unknown";
            characterPrice = characterData?.price || 0;
          } catch (characterError) {
            console.warn(
              `Failed to fetch character data for ID ${char.characterId}:`,
              characterError
            );
          }

          return {
            requestCharacterId: char.requestCharacterId || null,
            characterId: char.characterId,
            cosplayerId,
            cosplayerName,
            characterName,
            characterPrice,
            salaryIndex,
            averageStar,
            height,
            weight,
            description: char.description || "",
            quantity: char.quantity || 1,
            listUpdateRequestDates: (char.requestDateResponses || []).map(
              (date) => ({
                requestDateId: date.requestDateId || null,
                startDate: date.startDate || "",
                endDate: date.endDate || "",
                totalHour: date.totalHour || 0,
              })
            ),
          };
        })
      );

      const startDate = charactersList[0]?.requestDateResponses[0]?.startDate
        ? dayjs(
            charactersList[0].requestDateResponses[0].startDate,
            "HH:mm DD/MM/YYYY"
          )
        : null;
      const endDate = charactersList[0]?.requestDateResponses.slice(-1)[0]
        ?.endDate
        ? dayjs(
            charactersList[0].requestDateResponses.slice(-1)[0].endDate,
            "HH:mm DD/MM/YYYY"
          )
        : null;

      setRequestData({
        name: data.name || "",
        description: data.description || "",
        startDate,
        endDate,
        location: data.location || "",
        serviceId: data.serviceId || "S002",
        packageId: null,
        totalDate: data.totalDate || 0,
        listUpdateRequestCharacters,
      });

      form.setFieldsValue({
        name: data.name || "",
        description: data.description || "",
        location: data.location || "",
      });
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      toast.error("Failed to load request details.");
    } finally {
      setLoading(false);
    }
  }, [requestId, form]);

  useEffect(() => {
    if (visible && requestId) {
      fetchRequestData();
    }
  }, [visible, requestId, fetchRequestData]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Step 1: Re-fetch request data to ensure latest state
      setLoading(true);
      const latestRequestData = await MyHistoryService.getRequestByRequestId(
        requestId
      );
      if (!latestRequestData || !latestRequestData.charactersListResponse) {
        throw new Error("Failed to fetch latest request data.");
      }

      // Step 2: Check request status
      if (latestRequestData.status === "Browsed") {
        toast.warn(
          "Your Status request has been change, please reload this page"
        );
        setLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
        return; // Stop further execution
      }

      // Step 3: Validate cosplayer assignments for conflicts
      for (const char of requestData.listUpdateRequestCharacters) {
        if (!char.cosplayerId || !char.listUpdateRequestDates.length) {
          continue; // Skip unassigned characters or those without dates
        }

        const dates = char.listUpdateRequestDates.map((date) => ({
          startDate: date.startDate,
          endDate: date.endDate,
        }));

        if (dates.length === 0) {
          throw new Error(
            `No date ranges found for character ${
              char.characterName || char.characterId
            }.`
          );
        }

        const conflicts =
          await MyHistoryService.getAllRequestCharacterByListDate(dates);
        if (!conflicts || !Array.isArray(conflicts)) {
          console.warn(
            "Invalid conflicts response from getAllRequestCharacterByListDate"
          );
          throw new Error("Failed to verify cosplayer availability.");
        }

        // Filter out conflicts belonging to the current request
        const bookedCosplayerIds = new Set(
          conflicts
            .filter((conflict) => conflict.requestId !== requestId)
            .map((conflict) => conflict.cosplayerId?.toString().toLowerCase())
            .filter(Boolean)
        );

        if (bookedCosplayerIds.has(char.cosplayerId.toString().toLowerCase())) {
          let cosplayerName = char.cosplayerName || "Unknown Cosplayer";
          try {
            const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
              char.cosplayerId
            );
            cosplayerName = cosplayerData?.name || "Unknown Cosplayer";
          } catch (error) {
            console.warn(
              `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
              error
            );
          }
          throw new Error(
            `Cosplayer ${cosplayerName} is already booked for character ${
              char.characterName || char.characterId
            } during the selected time in another request.`
          );
        }
      }

      // Step 4: Prepare and submit updated request
      const formattedData = {
        name: values.name,
        description: values.description,
        price: totalPrice,
        startDate: requestData.startDate
          ? requestData.startDate.format("DD/MM/YYYY")
          : "",
        endDate: requestData.endDate
          ? requestData.endDate.format("DD/MM/YYYY")
          : "",
        location: values.location,
        serviceId: requestData.serviceId,
        packageId: null,
        listUpdateRequestCharacters:
          requestData.listUpdateRequestCharacters.map((char) => ({
            requestCharacterId: char.requestCharacterId || null,
            characterId: char.characterId,
            cosplayerId: char.cosplayerId,
            description: char.description,
            quantity: char.quantity,
          })),
      };

      const response = await MyHistoryService.editRequest(
        requestId,
        formattedData
      );
      console.log(response?.message || "Request updated successfully!");
      console.log("Request updated successfully!");
      onSuccess();
      onCancel();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update request. Please try again.";
      toast.error(errorMessage);
      console.error("Failed to update request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCosplayer = async (
    characterId,
    currentCosplayerId,
    index
  ) => {
    const dates = requestData.listUpdateRequestCharacters[
      index
    ].listUpdateRequestDates.map((date) => ({
      startDate: date.startDate,
      endDate: date.endDate,
    }));

    if (dates.length === 0) {
      toast.error("No date ranges available for this character.");
      return;
    }

    try {
      const data = {
        characterId,
        dates,
        checkAccountRequest: true,
      };
      const available = await MyHistoryService.ChangeCosplayer(data);
      console.log("Available cosplayers from API:", available); // Debug API response

      const conflicts = await MyHistoryService.getAllRequestCharacterByListDate(
        dates
      );
      console.log("Conflicts from API:", conflicts); // Debug conflicts

      if (!conflicts || !Array.isArray(conflicts)) {
        console.warn(
          "Invalid conflicts response from getAllRequestCharacterByListDate"
        );
        toast.error("Failed to load available cosplayers.");
        return;
      }

      const bookedCosplayerIds = new Set(
        conflicts
          .filter((conflict) => conflict.requestId !== requestId)
          .map((conflict) => conflict.cosplayerId?.toString().toLowerCase())
          .filter(Boolean)
      );
      setBookedCosplayerIds(bookedCosplayerIds);
      console.log("Booked cosplayer IDs:", bookedCosplayerIds); // Debug booked IDs

      const uniqueAvailable = available.filter((cos) => {
        const normalizedAccountId = cos.accountId?.toString().toLowerCase();
        return (
          normalizedAccountId ===
            currentCosplayerId?.toString().toLowerCase() ||
          !existingCosplayerIds.has(normalizedAccountId)
        );
      });
      console.log("Unique available cosplayers:", uniqueAvailable); // Debug filtered list

      const uniqueCosplayers = await Promise.all(
        uniqueAvailable.map(async (cos) => {
          try {
            const cosplayerData = await MyHistoryService.gotoHistoryByAccountId(
              cos.accountId
            );
            return {
              name: cosplayerData.name || cos.name || "Unknown",
              accountId: cosplayerData.accountId || cos.accountId,
              averageStar: cosplayerData.averageStar || cos.averageStar || 0,
              height: cosplayerData.height || cos.height || 0,
              weight: cosplayerData.weight || cos.weight || 0,
              salaryIndex: cosplayerData.salaryIndex || cos.salaryIndex || 0,
              isBooked: bookedCosplayerIds.has(
                (cosplayerData.accountId || cos.accountId)
                  .toString()
                  .toLowerCase()
              ),
            };
          } catch (cosplayerError) {
            console.warn(
              `Failed to fetch cosplayer data for ID ${cos.accountId}:`,
              cosplayerError
            );
            return null;
          }
        })
      );

      const finalCosplayers = uniqueCosplayers
        .filter((cosplayer) => cosplayer !== null)
        .reduce((acc, cosplayer) => {
          const normalizedAccountId = cosplayer.accountId
            .toString()
            .toLowerCase();
          if (
            !acc.some(
              (c) =>
                c.accountId.toString().toLowerCase() === normalizedAccountId
            )
          ) {
            acc.push(cosplayer);
          }
          return acc;
        }, []);
      console.log("Final cosplayers:", finalCosplayers); // Debug final list

      if (finalCosplayers.length === 0) {
        toast.warn("No available cosplayers found for this character.");
      }

      setAvailableCosplayers(finalCosplayers);
      setCurrentCharacterIndex(index);
      setChangeCosplayerVisible(true);
    } catch (error) {
      console.error("Error fetching available cosplayers:", error);
      toast.error(
        error.response?.data?.message || "Failed to load available cosplayers."
      );
    }
  };
  const handleCosplayerSelect = (accountId) => {
    const selectedCosplayer = availableCosplayers.find(
      (cos) => cos.accountId === accountId
    );
    if (!selectedCosplayer) {
      toast.error("Selected cosplayer not found.");
      return;
    }
    if (selectedCosplayer.isBooked) {
      toast.error(
        `${selectedCosplayer.name} is already booked during the selected time in another request.`
      );
      return;
    }
    setSelectedCosplayerId(accountId); // Lưu cosplayerId tạm thời
  };

  const handleDone = async () => {
    if (currentCharacterIndex === null || !selectedCosplayerId) {
      toast.error("No cosplayer selected.");
      return;
    }

    setLoading(true);
    try {
      // Step 2.1: Gọi API getRequestByRequestId để lấy dữ liệu mới nhất
      const latestRequestData = await MyHistoryService.getRequestByRequestId(
        requestId
      );
      if (!latestRequestData || !latestRequestData.charactersListResponse) {
        throw new Error("Failed to fetch latest request data.");
      }

      // Step 2.2: Lấy thông tin nhân vật hiện tại
      const currentCharacter =
        requestData.listUpdateRequestCharacters[currentCharacterIndex];
      const characterFromResponse =
        latestRequestData.charactersListResponse.find(
          (char) =>
            char.requestCharacterId === currentCharacter.requestCharacterId
        );
      if (!characterFromResponse) {
        throw new Error("Character not found in latest request data.");
      }

      // Step 2.3: Chuẩn bị request body cho API chooseCosplayerInRequest
      const requestBody = {
        requestId: requestId,
        characterId: characterFromResponse.characterId,
        description: currentCharacter.description || "No description",
        cosplayerId: selectedCosplayerId,
        quantity: currentCharacter.quantity || 1,
      };

      // Step 3: Gọi API chooseCosplayerInRequest
      await MyHistoryService.chooseCosplayerInRequest(
        currentCharacter.requestCharacterId,
        requestBody
      );

      // Step 4: Làm mới dữ liệu và cập nhật UI
      await fetchRequestData(); // Làm mới dữ liệu request
      toast.success("Cosplayer updated successfully!");

      // Cập nhật existingCosplayerIds
      setExistingCosplayerIds((prev) => {
        const newSet = new Set(prev);
        if (currentCharacter.cosplayerId)
          newSet.delete(currentCharacter.cosplayerId);
        newSet.add(selectedCosplayerId);
        return newSet;
      });

      // Cập nhật state nhân vật
      const updatedCharacters = [...requestData.listUpdateRequestCharacters];
      const selectedCosplayer = availableCosplayers.find(
        (cos) => cos.accountId === selectedCosplayerId
      );
      updatedCharacters[currentCharacterIndex] = {
        ...updatedCharacters[currentCharacterIndex],
        cosplayerId: selectedCosplayerId,
        cosplayerName: selectedCosplayer.name,
        averageStar: selectedCosplayer.averageStar,
        height: selectedCosplayer.height,
        weight: selectedCosplayer.weight,
        salaryIndex: selectedCosplayer.salaryIndex,
      };
      setRequestData((prev) => ({
        ...prev,
        listUpdateRequestCharacters: updatedCharacters,
      }));

      setChangeCosplayerVisible(false);
      setCurrentCharacterIndex(null);
      setSelectedCosplayerId(null);
    } catch (error) {
      toast.error(error.message || "Failed to update cosplayer.");
      console.error("Error updating cosplayer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCosplayer = () => {
    setAddCosplayerVisible(true);
  };

  const handleAddCosplayerSuccess = async () => {
    try {
      await fetchRequestData();
      if (requestData.listUpdateRequestCharacters.length === 0) {
        toast.warn(
          "No characters found after adding cosplayer. Please verify the request."
        );
      }
      setAddCosplayerVisible(false);
    } catch (error) {
      toast.error("Failed to refresh request data after adding cosplayer.");
      console.error("Error refreshing request data:", error);
    }
  };

  // Debounced delete handler
  const performDelete = useCallback(
    debounce(async (index, character) => {
      setDeleteLoading(true);
      try {
        await MyHistoryService.DeleteCosplayerInReq(
          character.requestCharacterId
        );
        toast.success("Cosplayer deleted successfully!");

        if (character.cosplayerId) {
          setExistingCosplayerIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(character.cosplayerId);
            return newSet;
          });
        }

        await fetchRequestData();

        setCharacterPage((prev) => {
          const newTotalPages = Math.ceil(
            requestData.listUpdateRequestCharacters.length / charactersPerPage
          );
          return prev > newTotalPages ? Math.max(1, newTotalPages) : prev;
        });
      } catch (error) {
        toast.error(
          error.message || "Failed to delete cosplayer. Please try again."
        );
        console.error("Error deleting cosplayer:", error);
      } finally {
        setDeleteLoading(false);
        setDeletingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(character.requestCharacterId);
          return newSet;
        });
      }
    }, 300),
    [
      fetchRequestData,
      requestData.listUpdateRequestCharacters,
      charactersPerPage,
    ]
  );

  const handleDeleteCosplayer = (index) => {
    if (requestData.listUpdateRequestCharacters.length <= 1) {
      toast.error(
        "Cannot delete the last cosplayer. At least one cosplayer is required."
      );
      return;
    }

    const character = requestData.listUpdateRequestCharacters[index];
    if (!character.requestCharacterId) {
      toast.error("Invalid request character ID.");
      return;
    }

    // Mark item as deleting for fade-out effect
    setDeletingItems((prev) => {
      const newSet = new Set(prev);
      newSet.add(character.requestCharacterId);
      return newSet;
    });

    // Delay actual deletion to allow animation
    setTimeout(() => {
      performDelete(index, character);
    }, 300);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "ascend" ? "descend" : "ascend");
    setCurrentPage(1);
  };

  const sortedCosplayers = [...availableCosplayers].sort((a, b) => {
    if (!a[sortField] && !b[sortField]) return 0;
    if (!a[sortField]) return 1;
    if (!b[sortField]) return -1;
    return sortOrder === "ascend"
      ? a[sortField] - b[sortField]
      : b[sortField] - a[sortField];
  });

  const unbookedCosplayers = sortedCosplayers.filter(
    (cosplayer) => !cosplayer.isBooked
  );
  const totalPages = Math.ceil(unbookedCosplayers.length / rowsPerPage);
  const paginatedCosplayers = unbookedCosplayers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page < 1 ? 1 : page > totalPages ? totalPages : page);
  };

  const totalCharacterPages = Math.ceil(
    requestData.listUpdateRequestCharacters.length / charactersPerPage
  );
  const paginatedCharacters = requestData.listUpdateRequestCharacters.slice(
    (characterPage - 1) * charactersPerPage,
    characterPage * charactersPerPage
  );

  const handleCharacterPageChange = (page) => {
    setCharacterPage(
      page < 1 ? 1 : page > totalCharacterPages ? totalCharacterPages : page
    );
  };

  const getCosplayerPrice = (char) => {
    const totalHours = char.listUpdateRequestDates.reduce(
      (sum, date) => sum + (date.totalHour || 0),
      0
    );

    let totalDays = 0;
    if (char.listUpdateRequestDates.length > 0) {
      const startDate = dayjs(
        char.listUpdateRequestDates[0].startDate,
        "HH:mm DD/MM/YYYY"
      );
      const endDate = dayjs(
        char.listUpdateRequestDates.slice(-1)[0].endDate,
        "HH:mm DD/MM/YYYY"
      );
      if (startDate.isValid() && endDate.isValid()) {
        totalDays = endDate.diff(startDate, "day") + 1;
      }
    }

    return calculateCosplayerPrice(
      char.salaryIndex,
      char.characterPrice || 0,
      totalHours,
      totalDays
    );
  };

  const toggleDates = (requestCharacterId) => {
    setExpandedDates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(requestCharacterId)) {
        newSet.delete(requestCharacterId);
      } else {
        newSet.add(requestCharacterId);
      }
      return newSet;
    });
  };

  return (
    <ErrorBoundary>
      <Modal
        title="Edit Request for Hiring Cosplayer"
        open={visible}
        onOk={handleSubmit}
        onCancel={onCancel}
        okText="Save Changes"
        cancelText="Cancel"
        confirmLoading={loading}
        width={1000}
      >
        <div ref={modalContentRef}>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              <Form form={form} layout="vertical">
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the request name",
                    },
                  ]}
                >
                  <Input placeholder="Enter request name" />
                </Form.Item>
                <Form.Item name="description" label="Description">
                  <TextArea rows={4} placeholder="Enter request description" />
                </Form.Item>
                <Form.Item
                  name="location"
                  label="Location"
                  rules={[
                    { required: true, message: "Please enter the location" },
                  ]}
                >
                  <Input placeholder="Enter location" />
                </Form.Item>
              </Form>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h4>
                  List of Requested Characters (Total Price:{" "}
                  {totalPrice.toLocaleString()} VND)
                </h4>
                <Button
                  type="primary"
                  icon={<Plus size={16} />}
                  onClick={handleAddCosplayer}
                >
                  Add Cosplayer
                </Button>
              </div>
              <i style={{ color: "gray" }}>
                *Note: Unit Price hire cosplayer = (Total Hours × Hourly Rate) +
                (Character Price × Total Days)
              </i>
              {paginatedCharacters.length === 0 ? (
                <div className="text-center" style={{ marginTop: "16px" }}>
                  No characters available.
                </div>
              ) : (
                <List
                  dataSource={paginatedCharacters}
                  renderItem={(item, index) => (
                    <List.Item
                      key={item.requestCharacterId || `character-${index}`}
                      style={{
                        padding: "16px 0",
                        opacity: deletingItems.has(item.requestCharacterId)
                          ? 0.3
                          : 1,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0 }}>
                              <span>Cosplayer Name: </span>
                              <strong>{item.cosplayerName}</strong>
                              {item.averageStar && (
                                <span> | Rating: {item.averageStar}/5</span>
                              )}
                              {item.height && (
                                <span> | Height: {item.height}cm</span>
                              )}
                              {item.weight && (
                                <span> | Weight: {item.weight}kg</span>
                              )}
                              {item.salaryIndex && (
                                <span>
                                  {" "}
                                  | Hourly Rate:{" "}
                                  {item.salaryIndex.toLocaleString()} VND/h
                                </span>
                              )}
                            </p>
                            <p style={{ margin: "4px 0" }}>
                              Character <strong>{item.characterName}</strong>{" "}
                              Price: {item.characterPrice.toLocaleString()} VND
                            </p>
                            <p style={{ margin: "4px 0" }}>
                              Quantity: {item.quantity}
                            </p>
                            <p style={{ margin: "4px 0" }}>
                              Description: {item.description}
                            </p>
                            <p style={{ margin: "4px 0" }}>
                              <strong>
                                Price:{" "}
                                {getCosplayerPrice(item).toLocaleString()} VND
                              </strong>
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <Button
                              onClick={() =>
                                handleChangeCosplayer(
                                  item.characterId,
                                  item.cosplayerId,
                                  requestData.listUpdateRequestCharacters.indexOf(
                                    item
                                  )
                                )
                              }
                              disabled={deletingItems.has(
                                item.requestCharacterId
                              )}
                            >
                              Change Cosplayer
                            </Button>
                            <Popconfirm
                              title="Are you sure you want to delete this cosplayer?"
                              description={`This will remove ${item.cosplayerName} (${item.characterName}) from the request.`}
                              onConfirm={() =>
                                handleDeleteCosplayer(
                                  requestData.listUpdateRequestCharacters.indexOf(
                                    item
                                  )
                                )
                              }
                              okText="Yes"
                              cancelText="No"
                              placement="topRight"
                            >
                              <Button
                                danger
                                icon={<Delete size={16} />}
                                loading={
                                  deleteLoading &&
                                  deletingItems.has(item.requestCharacterId)
                                }
                                disabled={deletingItems.has(
                                  item.requestCharacterId
                                )}
                              >
                                Delete
                              </Button>
                            </Popconfirm>
                          </div>
                        </div>
                        <div
                          style={{
                            marginTop: "8px",
                            border: "1px solid #f0f0f0",
                            borderRadius: "4px",
                          }}
                        >
                          <Button
                            type="link"
                            onClick={() => toggleDates(item.requestCharacterId)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "8px 16px",
                            }}
                          >
                            Request Dates
                            {expandedDates.has(item.requestCharacterId) ? (
                              <ChevronUp size={16} style={{ float: "right" }} />
                            ) : (
                              <ChevronDown
                                size={16}
                                style={{ float: "right" }}
                              />
                            )}
                          </Button>
                          {expandedDates.has(item.requestCharacterId) && (
                            <List
                              dataSource={item.listUpdateRequestDates}
                              renderItem={(date, dateIndex) => (
                                <List.Item
                                  key={
                                    date.requestDateId || `date-${dateIndex}`
                                  }
                                  style={{
                                    padding: "5px 16px",
                                    borderBottom: "none",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <span>
                                      {date.startDate} - {date.endDate} (Total
                                      Hours: {date.totalHour || 0})
                                    </span>
                                  </div>
                                </List.Item>
                              )}
                            />
                          )}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                  marginTop: "16px",
                }}
              >
                <Button
                  onClick={() => handleCharacterPageChange(characterPage - 1)}
                  disabled={characterPage === 1}
                >
                  Previous
                </Button>
                <span>
                  Page {characterPage} of {totalCharacterPages}
                </span>
                <Button
                  onClick={() => handleCharacterPageChange(characterPage + 1)}
                  disabled={characterPage === totalCharacterPages}
                >
                  Next
                </Button>
              </div>
              <Modal
                title="Change Cosplayer"
                open={changeCosplayerVisible}
                onCancel={() => {
                  setChangeCosplayerVisible(false);
                  setSelectedCosplayerId(null);
                }}
                footer={
                  <div>
                    <Button
                      className="btn btn-outline-danger"
                      onClick={() => handleSort("salaryIndex")}
                      style={{ marginBottom: "5px" }}
                    >
                      Hourly Salary{" "}
                      {sortField === "salaryIndex" &&
                        (sortOrder === "ascend" ? "↑" : "↓")}
                    </Button>
                    <Button
                      onClick={() =>
                        handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                      }
                    >
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      onClick={() =>
                        handlePageChange(
                          currentPage < totalPages
                            ? currentPage + 1
                            : totalPages
                        )
                      }
                    >
                      Next
                    </Button>
                    <Button
                      className="btn btn-primary"
                      onClick={handleDone}
                      disabled={loading || !selectedCosplayerId}
                    >
                      Done
                    </Button>
                  </div>
                }
              >
                {paginatedCosplayers.length === 0 ? (
                  <div className="text-center">
                    No available cosplayers for the selected time.
                  </div>
                ) : (
                  <List
                    dataSource={paginatedCosplayers}
                    renderItem={(cosplayer) => (
                      <List.Item
                        key={cosplayer.accountId}
                        onClick={() =>
                          handleCosplayerSelect(cosplayer.accountId)
                        }
                        style={{
                          display: cosplayer.isBooked ? "none" : "block",
                          cursor: "pointer",
                          padding: "12px 16px",
                          borderBottom: "1px solid #f0f0f0",
                          transition: "background-color 0.2s",
                          backgroundColor:
                            selectedCosplayerId === cosplayer.accountId
                              ? "#e6f7ff"
                              : "transparent",
                        }}
                      >
                        <div
                          className="cosplayer-row"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                            gap: "16px",
                            width: "100%",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {cosplayer.name}
                          </span>
                          <span>{cosplayer.averageStar}/5</span>
                          <span>{cosplayer.height}cm</span>
                          <span>{cosplayer.weight}kg</span>
                          <span>{cosplayer.salaryIndex.toLocaleString()}</span>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </Modal>
              <AddCosplayerInReq
                visible={addCosplayerVisible}
                requestId={requestId}
                onCancel={() => setAddCosplayerVisible(false)}
                onSuccess={handleAddCosplayerSuccess}
              />
            </>
          )}
        </div>
      </Modal>
    </ErrorBoundary>
  );
};

export default EditRequestHireCosplayer;
