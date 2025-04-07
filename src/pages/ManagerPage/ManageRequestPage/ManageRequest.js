// =====================================================dùng ant design

import React, { useState, useEffect } from "react";
import { Table, Form, Card } from "react-bootstrap"; // Giữ lại Table, Form, Card
import {
  Button,
  Popconfirm,
  Modal,
  Dropdown,
  Pagination,
  Image,
  Menu,
} from "antd"; // Chuyển sang dùng antd cho các component khác
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css"; // Đảm bảo style của antd được áp dụng
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
  const [formData, setFormData] = useState({ status: "" });
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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await RequestService.getAllRequests();
        console.log("Raw API data:", data); // Debug dữ liệu từ API
        const formattedData = data.map((req) => ({
          id: req.requestId,
          serviceId: req.serviceId || "Unknown",
          name: req.name || "N/A",
          description: req.description || "N/A",
          location: req.location || "N/A",
          price: req.price || 0,
          statusRequest: mapStatus(req.status),
          startDate: req.startDate
            ? new Date(req.startDate).toLocaleString()
            : "N/A",
          endDate: req.endDate ? new Date(req.endDate).toLocaleString() : "N/A",
        }));
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

  const filterAndSortData = (data, search, sort, serviceFilter) => {
    let filtered = [...data];
    if (serviceFilter !== "All") {
      filtered = filtered.filter((item) => item.serviceId === serviceFilter);
    }
    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return filtered.sort((a, b) => {
      const valueA = a[sort.field]?.toString().toLowerCase() || "";
      const valueB = b[sort.field]?.toString().toLowerCase() || "";
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredRequests = filterAndSortData(
    requests,
    searchRequest,
    sortRequest,
    selectedService
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
    setFormData({ status: item.statusRequest });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentItem(null);
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
            ? dayjs(data.startDate).format("HH:mm DD/MM/YYYY")
            : "N/A",
          endDate: data.endDate
            ? dayjs(data.endDate).format("HH:mm DD/MM/YYYY")
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
      } else {
        const formattedData = {
          id: data.requestId,
          name: data.name || "N/A",
          description: data.description || "N/A",
          price: 0,
          status: mapStatus(data.status),
          startDateTime: data.startDate
            ? new Date(data.startDate).toLocaleString()
            : "N/A",
          endDateTime: data.endDate
            ? new Date(data.endDate).toLocaleString()
            : "N/A",
          location: data.location || "N/A",
          listRequestCharacters: [],
        };

        const charactersList = data.charactersListResponse || [];
        if (charactersList.length > 0) {
          const listRequestCharacters = await Promise.all(
            charactersList.map(async (char) => {
              try {
                const characterData = await RequestService.getNameCharacterById(
                  char.characterId
                );
                let cosplayerName = "Not Assigned";
                let salaryIndex = 1;

                if (char.cosplayerId) {
                  const cosplayerData =
                    await RequestService.getNameCosplayerInRequestByCosplayerId(
                      char.cosplayerId
                    );
                  cosplayerName = cosplayerData?.name || "Unknown";
                  salaryIndex = cosplayerData?.salaryIndex || 1;
                }

                const price = calculateCosplayerPrice(
                  salaryIndex,
                  char.quantity || 0
                );

                return {
                  cosplayerId: char.cosplayerId || null,
                  characterId: char.characterId,
                  cosplayerName,
                  characterName: characterData?.characterName || "Unknown",
                  quantity: char.quantity || 0,
                  salaryIndex,
                  price,
                };
              } catch (charError) {
                console.warn(
                  `Failed to fetch character data for ID ${char.characterId}:`,
                  charError
                );
                return {
                  cosplayerId: char.cosplayerId || null,
                  characterId: char.characterId,
                  cosplayerName: "Not Assigned",
                  characterName: "Unknown",
                  quantity: char.quantity || 0,
                  salaryIndex: 1,
                  price: 0,
                };
              }
            })
          );

          formattedData.listRequestCharacters = listRequestCharacters;
          formattedData.price = calculateTotalPrice(listRequestCharacters);
        }
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
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestStatus = mapStatusToNumber(formData.status);
    try {
      await RequestService.UpdateRequestStatusById(
        currentItem.id,
        requestStatus
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

  const handleDelete = async (id) => {
    try {
      await RequestService.DeleteRequestByRequestId(id);
      setRequests(requests.filter((req) => req.id !== id));
      toast.success("Request deleted successfully!");
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

  const calculateCosplayerPrice = (salaryIndex, quantity) => {
    return 100000 * salaryIndex * quantity;
  };

  const calculateTotalPrice = (characters) => {
    return characters.reduce(
      (total, char) =>
        total + calculateCosplayerPrice(char.salaryIndex, char.quantity),
      0
    );
  };

  // Menu cho Dropdown của antd
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
      <h2 className="manage-general-title">Manage Request</h2>
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
                  <th>Price</th>
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
                      <td>{req.price}</td>
                      <td>{req.statusRequest}</td>
                      <td>{req.startDate}</td>
                      <td>{req.endDate}</td>
                      <td>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleShowModal(req)}
                          style={{ marginRight: "8px" }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleShowViewModal(req.id)}
                          style={{ marginRight: "8px" }}
                        >
                          View
                        </Button>
                        <Popconfirm
                          title="Are you sure to delete this request?"
                          onConfirm={() => handleDelete(req.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="primary" danger size="small">
                            Delete
                          </Button>
                        </Popconfirm>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
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
          <Button key="submit" type="primary" onClick={handleSubmit}>
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
              <p>
                <strong>Name:</strong> {viewData.name}
              </p>
              <p>
                <strong>Description:</strong> {viewData.description}
              </p>
              <p>
                <strong>Start DateTime:</strong> {viewData.startDateTime}
              </p>
              <p>
                <strong>End DateTime:</strong> {viewData.endDateTime}
              </p>
              <p>
                <strong>Location:</strong> {viewData.location}
              </p>
              <h4>List of Requested Characters:</h4>
              {viewData.listRequestCharacters.length > 0 ? (
                <ul>
                  {viewData.listRequestCharacters.map((item, index) => (
                    <li key={index}>
                      {item.cosplayerName} - {item.characterName} - Quantity:{" "}
                      {item.quantity} - Price: {item.price} VND
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No characters requested.</p>
              )}
              <p>
                <strong>Total Price:</strong> {viewData.price} VND
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
