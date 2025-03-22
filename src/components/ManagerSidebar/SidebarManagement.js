import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
          to="/manage/general"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Settings2 size={20} />
          <span>General</span>
        </NavLink>
        <NavLink
          to="/manage/ticket"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Ticket size={20} />
          <span> Manage Event Ticket</span>
        </NavLink>

        <NavLink
          to="/manage/souvenir"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Shapes size={20} />
          <span>Manage Souvenirs</span>
        </NavLink>
        <NavLink
          to="*"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <Users size={20} />
          <span>Manage Cosplayer</span>
        </NavLink>
        <NavLink
          to="*"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <CalendarHeart size={20} />
          <span>Manage Event</span>
        </NavLink>

        <NavLink
          to="*"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <UserSearch size={20} />
          <span>Manage Account</span>
        </NavLink>

        <NavLink
          to="*"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <PersonStanding size={20} />
          <span>Manage Character</span>
        </NavLink>

        <NavLink
          to="*"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          <MessageCircleMore size={20} />
          <span>Manage Feedback</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default SidebarManagement;
