// import { useEffect } from "react";
// import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
// import "./styles/App.scss";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "react-toastify/dist/ReactToastify.css";
// import "antd/dist/reset.css";
// import { ToastContainer } from "react-toastify";
// import { Navbar } from "./components/Nav/navbar";
// import { Footer } from "./components/Footer/Footer";
// import HomePage from "./pages/HomePage/HomePage.js";
// import AboutPage from "./pages/AboutPage/AboutUsPage.js";
// import CostumesPage from "./pages/CostumesPage/CostumesPage.js";
// import ServicesPage from "./pages/ServicesPage/ServicesPage.js";
// import ContactPage from "./pages/ContactPage/ContactPage.js";
// import FestivalPage from "./pages/FestivalsPage/FestivalsPage.js";
// import SouvenirsPage from "./pages/SouvenirsPage/SouvenirsPage.js";
// import LoginPage from "./pages/Auth/LoginPage";
// import SignupPage from "./pages/Auth/SignupPage";
// import CosplayerPage from "./pages/CosplayersPage/CosplayersPage.js";
// import EventOrganizePage from "./pages/EventOrganizationPage/EventOrganizationPage.js";
// import DetailEventOrganizePage from "./pages/EventOrganizationPage/DetailEventOrganizationPage.js";
// import ProfilePage from "./pages/ProfilePage/ProfilePage.js";
// import DashboardPage from "./pages/AdminPage/DashboardPage/DashboardPage.js";
// import UserPerformancePage from "./pages/AdminPage/UserPerformancePage/UserPerformancePage.js";
// import OrderRevenuePerformancePage from "./pages/AdminPage/OrderRevenuePerformancePage/OrderRevenuePerformancePage.js";
// import UserStatisticsPage from "./pages/AdminPage/UserStatisticsPage/UserStatisticsPage.js";
// import SystemManagementPage from "./pages/AdminPage/SystemManagementPage/SystemManagementPage.js";
// import Sidebar from "./components/AdminSidebar/Sidebar";
// import SidebarManagement from "./components/ManagerSidebar/SidebarManagement.js";
// import NotFound from "./pages/404ErrorPage/NotFound";
// import ManageFestival from "./pages/ManagerPage/ManageFestivalPage/ManageFestival.js";
// import ManageRequest from "./pages/ManagerPage/ManageRequestPage/ManageRequest.js";
// import ManageSouvenir from "./pages/ManagerPage/ManageSouvenirsPage/ManageSouvenir.js";
// import ManageCosplayer from "./pages/ManagerPage/ManageCosplayerPage/ManageCosplayer.js";
// import ManageCharacter from "./pages/ManagerPage/ManageCharaterPage/ManageCharacter.js";
// import CartPage from "./pages/CartPage/CartPage.js";
// import ManageContract from "./pages/ManagerPage/ManageContractPage/ManageContract.js";
// import ManageAccount from "./pages/ManagerPage/ManageAccountPage/ManageAccount.js";
// import MyHistory from "./pages/MyHistoryPage/MyHistory.js";
// import MyTask from "./pages/TaskPage/MyTask.js";
// import SuccessPayment from "./pages/SuccessPaymentPage/SuccessPayment.js";
// import MyRentalCostume from "./pages/MyRentalCostumePage/MyRentalCostume.js";
// import ManageRequestCustomerCharacter from "./pages/ManagerPage/ManageRequestCustomerCharacterPage/ManageRequestCustomerCharacter.js";
// import MyEventOrganize from "./pages/MyEventOrganizePage/MyEventOrganize.js";
// import PurchaseHistory from "./pages/PurchaseHistoryPage/PurchaseHistory.js"; // Thêm import PurchaseHistory
// import ManageAssignTask from "./pages/ManagerPage/ManageAssignTaskPage/ManageAssignTask.js";
// const AppLayout = ({ children }) => {
//   const location = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [location.pathname]);

//   const isAdminPage = location.pathname.startsWith("/admin");
//   const isManagePage = location.pathname.startsWith("/manage");
//   const isNotFoundPage =
//     location.pathname === "/*" ||
//     location.pathname === "/login" ||
//     location.pathname === "/sign-up";

//   return (
//     <div className="flex flex-col min-h-screen">
//       {!isAdminPage && !isManagePage && !isNotFoundPage && <Navbar />}
//       <div className="flex">
//         {isAdminPage && !isNotFoundPage && <Sidebar />}
//         {isManagePage && !isNotFoundPage && <SidebarManagement />}
//         <main className="flex-grow">{children}</main>
//       </div>
//       {!isAdminPage && !isManagePage && !isNotFoundPage && <Footer />}
//     </div>
//   );
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <AppLayout>
//         <Routes>
//           <Route path="*" element={<NotFound />} />
//           <Route path="/" element={<HomePage />} />
//           <Route path="/costumes" element={<CostumesPage />} />
//           <Route path="/costumes/:category" element={<CostumesPage />} />
//           <Route path="/festivals" element={<FestivalPage />} />
//           <Route path="/festivals/:category" element={<FestivalPage />} />
//           <Route path="/services" element={<ServicesPage />} />
//           <Route path="/cosplayers" element={<CosplayerPage />} />
//           <Route path="/event" element={<DetailEventOrganizePage />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/contact" element={<ContactPage />} />
//           <Route path="/souvenirs-shop" element={<SouvenirsPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/sign-up" element={<SignupPage />} />
//           <Route path="/user-profile/:id" element={<ProfilePage />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/my-history/:id" element={<MyHistory />} />
//           <Route path="/my-task/:id" element={<MyTask />} />
//           <Route path="/my-rental-costume/:id" element={<MyRentalCostume />} />
//           <Route path="/my-event-organize/:id" element={<MyEventOrganize />} />
//           <Route
//             path="/my-purchase-history/:id"
//             element={<PurchaseHistory />}
//           />{" "}
//           {/* Thêm route PurchaseHistory */}
//           <Route path="/success-payment" element={<SuccessPayment />} />
//           <Route path="/admin/dashboard" element={<DashboardPage />} />
//           <Route
//             path="/admin/user-performance"
//             element={<UserPerformancePage />}
//           />
//           <Route
//             path="/admin/order-revenue-performance"
//             element={<OrderRevenuePerformancePage />}
//           />
//           <Route
//             path="/admin/user-statistics"
//             element={<UserStatisticsPage />}
//           />
//           <Route
//             path="/admin/system-management"
//             element={<SystemManagementPage />}
//           />
//           <Route path="/manage/ticket" element={<ManageFestival />} />
//           <Route path="/manage/request" element={<ManageRequest />} />
//           <Route path="/manage/souvenir" element={<ManageSouvenir />} />
//           <Route path="/manage/cosplayer" element={<ManageCosplayer />} />
//           <Route path="/manage/character" element={<ManageCharacter />} />
//           <Route path="/manage/contract" element={<ManageContract />} />
//           <Route path="/manage/account" element={<ManageAccount />} />
//           <Route
//             path="/manage/request-customer-character"
//             element={<ManageRequestCustomerCharacter />}
//           />
//           <Route path="/manage/assign-task" element={<ManageAssignTask />} />
//         </Routes>
//         <ToastContainer
//           position="top-right"
//           autoClose={2000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//         />
//       </AppLayout>
//     </BrowserRouter>
//   );
// }

// export default App;

import { useEffect } from "react";
import { Route, Routes, BrowserRouter, useLocation } from "react-router-dom";
import "./styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import { ToastContainer } from "react-toastify";
import { Navbar } from "./components/Nav/navbar";
import { Footer } from "./components/Footer/Footer";
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
import AdminOverviewPage from "./pages/AdminPage/AdminOverviewPage/AdminOverviewPage.js";
import UserAnalyticsPage from "./pages/AdminPage/UserAnalyticsPage/UserAnalyticsPage.js";
import OrderRevenuePerformancePage from "./pages/AdminPage/OrderRevenuePerformancePage/OrderRevenuePerformancePage.js";
import UserStatisticsPage from "./pages/AdminPage/UserStatisticsPage/UserStatisticsPage.js";
import SystemManagementPage from "./pages/AdminPage/SystemManagementPage/SystemManagementPage.js";
import Sidebar from "./components/AdminSidebar/Sidebar";
import SidebarManagement from "./components/ManagerSidebar/SidebarManagement.js";
import NotFound from "./pages/404ErrorPage/NotFound";
import ManageTicket from "./pages/ManagerPage/ManageTicketPage/ManageTicket.js";
import ManageRequest from "./pages/ManagerPage/ManageRequestPage/ManageRequest.js";
import ManageSouvenir from "./pages/ManagerPage/ManageSouvenirsPage/ManageSouvenir.js";
import ManageCosplayer from "./pages/ManagerPage/ManageCosplayerPage/ManageCosplayer.js";
import ManageCharacter from "./pages/ManagerPage/ManageCharaterPage/ManageCharacter.js";
import CartPage from "./pages/CartPage/CartPage.js";
import ManageContract from "./pages/ManagerPage/ManageContractPage/ManageContract.js";
import ManageAccount from "./pages/ManagerPage/ManageAccountPage/ManageAccount.js";
import MyHistory from "./pages/MyHistoryPage/MyHistory.js";
import MyTask from "./pages/TaskPage/MyTask.js";
import SuccessPayment from "./pages/SuccessPaymentPage/SuccessPayment.js";
import FailPayment from "./pages/FailPaymentPage/FailPayment.js";
import MyRentalCostume from "./pages/MyRentalCostumePage/MyRentalCostume.js";
import ManageRequestCustomerCharacter from "./pages/ManagerPage/ManageRequestCustomerCharacterPage/ManageRequestCustomerCharacter.js";
import MyEventOrganize from "./pages/MyEventOrganizePage/MyEventOrganize.js";
import PurchaseHistory from "./pages/PurchaseHistoryPage/PurchaseHistory.js";
import ManageAssignTask from "./pages/ManagerPage/ManageAssignTaskPage/ManageAssignTask.js";
import TicketCheck from "./pages/ManagerPage/TicketCheckPage/TicketCheck.js";
import ManageFeedback from "./pages/ManagerPage/ManageFeedbackPage/ManageFeedback.js";
import ManageAllFestivals from "./pages/ManagerPage/ManageAllFestivalsPage/ManageAllFestivals.js"; // Thêm import
import ManageTasKCosplayer from "./pages/ManagerPage/ManageTasKCosplayer/ManageTasKCosplayer.js"; // Thêm import
import ManageActivities from "./pages/ManagerPage/ManageActivitiesPage/ManageActivities.js"; // Thêm import
import ManageOrderProduct from "./pages/ManagerPage/ManageOrderProductPage/ManageOrderProduct.js";

const AppLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminPage = location.pathname.startsWith("/admin");
  const isManagePage = location.pathname.startsWith("/manage");
  const isNotFoundPage =
    location.pathname === "/*" ||
    location.pathname === "/login" ||
    location.pathname === "/sign-up";

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && !isManagePage && !isNotFoundPage && <Navbar />}
      <div className="flex">
        {isAdminPage && !isNotFoundPage && <Sidebar />}
        {isManagePage && !isNotFoundPage && <SidebarManagement />}
        <main className="flex-grow">{children}</main>
      </div>
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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/my-history/:id" element={<MyHistory />} />
          <Route path="/my-task/:id" element={<MyTask />} />
          <Route path="/my-rental-costume/:id" element={<MyRentalCostume />} />
          <Route path="/my-event-organize/:id" element={<MyEventOrganize />} />
          <Route
            path="/my-purchase-history/:id"
            element={<PurchaseHistory />}
          />
          <Route path="/success-payment" element={<SuccessPayment />} />
          <Route path="/fail-payment" element={<FailPayment />} />
          <Route path="/admin/admin-overview" element={<AdminOverviewPage />} />
          <Route
            path="/admin/user-analytics"
            element={<UserAnalyticsPage />}
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
          <Route path="/manage/festival" element={<ManageAllFestivals />} />{" "}
          {/* Thêm route mới */}
          <Route path="/manage/activity" element={<ManageActivities />} />
          <Route path="/manage/order-product" element={<ManageOrderProduct />} />
          <Route path="/manage/ticket" element={<ManageTicket />} />
          <Route path="/manage/ticket-check" element={<TicketCheck />} />
          <Route path="/manage/feedback" element={<ManageFeedback />} />
          <Route path="/manage/request" element={<ManageRequest />} />
          <Route path="/manage/souvenir" element={<ManageSouvenir />} />
          <Route path="/manage/cosplayer" element={<ManageCosplayer />} />
          <Route path="/manage/character" element={<ManageCharacter />} />
          <Route path="/manage/contract" element={<ManageContract />} />
          <Route path="/manage/account" element={<ManageAccount />} />
          <Route
            path="/manage/task-cosplayer"
            element={<ManageTasKCosplayer />}
          />
          <Route
            path="/manage/request-customer-character"
            element={<ManageRequestCustomerCharacter />}
          />
          <Route path="/manage/assign-task" element={<ManageAssignTask />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
