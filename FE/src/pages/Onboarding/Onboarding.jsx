import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [step, setStep] = useState(1); // 1, 2, 3 단계
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const navigate = useNavigate();

  const genres = ["재즈", "로파이", "팝", "락", "힙합", "클래식", "R&B", "일렉트로닉", "인디", "어쿠스틱"];
  
  // 예시 아티스트 데이터
  const artists = [
    { id: 1, name: "Taylor Swift", img: "https://via.placeholder.com/100" },
    { id: 2, name: "Jay Chou", img: "https://via.placeholder.com/100" },
    { id: 3, name: "The Weeknd", img: "https://via.placeholder.com/100" },
    { id: 4, name: "IU", img: "https://via.placeholder.com/100" },
    { id: 5, name: "NewJeans", img: "https://via.placeholder.com/100" },
    { id: 6, name: "BTS", img: "https://via.placeholder.com/100" },
  ];

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const toggleArtist = (id) => {
    if (selectedArtists.includes(id)) {
      setSelectedArtists(selectedArtists.filter(a => a !== id));
    } else {
      setSelectedArtists([...selectedArtists, id]);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
      <div className="relative w-full max-w-[390px] h-[844px] bg-white shadow-xl rounded-[40px] overflow-hidden flex flex-col p-8 border border-gray-200">
        
        {/* 상단 바 & 단계 표시 */}
        <div className="w-full h-1 bg-gray-100 rounded-full mb-2 overflow-hidden">
          <div 
            className="h-full bg-[#7C3AED] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <div className="text-right text-[10px] text-gray-400 font-bold mb-10">{step}/3</div>

        {/* ------------------1: 온보딩 시작 ------------------ */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-black leading-tight mb-4">
              어떤 음악이<br />당신의 여행을 닮았나요?
            </h1>
            <p className="text-gray-400 text-xs leading-relaxed mb-12">
              몇 가지 질문에 답해주시면, 같은 여행지라도 당신만의 분위기로 플레이리스트를 만들어 드립니다.
            </p>
            <button 
              onClick={() => setStep(2)}
              className="w-full bg-[#7C3AED] text-white py-4 rounded-xl font-bold shadow-md hover:bg-[#6D28D9] transition-all mt-auto mb-4"
            >
              시작하기
            </button>
          </div>
        )}

        {/* ------------------ 2: 장르 선택 ------------------ */}
        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-bold text-black mb-2">평소 즐겨 듣는 장르를 골라주세요</h1>
            <p className="text-gray-400 text-xs mb-10">여러 개를 골라도 좋아요</p>
            
            <div className="grid grid-cols-2 gap-3 mb-10">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all ${
                    selectedGenres.includes(genre) 
                    ? "bg-[#7C3AED] border-[#7C3AED] text-white shadow-md" 
                    : "bg-white border-gray-200 text-gray-500 hover:border-[#7C3AED]"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <button 
              disabled={selectedGenres.length === 0}
              onClick={() => setStep(3)}
              className={`w-full py-4 rounded-xl font-bold shadow-md transition-all mt-auto mb-4 ${
                selectedGenres.length > 0 ? "bg-[#7C3AED] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              다음
            </button>
          </div>
        )}

        {/* -----------------3: 아티스트 선택 ------------------ */}
        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-bold text-black mb-2">좋아하는 아티스트가 있나요?</h1>
            <p className="text-gray-400 text-xs mb-8">비슷한 무드의 곡을 추천하는 데 사용해요.</p>
            
            {/* 검색창 */}
            <div className="relative mb-8">
              <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
              <input 
                type="text" 
                placeholder="검색" 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#7C3AED]"
              />
            </div>

            <div className="grid grid-cols-3 gap-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {artists.map((artist) => (
                <div 
                  key={artist.id} 
                  onClick={() => toggleArtist(artist.id)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className={`relative w-20 h-20 rounded-full overflow-hidden mb-2 border-2 transition-all ${
                    selectedArtists.includes(artist.id) ? "border-[#7C3AED] scale-105 shadow-lg" : "border-transparent"
                  }`}>
                    <img src={artist.img} alt={artist.name} className="w-full h-full object-cover" />
                    {selectedArtists.includes(artist.id) && (
                      <div className="absolute inset-0 bg-[#7C3AED]/20 flex items-center justify-center text-white font-bold text-xl">✓</div>
                    )}
                  </div>
                  <span className={`text-[10px] text-center ${selectedArtists.includes(artist.id) ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>
                    {artist.name}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => {
                alert("온보딩 완료! 음악 여행을 시작합니다.");
                navigate('/Music'); // 완료 후 홈으로 이동
              }}
              className="w-full bg-[#7C3AED] text-white py-4 rounded-xl font-bold shadow-md hover:bg-[#6D28D9] transition-all mt-auto mb-4"
            >
              시작하기
            </button>
          </div>
        )}

      </div>
    </div>
  );
}