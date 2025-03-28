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
import "../../../styles/Manager/ManageContract.scss";

const ManageContract = () => {
  // Initial data for contracts
  const [contracts, setContracts] = useState([
    { id: "S001", statusContract: "Draft" },
    { id: "S002", statusContract: "Signed" },
    { id: "S003", statusContract: "Expired" },
    { id: "S004", statusContract: "Draft" },
    { id: "S005", statusContract: "Signed" },
    { id: "S006", statusContract: "Expired" },
  ]);

  // Modal and form state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ id: "", status: "" });

  // Search and sort states
  const [searchContract, setSearchContract] = useState("");
  const [sortContract, setSortContract] = useState({
    field: "statusContract",
    order: "asc",
  });

  // Pagination states
  const [currentPageContract, setCurrentPageContract] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const rowsPerPageOptions = [3, 5, 10];

  // Filter and sort data
  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(search.toLowerCase()) ||
          item.statusContract.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      const valueA = a.statusContract.toLowerCase();
      const valueB = b.statusContract.toLowerCase();
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredContracts = filterAndSortData(
    contracts,
    searchContract,
    sortContract
  );
  const totalPagesContract = Math.ceil(filteredContracts.length / rowsPerPage);
  const paginatedContracts = paginateData(
    filteredContracts,
    currentPageContract
  );

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
      setFormData({ id: item.id, status: item.statusContract });
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
      const updatedContracts = contracts.map((con) =>
        con.id === currentItem.id
          ? { ...con, statusContract: formData.status }
          : con
      );
      setContracts(updatedContracts);
      toast.success("Contract updated successfully!");
    } else {
      setContracts([
        ...contracts,
        { id: formData.id, statusContract: formData.status },
      ]);
      toast.success("Contract added successfully!");
    }
    handleCloseModal();
  };

  // Delete handling
  const handleDelete = (id) => {
    setContracts(contracts.filter((con) => con.id !== id));
    toast.success("Contract deleted successfully!");
  };

  // Sort handler
  const handleSort = () => {
    setSortContract((prev) => ({
      field: "statusContract",
      order: prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPageContract(1);
  };

  // Pagination handlers
  const handlePageChange = (page) => setCurrentPageContract(page);
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPageContract(1);
  };

  return (
    <div className="manage-general">
      <h2 className="manage-general-title">Manage Contracts</h2>
      <div className="table-container">
        <Card className="status-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Contracts</h3>
              <Form.Control
                type="text"
                placeholder="Search by ID or Status..."
                value={searchContract}
                onChange={(e) => setSearchContract(e.target.value)}
                className="search-input"
              />
              <Button type="primary" onClick={() => handleShowModal(null)}>
                Add Contract
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">
                    <span className="sortable" onClick={handleSort}>
                      Status Contract
                      {sortContract.field === "statusContract" &&
                        (sortContract.order === "asc" ? (
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
                {paginatedContracts.map((con) => (
                  <tr key={con.id}>
                    <td className="text-center">{con.id}</td>
                    <td className="text-center">{con.statusContract}</td>
                    <td className="text-center">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleShowModal(con)}
                        style={{ marginRight: "8px" }}
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Are you sure to delete this contract?"
                        onConfirm={() => handleDelete(con.id)}
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
              currentPage={currentPageContract}
              totalPages={totalPagesContract}
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
            {isEditing ? "Edit Contract" : "Add Contract"}
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
                <option value="Draft">Draft</option>
                <option value="Signed">Signed</option>
                <option value="Expired">Expired</option>
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

export default ManageContract;
