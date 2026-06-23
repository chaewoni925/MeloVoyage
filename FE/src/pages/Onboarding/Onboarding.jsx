import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '../../assets/search.png';

export default function Onboarding() {
  const [step, setStep] = useState(1); // 1, 2, 3 단계
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const navigate = useNavigate();

  const genres = ["재즈", "로파이", "팝", "락", "힙합", "클래식", "R&B", "일렉트로닉", "인디", "어쿠스틱"];
  
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
    <div className="min-h-screen bg-gray-100 flex justify-center">
      
      <div className="bg-white p-6 rounded-b-3xl flex flex-col w-full max-w-md relative font-sans selection:bg-purple-200 overflow-hidden min-h-screen pb-16">
        
        {/* 상단 프로그레스 바 영역 */}
        <div className="w-full pt-2">
          <div className="w-full h-1 bg-gray-100 rounded-full mb-2 overflow-hidden">
            <div 
              className="h-full bg-[#7C3AED] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <div className="text-right text-[10px] text-gray-400 font-bold mb-6">{step}/3</div>
        </div>

       <main className="flex-1 bg-[#FCF9F8] -mx-6 px-6 pt-8 flex flex-col overflow-hidden rounded-b-2xl">

          {/* ------------------ 1: 온보딩 시작 ------------------ */}
          {step === 1 && (
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-4">
                어떤 음악이<br />당신의 여행을 닮았나요?
              </h1>
              <p className="text-gray-400 text-xs leading-relaxed mb-12">
                몇 가지 질문에 답해주시면, 같은 여행지라도 당신만의 분위기로 플레이리스트를 만들어 드립니다.
              </p>
              <button 
                onClick={() => setStep(2)}
                className="w-full bg-[#7C3AED] text-white py-4 rounded-xl font-bold shadow-md hover:bg-[#6D28D9] transition-all mt-auto mb-4 cursor-pointer focus:outline-none"
              >
                시작하기
              </button>
            </div>
          )}

          {/* ------------------ 2: 장르 선택 ------------------ */}
          {step === 2 && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <h1 className="text-xl font-bold text-gray-800 mb-1">평소 즐겨 듣는 장르를 골라주세요</h1>
              <p className="text-gray-400 text-xs mb-6">여러 개를 골라도 좋아요</p>
              
              <div className="grid grid-cols-2 gap-3 mb-6 overflow-y-auto max-h-[420px] pr-1 scrollbar-hide">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`py-3.5 px-4 rounded-xl text-sm font-medium border transition-all cursor-pointer focus:outline-none ${
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
                className={`w-full py-4 rounded-xl font-bold shadow-md transition-all mt-auto mb-4 focus:outline-none ${
                  selectedGenres.length > 0 ? "bg-[#7C3AED] text-white cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                다음
              </button>
            </div>
          )}

          {/* ----------------- 3: 아티스트 선택 ------------------ */}
          {step === 3 && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <h1 className="text-xl font-bold text-gray-800 mb-1">좋아하는 아티스트가 있나요?</h1>
              <p className="text-gray-400 text-xs mb-6">비슷한 무드의 곡을 추천하는 데 사용해요.</p>
              
              {/* 검색창 */}
              <div className="relative mb-6">
                <img
                  src={searchIcon}
                  alt="검색"
                  className="absolute left-4 top-4 w-4 h-4 object-contain pointer-events-none"
                />
                <input 
                  type="text" 
                  placeholder="검색" 
                  className="w-full bg-white border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#7C3AED] shadow-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-y-6 gap-x-4 overflow-y-auto max-h-[340px] pr-1 pb-4 scrollbar-hide">
                {artists.map((artist) => (
                  <div 
                    key={artist.id} 
                    onClick={() => toggleArtist(artist.id)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className={`relative w-18 h-18 rounded-full overflow-hidden mb-2 border-2 transition-all ${
                      selectedArtists.includes(artist.id) ? "border-[#7C3AED] scale-105 shadow-md" : "border-transparent"
                    }`}>
                      <img src={artist.img} alt={artist.name} className="w-full h-full object-cover" />
                      {selectedArtists.includes(artist.id) && (
                        <div className="absolute inset-0 bg-[#7C3AED]/20 flex items-center justify-center text-white font-bold text-base rounded-full">✓</div>
                      )}
                    </div>
                    <span className={`text-[10px] text-center truncate w-full ${selectedArtists.includes(artist.id) ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>
                      {artist.name}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  alert("온보딩 완료! 음악 여행을 시작합니다.");
                  navigate('/Music'); // 완료 후 홈(Music)으로 이동
                }}
                className="w-full bg-[#7C3AED] text-white py-4 rounded-xl font-bold shadow-md hover:bg-[#6D28D9] transition-all mt-auto mb-4 cursor-pointer focus:outline-none"
              >
                완료하기
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}