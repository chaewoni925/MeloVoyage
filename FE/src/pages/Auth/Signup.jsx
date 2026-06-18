import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center">
      
     <div className="bg-white p-6 rounded-b-3xl flex flex-col w-full max-w-md relative font-sans selection:bg-purple-200 overflow-hidden min-h-screen pb-16">
        
        {/* 상단 뒤로가기 영역 */}
        <div className="h-12 flex items-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-purple-600 hover:opacity-70 font-bold text-2xl p-1 cursor-pointer focus:outline-none"
          >
            &#60;
          </button>
        </div>

        <main className="flex-1 mt-1 bg-[#FCF9F8] -mx-6 px-6 pt-8 flex flex-col justify-between">
          
          {/* 회원가입 폼 */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-10 leading-snug">
              이메일과 비밀번호를<br />입력하세요
            </h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">이메일</label>
                <input 
                  type="email" 
                  className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-300" 
                  placeholder="example@email.com" 
                />
              </div>

              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">비밀번호</label>
                <input 
                  type="password" 
                  className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-300" 
                  placeholder="8자리 이상 입력해주세요" 
                />
              </div>
            </form>
          </div>

          {/* 회원가입 버튼 영역 (하단 고정 및 여백 조절) */}
          <div className="mt-6 pb-6">
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full bg-[#D1D5DB] text-white py-3.5 rounded-xl font-bold transition-all hover:bg-[#A3A3A3] cursor-pointer focus:outline-none"
            >
              회원가입
            </button>
          </div>
        </main>

      </div>
    </div>
  );
}