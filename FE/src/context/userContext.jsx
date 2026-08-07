// src/context/userContext.jsx
import { createContext, useContext, useCallback, useEffect, useState } from "react";

const UserContext = createContext(null);
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. API 호출 함수 하나로 정리
  const fetchUser = useCallback(() => {
    setLoading(true); // 다시 호출될 때를 대비해 로딩 상태 켜기
    
    fetch(`${BASE_URL}/users/mypage`, {
      credentials: "include",
      cache: "no-store", 
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);
  
  // 2. 앱 실행 시 최초 1회 유저 정보 가져오기
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    // 3. fetchUser를 다른 컴포넌트(예: 로그인 컴포넌트)에서도 쓸 수 있게 넘겨줍니다.
    <UserContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);