import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { MoreVertical, Trash2 } from "lucide-react"; // 💡 아이콘 추가
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import PlaceCarousel from "../map/PlaceCarousel";
import MyPlaylistEmptyState from "../../components/MyPlaylistEmptyState.jsx";
import { fetchPopularPlaces, fetchMyPlaces, unsavePlace } from "../../api/map"; // 💡 unsavePlace 추가
import instance from "../../api/axios";

const FALLBACK_IMG = "/images/place-placeholder.png";

const mapPlace = (place) => ({
  id: place.id || place.destinationId,
  title: place.name || place.destinationName || place.title || "여행지",
  desc: place.moodTags?.length > 0 
    ? place.moodTags.join(", ") 
    : (place.address || place.description || "감성 여행지"),
  img: place.photoUrl || place.imageUrl || place.img || FALLBACK_IMG,
  savedAt: place.savedAt,
});

const MapPage = () => {
  const navigate = useNavigate();
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [myPlaces, setMyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null); // 💡 삭제 메뉴 상태

  // 💡 마우스 드래그 스크롤 관련 상태 및 Ref
  const scrollRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
    setActiveMenuId(null);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(x - startX) > 5) {
      setIsDragging(true);
      setActiveMenuId(null);
    }
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const loadPlaces = async () => {
      setLoading(true);

      const [popularResult, myPlacesResult] = await Promise.allSettled([
        fetchPopularPlaces(),
        fetchMyPlaces(),
      ]);

      if (popularResult.status === "fulfilled") {
        const list = popularResult.value?.destinations || popularResult.value?.data || popularResult.value || [];
        const shuffled = [...list].sort(() => Math.random() - 0.5);
        setPopularPlaces(shuffled.map(mapPlace));
      } else {
        console.error("인기 여행지 조회 실패:", popularResult.reason);
      }

      if (myPlacesResult.status === "fulfilled") {
        const rawData = myPlacesResult.value;
        const list = Array.isArray(rawData) 
          ? rawData 
          : (rawData?.destinations || rawData?.data || rawData?.myPlaces || []);
        setMyPlaces(list.map(mapPlace));
      } else {
        console.error("내 여행지 조회 실패:", myPlacesResult.reason);
        setMyPlaces([]);
      }

      setLoading(false);
    };

    loadPlaces();
  }, []);

  const handleSearch = async (keyword) => {
    const query = (keyword ?? searchQuery).trim();
    if (!query) {
      alert("장소를 입력해주세요!");
      return;
    }

    try {
      const response = await instance.post(
        "/recommend/playlist",
        { destinationQuery: query },
        { withCredentials: true }
      );

      if (response.data.success) {
        const recommendationId = response.data.data.recommendationId;

        navigate(`/loading/${recommendationId}`, {
          state: { nextPath: "/searchPlaceToMusicReason" },
        });
      }
    } catch (error) {
      console.error("추천 요청 실패:", error);
      alert("추천을 불러오는데 실패했어요. 다시 시도해주세요!");
    }
  };

  // 인기 여행지 카드 클릭 시 -> 해당 여행지 음악 추천 생성 및 이동
  const handlePlaceClick = async (place) => {
    if (isDragging) return;

    const destinationName = place.title || place.name;
    if (!destinationName) return;

    try {
      const response = await instance.post(
        "/recommend/playlist",
        { destinationQuery: destinationName },
        { withCredentials: true }
      );

      if (response.data.success) {
        const recommendationId = response.data.data.recommendationId;
        navigate(`/loading/${recommendationId}`, {
          state: { nextPath: "/searchPlaceToMusicReason" },
        });
      }
    } catch (error) {
      console.error("여행지 추천 요청 실패:", error);
      navigate("/searchPlaceToMusic", { state: { destinationQuery: destinationName } });
    }
  };

  // 여행지 찾기 페이지로 이동 (/searchPlaceToMusic)
  const handleGoToSearchPlace = () => {
    if (isDragging) return;
    navigate("/searchPlaceToMusic");
  };

  // 💡 점 세개(⋮) 메뉴 토글
  const handleMenuToggle = (e, placeId) => {
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === placeId ? null : placeId));
  };

  // 💡 여행지 삭제 (DELETE /map/destinations/:id/save)
  const handleDeletePlace = async (e, placeId) => {
    e.stopPropagation();
    setActiveMenuId(null);

    if (!window.confirm("이 여행지를 내 여행지에서 삭제하시겠습니까?")) return;

    try {
      await unsavePlace(placeId);
      setMyPlaces((prev) => prev.filter((p) => p.id !== placeId));
      alert("여행지가 삭제되었습니다.");
    } catch (error) {
      console.error("여행지 삭제 실패:", error);
      alert("여행지 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8"
      onClick={() => setActiveMenuId(null)}
    >
      <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden">

        {/* 상단 영역 (고정) */}
        <div className="p-4 sm:p-6 pb-2">
          <Header />
          <div className="mt-4 sm:mt-5">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="어떤 여행지를 찾으시나요?"
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* 중간 콘텐츠 영역 (스크롤) */}
        <div className="flex-1 overflow-y-auto no-scrollbar mt-[-30px] p-4 sm:p-6 pb-6">
          <PlaceCarousel title="인기 여행지" places={popularPlaces} onCardClick={handlePlaceClick} />

          {myPlaces.length > 0 ? (
            <section className="pl-2 pr-2 mt-5">
              <div 
                onClick={handleGoToSearchPlace}
                className="flex items-center justify-between mb-[10px] cursor-pointer group"
              >
                <h1 className="text-[20px] font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                  내 여행지
                </h1>
                <span className="text-xs font-semibold text-violet-600 group-hover:underline">
                  찾으러 가기 ›
                </span>
              </div>
              
              <div
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="flex gap-4 overflow-x-auto no-scrollbar select-none cursor-grab active:cursor-grabbing"
              >
                {/* 내 여행지 카드들 */}
                {myPlaces.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => handlePlaceClick(place)}
                    className="cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex-shrink-0 w-40 snap-start relative"
                  >
                    <div className="h-36 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                      {place.img ? (
                        <img
                          src={place.img}
                          alt={place.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                        />
                      ) : (
                        <span className="text-3xl text-gray-300 pointer-events-none">📍</span>
                      )}

                      {/* 💡 점 세개(⋮) 삭제 버튼 */}
                      <button
                        onClick={(e) => handleMenuToggle(e, place.id)}
                        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                        aria-label="메뉴 열기"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* 💡 삭제 팝업 메뉴 */}
                      {activeMenuId === place.id && (
                        <div 
                          className="absolute top-10 right-2 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 px-1 min-w-[95px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleDeletePlace(e, place.id)}
                            className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-red-600 font-semibold hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            삭제하기
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-4 pointer-events-none">
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

                {/* 내 여행지 찾으러 가기 카드 */}
                <div
                  onClick={handleGoToSearchPlace}
                  className="flex-shrink-0 w-40 aspect-square rounded-2xl border-[1.5px] border-dashed border-[#C9B8FF] bg-[#F1ECFF] flex flex-col items-center justify-center gap-2.5 cursor-pointer snap-start hover:bg-[#e6ddff] transition-colors"
                >
                  <div className="w-[38px] h-[38px] rounded-full bg-[#7C4DFF] text-white flex items-center justify-center text-xl leading-none">
                    +
                  </div>
                  <p className="text-[13px] font-semibold text-[#7C4DFF] text-center leading-snug">
                    내 여행지<br />찾으러 가기
                  </p>
                </div>

                {myPlaces.length === 1 && (
                  <div className="flex-shrink-0 w-40 aspect-square rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center snap-start">
                    <span className="text-2xl text-gray-300">📍</span>
                  </div>
                )}
              </div>
            </section>
          ) : (
            <section className="px-2 mt-[15px]">
              <div 
                onClick={handleGoToSearchPlace}
                className="flex items-center justify-between mb-3 cursor-pointer group"
              >
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-violet-600 transition-colors">
                  내 여행지
                </h1>
                <span className="text-xs font-semibold text-violet-600 group-hover:underline">
                  찾으러 가기 ›
                </span>
              </div>
              <MyPlaylistEmptyState
                navigatePath="/searchPlaceToMusic"
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