// import React, { useState, useEffect } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import {
//   Home,
//   Users,
//   Phone,
//   Info,
//   ShoppingBag,
//   Calendar,
//   Shirt,
//   Store,
//   CircleUser,
//   Aperture,
//   Bell,
// } from "lucide-react";
// import Logo from "../../assets/img/CCSSlogo.png";
// import "../../styles/nav.scss";
// import AuthService from "../../services/AuthService.js";
// import CartService from "../../services/CartService/CartService";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";

// export function Navbar() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [notifications, setNotifications] = useState(3);
//   const [cartCount, setCartCount] = useState(0);

//   const getUserInfoFromToken = () => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         console.log("Decoded token in Navbar:", decoded);
//         return {
//           id: decoded?.Id,
//           role: decoded?.role,
//         };
//       } catch (error) {
//         console.error("Lỗi khi giải mã token:", error);
//         return { id: null, role: null };
//       }
//     }
//     return { id: null, role: null };
//   };

//   const updateCartCount = async () => {
//     try {
//       const { id } = getUserInfoFromToken();
//       if (!id) {
//         const savedCart = localStorage.getItem("cartItems");
//         const cartItems = savedCart ? JSON.parse(savedCart) : [];
//         setCartCount(cartItems.length);
//         return;
//       }
//       const cartData = await CartService.getCartByAccountId(id);
//       const totalQuantity = cartData.listCartProduct.reduce(
//         (total, item) => total + item.quantity,
//         0
//       );
//       setCartCount(totalQuantity);
//     } catch (error) {
//       console.error("Error updating cart count:", error);
//       const savedCart = localStorage.getItem("cartItems");
//       const cartItems = savedCart ? JSON.parse(savedCart) : [];
//       setCartCount(cartItems.length);
//     }
//   };

//   useEffect(() => {
//     const { id, role } = getUserInfoFromToken();
//     setUserId(id);
//     setUserRole(role);

//     updateCartCount();
//     window.addEventListener("storage", updateCartCount);

//     return () => window.removeEventListener("storage", updateCartCount);
//   }, []);

//   const goToProfile = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/user-profile/${id}`);
//     }
//   };

//   const goToMyHistory = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-history/${id}`);
//     }
//   };

//   const goToMyRentalCostume = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-rental-costume/${id}`);
//     }
//   };

//   const goToMyEventOrganize = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-event-organize/${id}`);
//     }
//   };

//   const goToMyPurchaseHistory = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-purchase-history/${id}`);
//     }
//   };

//   const goToMyTask = () => {
//     const { id, role } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//       return;
//     }
//     if (role === "Cosplayer") {
//       navigate(`/my-task/${id}`);
//     } else {
//       toast.error("You do not have permission to access My Task.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleLogout = () => {
//     AuthService.logout();
//     setUserId(null);
//     setUserRole(null);
//     setCartCount(0);
//     navigate("/login");
//   };

//   const cosplayThemes = [
//     { name: "All", path: "/costumes" },
//     { name: "Anime", path: "/costumes/anime" },
//     { name: "Game", path: "/costumes/game" },
//     { name: "Superhero", path: "/costumes/superhero" },
//     { name: "Fantasy", path: "/costumes/fantasy" },
//     { name: "Sci-Fi", path: "/costumes/sci-fi" },
//     { name: "Horror", path: "/costumes/horror" },
//     { name: "Historical", path: "/costumes/historical" },
//     { name: "Mythology", path: "/costumes/mythology" },
//     { name: "Steampunk", path: "/costumes/steampunk" },
//     { name: "Cyberpunk", path: "/costumes/cyberpunk" },
//     { name: "Cartoon", path: "/costumes/cartoon" },
//   ];

//   return (
//     <nav className="navbar">
//       <div className="container mx-auto flex items-center justify-between h-24 px-4">
//         <div className="brand-container flex items-center">
//           <Link to="/" className="flex items-center">
//             <img src={Logo} alt="CCSS Logo" className="brand-logo h-12" />
//           </Link>
//         </div>

//         <div className="nav-menu">
//           {[
//             { to: "/services", label: "Services", Icon: ShoppingBag },
//             {
//               to: "/costumes",
//               label: "Costumes",
//               Icon: Shirt,
//               hasDropdown: true,
//               dropdownItems: cosplayThemes,
//               dropdownClass: "dropdown-menu-categories",
//             },
//             { to: "/cosplayers", label: "Cosplayers", Icon: Users },
//             {
//               to: "/event",
//               label: "Event Organization",
//               Icon: Aperture,
//             },
//             { to: "/festivals", label: "Festivals", Icon: Calendar },
//             { to: "/souvenirs-shop", label: "Souvenirs", Icon: Store },
//             { to: "/about", label: "About Us", Icon: Info },
//           ].map(
//             ({
//               to,
//               label,
//               Icon,
//               hasDropdown,
//               dropdownItems,
//               dropdownClass,
//             }) => (
//               <div key={to} className="dropdown-container">
//                 <NavLink
//                   to={to}
//                   className={({ isActive }) =>
//                     `nav-link ${isActive ? "nav-link-active" : ""}`
//                   }
//                 >
//                   <Icon size={20} />
//                   <span>{label}</span>
//                 </NavLink>
//                 {hasDropdown && (
//                   <div className={`dropdown-menu ${dropdownClass}`}>
//                     {dropdownItems.map((item) => (
//                       <Link
//                         key={item.name}
//                         to={item.path}
//                         className="dropdown-item"
//                       >
//                         {item.name}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )
//           )}

//           <div className="dropdown-container notification-container">
//             <div className="dropdown-toggle">
//               <Bell size={20} />
//               {notifications > 0 && (
//                 <span className="notification-badge">{notifications}</span>
//               )}
//             </div>
//             <div className="dropdown-menu dropdown-menu-notifications">
//               <div className="dropdown-item">No new notifications</div>
//             </div>
//           </div>

//           <div className="dropdown-container">
//             <div className="dropdown-toggle">
//               <CircleUser size={20} />
//             </div>
//             <div className="dropdown-menu dropdown-menu-user">
//               {userId && (
//                 <>
//                   <div onClick={goToProfile} className="dropdown-item">
//                     Profile
//                   </div>
//                   <div onClick={goToMyHistory} className="dropdown-item">
//                     My Rental Cosplayer
//                   </div>
//                   <div onClick={goToMyRentalCostume} className="dropdown-item">
//                     My Rental Costume
//                   </div>
//                   <div onClick={goToMyEventOrganize} className="dropdown-item">
//                     My Event Organization
//                   </div>
//                   <div onClick={goToMyPurchaseHistory} className="dropdown-item">
//                     Purchase History
//                   </div>
//                   <div
//                     onClick={goToMyTask}
//                     className="dropdown-item"
//                     style={{
//                       display: userRole === "Cosplayer" ? "block" : "none",
//                     }}
//                   >
//                     My Task
//                   </div>
//                 </>
//               )}
//               <Link to="/cart" className="dropdown-item cart-item">
//                 Cart
//                 {cartCount > 0 && (
//                   <span className="cart-badge">{cartCount}</span>
//                 )}
//               </Link>
//               <Link to="/contact" className="dropdown-item">
//                 Contact
//               </Link>
//               <Link
//                 to="/login"
//                 className="dropdown-item"
//                 onClick={handleLogout}
//               >
//                 Log Out
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

/////////////////////////////chỉ cosplayer nhìn thấy
// import React, { useState, useEffect } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import {
//   Home,
//   Users,
//   Phone,
//   Info,
//   ShoppingBag,
//   Calendar,
//   Shirt,
//   Store,
//   CircleUser,
//   Aperture,
//   Bell,
// } from "lucide-react";
// import Logo from "../../assets/img/CCSSlogo.png";
// import "../../styles/nav.scss";
// import AuthService from "../../services/AuthService.js";
// import CartService from "../../services/CartService/CartService";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";

// export function Navbar() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [notifications, setNotifications] = useState(3);
//   const [cartCount, setCartCount] = useState(0);

//   const getUserInfoFromToken = () => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         console.log("Decoded token in Navbar:", decoded);
//         return {
//           id: decoded?.Id,
//           role: decoded?.role,
//         };
//       } catch (error) {
//         console.error("Lỗi khi giải mã token:", error);
//         return { id: null, role: null };
//       }
//     }
//     return { id: null, role: null };
//   };

//   const updateCartCount = async () => {
//     try {
//       const { id } = getUserInfoFromToken();
//       if (!id) {
//         const savedCart = localStorage.getItem("cartItems");
//         const cartItems = savedCart ? JSON.parse(savedCart) : [];
//         setCartCount(cartItems.length);
//         return;
//       }
//       const cartData = await CartService.getCartByAccountId(id);
//       const totalQuantity = cartData.listCartProduct.reduce(
//         (total, item) => total + item.quantity,
//         0
//       );
//       setCartCount(totalQuantity);
//     } catch (error) {
//       console.error("Error updating cart count:", error);
//       const savedCart = localStorage.getItem("cartItems");
//       const cartItems = savedCart ? JSON.parse(savedCart) : [];
//       setCartCount(cartItems.length);
//     }
//   };

//   useEffect(() => {
//     const { id, role } = getUserInfoFromToken();
//     setUserId(id);
//     setUserRole(role);

//     updateCartCount();
//     window.addEventListener("storage", updateCartCount);

//     return () => window.removeEventListener("storage", updateCartCount);
//   }, []);

//   const goToProfile = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/user-profile/${id}`);
//     }
//   };

//   const goToMyHistory = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-history/${id}`);
//     }
//   };

//   const goToMyRentalCostume = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-rental-costume/${id}`);
//     }
//   };

//   const goToMyEventOrganize = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-event-organize/${id}`);
//     }
//   };

//   const goToMyPurchaseHistory = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-purchase-history/${id}`);
//     }
//   };

//   const goToMyTask = () => {
//     const { id, role } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//       return;
//     }
//     if (role === "Cosplayer") {
//       navigate(`/my-task/${id}`);
//     } else {
//       toast.error("You do not have permission to access My Task.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleLogout = () => {
//     AuthService.logout();
//     setUserId(null);
//     setUserRole(null);
//     setCartCount(0);
//     navigate("/login");
//   };

//   const cosplayThemes = [
//     { name: "All", path: "/costumes" },
//     { name: "Anime", path: "/costumes/anime" },
//     { name: "Game", path: "/costumes/game" },
//     { name: "Superhero", path: "/costumes/superhero" },
//     { name: "Fantasy", path: "/costumes/fantasy" },
//     { name: "Sci-Fi", path: "/costumes/sci-fi" },
//     { name: "Horror", path: "/costumes/horror" },
//     { name: "Historical", path: "/costumes/historical" },
//     { name: "Mythology", path: "/costumes/mythology" },
//     { name: "Steampunk", path: "/costumes/steampunk" },
//     { name: "Cyberpunk", path: "/costumes/cyberpunk" },
//     { name: "Cartoon", path: "/costumes/cartoon" },
//   ];

//   return (
//     <nav className="navbar">
//       <div className="container mx-auto flex items-center justify-between h-24 px-4">
//         <div className="brand-container flex items-center">
//           <Link to="/" className="flex items-center">
//             <img src={Logo} alt="CCSS Logo" className="brand-logo h-12" />
//           </Link>
//         </div>

//         <div className="nav-menu">
//           {[
//             { to: "/services", label: "Services", Icon: ShoppingBag },
//             {
//               to: "/costumes",
//               label: "Costumes",
//               Icon: Shirt,
//               hasDropdown: true,
//               dropdownItems: cosplayThemes,
//               dropdownClass: "dropdown-menu-categories",
//             },
//             { to: "/cosplayers", label: "Cosplayers", Icon: Users },
//             {
//               to: "/event",
//               label: "Event Organization",
//               Icon: Aperture,
//             },
//             { to: "/festivals", label: "Festivals", Icon: Calendar },
//             { to: "/souvenirs-shop", label: "Souvenirs", Icon: Store },
//             { to: "/about", label: "About Us", Icon: Info },
//           ].map(
//             ({
//               to,
//               label,
//               Icon,
//               hasDropdown,
//               dropdownItems,
//               dropdownClass,
//             }) => (
//               <div key={to} className="dropdown-container">
//                 <NavLink
//                   to={to}
//                   className={({ isActive }) =>
//                     `nav-link ${isActive ? "nav-link-active" : ""}`
//                   }
//                 >
//                   <Icon size={20} />
//                   <span>{label}</span>
//                 </NavLink>
//                 {hasDropdown && (
//                   <div className={`dropdown-menu ${dropdownClass}`}>
//                     {dropdownItems.map((item) => (
//                       <Link
//                         key={item.name}
//                         to={item.path}
//                         className="dropdown-item"
//                       >
//                         {item.name}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )
//           )}

//           <div className="dropdown-container notification-container">
//             <div className="dropdown-toggle">
//               <Bell size={20} />
//               {notifications > 0 && (
//                 <span className="notification-badge">{notifications}</span>
//               )}
//             </div>
//             <div className="dropdown-menu dropdown-menu-notifications">
//               <div className="dropdown-item">No new notifications</div>
//             </div>
//           </div>

//           <div className="dropdown-container">
//             <div className="dropdown-toggle">
//               <CircleUser size={20} />
//             </div>
//             <div className="dropdown-menu dropdown-menu-user">
//               {userId ? (
//                 <>
//                   <div onClick={goToProfile} className="dropdown-item">
//                     Profile
//                   </div>
//                   {userRole !== "Cosplayer" && (
//                     <>
//                       <div onClick={goToMyHistory} className="dropdown-item">
//                         My Rental Cosplayer
//                       </div>
//                       <div
//                         onClick={goToMyRentalCostume}
//                         className="dropdown-item"
//                       >
//                         My Rental Costume
//                       </div>
//                       <div
//                         onClick={goToMyEventOrganize}
//                         className="dropdown-item"
//                       >
//                         My Event Organization
//                       </div>
//                       <div
//                         onClick={goToMyPurchaseHistory}
//                         className="dropdown-item"
//                       >
//                         Purchase History
//                       </div>
//                     </>
//                   )}
//                   {userRole === "Cosplayer" && (
//                     <div onClick={goToMyTask} className="dropdown-item">
//                       My Task
//                     </div>
//                   )}
//                   {userRole !== "Cosplayer" && (
//                     <Link to="/cart" className="dropdown-item cart-item">
//                       Cart
//                       {cartCount > 0 && (
//                         <span className="cart-badge">{cartCount}</span>
//                       )}
//                     </Link>
//                   )}
//                   <Link to="/contact" className="dropdown-item">
//                     Contact
//                   </Link>
//                   <Link
//                     to="/login"
//                     className="dropdown-item"
//                     onClick={handleLogout}
//                   >
//                     Log Out
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/contact" className="dropdown-item">
//                     Contact
//                   </Link>
//                   <Link
//                     to="/login"
//                     className="dropdown-item"
//                     onClick={handleLogout}
//                   >
//                     Log Out
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

//------------------------------------------------------------------------------------------------------//

// Seen notification
// import React, { useState, useEffect, useRef } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import {
//   Home,
//   Users,
//   Phone,
//   Info,
//   ShoppingBag,
//   Calendar,
//   Shirt,
//   Store,
//   CircleUser,
//   Aperture,
//   Bell,
// } from "lucide-react";
// import Logo from "../../assets/img/CCSSlogo.png";
// import "../../styles/nav.scss";
// import AuthService from "../../services/AuthService.js";
// import CartService from "../../services/CartService/CartService";
// import navbarService from "./navbarService.js"; // Adjusted import path
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";

// export function Navbar() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [cartCount, setCartCount] = useState(0);
//   const callCountRef = useRef(0); // Track number of API calls

//   const getUserInfoFromToken = () => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         console.log("Decoded token in Navbar:", decoded);
//         return {
//           id: decoded?.Id,
//           role: decoded?.role,
//         };
//       } catch (error) {
//         console.error("Lỗi khi giải mã token:", error);
//         return { id: null, role: null };
//       }
//     }
//     return { id: null, role: null };
//   };

//   const updateCartCount = async () => {
//     try {
//       const { id } = getUserInfoFromToken();
//       if (!id) {
//         const savedCart = localStorage.getItem("cartItems");
//         const cartItems = savedCart ? JSON.parse(savedCart) : [];
//         setCartCount(cartItems.length);
//         return;
//       }
//       const cartData = await CartService.getCartByAccountId(id);
//       const totalQuantity = cartData.listCartProduct.reduce(
//         (total, item) => total + item.quantity,
//         0
//       );
//       setCartCount(totalQuantity);
//     } catch (error) {
//       console.error("Error updating cart count:", error);
//       const savedCart = localStorage.getItem("cartItems");
//       const cartItems = savedCart ? JSON.parse(savedCart) : [];
//       setCartCount(cartItems.length);
//     }
//   };

//   const fetchNotifications = async (accountId) => {
//     try {
//       const notificationData = await navbarService.getNotification(accountId);
//       setNotifications(notificationData);
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//       setNotifications([]);
//       toast.error("Failed to load notifications", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const markNotificationsAsSeen = async () => {
//     try {
//       // Get all unread notifications
//       const unreadNotifications = notifications.filter(
//         (notification) => !notification.isRead
//       );
//       if (unreadNotifications.length === 0) return;

//       // Call seenNotification API for each unread notification
//       await Promise.all(
//         unreadNotifications.map((notification) =>
//           navbarService.seenNotification(notification.id)
//         )
//       );

//       // Refetch notifications to update the UI
//       if (userId) {
//         await fetchNotifications(userId);
//       }
//     } catch (error) {
//       console.error("Failed to mark notifications as seen:", error);
//       toast.error("Failed to mark notifications as seen", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   useEffect(() => {
//     const { id, role } = getUserInfoFromToken();
//     setUserId(id);
//     setUserRole(role);

//     if (id) {
//       fetchNotifications(id); // Initial fetch
//       callCountRef.current = 1; // Count initial call

//       // Set up interval for polling
//       const intervalId = setInterval(() => {
//         if (userRole === "Cosplayer") {
//           fetchNotifications(id);
//         }

//         callCountRef.current += 1; // Increment call count
//       }, 5000);

//       // Clean up interval on unmount or userId change
//       return () => clearInterval(intervalId);
//     }

//     updateCartCount();
//     window.addEventListener("storage", updateCartCount);

//     return () => window.removeEventListener("storage", updateCartCount);
//   }, []);

//   const goToProfile = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/user-profile/${id}`);
//     }
//   };

//   const goToMyHistory = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-history/${id}`);
//     }
//   };

//   const goToMyRentalCostume = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-rental-costume/${id}`);
//     }
//   };

//   const goToMyEventOrganize = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-event-organize/${id}`);
//     }
//   };

//   const goToMyPurchaseHistory = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-purchase-history/${id}`);
//     }
//   };

//   const goToMyTask = () => {
//     const { id, role } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//       return;
//     }
//     if (role === "Cosplayer") {
//       navigate(`/my-task/${id}`);
//     } else {
//       toast.error("You do not have permission to access My Task.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const handleLogout = () => {
//     AuthService.logout();
//     setUserId(null);
//     setUserRole(null);
//     setCartCount(0);
//     setNotifications([]);
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="container mx-auto flex items-center justify-between h-24 px-4">
//         <div className="brand-container flex items-center">
//           <Link to="/" className="flex items-center">
//             <img src={Logo} alt="CCSS Logo" className="brand-logo h-12" />
//           </Link>
//         </div>

//         <div className="nav-menu">
//           {[
//             { to: "/services", label: "Services", Icon: ShoppingBag },
//             { to: "/costumes", label: "Costumes", Icon: Shirt },
//             { to: "/cosplayers", label: "Cosplayers", Icon: Users },
//             {
//               to: "/event",
//               label: "Event Organization",
//               Icon: Aperture,
//             },
//             { to: "/festivals", label: "Festivals", Icon: Calendar },
//             { to: "/souvenirs-shop", label: "Souvenirs", Icon: Store },
//             { to: "/about", label: "About Us", Icon: Info },
//           ].map(({ to, label, Icon }) => (
//             <div key={to} className="dropdown-container">
//               <NavLink
//                 to={to}
//                 className={({ isActive }) =>
//                   `nav-link ${isActive ? "nav-link-active" : ""}`
//                 }
//               >
//                 <Icon size={20} />
//                 <span>{label}</span>
//               </NavLink>
//             </div>
//           ))}

//           <div className="dropdown-container notification-container">
//             <div
//               className="dropdown-toggle"
//               onClick={markNotificationsAsSeen} // Call API on Bell click
//             >
//               <Bell size={20} />
//               {notifications.filter((n) => !n.isRead).length > 0 && (
//                 <span className="notification-badge">
//                   {notifications.filter((n) => !n.isRead).length}
//                 </span>
//               )}
//             </div>
//             <div className="dropdown-menu dropdown-menu-notifications">
//               {notifications.length > 0 ? (
//                 notifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`dropdown-item ${
//                       notification.isRead ? "read" : "unread"
//                     }`}
//                   >
//                     <p className="notification-message">
//                       {notification.message || "Unnamed notification"}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <div className="dropdown-item">No new notifications</div>
//               )}
//             </div>
//           </div>

//           <div className="dropdown-container">
//             <div className="dropdown-toggle">
//               <CircleUser size={20} />
//             </div>
//             <div className="dropdown-menu dropdown-menu-user">
//               {userId ? (
//                 <>
//                   <div onClick={goToProfile} className="dropdown-item">
//                     Profile
//                   </div>
//                   {userRole !== "Cosplayer" && (
//                     <>
//                       <div onClick={goToMyHistory} className="dropdown-item">
//                         My Rental Cosplayer
//                       </div>
//                       <div
//                         onClick={goToMyRentalCostume}
//                         className="dropdown-item"
//                       >
//                         My Rental Costume
//                       </div>
//                       <div
//                         onClick={goToMyEventOrganize}
//                         className="dropdown-item"
//                       >
//                         My Event Organization
//                       </div>
//                       <div
//                         onClick={goToMyPurchaseHistory}
//                         className="dropdown-item"
//                       >
//                         Purchase History
//                       </div>
//                     </>
//                   )}
//                   {userRole === "Cosplayer" && (
//                     <div onClick={goToMyTask} className="dropdown-item">
//                       My Task
//                     </div>
//                   )}
//                   {userRole !== "Cosplayer" && (
//                     <Link to="/cart" className="dropdown-item cart-item">
//                       Cart
//                       {cartCount > 0 && (
//                         <span className="cart-badge">{cartCount}</span>
//                       )}
//                     </Link>
//                   )}
//                   <Link to="/contact" className="dropdown-item">
//                     Contact
//                   </Link>
//                   <Link
//                     to="/login"
//                     className="dropdown-item"
//                     onClick={handleLogout}
//                   >
//                     Log Out
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/contact" className="dropdown-item">
//                     Contact
//                   </Link>
//                   <Link
//                     to="/login"
//                     className="dropdown-item"
//                     onClick={handleLogout}
//                   >
//                     Log Out
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

//------------------------------------------------------------------------------------------------------//

// import React, { useState, useEffect, useRef } from "react";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import {
//   Home,
//   Users,
//   Phone,
//   Info,
//   ShoppingBag,
//   Calendar,
//   Shirt,
//   Store,
//   CircleUser,
//   Aperture,
//   Bell,
// } from "lucide-react";
// import Logo from "../../assets/img/CCSSlogo.png";
// import "../../styles/nav.scss";
// import AuthService from "../../services/AuthService.js";
// import CartService from "../../services/CartService/CartService";
// import navbarService from "./navbarService.js";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";

// export function Navbar() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState(null);
//   const [userRole, setUserRole] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [persistedNotifications, setPersistedNotifications] = useState([]); // Lưu trữ thông báo cũ trên FE
//   const [cartCount, setCartCount] = useState(0);
//   const callCountRef = useRef(0);

//   // Hàm lấy thông tin người dùng từ token
//   const getUserInfoFromToken = () => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         console.log("Decoded token in Navbar:", decoded);
//         return {
//           id: decoded?.Id,
//           role: decoded?.role,
//         };
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         return { id: null, role: null };
//       }
//     }
//     console.warn("No accessToken found in localStorage");
//     return { id: null, role: null };
//   };

//   // Cập nhật số lượng sản phẩm trong giỏ hàng
//   const updateCartCount = async () => {
//     try {
//       const { id } = getUserInfoFromToken();
//       if (!id) {
//         const savedCart = localStorage.getItem("cartItems");
//         const cartItems = savedCart ? JSON.parse(savedCart) : [];
//         setCartCount(cartItems.length);
//         return;
//       }
//       const cartData = await CartService.getCartByAccountId(id);
//       const totalQuantity = cartData.listCartProduct.reduce(
//         (total, item) => total + item.quantity,
//         0
//       );
//       setCartCount(totalQuantity);
//     } catch (error) {
//       console.error("Error updating cart count:", error);
//       const savedCart = localStorage.getItem("cartItems");
//       const cartItems = savedCart ? JSON.parse(savedCart) : [];
//       setCartCount(cartItems.length);
//     }
//   };

//   // Lấy danh sách thông báo và gộp với thông báo đã lưu
//   const fetchNotifications = async (accountId) => {
//     try {
//       const notificationData = await navbarService.getNotification(accountId);
//       // Sắp xếp thông báo mới từ API
//       const sortedNewNotifications = notificationData.sort((a, b) =>
//         b.createdAt && a.createdAt
//           ? new Date(b.createdAt) - new Date(a.createdAt)
//           : b.id - a.id
//       );
//       // Lọc thông báo chưa đọc từ API
//       const unreadNotifications = sortedNewNotifications.filter(
//         (n) => !n.isRead
//       );
//       // Gộp với thông báo đã lưu (lấy tối đa 10 đã đọc)
//       const readNotifications = persistedNotifications
//         .filter((n) => n.isRead)
//         .slice(0, 10);
//       // Cập nhật danh sách hiển thị
//       const updatedNotifications = [
//         ...unreadNotifications,
//         ...readNotifications,
//       ];
//       setNotifications(updatedNotifications);
//       // Cập nhật danh sách lưu trữ
//       setPersistedNotifications(updatedNotifications);
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//       // Nếu API lỗi, giữ danh sách đã lưu
//       setNotifications(persistedNotifications);
//       toast.error("Failed to load notifications", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   // Đánh dấu thông báo đã đọc
//   const markNotificationsAsSeen = async () => {
//     try {
//       const unreadNotifications = notifications.filter(
//         (notification) => !notification.isRead
//       );
//       if (unreadNotifications.length === 0) return;

//       // Gọi API để đánh dấu đã đọc
//       await Promise.all(
//         unreadNotifications.map((notification) =>
//           navbarService.seenNotification(notification.id)
//         )
//       );

//       // Cập nhật state trên FE: đánh dấu tất cả thông báo chưa đọc thành đã đọc
//       const updatedNotifications = notifications.map((notification) => ({
//         ...notification,
//         isRead: true,
//       }));
//       // Sắp xếp lại: mới nhất ở trên
//       const sortedNotifications = updatedNotifications.sort((a, b) =>
//         b.createdAt && a.createdAt
//           ? new Date(b.createdAt) - new Date(a.createdAt)
//           : b.id - a.id
//       );
//       // Lấy tối đa 10 thông báo đã đọc
//       const limitedNotifications = sortedNotifications.slice(0, 10);
//       setNotifications(limitedNotifications);
//       setPersistedNotifications(limitedNotifications);

//       // Làm mới từ API nếu cần
//       if (userId) {
//         await fetchNotifications(userId);
//       }
//     } catch (error) {
//       console.error("Failed to mark notifications as seen:", error);
//       // Nếu API lỗi, vẫn cập nhật state trên FE
//       const updatedNotifications = notifications.map((notification) => ({
//         ...notification,
//         isRead: true,
//       }));
//       const sortedNotifications = updatedNotifications.sort((a, b) =>
//         b.createdAt && a.createdAt
//           ? new Date(b.createdAt) - new Date(a.createdAt)
//           : b.id - a.id
//       );
//       const limitedNotifications = sortedNotifications.slice(0, 10);
//       setNotifications(limitedNotifications);
//       setPersistedNotifications(limitedNotifications);
//       toast.error("Failed to mark notifications as seen", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   // Khởi tạo dữ liệu khi component mount
//   useEffect(() => {
//     const { id, role } = getUserInfoFromToken();
//     setUserId(id);
//     setUserRole(role);

//     if (id) {
//       fetchNotifications(id);
//       callCountRef.current = 1;

//       const intervalId = setInterval(() => {
//         fetchNotifications(id);
//         callCountRef.current += 1;
//       }, 5000);

//       return () => clearInterval(intervalId);
//     }

//     if (id && role !== "Cosplayer") {
//       updateCartCount();
//       window.addEventListener("storage", updateCartCount);
//       return () => window.removeEventListener("storage", updateCartCount);
//     }
//   }, []);

//   // Điều hướng đến trang hồ sơ
//   const goToProfile = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/user-profile/${id}`);
//     }
//   };

//   // Điều hướng đến lịch sử thuê
//   const goToMyHistory = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-history/${id}`);
//     }
//   };

//   // Điều hướng đến trang thuê trang phục
//   const goToMyRentalCostume = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-rental-costume/${id}`);
//     }
//   };

//   // Điều hướng đến trang tổ chức sự kiện
//   const goToMyEventOrganize = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-event-organize/${id}`);
//     }
//   };
//   const goToMyCustomerCharacter = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-customer-character/${id}`);
//     }
//   };

//   // Điều hướng đến lịch sử mua hàng
//   const goToMyPurchaseHistory = () => {
//     const { id } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-purchase-history/${id}`);
//     }
//   };

//   // Điều hướng đến trang nhiệm vụ (dành cho Cosplayer)
//   const goToMyTask = () => {
//     const { id, role } = getUserInfoFromToken();
//     if (!id) {
//       toast.warn("You are not logged in!");
//       setTimeout(() => navigate("/login"), 2100);
//       return;
//     }
//     if (role === "Cosplayer") {
//       navigate(`/my-task/${id}`);
//     } else {
//       toast.error("You do not have permission to access My Task.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   // Xử lý đăng xuất
//   const handleLogout = () => {
//     AuthService.logout();
//     setUserId(null);
//     setUserRole(null);
//     setCartCount(0);
//     setNotifications([]);
//     setPersistedNotifications([]); // Xóa thông báo khi đăng xuất
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="container mx-auto flex items-center justify-between h-24 px-4">
//         {/* Thêm placeholder cho Cosplayer để giữ layout */}
//         <div className="brand-container flex items-center">
//           {userRole !== "Cosplayer" && (
//             <Link to="/" className="flex items-center">
//               <img src={Logo} alt="CCSS Logo" className="brand-logo h-12" />
//             </Link>
//           )}
//         </div>

//         <div className="nav-menu">
//           {userRole !== "Cosplayer" && (
//             <>
//               {userId ? (
//                 <>
//                   {[
//                     { to: "/services", label: "Services", Icon: ShoppingBag },
//                     { to: "/costumes", label: "Costumes", Icon: Shirt },
//                     { to: "/cosplayers", label: "Cosplayers", Icon: Users },
//                     {
//                       to: "/event",
//                       label: "Event Organization",
//                       Icon: Aperture,
//                     },
//                     { to: "/festivals", label: "Festivals", Icon: Calendar },
//                     { to: "/souvenirs-shop", label: "Souvenirs", Icon: Store },
//                     { to: "/about", label: "About Us", Icon: Info },
//                   ].map(({ to, label, Icon }) => (
//                     <div key={to} className="dropdown-container">
//                       <NavLink
//                         to={to}
//                         className={({ isActive }) =>
//                           `nav-link ${isActive ? "nav-link-active" : ""}`
//                         }
//                       >
//                         <Icon size={20} />
//                         <span>{label}</span>
//                       </NavLink>
//                     </div>
//                   ))}
//                 </>
//               ) : (
//                 <>
//                   {[
//                     { to: "/services", label: "Services", Icon: ShoppingBag },
//                     { to: "/about", label: "About Us", Icon: Info },
//                   ].map(({ to, label, Icon }) => (
//                     <div key={to} className="dropdown-container">
//                       <NavLink
//                         to={to}
//                         className={({ isActive }) =>
//                           `nav-link ${isActive ? "nav-link-active" : ""}`
//                         }
//                       >
//                         <Icon size={20} />
//                         <span>{label}</span>
//                       </NavLink>
//                     </div>
//                   ))}
//                 </>
//               )}
//             </>
//           )}

//           {userId && (
//             <div className="dropdown-container notification-container">
//               <div
//                 className="dropdown-toggle"
//                 onClick={markNotificationsAsSeen}
//               >
//                 <Bell size={20} />
//                 {notifications.filter((n) => !n.isRead).length > 0 && (
//                   <span className="notification-badge">
//                     {notifications.filter((n) => !n.isRead).length}
//                   </span>
//                 )}
//               </div>
//               <div className="dropdown-menu dropdown-menu-notifications">
//                 {notifications.length > 0 ? (
//                   notifications.map((notification) => (
//                     <div
//                       key={notification.id}
//                       className={`dropdown-item notification-item ${
//                         notification.isRead ? "read" : "unread"
//                       }`}
//                     >
//                       <div className="notification-content">
//                         {!notification.isRead && (
//                           <span className="notification-new-label">New</span>
//                         )}
//                         <p className="notification-message">
//                           {notification.message || "Unnamed notification"}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="dropdown-item">No new notifications</div>
//                 )}
//               </div>
//             </div>
//           )}

//           <div className="dropdown-container">
//             <div className="dropdown-toggle">
//               <CircleUser size={20} />
//             </div>
//             <div className="dropdown-menu dropdown-menu-user">
//               {userId ? (
//                 <>
//                   <div onClick={goToProfile} className="dropdown-item">
//                     Profile
//                   </div>
//                   {userRole === "Cosplayer" ? (
//                     <>
//                       <div onClick={goToMyTask} className="dropdown-item">
//                         My Task
//                       </div>
//                       <div onClick={handleLogout} className="dropdown-item">
//                         Log Out
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <div onClick={goToMyHistory} className="dropdown-item">
//                         My Rental Cosplayer
//                       </div>
//                       <div
//                         onClick={goToMyRentalCostume}
//                         className="dropdown-item"
//                       >
//                         My Rental Costume
//                       </div>
//                       <div
//                         onClick={goToMyEventOrganize}
//                         className="dropdown-item"
//                       >
//                         My Event Organization
//                       </div>
//                       <div
//                         onClick={goToMyCustomerCharacter}
//                         className="dropdown-item"
//                       >
//                         My Character
//                       </div>
//                       <div
//                         onClick={goToMyPurchaseHistory}
//                         className="dropdown-item"
//                       >
//                         Purchase History
//                       </div>
//                       <Link to="/cart" className="dropdown-item cart-item">
//                         Cart
//                         {cartCount > 0 && (
//                           <span className="cart-badge">{cartCount}</span>
//                         )}
//                       </Link>
//                       <Link
//                         to="/login"
//                         className="dropdown-item"
//                         onClick={handleLogout}
//                       >
//                         Log Out
//                       </Link>
//                     </>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <Link to="/login" className="dropdown-item">
//                     Log In
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

//------------------------------------------------------------------------------------------------------//

//sửa đổi vào 23/05/2025

import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Phone,
  Info,
  ShoppingBag,
  Calendar,
  Shirt,
  Store,
  CircleUser,
  Aperture,
  Bell,
} from "lucide-react";
import Logo from "../../assets/img/CCSSlogo.png";
import "../../styles/nav.scss";
import AuthService from "../../services/AuthService.js";
import CartService from "../../services/CartService/CartService";
import navbarService from "./navbarService.js";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export function Navbar() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [persistedNotifications, setPersistedNotifications] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const callCountRef = useRef(0);

  // Hàm lấy thông tin người dùng từ token
  const getUserInfoFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token in Navbar:", decoded);
        return {
          id: decoded?.Id,
          role: decoded?.role,
        };
      } catch (error) {
        console.error("Error decoding token:", error);
        return { id: null, role: null };
      }
    }
    console.warn("No accessToken found in localStorage");
    return { id: null, role: null };
  };

  // Hàm cập nhật tổng số lượng món hàng trong giỏ hàng
  const updateCartCount = async () => {
    try {
      const { id } = getUserInfoFromToken();
      console.log("Updating cart count for userId:", id); // Debug
      if (!id) {
        // Nếu không có người dùng đăng nhập, lấy giỏ hàng từ localStorage
        const savedCart = localStorage.getItem("cartItems");
        const cartItems = savedCart ? JSON.parse(savedCart) : [];
        console.log("Cart items from localStorage:", cartItems); // Debug
        const totalQuantity = cartItems.reduce(
          (total, item) => total + (item.quantity || 0),
          0
        );
        console.log("Total quantity from localStorage:", totalQuantity); // Debug
        setCartCount(totalQuantity);
        return;
      }
      // Lấy dữ liệu giỏ hàng từ API
      const cartData = await CartService.getCartByAccountId(id);
      console.log("Cart data from API:", cartData); // Debug
      // Kiểm tra listCartProduct có tồn tại và là mảng
      const listCartProduct = Array.isArray(cartData?.listCartProduct)
        ? cartData.listCartProduct
        : [];
      // Tính tổng số lượng món hàng
      const totalQuantity = listCartProduct.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      console.log("Total quantity from API:", totalQuantity); // Debug
      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Error updating cart count:", error);
      // Fallback về localStorage nếu API lỗi
      const savedCart = localStorage.getItem("cartItems");
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      console.log("Fallback cart items from localStorage:", cartItems); // Debug
      const totalQuantity = cartItems.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      );
      console.log("Fallback total quantity:", totalQuantity); // Debug
      setCartCount(totalQuantity);
    }
  };

  // Lấy danh sách thông báo
  const fetchNotifications = async (accountId) => {
    try {
      const notificationData = await navbarService.getNotification(accountId);
      const sortedNewNotifications = notificationData.sort((a, b) =>
        b.createdAt && a.createdAt
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : b.id - a.id
      );
      const unreadNotifications = sortedNewNotifications.filter(
        (n) => !n.isRead
      );
      const readNotifications = persistedNotifications
        .filter((n) => n.isRead)
        .slice(0, 10);
      const updatedNotifications = [
        ...unreadNotifications,
        ...readNotifications,
      ];
      setNotifications(updatedNotifications);
      setPersistedNotifications(updatedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications(persistedNotifications);
      toast.error("Failed to load notifications");
    }
  };

  // Đánh dấu thông báo đã đọc
  const markNotificationsAsSeen = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (notification) => !notification.isRead
      );
      if (unreadNotifications.length === 0) return;

      await Promise.all(
        unreadNotifications.map((notification) =>
          navbarService.seenNotification(notification.id)
        )
      );

      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
      const sortedNotifications = updatedNotifications.sort((a, b) =>
        b.createdAt && a.createdAt
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : b.id - a.id
      );
      const limitedNotifications = sortedNotifications.slice(0, 10);
      setNotifications(limitedNotifications);
      setPersistedNotifications(limitedNotifications);

      if (userId) {
        await fetchNotifications(userId);
      }
    } catch (error) {
      console.error("Failed to mark notifications as seen:", error);
      toast.error("Failed to mark notifications as seen");
    }
  };

  // Khởi tạo dữ liệu khi component mount
  useEffect(() => {
    const { id, role } = getUserInfoFromToken();
    setUserId(id);
    setUserRole(role);

    if (id) {
      fetchNotifications(id);
      callCountRef.current = 1;

      const intervalId = setInterval(() => {
        fetchNotifications(id);
        callCountRef.current += 1;
      }, 5000);

      return () => clearInterval(intervalId);
    }

    if (id && role !== "Cosplayer") {
      updateCartCount();
      // Lắng nghe sự kiện storageUpdate
      const handleStorageUpdate = () => {
        console.log("Storage update event triggered"); // Debug
        updateCartCount();
      };
      window.addEventListener("storageUpdate", handleStorageUpdate);
      window.addEventListener("storage", handleStorageUpdate);
      return () => {
        window.removeEventListener("storageUpdate", handleStorageUpdate);
        window.removeEventListener("storage", handleStorageUpdate);
      };
    }
  }, []);

  // Điều hướng đến các trang
  const goToProfile = () => {
    const { id } = getUserInfoFromToken();
    if (!id) {
      toast.warn("You are not logged in!");
      setTimeout(() => navigate("/login"), 2100);
    } else {
      navigate(`/user-profile/${id}`);
    }
  };

  const goToMyHistory = () => {
    const { id } = getUserInfoFromToken();
    if (!id) {
      toast.warn("You are not logged in!");
      setTimeout(() => navigate("/login"), 2100);
    } else {
      navigate(`/my-history/${id}`);
    }
  };

  const goToMyRentalCostume = () => {
    const { id } = getUserInfoFromToken();
    if (!id) {
      toast.warn("You are not logged in!");
      setTimeout(() => navigate("/login"), 2100);
    } else {
      navigate(`/my-rental-costume/${id}`);
    }
  };

  const goToMyEventOrganize = () => {
    const { id } = getUserInfoFromToken();
    if (!id) {
      toast.warn("You are not logged in!");
      setTimeout(() => navigate("/login"), 2100);
    } else {
      navigate(`/my-event-organize/${id}`);
    }
  };

  const goToMyCustomerCharacter = () => {
    const { id } = getUserInfoFromToken();
    if (!id) {
      toast.warn("You are not logged in!");
      setTimeout(() => navigate("/login"), 2100);
    } else {
      navigate(`/my-customer-character/${id}`);
    }
  };

  const goToMyPurchaseHistory = () => {
    const { id } = getUserInfoFromToken();
    if (!id) {
      toast.warn("You are not logged in!");
      setTimeout(() => navigate("/login"), 2100);
    } else {
      navigate(`/my-purchase-history/${id}`);
    }
  };

  const goToMyTask = () => {
    const { id, role } = getUserInfoFromToken();
    if (!id) {
      toast.warn("You are not logged in!");
      setTimeout(() => navigate("/login"), 2100);
      return;
    }
    if (role === "Cosplayer") {
      navigate(`/my-task/${id}`);
    } else {
      toast.error("You do not have permission to access My Task.");
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    AuthService.logout();
    setUserId(null);
    setUserRole(null);
    setCartCount(0);
    setNotifications([]);
    setPersistedNotifications([]);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container mx-auto flex items-center justify-between h-24 px-4">
        <div className="brand-container flex items-center">
          {userRole !== "Cosplayer" && (
            <Link to="/" className="flex items-center">
              <img src={Logo} alt="CCSS Logo" className="brand-logo h-12" />
            </Link>
          )}
        </div>

        <div className="nav-menu">
          {userRole !== "Cosplayer" && (
            <>
              {userId ? (
                <>
                  {[
                    { to: "/services", label: "Services", Icon: ShoppingBag },
                    { to: "/costumes", label: "Costumes", Icon: Shirt },
                    { to: "/cosplayers", label: "Cosplayers", Icon: Users },
                    {
                      to: "/event",
                      label: "Event Organization",
                      Icon: Aperture,
                    },
                    { to: "/festivals", label: "Festivals", Icon: Calendar },
                    { to: "/souvenirs-shop", label: "Souvenirs", Icon: Store },
                    { to: "/about", label: "About Us", Icon: Info },
                  ].map(({ to, label, Icon }) => (
                    <div key={to} className="dropdown-container">
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "nav-link-active" : ""}`
                        }
                      >
                        <Icon size={20} />
                        <span>{label}</span>
                      </NavLink>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { to: "/services", label: "Services", Icon: ShoppingBag },
                    { to: "/about", label: "About Us", Icon: Info },
                  ].map(({ to, label, Icon }) => (
                    <div key={to} className="dropdown-container">
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          `nav-link ${isActive ? "nav-link-active" : ""}`
                        }
                      >
                        <Icon size={20} />
                        <span>{label}</span>
                      </NavLink>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {userId && (
            <div className="dropdown-container notification-container">
              <div
                className="dropdown-toggle"
                onClick={markNotificationsAsSeen}
              >
                <Bell size={20} />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </div>
              <div className="dropdown-menu dropdown-menu-notifications">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`dropdown-item notification-item ${notification.isRead ? "read" : "unread"
                        }`}
                    >
                      <div className="notification-content">
                        {!notification.isRead && (
                          <span className="notification-new-label">New</span>
                        )}
                        <p className="notification-message">
                          {notification.message || "Unnamed notification"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">No new notifications</div>
                )}
              </div>
            </div>
          )}

          <div className="dropdown-container">
            <div className="dropdown-toggle">
              <CircleUser size={20} />
              {/* Hiển thị badge tổng số lượng món hàng với inline style */}
              {cartCount > 0 && userRole !== "Cosplayer" && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#f85caa",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                    zIndex: 100,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
            <div className="dropdown-menu dropdown-menu-user">
              {userId ? (
                <>
                  <div onClick={goToProfile} className="dropdown-item">
                    Profile
                  </div>
                  {userRole === "Cosplayer" ? (
                    <>
                      <div onClick={goToMyTask} className="dropdown-item">
                        My Task
                      </div>
                      <div onClick={handleLogout} className="dropdown-item">
                        Log Out
                      </div>
                    </>
                  ) : (
                    <>
                      <div onClick={goToMyHistory} className="dropdown-item">
                        My Rental Cosplayer
                      </div>
                      <div
                        onClick={goToMyRentalCostume}
                        className="dropdown-item"
                      >
                        My Rental Costume
                      </div>
                      <div
                        onClick={goToMyEventOrganize}
                        className="dropdown-item"
                      >
                        My Event Organization
                      </div>
                      <div
                        onClick={goToMyCustomerCharacter}
                        className="dropdown-item"
                      >
                        My Character
                      </div>
                      <div
                        onClick={goToMyPurchaseHistory}
                        className="dropdown-item"
                      >
                        Purchase History
                      </div>
                      <Link to="/cart" className="dropdown-item cart-item">
                        Cart
                        {cartCount > 0 && (
                          <span className="cart-badge">{cartCount}</span>
                        )}
                      </Link>
                      <Link
                        to="/login"
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item">
                    Log In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;