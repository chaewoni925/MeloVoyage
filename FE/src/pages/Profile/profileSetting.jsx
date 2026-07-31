// src/pages/profile/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import instance from '../../api/axios';

export default function ProfileSettings() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 기존 프로필 정보 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await instance.get('/users/mypage');
        const data = res.data.data;
        setNickname(data.nickname);
        setOriginalNickname(data.nickname);
        setEmail(data.email);
        setProfileImage(data.profileImage);
      } catch (error) {
        console.error('프로필 조회 실패:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const isChanged = nickname !== originalNickname;
  const isValid = nickname.trim().length >= 2;

  const handleSave = async () => {
    if (!isChanged || !isValid || loading) return;

    setLoading(true);
    try {
      const res = await instance.patch('/users/mypage', { nickname });
      setOriginalNickname(res.data.data.nickname);
      alert('프로필이 수정되었습니다.');
      navigate('/profile');
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert(error.response?.data?.message || '수정에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="bg-white p-6 rounded-b-3xl flex flex-col w-full max-w-md relative font-sans min-h-screen pb-16 selection:bg-purple-200 overflow-hidden">
        
        {/* 상단 헤더 */}
        <Header showLogo={false} title="Profile Settings" />

        <main className="flex-1 flex flex-col overflow-y-auto pr-0.5 mt-6">

          {fetching ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-gray-400">불러오는 중...</p>
            </div>
          ) : (
            <>
              {/* 프로필 이미지 영역 */}
              <div className="flex flex-col items-center text-center mt-2 mb-10">
                <div className="w-20 h-20 bg-[#F3E8FF] rounded-full flex items-center justify-center mb-3 shadow-sm overflow-hidden relative">
                  {profileImage ? (
                    <img src={profileImage} alt="프로필" className="w-full h-full object-cover" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-9 h-9 text-[#7C3AED]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/storage')}
                  className="text-[11px] text-[#7C3AED] font-semibold underline cursor-pointer focus:outline-none"
                >
                  사진 변경
                </button>
              </div>

              {/* 입력 폼 */}
              <div className="space-y-6">
                <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                  <label className="text-[11px] text-gray-400 block font-medium">닉네임</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-300"
                    placeholder="닉네임을 입력해주세요"
                  />
                </div>

                <div className="relative border-b border-gray-100">
                  <label className="text-[11px] text-gray-400 block font-medium">이메일</label>
                  <p className="w-full py-2 bg-transparent text-sm text-gray-400">
                    {email}
                  </p>
                </div>
              </div>

              {/* 저장 버튼 */}
              <div className="mt-auto pt-10 pb-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!isChanged || !isValid || loading}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all text-white focus:outline-none cursor-pointer
                    ${(isChanged && isValid && !loading) ? 'bg-[#7C3AED] hover:bg-[#6D28D9]' : 'bg-[#D1D5DB] cursor-not-allowed'}`}
                >
                  {loading ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}