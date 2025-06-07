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
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [filterType, setFilterType] = useState(3); // Default: This Year
//   const [revenueSource, setRevenueSource] = useState(3); // Default: Total
//   const [purposeFilter, setPurposeFilter] = useState("all"); // Purpose filter
//   const [revenueData, setRevenueData] = useState({
//     totalRevenue: 0,
//     paymentResponse: [],
//   });
//   const [contractServicesRevenue, setContractServicesRevenue] = useState(0); // Contract Services revenue
//   const [chartData, setChartData] = useState({
//     dailyRevenue: [],
//     monthlyRevenue: [],
//     hourlyRevenue: [], // Added for filterType === 0
//   });
//   const [payments, setPayments] = useState([]);
//   const [filteredPayments, setFilteredPayments] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Format price to VND
//   const formatPrice = (price) => {
//     if (typeof price !== "number" || price == null) return "0 VND";
//     return `${price.toLocaleString("vi-VN")} VND`;
//   };

//   // Format date to HH:mm DD/MM/YYYY
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const timeDateRegex = /^(\d{2}):(\d{2})\s(\d{2})\/(\d{2})\/(\d{4})$/;
//     if (timeDateRegex.test(dateString)) {
//       return dateString;
//     }
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "Invalid Date";
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${hours}:${minutes} ${day}/${month}/${year}`;
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
//       case "buyticket":
//         return "Buy Ticket";
//       case "contractdeposit":
//         return "Contract Deposit";
//       case "contractsettlement":
//         return "Contract Settlement";
//       case "order":
//         return "Order Product";
//       case "refund":
//         return "Refund";
//       default:
//         return purposeLower
//           .split(" ")
//           .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(" ");
//     }
//   };

//   // Handle sort by date
//   const handleSortByDate = () => {
//     const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
//     setSortOrder(newSortOrder);

//     const sortedPayments = [...filteredPayments].sort((a, b) => {
//       const parseDate = (dateStr) => {
//         if (!dateStr || !/^\d{2}:\d{2}\s\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
//           return new Date(0);
//         }
//         const [time, date] = dateStr.split(" ");
//         const [hours, minutes] = time.split(":").map(Number);
//         const [day, month, year] = date.split("/").map(Number);
//         return new Date(year, month - 1, day, hours, minutes);
//       };

//       const dateA = parseDate(a.creatAt);
//       const dateB = parseDate(b.creatAt);

//       return newSortOrder === "desc" ? dateB - dateA : dateA - dateB;
//     });

//     setFilteredPayments(sortedPayments);
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

//   // Fetch Contract Services revenue (revenueSource === 2)
//   useEffect(() => {
//     const fetchContractServicesRevenue = async () => {
//       if (revenueSource === 2 || revenueSource === 3) {
//         setIsLoading(true);
//         try {
//           const data = await RevenueService.getRevenue(filterType, 2);
//           setContractServicesRevenue(data?.totalRevenue || 0);
//         } catch (error) {
//           setError(error.message);
//           setContractServicesRevenue(0);
//           toast.error("Failed to fetch Contract Services revenue");
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         setContractServicesRevenue(0); // Reset if not needed
//       }
//     };
//     fetchContractServicesRevenue();
//   }, [filterType, revenueSource]);

//   // Fetch chart data
//   useEffect(() => {
//     const fetchChartData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const data = await RevenueService.getRevenueChart(filterType, revenueSource);
//         setChartData({
//           dailyRevenue: data.dailyRevenue || [],
//           monthlyRevenue: data.monthlyRevenue || [],
//           hourlyRevenue: data.hourlyRevenue || [], // Store hourlyRevenue
//         });
//       } catch (error) {
//         setError(error.message);
//         setChartData({ dailyRevenue: [], monthlyRevenue: [], hourlyRevenue: [] });
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
//         const sortedPayments = (data || []).sort((a, b) => {
//           const parseDate = (dateStr) => {
//             if (!dateStr || !/^\d{2}:\d{2}\s\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
//               return new Date(0);
//             }
//             const [time, date] = dateStr.split(" ");
//             const [hours, minutes] = time.split(":").map(Number);
//             const [day, month, year] = date.split("/").map(Number);
//             return new Date(year, month - 1, day, hours, minutes);
//           };

//           const dateA = parseDate(a.creatAt);
//           const dateB = parseDate(b.creatAt);

//           return dateB - dateA;
//         });
//         setPayments(sortedPayments);
//         setFilteredPayments(sortedPayments);
//       } catch (error) {
//         setError(error.message);
//         setPayments([]);
//         setFilteredPayments([]);
//         toast.error(error.message, { autoClose: 8000 });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchPayments();
//   }, []);

//   // Filter payments by purpose
//   useEffect(() => {
//     if (purposeFilter === "all") {
//       setFilteredPayments(payments);
//     } else {
//       const filtered = payments.filter(
//         (payment) => payment.purpose?.toLowerCase() === purposeFilter.toLowerCase()
//       );
//       setFilteredPayments(filtered);
//     }
//   }, [payments, purposeFilter]);

//   // Calculate revenue by service
//   const calculateRevenueByService = () => {
//     const payments = revenueData.paymentResponse || [];
//     let festivalTicketSales = 0;
//     let souvenirSales = 0;

//     payments.forEach((payment) => {
//       const purpose = payment.purpose?.toLowerCase();
//       if (purpose === "buyticket" || purpose === "festival") {
//         festivalTicketSales += payment.amount;
//       } else if (purpose === "order") {
//         souvenirSales += payment.amount;
//       }
//     });

//     const result = [];
//     if (revenueSource === 0) {
//       result.push({ service: "Souvenir Sales", revenue: souvenirSales });
//     } else if (revenueSource === 1) {
//       result.push({ service: "Festival Ticket Sales", revenue: festivalTicketSales });
//     } else if (revenueSource === 2) {
//       result.push({ service: "Contract Services", revenue: contractServicesRevenue });
//     } else if (revenueSource === 3) {
//       result.push(
//         { service: "Souvenir Sales", revenue: souvenirSales },
//         { service: "Festival Ticket Sales", revenue: festivalTicketSales },
//         { service: "Contract Services", revenue: contractServicesRevenue }
//       );
//     }

//     return result;
//   };

//   // Prepare chart data
//   const prepareChartData = () => {
//     let labels = [];
//     let data = [];

//     if (filterType === 0) {
//       // Hourly chart for Today
//       labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
//       data = new Array(24).fill(0);
//       chartData.hourlyRevenue.forEach((item) => {
//         const hourIndex = parseInt(item.hour, 10);
//         if (hourIndex >= 0 && hourIndex < 24) {
//           data[hourIndex] = item.totalRevenue || 0;
//         }
//       });
//     } else if (filterType === 1) {
//       // Weekly chart
//       const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//       labels = days;
//       data = new Array(7).fill(0);
//       chartData.dailyRevenue.forEach((item) => {
//         const date = new Date(item.date);
//         const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
//         data[dayIndex] = item.totalRevenue || 0;
//       });
//     } else if (filterType === 2) {
//       // Monthly chart
//       const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
//       labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
//       data = new Array(daysInMonth).fill(0);
//       chartData.dailyRevenue.forEach((item) => {
//         const date = new Date(item.date);
//         const day = date.getDate() - 1;
//         data[day] = item.totalRevenue || 0;
//       });
//     } else if (filterType === 3) {
//       // Yearly chart
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
//         ticks: {
//           autoSkip: true,
//           maxTicksLimit: filterType === 0 ? 12 : undefined, // Limit x-axis ticks for hourly chart
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
//     { value: 0, label: "Souvenir Sales" },
//     { value: 1, label: "Festival Ticket Sales" },
//     { value: 2, label: "Contract Services" },
//     { value: 3, label: "Total" },
//   ];

//   const purposeOptions = [
//     { value: "all", label: "All" },
//     { value: "buyticket", label: "Buy Ticket" },
//     { value: "contractdeposit", label: "Contract Deposit" },
//     { value: "contractsettlement", label: "Contract Settlement" },
//     { value: "order", label: "Order Product" },
//     { value: "refund", label: "Refund" },
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
//                     <h2>
//                       {formatPrice(
//                         revenueSource === 2
//                           ? contractServicesRevenue
//                           : revenueByService.reduce((sum, item) => sum + item.revenue, 0)
//                       )}
//                     </h2>
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
//               {(filterType === 0 && chartData.hourlyRevenue.length === 0) ||
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
//             <Card.Header className="d-flex align-items-center justify-content-between">
//               <h5 className="mb-0">Transaction Details</h5>
//               <Form.Group className="mb-0" style={{ maxWidth: "300px" }}>
//                 <Form.Label className="filter-label mb-1">
//                   <Filter size={18} className="me-2" />
//                   Purpose
//                 </Form.Label>
//                 <Dropdown onSelect={(value) => setPurposeFilter(value)}>
//                   <Dropdown.Toggle variant="outline-primary" id="dropdown-purpose-filter">
//                     {purposeOptions.find((opt) => opt.value === purposeFilter)?.label}
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     {purposeOptions.map((option) => (
//                       <Dropdown.Item key={option.value} eventKey={option.value}>
//                         {option.label}
//                       </Dropdown.Item>
//                     ))}
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </Form.Group>
//             </Card.Header>
//             <Card.Body>
//               {filteredPayments.length === 0 ? (
//                 <p className="text-muted">No transactions found.</p>
//               ) : (
//                 <div className="table-responsive">
//                   <Table striped bordered hover responsive>
//                     <thead>
//                       <tr>
//                         <th className="text-center">Transaction ID</th>
//                         <th className="text-center">Type</th>
//                         <th className="text-center">Status</th>
//                         <th className="text-center">Purpose</th>
//                         <th className="text-center">Amount</th>
//                         <th className="text-center" onClick={handleSortByDate} style={{ cursor: "pointer" }}>
//                           Created At {sortOrder === "desc" ? "↓" : "↑"}
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredPayments.map((payment) => (
//                         <tr key={payment.paymentId}>
//                           <td className="text-center">{payment.transactionId || "N/A"}</td>
//                           <td className="text-center">{payment.type || "N/A"}</td>
//                           <td className="text-center">
//                             <span
//                               className={
//                                 getStatusText(payment.status).toLowerCase() === "completed"
//                                   ? "status-completed"
//                                   : getStatusText(payment.status).toLowerCase() === "canceled"
//                                     ? "status-cancel"
//                                     : ""
//                               }
//                             >
//                               {getStatusText(payment.status)}
//                             </span>
//                           </td>
//                           <td className="text-center">{formatPurposeText(payment.purpose)}</td>
//                           <td className="text-center">{formatPrice(payment.amount)}</td>
//                           <td className="text-center">{formatDate(payment.creatAt)}</td>
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

//sửa ngày 06/06/2025

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

const OrderRevenuePerformancePage = () => {
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterType, setFilterType] = useState(3); // Default: This Year
  const [revenueSource, setRevenueSource] = useState(3); // Default: Total
  const [purposeFilter, setPurposeFilter] = useState("all"); // Purpose filter
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    paymentResponse: [],
  });
  const [contractServicesRevenue, setContractServicesRevenue] = useState(0); // Contract Services revenue
  const [souvenirSalesRevenue, setSouvenirSalesRevenue] = useState(0); // Souvenir Sales revenue
  const [festivalTicketSalesRevenue, setFestivalTicketSalesRevenue] = useState(0); // Festival Ticket Sales revenue
  const [chartData, setChartData] = useState({
    dailyRevenue: [],
    monthlyRevenue: [],
    hourlyRevenue: [],
  });
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all"); // Status filter
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState(10); // Số phần tử mỗi trang, mặc định 10
  const itemsPerPageOptions = [5, 10, 20]; // Các tùy chọn số phần tử mỗi trang

  // Format price to VND
  const formatPrice = (price) => {
    if (typeof price !== "number" || price == null) return "0 VND";
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Format date to HH:mm DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const timeDateRegex = /^(\d{2}):(\d{2})\s(\d{2})\/(\d{2})\/(\d{4})$/;
    if (timeDateRegex.test(dateString)) {
      return dateString;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "Complete":
        return "Completed";
      case "Pending":
        return "Pending";
      case "Cancel":
        return "Canceled";
      default:
        return status || "Unknown";
    }
  };

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
        return "Order Product";
      case "refund":
        return "Refund";
      default:
        return purposeLower
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
    }
  };

  // Handle sort by date
  const handleSortByDate = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);

    const sortedPayments = [...filteredPayments].sort((a, b) => {
      const parseDate = (dateStr) => {
        if (!dateStr || !/^\d{2}:\d{2}\s\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
          return new Date(0);
        }
        const [time, date] = dateStr.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        const [day, month, year] = date.split("/").map(Number);
        return new Date(year, month - 1, day, hours, minutes);
      };

      const dateA = parseDate(a.creatAt);
      const dateB = parseDate(b.creatAt);

      return newSortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredPayments(sortedPayments);
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

  // Fetch revenue for each service
  useEffect(() => {
    const fetchServiceRevenues = async () => {
      setIsLoading(true);
      try {
        // Fetch Souvenir Sales revenue (revenueSource === 0)
        if (revenueSource === 0 || revenueSource === 3) {
          const souvenirData = await RevenueService.getRevenue(filterType, 0);
          setSouvenirSalesRevenue(souvenirData?.totalRevenue || 0);
        } else {
          setSouvenirSalesRevenue(0); // Reset if not needed
        }

        // Fetch Festival Ticket Sales revenue (revenueSource === 1)
        if (revenueSource === 1 || revenueSource === 3) {
          const festivalData = await RevenueService.getRevenue(filterType, 1);
          setFestivalTicketSalesRevenue(festivalData?.totalRevenue || 0);
        } else {
          setFestivalTicketSalesRevenue(0); // Reset if not needed
        }

        // Fetch Contract Services revenue (revenueSource === 2)
        if (revenueSource === 2 || revenueSource === 3) {
          const contractData = await RevenueService.getRevenue(filterType, 2);
          setContractServicesRevenue(contractData?.totalRevenue || 0);
        } else {
          setContractServicesRevenue(0); // Reset if not needed
        }
      } catch (error) {
        setError(error.message);
        setSouvenirSalesRevenue(0);
        setFestivalTicketSalesRevenue(0);
        setContractServicesRevenue(0);
        toast.error("Failed to fetch service revenues");
      } finally {
        setIsLoading(false);
      }
    };
    fetchServiceRevenues();
  }, [filterType, revenueSource]);

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await RevenueService.getRevenueChart(filterType, revenueSource);
        setChartData({
          dailyRevenue: data.dailyRevenue || [],
          monthlyRevenue: data.monthlyRevenue || [],
          hourlyRevenue: data.hourlyRevenue || [],
        });
      } catch (error) {
        setError(error.message);
        setChartData({ dailyRevenue: [], monthlyRevenue: [], hourlyRevenue: [] });
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
        const sortedPayments = (data || []).sort((a, b) => {
          const parseDate = (dateStr) => {
            if (!dateStr || !/^\d{2}:\d{2}\s\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
              return new Date(0);
            }
            const [time, date] = dateStr.split(" ");
            const [hours, minutes] = time.split(":").map(Number);
            const [day, month, year] = date.split("/").map(Number);
            return new Date(year, month - 1, day, hours, minutes);
          };

          const dateA = parseDate(a.creatAt);
          const dateB = parseDate(b.creatAt);

          return dateB - dateA;
        });
        setPayments(sortedPayments);
        setFilteredPayments(sortedPayments);
      } catch (error) {
        setError(error.message);
        setPayments([]);
        setFilteredPayments([]);
        toast.error(error.message, { autoClose: 8000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Filter payments by purpose
  useEffect(() => {
    let filtered = payments;

    // Filter by Purpose
    if (purposeFilter !== "all") {
      filtered = filtered.filter(
        (payment) => payment.purpose?.toLowerCase() === purposeFilter.toLowerCase()
      );
    }

    // Filter by Status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (payment) => getStatusText(payment.status).toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredPayments(filtered);
  }, [payments, purposeFilter, statusFilter]);

  // Calculate revenue by service
  const calculateRevenueByService = () => {
    const result = [];
    if (revenueSource === 0) {
      result.push({ service: "Souvenir Sales", revenue: souvenirSalesRevenue });
    } else if (revenueSource === 1) {
      result.push({ service: "Festival Ticket Sales", revenue: festivalTicketSalesRevenue });
    } else if (revenueSource === 2) {
      result.push({ service: "Contract Services", revenue: contractServicesRevenue });
    } else if (revenueSource === 3) {
      result.push(
        { service: "Souvenir Sales", revenue: souvenirSalesRevenue },
        { service: "Festival Ticket Sales", revenue: festivalTicketSalesRevenue },
        { service: "Contract Services", revenue: contractServicesRevenue }
      );
    }
    return result;
  };

  // Xử lý thay đổi số lượng phần tử mỗi trang
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi số lượng phần tử
  };

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Tính toán dữ liệu phân trang
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPayments.slice(startIndex, endIndex);
  };

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Prepare chart data
  const prepareChartData = () => {
    let labels = [];
    let data = [];

    if (filterType === 0) {
      // Hourly chart for Today
      labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      data = chartData.hourlyRevenue.length > 0
        ? new Array(24).fill(0).map((_, index) => {
          const item = chartData.hourlyRevenue.find(item => parseInt(item.hour, 10) === index);
          return item ? item.totalRevenue || 0 : 0;
        })
        : new Array(24).fill(0); // Đường ngang khi không có dữ liệu
    } else if (filterType === 1) {
      // Weekly chart
      labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      data = chartData.dailyRevenue.length > 0
        ? new Array(7).fill(0).map((_, index) => {
          const item = chartData.dailyRevenue.find(item => {
            const date = new Date(item.date);
            const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
            return dayIndex === index;
          });
          return item ? item.totalRevenue || 0 : 0;
        })
        : new Array(7).fill(0); // Đường ngang khi không có dữ liệu
    } else if (filterType === 2) {
      // Monthly chart
      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      data = chartData.dailyRevenue.length > 0
        ? new Array(daysInMonth).fill(0).map((_, index) => {
          const item = chartData.dailyRevenue.find(item => {
            const date = new Date(item.date);
            return date.getDate() - 1 === index;
          });
          return item ? item.totalRevenue || 0 : 0;
        })
        : new Array(daysInMonth).fill(0); // Đường ngang khi không có dữ liệu
    } else if (filterType === 3) {
      // Yearly chart
      labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      data = chartData.monthlyRevenue.length > 0
        ? new Array(12).fill(0).map((_, index) => {
          const item = chartData.monthlyRevenue.find(item => item.month - 1 === index);
          return item ? item.totalRevenue || 0 : 0;
        })
        : new Array(12).fill(0); // Đường ngang khi không có dữ liệu
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
        ticks: {
          autoSkip: true,
          maxTicksLimit: filterType === 0 ? 12 : undefined,
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
    { value: 0, label: "Souvenir Sales" },
    { value: 1, label: "Festival Ticket Sales" },
    { value: 2, label: "Contract Services" },
    { value: 3, label: "Total" },
  ];

  const purposeOptions = [
    { value: "all", label: "All" },
    { value: "buyticket", label: "Buy Ticket" },
    { value: "contractdeposit", label: "Contract Deposit" },
    { value: "contractsettlement", label: "Contract Settlement" },
    { value: "order", label: "Order Product" },
    { value: "refund", label: "Refund" },
  ];

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "canceled", label: "Canceled" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
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
                    <h2>
                      {formatPrice(
                        revenueSource === 3
                          ? souvenirSalesRevenue + festivalTicketSalesRevenue + contractServicesRevenue
                          : revenueSource === 0
                            ? souvenirSalesRevenue
                            : revenueSource === 1
                              ? festivalTicketSalesRevenue
                              : contractServicesRevenue
                      )}
                    </h2>
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
                            <td style={{ color: "#28a745", fontWeight: 600 }}>{formatPrice(item.revenue)}</td>
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
              <Line data={prepareChartData()} options={chartOptions} />
            </Card.Body>
          </Card>

          {/* Transaction Details */}
          <Card className="mb-4">
            <Card.Header className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Transaction Details</h5>
              <div className="d-flex align-items-center gap-3">
                <Form.Group className="mb-0" style={{ maxWidth: "200px" }}>
                  <Form.Label className="filter-label mb-1">
                    <Filter size={18} className="me-2" />
                    Purpose
                  </Form.Label>
                  <Dropdown onSelect={(value) => setPurposeFilter(value)}>
                    <Dropdown.Toggle variant="outline-primary" id="dropdown-purpose-filter">
                      {purposeOptions.find((opt) => opt.value === purposeFilter)?.label}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {purposeOptions.map((option) => (
                        <Dropdown.Item key={option.value} eventKey={option.value}>
                          {option.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Form.Group className="mb-0" style={{ maxWidth: "200px" }}>
                  <Form.Label className="filter-label mb-1">
                    <Filter size={18} className="me-2" />
                    Status
                  </Form.Label>
                  <Dropdown onSelect={(value) => setStatusFilter(value)}>
                    <Dropdown.Toggle variant="outline-primary" id="dropdown-status-filter">
                      {statusOptions.find((opt) => opt.value === statusFilter)?.label}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {statusOptions.map((option) => (
                        <Dropdown.Item key={option.value} eventKey={option.value}>
                          {option.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </div>
            </Card.Header>
            <Card.Body>
              {filteredPayments.length === 0 ? (
                <p className="text-muted">No transactions found.</p>
              ) : (
                <>
                  <div className="pagination-controls">
                    <div className="items-per-page">
                      <Form.Label className="filter-label">
                        <Filter size={18} className="me-2" />
                        Items per page
                      </Form.Label>
                      <Dropdown onSelect={handleItemsPerPageChange}>
                        <Dropdown.Toggle variant="outline-primary" id="dropdown-items-per-page">
                          {itemsPerPage}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {itemsPerPageOptions.map((option) => (
                            <Dropdown.Item key={option} eventKey={option}>
                              {option}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="pagination-nav">
                      <span className="page-info">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </div>
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
                        {getPaginatedData().map((payment) => {
                          const status = getStatusText(payment.status).toLowerCase();
                          const purpose = payment.purpose?.toLowerCase() || "";
                          const isRefund = purpose === "refund";

                          // Xác định màu sắc
                          const statusColor =
                            status === "completed"
                              ? "#28a745" // Xanh lá cho Completed
                              : status === "pending"
                                ? "#fd7e14" // Cam cho Pending
                                : "#000"; // Đen cho Canceled

                          const amountColor = isRefund ? "#dc3545" : statusColor; // Ưu tiên đỏ cho Refund, nếu không thì theo status
                          const amountPrefix = isRefund ? "-" : status === "completed" ? "+" : ""; // Dấu "-" cho Refund, "+" cho Completed

                          return (
                            <tr key={payment.paymentId}>
                              <td className="text-center">{payment.transactionId || "N/A"}</td>
                              <td className="text-center">{payment.type || "N/A"}</td>
                              <td className="text-center">
                                <span style={{ color: statusColor, fontWeight: 600 }}>
                                  {getStatusText(payment.status)}
                                </span>
                              </td>
                              <td className="text-center">
                                <span style={{ color: isRefund ? "#dc3545" : "#000", fontWeight: 600 }}>
                                  {formatPurposeText(payment.purpose)}
                                </span>
                              </td>
                              <td className="text-center">
                                <span style={{ color: amountColor, fontWeight: 600 }}>
                                  {amountPrefix}
                                  {formatPrice(payment.amount)}
                                </span>
                              </td>
                              <td className="text-center">{formatDate(payment.creatAt)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default OrderRevenuePerformancePage;