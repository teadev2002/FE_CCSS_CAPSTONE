// import React, { useState, useRef } from "react";
// import { Search, Upload, ChevronRight } from "lucide-react";
// import { Modal, Button, Form, Carousel } from "react-bootstrap";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   ListGroup,
//   Alert,
//   Badge,
// } from "react-bootstrap";
// import "../../styles/EventOrganizePage.scss";
// const EventOrganizePage = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   return (
//     <div className="EventOrganizePage min-vh-100">
//       {/* Header */}
//       <div className="hero-section text-black py-5">
//         <Container>
//           <h1 className="display-4 fw-bold text-center">Event Organize</h1>
//           <p className="lead text-center mt-3">
//             Create an event and rent cosplayers you love for your events
//           </p>
//         </Container>
//       </div>
//       {/* Search bar */}
//     </div>
//   );
// };

// export default EventOrganizePage;
import React, { useState, useRef } from "react";
import { Search, ChevronRight } from "lucide-react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import "../../styles/EventOrganizePage.scss";

const EventOrganizePage = () => {
  // Mock data cho sự kiện
  const events = [
    {
      id: 1,
      title: "Anime Festival 2025",
      date: "2025-04-15",
      location: "Tokyo Convention Center",
      description:
        "A grand celebration of anime culture with cosplay contests.",
      image:
        "https://images.pexels.com/photos/19231454/pexels-photo-19231454/free-photo-of-girl-in-anya-forger-costume.jpeg",
      status: "Upcoming",
    },
    {
      id: 2,
      title: "Comic Con 2025",
      date: "2025-06-20",
      location: "San Diego, CA",
      description: "The ultimate gathering for comic and superhero fans.",
      image:
        "https://th.bing.com/th/id/OIP.i6zQCyXX6AW0dBvKVx_xkwHaLH?rs=1&pid=ImgDetMain",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Historical Reenactment",
      date: "2025-03-10",
      location: "London, UK",
      description: "Relive history with stunning costumes and performances.",
      image:
        "https://th.bing.com/th/id/OIP.hNItRKAu72Yt-X59Vi2DbgHaJQ?rs=1&pid=ImgDetMain",
      status: "Past",
    },
    {
      id: 4,
      title: "Sci-Fi Expo",
      date: "2025-08-05",
      location: "New York, NY",
      description: "Explore the future with sci-fi cosplays and tech demos.",
      image:
        "https://th.bing.com/th/id/OIP.yYsRMvGWgsdr0FALLzcqNgHaLH?rs=1&pid=ImgDetMain",
      status: "Upcoming",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);

  // Lọc sự kiện dựa trên tìm kiếm
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý thay đổi giá trị tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xử lý nút tìm kiếm
  const handleSearchClick = () => {
    console.log("Searching for:", searchTerm); // Có thể thêm logic tìm kiếm nâng cao
  };

  return (
    <div className="EventOrganizePage min-vh-100">
      {/* Header */}
      <div className="hero-section text-black py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Event Organization</h1>
          <p className="lead text-center mt-3">
            Host an event and book your favorite cosplayers!
          </p>
        </Container>
      </div>

      {/* Search Bar */}
      <Container className="py-4 search-section">
        <Row className="justify-content-center">
          <Col md={8} className="d-flex gap-3">
            <Form.Group className="flex-grow-1 search-wrapper">
              <Form.Control
                ref={searchRef}
                type="text"
                placeholder="Search events by title or description..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
              <Search className="search-icon" size={20} />
            </Form.Group>
            {/* <Button
              variant="primary"
              onClick={handleSearchClick}
              className="search-btn"
            >
              Search
            </Button> */}
          </Col>
        </Row>
      </Container>

      {/* Event List */}
      <Container className="py-5 event-list-section">
        <h3 className="text-black mb-4 section-title">Our Events</h3>
        <Row>
          <Col>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card key={event.id} className="event-card mb-4">
                  <div className="d-flex flex-row">
                    {/* Hình ảnh bên trái */}
                    <div className="event-image-wrapper">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="event-image"
                        loading="lazy" // Lazy loading cho hình ảnh
                      />
                      <Badge
                        bg={
                          event.status === "Upcoming" ? "success" : "secondary"
                        }
                        className="status-badge"
                      >
                        {event.status}
                      </Badge>
                    </div>
                    {/* Thông tin bên phải */}
                    <Card.Body className="event-details">
                      <Card.Title className="mb-2">{event.title}</Card.Title>
                      <Card.Text>
                        <strong>Date:</strong> {event.date} <br />
                        <strong>Location:</strong> {event.location} <br />
                        <strong>Description:</strong> {event.description}
                      </Card.Text>
                      <Button variant="outline-primary" className="details-btn">
                        View Details <ChevronRight size={16} />
                      </Button>
                    </Card.Body>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted">No events found.</p>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EventOrganizePage;
