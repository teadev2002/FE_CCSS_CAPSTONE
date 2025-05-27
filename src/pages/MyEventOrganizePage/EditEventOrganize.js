// import React, { useState, useEffect } from "react";
// import { Form, Row, Col, InputGroup } from "react-bootstrap";
// import {
//   Modal,
//   Button,
//   Collapse,
//   Select,
//   message,
//   List,
//   Avatar,
//   Spin,
//   Pagination,
// } from "antd";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyEventOrganize.scss";
// import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
// import dayjs from "dayjs";

// const { Panel } = Collapse;
// const { Option } = Select;

// const EditEventOrganize = ({
//   visible,
//   onOk,
//   onCancel,
//   modalData,
//   setModalData,
//   packages,
//   characters,
//   requests,
//   setRequests,
// }) => {
//   const [packagePrice, setPackagePrice] = useState(0);
//   const [characterPrices, setCharacterPrices] = useState({});
//   const [isCharacterModalVisible, setIsCharacterModalVisible] = useState(false);
//   const [availableCharacters, setAvailableCharacters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(5);
//   const [charactersToAdd, setCharactersToAdd] = useState([]);
//   const [charactersToRemove, setCharactersToRemove] = useState([]);
//   const { id: accountId } = useParams();

//   // Tính giá tự động khi modalData thay đổi
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
//     if (visible && modalData.status === "Pending") {
//       calculatePrice();
//     }
//   }, [
//     modalData.packageId,
//     modalData.listCharacters,
//     modalData.startDate,
//     modalData.endDate,
//     visible,
//     setModalData,
//   ]);

//   // Lấy danh sách nhân vật khi mở modal chọn nhân vật, lọc bỏ nhân vật đã có trong request
//   useEffect(() => {
//     const fetchCharacters = async () => {
//       if (isCharacterModalVisible) {
//         try {
//           setLoading(true);
//           const requestData =
//             await MyEventOrganizeService.getRequestByRequestId(
//               modalData.requestId
//             );
//           const existingCharacterIds = (
//             requestData.charactersListResponse || []
//           ).map((char) => char.characterId);
//           const allCharacters = await MyEventOrganizeService.getAllCharacters();
//           const filteredCharacters = (allCharacters || []).filter(
//             (char) => !existingCharacterIds.includes(char.characterId)
//           );
//           setAvailableCharacters(filteredCharacters);
//           setCurrentPage(1);
//         } catch (error) {
//           toast.error("Failed to load characters.");
//           console.error("Error fetching characters:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchCharacters();
//   }, [isCharacterModalVisible, modalData.requestId]);

//   // Hàm xử lý thay đổi số lượng
//   const handleQuantityChange = (charIndex, newQuantity) => {
//     const parsedQuantity = parseInt(newQuantity, 10);
//     if (isNaN(parsedQuantity) || parsedQuantity < 1) {
//       toast.error("Quantity must be at least 1!");
//       return;
//     }

//     const updatedCharacters = [...modalData.listCharacters];
//     updatedCharacters[charIndex] = {
//       ...updatedCharacters[charIndex],
//       quantity: parsedQuantity,
//     };
//     setModalData({
//       ...modalData,
//       listCharacters: updatedCharacters,
//     });

//     setCharactersToAdd((prev) =>
//       prev.map((char) =>
//         char.characterId === updatedCharacters[charIndex].characterId
//           ? { ...char, quantity: parsedQuantity }
//           : char
//       )
//     );
//   };

//   // Hàm xử lý thêm nhân vật
//   const handleAddCharacter = async (characterId) => {
//     if (!characterId) {
//       toast.error("Please select a character!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const characterData = await MyEventOrganizeService.getCharacterById(
//         characterId
//       );
//       const requestData = await MyEventOrganizeService.getRequestByRequestId(
//         modalData.requestId
//       );
//       const requestDateResponses =
//         requestData.charactersListResponse[0]?.requestDateResponses || [];

//       // Chuẩn bị dữ liệu để gọi AddCharacterInReq
//       const addCharacterData = {
//         requestId: modalData.requestId,
//         characterId: characterId,
//         description: "shared",
//         cosplayerId: null,
//         quantity: 1,
//         addRequestDates: requestDateResponses.map((date) => ({
//           startDate: date.startDate,
//           endDate: date.endDate,
//         })),
//       };

//       // Gọi API AddCharacterInReq
//       const addResponse = await MyEventOrganizeService.AddCharacterInReq(
//         addCharacterData
//       );
//       console.log("AddCharacterInReq response:", addResponse);

//       // Lấy lại dữ liệu request để có requestCharacterId từ backend
//       const updatedRequestData =
//         await MyEventOrganizeService.getRequestByRequestId(modalData.requestId);
//       const updatedCharactersList =
//         updatedRequestData.charactersListResponse || [];

//       // Tìm character mới thêm vào
//       const newCharacter = updatedCharactersList.find(
//         (char) => char.characterId === characterId
//       );

//       if (!newCharacter) {
//         throw new Error("Newly added character not found in request data.");
//       }

//       // Cập nhật modalData.listCharacters với dữ liệu từ backend
//       const newCharacterData = {
//         requestCharacterId: newCharacter.requestCharacterId,
//         characterId: newCharacter.characterId,
//         characterName: characterData.characterName,
//         cosplayerId: null,
//         quantity: 1,
//         description: "shared",
//         characterImages: characterData.images || [],
//         requestDateResponses: newCharacter.requestDateResponses || [],
//         maxHeight: characterData.maxHeight,
//         maxWeight: characterData.maxWeight,
//         minHeight: characterData.minHeight,
//         minWeight: characterData.minWeight,
//         status: "Pending",
//       };

//       setCharactersToAdd((prev) => [
//         ...prev,
//         {
//           requestId: modalData.requestId,
//           characterId: characterId,
//           description: "shared",
//           cosplayerId: null,
//           quantity: 1,
//           requestCharacterId: newCharacter.requestCharacterId,
//         },
//       ]);

//       setModalData((prev) => ({
//         ...prev,
//         listCharacters: [...prev.listCharacters, newCharacterData],
//       }));

//       toast.success("Character added successfully!");
//       setIsCharacterModalVisible(false);
//     } catch (error) {
//       toast.error("Failed to add character.");
//       console.error("Error adding character:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm xử lý xóa nhân vật
//   const handleRemoveCharacter = (charIndex, requestCharacterId, status) => {
//     if (modalData.listCharacters.length <= 1) {
//       toast.error(
//         "Cannot remove the last character! At least one character is required."
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       if (requestCharacterId) {
//         setCharactersToRemove((prev) => [...prev, { requestCharacterId }]);
//       }

//       setCharactersToAdd((prev) =>
//         prev.filter((char) => char.requestCharacterId !== requestCharacterId)
//       );

//       setModalData((prev) => ({
//         ...prev,
//         listCharacters: prev.listCharacters.filter(
//           (_, index) => index !== charIndex
//         ),
//       }));

//       toast.success("Character removed from pending changes!");
//     } catch (error) {
//       toast.error("Failed to prepare character for removal.");
//       console.error("Error preparing character removal:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm xử lý xác nhận lưu thay đổi
//   const handleConfirm = async () => {
//     if (modalData.status !== "Pending") {
//       onCancel();
//       return;
//     }
//     if (!modalData.packageId) {
//       toast.error("Package is required!");
//       return;
//     }
//     if (modalData.listCharacters.some((char) => !char.characterId)) {
//       toast.error("All characters must have a selected character!");
//       return;
//     }
//     if (
//       modalData.listCharacters.some(
//         (char) => !char.quantity || char.quantity < 1
//       )
//     ) {
//       toast.error("All characters must have a valid quantity (minimum 1)!");
//       return;
//     }
//     // Prevent submission if data is still loading
//     if (loading) {
//       toast.error("Please wait, data is still loading.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Debug: Log modalData.range to confirm it's set
//       console.log("modalData.range before sending:", modalData.range);

//       // 1. Gọi API DeleteCharacterInReq cho các nhân vật trong charactersToRemove
//       const deleteCharacterPromises = charactersToRemove.map(async (char) => {
//         try {
//           const response = await MyEventOrganizeService.DeleteCharacterInReq(
//             char.requestCharacterId
//           );
//           console.log(
//             `DeleteCharacterInReq response for ${char.requestCharacterId}:`,
//             response
//           );
//           return response;
//         } catch (error) {
//           console.error(
//             `Failed to delete character ${char.requestCharacterId}:`,
//             error
//           );
//           throw new Error(
//             `Failed to delete character ${char.requestCharacterId}`
//           );
//         }
//       });

//       // Chờ tất cả các API DeleteCharacterInReq hoàn thành
//       await Promise.all(deleteCharacterPromises);

//       // 2. Gọi API updateEventOrganizationRequest với danh sách characters
//       const requestData = {
//         name: modalData.name,
//         description: modalData.description,
//         price: modalData.price,
//         startDate: modalData.startDate,
//         endDate: modalData.endDate,
//         location: modalData.location,
//         serviceId: modalData.serviceId || "S003",
//         packageId: modalData.packageId,
//         range: modalData.range || "", // Include the price range from modalData
//         listUpdateRequestCharacters: modalData.listCharacters.map((char) => ({
//           requestCharacterId: char.requestCharacterId,
//           characterId: char.characterId,
//           description: char.description || "shared",
//           quantity: char.quantity || 1,
//           cosplayerId: char.cosplayerId || null,
//         })),
//       };

//       // Debug: Log requestData to confirm range is included
//       console.log(
//         "Sending updateEventOrganizationRequest with data:",
//         requestData
//       );

//       const updateResponse =
//         await MyEventOrganizeService.updateEventOrganizationRequest(
//           modalData.requestId,
//           requestData
//         );

//       // Debug: Log API response
//       console.log("updateEventOrganizationRequest response:", updateResponse);

//       // 3. Xóa danh sách pending changes
//       setCharactersToAdd([]);
//       setCharactersToRemove([]);

//       setTimeout(() => {
//         window.location.reload();
//       }, 400); // Delay to allow user to see success message

//       toast.success("Request updated successfully!");
//       onOk();
//     } catch (error) {
//       // Debug: Log detailed error information
//       console.error("Error in handleConfirm:", {
//         message: error.message,
//         stack: error.stack,
//         response: error.response, // Log any API response details
//       });
//       toast.error(
//         error.message || "Failed to save changes. Check console for details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tính toán danh sách nhân vật hiển thị dựa trên trang hiện tại
//   const paginatedCharacters = availableCharacters.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );
//   // Fetch request data when modal becomes visible to ensure all fields, including range, are populated
//   useEffect(() => {
//     const fetchRequestData = async () => {
//       if (visible && modalData.requestId) {
//         try {
//           setLoading(true);
//           const requestData =
//             await MyEventOrganizeService.getRequestByRequestId(
//               modalData.requestId
//             );
//           console.log("Fetched request data:", requestData); // Debug: Log the API response
//           setModalData((prev) => ({
//             ...prev,
//             name: requestData.name || prev.name,
//             description: requestData.description || prev.description,
//             price: requestData.price || prev.price,
//             startDate: formatDate(requestData.startDate) || prev.startDate,
//             endDate: formatDate(requestData.endDate) || prev.endDate,
//             location: requestData.location || prev.location,
//             serviceId: requestData.serviceId || prev.serviceId,
//             packageId: requestData.packageId || prev.packageId,
//             range: requestData.range || prev.range || "", // Ensure range is set
//             deposit: requestData.deposit || prev.deposit,
//             totalDate: requestData.totalDate || prev.totalDate,
//             reason: requestData.reason || prev.reason,
//             status: requestData.status || prev.status,
//             listCharacters: (requestData.charactersListResponse || []).map(
//               (char) => ({
//                 requestCharacterId: char.requestCharacterId,
//                 characterId: char.characterId,
//                 characterName: char.characterName,
//                 cosplayerId: char.cosplayerId,
//                 quantity: char.quantity || 1,
//                 description: char.description || "shared",
//                 characterImages: char.characterImages || [],
//                 requestDateResponses: char.requestDateResponses || [],
//                 maxHeight: char.maxHeight,
//                 maxWeight: char.maxWeight,
//                 minHeight: char.minHeight,
//                 minWeight: char.minWeight,
//                 status: char.status || "Pending",
//               })
//             ),
//           }));
//         } catch (error) {
//           console.error("Failed to fetch request data:", error);
//           toast.error("Failed to load request data.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchRequestData();
//   }, [visible, modalData.requestId, setModalData]);
//   return (
//     <div>
//       <Modal
//         title={
//           modalData.status === "Pending"
//             ? "Edit Event Request"
//             : "View Event Request  Event Request"
//         }
//         open={visible}
//         onOk={handleConfirm}
//         onCancel={onCancel}
//         okText={modalData.status === "Pending" ? "Save" : "Close"}
//         cancelText="Cancel"
//         cancelButtonProps={{
//           style: {
//             display: modalData.status === "Pending" ? "inline" : "none",
//           },
//         }}
//         width={800}
//       >
//         <Form>
//           <Form.Group className="mb-3">
//             <Form.Label>
//               <strong>Name</strong>
//             </Form.Label>
//             <p>{modalData.name}</p>
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>
//               <strong>Package</strong>
//             </Form.Label>
//             {modalData.status === "Pending" ? (
//               <Form.Select
//                 value={modalData.packageId}
//                 onChange={(e) =>
//                   setModalData({ ...modalData, packageId: e.target.value })
//                 }
//               >
//                 <option value="">Select Package</option>
//                 {packages.map((pkg) => (
//                   <option key={pkg.packageId} value={pkg.packageId}>
//                     {pkg.packageName} - {pkg.price.toLocaleString()} VND
//                   </option>
//                 ))}
//               </Form.Select>
//             ) : (
//               <p>
//                 {packages.find((pkg) => pkg.packageId === modalData.packageId)
//                   ?.packageName || modalData.packageId}
//               </p>
//             )}
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>
//               <strong>Characters </strong>
//               {modalData.status === "Pending" && (
//                 <Button
//                   type="dashed"
//                   className="btn btn-outline-primary sm-2"
//                   onClick={() => setIsCharacterModalVisible(true)}
//                 >
//                   Add Character
//                 </Button>
//               )}
//             </Form.Label>
//             {modalData.status === "Pending" ? (
//               <>
//                 {(modalData.listCharacters || []).map((char, charIndex) => (
//                   <Row key={charIndex} className="mb-2 align-items-center">
//                     <Col md={6}>
//                       <Form.Select
//                         value={char.characterId}
//                         onChange={(e) => {
//                           const selectedChar = characters.find(
//                             (c) => c.characterId === e.target.value
//                           );
//                           const updatedCharacters = [
//                             ...modalData.listCharacters,
//                           ];
//                           updatedCharacters[charIndex] = {
//                             ...updatedCharacters[charIndex],
//                             characterId: e.target.value,
//                             characterName: selectedChar?.characterName || "",
//                           };
//                           setModalData({
//                             ...modalData,
//                             listCharacters: updatedCharacters,
//                           });
//                         }}
//                       >
//                         <option value="">Select Character</option>
//                         {characters.map((c) => (
//                           <option key={c.characterId} value={c.characterId}>
//                             {c.characterName} - {c.price.toLocaleString()} VND
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Col>
//                     <Col md={2}>
//                       <InputGroup style={{ width: "60%" }}>
//                         <Form.Control
//                           type="number"
//                           value={char.quantity}
//                           onChange={(e) =>
//                             handleQuantityChange(charIndex, e.target.value)
//                           }
//                           min="1"
//                           style={{ textAlign: "center" }}
//                         />
//                       </InputGroup>
//                     </Col>
//                     <Col md={3}>
//                       <Button
//                         type="dashed"
//                         className="btn btn-outline-danger sm-2"
//                         onClick={() =>
//                           handleRemoveCharacter(
//                             charIndex,
//                             char.requestCharacterId,
//                             char.status
//                           )
//                         }
//                       >
//                         Remove
//                       </Button>
//                     </Col>
//                   </Row>
//                 ))}
//               </>
//             ) : (
//               <p>
//                 {modalData.listCharacters
//                   .map(
//                     (char) => `${char.characterName} (Qty: ${char.quantity})`
//                   )
//                   .join(", ")}
//               </p>
//             )}
//           </Form.Group>
//           <Collapse>
//             <Panel header="Additional Details" key="1">
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <div>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Description</strong>
//                     </Form.Label>
//                     <p>{modalData.description}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Start Date</strong>
//                     </Form.Label>
//                     <p>{modalData.startDate}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>End Date</strong>
//                     </Form.Label>
//                     <p>{modalData.endDate}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Location</strong>
//                     </Form.Label>
//                     <p>{modalData.location}</p>
//                   </Form.Group>
//                 </div>
//                 <div>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Total Price</strong>
//                     </Form.Label>
//                     <p>{(modalData.price || 0).toLocaleString()} VND</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Deposit</strong>
//                     </Form.Label>
//                     <p>{modalData.deposit ? `${modalData.deposit}%` : "N/A"}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Total Date</strong>
//                     </Form.Label>
//                     <p>{modalData.totalDate}</p>
//                   </Form.Group>
//                   {modalData.reason && (
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Reason</strong>
//                       </Form.Label>
//                       <p>{modalData.reason}</p>
//                     </Form.Group>
//                   )}
//                   {/* Add range field display - shows the read-only price range from modalData */}
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Unit Hire Price Range Cosplayer</strong>
//                     </Form.Label>
//                     <p>{modalData.range ? `${modalData.range} VND` : "N/A"}</p>
//                   </Form.Group>
//                 </div>
//               </div>
//               <Collapse>
//                 <Panel header="Character Details" key="2">
//                   {(modalData.listCharacters || []).map((char, charIndex) => (
//                     <Collapse key={charIndex}>
//                       <Panel
//                         header={`Character: ${char.characterName} (Qty: ${char.quantity})`}
//                         key={charIndex}
//                       >
//                         <p>Description: {char.description}</p>
//                         <p>Max Height: {char.maxHeight}</p>
//                         <p>Max Weight: {char.maxWeight}</p>
//                         <p>Min Height: {char.minHeight}</p>
//                         <p>Min Weight: {char.minWeight}</p>
//                         {char.status !== "Pending" && (
//                           <p>Status: {char.status}</p>
//                         )}
//                         <Collapse>
//                           <Panel header="Character Images" key="images">
//                             {char.characterImages.length > 0 ? (
//                               <ul>
//                                 {char.characterImages.map((img, idx) => (
//                                   <li key={idx}>
//                                     <img
//                                       src={img.urlImage}
//                                       style={{
//                                         maxWidth: "100px",
//                                         maxHeight: "100px",
//                                       }}
//                                       alt="Character"
//                                     />
//                                   </li>
//                                 ))}
//                               </ul>
//                             ) : (
//                               <p>No images available.</p>
//                             )}
//                           </Panel>
//                           <Panel header="Request Dates" key="dates">
//                             {char.requestDateResponses.length > 0 ? (
//                               <ul>
//                                 {char.requestDateResponses.map((date, idx) => (
//                                   <li key={idx}>
//                                     Date: {formatDate(date.startDate)} -{" "}
//                                     {formatDate(date.endDate)} (Total Hours:{" "}
//                                     {date.totalHour})
//                                     {date.reason && (
//                                       <>
//                                         <br />
//                                         Reason: {date.reason}
//                                       </>
//                                     )}
//                                     {date.status !== 0 && (
//                                       <>
//                                         <br />
//                                         Status: {date.status}
//                                       </>
//                                     )}
//                                   </li>
//                                 ))}
//                               </ul>
//                             ) : (
//                               <p>No request dates available.</p>
//                             )}
//                           </Panel>
//                         </Collapse>
//                       </Panel>
//                     </Collapse>
//                   ))}
//                 </Panel>
//               </Collapse>
//             </Panel>
//           </Collapse>
//         </Form>
//       </Modal>

//       {/* Modal chọn nhân vật với phân trang */}
//       <Modal
//         title="Select Character"
//         open={isCharacterModalVisible}
//         onCancel={() => setIsCharacterModalVisible(false)}
//         footer={null}
//         width={600}
//       >
//         {loading ? (
//           <div className="text-center">
//             <Spin />
//           </div>
//         ) : (
//           <>
//             <List
//               itemLayout="horizontal"
//               dataSource={paginatedCharacters}
//               renderItem={(character) => (
//                 <List.Item
//                   actions={[
//                     <Button
//                       type="primary"
//                       size="small"
//                       onClick={() => handleAddCharacter(character.characterId)}
//                       disabled={
//                         modalData.listCharacters.some(
//                           (char) => char.characterId === character.characterId
//                         ) || character.quantity <= 0
//                       }
//                     >
//                       Select
//                     </Button>,
//                   ]}
//                 >
//                   <List.Item.Meta
//                     avatar={
//                       character.images && character.images[0]?.urlImage ? (
//                         <Avatar src={character.images[0].urlImage} size={64} />
//                       ) : (
//                         <Avatar size={64}>{character.characterName[0]}</Avatar>
//                       )
//                     }
//                     title={character.characterName}
//                     description={
//                       <>
//                         <span>
//                           Price: {character.price.toLocaleString()} VND/day
//                         </span>{" "}
//                         <br />
//                         <span>
//                           Quantity: {character.quantity || "N/A"}
//                         </span>{" "}
//                         <br />
//                         <span>
//                           Height: {character.minHeight}cm -{" "}
//                           {character.maxHeight}cm
//                         </span>{" "}
//                         <br />
//                         <span>
//                           Weight: {character.minWeight}kg -{" "}
//                           {character.maxWeight}kg
//                         </span>
//                       </>
//                     }
//                   />
//                 </List.Item>
//               )}
//             />
//             <div style={{ textAlign: "center", marginTop: 16 }}>
//               <Pagination
//                 current={currentPage}
//                 pageSize={pageSize}
//                 total={availableCharacters.length}
//                 onChange={(page) => setCurrentPage(page)}
//                 showSizeChanger={false}
//               />
//             </div>
//           </>
//         )}
//       </Modal>
//     </div>
//   );
// };

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

// export default EditEventOrganize;

/// validate quantity========================================
// import React, { useState, useEffect } from "react";
// import { Form, Row, Col, InputGroup } from "react-bootstrap";
// import {
//   Modal,
//   Button,
//   Collapse,
//   Select,
//   message,
//   List,
//   Avatar,
//   Spin,
//   Pagination,
// } from "antd";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyEventOrganize.scss";
// import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
// import dayjs from "dayjs";

// const { Panel } = Collapse;
// const { Option } = Select;

// const EditEventOrganize = ({
//   visible,
//   onOk,
//   onCancel,
//   modalData,
//   setModalData,
//   packages,
//   characters,
//   requests,
//   setRequests,
// }) => {
//   const [packagePrice, setPackagePrice] = useState(0);
//   const [characterPrices, setCharacterPrices] = useState({});
//   const [isCharacterModalVisible, setIsCharacterModalVisible] = useState(false);
//   const [availableCharacters, setAvailableCharacters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(5);
//   const [charactersToAdd, setCharactersToAdd] = useState([]);
//   const [charactersToRemove, setCharactersToRemove] = useState([]);
//   const { id: accountId } = useParams();

//   // Tính giá tự động khi modalData thay đổi
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
//             return {
//               [char.characterId]: charData.price || 0,
//             };
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
//     if (visible && modalData.status === "Pending") {
//       calculatePrice();
//     }
//   }, [
//     modalData.packageId,
//     modalData.listCharacters,
//     modalData.startDate,
//     modalData.endDate,
//     visible,
//     setModalData,
//   ]);

//   // Lấy danh sách nhân vật khi mở modal chọn nhân vật, lọc bỏ nhân vật đã có trong request
//   // Fetch characters when character modal is opened, excluding those already in request and with quantity < 1
//   useEffect(() => {
//     const fetchCharacters = async () => {
//       if (isCharacterModalVisible) {
//         try {
//           setLoading(true);
//           const requestData =
//             await MyEventOrganizeService.getRequestByRequestId(
//               modalData.requestId
//             );
//           const existingCharacterIds = (
//             requestData.charactersListResponse || []
//           ).map((char) => char.characterId);
//           const allCharacters = await MyEventOrganizeService.getAllCharacters();
//           const filteredCharacters = (allCharacters || []).filter(
//             (char) =>
//               !existingCharacterIds.includes(char.characterId) &&
//               char.quantity >= 1 // Only include characters with quantity >= 1
//           );
//           setAvailableCharacters(filteredCharacters);
//           setCurrentPage(1);
//         } catch (error) {
//           toast.error("Failed to load characters.");
//           console.error("Error fetching characters:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchCharacters();
//   }, [isCharacterModalVisible, modalData.requestId]);

//   // Hàm xử lý thay đổi số lượng
//   // Handle quantity change with validation
//   const handleQuantityChange = (charIndex, newQuantity) => {
//     const parsedQuantity = parseInt(newQuantity, 10);
//     if (isNaN(parsedQuantity) || parsedQuantity < 1) {
//       toast.error("Quantity must be at least 1!");
//       return;
//     }

//     const character = characters.find(
//       (c) => c.characterId === modalData.listCharacters[charIndex].characterId
//     );
//     if (!character) {
//       toast.error("Character not found!");
//       return;
//     }

//     if (parsedQuantity > character.quantity) {
//       toast.warn(
//         `Maximum quantity for ${character.characterName} is ${character.quantity}!`
//       );
//       return;
//     }

//     const updatedCharacters = [...modalData.listCharacters];
//     updatedCharacters[charIndex] = {
//       ...updatedCharacters[charIndex],
//       quantity: parsedQuantity,
//     };
//     setModalData({
//       ...modalData,
//       listCharacters: updatedCharacters,
//     });

//     setCharactersToAdd((prev) =>
//       prev.map((char) =>
//         char.characterId === updatedCharacters[charIndex].characterId
//           ? { ...char, quantity: parsedQuantity }
//           : char
//       )
//     );
//   };

//   // Hàm xử lý thêm nhân vật
//   // Handle adding a character with quantity validation
//   const handleAddCharacter = async (characterId) => {
//     if (!characterId) {
//       toast.error("Please select a character!");
//       return;
//     }

//     const characterData = characters.find((c) => c.characterId === characterId);
//     if (!characterData) {
//       toast.error("Character not found!");
//       return;
//     }

//     // Calculate total quantity for this character (existing + new)
//     const existingQuantity = modalData.listCharacters
//       .filter((char) => char.characterId === characterId)
//       .reduce((sum, char) => sum + (char.quantity || 1), 0);
//     const newQuantity = 1; // Default quantity for new character
//     const totalQuantity = existingQuantity + newQuantity;

//     if (totalQuantity > characterData.quantity) {
//       toast.warn(
//         `Cannot add ${characterData.characterName}. Total quantity (${totalQuantity}) exceeds available inventory (${characterData.quantity})!`
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const requestData = await MyEventOrganizeService.getRequestByRequestId(
//         modalData.requestId
//       );
//       const requestDateResponses =
//         requestData.charactersListResponse[0]?.requestDateResponses || [];

//       // Prepare data for AddCharacterInReq
//       const addCharacterData = {
//         requestId: modalData.requestId,
//         characterId: characterId,
//         description: "shared",
//         cosplayerId: null,
//         quantity: newQuantity,
//         addRequestDates: requestDateResponses.map((date) => ({
//           startDate: date.startDate,
//           endDate: date.endDate,
//         })),
//       };

//       // Call AddCharacterInReq API
//       const addResponse = await MyEventOrganizeService.AddCharacterInReq(
//         addCharacterData
//       );
//       console.log("AddCharacterInReq response:", addResponse);

//       // Fetch updated request data to get requestCharacterId
//       const updatedRequestData =
//         await MyEventOrganizeService.getRequestByRequestId(modalData.requestId);
//       const updatedCharactersList =
//         updatedRequestData.charactersListResponse || [];

//       // Find the newly added character
//       const newCharacter = updatedCharactersList.find(
//         (char) => char.characterId === characterId
//       );

//       if (!newCharacter) {
//         throw new Error("Newly added character not found in request data.");
//       }

//       // Update modalData.listCharacters with backend data
//       const newCharacterData = {
//         requestCharacterId: newCharacter.requestCharacterId,
//         characterId: newCharacter.characterId,
//         characterName: characterData.characterName,
//         cosplayerId: null,
//         quantity: newQuantity,
//         description: "shared",
//         characterImages: characterData.images || [],
//         requestDateResponses: newCharacter.requestDateResponses || [],
//         maxHeight: characterData.maxHeight,
//         maxWeight: characterData.maxWeight,
//         minHeight: characterData.minHeight,
//         minWeight: characterData.minWeight,
//         status: "Pending",
//       };

//       setCharactersToAdd((prev) => [
//         ...prev,
//         {
//           requestId: modalData.requestId,
//           characterId: characterId,
//           description: "No description",
//           cosplayerId: null,
//           quantity: newQuantity,
//           requestCharacterId: newCharacter.requestCharacterId,
//         },
//       ]);

//       setModalData((prev) => ({
//         ...prev,
//         listCharacters: [...prev.listCharacters, newCharacterData],
//       }));

//       toast.success("Character added successfully!");
//       setIsCharacterModalVisible(false);
//     } catch (error) {
//       toast.error("Failed to add character.");
//       console.error("Error adding character:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm xử lý xóa nhân vật
//   const handleRemoveCharacter = (charIndex, requestCharacterId, status) => {
//     if (modalData.listCharacters.length <= 1) {
//       toast.error(
//         "Cannot remove the last character! At least one character is required."
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       if (requestCharacterId) {
//         setCharactersToRemove((prev) => [...prev, { requestCharacterId }]);
//       }

//       setCharactersToAdd((prev) =>
//         prev.filter((char) => char.requestCharacterId !== requestCharacterId)
//       );

//       setModalData((prev) => ({
//         ...prev,
//         listCharacters: prev.listCharacters.filter(
//           (_, index) => index !== charIndex
//         ),
//       }));

//       toast.success("Character removed from pending changes!");
//     } catch (error) {
//       toast.error("Failed to prepare character for removal.");
//       console.error("Error preparing character removal:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm xử lý xác nhận lưu thay đổi
//   // Handle confirmation of changes with quantity validation
//   const handleConfirm = async () => {
//     if (modalData.status !== "Pending") {
//       onCancel();
//       return;
//     }
//     if (!modalData.packageId) {
//       toast.error("Package is required!");
//       return;
//     }
//     if (modalData.listCharacters.some((char) => !char.characterId)) {
//       toast.error("All characters must have a selected character!");
//       return;
//     }
//     if (
//       modalData.listCharacters.some(
//         (char) => !char.quantity || char.quantity < 1
//       )
//     ) {
//       toast.error("All characters must have a valid quantity (minimum 1)!");
//       return;
//     }

//     // Validate total quantity per character
//     const characterQuantities = {};
//     modalData.listCharacters.forEach((char) => {
//       characterQuantities[char.characterId] =
//         (characterQuantities[char.characterId] || 0) + (char.quantity || 1);
//     });

//     for (const [characterId, totalQuantity] of Object.entries(
//       characterQuantities
//     )) {
//       const character = characters.find((c) => c.characterId === characterId);
//       if (!character) {
//         toast.error(`Character with ID ${characterId} not found!`);
//         return;
//       }
//       if (totalQuantity > character.quantity) {
//         toast.warn(
//           `Total quantity for ${character.characterName} (${totalQuantity}) exceeds available inventory (${character.quantity})!`
//         );
//         return;
//       }
//     }

//     // Prevent submission if data is still loading
//     if (loading) {
//       toast.error("Please wait, data is still loading.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Debug: Log modalData.range to confirm it's set
//       console.log("modalData.range before sending:", modalData.range);

//       // 1. Call DeleteCharacterInReq for characters in charactersToRemove
//       const deleteCharacterPromises = charactersToRemove.map(async (char) => {
//         try {
//           const response = await MyEventOrganizeService.DeleteCharacterInReq(
//             char.requestCharacterId
//           );
//           console.log(
//             `DeleteCharacterInReq response for ${char.requestCharacterId}:`,
//             response
//           );
//           return response;
//         } catch (error) {
//           console.error(
//             `Failed to delete character ${char.requestCharacterId}:`,
//             error
//           );
//           throw new Error(
//             `Failed to delete character ${char.requestCharacterId}`
//           );
//         }
//       });

//       // Wait for all DeleteCharacterInReq APIs to complete
//       await Promise.all(deleteCharacterPromises);

//       // 2. Call updateEventOrganizationRequest with character list
//       const requestData = {
//         name: modalData.name,
//         description: modalData.description,
//         price: modalData.price,
//         startDate: modalData.startDate,
//         endDate: modalData.endDate,
//         location: modalData.location,
//         serviceId: modalData.serviceId || "S003",
//         packageId: modalData.packageId,
//         range: modalData.range || "",
//         listUpdateRequestCharacters: modalData.listCharacters.map((char) => ({
//           requestCharacterId: char.requestCharacterId,
//           characterId: char.characterId,
//           description: char.description || "shared",
//           quantity: char.quantity || 1,
//           cosplayerId: char.cosplayerId || null,
//         })),
//       };

//       // Debug: Log requestData to confirm range is included
//       console.log(
//         "Sending updateEventOrganizationRequest with data:",
//         requestData
//       );

//       const updateResponse =
//         await MyEventOrganizeService.updateEventOrganizationRequest(
//           modalData.requestId,
//           requestData
//         );

//       // Debug: Log API response
//       console.log("updateEventOrganizationRequest response:", updateResponse);

//       // 3. Clear pending changes
//       setCharactersToAdd([]);
//       setCharactersToRemove([]);

//       setTimeout(() => {
//         window.location.reload();
//       }, 400); // Delay to allow user to see success message

//       toast.success("Request updated successfully!");
//       onOk();
//     } catch (error) {
//       // Debug: Log detailed error information
//       console.error("Error in handleConfirm:", {
//         message: error.message,
//         stack: error.stack,
//         response: error.response,
//       });
//       toast.error(
//         error.message || "Failed to save changes. Check console for details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tính toán danh sách nhân vật hiển thị dựa trên trang hiện tại
//   const paginatedCharacters = availableCharacters.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );
//   // Fetch request data when modal becomes visible to ensure all fields, including range, are populated
//   useEffect(() => {
//     const fetchRequestData = async () => {
//       if (visible && modalData.requestId) {
//         try {
//           setLoading(true);
//           const requestData =
//             await MyEventOrganizeService.getRequestByRequestId(
//               modalData.requestId
//             );
//           console.log("Fetched request data:", requestData); // Debug: Log the API response
//           setModalData((prev) => ({
//             ...prev,
//             name: requestData.name || prev.name,
//             description: requestData.description || prev.description,
//             price: requestData.price || prev.price,
//             startDate: formatDate(requestData.startDate) || prev.startDate,
//             endDate: formatDate(requestData.endDate) || prev.endDate,
//             location: requestData.location || prev.location,
//             serviceId: requestData.serviceId || prev.serviceId,
//             packageId: requestData.packageId || prev.packageId,
//             range: requestData.range || prev.range || "", // Ensure range is set
//             deposit: requestData.deposit || prev.deposit,
//             totalDate: requestData.totalDate || prev.totalDate,
//             reason: requestData.reason || prev.reason,
//             status: requestData.status || prev.status,
//             listCharacters: (requestData.charactersListResponse || []).map(
//               (char) => ({
//                 requestCharacterId: char.requestCharacterId,
//                 characterId: char.characterId,
//                 characterName: char.characterName,
//                 cosplayerId: char.cosplayerId,
//                 quantity: char.quantity || 1,
//                 description: char.description || "shared",
//                 characterImages: char.characterImages || [],
//                 requestDateResponses: char.requestDateResponses || [],
//                 maxHeight: char.maxHeight,
//                 maxWeight: char.maxWeight,
//                 minHeight: char.minHeight,
//                 minWeight: char.minWeight,
//                 status: char.status || "Pending",
//               })
//             ),
//           }));
//         } catch (error) {
//           console.error("Failed to fetch request data:", error);
//           toast.error("Failed to load request data.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchRequestData();
//   }, [visible, modalData.requestId, setModalData]);
//   return (
//     <div>
//       <Modal
//         title={
//           modalData.status === "Pending"
//             ? "Edit Event Request"
//             : "View Event Request  Event Request"
//         }
//         open={visible}
//         onOk={handleConfirm}
//         onCancel={onCancel}
//         okText={modalData.status === "Pending" ? "Save" : "Close"}
//         cancelText="Cancel"
//         cancelButtonProps={{
//           style: {
//             display: modalData.status === "Pending" ? "inline" : "none",
//           },
//         }}
//         width={800}
//       >
//         <Form>
//           <Form.Group className="mb-3">
//             <Form.Label>
//               <strong>Name</strong>
//             </Form.Label>
//             <p>{modalData.name}</p>
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>
//               <strong>Package</strong>
//             </Form.Label>
//             {modalData.status === "Pending" ? (
//               <Form.Select
//                 value={modalData.packageId}
//                 onChange={(e) =>
//                   setModalData({ ...modalData, packageId: e.target.value })
//                 }
//               >
//                 <option value="">Select Package</option>
//                 {packages.map((pkg) => (
//                   <option key={pkg.packageId} value={pkg.packageId}>
//                     {pkg.packageName} - {pkg.price.toLocaleString()} VND
//                   </option>
//                 ))}
//               </Form.Select>
//             ) : (
//               <p>
//                 {packages.find((pkg) => pkg.packageId === modalData.packageId)
//                   ?.packageName || modalData.packageId}
//               </p>
//             )}
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>
//               <strong>Characters </strong>
//               {modalData.status === "Pending" && (
//                 <Button
//                   type="dashed"
//                   className="btn btn-outline-primary sm-2"
//                   onClick={() => setIsCharacterModalVisible(true)}
//                 >
//                   Add Character
//                 </Button>
//               )}
//             </Form.Label>
//             {modalData.status === "Pending" ? (
//               <>
//                 {(modalData.listCharacters || []).map((char, charIndex) => (
//                   <Row key={charIndex} className="mb-2 align-items-center">
//                     <Col md={6}>
//                       <Form.Select
//                         value={char.characterId}
//                         onChange={(e) => {
//                           const selectedChar = characters.find(
//                             (c) => c.characterId === e.target.value
//                           );
//                           const updatedCharacters = [
//                             ...modalData.listCharacters,
//                           ];
//                           updatedCharacters[charIndex] = {
//                             ...updatedCharacters[charIndex],
//                             characterId: e.target.value,
//                             characterName: selectedChar?.characterName || "",
//                           };
//                           setModalData({
//                             ...modalData,
//                             listCharacters: updatedCharacters,
//                           });
//                         }}
//                       >
//                         <option value="">Select Character</option>
//                         {characters.map((c) => (
//                           <option key={c.characterId} value={c.characterId}>
//                             {c.characterName} - {c.price.toLocaleString()} VND -
//                             {c.quantity}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Col>
//                     <Col md={2}>
//                       <InputGroup style={{ width: "60%" }}>
//                         <Form.Control
//                           type="number"
//                           value={char.quantity}
//                           onChange={(e) =>
//                             handleQuantityChange(charIndex, e.target.value)
//                           }
//                           min="1"
//                           style={{ textAlign: "center" }}
//                         />
//                       </InputGroup>
//                     </Col>
//                     <Col md={3}>
//                       <Button
//                         type="dashed"
//                         className="btn btn-outline-danger sm-2"
//                         onClick={() =>
//                           handleRemoveCharacter(
//                             charIndex,
//                             char.requestCharacterId,
//                             char.status
//                           )
//                         }
//                       >
//                         Remove
//                       </Button>
//                     </Col>
//                   </Row>
//                 ))}
//               </>
//             ) : (
//               <p>
//                 {modalData.listCharacters
//                   .map(
//                     (char) => `${char.characterName} (Qty: ${char.quantity})`
//                   )
//                   .join(", ")}
//               </p>
//             )}
//           </Form.Group>
//           <Collapse>
//             <Panel header="Additional Details" key="1">
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <div>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Description</strong>
//                     </Form.Label>
//                     <p>{modalData.description}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Start Date</strong>
//                     </Form.Label>
//                     <p>{modalData.startDate}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>End Date</strong>
//                     </Form.Label>
//                     <p>{modalData.endDate}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Location</strong>
//                     </Form.Label>
//                     <p>{modalData.location}</p>
//                   </Form.Group>
//                 </div>
//                 <div>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Total Price</strong>
//                     </Form.Label>
//                     <p>{(modalData.price || 0).toLocaleString()} VND</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Deposit</strong>
//                     </Form.Label>
//                     <p>{modalData.deposit ? `${modalData.deposit}%` : "N/A"}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Total Date</strong>
//                     </Form.Label>
//                     <p>{modalData.totalDate}</p>
//                   </Form.Group>
//                   {modalData.reason && (
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Reason</strong>
//                       </Form.Label>
//                       <p>{modalData.reason}</p>
//                     </Form.Group>
//                   )}
//                   {/* Add range field display - shows the read-only price range from modalData */}
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Unit Hire Price Range Cosplayer</strong>
//                     </Form.Label>
//                     <p>{modalData.range ? `${modalData.range} VND` : "N/A"}</p>
//                   </Form.Group>
//                 </div>
//               </div>
//               <Collapse>
//                 <Panel header="Character Details" key="2">
//                   {(modalData.listCharacters || []).map((char, charIndex) => (
//                     <Collapse key={charIndex}>
//                       <Panel
//                         header={`Character: ${char.characterName} (Qty: ${char.quantity})`}
//                         key={charIndex}
//                       >
//                         <p>Description: {char.description}</p>
//                         <p>Max Height: {char.maxHeight}</p>
//                         <p>Max Weight: {char.maxWeight}</p>
//                         <p>Min Height: {char.minHeight}</p>
//                         <p>Min Weight: {char.minWeight}</p>
//                         {char.status !== "Pending" && (
//                           <p>Status: {char.status}</p>
//                         )}
//                         <Collapse>
//                           <Panel header="Character Images" key="images">
//                             {char.characterImages.length > 0 ? (
//                               <ul>
//                                 {char.characterImages.map((img, idx) => (
//                                   <li key={idx}>
//                                     <img
//                                       src={img.urlImage}
//                                       style={{
//                                         maxWidth: "100px",
//                                         maxHeight: "100px",
//                                       }}
//                                       alt="Character"
//                                     />
//                                   </li>
//                                 ))}
//                               </ul>
//                             ) : (
//                               <p>No images available.</p>
//                             )}
//                           </Panel>
//                           <Panel header="Request Dates" key="dates">
//                             {char.requestDateResponses.length > 0 ? (
//                               <ul>
//                                 {char.requestDateResponses.map((date, idx) => (
//                                   <li key={idx}>
//                                     Date: {formatDate(date.startDate)} -{" "}
//                                     {formatDate(date.endDate)} (Total Hours:{" "}
//                                     {date.totalHour})
//                                     {date.reason && (
//                                       <>
//                                         <br />
//                                         Reason: {date.reason}
//                                       </>
//                                     )}
//                                     {date.status !== 0 && (
//                                       <>
//                                         <br />
//                                         Status: {date.status}
//                                       </>
//                                     )}
//                                   </li>
//                                 ))}
//                               </ul>
//                             ) : (
//                               <p>No request dates available.</p>
//                             )}
//                           </Panel>
//                         </Collapse>
//                       </Panel>
//                     </Collapse>
//                   ))}
//                 </Panel>
//               </Collapse>
//             </Panel>
//           </Collapse>
//         </Form>
//       </Modal>

//       {/* Modal chọn nhân vật với phân trang */}
//       {/* Character selection modal with pagination */}
//       <Modal
//         title="Select Character"
//         open={isCharacterModalVisible}
//         onCancel={() => setIsCharacterModalVisible(false)}
//         footer={null}
//         width={600}
//       >
//         {loading ? (
//           <div className="text-center">
//             <Spin />
//           </div>
//         ) : (
//           <>
//             <List
//               itemLayout="horizontal"
//               dataSource={paginatedCharacters}
//               renderItem={(character) => (
//                 <List.Item
//                   actions={[
//                     <Button
//                       type="primary"
//                       size="small"
//                       onClick={() => handleAddCharacter(character.characterId)}
//                       disabled={
//                         modalData.listCharacters.some(
//                           (char) => char.characterId === character.characterId
//                         ) || character.quantity <= 0
//                       }
//                     >
//                       Select
//                     </Button>,
//                   ]}
//                 >
//                   <List.Item.Meta
//                     avatar={
//                       character.images && character.images[0]?.urlImage ? (
//                         <Avatar src={character.images[0].urlImage} size={64} />
//                       ) : (
//                         <Avatar size={64}>{character.characterName[0]}</Avatar>
//                       )
//                     }
//                     title={character.characterName}
//                     description={
//                       <>
//                         <span>
//                           Price: {character.price.toLocaleString()} VND/day
//                         </span>{" "}
//                         <br />
//                         <span>
//                           Available Quantity: {character.quantity || "N/A"}{" "}
//                           {character.quantity <= 3 && character.quantity > 0
//                             ? `(Only ${character.quantity} left!)`
//                             : ""}
//                         </span>{" "}
//                         <br />
//                         <span>
//                           Height: {character.minHeight}cm -{" "}
//                           {character.maxHeight}cm
//                         </span>{" "}
//                         <br />
//                         <span>
//                           Weight: {character.minWeight}kg -{" "}
//                           {character.maxWeight}kg
//                         </span>
//                       </>
//                     }
//                   />
//                 </List.Item>
//               )}
//             />
//             <div style={{ textAlign: "center", marginTop: 16 }}>
//               <Pagination
//                 current={currentPage}
//                 pageSize={pageSize}
//                 total={availableCharacters.length}
//                 onChange={(page) => setCurrentPage(page)}
//                 showSizeChanger={false}
//               />
//             </div>
//           </>
//         )}
//       </Modal>
//     </div>
//   );
// };

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

// export default EditEventOrganize;

// hiển thị quantity=========================================

// import React, { useState, useEffect } from "react";
// import { Form, Row, Col, InputGroup } from "react-bootstrap";
// import {
//   Modal,
//   Button,
//   Collapse,
//   Select,
//   message,
//   List,
//   Avatar,
//   Spin,
//   Pagination,
// } from "antd";
// import { toast } from "react-toastify";
// import { useParams } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import "../../styles/MyEventOrganize.scss";
// import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
// import dayjs from "dayjs";

// const { Panel } = Collapse;
// const { Option } = Select;

// const EditEventOrganize = ({
//   visible,
//   onOk,
//   onCancel,
//   modalData,
//   setModalData,
//   packages,
//   characters,
//   requests,
//   setRequests,
// }) => {
//   const [packagePrice, setPackagePrice] = useState(0);
//   const [characterPrices, setCharacterPrices] = useState({});
//   const [isCharacterModalVisible, setIsCharacterModalVisible] = useState(false);
//   const [availableCharacters, setAvailableCharacters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize] = useState(5);
//   const [charactersToAdd, setCharactersToAdd] = useState([]);
//   const [charactersToRemove, setCharactersToRemove] = useState([]);
//   const { id: accountId } = useParams();
//   const [enrichedCharacters, setEnrichedCharacters] = useState([]);

//   useEffect(() => {
//     const fetchCharacterDetails = async () => {
//       if (visible) {
//         try {
//           setLoading(true);
//           // Fetch all characters
//           const allCharacters = await MyEventOrganizeService.getAllCharacters();

//           // Fetch details for all characters using getCharacterById
//           const characterPromises = allCharacters.map(async (char) => {
//             try {
//               const charData = await MyEventOrganizeService.getCharacterById(
//                 char.characterId
//               );
//               return {
//                 characterId: char.characterId,
//                 characterName:
//                   charData.characterName || char.characterName || "Unknown",
//                 price: charData.price || char.price || 0,
//                 quantity: charData.quantity ?? 0, // Fallback to 0 if quantity is missing
//                 images: charData.images || char.images || [],
//                 maxHeight: charData.maxHeight || char.maxHeight,
//                 maxWeight: charData.maxWeight || char.maxWeight,
//                 minHeight: charData.minHeight || char.minHeight,
//                 minWeight: charData.minWeight || char.minWeight,
//               };
//             } catch (error) {
//               console.error(
//                 `Failed to fetch character ${char.characterId}:`,
//                 error
//               );
//               return {
//                 characterId: char.characterId,
//                 characterName: char.characterName || "Unknown",
//                 price: char.price || 0,
//                 quantity: 0, // Fallback for failed fetch
//                 images: char.images || [],
//                 maxHeight: char.maxHeight,
//                 maxWeight: char.maxWeight,
//                 minHeight: char.minHeight,
//                 minWeight: char.minWeight,
//               };
//             }
//           });

//           const detailedCharacters = await Promise.all(characterPromises);
//           // Filter characters with quantity >= 1
//           const filteredCharacters = detailedCharacters.filter(
//             (char) => char.quantity >= 1
//           );
//           console.log("Enriched characters:", filteredCharacters);
//           setEnrichedCharacters(filteredCharacters);
//         } catch (error) {
//           console.error("Failed to fetch character details:", error);
//           toast.error("Failed to load character details.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchCharacterDetails();
//   }, [visible]);
//   // Tính giá tự động khi modalData thay đổi
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
//             return {
//               [char.characterId]: charData.price || 0,
//             };
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
//     if (visible && modalData.status === "Pending") {
//       calculatePrice();
//     }
//   }, [
//     modalData.packageId,
//     modalData.listCharacters,
//     modalData.startDate,
//     modalData.endDate,
//     visible,
//     setModalData,
//   ]);

//   // Lấy danh sách nhân vật khi mở modal chọn nhân vật, lọc bỏ nhân vật đã có trong request
//   // Fetch characters when character modal is opened, excluding those already in request and with quantity < 1
//   useEffect(() => {
//     const fetchCharacters = async () => {
//       if (isCharacterModalVisible) {
//         try {
//           setLoading(true);
//           const requestData =
//             await MyEventOrganizeService.getRequestByRequestId(
//               modalData.requestId
//             );
//           const existingCharacterIds = (
//             requestData.charactersListResponse || []
//           ).map((char) => char.characterId);
//           const allCharacters = await MyEventOrganizeService.getAllCharacters();

//           // Fetch quantity for each character
//           const characterPromises = allCharacters.map(async (char) => {
//             try {
//               const charData = await MyEventOrganizeService.getCharacterById(
//                 char.characterId
//               );
//               return {
//                 ...char,
//                 quantity: charData.quantity ?? 0, // Fallback to 0 if quantity is missing
//               };
//             } catch (error) {
//               console.error(
//                 `Failed to fetch character ${char.characterId}:`,
//                 error
//               );
//               return {
//                 ...char,
//                 quantity: 0, // Fallback for failed fetch
//               };
//             }
//           });

//           const detailedCharacters = await Promise.all(characterPromises);
//           const filteredCharacters = (detailedCharacters || []).filter(
//             (char) =>
//               !existingCharacterIds.includes(char.characterId) &&
//               char.quantity >= 1 // Only include characters with quantity >= 1
//           );
//           setAvailableCharacters(filteredCharacters);
//           setCurrentPage(1);
//         } catch (error) {
//           toast.error("Failed to load characters.");
//           console.error("Error fetching characters:", error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchCharacters();
//   }, [isCharacterModalVisible, modalData.requestId]);

//   // Hàm xử lý thay đổi số lượng
//   // Handle quantity change with validation
//   const handleQuantityChange = (charIndex, newQuantity) => {
//     const parsedQuantity = parseInt(newQuantity, 10);
//     if (isNaN(parsedQuantity) || parsedQuantity < 1) {
//       toast.error("Quantity must be at least 1!");
//       return;
//     }

//     const character = enrichedCharacters.find(
//       (c) => c.characterId === modalData.listCharacters[charIndex].characterId
//     );
//     if (!character) {
//       toast.error("Character not found!");
//       return;
//     }

//     if (parsedQuantity > character.quantity) {
//       toast.warn(
//         `Maximum quantity for ${character.characterName} is ${character.quantity}!`
//       );
//       return;
//     }

//     const updatedCharacters = [...modalData.listCharacters];
//     updatedCharacters[charIndex] = {
//       ...updatedCharacters[charIndex],
//       quantity: parsedQuantity,
//     };
//     setModalData({
//       ...modalData,
//       listCharacters: updatedCharacters,
//     });

//     setCharactersToAdd((prev) =>
//       prev.map((char) =>
//         char.characterId === updatedCharacters[charIndex].characterId
//           ? { ...char, quantity: parsedQuantity }
//           : char
//       )
//     );
//   };

//   // Hàm xử lý thêm nhân vật
//   // Handle adding a character with quantity validation
//   const handleAddCharacter = async (characterId) => {
//     if (!characterId) {
//       toast.error("Please select a character!");
//       return;
//     }

//     const characterData = enrichedCharacters.find(
//       (c) => c.characterId === characterId
//     );
//     if (!characterData) {
//       toast.error("Character not found!");
//       return;
//     }

//     // Calculate total quantity for this character (existing + new)
//     const existingQuantity = modalData.listCharacters
//       .filter((char) => char.characterId === characterId)
//       .reduce((sum, char) => sum + (char.quantity || 1), 0);
//     const newQuantity = 1; // Default quantity for new character
//     const totalQuantity = existingQuantity + newQuantity;

//     if (totalQuantity > characterData.quantity) {
//       toast.warn(
//         `Cannot add ${characterData.characterName}. Total quantity (${totalQuantity}) exceeds available inventory (${characterData.quantity})!`
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const requestData = await MyEventOrganizeService.getRequestByRequestId(
//         modalData.requestId
//       );
//       const requestDateResponses =
//         requestData.charactersListResponse[0]?.requestDateResponses || [];

//       // Prepare data for AddCharacterInReq
//       const addCharacterData = {
//         requestId: modalData.requestId,
//         characterId: characterId,
//         description: "shared",
//         cosplayerId: null,
//         quantity: newQuantity,
//         addRequestDates: requestDateResponses.map((date) => ({
//           startDate: date.startDate,
//           endDate: date.endDate,
//         })),
//       };

//       // Call AddCharacterInReq API
//       const addResponse = await MyEventOrganizeService.AddCharacterInReq(
//         addCharacterData
//       );
//       console.log("AddCharacterInReq response:", addResponse);

//       // Fetch updated request data to get requestCharacterId
//       const updatedRequestData =
//         await MyEventOrganizeService.getRequestByRequestId(modalData.requestId);
//       const updatedCharactersList =
//         updatedRequestData.charactersListResponse || [];

//       // Find the newly added character
//       const newCharacter = updatedCharactersList.find(
//         (char) => char.characterId === characterId
//       );

//       if (!newCharacter) {
//         throw new Error("Newly added character not found in request data.");
//       }

//       // Update modalData.listCharacters with backend data
//       const newCharacterData = {
//         requestCharacterId: newCharacter.requestCharacterId,
//         characterId: newCharacter.characterId,
//         characterName: characterData.characterName,
//         cosplayerId: null,
//         quantity: newQuantity,
//         description: "shared",
//         characterImages: characterData.images || [],
//         requestDateResponses: newCharacter.requestDateResponses || [],
//         maxHeight: characterData.maxHeight,
//         maxWeight: characterData.maxWeight,
//         minHeight: characterData.minHeight,
//         minWeight: characterData.minWeight,
//         status: "Pending",
//       };

//       setCharactersToAdd((prev) => [
//         ...prev,
//         {
//           requestId: modalData.requestId,
//           characterId: characterId,
//           description: "No description",
//           cosplayerId: null,
//           quantity: newQuantity,
//           requestCharacterId: newCharacter.requestCharacterId,
//         },
//       ]);

//       setModalData((prev) => ({
//         ...prev,
//         listCharacters: [...prev.listCharacters, newCharacterData],
//       }));

//       toast.success("Character added successfully!");
//       setIsCharacterModalVisible(false);
//     } catch (error) {
//       toast.error("Failed to add character.");
//       console.error("Error adding character:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm xử lý xóa nhân vật
//   const handleRemoveCharacter = (charIndex, requestCharacterId, status) => {
//     if (modalData.listCharacters.length <= 1) {
//       toast.error(
//         "Cannot remove the last character! At least one character is required."
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       if (requestCharacterId) {
//         setCharactersToRemove((prev) => [...prev, { requestCharacterId }]);
//       }

//       setCharactersToAdd((prev) =>
//         prev.filter((char) => char.requestCharacterId !== requestCharacterId)
//       );

//       setModalData((prev) => ({
//         ...prev,
//         listCharacters: prev.listCharacters.filter(
//           (_, index) => index !== charIndex
//         ),
//       }));

//       toast.success("Character removed from pending changes!");
//     } catch (error) {
//       toast.error("Failed to prepare character for removal.");
//       console.error("Error preparing character removal:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Hàm xử lý xác nhận lưu thay đổi
//   // Handle confirmation of changes with quantity validation
//   const handleConfirm = async () => {
//     if (modalData.status !== "Pending") {
//       onCancel();
//       return;
//     }
//     if (!modalData.packageId) {
//       toast.error("Package is required!");
//       return;
//     }
//     if (modalData.listCharacters.some((char) => !char.characterId)) {
//       toast.error("All characters must have a selected character!");
//       return;
//     }
//     if (
//       modalData.listCharacters.some(
//         (char) => !char.quantity || char.quantity < 1
//       )
//     ) {
//       toast.error("All characters must have a valid quantity (minimum 1)!");
//       return;
//     }

//     // Validate total quantity per character
//     const characterQuantities = {};
//     modalData.listCharacters.forEach((char) => {
//       characterQuantities[char.characterId] =
//         (characterQuantities[char.characterId] || 0) + (char.quantity || 1);
//     });

//     for (const [characterId, totalQuantity] of Object.entries(
//       characterQuantities
//     )) {
//       const character = enrichedCharacters.find(
//         (c) => c.characterId === characterId
//       );
//       if (!character) {
//         toast.error(`Character with ID ${characterId} not found!`);
//         return;
//       }
//       if (totalQuantity > character.quantity) {
//         toast.warn(
//           `Total quantity for ${character.characterName} (${totalQuantity}) exceeds available inventory (${character.quantity})!`
//         );
//         return;
//       }
//     }

//     // Prevent submission if data is still loading
//     if (loading) {
//       toast.error("Please wait, data is still loading.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Debug: Log modalData.range to confirm it's set
//       console.log("modalData.range before sending:", modalData.range);

//       // 1. Call DeleteCharacterInReq for characters in charactersToRemove
//       const deleteCharacterPromises = charactersToRemove.map(async (char) => {
//         try {
//           const response = await MyEventOrganizeService.DeleteCharacterInReq(
//             char.requestCharacterId
//           );
//           console.log(
//             `DeleteCharacterInReq response for ${char.requestCharacterId}:`,
//             response
//           );
//           return response;
//         } catch (error) {
//           console.error(
//             `Failed to delete character ${char.requestCharacterId}:`,
//             error
//           );
//           throw new Error(
//             `Failed to delete character ${char.requestCharacterId}`
//           );
//         }
//       });

//       // Wait for all DeleteCharacterInReq APIs to complete
//       await Promise.all(deleteCharacterPromises);

//       // 2. Call updateEventOrganizationRequest with character list
//       const requestData = {
//         name: modalData.name,
//         description: modalData.description,
//         price: modalData.price,
//         startDate: modalData.startDate,
//         endDate: modalData.endDate,
//         location: modalData.location,
//         serviceId: modalData.serviceId || "S003",
//         packageId: modalData.packageId,
//         range: modalData.range || "",
//         listUpdateRequestCharacters: modalData.listCharacters.map((char) => ({
//           requestCharacterId: char.requestCharacterId,
//           characterId: char.characterId,
//           description: char.description || "shared",
//           quantity: char.quantity || 1,
//           cosplayerId: char.cosplayerId || null,
//         })),
//       };

//       // Debug: Log requestData to confirm range is included
//       console.log(
//         "Sending updateEventOrganizationRequest with data:",
//         requestData
//       );

//       const updateResponse =
//         await MyEventOrganizeService.updateEventOrganizationRequest(
//           modalData.requestId,
//           requestData
//         );

//       // Debug: Log API response
//       console.log("updateEventOrganizationRequest response:", updateResponse);

//       // 3. Clear pending changes
//       setCharactersToAdd([]);
//       setCharactersToRemove([]);

//       setTimeout(() => {
//         window.location.reload();
//       }, 400); // Delay to allow user to see success message

//       toast.success("Request updated successfully!");
//       onOk();
//     } catch (error) {
//       console.error("Error in handleConfirm:", {
//         message: error.message,
//         stack: error.stack,
//         response: error.response,
//       });
//       toast.error(
//         error.message || "Failed to save changes. Check console for details."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tính toán danh sách nhân vật hiển thị dựa trên trang hiện tại
//   const paginatedCharacters = availableCharacters.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );
//   // Fetch request data when modal becomes visible to ensure all fields, including range, are populated
//   useEffect(() => {
//     const fetchRequestData = async () => {
//       if (visible && modalData.requestId) {
//         try {
//           setLoading(true);
//           const requestData =
//             await MyEventOrganizeService.getRequestByRequestId(
//               modalData.requestId
//             );
//           console.log("Fetched request data:", requestData); // Debug: Log the API response
//           setModalData((prev) => ({
//             ...prev,
//             name: requestData.name || prev.name,
//             description: requestData.description || prev.description,
//             price: requestData.price || prev.price,
//             startDate: formatDate(requestData.startDate) || prev.startDate,
//             endDate: formatDate(requestData.endDate) || prev.endDate,
//             location: requestData.location || prev.location,
//             serviceId: requestData.serviceId || prev.serviceId,
//             packageId: requestData.packageId || prev.packageId,
//             range: requestData.range || prev.range || "", // Ensure range is set
//             deposit: requestData.deposit || prev.deposit,
//             totalDate: requestData.totalDate || prev.totalDate,
//             reason: requestData.reason || prev.reason,
//             status: requestData.status || prev.status,
//             listCharacters: (requestData.charactersListResponse || []).map(
//               (char) => ({
//                 requestCharacterId: char.requestCharacterId,
//                 characterId: char.characterId,
//                 characterName: char.characterName,
//                 cosplayerId: char.cosplayerId,
//                 quantity: char.quantity || 1,
//                 description: char.description || "shared",
//                 characterImages: char.characterImages || [],
//                 requestDateResponses: char.requestDateResponses || [],
//                 maxHeight: char.maxHeight,
//                 maxWeight: char.maxWeight,
//                 minHeight: char.minHeight,
//                 minWeight: char.minWeight,
//                 status: char.status || "Pending",
//               })
//             ),
//           }));
//         } catch (error) {
//           console.error("Failed to fetch request data:", error);
//           toast.error("Failed to load request data.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
//     fetchRequestData();
//   }, [visible, modalData.requestId, setModalData]);
//   return (
//     <div>
//       <Modal
//         title={
//           modalData.status === "Pending"
//             ? "Edit Event Request"
//             : "View Event Request  Event Request"
//         }
//         open={visible}
//         onOk={handleConfirm}
//         onCancel={onCancel}
//         okText={modalData.status === "Pending" ? "Save" : "Close"}
//         cancelText="Cancel"
//         cancelButtonProps={{
//           style: {
//             display: modalData.status === "Pending" ? "inline" : "none",
//           },
//         }}
//         width={800}
//       >
//         <Form>
//           <Form.Group className="mb-3">
//             <Form.Label>
//               <strong>Name</strong>
//             </Form.Label>
//             <p>{modalData.name}</p>
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>
//               <strong>Package</strong>
//             </Form.Label>
//             {modalData.status === "Pending" ? (
//               <Form.Select
//                 value={modalData.packageId}
//                 onChange={(e) =>
//                   setModalData({ ...modalData, packageId: e.target.value })
//                 }
//               >
//                 <option value="">Select Package</option>
//                 {packages.map((pkg) => (
//                   <option key={pkg.packageId} value={pkg.packageId}>
//                     {pkg.packageName} - {pkg.price.toLocaleString()} VND
//                   </option>
//                 ))}
//               </Form.Select>
//             ) : (
//               <p>
//                 {packages.find((pkg) => pkg.packageId === modalData.packageId)
//                   ?.packageName || modalData.packageId}
//               </p>
//             )}
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>
//               <strong>Characters </strong>
//               {modalData.status === "Pending" && (
//                 <Button
//                   type="dashed"
//                   className="btn btn-outline-primary sm-2"
//                   onClick={() => setIsCharacterModalVisible(true)}
//                 >
//                   Add Character
//                 </Button>
//               )}
//             </Form.Label>
//             {modalData.status === "Pending" ? (
//               <>
//                 {(modalData.listCharacters || []).map((char, charIndex) => (
//                   <Row key={charIndex} className="mb-2 align-items-center">
//                     <Col md={6}>
//                       <Form.Select
//                         value={char.characterId}
//                         onChange={(e) => {
//                           const selectedChar = enrichedCharacters.find(
//                             (c) => c.characterId === e.target.value
//                           );
//                           const updatedCharacters = [
//                             ...modalData.listCharacters,
//                           ];
//                           updatedCharacters[charIndex] = {
//                             ...updatedCharacters[charIndex],
//                             characterId: e.target.value,
//                             characterName: selectedChar?.characterName || "",
//                           };
//                           setModalData({
//                             ...modalData,
//                             listCharacters: updatedCharacters,
//                           });
//                         }}
//                       >
//                         <option value="">Select Character</option>
//                         {enrichedCharacters.map((c) => (
//                           <option key={c.characterId} value={c.characterId}>
//                             {c.characterName} - {c.price.toLocaleString()} VND -
//                             Available: {c.quantity}
//                           </option>
//                         ))}
//                       </Form.Select>
//                     </Col>
//                     <Col md={2}>
//                       <InputGroup style={{ width: "60%" }}>
//                         <Form.Control
//                           type="number"
//                           value={char.quantity}
//                           onChange={(e) =>
//                             handleQuantityChange(charIndex, e.target.value)
//                           }
//                           min="1"
//                           style={{ textAlign: "center" }}
//                         />
//                       </InputGroup>
//                     </Col>
//                     <Col md={3}>
//                       <Button
//                         type="dashed"
//                         className="btn btn-outline-danger sm-2"
//                         onClick={() =>
//                           handleRemoveCharacter(
//                             charIndex,
//                             char.requestCharacterId,
//                             char.status
//                           )
//                         }
//                       >
//                         Remove
//                       </Button>
//                     </Col>
//                   </Row>
//                 ))}
//               </>
//             ) : (
//               <p>
//                 {modalData.listCharacters
//                   .map(
//                     (char) => `${char.characterName} (Qty: ${char.quantity})`
//                   )
//                   .join(", ")}
//               </p>
//             )}
//           </Form.Group>
//           <Collapse>
//             <Panel header="Additional Details" key="1">
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <div>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Description</strong>
//                     </Form.Label>
//                     <p>{modalData.description}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Start Date</strong>
//                     </Form.Label>
//                     <p>{modalData.startDate}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>End Date</strong>
//                     </Form.Label>
//                     <p>{modalData.endDate}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Location</strong>
//                     </Form.Label>
//                     <p>{modalData.location}</p>
//                   </Form.Group>
//                 </div>
//                 <div>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Total Price</strong>
//                     </Form.Label>
//                     <p>{(modalData.price || 0).toLocaleString()} VND</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Deposit</strong>
//                     </Form.Label>
//                     <p>{modalData.deposit ? `${modalData.deposit}%` : "N/A"}</p>
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Total Date</strong>
//                     </Form.Label>
//                     <p>{modalData.totalDate}</p>
//                   </Form.Group>
//                   {modalData.reason && (
//                     <Form.Group className="mb-3">
//                       <Form.Label>
//                         <strong>Reason</strong>
//                       </Form.Label>
//                       <p>{modalData.reason}</p>
//                     </Form.Group>
//                   )}
//                   {/* Add range field display - shows the read-only price range from modalData */}
//                   <Form.Group className="mb-3">
//                     <Form.Label>
//                       <strong>Unit Hire Price Range Cosplayer</strong>
//                     </Form.Label>
//                     <p>{modalData.range ? `${modalData.range} VND` : "N/A"}</p>
//                   </Form.Group>
//                 </div>
//               </div>
//               <Collapse>
//                 <Panel header="Character Details" key="2">
//                   {(modalData.listCharacters || []).map((char, charIndex) => (
//                     <Collapse key={charIndex}>
//                       <Panel
//                         header={`Character: ${char.characterName} (Qty: ${char.quantity})`}
//                         key={charIndex}
//                       >
//                         <p>Description: {char.description}</p>
//                         <p>Max Height: {char.maxHeight}</p>
//                         <p>Max Weight: {char.maxWeight}</p>
//                         <p>Min Height: {char.minHeight}</p>
//                         <p>Min Weight: {char.minWeight}</p>
//                         {char.status !== "Pending" && (
//                           <p>Status: {char.status}</p>
//                         )}
//                         <Collapse>
//                           <Panel header="Character Images" key="images">
//                             {char.characterImages.length > 0 ? (
//                               <ul>
//                                 {char.characterImages.map((img, idx) => (
//                                   <li key={idx}>
//                                     <img
//                                       src={img.urlImage}
//                                       style={{
//                                         maxWidth: "100px",
//                                         maxHeight: "100px",
//                                       }}
//                                       alt="Character"
//                                     />
//                                   </li>
//                                 ))}
//                               </ul>
//                             ) : (
//                               <p>No images available.</p>
//                             )}
//                           </Panel>
//                           <Panel header="Request Dates" key="dates">
//                             {char.requestDateResponses.length > 0 ? (
//                               <ul>
//                                 {char.requestDateResponses.map((date, idx) => (
//                                   <li key={idx}>
//                                     Date: {formatDate(date.startDate)} -{" "}
//                                     {formatDate(date.endDate)} (Total Hours:{" "}
//                                     {date.totalHour})
//                                     {date.reason && (
//                                       <>
//                                         <br />
//                                         Reason: {date.reason}
//                                       </>
//                                     )}
//                                     {date.status !== 0 && (
//                                       <>
//                                         <br />
//                                         Status: {date.status}
//                                       </>
//                                     )}
//                                   </li>
//                                 ))}
//                               </ul>
//                             ) : (
//                               <p>No request dates available.</p>
//                             )}
//                           </Panel>
//                         </Collapse>
//                       </Panel>
//                     </Collapse>
//                   ))}
//                 </Panel>
//               </Collapse>
//             </Panel>
//           </Collapse>
//         </Form>
//       </Modal>

//       {/* Modal chọn nhân vật với phân trang */}
//       {/* Character selection modal with pagination */}
//       <Modal
//         title="Select Character"
//         open={isCharacterModalVisible}
//         onCancel={() => setIsCharacterModalVisible(false)}
//         footer={null}
//         width={600}
//       >
//         {loading ? (
//           <div className="text-center">
//             <Spin />
//           </div>
//         ) : (
//           <>
//             <List
//               itemLayout="horizontal"
//               dataSource={paginatedCharacters}
//               renderItem={(character) => (
//                 <List.Item
//                   actions={[
//                     <Button
//                       type="primary"
//                       size="small"
//                       onClick={() => handleAddCharacter(character.characterId)}
//                       disabled={
//                         modalData.listCharacters.some(
//                           (char) => char.characterId === character.characterId
//                         ) || character.quantity <= 0
//                       }
//                     >
//                       Select
//                     </Button>,
//                   ]}
//                 >
//                   <List.Item.Meta
//                     avatar={
//                       character.images && character.images[0]?.urlImage ? (
//                         <Avatar src={character.images[0].urlImage} size={64} />
//                       ) : (
//                         <Avatar size={64}>{character.characterName[0]}</Avatar>
//                       )
//                     }
//                     title={character.characterName}
//                     description={
//                       <>
//                         <span>
//                           Price: {character.price.toLocaleString()} VND/day
//                         </span>{" "}
//                         <br />
//                         <span>
//                           Available Quantity: {character.quantity || "N/A"}{" "}
//                           {character.quantity <= 3 && character.quantity > 0
//                             ? `(Only ${character.quantity} left!)`
//                             : ""}
//                         </span>{" "}
//                         <br />
//                         <span>
//                           Height: {character.minHeight}cm -{" "}
//                           {character.maxHeight}cm
//                         </span>{" "}
//                         <br />
//                         <span>
//                           Weight: {character.minWeight}kg -{" "}
//                           {character.maxWeight}kg
//                         </span>
//                       </>
//                     }
//                   />
//                 </List.Item>
//               )}
//             />
//             <div style={{ textAlign: "center", marginTop: 16 }}>
//               <Pagination
//                 current={currentPage}
//                 pageSize={pageSize}
//                 total={availableCharacters.length}
//                 onChange={(page) => setCurrentPage(page)}
//                 showSizeChanger={false}
//               />
//             </div>
//           </>
//         )}
//       </Modal>
//     </div>
//   );
// };

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

// export default EditEventOrganize;

// check before submit
import React, { useState, useEffect } from "react";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import {
  Modal,
  Button,
  Collapse,
  Select,
  message,
  List,
  Avatar,
  Spin,
  Pagination,
} from "antd";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyEventOrganize.scss";
import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
import dayjs from "dayjs";

const { Panel } = Collapse;
const { Option } = Select;

const EditEventOrganize = ({
  visible,
  onOk,
  onCancel,
  modalData,
  setModalData,
  packages,
  characters,
  requests,
  setRequests,
}) => {
  const [packagePrice, setPackagePrice] = useState(0);
  const [characterPrices, setCharacterPrices] = useState({});
  const [isCharacterModalVisible, setIsCharacterModalVisible] = useState(false);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [charactersToAdd, setCharactersToAdd] = useState([]);
  const [charactersToRemove, setCharactersToRemove] = useState([]);
  const { id: accountId } = useParams();
  const [enrichedCharacters, setEnrichedCharacters] = useState([]);

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      if (visible) {
        try {
          setLoading(true);
          // Fetch all characters
          const allCharacters = await MyEventOrganizeService.getAllCharacters();

          // Fetch details for all characters using getCharacterById
          const characterPromises = allCharacters.map(async (char) => {
            try {
              const charData = await MyEventOrganizeService.getCharacterById(
                char.characterId
              );
              return {
                characterId: char.characterId,
                characterName:
                  charData.characterName || char.characterName || "Unknown",
                price: charData.price || char.price || 0,
                quantity: charData.quantity ?? 0, // Fallback to 0 if quantity is missing
                images: charData.images || char.images || [],
                maxHeight: charData.maxHeight || char.maxHeight,
                maxWeight: charData.maxWeight || char.maxWeight,
                minHeight: charData.minHeight || char.minHeight,
                minWeight: charData.minWeight || char.minWeight,
              };
            } catch (error) {
              console.error(
                `Failed to fetch character ${char.characterId}:`,
                error
              );
              return {
                characterId: char.characterId,
                characterName: char.characterName || "Unknown",
                price: char.price || 0,
                quantity: 0, // Fallback for failed fetch
                images: char.images || [],
                maxHeight: char.maxHeight,
                maxWeight: char.maxWeight,
                minHeight: char.minHeight,
                minWeight: char.minWeight,
              };
            }
          });

          const detailedCharacters = await Promise.all(characterPromises);
          // Filter characters with quantity >= 1
          const filteredCharacters = detailedCharacters.filter(
            (char) => char.quantity >= 1
          );
          console.log("Enriched characters:", filteredCharacters);
          setEnrichedCharacters(filteredCharacters);
        } catch (error) {
          console.error("Failed to fetch character details:", error);
          toast.error("Failed to load character details.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCharacterDetails();
  }, [visible]);
  // Tính giá tự động khi modalData thay đổi
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
            return {
              [char.characterId]: charData.price || 0,
            };
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
    if (visible && modalData.status === "Pending") {
      calculatePrice();
    }
  }, [
    modalData.packageId,
    modalData.listCharacters,
    modalData.startDate,
    modalData.endDate,
    visible,
    setModalData,
  ]);

  // Lấy danh sách nhân vật khi mở modal chọn nhân vật, lọc bỏ nhân vật đã có trong request
  // Fetch characters when character modal is opened, excluding those already in request and with quantity < 1
  useEffect(() => {
    const fetchCharacters = async () => {
      if (isCharacterModalVisible) {
        try {
          setLoading(true);
          const requestData =
            await MyEventOrganizeService.getRequestByRequestId(
              modalData.requestId
            );
          const existingCharacterIds = (
            requestData.charactersListResponse || []
          ).map((char) => char.characterId);
          const allCharacters = await MyEventOrganizeService.getAllCharacters();

          // Fetch quantity for each character
          const characterPromises = allCharacters.map(async (char) => {
            try {
              const charData = await MyEventOrganizeService.getCharacterById(
                char.characterId
              );
              return {
                ...char,
                quantity: charData.quantity ?? 0, // Fallback to 0 if quantity is missing
              };
            } catch (error) {
              console.error(
                `Failed to fetch character ${char.characterId}:`,
                error
              );
              return {
                ...char,
                quantity: 0, // Fallback for failed fetch
              };
            }
          });

          const detailedCharacters = await Promise.all(characterPromises);
          const filteredCharacters = (detailedCharacters || []).filter(
            (char) =>
              !existingCharacterIds.includes(char.characterId) &&
              char.quantity >= 1 // Only include characters with quantity >= 1
          );
          setAvailableCharacters(filteredCharacters);
          setCurrentPage(1);
        } catch (error) {
          toast.error("Failed to load characters.");
          console.error("Error fetching characters:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCharacters();
  }, [isCharacterModalVisible, modalData.requestId]);

  // Hàm xử lý thay đổi số lượng
  // Handle quantity change with validation
  const handleQuantityChange = (charIndex, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      toast.error("Quantity must be at least 1!");
      return;
    }

    const character = enrichedCharacters.find(
      (c) => c.characterId === modalData.listCharacters[charIndex].characterId
    );
    if (!character) {
      toast.error("Character not found!");
      return;
    }

    if (parsedQuantity > character.quantity) {
      toast.warn(
        `Maximum quantity for ${character.characterName} is ${character.quantity}!`
      );
      return;
    }

    const updatedCharacters = [...modalData.listCharacters];
    updatedCharacters[charIndex] = {
      ...updatedCharacters[charIndex],
      quantity: parsedQuantity,
    };
    setModalData({
      ...modalData,
      listCharacters: updatedCharacters,
    });

    setCharactersToAdd((prev) =>
      prev.map((char) =>
        char.characterId === updatedCharacters[charIndex].characterId
          ? { ...char, quantity: parsedQuantity }
          : char
      )
    );
  };

  // Hàm xử lý thêm nhân vật
  // Handle adding a character with quantity validation
  const handleAddCharacter = async (characterId) => {
    if (!characterId) {
      toast.error("Please select a character!");
      return;
    }

    const characterData = enrichedCharacters.find(
      (c) => c.characterId === characterId
    );
    if (!characterData) {
      toast.error("Character not found!");
      return;
    }

    // Calculate total quantity for this character (existing + new)
    const existingQuantity = modalData.listCharacters
      .filter((char) => char.characterId === characterId)
      .reduce((sum, char) => sum + (char.quantity || 1), 0);
    const newQuantity = 1; // Default quantity for new character
    const totalQuantity = existingQuantity + newQuantity;

    if (totalQuantity > characterData.quantity) {
      toast.warn(
        `Cannot add ${characterData.characterName}. Total quantity (${totalQuantity}) exceeds available inventory (${characterData.quantity})!`
      );
      return;
    }

    setLoading(true);
    try {
      const requestData = await MyEventOrganizeService.getRequestByRequestId(
        modalData.requestId
      );
      const requestDateResponses =
        requestData.charactersListResponse[0]?.requestDateResponses || [];

      // Prepare data for AddCharacterInReq
      const addCharacterData = {
        requestId: modalData.requestId,
        characterId: characterId,
        description: "shared",
        cosplayerId: null,
        quantity: newQuantity,
        addRequestDates: requestDateResponses.map((date) => ({
          startDate: date.startDate,
          endDate: date.endDate,
        })),
      };

      // Call AddCharacterInReq API
      const addResponse = await MyEventOrganizeService.AddCharacterInReq(
        addCharacterData
      );
      console.log("AddCharacterInReq response:", addResponse);

      // Fetch updated request data to get requestCharacterId
      const updatedRequestData =
        await MyEventOrganizeService.getRequestByRequestId(modalData.requestId);
      const updatedCharactersList =
        updatedRequestData.charactersListResponse || [];

      // Find the newly added character
      const newCharacter = updatedCharactersList.find(
        (char) => char.characterId === characterId
      );

      if (!newCharacter) {
        throw new Error("Newly added character not found in request data.");
      }

      // Update modalData.listCharacters with backend data
      const newCharacterData = {
        requestCharacterId: newCharacter.requestCharacterId,
        characterId: newCharacter.characterId,
        characterName: characterData.characterName,
        cosplayerId: null,
        quantity: newQuantity,
        description: "shared",
        characterImages: characterData.images || [],
        requestDateResponses: newCharacter.requestDateResponses || [],
        maxHeight: characterData.maxHeight,
        maxWeight: characterData.maxWeight,
        minHeight: characterData.minHeight,
        minWeight: characterData.minWeight,
        status: "Pending",
      };

      setCharactersToAdd((prev) => [
        ...prev,
        {
          requestId: modalData.requestId,
          characterId: characterId,
          description: "No description",
          cosplayerId: null,
          quantity: newQuantity,
          requestCharacterId: newCharacter.requestCharacterId,
        },
      ]);

      setModalData((prev) => ({
        ...prev,
        listCharacters: [...prev.listCharacters, newCharacterData],
      }));

      toast.success("Character added successfully!");
      setIsCharacterModalVisible(false);
    } catch (error) {
      toast.error("Failed to add character.");
      console.error("Error adding character:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xóa nhân vật
  const handleRemoveCharacter = (charIndex, requestCharacterId, status) => {
    if (modalData.listCharacters.length <= 1) {
      toast.error(
        "Cannot remove the last character! At least one character is required."
      );
      return;
    }

    setLoading(true);
    try {
      if (requestCharacterId) {
        setCharactersToRemove((prev) => [...prev, { requestCharacterId }]);
      }

      setCharactersToAdd((prev) =>
        prev.filter((char) => char.requestCharacterId !== requestCharacterId)
      );

      setModalData((prev) => ({
        ...prev,
        listCharacters: prev.listCharacters.filter(
          (_, index) => index !== charIndex
        ),
      }));

      toast.success("Character removed from pending changes!");
    } catch (error) {
      toast.error("Failed to prepare character for removal.");
      console.error("Error preparing character removal:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý xác nhận lưu thay đổi
  // Handle confirmation of changes with quantity validation
  const handleConfirm = async () => {
    if (modalData.status !== "Pending") {
      onCancel();
      return;
    }
    if (!modalData.packageId) {
      toast.error("Package is required!");
      return;
    }
    if (modalData.listCharacters.some((char) => !char.characterId)) {
      toast.error("All characters must have a selected character!");
      return;
    }
    if (
      modalData.listCharacters.some(
        (char) => !char.quantity || char.quantity < 1
      )
    ) {
      toast.error("All characters must have a valid quantity (minimum 1)!");
      return;
    }

    const characterQuantities = {};
    modalData.listCharacters.forEach((char) => {
      characterQuantities[char.characterId] =
        (characterQuantities[char.characterId] || 0) + (char.quantity || 1);
    });

    for (const [characterId, totalQuantity] of Object.entries(
      characterQuantities
    )) {
      const character = enrichedCharacters.find(
        (c) => c.characterId === characterId
      );
      if (!character) {
        toast.error(`Character with ID ${characterId} not found!`);
        return;
      }
      if (totalQuantity > character.quantity) {
        toast.warn(
          `Total quantity for ${character.characterName} (${totalQuantity}) exceeds available inventory (${character.quantity})!`
        );
        return;
      }
    }

    if (loading) {
      toast.error("Please wait, data is still loading.");
      return;
    }

    setLoading(true);
    try {
      const requestData = await MyEventOrganizeService.getRequestByRequestId(
        modalData.requestId
      );
      if (!requestData) {
        throw new Error("Failed to fetch request data.");
      }

      if (requestData.status === "Browsed") {
        toast.warn(
          "Your Status request has been change, please reload this page"
        );
        setLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 2500);
        return;
      }

      const deleteCharacterPromises = charactersToRemove.map(async (char) => {
        try {
          const response = await MyEventOrganizeService.DeleteCharacterInReq(
            char.requestCharacterId
          );
          console.log(
            `DeleteCharacterInReq response for ${char.requestCharacterId}:`,
            response
          );
          return response;
        } catch (error) {
          console.error(
            `Failed to delete character ${char.requestCharacterId}:`,
            error
          );
          throw new Error(
            `Failed to delete character ${char.requestCharacterId}`
          );
        }
      });

      await Promise.all(deleteCharacterPromises);

      const requestDataPayload = {
        name: modalData.name,
        description: modalData.description,
        price: modalData.price,
        startDate: modalData.startDate,
        endDate: modalData.endDate,
        location: modalData.location,
        serviceId: modalData.serviceId || "S003",
        packageId: modalData.packageId,
        range: modalData.range || "",
        listUpdateRequestCharacters: modalData.listCharacters.map((char) => ({
          requestCharacterId: char.requestCharacterId,
          characterId: char.characterId,
          description: char.description || "shared",
          quantity: char.quantity || 1,
          cosplayerId: char.cosplayerId || null,
        })),
      };

      console.log(
        "Sending updateEventOrganizationRequest with data:",
        requestDataPayload
      );

      const updateResponse =
        await MyEventOrganizeService.updateEventOrganizationRequest(
          modalData.requestId,
          requestDataPayload
        );

      console.log("updateEventOrganizationRequest response:", updateResponse);

      setCharactersToAdd([]);
      setCharactersToRemove([]);

      setTimeout(() => {
        window.location.reload();
      }, 400);

      toast.success("Request updated successfully!");
      onOk();
    } catch (error) {
      console.error("Error in handleConfirm:", {
        message: error.message,
        stack: error.stack,
        response: error.response,
      });
      toast.error(
        error.message || "Failed to save changes. Check console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Tính toán danh sách nhân vật hiển thị dựa trên trang hiện tại
  const paginatedCharacters = availableCharacters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  // Fetch request data when modal becomes visible to ensure all fields, including range, are populated
  useEffect(() => {
    const fetchRequestData = async () => {
      if (visible && modalData.requestId) {
        try {
          setLoading(true);
          const requestData =
            await MyEventOrganizeService.getRequestByRequestId(
              modalData.requestId
            );
          console.log("Fetched request data:", requestData); // Debug: Log the API response
          setModalData((prev) => ({
            ...prev,
            name: requestData.name || prev.name,
            description: requestData.description || prev.description,
            price: requestData.price || prev.price,
            startDate: formatDate(requestData.startDate) || prev.startDate,
            endDate: formatDate(requestData.endDate) || prev.endDate,
            location: requestData.location || prev.location,
            serviceId: requestData.serviceId || prev.serviceId,
            packageId: requestData.packageId || prev.packageId,
            range: requestData.range || prev.range || "", // Ensure range is set
            deposit: requestData.deposit || prev.deposit,
            totalDate: requestData.totalDate || prev.totalDate,
            reason: requestData.reason || prev.reason,
            status: requestData.status || prev.status,
            listCharacters: (requestData.charactersListResponse || []).map(
              (char) => ({
                requestCharacterId: char.requestCharacterId,
                characterId: char.characterId,
                characterName: char.characterName,
                cosplayerId: char.cosplayerId,
                quantity: char.quantity || 1,
                description: char.description || "shared",
                characterImages: char.characterImages || [],
                requestDateResponses: char.requestDateResponses || [],
                maxHeight: char.maxHeight,
                maxWeight: char.maxWeight,
                minHeight: char.minHeight,
                minWeight: char.minWeight,
                status: char.status || "Pending",
              })
            ),
          }));
        } catch (error) {
          console.error("Failed to fetch request data:", error);
          toast.error("Failed to load request data.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRequestData();
  }, [visible, modalData.requestId, setModalData]);
  return (
    <div>
      <Modal
        title={
          modalData.status === "Pending"
            ? "Edit Event Request"
            : "View Event Request  Event Request"
        }
        open={visible}
        onOk={handleConfirm}
        onCancel={onCancel}
        okText={modalData.status === "Pending" ? "Save" : "Close"}
        cancelText="Cancel"
        cancelButtonProps={{
          style: {
            display: modalData.status === "Pending" ? "inline" : "none",
          },
        }}
        width={800}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Name</strong>
            </Form.Label>
            <p>{modalData.name}</p>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Package</strong>
            </Form.Label>
            {modalData.status === "Pending" ? (
              <Form.Select
                value={modalData.packageId}
                onChange={(e) =>
                  setModalData({ ...modalData, packageId: e.target.value })
                }
              >
                <option value="">Select Package</option>
                {packages.map((pkg) => (
                  <option key={pkg.packageId} value={pkg.packageId}>
                    {pkg.packageName} - {pkg.price.toLocaleString()} VND
                  </option>
                ))}
              </Form.Select>
            ) : (
              <p>
                {packages.find((pkg) => pkg.packageId === modalData.packageId)
                  ?.packageName || modalData.packageId}
              </p>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Characters </strong>
              {modalData.status === "Pending" && (
                <Button
                  type="dashed"
                  className="btn btn-outline-primary sm-2"
                  onClick={() => setIsCharacterModalVisible(true)}
                >
                  Add Character
                </Button>
              )}
            </Form.Label>
            {modalData.status === "Pending" ? (
              <>
                {(modalData.listCharacters || []).map((char, charIndex) => (
                  <Row key={charIndex} className="mb-2 align-items-center">
                    <Col md={6}>
                      <Form.Select
                        value={char.characterId}
                        onChange={(e) => {
                          const selectedChar = enrichedCharacters.find(
                            (c) => c.characterId === e.target.value
                          );
                          const updatedCharacters = [
                            ...modalData.listCharacters,
                          ];
                          updatedCharacters[charIndex] = {
                            ...updatedCharacters[charIndex],
                            characterId: e.target.value,
                            characterName: selectedChar?.characterName || "",
                          };
                          setModalData({
                            ...modalData,
                            listCharacters: updatedCharacters,
                          });
                        }}
                      >
                        <option value="">Select Character</option>
                        {enrichedCharacters.map((c) => (
                          <option key={c.characterId} value={c.characterId}>
                            {c.characterName} - {c.price.toLocaleString()} VND -
                            Available: {c.quantity}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <InputGroup style={{ width: "60%" }}>
                        <Form.Control
                          type="number"
                          value={char.quantity}
                          onChange={(e) =>
                            handleQuantityChange(charIndex, e.target.value)
                          }
                          min="1"
                          style={{ textAlign: "center" }}
                        />
                      </InputGroup>
                    </Col>
                    <Col md={3}>
                      <Button
                        type="dashed"
                        className="btn btn-outline-danger sm-2"
                        onClick={() =>
                          handleRemoveCharacter(
                            charIndex,
                            char.requestCharacterId,
                            char.status
                          )
                        }
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
              </>
            ) : (
              <p>
                {modalData.listCharacters
                  .map(
                    (char) => `${char.characterName} (Qty: ${char.quantity})`
                  )
                  .join(", ")}
              </p>
            )}
          </Form.Group>
          <Collapse>
            <Panel header="Additional Details" key="1">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Description</strong>
                    </Form.Label>
                    <p>{modalData.description}</p>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Start Date</strong>
                    </Form.Label>
                    <p>{modalData.startDate}</p>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>End Date</strong>
                    </Form.Label>
                    <p>{modalData.endDate}</p>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Location</strong>
                    </Form.Label>
                    <p>{modalData.location}</p>
                  </Form.Group>
                </div>
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Total Price</strong>
                    </Form.Label>
                    <p>{(modalData.price || 0).toLocaleString()} VND</p>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Deposit</strong>
                    </Form.Label>
                    <p>
                      {modalData.deposit ? `${modalData.deposit}%` : "Not Yet"}
                    </p>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Total Date</strong>
                    </Form.Label>
                    <p>{modalData.totalDate}</p>
                  </Form.Group>
                  {modalData.reason && (
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <strong>Reason</strong>
                      </Form.Label>
                      <p>{modalData.reason}</p>
                    </Form.Group>
                  )}
                  {/* Add range field display - shows the read-only price range from modalData */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <strong>Unit Hire Price Range Cosplayer</strong>
                    </Form.Label>
                    <p>{modalData.range ? `${modalData.range} VND` : "N/A"}</p>
                  </Form.Group>
                </div>
              </div>
              <Collapse>
                <Panel header="Character Details" key="2">
                  {(modalData.listCharacters || []).map((char, charIndex) => (
                    <Collapse key={charIndex}>
                      <Panel
                        header={`Character: ${char.characterName} (Qty: ${char.quantity})`}
                        key={charIndex}
                      >
                        <p>Description: {char.description}</p>
                        <p>Max Height: {char.maxHeight}</p>
                        <p>Max Weight: {char.maxWeight}</p>
                        <p>Min Height: {char.minHeight}</p>
                        <p>Min Weight: {char.minWeight}</p>
                        {char.status !== "Pending" && (
                          <p>Status: {char.status}</p>
                        )}
                        <Collapse>
                          <Panel header="Character Images" key="images">
                            {char.characterImages.length > 0 ? (
                              <ul>
                                {char.characterImages.map((img, idx) => (
                                  <li key={idx}>
                                    <img
                                      src={img.urlImage}
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                      }}
                                      alt="Character"
                                    />
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No images available.</p>
                            )}
                          </Panel>
                          <Panel header="Request Dates" key="dates">
                            {char.requestDateResponses.length > 0 ? (
                              <ul>
                                {char.requestDateResponses.map((date, idx) => (
                                  <li key={idx}>
                                    Date: {formatDate(date.startDate)} -{" "}
                                    {formatDate(date.endDate)} (Total Hours:{" "}
                                    {date.totalHour})
                                    {date.reason && (
                                      <>
                                        <br />
                                        Reason: {date.reason}
                                      </>
                                    )}
                                    {date.status !== 0 && (
                                      <>
                                        <br />
                                        Status: {date.status}
                                      </>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>No request dates available.</p>
                            )}
                          </Panel>
                        </Collapse>
                      </Panel>
                    </Collapse>
                  ))}
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>
        </Form>
      </Modal>

      {/* Modal chọn nhân vật với phân trang */}
      {/* Character selection modal with pagination */}
      <Modal
        title="Select Character"
        open={isCharacterModalVisible}
        onCancel={() => setIsCharacterModalVisible(false)}
        footer={null}
        width={600}
      >
        {loading ? (
          <div className="text-center">
            <Spin />
          </div>
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={paginatedCharacters}
              renderItem={(character) => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleAddCharacter(character.characterId)}
                      disabled={
                        modalData.listCharacters.some(
                          (char) => char.characterId === character.characterId
                        ) || character.quantity <= 0
                      }
                    >
                      Select
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      character.images && character.images[0]?.urlImage ? (
                        <Avatar src={character.images[0].urlImage} size={64} />
                      ) : (
                        <Avatar size={64}>{character.characterName[0]}</Avatar>
                      )
                    }
                    title={character.characterName}
                    description={
                      <>
                        <span>
                          Price: {character.price.toLocaleString()} VND/day
                        </span>{" "}
                        <br />
                        <span>
                          Available Quantity: {character.quantity || "N/A"}{" "}
                          {character.quantity <= 3 && character.quantity > 0
                            ? `(Only ${character.quantity} left!)`
                            : ""}
                        </span>{" "}
                        <br />
                        <span>
                          Height: {character.minHeight}cm -{" "}
                          {character.maxHeight}cm
                        </span>{" "}
                        <br />
                        <span>
                          Weight: {character.minWeight}kg -{" "}
                          {character.maxWeight}kg
                        </span>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={availableCharacters.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

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

export default EditEventOrganize;
