import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
  Button as BootstrapButton,
  CloseButton,
} from "react-bootstrap";
import { Button, Popconfirm, Image } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown } from "lucide-react";
import "../../../styles/Manager/ManageCosplayer.scss";
import CosplayerService from "../../../services/ManageServicePages/ManageCosplayerService/CosplayerService.js";

const ManageCosplayer = () => {
  const [cosplayers, setCosplayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for modal visibility and form data
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCosplayer, setCurrentCosplayer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    description: "",
    birthday: "",
    phone: "",
    isActive: true,
    onTask: null,
    leader: "",
    code: "",
    taskQuantity: 0,
    averageStar: 0,
    images: [],
  });
  const [newImageUrl, setNewImageUrl] = useState("");

  // Search and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCosplayer, setSortCosplayer] = useState({
    field: "name",
    order: "asc",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rowsPerPageOptions = [5, 10, 20, 30];

  // Fetch Cosplayers using useEffect
  useEffect(() => {
    const fetchCosplayers = async () => {
      try {
        setLoading(true);
        const data = await CosplayerService.getAllCosplayersByRoleId();
        setCosplayers(data);
      } catch (error) {
        toast.error("Failed to fetch cosplayers!");
      } finally {
        setLoading(false);
      }
    };
    fetchCosplayers();
  }, []);

  // Filter and sort data
  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(search.toLowerCase()) ||
          item.email?.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase()) ||
          item.leader?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      const valueA = String(a[sort.field] ?? "").toLowerCase();
      const valueB = String(b[sort.field] ?? "").toLowerCase();
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredCosplayers = filterAndSortData(
    cosplayers,
    searchTerm,
    sortCosplayer
  );
  const totalEntries = filteredCosplayers.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedCosplayers = paginateData(filteredCosplayers, currentPage);

  // Pagination logic
  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  // Calculate "Showing x to x of x entries"
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  // Handle modal open/close
  const handleShowModal = (cosplayer = null) => {
    if (cosplayer) {
      setIsEditing(true);
      setCurrentCosplayer(cosplayer);
      setFormData({ ...cosplayer, confirmPassword: "" });
    } else {
      setIsEditing(false);
      setFormData({
        name: "",
        password: "",
        confirmPassword: "",
        email: "",
        description: "",
        birthday: "",
        phone: "",
        isActive: true,
        onTask: null,
        leader: "",
        code: "",
        taskQuantity: 0,
        averageStar: 0,
        images: [],
      });
    }
    setNewImageUrl("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentCosplayer(null);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image management
  const handleAddImage = () => {
    if (newImageUrl) {
      const newImage = {
        accountImageId: `AI${Date.now()}`,
        urlImage: newImageUrl,
        createDate: new Date().toLocaleString(),
        updateDate: null,
        isAvatar: null,
      };
      setFormData({ ...formData, images: [...formData.images, newImage] });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  // Handle form submission (Create or Update - local only for now)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedCosplayers = cosplayers.map((cosplayer) =>
        cosplayer.accountId === currentCosplayer.accountId
          ? { ...formData }
          : cosplayer
      );
      setCosplayers(updatedCosplayers);
      toast.success("Cosplayer updated successfully!");
      handleCloseModal();
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      const { confirmPassword, ...dataToSave } = formData;
      setCosplayers([
        ...cosplayers,
        { ...dataToSave, accountId: `A${Date.now()}` },
      ]);
      toast.success("Cosplayer added successfully!");
      handleCloseModal();
    }
  };

  // Handle delete cosplayer
  const handleDelete = (accountId) => {
    setCosplayers(
      cosplayers.filter((cosplayer) => cosplayer.accountId !== accountId)
    );
    toast.success("Cosplayer deleted successfully!");
  };

  // Sort handler
  const handleSort = (field) => {
    setSortCosplayer((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  // Handle rows per page change
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="manage-cosplayer">
      <h2 className="manage-cosplayer-title">Manage Cosplayers</h2>
      <div className="table-container">
        <Card className="cosplayer-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Cosplayers</h3>
              <Form.Control
                type="text"
                placeholder="Search by Name, Email, Description, or Leader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Button type="primary" onClick={() => handleShowModal()}>
                Add New Cosplayer
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      {sortCosplayer.field === "name" &&
                        (sortCosplayer.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("email")}
                    >
                      Email
                      {sortCosplayer.field === "email" &&
                        (sortCosplayer.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("averageStar")}
                    >
                      Average Star
                      {sortCosplayer.field === "averageStar" &&
                        (sortCosplayer.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("isActive")}
                    >
                      Active
                      {sortCosplayer.field === "isActive" &&
                        (sortCosplayer.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("onTask")}
                    >
                      On Task
                      {sortCosplayer.field === "onTask" &&
                        (sortCosplayer.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("leader")}
                    >
                      Leader
                      {sortCosplayer.field === "leader" &&
                        (sortCosplayer.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("images")}
                    >
                      Images
                      {sortCosplayer.field === "images" &&
                        (sortCosplayer.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("taskQuantity")}
                    >
                      Task Quantity
                      {sortCosplayer.field === "taskQuantity" &&
                        (sortCosplayer.order === "asc" ? (
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
                {paginatedCosplayers.map((cosplayer) => (
                  <tr key={cosplayer.accountId}>
                    <td className="text-center">{cosplayer.name}</td>
                    <td className="text-center">{cosplayer.email}</td>
                    <td className="text-center">{cosplayer.averageStar}</td>
                    <td className="text-center">
                      {cosplayer.isActive ? "Yes" : "No"}
                    </td>
                    <td className="text-center">
                      {cosplayer.onTask === null
                        ? "N/A"
                        : cosplayer.onTask
                        ? "Yes"
                        : "No"}
                    </td>
                    <td className="text-center">{cosplayer.leader || "N/A"}</td>
                    <td className="text-center">
                      {cosplayer.images && cosplayer.images.length > 0 ? (
                        <Image.PreviewGroup
                          preview={{
                            onChange: (current, prev) =>
                              console.log(
                                `Current image index: ${current}, Previous image index: ${prev}`
                              ),
                          }}
                        >
                          {cosplayer.images.map((image, index) => (
                            <Image
                              key={index}
                              src={
                                image.urlImage ||
                                "https://i.etsystatic.com/38041241/r/il/5e2cf9/4295579616/il_1080xN.4295579616_2f2q.jpg"
                              }
                              alt={`Image ${index + 1}`}
                              width={50}
                              height={50}
                              style={{
                                objectFit: "cover",
                                margin: "0 4px 4px 0",
                              }}
                              preview={{ mask: "Zoom" }}
                            />
                          ))}
                        </Image.PreviewGroup>
                      ) : (
                        <Image
                          src="https://i.etsystatic.com/38041241/r/il/5e2cf9/4295579616/il_1080xN.4295579616_2f2q.jpg"
                          alt="Default Image"
                          width={50}
                          height={50}
                          style={{ objectFit: "cover" }}
                          preview={{ mask: "Zoom" }}
                        />
                      )}
                    </td>
                    <td className="text-center">
                      {cosplayer.taskQuantity ?? "N/A"}
                    </td>
                    <td className="text-center">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleShowModal(cosplayer)}
                        style={{ marginRight: "8px" }}
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Are you sure to delete this cosplayer?"
                        onConfirm={() => handleDelete(cosplayer.accountId)}
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
            <div className="pagination-controls">
              <div className="pagination-info">
                <span>{showingText}</span>
                <div className="rows-per-page">
                  <span>Rows per page: </span>
                  <Dropdown
                    onSelect={(value) => handleRowsPerPageChange(Number(value))}
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
          </Card.Body>
        </Card>
      </div>

      {/* Modal for Add/Edit Cosplayer */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="cosplayer-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "Edit Cosplayer" : "Add New Cosplayer"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {isEditing ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Average Star</Form.Label>
                  <Form.Control
                    type="number"
                    name="averageStar"
                    value={formData.averageStar}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Birthday</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Active</Form.Label>
                  <Form.Control
                    as="select"
                    name="isActive"
                    value={formData.isActive}
                    onChange={handleInputChange}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>On Task</Form.Label>
                  <Form.Control
                    as="select"
                    name="onTask"
                    value={formData.onTask}
                    onChange={handleInputChange}
                  >
                    <option value={null}>N/A</option>
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Leader</Form.Label>
                  <Form.Control
                    type="text"
                    name="leader"
                    value={formData.leader}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Task Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="taskQuantity"
                    value={formData.taskQuantity}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
                {/* Image Management */}
                <div className="image-management">
                  <h4>Images</h4>
                  <div className="d-flex align-items-center mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Add Image URL"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="me-2"
                    />
                    <BootstrapButton
                      variant="primary"
                      onClick={handleAddImage}
                      disabled={!newImageUrl}
                    >
                      Add
                    </BootstrapButton>
                  </div>
                  <div className="d-flex image-preview">
                    {formData.images.length > 0 ? (
                      <Image.PreviewGroup
                        preview={{
                          onChange: (current, prev) =>
                            console.log(
                              `Current image index: ${current}, Previous image index: ${prev}`
                            ),
                        }}
                      >
                        {formData.images.map((image, index) => (
                          <div key={index} className="image-preview-item">
                            <Image
                              src={image.urlImage}
                              alt={`Image ${index + 1}`}
                              width={50}
                              height={50}
                              style={{
                                objectFit: "cover",
                                margin: "0 4px 4px 0",
                              }}
                              preview={{ mask: "Zoom" }}
                            />
                            <CloseButton
                              onClick={() => handleRemoveImage(index)}
                              className="close-button"
                            />
                          </div>
                        ))}
                      </Image.PreviewGroup>
                    ) : (
                      <p>No images</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <BootstrapButton variant="secondary" onClick={handleCloseModal}>
            Cancel
          </BootstrapButton>
          <BootstrapButton variant="primary" onClick={handleSubmit}>
            {isEditing ? "Update" : "Add"} Cosplayer
          </BootstrapButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageCosplayer;
