import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import {
  Pagination,
  Modal,
  Input,
  List,
  Button,
  Radio,
  message,
  Tabs,
  Popconfirm,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import MyHistoryService from "../../services/HistoryService/MyHistoryService";
import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyHistory.scss";
import { jwtDecode } from "jwt-decode";
import {
  FileText,
  DollarSign,
  Calendar,
  CreditCard,
  Eye,
  RefreshCw,
} from "lucide-react";
import dayjs from "dayjs"; // Để định dạng ngày giờ

const { TextArea } = Input;
const { TabPane } = Tabs;

const MyHistory = () => {
  const [requests, setRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentContractPage, setCurrentContractPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    listRequestCharacters: [],
    price: 0,
  });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [depositAmount, setDepositAmount] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [updateContractId, setUpdateContractId] = useState(null);

  const itemsPerPage = 5;
  const accessToken = localStorage.getItem("accessToken");
  const decoded = jwtDecode(accessToken);
  const accountId = decoded?.Id;

  const calculateCosplayerPrice = (salaryIndex, quantity) => {
    return 100000 * salaryIndex * quantity; // Đơn vị VND
  };

  const calculateTotalPrice = (characters) => {
    return characters.reduce(
      (total, char) =>
        total + calculateCosplayerPrice(char.salaryIndex, char.quantity),
      0
    );
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await MyHistoryService.GetAllRequestByAccountId(accountId);
        const requestsArray = Array.isArray(data) ? data : [data];
        setRequests(requestsArray);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [accountId]);

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const data = await MyHistoryService.getAllContractByAccountId(
          accountId
        );
        const contractsArray = Array.isArray(data) ? data : [data];
        setContracts(contractsArray);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, [accountId]);

  useEffect(() => {
    const contractRequestIds = contracts.map((contract) => contract.requestId);
    const filtered = requests
      .filter((request) => !contractRequestIds.includes(request.requestId))
      .filter(
        (request) =>
          request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          new Date(request.startDate)
            .toLocaleDateString("en-GB")
            .includes(searchTerm)
      );
    setFilteredPendingRequests(filtered);
    setCurrentPendingPage(1);
  }, [searchTerm, requests, contracts]);

  useEffect(() => {
    const filtered = contracts.filter(
      (contract) =>
        (contract.contractName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        new Date(contract.startDate)
          .toLocaleDateString("en-GB")
          .includes(searchTerm)
    );
    setFilteredContracts(filtered);
    setCurrentContractPage(1);
  }, [searchTerm, contracts]);

  useEffect(() => {
    if (selectedRequestId && depositAmount !== null && paymentLoading) {
      const processPayment = async () => {
        try {
          await MyHistoryService.depositRequest(
            selectedRequestId,
            depositAmount
          );
          toast.success("Payment successful!");
          const requestData = await MyHistoryService.GetAllRequestByAccountId(
            accountId
          );
          setRequests(Array.isArray(requestData) ? requestData : [requestData]);
          const contractData = await MyHistoryService.getAllContractByAccountId(
            accountId
          );
          setContracts(
            Array.isArray(contractData) ? contractData : [contractData]
          );
        } catch (error) {
          toast.error("Cannot payment, waiting for manager to browsed!");
        } finally {
          setPaymentLoading(false);
          setIsPaymentModalVisible(false);
          setSelectedRequestId(null);
          setDepositAmount(null);
        }
      };
      processPayment();
    }
  }, [selectedRequestId, depositAmount, paymentLoading, accountId]);

  useEffect(() => {
    if (updateContractId) {
      const updateStatus = async () => {
        setLoading(true);
        try {
          await MyHistoryService.updateStatusContract(
            updateContractId,
            "Progressing"
          );
          toast.success("Contract status updated to Processing!");
          const contractData = await MyHistoryService.getAllContractByAccountId(
            accountId
          );
          setContracts(
            Array.isArray(contractData) ? contractData : [contractData]
          );
        } catch (error) {
          toast.error("Failed to update contract status!");
        } finally {
          setLoading(false);
          setUpdateContractId(null);
        }
      };
      updateStatus();
    }
  }, [updateContractId, accountId]);

  const handleViewRequest = async (requestId) => {
    setLoading(true);
    setIsViewModalVisible(true);
    try {
      const data = await RequestService.getRequestByRequestId(requestId);
      if (!data) throw new Error("Request data not found");

      const formattedData = {
        name: data.name || "N/A",
        description: data.description || "N/A",
        startDate: data.startDate
          ? dayjs(data.startDate).format("DD/MM/YYYY HH:mm")
          : "N/A",
        endDate: data.endDate
          ? dayjs(data.endDate).format("DD/MM/YYYY HH:mm")
          : "N/A",
        location: data.location || "N/A",
        listRequestCharacters: [],
        price: 0,
      };

      const charactersList = data.charactersListResponse || [];
      if (charactersList.length > 0) {
        const listRequestCharacters = await Promise.all(
          charactersList.map(async (char) => {
            try {
              const characterData = await RequestService.getNameCharacterById(
                char.characterId
              );
              let cosplayerName = "Not Assigned";
              let salaryIndex = 1;

              if (char.cosplayerId) {
                try {
                  const cosplayerData =
                    await RequestService.getNameCosplayerInRequestByCosplayerId(
                      char.cosplayerId
                    );
                  cosplayerName = cosplayerData?.name || "Unknown";
                  salaryIndex = cosplayerData?.salaryIndex || 1;
                } catch (cosplayerError) {
                  console.warn(
                    `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
                    cosplayerError
                  );
                }
              }

              const price = calculateCosplayerPrice(
                salaryIndex,
                char.quantity || 0
              );

              return {
                cosplayerId: char.cosplayerId || null,
                characterId: char.characterId,
                cosplayerName,
                characterName: characterData?.characterName || "Unknown",
                quantity: char.quantity || 0,
                salaryIndex,
                price,
              };
            } catch (charError) {
              console.warn(
                `Failed to fetch character data for ID ${char.characterId}:`,
                charError
              );
              return {
                cosplayerId: char.cosplayerId || null,
                characterId: char.characterId,
                cosplayerName: "Not Assigned",
                characterName: "Unknown",
                quantity: char.quantity || 0,
                salaryIndex: 1,
                price: 0,
              };
            }
          })
        );

        formattedData.listRequestCharacters = listRequestCharacters;
        formattedData.price = calculateTotalPrice(listRequestCharacters);
      }

      setModalData(formattedData);
    } catch (error) {
      console.error("Failed to fetch request details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = (requestId) => {
    setSelectedRequestId(requestId);
    setIsPaymentModalVisible(true);
  };

  const handlePaymentConfirm = () => {
    if (depositAmount === null) {
      message.warning("Please select a deposit amount.");
      return;
    }
    setPaymentLoading(true);
  };

  const handleModalConfirm = () => {
    if (!modalData.name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }
    if (modalData.listRequestCharacters.length === 0) {
      toast.error("Please include at least one character in the request!");
      return;
    }
    console.log("Modal confirmed with data:", modalData);
    setIsViewModalVisible(false);
  };

  const handleRemoveCosplayer = (cosplayerId, characterId) => {
    console.log(`Removing cosplayer ${cosplayerId} - character ${characterId}`);
  };

  const handleUpdateStatus = (contractId) => {
    setUpdateContractId(contractId);
  };

  const handleDepositPayment = () => {
    // Nút này không làm gì cả theo yêu cầu
  };

  const pendingIndexOfLastItem = currentPendingPage * itemsPerPage;
  const pendingIndexOfFirstItem = pendingIndexOfLastItem - itemsPerPage;
  const currentPendingItems = filteredPendingRequests.slice(
    pendingIndexOfFirstItem,
    pendingIndexOfLastItem
  );
  const totalPendingItems = filteredPendingRequests.length;

  const contractIndexOfLastItem = currentContractPage * itemsPerPage;
  const contractIndexOfFirstItem = contractIndexOfLastItem - itemsPerPage;
  const currentContractItems = filteredContracts.slice(
    contractIndexOfFirstItem,
    contractIndexOfLastItem
  );
  const totalContractItems = filteredContracts.length;

  const handlePendingPageChange = (page) => {
    setCurrentPendingPage(page);
  };

  const handleContractPageChange = (page) => {
    setCurrentContractPage(page);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Cancel: "secondary",
      Active: "success",
      Progressing: "warning",
    };
    return (
      <Badge bg={statusColors[status] || "secondary"}>
        {status || "Unknown"}
      </Badge>
    );
  };

  return (
    <div className="my-history bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-my-history">
          <span>My History</span>
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row className="align-items-center g-3">
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
          <TabPane tab="Pending Requests" key="1">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentPendingItems.length === 0 ? (
              <p className="text-center">No pending requests found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentPendingItems.map((request) => (
                    <Col key={request.requestId} xs={12}>
                      <Card className="history-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="history-title mb-0">
                                      {request.name || "N/A"}
                                    </h3>
                                    {getStatusBadge(request.status)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <DollarSign size={16} className="me-1" />
                                    Total Price:{" "}
                                    {(request.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date: {request.startDate || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view"
                                  onClick={() =>
                                    handleViewRequest(request.requestId)
                                  }
                                >
                                  <Eye size={16} className="me-1" />
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  className="btn-deposit"
                                  onClick={() =>
                                    handlePayment(request.requestId)
                                  }
                                >
                                  <CreditCard size={16} className="me-1" />
                                  Select Deposit
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
                      Showing <strong>{pendingIndexOfFirstItem + 1}</strong> to{" "}
                      <strong>
                        {Math.min(pendingIndexOfLastItem, totalPendingItems)}
                      </strong>{" "}
                      of <strong>{totalPendingItems}</strong> results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentPendingPage}
                      pageSize={itemsPerPage}
                      total={totalPendingItems}
                      onChange={handlePendingPageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>

          <TabPane tab="Contracts" key="2">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentContractItems.length === 0 ? (
              <p className="text-center">No contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentContractItems.map((contract) => (
                    <Col key={contract.requestId} xs={12}>
                      <Card className="history-card shadow">
                        <Card.Body>
                          <div className="d-flex flex-column flex-md-row gap-4">
                            <div className="flex-grow-1">
                              <div className="d-flex gap-3">
                                <div className="icon-circle">
                                  <FileText size={24} />
                                </div>
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-start">
                                    <h3 className="history-title mb-0">
                                      {contract.contractName || "N/A"}
                                    </h3>
                                    {getStatusBadge(contract.status)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <DollarSign size={16} className="me-1" />
                                    Total Price:{" "}
                                    {(contract.price || 0).toLocaleString()} VND
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    Start Date: {contract.startDate || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-md-end">
                              <div className="d-flex gap-2 justify-content-md-end">
                                <Button
                                  type="primary"
                                  size="small"
                                  className="btn-view"
                                  onClick={() =>
                                    handleViewRequest(contract.requestId)
                                  }
                                >
                                  <Eye size={16} className="me-1" />
                                  View
                                </Button>
                                <Button
                                  size="small"
                                  className="btn-deposit-payment"
                                  onClick={handleDepositPayment} // Nút không làm gì
                                >
                                  <CreditCard size={16} className="me-1" />
                                  Deposit Payment
                                </Button>
                                <Popconfirm
                                  title="Are you sure you want to update status to Processing?"
                                  onConfirm={() =>
                                    handleUpdateStatus(contract.contractId)
                                  }
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button size="small" className="btn-update">
                                    <RefreshCw size={16} className="me-1" />
                                    Update Status
                                  </Button>
                                </Popconfirm>
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
                      Showing <strong>{contractIndexOfFirstItem + 1}</strong> to{" "}
                      <strong>
                        {Math.min(contractIndexOfLastItem, totalContractItems)}
                      </strong>{" "}
                      of <strong>{totalContractItems}</strong> results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentContractPage}
                      pageSize={itemsPerPage}
                      total={totalContractItems}
                      onChange={handleContractPageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>
        </Tabs>

        <Modal
          title="Confirm Your Request"
          open={isViewModalVisible} // Thay 'visible' thành 'open' nếu dùng Ant Design 5+
          onOk={handleModalConfirm}
          onCancel={() => setIsViewModalVisible(false)}
          okText="Send Request"
          cancelText="Edit"
        >
          <p>
            <strong>Name:</strong>
          </p>
          <Input
            value={modalData.name}
            onChange={(e) =>
              setModalData({ ...modalData, name: e.target.value })
            }
            placeholder="Your account name"
            style={{ width: "250px" }}
          />
          <p>
            <strong>Description:</strong>
          </p>
          <TextArea
            value={modalData.description}
            onChange={(e) =>
              setModalData({ ...modalData, description: e.target.value })
            }
            placeholder="Enter description"
            style={{ width: "300px" }}
          />
          <p>
            <strong>Start DateTime:</strong> {modalData.startDate}
          </p>
          <p>
            <strong>End DateTime:</strong> {modalData.endDate}
          </p>
          <p>
            <strong>Location:</strong> {modalData.location || "N/A"}
          </p>
          <p>
            <strong>Coupon ID:</strong> {"N/A"}
          </p>
          <h4>List of Requested Characters:</h4>
          <List
            dataSource={modalData.listRequestCharacters}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                actions={[
                  <Button
                    type="link"
                    icon={<CloseOutlined />}
                    onClick={() =>
                      handleRemoveCosplayer(item.cosplayerId, item.characterId)
                    }
                  />,
                ]}
              >
                <p>
                  {item.cosplayerName} - {item.characterName} - Quantity:{" "}
                  {item.quantity} - Price: {item.price.toLocaleString()} VND
                </p>
              </List.Item>
            )}
          />
          <p>
            <strong>Total Price:</strong>{" "}
            {modalData.price.toLocaleString() || 0} VND
          </p>
        </Modal>

        <Modal
          title="Select Payment Amount"
          open={isPaymentModalVisible} // Thay 'visible' thành 'open' nếu dùng Ant Design 5+
          onOk={handlePaymentConfirm}
          onCancel={() => {
            setIsPaymentModalVisible(false);
            setDepositAmount(null);
          }}
          okText="Confirm Deposit"
          cancelText="Cancel"
          confirmLoading={paymentLoading}
        >
          <p>Please select a deposit amount:</p>
          <Radio.Group
            onChange={(e) => setDepositAmount(e.target.value)}
            value={depositAmount}
          >
            <Radio value={30}>30 %</Radio>
            <Radio value={50}>50 %</Radio>
            <Radio value={70}>70 %</Radio>
          </Radio.Group>
        </Modal>
      </Container>
    </div>
  );
};

export default MyHistory;
