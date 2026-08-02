import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import StorageList from './storageList'; 
import searchIcon from '../../assets/search.png';
import Footer from "../../components/Footer.jsx"; 
import Header from "../../components/Header.jsx"; 
import instance from '../../api/axios';

export default function StoragePage() {
  const navigate = useNavigate();

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState('latest');

  // 저장된 플레이리스트 목록 조회
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await instance.get('/storage/');
        setPlaylists(res.data.data);
      } catch (error) {
        console.error('플레이리스트 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists(); 

  }, []);

  // 삭제 성공 시 리스트에서 제거
  const handleDeletePlaylist = (deletedId) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== deletedId));
  };

  // 검색어로 필터링 + 정렬 적용
  const filteredPlaylists = playlists
    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="bg-white p-6 rounded-b-3xl flex flex-col w-full max-w-md relative pb-16 font-sans selection:bg-purple-200">

        <Header showLogo={false} title="Storage" />

        <main className="flex-1 mt-4 -mx-6 px-6 pt-6 flex flex-col gap-4 overflow-y-auto">

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

          {/* 정렬 필터 (popular는 API에 listenerCount가 없어 latest만 지원) */}
          <div className="flex justify-end items-center gap-2 text-xs text-gray-500 mt-1">
            <button
              onClick={() => setSortBy('latest')}
              className={`font-medium transition-colors cursor-pointer ${sortBy === 'latest' ? 'text-purple-600 font-bold' : 'hover:text-gray-800'}`}
            >
              최신순
            </button>
          </div>

          {/* 리스트 조건부 렌더링 영역 */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center py-24 text-gray-400">
              <p className="text-sm">불러오는 중...</p>
            </div>
          ) : playlists.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
              <p className="text-sm font-medium">아직 저장된 플레이리스트가 없습니다.</p>
              <p className="text-xs text-gray-300">나만의 여행 음악을 추가해보세요!</p>
            </div>
          ) : filteredPlaylists.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
              <p className="text-sm font-medium">'{searchQuery}'에 대한 검색 결과가 없습니다.</p>
              <p className="text-xs text-gray-300">다른 키워드로 검색해 보세요.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-6">
              {filteredPlaylists.map((item) => (
                <StorageList key={item.id} playlist={item} onDelete={handleDeletePlaylist} />
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}