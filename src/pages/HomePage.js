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

// {/* Featured Characters */}
// <div className="featured-characters container py-5">
//   <h2 className="text-center fw-bold mb-5"> Characters</h2>
//   <div className="row g-4">
//     {featuredCharacters.map((character) => (
//       <div className="col-md-4" key={character.id}>
//         <div className="card shadow-sm h-100">
//           <img
//             src={character.image}
//             alt={character.name}
//             className="card-img-top"
//           />
//           <div className="card-body">
//             <h5 className="card-title">{character.name}</h5>
//             <p className="card-text text-muted">{character.category}</p>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
//   <div className="text-center mt-4">
//     <Link to="/characters" className="btn btn-outline-primary btn-lg">
//       View All Characters
//     </Link>
//   </div>
// </div>

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
import { Link } from "react-router-dom";
import { Carousel, Container, Row, Col, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/HomePage.scss";
const HomePage = () => {
  const carouselItems = [
    {
      image: "https://wallpaper.dog/large/20692654.jpg",
      title: "Welcome to CCSS",
      description: "Your Ultimate Cosplay Experience Awaits",
    },
    {
      image:
        "https://images.hdqwalls.com/wallpapers/ciri-cosplay-girl-4k-30.jpg",
      title: "Hire the Cosplayers",
      description:
        "Connect with professional cosplayers for events, promotions, or photoshoots",
    },
    {
      image:
        "https://danangfantasticity.com/wp-content/uploads/2023/05/nippon-oi-le-hoi-cosplay-anime-va-manga-hoanh-trang-nhat-mien-trung-chinh-thuc-tro-lai-07.jpg",
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
      image: "https://w.wallhaven.cc/full/p9/wallhaven-p9kp1j.jpg",
      title: "Professional Costume Rentals",
      description: "High-Quality Costumes for Every Character",
    },
    {
      image:
        "https://i.pinimg.com/originals/20/9a/41/209a411e7fde3cd713dfe66a4c1bdf78.jpg",
      title: "Buy Souvenirs",
      description: "Find unique and memorable gifts for any occasion",
    },
    // {
    //   image:
    //     "https://www.mollylimpets.com/images/ww/gallery/Fancy%20Dress/animals%20mascots/Molly%20Limpets%20Fancy%20Dress%20Hire.jpg",
    //   title: "Costume Rentals",
    //   description: "High-Quality Costumes for Every Character",
    // },
    // {
    //   image:
    //     "https://media.karousell.com/media/photos/products/2023/4/25/original_anime_figure_1682386934_aff8038b.jpg",
    //   title: "Selling souvenirs",
    //   description: "Making Your Cosplay Events Unforgettable",
    // },
    // {
    //   image:
    //     "https://th.bing.com/th/id/R.574b6858d03a93862aa1e1779f1ce6bb?rik=erThfbKzo3Hu0g&riu=http%3a%2f%2f4.bp.blogspot.com%2f-swypOEGbGsc%2fVf23dv09QCI%2fAAAAAAAAAjI%2fUvYFlJAK_2A%2fs1600%2fStellar.jpg&ehk=yUPRQPUu7PSILpXPq0N5LFvC1E5%2f3qpb7hoQukVB%2br8%3d&risl=&pid=ImgRaw&r=0",
    //   title: "Sign up Fan Sign",
    //   description: "High-Quality Costumes for Every Character",
    // },
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

      {/* Featured Characters */}
      {/* <Container className="featured-characters py-5">
        <h2 className="text-center fw-bold mb-5">Characters</h2>
        <Row className="g-4">
          {featuredCharacters.map((character) => (
            <Col md={4} key={character.id}>
              <Card className="shadow-sm h-100 character-card">
                <Card.Img
                  variant="top"
                  src={character.image}
                  alt={character.name}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{character.name}</Card.Title>
                  <Card.Text className="text-muted">
                    {character.category}
                  </Card.Text>
                  <Button
                    variant="primary"
                    className="mt-auto align-self-center"
                  >
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Link to="/characters" className="btn btn-outline-primary btn-lg">
            View All Characters
          </Link>
        </div>
      </Container> */}
      <Container className="featured-characters py-5">
        <h2 className="text-center fw-bold mb-5">Characters</h2>
        <ul className="card-list">
          {featuredCharacters.map((character) => (
            <li
              className="paper border shadow shadow-large shadow-hover"
              key={character.id}
            >
              <img
                src={character.image}
                alt={character.name}
                className="card-img-top"
              />
              <h2>{character.name}</h2>
              <p className="text-muted">{character.category}</p>
            </li>
          ))}
        </ul>
        <div className="text-center mt-4">
          <Link to="/characters" className="btn btn-outline-primary btn-lg">
            View All Characters
          </Link>
        </div>
      </Container>

      {/* Featured Services */}
      {/* <Container className="featured-services py-5">
        <h2 className="text-center mb-5">Featured Services</h2>
        <Row className="justify-content-center">
          {services.map((service, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="text-center h-100 service-card shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="display-4">{service.icon}</div>
                  <Card.Title className="mt-3">{service.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {service.description}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    className="mt-auto align-self-center"
                  >
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container> */}

      <Container className="featured-services py-5">
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
      </Container>
    </div>
  );
};

export default HomePage;
