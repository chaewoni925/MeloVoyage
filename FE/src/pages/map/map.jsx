import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import PlaceCarousel from "../map/PlaceCarousel";
import MyPlaylistEmptyState from "../../components/MyPlaylistEmptyState.jsx";
import { fetchPopularPlaces, fetchMyPlaces } from "../../api/map";

const FALLBACK_IMG = "/images/place-placeholder.png"; // 실제 placeholder 경로로 교체 필요

const mapPlace = (place) => ({
  id: place.id,
  title: place.name,
  desc: place.moodTags?.length > 0 ? place.moodTags.join(", ") : place.address,
  img: place.photoUrl || FALLBACK_IMG,
});

const MapPage = () => {
  const navigate = useNavigate();
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [myPlaces, setMyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadPlaces = async () => {
    setLoading(true);

    const [popularResult, myPlacesResult] = await Promise.allSettled([
      fetchPopularPlaces(),
      fetchMyPlaces(),
    ]);

    if (popularResult.status === "fulfilled") {
      const shuffled = [...(popularResult.value.destinations || [])].sort(() => Math.random() - 0.5);
      setPopularPlaces(shuffled.map(mapPlace));
    } else {
      console.error("인기 여행지 조회 실패:", popularResult.reason);
    }

    if (myPlacesResult.status === "fulfilled") {
      setMyPlaces((myPlacesResult.value.destinations || []).map(mapPlace));
    } else {
      console.error("내 여행지 조회 실패:", myPlacesResult.reason);
      setMyPlaces([]);
    }

    setLoading(false);
  };

  loadPlaces();
}, []);

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
        <div className="flex-1 overflow-y-auto no-scrollbar mt-[-30px] p-4 sm:p-6 pt-0 pb-6">
          <PlaceCarousel title="인기 여행지" places={popularPlaces} onCardClick={handlePlaceClick} />

          {myPlaces.length > 0 ? (
            <div className="mt-2">
              <PlaceCarousel title="내 여행지" places={myPlaces} onCardClick={handlePlaceClick} shadow />
            </div>
          ) : (
            <section className="px-2 mt-[15px]">
              <h1 className="text-lg sm:text-xl font-bold mb-3">내 여행지</h1>
              <MyPlaylistEmptyState />
            </section>
          )}
        </div>

        {/* 하단 푸터 (고정) */}
        <Footer />
      </div>
    </div>
  );
};

export default MapPage;