// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Modal, Button, Form, Carousel } from "react-bootstrap";
// import { useParams, useNavigate } from "react-router-dom";
// import "../../styles/FestivalsPage.scss";
// import FestivalService from "../../services/FestivalService/FestivalService";
// import PaymentService from "../../services/PaymentService/PaymentService";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { jwtDecode } from "jwt-decode";
// import { Pagination } from "antd";

// const FestivalsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFestivalModal, setShowFestivalModal] = useState(false);
//   const [selectedFestival, setSelectedFestival] = useState(null);
//   const [ticketQuantity, setTicketQuantity] = useState(1);
//   const [selectedTicketType, setSelectedTicketType] = useState(null);
//   const [showPurchaseForm, setShowPurchaseForm] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [festivals, setFestivals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [cosplayerDetails, setCosplayerDetails] = useState({});
//   const [accountId, setAccountId] = useState(null);
//   const [accountName, setAccountName] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const navigate = useNavigate();

//   const { category } = useParams();
//   const selectedCategory = category || "all";

//   const formatPrice = (price) => {
//     return `${price.toLocaleString("vi-VN")} VND`;
//   };

//   const getAccountInfoFromToken = () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         return {
//           id: decoded?.Id,
//           accountName: decoded?.AccountName,
//         };
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accountInfo = getAccountInfoFromToken();
//         if (accountInfo) {
//           setAccountId(accountInfo.id);
//           setAccountName(accountInfo.accountName);
//         }

//         const festivalData = await FestivalService.getAllFestivals();
//         setFestivals(festivalData);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//         toast.error("Failed to load festivals");
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchCosplayerDetails = async () => {
//       if (!selectedFestival || !selectedFestival.eventCharacterResponses) return;

//       const details = {};
//       try {
//         await Promise.all(
//           selectedFestival.eventCharacterResponses.map(async (cosplayer) => {
//             const response = await FestivalService.getCosplayerByEventCharacterId(
//               cosplayer.eventCharacterId
//             );
//             details[cosplayer.eventCharacterId] = response;
//           })
//         );
//         setCosplayerDetails(details);
//       } catch (err) {
//         console.error("Error fetching cosplayer details:", err);
//         toast.error("Failed to load cosplayer details");
//       }
//     };
//     fetchCosplayerDetails();
//   }, [selectedFestival]);

//   const handleFestivalShow = (festival) => {
//     setSelectedFestival(festival);
//     const availableTicket = festival.ticket.find((t) => t.ticketStatus === 0) || festival.ticket[0];
//     setSelectedTicketType(availableTicket);
//     setTicketQuantity(1);
//     setShowFestivalModal(true);
//   };

//   const handleFestivalClose = () => {
//     setShowFestivalModal(false);
//     setSelectedFestival(null);
//     setTicketQuantity(1);
//     setSelectedTicketType(null);
//     setShowPurchaseForm(false);
//     setShowConfirmModal(false);
//     setPaymentMethod(null);
//     setCosplayerDetails({});
//   };

//   const handleIncrease = () => {
//     if (selectedTicketType && ticketQuantity < selectedTicketType.quantity) {
//       setTicketQuantity((prev) => prev + 1);
//     } else {
//       toast.error("Quantity exceeds available tickets!");
//     }
//   };

//   const handleDecrease = () => setTicketQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   const handleTicketTypeSelect = (ticket) => {
//     setSelectedTicketType(ticket);
//     setTicketQuantity(1);
//   };

//   const handleBuyNow = () => {
//     if (!accountId) {
//       toast.error("Please log in to proceed with payment!");
//       return;
//     }
//     if (selectedTicketType?.ticketStatus === 1) {
//       toast.error("This event has stopped selling tickets!");
//       return;
//     }
//     setShowPurchaseForm(true);
//   };

//   const handleConfirmPurchase = () => {
//     if (!paymentMethod) {
//       toast.error("Please select a payment method!");
//       return;
//     }
//     setShowPurchaseForm(false);
//     setShowConfirmModal(true);
//   };

//   const handleFinalConfirm = async () => {
//     const totalAmount = selectedTicketType?.price * ticketQuantity;

//     if (!accountId) {
//       toast.error("Please log in to proceed with payment!");
//       return;
//     }

//     if (!selectedTicketType || !selectedTicketType.ticketId) {
//       toast.error("Please select a valid ticket type!");
//       return;
//     }

//     try {
//       if (paymentMethod === "Momo") {
//         const paymentData = {
//           fullName: accountName || "Unknown",
//           orderInfo: `Purchase ${ticketQuantity} ${selectedTicketType.ticketType === 0 ? 'Normal' : 'Premium'} ticket(s) for ${selectedFestival.eventName}`,
//           amount: totalAmount,
//           purpose: 0,
//           accountId: accountId,
//           accountCouponId: null,
//           ticketId: selectedTicketType.ticketId.toString(),
//           ticketQuantity: ticketQuantity.toString(),
//           contractId: null,
//           orderpaymentId: null,
//           isWeb: true,
//         };

//         console.log("Payment Data (MoMo):", paymentData);

//         const paymentUrl = await PaymentService.createMomoPayment(paymentData);
//         if (!paymentUrl) {
//           throw new Error("Failed to create MoMo payment URL");
//         }

//         toast.success("Redirecting to MoMo payment...");
//         localStorage.setItem("paymentSource", "festivals");
//         window.location.href = paymentUrl;
//       } else if (paymentMethod === "VNPay") {
//         const paymentData = {
//           fullName: accountName || "Unknown",
//           orderInfo: `Purchase ${ticketQuantity} ${selectedTicketType.ticketType === 0 ? 'Normal' : 'Premium'} ticket(s) for ${selectedFestival.eventName}`,
//           amount: totalAmount,
//           purpose: 0,
//           accountId: accountId,
//           accountCouponId: null,
//           ticketId: selectedTicketType.ticketId.toString(),
//           ticketQuantity: ticketQuantity.toString(),
//           contractId: null,
//           orderpaymentId: null,
//           isWeb: true,
//         };

//         console.log("Payment Data (VNPay):", paymentData);

//         const paymentUrl = await PaymentService.createVnpayPayment(paymentData);
//         if (!paymentUrl) {
//           throw new Error("Failed to create VNPay payment URL");
//         }

//         toast.success("Redirecting to VNPay payment...");
//         localStorage.setItem("paymentSource", "festivals");
//         window.location.href = paymentUrl;
//       }
//     } catch (error) {
//       console.error("Error in handleFinalConfirm:", error);
//       toast.error(error.message || "Failed to process payment");
//       setShowConfirmModal(false);
//     }
//   };

//   const handleBackToPayment = () => {
//     setShowConfirmModal(false);
//     setShowPurchaseForm(true);
//   };

//   const filteredFestivals = festivals.filter((festival) =>
//     festival.eventName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const paginatedFestivals = filteredFestivals.slice(startIndex, endIndex);

//   const handlePageChange = (page, pageSize) => {
//     setCurrentPage(page);
//     setPageSize(pageSize);
//   };

//   if (loading) return <div className="text-center py-5">Loading festivals...</div>;
//   if (error) return <div className="text-center py-5 text-danger">{error}</div>;

//   return (
//     <div className="fest-page min-vh-100">
//       <div className="fest-hero-section text-white py-5">
//         <div className="container">
//           <h1 className="display-4 fw-bold text-center">Enjoy Festivals</h1>
//           <p className="lead text-center mt-3">
//             Explore epic cosplay festivals and events!
//           </p>
//         </div>
//       </div>

//       <div className="container py-5">
//         <div className="fest-search-container mb-5">
//           <div className="fest-search-bar mx-auto">
//             <div className="input-group">
//               <span className="input-group-text">
//                 <Search size={20} />
//               </span>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search festivals..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="fest-grid">
//           {paginatedFestivals.map((festival) => (
//             <div className="fest-card" key={festival.eventId}>
//               <div className="fest-card-image">
//                 <img
//                   src={
//                     festival.eventImageResponses[0]?.imageUrl ||
//                     "https://via.placeholder.com/300"
//                   }
//                   alt={festival.eventName}
//                 />
//               </div>
//               <div className="fest-card-content">
//                 <h5 className="fest-name">{festival.eventName}</h5>
//                 <p className="fest-description">{festival.description}</p>
//                 <div className="fest-meta">
//                   <span className="fest-date">
//                     {new Date(festival.startDate).toLocaleDateString()} -{" "}
//                     {new Date(festival.endDate).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <p className="fest-location">{festival.location}</p>
//                 <button
//                   className="fest-learn-more-btn"
//                   onClick={() => handleFestivalShow(festival)}
//                 >
//                   Learn More
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredFestivals.length === 0 ? (
//           <p className="text-center mt-4">No festivals found.</p>
//         ) : (
//           <div className="pagination-container mt-5">
//             <Pagination
//               current={currentPage}
//               pageSize={pageSize}
//               total={filteredFestivals.length}
//               onChange={handlePageChange}
//               showSizeChanger
//               pageSizeOptions={["4", "8", "12", "16"]}
//               showTotal={(total, range) =>
//                 `${range[0]}-${range[1]} of ${total} items`
//               }
//             />
//           </div>
//         )}
//       </div>

//       <Modal
//         show={showFestivalModal}
//         onHide={handleFestivalClose}
//         size="lg"
//         centered
//         className="gallery-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedFestival?.eventName} Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedFestival && (
//             <div className="costume-gallery">
//               <Carousel className="gallery-carousel">
//                 {selectedFestival.eventImageResponses.map((image, index) => (
//                   <Carousel.Item key={image.imageId}>
//                     <div className="carousel-image-container">
//                       <img
//                         className="d-block w-100"
//                         src={image.imageUrl}
//                         alt={`${selectedFestival.eventName} - Image ${index + 1}`}
//                       />
//                     </div>
//                     <Carousel.Caption>
//                       <h3>{selectedFestival.eventName}</h3>
//                       <p>Image {index + 1} of {selectedFestival.eventImageResponses.length}</p>
//                     </Carousel.Caption>
//                   </Carousel.Item>
//                 ))}
//               </Carousel>

//               <div className="fest-details mt-4">
//                 <h4>About {selectedFestival.eventName}</h4>
//                 <p>{selectedFestival.description}</p>
//                 <div className="fest-info">
//                   <div className="fest-info-item">
//                     <strong>Date:</strong>{" "}
//                     {new Date(selectedFestival.startDate).toLocaleDateString()} -{" "}
//                     {new Date(selectedFestival.endDate).toLocaleDateString()}
//                   </div>
//                   <div className="fest-info-item">
//                     <strong>Location:</strong> {selectedFestival.location}
//                   </div>
//                 </div>

//                 {selectedFestival.eventActivityResponse?.length > 0 && (
//                   <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
//                     <h5
//                       style={{
//                         color: "#000000",
//                         fontWeight: 600,
//                         marginBottom: "1rem",
//                       }}
//                     >
//                       Activities
//                     </h5>
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//                         gap: "1rem",
//                       }}
//                     >
//                       {selectedFestival.eventActivityResponse.map((activity) => (
//                         <div
//                           key={activity.eventActivityId}
//                           style={{
//                             background: "white",
//                             borderRadius: "0.5rem",
//                             padding: "1rem",
//                             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
//                             transition: "transform 0.3s ease",
//                           }}
//                           onMouseEnter={(e) =>
//                             (e.currentTarget.style.transform = "translateY(-5px)")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.currentTarget.style.transform = "translateY(0)")
//                           }
//                         >
//                           <h6
//                             style={{
//                               color: "#000000",
//                               fontWeight: 600,
//                               marginBottom: "0.5rem",
//                             }}
//                           >
//                             {activity.activity.name}
//                           </h6>
//                           <p
//                             style={{
//                               color: "#4a4a4a",
//                               fontSize: "0.9rem",
//                               margin: 0,
//                             }}
//                           >
//                             {activity.activity.description}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {selectedFestival.eventCharacterResponses?.length > 0 && (
//                   <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
//                     <h5
//                       style={{
//                         color: "#000000",
//                         fontWeight: 600,
//                         marginBottom: "1rem",
//                       }}
//                     >
//                       Participating Cosplayers
//                     </h5>
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(3, 1fr)",
//                         gap: "1rem",
//                         maxWidth: "100%",
//                       }}
//                     >
//                       {selectedFestival.eventCharacterResponses.map((cosplayer) => {
//                         const cosplayerData = cosplayerDetails[cosplayer.eventCharacterId];
//                         const avatarImage = cosplayerData?.images?.find(
//                           (img) => img.isAvatar
//                         ) || cosplayerData?.images?.[0];
//                         return (
//                           <div
//                             key={cosplayer.eventCharacterId}
//                             style={{
//                               background: "white",
//                               borderRadius: "0.5rem",
//                               overflow: "hidden",
//                               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
//                               transition: "transform 0.3s ease",
//                               maxWidth: "100%",
//                             }}
//                             onMouseEnter={(e) =>
//                               (e.currentTarget.style.transform = "translateY(-5px)")
//                             }
//                             onMouseLeave={(e) =>
//                               (e.currentTarget.style.transform = "translateY(0)")
//                             }
//                           >
//                             <div
//                               style={{
//                                 width: "100%",
//                                 height: "200px",
//                                 overflow: "hidden",
//                                 backgroundColor: "#f0f0f0",
//                               }}
//                             >
//                               <img
//                                 src={
//                                   avatarImage?.urlImage ||
//                                   "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg"
//                                 }
//                                 alt={cosplayerData?.name || "Cosplayer"}
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   objectFit: "cover",
//                                   transition: "transform 0.3s ease",
//                                 }}
//                                 onMouseEnter={(e) =>
//                                   (e.currentTarget.style.transform = "scale(1.05)")
//                                 }
//                                 onMouseLeave={(e) =>
//                                   (e.currentTarget.style.transform = "scale(1)")
//                                 }
//                                 onError={(e) =>
//                                   (e.currentTarget.src =
//                                     "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg")
//                                 }
//                               />
//                             </div>
//                             <div
//                               style={{
//                                 padding: "1rem",
//                                 textAlign: "center",
//                               }}
//                             >
//                               <h6
//                                 style={{
//                                   color: "#000000",
//                                   fontWeight: 600,
//                                   marginBottom: "0.5rem",
//                                 }}
//                               >
//                                 {cosplayerData?.name || "Unknown Cosplayer"}
//                               </h6>
//                               <p
//                                 style={{
//                                   color: "#4a4a4a",
//                                   fontSize: "0.8rem",
//                                   margin: 0,
//                                 }}
//                               >
//                                 {cosplayerData?.description || "Cosplayer"}
//                               </p>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}

//                 <div className="fest-ticket-section mt-4">
//                   <h5>Purchase Tickets</h5>
//                   <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
//                     <h6
//                       style={{
//                         color: "#000000",
//                         fontWeight: 600,
//                         marginBottom: "1rem",
//                       }}
//                     >
//                       Select Ticket Type
//                     </h6>
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(2, 1fr)",
//                         gap: "1rem",
//                         maxWidth: "100%",
//                       }}
//                     >
//                       {selectedFestival.ticket.map((ticket) => (
//                         <div
//                           key={ticket.ticketId}
//                           style={{
//                             background:
//                               selectedTicketType?.ticketId === ticket.ticketId
//                                 ? "linear-gradient(135deg, #f8e6f2, #e6f0fa)"
//                                 : "white",
//                             borderRadius: "0.5rem",
//                             padding: "1rem",
//                             boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
//                             transition: "transform 0.3s ease, background 0.3s ease",
//                             cursor: ticket.ticketStatus === 0 ? "pointer" : "not-allowed",
//                             border:
//                               selectedTicketType?.ticketId === ticket.ticketId
//                                 ? "2px solid #510545"
//                                 : "2px solid transparent",
//                             opacity: ticket.ticketStatus === 1 ? 0.6 : 1,
//                           }}
//                           onClick={() => ticket.ticketStatus === 0 && handleTicketTypeSelect(ticket)}
//                         >
//                           <h6
//                             style={{
//                               color: "#510545",
//                               fontWeight: 600,
//                               marginBottom: "0.5rem",
//                               textTransform: "uppercase",
//                             }}
//                           >
//                             {ticket.ticketType === 0 ? "Normal" : "Premium"} -{" "}
//                             {formatPrice(ticket.price)}
//                           </h6>
//                           <p
//                             style={{
//                               color: "#4a4a4a",
//                               fontSize: "0.9rem",
//                               marginBottom: "0.5rem",
//                               fontStyle: "italic",
//                             }}
//                           >
//                             {ticket.description}
//                           </p>
//                           <p
//                             style={{
//                               color: "#22668a",
//                               fontSize: "0.8rem",
//                               margin: 0,
//                               fontWeight: 500,
//                             }}
//                           >
//                             Available: {ticket.quantity}
//                           </p>
//                           {ticket.ticketStatus === 1 && (
//                             <p
//                               style={{
//                                 color: "red",
//                                 fontSize: "0.8rem",
//                                 marginTop: "0.5rem",
//                                 fontWeight: 500,
//                               }}
//                             >
//                               This ticket is not available for purchase
//                             </p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {selectedTicketType && (
//                     <div className="fest-ticket-quantity mb-3">
//                       <Form.Label style={{ color: "#510545", fontWeight: 600 }}>
//                         Quantity
//                       </Form.Label>
//                       <div className="d-flex align-items-center">
//                         <Button
//                           variant="outline-secondary"
//                           onClick={handleDecrease}
//                           disabled={ticketQuantity === 1 || selectedTicketType.ticketStatus === 1}
//                         >
//                           -
//                         </Button>
//                         <span className="mx-3" style={{ color: "#4a4a4a", fontSize: "1.2rem" }}>
//                           {ticketQuantity}
//                         </span>
//                         <Button
//                           variant="outline-secondary"
//                           onClick={handleIncrease}
//                           disabled={
//                             !selectedTicketType ||
//                             selectedTicketType.quantity === 0 ||
//                             ticketQuantity >= selectedTicketType.quantity ||
//                             selectedTicketType.ticketStatus === 1
//                           }
//                         >
//                           +
//                         </Button>
//                       </div>
//                     </div>
//                   )}

//                   <Button
//                     variant="primary"
//                     className="fest-buy-ticket-btn"
//                     onClick={handleBuyNow}
//                     disabled={
//                       !selectedTicketType ||
//                       selectedTicketType.quantity === 0 ||
//                       selectedTicketType.ticketStatus === 1
//                     }
//                     style={{
//                       background:
//                         !selectedTicketType ||
//                         selectedTicketType.quantity === 0 ||
//                         selectedTicketType.ticketStatus === 1
//                           ? "#6c757d"
//                           : "linear-gradient(135deg, #510545, #22668a)",
//                       border: "none",
//                     }}
//                   >
//                     Buy Now -{" "}
//                     {formatPrice(selectedTicketType?.price * ticketQuantity || 0)}
//                   </Button>
//                   {selectedTicketType?.ticketStatus === 1 && (
//                     <p
//                       style={{
//                         color: "red",
//                         fontSize: "0.9rem",
//                         marginTop: "0.5rem",
//                         fontWeight: 500,
//                       }}
//                     >
//                       This event has stopped selling tickets
//                     </p>
//                   )}
//                 </div>

//                 {showPurchaseForm && (
//                   <div className="fest-purchase-form mt-4">
//                     <h5>Select Payment Method</h5>
//                     <Form>
//                       <Form.Check
//                         type="radio"
//                         label="MoMo"
//                         name="paymentMethod"
//                         onChange={() => setPaymentMethod("Momo")}
//                         className="mb-2"
//                         style={{ color: "#4a4a4a" }}
//                       />
//                       <Form.Check
//                         type="radio"
//                         label="VNPay"
//                         name="paymentMethod"
//                         onChange={() => setPaymentMethod("VNPay")}
//                         className="mb-2"
//                         style={{ color: "#4a4a4a" }}
//                       />
//                       <Button
//                         variant="primary"
//                         onClick={handleConfirmPurchase}
//                         className="mt-3"
//                         style={{
//                           background: "linear-gradient(135deg, #510545, #22668a)",
//                           border: "none",
//                         }}
//                       >
//                         Confirm Purchase
//                       </Button>
//                     </Form>
//                   </div>
//                 )}

//                 {showConfirmModal && (
//                   <div className="fest-purchase-form mt-4">
//                     <h5>Confirm Payment</h5>
//                     <p>
//                       Are you sure you want to pay{" "}
//                       {formatPrice(selectedTicketType?.price * ticketQuantity)}{" "}
//                       for {ticketQuantity} ticket(s) with {paymentMethod}?
//                     </p>
//                     <Button
//                       variant="success"
//                       onClick={handleFinalConfirm}
//                       className="me-2"
//                       style={{
//                         background: "linear-gradient(135deg, #28a745, #218838)",
//                         border: "none",
//                       }}
//                     >
//                       Yes
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       onClick={handleBackToPayment}
//                       className="me-2"
//                       style={{
//                         background: "linear-gradient(135deg, #6b7280, #4a4a4a)",
//                         border: "none",
//                       }}
//                     >
//                       No
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default FestivalsPage;

//------------------------------------------------------------------------------------------------//

//sửa vào 24/05/2025

// Import các thư viện và component cần thiết
// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Modal, Button, Form, Carousel } from "react-bootstrap";
// import { useParams, useNavigate, Link } from "react-router-dom"; // Thêm Link
// import "../../styles/FestivalsPage.scss";
// import FestivalService from "../../services/FestivalService/FestivalService";
// import PaymentService from "../../services/PaymentService/PaymentService";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { jwtDecode } from "jwt-decode";
// import { Pagination } from "antd";
// import dayjs from "dayjs"; // Thêm import dayjs

// const FestivalsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFestivalModal, setShowFestivalModal] = useState(false);
//   const [selectedFestival, setSelectedFestival] = useState(null);
//   const [ticketQuantity, setTicketQuantity] = useState(1);
//   const [selectedTicketType, setSelectedTicketType] = useState(null);
//   const [showPurchaseForm, setShowPurchaseForm] = useState(false);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [festivals, setFestivals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [cosplayerDetails, setCosplayerDetails] = useState({});
//   const [accountId, setAccountId] = useState(null);
//   const [accountName, setAccountName] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const navigate = useNavigate();

//   const { category } = useParams();
//   const selectedCategory = category || "all";

//   // Hàm định dạng giá tiền
//   const formatPrice = (price) => {
//     return `${price.toLocaleString("vi-VN")} VND`;
//   };

//   // Hàm định dạng ngày thành DD/MM/YYYY
//   const formatDateVN = (dateString) => {
//     return dayjs(dateString).format("DD/MM/YYYY");
//   };

//   // Lấy thông tin tài khoản từ token
//   const getAccountInfoFromToken = () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         return {
//           id: decoded?.Id,
//           accountName: decoded?.AccountName,
//         };
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   // Lấy dữ liệu lễ hội và thông tin tài khoản khi component được mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accountInfo = getAccountInfoFromToken();
//         if (accountInfo) {
//           setAccountId(accountInfo.id);
//           setAccountName(accountInfo.accountName);
//         }

//         const festivalData = await FestivalService.getAllFestivals();
//         setFestivals(festivalData);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//         toast.error("Failed to load festivals");
//       }
//     };
//     fetchData();
//   }, []);

//   // Lấy thông tin chi tiết cosplayer khi chọn lễ hội
//   useEffect(() => {
//     const fetchCosplayerDetails = async () => {
//       if (!selectedFestival || !selectedFestival.eventCharacterResponses) return;

//       const details = {};
//       try {
//         await Promise.all(
//           selectedFestival.eventCharacterResponses.map(async (cosplayer) => {
//             const response = await FestivalService.getCosplayerByEventCharacterId(
//               cosplayer.eventCharacterId
//             );
//             details[cosplayer.eventCharacterId] = response;
//           })
//         );
//         setCosplayerDetails(details);
//       } catch (err) {
//         console.error("Error fetching cosplayer details:", err);
//         toast.error("Failed to load cosplayer details");
//       }
//     };
//     fetchCosplayerDetails();
//   }, [selectedFestival]);

//   // Hàm hiển thị modal chi tiết lễ hội
//   const handleFestivalShow = (festival) => {
//     setSelectedFestival(festival);
//     const availableTicket = festival.ticket.find((t) => t.ticketStatus === 0) || festival.ticket[0];
//     setSelectedTicketType(availableTicket);
//     setTicketQuantity(1);
//     setShowFestivalModal(true);
//   };

//   // Hàm đóng modal chi tiết lễ hội
//   const handleFestivalClose = () => {
//     setShowFestivalModal(false);
//     setSelectedFestival(null);
//     setTicketQuantity(1);
//     setSelectedTicketType(null);
//     setShowPurchaseForm(false);
//     setShowConfirmModal(false);
//     setPaymentMethod(null);
//     setCosplayerDetails({});
//   };

//   // Hàm tăng số lượng vé
//   const handleIncrease = () => {
//     if (selectedTicketType && ticketQuantity < selectedTicketType.quantity) {
//       setTicketQuantity((prev) => prev + 1);
//     } else {
//       toast.error("Quantity exceeds available tickets!");
//     }
//   };

//   // Hàm giảm số lượng vé
//   const handleDecrease = () => setTicketQuantity((prev) => (prev > 1 ? prev - 1 : 1));

//   // Hàm chọn loại vé
//   const handleTicketTypeSelect = (ticket) => {
//     setSelectedTicketType(ticket);
//     setTicketQuantity(1);
//   };

//   // Hàm xử lý mua vé ngay
//   const handleBuyNow = () => {
//     if (!accountId) {
//       toast.error("Please log in to proceed with payment!");
//       return;
//     }
//     if (selectedTicketType?.ticketStatus === 1) {
//       toast.error("This event has stopped selling tickets!");
//       return;
//     }
//     setShowPurchaseForm(true);
//   };

//   // Hàm xác nhận mua vé
//   const handleConfirmPurchase = () => {
//     if (!paymentMethod) {
//       toast.error("Please select a payment method!");
//       return;
//     }
//     setShowPurchaseForm(false);
//     setShowConfirmModal(true);
//   };

//   // Hàm xác nhận thanh toán cuối cùng
//   const handleFinalConfirm = async () => {
//     const totalAmount = selectedTicketType?.price * ticketQuantity;

//     if (!accountId) {
//       toast.error("Please log in to proceed with payment!");
//       return;
//     }

//     if (!selectedTicketType || !selectedTicketType.ticketId) {
//       toast.error("Please select a valid ticket type!");
//       return;
//     }

//     try {
//       if (paymentMethod === "Momo") {
//         const paymentData = {
//           fullName: accountName || "Unknown",
//           orderInfo: `Purchase ${ticketQuantity} ${selectedTicketType.ticketType === 0 ? 'Normal' : 'Premium'} ticket(s) for ${selectedFestival.eventName}`,
//           amount: totalAmount,
//           purpose: 0,
//           accountId: accountId,
//           accountCouponId: null,
//           ticketId: selectedTicketType.ticketId.toString(),
//           ticketQuantity: ticketQuantity.toString(),
//           contractId: null,
//           orderpaymentId: null,
//           isWeb: true,
//         };

//         console.log("Payment Data (MoMo):", paymentData);

//         const paymentUrl = await PaymentService.createMomoPayment(paymentData);
//         if (!paymentUrl) {
//           throw new Error("Failed to create MoMo payment URL");
//         }

//         toast.success("Redirecting to MoMo payment...");
//         localStorage.setItem("paymentSource", "festivals");
//         window.location.href = paymentUrl;
//       } else if (paymentMethod === "VNPay") {
//         const paymentData = {
//           fullName: accountName || "Unknown",
//           orderInfo: `Purchase ${ticketQuantity} ${selectedTicketType.ticketType === 0 ? 'Normal' : 'Premium'} ticket(s) for ${selectedFestival.eventName}`,
//           amount: totalAmount,
//           purpose: 0,
//           accountId: accountId,
//           accountCouponId: null,
//           ticketId: selectedTicketType.ticketId.toString(),
//           ticketQuantity: ticketQuantity.toString(),
//           contractId: null,
//           orderpaymentId: null,
//           isWeb: true,
//         };

//         console.log("Payment Data (VNPay):", paymentData);

//         const paymentUrl = await PaymentService.createVnpayPayment(paymentData);
//         if (!paymentUrl) {
//           throw new Error("Failed to create VNPay payment URL");
//         }

//         toast.success("Redirecting to VNPay payment...");
//         localStorage.setItem("paymentSource", "festivals");
//         window.location.href = paymentUrl;
//       }
//     } catch (error) {
//       console.error("Error in handleFinalConfirm:", error);
//       toast.error(error.message || "Failed to process payment");
//       setShowConfirmModal(false);
//     }
//   };

//   // Hàm quay lại form thanh toán
//   const handleBackToPayment = () => {
//     setShowConfirmModal(false);
//     setShowPurchaseForm(true);
//   };

//   // Lọc danh sách lễ hội theo từ khóa tìm kiếm
//   const filteredFestivals = festivals.filter((festival) =>
//     festival.eventName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Phân trang danh sách lễ hội
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const paginatedFestivals = filteredFestivals.slice(startIndex, endIndex);

//   // Hàm xử lý thay đổi trang
//   const handlePageChange = (page, pageSize) => {
//     setCurrentPage(page);
//     setPageSize(pageSize);
//   };

//   if (loading) return <div className="text-center py-5">Loading festivals...</div>;
//   if (error) return <div className="text-center py-5 text-danger">{error}</div>;

//   return (
//     <div className="fest-page min-vh-100">
//       <div className="fest-hero-section text-white py-5">
//         <div className="container">
//           <h1 className="display-4 fw-bold text-center">Enjoy Festivals</h1>
//           <p className="lead text-center mt-3">
//             Explore epic cosplay festivals and events!
//           </p>
//         </div>
//       </div>

//       <div className="container py-5">
//         <div className="fest-search-container mb-5">
//           <div className="fest-search-bar mx-auto">
//             <div className="input-group">
//               <span className="input-group-text">
//                 <Search size={20} />
//               </span>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search festivals..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="fest-grid">
//           {paginatedFestivals.map((festival) => (
//             <div className="fest-card" key={festival.eventId}>
//               <div className="fest-card-image">
//                 <img
//                   src={
//                     festival.eventImageResponses[0]?.imageUrl ||
//                     "https://via.placeholder.com/300"
//                   }
//                   alt={festival.eventName}
//                 />
//               </div>
//               <div className="fest-card-content">
//                 <h5 className="fest-name">{festival.eventName}</h5>
//                 <p className="fest-description">{festival.description}</p>
//                 <div className="fest-meta">
//                   <span className="fest-date">
//                     {formatDateVN(festival.startDate)} -{" "}
//                     {formatDateVN(festival.endDate)}
//                   </span>
//                 </div>
//                 <p className="fest-location">{festival.location}</p>
//                 <button
//                   className="fest-learn-more-btn"
//                   onClick={() => handleFestivalShow(festival)}
//                 >
//                   Learn More
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredFestivals.length === 0 ? (
//           <p className="text-center mt-4">No festivals found.</p>
//         ) : (
//           <div className="pagination-container mt-5">
//             <Pagination
//               current={currentPage}
//               pageSize={pageSize}
//               total={filteredFestivals.length}
//               onChange={handlePageChange}
//               showSizeChanger
//               pageSizeOptions={["4", "8", "12", "16"]}
//               showTotal={(total, range) =>
//                 `${range[0]}-${range[1]} of ${total} items`
//               }
//             />
//           </div>
//         )}
//       </div>

//       <Modal
//         show={showFestivalModal}
//         onHide={handleFestivalClose}
//         size="lg"
//         centered
//         className="gallery-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedFestival?.eventName} Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedFestival && (
//             <div className="costume-gallery">
//               <Carousel className="gallery-carousel">
//                 {selectedFestival.eventImageResponses.map((image, index) => (
//                   <Carousel.Item key={image.imageId}>
//                     <div className="carousel-image-container">
//                       <img
//                         className="d-block w-100"
//                         src={image.imageUrl}
//                         alt={`${selectedFestival.eventName} - Image ${index + 1}`}
//                       />
//                     </div>
//                     <Carousel.Caption>
//                       <h3>{selectedFestival.eventName}</h3>
//                       <p>Image {index + 1} of {selectedFestival.eventImageResponses.length}</p>
//                     </Carousel.Caption>
//                   </Carousel.Item>
//                 ))}
//               </Carousel>

//               <div className="fest-details mt-4">
//                 <h4>About {selectedFestival.eventName}</h4>
//                 <p>{selectedFestival.description}</p>
//                 <div className="fest-info">
//                   <div className="fest-info-item">
//                     <strong>Date:</strong>{" "}
//                     {formatDateVN(selectedFestival.startDate)} -{" "}
//                     {formatDateVN(selectedFestival.endDate)}
//                   </div>
//                   <div className="fest-info-item">
//                     <strong>Location:</strong> {selectedFestival.location}
//                   </div>
//                 </div>

//                 {selectedFestival.eventActivityResponse?.length > 0 && (
//                   <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
//                     <h5
//                       style={{
//                         color: "#000000",
//                         fontWeight: 600,
//                         marginBottom: "1rem",
//                       }}
//                     >
//                       Activities
//                     </h5>
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//                         gap: "1rem",
//                       }}
//                     >
//                       {selectedFestival.eventActivityResponse.map((activity) => (
//                         <div
//                           key={activity.eventActivityId}
//                           style={{
//                             background: "white",
//                             borderRadius: "0.5rem",
//                             padding: "1rem",
//                             boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
//                             transition: "transform 0.3s ease",
//                           }}
//                           onMouseEnter={(e) =>
//                             (e.currentTarget.style.transform = "translateY(-5px)")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.currentTarget.style.transform = "translateY(0)")
//                           }
//                         >
//                           <h6
//                             style={{
//                               color: "#000000",
//                               fontWeight: 600,
//                               marginBottom: "0.5rem",
//                             }}
//                           >
//                             {activity.activity.name}
//                           </h6>
//                           <p
//                             style={{
//                               color: "#4a4a4a",
//                               fontSize: "0.9rem",
//                               margin: 0,
//                             }}
//                           >
//                             {activity.activity.description}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {selectedFestival.eventCharacterResponses?.length > 0 && (
//                   <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
//                     <h5
//                       style={{
//                         color: "#000000",
//                         fontWeight: 600,
//                         marginBottom: "1rem",
//                       }}
//                     >
//                       Participating Cosplayers
//                     </h5>
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(3, 1fr)",
//                         gap: "1rem",
//                         maxWidth: "100%",
//                       }}
//                     >
//                       {selectedFestival.eventCharacterResponses.map((cosplayer) => {
//                         const cosplayerData = cosplayerDetails[cosplayer.eventCharacterId];
//                         const avatarImage = cosplayerData?.images?.find(
//                           (img) => img.isAvatar
//                         ) || cosplayerData?.images?.[0];
//                         return (
//                           <div
//                             key={cosplayer.eventCharacterId}
//                             style={{
//                               background: "white",
//                               borderRadius: "0.5rem",
//                               overflow: "hidden",
//                               boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
//                               transition: "transform 0.3s ease",
//                               maxWidth: "100%",
//                             }}
//                             onMouseEnter={(e) =>
//                               (e.currentTarget.style.transform = "translateY(-5px)")
//                             }
//                             onMouseLeave={(e) =>
//                               (e.currentTarget.style.transform = "translateY(0)")
//                             }
//                           >
//                             <div
//                               style={{
//                                 width: "100%",
//                                 height: "200px",
//                                 overflow: "hidden",
//                                 backgroundColor: "#f0f0f0",
//                               }}
//                             >
//                               <img
//                                 src={
//                                   avatarImage?.urlImage ||
//                                   "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg"
//                                 }
//                                 alt={cosplayerData?.name || "Cosplayer"}
//                                 style={{
//                                   width: "100%",
//                                   height: "100%",
//                                   objectFit: "cover",
//                                   transition: "transform 0.3s ease",
//                                 }}
//                                 onMouseEnter={(e) =>
//                                   (e.currentTarget.style.transform = "scale(1.05)")
//                                 }
//                                 onMouseLeave={(e) =>
//                                   (e.currentTarget.style.transform = "scale(1)")
//                                 }
//                                 onError={(e) =>
//                                 (e.currentTarget.src =
//                                   "https://i.pinimg.com/736x/87/e2/85/87e285975715a638cd744653bba51902.jpg")
//                                 }
//                               />
//                             </div>
//                             <div
//                               style={{
//                                 padding: "1rem",
//                                 textAlign: "center",
//                               }}
//                             >
//                               <h6
//                                 style={{
//                                   color: "#000000",
//                                   fontWeight: 600,
//                                   marginBottom: "0.5rem",
//                                 }}
//                               >
//                                 {cosplayerData?.name || "Unknown Cosplayer"}
//                               </h6>
//                               <p
//                                 style={{
//                                   color: "#4a4a4a",
//                                   fontSize: "0.8rem",
//                                   margin: 0,
//                                   marginBottom: "0.75rem",
//                                 }}
//                               >
//                                 {cosplayerData?.description || "Cosplayer"}
//                               </p>
//                               {cosplayerData?.accountId && (
//                                 <Link
//                                   to={`/user-profile/${cosplayerData.accountId}`}
//                                   className="see-profile-button"
//                                   aria-label={`View profile of ${cosplayerData.name || "Cosplayer"}`}
//                                   style={{
//                                     display: "inline-block",
//                                     background: "linear-gradient(135deg, #510545, #22668a)",
//                                     color: "white",
//                                     border: "none",
//                                     borderRadius: "0.5rem",
//                                     padding: "0.3rem 0.6rem",
//                                     fontWeight: 600,
//                                     fontSize: "0.8rem",
//                                     textTransform: "uppercase",
//                                     textDecoration: "none",
//                                     transition: "all 0.3s ease",
//                                     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//                                   }}
//                                   onMouseEnter={(e) =>
//                                   (e.currentTarget.style.background =
//                                     "linear-gradient(135deg, #22668a, #510545)")
//                                   }
//                                   onMouseLeave={(e) =>
//                                   (e.currentTarget.style.background =
//                                     "linear-gradient(135deg, #510545, #22668a)")
//                                   }
//                                 >
//                                   See Profile
//                                 </Link>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}

//                 <div className="fest-ticket-section mt-4">
//                   <h5>Purchase Tickets</h5>
//                   <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
//                     <h6
//                       style={{
//                         color: "#000000",
//                         fontWeight: 600,
//                         marginBottom: "1rem",
//                       }}
//                     >
//                       Select Ticket Type
//                     </h6>
//                     <div
//                       style={{
//                         display: "grid",
//                         gridTemplateColumns: "repeat(2, 1fr)",
//                         gap: "1rem",
//                         maxWidth: "100%",
//                       }}
//                     >
//                       {selectedFestival.ticket.map((ticket) => (
//                         <div
//                           key={ticket.ticketId}
//                           style={{
//                             background:
//                               selectedTicketType?.ticketId === ticket.ticketId
//                                 ? "linear-gradient(135deg, #f8e6f2, #e6f0fa)"
//                                 : "white",
//                             borderRadius: "0.5rem",
//                             padding: "1rem",
//                             boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
//                             transition: "transform 0.3s ease, background 0.3s ease",
//                             cursor: ticket.ticketStatus === 0 ? "pointer" : "not-allowed",
//                             border:
//                               selectedTicketType?.ticketId === ticket.ticketId
//                                 ? "2px solid #510545"
//                                 : "2px solid transparent",
//                             opacity: ticket.ticketStatus === 1 ? 0.6 : 1,
//                           }}
//                           onClick={() => ticket.ticketStatus === 0 && handleTicketTypeSelect(ticket)}
//                         >
//                           <h6
//                             style={{
//                               color: "#510545",
//                               fontWeight: 600,
//                               marginBottom: "0.5rem",
//                               textTransform: "uppercase",
//                             }}
//                           >
//                             {ticket.ticketType === 0 ? "Normal" : "Premium"} -{" "}
//                             {formatPrice(ticket.price)}
//                           </h6>
//                           <p
//                             style={{
//                               color: "#4a4a4a",
//                               fontSize: "0.9rem",
//                               marginBottom: "0.5rem",
//                               fontStyle: "italic",
//                             }}
//                           >
//                             {ticket.description}
//                           </p>
//                           <p
//                             style={{
//                               color: "#22668a",
//                               fontSize: "0.8rem",
//                               margin: 0,
//                               fontWeight: 500,
//                             }}
//                           >
//                             Available: {ticket.quantity}
//                           </p>
//                           {ticket.ticketStatus === 1 && (
//                             <p
//                               style={{
//                                 color: "red",
//                                 fontSize: "0.8rem",
//                                 marginTop: "0.5rem",
//                                 fontWeight: 500,
//                               }}
//                             >
//                               This ticket is not available for purchase
//                             </p>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {selectedTicketType && (
//                     <div className="fest-ticket-quantity mb-3">
//                       <Form.Label style={{ color: "#510545", fontWeight: 600 }}>
//                         Quantity
//                       </Form.Label>
//                       <div className="d-flex align-items-center">
//                         <Button
//                           variant="outline-secondary"
//                           onClick={handleDecrease}
//                           disabled={ticketQuantity === 1 || selectedTicketType.ticketStatus === 1}
//                         >
//                           -
//                         </Button>
//                         <span className="mx-3" style={{ color: "#4a4a4a", fontSize: "1.2rem" }}>
//                           {ticketQuantity}
//                         </span>
//                         <Button
//                           variant="outline-secondary"
//                           onClick={handleIncrease}
//                           disabled={
//                             !selectedTicketType ||
//                             selectedTicketType.quantity === 0 ||
//                             ticketQuantity >= selectedTicketType.quantity ||
//                             selectedTicketType.ticketStatus === 1
//                           }
//                         >
//                           +
//                         </Button>
//                       </div>
//                     </div>
//                   )}

//                   <Button
//                     variant="primary"
//                     className="fest-buy-ticket-btn"
//                     onClick={handleBuyNow}
//                     disabled={
//                       !selectedTicketType ||
//                       selectedTicketType.quantity === 0 ||
//                       selectedTicketType.ticketStatus === 1
//                     }
//                     style={{
//                       background:
//                         !selectedTicketType ||
//                           selectedTicketType.quantity === 0 ||
//                           selectedTicketType.ticketStatus === 1
//                           ? "#6c757d"
//                           : "linear-gradient(135deg, #510545, #22668a)",
//                       border: "none",
//                     }}
//                   >
//                     Buy Now -{" "}
//                     {formatPrice(selectedTicketType?.price * ticketQuantity || 0)}
//                   </Button>
//                   {selectedTicketType?.ticketStatus === 1 && (
//                     <p
//                       style={{
//                         color: "red",
//                         fontSize: "0.9rem",
//                         marginTop: "0.5rem",
//                         fontWeight: 500,
//                       }}
//                     >
//                       This event has stopped selling tickets
//                     </p>
//                   )}
//                 </div>

//                 {showPurchaseForm && (
//                   <div className="fest-purchase-form mt-4">
//                     <h5>Select Payment Method</h5>
//                     <Form>
//                       <Form.Check
//                         type="radio"
//                         label="MoMo"
//                         name="paymentMethod"
//                         onChange={() => setPaymentMethod("Momo")}
//                         className="mb-2"
//                         style={{ color: "#4a4a4a" }}
//                       />
//                       <Form.Check
//                         type="radio"
//                         label="VNPay"
//                         name="paymentMethod"
//                         onChange={() => setPaymentMethod("VNPay")}
//                         className="mb-2"
//                         style={{ color: "#4a4a4a" }}
//                       />
//                       <Button
//                         variant="primary"
//                         onClick={handleConfirmPurchase}
//                         className="mt-3"
//                         style={{
//                           background: "linear-gradient(135deg, #510545, #22668a)",
//                           border: "none",
//                         }}
//                       >
//                         Confirm Purchase
//                       </Button>
//                     </Form>
//                   </div>
//                 )}

//                 {showConfirmModal && (
//                   <div className="fest-purchase-form mt-4">
//                     <h5>Confirm Payment</h5>
//                     <p>
//                       Are you sure you want to pay{" "}
//                       {formatPrice(selectedTicketType?.price * ticketQuantity)}{" "}
//                       for {ticketQuantity} ticket(s) with {paymentMethod}?
//                     </p>
//                     <Button
//                       variant="success"
//                       onClick={handleFinalConfirm}
//                       className="me-2"
//                       style={{
//                         background: "linear-gradient(135deg, #28a745, #218838)",
//                         border: "none",
//                       }}
//                     >
//                       Yes
//                     </Button>
//                     <Button
//                       variant="secondary"
//                       onClick={handleBackToPayment}
//                       className="me-2"
//                       style={{
//                         background: "linear-gradient(135deg, #6b7280, #4a4a4a)",
//                         border: "none",
//                       }}
//                     >
//                       No
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default FestivalsPage;

//------------------------------------------------------------------------------------------------//

//sửa vào 31/05/2025

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Modal, Button, Form, Carousel, Dropdown } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../styles/FestivalsPage.scss";
import FestivalService from "../../services/FestivalService/FestivalService";
import PaymentService from "../../services/PaymentService/PaymentService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { Pagination } from "antd";
import dayjs from "dayjs";

// Danh sách trạng thái lễ hội với tên hiển thị
const STATUS_OPTIONS = [
  { value: -1, label: "All" }, // Đổi từ "All Status" thành "All"
  { value: 0, label: "On Ready" },
  { value: 1, label: "Inactive" }, // Đổi từ "Stopped Selling" thành "On Ready"
  { value: 2, label: "Ongoing" },
  { value: 3, label: "Ended" },
];

const FestivalsPage = () => {
  // State quản lý từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  // State quản lý modal chi tiết lễ hội
  const [showFestivalModal, setShowFestivalModal] = useState(false);
  // State lưu lễ hội đang được chọn
  const [selectedFestival, setSelectedFestival] = useState(null);
  // State quản lý số lượng vé
  const [ticketQuantity, setTicketQuantity] = useState(1);
  // State lưu loại vé được chọn
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  // State quản lý form mua vé
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  // State quản lý modal xác nhận thanh toán
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // State lưu danh sách lễ hội
  const [festivals, setFestivals] = useState([]);
  // State quản lý trạng thái tải dữ liệu
  const [loading, setLoading] = useState(true);
  // State lưu lỗi nếu có
  const [error, setError] = useState(null);
  // State lưu phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState(null);
  // State lưu thông tin chi tiết cosplayer
  const [cosplayerDetails, setCosplayerDetails] = useState({});
  // State lưu ID tài khoản người dùng
  const [accountId, setAccountId] = useState(null);
  // State lưu tên tài khoản người dùng
  const [accountName, setAccountName] = useState(null);
  // State quản lý trang hiện tại của phân trang
  const [currentPage, setCurrentPage] = useState(1);
  // State quản lý số lượng lễ hội mỗi trang
  const [pageSize, setPageSize] = useState(8);
  // State quản lý trạng thái lọc (status)
  const [selectedStatus, setSelectedStatus] = useState(0); // Mặc định là status 0 (đang bán vé)

  const navigate = useNavigate();
  const { category } = useParams();
  const selectedCategory = category || "all";

  // Hàm định dạng giá tiền sang định dạng VND
  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Hàm định dạng ngày giờ thành HH:mm DD/MM/YYYY
  const formatDateTimeVN = (dateString) => {
    return dayjs(dateString).format("HH:mm DD/MM/YYYY");
  };

  // Hàm lấy thông tin tài khoản từ token
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

  // Lấy dữ liệu lễ hội và thông tin tài khoản khi component mount
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

  // Lấy thông tin cosplayer khi chọn lễ hội
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

  // Hàm hiển thị modal chi tiết lễ hội
  const handleFestivalShow = (festival) => {
    setSelectedFestival(festival);
    const availableTicket = festival.ticket.find((t) => t.ticketStatus === 0) || festival.ticket[0];
    setSelectedTicketType(availableTicket);
    setTicketQuantity(1);
    setShowFestivalModal(true);
  };

  // Hàm đóng modal chi tiết lễ hội
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

  // Hàm tăng số lượng vé
  const handleIncrease = () => {
    if (selectedTicketType && ticketQuantity < selectedTicketType.quantity && selectedFestival.status === 0) {
      setTicketQuantity((prev) => prev + 1);
    } else {
      toast.error("Quantity exceeds available tickets or event is not available for purchase!");
    }
  };

  // Hàm giảm số lượng vé
  const handleDecrease = () => setTicketQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Hàm chọn loại vé
  const handleTicketTypeSelect = (ticket) => {
    if (selectedFestival.status === 0) {
      setSelectedTicketType(ticket);
      setTicketQuantity(1);
    }
  };

  // Hàm xử lý mua vé ngay
  const handleBuyNow = () => {
    if (!accountId) {
      toast.error("Please log in to proceed with payment!");
      return;
    }
    if (selectedFestival.status !== 0) {
      toast.error(getStatusMessage(selectedFestival.status));
      return;
    }
    setShowPurchaseForm(true);
  };

  // Hàm lấy thông báo trạng thái
  const getStatusMessage = (status) => {
    switch (status) {
      case 1:
        return "This event has stopped selling tickets!";
      case 2:
        return "This event is currently ongoing!";
      case 3:
        return "This event has ended!";
      default:
        return "";
    }
  };

  // Hàm xác nhận mua vé
  const handleConfirmPurchase = () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }
    setShowPurchaseForm(false);
    setShowConfirmModal(true);
  };

  // Hàm xác nhận thanh toán cuối cùng
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

  // Hàm quay lại form thanh toán
  const handleBackToPayment = () => {
    setShowConfirmModal(false);
    setShowPurchaseForm(true);
  };

  // Lọc danh sách lễ hội theo từ khóa tìm kiếm và trạng thái
  const filteredFestivals = festivals
    .filter((festival) =>
      festival.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((festival) =>
      selectedStatus === null ? true : festival.status === selectedStatus
    );

  // Phân trang danh sách lễ hội
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFestivals = filteredFestivals.slice(startIndex, startIndex + pageSize);

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Hàm xử lý thay đổi trạng thái lọc
  const handleStatusChange = (status) => {
    setSelectedStatus(status === -1 ? null : status); // -1 để hiển thị tất cả
    setCurrentPage(1); // Reset về trang đầu khi đổi bộ lọc
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
        <div className="fest-search-sort-container mb-5 d-flex justify-content-between align-items-center">
          <div className="fest-search-bar">
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
          {/* Bộ lọc trạng thái lễ hội dạng Dropdown */}
          <Dropdown>
            <Dropdown.Toggle className="sort-dropdown" id="status-sort-dropdown">
              Filter: {STATUS_OPTIONS.find(opt => opt.value === (selectedStatus ?? -1))?.label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {STATUS_OPTIONS.map(opt => (
                <Dropdown.Item key={opt.value} onClick={() => handleStatusChange(opt.value)}>
                  {opt.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
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
                  <div className="fest-date">
                    <div>Start Date: {formatDateTimeVN(festival.startDate)}</div>
                    <div>End Date: {formatDateTimeVN(festival.endDate)}</div>
                  </div>
                </div>
                <p className="fest-location">{festival.location}</p>
                {/* Hiển thị trạng thái lễ hội */}
                <p
                  className="fest-status"
                  style={{
                    color:
                      festival.status === 0
                        ? "#28a745" // On Ready: Xanh
                        : festival.status === 1
                          ? "#778899" // Inactive: xám
                          : "#dc3545", // Ongoing hoặc Ended: Đỏ
                  }}
                >
                  {festival.status === 0
                    ? "On Ready"
                    : festival.status === 1
                      ? "Inactive"
                      : festival.status === 2
                        ? "Ongoing"
                        : "Ended"}
                </p>
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
                    {formatDateTimeVN(selectedFestival.startDate)} -{" "}
                    {formatDateTimeVN(selectedFestival.endDate)}
                  </div>
                  <div className="fest-info-item">
                    <strong>Location:</strong> {selectedFestival.location}
                  </div>
                  <div className="fest-info-item">
                    <strong>Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          selectedFestival.status === 0
                            ? "#28a745" // Open for Sale: Xanh
                            : selectedFestival.status === 1
                              ? "#ffc107" // On Ready: Vàng
                              : "#dc3545", // Ongoing hoặc Ended: Đỏ
                      }}
                    >
                      {selectedFestival.status === 0
                        ? "Open for Sale"
                        : selectedFestival.status === 1
                          ? "On Ready"
                          : selectedFestival.status === 2
                            ? "Ongoing"
                            : "Ended"}
                    </span>
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
                                  marginBottom: "0.75rem",
                                }}
                              >
                                {cosplayerData?.description || "Cosplayer"}
                              </p>
                              {cosplayerData?.accountId && (
                                <Link
                                  to={`/user-profile/${cosplayerData.accountId}`}
                                  className="see-profile-button"
                                  aria-label={`View profile of ${cosplayerData.name || "Cosplayer"}`}
                                  style={{
                                    display: "inline-block",
                                    background: "linear-gradient(135deg, #510545, #22668a)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "0.5rem",
                                    padding: "0.3rem 0.6rem",
                                    fontWeight: 600,
                                    fontSize: "0.8rem",
                                    textTransform: "uppercase",
                                    textDecoration: "none",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                  }}
                                  onMouseEnter={(e) =>
                                  (e.currentTarget.style.background =
                                    "linear-gradient(135deg, #22668a, #510545)")
                                  }
                                  onMouseLeave={(e) =>
                                  (e.currentTarget.style.background =
                                    "linear-gradient(135deg, #510545, #22668a)")
                                  }
                                >
                                  See Profile
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="fest-ticket-section mt-4">
                  <h5>Purchase Tickets</h5>
                  {/* Hiển thị thông báo trạng thái nếu không phải là 0 */}
                  {selectedFestival.status !== 0 && (
                    <div
                      style={{
                        backgroundColor: "#f8d7da",
                        color: "#721c24",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        marginBottom: "1rem",
                        textAlign: "center",
                        fontWeight: 500,
                      }}
                    >
                      {getStatusMessage(selectedFestival.status)}
                    </div>
                  )}
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
                              selectedTicketType?.ticketId === ticket.ticketId && selectedFestival.status === 0
                                ? "linear-gradient(135deg, #f8e6f2, #e6f0fa)"
                                : "#f0f0f0",
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
                            transition: "transform 0.3s ease, background 0.3s ease",
                            cursor: selectedFestival.status === 0 ? "pointer" : "not-allowed",
                            border:
                              selectedTicketType?.ticketId === ticket.ticketId && selectedFestival.status === 0
                                ? "2px solid #510545"
                                : "2px solid transparent",
                            opacity: selectedFestival.status !== 0 ? 0.6 : 1,
                          }}
                          onClick={() => selectedFestival.status === 0 && handleTicketTypeSelect(ticket)}
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
                          disabled={ticketQuantity === 1 || selectedFestival.status !== 0}
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
                            selectedFestival.status !== 0
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
                      selectedFestival.status !== 0
                    }
                    style={{
                      background:
                        !selectedTicketType ||
                          selectedTicketType.quantity === 0 ||
                          selectedFestival.status !== 0
                          ? "#6c757d"
                          : "linear-gradient(135deg, #510545, #22668a)",
                      border: "none",
                    }}
                  >
                    Buy Now -{" "}
                    {formatPrice(selectedTicketType?.price * ticketQuantity || 0)}
                  </Button>
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