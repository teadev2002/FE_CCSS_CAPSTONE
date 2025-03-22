import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  BarChart2,
  Settings,
  Menu,
  Ticket,
} from "lucide-react";
import "../../styles/Manager/SidebarManagement.scss";

const SidebarManagement = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h3 className="brand">Manager</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/manage/ticket"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Ticket size={20} />
          <span>Ticket Festival</span>
        </NavLink>

        <NavLink
          to="/admin/user-performance"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Users size={20} />
          <span>User Performance</span>
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

        <NavLink
          to="/admin/user-statistics"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <BarChart2 size={20} />
          <span>User Statistics</span>
        </NavLink>

        <NavLink
          to="/admin/system-management"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Settings size={20} />
          <span>System & Management</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default SidebarManagement;
