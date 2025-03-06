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
} from "react-bootstrap";
import "../../styles/CosplayerPage.scss";

const CosplayerPage = () => {
  const cosplayers = [
    {
      id: 1,
      name: "Luna Star",
      avatar:
        "https://images.pexels.com/photos/19231454/pexels-photo-19231454/free-photo-of-girl-in-anya-forger-costume.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      description:
        "Experienced cosplayer specializing in anime and fantasy characters.",
    },
    {
      id: 2,
      name: "Kai Blade",
      avatar:
        "https://gambar.sgp1.digitaloceanspaces.com/wp-content/uploads/2021/02/kameaam.jpg",
      description: "Dynamic cosplayer known for superhero and sci-fi roles.",
    },
    {
      id: 3,
      name: "Mika Moon",
      avatar:
        "https://th.bing.com/th/id/OIF.9jqAjB9W9sQhS1bJbUH1sg?rs=1&pid=ImgDetMain",
      description:
        "Talented cosplayer with a focus on historical and mythology themes.",
    },
  ];

  const costumes = {
    1: [
      {
        id: 101,
        name: "Sailor Moon",
        image:
          "https://th.bing.com/th/id/R.068d6e18db88dcfee0c5fef0e7d5f60f?rik=ZpQCwm59LxyECQ&pid=ImgRaw&r=0",
        available: true,
      },
      {
        id: 102,
        name: "Naruto Uzumaki",
        image:
          "https://th.bing.com/th/id/OIP.kN5HWcrqUYMfIVN-rl96ZgHaLH?rs=1&pid=ImgDetMain",
        available: false,
      },
    ],
    2: [
      {
        id: 201,
        name: "Spider-Man",
        image:
          "https://th.bing.com/th/id/OIP.i6zQCyXX6AW0dBvKVx_xkwHaLH?rs=1&pid=ImgDetMain",
        available: true,
      },
      {
        id: 202,
        name: "Iron Man",
        image:
          "https://th.bing.com/th/id/OIP.yYsRMvGWgsdr0FALLzcqNgHaLH?rs=1&pid=ImgDetMain",
        available: false,
      },
    ],
    3: [
      {
        id: 301,
        name: "Cleopatra",
        image:
          "https://th.bing.com/th/id/OIP.hNItRKAu72Yt-X59Vi2DbgHaJQ?rs=1&pid=ImgDetMain",
        available: true,
      },
      {
        id: 302,
        name: "Athena",
        image:
          "https://th.bing.com/th/id/OIP.yaqP-V5Tqj4Wtosp2enD9wHaLH?rs=1&pid=ImgDetMain",
        available: false,
      },
    ],
  };

  const [selectedCosplayer, setSelectedCosplayer] = useState(null);
  const [selectedCostume, setSelectedCostume] = useState(null);
  const [rentalType, setRentalType] = useState(null);
  const [rentalPeriod, setRentalPeriod] = useState({
    dateStart: "",
    dateEnd: "",
    startTime: "",
    endTime: "",
  });
  const [contract, setContract] = useState([]);
  const [error, setError] = useState("");

  // Refs for date/time inputs
  const dateStartRef = useRef(null);
  const dateEndRef = useRef(null);
  const timeStartRef = useRef(null);
  const timeEndRef = useRef(null);

  // Handle cosplayer selection
  const handleCosplayerSelect = (cosplayer) => {
    setSelectedCosplayer(cosplayer);
    setSelectedCostume(null);
    setRentalType(null);
    setRentalPeriod({ dateStart: "", dateEnd: "", startTime: "", endTime: "" });
    setError("");
  };

  // Handle costume selection
  const handleCostumeSelect = (costume) => {
    setSelectedCostume(costume);
    setError("");
  };

  // Handle rental type selection
  const handleRentalTypeSelect = (type) => {
    setRentalType(type);
    if (type === 2 && selectedCosplayer) {
      setError(
        "Please rent costumes for this cosplayer 1 month in advance to prepare. <a href='/costumes'>Click here</a> to view costumes."
      );
    } else {
      setError("");
    }
  };

  // Handle rental period input
  const handleRentalPeriodChange = (e) => {
    const { name, value } = e.target;
    setRentalPeriod({ ...rentalPeriod, [name]: value });
  };

  // Trigger date/time picker on click
  const handleDateTimeClick = (ref) => {
    if (ref.current) {
      ref.current.showPicker(); // Trigger native picker
    }
  };

  // Create contract
  const handleAddContract = () => {
    if (
      !selectedCosplayer ||
      !rentalType ||
      !rentalPeriod.dateStart ||
      !rentalPeriod.dateEnd ||
      !rentalPeriod.startTime ||
      !rentalPeriod.endTime
    ) {
      setError("Please fill in all fields before creating a contract.");
      return;
    }
    if (rentalType === 2 && !selectedCostume) {
      setError("Please select a character for rental type 2.");
      return;
    }
    if (new Date(rentalPeriod.dateEnd) < new Date(rentalPeriod.dateStart)) {
      setError("End date must be equal to or after start date.");
      return;
    }
    const newContract = {
      cosplayer: selectedCosplayer.name,
      costume: selectedCostume
        ? selectedCostume.name
        : "No costume (to be prepared)",
      rentalType,
      dateStart: rentalPeriod.dateStart,
      dateEnd: rentalPeriod.dateEnd,
      startTime: rentalPeriod.startTime,
      endTime: rentalPeriod.endTime,
    };
    setContract([...contract, newContract]);
    setSelectedCosplayer(null);
    setSelectedCostume(null);
    setRentalType(null);
    setRentalPeriod({ dateStart: "", dateEnd: "", startTime: "", endTime: "" });
    setError("");
  };

  return (
    <div className="cosplay-rental-page min-vh-100">
      <div className="hero-section text-black py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Cosplayer Rental</h1>
          <p className="lead text-center mt-3">
            Find and rent cosplayers you love for your events
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Cosplayer Selection */}
        <Row className="mb-5 rental-form-section">
          <Col md={6}>
            <h3 className="text-black mb-4 section-title">Choose Your Cosplayer</h3>
            <ListGroup className="cosplayer-list">
              {cosplayers.map((cosplayer) => (
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
                    </div>
                    <Badge bg="primary" className="select-badge">
                      {selectedCosplayer?.id === cosplayer.id ? "Selected" : "Select"}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>

          {selectedCosplayer && (
            <Col md={6}>
              <h3 className="text-black mb-4 section-title">Costume Selection</h3>
              <Card className="costume-selection-card">
                <Card.Body>
                  <h5>Available Costumes:</h5>
                  <Row xs={1} md={2} className="g-3">
                    {costumes[selectedCosplayer.id].map((costume) => (
                      <Col key={costume.id}>
                        <Card
                          className={`costume-card ${
                            selectedCostume?.id === costume.id ? "selected" : ""
                          } ${!costume.available ? "unavailable" : ""}`}
                          onClick={() => costume.available && handleCostumeSelect(costume)}
                        >
                          <div className="badge-wrapper">
                            <Card.Img variant="top" src={costume.image} />
                            <Badge
                              bg={
                                selectedCostume?.id === costume.id
                                  ? "primary"
                                  : costume.available
                                  ? "success"
                                  : "danger"
                              }
                              className="status-badge"
                            >
                              {selectedCostume?.id === costume.id
                                ? "Selected"
                                : costume.available
                                ? "Available"
                                : "Booked"}
                            </Badge>
                          </div>
                          <Card.Body className="p-2">
                            <Card.Title className="mb-0">{costume.name}</Card.Title>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {/* Rental Schedule */}
        <Row className="mb-3 Rental-Schedule">
          <Col>
            <h3 className="text-black mb-4 section-title">Rental Schedule</h3>
            <Card className="rental-form-card">
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
                          className="dateTime"
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
                          className="dateTime"
                          type="date"
                          name="dateEnd"
                          value={rentalPeriod.dateEnd}
                          onChange={handleRentalPeriodChange}
                          min={
                            rentalPeriod.dateStart ||
                            new Date().toISOString().split("T")[0]
                          }
                        />
                      </div>
                    </Form.Group>
                  </div>

                  <div className="d-flex gap-3 mb-3">
                    <Form.Group className="flex-grow-1">
                      <Form.Label>Start Time</Form.Label>
                      <div
                        className="datetime-wrapper"
                        onClick={() => handleDateTimeClick(timeStartRef)}
                      >
                        <Form.Control
                          ref={timeStartRef}
                          className="dateTime"
                          type="time"
                          name="startTime"
                          value={rentalPeriod.startTime}
                          onChange={handleRentalPeriodChange}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group className="flex-grow-1">
                      <Form.Label>End Time</Form.Label>
                      <div
                        className="datetime-wrapper"
                        onClick={() => handleDateTimeClick(timeEndRef)}
                      >
                        <Form.Control
                          ref={timeEndRef}
                          className="dateTime"
                          type="time"
                          name="endTime"
                          value={rentalPeriod.endTime}
                          onChange={handleRentalPeriodChange}
                        />
                      </div>
                    </Form.Group>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Rental Type</Form.Label>
                    <div className="rental-type-options">
                      <Form.Check
                        type="radio"
                        id="rentalType1"
                        label="With Available Costume"
                        name="rentalType"
                        onChange={() => handleRentalTypeSelect(1)}
                        checked={rentalType === 1}
                      />
                      <Form.Check
                        type="radio"
                        id="rentalType2"
                        label="Custom Costume (1 Month Prep)"
                        name="rentalType"
                        onChange={() => handleRentalTypeSelect(2)}
                        checked={rentalType === 2}
                      />
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    onClick={handleAddContract}
                    className="w-50 mt-3"
                  >
                    Add to Contract
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {error && (
          <Row className="mb-5">
            <Col>
              <Alert variant="warning">
                <div dangerouslySetInnerHTML={{ __html: error }} />
              </Alert>
            </Col>
          </Row>
        )}

        {contract.length > 0 && (
          <Row>
            <Col>
              <h3 className="text-black mb-4 section-title">Your Contracts</h3>
              <div className="contract-list">
                {contract.map((item, index) => (
                  <Card key={index} className="contract-card mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <Card.Title>{item.cosplayer}</Card.Title>
                          <Card.Text>
                            <strong>Costume:</strong> {item.costume}
                            <br />
                            <strong>Type:</strong>{" "}
                            {item.rentalType === 1 ? "With Costume" : "Custom Costume"}
                            <br />
                            <strong>Time:</strong> {item.dateStart} to {item.dateEnd}, {item.startTime} - {item.endTime}
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