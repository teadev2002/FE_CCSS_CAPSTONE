import React from "react";
import { Popover, Steps } from "antd";
import PropTypes from "prop-types";

const TaskStatus = {
  Pending: "Pending",
  Assignment: "Assignment",
  Progressing: "Progressing",
  Completed: "Completed",
  Cancel: "Cancel",
};

const customDot = (dot, { status, index }) => (
  <Popover
    content={
      <span>
        Step {index + 1} status: {status}
      </span>
    }
  >
    {dot}
  </Popover>
);

const ViewTaskCosplayer = ({ task }) => {
  const statusOrder = [
    TaskStatus.Pending,
    TaskStatus.Assignment,
    TaskStatus.Progressing,
    TaskStatus.Completed,
    TaskStatus.Cancel,
  ];

  const currentStatusIndex = statusOrder.indexOf(task.status);
  const isCancelled = task.status === TaskStatus.Cancel;

  const stepsItems = statusOrder.map((status, index) => ({
    title: status,
    description: "Click dot to see status",
    status:
      isCancelled && index === statusOrder.length - 1
        ? "error"
        : index < currentStatusIndex
        ? "finish"
        : index === currentStatusIndex
        ? "process"
        : "wait",
  }));

  // Remove Cancel step if the task is not cancelled
  const filteredStepsItems = isCancelled
    ? stepsItems
    : stepsItems.filter((item) => item.title !== TaskStatus.Cancel);

  return (
    <div className="view-task-cosplayer">
      <h4>Task: {task.taskName}</h4>
      <p>
        <strong>Task ID:</strong> {task.taskId}
      </p>
      <p>
        <strong>Account ID:</strong> {task.accountId}
      </p>
      <p>
        <strong>Location:</strong> {task.location}
      </p>
      <p>
        <strong>Description:</strong> {task.description || "No description"}
      </p>
      <p>
        <strong>Active:</strong> {task.isActive ? "Yes" : "No"}
      </p>
      <p>
        <strong>Start Date:</strong> {task.startDate}
      </p>
      <p>
        <strong>End Date:</strong> {task.endDate}
      </p>
      <p>
        <strong>Create Date:</strong> {task.createDate}
      </p>
      <p>
        <strong>Update Date:</strong> {task.updateDate || "N/A"}
      </p>
      <p>
        <strong>Event ID:</strong> {task.eventId || "N/A"}
      </p>
      <p>
        <strong>Contract ID:</strong> {task.contractId || "N/A"}
      </p>
      <h5>Status Progression</h5>
      <Steps
        current={
          isCancelled ? filteredStepsItems.length - 1 : currentStatusIndex
        }
        progressDot={customDot}
        items={filteredStepsItems}
      />
    </div>
  );
};

ViewTaskCosplayer.propTypes = {
  task: PropTypes.shape({
    taskId: PropTypes.string.isRequired,
    accountId: PropTypes.string.isRequired,
    taskName: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    description: PropTypes.string,
    isActive: PropTypes.bool.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    createDate: PropTypes.string.isRequired,
    updateDate: PropTypes.string,
    status: PropTypes.oneOf([
      TaskStatus.Pending,
      TaskStatus.Assignment,
      TaskStatus.Progressing,
      TaskStatus.Completed,
      TaskStatus.Cancel,
    ]).isRequired,
    eventId: PropTypes.string,
    contractId: PropTypes.string,
  }).isRequired,
};

export default ViewTaskCosplayer;
