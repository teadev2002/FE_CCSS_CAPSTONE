import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Carousel, Row, Col, Form, Button } from "react-bootstrap";
import { Shirt, CalendarDays, Users, ShoppingBag, Ticket } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Range } from "react-range";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/HomePage.scss";
import CharacterService from "../../services/HomePageService/CharacterService";

const HomePage = () => {
  // State for storing characters from API
  const [characters, setCharacters] = useState([]);
  // State for filtered characters (after search/filter)
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  // State for current page in pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State to track if user has manually selected a page
  const [isPageManuallySelected, setIsPageManuallySelected] = useState(false);
  // Default filter values
  const defaultSearchParams = {
    characterName: "",
    price: [0, 1000000], // Range for price (0 to 1,000,000 VND)
    height: [100, 200], // Range for height (100cm to 200cm)
    weight: [20, 100], // Range for weight (20kg to 100kg)
  };
  // State for search and filter parameters
  const [searchParams, setSearchParams] = useState(defaultSearchParams);
  // Number of characters per page
  const charactersPerPage = 8;

  // Format price to VND
  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Fetch characters from API
  const fetchCharacters = useCallback(async () => {
    try {
      const data = await CharacterService.getAllCharacters();
      setCharacters(data);
      setFilteredCharacters(data); // Initially display all characters
    } catch (error) {
      toast.error(error.message); // Show error if API fails
    }
  }, []);

  // Call API when component mounts
  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Auto-rotate pages with dynamic timing
  useEffect(() => {
    // Use 30s if user has manually selected a page, otherwise 8s
    const intervalTime = isPageManuallySelected ? 30000 : 8000;
    const timer = setInterval(() => {
      setCurrentPage((prev) => {
        const maxPage = Math.ceil(filteredCharacters.length / charactersPerPage);
        return prev >= maxPage ? 1 : prev + 1; // Return to page 1 if end reached
      });
    }, intervalTime);
    return () => clearInterval(timer); // Clear timer on component unmount
  }, [filteredCharacters, isPageManuallySelected]);

  // Handle search and filter
  const handleSearch = () => {
    const filtered = characters.filter((char) => {
      // Search by characterName (case-insensitive)
      const nameMatch = searchParams.characterName
        ? char.characterName
            .toLowerCase()
            .includes(searchParams.characterName.toLowerCase())
        : true;
      // Filter by price range
      const priceMatch =
        char.price >= searchParams.price[0] &&
        char.price <= searchParams.price[1];
      // Filter by height range (minHeight and maxHeight must fall within range)
      const heightMatch =
        char.minHeight >= searchParams.height[0] &&
        char.maxHeight <= searchParams.height[1];
      // Filter by weight range (minWeight and maxWeight must fall within range)
      const weightMatch =
        char.minWeight >= searchParams.weight[0] &&
        char.maxWeight <= searchParams.weight[1];
      // All conditions must be true
      return nameMatch && priceMatch && heightMatch && weightMatch;
    });
    setFilteredCharacters(filtered);
    setCurrentPage(1); // Reset to page 1 after search/filter
    setIsPageManuallySelected(false); // Reset manual selection state
  };

  // Handle input changes for search
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Handle range slider changes
  const handleRangeChange = (name, values) => {
    setSearchParams((prev) => ({ ...prev, [name]: values }));
  };

  // Handle cancel search and filter
  const handleCancel = () => {
    setSearchParams(defaultSearchParams);
    setFilteredCharacters(characters); // Reset to all characters
    setCurrentPage(1); // Reset to page 1
    setIsPageManuallySelected(false); // Reset manual selection state
  };

  // Handle page navigation
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsPageManuallySelected(true); // Mark as manually selected
  };

  // Handle previous page
  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
    setIsPageManuallySelected(true); // Mark as manually selected
  };

  // Handle next page
  const handleNext = () => {
    const maxPage = Math.ceil(filteredCharacters.length / charactersPerPage);
    setCurrentPage((prev) => (prev < maxPage ? prev + 1 : prev));
    setIsPageManuallySelected(true); // Mark as manually selected
  };

  // Decode JWT and show welcome message
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;
    try {
      const decoded = jwtDecode(accessToken);
      const accountName = decoded?.AccountName;
      if (accountName) {
        toast.success(`Welcome, ${accountName}!`);
      }
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, []);

  // Pagination logic for Character List
  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = filteredCharacters.slice(
    indexOfFirstCharacter,
    indexOfLastCharacter
  );
  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);

  return (
    <div className="homepage">
      <ToastContainer />
      {/* Carousel remains unchanged */}
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

      {/* Character List section replacing Highlight Cosplayers */}
      <div className="custom-section featured-characters py-5">
        <h2 className="text-center fw-bold mb-5">Character List</h2>

        {/* Search and Filter Bar */}
        <div className="search-filter-container mb-5">
          <Form className="search-filter-form">
            {/* Top Row: Search and Price Range */}
            <Row className="g-4 justify-content-center mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Character Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="characterName"
                    value={searchParams.characterName}
                    onChange={handleInputChange}
                    placeholder="Enter character name"
                    className="search-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Price Range (VND)</Form.Label>
                  <Range
                    step={1000}
                    min={0}
                    max={1000000}
                    values={searchParams.price}
                    onChange={(values) => handleRangeChange("price", values)}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="range-track"
                        style={{
                          ...props.style,
                          height: "8px",
                          width: "100%",
                          background: `linear-gradient(to right, #f85caa 0%, #f85caa ${
                            ((searchParams.price[0] - 0) / 1000000) * 100
                          }%, #d3d3d3 ${
                            ((searchParams.price[0] - 0) / 1000000) * 100
                          }%, #d3d3d3 ${
                            ((searchParams.price[1] - 0) / 1000000) * 100
                          }%, #f85caa ${
                            ((searchParams.price[1] - 0) / 1000000) * 100
                          }%, #f85caa 100%)`,
                          borderRadius: "5px",
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="range-thumb"
                        style={{
                          ...props.style,
                          height: "20px",
                          width: "20px",
                          backgroundColor: "#510545",
                          borderRadius: "50%",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                    )}
                  />
                  <div className="range-values">
                    {formatPrice(searchParams.price[0])} -{" "}
                    {formatPrice(searchParams.price[1])}
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {/* Bottom Row: Height and Weight Range */}
            <Row className="g-4 justify-content-center mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Height Range (cm)</Form.Label>
                  <Range
                    step={1}
                    min={100}
                    max={200}
                    values={searchParams.height}
                    onChange={(values) => handleRangeChange("height", values)}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="range-track"
                        style={{
                          ...props.style,
                          height: "8px",
                          width: "100%",
                          background: `linear-gradient(to right, #f85caa 0%, #f85caa ${
                            ((searchParams.height[0] - 100) / 100) * 100
                          }%, #d3d3d3 ${
                            ((searchParams.height[0] - 100) / 100) * 100
                          }%, #d3d3d3 ${
                            ((searchParams.height[1] - 100) / 100) * 100
                          }%, #f85caa ${
                            ((searchParams.height[1] - 100) / 100) * 100
                          }%, #f85caa 100%)`,
                          borderRadius: "5px",
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="range-thumb"
                        style={{
                          ...props.style,
                          height: "20px",
                          width: "20px",
                          backgroundColor: "#510545",
                          borderRadius: "50%",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                    )}
                  />
                  <div className="range-values">
                    {searchParams.height[0]} cm - {searchParams.height[1]} cm
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Weight Range (kg)</Form.Label>
                  <Range
                    step={1}
                    min={20}
                    max={100}
                    values={searchParams.weight}
                    onChange={(values) => handleRangeChange("weight", values)}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        className="range-track"
                        style={{
                          ...props.style,
                          height: "8px",
                          width: "100%",
                          background: `linear-gradient(to right, #f85caa 0%, #f85caa ${
                            ((searchParams.weight[0] - 20) / 80) * 100
                          }%, #d3d3d3 ${
                            ((searchParams.weight[0] - 20) / 80) * 100
                          }%, #d3d3d3 ${
                            ((searchParams.weight[1] - 20) / 80) * 100
                          }%, #f85caa ${
                            ((searchParams.weight[1] - 20) / 80) * 100
                          }%, #f85caa 100%)`,
                          borderRadius: "5px",
                        }}
                      >
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        className="range-thumb"
                        style={{
                          ...props.style,
                          height: "20px",
                          width: "20px",
                          backgroundColor: "#510545",
                          borderRadius: "50%",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                    )}
                  />
                  <div className="range-values">
                    {searchParams.weight[0]} kg - {searchParams.weight[1]} kg
                  </div>
                </Form.Group>
              </Col>
            </Row>
            {/* Buttons */}
            <Row className="g-4 justify-content-center">
              <Col md={6} className="text-center">
                <Button className="search-button" onClick={handleSearch}>
                  Apply Filters
                </Button>
              </Col>
              <Col md={6} className="text-center">
                <Button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        {/* Character Grid */}
        <ul className="card-list">
          {currentCharacters.map((character) => (
            <li className="character-card" key={character.characterId}>
              <div className="card-inner">
                <div className="card-front">
                  <img
                    src={
                      character.images?.[0] ||
                      "https://via.placeholder.com/250x350?text=No+Image"
                    }
                    alt={character.characterName}
                    className="card-img-top"
                  />
                  <div className="card-content">
                    <h3>{character.characterName}</h3>
                    <p className="character-description">
                      {character.description}
                    </p>
                    <p className="character-height">
                      Height: {character.minHeight}cm - {character.maxHeight}cm
                    </p>
                    <p className="character-weight">
                      Weight: {character.minWeight}kg - {character.maxWeight}kg
                    </p>
                    <span className="category-badge">
                      {formatPrice(character.price)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination Controls */}
        <div className="pagination-controls text-center mt-4">
          <Button
            className="pagination-arrow"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <Button
                key={page}
                className={`pagination-number ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            )
          )}
          <Button
            className="pagination-arrow"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
        </div>

        <div className="text-center mt-4">
          <Link to="/cosplayers" className="view-all-button">
            Hire Cosplayers
          </Link>
        </div>
      </div>

      {/* About Us section remains unchanged */}
      <div className="custom-section about-us py-5">
        <Row className="align-items-center">
          <Col md={12}>
            <h2 className="text-center fw-bold mb-4">About Us</h2>
          </Col>
          <Col md={6}>
            <p className="text-muted mb-4 text-center">
              Welcome to CCSS – your one-stop destination for all things cosplay!
              Our passionate team brings creativity, authenticity, and excitement
              to every event, costume, and experience. Explore our world of
              cosplay and let’s make your fandom dreams come true!
            </p>
          </Col>
          <Col md={6}>
            <div className="about-us-image-wrapper">
              <img
                src="https://c4.wallpaperflare.com/wallpaper/721/4/835/cosplay-nier-automata-2b-no-2-yorha-wallpaper-preview.jpg"
                alt="About Us"
                className="img-fluid rounded shadow about-us-image"
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Featured Services section remains unchanged */}
      <div className="custom-section featured-services py-5">
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
        <div className="text-center mt-4">
          <Link to="/services" className="view-all-button">
            View All Services
          </Link>
        </div>
      </div>
    </div>
  );
};

// Carousel and services data remain unchanged
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
  {
    title: "Souvenirs Shop",
    description: "Discover unique keepsakes to cherish your cosplay memories.",
    icon: <ShoppingBag size={40} className="service-icon" />,
  },
  {
    title: "Buy Festival Tickets",
    description: "Get tickets to join events and meet our amazing cosplayers!",
    icon: <Ticket size={40} className="service-icon" />,
  },
];

export default HomePage;