// import React from "react";
// import { Link } from "react-router-dom";
// import { Carousel, Container, Row, Col, Card, Button } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles/HomePage.scss";
// const HomePage = () => {
//   const carouselItems = [
//     {
//       image: "https://wallpaper.dog/large/20692654.jpg",
//       title: "Welcome to CCSS",
//       description: "Your Ultimate Cosplay Experience Awaits",
//     },
//     {
//       image:
//         "https://images.hdqwalls.com/wallpapers/ciri-cosplay-girl-4k-30.jpg",
//       title: "Hire the Cosplayers",
//       description:
//         "Connect with professional cosplayers for events, promotions, or photoshoots",
//     },
//     {
//       image:
//         "https://danangfantasticity.com/wp-content/uploads/2023/05/nippon-oi-le-hoi-cosplay-anime-va-manga-hoanh-trang-nhat-mien-trung-chinh-thuc-tro-lai-07.jpg",
//       title: "Event Organization",
//       description: "Making Your Cosplay Events Unforgettable",
//     },
//     {
//       image:
//         "https://danangfantasticity.com/wp-content/uploads/2023/05/nippon-oi-le-hoi-cosplay-anime-va-manga-hoanh-trang-nhat-mien-trung-chinh-thuc-tro-lai-01.jpg",
//       title: "Event Registration",
//       description: "Buy a ticket now to meet your idol!",
//     },
//     {
//       image: "https://w.wallhaven.cc/full/p9/wallhaven-p9kp1j.jpg",
//       title: "Professional Costume Rentals",
//       description: "High-Quality Costumes for Every Character",
//     },
//     {
//       image:
//         "https://i.pinimg.com/originals/20/9a/41/209a411e7fde3cd713dfe66a4c1bdf78.jpg",
//       title: "Buy Souvenirs",
//       description: "Find unique and memorable gifts for any occasion",
//     },
//   ];

//   const services = [
//     {
//       title: "Costume Rental",
//       description: "High-quality costumes for all your cosplay needs",
//       icon: "🎭",
//     },
//     {
//       title: "Event Planning",
//       description: "Professional organization for cosplay events",
//       icon: "📅",
//     },
//     {
//       title: "Character Training",
//       description: "Learn to embody your favorite characters",
//       icon: "🎬",
//     },
//   ];

//   const featuredCharacters = [
//     {
//       id: 1,
//       name: "Yanfei-Genshin",
//       category: "Game",
//       image:
//         "https://th.bing.com/th/id/R.6f429d36ffe66cf79ee313893878eafc?rik=Fe%2bttJax2rzlkw&pid=ImgRaw&r=0",
//     },
//     {
//       id: 2,
//       name: "Naruto Uzumaki",
//       category: "Anime",
//       image:
//         "https://i0.wp.com/ic.pics.livejournal.com/mnarutocosplay/65073251/13297/13297_original.jpg",
//     },
//     {
//       id: 3,
//       name: "Spider-Man",
//       category: "Superhero",
//       image:
//         "https://i.etsystatic.com/6131164/r/il/364ff6/3627265229/il_fullxfull.3627265229_7wua.jpg",
//     },
//     {
//       id: 4,
//       name: "Wonder Woman",
//       category: "Superhero",
//       image:
//         "https://th.bing.com/th/id/OIP.1B088_74plokyoy-o7KI9gHaLH?rs=1&pid=ImgDetMain",
//     },
//     {
//       id: 5,
//       name: "Tanjiro Kamado",
//       category: "Anime",
//       image:
//         "https://preview.redd.it/tanjiro-kamado-cosplay-by-me-orion-v0-m6ydv6bvkscc1.jpeg?width=1080&crop=smart&auto=webp&s=c6587a373a9f90505eac9bd72dac5d7309403548",
//     },
//     {
//       id: 6,
//       name: "Master Chief",
//       category: "Game",
//       image:
//         "https://i.pinimg.com/originals/7d/95/66/7d9566482e181ef42d96c249f136f38c.jpg",
//     },
//   ];

//   return (
//     <div className="homepage">
//       <Carousel fade>
//         {carouselItems.map((item, index) => (
//           <Carousel.Item key={index}>
//             <img
//               className="d-block w-100"
//               src={item.image}
//               alt={item.title}
//               style={{ height: "60vh", objectFit: "cover" }}
//             />
//             <Carousel.Caption>
//               <h1>{item.title}</h1>
//               <p>{item.description}</p>
//             </Carousel.Caption>
//           </Carousel.Item>
//         ))}
//       </Carousel>

//       <Container className="featured-characters py-5">
//         <h2 className="text-center fw-bold mb-5">Characters</h2>
//         <ul className="card-list">
//           {featuredCharacters.map((character) => (
//             <li
//               className="paper border shadow shadow-large shadow-hover"
//               key={character.id}
//             >
//               <img
//                 src={character.image}
//                 alt={character.name}
//                 className="card-img-top"
//               />
//               <h2>{character.name}</h2>
//               <p className="text-muted">{character.category}</p>
//             </li>
//           ))}
//         </ul>
//         <div className="text-center mt-4">
//           <Link to="/characters" className="btn btn-outline-primary btn-lg">
//             View All Characters
//           </Link>
//         </div>
//       </Container>

//       <Container className="featured-services py-5">
//         <h2 className="text-center mb-5">Featured Services</h2>
//         <Row className="justify-content-center">
//           {services.map((service, index) => (
//             <Col md={4} key={index} className="mb-4">
//               <div className="paper border shadow shadow-large shadow-hover text-center h-100 service-card">
//                 <div className="display-4">{service.icon}</div>
//                 <h3 className="mt-3">{service.title}</h3>
//                 <p className="text-muted">{service.description}</p>
//               </div>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default HomePage;

import React from "react";
import { Link } from "react-router-dom";
import { Carousel, Container, Row, Col } from "react-bootstrap";
import { Shirt, CalendarDays, Users, ShoppingBag } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/HomePage.scss";

const HomePage = () => {
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

      <Container className="featured-characters py-5">
        <h2 className="text-center fw-bold mb-5">Highlight Characters</h2>
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
          <Link to="/characters" className="view-all-button">
            View All Characters
          </Link>
        </div>
      </Container>

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
