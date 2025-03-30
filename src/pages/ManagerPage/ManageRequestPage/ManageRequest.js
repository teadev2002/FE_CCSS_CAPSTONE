import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { Button, Popconfirm, List } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../../../styles/Manager/ManageRequest.scss";
import RequestService from "../../../services/ManageServicePages/ManageRequestService/RequestService.js";

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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await RequestService.getAllRequests();
        const formattedData = data.map((req) => ({
          id: req.requestId,
          name: req.name,
          description: req.description,
          statusRequest: mapStatus(req.status),
          startDate: new Date(req.startDate).toLocaleString(),
          endDate: new Date(req.endDate).toLocaleString(),
        }));
        setRequests(formattedData);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch requests from API");
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Sửa hàm mapStatus để xử lý status dưới dạng chuỗi từ API
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
    if (search) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    return filtered.sort((a, b) => {
      const valueA = a[sort.field].toString().toLowerCase();
      const valueB = b[sort.field].toString().toLowerCase();
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

  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
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

  const calculateCosplayerPrice = (salaryIndex, quantity) => {
    return 100 * salaryIndex * quantity;
  };

  const calculateTotalPrice = (characters) => {
    return characters.reduce(
      (total, char) =>
        total + calculateCosplayerPrice(char.salaryIndex, char.quantity),
      0
    );
  };

  const handleShowViewModal = async (id) => {
    try {
      const data = await RequestService.getRequestByRequestId(id);
      if (!data) {
        throw new Error("Request data not found");
      }

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
                try {
                  const cosplayerData =
                    await RequestService.getNameCosplayerInRequestByCosplayerId(
                      char.cosplayerId
                    );
                  cosplayerName = cosplayerData?.name || "Unknown";
                  salaryIndex = cosplayerData?.salaryIndex || 1;
                } catch (cosplayerError) {
                  console.warn(
                    `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
                    cosplayerError
                  );
                }
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
      setShowViewModal(true);
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

  if (loading) return <div>Loading requests...</div>;

  return (
    <div className="manage-general">
      <h2 className="manage-general-title">Manage Request Hire Cosplayer</h2>
      <div className="table-container">
        <Card className="status-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Requests</h3>
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
                {paginatedRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.name}</td>
                    <td>{req.description}</td>
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
                        type="default"
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
                ))}
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

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Request Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={handleCloseViewModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewData ? (
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
              <p>
                <strong>Coupon ID:</strong> N/A
              </p>
              <h4>List of Requested Characters:</h4>
              <List
                dataSource={viewData.listRequestCharacters}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <p>
                      {item.cosplayerName} - {item.characterName} - Quantity:{" "}
                      {item.quantity} - Price: ${item.price}
                    </p>
                  </List.Item>
                )}
              />
              <p>
                <strong>Total Price:</strong> ${viewData.price}
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
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
      <div className="rows-per-page">
        <span>Rows per page: </span>
        <Dropdown onSelect={(value) => onRowsPerPageChange(Number(value))}>
          <Dropdown.Toggle variant="secondary" id="dropdown-rows-per-page">
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
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {[...Array(totalPages).keys()].map((page) => (
        <Pagination.Item
          key={page + 1}
          active={page + 1 === currentPage}
          onClick={() => onPageChange(page + 1)}
        >
          {page + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <Pagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  </div>
);

export default ManageRequest;
