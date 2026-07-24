// src/pages/music.jsx (혹은 loading.jsx)
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // navigate할 때 넘겨준 nextPath를 받거나, 기본값으로 결과 페이지 경로 설정
  const nextPath = location.state?.nextPath || "/searchMusicToPlaceReason";

  useEffect(() => {
    // 3초 후 결과 페이지로 이동
    const timer = setTimeout(() => {
      navigate(nextPath);
    }, 3000); 

    // 컴포넌트가 사라질 때 타이머를 정리하여 메모리 누수 방지
    return () => clearTimeout(timer);
  }, [navigate, nextPath]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-[#7F32C1] flex flex-col justify-center items-center">
        
        <style>{`
          @keyframes bounce-y {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .dot1 { animation: bounce-y 1s ease-in-out infinite; }
          .dot2 { animation: bounce-y 1s ease-in-out infinite 0.2s; }
          .dot3 { animation: bounce-y 1s ease-in-out infinite 0.4s; }
        `}</style>

        <div className="flex justify-center items-center gap-4 mb-6">
          <svg className="dot1" width="11" height="11" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="11" fill="white"/>
          </svg>
          <svg className="dot2" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="11" fill="white"/>
          </svg>
          <svg className="dot3" width="11" height="11" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="11" fill="white"/>
          </svg>
        </div>

        <h1 className="text-center text-[45px] font-bold text-white font-Pretendard">SEARCHING..</h1>
        <p className="text-center text-[15px] text-white font-Pretendard">JUST WAIT A FEW SECONDS..</p>
      </div>
    </div>
  );
};

export default LoadingPage;