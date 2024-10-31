import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(storedUser);
    }
  }, []);

  const login = (userData, token) => {
    console.log("Încercare de autentificare cu:", { userData, token });

    // Verificăm dacă token-ul conține datele utilizatorului
    const userInfo = token && typeof token === "object" ? token : userData;

    if (userInfo && typeof userInfo === "object" && "id" in userInfo) {
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(userInfo));
      setIsLoggedIn(true);
      setUser(userInfo);
      console.log("Autentificare reușită:", userInfo);
    } else {
      console.error("Date de utilizator invalide la autentificare", {
        userData,
        token,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
