// src/pages/search/searchMusic.jsx

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';
import searchIcon from '../../assets/search.png';


const SearchMusicPage = () => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");

   const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            // 페이지 이동
            navigate("/loading", { state: { nextPath: "/search-reason" } });
        } else {
            alert("음악을 입력해주세요!"); // 입력값이 없을 때의 피드백
        }
    };
    return (

        <div className="min-h-screen px-2 bg-gray-100 flex justify-center">
            <div className="bg-white p-5 rounded-b-3xl w-full max-w-md relative">
                <Header />

                {/* 상단 글 */}
                <section className="flex flex-col mt-[20px]">
                    <h1 className="text-[23px] px-2 font-bold mb-2"> 어떤 음악을 듣고 싶나요?</h1>
                    <p className="px-2 text-[14px]">음악으로 당신의 여행지를 발견해보세요</p>
                </section>

                {/* 검색창 */}
                <section className="flex flex-col items-center mt-5">
                    <div className="w-full px-2 relative flex items-center">
                        <svg className="absolute left-6 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
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

                {/* 빠른 검색 */}
                <section>
                    <h1 className="text-purple-600 px-2 text-[22px] font-bold mt-[20px]">
                        빠른 검색 </h1>
                </section>

                {/* 음악 사진들*/}
                <section className="px-2">
                    {/*1행*/}
                    <div className="flex mt-[10px] gap-[10px]">
                        <div className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full"></div>
                        <div className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full"></div>
                        <div className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full"></div>
                    </div>

                    {/*2행*/}
                    <div className="flex mt-[10px] gap-[10px]">
                        <div className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full"></div>
                        <div className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full"></div>
                        <div className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full"></div>
                    </div>

                    {/*3행*/}
                    <div className="flex mt-[10px] gap-[10px]">
                        <div className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full"></div>
                        <div className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full"></div>
                        <div className="cursor-pointer bg-[#D9D9D9] rounded-lg aspect-square w-full"></div>
                    </div>

                    {/* 밑 동그라미 세개*/}
                    <div className="flex justify-center mt-[10px] items-center gap-3">

                        <svg className="dot1" width="15" height="15" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="11" fill="#D9D9D9" /> </svg>

                        <svg className="dot2" width="15" height="15" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="11" fill="#D9D9D9" /> </svg>


                        <svg className="dot3" width="15" height="15" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="11" fill="#D9D9D9" /> </svg>

                    </div>

                </section>
                <Footer />
            </div>
        </div>
    );
};

export default SearchMusicPage;