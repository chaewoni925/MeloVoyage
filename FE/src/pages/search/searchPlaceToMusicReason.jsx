// src/pages/search/searchPlaceToMusicReason.jsx

import { ChevronLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import NoLogoHeader from "../../components/NoLogoHeader";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';
import searchIcon from '../../assets/search.png';

// TODO: 백엔드 붙으면 GET /recommend/explain/playlist?place=xxx 응답으로 전체 교체
// 아래 각 필드는 실제 API 응답 필드명이 확정되면 이름/구조 다시 맞춰야 함
//
// 장소가 늘어나면 이 객체에 key만 추가하면 됨 (예: "부산": {...}, "여수": {...})
const MOCK_REASON_DATA_BY_PLACE = {
    "제주도": {
        place: "제주도",
        moodWords: ["몽환적인", "차분한"],
        backgroundImage: street,
        moodTags: ["몽환적", "차분함", "야경"],
        curationNote: "여행지의 몽환적 분위기 \n중심 큐레이션 문구입니다.",
        artistNote: "여행지의 차분한 분위기에 \n어울리는 가수를 추천했어요.",
    },
    "강릉": {
        place: "강릉",
        moodWords: ["청량함", "잔잔한"],
        backgroundImage: wave,
        moodTags: ["바다", "청량함", "힐링"],
        curationNote: "강릉의 청량한 바다 분위기 \n중심 큐레이션 문구입니다.",
        artistNote: "강릉의 잔잔한 분위기에 \n어울리는 가수를 추천했어요.",
    },
};

// TODO: 백엔드 붙으면 이 fallback 함수는 삭제하고 API 404 처리로 대체
// 아직 MOCK_REASON_DATA_BY_PLACE에 없는 장소를 검색했을 때 앱이 깨지지 않도록 하는 임시 기본값
const getReasonDataForPlace = (place) => {
    if (MOCK_REASON_DATA_BY_PLACE[place]) {
        return MOCK_REASON_DATA_BY_PLACE[place];
    }
    return {
        place,
        moodWords: ["감성적인", "포근한"],
        backgroundImage: street,
        moodTags: ["감성", "포근함"],
        curationNote: `${place}의 분위기를 중심으로 큐레이션했어요.`,
        artistNote: `${place} 분위기에 어울리는 가수를 추천했어요.`,
    };
};

const SearchPlaceToMusicReasonPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // 라우터 예: /searchPlaceToMusicReason?place=강릉
    const place = searchParams.get("place") || "제주도"; // 쿼리 없이 들어온 경우 기본 장소

    const [reason, setReason] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReason = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // TODO: 실제 엔드포인트 연결되면 아래 3줄 주석 해제
                // const res = await fetch(`/recommend/explain/playlist?place=${encodeURIComponent(place)}`);
                // if (!res.ok) throw new Error("추천 이유를 불러오지 못했습니다.");
                // const data = await res.json();
                // setReason(data);

                // TODO: 위 fetch 연결되면 아래 목데이터 라인 삭제
                await new Promise((resolve) => setTimeout(resolve, 300));
                setReason(getReasonDataForPlace(place));
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReason();
    }, [place]); // place가 바뀔 때마다 다시 조회

    const handleConfirmPlaylist = () => {
        // TODO: 실제 플레이리스트 상세/재생 페이지 라우팅 경로 확정되면 수정
        navigate(`/playlist?place=${encodeURIComponent(place)}`);
    };

    if (isLoading) return <LoadingPage />;

    if (error || !reason) {
        return (
            <div className=" min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-3">
                <p className="text-sm text-gray-500">{error || "추천 이유를 찾을 수 없어요."}</p>
                <button onClick={() => navigate(-1)} className=" text-sm font-medium text-violet-600">
                    이전으로 돌아가기
                </button>
            </div>
        );
    }

    const { place: reasonPlace, moodWords, backgroundImage, moodTags, curationNote, artistNote } = reason;

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="w-full max-w-md bg-white min-h-screen relative flex flex-col">

                {/* 상단 이미지 배경 + 뒤로가기 / 프로필 */}
                <div
                    className="h-80 w-full bg-gray-200 bg-cover bg-center relative shrink-0"
                    style={{ backgroundImage: `url(${backgroundImage})` }} // TODO: backgroundImage 실제 이미지로 교체되면 자동 반영됨
                >
                    <div className="absolute inset-0 bg-black/10" />

                    <button
                        onClick={() => navigate("/searchPlaceToMusic")}
                        aria-label="뒤로가기"
                        className="cursor-pointer absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm text-lg"
                    >
                        <ChevronLeft className="h-5 w-5 text-gray-900" />
                    </button>

                    {/* TODO: 와이어프레임에 있던 우측 상단 프로필 아바타 - 로그인 정보 연동 후 추가 (Header.jsx 참고) */}
                </div>

                {/* 본문 */}
                <div className="flex flex-col flex-1 px-6 pt-8 pb-15">
                    <h2 className="text-2xl font-bold text-center leading-snug">
                        {/* TODO: place, moodWords[0], moodWords[1] 전부 API 데이터로 교체 */}
                        {reasonPlace}의 <span className="text-violet-600">{moodWords[0]}</span>,
                         <span className="text-violet-600"> {moodWords[1]}</span> <br />
                        분위기를 기반으로 추천했어요
                    </h2>

                    {/* 분위기 태그 - TODO: moodTags 배열, 개수 가변 대응 이미 돼있음 (map 사용) */}
                    <div className="flex gap-2 justify-center flex-wrap mt-6">
                        {moodTags.map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* 큐레이션 / 아티스트 추천 카드 - TODO: curationNote, artistNote API 문구로 교체 */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="rounded-lg bg-gray-100 p-4 text-xs text-gray-700 leading-relaxed min-h-[90px] flex items-center whitespace-pre-line">
                            {curationNote}
                        </div>
                        <div className="rounded-lg bg-gray-100 p-4 text-xs text-gray-700 leading-relaxed min-h-[90px] flex items-center whitespace-pre-line">
                            {artistNote}
                        </div>
                    </div>

                    <div className="flex-1"></div>

                    {/* CTA */}
                    <button
                        onClick={handleConfirmPlaylist}
                        className="cursor-pointer w-full rounded-2xl bg-violet-200 hover:bg-violet-300 transition-colors py-4 text-lg font-bold text-gray-900"
                    >
                        플레이리스트 확인하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchPlaceToMusicReasonPage;