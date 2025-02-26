import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const ContactPage = (props) => {
  return (
    <div className="homepage min-vh-100 bg-light">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Contact</h1>
          <p className="lead text-center mt-3">
          Need support? Don't hesitate to send our team a message! 
          </p>
        </Container>
      </div>

      {/* Contact Information */}
      <Container className="py-5">
        <Row className="g-4">
          {/* Contact Form */}
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="h4 fw-bold mb-4">Send us a Message</h2>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Your Name"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Your Email"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control type="text" placeholder="Subject" required />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Your Message"
                      required
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 d-flex align-items-center justify-content-center"
                  >
                    <Send className="me-2" size={20} />
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Contact Details */}
          <Col md={6}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h2 className="h4 fw-bold mb-4">Contact Information</h2>
                <div className="d-flex mb-3">
                  <MapPin className="text-primary me-3" size={24} />
                  <div>
                    <h5 className="mb-1">Address</h5>
                    <p className="text-muted mb-0">
                      123 Cosplay Street
                      <br />
                      District 1<br />
                      Ho Chi Minh City
                    </p>
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <Phone className="text-primary me-3" size={24} />
                  <div>
                    <h5 className="mb-1">Phone</h5>
                    <p className="text-muted mb-0">+84 123 456 789</p>
                  </div>
                </div>
                <div className="d-flex mb-3">
                  <Mail className="text-primary me-3" size={24} />
                  <div>
                    <h5 className="mb-1">Email</h5>
                    <p className="text-muted mb-0">contact@cosplayverse.com</p>
                  </div>
                </div>
                <div className="d-flex">
                  <Clock className="text-primary me-3" size={24} />
                  <div>
                    <h5 className="mb-1">Opening Hours</h5>
                    <p className="text-muted mb-0">
                      Monday - Friday: 9:00 AM - 8:00 PM
                      <br />
                      Saturday: 10:00 AM - 6:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Map Section */}
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="h4 fw-bold mb-4">Location</h2>
                <div className="ratio ratio-16x9">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197956!2d106.69886867465353!3d10.775892989376153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a9d8d1bb3%3A0xd3108d3f3d4f4d68!2sDistrict%201%2C%20Ho%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v1709799046159!5m2!1sen!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="CosplayVerse Location"
                  ></iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default ContactPage;
