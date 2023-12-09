import { Link, useLocation } from "react-router-dom";
import myLogo from "../assets/logo.svg";
import "./Navbar.css";
import { UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const currentLocation = useLocation();
  const currentPath = currentLocation.pathname;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={myLogo} className="logo" alt="My logo" />
        </Link>
      </div>
      <Link
        to="/dashboard"
        style={
          currentPath === "/dashboard" ? { textDecoration: "underline" } : {}
        }
      >
        Dashboard
      </Link>
      <Link
        to="/my_tickets"
        style={
          currentPath === "/my_tickets" ? { textDecoration: "underline" } : {}
        }
      >
        My Tickets
      </Link>
      <div className="user-img">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: "3rem",
                height: "3rem",
              },
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
