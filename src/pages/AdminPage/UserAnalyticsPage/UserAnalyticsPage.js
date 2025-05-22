import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, ProgressBar, Dropdown } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Star, Award, Users as UsersIcon } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserAnalyticsService from "../../../services/AdminService/UserAnalyticsService";
import "../../../styles/Admin/UserAnalyticsPage.scss";

// Đăng ký các thành phần cần thiết cho Chart.js
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

// Component trang phân tích người dùng
const UserAnalyticsPage = () => {
  // --- Quản lý trạng thái ---

  // Trạng thái cho tổng số tài khoản
  const [totalAccounts, setTotalAccounts] = useState({
    total: 0,
    customers: 0,
    cosplayers: 0,
    consultants: 0,
    managers: 0,
    admins: 0,
  });

  // Trạng thái cho điểm trung bình của cosplayer
  const [averageCosplayerRating, setAverageCosplayerRating] = useState(0);

  // Trạng thái cho sử dụng dịch vụ
  const [serviceUsage, setServiceUsage] = useState({
    customers: {
      costumeRental: 0,
      hireCosplayers: 0,
      eventOrganization: 0,
      buySouvenirs: 0,
      buyFestivalTickets: 0,
    },
  });

  // Trạng thái cho bộ lọc biểu đồ xu hướng sử dụng dịch vụ
  const [usageFilter, setUsageFilter] = useState("today");

  // Dữ liệu cho biểu đồ xu hướng sử dụng dịch vụ
  const [usageChartData, setUsageChartData] = useState({
    today: { labels: [], datasets: [] },
    month: { labels: [], datasets: [] },
    year: { labels: [], datasets: [] },
  });

  // Trạng thái cho Top 5 Accounts
  const [topAccounts, setTopAccounts] = useState([]);

  // Dữ liệu giả lập cho Top 5 khách hàng sử dụng dịch vụ nhiều nhất
  const topCustomersByUsage = [
    {
      id: 1,
      name: "Sarah Chen",
      servicesUsed: {
        costumeRental: 50,
        hireCosplayers: 80,
        eventOrganization: 26,
        buySouvenirs: 15,
        buyFestivalTickets: 10,
      },
      membership: "VIP",
    },
    {
      id: 2,
      name: "Viết Quốc",
      servicesUsed: {
        costumeRental: 60,
        hireCosplayers: 70,
        eventOrganization: 12,
        buySouvenirs: 20,
        buyFestivalTickets: 8,
      },
      membership: "VIP",
    },
    {
      id: 3,
      name: "Emily Watson",
      servicesUsed: {
        costumeRental: 40,
        hireCosplayers: 60,
        eventOrganization: 30,
        buySouvenirs: 10,
        buyFestivalTickets: 5,
      },
      membership: "Premium",
    },
    {
      id: 4,
      name: "Hoàng Nguyễn",
      servicesUsed: {
        costumeRental: 45,
        hireCosplayers: 50,
        eventOrganization: 30,
        buySouvenirs: 12,
        buyFestivalTickets: 7,
      },
      membership: "Premium",
    },
    {
      id: 5,
      name: "Lisa Tran",
      servicesUsed: {
        costumeRental: 30,
        hireCosplayers: 60,
        eventOrganization: 20,
        buySouvenirs: 8,
        buyFestivalTickets: 3,
      },
      membership: "Standard",
    },
  ];

  // Ánh xạ mã vai trò (roleId) với tên vai trò
  const roleMapping = {
    R001: "admins",
    R002: "managers",
    R003: "consultants",
    R004: "cosplayers",
    R005: "customers",
  };

  // --- Cấu hình biểu đồ ---

  // Cấu hình cho biểu đồ đường
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0, 0, 0, 0.05)" },
        ticks: { callback: (value) => value.toLocaleString() },
      },
      x: { grid: { display: false } },
    },
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()}`,
        },
      },
    },
  };

  // Các tùy chọn bộ lọc thời gian cho biểu đồ xu hướng
  const filterTypeOptions = [
    { value: "today", label: "Today" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  // --- Hàm xử lý logic ---

  // Định dạng giá thuê cosplayer
  const formatHourlyRate = (rate) => {
    return `${rate.toLocaleString("vi-VN")}/h VND`;
  };

  // Định dạng giá tiền VND
  const formatPrice = (price) => {
    if (typeof price !== "number" || price == null) return "0 VND";
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Lấy URL avatar từ accountImages
  const getAvatarUrl = (accountImages) => {
    if (!Array.isArray(accountImages) || accountImages.length === 0) {
      return "https://via.placeholder.com/40"; // Placeholder image
    }
    const avatarImage = accountImages.find((img) => img.isAvatar) || accountImages[0];
    return avatarImage.urlImage || "https://via.placeholder.com/40";
  };

  // Lấy dữ liệu sử dụng dịch vụ từ API
  const fetchServiceUsage = async () => {
    try {
      // Lấy dữ liệu Costume Rental (S001)
      const costumeContracts = await UserAnalyticsService.getContractsByService("S001");
      const costumeCount = Array.isArray(costumeContracts) ? costumeContracts.length : 1;

      // Lấy dữ liệu Hire Cosplayers (S002)
      const cosplayerContracts = await UserAnalyticsService.getContractsByService("S002");
      const cosplayerCount = Array.isArray(cosplayerContracts) ? cosplayerContracts.length : 1;

      // Lấy dữ liệu Event Organization (S003)
      const eventContracts = await UserAnalyticsService.getContractsByService("S003");
      const eventCount = Array.isArray(eventContracts) ? eventContracts.length : 1;

      // Lấy dữ liệu Buy Souvenirs
      const orders = await UserAnalyticsService.getAllOrders();
      const souvenirCount = Array.isArray(orders) ? orders.length : 1;

      // Lấy dữ liệu Buy Festival Tickets
      const ticketPayments = await UserAnalyticsService.getAllTicketPayments();
      const ticketCount = Array.isArray(ticketPayments) ? ticketPayments.length : 1;

      // Cập nhật state
      setServiceUsage({
        customers: {
          costumeRental: costumeCount,
          hireCosplayers: cosplayerCount,
          eventOrganization: eventCount,
          buySouvenirs: souvenirCount,
          buyFestivalTickets: ticketCount,
        },
      });
    } catch (error) {
      toast.error(error.message || "Failed to load service usage data");
    }
  };

  // Lấy dữ liệu xu hướng sử dụng dịch vụ từ API
  const fetchServiceUsageTrends = async () => {
    try {
      const filterTypes = [
        { key: "today", filterType: 0 },
        { key: "month", filterType: 2 },
        { key: "year", filterType: 3 },
      ];

      const newChartData = {};

      for (const { key, filterType } of filterTypes) {
        // Labels cho biểu đồ
        let labels;
        if (key === "today") {
          labels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
        } else if (key === "month") {
          labels = ["1", "5", "10", "15", "20", "25", "30"];
        } else if (key === "year") {
          labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        }

        // Dữ liệu cho Costume Rental
        const costumeData = await UserAnalyticsService.getContractsByServiceAndDate("S001", filterType);
        const costumeCounts = Array.isArray(costumeData)
          ? costumeData.map((item) => item.count)
          : [costumeData.count];

        // Dữ liệu cho Hire Cosplayers
        const cosplayerData = await UserAnalyticsService.getContractsByServiceAndDate("S002", filterType);
        const cosplayerCounts = Array.isArray(cosplayerData)
          ? cosplayerData.map((item) => item.count)
          : [cosplayerData.count];

        // Dữ liệu cho Event Organization
        const eventData = await UserAnalyticsService.getContractsByServiceAndDate("S003", filterType);
        const eventCounts = Array.isArray(eventData)
          ? eventData.map((item) => item.count)
          : [eventData.count];

        // Dữ liệu cho Buy Souvenirs
        const souvenirData = await UserAnalyticsService.getOrdersByDate(filterType);
        const souvenirCounts = Array.isArray(souvenirData)
          ? souvenirData.map((item) => item.count)
          : [souvenirData.count];

        // Dữ liệu cho Buy Festival Tickets
        const ticketData = await UserAnalyticsService.getTicketPaymentsByDate(filterType);
        const ticketCounts = Array.isArray(ticketData)
          ? ticketData.map((item) => item.count)
          : [ticketData.count];

        // Cập nhật datasets
        newChartData[key] = {
          labels,
          datasets: [
            {
              label: "Costume Rental",
              data: costumeCounts,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Hire Cosplayers",
              data: cosplayerCounts,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Event Organization",
              data: eventCounts,
              borderColor: "#f1c40f",
              backgroundColor: "rgba(241, 196, 15, 0.1)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Buy Souvenirs",
              data: souvenirCounts,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Buy Festival Tickets",
              data: ticketCounts,
              borderColor: "#9b59b6",
              backgroundColor: "rgba(155, 89, 182, 0.1)",
              fill: true,
              tension: 0.4,
            },
          ],
        };
      }

      setUsageChartData(newChartData);
    } catch (error) {
      toast.error(error.message || "Failed to load service usage trends");
    }
  };

  // --- Gọi API ---

  // Lấy dữ liệu tổng số tài khoản và điểm trung bình cosplayer
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const roles = ["R001", "R002", "R003", "R004", "R005"];
        const fetchedAccounts = {
          admins: [],
          managers: [],
          consultants: [],
          cosplayers: [],
          customers: [],
        };
        const counts = {
          admins: 0,
          managers: 0,
          consultants: 0,
          cosplayers: 0,
          customers: 0,
        };

        for (const roleId of roles) {
          const data = await UserAnalyticsService.getAccountsByRole(roleId);
          const roleKey = roleMapping[roleId];
          fetchedAccounts[roleKey] = Array.isArray(data) ? data : [data];
          counts[roleKey] = fetchedAccounts[roleKey].length;
        }

        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        const cosplayerRatings = fetchedAccounts.cosplayers
          .filter((cosplayer) => cosplayer.averageStar !== null)
          .map((cosplayer) => cosplayer.averageStar);
        const avgRating =
          cosplayerRatings.length > 0
            ? cosplayerRatings.reduce((sum, rating) => sum + rating, 0) / cosplayerRatings.length
            : 0;

        setTotalAccounts({
          total,
          customers: counts.customers,
          cosplayers: counts.cosplayers,
          consultants: counts.consultants,
          managers: counts.managers,
          admins: counts.admins,
        });
        setAverageCosplayerRating(avgRating.toFixed(1));
      } catch (error) {
        toast.error(error.message || "Failed to load account data");
      }
    };

    fetchAccounts();
  }, []);

  // Lấy dữ liệu Top 5 Accounts
  useEffect(() => {
    const fetchTopAccounts = async () => {
      try {
        const data = await UserAnalyticsService.getTopAccounts();
        setTopAccounts(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch (error) {
        toast.error(error.message || "Failed to load top accounts");
        setTopAccounts([]);
      }
    };

    fetchTopAccounts();
  }, []);

  // Lấy dữ liệu sử dụng dịch vụ và xu hướng
  useEffect(() => {
    fetchServiceUsage();
    fetchServiceUsageTrends();
  }, []);

  // --- Giao diện người dùng ---

  return (
    <div className="user-analytics">
      <h1>User Analytics</h1>

      {/* Phần thống kê tổng quan */}
      <div className="overview-stats">
        <Card className="stat-card">
          <Card.Body>
            <div className="stat-icon">
              <UsersIcon size={24} />
            </div>
            <h3>Total Accounts</h3>
            <h2>{totalAccounts.total.toLocaleString()}</h2>
            <p>Customers: {totalAccounts.customers.toLocaleString()}</p>
            <p>Cosplayers: {totalAccounts.cosplayers.toLocaleString()}</p>
            <p>Consultants: {totalAccounts.consultants.toLocaleString()}</p>
            <p>Managers: {totalAccounts.managers.toLocaleString()}</p>
            <p>Admins: {totalAccounts.admins.toLocaleString()}</p>
          </Card.Body>
        </Card>
        <Card className="stat-card">
          <Card.Body>
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <h3>Average Cosplayer Rating</h3>
            <div className="rating-display">
              <h2>{averageCosplayerRating}</h2>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(averageCosplayerRating)
                        ? "star-filled"
                        : "star-empty"
                    }
                  />
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Phần Top 5 Accounts */}
      <Row>
        <Col lg={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Top 5 Accounts</h5>
            </Card.Header>
            <Card.Body>
              {topAccounts.length === 0 ? (
                <p className="text-muted">No accounts found.</p>
              ) : (
                <Table responsive>
                  <thead>
                    <tr>
                      <th className="text-center">Rank</th>
                      <th className="text-center">Avatar</th>
                      <th className="text-center">Account ID</th>
                      <th className="text-center">Full Name</th>
                      <th className="text-center">Total Contracts</th>
                      <th className="text-center">Total Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topAccounts.map((account, index) => (
                      <tr key={account.accountId}>
                        <td className="text-center">#{index + 1}</td>
                        <td className="text-center">
                          <img
                            src={getAvatarUrl(account.accountImages)}
                            alt="Avatar"
                            className="avatar-image"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td className="text-center">{account.accountId}</td>
                        <td className="text-center">{account.fullName}</td>
                        <td className="text-center">{account.totalContracts}</td>
                        <td className="text-center">{formatPrice(account.totalPaymentAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Phần sử dụng dịch vụ theo khách hàng */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Service Usage by Customers</h5>
        </Card.Header>
        <Card.Body>
          <div className="service-usage-item">
            <div className="d-flex justify-content-between mb-1">
              <span>Costume Rental</span>
              <span>{serviceUsage.customers.costumeRental.toLocaleString()}</span>
            </div>
            <ProgressBar now={35} variant="success" />
          </div>
          <div className="service-usage-item">
            <div className="d-flex justify-content-between mb-1">
              <span>Hire Cosplayers</span>
              <span>{serviceUsage.customers.hireCosplayers.toLocaleString()}</span>
            </div>
            <ProgressBar now={45} variant="info" />
          </div>
          <div className="service-usage-item">
            <div className="d-flex justify-content-between mb-1">
              <span>Event Organization</span>
              <span>{serviceUsage.customers.eventOrganization.toLocaleString()}</span>
            </div>
            <ProgressBar now={20} variant="warning" />
          </div>
          <div className= "service-usage-item">
            <div className="d-flex justify-content-between mb-1">
              <span>Buy Souvenirs</span>
              <span>{serviceUsage.customers.buySouvenirs.toLocaleString()}</span>
            </div>
            <ProgressBar now={15} variant="danger" />
          </div>
          <div className="service-usage-item">
            <div className="d-flex justify-content-between mb-1">
              <span>Buy Festival Tickets</span>
              <span>{serviceUsage.customers.buyFestivalTickets.toLocaleString()}</span>
            </div>
            <ProgressBar now={10} variant="purple" />
          </div>
        </Card.Body>
      </Card>

      {/* Biểu đồ xu hướng sử dụng dịch vụ */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>Service Usage Trend</h5>
          <Dropdown onSelect={(value) => setUsageFilter(value)}>
            <Dropdown.Toggle variant="secondary" id="dropdown-usage-filter">
              {filterTypeOptions.find((opt) => opt.value === usageFilter)?.label}
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
          <Line data={usageChartData[usageFilter]} options={chartOptions} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserAnalyticsPage;