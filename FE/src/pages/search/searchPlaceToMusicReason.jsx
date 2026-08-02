// src/pages/search/searchPlaceToMusicReason.jsx

import { X, Sparkles, Check, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingPage from '../loading/loading.jsx'
import street from '../../assets/street.png';
import instance from '../../api/axios';

const SearchPlaceToMusicReasonPage = () => {
    const navigate = useNavigate();
    const { recommendationId } = useParams(); // location.state 대신 URL 파라미터로 읽음 (새로고침해도 유지됨)

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
            setSaved(false); // 재생성으로 새 id가 들어오면 저장 상태 초기화
            try {
                const response = await instance.get(
                    `/recommend/explain/playlist/${recommendationId}`,
                    { withCredentials: true }
                );
                if (response.data.success) {
                    const { destination, photoUrl, matchedTags, message, tracks } = response.data.data;
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
                        tracks: tracks || [],
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

    // 저장 확인 모달에서 "예" 눌렀을 때 실제 저장
    const handleConfirmSave = async () => {
        setShowConfirm(false);
        if (!recommendationId || saving) return;
        setSaving(true);
        try {
            const response = await instance.post(
                '/storage/save',
                { recommendationId },
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

    // 재생성 페이지로 이동 (recommendationId를 URL에 실어서 이동)
    const handleRegenerate = () => {
        navigate(`/regenerate/${recommendationId}`);
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
                    <div className="flex w-full items-center justify-between gap-2">
                        <h2 className="text-2xl font-bold text-gray-900 text-left">{placeData.name}</h2>

                        <div className="flex items-center gap-2 shrink-0">
                            {/* 재생성 버튼 */}
                            <button
                                onClick={handleRegenerate}
                                className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                <RefreshCw className="h-4 w-4" />
                                재생성
                            </button>

                            {/* 저장 버튼 */}
                            <button
                                onClick={() => setShowConfirm(true)}
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

                    {/* 분위기 단어 — 태그 칩 형태로 축소 */}
                    {placeData.moodWords.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 w-full">
                            {placeData.moodWords.map((mood, idx) => (
                                <span
                                    key={idx}
                                    className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600"
                                >
                                    #{mood.word}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* 추천 곡 플레이리스트 */}
                    <div className="mt-6 w-full">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">추천 곡</h3>
                        {placeData.tracks.length > 0 ? (
                            <div className="space-y-3">
                                {placeData.tracks.map((track) => (
                                    <div
                                        key={track.spotifyTrackId ?? track.id}
                                        className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3 w-full"
                                    >
                                        {track.albumImageUrl ? (
                                            <img
                                                src={track.albumImageUrl}
                                                alt={track.name}
                                                className="h-12 w-12 shrink-0 rounded-lg object-cover bg-gray-200"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-200" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{track.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{track.artist}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">추천 곡이 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* 저장 확인 모달 */}
                {showConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-72 rounded-2xl bg-white p-5 shadow-lg">
                            <p className="text-center text-sm font-medium text-gray-900">
                                저장하시겠습니까?
                            </p>
                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 rounded-xl bg-gray-100 py-2 text-sm font-semibold text-gray-600 cursor-pointer"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleConfirmSave}
                                    className="flex-1 rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white cursor-pointer"
                                >
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPlaceToMusicReasonPage;