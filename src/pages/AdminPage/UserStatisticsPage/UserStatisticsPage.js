import React from "react";
import { Card } from "react-bootstrap";
import "../../../styles/Admin/UserStatisticsPage.scss";

const UserStatisticsPage = () => {
  return (
    <div className="user-statistics">
      <h1>User Statistics</h1>
      <Card>
        <Card.Body>
          <p>User statistics and analytics will be displayed here.</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserStatisticsPage;
