import React from "react";
import { Card } from "react-bootstrap";
import "../../../styles/Admin/SystemManagementPage.scss";

const SystemManagementPage = () => {
  return (
    <div className="system-management">
      <h1>System & Management</h1>
      <Card>
        <Card.Body>
          <p>System management settings and controls will be displayed here.</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SystemManagementPage;
