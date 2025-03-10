import React, { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  ProgressBar,
} from "react-bootstrap";
import "../../styles/DetailEventOrganizePage.scss";

const DetailEventOrganizePage = () => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCosplayers, setSelectedCosplayers] = useState([]);
  const [manualQuantity, setManualQuantity] = useState(1);
  const [useCosplayerList, setUseCosplayerList] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const events = [
    {
      id: 1,
      name: "Anime Expo 2025",
      location: "Tokyo",
      image:
        "https://th.bing.com/th/id/OIP.asj-kj4fHf687oWpf_5zhQHaEK?rs=1&pid=ImgDetMain",
    },
    {
      id: 2,
      name: "Cosplay Summit",
      location: "Osaka",
      image:
        "https://th.bing.com/th/id/R.2b8cd8f8551cbd30ae16d29a7c653a0d?rik=Kw0NyacA6EzUmA&riu=http%3a%2f%2fasiatrend.org%2fwp-content%2fuploads%2fWCS-3-1024x534.jpg&ehk=%2blJAlmQ8xv%2bo3YGVgKq6FbmuWVUM0DDtxqG6qyxKzaA%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      id: 3,
      name: "Comic Con VN",
      location: "HCMC",
      image:
        "https://th.bing.com/th/id/R.b0a4acf5e7895ebce6d8e57ab7247625?rik=W5b4efrZkMclag&pid=ImgRaw&r=0",
    },
    {
      id: 4,
      name: "Cosplay Carnival",
      location: "Singapore",
      image:
        "https://apicms.thestar.com.my/uploads/images/2022/08/25/1710204.jpg",
    },
    {
      id: 5,
      name: "World Cosplay Championship",
      location: "Nagoya",
      image:
        "https://th.bing.com/th/id/OIP.13RTPeU3DzPb_wcpOx6cRQHaD4?rs=1&pid=ImgDetMain",
    },
    {
      id: 6,
      name: "Vietnam Cosplay Festival",
      location: "Hanoi",
      image:
        "https://th.bing.com/th/id/OIP.piLdTVh9NSMFQqlgUx9IBAHaEK?rs=1&pid=ImgDetMain",
    },
  ];

  const categories = ["Superheroes", "Anime Characters", "Fantasy", "Sci-Fi"];

  const cosplayers = [
    // Superheroes
    {
      id: 1,
      name: "Hana",
      categories: ["Superheroes", "Sci-Fi"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 2,
      name: "Kai",
      categories: ["Superheroes"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 3,
      name: "Miko",
      categories: ["Superheroes", "Anime Characters"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 4,
      name: "Taro",
      categories: ["Superheroes"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 5,
      name: "Sora",
      categories: ["Superheroes", "Fantasy"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },

    // Anime Characters
    {
      id: 6,
      name: "Yuki",
      categories: ["Anime Characters"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 7,
      name: "Riku",
      categories: ["Anime Characters", "Fantasy"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 8,
      name: "Aki",
      categories: ["Anime Characters"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 9,
      name: "Nami",
      categories: ["Anime Characters", "Sci-Fi"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 10,
      name: "Miko",
      categories: ["Superheroes", "Anime Characters"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },

    // Fantasy
    {
      id: 11,
      name: "Rin",
      categories: ["Fantasy"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 12,
      name: "Luna",
      categories: ["Fantasy", "Sci-Fi"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 13,
      name: "Sora",
      categories: ["Superheroes", "Fantasy"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 14,
      name: "Riku",
      categories: ["Anime Characters", "Fantasy"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 15,
      name: "Elara",
      categories: ["Fantasy"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },

    // Sci-Fi
    {
      id: 16,
      name: "Zara",
      categories: ["Sci-Fi"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 17,
      name: "Hana",
      categories: ["Superheroes", "Sci-Fi"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 18,
      name: "Luna",
      categories: ["Fantasy", "Sci-Fi"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 19,
      name: "Nami",
      categories: ["Anime Characters", "Sci-Fi"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
    {
      id: 20,
      name: "Kael",
      categories: ["Sci-Fi"],
      image:
        "https://laforce.vn/wp-content/uploads/2023/08/trang-phuc-cosplay-dep.jpg",
    },
  ];

  const handleNextStep = () => {
    if (step === 1 && !selectedEvent) return alert("Please select an event!");
    if (step === 2 && (!startDate || !startTime || !endDate || !endTime))
      return alert("Please select start and end date/time!");
    if (step === 3 && !selectedCategory)
      return alert("Please select a category!");
    if (step === 4 && selectedCosplayers.length === 0 && manualQuantity < 1)
      return alert("Please select cosplayers or set a quantity!");
    if (step < 5) setStep(step + 1); // Chỉ tăng step nếu chưa đạt 5
    if (step === 4) setShowSummaryModal(true); // Hiển thị modal ở bước 5
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCosplayers = cosplayers.filter((cosplayer) =>
    cosplayer.categories.includes(selectedCategory)
  );

  const getFormattedDateTime = (date, time) => {
    return date && time ? new Date(`${date}T${time}`).toLocaleString() : "N/A";
  };

  return (
    <div className="event-organize-page min-vh-100">
      {/* Hero Section */}
      <div className="hero-section text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Event Organization</h1>
          <p className="lead text-center mt-3">
            Host an event and book your favorite cosplayers!
          </p>
        </Container>
      </div>

      {/* Progress Bar */}
      <Container className="py-4">
        <ProgressBar now={(step / 5) * 100} className="progress-custom" />
        <p className="text-center mt-2">Step {step} of 5</p>
      </Container>

      {/* Steps */}
      <Container className="py-5">
        {step === 1 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select an Event</h2>
            <div className="search-container mb-4">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={20} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Row>
              {filteredEvents.map((event) => (
                <Col md={4} key={event.id}>
                  <Card
                    className={`event-card ${selectedEvent?.id === event.id ? "selected" : ""
                      }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <Card.Img variant="top" src={event.image} />
                    <Card.Body>
                      <Card.Title>{event.name}</Card.Title>
                      <Card.Text>Location: {event.location}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {step === 2 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Choose Date & Time</h2>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Start Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>End Time</Form.Label>
                  <Form.Control
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        )}

        {step === 3 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select Category</h2>
            <ListGroup>
              {categories.map((category) => (
                <ListGroup.Item
                  key={category}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className="category-item"
                >
                  {category}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {step === 4 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Select Characters</h2>
            <Form.Check
              type="switch"
              label={
                useCosplayerList
                  ? "Select from Cosplayer List"
                  : "Set Manual Quantity"
              }
              checked={useCosplayerList}
              onChange={() => setUseCosplayerList(!useCosplayerList)}
              className="mb-4"
            />
            {useCosplayerList ? (
              <Row>
                {filteredCosplayers.map((cosplayer) => (
                  <Col md={4} key={cosplayer.id}>
                    <Card
                      className={`cosplayer-card ${selectedCosplayers.includes(cosplayer) ? "selected" : ""
                        }`}
                      onClick={() => {
                        setSelectedCosplayers((prev) =>
                          prev.includes(cosplayer)
                            ? prev.filter((c) => c.id !== cosplayer.id)
                            : [...prev, cosplayer]
                        );
                      }}
                    >
                      <Card.Img variant="top" src={cosplayer.image} />
                      <Card.Body>
                        <Card.Title>{cosplayer.name}</Card.Title>
                        <div>
                          {cosplayer.categories.map((cat) => (
                            <Badge key={cat} bg="primary" className="me-1">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Form.Group>
                <Form.Label>Number of Cosplayers</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={manualQuantity}
                  onChange={(e) =>
                    setManualQuantity(Math.max(1, e.target.value))
                  }
                />
              </Form.Group>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="step-section fade-in">
            <h2 className="text-center mb-4">Review Your Event</h2>
            <Card>
              <Card.Body>
                <Card.Title>Event Summary</Card.Title>
                <p>
                  <strong>Event:</strong> {selectedEvent?.name}
                </p>
                <p>
                  <strong>Location:</strong> {selectedEvent?.location}
                </p>
                <p>
                  <strong>Start:</strong>{" "}
                  {getFormattedDateTime(startDate, startTime)}
                </p>
                <p>
                  <strong>End:</strong> {getFormattedDateTime(endDate, endTime)}
                </p>
                <p>
                  <strong>Category:</strong> {selectedCategory}
                </p>
                <p>
                  <strong>Cosplayers:</strong>{" "}
                  {useCosplayerList
                    ? selectedCosplayers.map((c) => c.name).join(", ")
                    : manualQuantity}
                </p>
              </Card.Body>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between mt-5">
          {step > 1 && (
            <Button variant="outline-primary" onClick={handlePrevStep}>
              Previous
            </Button>
          )}
          <Button variant="primary" onClick={handleNextStep}>
            {step === 5 ? "Finish" : "Next"} <ChevronRight size={20} />
          </Button>
        </div>
      </Container>

      {/* Summary Modal */}
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
          <h4>Your Event Details</h4>
          <p>
            <strong>Event:</strong> {selectedEvent?.name}
          </p>
          <p>
            <strong>Location:</strong> {selectedEvent?.location}
          </p>
          <p>
            <strong>Start:</strong> {getFormattedDateTime(startDate, startTime)}
          </p>
          <p>
            <strong>End:</strong> {getFormattedDateTime(endDate, endTime)}
          </p>
          <p>
            <strong>Category:</strong> {selectedCategory}
          </p>
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

export default DetailEventOrganizePage;
