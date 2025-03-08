import "./styles/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
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
import { Navbar } from "./components/Nav/navbar";
import { Footer } from "./components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
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
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
