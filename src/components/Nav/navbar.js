// import React from "react";
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
// } from "lucide-react";
// import Logo from "../../assets/img/CCSSlogo.png";
// import "../../styles/nav.scss";
// import AuthService from "../../services/AuthService.js";

// export function Navbar() {
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     AuthService.logout();
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

//   const festivalCategories = [
//     { name: "All", path: "/festivals" },
//     { name: "Anime", path: "/festivals/anime" },
//     { name: "Comic Con", path: "/festivals/comic-con" },
//     { name: "Mythology", path: "/festivals/mythology" },
//     { name: "Gaming", path: "/festivals/gaming" },
//     { name: "Superhero", path: "/festivals/superhero" },
//     { name: "Cosplay", path: "/festivals/cosplay" },
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
//             {
//               to: "/cosplayers",
//               label: "Cosplayers",
//               Icon: Users,
//             },
//             {
//               to: "/event-organize",
//               label: "Event Organization",
//               Icon: Aperture,
//             }, // Shortened label

//             {
//               to: "/festivals",
//               label: "Festivals",
//               Icon: Calendar,
//               hasDropdown: true,
//               dropdownItems: festivalCategories,
//               dropdownClass: "festival-dropdown-menu",
//             },
//             { to: "/souvenirs-shop", label: "Souvenirs", Icon: Store },
//             { to: "/about", label: "About Us", Icon: Info },
//             // { to: "/contact", label: "Contact", Icon: Phone },
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
//                   <Icon size={20} /> {/* Changed from 24 to 20 */}
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

//           <div className="dropdown-container">
//             <div className="dropdown-toggle">
//               <CircleUser size={20} /> {/* Changed from 24 to 20 */}
//             </div>
//             <div className="dropdown-menu dropdown-menu-user">
//               <Link to="/user-profile" className="dropdown-item">
//                 Profile
//               </Link>
//               <Link to="#" className="dropdown-item">
//                 Cart
//               </Link>
//               <Link to="/contact" className="dropdown-item">
//                 Contact
//               </Link>
//               <Link
//                 to="/login"
//                 className="dropdown-item"
//                 onClick={() => handleLogout()}
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
// } from "lucide-react";
// import Logo from "../../assets/img/CCSSlogo.png";
// import "../../styles/nav.scss";
// import AuthService from "../../services/AuthService.js";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";

// export function Navbar() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState(null);

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) return;

//     try {
//       const decoded = jwtDecode(accessToken);
//       const accountId = decoded?.Id;
//       setUserId(accountId);
//     } catch (error) {
//       console.error("Lỗi khi giải mã token:", error);
//     }
//   }, []);

//   const goToProfile = () => {
//     if (userId) {
//       navigate(`/user-profile/${userId}`);
//     } else {
//       toast.warn("you are not login yet!");
//       setTimeout(function () {
//         navigate("/login");
//       }, 2100);
//     }
//   };

//   const handleLogout = () => {
//     AuthService.logout();
//     navigate("/login");
//   };

//   const cosplayThemes = [
//     { name: "All", path: "/costumes" },
//     { name: "Anime", path: "/costumes/anime" },
//     // ... các theme khác
//   ];

//   const festivalCategories = [
//     { name: "All", path: "/festivals" },
//     { name: "Anime", path: "/festivals/anime" },
//     // ... các category khác
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
//               to: "/event-organize",
//               label: "Event Organization",
//               Icon: Aperture,
//             },
//             {
//               to: "/festivals",
//               label: "Festivals",
//               Icon: Calendar,
//               hasDropdown: true,
//               dropdownItems: festivalCategories,
//               dropdownClass: "festival-dropdown-menu",
//             },
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

//           <div className="dropdown-container">
//             <div className="dropdown-toggle">
//               <CircleUser size={20} />
//             </div>
//             <div className="dropdown-menu dropdown-menu-user">
//               <div onClick={goToProfile} className="dropdown-item">
//                 Profile
//               </div>
//               <Link to="#" className="dropdown-item">
//                 Cart
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

///======================================

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
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";

// export function Navbar() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState(null);
//   const accessToken = localStorage.getItem("accessToken");
//   const [notifications, setNotifications] = useState(3);
//   const [cartCount, setCartCount] = useState(0); // State để lưu số lượng món hàng

//   const getUserIdFromToken = () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         return decoded?.Id;
//       } catch (error) {
//         console.error("Lỗi khi giải mã token:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   // Lấy số lượng món hàng từ localStorage
//   useEffect(() => {
//     const id = getUserIdFromToken();
//     if (id) setUserId(id);

//     // Lấy cartItems từ localStorage và tính số lượng món hàng
//     const savedCart = localStorage.getItem("cartItems");
//     const cartItems = savedCart ? JSON.parse(savedCart) : [];
//     setCartCount(cartItems.length);
//   }, []);

//   const goToProfile = () => {
//     const id = getUserIdFromToken();
//     if (!id) {
//       toast.warn("Bạn chưa đăng nhập!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/user-profile/${id}`);
//     }
//   };

//   const handleLogout = () => {
//     AuthService.logout();
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

//   const festivalCategories = [
//     { name: "All", path: "/festivals" },
//     { name: "Anime", path: "/festivals/anime" },
//     { name: "Comic Con", path: "/festivals/comic-con" },
//     { name: "Mythology", path: "/festivals/mythology" },
//     { name: "Gaming", path: "/festivals/gaming" },
//     { name: "Superhero", path: "/festivals/superhero" },
//     { name: "Cosplay", path: "/festivals/cosplay" },
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
//             {
//               to: "/festivals",
//               label: "Festivals",
//               Icon: Calendar,
//               hasDropdown: true,
//               dropdownItems: festivalCategories,
//               dropdownClass: "festival-dropdown-menu",
//             },
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
//               {accessToken && (
//                 <div onClick={goToProfile} className="dropdown-item">
//                   Profile
//                 </div>
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
//               <Link to="/my-history" className="dropdown-item">
//                 My History
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

//======================================
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
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";

// export function Navbar() {
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState(null);
//   const accessToken = localStorage.getItem("accessToken");
//   const [notifications, setNotifications] = useState(3);
//   const [cartCount, setCartCount] = useState(0);

//   const getUserIdFromToken = () => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         return decoded?.Id;
//       } catch (error) {
//         console.error("Lỗi khi giải mã token:", error);
//         return null;
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     const id = getUserIdFromToken();
//     if (id) setUserId(id);

//     const savedCart = localStorage.getItem("cartItems");
//     const cartItems = savedCart ? JSON.parse(savedCart) : [];
//     setCartCount(cartItems.length);
//   }, []);

//   const goToProfile = () => {
//     const id = getUserIdFromToken();
//     if (!id) {
//       toast.warn("Bạn chưa đăng nhập!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/user-profile/${id}`);
//     }
//   };

//   const goToMyHistory = () => {
//     const id = getUserIdFromToken();
//     if (!id) {
//       toast.warn("Bạn chưa đăng nhập!");
//       setTimeout(() => navigate("/login"), 2100);
//     } else {
//       navigate(`/my-history/${id}`);
//     }
//   };

//   const goToMyTask = () => {
//     const id = getUserIdFromToken();
//     if (!id) {
//       navigate("/login");
//       toast.warn("Bạn chưa đăng nhập!");
//     } else {
//       navigate(`/my-task/${id}`);
//     }
//   };

//   const handleLogout = () => {
//     AuthService.logout();
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

//   const festivalCategories = [
//     { name: "All", path: "/festivals" },
//     { name: "Anime", path: "/festivals/anime" },
//     { name: "Comic Con", path: "/festivals/comic-con" },
//     { name: "Mythology", path: "/festivals/mythology" },
//     { name: "Gaming", path: "/festivals/gaming" },
//     { name: "Superhero", path: "/festivals/superhero" },
//     { name: "Cosplay", path: "/festivals/cosplay" },
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
//             {
//               to: "/festivals",
//               label: "Festivals",
//               Icon: Calendar,
//               hasDropdown: true,
//               dropdownItems: festivalCategories,
//               dropdownClass: "festival-dropdown-menu",
//             },
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
//               {accessToken && (
//                 <>
//                   <div onClick={goToProfile} className="dropdown-item">
//                     Profile
//                   </div>
//                   <div onClick={goToMyHistory} className="dropdown-item">
//                     My History
//                   </div>
//                   <div onClick={goToMyTask} className="dropdown-item">
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

//==============
import React, { useState, useEffect } from "react";
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
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export function Navbar() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null); // State cho role
  const [notifications, setNotifications] = useState(3);
  const [cartCount, setCartCount] = useState(0);

  const getUserInfoFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token in Navbar:", decoded); // Debug token
        return {
          id: decoded?.Id,
          role: decoded?.role, // Lấy role từ token
        };
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return { id: null, role: null };
      }
    }
    return { id: null, role: null };
  };

  const updateCartCount = async () => {
    try {
      const { id } = getUserInfoFromToken();
      if (!id) {
        // Nếu không có userId, thử lấy từ localStorage (fallback)
        const savedCart = localStorage.getItem("cartItems");
        const cartItems = savedCart ? JSON.parse(savedCart) : [];
        setCartCount(cartItems.length);
        return;
      }
      const cartData = await CartService.getCartByAccountId(id);
      const totalQuantity = cartData.listCartProduct.reduce(
        (total, item) => total + item.quantity,
        0
      );
      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Error updating cart count:", error);
      // Fallback về localStorage nếu backend lỗi
      const savedCart = localStorage.getItem("cartItems");
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      setCartCount(cartItems.length);
    }
  };

  useEffect(() => {
    const { id, role } = getUserInfoFromToken();
    setUserId(id);
    setUserRole(role); // Cập nhật role vào state

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

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
      toast.error("You do not have permission to access My Task.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUserId(null);
    setUserRole(null);
    setCartCount(0); // Reset cart count khi logout
    navigate("/login");
  };

  const cosplayThemes = [
    { name: "All", path: "/costumes" },
    { name: "Anime", path: "/costumes/anime" },
    { name: "Game", path: "/costumes/game" },
    { name: "Superhero", path: "/costumes/superhero" },
    { name: "Fantasy", path: "/costumes/fantasy" },
    { name: "Sci-Fi", path: "/costumes/sci-fi" },
    { name: "Horror", path: "/costumes/horror" },
    { name: "Historical", path: "/costumes/historical" },
    { name: "Mythology", path: "/costumes/mythology" },
    { name: "Steampunk", path: "/costumes/steampunk" },
    { name: "Cyberpunk", path: "/costumes/cyberpunk" },
    { name: "Cartoon", path: "/costumes/cartoon" },
  ];

  const festivalCategories = [
    { name: "All", path: "/festivals" },
    { name: "Anime", path: "/festivals/anime" },
    { name: "Comic Con", path: "/festivals/comic-con" },
    { name: "Mythology", path: "/festivals/mythology" },
    { name: "Gaming", path: "/festivals/gaming" },
    { name: "Superhero", path: "/festivals/superhero" },
    { name: "Cosplay", path: "/festivals/cosplay" },
  ];

  return (
    <nav className="navbar">
      <div className="container mx-auto flex items-center justify-between h-24 px-4">
        <div className="brand-container flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="CCSS Logo" className="brand-logo h-12" />
          </Link>
        </div>

        <div className="nav-menu">
          {[
            { to: "/services", label: "Services", Icon: ShoppingBag },
            {
              to: "/costumes",
              label: "Costumes",
              Icon: Shirt,
              hasDropdown: true,
              dropdownItems: cosplayThemes,
              dropdownClass: "dropdown-menu-categories",
            },
            { to: "/cosplayers", label: "Cosplayers", Icon: Users },
            {
              to: "/event",
              label: "Event Organization",
              Icon: Aperture,
            },
            {
              to: "/festivals",
              label: "Festivals",
              Icon: Calendar,
              hasDropdown: true,
              dropdownItems: festivalCategories,
              dropdownClass: "festival-dropdown-menu",
            },
            { to: "/souvenirs-shop", label: "Souvenirs", Icon: Store },
            { to: "/about", label: "About Us", Icon: Info },
          ].map(
            ({
              to,
              label,
              Icon,
              hasDropdown,
              dropdownItems,
              dropdownClass,
            }) => (
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
                {hasDropdown && (
                  <div className={`dropdown-menu ${dropdownClass}`}>
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="dropdown-item"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          <div className="dropdown-container notification-container">
            <div className="dropdown-toggle">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="notification-badge">{notifications}</span>
              )}
            </div>
            <div className="dropdown-menu dropdown-menu-notifications">
              <div className="dropdown-item">No new notifications</div>
            </div>
          </div>

          <div className="dropdown-container">
            <div className="dropdown-toggle">
              <CircleUser size={20} />
            </div>
            <div className="dropdown-menu dropdown-menu-user">
              {userId && (
                <>
                  <div onClick={goToProfile} className="dropdown-item">
                    Profile
                  </div>
                  <div onClick={goToMyHistory} className="dropdown-item">
                    My History
                  </div>
                  <div
                    onClick={goToMyTask}
                    className="dropdown-item"
                    style={{
                      display: userRole === "Cosplayer" ? "block" : "none",
                    }}
                  >
                    My Task
                  </div>
                </>
              )}
              <Link to="/cart" className="dropdown-item cart-item">
                Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
              <Link to="/contact" className="dropdown-item">
                Contact
              </Link>
              <Link
                to="/login"
                className="dropdown-item"
                onClick={handleLogout}
              >
                Log Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
