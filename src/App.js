import "./styles/App.scss";
import "./components/Header/Header";
import Header from "./components/Header/Header";

import { Route, Routes, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutUsPage";
import CharactersPage from "./pages/CharactersPage";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import EventPage from "./pages/EventPage";
import CostumeRental from "./pages/CostumeRental";
import SouvenirsPage from "./pages/SouvenirsPage";
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
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
