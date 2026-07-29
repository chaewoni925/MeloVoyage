import React, { useState } from 'react'; // useState 추가
import { useNavigate } from 'react-router-dom';
import instance from '../../api/axios';

export default function Signup() {
  const navigate = useNavigate();

  // 입력값 및 로딩 상태를 저장할 state 생성
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState(''); // 추가
  const [password1, setPassword1] = useState(''); // password → password1
  const [password2, setPassword2] = useState(''); // 추가
  const [loading, setLoading] = useState(false);

  // 회원가입 처리 함수 생성
  const handleSignup = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    if (!email || !nickname || !password1 || !password2) {
      alert('모든 항목을 입력해 주세요.');
      return;
    }
    if (nickname.length < 3) {
      alert('닉네임은 3자 이상 입력해 주세요.');
      return;
    }
    if (password1.length < 8) {
      alert('비밀번호는 8자리 이상 입력해 주세요.');
      return;
    }
    if (password1 !== password2) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      await instance.post('/auth/signup', {
        email: email,
        nickname: nickname,
        password1: password1,
        password2: password2,
      });

      alert('회원가입이 완료되었습니다! 취향 선택(온보딩) 페이지로 이동합니다.');
      navigate('/onboarding'); 
    } catch (error) {
      console.error('회원가입 에러:', error);
      alert(error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && nickname.length >= 3 && password1.length >= 8 && password1 === password2;

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

              {/* 닉네임 필드 추가 */}
              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">닉네임</label>
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-300" 
                  placeholder="3자 이상 입력해주세요" 
                  required
                />
              </div>

              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">비밀번호</label>
                <input 
                  type="password" 
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-300" 
                  placeholder="8자리 이상 입력해주세요" 
                  required
                />
              </div>

              {/* 비밀번호 확인 필드 추가 */}
              <div className="relative border-b border-gray-300 focus-within:border-[#7C3AED] transition-all">
                <label className="text-[11px] text-gray-400 block font-medium">비밀번호 확인</label>
                <input 
                  type="password" 
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="w-full py-2 bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-300" 
                  placeholder="비밀번호를 다시 입력해주세요" 
                  required
                />
                {password2 && password1 !== password2 && (
                  <p className="text-[10px] text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
                )}
              </div>

              {/* 버튼 스타일 분기 처리 */}
              <div className="mt-6 pb-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all text-white focus:outline-none cursor-pointer
                    ${isFormValid ? 'bg-[#7C3AED] hover:bg-[#6D28D9]' : 'bg-[#D1D5DB]'}`}
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