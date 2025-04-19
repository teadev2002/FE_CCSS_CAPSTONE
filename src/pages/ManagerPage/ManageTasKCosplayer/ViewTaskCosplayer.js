import React, { useState, useEffect } from "react";
import { Popover, Steps, Collapse } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import TaskCosplayerService from "../../../services/ManageServicePages/ManageTaskCosplayerService/TaskCosplayerService";

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
  const [cosplayerName, setCosplayerName] = useState("Loading...");
  const [contractInfo, setContractInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch cosplayer name and contract info
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch cosplayer name
        const cosplayerData =
          await TaskCosplayerService.getInfoCosplayerByAccountId(
            task.accountId
          );
        setCosplayerName(cosplayerData.name || "Unknown");

        // Fetch contract info if contractId exists
        if (task.contractId) {
          const contractData =
            await TaskCosplayerService.getContractByContractId(task.contractId);
          setContractInfo(contractData);
        } else {
          setContractInfo({ contractName: "Contract not Created yet" });
        }
      } catch (error) {
        setCosplayerName("Unknown");
        setContractInfo({ contractName: "Contract not Created yet" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [task.accountId, task.contractId]);

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
    description: " ",
    status:
      isCancelled && index === statusOrder.length - 1
        ? "error"
        : index < currentStatusIndex
        ? "finish"
        : index === currentStatusIndex
        ? "process"
        : "wait",
  }));

  const filteredStepsItems = isCancelled
    ? stepsItems
    : stepsItems.filter((item) => item.title !== TaskStatus.Cancel);

  // Format contract dates
  const formatContractDate = (date) => {
    if (!date) return "N/A";
    return moment(date, "HH:mm DD/MM/YYYY").format("DD/MM/YYYY");
  };

  const formatCreateDate = (date) => {
    if (!date) return "N/A";
    return moment(date).format("HH:mm DD/MM/YYYY");
  };

  // Collapse items for "See More"
  const collapseItems = [
    {
      key: "1",
      label: "See More Contract Details",
      children: (
        <div>
          {contractInfo?.contractName === "Contract not Created yet" ? (
            <p>{contractInfo.contractName}</p>
          ) : (
            <>
              <p>
                <strong>Contract Name:</strong>{" "}
                {contractInfo?.contractName || "N/A"}
              </p>
              <p>
                <strong>Price:</strong>{" "}
                {contractInfo?.price?.toLocaleString() || "N/A"} VND
              </p>

              <p>
                <strong>Start Date:</strong>{" "}
                {formatContractDate(contractInfo?.startDate)}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {formatContractDate(contractInfo?.endDate)}
              </p>
              <p>
                <strong>Created By:</strong> {contractInfo?.createBy || "N/A"}
              </p>
              <p>
                <strong>Create Date:</strong>{" "}
                {formatCreateDate(contractInfo?.createDate)}
              </p>
              <p>
                <strong>Characters:</strong>
                {contractInfo?.contractCharacters?.length > 0 ? (
                  <ul>
                    {contractInfo.contractCharacters.map((char, index) => (
                      <li key={index}>
                        {char.cosplayerName} as {char.characterName} (Quantity:{" "}
                        {char.quantity})
                      </li>
                    ))}
                  </ul>
                ) : (
                  " None"
                )}
              </p>
              {contractInfo?.urlPdf && (
                <p>
                  <strong>Contract PDF:</strong>{" "}
                  <a
                    href={contractInfo.urlPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                </p>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="view-task-cosplayer">
      <h4>Task: {task.taskName}</h4>

      <h6>
        <strong>Cosplayer Name:</strong>{" "}
        {loading ? "Loading..." : cosplayerName}
      </h6>
      <h5>Status Progression</h5>
      <Steps
        current={
          isCancelled ? filteredStepsItems.length - 1 : currentStatusIndex
        }
        progressDot={customDot}
        items={filteredStepsItems}
      />
      <p style={{ marginTop: "20px" }}>
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
      <Collapse items={collapseItems} style={{ marginTop: "20px" }} />
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
