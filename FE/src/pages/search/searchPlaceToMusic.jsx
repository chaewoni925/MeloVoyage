// src/pages/search/searchPlaceToMusic.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header";
import street from '../../assets/street.png';
import searchIcon from '../../assets/search.png';
import instance from '../../api/axios';
import { useUser } from "../../context/UserContext.jsx";

const INITIAL_RECENT_PLACES = ["제주도", "부산", "강릉", "여수"];
const MAIN_DESTINATIONS = ["서울", "부산", "강릉", "경주", "제주"];

const SearchPlaceToMusicPage = () => {
    const navigate = useNavigate();
    const { user } = useUser();

    const [searchQuery, setSearchQuery] = useState("");
    const [recentPlaces, setRecentPlaces] = useState(INITIAL_RECENT_PLACES);
    const [recommendations, setRecommendations] = useState([]);

    const displayName = user?.email ? user.email.split("@")[0] : "회원";

    useEffect(() => {
        const fetchRandomDestinations = async () => {
            try {
                const res = await instance.get("/destinations", { withCredentials: true });
                const all = res.data.destinations || [];

                // 5개 지역에 속하면서 + photoUrl이 있는 세부 장소만 후보로
                const candidates = all.filter((d) => {
                    const hasPhoto = !!d.photoUrl;
                    const inMainRegion = MAIN_DESTINATIONS.some(
                        (city) => d.name?.includes(city) || d.address?.includes(city)
                    );
                    return hasPhoto && inMainRegion;
                });

                const shuffled = [...candidates].sort(() => Math.random() - 0.5);
                const picked = shuffled.slice(0, 2);

                setRecommendations(
                    picked.map((dest) => ({
                        id: dest.id,
                        place: dest.name,
                        thumbnail: dest.photoUrl || street,
                    }))
                );
            } catch (error) {
                console.error("추천 여행지 조회 실패:", error);
            }
        };
        fetchRandomDestinations();
    }, [displayName]);

    const handleSearch = async (queryOverride) => {
        const query = queryOverride ?? searchQuery;
        if (query.trim() === "") {
            alert("장소를 입력해주세요!");
            return;
        }
        setRecentPlaces((prev) => [query, ...prev.filter((p) => p !== query)].slice(0, 8));

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

    const handleRecentPlaceClick = (place) => {
        setSearchQuery(place);
        handleSearch(place);
    };

    const handleClearAll = () => {
        setRecentPlaces([]);
    };

    const handleRecommendationClick = (rec) => {
        handleSearch(rec.place);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
            <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden">

                {/* 상단 영역 (고정) */}
                <div className="p-4 sm:p-6 pb-2">
                    <Header />
                </div>

                {/* 중간 콘텐츠 영역 (스크롤) */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 pt-0 pb-6">

                    <section className="flex flex-col px-[8px] mt-[-20px]">
                        <h1 className="text-[25px] font-bold text-gray-900 leading-snug"> 
                            어떤 장소에 가고 싶나요?</h1>
                        <p className="text-gray-500 mt-2 text-sm font-medium px-[3px]">
                            당신의 여행과 함께 할 음악을 찾아보세요
                        </p>
                    </section>

                    <section className="mt-6">
                        <div className="relative mr-1 ml-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 21"
                                >
                                    <path
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                                placeholder="장소를 입력하세요"
                                className="block w-full  pl-11 pr-11 py-2 border-gray-100 border rounded-2xl bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9370DB] focus:border-transparent transition-all placeholder:text-gray-400 placeholder:text-[15px] text-gray-500 shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#9370DB] text-xs font-bold bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
                                >
                                    X
                                </button>
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="flex justify-between items-center px-2 mt-[15px] mb-[15px]">
                            <h1 className="text-purple-600 text-[19px] font-bold">
                                최근 여행지
                            </h1>
                            {recentPlaces.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-gray-500 text-[13px] font-bold cursor-pointer hover:text-purple-600"
                                >
                                    모두지우기
                                </button>
                            )}
                        </div>

                        {recentPlaces.length === 0 ? (
                            <p className="px-2 text-[12px] text-gray-400"> 최근 검색한 여행지가 없어요</p>
                        ) : (
                            <div className="flex gap-3 px-2 overflow-x-auto snap-x snap-mandatory no-scrollbar">
                                {recentPlaces.map((place) => (
                                    <button
                                        key={place}
                                        onClick={() => handleRecentPlaceClick(place)}
                                        className="cursor-pointer px-4 py-1.5 bg-gray-100 hover:bg-[#9370DB] hover:text-white text-gray-500 rounded-full text-[12px] font-semibold transition-colors whitespace-nowrap"
                                    >
                                        {place}
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="px-3 space-y-5 mt-5">
                        {recommendations.map((rec) => (
                            <button
                                key={rec.id}
                                onClick={() => handleRecommendationClick(rec)}
                                className="relative group h-43 w-full rounded-[24px] overflow-hidden shadow-sm active:scale-[0.98] transition-all border border-white/10 text-left cursor-pointer"
                            >
                                <img
                                    src={rec.thumbnail}
                                    alt={rec.place}
                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div
                                    className="absolute inset-0 flex flex-col justify-end p-6"
                                    style={{
                                        background:
                                            "linear-gradient(0deg, rgba(17,12,22,0.85) 0%, rgba(17,12,22,0.4) 60%, rgba(17,12,22,0) 100%)",
                                    }}
                                >
                                    <p className="text-white text-sm font-bold mb-1">
                                        {displayName}님,
                                    </p>
                                    <p className="text-white text-xl font-bold leading-tight tracking-tight">
                                        {rec.place} 어때요?
                                    </p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-[#ddb8ff] rounded-full animate-pulse" />
                                        <span className="text-[10px] text-[#ddb8ff] font-bold tracking-widest uppercase">
                                            Special Recommendation
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </section>
                </div>

                {/* 하단 푸터 (고정) */}
                <Footer />
            </div>
        </div>
    );
};

export default SearchPlaceToMusicPage;