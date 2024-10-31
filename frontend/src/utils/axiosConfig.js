import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Interceptor pentru request
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("🔄 [Axios] Request config înainte de modificare:", {
      url: config.url,
      method: config.method,
      fullUrl: `${config.baseURL}${config.url}`,
      hasContentType: !!config.headers["Content-Type"],
    });

    // Verificăm dacă URL-ul are deja /api
    if (!config.url.startsWith("/api")) {
      config.url = `/api${config.url.startsWith("/") ? "" : "/"}${config.url}`;
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Nu modificăm Content-Type dacă este deja setat (pentru upload-uri)
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    console.log("🔄 [Axios] Request config după modificare:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      fullUrl: `${config.baseURL}${config.url}`,
    });

    return config;
  },
  (error) => {
    console.error("❌ [Axios] Request error:", error);
    return Promise.reject(error);
  }
);

// Adăugăm interceptor pentru răspuns pentru a vedea mai clar erorile
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ [Axios] Response success:", {
      status: response.status,
      hasData: !!response.data,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ [Axios] Response error:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.response?.data?.message,
      error: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;
