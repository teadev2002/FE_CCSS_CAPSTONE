// import React from "react";
// import { NavLink } from "react-router-dom";
// import { Home, Users, Phone, Info, ShoppingBag } from "lucide-react";
// import Logo from "../../assets/img/CCSSlogo.png";
// import "../../styles/nav.scss";
// export function Navbar() {
//   return (
//     <nav className="bg-gradient-to-r from-purple-800 to-indigo-900 shadow-lg ">
//       <div className="max-w-7xl mx-auto" style={{ background: "#FFB6C1" }}>
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center space-x-8">
//             <NavLink to="/" className="text-2xl font-bold text-white">
//               {/* <img src={Logo} /> */}
//             </NavLink>
//             <div className="hidden md:flex space-x-6" style={{ padding: 30 }}>
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                     isActive
//                       ? "bg-white/20 text-white"
//                       : "text-gray-300 hover:bg-white/10 hover:text-white"
//                   }`
//                 }
//               >
//                 <Home size={18} />
//                 <span>Home</span>
//               </NavLink>
//               <NavLink
//                 to="/characters"
//                 className={({ isActive }) =>
//                   `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                     isActive
//                       ? "bg-white/20 text-white"
//                       : "text-gray-300 hover:bg-white/10 hover:text-white"
//                   }`
//                 }
//               >
//                 <Users size={18} />
//                 <span>Characters</span>
//               </NavLink>
//               <NavLink
//                 to="/services"
//                 className={({ isActive }) =>
//                   `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                     isActive
//                       ? "bg-white/20 text-white"
//                       : "text-gray-300 hover:bg-white/10 hover:text-white"
//                   }`
//                 }
//               >
//                 <ShoppingBag size={18} />
//                 <span>Services</span>
//               </NavLink>
//               <NavLink
//                 to="/about"
//                 className={({ isActive }) =>
//                   `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                     isActive
//                       ? "bg-white/20 text-white"
//                       : "text-gray-300 hover:bg-white/10 hover:text-white"
//                   }`
//                 }
//               >
//                 <Info size={18} />
//                 <span>About Us</span>
//               </NavLink>
//               <NavLink
//                 to="/contact"
//                 className={({ isActive }) =>
//                   `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                     isActive
//                       ? "bg-white/20 text-white"
//                       : "text-gray-300 hover:bg-white/10 hover:text-white"
//                   }`
//                 }
//               >
//                 <Phone size={18} />
//                 <span>Contact</span>
//               </NavLink>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4"></div>
//         </div>
//       </div>
//     </nav>
//   );
// }
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Phone, Info, ShoppingBag } from "lucide-react";
import Logo from "../../assets/img/CCSSlogo.png";
import "../../styles/nav.scss";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="container mx-auto flex items-center justify-between h-24 px-6">
        {/* Logo và Tên Thương Hiệu */}
        <div className="brand-container">
          <img src={Logo} alt="CCSS Logo" className="brand-logo" />
          <span className="brand-name">
            CCSS
          </span>
        </div>

        {/* Menu */}
        <div className="nav-menu">
          {[
            { to: "/", label: "Home", Icon: Home },
            { to: "/characters", label: "Characters", Icon: Users },
            { to: "/services", label: "Services", Icon: ShoppingBag },
            { to: "/about", label: "About Us", Icon: Info },
            { to: "/contact", label: "Contact", Icon: Phone },
          ].map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              <Icon size={24} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

