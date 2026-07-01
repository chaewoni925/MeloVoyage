// src/components/NoLogoHeader.jsx
import { useNavigate } from "react-router-dom"; 

const NoLogoHeader = () => {
  const navigate = useNavigate();

  return (
    // border-b: 아래쪽 테두리 추가, border-gray-200: 연한 회색 테두리
    
    <div className="flex justify-between items-center px-6 pl-2 py-2 bg-white border-b border-gray-100">
      <h1 className="text-2xl font-bold cursor-pointer px-2 -ml-2 -mt-4">
        <button 
            onClick={() => navigate(-1)} 
            className="text-purple-600 hover:opacity-70 font-bold text-xl mr-3 cursor-pointer focus:outline-none"
          >
            &#60;
          </button>
      </h1>
      
      <div 
      className="flex items-center gap-2 cursor-pointer -mt-3 -mr-4"
      onClick={() => navigate('/profile')} // 프로필 페이지 경로로 이동
      >
        <div className="flex mb-2 items-center gap-2 text-[12px] font-bold text-gray-700">아이디
          <div className="w-8 h-8 bg-purple-200 rounded-full overflow-hidden shadow-sm">
            <span className="w-full h-full flex items-center justify-center text-gray-700 text-xs font-bold">
              MY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoLogoHeader;