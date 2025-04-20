import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Modal,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { Pagination } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/RequestCharacter.scss";
import {
  User,
  Calendar,
  Clock,
  FileText,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import TaskService from "../../services/TaskService/TaskService";
import { useParams, useNavigate } from "react-router-dom";

const RequestCharacter = () => {
  const [requestCharacters, setRequestCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cosplayerName, setCosplayerName] = useState("N/A"); // Lưu tên cosplayer từ profile
  const [selectedStatus, setSelectedStatus] = useState(null); // Lưu trạng thái được chọn trong modal
  const itemsPerPage = 5;

  const { id } = useParams(); // Lấy id từ URL params (/MyTask/:id)
  const accountId = id;
  const navigate = useNavigate();

  // Danh sách trạng thái từ enum RequestCharacterStatus
  const validStatuses = ["None", "Pending", "Accept", "Busy", "Cancel"];

  // Màu sắc cho từng trạng thái
  const statusColors = {
    None: "secondary",
    Pending: "warning",
    Accept: "success",
    Busy: "danger",
    Cancel: "dark",
  };

  const parseDateTime = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return { date: "N/A", time: "N/A" };
    }
    try {
      const [time, date] = dateString.split(" ");
      if (!time || !date) {
        return { date: "N/A", time: "N/A" };
      }
      const [day, month, year] = date.split("/");
      if (!day || !month || !year) {
        return { date: "N/A", time: "N/A" };
      }
      return { date: `${day}/${month}/${year}`, time };
    } catch (error) {
      console.warn(`Invalid date format: ${dateString}`, error);
      return { date: "N/A", time: "N/A" };
    }
  };

  // Ánh xạ giá trị enum RequestCharacterStatus
  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "None";
      case 1:
        return "Pending";
      case 2:
        return "Accept";
      case 3:
        return "Busy";
      case 4:
        return "Cancel";
      default:
        return "Unknown";
    }
  };

  const getIcon = (characterName) => {
    if (characterName.toLowerCase().includes("cloud"))
      return <User size={24} />;
    return <FileText size={24} />;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!accountId) {
        toast.error("Missing account ID in URL.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        // Lấy thông tin profile để lấy name
        const profile = await TaskService.getProfileById(accountId);
        setCosplayerName(profile.name || "N/A");

        // Lấy danh sách request characters
        const data = await TaskService.getRequestCharactersByCosplayer(
          accountId
        );
        setRequestCharacters(data);
        toast.success("Request characters loaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error("No data found for this account.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else if (error.response && error.response.status === 401) {
          toast.error("Unauthorized. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          navigate("/login");
        } else {
          toast.error(error.message || "Failed to load data.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [accountId, navigate]);

  const filteredRequests = requestCharacters.filter((request) => {
    const matchesSearch = request.characterName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" ||
      getStatusLabel(request.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedRequests = filteredRequests.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalItems = filteredRequests.length;

  const handleRequestClick = async (request) => {
    setIsLoading(true);
    try {
      const data = await TaskService.getRequestCharacterById(
        request.requestCharacterId
      );
      // Gắn thêm cosplayerName và đặt selectedStatus về trạng thái hiện tại
      setSelectedRequest({ ...data, cosplayerName });
      setSelectedStatus(data.status); // Đặt trạng thái ban đầu
    } catch (error) {
      toast.error(
        error.message || "Failed to load request character details.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseRequestDetail = () => {
    setSelectedRequest(null);
    setSelectedStatus(null); // Reset selectedStatus khi đóng modal
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === null || selectedStatus === selectedRequest.status) {
      toast.warn("Please select a different status.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await TaskService.updateRequestCharacterStatus(
        selectedRequest.requestCharacterId,
        selectedStatus
      );
      // Cập nhật danh sách requestCharacters
      const updatedData = await TaskService.getRequestCharactersByCosplayer(
        accountId
      );
      setRequestCharacters(updatedData);
      // Cập nhật selectedRequest
      const updatedDetail = await TaskService.getRequestCharacterById(
        selectedRequest.requestCharacterId
      );
      setSelectedRequest({ ...updatedDetail, cosplayerName });
      toast.success("Request character status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(
        error.message || "Failed to update request character status.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="request-character bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-request-character">
          <span>Request Character</span>
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row className="align-items-center g-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search characters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </Col>
            <Col md={6} className="d-flex gap-3">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                {validStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </div>

        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <Row className="g-4">
              {paginatedRequests.length === 0 ? (
                <Col>
                  <p className="text-center">No requests available.</p>
                </Col>
              ) : (
                paginatedRequests.map((request) => (
                  <Col key={request.requestCharacterId} xs={12}>
                    <Card
                      className="request-card shadow"
                      onClick={() => handleRequestClick(request)}
                    >
                      <Card.Body>
                        <div className="d-flex flex-column flex-md-row gap-4">
                          <div className="flex-grow-1">
                            <div className="d-flex gap-3">
                              <div className="icon-circle">
                                {getIcon(request.characterName)}
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start">
                                  <h3 className="request-title mb-0">
                                    {request.characterName || "N/A"}
                                  </h3>
                                  <Badge
                                    bg={
                                      statusColors[
                                        getStatusLabel(request.status)
                                      ] || "secondary"
                                    }
                                  >
                                    {getStatusLabel(request.status) ||
                                      "Unknown"}
                                  </Badge>
                                </div>
                                <div className="text-muted small">
                                  Cosplayer Name: {cosplayerName}
                                </div>
                                <p className="description mt-2 mb-0">
                                  {request.description || "No description"}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-md-end">
                            <div className="d-flex gap-3 align-items-start justify-content-md-end flex-column flex-md-row">
                              <div className="text-muted small text-md-end">
                                <div>
                                  <strong>Character Price:</strong>{" "}
                                  {request.totalPrice.toLocaleString()} VND
                                </div>
                                <div>
                                  <strong>Quantity:</strong> {request.quantity}
                                </div>
                                <div>
                                  Created: {request.createDate || "N/A"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>

            {totalItems > 0 && (
              <Row className="mt-5 align-items-center">
                <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                  <p className="mb-0">
                    Showing <strong>{(page - 1) * itemsPerPage + 1}</strong> to{" "}
                    <strong>{Math.min(page * itemsPerPage, totalItems)}</strong>{" "}
                    of <strong>{totalItems}</strong> results
                  </p>
                </Col>
                <Col xs={12} sm={6} className="d-flex justify-content-end">
                  <Pagination
                    current={page}
                    pageSize={itemsPerPage}
                    total={totalItems}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                  />
                </Col>
              </Row>
            )}
          </>
        )}

        {selectedRequest && (
          <Modal
            show={!!selectedRequest}
            onHide={handleCloseRequestDetail}
            centered
          >
            <Modal.Header closeButton className="modal-header">
              <Modal.Title>{selectedRequest.characterName}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
              <div className="detail-item">
                <Tag size={20} className="icon" />
                <div>
                  <strong>Character Name</strong>
                  <p>{selectedRequest.characterName || "N/A"}</p>
                </div>
              </div>
              <div className="detail-item">
                <User size={20} className="icon" />
                <div>
                  <strong>Cosplayer Name</strong>
                  <p>{selectedRequest.cosplayerName || "N/A"}</p>
                </div>
              </div>
              <div className="detail-item">
                <FileText size={20} className="icon" />
                <div>
                  <strong>Description</strong>
                  <p>{selectedRequest.description || "No description"}</p>
                </div>
              </div>
              <div className="detail-item">
                <Calendar size={20} className="icon" />
                <div>
                  <strong>Request Dates</strong>
                  {selectedRequest.requestDateInCharacterResponses.map(
                    (date, index) => (
                      <div key={date.requestDateId} className="mt-2">
                        <p>
                          <strong>Date {index + 1}:</strong>{" "}
                          {parseDateTime(date.startDate).date}
                        </p>
                        <p>
                          <strong>Time:</strong>{" "}
                          {parseDateTime(date.startDate).time} to{" "}
                          {parseDateTime(date.endDate).time} ({date.totalHour}{" "}
                          hours)
                        </p>
                        <p>
                          <strong>Status:</strong> {getStatusLabel(date.status)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
              <hr className="divider" />
              <div className="detail-grid">
                <div className="detail-item">
                  <Clock size={20} className="icon" />
                  <div>
                    <strong>Created</strong>
                    <p>{selectedRequest.createDate || "N/A"}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Clock size={20} className="icon" />
                  <div>
                    <strong>Updated</strong>
                    <p>{selectedRequest.updateDate || "N/A"}</p>
                  </div>
                </div>
                <div className="detail-item">
                  {selectedRequest.status === 2 ? (
                    <CheckCircle size={20} className="icon-success" />
                  ) : selectedRequest.status === 4 ? (
                    <XCircle size={20} className="icon-error" />
                  ) : (
                    <Tag size={20} className="icon" />
                  )}
                  <div>
                    <strong>Status</strong>
                    <p>{getStatusLabel(selectedRequest.status)}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Tag size={20} className="icon" />
                  <div>
                    <strong>Character Price</strong>
                    <p>{selectedRequest.totalPrice.toLocaleString()} VND</p>
                  </div>
                </div>
              </div>
              {/* Thêm phần cập nhật trạng thái */}
              <div className="mt-4">
                <Form.Group controlId="statusSelect">
                  <Form.Label>
                    <strong>Update Status</strong>
                  </Form.Label>
                  <Form.Select
                    value={selectedStatus ?? selectedRequest.status}
                    onChange={(e) => setSelectedStatus(Number(e.target.value))}
                  >
                    {validStatuses.map((status, index) => (
                      <option key={status} value={index}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button
                  variant="primary"
                  className="mt-2"
                  onClick={handleUpdateStatus}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseRequestDetail}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </div>
  );
};

export default RequestCharacter;
