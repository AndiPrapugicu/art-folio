import "./Footer.css";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-info">
          <h2>ArtFolio</h2>
          <p>
            Discover stunning digital art created by talented artists. Join us
            on our journey!
          </p>
        </div>

        <div className="footer-nav">
          <h3>Useful Links</h3>
          <ul>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/portfolio">Portfolio</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <h3>Stay Connected</h3>
          <div className="social-icons">
            <a
              href="https://instagram.com/the.manlyman_"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.linkedin.com/in/andi-prapugicu-a136b2275/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://github.com/AndiPrapugicu"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ArtFolio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
