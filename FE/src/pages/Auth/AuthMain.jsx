import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthMain() {
  const [step, setStep] = useState(1); // 1: 시작화면, 2: 로그인 선택 화면
  const navigate = useNavigate();

  return (
    //바깥쪽 전체 회색 배경 + 가로 중앙 정렬 통일
    <div className="min-h-screen bg-gray-100 flex justify-center">
      
      {/* 본문 메인 틀과 싱크 맞춤) */}
      <div className="bg-white p-6 rounded-b-3xl flex flex-col w-full max-w-md relative font-sans selection:bg-purple-200 overflow-hidden min-h-screen pb-16">
        
        {step === 1 && (
          <div 
            className="absolute inset-0 bg-[#7C3AED] flex flex-col justify-center items-center cursor-pointer z-50 select-none rounded-b-3xl"
            onClick={() => setStep(2)}
          >
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-white text-lg mb-6 shadow-sm">
              로고
            </div>
            <h1 className="text-white text-3xl font-bold tracking-tight">Melovoyage</h1>
          </div>
        )}

        <div className="h-12" /> 

        <main className="flex-1 mt-1 -mx-6 -mt-18 px-6 pt-16 flex flex-col justify-center items-center">
          
          {/* 중앙 로고 및 타이틀 */}
          <div className="flex flex-col items-center mb-12">
            <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center text-sm font-bold text-gray-500 mb-4 shadow-sm">
              로고
            </div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Melovoyage</h2>
            <p className="text-gray-400 text-sm mt-1.5">음악과 함께하는 나만의 여행</p>
          </div>

          {/* 하단 버튼 묶음 */}
          <div className="w-full space-y-4 px-2">
            {/* 시작하기 */}
            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-[#7C3AED] text-white py-3.5 rounded-xl font-bold shadow-sm hover:bg-[#6D28D9] transition-all cursor-pointer focus:outline-none"
            >
              시작하기
            </button>
            
            {/* 로그인 유도 */}
            <div className="text-center text-xs text-gray-500">
              이미 계정이 있나요?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-[#7C3AED] font-bold underline ml-1 cursor-pointer focus:outline-none"
              >
                로그인
              </button>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}