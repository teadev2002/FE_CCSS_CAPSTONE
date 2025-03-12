import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js"; // Add required elements
import {
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Users,
  Briefcase,
} from "lucide-react";
import "../../../styles/Admin/DashboardPage.scss";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);
const DashboardPage = () => {
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 15000, 18000, 14000, 20000, 22000],
        borderColor: "#3498db",
        fill: false,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <Row className="stats-cards mb-4">
        <Col md={6} lg={4} xl={2}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <CheckCircle size={24} className="text-success" />
              </div>
              <h3>Completed Contracts</h3>
              <h2>1,284</h2>
              <p className="trend positive">+12.5% from last month</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xl={2}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <Clock size={24} className="text-warning" />
              </div>
              <h3>Pending Contracts</h3>
              <h2>347</h2>
              <p className="trend positive">+4.2% from last month</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xl={2}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <XCircle size={24} className="text-danger" />
              </div>
              <h3>Canceled Contracts</h3>
              <h2>75</h2>
              <p className="trend negative">-2.4% from last month</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xl={2}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <Users size={24} className="text-info" />
              </div>
              <h3>New Sign-ups</h3>
              <h2>385</h2>
              <p className="trend positive">+22.4% from last month</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xl={2}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                <Briefcase size={24} className="text-primary" />
              </div>
              <h3>Active Services</h3>
              <h2>1,748</h2>
              <p className="trend positive">+8.3% from last month</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12} lg={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Revenue Overview</h5>
            </Card.Header>
            <Card.Body>
              <Line data={revenueData} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Today's Revenue</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center">
                <DollarSign size={48} className="text-success me-3" />
                <div>
                  <h2>$8,459</h2>
                  <p className="mb-0">+17.8% from yesterday</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
