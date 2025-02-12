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
      "https://cdn11.bigcommerce.com/s-benuoohm6l/images/stencil/original/image-manager/web-banner-min.jpg?t=1706043818",
    icon: ShoppingBag,
    features: [
      "Wide selection of costumes and sizes",
      "Professional-grade quality",
      "Accessories and props included",
      "Flexible rental periods",
      "Cleaning and maintenance service",
    ],
  },
  {
    id: "Sign up for photo and autograph session",
    title: "Sign up for photo and autograph session",
    description:
      "Meet your idol! Sign up for a photo and autograph session and create lasting memories. ",
    image:
      "https://th.bing.com/th/id/R.e9cb89c4dfc29ac0733aac974bd733ae?rik=WDeiYtIE7BvK%2bA&riu=http%3a%2f%2fwww.anime-expo.org%2fwp-content%2fuploads%2f2017%2f08%2fAnime-Expo-Los-Angeles-Anime-Convention-Fan-Panel-Kobayashi-Maid-Dragon-2.png&ehk=jB4xHYQ%2bdg7LIzoodLWvqNJ%2bpWSJlFqUEd8RYPN1VfI%3d&risl=&pid=ImgRaw&r=0",
    icon: ShoppingBag,
    features: [
      "Personal Interaction: Meet your idol face-to-face",
      "Unique Keepsake: Get a personalized autograph.",
      "Professional Photo: Capture the special moment.",
      "Fun Experience: Enjoy an unforgettable event.",
      "Fan Community: Connect with like-minded fans",
    ],
  },
  {
    id: "Selling Souvenirs",
    title: "Selling Souvenirs",
    description:
      "Take home a piece of the magic! Our souvenirs offer lasting memories of your favorite moments.",
    image:
      "https://i.pinimg.com/originals/fa/c3/d3/fac3d32c173b45f909bdfafb42369d49.jpg",
    icon: ShoppingBag,
    features: [
      "Enjoy unique collectibles",
      "Quality craftsmanship",
      "Professional Photo: Capture the special moment.",
      "Perfect gifts",
      "Tangible reminders of joy!",
    ],
  },
];
export default ServicesPage;
