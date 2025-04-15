import React, { useState } from "react";
import { Form, Card } from "react-bootstrap";
import { Button, Input } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../../../styles/Manager/TicketCheck.scss";

const TicketCheck = () => {
  // State cho form nhập liệu
  const [formData, setFormData] = useState({
    ticketCode: "",
    quantity: "",
  });

  // State cho tổng vé ban đầu và còn lại (gán cứng tạm thời vì API chưa trả về)
  const [totalInitial, setTotalInitial] = useState(15); // Mock: Tổng vé ban đầu
  const [totalRemaining, setTotalRemaining] = useState(15); // Mock: Tổng vé còn lại

  // State để kiểm tra vé đã hết
  const [isOutOfQuantity, setIsOutOfQuantity] = useState(false);

  // Xử lý khi nhập liệu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsOutOfQuantity(false); // Reset thông báo khi nhập mới
  };

  // Xử lý kiểm tra vé qua API
  const handleCheckTicket = async (e) => {
    e.preventDefault();
    const { ticketCode, quantity } = formData;

    // Validation cơ bản
    if (!ticketCode || !quantity) {
      toast.error("Please enter both ticket code and quantity.");
      return;
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error("Quantity must be a positive number.");
      return;
    }

    try {
      // Gọi API
      const response = await axios.put(
        "https://localhost:7071/api/TicketAccount/Ticketcheck",
        {
          ticketCode: ticketCode.trim(),
          quantity: parsedQuantity,
        }
      );

      // Xử lý response
      if (response.data === "Check Success") {
        toast.success(`Successfully checked ${parsedQuantity} ticket(s) for code ${ticketCode}.`);

        // Giả lập cập nhật quantity vì API hiện lỗi (quantity về 0)
        // Giả sử trừ quantity từ totalRemaining (mock)
        const newRemaining = totalRemaining - parsedQuantity;
        if (newRemaining < 0) {
          toast.error("Not enough tickets remaining.");
          return;
        }
        setTotalRemaining(newRemaining);

        // Nếu quantity còn 0, vô hiệu hóa nút và hiển thị thông báo
        if (newRemaining === 0) {
          setIsOutOfQuantity(true);
        }

        // Reset form
        setFormData({ ticketCode: "", quantity: "" });
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (error) {
      // Xử lý lỗi từ API
      if (error.response) {
        toast.error(error.response.data?.message || "Failed to check ticket.");
        if (error.response.data?.includes("out of quantity")) {
          setIsOutOfQuantity(true);
        }
      } else {
        toast.error("Error connecting to server.");
      }
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
                <Form.Label>Ticket Code</Form.Label>
                <Input
                  type="text"
                  name="ticketCode"
                  value={formData.ticketCode}
                  onChange={handleInputChange}
                  placeholder="Enter ticket code (e.g., nI5VDW)"
                  size="large"
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
                />
              </Form.Group>
              <div className="form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  disabled={isOutOfQuantity}
                >
                  Check Tickets
                </Button>
              </div>
            </Form>
            {isOutOfQuantity && (
              <div className="out-of-quantity">
                Unable to proceed: Ticket quota exhausted.
              </div>
            )}
            <div className="ticket-stats">
              <p>
                <strong>Total Initial Tickets:</strong> {totalInitial}
              </p>
              <p>
                <strong>Total Remaining Tickets:</strong> {totalRemaining}
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default TicketCheck;