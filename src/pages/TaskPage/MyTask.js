// đổi vị trí update status====================================================
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Badge,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";
import { Tabs, Pagination } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyTask.scss";
import { useParams, useNavigate } from "react-router-dom";
import TaskService from "../../services/TaskService/TaskService";
import RequestCharacter from "./RequestCharacter";
import {
  FileText,
  Code,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const { TabPane } = Tabs;

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [view, setView] = useState("list");
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [accountName, setAccountName] = useState(null);
  const [isLoadingAccount, setIsLoadingAccount] = useState(false);
  const itemsPerPage = 5;
  const [selectedStatus, setSelectedStatus] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const validStatuses = ["Assignment", "Progressing", "Completed"];
  const getAllowedStatuses = (currentStatus) => {
    if (currentStatus === "Assignment") {
      return ["Progressing"];
    } else if (currentStatus === "Progressing") {
      return ["Completed"];
    }
    return []; // No status changes allowed for Completed
  };
  const parseDateTime = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return { date: "N/A", time: "N/A" };
    }
    try {
      const [time, date] = dateString.split(" ");
      if (!time || !date) {
        return { date: "N/A", time: "N/A" };
      }
      const [day, month, year] = date.split("/");
      if (!day || !month || !year) {
        return { date: "N/A", time: "N/A" };
      }
      return { date: `${day}/${month}/${year}`, time };
    } catch (error) {
      console.warn(`Invalid date format: ${dateString}`, error);
      return { date: "N/A", time: "N/A" };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      return "N/A";
    }
    try {
      const [time, date] = dateString.split(" ");
      if (!time || !date) {
        return "N/A";
      }
      const [day, month, year] = date.split("/");
      if (!day || !month || !year) {
        return "N/A";
      }
      return `${day}/${month}/${year} ${time}`;
    } catch (error) {
      console.warn(`Invalid date format: ${dateString}`, error);
      return "N/A";
    }
  };

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days = [];

    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    setCalendarDays(days);
  }, [currentDate]);

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getTasksForDay = (day) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    return tasks.filter((task) => {
      const parseDate = (dateString) => {
        if (!dateString || typeof dateString !== "string") {
          return null;
        }
        try {
          const [, datePart] = dateString.split(" ");
          if (!datePart) return null;
          const [day, month, year] = datePart.split("/").map(Number);
          if (!day || !month || !year) return null;
          return new Date(year, month - 1, day);
        } catch (error) {
          console.warn(`Invalid date format: ${dateString}`, error);
          return null;
        }
      };

      const taskStart = parseDate(task.startDate);
      const taskEnd = parseDate(task.endDate);

      if (!taskStart || !taskEnd) {
        return false;
      }

      taskStart.setHours(0, 0, 0, 0);
      taskEnd.setHours(23, 59, 59, 999);

      return dayStart >= taskStart && dayStart <= taskEnd;
    });
  };

  const formatMonth = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const isCurrentMonth = (day) => {
    return day.getMonth() === currentDate.getMonth();
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

  const statusColors = {
    Pending: "secondary",
    Assignment: "info",
    Progressing: "warning",
    Completed: "success",
    Cancel: "danger",
  };

  const getIcon = (taskName) => {
    if (taskName.toLowerCase().includes("document"))
      return <FileText size={24} />;
    if (
      taskName.toLowerCase().includes("api") ||
      taskName.toLowerCase().includes("develop")
    )
      return <Code size={24} />;
    if (taskName.toLowerCase().includes("test"))
      return <CheckCircle size={24} />;
    if (taskName.toLowerCase().includes("migra")) return <XCircle size={24} />;
    return <FileText size={24} />;
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.taskName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedTasks = filteredTasks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalItems = filteredTasks.length;

  useEffect(() => {
    const loadTasks = async () => {
      if (!id) {
        toast.error("Missing account ID in URL.", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        const data = await TaskService.getAllTaskByAccountId(id);
        setTasks(data);
        toast.success("Tasks loaded successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error("No tasks found for this account.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else if (error.response && error.response.status === 401) {
          toast.error("Unauthorized. Please log in again.", {
            position: "top-right",
            autoClose: 3000,
          });
          navigate("/login");
        } else {
          toast.error("Failed to load tasks.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [id, navigate]);

  useEffect(() => {
    if (selectedTask?.accountId) {
      const fetchAccountName = async () => {
        setIsLoadingAccount(true);
        try {
          const accountData = await TaskService.getProfileById(
            selectedTask.accountId
          );
          setAccountName(accountData.name || "N/A");
        } catch (error) {
          console.error("Error fetching account name:", error.message);
          setAccountName("N/A");
          toast.error("Failed to load account name.", {
            position: "top-right",
            autoClose: 3000,
          });
        } finally {
          setIsLoadingAccount(false);
        }
      };
      fetchAccountName();
    } else {
      setAccountName(null);
    }
  }, [selectedTask?.accountId]);

  const handleTaskClick = async (task) => {
    setIsLoading(true);
    try {
      const taskData = await TaskService.getTaskById(task.taskId);
      setSelectedTask(taskData);
      setSelectedStatus(taskData.status); // Set initial status
    } catch (error) {
      console.error("Error fetching task details:", error.message);
      toast.error(error.message || "Failed to load task details.", {
        position: "top-right",
        autoClose: 3000,
      });
      setSelectedTask(task);
      setSelectedStatus(task.status); // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseTaskDetail = () => {
    setSelectedTask(null);
    setAccountName(null);
    setSelectedStatus(null);
  };

  const handleUpdateStatus = async () => {
    if (
      !selectedTask ||
      !selectedStatus ||
      selectedStatus === selectedTask.status
    ) {
      toast.warn("Please select a different status.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      await TaskService.updateTaskStatus(
        selectedTask.taskId,
        selectedStatus,
        id
      );
      toast.success("Task status updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });

      // Update the task in the tasks list
      const updatedTasks = tasks.map((task) =>
        task.taskId === selectedTask.taskId
          ? { ...task, status: selectedStatus }
          : task
      );
      setTasks(updatedTasks);
      // Fetch the updated task data
      const updatedTaskData = await TaskService.getTaskById(
        selectedTask.taskId
      );
      setSelectedTask(updatedTaskData);
      setSelectedStatus(updatedTaskData.status);
    } catch (error) {
      console.error("Error updating task status:", error.message);
      toast.error(error.message || "Failed to update task status.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="my-task bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-my-task">
          <span>My Task</span>
        </h1>

        <div className="filter-section bg-white p-4 rounded shadow mb-5">
          <Row className="align-items-center g-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </Col>
            <Col md={6} className="d-flex gap-3">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                {validStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </div>

        <Tabs
          activeKey={view}
          onChange={(key) => setView(key)}
          className="tabs"
        >
          <TabPane tab="List View" key="list">
            {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <Row className="g-4">
                  {paginatedTasks.length === 0 ? (
                    <Col>
                      <p className="text-center">No tasks available.</p>
                    </Col>
                  ) : (
                    paginatedTasks.map((task) => (
                      <Col key={task.taskId} xs={12}>
                        <Card
                          className="task-card shadow"
                          onClick={() => handleTaskClick(task)}
                        >
                          <Card.Body>
                            <div className="d-flex flex-column flex-md-row gap-4">
                              <div className="flex-grow-1">
                                <div className="d-flex gap-3">
                                  <div className="icon-circle">
                                    {getIcon(task.taskName)}
                                  </div>
                                  <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start">
                                      <h1 className="task-title mb-0">
                                        {task.taskName || "N/A"} &nbsp;
                                        <Badge
                                          bg={
                                            statusColors[task.status] ||
                                            "secondary"
                                          }
                                        >
                                          {task.status || "Unknown"}
                                        </Badge>
                                      </h1>
                                    </div>

                                    <div className="fs-6">
                                      <strong>Description: </strong>
                                      {task.description || "N/A"}
                                    </div>
                                    <div className="fs-6">
                                      <strong>Location: </strong>
                                      {task.location || "N/A"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="text-md-end">
                                <div className="d-flex gap-3 align-items-start justify-content-md-end flex-column flex-md-row">
                                  <div>
                                    <div className="fs-6">
                                      <strong> Date:</strong>{" "}
                                      {parseDateTime(task.startDate).date} To{" "}
                                      {parseDateTime(task.endDate).date}
                                    </div>
                                    <div className="fs-6">
                                      <strong> Time: </strong>
                                      {
                                        parseDateTime(task.startDate).time
                                      } To {parseDateTime(task.endDate).time}
                                    </div>
                                    <div className="fs-6">
                                      <strong> Created:</strong>{" "}
                                      {formatDate(task.createDate) || "N/A"}
                                    </div>
                                  </div>
                                  <h5>
                                    <Badge
                                      bg={task.isActive ? "success" : "danger"}
                                      className="mt-2 mt-md-0"
                                    >
                                      {task.isActive ? "Yes" : "No"}
                                    </Badge>
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  )}
                </Row>
                {totalItems > 0 && (
                  <Row className="mt-5 align-items-center">
                    <Col xs={12} sm={6} className="mb-3 mb-sm-0">
                      <p className="mb-0">
                        Showing <strong>{(page - 1) * itemsPerPage + 1}</strong>{" "}
                        to{" "}
                        <strong>
                          {Math.min(page * itemsPerPage, totalItems)}
                        </strong>{" "}
                        of <strong>{totalItems}</strong> results
                      </p>
                    </Col>
                    <Col xs={12} sm={6} className="d-flex justify-content-end">
                      <Pagination
                        current={page}
                        pageSize={itemsPerPage}
                        total={totalItems}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                      />
                    </Col>
                  </Row>
                )}
              </>
            )}
          </TabPane>
          <TabPane tab="Calendar View" key="calendar">
            {isLoading ? (
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <div className="calendar-container">
                <div className="calendar-header">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={prevMonth}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <h4>{formatMonth(currentDate)}</h4>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={nextMonth}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="calendar-grid">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div key={day} className="calendar-day-header">
                        {day}
                      </div>
                    )
                  )}
                  {calendarDays.map((day, index) => {
                    const dayTasks = getTasksForDay(day);
                    return (
                      <div
                        key={index}
                        className={`calendar-day ${
                          isCurrentMonth(day) ? "current-month" : "other-month"
                        } ${isToday(day) ? "today" : ""} ${
                          dayTasks.length > 0 ? "has-tasks" : ""
                        }`}
                      >
                        <div className="day-number">
                          <span className={isToday(day) ? "today-number" : ""}>
                            {day.getDate()}
                          </span>
                        </div>
                        <div className="tasks">
                          {dayTasks.map((task) => (
                            <div
                              key={task.taskId}
                              onClick={() => handleTaskClick(task)}
                              className="task"
                              style={{ backgroundColor: task.color }}
                            >
                              <span className="fs-6">
                                Name Char: {task.taskName}{" "}
                              </span>{" "}
                              <br />
                              <span>
                                {" "}
                                Time: {parseDateTime(task.startDate).time}{" "}
                              </span>{" "}
                              To
                              <span> {parseDateTime(task.endDate).time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabPane>
        </Tabs>

        {selectedTask && (
          <Modal show={!!selectedTask} onHide={handleCloseTaskDetail} centered>
            <Modal.Header closeButton className="modal-header">
              <Modal.Title>{selectedTask.taskName}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
              <div className="Acc-task d-flex align-items-center">
                <div className="detail-item">
                  <Tag size={20} className="icon" />
                  <div>
                    <strong>Task Name</strong>
                    <p>{selectedTask.taskName || "N/A"}</p>
                  </div>
                </div>{" "}
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
                <div className="detail-item">
                  <User size={20} className="icon" />
                  <div>
                    <strong>Cosplayer Name</strong>
                    <p>{isLoadingAccount ? "Loading..." : accountName}</p>
                  </div>
                </div>
              </div>

              <div className="detail-item">
                <div className="date-time d-flex align-items-center">
                  <div className="mt-2">
                    <Calendar size={20} className="icon" />
                    <p>
                      <strong> Date:</strong> <br />
                      {parseDateTime(selectedTask.startDate).date}
                    </p>
                  </div>{" "}
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
                  <div className="mt-2">
                    <Clock size={20} className="icon" />
                    <p>
                      <strong>Time: </strong> <br />
                      {parseDateTime(selectedTask.startDate).time}{" "}
                      <strong>To</strong>{" "}
                      {parseDateTime(selectedTask.endDate).time}
                    </p>
                  </div>
                </div>
              </div>
              <div className="loc-des d-block align-items-center">
                <div className="detail-item">
                  <MapPin size={20} className="icon" />
                  <div>
                    <strong>Location</strong>
                    <p>{selectedTask.location || "N/A"}</p>
                  </div>
                </div>{" "}
                <div className="detail-item">
                  <FileText size={20} className="icon" />
                  <div>
                    <strong>Description</strong>
                    <p>{selectedTask.description || "N/A"}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Tag size={20} className="icon" />
                  <div>
                    <strong> Status </strong>
                    <p>{selectedTask.status || "N/A"}</p>
                  </div>
                </div>
              </div>

              <hr className="divider" />
              <div className="d-flex  align-items-center detail-grid">
                <div className="detail-item">
                  <Clock size={20} className="icon" />
                  <div>
                    <strong>Created</strong>
                    <p>{formatDate(selectedTask.createDate)}</p>
                  </div>
                </div>{" "}
                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
                &nbsp; &nbsp; &nbsp;&nbsp;
                <div className="detail-item">
                  <Clock size={20} className="icon" />
                  <div>
                    <strong>Updated</strong>
                    <p>{formatDate(selectedTask.updateDate)}</p>
                  </div>
                </div>
              </div>
              <hr className="divider" />
              <div className="mt-4">
                <Form.Group controlId="taskStatus">
                  <Form.Label>
                    <strong>Update Status</strong>
                  </Form.Label>
                  <Form.Select
                    value={selectedStatus || ""}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={selectedTask?.status === "Completed" || isLoading}
                  >
                    <option value="">Select a status</option>
                    {getAllowedStatuses(selectedTask?.status).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Button
                  variant="primary"
                  className="mt-2"
                  onClick={handleUpdateStatus}
                  disabled={
                    !selectedStatus ||
                    selectedStatus === selectedTask?.status ||
                    isLoading ||
                    selectedTask?.status === "Completed"
                  }
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{" "}
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseTaskDetail}>
                Close
              </Button>
              {/* <Button
                variant="primary"
                className="edit-button"
                disabled={isLoading || selectedTask.status === "Completed"}
              >
                Edit Task
              </Button> */}
            </Modal.Footer>
          </Modal>
        )}
      </Container>
      <RequestCharacter />
    </div>
  );
};

export default MyTask;
