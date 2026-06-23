import React from 'react';
import { useNavigate } from 'react-router-dom';
import googleIcon from '../../assets/Google.png';
import naverIcon from '../../assets/NAVER.png';
import kakaoIcon from '../../assets/kakao.png';

export default function Login() {
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

        <main className="flex-1 mt-1 bg-[#FCF9F8] -mx-6 px-6 pt-8 flex flex-col justify-between overflow-y-auto">
          
          {/* 로그인 폼 */}
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
                  placeholder="••••••••" 
                />
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400">비밀번호를 잊으셨나요? </span>
                <button type="button" className="text-[10px] text-gray-600 font-bold underline cursor-pointer focus:outline-none">비밀번호 재설정</button>
              </div>
            </form>
          </div>

          {/* 하단 버튼 및 간편 로그인 영역 */}
          <div className="space-y-6 mt-6 pb-6">
            <button className="w-full bg-[#D1D5DB] text-white py-3.5 rounded-xl font-bold transition-all hover:bg-[#A3A3A3] cursor-pointer focus:outline-none">
              로그인
            </button>

            <div className="space-y-4">
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-[10px] text-gray-400 whitespace-nowrap">간편 로그인</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>
              
              {/* 간편 로그인 버튼들 */}
              <div className="flex justify-center gap-6">
                <button className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer focus:outline-none hover:opacity-80 transition-opacity">
                  <img src={googleIcon} alt="Google" className="w-12 h-12" />
                </button>

                <button className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer focus:outline-none hover:opacity-80 transition-opacity">
                  <img src={naverIcon} alt="Naver" className="w-12 h-12" />
                </button>

                <button className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer focus:outline-none hover:opacity-80 transition-opacity">
                  <img src={kakaoIcon} alt="kakao" className="w-12 h-12" />
                </button>
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}