// src/pages/search/searchMusicToPlaceReason.jsx

import { X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import NoLogoHeader from "../../components/NoLogoHeader";
import street from '../../assets/street.png';

const SearchMusicToPlaceReasonPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    // TODO: 실제로는 API 응답 or location.state / params로 받아올 데이터
    const place = {
        name: "여행지 이름",
        intro: "여행지 소개",
        imageUrl: street, // 나중에 실제 장소 이미지로 교체
        aiReason: "AI의 추천 이유가 들어갈 자리입니다.",
        moodWords: [
            { word: "분위기 단어", description: "설명" },
            { word: "분위기 단어", description: "설명" },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-screen relative">

                {/* 상단 이미지 영역 */}
                <div
                    className="h-80 w-full bg-gray-200 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${place.imageUrl})` }}
                >
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="닫기"
                        className="cursor-pointer absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
                    >
                        <X className="h-5 w-5 text-gray-900" />
                    </button>
                </div>

                {/* 본문 */}
                <div className="px-6 pb-10 pt-6 flex flex-col items-start w-full">
                    <h2 className="text-2xl font-bold text-gray-900 text-left w-full">{place.name}</h2>
                    <p className="ml-2 mt-2 text-sm font-medium text-violet-600 text-left w-full">{place.intro}</p>

                    {/* AI 추천 이유 */}
                    <div className="mt-5 w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                            <Sparkles className="h-4 w-4 text-violet-500" />
                            AI의 추천 이유
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600">
                            {place.aiReason}
                        </p>
                    </div>

                    {/* 분위기 단어 리스트 */}
                    <div className="mt-4 w-full space-y-3">
                        {place.moodWords.map((mood, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4 w-full"
                            >
                                <div className="h-10 w-10 shrink-0 rounded-full bg-gray-300" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{mood.word}</p>
                                    <p className="text-xs text-gray-500">{mood.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SearchMusicToPlaceReasonPage;
