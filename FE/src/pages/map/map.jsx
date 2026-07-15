// src/pages/map.jsx
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";

// TODO: 백엔드 붙으면 GET /places/popular 응답으로 교체
// 배열에 항목을 추가/삭제하면 카드 개수는 자동으로 그만큼 늘어나거나 줄어듦 (map 렌더링이라 별도 수정 불필요)
const MOCK_POPULAR_PLACES = [
    { id: 1, title: "제주도", desc: "푸른 바다와 함께", img: "https://via.placeholder.com/150" },
    { id: 2, title: "강릉", desc: "커피와 파도 소리", img: "https://via.placeholder.com/150" },
    { id: 3, title: "부산", desc: "활기찬 해운대", img: "https://via.placeholder.com/150" },
];

// TODO: 백엔드 붙으면 GET /users/mypage/places (혹은 유사 엔드포인트) 응답으로 교체
const MOCK_MY_PLACES = [
    { id: 1, title: "나의 아지트", desc: "조용한 공원", img: "https://via.placeholder.com/150" },
    { id: 2, title: "자주 가는 카페", desc: "단골 카페", img: "https://via.placeholder.com/150" },
    { id: 3, title: "최애 바다", desc: "혼자 힐링", img: "https://via.placeholder.com/150" },
];

// 인기 여행지 / 내 여행지 공통으로 쓰는 카드 컴포넌트
// -> 데이터 추가되면 이 컴포넌트가 그대로 재사용되어 카드가 늘어남
const PlaceCard = ({ place, onClick }) => (
    <div
        onClick={() => onClick(place)}
        className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg flex-shrink-0 w-[160px] shadow-sm snap-start"
    >
        <img
            src={place.img}
            alt={place.title}
            className="w-full h-32 object-cover rounded-md"
        />
        <div className="mt-2">
            <p className="font-bold text-sm truncate">{place.title}</p>
            <p className="text-xs text-gray-500">{place.desc}</p>
        </div>
    </div>
);

// 가로 스크롤 카드 리스트 섹션 (제목 + 카드들 + 빈 상태 메시지)
const PlaceCardSection = ({ title, places, onCardClick }) => (
    <section className="pl-2 pr-2">
        <h1 className="text-[20px] font-bold mt-[5px] mb-[10px]">{title}</h1>
        {places.length === 0 ? (
            <p className="px-2 text-[12px] text-gray-400">아직 등록된 여행지가 없어요</p>
        ) : (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-2">
                {places.map((place) => (
                    <PlaceCard key={place.id} place={place} onClick={onCardClick} />
                ))}
            </div>
        )}
    </section>
);

const MapPage = () => {
    const navigate = useNavigate();

    // 카드 클릭 시 searchPlaceToMusic 흐름과 동일하게 loading -> reason 페이지로 이동
    // TODO: 원치 않는 흐름이면 이 함수만 원하는 라우팅 경로로 수정
    const handlePlaceClick = (place) => {
        const nextPath = `/searchPlaceToMusicReason?place=${encodeURIComponent(place.title)}`;
        navigate("/loading", { state: { nextPath, query: place.title } });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="bg-white p-6 rounded-b-3xl w-full max-w-md relative">
                <Header />

                <div className="mt-[20px] mb-6">
                    <SearchBar placeholder="어떤 여행지를 찾으시나요?" />
                </div>

                <PlaceCardSection
                    title="인기 여행지"
                    places={MOCK_POPULAR_PLACES}
                    onCardClick={handlePlaceClick}
                />

                <PlaceCardSection
                    title="내 여행지"
                    places={MOCK_MY_PLACES}
                    onCardClick={handlePlaceClick}
                />

                {/* 사용자 참여형 
                <section className="px-2 mb-20">
                    <h1 className="text-[20px] font-bold mt-[10px] mb-4">사용자 참여형</h1>
                    <div className="cursor-pointer bg-purple-100 p-4 rounded-lg h-32 w-full"></div>
                </section> */}

                <Footer />
            </div>
        </div>
    );
};

export default MapPage;