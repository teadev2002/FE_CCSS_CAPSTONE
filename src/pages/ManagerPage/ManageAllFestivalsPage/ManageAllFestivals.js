// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Modal,
//   Form,
//   Card,
//   Pagination,
//   Dropdown,
// } from "react-bootstrap";
// import { Button, Popconfirm, Image, Descriptions, List, Select, Alert } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ArrowUp, ArrowDown, PlusCircle } from "lucide-react";
// import "../../../styles/Manager/ManageAllFestivals.scss";
// import ManageAllFestivalsService from "../../../services/ManageServicePages/ManageAllFestivalsService/ManageAllFestivalsService";
// import { DatePicker } from "antd";
// import dayjs from "dayjs";
// import { jwtDecode } from "jwt-decode";
// import ProfileService from "../../../services/ProfileService/ProfileService";

// const { RangePicker: DateRangePicker } = DatePicker;
// const { Option } = Select;
// const dateTimeFormat = "DD/MM/YYYY HH:mm";

// const ManageAllFestivals = () => {
//   const [festivals, setFestivals] = useState([]);
//   const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
//   const [selectedFestival, setSelectedFestival] = useState(null);
//   const [eventDetails, setEventDetails] = useState(null);
//   const [characters, setCharacters] = useState([]);
//   const [activities, setActivities] = useState([]);
//   const [cosplayers, setCosplayers] = useState([]);
//   const [selectedCharacterId, setSelectedCharacterId] = useState(null);
//   const [formData, setFormData] = useState({
//     eventName: "",
//     description: "",
//     dateRange: null,
//     location: "",
//     tickets: [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
//     selectedCosplayers: [],
//     eventActivities: [],
//     imageFiles: [],
//     imagePreviews: [],
//     existingImages: [],
//     imagesDeleted: [],
//     initialImageIds: [], // Thêm để lưu danh sách imageId ban đầu
//   });
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortFestival, setSortFestival] = useState({
//     field: "eventName",
//     order: "asc",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 20, 30];

//   // Format ngày theo chuẩn Việt Nam
//   const formatDateVN = (dateString) => {
//     return dayjs(dateString).format("DD/MM/YYYY");
//   };

//   useEffect(() => {
//     if (isCreateModalVisible || isDetailsModalVisible) {
//       const fetchCharactersAndActivities = async () => {
//         try {
//           let charData = [];
//           if (formData.dateRange) {
//             const [startDate, endDate] = formData.dateRange;
//             const formattedStartDate = startDate.format("DD/MM/YYYY");
//             const formattedEndDate = endDate.format("DD/MM/YYYY");
//             charData = await ManageAllFestivalsService.getAllCharacters(
//               formattedStartDate,
//               formattedEndDate
//             );
//             console.log("Characters:", charData);
//             charData.forEach((char) =>
//               console.log("Character ID:", char.characterId, typeof char.characterId)
//             );
//           }
//           setCharacters(Array.isArray(charData) ? charData : []);

//           const actData = await ManageAllFestivalsService.getAllActivities();
//           console.log("Activities:", actData);
//           setActivities(Array.isArray(actData) ? actData : []);
//         } catch (error) {
//           toast.error(error.message || "Failed to load characters or activities");
//           setCharacters([]);
//           setActivities([]);
//         }
//       };
//       fetchCharactersAndActivities();
//     }
//   }, [isCreateModalVisible, isDetailsModalVisible, formData.dateRange]);

//   useEffect(() => {
//     if (selectedCharacterId && formData.dateRange) {
//       if (typeof selectedCharacterId !== "string" || !selectedCharacterId) {
//         toast.error("Invalid character ID");
//         setCosplayers([]);
//         return;
//       }

//       const [startDate, endDate] = formData.dateRange;
//       const startDateTime = startDate.format("HH:mm DD/MM/YYYY");
//       const endDateTime = endDate.format("HH:mm DD/MM/YYYY");

//       console.log("Fetching cosplayers with:", {
//         characterId: selectedCharacterId,
//         startDate: startDateTime,
//         endDate: endDateTime,
//       });

//       const fetchCosplayers = async () => {
//         try {
//           const cosplayerData = await ManageAllFestivalsService.getAvailableCosplayers(
//             selectedCharacterId,
//             startDateTime,
//             endDateTime
//           );
//           const selectedCosplayerIds = formData.selectedCosplayers.map((sc) => sc.cosplayerId);
//           const filteredCosplayers = cosplayerData.filter(
//             (cosplayer) => !selectedCosplayerIds.includes(cosplayer.accountId)
//           );
//           console.log("Filtered Cosplayers:", filteredCosplayers);
//           filteredCosplayers.forEach((cosplayer) => {
//             console.log(`Cosplayer ${cosplayer.name} images:`, cosplayer.images);
//           });
//           if (Array.isArray(filteredCosplayers) && filteredCosplayers.length === 0) {
//             toast.warn("No cosplayers available for this character and time range.");
//           }
//           setCosplayers(Array.isArray(filteredCosplayers) ? filteredCosplayers : []);
//         } catch (error) {
//           console.error("Error fetching cosplayers:", error.response?.data || error);
//           toast.error(error.message || "Failed to load cosplayers");
//           setCosplayers([]);
//         }
//       };
//       fetchCosplayers();
//     } else {
//       setCosplayers([]);
//     }
//   }, [selectedCharacterId, formData.dateRange, formData.selectedCosplayers]);

//   useEffect(() => {
//     const fetchFestivals = async () => {
//       try {
//         const data = await ManageAllFestivalsService.getAllEvents(searchTerm);
//         setFestivals(data);
//       } catch (error) {
//         toast.error(error.message || "Failed to load festivals");
//       }
//     };
//     fetchFestivals();
//   }, [searchTerm]);

//   const filterAndSortData = (data, search, sort) => {
//     let filtered = [...data];
//     if (search) {
//       filtered = filtered.filter(
//         (item) =>
//           item.eventName.toLowerCase().includes(search.toLowerCase()) ||
//           item.description.toLowerCase().includes(search.toLowerCase()) ||
//           item.location.toLowerCase().includes(search.toLowerCase()) ||
//           item.startDate.toLowerCase().includes(search.toLowerCase()) ||
//           item.endDate.toLowerCase().includes(search.toLowerCase()) ||
//           item.createDate.toLowerCase().includes(search.toLowerCase()) ||
//           (item.createBy && item.createBy.toLowerCase().includes(search.toLowerCase()))
//       );
//     }
//     return filtered.sort((a, b) => {
//       const valueA = String(a[sort.field] || "").toLowerCase();
//       const valueB = String(b[sort.field] || "").toLowerCase();
//       return sort.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredFestivals = filterAndSortData(festivals, searchTerm, sortFestival);
//   const totalEntries = filteredFestivals.length;
//   const totalPages = Math.ceil(totalEntries / rowsPerPage);
//   const paginatedFestivals = paginateData(filteredFestivals, currentPage);

//   function paginateData(data, page) {
//     const startIndex = (page - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex);
//   }

//   const startEntry = (currentPage - 1) * rowsPerPage + 1;
//   const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
//   const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

//   const showCreateModal = () => {
//     setIsEditMode(false);
//     setSelectedFestival(null);
//     setFormData({
//       eventName: "",
//       description: "",
//       dateRange: null,
//       location: "",
//       tickets: [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
//       selectedCosplayers: [],
//       eventActivities: [],
//       imageFiles: [],
//       imagePreviews: [],
//       existingImages: [],
//       imagesDeleted: [],
//       initialImageIds: [],
//     });
//     setSelectedCharacterId(null);
//     setCosplayers([]);
//     setIsCreateModalVisible(true);
//   };

//   const showEditModal = async (record) => {
//     try {
//       const eventData = await ManageAllFestivalsService.getEventById(record.eventId);

//       // Gộp các vé cùng loại
//       const ticketsByType = eventData.ticket.reduce((acc, t) => {
//         const type = t.ticketType;
//         if (!acc[type]) {
//           acc[type] = {
//             ticketId: t.ticketId,
//             quantity: t.quantity,
//             price: t.price,
//             description: t.description,
//             ticketType: type,
//           };
//         } else {
//           acc[type].quantity += t.quantity;
//           acc[type].price = t.price;
//           acc[type].description = t.description;
//         }
//         return acc;
//       }, {});
//       const tickets = Object.values(ticketsByType);

//       // Lấy danh sách cosplayer hiện có để hiển thị nhưng không cho chỉnh sửa
//       const selectedCosplayers = eventData.eventCharacterResponses.map((ec) => ({
//         characterId: ec.characterId,
//         cosplayerId: ec.cosplayerId,
//         cosplayerName: ec.cosplayerName || "Unknown",
//         description: ec.description || "Cosplayer for event",
//       }));

//       // Lấy dữ liệu activities
//       const eventActivities = eventData.eventActivityResponse.map((act) => ({
//         activityId: act.activityId,
//         description: act.description || "",
//         createBy: act.createBy || "",
//       }));

//       // Lấy danh sách ảnh hiện có và lưu initialImageIds
//       const existingImages = eventData.eventImageResponses.map((img) => ({
//         imageId: img.imageId,
//         imageUrl: img.imageUrl,
//       }));
//       const initialImageIds = existingImages.map((img) => img.imageId);

//       setFormData({
//         eventName: eventData.eventName,
//         description: eventData.description,
//         dateRange: [
//           dayjs(eventData.startDate, "YYYY-MM-DD HH:mm:ss"),
//           dayjs(eventData.endDate, "YYYY-MM-DD HH:mm:ss"),
//         ],
//         location: eventData.location,
//         tickets: tickets.length > 0 ? tickets : [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
//         selectedCosplayers, // Giữ cosplayer hiện có
//         eventActivities,
//         imageFiles: [],
//         imagePreviews: [],
//         existingImages,
//         imagesDeleted: [],
//         initialImageIds, // Lưu danh sách imageId ban đầu
//       });

//       setSelectedCharacterId(null);
//       setCosplayers([]);
//       setIsEditMode(true);
//       setSelectedFestival(record);
//       setIsCreateModalVisible(true);
//     } catch (error) {
//       toast.error(error.message || "Failed to load event data for editing");
//     }
//   };

//   const showDetailsModal = async (record) => {
//     try {
//       const eventData = await ManageAllFestivalsService.getEventById(record.eventId);
//       console.log("Event data:", eventData);
//       const cosplayers = await Promise.all(
//         eventData.eventCharacterResponses.map(async (ec) => {
//           const cosplayer = await ManageAllFestivalsService.getCosplayerByEventCharacterId(
//             ec.eventCharacterId
//           );
//           const character = characters.find((char) => char.characterId === ec.characterId);
//           console.log("Cosplayer data:", cosplayer);
//           return {
//             eventCharacterId: ec.eventCharacterId,
//             name: cosplayer.name,
//             description: character ? `Cosplay as ${character.characterName}` : "No character info",
//             urlImage:
//               cosplayer.images?.find((img) => img.isAvatar)?.urlImage ||
//               cosplayer.images?.[0]?.urlImage ||
//               "https://via.placeholder.com/100?text=No+Image",
//           };
//         })
//       );

//       const updatedActivities = eventData.eventActivityResponse.map((activity) => {
//         const matchingActivity = activities.find((act) => act.activityId === activity.activityId);
//         console.log(`Activity ${activity.activityId}:`, { matchingActivity, description: matchingActivity?.description });
//         return {
//           ...activity,
//           description: matchingActivity?.description || "No description available",
//         };
//       });

//       // Gộp vé trong chi tiết sự kiện
//       const ticketsByType = eventData.ticket.reduce((acc, t) => {
//         const type = t.ticketType;
//         if (!acc[type]) {
//           acc[type] = {
//             ticketId: t.ticketId,
//             quantity: t.quantity,
//             price: t.price,
//             description: t.description,
//             ticketType: type,
//           };
//         } else {
//           acc[type].quantity += t.quantity;
//           acc[type].price = t.price;
//           acc[type].description = t.description;
//         }
//         return acc;
//       }, {});
//       const tickets = Object.values(ticketsByType);

//       setEventDetails({ ...eventData, cosplayers, eventActivityResponse: updatedActivities, ticket: tickets });
//       setIsDetailsModalVisible(true);
//     } catch (error) {
//       toast.error(error.message || "Failed to load event details");
//     }
//   };

//   const handleCancel = () => {
//     setIsCreateModalVisible(false);
//     setIsDetailsModalVisible(false);
//     setFormData({
//       eventName: "",
//       description: "",
//       dateRange: null,
//       location: "",
//       tickets: [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
//       selectedCosplayers: [],
//       eventActivities: [],
//       imageFiles: [],
//       imagePreviews: [],
//       existingImages: [],
//       imagesDeleted: [],
//       initialImageIds: [],
//     });
//     setSelectedCharacterId(null);
//     setCosplayers([]);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleDateRangeChange = (dates) => {
//     if (!dates) {
//       setFormData((prev) => ({ ...prev, dateRange: null }));
//       setSelectedCharacterId(null);
//       setCosplayers([]);
//       setCharacters([]);
//       return;
//     }

//     const [start, end] = dates;
//     const today = dayjs().startOf("day");
//     const tomorrow = today.add(1, "day");

//     if (start.isBefore(tomorrow)) {
//       toast.error("Start date must be tomorrow or later!");
//       setFormData((prev) => ({ ...prev, dateRange: null }));
//       setSelectedCharacterId(null);
//       setCosplayers([]);
//       setCharacters([]);
//       return;
//     }

//     if (end.isBefore(start)) {
//       toast.error("End date must be on or after start date!");
//       setFormData((prev) => ({ ...prev, dateRange: null }));
//       setSelectedCharacterId(null);
//       setCosplayers([]);
//       setCharacters([]);
//       return;
//     }

//     setFormData((prev) => ({ ...prev, dateRange: dates }));
//     setSelectedCharacterId(null);
//     setCosplayers([]);
//   };

//   const disabledDate = (current) => {
//     const today = dayjs().startOf("day");
//     const tomorrow = today.add(1, "day");
//     return current && current < tomorrow;
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

//   const handleArrayChange = (arrayName, index, field, value) => {
//     if ((field === "quantity" || field === "price") && Number(value) < 0) {
//       toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be negative!`);
//       return;
//     }
//     setFormData((prev) => {
//       const updatedArray = [...prev[arrayName]];
//       updatedArray[index] = { ...updatedArray[index], [field]: value };
//       return { ...prev, [arrayName]: updatedArray };
//     });
//   };

//   const handleImageFilesChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newPreviews = files.map((file) => URL.createObjectURL(file));
//     setFormData((prev) => ({
//       ...prev,
//       imageFiles: [...prev.imageFiles, ...files],
//       imagePreviews: [...prev.imagePreviews, ...newPreviews],
//     }));
//   };

//   const addMoreImages = () => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
//     input.multiple = true;
//     input.onchange = handleImageFilesChange;
//     input.click();
//   };

//   const removeImage = (index) => {
//     setFormData((prev) => {
//       const updatedFiles = [...prev.imageFiles];
//       const updatedPreviews = [...prev.imagePreviews];
//       updatedFiles.splice(index, 1);
//       updatedPreviews.splice(index, 1);
//       URL.revokeObjectURL(prev.imagePreviews[index]);
//       return {
//         ...prev,
//         imageFiles: updatedFiles,
//         imagePreviews: updatedPreviews,
//       };
//     });
//   };

//   const removeExistingImage = (imageId) => {
//     setFormData((prev) => {
//       const updatedExistingImages = prev.existingImages.filter((img) => img.imageId !== imageId);
//       const updatedImagesDeleted = [...prev.imagesDeleted, { imageId }];
//       console.log(`Removing image with imageId=${imageId}, imagesDeleted:`, updatedImagesDeleted);
//       return {
//         ...prev,
//         existingImages: updatedExistingImages,
//         imagesDeleted: updatedImagesDeleted,
//       };
//     });
//   };

//   const addArrayItem = (arrayName, defaultItem) => {
//     setFormData((prev) => ({
//       ...prev,
//       [arrayName]: [...prev[arrayName], defaultItem],
//     }));
//   };

//   const handleAddCosplayer = (cosplayer) => {
//     const character = characters.find((c) => c.characterId === selectedCharacterId);
//     const currentCount = formData.selectedCosplayers.filter(
//       (sc) => sc.characterId === selectedCharacterId
//     ).length;

//     if (currentCount >= character.quantity) {
//       toast.error(
//         `Cannot add more cosplayers for ${character.characterName}. Maximum quantity is ${character.quantity}.`
//       );
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       selectedCosplayers: [
//         ...prev.selectedCosplayers,
//         {
//           characterId: selectedCharacterId,
//           cosplayerId: cosplayer.accountId,
//           cosplayerName: cosplayer.name,
//           description: cosplayer.description || "Cosplayer for event",
//         },
//       ],
//     }));
//     toast.success(`Added cosplayer ${cosplayer.name}`);
//   };

//   const handleRemoveCosplayer = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedCosplayers: prev.selectedCosplayers.filter((_, i) => i !== index),
//     }));
//   };

//   const handleActivityChange = (selectedActivityIds) => {
//     const newActivities = selectedActivityIds.map((activityId) => ({
//       activityId,
//       description: activities.find((act) => act.activityId === activityId)?.description || "",
//       createBy: "",
//     }));
//     setFormData((prev) => ({
//       ...prev,
//       eventActivities: newActivities,
//     }));
//   };

//   const validateForm = () => {
//     const errors = [];
//     if (!formData.eventName.trim()) errors.push("Event name is required");
//     if (!formData.description.trim()) errors.push("Description is required");
//     if (!formData.location.trim()) errors.push("Location is required");
//     if (!formData.dateRange) errors.push("Date and time range is required");
//     if (formData.tickets.length === 0) errors.push("At least one ticket is required");
//     if (formData.selectedCosplayers.length === 0)
//       errors.push("At least one cosplayer is required");
//     if (formData.eventActivities.length === 0)
//       errors.push("At least one activity is required");
//     if (formData.existingImages.length === 0 && formData.imageFiles.length === 0)
//       errors.push("At least one image is required");
//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateForm();
//     if (errors.length > 0) {
//       toast.error(errors.join("; "));
//       return;
//     }

//     try {
//       const [startDate, endDate] = formData.dateRange;
//       const token = localStorage.getItem("accessToken");
//       let createBy = "Unknown User";

//       if (token) {
//         try {
//           const decodedToken = jwtDecode(token);
//           console.log("Decoded token:", decodedToken);
//           const accountId =
//             decodedToken.Id ||
//             decodedToken.id ||
//             decodedToken.sub ||
//             decodedToken.userId;

//           if (!accountId) {
//             console.warn("No accountId found in decoded token");
//           } else {
//             try {
//               const profileData = await ProfileService.getProfileById(accountId);
//               createBy = profileData.name || "Unknown User";
//               console.log("Profile name fetched:", createBy);
//             } catch (error) {
//               console.error("Error fetching profile:", error);
//               toast.error("Failed to fetch user profile");
//             }
//           }
//         } catch (error) {
//           console.error("Error decoding token:", error);
//           toast.error("Invalid access token");
//         }
//       } else {
//         console.warn("No access token found in localStorage");
//         toast.warn("No access token available");
//       }

//       // Tính toán imagesDeleted từ initialImageIds
//       const imagesDeleted = formData.initialImageIds
//         .filter((id) => !formData.existingImages.some((img) => img.imageId === id))
//         .map((imageId) => ({ imageId }));
//       console.log("Computed imagesDeleted:", imagesDeleted);

//       const eventData = {
//         eventName: formData.eventName,
//         description: formData.description,
//         location: formData.location,
//         createBy: createBy,
//         ticket: formData.tickets.map((t) => {
//           const ticketData = {
//             quantity: t.quantity,
//             price: t.price,
//             description: t.description,
//             ticketType: t.ticketType,
//           };
//           if (isEditMode && t.ticketId) {
//             ticketData.ticketId = t.ticketId;
//           }
//           return ticketData;
//         }),
//         imagesDeleted,
//         eventCharacterRequest: formData.selectedCosplayers.map((sc) => ({
//           characterId: sc.characterId,
//           cosplayerId: sc.cosplayerId,
//           description: sc.description,
//         })),
//         eventActivityRequests: formData.eventActivities,
//       };

//       if (!isEditMode) {
//         eventData.startDate = startDate.toISOString();
//         eventData.endDate = endDate.toISOString();
//       }

//       const eventJson = JSON.stringify(eventData, null, 0);
//       console.log("Event JSON before sending:", eventJson);
//       console.log("Image files before sending:", formData.imageFiles);
//       console.log("ImagesDeleted before sending:", imagesDeleted);
//       console.log("EventCharacterRequest before sending:", formData.selectedCosplayers);

//       if (isEditMode) {
//         await ManageAllFestivalsService.updateEvent(
//           selectedFestival.eventId,
//           eventJson,
//           formData.imageFiles
//         );
//         toast.success("Festival updated successfully!");
//         // Kiểm tra dữ liệu sau cập nhật
//         const updatedEvent = await ManageAllFestivalsService.getEventById(selectedFestival.eventId);
//         console.log("Updated event details:", updatedEvent);
//       } else {
//         await ManageAllFestivalsService.addEvent(eventJson, formData.imageFiles);
//         toast.success("Festival created successfully!");
//       }

//       const updatedFestivals = await ManageAllFestivalsService.getAllEvents(searchTerm);
//       setFestivals(updatedFestivals);
//       handleCancel();
//     } catch (error) {
//       console.error("Error submitting event:", error);
//       toast.error(error.message || `Failed to ${isEditMode ? "update" : "create"} festival`);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleSort = (field) => {
//     setSortFestival((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page) => setCurrentPage(page);

//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPage(1);
//   };

//   const isAddTicketDisabled = () => {
//     const ticketTypes = formData.tickets.map((ticket) => ticket.ticketType);
//     return ticketTypes.includes(0) && ticketTypes.includes(1);
//   };

//   const getAvailableTicketTypes = (currentIndex) => {
//     const ticketTypes = formData.tickets.map((ticket, index) => (index !== currentIndex ? ticket.ticketType : null)).filter((type) => type !== null);
//     if (ticketTypes.length === 0) {
//       return [0, 1];
//     }
//     return ticketTypes.includes(0) ? [1] : [0];
//   };

//   return (
//     <div className="manage-festivals">
//       <h2 className="manage-festivals-title">Manage Festivals</h2>
//       <div className="content-container">
//         <Card className="manage-festivals-card">
//           <Card.Body>
//             <div className="table-header">
//               <h3>Festivals</h3>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by Name, Description, Location, or Created By..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="search-input"
//               />
//               <Button
//                 type="primary"
//                 size="large"
//                 onClick={showCreateModal}
//                 style={{
//                   background: "linear-gradient(135deg, #510545, #22668a)",
//                   border: "none",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//                 }
//               >
//                 <PlusCircle size={16} /> Add New Festival
//               </Button>
//             </div>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th className="text-center">
//                     <span
//                       className="sortable"
//                       onClick={() => handleSort("eventName")}
//                     >
//                       Event Name
//                       {sortFestival.field === "eventName" ? (
//                         sortFestival.order === "asc" ? (
//                           <ArrowUp size={16} />
//                         ) : (
//                           <ArrowDown size={16} />
//                         )
//                       ) : (
//                         <ArrowUp size={16} className="default-sort-icon" />
//                       )}
//                     </span>
//                   </th>
//                   <th className="text-center">Description</th>
//                   <th className="text-center">Location</th>
//                   <th className="text-center">
//                     <span
//                       className="sortable"
//                       onClick={() => handleSort("startDate")}
//                     >
//                       Start Date
//                       {sortFestival.field === "startDate" ? (
//                         sortFestival.order === "asc" ? (
//                           <ArrowUp size={16} />
//                         ) : (
//                           <ArrowDown size={16} />
//                         )
//                       ) : (
//                         <ArrowUp size={16} className="default-sort-icon" />
//                       )}
//                     </span>
//                   </th>
//                   <th className="text-center">End Date</th>
//                   <th className="text-center">
//                     <span
//                       className="sortable"
//                       onClick={() => handleSort("createDate")}
//                     >
//                       Create Date
//                       {sortFestival.field === "createDate" ? (
//                         sortFestival.order === "asc" ? (
//                           <ArrowUp size={16} />
//                         ) : (
//                           <ArrowDown size={16} />
//                         )
//                       ) : (
//                         <ArrowUp size={16} className="default-sort-icon" />
//                       )}
//                     </span>
//                   </th>
//                   <th className="text-center">
//                     <span
//                       className="sortable"
//                       onClick={() => handleSort("createBy")}
//                     >
//                       Created By
//                       {sortFestival.field === "createBy" ? (
//                         sortFestival.order === "asc" ? (
//                           <ArrowUp size={16} />
//                         ) : (
//                           <ArrowDown size={16} />
//                         )
//                       ) : (
//                         <ArrowUp size={16} className="default-sort-icon" />
//                       )}
//                     </span>
//                   </th>
//                   <th className="text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedFestivals.map((festival) => (
//                   <tr key={festival.eventId}>
//                     <td className="text-center">{festival.eventName}</td>
//                     <td className="text-center">
//                       {festival.description.length > 50
//                         ? `${festival.description.slice(0, 50)}...`
//                         : festival.description}
//                     </td>
//                     <td className="text-center">{festival.location}</td>
//                     <td className="text-center">{formatDateVN(festival.startDate)}</td>
//                     <td className="text-center">{formatDateVN(festival.endDate)}</td>
//                     <td className="text-center">{formatDateVN(festival.createDate)}</td>
//                     <td className="text-center">{festival.createBy || "Unknown"}</td>
//                     <td className="text-center" style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
//                       <Button
//                         type="primary"
//                         size="middle"
//                         onClick={() => showEditModal(festival)}
//                         style={{
//                           background: "linear-gradient(135deg, #510545, #22668a)",
//                           border: "none",
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//                         }
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         type="default"
//                         size="middle"
//                         onClick={() => showDetailsModal(festival)}
//                         style={{
//                           background: "#e0e0e0",
//                           border: "none",
//                           color: "#333",
//                         }}
//                         onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
//                         onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
//                       >
//                         Details
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <div className="pagination-controls">
//               <div className="pagination-info">
//                 <span>{showingText}</span>
//                 <div className="rows-per-page">
//                   <span>Rows per page: </span>
//                   <Dropdown
//                     onSelect={(value) => handleRowsPerPageChange(Number(value))}
//                     className="d-inline-block"
//                   >
//                     <Dropdown.Toggle
//                       variant="secondary"
//                       id="dropdown-rows-per-page"
//                       style={{
//                         padding: "4px 8px",
//                         fontSize: "14px",
//                         borderRadius: "4px",
//                         background: "#e0e0e0",
//                         border: "none",
//                         color: "#333",
//                       }}
//                     >
//                       {rowsPerPage}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       {rowsPerPageOptions.map((option) => (
//                         <Dropdown.Item key={option} eventKey={option}>
//                           {option}
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </div>
//               </div>
//               <Pagination>
//                 <Pagination.First
//                   onClick={() => handlePageChange(1)}
//                   disabled={currentPage === 1}
//                 />
//                 <Pagination.Prev
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 />
//                 {[...Array(totalPages).keys()].map((page) => (
//                   <Pagination.Item
//                     key={page + 1}
//                     active={page + 1 === currentPage}
//                     onClick={() => handlePageChange(page + 1)}
//                   >
//                     {page + 1}
//                   </Pagination.Item>
//                 ))}
//                 <Pagination.Next
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 />
//                 <Pagination.Last
//                   onClick={() => handlePageChange(totalPages)}
//                   disabled={currentPage === totalPages}
//                 />
//               </Pagination>
//             </div>
//           </Card.Body>
//         </Card>
//       </div>

//       <Modal
//         show={isCreateModalVisible}
//         onHide={handleCancel}
//         centered
//         className="festival-modal"
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {isEditMode ? "Edit Festival" : "Create Festival"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Event Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="eventName"
//                 value={formData.eventName}
//                 onChange={handleInputChange}
//                 placeholder="New Year Festival"
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Event description"
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Date and Time Range</Form.Label>
//               <DateRangePicker
//                 value={formData.dateRange}
//                 onChange={handleDateRangeChange}
//                 format={dateTimeFormat}
//                 disabledDate={disabledDate}
//                 disabledTime={disabledTime}
//                 showTime={{ format: "HH:mm" }}
//                 allowClear={false}
//                 inputReadOnly={true}
//                 required
//                 style={{
//                   width: "100%",
//                   padding: "6px 10px",
//                   borderRadius: "5px",
//                   border: "1px solid #ced4da",
//                   fontSize: "16px",
//                   zIndex: 9999,
//                 }}
//                 popupStyle={{ zIndex: 9999 }}
//                 disabled={isEditMode}
//               />
//               {isEditMode && (
//                 <Alert
//                   message="Note: The date and time range cannot be modified to ensure consistency for ticket holders."
//                   type="info"
//                   showIcon
//                   style={{ marginTop: "10px" }}
//                 />
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Location</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleInputChange}
//                 placeholder="Times Square"
//                 required
//               />
//             </Form.Group>

//             {formData.dateRange && (
//               <Form.Group className="mb-3">
//                 <Form.Label>Select Character</Form.Label>
//                 <Select
//                   style={{ width: "100%", zIndex: 9999 }}
//                   placeholder="Select a character"
//                   onChange={setSelectedCharacterId}
//                   value={selectedCharacterId}
//                   dropdownStyle={{ zIndex: 9999 }}
//                   disabled={isEditMode} // Vô hiệu hóa khi chỉnh sửa
//                 >
//                   {characters.map((char) => (
//                     <Option key={char.characterId} value={char.characterId}>
//                       {char.characterName} (Quantity: {char.quantity}, ID: {char.characterId})
//                     </Option>
//                   ))}
//                 </Select>
//                 {isEditMode && (
//                   <Alert
//                     message="Note: Cosplayers cannot be modified after the festival is created to ensure ticket holders meet their expected cosplayers."
//                     type="info"
//                     showIcon
//                     style={{ marginTop: "10px" }}
//                   />
//                 )}

//                 {selectedCharacterId && !isEditMode && (
//                   <div className="character-info mt-3">
//                     {characters
//                       .filter((char) => char.characterId === selectedCharacterId)
//                       .map((char) => (
//                         <div key={char.characterId} style={{ display: "flex", alignItems: "center" }}>
//                           <img
//                             src={
//                               char.images?.find((img) => img.isAvatar)?.urlImage ||
//                               char.images?.[0]?.urlImage ||
//                               "https://via.placeholder.com/100?text=No+Image"
//                             }
//                             alt={char.characterName}
//                             style={{
//                               width: "50px",
//                               height: "50px",
//                               borderRadius: "5px",
//                               marginRight: "10px",
//                               objectFit: "cover",
//                             }}
//                           />
//                           <div>
//                             <strong>{char.characterName}</strong>
//                             <p>Quantity: {char.quantity}</p>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 )}

//                 {selectedCharacterId && cosplayers.length > 0 && !isEditMode && (
//                   <div className="cosplayer-grid mt-3">
//                     <h5>Available Cosplayers</h5>
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
//                         gap: "15px",
//                         padding: "10px",
//                         maxHeight: "300px",
//                         overflowY: "auto",
//                       }}
//                     >
//                       {cosplayers.map((cosplayer) => (
//                         <div
//                           key={cosplayer.accountId}
//                           style={{
//                             border: "1px solid #e0e0e0",
//                             borderRadius: "8px",
//                             padding: "10px",
//                             textAlign: "center",
//                             backgroundColor: "#fff",
//                             boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//                             transition: "transform 0.2s",
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                             height: "180px",
//                           }}
//                           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//                         >
//                           <div
//                             style={{
//                               width: "100px",
//                               height: "100px",
//                               borderRadius: "50%",
//                               overflow: "hidden",
//                               backgroundColor: "#f0f0f0",
//                               marginBottom: "10px",
//                             }}
//                           >
//                             <img
//                               src={
//                                 cosplayer.images?.find((img) => img.isAvatar)?.urlImage ||
//                                 cosplayer.images?.[0]?.urlImage ||
//                                 "https://via.placeholder.com/100?text=No+Image"
//                               }
//                               alt={cosplayer.name}
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                               }}
//                             />
//                           </div>
//                           <p
//                             style={{
//                               fontSize: "14px",
//                               fontWeight: "500",
//                               margin: "0 0 10px",
//                               color: "#333",
//                               flex: "1",
//                             }}
//                           >
//                             {cosplayer.name}
//                           </p>
//                           <Button
//                             type="primary"
//                             size="small"
//                             onClick={() => handleAddCosplayer(cosplayer)}
//                             style={{
//                               fontSize: "12px",
//                               padding: "2px 8px",
//                               borderRadius: "4px",
//                               background: "linear-gradient(135deg, #510545, #22668a)",
//                               border: "none",
//                             }}
//                             onMouseEnter={(e) =>
//                               (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//                             }
//                             onMouseLeave={(e) =>
//                               (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//                             }
//                           >
//                             Add
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {selectedCharacterId && cosplayers.length === 0 && !isEditMode && (
//                   <p className="mt-2">No cosplayers available for this character.</p>
//                 )}

//                 <h5 className="mt-3">Selected Cosplayers</h5>
//                 <List
//                   dataSource={formData.selectedCosplayers}
//                   renderItem={(item, index) => {
//                     const character = characters.find((c) => c.characterId === item.characterId);
//                     return (
//                       <List.Item
//                         actions={
//                           !isEditMode
//                             ? [
//                               <Button
//                                 type="primary"
//                                 danger
//                                 size="small"
//                                 onClick={() => handleRemoveCosplayer(index)}
//                               >
//                                 Remove
//                               </Button>,
//                             ]
//                             : []
//                         }
//                       >
//                         <List.Item.Meta
//                           title={`Character: ${character?.characterName || item.characterId}`}
//                           description={`Cosplayer: ${item.cosplayerName}`}
//                         />
//                       </List.Item>
//                     );
//                   }}
//                 />
//               </Form.Group>
//             )}

//             <Form.Group className="mb-3">
//               <Form.Label>Tickets</Form.Label>
//               {formData.tickets.map((ticket, index) => (
//                 <div key={index} className="mb-2 border p-3 rounded">
//                   <Form.Group className="mb-2">
//                     <Form.Label>Quantity</Form.Label>
//                     <Form.Control
//                       type="number"
//                       min="0"
//                       value={ticket.quantity}
//                       onChange={(e) =>
//                         handleArrayChange("tickets", index, "quantity", Number(e.target.value))
//                       }
//                       placeholder="Quantity"
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-2">
//                     <Form.Label>Price</Form.Label>
//                     <Form.Control
//                       type="number"
//                       min="0"
//                       value={ticket.price}
//                       onChange={(e) =>
//                         handleArrayChange("tickets", index, "price", Number(e.target.value))
//                       }
//                       placeholder="Price"
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-2">
//                     <Form.Label>Description</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={ticket.description}
//                       onChange={(e) =>
//                         handleArrayChange("tickets", index, "description", e.target.value)
//                       }
//                       placeholder="Description"
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-2">
//                     <Form.Label>Ticket Type</Form.Label>
//                     <Form.Select
//                       value={ticket.ticketType}
//                       onChange={(e) =>
//                         handleArrayChange("tickets", index, "ticketType", Number(e.target.value))
//                       }
//                       required
//                     >
//                       {getAvailableTicketTypes(index).map((type) => (
//                         <option key={type} value={type}>
//                           {type === 0 ? "Normal" : "Premium"}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                 </div>
//               ))}
//               <Button
//                 variant="outline-primary"
//                 onClick={() =>
//                   addArrayItem("tickets", {
//                     ticketId: null,
//                     quantity: 0,
//                     price: 0,
//                     description: "",
//                     ticketType: formData.tickets[0]?.ticketType === 0 ? 1 : 0,
//                   })
//                 }
//                 disabled={isAddTicketDisabled()}
//                 style={{
//                   background: isAddTicketDisabled()
//                     ? "#d0d0d0"
//                     : "linear-gradient(135deg, #510545, #22668a)",
//                   border: "none",
//                   color: "#fff",
//                 }}
//                 onMouseEnter={(e) =>
//                   !isAddTicketDisabled() &&
//                   (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//                 }
//                 onMouseLeave={(e) =>
//                   !isAddTicketDisabled() &&
//                   (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//                 }
//               >
//                 <PlusCircle size={16} className="me-1" /> Add Ticket
//               </Button>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Event Activities</Form.Label>
//               <Select
//                 mode="multiple"
//                 style={{ width: "100%", zIndex: 9999 }}
//                 placeholder="Select activities"
//                 onChange={handleActivityChange}
//                 optionLabelProp="label"
//                 value={formData.eventActivities.map((act) => act.activityId)}
//                 dropdownStyle={{ zIndex: 9999 }}
//               >
//                 {activities.map((act) => (
//                   <Option key={act.activityId} value={act.activityId} label={act.name}>
//                     {act.name} - {act.description}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Images</Form.Label>
//               {isEditMode && formData.existingImages.length > 0 && (
//                 <div style={{ marginBottom: "10px" }}>
//                   <strong>Existing Images:</strong>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: "10px",
//                       marginTop: "10px",
//                     }}
//                   >
//                     {formData.existingImages.map((image) => (
//                       <div
//                         key={image.imageId}
//                         style={{
//                           position: "relative",
//                           width: "100px",
//                           height: "100px",
//                         }}
//                       >
//                         <img
//                           src={image.imageUrl}
//                           alt={`existing-${image.imageId}`}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             borderRadius: "5px",
//                           }}
//                         />
//                         <Button
//                           type="primary"
//                           danger
//                           size="small"
//                           onClick={() => removeExistingImage(image.imageId)}
//                           style={{
//                             position: "absolute",
//                             top: "5px",
//                             right: "5px",
//                             fontSize: "10px",
//                             padding: "2px 5px",
//                           }}
//                         >
//                           X
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <Form.Control
//                 type="file"
//                 multiple
//                 onChange={handleImageFilesChange}
//                 accept="image/*"
//                 required={formData.existingImages.length === 0 && formData.imageFiles.length === 0}
//               />
//               {formData.imagePreviews.length > 0 && (
//                 <div style={{ marginTop: "10px" }}>
//                   <strong>New Images:</strong>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: "10px",
//                       marginTop: "10px",
//                     }}
//                   >
//                     {formData.imagePreviews.map((preview, index) => (
//                       <div
//                         key={index}
//                         style={{
//                           position: "relative",
//                           width: "100px",
//                           height: "100px",
//                         }}
//                       >
//                         <img
//                           src={preview}
//                           alt={`preview-${index}`}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             borderRadius: "5px",
//                           }}
//                         />
//                         <Button
//                           type="primary"
//                           danger
//                           size="small"
//                           onClick={() => removeImage(index)}
//                           style={{
//                             position: "absolute",
//                             top: "5px",
//                             right: "5px",
//                             fontSize: "10px",
//                             padding: "2px 5px",
//                           }}
//                         >
//                           X
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <Button
//                 variant="outline-primary"
//                 onClick={addMoreImages}
//                 style={{
//                   marginTop: "10px",
//                   background: "linear-gradient(135deg, #510545, #22668a)",
//                   border: "none",
//                   color: "#fff",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//                 }
//               >
//                 <PlusCircle size={16} className="me-1" /> Add More Images
//               </Button>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             type="default"
//             onClick={handleCancel}
//             style={{
//               background: "#e0e0e0",
//               border: "none",
//               color: "#333",
//             }}
//             onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
//             onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="primary"
//             onClick={handleSubmit}
//             style={{
//               background: "linear-gradient(135deg, #510545, #22668a)",
//               border: "none",
//             }}
//             onMouseEnter={(e) =>
//               (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//             }
//             onMouseLeave={(e) =>
//               (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//             }
//           >
//             {isEditMode ? "Update" : "Create"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={isDetailsModalVisible}
//         onHide={handleCancel}
//         centered
//         size="lg"
//         className="festival-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Event Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {eventDetails && (
//             <div>
//               <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
//                 Event Images
//               </h3>
//               <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//                 {eventDetails.eventImageResponses.map((img) => (
//                   <Image key={img.imageId} src={img.imageUrl} width={150} />
//                 ))}
//               </div>

//               <Descriptions
//                 title={
//                   <span style={{ fontSize: "22px", fontWeight: 600, color: "#510545" }}>
//                     Event Information
//                   </span>
//                 }
//                 bordered
//                 column={1}
//                 style={{ marginTop: 16 }}
//               >
//                 <Descriptions.Item label="Event Name">
//                   {eventDetails.eventName}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Description">
//                   {eventDetails.description}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Location">
//                   {eventDetails.location}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Start Date">
//                   {formatDateVN(eventDetails.startDate)}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="End Date">
//                   {formatDateVN(eventDetails.endDate)}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Create Date">
//                   {formatDateVN(eventDetails.createDate)}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Created By">
//                   {eventDetails.createBy || "Unknown"}
//                 </Descriptions.Item>
//               </Descriptions>

//               <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
//                 Activities
//               </h3>
//               <List
//                 dataSource={eventDetails.eventActivityResponse}
//                 renderItem={(activity) => (
//                   <List.Item>
//                     <Descriptions bordered column={1}>
//                       <Descriptions.Item label="Name">
//                         {activity.activity?.name || activity.activityId}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Description">
//                         {activity.description}
//                       </Descriptions.Item>
//                     </Descriptions>
//                   </List.Item>
//                 )}
//               />

//               <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
//                 Cosplayers
//               </h3>
//               <List
//                 dataSource={eventDetails.cosplayers}
//                 renderItem={(cosplayer) => (
//                   <List.Item>
//                     <Descriptions bordered column={1}>
//                       <Descriptions.Item label="Name">
//                         {cosplayer.name}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Description">
//                         {cosplayer.description}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Image">
//                         <Image src={cosplayer.urlImage} width={100} />
//                       </Descriptions.Item>
//                     </Descriptions>
//                   </List.Item>
//                 )}
//               />

//               <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
//                 Tickets
//               </h3>
//               <List
//                 dataSource={eventDetails.ticket}
//                 renderItem={(ticket) => (
//                   <List.Item>
//                     <Descriptions bordered column={1}>
//                       <Descriptions.Item label="Type">
//                         {ticket.ticketType === 0 ? "Normal" : "Premium"}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Description">
//                         {ticket.description}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Quantity">
//                         {ticket.quantity}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Price">
//                         {ticket.price.toLocaleString()} VND
//                       </Descriptions.Item>
//                     </Descriptions>
//                   </List.Item>
//                 )}
//               />
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             type="default"
//             onClick={handleCancel}
//             style={{
//               background: "#e0e0e0",
//               border: "none",
//               color: "#333",
//             }}
//             onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
//             onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ManageAllFestivals;

//----------------------------------------------------------------------------------------------//

//sửa 24/05/2025

// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Modal,
//   Form,
//   Card,
//   Pagination,
//   Dropdown,
// } from "react-bootstrap";
// import { Button, Popconfirm, Image, Descriptions, List, Select, Alert, Input } from "antd";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ArrowUp, ArrowDown, PlusCircle } from "lucide-react";
// import "../../../styles/Manager/ManageAllFestivals.scss";
// import ManageAllFestivalsService from "../../../services/ManageServicePages/ManageAllFestivalsService/ManageAllFestivalsService";
// import { DatePicker } from "antd";
// import dayjs from "dayjs";
// import { jwtDecode } from "jwt-decode";
// import ProfileService from "../../../services/ProfileService/ProfileService";

// // Khai báo các hằng số
// const { RangePicker: DateRangePicker } = DatePicker;
// const { Option } = Select;
// const dateTimeFormat = "DD/MM/YYYY HH:mm";

// // Component chính để quản lý các lễ hội
// const ManageAllFestivals = () => {
//   // State để quản lý danh sách lễ hội
//   const [festivals, setFestivals] = useState([]);
//   // State để kiểm soát hiển thị modal tạo/sửa
//   const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
//   // State để xác định chế độ chỉnh sửa
//   const [isEditMode, setIsEditMode] = useState(false);
//   // State để hiển thị modal chi tiết
//   const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
//   // State để lưu lễ hội được chọn
//   const [selectedFestival, setSelectedFestival] = useState(null);
//   // State để lưu chi tiết sự kiện
//   const [eventDetails, setEventDetails] = useState(null);
//   // State để lưu danh sách nhân vật
//   const [characters, setCharacters] = useState([]);
//   // State để lưu danh sách hoạt động
//   const [activities, setActivities] = useState([]);
//   // State để lưu danh sách cosplayer
//   const [cosplayers, setCosplayers] = useState([]);
//   // State để lưu ID nhân vật được chọn
//   const [selectedCharacterId, setSelectedCharacterId] = useState(null);
//   // State để lưu danh sách tỉnh/thành phố
//   const [provinces, setProvinces] = useState([]);
//   // State để lưu danh sách quận/huyện
//   const [districts, setDistricts] = useState([]);
//   // State để lưu danh sách phường/xã
//   const [wards, setWards] = useState([]);
//   // State để lưu tỉnh/thành phố được chọn
//   const [selectedProvince, setSelectedProvince] = useState(null);
//   // State để lưu quận/huyện được chọn
//   const [selectedDistrict, setSelectedDistrict] = useState(null);
//   // State để lưu phường/xã được chọn
//   const [selectedWard, setSelectedWard] = useState(null);
//   // State để lưu địa chỉ đường phố
//   const [streetAddress, setStreetAddress] = useState("");
//   // State để lưu dữ liệu form
//   const [formData, setFormData] = useState({
//     eventName: "",
//     description: "",
//     dateRange: null,
//     location: "",
//     tickets: [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
//     selectedCosplayers: [],
//     eventActivities: [],
//     imageFiles: [],
//     imagePreviews: [],
//     existingImages: [],
//     imagesDeleted: [],
//     initialImageIds: [],
//   });
//   // State để lưu từ khóa tìm kiếm
//   const [searchTerm, setSearchTerm] = useState("");
//   // State để lưu trạng thái sắp xếp
//   const [sortFestival, setSortFestival] = useState({
//     field: "eventName",
//     order: "asc",
//   });
//   // State để lưu trang hiện tại
//   const [currentPage, setCurrentPage] = useState(1);
//   // State để lưu số hàng mỗi trang
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   // Mảng tùy chọn số hàng mỗi trang
//   const rowsPerPageOptions = [10, 20, 30];

//   // Hàm định dạng ngày theo chuẩn Việt Nam
//   const formatDateVN = (dateString) => {
//     return dayjs(dateString).format("DD/MM/YYYY");
//   };

//   // Lấy danh sách tỉnh/thành phố khi component được mount
//   useEffect(() => {
//     const fetchProvinces = async () => {
//       try {
//         const provinceData = await ManageAllFestivalsService.getProvinces();
//         console.log("Province Data:", provinceData); // Kiểm tra dữ liệu tỉnh
//         setProvinces(provinceData);
//       } catch (error) {
//         toast.error(error.message || "Failed to load provinces");
//       }
//     };
//     fetchProvinces();
//   }, []);

//   // Lấy danh sách quận/huyện khi tỉnh/thành phố thay đổi
//   useEffect(() => {
//     if (selectedProvince) {
//       const fetchDistricts = async () => {
//         try {
//           console.log("Fetching districts for province:", selectedProvince);
//           const districtData = await ManageAllFestivalsService.getDistricts(selectedProvince);
//           setDistricts(districtData);
//           setSelectedDistrict(null);
//           setWards([]);
//           setSelectedWard(null);
//         } catch (error) {
//           toast.error(error.message || "Failed to load districts");
//         }
//       };
//       fetchDistricts();
//     } else {
//       setDistricts([]);
//       setSelectedDistrict(null);
//       setWards([]);
//       setSelectedWard(null);
//     }
//   }, [selectedProvince]);

//   // Lấy danh sách phường/xã khi quận/huyện thay đổi
//   useEffect(() => {
//     if (selectedDistrict) {
//       const fetchWards = async () => {
//         try {
//           console.log("Fetching wards for district:", selectedDistrict);
//           const wardData = await ManageAllFestivalsService.getWards(selectedDistrict);
//           setWards(wardData);
//           setSelectedWard(null);
//         } catch (error) {
//           toast.error(error.message || "Failed to load wards");
//         }
//       };
//       fetchWards();
//     } else {
//       setWards([]);
//       setSelectedWard(null);
//     }
//   }, [selectedDistrict]);

//   // Cập nhật trường location khi các lựa chọn vị trí thay đổi
//   useEffect(() => {
//     let location = "";
//     if (streetAddress && selectedWard && selectedDistrict && selectedProvince) {
//       const wardName = wards.find((w) => w.wardCode === selectedWard)?.wardName || "";
//       const districtName = districts.find((d) => d.districtId === selectedDistrict)?.districtName || "";
//       const provinceName = provinces.find((p) => p.provinceId === selectedProvince)?.provinceName || "";
//       location = `${streetAddress}, ${wardName}, ${districtName}, ${provinceName}`;
//     }
//     setFormData((prev) => ({ ...prev, location }));
//   }, [streetAddress, selectedWard, selectedDistrict, selectedProvince, wards, districts, provinces]);

//   // Tải dữ liệu vị trí ban đầu cho chế độ chỉnh sửa
//   useEffect(() => {
//     if (isEditMode && selectedFestival?.location) {
//       // Phân tích chuỗi vị trí để điền sẵn vào dropdown
//       const locationParts = selectedFestival.location.split(", ").map((part) => part.trim());
//       if (locationParts.length === 4) {
//         const [street, ward, district, province] = locationParts;
//         setStreetAddress(street);

//         // Tìm tỉnh/thành phố phù hợp
//         const provinceMatch = provinces.find((p) => p.provinceName === province);
//         if (provinceMatch) {
//           setSelectedProvince(provinceMatch.provinceId);
//           // Lấy danh sách quận/huyện và phường/xã
//           const fetchDistrictsAndWards = async () => {
//             try {
//               const districtData = await ManageAllFestivalsService.getDistricts(provinceMatch.provinceId);
//               setDistricts(districtData);
//               const districtMatch = districtData.find((d) => d.districtName === district);
//               if (districtMatch) {
//                 setSelectedDistrict(districtMatch.districtId);
//                 const wardData = await ManageAllFestivalsService.getWards(districtMatch.districtId);
//                 setWards(wardData);
//                 const wardMatch = wardData.find((w) => w.wardName === ward);
//                 if (wardMatch) {
//                   setSelectedWard(wardMatch.wardCode);
//                 }
//               }
//             } catch (error) {
//               toast.error(error.message || "Failed to load location data");
//             }
//           };
//           fetchDistrictsAndWards();
//         }
//       }
//     }
//   }, [isEditMode, selectedFestival, provinces]);

//   // Lấy danh sách nhân vật và hoạt động khi mở modal tạo/sửa hoặc chi tiết
//   useEffect(() => {
//     if (isCreateModalVisible || isDetailsModalVisible) {
//       const fetchCharactersAndActivities = async () => {
//         try {
//           let charData = [];
//           if (formData.dateRange) {
//             const [startDate, endDate] = formData.dateRange;
//             const formattedStartDate = startDate.format("DD/MM/YYYY");
//             const formattedEndDate = endDate.format("DD/MM/YYYY");
//             charData = await ManageAllFestivalsService.getAllCharacters(
//               formattedStartDate,
//               formattedEndDate
//             );
//             console.log("Characters:", charData);
//             charData.forEach((char) =>
//               console.log("Character ID:", char.characterId, typeof char.characterId)
//             );
//           }
//           setCharacters(Array.isArray(charData) ? charData : []);

//           const actData = await ManageAllFestivalsService.getAllActivities();
//           console.log("Activities:", actData);
//           setActivities(Array.isArray(actData) ? actData : []);
//         } catch (error) {
//           toast.error(error.message || "Failed to load characters or activities");
//           setCharacters([]);
//           setActivities([]);
//         }
//       };
//       fetchCharactersAndActivities();
//     }
//   }, [isCreateModalVisible, isDetailsModalVisible, formData.dateRange]);

//   // Lấy danh sách cosplayer khi chọn nhân vật và có khoảng thời gian
//   useEffect(() => {
//     if (selectedCharacterId && formData.dateRange) {
//       if (typeof selectedCharacterId !== "string" || !selectedCharacterId) {
//         toast.error("Invalid character ID");
//         setCosplayers([]);
//         return;
//       }

//       const [startDate, endDate] = formData.dateRange;
//       const startDateTime = startDate.format("HH:mm DD/MM/YYYY");
//       const endDateTime = endDate.format("HH:mm DD/MM/YYYY");

//       console.log("Fetching cosplayers with:", {
//         characterId: selectedCharacterId,
//         startDate: startDateTime,
//         endDate: endDateTime,
//       });

//       const fetchCosplayers = async () => {
//         try {
//           const cosplayerData = await ManageAllFestivalsService.getAvailableCosplayers(
//             selectedCharacterId,
//             startDateTime,
//             endDateTime
//           );
//           const selectedCosplayerIds = formData.selectedCosplayers.map((sc) => sc.cosplayerId);
//           const filteredCosplayers = cosplayerData.filter(
//             (cosplayer) => !selectedCosplayerIds.includes(cosplayer.accountId)
//           );
//           console.log("Filtered Cosplayers:", filteredCosplayers);
//           filteredCosplayers.forEach((cosplayer) => {
//             console.log(`Cosplayer ${cosplayer.name} images:`, cosplayer.images);
//           });
//           if (Array.isArray(filteredCosplayers) && filteredCosplayers.length === 0) {
//             toast.warn("No cosplayers available for this character and time range.");
//           }
//           setCosplayers(Array.isArray(filteredCosplayers) ? filteredCosplayers : []);
//         } catch (error) {
//           console.error("Error fetching cosplayers:", error.response?.data || error);
//           toast.error(error.message || "Failed to load cosplayers");
//           setCosplayers([]);
//         }
//       };
//       fetchCosplayers();
//     } else {
//       setCosplayers([]);
//     }
//   }, [selectedCharacterId, formData.dateRange, formData.selectedCosplayers]);

//   // Lấy danh sách lễ hội khi tìm kiếm thay đổi
//   useEffect(() => {
//     const fetchFestivals = async () => {
//       try {
//         const data = await ManageAllFestivalsService.getAllEvents(searchTerm);
//         setFestivals(data);
//       } catch (error) {
//         toast.error(error.message || "Failed to load festivals");
//       }
//     };
//     fetchFestivals();
//   }, [searchTerm]);

//   // Hàm lọc và sắp xếp dữ liệu
//   const filterAndSortData = (data, search, sort) => {
//     let filtered = [...data];
//     if (search) {
//       filtered = filtered.filter(
//         (item) =>
//           item.eventName.toLowerCase().includes(search.toLowerCase()) ||
//           item.description.toLowerCase().includes(search.toLowerCase()) ||
//           item.location.toLowerCase().includes(search.toLowerCase()) ||
//           item.startDate.toLowerCase().includes(search.toLowerCase()) ||
//           item.endDate.toLowerCase().includes(search.toLowerCase()) ||
//           item.createDate.toLowerCase().includes(search.toLowerCase()) ||
//           (item.createBy && item.createBy.toLowerCase().includes(search.toLowerCase()))
//       );
//     }
//     return filtered.sort((a, b) => {
//       const valueA = String(a[sort.field] || "").toLowerCase();
//       const valueB = String(b[sort.field] || "").toLowerCase();
//       return sort.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   // Lọc và phân trang dữ liệu
//   const filteredFestivals = filterAndSortData(festivals, searchTerm, sortFestival);
//   const totalEntries = filteredFestivals.length;
//   const totalPages = Math.ceil(totalEntries / rowsPerPage);
//   const paginatedFestivals = paginateData(filteredFestivals, currentPage);

//   // Hàm phân trang dữ liệu
//   function paginateData(data, page) {
//     const startIndex = (page - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex);
//   }

//   // Tính toán thông tin phân trang
//   const startEntry = (currentPage - 1) * rowsPerPage + 1;
//   const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
//   const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

//   // Hiển thị modal tạo mới
//   const showCreateModal = () => {
//     setIsEditMode(false);
//     setSelectedFestival(null);
//     setSelectedProvince(null);
//     setSelectedDistrict(null);
//     setSelectedWard(null);
//     setStreetAddress("");
//     setFormData({
//       eventName: "",
//       description: "",
//       dateRange: null,
//       location: "",
//       tickets: [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
//       selectedCosplayers: [],
//       eventActivities: [],
//       imageFiles: [],
//       imagePreviews: [],
//       existingImages: [],
//       imagesDeleted: [],
//       initialImageIds: [],
//     });
//     setSelectedCharacterId(null);
//     setCosplayers([]);
//     setIsCreateModalVisible(true);
//   };

//   // Hiển thị modal chỉnh sửa
//   const showEditModal = async (record) => {
//     try {
//       const eventData = await ManageAllFestivalsService.getEventById(record.eventId);

//       // Gộp các vé cùng loại
//       const ticketsByType = eventData.ticket.reduce((acc, t) => {
//         const type = t.ticketType;
//         if (!acc[type]) {
//           acc[type] = {
//             ticketId: t.ticketId,
//             quantity: t.quantity,
//             price: t.price,
//             description: t.description,
//             ticketType: type,
//           };
//         } else {
//           acc[type].quantity += t.quantity;
//           acc[type].price = t.price;
//           acc[type].description = t.description;
//         }
//         return acc;
//       }, {});
//       const tickets = Object.values(ticketsByType);

//       // Lấy danh sách cosplayer hiện có
//       const selectedCosplayers = eventData.eventCharacterResponses.map((ec) => ({
//         characterId: ec.characterId,
//         cosplayerId: ec.cosplayerId,
//         cosplayerName: ec.cosplayerName || "Unknown",
//         description: ec.description || "Cosplayer for event",
//       }));

//       // Lấy dữ liệu hoạt động
//       const eventActivities = eventData.eventActivityResponse.map((act) => ({
//         activityId: act.activityId,
//         description: act.description || "",
//         createBy: act.createBy || "",
//       }));

//       // Lấy danh sách ảnh hiện có
//       const existingImages = eventData.eventImageResponses.map((img) => ({
//         imageId: img.imageId,
//         imageUrl: img.imageUrl,
//       }));
//       const initialImageIds = existingImages.map((img) => img.imageId);

//       setFormData({
//         eventName: eventData.eventName,
//         description: eventData.description,
//         dateRange: [
//           dayjs(eventData.startDate, "YYYY-MM-DD HH:mm:ss"),
//           dayjs(eventData.endDate, "YYYY-MM-DD HH:mm:ss"),
//         ],
//         location: eventData.location,
//         tickets: tickets.length > 0 ? tickets : [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
//         selectedCosplayers,
//         eventActivities,
//         imageFiles: [],
//         imagePreviews: [],
//         existingImages,
//         imagesDeleted: [],
//         initialImageIds,
//       });

//       setSelectedCharacterId(null);
//       setCosplayers([]);
//       setIsEditMode(true);
//       setSelectedFestival(record);
//       setIsCreateModalVisible(true);
//     } catch (error) {
//       toast.error(error.message || "Failed to load event data for editing");
//     }
//   };

//   // Hiển thị modal chi tiết
//   const showDetailsModal = async (record) => {
//     try {
//       const eventData = await ManageAllFestivalsService.getEventById(record.eventId);
//       console.log("Event data:", eventData);
//       const cosplayers = await Promise.all(
//         eventData.eventCharacterResponses.map(async (ec) => {
//           const cosplayer = await ManageAllFestivalsService.getCosplayerByEventCharacterId(
//             ec.eventCharacterId
//           );
//           const character = characters.find((char) => char.characterId === ec.characterId);
//           console.log("Cosplayer data:", cosplayer);
//           return {
//             eventCharacterId: ec.eventCharacterId,
//             name: cosplayer.name,
//             description: character ? `Cosplay as ${character.characterName}` : "No character info",
//             urlImage:
//               cosplayer.images?.find((img) => img.isAvatar)?.urlImage ||
//               cosplayer.images?.[0]?.urlImage ||
//               "https://via.placeholder.com/100?text=No+Image",
//           };
//         })
//       );

//       const updatedActivities = eventData.eventActivityResponse.map((activity) => {
//         const matchingActivity = activities.find((act) => act.activityId === activity.activityId);
//         console.log(`Activity ${activity.activityId}:`, { matchingActivity, description: matchingActivity?.description });
//         return {
//           ...activity,
//           description: matchingActivity?.description || "No description available",
//         };
//       });

//       // Gộp vé trong chi tiết sự kiện
//       const ticketsByType = eventData.ticket.reduce((acc, t) => {
//         const type = t.ticketType;
//         if (!acc[type]) {
//           acc[type] = {
//             ticketId: t.ticketId,
//             quantity: t.quantity,
//             price: t.price,
//             description: t.description,
//             ticketType: type,
//           };
//         } else {
//           acc[type].quantity += t.quantity;
//           acc[type].price = t.price;
//           acc[type].description = t.description;
//         }
//         return acc;
//       }, {});
//       const tickets = Object.values(ticketsByType);

//       setEventDetails({ ...eventData, cosplayers, eventActivityResponse: updatedActivities, ticket: tickets });
//       setIsDetailsModalVisible(true);
//     } catch (error) {
//       toast.error(error.message || "Failed to load event details");
//     }
//   };

//   // Đóng modal
//   const handleCancel = () => {
//     setIsCreateModalVisible(false);
//     setIsDetailsModalVisible(false);
//     setFormData({
//       eventName: "",
//       description: "",
//       dateRange: null,
//       location: "",
//       tickets: [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
//       selectedCosplayers: [],
//       eventActivities: [],
//       imageFiles: [],
//       imagePreviews: [],
//       existingImages: [],
//       imagesDeleted: [],
//       initialImageIds: [],
//     });
//     setSelectedCharacterId(null);
//     setCosplayers([]);
//     setSelectedProvince(null);
//     setSelectedDistrict(null);
//     setSelectedWard(null);
//     setStreetAddress("");
//   };

//   // Xử lý thay đổi input
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Xử lý thay đổi khoảng thời gian
//   const handleDateRangeChange = (dates) => {
//     if (!dates) {
//       setFormData((prev) => ({ ...prev, dateRange: null }));
//       setSelectedCharacterId(null);
//       setCosplayers([]);
//       setCharacters([]);
//       return;
//     }

//     const [start, end] = dates;
//     const today = dayjs().startOf("day");
//     const tomorrow = today.add(1, "day");

//     if (start.isBefore(tomorrow)) {
//       toast.error("Start date must be tomorrow or later!");
//       setFormData((prev) => ({ ...prev, dateRange: null }));
//       setSelectedCharacterId(null);
//       setCosplayers([]);
//       setCharacters([]);
//       return;
//     }

//     if (end.isBefore(start)) {
//       toast.error("End date must be on or after start date!");
//       setFormData((prev) => ({ ...prev, dateRange: null }));
//       setSelectedCharacterId(null);
//       setCosplayers([]);
//       setCharacters([]);
//       return;
//     }

//     setFormData((prev) => ({ ...prev, dateRange: dates }));
//     setSelectedCharacterId(null);
//     setCosplayers([]);
//   };

//   // Vô hiệu hóa ngày trước ngày mai
//   const disabledDate = (current) => {
//     const today = dayjs().startOf("day");
//     const tomorrow = today.add(1, "day");
//     return current && current < tomorrow;
//   };

//   // Vô hiệu hóa giờ ngoài khoảng 8h-22h
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

//   // Xử lý thay đổi mảng (vé, cosplayer, hoạt động)
//   const handleArrayChange = (arrayName, index, field, value) => {
//     if ((field === "quantity" || field === "price") && Number(value) < 0) {
//       toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be negative!`);
//       return;
//     }
//     setFormData((prev) => {
//       const updatedArray = [...prev[arrayName]];
//       updatedArray[index] = { ...updatedArray[index], [field]: value };
//       return { ...prev, [arrayName]: updatedArray };
//     });
//   };

//   // Xử lý thay đổi file ảnh
//   const handleImageFilesChange = (e) => {
//     const files = Array.from(e.target.files);
//     const newPreviews = files.map((file) => URL.createObjectURL(file));
//     setFormData((prev) => ({
//       ...prev,
//       imageFiles: [...prev.imageFiles, ...files],
//       imagePreviews: [...prev.imagePreviews, ...newPreviews],
//     }));
//   };

//   // Thêm ảnh mới
//   const addMoreImages = () => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
//     input.multiple = true;
//     input.onchange = handleImageFilesChange;
//     input.click();
//   };

//   // Xóa ảnh mới
//   const removeImage = (index) => {
//     setFormData((prev) => {
//       const updatedFiles = [...prev.imageFiles];
//       const updatedPreviews = [...prev.imagePreviews];
//       updatedFiles.splice(index, 1);
//       updatedPreviews.splice(index, 1);
//       URL.revokeObjectURL(prev.imagePreviews[index]);
//       return {
//         ...prev,
//         imageFiles: updatedFiles,
//         imagePreviews: updatedPreviews,
//       };
//     });
//   };

//   // Xóa ảnh hiện có
//   const removeExistingImage = (imageId) => {
//     setFormData((prev) => {
//       const updatedExistingImages = prev.existingImages.filter((img) => img.imageId !== imageId);
//       const updatedImagesDeleted = [...prev.imagesDeleted, { imageId }];
//       console.log(`Removing image with imageId=${imageId}, imagesDeleted:`, updatedImagesDeleted);
//       return {
//         ...prev,
//         existingImages: updatedExistingImages,
//         imagesDeleted: updatedImagesDeleted,
//       };
//     });
//   };

//   // Thêm mục vào mảng
//   const addArrayItem = (arrayName, defaultItem) => {
//     setFormData((prev) => ({
//       ...prev,
//       [arrayName]: [...prev[arrayName], defaultItem],
//     }));
//   };

//   // Thêm cosplayer
//   const handleAddCosplayer = (cosplayer) => {
//     const character = characters.find((c) => c.characterId === selectedCharacterId);
//     const currentCount = formData.selectedCosplayers.filter(
//       (sc) => sc.characterId === selectedCharacterId
//     ).length;

//     if (currentCount >= character.quantity) {
//       toast.error(
//         `Cannot add more cosplayers for ${character.characterName}. Maximum quantity is ${character.quantity}.`
//       );
//       return;
//     }

//     setFormData((prev) => ({
//       ...prev,
//       selectedCosplayers: [
//         ...prev.selectedCosplayers,
//         {
//           characterId: selectedCharacterId,
//           cosplayerId: cosplayer.accountId,
//           cosplayerName: cosplayer.name,
//           description: cosplayer.description || "Cosplayer for event",
//         },
//       ],
//     }));
//     toast.success(`Added cosplayer ${cosplayer.name}`);
//   };

//   // Xóa cosplayer
//   const handleRemoveCosplayer = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedCosplayers: prev.selectedCosplayers.filter((_, i) => i !== index),
//     }));
//   };

//   // Xử lý thay đổi hoạt động
//   const handleActivityChange = (selectedActivityIds) => {
//     const newActivities = selectedActivityIds.map((activityId) => ({
//       activityId,
//       description: activities.find((act) => act.activityId === activityId)?.description || "",
//       createBy: "",
//     }));
//     setFormData((prev) => ({
//       ...prev,
//       eventActivities: newActivities,
//     }));
//   };

//   // Xác thực form
//   const validateForm = () => {
//     const errors = [];
//     if (!formData.eventName.trim()) errors.push("Event name is required");
//     if (!formData.description.trim()) errors.push("Description is required");
//     if (!selectedProvince) errors.push("Province is required");
//     if (!selectedDistrict) errors.push("District is required");
//     if (!selectedWard) errors.push("Ward is required");
//     if (!streetAddress.trim()) errors.push("Street address is required");
//     if (!formData.dateRange) errors.push("Date and time range is required");
//     if (formData.tickets.length === 0) errors.push("At least one ticket is required");
//     if (formData.selectedCosplayers.length === 0)
//       errors.push("At least one cosplayer is required");
//     if (formData.eventActivities.length === 0)
//       errors.push("At least one activity is required");
//     if (formData.existingImages.length === 0 && formData.imageFiles.length === 0)
//       errors.push("At least one image is required");
//     return errors;
//   };

//   // Xử lý submit form
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const errors = validateForm();
//     if (errors.length > 0) {
//       toast.error(errors.join("; "));
//       return;
//     }

//     try {
//       const [startDate, endDate] = formData.dateRange;
//       const token = localStorage.getItem("accessToken");
//       let createBy = "Unknown User";

//       if (token) {
//         try {
//           const decodedToken = jwtDecode(token);
//           console.log("Decoded token:", decodedToken);
//           const accountId =
//             decodedToken.Id ||
//             decodedToken.id ||
//             decodedToken.sub ||
//             decodedToken.userId;

//           if (!accountId) {
//             console.warn("No accountId found in decoded token");
//           } else {
//             try {
//               const profileData = await ProfileService.getProfileById(accountId);
//               createBy = profileData.name || "Unknown User";
//               console.log("Profile name fetched:", createBy);
//             } catch (error) {
//               console.error("Error fetching profile:", error);
//               toast.error("Failed to fetch user profile");
//             }
//           }
//         } catch (error) {
//           console.error("Error decoding token:", error);
//           toast.error("Invalid access token");
//         }
//       } else {
//         console.warn("No access token found in localStorage");
//         toast.warn("No access token available");
//       }

//       // Tính toán danh sách ảnh bị xóa
//       const imagesDeleted = formData.initialImageIds
//         .filter((id) => !formData.existingImages.some((img) => img.imageId === id))
//         .map((imageId) => ({ imageId }));
//       console.log("Computed imagesDeleted:", imagesDeleted);

//       const eventData = {
//         eventName: formData.eventName,
//         description: formData.description,
//         location: formData.location,
//         createBy: createBy,
//         ticket: formData.tickets.map((t) => {
//           const ticketData = {
//             quantity: t.quantity,
//             price: t.price,
//             description: t.description,
//             ticketType: t.ticketType,
//           };
//           if (isEditMode && t.ticketId) {
//             ticketData.ticketId = t.ticketId;
//           }
//           return ticketData;
//         }),
//         imagesDeleted,
//         eventCharacterRequest: formData.selectedCosplayers.map((sc) => ({
//           characterId: sc.characterId,
//           cosplayerId: sc.cosplayerId,
//           description: sc.description,
//         })),
//         eventActivityRequests: formData.eventActivities,
//       };

//       if (!isEditMode) {
//         eventData.startDate = startDate.toISOString();
//         eventData.endDate = endDate.toISOString();
//       }

//       const eventJson = JSON.stringify(eventData, null, 0);
//       console.log("Event JSON before sending:", eventJson);
//       console.log("Image files before sending:", formData.imageFiles);
//       console.log("ImagesDeleted before sending:", imagesDeleted);
//       console.log("EventCharacterRequest before sending:", formData.selectedCosplayers);

//       if (isEditMode) {
//         await ManageAllFestivalsService.updateEvent(
//           selectedFestival.eventId,
//           eventJson,
//           formData.imageFiles
//         );
//         toast.success("Festival updated successfully!");
//         const updatedEvent = await ManageAllFestivalsService.getEventById(selectedFestival.eventId);
//         console.log("Updated event details:", updatedEvent);
//       } else {
//         await ManageAllFestivalsService.addEvent(eventJson, formData.imageFiles);
//         toast.success("Festival created successfully!");
//       }

//       const updatedFestivals = await ManageAllFestivalsService.getAllEvents(searchTerm);
//       setFestivals(updatedFestivals);
//       handleCancel();
//     } catch (error) {
//       console.error("Error submitting event:", error);
//       toast.error(error.message || `Failed to ${isEditMode ? "update" : "create"} festival`);
//     }
//   };

//   // Xử lý tìm kiếm
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   // Xử lý sắp xếp
//   const handleSort = (field) => {
//     setSortFestival((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPage(1);
//   };

//   // Xử lý thay đổi trang
//   const handlePageChange = (page) => setCurrentPage(page);

//   // Xử lý thay đổi số hàng mỗi trang
//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPage(1);
//   };

//   // Kiểm tra nút thêm vé có bị vô hiệu hóa
//   const isAddTicketDisabled = () => {
//     const ticketTypes = formData.tickets.map((ticket) => ticket.ticketType);
//     return ticketTypes.includes(0) && ticketTypes.includes(1);
//   };

//   // Lấy các loại vé có sẵn
//   const getAvailableTicketTypes = (currentIndex) => {
//     const ticketTypes = formData.tickets.map((ticket, index) => (index !== currentIndex ? ticket.ticketType : null)).filter((type) => type !== null);
//     if (ticketTypes.length === 0) {
//       return [0, 1];
//     }
//     return ticketTypes.includes(0) ? [1] : [0];
//   };

//   // Giao diện component
//   return (
//     <div className="manage-festivals">
//       <h2 className="manage-festivals-title">Manage Festivals</h2>
//       <div className="content-container">
//         <Card className="manage-festivals-card">
//           <Card.Body>
//             <div className="table-header">
//               <h3>Festivals</h3>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by Name, Description, Location, or Created By..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="search-input"
//               />
//               <Button
//                 type="primary"
//                 size="large"
//                 onClick={showCreateModal}
//                 style={{
//                   background: "linear-gradient(135deg, #510545, #22668a)",
//                   border: "none",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "5px",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//                 }
//               >
//                 <PlusCircle size={16} /> Add New Festival
//               </Button>
//             </div>
//             <Table striped bordered hover responsive>
//               <thead>
//                 <tr>
//                   <th className="text-center">
//                     <span
//                       className="sortable"
//                       onClick={() => handleSort("eventName")}
//                     >
//                       Event Name
//                       {sortFestival.field === "eventName" ? (
//                         sortFestival.order === "asc" ? (
//                           <ArrowUp size={16} />
//                         ) : (
//                           <ArrowDown size={16} />
//                         )
//                       ) : (
//                         <ArrowUp size={16} className="default-sort-icon" />
//                       )}
//                     </span>
//                   </th>
//                   <th className="text-center">Description</th>
//                   <th className="text-center">Location</th>
//                   <th className="text-center">
//                     <span
//                       className="sortable"
//                       onClick={() => handleSort("startDate")}
//                     >
//                       Start Date
//                       {sortFestival.field === "startDate" ? (
//                         sortFestival.order === "asc" ? (
//                           <ArrowUp size={16} />
//                         ) : (
//                           <ArrowDown size={16} />
//                         )
//                       ) : (
//                         <ArrowUp size={16} className="default-sort-icon" />
//                       )}
//                     </span>
//                   </th>
//                   <th className="text-center">End Date</th>
//                   <th className="text-center">
//                     <span
//                       className="sortable"
//                       onClick={() => handleSort("createDate")}
//                     >
//                       Create Date
//                       {sortFestival.field === "createDate" ? (
//                         sortFestival.order === "asc" ? (
//                           <ArrowUp size={16} />
//                         ) : (
//                           <ArrowDown size={16} />
//                         )
//                       ) : (
//                         <ArrowUp size={16} className="default-sort-icon" />
//                       )}
//                     </span>
//                   </th>
//                   <th className="text-center">
//                     <span
//                       className="sortable"
//                       onClick={() => handleSort("createBy")}
//                     >
//                       Created By
//                       {sortFestival.field === "createBy" ? (
//                         sortFestival.order === "asc" ? (
//                           <ArrowUp size={16} />
//                         ) : (
//                           <ArrowDown size={16} />
//                         )
//                       ) : (
//                         <ArrowUp size={16} className="default-sort-icon" />
//                       )}
//                     </span>
//                   </th>
//                   <th className="text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedFestivals.map((festival) => (
//                   <tr key={festival.eventId}>
//                     <td className="text-center">{festival.eventName}</td>
//                     <td className="text-center">
//                       {festival.description.length > 50
//                         ? `${festival.description.slice(0, 50)}...`
//                         : festival.description}
//                     </td>
//                     <td className="text-center">{festival.location}</td>
//                     <td className="text-center">{formatDateVN(festival.startDate)}</td>
//                     <td className="text-center">{formatDateVN(festival.endDate)}</td>
//                     <td className="text-center">{formatDateVN(festival.createDate)}</td>
//                     <td className="text-center">{festival.createBy || "Unknown"}</td>
//                     <td className="text-center" style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
//                       <Button
//                         type="primary"
//                         size="middle"
//                         onClick={() => showEditModal(festival)}
//                         style={{
//                           background: "linear-gradient(135deg, #510545, #22668a)",
//                           border: "none",
//                         }}
//                         onMouseEnter={(e) =>
//                           (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//                         }
//                         onMouseLeave={(e) =>
//                           (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//                         }
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         type="default"
//                         size="middle"
//                         onClick={() => showDetailsModal(festival)}
//                         style={{
//                           background: "#e0e0e0",
//                           border: "none",
//                           color: "#333",
//                         }}
//                         onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
//                         onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
//                       >
//                         Details
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <div className="pagination-controls">
//               <div className="pagination-info">
//                 <span>{showingText}</span>
//                 <div className="rows-per-page">
//                   <span>Rows per page: </span>
//                   <Dropdown
//                     onSelect={(value) => handleRowsPerPageChange(Number(value))}
//                     className="d-inline-block"
//                   >
//                     <Dropdown.Toggle
//                       variant="secondary"
//                       id="dropdown-rows-per-page"
//                       style={{
//                         padding: "4px 8px",
//                         fontSize: "14px",
//                         borderRadius: "4px",
//                         background: "#e0e0e0",
//                         border: "none",
//                         color: "#333",
//                       }}
//                     >
//                       {rowsPerPage}
//                     </Dropdown.Toggle>
//                     <Dropdown.Menu>
//                       {rowsPerPageOptions.map((option) => (
//                         <Dropdown.Item key={option} eventKey={option}>
//                           {option}
//                         </Dropdown.Item>
//                       ))}
//                     </Dropdown.Menu>
//                   </Dropdown>
//                 </div>
//               </div>
//               <Pagination>
//                 <Pagination.First
//                   onClick={() => handlePageChange(1)}
//                   disabled={currentPage === 1}
//                 />
//                 <Pagination.Prev
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                 />
//                 {[...Array(totalPages).keys()].map((page) => (
//                   <Pagination.Item
//                     key={page + 1}
//                     active={page + 1 === currentPage}
//                     onClick={() => handlePageChange(page + 1)}
//                   >
//                     {page + 1}
//                   </Pagination.Item>
//                 ))}
//                 <Pagination.Next
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                 />
//                 <Pagination.Last
//                   onClick={() => handlePageChange(totalPages)}
//                   disabled={currentPage === totalPages}
//                 />
//               </Pagination>
//             </div>
//           </Card.Body>
//         </Card>
//       </div>

//       <Modal
//         show={isCreateModalVisible}
//         onHide={handleCancel}
//         centered
//         className="festival-modal"
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {isEditMode ? "Edit Festival" : "Create Festival"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Event Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="eventName"
//                 value={formData.eventName}
//                 onChange={handleInputChange}
//                 placeholder="New Year Festival"
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Event description"
//                 required
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Date and Time Range</Form.Label>
//               <DateRangePicker
//                 value={formData.dateRange}
//                 onChange={handleDateRangeChange}
//                 format={dateTimeFormat}
//                 disabledDate={disabledDate}
//                 disabledTime={disabledTime}
//                 showTime={{ format: "HH:mm" }}
//                 allowClear={false}
//                 inputReadOnly={true}
//                 required
//                 style={{
//                   width: "100%",
//                   padding: "6px 10px",
//                   borderRadius: "5px",
//                   border: "1px solid #ced4da",
//                   fontSize: "16px",
//                   zIndex: 9999,
//                 }}
//                 popupStyle={{ zIndex: 9999 }}
//                 disabled={isEditMode}
//               />
//               {isEditMode && (
//                 <Alert
//                   message="Note: The date and time range cannot be modified to ensure consistency for ticket holders."
//                   type="info"
//                   showIcon
//                   style={{ marginTop: "10px" }}
//                 />
//               )}
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Location</Form.Label>
//               <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//                 <Input
//                   placeholder="Enter street address (e.g., 793/60 Trần Xuân Soạn)"
//                   value={streetAddress}
//                   onChange={(e) => setStreetAddress(e.target.value)}
//                   required
//                 />
//                 <Select
//                   placeholder="Select province"
//                   value={selectedProvince}
//                   onChange={setSelectedProvince}
//                   style={{ width: "100%" }}
//                   required
//                   showSearch // Cho phép tìm kiếm tỉnh
//                   optionFilterProp="children" // Lọc theo nội dung hiển thị
//                   filterOption={(input, option) =>
//                     option.children.toLowerCase().includes(input.toLowerCase())
//                   }
//                   dropdownStyle={{ zIndex: 10000 }} // Tăng z-index để tránh bị che
//                   getPopupContainer={(trigger) => trigger.parentNode} // Gắn dropdown vào parent
//                 >
//                   {provinces.map((province) => (
//                     <Option key={province.provinceId} value={province.provinceId}>
//                       {province.provinceName}
//                     </Option>
//                   ))}
//                 </Select>
//                 <Select
//                   placeholder="Select district"
//                   value={selectedDistrict}
//                   onChange={setSelectedDistrict}
//                   style={{ width: "100%" }}
//                   disabled={!selectedProvince}
//                   required
//                   showSearch
//                   optionFilterProp="children"
//                   filterOption={(input, option) =>
//                     option.children.toLowerCase().includes(input.toLowerCase())
//                   }
//                   dropdownStyle={{ zIndex: 10000 }}
//                   getPopupContainer={(trigger) => trigger.parentNode}
//                 >
//                   {districts.map((district) => (
//                     <Option key={district.districtId} value={district.districtId}>
//                       {district.districtName}
//                     </Option>
//                   ))}
//                 </Select>
//                 <Select
//                   placeholder="Select ward"
//                   value={selectedWard}
//                   onChange={setSelectedWard}
//                   style={{ width: "100%" }}
//                   disabled={!selectedDistrict}
//                   required
//                   showSearch
//                   optionFilterProp="children"
//                   filterOption={(input, option) =>
//                     option.children.toLowerCase().includes(input.toLowerCase())
//                   }
//                   dropdownStyle={{ zIndex: 10000 }}
//                   getPopupContainer={(trigger) => trigger.parentNode}
//                 >
//                   {wards.map((ward) => (
//                     <Option key={ward.wardCode} value={ward.wardCode}>
//                       {ward.wardName}
//                     </Option>
//                   ))}
//                 </Select>
//                 <Form.Control
//                   type="text"
//                   name="location"
//                   value={formData.location}
//                   readOnly
//                   placeholder="Full address will appear here"
//                   required
//                 />
//               </div>
//             </Form.Group>

//             {formData.dateRange && (
//               <Form.Group className="mb-3">
//                 <Form.Label>Select Character</Form.Label>
//                 <Select
//                   style={{ width: "100%", zIndex: 9999 }}
//                   placeholder="Select a character"
//                   onChange={setSelectedCharacterId}
//                   value={selectedCharacterId}
//                   dropdownStyle={{ zIndex: 9999 }}
//                   disabled={isEditMode}
//                   showSearch
//                   optionFilterProp="children"
//                   filterOption={(input, option) =>
//                     option.children.toLowerCase().includes(input.toLowerCase())
//                   }
//                   getPopupContainer={(trigger) => trigger.parentNode}
//                 >
//                   {characters.map((char) => (
//                     <Option key={char.characterId} value={char.characterId}>
//                       {char.characterName} (Quantity: {char.quantity}, ID: {char.characterId})
//                     </Option>
//                   ))}
//                 </Select>
//                 {isEditMode && (
//                   <Alert
//                     message="Note: Cosplayers cannot be modified after the festival is created to ensure ticket holders meet their expected cosplayers."
//                     type="info"
//                     showIcon
//                     style={{ marginTop: "10px" }}
//                   />
//                 )}

//                 {selectedCharacterId && !isEditMode && (
//                   <div className="character-info mt-3">
//                     {characters
//                       .filter((char) => char.characterId === selectedCharacterId)
//                       .map((char) => (
//                         <div key={char.characterId} style={{ display: "flex", alignItems: "center" }}>
//                           <img
//                             src={
//                               char.images?.find((img) => img.isAvatar)?.urlImage ||
//                               char.images?.[0]?.urlImage ||
//                               "https://via.placeholder.com/100?text=No+Image"
//                             }
//                             alt={char.characterName}
//                             style={{
//                               width: "50px",
//                               height: "50px",
//                               borderRadius: "5px",
//                               marginRight: "10px",
//                               objectFit: "cover",
//                             }}
//                           />
//                           <div>
//                             <strong>{char.characterName}</strong>
//                             <p>Quantity: {char.quantity}</p>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 )}

//                 {selectedCharacterId && cosplayers.length > 0 && !isEditMode && (
//                   <div className="cosplayer-grid mt-3">
//                     <h5>Available Cosplayers</h5>
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
//                         gap: "15px",
//                         padding: "10px",
//                         maxHeight: "300px",
//                         overflowY: "auto",
//                       }}
//                     >
//                       {cosplayers.map((cosplayer) => (
//                         <div
//                           key={cosplayer.accountId}
//                           style={{
//                             border: "1px solid #e0e0e0",
//                             borderRadius: "8px",
//                             padding: "10px",
//                             textAlign: "center",
//                             backgroundColor: "#fff",
//                             boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
//                             transition: "transform 0.2s",
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                             height: "180px",
//                           }}
//                           onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
//                           onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
//                         >
//                           <div
//                             style={{
//                               width: "100px",
//                               height: "100px",
//                               borderRadius: "50%",
//                               overflow: "hidden",
//                               backgroundColor: "#f0f0f0",
//                               marginBottom: "10px",
//                             }}
//                           >
//                             <img
//                               src={
//                                 cosplayer.images?.find((img) => img.isAvatar)?.urlImage ||
//                                 cosplayer.images?.[0]?.urlImage ||
//                                 "https://via.placeholder.com/100?text=No+Image"
//                               }
//                               alt={cosplayer.name}
//                               style={{
//                                 width: "100%",
//                                 height: "100%",
//                                 objectFit: "cover",
//                               }}
//                             />
//                           </div>
//                           <p
//                             style={{
//                               fontSize: "14px",
//                               fontWeight: "500",
//                               margin: "0 0 10px",
//                               color: "#333",
//                               flex: "1",
//                             }}
//                           >
//                             {cosplayer.name}
//                           </p>
//                           <Button
//                             type="primary"
//                             size="small"
//                             onClick={() => handleAddCosplayer(cosplayer)}
//                             style={{
//                               fontSize: "12px",
//                               padding: "2px 8px",
//                               borderRadius: "4px",
//                               background: "linear-gradient(135deg, #510545, #22668a)",
//                               border: "none",
//                             }}
//                             onMouseEnter={(e) =>
//                               (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//                             }
//                             onMouseLeave={(e) =>
//                               (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//                             }
//                           >
//                             Add
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {selectedCharacterId && cosplayers.length === 0 && !isEditMode && (
//                   <p className="mt-2">No cosplayers available for this character.</p>
//                 )}

//                 <h5 className="mt-3">Selected Cosplayers</h5>
//                 <List
//                   dataSource={formData.selectedCosplayers}
//                   renderItem={(item, index) => {
//                     const character = characters.find((c) => c.characterId === item.characterId);
//                     return (
//                       <List.Item
//                         actions={
//                           !isEditMode
//                             ? [
//                               <Button
//                                 type="primary"
//                                 danger
//                                 size="small"
//                                 onClick={() => handleRemoveCosplayer(index)}
//                               >
//                                 Remove
//                               </Button>,
//                             ]
//                             : []
//                         }
//                       >
//                         <List.Item.Meta
//                           title={`Character: ${character?.characterName || item.characterId}`}
//                           description={`Cosplayer: ${item.cosplayerName}`}
//                         />
//                       </List.Item>
//                     );
//                   }}
//                 />
//               </Form.Group>
//             )}

//             <Form.Group className="mb-3">
//               <Form.Label>Tickets</Form.Label>
//               {formData.tickets.map((ticket, index) => (
//                 <div key={index} className="mb-2 border p-3 rounded">
//                   <Form.Group className="mb-2">
//                     <Form.Label>Quantity</Form.Label>
//                     <Form.Control
//                       type="number"
//                       min="0"
//                       value={ticket.quantity}
//                       onChange={(e) =>
//                         handleArrayChange("tickets", index, "quantity", Number(e.target.value))
//                       }
//                       placeholder="Quantity"
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-2">
//                     <Form.Label>Price</Form.Label>
//                     <Form.Control
//                       type="number"
//                       min="0"
//                       value={ticket.price}
//                       onChange={(e) =>
//                         handleArrayChange("tickets", index, "price", Number(e.target.value))
//                       }
//                       placeholder="Price"
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-2">
//                     <Form.Label>Description</Form.Label>
//                     <Form.Control
//                       type="text"
//                       value={ticket.description}
//                       onChange={(e) =>
//                         handleArrayChange("tickets", index, "description", e.target.value)
//                       }
//                       placeholder="Description"
//                       required
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-2">
//                     <Form.Label>Ticket Type</Form.Label>
//                     <Form.Select
//                       value={ticket.ticketType}
//                       onChange={(e) =>
//                         handleArrayChange("tickets", index, "ticketType", Number(e.target.value))
//                       }
//                       required
//                     >
//                       {getAvailableTicketTypes(index).map((type) => (
//                         <option key={type} value={type}>
//                           {type === 0 ? "Normal" : "Premium"}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Form.Group>
//                 </div>
//               ))}
//               <Button
//                 variant="outline-primary"
//                 onClick={() =>
//                   addArrayItem("tickets", {
//                     ticketId: null,
//                     quantity: 0,
//                     price: 0,
//                     description: "",
//                     ticketType: formData.tickets[0]?.ticketType === 0 ? 1 : 0,
//                   })
//                 }
//                 disabled={isAddTicketDisabled()}
//                 style={{
//                   background: isAddTicketDisabled()
//                     ? "#d0d0d0"
//                     : "linear-gradient(135deg, #510545, #22668a)",
//                   border: "none",
//                   color: "#fff",
//                 }}
//                 onMouseEnter={(e) =>
//                   !isAddTicketDisabled() &&
//                   (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//                 }
//                 onMouseLeave={(e) =>
//                   !isAddTicketDisabled() &&
//                   (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//                 }
//               >
//                 <PlusCircle size={16} className="me-1" /> Add Ticket
//               </Button>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Event Activities</Form.Label>
//               <Select
//                 mode="multiple"
//                 style={{ width: "100%", zIndex: 9999 }}
//                 placeholder="Select activities"
//                 onChange={handleActivityChange}
//                 optionLabelProp="label"
//                 value={formData.eventActivities.map((act) => act.activityId)}
//                 dropdownStyle={{ zIndex: 9999 }}
//                 showSearch
//                 optionFilterProp="children"
//                 filterOption={(input, option) =>
//                   option.children.toLowerCase().includes(input.toLowerCase())
//                 }
//                 getPopupContainer={(trigger) => trigger.parentNode}
//               >
//                 {activities.map((act) => (
//                   <Option key={act.activityId} value={act.activityId} label={act.name}>
//                     {act.name} - {act.description}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label>Images</Form.Label>
//               {isEditMode && formData.existingImages.length > 0 && (
//                 <div style={{ marginBottom: "10px" }}>
//                   <strong>Existing Images:</strong>
//                   <div
//                     superfluous="true"
//                     style={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: "10px",
//                       marginTop: "10px",
//                     }}
//                   >
//                     {formData.existingImages.map((image) => (
//                       <div
//                         key={image.imageId}
//                         style={{
//                           position: "relative",
//                           width: "100px",
//                           height: "100px",
//                         }}
//                       >
//                         <img
//                           src={image.imageUrl}
//                           alt={`existing-${image.imageId}`}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             borderRadius: "5px",
//                           }}
//                         />
//                         <Button
//                           type="primary"
//                           danger
//                           size="small"
//                           onClick={() => removeExistingImage(image.imageId)}
//                           style={{
//                             position: "absolute",
//                             top: "5px",
//                             right: "5px",
//                             fontSize: "10px",
//                             padding: "2px 5px",
//                           }}
//                         >
//                           X
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <Form.Control
//                 type="file"
//                 multiple
//                 onChange={handleImageFilesChange}
//                 accept="image/*"
//                 required={formData.existingImages.length === 0 && formData.imageFiles.length === 0}
//               />
//               {formData.imagePreviews.length > 0 && (
//                 <div style={{ marginTop: "10px" }}>
//                   <strong>New Images:</strong>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexWrap: "wrap",
//                       gap: "10px",
//                       marginTop: "10px",
//                     }}
//                   >
//                     {formData.imagePreviews.map((preview, index) => (
//                       <div
//                         key={index}
//                         style={{
//                           position: "relative",
//                           width: "100px",
//                           height: "100px",
//                         }}
//                       >
//                         <img
//                           src={preview}
//                           alt={`preview-${index}`}
//                           style={{
//                             width: "100%",
//                             height: "100%",
//                             objectFit: "cover",
//                             borderRadius: "5px",
//                           }}
//                         />
//                         <Button
//                           type="primary"
//                           danger
//                           size="small"
//                           onClick={() => removeImage(index)}
//                           style={{
//                             position: "absolute",
//                             top: "5px",
//                             right: "5px",
//                             fontSize: "10px",
//                             padding: "2px 5px",
//                           }}
//                         >
//                           X
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <Button
//                 variant="outline-primary"
//                 onClick={addMoreImages}
//                 style={{
//                   marginTop: "10px",
//                   background: "linear-gradient(135deg, #510545, #22668a)",
//                   border: "none",
//                   color: "#fff",
//                 }}
//                 onMouseEnter={(e) =>
//                   (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//                 }
//                 onMouseLeave={(e) =>
//                   (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//                 }
//               >
//                 <PlusCircle size={16} className="me-1" /> Add More Images
//               </Button>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             type="default"
//             onClick={handleCancel}
//             style={{
//               background: "#e0e0e0",
//               border: "none",
//               color: "#333",
//             }}
//             onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
//             onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="primary"
//             onClick={handleSubmit}
//             style={{
//               background: "linear-gradient(135deg, #510545, #22668a)",
//               border: "none",
//             }}
//             onMouseEnter={(e) =>
//               (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
//             }
//             onMouseLeave={(e) =>
//               (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
//             }
//           >
//             {isEditMode ? "Update" : "Create"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={isDetailsModalVisible}
//         onHide={handleCancel}
//         centered
//         size="lg"
//         className="festival-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Event Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {eventDetails && (
//             <div>
//               <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
//                 Event Images
//               </h3>
//               <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
//                 {eventDetails.eventImageResponses.map((img) => (
//                   <Image key={img.imageId} src={img.imageUrl} width={150} />
//                 ))}
//               </div>

//               <Descriptions
//                 title={
//                   <span style={{ fontSize: "22px", fontWeight: 600, color: "#510545" }}>
//                     Event Information
//                   </span>
//                 }
//                 bordered
//                 column={1}
//                 style={{ marginTop: 16 }}
//               >
//                 <Descriptions.Item label="Event Name">
//                   {eventDetails.eventName}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Description">
//                   {eventDetails.description}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Location">
//                   {eventDetails.location}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Start Date">
//                   {formatDateVN(eventDetails.startDate)}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="End Date">
//                   {formatDateVN(eventDetails.endDate)}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Create Date">
//                   {formatDateVN(eventDetails.createDate)}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Created By">
//                   {eventDetails.createBy || "Unknown"}
//                 </Descriptions.Item>
//               </Descriptions>

//               <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
//                 Activities
//               </h3>
//               <List
//                 dataSource={eventDetails.eventActivityResponse}
//                 renderItem={(activity) => (
//                   <List.Item>
//                     <Descriptions bordered column={1}>
//                       <Descriptions.Item label="Name">
//                         {activity.activity?.name || activity.activityId}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Description">
//                         {activity.description}
//                       </Descriptions.Item>
//                     </Descriptions>
//                   </List.Item>
//                 )}
//               />

//               <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
//                 Cosplayers
//               </h3>
//               <List
//                 dataSource={eventDetails.cosplayers}
//                 renderItem={(cosplayer) => (
//                   <List.Item>
//                     <Descriptions bordered column={1}>
//                       <Descriptions.Item label="Name">
//                         {cosplayer.name}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Description">
//                         {cosplayer.description}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Image">
//                         <Image src={cosplayer.urlImage} width={100} />
//                       </Descriptions.Item>
//                     </Descriptions>
//                   </List.Item>
//                 )}
//               />

//               <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
//                 Tickets
//               </h3>
//               <List
//                 dataSource={eventDetails.ticket}
//                 renderItem={(ticket) => (
//                   <List.Item>
//                     <Descriptions bordered column={1}>
//                       <Descriptions.Item label="Type">
//                         {ticket.ticketType === 0 ? "Normal" : "Premium"}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Description">
//                         {ticket.description}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Quantity">
//                         {ticket.quantity}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Price">
//                         {ticket.price.toLocaleString()} VND
//                       </Descriptions.Item>
//                     </Descriptions>
//                   </List.Item>
//                 )}
//               />
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             type="default"
//             onClick={handleCancel}
//             style={{
//               background: "#e0e0e0",
//               border: "none",
//               color: "#333",
//             }}
//             onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
//             onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ManageAllFestivals;

//----------------------------------------------------------------------------------------------//

//sửa ngày 27/05/2025

import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { Button, Popconfirm, Image, Descriptions, List, Select, Alert, Input } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown, PlusCircle } from "lucide-react";
import "../../../styles/Manager/ManageAllFestivals.scss";
import ManageAllFestivalsService from "../../../services/ManageServicePages/ManageAllFestivalsService/ManageAllFestivalsService";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { jwtDecode } from "jwt-decode";
import ProfileService from "../../../services/ProfileService/ProfileService";

dayjs.extend(utc);
dayjs.extend(timezone);

// Khai báo các hằng số
const { RangePicker: DateRangePicker } = DatePicker;
const { Option } = Select;
const dateTimeFormat = "DD/MM/YYYY HH:mm";
const apiDateTimeFormat = "HH:mm DD/MM/YYYY";

// Component chính để quản lý các lễ hội
const ManageAllFestivals = () => {
  const [isCosplayerEdited, setIsCosplayerEdited] = useState(false);
  // State để quản lý danh sách lễ hội
  const [festivals, setFestivals] = useState([]);
  // State để kiểm soát hiển thị modal tạo/sửa
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  // State để xác định chế độ chỉnh sửa
  const [isEditMode, setIsEditMode] = useState(false);
  // State để hiển thị modal chi tiết
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  // State để lưu lễ hội được chọn
  const [selectedFestival, setSelectedFestival] = useState(null);
  // State để lưu chi tiết sự kiện
  const [eventDetails, setEventDetails] = useState(null);
  // State để lưu danh sách nhân vật
  const [characters, setCharacters] = useState([]);
  // State để lưu danh sách hoạt động
  const [activities, setActivities] = useState([]);
  // State để lưu danh sách cosplayer
  const [cosplayers, setCosplayers] = useState([]);
  // State để lưu ID nhân vật được chọn
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  // địa chỉ
  const [locations, setLocations] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  // State để lưu dữ liệu form
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    dateRange: null,
    location: "",
    tickets: [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
    selectedCosplayers: [],
    eventActivities: [],
    imageFiles: [],
    imagePreviews: [],
    existingImages: [],
    imagesDeleted: [],
    initialImageIds: [],
  });
  // State để lưu từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  // State để lưu trạng thái sắp xếp
  const [sortFestival, setSortFestival] = useState({
    field: "eventName",
    order: "asc",
  });
  // State để lưu trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  // State để lưu số hàng mỗi trang
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Mảng tùy chọn số hàng mỗi trang
  const rowsPerPageOptions = [10, 20, 30];

  // Hàm định dạng ngày theo chuẩn Việt Nam
  const formatDateVN = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  // Ngay sau khai báo state
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const actData = await ManageAllFestivalsService.getAllActivities();
        setActivities(Array.isArray(actData) ? actData : []);
      } catch (error) {
        toast.error(error.message || "Failed to load activities", { autoClose: 7000 });
        setActivities([]);
      }
    };
    fetchActivities();
  }, []);

  // Thêm useEffect để gọi API GET /api/Location
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationData = await ManageAllFestivalsService.getLocations();
        setLocations(Array.isArray(locationData) ? locationData : []);
      } catch (error) {
        toast.error(error.message || "Failed to load locations", { autoClose: 7000 });
      }
    };
    fetchLocations();
  }, []);

  // Lấy danh sách nhân vật khi mở modal tạo/sửa hoặc chi tiết
  useEffect(() => {
    if (isCreateModalVisible && formData.dateRange) {
      const fetchCharacters = async () => {
        try {
          const [startDate, endDate] = formData.dateRange;
          const formattedStartDate = startDate.format("DD/MM/YYYY");
          const formattedEndDate = endDate.format("DD/MM/YYYY");
          const charData = await ManageAllFestivalsService.getAllCharacters(
            formattedStartDate,
            formattedEndDate
          );
          setCharacters(Array.isArray(charData) ? charData : []);
        } catch (error) {
          toast.error(error.message || "Failed to load characters", { autoClose: 7000 });
          setCharacters([]);
        }
      };
      fetchCharacters();
    }
  }, [isCreateModalVisible, formData.dateRange]);

  // Lấy danh sách cosplayer khi chọn nhân vật và có khoảng thời gian
  useEffect(() => {
    if (selectedCharacterId && formData.dateRange) {
      if (typeof selectedCharacterId !== "string" || !selectedCharacterId) {
        toast.error("Invalid character ID", { autoClose: 7000 });
        setCosplayers([]);
        return;
      }

      const [startDate, endDate] = formData.dateRange;
      const startDateTime = startDate.toISOString();
      const endDateTime = endDate.toISOString();

      const fetchCosplayers = async () => {
        try {
          const cosplayerData = await ManageAllFestivalsService.getAvailableCosplayers(
            selectedCharacterId,
            startDateTime,
            endDateTime
          );
          const selectedCosplayerIds = formData.selectedCosplayers.map((sc) => sc.cosplayerId);
          const filteredCosplayers = cosplayerData.filter(
            (cosplayer) => !selectedCosplayerIds.includes(cosplayer.accountId)
          );
          if (filteredCosplayers.length === 0) {
            toast.warn("No cosplayers available for this character and time range.", { autoClose: 7000 });
          }
          setCosplayers(filteredCosplayers);
        } catch (error) {
          toast.error(error.message || "Failed to load cosplayers", { autoClose: 7000 });
          setCosplayers([]);
        }
      };
      fetchCosplayers();
    } else {
      setCosplayers([]);
    }
  }, [selectedCharacterId, formData.dateRange, formData.selectedCosplayers]);

  // Lấy danh sách lễ hội khi tìm kiếm thay đổi
  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const data = await ManageAllFestivalsService.getAllEvents(searchTerm);
        setFestivals(data);
      } catch (error) {
        toast.error(error.message || "Failed to load festivals");
      }
    };
    fetchFestivals();
  }, [searchTerm]);

  // Hàm lọc và sắp xếp dữ liệu
  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.eventName.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase()) ||
          item.startDate.toLowerCase().includes(search.toLowerCase()) ||
          item.endDate.toLowerCase().includes(search.toLowerCase()) ||
          item.createDate.toLowerCase().includes(search.toLowerCase()) ||
          (item.createBy && item.createBy.toLowerCase().includes(search.toLowerCase()))
      );
    }
    return filtered.sort((a, b) => {
      const valueA = String(a[sort.field] || "").toLowerCase();
      const valueB = String(b[sort.field] || "").toLowerCase();
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const formatDateForAvailableCosplayers = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
  };

  const formatDateForEvent = (date) => {
    return new Date(date).toISOString();
  };

  // Lọc và phân trang dữ liệu
  const filteredFestivals = filterAndSortData(festivals, searchTerm, sortFestival);
  const totalEntries = filteredFestivals.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedFestivals = paginateData(filteredFestivals, currentPage);

  // Hàm phân trang dữ liệu
  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  // Tính toán thông tin phân trang
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  // Hiển thị modal tạo mới
  const showCreateModal = () => {
    setIsEditMode(false);
    setSelectedFestival(null);
    setSelectedLocationId(null);
    setSelectedCharacterId(null);
    setCosplayers([]);
    setCharacters([]);
    setFormData({
      eventName: "",
      description: "",
      dateRange: null,
      locationId: null,
      tickets: [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
      selectedCosplayers: [],
      eventActivities: [],
      imageFiles: [],
      imagePreviews: [],
      existingImages: [],
      imagesDeleted: [],
      initialImageIds: [],
    });
    setIsCreateModalVisible(true);
  };

  const handleRemoveCosplayer = (cosplayerId) => {
    setFormData((prev) => ({
      ...prev,
      selectedCosplayers: prev.selectedCosplayers.filter(
        (sc) => sc.cosplayerId !== cosplayerId
      ),
    }));
    setIsCosplayerEdited(true);
    toast.success("Cosplayer removed successfully", { autoClose: 2000 });
  };

  // Hiển thị modal chỉnh sửa
  // Hiển thị modal chỉnh sửa
  const showEditModal = async (record) => {
    try {
      const eventData = await ManageAllFestivalsService.getEventById(record.eventId);

      const ticketsByType = eventData.ticket.reduce((acc, t) => {
        const type = t.ticketType;
        if (!acc[type]) {
          acc[type] = {
            ticketId: t.ticketId,
            quantity: t.quantity.toString(), // Convert to string
            price: t.price.toString(), // Convert to string
            description: t.description,
            ticketType: type,
          };
        } else {
          acc[type].quantity += t.quantity;
          acc[type].price = t.price;
          acc[type].description = t.description;
        }
        return acc;
      }, {});
      const tickets = Object.values(ticketsByType);

      const eventActivities = eventData.eventActivityResponse.map((act) => ({
        activityId: act.activityId,
        description: act.description || "",
        createBy: act.createBy || "",
      }));

      const existingImages = eventData.eventImageResponses.map((img) => ({
        imageId: img.imageId,
        imageUrl: img.imageUrl,
      }));
      const initialImageIds = existingImages.map((img) => img.imageId);

      // Tải characters
      let charData = [];
      try {
        const startDate = dayjs(eventData.startDate).format("DD/MM/YYYY");
        const endDate = dayjs(eventData.endDate).format("DD/MM/YYYY");
        charData = await ManageAllFestivalsService.getAllCharacters(startDate, endDate);
      } catch (error) {
        toast.error(error.message || "Failed to load characters for festival", { autoClose: 7000 });
      }
      setCharacters(Array.isArray(charData) ? charData : []);

      setFormData({
        eventName: eventData.eventName,
        description: eventData.description,
        dateRange: [
          dayjs(eventData.startDate).tz("Asia/Ho_Chi_Minh"),
          dayjs(eventData.endDate).tz("Asia/Ho_Chi_Minh"),
        ],
        locationId: eventData.locationId,
        tickets: tickets.length > 0 ? tickets : [{ ticketId: null, quantity: "0", price: "0", description: "", ticketType: 0 }],
        selectedCosplayers: [], // Empty to force re-selection
        eventActivities,
        imageFiles: [],
        imagePreviews: [],
        existingImages,
        imagesDeleted: [],
        initialImageIds,
      });

      setSelectedLocationId(eventData.locationId);
      setSelectedCharacterId(null);
      setCosplayers([]);
      setIsCosplayerEdited(false); // Initialize as false to keep existing cosplayers unless modified
      setIsEditMode(true);
      setSelectedFestival(record);
      setIsCreateModalVisible(true);
    } catch (error) {
      toast.error(error.message || "Failed to load festival data for editing", { autoClose: 7000 });
    }
  };

  // Hiển thị modal chi tiết
  const showDetailsModal = async (record) => {
    try {
      const eventData = await ManageAllFestivalsService.getEventById(record.eventId);

      // Tải characters dựa trên ngày của sự kiện
      let charData = [];
      try {
        const startDate = dayjs(eventData.startDate).format("DD/MM/YYYY");
        const endDate = dayjs(eventData.endDate).format("DD/MM/YYYY");
        charData = await ManageAllFestivalsService.getAllCharacters(startDate, endDate);
      } catch (error) {
        toast.error(error.message || "Failed to load characters for festival", { autoClose: 7000 });
      }
      const eventCharacters = Array.isArray(charData) ? charData : [];

      const cosplayers = await Promise.all(
        eventData.eventCharacterResponses.map(async (ec) => {
          const cosplayer = await ManageAllFestivalsService.getCosplayerByEventCharacterId(
            ec.eventCharacterId
          );
          const character = eventCharacters.find((char) => char.characterId === ec.characterId);
          return {
            eventCharacterId: ec.eventCharacterId,
            name: cosplayer.name,
            description: character ? `Cosplay as ${character.characterName}` : "No character info",
            urlImage:
              cosplayer.images?.find((img) => img.isAvatar)?.urlImage ||
              cosplayer.images?.[0]?.urlImage ||
              "https://via.placeholder.com/100?text=No+Image",
          };
        })
      );

      const updatedActivities = eventData.eventActivityResponse.map((activity) => {
        const matchingActivity = activities.find((act) => act.activityId === activity.activityId);
        return {
          ...activity,
          description: matchingActivity?.description || "No description available",
          name: matchingActivity?.name || "Unknown Activity",
        };
      });

      const ticketsByType = eventData.ticket.reduce((acc, t) => {
        const type = t.ticketType;
        if (!acc[type]) {
          acc[type] = {
            ticketId: t.ticketId,
            quantity: t.quantity.toString(), // Convert to string
            price: t.price.toString(), // Convert to string
            description: t.description,
            ticketType: type,
          };
        } else {
          acc[type].quantity += t.quantity;
          acc[type].price = t.price;
          acc[type].description = t.description;
        }
        return acc;
      }, {});
      const tickets = Object.values(ticketsByType);

      setEventDetails({ ...eventData, cosplayers, eventActivityResponse: updatedActivities, ticket: tickets });
      setIsDetailsModalVisible(true);
    } catch (error) {
      toast.error(error.message || "Failed to load festival details", { autoClose: 7000 });
    }
  };

  // Đóng modal
  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsDetailsModalVisible(false);
    setFormData({
      eventName: "",
      description: "",
      dateRange: null,
      location: "",
      tickets: [{ ticketId: null, quantity: 0, price: 0, description: "", ticketType: 0 }],
      selectedCosplayers: [],
      eventActivities: [],
      imageFiles: [],
      imagePreviews: [],
      existingImages: [],
      imagesDeleted: [],
      initialImageIds: [],
    });
    setSelectedCharacterId(null);
    setCosplayers([]);
    setIsCosplayerEdited(false);
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi khoảng thời gian
  const handleDateRangeChange = (dates) => {
    if (!dates) {
      setFormData((prev) => ({ ...prev, dateRange: null }));
      setSelectedCharacterId(null);
      setCosplayers([]);
      setCharacters([]);
      return;
    }

    setFormData((prev) => ({ ...prev, dateRange: dates }));
    setSelectedCharacterId(null);
    setCosplayers([]);
  };

  // Vô hiệu hóa ngày trước ngày mai
  // Vô hiệu hóa ngày không hợp lệ
  const disabledDate = (current, { from }) => {
    const today = dayjs().startOf("day");
    const minStartDate = today.add(15, "day"); // Tối thiểu 15 ngày từ hôm nay
    const maxStartDate = today.add(1, "month"); // Tối đa 1 tháng từ hôm nay

    // Vô hiệu hóa ngày trước minStartDate và sau maxStartDate
    if (current && (current < minStartDate || current > maxStartDate)) {
      return true;
    }

    // Nếu startDate đã chọn, vô hiệu hóa ngày cách quá 5 ngày
    if (from) {
      const maxEndDate = from.add(5, "day").endOf("day");
      const minEndDate = from.startOf("day");
      return current && (current > maxEndDate || current < minEndDate);
    }

    return false;
  };

  // Vô hiệu hóa giờ ngoài khoảng 8h-22h
  // Vô hiệu hóa giờ không hợp lệ
  const disabledTime = (_, type, { from }) => {
    const startHour = 8;
    const endHour = 22;

    // Giờ khả dụng: 8h-22h
    const disabledHours = () => {
      const hours = [];
      for (let i = 0; i < 24; i++) {
        if (i < startHour || i > endHour) {
          hours.push(i);
        }
      }
      return hours;
    };

    // Phút khả dụng: chỉ cho phép 00 phút
    const disabledMinutes = (selectedHour) => {
      if (selectedHour === startHour || selectedHour === endHour) {
        return Array.from({ length: 60 }, (_, i) => i).filter(
          (minute) => minute !== 0
        );
      }
      return [];
    };

    // Nếu chọn endDate và trùng ngày với startDate, đảm bảo cách tối thiểu 5 tiếng
    if (type === "end" && from && from.isSame(_, "day")) {
      const minEndHour = from.hour() + 5; // Tối thiểu 5 tiếng sau startHour
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < 24; i++) {
            if (i < minEndHour || i < startHour || i > endHour) {
              hours.push(i);
            }
          }
          return hours;
        },
        disabledMinutes: (selectedHour) => {
          if (selectedHour === minEndHour) {
            return Array.from({ length: 60 }, (_, i) => i).filter(
              (minute) => minute < from.minute()
            );
          }
          return disabledMinutes(selectedHour);
        },
      };
    }

    return {
      disabledHours,
      disabledMinutes,
    };
  };

  // Xử lý thay đổi mảng (vé, cosplayer, hoạt động)
  const handleArrayChange = (arrayName, index, field, value) => {
    if ((field === "quantity" || field === "price")) {
      const numericValue = Number(value);
      if (numericValue < 0) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be negative!`, { autoClose: 7000 });
        return;
      }
      if (field === "price" && numericValue > 5000000) {
        toast.error("Ticket price cannot exceed 5.000.000 VND!", { autoClose: 7000 });
        return;
      }
      // Convert to string without leading zeros
      const cleanedValue = numericValue.toString();
      setFormData((prev) => {
        const updatedArray = [...prev[arrayName]];
        updatedArray[index] = { ...updatedArray[index], [field]: cleanedValue };
        return { ...prev, [arrayName]: updatedArray };
      });
    } else {
      setFormData((prev) => {
        const updatedArray = [...prev[arrayName]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        return { ...prev, [arrayName]: updatedArray };
      });
    }
  };

  // Xử lý thay đổi file ảnh
  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(file => {
      if (file.size > maxFileSize) {
        toast.error(`File ${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...validFiles],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  };

  // Thêm ảnh mới
  const addMoreImages = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;
    input.onchange = handleImageFilesChange;
    input.click();
  };

  // Xóa ảnh mới
  const removeImage = (index) => {
    setFormData((prev) => {
      const updatedFiles = [...prev.imageFiles];
      const updatedPreviews = [...prev.imagePreviews];
      updatedFiles.splice(index, 1);
      updatedPreviews.splice(index, 1);
      URL.revokeObjectURL(prev.imagePreviews[index]);
      return {
        ...prev,
        imageFiles: updatedFiles,
        imagePreviews: updatedPreviews,
      };
    });
  };

  // Xóa ảnh hiện có
  const removeExistingImage = (imageId) => {
    setFormData((prev) => {
      const updatedExistingImages = prev.existingImages.filter((img) => img.imageId !== imageId);
      const updatedImagesDeleted = [...prev.imagesDeleted, { imageId }];
      return {
        ...prev,
        existingImages: updatedExistingImages,
        imagesDeleted: updatedImagesDeleted,
      };
    });
  };

  // Thêm mục vào mảng
  const addArrayItem = (arrayName, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem],
    }));
  };

  // Thêm cosplayer với kiểm tra trạng thái booking
  const handleAddCosplayer = async (cosplayer) => {
    const character = characters.find((c) => c.characterId === selectedCharacterId);
    setIsCosplayerEdited(true);

    const currentCount = formData.selectedCosplayers.filter(
      (sc) => sc.characterId === selectedCharacterId
    ).length;

    if (currentCount >= character.quantity) {
      toast.error(
        `Cannot add more cosplayers for ${character.characterName}. Maximum quantity is ${character.quantity}.`,
        { autoClose: 7000 }
      );
      return;
    }

    if (formData.dateRange) {
      const [startDate, endDate] = formData.dateRange;
      const dates = [{
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }];

      try {
        const bookingData = await ManageAllFestivalsService.checkCosplayerBooking(dates);
        const isBooked = Array.isArray(bookingData) && bookingData.some(
          (booking) => booking.cosplayerId === cosplayer.accountId && booking.status === "Accept"
        );

        if (isBooked) {
          toast.error(
            `Cosplayer ${cosplayer.name} is already booked for another festival during this time.`,
            { autoClose: 7000 }
          );
          return;
        }

        setFormData((prev) => ({
          ...prev,
          selectedCosplayers: [
            ...prev.selectedCosplayers,
            {
              characterId: selectedCharacterId,
              cosplayerId: cosplayer.accountId,
              cosplayerName: cosplayer.name,
              description: `Cosplay as ${character.characterName}`,
            },
          ],
        }));
        toast.success(`Added cosplayer ${cosplayer.name}`, { autoClose: 2000 });
      } catch (error) {
        toast.error(error.message || "Failed to check cosplayer availability", { autoClose: 7000 });
      }
    }
  };

  // Xóa cosplayer
  const handleRemoveCosplayers = () => {
    setFormData((prev) => ({
      ...prev,
      selectedCosplayers: [],
    }));
    setIsCosplayerEdited(true);
    toast.success("All cosplayers have been cleared. Please select new cosplayers.", { autoClose: 2000 });
  };

  // Xử lý thay đổi hoạt động
  const handleActivityChange = (selectedActivityIds) => {
    const newActivities = selectedActivityIds.map((activityId) => ({
      activityId,
      description: activities.find((act) => act.activityId === activityId)?.description || "",
      createBy: "",
    }));
    setFormData((prev) => ({
      ...prev,
      eventActivities: newActivities,
    }));
  };

  // Xác thực form
  // Xác thực form
  const validateForm = () => {
    const errors = [];
    if (!formData.eventName.trim()) errors.push("Event name is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!isEditMode && !formData.locationId) errors.push("Location selection is required");
    if (!formData.dateRange) errors.push("Date and time range is required");
    if (formData.tickets.length === 0) errors.push("At least one ticket is required");
    if (formData.selectedCosplayers.length === 0)
      errors.push("At least one cosplayer is required");
    if (formData.eventActivities.length === 0)
      errors.push("At least one activity is required");
    if (formData.existingImages.length === 0 && formData.imageFiles.length === 0)
      errors.push("At least one image is required");

    const ticketError = validateTickets();
    if (ticketError) errors.push(ticketError);

    // Validate ticket prices
    formData.tickets.forEach((ticket, index) => {
      if (Number(ticket.price) > 5000000) {
        errors.push(`Ticket ${index + 1} price exceeds 5,000,000 VND`);
      }
    });

    return errors;
  };

  const validateTickets = () => {
    if (!selectedLocationId) return null;
    const selectedLocation = locations.find((loc) => loc.locationId === selectedLocationId);
    if (!selectedLocation) return null;

    const totalTickets = formData.tickets.reduce((sum, t) => sum + Number(t.quantity), 0);
    const { capacityMin, capacityMax } = selectedLocation;

    if (totalTickets < capacityMin || totalTickets > capacityMax) {
      return `Total tickets (${totalTickets}) must be between ${capacityMin} and ${capacityMax}.`;
    }
    return null;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors.join(", "), { autoClose: 7000 });
      return;
    }

    try {
      const [startDate, endDate] = formData.dateRange;
      const token = localStorage.getItem("accessToken");
      let createBy = "Unknown";

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const accountId =
            decodedToken.Id ||
            decodedToken.id ||
            decodedToken.sub ||
            decodedToken.userId;

          if (accountId) {
            const profileData = await ProfileService.getProfileById(accountId);
            createBy = profileData.name || "Unknown";
          }
        } catch (error) {
          toast.error("Invalid access token", { autoClose: 7000 });
        }
      } else {
        toast.warn("No access token available", { autoClose: 7000 });
      }

      // Kiểm tra booking cosplayer
      if (formData.selectedCosplayers.length > 0) {
        const dates = [{
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }];

        const bookingData = await ManageAllFestivalsService.checkCosplayerBooking(dates);
        const bookedCosplayers = formData.selectedCosplayers
          .filter(
            (sc) =>
              Array.isArray(bookingData) &&
              bookingData.some(
                (booking) =>
                  booking.cosplayerId === sc.cosplayerId &&
                  booking.status === "Accept"
              )
          )
          .map((sc) => sc.cosplayerName);

        if (bookedCosplayers.length > 0) {
          toast.error(
            `The following cosplayers are booked: ${bookedCosplayers.join(", ")}. Please select different cosplayers or adjust the festival dates.`,
            { autoClose: 7000 }
          );
          return;
        }
      }

      const imagesDeleted = formData.imagesDeleted.map((img) => ({
        imageId: img.imageId,
      }));

      const cosplayerData = isEditMode && !isCosplayerEdited
        ? null // Keep existing cosplayers if no changes
        : formData.selectedCosplayers.map((sc) => ({
          characterId: sc.characterId,
          cosplayerId: sc.cosplayerId,
          description: sc.description,
        }));

      const eventData = {
        eventName: formData.eventName,
        description: formData.description,
        location: formData.locationId,
        createBy: createBy,
        ticket: formData.tickets.map((t) => {
          const ticketData = {
            quantity: Number(t.quantity), // Convert back to number for API
            price: Number(t.price), // Convert back to number for API
            description: t.description,
            ticketType: t.ticketType,
          };
          if (isEditMode && t.ticketId) {
            ticketData.ticketId = t.ticketId;
          }
          return ticketData;
        }),
        imagesDeleted,
        eventCharacterRequest: cosplayerData, // Without 's'
        eventCharacterRequests: cosplayerData, // With 's'
        eventActivityRequests: formData.eventActivities,
      };

      if (!isEditMode) {
        eventData.startDate = startDate.toISOString();
        eventData.endDate = endDate.toISOString();
      }

      const eventJson = JSON.stringify(eventData);

      if (isEditMode) {
        await ManageAllFestivalsService.updateEvent(
          selectedFestival.eventId,
          eventJson,
          formData.imageFiles
        );
        toast.success("Festival updated successfully!", { autoClose: 2000 });
      } else {
        const response = await ManageAllFestivalsService.addEvent(eventJson, formData.imageFiles);
        if (response === "Add Success") {
          toast.success("Festival created successfully!", { autoClose: 2000 });
        } else {
          throw new Error("Unexpected response from server");
        }
      }

      const updatedFestivals = await ManageAllFestivalsService.getAllEvents(searchTerm);
      setFestivals(updatedFestivals);
      handleCancel();
    } catch (error) {
      const errorMessage =
        error.message.includes("There was another event at this location")
          ? "This location is booked for another event during the selected time period. Please choose a different location or time."
          : error.message || `Failed to ${isEditMode ? "update" : "create"} festival`;
      toast.error(errorMessage, { autoClose: 7000 });
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý sắp xếp
  const handleSort = (field) => {
    setSortFestival((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => setCurrentPage(page);

  // Xử lý thay đổi số hàng mỗi trang
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // Kiểm tra nút thêm vé có bị vô hiệu hóa
  const isAddTicketDisabled = () => {
    const ticketTypes = formData.tickets.map((ticket) => ticket.ticketType);
    return ticketTypes.includes(0) && ticketTypes.includes(1);
  };

  // Lấy các loại vé có sẵn
  const getAvailableTicketTypes = (currentIndex) => {
    const ticketTypes = formData.tickets
      .map((ticket, index) => (index !== currentIndex ? ticket.ticketType : null))
      .filter((type) => type !== null);
    if (ticketTypes.length === 0) {
      return [0, 1];
    }
    return ticketTypes.includes(0) ? [1] : [0];
  };

  // Giao diện component
  return (
    <div className="manage-festivals">
      <h2 className="manage-festivals-title">Manage Festivals</h2>
      <div className="content-container">
        <Card className="manage-festivals-card">
          <Card.Body>
            <div className="table-header">
              <h3>Festivals</h3>
              <Form.Control
                type="text"
                placeholder="Search by Name, Description, Location, or Created By..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <Button
                type="primary"
                size="large"
                onClick={showCreateModal}
                style={{
                  background: "linear-gradient(135deg, #510545, #22668a)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
                }
              >
                <PlusCircle size={16} /> Add New Festival
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("eventName")}
                    >
                      Event Name
                      {sortFestival.field === "eventName" ? (
                        sortFestival.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} className="default-sort-icon" />
                      )}
                    </span>
                  </th>
                  <th className="text-center">Description</th>
                  <th className="text-center">Location</th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("startDate")}
                    >
                      Start Date
                      {sortFestival.field === "startDate" ? (
                        sortFestival.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} className="default-sort-icon" />
                      )}
                    </span>
                  </th>
                  <th className="text-center">End Date</th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("createDate")}
                    >
                      Create Date
                      {sortFestival.field === "createDate" ? (
                        sortFestival.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} className="default-sort-icon" />
                      )}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("createBy")}
                    >
                      Created By
                      {sortFestival.field === "createBy" ? (
                        sortFestival.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} className="default-sort-icon" />
                      )}
                    </span>
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFestivals.map((festival) => (
                  <tr key={festival.eventId}>
                    <td className="text-center">{festival.eventName}</td>
                    <td className="text-center">
                      {festival.description.length > 50
                        ? `${festival.description.slice(0, 50)}...`
                        : festival.description}
                    </td>
                    <td className="text-center">{festival.location}</td>
                    <td className="text-center">{formatDateVN(festival.startDate)}</td>
                    <td className="text-center">{formatDateVN(festival.endDate)}</td>
                    <td className="text-center">{formatDateVN(festival.createDate)}</td>
                    <td className="text-center">{festival.createBy || "Unknown"}</td>
                    <td className="text-center" style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      <Button
                        type="primary"
                        size="middle"
                        onClick={() => showEditModal(festival)}
                        style={{
                          background: "linear-gradient(135deg, #510545, #22668a)",
                          border: "none",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        type="default"
                        size="middle"
                        onClick={() => showDetailsModal(festival)}
                        style={{
                          background: "#e0e0e0",
                          border: "none",
                          color: "#333",
                        }}
                        onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
                        onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="pagination-controls">
              <div className="pagination-info">
                <span>{showingText}</span>
                <div className="rows-per-page">
                  <span>Rows per page: </span>
                  <Dropdown
                    onSelect={(value) => handleRowsPerPageChange(Number(value))}
                    className="d-inline-block"
                  >
                    <Dropdown.Toggle
                      variant="secondary"
                      id="dropdown-rows-per-page"
                      style={{
                        padding: "4px 8px",
                        fontSize: "14px",
                        borderRadius: "4px",
                        background: "#e0e0e0",
                        border: "none",
                        color: "#333",
                      }}
                    >
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
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {[...Array(totalPages).keys()].map((page) => (
                  <Pagination.Item
                    key={page + 1}
                    active={page + 1 === currentPage}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
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
          </Card.Body>
        </Card>
      </div>

      <Modal
        show={isCreateModalVisible}
        onHide={handleCancel}
        centered
        className="festival-modal"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Edit Festival" : "Create Festival"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {isEditMode && (
              <Alert
                message="Note: You must select cosplayers from scratch for this event."
                type="warning"
                showIcon
                style={{ marginBottom: "10px" }}
              />
            )}
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="Enter event name (e.g., New Year Festival)"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter event description"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date and Time Range</Form.Label>
              <DateRangePicker
                value={formData.dateRange}
                onChange={handleDateRangeChange}
                format={dateTimeFormat}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
                showTime={{ format: "HH:mm" }}
                allowClear={false}
                inputReadOnly={true}
                required
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  border: "1px solid #ced4da",
                  fontSize: "16px",
                  zIndex: 9999,
                }}
                popupStyle={{ zIndex: 9999 }}
                disabled={isEditMode}
                getPopupContainer={(trigger) => trigger.parentNode}
              />
              {isEditMode && (
                <Alert
                  message="Note: The date and time range cannot be modified to ensure consistency for ticket holders."
                  type="info"
                  showIcon
                  style={{ marginTop: "10px" }}
                />
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Select
                placeholder="Select location"
                value={selectedLocationId}
                onChange={(value) => {
                  setSelectedLocationId(value);
                  setFormData((prev) => ({ ...prev, locationId: value }));
                }}
                style={{ width: "100%" }}
                required
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                dropdownStyle={{ zIndex: 10000 }}
                getPopupContainer={(trigger) => trigger.parentNode}
                disabled={isEditMode}
              >
                {locations.map((location) => (
                  <Option key={location.locationId} value={location.locationId}>
                    {`${location.address} (Min: ${location.capacityMin}, Max: ${location.capacityMax})`}
                  </Option>
                ))}
              </Select>
              {isEditMode && (
                <Alert
                  message="Note: The location cannot be modified to ensure consistency for ticket holders."
                  type="info"
                  showIcon
                  style={{ marginTop: "10px" }}
                />
              )}
            </Form.Group>

            {formData.dateRange && (
              <Form.Group className="mb-3">
                <Form.Label>Select Character</Form.Label>
                <Select
                  style={{ width: "100%", zIndex: 9999 }}
                  placeholder="Select a character"
                  onChange={setSelectedCharacterId}
                  value={selectedCharacterId}
                  dropdownStyle={{ zIndex: 9999 }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {characters.map((char) => (
                    <Option key={char.characterId} value={char.characterId}>
                      {char.characterName} (Quantity: {char.quantity})
                    </Option>
                  ))}
                </Select>
                {selectedCharacterId && (
                  <div className="character-info mt-3">
                    {characters
                      .filter((char) => char.characterId === selectedCharacterId)
                      .map((char) => (
                        <div key={char.characterId} style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={
                              char.images?.find((img) => img.isAvatar)?.urlImage ||
                              char.images?.[0]?.urlImage ||
                              "https://via.placeholder.com/100?text=No+Image"
                            }
                            alt={char.characterName}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "5px",
                              marginRight: "10px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <strong>{char.characterName}</strong>
                            <p>Quantity: {char.quantity}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                {selectedCharacterId && cosplayers.length > 0 && (
                  <div className="cosplayer-grid mt-3">
                    <h5>Available Cosplayers</h5>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                        gap: "15px",
                        padding: "10px",
                        maxHeight: "300px",
                        overflowY: "auto",
                      }}
                    >
                      {cosplayers.map((cosplayer) => (
                        <div
                          key={cosplayer.accountId}
                          style={{
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            padding: "10px",
                            textAlign: "center",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            transition: "transform 0.2s",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            height: "180px",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          <div
                            style={{
                              width: "100px",
                              height: "100px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              backgroundColor: "#f0f0f0",
                              marginBottom: "10px",
                            }}
                          >
                            <img
                              src={
                                cosplayer.images?.find((img) => img.isAvatar)?.urlImage ||
                                cosplayer.images?.[0]?.urlImage ||
                                "https://via.placeholder.com/100?text=No+Image"
                              }
                              alt={cosplayer.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              margin: "0 0 10px",
                              color: "#333",
                              flex: "1",
                            }}
                          >
                            {cosplayer.name}
                          </p>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleAddCosplayer(cosplayer)}
                            style={{
                              fontSize: "12px",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              background: "linear-gradient(135deg, #510545, #22668a)",
                              border: "none",
                            }}
                            onMouseEnter={(e) =>
                              (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
                            }
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedCharacterId && cosplayers.length === 0 && (
                  <p className="mt-2">No cosplayers available for this character.</p>
                )}
                <h5 className="mt-3">Selected Cosplayers</h5>
                <List
                  dataSource={formData.selectedCosplayers}
                  renderItem={(item) => {
                    const character = characters.find((c) => c.characterId === item.characterId);
                    return (
                      <List.Item
                        actions={[
                          <Button
                            type="primary"
                            danger
                            size="small"
                            onClick={() => handleRemoveCosplayer(item.cosplayerId)}
                          >
                            Remove
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          title={`Character: ${character?.characterName || item.characterId}`}
                          description={`Cosplayer: ${item.cosplayerName}`}
                        />
                      </List.Item>
                    );
                  }}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Tickets</Form.Label>
              {isEditMode && (
                <Alert
                  message="Note: Tickets cannot be modified to ensure consistency for ticket holders."
                  type="info"
                  showIcon
                  style={{ marginBottom: "10px" }}
                />
              )}
              {formData.tickets.map((ticket, index) => (
                <div key={index} className="mb-2 border p-3 rounded">
                  <Form.Group className="mb-2">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={ticket.quantity.toString()} // Ensure string to avoid leading zeros
                      onChange={(e) =>
                        handleArrayChange("tickets", index, "quantity", e.target.value)
                      }
                      placeholder="Enter quantity"
                      required
                      disabled={isEditMode}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={ticket.price.toString()} // Ensure string to avoid leading zeros
                      onChange={(e) =>
                        handleArrayChange("tickets", index, "price", e.target.value)
                      }
                      placeholder="Enter price"
                      required
                      disabled={isEditMode}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={ticket.description}
                      onChange={(e) =>
                        handleArrayChange("tickets", index, "description", e.target.value)
                      }
                      placeholder="Enter ticket description"
                      required
                      disabled={isEditMode}
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Ticket Type</Form.Label>
                    <Form.Select
                      value={ticket.ticketType}
                      onChange={(e) =>
                        handleArrayChange("tickets", index, "ticketType", Number(e.target.value))
                      }
                      required
                      disabled={isEditMode}
                    >
                      {getAvailableTicketTypes(index).map((type) => (
                        <option key={type} value={type}>
                          {type === 0 ? "Normal" : "Premium"}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              ))}
              {validateTickets() && (
                <Alert
                  message={validateTickets()}
                  type="error"
                  showIcon
                  style={{ marginTop: "10px" }}
                />
              )}
              <Button
                variant="outline-primary"
                onClick={() =>
                  addArrayItem("tickets", {
                    ticketId: null,
                    quantity: "0", // Initialize as string
                    price: "0", // Initialize as string
                    description: "",
                    ticketType: formData.tickets[0]?.ticketType === 0 ? 1 : 0,
                  })
                }
                disabled={isEditMode || isAddTicketDisabled()}
                style={{
                  background:
                    isEditMode || isAddTicketDisabled()
                      ? "#d0d0d0"
                      : "linear-gradient(135deg, #510545, #22668a)",
                  border: "none",
                  color: "#fff",
                }}
                onMouseEnter={(e) =>
                  !(isEditMode || isAddTicketDisabled()) &&
                  (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
                }
                onMouseLeave={(e) =>
                  !(isEditMode || isAddTicketDisabled()) &&
                  (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
                }
              >
                <PlusCircle size={16} className="me-1" /> Add Ticket
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Activities</Form.Label>
              <Select
                mode="multiple"
                style={{ width: "100%", zIndex: 9999 }}
                placeholder="Select activities"
                onChange={handleActivityChange}
                optionLabelProp="label"
                value={formData.eventActivities.map((act) => act.activityId)}
                dropdownStyle={{ zIndex: 9999 }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
                getPopupContainer={(trigger) => trigger.parentNode}
              >
                {activities.map((act) => (
                  <Option key={act.activityId} value={act.activityId} label={act.name}>
                    {act.name} - {act.description}
                  </Option>
                ))}
              </Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Images</Form.Label>
              {isEditMode && formData.existingImages.length > 0 && (
                <div style={{ marginBottom: "10px" }}>
                  <strong>Existing Images:</strong>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {formData.existingImages.map((image) => (
                      <div
                        key={image.imageId}
                        style={{
                          position: "relative",
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <img
                          src={image.imageUrl}
                          alt={`existing-${image.imageId}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                        <Button
                          type="primary"
                          danger
                          size="small"
                          onClick={() => removeExistingImage(image.imageId)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            fontSize: "10px",
                            padding: "2px 5px",
                          }}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Form.Control
                type="file"
                multiple
                onChange={handleImageFilesChange}
                accept="image/*"
                required={formData.existingImages.length === 0 && formData.imageFiles.length === 0}
              />
              {formData.imagePreviews.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <strong>New Images:</strong>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {formData.imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <img
                          src={preview}
                          alt={`preview-${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                        <Button
                          type="primary"
                          danger
                          size="small"
                          onClick={() => removeImage(index)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            fontSize: "10px",
                            padding: "2px 5px",
                          }}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Button
                variant="outline-primary"
                onClick={addMoreImages}
                style={{
                  marginTop: "10px",
                  background: "linear-gradient(135deg, #510545, #22668a)",
                  border: "none",
                  color: "#fff",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
                }
              >
                <PlusCircle size={16} className="me-1" /> Add More Images
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="default"
            onClick={handleCancel}
            style={{
              background: "#e0e0e0",
              border: "none",
              color: "#333",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
            onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
          >
            Cancel
          </Button>
          {isEditMode ? (
            <Button
              type="primary"
              onClick={handleSubmit}
              style={{
                background: "linear-gradient(135deg, #510545, #22668a)",
                border: "none",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
              }
            >
              Update
            </Button>
          ) : (
            <Popconfirm
              title="When created, you cannot edit startDate, endDate, location, tickets, and must re-select cosplayers from scratch. Do you agree to proceed?"
              onConfirm={handleSubmit}
              okText="Yes"
              cancelText="No"
              getPopupContainer={(trigger) => trigger.parentNode}
              overlayStyle={{ zIndex: 10000 }}
            >
              <Button
                type="primary"
                style={{
                  background: "linear-gradient(135deg, #510545, #22668a)",
                  border: "none",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
                }
              >
                Create
              </Button>
            </Popconfirm>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={isDetailsModalVisible}
        onHide={handleCancel}
        centered
        size="lg"
        className="festival-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {eventDetails && (
            <div>
              {/* Phần hiển thị hình ảnh sự kiện */}
              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
                Event Images
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 200px)", // 3 cột cố định, mỗi cột 200px
                  gap: "16px", // Khoảng cách đều 16px
                  marginTop: "16px",
                  justifyContent: "flex-start", // Căn trái để giữ vị trí cố định
                }}
              >
                {eventDetails.eventImageResponses.map((img) => (
                  <img
                    key={img.imageId}
                    src={img.imageUrl}
                    alt={`event-image-${img.imageId}`}
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  />
                ))}
              </div>

              {/* Phần thông tin sự kiện */}
              <Descriptions
                title={
                  <span style={{ fontSize: "22px", fontWeight: 600, color: "#510545" }}>
                    Festival Information
                  </span>
                }
                bordered
                column={1}
                style={{ marginTop: 16 }}
              >
                <Descriptions.Item label="Event Name">
                  {eventDetails.eventName}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {eventDetails.description}
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {eventDetails.location}
                </Descriptions.Item>
                <Descriptions.Item label="Start Date">
                  {dayjs(eventDetails.startDate).tz("Asia/Ho_Chi_Minh").format("HH:mm DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="End Date">
                  {dayjs(eventDetails.endDate).tz("Asia/Ho_Chi_Minh").format("HH:mm DD/MM/YYYY")}
                </Descriptions.Item>
                <Descriptions.Item label="Create Date">
                  {formatDateVN(eventDetails.createDate)}
                </Descriptions.Item>
                <Descriptions.Item label="Created By">
                  {eventDetails.createBy || "Manager"}
                </Descriptions.Item>
              </Descriptions>

              {/* Phần hiển thị hoạt động */}
              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
                Activities
              </h3>
              <List
                dataSource={eventDetails.eventActivityResponse}
                renderItem={(activity) => (
                  <List.Item>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Name">
                        {activity.name}
                      </Descriptions.Item>
                      <Descriptions.Item label="Description">
                        {activity.description}
                      </Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
              />

              {/* Phần hiển thị Cosplayers, 2 người trên một hàng */}
              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
                Cosplayers
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "16px",
                  marginTop: "16px",
                }}
              >
                {eventDetails.cosplayers.map((cosplayer) => (
                  <div
                    key={cosplayer.eventCharacterId}
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "10px",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    <img
                      src={cosplayer.urlImage}
                      alt={cosplayer.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Name">
                        {cosplayer.name}
                      </Descriptions.Item>
                      <Descriptions.Item label="Description">
                        {cosplayer.description}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ))}
              </div>

              {/* Phần hiển thị Tickets, 2 loại vé trên cùng một hàng */}
              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600, color: "#510545" }}>
                Tickets
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "16px",
                  marginTop: "16px",
                }}
              >
                {eventDetails.ticket.map((ticket) => (
                  <div
                    key={ticket.ticketId}
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "10px",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Type">
                        {ticket.ticketType === 0 ? "Normal" : "Premium"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Description">
                        {ticket.description}
                      </Descriptions.Item>
                      <Descriptions.Item label="Quantity">
                        {ticket.quantity}
                      </Descriptions.Item>
                      <Descriptions.Item label="Price">
                        {ticket.price.toLocaleString()} VND
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="default"
            onClick={handleCancel}
            style={{
              background: "#e0e0e0",
              border: "none",
              color: "#333",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
            onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageAllFestivals;