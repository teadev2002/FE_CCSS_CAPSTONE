import React from "react";
import { Search } from "lucide-react";
import "../styles/CharactersPage.scss";

const CharactersPage = () => {
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
              />
            </div>
          </div>
        </div>

        {/* Character Grid */}
        <div className="row g-4">
          {characters.map((character) => (
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const characters = [
  {
    id: 1,
    name: "Power Rangers Red Ranger",
    category: "Superhero",
    image:
      "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?auto=format&fit=crop&q=80&w=800",
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
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 6,
    name: "Wonder Woman",
    category: "Superhero",
    image:
      "https://images.unsplash.com/photo-1607914660217-754fdd90041d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 8,
    name: "Iron Man",
    category: "Superhero",
    image:
      "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 9,
    name: "Mikasa Ackerman",
    category: "Anime",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 10,
    name: "Captain America",
    category: "Superhero",
    image:
      "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 12,
    name: "Black Widow",
    category: "Superhero",
    image:
      "https://images.unsplash.com/photo-1608889476518-738c9b1dcb40?auto=format&fit=crop&q=80&w=800",
  },
];

export default CharactersPage;
