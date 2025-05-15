// src/pages/AdminOverviewPage.jsx

// Nhập các thư viện và thành phần cần thiết
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

// Đăng ký các thành phần cần thiết cho Chart.js và plugin datalabels
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

// Thành phần chính của trang tổng quan quản trị
const AdminOverviewPage = () => {
  // --- Quản lý trạng thái ---

  // Trạng thái lưu trữ thống kê trạng thái hợp đồng
  const [contractStats, setContractStats] = useState({
    total: 0, // Tổng số hợp đồng
    statuses: [
      { name: "Cancel Contracts", count: 0, statusId: 0 }, // Hợp đồng bị hủy
      { name: "Created Contracts", count: 0, statusId: 1 }, // Hợp đồng đã tạo
      { name: "Deposited Contracts", count: 0, statusId: 2 }, // Hợp đồng đã đặt cọc
      { name: "Final Settlement Contracts", count: 0, statusId: 3 }, // Hợp đồng thanh toán cuối
      { name: "Refund Contracts", count: 0, statusId: 4 }, // Hợp đồng hoàn tiền
      { name: "Completed Contracts", count: 0, statusId: 5 }, // Hợp đồng hoàn thành
      { name: "Feedbacked Contracts", count: 0, statusId: 6 }, // Hợp đồng đã nhận phản hồi
      { name: "Expired Contracts", count: 0, statusId: 7 }, // Hợp đồng hết hạn
      { name: "Refund Overdue Contracts", count: 0, statusId: 8 }, // Hợp đồng hoàn tiền quá hạn
    ],
  });

  // Trạng thái lưu trữ KPIs vận hành
  const [operationalKPIs, setOperationalKPIs] = useState({
    pendingContracts: 0, // Số hợp đồng đang chờ
    completedContracts: 0, // Số hợp đồng đã hoàn thành
    completionRate: "0.00%", // Tỷ lệ hoàn thành
  });

  // Trạng thái lưu trữ hợp đồng theo dịch vụ
  const [contractServices, setContractServices] = useState({
    currentMonth: {
      costumeRental: 0, // Thuê trang phục
      hireCosplayers: 0, // Thuê cosplayer
      eventOrganization: 0, // Tổ chức sự kiện
    },
    lastMonth: {
      costumeRental: 0,
      hireCosplayers: 0,
      eventOrganization: 0,
    },
    trends: {
      costumeRental: "0.00%", // Xu hướng thay đổi thuê trang phục
      hireCosplayers: "0.00%", // Xu hướng thay đổi thuê cosplayer
      eventOrganization: "0.00%", // Xu hướng thay đổi tổ chức sự kiện
    },
  });

  // Trạng thái cho bộ lọc biểu đồ và dữ liệu xu hướng hợp đồng
  const [chartFilter, setChartFilter] = useState("today"); // Bộ lọc hiện tại (today, month, year)
  const [contractTrendData, setContractTrendData] = useState({
    labels: [], // Nhãn trục X (giờ, ngày, tháng)
    datasets: [
      {
        label: "New Contracts", // Tên dữ liệu
        data: [], // Dữ liệu số lượng hợp đồng
        borderColor: "#3498db", // Màu đường viền
        backgroundColor: "rgba(52, 152, 219, 0.1)", // Màu nền
        fill: true, // Điền màu dưới đường
        tension: 0.4, // Độ cong của đường
        pointBackgroundColor: "#fff", // Màu nền điểm
        pointBorderColor: "#3498db", // Màu viền điểm
        pointBorderWidth: 2, // Độ dày viền điểm
      },
    ],
  });

  // --- Cấu hình biểu đồ ---

  // Cấu hình cho biểu đồ đường (Line Chart)
  const chartOptions = {
    maintainAspectRatio: false, // Không giữ tỷ lệ khung hình
    scales: {
      y: {
        beginAtZero: true, // Trục Y bắt đầu từ 0
        grid: {
          color: "rgba(0, 0, 0, 0.05)", // Màu lưới trục Y
        },
        ticks: {
          callback: (value) => value.toLocaleString(), // Định dạng số trên trục Y
        },
      },
      x: {
        grid: {
          display: false, // Ẩn lưới trục X
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Ẩn chú thích
      },
      tooltip: {
        callbacks: {
          label: (context) => `Contracts: ${context.raw}`, // Hiển thị số hợp đồng trong tooltip
        },
      },
    },
  };

  // Cấu hình cho biểu đồ tròn (Pie Chart)
  const pieChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right", // Chú thích ở bên phải
        labels: {
          font: {
            size: 12, // Kích thước chữ chú thích
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw.toLocaleString()}`, // Hiển thị nhãn và số lượng
        },
      },
      datalabels: {
        color: "#fff", // Màu chữ trên biểu đồ
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value) => (value ? value : ""), // Chỉ hiển thị nếu giá trị > 0
      },
    },
  };

  // Dữ liệu cho biểu đồ tròn (phãn bổ trạng thái hợp đồng)
  const pieChartData = {
    labels: contractStats.statuses.map((status) => status.name), // Nhãn là tên trạng thái
    datasets: [
      {
        data: contractStats.statuses.map((status) => status.count), // Dữ liệu là số lượng
        backgroundColor: [
          "#e74c3c", // Cancel Contracts - Đỏ
          "#2ecc71", // Created Contracts - Xanh lá
          "#3498db", // Deposited Contracts - Xanh dương
          "#9b59b6", // Final Settlement Contracts - Tím
          "#f1c40f", // Refund Contracts - Vàng
          "#1abc9c", // Completed Contracts - Xanh ngọc
          "#e67e22", // Feedbacked Contracts - Cam
          "#7f8c8d", // Expired Contracts - Xám
          "#c0392b", // Refund Overdue Contracts - Đỏ đậm
        ],
        borderColor: "#fff", // Màu viền
        borderWidth: 2, // Độ dày viền
      },
    ],
  };

  // Các tùy chọn bộ lọc thời gian cho biểu đồ xu hướng
  const filterTypeOptions = [
    { value: "today", label: "Today", apiFilter: 0 }, // Hôm nay
    { value: "month", label: "This Month", apiFilter: 2 }, // Tháng này
    { value: "year", label: "This Year", apiFilter: 3 }, // Năm này
  ];

  // --- Hàm xử lý logic ---

  // Hàm tính toán thay đổi hợp đồng và phần trăm thay đổi cho phần Contracts by Service
  const calculateServiceStats = (current, last, trend) => {
    const change = current - last; // Tính thay đổi
    const percentage = parseFloat(trend.replace("%", "")); // Chuyển % thành số
    return {
      change, // Số lượng thay đổi
      percentage: Math.abs(percentage).toFixed(2), // Phần trăm thay đổi
      isPositive: percentage >= 0, // Kiểm tra tăng hay giảm
    };
  };

  // Hàm chuyển đổi dữ liệu API thành dữ liệu biểu đồ
  const transformApiData = (apiData, filter) => {
    let labels = []; // Nhãn trục X
    let data = []; // Dữ liệu số lượng

    if (filter === "today") {
      // Xử lý cho bộ lọc "Today" (24 giờ)
      labels = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`); // Tạo nhãn từ 00:00 đến 23:00
      data = Array(24).fill(0); // Khởi tạo mảng 0
      if (Array.isArray(apiData)) {
        // Nếu API trả về mảng dữ liệu
        apiData.forEach((item) => {
          if (item.hour !== undefined && item.count !== undefined) {
            data[item.hour] = item.count; // Gán số lượng tại giờ tương ứng
          }
        });
      } else if (apiData && apiData.hour !== undefined && apiData.count !== undefined) {
        // Nếu API trả về một đối tượng
        data[apiData.hour] = apiData.count;
      }
    } else if (filter === "month") {
      // Xử lý cho bộ lọc "This Month" (30 ngày)
      labels = Array.from({ length: 30 }, (_, i) => (i + 1).toString()); // Tạo nhãn từ 1 đến 30
      data = Array(30).fill(0);
      if (Array.isArray(apiData)) {
        apiData.forEach((item) => {
          if (item.day !== undefined && item.count !== undefined) {
            data[item.day - 1] = item.count; // Gán số lượng tại ngày tương ứng
          }
        });
      } else if (apiData && apiData.day !== undefined && apiData.count !== undefined) {
        data[apiData.day - 1] = apiData.count;
      }
    } else if (filter === "year") {
      // Xử lý cho bộ lọc "This Year" (12 tháng)
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      data = Array(12).fill(0);
      if (Array.isArray(apiData)) {
        apiData.forEach((item) => {
          if (item.month !== undefined && item.count !== undefined) {
            data[item.month - 1] = item.count; // Gán số lượng tại tháng tương ứng
          }
        });
      } else if (apiData && apiData.month !== undefined && apiData.count !== undefined) {
        data[apiData.month - 1] = apiData.count;
      }
    }

    // Trả về dữ liệu biểu đồ
    return {
      labels,
      datasets: [
        {
          label: "New Contracts",
          data,
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#3498db",
          pointBorderWidth: 2,
        },
      ],
    };
  };

  // --- Gọi API và cập nhật dữ liệu ---

  // Gọi API khi component được mount hoặc chartFilter thay đổi
  useEffect(() => {
    // Lấy thống kê trạng thái hợp đồng
    const fetchContractStats = async () => {
      try {
        const statuses = contractStats.statuses;
        let totalContracts = 0;
        const updatedStatuses = await Promise.all(
          statuses.map(async (status) => {
            const response = await AdminOverviewService.getContractsByStatus(status.statusId);
            const count = parseInt(response.match(/\d+/)[0], 10); // Lấy số từ response
            totalContracts += count;
            return { ...status, count };
          })
        );
        setContractStats({ total: totalContracts, statuses: updatedStatuses });
      } catch (error) {
        toast.error("Failed to fetch contract stats"); // Hiển thị thông báo lỗi
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
        toast.error("Failed to fetch completion stats"); // Hiển thị thông báo lỗi
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
            const trendMatch = response.match(/([-\d.]+%)/); // Sửa regex để chấp nhận số âm
            currentMonth[name] = currentMatch ? parseInt(currentMatch[1], 10) : 0;
            lastMonth[name] = lastMatch ? parseInt(lastMatch[1], 10) : 0;
            trends[name] = trendMatch ? trendMatch[1] : "0.00%";
          })
        );
        setContractServices({ currentMonth, lastMonth, trends });
      } catch (error) {
        toast.error("Failed to fetch service stats"); // Hiển thị thông báo lỗi
      }
    };

    // Lấy dữ liệu xu hướng hợp đồng
    const fetchContractTrend = async () => {
      try {
        const filterOption = filterTypeOptions.find((opt) => opt.value === chartFilter); // Lấy tùy chọn bộ lọc
        const response = await AdminOverviewService.getContractTrend(filterOption.apiFilter); // Gọi API
        const chartData = transformApiData(response, chartFilter); // Chuyển đổi dữ liệu
        setContractTrendData(chartData); // Cập nhật dữ liệu biểu đồ
      } catch (error) {
        toast.error("Failed to fetch contract trend data"); // Hiển thị thông báo lỗi
        // Đặt biểu đồ rỗng nếu lỗi
        setContractTrendData({
          labels: [],
          datasets: [
            {
              label: "New Contracts",
              data: [],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#fff",
              pointBorderColor: "#3498db",
              pointBorderWidth: 2,
            },
          ],
        });
      }
    };

    // Gọi tất cả các hàm lấy dữ liệu
    fetchContractStats();
    fetchCompletionStats();
    fetchServiceStats();
    fetchContractTrend();
  }, [chartFilter]); // Chạy lại khi chartFilter thay đổi

  // --- Giao diện người dùng ---

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
                  {isPositive ? "increased" : "decreased"} by {Math.abs(change).toLocaleString()} (
                  {percentage}%)
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
          <Line data={contractTrendData} options={chartOptions} />
        </Card.Body>
      </Card>
    </div>
  );
};

// Xuất component
export default AdminOverviewPage;