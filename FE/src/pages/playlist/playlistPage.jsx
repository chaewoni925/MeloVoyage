// src/pages/playlist/playlistPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlaylistModal from './PlaylistModal';
import Header from '../../components/Header';
import instance from '../../api/axios';
import deleteIcon from '../../assets/delete.svg';

export default function PlaylistPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const playlistId = location.state?.playlistId;

  // 모달 및 선택된 곡 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState({ title: '', artist: '' });

  // ----- 곡 개별 삭제 기능 (현재 비활성화: 백엔드에 트랙 단위 삭제 API 없음, 기획상 필요성도 낮다고 판단) -----
  // const [checkedIds, setCheckedIds] = useState([]);
  // const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  // ----------------------------------------------------------------------------------------------

  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 플레이리스트 상세 조회
  useEffect(() => {
    if (!playlistId) {
      navigate('/storage');
      return;
    }

    /*const fetchPlaylist = async () => {
      try {
        const res = await instance.get(`/storage/${playlistId}`);
        const data = res.data.data;
        setPlaylistInfo({
          title: data.title,
          createdDate: new Date(data.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
          }).replace(/\. /g, '.').replace('.', ''),
        });
        setTracks(data.tracks || []);
      } catch (error) {
        console.error('플레이리스트 상세 조회 실패:', error);
        alert('플레이리스트를 불러오지 못했습니다.');
        navigate('/storage');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist(); */
    // ⚠️ 테스트용 더미 데이터
  setPlaylistInfo({
    title: '서울 플레이리스트',
    createdDate: '2026.07.23',
  });
  setTracks([
    { id: 't1', name: 'STYLE', artist: 'Hearts2Hearts', albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b273610f16f9c84e85158baa0384' },
    { id: 't2', name: 'Whiplash', artist: 'aespa', albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b273e467a8e8d7b0aa92d354aa75' },
    { id: 't3', name: 'REBEL HEART', artist: 'IVE', albumImageUrl: 'https://i.scdn.co/image/ab67616d0000b273307e7e4ca1b2c02108aec9a0' },
  ]);
  setLoading(false);
  }, [playlistId, navigate]);

  // ----- 곡 개별 삭제 기능 (현재 비활성화) -----
  // const handleCheckTrack = (id) => {
  //   if (checkedIds.includes(id)) {
  //     setCheckedIds(checkedIds.filter((trackId) => trackId !== id));
  //   } else {
  //     setCheckedIds([...checkedIds, id]);
  //   }
  // };

  // const handleSelectAll = () => {
  //   if (checkedIds.length === tracks.length) {
  //     setCheckedIds([]);
  //   } else {
  //     setCheckedIds(tracks.map((track) => track.id));
  //   }
  // };

  // 삭제 버튼 누르면 커스텀 모달 열기
  // const openDeleteAlert = () => {
  //   setIsDeleteAlertOpen(true);
  // };

  // 커스텀 팝업에서 삭제하기를 진짜 눌렀을 때 실행
   // const confirmDeleteSelected = () => {
  //   setTracks(tracks.filter((track) => !checkedIds.includes(track.id)));
  //   setCheckedIds([]);
  //   setIsDeleteAlertOpen(false);
  // };

  // const isEditing = checkedIds.length > 0;
  // -------------------------------------------

  const [exporting, setExporting] = useState(false);

  const handleExportToSpotify = async () => {
  if (exporting) return;
  setExporting(true);
  try {
    const res = await instance.post(`/storage/${playlistId}/export/spotify`);
    const { spotifyPlaylistUrl, trackCount } = res.data;
    alert(`Spotify에 ${trackCount}곡이 내보내졌습니다!`);
    window.open(spotifyPlaylistUrl, '_blank');
  } catch (error) {
    console.error('Spotify 내보내기 실패:', error);
    alert(error.response?.data?.message || 'Spotify 연동 후 다시 시도해 주세요.');
  } finally {
    setExporting(false);
  }
};



  const openTrackModal = (title, subText, mode = 'track') => {
    setSelectedTrack({ title, artist: subText, mode }); 
    setIsModalOpen(true);
  };

  if (loading || !playlistInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      
      <div className="bg-white p-6 rounded-b-3xl flex flex-col w-full max-w-md relative font-sans min-h-screen pb-16 selection:bg-purple-200 overflow-hidden">
        
        {/* 공용 Header 컴포넌트로 교체 */}
        <Header 
          showLogo={false} 
          title="My playlist" 
          rightSlot={
            <div className="flex items-center gap-4 text-gray-600">
              <button className="text-xl hover:text-red-500 cursor-pointer focus:outline-none">♡</button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  openTrackModal(playlistInfo.title, `총 ${tracks.length}곡 · ${playlistInfo.createdDate}`, "playlist");
                }}
                className="text-xl font-bold hover:text-gray-900 p-1 cursor-pointer focus:outline-none"
              >
                ⋮
              </button>
            </div>
          }
        />

        {/*플리 커버 및 타이틀 */}
        <div className="flex flex-col items-center text-center pt-6 pb-4 bg-white">
          {tracks[0]?.albumImageUrl ? (
            <img src={tracks[0].albumImageUrl} alt="" className="w-36 h-36 rounded-2xl shadow-sm mb-4 object-cover" />
          ) : (
            <div className="w-36 h-36 bg-gray-200 rounded-2xl shadow-sm mb-4" />
          )}
          <h2 className="text-xl font-bold text-gray-900">{playlistInfo.title}</h2>
          <p className="text-xs text-gray-500 mt-1">총 {tracks.length}곡 · {playlistInfo.createdDate}</p>
        </div>

        {/* 전체선택 필터 (곡 개별 삭제 비활성화로 함께 숨김. 필요시 위 상태/함수 주석 해제 후 복원)
        <div className="flex justify-between items-center text-xs py-3 border-b border-gray-100 mb-1 bg-white">
          <button onClick={handleSelectAll} className="flex items-center gap-1 text-purple-600 font-bold cursor-pointer focus:outline-none">
            <span className="text-sm font-medium">{checkedIds.length === tracks.length && tracks.length > 0 ? '✓' : '∨'}</span> 전체선택
          </button>
        </div>
        */}

        {/* 곡 리스트 */}
        <main className="flex-1 -mx-6 px-6 pt-4 flex flex-col pb-6 overflow-y-auto bg-white">
          {tracks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm py-16">
              곡이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 mt-1">
              {tracks.map((track) => (
                <div 
                  key={track.id}
                  className="flex items-center gap-3 py-3 px-3 rounded-xl hover:bg-gray-50/50 transition-colors"
                >
                  <img 
                    src={track.albumImageUrl || 'https://via.placeholder.com/50'} 
                    alt="" 
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" 
                  />
                  
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h4 className="font-bold text-xs truncate text-gray-800">{track.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 truncate">{track.artist}</p>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <button className="text-gray-900 hover:text-purple-600 text-xs cursor-pointer">▶</button>
                    <button 
                      onClick={() => openTrackModal(track.name, track.artist)}
                      className="text-gray-400 hover:text-gray-700 font-bold text-sm p-1 cursor-pointer focus:outline-none"
                    >
                      ⋮
                    </button>
                  </div>
                </div>
              ))}
              </div>
          )}
          </main>

        {/* 곡 선택 시 하단 삭제바 (비활성화, 필요시 복원)
        <div className={`absolute bottom-0 left-0 right-0 bg-[#7C3AED] py-5 flex items-center justify-center gap-2 text-white font-bold text-sm shadow-2xl transition-all duration-300 transform z-40 cursor-pointer rounded-none ${isEditing ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`} onClick={openDeleteAlert}>
          <img src={deleteIcon} alt="삭제" className="w-5 h-5 object-contain" />
          <span>삭제 ({checkedIds.length})</span>
        </div>
        */}

        {/* 삭제 확인 팝업 (비활성화, 필요시 복원)
        {isDeleteAlertOpen && ( ... )}
        */}

        {/* Spotify로 내보내기 */}
        <div className="px-2 pt-2 pb-2">
          <button
            onClick={handleExportToSpotify}
            disabled={exporting || tracks.length === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-2
              ${exporting || tracks.length === 0 ? 'bg-[#1DB954]/50 cursor-not-allowed' : 'bg-[#1DB954] hover:bg-[#1aa34a]'}`}
          >
            {exporting ? '내보내는 중...' : 'Spotify로 내보내기'}
          </button>
        </div>

        {/* 하단 모달 */}
        <PlaylistModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          mode={selectedTrack.mode}
          title={selectedTrack.title}
          subText={selectedTrack.artist}
        />

      </div>
    </div>
  );
}