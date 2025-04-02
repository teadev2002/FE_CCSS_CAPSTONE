import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Row, Col } from "react-bootstrap";
import { Shirt, CalendarDays, Users, ShoppingBag, Ticket } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/HomePage.scss";

const HomePage = () => {
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    try {
      const decoded = jwtDecode(accessToken);
      const accountName = decoded?.AccountName;
      if (accountName) {
        toast.success(`Welcome, ${accountName}!`);
      }
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, []);

  return (
    <div className="homepage">
      <Carousel fade>
        {carouselItems.map((item, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={item.image}
              alt={item.title}
              style={{ height: "60vh", objectFit: "cover" }}
            />
            <Carousel.Caption>
              <h1>{item.title}</h1>
              <p>{item.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="custom-section featured-characters py-5">
        <h2 className="text-center fw-bold mb-5">Highlight Cosplayers</h2>
        <ul className="card-list">
          {featuredCharacters.map((character) => (
            <li className="character-card" key={character.id}>
              <div className="card-inner">
                <div className="card-front">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="card-img-top"
                  />
                  <div className="card-content">
                    <h3>{character.name}</h3>
                    <span className="category-badge">{character.category}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="text-center mt-4">
          <Link to="/cosplayers" className="view-all-button">
            Hire Cosplayers
          </Link>
        </div>
      </div>

      <div className="custom-section about-us py-5">
        <Row className="align-items-center">
          <Col md={12}>
            <h2 className="text-center fw-bold mb-4">About Us</h2>
          </Col>
          <Col md={6}>
            {" "}
            {/* Cân bằng tỷ lệ: 50% cho văn bản */}
            <p className="text-muted mb-4 text-center">
              Welcome to CCSS – your one-stop destination for all things
              cosplay! Our passionate team brings creativity, authenticity, and
              excitement to every event, costume, and experience. Explore our
              world of cosplay and let’s make your fandom dreams come true!
            </p>
          </Col>
          <Col md={6}>
            {" "}
            {/* Cân bằng tỷ lệ: 50% cho hình ảnh */}
            <div className="about-us-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
                alt="About Us"
                className="img-fluid rounded shadow about-us-image"
              />
            </div>
          </Col>
        </Row>
      </div>

      <div className="custom-section featured-services py-5">
        <h2 className="text-center mb-5">Featured Services</h2>
        <Row className="justify-content-center">
          {services.map((service, index) => (
            <Col md={4} key={index} className="mb-4">
              <div className="paper border shadow shadow-large shadow-hover text-center h-100 service-card">
                <div className="display-4">{service.icon}</div>
                <h3 className="mt-3">{service.title}</h3>
                <p className="text-muted">{service.description}</p>
              </div>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Link to="/services" className="view-all-button">
            View All Services
          </Link>
        </div>
      </div>
    </div>
  );
};

const carouselItems = [
  {
    image: "https://images6.alphacoders.com/138/1382889.png",
    title: "Welcome to CCSS",
    description: "Your Ultimate Cosplay Experience Awaits",
  },
  {
    image: "https://i.redd.it/6c8eg4156bi61.jpg",
    title: "Hire Cosplayers",
    description:
      "Connect with professional cosplayers for events, promotions, or photoshoots",
  },
  {
    image:
      "https://pbs.twimg.com/media/C7cepMUVwAACO-C?format=jpg&name=4096x4096",
    title: "Event Organization",
    description: "Making Your Cosplay Events Unforgettable",
  },
  {
    image:
      "https://neotokyoproject.com/wp-content/uploads/2022/11/IMG_20221125_140104.jpg",
    title: "Event Registration",
    description: "Buy a ticket now to meet your idol!",
  },
  {
    image:
      "https://i.redd.it/my-2b-cosplay-photoart-kmitenkova-small-medium-biped-3d-v0-os0y07ka9g1d1.jpg?width=1920&format=pjpg&auto=webp&s=6c962da48b1e7b0807c7f147a30238a47e89cab4",
    title: "Professional Costume Rentals",
    description: "High-Quality Costumes for Every Character",
  },
  {
    image:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ab0b473b-3434-4d5b-ac4b-82407c923ef4/dduw89a-c9e95780-4262-4318-add1-c059e13742c9.jpg/v1/fill/w_1920,h_640,q_75,strp/my_sh_figuarts_dragon_ball_collection_by_anubis_007_dduw89a-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvYWIwYjQ3M2ItMzQzNC00ZDViLWFjNGItODI0MDdjOTIzZWY0XC9kZHV3ODlhLWM5ZTk1NzgwLTQyNjItNDMxOC1hZGQxLWMwNTllMTM3NDJjOS5qcGciLCJ3aWR0aCI6Ijw9MTkyMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.vrrjAksbryuw9s7HQ11Jv_JJhtn85pImQer7lXOj_aQ",
    title: "Buy Souvenirs",
    description: "Find unique and memorable gifts for any occasion",
  },
];

const services = [
  {
    title: "Costume Rental",
    description:
      "High-quality costumes for your favorite characters, ensuring perfect fit and authentic details.",
    icon: <Shirt size={40} className="service-icon" />,
  },
  {
    title: "Event Planning",
    description:
      "Professional event organization services to bring your cosplay vision to life.",
    icon: <CalendarDays size={40} className="service-icon" />,
  },
  {
    title: "Hire Cosplayers",
    description:
      "Connect with talented cosplayers for your events and photoshoots.",
    icon: <Users size={40} className="service-icon" />,
  },
  {
    title: "Souvenirs Shop",
    description: "Discover unique keepsakes to cherish your cosplay memories.",
    icon: <ShoppingBag size={40} className="service-icon" />,
  },
  {
    title: "Buy Festival Tickets",
    description: "Get tickets to join events and meet our amazing cosplayers!",
    icon: <Ticket size={40} className="service-icon" />,
  },
];

const featuredCharacters = [
  {
    id: 1,
    name: "Yanfei-Genshin",
    category: "Game",
    image:
      "https://th.bing.com/th/id/R.6f429d36ffe66cf79ee313893878eafc?rik=Fe%2bttJax2rzlkw&pid=ImgRaw&r=0",
  },
  {
    id: 2,
    name: "Naruto Uzumaki",
    category: "Anime",
    image:
      "https://i0.wp.com/ic.pics.livejournal.com/mnarutocosplay/65073251/13297/13297_original.jpg",
  },
  {
    id: 3,
    name: "Spider-Man",
    category: "Superhero",
    image:
      "https://i.etsystatic.com/6131164/r/il/364ff6/3627265229/il_fullxfull.3627265229_7wua.jpg",
  },
  {
    id: 4,
    name: "Wonder Woman",
    category: "Superhero",
    image:
      "https://th.bing.com/th/id/OIP.1B088_74plokyoy-o7KI9gHaLH?rs=1&pid=ImgDetMain",
  },
  {
    id: 5,
    name: "Tanjiro Kamado",
    category: "Anime",
    image:
      "https://preview.redd.it/tanjiro-kamado-cosplay-by-me-orion-v0-m6ydv6bvkscc1.jpeg?width=1080&crop=smart&auto=webp&s=c6587a373a9f90505eac9bd72dac5d7309403548",
  },
  {
    id: 6,
    name: "Master Chief",
    category: "Game",
    image:
      "https://i.pinimg.com/originals/7d/95/66/7d9566482e181ef42d96c249f136f38c.jpg",
  },
];

export default HomePage;
