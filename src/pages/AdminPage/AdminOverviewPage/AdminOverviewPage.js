import React, { useState } from "react";
import { Card, Row, Col, Dropdown } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import {
  Briefcase,
  XCircle,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Star,
} from "lucide-react";
import "../../../styles/Admin/AdminOverviewPage.scss";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const AdminOverviewPage = () => {
  // Tổng số hợp đồng và theo trạng thái
  const contractStats = {
    total: 3200,
    statuses: [
      { name: "Cancel", count: 150 },
      { name: "Created", count: 400 },
      { name: "Deposited", count: 350 },
      { name: "FinalSettlement", count: 300 },
      { name: "Refund", count: 100 },
      { name: "Completed", count: 1284 },
      { name: "Feedbacked", count: 500 },
      { name: "Expired", count: 116 },
    ],
  };

  // KPIs vận hành
  const operationalKPIs = {
    pendingContracts: 750, // Created + Deposited
    completionRate: "85%", // (Completed / Total) * 100
    avgProcessingTime: "2.5 days",
  };

  // Số hợp đồng theo dịch vụ
  const contractServices = {
    currentMonth: {
      costumeRental: 200,
      hireCosplayers: 300,
      eventOrganization: 100,
    },
    lastMonth: {
      costumeRental: 190,
      hireCosplayers: 270,
      eventOrganization: 102,
    },
    trends: {
      costumeRental: "+5.3%",
      hireCosplayers: "+11.1%",
      eventOrganization: "-2.0%",
    },
  };

  // Biểu đồ xu hướng hợp đồng
  const [chartFilter, setChartFilter] = useState("today");
  const contractTrendData = {
    today: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      datasets: [
        {
          label: "New Contracts",
          data: [10, 20, 15, 30, 25, 20],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#3498db",
          pointBorderWidth: 2,
        },
      ],
    },
    month: {
      labels: ["1", "5", "10", "15", "20", "25", "30"],
      datasets: [
        {
          label: "New Contracts",
          data: [50, 70, 60, 80, 100, 120, 110],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#3498db",
          pointBorderWidth: 2,
        },
      ],
    },
    year: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "New Contracts",
          data: [200, 250, 300, 280, 320, 350, 400, 380, 360, 340, 320, 300],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#3498db",
          pointBorderWidth: 2,
        },
      ],
    },
  };

  // Tùy chọn biểu đồ
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Contracts: ${context.raw}`,
        },
      },
    },
  };

  const filterTypeOptions = [
    { value: "today", label: "Today" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  return (
    <div className="admin-overview">
      <h1>Admin Overview</h1>

      {/* Tổng quan hợp đồng */}
      <div className="contract-stats">
        <Card className="stat-card main-stat">
          <Card.Body>
            <div className="stat-icon">
              <Briefcase size={24} />
            </div>
            <h3>Total Contracts</h3>
            <h2>{contractStats.total.toLocaleString()}</h2>
          </Card.Body>
        </Card>

        {contractStats.statuses.map((status, index) => (
          <Card key={index} className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                {status.name === "Cancel" && <XCircle size={24} />}
                {status.name === "Created" && <Clock size={24} />}
                {status.name === "Deposited" && <DollarSign size={24} />}
                {status.name === "FinalSettlement" && <DollarSign size={24} />}
                {status.name === "Refund" && <DollarSign size={24} />}
                {status.name === "Completed" && <CheckCircle size={24} />}
                {status.name === "Feedbacked" && <Star size={24} />}
                {status.name === "Expired" && <Clock size={24} />}
              </div>
              <h3>{status.name} Contracts</h3>
              <h2>{status.count.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Thống kê KPIs vận hành */}
      <Row className="quick-stats">
        <Col lg={4}>
          <Card className="stat-card quick-stat">
            <Card.Body>
              <div className="stat-icon">
                <Clock size={24} />
              </div>
              <h3>Pending Contracts</h3>
              <h2>{operationalKPIs.pendingContracts.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="stat-card quick-stat">
            <Card.Body>
              <div className="stat-icon">
                <CheckCircle size={24} />
              </div>
              <h3>Completion Rate</h3>
              <h2>{operationalKPIs.completionRate}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="stat-card quick-stat">
            <Card.Body>
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <h3>Avg. Processing Time</h3>
              <h2>{operationalKPIs.avgProcessingTime}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Số hợp đồng theo dịch vụ */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Contracts by Service</h5>
        </Card.Header>
        <Card.Body>
          <p>
            Costume Rental: {contractServices.currentMonth.costumeRental.toLocaleString()}{" "}
            <span className="trend positive">{contractServices.trends.costumeRental}</span>
          </p>
          <p>
            Hire Cosplayers: {contractServices.currentMonth.hireCosplayers.toLocaleString()}{" "}
            <span className="trend positive">{contractServices.trends.hireCosplayers}</span>
          </p>
          <p>
            Event Organization: {contractServices.currentMonth.eventOrganization.toLocaleString()}{" "}
            <span
              className={
                contractServices.trends.eventOrganization.startsWith("-")
                  ? "trend negative"
                  : "trend positive"
              }
            >
              {contractServices.trends.eventOrganization}
            </span>
          </p>
          <p className="note">See detailed service usage in User Analytics</p>
        </Card.Body>
      </Card>

      {/* Biểu đồ xu hướng hợp đồng */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>Contract Creation Trend</h5>
          <Dropdown onSelect={(value) => setChartFilter(value)}>
            <Dropdown.Toggle variant="secondary" id="dropdown-chart-filter">
              {filterTypeOptions.find((opt) => opt.value === chartFilter)?.label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {filterTypeOptions.map((option) => (
                <Dropdown.Item key={option.value} eventKey={option.value}>
                  {option.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>
        <Card.Body style={{ height: "300px" }}>
          <Line data={contractTrendData[chartFilter]} options={chartOptions} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminOverviewPage;