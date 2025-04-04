// import React, { useState } from "react";
// import { Upload } from "lucide-react";
// import { Modal, Button, Form } from "react-bootstrap";

// const CostumeRequestModal = ({ show, handleClose }) => {
//   const [formData, setFormData] = useState({
//     costumeName: "",
//     description: "",
//     images: [],
//     requestDate: new Date().toLocaleDateString("en-GB"), // Format as dd/mm/yyyy
//     agreeToTerms: false,
//   });

//   const handleImageChange = (e) => {
//     if (e.target.files) {
//       setFormData({
//         ...formData,
//         images: [...Array.from(e.target.files)],
//       });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     handleClose();
//   };

//   return (
//     <Modal show={show} onHide={handleClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Costume Request</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form onSubmit={handleSubmit}>

//         <Form.Group className="mb-3">

//             <Form.Label>Category Name</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter Costume name"
//               value={formData.costumeName}
//               onChange={(e) =>
//                 setFormData({ ...formData, costumeName: e.target.value })
//               }
//               required
//             />
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Costume Name</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter Costume name"
//               value={formData.costumeName}
//               onChange={(e) =>
//                 setFormData({ ...formData, costumeName: e.target.value })
//               }
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Description</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               placeholder="Enter costume description"
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>minHeight</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={3}
//               placeholder="Enter costume description"
//               value={formData.description}
//               onChange={(e) =>
//                 setFormData({ ...formData, description: e.target.value })
//               }
//               required
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Costume Images</Form.Label>
//             <div className="upload-container">
//               <Form.Control
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 required
//               />
//               <div className="upload-icon">
//                 <Upload size={24} />
//               </div>
//             </div>
//             {formData.images.length > 0 && (
//               <small className="text-muted">
//                 {formData.images.length} file(s) selected
//               </small>
//             )}
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label>Request Date</Form.Label>
//             <Form.Control
//               type="text"
//               value={formData.requestDate}
//               readOnly
//               className="bg-light"
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Check
//               type="checkbox"
//               label=" Agree to terms: request must be submitted 1 month in advance"
//               checked={formData.agreeToTerms}
//               onChange={(e) =>
//                 setFormData({ ...formData, agreeToTerms: e.target.checked })
//               }
//               required
//             />
//           </Form.Group>

//           <div className="d-flex justify-content-end gap-2">
//             <Button variant="secondary" onClick={handleClose}>
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               type="submit"
//               disabled={!formData.agreeToTerms}
//             >
//               Submit Request
//             </Button>
//           </div>
//         </Form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default CostumeRequestModal;

import React, { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Modal, Button, Form } from "react-bootstrap";

import { jwtDecode } from "jwt-decode"; // Để decode JWT
import CostumeRequestService from "../../services/CostumeService/CostumeService.js";

const CostumeRequestModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    name: "",
    description: "",
    minHeight: "",
    maxHeight: "",
    minWeight: "",
    maxWeight: "",
    images: [],
    requestDate: new Date().toLocaleDateString("en-GB"), // Format as dd/mm/yyyy
    createBy: "",
    agreeToTerms: false,
  });

  const [categories, setCategories] = useState([]); // Danh sách danh mục từ API

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Lấy danh sách danh mục
        const categoriesData = await CostumeRequestService.getCategories();
        setCategories(categoriesData);

        // Lấy AccountName từ token
        const accountName = CostumeRequestService.getAccountNameFromToken();
        setFormData((prev) => ({ ...prev, createBy: accountName }));
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    // Decode accessToken từ localStorage để lấy createBy
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const accountName =
          decodedToken.AccountName || decodedToken.username || "Unknown"; // Điều chỉnh theo cấu trúc token
        setFormData((prev) => ({ ...prev, createBy: accountName }));
      } catch (error) {
        console.error("Error decoding token:", error);
        setFormData((prev) => ({ ...prev, createBy: "Unknown" }));
      }
    }
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: [...Array.from(e.target.files)],
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Costume Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* CategoryId (hiển thị name, lưu value là id) */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter Costume name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              placeholder="Enter costume description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* MinHeight */}
          <Form.Group className="mb-3">
            <Form.Label>Min Height (cm)</Form.Label>
            <Form.Control
              type="number"
              name="minHeight"
              placeholder="Enter min height"
              value={formData.minHeight}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* MaxHeight */}
          <Form.Group className="mb-3">
            <Form.Label>Max Height (cm)</Form.Label>
            <Form.Control
              type="number"
              name="maxHeight"
              placeholder="Enter max height"
              value={formData.maxHeight}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* MinWeight */}
          <Form.Group className="mb-3">
            <Form.Label>Min Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              name="minWeight"
              placeholder="Enter min weight"
              value={formData.minWeight}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* MaxWeight */}
          <Form.Group className="mb-3">
            <Form.Label>Max Weight (kg)</Form.Label>
            <Form.Control
              type="number"
              name="maxWeight"
              placeholder="Enter max weight"
              value={formData.maxWeight}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* CreateBy (read-only) */}
          <Form.Group className="mb-3">
            <Form.Label>Created By</Form.Label>
            <Form.Control
              type="text"
              name="createBy"
              value={formData.createBy}
              readOnly
              className="bg-light"
            />
          </Form.Group>

          {/* Images */}
          <Form.Group className="mb-3">
            <Form.Label>Costume Images</Form.Label>
            <div className="upload-container">
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <div className="upload-icon">
                <Upload size={24} />
              </div>
            </div>
            {formData.images.length > 0 && (
              <small className="text-muted">
                {formData.images.length} file(s) selected
              </small>
            )}
          </Form.Group>

          {/* Request Date */}
          <Form.Group className="mb-3">
            <Form.Label>Request Date</Form.Label>
            <Form.Control
              type="text"
              value={formData.requestDate}
              readOnly
              className="bg-light"
            />
          </Form.Group>

          {/* Agree to Terms */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label=" Agree to terms: request must be submitted 1 month in advance"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreeToTerms: e.target.checked })
              }
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!formData.agreeToTerms}
            >
              Submit Request
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CostumeRequestModal;
