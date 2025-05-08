// hiển thị thêm cancel
// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   Card,
//   Row,
//   Col,
//   Image,
//   Steps,
//   Spin,
//   Button,
//   Select,
//   Input,
//   Form,
//   Upload,
// } from "antd";
// import { toast } from "react-toastify";
// import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
// import "../../../styles/ViewMyRentalCostume.scss";
// import dayjs from "dayjs";
// import { UploadOutlined } from "@ant-design/icons";

// const { Step } = Steps;
// const { Option } = Select;

// const ManageDeliveryRentalCostume = ({ visible, onCancel, contractId }) => {
//   const [loading, setLoading] = useState(false);
//   const [deliveryImages, setDeliveryImages] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [updateModalVisible, setUpdateModalVisible] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState(null);
//   const [reason, setReason] = useState("");
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [form] = Form.useForm();

//   const statusOrder = [
//     "Preparing",
//     "Delivering",
//     "UnReceived",
//     "Received",
//     "Refund",
//     "Cancel",
//   ];

//   useEffect(() => {
//     const fetchDeliveryImages = async () => {
//       if (!contractId) return;

//       setLoading(true);
//       try {
//         const images = [];
//         for (const status of statusOrder) {
//           const response =
//             await ManageContractService.getContractImageAndStatus(
//               contractId,
//               status
//             );
//           if (response && response.length > 0) {
//             images.push(
//               ...response.map((item) => ({
//                 ...item,
//                 status,
//               }))
//             );
//           }
//         }

//         const sortedImages = images.sort((a, b) =>
//           dayjs(a.createDate, "DD/MM/YYYY").isBefore(
//             dayjs(b.createDate, "DD/MM/YYYY")
//           )
//             ? -1
//             : 1
//         );
//         setDeliveryImages(sortedImages);

//         const latestStatus = sortedImages[sortedImages.length - 1]?.status;
//         const currentIndex = statusOrder.indexOf(latestStatus);
//         setCurrentStep(currentIndex >= 0 ? currentIndex : 0);
//       } catch (error) {
//         console.error("Không thể tải thông tin giao hàng!");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (visible) {
//       fetchDeliveryImages();
//     }
//   }, [visible, contractId]);

//   // Lọc các trạng thái có dữ liệu, luôn bao gồm "Preparing" và trạng thái mới nhất (nếu có)
//   const filteredStatusOrder = Array.from(
//     new Set(
//       [
//         "Preparing", // Luôn bao gồm Preparing
//         ...statusOrder.filter((status) =>
//           deliveryImages.some((img) => img.status === status)
//         ),
//         deliveryImages[deliveryImages.length - 1]?.status, // Bao gồm trạng thái mới nhất
//       ].filter(Boolean)
//     ) // Loại bỏ undefined/null
//   ).sort((a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b)); // Sắp xếp theo thứ tự statusOrder

//   const stepItems = filteredStatusOrder.map((status, index) => {
//     const imagesForStatus = deliveryImages.filter(
//       (img) => img.status === status
//     );
//     // Get the earliest createDate for the status
//     const earliestDate =
//       imagesForStatus.length > 0
//         ? imagesForStatus.reduce((earliest, img) =>
//             dayjs(img.createDate, "DD/MM/YYYY").isBefore(
//               dayjs(earliest.createDate, "DD/MM/YYYY")
//             )
//               ? img
//               : earliest
//           ).createDate
//         : null;

//     return {
//       title: status,
//       description: (
//         <div>
//           {earliestDate && <p>Ngày: {earliestDate}</p>}
//           {imagesForStatus.map((img, idx) => (
//             <Image
//               key={idx}
//               src={img.urlImage}
//               alt={`Hình ảnh cho ${status}`}
//               width={100}
//               style={{ marginRight: "10px", marginTop: "10px" }}
//             />
//           ))}
//           {imagesForStatus.length === 0 && (
//             <p>
//               {status === "Cancel"
//                 ? "Đã hủy giao hàng."
//                 : "Costume is being prepared."}
//             </p>
//           )}
//         </div>
//       ),
//     };
//   });

//   const handleShowUpdateModal = () => {
//     setUpdateModalVisible(true);
//     setSelectedStatus(null);
//     setReason("");
//     setSelectedImages([]);
//     form.resetFields();
//   };

//   const handleCloseUpdateModal = () => {
//     setUpdateModalVisible(false);
//     setSelectedStatus(null);
//     setReason("");
//     setSelectedImages([]);
//     form.resetFields();
//   };

//   const handleStatusChange = (value) => {
//     setSelectedStatus(value);
//     if (value !== "Cancel") {
//       setReason("");
//       form.setFieldsValue({ reason: "" });
//     }
//   };

//   const handleImageChange = ({ fileList }) => {
//     const images = fileList
//       .filter((file) => file.originFileObj)
//       .map((file) => file.originFileObj);
//     setSelectedImages(images);
//   };

//   const handleUpdateDelivery = async () => {
//     if (!selectedStatus) {
//       toast.error("Vui lòng chọn trạng thái giao hàng!");
//       return;
//     }

//     if (selectedStatus === "Cancel" && !reason.trim()) {
//       toast.error("Vui lòng nhập lý do khi hủy giao hàng!");
//       return;
//     }

//     setLoading(true);
//     try {
//       await ManageContractService.updateDeliveryContract(
//         contractId,
//         selectedStatus,
//         selectedImages,
//         selectedStatus === "Cancel" ? reason : ""
//       );

//       const images = [];
//       for (const status of statusOrder) {
//         const response = await ManageContractService.getContractImageAndStatus(
//           contractId,
//           status
//         );
//         if (response && response.length > 0) {
//           images.push(
//             ...response.map((item) => ({
//               ...item,
//               status,
//             }))
//           );
//         }
//       }

//       const sortedImages = images.sort((a, b) =>
//         dayjs(a.createDate, "DD/MM/YYYY").isBefore(
//           dayjs(b.createDate, "DD/MM/YYYY")
//         )
//           ? -1
//           : 1
//       );
//       setDeliveryImages(sortedImages);

//       const latestStatus = sortedImages[sortedImages.length - 1]?.status;
//       const currentIndex = statusOrder.indexOf(latestStatus);
//       setCurrentStep(currentIndex >= 0 ? currentIndex : 0);

//       toast.success("Cập nhật trạng thái giao hàng thành công!");
//       handleCloseUpdateModal();
//     } catch (error) {
//       toast.error("Không thể cập nhật trạng thái giao hàng!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Modal
//         title="Delivery"
//         visible={visible}
//         onCancel={onCancel}
//         footer={[
//           <Button key="update" type="primary" onClick={handleShowUpdateModal}>
//             Update Delivery
//           </Button>,
//           <Button key="close" onClick={onCancel}>
//             Close
//           </Button>,
//         ]}
//         width={800}
//       >
//         {loading ? (
//           <Spin tip="Loading..." />
//         ) : (
//           <Card>
//             <Row>
//               <Col span={24}>
//                 <Steps current={currentStep} items={stepItems} />
//               </Col>
//             </Row>
//           </Card>
//         )}
//       </Modal>

//       <Modal
//         title="Cập nhật trạng thái giao hàng"
//         visible={updateModalVisible}
//         onOk={handleUpdateDelivery}
//         onCancel={handleCloseUpdateModal}
//         okText="Cập nhật"
//         cancelText="Hủy"
//         confirmLoading={loading}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Trạng thái giao hàng"
//             name="status"
//             rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
//           >
//             <Select
//               placeholder="Chọn trạng thái"
//               onChange={handleStatusChange}
//               value={selectedStatus}
//             >
//               {statusOrder.map((status) => (
//                 <Option key={status} value={status}>
//                   {status}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {selectedStatus === "Cancel" && (
//             <Form.Item
//               label="Lý do hủy"
//               name="reason"
//               rules={[{ required: true, message: "Vui lòng nhập lý do!" }]}
//             >
//               <Input.TextArea
//                 rows={4}
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//               />
//             </Form.Item>
//           )}

//           <Form.Item label="Hình ảnh (có thể chọn nhiều)">
//             <Upload
//               accept="image/*"
//               multiple
//               beforeUpload={() => false}
//               onChange={handleImageChange}
//               fileList={selectedImages.map((file, index) => ({
//                 uid: index.toString(),
//                 name: file.name || `image-${index}`,
//                 status: "done",
//                 url: URL.createObjectURL(file),
//                 originFileObj: file,
//               }))}
//             >
//               <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
//             </Upload>
//           </Form.Item>

//           {selectedImages.length > 0 && (
//             <div style={{ marginTop: "10px" }}>
//               <p>Preview:</p>
//               <Row gutter={[8, 8]}>
//                 {selectedImages.map((file, index) => (
//                   <Col key={index} span={6}>
//                     <Image
//                       src={URL.createObjectURL(file)}
//                       alt={`Preview ${index}`}
//                       width={80}
//                     />
//                   </Col>
//                 ))}
//               </Row>
//             </div>
//           )}
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default ManageDeliveryRentalCostume;

// fix lỗi resize loop
import React, { useState, useEffect } from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Image,
  Steps,
  Spin,
  Button,
  Select,
  Input,
  Form,
  Upload,
} from "antd";
import { toast } from "react-toastify";
import ManageContractService from "../../../services/ManageServicePages/ManageContractService/ManageContractService.js";
import "../../../styles/ViewMyRentalCostume.scss";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";

const { Step } = Steps;
const { Option } = Select;

const ManageDeliveryRentalCostume = ({ visible, onCancel, contractId }) => {
  const [loading, setLoading] = useState(false);
  const [deliveryImages, setDeliveryImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [form] = Form.useForm();

  const statusOrder = [
    "Preparing",
    "Delivering",
    "UnReceived",
    "Received",
    "Refund",
    "Cancel",
  ];

  useEffect(() => {
    const fetchDeliveryImages = async () => {
      if (!contractId) return;

      setLoading(true);
      try {
        const images = [];
        for (const status of statusOrder) {
          const response =
            await ManageContractService.getContractImageAndStatus(
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
        console.error("Failed to load delivery information!");
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchDeliveryImages();
    }
  }, [visible, contractId]);

  // Filter statuses with data, always including "Preparing" and the latest status (if any)
  const filteredStatusOrder = Array.from(
    new Set(
      [
        "Preparing", // Always include Preparing
        ...statusOrder.filter((status) =>
          deliveryImages.some((img) => img.status === status)
        ),
        deliveryImages[deliveryImages.length - 1]?.status, // Include the latest status
      ].filter(Boolean)
    ) // Remove undefined/null
  ).sort((a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b)); // Sort by statusOrder

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
          {earliestDate && <p>Date: {earliestDate}</p>}
          {imagesForStatus.map((img, idx) => (
            <Image
              key={idx}
              src={img.urlImage}
              alt={`Image for ${status}`}
              width={100}
              style={{ marginRight: "10px", marginTop: "10px" }}
            />
          ))}
          {imagesForStatus.length === 0 && (
            <p>
              {status === "Cancel"
                ? "Delivery canceled."
                : "Costume is being prepared."}
            </p>
          )}
        </div>
      ),
    };
  });

  const handleShowUpdateModal = () => {
    setUpdateModalVisible(true);
    setSelectedStatus(null);
    setReason("");
    setSelectedImages([]);
    form.resetFields();
  };

  const handleCloseUpdateModal = () => {
    setUpdateModalVisible(false);
    setSelectedStatus(null);
    setReason("");
    setSelectedImages([]);
    form.resetFields();
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    if (value !== "Cancel") {
      setReason("");
      form.setFieldsValue({ reason: "" });
    }
  };

  const handleImageChange = ({ fileList }) => {
    const images = fileList
      .filter((file) => file.originFileObj)
      .map((file) => file.originFileObj);
    setSelectedImages(images);
  };

  const handleUpdateDelivery = async () => {
    if (!selectedStatus) {
      toast.error("Please select a delivery status!");
      return;
    }

    if (selectedStatus === "Cancel" && !reason.trim()) {
      toast.error("Please enter a reason for cancellation!");
      return;
    }

    setLoading(true);
    try {
      await ManageContractService.updateDeliveryContract(
        contractId,
        selectedStatus,
        selectedImages,
        selectedStatus === "Cancel" ? reason : ""
      );

      const images = [];
      for (const status of statusOrder) {
        const response = await ManageContractService.getContractImageAndStatus(
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

      toast.success("Delivery status updated successfully!");
      handleCloseUpdateModal();
    } catch (error) {
      toast.error("Failed to update delivery status!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Delivery"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="update" type="primary" onClick={handleShowUpdateModal}>
            Update Delivery
          </Button>,
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

      <Modal
        title="Update Delivery Status"
        visible={updateModalVisible}
        onOk={handleUpdateDelivery}
        onCancel={handleCloseUpdateModal}
        okText="Update"
        cancelText="Cancel"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Delivery Status"
            name="status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select
              placeholder="Select status"
              onChange={handleStatusChange}
              value={selectedStatus}
            >
              {statusOrder.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedStatus === "Cancel" && (
            <Form.Item
              label="Reason for Cancellation"
              name="reason"
              rules={[{ required: true, message: "Please enter a reason!" }]}
            >
              <Input.TextArea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Form.Item>
          )}

          <Form.Item label="Images (multiple selection allowed)">
            <Upload
              accept="image/*"
              multiple
              beforeUpload={() => false}
              onChange={handleImageChange}
              fileList={selectedImages.map((file, index) => ({
                uid: index.toString(),
                name: file.name || `image-${index}`,
                status: "done",
                url: URL.createObjectURL(file),
                originFileObj: file,
              }))}
            >
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
          </Form.Item>

          {selectedImages.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <p>Preview:</p>
              <Row gutter={[8, 8]}>
                {selectedImages.map((file, index) => (
                  <Col key={index} span={6}>
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index}`}
                      width={80}
                    />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ManageDeliveryRentalCostume;
