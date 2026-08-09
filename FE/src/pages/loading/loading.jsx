// src/pages/loading/loading.jsx
import { useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { recommendationId: paramId } = useParams();

  const nextPath = location.state?.nextPath || "/searchPlaceToMusicReason";
  const recommendationId = paramId || location.state?.recommendationId;

  useEffect(() => {
    if (!recommendationId) {
      navigate("/searchPlaceToMusic", { replace: true });
      return;
    }

    const timer = setTimeout(() => {
      navigate(`${nextPath}/${recommendationId}`, { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, nextPath, recommendationId]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
      <div className="w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden bg-[#7F32C1] items-center justify-center">

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