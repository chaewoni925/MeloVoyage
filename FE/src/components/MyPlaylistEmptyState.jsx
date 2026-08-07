import { useNavigate } from "react-router-dom";

const MyPlaylistEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-3">
      <div
        onClick={() => navigate("/search")}
        className="w-45 h-55 rounded-2xl border-[1.5px] border-dashed border-[#C9B8FF] bg-[#F1ECFF] flex flex-col items-center justify-center gap-2.5 cursor-pointer"
      >
        <div className="w-[38px] h-[38px] rounded-full bg-[#7C4DFF] text-white flex items-center justify-center text-xl leading-none">
          +
        </div>
        <p className="text-[13px] font-semibold text-[#7C4DFF] text-center leading-snug">
          플레이리스트<br />만들기
        </p>
      </div>

      <div className="w-45 h-55 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
        <span className="text-2xl text-gray-300">♪</span>
      </div>
    </div>
  );
};

export default MyPlaylistEmptyState; 