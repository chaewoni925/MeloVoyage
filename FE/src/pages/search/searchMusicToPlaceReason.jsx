// src/pages/search/searchMusicToPlaceReason.jsx

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import NoLogoHeader from "../../components/NoLogoHeader";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';
import searchIcon from '../../assets/search.png';

// src/pages/search/searchMusicToPlaceReason.jsx

// (상단 import 생략)

const SearchMusicToPlaceReasonPage = () => {
    const navigate = useNavigate();
    
    // 1. 목 데이터 정의
    const data = {
        place: "부산",
        tags: ["힙한", "야경", "활기찬"],
        moodDescription: {
            first: "힙한",
            second: "야경"
        }
    };

    return (
        <div className="min-h-screen px-2 bg-gray-100 flex justify-center">
            <div className="bg-white p-5 rounded-b-3xl w-full max-w-md relative">
                <NoLogoHeader />

                <section className="flex flex-col mt-[20px]">
                    {/* 데이터 바인딩 */}
                    <h1 className="text-[20px] px-2 font-bold mb-[17px]"> 추천 여행지 : {data.place} </h1>
                </section>

                <section className="flex flex-col items-center ">
                    <div className="w-[250px] h-[300px] bg-gray-200 relative flex items-end">
                        <div className="w-full h-[70px] bg-gray-300 flex items-center justify-center p-2 text-center">
                            <p className="text-[14px] break-words whitespace-normal text-center">
                                {data.moodDescription.first}, {data.moodDescription.second}  
                                <br/>
                                분위기 기반으로 추천했어요. 
                            </p>
                        </div>
                    </div>
                </section>

                <nav className="flex items-center justify-center mt-3 gap-2">
                    {/* 태그 데이터 매핑 */}
                    {data.tags.map((tag, index) => (
                        <span key={index} className="text-[12px] px-3 py-1 rounded-full border border-gray-400 text-gray-700">
                            {tag}
                        </span>
                    ))}
                </nav>

                <section className="flex items-center justify-center mt-4 gap-4">
                    <div className="w-[135px] h-[130px] bg-gray-200"></div>
                    <div className="w-[135px] h-[130px] bg-gray-200"></div>
                </section>

                <section className="flex justify-center">
                    <button 
                        className="flex items-center justify-center mt-[20px] w-[300px] h-[50px] bg-purple-300 rounded-full font-semibold text-black hover:bg-purple-400 transition-colors"
                        onClick={() => navigate("/playlist")}
                    >
                        플레이리스트 확인하기
                    </button>
                </section>

                <Footer />
            </div>
        </div>
    );
};

export default SearchMusicToPlaceReasonPage;