// src/pages/search/searchPlaceToMusic.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';
import searchIcon from '../../assets/search.png';

// TODO: 백엔드 붙으면 GET /users/mypage 등에서 받은 최근 검색 여행지로 교체
const INITIAL_RECENT_PLACES = ["제주도", "부산", "강릉", "여수"];

// TODO: 백엔드 붙으면 회원정보 + 여행지 추천 로직 연결 (지금은 미연결이라 목데이터)
// userName 자리는 이제 고정값이 아니라 아래 useEffect에서 받아온 값으로 채워짐
const MOCK_RECOMMENDATION_PLACES = [
    { id: 1, place: "제주도", thumbnail: street },
    { id: 2, place: "강릉", thumbnail: wave },
];

const SearchPlaceToMusicPage = () => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [recentPlaces, setRecentPlaces] = useState(INITIAL_RECENT_PLACES);

    // 로그인한 사용자 이름 - 회원가입/로그인 붙기 전까지는 null로 두고 "회원님"으로 대체 표시
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        // TODO: 회원가입/로그인 붙으면 아래 fetch로 교체
        // const fetchUser = async () => {
        //     const res = await fetch("/users/mypage");
        //     const data = await res.json();
        //     setUserName(data.name);
        // };
        // fetchUser();
    }, []);

    const displayName = userName ?? "회원";

    const recommendations = MOCK_RECOMMENDATION_PLACES.map((rec) => ({
        ...rec,
        message: `${displayName}님, ${rec.place}은 어때요?`,
    }));

    const handleSearch = (queryOverride) => {
        const query = queryOverride ?? searchQuery;
        if (query.trim() === "") {
            alert("장소를 입력해주세요!");
            return;
        }
        // 검색한 장소를 최근 여행지 맨 앞에 추가 (중복 제거)
        setRecentPlaces((prev) => [query, ...prev.filter((p) => p !== query)].slice(0, 8));
        navigate("/loading", { state: { nextPath: "/searchPlaceToMusicReason", query } });
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
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="bg-white p-6 rounded-b-3xl w-full max-w-md relative">
                <Header />

                {/* 상단 글 */}
                <section className="flex flex-col px-[10px] mt-[25px]">
                    <h1 className="text-[25px] font-bold mb-[5px]"> 어떤 장소에 가고 싶나요?</h1>
                    <p className="text-[13px] px-[5px]">
                        당신의 여행과 함께 할 음악을 찾아보세요
                    </p>
                </section>

                <section className="flex flex-col px-2 items-center mt-5">
                    {/* 검색창 */}
                    <div className="w-full relative flex items-center">
                        <img
                            src={searchIcon}
                            alt="search"
                            className="absolute left-4 w-4 h-4 object-contain pointer-events-none"
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                            placeholder="장소를 입력하세요"
                            className="w-full border border-black bg-white text-sm text-600 placeholder-400 rounded-xl pl-11 pr-11 py-4 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 text-gray-400 hover:text-purple-600 text-xs font-bold bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
                            >
                                X
                            </button>
                        )}
                    </div>
                </section>

                {/* 최근 여행지 */}
                <section>
                    <h1 className="text-purple-600 px-2 text-[15px] font-bold mt-[30px] mb-[10px]">
                        최근 여행지
                    </h1>

                    {recentPlaces.length === 0 ? (
                        <p className="px-2 text-[12px] text-gray-400">최근 검색한 여행지가 없어요</p>
                    ) : (
                        <div className="flex gap-3 px-2 overflow-x-auto snap-x snap-mandatory no-scrollbar">
                            {recentPlaces.map((place) => (
                                <button
                                    key={place}
                                    onClick={() => handleRecentPlaceClick(place)}
                                    className="cursor-pointer bg-[#D9D9D9] hover:bg-gray-300 transition-colors px-4 py-2 rounded-[20px] whitespace-nowrap text-[13px] font-medium shrink-0 snap-start"
                                >
                                    {place}
                                </button>
                            ))}
                        </div>
                    )}

                    {recentPlaces.length > 0 && (
                        <div className="flex justify-end">
                            <button
                                onClick={handleClearAll}
                                className="text-gray-600 text-[12px] font-bold mt-[10px] cursor-pointer hover:text-purple-600"
                            >
                                모두지우기
                            </button>
                        </div>
                    )}
                </section>

                {/* 추천 박스 - 회원정보랑 여행지 정보 연결해야함 (아직 미연결, 목데이터) */}
                <section>
                    <div className="flex flex-col mt-[10px] gap-3">
                        {recommendations.map((rec) => (
                            <button
                                key={rec.id}
                                onClick={() => handleRecommendationClick(rec)}
                                className="cursor-pointer relative overflow-hidden rounded-lg w-full h-[150px] text-left"
                            >
                                <img
                                    src={rec.thumbnail}
                                    alt={rec.place}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30" />
                                <h1 className="absolute bottom-6 left-4 text-white text-[19px] font-bold drop-shadow">
                                    {rec.message}
                                </h1>
                            </button>
                        ))}
                    </div>
                </section>

                <Footer />
            </div>
        </div>
    );
};

export default SearchPlaceToMusicPage;