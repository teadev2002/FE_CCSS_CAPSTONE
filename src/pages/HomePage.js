// import { Link } from "react-router-dom";
// import { ArrowRight } from "lucide-react";
// import "../styles/HomePage.scss";
// const HomePage = (props) => {
//   return (
//     <div className="homepage min-vh-100 bg-light">
//       {/* Hero Section */}
//       <div className="hero-section text-white d-flex flex-column justify-content-center align-items-center">
//         <div className="overlay"></div>
//         <div className="text-center position-relative">
//           <h1 className="display-4 fw-bold mb-3">Welcome to CCSS</h1>
//           <p className="lead mb-4">
//             Your premier destination for professional CCSS
//           </p>
//           <Link
//             to="/services"
//             className="btn btn-primary btn-lg d-flex align-items-center justify-content-center"
//           >
//             Explore Our Services
//           </Link>
//         </div>
//       </div>

//       {/* Featured Characters */}
//       <div className="featured-characters container py-5">
//         <h2 className="text-center fw-bold mb-5"> Characters</h2>
//         <div className="row g-4">
//           {featuredCharacters.map((character) => (
//             <div className="col-md-4" key={character.id}>
//               <div className="card shadow-sm h-100">
//                 <img
//                   src={character.image}
//                   alt={character.name}
//                   className="card-img-top"
//                 />
//                 <div className="card-body">
//                   <h5 className="card-title">{character.name}</h5>
//                   <p className="card-text text-muted">{character.category}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="text-center mt-4">
//           <Link to="/characters" className="btn btn-outline-primary btn-lg">
//             View All Characters
//           </Link>
//         </div>
//       </div>

//       {/* Services Preview */}
//       <div className="services-preview bg-light py-5">
//         <div className="container">
//           <h2 className="text-center fw-bold mb-5">Our Services</h2>
//           <div className="row g-4">
//             {services.map((service) => (
//               <div className="col-md-4" key={service.id}>
//                 <div className="card shadow-sm h-100">
//                   <div className="card-body">
//                     <service.icon className="service-icon mb-3" />
//                     <h5 className="card-title">{service.title}</h5>
//                     <p className="card-text text-muted">
//                       {service.description}
//                     </p>
//                     <Link
//                       to={`/services#${service.id}`}
//                       className="text-primary fw-bold"
//                     >
//                       Learn More
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// const featuredCharacters = [
//   {
//     id: 1,
//     name: "Yanfei-Genshin",
//     category: "Game",
//     image:
//       "https://th.bing.com/th/id/R.6f429d36ffe66cf79ee313893878eafc?rik=Fe%2bttJax2rzlkw&pid=ImgRaw&r=0",
//   },

//   {
//     id: 3,
//     name: "Spider-Man",
//     category: "Superhero",
//     image:
//       "https://i.etsystatic.com/6131164/r/il/364ff6/3627265229/il_fullxfull.3627265229_7wua.jpg",
//   },
// ];

// const services = [
//   {
//     id: "cosplayer-hire",
//     title: "Hire a Cosplayer",
//     description: "Professional cosplayers for your events and photoshoots",
//     icon: "Users",
//   },
//   {
//     id: "event-organization",
//     title: "Event Organization",
//     description: "Complete cosplay event planning and management",
//     icon: "ShoppingBag",
//   },
//   {
//     id: "costume-rental",
//     title: "Costume Rental",
//     description: "High-quality costume rentals for all occasions",
//     icon: "Hanger",
//   },
// ];
// export default HomePage;
import React from "react";
import { Carousel, Container, Row, Col, Card, Button } from "react-bootstrap";

const HomePage = () => {
  const carouselItems = [
    {
      image:
        "https://wallpaper.dog/large/20692654.jpg",
      title: "Welcome to CCSS",
      description: "Your Ultimate Cosplay Experience Awaits",
    },
    {
      image:
        "https://images.hdqwalls.com/wallpapers/ciri-cosplay-girl-4k-30.jpg",
      title: "Hire the Cosplayers",
      description: "Connect with professional cosplayers for events, promotions, or photoshoots",
    },
    {
      image:
        "https://vcdn1-sohoa.vnecdn.net/2024/05/12/z5432885222933-85c6b155d559b59-4082-7520-1715492735.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=kjqb10SmWRSvvFEL2Wis-A",
      title: "Event Organization",
      description: "Making Your Cosplay Events Unforgettable",
    },
    {
      image:
        "https://danangfantasticity.com/wp-content/uploads/2023/05/nippon-oi-le-hoi-cosplay-anime-va-manga-hoanh-trang-nhat-mien-trung-chinh-thuc-tro-lai-01.jpg",
      title: "Event Registration",
      description: "Buy a ticket now to meet your idol!",
    },
    {
      image:
        "https://w.wallhaven.cc/full/p9/wallhaven-p9kp1j.jpg",
      title: "Professional Costume Rentals",
      description: "High-Quality Costumes for Every Character",
    },
    {
      image:
        "https://i.pinimg.com/originals/20/9a/41/209a411e7fde3cd713dfe66a4c1bdf78.jpg",
      title: "Buy Souvenirs",
      description: "Find unique and memorable gifts for any occasion",
    },
  ];

  const services = [
    {
      title: "Costume Rental",
      description: "High-quality costumes for all your cosplay needs",
      icon: "🎭",
    },
    {
      title: "Event Planning",
      description: "Professional organization for cosplay events",
      icon: "📅",
    },
    {
      title: "Character Training",
      description: "Learn to embody your favorite characters",
      icon: "🎬",
    },
  ];

  return (
    <div>
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

      <Container className="py-5">
        <h2 className="text-center mb-5">Featured Services</h2>
        <Row>
          {services.map((service, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <div className="display-4">{service.icon}</div>
                  <Card.Title>{service.title}</Card.Title>
                  <Card.Text>{service.description}</Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
