import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import { Pagination, Modal, Input, Button, Tabs, Image, Spin } from "antd";
import { FileText, Calendar, Eye } from "lucide-react";
import { useDebounce } from "use-debounce";
import { jwtDecode } from "jwt-decode";
import RequestCustomerCharacterService from "../../services/MyCustomerCharacterService/MyCustomerCharacterService.js";
import "antd/dist/reset.css";
import "../../styles/MyCustomerCharacter.scss";

const { TabPane } = Tabs;

const MyCustomerCharacter = () => {
  const [requests, setRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [filteredBrowsedRequests, setFilteredBrowsedRequests] = useState([]);
  const [filteredCompletedRequests, setFilteredCompletedRequests] = useState(
    []
  );
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentBrowsedPage, setCurrentBrowsedPage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    customerCharacterId: "",
    name: "",
    description: "",
    categoryId: "",
    createDate: "",
    status: "",
    maxHeight: 0,
    maxWeight: 0,
    minHeight: 0,
    minWeight: 0,
    updateDate: null,
    createBy: "",
    reason: null,
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;

  // Lấy accountId từ token
  const accessToken = localStorage.getItem("accessToken");
  const decoded = jwtDecode(accessToken);
  const accountId = decoded?.Id;

  // Gọi API để lấy danh sách yêu cầu
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data =
          await RequestCustomerCharacterService.getRequestCustomerCharacterByAccountId(
            accountId
          );
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch customer character requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [accountId]);

  // Lọc các requests theo trạng thái và từ khóa tìm kiếm
  useEffect(() => {
    const filteredPending = requests
      .filter((req) => req.status === "Pending")
      .filter(
        (req) =>
          req.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          req.createDate.includes(debouncedSearchTerm)
      );
    setFilteredPendingRequests(filteredPending);
    setCurrentPendingPage(1);

    const filteredBrowsed = requests
      .filter((req) => req.status === "Browsed")
      .filter(
        (req) =>
          req.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          req.createDate.includes(debouncedSearchTerm)
      );
    setFilteredBrowsedRequests(filteredBrowsed);
    setCurrentBrowsedPage(1);

    const filteredCompleted = requests
      .filter((req) => req.status === "Completed")
      .filter(
        (req) =>
          req.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          req.createDate.includes(debouncedSearchTerm)
      );
    setFilteredCompletedRequests(filteredCompleted);
    setCurrentCompletedPage(1);
  }, [debouncedSearchTerm, requests]);

  const paginate = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  const handleViewRequest = (request) => {
    setModalData({
      customerCharacterId: request.customerCharacterId,
      name: request.name,
      description: request.description,
      categoryId: request.categoryId,
      createDate: request.createDate,
      status: request.status,
      maxHeight: request.maxHeight,
      maxWeight: request.maxWeight,
      minHeight: request.minHeight,
      minWeight: request.minWeight,
      updateDate: request.updateDate,
      createBy: request.createBy,
      reason: request.reason,
      images: request.customerCharacterImageResponses || [],
    });
    setIsViewModalVisible(true);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Completed: "success",
    };
    return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
  };

  const currentPendingItems = paginate(
    filteredPendingRequests,
    currentPendingPage,
    itemsPerPage
  );
  const currentBrowsedItems = paginate(
    filteredBrowsedRequests,
    currentBrowsedPage,
    itemsPerPage
  );
  const currentCompletedItems = paginate(
    filteredCompletedRequests,
    currentCompletedPage,
    itemsPerPage
  );

  return (
    <div className="rental-management bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-rental-management">
          <span>My Request Customer Character</span>
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row>
            <Col md={12}>
              <Form.Control
                type="text"
                placeholder="Search by name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </Col>
          </Row>
        </div>

        {loading ? (
          <Spin
            tip="Loading..."
            style={{ display: "block", textAlign: "center" }}
          />
        ) : (
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Pending Requests" key="1">
              {currentPendingItems.length === 0 ? (
                <p className="text-center">No pending requests found.</p>
              ) : (
                <>
                  <Row className="g-4">
                    {currentPendingItems.map((req) => (
                      <Col key={req.customerCharacterId} xs={12}>
                        <Card className="rental-card shadow">
                          <Card.Body>
                            <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                              <div className="flex-grow-1">
                                <div className="d-flex gap-3">
                                  <div className="icon-circle">
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <h3 className="rental-title">{req.name}</h3>
                                    <div className="text-muted small">
                                      <Calendar size={16} /> Create Date:{" "}
                                      {req.createDate}
                                    </div>
                                    {getStatusBadge(req.status)}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2 align-items-center">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view"
                                  onClick={() => handleViewRequest(req)}
                                >
                                  <Eye size={16} /> View
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Pagination
                    current={currentPendingPage}
                    pageSize={itemsPerPage}
                    total={filteredPendingRequests.length}
                    onChange={(page) => setCurrentPendingPage(page)}
                    showSizeChanger={false}
                    style={{ marginTop: "20px", textAlign: "right" }}
                  />
                </>
              )}
            </TabPane>

            <TabPane tab="Browsed Requests" key="2">
              {currentBrowsedItems.length === 0 ? (
                <p className="text-center">No browsed requests found.</p>
              ) : (
                <>
                  <Row className="g-4">
                    {currentBrowsedItems.map((req) => (
                      <Col key={req.customerCharacterId} xs={12}>
                        <Card className="rental-card shadow">
                          <Card.Body>
                            <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                              <div className="flex-grow-1">
                                <div className="d-flex gap-3">
                                  <div className="icon-circle">
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <h3 className="rental-title">{req.name}</h3>
                                    <div className="text-muted small">
                                      <Calendar size={16} /> Create Date:{" "}
                                      {req.createDate}
                                    </div>
                                    {getStatusBadge(req.status)}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2 align-items-center">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view"
                                  onClick={() => handleViewRequest(req)}
                                >
                                  <Eye size={16} /> View
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Pagination
                    current={currentBrowsedPage}
                    pageSize={itemsPerPage}
                    total={filteredBrowsedRequests.length}
                    onChange={(page) => setCurrentBrowsedPage(page)}
                    showSizeChanger={false}
                    style={{ marginTop: "20px", textAlign: "right" }}
                  />
                </>
              )}
            </TabPane>

            <TabPane tab="Completed Requests" key="3">
              {currentCompletedItems.length === 0 ? (
                <p className="text-center">No completed requests found.</p>
              ) : (
                <>
                  <Row className="g-4">
                    {currentCompletedItems.map((req) => (
                      <Col key={req.customerCharacterId} xs={12}>
                        <Card className="rental-card shadow">
                          <Card.Body>
                            <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                              <div className="flex-grow-1">
                                <div className="d-flex gap-3">
                                  <div className="icon-circle">
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <h3 className="rental-title">{req.name}</h3>
                                    <div className="text-muted small">
                                      <Calendar size={16} /> Create Date:{" "}
                                      {req.createDate}
                                    </div>
                                    {getStatusBadge(req.status)}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2 align-items-center">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view"
                                  onClick={() => handleViewRequest(req)}
                                >
                                  <Eye size={16} /> View
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Pagination
                    current={currentCompletedPage}
                    pageSize={itemsPerPage}
                    total={filteredCompletedRequests.length}
                    onChange={(page) => setCurrentCompletedPage(page)}
                    showSizeChanger={false}
                    style={{ marginTop: "20px", textAlign: "right" }}
                  />
                </>
              )}
            </TabPane>
          </Tabs>
        )}

        {/* Modal xem chi tiết */}
        <Modal
          title="View Customer Character Request"
          open={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsViewModalVisible(false)}>
              Close
            </Button>,
          ]}
          width={600}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Customer Character ID</Form.Label>
              <Input value={modalData.customerCharacterId} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Input value={modalData.name} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Input.TextArea value={modalData.description} disabled rows={3} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category ID</Form.Label>
              <Input value={modalData.categoryId} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Height (cm)</Form.Label>
              <Input value={modalData.maxHeight} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Max Weight (kg)</Form.Label>
              <Input value={modalData.maxWeight} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Min Height (cm)</Form.Label>
              <Input value={modalData.minHeight} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Min Weight (kg)</Form.Label>
              <Input value={modalData.minWeight} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Create Date</Form.Label>
              <Input value={modalData.createDate} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Update Date</Form.Label>
              <Input value={modalData.updateDate || "N/A"} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Created By (Account ID)</Form.Label>
              <Input value={modalData.createBy} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Input value={modalData.status} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reason</Form.Label>
              <Input value={modalData.reason || "N/A"} disabled />
            </Form.Group>
            <h5>Images</h5>
            {modalData.images.length === 0 ? (
              <p>No images available.</p>
            ) : (
              modalData.images.map((img) => (
                <div key={img.customerCharacterImageId} className="mb-3">
                  <Image
                    src={img.urlImage}
                    alt="Character Image"
                    width={100}
                    preview
                    style={{ display: "block", marginBottom: "10px" }}
                  />
                  <p>Create Date: {img.createDate}</p>
                </div>
              ))
            )}
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default MyCustomerCharacter;
