import React from "react";
import { Card } from "react-bootstrap";
import "../../../styles/Admin/OrderRevenuePerformancePage.scss";

const OrderRevenuePerformancePage = () => {
  return (
    <div className="order-revenue">
      <h1>Order & Revenue Performance</h1>
      <Card>
        <Card.Body>
          <p>Order and revenue performance metrics will be displayed here.</p>
        </Card.Body>
      </Card>
    </div>
  );
};
export default OrderRevenuePerformancePage;
