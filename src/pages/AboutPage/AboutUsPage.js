import { Award, Users, Star } from "lucide-react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";

const AboutPage = (props) => {
  return (
    <div className="homepage min-vh-100 bg-light">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold text-center">About Us</h1>
          <p className="lead text-center mt-3">
            Explore our story
          </p>
        </Container>
      </div>

      {/* Stats Section */}
      <Container className="py-5">
        <Row className="g-4 text-center">
          {stats.map((stat) => (
            <Col md={4} key={stat.label}>
              <Card className="p-4 shadow-sm">
                <stat.icon className="text-primary mb-3" size={48} />
                <h2 className="display-6 fw-bold">{stat.value}</h2>
                <p className="text-muted">{stat.label}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Our Story */}
      <Container className="py-5 bg-white">
        <Row className="align-items-center g-4">
          <Col md={6}>
            <Image
              src="https://thumbs.dreamstime.com/b/our-story-comic-book-style-words-vector-illustrated-phrase-abstract-background-132419729.jpg"
              alt="Our Story"
              fluid
              rounded
              className="shadow-lg"
            />
          </Col>
          <Col md={6}>
            <h2 className="fw-bold">Our Story</h2>
            <p>
              Founded in 2020, CosplayVerse started as a small group of
              passionate cosplayers who wanted to share their love for bringing
              fictional characters to life.
            </p>
            <p>
              What began as a hobby quickly grew into a professional service,
              helping events, parties, and individual clients experience the
              magic of cosplay.
            </p>
            <p>
              Today, we're proud to be one of the leading cosplay service
              providers, with a team of talented cosplayers and an extensive
              collection of high-quality costumes.
            </p>
          </Col>
        </Row>
      </Container>

      {/* Team Section */}
      <Container className="py-5">
        <h2 className="text-center fw-bold mb-5">Our Team</h2>
        <Row className="g-4">
          {team.map((member) => (
            <Col md={4} key={member.name}>
              <Card className="shadow-sm h-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="w-100 h-100"
                  fluid
                />
                <Card.Body>
                  <Card.Title className="fw-bold">{member.name}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">
                    {member.role}
                  </Card.Subtitle>
                  <Card.Text>{member.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};
const stats = [
  {
    value: "500+",
    label: "Events Completed",
    icon: Award,
  },
  {
    value: "50+",
    label: "Professional Cosplayers",
    icon: Users,
  },
  {
    value: "1000+",
    label: "Happy Clients",
    icon: Star,
  },
];

const team = [
  {
    name: "Sarah Chen",
    role: "Lead Cosplayer & Founder",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    description:
      "Professional cosplayer with 10+ years of experience in character portrayal and costume design.",
  },
  {
    name: "Michael Rodriguez",
    role: "Event Director",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    description:
      "Expert in organizing large-scale cosplay events and managing client relationships.",
  },
  {
    name: "Yuki Tanaka",
    role: "Costume Designer",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=800",
    description:
      "Award-winning costume designer specializing in anime and video game character adaptations.",
  },
];
export default AboutPage;
