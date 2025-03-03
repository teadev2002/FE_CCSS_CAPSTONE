import React, { useState } from "react";
import { Search, Upload, ChevronRight } from "lucide-react";
import { Modal, Button, Form, Carousel } from "react-bootstrap"; // Xóa useParams khỏi import react-bootstrap
import { useParams } from "react-router-dom"; // Thêm import useParams từ react-router-dom
import "../../styles/CharactersPage.scss";
import CharacterRequestModal from "./CharacterRequestModal.js";

const CharactersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Lấy category từ URL bằng useParams
  const params = useParams();
  const category = params.category || "all"; // Mặc định là "all" nếu không có category

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

  // Lọc nhân vật dựa trên category và searchTerm
  const filteredCharacters = characters.filter((character) => {
    const matchesCategory =
      category === "all" || character.category.toLowerCase() === category.toLowerCase();
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="characters-page min-vh-100">
      {/* Hero Section - Giữ nguyên, không chỉnh sửa */}
      <div className="hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Costume Gallery</h1>
          <p className="lead text-center mt-3">
            Discover our collection of amazing costumes
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Search Bar and Request Button - Giữ nguyên, không chỉnh sửa */}
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
              Costume Request
            </Button>
          </div>
        </div>

        {/* Character Grid - Giữ nguyên, không chỉnh sửa */}
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
                    <button className="hire-button mb-2">Rent Now!</button>
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
          <p className="text-center mt-4">No costumes found.</p>
        )}
      </div>

      {/* Character Request Modal - Giữ nguyên, không chỉnh sửa */}
      <CharacterRequestModal
        show={showRequestModal}
        handleClose={handleRequestClose}
      />

      {/* Character Gallery Modal - Giữ nguyên, không chỉnh sửa */}
      <Modal
        show={showGalleryModal}
        onHide={handleGalleryClose}
        size="lg"
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedCharacter?.name} Gallery</Modal.Title>
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
                      <p>{`Image ${index + 1} of ${selectedCharacter.galleryImages.length
                        }`}</p>
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
                      <strong>Abilities:</strong>{" "}
                      {selectedCharacter.abilities.join(", ")}
                    </div>
                  )}
                  {selectedCharacter.availability && (
                    <div className="info-item">
                      <strong>Availability:</strong>{" "}
                      {selectedCharacter.availability}
                    </div>
                  )}
                </div>
                <div className="action-buttons mt-3">
                  <Button variant="primary" className="me-2">
                    Rent Now!
                  </Button>
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

// Cập nhật characters data để bao gồm tất cả categories từ dropdown trong Navbar.js
const characters = [
  {
    id: 1,
    name: "Red Power Ranger",
    category: "Superhero",
    image: "https://images.bigbadtoystore.com/images/p/full/2021/10/d03088a7-1a73-44a8-aed5-b1e56da4e9e9.jpg",
    galleryImages: [
      "https://images.bigbadtoystore.com/images/p/full/2021/10/d03088a7-1a73-44a8-aed5-b1e56da4e9e9.jpg",
      "https://cdn.media.amplience.net/i/hasbropulse/SUPER7_MMPR_RED_001",
      "https://the616comics.com/cdn/shop/products/image_8df2f8eb-1cf7-4feb-874d-4dd972181b33_1024x1024@2x.jpg?v=1671117804",
      "https://images.halloweencostumes.com/products/69846/1-1/authentic-power-rangers-red-ranger-costume-update.jpg",
    ],
    description: "The Red Power Ranger is the leader of the Power Rangers team. Known for his courage and leadership skills, he commands respect from both teammates and enemies.",
    abilities: ["Leadership", "Martial Arts", "Sword Mastery"],
    availability: "Weekends and Special Events",
  },
  {
    id: 3,
    name: "Spider-Man",
    category: "Superhero",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800",
    galleryImages: [
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&q=80&w=800",
      "https://insomniac.games/wp-content/uploads/2018/09/Spider-Man_PS4_E3_2017_Hero.jpg",
      "https://i.pinimg.com/736x/ee/73/c8/ee73c81b1ec4827e01301cbb67e9c6a2.jpg",
    ],
    description: "Your friendly neighborhood Spider-Man! With the proportionate strength, speed, and agility of a spider, Peter Parker fights crime and saves lives.",
    abilities: ["Web-Slinging", "Spider Sense", "Super Strength", "Wall Crawling"],
    availability: "Daily Bookings Available",
  },
  {
    id: 4,
    name: "Batman",
    category: "Superhero",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=800",
    galleryImages: [
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=800",
      "https://ew.com/thmb/AhZ6fB0jpKPFyptFs0W_L5Y22Ss=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Ben-Affleck-Batman-080423-e07c769f477e4a21b64a7edecaf0414f.jpg",
      "https://cdn.mos.cms.futurecdn.net/2NBcYamXxLpvA77ciPfKZW.jpg",
    ],
    description: "Gotham's Dark Knight, Batman uses his intelligence, physical prowess, and arsenal of gadgets to fight crime and protect the innocent.",
    abilities: ["Detective Skills", "Martial Arts", "Advanced Technology", "Stealth"],
    availability: "Night Events Only",
  },
  {
    id: 5,
    name: "Naruto Uzumaki",
    category: "Anime",
    image: "https://laz-img-sg.alicdn.com/p/cf652571e1c8f02e3c4f8ac3ce6dfbe7.jpg",
    galleryImages: [
      "https://laz-img-sg.alicdn.com/p/cf652571e1c8f02e3c4f8ac3ce6dfbe7.jpg",
      "https://images-na.ssl-images-amazon.com/images/I/71dLJA4IX5L.jpg",
      "https://lh3.googleusercontent.com/proxy/oT1-NmofWgUXrWTtmNPTpSkrthz1eTRGMF9_zxJhXoM9a3jlK3IppNJv9M2Acznlw0_z4gUkzh8iHV9bEJtXzaphzQyAiggj5tX6ToNVbCY43kWolBkcuKQAonYj8phDW-IHuLGejNk8-VhQstnZ2OA5aoJWSSJgZ9xGi444OhMsL-oshoU",
      "https://preview.redd.it/x2r2vzf3mgv71.jpg?width=1080&crop=smart&auto=webp&s=5b8f15e7a97ecbafe3bdd279770876b07ff13d5a",
    ],
    description: "The hyperactive ninja from the Hidden Leaf Village. Naruto's dream is to become the Hokage, the leader of his village.",
    abilities: ["Shadow Clone Jutsu", "Rasengan", "Sage Mode", "Nine-Tails Chakra Mode"],
    availability: "Weekdays and Weekends",
  },
  {
    id: 6,
    name: "Wonder Woman",
    category: "Superhero",
    image: "https://vcdn1-giaitri.vnecdn.net/2017/06/03/wonder-1-6873-1496466377.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=bryjCYQJvyf2CxXGMRzKig",
    galleryImages: [
      "https://vcdn1-giaitri.vnecdn.net/2017/06/03/wonder-1-6873-1496466377.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=bryjCYQJvyf2CxXGMRzKig",
      "https://media.newyorker.com/photos/593581e785bd115baccba6d2/master/pass/Lane-Ten-Things-about-Wonder-Woman.jpg",
      "https://media.vov.vn/sites/default/files/styles/large/public/2020-12/ww4_0.jpeg.jpg",
      "https://thanhnien.mediacdn.vn/uploaded/thienminh/2017_05_19/mv5bmme2m2i4mwytm2nioc00ogm0ltllnwqtzdhlmjnlnjg5nzuwxkeyxkfqcgdeqxvynjczmdc2ndq40_v1_sy1000_sx1000_al__EOXJ.jpg?width=500",
    ],
    description: "Diana Prince, an Amazonian warrior and princess, uses her superstrength, magical weapons, and sense of compassion to fight evil and protect the innocent.",
    abilities: ["Super Strength", "Lasso of Truth", "Indestructible Bracelets", "Flight"],
    availability: "Select Weekends",
  },
  {
    id: 8,
    name: "Iron Man",
    category: "Superhero",
    image: "https://cdn.britannica.com/49/182849-050-4C7FE34F/scene-Iron-Man.jpg",
    galleryImages: [
      "https://cdn.britannica.com/49/182849-050-4C7FE34F/scene-Iron-Man.jpg",
      "https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/z/x/x/medium-poster-design-no-3366-ironman-poster-ironman-posters-for-original-imaggby9s83dgghy.jpeg?q=90&crop=false",
      "https://ironusa.vtexassets.com/arquivos/ids/196906/090214_0.jpg?v=637913412188030000",
      "https://i.guim.co.uk/img/media/9b7412a06451584d8e594c9d08b3cd0623d23d02/0_32_1800_1081/master/1800.jpg?width=1200&quality=85&auto=format&fit=max&s=c852668beeb82679081ff608bef6734e",
    ],
    description: "Genius, billionaire, playboy, philanthropist Tony Stark fights evil in his technologically advanced Iron Man suit.",
    abilities: ["Genius Intelligence", "Powered Armor", "Flight", "Repulsor Technology"],
    availability: "Corporate Events and Parties",
  },
  {
    id: 9,
    name: "Mikasa Ackerman",
    category: "Anime",
    image: "https://external-preview.redd.it/qxTDfEFwgBu_6RgUGrd831eTxsbDNbTTdjFg5fz_I9I.jpg?width=640&crop=smart&auto=webp&s=99c89aace45cd8a8146e535e97e4834d6a38be53",
    galleryImages: [
      "https://external-preview.redd.it/qxTDfEFwgBu_6RgUGrd831eTxsbDNbTTdjFg5fz_I9I.jpg?width=640&crop=smart&auto=webp&s=99c89aace45cd8a8146e535e97e4834d6a38be53",
      "https://i.ebayimg.com/images/g/ZBkAAOSwI-9iV9yf/s-l1200.jpg",
      "https://i.redd.it/rp28l3hr69291.jpg",
      "https://i.pinimg.com/736x/d2/c3/32/d2c3327f53b781ce7342802d0c9e28a3.jpg",
    ],
    description: "A skilled soldier from Attack on Titan, Mikasa is known for her exceptional combat abilities and unwavering loyalty to Eren Yeager.",
    abilities: ["Expert ODM Gear User", "Advanced Combat Skills", "Peak Human Strength"],
    availability: "Limited Availability",
  },
  {
    id: 10,
    name: "Captain America",
    category: "Superhero",
    image: "https://kenh14cdn.com/2020/5/20/captain-america-civil-war-post-credits-scene-pic-1589953816424387064584.jpg",
    galleryImages: [
      "https://kenh14cdn.com/2020/5/20/captain-america-civil-war-post-credits-scene-pic-1589953816424387064584.jpg",
      "https://upload.wikimedia.org/wikipedia/vi/3/3c/Captainamerica.jpeg",
      "https://media.vietnamplus.vn/images/7255a701687d11cb8c6bbc58a6c8078520682d4d8ff5759cf39fc4698b82e90762d3b6246ca8ea177636535799874e951d175058d9a59d4e21100ddb41c54c45/captainamerica.jpg",
      "https://images2.thanhnien.vn/528068263637045248/2024/7/12/captain-america-1720824787112642778512.jpg",
    ],
    description: "Steve Rogers, a World War II veteran, fights for American ideals as the Super-Soldier Captain America.",
    abilities: ["Peak Human Strength", "Master Shield Fighter", "Strategic Genius", "Leadership"],
    availability: "Patriotic Events and Holidays",
  },
  {
    id: 11,
    name: "Black Widow",
    category: "Superhero",
    image: "https://cdn-images.vtv.vn/zoom/640_400/2019/9/5/black-widow-movie0-1567656516289261181879.jpg",
    galleryImages: [
      "https://cdn-images.vtv.vn/zoom/640_400/2019/9/5/black-widow-movie0-1567656516289261181879.jpg",
      "https://cdn2.tuoitre.vn/thumb_w/480/2021/7/12/black-widow-2-1626066585433975284969.png",
      "https://i.vietgiaitri.com/2019/9/14/black-widow-se-su-dung-mot-trong-nhung-cot-truyen-hay-nhat-cua-captain-america-90c5f3.jpg",
      "https://m2now.com/wp-content/uploads/2021/06/Black-Widow-Girls.jpg",
    ],
    description: "Natasha Romanoff, a former KGB assassin, now uses her extraordinary skills as an Avenger to protect the world.",
    abilities: ["Espionage Expert", "Master Martial Artist", "Weapons Specialist", "Strategic Planning"],
    availability: "Adult-Only Events",
  },
  {
    id: 12,
    name: "Link",
    category: "Game",
    image: "https://i.pinimg.com/736x/66/70/9e/66709e40322941110ae0386edec75d0d.jpg",
    galleryImages: [
      "https://i.pinimg.com/736x/66/70/9e/66709e40322941110ae0386edec75d0d.jpg",
      "https://i.pinimg.com/736x/b9/b9/b4/b9b9b44fac1179b223cb9cd21b9ef9a5.jpg",
      "https://i.pinimg.com/736x/f5/f0/94/f5f094a80d8b07d0b002f9ebaf0c1ccc.jpg",
      "https://www.gcosplay.com/cdn/shop/files/the_legend_of_zelda_twilight_princess_link_cosplay_costume_a_edition_1.jpg?v=1687770596",
    ],
    description: "The legendary hero of Hyrule, wielding the Master Sword to save the world.",
    abilities: ["Swordsmanship", "Bow Mastery", "Time Manipulation", "Stealth"],
    availability: "Gaming Events Only",
  },
  {
    id: 13,
    name: "Sailor Moon",
    category: "Anime",
    image: "https://www.gcosplay.com/cdn/shop/files/6_3f424fe7-a4d1-42f5-adc1-f8da4b092494.jpg?v=1738997694&width=1445",
    galleryImages: [
      "https://www.gcosplay.com/cdn/shop/files/6_3f424fe7-a4d1-42f5-adc1-f8da4b092494.jpg?v=1738997694&width=1445",
      "https://gvavayacosplay.com/cdn/shop/products/1_d2191bdb-4f74-4ca3-9096-281b5f034c90.jpg?v=1650369623",
      "https://preview.redd.it/my-first-sailor-moon-cosplay-hope-you-like-it-v0-6yiou2gv6v9b1.jpg?width=1080&crop=smart&auto=webp&s=7da2134a85ce1d294de333628807fa5147b33d7b",
      "https://gvavayacosplay.com/cdn/shop/products/1_22f7f1dc-d30b-4672-833b-e7745f44aca4.jpg?v=1650364408",
    ],
    description: "The beauty Sailor Moon",
    abilities: ["Moon Prism Power", "Healing Magic", "Super Speed", "Leadership"],
    availability: "Anime Conventions",
  },
  {
    id: 14,
    name: "Harry Potter",
    category: "Fantasy",
    image: "https://upload.wikimedia.org/wikipedia/vi/a/a7/HarryPotter5.jpg",
    galleryImages: [
      "https://upload.wikimedia.org/wikipedia/vi/a/a7/HarryPotter5.jpg",
      "https://i.pinimg.com/736x/cd/9f/02/cd9f0273857611f565589388170e9e39.jpg",
      "https://i.pinimg.com/originals/cc/5d/1d/cc5d1dda43b6b33175c78b5f8c0752ed.jpg",
      "https://my-live-01.slatic.net/p/795239233c205909056f060d26926d2b.jpg",
    ],
    description: "The Boy Who Lived, wielding magic and courage to defeat dark forces.",
    abilities: ["Wand Magic", "Quidditch Skills", "Potion Making", "Bravery"],
    availability: "Fantasy Events",
  },
  {
    id: 15,
    name: "Darth Vader",
    category: "Sci-Fi",
    image: "https://lumiere-a.akamaihd.net/v1/images/darth-vader-main_4560aff7.jpeg?region=0%2C67%2C1280%2C720",
    galleryImages: [
      "https://lumiere-a.akamaihd.net/v1/images/darth-vader-main_4560aff7.jpeg?region=0%2C67%2C1280%2C720",
      "https://cyprus-mail.com/wp-content/uploads/2024/09/comment2-2.jpg",
      "https://ew.com/thmb/DR9B7S2D_xzQSnXZKvy7E1-9BKA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/star-wars-episode-v-the-empire-strikes-back-darth-vader-205c0af116534c39844e3b87544ed4b9.jpg",
      "https://popcollectibles.store/cdn/shop/files/454742309_903515071812506_5234762049698221431_n_1024x1024.jpg?v=1723543283",
    ],
    description: "The Dark Lord of the Sith, commanding the Galactic Empire with the Force.",
    abilities: ["Force Choke", "Lightsaber Combat", "Telekinesis", "Strategic Command"],
    availability: "Sci-Fi Conventions",
  },
  {
    id: 16,
    name: "Freddy Krueger",
    category: "Horror",
    image: "https://store-images.s-microsoft.com/image/apps.6637.14453296376761149.1bb5bdd8-308f-4929-a684-bf2962fbd1fc.0b1d9190-9888-4754-a172-b1ce57b2a3d1?q=90&w=480&h=270",
    galleryImages: [
      "https://store-images.s-microsoft.com/image/apps.6637.14453296376761149.1bb5bdd8-308f-4929-a684-bf2962fbd1fc.0b1d9190-9888-4754-a172-b1ce57b2a3d1?q=90&w=480&h=270",
      "https://metrophiladelphia.com/wp-content/uploads/2024/10/GettyImages-1431069173.jpg?w=1200",
      "https://dmdave.com/wp-content/uploads/2019/10/freddy-krueger.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Freddy_Cosplay.jpg",
    ],
    description: "The dream-haunting killer from Elm Street, wielding claws and nightmares.",
    abilities: ["Dream Manipulation", "Claw Attacks", "Invulnerability", "Fear Induction"],
    availability: "Horror Events",
  },
  {
    id: 17,
    name: "Cleopatra",
    category: "Historical",
    image: "https://fabiosacheto.com.br/wp-content/uploads/2023/11/cleopatra-1024x576.png",
    galleryImages: [
      "https://fabiosacheto.com.br/wp-content/uploads/2023/11/cleopatra-1024x576.png",
      "https://www.mitchellbrands.com/cdn/shop/articles/AdobeStock_116794316_720x.jpg?v=1688678682",
      "https://thumbs.dreamstime.com/b/beautiful-egyptian-woman-like-cleopatra-outdoor-photo-gorgeous-makeup-closeup-portrait-female-stylish-haircut-74917356.jpg",
      "https://st2.depositphotos.com/1008919/11775/i/950/depositphotos_117757242-stock-photo-beautiful-egyptian-woman-like-cleopatra.jpg",
    ],
    description: "The iconic queen of Egypt, known for her intelligence and charm.",
    abilities: ["Political Strategy", "Charisma", "Diplomacy", "Historical Knowledge"],
    availability: "Historical Reenactments",
  },
  {
    id: 18,
    name: "Thor",
    category: "Mythology",
    image: "https://cdn-images.vtv.vn/zoom/640_400/Uploaded/hoanghuong/2013_11_09/Thor-The-Dark-World-Wide-Image_thumb.jpg",
    galleryImages: [
      "https://cdn-images.vtv.vn/zoom/640_400/Uploaded/hoanghuong/2013_11_09/Thor-The-Dark-World-Wide-Image_thumb.jpg",
      "https://icdn.24h.com.vn/upload/3-2022/images/2022-07-15/1-3140-1657893907-502-width1758height945.jpg",
      "https://www.denverpost.com/wp-content/uploads/2017/01/thor-the-dark-world.jpg?w=1800&resize=1800,1800",
      "https://thanhnien.mediacdn.vn/Uploaded/dotuan/2022_07_07/1-6976.jpg",
    ],
    description: "The Norse god of thunder, wielding Mjolnir to protect Asgard and Midgard.",
    abilities: ["Thunder Control", "Super Strength", "Flight", "Immortality"],
    availability: "Mythological Events",
  },
  {
    id: 19,
    name: "Steampunk Inventor",
    category: "Steampunk",
    image: "https://cotaglobal.com/wp-content/uploads/2019/08/4682-8.jpg",
    galleryImages: [
      "https://cotaglobal.com/wp-content/uploads/2019/08/4682-8.jpg",
      "https://images.stockcake.com/public/9/f/6/9f639bf3-1c24-4841-9bac-4b452a278fde_large/steampunk-attire-model-stockcake.jpg",
      "https://images.halloweencostumes.com/media/13/steampunk/tween-steampunk-girl-costume.jpg",
      "https://images.stockcake.com/public/9/4/b/94bbcb85-2088-4e24-a945-9fcbf5f93d4f_medium/steampunk-attire-portrait-stockcake.jpg",
    ],
    description: "A Victorian-era inventor with steam-powered gadgets and Victorian attire.",
    abilities: ["Mechanical Engineering", "Steam Technology", "Gadgetry", "Victorian Etiquette"],
    availability: "Steampunk Festivals",
  },
  {
    id: 20,
    name: "Neo",
    category: "Cyberpunk",
    image: "https://i.etsystatic.com/20220228/r/il/fca507/4649922928/il_300x300.4649922928_knvj.jpg",
    galleryImages: [
      "https://i.etsystatic.com/20220228/r/il/fca507/4649922928/il_300x300.4649922928_knvj.jpg",
      "https://i.etsystatic.com/20220228/r/il/69d27f/4698161309/il_fullxfull.4698161309_n6kv.jpg",
      "https://preview.redd.it/my-go-at-lucy-cosplay-from-cyberpunk-edgerunners-v0-0tjlybwx8dea1.jpg?width=1080&crop=smart&auto=webp&s=25d92ab0f5327d75e9cc397d1a0fc9b655caa442",
      "https://i.pinimg.com/736x/36/1b/82/361b82e3fafe594a05d680985f2f78d0.jpg",
    ],
    description: "The hacker-turned-hero in a dystopian future, mastering the Matrix.",
    abilities: ["Hacking Skills", "Martial Arts", "Matrix Control", "Cybernetic Enhancements"],
    availability: "Cyberpunk Events",
  },
  {
    id: 21,
    name: "SpongeBob SquarePants",
    category: "Cartoon",
    image: "https://content.instructables.com/F05/C93F/L9Y80YAC/F05C93FL9Y80YAC.jpg?auto=webp&fit=bounds&frame=1&height=1024&width=1024auto=webp&frame=1&height=150",
    galleryImages: [
      "https://content.instructables.com/F05/C93F/L9Y80YAC/F05C93FL9Y80YAC.jpg?auto=webp&fit=bounds&frame=1&height=1024&width=1024auto=webp&frame=1&height=150",
      "https://i.redd.it/jvj1hra78ttz.jpg",
      "https://images.halloweencostumes.com/media/13/spongebob/kids-spongebob-costume.jpg",
      "https://i5.walmartimages.com/seo/Rubies-Spongebob-Squarepants-Child-Costume-Large_457d5c33-4fdc-4feb-9ce3-377df1315813.bc8c57bf39d724eebee0d19d7b7efb82.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
    ],
    description: "The cheerful sea sponge from Bikini Bottom, always ready for fun and adventure.",
    abilities: ["Optimism", "Jellyfishing", "Cooking Skills", "Friendship"],
    availability: "Cartoon Festivals",
  },
];

export default CharactersPage;