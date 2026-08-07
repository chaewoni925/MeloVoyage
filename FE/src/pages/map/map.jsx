import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import PlaceCarousel from "../map/PlaceCarousel";
import { MOCK_POPULAR_PLACES, MOCK_MY_PLACES } from "../../api/mock/mockMap";

const MapPage = () => {
  
  // 카드 클릭시 이동 예정
  const navigate = useNavigate();

  const handleSearch = (keyword) => {
    console.log("검색 실행:", keyword);
  }; // 여기서 API 호출 예정

  const handlePlaceClick = (place) => {
    // navigate(`/map/${place.id}`); 라우팅 미구현
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
      <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden">

        {/* 상단 영역 (고정) */}
        <div className="p-4 sm:p-6 pb-2">
          <Header />
          <div className="mt-4 sm:mt-5">
            <SearchBar placeholder="어떤 여행지를 찾으시나요?" onSearch={handleSearch} />
          </div>
        </div>

        {/* 중간 콘텐츠 영역 (스크롤) */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 pt-0 pb-6">
          <PlaceCarousel title="인기 여행지" places={MOCK_POPULAR_PLACES} onCardClick={handlePlaceClick} />
          <div className="mt-8">
            <PlaceCarousel title="내 여행지" places={MOCK_MY_PLACES} onCardClick={handlePlaceClick} shadow />
          </div>
        </div>

        {/* 하단 푸터 (고정) */}
        <Footer />
      </div>
    </div>
  );
};

export default MapPage;