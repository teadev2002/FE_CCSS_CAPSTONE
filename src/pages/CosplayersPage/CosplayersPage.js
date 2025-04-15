import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  DatePicker,
  TimePicker,
  List,
  Card,
  Row,
  Col,
  Checkbox,
  Pagination,
  Spin,
  Alert,
  Select,
  Rate,
  Radio, // Added Radio for deposit selection
} from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import "../../styles/CosplayersPage.scss";
import HireCosplayerService from "../../services/HireCosplayerService/HireCosplayerService.js";
import { toast } from "react-toastify";

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;
const { Option } = Select;

const DEFAULT_AVATAR_URL =
  "https://pm1.narvii.com/6324/0d7f51553b6ca0785d3912929088c25acc1bc53f_hq.jpg";

const CosplayersPage = () => {
  const [cosplayers, setCosplayers] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [location, setLocation] = useState("");
  const [searchCharacter, setSearchCharacter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCosplayerPage, setCurrentCosplayerPage] = useState(1);
  const [step, setStep] = useState(1);
  const [requests, setRequests] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [filteredCosplayers, setFilteredCosplayers] = useState([]);
  const [selectedCosplayers, setSelectedCosplayers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    description: "",
    listRequestCharacters: [],
    name: "",
  });
  const [accountId, setAccountId] = useState(null);
  const [cosplayerPrices, setCosplayerPrices] = useState({});
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deposit, setDeposit] = useState("50"); // Default deposit value

  const serviceId = "S002";
  const packageId = "";
  const dateFormat = "DD/MM/YYYY";
  const timeFormat = "HH:mm";
  const characterPageSize = 10;
  const cosplayerPageSize = 8;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("You need to log in to use this page.");
      return;
    }

    setIsAuthenticated(true);

    try {
      const decoded = jwtDecode(accessToken);
      const accountName = decoded?.AccountName;
      const id = decoded?.Id;
      if (accountName) {
        setModalData((prev) => ({ ...prev, name: accountName }));
      }
      if (id) {
        setAccountId(id);
      }
    } catch (error) {
      console.error("Invalid token", error);
      setError("Invalid token. Please log in again.");
      return;
    }

    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const charactersData = await HireCosplayerService.getAllCharacters();
        const mappedCharacters = charactersData.map((character) => ({
          id: character.characterId,
          name: character.characterName,
          minHeight: character.minHeight,
          maxHeight: character.maxHeight,
          minWeight: character.minWeight,
          maxWeight: character.maxWeight,
          price: character.price,
        }));
        setCharacters(mappedCharacters);
      } catch (err) {
        setError("Unable to load characters. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const fetchCosplayersByCharacterAndTime = async (characterName) => {
    if (!dateRange || !timeRange || !characterName) {
      setFilteredCosplayers([]);
      return;
    }

    setLoading(true);
    try {
      const startDateTime = `${timeRange[0].format(
        timeFormat
      )} ${dateRange[0].format(dateFormat)}`;
      const endDateTime = `${timeRange[1].format(
        timeFormat
      )} ${dateRange[1].format(dateFormat)}`;

      const cosplayersData =
        await HireCosplayerService.getAccountByCharacterNameNDate(
          characterName,
          startDateTime,
          endDateTime
        );

      const mappedCosplayers = cosplayersData.map((cosplayer) => ({
        id: cosplayer.accountId,
        name: cosplayer.name,
        avatar: cosplayer.images[0]?.urlImage || DEFAULT_AVATAR_URL,
        description: cosplayer.description || "No description",
        height: cosplayer.height,
        weight: cosplayer.weight,
        salaryIndex: cosplayer.salaryIndex,
        averageStar: cosplayer.averageStar || 0,
      }));

      const character = characters.find((char) => char.name === characterName);

      const filtered = mappedCosplayers.filter(
        (cosplayer) =>
          !requests.some((r) =>
            r.cosplayers.some((c) => c.id === cosplayer.id)
          ) &&
          cosplayer.height >= character.minHeight &&
          cosplayer.height <= character.maxHeight &&
          cosplayer.weight >= character.minWeight &&
          cosplayer.weight <= character.maxWeight
      );

      setCosplayers(mappedCosplayers);
      setFilteredCosplayers(filtered);
    } catch (err) {
      setError("Unable to load cosplayers. Please try again later.");
      console.error(err);
      setFilteredCosplayers([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalHours = () => {
    if (!dateRange || !timeRange) return 0;

    const startTime = timeRange[0];
    const endTime = timeRange[1];
    const startDate = dateRange[0];
    const endDate = dateRange[1];

    const hoursPerDay = endTime.diff(startTime, "hour", true);
    const totalDays = endDate.diff(startDate, "day") + 1;
    return hoursPerDay * totalDays;
  };

  const calculateTotalDays = () => {
    if (!dateRange) return 0;

    const startDate = dateRange[0];
    const endDate = dateRange[1];
    return endDate.diff(startDate, "day") + 1;
  };

  const calculateUnitPrice = (cosplayer, characterId) => {
    const character = characters.find((char) => char.id === characterId);
    if (!character || !cosplayer.salaryIndex) return 0;

    const totalHours = calculateTotalHours();
    const totalDays = calculateTotalDays();
    const unitPrice =
      totalHours * cosplayer.salaryIndex + totalDays * character.price;
    return unitPrice;
  };

  useEffect(() => {
    if (sortBy && filteredCosplayers.length > 0) {
      const sortedCosplayers = [...filteredCosplayers].sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];
        if (sortOrder === "asc") {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      });
      setFilteredCosplayers(sortedCosplayers);
    }
  }, [sortBy, sortOrder]);

  const handleCancelSort = () => {
    setSortBy("");
    setSortOrder("asc");
    fetchCosplayersByCharacterAndTime(currentCharacter?.characterName);
  };

  useEffect(() => {
    const fetchCosplayerPrices = async () => {
      if (isModalVisible && modalData.listRequestCharacters.length > 0) {
        const prices = {};
        await Promise.all(
          modalData.listRequestCharacters.map(async (item) => {
            try {
              const cosplayerData =
                await HireCosplayerService.getNameCosplayerInRequestByCosplayerId(
                  item.cosplayerId
                );
              const salaryIndex = cosplayerData?.salaryIndex || 1;
              const character = characters.find(
                (char) => char.id === item.characterId
              );
              const totalHours = calculateTotalHours();
              const totalDays = calculateTotalDays();
              prices[item.cosplayerId] =
                (totalHours * salaryIndex +
                  totalDays * (character?.price || 0)) *
                item.quantity;
            } catch (error) {
              console.warn(
                `Failed to fetch salaryIndex for cosplayer ${item.cosplayerId}:`,
                error
              );
              prices[item.cosplayerId] = 0;
            }
          })
        );
        setCosplayerPrices(prices);
      }
    };
    fetchCosplayerPrices();
  }, [isModalVisible, modalData.listRequestCharacters]);

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchCharacter.toLowerCase())
  );

  const paginatedCharacters = filteredCharacters.slice(
    (currentPage - 1) * characterPageSize,
    currentPage * characterPageSize
  );

  const paginatedCosplayers = filteredCosplayers.slice(
    (currentCosplayerPage - 1) * cosplayerPageSize,
    currentCosplayerPage * cosplayerPageSize
  );

  const disabledDate = (current) => {
    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");

    if (current && current < tomorrow) {
      return true;
    }

    if (dateRange && dateRange[0]) {
      const startDate = dateRange[0];
      const maxEndDate = startDate.add(5, "day");
      return current < startDate || current > maxEndDate;
    }

    return false;
  };

  const disabledTime = (type) => {
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
        if (selectedHour === startHour) {
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => minute !== 0
          );
        }
        if (selectedHour === endHour) {
          return Array.from({ length: 60 }, (_, i) => i).filter(
            (minute) => minute !== 0
          );
        }
        return [];
      },
    };
  };

  const handleDateRangeChange = (dates) => {
    if (!dates) {
      setDateRange(null);
      return;
    }

    const [start, end] = dates;
    const today = dayjs().startOf("day");
    const tomorrow = today.add(1, "day");

    if (start.isBefore(tomorrow, "day")) {
      toast.error("Start date must be tomorrow or later!");
      setDateRange(null);
      return;
    }

    const daysDifference = end.diff(start, "day");
    if (daysDifference > 5) {
      toast.error("The date range cannot exceed 5 days!");
      setDateRange(null);
      return;
    }

    setDateRange(dates);
    setStep(2);
  };

  const handleTimeRangeChange = (times) => {
    if (!times) {
      setTimeRange(null);
      return;
    }

    const [start, end] = times;

    if (end.isBefore(start)) {
      toast.error("End time must be after start time!");
      return;
    }

    setTimeRange(times);
    setStep(3);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value.trim();
    if (!value) {
      toast.error("Location cannot be empty!");
      return;
    }
    setLocation(value);
    setStep(5);
  };

  const handleCharacterSelect = (character) => {
    if (currentCharacter?.characterId === character.id) {
      setCurrentCharacter(null);
      setSelectedCosplayers([]);
      setSelectAll(false);
      setCurrentCosplayerPage(1);
      setStep(5);
      setFilteredCosplayers([]);
      setSortBy("");
      setSortOrder("asc");
    } else {
      setCurrentCharacter({
        characterId: character.id,
        characterName: character.name,
      });
      setSelectedCosplayers([]);
      setSelectAll(false);
      setCurrentCosplayerPage(1);
      fetchCosplayersByCharacterAndTime(character.name);
      setStep(6);
      setSortBy("");
      setSortOrder("asc");
    }
  };

  const handleCosplayerSelect = (cosplayerId) => {
    setSelectedCosplayers((prev) =>
      prev.includes(cosplayerId)
        ? prev.filter((id) => id !== cosplayerId)
        : [...prev, cosplayerId]
    );
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    setSelectedCosplayers(
      e.target.checked ? paginatedCosplayers.map((c) => c.id) : []
    );
  };

  const handleAddCosplayers = () => {
    if (selectedCosplayers.length === 0) {
      toast.error("Please select at least one cosplayer!");
      return;
    }
    const selectedCosplayerDetails = selectedCosplayers.map((id) => {
      const cosplayer = filteredCosplayers.find((c) => c.id === id);
      return { id, name: cosplayer.name, salaryIndex: cosplayer.salaryIndex };
    });

    setRequests((prev) => [
      ...prev,
      {
        characterId: currentCharacter.characterId,
        characterName: currentCharacter.characterName,
        cosplayers: selectedCosplayerDetails,
      },
    ]);
    setStep(5);
    setSelectedCosplayers([]);
    setSelectAll(false);
    setCurrentCosplayerPage(1);
    setCurrentCharacter(null);
    setSortBy("");
    setSortOrder("asc");
  };

  const handleSendRequest = () => {
    if (!dateRange || !timeRange || !location) {
      toast.error(
        "Please complete all required fields (date, time, location)!"
      );
      return;
    }
    if (requests.length === 0) {
      toast.error("Please select at least one character and cosplayer!");
      return;
    }
    setModalData((prev) => ({
      ...prev,
      listRequestCharacters: requests.flatMap((req) =>
        req.cosplayers.map((cosplayer) => ({
          characterId: req.characterId,
          cosplayerId: cosplayer.id,
          description: "",
          quantity: 1,
        }))
      ),
      startDateTime:
        timeRange && dateRange
          ? `${timeRange[0].format(timeFormat)} ${dateRange[0].format(
              dateFormat
            )}`
          : "N/A",
      endDateTime:
        timeRange && dateRange
          ? `${timeRange[1].format(timeFormat)} ${dateRange[1].format(
              dateFormat
            )}`
          : "N/A",
    }));
    setIsModalVisible(true);
  };

  const handleRemoveCosplayer = (cosplayerId, characterId) => {
    setModalData((prev) => ({
      ...prev,
      listRequestCharacters: prev.listRequestCharacters.filter(
        (item) =>
          !(
            item.cosplayerId === cosplayerId && item.characterId === characterId
          )
      ),
    }));
    setRequests((prev) =>
      prev
        .map((req) => ({
          ...req,
          cosplayers: req.cosplayers.filter(
            (cosplayer) => cosplayer.id !== cosplayerId
          ),
        }))
        .filter((req) => req.cosplayers.length > 0)
    );
    setCosplayerPrices((prev) => {
      const newPrices = { ...prev };
      delete newPrices[cosplayerId];
      return newPrices;
    });
  };

  const handleModalConfirm = async () => {
    if (modalData.listRequestCharacters.length === 0) {
      toast.error(
        "Please select at least one cosplayer before sending the request!"
      );
      return;
    }

    if (!modalData.name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    if (!accountId) {
      toast.error(
        "Cannot send request: User ID is missing. Please log in again."
      );
      return;
    }

    const totalPrice = Object.values(cosplayerPrices).reduce(
      (sum, price) => sum + price,
      0
    );

    const requestData = {
      accountId: accountId,
      name: modalData.name,
      description: modalData.description || "No description provided",
      price: totalPrice,
      startDate: dateRange[0].format(dateFormat),
      endDate: dateRange[1].format(dateFormat),
      location: location,
      deposit: deposit, // Use the selected deposit value
      charactersRentCosplayers: modalData.listRequestCharacters.map((item) => ({
        characterId: item.characterId,
        cosplayerId: item.cosplayerId,
        description: item.description || "No description",
        listRequestDates: [
          {
            startDate: timeRange[0].format(timeFormat),
            endDate: timeRange[1].format(timeFormat),
          },
        ],
      })),
    };

    console.log("Request data before sending POST:", requestData);

    try {
      const response = await HireCosplayerService.NewSendRequestHireCosplayer(
        requestData
      );
      console.log("Request sent successfully:", response);
      setIsModalVisible(false);
      setStep(1);
      setDateRange(null);
      setTimeRange(null);
      setLocation("");
      setRequests([]);
      setSelectedCosplayers([]);
      setSelectAll(false);
      setCurrentCosplayerPage(1);
      setCurrentCharacter(null);
      setCosplayerPrices({});
      setSortBy("");
      setSortOrder("asc");
      setDeposit("50"); // Reset deposit to default after sending request
      toast.success("Request sent successfully!");
    } catch (error) {
      console.error("Failed to send request:", error.message);
      toast.error(`Failed to send request: ${error.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="cosplay-rental-page min-vh-100"
        style={{ padding: "50px" }}
      >
        <Alert
          message="Login Error"
          description={error || "You need to log in to use this page."}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="cosplay-rental-page min-vh-100"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <Spin size="large" tip="Loading data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="cosplay-rental-page min-vh-100"
        style={{ padding: "50px" }}
      >
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="cosplay-rental-page min-vh-100">
      <div className="hero-section text-black py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Hire Cosplayers</h1>
          <p className="lead text-center mt-3">
            Book your favorite cosplayers for events
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="filter-section mb-5">
          {step >= 1 && (
            <div className="filter-card">
              <h3 className="section-title">Select Date Range:</h3>
              <DateRangePicker
                value={dateRange}
                onChange={handleDateRangeChange}
                format={dateFormat}
                disabledDate={disabledDate}
                className="custom-date-picker"
              />
            </div>
          )}
          {step >= 2 && (
            <div className="filter-card">
              <h3 className="section-title">Select Time Range:</h3>
              <TimeRangePicker
                value={timeRange}
                onChange={handleTimeRangeChange}
                format={timeFormat}
                disabledTime={disabledTime}
                className="custom-time-picker"
                defaultValue={[
                  dayjs("08:00", timeFormat),
                  dayjs("22:00", timeFormat),
                ]}
              />
            </div>
          )}
          {step >= 3 && (
            <div className="filter-card">
              <h3 className="section-title">Enter Location:</h3>
              <Input
                placeholder="Enter event location"
                value={location}
                onChange={handleLocationChange}
                prefix={<SearchOutlined />}
                className="custom-input"
              />
            </div>
          )}
        </div>

        {step >= 5 && (
          <div className="character-selection-card mb-5">
            <Row align="middle" gutter={16} className="mb-4">
              <Col>
                <h3 className="section-title">Select Character:</h3>
              </Col>
              <Col>
                <Input
                  placeholder="Search character"
                  value={searchCharacter}
                  onChange={(e) => {
                    setSearchCharacter(e.target.value);
                    setCurrentPage(1);
                  }}
                  prefix={<SearchOutlined />}
                  className="custom-input-search"
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              {paginatedCharacters.map((character) => (
                <Col xs={24} sm={12} md={8} key={character.id}>
                  <Card
                    hoverable
                    className={`character-card ${
                      currentCharacter?.characterId === character.id
                        ? "active"
                        : ""
                    } ${
                      requests.some((r) => r.characterId === character.id)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleCharacterSelect(character)}
                  >
                    <h4>{character.name}</h4>
                    <p>
                      Height: {character.minHeight} - {character.maxHeight} cm
                    </p>
                    <p>
                      Weight: {character.minWeight} - {character.maxWeight} kg
                    </p>
                    <p>Price: {character.price} VND</p>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              current={currentPage}
              pageSize={characterPageSize}
              total={filteredCharacters.length}
              onChange={(page) => setCurrentPage(page)}
              className="custom-pagination"
            />
          </div>
        )}

        {step >= 6 && (
          <div className="cosplayer-selection">
            <h3 className="section-title mb-4">
              Available Cosplayers for {currentCharacter?.characterName}:
            </h3>
            {filteredCosplayers.length === 0 ? (
              <p>No cosplayers available for this character and time range.</p>
            ) : (
              <>
                <Row align="middle" gutter={16} className="mb-4">
                  <Col>
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="custom-checkbox"
                    >
                      Select All
                    </Checkbox>
                  </Col>
                  <Col>
                    <Select
                      value={sortBy || "Sort By"}
                      onChange={(value) => setSortBy(value)}
                      style={{ width: 150 }}
                    >
                      <Option value="Sort By" disabled>
                        Sort By
                      </Option>
                      <Option value="height">Height</Option>
                      <Option value="weight">Weight</Option>
                      <Option value="salaryIndex">Hourly Rate</Option>
                      <Option value="averageStar">Average Star</Option>
                    </Select>
                  </Col>
                  <Col>
                    <Select
                      value={sortOrder}
                      onChange={(value) => setSortOrder(value)}
                      style={{ width: 120 }}
                    >
                      <Option value="asc">Ascending</Option>
                      <Option value="desc">Descending</Option>
                    </Select>
                  </Col>
                  <Col>
                    <Button onClick={handleCancelSort}>Cancel Sorting</Button>
                  </Col>
                </Row>
                <List
                  grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                  dataSource={paginatedCosplayers}
                  renderItem={(cosplayer) => (
                    <List.Item key={cosplayer.id}>
                      <Card
                        className={`cosplayer-item ${
                          selectedCosplayers.includes(cosplayer.id)
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => handleCosplayerSelect(cosplayer.id)}
                      >
                        <img
                          src={cosplayer.avatar}
                          alt={cosplayer.name}
                          className="cosplayer-avatar"
                          onError={(e) => (e.target.src = DEFAULT_AVATAR_URL)}
                        />
                        <h5>{cosplayer.name}</h5>
                        <p className="description">{cosplayer.description}</p>
                        <p>
                          Height: {cosplayer.height} cm - Weight:{" "}
                          {cosplayer.weight} kg
                        </p>
                        <p>Hourly Rate: {cosplayer.salaryIndex} VND/h</p>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ marginRight: "8px" }}>Rating:</span>
                          <Rate
                            disabled
                            allowHalf
                            value={cosplayer.averageStar}
                          />
                          <span style={{ marginLeft: "8px" }}>
                            ({cosplayer.averageStar}/5)
                          </span>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
                <Pagination
                  current={currentCosplayerPage}
                  pageSize={cosplayerPageSize}
                  total={filteredCosplayers.length}
                  onChange={(page) => setCurrentCosplayerPage(page)}
                  className="custom-pagination"
                />
                <Button
                  type="primary"
                  onClick={handleAddCosplayers}
                  className="custom-btn-add mt-4"
                >
                  Add Cosplayers & Select More
                </Button>
              </>
            )}
          </div>
        )}
        {requests.length > 0 && (
          <div className="request-summary mt-5">
            <h3 className="section-title mb-4">Selected Requests:</h3>
            <p
              style={{
                fontStyle: "italic",
                color: "#888",
                marginBottom: "10px",
              }}
            >
              Note: Price = (Total Hours × Hourly Rate) + (Total Days ×
              Character Price)
            </p>
            <List
              dataSource={requests}
              renderItem={(req) => (
                <List.Item key={req.characterId}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong>{req.characterName}</strong> - Cosplayers:{" "}
                      {req.cosplayers.map((cosplayer, index) => (
                        <span key={cosplayer.id}>
                          {cosplayer.name} (Unit Price Hire Cosplayer:{" "}
                          {calculateUnitPrice(
                            cosplayer,
                            req.characterId
                          ).toLocaleString()}{" "}
                          VND)
                          {index < req.cosplayers.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <div>
                      {req.cosplayers.map((cosplayer) => (
                        <Button
                          key={cosplayer.id}
                          type="link"
                          icon={<CloseOutlined />}
                          onClick={() =>
                            handleRemoveCosplayer(cosplayer.id, req.characterId)
                          }
                          style={{ color: "#510545", marginLeft: "10px" }}
                        />
                      ))}
                    </div>
                  </div>
                </List.Item>
              )}
            />
            <Button
              type="primary"
              size="large"
              onClick={handleSendRequest}
              className="custom-btn-send mt-4"
            >
              Send Request Hire Cosplayer
            </Button>
          </div>
        )}
        <Modal
          title="Confirm Your Request"
          visible={isModalVisible}
          onOk={handleModalConfirm}
          onCancel={() => setIsModalVisible(false)}
          okText="Send Request"
          cancelText="Cancel"
          style={{
            fontFamily: "'Poppins', sans-serif",
          }}
          bodyStyle={{
            background: "#fff",
            borderRadius: "0 0 15px 15px",
            padding: "2rem",
            boxShadow: "0 10px 30px rgba(34, 102, 138, 0.2)",
          }}
          headerStyle={{
            background: "linear-gradient(135deg, #510545, #22668a)",
            borderRadius: "15px 15px 0 0",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Name:
              </label>
              <Input
                value={modalData.name}
                onChange={(e) =>
                  setModalData({ ...modalData, name: e.target.value })
                }
                placeholder="Your account name"
                style={{
                  borderRadius: "10px",
                  border: "2px solid #22668a",
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#510545")}
                onBlur={(e) => (e.target.style.borderColor = "#22668a")}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Description:
              </label>
              <Input.TextArea
                value={modalData.description}
                onChange={(e) =>
                  setModalData({ ...modalData, description: e.target.value })
                }
                placeholder="Enter description"
                style={{
                  borderRadius: "10px",
                  border: "2px solid #22668a",
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                  minHeight: "100px",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#510545")}
                onBlur={(e) => (e.target.style.borderColor = "#22668a")}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Start DateTime:
              </label>
              <span
                style={{
                  fontSize: "1rem",
                  color: "#1a1a2e",
                }}
              >
                {modalData.startDateTime}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                End DateTime:
              </label>
              <span
                style={{
                  fontSize: "1rem",
                  color: "#1a1a2e",
                }}
              >
                {modalData.endDateTime}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Location:
              </label>
              <span
                style={{
                  fontSize: "1rem",
                  color: "#1a1a2e",
                }}
              >
                {location || "N/A"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Requested Characters:
              </label>
              <div
                style={{
                  border: "1px solid #e6e9ee",
                  borderRadius: "10px",
                  padding: "0.5rem",
                  background: "#f8f9fa",
                }}
              >
                <List
                  dataSource={modalData.listRequestCharacters}
                  renderItem={(item, index) => {
                    const cosplayer = requests
                      .flatMap((req) => req.cosplayers)
                      .find((c) => c.id === item.cosplayerId);
                    return (
                      <List.Item
                        key={index}
                        actions={[
                          <Button
                            type="link"
                            icon={<CloseOutlined />}
                            onClick={() =>
                              handleRemoveCosplayer(
                                item.cosplayerId,
                                item.characterId
                              )
                            }
                            style={{
                              color: "#510545",
                            }}
                          />,
                        ]}
                        style={{
                          padding: "0.5rem",
                          borderBottom:
                            index < modalData.listRequestCharacters.length - 1
                              ? "1px solid #e6e9ee"
                              : "none",
                        }}
                      >
                        <span
                          style={{
                            color: "#1a1a2e",
                            fontSize: "0.95rem",
                          }}
                        >
                          {cosplayer?.name || "Unknown Cosplayer"} as{" "}
                          {
                            characters.find((c) => c.id === item.characterId)
                              ?.name
                          }{" "}
                          - Hourly Rate: {cosplayer?.salaryIndex || "N/A"} -
                          Quantity: {item.quantity} - Price:{" "}
                          {cosplayerPrices[
                            item.cosplayerId
                          ]?.toLocaleString() || "Loading..."}{" "}
                          VND
                        </span>
                      </List.Item>
                    );
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "1rem",
                borderTop: "2px solid #22668a",
              }}
            >
              <label
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Total Price:
              </label>
              <span
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                {Object.values(cosplayerPrices)
                  .reduce((sum, price) => sum + price, 0)
                  .toLocaleString() || 0}{" "}
                VND
              </span>
            </div>
            {/* New Deposit Selection Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "#510545",
                }}
              >
                Select Deposit Percentage:
              </label>
              <Radio.Group
                onChange={(e) => setDeposit(e.target.value)}
                value={deposit}
                style={{ display: "flex", gap: "1rem" }}
              >
                <Radio value="30">30%</Radio>
                <Radio value="50">50%</Radio>
                <Radio value="70">70%</Radio>
              </Radio.Group>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CosplayersPage;
