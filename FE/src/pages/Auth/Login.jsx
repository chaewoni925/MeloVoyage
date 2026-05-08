import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-[390px] h-[844px] bg-white shadow-xl rounded-[40px] overflow-hidden flex flex-col justify-between p-6 border border-gray-200">
        
        <div className="h-12 flex items-center">
          <button onClick={() => navigate('/')} className="text-gray-800 hover:text-black font-bold text-xl p-1">
            ＜
          </button>
        </div>

        {/* 로그인 폼 */}
        <div className="flex-1 flex flex-col justify-between px-2 pt-4">
          <div>
            <h2 className="text-xl font-bold text-black mb-10 leading-snug">
              이메일과 비밀번호를<br />입력하세요
            </h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">이메일</label>
                <input type="email" className="w-full py-2 bg-transparent text-sm focus:outline-none text-black placeholder-gray-300" placeholder="example@email.com" />
              </div>

              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">비밀번호</label>
                <input type="password" className="w-full py-2 bg-transparent text-sm focus:outline-none text-black placeholder-gray-300" placeholder="••••••••" />
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400">비밀번호를 잊으셨나요? </span>
                <button type="button" className="text-[10px] text-gray-700 font-bold underline">비밀번호 재설정</button>
              </div>
            </form>
          </div>

          {/* 하단 버튼 */}
          <div className="space-y-8 mt-6">
            <button className="w-full bg-[#D1D5DB] text-white py-3.5 rounded-xl font-bold transition-all hover:bg-[#A3A3A3]">
              로그인
            </button>

            <div className="space-y-4">
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-3 text-[10px] text-gray-400 whitespace-nowrap">간편 로그인</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>
              
             {/*간편로그인*/}
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-300 mt-4">━</div>
      </div>
    </div>
  );
}