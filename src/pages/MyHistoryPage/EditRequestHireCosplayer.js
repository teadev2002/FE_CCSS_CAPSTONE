// //========================== thay doi editRequestHireCosplayer.js =========================
// import React, { useState, useEffect, useCallback } from "react";
// import { Form, Modal, Input, List, Button, DatePicker, message } from "antd";
// import { Edit } from "lucide-react";
// import dayjs from "dayjs";
// import MyHistoryService from "../../services/HistoryService/MyHistoryService";
// import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
// import { toast } from "react-toastify";

// const { TextArea } = Input;

// const EditRequestHireCosplayer = ({
//   visible,
//   requestId,
//   onCancel,
//   onSuccess,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [requestData, setRequestData] = useState({
//     name: "",
//     description: "",
//     startDate: null,
//     endDate: null,
//     location: "",
//     serviceId: "S002",
//     packageId: "",
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
//   const rowsPerPage = 8;

//   const calculateTotalHours = (requestDates) => {
//     return requestDates.reduce((total, date) => {
//       if (!date.startDate || !date.endDate) return total;
//       const start = dayjs(date.startDate, "HH:mm DD/MM/YYYY");
//       const end = dayjs(date.endDate, "HH:mm DD/MM/YYYY");
//       if (start.isValid() && end.isValid() && start < end) {
//         return total + end.diff(start, "hour", true);
//       }
//       return total;
//     }, 0);
//   };

//   const calculateTotalDays = (requestDates) => {
//     const uniqueDays = new Set();
//     requestDates.forEach((date) => {
//       if (!date.startDate || !date.endDate) return;
//       const start = dayjs(date.startDate, "HH:mm DD/MM/YYYY").startOf("day");
//       const end = dayjs(date.endDate, "HH:mm DD/MM/YYYY").startOf("day");
//       let current = start;
//       while (current <= end) {
//         uniqueDays.add(current.format("DD/MM/YYYY"));
//         current = current.add(1, "day");
//       }
//     });
//     return uniqueDays.size;
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

//   const calculateTotalPrice = (characters) => {
//     return characters.reduce((total, char) => {
//       const totalHours = calculateTotalHours(char.listUpdateRequestDates);
//       const totalDays = calculateTotalDays(char.listUpdateRequestDates);
//       return (
//         total +
//         calculateCosplayerPrice(
//           char.salaryIndex,
//           char.characterPrice || 0,
//           char.quantity,
//           totalHours,
//           totalDays
//         )
//       );
//     }, 0);
//   };

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

//           if (char.cosplayerId) {
//             try {
//               const cosplayerData =
//                 await RequestService.getNameCosplayerInRequestByCosplayerId(
//                   char.cosplayerId
//                 );
//               cosplayerName = cosplayerData?.name || "Unknown";
//               salaryIndex = cosplayerData?.salaryIndex || 1;
//               cosplayerId = cosplayerData?.accountId || char.cosplayerId;
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
//             characterId: char.characterId,
//             cosplayerId,
//             cosplayerName,
//             characterName,
//             characterPrice,
//             salaryIndex,
//             description: char.description || "",
//             quantity: char.quantity || 1,
//             listUpdateRequestDates: (char.requestDateResponses || []).map(
//               (date) => ({
//                 requestDateId: date.requestDateId || null,
//                 startDate: date.startDate || "",
//                 endDate: date.endDate || "",
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
//         packageId: data.packageId || "",
//         listUpdateRequestCharacters,
//       });

//       form.setFieldsValue({
//         name: data.name || "",
//         description: data.description || "",
//         location: data.location || "",
//       });

//       const price = calculateTotalPrice(listUpdateRequestCharacters);
//       setTotalPrice(price);
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

//   const isValidTime = (time) => {
//     if (!time) return false;
//     const hour = time.hour();
//     return hour >= 8 && hour <= 22;
//   };

//   const disabledDate = (current) => {
//     const today = dayjs().startOf("day");
//     return current && current < today.add(1, "day");
//   };

//   const updateRequestDates = (characterIndex, dateIndex, field, value) => {
//     setRequestData((prev) => {
//       const updatedCharacters = [...prev.listUpdateRequestCharacters];
//       const updatedDates = [
//         ...updatedCharacters[characterIndex].listUpdateRequestDates,
//       ];
//       updatedDates[dateIndex] = { ...updatedDates[dateIndex], [field]: value };
//       updatedCharacters[characterIndex] = {
//         ...updatedCharacters[characterIndex],
//         listUpdateRequestDates: updatedDates,
//       };
//       const newPrice = calculateTotalPrice(updatedCharacters);
//       setTotalPrice(newPrice);
//       return { ...prev, listUpdateRequestCharacters: updatedCharacters };
//     });
//   };

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
//         packageId: requestData.packageId,
//         listUpdateRequestCharacters:
//           requestData.listUpdateRequestCharacters.map((char) => ({
//             characterId: char.characterId,
//             cosplayerId: char.cosplayerId,
//             description: char.description,
//             quantity: char.quantity,
//             listUpdateRequestDates: char.listUpdateRequestDates.map((date) => ({
//               requestDateId: date.requestDateId || null,
//               startDate: date.startDate,
//               endDate: date.endDate,
//             })),
//           })),
//       };

//       setLoading(true);
//       await MyHistoryService.editRequest(requestId, formattedData);
//       toast.success("Request updated successfully!");
//       onSuccess();
//       onCancel();
//     } catch (error) {
//       console.error("Failed to update request:", error);
//       toast.error(
//         error.message || "Failed to update request. Please try again."
//       );
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
//       const filteredCosplayers = available
//         .filter(
//           (cos) =>
//             cos.accountId === currentCosplayerId ||
//             !existingCosplayerIds.has(cos.accountId)
//         )
//         .map((cos) => ({
//           name: cos.name,
//           accountId: cos.accountId,
//           averageStar: cos.averageStar || 0,
//           height: cos.height || 0,
//           weight: cos.weight || 0,
//           salaryIndex: cos.salaryIndex || 0,
//         }));

//       setAvailableCosplayers(filteredCosplayers);
//       setCurrentCharacterIndex(index);
//       setChangeCosplayerVisible(true);
//     } catch (error) {
//       console.error("Error fetching available cosplayers:", error);
//       toast.error("Failed to load available cosplayers.");
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
//         if (previousCosplayerId) {
//           newSet.delete(previousCosplayerId);
//         }
//         newSet.add(accountId);
//         return newSet;
//       });

//       const price = calculateTotalPrice(updatedCharacters);
//       setTotalPrice(price);

//       setChangeCosplayerVisible(false);
//       setCurrentCharacterIndex(null);
//     }
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

//   return (
//     <Modal
//       title="Edit Request for Hiring Cosplayer"
//       open={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       okText="Save Changes"
//       cancelText="Cancel"
//       confirmLoading={loading}
//       width={1000}
//     >
//       {loading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <>
//           <Form form={form} layout="vertical">
//             <Form.Item
//               name="name"
//               label="Name"
//               rules={[
//                 { required: true, message: "Please enter the request name" },
//               ]}
//             >
//               <Input placeholder="Enter request name" />
//             </Form.Item>
//             <Form.Item name="description" label="Description">
//               <TextArea rows={4} placeholder="Enter request description" />
//             </Form.Item>
//             <Form.Item
//               name="location"
//               label="Location"
//               rules={[{ required: true, message: "Please enter the location" }]}
//             >
//               <Input placeholder="Enter location" />
//             </Form.Item>
//           </Form>
//           <h4>
//             List of Requested Characters (Total Price:{" "}
//             {totalPrice.toLocaleString()} VND)
//           </h4>
//           <i style={{ color: "gray" }}>
//             *Note: Unit Price hire cosplayer = (Total Hours × Hourly Rate) +
//             (Total Days × Character Price)
//           </i>
//           <List
//             dataSource={requestData.listUpdateRequestCharacters}
//             renderItem={(item, index) => (
//               <List.Item key={index}>
//                 <div style={{ width: "100%" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <div style={{ flex: 1 }}>
//                       <p>
//                         <span>Cosplayer Name: </span>
//                         <strong>{item.cosplayerName}</strong>
//                         {item.averageStar && (
//                           <span> | Rating: {item.averageStar}/5</span>
//                         )}
//                         {item.height && <span> | Height: {item.height}cm</span>}
//                         {item.weight && <span> | Weight: {item.weight}kg</span>}
//                         {item.salaryIndex && (
//                           <span>
//                             {" "}
//                             | Hourly Rate: {item.salaryIndex.toLocaleString()}{" "}
//                             VND/h
//                           </span>
//                         )}
//                       </p>
//                       <p>
//                         Character <strong>{item.characterName}</strong>{" "}
//                         Price/day: {item.characterPrice.toLocaleString()} VND
//                       </p>
//                       <p>Quantity: {item.quantity}</p>
//                       <p>Description: {item.description}</p>
//                     </div>
//                     <Button
//                       onClick={() =>
//                         handleChangeCosplayer(
//                           item.characterId,
//                           item.cosplayerId,
//                           index
//                         )
//                       }
//                     >
//                       Change Cosplayer
//                     </Button>
//                   </div>
//                   <h5>Request Dates:</h5>
//                   <List
//                     dataSource={item.listUpdateRequestDates}
//                     renderItem={(date, dateIndex) => (
//                       <List.Item key={dateIndex}>
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "10px",
//                             width: "100%",
//                           }}
//                         >
//                           <Form.Item
//                             label="Start Date and Time"
//                             rules={[
//                               {
//                                 required: true,
//                                 message: "Please select start date and time",
//                               },
//                               {
//                                 validator(_, value) {
//                                   if (!value) return Promise.reject();
//                                   const today = dayjs().startOf("day");
//                                   if (value < today.add(1, "day")) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "Start date must be at least 1 day in the future"
//                                       )
//                                     );
//                                   }
//                                   if (!isValidTime(value)) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "Start time must be between 08:00 AM and 10:00 PM"
//                                       )
//                                     );
//                                   }
//                                   return Promise.resolve();
//                                 },
//                               },
//                             ]}
//                           >
//                             <DatePicker
//                               format="HH:mm DD/MM/YYYY"
//                               showTime={{ format: "HH:mm", minuteStep: 15 }}
//                               disabledDate={disabledDate}
//                               value={
//                                 date.startDate
//                                   ? dayjs(date.startDate, "HH:mm DD/MM/YYYY")
//                                   : null
//                               }
//                               onChange={(value) =>
//                                 updateRequestDates(
//                                   index,
//                                   dateIndex,
//                                   "startDate",
//                                   value ? value.format("HH:mm DD/MM/YYYY") : ""
//                                 )
//                               }
//                               style={{ width: "200px" }}
//                             />
//                           </Form.Item>
//                           <Form.Item
//                             label="To"
//                             rules={[
//                               {
//                                 required: true,
//                                 message: "Please select end date and time",
//                               },
//                               {
//                                 validator(_, value) {
//                                   if (!value) return Promise.reject();
//                                   const startDate = dayjs(
//                                     item.listUpdateRequestDates[dateIndex]
//                                       .startDate,
//                                     "HH:mm DD/MM/YYYY"
//                                   );
//                                   if (startDate && value < startDate) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "End date must be after start date"
//                                       )
//                                     );
//                                   }
//                                   if (!isValidTime(value)) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "End time must be between 08:00 AM and 10:00 PM"
//                                       )
//                                     );
//                                   }
//                                   return Promise.resolve();
//                                 },
//                               },
//                             ]}
//                           >
//                             <DatePicker
//                               format="HH:mm DD/MM/YYYY"
//                               showTime={{ format: "HH:mm", minuteStep: 15 }}
//                               disabledDate={disabledDate}
//                               value={
//                                 date.endDate
//                                   ? dayjs(date.endDate, "HH:mm DD/MM/YYYY")
//                                   : null
//                               }
//                               onChange={(value) =>
//                                 updateRequestDates(
//                                   index,
//                                   dateIndex,
//                                   "endDate",
//                                   value ? value.format("HH:mm DD/MM/YYYY") : ""
//                                 )
//                               }
//                               style={{ width: "200px" }}
//                             />
//                           </Form.Item>
//                         </div>
//                       </List.Item>
//                     )}
//                   />
//                 </div>
//               </List.Item>
//             )}
//           />
//           <Modal
//             title="Change Cosplayer"
//             open={changeCosplayerVisible}
//             onOk={() => setChangeCosplayerVisible(false)}
//             onCancel={() => setChangeCosplayerVisible(false)}
//             okText="Close"
//             cancelText="Cancel"
//             footer={
//               <>
//                 <Button
//                   onClick={() =>
//                     handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
//                   }
//                 >
//                   Previous
//                 </Button>
//                 <span>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <Button
//                   onClick={() =>
//                     handlePageChange(
//                       currentPage < totalPages ? currentPage + 1 : totalPages
//                     )
//                   }
//                 >
//                   Next
//                 </Button>
//                 <Button
//                   className="btn btn-outline-danger"
//                   onClick={() => handleSort("salaryIndex")}
//                   style={{ marginBottom: "5px" }}
//                 >
//                   Hourly Salary{" "}
//                   {sortField === "salaryIndex" &&
//                     (sortOrder === "ascend" ? "↑" : "↓")}
//                 </Button>
//               </>
//             }
//           >
//             <List
//               dataSource={paginatedCosplayers}
//               renderItem={(cosplayer) => (
//                 <List.Item
//                   key={cosplayer.accountId}
//                   onClick={() => handleCosplayerSelect(cosplayer.accountId)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <span>{cosplayer.name}</span>
//                   <span> | ⭐ {cosplayer.averageStar}/5</span>
//                   <span> | 📏 {cosplayer.height}cm</span>
//                   <span> | ⚖️ {cosplayer.weight}kg</span>
//                   <span>
//                     {" "}
//                     | 🪙 {cosplayer.salaryIndex.toLocaleString()}VND/h
//                   </span>
//                 </List.Item>
//               )}
//             />
//           </Modal>
//         </>
//       )}
//     </Modal>
//   );
// };

// export default EditRequestHireCosplayer;

// //========================== thay doi editRequestHireCosplayer.js =========================
//========================== thay doi editRequestHireCosplayer.js =========================
// import React, { useState, useEffect, useCallback } from "react";
// import { Form, Modal, Input, List, Button, DatePicker } from "antd";
// import { Edit } from "lucide-react";
// import dayjs from "dayjs";
// import MyHistoryService from "../../services/HistoryService/MyHistoryService";
// import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
// import { toast } from "react-toastify";

// const { TextArea } = Input;

// const EditRequestHireCosplayer = ({
//   visible,
//   requestId,
//   onCancel,
//   onSuccess,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [requestData, setRequestData] = useState({
//     name: "",
//     description: "",
//     startDate: null,
//     endDate: null,
//     location: "",
//     serviceId: "S002",
//     packageId: "",
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
//   const rowsPerPage = 8;

//   const calculateTotalHours = (requestDates) => {
//     return requestDates.reduce((total, date) => {
//       if (!date.startDate || !date.endDate) return total;
//       const start = dayjs(date.startDate, "HH:mm DD/MM/YYYY");
//       const end = dayjs(date.endDate, "HH:mm DD/MM/YYYY");
//       if (start.isValid() && end.isValid() && start < end) {
//         return total + end.diff(start, "hour", true);
//       }
//       return total;
//     }, 0);
//   };

//   const calculateTotalDays = (requestDates) => {
//     const uniqueDays = new Set();
//     requestDates.forEach((date) => {
//       if (!date.startDate || !date.endDate) return;
//       const start = dayjs(date.startDate, "HH:mm DD/MM/YYYY").startOf("day");
//       const end = dayjs(date.endDate, "HH:mm DD/MM/YYYY").startOf("day");
//       let current = start;
//       while (current <= end) {
//         uniqueDays.add(current.format("DD/MM/YYYY"));
//         current = current.add(1, "day");
//       }
//     });
//     return uniqueDays.size;
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

//   const calculateTotalPrice = (characters) => {
//     return characters.reduce((total, char) => {
//       const totalHours = calculateTotalHours(char.listUpdateRequestDates);
//       const totalDays = calculateTotalDays(char.listUpdateRequestDates);
//       return (
//         total +
//         calculateCosplayerPrice(
//           char.salaryIndex,
//           char.characterPrice || 0,
//           char.quantity,
//           totalHours,
//           totalDays
//         )
//       );
//     }, 0);
//   };

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

//           if (char.cosplayerId) {
//             try {
//               const cosplayerData =
//                 await RequestService.getNameCosplayerInRequestByCosplayerId(
//                   char.cosplayerId
//                 );
//               cosplayerName = cosplayerData?.name || "Unknown";
//               salaryIndex = cosplayerData?.salaryIndex || 1;
//               cosplayerId = cosplayerData?.accountId || char.cosplayerId;
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
//             characterId: char.characterId,
//             cosplayerId,
//             cosplayerName,
//             characterName,
//             characterPrice,
//             salaryIndex,
//             description: char.description || "",
//             quantity: char.quantity || 1,
//             listUpdateRequestDates: (char.requestDateResponses || []).map(
//               (date) => ({
//                 requestDateId: date.requestDateId || null,
//                 startDate: date.startDate || "",
//                 endDate: date.endDate || "",
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
//         packageId: data.packageId || "",
//         listUpdateRequestCharacters,
//       });

//       form.setFieldsValue({
//         name: data.name || "",
//         description: data.description || "",
//         location: data.location || "",
//       });

//       const price = calculateTotalPrice(listUpdateRequestCharacters);
//       setTotalPrice(price);
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

//   const isValidTime = (time) => {
//     if (!time) return false;
//     const hour = time.hour();
//     return hour >= 8 && hour <= 22;
//   };

//   const disabledDate = (current) => {
//     const today = dayjs().startOf("day");
//     return current && current < today.add(1, "day");
//   };

//   const updateRequestDates = (characterIndex, dateIndex, field, value) => {
//     setRequestData((prev) => {
//       const updatedCharacters = [...prev.listUpdateRequestCharacters];
//       const updatedDates = [
//         ...updatedCharacters[characterIndex].listUpdateRequestDates,
//       ];
//       updatedDates[dateIndex] = { ...updatedDates[dateIndex], [field]: value };
//       updatedCharacters[characterIndex] = {
//         ...updatedCharacters[characterIndex],
//         listUpdateRequestDates: updatedDates,
//       };
//       const newPrice = calculateTotalPrice(updatedCharacters);
//       setTotalPrice(newPrice);
//       return { ...prev, listUpdateRequestCharacters: updatedCharacters };
//     });
//   };

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
//         packageId: requestData.packageId,
//         listUpdateRequestCharacters:
//           requestData.listUpdateRequestCharacters.map((char) => ({
//             characterId: char.characterId,
//             cosplayerId: char.cosplayerId,
//             description: char.description,
//             quantity: char.quantity,
//             listUpdateRequestDates: char.listUpdateRequestDates.map((date) => ({
//               requestDateId: date.requestDateId || null,
//               startDate: date.startDate,
//               endDate: date.endDate,
//             })),
//           })),
//       };

//       setLoading(true);
//       const response = await MyHistoryService.editRequest(
//         requestId,
//         formattedData
//       );
//       toast.success(response?.message || "Request updated successfully!");
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

//       // Loại bỏ cosplayer trùng lặp và chỉ giữ cosplayer hiện tại hoặc chưa được chọn
//       const uniqueCosplayers = [];
//       const seenAccountIds = new Set();
//       available.forEach((cos) => {
//         if (
//           (cos.accountId === currentCosplayerId ||
//             !existingCosplayerIds.has(cos.accountId)) &&
//           !seenAccountIds.has(cos.accountId)
//         ) {
//           uniqueCosplayers.push({
//             name: cos.name,
//             accountId: cos.accountId,
//             averageStar: cos.averageStar || 0,
//             height: cos.height || 0,
//             weight: cos.weight || 0,
//             salaryIndex: cos.salaryIndex || 0,
//           });
//           seenAccountIds.add(cos.accountId);
//         }
//       });

//       setAvailableCosplayers(uniqueCosplayers);
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

//       const price = calculateTotalPrice(updatedCharacters);
//       setTotalPrice(price);

//       setChangeCosplayerVisible(false);
//       setCurrentCharacterIndex(null);
//     }
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

//   return (
//     <Modal
//       title="Edit Request for Hiring Cosplayer"
//       open={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       okText="Save Changes"
//       cancelText="Cancel"
//       confirmLoading={loading}
//       width={1000}
//     >
//       {loading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <>
//           <Form form={form} layout="vertical">
//             <Form.Item
//               name="name"
//               label="Name"
//               rules={[
//                 { required: true, message: "Please enter the request name" },
//               ]}
//             >
//               <Input placeholder="Enter request name" />
//             </Form.Item>
//             <Form.Item name="description" label="Description">
//               <TextArea rows={4} placeholder="Enter request description" />
//             </Form.Item>
//             <Form.Item
//               name="location"
//               label="Location"
//               rules={[{ required: true, message: "Please enter the location" }]}
//             >
//               <Input placeholder="Enter location" />
//             </Form.Item>
//           </Form>
//           <h4>
//             List of Requested Characters (Total Price:{" "}
//             {totalPrice.toLocaleString()} VND)
//           </h4>
//           <i style={{ color: "gray" }}>
//             *Note: Unit Price hire cosplayer = (Total Hours × Hourly Rate) +
//             (Total Days × Character Price)
//           </i>
//           <List
//             dataSource={requestData.listUpdateRequestCharacters}
//             renderItem={(item, index) => (
//               <List.Item key={index}>
//                 <div style={{ width: "100%" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <div style={{ flex: 1 }}>
//                       <p>
//                         <span>Cosplayer Name: </span>
//                         <strong>{item.cosplayerName}</strong>
//                         {item.averageStar && (
//                           <span> | Rating: {item.averageStar}/5</span>
//                         )}
//                         {item.height && <span> | Height: {item.height}cm</span>}
//                         {item.weight && <span> | Weight: {item.weight}kg</span>}
//                         {item.salaryIndex && (
//                           <span>
//                             {" "}
//                             | Hourly Rate: {item.salaryIndex.toLocaleString()}{" "}
//                             VND/h
//                           </span>
//                         )}
//                       </p>
//                       <p>
//                         Character <strong>{item.characterName}</strong>{" "}
//                         Price/day: {item.characterPrice.toLocaleString()} VND
//                       </p>
//                       <p>Quantity: {item.quantity}</p>
//                       <p>Description: {item.description}</p>
//                     </div>
//                     <Button
//                       onClick={() =>
//                         handleChangeCosplayer(
//                           item.characterId,
//                           item.cosplayerId,
//                           index
//                         )
//                       }
//                     >
//                       Change Cosplayer
//                     </Button>
//                   </div>
//                   <h5>Request Dates:</h5>
//                   <List
//                     dataSource={item.listUpdateRequestDates}
//                     renderItem={(date, dateIndex) => (
//                       <List.Item key={dateIndex}>
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "10px",
//                             width: "100%",
//                           }}
//                         >
//                           <Form.Item
//                             label="Start Date and Time"
//                             rules={[
//                               {
//                                 required: true,
//                                 message: "Please select start date and time",
//                               },
//                               {
//                                 validator(_, value) {
//                                   if (!value) return Promise.reject();
//                                   const today = dayjs().startOf("day");
//                                   if (value < today.add(1, "day")) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "Start date must be at least 1 day in the future"
//                                       )
//                                     );
//                                   }
//                                   if (!isValidTime(value)) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "Start time must be between 08:00 AM and 10:00 PM"
//                                       )
//                                     );
//                                   }
//                                   return Promise.resolve();
//                                 },
//                               },
//                             ]}
//                           >
//                             <DatePicker
//                               format="HH:mm DD/MM/YYYY"
//                               showTime={{ format: "HH:mm", minuteStep: 15 }}
//                               disabledDate={disabledDate}
//                               value={
//                                 date.startDate
//                                   ? dayjs(date.startDate, "HH:mm DD/MM/YYYY")
//                                   : null
//                               }
//                               onChange={(value) =>
//                                 updateRequestDates(
//                                   index,
//                                   dateIndex,
//                                   "startDate",
//                                   value ? value.format("HH:mm DD/MM/YYYY") : ""
//                                 )
//                               }
//                               style={{ width: "200px" }}
//                             />
//                           </Form.Item>
//                           <Form.Item
//                             label="To"
//                             rules={[
//                               {
//                                 required: true,
//                                 message: "Please select end date and time",
//                               },
//                               {
//                                 validator(_, value) {
//                                   if (!value) return Promise.reject();
//                                   const startDate = dayjs(
//                                     item.listUpdateRequestDates[dateIndex]
//                                       .startDate,
//                                     "HH:mm DD/MM/YYYY"
//                                   );
//                                   if (startDate && value < startDate) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "End date must be after start date"
//                                       )
//                                     );
//                                   }
//                                   if (!isValidTime(value)) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "End time must be between 08:00 AM and 10:00 PM"
//                                       )
//                                     );
//                                   }
//                                   return Promise.resolve();
//                                 },
//                               },
//                             ]}
//                           >
//                             <DatePicker
//                               format="HH:mm DD/MM/YYYY"
//                               showTime={{ format: "HH:mm", minuteStep: 15 }}
//                               disabledDate={disabledDate}
//                               value={
//                                 date.endDate
//                                   ? dayjs(date.endDate, "HH:mm DD/MM/YYYY")
//                                   : null
//                               }
//                               onChange={(value) =>
//                                 updateRequestDates(
//                                   index,
//                                   dateIndex,
//                                   "endDate",
//                                   value ? value.format("HH:mm DD/MM/YYYY") : ""
//                                 )
//                               }
//                               style={{ width: "200px" }}
//                             />
//                           </Form.Item>
//                         </div>
//                       </List.Item>
//                     )}
//                   />
//                 </div>
//               </List.Item>
//             )}
//           />
//           <Modal
//             title="Change Cosplayer"
//             open={changeCosplayerVisible}
//             onOk={() => setChangeCosplayerVisible(false)}
//             onCancel={() => setChangeCosplayerVisible(false)}
//             okText="Close"
//             cancelText="Cancel"
//             footer={
//               <>
//                 <Button
//                   onClick={() =>
//                     handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
//                   }
//                 >
//                   Previous
//                 </Button>
//                 <span>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <Button
//                   onClick={() =>
//                     handlePageChange(
//                       currentPage < totalPages ? currentPage + 1 : totalPages
//                     )
//                   }
//                 >
//                   Next
//                 </Button>
//                 <Button
//                   className="btn btn-outline-danger"
//                   onClick={() => handleSort("salaryIndex")}
//                   style={{ marginBottom: "5px" }}
//                 >
//                   Hourly Salary{" "}
//                   {sortField === "salaryIndex" &&
//                     (sortOrder === "ascend" ? "↑" : "↓")}
//                 </Button>
//               </>
//             }
//           >
//             <List
//               dataSource={paginatedCosplayers}
//               renderItem={(cosplayer) => (
//                 <List.Item
//                   key={cosplayer.accountId}
//                   onClick={() => handleCosplayerSelect(cosplayer.accountId)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <span>{cosplayer.name}</span>
//                   <span> | ⭐ {cosplayer.averageStar}/5</span>
//                   <span> | 📏 {cosplayer.height}cm</span>
//                   <span> | ⚖️ {cosplayer.weight}kg</span>
//                   <span>
//                     {" "}
//                     | 🪙 {cosplayer.salaryIndex.toLocaleString()}VND/h
//                   </span>
//                 </List.Item>
//               )}
//             />
//           </Modal>
//         </>
//       )}
//     </Modal>
//   );
// };

// export default EditRequestHireCosplayer;

// dùng api tính mới =============================================================================
// import React, { useState, useEffect, useCallback } from "react";
// import { Form, Modal, Input, List, Button, DatePicker } from "antd";
// import { Edit } from "lucide-react";
// import dayjs from "dayjs";
// import MyHistoryService from "../../services/HistoryService/MyHistoryService";
// import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
// import { toast } from "react-toastify";

// const { TextArea } = Input;

// const EditRequestHireCosplayer = ({
//   visible,
//   requestId,
//   onCancel,
//   onSuccess,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [requestData, setRequestData] = useState({
//     name: "",
//     description: "",
//     startDate: null,
//     endDate: null,
//     location: "",
//     serviceId: "S002",
//     packageId: "",
//     totalDate: 0, // Thêm totalDate từ API
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
//   const rowsPerPage = 8;

//   // Hàm tính giá cho mỗi cosplayer
//   const calculateCosplayerPrice = (
//     salaryIndex,
//     characterPrice,
//     quantity,
//     totalHours,
//     totalDate
//   ) => {
//     if (!salaryIndex || !characterPrice || !totalHours || !totalDate) return 0;
//     return (totalHours * salaryIndex + totalDate * characterPrice) * quantity;
//   };

//   // Hàm tính tổng giá
//   const calculateTotalPrice = (characters, totalDate) => {
//     return characters.reduce((total, char) => {
//       // Tính totalHours từ listUpdateRequestDates
//       const totalHours = char.listUpdateRequestDates.reduce(
//         (sum, date) => sum + (date.totalHour || 0),
//         0
//       );
//       return (
//         total +
//         calculateCosplayerPrice(
//           char.salaryIndex,
//           char.characterPrice || 0,
//           char.quantity,
//           totalHours,
//           totalDate
//         )
//       );
//     }, 0);
//   };

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

//           if (char.cosplayerId) {
//             try {
//               const cosplayerData =
//                 await RequestService.getNameCosplayerInRequestByCosplayerId(
//                   char.cosplayerId
//                 );
//               cosplayerName = cosplayerData?.name || "Unknown";
//               salaryIndex = cosplayerData?.salaryIndex || 1;
//               cosplayerId = cosplayerData?.accountId || char.cosplayerId;
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
//             characterId: char.characterId,
//             cosplayerId,
//             cosplayerName,
//             characterName,
//             characterPrice,
//             salaryIndex,
//             description: char.description || "",
//             quantity: char.quantity || 1,
//             listUpdateRequestDates: (char.requestDateResponses || []).map(
//               (date) => ({
//                 requestDateId: date.requestDateId || null,
//                 startDate: date.startDate || "",
//                 endDate: date.endDate || "",
//                 totalHour: date.totalHour || 0, // Lưu totalHour từ API
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
//         packageId: data.packageId || "",
//         totalDate: data.totalDate || 0, // Lưu totalDate từ API
//         listUpdateRequestCharacters,
//       });

//       form.setFieldsValue({
//         name: data.name || "",
//         description: data.description || "",
//         location: data.location || "",
//       });

//       const price = calculateTotalPrice(
//         listUpdateRequestCharacters,
//         data.totalDate || 0
//       );
//       setTotalPrice(price);
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

//   const isValidTime = (time) => {
//     if (!time) return false;
//     const hour = time.hour();
//     return hour >= 8 && hour <= 22;
//   };

//   const disabledDate = (current) => {
//     const today = dayjs().startOf("day");
//     return current && current < today.add(1, "day");
//   };

//   const updateRequestDates = (characterIndex, dateIndex, field, value) => {
//     setRequestData((prev) => {
//       const updatedCharacters = [...prev.listUpdateRequestCharacters];
//       const updatedDates = [
//         ...updatedCharacters[characterIndex].listUpdateRequestDates,
//       ];
//       updatedDates[dateIndex] = { ...updatedDates[dateIndex], [field]: value };

//       // Cập nhật totalHour khi startDate hoặc endDate thay đổi
//       if (field === "startDate" || field === "endDate") {
//         const start = updatedDates[dateIndex].startDate
//           ? dayjs(updatedDates[dateIndex].startDate, "HH:mm DD/MM/YYYY")
//           : null;
//         const end = updatedDates[dateIndex].endDate
//           ? dayjs(updatedDates[dateIndex].endDate, "HH:mm DD/MM/YYYY")
//           : null;
//         if (start && end && start.isValid() && end.isValid() && start < end) {
//           updatedDates[dateIndex].totalHour = Math.round(
//             end.diff(start, "hour", true)
//           );
//         } else {
//           updatedDates[dateIndex].totalHour = 0;
//         }
//       }

//       updatedCharacters[characterIndex] = {
//         ...updatedCharacters[characterIndex],
//         listUpdateRequestDates: updatedDates,
//       };

//       // Cập nhật totalDate dựa trên tất cả ngày duy nhất
//       const uniqueDays = new Set();
//       prev.listUpdateRequestCharacters.forEach((char) => {
//         char.listUpdateRequestDates.forEach((date) => {
//           if (date.startDate) {
//             const day = dayjs(date.startDate, "HH:mm DD/MM/YYYY").startOf(
//               "day"
//             );
//             uniqueDays.add(day.format("DD/MM/YYYY"));
//           }
//         });
//       });
//       const newTotalDate = uniqueDays.size;

//       const newPrice = calculateTotalPrice(updatedCharacters, newTotalDate);
//       setTotalPrice(newPrice);
//       return {
//         ...prev,
//         totalDate: newTotalDate,
//         listUpdateRequestCharacters: updatedCharacters,
//       };
//     });
//   };

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
//         packageId: requestData.packageId,
//         listUpdateRequestCharacters:
//           requestData.listUpdateRequestCharacters.map((char) => ({
//             characterId: char.characterId,
//             cosplayerId: char.cosplayerId,
//             description: char.description,
//             quantity: char.quantity,
//             listUpdateRequestDates: char.listUpdateRequestDates.map((date) => ({
//               requestDateId: date.requestDateId || null,
//               startDate: date.startDate,
//               endDate: date.endDate,
//               totalHour: date.totalHour || 0, // Gửi totalHour
//             })),
//           })),
//       };

//       setLoading(true);
//       const response = await MyHistoryService.editRequest(
//         requestId,
//         formattedData
//       );
//       toast.success(response?.message || "Request updated successfully!");
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

//       // Loại bỏ cosplayer trùng lặp
//       const uniqueCosplayers = [];
//       const seenAccountIds = new Set();
//       available.forEach((cos) => {
//         if (
//           (cos.accountId === currentCosplayerId ||
//             !existingCosplayerIds.has(cos.accountId)) &&
//           !seenAccountIds.has(cos.accountId)
//         ) {
//           uniqueCosplayers.push({
//             name: cos.name,
//             accountId: cos.accountId,
//             averageStar: cos.averageStar || 0,
//             height: cos.height || 0,
//             weight: cos.weight || 0,
//             salaryIndex: cos.salaryIndex || 0,
//           });
//           seenAccountIds.add(cos.accountId);
//         }
//       });

//       setAvailableCosplayers(uniqueCosplayers);
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

//       const price = calculateTotalPrice(
//         updatedCharacters,
//         requestData.totalDate
//       );
//       setTotalPrice(price);

//       setChangeCosplayerVisible(false);
//       setCurrentCharacterIndex(null);
//     }
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

//   return (
//     <Modal
//       title="Edit Request for Hiring Cosplayer"
//       open={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       okText="Save Changes"
//       cancelText="Cancel"
//       confirmLoading={loading}
//       width={1000}
//     >
//       {loading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <>
//           <Form form={form} layout="vertical">
//             <Form.Item
//               name="name"
//               label="Name"
//               rules={[
//                 { required: true, message: "Please enter the request name" },
//               ]}
//             >
//               <Input placeholder="Enter request name" />
//             </Form.Item>
//             <Form.Item name="description" label="Description">
//               <TextArea rows={4} placeholder="Enter request description" />
//             </Form.Item>
//             <Form.Item
//               name="location"
//               label="Location"
//               rules={[{ required: true, message: "Please enter the location" }]}
//             >
//               <Input placeholder="Enter location" />
//             </Form.Item>
//           </Form>
//           <h4>
//             List of Requested Characters (Total Price:{" "}
//             {totalPrice.toLocaleString()} VND)
//           </h4>
//           <i style={{ color: "gray" }}>
//             *Note: Unit Price hire cosplayer = (Total Hours × Hourly Rate) +
//             (Total Days × Character Price)
//           </i>
//           <List
//             dataSource={requestData.listUpdateRequestCharacters}
//             renderItem={(item, index) => (
//               <List.Item key={index}>
//                 <div style={{ width: "100%" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <div style={{ flex: 1 }}>
//                       <p>
//                         <span>Cosplayer Name: </span>
//                         <strong>{item.cosplayerName}</strong>
//                         {item.averageStar && (
//                           <span> | Rating: {item.averageStar}/5</span>
//                         )}
//                         {item.height && <span> | Height: {item.height}cm</span>}
//                         {item.weight && <span> | Weight: {item.weight}kg</span>}
//                         {item.salaryIndex && (
//                           <span>
//                             {" "}
//                             | Hourly Rate: {item.salaryIndex.toLocaleString()}{" "}
//                             VND/h
//                           </span>
//                         )}
//                       </p>
//                       <p>
//                         Character <strong>{item.characterName}</strong>{" "}
//                         Price/day: {item.characterPrice.toLocaleString()} VND
//                       </p>
//                       <p>Quantity: {item.quantity}</p>
//                       <p>Description: {item.description}</p>
//                     </div>
//                     <Button
//                       onClick={() =>
//                         handleChangeCosplayer(
//                           item.characterId,
//                           item.cosplayerId,
//                           index
//                         )
//                       }
//                     >
//                       Change Cosplayer
//                     </Button>
//                   </div>
//                   <h5>Request Dates:</h5>
//                   <List
//                     dataSource={item.listUpdateRequestDates}
//                     renderItem={(date, dateIndex) => (
//                       <List.Item key={dateIndex}>
//                         <div
//                           style={{
//                             display: "flex",
//                             gap: "10px",
//                             width: "100%",
//                           }}
//                         >
//                           <Form.Item
//                             label="Start Date and Time"
//                             rules={[
//                               {
//                                 required: true,
//                                 message: "Please select start date and time",
//                               },
//                               {
//                                 validator(_, value) {
//                                   if (!value) return Promise.reject();
//                                   const today = dayjs().startOf("day");
//                                   if (value < today.add(1, "day")) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "Start date must be at least 1 day in the future"
//                                       )
//                                     );
//                                   }
//                                   if (!isValidTime(value)) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "Start time must be between 08:00 AM and 10:00 PM"
//                                       )
//                                     );
//                                   }
//                                   return Promise.resolve();
//                                 },
//                               },
//                             ]}
//                           >
//                             <DatePicker
//                               format="HH:mm DD/MM/YYYY"
//                               showTime={{ format: "HH:mm", minuteStep: 15 }}
//                               disabledDate={disabledDate}
//                               value={
//                                 date.startDate
//                                   ? dayjs(date.startDate, "HH:mm DD/MM/YYYY")
//                                   : null
//                               }
//                               onChange={(value) =>
//                                 updateRequestDates(
//                                   index,
//                                   dateIndex,
//                                   "startDate",
//                                   value ? value.format("HH:mm DD/MM/YYYY") : ""
//                                 )
//                               }
//                               style={{ width: "200px" }}
//                             />
//                           </Form.Item>
//                           <Form.Item
//                             label="To"
//                             rules={[
//                               {
//                                 required: true,
//                                 message: "Please select end date and time",
//                               },
//                               {
//                                 validator(_, value) {
//                                   if (!value) return Promise.reject();
//                                   const startDate = dayjs(
//                                     item.listUpdateRequestDates[dateIndex]
//                                       .startDate,
//                                     "HH:mm DD/MM/YYYY"
//                                   );
//                                   if (startDate && value < startDate) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "End date must be after start date"
//                                       )
//                                     );
//                                   }
//                                   if (!isValidTime(value)) {
//                                     return Promise.reject(
//                                       new Error(
//                                         "End time must be between 08:00 AM and 10:00 PM"
//                                       )
//                                     );
//                                   }
//                                   return Promise.resolve();
//                                 },
//                               },
//                             ]}
//                           >
//                             <DatePicker
//                               format="HH:mm DD/MM/YYYY"
//                               showTime={{ format: "HH:mm", minuteStep: 15 }}
//                               disabledDate={disabledDate}
//                               value={
//                                 date.endDate
//                                   ? dayjs(date.endDate, "HH:mm DD/MM/YYYY")
//                                   : null
//                               }
//                               onChange={(value) =>
//                                 updateRequestDates(
//                                   index,
//                                   dateIndex,
//                                   "endDate",
//                                   value ? value.format("HH:mm DD/MM/YYYY") : ""
//                                 )
//                               }
//                               style={{ width: "200px" }}
//                             />
//                           </Form.Item>
//                         </div>
//                       </List.Item>
//                     )}
//                   />
//                 </div>
//               </List.Item>
//             )}
//           />
//           <Modal
//             title="Change Cosplayer"
//             open={changeCosplayerVisible}
//             onOk={() => setChangeCosplayerVisible(false)}
//             onCancel={() => setChangeCosplayerVisible(false)}
//             okText="Close"
//             cancelText="Cancel"
//             footer={
//               <>
//                 <Button
//                   onClick={() =>
//                     handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
//                   }
//                 >
//                   Previous
//                 </Button>
//                 <span>
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <Button
//                   onClick={() =>
//                     handlePageChange(
//                       currentPage < totalPages ? currentPage + 1 : totalPages
//                     )
//                   }
//                 >
//                   Next
//                 </Button>
//                 <Button
//                   className="btn btn-outline-danger"
//                   onClick={() => handleSort("salaryIndex")}
//                   style={{ marginBottom: "5px" }}
//                 >
//                   Hourly Salary{" "}
//                   {sortField === "salaryIndex" &&
//                     (sortOrder === "ascend" ? "↑" : "↓")}
//                 </Button>
//               </>
//             }
//           >
//             <List
//               dataSource={paginatedCosplayers}
//               renderItem={(cosplayer) => (
//                 <List.Item
//                   key={cosplayer.accountId}
//                   onClick={() => handleCosplayerSelect(cosplayer.accountId)}
//                   style={{ cursor: "pointer" }}
//                 >
//                   <span>{cosplayer.name}</span>
//                   <span> | ⭐ {cosplayer.averageStar}/5</span>
//                   <span> | 📏 {cosplayer.height}cm</span>
//                   <span> | ⚖️ {cosplayer.weight}kg</span>
//                   <span>
//                     {" "}
//                     | 🪙 {cosplayer.salaryIndex.toLocaleString()}VND/h
//                   </span>
//                 </List.Item>
//               )}
//             />
//           </Modal>
//         </>
//       )}
//     </Modal>
//   );
// };

// export default EditRequestHireCosplayer;

/////////// ko cho edit ngay, design lai datepicker, ko cho edit
import React, { useState, useEffect, useCallback } from "react";
import { Form, Modal, Input, List, Button } from "antd";
import { Edit } from "lucide-react";
import dayjs from "dayjs";
import MyHistoryService from "../../services/HistoryService/MyHistoryService";
import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
import { toast } from "react-toastify";

const { TextArea } = Input;

const EditRequestHireCosplayer = ({
  visible,
  requestId,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    location: "",
    serviceId: "S002",
    packageId: "",
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
  const rowsPerPage = 8;

  // Hàm tính giá cho mỗi cosplayer
  const calculateCosplayerPrice = (
    salaryIndex,
    characterPrice,
    quantity,
    totalHours,
    totalDate
  ) => {
    if (!salaryIndex || !characterPrice || !totalHours || !totalDate) return 0;
    return (totalHours * salaryIndex + totalDate * characterPrice) * quantity;
  };

  // Hàm tính tổng giá
  const calculateTotalPrice = (characters, totalDate) => {
    return characters.reduce((total, char) => {
      const totalHours = char.listUpdateRequestDates.reduce(
        (sum, date) => sum + (date.totalHour || 0),
        0
      );
      return (
        total +
        calculateCosplayerPrice(
          char.salaryIndex,
          char.characterPrice || 0,
          char.quantity,
          totalHours,
          totalDate
        )
      );
    }, 0);
  };

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

          if (char.cosplayerId) {
            try {
              const cosplayerData =
                await RequestService.getNameCosplayerInRequestByCosplayerId(
                  char.cosplayerId
                );
              cosplayerName = cosplayerData?.name || "Unknown";
              salaryIndex = cosplayerData?.salaryIndex || 1;
              cosplayerId = cosplayerData?.accountId || char.cosplayerId;
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
            characterId: char.characterId,
            cosplayerId,
            cosplayerName,
            characterName,
            characterPrice,
            salaryIndex,
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
        packageId: data.packageId || "",
        totalDate: data.totalDate || 0,
        listUpdateRequestCharacters,
      });

      form.setFieldsValue({
        name: data.name || "",
        description: data.description || "",
        location: data.location || "",
      });

      const price = calculateTotalPrice(
        listUpdateRequestCharacters,
        data.totalDate || 0
      );
      setTotalPrice(price);
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
        packageId: requestData.packageId,
        listUpdateRequestCharacters:
          requestData.listUpdateRequestCharacters.map((char) => ({
            characterId: char.characterId,
            cosplayerId: char.cosplayerId,
            description: char.description,
            quantity: char.quantity,
            listUpdateRequestDates: char.listUpdateRequestDates.map((date) => ({
              requestDateId: date.requestDateId || null,
              startDate: date.startDate,
              endDate: date.endDate,
              totalHour: date.totalHour || 0,
            })),
          })),
      };

      setLoading(true);
      const response = await MyHistoryService.editRequest(
        requestId,
        formattedData
      );
      toast.success(response?.message || "Request updated successfully!");
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
    try {
      const data = {
        characterId,
        dates,
        checkAccountRequest: true,
      };
      const available = await MyHistoryService.ChangeCosplayer(data);

      const uniqueCosplayers = [];
      const seenAccountIds = new Set();
      available.forEach((cos) => {
        if (
          (cos.accountId === currentCosplayerId ||
            !existingCosplayerIds.has(cos.accountId)) &&
          !seenAccountIds.has(cos.accountId)
        ) {
          uniqueCosplayers.push({
            name: cos.name,
            accountId: cos.accountId,
            averageStar: cos.averageStar || 0,
            height: cos.height || 0,
            weight: cos.weight || 0,
            salaryIndex: cos.salaryIndex || 0,
          });
          seenAccountIds.add(cos.accountId);
        }
      });

      setAvailableCosplayers(uniqueCosplayers);
      setCurrentCharacterIndex(index);
      setChangeCosplayerVisible(true);
    } catch (error) {
      console.error("Error fetching available cosplayers:", error);
      toast.error(
        error.response?.data?.message || "Failed to load available cosplayers."
      );
    }
  };

  const handleCosplayerSelect = async (accountId) => {
    const selectedCosplayer = availableCosplayers.find(
      (cos) => cos.accountId === accountId
    );
    if (selectedCosplayer && currentCharacterIndex !== null) {
      const updatedCharacters = [...requestData.listUpdateRequestCharacters];
      const char = updatedCharacters[currentCharacterIndex];
      const previousCosplayerId = char.cosplayerId;

      char.cosplayerId = accountId;
      char.cosplayerName = selectedCosplayer.name;
      char.averageStar = selectedCosplayer.averageStar;
      char.height = selectedCosplayer.height;
      char.weight = selectedCosplayer.weight;
      char.salaryIndex = selectedCosplayer.salaryIndex;

      setRequestData((prev) => ({
        ...prev,
        listUpdateRequestCharacters: updatedCharacters,
      }));

      setExistingCosplayerIds((prev) => {
        const newSet = new Set(prev);
        if (previousCosplayerId) newSet.delete(previousCosplayerId);
        newSet.add(accountId);
        return newSet;
      });

      const price = calculateTotalPrice(
        updatedCharacters,
        requestData.totalDate
      );
      setTotalPrice(price);

      setChangeCosplayerVisible(false);
      setCurrentCharacterIndex(null);
    }
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

  const paginatedCosplayers = sortedCosplayers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(availableCosplayers.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page < 1 ? 1 : page > totalPages ? totalPages : page);
  };

  return (
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
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Please enter the request name" },
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
              rules={[{ required: true, message: "Please enter the location" }]}
            >
              <Input placeholder="Enter location" />
            </Form.Item>
          </Form>
          <h4>
            List of Requested Characters (Total Price:{" "}
            {totalPrice.toLocaleString()} VND)
          </h4>
          <i style={{ color: "gray" }}>
            *Note: Unit Price hire cosplayer = (Total Hours × Hourly Rate) +
            (Total Days × Character Price)
          </i>
          <List
            dataSource={requestData.listUpdateRequestCharacters}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p>
                        <span>Cosplayer Name: </span>
                        <strong>{item.cosplayerName}</strong>
                        {item.averageStar && (
                          <span> | Rating: {item.averageStar}/5</span>
                        )}
                        {item.height && <span> | Height: {item.height}cm</span>}
                        {item.weight && <span> | Weight: {item.weight}kg</span>}
                        {item.salaryIndex && (
                          <span>
                            {" "}
                            | Hourly Rate: {item.salaryIndex.toLocaleString()}{" "}
                            VND/h
                          </span>
                        )}
                      </p>
                      <p>
                        Character <strong>{item.characterName}</strong>{" "}
                        Price/day: {item.characterPrice.toLocaleString()} VND
                      </p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Description: {item.description}</p>
                    </div>
                    <Button
                      onClick={() =>
                        handleChangeCosplayer(
                          item.characterId,
                          item.cosplayerId,
                          index
                        )
                      }
                    >
                      Change Cosplayer
                    </Button>
                  </div>
                  <h5 style={{ marginBottom: "5px" }}>Request Dates:</h5>
                  <List
                    dataSource={item.listUpdateRequestDates}
                    renderItem={(date, dateIndex) => (
                      <List.Item
                        key={dateIndex}
                        style={{ padding: "5px 0", borderBottom: "none" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <span>
                            {date.startDate} - {date.endDate}
                          </span>
                        </div>
                      </List.Item>
                    )}
                    style={{ marginLeft: "20px" }}
                  />
                </div>
              </List.Item>
            )}
          />
          <Modal
            title="Change Cosplayer"
            open={changeCosplayerVisible}
            onOk={() => setChangeCosplayerVisible(false)}
            onCancel={() => setChangeCosplayerVisible(false)}
            okText="Close"
            cancelText="Cancel"
            footer={
              <>
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
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    )
                  }
                >
                  Next
                </Button>
                <Button
                  className="btn btn-outline-danger"
                  onClick={() => handleSort("salaryIndex")}
                  style={{ marginBottom: "5px" }}
                >
                  Hourly Salary{" "}
                  {sortField === "salaryIndex" &&
                    (sortOrder === "ascend" ? "↑" : "↓")}
                </Button>
              </>
            }
          >
            <List
              dataSource={paginatedCosplayers}
              renderItem={(cosplayer) => (
                <List.Item
                  key={cosplayer.accountId}
                  onClick={() => handleCosplayerSelect(cosplayer.accountId)}
                  style={{ cursor: "pointer" }}
                >
                  <span>{cosplayer.name}</span>
                  <span> | ⭐ {cosplayer.averageStar}/5</span>
                  <span> | 📏 {cosplayer.height}cm</span>
                  <span> | ⚖️ {cosplayer.weight}kg</span>
                  <span>
                    {" "}
                    | 🪙 {cosplayer.salaryIndex.toLocaleString()}VND/h
                  </span>
                </List.Item>
              )}
            />
          </Modal>
        </>
      )}
    </Modal>
  );
};

export default EditRequestHireCosplayer;
