import "./styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.js";
import AboutPage from "./pages/AboutPage/AboutUsPage.js";
import CostumesPage from "./pages/CostumesPage/CostumesPage.js";
import ServicesPage from "./pages/ServicesPage/ServicesPage.js";
import ContactPage from "./pages/ContactPage/ContactPage.js";
import FestivalPage from "./pages/FestivalPage/FestivalPage.js";
import SouvenirsPage from "./pages/SouvenirsPage/SouvenirsPage.js";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import CosplayerPage from "./pages/CosplayerPage/CosplayerPage.js";
import EventOrganizePage from "./pages/EventOrganizePage/EventOrganizePage.js";
import DetailEventOrganizePage from "./pages/EventOrganizePage/DetailEventOrganizePage.js";
import ProfilePage from "./pages/ProfilePage/ProfilePage.js";
import DashboardPage from "./pages/AdminPage/DashboardPage/DashboardPage.js";
import UserPerformancePage from "./pages/AdminPage/UserPerformancePage/UserPerformancePage.js";
import OrderRevenuePerformancePage from "./pages/AdminPage/OrderRevenuePerformancePage/OrderRevenuePerformancePage.js";
import UserStatisticsPage from "./pages/AdminPage/UserStatisticsPage/UserStatisticsPage.js";
import SystemManagementPage from "./pages/AdminPage/SystemManagementPage/SystemManagementPage.js";
import Sidebar from "./components/AdminSidebar/Sidebar";
import { Navbar } from "./components/Nav/navbar";
import { Footer } from "./components/Footer/Footer";

// Create a wrapper component to handle conditional rendering of Navbar and Footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <Navbar />}
      <div className="flex">
        {isAdminPage && <Sidebar />}
        <main className="flex-grow">{children}</main>
      </div>
      {!isAdminPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/costumes" element={<CostumesPage />} />
          <Route path="/costumes/:category" element={<CostumesPage />} />
          <Route path="/festivals" element={<FestivalPage />} />
          <Route path="/festivals/:category" element={<FestivalPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/cosplayers" element={<CosplayerPage />} />
          <Route path="/event-organize" element={<EventOrganizePage />} />
          <Route
            path="/event-organize/detail-event"
            element={<DetailEventOrganizePage />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/souvenirs-shop" element={<SouvenirsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/user-profile" element={<ProfilePage />} />
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
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
