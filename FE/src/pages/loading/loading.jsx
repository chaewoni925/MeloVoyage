import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../../components/Footer.jsx";

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 이전 페이지에서 보낸 다음 이동할 경로와 검색어(state)를 받습니다.
  // 값이 없다면 안전하게 기본값으로 /music 설정
  const nextPath = location.state?.nextPath || "/music";
  const query = location.state?.query;

  useEffect(() => {
    // 2초 동안 로딩 애니메이션을 보여준 뒤 nextPath로 이동합니다.
    // (백엔드 API 호출이 완료된 뒤 넘어가게 하려면 추후 이 부분을 async/await로 수정하면 됩니다)
    const timer = setTimeout(() => {
      navigate(nextPath, { state: { query } });
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, nextPath, query]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-[#7F32C1]">
        <div className="mt-100">
          <style>{`
            @keyframes bounce-x {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .dot1 { animation: bounce-x 1s ease-in-out infinite; }
            .dot2 { animation: bounce-x 1s ease-in-out infinite 0.2s; }
            .dot3 { animation: bounce-x 1s ease-in-out infinite 0.4s; }
          `}</style>

          <div className="flex justify-center items-center gap-4">
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

          <h1 className="text-center pl-5 text-[45px] font-bold text-white font-Pretendard">SEARCHING..</h1>
          <p className="text-center text-[15px] text-white font-Pretendard">JUST WAIT A FEW SECONDS..</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;