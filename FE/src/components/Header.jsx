// src/components/Header.jsx
const Header = () => {
  return (
    <div className="flex justify-between items-center px-6 pl-2 py-2 bg-white">
      <h1 className="text-2xl font-bold cursor-pointer -ml-2 -mt-4">로고 or 홈</h1>
      <div className="flex items-center gap-2 cursor-pointer -mt-3 -mr-4">
        <p className="flex  items-center gap-2 text-[12px] font-bold text-gray-700  ">아이디
        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden shadow-sm-mt-4">
          <span className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
            MY  
          </span>
           </div>
           </p>
        </div>
    </div>
  );
};

export default Header;