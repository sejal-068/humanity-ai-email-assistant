// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from token on app start (without logging noisy 401s if token expired)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name || 'User'}!`);
    navigate(data.user.role === "assistant" ? "/assistant/inbox" : "/client/attention");
  };

  const signup = async (name, email, password, role, linkedEmail) => {
    const payload = { name, email, password, role };
    if (linkedEmail) payload.linkedEmail = linkedEmail;
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    toast.success("Account created successfully!");
    navigate(data.user.role === "assistant" ? "/assistant/inbox" : "/client/attention");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
