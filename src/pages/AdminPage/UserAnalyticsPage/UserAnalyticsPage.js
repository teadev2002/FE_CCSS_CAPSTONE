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
import { Image } from "antd";
import "../../../styles/Admin/UserAnalyticsPage.scss";
import UserAnalyticsService from "../../../services/AdminService/UserAnalyticsService";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const UserAnalyticsPage = () => {
  // State cho dữ liệu tài khoản
  const [totalAccounts, setTotalAccounts] = useState({
    total: 0,
    customers: 0,
    cosplayers: 0,
    consultants: 0,
    managers: 0,
    admins: 0,
  });
  const [averageCosplayerRating, setAverageCosplayerRating] = useState(0);
  const [accounts, setAccounts] = useState({
    customers: [],
    cosplayers: [],
    consultants: [],
    managers: [],
    admins: [],
  });

  // State cho Top 5 Cosplayers by Rating
  const [topCosplayersByRating, setTopCosplayersByRating] = useState([]);
  const [ratingFilter, setRatingFilter] = useState(0); // 0: Today, 1: This week, 2: This month, 3: This year

  // Thống kê tương tác người dùng (giả lập - chưa có API)
  const userEngagement = {
    activeUsers: 1800,
    newSignUps: 385,
    avgSessionTime: "15 mins",
  };

  // Top 5 khách hàng sử dụng dịch vụ nhiều nhất (giả lập - chưa có API)
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

  // Top 5 cosplayer được yêu thích nhất (book nhiều nhất) (giả lập - chưa có API)
  const topCosplayersByBookings = [
    { id: 1, name: "Alex Mercer", bookings: 89, rating: 4.9 },
    { id: 2, name: "Nương Phạm", bookings: 82, rating: 4.8 },
    { id: 3, name: "Katie Bell", bookings: 75, rating: 4.7 },
    { id: 4, name: "Minh Anh", bookings: 70, rating: 4.6 },
    { id: 5, name: "James Carter", bookings: 65, rating: 4.5 },
  ];

  // Sử dụng dịch vụ theo khách hàng (giả lập - chưa có API)
  const serviceUsage = {
    customers: {
      costumeRental: 400,
      hireCosplayers: 500,
      eventOrganization: 200,
      buySouvenirs: 150,
      buyFestivalTickets: 100,
    },
    trends: {
      costumeRental: "+9.1%",
      hireCosplayers: "+14.3%",
      eventOrganization: "-0.6%",
      buySouvenirs: "+5.0%",
      buyFestivalTickets: "+3.2%",
    },
  };

  // Biểu đồ xu hướng sử dụng dịch vụ (giả lập - chưa có API)
  const [usageFilter, setUsageFilter] = useState("today");
  const usageChartData = {
    today: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      datasets: [
        {
          label: "Costume Rental",
          data: [50, 100, 150, 200, 250, 300],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Hire Cosplayers",
          data: [80, 120, 180, 240, 300, 360],
          borderColor: "#2ecc71",
          backgroundColor: "rgba(46, 204, 113, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Event Organization",
          data: [30, 60, 90, 120, 150, 180],
          borderColor: "#f1c40f",
          backgroundColor: "rgba(241, 196, 15, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Buy Souvenirs",
          data: [20, 40, 60, 80, 100, 120],
          borderColor: "#e74c3c",
          backgroundColor: "rgba(231, 76, 60, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Buy Festival Tickets",
          data: [10, 20, 30, 40, 50, 60],
          borderColor: "#9b59b6",
          backgroundColor: "rgba(155, 89, 182, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    month: {
      labels: ["1", "5", "10", "15", "20", "25", "30"],
      datasets: [
        {
          label: "Costume Rental",
          data: [200, 300, 250, 350, 400, 450, 420],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Hire Cosplayers",
          data: [300, 400, 350, 450, 500, 550, 520],
          borderColor: "#2ecc71",
          backgroundColor: "rgba(46, 204, 113, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Event Organization",
          data: [100, 150, 120, 180, 200, 220, 210],
          borderColor: "#f1c40f",
          backgroundColor: "rgba(241, 196, 15, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Buy Souvenirs",
          data: [80, 120, 100, 140, 160, 180, 170],
          borderColor: "#e74c3c",
          backgroundColor: "rgba(231, 76, 60, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Buy Festival Tickets",
          data: [50, 70, 60, 80, 90, 100, 95],
          borderColor: "#9b59b6",
          backgroundColor: "rgba(155, 89, 182, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    year: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Costume Rental",
          data: [1000, 1200, 1100, 1300, 1400, 1500, 1600, 1550, 1450, 1400, 1300, 1200],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Hire Cosplayers",
          data: [1200, 1400, 1300, 1500, 1600, 1700, 1800, 1750, 1650, 1600, 1500, 1400],
          borderColor: "#2ecc71",
          backgroundColor: "rgba(46, 204, 113, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Event Organization",
          data: [500, 600, 550, 650, 700, 750, 800, 780, 720, 700, 650, 600],
          borderColor: "#f1c40f",
          backgroundColor: "rgba(241, 196, 15, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Buy Souvenirs",
          data: [300, 400, 350, 450, 500, 550, 600, 580, 540, 520, 480, 450],
          borderColor: "#e74c3c",
          backgroundColor: "rgba(231, 76, 60, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Buy Festival Tickets",
          data: [200, 250, 220, 280, 300, 320, 340, 330, 310, 290, 270, 250],
          borderColor: "#9b59b6",
          backgroundColor: "rgba(155, 89, 182, 0.1)",
          fill: true,
          tension: 0.4,
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
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()}`,
        },
      },
    },
  };

  const filterTypeOptions = [
    { value: "today", label: "Today" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  // Filter thời gian cho Top 5 Cosplayers by Rating
  const ratingFilterOptions = [
    { value: 0, label: "Today" },
    { value: 1, label: "This Week" },
    { value: 2, label: "This Month" },
    { value: 3, label: "This Year" },
  ];

  // Role ID mapping
  const roleMapping = {
    R001: "admins",
    R002: "managers",
    R003: "consultants",
    R004: "cosplayers",
    R005: "customers",
  };

  // Lấy dữ liệu tài khoản khi component mount
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

        // Gọi API cho từng vai trò
        for (const roleId of roles) {
          const data = await UserAnalyticsService.getAccountsByRole(roleId);
          const roleKey = roleMapping[roleId];
          fetchedAccounts[roleKey] = Array.isArray(data) ? data : [data];
          counts[roleKey] = fetchedAccounts[roleKey].length;
        }

        // Tính tổng số tài khoản
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

        // Tính trung bình sao của cosplayer
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
        setAccounts(fetchedAccounts);
      } catch (error) {
        toast.error(error.message || "Failed to load account data");
      }
    };

    fetchAccounts();
  }, []);

  // Lấy dữ liệu Top 5 Cosplayers by Rating
  useEffect(() => {
    const fetchTopCosplayersByRating = async () => {
      try {
        const data = await UserAnalyticsService.getTop5PopularCosplayers(ratingFilter);
        // Sắp xếp theo averageStar giảm dần và giới hạn 5 cosplayer
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

  // Hàm format giá thuê cosplayer
  const formatHourlyRate = (rate) => {
    return `${rate.toLocaleString("vi-VN")}/h VND`;
  };

  // Hàm lấy URL hình ảnh avatar và danh sách hình ảnh cho preview
  const getAvatarUrl = (images) => {
    if (!images || images.length === 0) {
      return "https://via.placeholder.com/40?text=No+Image";
    }
    const avatarImage = images.find((img) => img.isAvatar) || images[0];
    return avatarImage.urlImage;
  };

  // Hàm lấy danh sách hình ảnh để preview
  const getImageList = (images) => {
    if (!images || images.length === 0) {
      return ["https://via.placeholder.com/40?text=No+Image"];
    }
    return images.map((img) => img.urlImage);
  };

  return (
    <div className="user-analytics">
      <h1>User Analytics</h1>

      {/* Tổng quan */}
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

        <Card className="stat-card">
          <Card.Body>
            <div className="stat-icon">
              <UsersIcon size={24} />
            </div>
            <h3>User Engagement</h3>
            <p>Active Users: {userEngagement.activeUsers.toLocaleString()}</p>
            <p>New Sign-ups: {userEngagement.newSignUps.toLocaleString()}</p>
            <p>Avg. Session Time: {userEngagement.avgSessionTime}</p>
          </Card.Body>
        </Card>
      </div>

      {/* Top 5 */}
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

      {/* Sử dụng dịch vụ theo khách hàng */}
      <Card className="mb-4">
        <Card.Header>
          <h5>Service Usage by Customers</h5>
        </Card.Header>
        <Card.Body>
          <div className="service-usage-item">
            <div className="d-flex justify-content-between mb-1">
              <span>Costume Rental</span>
              <span>
                {serviceUsage.customers.costumeRental.toLocaleString()}{" "}
                <span className="trend positive">{serviceUsage.trends.costumeRental}</span>
              </span>
            </div>
            <ProgressBar now={35} variant="success" />
          </div>
          <div className="service-usage-item">
            <div className="d-flex justify-content-between mb-1">
              <span>Hire Cosplayers</span>
              <span>
                {serviceUsage.customers.hireCosplayers.toLocaleString()}{" "}
                <span className="trend positive">{serviceUsage.trends.hireCosplayers}</span>
              </span>
            </div>
            <ProgressBar now={45} variant="info" />
          </div>
          <div className="service-usage-item">
            <div className="d-flex justify-content-between mb-1">
              <span>Event Organization</span>
              <span>
                {serviceUsage.customers.eventOrganization.toLocaleString()}{" "}
                <span
                  className={
                    serviceUsage.trends.eventOrganization.startsWith("-")
                      ? "trend negative"
                      : "trend positive"
                  }
                >
                  {serviceUsage.trends.eventOrganization}
                </span>
              </span>
            </div>
            <ProgressBar now={20} variant="warning" />
          </div>
          <div className="service-usage-item">
            <div className="d-flex justify-content-between mb-1">
              <span>Buy Souvenirs</span>
              <span>
                {serviceUsage.customers.buySouvenirs.toLocaleString()}{" "}
                <span className="trend positive">{serviceUsage.trends.buySouvenirs}</span>
              </span>
            </div>
            <ProgressBar now={15} variant="danger" />
          </div>
          <div className="service-usage-item">
            <div className="d-flex justify-content-between mb-1">
              <span>Buy Festival Tickets</span>
              <span>
                {serviceUsage.customers.buyFestivalTickets.toLocaleString()}{" "}
                <span className="trend positive">{serviceUsage.trends.buyFestivalTickets}</span>
              </span>
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

      {/* Danh sách tài khoản */}
      <Row>
        <Col lg={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Customer Accounts</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Avatar</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.customers.map((account) => (
                    <tr key={account.accountId}>
                      <td>{account.accountId}</td>
                      <td>{account.name}</td>
                      <td>{account.email}</td>
                      <td>
                        <Image
                          src={getAvatarUrl(account.images)}
                          alt={`${account.name}'s avatar`}
                          width={40}
                          height={40}
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          preview={{
                            src: getAvatarUrl(account.images),
                            srcList: getImageList(account.images),
                          }}
                        />
                      </td>
                      <td>{account.isActive ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Cosplayer Accounts</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Average Star</th>
                    <th>Avatar</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.cosplayers.map((account) => (
                    <tr key={account.accountId}>
                      <td>{account.accountId}</td>
                      <td>{account.name}</td>
                      <td>{account.email}</td>
                      <td>
                        {account.averageStar ? (
                          <div className="rating-cell">
                            {account.averageStar}
                            <Star size={14} className="star-filled ms-1" />
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>
                        <Image
                          src={getAvatarUrl(account.images)}
                          alt={`${account.name}'s avatar`}
                          width={40}
                          height={40}
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          preview={{
                            src: getAvatarUrl(account.images),
                            srcList: getImageList(account.images),
                          }}
                        />
                      </td>
                      <td>{account.isActive ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Consultant Accounts</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Avatar</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.consultants.map((account) => (
                    <tr key={account.accountId}>
                      <td>{account.accountId}</td>
                      <td>{account.name}</td>
                      <td>{account.email}</td>
                      <td>
                        <Image
                          src={getAvatarUrl(account.images)}
                          alt={`${account.name}'s avatar`}
                          width={40}
                          height={40}
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          preview={{
                            src: getAvatarUrl(account.images),
                            srcList: getImageList(account.images),
                          }}
                        />
                      </td>
                      <td>{account.isActive ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Manager Accounts</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Avatar</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.managers.map((account) => (
                    <tr key={account.accountId}>
                      <td>{account.accountId}</td>
                      <td>{account.name}</td>
                      <td>{account.email}</td>
                      <td>
                        <Image
                          src={getAvatarUrl(account.images)}
                          alt={`${account.name}'s avatar`}
                          width={40}
                          height={40}
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          preview={{
                            src: getAvatarUrl(account.images),
                            srcList: getImageList(account.images),
                          }}
                        />
                      </td>
                      <td>{account.isActive ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Admin Accounts</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Avatar</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.admins.map((account) => (
                    <tr key={account.accountId}>
                      <td>{account.accountId}</td>
                      <td>{account.name}</td>
                      <td>{account.email}</td>
                      <td>
                        <Image
                          src={getAvatarUrl(account.images)}
                          alt={`${account.name}'s avatar`}
                          width={40}
                          height={40}
                          style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          preview={{
                            src: getAvatarUrl(account.images),
                            srcList: getImageList(account.images),
                          }}
                        />
                      </td>
                      <td>{account.isActive ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserAnalyticsPage;