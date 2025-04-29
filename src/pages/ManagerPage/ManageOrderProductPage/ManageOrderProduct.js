import React, { useState, useEffect } from "react";
import { Table, Card, Pagination, Dropdown, Form, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown, Eye } from "lucide-react";
import "../../../styles/Manager/ManageOrderProduct.scss";
import ManageOrderProductService from "../../../services/ManageServicePages/ManageOrderProductService/ManageOrderProductService";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

// Định dạng ngày giờ
const dateTimeFormat = "MM/DD/YYYY HH:mm";

const ManageOrderProduct = () => {
  // State quản lý danh sách đơn hàng
  const [orders, setOrders] = useState([]);
  // State quản lý tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  // State quản lý sắp xếp
  const [sortOrder, setSortOrder] = useState({
    field: "customerName",
    order: "asc",
  });
  // State quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 30];
  // State quản lý modal chi tiết
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // State quản lý loading và lỗi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm định dạng giá tiền VND
  const formatPrice = (price) => {
    if (typeof price !== "number" || price == null) return "0 VND";
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Hàm chuyển đổi trạng thái đơn hàng từ số sang chuỗi
  const getOrderStatus = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Completed";
      case 2:
        return "Canceled";
      default:
        return "Unknown";
    }
  };

  // Tải danh sách đơn hàng, thông tin khách hàng và sản phẩm từ API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Lấy danh sách đơn hàng
        const orderData = await ManageOrderProductService.getAllOrders();

        // Lấy thông tin khách hàng và sản phẩm cho mỗi đơn hàng
        const formattedData = await Promise.all(
          orderData.map(async (order) => {
            // Lấy thông tin khách hàng
            let customerName = "Unknown";
            let customerEmail = "Unknown";
            try {
              const account = await ManageOrderProductService.getAccountById(order.accountId);
              customerName = account.name || "Unknown";
              customerEmail = account.email || "Unknown";
            } catch (error) {
              console.error(
                `Failed to fetch account for ID ${order.accountId}:`,
                error.message
              );
            }

            // Lấy thông tin sản phẩm
            const productDetails = await Promise.all(
              order.orderProducts.map(async (op) => {
                try {
                  const product = await ManageOrderProductService.getProductById(op.productId);
                  return {
                    productId: op.productId,
                    productName: product.productName || "Unknown",
                    price: op.price || product.price || 0, // Ưu tiên giá từ orderProducts
                    quantity: op.quantity,
                    urlImage:
                      product.productImages?.[0]?.urlImage ||
                      "https://via.placeholder.com/100", // Ảnh placeholder nếu không có
                  };
                } catch (error) {
                  console.error(
                    `Failed to fetch product for ID ${op.productId}:`,
                    error.message
                  );
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

            return {
              orderId: order.orderId,
              customerName,
              customerEmail,
              productNames: productDetails
                .map((p) => p.productName)
                .join(", "), // Danh sách tên sản phẩm
              totalQuantity: productDetails.reduce(
                (sum, p) => sum + p.quantity,
                0
              ), // Tổng số lượng
              totalPrice: order.totalPrice,
              status: getOrderStatus(order.orderStatus),
              orderDate: order.orderDate,
              productDetails, // Lưu chi tiết sản phẩm cho modal
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

  // Hàm lọc và sắp xếp dữ liệu
  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.customerName.toLowerCase().includes(search.toLowerCase()) ||
          item.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
          item.productNames.toLowerCase().includes(search.toLowerCase()) ||
          item.status.toLowerCase().includes(search.toLowerCase())
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

  // Dữ liệu đã lọc và sắp xếp
  const filteredOrders = filterAndSortData(orders, searchTerm, sortOrder);
  const totalEntries = filteredOrders.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);

  // Hàm phân trang
  const paginateData = (data, page) => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const paginatedOrders = paginateData(filteredOrders, currentPage);
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} orders`;

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý sắp xếp
  const handleSort = (field) => {
    setSortOrder((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => setCurrentPage(page);

  // Xử lý thay đổi số dòng mỗi trang
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // Hiển thị modal chi tiết
  const handleShowDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Đóng modal
  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="manage-order-product">
      {/* Tiêu đề trang */}
      <h2 className="manage-order-product-title">Manage Orders</h2>
      <div className="content-container">
        <Card className="manage-order-product-card">
          <Card.Body>
            {/* Tiêu đề bảng và thanh tìm kiếm */}
            <div className="table-header">
              <h3>Order List</h3>
              <div className="search-wrapper">
                <Form.Control
                  type="text"
                  placeholder="Search by Customer Name, Email, Product Names, or Status..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
              <div className="action-placeholder"></div>
            </div>
            {/* Hiển thị loading hoặc lỗi */}
            {isLoading && (
              <Box sx={{ width: "100%", marginY: 2 }}>
                <LinearProgress />
              </Box>
            )}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && (
              <>
                {/* Bảng danh sách đơn hàng */}
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("customerName")}
                        >
                          Customer Name
                          {sortOrder.field === "customerName" ? (
                            sortOrder.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("customerEmail")}
                        >
                          Customer Email
                          {sortOrder.field === "customerEmail" ? (
                            sortOrder.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("productNames")}
                        >
                          Product Names
                          {sortOrder.field === "productNames" ? (
                            sortOrder.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("totalQuantity")}
                        >
                          Total Quantity
                          {sortOrder.field === "totalQuantity" ? (
                            sortOrder.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("totalPrice")}
                        >
                          Total Price
                          {sortOrder.field === "totalPrice" ? (
                            sortOrder.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("status")}
                        >
                          Status
                          {sortOrder.field === "status" ? (
                            sortOrder.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("orderDate")}
                        >
                          Order Date
                          {sortOrder.field === "orderDate" ? (
                            sortOrder.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td className="text-center">{order.customerName}</td>
                        <td className="text-center">{order.customerEmail}</td>
                        <td className="text-center">{order.productNames}</td>
                        <td className="text-center">{order.totalQuantity}</td>
                        <td className="text-center">{formatPrice(order.totalPrice)}</td>
                        <td className="text-center">{order.status}</td>
                        <td className="text-center">
                          {new Date(order.orderDate).toLocaleDateString("en-US")}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleShowDetail(order)}
                          >
                            <Eye size={16} /> View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* Phân trang */}
                <div className="pagination-controls">
                  <div className="pagination-info">
                    <span>{showingText}</span>
                    <div className="rows-per-page">
                      <span>Rows per page: </span>
                      <Dropdown
                        onSelect={(value) => handleRowsPerPageChange(Number(value))}
                        className="d-inline-block"
                      >
                        <Dropdown.Toggle
                          variant="secondary"
                          id="dropdown-rows-per-page"
                        >
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

      {/* Modal chi tiết đơn hàng */}
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
              {/* Thông tin đơn hàng */}
              <Card className="mb-3">
                <Card.Body>
                  <h5>Order Information</h5>
                  <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                  <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Customer Email:</strong> {selectedOrder.customerEmail}</p>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(selectedOrder.orderDate).toLocaleDateString("en-US")}
                  </p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Total Price:</strong> {formatPrice(selectedOrder.totalPrice)}</p>
                </Card.Body>
              </Card>

              {/* Danh sách sản phẩm */}
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
                      {selectedOrder.productDetails.map((product, index) => (
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
    </div>
  );
};

export default ManageOrderProduct;