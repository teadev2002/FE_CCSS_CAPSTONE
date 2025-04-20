// hiển thị deposit trong costume modal
import React, { useState, useEffect } from "react";
import { Modal, Card, Row, Col, Image, Collapse, Pagination } from "antd";
import { DollarSign, Calendar } from "lucide-react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";
import "../../styles/ViewMyRentalCostume.scss";

const { Panel } = Collapse;

const ViewMyRentalCostume = ({
  visible,
  onCancel,
  requestId,
  getRequestByRequestId,
}) => {
  const [loading, setLoading] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // 3 costumes per page

  // Date formatting function
  const formatDate = (date) => {
    if (!date || date === "null" || date === "undefined" || date === "") {
      return "N/A";
    }

    const formats = [
      "DD/MM/YYYY",
      "HH:mm DD/MM/YYYY",
      "YYYY-MM-DD",
      "YYYY/MM/DD",
      "MM/DD/YYYY",
      "HH:mm DD-MM-YYYY",
      "D/M/YYYY",
      "DD/M/YYYY",
      "D/MM/YYYY",
    ];

    const parsedDate = dayjs(date, formats, true);
    return parsedDate.isValid()
      ? parsedDate.format("DD/MM/YYYY")
      : "Invalid Date";
  };

  // Fetch request and character data when modal opens
  useEffect(() => {
    if (visible && requestId) {
      setLoading(true);
      getRequestByRequestId(requestId)
        .then(async (data) => {
          // Fetch detailed information for each character
          const enrichedCharacters = await Promise.all(
            (data.charactersListResponse || []).map(async (char) => {
              try {
                const characterData =
                  await MyRentalCostumeService.getCharacterById(
                    char.characterId
                  );
                return {
                  ...char,
                  characterName: characterData.characterName || "N/A",
                  price: characterData.price || 0,
                  maxHeight: characterData.maxHeight || "N/A",
                  maxWeight: characterData.maxWeight || "N/A",
                  minHeight: characterData.minHeight || "N/A",
                  minWeight: characterData.minWeight || "N/A",
                  description:
                    characterData.description || char.description || "N/A",
                  characterImages:
                    characterData.images || char.characterImages || [],
                };
              } catch (error) {
                console.error(
                  `Error fetching character ${char.characterId}:`,
                  error
                );
                return {
                  ...char,
                  characterName: "N/A",
                  price: 0,
                  maxHeight: "N/A",
                  maxWeight: "N/A",
                  minHeight: "N/A",
                  minWeight: "N/A",
                  description: char.description || "N/A",
                  characterImages: char.characterImages || [],
                };
              }
            })
          );

          setRequestData({
            ...data,
            charactersListResponse: enrichedCharacters,
          });
          setLoading(false);
          setCurrentPage(1); // Reset to first page when new data is loaded
        })
        .catch((error) => {
          console.error("Error fetching request details:", error);
          setLoading(false);
        });
    }
  }, [visible, requestId, getRequestByRequestId]);

  // Pagination function
  const paginate = (data, page, perPage) => {
    const start = (page - 1) * perPage;
    return data.slice(start, start + perPage);
  };

  if (!requestData) return null;

  const {
    name,
    description,
    deposit,
    startDate,
    endDate,
    totalDate,
    charactersListResponse,
  } = requestData;

  // Calculate total price of all costumes
  const totalPriceAllCostumes = charactersListResponse.reduce((sum, char) => {
    const price =
      char.price && char.quantity && totalDate && !isNaN(totalDate)
        ? char.price * char.quantity * parseInt(totalDate)
        : 0;
    return sum + price;
  }, 0);

  const currentItems = paginate(
    charactersListResponse,
    currentPage,
    itemsPerPage
  );

  return (
    <Modal
      title="Request Details"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      loading={loading}
    >
      <div className="request-details">
        <Row gutter={[16, 16]}>
          <Col md={6}>
            <div className="detail-item">
              <strong>Request Name:</strong>
              <p>{name || "N/A"}</p>
            </div>
            <div className="detail-item">
              <strong>Description:</strong>
              <p>{description || "N/A"}</p>
            </div>
            <div className="detail-item">
              <strong>Deposit (VND):</strong>
              <p>
                <DollarSign size={16} style={{ marginRight: 8 }} />
                {deposit ? parseInt(deposit).toLocaleString() : "0"}
              </p>
            </div>
            <div className="detail-item">
              <strong>
                Total Hire Price of All Costumes in {totalDate || "N/A"} days
                (VND):
              </strong>
              <p>
                <DollarSign size={16} style={{ marginRight: 8 }} />
                {totalPriceAllCostumes
                  ? totalPriceAllCostumes.toLocaleString()
                  : "0"}
              </p>
            </div>
          </Col>
          <Col md={6}>
            <div className="detail-item">
              <strong>Start Date:</strong>
              <p>
                <Calendar size={16} style={{ marginRight: 8 }} />
                {formatDate(startDate)}
              </p>
            </div>
            <div className="detail-item">
              <strong>End Date:</strong>
              <p>
                <Calendar size={16} style={{ marginRight: 8 }} />
                {formatDate(endDate)}
              </p>
            </div>
            <div className="detail-item">
              <strong>Total Days:</strong>
              <p>{totalDate || "N/A"}</p>
            </div>
          </Col>
        </Row>
        <h5>Costumes</h5>
        {charactersListResponse?.length === 0 ? (
          <p>No costumes found.</p>
        ) : (
          <>
            <Collapse accordion>
              {currentItems.map((char) => {
                // Calculate total price for each costume
                const totalPrice =
                  char.price && char.quantity && totalDate && !isNaN(totalDate)
                    ? char.price * char.quantity * parseInt(totalDate)
                    : 0;

                // Calculate deposit for each costume: (price * 5) * quantity
                const characterDeposit =
                  char.price && char.quantity
                    ? char.price * 5 * char.quantity
                    : 0;

                return (
                  <Panel
                    header={`Character: ${char.characterName} (Quantity: ${char.quantity})`}
                    key={char.characterId}
                  >
                    <Card>
                      <Row gutter={[16, 16]}>
                        {/* Cột 1: Description, Max Height */}
                        <Col md={8}>
                          <div className="detail-item">
                            <strong>Description:</strong>
                            <p>{char.description || "N/A"}</p>
                          </div>

                          <div className="detail-item">
                            <strong>Quantity:</strong>
                            <p>{char.quantity || "0"}</p>
                          </div>
                          {char.characterImages?.[0]?.urlImage && (
                            <div className="detail-item">
                              {/* <strong>Image:</strong> */}
                              <Image
                                src={char.characterImages[0].urlImage}
                                alt="Character Preview"
                                width={100}
                                preview
                                style={{ display: "block", marginTop: "10px" }}
                              />
                            </div>
                          )}
                        </Col>

                        {/* Cột 2: Min Height, Max Weight, Min Weight, Quantity, Image */}
                        <Col md={8}>
                          <div className="detail-item">
                            <strong>Max Height (cm):</strong>
                            <p>{char.maxHeight || "N/A"}</p>
                          </div>
                          <div className="detail-item">
                            <strong>Min Height (cm):</strong>
                            <p>{char.minHeight || "N/A"}</p>
                          </div>
                          <div className="detail-item">
                            <strong>Max Weight (kg):</strong>
                            <p>{char.maxWeight || "N/A"}</p>
                          </div>
                          <div className="detail-item">
                            <strong>Min Weight (kg):</strong>
                            <p>{char.minWeight || "N/A"}</p>
                          </div>
                        </Col>

                        {/* Cột 3: Rental Price / Day, Deposit, Total Hire Price */}
                        <Col md={8}>
                          <div className="detail-item">
                            <strong>Rental Price / Day:</strong>
                            <p>
                              <DollarSign
                                size={16}
                                style={{ marginRight: 8 }}
                              />
                              {char.price ? char.price.toLocaleString() : "0"}{" "}
                              (VND)
                            </p>
                          </div>
                          <div className="detail-item">
                            <strong>Deposit:</strong>
                            <p>
                              <DollarSign
                                size={16}
                                style={{ marginRight: 8 }}
                              />
                              {characterDeposit
                                ? characterDeposit.toLocaleString()
                                : "0"}{" "}
                              (VND)
                            </p>
                          </div>
                          <div className="detail-item">
                            <strong>
                              Total Hire Price in {totalDate || "N/A"} days:
                            </strong>
                            <p>
                              <DollarSign
                                size={16}
                                style={{ marginRight: 8 }}
                              />
                              {totalPrice ? totalPrice.toLocaleString() : "0"}{" "}
                              (VND)
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </Panel>
                );
              })}
            </Collapse>
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={charactersListResponse.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
              style={{ marginTop: "20px", textAlign: "right" }}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

ViewMyRentalCostume.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  requestId: PropTypes.string,
  getRequestByRequestId: PropTypes.func.isRequired,
};

export default ViewMyRentalCostume;
