//================call post
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Modal, Button, Carousel, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  Drawer,
  List,
  Button as AntButton,
  Badge,
  InputNumber,
  Pagination,
  Checkbox,
} from "antd";
import { jwtDecode } from "jwt-decode";
import "../../styles/CostumesPage.scss";
import CostumeRequestModal from "./CostumeRequestModal.js";
import CostumeService from "../../services/CostumeService/CostumeService.js";
import { toast } from "react-toastify";

const CostumesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCostume, setSelectedCostume] = useState(null);
  const [costumes, setCostumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [requestData, setRequestData] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isSending, setIsSending] = useState(false); // Trạng thái loading khi gửi yêu cầu
  const [sendRequestTrigger, setSendRequestTrigger] = useState(null); // Trạng thái để kích hoạt useEffect

  const params = useParams();
  const category = params.category || "all";

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      const updatedFavorites = parsedFavorites.map((item) => ({
        ...item,
        selected: item.selected ?? false,
      }));
      setFavorites(updatedFavorites);
    }

    const fetchCostumes = async () => {
      try {
        setLoading(true);
        const data = await CostumeService.getAllCostumes();
        const formattedCostumes = data.map((costume) => ({
          id: costume.characterId,
          name: costume.characterName,
          category: costume.categoryId,
          image: costume.images[0]?.urlImage || "",
          galleryImages: costume.images.map((img) => img.urlImage),
          description: costume.description,
          price: costume.price,
          height: `${costume.minHeight}-${costume.maxHeight} cm`,
          weight: `${costume.minWeight}-${costume.maxWeight} kg`,
          status: costume.isActive ? "Active" : "Inactive",
          createDate: costume.createDate,
          minHeight: costume.minHeight,
          maxHeight: costume.maxHeight,
          minWeight: costume.minWeight,
          maxWeight: costume.maxWeight,
          quantity: 1,
        }));
        setCostumes(formattedCostumes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCostumes();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // useEffect để gọi API khi sendRequestTrigger thay đổi
  useEffect(() => {
    if (sendRequestTrigger) {
      const sendRequest = async () => {
        setIsSending(true);
        try {
          await CostumeService.sendRequestHireCostume(sendRequestTrigger);
          toast.success("Request sent successfully!");
          setShowConfirmModal(false);
          setShowDrawer(false);
          setDescription("");
          setLocation("");
          setRequestData(null);
          setFavorites([]); // Xóa danh sách favorites sau khi gửi yêu cầu thành công
          localStorage.removeItem("favorites"); // Xóa favorites khỏi localStorage
        } catch (error) {
          toast.error(error.message || "Failed to send request!");
        } finally {
          setIsSending(false);
          setSendRequestTrigger(null); // Reset trigger sau khi gọi API
        }
      };

      sendRequest();
    }
  }, [sendRequestTrigger]);

  const handleRequestShow = () => setShowRequestModal(true);
  const handleRequestClose = () => setShowRequestModal(false);

  const handleGalleryShow = (costume) => {
    setSelectedCostume(costume);
    setShowGalleryModal(true);
  };

  const handleGalleryClose = () => {
    setShowGalleryModal(false);
    setSelectedCostume(null);
  };

  const addToFavorites = (costume) => {
    const existingItem = favorites.find((item) => item.id === costume.id);
    if (existingItem) {
      setFavorites(
        favorites.map((item) =>
          item.id === costume.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast.success("Costume added to favorites!");
    } else {
      setFavorites([
        ...favorites,
        { ...costume, quantity: 1, selected: false },
      ]);
      toast.success("Costume added to favorites!");
    }
  };

  const updateQuantity = (id, value) => {
    setFavorites(
      favorites.map((item) =>
        item.id === id ? { ...item, quantity: value } : item
      )
    );
    if (selectedCostume && selectedCostume.id === id) {
      setSelectedCostume({ ...selectedCostume, quantity: value });
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter((item) => item.id !== id));
    toast.success("Costume removed from favorites!");
  };

  const handleSelectItem = (id, checked) => {
    setFavorites(
      favorites.map((item) =>
        item.id === id ? { ...item, selected: checked } : item
      )
    );
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setFavorites(
      favorites.map((item) => ({
        ...item,
        selected: checked,
      }))
    );
  };

  const handleConfirmRequest = () => {
    const selectedItems = favorites.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      toast.warning("Please select at least one item to confirm request!");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    let accountId = "";
    let accountName = "";
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        accountId = decodedToken.Id || "";
        accountName = decodedToken.AccountName || "";
      } catch (err) {
        console.error("Error decoding accessToken:", err);
        toast.error("Invalid access token!");
        return;
      }
    } else {
      toast.error("No access token found! Please log in.");
      return;
    }

    const now = new Date();
    const startDateObj = new Date(now.getTime() + 1 * 60 * 1000);

    const startDate = `${startDateObj
      .getHours()
      .toString()
      .padStart(2, "0")}:${startDateObj
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${startDateObj
      .getDate()
      .toString()
      .padStart(2, "0")}/${(startDateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${startDateObj.getFullYear()}`;

    const endDateObj = new Date(now);
    endDateObj.setMonth(now.getMonth() + 1);
    const endDate = `${endDateObj
      .getHours()
      .toString()
      .padStart(2, "0")}:${endDateObj
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${endDateObj.getDate().toString().padStart(2, "0")}/${(
      endDateObj.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${endDateObj.getFullYear()}`;

    const requestData = {
      accountId: accountId,
      name: accountName,
      description: description || null,
      price: selectedItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      startDate: startDate,
      endDate: endDate,
      location: location || "",
      serviceId: "S001",
      packageId: "",
      listRequestCharacters: selectedItems.map((item) => ({
        characterId: item.id,
        cosplayerId: "",
        description: item.description || "",
        quantity: item.quantity,
      })),
    };

    console.log("Request Data:", JSON.stringify(requestData, null, 2));
    setRequestData(requestData);
    setShowConfirmModal(true);
  };

  const handleRentNow = (costume) => {
    const accessToken = localStorage.getItem("accessToken");
    let accountId = "";
    let accountName = "";
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        accountId = decodedToken.Id || "";
        accountName = decodedToken.AccountName || "";
      } catch (err) {
        console.error("Error decoding accessToken:", err);
        toast.error("Invalid access token!");
        return;
      }
    } else {
      toast.error("No access token found! Please log in.");
      return;
    }

    const now = new Date();
    const startDateObj = new Date(now.getTime() + 1 * 60 * 1000);

    const startDate = `${startDateObj
      .getHours()
      .toString()
      .padStart(2, "0")}:${startDateObj
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${startDateObj
      .getDate()
      .toString()
      .padStart(2, "0")}/${(startDateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${startDateObj.getFullYear()}`;

    const endDateObj = new Date(now);
    endDateObj.setMonth(now.getMonth() + 1);
    const endDate = `${endDateObj
      .getHours()
      .toString()
      .padStart(2, "0")}:${endDateObj
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${endDateObj.getDate().toString().padStart(2, "0")}/${(
      endDateObj.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${endDateObj.getFullYear()}`;

    const requestData = {
      accountId: accountId,
      name: accountName,
      description: description || null,
      price: costume.price * 1,
      startDate: startDate,
      endDate: endDate,
      location: location || "",
      serviceId: "S001",
      packageId: "",
      listRequestCharacters: [
        {
          characterId: costume.id,
          cosplayerId: "",
          description: costume.description || "",
          quantity: 1,
        },
      ],
    };

    console.log("Rent Now Request Data:", JSON.stringify(requestData, null, 2));
    setRequestData(requestData);
    setShowConfirmModal(true);
  };

  const updateRequestQuantity = (characterId, value) => {
    setRequestData((prev) => {
      const updatedList = prev.listRequestCharacters.map((character) =>
        character.characterId === characterId
          ? { ...character, quantity: value }
          : character
      );
      const updatedPrice = updatedList.reduce((total, character) => {
        const item =
          favorites.find((fav) => fav.id === character.characterId) ||
          costumes.find((costume) => costume.id === character.characterId);
        return total + (item ? item.price * character.quantity : 0);
      }, 0);

      return {
        ...prev,
        listRequestCharacters: updatedList,
        price: updatedPrice,
      };
    });
  };

  const handleFinalSendRequest = () => {
    const updatedRequestData = {
      ...requestData,
      description: description || null,
      location: location || "",
    };
    console.log(
      "Final Request Data:",
      JSON.stringify(updatedRequestData, null, 2)
    );
    // Kích hoạt useEffect để gọi API
    setSendRequestTrigger(updatedRequestData);
  };

  const handleConfirmModalClose = () => {
    setShowConfirmModal(false);
    setDescription("");
    setLocation("");
  };

  const filteredCostumes = costumes.filter((costume) => {
    const matchesCategory =
      category === "all" ||
      costume.category.toLowerCase() === category.toLowerCase();
    const matchesSearch = costume.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPrice = favorites.reduce(
    (total, item) =>
      item.selected ? total + item.price * item.quantity : total,
    0
  );

  const allSelected =
    favorites.length > 0 && favorites.every((item) => item.selected);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCostumes = filteredCostumes.slice(startIndex, endIndex);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleNameChange = (e) => {
    const newName = e.target.innerText;
    setRequestData((prev) => ({ ...prev, name: newName }));
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error)
    return <div className="text-center py-5 text-danger">Error: {error}</div>;

  return (
    <div className="costumes-page min-vh-100">
      <div className="hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Costume Gallery</h1>
          <p className="lead text-center mt-3">
            Discover our collection of amazing costumes
          </p>
        </div>
      </div>

      <div className="container py-5">
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
                  placeholder="Search costumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button
              variant="primary"
              onClick={handleRequestShow}
              className="request-button me-2"
            >
              Costume Request
            </Button>
            <Badge count={favorites.length} showZero>
              <AntButton
                type="default"
                icon={
                  <span role="img" aria-label="heart">
                    💖
                  </span>
                }
                onClick={() => setShowDrawer(true)}
                className="btn-favorites"
              />
            </Badge>
          </div>
        </div>

        <div className="row g-4">
          {paginatedCostumes.map((costume) => (
            <div className="col-md-3" key={costume.id}>
              <div className="costume-card">
                <div className="card-image">
                  <img
                    src={costume.image}
                    alt={costume.name}
                    className="img-fluid"
                  />
                </div>
                <div className="card-content">
                  <h5 className="costume-name">{costume.name}</h5>
                  <p className="costume-price">
                    Price: {costume.price.toLocaleString()} VND
                  </p>
                  <div className="button-group">
                    <button
                      className="hire-button mb-2"
                      onClick={() => handleRentNow(costume)}
                    >
                      Rent Now!
                    </button>
                    <button
                      className="show-more-button"
                      onClick={() => handleGalleryShow(costume)}
                    >
                      Show More Images
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCostumes.length === 0 ? (
          <p className="text-center mt-4">No costumes found.</p>
        ) : (
          <div className="pagination-container mt-5">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredCostumes.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["4", "8", "12", "16"]}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
            />
          </div>
        )}
      </div>

      <CostumeRequestModal
        show={showRequestModal}
        handleClose={handleRequestClose}
      />

      <Modal
        show={showGalleryModal}
        onHide={handleGalleryClose}
        size="lg"
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedCostume?.name} Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCostume && (
            <div className="costume-gallery">
              <Carousel className="gallery-carousel">
                {selectedCostume.galleryImages.map((image, index) => (
                  <Carousel.Item key={index}>
                    <div className="carousel-image-container">
                      <img
                        className="d-block w-100"
                        src={image}
                        alt={`${selectedCostume.name} - Image ${index + 1}`}
                      />
                    </div>
                    <Carousel.Caption>
                      <h3>{selectedCostume.name}</h3>
                      <p>{`Image ${index + 1} of ${
                        selectedCostume.galleryImages.length
                      }`}</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>

              <div className="costume-details mt-4">
                <h4>About {selectedCostume.name}</h4>
                <p>{selectedCostume.description}</p>
                <div className="costume-info">
                  <div className="info-item">
                    <strong>Category:</strong> {selectedCostume.category}
                  </div>
                  <div className="info-item">
                    <strong>Height:</strong> {selectedCostume.height}
                  </div>
                  <div className="info-item">
                    <strong>Weight:</strong> {selectedCostume.weight}
                  </div>
                  <div className="info-item">
                    <strong>Status:</strong> {selectedCostume.status}
                  </div>
                  <div className="info-item">
                    <strong>Price:</strong>{" "}
                    {selectedCostume.price.toLocaleString()} VND
                  </div>
                  <div className="info-item">
                    <strong>Create Date:</strong> {selectedCostume.createDate}
                  </div>
                </div>
                <div className="action-buttons mt-3">
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => handleRentNow(selectedCostume)}
                  >
                    Rent Now!
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => addToFavorites(selectedCostume)}
                  >
                    Add to Favorites
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <Drawer
        title={`Favorites (${favorites.length})`}
        placement="right"
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
      >
        <List
          dataSource={favorites}
          renderItem={(item) => (
            <List.Item>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Checkbox
                    checked={item.selected}
                    onChange={(e) =>
                      handleSelectItem(item.id, e.target.checked)
                    }
                    style={{ marginRight: 8 }}
                  />
                  <div style={{ fontWeight: "bold" }}>{item.name}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 50, height: 50, objectFit: "cover" }}
                  />
                  <div style={{ textAlign: "right" }}>
                    <div style={{ marginBottom: 4 }}>
                      Price: {item.price.toLocaleString()} VND
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <InputNumber
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(value) => updateQuantity(item.id, value)}
                        style={{ marginRight: 8 }}
                      />
                      <AntButton
                        type="danger"
                        size="small"
                        onClick={() => removeFromFavorites(item.id)}
                      >
                        ❌
                      </AntButton>
                      <div style={{ marginBottom: 4 }}>
                        Item Total:{" "}
                        {(item.price * item.quantity).toLocaleString()} VND
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
        <div style={{ padding: "16px" }}>
          <Checkbox
            checked={allSelected}
            onChange={handleSelectAll}
            style={{ marginBottom: 16 }}
          >
            Choose All
          </Checkbox>
        </div>
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "#fff",
            padding: "16px",
            borderTop: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>Total Price:</strong> {totalPrice.toLocaleString()} VND
          </div>
          <AntButton
            type="primary"
            onClick={handleConfirmRequest}
            disabled={totalPrice === 0}
          >
            Confirm Request
          </AntButton>
        </div>
      </Drawer>

      <Modal
        show={showConfirmModal}
        onHide={handleConfirmModalClose}
        centered
        className="confirm-request-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {requestData && (
            <div className="request-details">
              <div className="request-item" style={{ marginBottom: "16px" }}>
                <strong>NAME: </strong>
                <span style={{ fontSize: "18px" }} onInput={handleNameChange}>
                  {requestData.name}
                </span>
              </div>
              <div className="request-item" style={{ marginBottom: "16px" }}>
                <strong>DESCRIPTION:</strong>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter your Height and weight"
                />
              </div>
              <div className="request-item" style={{ marginBottom: "16px" }}>
                <strong>Date Hire: </strong>
                <span>{requestData.startDate}</span>
              </div>
              <div className="request-item" style={{ marginBottom: "16px" }}>
                <strong>LOCATION:</strong>
                <Form.Control
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Input location...."
                />
              </div>
              <div className="request-item" style={{ marginBottom: "16px" }}>
                <strong style={{ marginBottom: "16px" }}>
                  REQUESTED HIRE COSTUME:
                </strong>
                <div className="character-list">
                  {requestData.listRequestCharacters.map((character, index) => {
                    const item =
                      favorites.find(
                        (fav) => fav.id === character.characterId
                      ) ||
                      costumes.find(
                        (costume) => costume.id === character.characterId
                      );
                    if (!item) return null;
                    return (
                      <div
                        key={index}
                        className="character-item"
                        style={{
                          marginBottom: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          {item.name} - Quantity:{" "}
                          <InputNumber
                            min={1}
                            value={character.quantity}
                            onChange={(value) =>
                              updateRequestQuantity(
                                character.characterId,
                                value
                              )
                            }
                            style={{ width: "60px" }}
                          />{" "}
                          - Price:{" "}
                          {(item.price * character.quantity).toLocaleString()}{" "}
                          VND
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="request-item total-price">
                <strong>TOTAL PRICE: </strong>
                <span>{requestData.price.toLocaleString()} VND</span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmModalClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleFinalSendRequest}
            disabled={!location || isSending}
          >
            {isSending ? "Sending..." : "Send Request"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CostumesPage;
