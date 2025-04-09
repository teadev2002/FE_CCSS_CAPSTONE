import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { Pagination, Tabs, Spin } from "antd";
import { FileText, DollarSign, Ticket, ShoppingBag, Calendar } from "lucide-react";
import "../../styles/PurchaseHistory.scss";
import PurchaseHistoryService from "../../services/PurchaseHistoryService/PurchaseHistoryService";
import { jwtDecode } from "jwt-decode";

const { TabPane } = Tabs;

const PurchaseHistory = () => {
  const [festivalTickets, setFestivalTickets] = useState([]);
  const [purchasedOrders, setPurchasedOrders] = useState([]);
  const [currentTicketsPage, setCurrentTicketsPage] = useState(1);
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState(null);

  const itemsPerPage = 5;

  // Lấy accountId từ token
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

  // Định dạng ngày từ "2025-01-01T00:00:00" thành "01-01-2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Định dạng giá giống SouvenirsPage (vi-VN)
  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Gọi API để lấy lịch sử mua vé và sản phẩm
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
        setFestivalTickets(ticketsData);

        const ordersData = await PurchaseHistoryService.getAllOrdersByAccountId(id);
        setPurchasedOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch purchase history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchaseHistory();
  }, []);

  // Hàm phân trang
  const paginate = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  // Hàm lấy tên loại vé
  const getTicketTypeName = (type) => {
    return type === 0 ? "Normal" : "Premium";
  };

  const currentTickets = paginate(festivalTickets, currentTicketsPage, itemsPerPage);
  const currentOrders = paginate(purchasedOrders, currentOrdersPage, itemsPerPage);

  return (
    <div className="purchase-history bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-purchase-history">
          <span>Purchase History</span>
        </h1>

        <Tabs defaultActiveKey="1" type="card">
          {/* Tab cho vé festival */}
          <TabPane tab="Festival Tickets" key="1">
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
                              <h3 className="purchase-title mb-0">
                                Ticket Code: {ticket.ticketCode}
                              </h3>
                            </div>
                            <div className="ticket-details">
                              <div className="text-muted small">
                                <strong>Type:</strong> {getTicketTypeName(ticket.ticket.ticketType)}
                              </div>
                              <div className="text-muted small">
                                <strong>Ticket Description:</strong> {ticket.ticket.description}
                              </div>
                              <div className="text-muted small">
                                <DollarSign size={16} /> <strong>Total Price:</strong>{" "}
                                {formatPrice(ticket.totalPrice)}
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
                <Pagination
                  current={currentTicketsPage}
                  pageSize={itemsPerPage}
                  total={festivalTickets.length}
                  onChange={(page) => setCurrentTicketsPage(page)}
                  showSizeChanger={false}
                  style={{ marginTop: "20px", textAlign: "right" }}
                />
              </>
            )}
          </TabPane>

          {/* Tab cho sản phẩm đã mua */}
          <TabPane tab="Purchased Products" key="2">
            {loading ? (
              <div className="text-center">
                <Spin tip="Loading..." />
              </div>
            ) : purchasedOrders.length === 0 ? (
              <p className="text-center">No purchased products found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentOrders.map((order) => (
                    <Col key={order.orderId} xs={12}>
                      <Card className="purchase-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column gap-4">
                            <div className="d-flex gap-3 align-items-center">
                              <div className="icon-circle">
                                <ShoppingBag size={24} />
                              </div>
                              <h3 className="purchase-title mb-0">Purchased Products</h3>
                            </div>
                            {order.orderProducts.map((product) => (
                              <div key={product.orderProductId} className="product-item">
                                <div className="d-flex flex-column flex-md-row gap-4 align-items-md-start">
                                  <div className="image-container">
                                    {product.product.productImages &&
                                      product.product.productImages.length > 0 && (
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
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="order-summary">
                              <div className="text-muted small">
                                <DollarSign size={16} /> Total Price:{" "}
                                {formatPrice(order.totalPrice)}
                              </div>
                              <div className="text-muted small">
                                <strong>Purchase Date:</strong> {formatDate(order.orderDate)}
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Pagination
                  current={currentOrdersPage}
                  pageSize={itemsPerPage}
                  total={purchasedOrders.length}
                  onChange={(page) => setCurrentOrdersPage(page)}
                  showSizeChanger={false}
                  style={{ marginTop: "20px", textAlign: "right" }}
                />
              </>
            )}
          </TabPane>
        </Tabs>
      </Container>
    </div>
  );
};

export default PurchaseHistory;