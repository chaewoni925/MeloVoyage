// src/pages/search/searchPlaceToMusicReason.jsx

import { X, Sparkles, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingPage from '../loading/loading.jsx'
import street from '../../assets/street.png';
import instance from '../../api/axios'; // 기존 axios -> 공통 instance로 통일

const SearchMusicToPlaceReasonPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const recommendationId = location.state?.recommendationId;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [placeData, setPlaceData] = useState({
        name: "여행지 이름",
        intro: "여행지 소개",
        imageUrl: street,
        aiReason: "AI의 추천 이유가 들어갈 자리입니다.",
        moodWords: [],
        tracks: [],
    });

    useEffect(() => {
        const fetchReason = async () => {
            if (!recommendationId) return;
            setLoading(true);
            try {
                const response = await instance.get(
                    `/recommend/explain/playlist/${recommendationId}`,
                    { withCredentials: true }
                );
                if (response.data.success) {
                    const { destination, photoUrl, matchedTags, message } = response.data.data;
                    setPlaceData((prev) => ({
                        ...prev,
                        name: destination,
                        intro: "음악과 함께하는 감성 여행",
                        imageUrl: photoUrl || street,
                        aiReason: message,
                        moodWords: (matchedTags || []).map((tag) => ({
                            word: tag,
                            description: "",
                        })),
                    }));
                }
            } catch (error) {
                console.error("추천 이유 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReason();
    }, [recommendationId]);

    // 저장하기 버튼 핸들러
    const handleSave = async () => {
        if (!recommendationId || saving) return;
        setSaving(true);
        try {
            const response = await instance.post(
                '/storage/save',
                { recommendationId }, // 저장 API에 넘길 값 (엔드포인트/바디는 실제 API 명세에 맞게 조정 필요)
                { withCredentials: true }
            );
            if (response.data.success) {
                setSaved(true);
            }
        } catch (error) {
            console.error("플레이리스트 저장 실패:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-screen relative">

                <div
                    className="h-80 w-full bg-gray-200 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${placeData.imageUrl})` }}
                >
                    <button
                        onClick={() => navigate("/searchPlaceToMusic")}
                        aria-label="닫기"
                        className="cursor-pointer absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
                    >
                        <X className="h-5 w-5 text-gray-900" />
                    </button>
                </div>

                <div className="px-6 pb-10 pt-6 flex flex-col items-start w-full">
                    <div className="flex w-full items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 text-left">{placeData.name}</h2>

                        {/* 저장하기 버튼 */}
                        <button
                            onClick={handleSave}
                            disabled={saving || saved}
                            className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer
                                ${saved
                                    ? "bg-green-100 text-green-600"
                                    : "bg-violet-600 text-white hover:bg-violet-700"}
                                disabled:opacity-70`}
                        >
                            {saved ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    저장됨
                                </>
                            ) : saving ? (
                                "저장 중..."
                            ) : (
                                "저장하기"
                            )}
                        </button>
                    </div>

                    <p className="ml-2 mt-2 text-sm font-medium text-violet-600 text-left w-full">{placeData.intro}</p>

                    <div className="mt-5 w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                            <Sparkles className="h-4 w-4 text-violet-500" />
                            AI의 추천 이유
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600">
                            {placeData.aiReason}
                        </p>
                    </div>

                    <div className="mt-4 w-full space-y-3">
                        {placeData.moodWords.map((mood, idx) => (
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