import React, { useState, useEffect } from "react";
import { Card, Form, Table, Dropdown, Row, Col } from "react-bootstrap";
import { DollarSign } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RevenueService from "../../../services/AdminService/RevenueService";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import "../../../styles/Admin/OrderRevenuePerformancePage.scss";

// Đăng ký các thành phần cần thiết cho Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const OrderRevenuePerformancePage = () => {
  // State cho bộ lọc
  const [filterType, setFilterType] = useState(0); // Mặc định: Today
  const [revenueSource, setRevenueSource] = useState(0); // Mặc định: Order
  // State cho dữ liệu API revenue
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    paymentResponse: [],
  });
  // State cho dữ liệu API biểu đồ
  const [chartData, setChartData] = useState({
    dailyRevenue: [],
    monthlyRevenue: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Các lựa chọn cho dropdown
  const filterTypeOptions = [
    { value: 0, label: "Today" },
    { value: 1, label: "This Week" },
    { value: 2, label: "This Month" },
    { value: 3, label: "This Year" },
  ];

  const revenueSourceOptions = [
    { value: 0, label: "Order" },
    { value: 1, label: "Festival" },
    { value: 2, label: "Service" },
    { value: 3, label: "Total" },
  ];

  // Hàm định dạng giá tiền VND
  const formatPrice = (price) => {
    if (typeof price !== "number" || price == null) return "0 VND";
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Hàm chuyển đổi trạng thái
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Completed";
      case 0:
        return "Pending";
      case 2:
        return "Canceled";
      default:
        return "Unknown";
    }
  };

  // Hàm chuyển đổi mục đích
  const getPurposeText = (purpose) => {
    switch (purpose) {
      case 0:
        return "Order";
      case 1:
        return "Festival";
      case 2:
        return "Service";
      case 3:
        return "Total";
      default:
        return "Unknown";
    }
  };

  // Gọi API revenue
  useEffect(() => {
    const fetchRevenueData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await RevenueService.getRevenue(filterType, revenueSource);
        setRevenueData(data);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRevenueData();
  }, [filterType, revenueSource]);

  // Gọi API biểu đồ (chỉ gọi khi filterType là 1, 2, hoặc 3)
  useEffect(() => {
    if (filterType === 0) {
      setChartData({ dailyRevenue: [], monthlyRevenue: [] });
      return;
    }

    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await RevenueService.getRevenueChart(filterType, revenueSource);
        setChartData({
          dailyRevenue: data.dailyRevenue || [],
          monthlyRevenue: data.monthlyRevenue || [],
        });
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [filterType, revenueSource]);

  // Chuẩn bị dữ liệu cho biểu đồ
  const prepareChartData = () => {
    let labels = [];
    let data = [];

    if (filterType === 1) {
      // This Week: Hiển thị 7 ngày gần nhất
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      labels = days;
      data = new Array(7).fill(0); // Khởi tạo mảng 0
      chartData.dailyRevenue.forEach((item) => {
        const date = new Date(item.date);
        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1; // Chuyển Sunday (0) thành 6, Monday (1) thành 0, ...
        data[dayIndex] = item.totalRevenue || 0;
      });
    } else if (filterType === 2) {
      // This Month: Hiển thị ngày trong tháng
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      data = new Array(daysInMonth).fill(0); // Khởi tạo mảng 0
      chartData.dailyRevenue.forEach((item) => {
        const date = new Date(item.date);
        const day = date.getDate() - 1; // Ngày bắt đầu từ 1
        data[day] = item.totalRevenue || 0;
      });
    } else if (filterType === 3) {
      // This Year: Hiển thị các tháng
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      labels = months;
      data = new Array(12).fill(0); // Khởi tạo mảng 0
      chartData.monthlyRevenue.forEach((item) => {
        const monthIndex = item.month - 1; // Tháng bắt đầu từ 1
        data[monthIndex] = item.totalRevenue || 0;
      });
    }

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
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
          callback: (value) => formatPrice(value).replace(" VND", ""), // Định dạng trục Y
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
          label: (context) => `Revenue: ${formatPrice(context.raw)}`, // Định dạng tooltip
        },
      },
    },
  };

  return (
    <div className="order-revenue">
      <h1>Order & Revenue Performance</h1>

      {/* Bộ lọc */}
      <div className="filters">
        <div className="filter-group">
          <span>Time Range:</span>
          <Dropdown
            onSelect={(value) => setFilterType(Number(value))}
            className="d-inline-block"
          >
            <Dropdown.Toggle variant="secondary" id="dropdown-filter-type">
              {filterTypeOptions.find((opt) => opt.value === filterType)?.label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {filterTypeOptions.map((option) => (
                <Dropdown.Item key={option.value} eventKey={option.value}>
                  {option.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="filter-group">
          <span>Revenue Source:</span>
          <Dropdown
            onSelect={(value) => setRevenueSource(Number(value))}
            className="d-inline-block"
          >
            <Dropdown.Toggle variant="secondary" id="dropdown-revenue-source">
              {revenueSourceOptions.find((opt) => opt.value === revenueSource)?.label}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {revenueSourceOptions.map((option) => (
                <Dropdown.Item key={option.value} eventKey={option.value}>
                  {option.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Hiển thị loading hoặc lỗi */}
      {isLoading && (
        <Box sx={{ width: "100%", marginY: 2 }}>
          <LinearProgress />
        </Box>
      )}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <>
          {/* Tổng doanh thu và biểu đồ */}
          <Row>
            <Col md={12} lg={4}>
              <Card className="total-revenue-card mb-4">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <DollarSign size={48} className="text-success me-3" />
                    <div>
                      <h2>{formatPrice(revenueData.totalRevenue)}</h2>
                      <p className="mb-0">Total Revenue</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={12} lg={8}>
              <Card className="mb-4">
                <Card.Header>
                  <h5>Revenue Trend</h5>
                </Card.Header>
                <Card.Body style={{ height: "300px" }}>
                  {filterType === 0 || (filterType === 1 && chartData.dailyRevenue.length === 0) || (filterType === 2 && chartData.dailyRevenue.length === 0) || (filterType === 3 && chartData.monthlyRevenue.length === 0) ? (
                    <p className="text-muted text-center">No data available for the selected period.</p>
                  ) : (
                    <Line data={prepareChartData()} options={chartOptions} />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Danh sách giao dịch */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Transaction Details</h5>
            </Card.Header>
            <Card.Body>
              {revenueData.paymentResponse.length === 0 ? (
                <p className="text-muted">No transactions found for the selected filters.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">Payment ID</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Purpose</th>
                      <th className="text-center">Amount</th>
                      <th className="text-center">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.paymentResponse.map((payment) => (
                      <tr key={payment.paymentId}>
                        <td className="text-center">{payment.paymentId}</td>
                        <td className="text-center">{getStatusText(payment.status)}</td>
                        <td className="text-center">{getPurposeText(payment.purpose)}</td>
                        <td className="text-center">{formatPrice(payment.amount)}</td>
                        <td className="text-center">
                          {new Date(payment.creatAt).toLocaleString("en-US")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default OrderRevenuePerformancePage;