import React, { useState } from 'react'; // useState import 추가
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import googleIcon from '../../assets/Google.png';
import naverIcon from '../../assets/NAVER.png';
import kakaoIcon from '../../assets/kakao.png';

export default function Login() {
  const navigate = useNavigate();

  // 입력값 저장할 state 생성
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault(); // form 제출 시 새로고침 방지
    
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/auth/login', {
        email: email,
        password: password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token); // 로컬에 토큰 저장
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // 기본값
        
        alert('로그인 성공!');
        navigate('/Music'); // 로그인 성공 후 이동
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      alert(error.response?.data?.message || '로그인에 실패했습니다. 다시 시도해 주세요.');
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

        {/* onSubmit에 handleLogin을 직접 연결하여 엔터키 제출 활성화 */}
        <main className="flex-1 mt-1 -mx-6 px-6 pt-8 flex flex-col justify-between overflow-y-auto">
          
          {/* 로그인 폼 */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-10 leading-snug">
              이메일과 비밀번호를<br />입력하세요
            </h2>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">이메일</label>
                <input 
                  type="email" 
                  value={email} // 상태(state) 바인딩
                  onChange={(e) => setEmail(e.target.value)} // 4. 입력값 반영
                  className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-300" 
                  placeholder="example@email.com" 
                  required
                />
              </div>

              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">비밀번호</label>
                <input 
                  type="password" 
                  value={password} // 상태(state) 바인딩
                  onChange={(e) => setPassword(e.target.value)} // 4. 입력값 반영
                  className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-300" 
                  placeholder="••••••••" 
                  required
                />
              </div>

              <div className="text-right">
                <span className="text-[10px] text-gray-400">비밀번호를 잊으셨나요? </span>
                <button type="button" className="text-[10px] text-gray-600 font-bold underline cursor-pointer focus:outline-none">비밀번호 재설정</button>
              </div>

              {/* 로그인 버튼을 form 내부로 이동하여 submit 트리거 확보 및 활성화 조건 적용 */}
              <div className="space-y-6 mt-6 pb-6">
                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all text-white focus:outline-none cursor-pointer
                    ${(email && password) ? 'bg-[#7C3AED] hover:bg-[#6D28D9]' : 'bg-[#D1D5DB]'}`}
                >
                  {loading ? '로그인 중...' : '로그인'}
                </button>
              </div>
            </form>
          </div>

          {/* 간편 로그인 영역 */}
          <div className="space-y-4 pb-6">
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-[10px] text-gray-400 whitespace-nowrap">간편 로그인</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            
            {/* 간편 로그인 버튼들 */}
            <div className="flex justify-center gap-6">
              <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer focus:outline-none hover:opacity-80 transition-opacity">
                <img src={googleIcon} alt="Google" className="w-12 h-12" />
              </button>

              <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer focus:outline-none hover:opacity-80 transition-opacity">
                <img src={naverIcon} alt="Naver" className="w-12 h-12" />
              </button>

              <button type="button" className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer focus:outline-none hover:opacity-80 transition-opacity">
                <img src={kakaoIcon} alt="kakao" className="w-12 h-12" />
              </button>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}