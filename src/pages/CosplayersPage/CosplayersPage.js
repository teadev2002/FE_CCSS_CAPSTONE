/// validate quantity
// import React, { useState, useEffect, useMemo } from "react";
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
//   Select,
//   Rate,
//   Radio,
//   Flex,
// } from "antd";
// import {
//   LoadingOutlined,
//   SearchOutlined,
//   CloseOutlined,
// } from "@ant-design/icons";
// import { jwtDecode } from "jwt-decode";
// import dayjs from "dayjs";
// import "../../styles/CosplayersPage.scss";
// import HireCosplayerService from "../../services/HireCosplayerService/HireCosplayerService.js";
// import LocationPickerService from "../../components/LocationPicker/LocationPickerService.js";
// import { toast } from "react-toastify";

// const { RangePicker: DateRangePicker } = DatePicker;
// const { RangePicker: TimeRangePicker } = TimePicker;
// const { Option } = Select;

// const DEFAULT_AVATAR_URL =
//   "https://pm1.narvii.com/6324/0d7f51553b6ca0785d3912929088c25acc1bc53f_hq.jpg";

// const CosplayersPage = () => {
//   const [cosplayers, setCosplayers] = useState([]);
//   const [characters, setCharacters] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [dateRange, setDateRange] = useState(null);
//   const [timeRanges, setTimeRanges] = useState({});
//   const [location, setLocation] = useState("");
//   const [districts, setDistricts] = useState([]);
//   const [streets, setStreets] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedStreet, setSelectedStreet] = useState(null);
//   const [characterSearchQuery, setCharacterSearchQuery] = useState("");
//   const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
//   const [currentCosplayerPage, setCurrentCosplayerPage] = useState(1);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedRequests, setSelectedRequests] = useState([]);
//   const [currentCharacter, setCurrentCharacter] = useState(null);
//   const [filteredCosplayers, setFilteredCosplayers] = useState([]);
//   const [selectedCosplayerIds, setSelectedCosplayerIds] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     description: "",
//     listRequestCharacters: [],
//     name: "",
//   });
//   const [accountId, setAccountId] = useState(null);
//   const [cosplayerPrices, setCosplayerPrices] = useState({});
//   const [cosplayerDataCache, setCosplayerDataCache] = useState({});
//   const [sortBy, setSortBy] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [depositPercentage, setDepositPercentage] = useState("50");
//   const [houseNumber, setHouseNumber] = useState("");
//   const serviceId = "S002";
//   const packageId = "";
//   const dateFormat = "DD/MM/YYYY";
//   const timeFormat = "HH:mm";
//   const characterPageSize = 9;
//   const cosplayerPageSize = 9;

//   useEffect(() => {
//     const fetchDistricts = async () => {
//       try {
//         const districtsData = await LocationPickerService.getDistricts();
//         setDistricts(districtsData);
//       } catch (err) {
//         console.error("Failed to fetch districts:", err);
//         console.log("Failed to load districts. Please try again.");
//       }
//     };
//     fetchDistricts();
//   }, []);

//   useEffect(() => {
//     const fetchStreets = async () => {
//       if (selectedDistrict) {
//         try {
//           const streetsData = await LocationPickerService.getStreets(
//             selectedDistrict
//           );
//           setStreets(streetsData);
//         } catch (err) {
//           console.error("Failed to fetch streets:", err);
//           console.log("Failed to load streets. Please try again.");
//           setStreets([]);
//         }
//       } else {
//         setStreets([]);
//         setSelectedStreet(null);
//       }
//     };
//     fetchStreets();
//   }, [selectedDistrict]);

//   useEffect(() => {
//     if (selectedDistrict && selectedStreet && houseNumber.trim()) {
//       const districtName =
//         districts.find((d) => d.id === selectedDistrict)?.name || "";
//       const streetName =
//         streets.find((s) => s.id === selectedStreet)?.name || "";
//       const newLocation = `${houseNumber}, ${streetName}, ${districtName}, TP.HCM`;
//       setLocation(newLocation);
//       setCurrentStep(5);
//     } else {
//       setLocation("");
//     }
//   }, [selectedDistrict, selectedStreet, houseNumber, districts, streets]);

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       setError("You need to log in to access this page.");
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
//       setIsLoading(true);
//       try {
//         const charactersData = await HireCosplayerService.getAllCharacters();
//         const mappedCharacters = charactersData
//           .filter((character) => character.quantity >= 1) // Lọc nhân vật có quantity >= 1
//           .map((character) => ({
//             id: character.characterId,
//             name: character.characterName,
//             minHeight: character.minHeight,
//             maxHeight: character.maxHeight,
//             minWeight: character.minWeight,
//             maxWeight: character.maxWeight,
//             price: character.price,
//             quantity: character.quantity,
//           }));
//         setCharacters(mappedCharacters);
//       } catch (err) {
//         setError("Unable to load characters. Please try again later.");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCharacters();
//   }, []);
//   const fetchCosplayersByCharacterAndTime = async (characterId) => {
//     if (!dateRange || Object.keys(timeRanges).length === 0 || !characterId) {
//       setFilteredCosplayers([]);
//       setCosplayers([]);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const dates = [];
//       const startDate = dateRange[0];
//       const endDate = dateRange[1];
//       const days = endDate.diff(startDate, "day") + 1;

//       for (let i = 0; i < days; i++) {
//         const day = startDate.add(i, "day").format(dateFormat);
//         const [startTime, endTime] = timeRanges[day] || [];
//         if (startTime && endTime) {
//           dates.push({
//             startDate: `${startTime.format(timeFormat)} ${day}`,
//             endDate: `${endTime.format(timeFormat)} ${day}`,
//           });
//         }
//       }

//       const character = characters.find((char) => char.id === characterId);
//       if (!character) {
//         throw new Error("Character not found");
//       }

//       const existingCosplayerIds = selectedRequests
//         .flatMap((req) => req.cosplayers)
//         .map((cosplayer) => cosplayer.id);

//       const requestData = {
//         characterId: character.id,
//         dates: dates,
//         accountId:
//           selectedCosplayerIds.length > 0 ? selectedCosplayerIds.join(",") : "",
//       };

//       const cosplayersData = await HireCosplayerService.ChangeCosplayer(
//         requestData
//       );

//       const uniqueCosplayers = cosplayersData.reduce((acc, cosplayer) => {
//         if (!acc.some((c) => c.accountId === cosplayer.accountId)) {
//           acc.push(cosplayer);
//         }
//         return acc;
//       }, []);

//       const mappedCosplayers = uniqueCosplayers.map((cosplayer) => ({
//         id: cosplayer.accountId,
//         name: cosplayer.name,
//         avatar: cosplayer.images[0]?.urlImage || DEFAULT_AVATAR_URL,
//         description: cosplayer.description || "No description",
//         height: cosplayer.height,
//         weight: cosplayer.weight,
//         salaryIndex: cosplayer.salaryIndex,
//         averageStar: cosplayer.averageStar || 0,
//       }));

//       const newCache = { ...cosplayerDataCache };
//       uniqueCosplayers.forEach((cosplayer) => {
//         newCache[cosplayer.accountId] = {
//           salaryIndex: cosplayer.salaryIndex || 1,
//           name: cosplayer.name,
//         };
//       });
//       setCosplayerDataCache(newCache);

//       const filtered = mappedCosplayers.filter(
//         (cosplayer) =>
//           !existingCosplayerIds.includes(cosplayer.id) &&
//           cosplayer.height >= character.minHeight &&
//           cosplayer.height <= character.maxHeight &&
//           cosplayer.weight >= character.minWeight &&
//           cosplayer.weight <= character.maxWeight
//       );

//       setCosplayers(mappedCosplayers);
//       setFilteredCosplayers(filtered);
//     } catch (err) {
//       setError("Unable to load cosplayers. Please try again later.");
//       console.error(err);
//       setFilteredCosplayers([]);
//       setCosplayers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const calculateTotalHours = useMemo(() => {
//     if (!dateRange || !timeRanges) return 0;

//     let totalHours = 0;
//     const startDate = dateRange[0];
//     const endDate = dateRange[1];
//     const days = endDate.diff(startDate, "day") + 1;

//     for (let i = 0; i < days; i++) {
//       const day = startDate.add(i, "day").format(dateFormat);
//       const [startTime, endTime] = timeRanges[day] || [];
//       if (startTime && endTime) {
//         totalHours += endTime.diff(startTime, "hour", true);
//       }
//     }
//     return totalHours;
//   }, [dateRange, timeRanges]);

//   const calculateTotalDays = useMemo(() => {
//     if (!dateRange) return 0;

//     const startDate = dateRange[0];
//     const endDate = dateRange[1];
//     return endDate.diff(startDate, "day") + 1;
//   }, [dateRange]);

//   const calculateUnitPrice = (cosplayer, characterId) => {
//     const character = characters.find((char) => char.id === characterId);
//     if (!character || !cosplayer.salaryIndex) return 0;

//     const totalHours = calculateTotalHours;
//     const totalDays = calculateTotalDays;
//     const unitPrice =
//       totalHours * cosplayer.salaryIndex + totalDays * character.price;
//     return unitPrice;
//   };

//   useEffect(() => {
//     if (sortBy && filteredCosplayers.length > 0) {
//       const sortedCosplayers = [...filteredCosplayers].sort((a, b) => {
//         const valueA = a[sortBy];
//         const valueB = b[sortBy];
//         return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
//       });
//       setFilteredCosplayers(sortedCosplayers);
//     }
//   }, [sortBy, sortOrder]);

//   const handleCancelSort = () => {
//     setSortBy("");
//     setSortOrder("asc");
//     if (currentCharacter?.characterId) {
//       fetchCosplayersByCharacterAndTime(currentCharacter.characterId);
//     }
//   };

//   useEffect(() => {
//     const fetchCosplayerPrices = () => {
//       if (isModalVisible && modalData.listRequestCharacters.length > 0) {
//         const prices = {};
//         modalData.listRequestCharacters.forEach((item) => {
//           const cosplayerData = cosplayerDataCache[item.cosplayerId];
//           const salaryIndex = cosplayerData?.salaryIndex || 1;
//           const character = characters.find(
//             (char) => char.id === item.characterId
//           );
//           const totalHours = calculateTotalHours;
//           const totalDays = calculateTotalDays;
//           prices[item.cosplayerId] =
//             (totalHours * salaryIndex + totalDays * (character?.price || 0)) *
//             item.quantity;
//         });
//         setCosplayerPrices(prices);
//       }
//     };
//     fetchCosplayerPrices();
//   }, [isModalVisible, modalData.listRequestCharacters, cosplayerDataCache]);

//   const filteredCharacters = characters.filter(
//     (char) =>
//       char.name.toLowerCase().includes(characterSearchQuery.toLowerCase()) &&
//       char.quantity >= 1
//   );

//   const paginatedCharacters = filteredCharacters.slice(
//     (currentCharacterPage - 1) * characterPageSize,
//     currentCharacterPage * characterPageSize
//   );

//   const paginatedCosplayers = filteredCosplayers.slice(
//     (currentCosplayerPage - 1) * cosplayerPageSize,
//     currentCosplayerPage * cosplayerPageSize
//   );

//   const disabledDate = (current) => {
//     if (!current) return false;

//     const today = dayjs().startOf("day");
//     const minStartDate = today.add(4, "day");
//     const maxStartDate = minStartDate.add(13, "day");

//     if (current < minStartDate) {
//       return true;
//     }

//     if (!dateRange || !dateRange[0]) {
//       return current > maxStartDate;
//     }

//     const startDate = dateRange[0];
//     const maxEndDate = startDate.add(13, "day");
//     return current < startDate || current > maxEndDate;
//   };

//   const disabledTime = () => {
//     const startHour = 8;
//     const endHour = 22;

//     return {
//       disabledHours: () => {
//         const hours = [];
//         for (let i = 0; i < 24; i++) {
//           if (i < startHour || i > endHour) {
//             hours.push(i);
//           }
//         }
//         return hours;
//       },
//       disabledMinutes: (selectedHour) => {
//         if (selectedHour === startHour || selectedHour === endHour) {
//           return Array.from({ length: 60 }, (_, i) => i).filter(
//             (minute) => minute !== 0
//           );
//         }
//         return [];
//       },
//     };
//   };

//   const handleDateRangeChange = (dates) => {
//     if (!dates) {
//       setDateRange(null);
//       setTimeRanges({});
//       return;
//     }

//     const [start, end] = dates;
//     const today = dayjs().startOf("day");
//     const minStartDate = today.add(4, "day");
//     const maxStartDate = minStartDate.add(13, "day");

//     if (start.isBefore(minStartDate, "day")) {
//       toast.warn("Start date must be at least 4 days from today!");
//       setDateRange(null);
//       return;
//     }

//     if (start.isAfter(maxStartDate, "day")) {
//       toast.error("Start date cannot be more than 14 days ");
//       setDateRange(null);
//       return;
//     }

//     if (end.isBefore(start, "day")) {
//       toast.warn("End date must be on or after start date!");
//       setDateRange(null);
//       return;
//     }

//     const maxEndDate = start.add(13, "day");
//     if (end.isAfter(maxEndDate, "day")) {
//       toast.warn("End date cannot be more than 14 days from start date!");
//       setDateRange(null);
//       return;
//     }

//     const daysDifference = end.diff(start, "day") + 1;
//     if (daysDifference > 5) {
//       toast.warn("Rental period cannot exceed 5 days!");
//       setDateRange(null);
//       return;
//     }

//     setDateRange(dates);
//     setTimeRanges({});
//     setCurrentStep(2);
//   };

//   const handleDistrictChange = (value) => {
//     setSelectedDistrict(value);
//     setSelectedStreet(null);
//     if (!value) {
//       setLocation("");
//       setStreets([]);
//     }
//   };

//   const handleStreetChange = (value) => {
//     setSelectedStreet(value);
//     if (!value) {
//       setLocation("");
//     }
//   };

//   const handleCharacterSelect = (character) => {
//     if (currentCharacter?.characterId === character.id) {
//       setCurrentCharacter(null);
//       setSelectedCosplayerIds([]);

//       setCurrentCosplayerPage(1);
//       setCurrentStep(5);
//       setFilteredCosplayers([]);
//       setCosplayers([]);
//       setSortBy("");
//       setSortOrder("asc");
//     } else {
//       setCurrentCharacter({
//         characterId: character.id,
//         characterName: character.name,
//       });
//       setSelectedCosplayerIds([]);

//       setCurrentCosplayerPage(1);
//       fetchCosplayersByCharacterAndTime(character.id);
//       setCurrentStep(6);
//       setSortBy("");
//       setSortOrder("asc");
//     }
//   };

//   const handleCosplayerSelect = (cosplayerId) => {
//     const character = characters.find(
//       (char) => char.id === currentCharacter?.characterId
//     );
//     if (!character) {
//       console.log("Nhân vật không được tìm thấy!");
//       return;
//     }

//     const existingCosplayersForCharacter = selectedRequests
//       .filter((req) => req.characterId === currentCharacter.characterId)
//       .flatMap((req) => req.cosplayers).length;

//     const currentSelectedCount = selectedCosplayerIds.length;
//     const isSelecting = !selectedCosplayerIds.includes(cosplayerId);

//     if (
//       isSelecting &&
//       currentSelectedCount + existingCosplayersForCharacter >=
//         character.quantity
//     ) {
//       toast.warn(
//         `You can only select up to ${character.quantity} cosplayers for character ${character.name}! `
//       );
//       return;
//     }

//     setSelectedCosplayerIds((prev) =>
//       prev.includes(cosplayerId)
//         ? prev.filter((id) => id !== cosplayerId)
//         : [...prev, cosplayerId]
//     );
//   };

//   const handleAddCosplayers = () => {
//     if (selectedCosplayerIds.length === 0) {
//       toast.warn("Please select at least one cosplayer!");
//       return;
//     }

//     const character = characters.find(
//       (char) => char.id === currentCharacter?.characterId
//     );
//     if (!character) {
//       console.log("Nhân vật không được tìm thấy!");
//       return;
//     }

//     // Đếm số cosplayer đã chọn cho nhân vật này trong selectedRequests
//     const existingCosplayersForCharacter = selectedRequests
//       .filter((req) => req.characterId === currentCharacter.characterId)
//       .flatMap((req) => req.cosplayers).length;

//     const totalSelectedCosplayers =
//       existingCosplayersForCharacter + selectedCosplayerIds.length;

//     if (totalSelectedCosplayers > character.quantity) {
//       toast.warn(
//         `You can only select up to ${character.quantity} cosplayers for character ${character.name}!`
//       );
//       return;
//     }

//     const selectedCosplayerDetails = selectedCosplayerIds.map((id) => {
//       const cosplayer = filteredCosplayers.find((c) => c.id === id);
//       return { id, name: cosplayer.name, salaryIndex: cosplayer.salaryIndex };
//     });

//     setSelectedRequests((prev) => [
//       ...prev,
//       {
//         characterId: currentCharacter.characterId,
//         characterName: currentCharacter.characterName,
//         cosplayers: selectedCosplayerDetails,
//       },
//     ]);

//     const newPrices = { ...cosplayerPrices };
//     selectedCosplayerDetails.forEach((cosplayer) => {
//       const character = characters.find(
//         (char) => char.id === currentCharacter.characterId
//       );
//       const totalHours = calculateTotalHours;
//       const totalDays = calculateTotalDays;
//       newPrices[cosplayer.id] =
//         (totalHours * cosplayer.salaryIndex +
//           totalDays * (character?.price || 0)) *
//         1;
//     });
//     setCosplayerPrices(newPrices);

//     setCurrentStep(5);
//     setSelectedCosplayerIds([]);

//     setCurrentCosplayerPage(1);
//     setCurrentCharacter(null);
//     setFilteredCosplayers([]);
//     setCosplayers([]);
//     setSortBy("");
//     setSortOrder("asc");
//   };

//   const handleSendRequest = () => {
//     if (!dateRange || Object.keys(timeRanges).length === 0 || !location) {
//       toast.warn(
//         "Please fill in all required fields (date, time per day, house number, district, and street)!"
//       );
//       return;
//     }
//     if (!houseNumber.trim()) {
//       toast.error("Please enter house number!");
//       return;
//     }
//     if (selectedRequests.length === 0) {
//       console.log("Please select at least one character and cosplayer!");
//       return;
//     }
//     setModalData((prev) => ({
//       ...prev,
//       listRequestCharacters: selectedRequests.flatMap((req) =>
//         req.cosplayers.map((cosplayer) => ({
//           characterId: req.characterId,
//           cosplayerId: cosplayer.id,
//           description: "",
//           quantity: 1,
//         }))
//       ),
//       startDate: dateRange[0].format(dateFormat),
//       endDate: dateRange[1].format(dateFormat),
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
//     setSelectedRequests((prev) =>
//       prev
//         .map((req) => ({
//           ...req,
//           cosplayers: req.cosplayers.filter(
//             (cosplayer) => cosplayer.id !== cosplayerId
//           ),
//         }))
//         .filter((req) => req.cosplayers.length > 0)
//     );
//     setCosplayerPrices((prev) => {
//       const newPrices = { ...prev };
//       delete newPrices[cosplayerId];
//       return newPrices;
//     });
//   };

//   const applySameTimeToAll = () => {
//     if (!dateRange || !dateRange[0] || !dateRange[1]) {
//       toast.warn("Please select a valid date range!");
//       return;
//     }

//     const totalDays = dateRange[1].diff(dateRange[0], "day") + 1;
//     if (totalDays <= 1) {
//       toast.info("This feature is only available for multiple days!");
//       return;
//     }

//     const firstDay = dateRange[0].format(dateFormat);
//     const firstTimeRange = timeRanges[firstDay];

//     if (!firstTimeRange || !firstTimeRange[0] || !firstTimeRange[1]) {
//       toast.warn("Please select a valid time range for the first day!");
//       return;
//     }

//     const startTime = firstTimeRange[0]; // Define startTime
//     const endTime = firstTimeRange[1]; // Define endTime

//     if (endTime.isBefore(startTime)) {
//       toast.warn("End time must be after start time for the first day!");
//       return;
//     }

//     if (endTime.isSame(startTime)) {
//       toast.warn(
//         "End time cannot be the same as start time for the first day!"
//       );
//       return;
//     }

//     const newTimeRanges = { ...timeRanges };
//     for (let i = 0; i < totalDays; i++) {
//       const day = dateRange[0].add(i, "day").format(dateFormat);
//       newTimeRanges[day] = [dayjs(startTime), dayjs(endTime)];
//     }

//     setTimeRanges(newTimeRanges);

//     const allDaysFilled = Array.from({ length: totalDays }, (_, j) =>
//       dateRange[0].add(j, "day").format(dateFormat)
//     ).every((d) => {
//       const range = newTimeRanges[d];
//       return (
//         range &&
//         Array.isArray(range) &&
//         range.length === 2 &&
//         range[0] &&
//         range[1] &&
//         !range[1].isSame(range[0])
//       );
//     });

//     if (allDaysFilled) {
//       setCurrentStep(3);
//     }

//     toast.success("Time ranges applied to all days!");
//   };

//   const handleModalConfirm = async () => {
//     if (modalData.listRequestCharacters.length === 0) {
//       toast.warn(
//         "Please select at least one cosplayer before submitting a request!"
//       );
//       return;
//     }

//     if (!modalData.name.trim()) {
//       toast.warn("Name cannot be blank!");
//       return;
//     }

//     if (!accountId) {
//       console.log(
//         "Không thể gửi yêu cầu: Thiếu ID người dùng. Vui lòng đăng nhập lại."
//       );
//       return;
//     }

//     if (!dateRange || !dateRange[0] || !dateRange[1]) {
//       toast.warn("Please select a valid time period!");
//       return;
//     }

//     // Kiểm tra tổng số cosplayer cho mỗi nhân vật
//     const characterCounts = {};
//     modalData.listRequestCharacters.forEach((item) => {
//       characterCounts[item.characterId] =
//         (characterCounts[item.characterId] || 0) + 1;
//     });

//     for (const [characterId, count] of Object.entries(characterCounts)) {
//       const character = characters.find((c) => c.id === characterId);
//       if (character && count > character.quantity) {
//         toast.warn(
//           `The number of cosplayers for character ${character.name} exceeds inventory (${character.quantity})!`
//         );
//         return;
//       }
//     }

//     const startDate = dateRange[0];
//     const endDate = dateRange[1];
//     const today = dayjs().startOf("day");
//     const minStartDate = today.add(4, "day");
//     const maxStartDate = minStartDate.add(13, "day");

//     if (startDate.isBefore(minStartDate, "day")) {
//       toast.error("Start date must be at least 4 days from today!");
//       setIsSubmitting(false);
//       return;
//     }

//     if (startDate.isAfter(maxStartDate, "day")) {
//       toast.warn(
//         "Start date not more than 14 days from after 3 days from today"
//       );
//       setIsSubmitting(false);
//       return;
//     }

//     if (endDate.isBefore(startDate, "day")) {
//       toast.warn("The end date must be from the start date onwards!");
//       setIsSubmitting(false);
//       return;
//     }

//     const maxEndDate = startDate.add(13, "day");
//     if (endDate.isAfter(maxEndDate, "day")) {
//       toast.warn(
//         "The end date must not be more than 14 days from the start date!"
//       );
//       setIsSubmitting(false);
//       return;
//     }

//     const diffDays = endDate.diff(startDate, "day") + 1;
//     if (diffDays > 5) {
//       toast.error("Rental period must not exceed 5 days!");
//       setIsSubmitting(false);
//       return;
//     }

//     const allDays = Array.from({ length: diffDays }, (_, i) =>
//       startDate.add(i, "day").format(dateFormat)
//     );
//     const missingTimeRanges = allDays.filter(
//       (day) => !timeRanges[day] || !timeRanges[day][0] || !timeRanges[day][1]
//     );
//     if (missingTimeRanges.length > 0) {
//       toast.error(
//         `Please select a time period for the following days: ${missingTimeRanges.join(
//           ", "
//         )}`
//       );
//       setIsSubmitting(false);
//       return;
//     }

//     // Check for identical startTime and endTime
//     const sameTimeRanges = allDays.filter((day) => {
//       const [startTime, endTime] = timeRanges[day] || [];
//       return startTime && endTime && startTime.isSame(endTime);
//     });
//     if (sameTimeRanges.length > 0) {
//       toast.info(
//         `Start and end times cannot overlap for the following days.: ${sameTimeRanges.join(
//           ", "
//         )}`
//       );
//       setIsSubmitting(false);
//       return;
//     }

//     const totalPrice = Object.values(cosplayerPrices).reduce(
//       (sum, price) => sum + price,
//       0
//     );

//     const requestData = {
//       accountId: accountId,
//       name: modalData.name,
//       description: modalData.description || "No description",
//       price: totalPrice,
//       startDate: startDate.format(dateFormat),
//       endDate: endDate.format(dateFormat),
//       location: location,
//       deposit: depositPercentage,
//       charactersRentCosplayers: modalData.listRequestCharacters.map((item) => {
//         const listRequestDates = [];
//         for (let i = 0; i < diffDays; i++) {
//           const day = startDate.add(i, "day").format(dateFormat);
//           const [startTime, endTime] = timeRanges[day] || [];
//           if (startTime && endTime) {
//             listRequestDates.push({
//               startDate: `${startTime.format(timeFormat)} ${day}`,
//               endDate: `${endTime.format(timeFormat)} ${day}`,
//             });
//           }
//         }
//         return {
//           characterId: item.characterId,
//           cosplayerId: item.cosplayerId,
//           description: item.description || "No description",
//           listRequestDates,
//         };
//       }),
//     };

//     setIsSubmitting(true);
//     try {
//       console.log("Sending request at:", performance.now(), "ms");
//       console.log("requestData:", JSON.stringify(requestData, null, 2));
//       const response = await HireCosplayerService.NewSendRequestHireCosplayer(
//         requestData
//       );
//       console.log("Request completed at:", performance.now(), "ms");
//       console.log("Yêu cầu đã được gửi thành công:", response);
//       toast.success("Request sent successfully!", {
//         autoClose: 3000,
//       });
//       setIsModalVisible(false);
//       setSelectedRequests([]);
//       setDateRange(null);
//       setTimeRanges({});
//       setLocation("");
//       setSelectedDistrict(null);
//       setSelectedStreet(null);
//       setSelectedCosplayerIds([]);

//       setCurrentCosplayerPage(1);
//       setCurrentCharacter(null);
//       setCosplayers([]);
//       setFilteredCosplayers([]);
//       setCosplayerPrices({});
//       setCosplayerDataCache({});
//       setSortBy("");
//       setSortOrder("asc");
//       setDepositPercentage("50");
//       setCurrentStep(1);
//     } catch (error) {
//       console.error("Gửi yêu cầu thất bại:", error.message);
//       toast.error(`Gửi yêu cầu thất bại: ${error.message}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div
//         className="cosplay-rental-page min-vh-100"
//         style={{ padding: "50px" }}
//       >
//         <Alert
//           message="Authentication Error"
//           description={error || "You need to log in to access this page."}
//           type="error"
//           showIcon
//         />
//       </div>
//     );
//   }

//   if (isLoading) {
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
//             Book your favorite cosplayers for your event
//           </p>
//         </div>
//       </div>

//       <div className="container py-5">
//         <div className="filter-section mb-5">
//           {currentStep >= 1 && (
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
//           {currentStep >= 2 && dateRange && (
//             <div className="filter-card">
//               <Flex
//                 align="center"
//                 justify="space-between"
//                 style={{ marginBottom: "16px" }}
//               >
//                 <h3 className="section-title">Select Time for Each Day:</h3>
//                 {dateRange[1].diff(dateRange[0], "day") + 1 > 1 && (
//                   <Button
//                     type="primary"
//                     onClick={applySameTimeToAll}
//                     disabled={
//                       !timeRanges[dateRange[0].format(dateFormat)]?.[0] ||
//                       !timeRanges[dateRange[0].format(dateFormat)]?.[1] ||
//                       timeRanges[dateRange[0].format(dateFormat)]?.[1].isBefore(
//                         timeRanges[dateRange[0].format(dateFormat)]?.[0]
//                       ) ||
//                       timeRanges[dateRange[0].format(dateFormat)]?.[1].isSame(
//                         timeRanges[dateRange[0].format(dateFormat)]?.[0]
//                       )
//                     }
//                   >
//                     Same Time
//                   </Button>
//                 )}
//               </Flex>
//               {Array.from(
//                 { length: dateRange[1].diff(dateRange[0], "day") + 1 },
//                 (_, i) => {
//                   const day = dateRange[0].add(i, "day").format(dateFormat);
//                   return (
//                     <div
//                       key={day}
//                       style={{
//                         marginBottom: "16px",
//                         textAlign: "center",
//                         flexDirection: "row",
//                         margin: "0 15px",
//                         alignItems: "center",
//                       }}
//                     >
//                       <h5>{day}</h5>
//                       <Flex gap={8} align="center" justify="center">
//                         <TimeRangePicker
//                           style={{ width: "103%" }}
//                           value={timeRanges[day] || null}
//                           onChange={(times) => {
//                             if (times && times[0] && times[1]) {
//                               const startTime = times[0]; // Define startTime
//                               const endTime = times[1]; // Define endTime
//                               if (endTime.isBefore(startTime)) {
//                                 toast.warn(
//                                   "End time must be after start time!"
//                                 );
//                                 return;
//                               }
//                               if (endTime.isSame(startTime)) {
//                                 console.log(
//                                   "End time cannot be the same as start time!"
//                                 );
//                                 return;
//                               }
//                               const newTimeRanges = {
//                                 ...timeRanges,
//                                 [day]: [startTime, endTime],
//                               };
//                               setTimeRanges(newTimeRanges);

//                               const totalDays =
//                                 dateRange[1].diff(dateRange[0], "day") + 1;
//                               const allDays = Array.from(
//                                 { length: totalDays },
//                                 (_, j) =>
//                                   dateRange[0].add(j, "day").format(dateFormat)
//                               );
//                               const allDaysFilled = allDays.every((d) => {
//                                 const range = newTimeRanges[d];
//                                 return (
//                                   range &&
//                                   Array.isArray(range) &&
//                                   range.length === 2 &&
//                                   range[0] &&
//                                   range[1] &&
//                                   !range[1].isSame(range[0])
//                                 );
//                               });

//                               if (allDaysFilled) {
//                                 setCurrentStep(3);
//                               }
//                             } else {
//                               setTimeRanges((prev) => ({
//                                 ...prev,
//                                 [day]: times,
//                               }));
//                             }
//                           }}
//                           format={timeFormat}
//                           disabledTime={disabledTime}
//                           className="custom-time-picker"
//                           defaultValue={[
//                             dayjs("08:00", timeFormat),
//                             dayjs("22:00", timeFormat),
//                           ]}
//                         />
//                       </Flex>
//                     </div>
//                   );
//                 }
//               )}
//             </div>
//           )}
//           {currentStep >= 3 && (
//             <div className="filter-card">
//               <h3 className="section-title">Select Location:</h3>
//               <Row gutter={16}>
//                 <Col xs={24} sm={8}>
//                   <Select
//                     placeholder="Select District"
//                     value={selectedDistrict}
//                     onChange={handleDistrictChange}
//                     style={{ width: "100%", marginBottom: "16px" }}
//                     allowClear
//                     showSearch
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option.children
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     }
//                   >
//                     {districts.map((district) => (
//                       <Option key={district.id} value={district.id}>
//                         {district.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Col>
//                 <Col xs={24} sm={8}>
//                   <Select
//                     placeholder="Select Ward"
//                     value={selectedStreet}
//                     onChange={handleStreetChange}
//                     style={{ width: "100%" }}
//                     allowClear
//                     showSearch
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option.children
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     }
//                     disabled={!selectedDistrict}
//                   >
//                     {streets.map((street) => (
//                       <Option key={street.id} value={street.id}>
//                         {street.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Col>
//                 <Col xs={24} sm={8}>
//                   <Input
//                     placeholder="Enter Address, Street ..."
//                     value={houseNumber}
//                     onChange={(e) => setHouseNumber(e.target.value)}
//                     style={{ width: "100%", marginBottom: "16px" }}
//                     allowClear
//                   />
//                 </Col>
//               </Row>
//               {location && (
//                 <div style={{ marginTop: "8px" }}>
//                   <strong>Selected Location:</strong> {location}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {currentStep >= 5 && (
//           <div className="character-selection-card mb-5">
//             <Row align="middle" gutter={16} className="mb-4">
//               <Col>
//                 <h3 className="section-title">Select Character:</h3>
//               </Col>
//               <Col>
//                 <Input
//                   placeholder="Search characters"
//                   value={characterSearchQuery}
//                   onChange={(e) => {
//                     setCharacterSearchQuery(e.target.value);
//                     setCurrentCharacterPage(1);
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
//                       selectedRequests.some(
//                         (r) => r.characterId === character.id
//                       )
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
//                     <p>Price: {character.price.toLocaleString()} VND</p>
//                     <p>Quantity: {character.quantity} </p>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//             <Pagination
//               current={currentCharacterPage}
//               pageSize={characterPageSize}
//               total={filteredCharacters.length}
//               onChange={(page) => setCurrentCharacterPage(page)}
//               className="custom-pagination"
//             />
//           </div>
//         )}

//         {currentStep >= 6 && (
//           <div className="cosplayer-selection">
//             <h3 className="section-title mb-4">
//               Available Cosplayers for {currentCharacter?.characterName}:
//             </h3>
//             {filteredCosplayers.length === 0 ? (
//               <div style={{ display: "flex" }}>
//                 <p>No cosplayers available for this character and time slot.</p>
//                 <div
//                   aria-label="Hamster running in wheel"
//                   role="img"
//                   className="unique-hamsterLoader__container"
//                 >
//                   <div className="unique-hamsterLoader__wheel"></div>
//                   <div className="unique-hamsterLoader__hamster">
//                     <div className="unique-hamsterLoader__body">
//                       <div className="unique-hamsterLoader__head">
//                         <div className="unique-hamsterLoader__ear"></div>
//                         <div className="unique-hamsterLoader__eye"></div>
//                         <div className="unique-hamsterLoader__nose"></div>
//                       </div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--fr"></div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--fl"></div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--br"></div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--bl"></div>
//                       <div className="unique-hamsterLoader__tail"></div>
//                     </div>
//                   </div>
//                   <div className="unique-hamsterLoader__spoke"></div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <Row align="middle" gutter={16} className="mb-4">
//                   <Col>
//                     <Select
//                       value={sortBy || "Sort By"}
//                       onChange={(value) => setSortBy(value)}
//                       style={{ width: 150 }}
//                     >
//                       <Option value="Sort By" disabled>
//                         Sort By
//                       </Option>
//                       <Option value="height">Height</Option>
//                       <Option value="weight">Weight</Option>
//                       <Option value="salaryIndex">Hourly Rate</Option>
//                       <Option value="averageStar">Rating</Option>
//                     </Select>
//                   </Col>
//                   <Col>
//                     <Select
//                       value={sortOrder}
//                       onChange={(value) => setSortOrder(value)}
//                       style={{ width: 120 }}
//                     >
//                       <Option value="asc">Ascending</Option>
//                       <Option value="desc">Descending</Option>
//                     </Select>
//                   </Col>
//                   <Col>
//                     <Button onClick={handleCancelSort}>Cancel Sort</Button>
//                   </Col>
//                 </Row>
//                 <List
//                   grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
//                   dataSource={paginatedCosplayers}
//                   renderItem={(cosplayer) => (
//                     <List.Item key={cosplayer.id}>
//                       <Card
//                         className={`cosplayer-item ${
//                           selectedCosplayerIds.includes(cosplayer.id)
//                             ? "selected"
//                             : ""
//                         }`}
//                         onClick={() => handleCosplayerSelect(cosplayer.id)}
//                       >
//                         <img
//                           src={cosplayer.avatar}
//                           alt={cosplayer.name}
//                           className="cosplayer-avatar"
//                           onError={(e) => (e.target.src = DEFAULT_AVATAR_URL)}
//                         />
//                         <h5>{cosplayer.name}</h5>
//                         <p className="description">{cosplayer.description}</p>
//                         <p>
//                           Height: {cosplayer.height} cm - Weight:{" "}
//                           {cosplayer.weight} kg
//                         </p>
//                         <p>Hourly Rate: {cosplayer.salaryIndex} VND/h</p>
//                         <div style={{ display: "flex", alignItems: "center" }}>
//                           <span style={{ marginRight: "8px" }}>Rating:</span>
//                           <Rate
//                             disabled
//                             allowHalf
//                             value={cosplayer.averageStar}
//                           />
//                           <span style={{ marginLeft: "8px" }}>
//                             ({cosplayer.averageStar}/5)
//                           </span>
//                         </div>
//                       </Card>
//                     </List.Item>
//                   )}
//                 />
//                 <Pagination
//                   current={currentCosplayerPage}
//                   pageSize={cosplayerPageSize}
//                   total={filteredCosplayers.length}
//                   onChange={(page) => setCurrentCosplayerPage(page)}
//                   className="custom-pagination"
//                 />
//                 <Button
//                   type="primary"
//                   onClick={handleAddCosplayers}
//                   className="custom-btn-add mt-4"
//                 >
//                   Add Cosplayers & Select More
//                 </Button>
//               </>
//             )}
//           </div>
//         )}
//         {selectedRequests.length > 0 && (
//           <div className="request-summary mt-5">
//             <h3 className="section-title mb-4">Selected Requests:</h3>
//             <p
//               style={{
//                 fontStyle: "italic",
//                 color: "#888",
//                 marginBottom: "10px",
//               }}
//             >
//               Note: Price = (Total Hours × Hourly Rate) + (Total Days ×
//               Character Price)
//             </p>
//             <List
//               dataSource={selectedRequests}
//               renderItem={(req) => (
//                 <List.Item key={req.characterId}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       width: "100%",
//                     }}
//                   >
//                     <div style={{ flex: 1 }}>
//                       <strong>{req.characterName}</strong> - Cosplayers:{" "}
//                       {req.cosplayers.map((cosplayer, index) => (
//                         <span key={cosplayer.id}>
//                           {cosplayer.name} (Cosplayer Price:{" "}
//                           {calculateUnitPrice(
//                             cosplayer,
//                             req.characterId
//                           ).toLocaleString()}{" "}
//                           VND)
//                           {index < req.cosplayers.length - 1 ? ", " : ""}
//                         </span>
//                       ))}
//                     </div>
//                     <div>
//                       {req.cosplayers.map((cosplayer) => (
//                         <Button
//                           key={cosplayer.id}
//                           type="link"
//                           icon={<CloseOutlined />}
//                           onClick={() =>
//                             handleRemoveCosplayer(cosplayer.id, req.characterId)
//                           }
//                           style={{ color: "#510545", marginLeft: "10px" }}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </List.Item>
//               )}
//             />
//             <Button
//               type="primary"
//               size="large"
//               onClick={handleSendRequest}
//               className="custom-btn-send mt-4"
//             >
//               Send Cosplayer Hire Request
//             </Button>
//           </div>
//         )}
//         <Modal
//           title="Confirm Request"
//           visible={isModalVisible}
//           onOk={handleModalConfirm}
//           onCancel={() => setIsModalVisible(false)}
//           okText="Send Request"
//           cancelText="Cancel"
//           okButtonProps={{ disabled: isSubmitting, loading: isSubmitting }}
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
//                 Start Date:
//               </label>
//               <span
//                 style={{
//                   fontSize: "1rem",
//                   color: "#1a1a2e",
//                 }}
//               >
//                 {modalData.startDate}
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
//                 End Date:
//               </label>
//               <span
//                 style={{
//                   fontSize: "1rem",
//                   color: "#1a1a2e",
//                 }}
//               >
//                 {modalData.endDate}
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
//                 Time Ranges Per Day:
//               </label>
//               <div
//                 style={{
//                   border: "1px solid #e6e9ee",
//                   borderRadius: "10px",
//                   padding: "0.5rem",
//                   background: "#f8f9fa",
//                 }}
//               >
//                 {dateRange &&
//                   Array.from(
//                     { length: dateRange[1].diff(dateRange[0], "day") + 1 },
//                     (_, i) => {
//                       const day = dateRange[0].add(i, "day").format(dateFormat);
//                       const [startTime, endTime] = timeRanges[day] || [];
//                       return (
//                         <div
//                           key={day}
//                           style={{
//                             padding: "0.5rem",
//                             borderBottom:
//                               i < dateRange[1].diff(dateRange[0], "day")
//                                 ? "1px solid #e6e9ee"
//                                 : "none",
//                           }}
//                         >
//                           <span
//                             style={{
//                               fontSize: "0.95rem",
//                               color: "#1a1a2e",
//                             }}
//                           >
//                             <strong>{day}</strong>:{" "}
//                             {startTime && endTime
//                               ? `${startTime.format(
//                                   timeFormat
//                                 )} - ${endTime.format(timeFormat)}`
//                               : "Not specified"}
//                           </span>
//                         </div>
//                       );
//                     }
//                   )}
//               </div>
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
//                   renderItem={(item, index) => {
//                     const cosplayer = selectedRequests
//                       .flatMap((req) => req.cosplayers)
//                       .find((c) => c.id === item.cosplayerId);
//                     return (
//                       <List.Item
//                         key={index}
//                         actions={[
//                           <Button
//                             type="link"
//                             icon={<CloseOutlined />}
//                             onClick={() =>
//                               handleRemoveCosplayer(
//                                 item.cosplayerId,
//                                 item.characterId
//                               )
//                             }
//                             style={{
//                               color: "#510545",
//                             }}
//                           />,
//                         ]}
//                         style={{
//                           padding: "0.5rem",
//                           borderBottom:
//                             index < modalData.listRequestCharacters.length - 1
//                               ? "1px solid #e6e9ee"
//                               : "none",
//                         }}
//                       >
//                         <span
//                           style={{
//                             color: "#1a1a2e",
//                             fontSize: "0.95rem",
//                           }}
//                         >
//                           {cosplayer?.name || "Unknown Cosplayer"} as{" "}
//                           {
//                             characters.find((c) => c.id === item.characterId)
//                               ?.name
//                           }{" "}
//                           - Hourly Rate: {cosplayer?.salaryIndex || "N/A"} -
//                           Quantity: {item.quantity} - Price:{" "}
//                           {cosplayerPrices[
//                             item.cosplayerId
//                           ]?.toLocaleString() || "Loading..."}{" "}
//                           VND
//                         </span>
//                       </List.Item>
//                     );
//                   }}
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
//                 {Object.values(cosplayerPrices)
//                   .reduce((sum, price) => sum + price, 0)
//                   .toLocaleString() || 0}{" "}
//                 VND
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
//                 Select Deposit Percentage:
//               </label>
//               <Radio.Group
//                 onChange={(e) => setDepositPercentage(e.target.value)}
//                 value={depositPercentage}
//                 style={{ display: "flex", gap: "1rem" }}
//               >
//                 <Radio value="30">30%</Radio>
//                 <Radio value="50">50%</Radio>
//                 <Radio value="70">70%</Radio>
//               </Radio.Group>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default CosplayersPage;

// validate cosplayer hien ra
// import React, { useState, useEffect, useMemo } from "react";
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
//   Select,
//   Rate,
//   Radio,
//   Flex,
// } from "antd";
// import {
//   LoadingOutlined,
//   SearchOutlined,
//   CloseOutlined,
// } from "@ant-design/icons";
// import { jwtDecode } from "jwt-decode";
// import dayjs from "dayjs";
// import "../../styles/CosplayersPage.scss";
// import HireCosplayerService from "../../services/HireCosplayerService/HireCosplayerService.js";
// import LocationPickerService from "../../components/LocationPicker/LocationPickerService.js";
// import { toast } from "react-toastify";

// const { RangePicker: DateRangePicker } = DatePicker;
// const { RangePicker: TimeRangePicker } = TimePicker;
// const { Option } = Select;

// const DEFAULT_AVATAR_URL =
//   "https://pm1.narvii.com/6324/0d7f51553b6ca0785d3912929088c25acc1bc53f_hq.jpg";

// const CosplayersPage = () => {
//   const [cosplayers, setCosplayers] = useState([]);
//   const [characters, setCharacters] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [dateRange, setDateRange] = useState(null);
//   const [timeRanges, setTimeRanges] = useState({});
//   const [location, setLocation] = useState("");
//   const [districts, setDistricts] = useState([]);
//   const [streets, setStreets] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedStreet, setSelectedStreet] = useState(null);
//   const [characterSearchQuery, setCharacterSearchQuery] = useState("");
//   const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
//   const [currentCosplayerPage, setCurrentCosplayerPage] = useState(1);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedRequests, setSelectedRequests] = useState([]);
//   const [currentCharacter, setCurrentCharacter] = useState(null);
//   const [filteredCosplayers, setFilteredCosplayers] = useState([]);
//   const [selectedCosplayerIds, setSelectedCosplayerIds] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     description: "",
//     listRequestCharacters: [],
//     name: "",
//   });
//   const [accountId, setAccountId] = useState(null);
//   const [cosplayerPrices, setCosplayerPrices] = useState({});
//   const [cosplayerDataCache, setCosplayerDataCache] = useState({});
//   const [sortBy, setSortBy] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [depositPercentage, setDepositPercentage] = useState("50");
//   const [houseNumber, setHouseNumber] = useState("");
//   const serviceId = "S002";
//   const packageId = "";
//   const dateFormat = "DD/MM/YYYY";
//   const timeFormat = "HH:mm";
//   const characterPageSize = 9;
//   const cosplayerPageSize = 9;

//   useEffect(() => {
//     const fetchDistricts = async () => {
//       try {
//         const districtsData = await LocationPickerService.getDistricts();
//         setDistricts(districtsData);
//       } catch (err) {
//         console.error("Failed to fetch districts:", err);
//         console.log("Failed to load districts. Please try again.");
//       }
//     };
//     fetchDistricts();
//   }, []);

//   useEffect(() => {
//     const fetchStreets = async () => {
//       if (selectedDistrict) {
//         try {
//           const streetsData = await LocationPickerService.getStreets(
//             selectedDistrict
//           );
//           setStreets(streetsData);
//         } catch (err) {
//           console.error("Failed to fetch streets:", err);
//           console.log("Failed to load streets. Please try again.");
//           setStreets([]);
//         }
//       } else {
//         setStreets([]);
//         setSelectedStreet(null);
//       }
//     };
//     fetchStreets();
//   }, [selectedDistrict]);

//   useEffect(() => {
//     if (selectedDistrict && selectedStreet && houseNumber.trim()) {
//       const districtName =
//         districts.find((d) => d.id === selectedDistrict)?.name || "";
//       const streetName =
//         streets.find((s) => s.id === selectedStreet)?.name || "";
//       const newLocation = `${houseNumber}, ${streetName}, ${districtName}, TP.HCM`;
//       setLocation(newLocation);
//       setCurrentStep(5);
//     } else {
//       setLocation("");
//     }
//   }, [selectedDistrict, selectedStreet, houseNumber, districts, streets]);

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       setError("You need to log in to access this page.");
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
//       setIsLoading(true);
//       try {
//         const charactersData = await HireCosplayerService.getAllCharacters();
//         const mappedCharacters = charactersData
//           .filter((character) => character.quantity >= 1) // Lọc nhân vật có quantity >= 1
//           .map((character) => ({
//             id: character.characterId,
//             name: character.characterName,
//             minHeight: character.minHeight,
//             maxHeight: character.maxHeight,
//             minWeight: character.minWeight,
//             maxWeight: character.maxWeight,
//             price: character.price,
//             quantity: character.quantity,
//           }));
//         setCharacters(mappedCharacters);
//       } catch (err) {
//         setError("Unable to load characters. Please try again later.");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCharacters();
//   }, []);

//   const fetchCosplayersByCharacterAndTime = async (characterId) => {
//     if (!dateRange || Object.keys(timeRanges).length === 0 || !characterId) {
//       setFilteredCosplayers([]);
//       setCosplayers([]);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Generate date and time ranges for API
//       const dates = [];
//       const startDate = dateRange[0];
//       const endDate = dateRange[1];
//       const days = endDate.diff(startDate, "day") + 1;

//       for (let i = 0; i < days; i++) {
//         const day = startDate.add(i, "day").format(dateFormat);
//         const [startTime, endTime] = timeRanges[day] || [];
//         if (startTime && endTime) {
//           dates.push({
//             startDate: `${startTime.format(timeFormat)} ${day}`,
//             endDate: `${endTime.format(timeFormat)} ${day}`,
//           });
//         }
//       }

//       if (dates.length === 0) {
//         throw new Error("No valid date and time ranges provided.");
//       }

//       // Fetch booked cosplayers
//       const conflicts =
//         await HireCosplayerService.getAllRequestCharacterByListDate(dates);
//       const bookedCosplayerIds = new Set(
//         conflicts
//           .map((conflict) => conflict.cosplayerId)
//           .filter(Boolean)
//           .map((id) => id.toString().toLowerCase())
//       );

//       // Fetch character details
//       const character = characters.find((char) => char.id === characterId);
//       if (!character) {
//         throw new Error("Character not found");
//       }

//       // Get existing cosplayer IDs from selected requests
//       const existingCosplayerIds = selectedRequests
//         .flatMap((req) => req.cosplayers)
//         .map((cosplayer) => cosplayer.id.toString().toLowerCase());

//       // Fetch cosplayers via ChangeCosplayer API
//       const requestData = {
//         characterId: character.id,
//         dates: dates,
//         accountId:
//           selectedCosplayerIds.length > 0 ? selectedCosplayerIds.join(",") : "",
//       };

//       const cosplayersData = await HireCosplayerService.ChangeCosplayer(
//         requestData
//       );

//       // Deduplicate cosplayers
//       const uniqueCosplayers = cosplayersData.reduce((acc, cosplayer) => {
//         if (!acc.some((c) => c.accountId === cosplayer.accountId)) {
//           acc.push(cosplayer);
//         }
//         return acc;
//       }, []);

//       // Map cosplayers
//       const mappedCosplayers = uniqueCosplayers.map((cosplayer) => ({
//         id: cosplayer.accountId,
//         name: cosplayer.name,
//         avatar: cosplayer.images[0]?.urlImage || DEFAULT_AVATAR_URL,
//         description: cosplayer.description || "No description",
//         height: cosplayer.height,
//         weight: cosplayer.weight,
//         salaryIndex: cosplayer.salaryIndex,
//         averageStar: cosplayer.averageStar || 0,
//       }));

//       // Update cosplayer data cache
//       const newCache = { ...cosplayerDataCache };
//       uniqueCosplayers.forEach((cosplayer) => {
//         newCache[cosplayer.accountId] = {
//           salaryIndex: cosplayer.salaryIndex || 1,
//           name: cosplayer.name,
//         };
//       });
//       setCosplayerDataCache(newCache);

//       // Filter cosplayers
//       const filtered = mappedCosplayers.filter(
//         (cosplayer) =>
//           !existingCosplayerIds.includes(
//             cosplayer.id.toString().toLowerCase()
//           ) &&
//           !bookedCosplayerIds.has(cosplayer.id.toString().toLowerCase()) &&
//           cosplayer.height >= character.minHeight &&
//           cosplayer.height <= character.maxHeight &&
//           cosplayer.weight >= character.minWeight &&
//           cosplayer.weight <= character.maxWeight
//       );

//       setCosplayers(mappedCosplayers);
//       setFilteredCosplayers(filtered);

//       if (filtered.length === 0) {
//         setError(
//           "No cosplayers available for this character and time slot. Try adjusting the time or character."
//         );
//       } else {
//         setError(null);
//       }
//     } catch (err) {
//       setError("Unable to load cosplayers. Please try again later.");
//       console.error(err);
//       toast.error(err.message || "Failed to load cosplayers.");
//       setFilteredCosplayers([]);
//       setCosplayers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const calculateTotalHours = useMemo(() => {
//     if (!dateRange || !timeRanges) return 0;

//     let totalHours = 0;
//     const startDate = dateRange[0];
//     const endDate = dateRange[1];
//     const days = endDate.diff(startDate, "day") + 1;

//     for (let i = 0; i < days; i++) {
//       const day = startDate.add(i, "day").format(dateFormat);
//       const [startTime, endTime] = timeRanges[day] || [];
//       if (startTime && endTime) {
//         totalHours += endTime.diff(startTime, "hour", true);
//       }
//     }
//     return totalHours;
//   }, [dateRange, timeRanges]);

//   const calculateTotalDays = useMemo(() => {
//     if (!dateRange) return 0;

//     const startDate = dateRange[0];
//     const endDate = dateRange[1];
//     return endDate.diff(startDate, "day") + 1;
//   }, [dateRange]);

//   const calculateUnitPrice = (cosplayer, characterId) => {
//     const character = characters.find((char) => char.id === characterId);
//     if (!character || !cosplayer.salaryIndex) return 0;

//     const totalHours = calculateTotalHours;
//     const totalDays = calculateTotalDays;
//     const unitPrice =
//       totalHours * cosplayer.salaryIndex + totalDays * character.price;
//     return unitPrice;
//   };

//   useEffect(() => {
//     if (sortBy && filteredCosplayers.length > 0) {
//       const sortedCosplayers = [...filteredCosplayers].sort((a, b) => {
//         const valueA = a[sortBy];
//         const valueB = b[sortBy];
//         return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
//       });
//       setFilteredCosplayers(sortedCosplayers);
//     }
//   }, [sortBy, sortOrder]);

//   const handleCancelSort = () => {
//     setSortBy("");
//     setSortOrder("asc");
//     if (currentCharacter?.characterId) {
//       fetchCosplayersByCharacterAndTime(currentCharacter.characterId);
//     }
//   };

//   useEffect(() => {
//     const fetchCosplayerPrices = () => {
//       if (isModalVisible && modalData.listRequestCharacters.length > 0) {
//         const prices = {};
//         modalData.listRequestCharacters.forEach((item) => {
//           const cosplayerData = cosplayerDataCache[item.cosplayerId];
//           const salaryIndex = cosplayerData?.salaryIndex || 1;
//           const character = characters.find(
//             (char) => char.id === item.characterId
//           );
//           const totalHours = calculateTotalHours;
//           const totalDays = calculateTotalDays;
//           prices[item.cosplayerId] =
//             (totalHours * salaryIndex + totalDays * (character?.price || 0)) *
//             item.quantity;
//         });
//         setCosplayerPrices(prices);
//       }
//     };
//     fetchCosplayerPrices();
//   }, [isModalVisible, modalData.listRequestCharacters, cosplayerDataCache]);

//   const filteredCharacters = characters.filter(
//     (char) =>
//       char.name.toLowerCase().includes(characterSearchQuery.toLowerCase()) &&
//       char.quantity >= 1
//   );

//   const paginatedCharacters = filteredCharacters.slice(
//     (currentCharacterPage - 1) * characterPageSize,
//     currentCharacterPage * characterPageSize
//   );

//   const paginatedCosplayers = filteredCosplayers.slice(
//     (currentCosplayerPage - 1) * cosplayerPageSize,
//     currentCosplayerPage * cosplayerPageSize
//   );

//   const disabledDate = (current) => {
//     if (!current) return false;

//     const today = dayjs().startOf("day");
//     const minStartDate = today.add(4, "day");
//     const maxStartDate = minStartDate.add(13, "day");

//     if (current < minStartDate) {
//       return true;
//     }

//     if (!dateRange || !dateRange[0]) {
//       return current > maxStartDate;
//     }

//     const startDate = dateRange[0];
//     const maxEndDate = startDate.add(13, "day");
//     return current < startDate || current > maxEndDate;
//   };

//   const disabledTime = () => {
//     const startHour = 8;
//     const endHour = 22;

//     return {
//       disabledHours: () => {
//         const hours = [];
//         for (let i = 0; i < 24; i++) {
//           if (i < startHour || i > endHour) {
//             hours.push(i);
//           }
//         }
//         return hours;
//       },
//       disabledMinutes: (selectedHour) => {
//         if (selectedHour === startHour || selectedHour === endHour) {
//           return Array.from({ length: 60 }, (_, i) => i).filter(
//             (minute) => minute !== 0
//           );
//         }
//         return [];
//       },
//     };
//   };

//   const handleDateRangeChange = (dates) => {
//     if (!dates) {
//       setDateRange(null);
//       setTimeRanges({});
//       return;
//     }

//     const [start, end] = dates;
//     const today = dayjs().startOf("day");
//     const minStartDate = today.add(4, "day");
//     const maxStartDate = minStartDate.add(13, "day");

//     if (start.isBefore(minStartDate, "day")) {
//       toast.warn("Start date must be at least 4 days from today!");
//       setDateRange(null);
//       return;
//     }

//     if (start.isAfter(maxStartDate, "day")) {
//       toast.error("Start date cannot be more than 14 days ");
//       setDateRange(null);
//       return;
//     }

//     if (end.isBefore(start, "day")) {
//       toast.warn("End date must be on or after start date!");
//       setDateRange(null);
//       return;
//     }

//     const maxEndDate = start.add(13, "day");
//     if (end.isAfter(maxEndDate, "day")) {
//       toast.warn("End date cannot be more than 14 days from start date!");
//       setDateRange(null);
//       return;
//     }

//     const daysDifference = end.diff(start, "day") + 1;
//     if (daysDifference > 5) {
//       toast.warn("Rental period cannot exceed 5 days!");
//       setDateRange(null);
//       return;
//     }

//     setDateRange(dates);
//     setTimeRanges({});
//     setCurrentStep(2);
//   };

//   const handleDistrictChange = (value) => {
//     setSelectedDistrict(value);
//     setSelectedStreet(null);
//     if (!value) {
//       setLocation("");
//       setStreets([]);
//     }
//   };

//   const handleStreetChange = (value) => {
//     setSelectedStreet(value);
//     if (!value) {
//       setLocation("");
//     }
//   };

//   const handleCharacterSelect = (character) => {
//     if (currentCharacter?.characterId === character.id) {
//       setCurrentCharacter(null);
//       setSelectedCosplayerIds([]);

//       setCurrentCosplayerPage(1);
//       setCurrentStep(5);
//       setFilteredCosplayers([]);
//       setCosplayers([]);
//       setSortBy("");
//       setSortOrder("asc");
//     } else {
//       setCurrentCharacter({
//         characterId: character.id,
//         characterName: character.name,
//       });
//       setSelectedCosplayerIds([]);

//       setCurrentCosplayerPage(1);
//       fetchCosplayersByCharacterAndTime(character.id);
//       setCurrentStep(6);
//       setSortBy("");
//       setSortOrder("asc");
//     }
//   };

//   const handleCosplayerSelect = (cosplayerId) => {
//     const character = characters.find(
//       (char) => char.id === currentCharacter?.characterId
//     );
//     if (!character) {
//       console.log("Nhân vật không được tìm thấy!");
//       return;
//     }

//     const existingCosplayersForCharacter = selectedRequests
//       .filter((req) => req.characterId === currentCharacter.characterId)
//       .flatMap((req) => req.cosplayers).length;

//     const currentSelectedCount = selectedCosplayerIds.length;
//     const isSelecting = !selectedCosplayerIds.includes(cosplayerId);

//     if (
//       isSelecting &&
//       currentSelectedCount + existingCosplayersForCharacter >=
//         character.quantity
//     ) {
//       toast.warn(
//         `You can only select up to ${character.quantity} cosplayers for character ${character.name}! `
//       );
//       return;
//     }

//     setSelectedCosplayerIds((prev) =>
//       prev.includes(cosplayerId)
//         ? prev.filter((id) => id !== cosplayerId)
//         : [...prev, cosplayerId]
//     );
//   };

//   const handleAddCosplayers = () => {
//     if (selectedCosplayerIds.length === 0) {
//       toast.warn("Please select at least one cosplayer!");
//       return;
//     }

//     const character = characters.find(
//       (char) => char.id === currentCharacter?.characterId
//     );
//     if (!character) {
//       console.log("Nhân vật không được tìm thấy!");
//       return;
//     }

//     // Đếm số cosplayer đã chọn cho nhân vật này trong selectedRequests
//     const existingCosplayersForCharacter = selectedRequests
//       .filter((req) => req.characterId === currentCharacter.characterId)
//       .flatMap((req) => req.cosplayers).length;

//     const totalSelectedCosplayers =
//       existingCosplayersForCharacter + selectedCosplayerIds.length;

//     if (totalSelectedCosplayers > character.quantity) {
//       toast.warn(
//         `You can only select up to ${character.quantity} cosplayers for character ${character.name}!`
//       );
//       return;
//     }

//     const selectedCosplayerDetails = selectedCosplayerIds.map((id) => {
//       const cosplayer = filteredCosplayers.find((c) => c.id === id);
//       return { id, name: cosplayer.name, salaryIndex: cosplayer.salaryIndex };
//     });

//     setSelectedRequests((prev) => [
//       ...prev,
//       {
//         characterId: currentCharacter.characterId,
//         characterName: currentCharacter.characterName,
//         cosplayers: selectedCosplayerDetails,
//       },
//     ]);

//     const newPrices = { ...cosplayerPrices };
//     selectedCosplayerDetails.forEach((cosplayer) => {
//       const character = characters.find(
//         (char) => char.id === currentCharacter.characterId
//       );
//       const totalHours = calculateTotalHours;
//       const totalDays = calculateTotalDays;
//       newPrices[cosplayer.id] =
//         (totalHours * cosplayer.salaryIndex +
//           totalDays * (character?.price || 0)) *
//         1;
//     });
//     setCosplayerPrices(newPrices);

//     setCurrentStep(5);
//     setSelectedCosplayerIds([]);

//     setCurrentCosplayerPage(1);
//     setCurrentCharacter(null);
//     setFilteredCosplayers([]);
//     setCosplayers([]);
//     setSortBy("");
//     setSortOrder("asc");
//   };

//   const handleSendRequest = () => {
//     if (!dateRange || Object.keys(timeRanges).length === 0 || !location) {
//       toast.warn(
//         "Please fill in all required fields (date, time per day, house number, district, and street)!"
//       );
//       return;
//     }
//     if (!houseNumber.trim()) {
//       toast.error("Please enter house number!");
//       return;
//     }
//     if (selectedRequests.length === 0) {
//       console.log("Please select at least one character and cosplayer!");
//       return;
//     }
//     setModalData((prev) => ({
//       ...prev,
//       listRequestCharacters: selectedRequests.flatMap((req) =>
//         req.cosplayers.map((cosplayer) => ({
//           characterId: req.characterId,
//           cosplayerId: cosplayer.id,
//           description: "",
//           quantity: 1,
//         }))
//       ),
//       startDate: dateRange[0].format(dateFormat),
//       endDate: dateRange[1].format(dateFormat),
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
//     setSelectedRequests((prev) =>
//       prev
//         .map((req) => ({
//           ...req,
//           cosplayers: req.cosplayers.filter(
//             (cosplayer) => cosplayer.id !== cosplayerId
//           ),
//         }))
//         .filter((req) => req.cosplayers.length > 0)
//     );
//     setCosplayerPrices((prev) => {
//       const newPrices = { ...prev };
//       delete newPrices[cosplayerId];
//       return newPrices;
//     });
//   };

//   const applySameTimeToAll = () => {
//     if (!dateRange || !dateRange[0] || !dateRange[1]) {
//       toast.warn("Please select a valid date range!");
//       return;
//     }

//     const totalDays = dateRange[1].diff(dateRange[0], "day") + 1;
//     if (totalDays <= 1) {
//       toast.info("This feature is only available for multiple days!");
//       return;
//     }

//     const firstDay = dateRange[0].format(dateFormat);
//     const firstTimeRange = timeRanges[firstDay];

//     if (!firstTimeRange || !firstTimeRange[0] || !firstTimeRange[1]) {
//       toast.warn("Please select a valid time range for the first day!");
//       return;
//     }

//     const startTime = firstTimeRange[0]; // Define startTime
//     const endTime = firstTimeRange[1]; // Define endTime

//     if (endTime.isBefore(startTime)) {
//       toast.warn("End time must be after start time for the first day!");
//       return;
//     }

//     if (endTime.isSame(startTime)) {
//       toast.warn(
//         "End time cannot be the same as start time for the first day!"
//       );
//       return;
//     }

//     const newTimeRanges = { ...timeRanges };
//     for (let i = 0; i < totalDays; i++) {
//       const day = dateRange[0].add(i, "day").format(dateFormat);
//       newTimeRanges[day] = [dayjs(startTime), dayjs(endTime)];
//     }

//     setTimeRanges(newTimeRanges);

//     const allDaysFilled = Array.from({ length: totalDays }, (_, j) =>
//       dateRange[0].add(j, "day").format(dateFormat)
//     ).every((d) => {
//       const range = newTimeRanges[d];
//       return (
//         range &&
//         Array.isArray(range) &&
//         range.length === 2 &&
//         range[0] &&
//         range[1] &&
//         !range[1].isSame(range[0])
//       );
//     });

//     if (allDaysFilled) {
//       setCurrentStep(3);
//     }

//     toast.success("Time ranges applied to all days!");
//   };

//   const handleModalConfirm = async () => {
//     if (modalData.listRequestCharacters.length === 0) {
//       toast.warn(
//         "Please select at least one cosplayer before submitting a request!"
//       );
//       return;
//     }

//     if (!modalData.name.trim()) {
//       toast.warn("Name cannot be blank!");
//       return;
//     }

//     if (!accountId) {
//       toast.error("Cannot send request: Missing user ID. Please log in again.");
//       return;
//     }

//     if (!dateRange || !dateRange[0] || !dateRange[1]) {
//       toast.warn("Please select a valid time period!");
//       return;
//     }

//     // Validate character counts
//     const characterCounts = {};
//     modalData.listRequestCharacters.forEach((item) => {
//       characterCounts[item.characterId] =
//         (characterCounts[item.characterId] || 0) + 1;
//     });

//     for (const [characterId, count] of Object.entries(characterCounts)) {
//       const character = characters.find((c) => c.id === characterId);
//       if (character && count > character.quantity) {
//         toast.warn(
//           `The number of cosplayers for character ${character.name} exceeds inventory (${character.quantity})!`
//         );
//         return;
//       }
//     }

//     // Validate dates
//     const startDate = dateRange[0];
//     const endDate = dateRange[1];
//     const today = dayjs().startOf("day");
//     const minStartDate = today.add(4, "day");
//     const maxStartDate = minStartDate.add(13, "day");

//     if (startDate.isBefore(minStartDate, "day")) {
//       toast.error("Start date must be at least 4 days from today!");
//       return;
//     }

//     if (startDate.isAfter(maxStartDate, "day")) {
//       toast.warn("Start date cannot be more than 14 days from today!");
//       return;
//     }

//     if (endDate.isBefore(startDate, "day")) {
//       toast.warn("The end date must be on or after the start date!");
//       return;
//     }

//     const maxEndDate = startDate.add(13, "day");
//     if (endDate.isAfter(maxEndDate, "day")) {
//       toast.warn(
//         "The end date cannot be more than 14 days from the start date!"
//       );
//       return;
//     }

//     const diffDays = endDate.diff(startDate, "day") + 1;
//     if (diffDays > 5) {
//       toast.error("Rental period must not exceed 5 days!");
//       return;
//     }

//     // Validate time ranges
//     const allDays = Array.from({ length: diffDays }, (_, i) =>
//       startDate.add(i, "day").format(dateFormat)
//     );
//     const missingTimeRanges = allDays.filter(
//       (day) => !timeRanges[day] || !timeRanges[day][0] || !timeRanges[day][1]
//     );
//     if (missingTimeRanges.length > 0) {
//       toast.error(
//         `Please select a time period for the following days: ${missingTimeRanges.join(
//           ", "
//         )}`
//       );
//       return;
//     }

//     const sameTimeRanges = allDays.filter((day) => {
//       const [startTime, endTime] = timeRanges[day] || [];
//       return startTime && endTime && startTime.isSame(endTime);
//     });
//     if (sameTimeRanges.length > 0) {
//       toast.info(
//         `Start and end times cannot overlap for the following days: ${sameTimeRanges.join(
//           ", "
//         )}`
//       );
//       return;
//     }

//     // Generate dates for conflict check
//     const dates = allDays.map((day) => {
//       const [startTime, endTime] = timeRanges[day];
//       return {
//         startDate: `${startTime.format(timeFormat)} ${day}`,
//         endDate: `${endTime.format(timeFormat)} ${day}`,
//       };
//     });

//     // Check for conflicts with booked cosplayers
//     try {
//       const conflicts =
//         await HireCosplayerService.getAllRequestCharacterByListDate(dates);
//       const bookedCosplayerIds = new Set(
//         conflicts
//           .map((conflict) => conflict.cosplayerId)
//           .filter(Boolean)
//           .map((id) => id.toString().toLowerCase())
//       );

//       const selectedCosplayerIdsSet = new Set(
//         modalData.listRequestCharacters.map((item) =>
//           item.cosplayerId.toString().toLowerCase()
//         )
//       );

//       const conflictingCosplayers = Array.from(selectedCosplayerIdsSet).filter(
//         (id) => bookedCosplayerIds.has(id)
//       );

//       if (conflictingCosplayers.length > 0) {
//         const conflictingNames = conflictingCosplayers
//           .map((id) => {
//             const cosplayer = filteredCosplayers.find(
//               (c) => c.id.toString().toLowerCase() === id
//             );
//             return cosplayer?.name || "Unknown Cosplayer";
//           })
//           .join(", ");
//         toast.error(
//           `The following cosplayers are already booked for the selected times: ${conflictingNames}. Please select different cosplayers or adjust the time.`
//         );
//         return;
//       }
//     } catch (error) {
//       console.error("Error checking cosplayer conflicts:", error);
//       toast.error("Failed to verify cosplayer availability. Please try again.");
//       return;
//     }

//     // Prepare request data
//     const totalPrice = Object.values(cosplayerPrices).reduce(
//       (sum, price) => sum + price,
//       0
//     );

//     const requestData = {
//       accountId: accountId,
//       name: modalData.name,
//       description: modalData.description || "No description",
//       price: totalPrice,
//       startDate: startDate.format(dateFormat),
//       endDate: endDate.format(dateFormat),
//       location: location,
//       deposit: depositPercentage,
//       charactersRentCosplayers: modalData.listRequestCharacters.map((item) => {
//         const listRequestDates = allDays.map((day) => {
//           const [startTime, endTime] = timeRanges[day];
//           return {
//             startDate: `${startTime.format(timeFormat)} ${day}`,
//             endDate: `${endTime.format(timeFormat)} ${day}`,
//           };
//         });
//         return {
//           characterId: item.characterId,
//           cosplayerId: item.cosplayerId,
//           description: item.description || "No description",
//           listRequestDates,
//         };
//       }),
//     };

//     // Send request
//     setIsSubmitting(true);
//     try {
//       console.log("Sending request at:", performance.now(), "ms");
//       console.log("requestData:", JSON.stringify(requestData, null, 2));
//       const response = await HireCosplayerService.NewSendRequestHireCosplayer(
//         requestData
//       );
//       console.log("Request completed at:", performance.now(), "ms");
//       toast.success("Request sent successfully!", {
//         autoClose: 3000,
//       });
//       setIsModalVisible(false);
//       setSelectedRequests([]);
//       setDateRange(null);
//       setTimeRanges({});
//       setLocation("");
//       setSelectedDistrict(null);
//       setSelectedStreet(null);
//       setSelectedCosplayerIds([]);
//       setCurrentCosplayerPage(1);
//       setCurrentCharacter(null);
//       setCosplayers([]);
//       setFilteredCosplayers([]);
//       setCosplayerPrices({});
//       setCosplayerDataCache({});
//       setSortBy("");
//       setSortOrder("asc");
//       setDepositPercentage("50");
//       setCurrentStep(1);
//     } catch (error) {
//       console.error("Failed to send request:", error.message);
//       toast.error(`Failed to send request`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div
//         className="cosplay-rental-page min-vh-100"
//         style={{ padding: "50px" }}
//       >
//         <Alert
//           message="Authentication Error"
//           description={error || "You need to log in to access this page."}
//           type="error"
//           showIcon
//         />
//       </div>
//     );
//   }

//   if (isLoading) {
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
//             Book your favorite cosplayers for your event
//           </p>
//         </div>
//       </div>

//       <div className="container py-5">
//         <div className="filter-section mb-5">
//           {currentStep >= 1 && (
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
//           {currentStep >= 2 && dateRange && (
//             <div className="filter-card">
//               <Flex
//                 align="center"
//                 justify="space-between"
//                 style={{ marginBottom: "16px" }}
//               >
//                 <h3 className="section-title">Select Time for Each Day:</h3>
//                 {dateRange[1].diff(dateRange[0], "day") + 1 > 1 && (
//                   <Button
//                     type="primary"
//                     onClick={applySameTimeToAll}
//                     disabled={
//                       !timeRanges[dateRange[0].format(dateFormat)]?.[0] ||
//                       !timeRanges[dateRange[0].format(dateFormat)]?.[1] ||
//                       timeRanges[dateRange[0].format(dateFormat)]?.[1].isBefore(
//                         timeRanges[dateRange[0].format(dateFormat)]?.[0]
//                       ) ||
//                       timeRanges[dateRange[0].format(dateFormat)]?.[1].isSame(
//                         timeRanges[dateRange[0].format(dateFormat)]?.[0]
//                       )
//                     }
//                   >
//                     Same Time
//                   </Button>
//                 )}
//               </Flex>
//               {Array.from(
//                 { length: dateRange[1].diff(dateRange[0], "day") + 1 },
//                 (_, i) => {
//                   const day = dateRange[0].add(i, "day").format(dateFormat);
//                   return (
//                     <div
//                       key={day}
//                       style={{
//                         marginBottom: "16px",
//                         textAlign: "center",
//                         flexDirection: "row",
//                         margin: "0 15px",
//                         alignItems: "center",
//                       }}
//                     >
//                       <h5>{day}</h5>
//                       <Flex gap={8} align="center" justify="center">
//                         <TimeRangePicker
//                           style={{ width: "103%" }}
//                           value={timeRanges[day] || null}
//                           onChange={(times) => {
//                             if (times && times[0] && times[1]) {
//                               const startTime = times[0]; // Define startTime
//                               const endTime = times[1]; // Define endTime
//                               if (endTime.isBefore(startTime)) {
//                                 toast.warn(
//                                   "End time must be after start time!"
//                                 );
//                                 return;
//                               }
//                               if (endTime.isSame(startTime)) {
//                                 console.log(
//                                   "End time cannot be the same as start time!"
//                                 );
//                                 return;
//                               }
//                               const newTimeRanges = {
//                                 ...timeRanges,
//                                 [day]: [startTime, endTime],
//                               };
//                               setTimeRanges(newTimeRanges);

//                               const totalDays =
//                                 dateRange[1].diff(dateRange[0], "day") + 1;
//                               const allDays = Array.from(
//                                 { length: totalDays },
//                                 (_, j) =>
//                                   dateRange[0].add(j, "day").format(dateFormat)
//                               );
//                               const allDaysFilled = allDays.every((d) => {
//                                 const range = newTimeRanges[d];
//                                 return (
//                                   range &&
//                                   Array.isArray(range) &&
//                                   range.length === 2 &&
//                                   range[0] &&
//                                   range[1] &&
//                                   !range[1].isSame(range[0])
//                                 );
//                               });

//                               if (allDaysFilled) {
//                                 setCurrentStep(3);
//                               }
//                             } else {
//                               setTimeRanges((prev) => ({
//                                 ...prev,
//                                 [day]: times,
//                               }));
//                             }
//                           }}
//                           format={timeFormat}
//                           disabledTime={disabledTime}
//                           className="custom-time-picker"
//                           defaultValue={[
//                             dayjs("08:00", timeFormat),
//                             dayjs("22:00", timeFormat),
//                           ]}
//                         />
//                       </Flex>
//                     </div>
//                   );
//                 }
//               )}
//             </div>
//           )}
//           {currentStep >= 3 && (
//             <div className="filter-card">
//               <h3 className="section-title">Select Location:</h3>
//               <Row gutter={16}>
//                 <Col xs={24} sm={8}>
//                   <Select
//                     placeholder="Select District"
//                     value={selectedDistrict}
//                     onChange={handleDistrictChange}
//                     style={{ width: "100%", marginBottom: "16px" }}
//                     allowClear
//                     showSearch
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option.children
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     }
//                   >
//                     {districts.map((district) => (
//                       <Option key={district.id} value={district.id}>
//                         {district.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Col>
//                 <Col xs={24} sm={8}>
//                   <Select
//                     placeholder="Select Ward"
//                     value={selectedStreet}
//                     onChange={handleStreetChange}
//                     style={{ width: "100%" }}
//                     allowClear
//                     showSearch
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option.children
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     }
//                     disabled={!selectedDistrict}
//                   >
//                     {streets.map((street) => (
//                       <Option key={street.id} value={street.id}>
//                         {street.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Col>
//                 <Col xs={24} sm={8}>
//                   <Input
//                     placeholder="Enter Address, Street ..."
//                     value={houseNumber}
//                     onChange={(e) => setHouseNumber(e.target.value)}
//                     style={{ width: "100%", marginBottom: "16px" }}
//                     allowClear
//                   />
//                 </Col>
//               </Row>
//               {location && (
//                 <div style={{ marginTop: "8px" }}>
//                   <strong>Selected Location:</strong> {location}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {currentStep >= 5 && (
//           <div className="character-selection-card mb-5">
//             <Row align="middle" gutter={16} className="mb-4">
//               <Col>
//                 <h3 className="section-title">Select Character:</h3>
//               </Col>
//               <Col>
//                 <Input
//                   placeholder="Search characters"
//                   value={characterSearchQuery}
//                   onChange={(e) => {
//                     setCharacterSearchQuery(e.target.value);
//                     setCurrentCharacterPage(1);
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
//                       selectedRequests.some(
//                         (r) => r.characterId === character.id
//                       )
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
//                     <p>Price: {character.price.toLocaleString()} VND</p>
//                     <p>Quantity: {character.quantity} </p>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//             <Pagination
//               current={currentCharacterPage}
//               pageSize={characterPageSize}
//               total={filteredCharacters.length}
//               onChange={(page) => setCurrentCharacterPage(page)}
//               className="custom-pagination"
//             />
//           </div>
//         )}

//         {currentStep >= 6 && (
//           <div className="cosplayer-selection">
//             <h3 className="section-title mb-4">
//               Available Cosplayers for {currentCharacter?.characterName}:
//             </h3>
//             {filteredCosplayers.length === 0 ? (
//               <div style={{ display: "flex" }}>
//                 <p>No cosplayers available for this character and time slot.</p>
//                 <div
//                   aria-label="Hamster running in wheel"
//                   role="img"
//                   className="unique-hamsterLoader__container"
//                 >
//                   <div className="unique-hamsterLoader__wheel"></div>
//                   <div className="unique-hamsterLoader__hamster">
//                     <div className="unique-hamsterLoader__body">
//                       <div className="unique-hamsterLoader__head">
//                         <div className="unique-hamsterLoader__ear"></div>
//                         <div className="unique-hamsterLoader__eye"></div>
//                         <div className="unique-hamsterLoader__nose"></div>
//                       </div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--fr"></div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--fl"></div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--br"></div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--bl"></div>
//                       <div className="unique-hamsterLoader__tail"></div>
//                     </div>
//                   </div>
//                   <div className="unique-hamsterLoader__spoke"></div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <Row align="middle" gutter={16} className="mb-4">
//                   <Col>
//                     <Select
//                       value={sortBy || "Sort By"}
//                       onChange={(value) => setSortBy(value)}
//                       style={{ width: 150 }}
//                     >
//                       <Option value="Sort By" disabled>
//                         Sort By
//                       </Option>
//                       <Option value="height">Height</Option>
//                       <Option value="weight">Weight</Option>
//                       <Option value="salaryIndex">Hourly Rate</Option>
//                       <Option value="averageStar">Rating</Option>
//                     </Select>
//                   </Col>
//                   <Col>
//                     <Select
//                       value={sortOrder}
//                       onChange={(value) => setSortOrder(value)}
//                       style={{ width: 120 }}
//                     >
//                       <Option value="asc">Ascending</Option>
//                       <Option value="desc">Descending</Option>
//                     </Select>
//                   </Col>
//                   <Col>
//                     <Button onClick={handleCancelSort}>Cancel Sort</Button>
//                   </Col>
//                 </Row>
//                 <List
//                   grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
//                   dataSource={paginatedCosplayers}
//                   renderItem={(cosplayer) => (
//                     <List.Item key={cosplayer.id}>
//                       <Card
//                         className={`cosplayer-item ${
//                           selectedCosplayerIds.includes(cosplayer.id)
//                             ? "selected"
//                             : ""
//                         }`}
//                         onClick={() => handleCosplayerSelect(cosplayer.id)}
//                       >
//                         <img
//                           src={cosplayer.avatar}
//                           alt={cosplayer.name}
//                           className="cosplayer-avatar"
//                           onError={(e) => (e.target.src = DEFAULT_AVATAR_URL)}
//                         />
//                         <h5>{cosplayer.name}</h5>
//                         <p className="description">{cosplayer.description}</p>
//                         <p>
//                           Height: {cosplayer.height} cm - Weight:{" "}
//                           {cosplayer.weight} kg
//                         </p>
//                         <p>Hourly Rate: {cosplayer.salaryIndex} VND/h</p>
//                         <div style={{ display: "flex", alignItems: "center" }}>
//                           <span style={{ marginRight: "8px" }}>Rating:</span>
//                           <Rate
//                             disabled
//                             allowHalf
//                             value={cosplayer.averageStar}
//                           />
//                           <span style={{ marginLeft: "8px" }}>
//                             ({cosplayer.averageStar}/5)
//                           </span>
//                         </div>
//                       </Card>
//                     </List.Item>
//                   )}
//                 />
//                 <Pagination
//                   current={currentCosplayerPage}
//                   pageSize={cosplayerPageSize}
//                   total={filteredCosplayers.length}
//                   onChange={(page) => setCurrentCosplayerPage(page)}
//                   className="custom-pagination"
//                 />
//                 <Button
//                   type="primary"
//                   onClick={handleAddCosplayers}
//                   className="custom-btn-add mt-4"
//                 >
//                   Add Cosplayers & Select More
//                 </Button>
//               </>
//             )}
//           </div>
//         )}
//         {selectedRequests.length > 0 && (
//           <div className="request-summary mt-5">
//             <h3 className="section-title mb-4">Selected Requests:</h3>
//             <p
//               style={{
//                 fontStyle: "italic",
//                 color: "#888",
//                 marginBottom: "10px",
//               }}
//             >
//               Note: Price = (Total Hours × Hourly Rate) + (Total Days ×
//               Character Price)
//             </p>
//             <List
//               dataSource={selectedRequests}
//               renderItem={(req) => (
//                 <List.Item key={req.characterId}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       width: "100%",
//                     }}
//                   >
//                     <div style={{ flex: 1 }}>
//                       <strong>{req.characterName}</strong> - Cosplayers:{" "}
//                       {req.cosplayers.map((cosplayer, index) => (
//                         <span key={cosplayer.id}>
//                           {cosplayer.name} (Cosplayer Price:{" "}
//                           {calculateUnitPrice(
//                             cosplayer,
//                             req.characterId
//                           ).toLocaleString()}{" "}
//                           VND)
//                           {index < req.cosplayers.length - 1 ? ", " : ""}
//                         </span>
//                       ))}
//                     </div>
//                     <div>
//                       {req.cosplayers.map((cosplayer) => (
//                         <Button
//                           key={cosplayer.id}
//                           type="link"
//                           icon={<CloseOutlined />}
//                           onClick={() =>
//                             handleRemoveCosplayer(cosplayer.id, req.characterId)
//                           }
//                           style={{ color: "#510545", marginLeft: "10px" }}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </List.Item>
//               )}
//             />
//             <Button
//               type="primary"
//               size="large"
//               onClick={handleSendRequest}
//               className="custom-btn-send mt-4"
//             >
//               Send Cosplayer Hire Request
//             </Button>
//           </div>
//         )}
//         <Modal
//           title="Confirm Request"
//           visible={isModalVisible}
//           onOk={handleModalConfirm}
//           onCancel={() => setIsModalVisible(false)}
//           okText="Send Request"
//           cancelText="Cancel"
//           okButtonProps={{ disabled: isSubmitting, loading: isSubmitting }}
//           style={{
//             fontFamily: "'Poppins', sans-serif",
//           }}
//           bodyStyle={{
//             background: "#fff",
//             borderRadius: "0 0 15px 15px",
//             padding: "1rem",
//             boxShadow: "0 10px 30px rgba(34, 102, 138, 0.2)",
//           }}
//           headerStyle={{
//             background: "linear-gradient(135deg, #510545, #22668a)",
//             borderRadius: "15px 15px 0 0",
//             padding: "1rem",
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
//                 Time Ranges Per Day:
//               </label>
//               <div
//                 style={{
//                   border: "1px solid #e6e9ee",
//                   borderRadius: "10px",
//                   padding: "0.5rem",
//                   background: "#f8f9fa",
//                 }}
//               >
//                 {dateRange &&
//                   Array.from(
//                     { length: dateRange[1].diff(dateRange[0], "day") + 1 },
//                     (_, i) => {
//                       const day = dateRange[0].add(i, "day").format(dateFormat);
//                       const [startTime, endTime] = timeRanges[day] || [];
//                       return (
//                         <div
//                           key={day}
//                           style={{
//                             padding: "0.5rem",
//                             borderBottom:
//                               i < dateRange[1].diff(dateRange[0], "day")
//                                 ? "1px solid #e6e9ee"
//                                 : "none",
//                           }}
//                         >
//                           <span
//                             style={{
//                               fontSize: "0.95rem",
//                               color: "#1a1a2e",
//                             }}
//                           >
//                             <strong>{day}</strong>:{" "}
//                             {startTime && endTime
//                               ? `${startTime.format(
//                                   timeFormat
//                                 )} - ${endTime.format(timeFormat)}`
//                               : "Not specified"}
//                           </span>
//                         </div>
//                       );
//                     }
//                   )}
//               </div>
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
//                   renderItem={(item, index) => {
//                     const cosplayer = selectedRequests
//                       .flatMap((req) => req.cosplayers)
//                       .find((c) => c.id === item.cosplayerId);
//                     return (
//                       <List.Item
//                         key={index}
//                         actions={[
//                           <Button
//                             type="link"
//                             icon={<CloseOutlined />}
//                             onClick={() =>
//                               handleRemoveCosplayer(
//                                 item.cosplayerId,
//                                 item.characterId
//                               )
//                             }
//                             style={{
//                               color: "#510545",
//                             }}
//                           />,
//                         ]}
//                         style={{
//                           padding: "0.5rem",
//                           borderBottom:
//                             index < modalData.listRequestCharacters.length - 1
//                               ? "1px solid #e6e9ee"
//                               : "none",
//                         }}
//                       >
//                         <span
//                           style={{
//                             color: "#1a1a2e",
//                             fontSize: "0.95rem",
//                           }}
//                         >
//                           {cosplayer?.name || "Unknown Cosplayer"} as{" "}
//                           {
//                             characters.find((c) => c.id === item.characterId)
//                               ?.name
//                           }{" "}
//                           - Hourly Rate: {cosplayer?.salaryIndex || "N/A"} -
//                           Quantity: {item.quantity} - Price:{" "}
//                           {cosplayerPrices[
//                             item.cosplayerId
//                           ]?.toLocaleString() || "Loading..."}{" "}
//                           VND
//                         </span>
//                       </List.Item>
//                     );
//                   }}
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
//                 {Object.values(cosplayerPrices)
//                   .reduce((sum, price) => sum + price, 0)
//                   .toLocaleString() || 0}{" "}
//                 VND
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
//                 Select Deposit Percentage:
//               </label>
//               <Radio.Group
//                 onChange={(e) => setDepositPercentage(e.target.value)}
//                 value={depositPercentage}
//                 style={{ display: "flex", gap: "1rem" }}
//               >
//                 <Radio value="30">30%</Radio>
//                 <Radio value="50">50%</Radio>
//                 <Radio value="70">70%</Radio>
//               </Radio.Group>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default CosplayersPage;

// hiển thị hình ảnh char
// import React, { useState, useEffect, useMemo } from "react";
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
//   Select,
//   Rate,
//   Radio,
//   Flex,
// } from "antd";
// import {
//   LoadingOutlined,
//   SearchOutlined,
//   CloseOutlined,
// } from "@ant-design/icons";
// import { jwtDecode } from "jwt-decode";
// import dayjs from "dayjs";
// import "../../styles/CosplayersPage.scss";
// import HireCosplayerService from "../../services/HireCosplayerService/HireCosplayerService.js";
// import LocationPickerService from "../../components/LocationPicker/LocationPickerService.js";
// import { toast } from "react-toastify";

// const { RangePicker: DateRangePicker } = DatePicker;
// const { RangePicker: TimeRangePicker } = TimePicker;
// const { Option } = Select;

// const DEFAULT_AVATAR_URL =
//   "https://pm1.narvii.com/6324/0d7f51553b6ca0785d3912929088c25acc1bc53f_hq.jpg";

// const CosplayersPage = () => {
//   const [cosplayers, setCosplayers] = useState([]);
//   const [characters, setCharacters] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [dateRange, setDateRange] = useState(null);
//   const [timeRanges, setTimeRanges] = useState({});
//   const [location, setLocation] = useState("");
//   const [districts, setDistricts] = useState([]);
//   const [streets, setStreets] = useState([]);
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   const [selectedStreet, setSelectedStreet] = useState(null);
//   const [characterSearchQuery, setCharacterSearchQuery] = useState("");
//   const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
//   const [currentCosplayerPage, setCurrentCosplayerPage] = useState(1);
//   const [currentStep, setCurrentStep] = useState(1);
//   const [selectedRequests, setSelectedRequests] = useState([]);
//   const [currentCharacter, setCurrentCharacter] = useState(null);
//   const [filteredCosplayers, setFilteredCosplayers] = useState([]);
//   const [selectedCosplayerIds, setSelectedCosplayerIds] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [modalData, setModalData] = useState({
//     description: "",
//     listRequestCharacters: [],
//     name: "",
//   });
//   const [characterDetails, setCharacterDetails] = useState({}); // New state for detailed character data

//   const [accountId, setAccountId] = useState(null);
//   const [cosplayerPrices, setCosplayerPrices] = useState({});
//   const [cosplayerDataCache, setCosplayerDataCache] = useState({});
//   const [sortBy, setSortBy] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [depositPercentage, setDepositPercentage] = useState("50");
//   const [houseNumber, setHouseNumber] = useState("");
//   const serviceId = "S002";
//   const packageId = "";
//   const dateFormat = "DD/MM/YYYY";
//   const timeFormat = "HH:mm";
//   const characterPageSize = 9;
//   const cosplayerPageSize = 8;

//   useEffect(() => {
//     const fetchDistricts = async () => {
//       try {
//         const districtsData = await LocationPickerService.getDistricts();
//         setDistricts(districtsData);
//       } catch (err) {
//         console.error("Failed to fetch districts:", err);
//         console.log("Failed to load districts. Please try again.");
//       }
//     };
//     fetchDistricts();
//   }, []);

//   useEffect(() => {
//     const fetchStreets = async () => {
//       if (selectedDistrict) {
//         try {
//           const streetsData = await LocationPickerService.getStreets(
//             selectedDistrict
//           );
//           setStreets(streetsData);
//         } catch (err) {
//           console.error("Failed to fetch streets:", err);
//           console.log("Failed to load streets. Please try again.");
//           setStreets([]);
//         }
//       } else {
//         setStreets([]);
//         setSelectedStreet(null);
//       }
//     };
//     fetchStreets();
//   }, [selectedDistrict]);

//   useEffect(() => {
//     if (selectedDistrict && selectedStreet && houseNumber.trim()) {
//       const districtName =
//         districts.find((d) => d.id === selectedDistrict)?.name || "";
//       const streetName =
//         streets.find((s) => s.id === selectedStreet)?.name || "";
//       const newLocation = `${houseNumber}, ${streetName}, ${districtName}, TP.HCM`;
//       setLocation(newLocation);
//       setCurrentStep(5);
//     } else {
//       setLocation("");
//     }
//   }, [selectedDistrict, selectedStreet, houseNumber, districts, streets]);

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       setError("You need to log in to access this page.");
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
//       setIsLoading(true);
//       try {
//         const charactersData = await HireCosplayerService.getAllCharacters();
//         const mappedCharacters = charactersData
//           .filter((character) => character.quantity >= 1)
//           .map((character) => ({
//             id: character.characterId,
//             name: character.characterName,
//             minHeight: character.minHeight,
//             maxHeight: character.maxHeight,
//             minWeight: character.minWeight,
//             maxWeight: character.maxWeight,
//             price: character.price,
//             quantity: character.quantity,
//           }));
//         setCharacters(mappedCharacters);

//         // Fetch detailed data for each character
//         const details = {};
//         await Promise.all(
//           mappedCharacters.map(async (character) => {
//             try {
//               const detail = await HireCosplayerService.getCharacterById(
//                 character.id
//               );
//               details[character.id] = {
//                 ...detail,
//                 images: detail.images || [],
//                 description: detail.description || "No description",
//               };
//             } catch (error) {
//               console.error(
//                 `Failed to fetch details for character ${character.id}:`,
//                 error
//               );
//               details[character.id] = {
//                 characterId: character.id,
//                 characterName: character.name,
//                 description: "No description",
//                 images: [],
//                 minHeight: character.minHeight,
//                 maxHeight: character.maxHeight,
//                 minWeight: character.minWeight,
//                 maxWeight: character.maxWeight,
//                 price: character.price,
//                 quantity: character.quantity,
//               };
//             }
//           })
//         );
//         setCharacterDetails(details);
//       } catch (err) {
//         setError("Unable to load characters. Please try again later.");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCharacters();
//   }, []);

//   const fetchCosplayersByCharacterAndTime = async (characterId) => {
//     if (!dateRange || Object.keys(timeRanges).length === 0 || !characterId) {
//       setFilteredCosplayers([]);
//       setCosplayers([]);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Generate date and time ranges for API
//       const dates = [];
//       const startDate = dateRange[0];
//       const endDate = dateRange[1];
//       const days = endDate.diff(startDate, "day") + 1;

//       for (let i = 0; i < days; i++) {
//         const day = startDate.add(i, "day").format(dateFormat);
//         const [startTime, endTime] = timeRanges[day] || [];
//         if (startTime && endTime) {
//           dates.push({
//             startDate: `${startTime.format(timeFormat)} ${day}`,
//             endDate: `${endTime.format(timeFormat)} ${day}`,
//           });
//         }
//       }

//       if (dates.length === 0) {
//         throw new Error("No valid date and time ranges provided.");
//       }

//       // Fetch booked cosplayers
//       const conflicts =
//         await HireCosplayerService.getAllRequestCharacterByListDate(dates);
//       const bookedCosplayerIds = new Set(
//         conflicts
//           .map((conflict) => conflict.cosplayerId)
//           .filter(Boolean)
//           .map((id) => id.toString().toLowerCase())
//       );

//       // Fetch character details
//       const character = characters.find((char) => char.id === characterId);
//       if (!character) {
//         throw new Error("Character not found");
//       }

//       // Get existing cosplayer IDs from selected requests
//       const existingCosplayerIds = selectedRequests
//         .flatMap((req) => req.cosplayers)
//         .map((cosplayer) => cosplayer.id.toString().toLowerCase());

//       // Fetch cosplayers via ChangeCosplayer API
//       const requestData = {
//         characterId: character.id,
//         dates: dates,
//         accountId:
//           selectedCosplayerIds.length > 0 ? selectedCosplayerIds.join(",") : "",
//       };

//       const cosplayersData = await HireCosplayerService.ChangeCosplayer(
//         requestData
//       );

//       // Deduplicate cosplayers
//       const uniqueCosplayers = cosplayersData.reduce((acc, cosplayer) => {
//         if (!acc.some((c) => c.accountId === cosplayer.accountId)) {
//           acc.push(cosplayer);
//         }
//         return acc;
//       }, []);

//       // Map cosplayers
//       const mappedCosplayers = uniqueCosplayers.map((cosplayer) => ({
//         id: cosplayer.accountId,
//         name: cosplayer.name,
//         avatar: cosplayer.images[0]?.urlImage || DEFAULT_AVATAR_URL,
//         description: cosplayer.description || "No description",
//         height: cosplayer.height,
//         weight: cosplayer.weight,
//         salaryIndex: cosplayer.salaryIndex,
//         averageStar: cosplayer.averageStar || 0,
//       }));

//       // Update cosplayer data cache
//       const newCache = { ...cosplayerDataCache };
//       uniqueCosplayers.forEach((cosplayer) => {
//         newCache[cosplayer.accountId] = {
//           salaryIndex: cosplayer.salaryIndex || 1,
//           name: cosplayer.name,
//         };
//       });
//       setCosplayerDataCache(newCache);

//       // Filter cosplayers
//       const filtered = mappedCosplayers.filter(
//         (cosplayer) =>
//           !existingCosplayerIds.includes(
//             cosplayer.id.toString().toLowerCase()
//           ) &&
//           !bookedCosplayerIds.has(cosplayer.id.toString().toLowerCase()) &&
//           cosplayer.height >= character.minHeight &&
//           cosplayer.height <= character.maxHeight &&
//           cosplayer.weight >= character.minWeight &&
//           cosplayer.weight <= character.maxWeight
//       );

//       setCosplayers(mappedCosplayers);
//       setFilteredCosplayers(filtered);

//       if (filtered.length === 0) {
//         setError(
//           "No cosplayers available for this character and time slot. Try adjusting the time or character."
//         );
//       } else {
//         setError(null);
//       }
//     } catch (err) {
//       setError("Unable to load cosplayers. Please try again later.");
//       console.error(err);
//       toast.error(err.message || "Failed to load cosplayers.");
//       setFilteredCosplayers([]);
//       setCosplayers([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const calculateTotalHours = useMemo(() => {
//     if (!dateRange || !timeRanges) return 0;

//     let totalHours = 0;
//     const startDate = dateRange[0];
//     const endDate = dateRange[1];
//     const days = endDate.diff(startDate, "day") + 1;

//     for (let i = 0; i < days; i++) {
//       const day = startDate.add(i, "day").format(dateFormat);
//       const [startTime, endTime] = timeRanges[day] || [];
//       if (startTime && endTime) {
//         totalHours += endTime.diff(startTime, "hour", true);
//       }
//     }
//     return totalHours;
//   }, [dateRange, timeRanges]);

//   const calculateTotalDays = useMemo(() => {
//     if (!dateRange) return 0;

//     const startDate = dateRange[0];
//     const endDate = dateRange[1];
//     return endDate.diff(startDate, "day") + 1;
//   }, [dateRange]);

//   const calculateUnitPrice = (cosplayer, characterId) => {
//     const character = characters.find((char) => char.id === characterId);
//     if (!character || !cosplayer.salaryIndex) return 0;

//     const totalHours = calculateTotalHours;
//     const totalDays = calculateTotalDays;
//     const unitPrice =
//       totalHours * cosplayer.salaryIndex + totalDays * character.price;
//     return unitPrice;
//   };

//   useEffect(() => {
//     if (sortBy && filteredCosplayers.length > 0) {
//       const sortedCosplayers = [...filteredCosplayers].sort((a, b) => {
//         const valueA = a[sortBy];
//         const valueB = b[sortBy];
//         return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
//       });
//       setFilteredCosplayers(sortedCosplayers);
//     }
//   }, [sortBy, sortOrder]);

//   const handleCancelSort = () => {
//     setSortBy("");
//     setSortOrder("asc");
//     if (currentCharacter?.characterId) {
//       fetchCosplayersByCharacterAndTime(currentCharacter.characterId);
//     }
//   };

//   useEffect(() => {
//     const fetchCosplayerPrices = () => {
//       if (isModalVisible && modalData.listRequestCharacters.length > 0) {
//         const prices = {};
//         modalData.listRequestCharacters.forEach((item) => {
//           const cosplayerData = cosplayerDataCache[item.cosplayerId];
//           const salaryIndex = cosplayerData?.salaryIndex || 1;
//           const character = characters.find(
//             (char) => char.id === item.characterId
//           );
//           const totalHours = calculateTotalHours;
//           const totalDays = calculateTotalDays;
//           prices[item.cosplayerId] =
//             (totalHours * salaryIndex + totalDays * (character?.price || 0)) *
//             item.quantity;
//         });
//         setCosplayerPrices(prices);
//       }
//     };
//     fetchCosplayerPrices();
//   }, [isModalVisible, modalData.listRequestCharacters, cosplayerDataCache]);

//   const filteredCharacters = characters.filter(
//     (char) =>
//       char.name.toLowerCase().includes(characterSearchQuery.toLowerCase()) &&
//       char.quantity >= 1
//   );

//   const paginatedCharacters = filteredCharacters.slice(
//     (currentCharacterPage - 1) * characterPageSize,
//     currentCharacterPage * characterPageSize
//   );

//   const paginatedCosplayers = filteredCosplayers.slice(
//     (currentCosplayerPage - 1) * cosplayerPageSize,
//     currentCosplayerPage * cosplayerPageSize
//   );

//   const disabledDate = (current) => {
//     if (!current) return false;

//     const today = dayjs().startOf("day");
//     const minStartDate = today.add(4, "day");
//     const maxStartDate = minStartDate.add(13, "day");

//     if (current < minStartDate) {
//       return true;
//     }

//     if (!dateRange || !dateRange[0]) {
//       return current > maxStartDate;
//     }

//     const startDate = dateRange[0];
//     const maxEndDate = startDate.add(13, "day");
//     return current < startDate || current > maxEndDate;
//   };

//   const disabledTime = () => {
//     const startHour = 8;
//     const endHour = 22;

//     return {
//       disabledHours: () => {
//         const hours = [];
//         for (let i = 0; i < 24; i++) {
//           if (i < startHour || i > endHour) {
//             hours.push(i);
//           }
//         }
//         return hours;
//       },
//       disabledMinutes: (selectedHour) => {
//         if (selectedHour === startHour || selectedHour === endHour) {
//           return Array.from({ length: 60 }, (_, i) => i).filter(
//             (minute) => minute !== 0
//           );
//         }
//         return [];
//       },
//     };
//   };

//   const handleDateRangeChange = (dates) => {
//     if (!dates) {
//       setDateRange(null);
//       setTimeRanges({});
//       return;
//     }

//     const [start, end] = dates;
//     const today = dayjs().startOf("day");
//     const minStartDate = today.add(4, "day");
//     const maxStartDate = minStartDate.add(13, "day");

//     if (start.isBefore(minStartDate, "day")) {
//       toast.warn("Start date must be at least 4 days from today!");
//       setDateRange(null);
//       return;
//     }

//     if (start.isAfter(maxStartDate, "day")) {
//       toast.error("Start date cannot be more than 14 days ");
//       setDateRange(null);
//       return;
//     }

//     if (end.isBefore(start, "day")) {
//       toast.warn("End date must be on or after start date!");
//       setDateRange(null);
//       return;
//     }

//     const maxEndDate = start.add(13, "day");
//     if (end.isAfter(maxEndDate, "day")) {
//       toast.warn("End date cannot be more than 14 days from start date!");
//       setDateRange(null);
//       return;
//     }

//     const daysDifference = end.diff(start, "day") + 1;
//     if (daysDifference > 5) {
//       toast.warn("Rental period cannot exceed 5 days!");
//       setDateRange(null);
//       return;
//     }

//     setDateRange(dates);
//     setTimeRanges({});
//     setCurrentStep(2);
//   };

//   const handleDistrictChange = (value) => {
//     setSelectedDistrict(value);
//     setSelectedStreet(null);
//     if (!value) {
//       setLocation("");
//       setStreets([]);
//     }
//   };

//   const handleStreetChange = (value) => {
//     setSelectedStreet(value);
//     if (!value) {
//       setLocation("");
//     }
//   };

//   const handleCharacterSelect = (character) => {
//     if (currentCharacter?.characterId === character.id) {
//       setCurrentCharacter(null);
//       setSelectedCosplayerIds([]);

//       setCurrentCosplayerPage(1);
//       setCurrentStep(5);
//       setFilteredCosplayers([]);
//       setCosplayers([]);
//       setSortBy("");
//       setSortOrder("asc");
//     } else {
//       setCurrentCharacter({
//         characterId: character.id,
//         characterName: character.name,
//       });
//       setSelectedCosplayerIds([]);

//       setCurrentCosplayerPage(1);
//       fetchCosplayersByCharacterAndTime(character.id);
//       setCurrentStep(6);
//       setSortBy("");
//       setSortOrder("asc");
//     }
//   };

//   const handleCosplayerSelect = (cosplayerId) => {
//     const character = characters.find(
//       (char) => char.id === currentCharacter?.characterId
//     );
//     if (!character) {
//       console.log("Nhân vật không được tìm thấy!");
//       return;
//     }

//     const existingCosplayersForCharacter = selectedRequests
//       .filter((req) => req.characterId === currentCharacter.characterId)
//       .flatMap((req) => req.cosplayers).length;

//     const currentSelectedCount = selectedCosplayerIds.length;
//     const isSelecting = !selectedCosplayerIds.includes(cosplayerId);

//     if (
//       isSelecting &&
//       currentSelectedCount + existingCosplayersForCharacter >=
//         character.quantity
//     ) {
//       toast.warn(
//         `You can only select up to ${character.quantity} cosplayers for character ${character.name}! `
//       );
//       return;
//     }

//     setSelectedCosplayerIds((prev) =>
//       prev.includes(cosplayerId)
//         ? prev.filter((id) => id !== cosplayerId)
//         : [...prev, cosplayerId]
//     );
//   };

//   const handleAddCosplayers = () => {
//     if (selectedCosplayerIds.length === 0) {
//       toast.warn("Please select at least one cosplayer!");
//       return;
//     }

//     const character = characters.find(
//       (char) => char.id === currentCharacter?.characterId
//     );
//     if (!character) {
//       console.log("Nhân vật không được tìm thấy!");
//       return;
//     }

//     // Đếm số cosplayer đã chọn cho nhân vật này trong selectedRequests
//     const existingCosplayersForCharacter = selectedRequests
//       .filter((req) => req.characterId === currentCharacter.characterId)
//       .flatMap((req) => req.cosplayers).length;

//     const totalSelectedCosplayers =
//       existingCosplayersForCharacter + selectedCosplayerIds.length;

//     if (totalSelectedCosplayers > character.quantity) {
//       toast.warn(
//         `You can only select up to ${character.quantity} cosplayers for character ${character.name}!`
//       );
//       return;
//     }

//     const selectedCosplayerDetails = selectedCosplayerIds.map((id) => {
//       const cosplayer = filteredCosplayers.find((c) => c.id === id);
//       return { id, name: cosplayer.name, salaryIndex: cosplayer.salaryIndex };
//     });

//     setSelectedRequests((prev) => [
//       ...prev,
//       {
//         characterId: currentCharacter.characterId,
//         characterName: currentCharacter.characterName,
//         cosplayers: selectedCosplayerDetails,
//       },
//     ]);

//     const newPrices = { ...cosplayerPrices };
//     selectedCosplayerDetails.forEach((cosplayer) => {
//       const character = characters.find(
//         (char) => char.id === currentCharacter.characterId
//       );
//       const totalHours = calculateTotalHours;
//       const totalDays = calculateTotalDays;
//       newPrices[cosplayer.id] =
//         (totalHours * cosplayer.salaryIndex +
//           totalDays * (character?.price || 0)) *
//         1;
//     });
//     setCosplayerPrices(newPrices);

//     setCurrentStep(5);
//     setSelectedCosplayerIds([]);

//     setCurrentCosplayerPage(1);
//     setCurrentCharacter(null);
//     setFilteredCosplayers([]);
//     setCosplayers([]);
//     setSortBy("");
//     setSortOrder("asc");
//   };

//   const handleSendRequest = () => {
//     if (!dateRange || Object.keys(timeRanges).length === 0 || !location) {
//       toast.warn(
//         "Please fill in all required fields (date, time per day, house number, district, and street)!"
//       );
//       return;
//     }
//     if (!houseNumber.trim()) {
//       toast.error("Please enter house number!");
//       return;
//     }
//     if (selectedRequests.length === 0) {
//       console.log("Please select at least one character and cosplayer!");
//       return;
//     }
//     setModalData((prev) => ({
//       ...prev,
//       listRequestCharacters: selectedRequests.flatMap((req) =>
//         req.cosplayers.map((cosplayer) => ({
//           characterId: req.characterId,
//           cosplayerId: cosplayer.id,
//           description: "",
//           quantity: 1,
//         }))
//       ),
//       startDate: dateRange[0].format(dateFormat),
//       endDate: dateRange[1].format(dateFormat),
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
//     setSelectedRequests((prev) =>
//       prev
//         .map((req) => ({
//           ...req,
//           cosplayers: req.cosplayers.filter(
//             (cosplayer) => cosplayer.id !== cosplayerId
//           ),
//         }))
//         .filter((req) => req.cosplayers.length > 0)
//     );
//     setCosplayerPrices((prev) => {
//       const newPrices = { ...prev };
//       delete newPrices[cosplayerId];
//       return newPrices;
//     });
//   };

//   const applySameTimeToAll = () => {
//     if (!dateRange || !dateRange[0] || !dateRange[1]) {
//       toast.warn("Please select a valid date range!");
//       return;
//     }

//     const totalDays = dateRange[1].diff(dateRange[0], "day") + 1;
//     if (totalDays <= 1) {
//       toast.info("This feature is only available for multiple days!");
//       return;
//     }

//     const firstDay = dateRange[0].format(dateFormat);
//     const firstTimeRange = timeRanges[firstDay];

//     if (!firstTimeRange || !firstTimeRange[0] || !firstTimeRange[1]) {
//       toast.warn("Please select a valid time range for the first day!");
//       return;
//     }

//     const startTime = firstTimeRange[0]; // Define startTime
//     const endTime = firstTimeRange[1]; // Define endTime

//     if (endTime.isBefore(startTime)) {
//       toast.warn("End time must be after start time for the first day!");
//       return;
//     }

//     if (endTime.isSame(startTime)) {
//       toast.warn(
//         "End time cannot be the same as start time for the first day!"
//       );
//       return;
//     }

//     const newTimeRanges = { ...timeRanges };
//     for (let i = 0; i < totalDays; i++) {
//       const day = dateRange[0].add(i, "day").format(dateFormat);
//       newTimeRanges[day] = [dayjs(startTime), dayjs(endTime)];
//     }

//     setTimeRanges(newTimeRanges);

//     const allDaysFilled = Array.from({ length: totalDays }, (_, j) =>
//       dateRange[0].add(j, "day").format(dateFormat)
//     ).every((d) => {
//       const range = newTimeRanges[d];
//       return (
//         range &&
//         Array.isArray(range) &&
//         range.length === 2 &&
//         range[0] &&
//         range[1] &&
//         !range[1].isSame(range[0])
//       );
//     });

//     if (allDaysFilled) {
//       setCurrentStep(3);
//     }

//     toast.success("Time ranges applied to all days!");
//   };

//   const handleModalConfirm = async () => {
//     if (modalData.listRequestCharacters.length === 0) {
//       toast.warn(
//         "Please select at least one cosplayer before submitting a request!"
//       );
//       return;
//     }

//     if (!modalData.name.trim()) {
//       toast.warn("Name cannot be blank!");
//       return;
//     }

//     if (!accountId) {
//       toast.error("Cannot send request: Missing user ID. Please log in again.");
//       return;
//     }

//     if (!dateRange || !dateRange[0] || !dateRange[1]) {
//       toast.warn("Please select a valid time period!");
//       return;
//     }

//     // Validate character counts
//     const characterCounts = {};
//     modalData.listRequestCharacters.forEach((item) => {
//       characterCounts[item.characterId] =
//         (characterCounts[item.characterId] || 0) + 1;
//     });

//     for (const [characterId, count] of Object.entries(characterCounts)) {
//       const character = characters.find((c) => c.id === characterId);
//       if (character && count > character.quantity) {
//         toast.warn(
//           `The number of cosplayers for character ${character.name} exceeds inventory (${character.quantity})!`
//         );
//         return;
//       }
//     }

//     // Validate dates
//     const startDate = dateRange[0];
//     const endDate = dateRange[1];
//     const today = dayjs().startOf("day");
//     const minStartDate = today.add(4, "day");
//     const maxStartDate = minStartDate.add(13, "day");

//     if (startDate.isBefore(minStartDate, "day")) {
//       toast.error("Start date must be at least 4 days from today!");
//       return;
//     }

//     if (startDate.isAfter(maxStartDate, "day")) {
//       toast.warn("Start date cannot be more than 14 days from today!");
//       return;
//     }

//     if (endDate.isBefore(startDate, "day")) {
//       toast.warn("The end date must be on or after the start date!");
//       return;
//     }

//     const maxEndDate = startDate.add(13, "day");
//     if (endDate.isAfter(maxEndDate, "day")) {
//       toast.warn(
//         "The end date cannot be more than 14 days from the start date!"
//       );
//       return;
//     }

//     const diffDays = endDate.diff(startDate, "day") + 1;
//     if (diffDays > 5) {
//       toast.error("Rental period must not exceed 5 days!");
//       return;
//     }

//     // Validate time ranges
//     const allDays = Array.from({ length: diffDays }, (_, i) =>
//       startDate.add(i, "day").format(dateFormat)
//     );
//     const missingTimeRanges = allDays.filter(
//       (day) => !timeRanges[day] || !timeRanges[day][0] || !timeRanges[day][1]
//     );
//     if (missingTimeRanges.length > 0) {
//       toast.error(
//         `Please select a time period for the following days: ${missingTimeRanges.join(
//           ", "
//         )}`
//       );
//       return;
//     }

//     const sameTimeRanges = allDays.filter((day) => {
//       const [startTime, endTime] = timeRanges[day] || [];
//       return startTime && endTime && startTime.isSame(endTime);
//     });
//     if (sameTimeRanges.length > 0) {
//       toast.info(
//         `Start and end times cannot overlap for the following days: ${sameTimeRanges.join(
//           ", "
//         )}`
//       );
//       return;
//     }

//     // Generate dates for conflict check
//     const dates = allDays.map((day) => {
//       const [startTime, endTime] = timeRanges[day];
//       return {
//         startDate: `${startTime.format(timeFormat)} ${day}`,
//         endDate: `${endTime.format(timeFormat)} ${day}`,
//       };
//     });

//     // Check for conflicts with booked cosplayers
//     try {
//       const conflicts =
//         await HireCosplayerService.getAllRequestCharacterByListDate(dates);
//       const bookedCosplayerIds = new Set(
//         conflicts
//           .map((conflict) => conflict.cosplayerId)
//           .filter(Boolean)
//           .map((id) => id.toString().toLowerCase())
//       );

//       const selectedCosplayerIdsSet = new Set(
//         modalData.listRequestCharacters.map((item) =>
//           item.cosplayerId.toString().toLowerCase()
//         )
//       );

//       const conflictingCosplayers = Array.from(selectedCosplayerIdsSet).filter(
//         (id) => bookedCosplayerIds.has(id)
//       );

//       if (conflictingCosplayers.length > 0) {
//         const conflictingNames = conflictingCosplayers
//           .map((id) => {
//             const cosplayer = filteredCosplayers.find(
//               (c) => c.id.toString().toLowerCase() === id
//             );
//             return cosplayer?.name || "Unknown Cosplayer";
//           })
//           .join(", ");
//         toast.error(
//           `The following cosplayers are already booked for the selected times: ${conflictingNames}. Please select different cosplayers or adjust the time.`
//         );
//         return;
//       }
//     } catch (error) {
//       console.error("Error checking cosplayer conflicts:", error);
//       toast.error("Failed to verify cosplayer availability. Please try again.");
//       return;
//     }

//     // Prepare request data
//     const totalPrice = Object.values(cosplayerPrices).reduce(
//       (sum, price) => sum + price,
//       0
//     );

//     const requestData = {
//       accountId: accountId,
//       name: modalData.name,
//       description: modalData.description || "No description",
//       price: totalPrice,
//       startDate: startDate.format(dateFormat),
//       endDate: endDate.format(dateFormat),
//       location: location,
//       deposit: depositPercentage,
//       charactersRentCosplayers: modalData.listRequestCharacters.map((item) => {
//         const listRequestDates = allDays.map((day) => {
//           const [startTime, endTime] = timeRanges[day];
//           return {
//             startDate: `${startTime.format(timeFormat)} ${day}`,
//             endDate: `${endTime.format(timeFormat)} ${day}`,
//           };
//         });
//         return {
//           characterId: item.characterId,
//           cosplayerId: item.cosplayerId,
//           description: item.description || "No description",
//           listRequestDates,
//         };
//       }),
//     };

//     // Send request
//     setIsSubmitting(true);
//     try {
//       console.log("Sending request at:", performance.now(), "ms");
//       console.log("requestData:", JSON.stringify(requestData, null, 2));
//       const response = await HireCosplayerService.NewSendRequestHireCosplayer(
//         requestData
//       );
//       console.log("Request completed at:", performance.now(), "ms");
//       toast.success("Request sent successfully!", {
//         autoClose: 3000,
//       });
//       setIsModalVisible(false);
//       setSelectedRequests([]);
//       setDateRange(null);
//       setTimeRanges({});
//       setLocation("");
//       setSelectedDistrict(null);
//       setSelectedStreet(null);
//       setSelectedCosplayerIds([]);
//       setCurrentCosplayerPage(1);
//       setCurrentCharacter(null);
//       setCosplayers([]);
//       setFilteredCosplayers([]);
//       setCosplayerPrices({});
//       setCosplayerDataCache({});
//       setSortBy("");
//       setSortOrder("asc");
//       setDepositPercentage("50");
//       setCurrentStep(1);
//     } catch (error) {
//       console.error("Failed to send request:", error.message);
//       toast.error(`Failed to send request`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <div
//         className="cosplay-rental-page min-vh-100"
//         style={{ padding: "50px" }}
//       >
//         <Alert
//           message="Authentication Error"
//           description={error || "You need to log in to access this page."}
//           type="error"
//           showIcon
//         />
//       </div>
//     );
//   }

//   if (isLoading) {
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
//             Book your favorite cosplayers for your event
//           </p>
//         </div>
//       </div>

//       <div className="container py-5">
//         <div className="filter-section mb-5">
//           {currentStep >= 1 && (
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
//           {currentStep >= 2 && dateRange && (
//             <div className="filter-card">
//               <Flex
//                 align="center"
//                 justify="space-between"
//                 style={{ marginBottom: "16px" }}
//               >
//                 <h3 className="section-title">Select Time for Each Day:</h3>
//                 {dateRange[1].diff(dateRange[0], "day") + 1 > 1 && (
//                   <Button
//                     type="primary"
//                     onClick={applySameTimeToAll}
//                     disabled={
//                       !timeRanges[dateRange[0].format(dateFormat)]?.[0] ||
//                       !timeRanges[dateRange[0].format(dateFormat)]?.[1] ||
//                       timeRanges[dateRange[0].format(dateFormat)]?.[1].isBefore(
//                         timeRanges[dateRange[0].format(dateFormat)]?.[0]
//                       ) ||
//                       timeRanges[dateRange[0].format(dateFormat)]?.[1].isSame(
//                         timeRanges[dateRange[0].format(dateFormat)]?.[0]
//                       )
//                     }
//                   >
//                     Same Time
//                   </Button>
//                 )}
//               </Flex>
//               {Array.from(
//                 { length: dateRange[1].diff(dateRange[0], "day") + 1 },
//                 (_, i) => {
//                   const day = dateRange[0].add(i, "day").format(dateFormat);
//                   return (
//                     <div
//                       key={day}
//                       style={{
//                         marginBottom: "16px",
//                         textAlign: "center",
//                         flexDirection: "row",
//                         margin: "0 15px",
//                         alignItems: "center",
//                       }}
//                     >
//                       <h5>{day}</h5>
//                       <Flex gap={8} align="center" justify="center">
//                         <TimeRangePicker
//                           style={{ width: "103%" }}
//                           value={timeRanges[day] || null}
//                           onChange={(times) => {
//                             if (times && times[0] && times[1]) {
//                               const startTime = times[0]; // Define startTime
//                               const endTime = times[1]; // Define endTime
//                               if (endTime.isBefore(startTime)) {
//                                 toast.warn(
//                                   "End time must be after start time!"
//                                 );
//                                 return;
//                               }
//                               if (endTime.isSame(startTime)) {
//                                 console.log(
//                                   "End time cannot be the same as start time!"
//                                 );
//                                 return;
//                               }
//                               const newTimeRanges = {
//                                 ...timeRanges,
//                                 [day]: [startTime, endTime],
//                               };
//                               setTimeRanges(newTimeRanges);

//                               const totalDays =
//                                 dateRange[1].diff(dateRange[0], "day") + 1;
//                               const allDays = Array.from(
//                                 { length: totalDays },
//                                 (_, j) =>
//                                   dateRange[0].add(j, "day").format(dateFormat)
//                               );
//                               const allDaysFilled = allDays.every((d) => {
//                                 const range = newTimeRanges[d];
//                                 return (
//                                   range &&
//                                   Array.isArray(range) &&
//                                   range.length === 2 &&
//                                   range[0] &&
//                                   range[1] &&
//                                   !range[1].isSame(range[0])
//                                 );
//                               });

//                               if (allDaysFilled) {
//                                 setCurrentStep(3);
//                               }
//                             } else {
//                               setTimeRanges((prev) => ({
//                                 ...prev,
//                                 [day]: times,
//                               }));
//                             }
//                           }}
//                           format={timeFormat}
//                           disabledTime={disabledTime}
//                           className="custom-time-picker"
//                           defaultValue={[
//                             dayjs("08:00", timeFormat),
//                             dayjs("22:00", timeFormat),
//                           ]}
//                         />
//                       </Flex>
//                     </div>
//                   );
//                 }
//               )}
//             </div>
//           )}
//           {currentStep >= 3 && (
//             <div className="filter-card">
//               <h3 className="section-title">Select Location:</h3>
//               <Row gutter={16}>
//                 <Col xs={24} sm={8}>
//                   <Select
//                     placeholder="Select District"
//                     value={selectedDistrict}
//                     onChange={handleDistrictChange}
//                     style={{ width: "100%", marginBottom: "16px" }}
//                     allowClear
//                     showSearch
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option.children
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     }
//                   >
//                     {districts.map((district) => (
//                       <Option key={district.id} value={district.id}>
//                         {district.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Col>
//                 <Col xs={24} sm={8}>
//                   <Select
//                     placeholder="Select Ward"
//                     value={selectedStreet}
//                     onChange={handleStreetChange}
//                     style={{ width: "100%" }}
//                     allowClear
//                     showSearch
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option.children
//                         .toLowerCase()
//                         .includes(input.toLowerCase())
//                     }
//                     disabled={!selectedDistrict}
//                   >
//                     {streets.map((street) => (
//                       <Option key={street.id} value={street.id}>
//                         {street.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Col>
//                 <Col xs={24} sm={8}>
//                   <Input
//                     placeholder="Enter Address, Street ..."
//                     value={houseNumber}
//                     onChange={(e) => setHouseNumber(e.target.value)}
//                     style={{ width: "100%", marginBottom: "16px" }}
//                     allowClear
//                   />
//                 </Col>
//               </Row>
//               {location && (
//                 <div style={{ marginTop: "8px" }}>
//                   <strong>Selected Location:</strong> {location}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {currentStep >= 5 && (
//           <div className="character-selection-card mb-5">
//             <Row align="middle" gutter={16} className="mb-4">
//               <Col>
//                 <h3 className="section-title">Select Character:</h3>
//               </Col>
//               <Col>
//                 <Input
//                   placeholder="Search characters"
//                   value={characterSearchQuery}
//                   onChange={(e) => {
//                     setCharacterSearchQuery(e.target.value);
//                     setCurrentCharacterPage(1);
//                   }}
//                   prefix={<SearchOutlined />}
//                   className="custom-input-search"
//                 />
//               </Col>
//             </Row>
//             <Row gutter={[16, 16]}>
//               {paginatedCharacters.map((character) => {
//                 const detail = characterDetails[character.id] || {};
//                 const characterImage =
//                   detail.images?.find((img) => img.isAvatar)?.urlImage ||
//                   detail.images?.[0]?.urlImage ||
//                   DEFAULT_AVATAR_URL;
//                 return (
//                   <Col xs={24} sm={12} md={8} key={character.id}>
//                     <div
//                       className={`character-card ${
//                         currentCharacter?.characterId === character.id
//                           ? "active"
//                           : ""
//                       } ${
//                         selectedRequests.some(
//                           (r) => r.characterId === character.id
//                         )
//                           ? "selected"
//                           : ""
//                       }`}
//                       onClick={() => handleCharacterSelect(character)}
//                     >
//                       <div className="card-inner">
//                         <div className="card-front">
//                           <img
//                             src={characterImage}
//                             alt={character.name}
//                             className="card-img-top"
//                             onError={(e) => (e.target.src = DEFAULT_AVATAR_URL)}
//                           />
//                           <div className="card-content">
//                             <h3>{character.name}</h3>

//                             <p className="character-height">
//                               Height: {character.minHeight || "N/A"} -{" "}
//                               {character.maxHeight || "N/A"} cm
//                             </p>
//                             <p className="character-weight">
//                               Weight: {character.minWeight || "N/A"} -{" "}
//                               {character.maxWeight || "N/A"} kg
//                             </p>
//                             <p className="character-quantity">
//                               Quantity: {character.quantity}
//                             </p>
//                             <span className="category-badge">
//                               {character.price.toLocaleString()} VND
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </Col>
//                 );
//               })}
//             </Row>
//             <Pagination
//               current={currentCharacterPage}
//               pageSize={characterPageSize}
//               total={filteredCharacters.length}
//               onChange={(page) => setCurrentCharacterPage(page)}
//               className="custom-pagination"
//             />
//           </div>
//         )}

//         {currentStep >= 6 && (
//           <div className="cosplayer-selection">
//             <h3 className="section-title mb-4">
//               Available Cosplayers for {currentCharacter?.characterName}:
//             </h3>
//             {filteredCosplayers.length === 0 ? (
//               <div style={{ display: "flex" }}>
//                 <p>No cosplayers available for this character and time slot.</p>
//                 <div
//                   aria-label="Hamster running in wheel"
//                   role="img"
//                   className="unique-hamsterLoader__container"
//                 >
//                   <div className="unique-hamsterLoader__wheel"></div>
//                   <div className="unique-hamsterLoader__hamster">
//                     <div className="unique-hamsterLoader__body">
//                       <div className="unique-hamsterLoader__head">
//                         <div className="unique-hamsterLoader__ear"></div>
//                         <div className="unique-hamsterLoader__eye"></div>
//                         <div className="unique-hamsterLoader__nose"></div>
//                       </div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--fr"></div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--fl"></div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--br"></div>
//                       <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--bl"></div>
//                       <div className="unique-hamsterLoader__tail"></div>
//                     </div>
//                   </div>
//                   <div className="unique-hamsterLoader__spoke"></div>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <Row align="middle" gutter={16} className="mb-4">
//                   <Col>
//                     <Select
//                       value={sortBy || "Sort By"}
//                       onChange={(value) => setSortBy(value)}
//                       style={{ width: 150 }}
//                     >
//                       <Option value="Sort By" disabled>
//                         Sort By
//                       </Option>
//                       <Option value="height">Height</Option>
//                       <Option value="weight">Weight</Option>
//                       <Option value="salaryIndex">Hourly Rate</Option>
//                       <Option value="averageStar">Rating</Option>
//                     </Select>
//                   </Col>
//                   <Col>
//                     <Select
//                       value={sortOrder}
//                       onChange={(value) => setSortOrder(value)}
//                       style={{ width: 120 }}
//                     >
//                       <Option value="asc">Ascending</Option>
//                       <Option value="desc">Descending</Option>
//                     </Select>
//                   </Col>
//                   <Col>
//                     <Button onClick={handleCancelSort}>Cancel Sort</Button>
//                   </Col>
//                 </Row>
//                 <List
//                   grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
//                   dataSource={paginatedCosplayers}
//                   renderItem={(cosplayer) => (
//                     <List.Item key={cosplayer.id}>
//                       <Card
//                         className={`cosplayer-item ${
//                           selectedCosplayerIds.includes(cosplayer.id)
//                             ? "selected"
//                             : ""
//                         }`}
//                         onClick={() => handleCosplayerSelect(cosplayer.id)}
//                       >
//                         <img
//                           src={cosplayer.avatar}
//                           alt={cosplayer.name}
//                           className="cosplayer-avatar"
//                           onError={(e) => (e.target.src = DEFAULT_AVATAR_URL)}
//                         />
//                         <h5>{cosplayer.name}</h5>
//                         <p className="description">{cosplayer.description}</p>
//                         <p>
//                           Height: {cosplayer.height} cm - Weight:{" "}
//                           {cosplayer.weight} kg
//                         </p>
//                         <p>Hourly Rate: {cosplayer.salaryIndex} VND/h</p>
//                         <div style={{ display: "flex", alignItems: "center" }}>
//                           <span style={{ marginRight: "8px" }}>Rating:</span>
//                           <Rate
//                             disabled
//                             allowHalf
//                             value={cosplayer.averageStar}
//                           />
//                           <span style={{ marginLeft: "8px" }}>
//                             ({cosplayer.averageStar}/5)
//                           </span>
//                         </div>
//                       </Card>
//                     </List.Item>
//                   )}
//                 />
//                 <Pagination
//                   current={currentCosplayerPage}
//                   pageSize={cosplayerPageSize}
//                   total={filteredCosplayers.length}
//                   onChange={(page) => setCurrentCosplayerPage(page)}
//                   className="custom-pagination"
//                 />
//                 <Button
//                   type="primary"
//                   onClick={handleAddCosplayers}
//                   className="custom-btn-add mt-4"
//                 >
//                   Add Cosplayers & Select More
//                 </Button>
//               </>
//             )}
//           </div>
//         )}
//         {selectedRequests.length > 0 && (
//           <div className="request-summary mt-5">
//             <h3 className="section-title mb-4">Selected Requests:</h3>
//             <p
//               style={{
//                 fontStyle: "italic",
//                 color: "#888",
//                 marginBottom: "10px",
//               }}
//             >
//               Note: Price = (Total Hours × Hourly Rate) + (Total Days ×
//               Character Price)
//             </p>
//             <List
//               dataSource={selectedRequests}
//               renderItem={(req) => (
//                 <List.Item key={req.characterId}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       width: "100%",
//                     }}
//                   >
//                     <div style={{ flex: 1 }}>
//                       <strong>{req.characterName}</strong> - Cosplayers:{" "}
//                       {req.cosplayers.map((cosplayer, index) => (
//                         <span key={cosplayer.id}>
//                           {cosplayer.name} (Cosplayer Price:{" "}
//                           {calculateUnitPrice(
//                             cosplayer,
//                             req.characterId
//                           ).toLocaleString()}{" "}
//                           VND)
//                           {index < req.cosplayers.length - 1 ? ", " : ""}
//                         </span>
//                       ))}
//                     </div>
//                     <div>
//                       {req.cosplayers.map((cosplayer) => (
//                         <Button
//                           key={cosplayer.id}
//                           type="link"
//                           icon={<CloseOutlined />}
//                           onClick={() =>
//                             handleRemoveCosplayer(cosplayer.id, req.characterId)
//                           }
//                           style={{ color: "#510545", marginLeft: "10px" }}
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </List.Item>
//               )}
//             />
//             <Button
//               type="primary"
//               size="large"
//               onClick={handleSendRequest}
//               className="custom-btn-send mt-4"
//             >
//               Send Cosplayer Hire Request
//             </Button>
//           </div>
//         )}
//         <Modal
//           title="Confirm Request"
//           visible={isModalVisible}
//           onOk={handleModalConfirm}
//           onCancel={() => setIsModalVisible(false)}
//           okText="Send Request"
//           cancelText="Cancel"
//           okButtonProps={{ disabled: isSubmitting, loading: isSubmitting }}
//           style={{
//             fontFamily: "'Poppins', sans-serif",
//           }}
//           bodyStyle={{
//             background: "#fff",
//             borderRadius: "0 0 15px 15px",
//             padding: "1rem",
//             boxShadow: "0 10px 30px rgba(34, 102, 138, 0.2)",
//           }}
//           headerStyle={{
//             background: "linear-gradient(135deg, #510545, #22668a)",
//             borderRadius: "15px 15px 0 0",
//             padding: "1rem",
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
//                 Time Ranges Per Day:
//               </label>
//               <div
//                 style={{
//                   border: "1px solid #e6e9ee",
//                   borderRadius: "10px",
//                   padding: "0.5rem",
//                   background: "#f8f9fa",
//                 }}
//               >
//                 {dateRange &&
//                   Array.from(
//                     { length: dateRange[1].diff(dateRange[0], "day") + 1 },
//                     (_, i) => {
//                       const day = dateRange[0].add(i, "day").format(dateFormat);
//                       const [startTime, endTime] = timeRanges[day] || [];
//                       return (
//                         <div
//                           key={day}
//                           style={{
//                             padding: "0.5rem",
//                             borderBottom:
//                               i < dateRange[1].diff(dateRange[0], "day")
//                                 ? "1px solid #e6e9ee"
//                                 : "none",
//                           }}
//                         >
//                           <span
//                             style={{
//                               fontSize: "0.95rem",
//                               color: "#1a1a2e",
//                             }}
//                           >
//                             <strong>{day}</strong>:{" "}
//                             {startTime && endTime
//                               ? `${startTime.format(
//                                   timeFormat
//                                 )} - ${endTime.format(timeFormat)}`
//                               : "Not specified"}
//                           </span>
//                         </div>
//                       );
//                     }
//                   )}
//               </div>
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
//                   renderItem={(item, index) => {
//                     const cosplayer = selectedRequests
//                       .flatMap((req) => req.cosplayers)
//                       .find((c) => c.id === item.cosplayerId);
//                     return (
//                       <List.Item
//                         key={index}
//                         actions={[
//                           <Button
//                             type="link"
//                             icon={<CloseOutlined />}
//                             onClick={() =>
//                               handleRemoveCosplayer(
//                                 item.cosplayerId,
//                                 item.characterId
//                               )
//                             }
//                             style={{
//                               color: "#510545",
//                             }}
//                           />,
//                         ]}
//                         style={{
//                           padding: "0.5rem",
//                           borderBottom:
//                             index < modalData.listRequestCharacters.length - 1
//                               ? "1px solid #e6e9ee"
//                               : "none",
//                         }}
//                       >
//                         <span
//                           style={{
//                             color: "#1a1a2e",
//                             fontSize: "0.95rem",
//                           }}
//                         >
//                           {cosplayer?.name || "Unknown Cosplayer"} as{" "}
//                           {
//                             characters.find((c) => c.id === item.characterId)
//                               ?.name
//                           }{" "}
//                           - Hourly Rate: {cosplayer?.salaryIndex || "N/A"} -
//                           Quantity: {item.quantity} - Price:{" "}
//                           {cosplayerPrices[
//                             item.cosplayerId
//                           ]?.toLocaleString() || "Loading..."}{" "}
//                           VND
//                         </span>
//                       </List.Item>
//                     );
//                   }}
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
//                 {Object.values(cosplayerPrices)
//                   .reduce((sum, price) => sum + price, 0)
//                   .toLocaleString() || 0}{" "}
//                 VND
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
//                 Select Deposit Percentage:
//               </label>
//               <Radio.Group
//                 onChange={(e) => setDepositPercentage(e.target.value)}
//                 value={depositPercentage}
//                 style={{ display: "flex", gap: "1rem" }}
//               >
//                 <Radio value="30">30%</Radio>
//                 <Radio value="50">50%</Radio>
//                 <Radio value="70">70%</Radio>
//               </Radio.Group>
//             </div>
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default CosplayersPage;

// thêm view detail ===============================
import React, { useState, useEffect, useMemo } from "react";
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
  Select,
  Rate,
  Radio,
  Flex,
} from "antd";
import {
  LoadingOutlined,
  SearchOutlined,
  CloseOutlined,
  EyeFilled,
} from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import "../../styles/CosplayersPage.scss";
import HireCosplayerService from "../../services/HireCosplayerService/HireCosplayerService.js";
import LocationPickerService from "../../components/LocationPicker/LocationPickerService.js";
import { toast } from "react-toastify";
import ViewDetailCharacter from "../../components/ViewDetailCharacter/ViewDetailCharacter.js"; // Adjust path as needed

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;
const { Option } = Select;

const DEFAULT_AVATAR_URL =
  "https://pm1.narvii.com/6324/0d7f51553b6ca0785d3912929088c25acc1bc53f_hq.jpg";

const CosplayersPage = () => {
  const [cosplayers, setCosplayers] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [timeRanges, setTimeRanges] = useState({});
  const [location, setLocation] = useState("");
  const [districts, setDistricts] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [characterSearchQuery, setCharacterSearchQuery] = useState("");
  const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
  const [currentCosplayerPage, setCurrentCosplayerPage] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [filteredCosplayers, setFilteredCosplayers] = useState([]);
  const [selectedCosplayerIds, setSelectedCosplayerIds] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    description: "",
    listRequestCharacters: [],
    name: "",
  });
  const [characterDetails, setCharacterDetails] = useState({}); // New state for detailed character data

  const [accountId, setAccountId] = useState(null);
  const [cosplayerPrices, setCosplayerPrices] = useState({});
  const [cosplayerDataCache, setCosplayerDataCache] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [depositPercentage, setDepositPercentage] = useState("50");
  const [houseNumber, setHouseNumber] = useState("");
  const serviceId = "S002";
  const packageId = "";
  const dateFormat = "DD/MM/YYYY";
  const timeFormat = "HH:mm";
  const characterPageSize = 9;
  const cosplayerPageSize = 8;
  const [isViewModalVisible, setIsViewModalVisible] = useState(false); // New state for view modal
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const districtsData = await LocationPickerService.getDistricts();
        setDistricts(districtsData);
      } catch (err) {
        console.error("Failed to fetch districts:", err);
        console.log("Failed to load districts. Please try again.");
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchStreets = async () => {
      if (selectedDistrict) {
        try {
          const streetsData = await LocationPickerService.getStreets(
            selectedDistrict
          );
          setStreets(streetsData);
        } catch (err) {
          console.error("Failed to fetch streets:", err);
          console.log("Failed to load streets. Please try again.");
          setStreets([]);
        }
      } else {
        setStreets([]);
        setSelectedStreet(null);
      }
    };
    fetchStreets();
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedDistrict && selectedStreet && houseNumber.trim()) {
      const districtName =
        districts.find((d) => d.id === selectedDistrict)?.name || "";
      const streetName =
        streets.find((s) => s.id === selectedStreet)?.name || "";
      const newLocation = `${houseNumber}, ${streetName}, ${districtName}, TP.HCM`;
      setLocation(newLocation);
      setCurrentStep(5);
    } else {
      setLocation("");
    }
  }, [selectedDistrict, selectedStreet, houseNumber, districts, streets]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("You need to log in to access this page.");
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
      setIsLoading(true);
      try {
        const charactersData = await HireCosplayerService.getAllCharacters();
        const mappedCharacters = charactersData
          .filter((character) => character.quantity >= 1)
          .map((character) => ({
            id: character.characterId,
            name: character.characterName,
            minHeight: character.minHeight,
            maxHeight: character.maxHeight,
            minWeight: character.minWeight,
            maxWeight: character.maxWeight,
            price: character.price,
            quantity: character.quantity,
          }));
        setCharacters(mappedCharacters);

        // Lấy chi tiết cho từng character
        const details = {};
        await Promise.all(
          mappedCharacters.map(async (character) => {
            try {
              const detail = await HireCosplayerService.getCharacterById(
                character.id
              );
              details[character.id] = {
                characterId: detail.characterId,
                characterName: detail.characterName || character.name,
                description: detail.description || "No description",
                images: detail.images || [],
                minHeight: detail.minHeight || character.minHeight,
                maxHeight: detail.maxHeight || character.maxHeight,
                minWeight: detail.minWeight || character.minWeight,
                maxWeight: detail.maxWeight || character.maxWeight,
                price: detail.price || character.price,
                quantity: detail.quantity || character.quantity,
              };
              console.log(
                `Fetched details for character ${character.id}:`,
                details[character.id]
              ); // Debug
            } catch (error) {
              console.error(
                `Failed to fetch details for character ${character.id}:`,
                error
              );
              // Fallback nếu lỗi
              details[character.id] = {
                characterId: character.id,
                characterName: character.name,
                description: "No description",
                images: [],
                minHeight: character.minHeight,
                maxHeight: character.maxHeight,
                minWeight: character.minWeight,
                maxWeight: character.maxWeight,
                price: character.price,
                quantity: character.quantity,
              };
            }
          })
        );
        setCharacterDetails(details);
        console.log("All character details:", details); // Debug toàn bộ dữ liệu
      } catch (err) {
        setError("Unable to load characters. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const fetchCosplayersByCharacterAndTime = async (characterId) => {
    if (!dateRange || Object.keys(timeRanges).length === 0 || !characterId) {
      setFilteredCosplayers([]);
      setCosplayers([]);
      return;
    }

    setIsLoading(true);
    try {
      // Generate date and time ranges for API
      const dates = [];
      const startDate = dateRange[0];
      const endDate = dateRange[1];
      const days = endDate.diff(startDate, "day") + 1;

      for (let i = 0; i < days; i++) {
        const day = startDate.add(i, "day").format(dateFormat);
        const [startTime, endTime] = timeRanges[day] || [];
        if (startTime && endTime) {
          dates.push({
            startDate: `${startTime.format(timeFormat)} ${day}`,
            endDate: `${endTime.format(timeFormat)} ${day}`,
          });
        }
      }

      if (dates.length === 0) {
        throw new Error("No valid date and time ranges provided.");
      }

      // Fetch booked cosplayers
      const conflicts =
        await HireCosplayerService.getAllRequestCharacterByListDate(dates);
      const bookedCosplayerIds = new Set(
        conflicts
          .map((conflict) => conflict.cosplayerId)
          .filter(Boolean)
          .map((id) => id.toString().toLowerCase())
      );

      // Fetch character details
      const character = characters.find((char) => char.id === characterId);
      if (!character) {
        throw new Error("Character not found");
      }

      // Get existing cosplayer IDs from selected requests
      const existingCosplayerIds = selectedRequests
        .flatMap((req) => req.cosplayers)
        .map((cosplayer) => cosplayer.id.toString().toLowerCase());

      // Fetch cosplayers via ChangeCosplayer API
      const requestData = {
        characterId: character.id,
        dates: dates,
        accountId:
          selectedCosplayerIds.length > 0 ? selectedCosplayerIds.join(",") : "",
      };

      const cosplayersData = await HireCosplayerService.ChangeCosplayer(
        requestData
      );

      // Deduplicate cosplayers
      const uniqueCosplayers = cosplayersData.reduce((acc, cosplayer) => {
        if (!acc.some((c) => c.accountId === cosplayer.accountId)) {
          acc.push(cosplayer);
        }
        return acc;
      }, []);

      // Map cosplayers
      const mappedCosplayers = uniqueCosplayers.map((cosplayer) => ({
        id: cosplayer.accountId,
        name: cosplayer.name,
        avatar: cosplayer.images[0]?.urlImage || DEFAULT_AVATAR_URL,
        description: cosplayer.description || "No description",
        height: cosplayer.height,
        weight: cosplayer.weight,
        salaryIndex: cosplayer.salaryIndex,
        averageStar: cosplayer.averageStar || 0,
      }));

      // Update cosplayer data cache
      const newCache = { ...cosplayerDataCache };
      uniqueCosplayers.forEach((cosplayer) => {
        newCache[cosplayer.accountId] = {
          salaryIndex: cosplayer.salaryIndex || 1,
          name: cosplayer.name,
        };
      });
      setCosplayerDataCache(newCache);

      // Filter cosplayers
      const filtered = mappedCosplayers.filter(
        (cosplayer) =>
          !existingCosplayerIds.includes(
            cosplayer.id.toString().toLowerCase()
          ) &&
          !bookedCosplayerIds.has(cosplayer.id.toString().toLowerCase()) &&
          cosplayer.height >= character.minHeight &&
          cosplayer.height <= character.maxHeight &&
          cosplayer.weight >= character.minWeight &&
          cosplayer.weight <= character.maxWeight
      );

      setCosplayers(mappedCosplayers);
      setFilteredCosplayers(filtered);

      if (filtered.length === 0) {
        setError(
          "No cosplayers available for this character and time slot. Try adjusting the time or character."
        );
      } else {
        setError(null);
      }
    } catch (err) {
      setError("Unable to load cosplayers. Please try again later.");
      console.error(err);
      toast.error(err.message || "Failed to load cosplayers.");
      setFilteredCosplayers([]);
      setCosplayers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalHours = useMemo(() => {
    if (!dateRange || !timeRanges) return 0;

    let totalHours = 0;
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    const days = endDate.diff(startDate, "day") + 1;

    for (let i = 0; i < days; i++) {
      const day = startDate.add(i, "day").format(dateFormat);
      const [startTime, endTime] = timeRanges[day] || [];
      if (startTime && endTime) {
        totalHours += endTime.diff(startTime, "hour", true);
      }
    }
    return totalHours;
  }, [dateRange, timeRanges]);

  const calculateTotalDays = useMemo(() => {
    if (!dateRange) return 0;

    const startDate = dateRange[0];
    const endDate = dateRange[1];
    return endDate.diff(startDate, "day") + 1;
  }, [dateRange]);

  const calculateUnitPrice = (cosplayer, characterId) => {
    const character = characters.find((char) => char.id === characterId);
    if (!character || !cosplayer.salaryIndex) return 0;

    const totalHours = calculateTotalHours;
    const totalDays = calculateTotalDays;
    const unitPrice =
      totalHours * cosplayer.salaryIndex + totalDays * character.price;
    return unitPrice;
  };

  useEffect(() => {
    if (sortBy && filteredCosplayers.length > 0) {
      const sortedCosplayers = [...filteredCosplayers].sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      });
      setFilteredCosplayers(sortedCosplayers);
    }
  }, [sortBy, sortOrder]);

  const handleCancelSort = () => {
    setSortBy("");
    setSortOrder("asc");
    if (currentCharacter?.characterId) {
      fetchCosplayersByCharacterAndTime(currentCharacter.characterId);
    }
  };

  useEffect(() => {
    const fetchCosplayerPrices = () => {
      if (isModalVisible && modalData.listRequestCharacters.length > 0) {
        const prices = {};
        modalData.listRequestCharacters.forEach((item) => {
          const cosplayerData = cosplayerDataCache[item.cosplayerId];
          const salaryIndex = cosplayerData?.salaryIndex || 1;
          const character = characters.find(
            (char) => char.id === item.characterId
          );
          const totalHours = calculateTotalHours;
          const totalDays = calculateTotalDays;
          prices[item.cosplayerId] =
            (totalHours * salaryIndex + totalDays * (character?.price || 0)) *
            item.quantity;
        });
        setCosplayerPrices(prices);
      }
    };
    fetchCosplayerPrices();
  }, [isModalVisible, modalData.listRequestCharacters, cosplayerDataCache]);

  const filteredCharacters = characters.filter(
    (char) =>
      char.name.toLowerCase().includes(characterSearchQuery.toLowerCase()) &&
      char.quantity >= 1
  );

  const paginatedCharacters = filteredCharacters.slice(
    (currentCharacterPage - 1) * characterPageSize,
    currentCharacterPage * characterPageSize
  );

  const paginatedCosplayers = filteredCosplayers.slice(
    (currentCosplayerPage - 1) * cosplayerPageSize,
    currentCosplayerPage * cosplayerPageSize
  );

  const disabledDate = (current) => {
    if (!current) return false;

    const today = dayjs().startOf("day");
    const minStartDate = today.add(4, "day");
    const maxStartDate = minStartDate.add(13, "day");

    if (current < minStartDate) {
      return true;
    }

    if (!dateRange || !dateRange[0]) {
      return current > maxStartDate;
    }

    const startDate = dateRange[0];
    const maxEndDate = startDate.add(13, "day");
    return current < startDate || current > maxEndDate;
  };

  const disabledTime = () => {
    const startHour = 8;
    const endHour = 22;

    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          if (i < startHour || i > endHour) {
            hours.push(i);
          }
        }
        return hours;
      },
      disabledMinutes: (selectedHour) => {
        if (selectedHour === startHour || selectedHour === endHour) {
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => minute !== 0
          );
        }
        return [];
      },
    };
  };

  const handleDateRangeChange = (dates) => {
    if (!dates) {
      setDateRange(null);
      setTimeRanges({});
      return;
    }

    const [start, end] = dates;
    const today = dayjs().startOf("day");
    const minStartDate = today.add(4, "day");
    const maxStartDate = minStartDate.add(13, "day");

    if (start.isBefore(minStartDate, "day")) {
      toast.warn("Start date must be at least 4 days from today!");
      setDateRange(null);
      return;
    }

    if (start.isAfter(maxStartDate, "day")) {
      toast.error("Start date cannot be more than 14 days ");
      setDateRange(null);
      return;
    }

    if (end.isBefore(start, "day")) {
      toast.warn("End date must be on or after start date!");
      setDateRange(null);
      return;
    }

    const maxEndDate = start.add(13, "day");
    if (end.isAfter(maxEndDate, "day")) {
      toast.warn("End date cannot be more than 14 days from start date!");
      setDateRange(null);
      return;
    }

    const daysDifference = end.diff(start, "day") + 1;
    if (daysDifference > 5) {
      toast.warn("Rental period cannot exceed 5 days!");
      setDateRange(null);
      return;
    }

    setDateRange(dates);
    setTimeRanges({});
    setCurrentStep(2);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedStreet(null);
    if (!value) {
      setLocation("");
      setStreets([]);
    }
  };

  const handleStreetChange = (value) => {
    setSelectedStreet(value);
    if (!value) {
      setLocation("");
    }
  };

  const handleCharacterSelect = (character) => {
    if (currentCharacter?.characterId === character.id) {
      setCurrentCharacter(null);
      setSelectedCosplayerIds([]);

      setCurrentCosplayerPage(1);
      setCurrentStep(5);
      setFilteredCosplayers([]);
      setCosplayers([]);
      setSortBy("");
      setSortOrder("asc");
    } else {
      setCurrentCharacter({
        characterId: character.id,
        characterName: character.name,
      });
      setSelectedCosplayerIds([]);

      setCurrentCosplayerPage(1);
      fetchCosplayersByCharacterAndTime(character.id);
      setCurrentStep(6);
      setSortBy("");
      setSortOrder("asc");
    }
  };

  const handleCosplayerSelect = (cosplayerId) => {
    const character = characters.find(
      (char) => char.id === currentCharacter?.characterId
    );
    if (!character) {
      console.log("Nhân vật không được tìm thấy!");
      return;
    }

    const existingCosplayersForCharacter = selectedRequests
      .filter((req) => req.characterId === currentCharacter.characterId)
      .flatMap((req) => req.cosplayers).length;

    const currentSelectedCount = selectedCosplayerIds.length;
    const isSelecting = !selectedCosplayerIds.includes(cosplayerId);

    if (
      isSelecting &&
      currentSelectedCount + existingCosplayersForCharacter >=
        character.quantity
    ) {
      toast.warn(
        `You can only select up to ${character.quantity} cosplayers for character ${character.name}! `
      );
      return;
    }

    setSelectedCosplayerIds((prev) =>
      prev.includes(cosplayerId)
        ? prev.filter((id) => id !== cosplayerId)
        : [...prev, cosplayerId]
    );
  };

  const handleAddCosplayers = () => {
    if (selectedCosplayerIds.length === 0) {
      toast.warn("Please select at least one cosplayer!");
      return;
    }

    const character = characters.find(
      (char) => char.id === currentCharacter?.characterId
    );
    if (!character) {
      console.log("Nhân vật không được tìm thấy!");
      return;
    }

    // Đếm số cosplayer đã chọn cho nhân vật này trong selectedRequests
    const existingCosplayersForCharacter = selectedRequests
      .filter((req) => req.characterId === currentCharacter.characterId)
      .flatMap((req) => req.cosplayers).length;

    const totalSelectedCosplayers =
      existingCosplayersForCharacter + selectedCosplayerIds.length;

    if (totalSelectedCosplayers > character.quantity) {
      toast.warn(
        `You can only select up to ${character.quantity} cosplayers for character ${character.name}!`
      );
      return;
    }

    const selectedCosplayerDetails = selectedCosplayerIds.map((id) => {
      const cosplayer = filteredCosplayers.find((c) => c.id === id);
      return { id, name: cosplayer.name, salaryIndex: cosplayer.salaryIndex };
    });

    setSelectedRequests((prev) => [
      ...prev,
      {
        characterId: currentCharacter.characterId,
        characterName: currentCharacter.characterName,
        cosplayers: selectedCosplayerDetails,
      },
    ]);

    const newPrices = { ...cosplayerPrices };
    selectedCosplayerDetails.forEach((cosplayer) => {
      const character = characters.find(
        (char) => char.id === currentCharacter.characterId
      );
      const totalHours = calculateTotalHours;
      const totalDays = calculateTotalDays;
      newPrices[cosplayer.id] =
        (totalHours * cosplayer.salaryIndex +
          totalDays * (character?.price || 0)) *
        1;
    });
    setCosplayerPrices(newPrices);

    setCurrentStep(5);
    setSelectedCosplayerIds([]);

    setCurrentCosplayerPage(1);
    setCurrentCharacter(null);
    setFilteredCosplayers([]);
    setCosplayers([]);
    setSortBy("");
    setSortOrder("asc");
  };

  const handleSendRequest = () => {
    if (!dateRange || Object.keys(timeRanges).length === 0 || !location) {
      toast.warn(
        "Please fill in all required fields (date, time per day, house number, district, and street)!"
      );
      return;
    }
    if (!houseNumber.trim()) {
      toast.error("Please enter house number!");
      return;
    }
    if (selectedRequests.length === 0) {
      console.log("Please select at least one character and cosplayer!");
      return;
    }
    setModalData((prev) => ({
      ...prev,
      listRequestCharacters: selectedRequests.flatMap((req) =>
        req.cosplayers.map((cosplayer) => ({
          characterId: req.characterId,
          cosplayerId: cosplayer.id,
          description: "",
          quantity: 1,
        }))
      ),
      startDate: dateRange[0].format(dateFormat),
      endDate: dateRange[1].format(dateFormat),
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
    setSelectedRequests((prev) =>
      prev
        .map((req) => ({
          ...req,
          cosplayers: req.cosplayers.filter(
            (cosplayer) => cosplayer.id !== cosplayerId
          ),
        }))
        .filter((req) => req.cosplayers.length > 0)
    );
    setCosplayerPrices((prev) => {
      const newPrices = { ...prev };
      delete newPrices[cosplayerId];
      return newPrices;
    });
  };

  const applySameTimeToAll = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      toast.warn("Please select a valid date range!");
      return;
    }

    const totalDays = dateRange[1].diff(dateRange[0], "day") + 1;
    if (totalDays <= 1) {
      toast.info("This feature is only available for multiple days!");
      return;
    }

    const firstDay = dateRange[0].format(dateFormat);
    const firstTimeRange = timeRanges[firstDay];

    if (!firstTimeRange || !firstTimeRange[0] || !firstTimeRange[1]) {
      toast.warn("Please select a valid time range for the first day!");
      return;
    }

    const startTime = firstTimeRange[0]; // Define startTime
    const endTime = firstTimeRange[1]; // Define endTime

    if (endTime.isBefore(startTime)) {
      toast.warn("End time must be after start time for the first day!");
      return;
    }

    if (endTime.isSame(startTime)) {
      toast.warn(
        "End time cannot be the same as start time for the first day!"
      );
      return;
    }

    const newTimeRanges = { ...timeRanges };
    for (let i = 0; i < totalDays; i++) {
      const day = dateRange[0].add(i, "day").format(dateFormat);
      newTimeRanges[day] = [dayjs(startTime), dayjs(endTime)];
    }

    setTimeRanges(newTimeRanges);

    const allDaysFilled = Array.from({ length: totalDays }, (_, j) =>
      dateRange[0].add(j, "day").format(dateFormat)
    ).every((d) => {
      const range = newTimeRanges[d];
      return (
        range &&
        Array.isArray(range) &&
        range.length === 2 &&
        range[0] &&
        range[1] &&
        !range[1].isSame(range[0])
      );
    });

    if (allDaysFilled) {
      setCurrentStep(3);
    }

    toast.success("Time ranges applied to all days!");
  };

  const handleModalConfirm = async () => {
    if (modalData.listRequestCharacters.length === 0) {
      toast.warn(
        "Please select at least one cosplayer before submitting a request!"
      );
      return;
    }

    if (!modalData.name.trim()) {
      toast.warn("Name cannot be blank!");
      return;
    }

    if (!accountId) {
      toast.error("Cannot send request: Missing user ID. Please log in again.");
      return;
    }

    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      toast.warn("Please select a valid time period!");
      return;
    }

    // Validate character counts
    const characterCounts = {};
    modalData.listRequestCharacters.forEach((item) => {
      characterCounts[item.characterId] =
        (characterCounts[item.characterId] || 0) + 1;
    });

    for (const [characterId, count] of Object.entries(characterCounts)) {
      const character = characters.find((c) => c.id === characterId);
      if (character && count > character.quantity) {
        toast.warn(
          `The number of cosplayers for character ${character.name} exceeds inventory (${character.quantity})!`
        );
        return;
      }
    }

    // Validate dates
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    const today = dayjs().startOf("day");
    const minStartDate = today.add(4, "day");
    const maxStartDate = minStartDate.add(13, "day");

    if (startDate.isBefore(minStartDate, "day")) {
      toast.error("Start date must be at least 4 days from today!");
      return;
    }

    if (startDate.isAfter(maxStartDate, "day")) {
      toast.warn("Start date cannot be more than 14 days from today!");
      return;
    }

    if (endDate.isBefore(startDate, "day")) {
      toast.warn("The end date must be on or after the start date!");
      return;
    }

    const maxEndDate = startDate.add(13, "day");
    if (endDate.isAfter(maxEndDate, "day")) {
      toast.warn(
        "The end date cannot be more than 14 days from the start date!"
      );
      return;
    }

    const diffDays = endDate.diff(startDate, "day") + 1;
    if (diffDays > 5) {
      toast.error("Rental period must not exceed 5 days!");
      return;
    }

    // Validate time ranges
    const allDays = Array.from({ length: diffDays }, (_, i) =>
      startDate.add(i, "day").format(dateFormat)
    );
    const missingTimeRanges = allDays.filter(
      (day) => !timeRanges[day] || !timeRanges[day][0] || !timeRanges[day][1]
    );
    if (missingTimeRanges.length > 0) {
      toast.error(
        `Please select a time period for the following days: ${missingTimeRanges.join(
          ", "
        )}`
      );
      return;
    }

    const sameTimeRanges = allDays.filter((day) => {
      const [startTime, endTime] = timeRanges[day] || [];
      return startTime && endTime && startTime.isSame(endTime);
    });
    if (sameTimeRanges.length > 0) {
      toast.info(
        `Start and end times cannot overlap for the following days: ${sameTimeRanges.join(
          ", "
        )}`
      );
      return;
    }

    // Generate dates for conflict check
    const dates = allDays.map((day) => {
      const [startTime, endTime] = timeRanges[day];
      return {
        startDate: `${startTime.format(timeFormat)} ${day}`,
        endDate: `${endTime.format(timeFormat)} ${day}`,
      };
    });

    // Check for conflicts with booked cosplayers
    try {
      const conflicts =
        await HireCosplayerService.getAllRequestCharacterByListDate(dates);
      const bookedCosplayerIds = new Set(
        conflicts
          .map((conflict) => conflict.cosplayerId)
          .filter(Boolean)
          .map((id) => id.toString().toLowerCase())
      );

      const selectedCosplayerIdsSet = new Set(
        modalData.listRequestCharacters.map((item) =>
          item.cosplayerId.toString().toLowerCase()
        )
      );

      const conflictingCosplayers = Array.from(selectedCosplayerIdsSet).filter(
        (id) => bookedCosplayerIds.has(id)
      );

      if (conflictingCosplayers.length > 0) {
        const conflictingNames = conflictingCosplayers
          .map((id) => {
            const cosplayer = filteredCosplayers.find(
              (c) => c.id.toString().toLowerCase() === id
            );
            return cosplayer?.name || "Unknown Cosplayer";
          })
          .join(", ");
        toast.error(
          `The following cosplayers are already booked for the selected times: ${conflictingNames}. Please select different cosplayers or adjust the time.`
        );
        return;
      }
    } catch (error) {
      console.error("Error checking cosplayer conflicts:", error);
      toast.error("Failed to verify cosplayer availability. Please try again.");
      return;
    }

    // Prepare request data
    const totalPrice = Object.values(cosplayerPrices).reduce(
      (sum, price) => sum + price,
      0
    );

    const requestData = {
      accountId: accountId,
      name: modalData.name,
      description: modalData.description || "No description",
      price: totalPrice,
      startDate: startDate.format(dateFormat),
      endDate: endDate.format(dateFormat),
      location: location,
      deposit: depositPercentage,
      charactersRentCosplayers: modalData.listRequestCharacters.map((item) => {
        const listRequestDates = allDays.map((day) => {
          const [startTime, endTime] = timeRanges[day];
          return {
            startDate: `${startTime.format(timeFormat)} ${day}`,
            endDate: `${endTime.format(timeFormat)} ${day}`,
          };
        });
        return {
          characterId: item.characterId,
          cosplayerId: item.cosplayerId,
          description: item.description || "No description",
          listRequestDates,
        };
      }),
    };

    // Send request
    setIsSubmitting(true);
    try {
      console.log("Sending request at:", performance.now(), "ms");
      console.log("requestData:", JSON.stringify(requestData, null, 2));
      const response = await HireCosplayerService.NewSendRequestHireCosplayer(
        requestData
      );
      console.log("Request completed at:", performance.now(), "ms");
      toast.success("Request sent successfully!", {
        autoClose: 3000,
      });
      setIsModalVisible(false);
      setSelectedRequests([]);
      setDateRange(null);
      setTimeRanges({});
      setLocation("");
      setSelectedDistrict(null);
      setSelectedStreet(null);
      setSelectedCosplayerIds([]);
      setCurrentCosplayerPage(1);
      setCurrentCharacter(null);
      setCosplayers([]);
      setFilteredCosplayers([]);
      setCosplayerPrices({});
      setCosplayerDataCache({});
      setSortBy("");
      setSortOrder("asc");
      setDepositPercentage("50");
      setCurrentStep(1);
    } catch (error) {
      console.error("Failed to send request:", error.message);
      toast.error(`Failed to send request`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="cosplay-rental-page min-vh-100"
        style={{ padding: "50px" }}
      >
        <Alert
          message="Authentication Error"
          description={error || "You need to log in to access this page."}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (isLoading) {
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
            Book your favorite cosplayers for your event
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="filter-section mb-5">
          {currentStep >= 1 && (
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
          {currentStep >= 2 && dateRange && (
            <div className="filter-card">
              <Flex
                align="center"
                justify="space-between"
                style={{ marginBottom: "16px" }}
              >
                <h3 className="section-title">Select Time for Each Day:</h3>
                {dateRange[1].diff(dateRange[0], "day") + 1 > 1 && (
                  <Button
                    type="primary"
                    onClick={applySameTimeToAll}
                    disabled={
                      !timeRanges[dateRange[0].format(dateFormat)]?.[0] ||
                      !timeRanges[dateRange[0].format(dateFormat)]?.[1] ||
                      timeRanges[dateRange[0].format(dateFormat)]?.[1].isBefore(
                        timeRanges[dateRange[0].format(dateFormat)]?.[0]
                      ) ||
                      timeRanges[dateRange[0].format(dateFormat)]?.[1].isSame(
                        timeRanges[dateRange[0].format(dateFormat)]?.[0]
                      )
                    }
                  >
                    Same Time
                  </Button>
                )}
              </Flex>
              {Array.from(
                { length: dateRange[1].diff(dateRange[0], "day") + 1 },
                (_, i) => {
                  const day = dateRange[0].add(i, "day").format(dateFormat);
                  return (
                    <div
                      key={day}
                      style={{
                        marginBottom: "16px",
                        textAlign: "center",
                        flexDirection: "row",
                        margin: "0 15px",
                        alignItems: "center",
                      }}
                    >
                      <h5>{day}</h5>
                      <Flex gap={8} align="center" justify="center">
                        <TimeRangePicker
                          style={{ width: "103%" }}
                          value={timeRanges[day] || null}
                          onChange={(times) => {
                            if (times && times[0] && times[1]) {
                              const startTime = times[0]; // Define startTime
                              const endTime = times[1]; // Define endTime
                              if (endTime.isBefore(startTime)) {
                                toast.warn(
                                  "End time must be after start time!"
                                );
                                return;
                              }
                              if (endTime.isSame(startTime)) {
                                console.log(
                                  "End time cannot be the same as start time!"
                                );
                                return;
                              }
                              const newTimeRanges = {
                                ...timeRanges,
                                [day]: [startTime, endTime],
                              };
                              setTimeRanges(newTimeRanges);

                              const totalDays =
                                dateRange[1].diff(dateRange[0], "day") + 1;
                              const allDays = Array.from(
                                { length: totalDays },
                                (_, j) =>
                                  dateRange[0].add(j, "day").format(dateFormat)
                              );
                              const allDaysFilled = allDays.every((d) => {
                                const range = newTimeRanges[d];
                                return (
                                  range &&
                                  Array.isArray(range) &&
                                  range.length === 2 &&
                                  range[0] &&
                                  range[1] &&
                                  !range[1].isSame(range[0])
                                );
                              });

                              if (allDaysFilled) {
                                setCurrentStep(3);
                              }
                            } else {
                              setTimeRanges((prev) => ({
                                ...prev,
                                [day]: times,
                              }));
                            }
                          }}
                          format={timeFormat}
                          disabledTime={disabledTime}
                          className="custom-time-picker"
                          defaultValue={[
                            dayjs("08:00", timeFormat),
                            dayjs("22:00", timeFormat),
                          ]}
                        />
                      </Flex>
                    </div>
                  );
                }
              )}
            </div>
          )}
          {currentStep >= 3 && (
            <div className="filter-card">
              <h3 className="section-title">Select Location:</h3>
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Select
                    placeholder="Select District"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    style={{ width: "100%", marginBottom: "16px" }}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {districts.map((district) => (
                      <Option key={district.id} value={district.id}>
                        {district.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={8}>
                  <Select
                    placeholder="Select Ward"
                    value={selectedStreet}
                    onChange={handleStreetChange}
                    style={{ width: "100%" }}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    disabled={!selectedDistrict}
                  >
                    {streets.map((street) => (
                      <Option key={street.id} value={street.id}>
                        {street.name}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} sm={8}>
                  <Input
                    placeholder="Enter Address, Street ..."
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    style={{ width: "100%", marginBottom: "16px" }}
                    allowClear
                  />
                </Col>
              </Row>
              {location && (
                <div style={{ marginTop: "8px" }}>
                  <strong>Selected Location:</strong> {location}
                </div>
              )}
            </div>
          )}
        </div>

        {currentStep >= 5 && (
          <div className="character-selection-card mb-5">
            <Row align="middle" gutter={16} className="mb-4">
              <Col>
                <h3 className="section-title">Select Character:</h3>
              </Col>
              <Col>
                <Input
                  placeholder="Search characters"
                  value={characterSearchQuery}
                  onChange={(e) => {
                    setCharacterSearchQuery(e.target.value);
                    setCurrentCharacterPage(1);
                  }}
                  prefix={<SearchOutlined />}
                  className="custom-input-search"
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              {paginatedCharacters.map((character) => {
                const detail = characterDetails[character.id] || {};
                const characterImage =
                  detail.images?.find((img) => img.isAvatar)?.urlImage ||
                  detail.images?.[0]?.urlImage ||
                  DEFAULT_AVATAR_URL;
                return (
                  <Col xs={24} sm={12} md={8} key={character.id}>
                    <div
                      className={`character-card ${
                        currentCharacter?.characterId === character.id
                          ? "active"
                          : ""
                      } ${
                        selectedRequests.some(
                          (r) => r.characterId === character.id
                        )
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => handleCharacterSelect(character)}
                      style={{ position: "relative" }}
                    >
                      <div className="card-inner">
                        <div className="card-front">
                          <img
                            src={characterImage}
                            alt={character.name}
                            className="card-img-top"
                            onError={(e) => (e.target.src = DEFAULT_AVATAR_URL)}
                          />
                          <div className="card-content">
                            <h3>{character.name}</h3>
                            <p className="character-height">
                              Height: {character.minHeight || "N/A"} -{" "}
                              {character.maxHeight || "N/A"} cm
                            </p>
                            <p className="character-weight">
                              Weight: {character.minWeight || "N/A"} -{" "}
                              {character.maxWeight || "N/A"} kg
                            </p>
                            <p className="character-quantity">
                              Quantity: {character.quantity}
                            </p>
                            <span className="category-badge">
                              {character.price.toLocaleString()} VND
                            </span>{" "}
                          </div>
                          <Button
                            type="link"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCharacterId(character.id);
                              setIsViewModalVisible(true);
                            }}
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                            }}
                            className="see-profile-icon"
                          >
                            <EyeFilled />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
            <Pagination
              current={currentCharacterPage}
              pageSize={characterPageSize}
              total={filteredCharacters.length}
              onChange={(page) => setCurrentCharacterPage(page)}
              className="custom-pagination"
            />
          </div>
        )}

        {currentStep >= 6 && (
          <div className="cosplayer-selection">
            <h3 className="section-title mb-4">
              Available Cosplayers for {currentCharacter?.characterName}:
            </h3>
            {filteredCosplayers.length === 0 ? (
              <div style={{ display: "flex" }}>
                <p>No cosplayers available for this character and time slot.</p>
                <div
                  aria-label="Hamster running in wheel"
                  role="img"
                  className="unique-hamsterLoader__container"
                >
                  <div className="unique-hamsterLoader__wheel"></div>
                  <div className="unique-hamsterLoader__hamster">
                    <div className="unique-hamsterLoader__body">
                      <div className="unique-hamsterLoader__head">
                        <div className="unique-hamsterLoader__ear"></div>
                        <div className="unique-hamsterLoader__eye"></div>
                        <div className="unique-hamsterLoader__nose"></div>
                      </div>
                      <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--fr"></div>
                      <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--fl"></div>
                      <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--br"></div>
                      <div className="unique-hamsterLoader__limb unique-hamsterLoader__limb--bl"></div>
                      <div className="unique-hamsterLoader__tail"></div>
                    </div>
                  </div>
                  <div className="unique-hamsterLoader__spoke"></div>
                </div>
              </div>
            ) : (
              <>
                <Row align="middle" gutter={16} className="mb-4">
                  <Col>
                    <Select
                      value={sortBy || "Sort By"}
                      onChange={(value) => setSortBy(value)}
                      style={{ width: 150 }}
                    >
                      <Option value="Sort By" disabled>
                        Sort By
                      </Option>
                      <Option value="height">Height</Option>
                      <Option value="weight">Weight</Option>
                      <Option value="salaryIndex">Hourly Rate</Option>
                      <Option value="averageStar">Rating</Option>
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      value={sortOrder}
                      onChange={(value) => setSortOrder(value)}
                      style={{ width: 120 }}
                    >
                      <Option value="asc">Ascending</Option>
                      <Option value="desc">Descending</Option>
                    </Select>
                  </Col>
                  <Col>
                    <Button onClick={handleCancelSort}>Cancel Sort</Button>
                  </Col>
                </Row>
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                  dataSource={paginatedCosplayers}
                  renderItem={(cosplayer) => (
                    <List.Item key={cosplayer.id}>
                      <Card
                        className={`cosplayer-item ${
                          selectedCosplayerIds.includes(cosplayer.id)
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
                        <p>
                          Height: {cosplayer.height} cm - Weight:{" "}
                          {cosplayer.weight} kg
                        </p>
                        <p>Hourly Rate: {cosplayer.salaryIndex} VND/h</p>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "8px" }}>Rating:</span>
                          <Rate
                            disabled
                            allowHalf
                            value={cosplayer.averageStar}
                          />
                          <span style={{ marginLeft: "8px" }}>
                            ({cosplayer.averageStar}/5)
                          </span>
                        </div>
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
              </>
            )}
          </div>
        )}
        {selectedRequests.length > 0 && (
          <div className="request-summary mt-5">
            <h3 className="section-title mb-4">Selected Requests:</h3>
            <p
              style={{
                fontStyle: "italic",
                color: "#888",
                marginBottom: "10px",
              }}
            >
              Note: Price = (Total Hours × Hourly Rate) + (Total Days ×
              Character Price)
            </p>
            <List
              dataSource={selectedRequests}
              renderItem={(req) => (
                <List.Item key={req.characterId}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong>{req.characterName}</strong> - Cosplayers:{" "}
                      {req.cosplayers.map((cosplayer, index) => (
                        <span key={cosplayer.id}>
                          {cosplayer.name} (Cosplayer Price:{" "}
                          {calculateUnitPrice(
                            cosplayer,
                            req.characterId
                          ).toLocaleString()}{" "}
                          VND)
                          {index < req.cosplayers.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <div>
                      {req.cosplayers.map((cosplayer) => (
                        <Button
                          key={cosplayer.id}
                          type="link"
                          icon={<CloseOutlined />}
                          onClick={() =>
                            handleRemoveCosplayer(cosplayer.id, req.characterId)
                          }
                          style={{ color: "#510545", marginLeft: "10px" }}
                        />
                      ))}
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <Button
              type="primary"
              size="large"
              onClick={handleSendRequest}
              className="custom-btn-send mt-4"
            >
              Send Cosplayer Hire Request
            </Button>
          </div>
        )}
        <Modal
          title="Confirm Request"
          visible={isModalVisible}
          onOk={handleModalConfirm}
          onCancel={() => setIsModalVisible(false)}
          okText="Send Request"
          cancelText="Cancel"
          okButtonProps={{ disabled: isSubmitting, loading: isSubmitting }}
          style={{
            fontFamily: "'Poppins', sans-serif",
          }}
          bodyStyle={{
            background: "#fff",
            borderRadius: "0 0 15px 15px",
            padding: "1rem",
            boxShadow: "0 10px 30px rgba(34, 102, 138, 0.2)",
          }}
          headerStyle={{
            background: "linear-gradient(135deg, #510545, #22668a)",
            borderRadius: "15px 15px 0 0",
            padding: "1rem",
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
                Time Ranges Per Day:
              </label>
              <div
                style={{
                  border: "1px solid #e6e9ee",
                  borderRadius: "10px",
                  padding: "0.5rem",
                  background: "#f8f9fa",
                }}
              >
                {dateRange &&
                  Array.from(
                    { length: dateRange[1].diff(dateRange[0], "day") + 1 },
                    (_, i) => {
                      const day = dateRange[0].add(i, "day").format(dateFormat);
                      const [startTime, endTime] = timeRanges[day] || [];
                      return (
                        <div
                          key={day}
                          style={{
                            padding: "0.5rem",
                            borderBottom:
                              i < dateRange[1].diff(dateRange[0], "day")
                                ? "1px solid #e6e9ee"
                                : "none",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.95rem",
                              color: "#1a1a2e",
                            }}
                          >
                            <strong>{day}</strong>:{" "}
                            {startTime && endTime
                              ? `${startTime.format(
                                  timeFormat
                                )} - ${endTime.format(timeFormat)}`
                              : "Not specified"}
                          </span>
                        </div>
                      );
                    }
                  )}
              </div>
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
                  renderItem={(item, index) => {
                    const cosplayer = selectedRequests
                      .flatMap((req) => req.cosplayers)
                      .find((c) => c.id === item.cosplayerId);
                    return (
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
                          {cosplayer?.name || "Unknown Cosplayer"} as{" "}
                          {
                            characters.find((c) => c.id === item.characterId)
                              ?.name
                          }{" "}
                          - Hourly Rate: {cosplayer?.salaryIndex || "N/A"} -
                          Quantity: {item.quantity} - Price:{" "}
                          {cosplayerPrices[
                            item.cosplayerId
                          ]?.toLocaleString() || "Loading..."}{" "}
                          VND
                        </span>
                      </List.Item>
                    );
                  }}
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
                {Object.values(cosplayerPrices)
                  .reduce((sum, price) => sum + price, 0)
                  .toLocaleString() || 0}{" "}
                VND
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
                Select Deposit Percentage:
              </label>
              <Radio.Group
                onChange={(e) => setDepositPercentage(e.target.value)}
                value={depositPercentage}
                style={{ display: "flex", gap: "1rem" }}
              >
                <Radio value="30">30%</Radio>
                <Radio value="50">50%</Radio>
                <Radio value="70">70%</Radio>
              </Radio.Group>
            </div>
          </div>
        </Modal>
        <Modal
          title="Character Details"
          visible={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={null}
          style={{
            fontFamily: "'Poppins', sans-serif",
          }}
          bodyStyle={{
            background: "#fff",
            borderRadius: "0 0 15px 15px",
            padding: "1rem",
            boxShadow: "0 10px 30px rgba(34, 102, 138, 0.2)",
          }}
          headerStyle={{
            background: "linear-gradient(135deg, #510545, #22668a)",
            borderRadius: "15px 15px 0 0",
            padding: "1rem",
          }}
        >
          <ViewDetailCharacter characterId={selectedCharacterId} />
        </Modal>
      </div>
    </div>
  );
};

export default CosplayersPage;
