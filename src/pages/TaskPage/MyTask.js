import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Badge,
  Spinner,
} from "react-bootstrap";
import { Pagination } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyTask.scss";
import { useParams, useNavigate } from "react-router-dom";
import TaskService from "../../services/TaskService/TaskService";
import { FileText, Code, CheckCircle, XCircle } from "lucide-react";

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const itemsPerPage = 5;

  const { id } = useParams();
  const navigate = useNavigate();

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
          toast.error(`Failed to load tasks: ${error.message}`, {
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Logic cho TaskCard
  const statusColors = {
    Progressing: "warning",
    Active: "primary",
    Done: "success",
    Cancel: "secondary",
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

  return (
    <div className="my-task bg-light min-vh-100">
      <Container className="py-5">
        <h1 className="text-center mb-5 fw-bold title-my-task">
          <span>My Task</span>
        </h1>

        {/* Filters and Search */}
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
                <option>Progressing</option>
                <option>Active</option>
                <option>Done</option>
                <option>Cancel</option>
              </Form.Select>
            </Col>
          </Row>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : filteredTasks.length === 0 ? (
          <p className="text-center">No tasks available.</p>
        ) : (
          <Row className="g-4">
            {paginatedTasks.map((task) => (
              <Col key={task.taskId} xs={12}>
                <Card className="task-card shadow">
                  <Card.Body>
                    <div className="d-flex flex-column flex-md-row gap-4">
                      {/* Task Info */}
                      <div className="flex-grow-1">
                        <div className="d-flex gap-3">
                          <div className="icon-circle">
                            {getIcon(task.taskName)}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <h3 className="task-title mb-0">
                                {task.taskName || "N/A"}
                              </h3>
                              <Badge
                                bg={statusColors[task.status] || "secondary"}
                              >
                                {task.status || "Unknown"}
                              </Badge>
                            </div>
                            <div className="text-muted small">
                              {task.location || "N/A"}
                            </div>
                            <p className="description mt-2 mb-0">
                              {task.description || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dates and Status */}
                      <div className="text-md-end">
                        <div className="d-flex gap-3 align-items-center justify-content-md-end">
                          <span className="text-muted small">
                            {task.startDate || "N/A"} to {task.endDate || "N/A"}
                          </span>
                          <Badge bg={task.isActive ? "success" : "danger"}>
                            {task.isActive ? "Yes" : "No"}
                          </Badge>
                        </div>
                        <div className="mt-2 text-muted small">
                          <div>Created: {task.createDate || "N/A"}</div>
                          <div>Updated: {task.updateDate || "N/A"}</div>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Pagination */}
        {filteredTasks.length > 0 && (
          <Row className="mt-5 align-items-center">
            <Col xs={12} sm={6} className="mb-3 mb-sm-0">
              <p className="mb-0">
                Showing <strong>{(page - 1) * itemsPerPage + 1}</strong> to{" "}
                <strong>{Math.min(page * itemsPerPage, totalItems)}</strong> of{" "}
                <strong>{totalItems}</strong> results
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
      </Container>
    </div>
  );
};

export default MyTask;
