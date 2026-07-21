import React, { useState } from 'react'; // useState 추가
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios 추가

export default function Signup() {
  const navigate = useNavigate();

  // 입력값 및 로딩 상태를 저장할 state 생성
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 회원가입 처리 함수 생성
  const handleSignup = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }
    if (password.length < 8) {
      alert('비밀번호는 8자리 이상 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      // 백엔드의 회원가입 API 주소로 요청
      await axios.post('/auth/signup', {
        email: email,
        password: password,
      });

      alert('회원가입이 완료되었습니다! 취향 선택(온보딩) 페이지로 이동합니다.');
      
      // 가입 성공 후, 사용자의 성향을 수집하는 온보딩 페이지로 이동
      navigate('/onboarding'); 
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert(error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

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

        {/* form 태그에 onSubmit 핸들러 연결 */}
        <main className="flex-1 mt-1 -mx-6 px-6 pt-8 flex flex-col justify-between">
          
          {/* 회원가입 폼 */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-10 leading-snug">
              이메일과 비밀번호를<br />입력하세요
            </h2>

            <form className="space-y-6" onSubmit={handleSignup}>
              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">이메일</label>
                <input 
                  type="email" 
                  value={email} // state 연결
                  onChange={(e) => setEmail(e.target.value)} // 입력값 반영
                  className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-300" 
                  placeholder="example@email.com" 
                  required
                />
              </div>

              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">비밀번호</label>
                <input 
                  type="password" 
                  value={password} // state 연결
                  onChange={(e) => setPassword(e.target.value)} // 입력값 반영
                  className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-300" 
                  placeholder="8자리 이상 입력해주세요" 
                  required
                />
              </div>

              {/* 버튼 스타일 분기 처리 */}
              <div className="mt-6 pb-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all text-white focus:outline-none cursor-pointer
                    ${(email && password.length >= 8) ? 'bg-[#7C3AED] hover:bg-[#6D28D9]' : 'bg-[#D1D5DB]'}`}
                >
                  {loading ? '가입 중...' : '회원가입'}
                </button>
              </div>
            </form>
          </div>
        </main>

      </div>
    </div>
  );
}