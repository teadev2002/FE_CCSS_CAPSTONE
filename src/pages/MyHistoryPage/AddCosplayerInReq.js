import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Input,
  List,
  Button,
  Pagination,
  Spin,
  Alert,
} from "antd";
import { toast } from "react-toastify";
import MyHistoryService from "../../services/HistoryService/MyHistoryService";

const { TextArea } = Input;
const { Option } = Select;

const AddCosplayerInReq = ({ visible, requestId, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [filteredCosplayers, setFilteredCosplayers] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedCosplayerId, setSelectedCosplayerId] = useState(null); // New state for visual feedback
  const [requestDates, setRequestDates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("averageStar");
  const [sortOrder, setSortOrder] = useState("desc");
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const cosplayerPageSize = 5;

  // Fetch characters and request dates on modal open
  useEffect(() => {
    if (!visible) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch characters
        const charactersData = await MyHistoryService.getAllCharacters();
        const mappedCharacters = charactersData.map((character) => ({
          id: character.characterId,
          name: character.characterName,
          minHeight: character.minHeight,
          maxHeight: character.maxHeight,
          minWeight: character.minWeight,
          maxWeight: character.maxWeight,
          price: character.price,
          quantity: character.quantity,
        }));
        setCharacters(mappedCharacters);

        // Fetch request dates
        const requestData = await MyHistoryService.getRequestByRequestId(
          requestId
        );
        if (
          !requestData.charactersListResponse ||
          requestData.charactersListResponse.length === 0
        ) {
          throw new Error("No existing characters found in the request.");
        }

        // Extract requestDateResponses
        const dates =
          requestData.charactersListResponse[0].requestDateResponses;
        setRequestDates(
          dates.map((date) => ({
            startDate: date.startDate,
            endDate: date.endDate,
            totalHour: date.totalHour,
          }))
        );
      } catch (err) {
        setError(err.message || "Unable to load data. Please try again later.");
        toast.error(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visible, requestId]);

  // Fetch cosplayers when character is selected
  const fetchCosplayers = async (characterName) => {
    if (!characterName || requestDates.length === 0) {
      setFilteredCosplayers([]);
      return;
    }

    setLoading(true);
    try {
      const startDateTime = requestDates[0].startDate;
      const endDateTime = requestDates[requestDates.length - 1].endDate;

      const cosplayersData =
        await MyHistoryService.getAccountByCharacterNameNDate(
          characterName,
          startDateTime,
          endDateTime
        );

      const mappedCosplayers = cosplayersData.map((cosplayer) => ({
        id: cosplayer.accountId,
        name: cosplayer.name,
        description: cosplayer.description || "No description",
        height: cosplayer.height || 0, // Default to 0 if missing
        weight: cosplayer.weight || 0, // Default to 0 if missing
        salaryIndex: cosplayer.salaryIndex || 0,
        averageStar: cosplayer.averageStar || 0,
      }));

      const requestData = await MyHistoryService.getRequestByRequestId(
        requestId
      );
      const existingCosplayerIds = new Set(
        requestData.charactersListResponse
          ?.map((char) => char.cosplayerId)
          .filter(Boolean)
      );

      const character = characters.find((char) => char.name === characterName);

      // Relaxed filtering to handle missing data
      const filtered = mappedCosplayers.filter(
        (cosplayer) =>
          !existingCosplayerIds.has(cosplayer.id) &&
          (!character.minHeight || cosplayer.height >= character.minHeight) &&
          (!character.maxHeight || cosplayer.height <= character.maxHeight) &&
          (!character.minWeight || cosplayer.weight >= character.minWeight) &&
          (!character.maxWeight || cosplayer.weight <= character.maxWeight)
      );

      setFilteredCosplayers(filtered);
      if (filtered.length === 0) {
        setError(
          "No cosplayers available for this character and time range. Try adjusting the character or dates."
        );
      } else {
        setError(null);
      }
    } catch (err) {
      setError("Unable to load cosplayers. Please try again later.");
      toast.error("Failed to load cosplayers.");
      setFilteredCosplayers([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle character selection
  const handleCharacterSelect = (characterId) => {
    const character = characters.find((char) => char.id === characterId);
    setSelectedCharacter(character);
    setSelectedCosplayerId(null); // Reset cosplayer selection
    setFilteredCosplayers([]);
    fetchCosplayers(character.name);
    setStep(2);
    form.resetFields([
      "cosplayerId",
      "cosplayerName",
      "description",
      "quantity",
    ]);
  };

  // Handle cosplayer selection
  const handleCosplayerSelect = (cosplayerId) => {
    console.log("Selected cosplayer ID:", cosplayerId); // Debug log
    const cosplayer = filteredCosplayers.find((c) => c.id === cosplayerId);
    if (cosplayer) {
      setSelectedCosplayerId(cosplayerId); // Update state for visual feedback
      form.setFieldsValue({
        cosplayerId: cosplayer.id,
        cosplayerName: cosplayer.name,
      });
      console.log("Form updated with:", {
        cosplayerId: cosplayer.id,
        cosplayerName: cosplayer.name,
      }); // Debug log
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values); // Debug log

      const addRequestDates = requestDates.map((date) => ({
        startDate: date.startDate,
        endDate: date.endDate,
      }));

      const payload = {
        requestId,
        characterId: selectedCharacter.id,
        description: values.description || "No description",
        cosplayerId: values.cosplayerId,
        quantity: values.quantity || 1,
        addRequestDates,
      };

      setLoading(true);
      const response = await MyHistoryService.AddCosplayer(payload);
      toast.success(response?.message || "Cosplayer added successfully!");
      onSuccess();
      onCancel();
    } catch (error) {
      console.error("Submission error:", error); // Debug log
      toast.error(error.message || "Failed to add cosplayer.");
    } finally {
      setLoading(false);
    }
  };

  // Sorting cosplayers
  useEffect(() => {
    if (filteredCosplayers.length > 0) {
      const sortedCosplayers = [...filteredCosplayers].sort((a, b) => {
        const valueA = a[sortBy] || 0;
        const valueB = b[sortBy] || 0;
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      });
      setFilteredCosplayers(sortedCosplayers);
    }
  }, [sortBy, sortOrder, filteredCosplayers.length]);

  // Pagination
  const paginatedCosplayers = filteredCosplayers.slice(
    (currentPage - 1) * cosplayerPageSize,
    currentPage * cosplayerPageSize
  );
  const totalPages = Math.ceil(filteredCosplayers.length / cosplayerPageSize);

  return (
    <Modal
      title="Add Cosplayer to Request"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Add Cosplayer"
      cancelText="Cancel"
      confirmLoading={loading}
      width={800}
    >
      {loading ? (
        <Spin tip="Loading..." />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <Form form={form} layout="vertical">
          {step >= 1 && (
            <Form.Item
              label="Select Character"
              name="characterId"
              rules={[{ required: true, message: "Please select a character" }]}
            >
              <Select
                placeholder="Select a character"
                onChange={handleCharacterSelect}
              >
                {characters.map((char) => (
                  <Option key={char.id} value={char.id}>
                    Name: {char.name} | Quantity: {char.quantity} | 💲{" "}
                    {char.price.toLocaleString()} | 📏 {char.minHeight} cm
                    {" - "}
                    {char.maxHeight} | ⚖️ {char.minWeight} {" - "}{" "}
                    {char.maxWeight} kg
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {step >= 2 && selectedCharacter && (
            <>
              <Form.Item label="Select Cosplayer">
                {filteredCosplayers.length > 0 ? (
                  <>
                    <div style={{ marginBottom: "16px" }}>
                      <Select
                        value={sortBy}
                        onChange={(value) => setSortBy(value)}
                        style={{ width: 150, marginRight: "8px" }}
                      >
                        <Option value="averageStar">Rating</Option>
                        <Option value="salaryIndex">Hourly Rate</Option>
                        <Option value="height">Height</Option>
                        <Option value="weight">Weight</Option>
                      </Select>
                      <Select
                        value={sortOrder}
                        onChange={(value) => setSortOrder(value)}
                        style={{ width: 120 }}
                      >
                        <Option value="asc">Ascending</Option>
                        <Option value="desc">Descending</Option>
                      </Select>
                    </div>

                    <List
                      dataSource={paginatedCosplayers}
                      renderItem={(cosplayer) => (
                        <List.Item
                          key={cosplayer.id}
                          style={{
                            cursor: "pointer",
                            padding: "12px 10px",
                            borderBottom: "1px solid #f0f0f0",
                            backgroundColor:
                              cosplayer.id === selectedCosplayerId
                                ? "#e6f7ff"
                                : "transparent",
                            transition: "background-color 0.2s",
                          }}
                          onClick={() => handleCosplayerSelect(cosplayer.id)}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
                              gap: "16px",
                              width: "100%",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {cosplayer.name}
                            </div>
                            <div>⭐ {cosplayer.averageStar}/5</div>
                            <div>📏 {cosplayer.height}cm</div>
                            <div>⚖️ {cosplayer.weight}kg</div>
                            <div>
                              💲 {cosplayer.salaryIndex.toLocaleString()} VND/h
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                    <Pagination
                      current={currentPage}
                      pageSize={cosplayerPageSize}
                      total={filteredCosplayers.length}
                      onChange={setCurrentPage}
                      style={{ marginTop: "16px", textAlign: "center" }}
                    />
                  </>
                ) : (
                  <Alert
                    message="No cosplayers available for this character and time range."
                    type="warning"
                    showIcon
                  />
                )}
              </Form.Item>
              <Form.Item
                name="cosplayerId"
                hidden
                rules={[
                  { required: true, message: "Please select a cosplayer" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Selected Cosplayer" name="cosplayerName">
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="quantity"
                label="Quantity"
                initialValue={1}
                rules={[{ required: true, message: "Please enter quantity" }]}
              >
                <Input type="number" min={1} />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={4} placeholder="Enter description" />
              </Form.Item>
            </>
          )}
        </Form>
      )}
    </Modal>
  );
};

export default AddCosplayerInReq;
