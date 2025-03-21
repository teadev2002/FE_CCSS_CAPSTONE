import React, { useState } from "react";
import { Search } from "lucide-react";
import { Tag } from "antd";
import { Modal, Button, Form, Carousel } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "../../styles/FestivalsPage.scss";

const FestivalsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFestivalModal, setShowFestivalModal] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [ticketType, setTicketType] = useState("Standard");
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  const { category } = useParams();
  const selectedCategory = category || "all";

  const handleFestivalShow = (festival) => {
    setSelectedFestival(festival);
    setShowFestivalModal(true);
  };

  const handleFestivalClose = () => {
    setShowFestivalModal(false);
    setSelectedFestival(null);
    setTicketQuantity(1);
    setTicketType("Standard");
    setShowPurchaseForm(false);
  };

  const handleIncrease = () => setTicketQuantity((prev) => prev + 1);
  const handleDecrease = () =>
    setTicketQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleBuyNow = () => {
    setShowPurchaseForm(true);
  };

  const filteredFestivals = mockFestivals.filter((festival) => {
    const matchesCategory =
      selectedCategory === "all" ||
      festival.Type.toLowerCase().replace(" ", "-") === selectedCategory.toLowerCase();
    const matchesSearch = festival.Name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fest-page min-vh-100">
      <div className="fest-hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Festival Gallery</h1>
          <p className="lead text-center mt-3">
            Explore epic cosplay festivals and events!
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="fest-search-container mb-5">
          <div className="fest-search-bar mx-auto">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={20} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search festivals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="fest-grid">
          {filteredFestivals.map((festival, index) => (
            <div className="fest-card" key={index}>
              <div className="fest-card-image">
                <img src={festival.Image} alt={festival.Name} />
              </div>
              <div className="fest-card-content">
                <h5 className="fest-name">{festival.Name}</h5>
                <p className="fest-description">{festival.Description}</p>
                <div className="fest-meta">
                  <Tag color="purple">{festival.Type}</Tag>
                  <span className="fest-date">
                    {new Date(festival.CreateDate).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="fest-learn-more-btn"
                  onClick={() => handleFestivalShow(festival)}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
          {filteredFestivals.length === 0 && (
            <p className="text-center mt-4">No festivals found.</p>
          )}
        </div>
      </div>

      <Modal
        show={showFestivalModal}
        onHide={handleFestivalClose}
        size="lg"
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedFestival?.Name} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFestival && (
            <div className="costume-gallery">
              <Carousel className="gallery-carousel">
                {selectedFestival.galleryImages.map((image, index) => (
                  <Carousel.Item key={index}>
                    <div className="carousel-image-container">
                      <img
                        className="d-block w-100"
                        src={image}
                        alt={`${selectedFestival.Name} - Image ${index + 1}`}
                      />
                    </div>
                    <Carousel.Caption>
                      <h3>{selectedFestival.Name}</h3>
                      <p>{`Image ${index + 1} of ${selectedFestival.galleryImages.length}`}</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>

              <div className="fest-details mt-4">
                <h4>About {selectedFestival.Name}</h4>
                <p>{selectedFestival.FullDescription}</p>
                <div className="fest-info">
                  <div className="fest-info-item">
                    <strong>Type:</strong> {selectedFestival.Type}
                  </div>
                  <div className="fest-info-item">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedFestival.CreateDate).toLocaleDateString()}
                  </div>
                  <div className="fest-info-item">
                    <strong>Location:</strong> {selectedFestival.Location}
                  </div>
                </div>

                {/* Phần danh sách cosplayer - Đã đồng bộ với giao diện modal */}
                {selectedFestival.cosplayers && selectedFestival.cosplayers.length > 0 && (
                  <div
                    style={{
                      marginTop: "1.5rem", // Thêm khoảng cách phía trên để đồng bộ với các phần khác
                      marginBottom: "1.5rem", // Thêm khoảng cách phía dưới để đồng bộ với các phần khác
                    }}
                  >
                    {/* Tiêu đề phần */}
                    <h5
                      style={{
                        color: "#4a4a4a", // Đồng bộ màu với các tiêu đề khác trong modal (như "About", "Purchase Tickets")
                        fontWeight: 600,
                        marginBottom: "1rem",
                      }}
                    >
                      Participating Cosplayers
                    </h5>
                    {/* Container chứa danh sách cosplayer */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      {selectedFestival.cosplayers.map((cosplayer, index) => (
                        <div
                          key={index}
                          style={{
                            flex: "1 1 calc(25% - 1rem)", // 4 cột trên màn hình lớn
                            minWidth: "200px", // Chiều rộng tối thiểu cho mỗi card
                            background: "white",
                            borderRadius: "0.5rem",
                            overflow: "hidden",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                            display: "flex",
                            flexDirection: "column",
                            transition: "transform 0.3s ease",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                          {/* Hình ảnh cosplayer */}
                          <div
                            style={{
                              width: "100%",
                              height: "200px", // Chiều cao cố định cho hình ảnh
                              overflow: "hidden",
                              backgroundColor: "#f0f0f0", // Màu nền dự phòng nếu hình không tải được
                            }}
                          >
                            <img
                              src={cosplayer.image}
                              alt={cosplayer.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover", // Đảm bảo hình ảnh vừa khung, không méo
                                transition: "transform 0.3s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                              onError={(e) => (e.currentTarget.style.display = "none")} // Ẩn hình nếu không tải được
                            />
                          </div>
                          {/* Thông tin cosplayer */}
                          <div
                            style={{
                              padding: "1rem",
                              textAlign: "center",
                            }}
                          >
                            <h6
                              style={{
                                color: "#4a4a4a", // Đồng bộ màu với các văn bản khác trong modal
                                fontWeight: 600,
                                marginBottom: "0.5rem",
                              }}
                            >
                              {cosplayer.name}
                            </h6>
                            <p
                              style={{
                                color: "#4a4a4a", // Đồng bộ màu với các văn bản khác trong modal
                                fontSize: "0.9rem",
                                margin: 0,
                              }}
                            >
                              {cosplayer.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="fest-ticket-section mt-4">
                  <h5>Purchase Tickets</h5>
                  <Form.Group className="mb-3">
                    <Form.Label>Ticket Type</Form.Label>
                    <Form.Select
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value)}
                    >
                      <option value="Standard">Standard - $20</option>
                      <option value="VIP">VIP - $50</option>
                      <option value="Premium">Premium - $80</option>
                    </Form.Select>
                  </Form.Group>
                  <div className="fest-ticket-quantity mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        onClick={handleDecrease}
                        disabled={ticketQuantity === 1}
                      >
                        -
                      </Button>
                      <span className="mx-3">{ticketQuantity}</span>
                      <Button variant="outline-secondary" onClick={handleIncrease}>
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
                    {ticketType === "Standard"
                      ? 20 * ticketQuantity
                      : ticketType === "VIP"
                      ? 50 * ticketQuantity
                      : 80 * ticketQuantity}
                  </Button>
                </div>

                {showPurchaseForm && (
                  <div className="fest-purchase-form mt-4">
                    <h5>Complete Your Purchase</h5>
                    <p>
                      Total: $
                      {ticketType === "Standard"
                        ? 20 * ticketQuantity
                        : ticketType === "VIP"
                        ? 50 * ticketQuantity
                        : 80 * ticketQuantity}{" "}
                      ({ticketQuantity} x {ticketType})
                    </p>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter your full name" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="Enter your email" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="tel" placeholder="Enter your phone number" />
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

const mockFestivals = [
  {
    Name: "Anime Odyssey Festival",
    Image: "https://danangfantasticity.com/wp-content/uploads/2024/07/nippon-oi-2024-le-hoi-cosplay-anime-va-manga-lon-nhat-mien-trung-05.jpg",
    Description: "A paradise for anime fans with cosplay contests and more!",
    FullDescription: "Dive into the world of anime at Anime Odyssey Festival! Enjoy cosplay competitions, voice actor meet-and-greets, and exclusive merchandise stalls.",
    Type: "Anime",
    CreateDate: "2025-03-15",
    Location: "Tokyo Convention Center",
    galleryImages: [
      "https://danangfantasticity.com/wp-content/uploads/2024/07/nippon-oi-2024-le-hoi-cosplay-anime-va-manga-lon-nhat-mien-trung-05.jpg",
      "https://www.gento.vn/wp-content/uploads/2024/03/cosplay-la-gi-14.jpg",
      "https://www.gento.vn/wp-content/uploads/2024/03/cosplay-la-gi-13.jpg",
    ],
    cosplayers: [
      { name: "Yuki-chan", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
      { name: "Kaito-kun", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
      { name: "Sakura", role: "Guest Judge", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
    ],
  },
  {
    Name: "Comic Con Galaxy",
    Image: "https://pix11.com/wp-content/uploads/sites/25/2020/08/ny-comic-con-1-2.jpg?strip=1",
    Description: "The ultimate comic and superhero celebration!",
    FullDescription: "Comic Con Galaxy brings together comic book fans, superhero cosplayers, and artists for a weekend of panels, autograph sessions, and epic battles.",
    Type: "Comic Con",
    CreateDate: "2025-04-20",
    Location: "Metropolis Arena",
    galleryImages: [
      "https://pix11.com/wp-content/uploads/sites/25/2020/08/ny-comic-con-1-2.jpg?strip=1",
      "https://media.istockphoto.com/id/614151120/photo/busy-stalls-at-yorkshire-cosplay-convention.jpg?s=612x612&w=0&k=20&c=rpd8JXNCfczRL-2diufRIxeL7XktNPpt6_sJD5hP4mQ=",
      "https://images.axios.com/2d8dxRa5tJN0XqYUsBWDQ7NJ1IE=/0x0:4032x2268/1920x1080/2024/02/11/1707678270332.jpg",
    ],
    cosplayers: [
      { name: "HeroMaster", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
      { name: "VillainQueen", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
    ],
  },
  {
    Name: "Mythic Fest",
    Image: "https://esosslfiles-a.akamaihd.net/ape/uploads/2023/09/0db57c551bed0a4e7f25e31a3a603891.jpg",
    Description: "Celebrate gods, heroes, and mythical creatures!",
    FullDescription: "Step into the realm of mythology at Mythic Fest, featuring cosplay of gods and heroes, storytelling sessions, and ancient-themed workshops.",
    Type: "Mythology",
    CreateDate: "2025-05-10",
    Location: "Olympus Plaza",
    galleryImages: [
      "https://esosslfiles-a.akamaihd.net/ape/uploads/2023/09/0db57c551bed0a4e7f25e31a3a603891.jpg",
      "https://i.pinimg.com/474x/7b/34/e5/7b34e54335282b639b8e0661de00730c.jpg",
      "https://i.redd.it/htjtf1wolr341.jpg",
    ],
    cosplayers: [
      { name: "ZeusCos", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
      { name: "AthenaStar", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
    ],
  },
  {
    Name: "Gamer’s Realm Expo",
    Image: "https://imagenesyogonet.b-cdn.net/data/imagenes/2021/12/01/41082/1638368820-stand-merkur-gaming-industry-exhibition-ukraine-2021.jpg",
    Description: "The ultimate gaming and cosplay showdown!",
    FullDescription: "Gamer’s Realm Expo is a haven for gaming enthusiasts with cosplay contests, esports tournaments, and exclusive game reveals.",
    Type: "Gaming",
    CreateDate: "2025-06-01",
    Location: "Virtual City Arena",
    galleryImages: [
      "https://imagenesyogonet.b-cdn.net/data/imagenes/2021/12/01/41082/1638368820-stand-merkur-gaming-industry-exhibition-ukraine-2021.jpg",
      "https://images.wsj.net/im-961206?width=700&height=466",
      "https://st.przx.ru/files/content/ekb/WARPOINT/%D0%9A%D0%B0%D1%80%D0%BD%D0%B0%D0%B2%D0%B0%D0%BB/warpoint-karnaval-5.jpg",
    ],
    cosplayers: [
      { name: "PixelKnight", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
      { name: "GameWizard", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
    ],
  },
  {
    Name: "Superhero Summit",
    Image: "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2022/12/02174651/Comic-Con-2-1600x900.jpg",
    Description: "Unite with your favorite heroes and villains!",
    FullDescription: "Superhero Summit is where caped crusaders and villains clash in cosplay glory, with stunt shows, comic workshops, and superhero meetups.",
    Type: "Superhero",
    CreateDate: "2025-07-15",
    Location: "Gotham Convention Center",
    galleryImages: [
      "https://images.travelandleisureasia.com/wp-content/uploads/sites/2/2022/12/02174651/Comic-Con-2-1600x900.jpg",
      "https://files.prokerala.com/news/photos/imgs/1024/new-delhi-people-visit-delhi-comic-con-2023-1671986.jpg",
      "https://i0.wp.com/www.smartprix.com/bytes/wp-content/uploads/2022/12/comiccon4.jpg?ssl=1",
    ],
    cosplayers: [
      { name: "SuperCape", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
      { name: "DarkHero", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
    ],
  },
  {
    Name: "Cosplay Carnival",
    Image: "https://static.tuoitrenews.vn/ttnew/r/2024/03/09/japan-vietnam-festival-7-1710000118.jpg",
    Description: "A vibrant celebration of all things cosplay!",
    FullDescription: "Cosplay Carnival is a colorful festival of creativity, featuring costume parades, crafting workshops, and a grand cosplay showdown.",
    Type: "Cosplay",
    CreateDate: "2025-08-20",
    Location: "Cosplay Village",
    galleryImages: [
      "https://static.tuoitrenews.vn/ttnew/r/2024/03/09/japan-vietnam-festival-7-1710000118.jpg",
      "https://riki.edu.vn/goc-chia-se/wp-content/uploads/2020/02/cosplay-2.jpeg",
      "https://mcdn.coolmate.me/image/May2022/top-le-hoi-cosplay-festival-noi-tieng_735.jpg",
    ],
    cosplayers: [
      { name: "CosplayStar", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
      { name: "CraftMaster", role: "Cosplayer", image: "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg" },
    ],
  },
];

export default FestivalsPage;