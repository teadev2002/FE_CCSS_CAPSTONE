// import React, { useState, useEffect } from "react";
// import { Card, Form, Table, Dropdown, Row, Col } from "react-bootstrap";
// import { DollarSign, Calendar, Filter } from "lucide-react";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import RevenueService from "../../../services/AdminService/RevenueService";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import { Line } from "react-chartjs-2";
// import {
//   Chart,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
// } from "chart.js";
// import "../../../styles/Admin/OrderRevenuePerformancePage.scss";

// Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

// const OrderRevenuePerformancePage = () => {
//   const [filterType, setFilterType] = useState(3); // Mặc định: This Year
//   const [revenueSource, setRevenueSource] = useState(3); // Mặc định: Total
//   const [revenueData, setRevenueData] = useState({
//     totalRevenue: 0,
//     paymentResponse: [],
//   });
//   const [chartData, setChartData] = useState({
//     dailyRevenue: [],
//     monthlyRevenue: [],
//   });
//   const [payments, setPayments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Format price to VND
//   const formatPrice = (price) => {
//     if (typeof price !== "number" || price == null) return "0 VND";
//     return `${price.toLocaleString("vi-VN")} VND`;
//   };

//   // Get status text
//   const getStatusText = (status) => {
//     switch (status) {
//       case "Complete":
//         return "Completed";
//       case "Pending":
//         return "Pending";
//       case "Canceled":
//         return "Canceled";
//       default:
//         return status || "Unknown";
//     }
//   };

//   // Format purpose text
//   const formatPurposeText = (purpose) => {
//     if (!purpose) return "N/A";
//     const purposeLower = purpose.toLowerCase();
//     switch (purposeLower) {
//       case "buy tickets":
//         return "Buy Tickets";
//       case "pay contract deposit":
//         return "Contract Deposit";
//       case "finalize the contract":
//         return "Contract Settlement";
//       case "order":
//         return "Order";
//       case "festival":
//         return "Festival";
//       case "service":
//         return "Contract Service";
//       default:
//         // Format chuỗi bất kỳ thành viết hoa chữ đầu mỗi từ
//         return purposeLower
//           .split(" ")
//           .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(" ");
//     }
//   };

//   // Fetch revenue data
//   useEffect(() => {
//     const fetchRevenueData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const data = await RevenueService.getRevenue(filterType, revenueSource);
//         setRevenueData(data || { totalRevenue: 0, paymentResponse: [] });
//       } catch (error) {
//         setError(error.message);
//         setRevenueData({ totalRevenue: 0, paymentResponse: [] });
//         toast.error(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchRevenueData();
//   }, [filterType, revenueSource]);

//   // Fetch chart data
//   useEffect(() => {
//     if (filterType === 0) {
//       setChartData({ dailyRevenue: [], monthlyRevenue: [] });
//       return;
//     }

//     const fetchChartData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const data = await RevenueService.getRevenueChart(filterType, revenueSource);
//         setChartData({
//           dailyRevenue: data.dailyRevenue || [],
//           monthlyRevenue: data.monthlyRevenue || [],
//         });
//       } catch (error) {
//         setError(error.message);
//         setChartData({ dailyRevenue: [], monthlyRevenue: [] });
//         toast.error(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchChartData();
//   }, [filterType, revenueSource]);

//   // Fetch payment data
//   useEffect(() => {
//     const fetchPayments = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const data = await RevenueService.getPayments();
//         setPayments(data || []);
//       } catch (error) {
//         setError(error.message);
//         setPayments([]);
//         toast.error(error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPayments();
//   }, []);

//   // Calculate revenue by service
//   const calculateRevenueByService = () => {
//     const payments = revenueData.paymentResponse || [];
//     let festivalTicketSales = 0;
//     let souvenirSales = 0;
//     let contractServicesTotal = 0;

//     payments.forEach((payment) => {
//       const purpose = payment.purpose?.toLowerCase();
//       if (purpose === "festival" || purpose === "buy tickets") {
//         festivalTicketSales += payment.amount;
//       } else if (purpose === "order") {
//         souvenirSales += payment.amount;
//       } else if (
//         purpose === "service" ||
//         purpose === "pay contract deposit" ||
//         purpose === "finalize the contract"
//       ) {
//         contractServicesTotal += payment.amount;
//       }
//     });

//     return [
//       { service: "Contract Services", revenue: contractServicesTotal },
//       { service: "Souvenir Sales", revenue: souvenirSales },
//       { service: "Festival Ticket Sales", revenue: festivalTicketSales },
//     ];
//   };

//   // Prepare chart data
//   const prepareChartData = () => {
//     let labels = [];
//     let data = [];

//     if (filterType === 1) {
//       const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//       labels = days;
//       data = new Array(7).fill(0);
//       chartData.dailyRevenue.forEach((item) => {
//         const date = new Date(item.date);
//         const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
//         data[dayIndex] = item.totalRevenue || 0;
//       });
//     } else if (filterType === 2) {
//       const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
//       labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
//       data = new Array(daysInMonth).fill(0);
//       chartData.dailyRevenue.forEach((item) => {
//         const date = new Date(item.date);
//         const day = date.getDate() - 1;
//         data[day] = item.totalRevenue || 0;
//       });
//     } else if (filterType === 3) {
//       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//       labels = months;
//       data = new Array(12).fill(0);
//       chartData.monthlyRevenue.forEach((item) => {
//         const monthIndex = item.month - 1;
//         data[monthIndex] = item.totalRevenue || 0;
//       });
//     }

//     return {
//       labels,
//       datasets: [
//         {
//           label: "Revenue",
//           data,
//           borderColor: "rgb(52, 152, 219)",
//           backgroundColor: (context) => {
//             const ctx = context.chart.ctx;
//             const gradient = ctx.createLinearGradient(0, 0, 0, 400);
//             gradient.addColorStop(0, "rgba(52, 152, 219, 0.3)");
//             gradient.addColorStop(1, "rgba(52, 152, 219, 0)");
//             return gradient;
//           },
//           fill: true,
//           tension: 0.4,
//           pointBackgroundColor: "#fff",
//           pointBorderColor: "rgb(52, 152, 219)",
//           pointBorderWidth: 2,
//           pointRadius: 5,
//           pointHoverRadius: 7,
//         },
//       ],
//     };
//   };

//   // Chart options
//   const chartOptions = {
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: "rgba(0, 0, 0, 0.05)",
//         },
//         ticks: {
//           callback: (value) => formatPrice(value).replace(" VND", ""),
//         },
//       },
//       x: {
//         grid: {
//           display: false,
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         display: false,
//       },
//       tooltip: {
//         callbacks: {
//           label: (context) => `Revenue: ${formatPrice(context.raw)}`,
//         },
//       },
//     },
//     animation: {
//       duration: 1000,
//       easing: "easeInOutQuad",
//     },
//   };

//   // Dropdown options
//   const filterTypeOptions = [
//     { value: 0, label: "Today" },
//     { value: 1, label: "This Week" },
//     { value: 2, label: "This Month" },
//     { value: 3, label: "This Year" },
//   ];

//   const revenueSourceOptions = [
//     { value: 0, label: "Order" },
//     { value: 1, label: "Festival" },
//     { value: 2, label: "Contract Service" }, // Sửa từ Service thành Contract Service
//     { value: 3, label: "Total" },
//   ];

//   const revenueByService = calculateRevenueByService();

//   return (
//     <div className="order-revenue">
//       <h1>Order & Revenue Performance</h1>

//       {/* Filters */}
//       <Row className="mb-4">
//         <Col md={6}>
//           <Form.Group>
//             <Form.Label className="filter-label">
//               <Calendar size={18} className="me-2" />
//               Time Period
//             </Form.Label>
//             <Dropdown onSelect={(value) => setFilterType(Number(value))}>
//               <Dropdown.Toggle variant="outline-primary" id="dropdown-filter-type">
//                 {filterTypeOptions.find((opt) => opt.value === filterType)?.label}
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 {filterTypeOptions.map((option) => (
//                   <Dropdown.Item key={option.value} eventKey={option.value}>
//                     {option.label}
//                   </Dropdown.Item>
//                 ))}
//               </Dropdown.Menu>
//             </Dropdown>
//           </Form.Group>
//         </Col>

//         <Col md={6}>
//           <Form.Group>
//             <Form.Label className="filter-label">
//               <Filter size={18} className="me-2" />
//               Revenue Source
//             </Form.Label>
//             <Dropdown onSelect={(value) => setRevenueSource(Number(value))}>
//               <Dropdown.Toggle variant="outline-primary" id="dropdown-revenue-source">
//                 {revenueSourceOptions.find((opt) => opt.value === revenueSource)?.label}
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 {revenueSourceOptions.map((option) => (
//                   <Dropdown.Item key={option.value} eventKey={option.value}>
//                     {option.label}
//                   </Dropdown.Item>
//                 ))}
//               </Dropdown.Menu>
//             </Dropdown>
//           </Form.Group>
//         </Col>
//       </Row>

//       {/* Loading or error */}
//       {isLoading && (
//         <Box sx={{ width: "100%", marginY: 2 }}>
//           <LinearProgress />
//         </Box>
//       )}
//       {error && <p className="error-message">{error}</p>}

//       {!isLoading && !error && (
//         <>
//           {/* Total revenue and revenue by service */}
//           <Row className="mb-4">
//             <Col md={12} lg={4}>
//               <Card className="total-revenue-card mb-4">
//                 <Card.Body className="d-flex align-items-center">
//                   <div className="revenue-icon">
//                     <DollarSign size={48} />
//                   </div>
//                   <div className="ms-4">
//                     <h3>Total Revenue</h3>
//                     <h2>{formatPrice(revenueData.totalRevenue)}</h2>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col md={12} lg={8}>
//               <Card className="mb-4">
//                 <Card.Header>
//                   <h5>Revenue by Service</h5>
//                 </Card.Header>
//                 <Card.Body>
//                   {revenueByService.length === 0 ? (
//                     <p className="text-muted">No revenue data available.</p>
//                   ) : (
//                     <Table responsive hover>
//                       <thead>
//                         <tr>
//                           <th>Service</th>
//                           <th>Revenue</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {revenueByService.map((item, index) => (
//                           <tr key={index}>
//                             <td>{item.service}</td>
//                             <td>{formatPrice(item.revenue)}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </Table>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           {/* Revenue trend chart */}
//           <Card className="mb-4">
//             <Card.Header>
//               <h5>Revenue Trend</h5>
//             </Card.Header>
//             <Card.Body style={{ height: "400px" }}>
//               {filterType === 0 ||
//                 (filterType === 1 && chartData.dailyRevenue.length === 0) ||
//                 (filterType === 2 && chartData.dailyRevenue.length === 0) ||
//                 (filterType === 3 && chartData.monthlyRevenue.length === 0) ? (
//                 <p className="text-muted text-center">No data available for the selected period.</p>
//               ) : (
//                 <Line data={prepareChartData()} options={chartOptions} />
//               )}
//             </Card.Body>
//           </Card>

//           {/* Transaction Details */}
//           <Card className="mb-4">
//             <Card.Header>
//               <h5>Transaction Details</h5>
//             </Card.Header>
//             <Card.Body>
//               {payments.length === 0 ? (
//                 <p className="text-muted">No transactions found.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <Table striped bordered hover responsive>
//                     <thead>
//                       <tr>
//                         <th className="text-center">Payment ID</th>
//                         <th className="text-center">Type</th>
//                         <th className="text-center">Status</th>
//                         <th className="text-center">Purpose</th>
//                         <th className="text-center">Amount</th>
//                         <th className="text-center">Transaction ID</th>
//                         <th className="text-center">Created At</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {payments.map((payment) => (
//                         <tr key={payment.paymentId}>
//                           <td className="text-center">{payment.paymentId}</td>
//                           <td className="text-center">{payment.type || "N/A"}</td>
//                           <td className="text-center">
//                             <span
//                               className={
//                                 getStatusText(payment.status).toLowerCase() === "completed"
//                                   ? "status-completed"
//                                   : getStatusText(payment.status).toLowerCase() === "canceled"
//                                   ? "status-cancel"
//                                   : ""
//                               }
//                             >
//                               {getStatusText(payment.status)}
//                             </span>
//                           </td>
//                           <td className="text-center">{formatPurposeText(payment.purpose)}</td>
//                           <td className="text-center">{formatPrice(payment.amount)}</td>
//                           <td className="text-center">{payment.transactionId || "N/A"}</td>
//                           <td className="text-center">
//                             {payment.creatAt && !isNaN(new Date(payment.creatAt))
//                               ? new Date(payment.creatAt).toLocaleString("en-US")
//                               : "Invalid Date"}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default OrderRevenuePerformancePage;

//-------------------------------------------------------------------------------------//

//sửa ngày 02/06/2025

import React, { useState, useEffect } from "react";
import { Card, Form, Table, Dropdown, Row, Col } from "react-bootstrap";
import { DollarSign, Calendar, Filter } from "lucide-react";
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

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const OrderRevenuePerformancePage = () => { // Mặc định: mới nhất (descending)
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterType, setFilterType] = useState(3); // Mặc định: This Year
  const [revenueSource, setRevenueSource] = useState(3); // Mặc định: Total
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    paymentResponse: [],
  });
  const [chartData, setChartData] = useState({
    dailyRevenue: [],
    monthlyRevenue: [],
  });
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format price to VND
  const formatPrice = (price) => {
    if (typeof price !== "number" || price == null) return "0 VND";
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const regex = /^(\d{2})[-/](\d{2})[-/](\d{4})$/;
    if (regex.test(dateString)) {
      return dateString; // Đã đúng định dạng DD/MM/YYYY
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "Complete":
        return "Completed";
      case "Pending":
        return "Pending";
      case "Canceled":
        return "Canceled";
      default:
        return status || "Unknown";
    }
  };

  // Format purpose text
  // Format purpose text
  const formatPurposeText = (purpose) => {
    if (!purpose) return "N/A";
    const purposeLower = purpose.toLowerCase();
    switch (purposeLower) {
      case "buyticket":
        return "Buy Ticket";
      case "contractdeposit":
        return "Contract Deposit";
      case "contractsettlement":
        return "Contract Settlement";
      case "order":
        return "Order";
      case "refund":
        return "Refund";
      default:
        return purposeLower
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  const handleSortByDate = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);

    const sortedPayments = [...payments].sort((a, b) => {
      // Hàm chuyển đổi định dạng dd/mm/yyyy thành Date
      const parseDate = (dateStr) => {
        if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
          return new Date(0); // Trả về ngày rất cũ nếu định dạng không hợp lệ
        }
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day); // month - 1 vì tháng trong Date bắt đầu từ 0
      };

      const dateA = parseDate(a.creatAt);
      const dateB = parseDate(b.creatAt);

      return newSortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setPayments(sortedPayments);
  };
  // Fetch revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await RevenueService.getRevenue(filterType, revenueSource);
        setRevenueData(data || { totalRevenue: 0, paymentResponse: [] });
      } catch (error) {
        setError(error.message);
        setRevenueData({ totalRevenue: 0, paymentResponse: [] });
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRevenueData();
  }, [filterType, revenueSource]);

  // Fetch chart data
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
        setChartData({ dailyRevenue: [], monthlyRevenue: [] });
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, [filterType, revenueSource]);

  // Fetch payment data
  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await RevenueService.getPayments();
        // Sắp xếp payments theo creatAt giảm dần (mới nhất lên đầu)
        const sortedPayments = (data || []).sort((a, b) => {
          const parseDate = (dateStr) => {
            if (!dateStr || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
              return new Date(0); // Trả về ngày rất cũ nếu định dạng không hợp lệ
            }
            const [day, month, year] = dateStr.split("/").map(Number);
            return new Date(year, month - 1, day);
          };

          const dateA = parseDate(a.creatAt);
          const dateB = parseDate(b.creatAt);

          return dateB - dateA; // Sắp xếp giảm dần
        });
        setPayments(sortedPayments);
      } catch (error) {
        setError(error.message);
        setPayments([]);
        toast.error(error.message, { autoClose: 8000 }); // Cập nhật autoClose theo yêu cầu trước
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Calculate revenue by service
  const calculateRevenueByService = () => {
    const payments = revenueData.paymentResponse || [];
    let festivalTicketSales = 0;
    let souvenirSales = 0;
    let contractServicesTotal = 0;

    payments.forEach((payment) => {
      const purpose = payment.purpose?.toLowerCase();
      if (purpose === "buyticket" || purpose === "festival") {
        festivalTicketSales += payment.amount;
      } else if (purpose === "order") {
        souvenirSales += payment.amount;
      } else if (
        purpose === "service" ||
        purpose === "pay contract deposit" ||
        purpose === "contractsettlement"
      ) {
        contractServicesTotal += payment.amount;
      }
    });

    // Lọc theo revenueSource
    const result = [];
    if (revenueSource === 0) {
      result.push({ service: "Souvenir Sales", revenue: souvenirSales });
    } else if (revenueSource === 1) {
      result.push({ service: "Festival Ticket Sales", revenue: festivalTicketSales });
    } else if (revenueSource === 2) {
      result.push({ service: "Contract Services", revenue: contractServicesTotal });
    } else if (revenueSource === 3) {
      result.push(
        { service: "Souvenir Sales", revenue: souvenirSales },
        { service: "Festival Ticket Sales", revenue: festivalTicketSales },
        { service: "Contract Services", revenue: contractServicesTotal }
      );
    }

    return result;
  };

  // Prepare chart data
  const prepareChartData = () => {
    let labels = [];
    let data = [];

    if (filterType === 1) {
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      labels = days;
      data = new Array(7).fill(0);
      chartData.dailyRevenue.forEach((item) => {
        const date = new Date(item.date);
        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
        data[dayIndex] = item.totalRevenue || 0;
      });
    } else if (filterType === 2) {
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      data = new Array(daysInMonth).fill(0);
      chartData.dailyRevenue.forEach((item) => {
        const date = new Date(item.date);
        const day = date.getDate() - 1;
        data[day] = item.totalRevenue || 0;
      });
    } else if (filterType === 3) {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      labels = months;
      data = new Array(12).fill(0);
      chartData.monthlyRevenue.forEach((item) => {
        const monthIndex = item.month - 1;
        data[monthIndex] = item.totalRevenue || 0;
      });
    }

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data,
          borderColor: "rgb(52, 152, 219)",
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, "rgba(52, 152, 219, 0.3)");
            gradient.addColorStop(1, "rgba(52, 152, 219, 0)");
            return gradient;
          },
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#fff",
          pointBorderColor: "rgb(52, 152, 219)",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => formatPrice(value).replace(" VND", ""),
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
          label: (context) => `Revenue: ${formatPrice(context.raw)}`,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
  };

  // Dropdown options
  const filterTypeOptions = [
    { value: 0, label: "Today" },
    { value: 1, label: "This Week" },
    { value: 2, label: "This Month" },
    { value: 3, label: "This Year" },
  ];

  const revenueSourceOptions = [
    { value: 0, label: "Souvenir Sales" }, // Sửa từ Order
    { value: 1, label: "Festival Ticket Sales" }, // Sửa từ Festival
    { value: 2, label: "Contract Services" }, // Sửa từ Contract Service
    { value: 3, label: "Total" },
  ];

  const revenueByService = calculateRevenueByService();

  return (
    <div className="order-revenue">
      <h1>Order & Revenue Performance</h1>

      {/* Filters */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="filter-label">
              <Calendar size={18} className="me-2" />
              Time Period
            </Form.Label>
            <Dropdown onSelect={(value) => setFilterType(Number(value))}>
              <Dropdown.Toggle variant="outline-primary" id="dropdown-filter-type">
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
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group>
            <Form.Label className="filter-label">
              <Filter size={18} className="me-2" />
              Revenue Source
            </Form.Label>
            <Dropdown onSelect={(value) => setRevenueSource(Number(value))}>
              <Dropdown.Toggle variant="outline-primary" id="dropdown-revenue-source">
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
          </Form.Group>
        </Col>
      </Row>

      {/* Loading or error */}
      {isLoading && (
        <Box sx={{ width: "100%", marginY: 2 }}>
          <LinearProgress />
        </Box>
      )}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && (
        <>
          {/* Total revenue and revenue by service */}
          <Row className="mb-4">
            <Col md={12} lg={4}>
              <Card className="total-revenue-card mb-4">
                <Card.Body className="d-flex align-items-center">
                  <div className="revenue-icon">
                    <DollarSign size={48} />
                  </div>
                  <div className="ms-4">
                    <h3>Total Revenue</h3>
                    <h2>{formatPrice(revenueData.totalRevenue)}</h2>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={12} lg={8}>
              <Card className="mb-4">
                <Card.Header>
                  <h5>Revenue by Service</h5>
                </Card.Header>
                <Card.Body>
                  {revenueByService.length === 0 ? (
                    <p className="text-muted">No revenue data available.</p>
                  ) : (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueByService.map((item, index) => (
                          <tr key={index}>
                            <td>{item.service}</td>
                            <td>{formatPrice(item.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Revenue trend chart */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Revenue Trend</h5>
            </Card.Header>
            <Card.Body style={{ height: "400px" }}>
              {filterType === 0 ||
                (filterType === 1 && chartData.dailyRevenue.length === 0) ||
                (filterType === 2 && chartData.dailyRevenue.length === 0) ||
                (filterType === 3 && chartData.monthlyRevenue.length === 0) ? (
                <p className="text-muted text-center">No data available for the selected period.</p>
              ) : (
                <Line data={prepareChartData()} options={chartOptions} />
              )}
            </Card.Body>
          </Card>

          {/* Transaction Details */}
          <Card className="mb-4">
            <Card.Header>
              <h5>Transaction Details</h5>
            </Card.Header>
            <Card.Body>
              {payments.length === 0 ? (
                <p className="text-muted">No transactions found.</p>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th className="text-center">Transaction ID</th>
                        <th className="text-center">Type</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Purpose</th>
                        <th className="text-center">Amount</th>
                        <th className="text-center" onClick={handleSortByDate} style={{ cursor: "pointer" }}>
                          Created At {sortOrder === "desc" ? "↓" : "↑"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.paymentId}>
                          <td className="text-center">{payment.transactionId || "N/A"}</td>
                          <td className="text-center">{payment.type || "N/A"}</td>
                          <td className="text-center">
                            <span
                              className={
                                getStatusText(payment.status).toLowerCase() === "completed"
                                  ? "status-completed"
                                  : getStatusText(payment.status).toLowerCase() === "canceled"
                                    ? "status-cancel"
                                    : ""
                              }
                            >
                              {getStatusText(payment.status)}
                            </span>
                          </td>
                          <td className="text-center">{formatPurposeText(payment.purpose)}</td>
                          <td className="text-center">{formatPrice(payment.amount)}</td>
                          <td className="text-center">{formatDate(payment.creatAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default OrderRevenuePerformancePage;