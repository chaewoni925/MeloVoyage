import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import StorageList from './storageList'; 
import searchIcon from '../../assets/search.png';

export default function StoragePage() {
  const navigate = useNavigate(); 

//데이터 빈 상태 
// const [playlists, setPlaylists] = useState([]);

//테스트용 데이터
const [playlists, setPlaylists] = useState([
  { id: 1, title: '제주도 푸른 밤 드라이브', songs: 12, listenerCount: 45 },
  { id: 2, title: '부산 광안리 밤바다', songs: 8, listenerCount: 120 },
  { id: 3, title: '경주 가을 산책 코스', songs: 15, listenerCount: 15 },
]);

// 검색
const [searchQuery, setSearchQuery] = useState("");

// 정렬 (latest-최신순, popular-자주듣는순)
const [sortBy, setSortBy] = useState('latest');

// 검색어로 필터링
  const filteredPlaylists = playlists.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F9F9FB] flex flex-col relative pb-6 font-sans selection:bg-purple-200">
      
      {/*상단*/}
      <header className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/*이전페이지 이동*/}
          <button 
            onClick={() => navigate(-1)} 
            className="text-purple-600 text-2xl focus:outline-none hover:opacity-70 transition-opacity cursor-pointer"
          >
            &#60;
          </button>
          <h1 className="text-xl font-bold text-gray-800">Storage</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-purple-600 font-medium">사용자이름</span>
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300"></div>
          <button className="text-gray-400 text-xl font-bold focus:outline-none">⋮</button>
        </div>
      </header>

      {/* 메인 공간 */}
      <main className="flex-1 p-4 flex flex-col gap-4">
        {/* 검색창 */}
        <div className="w-full relative flex items-center">
          <img 
            src={searchIcon} 
            alt="search" 
            className="absolute left-4 w-4 h-4 object-contain pointer-events-none" 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색"
            className="w-full bg-[#EAECEF] text-sm text-purple-600 placeholder-purple-400 rounded-xl pl-11 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
          />
          {/*검색어 있을 때 X 버튼*/}
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 text-gray-400 hover:text-purple-600 text-xs font-bold bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
            >
              X
            </button>
          )}
        </div>

        {/* 정렬 필터 */}
        <div className="flex justify-end items-center gap-2 text-xs text-gray-500 mt-2">
          <button 
            onClick={() => setSortBy('latest')}
            className={`font-medium transition-colors cursor-pointer ${sortBy === 'latest' ? 'text-purple-600 font-bold' : 'hover:text-gray-800'}`}
          >
            최신순
          </button>
          <span className="text-gray-300">|</span>
          <button 
            onClick={() => setSortBy('popular')}
            className={`font-medium transition-colors cursor-pointer ${sortBy === 'popular' ? 'text-purple-600 font-bold' : 'hover:text-gray-800'}`}
          >
            자주듣는순
          </button>
        </div>

        {/*조건*/}
        {playlists.length === 0 ? (
          //보관함 비었을 때
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
            <p className="text-sm font-medium">아직 저장된 플레이리스트가 없습니다.</p>
            <p className="text-xs text-gray-300">나만의 여행 음악을 추가해보세요!</p>
          </div>
        ) : filteredPlaylists.length === 0 ? (
          //검색 결과가 없을 때
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
            <p className="text-sm font-medium">‘{searchQuery}’에 대한 검색 결과가 없습니다.</p>
            <p className="text-xs text-gray-300">다른 키워드로 검색해 보세요.</p>
          </div>
        ) : (
          //검색 결과가 존재할 때
          <div className="flex flex-col gap-3">
            {filteredPlaylists.map((item) => (
              <StorageList key={item.id} playlist={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}