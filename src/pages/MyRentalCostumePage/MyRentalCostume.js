import React, { useState } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import { Pagination, Modal, Input, Button, Tabs, message, Spin } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyRentalCostume.scss";
import { jwtDecode } from "jwt-decode";
import {
  FileText,
  DollarSign,
  Calendar,
  CreditCard,
  Eye,
  Download,
} from "lucide-react";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { TextArea } = Input;

const MyRentalCostume = () => {
  const [requests, setRequests] = useState([
    {
      requestId: "1",
      name: "Costume Party",
      description: "Rent costumes for a party",
      price: 500000,
      startDate: "2025-04-10",
      status: "Pending",
      maxHeight: 190,
      maxWeight: 85,
      minHeight: 170,
      minWeight: 60,
      urlImage: "https://example.com/costume1.jpg",
    },
    {
      requestId: "2",
      name: "Cosplay Event",
      description: "Cosplay outfit for event",
      price: 750000,
      startDate: "2025-04-15",
      status: "Browsed",
      maxHeight: 185,
      maxWeight: 80,
      minHeight: 165,
      minWeight: 55,
      urlImage: "https://example.com/costume2.jpg",
    },
  ]);
  const [contracts, setContracts] = useState([
    {
      contractId: "C1",
      contractName: "Contract for Costume Party",
      price: 500000,
      startDate: "2025-04-10",
      status: "Active",
    },
    {
      contractId: "C2",
      contractName: "Contract for Cosplay Event",
      price: 750000,
      startDate: "2025-04-15",
      status: "Completed",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [currentRequestPage, setCurrentRequestPage] = useState(1);
  const [currentContractPage, setCurrentContractPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    maxHeight: 0,
    maxWeight: 0,
    minHeight: 0,
    minWeight: 0,
    urlImage: "",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [refundData, setRefundData] = useState({
    bankAccount: "",
    bankName: "",
  });

  const itemsPerPage = 5;
  const accessToken = localStorage.getItem("accessToken");
  const decoded = jwtDecode(accessToken);
  const accountId = decoded?.Id;

  const filteredRequests = requests.filter(
    (req) =>
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dayjs(req.startDate).format("DD/MM/YYYY").includes(searchTerm)
  );
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.contractName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dayjs(contract.startDate).format("DD/MM/YYYY").includes(searchTerm)
  );

  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setEditData({
      name: request.name,
      description: request.description,
      maxHeight: request.maxHeight,
      maxWeight: request.maxWeight,
      minHeight: request.minHeight,
      minWeight: request.minWeight,
      urlImage: request.urlImage,
    });
    if (request.status === "Browsed") {
      setIsViewModalVisible(true);
    } else {
      setIsEditModalVisible(true);
    }
  };

  const handleSubmitEdit = () => {
    if (!editData.name.trim() || !editData.description.trim()) {
      toast.error("Name and description cannot be empty!");
      return;
    }
    if (
      editData.maxHeight <= 0 ||
      editData.maxWeight <= 0 ||
      editData.minHeight <= 0 ||
      editData.minWeight <= 0
    ) {
      toast.error("Height and weight must be positive numbers!");
      return;
    }
    setRequests(
      requests.map((req) =>
        req.requestId === selectedRequest.requestId
          ? { ...req, ...editData }
          : req
      )
    );
    toast.success("Request updated successfully!");
    setIsEditModalVisible(false);
  };

  const handlePayment = (request) => {
    setSelectedRequest(request);
    setPaymentAmount(request.price * 0.3);
    setIsPaymentModalVisible(true);
  };

  const handlePaymentConfirm = () => {
    toast.success("Payment successful! Redirecting to payment gateway...");
    const newContract = {
      contractId: `C${contracts.length + 1}`,
      contractName: `Contract for ${selectedRequest.name}`,
      price: selectedRequest.price,
      startDate: selectedRequest.startDate,
      status: "Active",
    };
    setContracts([...contracts, newContract]);
    setIsPaymentModalVisible(false);
  };

  const handleDownloadContract = (contractId) => {
    toast.success(`Downloading contract ${contractId} as PDF...`);
  };

  const handleRefundRequest = (contract) => {
    if (contract.status !== "Completed") {
      toast.warning("Contract must be completed to request a refund!");
      return;
    }
    setSelectedRequest(contract);
    setIsRefundModalVisible(true);
  };

  const handleRefundConfirm = () => {
    if (!refundData.bankAccount.trim() || !refundData.bankName.trim()) {
      toast.error("Bank account and name cannot be empty!");
      return;
    }
    toast.success("Refund request submitted!");
    setIsRefundModalVisible(false);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Cancel: "secondary",
      Active: "warning",
      Completed: "success",
    };
    return <Badge bg={statusColors[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <div className="rental-management bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-rental-management">
          <span>Rental Management</span>
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

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="My Requests" key="1">
            {loading ? (
              <Spin tip="Loading..." />
            ) : filteredRequests.length === 0 ? (
              <p className="text-center">No requests found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {paginate(filteredRequests, currentRequestPage).map((req) => (
                    <Col key={req.requestId} xs={12}>
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
                                    <DollarSign size={16} /> Total Price:{" "}
                                    {req.price.toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small">
                                    <Calendar size={16} /> Start Date:{" "}
                                    {dayjs(req.startDate).format("DD/MM/YYYY")}
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
                                <Eye size={16} />{" "}
                                {req.status === "Pending" ? "Edit" : "View"}
                              </Button>
                              {req.status === "Browsed" && (
                                <Button
                                  size="small"
                                  className="btn-deposit"
                                  onClick={() => handlePayment(req)}
                                >
                                  <CreditCard size={16} /> Pay Deposit
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Pagination
                  current={currentRequestPage}
                  pageSize={itemsPerPage}
                  total={filteredRequests.length}
                  onChange={setCurrentRequestPage}
                  showSizeChanger={false}
                  style={{ marginTop: "20px", textAlign: "right" }}
                />
              </>
            )}
          </TabPane>

          <TabPane tab="My Contracts" key="2">
            {loading ? (
              <Spin tip="Loading..." />
            ) : filteredContracts.length === 0 ? (
              <p className="text-center">No contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {paginate(filteredContracts, currentContractPage).map(
                    (contract) => (
                      <Col key={contract.contractId} xs={12}>
                        <Card className="rental-card shadow">
                          <Card.Body>
                            <div className="d-flex flex-column flex-md-row gap-4 align-items-md-center">
                              <div className="flex-grow-1">
                                <div className="d-flex gap-3">
                                  <div className="icon-circle">
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <h3 className="rental-title">
                                      {contract.contractName}
                                    </h3>
                                    <div className="text-muted small">
                                      <DollarSign size={16} /> Total Price:{" "}
                                      {contract.price.toLocaleString()} VND
                                    </div>
                                    <div className="text-muted small">
                                      <Calendar size={16} /> Start Date:{" "}
                                      {dayjs(contract.startDate).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                    {getStatusBadge(contract.status)}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex gap-2 align-items-center">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view"
                                  onClick={() =>
                                    handleDownloadContract(contract.contractId)
                                  }
                                >
                                  <Download size={16} /> Download PDF
                                </Button>
                                {contract.status === "Completed" && (
                                  <Button
                                    size="small"
                                    className="btn-refund"
                                    onClick={() =>
                                      handleRefundRequest(contract)
                                    }
                                  >
                                    <CreditCard size={16} /> Request Refund
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    )
                  )}
                </Row>
                <Pagination
                  current={currentContractPage}
                  pageSize={itemsPerPage}
                  total={filteredContracts.length}
                  onChange={setCurrentContractPage}
                  showSizeChanger={false}
                  style={{ marginTop: "20px", textAlign: "right" }}
                />
              </>
            )}
          </TabPane>
        </Tabs>

        {/* Modal chỉnh sửa request */}
        <Modal
          title="Edit Costume Request"
          open={isEditModalVisible}
          onOk={handleSubmitEdit}
          onCancel={() => setIsEditModalVisible(false)}
          okText="Submit"
          width={600}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                placeholder="Enter costume name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <TextArea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder="Enter costume description"
                rows={3}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Height (cm)</Form.Label>
                  <Input
                    type="number"
                    value={editData.maxHeight}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        maxHeight: Number(e.target.value),
                      })
                    }
                    placeholder="Enter max height"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Weight (kg)</Form.Label>
                  <Input
                    type="number"
                    value={editData.maxWeight}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        maxWeight: Number(e.target.value),
                      })
                    }
                    placeholder="Enter max weight"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Height (cm)</Form.Label>
                  <Input
                    type="number"
                    value={editData.minHeight}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        minHeight: Number(e.target.value),
                      })
                    }
                    placeholder="Enter min height"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Weight (kg)</Form.Label>
                  <Input
                    type="number"
                    value={editData.minWeight}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        minWeight: Number(e.target.value),
                      })
                    }
                    placeholder="Enter min weight"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Input
                value={editData.urlImage}
                onChange={(e) =>
                  setEditData({ ...editData, urlImage: e.target.value })
                }
                placeholder="Enter image URL"
              />
            </Form.Group>
          </Form>
        </Modal>

        {/* Modal xem request */}
        <Modal
          title="View Costume Request"
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
              <Form.Label>Name</Form.Label>
              <Input value={editData.name} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <TextArea value={editData.description} disabled rows={3} />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Height (cm)</Form.Label>
                  <Input type="number" value={editData.maxHeight} disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Max Weight (kg)</Form.Label>
                  <Input type="number" value={editData.maxWeight} disabled />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Height (cm)</Form.Label>
                  <Input type="number" value={editData.minHeight} disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Min Weight (kg)</Form.Label>
                  <Input type="number" value={editData.minWeight} disabled />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Input value={editData.urlImage} disabled />
            </Form.Group>
          </Form>
        </Modal>

        {/* Modal thanh toán ứng trước */}
        <Modal
          title="Pay Deposit"
          open={isPaymentModalVisible}
          onOk={handlePaymentConfirm}
          onCancel={() => setIsPaymentModalVisible(false)}
          okText="Pay Now"
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount (VND)</Form.Label>
              <Input value={paymentAmount.toLocaleString()} readOnly />
            </Form.Group>
          </Form>
        </Modal>

        {/* Modal yêu cầu hoàn tiền */}
        <Modal
          title="Request Refund"
          open={isRefundModalVisible}
          onOk={handleRefundConfirm}
          onCancel={() => setIsRefundModalVisible(false)}
          okText="Submit Refund"
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Bank Account Number</Form.Label>
              <Input
                value={refundData.bankAccount}
                onChange={(e) =>
                  setRefundData({ ...refundData, bankAccount: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bank Name</Form.Label>
              <Input
                value={refundData.bankName}
                onChange={(e) =>
                  setRefundData({ ...refundData, bankName: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default MyRentalCostume;
