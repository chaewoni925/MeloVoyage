import { useNavigate } from "react-router-dom";

const MyPlaylistEmptyState = ({
  navigatePath = "/search",
  title = "플레이리스트",
  subtitle = "만들기",
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
      <div
        onClick={() => navigate(navigatePath)}
        className="flex-shrink-0 w-40 aspect-square rounded-2xl border-[1.5px] border-dashed border-[#C9B8FF] bg-[#F1ECFF] flex flex-col items-center justify-center gap-2.5 cursor-pointer snap-start"
      >
        <div className="w-[38px] h-[38px] rounded-full bg-[#7C4DFF] text-white flex items-center justify-center text-xl leading-none">
          +
        </div>
        <p className="text-[13px] font-semibold text-[#7C4DFF] text-center leading-snug">
          {title}<br />{subtitle}
        </p>
      </div>

      <div className="flex-shrink-0 w-40 h-50 aspect-square rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center snap-start">
        <span className="text-2xl text-gray-300">♪</span>
      </div>

      <div className="flex-shrink-0 w-40 aspect-square rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center snap-start">
        <span className="text-2xl text-gray-300">♪</span>
      </div>
    </div>
  );
};

export default MyPlaylistEmptyState;