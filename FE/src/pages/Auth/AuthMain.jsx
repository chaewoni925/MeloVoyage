import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoWhite from '../../assets/logo_white.svg';
import logo from '../../assets/logo.svg';


export default function AuthMain() {
  const [step, setStep] = useState(1); // 1: 시작화면, 2: 로그인 선택 화면
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
    <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col font-sans selection:bg-purple-200 overflow-hidden">
      
      {step === 1 && (
        <div 
          className="absolute inset-0 bg-[#7C3AED] flex flex-col justify-center items-center cursor-pointer z-50 select-none"
          onClick={() => setStep(2)}
        >
          <div className="w-full flex justify-center">
            <img src={logoWhite} alt="MeloVoyage" className="w-56 h-56 object-contain translate-x-8" />
          </div>
        </div>
      )}
      <div className="h-12" /> 

      <main className="flex-1 mt-1 -mx-6 -mt-10 px-6 pt-16 flex flex-col justify-center items-center overflow-y-auto no-scrollbar">          
          {/* 중앙 로고 및 타이틀 */}

          <div className="flex flex-col items-center mb-12">
            <div className="w-full flex justify-center">
              <img src={logo} alt="MeloVoyage" className="w-50 h-50 object-contain translate-x-8" />
            </div>
            <p className="text-gray-400 text-sm -mt-5">음악과 함께하는 나만의 여행</p>
          </div>

          {/* 하단 버튼 묶음 */}
          <div className="w-full space-y-4 px-6">
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