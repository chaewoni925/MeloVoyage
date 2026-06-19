// src/pages/playlist/playlistPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaylistModal from './PlaylistModal';
import deleteIcon from '../../assets/delete.svg';

export default function PlaylistPage() {
  const navigate = useNavigate();

  // 모달 및 선택된 곡 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState({ title: '', artist: '' });

  // 다중 선택(삭제용) 상태 관리
  const [checkedIds, setCheckedIds] = useState([]);

  // 커스텀 삭제 확인 팝업 상태 관리
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  // 테스트용 플레이리스트 & 곡 데이터
  const [tracks, setTracks] = useState([
    { id: 1, title: "Beautiful Somehow", artist: "Joy Williams", albumImg: "https://via.placeholder.com/50" },
    { id: 2, title: "Don't Let Her", artist: "Walker Hayes", albumImg: "https://via.placeholder.com/50" },
    { id: 3, title: "Game Called Life", artist: "Leftover Cuties", albumImg: "https://via.placeholder.com/50" },
    { id: 4, title: "You And Me", artist: "Shane Filan", albumImg: "https://via.placeholder.com/50" },
    { id: 5, title: "Stand Up For It", artist: "Brett Dennen", albumImg: "https://via.placeholder.com/50" },
  ]);

  const playlistInfo = {
    title: "플레이리스트 제목",
    songCount: tracks.length, // 현재 남은 곡 수 실시간 연동
    createdDate: "2026.06.19"
  };

  const handleCheckTrack = (id) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((trackId) => trackId !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (checkedIds.length === tracks.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(tracks.map((track) => track.id));
    }
  };

  // 삭제 버튼 누르면 커스텀 모달 열기
  const openDeleteAlert = () => {
    setIsDeleteAlertOpen(true);
  };

  // 커스텀 팝업에서 삭제하기를 진짜 눌렀을 때 실행
  const confirmDeleteSelected = () => {
    setTracks(tracks.filter((track) => !checkedIds.includes(track.id)));
    setCheckedIds([]);
    setIsDeleteAlertOpen(false); 
  };


  const openTrackModal = (title, subText, mode = 'track') => {
    setSelectedTrack({ title, artist: subText, mode }); 
    setIsModalOpen(true);
  };

  const isEditing = checkedIds.length > 0;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      
      <div className="bg-white p-6 flex flex-col w-full max-w-md relative font-sans min-h-screen pb-16 selection:bg-purple-200 overflow-hidden">
        
        {/*헤더 */}
        <header className="flex items-center justify-between pb-4 bg-white">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="text-purple-600 hover:opacity-70 font-bold text-2xl cursor-pointer focus:outline-none"
            >
              &#60;
            </button>
            <h1 className="text-base font-bold text-gray-900 tracking-tight">My playlist</h1>
          </div>
          
          <div className="flex items-center gap-4 text-gray-600">
            <button className="text-xl hover:text-red-500">♡</button>
            <button 
              onClick={() => openTrackModal(playlistInfo.title, `총 ${playlistInfo.songCount}곡 · ${playlistInfo.createdDate}`, "playlist")}
              className="text-xl font-bold hover:text-gray-900 p-1 cursor-pointer focus:outline-none"
            >
              ⋮
            </button>
          </div>
        </header>

        {/*플리 커버 및 타이틀 */}
        <div className="flex flex-col items-center text-center pt-2 pb-4 bg-white">
          <div className="w-36 h-36 bg-gray-200 rounded-2xl shadow-sm mb-4" />
          <h2 className="text-xl font-bold text-gray-900">{playlistInfo.title}</h2>
          <p className="text-xs text-gray-500 mt-1">총 {playlistInfo.songCount}곡 · {playlistInfo.createdDate}</p>
        </div>

        {/* 필터 */}
        <div className="flex justify-between items-center text-xs py-3 border-b border-gray-100 mb-1 bg-white">
          <button 
            onClick={handleSelectAll}
            className="flex items-center gap-1 text-purple-600 font-bold cursor-pointer focus:outline-none"
          >
            <span className="text-sm font-medium">{checkedIds.length === tracks.length ? '✓' : '∨'}</span> 전체선택
          </button>
          {/*<button className="text-gray-500 font-medium flex items-center gap-1">
            최신순 
          </button> */}
        </div>

        {/* 곡 리스트 */}
        <main className={`flex-1 -mx-6 px-6 pt-2 flex flex-col pb-24 overflow-y-auto transition-colors duration-300 ${isEditing ? 'bg-[#F3E8FF]' : 'bg-white'}`}>
          <div className="flex flex-col gap-2.5 mt-1">
            {tracks.map((track) => {
              const isChecked = checkedIds.includes(track.id);
              return (
                <div 
                  key={track.id}
                  onClick={() => handleCheckTrack(track.id)} 
                  className={`flex items-center gap-3 py-3 px-3 rounded-xl cursor-pointer transition-colors ${isChecked ? 'bg-purple-200/50' : 'hover:bg-gray-50/50'}`}
                >
                  <img src={track.albumImg} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                  
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h4 className={`font-bold text-xs truncate ${isChecked ? 'text-purple-900' : 'text-gray-800'}`}>{track.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{track.artist}</p>
                  </div>

                  <div className="flex items-center gap-3.5" onClick={(e) => e.stopPropagation()}>
                    <button className="text-gray-900 hover:text-purple-600 text-xs">▶</button>
                    <button 
                      onClick={() => openTrackModal(track.title, track.artist)}
                      className="text-gray-400 hover:text-gray-700 font-bold text-sm p-1 cursor-pointer focus:outline-none"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* 곡 선택 시 하단 삭제 바 */}
        <div 
            className={`absolute bottom-0 left-0 right-0 bg-[#7C3AED] py-5 flex items-center justify-center gap-2 text-white font-bold text-sm shadow-2xl transition-all duration-300 transform z-40 cursor-pointer rounded-none ${
                isEditing ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            onClick={openDeleteAlert}
            >
            <img 
                src={deleteIcon} 
                alt="삭제" 
                className="w-5 h-5 object-contain" 
            />
          <span>삭제 ({checkedIds.length})</span>
        </div>

        {/* 알림 팝업  */}
        {isDeleteAlertOpen && (
          <div 
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setIsDeleteAlertOpen(false)}
          >
            <div 
              className="bg-white w-full max-w-xs rounded-2xl p-5 flex flex-col items-center text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-3 text-lg font-bold">
                ⚠️
              </div>
              <h4 className="text-gray-900 font-bold text-base mb-1">곡 삭제</h4>
              <p className="text-gray-400 text-xs mb-5 leading-relaxed">
                선택한 {checkedIds.length}개의 곡을<br />플레이리스트에서 삭제하시겠습니까?
              </p>
              <div className="flex w-full gap-2">
                <button 
                  onClick={() => setIsDeleteAlertOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-200 cursor-pointer focus:outline-none"
                >
                  취소
                </button>
                <button 
                  onClick={confirmDeleteSelected}
                  className="flex-1 bg-red-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-red-600 shadow-sm cursor-pointer focus:outline-none"
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 하단 모달 */}
        <PlaylistModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          trackTitle={selectedTrack.title}
          artistName={selectedTrack.artist}
        />

      </div>
    </div>
  );
}