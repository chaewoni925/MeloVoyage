// src/pages/music.jsx
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import SearchingPage from '../searching/Searching.jsx'
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";


const MusicPage = () => {
  const navigate = useNavigate();

  const popularMusic = [
    { id: 1, title: "Hype Boy", artist: "NewJeans", img: "https://via.placeholder.com/150" },
    { id: 2, title: "Ditto", artist: "NewJeans", img: "https://via.placeholder.com/150" },
    { id: 3, title: "OMG", artist: "NewJeans", img: "https://via.placeholder.com/150" }, // 스크롤 확인용 추가
    { id: 3, title: "OMG", artist: "NewJeans", img: "https://via.placeholder.com/150" } // 스크롤 확인용 추가
  ];

  const myMusic = [
    { id: 1, title: "Love Lee", artist: "AKMU", img: "https://via.placeholder.com/150" },
    { id: 2, title: "Perfect Night", artist: "LE SSERAFIM", img: "https://via.placeholder.com/150" },
    { id: 3, title: "Drama", artist: "aespa", img: "https://via.placeholder.com/150" }, // 스크롤 확인용 추가
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="bg-white p-6 rounded-b-3xl w-full max-w-md relative">
        <Header />

        {/* 검색바 잠시 비활성화함 수정 예정 */}
        {/*<main className="space-y-6 mt-1 bg-[#FCF9F8] -mx-6 px-6 pt-6 pb-20">
          <SearchBar placeholder="어떤 음악을 찾으시나요?" />  </main>*/}

          {/* 인기 음악 */}
          <section>
            <h1 className="text-[20px] font-bold mb-4">인기 음악</h1>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
              {popularMusic.map((music) => (
                <div
                  key={music.id}
                  className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg flex-shrink-0 w-[180px] shadow-sm snap-start"
                >
                  <img src={music.img} alt={music.title} className="w-full h-32 object-cover rounded-md" />
                  <div className="mt-2">
                    <p className="font-bold text-sm truncate">{music.title}</p>
                    <p className="text-xs text-gray-500">{music.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 내 음악 */}
          <section>
            <h1 className="text-[20px] font-bold mb-4">내 음악</h1>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
              {myMusic.map((music) => (
                <div
                  key={music.id}
                  className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg flex-shrink-0 w-[180px] shadow-sm snap-start"
                >
                  <img src={music.img} alt={music.title} className="w-full h-32 object-cover rounded-md" />
                  <div className="mt-2">
                    <p className="font-bold text-sm truncate">{music.title}</p>
                    <p className="text-xs text-gray-500">{music.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 사용자 참여형 */}
          <section>
            <h1 className="text-[20px] font-bold mb-4">사용자 참여형(논의필요)</h1>
            <div className="overflow-x-auto no-scrollbar">
              <div className="cursor-pointer bg-purple-100 p-4 rounded-lg h-32 w-full min-w-[300px]"></div>
            </div>
          </section>
       
        <Footer />
      </div>
    </div>
  );
};

export default MusicPage;