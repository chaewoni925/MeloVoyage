import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import StorageList from './storageList'; 
import searchIcon from '../../assets/search.png';
import Footer from "../../components/Footer.jsx"; 
import Header from "../../components/Header.jsx"; // 추가

export default function StoragePage() {
  const navigate = useNavigate(); 

  // 테스트용 데이터
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
    // 바깥쪽 전체 회색 배경 + 가로 중앙 정렬
    <div className="min-h-screen bg-gray-100 flex justify-center">
      
      {/* 본문 앱 카드 공간 */}
      <div className="bg-white p-6 rounded-b-3xl flex flex-col w-full max-w-md relative pb-16 font-sans selection:bg-purple-200">
        
        {/* 공용 Header 컴포넌트로 교체 */}
        <Header showLogo={false} title="Storage" />

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1 mt-4  -mx-6 px-6 pt-6 flex flex-col gap-4 overflow-y-auto">
          
          <h1 className="text-[20px] font-bold text-gray-900">내 보관함</h1>

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
          <div className="flex justify-end items-center gap-2 text-xs text-gray-500 mt-1">
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

          {/* 리스트 조건부 렌더링 영역 */}
          {playlists.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
              <p className="text-sm font-medium">아직 저장된 플레이리스트가 없습니다.</p>
              <p className="text-xs text-gray-300">나만의 여행 음악을 추가해보세요!</p>
            </div>
          ) : filteredPlaylists.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
              <p className="text-sm font-medium">‘{searchQuery}’에 대한 검색 결과가 없습니다.</p>
              <p className="text-xs text-gray-300">다른 키워드로 검색해 보세요.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-6">
              {filteredPlaylists.map((item) => (
                <StorageList key={item.id} playlist={item} />
              ))}
            </div>
          )}
        </main>

        <Footer />
        
      </div>
    </div>
  );
}