import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import axiosInstance from "../utils/axiosConfig.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
          const response = await axiosInstance.get("/auth/current");
          if (response.data) {
            console.log("Date utilizator primite de la server:", response.data);
            setUser(response.data);
            setIsLoggedIn(true);
            localStorage.setItem("user", JSON.stringify(response.data));
          }
        } catch (error) {
          console.error("Eroare la verificarea autentificării:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          delete axiosInstance.defaults.headers.common["Authorization"];
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const updateUser = useCallback((userData) => {
    console.log("Actualizare date utilizator:", userData);
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData));

    const savedUser = localStorage.getItem("user");
    console.log("Date salvate în localStorage:", JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials) => {
    console.log("🚀 [AuthContext] Starting login process", {
      email: credentials.email,
      hasPassword: !!credentials.password,
    });

    try {
      if (!credentials.email || !credentials.password) {
        throw new Error("Email și parola sunt obligatorii");
      }

      const response = await axiosInstance.post("/auth/login", credentials);

      console.log("✅ [AuthContext] Răspuns server:", {
        status: response.status,
        hasData: !!response.data,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user,
      });

      if (!response.data?.token || !response.data?.user) {
        console.error(
          "❌ [AuthContext] Răspuns invalid de la server:",
          response.data
        );
        throw new Error("Răspuns invalid de la server");
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setIsLoggedIn(true);
      setUser(response.data.user);

      console.log(
        "✅ [AuthContext] Autentificare reușită pentru:",
        credentials.email
      );
      return response.data;
    } catch (error) {
      console.error("❌ [AuthContext] Eroare la autentificare:", {
        message: error.message,
        status: error.response?.status,
        serverMessage: error.response?.data?.message,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Eroare la autentificare"
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth trebuie utilizat în interiorul unui AuthProvider");
  }
  return context;
};
