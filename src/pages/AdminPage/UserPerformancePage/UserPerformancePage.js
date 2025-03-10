import React from "react";
import { Card } from "react-bootstrap";
import "../../../styles/Admin/UserPerformancePage.scss";

const UserPerformancePage = () => {
  return (
    <div className="user-performance">
      <h1>User Performance</h1>
      <Card>
        <Card.Body>
          <p>User performance metrics and analytics will be displayed here.</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserPerformancePage;
