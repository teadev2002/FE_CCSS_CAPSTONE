// import React from "react";
// import { Card, Row, Col, Table, ProgressBar } from "react-bootstrap";
// import {
//   Star,
//   Clock,
//   Award,
//   TrendingUp,
//   Users as UsersIcon,
// } from "lucide-react";
// import "../../../styles/Admin/UserPerformancePage.scss";

// const UserPerformancePage = () => {
//   // Customer data
//   const topCustomers = [
//     {
//       id: 1,
//       name: "Sarah Chen",
//       rentals: 156,
//       membership: "VIP",
//     },
//     {
//       id: 2,
//       name: "Viết Quộc",
//       rentals: 156,
//       membership: "VIP",
//     },
//     // ... (other customer data)
//   ];

//   // Cosplayer data
//   const topCosplayers = [
//     {
//       id: 1,
//       name: "Alex Mercer",
//       bookings: 89,
//       rating: 4.9,
//       responseTime: "5 min",
//     },
//     {
//       id: 2,
//       name: "Nương Pham",
//       bookings: 89,
//       rating: 4.9,
//       responseTime: "5 min",
//     },
//     // ... (other cosplayer data)
//   ];

//   const responseRates = [
//     { timeFrame: "Under 5 minutes", percentage: 45 },
//     // ... (other response rate data)
//   ];

//   return (
//     <div className="user-performance">
//       <h1>User Performance</h1>

//       <Row className="performance-stats mb-4">
//         {/* Customer Section */}
//         <Col md={6} lg={3}>
//           <Card className="stat-card">
//             <Card.Body>
//               <div className="stat-icon">
//                 <UsersIcon size={24} />
//               </div>
//               <h3>Active Customers</h3>
//               <h2>1,247</h2>
//               <p className="trend positive">+15.3% this month</p>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Cosplayer Section */}
//         <Col md={6} lg={3}>
//           <Card className="stat-card">
//             <Card.Body>
//               <div className="stat-icon">
//                 <Award size={24} />
//               </div>
//               <h3>Average Cosplayer Rating</h3>
//               <div className="rating-display">
//                 <h2>4.8</h2>
//                 <div className="stars">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       size={16}
//                       className={i < 4 ? "star-filled" : "star-empty"}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <p className="trend positive">+0.2 from last month</p>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Cosplayer Bookings */}
//         <Col md={6} lg={3}>
//           <Card className="stat-card">
//             <Card.Body>
//               <div className="stat-icon">
//                 <TrendingUp size={24} />
//               </div>
//               <h3>Total Cosplayer Bookings</h3>
//               <h2>2,315</h2>
//               <p className="trend positive">+12.7% this month</p>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Response Time */}
//         <Col md={6} lg={3}>
//           <Card className="stat-card">
//             <Card.Body>
//               <div className="stat-icon">
//                 <Clock size={24} />
//               </div>
//               <h3>Avg Response Time</h3>
//               <h2>6.5 min</h2>
//               <p className="trend positive">-2 min from last month</p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       <Row>
//         {/* Top Customers */}
//         <Col lg={6}>
//           <Card className="mb-4">
//             <Card.Header>
//               <h5 className="mb-0">Top Customers</h5>
//             </Card.Header>
//             <Card.Body>
//               <Table responsive>
//                 <thead>
//                   <tr>
//                     <th>Rank</th>
//                     <th>Name</th>
//                     <th>Rentals</th>
//                     <th>Membership</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {topCustomers.map((customer, index) => (
//                     <tr key={customer.id}>
//                       <td>#{index + 1}</td>
//                       <td>{customer.name}</td>
//                       <td>{customer.rentals}</td>
//                       <td>{customer.membership}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Top Cosplayers */}
//         <Col lg={6}>
//           <Card className="mb-4">
//             <Card.Header>
//               <h5 className="mb-0">Top Cosplayers</h5>
//             </Card.Header>
//             <Card.Body>
//               <Table responsive>
//                 <thead>
//                   <tr>
//                     <th>Rank</th>
//                     <th>Name</th>
//                     <th>Bookings</th>
//                     <th>Rating</th>
//                     <th>Response Time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {topCosplayers.map((cosplayer, index) => (
//                     <tr key={cosplayer.id}>
//                       <td>#{index + 1}</td>
//                       <td>{cosplayer.name}</td>
//                       <td>{cosplayer.bookings}</td>
//                       <td>
//                         <div className="rating-cell">
//                           {cosplayer.rating}
//                           <Star size={14} className="star-filled ms-1" />
//                         </div>
//                       </td>
//                       <td>{cosplayer.responseTime}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Response Time Distribution */}
//         <Col lg={12}>
//           <Card>
//             <Card.Header>
//               <h5 className="mb-0">Cosplayer Response Time Distribution</h5>
//             </Card.Header>
//             <Card.Body>
//               {responseRates.map((rate, index) => (
//                 <div key={index} className="response-rate-item">
//                   <div className="d-flex justify-content-between mb-1">
//                     <span>{rate.timeFrame}</span>
//                     <span>{rate.percentage}%</span>
//                   </div>
//                   <ProgressBar
//                     now={rate.percentage}
//                     variant={
//                       index === 0
//                         ? "success"
//                         : index === 1
//                         ? "info"
//                         : index === 2
//                         ? "warning"
//                         : "danger"
//                     }
//                     className="mb-3"
//                   />
//                 </div>
//               ))}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default UserPerformancePage;

import React from "react";
import { Card, Row, Col, Table, ProgressBar } from "react-bootstrap";
import {
  Star,
  Clock,
  Award,
  TrendingUp,
  Users as UsersIcon,
} from "lucide-react";
import "../../../styles/Admin/UserPerformancePage.scss";

const UserPerformancePage = () => {
  const topCustomers = [
    { id: 1, name: "Sarah Chen", rentals: 156, membership: "VIP" },
    { id: 2, name: "Viết Quốc", rentals: 142, membership: "VIP" },
  ];

  const topCosplayers = [
    {
      id: 1,
      name: "Alex Mercer",
      bookings: 89,
      rating: 4.9,
      responseTime: "5 min",
    },
    {
      id: 2,
      name: "Nương Phạm",
      bookings: 82,
      rating: 4.8,
      responseTime: "6 min",
    },
  ];

  const responseRates = [
    { timeFrame: "Under 5 minutes", percentage: 45 },
    { timeFrame: "5-15 minutes", percentage: 30 },
    { timeFrame: "15-30 minutes", percentage: 15 },
    { timeFrame: "Over 30 minutes", percentage: 10 },
  ];

  return (
    <div className="user-performance">
      <h1>User Performance</h1>

      <div className="performance-stats">
        <Card className="stat-card">
          <Card.Body>
            <div className="stat-icon">
              <UsersIcon size={24} />
            </div>
            <h3>Active Customers</h3>
            <h2>1,247</h2>
            <p className="trend positive">+15.3% this month</p>
          </Card.Body>
        </Card>

        <Card className="stat-card">
          <Card.Body>
            <div className="stat-icon">
              <Award size={24} />
            </div>
            <h3>Average Cosplayer Rating</h3>
            <div className="rating-display">
              <h2>4.8</h2>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < 4 ? "star-filled" : "star-empty"}
                  />
                ))}
              </div>
            </div>
            <p className="trend positive">+0.2 from last month</p>
          </Card.Body>
        </Card>

        <Card className="stat-card">
          <Card.Body>
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <h3>Total Cosplayer Bookings</h3>
            <h2>2,315</h2>
            <p className="trend positive">+12.7% this month</p>
          </Card.Body>
        </Card>

        <Card className="stat-card">
          <Card.Body>
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <h3>Avg Response Time</h3>
            <h2>6.5 min</h2>
            <p className="trend positive">-2 min from last month</p>
          </Card.Body>
        </Card>
      </div>

      <Row>
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5>Top Customers</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Rentals</th>
                    <th>Membership</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, index) => (
                    <tr key={customer.id}>
                      <td>#{index + 1}</td>
                      <td>{customer.name}</td>
                      <td>{customer.rentals}</td>
                      <td>{customer.membership}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card>
            <Card.Header>
              <h5>Top Cosplayers</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Bookings</th>
                    <th>Rating</th>
                    <th>Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {topCosplayers.map((cosplayer, index) => (
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
                      <td>{cosplayer.responseTime}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card>
            <Card.Header>
              <h5>Cosplayer Response Time Distribution</h5>
            </Card.Header>
            <Card.Body>
              {responseRates.map((rate, index) => (
                <div key={index} className="response-rate-item">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{rate.timeFrame}</span>
                    <span>{rate.percentage}%</span>
                  </div>
                  <ProgressBar
                    now={rate.percentage}
                    variant={
                      index === 0
                        ? "success"
                        : index === 1
                        ? "info"
                        : index === 2
                        ? "warning"
                        : "danger"
                    }
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserPerformancePage;
