import React from "react";
import { Card, Row, Col } from "react-bootstrap"; // React Bootstrap
import { Tag } from "antd"; // Ant Design
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "../styles/EventPage.scss"; // Optional SCSS file for additional styling
import { Button, Container } from "react-bootstrap";

const mockEvents = [
  {
    Name: "Halloween Party",
    Image:
      "https://th.bing.com/th/id/OIP.V5CwCp09fB_wbbqTz_or6AHaE8?rs=1&pid=ImgDetMain",
    Description: "Join us for a spooky night of cosplay and fun!",
    Type: "Seasonal",
    CreateDate: "2025-02-01",
  },
  {
    Name: "League of Legends Night",
    Image:
      "https://i.pinimg.com/736x/6c/58/12/6c58121c518d0a0c063728fd3fa5fc97--legends-cosplay.jpg",
    Description: "Show off your LOL-inspired cosplay and compete in games!",
    Type: "Gaming",
    CreateDate: "2025-01-15",
  },
  {
    Name: "Grand Opening Celebration",
    Image:
      "https://th.bing.com/th/id/OIP.6Rf1UJBidvTco9ddkyq-gQHaFj?rs=1&pid=ImgDetMain",
    Description: "Celebrate the launch of our new cosplay center!",
    Type: "Opening",
    CreateDate: "2025-01-01",
  },
  {
    Name: "Gaming Expo",
    Image:
      "https://th.bing.com/th/id/OIP.PwM5ggkqisJp03MXkjuGlAHaE7?rs=1&pid=ImgDetMain",
    Description: "Explore the latest in gaming and cosplay trends.",
    Type: "Expo",
    CreateDate: "2025-02-08",
  },
  {
    Name: "Halloween Party",
    Image:
      "https://th.bing.com/th/id/OIP.8XQkZJtoSCV8igQ8ulXENgHaE8?rs=1&pid=ImgDetMain",
    Description: "Join us for a spooky night of cosplay and fun!",
    Type: "Seasonal",
    CreateDate: "2025-02-01",
  },
  {
    Name: "League of Legends Night",
    Image:
      "https://i.pinimg.com/736x/6c/58/12/6c58121c518d0a0c063728fd3fa5fc97--legends-cosplay.jpg",
    Description: "Show off your LOL-inspired cosplay and compete in games!",
    Type: "Gaming",
    CreateDate: "2025-01-15",
  },
  {
    Name: "Grand Opening Celebration",
    Image:
      "https://synuma.com/wp-content/uploads/2020/12/shutterstock_1114217525.jpg",
    Description: "Celebrate the launch of our new cosplay center!",
    Type: "Opening",
    CreateDate: "2025-01-01",
  },
  {
    Name: "Gaming Expo",
    Image:
      "https://i.pinimg.com/736x/6c/58/12/6c58121c518d0a0c063728fd3fa5fc97--legends-cosplay.jpg",
    Description: "Explore the latest in gaming and cosplay trends.",
    Type: "Expo",
    CreateDate: "2025-02-08",
  },
];

const EventPage = () => {
  return (
    <div>
      <div className="hero-section bg-primary text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Our Events</h1>
          <p className="lead text-center mt-3">
            Professional cosplay services for events, photoshoots, and more
          </p>
        </Container>
      </div>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        {/* Event Cards */}
        <Row className="gap-y-6 abc">
          {mockEvents.map((event, index) => (
            <Col
              key={index}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="d-flex justify-content-center"
            >
              <Card className="event-card shadow-lg rounded-lg">
                <Card.Img
                  variant="top"
                  src={event.Image}
                  className="event-image"
                  alt={event.Name}
                />
                <Card.Body>
                  <Card.Title className="font-bold text-xl text-purple-900">
                    {event.Name}
                  </Card.Title>
                  <Card.Text className="text-gray-700 mb-3">
                    {event.Description}
                  </Card.Text>
                  <div className="flex items-center justify-between">
                    <Tag color="purple">{event.Type}</Tag>
                    <span className="text-sm text-gray-500">
                      {new Date(event.CreateDate).toLocaleDateString()}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default EventPage;
