// tính lại giá edit * thêm totalday
import React, { useState, useEffect, useCallback } from "react";
import { Form, Modal, Input, List, Button } from "antd";
import { Edit } from "lucide-react";
import dayjs from "dayjs";
import MyHistoryService from "../../services/HistoryService/MyHistoryService";
import RequestService from "../../services/ManageServicePages/ManageRequestService/RequestService.js";
import { toast } from "react-toastify";

const { TextArea } = Input;

const EditRequestHireCosplayer = ({
  visible,
  requestId,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    location: "",
    serviceId: "S002",
    packageId: null,
    totalDate: 0,
    listUpdateRequestCharacters: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [changeCosplayerVisible, setChangeCosplayerVisible] = useState(false);
  const [availableCosplayers, setAvailableCosplayers] = useState([]);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(null);
  const [existingCosplayerIds, setExistingCosplayerIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("averageStar");
  const [sortOrder, setSortOrder] = useState("descend");
  const rowsPerPage = 8;

  // Hàm tính giá cho một cosplayer
  const calculateCosplayerPrice = (
    salaryIndex,
    characterPrice,
    totalHours,
    totalDays
  ) => {
    if (!salaryIndex || !characterPrice || !totalHours || !totalDays) return 0;
    return totalHours * salaryIndex + characterPrice * totalDays;
  };

  // Hàm tính tổng giá cho tất cả cosplayer
  const calculateTotalPrice = (characters) => {
    return characters.reduce((total, char) => {
      const totalHours = char.listUpdateRequestDates.reduce(
        (sum, date) => sum + (date.totalHour || 0),
        0
      );

      let totalDays = 0;
      if (char.listUpdateRequestDates.length > 0) {
        const startDate = dayjs(
          char.listUpdateRequestDates[0].startDate,
          "HH:mm DD/MM/YYYY"
        );
        const endDate = dayjs(
          char.listUpdateRequestDates.slice(-1)[0].endDate,
          "HH:mm DD/MM/YYYY"
        );
        if (startDate.isValid() && endDate.isValid()) {
          totalDays = endDate.diff(startDate, "day") + 1;
        } else {
          console.warn(
            "Invalid date format for cosplayer:",
            char.cosplayerName
          );
        }
      }

      return (
        total +
        calculateCosplayerPrice(
          char.salaryIndex,
          char.characterPrice || 0,
          totalHours,
          totalDays
        )
      );
    }, 0);
  };

  // Tính lại totalPrice khi listUpdateRequestCharacters thay đổi
  useEffect(() => {
    const price = calculateTotalPrice(requestData.listUpdateRequestCharacters);
    setTotalPrice(price);
  }, [requestData.listUpdateRequestCharacters]);

  const fetchRequestData = useCallback(async () => {
    if (!requestId) return;
    setLoading(true);
    try {
      const data = await MyHistoryService.getRequestByRequestId(requestId);
      if (!data) throw new Error("Request data not found");

      const charactersList = data.charactersListResponse || [];
      const existingIds = new Set(
        charactersList.map((char) => char.cosplayerId).filter(Boolean)
      );
      setExistingCosplayerIds(existingIds);

      const listUpdateRequestCharacters = await Promise.all(
        charactersList.map(async (char) => {
          let cosplayerName = "Not Assigned";
          let cosplayerId = char.cosplayerId || null;
          let characterName = "Unknown";
          let characterPrice = 0;
          let salaryIndex = 1;
          let averageStar = 0;
          let height = 0;
          let weight = 0;

          if (char.cosplayerId) {
            try {
              const cosplayerData =
                await MyHistoryService.gotoHistoryByAccountId(char.cosplayerId);
              cosplayerName = cosplayerData?.name || "Unknown";
              salaryIndex = cosplayerData?.salaryIndex || 1;
              cosplayerId = cosplayerData?.accountId || char.cosplayerId;
              averageStar = cosplayerData?.averageStar || 0;
              height = cosplayerData?.height || 0;
              weight = cosplayerData?.weight || 0;
            } catch (cosplayerError) {
              console.warn(
                `Failed to fetch cosplayer data for ID ${char.cosplayerId}:`,
                cosplayerError
              );
            }
          }

          try {
            const characterData = await MyHistoryService.getCharacterById(
              char.characterId
            );
            characterName = characterData?.characterName || "Unknown";
            characterPrice = characterData?.price || 0;
          } catch (characterError) {
            console.warn(
              `Failed to fetch character data for ID ${char.characterId}:`,
              characterError
            );
          }

          return {
            requestCharacterId: char.requestCharacterId || null,
            characterId: char.characterId,
            cosplayerId,
            cosplayerName,
            characterName,
            characterPrice,
            salaryIndex,
            averageStar,
            height,
            weight,
            description: char.description || "",
            quantity: char.quantity || 1,
            listUpdateRequestDates: (char.requestDateResponses || []).map(
              (date) => ({
                requestDateId: date.requestDateId || null,
                startDate: date.startDate || "",
                endDate: date.endDate || "",
                totalHour: date.totalHour || 0,
              })
            ),
          };
        })
      );

      const startDate = charactersList[0]?.requestDateResponses[0]?.startDate
        ? dayjs(
            charactersList[0].requestDateResponses[0].startDate,
            "HH:mm DD/MM/YYYY"
          )
        : null;
      const endDate = charactersList[0]?.requestDateResponses.slice(-1)[0]
        ?.endDate
        ? dayjs(
            charactersList[0].requestDateResponses.slice(-1)[0].endDate,
            "HH:mm DD/MM/YYYY"
          )
        : null;

      setRequestData({
        name: data.name || "",
        description: data.description || "",
        startDate,
        endDate,
        location: data.location || "",
        serviceId: data.serviceId || "S002",
        packageId: null,
        totalDate: data.totalDate || 0,
        listUpdateRequestCharacters,
      });

      form.setFieldsValue({
        name: data.name || "",
        description: data.description || "",
        location: data.location || "",
      });
    } catch (error) {
      console.error("Failed to fetch request details:", error);
      toast.error("Failed to load request details.");
    } finally {
      setLoading(false);
    }
  }, [requestId, form]);

  useEffect(() => {
    if (visible && requestId) {
      fetchRequestData();
    }
  }, [visible, requestId, fetchRequestData]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedData = {
        name: values.name,
        description: values.description,
        price: totalPrice,
        startDate: requestData.startDate
          ? requestData.startDate.format("DD/MM/YYYY")
          : "",
        endDate: requestData.endDate
          ? requestData.endDate.format("DD/MM/YYYY")
          : "",
        location: values.location,
        serviceId: requestData.serviceId,
        packageId: null,
        listUpdateRequestCharacters:
          requestData.listUpdateRequestCharacters.map((char) => ({
            requestCharacterId: char.requestCharacterId || null,
            characterId: char.characterId,
            cosplayerId: char.cosplayerId,
            description: char.description,
            quantity: char.quantity,
          })),
      };

      setLoading(true);
      const response = await MyHistoryService.editRequest(
        requestId,
        formattedData
      );
      toast.success(response?.message || "Request updated successfully!");
      onSuccess();
      onCancel();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update request. Please try again.";
      toast.error(errorMessage);
      console.error("Failed to update request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCosplayer = async (
    characterId,
    currentCosplayerId,
    index
  ) => {
    const dates = requestData.listUpdateRequestCharacters[
      index
    ].listUpdateRequestDates.map((date) => ({
      startDate: date.startDate,
      endDate: date.endDate,
    }));
    try {
      const data = {
        characterId,
        dates,
        checkAccountRequest: true,
      };
      const available = await MyHistoryService.ChangeCosplayer(data);

      const uniqueCosplayers = [];
      const seenAccountIds = new Set();
      await Promise.all(
        available.map(async (cos) => {
          if (
            (cos.accountId === currentCosplayerId ||
              !existingCosplayerIds.has(cos.accountId)) &&
            !seenAccountIds.has(cos.accountId)
          ) {
            try {
              const cosplayerData =
                await MyHistoryService.gotoHistoryByAccountId(cos.accountId);
              uniqueCosplayers.push({
                name: cosplayerData.name || cos.name,
                accountId: cosplayerData.accountId || cos.accountId,
                averageStar: cosplayerData.averageStar || cos.averageStar || 0,
                height: cosplayerData.height || cos.height || 0,
                weight: cosplayerData.weight || cos.weight || 0,
                salaryIndex: cosplayerData.salaryIndex || cos.salaryIndex || 0,
              });
              seenAccountIds.add(cos.accountId);
            } catch (cosplayerError) {
              console.warn(
                `Failed to fetch cosplayer data for ID ${cos.accountId}:`,
                cosplayerError
              );
            }
          }
        })
      );

      setAvailableCosplayers(uniqueCosplayers);
      setCurrentCharacterIndex(index);
      setChangeCosplayerVisible(true);
    } catch (error) {
      console.error("Error fetching available cosplayers:", error);
      toast.error(
        error.response?.data?.message || "Failed to load available cosplayers."
      );
    }
  };

  const handleCosplayerSelect = async (accountId) => {
    const selectedCosplayer = availableCosplayers.find(
      (cos) => cos.accountId === accountId
    );
    if (selectedCosplayer && currentCharacterIndex !== null) {
      const updatedCharacters = [...requestData.listUpdateRequestCharacters];
      const char = updatedCharacters[currentCharacterIndex];
      const previousCosplayerId = char.cosplayerId;

      char.cosplayerId = accountId;
      char.cosplayerName = selectedCosplayer.name;
      char.averageStar = selectedCosplayer.averageStar;
      char.height = selectedCosplayer.height;
      char.weight = selectedCosplayer.weight;
      char.salaryIndex = selectedCosplayer.salaryIndex;

      setRequestData((prev) => ({
        ...prev,
        listUpdateRequestCharacters: updatedCharacters,
      }));

      setExistingCosplayerIds((prev) => {
        const newSet = new Set(prev);
        if (previousCosplayerId) newSet.delete(previousCosplayerId);
        newSet.add(accountId);
        return newSet;
      });

      setChangeCosplayerVisible(false);
      setCurrentCharacterIndex(null);
    }
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "ascend" ? "descend" : "ascend");
    setCurrentPage(1);
  };

  const sortedCosplayers = [...availableCosplayers].sort((a, b) => {
    if (!a[sortField] && !b[sortField]) return 0;
    if (!a[sortField]) return 1;
    if (!b[sortField]) return -1;
    return sortOrder === "ascend"
      ? a[sortField] - b[sortField]
      : b[sortField] - a[sortField];
  });

  const paginatedCosplayers = sortedCosplayers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(availableCosplayers.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page < 1 ? 1 : page > totalPages ? totalPages : page);
  };

  return (
    <Modal
      title="Edit Request for Hiring Cosplayer"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Save Changes"
      cancelText="Cancel"
      confirmLoading={loading}
      width={1000}
    >
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[
                { required: true, message: "Please enter the request name" },
              ]}
            >
              <Input placeholder="Enter request name" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea rows={4} placeholder="Enter request description" />
            </Form.Item>
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please enter the location" }]}
            >
              <Input placeholder="Enter location" />
            </Form.Item>
          </Form>
          <h4>
            List of Requested Characters (Total Price:{" "}
            {totalPrice.toLocaleString()} VND)
          </h4>
          <i style={{ color: "gray" }}>
            *Note: Unit Price hire cosplayer = (Total Hours × Hourly Rate) +
            (Character Price × Total Days)
          </i>
          <List
            dataSource={requestData.listUpdateRequestCharacters}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p>
                        <span>Cosplayer Name: </span>
                        <strong>{item.cosplayerName}</strong>
                        {item.averageStar && (
                          <span> | Rating: {item.averageStar}/5</span>
                        )}
                        {item.height && <span> | Height: {item.height}cm</span>}
                        {item.weight && <span> | Weight: {item.weight}kg</span>}
                        {item.salaryIndex && (
                          <span>
                            {" "}
                            | Hourly Rate: {item.salaryIndex.toLocaleString()}{" "}
                            VND/h
                          </span>
                        )}
                      </p>
                      <p>
                        Character <strong>{item.characterName}</strong> Price:{" "}
                        {item.characterPrice.toLocaleString()} VND
                      </p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Description: {item.description}</p>
                    </div>
                    <Button
                      onClick={() =>
                        handleChangeCosplayer(
                          item.characterId,
                          item.cosplayerId,
                          index
                        )
                      }
                    >
                      Change Cosplayer
                    </Button>
                  </div>
                  <h5 style={{ marginBottom: "5px" }}>Request Dates:</h5>
                  <List
                    dataSource={item.listUpdateRequestDates}
                    renderItem={(date, dateIndex) => (
                      <List.Item
                        key={dateIndex}
                        style={{ padding: "5px 0", borderBottom: "none" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                        >
                          <span>
                            {date.startDate} - {date.endDate} (Total Hours:{" "}
                            {date.totalHour || 0})
                          </span>
                        </div>
                      </List.Item>
                    )}
                    style={{ marginLeft: "20px" }}
                  />
                </div>
              </List.Item>
            )}
          />
          <Modal
            title="Change Cosplayer"
            open={changeCosplayerVisible}
            onOk={() => setChangeCosplayerVisible(false)}
            onCancel={() => setChangeCosplayerVisible(false)}
            okText="Close"
            cancelText="Cancel"
            footer={
              <>
                <Button
                  onClick={() =>
                    handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                  }
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={() =>
                    handlePageChange(
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    )
                  }
                >
                  Next
                </Button>
                <Button
                  className="btn btn-outline-danger"
                  onClick={() => handleSort("salaryIndex")}
                  style={{ marginBottom: "5px" }}
                >
                  Hourly Salary{" "}
                  {sortField === "salaryIndex" &&
                    (sortOrder === "ascend" ? "↑" : "↓")}
                </Button>
              </>
            }
          >
            <List
              dataSource={paginatedCosplayers}
              renderItem={(cosplayer) => (
                <List.Item
                  key={cosplayer.accountId}
                  onClick={() => handleCosplayerSelect(cosplayer.accountId)}
                  style={{ cursor: "pointer" }}
                >
                  <span>{cosplayer.name}</span>
                  <span> | ⭐ {cosplayer.averageStar}/5</span>
                  <span> | 📏 {cosplayer.height}cm</span>
                  <span> | ⚖️ {cosplayer.weight}kg</span>
                  <span>
                    {" "}
                    | 🪙 {cosplayer.salaryIndex.toLocaleString()}VND/h
                  </span>
                </List.Item>
              )}
            />
          </Modal>
        </>
      )}
    </Modal>
  );
};

export default EditRequestHireCosplayer;
