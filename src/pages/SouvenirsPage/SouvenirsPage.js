// // Nhập các thư viện và component cần thiết
// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Modal, Button, Form, Carousel } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import "../../styles/SouvenirsPage.scss";
// import ProductService from "../../services/ProductService/ProductService";
// import ProductDeliveryService from "../../services/ProductDeliveryService/ProductDeliveryService";
// import CartService from "../../services/CartService/CartService";
// import PaymentService from "../../services/PaymentService/PaymentService";
// import { apiClient } from "../../api/apiClient.js";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { jwtDecode } from "jwt-decode";
// import { Pagination } from "antd";

// const SouvenirsPage = () => {
//   // Khởi tạo các state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchError, setSearchError] = useState("");
//   const [showSouvenirModal, setShowSouvenirModal] = useState(false);
//   const [selectedSouvenir, setSelectedSouvenir] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showDeliveryModal, setShowDeliveryModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showSummaryModal, setShowSummaryModal] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [accountId, setAccountId] = useState(null);
//   const [accountName, setAccountName] = useState(null);
//   const [cartId, setCartId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const [phone, setPhone] = useState("");
//   const [phoneError, setPhoneError] = useState("");
//   const [address, setAddress] = useState("");
//   const [addressError, setAddressError] = useState("");
//   const [provinceError, setProvinceError] = useState("");
//   const [districtError, setDistrictError] = useState("");
//   const [wardError, setWardError] = useState("");
//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [wards, setWards] = useState([]);
//   const [selectedProvince, setSelectedProvince] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedWard, setSelectedWard] = useState("");
//   const [toDistrictId, setToDistrictId] = useState("");
//   const [toWardCode, setToWardCode] = useState("");
//   const [description, setDescription] = useState("");
//   const [descriptionError, setDescriptionError] = useState("");
//   const [deliveryFee, setDeliveryFee] = useState(0);
//   const [tempOrderId, setTempOrderId] = useState(null); // Lưu orderId tạm thời

//   const navigate = useNavigate();

//   // Hàm định dạng giá tiền sang VND
//   const formatPrice = (price) => {
//     return `${price.toLocaleString("vi-VN")} VND`;
//   };

//   // Lấy thông tin tài khoản từ token
//   const getAccountInfoFromToken = () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         return {
//           id: decoded?.Id,
//           accountName: decoded?.AccountName,
//         };
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   // Lấy danh sách sản phẩm
//   const fetchProducts = async () => {
//     try {
//       const combinedData = await ProductService.getCombinedProductData();
//       setProducts(combinedData);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   // Lấy danh sách tỉnh/thành phố
//   const fetchProvinces = async () => {
//     try {
//       const provincesData = await ProductDeliveryService.getProvinces();
//       setProvinces(provincesData);
//       console.log("Provinces fetched:", provincesData);
//     } catch (error) {
//       toast.error(error.message);
//       console.error("Fetch provinces error:", error);
//     }
//   };

//   // Lấy danh sách quận/huyện
//   const fetchDistricts = async (provinceId) => {
//     try {
//       const districtsData = await ProductDeliveryService.getDistricts(provinceId);
//       setDistricts(districtsData);
//       setWards([]);
//       setSelectedDistrict("");
//       setSelectedWard("");
//       setToDistrictId("");
//       setToWardCode("");
//       console.log("Districts fetched for provinceId", provinceId, ":", districtsData);
//     } catch (error) {
//       toast.error(error.message);
//       console.error("Fetch districts error:", error);
//     }
//   };

//   // Lấy danh sách phường/xã
//   const fetchWards = async (districtId) => {
//     try {
//       const wardsData = await ProductDeliveryService.getWards(districtId);
//       setWards(wardsData);
//       setSelectedWard("");
//       setToWardCode("");
//       console.log("Wards fetched for districtId", districtId, ":", wardsData);
//     } catch (error) {
//       toast.error(error.message);
//       console.error("Fetch wards error:", error);
//     }
//   };

//   // Khởi tạo dữ liệu khi component mount
//   useEffect(() => {
//     const accountInfo = getAccountInfoFromToken();
//     if (accountInfo) {
//       setAccountId(accountInfo.id);
//       setAccountName(accountInfo.accountName);
//     }

//     if (accountInfo?.id) {
//       CartService.getCartByAccountId(accountInfo.id).then((cartData) => {
//         setCartId(cartData.cartId);
//       });
//     }

//     fetchProducts();
//     fetchProvinces();

//     window.addEventListener("storageUpdate", fetchProducts);
//     return () => {
//       window.removeEventListener("storageUpdate", fetchProducts);
//     };
//   }, []);

//   // Mở modal chi tiết sản phẩm
//   const handleSouvenirShow = (souvenir) => {
//     setSelectedSouvenir(souvenir);
//     setShowSouvenirModal(true);
//     console.log("Opening souvenir modal for:", souvenir.name);
//   };

//   // Đóng modal và reset state
//   const handleSouvenirClose = () => {
//     setShowSouvenirModal(false);
//     setSelectedSouvenir(null);
//     setQuantity(1);
//     setShowDeliveryModal(false);
//     setShowPaymentModal(false);
//     setShowSummaryModal(false);
//     setPaymentMethod(null);
//     setPhone("");
//     setPhoneError("");
//     setAddress("");
//     setAddressError("");
//     setSelectedProvince("");
//     setSelectedDistrict("");
//     setSelectedWard("");
//     setToDistrictId("");
//     setToWardCode("");
//     setProvinceError("");
//     setDistrictError("");
//     setWardError("");
//     setDescription("");
//     setDescriptionError("");
//     setDeliveryFee(0);
//     setTempOrderId(null); // Reset tempOrderId
//     console.log("Closing souvenir modal");
//   };

//   // Tăng số lượng sản phẩm
//   const handleIncrease = () => {
//     if (selectedSouvenir && quantity < selectedSouvenir.quantity) {
//       setQuantity((prev) => prev + 1);
//     } else {
//       toast.error("Quantity cannot exceed available stock.");
//     }
//   };

//   // Giảm số lượng sản phẩm
//   const handleDecrease = () => {
//     if (quantity > 1) {
//       setQuantity((prev) => prev - 1);
//     } else {
//       toast.error("Quantity must be at least 1.");
//     }
//   };

//   // Mở modal thông tin giao hàng
//   const handleBuyNow = () => {
//     setShowDeliveryModal(true);
//     console.log("Opening delivery modal");
//     setTimeout(() => {
//       const deliveryForm = document.querySelector(".fest-purchase-form");
//       if (deliveryForm) {
//         deliveryForm.scrollIntoView({ behavior: "smooth", block: "start" });
//       }
//     }, 100);
//   };

//   // Thêm sản phẩm vào giỏ hàng
//   const handleAddToCart = async () => {
//     if (!accountId || !cartId) {
//       toast.error("Please log in to add items to your cart!");
//       return;
//     }
//     try {
//       const productData = [{ productId: selectedSouvenir.id, quantity }];
//       await CartService.addProductToCart(cartId, productData);
//       toast.success(`${selectedSouvenir.name} has been added to your cart!`);
//       window.dispatchEvent(new Event("storageUpdate"));
//       handleSouvenirClose();
//     } catch (error) {
//       toast.error(error.message);
//       console.error("Add to cart error:", error);
//     }
//   };

//   // Xác thực số điện thoại
//   const validatePhoneNumber = (value) => {
//     if (!value) {
//       return "Phone number is required.";
//     }
//     if (!value.startsWith("0")) {
//       return "Phone number must start with 0.";
//     }
//     return "";
//   };

//   // Xử lý thay đổi số điện thoại
//   const handlePhoneChange = (e) => {
//     const value = e.target.value;
//     if (/^\d*$/.test(value) && value.length <= 11) {
//       setPhone(value);
//       const error = validatePhoneNumber(value);
//       setPhoneError(error);
//     } else if (!/^\d*$/.test(value)) {
//       toast.error("Phone number must contain only digits.");
//     } else if (value.length > 11) {
//       toast.error("Phone number must not exceed 11 digits.");
//     }
//   };

//   // Xác thực địa chỉ
//   const validateAddress = (value) => {
//     if (!value) {
//       return "Address is required.";
//     }
//     if (value.length < 5) {
//       return "Address must be at least 5 characters long.";
//     }
//     if (value.length > 100) {
//       return "Address must not exceed 100 characters.";
//     }
//     if (/[<>{}!@#$%^&*()+=[\]|\\:;"'?~`]/.test(value)) {
//       return "Address contains invalid special characters.";
//     }
//     return "";
//   };

//   // Xử lý thay đổi địa chỉ
//   const handleAddressChange = (e) => {
//     const value = e.target.value;
//     setAddress(value);
//     const error = validateAddress(value);
//     setAddressError(error);
//   };

//   // Xác thực mô tả
//   const validateDescription = (value) => {
//     if (value && value.length > 200) {
//       return "Description must not exceed 200 characters.";
//     }
//     if (value && /[<>{}!@#$%^&*()+=[\]|\\:;"'?~`]/.test(value)) {
//       return "Description contains invalid special characters.";
//     }
//     return "";
//   };

//   // Xử lý thay đổi mô tả
//   const handleDescriptionChange = (e) => {
//     const value = e.target.value;
//     setDescription(value);
//     const error = validateDescription(value);
//     setDescriptionError(error);
//   };

//   // Xác thực tỉnh/thành phố
//   const validateProvince = (value) => {
//     if (!value) {
//       return "Please select a province/city.";
//     }
//     const province = provinces.find((p) => String(p.provinceId) === String(value));
//     if (!province) {
//       return "Invalid province selected.";
//     }
//     return "";
//   };

//   // Xác thực quận/huyện
//   const validateDistrict = (value) => {
//     if (!value) {
//       return "Please select a district.";
//     }
//     const district = districts.find((d) => String(d.districtId) === String(value));
//     if (!district) {
//       return "Invalid district selected.";
//     }
//     return "";
//   };

//   // Xác thực phường/xã
//   const validateWard = (value) => {
//     if (!value) {
//       return "Please select a ward.";
//     }
//     const ward = wards.find((w) => String(w.wardCode) === String(value));
//     if (!ward) {
//       return "Invalid ward selected.";
//     }
//     return "";
//   };

//   // Xử lý thay đổi tỉnh/thành phố
//   const handleProvinceChange = (e) => {
//     const value = e.target.value;
//     setSelectedProvince(value);
//     const error = validateProvince(value);
//     setProvinceError(error);
//     if (value) {
//       fetchDistricts(value);
//     } else {
//       setDistricts([]);
//       setWards([]);
//       setSelectedDistrict("");
//       setSelectedWard("");
//       setToDistrictId("");
//       setToWardCode("");
//       setDistrictError("");
//       setWardError("");
//     }
//   };

//   // Xử lý thay đổi quận/huyện
//   const handleDistrictChange = (e) => {
//     const value = e.target.value;
//     setSelectedDistrict(value);
//     const error = validateDistrict(value);
//     setDistrictError(error);
//     const selected = districts.find((d) => d.districtId === parseInt(value));
//     const districtId = selected ? selected.districtId.toString() : "";
//     setToDistrictId(districtId);
//     if (value) {
//       fetchWards(value);
//     } else {
//       setWards([]);
//       setSelectedWard("");
//       setToWardCode("");
//       setWardError("");
//     }
//   };

//   // Xử lý thay đổi phường/xã
//   const handleWardChange = (e) => {
//     const value = e.target.value;
//     setSelectedWard(value);
//     const error = validateWard(value);
//     setWardError(error);
//     const selected = wards.find((w) => String(w.wardCode) === String(value));
//     const wardCode = selected ? String(selected.wardCode) : String(value);
//     setToWardCode(wardCode);
//   };

//   // Xác thực tìm kiếm
//   const validateSearch = (value) => {
//     if (value.length > 50) {
//       return "Search term must not exceed 50 characters.";
//     }
//     if (!/^[a-zA-Z0-9\s-_]*$/.test(value)) {
//       return "Search term contains invalid characters.";
//     }
//     return "";
//   };

//   // Xử lý thay đổi tìm kiếm
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     const error = validateSearch(value);
//     setSearchError(error);
//     if (!error) {
//       setSearchTerm(value);
//     } else {
//       toast.error(error);
//     }
//   };

//   // Xác nhận thông tin giao hàng
//   const handleDeliveryConfirm = () => {
//     console.log("Delivery info check:", {
//       phone,
//       address,
//       selectedProvince,
//       selectedDistrict,
//       selectedWard,
//       toDistrictId,
//       toWardCode,
//       description,
//     });

//     const phoneErr = validatePhoneNumber(phone);
//     const addressErr = validateAddress(address);
//     const provinceErr = validateProvince(selectedProvince);
//     const districtErr = validateDistrict(selectedDistrict);
//     const wardErr = validateWard(selectedWard);
//     const descriptionErr = validateDescription(description);

//     setPhoneError(phoneErr);
//     setAddressError(addressErr);
//     setProvinceError(provinceErr);
//     setDistrictError(districtErr);
//     setWardError(wardErr);
//     setDescriptionError(descriptionErr);

//     if (phoneErr || addressErr || provinceErr || districtErr || wardErr || descriptionErr) {
//       const errors = [
//         phoneErr,
//         addressErr,
//         provinceErr,
//         districtErr,
//         wardErr,
//         descriptionErr,
//       ].filter(Boolean);
//       toast.error(errors.join(" "));
//       console.error("Validation errors:", errors);
//       return;
//     }

//     console.log("Delivery confirmed:", {
//       phone,
//       address,
//       toDistrictId,
//       toWardCode,
//       description,
//     });
//     setShowPaymentModal(true);
//     setTimeout(() => {
//       const paymentModal = document.getElementById("payment-modal");
//       if (paymentModal) {
//         paymentModal.scrollIntoView({ behavior: "smooth", block: "start" });
//       }
//     }, 100);
//   };

//   // Xác nhận mua hàng và tính phí giao hàng
//   const handleConfirmPurchase = async () => {
//     if (!paymentMethod) {
//       toast.error("Please select a payment method!");
//       return;
//     }
//     try {
//       const orderId = await createOrder();
//       console.log("OrderId:", orderId);
//       setTempOrderId(orderId);

//       let fee = 0;
//       try {
//         fee = await ProductDeliveryService.calculateDeliveryFee(orderId);
//       } catch (feeError) {
//         console.error("Failed to calculate delivery fee:", feeError);
//         toast.warn("Unable to calculate delivery fee. Proceeding with 0 VND.");
//       }
//       setDeliveryFee(fee);
//       console.log("Delivery fee:", fee);

//       setShowPaymentModal(false);
//       setShowSummaryModal(true);
//       setTimeout(() => {
//         const summaryModal = document.getElementById("summary-modal");
//         if (summaryModal) {
//           summaryModal.scrollIntoView({ behavior: "smooth", block: "start" });
//         }
//       }, 100);
//     } catch (error) {
//       console.error("Error in handleConfirmPurchase:", error);
//       toast.error(error.message);
//     }
//   };

//   // Tạo đơn hàng
//   const createOrder = async () => {
//     try {
//       const orderData = {
//         accountId: accountId,
//         address: address,
//         phone: phone,
//         to_district_id: toDistrictId,
//         to_ward_code: toWardCode,
//         description: description || null,
//         orderProducts: [
//           {
//             productId: selectedSouvenir.id,
//             quantity: quantity,
//             createDate: new Date().toISOString(),
//           },
//         ],
//       };
//       console.log("Order payload:", orderData);
//       const response = await apiClient.post("/api/Order", orderData);
//       console.log("Order response:", response.data);
//       return response.data; // Trả về orderId
//     } catch (error) {
//       console.error("Create order error:", error.response?.data || error.message);
//       toast.error(error.response?.data?.message || "Failed to create order");
//       throw error;
//     }
//   };

//   // Xác nhận cuối cùng để thanh toán
//   const handleFinalConfirm = async () => {
//     const productTotal = selectedSouvenir.price * quantity;
//     const totalAmount = productTotal + deliveryFee;

//     if (!accountId) {
//       toast.error("Please log in to proceed with payment!");
//       return;
//     }

//     try {
//       const orderId = tempOrderId || (await createOrder());
//       console.log("OrderId:", orderId);

//       const paymentData = {
//         fullName: accountName || "Unknown",
//         orderInfo: `Purchase ${quantity} ${selectedSouvenir.name}(s)`,
//         amount: totalAmount,
//         purpose: 3,
//         accountId: accountId,
//         accountCouponId: null,
//         ticketId: null,
//         ticketQuantity: null,
//         contractId: null,
//         orderpaymentId: orderId,
//         isWeb: true,
//       };
//       console.log("Payment payload:", paymentData);

//       let paymentUrl;
//       if (paymentMethod === "Momo") {
//         paymentUrl = await PaymentService.createMomoPayment(paymentData);
//         console.log("Momo payment URL:", paymentUrl);
//       } else if (paymentMethod === "VNPay") {
//         paymentUrl = await PaymentService.createVnpayPayment(paymentData);
//         console.log("VNPay payment URL:", paymentUrl);
//       }

//       toast.success(`Redirecting to ${paymentMethod} payment...`);
//       setTimeout(() => {
//         localStorage.setItem("paymentSource", "souvenirs");
//         window.location.href = paymentUrl;
//       }, 3000);
//     } catch (error) {
//       console.error("Payment error:", error.response?.data || error.message);
//       toast.error(error.message);
//       setShowSummaryModal(false);
//     }
//   };

//   // Quay lại modal thanh toán
//   const handleBackToPayment = () => {
//     setShowSummaryModal(false);
//     setShowPaymentModal(true);
//     console.log("Back to payment modal");
//     setTimeout(() => {
//       const paymentModal = document.getElementById("payment-modal");
//       if (paymentModal) {
//         paymentModal.scrollIntoView({ behavior: "smooth", block: "start" });
//       }
//     }, 100);
//   };

//   // Quay lại modal giao hàng
//   const handleBackToDelivery = () => {
//     setShowPaymentModal(false);
//     setShowDeliveryModal(true);
//     console.log("Back to delivery modal");
//   };

//   // Lọc danh sách sản phẩm theo tìm kiếm
//   const filteredSouvenirs = products.filter((souvenir) =>
//     souvenir.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Phân trang sản phẩm
//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const paginatedSouvenirs = filteredSouvenirs.slice(startIndex, endIndex);

//   // Xử lý thay đổi trang
//   const handlePageChange = (page, pageSize) => {
//     setCurrentPage(page);
//     setPageSize(pageSize);
//   };

//   // Lấy tên tỉnh/thành phố
//   const getProvinceName = (provinceId) => {
//     const province = provinces.find((p) => String(p.provinceId) === String(provinceId));
//     console.log("getProvinceName:", { provinceId, provinceIdType: typeof provinceId, province });
//     return province ? province.provinceName : "N/A";
//   };

//   // Lấy tên quận/huyện
//   const getDistrictName = (districtId) => {
//     const district = districts.find((d) => String(d.districtId) === String(districtId));
//     console.log("getDistrictName:", { districtId, districtIdType: typeof districtId, district });
//     return district ? district.districtName : "N/A";
//   };

//   // Lấy tên phường/xã
//   const getWardName = (wardCode) => {
//     const ward = wards.find((w) => String(w.wardCode) === String(wardCode));
//     console.log("getWardName:", { wardCode, wardCodeType: typeof wardCode, ward });
//     return ward ? ward.wardName : "N/A";
//   };

//   // Hiển thị khi đang tải
//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       </div>
//     );
//   }

//   // Hiển thị khi có lỗi
//   if (error) {
//     return (
//       <div className="text-center py-5 text-danger">
//         {error}
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       </div>
//     );
//   }

//   // Giao diện chính
//   return (
//     <div className="costume-rental-page min-vh-100">
//       <div className="hero-section text-white py-5">
//         <div className="container">
//           <h1 className="display-4 fw-bold text-center">Souvenir Store</h1>
//           <p className="lead text-center mt-3">
//             Find and buy the perfect souvenirs
//           </p>
//         </div>
//       </div>

//       <div className="container py-5">
//         <div className="search-container mb-5">
//           <div className="search-bar mx-auto">
//             <div className="input-group">
//               <span className="input-group-text">
//                 <Search size={20} />
//               </span>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search souvenirs..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//               />
//             </div>
//             {searchError && (
//               <Form.Text className="text-danger">{searchError}</Form.Text>
//             )}
//           </div>
//         </div>

//         <div className="costume-grid">
//           {paginatedSouvenirs.map((souvenir) => (
//             <div className="costume-card" key={souvenir.id}>
//               <div className="card-image">
//                 <img
//                   src={souvenir.image}
//                   alt={souvenir.name}
//                   className="img-fluid"
//                 />
//               </div>
//               <div className="card-content">
//                 <h5 className="costume-name">{souvenir.name}</h5>
//                 <div className="price-and-button">
//                   <p className="costume-category">{formatPrice(souvenir.price)}</p>
//                   <button
//                     className="rent-button"
//                     onClick={() => handleSouvenirShow(souvenir)}
//                   >
//                     Buy Now!
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredSouvenirs.length === 0 ? (
//           <p className="text-center mt-4">No souvenirs found.</p>
//         ) : (
//           <div className="pagination-container mt-5">
//             <Pagination
//               current={currentPage}
//               pageSize={pageSize}
//               total={filteredSouvenirs.length}
//               onChange={handlePageChange}
//               showSizeChanger
//               pageSizeOptions={["4", "8", "12", "16"]}
//               showTotal={(total, range) =>
//                 `${range[0]}-${range[1]} of ${total} items`
//               }
//             />
//           </div>
//         )}
//       </div>

//       <Modal
//         show={showSouvenirModal}
//         onHide={handleSouvenirClose}
//         size="lg"
//         centered
//         className="gallery-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedSouvenir?.name} Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedSouvenir && (
//             <div className="costume-gallery">
//               <Carousel className="gallery-carousel">
//                 <Carousel.Item>
//                   <div className="carousel-image-container">
//                     <img
//                       className="d-block w-100"
//                       src={selectedSouvenir.image}
//                       alt={selectedSouvenir.name}
//                     />
//                   </div>
//                   <Carousel.Caption>
//                     <h3>{selectedSouvenir.name}</h3>
//                     <p>Image 1 of 1</p>
//                   </Carousel.Caption>
//                 </Carousel.Item>
//               </Carousel>

//               <div className="fest-details mt-4">
//                 <h4>About {selectedSouvenir.name}</h4>
//                 <p>{selectedSouvenir.description}</p>
//                 <div className="fest-info">
//                   <div className="fest-info-item">
//                     <strong>Price:</strong> {formatPrice(selectedSouvenir.price)}
//                   </div>
//                   <div className="fest-info-item">
//                     <strong>In Stock:</strong> {selectedSouvenir.quantity}
//                   </div>
//                 </div>

//                 <div className="fest-ticket-section mt-4">
//                   <h5>Purchase Item</h5>
//                   <div className="fest-ticket-quantity mb-3">
//                     <Form.Label>Quantity</Form.Label>
//                     <div className="d-flex align-items-center">
//                       <Button
//                         variant="outline-secondary"
//                         onClick={handleDecrease}
//                         disabled={quantity === 1}
//                       >
//                         -
//                       </Button>
//                       <span className="mx-3">{quantity}</span>
//                       <Button
//                         variant="outline-secondary"
//                         onClick={handleIncrease}
//                         disabled={quantity >= selectedSouvenir.quantity}
//                       >
//                         +
//                       </Button>
//                     </div>
//                   </div>
//                   <div>
//                     <Button
//                       className="fest-buy-ticket-btn me-2"
//                       onClick={handleBuyNow}
//                     >
//                       Buy Now - {formatPrice(selectedSouvenir.price * quantity)}
//                     </Button>
//                     <Button
//                       className="fest-buy-ticket-btn"
//                       style={{
//                         background:
//                           "linear-gradient(135deg,rgb(131, 34, 82),rgb(128, 81, 170))",
//                       }}
//                       onClick={handleAddToCart}
//                     >
//                       Add to Cart
//                     </Button>
//                   </div>
//                 </div>

//                 {showDeliveryModal && (
//                   <div className="fest-purchase-form mt-4">
//                     <h5>Delivery Information</h5>
//                     <Form>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Phone Number</Form.Label>
//                         <Form.Control
//                           type="text"
//                           placeholder="Enter phone number (e.g., 01234567890)"
//                           value={phone}
//                           onChange={handlePhoneChange}
//                           isInvalid={!!phoneError}
//                         />
//                         {phoneError && (
//                           <Form.Text className="text-danger">{phoneError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Address (Street, House Number)</Form.Label>
//                         <Form.Control
//                           type="text"
//                           placeholder="Enter street and house number"
//                           value={address}
//                           onChange={handleAddressChange}
//                           isInvalid={!!addressError}
//                         />
//                         {addressError && (
//                           <Form.Text className="text-danger">{addressError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Description (Optional)</Form.Label>
//                         <Form.Control
//                           as="textarea"
//                           rows={3}
//                           placeholder="Enter any delivery notes or special requests (optional)"
//                           value={description}
//                           onChange={handleDescriptionChange}
//                           isInvalid={!!descriptionError}
//                         />
//                         {descriptionError && (
//                           <Form.Text className="text-danger">{descriptionError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Province/City</Form.Label>
//                         <Form.Select
//                           value={selectedProvince}
//                           onChange={handleProvinceChange}
//                           isInvalid={!!provinceError}
//                         >
//                           <option value="">Select Province/City</option>
//                           {provinces.map((province) => (
//                             <option
//                               key={province.provinceId}
//                               value={province.provinceId}
//                             >
//                               {province.provinceName}
//                             </option>
//                           ))}
//                         </Form.Select>
//                         {provinceError && (
//                           <Form.Text className="text-danger">{provinceError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>District</Form.Label>
//                         <Form.Select
//                           value={selectedDistrict}
//                           onChange={handleDistrictChange}
//                           disabled={!selectedProvince}
//                           isInvalid={!!districtError}
//                         >
//                           <option value="">Select District</option>
//                           {districts.map((district) => (
//                             <option
//                               key={district.districtId}
//                               value={district.districtId}
//                             >
//                               {district.districtName}
//                             </option>
//                           ))}
//                         </Form.Select>
//                         {districtError && (
//                           <Form.Text className="text-danger">{districtError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Ward</Form.Label>
//                         <Form.Select
//                           value={selectedWard}
//                           onChange={handleWardChange}
//                           disabled={!selectedDistrict}
//                           isInvalid={!!wardError}
//                         >
//                           <option value="">Select Ward</option>
//                           {wards.map((ward) => (
//                             <option key={ward.wardCode} value={ward.wardCode}>
//                               {ward.wardName}
//                             </option>
//                           ))}
//                         </Form.Select>
//                         {wardError && (
//                           <Form.Text className="text-danger">{wardError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Button
//                         variant="primary"
//                         onClick={handleDeliveryConfirm}
//                         className="mt-3 fest-buy-ticket-btn"
//                       >
//                         Proceed to Payment
//                       </Button>
//                     </Form>
//                   </div>
//                 )}

//                 {showPaymentModal && (
//                   <div className="fest-purchase-form mt-4" id="payment-modal">
//                     <h5>Select Payment Method</h5>
//                     <Form>
//                       <Form.Check
//                         type="radio"
//                         label="Momo"
//                         name="paymentMethod"
//                         onChange={() => setPaymentMethod("Momo")}
//                         className="mb-2"
//                       />
//                       <Form.Check
//                         type="radio"
//                         label="VNPay"
//                         name="paymentMethod"
//                         onChange={() => setPaymentMethod("VNPay")}
//                         className="mb-2"
//                       />
//                       <Button
//                         variant="primary"
//                         onClick={handleConfirmPurchase}
//                         className="me-2 mt-3 fest-buy-ticket-btn"
//                       >
//                         Review Order
//                       </Button>
//                       <Button
//                         variant="secondary"
//                         onClick={handleBackToDelivery}
//                         className="mt-3"
//                       >
//                         Back
//                       </Button>
//                     </Form>
//                   </div>
//                 )}

//                 {showSummaryModal && (
//                   <div className="fest-purchase-form mt-4 summary-modal" id="summary-modal">
//                     <h5>Order Review</h5>
//                     <div className="summary-details">
//                       <h6>Items</h6>
//                       <p className="summary-item">
//                         <strong>{selectedSouvenir.name} x {quantity}</strong>: {formatPrice(selectedSouvenir.price * quantity)}
//                       </p>
//                       <h6 className="mt-3">Delivery Information</h6>
//                       <div className="buyer-info">
//                         <p>
//                           <strong>Phone:</strong> {phone}
//                         </p>
//                         <p>
//                           <strong>Address:</strong> {address}
//                         </p>
//                         {description && (
//                           <p>
//                             <strong>Description:</strong> {description}
//                           </p>
//                         )}
//                         <p>
//                           <strong>Province:</strong> {getProvinceName(selectedProvince)}
//                         </p>
//                         <p>
//                           <strong>District:</strong> {getDistrictName(selectedDistrict)}
//                         </p>
//                         <p>
//                           <strong>Ward:</strong> {getWardName(selectedWard)}
//                         </p>
//                         <p>
//                           <strong>Payment Method:</strong> {paymentMethod}
//                         </p>
//                       </div>
//                       <hr className="divider" />
//                       <div className="price-info">
//                         <p className="subtotal">
//                           <strong>Subtotal:</strong> {formatPrice(selectedSouvenir.price * quantity)}
//                         </p>
//                         <p className="delivery-fee">
//                           <strong>Delivery Fee:</strong> {formatPrice(deliveryFee)}
//                         </p>
//                         <p className="total">
//                           <strong>Total:</strong> {formatPrice(selectedSouvenir.price * quantity + deliveryFee)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="summary-actions">
//                       <Button
//                         variant="primary"
//                         onClick={handleFinalConfirm}
//                         className="me-2 fest-buy-ticket-btn"
//                       >
//                         Confirm Purchase
//                       </Button>
//                       <Button
//                         variant="secondary"
//                         onClick={handleBackToPayment}
//                         className="me-2"
//                       >
//                         Back
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default SouvenirsPage;

//---------------------------------------------------------------------------------------------------//

// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import { Modal, Button, Form, Carousel } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import "../../styles/SouvenirsPage.scss";
// import ProductService from "../../services/ProductService/ProductService";
// import ProductDeliveryService from "../../services/ProductDeliveryService/ProductDeliveryService";
// import CartService from "../../services/CartService/CartService";
// import PaymentService from "../../services/PaymentService/PaymentService";
// import { apiClient } from "../../api/apiClient.js";
// import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { jwtDecode } from "jwt-decode";
// import { Pagination } from "antd";

// const SouvenirsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchError, setSearchError] = useState("");
//   const [showSouvenirModal, setShowSouvenirModal] = useState(false);
//   const [selectedSouvenir, setSelectedSouvenir] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showDeliveryModal, setShowDeliveryModal] = useState(false);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showSummaryModal, setShowSummaryModal] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState(null);
//   const [accountId, setAccountId] = useState(null);
//   const [accountName, setAccountName] = useState(null);
//   const [cartId, setCartId] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(8);
//   const [phone, setPhone] = useState("");
//   const [phoneError, setPhoneError] = useState("");
//   const [address, setAddress] = useState("");
//   const [addressError, setAddressError] = useState("");
//   const [provinceError, setProvinceError] = useState("");
//   const [districtError, setDistrictError] = useState("");
//   const [wardError, setWardError] = useState("");
//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [wards, setWards] = useState([]);
//   const [selectedProvince, setSelectedProvince] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedWard, setSelectedWard] = useState("");
//   const [toDistrictId, setToDistrictId] = useState("");
//   const [toWardCode, setToWardCode] = useState("");
//   const [description, setDescription] = useState("");
//   const [descriptionError, setDescriptionError] = useState("");
//   const [deliveryFee, setDeliveryFee] = useState(0);
//   const [tempOrderId, setTempOrderId] = useState(null);

//   const navigate = useNavigate();

//   const formatPrice = (price) => {
//     return `${price.toLocaleString("vi-VN")} VND`;
//   };

//   const getAccountInfoFromToken = () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         return {
//           id: decoded?.Id,
//           accountName: decoded?.AccountName,
//         };
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   const fetchProducts = async () => {
//     try {
//       const combinedData = await ProductService.getCombinedProductData();
//       // Thêm kiểm tra an toàn cho image
//       const normalizedData = combinedData.map((product) => ({
//         ...product,
//         image: product.image || "https://via.placeholder.com/200",
//       }));
//       setProducts(normalizedData);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const fetchProvinces = async () => {
//     try {
//       const provincesData = await ProductDeliveryService.getProvinces();
//       setProvinces(provincesData);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const fetchDistricts = async (provinceId) => {
//     try {
//       const districtsData = await ProductDeliveryService.getDistricts(provinceId);
//       setDistricts(districtsData);
//       setWards([]);
//       setSelectedDistrict("");
//       setSelectedWard("");
//       setToDistrictId("");
//       setToWardCode("");
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const fetchWards = async (districtId) => {
//     try {
//       const wardsData = await ProductDeliveryService.getWards(districtId);
//       setWards(wardsData);
//       setSelectedWard("");
//       setToWardCode("");
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     const accountInfo = getAccountInfoFromToken();
//     if (accountInfo) {
//       setAccountId(accountInfo.id);
//       setAccountName(accountInfo.accountName);
//     }

//     if (accountInfo?.id) {
//       CartService.getCartByAccountId(accountInfo.id).then((cartData) => {
//         setCartId(cartData.cartId);
//       });
//     }

//     fetchProducts();
//     fetchProvinces();

//     window.addEventListener("storageUpdate", fetchProducts);
//     return () => {
//       window.removeEventListener("storageUpdate", fetchProducts);
//     };
//   }, []);

//   const handleSouvenirShow = (souvenir) => {
//     setSelectedSouvenir(souvenir);
//     setShowSouvenirModal(true);
//   };

//   const handleSouvenirClose = () => {
//     setShowSouvenirModal(false);
//     setSelectedSouvenir(null);
//     setQuantity(1);
//     setShowDeliveryModal(false);
//     setShowPaymentModal(false);
//     setShowSummaryModal(false);
//     setPaymentMethod(null);
//     setPhone("");
//     setPhoneError("");
//     setAddress("");
//     setAddressError("");
//     setSelectedProvince("");
//     setSelectedDistrict("");
//     setSelectedWard("");
//     setToDistrictId("");
//     setToWardCode("");
//     setProvinceError("");
//     setDistrictError("");
//     setWardError("");
//     setDescription("");
//     setDescriptionError("");
//     setDeliveryFee(0);
//     setTempOrderId(null);
//   };

//   const handleIncrease = () => {
//     if (selectedSouvenir && quantity < selectedSouvenir.quantity) {
//       setQuantity((prev) => prev + 1);
//     } else {
//       toast.error("Quantity cannot exceed available stock.");
//     }
//   };

//   const handleDecrease = () => {
//     if (quantity > 1) {
//       setQuantity((prev) => prev - 1);
//     } else {
//       toast.error("Quantity must be at least 1.");
//     }
//   };

//   const handleBuyNow = () => {
//     setShowDeliveryModal(true);
//     setTimeout(() => {
//       const deliveryForm = document.querySelector(".fest-purchase-form");
//       if (deliveryForm) {
//         deliveryForm.scrollIntoView({ behavior: "smooth", block: "start" });
//       }
//     }, 100);
//   };

//   const handleAddToCart = async () => {
//     if (!accountId || !cartId) {
//       toast.error("Please log in to add items to your cart!");
//       return;
//     }
//     try {
//       const productData = [{ productId: selectedSouvenir.id, quantity }];
//       await CartService.addProductToCart(cartId, productData);
//       toast.success(`${selectedSouvenir.name} has been added to your cart!`);
//       window.dispatchEvent(new Event("storageUpdate"));
//       handleSouvenirClose();
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const validatePhoneNumber = (value) => {
//     if (!value) {
//       return "Phone number is required.";
//     }
//     if (!value.startsWith("0")) {
//       return "Phone number must start with 0.";
//     }
//     return "";
//   };

//   const handlePhoneChange = (e) => {
//     const value = e.target.value;
//     if (/^\d*$/.test(value) && value.length <= 11) {
//       setPhone(value);
//       const error = validatePhoneNumber(value);
//       setPhoneError(error);
//     } else if (!/^\d*$/.test(value)) {
//       toast.error("Phone number must contain only digits.");
//     } else if (value.length > 11) {
//       toast.error("Phone number must not exceed 11 digits.");
//     }
//   };

//   const validateAddress = (value) => {
//     if (!value) {
//       return "Address is required.";
//     }
//     if (value.length < 5) {
//       return "Address must be at least 5 characters long.";
//     }
//     if (value.length > 100) {
//       return "Address must not exceed 100 characters.";
//     }
//     if (/[<>{}!@#$%^&*()+=[\]|\\:;"'?~`]/.test(value)) {
//       return "Address contains invalid special characters.";
//     }
//     return "";
//   };

//   const handleAddressChange = (e) => {
//     const value = e.target.value;
//     setAddress(value);
//     const error = validateAddress(value);
//     setAddressError(error);
//   };

//   const validateDescription = (value) => {
//     if (value && value.length > 200) {
//       return "Description must not exceed 200 characters.";
//     }
//     if (value && /[<>{}!@#$%^&*()+=[\]|\\:;"'?~`]/.test(value)) {
//       return "Description contains invalid special characters.";
//     }
//     return "";
//   };

//   const handleDescriptionChange = (e) => {
//     const value = e.target.value;
//     setDescription(value);
//     const error = validateDescription(value);
//     setDescriptionError(error);
//   };

//   const validateProvince = (value) => {
//     if (!value) {
//       return "Please select a province/city.";
//     }
//     const province = provinces.find((p) => String(p.provinceId) === String(value));
//     if (!province) {
//       return "Invalid province selected.";
//     }
//     return "";
//   };

//   const validateDistrict = (value) => {
//     if (!value) {
//       return "Please select a district.";
//     }
//     const district = districts.find((d) => String(d.districtId) === String(value));
//     if (!district) {
//       return "Invalid district selected.";
//     }
//     return "";
//   };

//   const validateWard = (value) => {
//     if (!value) {
//       return "Please select a ward.";
//     }
//     const ward = wards.find((w) => String(w.wardCode) === String(value));
//     if (!ward) {
//       return "Invalid ward selected.";
//     }
//     return "";
//   };

//   const handleProvinceChange = (e) => {
//     const value = e.target.value;
//     setSelectedProvince(value);
//     const error = validateProvince(value);
//     setProvinceError(error);
//     if (value) {
//       fetchDistricts(value);
//     } else {
//       setDistricts([]);
//       setWards([]);
//       setSelectedDistrict("");
//       setSelectedWard("");
//       setToDistrictId("");
//       setToWardCode("");
//       setDistrictError("");
//       setWardError("");
//     }
//   };

//   const handleDistrictChange = (e) => {
//     const value = e.target.value;
//     setSelectedDistrict(value);
//     const error = validateDistrict(value);
//     setDistrictError(error);
//     const selected = districts.find((d) => d.districtId === parseInt(value));
//     const districtId = selected ? selected.districtId.toString() : "";
//     setToDistrictId(districtId);
//     if (value) {
//       fetchWards(value);
//     } else {
//       setWards([]);
//       setSelectedWard("");
//       setToWardCode("");
//       setWardError("");
//     }
//   };

//   const handleWardChange = (e) => {
//     const value = e.target.value;
//     setSelectedWard(value);
//     const error = validateWard(value);
//     setWardError(error);
//     const selected = wards.find((w) => String(w.wardCode) === String(value));
//     const wardCode = selected ? String(selected.wardCode) : String(value);
//     setToWardCode(wardCode);
//   };

//   const validateSearch = (value) => {
//     if (value.length > 50) {
//       return "Search term must not exceed 50 characters.";
//     }
//     if (!/^[a-zA-Z0-9\s-_]*$/.test(value)) {
//       return "Search term contains invalid characters.";
//     }
//     return "";
//   };

//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     const error = validateSearch(value);
//     setSearchError(error);
//     if (!error) {
//       setSearchTerm(value);
//     } else {
//       toast.error(error);
//     }
//   };

//   const handleDeliveryConfirm = () => {
//     const phoneErr = validatePhoneNumber(phone);
//     const addressErr = validateAddress(address);
//     const provinceErr = validateProvince(selectedProvince);
//     const districtErr = validateDistrict(selectedDistrict);
//     const wardErr = validateWard(selectedWard);
//     const descriptionErr = validateDescription(description);

//     setPhoneError(phoneErr);
//     setAddressError(addressErr);
//     setProvinceError(provinceErr);
//     setDistrictError(districtErr);
//     setWardError(wardErr);
//     setDescriptionError(descriptionErr);

//     if (phoneErr || addressErr || provinceErr || districtErr || wardErr || descriptionErr) {
//       const errors = [
//         phoneErr,
//         addressErr,
//         provinceErr,
//         districtErr,
//         wardErr,
//         descriptionErr,
//       ].filter(Boolean);
//       toast.error(errors.join(" "));
//       return;
//     }

//     setShowPaymentModal(true);
//     setTimeout(() => {
//       const paymentModal = document.getElementById("payment-modal");
//       if (paymentModal) {
//         paymentModal.scrollIntoView({ behavior: "smooth", block: "start" });
//       }
//     }, 100);
//   };

//   const handleConfirmPurchase = async () => {
//     if (!paymentMethod) {
//       toast.error("Please select a payment method!");
//       return;
//     }
//     try {
//       const orderId = await createOrder();
//       setTempOrderId(orderId);

//       let fee = 0;
//       try {
//         fee = await ProductDeliveryService.calculateDeliveryFee(orderId);
//       } catch (feeError) {
//         toast.warn("Unable to calculate delivery fee. Proceeding with 0 VND.");
//       }
//       setDeliveryFee(fee);

//       setShowPaymentModal(false);
//       setShowSummaryModal(true);
//       setTimeout(() => {
//         const summaryModal = document.getElementById("summary-modal");
//         if (summaryModal) {
//           summaryModal.scrollIntoView({ behavior: "smooth", block: "start" });
//         }
//       }, 100);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const createOrder = async () => {
//     try {
//       const orderData = {
//         accountId: accountId,
//         address: address,
//         phone: phone,
//         to_district_id: toDistrictId,
//         to_ward_code: toWardCode,
//         description: description || null,
//         orderProducts: [
//           {
//             productId: selectedSouvenir.id,
//             quantity: quantity,
//             createDate: new Date().toISOString(),
//           },
//         ],
//       };
//       const response = await apiClient.post("/api/Order", orderData);
//       return response.data;
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to create order");
//       throw error;
//     }
//   };

//   const handleFinalConfirm = async () => {
//     const productTotal = selectedSouvenir.price * quantity;
//     const totalAmount = productTotal + deliveryFee;

//     if (!accountId) {
//       toast.error("Please log in to proceed with payment!");
//       return;
//     }

//     try {
//       const orderId = tempOrderId || (await createOrder());

//       const paymentData = {
//         fullName: accountName || "Unknown",
//         orderInfo: `Purchase ${quantity} ${selectedSouvenir.name}(s)`,
//         amount: totalAmount,
//         purpose: 3,
//         accountId: accountId,
//         accountCouponId: null,
//         ticketId: null,
//         ticketQuantity: null,
//         contractId: null,
//         orderpaymentId: orderId,
//         isWeb: true,
//       };

//       let paymentUrl;
//       if (paymentMethod === "Momo") {
//         paymentUrl = await PaymentService.createMomoPayment(paymentData);
//       } else if (paymentMethod === "VNPay") {
//         paymentUrl = await PaymentService.createVnpayPayment(paymentData);
//       }

//       toast.success(`Redirecting to ${paymentMethod} payment...`);
//       setTimeout(() => {
//         localStorage.setItem("paymentSource", "souvenirs");
//         window.location.href = paymentUrl;
//       }, 3000);
//     } catch (error) {
//       toast.error(error.message);
//       setShowSummaryModal(false);
//     }
//   };

//   const handleBackToPayment = () => {
//     setShowSummaryModal(false);
//     setShowPaymentModal(true);
//     setTimeout(() => {
//       const paymentModal = document.getElementById("payment-modal");
//       if (paymentModal) {
//         paymentModal.scrollIntoView({ behavior: "smooth", block: "start" });
//       }
//     }, 100);
//   };

//   const handleBackToDelivery = () => {
//     setShowPaymentModal(false);
//     setShowDeliveryModal(true);
//   };

//   const filteredSouvenirs = products.filter((souvenir) =>
//     souvenir.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const startIndex = (currentPage - 1) * pageSize;
//   const endIndex = startIndex + pageSize;
//   const paginatedSouvenirs = filteredSouvenirs.slice(startIndex, endIndex);

//   const handlePageChange = (page, pageSize) => {
//     setCurrentPage(page);
//     setPageSize(pageSize);
//   };

//   const getProvinceName = (provinceId) => {
//     const province = provinces.find((p) => String(p.provinceId) === String(provinceId));
//     return province ? province.provinceName : "N/A";
//   };

//   const getDistrictName = (districtId) => {
//     const district = districts.find((d) => String(d.districtId) === String(districtId));
//     return district ? district.districtName : "N/A";
//   };

//   const getWardName = (wardCode) => {
//     const ward = wards.find((w) => String(w.wardCode) === String(wardCode));
//     return ward ? ward.wardName : "N/A";
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-5 text-danger">
//         {error}
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       </div>
//     );
//   }

//   return (
//     <div className="costume-rental-page min-vh-100">
//       <div className="hero-section text-white py-5">
//         <div className="container">
//           <h1 className="display-4 fw-bold text-center">Souvenir Store</h1>
//           <p className="lead text-center mt-3">
//             Find and buy the perfect souvenirs
//           </p>
//         </div>
//       </div>

//       <div className="container py-5">
//         <div className="search-container mb-5">
//           <div className="search-bar mx-auto">
//             <div className="input-group">
//               <span className="input-group-text">
//                 <Search size={20} />
//               </span>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search souvenirs..."
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//               />
//             </div>
//             {searchError && (
//               <Form.Text className="text-danger">{searchError}</Form.Text>
//             )}
//           </div>
//         </div>

//         <div className="costume-grid">
//           {paginatedSouvenirs.map((souvenir) => (
//             <div className="costume-card" key={souvenir.id}>
//               <div className="card-image">
//                 <img
//                   src={souvenir.image || "https://via.placeholder.com/200"}
//                   alt={souvenir.name}
//                   className="img-fluid"
//                 />
//               </div>
//               <div className="card-content">
//                 <h5 className="costume-name">{souvenir.name}</h5>
//                 <div className="price-and-button">
//                   <p className="costume-category">{formatPrice(souvenir.price)}</p>
//                   <button
//                     className="rent-button"
//                     onClick={() => handleSouvenirShow(souvenir)}
//                   >
//                     Buy Now!
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredSouvenirs.length === 0 ? (
//           <p className="text-center mt-4">No souvenirs found.</p>
//         ) : (
//           <div className="pagination-container mt-5">
//             <Pagination
//               current={currentPage}
//               pageSize={pageSize}
//               total={filteredSouvenirs.length}
//               onChange={handlePageChange}
//               showSizeChanger
//               pageSizeOptions={["4", "8", "12", "16"]}
//               showTotal={(total, range) =>
//                 `${range[0]}-${range[1]} of ${total} items`
//               }
//             />
//           </div>
//         )}
//       </div>

//       <Modal
//         show={showSouvenirModal}
//         onHide={handleSouvenirClose}
//         size="lg"
//         centered
//         className="gallery-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedSouvenir?.name} Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedSouvenir && (
//             <div className="costume-gallery">
//               <Carousel className="gallery-carousel">
//                 <Carousel.Item>
//                   <div className="carousel-image-container">
//                     <img
//                       className="d-block w-100"
//                       src={selectedSouvenir.image || "https://via.placeholder.com/200"}
//                       alt={selectedSouvenir.name}
//                     />
//                   </div>
//                   <Carousel.Caption>
//                     <h3>{selectedSouvenir.name}</h3>
//                     <p>Image 1 of 1</p>
//                   </Carousel.Caption>
//                 </Carousel.Item>
//               </Carousel>

//               <div className="fest-details mt-4">
//                 <h4>About {selectedSouvenir.name}</h4>
//                 <p>{selectedSouvenir.description}</p>
//                 <div className="fest-info">
//                   <div className="fest-info-item">
//                     <strong>Price:</strong> {formatPrice(selectedSouvenir.price)}
//                   </div>
//                   <div className="fest-info-item">
//                     <strong>In Stock:</strong> {selectedSouvenir.quantity}
//                   </div>
//                 </div>

//                 <div className="fest-ticket-section mt-4">
//                   <h5>Purchase Item</h5>
//                   <div className="fest-ticket-quantity mb-3">
//                     <Form.Label>Quantity</Form.Label>
//                     <div className="d-flex align-items-center">
//                       <Button
//                         variant="outline-secondary"
//                         onClick={handleDecrease}
//                         disabled={quantity === 1}
//                       >
//                         -
//                       </Button>
//                       <span className="mx-3">{quantity}</span>
//                       <Button
//                         variant="outline-secondary"
//                         onClick={handleIncrease}
//                         disabled={quantity >= selectedSouvenir.quantity}
//                       >
//                         +
//                       </Button>
//                     </div>
//                   </div>
//                   <div>
//                     <Button
//                       className="fest-buy-ticket-btn me-2"
//                       onClick={handleBuyNow}
//                     >
//                       Buy Now - {formatPrice(selectedSouvenir.price * quantity)}
//                     </Button>
//                     <Button
//                       className="fest-buy-ticket-btn"
//                       style={{
//                         background:
//                           "linear-gradient(135deg,rgb(131, 34, 82),rgb(128, 81, 170))",
//                       }}
//                       onClick={handleAddToCart}
//                     >
//                       Add to Cart
//                     </Button>
//                   </div>
//                 </div>

//                 {showDeliveryModal && (
//                   <div className="fest-purchase-form mt-4">
//                     <h5>Delivery Information</h5>
//                     <Form>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Phone Number</Form.Label>
//                         <Form.Control
//                           type="text"
//                           placeholder="Enter phone number (e.g., 01234567890)"
//                           value={phone}
//                           onChange={handlePhoneChange}
//                           isInvalid={!!phoneError}
//                         />
//                         {phoneError && (
//                           <Form.Text className="text-danger">{phoneError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Description (Optional)</Form.Label>
//                         <Form.Control
//                           as="textarea"
//                           rows={3}
//                           placeholder="Enter any delivery notes or special requests (optional)"
//                           value={description}
//                           onChange={handleDescriptionChange}
//                           isInvalid={!!descriptionError}
//                         />
//                         {descriptionError && (
//                           <Form.Text className="text-danger">{descriptionError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Province/City</Form.Label>
//                         <Form.Select
//                           value={selectedProvince}
//                           onChange={handleProvinceChange}
//                           isInvalid={!!provinceError}
//                         >
//                           <option value="">Select Province/City</option>
//                           {provinces.map((province) => (
//                             <option
//                               key={province.provinceId}
//                               value={province.provinceId}
//                             >
//                               {province.provinceName}
//                             </option>
//                           ))}
//                         </Form.Select>
//                         {provinceError && (
//                           <Form.Text className="text-danger">{provinceError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>District</Form.Label>
//                         <Form.Select
//                           value={selectedDistrict}
//                           onChange={handleDistrictChange}
//                           disabled={!selectedProvince}
//                           isInvalid={!!districtError}
//                         >
//                           <option value="">Select District</option>
//                           {districts.map((district) => (
//                             <option
//                               key={district.districtId}
//                               value={district.districtId}
//                             >
//                               {district.districtName}
//                             </option>
//                           ))}
//                         </Form.Select>
//                         {districtError && (
//                           <Form.Text className="text-danger">{districtError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Ward</Form.Label>
//                         <Form.Select
//                           value={selectedWard}
//                           onChange={handleWardChange}
//                           disabled={!selectedDistrict}
//                           isInvalid={!!wardError}
//                         >
//                           <option value="">Select Ward</option>
//                           {wards.map((ward) => (
//                             <option key={ward.wardCode} value={ward.wardCode}>
//                               {ward.wardName}
//                             </option>
//                           ))}
//                         </Form.Select>
//                         {wardError && (
//                           <Form.Text className="text-danger">{wardError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Form.Group className="mb-3">
//                         <Form.Label>Address (Street, House Number)</Form.Label>
//                         <Form.Control
//                           type="text"
//                           placeholder="Enter street and house number"
//                           value={address}
//                           onChange={handleAddressChange}
//                           isInvalid={!!addressError}
//                         />
//                         {addressError && (
//                           <Form.Text className="text-danger">{addressError}</Form.Text>
//                         )}
//                       </Form.Group>
//                       <Button
//                         variant="primary"
//                         onClick={handleDeliveryConfirm}
//                         className="mt-3 fest-buy-ticket-btn"
//                       >
//                         Proceed to Payment
//                       </Button>
//                     </Form>
//                   </div>
//                 )}

//                 {showPaymentModal && (
//                   <div className="fest-purchase-form mt-4" id="payment-modal">
//                     <h5>Select Payment Method</h5>
//                     <Form>
//                       <Form.Check
//                         type="radio"
//                         label="Momo"
//                         name="paymentMethod"
//                         onChange={() => setPaymentMethod("Momo")}
//                         className="mb-2"
//                       />
//                       <Form.Check
//                         type="radio"
//                         label="VNPay"
//                         name="paymentMethod"
//                         onChange={() => setPaymentMethod("VNPay")}
//                         className="mb-2"
//                       />
//                       <Button
//                         variant="primary"
//                         onClick={handleConfirmPurchase}
//                         className="me-2 mt-3 fest-buy-ticket-btn"
//                       >
//                         Review Order
//                       </Button>
//                       <Button
//                         variant="secondary"
//                         onClick={handleBackToDelivery}
//                         className="mt-3"
//                       >
//                         Back
//                       </Button>
//                     </Form>
//                   </div>
//                 )}

//                 {showSummaryModal && (
//                   <div className="fest-purchase-form mt-4 summary-modal" id="summary-modal">
//                     <h5>Order Review</h5>
//                     <div className="summary-details">
//                       <h6>Items</h6>
//                       <p className="summary-item">
//                         <strong>{selectedSouvenir.name} x {quantity}</strong>: {formatPrice(selectedSouvenir.price * quantity)}
//                       </p>
//                       <h6 className="mt-3">Delivery Information</h6>
//                       <div className="buyer-info">
//                         <p>
//                           <strong>Phone:</strong> {phone}
//                         </p>
//                         <p>
//                           <strong>Address:</strong> {address}
//                         </p>
//                         {description && (
//                           <p>
//                             <strong>Description:</strong> {description}
//                           </p>
//                         )}
//                         <p>
//                           <strong>Province:</strong> {getProvinceName(selectedProvince)}
//                         </p>
//                         <p>
//                           <strong>District:</strong> {getDistrictName(selectedDistrict)}
//                         </p>
//                         <p>
//                           <strong>Ward:</strong> {getWardName(selectedWard)}
//                         </p>
//                         <p>
//                           <strong>Payment Method:</strong> {paymentMethod}
//                         </p>
//                       </div>
//                       <hr className="divider" />
//                       <div className="price-info">
//                         <p className="subtotal">
//                           <strong>Subtotal:</strong> {formatPrice(selectedSouvenir.price * quantity)}
//                         </p>
//                         <p className="delivery-fee">
//                           <strong>Delivery Fee:</strong> {formatPrice(deliveryFee)}
//                         </p>
//                         <p className="total">
//                           <strong>Total:</strong> {formatPrice(selectedSouvenir.price * quantity + deliveryFee)}
//                         </p>
//                         <p
//                           style={{
//                             color: 'red',
//                             fontStyle: 'italic',
//                             fontSize: '18px'
//                           }}
//                         >
//                           * The item will be delivered within 3-5 days from the order date, please check your phone regularly
//                         </p>
//                       </div>
//                     </div>
//                     <div className="summary-actions">
//                       <Button
//                         variant="primary"
//                         onClick={handleFinalConfirm}
//                         className="me-2 fest-buy-ticket-btn"
//                       >
//                         Confirm Purchase
//                       </Button>
//                       <Button
//                         variant="secondary"
//                         onClick={handleBackToPayment}
//                         className="me-2"
//                       >
//                         Back
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default SouvenirsPage;

//---------------------------------------------------------------------------------------------------//

//sửa đổi vào 23/05/2025

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Modal, Button, Form, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/SouvenirsPage.scss";
import ProductService from "../../services/ProductService/ProductService";
import ProductDeliveryService from "../../services/ProductDeliveryService/ProductDeliveryService";
import CartService from "../../services/CartService/CartService";
import PaymentService from "../../services/PaymentService/PaymentService";
import { apiClient } from "../../api/apiClient.js";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import { Pagination } from "antd";

// Component chính của trang cửa hàng lưu niệm
const SouvenirsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState("");
  const [showSouvenirModal, setShowSouvenirModal] = useState(false);
  const [selectedSouvenir, setSelectedSouvenir] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [accountName, setAccountName] = useState(null);
  const [cartId, setCartId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [provinceError, setProvinceError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [wardError, setWardError] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [toDistrictId, setToDistrictId] = useState("");
  const [toWardCode, setToWardCode] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [tempOrderId, setTempOrderId] = useState(null);

  const navigate = useNavigate();

  // Hàm định dạng giá tiền sang định dạng Việt Nam
  const formatPrice = (price) => {
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  // Lấy thông tin tài khoản từ token
  const getAccountInfoFromToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        return {
          id: decoded?.Id,
          accountName: decoded?.AccountName,
        };
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  // Lấy danh sách sản phẩm từ API
  const fetchProducts = async () => {
    try {
      const combinedData = await ProductService.getCombinedProductData();
      // Thêm kiểm tra an toàn cho hình ảnh
      const normalizedData = combinedData.map((product) => ({
        ...product,
        image: product.image || "https://via.placeholder.com/200",
      }));
      setProducts(normalizedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Lấy danh sách tỉnh/thành phố
  const fetchProvinces = async () => {
    try {
      const provincesData = await ProductDeliveryService.getProvinces();
      setProvinces(provincesData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Lấy danh sách quận/huyện
  const fetchDistricts = async (provinceId) => {
    try {
      const districtsData = await ProductDeliveryService.getDistricts(provinceId);
      setDistricts(districtsData);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
      setToDistrictId("");
      setToWardCode("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Lấy danh sách phường/xã
  const fetchWards = async (districtId) => {
    try {
      const wardsData = await ProductDeliveryService.getWards(districtId);
      setWards(wardsData);
      setSelectedWard("");
      setToWardCode("");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Khởi tạo dữ liệu khi component mount
  useEffect(() => {
    const accountInfo = getAccountInfoFromToken();
    if (accountInfo) {
      setAccountId(accountInfo.id);
      setAccountName(accountInfo.accountName);
    }

    if (accountInfo?.id) {
      CartService.getCartByAccountId(accountInfo.id).then((cartData) => {
        setCartId(cartData.cartId);
      });
    }

    fetchProducts();
    fetchProvinces();

    window.addEventListener("storageUpdate", fetchProducts);
    return () => {
      window.removeEventListener("storageUpdate", fetchProducts);
    };
  }, []);

  // Mở modal chi tiết sản phẩm
  const handleSouvenirShow = (souvenir) => {
    setSelectedSouvenir(souvenir);
    setShowSouvenirModal(true);
  };

  // Đóng modal và reset state
  const handleSouvenirClose = () => {
    setShowSouvenirModal(false);
    setSelectedSouvenir(null);
    setQuantity(1);
    setShowDeliveryModal(false);
    setShowPaymentModal(false);
    setShowSummaryModal(false);
    setPaymentMethod(null);
    setPhone("");
    setPhoneError("");
    setAddress("");
    setAddressError("");
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setToDistrictId("");
    setToWardCode("");
    setProvinceError("");
    setDistrictError("");
    setWardError("");
    setDescription("");
    setDescriptionError("");
    setDeliveryFee(0);
    setTempOrderId(null);
  };

  // Tăng số lượng sản phẩm
  const handleIncrease = () => {
    if (selectedSouvenir && quantity < selectedSouvenir.quantity) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error("Quantity cannot exceed available stock.");
    }
  };

  // Giảm số lượng sản phẩm
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    } else {
      toast.error("Quantity must be at least 1.");
    }
  };

  // Xử lý khi nhấn nút Buy Now
  const handleBuyNow = () => {
    setShowDeliveryModal(true);
    setTimeout(() => {
      const deliveryForm = document.querySelector(".fest-purchase-form");
      if (deliveryForm) {
        deliveryForm.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Xử lý thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!accountId || !cartId) {
      toast.error("Please log in to add items to your cart!");
      return;
    }
    try {
      const productData = [{ productId: selectedSouvenir.id, quantity }];
      console.log("Adding to cart:", { cartId, productData }); // Debug
      await CartService.addProductToCart(cartId, productData);
      console.log("Add to cart successful"); // Debug
      toast.success(`${selectedSouvenir.name} has been added to your cart!`);
      // Kích hoạt sự kiện storageUpdate
      window.dispatchEvent(new Event("storageUpdate"));
      console.log("storageUpdate event dispatched"); // Debug
      handleSouvenirClose();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message);
    }
  };

  // Xác thực số điện thoại
  const validatePhoneNumber = (value) => {
    if (!value) {
      return "Phone number is required.";
    }
    if (!value.startsWith("0")) {
      return "Phone number must start with 0.";
    }
    return "";
  };

  // Xử lý thay đổi số điện thoại
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 11) {
      setPhone(value);
      const error = validatePhoneNumber(value);
      setPhoneError(error);
    } else if (!/^\d*$/.test(value)) {
      toast.error("Phone number must contain only digits.");
    } else if (value.length > 11) {
      toast.error("Phone number must not exceed 11 digits.");
    }
  };

  // Xác thực địa chỉ
  const validateAddress = (value) => {
    if (!value) {
      return "Address is required.";
    }
    if (value.length < 5) {
      return "Address must be at least 5 characters long.";
    }
    if (value.length > 100) {
      return "Address must not exceed 100 characters.";
    }
    if (/[<>{}!@#$%^&*()+=[\]|\\:;"'?~`]/.test(value)) {
      return "Address contains invalid special characters.";
    }
    return "";
  };

  // Xử lý thay đổi địa chỉ
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    const error = validateAddress(value);
    setAddressError(error);
  };

  // Xác thực mô tả
  const validateDescription = (value) => {
    if (value && value.length > 200) {
      return "Description must not exceed 200 characters.";
    }
    if (value && /[<>{}!@#$%^&*()+=[\]|\\:;"'?~`]/.test(value)) {
      return "Description contains invalid special characters.";
    }
    return "";
  };

  // Xử lý thay đổi mô tả
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    const error = validateDescription(value);
    setDescriptionError(error);
  };

  // Xác thực tỉnh/thành phố
  const validateProvince = (value) => {
    if (!value) {
      return "Please select a province/city.";
    }
    const province = provinces.find((p) => String(p.provinceId) === String(value));
    if (!province) {
      return "Invalid province selected.";
    }
    return "";
  };

  // Xác thực quận/huyện
  const validateDistrict = (value) => {
    if (!value) {
      return "Please select a district.";
    }
    const district = districts.find((d) => String(d.districtId) === String(value));
    if (!district) {
      return "Invalid district selected.";
    }
    return "";
  };

  // Xác thực phường/xã
  const validateWard = (value) => {
    if (!value) {
      return "Please select a ward.";
    }
    const ward = wards.find((w) => String(w.wardCode) === String(value));
    if (!ward) {
      return "Invalid ward selected.";
    }
    return "";
  };

  // Xử lý khi chọn tỉnh/thành phố
  const handleProvinceChange = (e) => {
    const value = e.target.value;
    setSelectedProvince(value);
    const error = validateProvince(value);
    setProvinceError(error);
    if (value) {
      fetchDistricts(value);
    } else {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict("");
      setSelectedWard("");
      setToDistrictId("");
      setToWardCode("");
      setDistrictError("");
      setWardError("");
    }
  };

  // Xử lý khi chọn quận/huyện
  const handleDistrictChange = (e) => {
    const value = e.target.value;
    setSelectedDistrict(value);
    const error = validateDistrict(value);
    setDistrictError(error);
    const selected = districts.find((d) => d.districtId === parseInt(value));
    const districtId = selected ? selected.districtId.toString() : "";
    setToDistrictId(districtId);
    if (value) {
      fetchWards(value);
    } else {
      setWards([]);
      setSelectedWard("");
      setToWardCode("");
      setWardError("");
    }
  };

  // Xử lý khi chọn phường/xã
  const handleWardChange = (e) => {
    const value = e.target.value;
    setSelectedWard(value);
    const error = validateWard(value);
    setWardError(error);
    const selected = wards.find((w) => String(w.wardCode) === String(value));
    const wardCode = selected ? String(selected.wardCode) : String(value);
    setToWardCode(wardCode);
  };

  // Xác thực tìm kiếm
  const validateSearch = (value) => {
    if (value.length > 50) {
      return "Search term must not exceed 50 characters.";
    }
    if (!/^[a-zA-Z0-9\s-_]*$/.test(value)) {
      return "Search term contains invalid characters.";
    }
    return "";
  };

  // Xử lý thay đổi ô tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    const error = validateSearch(value);
    setSearchError(error);
    if (!error) {
      setSearchTerm(value);
    } else {
      toast.error(error);
    }
  };

  // Xác nhận thông tin giao hàng
  const handleDeliveryConfirm = () => {
    const phoneErr = validatePhoneNumber(phone);
    const addressErr = validateAddress(address);
    const provinceErr = validateProvince(selectedProvince);
    const districtErr = validateDistrict(selectedDistrict);
    const wardErr = validateWard(selectedWard);
    const descriptionErr = validateDescription(description);

    setPhoneError(phoneErr);
    setAddressError(addressErr);
    setProvinceError(provinceErr);
    setDistrictError(districtErr);
    setWardError(wardErr);
    setDescriptionError(descriptionErr);

    if (phoneErr || addressErr || provinceErr || districtErr || wardErr || descriptionErr) {
      const errors = [
        phoneErr,
        addressErr,
        provinceErr,
        districtErr,
        wardErr,
        descriptionErr,
      ].filter(Boolean);
      toast.error(errors.join(" "));
      return;
    }

    setShowPaymentModal(true);
    setTimeout(() => {
      const paymentModal = document.getElementById("payment-modal");
      if (paymentModal) {
        paymentModal.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Xác nhận mua hàng
  const handleConfirmPurchase = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }
    try {
      const orderId = await createOrder();
      setTempOrderId(orderId);

      let fee = 0;
      try {
        fee = await ProductDeliveryService.calculateDeliveryFee(orderId);
      } catch (feeError) {
        toast.warn("Unable to calculate delivery fee. Proceeding with 0 VND.");
      }
      setDeliveryFee(fee);

      setShowPaymentModal(false);
      setShowSummaryModal(true);
      setTimeout(() => {
        const summaryModal = document.getElementById("summary-modal");
        if (summaryModal) {
          summaryModal.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Tạo đơn hàng
  const createOrder = async () => {
    try {
      const orderData = {
        accountId: accountId,
        address: address,
        phone: phone,
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        description: description || null,
        orderProducts: [
          {
            productId: selectedSouvenir.id,
            quantity: quantity,
            createDate: new Date().toISOString(),
          },
        ],
      };
      const response = await apiClient.post("/api/Order", orderData);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order");
      throw error;
    }
  };

  // Xác nhận cuối cùng và chuyển hướng đến cổng thanh toán
  const handleFinalConfirm = async () => {
    const productTotal = selectedSouvenir.price * quantity;
    const totalAmount = productTotal + deliveryFee;

    if (!accountId) {
      toast.error("Please log in to proceed with payment!");
      return;
    }

    try {
      const orderId = tempOrderId || (await createOrder());

      const paymentData = {
        fullName: accountName || "Unknown",
        orderInfo: `Purchase ${quantity} ${selectedSouvenir.name}(s)`,
        amount: totalAmount,
        purpose: 3,
        accountId: accountId,
        accountCouponId: null,
        ticketId: null,
        ticketQuantity: null,
        contractId: null,
        orderpaymentId: orderId,
        isWeb: true,
      };

      let paymentUrl;
      if (paymentMethod === "Momo") {
        paymentUrl = await PaymentService.createMomoPayment(paymentData);
      } else if (paymentMethod === "VNPay") {
        paymentUrl = await PaymentService.createVnpayPayment(paymentData);
      }

      toast.success(`Redirecting to ${paymentMethod} payment...`);
      setTimeout(() => {
        localStorage.setItem("paymentSource", "souvenirs");
        window.location.href = paymentUrl;
      }, 3000);
    } catch (error) {
      toast.error(error.message);
      setShowSummaryModal(false);
    }
  };

  // Quay lại bước chọn phương thức thanh toán
  const handleBackToPayment = () => {
    setShowSummaryModal(false);
    setShowPaymentModal(true);
    setTimeout(() => {
      const paymentModal = document.getElementById("payment-modal");
      if (paymentModal) {
        paymentModal.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Quay lại bước nhập thông tin giao hàng
  const handleBackToDelivery = () => {
    setShowPaymentModal(false);
    setShowDeliveryModal(true);
  };

  // Lọc danh sách sản phẩm theo từ khóa tìm kiếm
  const filteredSouvenirs = products.filter((souvenir) =>
    souvenir.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSouvenirs = filteredSouvenirs.slice(startIndex, endIndex);

  // Xử lý thay đổi trang
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // Lấy tên tỉnh/thành phố
  const getProvinceName = (provinceId) => {
    const province = provinces.find((p) => String(p.provinceId) === String(provinceId));
    return province ? province.provinceName : "N/A";
  };

  // Lấy tên quận/huyện
  const getDistrictName = (districtId) => {
    const district = districts.find((d) => String(d.districtId) === String(districtId));
    return district ? district.districtName : "N/A";
  };

  // Lấy tên phường/xã
  const getWardName = (wardCode) => {
    const ward = wards.find((w) => String(w.wardCode) === String(wardCode));
    return ward ? ward.wardName : "N/A";
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="text-center py-5">
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        {error}
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="costume-rental-page min-vh-100">
      <div className="hero-section text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold text-center">Souvenir Store</h1>
          <p className="lead text-center mt-3">
            Find and buy the perfect souvenirs
          </p>
        </div>
      </div>

      <div className="container py-5">
        <div className="search-container mb-5">
          <div className="search-bar mx-auto">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={20} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search souvenirs..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {searchError && (
              <Form.Text className="text-danger">{searchError}</Form.Text>
            )}
          </div>
        </div>

        <div className="costume-grid">
          {paginatedSouvenirs.map((souvenir) => (
            <div className="costume-card" key={souvenir.id}>
              <div className="card-image">
                <img
                  src={souvenir.image || "https://via.placeholder.com/200"}
                  alt={souvenir.name}
                  className="img-fluid"
                />
              </div>
              <div className="card-content">
                <h5 className="costume-name">{souvenir.name}</h5>
                <div className="price-and-button">
                  <p className="costume-category">{formatPrice(souvenir.price)}</p>
                  <button
                    className="rent-button"
                    onClick={() => handleSouvenirShow(souvenir)}
                  >
                    Buy Now!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSouvenirs.length === 0 ? (
          <p className="text-center mt-4">No souvenirs found.</p>
        ) : (
          <div className="pagination-container mt-5">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredSouvenirs.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["4", "8", "12", "16"]}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} of ${total} items`
              }
            />
          </div>
        )}
      </div>

      <Modal
        show={showSouvenirModal}
        onHide={handleSouvenirClose}
        size="lg"
        centered
        className="gallery-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedSouvenir?.name} Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSouvenir && (
            <div className="costume-gallery">
              <Carousel className="gallery-carousel">
                <Carousel.Item>
                  <div className="carousel-image-container">
                    <img
                      className="d-block w-100"
                      src={selectedSouvenir.image || "https://via.placeholder.com/200"}
                      alt={selectedSouvenir.name}
                    />
                  </div>
                  <Carousel.Caption>
                    <h3>{selectedSouvenir.name}</h3>
                    <p>Image 1 of 1</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>

              <div className="fest-details mt-4">
                <h4>About {selectedSouvenir.name}</h4>
                <p>{selectedSouvenir.description}</p>
                <div className="fest-info">
                  <div className="fest-info-item">
                    <strong>Price:</strong> {formatPrice(selectedSouvenir.price)}
                  </div>
                  <div className="fest-info-item">
                    <strong>In Stock:</strong> {selectedSouvenir.quantity}
                  </div>
                </div>

                <div className="fest-ticket-section mt-4">
                  <h5>Purchase Item</h5>
                  <div className="fest-ticket-quantity mb-3">
                    <Form.Label>Quantity</Form.Label>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        onClick={handleDecrease}
                        disabled={quantity === 1}
                      >
                        -
                      </Button>
                      <span className="mx-3">{quantity}</span>
                      <Button
                        variant="outline-secondary"
                        onClick={handleIncrease}
                        disabled={quantity >= selectedSouvenir.quantity}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Button
                      className="fest-buy-ticket-btn me-2"
                      onClick={handleBuyNow}
                    >
                      Buy Now - {formatPrice(selectedSouvenir.price * quantity)}
                    </Button>
                    <Button
                      className="fest-buy-ticket-btn"
                      style={{
                        background:
                          "linear-gradient(135deg,rgb(131, 34, 82),rgb(128, 81, 170))",
                      }}
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {showDeliveryModal && (
                  <div className="fest-purchase-form mt-4">
                    <h5>Delivery Information</h5>
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter phone number (e.g., 01234567890)"
                          value={phone}
                          onChange={handlePhoneChange}
                          isInvalid={!!phoneError}
                        />
                        {phoneError && (
                          <Form.Text className="text-danger">{phoneError}</Form.Text>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Description (Optional)</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Enter any delivery notes or special requests (optional)"
                          value={description}
                          onChange={handleDescriptionChange}
                          isInvalid={!!descriptionError}
                        />
                        {descriptionError && (
                          <Form.Text className="text-danger">{descriptionError}</Form.Text>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Province/City</Form.Label>
                        <Form.Select
                          value={selectedProvince}
                          onChange={handleProvinceChange}
                          isInvalid={!!provinceError}
                        >
                          <option value="">Select Province/City</option>
                          {provinces.map((province) => (
                            <option
                              key={province.provinceId}
                              value={province.provinceId}
                            >
                              {province.provinceName}
                            </option>
                          ))}
                        </Form.Select>
                        {provinceError && (
                          <Form.Text className="text-danger">{provinceError}</Form.Text>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>District</Form.Label>
                        <Form.Select
                          value={selectedDistrict}
                          onChange={handleDistrictChange}
                          disabled={!selectedProvince}
                          isInvalid={!!districtError}
                        >
                          <option value="">Select District</option>
                          {districts.map((district) => (
                            <option
                              key={district.districtId}
                              value={district.districtId}
                            >
                              {district.districtName}
                            </option>
                          ))}
                        </Form.Select>
                        {districtError && (
                          <Form.Text className="text-danger">{districtError}</Form.Text>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Ward</Form.Label>
                        <Form.Select
                          value={selectedWard}
                          onChange={handleWardChange}
                          disabled={!selectedDistrict}
                          isInvalid={!!wardError}
                        >
                          <option value="">Select Ward</option>
                          {wards.map((ward) => (
                            <option key={ward.wardCode} value={ward.wardCode}>
                              {ward.wardName}
                            </option>
                          ))}
                        </Form.Select>
                        {wardError && (
                          <Form.Text className="text-danger">{wardError}</Form.Text>
                        )}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Address (Street, House Number)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter street and house number"
                          value={address}
                          onChange={handleAddressChange}
                          isInvalid={!!addressError}
                        />
                        {addressError && (
                          <Form.Text className="text-danger">{addressError}</Form.Text>
                        )}
                      </Form.Group>
                      <Button
                        variant="primary"
                        onClick={handleDeliveryConfirm}
                        className="mt-3 fest-buy-ticket-btn"
                      >
                        Proceed to Payment
                      </Button>
                    </Form>
                  </div>
                )}

                {showPaymentModal && (
                  <div className="fest-purchase-form mt-4" id="payment-modal">
                    <h5>Select Payment Method</h5>
                    <Form>
                      <Form.Check
                        type="radio"
                        label="Momo"
                        name="paymentMethod"
                        onChange={() => setPaymentMethod("Momo")}
                        className="mb-2"
                      />
                      <Form.Check
                        type="radio"
                        label="VNPay"
                        name="paymentMethod"
                        onChange={() => setPaymentMethod("VNPay")}
                        className="mb-2"
                      />
                      <Button
                        variant="primary"
                        onClick={handleConfirmPurchase}
                        className="me-2 mt-3 fest-buy-ticket-btn"
                      >
                        Review Order
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleBackToDelivery}
                        className="mt-3"
                      >
                        Back
                      </Button>
                    </Form>
                  </div>
                )}

                {showSummaryModal && (
                  <div className="fest-purchase-form mt-4 summary-modal" id="summary-modal">
                    <h5>Order Review</h5>
                    <div className="summary-details">
                      <h6>Items</h6>
                      <p className="summary-item">
                        <strong>{selectedSouvenir.name} x {quantity}</strong>: {formatPrice(selectedSouvenir.price * quantity)}
                      </p>
                      <h6 className="mt-3">Delivery Information</h6>
                      <div className="buyer-info">
                        <p>
                          <strong>Phone:</strong> {phone}
                        </p>
                        <p>
                          <strong>Address:</strong> {address}
                        </p>
                        {description && (
                          <p>
                            <strong>Description:</strong> {description}
                          </p>
                        )}
                        <p>
                          <strong>Province:</strong> {getProvinceName(selectedProvince)}
                        </p>
                        <p>
                          <strong>District:</strong> {getDistrictName(selectedDistrict)}
                        </p>
                        <p>
                          <strong>Ward:</strong> {getWardName(selectedWard)}
                        </p>
                        <p>
                          <strong>Payment Method:</strong> {paymentMethod}
                        </p>
                      </div>
                      <hr className="divider" />
                      <div className="price-info">
                        <p className="subtotal">
                          <strong>Subtotal:</strong> {formatPrice(selectedSouvenir.price * quantity)}
                        </p>
                        <p className="delivery-fee">
                          <strong>Delivery Fee:</strong> {formatPrice(deliveryFee)}
                        </p>
                        <p className="total">
                          <strong>Total:</strong> {formatPrice(selectedSouvenir.price * quantity + deliveryFee)}
                        </p>
                        <p
                          style={{
                            color: 'red',
                            fontStyle: 'italic',
                            fontSize: '18px'
                          }}
                        >
                          * The item will be delivered within 3-5 days from the order date, please check your phone regularly
                        </p>
                      </div>
                    </div>
                    <div className="summary-actions">
                      <Button
                        variant="primary"
                        onClick={handleFinalConfirm}
                        className="me-2 fest-buy-ticket-btn"
                      >
                        Confirm Purchase
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleBackToPayment}
                        className="me-2"
                      >
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SouvenirsPage;