// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   Menu,
//   Ticket,
//   Settings2,
//   Shapes,
//   CalendarHeart,
//   UserSearch,
//   PersonStanding,
//   MessageCircleMore,
//   GitPullRequest,
//   ReceiptText,
//   ListChecks,
// } from "lucide-react";
// import "../../styles/Manager/SidebarManagement.scss";

// const SidebarManagement = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
//       <div className="sidebar-header">
//         <h3 className="brand">Manager</h3>
//         <button className="toggle-btn" onClick={toggleSidebar}>
//           <Menu size={24} />
//         </button>
//       </div>

//       <nav className="sidebar-nav">
//         <NavLink
//           to="/manage/cosplayer"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <Users size={20} />
//           <span>Manage Cosplayer</span>
//         </NavLink>
//         <NavLink
//           to="/manage/request"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <GitPullRequest size={20} />
//           <span>Manage Request</span>
//         </NavLink>
//         <NavLink
//           to="/manage/request-customer-character"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <GitPullRequest size={20} />
//           <span>Manage Request CusChar</span>
//         </NavLink>
//         <NavLink
//           to="/manage/assign-task"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <ListChecks size={20} />
//           <span> Manage Assign Task</span>
//         </NavLink>
//         <NavLink
//           to="/manage/contract"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <ReceiptText size={20} />
//           <span>Manage Contract</span>
//         </NavLink>

//         <NavLink
//           to="/manage/ticket"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <Ticket size={20} />
//           <span> Manage Event Ticket</span>
//         </NavLink>

//         <NavLink
//           to="/manage/souvenir"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <Shapes size={20} />
//           <span>Manage Souvenirs</span>
//         </NavLink>

//         <NavLink
//           to="*"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <CalendarHeart size={20} />
//           <span>Manage Event</span>
//         </NavLink>

//         <NavLink
//           to="manage/account"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <UserSearch size={20} />
//           <span>Manage Account</span>
//         </NavLink>

//         <NavLink
//           to="/manage/character"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <PersonStanding size={20} />
//           <span>Manage Character</span>
//         </NavLink>

//         <NavLink
//           to="*"
//           className={({ isActive }) =>
//             isActive ? "nav-link active" : "nav-link"
//           }
//         >
//           <MessageCircleMore size={20} />
//           <span>Manage Feedback</span>
//         </NavLink>
//       </nav>
//     </div>
//   );
// };

// export default SidebarManagement;

// import React, { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   Menu,
//   Ticket,
//   Settings2,
//   Shapes,
//   CalendarHeart,
//   UserSearch,
//   PersonStanding,
//   MessageCircleMore,
//   GitPullRequest,
//   ReceiptText,
//   ListChecks,
// } from "lucide-react";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";
// import "../../styles/Manager/SidebarManagement.scss";
// import AuthService from "../../services/AuthService"; // Import AuthService để kiểm tra quyền truy cập
// const SidebarManagement = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [role, setRole] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         setRole(decoded?.role); // Giả sử role nằm trong field "role" của token
//       } catch (error) {
//         console.error("Invalid token", error);
//         toast.error("Invalid token. Please log in again.");
//       }
//     } else {
//       toast.error("You need to log in to access this page.");
//       navigate("/login"); // Chuyển hướng về trang đăng nhập nếu không có token
//     }
//   }, [navigate]);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   // Hàm kiểm tra quyền truy cập và hiển thị toast nếu không được phép
//   const checkPermission = (allowedRoles, path) => {
//     if (!role || !allowedRoles.includes(role)) {
//       toast.error("You are not permitted");
//       return false;
//     }
//     return true;
//   };

//   // Danh sách các route và vai trò được phép
//   const routes = [
//     {
//       path: "/manage/cosplayer",
//       label: "Manage Cosplayer",
//       icon: <Users size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/request",
//       label: "Manage Request",
//       icon: <GitPullRequest size={20} />,
//       allowedRoles: ["Manager", "Consultant"],
//     },
//     {
//       path: "/manage/request-customer-character",
//       label: "Manage Request CusChar",
//       icon: <GitPullRequest size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/assign-task",
//       label: "Manage Assign Task",
//       icon: <ListChecks size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/contract",
//       label: "Manage Contract",
//       icon: <ReceiptText size={20} />,
//       allowedRoles: ["Consultant"],
//     },
//     {
//       path: "/manage/ticket",
//       label: "Manage Event Ticket",
//       icon: <Ticket size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/souvenir",
//       label: "Manage Souvenirs",
//       icon: <Shapes size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/event",
//       label: "Manage Event",
//       icon: <CalendarHeart size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/account",
//       label: "Manage Account",
//       icon: <UserSearch size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/character",
//       label: "Manage Character",
//       icon: <PersonStanding size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/feedback",
//       label: "Manage Feedback",
//       icon: <MessageCircleMore size={20} />,
//       allowedRoles: ["Manager"],
//     },
//   ];

//   return (
//     <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
//       <div className="sidebar-header">
//         <h3 className="brand">{role || "Manager"}</h3>
//         <button className="toggle-btn" onClick={toggleSidebar}>
//           <Menu size={24} />
//         </button>
//       </div>

//       <nav className="sidebar-nav">
//         {routes.map((route) => (
//           <NavLink
//             key={route.path}
//             to={route.path}
//             className={({ isActive }) =>
//               isActive ? "nav-link active" : "nav-link"
//             }
//             onClick={(e) => {
//               if (!checkPermission(route.allowedRoles, route.path)) {
//                 e.preventDefault(); // Ngăn chuyển hướng nếu không có quyền
//               }
//             }}
//           >
//             {route.icon}
//             <span>{route.label}</span>
//           </NavLink>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default SidebarManagement;

import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Menu,
  Ticket,
  Settings2,
  Shapes,
  CalendarHeart,
  UserSearch,
  PersonStanding,
  MessageCircleMore,
  GitPullRequest,
  ReceiptText,
  ListChecks,
  LogOut, // Added LogOut icon
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "../../styles/Manager/SidebarManagement.scss";
import AuthService from "../../services/AuthService";

const SidebarManagement = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setRole(decoded?.role); // Giả sử role nằm trong field "role" của token
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

  const checkPermission = (allowedRoles, path) => {
    if (!role || !allowedRoles.includes(role)) {
      toast.error("You are not permitted");
      return false;
    }
    return true;
  };

  const handleLogout = () => {
    AuthService.logout();
    setRole(null); // Clear role state
    navigate("/login");
  };

  const routes = [
    {
      path: "/manage/cosplayer",
      label: "Manage Cosplayer",
      icon: <Users size={20} />,
      allowedRoles: ["Manager"],
    },
    {
      path: "/manage/request",
      label: "Manage Request",
      icon: <GitPullRequest size={20} />,
      allowedRoles: ["Manager", "Consultant"],
    },
    {
      path: "/manage/request-customer-character",
      label: "Manage Request CusChar",
      icon: <GitPullRequest size={20} />,
      allowedRoles: ["Manager"],
    },
    {
      path: "/manage/assign-task",
      label: "Manage Assign Task",
      icon: <ListChecks size={20} />,
      allowedRoles: ["Manager"],
    },
    {
      path: "/manage/contract",
      label: "Manage Contract",
      icon: <ReceiptText size={20} />,
      allowedRoles: ["Consultant"],
    },
    {
      path: "/manage/ticket",
      label: "Manage Event Ticket",
      icon: <Ticket size={20} />,
      allowedRoles: ["Manager"],
    },
    {
      path: "/manage/souvenir",
      label: "Manage Souvenirs",
      icon: <Shapes size={20} />,
      allowedRoles: ["Manager"],
    },
    {
      path: "/manage/event",
      label: "Manage Event",
      icon: <CalendarHeart size={20} />,
      allowedRoles: ["Manager"],
    },
    {
      path: "/manage/account",
      label: "Manage Account",
      icon: <UserSearch size={20} />,
      allowedRoles: ["Manager"],
    },
    {
      path: "/manage/character",
      label: "Manage Character",
      icon: <PersonStanding size={20} />,
      allowedRoles: ["Manager"],
    },
    {
      path: "/manage/feedback",
      label: "Manage Feedback",
      icon: <MessageCircleMore size={20} />,
      allowedRoles: ["Manager"],
    },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h3 className="brand">{role || "Manager"}</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={(e) => {
              if (!checkPermission(route.allowedRoles, route.path)) {
                e.preventDefault();
              }
            }}
          >
            {route.icon}
            <span>{route.label}</span>
          </NavLink>
        ))}
        {/* Logout Button */}
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

export default SidebarManagement;
