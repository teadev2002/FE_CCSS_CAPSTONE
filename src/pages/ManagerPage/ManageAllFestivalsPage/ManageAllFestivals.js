import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { Button, Popconfirm, Image, Descriptions, List, Select } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowUp, ArrowDown, PlusCircle } from "lucide-react";
import "../../../styles/Manager/ManageAllFestivals.scss";
import ManageAllFestivalsService from "../../../services/ManageServicePages/ManageAllFestivalsService/ManageAllFestivalsService";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import ProfileService from "../../../services/ProfileService/ProfileService";


const { RangePicker: DateRangePicker } = DatePicker;
const { Option } = Select;
const dateTimeFormat = "DD/MM/YYYY HH:mm";

const ManageAllFestivals = () => {
  const [festivals, setFestivals] = useState([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [activities, setActivities] = useState([]);
  const [cosplayers, setCosplayers] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [formData, setFormData] = useState({
    eventName: "",
    description: "",
    dateRange: null,
    location: "",
    tickets: [{ quantity: 0, price: 0, description: "", ticketType: 0 }],
    selectedCosplayers: [],
    eventActivities: [],
    imageFiles: [],
    imagePreviews: [],
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
    if (isCreateModalVisible || isDetailsModalVisible) {
      const fetchCharactersAndActivities = async () => {
        try {
          let charData = [];
          if (formData.dateRange) {
            const [startDate, endDate] = formData.dateRange;
            const formattedStartDate = startDate.format("DD/MM/YYYY");
            const formattedEndDate = endDate.format("DD/MM/YYYY");
            charData = await ManageAllFestivalsService.getAllCharacters(
              formattedStartDate,
              formattedEndDate
            );
            console.log("Characters:", charData);
            charData.forEach((char) =>
              console.log("Character ID:", char.characterId, typeof char.characterId)
            );
          }
          setCharacters(Array.isArray(charData) ? charData : []);

          const actData = await ManageAllFestivalsService.getAllActivities();
          console.log("Activities:", actData);
          setActivities(Array.isArray(actData) ? actData : []);
        } catch (error) {
          toast.error(error.message || "Failed to load characters or activities");
          setCharacters([]);
          setActivities([]);
        }
      };
      fetchCharactersAndActivities();
    }
  }, [isCreateModalVisible, isDetailsModalVisible, formData.dateRange]);

  useEffect(() => {
    if (selectedCharacterId && formData.dateRange) {
      if (typeof selectedCharacterId !== 'string' || !selectedCharacterId) {
        toast.error("Invalid character ID");
        setCosplayers([]);
        return;
      }

      const [startDate, endDate] = formData.dateRange;
      const startDateTime = startDate.format("HH:mm DD/MM/YYYY");
      const endDateTime = endDate.format("HH:mm DD/MM/YYYY");

      console.log("Fetching cosplayers with:", {
        characterId: selectedCharacterId,
        startDate: startDateTime,
        endDate: endDateTime,
      });

      const fetchCosplayers = async () => {
        try {
          const cosplayerData = await ManageAllFestivalsService.getAvailableCosplayers(
            selectedCharacterId,
            startDateTime,
            endDateTime
          );
          const selectedCosplayerIds = formData.selectedCosplayers.map(sc => sc.cosplayerId);
          const filteredCosplayers = cosplayerData.filter(
            cosplayer => !selectedCosplayerIds.includes(cosplayer.accountId)
          );
          console.log("Filtered Cosplayers:", filteredCosplayers);
          filteredCosplayers.forEach(cosplayer => {
            console.log(`Cosplayer ${cosplayer.name} images:`, cosplayer.images);
          });
          if (Array.isArray(filteredCosplayers) && filteredCosplayers.length === 0) {
            toast.warn("No cosplayers available for this character and time range.");
          }
          setCosplayers(Array.isArray(filteredCosplayers) ? filteredCosplayers : []);
        } catch (error) {
          console.error("Error fetching cosplayers:", error.response?.data || error);
          toast.error(error.message || "Failed to load cosplayers");
          setCosplayers([]);
        }
      };
      fetchCosplayers();
    } else {
      setCosplayers([]);
    }
  }, [selectedCharacterId, formData.dateRange, formData.selectedCosplayers]);

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
          item.createDate.toLowerCase().includes(search.toLowerCase()) ||
          (item.createBy && item.createBy.toLowerCase().includes(search.toLowerCase())) // Thêm tìm kiếm theo createBy
      );
    }
    return filtered.sort((a, b) => {
      const valueA = String(a[sort.field] || "").toLowerCase();
      const valueB = String(b[sort.field] || "").toLowerCase();
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
      dateRange: null,
      location: "",
      tickets: [{ quantity: 0, price: 0, description: "", ticketType: 0 }],
      selectedCosplayers: [],
      eventActivities: [],
      imageFiles: [],
      imagePreviews: [],
    });
    setSelectedCharacterId(null);
    setCosplayers([]);
    setIsCreateModalVisible(true);
  };

  const showEditModal = (record) => {
    setIsEditMode(true);
    setSelectedFestival(record);
    setFormData({
      eventName: record.eventName,
      description: record.description,
      dateRange: [
        dayjs(record.startDate, "YYYY-MM-DD HH:mm:ss"),
        dayjs(record.endDate, "YYYY-MM-DD HH:mm:ss"),
      ],
      location: record.location,
      tickets: [{ quantity: 0, price: 0, description: "", ticketType: 0 }],
      selectedCosplayers: [],
      eventActivities: [],
      imageFiles: [],
      imagePreviews: [],
    });
    setIsCreateModalVisible(true);
  };

  const showDetailsModal = async (record) => {
    try {
      const eventData = await ManageAllFestivalsService.getEventById(record.eventId);
      console.log("Event data:", eventData);
      const cosplayers = await Promise.all(
        eventData.eventCharacterResponses.map(async (ec) => {
          const cosplayer = await ManageAllFestivalsService.getCosplayerByEventCharacterId(
            ec.eventCharacterId
          );
          const character = characters.find(char => char.characterId === ec.characterId);
          console.log("Cosplayer data:", cosplayer);
          return {
            eventCharacterId: ec.eventCharacterId,
            name: cosplayer.name,
            description: character ? `Cosplay as ${character.characterName}` : "No character info",
            urlImage:
              cosplayer.images?.find((img) => img.isAvatar)?.urlImage ||
              cosplayer.images?.[0]?.urlImage ||
              "https://via.placeholder.com/100?text=No+Image",
          };
        })
      );

      const updatedActivities = eventData.eventActivityResponse.map(activity => {
        const matchingActivity = activities.find(act => act.activityId === activity.activityId);
        console.log(`Activity ${activity.activityId}:`, { matchingActivity, description: matchingActivity?.description });
        return {
          ...activity,
          description: matchingActivity?.description || "No description available",
        };
      });

      setEventDetails({ ...eventData, cosplayers, eventActivityResponse: updatedActivities });
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
      dateRange: null,
      location: "",
      tickets: [{ quantity: 0, price: 0, description: "", ticketType: 0 }],
      selectedCosplayers: [],
      eventActivities: [],
      imageFiles: [],
      imagePreviews: [],
    });
    setSelectedCharacterId(null);
    setCosplayers([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (dates) => {
    if (!dates) {
      setFormData((prev) => ({ ...prev, dateRange: null }));
      setSelectedCharacterId(null);
      setCosplayers([]);
      setCharacters([]); // Reset characters khi bỏ chọn date range
      return;
    }

    const [start, end] = dates;
    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");

    if (start.isBefore(tomorrow)) {
      toast.error("Start date must be tomorrow or later!");
      setFormData((prev) => ({ ...prev, dateRange: null }));
      setSelectedCharacterId(null);
      setCosplayers([]);
      setCharacters([]);
      return;
    }

    if (end.isBefore(start)) {
      toast.error("End date must be on or after start date!");
      setFormData((prev) => ({ ...prev, dateRange: null }));
      setSelectedCharacterId(null);
      setCosplayers([]);
      setCharacters([]);
      return;
    }

    setFormData((prev) => ({ ...prev, dateRange: dates }));
    setSelectedCharacterId(null); // Reset character khi thay đổi date range
    setCosplayers([]); // Reset cosplayers
  };

  const disabledDate = (current) => {
    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");
    return current && current < tomorrow;
  };

  const disabledTime = () => {
    const startHour = 8;
    const endHour = 22;

    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < 24; i++) {
          if (i < startHour || i > endHour) {
            hours.push(i);
          }
        }
        return hours;
      },
      disabledMinutes: (selectedHour) => {
        if (selectedHour === startHour || selectedHour === endHour) {
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => minute !== 0
          );
        }
        return [];
      },
    };
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    if ((field === "quantity" || field === "price") && Number(value) < 0) {
      toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} cannot be negative!`);
      return;
    }
    setFormData((prev) => {
      const updatedArray = [...prev[arrayName]];
      updatedArray[index] = { ...updatedArray[index], [field]: value };
      return { ...prev, [arrayName]: updatedArray };
    });
  };

  const handleImageFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...files],
      imagePreviews: [...prev.imagePreviews, ...newPreviews],
    }));
  };

  const addMoreImages = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = handleImageFilesChange;
    input.click();
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const updatedFiles = [...prev.imageFiles];
      const updatedPreviews = [...prev.imagePreviews];
      updatedFiles.splice(index, 1);
      updatedPreviews.splice(index, 1);
      URL.revokeObjectURL(prev.imagePreviews[index]);
      return {
        ...prev,
        imageFiles: updatedFiles,
        imagePreviews: updatedPreviews,
      };
    });
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultItem],
    }));
  };

  const handleAddCosplayer = (cosplayer) => {
    const character = characters.find((c) => c.characterId === selectedCharacterId);
    const currentCount = formData.selectedCosplayers.filter(
      (sc) => sc.characterId === selectedCharacterId
    ).length;

    if (currentCount >= character.quantity) {
      toast.error(
        `Cannot add more cosplayers for ${character.characterName}. Maximum quantity is ${character.quantity}.`
      );
      return;
    }

    setFormData((prev) => ({
      ...prev,
      selectedCosplayers: [
        ...prev.selectedCosplayers,
        {
          characterId: selectedCharacterId,
          cosplayerId: cosplayer.accountId,
          cosplayerName: cosplayer.name,
          description: cosplayer.description || "Cosplayer for event",
        },
      ],
    }));
    toast.success(`Added cosplayer ${cosplayer.name}`);
  };

  const handleRemoveCosplayer = (index) => {
    setFormData((prev) => ({
      ...prev,
      selectedCosplayers: prev.selectedCosplayers.filter((_, i) => i !== index),
    }));
  };

  const handleActivityChange = (selectedActivityIds) => {
    const newActivities = selectedActivityIds.map((activityId) => ({
      activityId,
      description: activities.find((act) => act.activityId === activityId)?.description || "",
      createBy: "",
    }));
    setFormData((prev) => ({
      ...prev,
      eventActivities: newActivities,
    }));
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.eventName.trim()) errors.push("Event name is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.location.trim()) errors.push("Location is required");
    if (!formData.dateRange) errors.push("Date and time range is required");
    if (formData.tickets.length === 0) errors.push("At least one ticket is required");
    if (formData.selectedCosplayers.length === 0)
      errors.push("At least one cosplayer is required");
    if (formData.eventActivities.length === 0)
      errors.push("At least one activity is required");
    if (formData.imageFiles.length === 0) errors.push("At least one image is required");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors.join("; "));
      return;
    }

    try {
      const [startDate, endDate] = formData.dateRange;
      const token = localStorage.getItem("accessToken");
      let createBy = "Unknown User";

      // Kiểm tra và lấy accountId từ token
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          console.log("Decoded token:", decodedToken);
          const accountId =
            decodedToken.Id ||
            decodedToken.id ||
            decodedToken.sub ||
            decodedToken.userId;

          if (!accountId) {
            console.warn("No accountId found in decoded token");
          } else {
            // Gọi API để lấy thông tin hồ sơ, giống ProfilePage
            try {
              const profileData = await ProfileService.getProfileById(accountId);
              createBy = profileData.name || "Unknown User";
              console.log("Profile name fetched:", createBy);
            } catch (error) {
              console.error("Error fetching profile:", error);
              toast.error("Failed to fetch user profile");
            }
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          toast.error("Invalid access token");
        }
      } else {
        console.warn("No access token found in localStorage");
        toast.warn("No access token available");
      }

      // Tạo dữ liệu sự kiện với createBy đã lấy
      const eventData = {
        eventName: formData.eventName,
        description: formData.description,
        location: formData.location,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        createBy: createBy,
        ticket: formData.tickets,
        eventCharacterRequest: formData.selectedCosplayers.map((sc) => ({
          characterId: sc.characterId,
          cosplayerId: sc.cosplayerId,
          description: sc.description,
        })),
        eventActivityRequests: formData.eventActivities,
      };

      const eventJson = JSON.stringify(eventData, null, 0);
      console.log("Event JSON before sending:", eventJson);
      console.log("Image files before sending:", formData.imageFiles);

      // Gửi yêu cầu tạo sự kiện
      await ManageAllFestivalsService.addEvent(eventJson, formData.imageFiles);

      // Cập nhật danh sách festivals
      const updatedFestivals = await ManageAllFestivalsService.getAllEvents(searchTerm);
      setFestivals(updatedFestivals);
      toast.success("Festival created successfully!");

      handleCancel();
    } catch (error) {
      console.error("Error adding event:", error);
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
                placeholder="Search by Name, Description, Location, or Created By..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <Button type="primary" size="large" onClick={showCreateModal}>
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
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("createBy")}
                    >
                      Created By
                      {sortFestival.field === "createBy" ? (
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
                    <td className="text-center">
                      {festival.description.length > 50
                        ? `${festival.description.slice(0, 50)}...`
                        : festival.description}
                    </td>
                    <td className="text-center">{festival.location}</td>
                    <td className="text-center">{festival.startDate.split("T")[0]}</td>
                    <td className="text-center">{festival.endDate.split("T")[0]}</td>
                    <td className="text-center">
                      <td className="text-center">{festival.createDate.split("T")[0]}</td>
                    </td>
                    <td className="text-center">{festival.createBy || "Unknown"}</td>
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
              <Form.Label>Date and Time Range</Form.Label>
              <DateRangePicker
                value={formData.dateRange}
                onChange={handleDateRangeChange}
                format={dateTimeFormat}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
                showTime={{ format: "HH:mm" }}
                allowClear={false}
                inputReadOnly={true}
                required
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  border: "1px solid #ced4da",
                  fontSize: "16px",
                  zIndex: 9999,
                }}
                popupStyle={{ zIndex: 9999 }}
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

            {formData.dateRange && (
              <Form.Group className="mb-3">
                <Form.Label>Select Character</Form.Label>
                <Select
                  style={{ width: "100%", zIndex: 9999 }}
                  placeholder="Select a character"
                  onChange={setSelectedCharacterId}
                  value={selectedCharacterId}
                  dropdownStyle={{ zIndex: 9999 }}
                >
                  {characters.map((char) => (
                    <Option key={char.characterId} value={char.characterId}>
                      {char.characterName} (Quantity: {char.quantity}, ID: {char.characterId})
                    </Option>
                  ))}
                </Select>

                {selectedCharacterId && (
                  <div className="character-info mt-3">
                    {characters
                      .filter((char) => char.characterId === selectedCharacterId)
                      .map((char) => (
                        <div key={char.characterId} style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={
                              char.images?.find((img) => img.isAvatar)?.urlImage ||
                              char.images?.[0]?.urlImage ||
                              "https://via.placeholder.com/100?text=No+Image"
                            }
                            alt={char.characterName}
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "5px",
                              marginRight: "10px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <strong>{char.characterName}</strong>
                            <p>Quantity: {char.quantity}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {selectedCharacterId && cosplayers.length > 0 && (
                  <div className="cosplayer-grid mt-3">
                    <h5>Available Cosplayers</h5>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                        gap: "15px",
                        padding: "10px",
                        maxHeight: "300px",
                        overflowY: "auto",
                      }}
                    >
                      {cosplayers.map((cosplayer) => (
                        <div
                          key={cosplayer.accountId}
                          style={{
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            padding: "10px",
                            textAlign: "center",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            transition: "transform 0.2s",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            height: "180px",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                          <div
                            style={{
                              width: "100px",
                              height: "100px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              backgroundColor: "#f0f0f0",
                              marginBottom: "10px",
                            }}
                          >
                            <img
                              src={
                                cosplayer.images?.find((img) => img.isAvatar)?.urlImage ||
                                cosplayer.images?.[0]?.urlImage ||
                                "https://via.placeholder.com/100?text=No+Image"
                              }
                              alt={cosplayer.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              margin: "0 0 10px",
                              color: "#333",
                              flex: "1",
                            }}
                          >
                            {cosplayer.name}
                          </p>
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleAddCosplayer(cosplayer)}
                            style={{
                              fontSize: "12px",
                              padding: "2px 8px",
                              borderRadius: "4px",
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedCharacterId && cosplayers.length === 0 && (
                  <p className="mt-2">No cosplayers available for this character.</p>
                )}

                <h5 className="mt-3">Selected Cosplayers</h5>
                <List
                  dataSource={formData.selectedCosplayers}
                  renderItem={(item, index) => {
                    const character = characters.find((c) => c.characterId === item.characterId);
                    return (
                      <List.Item
                        actions={[
                          <Button
                            type="primary"
                            danger
                            size="small"
                            onClick={() => handleRemoveCosplayer(index)}
                          >
                            Remove
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          title={`Character: ${character?.characterName || item.characterId}`}
                          description={`Cosplayer: ${item.cosplayerName}`}
                        />
                      </List.Item>
                    );
                  }}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Tickets</Form.Label>
              {formData.tickets.map((ticket, index) => (
                <div key={index} className="mb-2 border p-3 rounded">
                  <Form.Group className="mb-2">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={ticket.quantity}
                      onChange={(e) =>
                        handleArrayChange(
                          "tickets",
                          index,
                          "quantity",
                          Number(e.target.value)
                        )
                      }
                      placeholder="Quantity"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-2">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={ticket.price}
                      onChange={(e) =>
                        handleArrayChange(
                          "tickets",
                          index,
                          "price",
                          Number(e.target.value)
                        )
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
                        handleArrayChange(
                          "tickets",
                          index,
                          "description",
                          e.target.value
                        )
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
                        handleArrayChange(
                          "tickets",
                          index,
                          "ticketType",
                          Number(e.target.value)
                        )
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
                  addArrayItem("tickets", {
                    quantity: 0,
                    price: 0,
                    description: "",
                    ticketType: 0,
                  })
                }
              >
                <PlusCircle size={16} className="me-1" /> Add Ticket
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Event Activities</Form.Label>
              <Select
                mode="multiple"
                style={{ width: "100%", zIndex: 9999 }}
                placeholder="Select activities"
                onChange={handleActivityChange}
                optionLabelProp="label"
                dropdownStyle={{ zIndex: 9999 }}
              >
                {activities.map((act) => (
                  <Option
                    key={act.activityId}
                    value={act.activityId}
                    label={act.name}
                  >
                    {act.name} - {act.description}
                  </Option>
                ))}
              </Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Images (Select one or more images)</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageFilesChange}
                accept="image/*"
                required={!formData.imageFiles.length}
              />
              {formData.imagePreviews.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Selected Images:</strong>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    {formData.imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <img
                          src={preview}
                          alt={`preview-${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "5px",
                          }}
                        />
                        <Button
                          type="primary"
                          danger
                          size="small"
                          onClick={() => removeImage(index)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            fontSize: "10px",
                            padding: "2px 5px",
                          }}
                        >
                          X
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Button
                variant="outline-primary"
                onClick={addMoreImages}
                style={{ marginTop: "10px" }}
              >
                <PlusCircle size={16} className="me-1" /> Add More Images
              </Button>
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
              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>
                Event Images
              </h3>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {eventDetails.eventImageResponses.map((img) => (
                  <Image key={img.imageId} src={img.imageUrl} width={150} />
                ))}
              </div>

              <Descriptions
                title={
                  <span style={{ fontSize: "22px", fontWeight: 600 }}>
                    Event Information
                  </span>
                }
                bordered
                column={1}
                style={{ marginTop: 16 }}
              >
                <Descriptions.Item label="Event Name">
                  {eventDetails.eventName}
                </Descriptions.Item>
                <Descriptions.Item label="Description">
                  {eventDetails.description}
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {eventDetails.location}
                </Descriptions.Item>
                <Descriptions.Item label="Start Date">
                  {new Date(eventDetails.startDate).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="End Date">
                  {new Date(eventDetails.endDate).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Create Date">
                  {new Date(eventDetails.createDate).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Created By">
                  {eventDetails.createBy || "Unknown"}
                </Descriptions.Item>
              </Descriptions>

              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>
                Activities
              </h3>
              <List
                dataSource={eventDetails.eventActivityResponse}
                renderItem={(activity) => (
                  <List.Item>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Name">
                        {activity.activity.name}
                      </Descriptions.Item>
                      <Descriptions.Item label="Description">
                        {activity.description}
                      </Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
              />

              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>
                Cosplayers
              </h3>
              <List
                dataSource={eventDetails.cosplayers}
                renderItem={(cosplayer) => (
                  <List.Item>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Name">
                        {cosplayer.name}
                      </Descriptions.Item>
                      <Descriptions.Item label="Description">
                        {cosplayer.description}
                      </Descriptions.Item>
                      <Descriptions.Item label="Image">
                        <Image src={cosplayer.urlImage} width={100} />
                      </Descriptions.Item>
                    </Descriptions>
                  </List.Item>
                )}
              />

              <h3 style={{ marginTop: 16, fontSize: "22px", fontWeight: 600 }}>
                Tickets
              </h3>
              <List
                dataSource={eventDetails.ticket}
                renderItem={(ticket) => (
                  <List.Item>
                    <Descriptions bordered column={1}>
                      <Descriptions.Item label="Type">
                        {ticket.ticketType === 0 ? "Normal" : "Premium"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Description">
                        {ticket.description}
                      </Descriptions.Item>
                      <Descriptions.Item label="Quantity">
                        {ticket.quantity}
                      </Descriptions.Item>
                      <Descriptions.Item label="Price">
                        {ticket.price.toLocaleString()} VND
                      </Descriptions.Item>
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