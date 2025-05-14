import React, { useState, useEffect, useMemo } from "react";
import { Table, Form, Card, Modal as BootstrapModal } from "react-bootstrap";
import {
  Button,
  Popconfirm,
  Input,
  Pagination,
  Dropdown,
  Menu,
  Modal,
} from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
import ViewContractEventOrganize from "./ViewContractEventOrganize.js";
import "../../../styles/Manager/ManageContract.scss";
import dayjs from "dayjs";

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

const ManageContractEventOrganize = () => {
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
    field: "status",
    order: "asc",
  });
  const [sortRequest, setSortRequest] = useState({
    field: "statusRequest",
    order: "asc",
  });
  const [currentPageContract, setCurrentPageContract] = useState(1);
  const [currentPageRequest, setCurrentPageRequest] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 15, 30];

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

  // Extract fetchData to reuse after creating contract
  const fetchData = async () => {
    let isMounted = true;
    try {
      setLoading(true);

      // Fetch contracts
      try {
        const contractData = await ManageContractService.getAllContracts();
        const validContracts = await Promise.all(
          contractData.map(async (con) => {
            if (!con.contractId || !con.requestId) return null;
            try {
              const request = await ManageContractService.getRequestByRequestId(
                con.requestId
              );
              if (request?.serviceId === "S003") {
                return {
                  ...con,
                  contractName: con.contractName || "N/A",
                  price: con.price || 0,
                  status: con.status || "N/A",
                  createDate: formatDate(con.createDate) || "N/A",
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
        if (isMounted) {
          setContracts(filteredContracts);
          if (filteredContracts.length === 0) {
            toast.warn("No valid contracts found for Event Organize.");
          }
        }
      } catch (contractError) {
        console.error("Failed to fetch contracts:", contractError);
        toast.warn(
          "Could not fetch contracts: " +
            (contractError.response?.data?.message || contractError.message)
        );
      }

      // Fetch requests
      try {
        const requestData = await ManageContractService.getAllRequests();
        const formattedData = requestData
          .filter(
            (req) =>
              req.status?.toLowerCase() === "browsed" &&
              req.serviceId === "S003" &&
              req.deposit > 1
          )
          .map((req) => {
            let startDate = req.startDate || "N/A";
            let endDate = req.endDate || "N/A";
            if (
              req.charactersListResponse?.length > 0 &&
              req.charactersListResponse[0]?.requestDateResponses?.length > 0
            ) {
              const dateResponse =
                req.charactersListResponse[0].requestDateResponses[0];
              startDate = formatDate(dateResponse.startDate);
              endDate = formatDate(dateResponse.endDate);
            } else {
              startDate = formatDate(req.startDate);
              endDate = formatDate(req.endDate);
            }
            return {
              id: req.requestId,
              serviceId: "S003",
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
              charactersListResponse: req.charactersListResponse || [],
            };
          });
        if (isMounted) {
          setRequests(formattedData);
          if (formattedData.length === 0) {
            // toast.info("No requests found.");
          } else {
            console.log(
              `Fetched ${formattedData.length} requests for Event Organize.`
            );
          }
        }
      } catch (requestError) {
        console.error("Failed to fetch requests:", requestError);
      }
    } catch (error) {
      if (isMounted) {
        console.error("Unexpected error:", error);
        console.log("Unexpected error: " + error.message);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  };

  useEffect(() => {
    fetchData();
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

  const totalPagesContract = useMemo(() => {
    return Math.ceil(filteredContracts.length / rowsPerPage);
  }, [filteredContracts.length, rowsPerPage]);

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
      return sortRequest.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredRequests = filterAndSortRequests(requests, searchRequest);

  const totalPagesRequest = useMemo(() => {
    return Math.ceil(filteredRequests.length / rowsPerPage);
  }, [filteredRequests.length, rowsPerPage]);

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
      if (request.contractId) {
        console.log("This request already has an associated contract!");
        return;
      }
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
      setFormData({
        customerName: "",
        deposit: "",
        requestId: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setIsRequestBased(false);
    setCurrentItem(null);
    setFormData({
      customerName: "",
      deposit: "",
      requestId: "",
    });
  };

  const handleSubmit = async () => {
    if (!formData.requestId) {
      console.log("Request ID is required to create a contract!");
      return;
    }
    if (!formData.deposit || isNaN(parseFloat(formData.deposit))) {
      console.log("Valid deposit amount is required!");
      return;
    }
    try {
      const depositValue =
        parseFloat(String(formData.deposit).replace("%", "")) || 0;
      const newContract = await ManageContractService.createContract(
        formData.requestId,
        depositValue
      );
      console.log("Create contract response:", newContract); // Debug response
      // Validate response (adjust based on actual API response structure)
      if (!newContract) {
        throw new Error("No contract data returned from server");
      }
      // Update state
      setContracts((prev) => [...prev, newContract]);
      if (isRequestBased) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === currentItem.id
              ? { ...req, contractId: newContract.contractId || null }
              : req
          )
        );
      }
      toast.success("Contract created successfully!");
      handleCloseModal();
      // Refetch data to ensure UI is up-to-date
      await fetchData();
    } catch (error) {
      console.error("Error creating contract:", error);
      console.log(
        "Failed to create contract: " +
          (error.response?.data?.message || error.message)
      );
      handleCloseModal();
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
        Event Organize Requests & Contracts
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
              label="Browsed Requests"
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
                  <h3>Browsed Requests</h3>
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
                              size="small"
                              onClick={() => handleViewDetail(req.id)}
                              style={{ marginRight: "8px" }}
                            >
                              View
                            </Button>
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleShowModal(null, req)}
                            >
                              Create Contract
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
                <div className="table-header">
                  <h3>Contracts</h3>
                  <Form.Control
                    type="text"
                    placeholder="Search ..."
                    value={searchContract}
                    onChange={(e) => setSearchContract(e.target.value)}
                    className="search-input"
                  />
                </div>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSortContract("contractName")}
                        >
                          Contract Name
                          {sortContract.field === "contractName" &&
                            (sortContract.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            ))}
                        </span>
                      </th>
                      <th className="text-center">Contract Owner</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">
                        <span
                          className="sortable"
                          onClick={() => handleSortContract("status")}
                        >
                          Status
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
                      <th className="text-center">Complete Contract</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedContracts.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
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
                          <td className="text-center">
                            {formatDate(con.createDate)}
                          </td>
                          <td className="text-center">
                            {formatDate(con.startDate)}
                          </td>
                          <td className="text-center">
                            {formatDate(con.endDate)}
                          </td>
                          <td className="text-center">
                            <Button
                              type="default"
                              size="small"
                              onClick={() => handleViewDetail(con.requestId)}
                              style={{ marginRight: "8px" }}
                              disabled={!con.requestId}
                            >
                              View Detail
                            </Button>
                          </td>
                          <td className="text-center">
                            {con.contractId &&
                            con.status === "FinalSettlement" ? (
                              <Popconfirm
                                title="Are you sure you want to complete this contract?"
                                onConfirm={() =>
                                  handleCompleteContract(con.contractId)
                                }
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button type="primary" size="small">
                                  Complete
                                </Button>
                              </Popconfirm>
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
          <Button type="default" onClick={handleCloseModal}>
            Cancel
          </Button>
          {!isEditing && (
            <Button type="primary" onClick={handleSubmit}>
              Add
            </Button>
          )}
        </BootstrapModal.Footer>
      </BootstrapModal>

      <Modal
        title="Event Details"
        visible={viewModalVisible}
        onCancel={handleCloseViewModal}
        footer={null}
        width={800}
        centered
      >
        <ViewContractEventOrganize requestId={selectedRequestId} />
      </Modal>
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

export default ManageContractEventOrganize;
