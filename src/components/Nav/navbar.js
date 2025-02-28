// import React from "react";
// import { Link, NavLink } from "react-router-dom";
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
// } from "lucide-react";
// import Logo from "../../assets/img/CCSSlogo.png";
// import "../../styles/nav.scss";
// import NavDropdown from "react-bootstrap/NavDropdown";

// export function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="container mx-auto flex items-center justify-between h-24 px-4">
//         <div className="brand-container flex items-center">
//           <Link to="/" className="flex items-center">
//             <img src={Logo} alt="CCSS Logo" className="brand-logo h-12" />
//           </Link>
//         </div>

//         {/* Menu */}
//         <div className="nav-menu">
//           {[
//             // { to: "/", label: "Home", Icon: Home },
//             { to: "/characters", label: "Characters", Icon: Users },
//             { to: "/event", label: "Events", Icon: Calendar },
//             { to: "/services", label: "Services", Icon: ShoppingBag },
//             { to: "/costume-rental", label: "Costume Rental", Icon: Shirt },
//             { to: "/souvenirs-shop", label: "souvenirs", Icon: Store },
//             { to: "/about", label: "About Us", Icon: Info },
//             { to: "/contact", label: "Contact", Icon: Phone },
//             { to: "/", label: "", Icon: CircleUser },
//           ].map(({ to, label, Icon }) => (
//             <NavLink
//               key={to}
//               to={to}
//               className={({ isActive }) =>
//                 `nav-link ${isActive ? "nav-link-active" : ""}`
//               }
//             >
//               <Icon size={24} />
//               <span>{label}</span>
//             </NavLink>
//           ))}
//         </div>
//       </div>
//     </nav>
//   );
// }
import React from "react";
import { Link, NavLink } from "react-router-dom";
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

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="container mx-auto flex items-center justify-between h-24 px-4">
        <div className="brand-container flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="CCSS Logo" className="brand-logo h-12" />
          </Link>
        </div>

        {/* Menu */}
        <div className="nav-menu">
          {[
            { to: "/services", label: "Services", Icon: ShoppingBag },
            { to: "/characters", label: "Characters", Icon: Users },
            { to: "/event", label: "Events", Icon: Calendar },
            { to: "/costume-rental", label: "Costume Rental", Icon: Shirt },
            { to: "/souvenirs-shop", label: "Souvenirs", Icon: Store },
            { to: "/about", label: "About Us", Icon: Info },
            { to: "/contact", label: "Contact", Icon: Phone },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              <Icon size={24} />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Dropdown Menu */}
          <div className="dropdown-container">
            <div className="dropdown-toggle">
              <CircleUser size={24} />
            </div>
            <div className="dropdown-menu">
              <Link to="#" className="dropdown-item">
                Profile
              </Link>
              <Link to="#" className="dropdown-item">
                Cart
              </Link>
              <Link to="/login" className="dropdown-item">
                Log Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
