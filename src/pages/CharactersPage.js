import { Search } from "lucide-react";
import "../styles/CharactersPage.scss";

const CharactersPage = (props) => {
  return (
    <div className="characters-page min-vh-100 bg-light py-5">
      <div className="container">
        <h1 className="text-center display-4 fw-bold mb-5">
          Character Gallery
        </h1>

        {/* Search and Filter */}
        <div className="search-bar mb-4 mx-auto">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search className="text-muted" size={20} />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search characters..."
            />
          </div>
        </div>

        {/* Character Grid */}
        <div className="row g-4">
          {characters.map((character) => (
            <div className="col-md-3" key={character.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={character.image}
                  alt={character.name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{character.name}</h5>
                  <p className="card-text text-muted">{character.category}</p>
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
