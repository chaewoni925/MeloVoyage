// src/pages/search/searchMusicToPlace.jsx

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';
import searchIcon from '../../assets/search.png';


const SearchMusicToPlacePage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [pageIndex, setPageIndex] = useState(0); // 0, 1, 2 (3페이지)

    // TODO: API 연결되면 아래 목데이터 대신 useEffect로 fetch해서 채우기
    // 예: 백엔드에 "빠른 검색" 전용 엔드포인트가 생기면 그걸로 대체
    const quickSearchItems = [
        { id: 1, title: "여름밤 드라이브", artist: "잔잔한 시티팝", thumbnail: street },
        { id: 2, title: "비 오는 카페", artist: "로파이 힙합", thumbnail: wave },
        { id: 3, title: "새벽 감성", artist: "인디 발라드", thumbnail: street },
        { id: 4, title: "출근길 플레이리스트", artist: "어쿠스틱 팝", thumbnail: wave },
        { id: 5, title: "여행 가고 싶을 때", artist: "포크", thumbnail: street },
        { id: 6, title: "노을 지는 바다", artist: "칠 재즈", thumbnail: wave },
        { id: 7, title: "겨울 감성", artist: "발라드", thumbnail: street },
        { id: 8, title: "산책하며 듣는 노래", artist: "어쿠스틱", thumbnail: wave },
        { id: 9, title: "설레는 봄날", artist: "K-인디", thumbnail: street },
        { id: 10, title: "심야 드라이브", artist: "신스팝", thumbnail: wave },
        { id: 11, title: "제주도 감성", artist: "어쿠스틱", thumbnail: street },
        { id: 12, title: "혼자 걷는 골목", artist: "로파이", thumbnail: wave },
        { id: 13, title: "여행지에서 듣는 노래", artist: "시티팝", thumbnail: street },
        { id: 14, title: "카페에서", artist: "재즈", thumbnail: wave },
        { id: 15, title: "비 오는 날", artist: "발라드", thumbnail: street },
        { id: 16, title: "설레는 첫 만남", artist: "K-팝", thumbnail: wave },
        { id: 17, title: "노을 질 때", artist: "칠 무드", thumbnail: street },
        { id: 18, title: "기차 여행", artist: "포크", thumbnail: wave },
        { id: 19, title: "겨울 바다", artist: "발라드", thumbnail: street },
        { id: 20, title: "봄바람", artist: "어쿠스틱", thumbnail: wave },
        { id: 21, title: "여름 축제", artist: "댄스팝", thumbnail: street },
        { id: 22, title: "가을 낙엽", artist: "인디", thumbnail: wave },
        { id: 23, title: "새벽 드라이브", artist: "신스웨이브", thumbnail: street },
        { id: 24, title: "혼자만의 시간", artist: "로파이", thumbnail: wave },
        { id: 25, title: "여행 전날 밤", artist: "시티팝", thumbnail: street },
        { id: 26, title: "노을 산책", artist: "칠 재즈", thumbnail: wave },
        { id: 27, title: "집 가는 길", artist: "발라드", thumbnail: street },
    ];

    // 9개씩 3페이지로 분할
    const pages = [
        quickSearchItems.slice(0, 9),
        quickSearchItems.slice(9, 18),
        quickSearchItems.slice(18, 27),
    ];

    const handlePrev = () => {
        setPageIndex((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setPageIndex((prev) => (prev === pages.length - 1 ? 0 : prev + 1));
    };

    const handleSearch = (queryOverride) => {
        const query = queryOverride ?? searchQuery;
        if (query.trim() !== "") {
            // 검색어를 다음 페이지(reason)까지 같이 넘겨줘야 거기서 "무슨 음악으로 검색했는지" 알 수 있음
            navigate("/loading", { state: { nextPath: "/search-reason", query } });
        } else {
            alert("음악을 입력해주세요!");
        }
    };

    // 빠른 검색 아이템 클릭 시: 검색창에 채워주고 바로 검색까지 실행
    const handleQuickSearchClick = (item) => {
        setSearchQuery(item.title);
        handleSearch(item.title);
    };

    // 현재 페이지 아이템을 3개씩 끊어서 3행으로 분리
    const currentItems = pages[pageIndex];
    const rows = [
        currentItems.slice(0, 3),
        currentItems.slice(3, 6),
        currentItems.slice(6, 9),
    ];

    return (
        <div className="min-h-screen px-2 bg-gray-100 flex justify-center">
            <div className="bg-white p-5 rounded-b-3xl w-full max-w-md relative">
                <Header />

                <section className="flex flex-col mt-[20px]">
                    <h1 className="text-[23px] px-2 font-bold mb-2"> 어떤 음악을 듣고 싶나요?</h1>
                    <p className="px-2 text-[14px]">음악으로 당신의 여행지를 발견해보세요</p>
                </section>

                <section className="flex flex-col items-center mt-5">
                    <div className="w-full px-2 relative flex items-center">
                        <svg className="absolute left-6 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                            placeholder="음악을 입력하세요"
                            className="w-full border border-black bg-white text-sm rounded-xl pl-11 pr-11 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 text-gray-400 hover:text-purple-600 text-xs font-bold bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center"
                            >
                                X
                            </button>
                        )}
                    </div>
                </section>

                <section>
                    <h1 className="text-purple-600 px-2 text-[22px] font-bold mt-[20px]">
                        빠른 검색
                    </h1>
                </section>

                {/* 넘김 버튼 + 3x3 그리드 영역 */}
                <section className="px-2 relative flex items-center mt-[10px]">
                    {/* 이전 버튼 */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow -translate-x-2"
                    >
                        ‹
                    </button>

                    {/* 3행 그리드 */}
                    <div className="flex flex-col gap-[10px] w-full">
                        {rows.map((row, rowIdx) => (
                            <div key={rowIdx} className="flex gap-[10px]">
                                {row.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleQuickSearchClick(item)}
                                        className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full relative overflow-hidden group"
                                    >

                                      {/* 디버깅용 썸네일 텍스트 표시(데이터 추가 후에 나중에 지움 )
                                       <span className="absolute top-0 left-0 text-[8px] text-red-500 z-50 bg-white">
                                            {item.thumbnail}
                                        </span> 
                                        */}

                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] px-1 text-center">
                                            <span className="font-semibold leading-tight">{item.title}</span>
                                            <span className="text-[10px] opacity-80">{item.artist}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* 다음 버튼 */}
                    <button
                        onClick={handleNext}
                        className="absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow translate-x-4"
                    >
                        ›
                    </button>
                </section>

                {/* 동그라미 인디케이터 */}
                <div className="flex justify-center mt-[10px] items-center gap-3">
                    {pages.map((_, idx) => (
                        <svg
                            key={idx}
                            onClick={() => setPageIndex(idx)}
                            className="cursor-pointer"
                            width="15"
                            height="15"
                            viewBox="0 0 22 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="11"
                                cy="11"
                                r="11"
                                fill={idx === pageIndex ? "#9333EA" : "#D9D9D9"}
                            />
                        </svg>
                    ))}
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default SearchMusicToPlacePage;