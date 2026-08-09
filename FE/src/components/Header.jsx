// src/components/Header.jsx
import { useNavigate } from "react-router-dom"; 
import logo from '../assets/logo.svg';
import { LogOut } from "lucide-react";
import { useUser } from "../context/userContext";

const Header = ({ title, showLogo = true, rightSlot }) => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  return (
    <div className="relative h-14 flex justify-between items-center px-6 pl-2 bg-white border-b border-gray-100">
      <div className="flex items-center gap-2">
        {showLogo ? (
          <h1 
            className="flex items-center cursor-pointer px-2 -ml-2 h-full"
            onClick={() => navigate('/music')}
          >
            <img 
              src={logo} 
              alt="로고" 
              className="h-17 w-auto object-contain -mt-1" 
            />
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
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/profile')}
      >
        <div className="flex items-center gap-2 text-[12px] font-bold text-gray-700">
          {loading ? "" : user?.email ? user.email.split("@")[0] : "로그인"}
          <div className="w-8 h-8 bg-purple-200 rounded-full overflow-hidden shadow-sm">
            <span className="w-full h-full flex items-center justify-center text-gray-700 text-xs font-bold">
              {user?.email ? user.email[0].toUpperCase() : "MY"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;