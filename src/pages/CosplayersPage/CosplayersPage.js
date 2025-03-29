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
} from "antd";
import { SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import "../../styles/CosplayersPage.scss";
import HireCosplayerService from "../../services/HireCosplayerService/HireCosplayerService.js";
import { toast } from "react-toastify";

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

const DEFAULT_AVATAR_URL =
  "https://pm1.narvii.com/6324/0d7f51553b6ca0785d3912929088c25acc1bc53f_hq.jpg";

const CosplayersPage = () => {
  const [cosplayers, setCosplayers] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Thêm state để kiểm tra login

  const [dateRange, setDateRange] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [location, setLocation] = useState("");
  const [accountCouponId, setAccountCouponId] = useState("");
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

  const serviceId = "S002";
  const packageId = "";
  const dateFormat = "DD/MM/YYYY";
  const timeFormat = "HH:mm";
  const characterPageSize = 10;
  const cosplayerPageSize = 9;

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("Bạn cần đăng nhập để sử dụng trang này.");
      return;
    }

    setIsAuthenticated(true); // Đánh dấu đã đăng nhập nếu có token

    try {
      const decoded = jwtDecode(accessToken);
      const accountName = decoded?.AccountName;
      const id = decoded?.Id;
      if (accountName) {
        setModalData((prev) => ({ ...prev, name: accountName }));
      }
      if (id) {
        setAccountId(id);
      } else {
        console.warn("JWT does not contain Id field");
      }
    } catch (error) {
      console.error("Invalid token", error);
      setError("Token không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [cosplayersData, charactersData] = await Promise.all([
          HireCosplayerService.getAllCosplayers(),
          HireCosplayerService.getAllCharacters(),
        ]);

        const mappedCosplayers = cosplayersData.map((cosplayer) => ({
          id: cosplayer.accountId,
          name: cosplayer.name,
          avatar: cosplayer.images[0]?.urlImage || DEFAULT_AVATAR_URL,
          description: cosplayer.description || "No description",
          height: cosplayer.height,
          weight: cosplayer.weight,
        }));

        const mappedCharacters = charactersData.map((character) => ({
          id: character.characterId,
          name: character.characterName,
          minHeight: character.minHeight,
          maxHeight: character.maxHeight,
          minWeight: character.minWeight,
          maxWeight: character.maxWeight,
        }));

        setCosplayers(mappedCosplayers);
        setCharacters(mappedCharacters);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (dates) setStep(2);
  };

  const handleTimeRangeChange = (times) => {
    setTimeRange(times);
    if (times) setStep(3);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    if (e.target.value) setStep(4);
  };

  const handleCouponChange = (e) => {
    setAccountCouponId(e.target.value);
  };

  const handleSkipCoupon = () => {
    setStep(5);
  };

  const handleCharacterSelect = (character) => {
    if (currentCharacter?.characterId === character.id) {
      setCurrentCharacter(null);
      setFilteredCosplayers([]);
      setSelectedCosplayers([]);
      setSelectAll(false);
      setCurrentCosplayerPage(1);
      setStep(5);
    } else {
      const filtered = cosplayers.filter(
        (cosplayer) =>
          !requests.some((r) => r.cosplayerIds.includes(cosplayer.id)) &&
          cosplayer.height > character.minHeight &&
          cosplayer.height < character.maxHeight &&
          cosplayer.weight > character.minWeight &&
          cosplayer.weight < character.maxWeight
      );
      setFilteredCosplayers(filtered);
      setSelectedCosplayers([]);
      setSelectAll(false);
      setCurrentCosplayerPage(1);
      setCurrentCharacter({
        characterId: character.id,
        characterName: character.name,
      });
      setStep(6);
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
      alert("Please select at least one cosplayer!");
      return;
    }
    setRequests((prev) => [
      ...prev,
      {
        characterId: currentCharacter.characterId,
        characterName: currentCharacter.characterName,
        cosplayerIds: selectedCosplayers,
      },
    ]);
    setStep(5);
    setFilteredCosplayers([]);
    setSelectedCosplayers([]);
    setSelectAll(false);
    setCurrentCosplayerPage(1);
    setCurrentCharacter(null);
  };

  const handleSendRequest = () => {
    if (requests.length === 0) {
      alert("Please select at least one character and cosplayer!");
      return;
    }
    setModalData((prev) => ({
      ...prev,
      listRequestCharacters: requests.flatMap((req) =>
        req.cosplayerIds.map((cosplayerId) => ({
          characterId: req.characterId,
          cosplayerId,
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
          cosplayerIds: req.cosplayerIds.filter((id) => id !== cosplayerId),
        }))
        .filter((req) => req.cosplayerIds.length > 0)
    );
  };

  // const handleModalConfirm = () => {
  //   if (!accountId) {
  //     alert("Cannot send request: User ID is missing. Please log in again.");
  //     return;
  //   }

  //   const totalPrice = modalData.listRequestCharacters.length * 100;
  //   const requestData = {
  //     accountId: accountId,
  //     name: localStorage.getItem("AccountName") || modalData.name || "N/A",
  //     description: modalData.description || " ",
  //     price: totalPrice,
  //     startDate:
  //       dateRange && timeRange
  //         ? `${timeRange[0].format(timeFormat)} ${dateRange[0].format(
  //             dateFormat
  //           )}`
  //         : "N/A",
  //     endDate:
  //       dateRange && timeRange
  //         ? `${timeRange[1].format(timeFormat)} ${dateRange[1].format(
  //             dateFormat
  //           )}`
  //         : "N/A",
  //     location: location || "N/A",
  //     serviceId: "S002",
  //     packageId: " ",
  //     accountCouponId: accountCouponId || null,
  //     listRequestCharacters: modalData.listRequestCharacters.map((item) => ({
  //       characterId: item.characterId,
  //       cosplayerId: item.cosplayerId,
  //       description: " ",
  //       quantity: 1,
  //     })),
  //   };
  //   console.log("Request Data:", JSON.stringify(requestData, null, 2));
  //   setIsModalVisible(false);
  //   setStep(1);
  //   setDateRange(null);
  //   setTimeRange(null);
  //   setLocation("");
  //   setAccountCouponId("");
  //   setRequests([]);
  //   setFilteredCosplayers([]);
  //   setSelectedCosplayers([]);
  //   setSelectAll(false);
  //   setCurrentCosplayerPage(1);
  //   setCurrentCharacter(null);
  // };
  const handleModalConfirm = async () => {
    if (!accountId) {
      alert("Cannot send request: User ID is missing. Please log in again.");
      return;
    }

    const totalPrice = modalData.listRequestCharacters.length * 100;
    const requestData = {
      accountId: accountId,
      name: localStorage.getItem("AccountName") || modalData.name || "N/A",
      description: modalData.description || " ",
      price: totalPrice,
      startDate:
        dateRange && timeRange
          ? `${timeRange[0].format(timeFormat)} ${dateRange[0].format(
              dateFormat
            )}`
          : "N/A",
      endDate:
        dateRange && timeRange
          ? `${timeRange[1].format(timeFormat)} ${dateRange[1].format(
              dateFormat
            )}`
          : "N/A",
      location: location || "N/A",
      serviceId: "S002",
      packageId: " ",
      accountCouponId: accountCouponId || null,
      listRequestCharacters: modalData.listRequestCharacters.map((item) => ({
        characterId: item.characterId,
        cosplayerId: item.cosplayerId,
        description: " ",
        quantity: 1,
      })),
    };

    try {
      const response = await HireCosplayerService.sendRequestHireCosplayer(
        requestData
      );
      console.log("Request sent successfully:", response);
      setIsModalVisible(false);
      setStep(1);
      setDateRange(null);
      setTimeRange(null);
      setLocation("");
      setAccountCouponId("");
      setRequests([]);
      setFilteredCosplayers([]);
      setSelectedCosplayers([]);
      setSelectAll(false);
      setCurrentCosplayerPage(1);
      setCurrentCharacter(null);
      toast.success("Request sent successfully!");
    } catch (error) {
      console.error("Failed to send request:", error.message);
      alert(error.message); // Hiển thị lỗi cho người dùng
    }
  };
  if (!isAuthenticated) {
    return (
      <div
        className="cosplay-rental-page min-vh-100"
        style={{ padding: "50px" }}
      >
        <Alert
          message="Lỗi đăng nhập"
          description={error || "Bạn cần đăng nhập để sử dụng trang này."}
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
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="cosplay-rental-page min-vh-100"
        style={{ padding: "50px" }}
      >
        <Alert message="Lỗi" description={error} type="error" showIcon />
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
        {step >= 1 && (
          <div className="filter-card mb-4" style={{ width: "50%" }}>
            <Row align="middle" gutter={16}>
              <Col>
                <h3 className="section-title">Select Date Range:</h3>
              </Col>
              <Col>
                <DateRangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  format={dateFormat}
                  style={{ width: "300px" }}
                />
              </Col>
            </Row>
          </div>
        )}

        {step >= 2 && (
          <div className="filter-card mb-4" style={{ width: "50%" }}>
            <Row align="middle" gutter={16}>
              <Col>
                <h3 className="section-title">Select Time Range:</h3>
              </Col>
              <Col>
                <TimeRangePicker
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  format={timeFormat}
                  style={{ width: "200px" }}
                  defaultValue={[
                    dayjs("09:00", timeFormat),
                    dayjs("17:00", timeFormat),
                  ]}
                />
              </Col>
            </Row>
          </div>
        )}

        {step >= 3 && (
          <div className="filter-card mb-4" style={{ width: "50%" }}>
            <Row align="middle" gutter={16}>
              <Col>
                <h3 className="section-title">Enter Location:</h3>
              </Col>
              <Col>
                <Input
                  placeholder="Enter event location"
                  value={location}
                  onChange={handleLocationChange}
                  prefix={<SearchOutlined />}
                  style={{ width: "300px" }}
                />
              </Col>
            </Row>
          </div>
        )}

        {step >= 4 && (
          <div className="filter-card mb-4" style={{ width: "50%" }}>
            <Row align="middle" gutter={16}>
              <Col>
                <h3 className="section-title">Enter Coupon (Optional):</h3>
              </Col>
              <Col flex="auto">
                <Input
                  placeholder="Enter coupon ID (optional)"
                  value={accountCouponId}
                  onChange={handleCouponChange}
                  style={{ width: "200px" }}
                />
              </Col>
              <Col>
                <Button onClick={handleSkipCoupon}>Skip</Button>
              </Col>
            </Row>
          </div>
        )}

        {step >= 5 && (
          <div className="character-selection-card mb-4">
            <Row align="middle" gutter={16}>
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
                  style={{ width: "250px" }}
                />
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
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
                    <p>{character.name}</p>
                    <p>
                      Height: {character.minHeight} - {character.maxHeight} (cm)
                    </p>
                    <p>
                      Weight: {character.minWeight} - {character.maxWeight} (kg)
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              current={currentPage}
              pageSize={characterPageSize}
              total={filteredCharacters.length}
              onChange={(page) => setCurrentPage(page)}
              style={{ marginTop: 16, textAlign: "center" }}
            />
          </div>
        )}

        {step >= 6 && (
          <>
            <h3 className="section-title">
              Available Cosplayers for {currentCharacter?.characterName}:
            </h3>
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
              className="mb-3"
            >
              Select All
            </Checkbox>
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
                    <p>{cosplayer.description}</p>
                    <p>Height: {cosplayer.height} (cm)</p>
                    <p>Weight: {cosplayer.weight} (kg)</p>
                  </Card>
                </List.Item>
              )}
            />
            <Pagination
              current={currentCosplayerPage}
              pageSize={cosplayerPageSize}
              total={filteredCosplayers.length}
              onChange={(page) => setCurrentCosplayerPage(page)}
              style={{ marginTop: 16, textAlign: "center" }}
            />
            <Button
              type="primary"
              onClick={handleAddCosplayers}
              className="mt-3"
            >
              Add Cosplayers & Select More
            </Button>
          </>
        )}

        {requests.length > 0 && (
          <div className="mt-4">
            <h3 className="section-title">Selected Requests:</h3>
            <List
              dataSource={requests}
              renderItem={(req) => (
                <List.Item key={req.characterId}>
                  {req.characterName} - Cosplayers:{" "}
                  {req.cosplayerIds
                    .map((id) => cosplayers.find((c) => c.id === id)?.name)
                    .join(", ")}
                </List.Item>
              )}
            />
            <Button
              type="primary"
              size="large"
              className="add-to-contract-btn mt-4"
              onClick={handleSendRequest}
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
          cancelText={null}
        >
          <p>
            <strong>Name:</strong>
          </p>
          <Input
            value={modalData.name}
            onChange={(e) =>
              setModalData({ ...modalData, name: e.target.value })
            }
            placeholder="Your account name"
            style={{ width: "250px" }}
          />
          <p>
            <strong>Description:</strong>
          </p>
          <Input.TextArea
            value={modalData.description}
            onChange={(e) =>
              setModalData({ ...modalData, description: e.target.value })
            }
            placeholder="Enter description"
            style={{ width: "300px" }}
          />
          <p>
            <strong>Start DateTime:</strong> {modalData.startDateTime}
          </p>
          <p>
            <strong>End DateTime:</strong> {modalData.endDateTime}
          </p>
          <p>
            <strong>Location:</strong> {location || "N/A"}
          </p>
          <p>
            <strong>Coupon ID:</strong> {accountCouponId || "N/A"}
          </p>
          <h4>List of Requested Characters:</h4>
          <List
            dataSource={modalData.listRequestCharacters}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                actions={[
                  <Button
                    type="link"
                    icon={<CloseOutlined />}
                    onClick={() =>
                      handleRemoveCosplayer(item.cosplayerId, item.characterId)
                    }
                  />,
                ]}
              >
                <p>
                  {cosplayers.find((c) => c.id === item.cosplayerId)?.name} -{" "}
                  {characters.find((c) => c.id === item.characterId)?.name} -{" "}
                  Quantity:{" "}
                  <Input
                    value={item.quantity}
                    disabled
                    style={{ width: "50px" }}
                  />
                </p>
              </List.Item>
            )}
          />
          <p>
            <strong>Price:</strong>{" "}
            {modalData.listRequestCharacters.length * 100} (Dynamic)
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default CosplayersPage;
