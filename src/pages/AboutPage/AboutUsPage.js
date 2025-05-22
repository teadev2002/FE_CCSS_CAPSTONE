import { Award, Users, Star } from "lucide-react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";

const AboutPage = (props) => {
  return (
    <div className="homepage min-vh-100 bg-light">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <Container>
          <h1 className="hero-title fw-bold text-center">About Us</h1>{" "}
          {/* Thay display-4 thành hero-title */}
          <p className="hero-subtitle text-center mt-3">
            {" "}
            {/* Thay lead thành hero-subtitle */}
            Explore our story
          </p>
        </Container>
      </div>

      {/* Team Section */}
      <Container className="py-5">
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
    name: "Trương Tuấn Anh",
    role: "Back-End Developer",
    image:
      "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/323712473_865021424803379_4893583321540411966_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=MTbIBbzZSVAQ7kNvwFfu3p2&_nc_oc=AdkTgkmGAN-_g9NW8GLnEH7l6v853uLopgn7ROpoqfVz2NJ5lsmnwETsXZI460aPGEuZleHUOWZEiPF4j7rqbwwH&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=G6I0OPA_NTCdefVLy1iyLA&oh=00_AfJLBGhQlEaMSfHepAC0i7J_-2t-r8kLpycu3QLRfb_9QQ&oe=6833F067",
    description:
      "Professional cosplayer with 10+ years of experience in character portrayal and costume design.",
  },
  {
    name: "Phạm Lê Nhật Hoàng",
    role: "Back-End Developer",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
    description:
      "Expert in organizing large-scale cosplay events and managing client relationships.",
  },
  {
    name: "Phương Nam",
    role: "Back-End Developer",
    image:
      "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/452999188_1940772089704310_2905097586223524245_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_ohc=4g5AkCFamLcQ7kNvwHtXinD&_nc_oc=Adk7JSYUZN9QzebptQ9_sz1Pp-Go2GLV89GamPZfc37mkiGqGPYn3o29cK44BpexzdOWCYB9_NEVgd3VYzMDrUWb&_nc_zt=24&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=imvsZFGmR3Xy8zvxYQUQNQ&oh=00_AfLV8kr3td4fTGD3Vx7hRSF_T0k8OmplYiBJs3lM-9j4Eg&oe=6833D7CF",
    description:
      "Award-winning costume designer specializing in anime and video game character adaptations.",
  },
  {
    name: "Nguyễn Quốc Việt",
    role: "Front-End Developer",
    image:
      " https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/438276213_2822822611223356_2671771204435566974_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Sc-iKrQ8GnEQ7kNvwGfFKDq&_nc_oc=Admlmt3hvkXM1QEJ0TD1Ek-abN7AozKRvVfj_VZM6MjRmM0RHrdNHv8Fy9fVrUlfa_c72S-_lBP2wK4qfysGKPXi&_nc_zt=23&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=lks0YVp1GH_m7k89wDujXg&oh=00_AfKHVF2P8L3mR7d4iiDleOfSoSw3PV_raupLVseE7WNQrg&oe=6833FF83",
    description:
      "Expert in organizing large-scale cosplay events and managing client relationships.",
  },
  {
    name: "Hoàng Thế Anh",
    role: "Front-End Developer",
    image:
      "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/295565043_1405878849899348_1071422485505945009_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=QJo1QZNbSjUQ7kNvwGfReX_&_nc_oc=AdnkYq8mdY_FS8B-NohuoFIE5i-4N4ox2jyCCTjIusaCEswX14FxgY9rYsXrjThwBfmCSu2gYbzD5B-LlUp_7-Lx&_nc_zt=23&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=HCk-EEKpbwHzRK4UveLmtQ&oh=00_AfKZcPAwr4RRsXhbW9_WH37qLL4kl6l_70q1LXGswTUoUA&oe=6833E168",
    description:
      "Award-winning costume designer specializing in anime and video game character adaptations.",
  },
];
export default AboutPage;
