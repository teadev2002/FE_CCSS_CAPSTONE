import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Users,
  Briefcase,
  ShoppingCart,
  Activity,
} from "lucide-react";
import "../../../styles/Admin/DashboardPage.scss";

const DashboardPage = () => {
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <Row className="stats-cards">
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <h3>Total Users</h3>
              <h2>2,543</h2>
              <p className="trend positive">+12.5% from last month</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <DollarSign size={24} />
              </div>
              <h3>Revenue</h3>
              <h2>$21,678</h2>
              <p className="trend positive">+8.2% from last month</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <ShoppingCart size={24} />
              </div>
              <h3>Orders</h3>
              <h2>1,123</h2>
              <p className="trend negative">-2.4% from last month</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <Activity size={24} />
              </div>
              <h3>Active Users</h3>
              <h2>892</h2>
              <p className="trend positive">+5.7% from last month</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
