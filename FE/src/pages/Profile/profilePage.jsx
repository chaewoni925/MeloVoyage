// src/pages/profile/ProfilePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 메뉴 아이콘 SVG 컴포넌트 모음 (수정 예정)
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-[#7C3AED]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-[#7C3AED]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-[#7C3AED]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const LibraryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-[#7C3AED]">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" />
  </svg>
);

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-gray-300">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

export default function ProfilePage() {
  const navigate = useNavigate();

  // 로그아웃 모달
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const userData = {
    nickname: "MeloMate",
    email: "abcd@abcd"
  };

  // 로그아웃 모달에서 최종 확인을 눌렀을 때 실행
  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    // localStorage.removeItem('token'); // 토큰 비우기
    navigate('/'); // 초기 진입화면으로 이동
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      
      {/* 본문 앱 카드 공간 */}
      <div className="bg-white p-6 flex flex-col w-full max-w-md relative font-sans min-h-screen pb-24 selection:bg-purple-200 overflow-hidden">
        
        {/* 상단 헤더 */}
        <header className="flex items-center pb-5 bg-white border-b border-gray-100 mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="text-purple-600 hover:opacity-70 font-bold text-xl mr-3 cursor-pointer focus:outline-none"
          >
            &#60;
          </button>
          <h1 className="text-base font-bold text-gray-900 tracking-tight">My Page</h1>
        </header>

        {/* 중앙 컨텐츠 영역 */}
        <main className="flex-1 flex flex-col overflow-y-auto pr-0.5">
          
          {/* 유저 정보 노출 섹션 */}
          <div className="flex flex-col items-center text-center mt-2 mb-6">
            <div className="w-20 h-20 bg-[#F3E8FF] rounded-full flex items-center justify-center mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-9 h-9 text-[#7C3AED]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">{userData.nickname}</h2>
            <p className="text-xs text-gray-400 font-medium mt-1">{userData.email}</p>
          </div>

          {/* ACCOUNT */}
          <div className="flex flex-col mb-6">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider pl-2 mb-2">ACCOUNT</span>
            
            <div className="bg-white border border-gray-100 rounded-[22px] shadow-sm overflow-hidden flex flex-col px-4">
              
              {/* Profile Settings */}
              <div 
                onClick={() => navigate('/profile/settings')}
                className="flex items-center justify-between py-4 border-b border-gray-50 cursor-pointer hover:opacity-70"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
                    <ProfileIcon />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Profile Settings</span>
                </div>
                <ArrowRight />
              </div>

              {/* Notification Settings */}
              <div 
                onClick={() => navigate('/profile/notifications')}
                className="flex items-center justify-between py-4 border-b border-gray-50 cursor-pointer hover:opacity-70"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
                    <BellIcon />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-800">Notification Settings</span>
                    </div>
                </div>
                <ArrowRight />
              </div>

              {/* Activity History */}
              <div 
                onClick={() => navigate('/profile/history')}
                className="flex items-center justify-between py-4 cursor-pointer hover:opacity-70"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
                    <HistoryIcon />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Activity History</span>
                </div>
                <ArrowRight />
              </div>

            </div>
          </div>

          {/* MUSIC */}
          <div className="flex flex-col mb-8">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider pl-2 mb-2">MUSIC</span>
            
            <div className="bg-white border border-gray-100 rounded-[22px] shadow-sm overflow-hidden flex flex-col px-4">
              
              {/* Your Library */}
              <div 
                onClick={() => navigate('/storage')}
                className="flex items-center justify-between py-4 cursor-pointer hover:opacity-70"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#F3E8FF] flex items-center justify-center">
                    <LibraryIcon />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">Your Library</span>
                </div>
                <ArrowRight />
              </div>

            </div>
          </div>

          {/* 로그아웃 버튼 */}
          <div className="w-full px-2 mt-2 mb-6">
            <button 
              onClick={() => setIsLogoutModalOpen(true)} // 💡 모달 트리거 활성화
              className="w-full bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs font-semibold py-3.5 rounded-2xl transition-colors cursor-pointer focus:outline-none"
            >
              Log Out
            </button>
          </div>

        </main>

        {/* 로그아웃 모달*/}
        {isLogoutModalOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6"
            onClick={() => setIsLogoutModalOpen(false)} // 외부 배경 터치 시 닫기
          >
            <div 
              className="bg-white w-full max-w-xs rounded-[24px] p-6 flex flex-col items-center text-center shadow-xl"
              onClick={(e) => e.stopPropagation()} // 내부 클릭 시 꺼짐 방지
            >
              <h3 className="text-sm font-bold text-gray-900 mb-1">MeloVoyage 로그아웃</h3>
              <p className="text-[11px] text-gray-400 font-medium mb-6">정말 로그아웃 하시겠습니까?</p>
              
              <div className="flex w-full gap-2.5">
                <button 
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-3 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}