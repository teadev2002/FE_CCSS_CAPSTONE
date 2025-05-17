// import React, { useState, useEffect } from "react";
// import { Modal, Card, Row, Col, Image, Steps, Spin, Button } from "antd";
// import { toast } from "react-toastify";
// import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";
// import "../../styles/ViewMyRentalCostume.scss";
// import dayjs from "dayjs";

// const { Step } = Steps;

// const ViewDeliveryRentalCostume = ({ visible, onCancel, contractId }) => {
//   const [loading, setLoading] = useState(false);
//   const [deliveryImages, setDeliveryImages] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);

//   // List of possible statuses from the DeliveryStatus enum
//   const statusOrder = [
//     "Preparing",
//     "Delivering",
//     "UnReceived",
//     "Received",
//     "Refund",
//     "Cancel",
//   ];

//   // Fetch image data and delivery status
//   useEffect(() => {
//     const fetchDeliveryImages = async () => {
//       if (!contractId) return;

//       setLoading(true);
//       try {
//         const images = [];
//         for (const status of statusOrder) {
//           const response =
//             await MyRentalCostumeService.getContractImageAndStatus(
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
//         console.error("Unable to load delivery information!");
//         toast.error("Unable to load delivery information!");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (visible) {
//       fetchDeliveryImages();
//     }
//   }, [visible, contractId]);

//   // Always display Preparing, along with statuses that have data
//   const filteredStatusOrder = Array.from(
//     new Set([
//       "Preparing",
//       ...statusOrder.filter((status) =>
//         deliveryImages.some((img) => img.status === status)
//       ),
//     ])
//   ).sort((a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b));

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
//       title: (
//         <span
//           style={{
//             color:
//               status === "Cancel" || status === "UnReceived"
//                 ? "red"
//                 : "inherit",
//           }}
//         >
//           {status}
//         </span>
//       ), // Red color for Cancel status title
//       description: (
//         <div>
//           {status === "Cancel" || status === "UnReceived" ? (
//             <>
//               {earliestDate && <p>{earliestDate}</p>}
//               {status === "Cancel" && <p>Delivery canceled.</p>}
//               {status === "UnReceived" && <p>Costumer no at home.</p>}
//             </>
//           ) : (
//             <>
//               {earliestDate && <p>{earliestDate}</p>}
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

//   return (
//     <Modal
//       title="View Delivery Information"
//       visible={visible}
//       onCancel={onCancel}
//       footer={[
//         <Button key="close" onClick={onCancel}>
//           Close
//         </Button>,
//       ]}
//       width={800}
//     >
//       {loading ? (
//         <Spin tip="Loading..." />
//       ) : (
//         <Card>
//           <Row>
//             <Col span={24}>
//               <Steps current={currentStep} items={stepItems} />
//             </Col>
//           </Row>
//         </Card>
//       )}
//     </Modal>
//   );
// };

// export default ViewDeliveryRentalCostume;

// them update refund
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
//   Form,
//   Upload,
//   Select,
//   Input,
// } from "antd";
// import { toast } from "react-toastify";
// import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";
// import "../../styles/ViewMyRentalCostume.scss";
// import dayjs from "dayjs";
// import { UploadOutlined } from "@ant-design/icons";

// const { Step } = Steps;
// const { Option } = Select;

// const ViewDeliveryRentalCostume = ({ visible, onCancel, contractId }) => {
//   const [loading, setLoading] = useState(false);
//   const [deliveryImages, setDeliveryImages] = useState([]);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [updateModalVisible, setUpdateModalVisible] = useState(false);
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [form] = Form.useForm();

//   // List of possible statuses from the DeliveryStatus enum
//   const statusOrder = [
//     "Preparing",
//     "Delivering",
//     "UnReceived",
//     "Received",
//     "Refund",
//     "Cancel",
//   ];

//   // Fetch image data and delivery status
//   useEffect(() => {
//     const fetchDeliveryImages = async () => {
//       if (!contractId) return;

//       setLoading(true);
//       try {
//         const images = [];
//         for (const status of statusOrder) {
//           const response =
//             await MyRentalCostumeService.getContractImageAndStatus(
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
//         console.error("Unable to load delivery information!");
//         toast.error("Unable to load delivery information!");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (visible) {
//       fetchDeliveryImages();
//     }
//   }, [visible, contractId]);

//   // Always display Preparing, along with statuses that have data
//   const filteredStatusOrder = Array.from(
//     new Set([
//       "Preparing",
//       ...statusOrder.filter((status) =>
//         deliveryImages.some((img) => img.status === status)
//       ),
//     ])
//   ).sort((a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b));

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
//       title: (
//         <span
//           style={{
//             color:
//               status === "Cancel" || status === "UnReceived"
//                 ? "red"
//                 : "inherit",
//           }}
//         >
//           {status}
//         </span>
//       ),
//       description: (
//         <div>
//           {status === "Cancel" || status === "UnReceived" ? (
//             <>
//               {earliestDate && <p>{earliestDate}</p>}
//               {status === "Cancel" && <p>Delivery canceled.</p>}
//               {status === "UnReceived" && <p>Customer not at home.</p>}
//             </>
//           ) : (
//             <>
//               {earliestDate && <p>{earliestDate}</p>}
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

//   // Check if update is allowed (only when latest status is Received)
//   const latestStatus =
//     deliveryImages[deliveryImages.length - 1]?.status || "Preparing";
//   const isUpdateAllowed = latestStatus === "Received";

//   // Handle showing update modal
//   const handleShowUpdateModal = () => {
//     setUpdateModalVisible(true);
//     setSelectedImages([]);
//     form.resetFields();
//   };

//   // Handle closing update modal
//   const handleCloseUpdateModal = () => {
//     setUpdateModalVisible(false);
//     setSelectedImages([]);
//     form.resetFields();
//   };

//   // Handle image upload
//   const handleImageChange = ({ fileList }) => {
//     const images = fileList
//       .filter((file) => {
//         const isImage = file.type.startsWith("image/");
//         const isLt2M = file.size / 1024 / 1024 < 2; // Limit to 2MB
//         if (!isImage) toast.error("Only image files are allowed!");
//         if (!isLt2M) toast.error("Image must be smaller than 2MB!");
//         return isImage && isLt2M;
//       })
//       .map((file) => file.originFileObj);
//     setSelectedImages(images);
//   };

//   // Handle update delivery status to Refund
//   const handleUpdateDelivery = async () => {
//     if (selectedImages.length === 0) {
//       toast.error("Please upload at least one image!");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Call API to update status to Refund with images
//       await MyRentalCostumeService.updateDeliveryContract(
//         contractId,
//         "Refund",
//         selectedImages
//       );

//       // Refresh delivery images and status
//       const images = [];
//       for (const status of statusOrder) {
//         const response = await MyRentalCostumeService.getContractImageAndStatus(
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

//       toast.success("Delivery status updated to Refund successfully!");
//       handleCloseUpdateModal();
//     } catch (error) {
//       console.error("Failed to update delivery status!");
//       toast.error("Failed to update delivery status!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Modal
//         title="View Delivery Information"
//         visible={visible}
//         onCancel={onCancel}
//         footer={[
//           <Button
//             key="update"
//             type="primary"
//             onClick={handleShowUpdateModal}
//             disabled={!isUpdateAllowed}
//           >
//             Update Refund
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
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Delivery Status"
//             name="status"
//             initialValue="Refund"
//             rules={[{ required: true, message: "Status is required!" }]}
//           >
//             <Input type="text" value="Refund" disabled />
//           </Form.Item>

//           <Form.Item
//             label="Images (at least one required)"
//             name="images"
//             rules={[
//               { required: true, message: "Please upload at least one image!" },
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

// export default ViewDeliveryRentalCostume;

// thêm nhiều hình
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
  Form,
  Upload,
  Input,
} from "antd";
import { toast } from "react-toastify";
import MyRentalCostumeService from "../../services/MyRentalCostumeService/MyRentalCostumeService.js";
import "../../styles/ViewMyRentalCostume.scss";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";

const { Step } = Steps;

const ViewDeliveryRentalCostume = ({ visible, onCancel, contractId }) => {
  const [loading, setLoading] = useState(false);
  const [deliveryImages, setDeliveryImages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [form] = Form.useForm();

  // List of possible statuses from the DeliveryStatus enum
  const statusOrder = [
    "Preparing",
    "Delivering",
    "UnReceived",
    "Received",
    "Refund",
    "Cancel",
  ];

  // Maximum number of images allowed
  const MAX_IMAGES = 5;

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

        const latestStatus =
          sortedImages[sortedImages.length - 1]?.status || "Preparing";
        const currentIndex = statusOrder.indexOf(latestStatus);
        setCurrentStep(currentIndex >= 0 ? currentIndex : 0);
      } catch (error) {
        console.error("Unable to load delivery information!", error);
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
      title: (
        <span
          style={{
            color:
              status === "Cancel" || status === "UnReceived"
                ? "red"
                : "inherit",
          }}
        >
          {status}
        </span>
      ),
      description: (
        <div>
          {status === "Cancel" || status === "UnReceived" ? (
            <>
              {earliestDate && <p>{earliestDate}</p>}
              {status === "Cancel" && <p>Delivery canceled.</p>}
              {status === "UnReceived" && <p>Customer not at home.</p>}
            </>
          ) : (
            <>
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
              {imagesForStatus.length === 0 && (
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

  // Check if update is allowed (only when latest status is Received)
  const latestStatus =
    deliveryImages[deliveryImages.length - 1]?.status || "Preparing";
  const isUpdateAllowed = latestStatus === "Received";

  // Handle showing update modal
  const handleShowUpdateModal = () => {
    setUpdateModalVisible(true);
    setSelectedImages([]);
    form.resetFields();
  };

  // Handle closing update modal
  const handleCloseUpdateModal = () => {
    setUpdateModalVisible(false);
    setSelectedImages([]);
    form.resetFields();
  };

  // Handle image upload
  const handleImageChange = ({ fileList }) => {
    const images = fileList
      .filter((file) => {
        // Ensure file has originFileObj and is valid
        if (!file.originFileObj) {
          return false;
        }
        const isImage = file.type && file.type.startsWith("image/");
        const isLt2M = file.size && file.size / 1024 / 1024 < 2; // Limit to 2MB
        if (!isImage) {
          toast.error("Only image files are allowed!");
          return false;
        }
        if (!isLt2M) {
          toast.error("Image must be smaller than 2MB!");
          return false;
        }
        return true;
      })
      .slice(0, MAX_IMAGES) // Limit to MAX_IMAGES
      .map((file) => file.originFileObj);

    if (fileList.length > MAX_IMAGES) {
      toast.warning(`You can only upload up to ${MAX_IMAGES} images!`);
    }

    setSelectedImages(images);
    form.setFieldsValue({ images });
  };

  // Handle update delivery status to Refund
  const handleUpdateDelivery = async () => {
    try {
      await form.validateFields(); // Validate form
      if (selectedImages.length === 0) {
        toast.error("Please upload at least one image!");
        return;
      }

      setLoading(true);
      await MyRentalCostumeService.updateDeliveryContract(
        contractId,
        "Refund",
        selectedImages
      );

      // Refresh delivery images and status
      const images = [];
      for (const status of statusOrder) {
        const response = await MyRentalCostumeService.getContractImageAndStatus(
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

      const latestStatus =
        sortedImages[sortedImages.length - 1]?.status || "Preparing";
      const currentIndex = statusOrder.indexOf(latestStatus);
      setCurrentStep(currentIndex >= 0 ? currentIndex : 0);

      toast.success("Delivery status updated to Refund successfully!");
      handleCloseUpdateModal();
    } catch (error) {
      console.error("Failed to update delivery status!", error);
      toast.error(
        error.response?.data?.message || "Failed to update delivery status!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="View Delivery Information"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button
            key="update"
            type="primary"
            onClick={handleShowUpdateModal}
            disabled={!isUpdateAllowed}
          >
            Update Refund
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
            initialValue="Refund"
            rules={[{ required: true, message: "Status is required!" }]}
          >
            <Input type="text" value="Refund" disabled />
          </Form.Item>

          <Form.Item
            label={`Images (at least one required, max ${MAX_IMAGES})`}
            name="images"
            rules={[
              {
                validator: () =>
                  selectedImages.length > 0
                    ? Promise.resolve()
                    : Promise.reject("Please upload at least one image!"),
              },
            ]}
          >
            <Upload
              accept="image/*"
              multiple
              beforeUpload={() => false}
              onChange={handleImageChange}
              fileList={selectedImages.map((file, index) => ({
                uid: `file-${index}`,
                name: file.name || `image-${index}`,
                status: "done",
                url: URL.createObjectURL(file),
                originFileObj: file,
              }))}
              showUploadList={{ showRemoveIcon: true }}
            >
              <Button
                icon={<UploadOutlined />}
                disabled={selectedImages.length >= MAX_IMAGES}
              >
                Select Images
              </Button>
            </Upload>
          </Form.Item>

          {selectedImages.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <p>Preview:</p>
              <Row gutter={[8, 8]}>
                {selectedImages.map((file, index) => (
                  <Col key={`preview-${index}`} span={6}>
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

export default ViewDeliveryRentalCostume;
