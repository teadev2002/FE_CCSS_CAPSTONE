import React, { useState } from "react";
import { Search, Upload, ChevronRight } from "lucide-react";
import { Modal, Button, Form, Carousel } from "react-bootstrap";
import "../../styles/CharactersPage.scss";
import CharacterRequestModal from "./CharacterRequestModal.js";

const CharactersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleRequestShow = () => setShowRequestModal(true);
  const handleRequestClose = () => setShowRequestModal(false);
  
  const handleGalleryShow = (character) => {
    setSelectedCharacter(character);
    setShowGalleryModal(true);
  };
  
  const handleGalleryClose = () => {
    setShowGalleryModal(false);
    setSelectedCharacter(null);
  };

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="characters-page min-vh-100">
      {/* Hero Section */}
      <div className="hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Character Gallery</h1>
          <p className="lead text-center mt-3">
            Discover our collection of amazing characters
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Search Bar and Request Button */}
        <div className="search-container mb-5">
          <div className="d-flex justify-content-between align-items-center">
            <div className="search-bar flex-grow-1 me-3">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={20} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search characters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleRequestShow}
              className="request-button"
            >
              Character Request
            </Button>
          </div>
        </div>

        {/* Character Grid */}
        <div className="row g-4">
          {filteredCharacters.map((character) => (
            <div className="col-md-3" key={character.id}>
              <div className="character-card">
                <div className="card-image">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="img-fluid"
                  />
                </div>
                <div className="card-content">
                  <h5 className="character-name">{character.name}</h5>
                  <p className="character-category">{character.category}</p>
                  <div className="button-group">
                    <button className="hire-button mb-2">Hire Now!</button>
                    <button 
                      className="show-more-button"
                      onClick={() => handleGalleryShow(character)}
                    >
                      Show More Images
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <p className="text-center mt-4">No characters found.</p>
        )}
      </div>

      {/* Character Request Modal */}
      <CharacterRequestModal show={showRequestModal} handleClose={handleRequestClose} />
      
      {/* Character Gallery Modal */}
      <Modal 
        show={showGalleryModal} 
        onHide={handleGalleryClose} 
        size="lg" 
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCharacter?.name} Gallery
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCharacter && (
            <div className="character-gallery">
              <Carousel className="gallery-carousel">
                {selectedCharacter.galleryImages.map((image, index) => (
                  <Carousel.Item key={index}>
                    <div className="carousel-image-container">
                      <img
                        className="d-block w-100"
                        src={image}
                        alt={`${selectedCharacter.name} - Image ${index + 1}`}
                      />
                    </div>
                    <Carousel.Caption>
                      <h3>{selectedCharacter.name}</h3>
                      <p>{`Image ${index + 1} of ${selectedCharacter.galleryImages.length}`}</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
              
              <div className="character-details mt-4">
                <h4>About {selectedCharacter.name}</h4>
                <p>{selectedCharacter.description}</p>
                <div className="character-info">
                  <div className="info-item">
                    <strong>Category:</strong> {selectedCharacter.category}
                  </div>
                  {selectedCharacter.abilities && (
                    <div className="info-item">
                      <strong>Abilities:</strong> {selectedCharacter.abilities.join(", ")}
                    </div>
                  )}
                  {selectedCharacter.availability && (
                    <div className="info-item">
                      <strong>Availability:</strong> {selectedCharacter.availability}
                    </div>
                  )}
                </div>
                <div className="action-buttons mt-3">
                  <Button variant="primary" className="me-2">Hire Now</Button>
                  <Button variant="outline-primary">Add to Favorites</Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

// Extended characters data with gallery images and descriptions
const characters = [
  {
    id: 1,
    name: "Red Power Ranger",
    category: "Superhero",
    image: "https://images.bigbadtoystore.com/images/p/full/2021/10/d03088a7-1a73-44a8-aed5-b1e56da4e9e9.jpg",
    galleryImages: [
      "https://images.bigbadtoystore.com/images/p/full/2021/10/d03088a7-1a73-44a8-aed5-b1e56da4e9e9.jpg",
      "https://m.media-amazon.com/images/I/71Y-ztC+TkL._AC_UF894,1000_QL80_.jpg",
      "https://i5.walmartimages.com/seo/Power-Rangers-Legacy-Red-Ranger-Action-Figure_0a51b16b-dc8a-46f2-8b0c-e9d4fd7ed424.55d00c1e6dfd1c1d2ca13bc9be86cb3e.jpeg",
      "https://i5.walmartimages.com/asr/b40d7ab6-e1f3-4658-8411-19a094c1c98e.2b6e3df1a6bca2322d2b5d4c41ea91e7.jpeg"
    ],
    description: "The Red Power Ranger is the leader of the Power Rangers team. Known for his courage and leadership skills, he commands respect from both teammates and enemies.",
    abilities: ["Leadership", "Martial Arts", "Sword Mastery"],
    availability: "Weekends and Special Events"
  },
  {
    id: 3,
    name: "Spider-Man",
    category: "Superhero",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800",
    galleryImages: [
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1640499900578-21dc3eeea831?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Your friendly neighborhood Spider-Man! With the proportionate strength, speed, and agility of a spider, Peter Parker fights crime and saves lives.",
    abilities: ["Web-Slinging", "Spider Sense", "Super Strength", "Wall Crawling"],
    availability: "Daily Bookings Available"
  },
  {
    id: 4,
    name: "Batman",
    category: "Superhero",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=800",
    galleryImages: [
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1584486444761-a537bc02cb5a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1532960401447-7dd05bef20b0?auto=format&fit=crop&q=80&w=800"
    ],
    description: "Gotham's Dark Knight, Batman uses his intelligence, physical prowess, and arsenal of gadgets to fight crime and protect the innocent.",
    abilities: ["Detective Skills", "Martial Arts", "Advanced Technology", "Stealth"],
    availability: "Night Events Only"
  },
  {
    id: 5,
    name: "Naruto Uzumaki",
    category: "Anime",
    image: "https://laz-img-sg.alicdn.com/p/cf652571e1c8f02e3c4f8ac3ce6dfbe7.jpg",
    galleryImages: [
      "https://laz-img-sg.alicdn.com/p/cf652571e1c8f02e3c4f8ac3ce6dfbe7.jpg",
      "https://m.media-amazon.com/images/I/61GOKdOnB4L._AC_UF894,1000_QL80_.jpg",
      "https://images.roblox.com/catalog/0/150/300/400/22/assets/catalog/3c0a65a5ccafb0bdcf89023c32dc9ac4.jpg",
      "https://m.media-amazon.com/images/I/71UTCb4tjYL._AC_UF894,1000_QL80_.jpg"
    ],
    description: "The hyperactive ninja from the Hidden Leaf Village. Naruto's dream is to become the Hokage, the leader of his village.",
    abilities: ["Shadow Clone Jutsu", "Rasengan", "Sage Mode", "Nine-Tails Chakra Mode"],
    availability: "Weekdays and Weekends"
  },
  {
    id: 6,
    name: "Wonder Woman",
    category: "Superhero",
    image: "https://vcdn1-giaitri.vnecdn.net/2017/06/03/wonder-1-6873-1496466377.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=bryjCYQJvyf2CxXGMRzKig",
    galleryImages: [
      "https://vcdn1-giaitri.vnecdn.net/2017/06/03/wonder-1-6873-1496466377.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=bryjCYQJvyf2CxXGMRzKig",
      "https://m.media-amazon.com/images/I/71c1LRLBTFL._AC_UF894,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/61DYvVzCdlL._AC_UF894,1000_QL80_.jpg",
      "https://static.wikia.nocookie.net/wonder-woman/images/3/39/Wonder_Woman_Gal_Gadot.jpg"
    ],
    description: "Diana Prince, an Amazonian warrior and princess, uses her superstrength, magical weapons, and sense of compassion to fight evil and protect the innocent.",
    abilities: ["Super Strength", "Lasso of Truth", "Indestructible Bracelets", "Flight"],
    availability: "Select Weekends"
  },
  {
    id: 8,
    name: "Iron Man",
    category: "Superhero",
    image: "https://m.media-amazon.com/images/I/71l9VjMThGL._AC_UY1000_.jpg",
    galleryImages: [
      "https://m.media-amazon.com/images/I/71l9VjMThGL._AC_UY1000_.jpg",
      "https://m.media-amazon.com/images/I/71VSgbI9D3L._AC_UF894,1000_QL80_.jpg",
      "https://www.superherotoystore.com/cdn/shop/products/MK32_A_1024x1024.jpg?v=1640076005",
      "https://m.media-amazon.com/images/I/71MRhLmuvmL._AC_UF894,1000_QL80_.jpg"
    ],
    description: "Genius, billionaire, playboy, philanthropist Tony Stark fights evil in his technologically advanced Iron Man suit.",
    abilities: ["Genius Intelligence", "Powered Armor", "Flight", "Repulsor Technology"],
    availability: "Corporate Events and Parties"
  },
  {
    id: 9,
    name: "Mikasa Ackerman",
    category: "Anime",
    image: "https://external-preview.redd.it/qxTDfEFwgBu_6RgUGrd831eTxsbDNbTTdjFg5fz_I9I.jpg?width=640&crop=smart&auto=webp&s=99c89aace45cd8a8146e535e97e4834d6a38be53",
    galleryImages: [
      "https://external-preview.redd.it/qxTDfEFwgBu_6RgUGrd831eTxsbDNbTTdjFg5fz_I9I.jpg?width=640&crop=smart&auto=webp&s=99c89aace45cd8a8146e535e97e4834d6a38be53",
      "https://m.media-amazon.com/images/I/71t3dUJm2DL._AC_UF894,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/71EtB6jcJUL._AC_UF1000,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/31QO-EvPjzL._AC_UF894,1000_QL80_.jpg"
    ],
    description: "A skilled soldier from Attack on Titan, Mikasa is known for her exceptional combat abilities and unwavering loyalty to Eren Yeager.",
    abilities: ["Expert ODM Gear User", "Advanced Combat Skills", "Peak Human Strength"],
    availability: "Limited Availability"
  },
  {
    id: 10,
    name: "Captain America",
    category: "Superhero",
    image: "https://m.media-amazon.com/images/I/71kR6o6oQQL._AC_UY1000_.jpg",
    galleryImages: [
      "https://m.media-amazon.com/images/I/71kR6o6oQQL._AC_UY1000_.jpg",
      "https://m.media-amazon.com/images/I/71yUACoBdBL._AC_UF894,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/61X7AYf1UgL._AC_UF894,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/71eViKVwQVL._AC_UF894,1000_QL80_.jpg"
    ],
    description: "Steve Rogers, a World War II veteran, fights for American ideals as the Super-Soldier Captain America.",
    abilities: ["Peak Human Strength", "Master Shield Fighter", "Strategic Genius", "Leadership"],
    availability: "Patriotic Events and Holidays"
  },
  {
    id: 11,
    name: "Black Widow",
    category: "Superhero",
    image: "https://obsidianwings.blogs.com/.a/6a00d834515c2369e20163059a1cdf970d-800wi",
    galleryImages: [
      "https://obsidianwings.blogs.com/.a/6a00d834515c2369e20163059a1cdf970d-800wi",
      "https://m.media-amazon.com/images/I/61JDdjhr3ML._AC_UF894,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/71JnAtKdhqL._AC_UF894,1000_QL80_.jpg",
      "https://atozcostumehire.com/wp-content/uploads/2020/08/Black-Widow5-1024x1536.jpg"
    ],
    description: "Natasha Romanoff, a former KGB assassin, now uses her extraordinary skills as an Avenger to protect the world.",
    abilities: ["Espionage Expert", "Master Martial Artist", "Weapons Specialist", "Strategic Planning"],
    availability: "Adult-Only Events"
  },
];

export default CharactersPage;