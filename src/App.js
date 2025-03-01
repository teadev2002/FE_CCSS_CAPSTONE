import "./styles/App.scss";
import "./components/Header/Header";
import Header from "./components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.js";
import AboutPage from "./pages/AboutPage/AboutUsPage.js";
import CharactersPage from "./pages/CharactersPage/CharactersPage.js";
import ServicesPage from "./pages/ServicesPage/ServicesPage.js";
import ContactPage from "./pages/ContactPage/ContactPage.js";
import EventPage from "./pages/EventPage/EventPage.js";
import CostumeRental from "./pages/CostumeRental/CostumeRental.js";
import SouvenirsPage from "./pages/SouvenirsPage/SouvenirsPage.js";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
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
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/event" element={<EventPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/costume-rental" element={<CostumeRental />} />
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
