import React, { useState, useEffect } from "react";
import { Table, Form, Card } from "react-bootstrap";
import {
  Button,
  Modal,
  Dropdown,
  Pagination,
  Menu,
  Tooltip,
  Input,
  DatePicker,
  Popconfirm,
  Spin,
  message,
} from "antd";
import { ArrowUp, ArrowDown } from "lucide-react";
import moment from "moment";
import ViewTaskCosplayer from "./ViewTaskCosplayer";
import TaskCosplayerService from "../../../services/ManageServicePages/ManageTaskCosplayerService/TaskCosplayerService";
import "../../../styles/Manager/ManageTaskCosplayer.scss";

const { RangePicker } = DatePicker;

const ManageTaskCosplayer = () => {
  const [tasks, setTasks] = useState([]);
  const [cosplayerNames, setCosplayerNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formData, setFormData] = useState({
    taskId: "",
    accountId: "",
    taskName: "",
    location: "",
    description: "",
    isActive: true,
    startDate: "",
    endDate: "",
    createDate: "",
    updateDate: "",
    status: "",
    eventId: "",
    contractId: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "taskId",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dateFilter, setDateFilter] = useState(null);
  const rowsPerPageOptions = [5, 10, 20];

  // Fetch tasks and cosplayer names
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasksData = await TaskCosplayerService.getAllTask();
      setTasks(tasksData);

      const uniqueAccountIds = [
        ...new Set(tasksData.map((task) => task.accountId)),
      ];
      const namePromises = uniqueAccountIds.map((accountId) =>
        TaskCosplayerService.getInfoCosplayerByAccountId(accountId)
          .then((data) => ({ accountId, name: data.name || "Unknown" }))
          .catch(() => ({ accountId, name: "Unknown" }))
      );
      const nameResults = await Promise.all(namePromises);
      const namesMap = nameResults.reduce((acc, { accountId, name }) => {
        acc[accountId] = name;
        return acc;
      }, {});
      setCosplayerNames(namesMap);
    } catch (err) {
      setError("Failed to load tasks or cosplayer info. Please try again.");
      message.error("Failed to load tasks or cosplayer info.");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = async (taskData) => {
    try {
      console.log("Editing task:", taskData);
      setTasks(
        tasks.map((task) => (task.taskId === taskData.taskId ? taskData : task))
      );
      message.success("Task updated successfully (simulated).");
    } catch (err) {
      message.error("Failed to update task.");
    }
  };

  // Handle delete
  const handleDelete = async (taskId) => {
    try {
      console.log("Deleting task:", taskId);
      setTasks(tasks.filter((task) => task.taskId !== taskId));
      message.success("Task deleted successfully (simulated).");
    } catch (err) {
      message.error("Failed to delete task.");
    }
  };

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const filterAndSortData = (data, search, nameSearch, sort, dateRange) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.taskId.toLowerCase().includes(search.toLowerCase()) ||
          item.taskName.toLowerCase().includes(search.toLowerCase()) ||
          item.location.toLowerCase().includes(search.toLowerCase()) ||
          item.status.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (nameSearch) {
      filtered = filtered.filter((item) =>
        (cosplayerNames[item.accountId] || "")
          .toLowerCase()
          .includes(nameSearch.toLowerCase())
      );
    }
    if (dateRange) {
      filtered = filtered.filter((item) => {
        const taskDate = moment(item.startDate, "HH:mm DD/MM/YYYY");
        return taskDate.isBetween(dateRange[0], dateRange[1], null, "[]");
      });
    }
    return filtered.sort((a, b) => {
      let valueA = String(a[sort.field] || "").toLowerCase();
      let valueB = String(b[sort.field] || "").toLowerCase();
      if (sort.field === "accountId") {
        valueA = (cosplayerNames[a.accountId] || "").toLowerCase();
        valueB = (cosplayerNames[b.accountId] || "").toLowerCase();
      }
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const handleWeekFilter = () => {
    const startOfWeek = moment().startOf("week");
    const endOfWeek = moment().endOf("week");
    setDateFilter([startOfWeek, endOfWeek]);
    setCurrentPage(1);
  };

  const handleMonthFilter = () => {
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");
    setDateFilter([startOfMonth, endOfMonth]);
    setCurrentPage(1);
  };

  const handleCustomDateFilter = (dates) => {
    setDateFilter(dates);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setNameSearchQuery("");
    setDateFilter(null);
    setCurrentPage(1);
  };

  const filteredTasks = filterAndSortData(
    tasks,
    searchQuery,
    nameSearchQuery,
    sortConfig,
    dateFilter
  );
  const totalEntries = filteredTasks.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  const handleShowEditModal = (task = null) => {
    if (task) {
      setIsEditing(true);
      setCurrentTask(task);
      setFormData({ ...task });
    }
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setIsEditing(false);
    setCurrentTask(null);
  };

  const handleShowViewModal = (task) => {
    setCurrentTask(task);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setCurrentTask(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      handleEdit(formData);
    }
    handleCloseEditModal();
  };

  const handleSort = (field) => {
    setSortConfig((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="manage-task-cosplayer">
      <h2 className="manage-task-title">Cosplayer Task Management</h2>
      <div className="table-container">
        <Card className="task-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Tasks</h3>
              <div className="filter-controls">
                <Input
                  placeholder="Search by ID, Task Name, Location, Status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  style={{ width: 250 }}
                />
                <Input
                  placeholder="Search by Cosplayer Name..."
                  value={nameSearchQuery}
                  onChange={(e) => setNameSearchQuery(e.target.value)}
                  className="search-input"
                  style={{ width: 200 }}
                />
                <Button type="default" onClick={handleWeekFilter}>
                  This Week
                </Button>
                <Button type="default" onClick={handleMonthFilter}>
                  This Month
                </Button>

                <Button type="default" danger onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("accountId")}
                    >
                      Cosplayer Name
                      {sortConfig.field === "accountId" &&
                        (sortConfig.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("taskName")}
                    >
                      Task Name
                      {sortConfig.field === "taskName" &&
                        (sortConfig.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("location")}
                    >
                      Location
                      {sortConfig.field === "location" &&
                        (sortConfig.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">Description</th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("isActive")}
                    >
                      Active
                      {sortConfig.field === "isActive" &&
                        (sortConfig.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("startDate")}
                    >
                      Start Date
                      {sortConfig.field === "startDate" &&
                        (sortConfig.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("endDate")}
                    >
                      End Date
                      {sortConfig.field === "endDate" &&
                        (sortConfig.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("createDate")}
                    >
                      Create Date
                      {sortConfig.field === "createDate" &&
                        (sortConfig.order === "asc" ? (
                          <ArrowUp size={16} />
                        ) : (
                          <ArrowDown size={16} />
                        ))}
                    </span>
                  </th>
                  <th className="text-center">
                    <span
                      className="sortable"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      {sortConfig.field === "status" &&
                        (sortConfig.order === "asc" ? (
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
                {paginatedTasks.map((task) => (
                  <tr key={task.taskId}>
                    <td className="text-center">
                      {cosplayerNames[task.accountId] || "Loading..."}
                    </td>
                    <td className="text-center">{task.taskName}</td>
                    <td className="text-center">{task.location}</td>
                    <td className="text-center">{task.description}</td>
                    <td className="text-center">
                      {task.isActive ? "Yes" : "No"}
                    </td>
                    <td className="text-center">{task.startDate}</td>
                    <td className="text-center">{task.endDate}</td>
                    <td className="text-center">{task.createDate}</td>
                    <td className="text-center">{task.status}</td>
                    <td className="text-center">
                      <Tooltip title="View Task Details">
                        <Button
                          type="default"
                          size="small"
                          onClick={() => handleShowViewModal(task)}
                          style={{ marginRight: "8px" }}
                        >
                          View
                        </Button>
                      </Tooltip>
                      {/* <Tooltip title="Edit Task">
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => handleShowEditModal(task)}
                          style={{ marginRight: "8px" }}
                        >
                          Edit
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete Task">
                        <Popconfirm
                          title="Are you sure to delete this task?"
                          onConfirm={() => handleDelete(task.taskId)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="primary" danger size="small">
                            Delete
                          </Button>
                        </Popconfirm>
                      </Tooltip> */}
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
                    overlay={
                      <Menu
                        onClick={({ key }) => setRowsPerPage(Number(key))}
                        selectedKeys={[rowsPerPage.toString()]}
                      >
                        {rowsPerPageOptions.map((option) => (
                          <Menu.Item key={option}>{option}</Menu.Item>
                        ))}
                      </Menu>
                    }
                  >
                    <Button>{rowsPerPage}</Button>
                  </Dropdown>
                </div>
              </div>
              <Pagination
                current={currentPage}
                total={totalEntries}
                pageSize={rowsPerPage}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Edit Task Modal */}
      <Modal
        title="Edit Task"
        open={showEditModal}
        onCancel={handleCloseEditModal}
        footer={[
          <Button key="cancel" onClick={handleCloseEditModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Update Task
          </Button>,
        ]}
        centered
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Task ID</Form.Label>
            <Form.Control
              type="text"
              name="taskId"
              value={formData.taskId}
              onChange={handleInputChange}
              disabled
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Account ID</Form.Label>
            <Form.Control
              type="text"
              name="accountId"
              value={formData.accountId}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Task Name</Form.Label>
            <Form.Control
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleInputChange}
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
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Active</Form.Label>
            <Form.Select
              name="isActive"
              value={formData.isActive.toString()}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isActive: e.target.value === "true",
                })
              }
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="text"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="text"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Create Date</Form.Label>
            <Form.Control
              type="text"
              name="createDate"
              value={formData.createDate}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              required
            >
              <option value="Pending">Pending</option>
              <option value="Assignment">Assignment</option>
              <option value="Progressing">Progressing</option>
              <option value="Completed">Completed</option>
              <option value="Cancel">Cancel</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal>

      {/* View Task Modal */}
      <Modal
        title="Task Details"
        open={showViewModal}
        onCancel={handleCloseViewModal}
        width={800}
        footer={[
          <Button key="close" onClick={handleCloseViewModal}>
            Close
          </Button>,
        ]}
        centered
      >
        {currentTask && <ViewTaskCosplayer task={currentTask} />}
      </Modal>
    </div>
  );
};

export default ManageTaskCosplayer;
