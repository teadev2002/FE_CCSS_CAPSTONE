// import React, { useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   ListGroup,
//   Alert,
//   Badge,
// } from "react-bootstrap";
// import "../../styles/CosplayerPage.scss";

// const CosplayerPage = () => {
//   // Sample data for cosplayers and costumes
//   const cosplayers = [
//     {
//       id: 1,
//       name: "Luna Star",
//       avatar:
//         "https://images.pexels.com/photos/19231454/pexels-photo-19231454/free-photo-of-girl-in-anya-forger-costume.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//       description:
//         "Experienced cosplayer specializing in anime and fantasy characters.",
//     },
//     {
//       id: 2,
//       name: "Kai Blade",
//       avatar:
//         "https://gambar.sgp1.digitaloceanspaces.com/wp-content/uploads/2021/02/kameaam.jpg",
//       description: "Dynamic cosplayer known for superhero and sci-fi roles.",
//     },
//     {
//       id: 3,
//       name: "Mika Moon",
//       avatar:
//         "https://th.bing.com/th/id/OIF.9jqAjB9W9sQhS1bJbUH1sg?rs=1&pid=ImgDetMain",
//       description:
//         "Talented cosplayer with a focus on historical and mythology themes.",
//     },
//   ];

//   const costumes = {
//     1: [
//       {
//         id: 101,
//         name: "Sailor Moon",
//         image:
//           "https://th.bing.com/th/id/R.068d6e18db88dcfee0c5fef0e7d5f60f?rik=ZpQCwm59LxyECQ&pid=ImgRaw&r=0",
//         available: true,
//       },
//       {
//         id: 102,
//         name: "Naruto Uzumaki",
//         image:
//           "https://th.bing.com/th/id/OIP.kN5HWcrqUYMfIVN-rl96ZgHaLH?rs=1&pid=ImgDetMain",
//         available: false,
//       },
//     ],
//     2: [
//       {
//         id: 201,
//         name: "Spider-Man",
//         image:
//           "https://th.bing.com/th/id/OIP.i6zQCyXX6AW0dBvKVx_xkwHaLH?rs=1&pid=ImgDetMain",
//         available: true,
//       },
//       {
//         id: 202,
//         name: "Iron Man",
//         image:
//           "https://th.bing.com/th/id/OIP.yYsRMvGWgsdr0FALLzcqNgHaLH?rs=1&pid=ImgDetMain",
//         available: false,
//       },
//     ],
//     3: [
//       {
//         id: 301,
//         name: "Cleopatra",
//         image:
//           "https://th.bing.com/th/id/OIP.hNItRKAu72Yt-X59Vi2DbgHaJQ?rs=1&pid=ImgDetMain",
//         available: true,
//       },
//       {
//         id: 302,
//         name: "Athena",
//         image:
//           "https://th.bing.com/th/id/OIP.yaqP-V5Tqj4Wtosp2enD9wHaLH?rs=1&pid=ImgDetMain",
//         available: false,
//       },
//     ],
//   };

//   const [selectedCosplayer, setSelectedCosplayer] = useState(null);
//   const [selectedCostume, setSelectedCostume] = useState(null);
//   const [rentalType, setRentalType] = useState(null);
//   const [rentalPeriod, setRentalPeriod] = useState({
//     dateStart: "",
//     dateEnd: "",
//     startTime: "",
//     endTime: "",
//   });
//   const [contract, setContract] = useState([]);
//   const [error, setError] = useState("");

//   // Handle cosplayer selection
//   const handleCosplayerSelect = (cosplayer) => {
//     setSelectedCosplayer(cosplayer);
//     setSelectedCostume(null);
//     setRentalType(null);
//     setRentalPeriod({ dateStart: "", dateEnd: "", startTime: "", endTime: "" }); // Sửa lại để dùng dateStart và dateEnd
//     setError("");
//   };

//   // Handle costume selection
//   const handleCostumeSelect = (costume) => {
//     setSelectedCostume(costume);
//     setError("");
//   };

//   // Handle rental type selection
//   const handleRentalTypeSelect = (type) => {
//     setRentalType(type);
//     if (type === 2 && selectedCosplayer) {
//       setError(
//         "Please rent costumes for this cosplayer 1 month in advance to prepare. <a href='/costumes'>Click here</a> to view costumes."
//       );
//     } else {
//       setError("");
//     }
//   };

//   // Handle rental period input
//   const handleRentalPeriodChange = (e) => {
//     const { name, value } = e.target;
//     setRentalPeriod({ ...rentalPeriod, [name]: value });
//   };

//   // Create contract
//   const handleAddContract = () => {
//     if (
//       !selectedCosplayer ||
//       !rentalType ||
//       !rentalPeriod.dateStart ||
//       !rentalPeriod.dateEnd ||
//       !rentalPeriod.startTime ||
//       !rentalPeriod.endTime
//     ) {
//       setError("Please fill in all fields before creating a contract.");
//       return;
//     }
//     if (rentalType === 2 && !selectedCostume) {
//       setError("Please select a character for rental type 2.");
//       return;
//     }
//     // Kiểm tra dateEnd phải lớn hơn hoặc bằng dateStart
//     if (new Date(rentalPeriod.dateEnd) < new Date(rentalPeriod.dateStart)) {
//       setError("End date must be equal to or after start date.");
//       return;
//     }
//     const newContract = {
//       cosplayer: selectedCosplayer.name,
//       costume: selectedCostume
//         ? selectedCostume.name
//         : "No costume (to be prepared)",
//       rentalType,
//       dateStart: rentalPeriod.dateStart,
//       dateEnd: rentalPeriod.dateEnd,
//       startTime: rentalPeriod.startTime,
//       endTime: rentalPeriod.endTime,
//     };
//     setContract([...contract, newContract]);
//     setSelectedCosplayer(null);
//     setSelectedCostume(null);
//     setRentalType(null);
//     setRentalPeriod({ dateStart: "", dateEnd: "", startTime: "", endTime: "" });
//     setError("");
//   };

//   return (
//     <div className="cosplay-rental-page min-vh-100">
//       <div className="hero-section text-black py-5">
//         <Container>
//           <h1 className="display-4 fw-bold text-center">
//             Cosplayer Rental
//           </h1>
//           <p className="lead text-center mt-3">
//             Find and rent cosplayers you love for your events
//           </p>
//         </Container>
//       </div>

//       <Container className="py-5">
//         {/* Cosplayer Selection - Luôn hiển thị */}
//         <Row className="mb-5 rental-form-section">
//           <Col md={6}>
//             <h3 className="text-black mb-4 section-title">
//               Choose Your Cosplayer
//             </h3>
//             <ListGroup className="cosplayer-list">
//               {cosplayers.map((cosplayer) => (
//                 <ListGroup.Item
//                   key={cosplayer.id}
//                   action
//                   onClick={() => handleCosplayerSelect(cosplayer)}
//                   active={selectedCosplayer?.id === cosplayer.id}
//                   className="cosplayer-item"
//                 >
//                   <div className="d-flex align-items-center">
//                     <img
//                       src={cosplayer.avatar}
//                       alt={cosplayer.name}
//                       className="cosplayer-avatar"
//                     />
//                     <div className="ms-3 flex-grow-1">
//                       <h5 className="mb-1">{cosplayer.name}</h5>
//                       <p className="mb-0 text-muted">{cosplayer.description}</p>
//                     </div>
//                     <Badge bg="primary" className="select-badge">
//                       {selectedCosplayer?.id === cosplayer.id
//                         ? "Selected"
//                         : "Select"}
//                     </Badge>
//                   </div>
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           </Col>

//           {/* Costume Selection - Chỉ hiển thị khi có cosplayer được chọn */}
//           {selectedCosplayer && (
//             <Col md={6}>
//               <h3 className="text-black mb-4 section-title">
//                 Costume Selection
//               </h3>
//               <Card className="costume-selection-card">
//                 <Card.Body>
//                   <h5>Available Costumes:</h5>
//                   <Row xs={1} md={2} className="g-3">
//                     {costumes[selectedCosplayer.id].map((costume) => (
//                       <Col key={costume.id}>
//                         <Card
//                           className={`costume-card ${
//                             selectedCostume?.id === costume.id ? "selected" : ""
//                           } ${!costume.available ? "unavailable" : ""}`}
//                           onClick={() =>
//                             costume.available && handleCostumeSelect(costume)
//                           }
//                         >
//                           <Card.Img variant="top" src={costume.image} />
//                           <Card.Body className="p-2">
//                             <Card.Title className="mb-0">
//                               {costume.name}
//                             </Card.Title>
//                             <Badge
//                               bg={costume.available ? "success" : "danger"}
//                               className="status-badge"
//                             >
//                               {costume.available ? "Available" : "Booked"}
//                             </Badge>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//           )}
//         </Row>

//         {/* Rental Schedule */}
//         <Row className="mb-3 Rental-Schedule">
//           <Col>
//             <h3 className="text-black mb-4 section-title">Rental Schedule</h3>
//             <Card className="rental-form-card">
//               <Card.Body>
//                 <Form>
//                   <div className="d-flex gap-3 mb-3">
//                     <Form.Group className="flex-grow-1">
//                       <Form.Label>Date Start</Form.Label>
//                       <Form.Control
//                         className="dateTime"
//                         type="date"
//                         name="dateStart"
//                         value={rentalPeriod.dateStart}
//                         onChange={handleRentalPeriodChange}
//                         min={new Date().toISOString().split("T")[0]}
//                       />
//                     </Form.Group>
//                     <Form.Group className="flex-grow-1">
//                       <Form.Label>Date End</Form.Label>
//                       <Form.Control
//                         className="dateTime"
//                         type="date"
//                         name="dateEnd"
//                         value={rentalPeriod.dateEnd}
//                         onChange={handleRentalPeriodChange}
//                         min={
//                           rentalPeriod.dateStart ||
//                           new Date().toISOString().split("T")[0]
//                         }
//                       />
//                     </Form.Group>
//                   </div>

//                   <div className="d-flex gap-3 mb-3">
//                     <Form.Group className="flex-grow-1">
//                       <Form.Label>Start Time</Form.Label>
//                       <Form.Control
//                         className="dateTime"
//                         type="time"
//                         name="startTime"
//                         value={rentalPeriod.startTime}
//                         onChange={handleRentalPeriodChange}
//                       />
//                     </Form.Group>
//                     <Form.Group className="flex-grow-1">
//                       <Form.Label>End Time</Form.Label>
//                       <Form.Control
//                         className="dateTime"
//                         type="time"
//                         name="endTime"
//                         value={rentalPeriod.endTime}
//                         onChange={handleRentalPeriodChange}
//                       />
//                     </Form.Group>
//                   </div>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Rental Type</Form.Label>
//                     <div className="rental-type-options">
//                       <Form.Check
//                         type="radio"
//                         id="rentalType1"
//                         label="With Available Costume"
//                         name="rentalType"
//                         onChange={() => handleRentalTypeSelect(1)}
//                         checked={rentalType === 1}
//                       />
//                       <Form.Check
//                         type="radio"
//                         id="rentalType2"
//                         label="Custom Costume (1 Month Prep)"
//                         name="rentalType"
//                         onChange={() => handleRentalTypeSelect(2)}
//                         checked={rentalType === 2}
//                       />
//                     </div>
//                   </Form.Group>

//                   <Button
//                     variant="primary"
//                     onClick={handleAddContract}
//                     className="w-50 mt-3"
//                   >
//                     Add to Contract
//                   </Button>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* Error Notification */}
//         {error && (
//           <Row className="mb-5">
//             <Col>
//               <Alert variant="warning">
//                 <div dangerouslySetInnerHTML={{ __html: error }} />
//               </Alert>
//             </Col>
//           </Row>
//         )}

//         {/* Contracts */}
//         {contract.length > 0 && (
//           <Row>
//             <Col>
//               <h3 className="text-black mb-4 section-title">Your Contracts</h3>
//               <div className="contract-list">
//                 {contract.map((item, index) => (
//                   <Card key={index} className="contract-card mb-3">
//                     <Card.Body>
//                       <div className="d-flex justify-content-between align-items-start">
//                         <div>
//                           <Card.Title>{item.cosplayer}</Card.Title>
//                           <Card.Text>
//                             <strong>Costume:</strong> {item.costume}
//                             <br />
//                             <strong>Type:</strong>{" "}
//                             {item.rentalType === 1
//                               ? "With Costume"
//                               : "Custom Costume"}
//                             <br />
//                             <strong>Time:</strong> {item.dateStart} to{" "}
//                             {item.dateEnd}, {item.startTime} - {item.endTime}
//                           </Card.Text>
//                         </div>
//                         <Badge bg="success">Confirmed</Badge>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 ))}
//               </div>
//             </Col>
//           </Row>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default CosplayerPage;

// import React, { useState, useRef } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   Form,
//   ListGroup,
//   Alert,
//   Badge,
// } from "react-bootstrap";
// import "../../styles/CosplayerPage.scss";

// const CosplayerPage = () => {
//   const cosplayers = [
//     {
//       id: 1,
//       name: "Luna Star",
//       avatar:
//         "https://images.pexels.com/photos/19231454/pexels-photo-19231454/free-photo-of-girl-in-anya-forger-costume.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//       description:
//         "Experienced cosplayer specializing in anime and fantasy characters.",
//     },
//     {
//       id: 2,
//       name: "Kai Blade",
//       avatar:
//         "https://gambar.sgp1.digitaloceanspaces.com/wp-content/uploads/2021/02/kameaam.jpg",
//       description: "Dynamic cosplayer known for superhero and sci-fi roles.",
//     },
//     {
//       id: 3,
//       name: "Mika Moon",
//       avatar:
//         "https://th.bing.com/th/id/OIF.9jqAjB9W9sQhS1bJbUH1sg?rs=1&pid=ImgDetMain",
//       description:
//         "Talented cosplayer with a focus on historical and mythology themes.",
//     },
//   ];

//   const costumes = {
//     1: [
//       {
//         id: 101,
//         name: "Sailor Moon",
//         image:
//           "https://th.bing.com/th/id/R.068d6e18db88dcfee0c5fef0e7d5f60f?rik=ZpQCwm59LxyECQ&pid=ImgRaw&r=0",
//         available: true,
//       },
//       {
//         id: 102,
//         name: "Naruto Uzumaki",
//         image:
//           "https://th.bing.com/th/id/OIP.kN5HWcrqUYMfIVN-rl96ZgHaLH?rs=1&pid=ImgDetMain",
//         available: false,
//       },
//     ],
//     2: [
//       {
//         id: 201,
//         name: "Spider-Man",
//         image:
//           "https://th.bing.com/th/id/OIP.i6zQCyXX6AW0dBvKVx_xkwHaLH?rs=1&pid=ImgDetMain",
//         available: true,
//       },
//       {
//         id: 202,
//         name: "Iron Man",
//         image:
//           "https://th.bing.com/th/id/OIP.yYsRMvGWgsdr0FALLzcqNgHaLH?rs=1&pid=ImgDetMain",
//         available: false,
//       },
//     ],
//     3: [
//       {
//         id: 301,
//         name: "Cleopatra",
//         image:
//           "https://th.bing.com/th/id/OIP.hNItRKAu72Yt-X59Vi2DbgHaJQ?rs=1&pid=ImgDetMain",
//         available: true,
//       },
//       {
//         id: 302,
//         name: "Athena",
//         image:
//           "https://th.bing.com/th/id/OIP.yaqP-V5Tqj4Wtosp2enD9wHaLH?rs=1&pid=ImgDetMain",
//         available: false,
//       },
//     ],
//   };

//   const [selectedCosplayer, setSelectedCosplayer] = useState(null);
//   const [selectedCostume, setSelectedCostume] = useState(null);
//   const [rentalType, setRentalType] = useState(null);
//   const [rentalPeriod, setRentalPeriod] = useState({
//     dateStart: "",
//     dateEnd: "",
//     startTime: "",
//     endTime: "",
//   });
//   const [contract, setContract] = useState([]);
//   const [error, setError] = useState("");

//   // Refs for date/time inputs
//   const dateStartRef = useRef(null);
//   const dateEndRef = useRef(null);
//   const timeStartRef = useRef(null);
//   const timeEndRef = useRef(null);

//   // Handle cosplayer selection
//   const handleCosplayerSelect = (cosplayer) => {
//     setSelectedCosplayer(cosplayer);
//     setSelectedCostume(null);
//     setRentalType(null);
//     setRentalPeriod({ dateStart: "", dateEnd: "", startTime: "", endTime: "" });
//     setError("");
//   };

//   // Handle costume selection
//   const handleCostumeSelect = (costume) => {
//     setSelectedCostume(costume);
//     setError("");
//   };

//   // Handle rental type selection
//   const handleRentalTypeSelect = (type) => {
//     setRentalType(type);
//     if (type === 2 && selectedCosplayer) {
//       setError(
//         "Please rent costumes for this cosplayer 1 month in advance to prepare. <a href='/costumes'>Click here</a> to view costumes."
//       );
//     } else {
//       setError("");
//     }
//   };

//   // Handle rental period input
//   const handleRentalPeriodChange = (e) => {
//     const { name, value } = e.target;
//     setRentalPeriod({ ...rentalPeriod, [name]: value });
//   };

//   // Trigger date/time picker on click
//   const handleDateTimeClick = (ref) => {
//     if (ref.current) {
//       ref.current.showPicker(); // Trigger native picker
//     }
//   };

//   // Create contract
//   const handleAddContract = () => {
//     if (
//       !selectedCosplayer ||
//       !rentalType ||
//       !rentalPeriod.dateStart ||
//       !rentalPeriod.dateEnd ||
//       !rentalPeriod.startTime ||
//       !rentalPeriod.endTime
//     ) {
//       setError("Please fill in all fields before creating a contract.");
//       return;
//     }
//     if (rentalType === 2 && !selectedCostume) {
//       setError("Please select a character for rental type 2.");
//       return;
//     }
//     if (new Date(rentalPeriod.dateEnd) < new Date(rentalPeriod.dateStart)) {
//       setError("End date must be equal to or after start date.");
//       return;
//     }
//     const newContract = {
//       cosplayer: selectedCosplayer.name,
//       costume: selectedCostume
//         ? selectedCostume.name
//         : "No costume (to be prepared)",
//       rentalType,
//       dateStart: rentalPeriod.dateStart,
//       dateEnd: rentalPeriod.dateEnd,
//       startTime: rentalPeriod.startTime,
//       endTime: rentalPeriod.endTime,
//     };
//     setContract([...contract, newContract]);
//     setSelectedCosplayer(null);
//     setSelectedCostume(null);
//     setRentalType(null);
//     setRentalPeriod({ dateStart: "", dateEnd: "", startTime: "", endTime: "" });
//     setError("");
//   };

//   return (
//     <div className="cosplay-rental-page min-vh-100">
//       <div className="hero-section text-black py-5">
//         <Container>
//           <h1 className="display-4 fw-bold text-center">Cosplayer Rental</h1>
//           <p className="lead text-center mt-3">
//             Find and rent cosplayers you love for your events
//           </p>
//         </Container>
//       </div>

//       <Container className="py-5">
//         {/* Cosplayer Selection */}
//         <Row className="mb-5 rental-form-section">
//           <Col md={6}>
//             <h3 className="text-black mb-4 section-title">Choose Your Cosplayer</h3>
//             <ListGroup className="cosplayer-list">
//               {cosplayers.map((cosplayer) => (
//                 <ListGroup.Item
//                   key={cosplayer.id}
//                   action
//                   onClick={() => handleCosplayerSelect(cosplayer)}
//                   active={selectedCosplayer?.id === cosplayer.id}
//                   className="cosplayer-item"
//                 >
//                   <div className="d-flex align-items-center">
//                     <img
//                       src={cosplayer.avatar}
//                       alt={cosplayer.name}
//                       className="cosplayer-avatar"
//                     />
//                     <div className="ms-3 flex-grow-1">
//                       <h5 className="mb-1">{cosplayer.name}</h5>
//                       <p className="mb-0 text-muted">{cosplayer.description}</p>
//                     </div>
//                     <Badge bg="primary" className="select-badge">
//                       {selectedCosplayer?.id === cosplayer.id ? "Selected" : "Select"}
//                     </Badge>
//                   </div>
//                 </ListGroup.Item>
//               ))}
//             </ListGroup>
//           </Col>

//           {selectedCosplayer && (
//             <Col md={6}>
//               <h3 className="text-black mb-4 section-title">Costume Selection</h3>
//               <Card className="costume-selection-card">
//                 <Card.Body>
//                   <h5>Available Costumes:</h5>
//                   <Row xs={1} md={2} className="g-3">
//                     {costumes[selectedCosplayer.id].map((costume) => (
//                       <Col key={costume.id}>
//                         <Card
//                           className={`costume-card ${
//                             selectedCostume?.id === costume.id ? "selected" : ""
//                           } ${!costume.available ? "unavailable" : ""}`}
//                           onClick={() => costume.available && handleCostumeSelect(costume)}
//                         >
//                           <div className="badge-wrapper">
//                             <Card.Img variant="top" src={costume.image} />
//                             <Badge
//                               bg={
//                                 selectedCostume?.id === costume.id
//                                   ? "primary"
//                                   : costume.available
//                                   ? "success"
//                                   : "danger"
//                               }
//                               className="status-badge"
//                             >
//                               {selectedCostume?.id === costume.id
//                                 ? "Selected"
//                                 : costume.available
//                                 ? "Available"
//                                 : "Booked"}
//                             </Badge>
//                           </div>
//                           <Card.Body className="p-2">
//                             <Card.Title className="mb-0">{costume.name}</Card.Title>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//           )}
//         </Row>

//         {/* Rental Schedule */}
//         <Row className="mb-3 Rental-Schedule">
//           <Col>
//             <h3 className="text-black mb-4 section-title">Rental Schedule</h3>
//             <Card className="rental-form-card">
//               <Card.Body>
//                 <Form>
//                   <div className="d-flex gap-3 mb-3">
//                     <Form.Group className="flex-grow-1">
//                       <Form.Label>Date Start</Form.Label>
//                       <div
//                         className="datetime-wrapper"
//                         onClick={() => handleDateTimeClick(dateStartRef)}
//                       >
//                         <Form.Control
//                           ref={dateStartRef}
//                           className="dateTime"
//                           type="date"
//                           name="dateStart"
//                           value={rentalPeriod.dateStart}
//                           onChange={handleRentalPeriodChange}
//                           min={new Date().toISOString().split("T")[0]}
//                         />
//                       </div>
//                     </Form.Group>
//                     <Form.Group className="flex-grow-1">
//                       <Form.Label>Date End</Form.Label>
//                       <div
//                         className="datetime-wrapper"
//                         onClick={() => handleDateTimeClick(dateEndRef)}
//                       >
//                         <Form.Control
//                           ref={dateEndRef}
//                           className="dateTime"
//                           type="date"
//                           name="dateEnd"
//                           value={rentalPeriod.dateEnd}
//                           onChange={handleRentalPeriodChange}
//                           min={
//                             rentalPeriod.dateStart ||
//                             new Date().toISOString().split("T")[0]
//                           }
//                         />
//                       </div>
//                     </Form.Group>
//                   </div>

//                   <div className="d-flex gap-3 mb-3">
//                     <Form.Group className="flex-grow-1">
//                       <Form.Label>Start Time</Form.Label>
//                       <div
//                         className="datetime-wrapper"
//                         onClick={() => handleDateTimeClick(timeStartRef)}
//                       >
//                         <Form.Control
//                           ref={timeStartRef}
//                           className="dateTime"
//                           type="time"
//                           name="startTime"
//                           value={rentalPeriod.startTime}
//                           onChange={handleRentalPeriodChange}
//                         />
//                       </div>
//                     </Form.Group>
//                     <Form.Group className="flex-grow-1">
//                       <Form.Label>End Time</Form.Label>
//                       <div
//                         className="datetime-wrapper"
//                         onClick={() => handleDateTimeClick(timeEndRef)}
//                       >
//                         <Form.Control
//                           ref={timeEndRef}
//                           className="dateTime"
//                           type="time"
//                           name="endTime"
//                           value={rentalPeriod.endTime}
//                           onChange={handleRentalPeriodChange}
//                         />
//                       </div>
//                     </Form.Group>
//                   </div>

//                   <Form.Group className="mb-3">
//                     <Form.Label>Rental Type</Form.Label>
//                     <div className="rental-type-options">
//                       <Form.Check
//                         type="radio"
//                         id="rentalType1"
//                         label="With Available Costume"
//                         name="rentalType"
//                         onChange={() => handleRentalTypeSelect(1)}
//                         checked={rentalType === 1}
//                       />
//                       <Form.Check
//                         type="radio"
//                         id="rentalType2"
//                         label="Custom Costume (1 Month Prep)"
//                         name="rentalType"
//                         onChange={() => handleRentalTypeSelect(2)}
//                         checked={rentalType === 2}
//                       />
//                     </div>
//                   </Form.Group>

//                   <Button
//                     variant="primary"
//                     onClick={handleAddContract}
//                     className="w-50 mt-3"
//                   >
//                     Add to Contract
//                   </Button>
//                 </Form>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {error && (
//           <Row className="mb-5">
//             <Col>
//               <Alert variant="warning">
//                 <div dangerouslySetInnerHTML={{ __html: error }} />
//               </Alert>
//             </Col>
//           </Row>
//         )}

//         {contract.length > 0 && (
//           <Row>
//             <Col>
//               <h3 className="text-black mb-4 section-title">Your Contracts</h3>
//               <div className="contract-list">
//                 {contract.map((item, index) => (
//                   <Card key={index} className="contract-card mb-3">
//                     <Card.Body>
//                       <div className="d-flex justify-content-between align-items-start">
//                         <div>
//                           <Card.Title>{item.cosplayer}</Card.Title>
//                           <Card.Text>
//                             <strong>Costume:</strong> {item.costume}
//                             <br />
//                             <strong>Type:</strong>{" "}
//                             {item.rentalType === 1 ? "With Costume" : "Custom Costume"}
//                             <br />
//                             <strong>Time:</strong> {item.dateStart} to {item.dateEnd}, {item.startTime} - {item.endTime}
//                           </Card.Text>
//                         </div>
//                         <Badge bg="success">Confirmed</Badge>
//                       </div>
//                     </Card.Body>
//                   </Card>
//                 ))}
//               </div>
//             </Col>
//           </Row>
//         )}
//       </Container>
//     </div>
//   );
// };

// export default CosplayerPage;

import React, { useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ListGroup,
  Alert,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { Search } from "lucide-react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "../../styles/CosplayerPage.scss";

const CosplayerPage = () => {
  const cosplayers = [
    {
      id: 1,
      name: "Luna Star",
      avatar:
        "https://images.pexels.com/photos/19231454/pexels-photo-19231454/free-photo-of-girl-in-anya-forger-costume.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description: "Specializes in anime and fantasy characters.",
      characters: [
        { name: "Sailor Moon", image: "https://th.bing.com/th/id/R.068d6e18db88dcfee0c5fef0e7d5f60f?rik=ZpQCwm59LxyECQ&pid=ImgRaw&r=0" },
        { name: "Naruto Uzumaki", image: "https://th.bing.com/th/id/OIP.kN5HWcrqUYMfIVN-rl96ZgHaLH?rs=1&pid=ImgDetMain" },
        { name: "Spider-Man", image: "https://th.bing.com/th/id/OIP.i6zQCyXX6AW0dBvKVx_xkwHaLH?rs=1&pid=ImgDetMain" },
      ],
      availability: [
        { start: "2025-03-15T10:00", end: "2025-03-16T18:00" },
        { start: "2025-03-20T09:00", end: "2025-03-20T17:00" },
        { start: "2025-03-25T12:00", end: "2025-03-26T20:00" },
      ],
    },
    {
      id: 2,
      name: "Kai Blade",
      avatar:
        "https://gambar.sgp1.digitaloceanspaces.com/wp-content/uploads/2021/02/kameaam.jpg",
      description: "Known for superhero and sci-fi roles.",
      characters: [
        { name: "Spider-Man", image: "https://th.bing.com/th/id/OIP.i6zQCyXX6AW0dBvKVx_xkwHaLH?rs=1&pid=ImgDetMain" },
        { name: "Iron Man", image: "https://th.bing.com/th/id/OIP.yYsRMvGWgsdr0FALLzcqNgHaLH?rs=1&pid=ImgDetMain" },
        { name: "Captain America", image: "https://th.bing.com/th/id/OIP.9WZgX8z5j5xY8q8Z9nX9ZwHaLH?rs=1&pid=ImgDetMain" },
      ],
      availability: [
        { start: "2025-03-16T12:00", end: "2025-03-17T20:00" },
        { start: "2025-03-21T11:00", end: "2025-03-21T19:00" },
        { start: "2025-03-26T10:00", end: "2025-03-26T18:00" },
      ],
    },
    {
      id: 3,
      name: "Mika Moon",
      avatar:
        "https://th.bing.com/th/id/OIF.9jqAjB9W9sQhS1bJbUH1sg?rs=1&pid=ImgDetMain",
      description: "Focuses on historical and mythology themes.",
      characters: [
        { name: "Cleopatra", image: "https://th.bing.com/th/id/OIP.hNItRKAu72Yt-X59Vi2DbgHaJQ?rs=1&pid=ImgDetMain" },
        { name: "Athena", image: "https://th.bing.com/th/id/OIP.yaqP-V5Tqj4Wtosp2enD9wHaLH?rs=1&pid=ImgDetMain" },
        { name: "Spider-Man", image: "https://th.bing.com/th/id/OIP.i6zQCyXX6AW0dBvKVx_xkwHaLH?rs=1&pid=ImgDetMain" },
      ],
      availability: [
        { start: "2025-03-17T08:00", end: "2025-03-18T16:00" },
        { start: "2025-03-22T10:00", end: "2025-03-22T18:00" },
        { start: "2025-03-27T09:00", end: "2025-03-27T17:00" },
      ],
    },
    {
      id: 4,
      name: "Ryu Storm",
      avatar:
        "https://th.bing.com/th/id/OIP.t8XgOZM7X4zQ7X8Z9X0Z0QHaLH?rs=1&pid=ImgDetMain",
      description: "Expert in martial arts and action characters.",
      characters: [
        { name: "Naruto Uzumaki", image: "https://th.bing.com/th/id/OIP.kN5HWcrqUYMfIVN-rl96ZgHaLH?rs=1&pid=ImgDetMain" },
        { name: "Goku", image: "https://th.bing.com/th/id/OIP.oAq64jTNwzi081joDeG2KAHaKe?rs=1&pid=ImgDetMain" },
        { name: "Batman", image: "https://th.bing.com/th/id/OIP.5X8Z9X0Z0Q7X8Z9X0Z0QHaLH?rs=1&pid=ImgDetMain" },
      ],
      availability: [
        { start: "2025-03-18T14:00", end: "2025-03-19T22:00" },
        { start: "2025-03-23T13:00", end: "2025-03-23T21:00" },
        { start: "2025-03-28T15:00", end: "2025-03-28T23:00" },
      ],
    },
    {
      id: 5,
      name: "Sera Flame",
      avatar:
        "https://th.bing.com/th/id/OIP.6X8Z9X0Z0Q7X8Z9X0Z0QHaLH?rs=1&pid=ImgDetMain",
      description: "Passionate about magical and mythical roles.",
      characters: [
        { name: "Sailor Moon", image: "https://th.bing.com/th/id/R.068d6e18db88dcfee0c5fef0e7d5f60f?rik=ZpQCwm59LxyECQ&pid=ImgRaw&r=0" },
        { name: "Hermione Granger", image: "https://th.bing.com/th/id/OIP.7X8Z9X0Z0Q7X8Z9X0Z0QHaLH?rs=1&pid=ImgDetMain" },
        { name: "Elsa", image: "https://th.bing.com/th/id/OIP.8X8Z9X0Z0Q7X8Z9X0Z0QHaLH?rs=1&pid=ImgDetMain" },
      ],
      availability: [
        { start: "2025-03-19T09:00", end: "2025-03-20T17:00" },
        { start: "2025-03-24T08:00", end: "2025-03-24T16:00" },
        { start: "2025-03-29T10:00", end: "2025-03-29T18:00" },
      ],
    },
  ];

  const [rentalPeriod, setRentalPeriod] = useState({
    dateStart: "",
    dateEnd: "",
    startTime: "",
    endTime: "",
  });
  const [searchCharacter, setSearchCharacter] = useState("");
  const [filteredCosplayers, setFilteredCosplayers] = useState(cosplayers);
  const [selectedCosplayer, setSelectedCosplayer] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [contract, setContract] = useState([]);
  const [error, setError] = useState("");

  const dateStartRef = useRef(null);
  const dateEndRef = useRef(null);
  const timeStartRef = useRef(null);
  const timeEndRef = useRef(null);

  // Check availability based on rental period
  const isCosplayerAvailable = (cosplayer, period) => {
    const { dateStart, dateEnd, startTime, endTime } = period;

    // If no dates are selected, consider available
    if (!dateStart || !dateEnd) return true;

    const requestedStartDate = new Date(dateStart);
    const requestedEndDate = new Date(dateEnd);

    // If only dates are selected (no time)
    if (!startTime || !endTime) {
      return cosplayer.availability.some((slot) => {
        const slotStart = new Date(slot.start.split("T")[0]); // Only take date
        const slotEnd = new Date(slot.end.split("T")[0]);     // Only take date
        return requestedStartDate <= slotEnd && requestedEndDate >= slotStart;
      });
    }

    // If both date and time are selected
    const requestedStart = new Date(`${dateStart}T${startTime}`);
    const requestedEnd = new Date(`${dateEnd}T${endTime}`);

    return cosplayer.availability.some((slot) => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return requestedStart <= slotEnd && requestedEnd >= slotStart;
    });
  };

  // Normalize string for search (remove hyphens, lowercase)
  const normalizeString = (str) => str.replace(/-/g, "").toLowerCase();

  // Filter cosplayers with enhanced logic and partial availability feedback
  const handleFilterCosplayers = (updatedPeriod = rentalPeriod) => {
    let result = cosplayers;

    // Step 1: Filter by character search (if provided)
    if (searchCharacter.trim()) {
      result = result.filter((cosplayer) =>
        cosplayer.characters.some((char) =>
          normalizeString(char.name).includes(normalizeString(searchCharacter))
        )
      );
    }

    // Step 2: Filter by time availability (if dates are provided)
    if (updatedPeriod.dateStart && updatedPeriod.dateEnd) {
      const requestedStartDate = new Date(updatedPeriod.dateStart);
      const requestedEndDate = new Date(updatedPeriod.dateEnd);
      result = result.map((cosplayer) => {
        const availableSlots = cosplayer.availability.filter((slot) => {
          const slotStart = new Date(slot.start.split("T")[0]);
          const slotEnd = new Date(slot.end.split("T")[0]);
          return requestedStartDate <= slotEnd && requestedEndDate >= slotStart;
        });

        // If there is at least one overlapping slot, consider available
        if (availableSlots.length > 0) {
          return { ...cosplayer, partialAvailability: availableSlots };
        }
        return null;
      }).filter((cosplayer) => cosplayer !== null); // Remove unavailable cosplayers
    }

    setFilteredCosplayers(result);
    if (selectedCosplayer && !result.some((c) => c.id === selectedCosplayer.id)) {
      setSelectedCosplayer(null);
      setSelectedCharacter(null);
    }
  };

  // Handle rental period input
  const handleRentalPeriodChange = (e) => {
    const { name, value } = e.target;
    setRentalPeriod((prev) => {
      const updatedPeriod = { ...prev, [name]: value };
      handleFilterCosplayers(updatedPeriod); // Update filter immediately
      return updatedPeriod;
    });
  };

  // Handle character search input
  const handleSearchCharacter = (e) => {
    setSearchCharacter(e.target.value);
    handleFilterCosplayers();
  };

  // Handle cosplayer selection
  const handleCosplayerSelect = (cosplayer) => {
    setSelectedCosplayer(cosplayer);
    setSelectedCharacter(null);
    setError("");
  };

  // Handle character selection
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setError("");
  };

  // Trigger date/time picker
  const handleDateTimeClick = (ref) => {
    if (ref.current) ref.current.showPicker();
  };

  // Add to contract with validation
  const handleAddContract = () => {
    if (!rentalPeriod.dateStart || !rentalPeriod.dateEnd || !rentalPeriod.startTime || !rentalPeriod.endTime) {
      Toastify({
        text: "Please select the full rental date and time!",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#dc3545",
        className: "toastify-error",
      }).showToast();
      return;
    }

    if (!selectedCosplayer || !selectedCharacter) {
      setError("Please select a cosplayer and character!");
      return;
    }

    const requestedStart = new Date(`${rentalPeriod.dateStart}T${rentalPeriod.startTime}`);
    const requestedEnd = new Date(`${rentalPeriod.dateEnd}T${rentalPeriod.endTime}`);
    if (requestedEnd <= requestedStart) {
      setError("End time must be after start time!");
      return;
    }

    if (!isCosplayerAvailable(selectedCosplayer, rentalPeriod)) {
      setError("Cosplayer is not available during this time period!");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      Toastify({
        text: "Please log in to create a contract!",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#dc3545",
        className: "toastify-error",
      }).showToast();
      return;
    }

    const newContract = {
      cosplayer: selectedCosplayer.name,
      character: selectedCharacter.name,
      dateStart: rentalPeriod.dateStart,
      dateEnd: rentalPeriod.dateEnd,
      startTime: rentalPeriod.startTime,
      endTime: rentalPeriod.endTime,
    };
    setContract([...contract, newContract]);
    setSelectedCosplayer(null);
    setSelectedCharacter(null);
    setError("");
  };

  const isTimeDisabled = !rentalPeriod.dateStart || !rentalPeriod.dateEnd;

  return (
    <div className="cosplay-rental-page min-vh-100">
      <div className="hero-section text-black py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Cosplayer Rental</h1>
          <p className="lead text-center mt-3">
            Book your favorite cosplayers for events
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Filter Section */}
        <Row className="mb-5 filter-section">
          <Col md={6}>
            <h3 className="section-title">Filter by Schedule</h3>
            <Card className="filter-card">
              <Card.Body>
                <Form>
                  <div className="d-flex gap-3 mb-3">
                    <Form.Group className="flex-grow-1">
                      <Form.Label>Date Start</Form.Label>
                      <div
                        className="datetime-wrapper"
                        onClick={() => handleDateTimeClick(dateStartRef)}
                      >
                        <Form.Control
                          ref={dateStartRef}
                          type="date"
                          name="dateStart"
                          value={rentalPeriod.dateStart}
                          onChange={handleRentalPeriodChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="flex-grow-1">
                      <Form.Label>Date End</Form.Label>
                      <div
                        className="datetime-wrapper"
                        onClick={() => handleDateTimeClick(dateEndRef)}
                      >
                        <Form.Control
                          ref={dateEndRef}
                          type="date"
                          name="dateEnd"
                          value={rentalPeriod.dateEnd}
                          onChange={handleRentalPeriodChange}
                          min={rentalPeriod.dateStart || new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="d-flex gap-3 mb-3">
                    <Form.Group className="flex-grow-1">
                      <Form.Label>Start Time</Form.Label>
                      <div
                        className="datetime-wrapper"
                        onClick={() => !isTimeDisabled && handleDateTimeClick(timeStartRef)}
                      >
                        <Form.Control
                          ref={timeStartRef}
                          type="time"
                          name="startTime"
                          value={rentalPeriod.startTime}
                          onChange={handleRentalPeriodChange}
                          disabled={isTimeDisabled}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="flex-grow-1">
                      <Form.Label>End Time</Form.Label>
                      <div
                        className="datetime-wrapper"
                        onClick={() => !isTimeDisabled && handleDateTimeClick(timeEndRef)}
                      >
                        <Form.Control
                          ref={timeEndRef}
                          type="time"
                          name="endTime"
                          value={rentalPeriod.endTime}
                          onChange={handleRentalPeriodChange}
                          disabled={isTimeDisabled}
                        />
                      </div>
                    </Form.Group>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <h3 className="section-title">Search by Character</h3>
            <Card className="filter-card">
              <Card.Body>
                <InputGroup>
                  <InputGroup.Text>
                    <Search size={20} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search for a character (e.g., Spider Man)"
                    value={searchCharacter}
                    onChange={handleSearchCharacter}
                  />
                </InputGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Cosplayer List */}
        <Row className="mb-5">
          <Col>
            <h3 className="section-title">Available Cosplayers</h3>
            <ListGroup className="cosplayer-list">
              {filteredCosplayers.length > 0 ? (
                filteredCosplayers.map((cosplayer) => (
                  <ListGroup.Item
                    key={cosplayer.id}
                    action
                    onClick={() => handleCosplayerSelect(cosplayer)}
                    active={selectedCosplayer?.id === cosplayer.id}
                    className="cosplayer-item"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={cosplayer.avatar}
                        alt={cosplayer.name}
                        className="cosplayer-avatar"
                      />
                      <div className="ms-3 flex-grow-1">
                        <h5 className="mb-1">{cosplayer.name}</h5>
                        <p className="mb-0 text-muted">{cosplayer.description}</p>
                        <p className="mb-0 text-muted">
                          <strong>Characters:</strong>{" "}
                          {cosplayer.characters.map((c) => c.name).join(", ")}
                        </p>
                      </div>
                      <Badge bg="primary" className="select-badge">
                        {selectedCosplayer?.id === cosplayer.id ? "Selected" : "Select"}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <Alert variant="info">No cosplayers match your filters.</Alert>
              )}
            </ListGroup>
            {filteredCosplayers.length > 0 && filteredCosplayers.some((c) => c.partialAvailability && c.partialAvailability.length < c.availability.length) && (
              <Alert variant="warning" className="mt-3">
                Note: Some cosplayers are only partially available during your selected time period. Please review carefully!
              </Alert>
            )}
          </Col>
        </Row>

        {/* Character Selection */}
        {selectedCosplayer && (
          <Row className="mb-5">
            <Col>
              <h3 className="section-title">Select Character</h3>
              <Card className="character-selection-card">
                <Card.Body>
                  <div className="character-grid">
                    {selectedCosplayer.characters.map((character) => (
                      <div key={character.name} className="character-card-wrapper">
                        <Card
                          className={`character-card ${selectedCharacter?.name === character.name ? "selected" : ""}`}
                          onClick={() => handleCharacterSelect(character)}
                        >
                          <div className="character-image-container">
                            <Card.Img
                              src={character.image}
                              alt={character.name}
                              className="character-image"
                            />
                          </div>
                          <Card.Body className="d-flex flex-column justify-content-end text-center">
                            <Card.Title>{character.name}</Card.Title>
                            <Badge
                              bg={
                                selectedCharacter?.name === character.name ? "primary" : "success"
                              }
                              className="status-badge mt-2"
                            >
                              {selectedCharacter?.name === character.name ? "Selected" : "Available"}
                            </Badge>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleAddContract}
                    className="mt-4 w-100 add-to-contract-btn"
                  >
                    Add to Contract
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Error Message */}
        {error && (
          <Row className="mb-5">
            <Col>
              <Alert variant="warning">{error}</Alert>
            </Col>
          </Row>
        )}

        {/* Contracts */}
        {contract.length > 0 && (
          <Row>
            <Col>
              <h3 className="section-title">Your Contracts</h3>
              <div className="contract-list">
                {contract.map((item, index) => (
                  <Card key={index} className="contract-card mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Title>{item.cosplayer}</Card.Title>
                          <Card.Text>
                            <strong>Character:</strong> {item.character}
                            <br />
                            <strong>Time:</strong> {item.dateStart} {item.startTime} -{" "}
                            {item.dateEnd} {item.endTime}
                          </Card.Text>
                        </div>
                        <Badge bg="success">Confirmed</Badge>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CosplayerPage;