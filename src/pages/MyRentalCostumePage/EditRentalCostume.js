// import React, { useState, useEffect } from "react";
// import { Form, Card, Row, Col } from "react-bootstrap";
// import {
//   Modal,
//   Input,
//   DatePicker,
//   Pagination,
//   Image,
//   Select,
//   Spin,
// } from "antd";
// import { toast } from "react-toastify";
// import dayjs from "dayjs";
// import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";

// const { TextArea } = Input;
// const { Option } = Select;

// const EditRentalCostume = ({
//   visible,
//   onCancel,
//   onSubmit,
//   modalData,
//   setModalData,
//   selectedRequestId,
//   currentCharacterPage,
//   setCurrentCharacterPage,
//   charactersPerPage = 2,
// }) => {
//   const [allCharacters, setAllCharacters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [characterLoading, setCharacterLoading] = useState({});
//   const [deposit, setDeposit] = useState(0); // Thêm state cho deposit

//   // Tính deposit dựa trên danh sách characters
//   const calculateDeposit = (characters) => {
//     return characters.reduce((sum, char) => {
//       const characterPrice = char.price || 0;
//       return sum + characterPrice * (char.quantity || 0) * 5;
//     }, 0);
//   };

//   // Gọi API chooseDeposit
//   const updateDeposit = async (requestId, depositValue) => {
//     try {
//       const payload = { deposit: depositValue.toString() };
//       const response = await MyRentalCostumeService.chooseDeposit(
//         requestId,
//         payload
//       );
//       return response;
//     } catch (error) {
//       toast.error(
//         "Failed to update deposit: " + (error.message || "Unknown error")
//       );
//       throw error;
//     }
//   };

//   // Lấy danh sách characters và chi tiết request khi modal mở
//   useEffect(() => {
//     if (visible && selectedRequestId) {
//       const fetchData = async () => {
//         setLoading(true);
//         try {
//           const allCharactersData =
//             await MyRentalCostumeService.getAllCharacters();
//           setAllCharacters(allCharactersData);

//           const requestData =
//             await MyRentalCostumeService.getRequestByRequestId(
//               selectedRequestId
//             );
//           const charactersList = requestData.charactersListResponse || [];

//           const characterDetailsPromises = charactersList.map(async (char) => {
//             try {
//               const characterDetails =
//                 await MyRentalCostumeService.getCharacterById(char.characterId);
//               return {
//                 requestCharacterId: char.requestCharacterId || "",
//                 characterId: String(char.characterId || ""),
//                 characterName:
//                   characterDetails.characterName ||
//                   char.characterName ||
//                   "Unknown",
//                 description:
//                   char.description || characterDetails.description || "",
//                 quantity: char.quantity || 1,
//                 maxQuantity: characterDetails.quantity || char.quantity || 1,
//                 price: characterDetails.price || 0,
//                 maxHeight: characterDetails.maxHeight || char.maxHeight || 0,
//                 maxWeight: characterDetails.maxWeight || char.maxWeight || 0,
//                 minHeight: characterDetails.minHeight || char.minHeight || 0,
//                 minWeight: characterDetails.minWeight || char.minWeight || 0,
//                 urlImage:
//                   characterDetails.images?.[0]?.urlImage ||
//                   char.characterImages?.[0]?.urlImage ||
//                   "",
//               };
//             } catch (error) {
//               toast.error(
//                 `Failed to fetch details for character ${char.characterName}: ${error.message}`
//               );
//               return {
//                 requestCharacterId: char.requestCharacterId || "",
//                 characterId: String(char.characterId || ""),
//                 characterName: char.characterName || "Unknown",
//                 description: char.description || "",
//                 quantity: char.quantity || 1,
//                 maxQuantity: char.quantity || 1,
//                 price: 0,
//                 maxHeight: char.maxHeight || 0,
//                 maxWeight: char.maxWeight || 0,
//                 minHeight: char.minHeight || 0,
//                 minWeight: char.minWeight || 0,
//                 urlImage: char.characterImages?.[0]?.urlImage || "",
//               };
//             }
//           });

//           const characterDetails = await Promise.all(characterDetailsPromises);

//           // Tính deposit ban đầu
//           const initialDeposit = calculateDeposit(characterDetails);

//           setModalData({
//             name: requestData.name || "Unnamed Request",
//             description: requestData.description || "",
//             location: requestData.location || "",
//             startDate: requestData.startDate
//               ? dayjs(requestData.startDate, [
//                   "HH:mm DD/MM/YYYY",
//                   "DD/MM/YYYY",
//                   "YYYY-MM-DD",
//                 ])
//               : null,
//             endDate: requestData.endDate
//               ? dayjs(requestData.endDate, [
//                   "HH:mm DD/MM/YYYY",
//                   "DD/MM/YYYY",
//                   "YYYY-MM-DD",
//                 ])
//               : null,
//             characters: characterDetails,
//             fullRequestData: requestData,
//           });

//           setDeposit(initialDeposit);
//         } catch (error) {
//           toast.error(
//             "Failed to fetch data: " + (error.message || "Unknown error")
//           );
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchData();
//     }
//   }, [visible, selectedRequestId, setModalData]);

//   const handleCharacterChange = async (requestCharacterId, field, value) => {
//     if (field === "characterId") {
//       const isDuplicate = modalData.characters.some(
//         (char) =>
//           char.characterId === value &&
//           char.requestCharacterId !== requestCharacterId
//       );
//       if (isDuplicate) {
//         toast.error("This character is already selected!");
//         return;
//       }

//       setCharacterLoading((prev) => ({ ...prev, [requestCharacterId]: true }));

//       try {
//         const characterDetails = await MyRentalCostumeService.getCharacterById(
//           value
//         );

//         setModalData((prev) => {
//           const updatedCharacters = prev.characters.map((char) =>
//             char.requestCharacterId === requestCharacterId
//               ? {
//                   ...char,
//                   characterId: String(value),
//                   characterName: characterDetails.characterName || "Unknown",
//                   description:
//                     char.description || characterDetails.description || "",
//                   price: characterDetails.price || 0,
//                   maxQuantity: characterDetails.quantity || 1,
//                   maxHeight: characterDetails.maxHeight || 0,
//                   maxWeight: characterDetails.maxWeight || 0,
//                   minHeight: characterDetails.minHeight || 0,
//                   minWeight: characterDetails.minWeight || 0,
//                   urlImage: characterDetails.images?.[0]?.urlImage || "",
//                 }
//               : char
//           );

//           // Tính lại deposit sau khi thay đổi character
//           const newDeposit = calculateDeposit(updatedCharacters);
//           setDeposit(newDeposit);

//           // Gọi API chooseDeposit
//           updateDeposit(selectedRequestId, newDeposit);

//           return { ...prev, characters: updatedCharacters };
//         });
//       } catch (error) {
//         toast.error(`Failed to fetch character details: ${error.message}`);
//       } finally {
//         setCharacterLoading((prev) => ({
//           ...prev,
//           [requestCharacterId]: false,
//         }));
//       }
//     } else {
//       setModalData((prev) => {
//         const updatedCharacters = prev.characters.map((char) =>
//           char.requestCharacterId === requestCharacterId
//             ? {
//                 ...char,
//                 [field]:
//                   field === "quantity"
//                     ? Math.min(
//                         Number(value) > 0 ? Number(value) : 0,
//                         char.maxQuantity || Number.MAX_SAFE_INTEGER
//                       )
//                     : value,
//               }
//             : char
//         );

//         // Tính lại deposit sau khi thay đổi quantity
//         const newDeposit = calculateDeposit(updatedCharacters);
//         setDeposit(newDeposit);

//         // Gọi API chooseDeposit
//         updateDeposit(selectedRequestId, newDeposit);

//         return { ...prev, characters: updatedCharacters };
//       });
//     }
//   };

//   const handleDateChange = (field, date) => {
//     setModalData((prev) => ({
//       ...prev,
//       [field]: date,
//     }));
//   };

//   const handleLocationChange = (e) => {
//     setModalData((prev) => ({
//       ...prev,
//       location: e.target.value,
//     }));
//   };

//   const calculateTotalPrice = () => {
//     const totalDays =
//       modalData.endDate && modalData.startDate
//         ? modalData.endDate.diff(modalData.startDate, "day") + 1
//         : 1;
//     return modalData.characters.reduce((sum, char) => {
//       const characterPrice = char.price || 0;
//       return sum + characterPrice * char.quantity * totalDays;
//     }, 0);
//   };

//   const calculateCharacterPrice = (char) => {
//     const totalDays =
//       modalData.endDate && modalData.startDate
//         ? modalData.endDate.diff(modalData.startDate, "day") + 1
//         : 1;
//     const characterPrice = char.price || 0;
//     return characterPrice * char.quantity * totalDays;
//   };

//   const handleSubmit = async () => {
//     const { characters, startDate, endDate, description, location } = modalData;

//     if (!startDate || !endDate) {
//       toast.error("Start Date and End Date are required!");
//       return;
//     }
//     if (endDate.isBefore(startDate)) {
//       toast.error("End Date must be on or after Start Date!");
//       return;
//     }
//     if (endDate.diff(startDate, "day") > 5) {
//       toast.error("The rental period cannot exceed 5 days!");
//       return;
//     }
//     if (!location) {
//       toast.error("Location is required!");
//       return;
//     }
//     if (characters.length === 0) {
//       toast.error("At least one character is required!");
//       return;
//     }
//     for (const char of characters) {
//       if (!char.characterId || typeof char.characterId !== "string") {
//         toast.error(`Invalid character ID for ${char.characterName}!`);
//         return;
//       }
//       if (char.quantity <= 0) {
//         toast.error(`Quantity for ${char.characterName} must be positive!`);
//         return;
//       }
//       if (char.quantity > (char.maxQuantity || Number.MAX_SAFE_INTEGER)) {
//         toast.error(
//           `Quantity for ${char.characterName} exceeds available stock (${char.maxQuantity})!`
//         );
//         return;
//       }
//     }

//     try {
//       const formattedStartDate = startDate.format("DD/MM/YYYY");
//       const formattedEndDate = endDate.format("DD/MM/YYYY");

//       if (
//         formattedStartDate === "Invalid Date" ||
//         formattedEndDate === "Invalid Date"
//       ) {
//         toast.error("Invalid date format!");
//         return;
//       }

//       const totalDays = endDate.diff(startDate, "day") + 1;
//       const totalPrice = characters.reduce((sum, char) => {
//         const characterPrice = char.price || 0;
//         return sum + characterPrice * char.quantity * totalDays;
//       }, 0);

//       const updatedData = {
//         name: modalData.fullRequestData.name || "Unnamed Request",
//         description: description || "",
//         price: totalPrice,
//         startDate: formattedStartDate,
//         endDate: formattedEndDate,
//         location: location || modalData.fullRequestData.location || "",
//         serviceId: modalData.fullRequestData.serviceId || "S001",
//         packageId: null,
//         listUpdateRequestCharacters: characters.map((char) => ({
//           requestCharacterId: char.requestCharacterId || "",
//           characterId: String(char.characterId),
//           cosplayerId: null,
//           description: char.description || "",
//           quantity: char.quantity,
//         })),
//       };

//       console.log("Payload sent to API:", JSON.stringify(updatedData, null, 2));

//       const response = await MyRentalCostumeService.editRequest(
//         selectedRequestId,
//         updatedData
//       );

//       // Truyền deposit cùng response
//       onSubmit(
//         response,
//         totalPrice,
//         formattedStartDate,
//         formattedEndDate,
//         deposit
//       );
//       toast.success("Costumes updated successfully!");
//       onCancel();
//     } catch (error) {
//       console.error("Error updating request:", error);
//       toast.error(
//         error.response?.data?.title ||
//           error.response?.data?.message ||
//           "Failed to update costumes. Please try again."
//       );
//     }
//   };

//   return (
//     <Modal
//       title="Edit Costume Request"
//       open={visible}
//       onOk={handleSubmit}
//       onCancel={onCancel}
//       okText="Submit"
//       width={800}
//       confirmLoading={loading}
//     >
//       <Form>
//         <Form.Group className="mb-3">
//           <Form.Label>Name</Form.Label>
//           <Input value={modalData.name} readOnly />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Description</Form.Label>
//           <TextArea
//             value={modalData.description}
//             onChange={(e) =>
//               setModalData((prev) => ({ ...prev, description: e.target.value }))
//             }
//             rows={3}
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Location</Form.Label>
//           <Input
//             value={modalData.location}
//             onChange={handleLocationChange}
//             placeholder="Enter location"
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Start Date</Form.Label>
//           <DatePicker
//             value={modalData.startDate}
//             format="DD/MM/YYYY"
//             onChange={(date) => handleDateChange("startDate", date)}
//             style={{ width: "100%" }}
//             placeholder="Select start date"
//             disabled
//             disabledDate={(current) =>
//               current && current <= dayjs().endOf("day")
//             }
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>End Date</Form.Label>
//           <DatePicker
//             value={modalData.endDate}
//             format="DD/MM/YYYY"
//             onChange={(date) => handleDateChange("endDate", date)}
//             style={{ width: "100%" }}
//             placeholder="Select end date"
//             disabled
//             disabledDate={(current) =>
//               current &&
//               (current < modalData.startDate ||
//                 (modalData.startDate &&
//                   current > modalData.startDate.add(5, "day")))
//             }
//           />
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label>Deposit</Form.Label>
//           <Input value={deposit.toLocaleString()} readOnly />
//         </Form.Group>
//         <h5>Costumes</h5>
//         {modalData.characters.length === 0 ? (
//           <p>No costumes found.</p>
//         ) : (
//           <>
//             {modalData.characters
//               .slice(
//                 (currentCharacterPage - 1) * charactersPerPage,
//                 currentCharacterPage * charactersPerPage
//               )
//               .map((char) => (
//                 <Card key={char.requestCharacterId} className="mb-3">
//                   <Card.Body>
//                     <Spin
//                       spinning={!!characterLoading[char.requestCharacterId]}
//                     >
//                       <Row>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Costume</Form.Label>
//                             <Select
//                               value={char.characterId}
//                               onChange={(value) =>
//                                 handleCharacterChange(
//                                   char.requestCharacterId,
//                                   "characterId",
//                                   value
//                                 )
//                               }
//                               style={{ width: "100%" }}
//                               placeholder="Select costume"
//                             >
//                               {allCharacters.map((character) => (
//                                 <Option
//                                   key={character.characterId}
//                                   value={character.characterId}
//                                 >
//                                   {character.characterName} (Price:{" "}
//                                   {character.price})
//                                 </Option>
//                               ))}
//                             </Select>
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Description</Form.Label>
//                             <Input
//                               value={char.description}
//                               onChange={(e) =>
//                                 handleCharacterChange(
//                                   char.requestCharacterId,
//                                   "description",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Enter description"
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Max Height (cm)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.maxHeight}
//                               readOnly
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Max Weight (kg)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.maxWeight}
//                               readOnly
//                             />
//                           </Form.Group>
//                         </Col>
//                         <Col md={6}>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Min Height (cm)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.minHeight}
//                               readOnly
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>Min Weight (kg)</Form.Label>
//                             <Input
//                               type="number"
//                               value={char.minWeight}
//                               readOnly
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>
//                               Quantity (Max: {char.maxQuantity})
//                             </Form.Label>
//                             <Input
//                               type="number"
//                               value={char.quantity}
//                               onChange={(e) =>
//                                 handleCharacterChange(
//                                   char.requestCharacterId,
//                                   "quantity",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Enter quantity"
//                               min={1}
//                               max={char.maxQuantity || 10}
//                             />
//                           </Form.Group>
//                           <Form.Group className="mb-3">
//                             <Form.Label>
//                               Price for this Costume in all days
//                             </Form.Label>
//                             <Input
//                               value={calculateCharacterPrice(char)}
//                               readOnly
//                             />
//                           </Form.Group>
//                           {char.urlImage && (
//                             <Image
//                               src={char.urlImage}
//                               alt="Costume Preview"
//                               width={100}
//                               preview
//                               style={{ display: "block", marginTop: "10px" }}
//                             />
//                           )}
//                         </Col>
//                       </Row>
//                     </Spin>
//                   </Card.Body>
//                 </Card>
//               ))}
//             <Form.Group className="mb-3">
//               <Form.Label>Total Price</Form.Label>
//               <Input value={calculateTotalPrice()} readOnly />
//             </Form.Group>
//             <Pagination
//               current={currentCharacterPage}
//               pageSize={charactersPerPage}
//               total={modalData.characters.length}
//               onChange={(page) => setCurrentCharacterPage(page)}
//               showSizeChanger={false}
//               style={{ textAlign: "right" }}
//             />
//           </>
//         )}
//       </Form>
//     </Modal>
//   );
// };

// export default EditRentalCostume;

//============ them xoa character ==================================
import React, { useState, useEffect } from "react";
import {
  Form,
  Card,
  Row,
  Col,
  Button as BootstrapButton,
} from "react-bootstrap";
import {
  Modal,
  Input,
  DatePicker,
  Pagination,
  Image,
  Select,
  Spin,
  Button,
  List,
  Avatar,
} from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";

const { TextArea } = Input;
const { Option } = Select;

const EditRentalCostume = ({
  visible,
  onCancel,
  onSubmit,
  modalData,
  setModalData,
  selectedRequestId,
  currentCharacterPage,
  setCurrentCharacterPage,
  charactersPerPage = 2,
}) => {
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [characterLoading, setCharacterLoading] = useState({});
  const [deposit, setDeposit] = useState(0);
  const [isCharacterModalVisible, setIsCharacterModalVisible] = useState(false);
  const [availableCharacters, setAvailableCharacters] = useState([]);
  const [charactersToRemove, setCharactersToRemove] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Tính deposit dựa trên danh sách characters
  const calculateDeposit = (characters) => {
    return characters.reduce((sum, char) => {
      const characterPrice = char.price || 0;
      return sum + characterPrice * (char.quantity || 0) * 5;
    }, 0);
  };

  // Gọi API chooseDeposit
  const updateDeposit = async (requestId, depositValue) => {
    try {
      const payload = { deposit: depositValue.toString() };
      const response = await MyRentalCostumeService.chooseDeposit(
        requestId,
        payload
      );
      return response;
    } catch (error) {
      toast.error(
        "Failed to update deposit: " + (error.message || "Unknown error")
      );
      throw error;
    }
  };

  // Lấy danh sách characters và chi tiết request khi modal mở
  useEffect(() => {
    if (visible && selectedRequestId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const allCharactersData =
            await MyRentalCostumeService.getAllCharacters();
          setAllCharacters(allCharactersData);

          const requestData =
            await MyRentalCostumeService.getRequestByRequestId(
              selectedRequestId
            );
          const charactersList = requestData.charactersListResponse || [];

          const characterDetailsPromises = charactersList.map(async (char) => {
            try {
              const characterDetails =
                await MyRentalCostumeService.getCharacterById(char.characterId);
              return {
                requestCharacterId: char.requestCharacterId || "",
                characterId: String(char.characterId || ""),
                characterName:
                  characterDetails.characterName ||
                  char.characterName ||
                  "Unknown",
                description:
                  char.description || characterDetails.description || "",
                quantity: char.quantity || 1,
                maxQuantity: characterDetails.quantity || char.quantity || 1,
                price: characterDetails.price || 0,
                maxHeight: char.maxHeight || characterDetails.maxHeight || 0,
                maxWeight: char.maxWeight || characterDetails.maxWeight || 0,
                minHeight: char.minHeight || characterDetails.minHeight || 0,
                minWeight: char.minWeight || characterDetails.minWeight || 0,
                urlImage:
                  char.characterImages?.[0]?.urlImage ||
                  characterDetails.images?.[0]?.urlImage ||
                  "",
              };
            } catch (error) {
              toast.error(
                `Failed to fetch details for character ${char.characterName}: ${error.message}`
              );
              return {
                requestCharacterId: char.requestCharacterId || "",
                characterId: String(char.characterId || ""),
                characterName: char.characterName || "Unknown",
                description: char.description || "",
                quantity: char.quantity || 1,
                maxQuantity: char.quantity || 1,
                price: 0,
                maxHeight: char.maxHeight || 0,
                maxWeight: char.maxWeight || 0,
                minHeight: char.minHeight || 0,
                minWeight: char.minWeight || 0,
                urlImage: char.characterImages?.[0]?.urlImage || "",
              };
            }
          });

          const characterDetails = await Promise.all(characterDetailsPromises);

          const initialDeposit = calculateDeposit(characterDetails);

          setModalData({
            name: requestData.name || "Unnamed Request",
            description: requestData.description || "",
            location: requestData.location || "",
            startDate: requestData.startDate
              ? dayjs(requestData.startDate, [
                  "HH:mm DD/MM/YYYY",
                  "DD/MM/YYYY",
                  "YYYY-MM-DD",
                ])
              : null,
            endDate: requestData.endDate
              ? dayjs(requestData.endDate, [
                  "HH:mm DD/MM/YYYY",
                  "DD/MM/YYYY",
                  "YYYY-MM-DD",
                ])
              : null,
            characters: characterDetails,
            fullRequestData: requestData,
          });

          setDeposit(initialDeposit);
        } catch (error) {
          toast.error(
            "Failed to fetch data: " + (error.message || "Unknown error")
          );
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [visible, selectedRequestId, setModalData]);

  // Lấy danh sách nhân vật có thể thêm
  useEffect(() => {
    const fetchAvailableCharacters = async () => {
      if (isCharacterModalVisible) {
        try {
          setLoading(true);
          const requestData =
            await MyRentalCostumeService.getRequestByRequestId(
              selectedRequestId
            );
          const existingCharacterIds = (
            requestData.charactersListResponse || []
          ).map((char) => char.characterId);
          const filteredCharacters = allCharacters.filter(
            (char) => !existingCharacterIds.includes(char.characterId)
          );
          setAvailableCharacters(filteredCharacters);
          setCurrentPage(1);
        } catch (error) {
          toast.error("Failed to load available characters.");
          console.error("Error fetching available characters:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAvailableCharacters();
  }, [isCharacterModalVisible, selectedRequestId, allCharacters]);

  const handleCharacterChange = async (requestCharacterId, field, value) => {
    if (field === "characterId") {
      const isDuplicate = modalData.characters.some(
        (char) =>
          char.characterId === value &&
          char.requestCharacterId !== requestCharacterId
      );
      if (isDuplicate) {
        toast.error("This character is already selected!");
        return;
      }

      setCharacterLoading((prev) => ({ ...prev, [requestCharacterId]: true }));

      try {
        const characterDetails = await MyRentalCostumeService.getCharacterById(
          value
        );

        setModalData((prev) => {
          const updatedCharacters = prev.characters.map((char) =>
            char.requestCharacterId === requestCharacterId
              ? {
                  ...char,
                  characterId: String(value),
                  characterName: characterDetails.characterName || "Unknown",
                  description:
                    char.description || characterDetails.description || "",
                  price: characterDetails.price || 0,
                  maxQuantity: characterDetails.quantity || 1,
                  maxHeight: characterDetails.maxHeight || 0,
                  maxWeight: characterDetails.maxWeight || 0,
                  minHeight: characterDetails.minHeight || 0,
                  minWeight: characterDetails.minWeight || 0,
                  urlImage: characterDetails.images?.[0]?.urlImage || "",
                }
              : char
          );

          const newDeposit = calculateDeposit(updatedCharacters);
          setDeposit(newDeposit);
          updateDeposit(selectedRequestId, newDeposit);

          return { ...prev, characters: updatedCharacters };
        });
      } catch (error) {
        toast.error(`Failed to fetch character details: ${error.message}`);
      } finally {
        setCharacterLoading((prev) => ({
          ...prev,
          [requestCharacterId]: false,
        }));
      }
    } else {
      setModalData((prev) => {
        const updatedCharacters = prev.characters.map((char) =>
          char.requestCharacterId === requestCharacterId
            ? {
                ...char,
                [field]:
                  field === "quantity"
                    ? Math.min(
                        Number(value) > 0 ? Number(value) : 0,
                        char.maxQuantity || Number.MAX_SAFE_INTEGER
                      )
                    : value,
              }
            : char
        );

        const newDeposit = calculateDeposit(updatedCharacters);
        setDeposit(newDeposit);
        updateDeposit(selectedRequestId, newDeposit);

        return { ...prev, characters: updatedCharacters };
      });
    }
  };

  const handleAddCharacter = async (characterId) => {
    if (!characterId) {
      toast.error("Please select a character!");
      return;
    }

    setLoading(true);
    try {
      const characterData = await MyRentalCostumeService.getCharacterById(
        characterId
      );

      // Lấy request data để lấy startDate và endDate
      const requestData = await MyRentalCostumeService.getRequestByRequestId(
        selectedRequestId
      );
      const charactersList = requestData.charactersListResponse || [];
      let addRequestDates = [];

      // Nếu charactersListResponse không rỗng, lấy startDate và endDate từ requestDateResponses
      if (
        charactersList.length > 0 &&
        charactersList[0].requestDateResponses?.length > 0
      ) {
        addRequestDates = charactersList[0].requestDateResponses.map(
          (date) => ({
            startDate: dayjs(date.startDate, [
              "HH:mm DD/MM/YYYY",
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]).format("HH:mm DD/MM/YYYY"),
            endDate: dayjs(date.endDate, [
              "HH:mm DD/MM/YYYY",
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]).format("HH:mm DD/MM/YYYY"),
          })
        );
      } else {
        // Nếu requestDateResponses rỗng, sử dụng startDate và endDate từ cấp request
        addRequestDates = [
          {
            startDate: dayjs(requestData.startDate, [
              "HH:mm DD/MM/YYYY",
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]).format("HH:mm DD/MM/YYYY"),
            endDate: dayjs(requestData.endDate, [
              "HH:mm DD/MM/YYYY",
              "DD/MM/YYYY",
              "YYYY-MM-DD",
            ]).format("HH:mm DD/MM/YYYY"),
          },
        ];
      }

      // Chuẩn bị dữ liệu cho AddCharacterInReq
      const addCharacterData = {
        requestId: selectedRequestId,
        characterId: characterId,
        description: "shared",
        cosplayerId: null,
        quantity: 1,
        addRequestDates: addRequestDates,
      };

      // Gọi API AddCharacterInReq
      const addResponse = await MyRentalCostumeService.AddCharacterInReq(
        addCharacterData
      );
      console.log("AddCharacterInReq response:", addResponse);

      // Lấy lại dữ liệu request để có requestCharacterId
      const updatedRequestData =
        await MyRentalCostumeService.getRequestByRequestId(selectedRequestId);
      const updatedCharactersList =
        updatedRequestData.charactersListResponse || [];

      // Tìm character mới thêm vào
      const newCharacter = updatedCharactersList.find(
        (char) => char.characterId === characterId
      );

      if (!newCharacter) {
        throw new Error("Newly added character not found in request data.");
      }

      // Tạo object character mới cho modalData.characters
      const newCharacterData = {
        requestCharacterId: newCharacter.requestCharacterId,
        characterId: String(characterId),
        characterName: characterData.characterName || "Unknown",
        description: newCharacter.description || "shared",
        quantity: newCharacter.quantity || 1,
        maxQuantity: characterData.quantity || 1,
        price: characterData.price || 0,
        maxHeight: newCharacter.maxHeight || characterData.maxHeight || 0,
        maxWeight: newCharacter.maxWeight || characterData.maxWeight || 0,
        minHeight: newCharacter.minHeight || characterData.minHeight || 0,
        minWeight: newCharacter.minWeight || characterData.minWeight || 0,
        urlImage:
          newCharacter.characterImages?.[0]?.urlImage ||
          characterData.images?.[0]?.urlImage ||
          "",
      };

      setModalData((prev) => {
        const updatedCharacters = [...prev.characters, newCharacterData];
        const newDeposit = calculateDeposit(updatedCharacters);
        setDeposit(newDeposit);
        updateDeposit(selectedRequestId, newDeposit);
        return { ...prev, characters: updatedCharacters };
      });

      toast.success("Costume added successfully!");
      setIsCharacterModalVisible(false);
    } catch (error) {
      toast.error(
        "Failed to add costume: " + (error.message || "Unknown error")
      );
      console.error("Error adding character:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCharacter = (requestCharacterId) => {
    if (modalData.characters.length <= 1) {
      toast.error("Cannot remove the last costume! At least one is required.");
      return;
    }

    try {
      setCharactersToRemove((prev) => [
        ...prev,
        { requestCharacterId: requestCharacterId },
      ]);

      setModalData((prev) => {
        const updatedCharacters = prev.characters.filter(
          (char) => char.requestCharacterId !== requestCharacterId
        );
        const newDeposit = calculateDeposit(updatedCharacters);
        setDeposit(newDeposit);
        updateDeposit(selectedRequestId, newDeposit);
        return { ...prev, characters: updatedCharacters };
      });

      toast.success("Costume removed from pending changes!");
    } catch (error) {
      toast.error("Failed to prepare costume for removal.");
      console.error("Error preparing character removal:", error);
    }
  };

  const handleDateChange = (field, date) => {
    setModalData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleLocationChange = (e) => {
    setModalData((prev) => ({
      ...prev,
      location: e.target.value,
    }));
  };

  const calculateTotalPrice = () => {
    const totalDays =
      modalData.endDate && modalData.startDate
        ? modalData.endDate.diff(modalData.startDate, "day") + 1
        : 1;
    return modalData.characters.reduce((sum, char) => {
      const characterPrice = char.price || 0;
      return sum + characterPrice * char.quantity * totalDays;
    }, 0);
  };

  const calculateCharacterPrice = (char) => {
    const totalDays =
      modalData.endDate && modalData.startDate
        ? modalData.endDate.diff(modalData.startDate, "day") + 1
        : 1;
    const characterPrice = char.price || 0;
    return characterPrice * char.quantity * totalDays;
  };

  const handleSubmit = async () => {
    const { characters, startDate, endDate, description, location } = modalData;

    if (!startDate || !endDate) {
      toast.error("Start Date and End Date are required!");
      return;
    }
    if (endDate.isBefore(startDate)) {
      toast.error("End Date must be on or after Start Date!");
      return;
    }
    if (endDate.diff(startDate, "day") > 5) {
      toast.error("The rental period cannot exceed 5 days!");
      return;
    }
    if (!location) {
      toast.error("Location is required!");
      return;
    }
    if (characters.length === 0) {
      toast.error("At least one character is required!");
      return;
    }
    for (const char of characters) {
      if (!char.characterId || typeof char.characterId !== "string") {
        toast.error(`Invalid character ID for ${char.characterName}!`);
        return;
      }
      if (char.quantity <= 0) {
        toast.error(`Quantity for ${char.characterName} must be positive!`);
        return;
      }
      if (char.quantity > (char.maxQuantity || Number.MAX_SAFE_INTEGER)) {
        toast.error(
          `Quantity for ${char.characterName} exceeds available stock (${char.maxQuantity})!`
        );
        return;
      }
    }

    setLoading(true);
    try {
      // Gọi API DeleteCharacterInReq cho các nhân vật trong charactersToRemove
      const deleteCharacterPromises = charactersToRemove.map(async (char) => {
        try {
          const response = await MyRentalCostumeService.DeleteCharacterInReq(
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

      // Chờ tất cả các API DeleteCharacterInReq hoàn thành
      await Promise.all(deleteCharacterPromises);

      // Chuẩn bị dữ liệu cho editRequest
      const formattedStartDate = startDate.format("DD/MM/YYYY");
      const formattedEndDate = endDate.format("DD/MM/YYYY");

      if (
        formattedStartDate === "Invalid Date" ||
        formattedEndDate === "Invalid Date"
      ) {
        toast.error("Invalid date format!");
        return;
      }

      const totalDays = endDate.diff(startDate, "day") + 1;
      const totalPrice = characters.reduce((sum, char) => {
        const characterPrice = char.price || 0;
        return sum + characterPrice * char.quantity * totalDays;
      }, 0);

      const updatedData = {
        name: modalData.fullRequestData.name || "Unnamed Request",
        description: description || "",
        price: totalPrice,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        location: location || modalData.fullRequestData.location || "",
        serviceId: modalData.fullRequestData.serviceId || "S001",
        packageId: null,
        listUpdateRequestCharacters: characters.map((char) => ({
          requestCharacterId: char.requestCharacterId,
          characterId: String(char.characterId),
          cosplayerId: null,
          description: char.description || "",
          quantity: char.quantity,
        })),
      };

      console.log("Payload sent to API:", JSON.stringify(updatedData, null, 2));

      const response = await MyRentalCostumeService.editRequest(
        selectedRequestId,
        updatedData
      );

      // Xóa danh sách pending changes
      setCharactersToRemove([]);

      // Truyền deposit cùng response
      onSubmit(
        response,
        totalPrice,
        formattedStartDate,
        formattedEndDate,
        deposit
      );
      toast.success("Costumes updated successfully!");
      onCancel();
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error(
        error.response?.data?.title ||
          error.response?.data?.message ||
          "Failed to update costumes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Tính toán danh sách nhân vật hiển thị trong modal chọn character
  const paginatedCharacters = availableCharacters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Modal
      title="Edit Costume Request"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Submit"
      width={800}
      confirmLoading={loading}
    >
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Input value={modalData.name} readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <TextArea
            value={modalData.description}
            onChange={(e) =>
              setModalData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Input
            value={modalData.location}
            onChange={handleLocationChange}
            placeholder="Enter location"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <DatePicker
            value={modalData.startDate}
            format="DD/MM/YYYY"
            onChange={(date) => handleDateChange("startDate", date)}
            style={{ width: "100%" }}
            placeholder="Select start date"
            disabled
            disabledDate={(current) =>
              current && current <= dayjs().endOf("day")
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <DatePicker
            value={modalData.endDate}
            format="DD/MM/YYYY"
            onChange={(date) => handleDateChange("endDate", date)}
            style={{ width: "100%" }}
            placeholder="Select end date"
            disabled
            disabledDate={(current) =>
              current &&
              (current < modalData.startDate ||
                (modalData.startDate &&
                  current > modalData.startDate.add(5, "day")))
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Deposit</Form.Label>
          <Input value={deposit.toLocaleString()} readOnly />
        </Form.Group>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <h5>Costumes</h5>
          <Button
            type="primary"
            onClick={() => setIsCharacterModalVisible(true)}
          >
            Add Costume
          </Button>
        </div>
        {modalData.characters.length === 0 ? (
          <p>No costumes found.</p>
        ) : (
          <>
            {modalData.characters
              .slice(
                (currentCharacterPage - 1) * charactersPerPage,
                currentCharacterPage * charactersPerPage
              )
              .map((char) => (
                <Card key={char.requestCharacterId} className="mb-3">
                  <Card.Body>
                    <Spin
                      spinning={!!characterLoading[char.requestCharacterId]}
                    >
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Costume</Form.Label>
                            <Select
                              value={char.characterId}
                              onChange={(value) =>
                                handleCharacterChange(
                                  char.requestCharacterId,
                                  "characterId",
                                  value
                                )
                              }
                              style={{ width: "100%" }}
                              placeholder="Select costume"
                            >
                              {allCharacters.map((character) => (
                                <Option
                                  key={character.characterId}
                                  value={character.characterId}
                                >
                                  {character.characterName} (Price:{" "}
                                  {character.price.toLocaleString()})
                                </Option>
                              ))}
                            </Select>
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Input
                              value={char.description}
                              onChange={(e) =>
                                handleCharacterChange(
                                  char.requestCharacterId,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Enter description"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxHeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxWeight}
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.minHeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.minWeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Quantity (Max: {char.maxQuantity})
                            </Form.Label>
                            <Input
                              type="number"
                              value={char.quantity}
                              onChange={(e) =>
                                handleCharacterChange(
                                  char.requestCharacterId,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              placeholder="Enter quantity"
                              min={1}
                              max={char.maxQuantity || 10}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Price for this Costume in all days
                            </Form.Label>
                            <Input
                              value={calculateCharacterPrice(
                                char
                              ).toLocaleString()}
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
                        </Col>
                      </Row>
                      <BootstrapButton
                        variant="outline-danger"
                        onClick={() =>
                          handleRemoveCharacter(char.requestCharacterId)
                        }
                        style={{ marginTop: "10px" }}
                      >
                        Remove
                      </BootstrapButton>
                    </Spin>
                  </Card.Body>
                </Card>
              ))}
            <Form.Group className="mb-3">
              <Form.Label>Total Price</Form.Label>
              <Input value={calculateTotalPrice().toLocaleString()} readOnly />
            </Form.Group>
            <Pagination
              current={currentCharacterPage}
              pageSize={charactersPerPage}
              total={modalData.characters.length}
              onChange={(page) => setCurrentCharacterPage(page)}
              showSizeChanger={false}
              style={{ textAlign: "right" }}
            />
          </>
        )}
      </Form>

      {/* Modal chọn character */}
      <Modal
        title="Select Costume"
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
                        modalData.characters.some(
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
                          Quantity: {character.quantity || "N/A"}
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
    </Modal>
  );
};

export default EditRentalCostume;
