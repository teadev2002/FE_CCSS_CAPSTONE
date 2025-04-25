import React, { useState, useEffect } from "react";
import { Row, Col, Card as BootstrapCard } from "react-bootstrap";
import { Card, Table, Badge, Spin, Button } from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyEventOrganize.scss";
import MyEventOrganizeService from "../../services/MyEventOrganizeService/MyEventOrganizeService";
import {
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import dayjs from "dayjs";

const formatDate = (date) => {
  if (!date || date === "null" || date === "undefined" || date === "") {
    return "N/A";
  }
  const formats = ["HH:mm DD/MM/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"];
  const parsedDate = dayjs(date, formats, true);
  return parsedDate.isValid()
    ? parsedDate.format("DD/MM/YYYY HH:mm")
    : "Invalid Date";
};

const getStatusBadge = (status) => {
  const statusColors = {
    Pending: "primary",
    Browsed: "success",
    Active: "warning",
    Completed: "success",
  };
  return (
    <Badge
      color={statusColors[status] || "secondary"}
      text={status || "Unknown"}
    />
  );
};

const ViewMyEventOrganize = ({ requestId }) => {
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCharacters, setExpandedCharacters] = useState({});
  const [expandedDates, setExpandedDates] = useState({});

  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) {
        toast.error("Invalid request ID");
        return;
      }
      setLoading(true);
      try {
        const data = await MyEventOrganizeService.getRequestByRequestId(
          requestId
        );
        setRequestData({
          ...data,
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          charactersListResponse: (data.charactersListResponse || []).map(
            (char) => ({
              ...char,
              requestDateResponses: (char.requestDateResponses || []).map(
                (date) => ({
                  ...date,
                  startDate: formatDate(date.startDate),
                  endDate: formatDate(date.endDate),
                })
              ),
            })
          ),
        });
      } catch (error) {
        setError(error.message || "Failed to fetch request details");
        toast.error(error.message || "Failed to fetch request details");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId]);

  const toggleCharacter = (requestCharacterId) => {
    setExpandedCharacters((prev) => ({
      ...prev,
      [requestCharacterId]: !prev[requestCharacterId],
    }));
  };

  const toggleDates = (requestCharacterId) => {
    setExpandedDates((prev) => ({
      ...prev,
      [requestCharacterId]: !prev[requestCharacterId],
    }));
  };

  const dateColumns = [
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "Total Hours",
      dataIndex: "totalHour",
      key: "totalHour",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 0 ? "Pending" : "Unknown"),
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  if (error || !requestData) {
    return <p className="text-danger">{error || "No data available"}</p>;
  }

  return (
    <div className="view-my-event-organize" style={{ overflowX: "hidden" }}>
      <h2 className="mb-4 fw-bold">Event Details: {requestData.name}</h2>

      {/* Summary Section */}
      <BootstrapCard className="shadow mb-4">
        <BootstrapCard.Body>
          <Row className="g-4">
            <Col xs={12}>
              <div className="d-flex align-items-center gap-3">
                <FileText size={24} />
                <h3 className="mb-0">{requestData.name}</h3>
                {getStatusBadge(requestData.status)}
              </div>
            </Col>
            <Col md={6}>
              <p className="mb-2">
                <strong>Description:</strong> {requestData.description || "N/A"}
              </p>
              <p className="mb-2">
                <strong>Price:</strong>{" "}
                {(requestData.price || 0).toLocaleString()} VND
              </p>
              <p className="mb-2">
                <strong>Location:</strong> {requestData.location || "N/A"}
              </p>
              {/* <p className="mb-2">
                <strong>Package ID:</strong> {requestData.packageId || "N/A"}
              </p> */}
            </Col>
            <Col md={6}>
              <p className="mb-2">
                <Calendar size={16} className="me-1" />
                <strong>Start Date:</strong> {requestData.startDate}
              </p>
              <p className="mb-2">
                <Calendar size={16} className="me-1" />
                <strong>End Date:</strong> {requestData.endDate}
              </p>
              <p className="mb-2">
                <strong>Total Days:</strong> {requestData.totalDate || "N/A"}
              </p>
              <p className="mb-2">
                <strong>Deposit:</strong>{" "}
                {requestData.deposit
                  ? `${requestData.deposit}%`
                  : "You need to choose deposit"}
              </p>
            </Col>
          </Row>
        </BootstrapCard.Body>
      </BootstrapCard>

      {/* Characters Section */}
      <h3 className="mb-3">Requested Characters</h3>
      {requestData.charactersListResponse.length > 0 ? (
        <Row className="g-4">
          {requestData.charactersListResponse.map((character) => (
            <Col xs={12} key={character.requestCharacterId}>
              <Card
                className="shadow"
                title={
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      toggleCharacter(character.requestCharacterId)
                    }
                    aria-expanded={
                      expandedCharacters[character.requestCharacterId]
                    }
                    aria-controls={`character-${character.requestCharacterId}`}
                  >
                    {expandedCharacters[character.requestCharacterId] ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                    <span>
                      Character Name: {character.characterName} (Quantity:{" "}
                      {character.quantity})
                    </span>
                  </div>
                }
              >
                {expandedCharacters[character.requestCharacterId] && (
                  <div
                    id={`character-${character.requestCharacterId}`}
                    className="p-3"
                    style={{ overflowX: "hidden" }} // Prevent horizontal scroll
                  >
                    <Row className="g-3">
                      <Col md={6}>
                        <p className="mb-2">
                          <strong>Cosplayer ID:</strong>{" "}
                          {character.cosplayerId || "Not Assign "}
                        </p>
                        <p className="mb-2">
                          <strong>Description:</strong>{" "}
                          {character.description || "N/A"}
                        </p>
                        <p className="mb-2">
                          <strong>Status:</strong> {character.status || "N/A"}
                        </p>
                        <p className="mb-2">
                          <strong>Height Range:</strong> {character.minHeight}-
                          {character.maxHeight} cm
                        </p>
                        <p className="mb-2">
                          <strong>Weight Range:</strong> {character.minWeight}-
                          {character.maxWeight} kg
                        </p>
                      </Col>
                      <Col md={6}>
                        {character.characterImages.length > 0 && (
                          <img
                            src={character.characterImages[0].urlImage}
                            alt={`Character ${character.characterId}`}
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                      </Col>
                    </Row>

                    <div className="mt-3">
                      <Button
                        type="link"
                        onClick={() =>
                          toggleDates(character.requestCharacterId)
                        }
                        aria-expanded={
                          expandedDates[character.requestCharacterId]
                        }
                        aria-controls={`dates-${character.requestCharacterId}`}
                      >
                        {expandedDates[character.requestCharacterId] ? (
                          <>
                            <ChevronUp size={16} /> Hide Time Slots
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} /> Show Time Slots
                          </>
                        )}
                      </Button>
                      {expandedDates[character.requestCharacterId] && (
                        <Table
                          id={`dates-${character.requestCharacterId}`}
                          columns={dateColumns}
                          dataSource={character.requestDateResponses}
                          rowKey="requestDateId"
                          pagination={false}
                          size="small"
                          className="mt-2"
                          scroll={{ x: "max-content" }} // Ensure table fits
                        />
                      )}
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No characters requested.</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default ViewMyEventOrganize;
