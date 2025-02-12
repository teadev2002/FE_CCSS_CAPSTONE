import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/img/CCSSlogo.png"; // Adjust the number of "../" as needed
import "../../styles/Header.scss";

function Header() {
  return (
    <>
      <Navbar />
    </>
  );
}

export default Header;
