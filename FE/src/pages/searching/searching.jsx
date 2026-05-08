// src/pages/music.jsx
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../components/Footer.jsx";

const SearchingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen bg-[#7F32C1]">
      <div className="mt-100 ">

        <style>{`
  @keyframes bounce-x {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateY(-10px); }
  }
  .dot1 { animation: bounce-x 1s ease-in-out infinite; }
  .dot2 { animation: bounce-x 1s ease-in-out infinite 0.2s; }
  .dot3 { animation: bounce-x 1s ease-in-out infinite 0.4s; }
`}</style>

<div className="flex justify-center items-center gap-4">

<svg className="dot1" width="11" height="11" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="11" cy="11" r="11" fill="white"/> </svg>

<svg className="dot2" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="11" cy="11" r="11" fill="white"/> </svg>

<svg className="dot3" width="11" height="11" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="11" cy="11" r="11" fill="white"/> </svg> </div>

      <h1 className="text-center pl-5 text-[45px] font-bold text-white font-Pretendard ">SEARCHING..</h1>
      <p className="text-center text-[15px] text-white font-Pretendard">JUST WAIT A FEW SECONDS..</p>
      </div>

      </div>
    </div>
  );
};
export default SearchingPage;