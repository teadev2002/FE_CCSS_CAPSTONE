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

//         const latestStatus =
//           sortedImages[sortedImages.length - 1]?.status || "Preparing";
//         const currentIndex = statusOrder.indexOf(latestStatus);
//         setCurrentStep(currentIndex >= 0 ? currentIndex : 0);
//       } catch (error) {
//         console.error("All field is required!");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (visible) {
//       fetchDeliveryImages();
//     }
//   }, [visible, contractId]);

//   // Determine available statuses based on the latest status
//   const getAvailableStatuses = () => {
//     const latestStatus =
//       deliveryImages[deliveryImages.length - 1]?.status || "Preparing";

//     if (latestStatus === "Preparing") {
//       return ["Delivering"];
//     }

//     if (latestStatus === "Delivering") {
//       return ["Cancel", "Received", "UnReceived"];
//     }

//     if (latestStatus === "Received") {
//       return ["Refund"];
//     }

//     if (latestStatus === "UnReceived") {
//       return ["Delivering"];
//     }

//     return [];
//   };

//   // Filter statuses for Steps, always including Preparing and latest status
//   const filteredStatusOrder = Array.from(
//     new Set(
//       [
//         "Preparing",
//         ...statusOrder.filter((status) =>
//           deliveryImages.some((img) => img.status === status)
//         ),
//         deliveryImages[deliveryImages.length - 1]?.status,
//       ].filter(Boolean)
//     )
//   ).sort((a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b));

//   const stepItems = filteredStatusOrder.map((status, index) => {
//     const imagesForStatus = deliveryImages.filter(
//       (img) => img.status === status
//     );
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
//       title: (
//         <span style={{ color: status === "Cancel" ? "red" : "inherit" }}>
//           {status}
//         </span>
//       ),
//       description: (
//         <div>
//           {status === "Cancel" || status === "UnReceived" ? (
//             <>{earliestDate && <p>Date: {earliestDate}</p>}</>
//           ) : (
//             <>
//               {earliestDate && <p>Date: {earliestDate}</p>}
//               {imagesForStatus.map((img, idx) => (
//                 <Image
//                   key={idx}
//                   src={img.urlImage}
//                   alt={`Image for ${status}`}
//                   width={100}
//                   style={{ marginRight: "10px", marginTop: "10px" }}
//                 />
//               ))}
//               {imagesForStatus.length === 0 && (
//                 <p>
//                   {status === "Preparing"
//                     ? "Costume is being prepared."
//                     : "No images available."}
//                 </p>
//               )}
//             </>
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
//     if (value !== "Cancel" || value !== "UnReceived") {
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
//       toast.error("Please select a delivery status!");
//       return;
//     }

//     if (
//       (selectedStatus === "Cancel" || selectedStatus === "UnReceived") &&
//       !reason.trim()
//     ) {
//       toast.error("Please enter a reason for this status!");
//       return;
//     }

//     setLoading(true);
//     try {
//       await ManageContractService.updateDeliveryContract(
//         contractId,
//         selectedStatus,
//         selectedImages,
//         selectedStatus === "Cancel" || selectedStatus === "UnReceived"
//           ? reason
//           : ""
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

//       const latestStatus =
//         sortedImages[sortedImages.length - 1]?.status || "Preparing";
//       const currentIndex = statusOrder.indexOf(latestStatus);
//       setCurrentStep(currentIndex >= 0 ? currentIndex : 0);

//       toast.success("Delivery status updated successfully!");
//       handleCloseUpdateModal();
//       setTimeout(() => {
//         window.location.reload();
//       }, 500);
//     } catch (error) {
//       toast.error("All Feild is required!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Disable Update button if latest status is Cancel
//   const isUpdateDisabled =
//     deliveryImages[deliveryImages.length - 1]?.status === "Cancel" ||
//     deliveryImages[deliveryImages.length - 1]?.status === "Received" ||
//     deliveryImages[deliveryImages.length - 1]?.status === "Refund";

//   return (
//     <>
//       <Modal
//         title="Delivery"
//         visible={visible}
//         onCancel={onCancel}
//         footer={[
//           <Button
//             key="update"
//             type="primary"
//             onClick={handleShowUpdateModal}
//             disabled={isUpdateDisabled}
//           >
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
//         title="Update Delivery Status"
//         visible={updateModalVisible}
//         onOk={handleUpdateDelivery}
//         onCancel={handleCloseUpdateModal}
//         okText="Update"
//         cancelText="Cancel"
//         confirmLoading={loading}
//         okButtonProps={{ disabled: isUpdateDisabled }} // Disable Update button in modal if Cancel
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Delivery Status"
//             name="status"
//             rules={[{ required: true, message: "Please select a status!" }]}
//           >
//             <Select
//               placeholder="Select status"
//               onChange={handleStatusChange}
//               value={selectedStatus}
//             >
//               {getAvailableStatuses().map((status) => (
//                 <Option key={status} value={status}>
//                   {status}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           {(selectedStatus === "Cancel" || selectedStatus === "UnReceived") && (
//             <Form.Item
//               label="Reason for Cancellation"
//               name="reason"
//               rules={[{ required: true, message: "Please enter a reason!" }]}
//             >
//               <Input.TextArea
//                 rows={4}
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//               />
//             </Form.Item>
//           )}

//           <Form.Item label="Images (multiple selection allowed)">
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
//               <Button icon={<UploadOutlined />}>Select Images</Button>
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

// show hết các trạng thái delivery ============ vẫn lỗi nhưng có thể xài tạm
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
//           dayjs(a.createDate, "DD/MM/YYYY HH:mm:ss").isBefore(
//             dayjs(b.createDate, "DD/MM/YYYY HH:mm:ss")
//           )
//             ? -1
//             : 1
//         );
//         setDeliveryImages(sortedImages);
//       } catch (error) {
//         console.error("Error fetching delivery images:", error);
//         toast.error("Failed to load delivery data!");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (visible) {
//       fetchDeliveryImages();
//     }
//   }, [visible, contractId]);

//   // Build filteredStatusOrder to reflect the exact order of status updates without consecutive duplicates
//   const filteredStatusOrder = deliveryImages.reduce((acc, img, index) => {
//     // Always start with Preparing
//     if (index === 0) {
//       acc.push("Preparing");
//     }
//     // Only add the status if it's different from the last one in acc
//     if (acc[acc.length - 1] !== img.status) {
//       acc.push(img.status);
//     }
//     return acc;
//   }, []);

//   // If filteredStatusOrder only has Preparing, ensure it’s initialized properly
//   if (filteredStatusOrder.length === 0) {
//     filteredStatusOrder.push("Preparing");
//   }

//   // Update currentStep based on the length of filteredStatusOrder
//   useEffect(() => {
//     if (filteredStatusOrder.length > 0) {
//       setCurrentStep(filteredStatusOrder.length - 1);
//     } else {
//       setCurrentStep(0);
//     }
//   }, [filteredStatusOrder]);

//   const stepItems = filteredStatusOrder.map((status, stepIndex) => {
//     // Find the most recent entry for this status in deliveryImages
//     const statusEntries = deliveryImages
//       .filter((img) => img.status === status)
//       .sort((a, b) =>
//         dayjs(a.createDate, "DD/MM/YYYY HH:mm:ss").isBefore(
//           dayjs(b.createDate, "DD/MM/YYYY HH:mm:ss")
//         )
//           ? -1
//           : 1
//       );

//     const currentStatusEntry = statusEntries[statusEntries.length - 1] || null;

//     // Get images for this status (most recent images only)
//     const imagesForStatus = statusEntries
//       .filter((img) => img.urlImage)
//       .slice(-1); // Only take the most recent image set

//     const earliestDate = currentStatusEntry?.createDate || null;

//     return {
//       title: (
//         <span style={{ color: status === "Cancel" ? "red" : "inherit" }}>
//           {status}
//         </span>
//       ),
//       description: (
//         <div>
//           {status === "Cancel" || status === "UnReceived" ? (
//             <>
//               {earliestDate && <p>Date: {earliestDate}</p>}
//               {currentStatusEntry?.reason && (
//                 <p>Reason: {currentStatusEntry.reason}</p>
//               )}
//               {imagesForStatus.map((img, idx) => (
//                 <Image
//                   key={idx}
//                   src={img.urlImage}
//                   alt={`Image for ${status}`}
//                   width={100}
//                   style={{ marginRight: "10px", marginTop: "10px" }}
//                 />
//               ))}
//             </>
//           ) : (
//             <>
//               {earliestDate && <p>Date: {earliestDate}</p>}
//               {imagesForStatus.map((img, idx) => (
//                 <Image
//                   key={idx}
//                   src={img.urlImage}
//                   alt={`Image for ${status}`}
//                   width={100}
//                   style={{ marginRight: "10px", marginTop: "10px" }}
//                 />
//               ))}
//               {!imagesForStatus.length && !earliestDate && (
//                 <p>
//                   {status === "Preparing"
//                     ? "Costume is being prepared."
//                     : "No images available."}
//                 </p>
//               )}
//             </>
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
//     if (value !== "Cancel" && value !== "UnReceived") {
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
//       toast.error("Please select a delivery status!");
//       return;
//     }

//     // Require images for Delivering, Received, and Refund
//     if (
//       ["Delivering", "Received", "Refund"].includes(selectedStatus) &&
//       selectedImages.length === 0
//     ) {
//       toast.error(
//         `Please upload at least one image for ${selectedStatus} status!`
//       );
//       return;
//     }

//     // Require reason for Cancel and UnReceived
//     if (
//       (selectedStatus === "Cancel" || selectedStatus === "UnReceived") &&
//       !reason.trim()
//     ) {
//       toast.error(`Please enter a reason for ${selectedStatus} status!`);
//       return;
//     }

//     setLoading(true);
//     try {
//       await ManageContractService.updateDeliveryContract(
//         contractId,
//         selectedStatus,
//         selectedImages,
//         selectedStatus === "Cancel" || selectedStatus === "UnReceived"
//           ? reason
//           : ""
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
//         dayjs(a.createDate, "DD/MM/YYYY HH:mm:ss").isBefore(
//           dayjs(b.createDate, "DD/MM/YYYY HH:mm:ss")
//         )
//           ? -1
//           : 1
//       );
//       setDeliveryImages(sortedImages);

//       // Update currentStep based on the new filteredStatusOrder length
//       const newFilteredStatusOrder = sortedImages.reduce((acc, img, index) => {
//         if (index === 0) {
//           acc.push("Preparing");
//         }
//         if (acc[acc.length - 1] !== img.status) {
//           acc.push(img.status);
//         }
//         return acc;
//       }, []);
//       if (newFilteredStatusOrder.length === 0) {
//         newFilteredStatusOrder.push("Preparing");
//       }
//       setCurrentStep(newFilteredStatusOrder.length - 1);

//       toast.success("Delivery status updated successfully!");
//       handleCloseUpdateModal();
//     } catch (error) {
//       toast.error("Failed to update delivery status!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Disable Update button if latest status is Cancel or Refund
//   const isUpdateDisabled =
//     deliveryImages[deliveryImages.length - 1]?.status === "Cancel" ||
//     deliveryImages[deliveryImages.length - 1]?.status === "Refund";

//   return (
//     <>
//       <Modal
//         title="Delivery"
//         visible={visible}
//         onCancel={onCancel}
//         footer={[
//           <Button
//             key="update"
//             type="primary"
//             onClick={handleShowUpdateModal}
//             disabled={isUpdateDisabled}
//           >
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
//         title="Update Delivery Status"
//         visible={updateModalVisible}
//         onOk={handleUpdateDelivery}
//         onCancel={handleCloseUpdateModal}
//         okText="Update"
//         cancelText="Cancel"
//         confirmLoading={loading}
//         okButtonProps={{ disabled: isUpdateDisabled }}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Delivery Status"
//             name="status"
//             rules={[{ required: true, message: "Please select a status!" }]}
//           >
//             <Select
//               placeholder="Select status"
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

//           {(selectedStatus === "Cancel" || selectedStatus === "UnReceived") && (
//             <Form.Item
//               label="Reason for Cancellation or UnReceived"
//               name="reason"
//               rules={[{ required: true, message: "Please enter a reason!" }]}
//             >
//               <Input.TextArea
//                 rows={4}
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//               />
//             </Form.Item>
//           )}

//           <Form.Item
//             label="Images (multiple selection allowed)"
//             rules={[
//               {
//                 validator: (_, value) => {
//                   if (
//                     ["Delivering", "Received", "Refund"].includes(
//                       selectedStatus
//                     ) &&
//                     (!value || value.length === 0)
//                   ) {
//                     return Promise.reject(
//                       new Error(
//                         `Please upload at least one image for ${selectedStatus} status!`
//                       )
//                     );
//                   }
//                   return Promise.resolve();
//                 },
//               },
//             ]}
//           >
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
//               <Button icon={<UploadOutlined />}>Select Images</Button>
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

/// fix status order
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
    "Delivering",
    "UnReceived",
    "Received",
    "Refund",
    "Cancel",
  ];

  // Determine which statuses are enabled based on the latest status
  const getEnabledStatuses = () => {
    const latestStatus =
      deliveryImages[deliveryImages.length - 1]?.status || "Preparing";

    if (latestStatus === "Preparing") {
      return ["Delivering", "Cancel"];
    } else if (latestStatus === "Delivering") {
      return ["Received", "UnReceived", "Cancel"];
    } else if (latestStatus === "UnReceived") {
      return ["Delivering", "Cancel", "Received"];
    } else if (latestStatus === "Received") {
      return ["Refund", "Cancel"];
    } else {
      return [];
    }
  };

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
          dayjs(a.createDate, "DD/MM/YYYY HH:mm:ss").isBefore(
            dayjs(b.createDate, "DD/MM/YYYY HH:mm:ss")
          )
            ? -1
            : 1
        );
        setDeliveryImages(sortedImages);
      } catch (error) {
        console.error("Error fetching delivery images:", error);
        toast.error("Failed to load delivery data!");
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchDeliveryImages();
    }
  }, [visible, contractId]);

  // Build filteredStatusOrder to reflect the exact order of status updates without consecutive duplicates
  const filteredStatusOrder = deliveryImages.reduce((acc, img, index) => {
    if (index === 0) {
      acc.push("Preparing");
    }
    if (acc[acc.length - 1] !== img.status) {
      acc.push(img.status);
    }
    return acc;
  }, []);

  if (filteredStatusOrder.length === 0) {
    filteredStatusOrder.push("Preparing");
  }

  useEffect(() => {
    if (filteredStatusOrder.length > 0) {
      setCurrentStep(filteredStatusOrder.length - 1);
    } else {
      setCurrentStep(0);
    }
  }, [filteredStatusOrder]);

  const stepItems = filteredStatusOrder.map((status, stepIndex) => {
    const statusEntries = deliveryImages
      .filter((img) => img.status === status)
      .sort((a, b) =>
        dayjs(a.createDate, "DD/MM/YYYY HH:mm:ss").isBefore(
          dayjs(b.createDate, "DD/MM/YYYY HH:mm:ss")
        )
          ? -1
          : 1
      );

    const currentStatusEntry = statusEntries[statusEntries.length - 1] || null;
    const imagesForStatus = statusEntries
      .filter((img) => img.urlImage)
      .slice(-1);
    const earliestDate = currentStatusEntry?.createDate || null;

    return {
      title: (
        <span style={{ color: status === "Cancel" ? "red" : "inherit" }}>
          {status}
        </span>
      ),
      description: (
        <div>
          {status === "Cancel" || status === "UnReceived" ? (
            <>
              {earliestDate && <p>Date: {earliestDate}</p>}
              {currentStatusEntry?.reason && (
                <p>Reason: {currentStatusEntry.reason}</p>
              )}
              {imagesForStatus.map((img, idx) => (
                <Image
                  key={idx}
                  src={img.urlImage}
                  alt={`Image for ${status}`}
                  width={100}
                  style={{ marginRight: "10px", marginTop: "10px" }}
                />
              ))}
            </>
          ) : (
            <>
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
              {!imagesForStatus.length && !earliestDate && (
                <p>
                  {status === "Preparing"
                    ? "Costume is being prepared."
                    : "No images available."}
                </p>
              )}
            </>
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
    if (value !== "Cancel" && value !== "UnReceived") {
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

    if (
      ["Delivering", "Received", "Refund"].includes(selectedStatus) &&
      selectedImages.length === 0
    ) {
      toast.error(
        `Please upload at least one image for ${selectedStatus} status!`
      );
      return;
    }

    if (
      (selectedStatus === "Cancel" || selectedStatus === "UnReceived") &&
      !reason.trim()
    ) {
      toast.error(`Please enter a reason for ${selectedStatus} status!`);
      return;
    }

    setLoading(true);
    try {
      await ManageContractService.updateDeliveryContract(
        contractId,
        selectedStatus,
        selectedImages,
        selectedStatus === "Cancel" || selectedStatus === "UnReceived"
          ? reason
          : ""
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
        dayjs(a.createDate, "DD/MM/YYYY HH:mm:ss").isBefore(
          dayjs(b.createDate, "DD/MM/YYYY HH:mm:ss")
        )
          ? -1
          : 1
      );
      setDeliveryImages(sortedImages);

      const newFilteredStatusOrder = sortedImages.reduce((acc, img, index) => {
        if (index === 0) {
          acc.push("Preparing");
        }
        if (acc[acc.length - 1] !== img.status) {
          acc.push(img.status);
        }
        return acc;
      }, []);
      if (newFilteredStatusOrder.length === 0) {
        newFilteredStatusOrder.push("Preparing");
      }
      setCurrentStep(newFilteredStatusOrder.length - 1);

      toast.success("Delivery status updated successfully!");
      handleCloseUpdateModal();
    } catch (error) {
      toast.error("Failed to update delivery status!");
    } finally {
      setLoading(false);
    }
  };

  const isUpdateDisabled =
    deliveryImages[deliveryImages.length - 1]?.status === "Cancel" ||
    deliveryImages[deliveryImages.length - 1]?.status === "Refund" ||
    deliveryImages[deliveryImages.length - 1]?.status === "Received";

  return (
    <>
      <Modal
        title="Delivery"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button
            key="update"
            type="primary"
            onClick={handleShowUpdateModal}
            disabled={isUpdateDisabled}
          >
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
        okButtonProps={{ disabled: isUpdateDisabled }}
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
                <Option
                  key={status}
                  value={status}
                  disabled={!getEnabledStatuses().includes(status)}
                >
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {(selectedStatus === "Cancel" || selectedStatus === "UnReceived") && (
            <Form.Item
              label="Reason for Cancellation or UnReceived"
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

          <Form.Item
            label="Images (multiple selection allowed)"
            rules={[
              {
                validator: (_, value) => {
                  if (
                    ["Delivering", "Received", "Refund"].includes(
                      selectedStatus
                    ) &&
                    (!value || value.length === 0)
                  ) {
                    return Promise.reject(
                      new Error(
                        `Please upload at least one image for ${selectedStatus} status!`
                      )
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
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
