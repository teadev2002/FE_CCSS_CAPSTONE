import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Row, Col, Card as BootstrapCard } from "react-bootstrap";
import {
  Card,
  Table,
  Badge,
  Spin,
  Button,
  Switch,
  Steps,
  Popover,
  Pagination,
} from "antd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import "../../../styles/MyEventOrganize.scss";
import MyEventOrganizeService from "../../../services/MyEventOrganizeService/MyEventOrganizeService";
import {
  FileText,
  Calendar,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import dayjs from "dayjs";
import _ from "lodash"; // For debouncing

const STATUS_CONFIG = {
  Pending: { color: "primary", text: "Pending" },
  Browsed: { color: "success", text: "Browsed" },
  Active: { color: "warning", text: "Active" },
  Completed: { color: "success", text: "Completed" },
};

const TASK_STATUS = {
  Pending: "Pending",
  Progressing: "Progressing",
  Completed: "Completed",
  Cancel: "Cancel",
};

const formatDate = (date) => {
  if (!date || date === "null" || date === "undefined" || date === "") {
    return "N/A";
  }
  const formats = ["HH:mm DD/MM/YYYY", "YYYY-MM-DD", "DD/MM/YYYY"];
  const parsedDate = dayjs(date, formats, true);
  return parsedDate.isValid()
    ? parsedDate.format("DD/MM/YYYY")
    : "Invalid Date";
};

const getStatusBadge = (status) => {
  const config = STATUS_CONFIG[status] || {
    color: "secondary",
    text: "Unknown",
  };
  return <Badge color={config.color} text={config.text} />;
};

const ViewManageEventOrganize = ({ requestId }) => {
  const [requestData, setRequestData] = useState(null);
  const [packageData, setPackageData] = useState(null);
  const [cosplayerDetails, setCosplayerDetails] = useState({});
  const [characterPrices, setCharacterPrices] = useState({});
  const [contractData, setContractData] = useState(null);
  const [cosplayerTasks, setCosplayerTasks] = useState({});
  const [cosplayerToggles, setCosplayerToggles] = useState({});
  const [taskLoading, setTaskLoading] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCharacters, setExpandedCharacters] = useState({});
  const [expandedDates, setExpandedDates] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const pageSize = 3; // Number of characters per page

  // Memoize formatted data
  const formattedData = useMemo(() => {
    if (!requestData) return null;
    return {
      ...requestData,
      startDate: formatDate(requestData.startDate),
      endDate: formatDate(requestData.endDate),
      range: requestData.range || "N/A", // Add range field
      charactersListResponse: (requestData.charactersListResponse || []).map(
        (char) => ({
          ...char,
          requestDateResponses: char.requestDateResponses || [],
        })
      ),
    };
  }, [requestData]);

  // Calculate paginated characters
  const paginatedCharacters = useMemo(() => {
    if (!formattedData?.charactersListResponse) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return formattedData.charactersListResponse.slice(startIndex, endIndex);
  }, [formattedData, currentPage, pageSize]);

  // Calculate total hours from requestDateResponses
  const calculateTotalHours = (requestDateResponses) => {
    if (!requestDateResponses || !Array.isArray(requestDateResponses)) return 0;
    return requestDateResponses.reduce((total, date) => {
      const hours = parseFloat(date.totalHour) || 0;
      return total + hours;
    }, 0);
  };

  // Fetch tasks for a cosplayer
  const fetchTasksForCosplayer = async (cosplayerId, contractId) => {
    setTaskLoading((prev) => ({ ...prev, [cosplayerId]: true }));
    try {
      const tasks = await MyEventOrganizeService.getTaskByCosplayerIdInContract(
        cosplayerId
      );
      const matchingTasks = (tasks || []).filter(
        (task) => task.contractId === contractId
      );
      const sortedTasks = matchingTasks.sort((a, b) =>
        dayjs(a.startDate, "HH:mm DD/MM/YYYY").diff(
          dayjs(b.startDate, "HH:mm DD/MM/YYYY")
        )
      );
      setCosplayerTasks((prev) => ({ ...prev, [cosplayerId]: sortedTasks }));
      return sortedTasks;
    } catch (error) {
      toast.error("Failed to load tasks");
      return [];
    } finally {
      setTaskLoading((prev) => ({ ...prev, [cosplayerId]: false }));
    }
  };

  // Handle toggle for task progression
  const handleToggleStatusProgression = async (
    cosplayerId,
    contractId,
    checked
  ) => {
    setCosplayerToggles((prev) => ({ ...prev, [cosplayerId]: checked }));
    if (checked && !cosplayerTasks[cosplayerId]) {
      await fetchTasksForCosplayer(cosplayerId, contractId);
    }
  };

  // Memoize task status progression logic
  const getStatusProgression = useMemo(
    () => (cosplayerId, contractId) => {
      const tasks = cosplayerTasks[cosplayerId] || [];
      const today = dayjs();
      const contractTasks = tasks.filter(
        (task) => task.contractId === contractId
      );

      if (contractTasks.length === 0) {
        return {
          currentStatusIndex: -1,
          isCancelled: false,
          filteredStepsItems: [],
          dailyProgress: [],
        };
      }

      const dailyProgress = contractTasks.map((task) => {
        const formats = ["HH:mm DD/MM/YYYY", "YYYY-MM-DD HH:mm", "YYYY-MM-DD"];
        const startDate = dayjs(task.startDate, formats, true);
        const endDate = dayjs(task.endDate, formats, true);
        const day = startDate.startOf("day");

        let status = task.status;
        if (task.status === TASK_STATUS.Cancel) {
          status = TASK_STATUS.Cancel;
        } else if (day.isBefore(today, "day")) {
          status = TASK_STATUS.Completed;
        } else if (day.isSame(today, "day")) {
          status = TASK_STATUS.Progressing;
        } else {
          status = TASK_STATUS.Pending;
        }

        return {
          date: day.format("DD/MM/YYYY"),
          status,
          details: `(${startDate.format("HH:mm")} - ${endDate.format(
            "HH:mm"
          )})`,
        };
      });

      const stepsItems = dailyProgress.map((day, index) => ({
        title: `Day ${index + 1} (${day.date})`,
        description: day.details,
        status:
          day.status === TASK_STATUS.Completed
            ? "finish"
            : day.status === TASK_STATUS.Progressing
            ? "process"
            : day.status === TASK_STATUS.Cancel
            ? "error"
            : "wait",
      }));

      const currentStatusIndex = dailyProgress.findIndex(
        (day) => day.status === TASK_STATUS.Progressing
      );
      const isCancelled = dailyProgress.some(
        (day) => day.status === TASK_STATUS.Cancel
      );

      return {
        currentStatusIndex:
          currentStatusIndex >= 0
            ? currentStatusIndex
            : dailyProgress.length - 1,
        isCancelled,
        filteredStepsItems: isCancelled
          ? stepsItems
          : stepsItems.filter((item) => item.status !== "error"),
        dailyProgress,
      };
    },
    [cosplayerTasks]
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!requestId) {
        toast.error("Invalid request ID");
        return;
      }
      setLoading(true);
      try {
        // Fetch request data
        const data = await MyEventOrganizeService.getRequestByRequestId(
          requestId
        );
        setRequestData(data);

        // Fetch cosplayer details
        const cosplayerPromises = (data.charactersListResponse || [])
          .filter(
            (char) => char.cosplayerId !== null && char.cosplayerId !== ""
          )
          .map(async (char) => {
            try {
              const cosplayerData =
                await MyEventOrganizeService.getNameCosplayerInRequestByCosplayerId(
                  char.cosplayerId
                );
              return {
                cosplayerId: char.cosplayerId,
                name: cosplayerData.name || "Unknown",
                salaryIndex: cosplayerData.salaryIndex || 0,
                averageStar: cosplayerData.averageStar || 0,
                height: cosplayerData.height || 0,
                weight: cosplayerData.weight || 0,
              };
            } catch (error) {
              console.error(
                `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
                error
              );
              return {
                cosplayerId: char.cosplayerId,
                name: "Unknown",
                salaryIndex: 0,
                averageStar: 0,
                height: 0,
                weight: 0,
              };
            }
          });

        // Fetch character prices
        const characterPricePromises = (data.charactersListResponse || [])
          .filter((char) => char.characterId)
          .map(async (char) => {
            try {
              const characterData =
                await MyEventOrganizeService.getCharacterById(char.characterId);
              return {
                requestCharacterId: char.requestCharacterId,
                price: characterData.price || 0,
              };
            } catch (error) {
              console.error(
                `Failed to fetch price for character ID ${char.characterId}:`,
                error
              );
              return {
                requestCharacterId: char.requestCharacterId,
                price: 0,
              };
            }
          });

        const [cosplayerResults, characterPriceResults] = await Promise.all([
          Promise.all(cosplayerPromises),
          Promise.all(characterPricePromises),
        ]);

        setCosplayerDetails(
          cosplayerResults.reduce(
            (
              acc,
              { cosplayerId, name, salaryIndex, averageStar, height, weight }
            ) => {
              acc[cosplayerId] = {
                name,
                salaryIndex,
                averageStar,
                height,
                weight,
              };
              return acc;
            },
            {}
          )
        );

        setCharacterPrices(
          characterPriceResults.reduce((acc, { requestCharacterId, price }) => {
            acc[requestCharacterId] = price;
            return acc;
          }, {})
        );

        // Fetch package data
        if (
          data.packageId &&
          typeof data.packageId === "string" &&
          data.packageId.trim() !== ""
        ) {
          try {
            const packageDetails = await MyEventOrganizeService.getPackageById(
              data.packageId
            );
            setPackageData(packageDetails);
          } catch (packageError) {
            console.error("Failed to fetch package details:", packageError);
            toast.error("Failed to fetch package details");
            setPackageData(null);
          }
        } else {
          console.warn("No valid packageId provided");
          setPackageData(null);
        }

        // Fetch contract data
        if (data.accountId) {
          try {
            const contracts =
              await MyEventOrganizeService.getAllContractByAccountId(
                data.accountId
              );
            const matchingContract = contracts.find(
              (c) => c.requestId === requestId
            );
            if (matchingContract?.contractId) {
              const contractDetails =
                await MyEventOrganizeService.getContractByContractId(
                  matchingContract.contractId
                );
              setContractData(contractDetails);
            } else {
              setContractData(null);
            }
          } catch (error) {
            console.error("Failed to fetch contract:", error);
            setContractData(null);
          }
        }
      } catch (error) {
        setError(error.message || "Failed to fetch request details");
        toast.error(error.message || "Failed to fetch request details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [requestId]);

  // Debounced toggle functions
  const toggleCharacter = useCallback(
    _.debounce((requestCharacterId) => {
      setExpandedCharacters((prev) => ({
        ...prev,
        [requestCharacterId]: !prev[requestCharacterId],
      }));
    }, 300),
    []
  );

  const toggleDates = useCallback(
    _.debounce((requestCharacterId) => {
      setExpandedDates((prev) => ({
        ...prev,
        [requestCharacterId]: !prev[requestCharacterId],
      }));
    }, 300),
    []
  );

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Memoize dateColumns
  const dateColumns = useMemo(
    () => [
      {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        render: (date) => date || "N/A",
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        render: (date) => date || "N/A",
      },
      {
        title: "Total Hours",
        dataIndex: "totalHour",
        key: "totalHour",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) =>
          status === 0 ? "Pending" : status === 1 ? "Confirmed" : "Unknown",
      },
    ],
    []
  );

  if (loading) {
    return <Spin size="large" />;
  }

  if (error || !formattedData) {
    return <p className="text-danger">{error || "No data available"}</p>;
  }

  return (
    <div className="view-my-event-organize" style={{ overflowX: "hidden" }}>
      <h2 className="mb-4 fw-bold">Event Details: {formattedData.name}</h2>

      {/* Summary Section */}
      <BootstrapCard className="shadow mb-4">
        <BootstrapCard.Body>
          <Row className="g-4">
            <Col xs={12}>
              <div className="d-flex align-items-center gap-3">
                <FileText size={24} />
                <h3 className="mb-0">{formattedData.name}</h3>
                <h3
                  className={` mt-2 ${
                    formattedData.status === "Browsed"
                      ? "text-success"
                      : formattedData.status === "Pending"
                      ? "text-dark"
                      : "text-danger"
                  }`}
                >
                  <strong>{formattedData.status}</strong>
                </h3>
              </div>
            </Col>
            <Col md={6}>
              <p className="mb-2">
                <strong>Description:</strong>{" "}
                {formattedData.description || "N/A"}
              </p>
              <p className="mb-2">
                <strong>Total Price:</strong>{" "}
                {(formattedData.price || 0).toLocaleString()} VND
              </p>
              <p className="mb-2">
                <strong>Location:</strong> {formattedData.location || "N/A"}
              </p>
              <p className="mb-2">
                <strong>Package:</strong>{" "}
                {packageData
                  ? `${
                      packageData.packageName
                    } (${packageData.price.toLocaleString()} VND)`
                  : "N/A"}
              </p>
              {/* Add range field display - shows the price range from the API response */}
              <p className="mb-2">
                <strong>Unit Hire Price Range Cosplayer:</strong>{" "}
                {formattedData.range ? `${formattedData.range} VND` : "N/A"}
              </p>
              {formattedData.status === "Cancel" && (
                <p
                  className="mb-2"
                  style={{
                    color:
                      formattedData.status === "Cancel" ? "red" : "inherit",
                  }}
                >
                  <strong>Request Status:</strong>{" "}
                  <span>
                    {formattedData.status || "N/A"}
                    {formattedData.status === "Cancel" && formattedData.reason
                      ? ` (${formattedData.reason})`
                      : ""}
                  </span>
                </p>
              )}
            </Col>
            <Col md={6}>
              <p className="mb-2">
                <Calendar size={16} className="me-1" />
                <strong>Start Date:</strong> {formattedData.startDate}
              </p>
              <p className="mb-2">
                <Calendar size={16} className="me-1" />
                <strong>End Date:</strong> {formattedData.endDate}
              </p>
              <p className="mb-2">
                <strong>Total Days:</strong> {formattedData.totalDate || "N/A"}
              </p>
              <p className="mb-2">
                <strong>Deposit:</strong>{" "}
                {formattedData.deposit
                  ? `${formattedData.deposit}%`
                  : "You need to choose deposit"}
              </p>
            </Col>
          </Row>
        </BootstrapCard.Body>
      </BootstrapCard>

      {/* Characters Section */}
      <h3 className="mb-3">Requested Characters</h3>
      {formattedData.charactersListResponse.length > 0 ? (
        <>
          <Row className="g-4">
            {paginatedCharacters.map((character) => {
              const showToggle =
                contractData &&
                character.cosplayerId &&
                character.cosplayerId !== "Not Assign";
              const {
                currentStatusIndex,
                isCancelled,
                filteredStepsItems,
                dailyProgress,
              } = showToggle
                ? getStatusProgression(
                    character.cosplayerId,
                    contractData?.contractId
                  )
                : {
                    currentStatusIndex: -1,
                    isCancelled: false,
                    filteredStepsItems: [],
                    dailyProgress: [],
                  };

              const customDot = (dot, { status, index }) => (
                <Popover
                  content={
                    <span>
                      Day {index + 1} status: {status} <br />
                      Details:{" "}
                      {dailyProgress[index]?.details || "No details available"}
                    </span>
                  }
                >
                  {dot}
                </Popover>
              );

              // Calculate cosplayer hiring cost
              const cosplayerInfo = cosplayerDetails[character.cosplayerId] || {
                name: "Loading...",
                salaryIndex: 0,
                averageStar: 0,
                height: 0,
                weight: 0,
              };
              const totalHours = calculateTotalHours(
                character.requestDateResponses
              );
              const cosplayerCost = cosplayerInfo.salaryIndex * totalHours;

              return (
                <Col xs={12} key={character.requestCharacterId}>
                  <Card
                    className="shadow"
                    title={
                      <div
                        className="d-flex align-items-center gap-2"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          toggleCharacter(character.requestCharacterId)
                        }
                        aria-expanded={
                          expandedCharacters[character.requestCharacterId]
                        }
                        aria-controls={`character-${character.requestCharacterId}`}
                      >
                        {expandedCharacters[character.requestCharacterId] ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                        <span>
                          Character Name: {character.characterName} (Quantity:{" "}
                          {character.quantity})
                        </span>
                      </div>
                    }
                  >
                    {expandedCharacters[character.requestCharacterId] && (
                      <div
                        id={`character-${character.requestCharacterId}`}
                        className="p-3"
                        style={{ overflowX: "hidden" }}
                      >
                        <Row className="g-3">
                          <Col md={6}>
                            <p className="mb-2">
                              <strong>Cosplayer:</strong>{" "}
                              {character.cosplayerId ? (
                                <Popover
                                  content={
                                    cosplayerInfo.name === "Loading..." ? (
                                      <p>Đang tải thông tin cosplayer...</p>
                                    ) : (
                                      <div>
                                        <p>
                                          <strong>Name:</strong>{" "}
                                          {cosplayerInfo.name}
                                        </p>
                                        <p>
                                          <strong>Average Star:</strong>{" "}
                                          {cosplayerInfo.averageStar.toFixed(1)}
                                        </p>
                                        <p>
                                          <strong>Salary Index:</strong>{" "}
                                          {cosplayerInfo.salaryIndex.toLocaleString()}{" "}
                                          VND/h
                                        </p>
                                        <p>
                                          <strong>Height & Weight:</strong>{" "}
                                          {cosplayerInfo.height}cm -{" "}
                                          {cosplayerInfo.weight} kg
                                        </p>
                                        <a
                                          target="_blank"
                                          href={`/user-profile/${character.cosplayerId}`}
                                          rel="noopener noreferrer"
                                        >
                                          See Profile
                                        </a>
                                      </div>
                                    )
                                  }
                                  trigger="hover" // Use click to support interaction with links
                                >
                                  <span
                                    style={{
                                      cursor: "pointer",
                                      color: "black",
                                      textDecoration: "none",
                                    }}
                                    aria-label={`Xem thông tin chi tiết của ${cosplayerInfo.name}`}
                                  >
                                    {cosplayerInfo.name}
                                  </span>
                                </Popover>
                              ) : (
                                "Not Assign"
                              )}
                            </p>
                            {character.cosplayerId && (
                              <p className="mb-2">
                                <strong>
                                  Cosplayer Hiring Cost x TotalHours:
                                </strong>{" "}
                                {cosplayerInfo.name === "Loading..."
                                  ? "Loading..."
                                  : cosplayerCost > 0
                                  ? `${cosplayerCost.toLocaleString()} VND`
                                  : "N/A"}
                              </p>
                            )}
                            <p className="mb-2">
                              <strong>Unit Price character:</strong>{" "}
                              {characterPrices[character.requestCharacterId]
                                ? `${characterPrices[
                                    character.requestCharacterId
                                  ].toLocaleString()} VND/day`
                                : "N/A"}
                            </p>
                            <p className="mb-2">
                              <strong>Description:</strong>{" "}
                              {character.description || "N/A"}
                            </p>
                            <p className="mb-2">
                              <strong>Status:</strong>{" "}
                              {character.status || "N/A"}
                            </p>
                            <p className="mb-2">
                              <strong>Height Range:</strong>{" "}
                              {character.minHeight}-{character.maxHeight} cm
                            </p>
                            <p className="mb-2">
                              <strong>Weight Range:</strong>{" "}
                              {character.minWeight}-{character.maxWeight} kg
                            </p>
                          </Col>
                          <Col md={6}>
                            {character.characterImages?.length > 0 && (
                              <img
                                src={character.characterImages[0].urlImage}
                                alt={`Character ${character.characterName}`}
                                style={{
                                  maxWidth: "100%",
                                  height: "auto",
                                  borderRadius: "8px",
                                }}
                              />
                            )}
                          </Col>
                        </Row>

                        <div className="mt-3">
                          <Button
                            type="link"
                            onClick={() =>
                              toggleDates(character.requestCharacterId)
                            }
                            aria-expanded={
                              expandedDates[character.requestCharacterId]
                            }
                            aria-controls={`dates-${character.requestCharacterId}`}
                            aria-label={`Toggle time slots for ${character.characterName}`}
                          >
                            {expandedDates[character.requestCharacterId] ? (
                              <>
                                <ChevronUp size={16} /> Hide Time Slots
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} /> Show Time Slots
                              </>
                            )}
                          </Button>
                          {expandedDates[character.requestCharacterId] && (
                            <Table
                              id={`dates-${character.requestCharacterId}`}
                              columns={dateColumns}
                              dataSource={character.requestDateResponses}
                              rowKey="requestDateId"
                              pagination={false}
                              size="small"
                              className="mt-2"
                              scroll={{ x: "max-content" }}
                            />
                          )}
                        </div>

                        {showToggle && (
                          <div className="mt-3">
                            <Switch
                              checked={
                                cosplayerToggles[character.cosplayerId] || false
                              }
                              onChange={(checked) =>
                                handleToggleStatusProgression(
                                  character.cosplayerId,
                                  contractData.contractId,
                                  checked
                                )
                              }
                              checkedChildren="Hide Task Progression"
                              unCheckedChildren="Show Task Progression"
                            />
                          </div>
                        )}

                        {showToggle &&
                          cosplayerToggles[character.cosplayerId] && (
                            <div className="mt-3">
                              <h5>
                                Task Status Progression for {cosplayerInfo.name}
                              </h5>
                              {taskLoading[character.cosplayerId] ? (
                                <Spin />
                              ) : cosplayerTasks[character.cosplayerId]
                                  ?.length > 0 ? (
                                <Steps
                                  current={currentStatusIndex}
                                  progressDot={customDot}
                                  items={filteredStepsItems}
                                  style={{ marginBottom: "20px" }}
                                />
                              ) : (
                                <p>No tasks found for this cosplayer.</p>
                              )}
                            </div>
                          )}
                      </div>
                    )}
                  </Card>
                </Col>
              );
            })}
          </Row>
          {formattedData.charactersListResponse.length > pageSize && (
            <div className="mt-4 d-flex justify-content-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={formattedData.charactersListResponse.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                aria-label="Phân trang danh sách nhân vật"
              />
            </div>
          )}
        </>
      ) : (
        <p>Không có nhân vật nào được yêu cầu.</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default ViewManageEventOrganize;
