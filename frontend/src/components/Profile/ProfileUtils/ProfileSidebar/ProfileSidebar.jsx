import { Link } from "react-router-dom";

const ProfileSidebar = ({ user, isMainProfile }) => (
  <div className={`profile-sidebar ${isMainProfile ? "animate-sidebar" : ""}`}>
    <div className="profile-name">
      <h1>{user?.username || "Artist Name"}</h1>
    </div>
    <nav className="profile-nav">
      <Link to={`/profile/${user?.username}/news`}>NEWS</Link>
      <Link to={`/profile/${user?.username}`}>ABOUT</Link>
      <Link to={`/profile/${user?.username}/contact`}>CONTACT</Link>
      <Link to={`/profile/${user?.username}/shop`}>SHOP</Link>
      <Link to="https://www.instagram.com/the.manlyman_/">INSTAGRAM</Link>
    </nav>
    <div className="profile-social" />
  </div>
);

export default ProfileSidebar;
