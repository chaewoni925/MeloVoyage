// src/pages/search/searchPlaceToMusicReason.jsx

import { X, Sparkles, Check, RefreshCw, Heart } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LoadingPage from '../loading/loading.jsx';
import street from '../../assets/street.png';
import instance from '../../api/axios';
import { savePlace, unsavePlace, searchDestination } from '../../api/map';

const SearchPlaceToMusicReasonPage = () => {
    const navigate = useNavigate();
    const { recommendationId } = useParams();
    const location = useLocation();
    const { placeId: incomingPlaceId, alreadySaved } = location.state || {}; // 💡 map.jsx에서 넘어온 정보

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [placeSaving, setPlaceSaving] = useState(false);
    const [placeSaved, setPlaceSaved] = useState(Boolean(alreadySaved)); // 💡 초기값 반영

    const [selectedTrackIds, setSelectedTrackIds] = useState(new Set());
    const [playlistTitle, setPlaylistTitle] = useState("");

    // 🖱️ 태그 영역 마우스 드래그 스크롤용
    const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, el: null });

    const handleTagMouseDown = (e) => {
        const el = e.currentTarget;
        dragState.current = {
            isDown: true,
            startX: e.pageX - el.offsetLeft,
            scrollLeft: el.scrollLeft,
            el,
        };
        el.classList.add("cursor-grabbing");
    };

    const stopTagDrag = () => {
        const { el } = dragState.current;
        if (el) el.classList.remove("cursor-grabbing");
        dragState.current.isDown = false;
    };

    const handleTagMouseMove = (e) => {
        const { isDown, startX, scrollLeft, el } = dragState.current;
        if (!isDown || !el) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = x - startX;
        el.scrollLeft = scrollLeft - walk;
    };

    const [placeData, setPlaceData] = useState({
        id: null,
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
            setSaved(false);
            if (!alreadySaved) {
                setPlaceSaved(false); // 💡 저장된 카드에서 온 게 아니면 초기화
            }
            try {
                const response = await instance.get(
                    `/recommend/explain/playlist/${recommendationId}`,
                    { withCredentials: true }
                );
                if (response.data.success) {
                    const resData = response.data.data;
                    console.log("🔍 백엔드 추천 이유 응답 데이터:", resData);

                    const { destination, photoUrl, destinationMoodTags, message, tracks } = resData;
                    const trackList = tracks || [];

                    // 1️⃣ map.jsx에서 넘어온 ID 우선 사용, 없으면 응답 데이터에서 추출 시도
                    let actualPlaceId = 
                        incomingPlaceId ??
                        resData.destinationId ?? 
                        resData.destination_id ?? 
                        resData.placeId ?? 
                        resData.place_id ?? 
                        resData.id;

                    const destinationName = typeof destination === 'string' 
                        ? destination 
                        : (destination?.name || "여행지");

                    // 2️⃣ 추천 이유 응답에도, 넘어온 정보에도 ID가 없으면, destinationName으로 searchDestination 조회
                    if (!actualPlaceId && destinationName) {
                        try {
                            const searchRes = await searchDestination(destinationName);
                            console.log("📍 searchDestination 조회 결과:", searchRes);

                            if (searchRes) {
                                if (typeof searchRes === 'object' && searchRes.id) {
                                    actualPlaceId = searchRes.id;
                                } else if (Array.isArray(searchRes) && searchRes.length > 0) {
                                    actualPlaceId = searchRes[0].id || searchRes[0].destinationId;
                                } else if (searchRes.destinations && searchRes.destinations.length > 0) {
                                    actualPlaceId = searchRes.destinations[0].id || searchRes.destinations[0].destinationId;
                                } else if (searchRes.data) {
                                    actualPlaceId = Array.isArray(searchRes.data) ? searchRes.data[0]?.id : searchRes.data.id;
                                }
                            }
                        } catch (searchErr) {
                            console.warn("여행지 ID 조회 실패:", searchErr);
                        }
                    }

                    console.log("✅ 최종 결정된 여행지 ID:", actualPlaceId);

                    setPlaceData((prev) => ({
                        ...prev,
                        id: actualPlaceId,
                        name: destinationName,
                        intro: "음악과 함께하는 감성 여행",
                        imageUrl: photoUrl || street,
                        aiReason: message,
                        moodWords: (destinationMoodTags || []).map((tag) => 
                            typeof tag === 'string' ? { word: tag, description: "" } : tag
                        ),
                        tracks: trackList,
                    }));

                    // 💡 alreadySaved로 이미 true인 경우 백엔드 값으로 덮어쓰지 않도록 보호
                    if (!alreadySaved && (resData.isSaved !== undefined || resData.saved !== undefined)) {
                        setPlaceSaved(Boolean(resData.isSaved || resData.saved));
                    }

                    setSelectedTrackIds(
                        new Set(trackList.map((t) => t.spotifyTrackId ?? t.id))
                    );

                    setPlaylistTitle(destinationName || "");
                }
            } catch (error) {
                console.error("추천 이유 불러오기 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReason();
    }, [recommendationId]);

    const toggleTrackSelect = (trackId) => {
        setSelectedTrackIds((prev) => {
            const next = new Set(prev);
            if (next.has(trackId)) {
                next.delete(trackId);
            } else {
                next.add(trackId);
            }
            return next;
        });
    };

    const isAllSelected =
        placeData.tracks.length > 0 &&
        selectedTrackIds.size === placeData.tracks.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedTrackIds(new Set());
        } else {
            setSelectedTrackIds(
                new Set(placeData.tracks.map((t) => t.spotifyTrackId ?? t.id))
            );
        }
    };

    const handleConfirmSave = async () => {
        if (!recommendationId || saving) return;
        if (selectedTrackIds.size === 0) return;

        const trimmedTitle = playlistTitle.trim();
        if (!trimmedTitle) return;

        setShowConfirm(false);
        setSaving(true);
        try {
            const response = await instance.post(
                '/storage/save',
                {
                    recommendationId,
                    title: trimmedTitle,
                    trackIds: Array.from(selectedTrackIds),
                },
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

    // 여행지 저장/취소 토글
    const handleTogglePlace = async () => {
        const targetId = placeData.id;

        console.log("💾 저장 시도 대상 ID (targetId):", targetId);

        if (!targetId) {
            alert("여행지 ID를 찾지 못했습니다.");
            return;
        }

        if (placeSaving) return;
        setPlaceSaving(true);
        try {
            if (placeSaved) {
                await unsavePlace(targetId);
                setPlaceSaved(false);
                alert("여행지 저장이 취소되었습니다.");
            } else {
                await savePlace(targetId);
                setPlaceSaved(true);
                alert("여행지가 내 여행지에 저장되었습니다!");
            }
        } catch (error) {
            console.error("여행지 저장/취소 실패 상세:", error.response?.data || error);
            alert(`여행지 저장 실패: ${error.response?.data?.message || error.response?.data?.error || "오류가 발생했습니다."}`);
        } finally {
            setPlaceSaving(false);
        }
    };

    const handleRegenerate = () => {
        navigate(`/regenerate/${recommendationId}`);
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
            <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden">

                {/* 전체 스크롤 영역 (상단 이미지 배너 포함) */}
                <div className="flex-1 overflow-y-auto no-scrollbar">

                    <div
                        className="h-75 w-full bg-gray-200 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${placeData.imageUrl})` }}
                    >
                        <button
                            onClick={() => navigate("/searchPlaceToMusic")}
                            aria-label="닫기"
                            className="cursor-pointer absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
                        >
                            <X className="h-5 w-5 text-gray-900" />
                        </button>

                        {/* 여행지 저장/취소 버튼 */}
                        <button
                            onClick={handleTogglePlace}
                            disabled={placeSaving || !placeData.id}
                            aria-label={placeSaved ? "여행지 저장 취소" : "여행지 저장"}
                            className="cursor-pointer absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                        >
                            <Heart
                                className={`h-5 w-5 ${placeSaved ? "fill-red-600 text-red-600" : "text-gray-900"}`}
                            />
                        </button>
                    </div>

                    <div className="px-6 pb-10 pt-6 flex flex-col items-start w-full">
                        <div className="flex w-full items-center justify-between gap-2">
                            <h2 className="text-2xl font-bold text-gray-900 text-left">{placeData.name}</h2>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={handleRegenerate}
                                    className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    재생성
                                </button>

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

                        <div className="mt-6 w-full">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-900">추천 플레이리스트</h3>
                                {placeData.tracks.length > 0 && (
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-xs font-medium text-violet-600 cursor-pointer"
                                    >
                                        {isAllSelected ? "전체 해제" : "전체 선택"}
                                    </button>
                                )}
                            </div>

                            {placeData.tracks.length > 0 ? (
                                <div className="space-y-3">
                                    {placeData.tracks.map((track) => {
                                        const trackId = track.spotifyTrackId ?? track.id;
                                        const isSelected = selectedTrackIds.has(trackId);

                                        return (
                                            <div
                                                key={trackId}
                                                onClick={() => toggleTrackSelect(trackId)}
                                                className={`flex items-center gap-3 rounded-2xl border p-3 w-full cursor-pointer transition-colors
                                                    ${isSelected
                                                        ? "border-violet-300 bg-violet-50"
                                                        : "border-gray-100 bg-white"}`}
                                            >
                                                <div
                                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2
                                                        ${isSelected
                                                            ? "border-violet-600 bg-violet-600"
                                                            : "border-gray-300 bg-white"}`}
                                                >
                                                    {isSelected && <Check className="h-3 w-3 text-white" />}
                                                </div>

                                                {track.albumImageUrl ? (
                                                    <img
                                                        src={track.albumImageUrl}
                                                        alt={track.name}
                                                        className="h-12 w-12 shrink-0 rounded-lg object-cover bg-gray-200"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-200" />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{track.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{track.artist}</p>

                                                    {/* 🎵 곡마다 여행지 무드 태그 표시 (한 줄, 마우스/터치 드래그 스크롤) */}
                                                    {placeData.moodWords.length > 0 && (
                                                        <div
                                                            className="mt-1.5 flex flex-nowrap gap-1.5 overflow-x-auto no-scrollbar cursor-grab select-none"
                                                            onMouseDown={(e) => {
                                                                e.stopPropagation();
                                                                handleTagMouseDown(e);
                                                            }}
                                                            onMouseMove={handleTagMouseMove}
                                                            onMouseUp={stopTagDrag}
                                                            onMouseLeave={stopTagDrag}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {placeData.moodWords.map((mood, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="cursor-pointer shrink-0 whitespace-nowrap rounded-full border border-violet-100 bg-white px-2 py-0.5 text-[10px] font-medium text-violet-600"
                                                                >
                                                                    #{mood.word}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">추천 곡이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 저장 확인 모달 */}
                {showConfirm && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-72 rounded-2xl bg-white p-5 shadow-lg">
                            <p className="text-center text-sm font-medium text-gray-900">
                                플레이리스트 이름을 정해주세요
                            </p>

                            <input
                                type="text"
                                value={playlistTitle}
                                onChange={(e) => setPlaylistTitle(e.target.value)}
                                placeholder="플레이리스트 이름"
                                maxLength={40}
                                className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-violet-400"
                            />

                            <p className="mt-2 text-center text-xs text-gray-400">
                                선택한 곡 {selectedTrackIds.size}곡이 저장됩니다
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
                                    disabled={!playlistTitle.trim()}
                                    className="flex-1 rounded-xl bg-violet-600 py-2 text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
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