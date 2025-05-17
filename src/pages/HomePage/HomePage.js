// src/pages/HomePage.jsx

import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Carousel, Row, Col, Form, Button } from "react-bootstrap";
import {
  Shirt,
  CalendarDays,
  Users,
  ShoppingBag,
  Ticket,
  Star,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Range } from "react-range";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/HomePage.scss";
import CharacterService from "../../services/HomePageService/CharacterService";
import CosplayerService from "../../services/HomePageService/CosplayerService";

const HomePage = () => {
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập
  const getUserInfoFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return {
          id: decoded?.Id,
          role: decoded?.role,
          accountName: decoded?.AccountName,
        };
      } catch (error) {
        console.error("Error decoding token:", error);
        return { id: null, role: null, accountName: null };
      }
    }
    return { id: null, role: null, accountName: null };
  };

  // Xử lý nút Hire Cosplayers
  const handleHireCosplayers = () => {
    const { id } = getUserInfoFromToken();
    if (!id) {
      toast.warn("Please log in to hire cosplayers!", {
        position: "top-right",
        autoClose: 2100,
      });
      setTimeout(() => navigate("/login"), 2100);
    } else {
      navigate("/cosplayers");
    }
  };

  // State cho Character List
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [currentPageCharacters, setCurrentPageCharacters] = useState(1);
  const [
    isPageManuallySelectedCharacters,
    setIsPageManuallySelectedCharacters,
  ] = useState(false);
  const [characterImages, setCharacterImages] = useState({});
  const defaultCharacterSearchParams = {
    characterName: "",
    price: [0, 1000000],
    height: [100, 200],
    weight: [20, 100],
  };
  const [characterSearchParams, setCharacterSearchParams] = useState(
    defaultCharacterSearchParams
  );
  const charactersPerPage = 8;

  // State cho Cosplayer List
  const [cosplayers, setCosplayers] = useState([]);
  const [filteredCosplayers, setFilteredCosplayers] = useState([]);
  const [currentPageCosplayers, setCurrentPageCosplayers] = useState(1);
  const [
    isPageManuallySelectedCosplayers,
    setIsPageManuallySelectedCosplayers,
  ] = useState(false);
  const [cosplayerImages, setCosplayerImages] = useState({});
  const defaultCosplayerSearchParams = {
    cosplayerName: "",
    averageStar: [0, 5],
    height: [100, 200],
    weight: [20, 100],
    hourlyRate: [0, 100000],
  };
  const [cosplayerSearchParams, setCosplayerSearchParams] = useState(
    defaultCosplayerSearchParams
  );
  const cosplayersPerPage = 8;

  // State cho About Us image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const aboutUsImages = [
    "https://c4.wallpaperflare.com/wallpaper/721/4/835/cosplay-nier-automata-2b-no-2-yorha-wallpaper-preview.jpg",
    "https://a-static.besthdwallpaper.com/war-devil-chainsaw-man-cosplay-wallpaper-3554x1999-106179_53.jpg",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjBoUf4Egm_PQxM-WvR-WtIJyl-Y5mdeIRyjKifGY28VO7_2JQ5ckEYXpYdLYB-ieyphOMmDAxsaue0Rcsiai8EAIUgrJFNL83uEKJ7waO4XXQymj1t7gLLo7XjCIkKZ924rczPtuVCJ7LP/w919/cyberpunk-2077-girl-cosplay-uhdpaper.com-4K-8.2173-wp.thumbnail.jpg",
  ];

  // Format giá tiền VND
  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Format giá tiền thuê cosplayer (per hour)
  const formatHourlyRate = (rate) => {
    return `${rate.toLocaleString("vi-VN")}/h VND`;
  };

  // Phân trang cho Character List
  const indexOfLastCharacter = currentPageCharacters * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  const currentCharacters = filteredCharacters.slice(
    indexOfFirstCharacter,
    indexOfLastCharacter
  );
  const totalPagesCharacters = Math.ceil(
    filteredCharacters.length / charactersPerPage
  );

  // Phân trang cho Cosplayer List
  const indexOfLastCosplayer = currentPageCosplayers * cosplayersPerPage;
  const indexOfFirstCosplayer = indexOfLastCosplayer - cosplayersPerPage;
  const currentCosplayers = filteredCosplayers.slice(
    indexOfFirstCosplayer,
    indexOfLastCosplayer
  );
  const totalPagesCosplayers = Math.ceil(
    filteredCosplayers.length / cosplayersPerPage
  );

  // Lấy danh sách nhân vật
  const fetchCharacters = useCallback(async () => {
    try {
      const data = await CharacterService.getAllCharacters();
      setCharacters(data);
      setFilteredCharacters(data);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  // Lấy hình ảnh nhân vật
  const fetchCharacterImage = async (characterId) => {
    if (characterImages[characterId]) return;
    try {
      const characterData = await CharacterService.getCharacterById(
        characterId
      );
      setCharacterImages((prev) => ({
        ...prev,
        [characterId]:
          characterData.images?.[0]?.urlImage ||
          "https://via.placeholder.com/200x300?text=No+Image",
      }));
    } catch (error) {
      console.error(
        `Error fetching image for character ${characterId}:`,
        error
      );
      setCharacterImages((prev) => ({
        ...prev,
        [characterId]: "https://via.placeholder.com/200x300?text=No+Image",
      }));
      toast.error(error.message);
    }
  };

  // Lấy danh sách cosplayer (chỉ lấy những cosplayer có isActive: true)
  const fetchCosplayers = useCallback(async () => {
    try {
      const data = await CosplayerService.getAllCosplayers();
      const cosplayersArray = Array.isArray(data) ? data : [data];
      // Lọc cosplayer có isActive: true
      const activeCosplayers = cosplayersArray.filter(
        (cosplayer) => cosplayer.isActive === true
      );
      setCosplayers(activeCosplayers);
      setFilteredCosplayers(activeCosplayers);
    } catch (error) {
      toast.error(error.message);
    }
  }, []);

  // Lấy hình ảnh cosplayer
  const fetchCosplayerImage = (cosplayer) => {
    if (cosplayerImages[cosplayer.accountId]) return;
    const imageUrl =
      cosplayer.images?.[0]?.urlImage ||
      "https://via.placeholder.com/200x300?text=No+Image";
    setCosplayerImages((prev) => ({
      ...prev,
      [cosplayer.accountId]: imageUrl,
    }));
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchCharacters();
    fetchCosplayers();
  }, [fetchCharacters, fetchCosplayers]);

  // Lấy hình ảnh cho các nhân vật/cosplayer hiện tại
  useEffect(() => {
    currentCharacters.forEach((character) => {
      fetchCharacterImage(character.characterId);
    });
    currentCosplayers.forEach((cosplayer) => {
      fetchCosplayerImage(cosplayer);
    });
  }, [currentCharacters, currentCosplayers]);

  // Tự động chuyển trang cho Character List
  useEffect(() => {
    const intervalTime = isPageManuallySelectedCharacters ? 30000 : 8000;
    const timer = setInterval(() => {
      setCurrentPageCharacters((prev) => {
        const maxPage = Math.ceil(
          filteredCharacters.length / charactersPerPage
        );
        return prev >= maxPage ? 1 : prev + 1;
      });
    }, intervalTime);
    return () => clearInterval(timer);
  }, [filteredCharacters, isPageManuallySelectedCharacters]);

  // Tự động chuyển trang cho Cosplayer List
  useEffect(() => {
    const intervalTime = isPageManuallySelectedCosplayers ? 30000 : 8000;
    const timer = setInterval(() => {
      setCurrentPageCosplayers((prev) => {
        const maxPage = Math.ceil(
          filteredCosplayers.length / cosplayersPerPage
        );
        return prev >= maxPage ? 1 : prev + 1;
      });
    }, intervalTime);
    return () => clearInterval(timer);
  }, [filteredCosplayers, isPageManuallySelectedCosplayers]);

  // Tự động chuyển hình cho About Us
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % aboutUsImages.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [aboutUsImages.length]);

  // Xử lý tìm kiếm và lọc cho Character List
  const handleCharacterSearch = () => {
    const filtered = characters.filter((char) => {
      const nameMatch = characterSearchParams.characterName
        ? char.characterName
          .toLowerCase()
          .includes(characterSearchParams.characterName.toLowerCase())
        : true;
      const priceMatch =
        char.price >= characterSearchParams.price[0] &&
        char.price <= characterSearchParams.price[1];
      const heightMatch =
        char.minHeight >= characterSearchParams.height[0] &&
        char.maxHeight <= characterSearchParams.height[1];
      const weightMatch =
        char.minWeight >= characterSearchParams.weight[0] &&
        char.maxWeight <= characterSearchParams.weight[1];
      return nameMatch && priceMatch && heightMatch && weightMatch;
    });
    setFilteredCharacters(filtered);
    setCurrentPageCharacters(1);
    setIsPageManuallySelectedCharacters(false);
  };

  // Xử lý tìm kiếm và lọc cho Cosplayer List (chỉ lấy cosplayer có isActive: true)
  const handleCosplayerSearch = () => {
    const filtered = cosplayers.filter((cosplayer) => {
      const nameMatch = cosplayerSearchParams.cosplayerName
        ? cosplayer.name
          .toLowerCase()
          .includes(cosplayerSearchParams.cosplayerName.toLowerCase())
        : true;
      const starMatch =
        cosplayer.averageStar >= cosplayerSearchParams.averageStar[0] &&
        cosplayer.averageStar <= cosplayerSearchParams.averageStar[1];
      const heightMatch =
        cosplayer.height >= cosplayerSearchParams.height[0] &&
        cosplayer.height <= cosplayerSearchParams.height[1];
      const weightMatch =
        cosplayer.weight >= cosplayerSearchParams.weight[0] &&
        cosplayer.weight <= cosplayerSearchParams.weight[1];
      const rateMatch =
        cosplayer.salaryIndex >= cosplayerSearchParams.hourlyRate[0] &&
        cosplayer.salaryIndex <= cosplayerSearchParams.hourlyRate[1];
      const isActiveMatch = cosplayer.isActive === true; // Chỉ lấy cosplayer active
      return (
        nameMatch &&
        starMatch &&
        heightMatch &&
        weightMatch &&
        rateMatch &&
        isActiveMatch
      );
    });
    setFilteredCosplayers(filtered);
    setCurrentPageCosplayers(1);
    setIsPageManuallySelectedCosplayers(false);
  };

  // Xử lý thay đổi input cho Character
  const handleCharacterInputChange = (e) => {
    const { name, value } = e.target;
    setCharacterSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi input cho Cosplayer
  const handleCosplayerInputChange = (e) => {
    const { name, value } = e.target;
    setCosplayerSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi range cho Character
  const handleCharacterRangeChange = (name, values) => {
    setCharacterSearchParams((prev) => ({ ...prev, [name]: values }));
  };

  // Xử lý thay đổi range cho Cosplayer
  const handleCosplayerRangeChange = (name, values) => {
    setCosplayerSearchParams((prev) => ({ ...prev, [name]: values }));
  };

  // Reset bộ lọc Character
  const handleCharacterCancel = () => {
    setCharacterSearchParams(defaultCharacterSearchParams);
    setFilteredCharacters(characters);
    setCurrentPageCharacters(1);
    setIsPageManuallySelectedCharacters(false);
  };

  // Reset bộ lọc Cosplayer
  const handleCosplayerCancel = () => {
    setCosplayerSearchParams(defaultCosplayerSearchParams);
    setFilteredCosplayers(cosplayers); // cosplayers đã được lọc isActive: true
    setCurrentPageCosplayers(1);
    setIsPageManuallySelectedCosplayers(false);
  };

  // Chuyển trang Character
  const handleCharacterPageChange = (page) => {
    setCurrentPageCharacters(page);
    setIsPageManuallySelectedCharacters(true);
  };

  // Chuyển trang Cosplayer
  const handleCosplayerPageChange = (page) => {
    setCurrentPageCosplayers(page);
    setIsPageManuallySelectedCosplayers(true);
  };

  // Trang trước Character
  const handleCharacterPrevious = () => {
    setCurrentPageCharacters((prev) => (prev > 1 ? prev - 1 : prev));
    setIsPageManuallySelectedCharacters(true);
  };

  // Trang trước Cosplayer
  const handleCosplayerPrevious = () => {
    setCurrentPageCosplayers((prev) => (prev > 1 ? prev - 1 : prev));
    setIsPageManuallySelectedCosplayers(true);
  };

  // Trang sau Character
  const handleCharacterNext = () => {
    const maxPage = Math.ceil(filteredCharacters.length / charactersPerPage);
    setCurrentPageCharacters((prev) => (prev < maxPage ? prev + 1 : prev));
    setIsPageManuallySelectedCharacters(true);
  };

  // Trang sau Cosplayer
  const handleCosplayerNext = () => {
    const maxPage = Math.ceil(filteredCosplayers.length / cosplayersPerPage);
    setCurrentPageCosplayers((prev) => (prev < maxPage ? prev + 1 : prev));
    setIsPageManuallySelectedCosplayers(true);
  };

  // Hiển thị thông báo chào mừng khi đăng nhập
  useEffect(() => {
    const { accountName } = getUserInfoFromToken();
    if (accountName) {
      toast.success(`Welcome, ${accountName}!`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, []);

  // Tính toán chỉ số hình ảnh cho About Us
  const getImageIndices = () => {
    const length = aboutUsImages.length;
    const prevIndex = (currentImageIndex - 1 + length) % length;
    const nextIndex = (currentImageIndex + 1) % length;
    return { prevIndex, currentIndex: currentImageIndex, nextIndex };
  };

  const { prevIndex, currentIndex, nextIndex } = getImageIndices();

  return (
    <div className="homepage">
      <ToastContainer />
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

      {/* Character List */}
      <div className="custom-section featured-characters py-5">
        <h2 className="text-center fw-bold mb-5">Character List</h2>
        <div className="character-list-container">
          <div className="search-filter-sidebar">
            <Form className="search-filter-form">
              <Form.Group className="mb-4">
                <Form.Label>Character Name</Form.Label>
                <Form.Control
                  type="text"
                  name="characterName"
                  value={characterSearchParams.characterName}
                  onChange={handleCharacterInputChange}
                  placeholder="Enter character name"
                  className="search-input"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Price Range (VND)</Form.Label>
                <Range
                  step={1000}
                  min={0}
                  max={1000000}
                  values={characterSearchParams.price}
                  onChange={(values) =>
                    handleCharacterRangeChange("price", values)
                  }
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="range-track"
                      style={{
                        ...props.style,
                        height: "8px",
                        width: "100%",
                        background: `linear-gradient(to right, #f85caa 0%, #f85caa ${((characterSearchParams.price[0] - 0) / 1000000) * 100
                          }%, #d3d3d3 ${((characterSearchParams.price[0] - 0) / 1000000) * 100
                          }%, #d3d3d3 ${((characterSearchParams.price[1] - 0) / 1000000) * 100
                          }%, #f85caa ${((characterSearchParams.price[1] - 0) / 1000000) * 100
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
                  {formatPrice(characterSearchParams.price[0])} -{" "}
                  {formatPrice(characterSearchParams.price[1])}
                </div>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Height Range (cm)</Form.Label>
                <Range
                  step={1}
                  min={100}
                  max={200}
                  values={characterSearchParams.height}
                  onChange={(values) =>
                    handleCharacterRangeChange("height", values)
                  }
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="range-track"
                      style={{
                        ...props.style,
                        height: "8px",
                        width: "100%",
                        background: `linear-gradient(to right, #f85caa 0%, #f85caa ${((characterSearchParams.height[0] - 100) / 100) * 100
                          }%, #d3d3d3 ${((characterSearchParams.height[0] - 100) / 100) * 100
                          }%, #d3d3d3 ${((characterSearchParams.height[1] - 100) / 100) * 100
                          }%, #f85caa ${((characterSearchParams.height[1] - 100) / 100) * 100
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
                  {characterSearchParams.height[0]} cm -{" "}
                  {characterSearchParams.height[1]} cm
                </div>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Weight Range (kg)</Form.Label>
                <Range
                  step={1}
                  min={20}
                  max={100}
                  values={characterSearchParams.weight}
                  onChange={(values) =>
                    handleCharacterRangeChange("weight", values)
                  }
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="range-track"
                      style={{
                        ...props.style,
                        height: "8px",
                        width: "100%",
                        background: `linear-gradient(to right, #f85caa 0%, #f85caa ${((characterSearchParams.weight[0] - 20) / 80) * 100
                          }%, #d3d3d3 ${((characterSearchParams.weight[0] - 20) / 80) * 100
                          }%, #d3d3d3 ${((characterSearchParams.weight[1] - 20) / 80) * 100
                          }%, #f85caa ${((characterSearchParams.weight[1] - 20) / 80) * 100
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
                  {characterSearchParams.weight[0]} kg -{" "}
                  {characterSearchParams.weight[1]} kg
                </div>
              </Form.Group>
              <div className="filter-buttons">
                <Button
                  className="search-button mb-2 w-100"
                  onClick={handleCharacterSearch}
                >
                  Apply Filters
                </Button>
                <Button
                  className="cancel-button w-100"
                  onClick={handleCharacterCancel}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
          <div className="character-grid">
            <ul className="card-list">
              {currentCharacters.map((character) => (
                <li className="character-card" key={character.characterId}>
                  <div className="card-inner">
                    <div className="card-front">
                      <img
                        src={
                          characterImages[character.characterId] ||
                          "https://via.placeholder.com/200x300?text=Loading..."
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
                          Height: {character.minHeight}cm -{" "}
                          {character.maxHeight}cm
                        </p>
                        <p className="character-weight">
                          Weight: {character.minWeight}kg -{" "}
                          {character.maxWeight}kg
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
            <div className="pagination-controls text-center mt-4">
              <Button
                className="pagination-arrow"
                onClick={handleCharacterPrevious}
                disabled={currentPageCharacters === 1}
              >
                {"<"}
              </Button>
              {Array.from(
                { length: totalPagesCharacters },
                (_, index) => index + 1
              ).map((page) => (
                <Button
                  key={page}
                  className={`pagination-number ${currentPageCharacters === page ? "active" : ""
                    }`}
                  onClick={() => handleCharacterPageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                className="pagination-arrow"
                onClick={handleCharacterNext}
                disabled={currentPageCharacters === totalPagesCharacters}
              >
                {">"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cosplayer List */}
      <div className="custom-section featured-cosplayers py-5">
        <h2 className="text-center fw-bold mb-5">Cosplayer List</h2>
        <div className="character-list-container">
          <div className="search-filter-sidebar">
            <Form className="search-filter-form">
              <Form.Group className="mb-4">
                <Form.Label>Cosplayer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="cosplayerName"
                  value={cosplayerSearchParams.cosplayerName}
                  onChange={handleCosplayerInputChange}
                  placeholder="Enter cosplayer name"
                  className="search-input"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Average Star</Form.Label>
                <Range
                  step={0.1}
                  min={0}
                  max={5}
                  values={cosplayerSearchParams.averageStar}
                  onChange={(values) =>
                    handleCosplayerRangeChange("averageStar", values)
                  }
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="range-track"
                      style={{
                        ...props.style,
                        height: "8px",
                        width: "100%",
                        background: `linear-gradient(to right, #f85caa 0%, #f85caa ${((cosplayerSearchParams.averageStar[0] - 0) / 5) * 100
                          }%, #d3d3d3 ${((cosplayerSearchParams.averageStar[0] - 0) / 5) * 100
                          }%, #d3d3d3 ${((cosplayerSearchParams.averageStar[1] - 0) / 5) * 100
                          }%, #f85caa ${((cosplayerSearchParams.averageStar[1] - 0) / 5) * 100
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
                  {cosplayerSearchParams.averageStar[0]}{" "}
                  <Star size={14} className="star-filled" /> -{" "}
                  {cosplayerSearchParams.averageStar[1]}{" "}
                  <Star size={14} className="star-filled" />
                </div>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Height Range (cm)</Form.Label>
                <Range
                  step={1}
                  min={100}
                  max={200}
                  values={cosplayerSearchParams.height}
                  onChange={(values) =>
                    handleCosplayerRangeChange("height", values)
                  }
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="range-track"
                      style={{
                        ...props.style,
                        height: "8px",
                        width: "100%",
                        background: `linear-gradient(to right, #f85caa 0%, #f85caa ${((cosplayerSearchParams.height[0] - 100) / 100) * 100
                          }%, #d3d3d3 ${((cosplayerSearchParams.height[0] - 100) / 100) * 100
                          }%, #d3d3d3 ${((cosplayerSearchParams.height[1] - 100) / 100) * 100
                          }%, #f85caa ${((cosplayerSearchParams.height[1] - 100) / 100) * 100
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
                  {cosplayerSearchParams.height[0]} cm -{" "}
                  {cosplayerSearchParams.height[1]} cm
                </div>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Weight Range (kg)</Form.Label>
                <Range
                  step={1}
                  min={20}
                  max={100}
                  values={cosplayerSearchParams.weight}
                  onChange={(values) =>
                    handleCosplayerRangeChange("weight", values)
                  }
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="range-track"
                      style={{
                        ...props.style,
                        height: "8px",
                        width: "100%",
                        background: `linear-gradient(to right, #f85caa 0%, #f85caa ${((cosplayerSearchParams.weight[0] - 20) / 80) * 100
                          }%, #d3d3d3 ${((cosplayerSearchParams.weight[0] - 20) / 80) * 100
                          }%, #d3d3d3 ${((cosplayerSearchParams.weight[1] - 20) / 80) * 100
                          }%, #f85caa ${((cosplayerSearchParams.weight[1] - 20) / 80) * 100
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
                  {cosplayerSearchParams.weight[0]} kg -{" "}
                  {cosplayerSearchParams.weight[1]} kg
                </div>
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Hourly Rate (VND)</Form.Label>
                <Range
                  step={1000}
                  min={0}
                  max={100000}
                  values={cosplayerSearchParams.hourlyRate}
                  onChange={(values) =>
                    handleCosplayerRangeChange("hourlyRate", values)
                  }
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="range-track"
                      style={{
                        ...props.style,
                        height: "8px",
                        width: "100%",
                        background: `linear-gradient(to right, #f85caa 0%, #f85caa ${((cosplayerSearchParams.hourlyRate[0] - 0) / 100000) *
                          100
                          }%, #d3d3d3 ${((cosplayerSearchParams.hourlyRate[0] - 0) / 100000) *
                          100
                          }%, #d3d3d3 ${((cosplayerSearchParams.hourlyRate[1] - 0) / 100000) *
                          100
                          }%, #f85caa ${((cosplayerSearchParams.hourlyRate[1] - 0) / 100000) *
                          100
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
                  {formatPrice(cosplayerSearchParams.hourlyRate[0])} -{" "}
                  {formatPrice(cosplayerSearchParams.hourlyRate[1])}
                </div>
              </Form.Group>
              <div className="filter-buttons">
                <Button
                  className="search-button mb-2 w-100"
                  onClick={handleCosplayerSearch}
                >
                  Apply Filters
                </Button>
                <Button
                  className="cancel-button w-100"
                  onClick={handleCosplayerCancel}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </div>
          <div className="character-grid">
            <ul className="card-list">
              {currentCosplayers.map((cosplayer) => (
                <li className="character-card" key={cosplayer.accountId}>
                  <div className="card-inner">
                    <div className="card-front">
                      <img
                        src={
                          cosplayerImages[cosplayer.accountId] ||
                          "https://via.placeholder.com/200x300?text=Loading..."
                        }
                        alt={cosplayer.name}
                        className="card-img-top"
                      />
                      <div className="card-content">
                        <h3>{cosplayer.name}</h3>
                        <p className="character-description">
                          {cosplayer.averageStar ? (
                            <>
                              {cosplayer.averageStar}{" "}
                              <Star size={14} className="star-filled" />
                            </>
                          ) : (
                            "N/A"
                          )}
                        </p>
                        <p className="character-height">
                          Height: {cosplayer.height}cm
                        </p>
                        <p className="character-weight">
                          Weight: {cosplayer.weight}kg
                        </p>
                        <span className="category-badge">
                          {formatHourlyRate(cosplayer.salaryIndex)}
                        </span>
                        <Link
                          to={`/user-profile/${cosplayer.accountId}`}
                          className="see-profile-button"
                          aria-label={`View profile of ${cosplayer.name}`}
                        >
                          See Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pagination-controls text-center mt-4">
              <Button
                className="pagination-arrow"
                onClick={handleCosplayerPrevious}
                disabled={currentPageCosplayers === 1}
              >
                {"<"}
              </Button>
              {Array.from(
                { length: totalPagesCosplayers },
                (_, index) => index + 1
              ).map((page) => (
                <Button
                  key={page}
                  className={`pagination-number ${currentPageCosplayers === page ? "active" : ""
                    }`}
                  onClick={() => handleCosplayerPageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                className="pagination-arrow"
                onClick={handleCosplayerNext}
                disabled={currentPageCosplayers === totalPagesCosplayers}
              >
                {">"}
              </Button>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button className="view-all-button" onClick={handleHireCosplayers}>
            Hire Cosplayers
          </button>
        </div>
      </div>

      {/* About Us */}
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
            <div className="about-us-image-carousel">
              <div className="carousel-image-container">
                <div
                  className="image-wrapper side-image left-image"
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) =>
                        (prev - 1 + aboutUsImages.length) % aboutUsImages.length
                    )
                  }
                  style={{ transform: `translateX(-100%)` }}
                >
                  <img src={aboutUsImages[prevIndex]} alt="About Us Side Left" />
                </div>
                <div
                  className="image-wrapper main-image"
                  style={{ transform: `translateX(0)` }}
                >
                  <img src={aboutUsImages[currentIndex]} alt="About Us Main" />
                </div>
                <div
                  className="image-wrapper side-image right-image"
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % aboutUsImages.length
                    )
                  }
                  style={{ transform: `translateX(100%)` }}
                >
                  <img
                    src={aboutUsImages[nextIndex]}
                    alt="About Us Side Right"
                  />
                </div>
              </div>
              <div className="carousel-controls">
                <button
                  className="carousel-arrow left-arrow"
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) =>
                        (prev - 1 + aboutUsImages.length) % aboutUsImages.length
                    )
                  }
                >
                  {"<"}
                </button>
                <div className="carousel-dots">
                  {aboutUsImages.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${currentImageIndex === index ? "active" : ""
                        }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
                <button
                  className="carousel-arrow right-arrow"
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % aboutUsImages.length
                    )
                  }
                >
                  {">"}
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Featured Services */}
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