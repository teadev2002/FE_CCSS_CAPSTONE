import React, { useState, useEffect } from "react";
import { Table, Card, Pagination, Dropdown, Form, Modal, Button, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown, Eye, Edit } from "lucide-react";
import "../../../styles/Manager/ManageOrderProduct.scss";
import ManageOrderProductService from "../../../services/ManageServicePages/ManageOrderProductService/ManageOrderProductService";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const dateTimeFormat = "MM/DD/YYYY HH:mm";

const ManageOrderProduct = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState({
    field: "customerName",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 30];
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryFees, setDeliveryFees] = useState({}); // Store delivery fees by orderId

  // Format price to VND
  const formatPrice = (price) => {
    if (typeof price !== "number" || price == null) return "0 VND";
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Calculate subtotal from orderProducts
  const calculateSubtotal = (productDetails) => {
    return productDetails.reduce((sum, product) => sum + product.price * product.quantity, 0);
  };

  // Get ship status
  const getShipStatus = (status) => {
    switch (status) {
      case 0: return "WaitConfirm";
      case 1: return "WaitToPick";
      case 2: return "InTransit";
      case 3: return "Received";
      default: return "Unknown";
    }
  };

  // Get progress percentage for delivery
  const getProgressPercentage = (status) => {
    switch (status) {
      case "WaitConfirm": return 0;
      case "WaitToPick": return 33;
      case "InTransit": return 66;
      case "Received": return 100;
      default: return 0;
    }
  };

  // Get status color for badge
  const getStatusColor = (status) => {
    switch (status) {
      case "WaitConfirm": return "warning";
      case "WaitToPick": return "info";
      case "InTransit": return "primary";
      case "Received": return "success";
      default: return "secondary";
    }
  };

  // Fetch orders and delivery fees
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const orderData = await ManageOrderProductService.getAllOrders();

        // Fetch delivery fees for each order
        const fees = {};
        for (const order of orderData) {
          try {
            const fee = await ManageOrderProductService.calculateDeliveryFee(order.orderId);
            fees[order.orderId] = fee;
          } catch (error) {
            console.error(`Failed to fetch delivery fee for order ${order.orderId}:`, error.message);
            fees[order.orderId] = 0; // Default to 0 if API fails
          }
        }
        setDeliveryFees(fees);

        // Format order data
        const formattedData = await Promise.all(
          orderData.map(async (order) => {
            let customerName = "Unknown";
            let customerEmail = "Unknown";
            try {
              const account = await ManageOrderProductService.getAccountById(order.accountId);
              customerName = account.name || "Unknown";
              customerEmail = account.email || "Unknown";
            } catch (error) {
              console.error(`Failed to fetch account for ID ${order.accountId}:`, error.message);
            }

            const productDetails = await Promise.all(
              order.orderProducts.map(async (op) => {
                try {
                  const product = await ManageOrderProductService.getProductById(op.productId);
                  return {
                    productId: op.productId,
                    productName: product.productName || "Unknown",
                    price: op.price || product.price || 0,
                    quantity: op.quantity,
                    urlImage: product.productImages?.[0]?.urlImage || "https://via.placeholder.com/100",
                  };
                } catch (error) {
                  console.error(`Failed to fetch product for ID ${op.productId}:`, error.message);
                  return {
                    productId: op.productId,
                    productName: "Unknown",
                    price: op.price || 0,
                    quantity: op.quantity,
                    urlImage: "https://via.placeholder.com/100",
                  };
                }
              })
            );

            const subtotal = calculateSubtotal(productDetails);
            const deliveryFee = fees[order.orderId] || 0;
            const totalPrice = subtotal + deliveryFee;

            return {
              orderId: order.orderId,
              customerName,
              customerEmail,
              productNames: productDetails.map((p) => p.productName).join(", "),
              totalQuantity: productDetails.reduce((sum, p) => sum + p.quantity, 0),
              totalPrice, // Subtotal + Delivery Fee
              description: order.description || "N/A",
              shipStatus: getShipStatus(order.shipStatus),
              orderDate: order.orderDate,
              productDetails,
              subtotal, // Store for modal
              deliveryFee, // Store for modal
            };
          })
        );

        setOrders(formattedData);
      } catch (error) {
        setError(error.message || "Failed to load orders");
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [searchTerm]);

  // Filter and sort orders
  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.customerName.toLowerCase().includes(search.toLowerCase()) ||
          item.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
          item.productNames.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.shipStatus.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      const valueA = String(a[sort.field] || "").toLowerCase();
      const valueB = String(b[sort.field] || "").toLowerCase();
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredOrders = filterAndSortData(orders, searchTerm, sortOrder);
  const totalEntries = filteredOrders.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);

  // Paginate data
  const paginateData = (data, page) => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const paginatedOrders = paginateData(filteredOrders, currentPage);
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} orders`;

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (field) => {
    setSortOrder((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // Show detail modal
  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Close detail modal
  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  // Show confirm modal
  const handleShowConfirmModal = (orderId, shipStatus) => {
    setPendingStatusUpdate({ orderId, shipStatus });
    setShowConfirmModal(true);
  };

  // Close confirm modal
  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setPendingStatusUpdate(null);
  };

  // Update ship status
  const handleUpdateShipStatus = async () => {
    if (!pendingStatusUpdate) return;

    const { orderId, shipStatus } = pendingStatusUpdate;
    const statusText = getShipStatus(shipStatus);

    try {
      await ManageOrderProductService.updateShipStatus(orderId, shipStatus);
      toast.success(`Order status updated to ${statusText}`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId
            ? { ...order, shipStatus: statusText }
            : order
        )
      );
      handleCloseConfirmModal();
    } catch (error) {
      toast.error("Failed to update order status");
      handleCloseConfirmModal();
    }
  };

  const isMobile = window.innerWidth <= 768;

  return (
    <div className="manage-order-product">
      <h2 className="manage-order-product-title">Manage Orders</h2>
      <div className="content-container">
        <Card className="manage-order-product-card">
          <Card.Body>
            <div className="table-header">
              <h3>Order List</h3>
              <div className="search-wrapper">
                <Form.Control
                  type="text"
                  placeholder="Search by Customer Name, Email, Product Names, Description, or Status..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
              <div className="action-placeholder"></div>
            </div>
            {isLoading && (
              <Box sx={{ width: "100%", marginY: 2 }}>
                <LinearProgress />
              </Box>
            )}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("customerName")}>
                          Customer Name
                          {sortOrder.field === "customerName" ? (
                            sortOrder.order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("customerEmail")}>
                          Customer Email
                          {sortOrder.field === "customerEmail" ? (
                            sortOrder.order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("productNames")}>
                          Product Name
                          {sortOrder.field === "productNames" ? (
                            sortOrder.order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("totalQuantity")}>
                          Total Quantity
                          {sortOrder.field === "totalQuantity" ? (
                            sortOrder.order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("description")}>
                          Description
                          {sortOrder.field === "description" ? (
                            sortOrder.order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("totalPrice")}>
                          Total Price
                          {sortOrder.field === "totalPrice" ? (
                            sortOrder.order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("shipStatus")}>
                          Ship Status
                          {sortOrder.field === "shipStatus" ? (
                            sortOrder.order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("orderDate")}>
                          Order Date
                          {sortOrder.field === "orderDate" ? (
                            sortOrder.order === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td className="text-center">{order.customerName}</td>
                        <td className="text-center">{order.customerEmail}</td>
                        <td className="text-center">{order.productNames}</td>
                        <td className="text-center">{order.totalQuantity}</td>
                        <td className="text-center">{order.description}</td>
                        <td className="text-center">
                          <Badge bg="success" className="highlight-field">
                            {formatPrice(order.totalPrice)}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg={getStatusColor(order.shipStatus)} className="highlight-field">
                            {order.shipStatus}
                          </Badge>
                        </td>
                        <td className="text-center">
                          {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="text-center action-column">
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              justifyContent: "center",
                              alignItems: "center",
                              flexWrap: isMobile ? "wrap" : "nowrap",
                            }}
                          >
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleShowDetail(order)}
                              style={{
                                padding: "5px 10px",
                                fontSize: "14px",
                                borderRadius: "4px",
                                background: "linear-gradient(135deg, #510545, #22668a)",
                                border: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")
                              }
                            >
                              <Eye size={16} /> View Details
                            </Button>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="success"
                                size="sm"
                                style={{
                                  padding: "5px 10px",
                                  fontSize: "14px",
                                  borderRadius: "4px",
                                  background: "#28a745",
                                  border: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                                onMouseEnter={(e) => (e.target.style.background = "#218838")}
                                onMouseLeave={(e) => (e.target.style.background = "#28a745")}
                              >
                                <Edit size={16} /> Update Status
                              </Dropdown.Toggle>
                              <Dropdown.Menu
                                style={{
                                  background: "#fff",
                                  borderRadius: "6px",
                                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                  minWidth: "180px",
                                  padding: "5px 0",
                                }}
                              >
                                {[
                                  { status: 0, label: "WaitConfirm", display: "Waiting for Confirmation" },
                                  { status: 1, label: "WaitToPick", display: "Waiting to Pick" },
                                  { status: 2, label: "InTransit", display: "In Transit" },
                                  { status: 3, label: "Received", display: "Received" },
                                ].map((item) => (
                                  <Dropdown.Item
                                    key={item.status}
                                    onClick={() => handleShowConfirmModal(order.orderId, item.status)}
                                    style={{
                                      padding: "8px 12px",
                                      fontSize: "14px",
                                      color: order.shipStatus === item.label ? "#fff" : "#333",
                                      background:
                                        order.shipStatus === item.label
                                          ? "linear-gradient(135deg, #510545, #22668a)"
                                          : "transparent",
                                      cursor: "pointer",
                                      transition: "all 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      if (order.shipStatus !== item.label) {
                                        e.target.style.background = "#e0e0e0";
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (order.shipStatus !== item.label) {
                                        e.target.style.background = "transparent";
                                      }
                                    }}
                                  >
                                    {item.display}
                                  </Dropdown.Item>
                                ))}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="pagination-controls">
                  <div className="pagination-info">
                    <span>{showingText}</span>
                    <div className="rows-per-page">
                      <span>Rows per page: </span>
                      <Dropdown
                        onSelect={(value) => handleRowsPerPageChange(Number(value))}
                        className="d-inline-block"
                      >
                        <Dropdown.Toggle variant="secondary" id="dropdown-rows-per-page">
                          {rowsPerPage}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {rowsPerPageOptions.map((option) => (
                            <Dropdown.Item key={option} eventKey={option}>
                              {option}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages).keys()].map((page) => (
                      <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Order Detail Modal */}
      <Modal
        show={showDetailModal}
        onHide={handleCloseDetail}
        centered
        size="lg"
        className="order-detail-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details - {selectedOrder?.orderId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div className="order-detail-content">
              <Card className="mb-3">
                <Card.Body>
                  <h5>Order Information</h5>
                  <p style={{ margin: "10px 0", fontSize: "17px" }}><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                  <p style={{ margin: "10px 0", fontSize: "17px" }}><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
                  <p style={{ margin: "10px 0", fontSize: "17px" }}><strong>Customer Email:</strong> {selectedOrder.customerEmail}</p>
                  <p style={{ margin: "10px 0", fontSize: "17px" }}><strong>Description:</strong> {selectedOrder.description}</p>
                  <p style={{ margin: "10px 0", fontSize: "17px" }}>
                    <strong>Order Date:</strong>{" "}
                    {new Date(selectedOrder.orderDate).toLocaleDateString("vi-VN")}
                  </p>
                  <div className="order-summary">
                    <p style={{ margin: "10px 0", fontSize: "17px" }}>
                      <strong>Subtotal:</strong> {formatPrice(selectedOrder.subtotal)}
                    </p>
                    <p style={{ margin: "10px 0", fontSize: "17px" }}>
                      <strong>Delivery Fee:</strong> {formatPrice(selectedOrder.deliveryFee)}
                    </p>
                    <p style={{ margin: "10px 0", fontSize: "17px" }}>
                      <strong style={{ fontWeight: 600, color: "#22668a" }}>Total:</strong>{" "}
                      <Badge bg="success" style={{ fontSize: "14px", padding: "6px 12px", borderRadius: "4px" }}>
                        {formatPrice(selectedOrder.totalPrice)}
                      </Badge>
                    </p>
                  </div>
                  <div style={{ margin: "20px 0" }}>
                    <h6 style={{ fontSize: "17px", fontWeight: 600, color: "#510545", marginBottom: "12px" }}>
                      Delivery Progress
                    </h6>
                    <Box sx={{ width: "100%", marginTop: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getProgressPercentage(selectedOrder.shipStatus)}
                        sx={{
                          height: 12,
                          borderRadius: 5,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            background: "linear-gradient(135deg, #510545, #22668a)",
                          },
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "8px",
                          fontSize: "15px",
                          color: "#333",
                        }}
                      >
                        <span style={{ flex: 1, textAlign: "center" }}>Waiting for Confirmation</span>
                        <span style={{ flex: 1, textAlign: "center" }}>Waiting to Pick</span>
                        <span style={{ flex: 1, textAlign: "center" }}>In Transit</span>
                        <span style={{ flex: 1, textAlign: "center" }}>Received</span>
                      </div>
                    </Box>
                  </div>
                  <p style={{ margin: "10px 0", fontSize: "17px" }}>
                    <strong style={{ fontWeight: 600, color: "#22668a" }}>Ship Status:</strong>{" "}
                    <Badge bg={getStatusColor(selectedOrder.shipStatus)} style={{ fontSize: "14px", padding: "6px 12px", borderRadius: "4px" }}>
                      {selectedOrder.shipStatus}
                    </Badge>
                  </p>
                </Card.Body>
              </Card>

              <Card>
                <Card.Body>
                  <h5>Products</h5>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th className="text-center">Image</th>
                        <th className="text-center">Product Name</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-center">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder?.productDetails.map((product, index) => (
                        <tr key={index}>
                          <td className="text-center">
                            <img
                              src={product.urlImage}
                              alt={product.productName}
                              className="product-image"
                            />
                          </td>
                          <td className="text-center">{product.productName}</td>
                          <td className="text-center">{formatPrice(product.price)}</td>
                          <td className="text-center">{product.quantity}</td>
                          <td className="text-center">{formatPrice(product.price * product.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetail}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Status Update Modal */}
      <Modal
        show={showConfirmModal}
        onHide={handleCloseConfirmModal}
        centered
        className="confirm-status-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingStatusUpdate && (
            <p>
              Are you sure you want to update the status to{" "}
              <strong>{getShipStatus(pendingStatusUpdate.shipStatus)}</strong> for Order ID{" "}
              <strong>{pendingStatusUpdate.orderId}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpdateShipStatus}
            style={{
              background: "linear-gradient(135deg, #510545, #22668a)",
              border: "none",
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageOrderProduct;