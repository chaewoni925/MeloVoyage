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
    // 전체 화면 배경 - 회색 배경 위에 컨텐츠를 가운데 정렬(흰색이라 구분이 안돼서 추가해둠), flex로 가로 정렬
    <div className="min-h-screen bg-gray-100 flex justify-center">

      {/*실제 모바일 화면처럼 보이도록, 헤더 제외 배경(흰색) */}
      <div className=" bg-white p-6 rounded-b-3xl w-full max-w-md relative">
        <Header />

        {/* 검색창 */}
        <div className="mt-[20px] mb-6">
          <SearchBar placeholder="어떤 여행지를 찾으시나요?" onSearch={handleSearch} />
        </div>

        {/* 인기 여행지 및 내 여행지 캐러셀 */}
        <PlaceCarousel title="인기 여행지" places={MOCK_POPULAR_PLACES} onCardClick={handlePlaceClick} />
        <PlaceCarousel title="내 여행지" places={MOCK_MY_PLACES} onCardClick={handlePlaceClick} shadow />

        <Footer />
      </div>
    </div>
  );
};

export default MapPage;