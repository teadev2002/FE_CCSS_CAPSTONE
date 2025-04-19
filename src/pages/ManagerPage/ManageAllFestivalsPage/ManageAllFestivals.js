import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { Button, Popconfirm, Image, Descriptions, List } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown, PlusCircle } from "lucide-react";
import "../../../styles/Manager/ManageAllFestivals.scss";
import ManageAllFestivalsService from "../../../services/ManageServicePages/ManageAllFestivalsService/ManageAllFestivalsService";

const ManageAllFestivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    tickets: [{ quantity: 0, price: 0, description: "", ticketType: 0 }],
    eventCharacters: [{ characterId: "", description: "", cosplayerId: "" }],
    eventActivities: [{ activityId: "", description: "", createBy: "" }],
    imageFiles: [], // Lưu danh sách file hình ảnh
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortFestival, setSortFestival] = useState({
    field: "eventName",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 30];

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const data = await ManageAllFestivalsService.getAllEvents(searchTerm);
        setFestivals(data);
      } catch (error) {
        toast.error(error.message || "Failed to load festivals");
      }
    };
    fetchFestivals();
  }, [searchTerm]);

  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.eventName.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase()) ||
          item.startDate.toLowerCase().includes(search.toLowerCase()) ||
          item.endDate.toLowerCase().includes(search.toLowerCase()) ||
          item.createDate.toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      const valueA = String(a[sort.field]).toLowerCase();
      const valueB = String(b[sort.field]).toLowerCase();
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredFestivals = filterAndSortData(festivals, searchTerm, sortFestival);
  const totalEntries = filteredFestivals.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedFestivals = paginateData(filteredFestivals, currentPage);

  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  const showCreateModal = () => {
    setIsEditMode(false);
    setSelectedFestival(null);
    setFormData({
      eventName: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      tickets: [{ quantity: 0, price: 0, description: "", ticketType: 0 }],
      eventCharacters: [{ characterId: "", description: "", cosplayerId: "" }],
      eventActivities: [{ activityId: "", description: "", createBy: "" }],
      imageFiles: [],
    });
    setIsCreateModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEditMode(true);
    setSelectedFestival(record);
    setFormData({
      eventName: record.eventName,
      description: record.description,
      startDate: record.startDate,
      endDate: record.endDate,
      location: record.location,
      tickets: [{ quantity: 0, price: 0, description: "", ticketType: 0 }],
      eventCharacters: [{ characterId: "", description: "", cosplayerId: "" }],
      eventActivities: [{ activityId: "", description: "", createBy: "" }],
      imageFiles: [],
    });
    setIsCreateModalVisible(true);
  };

  const showDetailsModal = async (record) => {
    try {
      const eventData = await ManageAllFestivalsService.getEventById(record.eventId);
      const cosplayers = await Promise.all(
        eventData.eventCharacterResponses.map(async (ec) => {
          const cosplayer = await ManageAllFestivalsService.getCosplayerByEventCharacterId(
            ec.eventCharacterId
          );
          return {
            eventCharacterId: ec.eventCharacterId,
            name: cosplayer.name,
            description: cosplayer.description || "No description",
            urlImage: cosplayer.images.find((img) => img.isAvatar)?.urlImage || cosplayer.images[0]?.urlImage,
          };
        })
      );
      setEventDetails({ ...eventData, cosplayers });
      setIsDetailsModalVisible(true);
    } catch (error) {
      toast.error(error.message || "Failed to load event details");
    }
  };

  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setIsDetailsModalVisible(false);
    setFormData({
      eventName: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      tickets: [{ quantity: 0, price: 0, description: "", ticketType: 0 }],
      eventCharacters: [{ characterId: "", description: "", cosplayerId: "" }],
      eventActivities: [{ activityId: "", description: "", createBy: "" }],
      imageFiles: [],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData((prev) => {
      const updatedArray = [...prev[arrayName]];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files); // Chuyển FileList thành mảng
    setFormData((prev) => ({
      ...prev,
      imageFiles: files, // Lưu tất cả file được chọn
    }));
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!formData.eventName || !formData.description || !formData.location || !formData.startDate || !formData.endDate) {
        toast.error("Please fill in all required fields!");
        return;
      }

      // Kiểm tra các mảng không rỗng và hợp lệ
      if (formData.tickets.length === 0 || formData.eventCharacters.length === 0 || formData.eventActivities.length === 0 || formData.imageFiles.length === 0) {
        toast.error("Please provide at least one ticket, character, activity, and image!");
        return;
      }

      const eventData = {
        EventName: formData.eventName,
        Description: formData.description,
        Location: formData.location,
        StartDate: formData.startDate,
        EndDate: formData.endDate,
        CreateBy: null,
        Ticket: formData.tickets,
        EventCharacterRequest: formData.eventCharacters,
        EventActivityRequests: formData.eventActivities,
      };

      // Gửi dữ liệu và file hình ảnh lên API
      await ManageAllFestivalsService.addEvent(eventData, formData.imageFiles);

      // Lấy lại danh sách festival sau khi thêm mới
      const updatedFestivals = await ManageAllFestivalsService.getAllEvents(searchTerm);
      setFestivals(updatedFestivals);
      toast.success("Festival created successfully!");

      // Đóng modal và reset form
      setIsCreateModalVisible(false);
      setFormData({
        eventName: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        tickets: [{ quantity: 0, price: 0, description: "", ticketType: 0 }],
        eventCharacters: [{ characterId: "", description: "", cosplayerId: "" }],
        eventActivities: [{ activityId: "", description: "", createBy: "" }],
        imageFiles: [],
      });
    } catch (error) {
      toast.error(error.message || "Failed to save festival");
    }
  };

  const handleDelete = (eventId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this festival?",
      onOk: () => {
        setFestivals(festivals.filter((f) => f.eventId !== eventId));
        toast.success("Festival deleted successfully!");
      },
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortFestival((prev) => ({
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
    <div className="manage-festivals">
      <h2 className="manage-festivals-title">Manage Festivals</h2>
      <div className="content-container">
        <Card className="manage-festivals-card">
          <Card.Body>
            <div className="table-header">
              <h3>Festivals</h3>
              <Form.Control
                type="text"
                placeholder="Search by Name, Description, or Location..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <Button
                type="primary"
                size="large"
                onClick={showCreateModal}
              >
                Add New Festival
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("eventName")}
                    >
                      Event Name
                      {sortFestival.field === "eventName" ? (
                        sortFestival.order === "asc" ? (
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
                  <th className="text-center">Location</th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("startDate")}
                    >
                      Start Date
                      {sortFestival.field === "startDate" ? (
                        sortFestival.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        )
                      ) : (
                        <ArrowUp size={16} className="default-sort-icon" />
                      )}
                    </span>
                  </th>
                  <th className="text-center">End Date</th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("createDate")}
                    >
                      Create Date
                      {sortFestival.field === "createDate" ? (
                        sortFestival.order === "asc" ? (
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
                {paginatedFestivals.map((festival) => (
                  <tr key={festival.eventId}>
                    <td className="text-center">{festival.eventName}</td>
                    <td className="text-center">{festival.description.length > 50 ? `${festival.description.slice(0, 50)}...` : festival.description}</td>
                    <td className="text-center">{festival.location}</td>
                    <td className="text-center">{festival.startDate.split("T")[0]}</td>
                    <td className="text-center">{festival.endDate.split("T")[0]}</td>
                    <td className="text-center">{new Date(festival.createDate).toLocaleDateString()}</td>
                    <td className="text-center">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => showEditModal(festival)}
                        style={{ marginRight: 8 }}
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Are you sure to delete this festival?"
                        onConfirm={() => handleDelete(festival.eventId)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="primary"
                          danger
                          size="small"
                          style={{ marginRight: 8 }}
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                      <Button
                        type="default"
                        size="small"
                        onClick={() => showDetailsModal(festival)}
                      >
                        Details
                      </Button>
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

      <Modal
        show={isCreateModalVisible}
        onHide={handleCancel}
        centered
        backdrop="static"
        className="festival-modal"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Edit Festival" : "Create Festival"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Thông tin cơ bản của sự kiện */}
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                placeholder="New Year Festival"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Event description"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date (Format: YYYY-MM-DD HH:mm:ss.SSSSSSS)</Form.Label>
              <Form.Control
                type="text"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                placeholder="2025-01-01 00:00:00.0000000"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date (Format: YYYY-MM-DD HH:mm:ss.SSSSSSS)</Form.Label>
              <Form.Control
                type="text"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                placeholder="2025-01-01 00:00:00.0000000"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Times Square"
                required
              />
            </Form.Group>

            {/* Tickets */}
            <Form.Group className="mb-3">
              <Form.Label>Tickets</Form.Label>
              {formData.tickets.map((ticket, index) => (
                <div key={index} className="mb-2 border p-3 rounded">
                  <Form.Group className="mb-2">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      value={ticket.quantity}
                      onChange={(e) =>
                        handleArrayChange("tickets", index, "quantity", Number(e.target.value))
                      }
                      placeholder="Quantity"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={ticket.price}
                      onChange={(e) =>
                        handleArrayChange("tickets", index, "price", Number(e.target.value))
                      }
                      placeholder="Price"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={ticket.description}
                      onChange={(e) =>
                        handleArrayChange("tickets", index, "description", e.target.value)
                      }
                      placeholder="Description"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Ticket Type</Form.Label>
                    <Form.Select
                      value={ticket.ticketType}
                      onChange={(e) =>
                        handleArrayChange("tickets", index, "ticketType", Number(e.target.value))
                      }
                      required
                    >
                      <option value={0}>Normal</option>
                      <option value={1}>Premium</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              ))}
              <Button
                variant="outline-primary"
                onClick={() =>
                  addArrayItem("tickets", { quantity: 0, price: 0, description: "", ticketType: 0 })
                }
              >
                <PlusCircle size={16} className="me-1" /> Add Ticket
              </Button>
            </Form.Group>

            {/* Event Characters */}
            <Form.Group className="mb-3">
              <Form.Label>Event Characters (Cosplayers)</Form.Label>
              {formData.eventCharacters.map((character, index) => (
                <div key={index} className="mb-2 border p-3 rounded">
                  <Form.Group className="mb-2">
                    <Form.Label>Character ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={character.characterId}
                      onChange={(e) =>
                        handleArrayChange("eventCharacters", index, "characterId", e.target.value)
                      }
                      placeholder="Character ID (e.g., CH014)"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={character.description}
                      onChange={(e) =>
                        handleArrayChange("eventCharacters", index, "description", e.target.value)
                      }
                      placeholder="Description (e.g., pika pika)"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Cosplayer ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={character.cosplayerId}
                      onChange={(e) =>
                        handleArrayChange("eventCharacters", index, "cosplayerId", e.target.value)
                      }
                      placeholder="Cosplayer ID (e.g., A001)"
                      required
                    />
                  </Form.Group>
                </div>
              ))}
              <Button
                variant="outline-primary"
                onClick={() =>
                  addArrayItem("eventCharacters", { characterId: "", description: "", cosplayerId: "" })
                }
              >
                <PlusCircle size={16} className="me-1" /> Add Cosplayer
              </Button>
            </Form.Group>

            {/* Event Activities */}
            <Form.Group className="mb-3">
              <Form.Label>Event Activities</Form.Label>
              {formData.eventActivities.map((activity, index) => (
                <div key={index} className="mb-2 border p-3 rounded">
                  <Form.Group className="mb-2">
                    <Form.Label>Activity ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={activity.activityId}
                      onChange={(e) =>
                        handleArrayChange("eventActivities", index, "activityId", e.target.value)
                      }
                      placeholder="Activity ID (e.g., ACT008)"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={activity.description}
                      onChange={(e) =>
                        handleArrayChange("eventActivities", index, "description", e.target.value)
                      }
                      placeholder="Description (e.g., chụp hình)"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Create By (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      value={activity.createBy}
                      onChange={(e) =>
                        handleArrayChange("eventActivities", index, "createBy", e.target.value)
                      }
                      placeholder="Create By (optional)"
                    />
                  </Form.Group>
                </div>
              ))}
              <Button
                variant="outline-primary"
                onClick={() =>
                  addArrayItem("eventActivities", { activityId: "", description: "", createBy: "" })
                }
              >
                <PlusCircle size={16} className="me-1" /> Add Activity
              </Button>
            </Form.Group>

            {/* Image Files */}
            <Form.Group className="mb-3">
              <Form.Label>Images (Select one or more images)</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageFilesChange}
                accept="image/*"
                required
              />
              {formData.imageFiles.length > 0 && (
                <div className="mt-2">
                  <strong>Selected Files:</strong>
                  <ul>
                    {formData.imageFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            {isEditMode ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={isDetailsModalVisible}
        onHide={handleCancel}
        centered
        size="lg"
        className="festival-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {eventDetails && (
            <div>
              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>Event Images</h3>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {eventDetails.eventImageResponses.map((img) => (
                  <Image key={img.imageId} src={img.imageUrl} width={150} />
                ))}
              </div>

              <Descriptions
                title={<span style={{ fontSize: "22px", fontWeight: 600 }}>Event Information</span>}
                bordered
                column={1}
                style={{ marginTop: 16 }}
              >
                <Descriptions.Item label="Event Name">{eventDetails.eventName}</Descriptions.Item>
                <Descriptions.Item label="Description">{eventDetails.description}</Descriptions.Item>
                <Descriptions.Item label="Location">{eventDetails.location}</Descriptions.Item>
                <Descriptions.Item label="Start Date">
                  {new Date(eventDetails.startDate).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="End Date">
                  {new Date(eventDetails.endDate).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Create Date">
                  {new Date(eventDetails.createDate).toLocaleDateString()}
                </Descriptions.Item>
              </Descriptions>

              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>Activities</h3>
              <List
                dataSource={eventDetails.eventActivityResponse}
                renderItem={(activity) => (
                  <List.Item>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Name">{activity.activity.name}</Descriptions.Item>
                      <Descriptions.Item label="Description">{activity.description}</Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
              />

              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>Cosplayers</h3>
              <List
                dataSource={eventDetails.cosplayers}
                renderItem={(cosplayer) => (
                  <List.Item>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Name">{cosplayer.name}</Descriptions.Item>
                      <Descriptions.Item label="Description">{cosplayer.description}</Descriptions.Item>
                      <Descriptions.Item label="Image">
                        <Image src={cosplayer.urlImage} width={100} />
                      </Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
              />

              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>Tickets</h3>
              <List
                dataSource={eventDetails.ticket}
                renderItem={(ticket) => (
                  <List.Item>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Type">
                        {ticket.ticketType === 0 ? "Normal" : "Premium"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Description">{ticket.description}</Descriptions.Item>
                      <Descriptions.Item label="Quantity">{ticket.quantity}</Descriptions.Item>
                      <Descriptions.Item label="Price">{ticket.price.toLocaleString()} VND</Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageAllFestivals;