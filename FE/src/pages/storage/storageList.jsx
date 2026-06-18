import React, { useState } from 'react';

export default function StorageList({ playlist }) {
  
  //삭제팝업 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 스포티파이 API로 플리 이미지URL
  // 구조: playlist -> tracks -> items[0] -> track -> album -> images[0] -> url
  const firstTrackImg = playlist?.tracks?.items?.[0]?.track?.album?.images?.[0]?.url;

  // 삭제 로직 처리 
  const handleDelete = () => {
    // 나중에 실제 삭제 API나 부모 상태 변경 함수를 연동 필요
    alert(`${playlist.title || '플레이리스트'}가 삭제되었습니다.`);
    setIsDeleteModalOpen(false); 
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      
      {/*플리 이미지*/}
      <div className="w-16 h-16 rounded-xl bg-gray-900 flex-shrink-0 flex items-center justify-center overflow-hidden text-white text-[10px] font-bold tracking-wider">
        {/*이미지 URL이 존재하면 보여주고, 없으면 MELO*/}
        {firstTrackImg ? (
          <img 
            src={firstTrackImg} 
            alt={playlist.title || "Playlist Cover"} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <span>MELO</span>
        )}
      </div>

      {/* 플레이리스트 정보 */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h3 className="font-bold text-gray-800 text-sm md:text-base leading-snug truncate">
          {playlist.title}
        </h3>
        
        {/*서브 텍스트 설명 */}
        <p className="text-xs text-gray-400 mt-1 truncate">
          {playlist.songs ? `${playlist.songs}곡` : '0곡'} 
          {playlist.listenerCount !== undefined && ` · ${playlist.listenerCount}회 감상`}
        </p>
      </div>

      {/* 우측 더보기 버튼 (⋮) */}
      <button 
        onClick={(e) => {
          e.stopPropagation(); // 카드 전체 클릭 방지
          setIsDeleteModalOpen(true);
        }}
        className="ml-auto text-purple-600 text-xl font-bold p-1 hover:bg-purple-50 rounded-full transition-colors focus:outline-none cursor-pointer"
      >
        ⋮
      </button>

      {/*삭제모달 팝업 */}
      {isDeleteModalOpen && (
        <div 
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            setIsDeleteModalOpen(false); // 어두운 배경 클릭시 닫히기
          }}
        >
          {/* 삭제 창 */}
          <div 
            className="bg-white w-full max-w-xs rounded-2xl p-5 flex flex-col items-center text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭시 닫히지 않도록 설정
          >
            {/*아이콘 */}
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-3 text-lg font-bold">
              ⚠️
            </div>
            
            <h4 className="text-gray-800 font-bold text-base mb-1">플레이리스트 삭제</h4>
            <p className="text-gray-400 text-xs mb-5 leading-relaxed">
              정말 삭제하시겠습니까?
            </p>
            
            {/* 하단 버튼*/}
            <div className="flex w-full gap-2">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer focus:outline-none"
              >
                취소
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-200 cursor-pointer focus:outline-none"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}