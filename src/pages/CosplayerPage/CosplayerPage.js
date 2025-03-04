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
// } from "react-bootstrap";
// import "../../styles/CosplayerPage.scss";

// const CosplayerPage = () => {
//   return (
//     <div className="costume-rental-page min-vh-100">
//       <div className="hero-section text-white py-5">
//         <div className="container">
//           <h1 className="display-4 fw-bold text-center">Cosplayer Rental</h1>
//           <p className="lead text-center mt-3">
//             Find and rent cosplayer you love.
//           </p>
//         </div>
//       </div>

//     </div>
//   );
// };
// export default CosplayerPage;
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ListGroup,
  Alert,
} from "react-bootstrap";
import "../../styles/CosplayerPage.scss";

const CosplayerPage = () => {
  // Sample data for cosplayers and costumes
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
    date: "",
    startTime: "",
    endTime: "",
  });
  const [contract, setContract] = useState([]);
  const [error, setError] = useState("");

  // Handle cosplayer selection
  const handleCosplayerSelect = (cosplayer) => {
    setSelectedCosplayer(cosplayer);
    setSelectedCostume(null);
    setRentalType(null);
    setRentalPeriod({ date: "", startTime: "", endTime: "" });
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

  // Create contract
  const handleAddContract = () => {
    if (
      !selectedCosplayer ||
      !rentalType ||
      !rentalPeriod.date ||
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
    const newContract = {
      cosplayer: selectedCosplayer.name,
      costume: selectedCostume
        ? selectedCostume.name
        : "No costume (to be prepared)",
      rentalType,
      ...rentalPeriod,
    };
    setContract([...contract, newContract]);
    setSelectedCosplayer(null);
    setSelectedCostume(null);
    setRentalType(null);
    setRentalPeriod({ date: "", startTime: "", endTime: "" });
    setError("");
  };

  return (
    <div className="costume-rental-page min-vh-100">
      <div className="hero-section text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center text-purple-500">
            Cosplayer Rental
          </h1>
          <p className="lead text-center mt-3">
            Find and rent cosplayers you love.
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {/* Cosplayer Selection */}
        <Row className="mb-4">
          <Col>
            <h3 className="text-white">Select a Cosplayer</h3>
            <ListGroup>
              {cosplayers.map((cosplayer) => (
                <ListGroup.Item
                  key={cosplayer.id}
                  action
                  onClick={() => handleCosplayerSelect(cosplayer)}
                  active={selectedCosplayer?.id === cosplayer.id}
                  className="d-flex align-items-center p-3"
                >
                  <img
                    src={cosplayer.avatar}
                    alt={cosplayer.name}
                    className="rounded-circle me-3"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div>
                    <h5>{cosplayer.name}</h5>
                    <p className="mb-0 text-muted">{cosplayer.description}</p>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>

        {/* Costumes Selection (if cosplayer selected) */}
        {selectedCosplayer && (
          <Row className="mb-4">
            <Col>
              <h3 className="text-white">Select Cosplayed Costumes</h3>
              <ListGroup>
                {costumes[selectedCosplayer.id].map((costume) => (
                  <ListGroup.Item
                    key={costume.id}
                    action
                    onClick={() => handleCostumeSelect(costume)}
                    active={selectedCostume?.id === costume.id}
                    className="d-flex align-items-center p-3"
                  >
                    <img
                      src={costume.image}
                      alt={costume.name}
                      className="me-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h5>{costume.name}</h5>
                      <p className="mb-0 text-muted">
                        {costume.available ? "Available" : "Not Available"}
                      </p>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        )}

        {/* Rental Type Selection */}
        {selectedCosplayer && (
          <Row className="mb-4">
            <Col>
              <h3 className="text-white">Select Rental Type</h3>
              <Form>
                <Form.Check
                  type="radio"
                  id="rentalType1"
                  label="Rent a cosplayer with available costumes"
                  name="rentalType"
                  onChange={() => handleRentalTypeSelect(1)}
                  checked={rentalType === 1}
                />
                <Form.Check
                  type="radio"
                  id="rentalType2"
                  label="Rent a cosplayer without available costumes"
                  name="rentalType"
                  onChange={() => handleRentalTypeSelect(2)}
                  checked={rentalType === 2}
                />
              </Form>
            </Col>
          </Row>
        )}

        {/* Rental Period Selection */}
        {rentalType && (
          <Row className="mb-4">
            <Col>
              <h3 className="text-white">Select Rental Period</h3>
              <Form>
                <Form.Group controlId="formDate" className="mb-3">
                  <Form.Label className="text-white">Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={rentalPeriod.date}
                    onChange={handleRentalPeriodChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formStartTime" className="mb-3">
                  <Form.Label className="text-white">Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="startTime"
                    value={rentalPeriod.startTime}
                    onChange={handleRentalPeriodChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEndTime" className="mb-3">
                  <Form.Label className="text-white">End Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="endTime"
                    value={rentalPeriod.endTime}
                    onChange={handleRentalPeriodChange}
                    required
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
        )}

        {/* Error/Notification */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert
                variant="warning"
                dangerouslySetInnerHTML={{ __html: error }}
              />
            </Col>
          </Row>
        )}

        {/* Create Contract Button */}
        {rentalType && (
          <Row className="mb-4">
            <Col className="text-center">
              <Button variant="primary" onClick={handleAddContract} size="lg">
                Add to Contract
              </Button>
            </Col>
          </Row>
        )}

        {/* Display Contracts */}
        {contract.length > 0 && (
          <Row>
            <Col>
              <h3 className="text-white">Your Contracts</h3>
              <ListGroup>
                {contract.map((item, index) => (
                  <ListGroup.Item key={index} className="p-3">
                    <h5>{item.cosplayer}</h5>
                    <p>Costume: {item.costume}</p>
                    <p>
                      Rental Type:{" "}
                      {item.rentalType === 1
                        ? "With costumes"
                        : "Without costumes"}
                    </p>
                    <p>
                      Date: {item.date}, {item.startTime} - {item.endTime}
                    </p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default CosplayerPage;
