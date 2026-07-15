// src/pages/search/searchPlaceToMusicReason.jsx

import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import NoLogoHeader from "../../components/NoLogoHeader";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';
import searchIcon from '../../assets/search.png';

// TODO: 백엔드 붙으면 GET /recommend/explain/playlist/:id 응답으로 전체 교체
// 아래 각 필드는 실제 API 응답 필드명이 확정되면 이름/구조 다시 맞춰야 함
const MOCK_REASON_DATA = {
    place: "도쿄",                  // TODO: 실제 여행지 이름 (검색/선택한 장소 기준)
    moodWords: ["몽환적인", "차분한"], // TODO: 헤드라인에 들어갈 분위기 형용사 2개 - AI 분석 결과로 교체
    backgroundImage: street,        // TODO: 여행지 실제 사진으로 교체 (여행지 DB의 이미지 URL)
    moodTags: ["몽환적", "차분함", "야경"], // TODO: 분위기 태그 목록 - 개수 가변적일 수 있음, 배열 길이 고정하지 말 것
    curationNote: "여행지의 몽환적 분위기 \n중심 큐레이션 문구입니다.", // TODO: AI가 생성한 실제 큐레이션 설명 문구
    artistNote: "여행지의 차분한 분위기에 \n어울리는 가수를 추천했어요.", // TODO: AI가 생성한 실제 아티스트 추천 이유 문구
};

const SearchPlaceToMusicReasonPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // 라우터 예: /search/place-to-music/reason/:id

    const [reason, setReason] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReason = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // TODO: 실제 엔드포인트 연결되면 아래 3줄 주석 해제
                // const res = await fetch(`/recommend/explain/playlist/${id}`);
                // if (!res.ok) throw new Error("추천 이유를 불러오지 못했습니다.");
                // const data = await res.json();
                // setReason(data);

                // TODO: 위 fetch 연결되면 아래 목데이터 라인 삭제
                await new Promise((resolve) => setTimeout(resolve, 300));
                setReason(MOCK_REASON_DATA);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReason();
    }, [id]);

    const handleConfirmPlaylist = () => {
        // TODO: 실제 플레이리스트 상세/재생 페이지 라우팅 경로 확정되면 수정
        navigate(`/playlist/${id ?? ""}`);
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

    const { place, moodWords, backgroundImage, moodTags, curationNote, artistNote } = reason;

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
                        onClick={() => navigate(-1)}
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
                        {place}의 <span className="text-violet-600">{moodWords[0]}</span>,
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