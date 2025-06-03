// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Badge, Dropdown } from "react-bootstrap";
// import { Pagination, Tabs, Spin } from "antd";
// import { FileText, DollarSign, Ticket, ShoppingBag, Calendar, CreditCard } from "lucide-react";
// import "../../styles/PurchaseHistory.scss";
// import PurchaseHistoryService from "../../services/PurchaseHistoryService/PurchaseHistoryService";
// import { jwtDecode } from "jwt-decode";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import { CheckCircle, Clock, Package, Truck } from "lucide-react";

// const { TabPane } = Tabs;

// const PurchaseHistory = () => {
//   const [festivalTickets, setFestivalTickets] = useState([]);
//   const [purchasedOrders, setPurchasedOrders] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [currentTicketsPage, setCurrentTicketsPage] = useState(1);
//   const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
//   const [currentTransactionsPage, setCurrentTransactionsPage] = useState(1);
//   const [ticketPageSize, setTicketPageSize] = useState(5);
//   const [orderPageSize, setOrderPageSize] = useState(5);
//   const [transactionPageSize, setTransactionPageSize] = useState(5);
//   const [loading, setLoading] = useState(false);
//   const [accountId, setAccountId] = useState(null);
//   const [ticketSortOrder, setTicketSortOrder] = useState("newest");
//   const [orderSortOrder, setOrderSortOrder] = useState("newest");
//   const [transactionSortOrder, setTransactionSortOrder] = useState("newest");
//   const [deliveryFees, setDeliveryFees] = useState({}); // Store delivery fees by orderId

//   // Get accountId from token
//   const getAccountInfoFromToken = () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         return decoded?.Id;
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   // Format date to DD-MM-YYYY
//   const formatDate = (dateString) => {
//     let date;
//     if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
//       const [day, month, year] = dateString.split("-");
//       date = new Date(`${year}-${month}-${day}`);
//     } else {
//       date = new Date(dateString);
//     }
//     if (isNaN(date.getTime())) {
//       return "Invalid Date";
//     }
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   // Format price to VND
//   const formatPrice = (price) => {
//     return `${price?.toLocaleString("vi-VN") || 0} VND`;
//   };

//   // Calculate subtotal from orderProducts
//   const calculateSubtotal = (orderProducts) => {
//     return orderProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
//   };

//   // Get ship status
//   const getShipStatus = (status) => {
//     switch (status) {
//       case 0: return "Waiting for Confirmation";
//       case 1: return "Waiting to Pick";
//       case 2: return "In Transit";
//       case 3: return "Received";
//       default: return "Unknown";
//     }
//   };

//   // Get progress percentage for delivery
//   const getProgressPercentage = (status) => {
//     switch (status) {
//       case 0: return 0;
//       case 1: return 33;
//       case 2: return 66;
//       case 3: return 100;
//       default: return 0;
//     }
//   };

//   // Get icon for delivery status
//   const getStatusIcon = (status, isActive) => {
//     const style = { color: isActive ? "#510545" : "#999", marginRight: "8px" };
//     switch (status) {
//       case 0: return <Clock size={20} style={style} />;
//       case 1: return <Package size={20} style={style} />;
//       case 2: return <Truck size={20} style={style} />;
//       case 3: return <CheckCircle size={20} style={style} />;
//       default: return null;
//     }
//   };

//   // Get purpose display name
//   const getPurposeDisplay = (purpose) => {
//     switch (purpose) {
//       case "BuyTicket": return "Ticket Purchase";
//       case "ContractDeposit": return "Contract Deposit";
//       case "ContractSettlement": return "Contract Settlement";
//       case "Order": return "Product Order";
//       case "Refund": return "Refund";
//       default: return "Unknown";
//     }
//   };

//   // Fetch purchase history and delivery fees
//   useEffect(() => {
//     const fetchPurchaseHistory = async () => {
//       setLoading(true);
//       const id = getAccountInfoFromToken();
//       if (!id) {
//         console.error("No account ID found. Please log in.");
//         setLoading(false);
//         return;
//       }
//       setAccountId(id);

//       try {
//         const ticketsData = await PurchaseHistoryService.getAllTicketsByAccountId(id);
//         const ordersData = await PurchaseHistoryService.getAllOrdersByAccountId(id);
//         const transactionsData = await PurchaseHistoryService.getAllPaymentsByAccountIdAndPurpose(id, "Order");

//         // Fetch delivery fees for each order
//         const fees = {};
//         for (const order of ordersData) {
//           try {
//             const fee = await PurchaseHistoryService.calculateDeliveryFee(order.orderId);
//             fees[order.orderId] = fee;
//           } catch (error) {
//             console.error(`Failed to fetch delivery fee for order ${order.orderId}:`, error);
//             fees[order.orderId] = 0; // Default to 0 if API fails
//           }
//         }
//         setDeliveryFees(fees);

//         // Sort on frontend
//         setFestivalTickets(
//           [...ticketsData].sort((a, b) =>
//             ticketSortOrder === "newest"
//               ? new Date(b.ticket.event.startDate) - new Date(a.ticket.event.startDate)
//               : new Date(a.ticket.event.startDate) - new Date(b.ticket.event.startDate)
//           )
//         );
//         setPurchasedOrders(
//           [...ordersData].sort((a, b) =>
//             orderSortOrder === "newest"
//               ? new Date(b.orderDate) - new Date(a.orderDate)
//               : new Date(a.orderDate) - new Date(b.orderDate)
//           )
//         );
//         setTransactions(
//           [...transactionsData].sort((a, b) =>
//             transactionSortOrder === "newest"
//               ? new Date(b.creatAt) - new Date(a.creatAt)
//               : new Date(a.creatAt) - new Date(b.creatAt)
//           )
//         );
//       } catch (error) {
//         console.error("Failed to fetch purchase history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPurchaseHistory();
//   }, [ticketSortOrder, orderSortOrder, transactionSortOrder]);

//   // Pagination helper
//   const paginate = (data, page, perPage) => {
//     const start = (page - 1) * perPage;
//     return data.slice(start, start + perPage);
//   };

//   // Get ticket type name
//   const getTicketTypeName = (type) => {
//     return type === 0 ? "Normal" : "Premium";
//   };

//   const currentTickets = paginate(festivalTickets, currentTicketsPage, ticketPageSize);
//   const currentOrders = paginate(purchasedOrders, currentOrdersPage, orderPageSize);
//   const currentTransactions = paginate(transactions, currentTransactionsPage, transactionPageSize);

//   const handleTicketPageChange = (page, pageSize) => {
//     setCurrentTicketsPage(page);
//     setTicketPageSize(pageSize);
//   };

//   const handleOrderPageChange = (page, pageSize) => {
//     setCurrentOrdersPage(page);
//     setOrderPageSize(pageSize);
//   };

//   const handleTransactionPageChange = (page, pageSize) => {
//     setCurrentTransactionsPage(page);
//     setTransactionPageSize(pageSize);
//   };

//   return (
//     <div className="purchase-history bg-light min-vh-100">
//       <Container className="py-5">
//         <h1 className="text-center mb-5 fw-bold title-purchase-history">
//           <span>Purchase History</span>
//         </h1>

//         <Tabs defaultActiveKey="2" type="card">
//           {/* Festival Tickets Tab */}
//           <TabPane tab="Festival Tickets" key="1">
//             <div className="sort-container mb-3">
//               <Dropdown>
//                 <Dropdown.Toggle className="sort-dropdown" id="ticket-sort-dropdown">
//                   Sort: {ticketSortOrder === "newest" ? "Newest to Oldest" : "Oldest to Newest"}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   <Dropdown.Item onClick={() => setTicketSortOrder("newest")}>
//                     Newest to Oldest
//                   </Dropdown.Item>
//                   <Dropdown.Item onClick={() => setTicketSortOrder("oldest")}>
//                     Oldest to Newest
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//             {loading ? (
//               <div className="text-center">
//                 <Spin tip="Loading..." />
//               </div>
//             ) : festivalTickets.length === 0 ? (
//               <p className="text-center">No festival tickets found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentTickets.map((ticket) => (
//                     <Col key={ticket.ticketAccountId} xs={12}>
//                       <Card className="purchase-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column gap-4">
//                             <div className="d-flex gap-3 align-items-center">
//                               <div className="icon-circle">
//                                 <Ticket size={24} />
//                               </div>
//                               <h3 className="purchase-title mb-0">
//                                 Ticket Code: {ticket.ticketCode}
//                               </h3>
//                             </div>
//                             <div className="ticket-details">
//                               <div className="text-muted small">
//                                 <strong>Type:</strong> {getTicketTypeName(ticket.ticket.ticketType)}
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Ticket Description:</strong> {ticket.ticket.description}
//                               </div>
//                               <div className="text-muted small">
//                                 <DollarSign size={16} /> <strong>Total Price:</strong>{" "}
//                                 {formatPrice(ticket.totalPrice)}
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Quantity:</strong> {ticket.quantity}
//                               </div>
//                             </div>
//                             <div className="event-details">
//                               <h5 className="event-title">Event Details</h5>
//                               <div className="text-muted small">
//                                 <strong>Event Name:</strong> {ticket.ticket.event.eventName}
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Description:</strong> {ticket.ticket.event.description}
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Location:</strong> {ticket.ticket.event.location}
//                               </div>
//                               <div className="text-muted small">
//                                 <Calendar size={16} /> <strong>Start Date:</strong>{" "}
//                                 {formatDate(ticket.ticket.event.startDate)}
//                               </div>
//                               <div className="text-muted small">
//                                 <Calendar size={16} /> <strong>End Date:</strong>{" "}
//                                 {formatDate(ticket.ticket.event.endDate)}
//                               </div>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <div className="pagination-container mt-5">
//                   <Pagination
//                     current={currentTicketsPage}
//                     pageSize={ticketPageSize}
//                     total={festivalTickets.length}
//                     onChange={handleTicketPageChange}
//                     showSizeChanger
//                     pageSizeOptions={["4", "8", "12", "16"]}
//                     showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
//                   />
//                 </div>
//               </>
//             )}
//           </TabPane>

//           {/* Purchased Products Tab */}
//           <TabPane tab="Purchased Products" key="2">
//             <div className="sort-container mb-3">
//               <Dropdown>
//                 <Dropdown.Toggle className="sort-dropdown" id="order-sort-dropdown">
//                   Sort: {orderSortOrder === "newest" ? "Newest to Oldest" : "Oldest to Newest"}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   <Dropdown.Item onClick={() => setOrderSortOrder("newest")}>
//                     Newest to Oldest
//                   </Dropdown.Item>
//                   <Dropdown.Item onClick={() => setOrderSortOrder("oldest")}>
//                     Oldest to Newest
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//             {loading ? (
//               <div className="text-center">
//                 <Spin tip="Loading..." />
//               </div>
//             ) : purchasedOrders.length === 0 ? (
//               <p className="text-center">No purchased products found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentOrders.map((order) => {
//                     const subtotal = calculateSubtotal(order.orderProducts);
//                     const deliveryFee = deliveryFees[order.orderId] || 0;
//                     const total = subtotal + deliveryFee;

//                     return (
//                       <Col key={order.orderId} xs={12}>
//                         <Card className="purchase-card shadow">
//                           <Card.Body>
//                             <div className="d-flex flex-column gap-4">
//                               <div className="d-flex gap-3 align-items-center">
//                                 <div className="icon-circle">
//                                   <ShoppingBag size={24} />
//                                 </div>
//                                 <h3 className="purchase-title mb-0">
//                                   Order ID: {'xxxxxxx' + order.orderId.slice(-7)}
//                                 </h3>
//                               </div>
//                               <div className="order-products">
//                                 <h5 className="event-title">Order Items</h5>
//                                 {order.orderProducts.map((product) => (
//                                   <div key={product.orderProductId} className="product-item">
//                                     <div className="d-flex flex-column flex-md-row gap-4 align-items-md-start">
//                                       <div className="image-container">
//                                         {product.product.productImages &&
//                                           product.product.productImages.length > 0 && (
//                                             <div className="image-wrapper">
//                                               <img
//                                                 src={product.product.productImages[0].urlImage}
//                                                 alt={product.product.productName}
//                                                 className="product-image"
//                                               />
//                                               {product.quantity > 1 && (
//                                                 <Badge className="quantity-badge" bg="primary">
//                                                   x{product.quantity}
//                                                 </Badge>
//                                               )}
//                                             </div>
//                                           )}
//                                       </div>
//                                       <div className="product-details flex-grow-1">
//                                         <div className="text-muted small">
//                                           <strong>Product:</strong> {product.product.productName}
//                                         </div>
//                                         <div className="text-muted small">
//                                           <strong>Description:</strong> {product.product.description}
//                                         </div>
//                                         <div className="text-muted small">
//                                           <strong>Unit Price:</strong> {formatPrice(product.price)}
//                                         </div>
//                                         <div className="text-muted small">
//                                           <strong>Quantity:</strong> {product.quantity}
//                                         </div>
//                                         <div className="text-muted small">
//                                           <strong>Subtotal:</strong> {formatPrice(product.price * product.quantity)}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                               <div className="order-summary">
//                                 <h5 className="event-title">Order Summary</h5>
//                                 <div className="text-muted small">
//                                   <strong>Purchase Date:</strong> {formatDate(order.orderDate)}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Shipping Address:</strong> {order.address}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Phone:</strong> {order.phone}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Note:</strong> {order.description || "No note provided"}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Subtotal:</strong> {formatPrice(subtotal)}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Delivery Fee:</strong> {formatPrice(deliveryFee)}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Total:</strong> {formatPrice(total)}
//                                 </div>
//                               </div>
//                               <p
//                                 style={{
//                                   color: 'red',
//                                   fontStyle: 'italic',
//                                   fontSize: '18px'
//                                 }}
//                               >
//                                 * The item will be delivered within 3-5 days from the order date, please check your phone regularly
//                               </p>
//                               <div style={{ margin: "20px 0", padding: "15px", background: "#f5f5f5", borderRadius: "8px" }}>
//                                 <h5 style={{ fontSize: "18px", fontWeight: 600, color: "#510545", marginBottom: "15px" }}>
//                                   Delivery Progress
//                                 </h5>
//                                 <Box sx={{ width: "100%", marginTop: 2 }}>
//                                   <LinearProgress
//                                     variant="determinate"
//                                     value={getProgressPercentage(order.shipStatus)}
//                                     sx={{
//                                       height: 12,
//                                       borderRadius: 5,
//                                       backgroundColor: "#e0e0e0",
//                                       "& .MuiLinearProgress-bar": {
//                                         background: "linear-gradient(135deg, #510545, #22668a)",
//                                       },
//                                     }}
//                                   />
//                                   <div
//                                     style={{
//                                       display: "flex",
//                                       justifyContent: "space-between",
//                                       marginTop: "10px",
//                                       fontSize: "16px",
//                                       color: "#333",
//                                     }}
//                                   >
//                                     {[
//                                       { status: 0, label: "Waiting for Confirmation" },
//                                       { status: 1, label: "Waiting to Pick" },
//                                       { status: 2, label: "In Transit" },
//                                       { status: 3, label: "Received" },
//                                     ].map((step) => (
//                                       <div
//                                         key={step.status}
//                                         style={{
//                                           flex: 1,
//                                           textAlign: "center",
//                                           fontWeight: order.shipStatus >= step.status ? 600 : 400,
//                                           color: order.shipStatus >= step.status ? "#510545" : "#999",
//                                           display: "flex",
//                                           flexDirection: "column",
//                                           alignItems: "center",
//                                           gap: "5px",
//                                         }}
//                                       >
//                                         {getStatusIcon(step.status, order.shipStatus >= step.status)}
//                                         <span>{step.label}</span>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </Box>
//                               </div>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     );
//                   })}
//                 </Row>
//                 <div className="pagination-container mt-5">
//                   <Pagination
//                     current={currentOrdersPage}
//                     pageSize={orderPageSize}
//                     total={purchasedOrders.length}
//                     onChange={handleOrderPageChange}
//                     showSizeChanger
//                     pageSizeOptions={["4", "8", "12", "16"]}
//                     showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
//                   />
//                 </div>
//               </>
//             )}
//           </TabPane>

//           {/* Transaction History Tab */}
//           <TabPane tab="Transaction History" key="3">
//             <div className="sort-container mb-3">
//               <Dropdown>
//                 <Dropdown.Toggle className="sort-dropdown" id="transaction-sort-dropdown">
//                   Sort: {transactionSortOrder === "newest" ? "Newest to Oldest" : "Oldest to Newest"}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   <Dropdown.Item onClick={() => setTransactionSortOrder("newest")}>
//                     Newest to Oldest
//                   </Dropdown.Item>
//                   <Dropdown.Item onClick={() => setTransactionSortOrder("oldest")}>
//                     Oldest to Newest
//                   </Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//             {loading ? (
//               <div className="text-center">
//                 <Spin tip="Loading..." />
//               </div>
//             ) : transactions.length === 0 ? (
//               <p className="text-center">No transactions found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentTransactions.map((transaction) => (
//                     <Col key={transaction.paymentId} xs={12}>
//                       <Card className="purchase-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column gap-4">
//                             <div className="d-flex gap-3 align-items-center">
//                               <div className="icon-circle">
//                                 <CreditCard size={24} />
//                               </div>
//                               <h3 className="purchase-title mb-0">
//                                 Transaction ID: {transaction.transactionId}
//                               </h3>
//                             </div>
//                             <div className="transaction-details">
//                               <div className="text-muted small">
//                                 <strong>Payment Method:</strong> {transaction.type}
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Status:</strong>{" "}
//                                 <Badge
//                                   bg={transaction.status === "Complete" ? "success" : "warning"}
//                                   style={{ fontSize: "12px", padding: "4px 8px" }}
//                                 >
//                                   {transaction.status}
//                                 </Badge>
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Purpose:</strong> {getPurposeDisplay(transaction.purpose)}
//                               </div>
//                               <div className="text-muted small">
//                                 <DollarSign size={16} /> <strong>Amount:</strong>{" "}
//                                 {formatPrice(transaction.amount)}
//                               </div>
//                               <div className="text-muted small">
//                                 <Calendar size={16} /> <strong>Transaction Date:</strong>{" "}
//                                 {formatDate(transaction.creatAt)}
//                               </div>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 <div className="pagination-container mt-5">
//                   <Pagination
//                     current={currentTransactionsPage}
//                     pageSize={transactionPageSize}
//                     total={transactions.length}
//                     onChange={handleTransactionPageChange}
//                     showSizeChanger
//                     pageSizeOptions={["4", "8", "12", "16"]}
//                     showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
//                   />
//                 </div>
//               </>
//             )}
//           </TabPane>
//         </Tabs>
//       </Container>
//     </div>
//   );
// };

// export default PurchaseHistory;

//--------------------------------------------------------------------------------------//

//sửa vào 24/05/2025

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Badge, Dropdown } from "react-bootstrap";
// import { Pagination, Tabs, Spin } from "antd";
// import { FileText, DollarSign, Ticket, ShoppingBag, Calendar, CreditCard, XCircle, RefreshCw } from "lucide-react";
// import "../../styles/PurchaseHistory.scss";
// import PurchaseHistoryService from "../../services/PurchaseHistoryService/PurchaseHistoryService";
// import { jwtDecode } from "jwt-decode";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import { CheckCircle, Clock, Package, Truck } from "lucide-react";

// // Khai báo TabPane từ Tabs của antd
// const { TabPane } = Tabs;

// const PurchaseHistory = () => {
//   // Khởi tạo state cho vé, đơn hàng, giao dịch và phân trang
//   const [festivalTickets, setFestivalTickets] = useState([]);
//   const [purchasedOrders, setPurchasedOrders] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [currentTicketsPage, setCurrentTicketsPage] = useState(1);
//   const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
//   const [currentTransactionsPage, setCurrentTransactionsPage] = useState(1);
//   const [ticketPageSize, setTicketPageSize] = useState(5);
//   const [orderPageSize, setOrderPageSize] = useState(5);
//   const [transactionPageSize, setTransactionPageSize] = useState(5);
//   const [loading, setLoading] = useState(false);
//   const [accountId, setAccountId] = useState(null);
//   const [ticketSortOrder, setTicketSortOrder] = useState("newest");
//   const [orderSortOrder, setOrderSortOrder] = useState("newest");
//   const [transactionSortOrder, setTransactionSortOrder] = useState("newest");
//   const [deliveryFees, setDeliveryFees] = useState({});

//   // Hàm lấy accountId từ token
//   const getAccountInfoFromToken = () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         return decoded?.Id;
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   // Hàm định dạng ngày thành DD/MM/YYYY
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";

//     const regex = /^(\d{2})[-/](\d{2})[-/](\d{4})$/;
//     const match = dateString.match(regex);
//     if (match) {
//       const [_, day, month, year] = match;
//       if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 9999) {
//         return `${day}/${month}/${year}`;
//       }
//       return "Invalid Date";
//     }

//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "Invalid Date";
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   // Hàm định dạng giá thành VND
//   const formatPrice = (price) => {
//     return `${price?.toLocaleString("vi-VN") || 0} VND`;
//   };

//   // Hàm tính tổng phụ từ danh sách sản phẩm trong đơn hàng
//   const calculateSubtotal = (orderProducts) => {
//     return orderProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
//   };

//   // Hàm che Transaction ID, chỉ hiển thị 3 chữ số cuối
//   const maskTransactionId = (id) => {
//     if (!id) return "N/A";
//     const strId = String(id);
//     if (strId.length <= 3) return strId;
//     return "xxxxxxxx" + strId.slice(-3);
//   };

//   // Hàm lấy tên trạng thái giao hàng
//   const getShipStatus = (status) => {
//     switch (status) {
//       case 0: return "Waiting for Confirmation";
//       case 1: return "Waiting to Pick";
//       case 2: return "In Transit";
//       case 3: return "Received";
//       case 4: return "Cancel";
//       case 5: return "Refund";
//       default: return "Unknown";
//     }
//   };

//   // Hàm tính phần trăm tiến độ cho thanh tiến độ duy nhất
//   const getProgressPercentage = (status) => {
//     // Giữ nguyên các phần trăm đã được chỉnh tay
//     switch (status) {
//       case 0: return 0; // Waiting for Confirmation
//       case 1: return 25; // Waiting to Pick
//       case 2: return 41; // In Transit
//       case 3: return 58; // Received
//       case 4: return 75; // Cancel
//       case 5: return 100; // Refund
//       default: return 0; // Unknown
//     }
//   };

//   // Hàm lấy màu cho thanh tiến độ dựa trên trạng thái
//   const getProgressColor = (status) => {
//     switch (status) {
//       case 4: return "#dc3545"; // Cancel: Màu đỏ
//       case 5: return "#fd7e14"; // Refund: Màu cam
//       default: return "linear-gradient(135deg, #510545, #22668a)"; // Các trạng thái khác: Gradient
//     }
//   };

//   // Hàm lấy biểu tượng cho trạng thái
//   const getStatusIcon = (status, isActive) => {
//     const style = {
//       color: isActive
//         ? status === 4
//           ? "#dc3545" // Cancel: Đỏ
//           : status === 5
//             ? "#fd7e14" // Refund: Cam
//             : "#510545" // Các trạng thái khác: Màu mặc định
//         : "#999", // Không hoạt động: Xám
//       marginRight: "8px",
//     };
//     switch (status) {
//       case 0:
//         return <Clock size={20} style={style} />;
//       case 1:
//         return <Package size={20} style={style} />;
//       case 2:
//         return <Truck size={20} style={style} />;
//       case 3:
//         return <CheckCircle size={20} style={style} />;
//       case 4:
//         return <XCircle size={20} style={style} />;
//       case 5:
//         return <RefreshCw size={20} style={style} />;
//       default:
//         return null;
//     }
//   };

//   // Hàm lấy màu cho badge trạng thái
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Waiting for Confirmation":
//         return "warning"; // #ffc107
//       case "Waiting to Pick":
//         return "info"; // #17a2b8
//       case "In Transit":
//         return "primary"; // #007bff
//       case "Received":
//         return "success"; // #28a745
//       case "Cancel":
//         return "danger"; // #dc3545
//       case "Refund":
//         return "warning-orange"; // #fd7e14
//       default:
//         return "secondary";
//     }
//   };

//   // Hàm kiểm tra trạng thái có hoạt động không
//   const isStatusActive = (status, currentStatus) => {
//     if (currentStatus === 3) return status <= 3; // Received: Chỉ 0-3 sáng
//     if (currentStatus === 4) return status <= 4; // Cancel: 0-4 sáng
//     if (currentStatus === 5) return true; // Refund: Tất cả sáng
//     return status <= currentStatus; // 0-2: Chỉ sáng đến trạng thái hiện tại
//   };

//   // Hàm lấy tên hiển thị mục đích giao dịch
//   const getPurposeDisplay = (purpose) => {
//     switch (purpose) {
//       case "BuyTicket":
//         return "Ticket Purchase";
//       case "ContractDeposit":
//         return "Contract Deposit";
//       case "contractSettlement":
//         return "Contract Settlement";
//       case "Order":
//         return "Product Order";
//       case "Refund":
//         return "Refund";
//       default:
//         return "Unknown";
//     }
//   };

//   // Lấy dữ liệu lịch sử mua hàng và phí giao hàng
//   useEffect(() => {
//     const fetchPurchaseHistory = async () => {
//       setLoading(true);
//       const id = getAccountInfoFromToken();
//       if (!id) {
//         console.error("No account ID found. Please log in.");
//         setLoading(false);
//         return;
//       }
//       setAccountId(id);

//       try {
//         const ticketsData = await PurchaseHistoryService.getAllTicketsByAccountId(id);
//         const ordersData = await PurchaseHistoryService.getAllOrdersByAccountId(id);
//         const transactionsData = await PurchaseHistoryService.getAllPaymentsByAccountIdAndPurpose(id, "Order");

//         const fees = {};
//         for (const order of ordersData) {
//           try {
//             const fee = await PurchaseHistoryService.calculateDeliveryFee(order.orderId);
//             fees[order.orderId] = fee;
//           } catch (error) {
//             console.error(`Failed to fetch delivery fee for order ${order.orderId}:`, error);
//             fees[order.orderId] = 0;
//           }
//         }
//         setDeliveryFees(fees);

//         setFestivalTickets(
//           [...ticketsData].sort((a, b) =>
//             ticketSortOrder === "newest"
//               ? new Date(b.ticket.event.startDate) - new Date(a.ticket.event.startDate)
//               : new Date(a.ticket.event.startDate) - new Date(b.ticket.event.startDate)
//           )
//         );
//         setPurchasedOrders(
//           [...ordersData].sort((a, b) =>
//             orderSortOrder === "newest"
//               ? new Date(b.orderDate) - new Date(a.orderDate)
//               : new Date(a.orderDate) - new Date(b.orderDate)
//           )
//         );
//         setTransactions(
//           [...transactionsData].sort((a, b) => {
//             const dateA = a.creatAt.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
//               ? new Date(`${a.creatAt.split(/[-/]/)[2]}-${a.creatAt.split(/[-/]/)[1]}-${a.creatAt.split(/[-/]/)[0]}`)
//               : new Date(a.creatAt);
//             const dateB = b.creatAt.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
//               ? new Date(`${b.creatAt.split(/[-/]/)[2]}-${b.creatAt.split(/[-/]/)[1]}-${b.creatAt.split(/[-/]/)[0]}`)
//               : new Date(b.creatAt);
//             return transactionSortOrder === "newest" ? dateB - dateA : dateA - dateB;
//           })
//         );
//       } catch (error) {
//         console.error("Failed to fetch purchase history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPurchaseHistory();
//   }, [ticketSortOrder, orderSortOrder, transactionSortOrder]);

//   // Hàm phân trang dữ liệu
//   const paginate = (data, page, perPage) => {
//     const start = (page - 1) * perPage;
//     return data.slice(start, start + perPage);
//   };

//   // Hàm lấy tên loại vé
//   const getTicketTypeName = (type) => {
//     return type === 0 ? "Normal" : "Premium";
//   };

//   // Lấy dữ liệu phân trang
//   const currentTickets = paginate(festivalTickets, currentTicketsPage, ticketPageSize);
//   const currentOrders = paginate(purchasedOrders, currentOrdersPage, orderPageSize);
//   const currentTransactions = paginate(transactions, currentTransactionsPage, transactionPageSize);

//   // Xử lý thay đổi trang vé
//   const handleTicketPageChange = (page, pageSize) => {
//     setCurrentTicketsPage(page);
//     setTicketPageSize(pageSize);
//   };

//   // Xử lý thay đổi trang đơn hàng
//   const handleOrderPageChange = (page, pageSize) => {
//     setCurrentOrdersPage(page);
//     setOrderPageSize(pageSize);
//   };

//   // Xử lý thay đổi trang giao dịch
//   const handleTransactionPageChange = (page, pageSize) => {
//     setCurrentTransactionsPage(page);
//     setTransactionPageSize(pageSize);
//   };

//   return (
//     <div className="purchase-history bg-light min-vh-100">
//       <Container className="py-5">
//         {/* Tiêu đề trang */}
//         <h1 className="text-center mb-5 fw-bold title-purchase-history">
//           <span>Purchase History</span>
//         </h1>

//         <Tabs defaultActiveKey="2" type="card">
//           {/* Tab Festival Tickets */}
//           <TabPane tab="Festival Tickets" key="1">
//             {/* Dropdown sắp xếp vé */}
//             <div className="sort-container mb-3">
//               <Dropdown>
//                 <Dropdown.Toggle className="sort-dropdown" id="ticket-sort-dropdown">
//                   Sort: {ticketSortOrder === "newest" ? "Newest to Oldest" : "Oldest to Newest"}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   <Dropdown.Item onClick={() => setTicketSortOrder("newest")}>Newest to Oldest</Dropdown.Item>
//                   <Dropdown.Item onClick={() => setTicketSortOrder("oldest")}>Oldest to Newest</Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//             {loading ? (
//               <div className="text-center">
//                 <Spin tip="Loading..." />
//               </div>
//             ) : festivalTickets.length === 0 ? (
//               <p className="text-center">No festival tickets found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentTickets.map((ticket) => (
//                     <Col key={ticket.ticketAccountId} xs={12}>
//                       <Card className="purchase-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column gap-4">
//                             {/* Thông tin mã vé */}
//                             <div className="d-flex gap-3 align-items-center">
//                               <div className="icon-circle">
//                                 <Ticket size={24} />
//                               </div>
//                               <h3 className="purchase-title mb-0">Ticket Code: {ticket.ticketCode}</h3>
//                             </div>
//                             {/* Chi tiết vé */}
//                             <div className="ticket-details">
//                               <div className="text-muted small">
//                                 <strong>Type:</strong> {getTicketTypeName(ticket.ticket.ticketType)}
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Ticket Description:</strong> {ticket.ticket.description}
//                               </div>
//                               <div className="text-muted small">
//                                 <DollarSign size={16} /> <strong>Total Price:</strong> {formatPrice(ticket.totalPrice)}
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Quantity:</strong> {ticket.quantity}
//                               </div>
//                             </div>
//                             {/* Chi tiết sự kiện */}
//                             <div className="event-details">
//                               <h5 className="event-title">Event Details</h5>
//                               <div className="text-muted small">
//                                 <strong>Event Name:</strong> {ticket.ticket.event.eventName}
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Description:</strong> {ticket.ticket.event.description}
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Location:</strong> {ticket.ticket.event.location}
//                               </div>
//                               <div className="text-muted small">
//                                 <Calendar size={16} /> <strong>Start Date:</strong>{" "}
//                                 {formatDate(ticket.ticket.event.startDate)}
//                               </div>
//                               <div className="text-muted small">
//                                 <Calendar size={16} /> <strong>End Date:</strong>{" "}
//                                 {formatDate(ticket.ticket.event.endDate)}
//                               </div>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 {/* Phân trang vé */}
//                 <div className="pagination-container mt-5">
//                   <Pagination
//                     current={currentTicketsPage}
//                     pageSize={ticketPageSize}
//                     total={festivalTickets.length}
//                     onChange={handleTicketPageChange}
//                     showSizeChanger
//                     pageSizeOptions={["4", "8", "12", "16"]}
//                     showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
//                   />
//                 </div>
//               </>
//             )}
//           </TabPane>

//           {/* Tab Purchased Products */}
//           <TabPane tab="Purchased Products" key="2">
//             {/* Dropdown sắp xếp đơn hàng */}
//             <div className="sort-container mb-3">
//               <Dropdown>
//                 <Dropdown.Toggle className="sort-dropdown" id="order-sort-dropdown">
//                   Sort: {orderSortOrder === "newest" ? "Newest to Oldest" : "Oldest to Newest"}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   <Dropdown.Item onClick={() => setOrderSortOrder("newest")}>Newest to Oldest</Dropdown.Item>
//                   <Dropdown.Item onClick={() => setOrderSortOrder("oldest")}>Oldest to Newest</Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//             {loading ? (
//               <div className="text-center">
//                 <Spin tip="Loading..." />
//               </div>
//             ) : purchasedOrders.length === 0 ? (
//               <p className="text-center">No purchased products found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentOrders.map((order) => {
//                     const subtotal = calculateSubtotal(order.orderProducts);
//                     const deliveryFee = deliveryFees[order.orderId] || 0;
//                     const total = subtotal + deliveryFee;

//                     return (
//                       <Col key={order.orderId} xs={12}>
//                         <Card className="purchase-card shadow">
//                           <Card.Body>
//                             <div className="d-flex flex-column gap-4">
//                               {/* Thông tin mã đơn hàng */}
//                               <div className="d-flex gap-3 align-items-center">
//                                 <div className="icon-circle">
//                                   <ShoppingBag size={24} />
//                                 </div>
//                                 <h3 className="purchase-title mb-0">Order ID: {"xxxxxxx" + order.orderId.slice(-7)}</h3>
//                               </div>
//                               {/* Danh sách sản phẩm */}
//                               <div className="order-products">
//                                 <h5 className="event-title">Order Items</h5>
//                                 {order.orderProducts.map((product) => (
//                                   <div key={product.orderProductId} className="product-item">
//                                     <div className="d-flex flex-column flex-md-row gap-4 align-items-md-start">
//                                       <div className="image-container">
//                                         {product.product.productImages && product.product.productImages.length > 0 && (
//                                           <div className="image-wrapper">
//                                             <img
//                                               src={product.product.productImages[0].urlImage}
//                                               alt={product.product.productName}
//                                               className="product-image"
//                                             />
//                                             {product.quantity > 1 && (
//                                               <Badge className="quantity-badge" bg="primary">
//                                                 x{product.quantity}
//                                               </Badge>
//                                             )}
//                                           </div>
//                                         )}
//                                       </div>
//                                       <div className="product-details flex-grow-1">
//                                         <div className="text-muted small">
//                                           <strong>Product:</strong> {product.product.productName}
//                                         </div>
//                                         <div className="text-muted small">
//                                           <strong>Description:</strong> {product.product.description}
//                                         </div>
//                                         <div className="text-muted small">
//                                           <strong>Unit Price:</strong> {formatPrice(product.price)}
//                                         </div>
//                                         <div className="text-muted small">
//                                           <strong>Quantity:</strong> {product.quantity}
//                                         </div>
//                                         <div className="text-muted small">
//                                           <strong>Subtotal:</strong> {formatPrice(product.price * product.quantity)}
//                                         </div>
//                                       </div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                               {/* Tóm tắt đơn hàng */}
//                               <div className="order-summary">
//                                 <h5 className="event-title">Order Summary</h5>
//                                 <div className="text-muted small">
//                                   <strong>Purchase Date:</strong> {formatDate(order.orderDate)}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Shipping Address:</strong> {order.address}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Phone:</strong> {order.phone}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Note:</strong> {order.description || "No note provided"}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Status:</strong>{" "}
//                                   <Badge bg={getStatusColor(getShipStatus(order.shipStatus))} style={{ fontSize: "12px", padding: "4px 8px" }}>
//                                     {getShipStatus(order.shipStatus)}
//                                   </Badge>
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Subtotal:</strong> {formatPrice(subtotal)}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Delivery Fee:</strong> {formatPrice(deliveryFee)}
//                                 </div>
//                                 <div className="text-muted small">
//                                   <strong>Total:</strong> {formatPrice(total)}
//                                 </div>
//                               </div>
//                               {/* Thông báo giao hàng */}
//                               <p
//                                 style={{
//                                   color: "red",
//                                   fontStyle: "italic",
//                                   fontSize: "18px",
//                                 }}
//                               >
//                                 * The item will be delivered within 3-5 days from the order date, please check your phone regularly
//                               </p>
//                               {/* Phần tiến độ giao hàng */}
//                               <div style={{ margin: "20px 0", padding: "15px", background: "#f5f5f5", borderRadius: "8px" }}>
//                                 <h5 style={{ fontSize: "18px", fontWeight: 600, color: "#510545", marginBottom: "15px" }}>
//                                   Delivery Progress
//                                 </h5>
//                                 <Box sx={{ width: "100%", marginTop: 2 }}>
//                                   {/* Thanh tiến độ duy nhất cho tất cả trạng thái */}
//                                   <LinearProgress
//                                     variant="determinate"
//                                     value={getProgressPercentage(order.shipStatus)}
//                                     sx={{
//                                       height: 12,
//                                       borderRadius: 5,
//                                       backgroundColor: "#e0e0e0",
//                                       "& .MuiLinearProgress-bar": {
//                                         background: getProgressColor(order.shipStatus),
//                                       },
//                                     }}
//                                   />
//                                   {/* Hiển thị các bước trạng thái */}
//                                   <div
//                                     style={{
//                                       display: "flex",
//                                       justifyContent: "space-between",
//                                       marginTop: "10px",
//                                       fontSize: "16px",
//                                       color: "#333",
//                                     }}
//                                   >
//                                     {[
//                                       { status: 0, label: "Waiting for Confirmation" },
//                                       { status: 1, label: "Waiting to Pick" },
//                                       { status: 2, label: "In Transit" },
//                                       { status: 3, label: "Received" },
//                                       { status: 4, label: "Cancel" },
//                                       { status: 5, label: "Refund" },
//                                     ].map((step) => (
//                                       <div
//                                         key={step.status}
//                                         style={{
//                                           flex: 1,
//                                           textAlign: "center",
//                                           fontWeight: isStatusActive(step.status, order.shipStatus) ? 600 : 400,
//                                           color: isStatusActive(step.status, order.shipStatus)
//                                             ? step.status === 4
//                                               ? "#dc3545"
//                                               : step.status === 5
//                                                 ? "#fd7e14"
//                                                 : "#510545"
//                                             : "#999",
//                                           display: "flex",
//                                           flexDirection: "column",
//                                           alignItems: "center",
//                                           gap: "5px",
//                                           cursor: isStatusActive(step.status, order.shipStatus) ? "default" : "not-allowed",
//                                         }}
//                                       >
//                                         {getStatusIcon(step.status, isStatusActive(step.status, order.shipStatus))}
//                                         <span>{step.label}</span>
//                                       </div>
//                                     ))}
//                                   </div>
//                                 </Box>
//                               </div>
//                             </div>
//                           </Card.Body>
//                         </Card>
//                       </Col>
//                     );
//                   })}
//                 </Row>
//                 {/* Phân trang đơn hàng */}
//                 <div className="pagination-container mt-5">
//                   <Pagination
//                     current={currentOrdersPage}
//                     pageSize={orderPageSize}
//                     total={purchasedOrders.length}
//                     onChange={handleOrderPageChange}
//                     showSizeChanger
//                     pageSizeOptions={["4", "8", "12", "16"]}
//                     showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
//                   />
//                 </div>
//               </>
//             )}
//           </TabPane>

//           {/* Tab Transaction History */}
//           <TabPane tab="Transaction History" key="3">
//             {/* Dropdown sắp xếp giao dịch */}
//             <div className="sort-container mb-3">
//               <Dropdown>
//                 <Dropdown.Toggle className="sort-dropdown" id="transaction-sort-dropdown">
//                   Sort: {transactionSortOrder === "newest" ? "Newest to Oldest" : "Oldest to Newest"}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   <Dropdown.Item onClick={() => setTransactionSortOrder("newest")}>Newest to Oldest</Dropdown.Item>
//                   <Dropdown.Item onClick={() => setTransactionSortOrder("oldest")}>Oldest to Newest</Dropdown.Item>
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//             {loading ? (
//               <div className="text-center">
//                 <Spin tip="Loading..." />
//               </div>
//             ) : transactions.length === 0 ? (
//               <p className="text-center">No transactions found.</p>
//             ) : (
//               <>
//                 <Row className="g-4">
//                   {currentTransactions.map((transaction) => (
//                     <Col key={transaction.paymentId} xs={12}>
//                       <Card className="purchase-card shadow">
//                         <Card.Body>
//                           <div className="d-flex flex-column gap-4">
//                             {/* Thông tin mã giao dịch */}
//                             <div className="d-flex gap-3 align-items-center">
//                               <div className="icon-circle">
//                                 <CreditCard size={24} />
//                               </div>
//                               <h3 className="purchase-title mb-0">
//                                 Transaction ID: {maskTransactionId(transaction.transactionId)}
//                               </h3>
//                             </div>
//                             {/* Chi tiết giao dịch */}
//                             <div className="transaction-details">
//                               <div className="text-muted small">
//                                 <strong>Payment Method:</strong> {transaction.type}
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Status:</strong>{" "}
//                                 <Badge
//                                   bg={transaction.status === "Complete" ? "success" : "warning"}
//                                   style={{ fontSize: "12px", padding: "4px 8px" }}
//                                 >
//                                   {transaction.status}
//                                 </Badge>
//                               </div>
//                               <div className="text-muted small">
//                                 <strong>Purpose:</strong> {getPurposeDisplay(transaction.purpose)}
//                               </div>
//                               <div className="text-muted small">
//                                 <DollarSign size={16} /> <strong>Amount:</strong> {formatPrice(transaction.amount)}
//                               </div>
//                               <div className="text-muted small">
//                                 <Calendar size={16} /> <strong>Transaction Date:</strong>{" "}
//                                 {formatDate(transaction.creatAt)}
//                               </div>
//                             </div>
//                           </div>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//                 {/* Phân trang giao dịch */}
//                 <div className="pagination-container mt-5">
//                   <Pagination
//                     current={currentTransactionsPage}
//                     pageSize={transactionPageSize}
//                     total={transactions.length}
//                     onChange={handleTransactionPageChange}
//                     showSizeChanger
//                     pageSizeOptions={["4", "8", "12", "16"]}
//                     showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
//                   />
//                 </div>
//               </>
//             )}
//           </TabPane>
//         </Tabs>
//       </Container>
//     </div>
//   );
// };

// export default PurchaseHistory;

//--------------------------------------------------------------------------------------//

//sửa vào 02/06/2025

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Dropdown } from "react-bootstrap";
import { Pagination, Tabs, Spin } from "antd";
import { FileText, DollarSign, Ticket, ShoppingBag, Calendar, CreditCard, XCircle, RefreshCw } from "lucide-react";
import "../../styles/PurchaseHistory.scss";
import PurchaseHistoryService from "../../services/PurchaseHistoryService/PurchaseHistoryService";
import { jwtDecode } from "jwt-decode";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";

const { TabPane } = Tabs;

const PurchaseHistory = () => {
  const [festivalTickets, setFestivalTickets] = useState([]);
  const [purchasedOrders, setPurchasedOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentTicketsPage, setCurrentTicketsPage] = useState(1);
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const [currentTransactionsPage, setCurrentTransactionsPage] = useState(1);
  const [ticketPageSize, setTicketPageSize] = useState(5);
  const [orderPageSize, setOrderPageSize] = useState(5);
  const [transactionPageSize, setTransactionPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [ticketSortOrder, setTicketSortOrder] = useState("newest");
  const [orderSortOrder, setOrderSortOrder] = useState("newest");
  const [transactionSortOrder, setTransactionSortOrder] = useState("newest");
  const [transactionPurposeFilter, setTransactionPurposeFilter] = useState("All");
  const [deliveryFees, setDeliveryFees] = useState({});

  const getAccountInfoFromToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        return decoded?.Id;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const regex = /^(\d{2})[-/](\d{2})[-/](\d{4})$/;
    const match = dateString.match(regex);
    if (match) {
      const [_, day, month, year] = match;
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 9999) {
        return `${day}/${month}/${year}`;
      }
      return "Invalid Date";
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateString) => {
    if (!dateString) return new Date(0);
    const regex = /^(\d{2})[-/](\d{2})[-/](\d{4})$/;
    const match = dateString.match(regex);
    if (match) {
      const [_, day, month, year] = match;
      return new Date(`${year}-${month}-${day}`);
    }
    return new Date(dateString);
  };

  const formatPrice = (price) => {
    return `${price?.toLocaleString("vi-VN") || 0} VND`;
  };

  const calculateSubtotal = (orderProducts) => {
    return orderProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
  };

  const maskTransactionId = (id) => {
    if (!id) return "N/A";
    const strId = String(id);
    if (strId.length <= 3) return strId;
    return "xxxxxxxx" + strId.slice(-3);
  };

  const getShipStatus = (status) => {
    switch (status) {
      case 0: return "Waiting for Confirmation";
      case 1: return "Waiting to Pick";
      case 2: return "In Transit";
      case 3: return "Received";
      case 4: return "Cancel";
      case 5: return "Refund";
      default: return "Unknown";
    }
  };

  const getProgressPercentage = (status) => {
    switch (status) {
      case 0: return 0;
      case 1: return 25;
      case 2: return 41;
      case 3: return 58;
      case 4: return 75;
      case 5: return 100;
      default: return 0;
    }
  };

  const getProgressColor = (status) => {
    switch (status) {
      case 4: return "#dc3545";
      case 5: return "#fd7e14";
      default: return "linear-gradient(135deg, #510545, #22668a)";
    }
  };

  const getStatusIcon = (status, isActive) => {
    const style = {
      color: isActive
        ? status === 4
          ? "#dc3545"
          : status === 5
            ? "#fd7e14"
            : "#510545"
        : "#999",
      marginRight: "8px",
    };
    switch (status) {
      case 0:
        return <Clock size={20} style={style} />;
      case 1:
        return <Package size={20} style={style} />;
      case 2:
        return <Truck size={20} style={style} />;
      case 3:
        return <CheckCircle size={20} style={style} />;
      case 4:
        return <XCircle size={20} style={style} />;
      case 5:
        return <RefreshCw size={20} style={style} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Waiting for Confirmation":
        return "warning";
      case "Waiting to Pick":
        return "info";
      case "In Transit":
        return "primary";
      case "Received":
        return "success";
      case "Cancel":
        return "danger";
      case "Refund":
        return "warning-orange";
      default:
        return "secondary";
    }
  };

  const isStatusActive = (status, currentStatus) => {
    if (currentStatus === 3) return status <= 3;
    if (currentStatus === 4) return status <= 4;
    if (currentStatus === 5) return true;
    return status <= currentStatus;
  };

  const getPurposeDisplay = (purpose) => {
    switch (purpose) {
      case "BuyTicket":
        return "Ticket Purchase";
      case "ContractDeposit":
        return "Contract Deposit";
      case "contractSettlement":
        return "Contract Settlement";
      case "Order":
        return "Product Order";
      case "Refund":
        return "Refund";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      setLoading(true);
      const id = getAccountInfoFromToken();
      if (!id) {
        console.error("No account ID found. Please log in.");
        setLoading(false);
        return;
      }
      setAccountId(id);

      try {
        const ticketsData = await PurchaseHistoryService.getAllTicketsByAccountId(id);
        const ordersData = await PurchaseHistoryService.getAllOrdersByAccountId(id);
        const purposes = [0, 1, 2, 3, 4];
        let allTransactions = [];
        for (const purpose of purposes) {
          const transactionsData = await PurchaseHistoryService.getAllPaymentsByAccountIdAndPurpose(id, purpose);
          allTransactions = [...allTransactions, ...transactionsData];
        }

        const fees = {};
        for (const order of ordersData) {
          try {
            const fee = await PurchaseHistoryService.calculateDeliveryFee(order.orderId);
            fees[order.orderId] = fee;
          } catch (error) {
            console.error(`Failed to fetch delivery fee for order ${order.orderId}:`, error);
            fees[order.orderId] = 0;
          }
        }
        setDeliveryFees(fees);

        setFestivalTickets(
          [...ticketsData].sort((a, b) => {
            const dateA = parseDate(a.ticket.event.startDate);
            const dateB = parseDate(b.ticket.event.startDate);
            return ticketSortOrder === "newest" ? dateB - dateA : dateA - dateB;
          })
        );
        setPurchasedOrders(
          [...ordersData].sort((a, b) => {
            const dateA = parseDate(a.orderDate);
            const dateB = parseDate(b.orderDate);
            return orderSortOrder === "newest" ? dateB - dateA : dateA - dateB;
          })
        );
        setTransactions(
          [...allTransactions]
            .filter((transaction) =>
              transactionPurposeFilter === "All" || transaction.purpose === transactionPurposeFilter
            )
            .sort((a, b) => {
              const dateA = parseDate(a.creatAt);
              const dateB = parseDate(b.creatAt);
              return transactionSortOrder === "newest" ? dateB - dateA : dateA - dateB;
            })
        );
      } catch (error) {
        console.error("Failed to fetch purchase history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseHistory();
  }, [ticketSortOrder, orderSortOrder, transactionSortOrder, transactionPurposeFilter]);

  const paginate = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  const getTicketTypeName = (type) => {
    return type === 0 ? "Normal" : "Premium";
  };

  const currentTickets = paginate(festivalTickets, currentTicketsPage, ticketPageSize);
  const currentOrders = paginate(purchasedOrders, currentOrdersPage, orderPageSize);
  const currentTransactions = paginate(transactions, currentTransactionsPage, transactionPageSize);

  const handleTicketPageChange = (page, pageSize) => {
    setCurrentTicketsPage(page);
    setTicketPageSize(pageSize);
  };

  const handleOrderPageChange = (page, pageSize) => {
    setCurrentOrdersPage(page);
    setOrderPageSize(pageSize);
  };

  const handleTransactionPageChange = (page, pageSize) => {
    setCurrentTransactionsPage(page);
    setTransactionPageSize(pageSize);
  };

  const handlePurposeFilterChange = (purpose) => {
    setTransactionPurposeFilter(purpose);
    setCurrentTransactionsPage(1);
  };

  return (
    <div className="purchase-history bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-purchase-history">
          <span>Purchase History</span>
        </h1>

        <Tabs defaultActiveKey="2" type="card">
          <TabPane tab="Festival Tickets" key="1">
            <div className="sort-container mb-3">
              <Dropdown>
                <Dropdown.Toggle className="sort-dropdown" id="ticket-sort-dropdown">
                  Sort: {ticketSortOrder === "newest" ? "Newest to Oldest" : "Oldest to Newest"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setTicketSortOrder("newest")}>Newest to Oldest</Dropdown.Item>
                  <Dropdown.Item onClick={() => setTicketSortOrder("oldest")}>Oldest to Newest</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {loading ? (
              <div className="text-center">
                <Spin tip="Loading..." />
              </div>
            ) : festivalTickets.length === 0 ? (
              <p className="text-center">No festival tickets found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentTickets.map((ticket) => (
                    <Col key={ticket.ticketAccountId} xs={12}>
                      <Card className="purchase-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column gap-4">
                            <div className="d-flex gap-3 align-items-center">
                              <div className="icon-circle">
                                <Ticket size={24} />
                              </div>
                              <h3 className="purchase-title mb-0">Ticket Code: {ticket.ticketCode}</h3>
                            </div>
                            <div className="ticket-details">
                              <div className="text-muted small">
                                <strong>Type:</strong> {getTicketTypeName(ticket.ticket.ticketType)}
                              </div>
                              <div className="text-muted small">
                                <strong>Ticket Description:</strong> {ticket.ticket.description}
                              </div>
                              <div className="text-muted small">
                                <DollarSign size={16} /> <strong>Total Price:</strong> {formatPrice(ticket.totalPrice)}
                              </div>
                              <div className="text-muted small">
                                <strong>Quantity:</strong> {ticket.quantity}
                              </div>
                            </div>
                            <div className="event-details">
                              <h5 className="event-title">Event Details</h5>
                              <div className="text-muted small">
                                <strong>Event Name:</strong> {ticket.ticket.event.eventName}
                              </div>
                              <div className="text-muted small">
                                <strong>Description:</strong> {ticket.ticket.event.description}
                              </div>
                              <div className="text-muted small">
                                <strong>Location:</strong> {ticket.ticket.event.location}
                              </div>
                              <div className="text-muted small">
                                <Calendar size={16} /> <strong>Start Date:</strong>{" "}
                                {formatDate(ticket.ticket.event.startDate)}
                              </div>
                              <div className="text-muted small">
                                <Calendar size={16} /> <strong>End Date:</strong>{" "}
                                {formatDate(ticket.ticket.event.endDate)}
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <div className="pagination-container mt-5">
                  <Pagination
                    current={currentTicketsPage}
                    pageSize={ticketPageSize}
                    total={festivalTickets.length}
                    onChange={handleTicketPageChange}
                    showSizeChanger
                    pageSizeOptions={["4", "8", "12", "16"]}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  />
                </div>
              </>
            )}
          </TabPane>

          <TabPane tab="Purchased Products" key="2">
            <div className="sort-container mb-3">
              <Dropdown>
                <Dropdown.Toggle className="sort-dropdown" id="order-sort-dropdown">
                  Sort: {orderSortOrder === "newest" ? "Newest to Oldest" : "Oldest to Newest"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setOrderSortOrder("newest")}>Newest to Oldest</Dropdown.Item>
                  <Dropdown.Item onClick={() => setOrderSortOrder("oldest")}>Oldest to Newest</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {loading ? (
              <div className="text-center">
                <Spin tip="Loading..." />
              </div>
            ) : purchasedOrders.length === 0 ? (
              <p className="text-center">No purchased products found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentOrders.map((order) => {
                    const subtotal = calculateSubtotal(order.orderProducts);
                    const deliveryFee = deliveryFees[order.orderId] || 0;
                    const total = subtotal + deliveryFee;

                    return (
                      <Col key={order.orderId} xs={12}>
                        <Card className="purchase-card shadow">
                          <Card.Body>
                            <div className="d-flex flex-column gap-4">
                              <div className="d-flex gap-3 align-items-center">
                                <div className="icon-circle">
                                  <ShoppingBag size={24} />
                                </div>
                                <h3 className="purchase-title mb-0">Order ID: {"xxxxxxx" + order.orderId.slice(-7)}</h3>
                              </div>
                              <div className="order-products">
                                <h5 className="event-title">Order Items</h5>
                                {order.orderProducts.map((product) => (
                                  <div key={product.orderProductId} className="product-item">
                                    <div className="d-flex flex-column flex-md-row gap-4 align-items-md-start">
                                      <div className="image-container">
                                        {product.product.productImages && product.product.productImages.length > 0 && (
                                          <div className="image-wrapper">
                                            <img
                                              src={product.product.productImages[0].urlImage}
                                              alt={product.product.productName}
                                              className="product-image"
                                            />
                                            {product.quantity > 1 && (
                                              <Badge className="quantity-badge" bg="primary">
                                                x{product.quantity}
                                              </Badge>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      <div className="product-details flex-grow-1">
                                        <div className="text-muted small">
                                          <strong>Product:</strong> {product.product.productName}
                                        </div>
                                        <div className="text-muted small">
                                          <strong>Description:</strong> {product.product.description}
                                        </div>
                                        <div className="text-muted small">
                                          <strong>Unit Price:</strong> {formatPrice(product.price)}
                                        </div>
                                        <div className="text-muted small">
                                          <strong>Quantity:</strong> {product.quantity}
                                        </div>
                                        <div className="text-muted small">
                                          <strong>Subtotal:</strong> {formatPrice(product.price * product.quantity)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="order-summary">
                                <h5 className="event-title">Order Summary</h5>
                                <div className="text-muted small">
                                  <strong>Purchase Date:</strong> {formatDate(order.orderDate)}
                                </div>
                                <div className="text-muted small">
                                  <strong>Shipping Address:</strong> {order.address}
                                </div>
                                <div className="text-muted small">
                                  <strong>Phone:</strong> {order.phone}
                                </div>
                                <div className="text-muted small">
                                  <strong>Note:</strong> {order.description || "No note provided"}
                                </div>
                                <div className="text-muted small">
                                  <strong>Status:</strong>{" "}
                                  <Badge bg={getStatusColor(getShipStatus(order.shipStatus))} style={{ fontSize: "12px", padding: "4px 8px" }}>
                                    {getShipStatus(order.shipStatus)}
                                  </Badge>
                                </div>
                                {(order.shipStatus === 4 || order.shipStatus === 5) && (
                                  <div className="text-muted small reason-highlight">
                                    <strong>Reason:</strong> {order.cancelReason || "No reason provided"}
                                  </div>
                                )}
                                <div className="text-muted small">
                                  <strong>Subtotal:</strong> {formatPrice(subtotal)}
                                </div>
                                <div className="text-muted small">
                                  <strong>Delivery Fee:</strong> {formatPrice(deliveryFee)}
                                </div>
                                <div className="text-muted small">
                                  <strong>Total:</strong> {formatPrice(total)}
                                </div>
                              </div>
                              <p
                                style={{
                                  color: "red",
                                  fontStyle: "italic",
                                  fontSize: "18px",
                                }}
                              >
                                * The item will be delivered within 3-5 days from the order date, please check your phone regularly
                              </p>
                              <div style={{ margin: "20px 0", padding: "15px", background: "#f5f5f5", borderRadius: "8px" }}>
                                <h5 style={{ fontSize: "18px", fontWeight: 600, color: "#510545", marginBottom: "15px" }}>
                                  Delivery Progress
                                </h5>
                                <Box sx={{ width: "100%", marginTop: 2 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={getProgressPercentage(order.shipStatus)}
                                    sx={{
                                      height: 12,
                                      borderRadius: 5,
                                      backgroundColor: "#e0e0e0",
                                      "& .MuiLinearProgress-bar": {
                                        background: getProgressColor(order.shipStatus),
                                      },
                                    }}
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      marginTop: "10px",
                                      fontSize: "16px",
                                      color: "#333",
                                    }}
                                  >
                                    {[
                                      { status: 0, label: "Waiting for Confirmation" },
                                      { status: 1, label: "Waiting to Pick" },
                                      { status: 2, label: "In Transit" },
                                      { status: 3, label: "Received" },
                                      { status: 4, label: "Cancel" },
                                      { status: 5, label: "Refund" },
                                    ].map((step) => (
                                      <div
                                        key={step.status}
                                        style={{
                                          flex: 1,
                                          textAlign: "center",
                                          fontWeight: isStatusActive(step.status, order.shipStatus) ? 600 : 400,
                                          color: isStatusActive(step.status, order.shipStatus)
                                            ? step.status === 4
                                              ? "#dc3545"
                                              : step.status === 5
                                                ? "#fd7e14"
                                                : "#510545"
                                            : "#999",
                                          display: "flex",
                                          flexDirection: "column",
                                          alignItems: "center",
                                          gap: "5px",
                                          cursor: isStatusActive(step.status, order.shipStatus) ? "default" : "not-allowed",
                                        }}
                                      >
                                        {getStatusIcon(step.status, isStatusActive(step.status, order.shipStatus))}
                                        <span>{step.label}</span>
                                      </div>
                                    ))}
                                  </div>
                                </Box>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
                <div className="pagination-container mt-5">
                  <Pagination
                    current={currentOrdersPage}
                    pageSize={orderPageSize}
                    total={purchasedOrders.length}
                    onChange={handleOrderPageChange}
                    showSizeChanger
                    pageSizeOptions={["4", "8", "12", "16"]}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  />
                </div>
              </>
            )}
          </TabPane>

          <TabPane tab="Transaction History" key="3">
            <div className="sort-container mb-3 d-flex gap-3">
              <Dropdown>
                <Dropdown.Toggle className="sort-dropdown" id="transaction-sort-dropdown">
                  Sort: {transactionSortOrder === "newest" ? "Newest to Oldest" : "Oldest to Newest"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setTransactionSortOrder("newest")}>Newest to Oldest</Dropdown.Item>
                  <Dropdown.Item onClick={() => setTransactionSortOrder("oldest")}>Oldest to Newest</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown>
                <Dropdown.Toggle className="sort-dropdown" id="transaction-purpose-dropdown">
                  Filter Purpose: {transactionPurposeFilter === "All" ? "All" : getPurposeDisplay(transactionPurposeFilter)}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handlePurposeFilterChange("All")}>All</Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePurposeFilterChange("BuyTicket")}>Ticket Purchase</Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePurposeFilterChange("ContractDeposit")}>Contract Deposit</Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePurposeFilterChange("contractSettlement")}>Contract Settlement</Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePurposeFilterChange("Order")}>Product Order</Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePurposeFilterChange("Refund")}>Refund</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {loading ? (
              <div className="text-center">
                <Spin tip="Loading..." />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-center">No transactions found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentTransactions.map((transaction) => (
                    <Col key={transaction.paymentId} xs={12}>
                      <Card className="purchase-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column gap-4">
                            <div className="d-flex gap-3 align-items-center">
                              <div className="icon-circle">
                                <CreditCard size={24} />
                              </div>
                              <h3 className="purchase-title mb-0">
                                Transaction ID: {maskTransactionId(transaction.transactionId)}
                              </h3>
                            </div>
                            <div className="transaction-details">
                              <div className="text-muted small">
                                <strong>Payment Method:</strong> {transaction.type}
                              </div>
                              <div className="text-muted small">
                                <strong>Status:</strong>{" "}
                                <Badge
                                  bg={transaction.status === "Complete" ? "success" : "warning"}
                                  style={{ fontSize: "12px", padding: "4px 8px" }}
                                >
                                  {transaction.status}
                                </Badge>
                              </div>
                              <div className="text-muted small">
                                <strong>Purpose:</strong> {getPurposeDisplay(transaction.purpose)}
                              </div>
                              <div className="text-muted small">
                                <DollarSign size={16} /> <strong>Amount:</strong> {formatPrice(transaction.amount)}
                              </div>
                              <div className="text-muted small">
                                <Calendar size={16} /> <strong>Transaction Date:</strong>{" "}
                                {formatDate(transaction.creatAt)}
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <div className="pagination-container mt-5">
                  <Pagination
                    current={currentTransactionsPage}
                    pageSize={transactionPageSize}
                    total={transactions.length}
                    onChange={handleTransactionPageChange}
                    showSizeChanger
                    pageSizeOptions={["4", "8", "12", "16"]}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                  />
                </div>
              </>
            )}
          </TabPane>
        </Tabs>
      </Container>
    </div>
  );
};

export default PurchaseHistory;