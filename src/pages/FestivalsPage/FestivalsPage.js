import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Modal, Button, Form, Carousel } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "../../styles/FestivalsPage.scss";
import FestivalService from "../../services/FestivalService/FestivalService";
import { apiClient } from "../../api/apiClient.js"; // Giả định bạn đã có apiClient
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FestivalsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFestivalModal, setShowFestivalModal] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cosplayerDetails, setCosplayerDetails] = useState({}); // Lưu thông tin cosplayers

  const { category } = useParams();
  const selectedCategory = category || "all";

  // Gọi API để lấy danh sách festivals
  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const festivalData = await FestivalService.getAllFestivals();
        setFestivals(festivalData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to load festivals");
      }
    };
    fetchFestivals();
  }, []);

  // Gọi API để lấy thông tin cosplayer khi chọn festival
  useEffect(() => {
    const fetchCosplayerDetails = async () => {
      if (!selectedFestival || !selectedFestival.eventCharacterResponses) return;

      const details = {};
      try {
        await Promise.all(
          selectedFestival.eventCharacterResponses.map(async (cosplayer) => {
            const response = await apiClient.get(
              `/api/Character/${cosplayer.characterId}`
            );
            details[cosplayer.characterId] = response.data;
          })
        );
        setCosplayerDetails(details);
      } catch (err) {
        console.error("Error fetching cosplayer details:", err);
        toast.error("Failed to load cosplayer details");
      }
    };
    fetchCosplayerDetails();
  }, [selectedFestival]);

  const handleFestivalShow = (festival) => {
    setSelectedFestival(festival);
    setShowFestivalModal(true);
  };

  const handleFestivalClose = () => {
    setShowFestivalModal(false);
    setSelectedFestival(null);
    setTicketQuantity(1);
    setShowPurchaseForm(false);
    setPaymentMethod("");
    setCosplayerDetails({}); // Reset cosplayer details
  };

  const handleIncrease = () => {
    if (selectedFestival && ticketQuantity < selectedFestival.ticket.quantity) {
      setTicketQuantity((prev) => prev + 1);
    } else {
      toast.error("Quantity exceeds available tickets");
    }
  };

  const handleDecrease = () =>
    setTicketQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleBuyNow = () => {
    setShowPurchaseForm(true);
  };

  const handleConfirmPurchase = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    toast.success(
      `Purchased ${ticketQuantity} ticket(s) with ${paymentMethod} successfully!`
    );
    handleFestivalClose();
  };

  const filteredFestivals = festivals.filter((festival) =>
    festival.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-5">Loading festivals...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  return (
    <div className="fest-page min-vh-100">
      <div className="fest-hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Enjoy Festivals</h1>
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
          {filteredFestivals.map((festival) => (
            <div className="fest-card" key={festival.eventId}>
              <div className="fest-card-image">
                <img
                  src={
                    festival.eventImageResponses[0]?.imageUrl ||
                    "https://via.placeholder.com/300"
                  }
                  alt={festival.eventName}
                />
              </div>
              <div className="fest-card-content">
                <h5 className="fest-name">{festival.eventName}</h5>
                <p className="fest-description">{festival.description}</p>
                <div className="fest-meta">
                  <span className="fest-date">
                    {new Date(festival.startDate).toLocaleDateString()} -{" "}
                    {new Date(festival.endDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="fest-location">{festival.location}</p>
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
          <Modal.Title>{selectedFestival?.eventName} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFestival && (
            <div className="costume-gallery">
              <Carousel className="gallery-carousel">
                {selectedFestival.eventImageResponses.map((image) => (
                  <Carousel.Item key={image.imageId}>
                    <div className="carousel-image-container">
                      <img
                        className="d-block w-100"
                        src={image.imageUrl}
                        alt={`${selectedFestival.eventName} - Image ${image.imageId}`}
                      />
                    </div>
                    <Carousel.Caption>
                      <h3>{selectedFestival.eventName}</h3>
                      <p>Image {image.imageId}</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>

              <div className="fest-details mt-4">
                <h4>About {selectedFestival.eventName}</h4>
                <p>{selectedFestival.description}</p>
                <div className="fest-info">
                  <div className="fest-info-item">
                    <strong>Date:</strong>{" "}
                    {new Date(selectedFestival.startDate).toLocaleDateString()} -{" "}
                    {new Date(selectedFestival.endDate).toLocaleDateString()}
                  </div>
                  <div className="fest-info-item">
                    <strong>Location:</strong> {selectedFestival.location}
                  </div>
                </div>

                {/* Activities - Grid */}
                {selectedFestival.eventActivityResponse?.length > 0 && (
                  <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                    <h5
                      style={{
                        color: "#4a4a4a",
                        fontWeight: 600,
                        marginBottom: "1rem",
                      }}
                    >
                      Activities
                    </h5>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      {selectedFestival.eventActivityResponse.map(
                        (activity) => (
                          <div
                            key={activity.eventActivityId}
                            style={{
                              background: "white",
                              borderRadius: "0.5rem",
                              padding: "1rem",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                              transition: "transform 0.3s ease",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform =
                                "translateY(-5px)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "translateY(0)")
                            }
                          >
                            <h6
                              style={{
                                color: "#4a4a4a",
                                fontWeight: 600,
                                marginBottom: "0.5rem",
                              }}
                            >
                              {activity.activity.name}
                            </h6>
                            <p
                              style={{
                                color: "#4a4a4a",
                                fontSize: "0.9rem",
                                margin: 0,
                              }}
                            >
                              {activity.activity.description}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Participating Cosplayers - Grid cố định 3 cột */}
                {selectedFestival.eventCharacterResponses?.length > 0 && (
                  <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                    <h5
                      style={{
                        color: "#4a4a4a",
                        fontWeight: 600,
                        marginBottom: "1rem",
                      }}
                    >
                      Participating Cosplayers
                    </h5>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "1rem",
                        maxWidth: "100%",
                      }}
                    >
                      {selectedFestival.eventCharacterResponses.map(
                        (cosplayer) => {
                          const cosplayerData =
                            cosplayerDetails[cosplayer.characterId];
                          const avatarImage = cosplayerData?.images?.find(
                            (img) => img.isAvatar
                          );
                          return (
                            <div
                              key={cosplayer.eventCharacterId}
                              style={{
                                background: "white",
                                borderRadius: "0.5rem",
                                overflow: "hidden",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                                transition: "transform 0.3s ease",
                                maxWidth: "100%",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform =
                                  "translateY(-5px)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "translateY(0)")
                              }
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "200px",
                                  overflow: "hidden",
                                  backgroundColor: "#f0f0f0",
                                }}
                              >
                                <img
                                  src={
                                    avatarImage?.urlImage ||
                                    "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg"
                                  }
                                  alt={cosplayerData?.characterName || "Cosplayer"}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.transform = "scale(1.05)")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.transform = "scale(1)")
                                  }
                                  onError={(e) =>
                                    (e.currentTarget.src =
                                      "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg")
                                  }
                                />
                              </div>
                              <div
                                style={{
                                  padding: "1rem",
                                  textAlign: "center",
                                }}
                              >
                                <h6
                                  style={{
                                    color: "#4a4a4a",
                                    fontWeight: 600,
                                    marginBottom: "0.5rem",
                                  }}
                                >
                                  {cosplayerData?.characterName ||
                                    `Cosplayer ${cosplayer.eventCharacterId}`}
                                </h6>
                                <p
                                  style={{
                                    color: "#4a4a4a",
                                    fontSize: "0.8rem",
                                    margin: 0,
                                  }}
                                >
                                  Cosplaying as {cosplayerData?.characterName || cosplayer.characterId}
                                </p>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                <div className="fest-ticket-section mt-4">
                  <h5>Purchase Tickets</h5>
                  <p>
                    Available: {selectedFestival.ticket.quantity} | Price: $
                    {selectedFestival.ticket.price}
                  </p>
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
                    Buy Now - ${selectedFestival.ticket.price * ticketQuantity}
                  </Button>
                </div>

                {showPurchaseForm && (
                  <div className="fest-purchase-form mt-4">
                    <h5>Payment Options</h5>
                    <p>
                      Total: ${selectedFestival.ticket.price * ticketQuantity} (
                      {ticketQuantity} ticket(s))
                    </p>
                    <Form>
                      <Form.Check
                        type="radio"
                        label="MoMo"
                        name="paymentMethod"
                        value="MoMo"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mb-2"
                      />
                      <Form.Check
                        type="radio"
                        label="VNPay"
                        name="paymentMethod"
                        value="VNPay"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mb-2"
                      />
                      <Button
                        variant="success"
                        className="fest-confirm-purchase-btn"
                        onClick={handleConfirmPurchase}
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

export default FestivalsPage;