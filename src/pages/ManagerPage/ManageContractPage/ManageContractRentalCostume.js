/// filter status===================================================================
import React, { useState, useEffect, useMemo } from "react";
import { Table, Modal as BootstrapModal, Form, Card } from "react-bootstrap";
import { Button, Popconfirm, Input, Pagination, Dropdown, Menu } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
import ViewApprovedContractRentalCostume from "./ViewApprovedContractRentalCostume";
import "../../../styles/Manager/ManageContract.scss";
import ManageDeliveryRentalCostume from "./ManageDeliveryRentalCostume";
import RefundButton from "./RefundButton";
import dayjs from "dayjs";
import RefundService from "../../../services/RefundService/RefundService.js";

const { TextArea } = Input;

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ManageContractRentalCostume = () => {
  const [tabValue, setTabValue] = useState(0);
  const [contracts, setContracts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRequestBased, setIsRequestBased] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    deposit: "",
    requestId: "",
  });
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [searchContract, setSearchContract] = useState("");
  const [searchRequest, setSearchRequest] = useState("");
  const [sortContract, setSortContract] = useState({
    field: " ",
    order: " ",
  });
  const [sortRequest, setSortRequest] = useState({
    field: " ",
    order: " ",
  });
  const [currentPageContract, setCurrentPageContract] = useState(1);
  const [currentPageRequest, setCurrentPageRequest] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 15, 30];
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [refundStatus, setRefundStatus] = useState({});
  const [statusFilter, setStatusFilter] = useState(null); // New state for status filter
  const handleShowDeliveryModal = (contractId) => {
    setSelectedContractId(contractId);
    setDeliveryModalVisible(true);
  };

  const handleCloseDeliveryModal = () => {
    setDeliveryModalVisible(false);
    setSelectedContractId(null);
  };

  const handleShowRefundModal = (contractId) => {
    setSelectedContractId(contractId);
    setRefundModalVisible(true);
  };

  const handleCloseRefundModal = () => {
    setRefundModalVisible(false);
    setSelectedContractId(null);
  };

  const formatDate = (date) => {
    if (
      !date ||
      date === "N/A" ||
      !dayjs(date, ["HH:mm DD/MM/YYYY", "DD/MM/YYYY"], true).isValid()
    ) {
      return "N/A";
    }
    return dayjs(date, ["HH:mm DD/MM/YYYY", "DD/MM/YYYY"]).format("DD/MM/YYYY");
  };

  const handleCompleteContract = async (contractId) => {
    if (!contractId) return;
    try {
      await ManageContractService.updateContractStatus(contractId, "Completed");
      setContracts((prev) =>
        prev.map((con) =>
          con.contractId === contractId ? { ...con, status: "Completed" } : con
        )
      );
      toast.success("Contract completed successfully!");
    } catch (error) {
      console.error("Error completing contract:", error);
      toast.error(
        error.response?.data?.message || "Failed to complete contract."
      );
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch contracts
        const contractData = await ManageContractService.getAllContracts();
        const validContracts = await Promise.all(
          contractData.map(async (con) => {
            if (!con.contractId || !con.requestId) return null;
            try {
              const request = await ManageContractService.getRequestByRequestId(
                con.requestId
              );
              if (request?.serviceId === "S001") {
                return {
                  ...con,
                  contractName: con.contractName || "N/A",
                  price: con.price || 0,
                  status: con.status || "N/A",
                  createDate: con.createDate || "N/A",
                  startDate: con.startDate || "N/A",
                  endDate: con.endDate || "N/A",
                  requestId: con.requestId || "",
                };
              }
              return null;
            } catch (error) {
              console.warn(
                `Failed to fetch request for contract ${con.contractId}:`,
                error
              );
              return null;
            }
          })
        );
        const filteredContracts = validContracts.filter((con) => con !== null);
        if (isMounted) setContracts(filteredContracts);

        // Fetch requests
        const requestData = await ManageContractService.getAllRequests();
        const formattedData = requestData
          .filter(
            (req) =>
              ["browsed", "approved"].includes(req.status?.toLowerCase()) &&
              req.serviceId === "S001"
          )
          .map((req) => {
            let startDate = req.startDate || "N/A";
            let endDate = req.endDate || "N/A";
            if (
              req.costumesListResponse?.length > 0 &&
              req.costumesListResponse[0]?.requestDateResponses?.length > 0
            ) {
              const dateResponse =
                req.costumesListResponse[0].requestDateResponses[0];
              startDate = formatDate(dateResponse.startDate);
              endDate = formatDate(dateResponse.endDate);
            } else {
              startDate = formatDate(req.startDate);
              endDate = formatDate(req.endDate);
            }
            return {
              id: req.requestId,
              serviceId: "S001",
              name: req.name || "N/A",
              description: req.description || "N/A",
              location: req.location || "N/A",
              price: req.price || 0,
              deposit: req.deposit || 0,
              statusRequest: mapStatus(req.status),
              startDate,
              endDate,
              reason: req.reason || "",
              contractId: req.contractId || null,
              costumesListResponse: req.costumesListResponse || [],
            };
          });
        if (isMounted) setRequests(formattedData);

        // Fetch refunds
        const refundData = await RefundService.getRefunds();
        const refundStatusMap = {};
        refundData.forEach((refund) => {
          if (refund.contractId && refund.contractRefundId) {
            refundStatusMap[refund.contractId] = true;
          }
        });
        if (isMounted) setRefundStatus(refundStatusMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const mapStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Pending";
      case "browsed":
        return "Browsed";
      case "approved":
        return "Approved";
      case "cancel":
        return "Cancel";
      default:
        return "Unknown";
    }
  };

  const filterAndSortContracts = (data, search) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter((item) => {
        const name = item.contractName ? item.contractName.toLowerCase() : "";
        const status = item.status ? item.status.toLowerCase() : "";
        return (
          name.includes(search.toLowerCase()) ||
          status.includes(search.toLowerCase())
        );
      });
    }
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    return filtered.sort((a, b) => {
      let valueA = a[sortContract.field] || "";
      let valueB = b[sortContract.field] || "";
      if (sortContract.field === "price") {
        valueA = valueA || 0;
        valueB = valueB || 0;
        return sortContract.order === "asc" ? valueA - valueB : valueB - valueA;
      }
      valueA = valueA ? String(valueA).toLowerCase() : "";
      valueB = valueB ? String(valueB).toLowerCase() : "";
      return sortContract.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };
  const filteredContracts = filterAndSortContracts(contracts, searchContract);

  const totalPagesContract = useMemo(
    () => Math.ceil(filteredContracts.length / rowsPerPage),
    [filteredContracts.length, rowsPerPage]
  );

  useEffect(() => {
    if (currentPageContract > totalPagesContract && totalPagesContract > 0) {
      setCurrentPageContract(1);
    }
  }, [totalPagesContract, currentPageContract]);

  const paginatedContracts = paginateData(
    filteredContracts,
    currentPageContract
  );

  const filterAndSortRequests = (data, search) => {
    let filtered = [...data];
    const contractRequestIds = contracts.map((con) => con.requestId);
    filtered = filtered.filter((req) => !contractRequestIds.includes(req.id));
    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return filtered.sort((a, b) => {
      let valueA = a[sortRequest.field];
      let valueB = b[sortRequest.field];
      if (sortRequest.field === "price") {
        valueA = valueA || 0;
        valueB = valueB || 0;
        return sortRequest.order === "asc" ? valueA - valueB : valueB - valueA;
      }
      valueA = valueA ? String(valueA).toLowerCase() : "";
      valueB = valueB ? String(valueB).toLowerCase() : "";
      return sortContract.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredRequests = filterAndSortRequests(requests, searchRequest);

  const totalPagesRequest = useMemo(
    () => Math.ceil(filteredRequests.length / rowsPerPage),
    [filteredRequests.length, rowsPerPage]
  );

  const totalEntries = filteredRequests.length;

  useEffect(() => {
    if (currentPageRequest > totalPagesRequest && totalPagesRequest > 0) {
      setCurrentPageRequest(1);
    }
  }, [totalPagesRequest, currentPageRequest]);

  const paginatedRequests = paginateData(filteredRequests, currentPageRequest);

  function paginateData(data, page, perPage = rowsPerPage) {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
  }

  const handleShowModal = (item = null, request = null) => {
    if (item) {
      setIsEditing(true);
      setIsRequestBased(false);
      setCurrentItem(item);
      setFormData({
        customerName: item.customerName || "N/A",
        deposit: item.deposit || "0",
        requestId: item.requestId || "",
      });
    } else if (request) {
      if (request.contractId) return;
      setIsEditing(false);
      setIsRequestBased(true);
      setCurrentItem(request);
      setFormData({
        customerName: request.name || "N/A",
        deposit: request.deposit ? `${request.deposit}` : "0",
        requestId: request.id || "",
      });
    } else {
      setIsEditing(false);
      setIsRequestBased(false);
      setFormData({ customerName: "", deposit: "", requestId: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setIsRequestBased(false);
    setCurrentItem(null);
    setFormData({ customerName: "", deposit: "", requestId: "" });
  };

  const handleSubmit = async () => {
    if (!formData.requestId) return;
    try {
      const depositValue = parseFloat(formData.deposit.replace("%", "")) || 0;
      const newContract = await ManageContractService.createContract(
        formData.requestId,
        depositValue
      );
      setContracts([...contracts, newContract]);
      if (isRequestBased) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === currentItem.id
              ? { ...req, contractId: newContract.contractId }
              : req
          )
        );
      }
      toast.success("Contract created successfully!");
      window.location.reload();
      handleCloseModal();
    } catch (error) {
      console.error("Error creating contract:", error);
    }
  };

  const handleViewDetail = (requestId) => {
    setSelectedRequestId(requestId);
    setViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setViewModalVisible(false);
    setSelectedRequestId(null);
  };

  const handleSortContract = (field) => {
    setSortContract((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPageContract(1);
  };

  const handleSortRequest = (field) => {
    setSortRequest((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPageRequest(1);
  };

  const handlePageChangeContract = (page) => setCurrentPageContract(page);
  const handlePageChangeRequest = (page) => setCurrentPageRequest(page);

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPageContract(1);
    setCurrentPageRequest(1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <div className="manage-general">
      <h2 className="manage-general-title">
        Rental Costume Requests & Contracts
      </h2>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="manage tabs"
            style={{ marginLeft: "20vh" }}
          >
            <Tab
              label="Approved Requests"
              {...a11yProps(0)}
              style={{ color: "white" }}
            />
            <Tab
              label="Contracts"
              {...a11yProps(1)}
              style={{ color: "white" }}
            />
          </Tabs>
        </Box>

        <CustomTabPanel value={tabValue} index={0}>
          <div className="table-container">
            <Card className="status-table-card">
              <Card.Body>
                <div className="table-header">
                  <h3>Approved Requests</h3>
                  <Form.Control
                    type="text"
                    placeholder="Search requests..."
                    value={searchRequest}
                    onChange={(e) => setSearchRequest(e.target.value)}
                    className="search-input"
                  />
                </div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th onClick={() => handleSortRequest("name")}>
                        Name{" "}
                        {sortRequest.field === "name" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSortRequest("description")}>
                        Description{" "}
                        {sortRequest.field === "description" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th>Location</th>
                      <th onClick={() => handleSortRequest("price")}>
                        Price{" "}
                        {sortRequest.field === "price" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSortRequest("statusRequest")}>
                        Status{" "}
                        {sortRequest.field === "statusRequest" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSortRequest("startDate")}>
                        Start Date{" "}
                        {sortRequest.field === "startDate" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSortRequest("endDate")}>
                        End Date{" "}
                        {sortRequest.field === "endDate" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th onClick={() => handleSortRequest("reason")}>
                        Reason{" "}
                        {sortRequest.field === "reason" &&
                          (sortRequest.order === "asc" ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          ))}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.length > 0 ? (
                      paginatedRequests.map((req) => (
                        <tr key={req.id}>
                          <td>{req.name}</td>
                          <td>{req.description}</td>
                          <td>{req.location}</td>
                          <td>
                            {req.price ? req.price.toLocaleString() : "N/A"}
                          </td>
                          <td>{req.statusRequest}</td>
                          <td>{req.startDate}</td>
                          <td>{req.endDate}</td>
                          <td>{req.reason}</td>
                          <td>
                            <Button
                              onClick={() => handleViewDetail(req.id)}
                              style={{ marginRight: "8px" }}
                            >
                              View
                            </Button>
                            <Button
                              type="primary"
                              onClick={() => handleShowModal(null, req)}
                            >
                              + Contract
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">
                          No requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <PaginationControls
                  currentPage={currentPageRequest}
                  totalPages={totalPagesRequest}
                  totalEntries={totalEntries}
                  showingEntries={paginatedRequests.length}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handlePageChangeRequest}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={rowsPerPageOptions}
                />
              </Card.Body>
            </Card>
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={1}>
          <div className="table-container">
            <Card className="status-table-card">
              <Card.Body>
                <div
                  className="table-header"
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <h3>Contracts</h3>
                  <Form.Control
                    type="text"
                    placeholder="Search ..."
                    value={searchContract}
                    onChange={(e) => setSearchContract(e.target.value)}
                    className="search-input"
                    style={{ width: "200px" }}
                  />
                  <div
                    className="status-filter"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span>Filter by Status:</span>
                    <Dropdown
                      overlay={
                        <Menu
                          onClick={({ key }) => {
                            setStatusFilter(key === "all" ? null : key);
                            setCurrentPageContract(1); // Reset to first page on filter change
                          }}
                        >
                          <Menu.Item key="all">All</Menu.Item>
                          <Menu.Item key="Deposited">Deposited</Menu.Item>
                          <Menu.Item key="Created">Created</Menu.Item>
                          <Menu.Item key="Completed">Completed</Menu.Item>
                          <Menu.Item key="Refund">Refund</Menu.Item>
                        </Menu>
                      }
                    >
                      <Button>{statusFilter || "All"} ▼</Button>
                    </Dropdown>
                  </div>
                </div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSortContract("contractName")}
                        >
                          Contract Name{" "}
                          {sortContract.field === "contractName" &&
                            (sortContract.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            ))}
                        </span>
                      </th>
                      <th className="text-center">Contract Owner</th>
                      <th className="text-center">Total Hire Price</th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSortContract("status")}
                        >
                          Status{" "}
                          {sortContract.field === "status" &&
                            (sortContract.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            ))}
                        </span>
                      </th>
                      <th className="text-center">Contract Created Date</th>
                      <th className="text-center">Start Date</th>
                      <th className="text-center">End Date</th>
                      <th className="text-center">Actions</th>
                      <th className="text-center">Refund</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContracts.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center">
                          No contracts found
                        </td>
                      </tr>
                    ) : (
                      paginatedContracts.map((con, index) => (
                        <tr key={con.contractId || `contract-${index}`}>
                          <td className="text-center">
                            {con.contractName || "N/A"}
                          </td>
                          <td className="text-center">
                            {con.createBy || "N/A"}
                          </td>
                          <td className="text-center">
                            {con.price ? con.price.toLocaleString() : "N/A"}
                          </td>
                          <td className="text-center">{con.status || "N/A"}</td>
                          <td className="text-center">{con.createDate}</td>
                          <td className="text-center">
                            {formatDate(con.startDate)}
                          </td>
                          <td className="text-center">
                            {formatDate(con.endDate)}
                          </td>
                          <td className="text-center">
                            <Button
                              type="default"
                              onClick={() => handleViewDetail(con.requestId)}
                              style={{ marginRight: "8px" }}
                              disabled={!con.requestId}
                            >
                              View Detail
                            </Button>
                            <Button
                              type="default"
                              onClick={() =>
                                handleShowDeliveryModal(con.contractId)
                              }
                              disabled={
                                con.status === "Created" ||
                                con.status === "Cancel"
                              }
                            >
                              {con.status === "Created"
                                ? "Wait Payment"
                                : "Manage Delivery"}
                            </Button>
                          </td>
                          <td className="text-center">
                            {con.status === "Refund" ? (
                              <Button
                                type="primary"
                                onClick={() =>
                                  handleShowRefundModal(con.contractId)
                                }
                                disabled={
                                  refundStatus[con.contractId] ||
                                  con.status !== "Refund"
                                }
                              >
                                Refund
                              </Button>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                <PaginationControls
                  currentPage={currentPageContract}
                  totalPages={totalPagesContract}
                  totalEntries={filteredContracts.length}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handlePageChangeContract}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={rowsPerPageOptions}
                />
              </Card.Body>
            </Card>
          </div>
        </CustomTabPanel>
      </Box>

      <BootstrapModal show={showModal} onHide={handleCloseModal} centered>
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title>
            {isEditing ? "Edit Contract" : "Add Contract"}
          </BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Customer Name</strong>
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.customerName}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Deposit (VND)</strong>
              </Form.Label>
              <Form.Control type="text" value={formData.deposit} readOnly />
            </Form.Group>
          </Form>
        </BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          {!isEditing && (
            <Button variant="primary" onClick={handleSubmit}>
              Add
            </Button>
          )}
        </BootstrapModal.Footer>
      </BootstrapModal>

      <ViewApprovedContractRentalCostume
        visible={viewModalVisible}
        onCancel={handleCloseViewModal}
        requestId={selectedRequestId}
        getRequestByRequestId={ManageContractService.getRequestByRequestId}
      />

      <ManageDeliveryRentalCostume
        visible={deliveryModalVisible}
        onCancel={handleCloseDeliveryModal}
        contractId={selectedContractId}
      />

      <RefundButton
        visible={refundModalVisible}
        onCancel={handleCloseRefundModal}
        contractId={selectedContractId}
      />
    </div>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  totalEntries,
  showingEntries,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions,
}) => (
  <div
    className="pagination-controls"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ marginRight: "20px" }}>
        Showing {showingEntries} of {totalEntries} entries
      </span>
      <div className="rows-per-page" style={{ display: "flex", gap: "10px" }}>
        <span>Rows per page:</span>
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => onRowsPerPageChange(Number(key))}>
              {rowsPerPageOptions.map((option) => (
                <Menu.Item key={option}>{option}</Menu.Item>
              ))}
            </Menu>
          }
        >
          <Button>{rowsPerPage} ▼</Button>
        </Dropdown>
      </div>
    </div>
    <Pagination
      current={currentPage}
      total={totalEntries}
      pageSize={rowsPerPage}
      onChange={onPageChange}
      showSizeChanger={false}
    />
  </div>
);

export default ManageContractRentalCostume;
