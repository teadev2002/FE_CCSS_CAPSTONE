import React from "react";
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
} from "lucide-react";
import Logo from "../../assets/img/CCSSlogo.png";
import "../../styles/nav.scss";
import AuthService from "../../services/AuthService.js";

export function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const cosplayThemes = [
    { name: "All", path: "/characters" },
    { name: "Anime", path: "/characters/anime" },
    { name: "Game", path: "/characters/game" },
    { name: "Superhero", path: "/characters/superhero" },
    { name: "Fantasy", path: "/characters/fantasy" },
    { name: "Sci-Fi", path: "/characters/sci-fi" },
    { name: "Horror", path: "/characters/horror" },
    { name: "Historical", path: "/characters/historical" },
    { name: "Mythology", path: "/characters/mythology" },
    { name: "Steampunk", path: "/characters/steampunk" },
    { name: "Cyberpunk", path: "/characters/cyberpunk" },
    { name: "Cartoon", path: "/characters/cartoon" },
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
              Icon: Users,
              hasDropdown: true,
            },
            { to: "/event", label: "Events", Icon: Calendar },
            { to: "/souvenirs-shop", label: "Souvenirs", Icon: Store },
            { to: "/about", label: "About Us", Icon: Info },
            { to: "/contact", label: "Contact", Icon: Phone },
          ].map(({ to, label, Icon, hasDropdown }) => (
            <div key={to} className="dropdown-container">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link-active" : ""}`
                }
              >
                <Icon size={24} />
                <span>{label}</span>
              </NavLink>
              {hasDropdown && (
                <div className="dropdown-menu dropdown-menu-categories">
                  {cosplayThemes.map((theme) => (
                    <Link
                      key={theme.name}
                      to={theme.path}
                      className="dropdown-item"
                    >
                      {theme.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="dropdown-container">
            <div className="dropdown-toggle">
              <CircleUser size={24} />
            </div>
            <div className="dropdown-menu dropdown-menu-user">
              <Link to="#" className="dropdown-item">
                Profile
              </Link>
              <Link to="#" className="dropdown-item">
                Cart
              </Link>
              <Link
                to="/login"
                className="dropdown-item"
                onClick={() => handleLogout()}
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
