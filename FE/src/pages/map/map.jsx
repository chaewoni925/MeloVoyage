import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import PlaceCarousel from "../map/PlaceCarousel";
import MyPlaylistEmptyState from "../../components/MyPlaylistEmptyState.jsx";
import { fetchPopularPlaces, fetchMyPlaces } from "../../api/map";

const FALLBACK_IMG = "/images/place-placeholder.png";

const mapPlace = (place) => ({
  id: place.id,
  title: place.name,
  desc: place.moodTags?.length > 0 ? place.moodTags.join(", ") : place.address,
  img: place.photoUrl || FALLBACK_IMG,
  savedAt: place.savedAt,
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
  };

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
        <div className="flex-1 overflow-y-auto no-scrollbar mt-[-30px] p-4 sm:p-6  pb-6">
          <PlaceCarousel title="인기 여행지" places={popularPlaces} onCardClick={handlePlaceClick} />

          {myPlaces.length > 0 ? (
            <section className="pl-2 pr-2 mt-5">
              <h1 className="text-[20px] font-bold mb-[10px]">내 여행지</h1>
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
                {myPlaces.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => handlePlaceClick(place)}
                    className="cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex-shrink-0 w-40 snap-start"
                  >
                    <div className="h-36 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                      {place.img ? (
                        <img
                          src={place.img}
                          alt={place.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-3xl text-gray-300">📍</span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 truncate">{place.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {place.savedAt
                          ? new Date(place.savedAt).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : place.desc}
                      </p>
                    </div>
                  </div>
                ))}

                {/* 여행지 찾으러 가기 카드 - 항상 목록 맨 끝에 위치 */}
                <div
                  onClick={() => navigate("/search")}
                  className="flex-shrink-0 w-40 aspect-square rounded-2xl border-[1.5px] border-dashed border-[#C9B8FF] bg-[#F1ECFF] flex flex-col items-center justify-center gap-2.5 cursor-pointer snap-start"
                >
                  <div className="w-[38px] h-[38px] rounded-full bg-[#7C4DFF] text-white flex items-center justify-center text-xl leading-none">
                    +
                  </div>
                  <p className="text-[13px] font-semibold text-[#7C4DFF] text-center leading-snug">
                    내 여행지<br />찾으러 가기
                  </p>
                </div>

                {/* 여행지가 1개뿐일 때만 회색 placeholder 카드 하나 추가 */}
                {myPlaces.length === 1 && (
                  <div className="flex-shrink-0 w-40 aspect-square rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center snap-start">
                    <span className="text-2xl text-gray-300">📍</span>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="px-2 mt-[15px]">
              <h1 className="text-lg sm:text-xl font-bold mb-3">내 여행지</h1>
              <MyPlaylistEmptyState
                title="내 여행지"
                subtitle="찾으러 가기"
              />
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