// import React from "react";
// import { Search } from "lucide-react";
// import "../../styles/SouvenirsPage.scss";

// const SouvenirsPage = () => {
//   return (
//     <div className="costume-rental-page min-vh-100">
//       {/* Hero Section */}
//       <div className="hero-section text-white py-5">
//         <div className="container">
//           <h1 className="display-4 fw-bold text-center">Souvenir Store</h1>
//           <p className="lead text-center mt-3">
//             Find and buy the perfect souvenirs
//           </p>
//         </div>
//       </div>

//       <div className="container py-5">
//         {/* Search Bar */}
//         <div className="search-container mb-5">
//           <div className="search-bar mx-auto">
//             <div className="input-group">
//               <span className="input-group-text">
//                 <Search size={20} />
//               </span>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search souvenirs..."
//               />
//             </div>
//           </div>
//         </div>

//         {/* Costume Grid */}
//         <div className="costume-grid">
//           {souvenirs.map((souvenir) => (
//             <div className="costume-card" key={souvenir.id}>
//               <div className="card-image">
//                 <img
//                   src={souvenir.image}
//                   alt={souvenir.name}
//                   className="img-fluid"
//                 />
//               </div>
//               <div className="card-content">
//                 <h5 className="costume-name">{souvenir.name}</h5>
//                 <p className="costume-category">{souvenir.category}</p>
//                 <button className="rent-button">Buy Now!</button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const souvenirs = [
//   {
//     id: 1,
//     name: "Naruto Hokage Figure  ",
//     category: "Anime",
//     image:
//       "https://th.bing.com/th/id/OIP.hinKeORphbJPDzUZwmzAbwHaHa?rs=1&pid=ImgDetMain", // Hình ảnh Naruto
//   },
//   {
//     id: 2,
//     name: "One Piece Luffy Keychain",
//     category: "Anime",
//     image:
//       "https://th.bing.com/th/id/OIP.HH2aK1Dh4aE5XifQ7HQsHAHaHa?w=654&h=655&rs=1&pid=ImgDetMain", // Móc khóa One Piece
//   },
//   {
//     id: 3,
//     name: "Attack on Titan Poster",
//     category: "Anime",
//     image:
//       "https://th.bing.com/th/id/OIP.2n1lTxCcTMak3wbi5CST1wHaLH?w=1066&h=1600&rs=1&pid=ImgDetMain", // Poster Attack on Titan
//   },
//   {
//     id: 4,
//     name: "Comiket Exclusive Badge",
//     category: "Event Souvenir",
//     image:
//       "https://th.bing.com/th/id/OIP.WFSDm-g9-bxgC1VPgP3UEQHaHY?w=1500&h=1496&rs=1&pid=ImgDetMain", // Huy hiệu Comiket
//   },
//   {
//     id: 5,
//     name: "Anime Expo T-shirt",
//     category: "Event Souvenir",
//     image:
//       "https://down-vn.img.susercontent.com/file/39c6fc24e158a695d78cc62e5349472e", // Áo thun Anime Expo
//   },
//   {
//     id: 6,
//     name: "Goku Figure",
//     category: "Anime",
//     image:
//       "https://th.bing.com/th/id/OIP.oAq64jTNwzi081joDeG2KAHaKe?rs=1&pid=ImgDetMain", // Hình ảnh Naruto
//   },
//   {
//     id: 7,
//     name: "Dragon Ball Keychain",
//     category: "Anime",
//     image:
//       "https://th.bing.com/th/id/OIP.buM88nQd7Hb1-nx8ksaTpwHaHa?w=700&h=700&rs=1&pid=ImgDetMain", // Móc khóa Dragonball
//   },
//   {
//     id: 8,
//     name: "Dragonball Poster",
//     category: "Anime",
//     image:
//       "https://th.bing.com/th/id/OIP.CZUyOjYgOkZ4ilvd7h2q1wHaLH?rs=1&pid=ImgDetMain", // Poster Dragonball
//   },
// ];

// export default SouvenirsPage;

import React, { useState } from "react";
import { Search } from "lucide-react";
import { Modal, Button, Form, Carousel } from "react-bootstrap";
import "../../styles/SouvenirsPage.scss";

const SouvenirsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSouvenirModal, setShowSouvenirModal] = useState(false);
  const [selectedSouvenir, setSelectedSouvenir] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [souvenirType, setSouvenirType] = useState("Standard");
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  const handleSouvenirShow = (souvenir) => {
    setSelectedSouvenir(souvenir);
    setShowSouvenirModal(true);
  };

  const handleSouvenirClose = () => {
    setShowSouvenirModal(false);
    setSelectedSouvenir(null);
    setQuantity(1);
    setSouvenirType("Standard");
    setShowPurchaseForm(false);
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleBuyNow = () => {
    setShowPurchaseForm(true);
  };

  const filteredSouvenirs = souvenirs.filter((souvenir) =>
    souvenir.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="costume-rental-page min-vh-100">
      {/* Hero Section */}
      <div className="hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Souvenir Store</h1>
          <p className="lead text-center mt-3">
            Find and buy the perfect souvenirs
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
                placeholder="Search souvenirs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Souvenir Grid */}
        <div className="costume-grid">
          {filteredSouvenirs.map((souvenir) => (
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
                <button
                  className="rent-button"
                  onClick={() => handleSouvenirShow(souvenir)}
                >
                  Buy Now!
                </button>
              </div>
            </div>
          ))}
          {filteredSouvenirs.length === 0 && (
            <p className="text-center mt-4">No souvenirs found.</p>
          )}
        </div>
      </div>

      {/* Modal - 100% copied from FestivalPage */}
      <Modal
        show={showSouvenirModal}
        onHide={handleSouvenirClose}
        size="lg"
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedSouvenir?.name} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSouvenir && (
            <div className="costume-gallery">
              <Carousel className="gallery-carousel">
                {/* For simplicity, using single image; can expand with galleryImages */}
                <Carousel.Item>
                  <div className="carousel-image-container">
                    <img
                      className="d-block w-100"
                      src={selectedSouvenir.image}
                      alt={selectedSouvenir.name}
                    />
                  </div>
                  <Carousel.Caption>
                    <h3>{selectedSouvenir.name}</h3>
                    <p>Image 1 of 1</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>

              <div className="fest-details mt-4">
                <h4>About {selectedSouvenir.name}</h4>
                <p>
                  This is a high-quality {selectedSouvenir.category} souvenir,
                  perfect for collectors and fans alike!
                </p>
                <div className="fest-info">
                  <div className="fest-info-item">
                    <strong>Category:</strong> {selectedSouvenir.category}
                  </div>
                  <div className="fest-info-item">
                    <strong>Price:</strong> $
                    {souvenirType === "Standard"
                      ? 10
                      : souvenirType === "Deluxe"
                      ? 25
                      : 40}
                  </div>
                </div>

                <div className="fest-ticket-section mt-4">
                  <h5>Purchase Item</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Item Type</Form.Label>
                    <Form.Select
                      value={souvenirType}
                      onChange={(e) => setSouvenirType(e.target.value)}
                    >
                      <option value="Standard">Standard - $10</option>
                      <option value="Deluxe">Deluxe - $25</option>
                      <option value="Premium">Premium - $40</option>
                    </Form.Select>
                  </Form.Group>
                  <div className="fest-ticket-quantity mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        onClick={handleDecrease}
                        disabled={quantity === 1}
                      >
                        -
                      </Button>
                      <span className="mx-3">{quantity}</span>
                      <Button
                        variant="outline-secondary"
                        onClick={handleIncrease}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    className="fest-buy-ticket-btn"
                    onClick={handleBuyNow}
                  >
                    Buy Now - $
                    {souvenirType === "Standard"
                      ? 10 * quantity
                      : souvenirType === "Deluxe"
                      ? 25 * quantity
                      : 40 * quantity}
                  </Button>
                </div>

                {showPurchaseForm && (
                  <div className="fest-purchase-form mt-4">
                    <h5>Complete Your Purchase</h5>
                    <p>
                      Total: $
                      {souvenirType === "Standard"
                        ? 10 * quantity
                        : souvenirType === "Deluxe"
                        ? 25 * quantity
                        : 40 * quantity}{" "}
                      ({quantity} x {souvenirType})
                    </p>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your full name"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="Enter your phone number"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Select>
                          <option value="credit">Credit Card</option>
                          <option value="paypal">PayPal</option>
                          <option value="cash">Cash on Delivery</option>
                        </Form.Select>
                      </Form.Group>
                      <Button
                        variant="success"
                        className="fest-confirm-purchase-btn"
                        type="submit"
                      >
                        Confirm Purchase
                      </Button>
                    </Form>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

const souvenirs = [
  {
    id: 1,
    name: "Naruto Hokage Figure",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.hinKeORphbJPDzUZwmzAbwHaHa?rs=1&pid=ImgDetMain",
  },
  {
    id: 2,
    name: "One Piece Luffy Keychain",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.HH2aK1Dh4aE5XifQ7HQsHAHaHa?w=654&h=655&rs=1&pid=ImgDetMain",
  },
  {
    id: 3,
    name: "Attack on Titan Poster",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.2n1lTxCcTMak3wbi5CST1wHaLH?w=1066&h=1600&rs=1&pid=ImgDetMain",
  },
  {
    id: 4,
    name: "Comiket Exclusive Badge",
    category: "Event Souvenir",
    image:
      "https://th.bing.com/th/id/OIP.WFSDm-g9-bxgC1VPgP3UEQHaHY?w=1500&h=1496&rs=1&pid=ImgDetMain",
  },
  {
    id: 5,
    name: "Anime Expo T-shirt",
    category: "Event Souvenir",
    image:
      "https://down-vn.img.susercontent.com/file/39c6fc24e158a695d78cc62e5349472e",
  },
  {
    id: 6,
    name: "Goku Figure",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.oAq64jTNwzi081joDeG2KAHaKe?rs=1&pid=ImgDetMain",
  },
  {
    id: 7,
    name: "Dragon Ball Keychain",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.buM88nQd7Hb1-nx8ksaTpwHaHa?w=700&h=700&rs=1&pid=ImgDetMain",
  },
  {
    id: 8,
    name: "Dragonball Poster",
    category: "Anime",
    image:
      "https://th.bing.com/th/id/OIP.CZUyOjYgOkZ4ilvd7h2q1wHaLH?rs=1&pid=ImgDetMain",
  },
];

export default SouvenirsPage;