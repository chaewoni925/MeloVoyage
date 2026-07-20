// src/components/Header.jsx
import { useNavigate } from "react-router-dom"; 

const Header = ({ title, showLogo = true, rightSlot }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-6 pl-2 py-2 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2">
        {showLogo ? (
          <h1 
            className="text-2xl font-bold cursor-pointer px-2 -ml-2 -mt-4"
            onClick={() => navigate('/music')}
          >
            로고 or 홈
          </h1>
        ) : (
          <button
            onClick={() => navigate(-1)}
            className="text-purple-600 hover:opacity-70 font-bold text-xl mr-1 cursor-pointer focus:outline-none"
          >
            &#60;
          </button>
        )}
        {title && (
          <h1 className="text-base font-bold text-gray-900">{title}</h1>
        )}
      </div>

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

export default Header;