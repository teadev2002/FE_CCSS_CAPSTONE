import React, { useState, useEffect } from "react";
import { Table, Form, Card } from "react-bootstrap";
import { Button, Modal, Dropdown, Pagination, Spin, Menu, Input } from "antd";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../../../styles/Manager/ManageRequest.scss";
import RequestService from "../../../services/ManageServicePages/ManageRequestService/RequestService.js";
import ViewManageRentalCostume from "./ViewManageRentalCostume";
import ViewManageEventOrganize from "./ViewManageEventOrganize.js";
import ViewMyRentCos from "../../MyHistoryPage/ViewMyRentCos.js";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";

dayjs.extend(minMax);

const { TextArea } = Input;

const ManageRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ status: "", reason: "" });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [showRentalCostumeModal, setShowRentalCostumeModal] = useState(false);
  const [showEventOrganizeModal, setShowEventOrganizeModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [searchRequest, setSearchRequest] = useState("");
  const [sortRequest, setSortRequest] = useState({
    field: "statusRequest",
    order: "asc",
  });
  const [currentPageRequest, setCurrentPageRequest] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 50];
  const [selectedService, setSelectedService] = useState("All");

  const getRequestDateRange = (charactersListResponse) => {
    if (!charactersListResponse || charactersListResponse.length === 0) {
      return { startDate: null, endDate: null };
    }

    const allDates = [];
    charactersListResponse.forEach((char) => {
      (char.requestDateResponses || []).forEach((date) => {
        const start = dayjs(date.startDate, "HH:mm DD/MM/YYYY");
        const end = dayjs(date.endDate, "HH:mm DD/MM/YYYY");
        if (start.isValid()) allDates.push(start);
        if (end.isValid()) allDates.push(end);
      });
    });

    if (allDates.length === 0) {
      return { startDate: null, endDate: null };
    }

    const startDate = dayjs.min(allDates).format("DD/MM/YYYY");
    const endDate = dayjs.max(allDates).format("DD/MM/YYYY");

    return { startDate, endDate };
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await RequestService.getAllRequests();
        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data received from API");
        }

        const formattedData = data.map((req) => {
          const { startDate, endDate } = req.charactersListResponse
            ? getRequestDateRange(req.charactersListResponse)
            : {
                startDate: req.startDate
                  ? dayjs(req.startDate).format("DD/MM/YYYY")
                  : null,
                endDate: req.endDate
                  ? dayjs(req.endDate).format("DD/MM/YYYY")
                  : null,
              };

          return {
            id: req.requestId,
            serviceId: req.serviceId || "Unknown",
            name: req.name || "N/A",
            description: req.description || "N/A",
            location: req.location || "N/A",
            price: req.price || 0,
            statusRequest: mapStatus(req.status),
            startDate,
            endDate,
            reason: req.reason || "",
          };
        });
        setRequests(formattedData);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch requests from API");
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const mapStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Pending";
      case "Browsed":
        return "Browsed";
      case "Cancel":
        return "Cancel";
      default:
        return "Unknown";
    }
  };

  const mapStatusToNumber = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Browsed":
        return 1;
      case "Cancel":
        return 2;
      default:
        return 0;
    }
  };

  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (selectedService !== "All") {
      filtered = filtered.filter((item) => item.serviceId === selectedService);
    }
    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }
    return filtered.sort((a, b) => {
      let valueA = a[sort.field];
      let valueB = b[sort.field];

      if (sort.field === "price") {
        valueA = valueA || 0;
        valueB = valueB || 0;
        return sort.order === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (sort.field === "startDate" || sort.field === "endDate") {
        if (!valueA || !valueB) return sort.order === "asc" ? -1 : 1;
        valueA = dayjs(valueA, "DD/MM/YYYY");
        valueB = dayjs(valueB, "DD/MM/YYYY");
        return sort.order === "asc" ? valueA.diff(valueB) : valueB.diff(valueA);
      }

      valueA = valueA ? String(valueA).toLowerCase() : "";
      valueB = valueB ? String(valueB).toLowerCase() : "";
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredRequests = filterAndSortData(
    requests,
    searchRequest,
    sortRequest
  );
  const totalPagesRequest = Math.ceil(filteredRequests.length / rowsPerPage);
  const paginatedRequests = paginateData(filteredRequests, currentPageRequest);
  const totalEntries = filteredRequests.length;

  function paginateData(data, page, perPage = rowsPerPage) {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return data.slice(startIndex, endIndex);
  }

  const handleShowModal = async (item) => {
    try {
      await RequestService.checkAndUpdateRequestStatus(
        item.id,
        mapStatusToNumber(item.statusRequest),
        ""
      );

      setIsEditing(true);
      setCurrentItem(item);
      setFormData({ status: item.statusRequest, reason: "" });
      setShowModal(true);
      console.log("Mở modal với item:", item, "showModal:", true);
    } catch (error) {
      setIsEditing(true);
      setCurrentItem(item);
      setFormData({ status: item.statusRequest, reason: "" });
      setShowModal(true);
      console.log("Mở modal (lỗi API) với item:", item, "showModal:", true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentItem(null);
    setFormData({ status: "", reason: "" });
  };

  const handleShowDeleteModal = (id) => {
    setDeleteItemId(id);
    setDeleteReason("");
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteItemId(null);
    setDeleteReason("");
  };

  const handleShowViewModal = (id, serviceId) => {
    setSelectedRequestId(id);
    if (serviceId === "S001") {
      setShowRentalCostumeModal(true);
    } else if (serviceId === "S003") {
      setShowEventOrganizeModal(true);
    }
  };

  const handleCloseRentalCostumeModal = () => {
    setShowRentalCostumeModal(false);
    setSelectedRequestId(null);
  };

  const handleCloseEventOrganizeModal = () => {
    setShowEventOrganizeModal(false);
    setSelectedRequestId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestStatus = mapStatusToNumber(formData.status);
    if (requestStatus === 2 && !formData.reason.trim()) {
      toast.error("Vui lòng nhập lý do khi hủy yêu cầu");
      return;
    }
    try {
      // Chỉ kiểm tra charactersListResponse nếu serviceId là S002
      if (currentItem.serviceId === "S002") {
        // Gọi API getRequestByRequestId để kiểm tra charactersListResponse
        const requestData = await RequestService.getRequestByRequestId(
          currentItem.id
        );
        const charactersList = requestData.charactersListResponse || [];

        // Kiểm tra trạng thái của các character và lấy tên cosplayer
        const nonAcceptedCharacters = [];
        for (const char of charactersList) {
          if (char.status !== "Accept") {
            // Gọi API để lấy tên cosplayer
            const cosplayerData =
              await RequestService.getNameCosplayerInRequestByCosplayerId(
                char.cosplayerId
              );
            nonAcceptedCharacters.push({
              name: cosplayerData.name || char.characterName, // Dùng name nếu có, nếu không dùng characterName
            });
          }
        }

        if (nonAcceptedCharacters.length > 0) {
          // Hiển thị toast lỗi với tên các cosplayer chưa chấp nhận
          const cosplayerNames = nonAcceptedCharacters
            .map((char) => char.name)
            .join(", ");
          toast.error(`Cosplayer ${cosplayerNames} still not Accept Request`, {
            autoClose: 5000,
          });
          return;
        }
      }

      // Nếu serviceId không phải S002 hoặc tất cả cosplayer đã chấp nhận, tiếp tục cập nhật trạng thái
      const result = await RequestService.checkAndUpdateRequestStatus(
        currentItem.id,
        requestStatus,
        formData.reason
      );
      console.log("Gửi form:", {
        id: currentItem.id,
        status: formData.status,
        requestStatus,
        reason: formData.reason,
      });
      console.log("Kết quả API:", result);

      if (result.success) {
        const updatedRequests = requests.map((req) =>
          req.id === currentItem.id
            ? {
                ...req,
                statusRequest: formData.status,
                reason: formData.reason,
              }
            : req
        );
        setRequests(updatedRequests);
        toast.success(result.message);
        handleCloseModal();
      } else {
        toast.error(result.message, { autoClose: 5000 });
      }
    } catch (error) {
      toast.error(error.message || "Không thể cập nhật trạng thái yêu cầu");
      console.error("Lỗi API:", error);
    }
  };
  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      toast.error("Reason is required when deleting a request");
      return;
    }
    try {
      await RequestService.DeleteRequestByRequestId(deleteItemId, deleteReason);
      setRequests(requests.filter((req) => req.id !== deleteItemId));
      toast.success("Request deleted successfully!");
      handleCloseDeleteModal();
    } catch (error) {
      toast.error("Failed to delete request");
      console.error("Delete error:", error);
    }
  };

  const handleSort = (field) => {
    setSortRequest((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPageRequest(1);
  };

  const handlePageChange = (page) => setCurrentPageRequest(page);
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPageRequest(1);
  };

  const handleServiceFilterChange = (value) => {
    setSelectedService(value);
    setCurrentPageRequest(1);
  };

  const serviceMenu = (
    <Menu onClick={({ key }) => handleServiceFilterChange(key)}>
      <Menu.Item key="All">All Services</Menu.Item>
      <Menu.Item key="S001">Hire Costume</Menu.Item>
      <Menu.Item key="S002">Hire Cosplayer</Menu.Item>
      <Menu.Item key="S003">Event Organization</Menu.Item>
    </Menu>
  );

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Spin size="large" /> Loading requests...
      </div>
    );

  return (
    <div className="manage-general">
      <h2 className="manage-general-title">Manage Requests</h2>
      <div className="table-container">
        <Card className="status-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Requests</h3>
              <div style={{ display: "flex", gap: "10px" }}>
                <Form.Control
                  type="text"
                  placeholder="Search requests..."
                  value={searchRequest}
                  onChange={(e) => setSearchRequest(e.target.value)}
                  className="search-input"
                />
                <Dropdown overlay={serviceMenu}>
                  <Button>
                    {selectedService === "All"
                      ? "All Services"
                      : selectedService === "S001"
                      ? "Hire Costume"
                      : selectedService === "S002"
                      ? "Hire Cosplayer"
                      : "Event Organization"}{" "}
                    ▼
                  </Button>
                </Dropdown>
              </div>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")}>
                    Name{" "}
                    {sortRequest.field === "name" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th onClick={() => handleSort("description")}>
                    Description{" "}
                    {sortRequest.field === "description" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th>Location</th>
                  <th onClick={() => handleSort("price")}>
                    Price{" "}
                    {sortRequest.field === "price" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th onClick={() => handleSort("statusRequest")}>
                    Status{" "}
                    {sortRequest.field === "statusRequest" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th onClick={() => handleSort("startDate")}>
                    Start Date{" "}
                    {sortRequest.field === "startDate" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th onClick={() => handleSort("endDate")}>
                    End Date{" "}
                    {sortRequest.field === "endDate" &&
                      (sortRequest.order === "asc" ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      ))}
                  </th>
                  <th onClick={() => handleSort("reason")}>
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
                      <td>{req.price.toLocaleString()}</td>
                      <td>{req.statusRequest}</td>
                      <td>{req.startDate || "N/A"}</td>
                      <td>{req.endDate || "N/A"}</td>
                      <td>{req.reason || " "}</td>
                      <td>
                        {req.statusRequest === "Pending" ? (
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleShowModal(req)}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button size="small" disabled>
                            Edit
                          </Button>
                        )}
                        {req.serviceId === "S002" ? (
                          <ViewMyRentCos requestId={req.id} />
                        ) : (
                          <Button
                            size="small"
                            onClick={() =>
                              handleShowViewModal(req.id, req.serviceId)
                            }
                          >
                            View
                          </Button>
                        )}
                        <Button
                          type="primary"
                          danger
                          size="small"
                          onClick={() => handleShowDeleteModal(req.id)}
                        >
                          Delete
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
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={rowsPerPageOptions}
              totalEntries={totalEntries}
              showingEntries={paginatedRequests.length}
            />
          </Card.Body>
        </Card>
      </div>

      <Modal
        title="Edit Request Status"
        open={showModal}
        onCancel={handleCloseModal}
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            disabled={formData.status === "Cancel" && !formData.reason.trim()}
          >
            Update
          </Button>,
        ]}
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Status</option>
              <option value="Browsed">Browsed ✅</option>
              <option value="Cancel">Cancel ❌</option>
            </Form.Select>
          </Form.Group>
          {formData.status === "Cancel" && (
            <Form.Group className="mb-2">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Enter reason for cancellation"
                required
              />
            </Form.Group>
          )}
        </Form>
      </Modal>

      <Modal
        title="Delete Request"
        open={showDeleteModal}
        onCancel={handleCloseDeleteModal}
        footer={[
          <Button key="cancel" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            danger
            onClick={handleDelete}
            disabled={!deleteReason.trim()}
          >
            Delete
          </Button>,
        ]}
      >
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Reason for Deletion</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Enter reason for deletion"
              required
            />
          </Form.Group>
        </Form>
      </Modal>

      <ViewManageRentalCostume
        visible={showRentalCostumeModal}
        onCancel={handleCloseRentalCostumeModal}
        requestId={selectedRequestId}
        getRequestByRequestId={RequestService.getRequestByRequestId}
      />

      <Modal
        title="Event Organization Details"
        open={showEventOrganizeModal}
        onCancel={handleCloseEventOrganizeModal}
        footer={[
          <Button key="close" onClick={handleCloseEventOrganizeModal}>
            Close
          </Button>,
        ]}
        width={1000}
      >
        <ViewManageEventOrganize requestId={selectedRequestId} />
      </Modal>
    </div>
  );
};

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions,
  totalEntries,
  showingEntries,
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

export default ManageRequest;
