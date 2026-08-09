// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.svg';
import { useUser } from "../context/userContext";

const Header = ({ title, showLogo = true, rightSlot }) => {
  const navigate = useNavigate();
  const { user, loading } = useUser();

  return (
    <div className="relative flex justify-between items-center px-4 h-[83px] bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        {showLogo ? (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/music')}
          >
            <img
              src={logo}
              alt="로고"
              className="h-[5rem] w-auto object-contain"
            />
          </div>
        ) : (
          <button
            onClick={() => navigate(-1)}
            className="text-purple-600 hover:opacity-70 font-bold text-xl cursor-pointer focus:outline-none"
          >
            &#60;
          </button>
        )}
        {title && (
          <h1 className="text-base font-bold text-gray-900">{title}</h1>
        )}
      </div>

      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate('/profile')}
      >
        <span className="text-sm font-medium text-gray-800">
          {loading ? "" : user?.email ? user.email.split("@")[0] : "로그인"}
        </span>
        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-sm">
          {user?.email ? user.email[0].toUpperCase() : "MY"}
        </div>
        {rightSlot}
      </div>
    </div>
  );
};

export default Header;