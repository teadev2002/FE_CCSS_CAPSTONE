// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Input,
//   Modal,
//   DatePicker,
//   TimePicker,
//   List,
//   Card,
//   Row,
//   Col,
//   Checkbox,
//   Pagination,
//   Spin,
//   Alert,
// } from "antd";
// import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
// import { jwtDecode } from "jwt-decode";
// import dayjs from "dayjs";
// import "../../styles/CosplayersPage.scss";
// import HireCosplayerService from "../../services/HireCosplayerService/HireCosplayerService.js";
// import { toast } from "react-toastify";

// const { RangePicker: DateRangePicker } = DatePicker;
// const { RangePicker: TimeRangePicker } = TimePicker;

// const DEFAULT_AVATAR_URL =
//   "https://pm1.narvii.com/6324/0d7f51553b6ca0785d3912929088c25acc1bc53f_hq.jpg";

// const CosplayersPage = () => {
//   const [cosplayers, setCosplayers] = useState([]);
//   const [characters, setCharacters] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [dateRange, setDateRange] = useState(null);
//   const [timeRange, setTimeRange] = useState(null);
//   const [location, setLocation] = useState("");
//   const [accountCouponId, setAccountCouponId] = useState("");
//   const [searchCharacter, setSearchCharacter] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentCosplayerPage, setCurrentCosplayerPage] = useState(1);
//   const [step, setStep] = useState(1);
//   const [requests, setRequests] = useState([]);
//   const [currentCharacter, setCurrentCharacter] = useState(null);
//   const [filteredCosplayers, setFilteredCosplayers] = useState([]);
//   const [selectedCosplayers, setSelectedCosplayers] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     description: "",
//     listRequestCharacters: [],
//     name: "",
//   });
//   const [accountId, setAccountId] = useState(null);
//   const [cosplayerPrices, setCosplayerPrices] = useState({});

//   const serviceId = "S002";
//   const packageId = "";
//   const dateFormat = "DD/MM/YYYY";
//   const timeFormat = "HH:mm";
//   const characterPageSize = 10;
//   const cosplayerPageSize = 9;

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       setError("You need to log in to use this page.");
//       return;
//     }

//     setIsAuthenticated(true);

//     try {
//       const decoded = jwtDecode(accessToken);
//       const accountName = decoded?.AccountName;
//       const id = decoded?.Id;
//       if (accountName) {
//         setModalData((prev) => ({ ...prev, name: accountName }));
//       }
//       if (id) {
//         setAccountId(id);
//       }
//     } catch (error) {
//       console.error("Invalid token", error);
//       setError("Invalid token. Please log in again.");
//       return;
//     }

//     const fetchCharacters = async () => {
//       setLoading(true);
//       try {
//         const charactersData = await HireCosplayerService.getAllCharacters();
//         const mappedCharacters = charactersData.map((character) => ({
//           id: character.characterId,
//           name: character.characterName,
//           minHeight: character.minHeight,
//           maxHeight: character.maxHeight,
//           minWeight: character.minWeight,
//           maxWeight: character.maxWeight,
//         }));
//         setCharacters(mappedCharacters);
//       } catch (err) {
//         setError("Unable to load characters. Please try again later.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCharacters();
//   }, []);

//   const fetchCosplayersByCharacterAndTime = async (characterId) => {
//     if (!dateRange || !timeRange || !characterId) {
//       setFilteredCosplayers([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const startDateTime = `${timeRange[0].format(
//         timeFormat
//       )} ${dateRange[0].format(dateFormat)}`;
//       const endDateTime = `${timeRange[1].format(
//         timeFormat
//       )} ${dateRange[1].format(dateFormat)}`;

//       const cosplayersData =
//         await HireCosplayerService.getAccountNoTaskByCharacterId(
//           characterId,
//           startDateTime,
//           endDateTime
//         );

//       const mappedCosplayers = cosplayersData.map((cosplayer) => ({
//         id: cosplayer.accountId,
//         name: cosplayer.name,
//         avatar: cosplayer.images[0]?.urlImage || DEFAULT_AVATAR_URL,
//         description: cosplayer.description || "No description",
//         height: cosplayer.height,
//         weight: cosplayer.weight,
//       }));

//       const character = characters.find((char) => char.id === characterId);
//       const filtered = mappedCosplayers.filter(
//         (cosplayer) =>
//           !requests.some((r) => r.cosplayerIds.includes(cosplayer.id)) &&
//           cosplayer.height > character.minHeight &&
//           cosplayer.height < character.maxHeight &&
//           cosplayer.weight > character.minWeight &&
//           cosplayer.weight < character.maxWeight
//       );

//       setCosplayers(mappedCosplayers);
//       setFilteredCosplayers(filtered);
//     } catch (err) {
//       setError("Unable to load cosplayers. Please try again later.");
//       console.error(err);
//       setFilteredCosplayers([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const calculateCosplayerPrice = (salaryIndex, quantity) => {
//     return 100000 * salaryIndex * quantity;
//   };

//   useEffect(() => {
//     const fetchCosplayerPrices = async () => {
//       if (isModalVisible && modalData.listRequestCharacters.length > 0) {
//         const prices = {};
//         await Promise.all(
//           modalData.listRequestCharacters.map(async (item) => {
//             try {
//               const cosplayerData =
//                 await HireCosplayerService.getNameCosplayerInRequestByCosplayerId(
//                   item.cosplayerId
//                 );
//               const salaryIndex = cosplayerData?.salaryIndex || 1;
//               prices[item.cosplayerId] = calculateCosplayerPrice(
//                 salaryIndex,
//                 item.quantity
//               );
//             } catch (error) {
//               console.warn(
//                 `Failed to fetch salaryIndex for cosplayer ${item.cosplayerId}:`,
//                 error
//               );
//               prices[item.cosplayerId] = calculateCosplayerPrice(
//                 1,
//                 item.quantity
//               );
//             }
//           })
//         );
//         setCosplayerPrices(prices);
//       }
//     };
//     fetchCosplayerPrices();
//   }, [isModalVisible, modalData.listRequestCharacters]);

//   const filteredCharacters = characters.filter((char) =>
//     char.name.toLowerCase().includes(searchCharacter.toLowerCase())
//   );

//   const paginatedCharacters = filteredCharacters.slice(
//     (currentPage - 1) * characterPageSize,
//     currentPage * characterPageSize
//   );

//   const paginatedCosplayers = filteredCosplayers.slice(
//     (currentCosplayerPage - 1) * cosplayerPageSize,
//     currentCosplayerPage * cosplayerPageSize
//   );

//   const disabledDate = (current) => {
//     return current && current < dayjs().startOf("day");
//   };

//   const handleDateRangeChange = (dates) => {
//     if (!dates) {
//       setDateRange(null);
//       setFilteredCosplayers([]);
//       return;
//     }

//     const [start, end] = dates;
//     if (end < start) {
//       toast.error("End date must be equal to or after start date!");
//       return;
//     }

//     setDateRange(dates);
//     setStep(2);

//     if (currentCharacter) {
//       fetchCosplayersByCharacterAndTime(currentCharacter.characterId);
//     }
//   };

//   const disabledTime = (type) => {
//     const now = dayjs();
//     const isToday = dateRange && dateRange[0]?.isSame(now, "day");

//     return {
//       disabledHours: () => {
//         if (type === "start" && isToday) {
//           return Array.from({ length: now.hour() }, (_, i) => i);
//         }
//         return [];
//       },
//       disabledMinutes: (selectedHour) => {
//         if (type === "start" && isToday && selectedHour === now.hour()) {
//           return Array.from({ length: now.minute() }, (_, i) => i);
//         }
//         return [];
//       },
//     };
//   };

//   const handleTimeRangeChange = (times) => {
//     if (!times) {
//       setTimeRange(null);
//       setFilteredCosplayers([]);
//       return;
//     }

//     const [start, end] = times;
//     const now = dayjs();

//     const isStartToday = dateRange && dateRange[0]?.isSame(now, "day");
//     if (isStartToday && start.isBefore(now)) {
//       toast.error("Start time cannot be in the past!");
//       return;
//     }

//     if (end.isBefore(start)) {
//       toast.error("End time must be equal to or after start time!");
//       return;
//     }

//     setTimeRange(times);
//     setStep(3);

//     if (currentCharacter) {
//       fetchCosplayersByCharacterAndTime(currentCharacter.characterId);
//     }
//   };

//   const handleLocationChange = (e) => {
//     const value = e.target.value.trim();
//     if (!value) {
//       toast.error("Location cannot be empty!");
//       return;
//     }
//     setLocation(value);
//     setStep(4);
//   };

//   const handleCouponChange = (e) => {
//     setAccountCouponId(e.target.value);
//   };

//   const handleSkipCoupon = () => {
//     setStep(5);
//   };

//   const handleCharacterSelect = (character) => {
//     if (currentCharacter?.characterId === character.id) {
//       setCurrentCharacter(null);
//       setFilteredCosplayers([]);
//       setSelectedCosplayers([]);
//       setSelectAll(false);
//       setCurrentCosplayerPage(1);
//       setStep(5);
//     } else {
//       setCurrentCharacter({
//         characterId: character.id,
//         characterName: character.name,
//       });
//       fetchCosplayersByCharacterAndTime(character.id);
//       setSelectedCosplayers([]);
//       setSelectAll(false);
//       setCurrentCosplayerPage(1);
//       setStep(6);
//     }
//   };

//   const handleCosplayerSelect = (cosplayerId) => {
//     setSelectedCosplayers((prev) =>
//       prev.includes(cosplayerId)
//         ? prev.filter((id) => id !== cosplayerId)
//         : [...prev, cosplayerId]
//     );
//   };

//   const handleSelectAll = (e) => {
//     setSelectAll(e.target.checked);
//     setSelectedCosplayers(
//       e.target.checked ? paginatedCosplayers.map((c) => c.id) : []
//     );
//   };

//   const handleAddCosplayers = () => {
//     if (selectedCosplayers.length === 0) {
//       toast.error("Please select at least one cosplayer!");
//       return;
//     }
//     setRequests((prev) => [
//       ...prev,
//       {
//         characterId: currentCharacter.characterId,
//         characterName: currentCharacter.characterName,
//         cosplayerIds: selectedCosplayers,
//       },
//     ]);
//     setStep(5);
//     setFilteredCosplayers([]);
//     setSelectedCosplayers([]);
//     setSelectAll(false);
//     setCurrentCosplayerPage(1);
//     setCurrentCharacter(null);
//   };

//   const handleSendRequest = () => {
//     if (!dateRange || !timeRange || !location) {
//       toast.error(
//         "Please complete all required fields (date, time, location)!"
//       );
//       return;
//     }
//     if (requests.length === 0) {
//       toast.error("Please select at least one character and cosplayer!");
//       return;
//     }
//     setModalData((prev) => ({
//       ...prev,
//       listRequestCharacters: requests.flatMap((req) =>
//         req.cosplayerIds.map((cosplayerId) => ({
//           characterId: req.characterId,
//           cosplayerId,
//           description: "",
//           quantity: 1,
//         }))
//       ),
//       startDateTime:
//         timeRange && dateRange
//           ? `${timeRange[0].format(timeFormat)} ${dateRange[0].format(
//               dateFormat
//             )}`
//           : "N/A",
//       endDateTime:
//         timeRange && dateRange
//           ? `${timeRange[1].format(timeFormat)} ${dateRange[1].format(
//               dateFormat
//             )}`
//           : "N/A",
//     }));
//     setIsModalVisible(true);
//   };

//   const handleRemoveCosplayer = (cosplayerId, characterId) => {
//     setModalData((prev) => ({
//       ...prev,
//       listRequestCharacters: prev.listRequestCharacters.filter(
//         (item) =>
//           !(
//             item.cosplayerId === cosplayerId && item.characterId === characterId
//           )
//       ),
//     }));
//     setRequests((prev) =>
//       prev
//         .map((req) => ({
//           ...req,
//           cosplayerIds: req.cosplayerIds.filter((id) => id !== cosplayerId),
//         }))
//         .filter((req) => req.cosplayerIds.length > 0)
//     );
//     setCosplayerPrices((prev) => {
//       const newPrices = { ...prev };
//       delete newPrices[cosplayerId];
//       return newPrices;
//     });
//   };

//   const handleModalConfirm = async () => {
//     if (modalData.listRequestCharacters.length === 0) {
//       toast.error(
//         "Please select at least one cosplayer before sending the request!"
//       );
//       return;
//     }

//     if (!modalData.name.trim()) {
//       toast.error("Name cannot be empty!");
//       return;
//     }

//     if (!accountId) {
//       toast.error(
//         "Cannot send request: User ID is missing. Please log in again."
//       );
//       return;
//     }

//     const totalPrice = Object.values(cosplayerPrices).reduce(
//       (sum, price) => sum + price,
//       0
//     );
//     const requestData = {
//       accountId: accountId,
//       name: modalData.name,
//       description: modalData.description || " ",
//       price: totalPrice,
//       startDate: `${timeRange[0].format(timeFormat)} ${dateRange[0].format(
//         dateFormat
//       )}`,
//       endDate: `${timeRange[1].format(timeFormat)} ${dateRange[1].format(
//         dateFormat
//       )}`,
//       location: location,
//       serviceId: "S002",
//       packageId: " ",
//       // accountCouponId: accountCouponId || null,
//       listRequestCharacters: modalData.listRequestCharacters.map((item) => ({
//         characterId: item.characterId,
//         cosplayerId: item.cosplayerId,
//         description: " ",
//         quantity: 1,
//       })),
//     };

//     try {
//       const response = await HireCosplayerService.sendRequestHireCosplayer(
//         requestData
//       );
//       console.log("Request sent successfully:", response);
//       setIsModalVisible(false);
//       setStep(1);
//       setDateRange(null);
//       setTimeRange(null);
//       setLocation("");
//       setAccountCouponId("");
//       setRequests([]);
//       setFilteredCosplayers([]);
//       setSelectedCosplayers([]);
//       setSelectAll(false);
//       setCurrentCosplayerPage(1);
//       setCurrentCharacter(null);
//       setCosplayerPrices({});
//       toast.success("Request sent successfully!");
//     } catch (error) {
//       console.error("Failed to send request:", error.message);
//       toast.error(`Failed to send request: ${error.message}`);
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div
//         className="cosplay-rental-page min-vh-100"
//         style={{ padding: "50px" }}
//       >
//         <Alert
//           message="Login Error"
//           description={error || "You need to log in to use this page."}
//           type="error"
//           showIcon
//         />
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div
//         className="cosplay-rental-page min-vh-100"
//         style={{ textAlign: "center", padding: "50px" }}
//       >
//         <Spin size="large" tip="Loading data..." />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className="cosplay-rental-page min-vh-100"
//         style={{ padding: "50px" }}
//       >
//         <Alert message="Error" description={error} type="error" showIcon />
//       </div>
//     );
//   }

//   return (
//     <div className="cosplay-rental-page min-vh-100">
//       <div className="hero-section text-black py-5">
//         <div className="container">
//           <h1 className="display-4 fw-bold text-center">Hire Cosplayers</h1>
//           <p className="lead text-center mt-3">
//             Book your favorite cosplayers for events
//           </p>
//         </div>
//       </div>

//       <div className="container py-5">
//         <div className="filter-section mb-5">
//           {step >= 1 && (
//             <div className="filter-card">
//               <h3 className="section-title">Select Date Range:</h3>
//               <DateRangePicker
//                 value={dateRange}
//                 onChange={handleDateRangeChange}
//                 format={dateFormat}
//                 disabledDate={disabledDate}
//                 className="custom-date-picker"
//               />
//             </div>
//           )}
//           {step >= 2 && (
//             <div className="filter-card">
//               <h3 className="section-title">Select Time Range:</h3>
//               <TimeRangePicker
//                 value={timeRange}
//                 onChange={handleTimeRangeChange}
//                 format={timeFormat}
//                 disabledTime={disabledTime}
//                 className="custom-time-picker"
//                 defaultValue={[
//                   dayjs("09:00", timeFormat),
//                   dayjs("17:00", timeFormat),
//                 ]}
//               />
//             </div>
//           )}
//           {step >= 3 && (
//             <div className="filter-card">
//               <h3 className="section-title">Enter Location:</h3>
//               <Input
//                 placeholder="Enter event location"
//                 value={location}
//                 onChange={handleLocationChange}
//                 prefix={<SearchOutlined />}
//                 className="custom-input"
//               />
//             </div>
//           )}
//           {step >= 4 && (
//             <div className="filter-card">
//               <h3 className="section-title">Enter Coupon (Optional):</h3>
//               <Input
//                 placeholder="Enter coupon ID (optional)"
//                 value={accountCouponId}
//                 onChange={handleCouponChange}
//                 className="custom-input"
//               />
//               <Button onClick={handleSkipCoupon} className="custom-btn-skip">
//                 Skip
//               </Button>
//             </div>
//           )}
//         </div>

//         {step >= 5 && (
//           <div className="character-selection-card mb-5">
//             <Row align="middle" gutter={16} className="mb-4">
//               <Col>
//                 <h3 className="section-title">Select Character:</h3>
//               </Col>
//               <Col>
//                 <Input
//                   placeholder="Search character"
//                   value={searchCharacter}
//                   onChange={(e) => {
//                     setSearchCharacter(e.target.value);
//                     setCurrentPage(1);
//                   }}
//                   prefix={<SearchOutlined />}
//                   className="custom-input-search"
//                 />
//               </Col>
//             </Row>
//             <Row gutter={[16, 16]}>
//               {paginatedCharacters.map((character) => (
//                 <Col xs={24} sm={12} md={8} key={character.id}>
//                   <Card
//                     hoverable
//                     className={`character-card ${
//                       currentCharacter?.characterId === character.id
//                         ? "active"
//                         : ""
//                     } ${
//                       requests.some((r) => r.characterId === character.id)
//                         ? "selected"
//                         : ""
//                     }`}
//                     onClick={() => handleCharacterSelect(character)}
//                   >
//                     <h4>{character.name}</h4>
//                     <p>
//                       Height: {character.minHeight} - {character.maxHeight} cm
//                     </p>
//                     <p>
//                       Weight: {character.minWeight} - {character.maxWeight} kg
//                     </p>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//             <Pagination
//               current={currentPage}
//               pageSize={characterPageSize}
//               total={filteredCharacters.length}
//               onChange={(page) => setCurrentPage(page)}
//               className="custom-pagination"
//             />
//           </div>
//         )}

//         {step >= 6 && (
//           <div className="cosplayer-selection">
//             <h3 className="section-title mb-4">
//               Available Cosplayers for {currentCharacter?.characterName}:
//             </h3>
//             <Checkbox
//               checked={selectAll}
//               onChange={handleSelectAll}
//               className="custom-checkbox mb-4"
//             >
//               Select All
//             </Checkbox>
//             <List
//               grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
//               dataSource={paginatedCosplayers}
//               renderItem={(cosplayer) => (
//                 <List.Item key={cosplayer.id}>
//                   <Card
//                     className={`cosplayer-item ${
//                       selectedCosplayers.includes(cosplayer.id)
//                         ? "selected"
//                         : ""
//                     }`}
//                     onClick={() => handleCosplayerSelect(cosplayer.id)}
//                   >
//                     <img
//                       src={cosplayer.avatar}
//                       alt={cosplayer.name}
//                       className="cosplayer-avatar"
//                       onError={(e) => (e.target.src = DEFAULT_AVATAR_URL)}
//                     />
//                     <h5>{cosplayer.name}</h5>
//                     <p className="description">{cosplayer.description}</p>
//                     <p>Height: {cosplayer.height} cm</p>
//                     <p>Weight: {cosplayer.weight} kg</p>
//                   </Card>
//                 </List.Item>
//               )}
//             />
//             <Pagination
//               current={currentCosplayerPage}
//               pageSize={cosplayerPageSize}
//               total={filteredCosplayers.length}
//               onChange={(page) => setCurrentCosplayerPage(page)}
//               className="custom-pagination"
//             />
//             <Button
//               type="primary"
//               onClick={handleAddCosplayers}
//               className="custom-btn-add mt-4"
//             >
//               Add Cosplayers & Select More
//             </Button>
//           </div>
//         )}
//         {requests.length > 0 && (
//           <div className="request-summary mt-5">
//             <h3 className="section-title mb-4">Selected Requests:</h3>
//             <List
//               dataSource={requests}
//               renderItem={(req) => (
//                 <List.Item key={req.characterId}>
//                   {req.characterName} - Cosplayers:{" "}
//                   {req.cosplayerIds
//                     .map((id) => cosplayers.find((c) => c.id === id)?.name)
//                     .join(", ")}
//                 </List.Item>
//               )}
//             />
//             <Button
//               type="primary"
//               size="large"
//               onClick={handleSendRequest}
//               className="custom-btn-send mt-4"
//             >
//               Send Request Hire Cosplayer
//             </Button>
//           </div>
//         )}
//         <Modal
//           title="Confirm Your Request"
//           visible={isModalVisible}
//           onOk={handleModalConfirm}
//           onCancel={() => setIsModalVisible(false)}
//           okText="Send Request"
//           cancelText="Cancel"
//           style={{
//             fontFamily: "'Poppins', sans-serif",
//           }}
//           bodyStyle={{
//             background: "#fff",
//             borderRadius: "0 0 15px 15px",
//             padding: "2rem",
//             boxShadow: "0 10px 30px rgba(34, 102, 138, 0.2)",
//           }}
//           headerStyle={{
//             background: "linear-gradient(135deg, #510545, #22668a)",
//             borderRadius: "15px 15px 0 0",
//             padding: "1.5rem",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               gap: "1.5rem",
//             }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "0.5rem",
//               }}
//             >
//               <label
//                 style={{
//                   fontSize: "1.1rem",
//                   fontWeight: 600,
//                   color: "#510545",
//                 }}
//               >
//                 Name:
//               </label>
//               <Input
//                 value={modalData.name}
//                 onChange={(e) =>
//                   setModalData({ ...modalData, name: e.target.value })
//                 }
//                 placeholder="Your account name"
//                 style={{
//                   borderRadius: "10px",
//                   border: "2px solid #22668a",
//                   padding: "0.5rem 1rem",
//                   fontSize: "1rem",
//                   transition: "border-color 0.3s ease",
//                 }}
//                 onFocus={(e) => (e.target.style.borderColor = "#510545")}
//                 onBlur={(e) => (e.target.style.borderColor = "#22668a")}
//               />
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "0.5rem",
//               }}
//             >
//               <label
//                 style={{
//                   fontSize: "1.1rem",
//                   fontWeight: 600,
//                   color: "#510545",
//                 }}
//               >
//                 Description:
//               </label>
//               <Input.TextArea
//                 value={modalData.description}
//                 onChange={(e) =>
//                   setModalData({ ...modalData, description: e.target.value })
//                 }
//                 placeholder="Enter description"
//                 style={{
//                   borderRadius: "10px",
//                   border: "2px solid #22668a",
//                   padding: "0.5rem 1rem",
//                   fontSize: "1rem",
//                   minHeight: "100px",
//                   transition: "border-color 0.3s ease",
//                 }}
//                 onFocus={(e) => (e.target.style.borderColor = "#510545")}
//                 onBlur={(e) => (e.target.style.borderColor = "#22668a")}
//               />
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "0.5rem",
//               }}
//             >
//               <label
//                 style={{
//                   fontSize: "1.1rem",
//                   fontWeight: 600,
//                   color: "#510545",
//                 }}
//               >
//                 Start DateTime:
//               </label>
//               <span
//                 style={{
//                   fontSize: "1rem",
//                   color: "#1a1a2e",
//                 }}
//               >
//                 {modalData.startDateTime}
//               </span>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "0.5rem",
//               }}
//             >
//               <label
//                 style={{
//                   fontSize: "1.1rem",
//                   fontWeight: 600,
//                   color: "#510545",
//                 }}
//               >
//                 End DateTime:
//               </label>
//               <span
//                 style={{
//                   fontSize: "1rem",
//                   color: "#1a1a2e",
//                 }}
//               >
//                 {modalData.endDateTime}
//               </span>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "0.5rem",
//               }}
//             >
//               <label
//                 style={{
//                   fontSize: "1.1rem",
//                   fontWeight: 600,
//                   color: "#510545",
//                 }}
//               >
//                 Location:
//               </label>
//               <span
//                 style={{
//                   fontSize: "1rem",
//                   color: "#1a1a2e",
//                 }}
//               >
//                 {location || "N/A"}
//               </span>
//             </div>
//             {/* <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "0.5rem",
//               }}
//             >
//               <label
//                 style={{
//                   fontSize: "1.1rem",
//                   fontWeight: 600,
//                   color: "#510545",
//                 }}
//               >
//                 Coupon ID:
//               </label>
//               <span
//                 style={{
//                   fontSize: "1rem",
//                   color: "#1a1a2e",
//                 }}
//               >
//                 {accountCouponId || "N/A"}
//               </span>
//             </div> */}
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "0.5rem",
//               }}
//             >
//               <label
//                 style={{
//                   fontSize: "1.1rem",
//                   fontWeight: 600,
//                   color: "#510545",
//                 }}
//               >
//                 Requested Characters:
//               </label>
//               <div
//                 style={{
//                   border: "1px solid #e6e9ee",
//                   borderRadius: "10px",
//                   padding: "0.5rem",
//                   background: "#f8f9fa",
//                 }}
//               >
//                 <List
//                   dataSource={modalData.listRequestCharacters}
//                   renderItem={(item, index) => (
//                     <List.Item
//                       key={index}
//                       actions={[
//                         <Button
//                           type="link"
//                           icon={<CloseOutlined />}
//                           onClick={() =>
//                             handleRemoveCosplayer(
//                               item.cosplayerId,
//                               item.characterId
//                             )
//                           }
//                           style={{
//                             color: "#510545",
//                           }}
//                         />,
//                       ]}
//                       style={{
//                         padding: "0.5rem",
//                         borderBottom:
//                           index < modalData.listRequestCharacters.length - 1
//                             ? "1px solid #e6e9ee"
//                             : "none",
//                       }}
//                     >
//                       <span
//                         style={{
//                           color: "#1a1a2e",
//                           fontSize: "0.95rem",
//                         }}
//                       >
//                         {
//                           cosplayers.find((c) => c.id === item.cosplayerId)
//                             ?.name
//                         }{" "}
//                         as{" "}
//                         {
//                           characters.find((c) => c.id === item.characterId)
//                             ?.name
//                         }{" "}
//                         - Quantity: {item.quantity} - Price:{" "}
//                         {cosplayerPrices[item.cosplayerId] || "Loading..."} VND
//                       </span>
//                     </List.Item>
//                   )}
//                 />
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 paddingTop: "1rem",
//                 borderTop: "2px solid #22668a",
//               }}
//             >
//               <label
//                 style={{
//                   fontSize: "1.2rem",
//                   fontWeight: 600,
//                   color: "#510545",
//                 }}
//               >
//                 Total Price:
//               </label>
//               <span
//                 style={{
//                   fontSize: "1.2rem",
//                   fontWeight: 600,
//                   color: "#510545",
//                 }}
//               >
//                 {Object.values(cosplayerPrices).reduce(
//                   (sum, price) => sum + price,
//                   0
//                 ) || 0}{" "}
//                 VND
//               </span>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default CosplayersPage;

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  DatePicker,
  TimePicker,
  List,
  Card,
  Row,
  Col,
  Checkbox,
  Pagination,
  Spin,
  Alert,
} from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import "../../styles/CosplayersPage.scss";
import HireCosplayerService from "../../services/HireCosplayerService/HireCosplayerService.js";
import { toast } from "react-toastify";

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

const DEFAULT_AVATAR_URL =
  "https://pm1.narvii.com/6324/0d7f51553b6ca0785d3912929088c25acc1bc53f_hq.jpg";

const CosplayersPage = () => {
  const [cosplayers, setCosplayers] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [location, setLocation] = useState("");
  const [accountCouponId, setAccountCouponId] = useState("");
  const [searchCharacter, setSearchCharacter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCosplayerPage, setCurrentCosplayerPage] = useState(1);
  const [step, setStep] = useState(1);
  const [requests, setRequests] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [filteredCosplayers, setFilteredCosplayers] = useState([]);
  const [selectedCosplayers, setSelectedCosplayers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    description: "",
    listRequestCharacters: [],
    name: "",
  });
  const [accountId, setAccountId] = useState(null);
  const [cosplayerPrices, setCosplayerPrices] = useState({});

  const serviceId = "S002";
  const packageId = "";
  const dateFormat = "DD/MM/YYYY";
  const timeFormat = "HH:mm";
  const characterPageSize = 10;
  const cosplayerPageSize = 9;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("You need to log in to use this page.");
      return;
    }

    setIsAuthenticated(true);

    try {
      const decoded = jwtDecode(accessToken);
      const accountName = decoded?.AccountName;
      const id = decoded?.Id;
      if (accountName) {
        setModalData((prev) => ({ ...prev, name: accountName }));
      }
      if (id) {
        setAccountId(id);
      }
    } catch (error) {
      console.error("Invalid token", error);
      setError("Invalid token. Please log in again.");
      return;
    }

    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const charactersData = await HireCosplayerService.getAllCharacters();
        const mappedCharacters = charactersData.map((character) => ({
          id: character.characterId,
          name: character.characterName,
          minHeight: character.minHeight,
          maxHeight: character.maxHeight,
          minWeight: character.minWeight,
          maxWeight: character.maxWeight,
        }));
        setCharacters(mappedCharacters);
      } catch (err) {
        setError("Unable to load characters. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch all cosplayers without filtering
    const fetchAllCosplayers = async () => {
      setLoading(true);
      try {
        const cosplayersData = await HireCosplayerService.getAllCosplayers();
        const mappedCosplayers = cosplayersData.map((cosplayer) => ({
          id: cosplayer.accountId,
          name: cosplayer.name,
          avatar: cosplayer.images[0]?.urlImage || DEFAULT_AVATAR_URL,
          description: cosplayer.description || "No description",
          height: cosplayer.height,
          weight: cosplayer.weight,
        }));
        setCosplayers(mappedCosplayers);
        setFilteredCosplayers(mappedCosplayers); // Display all cosplayers
      } catch (err) {
        setError("Unable to load cosplayers. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
    fetchAllCosplayers();
  }, []);

  // Comment out the original fetchCosplayersByCharacterAndTime function
  /*
  const fetchCosplayersByCharacterAndTime = async (characterId) => {
    if (!dateRange || !timeRange || !characterId) {
      setFilteredCosplayers([]);
      return;
    }

    setLoading(true);
    try {
      const startDateTime = `${timeRange[0].format(
        timeFormat
      )} ${dateRange[0].format(dateFormat)}`;
      const endDateTime = `${timeRange[1].format(
        timeFormat
      )} ${dateRange[1].format(dateFormat)}`;

      const cosplayersData =
        await HireCosplayerService.getAccountNoTaskByCharacterId(
          characterId,
          startDateTime,
          endDateTime
        );

      const mappedCosplayers = cosplayersData.map((cosplayer) => ({
        id: cosplayer.accountId,
        name: cosplayer.name,
        avatar: cosplayer.images[0]?.urlImage || DEFAULT_AVATAR_URL,
        description: cosplayer.description || "No description",
        height: cosplayer.height,
        weight: cosplayer.weight,
      }));

      const character = characters.find((char) => char.id === characterId);
      const filtered = mappedCosplayers.filter(
        (cosplayer) =>
          !requests.some((r) => r.cosplayerIds.includes(cosplayer.id)) &&
          cosplayer.height > character.minHeight &&
          cosplayer.height < character.maxHeight &&
          cosplayer.weight > character.minWeight &&
          cosplayer.weight < character.maxWeight
      );

      setCosplayers(mappedCosplayers);
      setFilteredCosplayers(filtered);
    } catch (err) {
      setError("Unable to load cosplayers. Please try again later.");
      console.error(err);
      setFilteredCosplayers([]);
    } finally {
      setLoading(false);
    }
  };
  */

  const calculateCosplayerPrice = (salaryIndex, quantity) => {
    return 100000 * salaryIndex * quantity;
  };

  useEffect(() => {
    const fetchCosplayerPrices = async () => {
      if (isModalVisible && modalData.listRequestCharacters.length > 0) {
        const prices = {};
        await Promise.all(
          modalData.listRequestCharacters.map(async (item) => {
            try {
              const cosplayerData =
                await HireCosplayerService.getNameCosplayerInRequestByCosplayerId(
                  item.cosplayerId
                );
              const salaryIndex = cosplayerData?.salaryIndex || 1;
              prices[item.cosplayerId] = calculateCosplayerPrice(
                salaryIndex,
                item.quantity
              );
            } catch (error) {
              console.warn(
                `Failed to fetch salaryIndex for cosplayer ${item.cosplayerId}:`,
                error
              );
              prices[item.cosplayerId] = calculateCosplayerPrice(
                1,
                item.quantity
              );
            }
          })
        );
        setCosplayerPrices(prices);
      }
    };
    fetchCosplayerPrices();
  }, [isModalVisible, modalData.listRequestCharacters]);

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchCharacter.toLowerCase())
  );

  const paginatedCharacters = filteredCharacters.slice(
    (currentPage - 1) * characterPageSize,
    currentPage * characterPageSize
  );

  const paginatedCosplayers = filteredCosplayers.slice(
    (currentCosplayerPage - 1) * cosplayerPageSize,
    currentCosplayerPage * cosplayerPageSize
  );

  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleDateRangeChange = (dates) => {
    if (!dates) {
      setDateRange(null);
      return;
    }

    const [start, end] = dates;
    if (end < start) {
      toast.error("End date must be equal to or after start date!");
      return;
    }

    setDateRange(dates);
    setStep(2);
  };

  const disabledTime = (type) => {
    const now = dayjs();
    const isToday = dateRange && dateRange[0]?.isSame(now, "day");

    return {
      disabledHours: () => {
        if (type === "start" && isToday) {
          return Array.from({ length: now.hour() }, (_, i) => i);
        }
        return [];
      },
      disabledMinutes: (selectedHour) => {
        if (type === "start" && isToday && selectedHour === now.hour()) {
          return Array.from({ length: now.minute() }, (_, i) => i);
        }
        return [];
      },
    };
  };

  const handleTimeRangeChange = (times) => {
    if (!times) {
      setTimeRange(null);
      return;
    }

    const [start, end] = times;
    const now = dayjs();

    const isStartToday = dateRange && dateRange[0]?.isSame(now, "day");
    if (isStartToday && start.isBefore(now)) {
      toast.error("Start time cannot be in the past!");
      return;
    }

    if (end.isBefore(start)) {
      toast.error("End time must be equal to or after start time!");
      return;
    }

    setTimeRange(times);
    setStep(3);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value.trim();
    if (!value) {
      toast.error("Location cannot be empty!");
      return;
    }
    setLocation(value);
    setStep(4);
  };

  const handleCouponChange = (e) => {
    setAccountCouponId(e.target.value);
  };

  const handleSkipCoupon = () => {
    setStep(5);
  };

  const handleCharacterSelect = (character) => {
    if (currentCharacter?.characterId === character.id) {
      setCurrentCharacter(null);
      setSelectedCosplayers([]);
      setSelectAll(false);
      setCurrentCosplayerPage(1);
      setStep(5);
    } else {
      setCurrentCharacter({
        characterId: character.id,
        characterName: character.name,
      });
      setSelectedCosplayers([]);
      setSelectAll(false);
      setCurrentCosplayerPage(1);
      setStep(6);
    }
  };

  const handleCosplayerSelect = (cosplayerId) => {
    setSelectedCosplayers((prev) =>
      prev.includes(cosplayerId)
        ? prev.filter((id) => id !== cosplayerId)
        : [...prev, cosplayerId]
    );
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    setSelectedCosplayers(
      e.target.checked ? paginatedCosplayers.map((c) => c.id) : []
    );
  };

  const handleAddCosplayers = () => {
    if (selectedCosplayers.length === 0) {
      toast.error("Please select at least one cosplayer!");
      return;
    }
    setRequests((prev) => [
      ...prev,
      {
        characterId: currentCharacter.characterId,
        characterName: currentCharacter.characterName,
        cosplayerIds: selectedCosplayers,
      },
    ]);
    setStep(5);
    setSelectedCosplayers([]);
    setSelectAll(false);
    setCurrentCosplayerPage(1);
    setCurrentCharacter(null);
  };

  const handleSendRequest = () => {
    if (!dateRange || !timeRange || !location) {
      toast.error(
        "Please complete all required fields (date, time, location)!"
      );
      return;
    }
    if (requests.length === 0) {
      toast.error("Please select at least one character and cosplayer!");
      return;
    }
    setModalData((prev) => ({
      ...prev,
      listRequestCharacters: requests.flatMap((req) =>
        req.cosplayerIds.map((cosplayerId) => ({
          characterId: req.characterId,
          cosplayerId,
          description: "",
          quantity: 1,
        }))
      ),
      startDateTime:
        timeRange && dateRange
          ? `${timeRange[0].format(timeFormat)} ${dateRange[0].format(
              dateFormat
            )}`
          : "N/A",
      endDateTime:
        timeRange && dateRange
          ? `${timeRange[1].format(timeFormat)} ${dateRange[1].format(
              dateFormat
            )}`
          : "N/A",
    }));
    setIsModalVisible(true);
  };

  const handleRemoveCosplayer = (cosplayerId, characterId) => {
    setModalData((prev) => ({
      ...prev,
      listRequestCharacters: prev.listRequestCharacters.filter(
        (item) =>
          !(
            item.cosplayerId === cosplayerId && item.characterId === characterId
          )
      ),
    }));
    setRequests((prev) =>
      prev
        .map((req) => ({
          ...req,
          cosplayerIds: req.cosplayerIds.filter((id) => id !== cosplayerId),
        }))
        .filter((req) => req.cosplayerIds.length > 0)
    );
    setCosplayerPrices((prev) => {
      const newPrices = { ...prev };
      delete newPrices[cosplayerId];
      return newPrices;
    });
  };

  const handleModalConfirm = async () => {
    if (modalData.listRequestCharacters.length === 0) {
      toast.error(
        "Please select at least one cosplayer before sending the request!"
      );
      return;
    }

    if (!modalData.name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    if (!accountId) {
      toast.error(
        "Cannot send request: User ID is missing. Please log in again."
      );
      return;
    }

    const totalPrice = Object.values(cosplayerPrices).reduce(
      (sum, price) => sum + price,
      0
    );
    const requestData = {
      accountId: accountId,
      name: modalData.name,
      description: modalData.description || " ",
      price: totalPrice,
      startDate: `${timeRange[0].format(timeFormat)} ${dateRange[0].format(
        dateFormat
      )}`,
      endDate: `${timeRange[1].format(timeFormat)} ${dateRange[1].format(
        dateFormat
      )}`,
      location: location,
      serviceId: "S002",
      packageId: " ",
      listRequestCharacters: modalData.listRequestCharacters.map((item) => ({
        characterId: item.characterId,
        cosplayerId: item.cosplayerId,
        description: " ",
        quantity: 1,
      })),
    };

    try {
      const response = await HireCosplayerService.sendRequestHireCosplayer(
        requestData
      );
      console.log("Request sent successfully:", response);
      setIsModalVisible(false);
      setStep(1);
      setDateRange(null);
      setTimeRange(null);
      setLocation("");
      setAccountCouponId("");
      setRequests([]);
      setSelectedCosplayers([]);
      setSelectAll(false);
      setCurrentCosplayerPage(1);
      setCurrentCharacter(null);
      setCosplayerPrices({});
      toast.success("Request sent successfully!");
    } catch (error) {
      console.error("Failed to send request:", error.message);
      toast.error(`Failed to send request: ${error.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="cosplay-rental-page min-vh-100"
        style={{ padding: "50px" }}
      >
        <Alert
          message="Login Error"
          description={error || "You need to log in to use this page."}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="cosplay-rental-page min-vh-100"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <Spin size="large" tip="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="cosplay-rental-page min-vh-100"
        style={{ padding: "50px" }}
      >
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="cosplay-rental-page min-vh-100">
      <div className="hero-section text-black py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Hire Cosplayers</h1>
          <p className="lead text-center mt-3">
            Book your favorite cosplayers for events
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="filter-section mb-5">
          {step >= 1 && (
            <div className="filter-card">
              <h3 className="section-title">Select Date Range:</h3>
              <DateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format={dateFormat}
                disabledDate={disabledDate}
                className="custom-date-picker"
              />
            </div>
          )}
          {step >= 2 && (
            <div className="filter-card">
              <h3 className="section-title">Select Time Range:</h3>
              <TimeRangePicker
                value={timeRange}
                onChange={handleTimeRangeChange}
                format={timeFormat}
                disabledTime={disabledTime}
                className="custom-time-picker"
                defaultValue={[
                  dayjs("09:00", timeFormat),
                  dayjs("17:00", timeFormat),
                ]}
              />
            </div>
          )}
          {step >= 3 && (
            <div className="filter-card">
              <h3 className="section-title">Enter Location:</h3>
              <Input
                placeholder="Enter event location"
                value={location}
                onChange={handleLocationChange}
                prefix={<SearchOutlined />}
                className="custom-input"
              />
            </div>
          )}
          {step >= 4 && (
            <div className="filter-card">
              <h3 className="section-title">Enter Coupon (Optional):</h3>
              <Input
                placeholder="Enter coupon ID (optional)"
                value={accountCouponId}
                onChange={handleCouponChange}
                className="custom-input"
              />
              <Button onClick={handleSkipCoupon} className="custom-btn-skip">
                Skip
              </Button>
            </div>
          )}
        </div>

        {step >= 5 && (
          <div className="character-selection-card mb-5">
            <Row align="middle" gutter={16} className="mb-4">
              <Col>
                <h3 className="section-title">Select Character:</h3>
              </Col>
              <Col>
                <Input
                  placeholder="Search character"
                  value={searchCharacter}
                  onChange={(e) => {
                    setSearchCharacter(e.target.value);
                    setCurrentPage(1);
                  }}
                  prefix={<SearchOutlined />}
                  className="custom-input-search"
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              {paginatedCharacters.map((character) => (
                <Col xs={24} sm={12} md={8} key={character.id}>
                  <Card
                    hoverable
                    className={`character-card ${
                      currentCharacter?.characterId === character.id
                        ? "active"
                        : ""
                    } ${
                      requests.some((r) => r.characterId === character.id)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleCharacterSelect(character)}
                  >
                    <h4>{character.name}</h4>
                    <p>
                      Height: {character.minHeight} - {character.maxHeight} cm
                    </p>
                    <p>
                      Weight: {character.minWeight} - {character.maxWeight} kg
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              current={currentPage}
              pageSize={characterPageSize}
              total={filteredCharacters.length}
              onChange={(page) => setCurrentPage(page)}
              className="custom-pagination"
            />
          </div>
        )}

        {step >= 6 && (
          <div className="cosplayer-selection">
            <h3 className="section-title mb-4">
              Available Cosplayers for {currentCharacter?.characterName}:
            </h3>
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
              className="custom-checkbox mb-4"
            >
              Select All
            </Checkbox>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
              dataSource={paginatedCosplayers}
              renderItem={(cosplayer) => (
                <List.Item key={cosplayer.id}>
                  <Card
                    className={`cosplayer-item ${
                      selectedCosplayers.includes(cosplayer.id)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleCosplayerSelect(cosplayer.id)}
                  >
                    <img
                      src={cosplayer.avatar}
                      alt={cosplayer.name}
                      className="cosplayer-avatar"
                      onError={(e) => (e.target.src = DEFAULT_AVATAR_URL)}
                    />
                    <h5>{cosplayer.name}</h5>
                    <p className="description">{cosplayer.description}</p>
                    <p>Height: {cosplayer.height} cm</p>
                    <p>Weight: {cosplayer.weight} kg</p>
                  </Card>
                </List.Item>
              )}
            />
            <Pagination
              current={currentCosplayerPage}
              pageSize={cosplayerPageSize}
              total={filteredCosplayers.length}
              onChange={(page) => setCurrentCosplayerPage(page)}
              className="custom-pagination"
            />
            <Button
              type="primary"
              onClick={handleAddCosplayers}
              className="custom-btn-add mt-4"
            >
              Add Cosplayers & Select More
            </Button>
          </div>
        )}
        {requests.length > 0 && (
          <div className="request-summary mt-5">
            <h3 className="section-title mb-4">Selected Requests:</h3>
            <List
              dataSource={requests}
              renderItem={(req) => (
                <List.Item key={req.characterId}>
                  {req.characterName} - Cosplayers:{" "}
                  {req.cosplayerIds
                    .map((id) => cosplayers.find((c) => c.id === id)?.name)
                    .join(", ")}
                </List.Item>
              )}
            />
            <Button
              type="primary"
              size="large"
              onClick={handleSendRequest}
              className="custom-btn-send mt-4"
            >
              Send Request Hire Cosplayer
            </Button>
          </div>
        )}
        <Modal
          title="Confirm Your Request"
          visible={isModalVisible}
          onOk={handleModalConfirm}
          onCancel={() => setIsModalVisible(false)}
          okText="Send Request"
          cancelText="Cancel"
          style={{
            fontFamily: "'Poppins', sans-serif",
          }}
          bodyStyle={{
            background: "#fff",
            borderRadius: "0 0 15px 15px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(34, 102, 138, 0.2)",
          }}
          headerStyle={{
            background: "linear-gradient(135deg, #510545, #22668a)",
            borderRadius: "15px 15px 0 0",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Name:
              </label>
              <Input
                value={modalData.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
                placeholder="Your account name"
                style={{
                  borderRadius: "10px",
                  border: "2px solid #22668a",
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#510545")}
                onBlur={(e) => (e.target.style.borderColor = "#22668a")}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Description:
              </label>
              <Input.TextArea
                value={modalData.description}
                onChange={(e) =>
                  setModalData({ ...modalData, description: e.target.value })
                }
                placeholder="Enter description"
                style={{
                  borderRadius: "10px",
                  border: "2px solid #22668a",
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                  minHeight: "100px",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#510545")}
                onBlur={(e) => (e.target.style.borderColor = "#22668a")}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Start DateTime:
              </label>
              <span
                style={{
                  fontSize: "1rem",
                  color: "#1a1a2e",
                }}
              >
                {modalData.startDateTime}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                End DateTime:
              </label>
              <span
                style={{
                  fontSize: "1rem",
                  color: "#1a1a2e",
                }}
              >
                {modalData.endDateTime}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Location:
              </label>
              <span
                style={{
                  fontSize: "1rem",
                  color: "#1a1a2e",
                }}
              >
                {location || "N/A"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Requested Characters:
              </label>
              <div
                style={{
                  border: "1px solid #e6e9ee",
                  borderRadius: "10px",
                  padding: "0.5rem",
                  background: "#f8f9fa",
                }}
              >
                <List
                  dataSource={modalData.listRequestCharacters}
                  renderItem={(item, index) => (
                    <List.Item
                      key={index}
                      actions={[
                        <Button
                          type="link"
                          icon={<CloseOutlined />}
                          onClick={() =>
                            handleRemoveCosplayer(
                              item.cosplayerId,
                              item.characterId
                            )
                          }
                          style={{
                            color: "#510545",
                          }}
                        />,
                      ]}
                      style={{
                        padding: "0.5rem",
                        borderBottom:
                          index < modalData.listRequestCharacters.length - 1
                            ? "1px solid #e6e9ee"
                            : "none",
                      }}
                    >
                      <span
                        style={{
                          color: "#1a1a2e",
                          fontSize: "0.95rem",
                        }}
                      >
                        {
                          cosplayers.find((c) => c.id === item.cosplayerId)
                            ?.name
                        }{" "}
                        as{" "}
                        {
                          characters.find((c) => c.id === item.characterId)
                            ?.name
                        }{" "}
                        - Quantity: {item.quantity} - Price:{" "}
                        {cosplayerPrices[item.cosplayerId] || "Loading..."} VND
                      </span>
                    </List.Item>
                  )}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "1rem",
                borderTop: "2px solid #22668a",
              }}
            >
              <label
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Total Price:
              </label>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                {Object.values(cosplayerPrices).reduce(
                  (sum, price) => sum + price,
                  0
                ) || 0}{" "}
                VND
              </span>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CosplayersPage;

// cái trên tạm thời là không lọc cosplay gì cả
// cái dưới là lọc theo cosplay và thời gian
