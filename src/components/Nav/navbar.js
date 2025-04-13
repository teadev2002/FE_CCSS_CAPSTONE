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
  const [userRole, setUserRole] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [cartCount, setCartCount] = useState(0);

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
      const savedCart = localStorage.getItem("cartItems");
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      setCartCount(cartItems.length);
    }
  };

  useEffect(() => {
    const { id, role } = getUserInfoFromToken();
    setUserId(id);
    setUserRole(role);

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
    setCartCount(0);
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
            { to: "/festivals", label: "Festivals", Icon: Calendar },
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
              {userId ? (
                <>
                  <div onClick={goToProfile} className="dropdown-item">
                    Profile
                  </div>
                  {userRole !== "Cosplayer" && (
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
                        onClick={goToMyPurchaseHistory}
                        className="dropdown-item"
                      >
                        Purchase History
                      </div>
                    </>
                  )}
                  {userRole === "Cosplayer" && (
                    <div onClick={goToMyTask} className="dropdown-item">
                      My Task
                    </div>
                  )}
                  {userRole !== "Cosplayer" && (
                    <Link to="/cart" className="dropdown-item cart-item">
                      Cart
                      {cartCount > 0 && (
                        <span className="cart-badge">{cartCount}</span>
                      )}
                    </Link>
                  )}
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
                </>
              ) : (
                <>
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
