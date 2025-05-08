import React, { useState, useEffect } from "react";
import { Card, Row, Col, Dropdown } from "react-bootstrap";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Plugin để hiển thị số lượng trên biểu đồ tròn
import {
  Briefcase,
  XCircle,
  Clock,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Star,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import AdminOverviewService from "../../../services/AdminService/AdminOverviewService";
import "../../../styles/Admin/AdminOverviewPage.scss";

// Đăng ký các thành phần Chart.js và plugin datalabels
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const AdminOverviewPage = () => {
  // State lưu trữ thống kê trạng thái hợp đồng
  const [contractStats, setContractStats] = useState({
    total: 0,
    statuses: [
      { name: "Cancel Contracts", count: 0, statusId: 0 },
      { name: "Created Contracts", count: 0, statusId: 1 },
      { name: "Deposited Contracts", count: 0, statusId: 2 },
      { name: "Final Settlement Contracts", count: 0, statusId: 3 },
      { name: "Refund Contracts", count: 0, statusId: 4 },
      { name: "Completed Contracts", count: 0, statusId: 5 },
      { name: "Feedbacked Contracts", count: 0, statusId: 6 },
      { name: "Expired Contracts", count: 0, statusId: 7 },
      { name: "Refund Overdue Contracts", count: 0, statusId: 8 },
    ],
  });

  // State lưu trữ KPIs vận hành
  const [operationalKPIs, setOperationalKPIs] = useState({
    pendingContracts: 0,
    completedContracts: 0,
    completionRate: "0.00%",
  });

  // State lưu trữ hợp đồng theo dịch vụ
  const [contractServices, setContractServices] = useState({
    currentMonth: {
      costumeRental: 0,
      hireCosplayers: 0,
      eventOrganization: 0,
    },
    lastMonth: {
      costumeRental: 0,
      hireCosplayers: 0,
      eventOrganization: 0,
    },
    trends: {
      costumeRental: "0.00%",
      hireCosplayers: "0.00%",
      eventOrganization: "0.00%",
    },
  });

  // State cho bộ lọc biểu đồ xu hướng hợp đồng
  const [chartFilter, setChartFilter] = useState("today");

  // Dữ liệu giả cho biểu đồ xu hướng hợp đồng (theo ngày, tháng, năm)
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

  // Cấu hình tùy chọn cho biểu đồ đường (Line Chart)
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

  // Cấu hình tùy chọn cho biểu đồ tròn (Pie Chart)
  const pieChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toLocaleString()}`,
        },
      },
      datalabels: {
        // Hiển thị số lượng trên mỗi phần của biểu đồ tròn
        color: "#fff",
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value) => (value ? value : ""), // Chỉ hiển thị nếu giá trị > 0
      },
    },
  };

  // Dữ liệu cho biểu đồ tròn với các màu sắc khác biệt rõ ràng
  const pieChartData = {
    labels: contractStats.statuses.map((status) => status.name),
    datasets: [
      {
        data: contractStats.statuses.map((status) => status.count),
        backgroundColor: [
          "#e74c3c", // Cancel Contracts - Đỏ tươi
          "#2ecc71", // Created Contracts - Xanh lá
          "#3498db", // Deposited Contracts - Xanh dương
          "#9b59b6", // Final Settlement Contracts - Tím
          "#f1c40f", // Refund Contracts - Vàng
          "#1abc9c", // Completed Contracts - Xanh ngọc
          "#e67e22", // Feedbacked Contracts - Cam
          "#7f8c8d", // Expired Contracts - Xám
          "#c0392b", // Refund Overdue Contracts - Đỏ đậm
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  // Các tùy chọn bộ lọc thời gian cho biểu đồ xu hướng
  const filterTypeOptions = [
    { value: "today", label: "Today" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  // Hàm tính toán thay đổi hợp đồng và phần trăm thay đổi cho phần Contracts by Service
  const calculateServiceStats = (current, last, trend) => {
    const change = current - last;
    const percentage = parseFloat(trend.replace("%", ""));
    return {
      change,
      percentage: Math.abs(percentage).toFixed(2),
      isPositive: percentage >= 0,
    };
  };

  // Gọi API khi component được mount để lấy dữ liệu
  useEffect(() => {
    // Lấy thống kê trạng thái hợp đồng
    const fetchContractStats = async () => {
      try {
        const statuses = contractStats.statuses;
        let totalContracts = 0;
        const updatedStatuses = await Promise.all(
          statuses.map(async (status) => {
            const response = await AdminOverviewService.getContractsByStatus(status.statusId);
            const count = parseInt(response.match(/\d+/)[0], 10);
            totalContracts += count;
            return { ...status, count };
          })
        );
        setContractStats({ total: totalContracts, statuses: updatedStatuses });
      } catch (error) {
        toast.error("Failed to fetch contract stats");
      }
    };

    // Lấy thống kê tỷ lệ hoàn thành hợp đồng
    const fetchCompletionStats = async () => {
      try {
        const response = await AdminOverviewService.getContractCompletionStats();
        const pendingMatch = response.match(/Number of Pending Contract: (\d+)/);
        const completedMatch = response.match(/Number of Completed Contract: (\d+)/);
        const percentMatch = response.match(/Percent Completed: ([\d.]+%)/);
        setOperationalKPIs({
          pendingContracts: pendingMatch ? parseInt(pendingMatch[1], 10) : 0,
          completedContracts: completedMatch ? parseInt(completedMatch[1], 10) : 0,
          completionRate: percentMatch ? percentMatch[1] : "0.00%",
        });
      } catch (error) {
        toast.error("Failed to fetch completion stats");
      }
    };

    // Lấy thống kê hợp đồng theo dịch vụ
    const fetchServiceStats = async () => {
      try {
        const services = [
          { id: "S001", name: "costumeRental" },
          { id: "S002", name: "hireCosplayers" },
          { id: "S003", name: "eventOrganization" },
        ];
        const currentMonth = {};
        const lastMonth = {};
        const trends = {};
        await Promise.all(
          services.map(async ({ id, name }) => {
            const response = await AdminOverviewService.getContractsByService(id);
            const currentMatch = response.match(/Số hợp đồng với dịch vụ '[^']+': (\d+)/);
            const lastMatch = response.match(/tháng trước: (\d+)/);
            const trendMatch = response.match(/([\d.]+%)/);
            currentMonth[name] = currentMatch ? parseInt(currentMatch[1], 10) : 0;
            lastMonth[name] = lastMatch ? parseInt(lastMatch[1], 10) : 0;
            trends[name] = trendMatch ? trendMatch[1] : "0.00%";
          })
        );
        setContractServices({ currentMonth, lastMonth, trends });
      } catch (error) {
        toast.error("Failed to fetch service stats");
      }
    };

    fetchContractStats();
    fetchCompletionStats();
    fetchServiceStats();
  }, []);

  return (
    <div className="admin-overview">
      {/* Tiêu đề trang */}
      <h1>Admin Overview</h1>

      {/* Phần thống kê tổng quan hợp đồng */}
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

        {/* Hiển thị từng trạng thái hợp đồng */}
        {contractStats.statuses.map((status, index) => (
          <Card key={index} className="stat-card">
            <Card.Body>
              <div className="stat-icon">
                {status.name === "Cancel Contracts" && <XCircle size={24} />}
                {status.name === "Created Contracts" && <Clock size={24} />}
                {status.name === "Deposited Contracts" && <DollarSign size={24} />}
                {status.name === "Final Settlement Contracts" && <DollarSign size={24} />}
                {status.name === "Refund Contracts" && <DollarSign size={24} />}
                {status.name === "Completed Contracts" && <CheckCircle size={24} />}
                {status.name === "Feedbacked Contracts" && <Star size={24} />}
                {status.name === "Expired Contracts" && <Clock size={24} />}
                {status.name === "Refund Overdue Contracts" && <AlertTriangle size={24} />}
              </div>
              <h3>{status.name}</h3>
              <h2>{status.count.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Biểu đồ tròn hiển thị phân bổ trạng thái hợp đồng */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Contract Status Distribution</h5>
        </Card.Header>
        <Card.Body style={{ height: "300px" }}>
          <Pie data={pieChartData} options={pieChartOptions} />
        </Card.Body>
      </Card>

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
              <h3>Completed Contracts</h3>
              <h2>{operationalKPIs.completedContracts.toLocaleString()}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="stat-card quick-stat">
            <Card.Body>
              <div className="stat-icon">
                <TrendingUp size={24} />
              </div>
              <h3>Completion Rate</h3>
              <h2>{operationalKPIs.completionRate}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Phần hiển thị hợp đồng theo dịch vụ */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Contracts by Service</h5>
        </Card.Header>
        <Card.Body>
          {[
            { name: "Costume Rental", key: "costumeRental" },
            { name: "Hire Cosplayers", key: "hireCosplayers" },
            { name: "Event Organization", key: "eventOrganization" },
          ].map((service, index) => {
            const { change, percentage, isPositive } = calculateServiceStats(
              contractServices.currentMonth[service.key],
              contractServices.lastMonth[service.key],
              contractServices.trends[service.key]
            );
            return (
              <p key={index}>
                <strong>{service.name}: </strong>
                {contractServices.currentMonth[service.key].toLocaleString()} contracts
                {", last month: "}
                {contractServices.lastMonth[service.key].toLocaleString()}
                {", "}
                <span className={isPositive ? "trend positive" : "trend negative"}>
                  {isPositive ? "increased" : "decreased"} by {Math.abs(change).toLocaleString()}{" "}
                  ({percentage}%)
                </span>
              </p>
            );
          })}
          <p className="note">See detailed service usage in User Analytics</p>
        </Card.Body>
      </Card>

      {/* Biểu đồ xu hướng tạo hợp đồng */}
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