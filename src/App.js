import "./styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.js";
import AboutPage from "./pages/AboutPage/AboutUsPage.js";
import CostumesPage from "./pages/CostumesPage/CostumesPage.js";
import ServicesPage from "./pages/ServicesPage/ServicesPage.js";
import ContactPage from "./pages/ContactPage/ContactPage.js";
import FestivalPage from "./pages/FestivalsPage/FestivalsPage.js";
import SouvenirsPage from "./pages/SouvenirsPage/SouvenirsPage.js";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import CosplayerPage from "./pages/CosplayersPage/CosplayersPage.js";
import EventOrganizePage from "./pages/EventOrganizationPage/EventOrganizationPage.js";
import DetailEventOrganizePage from "./pages/EventOrganizationPage/DetailEventOrganizationPage.js";
import ProfilePage from "./pages/ProfilePage/ProfilePage.js";
import DashboardPage from "./pages/AdminPage/DashboardPage/DashboardPage.js";
import UserPerformancePage from "./pages/AdminPage/UserPerformancePage/UserPerformancePage.js";
import OrderRevenuePerformancePage from "./pages/AdminPage/OrderRevenuePerformancePage/OrderRevenuePerformancePage.js";
import UserStatisticsPage from "./pages/AdminPage/UserStatisticsPage/UserStatisticsPage.js";
import SystemManagementPage from "./pages/AdminPage/SystemManagementPage/SystemManagementPage.js";
import Sidebar from "./components/AdminSidebar/Sidebar";
import SidebarManagement from "./components/ManagerSidebar/SidebarManagement.js";
import NotFound from "./pages/404ErrorPage/NotFound";
import ManageFestival from "./pages/ManagerPage/ManageFestivalPage/ManageFestival.js";
import { Navbar } from "./components/Nav/navbar";
import { Footer } from "./components/Footer/Footer";

// Create a wrapper component to handle conditional rendering of Navbar, Footer, and Sidebars
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isManagePage = location.pathname.startsWith("/manage");
  const isNotFoundPage = location.pathname === "/404"; // Match the route path

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show Navbar only if it's not an admin page, not a manage page, and not the notfound page */}
      {!isAdminPage && !isManagePage && !isNotFoundPage && <Navbar />}
      <div className="flex">
        {/* Show Sidebar for admin pages */}
        {isAdminPage && !isNotFoundPage && <Sidebar />}
        {/* Show SidebarManagement for manage pages */}
        {isManagePage && !isNotFoundPage && <SidebarManagement />}
        <main className="flex-grow">{children}</main>
      </div>
      {/* Show Footer only if it's not an admin page, not a manage page, and not the notfound page */}
      {!isAdminPage && !isManagePage && !isNotFoundPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/costumes" element={<CostumesPage />} />
          <Route path="/costumes/:category" element={<CostumesPage />} />
          <Route path="/festivals" element={<FestivalPage />} />
          <Route path="/festivals/:category" element={<FestivalPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/cosplayers" element={<CosplayerPage />} />
          <Route path="/event" element={<DetailEventOrganizePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/souvenirs-shop" element={<SouvenirsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/user-profile/:id" element={<ProfilePage />} />
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route
            path="/admin/user-performance"
            element={<UserPerformancePage />}
          />
          <Route
            path="/admin/order-revenue-performance"
            element={<OrderRevenuePerformancePage />}
          />
          <Route
            path="/admin/user-statistics"
            element={<UserStatisticsPage />}
          />
          <Route
            path="/admin/system-management"
            element={<SystemManagementPage />}
          />
          <Route path="/manage/ticket" element={<ManageFestival />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
