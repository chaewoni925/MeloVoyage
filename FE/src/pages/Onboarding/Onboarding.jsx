import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import instance from '../../api/axios';
import searchIcon from '../../assets/search.png';

export default function Onboarding() {
  const location = useLocation();
  const isEditMode = location.state?.editMode === true;

  const [step, setStep] = useState(isEditMode ? 2 : 1); // 수정모드면 장르선택부터 시작
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // 아티스트 검색용 상태 추가
  const [loading, setLoading] = useState(false);     // 런타임 에러 방지를 위한 로딩 상태 추가
  const navigate = useNavigate();
  
   // 장르 목록 (DB 연동)
  const [genres, setGenres] = useState([]);
 
  // 아티스트 목록 (DB 연동)
  const [artists, setArtists] = useState([]);

  const [hasExistingPreferences, setHasExistingPreferences] = useState(false);

  useEffect(() => {
    instance.get('/onboarding/genres').then(res => {
      setGenres(res.data.genres);
    });
 
    instance.get('/onboarding/artists').then(res => {
      setArtists(res.data.artists);
    });

    // 수정모드
    if (isEditMode) {
    instance.get('/onboarding/preferences')
      .then(res => {
        const { genres, artistSeeds } = res.data.data;
        setSelectedGenres(genres || []);
        setSelectedArtists(artistSeeds || []);
        setHasExistingPreferences(true); // 기존 데이터 있음 확인
      })
      .catch(err => {
        console.error('기존 선호 데이터 조회 실패:', err);
        setHasExistingPreferences(false); // 없으면 false 유지
      });
      }
    }, [isEditMode]);

  // 검색어에 따라 아티스트 필터링
  // artist 객체 형태: { artist: "이름", albumImageUrl: "..." } - id 필드 없음
  const filteredArtists = artists.filter(item =>
    item.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // 아티스트는 id 대신 이름(artist) 자체를 식별자로 사용
  const toggleArtist = (artistName) => {
    if (selectedArtists.includes(artistName)) {
      setSelectedArtists(selectedArtists.filter(a => a !== artistName));
    } else {
      setSelectedArtists([...selectedArtists, artistName]);
    }
  };

  // 온보딩 데이터 서버 전송 함수
  const handleComplete = async () => {
    if (loading) return; // 중복 제출 방지
    setLoading(true);
    
    try {
      const payload = { genres: selectedGenres, artistSeeds: selectedArtists };

      // 기존 데이터가 실제로 있을 때만 PATCH, 없으면 POST
    if (isEditMode && hasExistingPreferences) {
      await instance.patch('/onboarding/preferences', payload);
      alert("취향이 수정되었습니다!");
      navigate('/profile');
    } else {
      await instance.post('/onboarding/preferences', payload);
      alert(isEditMode ? "취향이 저장되었습니다!" : "온보딩 완료! 음악 여행을 시작합니다.");
      navigate(isEditMode ? '/profile' : '/Music');
    }
  } catch (error) {
    console.error("온보딩 저장 실패:", error);
    alert(error.response?.data?.message || "선호도 저장에 실패했습니다. 다시 시도해 주세요.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
    <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden font-sans selection:bg-purple-200">
      
      {/* 상단 프로그레스 바 영역 */}
      <div className="w-full px-6 pt-4 flex-shrink-0">
        <div className="w-full h-1 bg-gray-100 rounded-full mb-2 overflow-hidden">
          <div 
            className="h-full bg-[#7C3AED] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        <div className="text-right text-[10px] text-gray-400 font-bold mb-2">{step}/3</div>
      </div>

      <main className="flex-1 -mx-0 px-6 pt-4 flex flex-col overflow-y-auto no-scrollbar">

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // 검색 가동
                  className="w-full bg-white border border-gray-100 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#7C3AED] shadow-sm"
                />
              </div>

              {/* 필터링된 아티스트 목록 렌더링 */}
              <div className="grid grid-cols-3 gap-y-6 gap-x-4 overflow-y-auto max-h-[340px] pr-1 pb-4 scrollbar-hide">
                {filteredArtists.map((item) => (
                  <div 
                    key={item.artist} 
                    onClick={() => toggleArtist(item.artist)}
                    className="flex flex-col items-center cursor-pointer group"
                  >
                    <div className={`relative w-18 h-18 rounded-full overflow-hidden mb-2 border-2 transition-all ${
                      selectedArtists.includes(item.artist) ? "border-[#7C3AED] scale-105 shadow-md" : "border-transparent"
                    }`}>
                      <img src={item.albumImageUrl} alt={item.artist} className="w-full h-full object-cover" />
                      {selectedArtists.includes(item.artist) && (
                        <div className="absolute inset-0 bg-[#7C3AED]/20 flex items-center justify-center text-white font-bold text-base rounded-full">✓</div>
                      )}
                    </div>
                    <span className={`text-[10px] text-center truncate w-full ${selectedArtists.includes(item.artist) ? "text-[#7C3AED] font-bold" : "text-gray-600"}`}>
                      {item.artist}
                    </span>
                  </div>
                ))}
                {filteredArtists.length === 0 && (
                  <div className="col-span-3 text-center text-gray-400 text-xs py-8">검색 결과가 없습니다.</div>
                )}
              </div>

              {/* handleComplete 함수 연결 및 로딩 처리 */}
              <button 
                onClick={handleComplete}
                disabled={loading}
                className={`w-full text-white py-4 rounded-xl font-bold shadow-md transition-all mt-auto mb-4 cursor-pointer focus:outline-none ${
                  loading ? "bg-purple-400 cursor-not-allowed" : "bg-[#7C3AED] hover:bg-[#6D28D9]"
                }`}
              >
                {loading ? "저장 중..." : (isEditMode ? "수정 완료" : "완료하기")}
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}