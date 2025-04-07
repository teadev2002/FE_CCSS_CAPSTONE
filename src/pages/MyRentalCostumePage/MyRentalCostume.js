import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import { Pagination, Modal, Input, Button, Tabs, Spin, Image } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyRentalCostume.scss";
import { jwtDecode } from "jwt-decode";
import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";
import {
  FileText,
  DollarSign,
  Calendar,
  CreditCard,
  Eye,
  Download,
} from "lucide-react";
import dayjs from "dayjs";
import { useDebounce } from "use-debounce";

const { TabPane } = Tabs;
const { TextArea } = Input;

const initialState = {
  requests: [],
  contracts: [
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
  ],
  loading: false,
  currentRequestPage: 1,
  currentContractPage: 1,
  searchTerm: "",
  modals: {
    view: false,
    edit: false,
    payment: false,
    refund: false,
  },
  formData: {
    edit: {
      name: "",
      description: "",
      characters: [],
      fullRequestData: null,
    },
    refund: { bankAccount: "", bankName: "" },
  },
  selectedItem: null,
  paymentAmount: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_REQUESTS":
      return { ...state, requests: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PAGE":
      return {
        ...state,
        [action.payload.type === "request"
          ? "currentRequestPage"
          : "currentContractPage"]: action.payload.page,
      };
    case "SET_SEARCH":
      return { ...state, searchTerm: action.payload };
    case "TOGGLE_MODAL":
      return {
        ...state,
        modals: {
          ...state.modals,
          [action.payload.modal]: action.payload.visible,
        },
      };
    case "SET_FORM_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.type]: action.payload.data,
        },
      };
    case "SET_SELECTED_ITEM":
      return { ...state, selectedItem: action.payload };
    case "SET_PAYMENT_AMOUNT":
      return { ...state, paymentAmount: action.payload };
    case "ADD_CONTRACT":
      return { ...state, contracts: [...state.contracts, action.payload] };
    default:
      return state;
  }
};

const MyRentalCostume = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [debouncedSearchTerm] = useDebounce(state.searchTerm, 300);
  const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
  const itemsPerPage = 5;
  const charactersPerPage = 2;

  const accessToken = localStorage.getItem("accessToken");
  const decoded = jwtDecode(accessToken);
  const accountId = decoded?.Id;

  useEffect(() => {
    const fetchRequests = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const data = await MyRentalCostumeService.GetAllRequestByAccountId(
          accountId
        );
        if (!data) throw new Error("No data returned from API");
        const requestsArray = Array.isArray(data) ? data : [];
        const filteredRequests = requestsArray.filter(
          (request) => request?.serviceId === "S001"
        );
        dispatch({ type: "SET_REQUESTS", payload: filteredRequests });
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        toast.error("Failed to load requests. Please try again.");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    fetchRequests();
  }, [accountId]);

  const filteredRequests = useMemo(() => {
    return state.requests.filter(
      (req) =>
        req.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        dayjs(req.startDate)
          .format("HH:mm DD/MM/YYYY")
          .includes(debouncedSearchTerm)
    );
  }, [state.requests, debouncedSearchTerm]);

  const filteredContracts = useMemo(() => {
    return state.contracts.filter(
      (contract) =>
        contract.contractName
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        dayjs(contract.startDate)
          .format("HH:mm DD/MM/YYYY")
          .includes(debouncedSearchTerm)
    );
  }, [state.contracts, debouncedSearchTerm]);

  const paginate = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  const handleViewRequest = async (request) => {
    dispatch({ type: "SET_SELECTED_ITEM", payload: request });
    try {
      const requestDetails = await MyRentalCostumeService.getRequestByRequestId(
        request.requestId
      );
      const characters = requestDetails.charactersListResponse || [];

      dispatch({
        type: "SET_FORM_DATA",
        payload: {
          type: "edit",
          data: {
            name: requestDetails.name || "",
            description: requestDetails.description || "",
            characters: characters.map((char) => ({
              characterId: char.characterId,
              maxHeight: char.maxHeight || 0,
              maxWeight: char.maxWeight || 0,
              minHeight: char.minHeight || 0,
              minWeight: char.minWeight || 0,
              quantity: char.quantity || 0,
              urlImage: char.characterImages?.[0]?.urlImage || "",
              description: char.description || "",
            })),
            fullRequestData: requestDetails,
          },
        },
      });

      dispatch({
        type: "TOGGLE_MODAL",
        payload: {
          modal: request.status === "Pending" ? "edit" : "view",
          visible: true,
        },
      });
      setCurrentCharacterPage(1);
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      toast.error("Failed to load request details. Showing cached data.");
      dispatch({
        type: "SET_FORM_DATA",
        payload: {
          type: "edit",
          data: {
            name: request.name || "",
            description: request.description || "",
            characters: [],
            fullRequestData: null,
          },
        },
      });
      dispatch({
        type: "TOGGLE_MODAL",
        payload: {
          modal: request.status === "Pending" ? "edit" : "view",
          visible: true,
        },
      });
    }
  };

  const handleSubmitEdit = async () => {
    const { characters, fullRequestData } = state.formData.edit;
    if (characters.some((char) => char.quantity <= 0)) {
      toast.error("All quantities must be positive numbers!");
      return;
    }
    if (!fullRequestData) {
      toast.error("Request data is missing!");
      return;
    }

    try {
      // Tính startDate mới: thời điểm hiện tại + 1 phút
      const newStartDate = dayjs().add(1, "minute").format("HH:mm DD/MM/YYYY");
      const formattedEndDate = dayjs(fullRequestData.endDate).format(
        "HH:mm DD/MM/YYYY"
      );

      const updatedData = {
        name: fullRequestData.name,
        startDate: newStartDate,
        endDate: formattedEndDate,
        location: fullRequestData.location,
        serviceId: fullRequestData.serviceId,
        listUpdateRequestCharacters: characters.map((char) => ({
          characterId: char.characterId,
          cosplayerId: null,
          description: char.description,
          quantity: char.quantity,
        })),
      };

      // In dữ liệu gửi đi để kiểm tra
      console.log("Updated Data:", updatedData);

      const response = await MyRentalCostumeService.UpdateRequest(
        state.selectedItem.requestId,
        updatedData
      );

      dispatch({
        type: "SET_REQUESTS",
        payload: state.requests.map((req) =>
          req.requestId === state.selectedItem.requestId
            ? {
                ...req,
                charactersListResponse: response.charactersListResponse,
                startDate: newStartDate,
              }
            : req
        ),
      });
      dispatch({
        type: "SET_FORM_DATA",
        payload: {
          type: "edit",
          data: {
            ...state.formData.edit,
            fullRequestData: { ...response, startDate: newStartDate },
          },
        },
      });
      toast.success("Costumes updated successfully!");
      dispatch({
        type: "TOGGLE_MODAL",
        payload: { modal: "edit", visible: false },
      });
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error(
        "Failed to update costumes. Please check the data or try again."
      );
    }
  };

  const handleCharacterChange = (characterId, field, value) => {
    dispatch({
      type: "SET_FORM_DATA",
      payload: {
        type: "edit",
        data: {
          ...state.formData.edit,
          characters: state.formData.edit.characters.map((char) =>
            char.characterId === characterId
              ? {
                  ...char,
                  [field]: field === "quantity" ? Number(value) : value,
                }
              : char
          ),
        },
      },
    });
  };

  const handlePayment = (request) => {
    dispatch({ type: "SET_SELECTED_ITEM", payload: request });
    dispatch({ type: "SET_PAYMENT_AMOUNT", payload: request.price * 0.3 });
    dispatch({
      type: "TOGGLE_MODAL",
      payload: { modal: "payment", visible: true },
    });
  };

  const handlePaymentConfirm = () => {
    toast.success("Payment successful! Redirecting to payment gateway...");
    const newContract = {
      contractId: `C${state.contracts.length + 1}`,
      contractName: `Contract for ${state.selectedItem.name}`,
      price: state.selectedItem.price,
      startDate: state.selectedItem.startDate,
      status: "Active",
    };
    dispatch({ type: "ADD_CONTRACT", payload: newContract });
    dispatch({
      type: "TOGGLE_MODAL",
      payload: { modal: "payment", visible: false },
    });
  };

  const handleDownloadContract = (contractId) => {
    toast.success(`Downloading contract ${contractId} as PDF...`);
  };

  const handleRefundRequest = (contract) => {
    if (contract.status !== "Completed") {
      toast.warning("Contract must be completed to request a refund!");
      return;
    }
    dispatch({ type: "SET_SELECTED_ITEM", payload: contract });
    dispatch({
      type: "TOGGLE_MODAL",
      payload: { modal: "refund", visible: true },
    });
  };

  const handleRefundConfirm = () => {
    const { bankAccount, bankName } = state.formData.refund;
    if (!bankAccount.trim() || !bankName.trim()) {
      toast.error("Bank account and name cannot be empty!");
      return;
    }
    toast.success("Refund request submitted!");
    dispatch({
      type: "TOGGLE_MODAL",
      payload: { modal: "refund", visible: false },
    });
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
                value={state.searchTerm}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", payload: e.target.value })
                }
                className="search-input"
              />
            </Col>
          </Row>
        </div>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="My Requests" key="1">
            {state.loading ? (
              <Spin tip="Loading..." />
            ) : filteredRequests.length === 0 ? (
              <p className="text-center">No requests found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {paginate(
                    filteredRequests,
                    state.currentRequestPage,
                    itemsPerPage
                  ).map((req) => (
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
                                    {dayjs(req.startDate).format(
                                      "HH:mm DD/MM/YYYY"
                                    )}
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
                  current={state.currentRequestPage}
                  pageSize={itemsPerPage}
                  total={filteredRequests.length}
                  onChange={(page) =>
                    dispatch({
                      type: "SET_PAGE",
                      payload: { type: "request", page },
                    })
                  }
                  showSizeChanger={false}
                  style={{ marginTop: "20px", textAlign: "right" }}
                />
              </>
            )}
          </TabPane>

          <TabPane tab="My Contracts" key="2">
            {state.loading ? (
              <Spin tip="Loading..." />
            ) : filteredContracts.length === 0 ? (
              <p className="text-center">No contracts found.</p>
            ) : (
              <>
                <Row className="g-4">
                  {paginate(
                    filteredContracts,
                    state.currentContractPage,
                    itemsPerPage
                  ).map((contract) => (
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
                                      "HH:mm DD/MM/YYYY"
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
                                  onClick={() => handleRefundRequest(contract)}
                                >
                                  <CreditCard size={16} /> Request Refund
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
                  current={state.currentContractPage}
                  pageSize={itemsPerPage}
                  total={filteredContracts.length}
                  onChange={(page) =>
                    dispatch({
                      type: "SET_PAGE",
                      payload: { type: "contract", page },
                    })
                  }
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
          open={state.modals.edit}
          onOk={handleSubmitEdit}
          onCancel={() =>
            dispatch({
              type: "TOGGLE_MODAL",
              payload: { modal: "edit", visible: false },
            })
          }
          okText="Submit"
          width={800}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Input value={state.formData.edit.name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <TextArea
                value={state.formData.edit.description}
                readOnly
                rows={3}
              />
            </Form.Group>
            <h5>Costumes</h5>
            {state.formData.edit.characters.length === 0 ? (
              <p>No costumes found.</p>
            ) : (
              <>
                {paginate(
                  state.formData.edit.characters,
                  currentCharacterPage,
                  charactersPerPage
                ).map((char) => (
                  <Card key={char.characterId} className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Character ID</Form.Label>
                            <Input value={char.characterId} readOnly />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Input
                              value={char.description}
                              onChange={(e) =>
                                handleCharacterChange(
                                  char.characterId,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Enter description"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxHeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxWeight}
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.minHeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.minWeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Input
                              type="number"
                              value={char.quantity}
                              onChange={(e) =>
                                handleCharacterChange(
                                  char.characterId,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              placeholder="Enter quantity"
                            />
                          </Form.Group>
                          {char.urlImage && (
                            <Image
                              src={char.urlImage}
                              alt="Costume Preview"
                              width={100}
                              preview
                              style={{ display: "block", marginTop: "10px" }}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Pagination
                  current={currentCharacterPage}
                  pageSize={charactersPerPage}
                  total={state.formData.edit.characters.length}
                  onChange={(page) => setCurrentCharacterPage(page)}
                  showSizeChanger={false}
                  style={{ textAlign: "right" }}
                />
              </>
            )}
          </Form>
        </Modal>

        {/* Modal xem request */}
        <Modal
          title="View Costume Request"
          open={state.modals.view}
          onCancel={() =>
            dispatch({
              type: "TOGGLE_MODAL",
              payload: { modal: "view", visible: false },
            })
          }
          footer={[
            <Button
              key="close"
              onClick={() =>
                dispatch({
                  type: "TOGGLE_MODAL",
                  payload: { modal: "view", visible: false },
                })
              }
            >
              Close
            </Button>,
          ]}
          width={800}
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Input value={state.formData.edit.name} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <TextArea
                value={state.formData.edit.description}
                disabled
                rows={3}
              />
            </Form.Group>
            <h5>Costumes</h5>
            {state.formData.edit.characters.length === 0 ? (
              <p>No costumes found.</p>
            ) : (
              <>
                {paginate(
                  state.formData.edit.characters,
                  currentCharacterPage,
                  charactersPerPage
                ).map((char) => (
                  <Card key={char.characterId} className="mb-3">
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Character ID</Form.Label>
                            <Input value={char.characterId} disabled />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Input value={char.description} disabled />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxHeight}
                              disabled
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxWeight}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.minHeight}
                              disabled
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.minWeight}
                              disabled
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Quantity</Form.Label>
                            <Input
                              type="number"
                              value={char.quantity}
                              disabled
                            />
                          </Form.Group>
                          {char.urlImage && (
                            <Image
                              src={char.urlImage}
                              alt="Costume Preview"
                              width={100}
                              preview
                              style={{ display: "block", marginTop: "10px" }}
                            />
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
                <Pagination
                  current={currentCharacterPage}
                  pageSize={charactersPerPage}
                  total={state.formData.edit.characters.length}
                  onChange={(page) => setCurrentCharacterPage(page)}
                  showSizeChanger={false}
                  style={{ textAlign: "right" }}
                />
              </>
            )}
          </Form>
        </Modal>

        {/* Modal thanh toán ứng trước */}
        <Modal
          title="Pay Deposit"
          open={state.modals.payment}
          onOk={handlePaymentConfirm}
          onCancel={() =>
            dispatch({
              type: "TOGGLE_MODAL",
              payload: { modal: "payment", visible: false },
            })
          }
          okText="Pay Now"
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Amount (VND)</Form.Label>
              <Input value={state.paymentAmount.toLocaleString()} readOnly />
            </Form.Group>
          </Form>
        </Modal>

        {/* Modal yêu cầu hoàn tiền */}
        <Modal
          title="Request Refund"
          open={state.modals.refund}
          onOk={handleRefundConfirm}
          onCancel={() =>
            dispatch({
              type: "TOGGLE_MODAL",
              payload: { modal: "refund", visible: false },
            })
          }
          okText="Submit Refund"
        >
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Bank Account Number</Form.Label>
              <Input
                value={state.formData.refund.bankAccount}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FORM_DATA",
                    payload: {
                      type: "refund",
                      data: {
                        ...state.formData.refund,
                        bankAccount: e.target.value,
                      },
                    },
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bank Name</Form.Label>
              <Input
                value={state.formData.refund.bankName}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FORM_DATA",
                    payload: {
                      type: "refund",
                      data: {
                        ...state.formData.refund,
                        bankName: e.target.value,
                      },
                    },
                  })
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
