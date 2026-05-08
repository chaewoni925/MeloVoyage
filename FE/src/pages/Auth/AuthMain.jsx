import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthMain() {
  const [step, setStep] = useState(1); // 1: 시작화면, 2: 로그인 선택 화면
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative w-full max-w-[390px] h-[844px] bg-white shadow-xl rounded-[40px] overflow-hidden flex flex-col justify-between p-6 border border-gray-200">
        
        {step === 1 && (
          <div 
            className="absolute inset-0 bg-[#7C3AED] flex flex-col justify-center items-center cursor-pointer z-50 select-none"
            onClick={() => setStep(2)}
          >
            <div className="w-24 h-24 bg-gray-300 flex items-center justify-center font-bold text-gray-800 text-lg mb-6">
              로고
            </div>
            <h1 className="text-white text-3xl font-bold tracking-tight">Melovoyage</h1>
          </div>
        )}

        <div className="h-12" /> 

        {/* 2 */}
        <div className="flex-1 flex flex-col justify-center items-center px-4">
          <div className="w-20 h-20 bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-700 mb-4">
            로고
          </div>
          <h2 className="text-2xl font-bold text-black tracking-tight">Melovoyage</h2>
          <p className="text-gray-600 text-sm mt-2 mb-16">설명 문구?</p>

          <div className="w-full space-y-4">
            {/* 시작하기 */}
            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-[#7C3AED] text-white py-3.5 rounded-xl font-bold shadow-sm hover:bg-[#6D28D9] transition-all"
            >
              시작하기
            </button>
            
            <div className="text-center text-xs text-gray-500">
              이미 계정이 있나요?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-[#7C3AED] font-bold underline ml-1"
              >
                로그인
              </button>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-300 mt-4">━</div>
      </div>
    </div>
  );
}