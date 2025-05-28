// import React, { useState, useEffect } from "react";
// import { Table, Card, Pagination, Dropdown, Form } from "react-bootstrap";
// import { ArrowUp, ArrowDown } from "lucide-react";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import ViewRefundButton from "./ViewRefundButton";
// import EditRefundButton from "./EditRefundButton";
// import "../../../styles/Manager/ManageRefund.scss";
// import RefundService from "../../../services/RefundService/RefundService";

// const ManageRefund = () => {
//   const [refunds, setRefunds] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [sortRefund, setSortRefund] = useState({
//     field: "createDate",
//     order: "desc",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 20, 30];

//   // Modal states
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedRefund, setSelectedRefund] = useState(null);

//   // Fetch refunds using RefundService
//   const fetchRefunds = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await RefundService.getRefunds();
//       console.log("Raw API Response:", response);

//       // Handle different response structures
//       let fetchedRefunds = [];
//       if (Array.isArray(response)) {
//         fetchedRefunds = response;
//       } else if (response?.data && Array.isArray(response.data)) {
//         fetchedRefunds = response.data;
//       } else {
//         console.warn("Unexpected response format:", response);
//         throw new Error("Invalid API response format");
//       }
//       console.log("Fetched Refunds:", fetchedRefunds);

//       // Remove duplicates based on contractRefundId
//       const uniqueRefunds = Array.from(
//         new Map(
//           fetchedRefunds.map((r) => [
//             r.contractRefundId || `temp-${Math.random()}`,
//             r,
//           ])
//         ).values()
//       );
//       console.log("Unique Refunds:", uniqueRefunds);

//       // Normalize the API data
//       const normalizedRefunds = uniqueRefunds.map((refund) => ({
//         ...refund,
//         status: normalizeStatus(refund.status),
//         type: normalizeType(refund.type),
//         contractRefundId: refund.contractRefundId || "N/A",
//         contractId: refund.contractId || "N/A",
//         createDate: refund.createDate || "N/A",
//         updateDate: refund.updateDate || "N/A",
//         price: refund.price || 0,
//         description: refund.description || "N/A",
//         numberBank: refund.numberBank || "N/A",
//         bankName: refund.bankName || "N/A",
//         accountBankName: refund.accountBankName || "N/A",
//       }));
//       console.log("Normalized Refunds:", normalizedRefunds);

//       setRefunds(normalizedRefunds);
//     } catch (err) {
//       console.error("Error fetching refunds:", err);
//       setError(
//         err.message || "Failed to fetch refunds. Please try again later."
//       );
//       setRefunds([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper functions to normalize status and type
//   const normalizeStatus = (status) => {
//     if (!status) return "Pending";
//     const statusLower = status.toLowerCase();
//     if (statusLower === "pending") return "Pending";
//     if (statusLower === "paid") return "Paid";
//     return status;
//   };

//   const normalizeType = (type) => {
//     if (!type) return "SystemRefund";
//     const typeLower = type.toLowerCase(); // Fixed typo: toTypeLowerCase -> toLowerCase
//     if (typeLower === "system_refund" || typeLower === "systemrefund")
//       return "SystemRefund";
//     if (typeLower === "deposit_retained" || typeLower === "depositretained")
//       return "DepositRetained";
//     return type;
//   };

//   useEffect(() => {
//     fetchRefunds();
//   }, []);

//   // Filter and sort refunds
//   const filterAndSortData = (data, search, statusFilter, typeFilter, sort) => {
//     if (!Array.isArray(data)) {
//       console.warn("filterAndSortData received non-iterable data:", data);
//       return [];
//     }

//     let filtered = [...data];

//     // Apply search filter across all fields
//     if (search) {
//       filtered = filtered.filter((item) =>
//         Object.values(item)
//           .filter((value) => value !== null && value !== undefined)
//           .some((value) =>
//             String(value).toLowerCase().includes(search.toLowerCase())
//           )
//       );
//     }

//     // Apply status filter
//     if (statusFilter) {
//       filtered = filtered.filter(
//         (item) => item.status?.toLowerCase() === statusFilter.toLowerCase()
//       );
//     }

//     // Apply type filter
//     if (typeFilter) {
//       filtered = filtered.filter(
//         (item) => item.type?.toLowerCase() === typeFilter.toLowerCase()
//       );
//     }

//     // Apply sorting
//     return filtered.sort((a, b) => {
//       let valueA = a[sort.field] ?? "";
//       let valueB = b[sort.field] ?? "";
//       if (sort.field === "price") {
//         valueA = Number(valueA) || 0;
//         valueB = Number(valueB) || 0;
//         return sort.order === "asc" ? valueA - valueB : valueB - valueA;
//       }
//       valueA = String(valueA).toLowerCase();
//       valueB = String(valueB).toLowerCase();
//       return sort.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredRefunds = filterAndSortData(
//     refunds,
//     searchTerm,
//     statusFilter,
//     typeFilter,
//     sortRefund
//   );
//   console.log("Filtered Refunds:", filteredRefunds);
//   const totalEntries = filteredRefunds.length;
//   const totalPages = Math.ceil(totalEntries / rowsPerPage);
//   const paginatedRefunds = filteredRefunds.slice(
//     (currentPage - 1) * rowsPerPage,
//     currentPage * rowsPerPage
//   );
//   console.log("Paginated Refunds:", paginatedRefunds);

//   const startEntry = (currentPage - 1) * rowsPerPage + 1;
//   const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
//   const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

//   // Handlers
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleStatusFilterChange = (value) => {
//     setStatusFilter(value);
//     setCurrentPage(1);
//   };

//   const handleTypeFilterChange = (value) => {
//     setTypeFilter(value);
//     setCurrentPage(1);
//   };

//   const handleSort = (field) => {
//     setSortRefund((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page) => setCurrentPage(page);

//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="manage-refund">
//       <h2 className="manage-refund-title">Manage Refunds</h2>
//       <div className="table-container">
//         <Card className="refund-table-card">
//           <Card.Body>
//             <div className="table-header">
//               <h3>Refunds</h3>
//               <div className="filters">
//                 <Form.Select
//                   value={statusFilter}
//                   onChange={(e) => handleStatusFilterChange(e.target.value)}
//                   className="filter-select"
//                 >
//                   <option value="">All Statuses</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Paid">Paid</option>
//                 </Form.Select>
//                 <Form.Select
//                   value={typeFilter}
//                   onChange={(e) => handleTypeFilterChange(e.target.value)}
//                   className="filter-select"
//                 >
//                   <option value="">All Types</option>
//                   <option value="SystemRefund">System Refund</option>
//                   <option value="DepositRetained">Deposit Retained</option>
//                 </Form.Select>
//                 <Form.Control
//                   type="text"
//                   placeholder="Search account holder, description, status,..."
//                   value={searchTerm}
//                   onChange={handleSearch}
//                   className="search-input"
//                 />
//               </div>
//             </div>
//             {isLoading && (
//               <Box sx={{ width: "100%", marginY: 2 }}>
//                 <LinearProgress />
//               </Box>
//             )}
//             {error && <p className="error-message">{error}</p>}
//             {!isLoading && !error && (
//               <>
//                 <Table striped bordered hover responsive>
//                   <thead>
//                     <tr>
//                       <th className="text-center">Bank Number</th>
//                       <th className="text-center">Bank Name</th>
//                       <th className="text-center">Account Holder</th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("createDate")}
//                         >
//                           Created Date
//                           {sortRefund.field === "createDate" ? (
//                             sortRefund.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("updateDate")}
//                         >
//                           Updated Date
//                           {sortRefund.field === "updateDate" ? (
//                             sortRefund.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("price")}
//                         >
//                           Price
//                           {sortRefund.field === "price" ? (
//                             sortRefund.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">Description</th>
//                       <th className="text-center">Type</th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("status")}
//                         >
//                           Status
//                           {sortRefund.field === "status" ? (
//                             sortRefund.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedRefunds.length === 0 ? (
//                       <tr>
//                         <td colSpan="10" className="text-center text-muted">
//                           No refunds found{" "}
//                           {searchTerm || statusFilter || typeFilter
//                             ? "matching your filters"
//                             : refunds.length === 0
//                             ? "in the system"
//                             : ""}
//                         </td>
//                       </tr>
//                     ) : (
//                       paginatedRefunds.map((refund, index) => (
//                         <tr key={refund.contractRefundId || `refund-${index}`}>
//                           <td className="text-center">{refund.numberBank}</td>
//                           <td className="text-center">{refund.bankName}</td>
//                           <td className="text-center">
//                             {refund.accountBankName}
//                           </td>
//                           <td className="text-center">{refund.createDate}</td>
//                           <td className="text-center">{refund.updateDate}</td>
//                           <td className="text-center">
//                             {refund.price.toLocaleString()}
//                           </td>
//                           <td className="text-center">{refund.description}</td>
//                           <td className="text-center">{refund.type}</td>
//                           <td className="text-center">{refund.status}</td>
//                           <td className="text-center">
//                             <div className="action-buttons">
//                               <ViewRefundButton
//                                 refund={refund}
//                                 showModal={showViewModal}
//                                 setShowModal={setShowViewModal}
//                                 setSelectedRefund={setSelectedRefund}
//                               />
//                               <EditRefundButton
//                                 refund={refund}
//                                 showModal={showEditModal}
//                                 setShowModal={setShowEditModal}
//                                 setSelectedRefund={setSelectedRefund}
//                                 disabled={refund.status === "Paid"}
//                               />
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </Table>
//                 <div className="pagination-controls">
//                   <div className="pagination-info">
//                     <span>{showingText}</span>
//                     <div className="rows-per-page">
//                       <span>Rows per page: </span>
//                       <Dropdown
//                         onSelect={(value) =>
//                           handleRowsPerPageChange(Number(value))
//                         }
//                         className="d-inline-block"
//                       >
//                         <Dropdown.Toggle
//                           variant="secondary"
//                           id="dropdown-rows-per-page"
//                         >
//                           {rowsPerPage}
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu>
//                           {rowsPerPageOptions.map((option) => (
//                             <Dropdown.Item key={option} eventKey={option}>
//                               {option}
//                             </Dropdown.Item>
//                           ))}
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </div>
//                   </div>
//                   <Pagination>
//                     <Pagination.First
//                       onClick={() => handlePageChange(1)}
//                       disabled={currentPage === 1}
//                     />
//                     <Pagination.Prev
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                     />
//                     {[...Array(totalPages).keys()].map((page) => (
//                       <Pagination.Item
//                         key={page + 1}
//                         active={page + 1 === currentPage}
//                         onClick={() => handlePageChange(page + 1)}
//                       >
//                         {page + 1}
//                       </Pagination.Item>
//                     ))}
//                     <Pagination.Next
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                     />
//                     <Pagination.Last
//                       onClick={() => handlePageChange(totalPages)}
//                       disabled={currentPage === totalPages}
//                     />
//                   </Pagination>
//                 </div>
//               </>
//             )}
//           </Card.Body>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ManageRefund;

// chuyển tab goi api

import React, { useState, useEffect } from "react";
import { Table, Card, Pagination, Dropdown, Form } from "react-bootstrap";
import { ArrowUp, ArrowDown } from "lucide-react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ViewRefundButton from "./ViewRefundButton";
import EditRefundButton from "./EditRefundButton";
import "../../../styles/Manager/ManageRefund.scss";
import RefundService from "../../../services/RefundService/RefundService";

const ManageRefund = () => {
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortRefund, setSortRefund] = useState({
    field: "createDate",
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 30];
  // New state for throttling
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const minInterval = 5000; // 5-second throttle

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);

  // Fetch refunds using RefundService
  const fetchRefunds = async () => {
    const currentTime = Date.now();
    if (currentTime - lastFetchTime < minInterval) {
      console.log("⏳ Skipping API call due to throttling");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await RefundService.getRefunds();
      console.log("Raw API Response:", response);

      // Handle different response structures
      let fetchedRefunds = [];
      if (Array.isArray(response)) {
        fetchedRefunds = response;
      } else if (response?.data && Array.isArray(response.data)) {
        fetchedRefunds = response.data;
      } else {
        console.warn("Unexpected response format:", response);
        throw new Error("Invalid API response format");
      }
      console.log("Fetched Refunds:", fetchedRefunds);

      // Remove duplicates based on contractRefundId
      const uniqueRefunds = Array.from(
        new Map(
          fetchedRefunds.map((r) => [
            r.contractRefundId || `temp-${Math.random()}`,
            r,
          ])
        ).values()
      );
      console.log("Unique Refunds:", uniqueRefunds);

      // Normalize the API data
      const normalizedRefunds = uniqueRefunds.map((refund) => ({
        ...refund,
        status: normalizeStatus(refund.status),
        type: normalizeType(refund.type),
        contractRefundId: refund.contractRefundId || "N/A",
        contractId: refund.contractId || "N/A",
        createDate: refund.createDate || "N/A",
        updateDate: refund.updateDate || "N/A",
        price: refund.price || 0,
        description: refund.description || "N/A",
        numberBank: refund.numberBank || "N/A",
        bankName: refund.bankName || "N/A",
        accountBankName: refund.accountBankName || "N/A",
      }));
      console.log("Normalized Refunds:", normalizedRefunds);

      setRefunds(normalizedRefunds);
      setLastFetchTime(currentTime);
    } catch (err) {
      console.error("Error fetching refunds:", err);
      setError(
        err.message || "Failed to fetch refunds. Please try again later."
      );
      setRefunds([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to normalize status and type
  const normalizeStatus = (status) => {
    if (!status) return "Pending";
    const statusLower = status.toLowerCase();
    if (statusLower === "pending") return "Pending";
    if (statusLower === "paid") return "Paid";
    return status;
  };

  const normalizeType = (type) => {
    if (!type) return "SystemRefund";
    const typeLower = type.toLowerCase();
    if (typeLower === "system_refund" || typeLower === "systemrefund")
      return "SystemRefund";
    if (typeLower === "deposit_retained" || typeLower === "depositretained")
      return "DepositRetained";
    return type;
  };

  useEffect(() => {
    // Initial data fetch
    fetchRefunds();
  }, []);

  useEffect(() => {
    // Add visibility change listener for tab switch
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("🔄 Browser tab active, fetching refunds...");
        fetchRefunds();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []); // Empty dependency array to set up listener once

  // Filter and sort refunds
  const filterAndSortData = (data, search, statusFilter, typeFilter, sort) => {
    if (!Array.isArray(data)) {
      console.warn("filterAndSortData received non-iterable data:", data);
      return [];
    }

    let filtered = [...data];

    // Apply search filter across all fields
    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item)
          .filter((value) => value !== null && value !== undefined)
          .some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter(
        (item) => item.type?.toLowerCase() === typeFilter.toLowerCase()
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let valueA = a[sort.field] ?? "";
      let valueB = b[sort.field] ?? "";
      if (sort.field === "price") {
        valueA = Number(valueA) || 0;
        valueB = Number(valueB) || 0;
        return sort.order === "asc" ? valueA - valueB : valueB - valueA;
      }
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredRefunds = filterAndSortData(
    refunds,
    searchTerm,
    statusFilter,
    typeFilter,
    sortRefund
  );
  console.log("Filtered Refunds:", filteredRefunds);
  const totalEntries = filteredRefunds.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedRefunds = filteredRefunds.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  console.log("Paginated Refunds:", paginatedRefunds);

  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortRefund((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="manage-refund">
      <h2 className="manage-refund-title">Manage Refunds</h2>
      <div className="table-container">
        <Card className="refund-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Refunds</h3>
              <div className="filters">
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </Form.Select>
                <Form.Select
                  value={typeFilter}
                  onChange={(e) => handleTypeFilterChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Types</option>
                  <option value="SystemRefund">System Refund</option>
                  <option value="DepositRetained">Deposit Retained</option>
                </Form.Select>
                <Form.Control
                  type="text"
                  placeholder="Search account holder, description, status,..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
            </div>
            {isLoading && (
              <Box sx={{ width: "100%", marginY: 2 }}>
                <LinearProgress />
              </Box>
            )}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">Bank Number</th>
                      <th className="text-center">Bank Name</th>
                      <th className="text-center">Account Holder</th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("createDate")}
                        >
                          Created Date
                          {sortRefund.field === "createDate" ? (
                            sortRefund.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("updateDate")}
                        >
                          Updated Date
                          {sortRefund.field === "updateDate" ? (
                            sortRefund.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("price")}
                        >
                          Price
                          {sortRefund.field === "price" ? (
                            sortRefund.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Description</th>
                      <th className="text-center">Type</th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSort("status")}
                        >
                          Status
                          {sortRefund.field === "status" ? (
                            sortRefund.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRefunds.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center text-muted">
                          No refunds found{" "}
                          {searchTerm || statusFilter || typeFilter
                            ? "matching your filters"
                            : refunds.length === 0
                            ? "in the system"
                            : ""}
                        </td>
                      </tr>
                    ) : (
                      paginatedRefunds.map((refund, index) => (
                        <tr key={refund.contractRefundId || `refund-${index}`}>
                          <td className="text-center">{refund.numberBank}</td>
                          <td className="text-center">{refund.bankName}</td>
                          <td className="text-center">
                            {refund.accountBankName}
                          </td>
                          <td className="text-center">{refund.createDate}</td>
                          <td className="text-center">{refund.updateDate}</td>
                          <td className="text-center">
                            {refund.price.toLocaleString()}
                          </td>
                          <td className="text-center">{refund.description}</td>
                          <td className="text-center">{refund.type}</td>
                          <td className="text-center">{refund.status}</td>
                          <td className="text-center">
                            <div className="action-buttons">
                              <ViewRefundButton
                                refund={refund}
                                showModal={showViewModal}
                                setShowModal={setShowViewModal}
                                setSelectedRefund={setSelectedRefund}
                              />
                              <EditRefundButton
                                refund={refund}
                                showModal={showEditModal}
                                setShowModal={setShowEditModal}
                                setSelectedRefund={setSelectedRefund}
                                disabled={refund.status === "Paid"}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                <div className="pagination-controls">
                  <div className="pagination-info">
                    <span>{showingText}</span>
                    <div className="rows-per-page">
                      <span>Rows per page: </span>
                      <Dropdown
                        onSelect={(value) =>
                          handleRowsPerPageChange(Number(value))
                        }
                        className="d-inline-block"
                      >
                        <Dropdown.Toggle
                          variant="secondary"
                          id="dropdown-rows-per-page"
                        >
                          {rowsPerPage}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {rowsPerPageOptions.map((option) => (
                            <Dropdown.Item key={option} eventKey={option}>
                              {option}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages).keys()].map((page) => (
                      <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ManageRefund;
