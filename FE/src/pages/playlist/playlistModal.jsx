// src/pages/playlist/PlaylistModal.jsx
import React from 'react';

import musicIcon from '../../assets/music_icon.svg';      
import albumIcon from '../../assets/album_icon.svg';     
import artistIcon from '../../assets/artist_icon.svg';    
import saveIcon from '../../assets/save_icon.svg';        

export default function PlaylistModal({ isOpen, onClose, mode, title, subText }) {

  if (!isOpen) return null;

  const isPlaylistMode = mode === 'playlist';

  return (

    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
    >
      {/* 하단 모달 */}
      <div 
        className="bg-white w-full max-w-md rounded-t-[30px] px-6 pt-6 pb-12 flex flex-col gap-6 shadow-2xl transform transition-transform duration-300 ease-out animate-slide-up"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
      >
        
        {/* 헤더 영역: 타이틀 + 우측 닫기 버튼 */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1 min-w-0 flex-1 pr-4">
            {isPlaylistMode ? (
              // 플레이리스트 제목 누를 경우
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-gray-900 text-lg truncate">{title || "플레이리스트 제목"}</h3>
                <span className="text-gray-400 text-sm cursor-pointer hover:text-purple-600">📝</span> {/* 수정 아이콘 */}
              </div>
            ) : (
              // 곡 누를 경우
              <h3 className="font-bold text-gray-900 text-lg truncate">{title || "곡 제목"}</h3>
            )}
            
            {/* 서브 텍스트 (총 곡수 만든 날짜 또는 아티스트 이름) */}
            <p className="text-xs text-gray-400 font-medium truncate">
              {subText || (isPlaylistMode ? "총 0곡 · 만든 날짜" : "아티스트 이름")}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="text-gray-900 hover:opacity-60 text-2xl font-light cursor-pointer focus:outline-none leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/*  메뉴 리스트 세션  */}
        <div className="flex flex-col gap-1">
          
          {/* 곡 누를 경우 나오는 메뉴들 (곡 정보, 앨범 정보, 아티스트 정보) */}
          {!isPlaylistMode && (
            <>
              <button className="w-full flex items-center gap-4 bg-transparent hover:bg-gray-50 py-3.5 px-1 rounded-xl text-sm font-semibold text-gray-800 transition-colors cursor-pointer text-left">
                <img src={musicIcon} alt="" className="w-5 h-5 object-contain" />
                <span>곡 정보</span>
              </button>

              <button className="w-full flex items-center gap-4 bg-transparent hover:bg-gray-50 py-3.5 px-1 rounded-xl text-sm font-semibold text-gray-800 transition-colors cursor-pointer text-left">
                <img src={albumIcon} alt="" className="w-5 h-5 object-contain" />
                <span>앨범 정보</span>
              </button>

              <button className="w-full flex items-center gap-4 bg-transparent hover:bg-gray-50 py-3.5 px-1 rounded-xl text-sm font-semibold text-gray-800 transition-colors cursor-pointer text-left">
                <img src={artistIcon} alt="" className="w-5 h-5 object-contain" />
                <span>아티스트 정보</span>
              </button>
            </>
          )}

          {/* 공통 메뉴 (내 플레이리스트에 저장) */}
          <button className="w-full flex items-center gap-4 bg-transparent hover:bg-gray-50 py-3.5 px-1 rounded-xl text-sm font-semibold text-gray-800 transition-colors cursor-pointer text-left">
            <img src={saveIcon} alt="" className="w-5 h-5 object-contain" />
            <span>내 플레이리스트에 저장</span>
          </button>

        </div>

      </div>
    </div>
  );
}