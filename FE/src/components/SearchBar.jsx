import { useNavigate } from "react-router-dom";

const SearchBar = ({ searchQuery, setSearchQuery, placeholder }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full relative flex items-center">
      {/* 돋보기 아이콘 */}
      <svg 
        className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      {/* 입력창 */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-black bg-white text-sm text-gray-600 placeholder-gray-400 rounded-xl pl-11 pr-11 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
      />

      {/* X 버튼 */}
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-4 text-gray-400 hover:text-purple-600 text-xs font-bold bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
        >
          X
        </button>
      )}
    </div>
  );
};

export default SearchBar;