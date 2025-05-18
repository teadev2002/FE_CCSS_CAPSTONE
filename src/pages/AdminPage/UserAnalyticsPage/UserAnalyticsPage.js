// src/pages/UserAnalyticsPage.jsx

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

  // Trạng thái cho Top 5 Cosplayers theo điểm
  const [topCosplayersByRating, setTopCosplayersByRating] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0);

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

  // Dữ liệu giả lập cho Top 5 cosplayer theo lượt đặt
  const topCosplayersByBookings = [
    { id: 1, name: "Alex Mercer", bookings: 89, rating: 4.9 },
    { id: 2, name: "Nương Phạm", bookings: 82, rating: 4.8 },
    { id: 3, name: "Katie Bell", bookings: 75, rating: 4.7 },
    { id: 4, name: "Minh Anh", bookings: 70, rating: 4.6 },
    { id: 5, name: "James Carter", bookings: 65, rating: 4.5 },
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

  // Các tùy chọn bộ lọc cho Top 5 Cosplayers by Rating
  const ratingFilterOptions = [
    { value: 0, label: "Today" },
    { value: 1, label: "This Week" },
    { value: 2, label: "This Month" },
    { value: 3, label: "This Year" },
  ];

  // --- Hàm xử lý logic ---

  // Định dạng giá thuê cosplayer
  const formatHourlyRate = (rate) => {
    return `${rate.toLocaleString("vi-VN")}/h VND`;
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

  // Lấy dữ liệu Top 5 Cosplayers theo điểm
  useEffect(() => {
    const fetchTopCosplayersByRating = async () => {
      try {
        const data = await UserAnalyticsService.getTop5PopularCosplayers(ratingFilter);
        const sortedCosplayers = Array.isArray(data)
          ? data.sort((a, b) => b.averageStar - a.averageStar).slice(0, 5)
          : [];
        setTopCosplayersByRating(sortedCosplayers);
      } catch (error) {
        toast.error(error.message || "Failed to load top cosplayers by rating");
      }
    };

    fetchTopCosplayersByRating();
  }, [ratingFilter]);

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

      {/* Phần Top 5 */}
      <Row>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5>Top 5 Cosplayers by Rating</h5>
              <Dropdown onSelect={(value) => setRatingFilter(Number(value))}>
                <Dropdown.Toggle variant="secondary" id="dropdown-rating-filter">
                  {ratingFilterOptions.find((opt) => opt.value === ratingFilter)?.label}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {ratingFilterOptions.map((option) => (
                    <Dropdown.Item key={option.value} eventKey={option.value}>
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Rating</th>
                    <th>Email</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>Hourly Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {topCosplayersByRating.map((cosplayer, index) => (
                    <tr key={cosplayer.accountId}>
                      <td>#{index + 1}</td>
                      <td>{cosplayer.name}</td>
                      <td>
                        <div className="rating-cell">
                          {cosplayer.averageStar || "N/A"}
                          {cosplayer.averageStar && (
                            <Star size={14} className="star-filled ms-1" />
                          )}
                        </div>
                      </td>
                      <td>{cosplayer.email}</td>
                      <td>{cosplayer.height} cm</td>
                      <td>{cosplayer.weight} kg</td>
                      <td>{formatHourlyRate(cosplayer.salaryIndex)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Top 5 Cosplayers by Bookings</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Bookings</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topCosplayersByBookings.map((cosplayer, index) => (
                    <tr key={cosplayer.id}>
                      <td>#{index + 1}</td>
                      <td>{cosplayer.name}</td>
                      <td>{cosplayer.bookings}</td>
                      <td>
                        <div className="rating-cell">
                          {cosplayer.rating}
                          <Star size={14} className="star-filled ms-1" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Top 5 Customers by Service Usage</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Services Used</th>
                    <th>Membership</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomersByUsage.map((customer, index) => (
                    <tr key={customer.id}>
                      <td>#{index + 1}</td>
                      <td>{customer.name}</td>
                      <td>
                        <p>Costume Rental: {customer.servicesUsed.costumeRental}</p>
                        <p>Hire Cosplayers: {customer.servicesUsed.hireCosplayers}</p>
                        <p>Event Organization: {customer.servicesUsed.eventOrganization}</p>
                        <p>Buy Souvenirs: {customer.servicesUsed.buySouvenirs}</p>
                        <p>Buy Festival Tickets: {customer.servicesUsed.buyFestivalTickets}</p>
                      </td>
                      <td>{customer.membership}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
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
          <div className="service-usage-item">
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