import React from "react";
import { Search } from "lucide-react";
import "../styles/CostumeRental.scss";

const SouvenirsPage = () => {
  return (
    <div className="costume-rental-page min-vh-100">
      {/* Hero Section */}
      <div className="hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Souvenirs Store</h1>
          <p className="lead text-center mt-3">
            Find and buy the perfect Souvenirs
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
                placeholder="Search costumes..."
              />
            </div>
          </div>
        </div>

        {/* Costume Grid */}
        <div className="costume-grid">
          {souvenirs.map((souvenir) => (
            <div className="costume-card" key={souvenir.id}>
              <div className="card-image">
                <img
                  src={souvenir.image}
                  alt={souvenir.name}
                  className="img-fluid"
                />
              </div>
              <div className="card-content">
                <h5 className="costume-name">{souvenir.name}</h5>
                <p className="costume-category">{souvenir.category}</p>
                <button className="rent-button">Buy now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const souvenirs = [
  {
    id: 1,
    name: "Naruto Hokage Figure  ",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.hinKeORphbJPDzUZwmzAbwHaHa?rs=1&pid=ImgDetMain", // Hình ảnh Naruto
  },
  {
    id: 2,
    name: "One Piece Luffy Keychain",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.HH2aK1Dh4aE5XifQ7HQsHAHaHa?w=654&h=655&rs=1&pid=ImgDetMain", // Móc khóa One Piece
  },
  {
    id: 3,
    name: "Attack on Titan Poster",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.2n1lTxCcTMak3wbi5CST1wHaLH?w=1066&h=1600&rs=1&pid=ImgDetMain", // Poster Attack on Titan
  },
  {
    id: 4,
    name: "Comiket Exclusive Badge",
    category: "Event Souvenir",
    image:
      "https://th.bing.com/th/id/OIP.WFSDm-g9-bxgC1VPgP3UEQHaHY?w=1500&h=1496&rs=1&pid=ImgDetMain", // Huy hiệu Comiket
  },
  {
    id: 5,
    name: "Anime Expo T-shirt",
    category: "Event Souvenir",
    image:
      "https://down-vn.img.susercontent.com/file/39c6fc24e158a695d78cc62e5349472e", // Áo thun Anime Expo
  },
  {
    id: 6,
    name: "Goku Figure",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.oAq64jTNwzi081joDeG2KAHaKe?rs=1&pid=ImgDetMain", // Hình ảnh Naruto
  },
  {
    id: 7,
    name: "Dragon Ball Keychain",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.buM88nQd7Hb1-nx8ksaTpwHaHa?w=700&h=700&rs=1&pid=ImgDetMain", // Móc khóa Dragonball
  },
  {
    id: 8,
    name: "Dragonball Poster",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.CZUyOjYgOkZ4ilvd7h2q1wHaLH?rs=1&pid=ImgDetMain", // Poster Dragonball
  },
];

export default SouvenirsPage;
