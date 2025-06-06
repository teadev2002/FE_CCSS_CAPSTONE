// import React, { useState, useEffect, useRef } from "react";
// import { Modal, Form } from "react-bootstrap";
// import { Button } from "antd";
// import RefundService from "../../../services/RefundService/RefundService.js";
// import { toast } from "react-toastify";

// const EditRefundButton = ({ refund }) => {
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     numberBank: "",
//     bankName: "",
//     accountBankName: "",
//     price: 0,
//     description: "",
//     status: "Pending",
//   });
//   const [images, setImages] = useState([]);
//   const previewContainerRef = useRef(null);

//   const handleOpenModal = async () => {
//     if (!refund?.contractRefundId) {
//       console.error("Invalid or missing contractRefundId:", refund);
//       toast.error("Invalid refund data.");
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log(
//         "Fetching refund for contractRefundId:",
//         refund.contractRefundId
//       );
//       const response = await RefundService.GetContractRefundByContractRefundId(
//         refund.contractRefundId
//       );
//       console.log("API response:", response);
//       setFormData({
//         numberBank: response.numberBank || "",
//         bankName: response.bankName || "",
//         accountBankName: response.accountBankName || "",
//         price: response.price || 0,
//         description: response.description || "",
//         status: response.status || "Pending",
//       });
//       setShowModal(true);
//     } catch (error) {
//       console.error("Error fetching refund details:", error);
//       toast.error("Failed to load refund details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setImages([]);
//     if (previewContainerRef.current) {
//       previewContainerRef.current.innerHTML = "";
//     }
//     setFormData({
//       numberBank: "",
//       bankName: "",
//       accountBankName: "",
//       price: 0,
//       description: "",
//       status: "Pending",
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setImages(selectedFiles);
//     renderImagePreviews(selectedFiles);
//   };

//   const renderImagePreviews = (files) => {
//     const container = previewContainerRef.current;
//     if (!container) return;

//     container.innerHTML = "";

//     files.forEach((file) => {
//       const imgUrl = URL.createObjectURL(file);
//       const imgContainer = document.createElement("div");
//       imgContainer.style.textAlign = "center";
//       imgContainer.style.margin = "10px";

//       const img = document.createElement("img");
//       img.src = imgUrl;
//       img.alt = file.name;
//       img.style.maxWidth = "100px";
//       img.style.maxHeight = "100px";
//       img.style.objectFit = "cover";
//       img.style.borderRadius = "4px";

//       const name = document.createElement("p");
//       name.textContent = file.name;
//       name.style.fontSize = "12px";
//       name.style.marginTop = "5px";

//       imgContainer.appendChild(img);
//       imgContainer.appendChild(name);
//       container.appendChild(imgContainer);
//     });
//   };

//   const handleSaveChanges = async () => {
//     if (!refund?.contractRefundId) {
//       toast.error("Invalid refund ID.");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Fetch refund details to get contractId
//       const refundDetails =
//         await RefundService.GetContractRefundByContractRefundId(
//           refund.contractRefundId
//         );
//       const contractId = refundDetails.contractId;

//       if (!contractId) {
//         toast.error("Contract ID not found in refund details.");
//         return;
//       }

//       // Call sendContractImage if images are present
//       if (images.length > 0) {
//         await RefundService.sendContractImage(
//           contractId,
//           "RefundMoney",
//           images
//         );
//       }

//       // Call updateRefund
//       await RefundService.updateRefund(
//         refund.contractRefundId,
//         contractId,
//         formData.numberBank,
//         formData.bankName,
//         formData.accountBankName,
//         formData.price,
//         formData.description,
//         images
//       );

//       toast.success("Refund updated successfully.");
//       handleCloseModal();
//     } catch (error) {
//       console.error("Error processing refund:", error);
//       toast.error("Failed to update refund or upload images.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Clean up image URLs on component unmount
//   useEffect(() => {
//     return () => {
//       if (previewContainerRef.current) {
//         const imgs = previewContainerRef.current.querySelectorAll("img");
//         imgs.forEach((img) => URL.revokeObjectURL(img.src));
//       }
//     };
//   }, []);

//   return (
//     <>
//       <Button
//         type="default"
//         onClick={handleOpenModal}
//         className="action-btn edit-btn"
//         loading={loading}
//         disabled={
//           loading || !refund?.contractRefundId || refund?.status === "Paid"
//         }
//       >
//         Edit
//       </Button>

//       <Modal
//         show={showModal}
//         onHide={handleCloseModal}
//         centered
//         className="refund-modal"
//         backdropClassName="custom-backdrop"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Refund</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <div className="two-column-layout">
//               <div className="column-left">
//                 <div
//                   style={{ display: "flex", justifyContent: "space-between" }}
//                 >
//                   <Form.Group
//                     className="mb-3"
//                     style={{ flex: 1, marginRight: "10px" }}
//                   >
//                     <Form.Label>Bank Number</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="numberBank"
//                       value={formData.numberBank}
//                       onChange={handleInputChange}
//                       placeholder="Enter bank number"
//                       readOnly
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3" style={{ flex: 1 }}>
//                     <Form.Label>Bank Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="bankName"
//                       value={formData.bankName}
//                       onChange={handleInputChange}
//                       placeholder="Enter bank name"
//                       readOnly
//                     />
//                   </Form.Group>
//                 </div>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Account Holder</Form.Label>
//                   <Form.Control
//                     type="text"
//                     name="accountBankName"
//                     value={formData.accountBankName}
//                     onChange={handleInputChange}
//                     placeholder="Enter account holder name"
//                     readOnly
//                   />
//                 </Form.Group>
//               </div>

//               <div className="column-right">
//                 <Form.Group className="mb-3">
//                   <Form.Label>Price Damage</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     placeholder="Enter price"
//                     min="0"
//                     step="0.01"
//                     required
//                   />
//                 </Form.Group>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Description</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Enter description"
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-4">
//                   <Form.Label className="fw-bold">Upload Images</Form.Label>
//                   <div
//                     style={{
//                       border: "2px dashed #ccc",
//                       padding: "20px",
//                       borderRadius: "8px",
//                       textAlign: "center",
//                       backgroundColor: "#f9f9f9",
//                     }}
//                   >
//                     <Form.Control
//                       type="file"
//                       multiple
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       style={{ display: "none" }}
//                       id="customFileInput"
//                     />
//                     <label
//                       htmlFor="customFileInput"
//                       style={{ cursor: "pointer", color: "#007bff" }}
//                     >
//                       Click to select images
//                     </label>
//                   </div>

//                   {images.length > 0 && (
//                     <div className="mt-3">
//                       <p className="mb-2">Selected Images ({images.length}):</p>
//                       <div
//                         style={{
//                           display: "grid",
//                           gridTemplateColumns:
//                             "repeat(auto-fill, minmax(100px, 1fr))",
//                           gap: "12px",
//                         }}
//                       >
//                         {images.map((image, index) => (
//                           <div
//                             key={index}
//                             style={{
//                               border: "1px solid #ddd",
//                               borderRadius: "8px",
//                               padding: "6px",
//                               textAlign: "center",
//                               backgroundColor: "#fff",
//                               boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                             }}
//                           >
//                             <img
//                               src={URL.createObjectURL(image)}
//                               alt={image.name}
//                               style={{
//                                 width: "100%",
//                                 height: "80px",
//                                 objectFit: "cover",
//                                 borderRadius: "4px",
//                               }}
//                             />
//                             <div
//                               style={{
//                                 fontSize: "11px",
//                                 marginTop: "6px",
//                                 wordBreak: "break-all",
//                               }}
//                             >
//                               {image.name}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </Form.Group>
//               </div>
//             </div>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button type="default" onClick={handleCloseModal} disabled={loading}>
//             Cancel
//           </Button>
//           <Button
//             type="primary"
//             onClick={handleSaveChanges}
//             loading={loading}
//             disabled={
//               loading ||
//               !formData.accountBankName ||
//               !formData.numberBank ||
//               !formData.bankName
//             }
//           >
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default EditRefundButton;

// thêm feild amount:
import React, { useState, useEffect, useRef } from "react";
import { Modal, Form } from "react-bootstrap";
import { Button } from "antd";
import RefundService from "../../../services/RefundService/RefundService.js";
import { toast } from "react-toastify";

const EditRefundButton = ({ refund }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    numberBank: "",
    bankName: "",
    accountBankName: "",
    price: 0,
    amount: 0, // Added amount field
    description: "",
    status: "Pending",
  });
  const [images, setImages] = useState([]);
  const previewContainerRef = useRef(null);

  const handleOpenModal = async () => {
    if (!refund?.contractRefundId) {
      console.error("Invalid or missing contractRefundId:", refund);
      toast.error("Invalid refund data.");
      return;
    }

    setLoading(true);
    try {
      console.log(
        "Fetching refund for contractRefundId:",
        refund.contractRefundId
      );
      const response = await RefundService.GetContractRefundByContractRefundId(
        refund.contractRefundId
      );
      console.log("API response:", response);
      setFormData({
        numberBank: response.numberBank || "",
        bankName: response.bankName || "",
        accountBankName: response.accountBankName || "",
        price: response.price || 0,
        amount: response.amount || 0, // Set amount from API response
        description: response.description || "",
        status: response.status || "Pending",
      });
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching refund details:", error);
      toast.error("Failed to load refund details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImages([]);
    if (previewContainerRef.current) {
      previewContainerRef.current.innerHTML = "";
    }
    setFormData({
      numberBank: "",
      bankName: "",
      accountBankName: "",
      price: 0,
      amount: 0, // Reset amount
      description: "",
      status: "Pending",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    renderImagePreviews(selectedFiles);
  };

  const renderImagePreviews = (files) => {
    const container = previewContainerRef.current;
    if (!container) return;

    container.innerHTML = "";

    files.forEach((file) => {
      const imgUrl = URL.createObjectURL(file);
      const imgContainer = document.createElement("div");
      imgContainer.style.textAlign = "center";
      imgContainer.style.margin = "10px";

      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = file.name;
      img.style.maxWidth = "100px";
      img.style.maxHeight = "100px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "4px";

      const name = document.createElement("p");
      name.textContent = file.name;
      name.style.fontSize = "12px";
      name.style.marginTop = "5px";

      imgContainer.appendChild(img);
      imgContainer.appendChild(name);
      container.appendChild(imgContainer);
    });
  };

  const handleSaveChanges = async () => {
    if (!refund?.contractRefundId) {
      toast.error("Invalid refund ID.");
      return;
    }

    setLoading(true);
    try {
      const refundDetails =
        await RefundService.GetContractRefundByContractRefundId(
          refund.contractRefundId
        );
      const contractId = refundDetails.contractId;

      if (!contractId) {
        toast.error("Contract ID not found in refund details.");
        return;
      }

      if (images.length > 0) {
        await RefundService.sendContractImage(
          contractId,
          "RefundMoney",
          images
        );
      }

      await RefundService.updateRefund(
        refund.contractRefundId,
        contractId,
        formData.numberBank,
        formData.bankName,
        formData.accountBankName,
        formData.price,
        formData.description,
        images
      );

      toast.success("Refund updated successfully.");
      handleCloseModal();
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to update refund or upload images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewContainerRef.current) {
        const imgs = previewContainerRef.current.querySelectorAll("img");
        imgs.forEach((img) => URL.revokeObjectURL(img.src));
      }
    };
  }, []);

  return (
    <>
      <Button
        type="default"
        onClick={handleOpenModal}
        className="action-btn edit-btn"
        loading={loading}
        disabled={
          loading || !refund?.contractRefundId || refund?.status === "Paid"
        }
      >
        Edit
      </Button>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        className="refund-modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Refund</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="two-column-layout">
              <div className="column-left">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Form.Group
                    className="mb-3"
                    style={{ flex: 1, marginRight: "10px" }}
                  >
                    <Form.Label>Bank Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="numberBank"
                      value={formData.numberBank}
                      onChange={handleInputChange}
                      placeholder="Enter bank number"
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" style={{ flex: 1 }}>
                    <Form.Label>Bank Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Enter bank name"
                      readOnly
                    />
                  </Form.Group>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>Account Holder</Form.Label>
                  <Form.Control
                    type="text"
                    name="accountBankName"
                    value={formData.accountBankName}
                    onChange={handleInputChange}
                    placeholder="Enter account holder name"
                    readOnly
                  />
                </Form.Group>
              </div>

              <div className="column-right">
                <div style={{ display: "flex" }}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price Damage</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      required
                    />
                  </Form.Group>{" "}
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                  <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      name="amount"
                      value={formData.amount}
                      placeholder="Refund amount"
                      readOnly
                      className="mb-2"
                    />
                  </Form.Group>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Upload Images</Form.Label>
                  <div
                    style={{
                      border: "2px dashed #ccc",
                      padding: "20px",
                      borderRadius: "8px",
                      textAlign: "center",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Form.Control
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      id="customFileInput"
                    />
                    <label
                      htmlFor="customFileInput"
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      Click to select images
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-2">Selected Images ({images.length}):</p>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill, minmax(100px, 1fr))",
                          gap: "12px",
                        }}
                      >
                        {images.map((image, index) => (
                          <div
                            key={index}
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              padding: "6px",
                              textAlign: "center",
                              backgroundColor: "#fff",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={image.name}
                              style={{
                                width: "100%",
                                height: "80px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                            <div
                              style={{
                                fontSize: "11px",
                                marginTop: "6px",
                                wordBreak: "break-all",
                              }}
                            >
                              {image.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="default" onClick={handleCloseModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSaveChanges}
            loading={loading}
            disabled={
              loading ||
              !formData.accountBankName ||
              !formData.numberBank ||
              !formData.bankName
            }
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditRefundButton;
