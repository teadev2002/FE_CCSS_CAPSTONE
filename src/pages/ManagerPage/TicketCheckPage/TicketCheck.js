import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import { Button, Input, Select } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FestivalService from "../../../services/FestivalService/FestivalService";
import TicketCheckService from "../../../services/ManageServicePages/TicketCheckService/TicketCheckService";
import "../../../styles/Manager/TicketCheck.scss";

const { Option } = Select;

const TicketCheck = () => {
  const [formData, setFormData] = useState({
    ticketCode: "",
    quantity: "",
  });

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [totalInitial, setTotalInitial] = useState(null);
  const [totalRemaining, setTotalRemaining] = useState(null);
  const [isOutOfQuantity, setIsOutOfQuantity] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const data = await FestivalService.getAllFestivals();
        setEvents(data);
      } catch (error) {
        toast.error(error.message || "Failed to load events.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventChange = (value) => {
    setSelectedEvent(value);
    setFormData({ ticketCode: "", quantity: "" });
    setIsOutOfQuantity(false);
    setTotalInitial(null);
    setTotalRemaining(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsOutOfQuantity(false);
  };

  const handleClear = () => {
    setFormData({ ticketCode: "", quantity: "" });
    setIsOutOfQuantity(false);
  };

  const handleCheckTicket = async (e) => {
    e.preventDefault();
    const { ticketCode, quantity } = formData;

    if (!selectedEvent) {
      toast.error("Please select an event.");
      return;
    }
    if (!ticketCode || !quantity) {
      toast.error("Please enter both ticket code and quantity.");
      return;
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error("Quantity must be a positive number.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await TicketCheckService.checkTicket({
        eventId: selectedEvent,
        ticketCode: ticketCode.trim(),
        quantity: parsedQuantity,
      });

      const { notification, totalInitialTickets, totalRemainingTickets } = response;

      switch (notification) {
        case "Check Success":
          toast.success(`Successfully checked ${parsedQuantity} ticket(s) for code ${ticketCode}.`);
          setTotalInitial(totalInitialTickets);
          setTotalRemaining(totalRemainingTickets);
          setFormData({ ticketCode: "", quantity: "" });
          if (totalRemainingTickets === 0) {
            setIsOutOfQuantity(true);
          }
          break;
        case "Ticket not found":
          toast.error("Invalid ticket code or event.");
          break;
        case "exceed ticket capacity":
          toast.error("Not enough tickets remaining.");
          break;
        case "Ticket has expired":
          toast.error("Ticket quota exhausted.");
          setIsOutOfQuantity(true);
          break;
        default:
          toast.error("Unexpected response from server.");
      }
    } catch (error) {
      const errorMessage = error.message;
      switch (errorMessage) {
        case "Ticket not found":
          toast.error("Invalid ticket code or event.");
          break;
        case "Ticket has expired":
          toast.error("Ticket quota exhausted.");
          setIsOutOfQuantity(true);
          break;
        case "exceed ticket capacity":
          toast.error("Not enough tickets remaining.");
          break;
        default:
          toast.error(errorMessage || "Failed to check ticket.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ticket-check">
      <h2 className="ticket-check-title">Ticket Check</h2>
      <div className="form-container">
        <Card className="ticket-check-card">
          <Card.Body>
            <div className="form-header">
              <h3>Check Event Tickets</h3>
            </div>
            <Form onSubmit={handleCheckTicket}>
              <Form.Group className="mb-3">
                <Form.Label>Select Event</Form.Label>
                <Select
                  placeholder="Choose an event"
                  value={selectedEvent}
                  onChange={handleEventChange}
                  size="large"
                  style={{ width: "100%" }}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {events.map((event) => (
                    <Option key={event.eventId} value={event.eventId}>
                      {event.eventName}
                    </Option>
                  ))}
                </Select>
              </Form.Group>
              {selectedEvent && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Ticket Code</Form.Label>
                    <Input
                      type="text"
                      name="ticketCode"
                      value={formData.ticketCode}
                      onChange={handleInputChange}
                      placeholder="Enter ticket code (e.g., nI5VDW)"
                      size="large"
                      disabled={isLoading}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <Input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Enter quantity (e.g., 2)"
                      size="large"
                      min="1"
                      disabled={isLoading}
                    />
                  </Form.Group>
                  <div className="form-actions">
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      disabled={isOutOfQuantity || isLoading}
                      style={{
                        padding: "5px 12px", // Chỉnh kích thước nút Check Tickets tại đây
                        fontSize: "14px", // Có thể tăng font-size, ví dụ: "16px"
                        borderRadius: "4px",
                        background: "linear-gradient(135deg, #510545, #22668a)",
                        border: "none",
                        color: "#fff",
                        marginRight: "10px",
                      }}
                      loading={isLoading}
                      onMouseEnter={(e) => (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")}
                      onMouseLeave={(e) => (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")}
                    >
                      Check Tickets
                    </Button>
                    <Button
                      type="default"
                      size="large"
                      onClick={handleClear}
                      disabled={isLoading}
                      style={{
                        padding: "5px 12px", // Chỉnh kích thước nút Clear tại đây
                        fontSize: "14px", // Có thể tăng font-size, ví dụ: "16px"
                        borderRadius: "4px",
                        background: "#e0e0e0",
                        border: "none",
                        color: "#333",
                      }}
                      onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
                      onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
                    >
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </Form>
            {selectedEvent && totalInitial !== null && totalRemaining !== null && (
              <div className="ticket-stats">
                <p>
                  <strong>Total Initial Tickets:</strong> {totalInitial}
                </p>
                <p>
                  <strong>Total Remaining Tickets:</strong> {totalRemaining}
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TicketCheck;