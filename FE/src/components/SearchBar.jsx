import { useNavigate } from "react-router-dom";

const SearchBar = ({ searchQuery, setSearchQuery, placeholder, onSearch }) => {
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="w-full relative flex items-center">
      {/* 입력창 */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full border border-gray-100 bg-gray-100 text-sm text-gray-600 placeholder-gray-400 rounded-xl pl-4 pr-20 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
      />

      {/* X 버튼 (검색어가 있을 때만, 돋보기 아이콘 왼쪽에 위치) */}
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute right-11 text-gray-400 hover:text-purple-600 text-xs font-bold bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
        >
          X
        </button>
      )}

      {/* 돋보기 아이콘 - 오른쪽, 클릭 시 검색 실행 */}
      <button
        type="button"
        onClick={handleSearchClick}
        className="absolute right-4 text-gray-400 hover:text-purple-600 transition-colors focus:outline-none cursor-pointer"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;