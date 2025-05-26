// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Modal,
//   Form,
//   Card,
//   Pagination,
//   Dropdown,
//   FormCheck,
//   Row,
//   Col,
// } from "react-bootstrap";
// import SourvenirService from "../../../services/ManageServicePages/ManageSouvenirService/SouvenirService.js";
// import "../../../styles/Manager/ManageSouvenir.scss";
// import { Image, Popconfirm, message, Button } from "antd";
// import { toast } from "react-toastify";
// import { ArrowUp, ArrowDown, PlusCircle } from "lucide-react"; // Import PlusCircle từ lucide-react
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";

// const PLACEHOLDER_IMAGE_URL =
//   "https://www.elegantthemes.com/blog/wp-content/uploads/2020/08/000-http-error-codes.png";

// const ManageSouvenir = () => {
//   const [products, setProducts] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentProduct, setCurrentProduct] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     productName: "",
//     description: "",
//     quantity: "",
//     price: "",
//     isActive: true,
//   });
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortSouvenir, setSortSouvenir] = useState({
//     field: "productName",
//     order: "asc",
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const rowsPerPageOptions = [10, 20, 30];

//   const fetchProducts = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await SourvenirService.getAllProducts();
//       const processedData = data.map((product) => {
//         let displayImageUrl = PLACEHOLDER_IMAGE_URL;
//         if (
//           product.productImages &&
//           Array.isArray(product.productImages) &&
//           product.productImages.length > 0 &&
//           product.productImages[0]?.urlImage
//         ) {
//           displayImageUrl = product.productImages[0].urlImage;
//         }
//         return { ...product, displayImageUrl };
//       });
//       setProducts(processedData);
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch products."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const filterAndSortData = (data, search, sort) => {
//     let filtered = [...data];
//     if (search) {
//       filtered = filtered.filter(
//         (item) =>
//           (item.productName?.toLowerCase() || "").includes(search.toLowerCase()) ||
//           (item.description?.toLowerCase() || "").includes(search.toLowerCase())
//       );
//     }
//     return filtered.sort((a, b) => {
//       const valueA = String(a[sort.field]).toLowerCase();
//       const valueB = String(b[sort.field]).toLowerCase();
//       return sort.order === "asc"
//         ? valueA.localeCompare(valueB)
//         : valueB.localeCompare(valueA);
//     });
//   };

//   const filteredProducts = filterAndSortData(products, searchTerm, sortSouvenir);
//   const totalEntries = filteredProducts.length;
//   const totalPages = Math.ceil(totalEntries / rowsPerPage);
//   const paginatedProducts = paginateData(filteredProducts, currentPage);

//   function paginateData(data, page) {
//     const startIndex = (page - 1) * rowsPerPage;
//     const endIndex = startIndex + rowsPerPage;
//     return data.slice(startIndex, endIndex);
//   }

//   const startEntry = (currentPage - 1) * rowsPerPage + 1;
//   const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
//   const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

//   const handleShowModal = (product = null) => {
//     if (product) {
//       setIsEditing(true);
//       setCurrentProduct(product);
//       setFormData({
//         productName: product.productName ?? "",
//         description: product.description ?? "",
//         quantity: product.quantity ?? "",
//         price: product.price ?? "",
//         isActive: product.isActive ?? true,
//       });
//       setSelectedFiles([]);
//     } else {
//       setIsEditing(false);
//       setCurrentProduct(null);
//       setFormData({
//         productName: "",
//         description: "",
//         quantity: "",
//         price: "",
//         isActive: true,
//       });
//       setSelectedFiles([]);
//     }
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setIsEditing(false);
//     setCurrentProduct(null);
//     setSelectedFiles([]);
//   };

//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     const val = type === "number" ? (value === "" ? "" : Number(value)) : value;
//     setFormData((prev) => ({ ...prev, [name]: val }));
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     setSelectedFiles(files);
//   };

//   const handleSwitchChange = (e) => {
//     setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       if (isEditing && currentProduct?.productId) {
//         const payload = {
//           productName: formData.productName,
//           description: formData.description,
//           quantity: Number(formData.quantity) || 0,
//           price: Number(formData.price) || 0,
//           isActive: formData.isActive,
//         };
//         await SourvenirService.updateProduct(currentProduct.productId, payload);
//       } else {
//         const productData = {
//           ProductName: formData.productName,
//           Description: formData.description,
//           Quantity: Number(formData.quantity) || 0,
//           Price: Number(formData.price) || 0,
//           IsActive: formData.isActive,
//         };
//         await SourvenirService.createProduct(productData, selectedFiles);
//       }
//       handleCloseModal();
//       await fetchProducts();
//       toast.success("Product saved successfully!");
//     } catch (error) {
//       setError(
//         error.response?.data?.title ||
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to save souvenir."
//       );
//       toast.error("Failed to save souvenir.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleDelete = async (productId) => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await SourvenirService.deleteProduct(productId);
//       await fetchProducts();
//       message.success("Product disabled successfully!");
//     } catch (error) {
//       setError(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to disable souvenir."
//       );
//       message.error("Failed to disable souvenir.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleSort = (field) => {
//     setSortSouvenir((prev) => ({
//       field,
//       order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
//     }));
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page) => setCurrentPage(page);

//   const handleRowsPerPageChange = (value) => {
//     setRowsPerPage(value);
//     setCurrentPage(1);
//   };

//   const handleImageError = (event) => {
//     event.target.onerror = null;
//     event.target.src = PLACEHOLDER_IMAGE_URL;
//   };

//   return (
//     <div className="manage-souvenirs">
//       <h2 className="manage-souvenirs-title">Manage Souvenirs</h2>
//       <div className="table-container">
//         <Card className="souvenir-table-card">
//           <Card.Body>
//             <div className="table-header">
//               <h3>Souvenirs</h3>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name or description..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="search-input"
//               />
//               <Button
//                 type="primary"
//                 onClick={() => handleShowModal()}
//                 style={{
//                   padding: "20px 7px", // Chỉnh kích thước nút Add New Souvenir tại đây
//                   fontSize: "14px",
//                   borderRadius: "4px",
//                   background: "linear-gradient(135deg, #510545, #22668a)",
//                   border: "none",
//                   color: "#fff",
//                   display: "flex",
//                   alignItems: "center",
//                 }}
//                 onMouseEnter={(e) => (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")}
//                 onMouseLeave={(e) => (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")}
//               >
//                 <PlusCircle size={16} style={{ marginRight: "8px" }} />
//                 Add New Souvenir
//               </Button>
//             </div>
//             {isLoading && (
//               <Box sx={{ width: "100%", marginY: 2 }}>
//                 <LinearProgress />
//               </Box>
//             )}
//             {error && <p className="error-message">{error}</p>}
//             {!isLoading && !error && (
//               <>
//                 <Table striped bordered hover responsive>
//                   <thead>
//                     <tr>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("productName")}
//                         >
//                           Product Name
//                           {sortSouvenir.field === "productName" ? (
//                             sortSouvenir.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">Description</th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("quantity")}
//                         >
//                           Quantity
//                           {sortSouvenir.field === "quantity" ? (
//                             sortSouvenir.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("price")}
//                         >
//                           Price (VND)
//                           {sortSouvenir.field === "price" ? (
//                             sortSouvenir.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("createDate")}
//                         >
//                           Created Date
//                           {sortSouvenir.field === "createDate" ? (
//                             sortSouvenir.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("updateDate")}
//                         >
//                           Updated Date
//                           {sortSouvenir.field === "updateDate" ? (
//                             sortSouvenir.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">
//                         <span
//                           className="sortable"
//                           onClick={() => handleSort("isActive")}
//                         >
//                           Active
//                           {sortSouvenir.field === "isActive" ? (
//                             sortSouvenir.order === "asc" ? (
//                               <ArrowUp size={16} />
//                             ) : (
//                               <ArrowDown size={16} />
//                             )
//                           ) : (
//                             <ArrowUp size={16} className="default-sort-icon" />
//                           )}
//                         </span>
//                       </th>
//                       <th className="text-center">Image</th>
//                       <th className="text-center">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedProducts.length === 0 ? (
//                       <tr>
//                         <td colSpan="9" className="text-center text-muted">
//                           No souvenirs found {searchTerm && "matching your search"}.
//                         </td>
//                       </tr>
//                     ) : (
//                       paginatedProducts.map((product) => (
//                         <tr key={product.productId}>
//                           <td className="text-center">{product.productName}</td>
//                           <td className="text-center">{product.description?.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}</td>
//                           <td className="text-center">{product.quantity}</td>
//                           <td className="text-center">{product.price ? Number(product.price).toLocaleString("vi-VN") : "0"}</td>
//                           <td className="text-center">{product.createDate ? new Date(product.createDate).toLocaleDateString("vi-VN") : "N/A"}</td>
//                           <td className="text-center">{product.updateDate ? new Date(product.updateDate).toLocaleDateString("vi-VN") : "N/A"}</td>
//                           <td className="text-center">{product.isActive ? "Yes" : "No"}</td>
//                           <td className="text-center">
//                             <Image
//                               width={50}
//                               height={50}
//                               src={product.displayImageUrl}
//                               alt={product.productName}
//                               onError={handleImageError}
//                               style={{ objectFit: "cover" }}
//                             />
//                           </td>
//                           <td className="text-center">
//                             <Button
//                               type="primary"
//                               size="small"
//                               onClick={() => handleShowModal(product)}
//                               style={{
//                                 padding: "17px 14px", // Chỉnh kích thước nút Edit tại đây
//                                 fontSize: "14px",
//                                 borderRadius: "4px",
//                                 background: "linear-gradient(135deg, #510545, #22668a)",
//                                 border: "none",
//                                 color: "#fff",
//                                 marginRight: "8px",
//                               }}
//                               onMouseEnter={(e) => (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")}
//                               onMouseLeave={(e) => (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")}
//                             >
//                               Edit
//                             </Button>
//                             <Popconfirm
//                               title="Disable the product"
//                               description="Are you sure to disable this product?"
//                               onConfirm={() => handleDelete(product.productId)}
//                               onCancel={() => message.info("Cancelled")}
//                               okText="Yes"
//                               cancelText="No"
//                             >
//                               <Button
//                                 type="primary"
//                                 danger
//                                 size="small"
//                                 style={{
//                                   padding: "17px 14px", // Chỉnh kích thước nút Disable tại đây
//                                   fontSize: "14px",
//                                   borderRadius: "4px",
//                                   background: "#d32f2f",
//                                   border: "none",
//                                   color: "#fff",
//                                 }}
//                                 onMouseEnter={(e) => (e.target.style.background = "#b71c1c")}
//                                 onMouseLeave={(e) => (e.target.style.background = "#d32f2f")}
//                               >
//                                 Disable
//                               </Button>
//                             </Popconfirm>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </Table>
//                 <div className="pagination-controls">
//                   <div className="pagination-info">
//                     <span>{showingText}</span>
//                     <div className="rows-per-page">
//                       <span>Rows per page: </span>
//                       <Dropdown
//                         onSelect={(value) => handleRowsPerPageChange(Number(value))}
//                         className="d-inline-block"
//                       >
//                         <Dropdown.Toggle
//                           variant="secondary"
//                           id="dropdown-rows-per-page"
//                         >
//                           {rowsPerPage}
//                         </Dropdown.Toggle>
//                         <Dropdown.Menu>
//                           {rowsPerPageOptions.map((option) => (
//                             <Dropdown.Item key={option} eventKey={option}>
//                               {option}
//                             </Dropdown.Item>
//                           ))}
//                         </Dropdown.Menu>
//                       </Dropdown>
//                     </div>
//                   </div>
//                   <Pagination>
//                     <Pagination.First
//                       onClick={() => handlePageChange(1)}
//                       disabled={currentPage === 1}
//                     />
//                     <Pagination.Prev
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                     />
//                     {[...Array(totalPages).keys()].map((page) => (
//                       <Pagination.Item
//                         key={page + 1}
//                         active={page + 1 === currentPage}
//                         onClick={() => handlePageChange(page + 1)}
//                       >
//                         {page + 1}
//                       </Pagination.Item>
//                     ))}
//                     <Pagination.Next
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                     />
//                     <Pagination.Last
//                       onClick={() => handlePageChange(totalPages)}
//                       disabled={currentPage === totalPages}
//                     />
//                   </Pagination>
//                 </div>
//               </>
//             )}
//           </Card.Body>
//         </Card>
//       </div>

//       <Modal
//         show={showModal}
//         onHide={handleCloseModal}
//         centered
//         className="souvenir-modal"
//       >
//         <Modal.Header closeButton={!isLoading}>
//           <Modal.Title>
//             {isEditing ? "Edit Souvenir" : "Add New Souvenir"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && !isLoading && (
//             <p className="error-message">{error}</p>
//           )}
//           <Form onSubmit={handleSubmit}>
//             {isEditing && currentProduct && (
//               <Form.Group className="mb-3">
//                 <Form.Label>Product Image (View Only)</Form.Label>
//                 <div>
//                   <Image
//                     width={200} // Chỉnh kích thước hình trong modal Edit tại đây
//                     height={200} // Chỉnh kích thước hình trong modal Edit tại đây
//                     src={currentProduct.displayImageUrl}
//                     alt={formData.productName || "Product"}
//                     onError={handleImageError}
//                     style={{ objectFit: "cover" }}
//                     preview={false} // Tắt preview của Ant Design
//                   />
//                 </div>
//               </Form.Group>
//             )}
//             <Form.Group className="mb-3">
//               <Form.Label>Product Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="productName"
//                 value={formData.productName}
//                 onChange={handleInputChange}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter product name"
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 required
//                 disabled={isLoading}
//                 placeholder="Enter description"
//               />
//             </Form.Group>
//             <Row>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Quantity</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="quantity"
//                     value={formData.quantity}
//                     onChange={handleInputChange}
//                     required
//                     min="0"
//                     disabled={isLoading}
//                     placeholder="0"
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={6}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Price (VND)</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleInputChange}
//                     required
//                     min="0"
//                     step="1"
//                     disabled={isLoading}
//                     placeholder="0"
//                   />
//                   {formData.price && (
//                     <Form.Text className="text-muted">
//                       Formatted: {Number(formData.price).toLocaleString("vi-VN")} VND
//                     </Form.Text>
//                   )}
//                 </Form.Group>
//               </Col>
//             </Row>
//             {!isEditing && (
//               <Form.Group className="mb-3">
//                 <Form.Label>Upload Images</Form.Label>
//                 <Form.Control
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   disabled={isLoading}
//                 />
//                 {selectedFiles.length > 0 && (
//                   <div style={{ marginTop: "10px" }}>
//                     <Form.Label>Selected Images (View Only)</Form.Label>
//                     <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//                       {selectedFiles.map((file, index) => (
//                         <Image
//                           key={index}
//                           width={200} // Chỉnh kích thước hình trong modal Add tại đây
//                           height={200} // Chỉnh kích thước hình trong modal Add tại đây
//                           src={URL.createObjectURL(file)}
//                           alt={`Selected ${index + 1}`}
//                           style={{ objectFit: "cover" }}
//                           preview={false} // Tắt preview của Ant Design
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </Form.Group>
//             )}
//             <Form.Group className="mb-3">
//               <Form.Check
//                 type="switch"
//                 id="modalIsActiveSwitch"
//                 label="Active"
//                 name="isActive"
//                 checked={formData.isActive}
//                 onChange={handleSwitchChange}
//                 disabled={isLoading}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             type="default"
//             onClick={handleCloseModal}
//             disabled={isLoading}
//             style={{
//               padding: "5px 12px", // Chỉnh kích thước nút Cancel tại đây
//               fontSize: "14px",
//               borderRadius: "4px",
//               background: "#e0e0e0",
//               border: "none",
//               color: "#333",
//             }}
//             onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
//             onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
//           >
//             Cancel
//           </Button>
//           <Button
//             type="primary"
//             onClick={handleSubmit}
//             disabled={isLoading}
//             style={{
//               padding: "5px 12px", // Chỉnh kích thước nút Add/Update tại đây
//               fontSize: "14px",
//               borderRadius: "4px",
//               background: "linear-gradient(135deg, #510545, #22668a)",
//               border: "none",
//               color: "#fff",
//             }}
//             onMouseEnter={(e) => (e.target.style.background = "linear-gradient(135deg, #22668a, #510545)")}
//             onMouseLeave={(e) => (e.target.style.background = "linear-gradient(135deg, #510545, #22668a)")}
//           >
//             {isLoading
//               ? "Saving..."
//               : (isEditing ? "Update" : "Add") + " Souvenir"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ManageSouvenir;

//--------------------------------------------------------------------------------------//

//sửa ngày 26/05/2025

import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Form,
  Card,
  Pagination,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import SourvenirService from "../../../services/ManageServicePages/ManageSouvenirService/SouvenirService.js";
import "../../../styles/Manager/ManageSouvenir.scss";
import { Image, Popconfirm, message, Button } from "antd";
import { toast } from "react-toastify";
import { ArrowUp, ArrowDown, PlusCircle, XCircle } from "lucide-react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

// Hình ảnh mặc định khi không có ảnh
const PLACEHOLDER_IMAGE_URL =
  "https://www.elegantthemes.com/blog/wp-content/uploads/2020/08/000-http-error-codes.png";

const ManageSouvenir = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    quantity: "",
    price: "",
    isActive: true,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortSouvenir, setSortSouvenir] = useState({
    field: "productName",
    order: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const rowsPerPageOptions = [5, 10, 20];

  // Hàm lấy danh sách sản phẩm từ API, chỉ lấy ảnh đầu tiên cho bảng
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SourvenirService.getAllProducts();
      const processedData = data.map((product) => ({
        ...product,
        displayImageUrl: product.productImages?.length > 0
          ? product.productImages[0].urlImage
          : PLACEHOLDER_IMAGE_URL, // Chỉ lấy ảnh đầu tiên
      }));
      setProducts(processedData);
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Failed to fetch products."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filterAndSortData = (data, search, sort) => {
    let filtered = [...data];
    if (search) {
      filtered = filtered.filter(
        (item) =>
          (item.productName?.toLowerCase() || "").includes(search.toLowerCase()) ||
          (item.description?.toLowerCase() || "").includes(search.toLowerCase())
      );
    }
    return filtered.sort((a, b) => {
      const valueA = String(a[sort.field]).toLowerCase();
      const valueB = String(b[sort.field]).toLowerCase();
      return sort.order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  const filteredProducts = filterAndSortData(products, searchTerm, sortSouvenir);
  const totalEntries = filteredProducts.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage);
  const paginatedProducts = paginateData(filteredProducts, currentPage);

  function paginateData(data, page) {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex);
  }

  const startEntry = (currentPage - 1) * rowsPerPage + 1;
  const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);
  const showingText = `Showing ${startEntry} to ${endEntry} of ${totalEntries} entries`;

  const handleShowModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentProduct(product);
      setFormData({
        productName: product.productName ?? "",
        description: product.description ?? "",
        quantity: product.quantity ?? "",
        price: product.price ?? "",
        isActive: product.isActive ?? true,
      });
      setSelectedFiles([]);
    } else {
      setIsEditing(false);
      setCurrentProduct(null);
      setFormData({
        productName: "",
        description: "",
        quantity: "",
        price: "",
        isActive: true,
      });
      setSelectedFiles([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentProduct(null);
    setSelectedFiles([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? (value === "" ? "" : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, isActive: e.target.checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing && currentProduct?.productId) {
        const payload = {
          productName: formData.productName,
          description: formData.description,
          quantity: Number(formData.quantity) || 0,
          price: Number(formData.price) || 0,
          isActive: formData.isActive,
        };
        await SourvenirService.updateProduct(currentProduct.productId, payload);
      } else {
        const productData = {
          ProductName: formData.productName,
          Description: formData.description,
          Quantity: Number(formData.quantity) || 0,
          Price: Number(formData.price) || 0,
          IsActive: formData.isActive,
        };
        await SourvenirService.createProduct(productData, selectedFiles);
      }
      handleCloseModal();
      await fetchProducts();
      toast.success("Product saved successfully!");
    } catch (error) {
      setError(
        error.response?.data?.title ||
        error.response?.data?.message ||
        error.message ||
        "Failed to save souvenir."
      );
      toast.error("Failed to save souvenir.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    setIsLoading(true);
    setError(null);
    try {
      await SourvenirService.deleteProduct(productId);
      await fetchProducts();
      message.success("Product disabled successfully!");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to disable souvenir."
      );
      message.error("Failed to disable souvenir.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortSouvenir((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = PLACEHOLDER_IMAGE_URL;
  };

  return (
    <div className="manage-souvenirs">
      <h2 className="manage-souvenirs-title">Manage Souvenirs</h2>
      <div className="table-container">
        <Card className="souvenir-table-card">
          <Card.Body>
            <div className="table-header">
              <h3>Souvenirs</h3>
              <Form.Control
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
              <Button
                type="primary"
                onClick={() => handleShowModal()}
                style={{
                  padding: "20px 7px",
                  fontSize: "14px",
                  borderRadius: "4px",
                  background: "linear-gradient(135deg, #660545, #22668a)",
                  border: "none",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) => (e.target.style.background = "linear-gradient(135deg, #22668a, #660545)")}
                onMouseLeave={(e) => (e.target.style.background = "linear-gradient(135deg, #660545, #22668a)")}
              >
                <PlusCircle size={16} style={{ marginRight: "8px" }} />
                Add New Souvenir
              </Button>
            </div>
            {isLoading && (
              <Box sx={{ width: "100%", marginY: 2 }}>
                <LinearProgress />
              </Box>
            )}
            {error && <p className="error-message">{error}</p>}
            {!isLoading && !error && (
              <>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("productName")}>
                          Product Name
                          {sortSouvenir.field === "productName" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Description</th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("quantity")}>
                          Quantity
                          {sortSouvenir.field === "quantity" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("price")}>
                          Price (VND)
                          {sortSouvenir.field === "price" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("createDate")}>
                          Created Date
                          {sortSouvenir.field === "createDate" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("updateDate")}>
                          Updated Date
                          {sortSouvenir.field === "updateDate" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">
                        <span className="sortable" onClick={() => handleSort("isActive")}>
                          Active
                          {sortSouvenir.field === "isActive" ? (
                            sortSouvenir.order === "asc" ? (
                              <ArrowUp size={16} />
                            ) : (
                              <ArrowDown size={16} />
                            )
                          ) : (
                            <ArrowUp size={16} className="default-sort-icon" />
                          )}
                        </span>
                      </th>
                      <th className="text-center">Images</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center text-muted">
                          No souvenirs found {searchTerm && "matching your search"}.
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((product) => (
                        <tr key={product.productId}>
                          <td className="text-center">{product.productName}</td>
                          <td className="text-center">
                            {product.description?.length > 50
                              ? `${product.description.substring(0, 50)}...`
                              : product.description}
                          </td>
                          <td className="text-center">{product.quantity}</td>
                          <td className="text-center">
                            {product.price ? Number(product.price).toLocaleString("vi-VN") : "0"}
                          </td>
                          <td className="text-center">
                            {product.createDate
                              ? new Date(product.createDate).toLocaleDateString("vi-VN")
                              : "N/A"}
                          </td>
                          <td className="text-center">
                            {product.updateDate
                              ? new Date(product.updateDate).toLocaleDateString("vi-VN")
                              : "N/A"}
                          </td>
                          <td className="text-center">{product.isActive ? "Yes" : "No"}</td>
                          <td className="text-center">
                            <Image.PreviewGroup
                              items={
                                product.productImages?.length > 0
                                  ? product.productImages.map((img) => img.urlImage)
                                  : [PLACEHOLDER_IMAGE_URL]
                              }
                            >
                              <Image
                                width={50}
                                height={50}
                                src={product.displayImageUrl}
                                alt={`${product.productName} Image`}
                                onError={handleImageError}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  border: "1px solid #dee2e6",
                                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                                  cursor: "pointer",
                                }}
                                preview={true}
                              />
                            </Image.PreviewGroup>
                          </td>
                          <td className="text-center">
                            <Button
                              type="primary"
                              size="small"
                              onClick={() => handleShowModal(product)}
                              style={{
                                padding: "17px 14px",
                                fontSize: "14px",
                                borderRadius: "4px",
                                background: "linear-gradient(135deg, #660545, #22668a)",
                                border: "none",
                                color: "#fff",
                                marginRight: "8px",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.background = "linear-gradient(135deg, #22668a, #660545)")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.background = "linear-gradient(135deg, #660545, #22668a)")
                              }
                            >
                              Edit
                            </Button>
                            <Popconfirm
                              title="Disable the product"
                              description="Are you sure to disable this product?"
                              onConfirm={() => handleDelete(product.productId)}
                              onCancel={() => message.info("Cancelled")}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                type="primary"
                                danger
                                size="small"
                                style={{
                                  padding: "17px 14px",
                                  fontSize: "14px",
                                  borderRadius: "4px",
                                  background: "#d32f2f",
                                  border: "none",
                                  color: "#fff",
                                }}
                                onMouseEnter={(e) => (e.target.style.background = "#b71c1c")}
                                onMouseLeave={(e) => (e.target.style.background = "#d32f2f")}
                              >
                                Disable
                              </Button>
                            </Popconfirm>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
                <div
                  className="pagination-controls"
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}
                >
                  <div className="pagination-info">
                    <span>{showingText}</span>
                    <div style={{ display: "inline-block", marginLeft: "10px" }}>
                      <span>Rows per page: </span>
                      <Dropdown
                        onSelect={(value) => handleRowsPerPageChange(Number(value))}
                        className="d-inline-block"
                      >
                        <Dropdown.Toggle variant="secondary" id="dropdown-rows-per-page">
                          {rowsPerPage}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {rowsPerPageOptions.map((option) => (
                            <Dropdown.Item key={option} eventKey={option}>
                              {option}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>
                  <Pagination>
                    <Pagination.First
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages).keys()].map((page) => (
                      <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered className="souvenir-modal">
        <Modal.Header closeButton={!isLoading}>
          <Modal.Title>{isEditing ? "Edit Souvenir" : "Add New Souvenir"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && !isLoading && <p className="error-message">{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="Enter product name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                placeholder="Enter description"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    disabled={isLoading}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (VND)</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="1"
                    disabled={isLoading}
                    placeholder="0"
                  />
                  {formData.price && (
                    <Form.Text className="text-muted">
                      Formatted: {Number(formData.price).toLocaleString("vi-VN")} VND
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            {!isEditing && (
              <Form.Group className="mb-3">
                <Form.Label>Upload Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                {selectedFiles.length > 0 && (
                  <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                    <Form.Label style={{ fontWeight: "500", color: "#333", marginBottom: "8px", display: "block" }}>
                      Selected Images (Click 'X' to remove)
                    </Form.Label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "flex-start" }}>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            width: "120px",
                            height: "120px",
                            border: "1px solid #dee2e6",
                            borderRadius: "5px",
                            overflow: "hidden",
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Image
                            width={120}
                            height={120}
                            src={URL.createObjectURL(file)}
                            alt={`Selected ${index + 1}`}
                            style={{ objectFit: "cover", display: "block" }}
                            preview={false}
                          />
                          <XCircle
                            size={24}
                            color="#dc3545"
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              cursor: "pointer",
                              backgroundColor: "#fff",
                              borderRadius: "50%",
                              padding: "3px",
                              transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            onClick={() => handleRemoveImage(index)}
                            onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
                            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Form.Group>
            )}
            {isEditing && currentProduct && (
              <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: "500", color: "#333" }}>
                  Product Images
                </Form.Label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "10px",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "5px",
                  }}
                >
                  {currentProduct.productImages?.length > 0 ? (
                    currentProduct.productImages.map((img, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          width: "150px",
                          height: "150px",
                        }}
                      >
                        <Image
                          width={150}
                          height={150}
                          src={img.urlImage}
                          alt={`${formData.productName || "Product"} ${index + 1}`}
                          onError={handleImageError}
                          style={{
                            objectFit: "cover",
                            borderRadius: "5px",
                            border: "2px solid #660545",
                            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                            transition: "transform 0.2s, border-color 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.05)";
                            e.target.style.borderColor = "#22668a";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                            e.target.style.borderColor = "#660545";
                          }}
                          preview={false}
                        />
                      </div>
                    ))
                  ) : (
                    <Image
                      width={150}
                      height={150}
                      src={PLACEHOLDER_IMAGE_URL}
                      alt="No image"
                      style={{
                        objectFit: "cover",
                        borderRadius: "5px",
                        border: "2px solid #dee2e6",
                      }}
                      preview={false}
                    />
                  )}
                </div>
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="modalIsActiveSwitch"
                label="Active"
                name="isActive"
                checked={formData.isActive}
                onChange={handleSwitchChange}
                disabled={isLoading}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="default"
            onClick={handleCloseModal}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              borderRadius: "4px",
              background: "#e0e0e0",
              border: "none",
              color: "#333",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#d0d0d0")}
            onMouseLeave={(e) => (e.target.style.background = "#e0e0e0")}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              borderRadius: "4px",
              background: "linear-gradient(135deg, #660545, #22668a)",
              border: "none",
              color: "#fff",
            }}
            onMouseEnter={(e) => (e.target.style.background = "linear-gradient(135deg, #22668a, #660545)")}
            onMouseLeave={(e) => (e.target.style.background = "linear-gradient(135deg, #660545, #22668a)")}
          >
            {isLoading ? "Saving..." : (isEditing ? "Update" : "Add") + " Souvenir"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageSouvenir;