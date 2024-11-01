import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import { BsPersonCircle } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  return (
    <div className="header-wrapper">
      <header className="header">
        <div className="logo">
          <Link to="/">ArtFolio</Link>
        </div>
        <nav className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link
            to="/portfolio"
            className={location.pathname === "/portfolio" ? "active" : ""}
          >
            Portfolio
          </Link>
          <Link
            to="/about"
            className={location.pathname === "/about" ? "active" : ""}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "active" : ""}
          >
            Contact
          </Link>
        </nav>
        <div className="social-icons">
          <div className="login-icon" ref={dropdownRef}>
            <div className="user-info">
              {isLoggedIn && user && (
                <span className="username">{user.username}</span>
              )}
              <BsPersonCircle onClick={toggleDropdown} />
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {isLoggedIn ? (
                  <>
                    <div className="dropdown-item welcome">
                      Welcome, {user.username}!
                    </div>
                    <div className="dropdown-item">
                      <Link
                        to={`/profile/${user.username}`}
                        className="dropdown-link"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                    </div>
                    <div className="dropdown-item">
                      <button onClick={handleLogout} className="dropdown-link">
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

Header.propTypes = {};

export default Header;
