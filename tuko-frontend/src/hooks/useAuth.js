import { useState, useEffect, createContext, useContext } from "react";
import api, { setAuthToken } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      api.get("/auth/me").then(res => setUser(res.data)).catch(() => {
        logout();
      });
    }
  }, [token]);

  const login = async (email, password) => {
    const fd = new URLSearchParams();
    fd.append("username", email);
    fd.append("password", password);
    const res = await api.post("/auth/login", fd);
    localStorage.setItem("token", res.data.access_token);
    setAuthToken(res.data.access_token);
    setToken(res.data.access_token);
    const me = await api.get("/auth/me");
    setUser(me.data);
    return me.data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
