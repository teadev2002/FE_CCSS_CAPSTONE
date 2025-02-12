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
        "https://upload-os-bbs.hoyolab.com/upload/2022/07/28/75933071/6b062c3ba9d4a8a3e656344ce9546866_141203860423731661.jpg",
      title: "Welcome to CosplayHub",
      description: "Your Ultimate Cosplay Experience Awaits",
    },
    {
      image:
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e199285e-9171-4f41-bac6-262d7db1516f/dfo5zmw-9d1c8f69-9435-41aa-a678-3fb7dd6e4a53.jpg/v1/fill/w_1024,h_693,q_75,strp/rosaria___genshin_impact_by_sandybphotography_dfo5zmw-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjkzIiwicGF0aCI6IlwvZlwvZTE5OTI4NWUtOTE3MS00ZjQxLWJhYzYtMjYyZDdkYjE1MTZmXC9kZm81em13LTlkMWM4ZjY5LTk0MzUtNDFhYS1hNjc4LTNmYjdkZDZlNGE1My5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.nrVQcsQoUDEJenm8DqrqYgbfQY-M9HfmiPkfZ__rMpE",
      title: "Hire a Cosplayer",
      description: "High-Quality Costumes for Every Character",
    },
    {
      image:
        "https://i.pinimg.com/originals/68/49/7f/68497f56644bd06613dec15460c88839.jpg",
      title: "Event Organization",
      description: "Making Your Cosplay Events Unforgettable",
    },
    {
      image:
        "https://www.mollylimpets.com/images/ww/gallery/Fancy%20Dress/animals%20mascots/Molly%20Limpets%20Fancy%20Dress%20Hire.jpg",
      title: "Costume Rentals",
      description: "High-Quality Costumes for Every Character",
    },
    {
      image:
        "https://media.karousell.com/media/photos/products/2023/4/25/original_anime_figure_1682386934_aff8038b.jpg",
      title: "Selling souvenirs",
      description: "Making Your Cosplay Events Unforgettable",
    },
    {
      image:
        "https://th.bing.com/th/id/R.574b6858d03a93862aa1e1779f1ce6bb?rik=erThfbKzo3Hu0g&riu=http%3a%2f%2f4.bp.blogspot.com%2f-swypOEGbGsc%2fVf23dv09QCI%2fAAAAAAAAAjI%2fUvYFlJAK_2A%2fs1600%2fStellar.jpg&ehk=yUPRQPUu7PSILpXPq0N5LFvC1E5%2f3qpb7hoQukVB%2br8%3d&risl=&pid=ImgRaw&r=0",
      title: "Sign up Fan Sign",
      description: "High-Quality Costumes for Every Character",
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
              <Card className="text-center h-100">
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
