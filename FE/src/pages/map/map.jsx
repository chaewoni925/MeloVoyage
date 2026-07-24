// src/pages/map.jsx
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";

const MapPage = () => {
  const navigate = useNavigate();

// TODO: 백엔드 붙으면 GET /places/popular 응답으로 교체
// 배열에 항목을 추가/삭제하면 카드 개수는 자동으로 그만큼 늘어나거나 줄어듦 (map 렌더링이라 별도 수정 불필요)
const MOCK_POPULAR_PLACES = [
    { id: 1, title: "제주도", desc: "푸른 바다와 함께", img: "https://via.placeholder.com/150" },
    { id: 2, title: "강릉", desc: "커피와 파도 소리", img: "https://via.placeholder.com/150" },
    { id: 3, title: "부산", desc: "활기찬 해운대", img: "https://via.placeholder.com/150" },
];

  // 목 데이터 정의
  const popularPlaces = [
    { id: 1, title: "제주도", desc: "푸른 바다와 함께", img: "https://via.placeholder.com/150" },
    { id: 2, title: "강릉", desc: "커피와 파도 소리", img: "https://via.placeholder.com/150" },
    { id: 3, title: "부산", desc: "활기찬 해운대", img: "https://via.placeholder.com/150" },
  ];

  const myPlaces = [
    { id: 1, title: "나의 아지트", desc: "조용한 공원", img: "https://via.placeholder.com/150" },
    { id: 2, title: "자주 가는 카페", desc: "단골 카페", img: "https://via.placeholder.com/150" },
    { id: 3, title: "최애 바다", desc: "혼자 힐링", img: "https://via.placeholder.com/150" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="bg-white p-6 rounded-b-3xl w-full max-w-md relative">
        <Header />

        <div className="mt-[20px] mb-6">
          <SearchBar placeholder="어떤 여행지를 찾으시나요?" />
        </div>

        {/* 인기 여행지 */}
        <section className="pl-2 pr-2">
          <h1 className="text-[20px] font-bold mt-[5px] mb-[10px]">인기 여행지</h1>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-2">
            {popularPlaces.map((place) => (
              <div key={place.id} className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg flex-shrink-0 w-[160px] snap-start">
                <img src={place.img} alt={place.title} className="w-full h-32 object-cover rounded-md" />
                <p className="font-bold text-sm mt-2">{place.title}</p>
                <p className="text-xs text-gray-600">{place.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 내 여행지 */}
        <section className=" pr-2 pl-2">

          <h1 className=" text-[20px] font-bold mt-[10px] mb-[10px]">내 여행지</h1>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
            {myPlaces.map((place) => (
              <div 
              key={place.id} 
              className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg flex-shrink-0 w-[160px] shadow-smsnap-start"
              >
                <img src={place.img} alt={place.title} className="w-full h-32 object-cover rounded-md" />
                <div className="mt-2">
                <p className="font-bold text-sm truncate">{place.title}</p>
                <p className="text-xs text-gray-500">{place.desc}</p>
              </div>
              </div>
            ))}
          </div>
        </section>

        {/* 사용자 참여형 
        <section className="px-2 mb-20">
          <h1 className="text-[20px] font-bold mt-[10px] mb-4">사용자 참여형</h1>
          <div className="cursor-pointer bg-purple-100 p-4 rounded-lg h-32 w-full"></div>
        </section> */}

        <Footer />
      </div>
    </div>
  );
};

export default MapPage;