// them lọc và sắp xếp /////////////////////////////////////////////////////////
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
  Tooltip,
  Select,
  Checkbox,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import MyHistoryService from "../../services/HistoryService/MyHistoryService";
import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
import PaymentService from "../../services/PaymentService/PaymentService.js";
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
  Banknote,
} from "lucide-react";
import dayjs from "dayjs";

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const MyHistory = () => {
  const [requests, setRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [progressingContracts, setProgressingContracts] = useState([]);
  const [filteredProgressingContracts, setFilteredProgressingContracts] =
    useState([]);
  const [completedContracts, setCompletedContracts] = useState([]);
  const [filteredCompletedContracts, setFilteredCompletedContracts] = useState(
    []
  );
  const [loading, setLoading] = useState(false);
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentContractPage, setCurrentContractPage] = useState(1);
  const [currentProgressingPage, setCurrentProgressingPage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("date-desc"); // Mặc định: Mới nhất trước
  const [statusFilter, setStatusFilter] = useState([
    "Pending",
    "Browsed",
    "Cancel",
  ]); // Mặc định: Chọn tất cả
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isCompletePaymentModalVisible, setIsCompletePaymentModalVisible] =
    useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    description: "",
    startDate: "N/A",
    startTime: "N/A",
    endDate: "N/A",
    endTime: "N/A",
    location: "",
    deposit: "N/A",
    listRequestCharacters: [],
    price: 0,
    status: "Unknown",
    reason: null,
  });
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [depositAmount, setDepositAmount] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [depositData, setDepositData] = useState({
    fullName: "",
    amount: 0,
    contractId: "",
  });
  const [completePaymentData, setCompletePaymentData] = useState({
    fullName: "",
    amount: 0,
    contractId: "",
  });

  const itemsPerPage = 5;
  const accessToken = localStorage.getItem("accessToken");
  const decoded = jwtDecode(accessToken);
  const accountId = decoded?.Id;

  // Hàm tính tổng số ngày
  const calculateTotalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = dayjs(startDate, "HH:mm DD/MM/YYYY");
    const end = dayjs(endDate, "HH:mm DD/MM/YYYY");
    if (!start.isValid() || !end.isValid()) return 0;
    return end.diff(start, "day") + 1;
  };

  // Hàm tính tổng số giờ
  const calculateTotalHours = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = dayjs(startDate, "HH:mm DD/MM/YYYY");
    const end = dayjs(endDate, "HH:mm DD/MM/YYYY");
    if (!start.isValid() || !end.isValid()) return 0;

    const hoursPerDay =
      end.hour() - start.hour() + (end.minute() - start.minute()) / 60;
    const totalDays = end.diff(start, "day") + 1;
    return hoursPerDay * totalDays;
  };

  // Hàm định dạng ngày
  const formatDate = (dateTime) => {
    if (!dateTime) return "N/A";
    const parsed = dayjs(dateTime, "HH:mm DD/MM/YYYY");
    return parsed.isValid() ? parsed.format("DD/MM/YYYY") : "N/A";
  };

  // Hàm định dạng giờ
  const formatTime = (dateTime) => {
    if (!dateTime) return "N/A";
    const parsed = dayjs(dateTime, "HH:mm DD/MM/YYYY");
    return parsed.isValid() ? parsed.format("HH:mm") : "N/A";
  };

  // Hàm tính giá cho một cosplayer
  const calculateCosplayerPrice = (
    salaryIndex,
    characterPrice,
    quantity,
    totalHours,
    totalDays
  ) => {
    if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
    return (totalHours * salaryIndex + totalDays * characterPrice) * quantity;
  };

  // Hàm tính tổng giá
  const calculateTotalPrice = (characters) => {
    return characters.reduce(
      (total, char) =>
        total +
        calculateCosplayerPrice(
          char.salaryIndex,
          char.characterPrice || 0,
          char.quantity,
          char.totalHours,
          char.totalDays
        ),
      0
    );
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await MyHistoryService.GetAllRequestByAccountId(accountId);
        const requestsArray = Array.isArray(data) ? data : [data];
        const filteredRequests = requestsArray
          .filter((request) => request.serviceId === "S002")
          .map((request) => ({
            ...request,
            reason: request.reason || null,
          }));
        setRequests(filteredRequests);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error("Failed to load requests. Please try again.");
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
        const validRequestIds = requests.map((req) => req.requestId);
        const filteredContracts = contractsArray.filter((contract) =>
          validRequestIds.includes(contract.requestId)
        );

        setContracts(filteredContracts.filter((c) => c.status === "Active"));
        setProgressingContracts(
          filteredContracts.filter((c) => c.status === "Progressing")
        );
        setCompletedContracts(
          filteredContracts.filter((c) => c.status === "Completed")
        );
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
        toast.error("Failed to load contracts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (requests.length > 0) {
      fetchContracts();
    }
  }, [accountId, requests]);

  useEffect(() => {
    const contractRequestIds = contracts.map((contract) => contract.requestId);
    const progressingRequestIds = progressingContracts.map(
      (contract) => contract.requestId
    );
    const completedRequestIds = completedContracts.map(
      (contract) => contract.requestId
    );

    let filtered = requests
      .filter(
        (request) =>
          !contractRequestIds.includes(request.requestId) &&
          !progressingRequestIds.includes(request.requestId) &&
          !completedRequestIds.includes(request.requestId)
      )
      .filter(
        (request) =>
          request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formatDate(request.startDate).includes(searchTerm)
      )
      // Lọc theo trạng thái
      .filter((request) => statusFilter.includes(request.status));

    // Sắp xếp
    filtered.sort((a, b) => {
      if (sortOption === "date-desc") {
        return (
          dayjs(b.startDate, "HH:mm DD/MM/YYYY") -
          dayjs(a.startDate, "HH:mm DD/MM/YYYY")
        );
      } else if (sortOption === "date-asc") {
        return (
          dayjs(a.startDate, "HH:mm DD/MM/YYYY") -
          dayjs(b.startDate, "HH:mm DD/MM/YYYY")
        );
      } else if (sortOption === "price-desc") {
        return (b.price || 0) - (a.price || 0);
      } else if (sortOption === "price-asc") {
        return (a.price || 0) - (b.price || 0);
      }
      return 0;
    });

    setFilteredPendingRequests(filtered);
    setCurrentPendingPage(1);
  }, [
    searchTerm,
    requests,
    contracts,
    progressingContracts,
    completedContracts,
    sortOption,
    statusFilter,
  ]);

  useEffect(() => {
    const filtered = contracts.filter(
      (contract) =>
        (contract.contractName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        formatDate(contract.startDate).includes(searchTerm)
    );
    setFilteredContracts(filtered);
    setCurrentContractPage(1);
  }, [searchTerm, contracts]);

  useEffect(() => {
    const filtered = progressingContracts.filter(
      (contract) =>
        (contract.contractName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        formatDate(contract.startDate).includes(searchTerm)
    );
    setFilteredProgressingContracts(filtered);
    setCurrentProgressingPage(1);
  }, [searchTerm, progressingContracts]);

  useEffect(() => {
    const filtered = completedContracts.filter(
      (contract) =>
        (contract.contractName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        formatDate(contract.startDate).includes(searchTerm)
    );
    setFilteredCompletedContracts(filtered);
    setCurrentCompletedPage(1);
  }, [searchTerm, completedContracts]);

  useEffect(() => {
    if (selectedRequestId && depositAmount !== null && paymentLoading) {
      const processPayment = async () => {
        try {
          await MyHistoryService.depositRequest(
            selectedRequestId,
            depositAmount
          );
          toast.success("Choose Deposit successful!");
          const requestData = await MyHistoryService.GetAllRequestByAccountId(
            accountId
          );
          const filteredRequests = (
            Array.isArray(requestData) ? requestData : [requestData]
          ).filter((req) => req.serviceId === "S002");
          setRequests(filteredRequests);

          const contractData = await MyHistoryService.getAllContractByAccountId(
            accountId
          );
          const validRequestIds = filteredRequests.map((req) => req.requestId);
          const filteredContracts = (
            Array.isArray(contractData) ? contractData : [contractData]
          ).filter((contract) => validRequestIds.includes(contract.requestId));

          setContracts(filteredContracts.filter((c) => c.status === "Active"));
          setProgressingContracts(
            filteredContracts.filter((c) => c.status === "Progressing")
          );
          setCompletedContracts(
            filteredContracts.filter((c) => c.status === "Completed")
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

  const handleViewRequest = async (requestId) => {
    setLoading(true);
    setIsViewModalVisible(true);
    try {
      const data = await MyHistoryService.getRequestByRequestId(requestId);
      if (!data) throw new Error("Request data not found");

      const formattedData = {
        name: data.name || "N/A",
        description: data.description || "N/A",
        startDate: "N/A",
        startTime: "N/A",
        endDate: "N/A",
        endTime: "N/A",
        location: data.location || "N/A",
        deposit: data.deposit || "N/A",
        listRequestCharacters: [],
        price: 0,
        status: data.status || "Unknown",
        reason: data.reason || null,
      };

      const charactersList = data.charactersListResponse || [];
      if (charactersList.length > 0) {
        const listRequestCharacters = await Promise.all(
          charactersList.map(async (char) => {
            try {
              const characterData = await MyHistoryService.getCharacterById(
                char.characterId
              );
              let cosplayerName = "Not Assigned";
              let salaryIndex = 1;
              let characterPrice = characterData?.price || 0;

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

              const requestDates = char.requestDateResponses || [];
              let startDate = "N/A";
              let startTime = "N/A";
              let endDate = "N/A";
              let endTime = "N/A";
              let totalHours = 0;
              let totalDays = 0;

              if (requestDates.length > 0) {
                const firstDate = requestDates[0];
                startDate = formatDate(firstDate.startDate);
                startTime = formatTime(firstDate.startDate);
                endDate = formatDate(firstDate.endDate);
                endTime = formatTime(firstDate.endDate);
                totalDays = calculateTotalDays(
                  firstDate.startDate,
                  firstDate.endDate
                );
                totalHours = calculateTotalHours(
                  firstDate.startDate,
                  firstDate.endDate
                );
              }

              const price = calculateCosplayerPrice(
                salaryIndex,
                characterPrice,
                char.quantity || 1,
                totalHours,
                totalDays
              );

              return {
                cosplayerId: char.cosplayerId || null,
                characterId: char.characterId,
                cosplayerName,
                characterName: characterData?.characterName || "Unknown",
                characterImage: char.characterImages?.[0]?.urlImage || "",
                quantity: char.quantity || 1,
                salaryIndex,
                characterPrice,
                price,
                totalHours,
                totalDays,
                startDate,
                startTime,
                endDate,
                endTime,
              };
            } catch (charError) {
              console.warn(
                `Failed to fetch character data for ID ${char.characterId}:`,
                charError
              );
              return {
                cosplayerId: char.cosplayerId || null,
                characterId: char.characterId,
                cosplayerName: "Hire Costume",
                characterName: "Unknown",
                characterImage: "",
                quantity: char.quantity || 1,
                salaryIndex: 1,
                characterPrice: 0,
                price: 0,
                totalHours: 0,
                totalDays: 0,
                startDate: "N/A",
                startTime: "N/A",
                endDate: "N/A",
                endTime: "N/A",
              };
            }
          })
        );

        formattedData.listRequestCharacters = listRequestCharacters;
        formattedData.price = calculateTotalPrice(listRequestCharacters);

        if (listRequestCharacters.length > 0) {
          formattedData.startDate = listRequestCharacters[0].startDate;
          formattedData.startTime = listRequestCharacters[0].startTime;
          formattedData.endDate = listRequestCharacters[0].endDate;
          formattedData.endTime = listRequestCharacters[0].endTime;
        }
      }

      setModalData(formattedData);
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      toast.error("Failed to load request details.");
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
    setIsViewModalVisible(false);
  };

  const handleDepositPayment = (contract) => {
    setDepositData({
      fullName: "",
      amount: contract.amount || 0,
      contractId: contract.contractId,
    });
    setIsDepositModalVisible(true);
  };

  const handleDepositConfirm = async () => {
    if (!depositData.fullName.trim()) {
      toast.error("Full name cannot be empty!");
      return;
    }

    setPaymentLoading(true);
    try {
      const paymentRequestData = {
        fullName: depositData.fullName,
        orderInfo: "",
        amount: depositData.amount,
        purpose: 1,
        accountId: accountId,
        ticketId: "",
        ticketQuantity: "",
        contractId: depositData.contractId,
        orderpaymentId: "",
      };

      const paymentUrl = await PaymentService.DepositPayment(
        paymentRequestData
      );
      window.location.href = paymentUrl;
      toast.success("Redirecting to payment gateway...");
    } catch (error) {
      toast.error(error.message || "Failed to process payment!");
    } finally {
      setPaymentLoading(false);
      setIsDepositModalVisible(false);
    }
  };

  const handleCompleteContractPayment = (contract) => {
    setCompletePaymentData({
      fullName: "",
      amount: contract.price - contract.amount,
      contractId: contract.contractId,
    });
    setIsCompletePaymentModalVisible(true);
  };

  const handleCompletePaymentConfirm = async () => {
    if (!completePaymentData.fullName.trim()) {
      toast.error("Full name cannot be empty!");
      return;
    }

    setPaymentLoading(true);
    try {
      const paymentRequestData = {
        fullName: completePaymentData.fullName,
        orderInfo: "",
        amount: completePaymentData.amount,
        purpose: 2,
        accountId: accountId,
        ticketId: "",
        ticketQuantity: "",
        contractId: completePaymentData.contractId,
        orderpaymentId: "",
      };

      const paymentUrl = await PaymentService.DepositPayment(
        paymentRequestData
      );
      window.location.href = paymentUrl;
      toast.success("Redirecting to payment gateway...");
    } catch (error) {
      toast.error(error.message || "Failed to process payment!");
    } finally {
      setPaymentLoading(false);
      setIsCompletePaymentModalVisible(false);
    }
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

  const progressingIndexOfLastItem = currentProgressingPage * itemsPerPage;
  const progressingIndexOfFirstItem = progressingIndexOfLastItem - itemsPerPage;
  const currentProgressingItems = filteredProgressingContracts.slice(
    progressingIndexOfFirstItem,
    progressingIndexOfLastItem
  );
  const totalProgressingItems = filteredProgressingContracts.length;

  const completedIndexOfLastItem = currentCompletedPage * itemsPerPage;
  const completedIndexOfFirstItem = completedIndexOfLastItem - itemsPerPage;
  const currentCompletedItems = filteredCompletedContracts.slice(
    completedIndexOfFirstItem,
    completedIndexOfLastItem
  );
  const totalCompletedItems = filteredCompletedContracts.length;

  const handlePendingPageChange = (page) => {
    setCurrentPendingPage(page);
  };

  const handleContractPageChange = (page) => {
    setCurrentContractPage(page);
  };

  const handleProgressingPageChange = (page) => {
    setCurrentProgressingPage(page);
  };

  const handleCompletedPageChange = (page) => {
    setCurrentCompletedPage(page);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: "primary",
      Browsed: "success",
      Cancel: "secondary",
      Active: "success",
      Progressing: "warning",
      Completed: "success",
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
          <span>My History Rental Cosplayers</span>
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row className="align-items-center g-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by name or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </Col>
            <Col md={3}>
              <Select
                style={{ width: "100%" }}
                value={sortOption}
                onChange={(value) => setSortOption(value)}
              >
                <Option value="date-desc">Newest First</Option>
                <Option value="date-asc">Oldest First</Option>
                <Option value="price-desc">Price: High to Low</Option>
                <Option value="price-asc">Price: Low to High</Option>
              </Select>
            </Col>
            <Col md={3}>
              <Checkbox.Group
                options={[
                  { label: "Pending", value: "Pending" },
                  { label: "Browsed", value: "Browsed" },
                  { label: "Cancel", value: "Cancel" },
                ]}
                value={statusFilter}
                onChange={(checkedValues) =>
                  setStatusFilter(
                    checkedValues.length
                      ? checkedValues
                      : ["Pending", "Browsed", "Cancel"]
                  )
                }
              />
            </Col>
          </Row>
        </div>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Confirm Pending" key="1">
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
                                    Start Date: {formatDate(request.startDate)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Calendar size={16} className="me-1" />
                                    End Date: {formatDate(request.endDate)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Banknote size={16} className="me-1" />
                                    Deposit: {request.deposit || "N/A"}%
                                  </div>
                                  {request.status === "Cancel" &&
                                    request.reason && (
                                      <div className="reason-text mt-1">
                                        <FileText size={16} className="me-1" />
                                        Reason: {request.reason}
                                      </div>
                                    )}
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

          <TabPane tab="Pay Contract Deposit" key="2">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentContractItems.length === 0 ? (
              <p className="text-center">No active contracts found.</p>
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
                                    Start Date: {formatDate(contract.startDate)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Banknote size={16} className="me-1" />
                                    Amount:{" "}
                                    {(
                                      contract.amount || 0
                                    ).toLocaleString()}{" "}
                                    VND{" "}
                                    <span style={{ color: "red" }}>
                                      Deposit Unpaid
                                    </span>
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
                                  onClick={() => handleDepositPayment(contract)}
                                >
                                  <CreditCard size={16} className="me-1" />
                                  Deposit Payment
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

          <TabPane tab="Complete Payment" key="3">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentProgressingItems.length === 0 ? (
              <p className="text-center">No progressing contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentProgressingItems.map((contract) => (
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
                                    Start Date: {formatDate(contract.startDate)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Banknote size={16} className="me-1" />
                                    Amount:{" "}
                                    {(
                                      contract.amount || 0
                                    ).toLocaleString()}{" "}
                                    VND{" "}
                                    <span style={{ color: "green" }}>
                                      Deposited
                                    </span>
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
                                  className="btn-complete-payment"
                                  onClick={() =>
                                    handleCompleteContractPayment(contract)
                                  }
                                >
                                  <CreditCard size={16} className="me-1" />
                                  Complete Payment
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
                      Showing <strong>{progressingIndexOfFirstItem + 1}</strong>{" "}
                      to{" "}
                      <strong>
                        {Math.min(
                          progressingIndexOfLastItem,
                          totalProgressingItems
                        )}
                      </strong>{" "}
                      of <strong>{totalProgressingItems}</strong> results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentProgressingPage}
                      pageSize={itemsPerPage}
                      total={totalProgressingItems}
                      onChange={handleProgressingPageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>

          <TabPane tab="Finish Contract" key="4">
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : currentCompletedItems.length === 0 ? (
              <p className="text-center">No completed contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {currentCompletedItems.map((contract) => (
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
                                    Start Date: {formatDate(contract.startDate)}
                                  </div>
                                  <div className="text-muted small mt-1">
                                    <Banknote size={16} className="me-1" />
                                    Amount:{" "}
                                    {(
                                      contract.amount || 0
                                    ).toLocaleString()}{" "}
                                    VND{" "}
                                    <span style={{ color: "green" }}>
                                      Fully Paid
                                    </span>
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
                      Showing <strong>{completedIndexOfFirstItem + 1}</strong>{" "}
                      to{" "}
                      <strong>
                        {Math.min(
                          completedIndexOfLastItem,
                          totalCompletedItems
                        )}
                      </strong>{" "}
                      of <strong>{totalCompletedItems}</strong> results
                    </p>
                  </Col>
                  <Col xs={12} sm={6} className="d-flex justify-content-end">
                    <Pagination
                      current={currentCompletedPage}
                      pageSize={itemsPerPage}
                      total={totalCompletedItems}
                      onChange={handleCompletedPageChange}
                      showSizeChanger={false}
                    />
                  </Col>
                </Row>
              </>
            )}
          </TabPane>
        </Tabs>

        <Modal
          title="View Your Request"
          open={isViewModalVisible}
          onOk={handleModalConfirm}
          onCancel={() => setIsViewModalVisible(false)}
          okText="OK"
          width={800}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Name:</strong>
              </Form.Label>
              <Input value={modalData.name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Description:</strong>
              </Form.Label>
              <TextArea value={modalData.description} readOnly rows={4} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Location:</strong>
              </Form.Label>
              <Input value={modalData.location} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Deposit:</strong>
              </Form.Label>
              <Input value={modalData.deposit} readOnly suffix="%" />
            </Form.Group>

            <div className="d-flex">
              <Form.Group className="mb-3 me-3">
                <Form.Label>
                  <strong>Start Date:</strong>
                </Form.Label>
                <Input value={modalData.startDate} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>End Date:</strong>
                </Form.Label>
                <Input value={modalData.endDate} readOnly />
              </Form.Group>
            </div>
            <div className="d-flex">
              <Form.Group className="mb-3 me-3">
                <Form.Label>
                  <strong>Start Time:</strong>
                </Form.Label>
                <Input value={modalData.startTime} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>End Time:</strong>
                </Form.Label>
                <Input value={modalData.endTime} readOnly />
              </Form.Group>
            </div>
          </Form>
          <h4>List of Requested Characters:</h4>
          <List
            dataSource={modalData.listRequestCharacters}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p>
                      <strong>{item.cosplayerName}</strong> as{" "}
                      <strong>{item.characterName}</strong>
                    </p>
                    <p>
                      Quantity: {item.quantity} | Hourly Rate:{" "}
                      {item.salaryIndex.toLocaleString()} VND/h | Character
                      Price: {item.characterPrice.toLocaleString()} VND/day
                    </p>
                    <Tooltip
                      title={`Price = [(${item.totalHours.toFixed(2)} hours × ${
                        item.salaryIndex
                      } VND/h) + (${item.totalDays} days × ${
                        item.characterPrice
                      } VND/day)] × ${item.quantity}`}
                    >
                      <p>
                        Price:{" "}
                        <strong>{item.price.toLocaleString()} VND</strong>
                      </p>
                    </Tooltip>
                  </div>
                </div>
              </List.Item>
            )}
          />
          <p>
            <strong>Total Price:</strong>{" "}
            <strong>{modalData.price.toLocaleString()} VND</strong>
          </p>
          {modalData.status === "Cancel" && modalData.reason && (
            <h4 className="reason-text">
              <strong>Reason:</strong>{" "}
              <span style={{ color: "red" }}>{modalData.reason}</span>
            </h4>
          )}
        </Modal>

        <Modal
          title="Select Payment Amount"
          open={isPaymentModalVisible}
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
            <Radio value={30}>30%</Radio>
            <Radio value={50}>50%</Radio>
            <Radio value={70}>70%</Radio>
          </Radio.Group>
        </Modal>

        <Modal
          title="Deposit Payment"
          open={isDepositModalVisible}
          onOk={handleDepositConfirm}
          onCancel={() => setIsDepositModalVisible(false)}
          okText="Purchase"
          cancelText="Cancel"
          confirmLoading={paymentLoading}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Full Name</strong>
              </Form.Label>
              <Input
                value={depositData.fullName}
                onChange={(e) =>
                  setDepositData({ ...depositData, fullName: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Amount (VND)</strong>
              </Form.Label>
              <Input value={depositData.amount.toLocaleString()} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Purpose</strong>
              </Form.Label>
              <Input value="Tiền cọc hợp đồng" readOnly />
            </Form.Group>
          </Form>
        </Modal>

        <Modal
          title="Complete Contract Payment"
          open={isCompletePaymentModalVisible}
          onOk={handleCompletePaymentConfirm}
          onCancel={() => setIsCompletePaymentModalVisible(false)}
          okText="Pay Now"
          cancelText="Cancel"
          confirmLoading={paymentLoading}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Full Name</strong>
              </Form.Label>
              <Input
                value={completePaymentData.fullName}
                onChange={(e) =>
                  setCompletePaymentData({
                    ...completePaymentData,
                    fullName: e.target.value,
                  })
                }
                placeholder="Enter your full name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Amount (VND)</strong>
              </Form.Label>
              <Input
                value={completePaymentData.amount.toLocaleString()}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Purpose</strong>
              </Form.Label>
              <Input value="Tất toán hợp đồng" readOnly />
            </Form.Group>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default MyHistory;
