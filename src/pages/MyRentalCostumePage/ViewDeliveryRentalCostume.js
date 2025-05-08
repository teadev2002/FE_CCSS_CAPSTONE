import React, { useState, useEffect } from "react";
import { Modal, Card, Row, Col, Image, Steps, Spin, Button } from "antd";
import { toast } from "react-toastify";
import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";
import "../../styles/ViewMyRentalCostume.scss";
import dayjs from "dayjs";

const { Step } = Steps;

const ViewDeliveryRentalCostume = ({ visible, onCancel, contractId }) => {
  const [loading, setLoading] = useState(false);
  const [deliveryImages, setDeliveryImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // List of possible statuses from the DeliveryStatus enum
  const statusOrder = [
    "Preparing",
    "Delivering",
    "UnReceived",
    "Received",
    "Refund",
    "Cancel",
  ];

  // Fetch image data and delivery status
  useEffect(() => {
    const fetchDeliveryImages = async () => {
      if (!contractId) return;

      setLoading(true);
      try {
        const images = [];
        for (const status of statusOrder) {
          const response =
            await MyRentalCostumeService.getContractImageAndStatus(
              contractId,
              status
            );
          if (response && response.length > 0) {
            images.push(
              ...response.map((item) => ({
                ...item,
                status,
              }))
            );
          }
        }

        const sortedImages = images.sort((a, b) =>
          dayjs(a.createDate, "DD/MM/YYYY").isBefore(
            dayjs(b.createDate, "DD/MM/YYYY")
          )
            ? -1
            : 1
        );
        setDeliveryImages(sortedImages);

        const latestStatus = sortedImages[sortedImages.length - 1]?.status;
        const currentIndex = statusOrder.indexOf(latestStatus);
        setCurrentStep(currentIndex >= 0 ? currentIndex : 0);
      } catch (error) {
        console.error("Unable to load delivery information!");
        toast.error("Unable to load delivery information!");
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchDeliveryImages();
    }
  }, [visible, contractId]);

  // Always display Preparing, along with statuses that have data
  const filteredStatusOrder = Array.from(
    new Set([
      "Preparing",
      ...statusOrder.filter((status) =>
        deliveryImages.some((img) => img.status === status)
      ),
    ])
  ).sort((a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b));

  const stepItems = filteredStatusOrder.map((status, index) => {
    const imagesForStatus = deliveryImages.filter(
      (img) => img.status === status
    );
    // Get the earliest createDate for the status
    const earliestDate =
      imagesForStatus.length > 0
        ? imagesForStatus.reduce((earliest, img) =>
            dayjs(img.createDate, "DD/MM/YYYY").isBefore(
              dayjs(earliest.createDate, "DD/MM/YYYY")
            )
              ? img
              : earliest
          ).createDate
        : null;

    return {
      title: status,
      description: (
        <div>
          {earliestDate && <p>{earliestDate}</p>}
          {imagesForStatus.map((img, idx) => (
            <Image
              key={idx}
              src={img.urlImage}
              alt={`Image for ${status}`}
              width={100}
              style={{ marginRight: "10px", marginTop: "10px" }}
            />
          ))}
          {imagesForStatus.length === 0 && <p>Costume is being prepared.</p>}
        </div>
      ),
    };
  });

  return (
    <Modal
      title="View Delivery Information"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={800}
    >
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Card>
          <Row>
            <Col span={24}>
              <Steps current={currentStep} items={stepItems} />
            </Col>
          </Row>
        </Card>
      )}
    </Modal>
  );
};

export default ViewDeliveryRentalCostume;
