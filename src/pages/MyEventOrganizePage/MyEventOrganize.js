import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import { Pagination, Modal, Input, Button, Tabs, Radio, message } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyEventOrganize.scss";
import { FileText, Calendar, Eye, CreditCard } from "lucide-react";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { TextArea } = Input;

const MyEventOrganize = () => {
  const [requests, setRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [filteredActiveContracts, setFilteredActiveContracts] = useState([]);
  const [filteredCompletedContracts, setFilteredCompletedContracts] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentActivePage, setCurrentActivePage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewEditModalVisible, setIsViewEditModalVisible] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    requestId: "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    packageName: "",
    listCharacters: [],
    status: "",
    price: 0,
  });
  const [depositAmount, setDepositAmount] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const itemsPerPage = 5;

  // Mock data cho các yêu cầu tổ chức sự kiện
  const mockRequests = [
    {
      requestId: "R001",
      serviceId: "S003",
      name: "Anime Festival 2025",
      description: "The biggest anime cosplay event of the year",
      startDate: "2025-06-15T10:00:00",
      endDate: "2025-06-15T18:00:00",
      location: "HCMC Convention Center",
      packageName: "Large Package",
      status: "Pending",
      listCharacters: [
        { characterId: "C001", characterName: "Naruto", quantity: 2 },
        { characterId: "C002", characterName: "Sasuke", quantity: 1 },
      ],
      price: 6000000,
    },
    {
      requestId: "R002",
      serviceId: "S003",
      name: "Comic Con Vietnam",
      description: "Comic and cosplay convention",
      startDate: "2025-07-20T09:00:00",
      endDate: "2025-07-21T17:00:00",
      location: "Youth Cultural House",
      packageName: "VIP Package",
      status: "Browsed",
      listCharacters: [
        { characterId: "C003", characterName: "Spider-Man", quantity: 3 },
        { characterId: "C004", characterName: "Iron Man", quantity: 2 },
      ],
      price: 10000000,
    },
    {
      requestId: "R003",
      serviceId: "S003",
      name: "Game Expo 2025",
      description: "Game and cosplay exhibition",
      startDate: "2025-08-01T10:00:00",
      endDate: "2025-08-02T16:00:00",
      location: "SECC District 7",
      packageName: "Medium Package",
      status: "Active",
      listCharacters: [
        { characterId: "C005", characterName: "Master Chief", quantity: 1 },
      ],
      price: 3000000,
    },
    {
      requestId: "R004",
      serviceId: "S003",
      name: "Cosplay Night",
      description: "Horror-themed cosplay night",
      startDate: "2025-10-31T19:00:00",
      endDate: "2025-10-31T23:00:00",
      location: "Cosplay Cafe",
      packageName: "Custom Package",
      status: "Completed",
      listCharacters: [
        { characterId: "C006", characterName: "Dracula", quantity: 1 },
        { characterId: "C007", characterName: "Zombie", quantity: 2 },
      ],
      price: 4500000,
    },
  ];

  // Lọc mock data theo serviceId = "S003" khi khởi tạo
  useEffect(() => {
    setLoading(true);
    const filtered = mockRequests.filter(
      (request) => request.serviceId === "S003"
    );
    setRequests(filtered);
    setLoading(false);
  }, []);

  // Phân loại và lọc dữ liệu theo trạng thái
  useEffect(() => {
    if (requests.length > 0) {
      const filterByStatusAndSearch = (status) =>
        requests
          .filter((request) => request.status === status)
          .filter(
            (request) =>
              request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              dayjs(request.startDate)
                .format("HH:mm DD/MM/YYYY")
                .includes(searchTerm)
          );

      setFilteredPendingRequests(
        filterByStatusAndSearch("Pending").concat(
          filterByStatusAndSearch("Browsed")
        )
      );
      setFilteredActiveContracts(filterByStatusAndSearch("Active"));
      setFilteredCompletedContracts(filterByStatusAndSearch("Completed"));
    }
  }, [searchTerm, requests]);

  // Xử lý phân trang cho từng tab
  const paginateItems = (items, currentPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const currentPendingItems = paginateItems(
    filteredPendingRequests,
    currentPendingPage
  );
  const currentActiveItems = paginateItems(
    filteredActiveContracts,
    currentActivePage
  );
  const currentCompletedItems = paginateItems(
    filteredCompletedContracts,
    currentCompletedPage
  );

  const handlePendingPageChange = (page) => setCurrentPendingPage(page);
  const handleActivePageChange = (page) => setCurrentActivePage(page);
  const handleCompletedPageChange = (page) => setCurrentCompletedPage(page);

  // Xử lý xem và chỉnh sửa tích hợp trong Tab 1
  const handleViewEditRequest = (request) => {
    setModalData({
      requestId: request.requestId,
      name: request.name || "",
      description: request.description || "",
      startDate: request.startDate
        ? dayjs(request.startDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      endDate: request.endDate
        ? dayjs(request.endDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      location: request.location || "",
      packageName: request.packageName || "N/A",
      listCharacters: request.listCharacters || [],
      status: request.status || "N/A",
      price: request.price || 0,
    });
    setIsViewEditModalVisible(true);
  };

  const handleViewEditConfirm = () => {
    if (!modalData.name.trim()) {
      toast.error("Event name cannot be empty!");
      return;
    }
    setRequests((prev) =>
      prev.map((req) =>
        req.requestId === modalData.requestId ? { ...req, ...modalData } : req
      )
    );
    toast.success("Request updated successfully!");
    setIsViewEditModalVisible(false);
  };

  // Xử lý chọn mức deposit
  const handleDepositRequest = (request) => {
    setSelectedRequestId(request.requestId);
    setModalData({
      requestId: request.requestId,
      name: request.name || "N/A",
      description: request.description || "N/A",
      startDate: request.startDate
        ? dayjs(request.startDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      endDate: request.endDate
        ? dayjs(request.endDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      location: request.location || "N/A",
      packageName: request.packageName || "N/A",
      listCharacters: request.listCharacters || [],
      status: request.status || "N/A",
      price: request.price || 0,
    });
    setIsDepositModalVisible(true);
  };

  const handleDepositConfirm = () => {
    if (depositAmount === null) {
      message.warning("Please select a deposit amount.");
      return;
    }
    const depositValue =
      depositAmount === 50 ? modalData.price * 0.5 : modalData.price;
    toast.success(
      `Deposit of ${depositValue.toLocaleString()} VND confirmed! Moving to Payment Deposit Contract tab.`
    );
    setRequests((prev) =>
      prev.map((req) =>
        req.requestId === selectedRequestId ? { ...req, status: "Active" } : req
      )
    );
    setIsDepositModalVisible(false);
    setDepositAmount(null);
    setSelectedRequestId(null);
  };

  // Xử lý thanh toán deposit
  const handlePaymentRequest = (contract) => {
    setSelectedRequestId(contract.requestId);
    setModalData({
      requestId: contract.requestId,
      name: contract.name || "N/A",
      description: contract.description || "N/A",
      startDate: contract.startDate
        ? dayjs(contract.startDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      endDate: contract.endDate
        ? dayjs(contract.endDate).format("HH:mm DD/MM/YYYY")
        : "N/A",
      location: contract.location || "N/A",
      packageName: contract.packageName || "N/A",
      listCharacters: contract.listCharacters || [],
      status: contract.status || "N/A",
      price: contract.price || 0,
    });
    setIsPaymentModalVisible(true);
  };

  const handlePaymentConfirm = () => {
    if (paymentMethod === null) {
      message.warning("Please select a payment method.");
      return;
    }
    toast.success(
      `Payment via ${paymentMethod} completed! Moving to Completed Contract tab.`
    );
    setRequests((prev) =>
      prev.map((req) =>
        req.requestId === selectedRequestId
          ? { ...req, status: "Completed" }
          : req
      )
    );
    setIsPaymentModalVisible(false);
    setPaymentMethod(null);
    setSelectedRequestId(null);
  };

  // Badge trạng thái
  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Active: "warning",
      Completed: "success",
    };
    return (
      <Badge bg={statusColors[status] || "secondary"}>
        {status || "Unknown"}
      </Badge>
    );
  };

  return (
    <div className="my-event-organize bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-my-event">
          <span>My Event Organize</span>
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row className="align-items-center g-3">
            <Col md={12}>
              <Form.Control
                type="text"
                placeholder="Search by name or date (HH:mm DD/MM/YYYY)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </Col>
          </Row>
        </div>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Request Pending and Choose Deposit" key="1">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentPendingItems.length === 0 ? (
              <p className="text-center">No pending requests found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentPendingItems.map((request) => (
                    <Col key={request.requestId} xs={12}>
                      <Card className="event-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="event-title mb-0">
                                      {request.name || "N/A"}
                                    </h3>
                                    {getStatusBadge(request.status)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date:{" "}
                                    {dayjs(request.startDate).format(
                                      "HH:mm DD/MM/YYYY"
                                    ) || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Package: {request.packageName || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Price:{" "}
                                    {(request.price || 0).toLocaleString()} VND
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view-edit"
                                  onClick={() => handleViewEditRequest(request)}
                                >
                                  <Eye size={16} className="me-1" />
                                  {request.status === "Pending"
                                    ? "View/Edit"
                                    : "View"}
                                </Button>
                                {request.status === "Browsed" && (
                                  <Button
                                    size="small"
                                    className="btn-deposit"
                                    onClick={() =>
                                      handleDepositRequest(request)
                                    }
                                  >
                                    <CreditCard size={16} className="me-1" />
                                    Choose Deposit
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Row className="mt-5 align-items-center">
                  <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                    <p className="mb-0">
                      Showing{" "}
                      <strong>
                        {(currentPendingPage - 1) * itemsPerPage + 1}
                      </strong>{" "}
                      to{" "}
                      <strong>
                        {Math.min(
                          currentPendingPage * itemsPerPage,
                          filteredPendingRequests.length
                        )}
                      </strong>{" "}
                      of <strong>{filteredPendingRequests.length}</strong>{" "}
                      results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentPendingPage}
                      pageSize={itemsPerPage}
                      total={filteredPendingRequests.length}
                      onChange={handlePendingPageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>

          <TabPane tab="Payment Deposit Contract" key="2">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentActiveItems.length === 0 ? (
              <p className="text-center">No active contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentActiveItems.map((contract) => (
                    <Col key={contract.requestId} xs={12}>
                      <Card className="event-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="event-title mb-0">
                                      {contract.name || "N/A"}
                                    </h3>
                                    {getStatusBadge("Active")}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date:{" "}
                                    {dayjs(contract.startDate).format(
                                      "HH:mm DD/MM/YYYY"
                                    ) || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Package: {contract.packageName || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Status: Awaiting Payment
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view-edit"
                                  onClick={() =>
                                    handleViewEditRequest(contract)
                                  }
                                >
                                  <Eye size={16} className="me-1" />
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  className="btn-payment"
                                  onClick={() => handlePaymentRequest(contract)}
                                >
                                  <CreditCard size={16} className="me-1" />
                                  Payment Deposit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Row className="mt-5 align-items-center">
                  <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                    <p className="mb-0">
                      Showing{" "}
                      <strong>
                        {(currentActivePage - 1) * itemsPerPage + 1}
                      </strong>{" "}
                      to{" "}
                      <strong>
                        {Math.min(
                          currentActivePage * itemsPerPage,
                          filteredActiveContracts.length
                        )}
                      </strong>{" "}
                      of <strong>{filteredActiveContracts.length}</strong>{" "}
                      results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentActivePage}
                      pageSize={itemsPerPage}
                      total={filteredActiveContracts.length}
                      onChange={handleActivePageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>

          <TabPane tab="Completed Contract" key="3">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentCompletedItems.length === 0 ? (
              <p className="text-center">No completed contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentCompletedItems.map((contract) => (
                    <Col key={contract.requestId} xs={12}>
                      <Card className="event-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="event-title mb-0">
                                      {contract.name || "N/A"}
                                    </h3>
                                    {getStatusBadge(contract.status)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date:{" "}
                                    {dayjs(contract.startDate).format(
                                      "HH:mm DD/MM/YYYY"
                                    ) || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Package: {contract.packageName || "N/A"}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <Button
                                type="primary"
                                size="small"
                                className="btn-view-edit"
                                onClick={() => handleViewEditRequest(contract)}
                              >
                                <Eye size={16} className="me-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Row className="mt-5 align-items-center">
                  <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                    <p className="mb-0">
                      Showing{" "}
                      <strong>
                        {(currentCompletedPage - 1) * itemsPerPage + 1}
                      </strong>{" "}
                      to{" "}
                      <strong>
                        {Math.min(
                          currentCompletedPage * itemsPerPage,
                          filteredCompletedContracts.length
                        )}
                      </strong>{" "}
                      of <strong>{filteredCompletedContracts.length}</strong>{" "}
                      results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentCompletedPage}
                      pageSize={itemsPerPage}
                      total={filteredCompletedContracts.length}
                      onChange={handleCompletedPageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>
        </Tabs>

        {/* Modal tích hợp View/Edit */}
        <Modal
          title={
            modalData.status === "Pending"
              ? "View/Edit Event Request"
              : "View Event Request"
          }
          open={isViewEditModalVisible}
          onOk={
            modalData.status === "Pending"
              ? handleViewEditConfirm
              : () => setIsViewEditModalVisible(false)
          }
          onCancel={() => setIsViewEditModalVisible(false)}
          okText={modalData.status === "Pending" ? "Save" : "Close"}
          cancelText="Cancel"
          cancelButtonProps={{
            style: {
              display: modalData.status === "Pending" ? "inline" : "none",
            },
          }}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Name</strong>
              </Form.Label>
              {modalData.status === "Pending" ? (
                <Input
                  value={modalData.name}
                  onChange={(e) =>
                    setModalData({ ...modalData, name: e.target.value })
                  }
                  placeholder="Enter event name"
                />
              ) : (
                <p>{modalData.name}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Description</strong>
              </Form.Label>
              {modalData.status === "Pending" ? (
                <TextArea
                  value={modalData.description}
                  onChange={(e) =>
                    setModalData({ ...modalData, description: e.target.value })
                  }
                  placeholder="Enter description"
                />
              ) : (
                <p>{modalData.description}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Start Date</strong>
              </Form.Label>
              <p>{modalData.startDate}</p>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>End Date</strong>
              </Form.Label>
              <p>{modalData.endDate}</p>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Location</strong>
              </Form.Label>
              {modalData.status === "Pending" ? (
                <Input
                  value={modalData.location}
                  onChange={(e) =>
                    setModalData({ ...modalData, location: e.target.value })
                  }
                  placeholder="Enter location"
                />
              ) : (
                <p>{modalData.location}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Package</strong>
              </Form.Label>
              <p>{modalData.packageName}</p>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Price</strong>
              </Form.Label>
              <p>{(modalData.price || 0).toLocaleString()} VND</p>
            </Form.Group>
            <h4>List of Characters:</h4>
            {(modalData.listCharacters || []).length > 0 ? (
              <ul>
                {(modalData.listCharacters || []).map((char, index) => (
                  <li key={index}>
                    {char.characterName} - Quantity: {char.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No characters requested.</p>
            )}
          </Form>
        </Modal>

        {/* Modal chọn mức deposit */}
        <Modal
          title="Choose Deposit Amount"
          open={isDepositModalVisible}
          onOk={handleDepositConfirm}
          onCancel={() => {
            setIsDepositModalVisible(false);
            setDepositAmount(null);
          }}
          okText="Accept"
          cancelText="Cancel"
        >
          <p>Total Price: {(modalData.price || 0).toLocaleString()} VND</p>
          <p>Please select a deposit amount:</p>
          <Radio.Group
            onChange={(e) => setDepositAmount(e.target.value)}
            value={depositAmount}
          >
            <Radio value={50}>
              Deposit 50% ({((modalData.price || 0) * 0.5).toLocaleString()}{" "}
              VND)
            </Radio>
            <Radio value={100}>
              Deposit 100% {(modalData.price || 0).toLocaleString()} VND
            </Radio>
          </Radio.Group>
        </Modal>

        {/* Modal thanh toán deposit */}
        <Modal
          title="Payment Deposit"
          open={isPaymentModalVisible}
          onOk={handlePaymentConfirm}
          onCancel={() => {
            setIsPaymentModalVisible(false);
            setPaymentMethod(null);
          }}
          okText="Confirm Payment"
          cancelText="Cancel"
        >
          <p>Total Price: {(modalData.price || 0).toLocaleString()} VND</p>
          <p>Please select a payment method:</p>
          <Radio.Group
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
          >
            <Radio value="MoMo">MoMo</Radio>
            <Radio value="VNPay">VNPay</Radio>
          </Radio.Group>
        </Modal>
      </Container>
    </div>
  );
};

export default MyEventOrganize;
