import React, { useState } from "react";
import { Search } from "lucide-react";
import "../styles/CharactersPage.scss";

const CharactersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCharacters = characters.filter((character) =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="characters-page min-vh-100">
      {/* Hero Section - matching About page style */}
      <div className="hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Character Gallery</h1>
          <p className="lead text-center mt-3">
            Discover our collection of amazing characters
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Search Bar */}
        <div className="search-container mb-5">
          <div className="search-bar mx-auto">
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
                  <button className="hire-button">Hire Now!</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <p className="text-center mt-4">No characters found.</p>
        )}
      </div>
    </div>
  );
};

const characters = [
  {
    id: 1,
    name: "Red Power Ranger",
    category: "Superhero",
    image:
      "https://images.bigbadtoystore.com/images/p/full/2021/10/d03088a7-1a73-44a8-aed5-b1e56da4e9e9.jpg",
  },
  {
    id: 3,
    name: "Spider-Man",
    category: "Superhero",
    image:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    name: "Batman",
    category: "Superhero",
    image:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    name: "Naruto Uzumaki",
    category: "Anime",
    image:
      "https://laz-img-sg.alicdn.com/p/cf652571e1c8f02e3c4f8ac3ce6dfbe7.jpg",
  },
  {
    id: 6,
    name: "Wonder Woman",
    category: "Superhero",
    image:
      "https://vcdn1-giaitri.vnecdn.net/2017/06/03/wonder-1-6873-1496466377.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=bryjCYQJvyf2CxXGMRzKig",
  },
  {
    id: 8,
    name: "Iron Man",
    category: "Superhero",
    image:
      "https://m.media-amazon.com/images/I/71l9VjMThGL._AC_UY1000_.jpg",
  },
  {
    id: 9,
    name: "Mikasa Ackerman",
    category: "Anime",
    image:
      "https://external-preview.redd.it/qxTDfEFwgBu_6RgUGrd831eTxsbDNbTTdjFg5fz_I9I.jpg?width=640&crop=smart&auto=webp&s=99c89aace45cd8a8146e535e97e4834d6a38be53",
  },
  {
    id: 10,
    name: "Captain America",
    category: "Superhero",
    image:
      "https://m.media-amazon.com/images/I/71kR6o6oQQL._AC_UY1000_.jpg",
  },
  {
    id: 11,
    name: "Black Widow",
    category: "Superhero",
    image:
      "https://obsidianwings.blogs.com/.a/6a00d834515c2369e20163059a1cdf970d-800wi",
  },
];

export default CharactersPage;
