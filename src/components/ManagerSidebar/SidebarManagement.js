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

//----------------------------------------------------------------------------------------------------//

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
//   LogOut,
//   CheckCircle,
//   ListTodo,
//   Activity,
//   ShoppingBag,
// } from "lucide-react";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "react-toastify";
// import "../../styles/Manager/SidebarManagement.scss";
// import AuthService from "../../services/AuthService";

// const SidebarManagement = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [role, setRole] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (accessToken) {
//       try {
//         const decoded = jwtDecode(accessToken);
//         setRole(decoded?.role);
//       } catch (error) {
//         console.error("Invalid token", error);
//         toast.error("Invalid token. Please log in again.");
//         navigate("/login");
//       }
//     } else {
//       toast.error("You need to log in to access this page.");
//       navigate("/login");
//     }
//   }, [navigate]);

//   const toggleSidebar = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const checkPermission = (allowedRoles, path) => {
//     if (!role || !allowedRoles.includes(role)) {
//       toast.error("You are not permitted");
//       return false;
//     }
//     return true;
//   };

//   const handleLogout = () => {
//     AuthService.logout();
//     setRole(null);
//     navigate("/login");
//   };

//   const routes = [
//     {
//       path: "/manage/account",
//       label: "Manage Accounts",
//       icon: <UserSearch size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/cosplayer",
//       label: "Manage Cosplayers",
//       icon: <Users size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/task-cosplayer",
//       label: "Manage Task Cosplayers",
//       icon: <ListTodo size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/assign-task",
//       label: "Manage Task Assignments",
//       icon: <ListChecks size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/character",
//       label: "Manage Characters",
//       icon: <PersonStanding size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/festival",
//       label: "Manage Festivals",
//       icon: <CalendarHeart size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     // {
//     //   path: "/manage/activity",
//     //   label: "Manage Activities",
//     //   icon: <Activity size={20} />,
//     //   allowedRoles: ["Manager"],
//     // },
//     // {
//     //   path: "/manage/ticket",
//     //   label: "Manage Festival Tickets",
//     //   icon: <Ticket size={20} />,
//     //   allowedRoles: ["Manager"],
//     // },
//     {
//       path: "/manage/ticket-check",
//       label: "Ticket Check",
//       icon: <CheckCircle size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/souvenir",
//       label: "Manage Souvenirs",
//       icon: <Shapes size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/order-product",
//       label: "Manage Orders",
//       icon: <ShoppingBag size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/contract",
//       label: "Manage Contracts",
//       icon: <ReceiptText size={20} />,
//       allowedRoles: ["Consultant"],
//     },
//     {
//       path: "/manage/feedback",
//       label: "Manage Feedbacks",
//       icon: <MessageCircleMore size={20} />,
//       allowedRoles: ["Manager"],
//     },
//     {
//       path: "/manage/request",
//       label: "Manage Requests",
//       icon: <GitPullRequest size={20} />,
//       allowedRoles: ["Manager", "Consultant"],
//     },
//     {
//       path: "/manage/request-customer-character",
//       label: "Manage CusChar Requests",
//       icon: <GitPullRequest size={20} />,
//       allowedRoles: ["Manager"],
//     },
//   ];

//   return (
//     <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
//       <div className="sidebar-header">
//         <h3 className="brand">{role || "Manage Page"}</h3>
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
//                 e.preventDefault();
//               }
//             }}
//           >
//             {route.icon}
//             <span>{route.label}</span>
//           </NavLink>
//         ))}
//         <NavLink
//           to="/login"
//           className="nav-link logout-link"
//           onClick={handleLogout}
//         >
//           <LogOut size={20} />
//           <span>Log Out</span>
//         </NavLink>
//       </nav>
//     </div>
//   );
// };

// export default SidebarManagement;

//----------------------------------------------------------------------------------------------------//

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
  LogOut,
  CheckCircle,
  ListTodo,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "../../styles/Manager/SidebarManagement.scss";
import AuthService from "../../services/AuthService";

// Component SidebarManagement
const SidebarManagement = () => {
  // State để quản lý trạng thái thu gọn/mở rộng sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State để lưu vai trò người dùng
  const [role, setRole] = useState(null);
  // State để theo dõi menu lớn nào đang mở
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra token và vai trò khi component mount
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

  // Hàm chuyển đổi trạng thái thu gọn/mở rộng sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Hàm kiểm tra quyền truy cập dựa trên vai trò
  const checkPermission = (allowedRoles, path) => {
    if (!role || !allowedRoles.includes(role)) {
      toast.error("You are not permitted");
      return false;
    }
    return true;
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    AuthService.logout();
    setRole(null);
    navigate("/login");
  };

  // Hàm xử lý mở/đóng menu lớn
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // Cấu trúc menu với các tab lớn và tab con
  const menus = [
    {
      label: "User Management",
      icon: <Users size={20} />,
      allowedRoles: ["Manager"],
      subMenus: [
        {
          path: "/manage/account",
          label: "Manage Accounts",
          icon: <UserSearch size={18} />,
          allowedRoles: ["Manager"],
        },
        {
          path: "/manage/cosplayer",
          label: "Manage Cosplayers",
          icon: <Users size={18} />,
          allowedRoles: ["Manager"],
        },
      ],
    },
    {
      label: "Task Management",
      icon: <ListTodo size={20} />,
      allowedRoles: ["Manager"],
      subMenus: [
        {
          path: "/manage/task-cosplayer",
          label: "Manage Task Cosplayers",
          icon: <ListTodo size={18} />,
          allowedRoles: ["Manager"],
        },
        {
          path: "/manage/assign-task",
          label: "Manage Task Assignments",
          icon: <ListChecks size={18} />,
          allowedRoles: ["Manager"],
        },
      ],
    },
    {
      label: "Character Management",
      icon: <PersonStanding size={20} />,
      allowedRoles: ["Manager"],
      subMenus: [
        {
          path: "/manage/character",
          label: "Manage Characters",
          icon: <PersonStanding size={18} />,
          allowedRoles: ["Manager"],
        },
        {
          path: "/manage/request-customer-character",
          label: "Manage Custom Character Requests",
          icon: <GitPullRequest size={18} />,
          allowedRoles: ["Manager"],
        },
      ],
    },
    {
      label: "Festival Management", // Đổi từ Event Management thành Festival Management
      icon: <CalendarHeart size={20} />,
      allowedRoles: ["Manager"],
      subMenus: [
        {
          path: "/manage/festival",
          label: "Manage Festivals",
          icon: <CalendarHeart size={18} />,
          allowedRoles: ["Manager"],
        },
        {
          path: "/manage/ticket-check",
          label: "Ticket Check",
          icon: <CheckCircle size={18} />,
          allowedRoles: ["Manager"],
        },
      ],
    },
    {
      label: "Product & Order Management",
      icon: <ShoppingBag size={20} />,
      allowedRoles: ["Manager"],
      subMenus: [
        {
          path: "/manage/souvenir",
          label: "Manage Souvenirs",
          icon: <Shapes size={18} />,
          allowedRoles: ["Manager"],
        },
        {
          path: "/manage/order-product",
          label: "Manage Orders",
          icon: <ShoppingBag size={18} />,
          allowedRoles: ["Manager"],
        },
      ],
    },
    {
      label: "Feedback & Requests",
      icon: <MessageCircleMore size={20} />,
      allowedRoles: ["Manager", "Consultant"],
      subMenus: [
        {
          path: "/manage/feedback",
          label: "Manage Feedbacks",
          icon: <MessageCircleMore size={18} />,
          allowedRoles: ["Manager"],
        },
        {
          path: "/manage/request",
          label: "Manage Requests",
          icon: <GitPullRequest size={18} />,
          allowedRoles: ["Manager", "Consultant"],
        },
      ],
    },
    {
      label: "Contract Management",
      icon: <ReceiptText size={20} />,
      allowedRoles: ["Consultant"],
      subMenus: [
        {
          path: "/manage/contract",
          label: "Contract Hire Cosplayer",
          icon: <ReceiptText size={18} />,
          allowedRoles: ["Consultant"],
        },
        {
          path: "/manage/contract-rental-costume",
          label: "Contract Rental Costume",
          icon: <ReceiptText size={18} />,
          allowedRoles: ["Consultant"],
        },
        {
          path: "/manage/contract-event-organize",
          label: "Contract  Event Organize",
          icon: <ReceiptText size={18} />,
          allowedRoles: ["Consultant"],
        },
        {
          path: "/manage/refund",
          label: "Manage Refunds",
          icon: <ReceiptText size={18} />,
          allowedRoles: ["Consultant"],
        },
      ],
    },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Phần tiêu đề sidebar */}
      <div className="sidebar-header">
        <h3 className="brand">{role || "Manage Page"}</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      {/* Phần điều hướng sidebar */}
      <nav className="sidebar-nav">
        {menus.map((menu, index) => (
          <div key={index} className="menu-item">
            {/* Menu lớn */}
            <div
              className={`nav-link menu-link ${
                openMenu === menu.label ? "active" : ""
              }`}
              onClick={() => toggleMenu(menu.label)}
            >
              {menu.icon}
              <span>{menu.label}</span>
              <ChevronDown
                size={16}
                className={`chevron ${openMenu === menu.label ? "rotate" : ""}`}
              />
            </div>
            {/* Menu con */}
            {openMenu === menu.label && (
              <div className="submenu">
                {menu.subMenus.map((subMenu) => (
                  <NavLink
                    key={subMenu.path}
                    to={subMenu.path}
                    className={({ isActive }) =>
                      isActive
                        ? "nav-link submenu-link active"
                        : "nav-link submenu-link"
                    }
                    onClick={(e) => {
                      if (
                        !checkPermission(subMenu.allowedRoles, subMenu.path)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {subMenu.icon}
                    <span>{subMenu.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
        {/* Nút đăng xuất */}
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
