// import React, { useState, useEffect } from "react";
// import { Search, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
// import {
//   Modal,
//   Button,
//   Form,
//   Container,
//   Row,
//   Col,
//   Card,
//   ProgressBar,
//   InputGroup,
//   FormControl,
//   Table,
//   Dropdown,
// } from "react-bootstrap";
// import { Pagination } from "antd";
// import dayjs from "dayjs";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
// import { useNavigate } from "react-router-dom";
// import "../../styles/DetailEventOrganizationPage.scss";
// import { toast, ToastContainer } from "react-toastify";
// import DetailEventOrganizationPageService from "../../services/DetailEventOrganizationPageService/DetailEventOrganizationPageService.js";
// import { jwtDecode } from "jwt-decode";
// import { Range } from "react-range";

// // Extend dayjs with isSameOrBefore
// dayjs.extend(isSameOrBefore);

// const DetailEventOrganizationPage = () => {
//   const [step, setStep] = useState(1);
//   const [selectedPackage, setSelectedPackage] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [location, setLocation] = useState("");
//   const [dateRange, setDateRange] = useState([null, null]);
//   const [timeSlots, setTimeSlots] = useState({});
//   const [characterTimeSlots, setCharacterTimeSlots] = useState({});
//   const [description, setDescription] = useState("");
//   const [images, setImages] = useState([]);
//   const [selectedCharacters, setSelectedCharacters] = useState([]);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [characterSearch, setCharacterSearch] = useState("");
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [termsAgreed, setTermsAgreed] = useState(false);
//   const [isSidebarVisible, setIsSidebarVisible] = useState(true);
//   const [characterNotes, setCharacterNotes] = useState({});
//   const [characterQuantities, setCharacterQuantities] = useState({});
//   const [packages, setPackages] = useState([]);
//   const [characters, setCharacters] = useState([]);
//   const [loadingPackages, setLoadingPackages] = useState(true);
//   const [loadingCharacters, setLoadingCharacters] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isApiSuccess, setIsApiSuccess] = useState(false);
//   const [currentPackagePage, setCurrentPackagePage] = useState(1);
//   const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
//   const [characterPrices, setCharacterPrices] = useState({});
//   const [depositPercentage, setDepositPercentage] = useState(0);
//   const [sortOrder, setSortOrder] = useState("default");
//   // New state for toggling listRequestDates
//   const [expandedCharacters, setExpandedCharacters] = useState({});
//   const pageSize = 6;
//   const navigate = useNavigate();
//   const [priceRange, setPriceRange] = useState([15000, 50000]);

//   const placeholderImages = [
//     "https://cdn.prod.website-files.com/6769617aecf082b10bb149ff/67763d8a2775bee07438e7a5_Events.png",
//     "https://jjrmarketing.com/wp-content/uploads/2019/12/International-Event.jpg",
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn=9GcSnEys5tBHYLbhADjGJzoM5BloFy9AP-uyRzg&s",
//     "https://encrypted-tbn0.gstatic.com/images?q=tbn=9GcQ3DNasCvfOLMIxJyQtbNq7EfLkWnMazHE9xw&s",
//     "https://scandiweb.com/blog/wp-content/uploads/2020/01/ecom360_conference_hosting_successful_event.jpeg",
//   ];

//   // Toggle function for expanding/collapsing listRequestDates
//   const toggleCharacterDates = (characterId) => {
//     setExpandedCharacters((prev) => ({
//       ...prev,
//       [characterId]: !prev[characterId],
//     }));
//   };

//   // Fetch packages
//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         setLoadingPackages(true);
//         const data = await DetailEventOrganizationPageService.getAllPackages();
//         const packagesWithImages = data.map((pkg, index) => ({
//           ...pkg,
//           image: placeholderImages[index % placeholderImages.length],
//         }));
//         setPackages(packagesWithImages);
//       } catch (error) {
//         toast.error("Failed to fetch packages. Please try again.");
//         console.error(error);
//       } finally {
//         setLoadingPackages(false);
//       }
//     };
//     fetchPackages();
//   }, []);

//   // Fetch characters when Step 3 is active
//   useEffect(() => {
//     if (step === 3) {
//       const fetchCharacters = async () => {
//         try {
//           setLoadingCharacters(true);
//           const data =
//             await DetailEventOrganizationPageService.getAllCharacters();
//           setCharacters(data);
//         } catch (error) {
//           toast.error("Failed to fetch characters. Please try again.");
//           console.error(error);
//         } finally {
//           setLoadingCharacters(false);
//         }
//       };
//       fetchCharacters();
//     }
//   }, [step]);

//   // Fetch character prices when selectedCharacters change
//   useEffect(() => {
//     const fetchCharacterPrices = async () => {
//       try {
//         const pricePromises = selectedCharacters.map(async (sc) => {
//           if (!characterPrices[sc.characterId]) {
//             const characterData =
//               await DetailEventOrganizationPageService.getCharacterById(
//                 sc.characterId
//               );
//             return { [sc.characterId]: characterData.price };
//           }
//           return null;
//         });

//         const priceResults = await Promise.all(pricePromises);
//         const newPrices = priceResults.reduce(
//           (acc, result) => ({ ...acc, ...result }),
//           {}
//         );

//         setCharacterPrices((prev) => ({ ...prev, ...newPrices }));
//       } catch (error) {
//         toast.error("Failed to fetch character prices. Using cached data.");
//         console.error(error);
//       }
//     };

//     if (selectedCharacters.length > 0) {
//       fetchCharacterPrices();
//     }
//   }, [selectedCharacters]);

//   // Ensure eventData is saved when entering Step 4
//   useEffect(() => {
//     if (step === 4) {
//       saveEventToLocalStorage();
//     }
//   }, [step]);

//   // Decode accountId from accessToken
//   const getAccountId = () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("No access token found");
//       const decoded = jwtDecode(token);
//       const accountId = decoded.Id || decoded.sub;
//       if (!accountId) throw new Error("Invalid token: No Id found");
//       return accountId;
//     } catch (error) {
//       toast.error("Invalid token, please login again");
//       navigate("/login");
//       return null;
//     }
//   };

//   // Date validation for Form.Control
//   const getMinStartDate = () => {
//     return dayjs().add(2, "day").format("YYYY-MM-DD");
//   };

//   const getMinEndDate = () => {
//     if (!dateRange[0]) return getMinStartDate();
//     return dayjs(dateRange[0]).format("YYYY-MM-DD");
//   };

//   const getMaxEndDate = () => {
//     if (!dateRange[0]) return null;
//     return dayjs(dateRange[0]).add(4, "day").format("YYYY-MM-DD");
//   };

//   // Generate list of dates between startDate and endDate
//   const getDateList = () => {
//     if (!dateRange[0] || !dateRange[1]) return [];
//     const start = dayjs(dateRange[0]).startOf("day");
//     const end = dayjs(dateRange[1]).startOf("day");
//     const dates = [];
//     let current = start;
//     while (current.isSameOrBefore(end, "day")) {
//       dates.push(current.format("YYYY-MM-DD"));
//       current = current.add(1, "day");
//     }
//     return dates;
//   };

//   // Update time slot for a specific date with validation
//   const updateTimeSlot = (date, times) => {
//     setTimeSlots((prev) => ({
//       ...prev,
//       [date]: times,
//     }));
//   };

//   // Validate time slot for a specific date
//   const validateTimeSlot = (date, startTime, endTime) => {
//     if (!startTime || !endTime) return;

//     const start = dayjs(startTime, "HH:mm");
//     const end = dayjs(endTime, "HH:mm");
//     const minTime = dayjs("08:00", "HH:mm");
//     const maxTime = dayjs("22:00", "HH:mm");

//     // Check if times are within 08:00–22:00
//     if (start.isBefore(minTime) || start.isAfter(maxTime)) {
//       toast.error(
//         `Start time for ${dayjs(date).format(
//           "DD/MM/YYYY"
//         )} must be between 08:00 and 22:00!`
//       );
//       return false;
//     }
//     if (end.isBefore(minTime) || end.isAfter(maxTime)) {
//       toast.error(
//         `End time for ${dayjs(date).format(
//           "DD/MM/YYYY"
//         )} must be between 08:00 and 22:00!`
//       );
//       return false;
//     }

//     // Check if end time is after start time
//     if (!end.isAfter(start)) {
//       toast.error(
//         `End time for ${dayjs(date).format(
//           "DD/MM/YYYY"
//         )} must be after start time!`
//       );
//       return false;
//     }

//     return true;
//   };

//   // Apply the same time slot to all dates
//   const applySameTimeToAll = () => {
//     const dateList = getDateList();
//     if (dateList.length === 0) return;

//     const firstDate = dateList[0];
//     const firstTimeSlot = timeSlots[firstDate];

//     if (!firstTimeSlot || !firstTimeSlot[0] || !firstTimeSlot[1]) {
//       toast.warn("Please select a valid time slot for the first day!");
//       return;
//     }

//     if (!dayjs(firstTimeSlot[1]).isAfter(dayjs(firstTimeSlot[0]))) {
//       toast.warn("End time must be after start time for the first day!");
//       return;
//     }

//     const newTimeSlots = { ...timeSlots };
//     dateList.forEach((date) => {
//       newTimeSlots[date] = [dayjs(firstTimeSlot[0]), dayjs(firstTimeSlot[1])];
//     });

//     setTimeSlots(newTimeSlots);
//     saveEventToLocalStorage();
//     toast.success("Time slots applied to all days!");
//   };

//   // Format date to "DD/MM/YYYY"
//   const formatDate = (date) => {
//     if (!date) return "";
//     return dayjs(date).format("DD/MM/YYYY");
//   };

//   // Format time slot to "HH:mm DD/MM/YYYY"
//   const formatTimeSlot = (date, time) => {
//     if (!date || !time) return "";
//     return `${time.format("HH:mm")} ${formatDate(date)}`;
//   };

//   // Calculate total days
//   const totalDays =
//     dateRange[0] && dateRange[1]
//       ? dayjs(dateRange[1]).diff(dayjs(dateRange[0]), "day") + 1
//       : 0;

//   // Calculate total character price using API-fetched prices
//   const calculateTotalPrice = () => {
//     return selectedCharacters.reduce((sum, sc) => {
//       const characterPrice = characterPrices[sc.characterId] || 0;
//       return sum + characterPrice * (sc.quantity || 1);
//     }, 0);
//   };

//   // Validate time slots
//   const validateTimeSlots = () => {
//     return getDateList().every((date) => {
//       const [start, end] = timeSlots[date] || [null, null];
//       return start && end && dayjs(end).isAfter(dayjs(start));
//     });
//   };

//   // Validate event data before API call
//   const validateEventData = (data) => {
//     const errors = [];
//     if (!data.accountId || data.accountId === "unknown")
//       errors.push("Invalid account ID");
//     if (!data.name) errors.push("Package name is required");
//     if (!data.description) errors.push("Description is required");
//     if (!data.startDate) errors.push("Start date is required");
//     if (!data.endDate) errors.push("End date is required");
//     if (!data.location) errors.push("Location is required");
//     if (!data.packageId) errors.push("Package ID is required");
//     if (data.price === 0) errors.push("Total price cannot be zero");
//     if (!data.range || !/^\d+-\d+$/.test(data.range))
//       errors.push("Valid price range is required (e.g., 1000000-10000000)");
//     if (data.listRequestCharactersCreateEvent.length === 0)
//       errors.push("At least one character is required");
//     data.listRequestCharactersCreateEvent.forEach((char, index) => {
//       if (!char.characterId)
//         errors.push(`Character ${index + 1}: ID is required`);
//       if (char.quantity < 1)
//         errors.push(`Character ${index + 1}: Quantity must be at least 1`);
//       if (!char.listRequestDates || char.listRequestDates.length === 0)
//         errors.push(
//           `Character ${index + 1}: At least one time slot is required`
//         );
//       char.listRequestDates.forEach((slot, slotIndex) => {
//         if (!slot.startDate)
//           errors.push(
//             `Character ${index + 1}, Slot ${
//               slotIndex + 1
//             }: Start time is required`
//           );
//         if (!slot.endDate)
//           errors.push(
//             `Character ${index + 1}, Slot ${
//               slotIndex + 1
//             }: End time is required`
//           );
//       });
//     });
//     return errors;
//   };

//   // Save event data to localStorage
//   const saveEventToLocalStorage = () => {
//     const totalDaysCalc =
//       dateRange[0] && dateRange[1]
//         ? dayjs(dateRange[1]).diff(dayjs(dateRange[0]), "day") + 1
//         : 1;
//     const pricePackage = selectedPackage?.price || 0;
//     const totalCharacterPrice = calculateTotalPrice();
//     const totalPrice = Math.floor(
//       pricePackage + totalCharacterPrice * totalDaysCalc
//     );

//     const eventData = {
//       accountId: getAccountId(),
//       name: selectedPackage?.packageName || "",
//       description: description || "",
//       price: totalPrice,
//       startDate: dateRange[0] ? formatDate(dateRange[0]) : "",
//       endDate: dateRange[1] ? formatDate(dateRange[1]) : "",
//       location: location || "",
//       deposit: 0 || "",
//       packageId: selectedPackage?.packageId || "",
//       range: `${priceRange[0]}-${priceRange[1]}`, // New range field as "min-max"
//       listRequestCharactersCreateEvent: selectedCharacters.map((sc) => {
//         const characterSlots = timeSlots;
//         const listRequestDates = getDateList()
//           .map((date) => {
//             const [startTime, endTime] = characterSlots[date] || [null, null];
//             return {
//               startDate: startTime ? formatTimeSlot(date, startTime) : "",
//               endDate: endTime ? formatTimeSlot(date, endTime) : "",
//             };
//           })
//           .filter((slot) => slot.startDate && slot.endDate);
//         return {
//           characterId: sc.characterId,
//           description: sc.note || "",
//           quantity: sc.quantity || 1,
//           listRequestDates,
//         };
//       }),
//     };
//     localStorage.setItem("eventData", JSON.stringify(eventData));
//     return eventData;
//   };
//   // Handle API submission with price recalculation
//   const handleSubmitEvent = async (eventData) => {
//     setIsSubmitting(true);
//     try {
//       const updatedEventData = {
//         ...eventData,
//         price: eventData.price,
//       };

//       const response =
//         await DetailEventOrganizationPageService.sendRequestEventOrganization(
//           updatedEventData
//         );
//       toast.success("Event created successfully!");
//       console.log("API Response:", response);
//       setIsApiSuccess(true);
//     } catch (error) {
//       toast.error("Failed to create event. Please try again.");
//       console.error("API Error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Handle next step
//   const handleNextStep = () => {
//     if (step === 1 && !selectedPackage) {
//       toast.warn("Please select an event package!");
//       return;
//     }
//     if (
//       step === 2 &&
//       (!location || !dateRange[0] || !dateRange[1] || !description)
//     ) {
//       toast.warn("Please fill in all required fields!");
//       return;
//     }
//     if (step === 2) {
//       const hasTimeSlots = getDateList().every(
//         (date) => timeSlots[date] && timeSlots[date][0] && timeSlots[date][1]
//       );
//       if (!hasTimeSlots) {
//         toast.warn("Please select a valid time slot for each day!");
//         return;
//       }
//       if (!validateTimeSlots()) {
//         toast.warn("End time must be after start time for all days!");
//         return;
//       }
//     }
//     if (step === 3 && selectedCharacters.length === 0) {
//       toast.warn("Please select at least one character!");
//       return;
//     }
//     if (step === 3) {
//       const hasCharacterTimeSlots = selectedCharacters.every(() => {
//         const slots = timeSlots;
//         return getDateList().every(
//           (date) => slots[date] && slots[date][0] && slots[date][1]
//         );
//       });
//       if (!hasCharacterTimeSlots) {
//         toast.warn("Please ensure all characters have valid time slots!");
//         return;
//       }
//     }
//     if (step === 4) {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         toast.error("You must login to use this feature");
//         navigate("/login");
//         return;
//       }
//       if (!termsAgreed) {
//         toast.warn("Please agree to the terms and conditions!");
//         return;
//       }

//       const eventData = saveEventToLocalStorage();
//       const validationErrors = validateEventData(eventData);
//       if (validationErrors.length > 0) {
//         validationErrors.forEach((error) => toast.error(error));
//         return;
//       }
//       setShowConfirmModal(true);
//       return;
//     }

//     saveEventToLocalStorage();
//     setStep(step + 1);
//   };

//   const handleInputChange = () => {
//     saveEventToLocalStorage();
//   };

//   const handlePrevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   // Sort and filter packages
//   const filteredPackages = packages
//     .filter((pkg) =>
//       pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortOrder === "asc") {
//         return a.price - b.price;
//       } else if (sortOrder === "desc") {
//         return b.price - a.price;
//       }
//       return 0; // Default order
//     });

//   const totalPackages = filteredPackages.length;
//   const paginatedPackages = filteredPackages.slice(
//     (currentPackagePage - 1) * pageSize,
//     currentPackagePage * pageSize
//   );

//   // Pagination logic for characters
//   const filteredCharacters = characters.filter((char) =>
//     char.characterName.toLowerCase().includes(characterSearch.toLowerCase())
//   );
//   const totalCharacters = filteredCharacters.length;
//   const paginatedCharacters = filteredCharacters.slice(
//     (currentCharacterPage - 1) * pageSize,
//     currentCharacterPage * pageSize
//   );

//   const toggleCharacterSelection = (character) => {
//     setSelectedCharacters((prev) => {
//       const exists = prev.some(
//         (sc) => sc.characterId === character.characterId
//       );
//       if (exists) {
//         setCharacterTimeSlots((prevSlots) => {
//           const newSlots = { ...prevSlots };
//           delete newSlots[character.characterId];
//           return newSlots;
//         });
//         return prev.filter((sc) => sc.characterId !== character.characterId);
//       } else {
//         setCharacterTimeSlots((prevSlots) => ({
//           ...prevSlots,
//           [character.characterId]: { ...timeSlots },
//         }));
//         return [
//           ...prev,
//           {
//             characterId: character.characterId,
//             characterName: character.characterName,
//             note: characterNotes[character.characterId] || "",
//             quantity: characterQuantities[character.characterId] || 1,
//           },
//         ];
//       }
//     });
//   };

//   const handleCharacterNote = (characterId, note) => {
//     setCharacterNotes((prev) => ({ ...prev, [characterId]: note }));
//     setSelectedCharacters((prev) =>
//       prev.map((sc) => (sc.characterId === characterId ? { ...sc, note } : sc))
//     );
//   };

//   const handleCharacterQuantity = (characterId, quantity) => {
//     const qty = Math.max(1, parseInt(quantity) || 1);
//     setCharacterQuantities((prev) => ({ ...prev, [characterId]: qty }));
//     setSelectedCharacters((prev) =>
//       prev.map((sc) =>
//         sc.characterId === characterId ? { ...sc, quantity: qty } : sc
//       )
//     );
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       const assignSection = document.getElementById(
//         "assign-characters-section"
//       );
//       if (assignSection) {
//         const rect = assignSection.getBoundingClientRect();
//         const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
//         setIsSidebarVisible(!isVisible);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [selectedCharacters]);

//   // Helper function to get eventData from localStorage
//   const getEventDataFromLocalStorage = () => {
//     try {
//       const eventData = localStorage.getItem("eventData");
//       return eventData ? JSON.parse(eventData) : null;
//     } catch (error) {
//       console.error("Failed to parse eventData from localStorage:", error);
//       return null;
//     }
//   };

//   return (
//     <div className="event-organize-page min-vh-100">
//       <div className="hero-section text-white py-5">
//         <Container>
//           <h1 className="display-4 fw-bold text-center">Organize Your Event</h1>
//           <p className="lead text-center mt-3">
//             Plan your event and book your favorite characters!
//           </p>
//         </Container>
//       </div>

//       <Container className="py-4">
//         <ProgressBar now={(step / 4) * 100} className="progress-custom" />
//         <p className="text-center mt-2">Step {step} of 4</p>
//       </Container>

//       <Container className="py-5">
//         {/* Step 1: Select Package */}
//         {step === 1 && (
//           <div className="step-section fade-in">
//             <h2 className="text-center mb-4">Select Event Package</h2>
//             <Row className="mb-4 align-items-center">
//               <Col md={8}>
//                 <InputGroup>
//                   <InputGroup.Text>
//                     <Search size={20} />
//                   </InputGroup.Text>
//                   <FormControl
//                     placeholder="Search for event packages..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </InputGroup>
//               </Col>
//               <Col md={4} className="text-end">
//                 <Dropdown>
//                   <Dropdown.Toggle
//                     variant="outline-secondary"
//                     id="sort-dropdown"
//                   >
//                     Sort by:{" "}
//                     {sortOrder === "asc"
//                       ? "Price Low to High"
//                       : sortOrder === "desc"
//                       ? "Price High to Low"
//                       : "Default"}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     <Dropdown.Item onClick={() => setSortOrder("default")}>
//                       Default
//                     </Dropdown.Item>
//                     <Dropdown.Item onClick={() => setSortOrder("asc")}>
//                       Price Low to High
//                     </Dropdown.Item>
//                     <Dropdown.Item onClick={() => setSortOrder("desc")}>
//                       Price High to Low
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Col>
//             </Row>
//             {loadingPackages ? (
//               <p className="text-center">Loading packages...</p>
//             ) : (
//               <>
//                 <Row className="package-row">
//                   {paginatedPackages.length > 0 ? (
//                     paginatedPackages.map((pkg) => (
//                       <Col md={4} className="mb-4" key={pkg.packageId}>
//                         <Card
//                           className={`package-card ${
//                             selectedPackage?.packageId === pkg.packageId
//                               ? "selected"
//                               : ""
//                           }`}
//                           onClick={() => setSelectedPackage(pkg)}
//                         >
//                           <Card.Img variant="top" src={pkg.image} />
//                           <Card.Body className="package-card-body">
//                             <Card.Title>{pkg.packageName}</Card.Title>
//                             <Card.Text>{pkg.description}</Card.Text>
//                             <p>
//                               <strong>Price: </strong>
//                               {pkg.price.toLocaleString()} VND
//                             </p>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))
//                   ) : (
//                     <p className="text-center">No packages found.</p>
//                   )}
//                 </Row>
//                 <div className="d-flex justify-content-center mt-4">
//                   <Pagination
//                     current={currentPackagePage}
//                     pageSize={pageSize}
//                     total={totalPackages}
//                     onChange={(page) => setCurrentPackagePage(page)}
//                     showSizeChanger={false}
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {/* Step 2: Event Details */}
//         {step === 2 && (
//           <div className="step-section fade-in">
//             <h2 className="text-center mb-4">Enter Event Details</h2>
//             <p className="text-center mb-4">
//               Provide the details for your event below. All fields are required.
//             </p>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Date Range</Form.Label>
//                 <Row>
//                   <Col md={6}>
//                     <Form.Label>Start Date</Form.Label>
//                     <Form.Control
//                       type="date"
//                       value={
//                         dateRange[0]
//                           ? dayjs(dateRange[0]).format("YYYY-MM-DD")
//                           : ""
//                       }
//                       onChange={(e) => {
//                         const newStartDate = e.target.value
//                           ? dayjs(e.target.value)
//                           : null;
//                         const newDateRange = [newStartDate, dateRange[1]];
//                         if (
//                           newStartDate &&
//                           dateRange[1] &&
//                           newStartDate.isAfter(dateRange[1])
//                         ) {
//                           newDateRange[1] = null; // Reset end date if start date is after it
//                         }
//                         setDateRange(newDateRange);
//                         setTimeSlots({});
//                         handleInputChange();
//                       }}
//                       min={getMinStartDate()}
//                       required
//                     />
//                   </Col>
//                   <Col md={6}>
//                     <Form.Label>End Date</Form.Label>
//                     <Form.Control
//                       type="date"
//                       value={
//                         dateRange[1]
//                           ? dayjs(dateRange[1]).format("YYYY-MM-DD")
//                           : ""
//                       }
//                       onChange={(e) => {
//                         const newEndDate = e.target.value
//                           ? dayjs(e.target.value)
//                           : null;
//                         setDateRange([dateRange[0], newEndDate]);
//                         setTimeSlots({});
//                         handleInputChange();
//                       }}
//                       min={getMinEndDate()}
//                       max={getMaxEndDate()}
//                       required
//                       disabled={!dateRange[0]} // Disable until start date is selected
//                     />
//                   </Col>
//                 </Row>
//               </Form.Group>
//               {dateRange[0] && dateRange[1] && (
//                 <Form.Group className="mb-3">
//                   <Form.Label>Time Slots (08:00–22:00)</Form.Label>
//                   {getDateList().map((date, index) => (
//                     <div key={date} className="mb-3">
//                       <h6>{dayjs(date).format("DD/MM/YYYY")}</h6>
//                       <Row className="align-items-center">
//                         <Col md={4}>
//                           <Form.Control
//                             type="time"
//                             value={
//                               timeSlots[date]?.[0]
//                                 ? timeSlots[date][0].format("HH:mm")
//                                 : ""
//                             }
//                             onChange={(e) => {
//                               const startTime = e.target.value
//                                 ? dayjs(e.target.value, "HH:mm")
//                                 : null;
//                               const endTime = timeSlots[date]?.[1] || null;
//                               if (startTime && endTime) {
//                                 validateTimeSlot(date, startTime, endTime);
//                               }
//                               updateTimeSlot(date, [startTime, endTime]);
//                               handleInputChange();
//                             }}
//                             min="08:00"
//                             max="22:00"
//                             required
//                             placeholder="Start Time"
//                           />
//                         </Col>
//                         <Col md={4}>
//                           <Form.Control
//                             type="time"
//                             value={
//                               timeSlots[date]?.[1]
//                                 ? timeSlots[date][1].format("HH:mm")
//                                 : ""
//                             }
//                             onChange={(e) => {
//                               const endTime = e.target.value
//                                 ? dayjs(e.target.value, "HH:mm")
//                                 : null;
//                               const startTime = timeSlots[date]?.[0] || null;
//                               if (startTime && endTime) {
//                                 validateTimeSlot(date, startTime, endTime);
//                               }
//                               updateTimeSlot(date, [startTime, endTime]);
//                               handleInputChange();
//                             }}
//                             min="08:00"
//                             max="22:00"
//                             required
//                             placeholder="End Time"
//                           />
//                         </Col>
//                         {index === 0 && totalDays > 1 && (
//                           <Col md={4} className="d-flex align-items-center">
//                             <Button
//                               variant="primary"
//                               onClick={applySameTimeToAll}
//                               disabled={
//                                 !timeSlots[date]?.[0] ||
//                                 !timeSlots[date]?.[1] ||
//                                 !dayjs(timeSlots[date]?.[1]).isAfter(
//                                   dayjs(timeSlots[date]?.[0])
//                                 )
//                               }
//                             >
//                               Same Time
//                             </Button>
//                           </Col>
//                         )}
//                       </Row>
//                     </div>
//                   ))}
//                 </Form.Group>
//               )}
//               <i>
//                 {" "}
//                 ⚠️Date and Time cannot change after send request, because it
//                 will be affect other task of cosplayers !
//               </i>
//               <Form.Group className="mb-3">
//                 <Form.Label>Location</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={location}
//                   onChange={(e) => {
//                     setLocation(e.target.value);
//                     handleInputChange();
//                   }}
//                   placeholder="Enter event location (e.g., District 12, HCMC)"
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   rows={4}
//                   value={description}
//                   onChange={(e) => {
//                     setDescription(e.target.value);
//                     handleInputChange();
//                   }}
//                   placeholder="Describe your event (e.g., activities, special requirements)"
//                   required
//                 />
//               </Form.Group>
//             </Form>
//           </div>
//         )}

//         {/* Step 3: Select Characters */}
//         {step === 3 && (
//           <div className="step-section fade-in">
//             <h2 className="text-center mb-4">Select Characters</h2>
//             <p className="text-center mb-4">
//               Choose characters for your event and specify quantities.
//             </p>
//             {loadingCharacters ? (
//               <p className="text-center">Loading characters...</p>
//             ) : (
//               <>
//                 <div className="search-container mb-4">
//                   <InputGroup>
//                     <InputGroup.Text>
//                       <Search size={20} />
//                     </InputGroup.Text>
//                     <FormControl
//                       placeholder="Search for characters..."
//                       value={characterSearch}
//                       onChange={(e) => setCharacterSearch(e.target.value)}
//                     />
//                   </InputGroup>
//                 </div>
//                 <Row className="package-row">
//                   {paginatedCharacters.length > 0 ? (
//                     paginatedCharacters.map((character) => {
//                       const isSelected = selectedCharacters.some(
//                         (sc) => sc.characterId === character.characterId
//                       );
//                       return (
//                         <Col
//                           md={4}
//                           className="mb-4"
//                           key={character.characterId}
//                         >
//                           <Card
//                             className={`package-card ${
//                               isSelected ? "selected" : ""
//                             }`}
//                             onClick={() => toggleCharacterSelection(character)}
//                           >
//                             <Card.Img
//                               variant="top"
//                               src={
//                                 character.images.find((img) => img.isAvatar)
//                                   ?.urlImage || placeholderImages[0]
//                               }
//                             />
//                             <Card.Body className="package-card-body">
//                               <Card.Title>{character.characterName}</Card.Title>
//                               <Card.Text>{character.description}</Card.Text>
//                               <p>
//                                 <strong>Price: </strong>
//                                 {(
//                                   characterPrices[character.characterId] ||
//                                   character.price
//                                 ).toLocaleString()}{" "}
//                                 VND
//                               </p>
//                               <p>
//                                 <strong>Quantity Available: </strong>
//                                 {character.quantity.toLocaleString()}
//                               </p>
//                               {isSelected && (
//                                 <>
//                                   <Form.Control
//                                     type="text"
//                                     placeholder="Add a note (optional)"
//                                     value={
//                                       characterNotes[character.characterId] ||
//                                       ""
//                                     }
//                                     onChange={(e) =>
//                                       handleCharacterNote(
//                                         character.characterId,
//                                         e.target.value
//                                       )
//                                     }
//                                     className="mt-2"
//                                     onClick={(e) => e.stopPropagation()}
//                                   />
//                                   <Form.Control
//                                     type="number"
//                                     min="1"
//                                     placeholder="Quantity"
//                                     value={
//                                       characterQuantities[
//                                         character.characterId
//                                       ] || 1
//                                     }
//                                     onChange={(e) =>
//                                       handleCharacterQuantity(
//                                         character.characterId,
//                                         e.target.value
//                                       )
//                                     }
//                                     className="mt-2"
//                                     onClick={(e) => e.stopPropagation()}
//                                   />
//                                 </>
//                               )}
//                             </Card.Body>
//                           </Card>
//                         </Col>
//                       );
//                     })
//                   ) : (
//                     <p className="text-center">No characters found.</p>
//                   )}
//                 </Row>
//                 <div className="d-flex justify-content-center mt-4">
//                   <Pagination
//                     current={currentCharacterPage}
//                     pageSize={pageSize}
//                     total={totalCharacters}
//                     onChange={(page) => setCurrentCharacterPage(page)}
//                     showSizeChanger={false}
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         )}

//         {/* Step 4: Review */}
//         {step === 4 && (
//           <div className="step-section fade-in">
//             <h2 className="text-center mb-4">Review Your Event</h2>
//             <Card>
//               <Card.Body style={{ overflowX: "hidden" }}>
//                 <Table bordered hover style={{ overflowX: "hidden" }}>
//                   <tbody>
//                     <tr>
//                       <td>
//                         <strong>Selected Package</strong>
//                       </td>
//                       <td>{selectedPackage?.packageName || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <strong>Location</strong>
//                       </td>
//                       <td>{location || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <strong>Start Date</strong>
//                       </td>
//                       <td>{formatDate(dateRange[0]) || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <strong>End Date</strong>
//                       </td>
//                       <td>{formatDate(dateRange[1]) || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <strong>Total Days</strong>
//                       </td>
//                       <td>{totalDays}</td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <strong>Description</strong>
//                       </td>
//                       <td>{description || "N/A"}</td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <strong>Hire Price Range Cosplayer</strong>
//                       </td>
//                       <td>
//                         <div className="range-slider">
//                           <Range
//                             step={1000} // 100K increments
//                             min={15000} // 1M
//                             max={50000} // 10M
//                             values={priceRange}
//                             onChange={(values) => {
//                               setPriceRange(values);
//                               handleInputChange();
//                             }}
//                             renderTrack={({ props, children }) => (
//                               <div
//                                 {...props}
//                                 className="range-track"
//                                 style={{
//                                   ...props.style,
//                                   background: `linear-gradient(to right, #007bff ${
//                                     ((priceRange[0] - 15000) /
//                                       (50000 - 15000)) *
//                                     100
//                                   }%, #ddd ${
//                                     ((priceRange[0] - 15000) /
//                                       (50000 - 15000)) *
//                                     100
//                                   }%, #ddd ${
//                                     ((priceRange[1] - 15000) /
//                                       (50000 - 15000)) *
//                                     100
//                                   }%, #007bff ${
//                                     ((priceRange[1] - 15000) /
//                                       (50000 - 15000)) *
//                                     100
//                                   }%)`,
//                                 }}
//                               >
//                                 {children}
//                               </div>
//                             )}
//                             renderThumb={({ props }) => (
//                               <div
//                                 {...props}
//                                 className="range-thumb"
//                                 style={{
//                                   ...props.style,
//                                 }}
//                               />
//                             )}
//                           />
//                           <div className="range-values">
//                             <span>{priceRange[0].toLocaleString()} VND</span>
//                             <span>{priceRange[1].toLocaleString()} VND</span>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <strong>Selected Characters</strong>
//                       </td>
//                       <td>
//                         {selectedCharacters.length > 0 ? (
//                           <div>
//                             {selectedCharacters.map((sc) => {
//                               const eventData = getEventDataFromLocalStorage();
//                               const characterData =
//                                 eventData?.listRequestCharactersCreateEvent.find(
//                                   (char) => char.characterId === sc.characterId
//                                 );
//                               const isExpanded =
//                                 expandedCharacters[sc.characterId];
//                               return (
//                                 <div
//                                   key={sc.characterId}
//                                   style={{ marginBottom: "10px" }}
//                                 >
//                                   <div
//                                     style={{
//                                       display: "flex",
//                                       alignItems: "center",
//                                       cursor: "pointer",
//                                     }}
//                                     onClick={() =>
//                                       toggleCharacterDates(sc.characterId)
//                                     }
//                                   >
//                                     {isExpanded ? (
//                                       <ChevronUp size={20} className="me-2" />
//                                     ) : (
//                                       <ChevronDown size={20} className="me-2" />
//                                     )}
//                                     {`${sc.characterName} (Quantity: ${
//                                       sc.quantity || 1
//                                     }, Note: ${sc.note || "None"})`}
//                                   </div>
//                                   {isExpanded &&
//                                     characterData?.listRequestDates && (
//                                       <Table
//                                         bordered
//                                         size="sm"
//                                         className="mt-2"
//                                         style={{ marginLeft: "30px" }}
//                                       >
//                                         <thead>
//                                           <tr>
//                                             <th>Start Time</th>
//                                             <th>End Time</th>
//                                           </tr>
//                                         </thead>
//                                         <tbody>
//                                           {characterData.listRequestDates.map(
//                                             (slot, index) => (
//                                               <tr key={index}>
//                                                 <td>
//                                                   {slot.startDate || "N/A"}
//                                                 </td>
//                                                 <td>{slot.endDate || "N/A"}</td>
//                                               </tr>
//                                             )
//                                           )}
//                                         </tbody>
//                                       </Table>
//                                     )}
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         ) : (
//                           "None"
//                         )}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td>
//                         <strong>Pricing Details</strong>
//                       </td>
//                       <td>
//                         <Table bordered>
//                           <thead>
//                             <tr>
//                               <th>Character</th>
//                               <th>Price per Character</th>
//                               <th>Quantity</th>
//                               <th>Total</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {selectedCharacters.length > 0 ? (
//                               selectedCharacters.map((sc) => {
//                                 const characterPrice =
//                                   characterPrices[sc.characterId] || 0;
//                                 const totalCharacterPrice =
//                                   characterPrice * (sc.quantity || 1);
//                                 return (
//                                   <tr key={sc.characterId}>
//                                     <td>{sc.characterName}</td>
//                                     <td>
//                                       {characterPrice.toLocaleString()} VND
//                                     </td>
//                                     <td>{sc.quantity || 1}</td>
//                                     <td>
//                                       {totalCharacterPrice.toLocaleString()} VND
//                                     </td>
//                                   </tr>
//                                 );
//                               })
//                             ) : (
//                               <tr>
//                                 <td colSpan={4} className="text-center">
//                                   No characters selected
//                                 </td>
//                               </tr>
//                             )}
//                             <tr>
//                               <td colSpan={3} className="text-end">
//                                 <strong>Total Character Price</strong>
//                               </td>
//                               <td>
//                                 <strong>
//                                   {calculateTotalPrice().toLocaleString()} VND
//                                 </strong>
//                               </td>
//                             </tr>
//                             <tr>
//                               <td colSpan={3} className="text-end">
//                                 <strong>Package Price</strong>
//                               </td>
//                               <td>
//                                 <strong>
//                                   {(
//                                     selectedPackage?.price || 0
//                                   ).toLocaleString()}{" "}
//                                   VND
//                                 </strong>
//                               </td>
//                             </tr>
//                             <tr>
//                               <td colSpan={3} className="text-end">
//                                 <strong>
//                                   Estimated price (excluding cosplayer) =
//                                   Package Price + Total Character Price * Total
//                                   Days
//                                 </strong>
//                               </td>
//                               <td>
//                                 <strong>
//                                   {(() => {
//                                     const eventData =
//                                       getEventDataFromLocalStorage();
//                                     const price = eventData?.price || 0;
//                                     return price
//                                       .toLocaleString("vi-VN", {
//                                         style: "currency",
//                                         currency: "VND",
//                                       })
//                                       .replace("₫", "VND");
//                                   })()}
//                                 </strong>
//                               </td>
//                             </tr>
//                           </tbody>
//                         </Table>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </Table>

//                 <Button
//                   variant="outline-secondary"
//                   onClick={() => setShowTermsModal(true)}
//                   className="mt-2"
//                 >
//                   View Terms & Conditions
//                 </Button>
//                 <Form.Group className="mt-3">
//                   <Form.Check
//                     type="checkbox"
//                     label="I have read and agree to the terms and conditions"
//                     checked={termsAgreed}
//                     onChange={(e) => setTermsAgreed(e.target.checked)}
//                   />
//                 </Form.Group>
//               </Card.Body>
//             </Card>
//           </div>
//         )}

//         <div className="d-flex justify-content-between mt-5">
//           {step > 1 && (
//             <Button variant="outline-secondary" onClick={handlePrevStep}>
//               Back
//             </Button>
//           )}
//           <div>
//             <Button
//               variant="outline-secondary"
//               onClick={() => {
//                 saveEventToLocalStorage();
//                 toast.success("Draft saved successfully!");
//               }}
//               className="me-2"
//             >
//               Save Draft
//             </Button>
//             {isApiSuccess ? (
//               <Button
//                 variant="primary"
//                 onClick={() => navigate(`/my-event-organize/${getAccountId()}`)}
//               >
//                 View My Event
//               </Button>
//             ) : (
//               <Button
//                 variant="primary"
//                 onClick={handleNextStep}
//                 disabled={(step === 4 && !termsAgreed) || isSubmitting}
//               >
//                 {isSubmitting ? (
//                   "Submitting..."
//                 ) : (
//                   <>
//                     {step === 4 ? "Finish" : "Next"} <ChevronRight size={20} />
//                   </>
//                 )}
//               </Button>
//             )}
//           </div>
//         </div>
//       </Container>

//       {/* Modals */}
//       <Modal
//         show={showTermsModal}
//         onHide={() => setShowTermsModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Terms & Conditions</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>
//             By organizing an event, you agree to the following terms:
//             <ul>
//               <li>All bookings are subject to availability.</li>
//               <li>Event details must be accurate and complete.</li>
//               <li>Cancellations must be made 48 hours in advance.</li>
//               <li>Additional fees may apply for last-minute changes.</li>
//             </ul>
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={showConfirmModal}
//         onHide={() => setShowConfirmModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Event Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>
//             <strong>Package:</strong> {selectedPackage?.packageName || "N/A"}
//           </p>
//           <p>
//             <strong>Location:</strong> {location}
//           </p>
//           <p>
//             <strong>Start Date:</strong> {formatDate(dateRange[0])}
//           </p>
//           <p>
//             <strong>End Date:</strong> {formatDate(dateRange[1])}
//           </p>
//           <p>
//             <strong>Total Days:</strong> {totalDays}
//           </p>
//           <p>
//             <strong>Description:</strong> {description}
//           </p>
//           <p>
//             <strong>Hire Price Range Cosplayer:</strong>{" "}
//             {priceRange[0].toLocaleString()} VND -{" "}
//             {priceRange[1].toLocaleString()} VND
//           </p>
//           <p>
//             <strong>Characters:</strong>{" "}
//             {selectedCharacters.length > 0
//               ? selectedCharacters
//                   .map(
//                     (sc) =>
//                       `${sc.characterName} (Quantity: ${
//                         sc.quantity || 1
//                       }, Note: ${sc.note || "None"})`
//                   )
//                   .join(", ")
//               : "None"}
//           </p>
//           <p>
//             <strong>Total Price:</strong>{" "}
//             {(() => {
//               const eventData = getEventDataFromLocalStorage();
//               const price = eventData?.price || 0;
//               return price
//                 .toLocaleString("vi-VN", {
//                   style: "currency",
//                   currency: "VND",
//                 })
//                 .replace("₫", "VND");
//             })()}
//           </p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowConfirmModal(false)}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="primary"
//             onClick={() => {
//               setShowConfirmModal(false);
//               handleSubmitEvent(saveEventToLocalStorage());
//             }}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Submitting..." : "Confirm"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {step === 3 && selectedCharacters.length > 0 && (
//         <div
//           className={`selected-cosplayers-sidebar ${
//             !isSidebarVisible ? "hidden" : ""
//           }`}
//           id="selected-cosplayers-sidebar"
//         >
//           <h5>Selected Characters</h5>
//           <ul className="selected-cosplayers-list">
//             {selectedCharacters.map((sc) => {
//               const characterPrice = characterPrices[sc.characterId] || 0;
//               return (
//                 <li key={sc.characterId}>
//                   {sc.characterName} - {characterPrice.toLocaleString()} VND x{" "}
//                   {sc.quantity || 1} (Note: {sc.note || "None"})
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DetailEventOrganizationPage;

// validate 14 ngay
import React, { useState, useEffect } from "react";
import { Search, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  InputGroup,
  FormControl,
  Table,
  Dropdown,
} from "react-bootstrap";
import { Pagination } from "antd";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useNavigate } from "react-router-dom";
import "../../styles/DetailEventOrganizationPage.scss";
import { toast, ToastContainer } from "react-toastify";
import DetailEventOrganizationPageService from "../../services/DetailEventOrganizationPageService/DetailEventOrganizationPageService.js";
import { jwtDecode } from "jwt-decode";
import { Range } from "react-range";

// Extend dayjs with isSameOrBefore
dayjs.extend(isSameOrBefore);

const DetailEventOrganizationPage = () => {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [timeSlots, setTimeSlots] = useState({});
  const [characterTimeSlots, setCharacterTimeSlots] = useState({});
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [characterSearch, setCharacterSearch] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [characterNotes, setCharacterNotes] = useState({});
  const [characterQuantities, setCharacterQuantities] = useState({});
  const [packages, setPackages] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApiSuccess, setIsApiSuccess] = useState(false);
  const [currentPackagePage, setCurrentPackagePage] = useState(1);
  const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
  const [characterPrices, setCharacterPrices] = useState({});
  const [depositPercentage, setDepositPercentage] = useState(0);
  const [sortOrder, setSortOrder] = useState("default");
  const [expandedCharacters, setExpandedCharacters] = useState({});
  const pageSize = 6;
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([15000, 50000]);

  const placeholderImages = [
    "https://cdn.prod.website-files.com/6769617aecf082b10bb149ff/67763d8a2775bee07438e7a5_Events.png",
    "https://jjrmarketing.com/wp-content/uploads/2019/12/International-Event.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=9GcSnEys5tBHYLbhADjGJzoM5BloFy9AP-uyRzg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn=9GcQ3DNasCvfOLMIxJyQtbNq7EfLkWnMazHE9xw&s",
    "https://scandiweb.com/blog/wp-content/uploads/2020/01/ecom360_conference_hosting_successful_event.jpeg",
  ];

  // Toggle function for expanding/collapsing listRequestDates
  const toggleCharacterDates = (characterId) => {
    setExpandedCharacters((prev) => ({
      ...prev,
      [characterId]: !prev[characterId],
    }));
  };

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoadingPackages(true);
        const data = await DetailEventOrganizationPageService.getAllPackages();
        const packagesWithImages = data.map((pkg, index) => ({
          ...pkg,
          image: placeholderImages[index % placeholderImages.length],
        }));
        setPackages(packagesWithImages);
      } catch (error) {
        toast.error("Failed to fetch packages. Please try again.");
        console.error(error);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  // Fetch characters when Step 3 is active
  useEffect(() => {
    if (step === 3) {
      const fetchCharacters = async () => {
        try {
          setLoadingCharacters(true);
          const data =
            await DetailEventOrganizationPageService.getAllCharacters();
          setCharacters(data);
        } catch (error) {
          toast.error("Failed to fetch characters. Please try again.");
          console.error(error);
        } finally {
          setLoadingCharacters(false);
        }
      };
      fetchCharacters();
    }
  }, [step]);

  // Fetch character prices when selectedCharacters change
  useEffect(() => {
    const fetchCharacterPrices = async () => {
      try {
        const pricePromises = selectedCharacters.map(async (sc) => {
          if (!characterPrices[sc.characterId]) {
            const characterData =
              await DetailEventOrganizationPageService.getCharacterById(
                sc.characterId
              );
            return { [sc.characterId]: characterData.price };
          }
          return null;
        });

        const priceResults = await Promise.all(pricePromises);
        const newPrices = priceResults.reduce(
          (acc, result) => ({ ...acc, ...result }),
          {}
        );

        setCharacterPrices((prev) => ({ ...prev, ...newPrices }));
      } catch (error) {
        toast.error("Failed to fetch character prices. Using cached data.");
        console.error(error);
      }
    };

    if (selectedCharacters.length > 0) {
      fetchCharacterPrices();
    }
  }, [selectedCharacters]);

  // Ensure eventData is saved when entering Step 4
  useEffect(() => {
    if (step === 4) {
      saveEventToLocalStorage();
    }
  }, [step]);

  // Decode accountId from accessToken
  const getAccountId = () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No access token found");
      const decoded = jwtDecode(token);
      const accountId = decoded.Id || decoded.sub;
      if (!accountId) throw new Error("Invalid token: No Id found");
      return accountId;
    } catch (error) {
      toast.error("Invalid token, please login again");
      navigate("/login");
      return null;
    }
  };

  // Date validation logic (from CostumesPage)
  const getMinStartDate = () => {
    return dayjs().add(4, "day").format("YYYY-MM-DD"); // Changed from 2 to 3 days
  };

  const getMinEndDate = () => {
    if (!dateRange[0]) return getMinStartDate();
    return dayjs(dateRange[0]).format("YYYY-MM-DD");
  };

  const getMaxEndDate = () => {
    if (!dateRange[0]) return null;
    return dayjs(dateRange[0]).add(13, "day").format("YYYY-MM-DD"); // Max 14 days from start date
  };

  // Validate date range before proceeding to next step
  const validateDateRange = () => {
    if (!dateRange[0] || !dateRange[1]) {
      toast.error("Please select both start and end dates!");
      return false;
    }

    const startDate = dayjs(dateRange[0]);
    const endDate = dayjs(dateRange[1]);
    const today = dayjs().startOf("day");

    // Validate start date is at least 3 days from today
    const minStartDate = dayjs().add(4, "day");
    if (startDate.isBefore(minStartDate, "day")) {
      toast.error("Start date must be at least 3 days from today!");
      return false;
    }

    // Validate end date is not more than 14 days from start date
    const maxEndDate = startDate.add(13, "day");
    if (endDate.isAfter(maxEndDate, "day")) {
      toast.error("End date cannot be more than 14 days from start date!");
      return false;
    }

    // Validate rental period is between 1 and 5 days
    const diffDays = endDate.diff(startDate, "day") + 1;
    if (diffDays < 1) {
      toast.error("End date must be on or after start date!");
      return false;
    }
    if (diffDays > 5) {
      toast.error("Event period cannot exceed 5 days!");
      return false;
    }

    return true;
  };

  // Generate list of dates between startDate and endDate
  const getDateList = () => {
    if (!dateRange[0] || !dateRange[1]) return [];
    const start = dayjs(dateRange[0]).startOf("day");
    const end = dayjs(dateRange[1]).startOf("day");
    const dates = [];
    let current = start;
    while (current.isSameOrBefore(end, "day")) {
      dates.push(current.format("YYYY-MM-DD"));
      current = current.add(1, "day");
    }
    return dates;
  };

  // Update time slot for a specific date with validation
  const updateTimeSlot = (date, times) => {
    setTimeSlots((prev) => ({
      ...prev,
      [date]: times,
    }));
  };

  // Validate time slot for a specific date
  const validateTimeSlot = (date, startTime, endTime) => {
    if (!startTime || !endTime) return false;

    const start = dayjs(startTime, "HH:mm");
    const end = dayjs(endTime, "HH:mm");
    const minTime = dayjs("08:00", "HH:mm");
    const maxTime = dayjs("22:00", "HH:mm");

    // Check if times are within 08:00–22:00
    if (start.isBefore(minTime) || start.isAfter(maxTime)) {
      toast.error(
        `Start time for ${dayjs(date).format(
          "DD/MM/YYYY"
        )} must be between 08:00 and 22:00!`
      );
      return false;
    }
    if (end.isBefore(minTime) || end.isAfter(maxTime)) {
      toast.error(
        `End time for ${dayjs(date).format(
          "DD/MM/YYYY"
        )} must be between 08:00 and 22:00!`
      );
      return false;
    }

    // Check if end time is after start time
    if (!end.isAfter(start)) {
      toast.error(
        `End time for ${dayjs(date).format(
          "DD/MM/YYYY"
        )} must be after start time!`
      );
      return false;
    }

    return true;
  };

  // Apply the same time slot to all dates
  const applySameTimeToAll = () => {
    const dateList = getDateList();
    if (dateList.length === 0) return;

    const firstDate = dateList[0];
    const firstTimeSlot = timeSlots[firstDate];

    if (!firstTimeSlot || !firstTimeSlot[0] || !firstTimeSlot[1]) {
      toast.warn("Please select a valid time slot for the first day!");
      return;
    }

    if (!dayjs(firstTimeSlot[1]).isAfter(dayjs(firstTimeSlot[0]))) {
      toast.warn("End time must be after start time for the first day!");
      return;
    }

    const newTimeSlots = { ...timeSlots };
    dateList.forEach((date) => {
      newTimeSlots[date] = [dayjs(firstTimeSlot[0]), dayjs(firstTimeSlot[1])];
    });

    setTimeSlots(newTimeSlots);
    saveEventToLocalStorage();
    toast.success("Time slots applied to all days!");
  };

  // Format date to "DD/MM/YYYY"
  const formatDate = (date) => {
    if (!date) return "";
    return dayjs(date).format("DD/MM/YYYY");
  };

  // Format time slot to "HH:mm DD/MM/YYYY"
  const formatTimeSlot = (date, time) => {
    if (!date || !time) return "";
    return `${time.format("HH:mm")} ${formatDate(date)}`;
  };

  // Calculate total days
  const totalDays =
    dateRange[0] && dateRange[1]
      ? dayjs(dateRange[1]).diff(dayjs(dateRange[0]), "day") + 1
      : 0;

  // Calculate total character price using API-fetched prices
  const calculateTotalPrice = () => {
    return selectedCharacters.reduce((sum, sc) => {
      const characterPrice = characterPrices[sc.characterId] || 0;
      return sum + characterPrice * (sc.quantity || 1);
    }, 0);
  };

  // Validate time slots
  const validateTimeSlots = () => {
    return getDateList().every((date) => {
      const [start, end] = timeSlots[date] || [null, null];
      return start && end && dayjs(end).isAfter(dayjs(start));
    });
  };

  // Validate event data before API call
  const validateEventData = (data) => {
    const errors = [];
    if (!data.accountId || data.accountId === "unknown")
      errors.push("Invalid account ID");
    if (!data.name) errors.push("Package name is required");
    if (!data.description) errors.push("Description is required");
    if (!data.startDate) errors.push("Start date is required");
    if (!data.endDate) errors.push("End date is required");
    if (!data.location) errors.push("Location is required");
    if (!data.packageId) errors.push("Package ID is required");
    if (data.price === 0) errors.push("Total price cannot be zero");
    if (!data.range || !/^\d+-\d+$/.test(data.range))
      errors.push("Valid price range is required (e.g., 1000000-10000000)");
    if (data.listRequestCharactersCreateEvent.length === 0)
      errors.push("At least one character is required");
    data.listRequestCharactersCreateEvent.forEach((char, index) => {
      if (!char.characterId)
        errors.push(`Character ${index + 1}: ID is required`);
      if (char.quantity < 1)
        errors.push(`Character ${index + 1}: Quantity must be at least 1`);
      if (!char.listRequestDates || char.listRequestDates.length === 0)
        errors.push(
          `Character ${index + 1}: At least one time slot is required`
        );
      char.listRequestDates.forEach((slot, slotIndex) => {
        if (!slot.startDate)
          errors.push(
            `Character ${index + 1}, Slot ${
              slotIndex + 1
            }: Start time is required`
          );
        if (!slot.endDate)
          errors.push(
            `Character ${index + 1}, Slot ${
              slotIndex + 1
            }: End time is required`
          );
      });
    });
    return errors;
  };

  // Save event data to localStorage
  const saveEventToLocalStorage = () => {
    const totalDaysCalc =
      dateRange[0] && dateRange[1]
        ? dayjs(dateRange[1]).diff(dayjs(dateRange[0]), "day") + 1
        : 1;
    const pricePackage = selectedPackage?.price || 0;
    const totalCharacterPrice = calculateTotalPrice();
    const totalPrice = Math.floor(
      pricePackage + totalCharacterPrice * totalDaysCalc
    );

    const eventData = {
      accountId: getAccountId(),
      name: selectedPackage?.packageName || "",
      description: description || "",
      price: totalPrice,
      startDate: dateRange[0] ? formatDate(dateRange[0]) : "",
      endDate: dateRange[1] ? formatDate(dateRange[1]) : "",
      location: location || "",
      deposit: 0 || "",
      packageId: selectedPackage?.packageId || "",
      range: `${priceRange[0]}-${priceRange[1]}`,
      listRequestCharactersCreateEvent: selectedCharacters.map((sc) => {
        const characterSlots = timeSlots;
        const listRequestDates = getDateList()
          .map((date) => {
            const [startTime, endTime] = characterSlots[date] || [null, null];
            return {
              startDate: startTime ? formatTimeSlot(date, startTime) : "",
              endDate: endTime ? formatTimeSlot(date, endTime) : "",
            };
          })
          .filter((slot) => slot.startDate && slot.endDate);
        return {
          characterId: sc.characterId,
          description: sc.note || "",
          quantity: sc.quantity || 1,
          listRequestDates,
        };
      }),
    };
    localStorage.setItem("eventData", JSON.stringify(eventData));
    return eventData;
  };

  // Handle API submission with price recalculation
  const handleSubmitEvent = async (eventData) => {
    setIsSubmitting(true);
    try {
      const updatedEventData = {
        ...eventData,
        price: eventData.price,
      };

      const response =
        await DetailEventOrganizationPageService.sendRequestEventOrganization(
          updatedEventData
        );
      toast.success("Event created successfully!");
      console.log("API Response:", response);
      setIsApiSuccess(true);
    } catch (error) {
      toast.error("Failed to create event. Please try again.");
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle next step with date validation
  const handleNextStep = () => {
    if (step === 1 && !selectedPackage) {
      toast.warn("Please select an event package!");
      return;
    }
    if (
      step === 2 &&
      (!location || !dateRange[0] || !dateRange[1] || !description)
    ) {
      toast.warn("Please fill in all required fields!");
      return;
    }
    if (step === 2) {
      if (!validateDateRange()) {
        return;
      }
      const hasTimeSlots = getDateList().every(
        (date) => timeSlots[date] && timeSlots[date][0] && timeSlots[date][1]
      );
      if (!hasTimeSlots) {
        toast.warn("Please select a valid time slot for each day!");
        return;
      }
      if (!validateTimeSlots()) {
        toast.warn("End time must be after start time for all days!");
        return;
      }
    }
    if (step === 3 && selectedCharacters.length === 0) {
      toast.warn("Please select at least one character!");
      return;
    }
    if (step === 3) {
      const hasCharacterTimeSlots = selectedCharacters.every(() => {
        const slots = timeSlots;
        return getDateList().every(
          (date) => slots[date] && slots[date][0] && slots[date][1]
        );
      });
      if (!hasCharacterTimeSlots) {
        toast.warn("Please ensure all characters have valid time slots!");
        return;
      }
    }
    if (step === 4) {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("You must login to use this feature");
        navigate("/login");
        return;
      }
      if (!termsAgreed) {
        toast.warn("Please agree to the terms and conditions!");
        return;
      }

      const eventData = saveEventToLocalStorage();
      const validationErrors = validateEventData(eventData);
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => toast.error(error));
        return;
      }
      setShowConfirmModal(true);
      return;
    }

    saveEventToLocalStorage();
    setStep(step + 1);
  };

  const handleInputChange = () => {
    saveEventToLocalStorage();
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Sort and filter packages
  const filteredPackages = packages
    .filter((pkg) =>
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else if (sortOrder === "desc") {
        return b.price - a.price;
      }
      return 0;
    });

  const totalPackages = filteredPackages.length;
  const paginatedPackages = filteredPackages.slice(
    (currentPackagePage - 1) * pageSize,
    currentPackagePage * pageSize
  );

  // Pagination logic for characters
  const filteredCharacters = characters.filter((char) =>
    char.characterName.toLowerCase().includes(characterSearch.toLowerCase())
  );
  const totalCharacters = filteredCharacters.length;
  const paginatedCharacters = filteredCharacters.slice(
    (currentCharacterPage - 1) * pageSize,
    currentCharacterPage * pageSize
  );

  const toggleCharacterSelection = (character) => {
    setSelectedCharacters((prev) => {
      const exists = prev.some(
        (sc) => sc.characterId === character.characterId
      );
      if (exists) {
        setCharacterTimeSlots((prevSlots) => {
          const newSlots = { ...prevSlots };
          delete newSlots[character.characterId];
          return newSlots;
        });
        return prev.filter((sc) => sc.characterId !== character.characterId);
      } else {
        setCharacterTimeSlots((prevSlots) => ({
          ...prevSlots,
          [character.characterId]: { ...timeSlots },
        }));
        return [
          ...prev,
          {
            characterId: character.characterId,
            characterName: character.characterName,
            note: characterNotes[character.characterId] || "",
            quantity: characterQuantities[character.characterId] || 1,
          },
        ];
      }
    });
  };

  const handleCharacterNote = (characterId, note) => {
    setCharacterNotes((prev) => ({ ...prev, [characterId]: note }));
    setSelectedCharacters((prev) =>
      prev.map((sc) => (sc.characterId === characterId ? { ...sc, note } : sc))
    );
  };

  const handleCharacterQuantity = (characterId, quantity) => {
    const qty = Math.max(1, parseInt(quantity) || 1);
    setCharacterQuantities((prev) => ({ ...prev, [characterId]: qty }));
    setSelectedCharacters((prev) =>
      prev.map((sc) =>
        sc.characterId === characterId ? { ...sc, quantity: qty } : sc
      )
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const assignSection = document.getElementById(
        "assign-characters-section"
      );
      if (assignSection) {
        const rect = assignSection.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        setIsSidebarVisible(!isVisible);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [selectedCharacters]);

  // Helper function to get eventData from localStorage
  const getEventDataFromLocalStorage = () => {
    try {
      const eventData = localStorage.getItem("eventData");
      return eventData ? JSON.parse(eventData) : null;
    } catch (error) {
      console.error("Failed to parse eventData from localStorage:", error);
      return null;
    }
  };

  return (
    <div className="event-organize-page min-vh-100">
      <div className="hero-section text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Organize Your Event</h1>
          <p className="lead text-center mt-3">
            Plan your event and book your favorite characters!
          </p>
        </Container>
      </div>

      <Container className="py-4">
        <ProgressBar now={(step / 4) * 100} className="progress-custom" />
        <p className="text-center mt-2">Step {step} of 4</p>
      </Container>

      <Container className="py-5">
        {/* Step 1: Select Package */}
        {step === 1 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select Event Package</h2>
            <Row className="mb-4 align-items-center">
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={20} />
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Search for event packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={4} className="text-end">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="sort-dropdown"
                  >
                    Sort by:{" "}
                    {sortOrder === "asc"
                      ? "Price Low to High"
                      : sortOrder === "desc"
                      ? "Price High to Low"
                      : "Default"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortOrder("default")}>
                      Default
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortOrder("asc")}>
                      Price Low to High
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortOrder("desc")}>
                      Price High to Low
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
            {loadingPackages ? (
              <p className="text-center">Loading packages...</p>
            ) : (
              <>
                <Row className="package-row">
                  {paginatedPackages.length > 0 ? (
                    paginatedPackages.map((pkg) => (
                      <Col md={4} className="mb-4" key={pkg.packageId}>
                        <Card
                          className={`package-card ${
                            selectedPackage?.packageId === pkg.packageId
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          <Card.Img variant="top" src={pkg.image} />
                          <Card.Body className="package-card-body">
                            <Card.Title>{pkg.packageName}</Card.Title>
                            <Card.Text>{pkg.description}</Card.Text>
                            <p>
                              <strong>Price: </strong>
                              {pkg.price.toLocaleString()} VND
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <p className="text-center">No packages found.</p>
                  )}
                </Row>
                <div className="d-flex justify-content-center mt-4">
                  <Pagination
                    current={currentPackagePage}
                    pageSize={pageSize}
                    total={totalPackages}
                    onChange={(page) => setCurrentPackagePage(page)}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Event Details */}
        {step === 2 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Enter Event Details</h2>
            <p className="text-center mb-4">
              Provide the details for your event below. All fields are required.
            </p>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Date Range</Form.Label>
                <Row>
                  <Col md={6}>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={
                        dateRange[0]
                          ? dayjs(dateRange[0]).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={(e) => {
                        const newStartDate = e.target.value
                          ? dayjs(e.target.value)
                          : null;
                        let newDateRange = [newStartDate, dateRange[1]];
                        if (
                          newStartDate &&
                          dateRange[1] &&
                          newStartDate.isAfter(dateRange[1])
                        ) {
                          newDateRange[1] = null; // Reset end date if start date is after it
                        } else if (newStartDate && dateRange[1]) {
                          // Ensure end date does not exceed 5 days from start date
                          const maxEndDate = newStartDate.add(5, "day");
                          if (dayjs(dateRange[1]).isAfter(maxEndDate)) {
                            newDateRange[1] = maxEndDate;
                          }
                        }
                        setDateRange(newDateRange);
                        setTimeSlots({});
                        handleInputChange();
                      }}
                      min={getMinStartDate()}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={
                        dateRange[1]
                          ? dayjs(dateRange[1]).format("YYYY-MM-DD")
                          : ""
                      }
                      onChange={(e) => {
                        const newEndDate = e.target.value
                          ? dayjs(e.target.value)
                          : null;
                        setDateRange([dateRange[0], newEndDate]);
                        setTimeSlots({});
                        handleInputChange();
                      }}
                      min={getMinEndDate()}
                      max={getMaxEndDate()}
                      required
                      disabled={!dateRange[0]} // Disable until start date is selected
                    />
                  </Col>
                </Row>
              </Form.Group>
              {dateRange[0] && dateRange[1] && (
                <Form.Group className="mb-3">
                  <Form.Label>Time Slots (08:00–22:00)</Form.Label>
                  {getDateList().map((date, index) => (
                    <div key={date} className="mb-3">
                      <h6>{dayjs(date).format("DD/MM/YYYY")}</h6>
                      <Row className="align-items-center">
                        <Col md={4}>
                          <Form.Control
                            type="time"
                            value={
                              timeSlots[date]?.[0]
                                ? timeSlots[date][0].format("HH:mm")
                                : ""
                            }
                            onChange={(e) => {
                              const startTime = e.target.value
                                ? dayjs(e.target.value, "HH:mm")
                                : null;
                              const endTime = timeSlots[date]?.[1] || null;
                              if (startTime && endTime) {
                                validateTimeSlot(date, startTime, endTime);
                              }
                              updateTimeSlot(date, [startTime, endTime]);
                              handleInputChange();
                            }}
                            min="08:00"
                            max="22:00"
                            required
                            placeholder="Start Time"
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            type="time"
                            value={
                              timeSlots[date]?.[1]
                                ? timeSlots[date][1].format("HH:mm")
                                : ""
                            }
                            onChange={(e) => {
                              const endTime = e.target.value
                                ? dayjs(e.target.value, "HH:mm")
                                : null;
                              const startTime = timeSlots[date]?.[0] || null;
                              if (startTime && endTime) {
                                validateTimeSlot(date, startTime, endTime);
                              }
                              updateTimeSlot(date, [startTime, endTime]);
                              handleInputChange();
                            }}
                            min="08:00"
                            max="22:00"
                            required
                            placeholder="End Time"
                          />
                        </Col>
                        {index === 0 && totalDays > 1 && (
                          <Col md={4} className="d-flex align-items-center">
                            <Button
                              variant="primary"
                              onClick={applySameTimeToAll}
                              disabled={
                                !timeSlots[date]?.[0] ||
                                !timeSlots[date]?.[1] ||
                                !dayjs(timeSlots[date]?.[1]).isAfter(
                                  dayjs(timeSlots[date]?.[0])
                                )
                              }
                            >
                              Same Time
                            </Button>
                          </Col>
                        )}
                      </Row>
                    </div>
                  ))}
                </Form.Group>
              )}
              <i>
                {" "}
                ⚠️Date and Time cannot change after send request, because it
                will be affect other task of cosplayers !
              </i>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    handleInputChange();
                  }}
                  placeholder="Enter event location (e.g., District 12, HCMC)"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    handleInputChange();
                  }}
                  placeholder="Describe your event (e.g., activities, special requirements)"
                  required
                />
              </Form.Group>
            </Form>
          </div>
        )}

        {/* Step 3: Select Characters */}
        {step === 3 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select Characters</h2>
            <p className="text-center mb-4">
              Choose characters for your event and specify quantities.
            </p>
            {loadingCharacters ? (
              <p className="text-center">Loading characters...</p>
            ) : (
              <>
                <div className="search-container mb-4">
                  <InputGroup>
                    <InputGroup.Text>
                      <Search size={20} />
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Search for characters..."
                      value={characterSearch}
                      onChange={(e) => setCharacterSearch(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <Row className="package-row">
                  {paginatedCharacters.length > 0 ? (
                    paginatedCharacters.map((character) => {
                      const isSelected = selectedCharacters.some(
                        (sc) => sc.characterId === character.characterId
                      );
                      return (
                        <Col
                          md={4}
                          className="mb-4"
                          key={character.characterId}
                        >
                          <Card
                            className={`package-card ${
                              isSelected ? "selected" : ""
                            }`}
                            onClick={() => toggleCharacterSelection(character)}
                          >
                            <Card.Img
                              variant="top"
                              src={
                                character.images.find((img) => img.isAvatar)
                                  ?.urlImage || placeholderImages[0]
                              }
                            />
                            <Card.Body className="package-card-body">
                              <Card.Title>{character.characterName}</Card.Title>
                              <Card.Text>{character.description}</Card.Text>
                              <p>
                                <strong>Price: </strong>
                                {(
                                  characterPrices[character.characterId] ||
                                  character.price
                                ).toLocaleString()}{" "}
                                VND
                              </p>
                              <p>
                                <strong>Quantity Available: </strong>
                                {character.quantity.toLocaleString()}
                              </p>
                              {isSelected && (
                                <>
                                  <Form.Control
                                    type="text"
                                    placeholder="Add a note (optional)"
                                    value={
                                      characterNotes[character.characterId] ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      handleCharacterNote(
                                        character.characterId,
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <Form.Control
                                    type="number"
                                    min="1"
                                    placeholder="Quantity"
                                    value={
                                      characterQuantities[
                                        character.characterId
                                      ] || 1
                                    }
                                    onChange={(e) =>
                                      handleCharacterQuantity(
                                        character.characterId,
                                        e.target.value
                                      )
                                    }
                                    className="mt-2"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })
                  ) : (
                    <p className="text-center">No characters found.</p>
                  )}
                </Row>
                <div className="d-flex justify-content-center mt-4">
                  <Pagination
                    current={currentCharacterPage}
                    pageSize={pageSize}
                    total={totalCharacters}
                    onChange={(page) => setCurrentCharacterPage(page)}
                    showSizeChanger={false}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Review Your Event</h2>
            <Card>
              <Card.Body style={{ overflowX: "hidden" }}>
                <Table bordered hover style={{ overflowX: "hidden" }}>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Selected Package</strong>
                      </td>
                      <td>{selectedPackage?.packageName || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Location</strong>
                      </td>
                      <td>{location || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Start Date</strong>
                      </td>
                      <td>{formatDate(dateRange[0]) || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>End Date</strong>
                      </td>
                      <td>{formatDate(dateRange[1]) || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Total Days</strong>
                      </td>
                      <td>{totalDays}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Description</strong>
                      </td>
                      <td>{description || "N/A"}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Hire Price Range Cosplayer</strong>
                      </td>
                      <td>
                        <div className="range-slider">
                          <Range
                            step={1000}
                            min={15000}
                            max={50000}
                            values={priceRange}
                            onChange={(values) => {
                              setPriceRange(values);
                              handleInputChange();
                            }}
                            renderTrack={({ props, children }) => (
                              <div
                                {...props}
                                className="range-track"
                                style={{
                                  ...props.style,
                                  background: `linear-gradient(to right, #007bff ${
                                    ((priceRange[0] - 15000) /
                                      (50000 - 15000)) *
                                    100
                                  }%, #ddd ${
                                    ((priceRange[0] - 15000) /
                                      (50000 - 15000)) *
                                    100
                                  }%, #ddd ${
                                    ((priceRange[1] - 15000) /
                                      (50000 - 15000)) *
                                    100
                                  }%, #007bff ${
                                    ((priceRange[1] - 15000) /
                                      (50000 - 15000)) *
                                    100
                                  }%)`,
                                }}
                              >
                                {children}
                              </div>
                            )}
                            renderThumb={({ props }) => (
                              <div
                                {...props}
                                className="range-thumb"
                                style={{
                                  ...props.style,
                                }}
                              />
                            )}
                          />
                          <div className="range-values">
                            <span>{priceRange[0].toLocaleString()} VND</span>
                            <span>{priceRange[1].toLocaleString()} VND</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Selected Characters</strong>
                      </td>
                      <td>
                        {selectedCharacters.length > 0 ? (
                          <div>
                            {selectedCharacters.map((sc) => {
                              const eventData = getEventDataFromLocalStorage();
                              const characterData =
                                eventData?.listRequestCharactersCreateEvent.find(
                                  (char) => char.characterId === sc.characterId
                                );
                              const isExpanded =
                                expandedCharacters[sc.characterId];
                              return (
                                <div
                                  key={sc.characterId}
                                  style={{ marginBottom: "10px" }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      toggleCharacterDates(sc.characterId)
                                    }
                                  >
                                    {isExpanded ? (
                                      <ChevronUp size={20} className="me-2" />
                                    ) : (
                                      <ChevronDown size={20} className="me-2" />
                                    )}
                                    {`${sc.characterName} (Quantity: ${
                                      sc.quantity || 1
                                    }, Note: ${sc.note || "None"})`}
                                  </div>
                                  {isExpanded &&
                                    characterData?.listRequestDates && (
                                      <Table
                                        bordered
                                        size="sm"
                                        className="mt-2"
                                        style={{ marginLeft: "30px" }}
                                      >
                                        <thead>
                                          <tr>
                                            <th>Start Time</th>
                                            <th>End Time</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {characterData.listRequestDates.map(
                                            (slot, index) => (
                                              <tr key={index}>
                                                <td>
                                                  {slot.startDate || "N/A"}
                                                </td>
                                                <td>{slot.endDate || "N/A"}</td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </Table>
                                    )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          "None"
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Pricing Details</strong>
                      </td>
                      <td>
                        <Table bordered>
                          <thead>
                            <tr>
                              <th>Character</th>
                              <th>Price per Character</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCharacters.length > 0 ? (
                              selectedCharacters.map((sc) => {
                                const characterPrice =
                                  characterPrices[sc.characterId] || 0;
                                const totalCharacterPrice =
                                  characterPrice * (sc.quantity || 1);
                                return (
                                  <tr key={sc.characterId}>
                                    <td>{sc.characterName}</td>
                                    <td>
                                      {characterPrice.toLocaleString()} VND
                                    </td>
                                    <td>{sc.quantity || 1}</td>
                                    <td>
                                      {totalCharacterPrice.toLocaleString()} VND
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={4} className="text-center">
                                  No characters selected
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td colSpan={3} className="text-end">
                                <strong>Total Character Price</strong>
                              </td>
                              <td>
                                <strong>
                                  {calculateTotalPrice().toLocaleString()} VND
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={3} className="text-end">
                                <strong>Package Price</strong>
                              </td>
                              <td>
                                <strong>
                                  {(
                                    selectedPackage?.price || 0
                                  ).toLocaleString()}{" "}
                                  VND
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={3} className="text-end">
                                <strong>
                                  Estimated price (excluding cosplayer) =
                                  Package Price + Total Character Price * Total
                                  Days
                                </strong>
                              </td>
                              <td>
                                <strong>
                                  {(() => {
                                    const eventData =
                                      getEventDataFromLocalStorage();
                                    const price = eventData?.price || 0;
                                    return price
                                      .toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                      })
                                      .replace("₫", "VND");
                                  })()}
                                </strong>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <Button
                  variant="outline-secondary"
                  onClick={() => setShowTermsModal(true)}
                  className="mt-2"
                >
                  View Terms & Conditions
                </Button>
                <Form.Group className="mt-3">
                  <Form.Check
                    type="checkbox"
                    label="I have read and agree to the terms and conditions"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </div>
        )}

        <div className="d-flex justify-content-between mt-5">
          {step > 1 && (
            <Button variant="outline-secondary" onClick={handlePrevStep}>
              Back
            </Button>
          )}
          <div>
            <Button
              variant="outline-secondary"
              onClick={() => {
                saveEventToLocalStorage();
                toast.success("Draft saved successfully!");
              }}
              className="me-2"
            >
              Save Draft
            </Button>
            {isApiSuccess ? (
              <Button
                variant="primary"
                onClick={() => navigate(`/my-event-organize/${getAccountId()}`)}
              >
                View My Event
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNextStep}
                disabled={(step === 4 && !termsAgreed) || isSubmitting}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    {step === 4 ? "Finish" : "Next"} <ChevronRight size={20} />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Container>

      {/* Modals */}
      <Modal
        show={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            By organizing an event, you agree to the following terms:
            <ul>
              <li>All bookings are subject to availability.</li>
              <li>Event details must be accurate and complete.</li>
              <li>Cancellations must be made 48 hours in advance.</li>
              <li>Additional fees may apply for last-minute changes.</li>
            </ul>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTermsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Package:</strong> {selectedPackage?.packageName || "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {location}
          </p>
          <p>
            <strong>Start Date:</strong> {formatDate(dateRange[0])}
          </p>
          <p>
            <strong>End Date:</strong> {formatDate(dateRange[1])}
          </p>
          <p>
            <strong>Total Days:</strong> {totalDays}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <p>
            <strong>Hire Price Range Cosplayer:</strong>{" "}
            {priceRange[0].toLocaleString()} VND -{" "}
            {priceRange[1].toLocaleString()} VND
          </p>
          <p>
            <strong>Characters:</strong>{" "}
            {selectedCharacters.length > 0
              ? selectedCharacters
                  .map(
                    (sc) =>
                      `${sc.characterName} (Quantity: ${
                        sc.quantity || 1
                      }, Note: ${sc.note || "None"})`
                  )
                  .join(", ")
              : "None"}
          </p>
          <p>
            <strong>Total Price:</strong>{" "}
            {(() => {
              const eventData = getEventDataFromLocalStorage();
              const price = eventData?.price || 0;
              return price
                .toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
                .replace("₫", "VND");
            })()}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowConfirmModal(false);
              handleSubmitEvent(saveEventToLocalStorage());
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>

      {step === 3 && selectedCharacters.length > 0 && (
        <div
          className={`selected-cosplayers-sidebar ${
            !isSidebarVisible ? "hidden" : ""
          }`}
          id="selected-cosplayers-sidebar"
        >
          <h5>Selected Characters</h5>
          <ul className="selected-cosplayers-list">
            {selectedCharacters.map((sc) => {
              const characterPrice = characterPrices[sc.characterId] || 0;
              return (
                <li key={sc.characterId}>
                  {sc.characterName} - {characterPrice.toLocaleString()} VND x{" "}
                  {sc.quantity || 1} (Note: {sc.note || "None"})
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetailEventOrganizationPage;
