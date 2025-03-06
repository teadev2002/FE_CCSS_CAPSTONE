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
            {
              to: "/cosplayers",
              label: "Cosplayers",
              Icon: Users,
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
            { to: "/contact", label: "Contact", Icon: Phone },
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
                  <Icon size={24} />
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
