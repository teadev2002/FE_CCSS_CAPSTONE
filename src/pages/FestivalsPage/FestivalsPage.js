import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Modal, Button, Form, Carousel } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/FestivalsPage.scss";
import FestivalService from "../../services/FestivalService/FestivalService";
import PaymentService from "../../services/PaymentService/PaymentService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { Pagination } from "antd";

const FestivalsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFestivalModal, setShowFestivalModal] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cosplayerDetails, setCosplayerDetails] = useState({});
  const [accountId, setAccountId] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const navigate = useNavigate();

  const { category } = useParams();
  const selectedCategory = category || "all";

  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  const getAccountInfoFromToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        return {
          id: decoded?.Id,
          accountName: decoded?.AccountName,
        };
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountInfo = getAccountInfoFromToken();
        if (accountInfo) {
          setAccountId(accountInfo.id);
          setAccountName(accountInfo.accountName);
        }

        const festivalData = await FestivalService.getAllFestivals();
        setFestivals(festivalData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error("Failed to load festivals");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCosplayerDetails = async () => {
      if (!selectedFestival || !selectedFestival.eventCharacterResponses) return;

      const details = {};
      try {
        await Promise.all(
          selectedFestival.eventCharacterResponses.map(async (cosplayer) => {
            const response = await FestivalService.getCosplayerByEventCharacterId(
              cosplayer.eventCharacterId
            );
            details[cosplayer.eventCharacterId] = response;
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
    const availableTicket = festival.ticket.find((t) => t.ticketStatus === 0) || festival.ticket[0];
    setSelectedTicketType(availableTicket);
    setTicketQuantity(1);
    setShowFestivalModal(true);
  };

  const handleFestivalClose = () => {
    setShowFestivalModal(false);
    setSelectedFestival(null);
    setTicketQuantity(1);
    setSelectedTicketType(null);
    setShowPurchaseForm(false);
    setShowConfirmModal(false);
    setPaymentMethod(null);
    setCosplayerDetails({});
  };

  const handleIncrease = () => {
    if (selectedTicketType && ticketQuantity < selectedTicketType.quantity) {
      setTicketQuantity((prev) => prev + 1);
    } else {
      toast.error("Quantity exceeds available tickets!");
    }
  };

  const handleDecrease = () => setTicketQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleTicketTypeSelect = (ticket) => {
    setSelectedTicketType(ticket);
    setTicketQuantity(1);
  };

  const handleBuyNow = () => {
    if (!accountId) {
      toast.error("Please log in to proceed with payment!");
      return;
    }
    if (selectedTicketType?.ticketStatus === 1) {
      toast.error("This event has stopped selling tickets!");
      return;
    }
    setShowPurchaseForm(true);
  };

  const handleConfirmPurchase = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }
    setShowPurchaseForm(false);
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = async () => {
    const totalAmount = selectedTicketType?.price * ticketQuantity;
  
    if (!accountId) {
      toast.error("Please log in to proceed with payment!");
      return;
    }
  
    if (!selectedTicketType || !selectedTicketType.ticketId) {
      toast.error("Please select a valid ticket type!");
      return;
    }
  
    try {
      if (paymentMethod === "Momo") {
        const paymentData = {
          fullName: accountName || "Unknown",
          orderInfo: `Purchase ${ticketQuantity} ${selectedTicketType.ticketType === 0 ? 'Normal' : 'Premium'} ticket(s) for ${selectedFestival.eventName}`,
          amount: totalAmount,
          purpose: 0,
          accountId: accountId,
          accountCouponId: null,
          ticketId: selectedTicketType.ticketId.toString(),
          ticketQuantity: ticketQuantity.toString(),
          contractId: null,
          orderpaymentId: null,
          isWeb: true,
        };
  
        console.log("Payment Data (MoMo):", paymentData);
  
        const paymentUrl = await PaymentService.createMomoPayment(paymentData);
        if (!paymentUrl) {
          throw new Error("Failed to create MoMo payment URL");
        }
  
        toast.success("Redirecting to MoMo payment...");
        localStorage.setItem("paymentSource", "festivals");
        window.location.href = paymentUrl;
      } else if (paymentMethod === "VNPay") {
        const paymentData = {
          fullName: accountName || "Unknown",
          orderInfo: `Purchase ${ticketQuantity} ${selectedTicketType.ticketType === 0 ? 'Normal' : 'Premium'} ticket(s) for ${selectedFestival.eventName}`,
          amount: totalAmount,
          purpose: 0,
          accountId: accountId,
          accountCouponId: null,
          ticketId: selectedTicketType.ticketId.toString(),
          ticketQuantity: ticketQuantity.toString(),
          contractId: null,
          orderpaymentId: null,
          isWeb: true,
        };
  
        console.log("Payment Data (VNPay):", paymentData);
  
        const paymentUrl = await PaymentService.createVnpayPayment(paymentData);
        if (!paymentUrl) {
          throw new Error("Failed to create VNPay payment URL");
        }
  
        toast.success("Redirecting to VNPay payment...");
        localStorage.setItem("paymentSource", "festivals");
        window.location.href = paymentUrl;
      }
    } catch (error) {
      console.error("Error in handleFinalConfirm:", error);
      toast.error(error.message || "Failed to process payment");
      setShowConfirmModal(false);
    }
  };

  const handleBackToPayment = () => {
    setShowConfirmModal(false);
    setShowPurchaseForm(true);
  };

  const filteredFestivals = festivals.filter((festival) =>
    festival.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFestivals = filteredFestivals.slice(startIndex, endIndex);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

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
          {paginatedFestivals.map((festival) => (
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
        </div>

        {filteredFestivals.length === 0 ? (
          <p className="text-center mt-4">No festivals found.</p>
        ) : (
          <div className="pagination-container mt-5">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredFestivals.length}
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
                {selectedFestival.eventImageResponses.map((image, index) => (
                  <Carousel.Item key={image.imageId}>
                    <div className="carousel-image-container">
                      <img
                        className="d-block w-100"
                        src={image.imageUrl}
                        alt={`${selectedFestival.eventName} - Image ${index + 1}`}
                      />
                    </div>
                    <Carousel.Caption>
                      <h3>{selectedFestival.eventName}</h3>
                      <p>Image {index + 1} of {selectedFestival.eventImageResponses.length}</p>
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

                {selectedFestival.eventActivityResponse?.length > 0 && (
                  <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                    <h5
                      style={{
                        color: "#000000",
                        fontWeight: 600,
                        marginBottom: "1rem",
                      }}
                    >
                      Activities
                    </h5>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                        gap: "1rem",
                      }}
                    >
                      {selectedFestival.eventActivityResponse.map((activity) => (
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
                            (e.currentTarget.style.transform = "translateY(-5px)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "translateY(0)")
                          }
                        >
                          <h6
                            style={{
                              color: "#000000",
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
                      ))}
                    </div>
                  </div>
                )}

                {selectedFestival.eventCharacterResponses?.length > 0 && (
                  <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                    <h5
                      style={{
                        color: "#000000",
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
                      {selectedFestival.eventCharacterResponses.map((cosplayer) => {
                        const cosplayerData = cosplayerDetails[cosplayer.eventCharacterId];
                        const avatarImage = cosplayerData?.images?.find(
                          (img) => img.isAvatar
                        ) || cosplayerData?.images?.[0];
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
                              (e.currentTarget.style.transform = "translateY(-5px)")
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
                                alt={cosplayerData?.name || "Cosplayer"}
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
                                  color: "#000000",
                                  fontWeight: 600,
                                  marginBottom: "0.5rem",
                                }}
                              >
                                {cosplayerData?.name || "Unknown Cosplayer"}
                              </h6>
                              <p
                                style={{
                                  color: "#4a4a4a",
                                  fontSize: "0.8rem",
                                  margin: 0,
                                }}
                              >
                                {cosplayerData?.description || "Cosplayer"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="fest-ticket-section mt-4">
                  <h5>Purchase Tickets</h5>
                  <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                    <h6
                      style={{
                        color: "#000000",
                        fontWeight: 600,
                        marginBottom: "1rem",
                      }}
                    >
                      Select Ticket Type
                    </h6>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "1rem",
                        maxWidth: "100%",
                      }}
                    >
                      {selectedFestival.ticket.map((ticket) => (
                        <div
                          key={ticket.ticketId}
                          style={{
                            background:
                              selectedTicketType?.ticketId === ticket.ticketId
                                ? "linear-gradient(135deg, #f8e6f2, #e6f0fa)"
                                : "white",
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                            transition: "transform 0.3s ease, background 0.3s ease",
                            cursor: ticket.ticketStatus === 0 ? "pointer" : "not-allowed",
                            border:
                              selectedTicketType?.ticketId === ticket.ticketId
                                ? "2px solid #510545"
                                : "2px solid transparent",
                            opacity: ticket.ticketStatus === 1 ? 0.6 : 1,
                          }}
                          onClick={() => ticket.ticketStatus === 0 && handleTicketTypeSelect(ticket)}
                        >
                          <h6
                            style={{
                              color: "#510545",
                              fontWeight: 600,
                              marginBottom: "0.5rem",
                              textTransform: "uppercase",
                            }}
                          >
                            {ticket.ticketType === 0 ? "Normal" : "Premium"} -{" "}
                            {formatPrice(ticket.price)}
                          </h6>
                          <p
                            style={{
                              color: "#4a4a4a",
                              fontSize: "0.9rem",
                              marginBottom: "0.5rem",
                              fontStyle: "italic",
                            }}
                          >
                            {ticket.description}
                          </p>
                          <p
                            style={{
                              color: "#22668a",
                              fontSize: "0.8rem",
                              margin: 0,
                              fontWeight: 500,
                            }}
                          >
                            Available: {ticket.quantity}
                          </p>
                          {ticket.ticketStatus === 1 && (
                            <p
                              style={{
                                color: "red",
                                fontSize: "0.8rem",
                                marginTop: "0.5rem",
                                fontWeight: 500,
                              }}
                            >
                              This ticket is not available for purchase
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedTicketType && (
                    <div className="fest-ticket-quantity mb-3">
                      <Form.Label style={{ color: "#510545", fontWeight: 600 }}>
                        Quantity
                      </Form.Label>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          onClick={handleDecrease}
                          disabled={ticketQuantity === 1 || selectedTicketType.ticketStatus === 1}
                        >
                          -
                        </Button>
                        <span className="mx-3" style={{ color: "#4a4a4a", fontSize: "1.2rem" }}>
                          {ticketQuantity}
                        </span>
                        <Button
                          variant="outline-secondary"
                          onClick={handleIncrease}
                          disabled={
                            !selectedTicketType ||
                            selectedTicketType.quantity === 0 ||
                            ticketQuantity >= selectedTicketType.quantity ||
                            selectedTicketType.ticketStatus === 1
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    className="fest-buy-ticket-btn"
                    onClick={handleBuyNow}
                    disabled={
                      !selectedTicketType ||
                      selectedTicketType.quantity === 0 ||
                      selectedTicketType.ticketStatus === 1
                    }
                    style={{
                      background:
                        !selectedTicketType ||
                        selectedTicketType.quantity === 0 ||
                        selectedTicketType.ticketStatus === 1
                          ? "#6c757d"
                          : "linear-gradient(135deg, #510545, #22668a)",
                      border: "none",
                    }}
                  >
                    Buy Now -{" "}
                    {formatPrice(selectedTicketType?.price * ticketQuantity || 0)}
                  </Button>
                  {selectedTicketType?.ticketStatus === 1 && (
                    <p
                      style={{
                        color: "red",
                        fontSize: "0.9rem",
                        marginTop: "0.5rem",
                        fontWeight: 500,
                      }}
                    >
                      This event has stopped selling tickets
                    </p>
                  )}
                </div>

                {showPurchaseForm && (
                  <div className="fest-purchase-form mt-4">
                    <h5>Select Payment Method</h5>
                    <Form>
                      <Form.Check
                        type="radio"
                        label="MoMo"
                        name="paymentMethod"
                        onChange={() => setPaymentMethod("Momo")}
                        className="mb-2"
                        style={{ color: "#4a4a4a" }}
                      />
                      <Form.Check
                        type="radio"
                        label="VNPay"
                        name="paymentMethod"
                        onChange={() => setPaymentMethod("VNPay")}
                        className="mb-2"
                        style={{ color: "#4a4a4a" }}
                      />
                      <Button
                        variant="primary"
                        onClick={handleConfirmPurchase}
                        className="mt-3"
                        style={{
                          background: "linear-gradient(135deg, #510545, #22668a)",
                          border: "none",
                        }}
                      >
                        Confirm Purchase
                      </Button>
                    </Form>
                  </div>
                )}

                {showConfirmModal && (
                  <div className="fest-purchase-form mt-4">
                    <h5>Confirm Payment</h5>
                    <p>
                      Are you sure you want to pay{" "}
                      {formatPrice(selectedTicketType?.price * ticketQuantity)}{" "}
                      for {ticketQuantity} ticket(s) with {paymentMethod}?
                    </p>
                    <Button
                      variant="success"
                      onClick={handleFinalConfirm}
                      className="me-2"
                      style={{
                        background: "linear-gradient(135deg, #28a745, #218838)",
                        border: "none",
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleBackToPayment}
                      className="me-2"
                      style={{
                        background: "linear-gradient(135deg, #6b7280, #4a4a4a)",
                        border: "none",
                      }}
                    >
                      No
                    </Button>
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