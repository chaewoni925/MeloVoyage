// src/context/userContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(`${BASE_URL}/users/mypage`, { credentials: "include" })
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then(({ data }) => setUser(data))
    .catch(() => setUser(null))
    .finally(() => setLoading(false));
}, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);