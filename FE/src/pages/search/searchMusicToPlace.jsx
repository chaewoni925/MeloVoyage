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

    // 페이지별 데이터: 각 페이지마다 3x3 = 9개 아이템
    const pages = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9],       // 1페이지
        [10, 11, 12, 13, 14, 15, 16, 17, 18], // 2페이지
        [19, 20, 21, 22, 23, 24, 25, 26, 27], // 3페이지
    ];

    const handlePrev = () => {
        setPageIndex((prev) => (prev === 0 ? pages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setPageIndex((prev) => (prev === pages.length - 1 ? 0 : prev + 1));
    };

    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            navigate("/loading", { state: { nextPath: "/search-reason" } });
        } else {
            alert("음악을 입력해주세요!");
        }
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

                    {/* 3행 그리드 (기존 구조 그대로) */}
                    <div className="flex flex-col gap-[10px] w-full">
                        {rows.map((row, rowIdx) => (
                            <div key={rowIdx} className="flex gap-[10px]">
                                {row.map((item) => (
                                    <div
                                        key={item}
                                        className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full"
                                    ></div>
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