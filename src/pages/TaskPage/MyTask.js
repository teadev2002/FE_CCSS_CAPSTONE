import React, { useState, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";
import { Pagination } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../styles/MyTask.scss";
import { useParams, useNavigate } from "react-router-dom";
import TaskService from "../../services/TaskService/TaskService";

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ field: null, order: "asc" });
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

  const sortTasks = (field) => {
    const order = sort.field === field && sort.order === "asc" ? "desc" : "asc";
    setSort({ field, order });

    const sortedTasks = [...tasks].sort((a, b) => {
      if (
        field === "startDate" ||
        field === "endDate" ||
        field === "createDate" ||
        field === "updateDate"
      ) {
        const dateA = new Date(
          a[field].replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
        );
        const dateB = new Date(
          b[field].replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
        );
        return order === "asc" ? dateA - dateB : dateB - dateA;
      }
      return order === "asc"
        ? (a[field] || "").localeCompare(b[field] || "")
        : (b[field] || "").localeCompare(a[field] || "");
    });

    setTasks(sortedTasks);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const [time, date] = dateStr.split(" ");
      const [hours, minutes] = time.split(":");
      const [day, month, year] = date.split("/");
      const dateObj = new Date(
        `${year}-${month}-${day}T${hours}:${minutes}:00`
      );
      return dateObj.toLocaleDateString("vi-VN");
    } catch {
      return "N/A";
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Progressing: "text-primary",
      Active: "text-success",
      Done: "text-success",
      Cancel: "text-secondary",
    };
    return (
      <span className={statusStyles[status] || "text-secondary"}>
        {status || "Unknown"}
      </span>
    );
  };

  const paginatedTasks = tasks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalItems = tasks.length;

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="my-task container vh-100">
      <h2 className="title-my-task text-center my-4">
        <span>My Task</span>
      </h2>

      <div className="card">
        <div className="card-body">
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-center">No tasks available.</p>
          ) : (
            <>
              <Table hover responsive className="text-center">
                <thead>
                  <tr>
                    <th onClick={() => sortTasks("taskName")}>
                      Task Name{" "}
                      {sort.field === "taskName" &&
                        (sort.order === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => sortTasks("location")}>
                      Location{" "}
                      {sort.field === "location" &&
                        (sort.order === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => sortTasks("description")}>
                      Description{" "}
                      {sort.field === "description" &&
                        (sort.order === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => sortTasks("isActive")}>
                      Active{" "}
                      {sort.field === "isActive" &&
                        (sort.order === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => sortTasks("startDate")}>
                      Start Date{" "}
                      {sort.field === "startDate" &&
                        (sort.order === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => sortTasks("endDate")}>
                      End Date{" "}
                      {sort.field === "endDate" &&
                        (sort.order === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => sortTasks("createDate")}>
                      Create Date{" "}
                      {sort.field === "createDate" &&
                        (sort.order === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => sortTasks("updateDate")}>
                      Update Date{" "}
                      {sort.field === "updateDate" &&
                        (sort.order === "asc" ? "↑" : "↓")}
                    </th>
                    <th onClick={() => sortTasks("status")}>
                      Status{" "}
                      {sort.field === "status" &&
                        (sort.order === "asc" ? "↑" : "↓")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.map((task) => (
                    <tr key={task.taskId}>
                      {" "}
                      {/* Dùng taskId làm key */}
                      <td>{task.taskName || "N/A"}</td>
                      <td>{task.location || "N/A"}</td>
                      <td>{task.description || "N/A"}</td>
                      <td>{task.isActive ? "Yes" : "No"}</td>
                      <td>{task.startDate}</td>
                      <td>{task.endDate}</td>
                      <td>{task.createDate}</td>
                      <td>{task.updateDate}</td>
                      <td>{getStatusBadge(task.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-center mt-3">
                <Pagination
                  current={page}
                  pageSize={itemsPerPage}
                  total={totalItems}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTask;
