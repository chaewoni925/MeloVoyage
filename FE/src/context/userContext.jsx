// src/context/userContext.jsx
import { createContext, useContext, useCallback, useEffect, useState } from "react";

const UserContext = createContext(null);
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(() => {
    fetch(`${BASE_URL}/users/mypage`, {
      credentials: "include",
      cache: "no-store", // 304 응답으로 res.ok가 false 처리되는 문제 방지
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  
useEffect(() => {
  fetch(`${BASE_URL}/users/mypage`, {
    credentials: "include",
    cache: "no-store", // 304 응답으로 res.ok가 false 처리되는 문제 방지
  })
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