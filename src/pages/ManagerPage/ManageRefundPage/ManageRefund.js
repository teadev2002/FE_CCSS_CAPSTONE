import React, { useState, useEffect } from "react";
import { Table, Card, Pagination, Dropdown, Form } from "react-bootstrap";
import { ArrowUp, ArrowDown } from "lucide-react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import RefundButton from "./RefundButton";
import ViewRefundButton from "./ViewRefundButton";
import EditRefundButton from "./EditRefundButton";
import "../../../styles/Manager/ManageRefund.scss";

// Mock data
const mockRefunds = [
  {
    contractRefundId: "9a6208a9-bb7b-43a4-80a3-27bb11ea3ecc",
    contractId: "bfec26a5-d335-45a3-96fc-c78273c0f409",
    numberBank: null,
    bankName: null,
    accountBankName: null,
    createDate: "15/05/2025",
    updateDate: null,
    price: 1000,
    description: "hu r em",
    type: "SystemRefund",
    status: "Pending",
  },
  {
    contractRefundId: "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
    contractId: "cdef1234-5678-90ab-cdef-1234567890ab",
    numberBank: "1234567890",
    bankName: "Bank A",
    accountBankName: "John Doe",
    createDate: "10/05/2025",
    updateDate: "12/05/2025",
    price: 5000,
    description: "Refund for cancellation",
    type: "DepositRetained",
    status: "Paid",
  },
  {
    contractRefundId: "p1q2r3s4-t5u6-47v8-w9x0-y1z2a3b4c5d6",
    contractId: "7890abcd-ef12-3456-7890-abcdef123456",
    numberBank: "0987654321",
    bankName: "Bank B",
    accountBankName: "Jane Smith",
    createDate: "05/05/2025",
    updateDate: null,
    price: 2000,
    description: "Partial refund",
    type: "SystemRefund",
    status: "Pending",
  },
  {
    contractRefundId: "e1f2g3h4-i5j6-47k8-l9m0-n1o2p3q4r5s6",
    contractId: "4567defg-hi89-jkl0-mnop-456789abcdef",
    numberBank: null,
    bankName: null,
    accountBankName: null,
    createDate: "01/05/2025",
    updateDate: "03/05/2025",
    price: 3000,
    description: "Full refund due to error",
    type: "DepositRetained",
    status: "Paid",
  },
];

const ManageRefund = () => {
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Filter for Status
  const [typeFilter, setTypeFilter] = useState(""); // Filter for Type
  const [sortRefund, setSortRefund] = useState({
    field: "createDate",
    order: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 30];

  // Modal states
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);

  // Fetch refunds (mocked for now; replace with actual API call)
  const fetchRefunds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setRefunds(mockRefunds);
    } catch (err) {
      setError("Failed to fetch refunds.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  // Filter and sort refunds
  const filterAndSortData = (data, search, statusFilter, typeFilter, sort) => {
    let filtered = [...data];

    // Apply search filter
    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item)
          .filter((value) => value !== null)
          .some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter) {
      filtered = filtered.filter((item) => item.type === typeFilter);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let valueA = a[sort.field] ?? "";
      let valueB = b[sort.field] ?? "";
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
  const totalEntries = filteredRefunds.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedRefunds = filteredRefunds.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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
                  placeholder="Search by contract ID, description, or status..."
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
                      <th className="text-center">Refund ID</th>
                      <th className="text-center">Contract ID</th>
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
                        <td colSpan="12" className="text-center text-muted">
                          No refunds found{" "}
                          {searchTerm || statusFilter || typeFilter
                            ? "matching your filters"
                            : ""}
                        </td>
                      </tr>
                    ) : (
                      paginatedRefunds.map((refund) => (
                        <tr key={refund.contractRefundId}>
                          <td className="text-center">
                            {refund.contractRefundId}
                          </td>
                          <td className="text-center">{refund.contractId}</td>
                          <td className="text-center">
                            {refund.numberBank || "N/A"}
                          </td>
                          <td className="text-center">
                            {refund.bankName || "N/A"}
                          </td>
                          <td className="text-center">
                            {refund.accountBankName || "N/A"}
                          </td>
                          <td className="text-center">{refund.createDate}</td>
                          <td className="text-center">
                            {refund.updateDate || "N/A"}
                          </td>
                          <td className="text-center">{refund.price}</td>
                          <td className="text-center">{refund.description}</td>
                          <td className="text-center">{refund.type}</td>
                          <td className="text-center">{refund.status}</td>
                          <td className="text-center">
                            <div className="action-buttons">
                              <RefundButton
                                refund={refund}
                                showModal={showRefundModal}
                                setShowModal={setShowRefundModal}
                                setSelectedRefund={setSelectedRefund}
                              />
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
