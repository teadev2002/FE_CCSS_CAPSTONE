// import React, { useState } from "react";
// import { Search, ChevronRight } from "lucide-react";
// import {
//   Modal,
//   Button,
//   Form,
//   Container,
//   Row,
//   Col,
//   Card,
//   ListGroup,
//   Badge,
//   ProgressBar,
// } from "react-bootstrap";
// import "../../styles/DetailEventOrganizationPage.scss";

// const DetailEventOrganizationPage = () => {
//   const [step, setStep] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [startDate, setStartDate] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedCosplayers, setSelectedCosplayers] = useState([]);
//   const [manualQuantity, setManualQuantity] = useState(1);
//   const [useCosplayerList, setUseCosplayerList] = useState(true);
//   const [showSummaryModal, setShowSummaryModal] = useState(false);

//   const events = [
//     {
//       id: 1,
//       name: "Anime Expo 2025",
//       location: "Tokyo",
//       image:
//         "https://th.bing.com/th/id/OIP.asj-kj4fHf687oWpf_5zhQHaEK?rs=1&pid=ImgDetMain",
//     },
//     {
//       id: 2,
//       name: "Cosplay Summit",
//       location: "Osaka",
//       image:
//         "https://th.bing.com/th/id/R.2b8cd8f8551cbd30ae16d29a7c653a0d?rik=Kw0NyacA6EzUmA&riu=http%3a%2f%2fasiatrend.org%2fwp-content%2fuploads%2fWCS-3-1024x534.jpg&ehk=%2blJAlmQ8xv%2bo3YGVgKq6FbmuWVUM0DDtxqG6qyxKzaA%3d&risl=&pid=ImgRaw&r=0",
//     },
//     {
//       id: 3,
//       name: "Comic Con VN",
//       location: "HCMC",
//       image:
//         "https://th.bing.com/th/id/R.b0a4acf5e7895ebce6d8e57ab7247625?rik=W5b4efrZkMclag&pid=ImgRaw&r=0",
//     },
//     {
//       id: 4,
//       name: "Cosplay Carnival",
//       location: "Singapore",
//       image:
//         "https://apicms.thestar.com.my/uploads/images/2022/08/25/1710204.jpg",
//     },
//     {
//       id: 5,
//       name: "World Cosplay Championship",
//       location: "Nagoya",
//       image:
//         "https://th.bing.com/th/id/OIP.13RTPeU3DzPb_wcpOx6cRQHaD4?rs=1&pid=ImgDetMain",
//     },
//     {
//       id: 6,
//       name: "Vietnam Cosplay Festival",
//       location: "Hanoi",
//       image:
//         "https://th.bing.com/th/id/OIP.piLdTVh9NSMFQqlgUx9IBAHaEK?rs=1&pid=ImgDetMain",
//     },
//   ];

//   const categories = ["Superheroes", "Anime Characters", "Fantasy", "Sci-Fi"];

//   const cosplayers = [
//     // Superheroes
//     {
//       id: 1,
//       name: "Hana",
//       categories: ["Superheroes", "Sci-Fi"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 2,
//       name: "Kai",
//       categories: ["Superheroes"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 3,
//       name: "Miko",
//       categories: ["Superheroes", "Anime Characters"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 4,
//       name: "Taro",
//       categories: ["Superheroes"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 5,
//       name: "Sora",
//       categories: ["Superheroes", "Fantasy"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },

//     // Anime Characters
//     {
//       id: 6,
//       name: "Yuki",
//       categories: ["Anime Characters"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 7,
//       name: "Riku",
//       categories: ["Anime Characters", "Fantasy"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 8,
//       name: "Aki",
//       categories: ["Anime Characters"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 9,
//       name: "Nami",
//       categories: ["Anime Characters", "Sci-Fi"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 10,
//       name: "Miko",
//       categories: ["Superheroes", "Anime Characters"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },

//     // Fantasy
//     {
//       id: 11,
//       name: "Rin",
//       categories: ["Fantasy"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 12,
//       name: "Luna",
//       categories: ["Fantasy", "Sci-Fi"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 13,
//       name: "Sora",
//       categories: ["Superheroes", "Fantasy"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 14,
//       name: "Riku",
//       categories: ["Anime Characters", "Fantasy"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 15,
//       name: "Elara",
//       categories: ["Fantasy"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },

//     // Sci-Fi
//     {
//       id: 16,
//       name: "Zara",
//       categories: ["Sci-Fi"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 17,
//       name: "Hana",
//       categories: ["Superheroes", "Sci-Fi"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 18,
//       name: "Luna",
//       categories: ["Fantasy", "Sci-Fi"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 19,
//       name: "Nami",
//       categories: ["Anime Characters", "Sci-Fi"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//     {
//       id: 20,
//       name: "Kael",
//       categories: ["Sci-Fi"],
//       image:
//         "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
//     },
//   ];

//   const handleNextStep = () => {
//     if (step === 1 && !selectedEvent) return alert("Please select an event!");
//     if (step === 2 && (!startDate || !startTime || !endDate || !endTime))
//       return alert("Please select start and end date/time!");
//     if (step === 3 && !selectedCategory)
//       return alert("Please select a category!");
//     if (step === 4 && selectedCosplayers.length === 0 && manualQuantity < 1)
//       return alert("Please select cosplayers or set a quantity!");
//     if (step < 5) setStep(step + 1); // Chỉ tăng step nếu chưa đạt 5
//     if (step === 4) setShowSummaryModal(true); // Hiển thị modal ở bước 5
//   };

//   const handlePrevStep = () => {
//     if (step > 1) setStep(step - 1);
//   };

//   const filteredEvents = events.filter((event) =>
//     event.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredCosplayers = cosplayers.filter((cosplayer) =>
//     cosplayer.categories.includes(selectedCategory)
//   );

//   const getFormattedDateTime = (date, time) => {
//     return date && time ? new Date(`${date}T${time}`).toLocaleString() : "N/A";
//   };

//   return (
//     <div className="event-organize-page min-vh-100">
//       {/* Hero Section */}
//       <div className="hero-section text-white py-5">
//         <Container>
//           <h1 className="display-4 fw-bold text-center">Event Organization</h1>
//           <p className="lead text-center mt-3">
//             Host an event and book your favorite cosplayers!
//           </p>
//         </Container>
//       </div>

//       {/* Progress Bar */}
//       <Container className="py-4">
//         <ProgressBar now={(step / 5) * 100} className="progress-custom" />
//         <p className="text-center mt-2">Step {step} of 5</p>
//       </Container>

//       {/* Steps */}
//       <Container className="py-5">
//         {step === 1 && (
//           <div className="step-section fade-in">
//             <h2 className="text-center mb-4">Select an Event</h2>
//             <div className="search-container mb-4">
//               <div className="input-group">
//                 <span className="input-group-text">
//                   <Search size={20} />
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search events..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//             <Row>
//               {filteredEvents.map((event) => (
//                 <Col md={4} key={event.id}>
//                   <Card
//                     className={`event-card ${selectedEvent?.id === event.id ? "selected" : ""
//                       }`}
//                     onClick={() => setSelectedEvent(event)}
//                   >
//                     <Card.Img variant="top" src={event.image} />
//                     <Card.Body>
//                       <Card.Title>{event.name}</Card.Title>
//                       <Card.Text>Location: {event.location}</Card.Text>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="step-section fade-in">
//             <h2 className="text-center mb-4">Choose Date & Time</h2>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Start Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                   />
//                 </Form.Group>
//                 <Form.Group>
//                   <Form.Label>Start Time</Form.Label>
//                   <Form.Control
//                     type="time"
//                     value={startTime}
//                     onChange={(e) => setStartTime(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>End Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                   />
//                 </Form.Group>
//                 <Form.Group>
//                   <Form.Label>End Time</Form.Label>
//                   <Form.Control
//                     type="time"
//                     value={endTime}
//                     onChange={(e) => setEndTime(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="step-section fade-in">
//             <h2 className="text-center mb-4">Select Category</h2>
//             <ListGroup>
//               {categories.map((category) => (
//                 <ListGroup.Item
//                   key={category}
//                   active={selectedCategory === category}
//                   onClick={() => setSelectedCategory(category)}
//                   className="category-item"
//                 >
//                   {category}
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           </div>
//         )}

//         {step === 4 && (
//           <div className="step-section fade-in">
//             <h2 className="text-center mb-4">Select Characters</h2>
//             <Form.Check
//               type="switch"
//               label={
//                 useCosplayerList
//                   ? "Select from Cosplayer List"
//                   : "Set Manual Quantity"
//               }
//               checked={useCosplayerList}
//               onChange={() => setUseCosplayerList(!useCosplayerList)}
//               className="mb-4"
//             />
//             {useCosplayerList ? (
//               <Row>
//                 {filteredCosplayers.map((cosplayer) => (
//                   <Col md={4} key={cosplayer.id}>
//                     <Card
//                       className={`cosplayer-card ${selectedCosplayers.includes(cosplayer) ? "selected" : ""
//                         }`}
//                       onClick={() => {
//                         setSelectedCosplayers((prev) =>
//                           prev.includes(cosplayer)
//                             ? prev.filter((c) => c.id !== cosplayer.id)
//                             : [...prev, cosplayer]
//                         );
//                       }}
//                     >
//                       <Card.Img variant="top" src={cosplayer.image} />
//                       <Card.Body>
//                         <Card.Title>{cosplayer.name}</Card.Title>
//                         <div>
//                           {cosplayer.categories.map((cat) => (
//                             <Badge key={cat} bg="primary" className="me-1">
//                               {cat}
//                             </Badge>
//                           ))}
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//             ) : (
//               <Form.Group>
//                 <Form.Label>Number of Cosplayers</Form.Label>
//                 <Form.Control
//                   type="number"
//                   min="1"
//                   value={manualQuantity}
//                   onChange={(e) =>
//                     setManualQuantity(Math.max(1, e.target.value))
//                   }
//                 />
//               </Form.Group>
//             )}
//           </div>
//         )}

//         {step === 5 && (
//           <div className="step-section fade-in">
//             <h2 className="text-center mb-4">Review Your Event</h2>
//             <Card>
//               <Card.Body>
//                 <Card.Title>Event Summary</Card.Title>
//                 <p>
//                   <strong>Event:</strong> {selectedEvent?.name}
//                 </p>
//                 <p>
//                   <strong>Location:</strong> {selectedEvent?.location}
//                 </p>
//                 <p>
//                   <strong>Start:</strong>{" "}
//                   {getFormattedDateTime(startDate, startTime)}
//                 </p>
//                 <p>
//                   <strong>End:</strong> {getFormattedDateTime(endDate, endTime)}
//                 </p>
//                 <p>
//                   <strong>Category:</strong> {selectedCategory}
//                 </p>
//                 <p>
//                   <strong>Cosplayers:</strong>{" "}
//                   {useCosplayerList
//                     ? selectedCosplayers.map((c) => c.name).join(", ")
//                     : manualQuantity}
//                 </p>
//               </Card.Body>
//             </Card>
//           </div>
//         )}

//         {/* Navigation Buttons */}
//         <div className="d-flex justify-content-between mt-5">
//           {step > 1 && (
//             <Button variant="outline-primary" onClick={handlePrevStep}>
//               Previous
//             </Button>
//           )}
//           <Button variant="primary" onClick={handleNextStep}>
//             {step === 5 ? "Finish" : "Next"} <ChevronRight size={20} />
//           </Button>
//         </div>
//       </Container>

//       {/* Summary Modal */}
//       <Modal
//         show={showSummaryModal}
//         onHide={() => setShowSummaryModal(false)}
//         size="lg"
//         centered
//         className="summary-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Event Summary</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <h4>Your Event Details</h4>
//           <p>
//             <strong>Event:</strong> {selectedEvent?.name}
//           </p>
//           <p>
//             <strong>Location:</strong> {selectedEvent?.location}
//           </p>
//           <p>
//             <strong>Start:</strong> {getFormattedDateTime(startDate, startTime)}
//           </p>
//           <p>
//             <strong>End:</strong> {getFormattedDateTime(endDate, endTime)}
//           </p>
//           <p>
//             <strong>Category:</strong> {selectedCategory}
//           </p>
//           <p>
//             <strong>Cosplayers:</strong>{" "}
//             {useCosplayerList
//               ? selectedCosplayers.map((c) => c.name).join(", ")
//               : manualQuantity}
//           </p>
//           <Button variant="primary" onClick={() => setShowSummaryModal(false)}>
//             Confirm & Submit
//           </Button>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default DetailEventOrganizationPage;

import React, { useState } from "react";
import { Search, ChevronRight, User } from "lucide-react";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Badge,
  Card,
  ProgressBar,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import "../../styles/DetailEventOrganizationPage.scss";

const DetailEventOrganizationPage = () => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [venueDescription, setVenueDescription] = useState("");
  const [images, setImages] = useState([]);
  const [selectedCosplayers, setSelectedCosplayers] = useState([]);
  const [manualQuantity, setManualQuantity] = useState(1);
  const [useCosplayerList, setUseCosplayerList] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [characterSearch, setCharacterSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const categories = [
    { name: "Halloween", image: "https://static-images.vnncdn.net/files/publish/2023/10/26/le-hoi-halloween-2023-la-ngay-nao-611.jpg?width=0&s=WBL23e8H3tbjOtgDXA7h3w" },
    { name: "Anime", image: "https://www.avisanime.fr/wp-content/uploads/2024/02/Scan-Jujutsu-Kaisen-apres-anime-que-lire-et-ou-commencer.jpg" },
    { name: "Game", image: "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/02/game-hot-thumb.jpg" },
    { name: "Comic Con", image: "https://offloadmedia.feverup.com/secretlosangeles.com/wp-content/uploads/2022/12/13103130/unnamed-2-1024x576.jpg" },
    { name: "Fantasy", image: "https://images2.thanhnien.vn/528068263637045248/2023/9/15/fantasy-16947704442011729238363.jpg" },
    { name: "Sci-Fi", image: "https://static.scientificamerican.com/sciam/cache/file/C51BE585-F913-4327-9F0E02FCB6321923_source.jpg?w=1200" },
    { name: "Superheroes", image: "https://www.mensjournal.com/.image/t_share/MTk2MTM3MzYwNzA2OTcxMTQx/batman-superman-aquaman-wonder-woman-flash-cyborg-of-the-justice-league.jpg" },
    { name: "Historical", image: "https://clickhole.com/wp-content/uploads/2023/10/historical-figurs.png" },
    { name: "Music Festival", image: "https://www.anarapublishing.com/wp-content/uploads/2019/04/photo-1506157786151-b8491531f063.jpeg" },
    { name: "Cultural", image: "https://ohmyfacts.com/wp-content/uploads/2024/09/28-facts-about-cultural-sensitivity-1726202634.jpg" },
    { name: "Sports", image: "https://nativespeaker.vn/uploaded/page_1656_1712278968_1715676497.jpg" },
    { name: "Technology", image: "https://blog.hyperiondev.com/wp-content/uploads/2019/02/Blog-Tech-Events.jpg" },
    { name: "Fashion", image: "https://iso.500px.com/wp-content/uploads/2020/02/Christophe-Josse-Finale-By-Milton-Tan.jpeg" },
    { name: "Food & Drink", image: "https://eventbrite-s3.s3.amazonaws.com/marketing/landingpages/assets/2023/loce/food-drinks-festivals/hero_festivals_food2.jpg" },
    { name: "Art & Design", image: "https://images.prestigeonline.com/wp-content/uploads/sites/8/2022/07/12140511/national_museum.6d2b3175946.original-min-1349x900.jpg" },
    { name: "Business & Networking", image: "https://promoambitions.com/wp-content/uploads/2019/05/Business-Networking-Events-1.jpg" },
    { name: "Education", image: "https://cdn.unischolarz.com/blog/wp-content/uploads/2021/05/24174820/alphagamma-bett-show-2020-opportuniries-min-1024x576.jpg" },
    { name: "Charity & Causes", image: "https://cdn.evbstatic.com/s3-build/fe/build/images/fa71a953ce0560ebed3dcc2b89dd1217-charity_and_causes.webp" },
    { name: "Film & Media", image: "https://rightmedia.vn/wp-content/uploads/2024/05/don-vi-san-xuat-tvc-uy-tin.png" },
    { name: "Seasonal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7ADgrg2CBJXXDwJaeVSIoFZufahUEkqcZnw&s" },
    { name: "Science & Tech", image: "https://cdn.evbstatic.com/s3-build/fe/build/images/1d87d01c25d690d5564dd4184cd39f8e-science.webp" },
    { name: "Other", image: "https://stepup.edu.vn/wp-content/uploads/2020/08/the-other-1.jpg" },
  ];

  const cosplayers = [
    { id: 1, name: "Hana", gender: "Female", categories: ["Superheroes", "Sci-Fi"], image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 2, name: "Kai", gender: "Male", categories: ["Superheroes"], image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 3, name: "Miko", gender: "Female", categories: ["Anime"], image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 4, name: "Yuki", gender: "Female", categories: ["Anime", "Fantasy"], image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
    { id: 5, name: "Taro", gender: "Male", categories: ["Anime"], image: "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg" },
  ];

  const characters = [
    { name: "Superman", category: "Superheroes", gender: "Male" },
    { name: "Wonder Woman", category: "Superheroes", gender: "Female" },
    { name: "Naruto", category: "Anime", gender: "Male" },
    { name: "Sailor Moon", category: "Anime", gender: "Female" },
    { name: "Gandalf", category: "Fantasy", gender: "Male" },
    { name: "Ellen Ripley", category: "Sci-Fi", gender: "Female" },
  ];

  const handleNextStep = () => {
    if (step === 1 && !selectedCategory) return alert("Please select a category!");
    if (
      step === 2 &&
      (!eventName || !location || !startDate || !startTime || !endDate || !endTime || !description || !venueDescription)
    )
      return alert("Please fill in all required fields!");
    if (step === 3 && selectedCosplayers.length === 0 && manualQuantity < 1)
      return alert("Please select cosplayers or enter a quantity!");
    if (step === 4 && !termsAgreed) {
      alert("Please agree to the terms and conditions before submitting.");
      return;
    }
    if (step < 4) setStep(step + 1);
    if (step === 4) setShowSummaryModal(true);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSaveDraft = () => {
    const draft = {
      step,
      selectedCategory,
      eventName,
      location,
      startDate,
      startTime,
      endDate,
      endTime,
      description,
      venueDescription,
      images,
      selectedCosplayers,
      manualQuantity,
      useCosplayerList,
    };
    localStorage.setItem("eventDraft", JSON.stringify(draft));
    alert("Draft saved successfully!");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const getFormattedDateTime = (date, time) => {
    return date && time ? new Date(`${date}T${time}`).toLocaleString() : "N/A";
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterCosplayersByCharacterAndGender = () => {
    let filtered = cosplayers;

    if (characterSearch.trim()) {
      const searchedCharacter = characters.find((char) =>
        char.name.toLowerCase().includes(characterSearch.toLowerCase())
      );
      if (searchedCharacter) {
        filtered = filtered.filter((cosplayer) =>
          cosplayer.categories.includes(searchedCharacter.category)
        );
      } else {
        return [];
      }
    }

    if (genderFilter !== "All") {
      filtered = filtered.filter((cosplayer) => cosplayer.gender === genderFilter);
    }

    return filtered;
  };

  const handleViewProfile = (cosplayer) => {
    alert(`Viewing profile of ${cosplayer.name}`);
  };

  const toggleCosplayerSelection = (cosplayer) => {
    setSelectedCosplayers((prev) =>
      prev.some((c) => c.id === cosplayer.id)
        ? prev.filter((c) => c.id !== cosplayer.id)
        : [...prev, cosplayer]
    );
  };

  return (
    <div className="event-organize-page min-vh-100">
      <div className="hero-section text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Event Organization</h1>
          <p className="lead text-center mt-3">
            Organize your event and book your favorite cosplayers!
          </p>
        </Container>
      </div>

      <Container className="py-4">
        <ProgressBar now={(step / 4) * 100} className="progress-custom" />
        <p className="text-center mt-2">Step {step} of 4</p>
      </Container>

      <Container className="py-5">
        {step === 1 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select Event Category</h2>
            <div className="search-container mb-4">
              <InputGroup>
                <InputGroup.Text>
                  <Search size={20} />
                </InputGroup.Text>
                <FormControl
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
            <Row>
              {filteredCategories.map((category) => (
                <Col md={4} className="mb-4" key={category.name}>
                  <Card
                    className={`category-card ${selectedCategory === category.name ? "selected" : ""}`}
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <Card.Img variant="top" src={category.image} />
                    <Card.Body>
                      <Card.Title>{category.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {step === 2 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Event Information</h2>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Event Name</Form.Label>
                <Form.Control
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter event location"
                />
              </Form.Group>
              <Row className="mb-2">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="custom-date-input"
                    />
                  </Form.Group>
                  <Form.Group className="mt-2">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="custom-time-input"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="custom-date-input"
                    />
                  </Form.Group>
                  <Form.Group className="mt-2">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="custom-time-input"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your event requirements"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Venue Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={venueDescription}
                  onChange={(e) => setVenueDescription(e.target.value)}
                  placeholder="Describe the event venue in detail"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Upload Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                />
                <small className="text-muted">
                  Upload images to illustrate your requirements or venue
                </small>
              </Form.Group>
            </Form>
          </div>
        )}

        {step === 3 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select Cosplayers</h2>
            <Form.Check
              type="switch"
              label={
                useCosplayerList
                  ? "Select from Cosplayer List"
                  : "Enter Quantity Manually"
              }
              checked={useCosplayerList}
              onChange={() => setUseCosplayerList(!useCosplayerList)}
              className="mb-4"
            />
            {useCosplayerList ? (
              <>
                <div className="search-container mb-4 d-flex align-items-center">
                  <InputGroup className="flex-grow-1">
                    <InputGroup.Text>
                      <Search size={20} />
                    </InputGroup.Text>
                    <FormControl
                      placeholder="Search for a character (e.g., Superman, Naruto)"
                      value={characterSearch}
                      onChange={(e) => setCharacterSearch(e.target.value)}
                    />
                  </InputGroup>
                  <Form.Select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="ms-2"
                    style={{ width: "200px" }}
                  >
                    <option value="All">All Cosplayer Genders</option>
                    <option value="Male">Male Cosplayers</option>
                    <option value="Female">Female Cosplayers</option>
                  </Form.Select>
                </div>
                <Row>
                  {filterCosplayersByCharacterAndGender().map((cosplayer) => (
                    <Col md={4} className="mb-4" key={cosplayer.id}>
                      <Card
                        className={`cosplayer-card ${selectedCosplayers.some((c) => c.id === cosplayer.id) ? "selected" : ""
                          }`}
                        onClick={() => toggleCosplayerSelection(cosplayer)}
                      >
                        <Card.Img variant="top" src={cosplayer.image} />
                        <Card.Body>
                          <Card.Title>{cosplayer.name}</Card.Title>
                          <div>
                            {cosplayer.categories.map((cat) => (
                              <Badge key={cat} bg="secondary" className="me-1">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            className="mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(cosplayer);
                            }}
                          >
                            <User size={16} /> View Profile
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {filterCosplayersByCharacterAndGender().length === 0 && (
                  <p className="text-center mt-4">
                    No cosplayers found for "{characterSearch}" with selected filters.
                  </p>
                )}
              </>
            ) : (
              <Form.Group>
                <Form.Label>Number of Cosplayers</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={manualQuantity}
                  onChange={(e) => setManualQuantity(Math.max(1, e.target.value))}
                />
              </Form.Group>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Review Your Event</h2>
            <Card>
              <Card.Body>
                <p><strong>Category:</strong> {selectedCategory}</p>
                <p><strong>Event Name:</strong> {eventName}</p>
                <p><strong>Location:</strong> {location}</p>
                <p><strong>Start:</strong> {getFormattedDateTime(startDate, startTime)}</p>
                <p><strong>End:</strong> {getFormattedDateTime(endDate, endTime)}</p>
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Venue Description:</strong> {venueDescription}</p>
                <p><strong>Images:</strong> {images.length} images uploaded</p>
                <p>
                  <strong>Cosplayers:</strong>{" "}
                  {useCosplayerList
                    ? selectedCosplayers.map((c) => c.name).join(", ")
                    : manualQuantity}
                </p>
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
              Previous
            </Button>
          )}
          <div>
            <Button variant="outline-secondary" onClick={handleSaveDraft} className="me-2">
              Save as Draft
            </Button>
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={step === 4 && !termsAgreed}
            >
              {step === 4 ? "Finish" : "Next"} <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      </Container>

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
              <li>All bookings are subject to cosplayer availability.</li>
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
        show={showSummaryModal}
        onHide={() => setShowSummaryModal(false)}
        size="lg"
        centered
        className="summary-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Event Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Category:</strong> {selectedCategory}</p>
          <p><strong>Event Name:</strong> {eventName}</p>
          <p><strong>Location:</strong> {location}</p>
          <p><strong>Start:</strong> {getFormattedDateTime(startDate, startTime)}</p>
          <p><strong>End:</strong> {getFormattedDateTime(endDate, endTime)}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>Venue Description:</strong> {venueDescription}</p>
          <p><strong>Images:</strong> {images.length} images uploaded</p>
          <p>
            <strong>Cosplayers:</strong>{" "}
            {useCosplayerList
              ? selectedCosplayers.map((c) => c.name).join(", ")
              : manualQuantity}
          </p>
          <Button variant="primary" onClick={() => setShowSummaryModal(false)}>
            Confirm & Submit
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DetailEventOrganizationPage;