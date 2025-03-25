import { Users, Calendar, ShoppingBag } from "lucide-react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom"; // Added Link import
import "../../styles/HomePage.scss";

const ServicesPage = (props) => {
  return (
    <div className="homepage min-vh-100 bg-light">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <Container>
          <h1 className="hero-title">Our Services</h1>
          <p className="hero-subtitle">
            Professional cosplay services for events & more
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
              <Link to={service.link}> {/* Added Link wrapper */}
                <Button
                  variant="primary"
                  size="lg"
                  style={{
                    background: "linear-gradient(135deg, #510545, #22668a)",
                    border: "none",
                    color: "white",
                    fontWeight: "bold",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => (e.target.style.opacity = "0.8")}
                  onMouseOut={(e) => (e.target.style.opacity = "1")}
                >
                  Explore Now!
                </Button>
              </Link>
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
    title: "Engage Cosplayers",
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
    link: "/cosplayers", // Links to CosplayersPage.js
  },
  {
    id: "event-organization",
    title: "Event Organization",
    description:
      "Seamlessly plan and execute unforgettable events with our professional event organization services.",
    image:
      "https://cybershow.vn/wp-content/uploads/2018/10/le-hoi-hoa-trang-halloween-640x480.jpg",
    icon: ShoppingBag,
    features: [
      "Comprehensive Planning: From concept to execution.",
      "Customized Experience: Tailored to your needs and vision.",
      "Seamless Coordination: Vendors, logistics, and schedules handled.",
      "Engaging Activities: Create memorable experiences for attendees.",
      "Professional Management: Ensuring a smooth and successful event.",
    ],
    link: "/event", // Links to DetailEventOrganizationPage.js
  },
  {
    id: "costume-rental",
    title: "Costume Rental",
    description:
      "Access our extensive collection of high-quality cosplay costumes. Perfect for conventions, photoshoots, or special events.",
    image:
      "https://cdn11.bigcommerce.com/s-benuoohm6l/images/stencil/original/image-manager/web-banner-min.jpg?t=1706043818",
    icon: ShoppingBag,
    features: [
      "Wide selection of costumes and sizes",
      "Professional-grade quality",
      "Accessories and props included",
      "Flexible rental periods",
      "Cleaning and maintenance service",
    ],
    link: "/costumes", // Links to CostumesPage.js
  },
  {
    id: "event-registration",
    title: "Dive Into Festival Fun",
    description:
      "Buy a ticket to meet your idol! Sign up for a photo and autograph session and create lasting memories. ",
    image:
      "https://mcdn.coolmate.me/image/May2022/top-le-hoi-cosplay-festival-noi-tieng_735.jpg",
    icon: ShoppingBag,
    features: [
      "Personal Interaction: Meet your idol face-to-face",
      "Unique Keepsake: Get a personalized autograph.",
      "Professional Photo: Capture the special moment.",
      "Fun Experience: Enjoy an unforgettable event.",
      "Fan Community: Connect with like-minded fans",
    ],
    link: "/festivals", // Links to FestivalsPage.js
  },
  {
    id: "selling-souvenirs",
    title: "Shop For Souvenirs",
    description:
      "Take home a piece of the magic! Our souvenirs offer lasting memories of your favorite moments.",
    image:
      "https://theportablewife.com/wp-content/uploads/best-souvenirs-from-japan-figures.jpg",
    icon: ShoppingBag,
    features: [
      "Enjoy unique collectibles",
      "Quality craftsmanship",
      "Professional Photo: Capture the special moment.",
      "Perfect gifts",
      "Tangible reminders of joy!",
    ],
    link: "/souvenirs-shop", // Links to SouvenirsPage.js
  },
];

export default ServicesPage;