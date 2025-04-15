//////////hover thay profile //////////////////////////////////////////////////////////////////
import React, { useState, useEffect } from "react";
import { Table, Form, Card } from "react-bootstrap";
import {
  Button,
  Modal,
  Dropdown,
  Pagination,
  Image,
  Menu,
  Tooltip,
} from "antd";
import { toast } from "react-toastify";
import { Link } from "react-router-dom"; // Thêm Link từ react-router-dom
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../../../styles/Manager/ManageRequest.scss";
import RequestService from "../../../services/ManageServicePages/ManageRequestService/RequestService.js";
import dayjs from "dayjs";

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
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [searchRequest, setSearchRequest] = useState("");
  const [sortRequest, setSortRequest] = useState({
    field: "statusRequest",
    order: "asc",
  });
  const [currentPageRequest, setCurrentPageRequest] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 50];
  const [selectedService, setSelectedService] = useState("All");
  const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
  const charactersPerPage = 2;
  const [cosplayerData, setCosplayerData] = useState({}); // Lưu dữ liệu cosplayer theo cosplayerId
  const [tooltipLoading, setTooltipLoading] = useState({}); // Trạng thái loading cho từng tooltip

  // Hàm tính tổng số ngày
  const calculateTotalDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = dayjs(startDate, "HH:mm DD/MM/YYYY");
    const end = dayjs(endDate, "HH:mm DD/MM/YYYY");
    if (!start.isValid() || !end.isValid()) return 0;
    return end.diff(start, "day") + 1;
  };

  // Hàm tính tổng số giờ
  const calculateTotalHours = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = dayjs(startDate, "HH:mm DD/MM/YYYY");
    const end = dayjs(endDate, "HH:mm DD/MM/YYYY");
    if (!start.isValid() || !end.isValid()) return 0;
    const hoursPerDay =
      end.hour() - start.hour() + (end.minute() - start.minute()) / 60;
    const totalDays = end.diff(start, "day") + 1;
    return hoursPerDay * totalDays;
  };

  // Hàm tính giá cho một cosplayer
  const calculateCosplayerPrice = (
    salaryIndex,
    characterPrice,
    quantity,
    totalHours,
    totalDays
  ) => {
    if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
    return (totalHours * salaryIndex + totalDays * characterPrice) * quantity;
  };

  // Hàm tính tổng giá
  const calculateTotalPrice = (characters) => {
    return characters.reduce(
      (total, char) =>
        total +
        calculateCosplayerPrice(
          char.salaryIndex,
          char.characterPrice || 0,
          char.quantity,
          char.totalHours,
          char.totalDays
        ),
      0
    );
  };

  // Hàm lấy dữ liệu cosplayer khi hover
  const fetchCosplayerData = async (cosplayerId) => {
    if (!cosplayerId || cosplayerData[cosplayerId]) return; // Không gọi lại nếu đã có dữ liệu
    try {
      setTooltipLoading((prev) => ({ ...prev, [cosplayerId]: true }));
      const response =
        await RequestService.getNameCosplayerInRequestByCosplayerId(
          cosplayerId
        );
      setCosplayerData((prev) => ({ ...prev, [cosplayerId]: response }));
    } catch (error) {
      console.error(
        `Failed to fetch cosplayer data for ID ${cosplayerId}:`,
        error
      );
      setCosplayerData((prev) => ({ ...prev, [cosplayerId]: null }));
    } finally {
      setTooltipLoading((prev) => ({ ...prev, [cosplayerId]: false }));
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await RequestService.getAllRequests();
        console.log("Raw API data:", data);
        const formattedData = data.map((req) => {
          let startDate = req.startDate || "N/A";
          let endDate = req.endDate || "N/A";
          if (
            req.charactersListResponse &&
            req.charactersListResponse.length > 0 &&
            req.charactersListResponse[0].requestDateResponses &&
            req.charactersListResponse[0].requestDateResponses.length > 0
          ) {
            const dateResponse =
              req.charactersListResponse[0].requestDateResponses[0];
            startDate = dateResponse.startDate
              ? dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY").format(
                  "HH:mm DD/MM/YYYY"
                )
              : "N/A";
            endDate = dateResponse.endDate
              ? dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY").format(
                  "HH:mm DD/MM/YYYY"
                )
              : "N/A";
          }

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
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return filtered.sort((a, b) => {
      let valueA = a[sort.field];
      let valueB = b[sort.field];

      // Xử lý cho Price (số)
      if (sort.field === "price") {
        valueA = valueA || 0;
        valueB = valueB || 0;
        return sort.order === "asc" ? valueA - valueB : valueB - valueA;
      }

      // Xử lý cho Name và các field chuỗi khác
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

  const handleShowModal = (item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setFormData({ status: item.statusRequest, reason: "" });
    setShowModal(true);
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

  const handleShowViewModal = async (id) => {
    try {
      const data = await RequestService.getRequestByRequestId(id);
      if (!data) {
        throw new Error("Request data not found");
      }

      const request = requests.find((req) => req.id === id);
      const serviceId = request?.serviceId;

      if (serviceId === "S001") {
        const characters = data.charactersListResponse || [];
        const formattedData = {
          name: data.name || "N/A",
          description: data.description || "N/A",
          startDate: data.startDate
            ? dayjs(data.startDate, "HH:mm DD/MM/YYYY").format(
                "HH:mm DD/MM/YYYY"
              )
            : "N/A",
          endDate: data.endDate
            ? dayjs(data.endDate, "HH:mm DD/MM/YYYY").format("HH:mm DD/MM/YYYY")
            : "N/A",
          location: data.location || "N/A",
          characters: characters.map((char) => ({
            characterId: char.characterId,
            maxHeight: char.maxHeight || 0,
            maxWeight: char.maxWeight || 0,
            minHeight: char.minHeight || 0,
            minWeight: char.minWeight || 0,
            quantity: char.quantity || 0,
            urlImage: char.characterImages?.[0]?.urlImage || "",
            description: char.description || "",
          })),
        };
        setViewData(formattedData);
      } else if (serviceId === "S002") {
        const formattedData = {
          id: data.requestId,
          name: data.name || "N/A",
          description: data.description || "N/A",
          price: 0,
          status: mapStatus(data.status),
          deposit: data.deposit ? `${data.deposit}%` : "N/A",
          startDateTime: "N/A",
          endDateTime: "N/A",
          location: data.location || "N/A",
          listRequestCharacters: [],
        };

        const charactersList = data.charactersListResponse || [];
        if (charactersList.length > 0) {
          const firstCharacter = charactersList[0];
          if (
            firstCharacter.requestDateResponses &&
            firstCharacter.requestDateResponses.length > 0
          ) {
            const dateResponse = firstCharacter.requestDateResponses[0];
            formattedData.startDateTime = dateResponse.startDate
              ? dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY").format(
                  "HH:mm DD/MM/YYYY"
                )
              : "N/A";
            formattedData.endDateTime = dateResponse.endDate
              ? dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY").format(
                  "HH:mm DD/MM/YYYY"
                )
              : "N/A";
          }

          const listRequestCharacters = await Promise.all(
            charactersList.map(async (char) => {
              let cosplayerName = "Not Assigned";
              let salaryIndex = 1;
              let characterPrice = 0;
              let characterName = "Unknown";
              let startDate = "N/A";
              let startTime = "N/A";
              let endDate = "N/A";
              let endTime = "N/A";
              let totalHours = 0;
              let totalDays = 0;

              try {
                const characterData = await RequestService.getCharacterById(
                  char.characterId
                );
                characterName = characterData?.characterName || "Unknown";
                characterPrice = characterData?.price || 0;
              } catch (error) {
                console.warn(
                  `Failed to fetch character for ID ${char.characterId}:`,
                  error
                );
              }

              if (char.cosplayerId) {
                try {
                  const cosplayerData =
                    await RequestService.getNameCosplayerInRequestByCosplayerId(
                      char.cosplayerId
                    );
                  cosplayerName = cosplayerData?.name || "Not Assigned";
                  salaryIndex = cosplayerData?.salaryIndex || 1;
                } catch (error) {
                  console.warn(
                    `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
                    error
                  );
                }
              }

              if (
                char.requestDateResponses &&
                char.requestDateResponses.length > 0
              ) {
                const dateResponse = char.requestDateResponses[0];
                startDate = dateResponse.startDate
                  ? dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY").format(
                      "DD/MM/YYYY"
                    )
                  : "N/A";
                startTime = dateResponse.startDate
                  ? dayjs(dateResponse.startDate, "HH:mm DD/MM/YYYY").format(
                      "HH:mm"
                    )
                  : "N/A";
                endDate = dateResponse.endDate
                  ? dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY").format(
                      "DD/MM/YYYY"
                    )
                  : "N/A";
                endTime = dateResponse.endDate
                  ? dayjs(dateResponse.endDate, "HH:mm DD/MM/YYYY").format(
                      "HH:mm"
                    )
                  : "N/A";
                totalDays = calculateTotalDays(
                  dateResponse.startDate,
                  dateResponse.endDate
                );
                totalHours = calculateTotalHours(
                  dateResponse.startDate,
                  dateResponse.endDate
                );
              }

              const price = calculateCosplayerPrice(
                salaryIndex,
                characterPrice,
                char.quantity || 1,
                totalHours,
                totalDays
              );

              return {
                cosplayerId: char.cosplayerId || null,
                characterId: char.characterId,
                cosplayerName,
                characterName,
                characterPrice,
                quantity: char.quantity || 1,
                salaryIndex,
                price,
                totalHours,
                totalDays,
                startDate,
                startTime,
                endDate,
                endTime,
              };
            })
          );

          formattedData.listRequestCharacters = listRequestCharacters;
          formattedData.price = calculateTotalPrice(listRequestCharacters);
        }

        setViewData(formattedData);
      } else {
        const formattedData = {
          id: data.requestId,
          name: data.name || "N/A",
          description: data.description || "N/A",
          price: 0,
          status: mapStatus(data.status),
          startDateTime: data.startDate
            ? dayjs(data.startDate, "HH:mm DD/MM/YYYY").format(
                "HH:mm DD/MM/YYYY"
              )
            : "N/A",
          endDateTime: data.endDate
            ? dayjs(data.endDate, "HH:mm DD/MM/YYYY").format("HH:mm DD/MM/YYYY")
            : "N/A",
          location: data.location || "N/A",
          listRequestCharacters: [],
        };

        let packagePrice = 0;
        if (serviceId === "S003" && data.packageId) {
          try {
            const packageData = await RequestService.getPackageById(
              data.packageId
            );
            packagePrice = packageData?.price || 0;
          } catch (error) {
            console.warn(
              `Failed to fetch package for ID ${data.packageId}:`,
              error
            );
          }
        }

        const charactersList = data.charactersListResponse || [];
        let totalCharactersPrice = 0;

        if (charactersList.length > 0) {
          const listRequestCharacters = await Promise.all(
            charactersList.map(async (char) => {
              let cosplayerName = "Not Assigned";
              let salaryIndex = 1;
              let characterPrice = 0;
              let characterName = "Unknown";

              try {
                const characterData = await RequestService.getCharacterById(
                  char.characterId
                );
                characterName = characterData?.characterName || "Unknown";
                characterPrice = characterData?.price || 0;
              } catch (error) {
                console.warn(
                  `Failed to fetch character for ID ${char.characterId}:`,
                  error
                );
              }

              if (char.cosplayerId) {
                try {
                  const cosplayerData =
                    await RequestService.getNameCosplayerInRequestByCosplayerId(
                      char.cosplayerId
                    );
                  cosplayerName = cosplayerData?.name || "Not Assigned";
                  salaryIndex = cosplayerData?.salaryIndex || 1;
                } catch (error) {
                  console.warn(
                    `Failed to fetch cosplayer for ID ${char.cosplayerId}:`,
                    error
                  );
                }
              }

              const price = characterPrice * (char.quantity || 0) * salaryIndex;
              totalCharactersPrice += price;

              return {
                cosplayerId: char.cosplayerId || null,
                characterId: char.characterId,
                cosplayerName,
                characterName,
                quantity: char.quantity || 0,
                salaryIndex,
                price,
              };
            })
          );

          formattedData.listRequestCharacters = listRequestCharacters;
        }

        formattedData.price = packagePrice + totalCharactersPrice;
        setViewData(formattedData);
      }
      setShowViewModal(true);
      setCurrentCharacterPage(1);
    } catch (error) {
      toast.error("Failed to fetch request details");
      console.error("Error in handleShowViewModal:", error);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewData(null);
    setCosplayerData({}); // Reset dữ liệu cosplayer khi đóng modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestStatus = mapStatusToNumber(formData.status);
    if (requestStatus === 2 && !formData.reason.trim()) {
      toast.error("Reason is required when canceling a request");
      return;
    }
    try {
      await RequestService.UpdateRequestStatusById(
        currentItem.id,
        requestStatus,
        formData.reason
      );
      const updatedRequests = requests.map((req) =>
        req.id === currentItem.id
          ? { ...req, statusRequest: formData.status }
          : req
      );
      setRequests(updatedRequests);
      toast.success("Request status updated successfully!");
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to update request status");
      console.error("Update error:", error);
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

  if (loading) return <div>Loading requests...</div>;

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
                      <td>{req.startDate}</td>
                      <td>{req.endDate}</td>
                      <td>{req.reason}</td>
                      <td>
                        {req.statusRequest !== "Cancel" ? (
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleShowModal(req)}
                            style={{ marginRight: "8px" }}
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            size="small"
                            disabled
                            style={{ marginRight: "8px" }}
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          size="small"
                          onClick={() => handleShowViewModal(req.id)}
                          style={{ marginRight: "8px" }}
                        >
                          View
                        </Button>
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

      {/* Modal chỉnh sửa status */}
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
              <option value="Pending">Pending 🔃</option>
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

      {/* Modal xác nhận xóa */}
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

      {/* Modal xem chi tiết */}
      <Modal
        title="Request Details"
        open={showViewModal}
        onCancel={handleCloseViewModal}
        footer={[
          <Button key="close" onClick={handleCloseViewModal}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {viewData ? (
          viewData.characters ? (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control value={viewData.name} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control value={viewData.startDate} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control value={viewData.endDate} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control value={viewData.location} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={viewData.description}
                  readOnly
                />
              </Form.Group>
              <h5>Costumes</h5>
              {viewData.characters.length === 0 ? (
                <p>No costumes found.</p>
              ) : (
                <>
                  {paginateData(
                    viewData.characters,
                    currentCharacterPage,
                    charactersPerPage
                  ).map((char) => (
                    <Card key={char.characterId} className="mb-3">
                      <Card.Body>
                        <div className="row">
                          <div className="col-md-6">
                            <Form.Group className="mb-3">
                              <Form.Label>Character ID</Form.Label>
                              <Form.Control value={char.characterId} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Description</Form.Label>
                              <Form.Control value={char.description} readOnly />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Max Height (cm)</Form.Label>
                              <Form.Control
                                type="number"
                                value={char.maxHeight}
                                readOnly
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Max Weight (kg)</Form.Label>
                              <Form.Control
                                type="number"
                                value={char.maxWeight}
                                readOnly
                              />
                            </Form.Group>
                          </div>
                          <div className="col-md-6">
                            <Form.Group className="mb-3">
                              <Form.Label>Min Height (cm)</Form.Label>
                              <Form.Control
                                type="number"
                                value={char.minHeight}
                                readOnly
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Min Weight (kg)</Form.Label>
                              <Form.Control
                                type="number"
                                value={char.minWeight}
                                readOnly
                              />
                            </Form.Group>
                            <Form.Group className="mb-3">
                              <Form.Label>Quantity</Form.Label>
                              <Form.Control
                                type="number"
                                value={char.quantity}
                                readOnly
                              />
                            </Form.Group>
                            {char.urlImage && (
                              <Image
                                src={char.urlImage}
                                alt="Costume Preview"
                                width={100}
                                preview
                                style={{ display: "block", marginTop: "10px" }}
                              />
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                  <Pagination
                    current={currentCharacterPage}
                    pageSize={charactersPerPage}
                    total={viewData.characters.length}
                    onChange={(page) => setCurrentCharacterPage(page)}
                    showSizeChanger={false}
                    style={{ textAlign: "right" }}
                  />
                </>
              )}
            </div>
          ) : (
            <div>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Name:</strong>
                </Form.Label>
                <Form.Control value={viewData.name} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Description:</strong>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={viewData.description}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Location:</strong>
                </Form.Label>
                <Form.Control value={viewData.location} readOnly />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Deposit:</strong>
                </Form.Label>
                <Form.Control value={viewData.deposit} readOnly />
              </Form.Group>
              <div className="d-flex">
                <Form.Group className="mb-3 me-3">
                  <Form.Label>
                    <strong>Start Date:</strong>
                  </Form.Label>
                  <Form.Control value={viewData.startDateTime} readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <strong>End Date:</strong>
                  </Form.Label>
                  <Form.Control value={viewData.endDateTime} readOnly />
                </Form.Group>
              </div>
              {viewData.listRequestCharacters.length > 0 && (
                <>
                  <h5>List of Requested Characters:</h5>
                  <ul>
                    {viewData.listRequestCharacters.map((item, index) => (
                      <li key={index}>
                        <p>
                          <Tooltip
                            title={
                              item.cosplayerId ? (
                                tooltipLoading[item.cosplayerId] ? (
                                  "Loading..."
                                ) : cosplayerData[item.cosplayerId] ? (
                                  <div>
                                    <p>
                                      <strong>Name:</strong>{" "}
                                      {cosplayerData[item.cosplayerId].name}
                                    </p>
                                    <p>
                                      <strong>Email:</strong>{" "}
                                      {cosplayerData[item.cosplayerId].email}
                                    </p>
                                    <p>
                                      <strong>Description:</strong>{" "}
                                      {cosplayerData[item.cosplayerId]
                                        .description || "N/A"}
                                    </p>
                                    <p>
                                      <strong>Height:</strong>{" "}
                                      {cosplayerData[item.cosplayerId].height ||
                                        "N/A"}{" "}
                                      cm
                                    </p>
                                    <p>
                                      <strong>Weight:</strong>{" "}
                                      {cosplayerData[item.cosplayerId].weight ||
                                        "N/A"}{" "}
                                      kg
                                    </p>
                                    <p>
                                      <strong>Average Star:</strong>{" "}
                                      {cosplayerData[item.cosplayerId]
                                        .averageStar || "N/A"}
                                    </p>
                                    <p>
                                      <Link
                                        target="_blank"
                                        to={`/user-profile/${item.cosplayerId}`}
                                        style={{ color: "#1890ff" }}
                                      >
                                        View Profile
                                      </Link>
                                    </p>
                                  </div>
                                ) : (
                                  "Failed to load cosplayer data"
                                )
                              ) : (
                                "No cosplayer assigned"
                              )
                            }
                            onOpenChange={(open) =>
                              open &&
                              item.cosplayerId &&
                              fetchCosplayerData(item.cosplayerId)
                            }
                          >
                            <strong
                              style={{
                                cursor: item.cosplayerId
                                  ? "pointer"
                                  : "default",
                              }}
                            >
                              {item.cosplayerName}
                            </strong>
                          </Tooltip>{" "}
                          as <strong>{item.characterName}</strong>
                        </p>
                        <p>
                          Quantity: {item.quantity} | Hourly Rate:{" "}
                          {item.salaryIndex.toLocaleString()} VND/h | Character
                          Price: {item.characterPrice.toLocaleString()} VND/day
                        </p>
                        <p>
                          Working Time: {item.startDate} {item.startTime} -{" "}
                          {item.endDate} {item.endTime} | Total Hours:{" "}
                          {item.totalHours.toFixed(2)} | Total Days:{" "}
                          {item.totalDays}
                        </p>
                        <p>
                          Price:{" "}
                          <strong>{item.price.toLocaleString()} VND</strong>
                        </p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {!viewData.characters &&
                viewData.listRequestCharacters.length === 0 && (
                  <p>No characters requested.</p>
                )}
              <p>
                <strong>Total Price:</strong>{" "}
                <strong>{viewData.price.toLocaleString()} VND</strong>
              </p>
            </div>
          )
        ) : (
          <p>Loading...</p>
        )}
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
