import React, { useState } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { Button, Popconfirm } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../../../styles/Manager/ManageRequest.scss";

const ManageRequest = () => {
  // Initial data for requests
  const [requests, setRequests] = useState([
    { id: "S001", statusRequest: "Pending" },
    { id: "S002", statusRequest: "Approved" },
    { id: "S003", statusRequest: "Rejected" },
    { id: "S004", statusRequest: "Pending" },
    { id: "S005", statusRequest: "Approved" },
    { id: "S006", statusRequest: "Rejected" },
  ]);

  // Modal and form state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ id: "", status: "" });

  // Search and sort states
  const [searchRequest, setSearchRequest] = useState("");
  const [sortRequest, setSortRequest] = useState({
    field: "statusRequest",
    order: "asc",
  });

  // Pagination states
  const [currentPageRequest, setCurrentPageRequest] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const rowsPerPageOptions = [3, 5, 10];

  // Filter and sort data
  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(search.toLowerCase()) ||
          item.statusRequest.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      const valueA = a.statusRequest.toLowerCase();
      const valueB = b.statusRequest.toLowerCase();
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

  // Pagination logic
  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  // Modal handling
  const handleShowModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setCurrentItem(item);
      setFormData({ id: item.id, status: item.statusRequest });
    } else {
      setIsEditing(false);
      setFormData({ id: "", status: "" });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentItem(null);
  };

  // Form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedRequests = requests.map((req) =>
        req.id === currentItem.id
          ? { ...req, statusRequest: formData.status }
          : req
      );
      setRequests(updatedRequests);
      toast.success("Request updated successfully!");
    } else {
      setRequests([
        ...requests,
        { id: formData.id, statusRequest: formData.status },
      ]);
      toast.success("Request added successfully!");
    }
    handleCloseModal();
  };

  // Delete handling
  const handleDelete = (id) => {
    setRequests(requests.filter((req) => req.id !== id));
    toast.success("Request deleted successfully!");
  };

  // Sort handler
  const handleSort = () => {
    setSortRequest((prev) => ({
      field: "statusRequest",
      order: prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPageRequest(1);
  };

  // Pagination handlers
  const handlePageChange = (page) => setCurrentPageRequest(page);
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPageRequest(1);
  };

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
                placeholder="Search by ID or Status..."
                value={searchRequest}
                onChange={(e) => setSearchRequest(e.target.value)}
                className="search-input"
              />
              <Button type="primary" onClick={() => handleShowModal(null)}>
                Add Request
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">
                    <span className="sortable" onClick={handleSort}>
                      Status Request
                      {sortRequest.field === "statusRequest" &&
                        (sortRequest.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="text-center">{req.id}</td>
                    <td className="text-center">{req.statusRequest}</td>
                    <td className="text-center">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleShowModal(req)}
                        style={{ marginRight: "8px" }}
                      >
                        Edit
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
            />
          </Card.Body>
        </Card>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Request" : "Add Request"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                required
                disabled={isEditing}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// Pagination Component
const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
  rowsPerPageOptions,
}) => (
  <div className="pagination-controls">
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
