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
} from "lucide-react";
import Logo from "../../assets/img/CCSSlogo.png";
import "../../styles/nav.scss";
import AuthService from "../../services/AuthService.js";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export function Navbar() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  // Hàm tiện ích để lấy userId từ accessToken
  const getUserIdFromToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        return decoded?.Id; // Giả sử token có trường "Id"
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return null;
      }
    }
    return null;
  };

  // Cập nhật userId khi component mount
  useEffect(() => {
    const id = getUserIdFromToken();
    if (id) setUserId(id);
  }, []);

  // Hàm điều hướng tới trang Profile
  const goToProfile = () => {
    const id = getUserIdFromToken();
    if (!id) {
      toast.warn("Bạn chưa đăng nhập!");
      setTimeout(() => navigate("/login"), 2100);
    } else {
      navigate(`/user-profile/${id}`); // Sử dụng route hiện tại của bạn
    }
  };

  const handleLogout = () => {
    AuthService.logout();
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

          <div className="dropdown-container">
            <div className="dropdown-toggle">
              <CircleUser size={20} />
            </div>
            <div className="dropdown-menu dropdown-menu-user">
              {accessToken && ( // Chỉ render nếu accessToken tồn tại
                <div onClick={goToProfile} className="dropdown-item">
                  Profile
                </div>
              )}
              <Link to="#" className="dropdown-item">
                Cart
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
