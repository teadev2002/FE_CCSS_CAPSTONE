import React, { useState, useEffect } from "react";
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
import { ArrowUp, ArrowDown, PlusCircle } from "lucide-react";
import "../../../styles/Manager/ManageActivities.scss"; // Sử dụng SCSS của ManageAllFestivals
import ManageActivityService from "../../../services/ManageServicePages/ManageActivityService/ManageActivityService"; // Service mới
import { jwtDecode } from "jwt-decode";
import ProfileService from "../../../services/ProfileService/ProfileService";

// Định dạng ngày giờ
const dateTimeFormat = "DD/MM/YYYY HH:mm";

const ManageActivities = () => {
  // State quản lý danh sách activities
  const [activities, setActivities] = useState([]);
  // State quản lý modal tạo/sửa
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  // State xác định chế độ sửa
  const [isEditMode, setIsEditMode] = useState(false);
  // State lưu activity đang được chọn để sửa
  const [selectedActivity, setSelectedActivity] = useState(null);
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  // State quản lý tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  // State quản lý sắp xếp
  const [sortActivity, setSortActivity] = useState({
    field: "name",
    order: "asc",
  });
  // State quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [10, 20, 30];

  // Lấy danh sách activities khi component mount hoặc searchTerm thay đổi
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await ManageActivityService.getAllActivities(searchTerm);
        // Thêm createBy mặc định vì API chưa trả về
        const formattedData = data.map((activity) => ({
          ...activity,
          createBy: activity.createBy || "Unknown",
        }));
        setActivities(formattedData);
      } catch (error) {
        toast.error(error.message || "Failed to load activities");
      }
    };
    fetchActivities();
  }, [searchTerm]);

  // Hàm lọc và sắp xếp dữ liệu
  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          (item.createBy && item.createBy.toLowerCase().includes(search.toLowerCase()))
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

  // Dữ liệu đã lọc và sắp xếp
  const filteredActivities = filterAndSortData(activities, searchTerm, sortActivity);
  const totalEntries = filteredActivities.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);

  // Hàm phân trang
  const paginateData = (data, page) => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const paginatedActivities = paginateData(filteredActivities, currentPage);
  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  // Hiển thị modal tạo activity
  const showCreateModal = () => {
    setIsEditMode(false);
    setSelectedActivity(null);
    setFormData({
      name: "",
      description: "",
    });
    setIsCreateModalVisible(true);
  };

  // Hiển thị modal sửa activity
  const showEditModal = (record) => {
    setIsEditMode(true);
    setSelectedActivity(record);
    setFormData({
      name: record.name,
      description: record.description,
    });
    setIsCreateModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsCreateModalVisible(false);
    setFormData({
      name: "",
      description: "",
    });
  };

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Kiểm tra dữ liệu form
  const validateForm = () => {
    const errors = [];
    if (!formData.name.trim()) errors.push("Activity name is required");
    if (!formData.description.trim()) errors.push("Description is required");
    return errors;
  };

  // Xử lý gửi form (tạo hoặc sửa activity)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors.join("; "));
      return;
    }

    try {
      // Kiểm tra API chưa có
      toast.warn(
        isEditMode
          ? "Updating activity is not available yet"
          : "Creating activity is not available yet"
      );
      handleCancel();
    } catch (error) {
      console.error("Error saving activity:", error);
      toast.error(error.message || "Failed to save activity");
    }
  };

  // Xử lý xóa activity
  const handleDelete = async (activityId) => {
    try {
      // Kiểm tra API chưa có
      toast.warn("Deleting activity is not available yet");
    } catch (error) {
      toast.error(error.message || "Failed to delete activity");
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Xử lý sắp xếp
  const handleSort = (field) => {
    setSortActivity((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  // Xử lý chuyển trang
  const handlePageChange = (page) => setCurrentPage(page);

  // Xử lý thay đổi số dòng mỗi trang
  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  return (
    <div className="manage-festivals">
      <h2 className="manage-festivals-title">Manage Activities</h2>
      <div className="content-container">
        <Card className="manage-festivals-card">
          <Card.Body>
            <div className="table-header">
              <h3>Activities</h3>
              <Form.Control
                type="text"
                placeholder="Search by Name, Description, or Created By..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <Button type="primary" size="large" onClick={showCreateModal}>
                Add New Activity
              </Button>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">
                    <span className="sortable" onClick={() => handleSort("activityId")}>
                      Activity ID
                      {sortActivity.field === "activityId" ? (
                        sortActivity.order === "asc" ? (
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
                    <span className="sortable" onClick={() => handleSort("name")}>
                      Name
                      {sortActivity.field === "name" ? (
                        sortActivity.order === "asc" ? (
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
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("createDate")}
                    >
                      Create Date
                      {sortActivity.field === "createDate" ? (
                        sortActivity.order === "asc" ? (
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
                      {sortActivity.field === "createBy" ? (
                        sortActivity.order === "asc" ? (
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
                {paginatedActivities.map((activity) => (
                  <tr key={activity.activityId}>
                    <td className="text-center">{activity.activityId}</td>
                    <td className="text-center">{activity.name}</td>
                    <td className="text-center">
                      {activity.description.length > 50
                        ? `${activity.description.slice(0, 50)}...`
                        : activity.description}
                    </td>
                    <td className="text-center">
                      {new Date(activity.createDate).toLocaleDateString()}
                    </td>
                    <td className="text-center">{activity.createBy || "Unknown"}</td>
                    <td className="text-center">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => showEditModal(activity)}
                        style={{ marginRight: 8 }}
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Are you sure to delete this activity?"
                        onConfirm={() => handleDelete(activity.activityId)}
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

      {/* Modal tạo/sửa activity */}
      <Modal
        show={isCreateModalVisible}
        onHide={handleCancel}
        centered
        className="festival-modal"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Activity" : "Create Activity"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Activity Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Activity Name"
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
                placeholder="Activity description"
                required
              />
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
    </div>
  );
};

export default ManageActivities;