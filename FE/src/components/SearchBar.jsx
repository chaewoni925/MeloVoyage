import { useNavigate } from "react-router-dom";

const SearchBar = ({ placeholder }) => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/searching');
  };

  return (
    <div className="relative mt-2">
      {/* 돋보기 아이콘 */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* 입력창 */}
      <input
        type="text"
        className="w-full bg-[#D9D9D9] text-[#D9D9D9] text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block pl-10 p-2 outline-none placeholder-gray-500"
        placeholder={placeholder}
        required 
          onClick={() => navigate('/searching')}
          onKeyDown={(e) => {
        if (e.key === 'Enter') navigate('/searching');
           }}
      />
    </div>
  );
};

export default SearchBar;