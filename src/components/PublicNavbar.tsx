import { Link } from "react-router-dom";
import myLogo from "../assets/logo.svg";
import "./PublicNavbar.css";

const PublicNavbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={myLogo} className="logo" alt="My logo" />
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Welcome</Link>
      </div>
    </nav>
  );
};

export default PublicNavbar;
