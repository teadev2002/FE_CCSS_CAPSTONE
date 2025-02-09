import { Users, Calendar, ShoppingBag } from "lucide-react";
import { Button, Container, Row, Col } from "react-bootstrap";

const ServicesPage = (props) => {
  return (
    <div className="homepage min-vh-100 bg-light">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">Our Services</h1>
          <p className="lead text-center mt-3">
            Professional cosplay services for events, photoshoots, and more
          </p>
        </Container>
      </div>

      {/* Services */}
      <Container className="py-5">
        {services.map((service, index) => (
          <Row
            className={`align-items-center mb-5 ${
              index % 2 !== 0 ? "flex-row-reverse" : ""
            }`}
            key={service.id}
          >
            <Col md={6}>
              <img
                src={service.image}
                alt={service.title}
                className="img-fluid rounded shadow"
              />
            </Col>
            <Col md={6}>
              <h2 className="fw-bold text-black mb-4">{service.title}</h2>
              <p className="text-muted mb-4">{service.description}</p>
              <ul className="list-unstyled mb-4">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="d-flex align-items-center mb-2">
                    <span className="bullet bg-primary me-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="primary" size="lg">
                Book Now
              </Button>
            </Col>
          </Row>
        ))}
      </Container>
    </div>
  );
};
const services = [
  {
    id: "cosplayer-hire",
    title: "Hire a Cosplayer",
    description:
      "Book professional cosplayers for your events, parties, or photoshoots. Our talented team brings your favorite characters to life with authentic costumes and performances.",
    image:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/32800f52-9ff0-415b-aea3-ed9bb294fc29/dfw4tz1-74e795d3-7cc7-45e3-ae6d-e5eefc7796dc.jpg/v1/fill/w_1280,h_854,q_75,strp/honkai_star_rail_march_7_cosplay_by_daria_lazur_dfw4tz1-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODU0IiwicGF0aCI6IlwvZlwvMzI4MDBmNTItOWZmMC00MTViLWFlYTMtZWQ5YmIyOTRmYzI5XC9kZnc0dHoxLTc0ZTc5NWQzLTdjYzctNDVlMy1hZTZkLWU1ZWVmYzc3OTZkYy5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.PINnTXoW_zzgwLSW5oqqX1bHFwHotUZQd9yeBozPeTU",
    icon: Users,
    features: [
      "Professional cosplayers with years of experience",
      "Authentic costumes and props",
      "Character-accurate performances",
      "Available for events, parties, and photoshoots",
      "Flexible booking options",
    ],
  },
  {
    id: "costume-rental",
    title: "Costume Rental",
    description:
      "Access our extensive collection of high-quality cosplay costumes. Perfect for conventions, photoshoots, or special events.",
    image:
      "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&q=80&w=800",
    icon: ShoppingBag,
    features: [
      "Wide selection of costumes and sizes",
      "Professional-grade quality",
      "Accessories and props included",
      "Flexible rental periods",
      "Cleaning and maintenance service",
    ],
  },
];
export default ServicesPage;
