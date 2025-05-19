// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   DollarSign,
//   BarChart2,
//   Settings,
//   Menu,
// } from "lucide-react";
// import "../../styles/Admin/Sidebar.scss";

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
//       <div className="sidebar-header">
//         <h3 className="brand">Admin</h3>
//         <button className="toggle-btn" onClick={toggleSidebar}>
//           <Menu size={24} />
//         </button>
//       </div>

//       <nav className="sidebar-nav">
//         <NavLink
//           to="/admin/admin-overview"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <LayoutDashboard size={20} />
//           <span>Admin Overview</span>
//         </NavLink>

//         <NavLink
//           to="/admin/user-analytics"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <Users size={20} />
//           <span>User Analytics</span>
//         </NavLink>

//         <NavLink
//           to="/admin/order-revenue-performance"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <DollarSign size={20} />
//           <span>Order & Revenue</span>
//         </NavLink>

//         {/* <NavLink
//           to="/admin/user-statistics"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <BarChart2 size={20} />
//           <span>User Statistics</span>
//         </NavLink>

//         <NavLink
//           to="/admin/system-management"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <Settings size={20} />
//           <span>System & Management</span>
//         </NavLink> */}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


//--------------------------------------------------------------------------------------------------------------//
// src/components/Sidebar.jsx

// Nhập các thư viện và biểu tượng
import React, { useState, useEffect } from "react"; // [THAY ĐỔI] Thêm useEffect
import { NavLink, useNavigate } from "react-router-dom"; // [THAY ĐỔI] Thêm useNavigate
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Menu,
  LogOut, // [THAY ĐỔI] Thêm LogOut
} from "lucide-react";
import { jwtDecode } from "jwt-decode"; // [THAY ĐỔI] Thêm jwtDecode
import { toast } from "react-toastify"; // [THAY ĐỔI] Thêm toast
import "../../styles/Admin/Sidebar.scss";
import AuthService from "../../services/AuthService"; // [THAY ĐỔI] Thêm AuthService

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState(null); // [THAY ĐỔI] Thêm state role
  const navigate = useNavigate(); // [THAY ĐỔI] Thêm useNavigate

  // [THAY ĐỔI] Thêm useEffect để kiểm tra token
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setRole(decoded?.role);
      } catch (error) {
        console.error("Invalid token", error);
        toast.error("Invalid token. Please log in again.");
        navigate("/login");
      }
    } else {
      toast.error("You need to log in to access this page.");
      navigate("/login");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // [THAY ĐỔI] Thêm hàm handleLogout
  const handleLogout = () => {
    AuthService.logout();
    setRole(null);
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h3 className="brand">Admin</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/admin/admin-overview"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <LayoutDashboard size={20} />
          <span>Admin Overview</span>
        </NavLink>

        <NavLink
          to="/admin/user-analytics"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Users size={20} />
          <span>User Analytics</span>
        </NavLink>

        <NavLink
          to="/admin/account-management"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Users size={20} />
          <span>Account Management</span>
        </NavLink>

        <NavLink
          to="/admin/order-revenue-performance"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <DollarSign size={20} />
          <span>Order & Revenue</span>
        </NavLink>

        {/* [THAY ĐỔI] Thêm nút Log Out */}
        <NavLink
          to="/login"
          className="nav-link logout-link"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;