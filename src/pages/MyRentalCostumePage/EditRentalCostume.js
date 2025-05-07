import React, { useState, useEffect } from "react";
import { Form, Card, Row, Col } from "react-bootstrap";
import {
  Modal,
  Input,
  DatePicker,
  Pagination,
  Image,
  Select,
  Spin,
} from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";

const { TextArea } = Input;
const { Option } = Select;

const EditRentalCostume = ({
  visible,
  onCancel,
  onSubmit,
  modalData,
  setModalData,
  selectedRequestId,
  currentCharacterPage,
  setCurrentCharacterPage,
  charactersPerPage = 2,
}) => {
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [characterLoading, setCharacterLoading] = useState({});
  const [deposit, setDeposit] = useState(0); // Thêm state cho deposit

  // Tính deposit dựa trên danh sách characters
  const calculateDeposit = (characters) => {
    return characters.reduce((sum, char) => {
      const characterPrice = char.price || 0;
      return sum + characterPrice * (char.quantity || 0) * 5;
    }, 0);
  };

  // Gọi API chooseDeposit
  const updateDeposit = async (requestId, depositValue) => {
    try {
      const payload = { deposit: depositValue.toString() };
      const response = await MyRentalCostumeService.chooseDeposit(
        requestId,
        payload
      );
      return response;
    } catch (error) {
      toast.error(
        "Failed to update deposit: " + (error.message || "Unknown error")
      );
      throw error;
    }
  };

  // Lấy danh sách characters và chi tiết request khi modal mở
  useEffect(() => {
    if (visible && selectedRequestId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const allCharactersData =
            await MyRentalCostumeService.getAllCharacters();
          setAllCharacters(allCharactersData);

          const requestData =
            await MyRentalCostumeService.getRequestByRequestId(
              selectedRequestId
            );
          const charactersList = requestData.charactersListResponse || [];

          const characterDetailsPromises = charactersList.map(async (char) => {
            try {
              const characterDetails =
                await MyRentalCostumeService.getCharacterById(char.characterId);
              return {
                requestCharacterId: char.requestCharacterId || "",
                characterId: String(char.characterId || ""),
                characterName:
                  characterDetails.characterName ||
                  char.characterName ||
                  "Unknown",
                description:
                  char.description || characterDetails.description || "",
                quantity: char.quantity || 1,
                maxQuantity: characterDetails.quantity || char.quantity || 1,
                price: characterDetails.price || 0,
                maxHeight: characterDetails.maxHeight || char.maxHeight || 0,
                maxWeight: characterDetails.maxWeight || char.maxWeight || 0,
                minHeight: characterDetails.minHeight || char.minHeight || 0,
                minWeight: characterDetails.minWeight || char.minWeight || 0,
                urlImage:
                  characterDetails.images?.[0]?.urlImage ||
                  char.characterImages?.[0]?.urlImage ||
                  "",
              };
            } catch (error) {
              toast.error(
                `Failed to fetch details for character ${char.characterName}: ${error.message}`
              );
              return {
                requestCharacterId: char.requestCharacterId || "",
                characterId: String(char.characterId || ""),
                characterName: char.characterName || "Unknown",
                description: char.description || "",
                quantity: char.quantity || 1,
                maxQuantity: char.quantity || 1,
                price: 0,
                maxHeight: char.maxHeight || 0,
                maxWeight: char.maxWeight || 0,
                minHeight: char.minHeight || 0,
                minWeight: char.minWeight || 0,
                urlImage: char.characterImages?.[0]?.urlImage || "",
              };
            }
          });

          const characterDetails = await Promise.all(characterDetailsPromises);

          // Tính deposit ban đầu
          const initialDeposit = calculateDeposit(characterDetails);

          setModalData({
            name: requestData.name || "Unnamed Request",
            description: requestData.description || "",
            location: requestData.location || "",
            startDate: requestData.startDate
              ? dayjs(requestData.startDate, [
                  "HH:mm DD/MM/YYYY",
                  "DD/MM/YYYY",
                  "YYYY-MM-DD",
                ])
              : null,
            endDate: requestData.endDate
              ? dayjs(requestData.endDate, [
                  "HH:mm DD/MM/YYYY",
                  "DD/MM/YYYY",
                  "YYYY-MM-DD",
                ])
              : null,
            characters: characterDetails,
            fullRequestData: requestData,
          });

          setDeposit(initialDeposit);
        } catch (error) {
          toast.error(
            "Failed to fetch data: " + (error.message || "Unknown error")
          );
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [visible, selectedRequestId, setModalData]);

  const handleCharacterChange = async (requestCharacterId, field, value) => {
    if (field === "characterId") {
      const isDuplicate = modalData.characters.some(
        (char) =>
          char.characterId === value &&
          char.requestCharacterId !== requestCharacterId
      );
      if (isDuplicate) {
        toast.error("This character is already selected!");
        return;
      }

      setCharacterLoading((prev) => ({ ...prev, [requestCharacterId]: true }));

      try {
        const characterDetails = await MyRentalCostumeService.getCharacterById(
          value
        );

        setModalData((prev) => {
          const updatedCharacters = prev.characters.map((char) =>
            char.requestCharacterId === requestCharacterId
              ? {
                  ...char,
                  characterId: String(value),
                  characterName: characterDetails.characterName || "Unknown",
                  description:
                    char.description || characterDetails.description || "",
                  price: characterDetails.price || 0,
                  maxQuantity: characterDetails.quantity || 1,
                  maxHeight: characterDetails.maxHeight || 0,
                  maxWeight: characterDetails.maxWeight || 0,
                  minHeight: characterDetails.minHeight || 0,
                  minWeight: characterDetails.minWeight || 0,
                  urlImage: characterDetails.images?.[0]?.urlImage || "",
                }
              : char
          );

          // Tính lại deposit sau khi thay đổi character
          const newDeposit = calculateDeposit(updatedCharacters);
          setDeposit(newDeposit);

          // Gọi API chooseDeposit
          updateDeposit(selectedRequestId, newDeposit);

          return { ...prev, characters: updatedCharacters };
        });
      } catch (error) {
        toast.error(`Failed to fetch character details: ${error.message}`);
      } finally {
        setCharacterLoading((prev) => ({
          ...prev,
          [requestCharacterId]: false,
        }));
      }
    } else {
      setModalData((prev) => {
        const updatedCharacters = prev.characters.map((char) =>
          char.requestCharacterId === requestCharacterId
            ? {
                ...char,
                [field]:
                  field === "quantity"
                    ? Math.min(
                        Number(value) > 0 ? Number(value) : 0,
                        char.maxQuantity || Number.MAX_SAFE_INTEGER
                      )
                    : value,
              }
            : char
        );

        // Tính lại deposit sau khi thay đổi quantity
        const newDeposit = calculateDeposit(updatedCharacters);
        setDeposit(newDeposit);

        // Gọi API chooseDeposit
        updateDeposit(selectedRequestId, newDeposit);

        return { ...prev, characters: updatedCharacters };
      });
    }
  };

  const handleDateChange = (field, date) => {
    setModalData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleLocationChange = (e) => {
    setModalData((prev) => ({
      ...prev,
      location: e.target.value,
    }));
  };

  const calculateTotalPrice = () => {
    const totalDays =
      modalData.endDate && modalData.startDate
        ? modalData.endDate.diff(modalData.startDate, "day") + 1
        : 1;
    return modalData.characters.reduce((sum, char) => {
      const characterPrice = char.price || 0;
      return sum + characterPrice * char.quantity * totalDays;
    }, 0);
  };

  const calculateCharacterPrice = (char) => {
    const totalDays =
      modalData.endDate && modalData.startDate
        ? modalData.endDate.diff(modalData.startDate, "day") + 1
        : 1;
    const characterPrice = char.price || 0;
    return characterPrice * char.quantity * totalDays;
  };

  const handleSubmit = async () => {
    const { characters, startDate, endDate, description, location } = modalData;

    if (!startDate || !endDate) {
      toast.error("Start Date and End Date are required!");
      return;
    }
    if (endDate.isBefore(startDate)) {
      toast.error("End Date must be on or after Start Date!");
      return;
    }
    if (endDate.diff(startDate, "day") > 5) {
      toast.error("The rental period cannot exceed 5 days!");
      return;
    }
    if (!location) {
      toast.error("Location is required!");
      return;
    }
    if (characters.length === 0) {
      toast.error("At least one character is required!");
      return;
    }
    for (const char of characters) {
      if (!char.characterId || typeof char.characterId !== "string") {
        toast.error(`Invalid character ID for ${char.characterName}!`);
        return;
      }
      if (char.quantity <= 0) {
        toast.error(`Quantity for ${char.characterName} must be positive!`);
        return;
      }
      if (char.quantity > (char.maxQuantity || Number.MAX_SAFE_INTEGER)) {
        toast.error(
          `Quantity for ${char.characterName} exceeds available stock (${char.maxQuantity})!`
        );
        return;
      }
    }

    try {
      const formattedStartDate = startDate.format("DD/MM/YYYY");
      const formattedEndDate = endDate.format("DD/MM/YYYY");

      if (
        formattedStartDate === "Invalid Date" ||
        formattedEndDate === "Invalid Date"
      ) {
        toast.error("Invalid date format!");
        return;
      }

      const totalDays = endDate.diff(startDate, "day") + 1;
      const totalPrice = characters.reduce((sum, char) => {
        const characterPrice = char.price || 0;
        return sum + characterPrice * char.quantity * totalDays;
      }, 0);

      const updatedData = {
        name: modalData.fullRequestData.name || "Unnamed Request",
        description: description || "",
        price: totalPrice,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        location: location || modalData.fullRequestData.location || "",
        serviceId: modalData.fullRequestData.serviceId || "S001",
        packageId: null,
        listUpdateRequestCharacters: characters.map((char) => ({
          requestCharacterId: char.requestCharacterId || "",
          characterId: String(char.characterId),
          cosplayerId: null,
          description: char.description || "",
          quantity: char.quantity,
        })),
      };

      console.log("Payload sent to API:", JSON.stringify(updatedData, null, 2));

      const response = await MyRentalCostumeService.editRequest(
        selectedRequestId,
        updatedData
      );

      // Truyền deposit cùng response
      onSubmit(
        response,
        totalPrice,
        formattedStartDate,
        formattedEndDate,
        deposit
      );
      toast.success("Costumes updated successfully!");
      onCancel();
    } catch (error) {
      console.error("Error updating request:", error);
      toast.error(
        error.response?.data?.title ||
          error.response?.data?.message ||
          "Failed to update costumes. Please try again."
      );
    }
  };

  return (
    <Modal
      title="Edit Costume Request"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Submit"
      width={800}
      confirmLoading={loading}
    >
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Input value={modalData.name} readOnly />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <TextArea
            value={modalData.description}
            onChange={(e) =>
              setModalData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Input
            value={modalData.location}
            onChange={handleLocationChange}
            placeholder="Enter location"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <DatePicker
            value={modalData.startDate}
            format="DD/MM/YYYY"
            onChange={(date) => handleDateChange("startDate", date)}
            style={{ width: "100%" }}
            placeholder="Select start date"
            disabled
            disabledDate={(current) =>
              current && current <= dayjs().endOf("day")
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <DatePicker
            value={modalData.endDate}
            format="DD/MM/YYYY"
            onChange={(date) => handleDateChange("endDate", date)}
            style={{ width: "100%" }}
            placeholder="Select end date"
            disabled
            disabledDate={(current) =>
              current &&
              (current < modalData.startDate ||
                (modalData.startDate &&
                  current > modalData.startDate.add(5, "day")))
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Deposit</Form.Label>
          <Input value={deposit.toLocaleString()} readOnly />
        </Form.Group>
        <h5>Costumes</h5>
        {modalData.characters.length === 0 ? (
          <p>No costumes found.</p>
        ) : (
          <>
            {modalData.characters
              .slice(
                (currentCharacterPage - 1) * charactersPerPage,
                currentCharacterPage * charactersPerPage
              )
              .map((char) => (
                <Card key={char.requestCharacterId} className="mb-3">
                  <Card.Body>
                    <Spin
                      spinning={!!characterLoading[char.requestCharacterId]}
                    >
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Costume</Form.Label>
                            <Select
                              value={char.characterId}
                              onChange={(value) =>
                                handleCharacterChange(
                                  char.requestCharacterId,
                                  "characterId",
                                  value
                                )
                              }
                              style={{ width: "100%" }}
                              placeholder="Select costume"
                            >
                              {allCharacters.map((character) => (
                                <Option
                                  key={character.characterId}
                                  value={character.characterId}
                                >
                                  {character.characterName} (Price:{" "}
                                  {character.price})
                                </Option>
                              ))}
                            </Select>
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Input
                              value={char.description}
                              onChange={(e) =>
                                handleCharacterChange(
                                  char.requestCharacterId,
                                  "description",
                                  e.target.value
                                )
                              }
                              placeholder="Enter description"
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxHeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Max Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.maxWeight}
                              readOnly
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Height (cm)</Form.Label>
                            <Input
                              type="number"
                              value={char.minHeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Min Weight (kg)</Form.Label>
                            <Input
                              type="number"
                              value={char.minWeight}
                              readOnly
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Quantity (Max: {char.maxQuantity})
                            </Form.Label>
                            <Input
                              type="number"
                              value={char.quantity}
                              onChange={(e) =>
                                handleCharacterChange(
                                  char.requestCharacterId,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              placeholder="Enter quantity"
                              min={1}
                              max={char.maxQuantity || 10}
                            />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Price for this Costume in all days
                            </Form.Label>
                            <Input
                              value={calculateCharacterPrice(char)}
                              readOnly
                            />
                          </Form.Group>
                          {char.urlImage && (
                            <Image
                              src={char.urlImage}
                              alt="Costume Preview"
                              width={100}
                              preview
                              style={{ display: "block", marginTop: "10px" }}
                            />
                          )}
                        </Col>
                      </Row>
                    </Spin>
                  </Card.Body>
                </Card>
              ))}
            <Form.Group className="mb-3">
              <Form.Label>Total Price</Form.Label>
              <Input value={calculateTotalPrice()} readOnly />
            </Form.Group>
            <Pagination
              current={currentCharacterPage}
              pageSize={charactersPerPage}
              total={modalData.characters.length}
              onChange={(page) => setCurrentCharacterPage(page)}
              showSizeChanger={false}
              style={{ textAlign: "right" }}
            />
          </>
        )}
      </Form>
    </Modal>
  );
};

export default EditRentalCostume;
