// src/pages/search/search.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header";
import street from '../../assets/street.png';
import { fetchPopularPlaces } from "../../api/map";

const SearchPage = () => {
    const navigate = useNavigate();
    const [placeImages, setPlaceImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const dragState = useRef({ isDragging: false, startX: 0 });

    useEffect(() => {
        const loadImages = async () => {
            try {
                const res = await fetchPopularPlaces();
                const destinations = res.destinations || [];

                // 사진이 있는 여행지만 골라서 랜덤으로 섞고 5개 추출 (스택 카드용)
                const withPhoto = destinations.filter((d) => d.photoUrl);
                const shuffled = [...withPhoto].sort(() => Math.random() - 0.5);
                setPlaceImages(shuffled.slice(0, 5));
            } catch (error) {
                console.error("여행지 사진 조회 실패:", error);
            }
        };
        loadImages();
    }, []);

    const images = placeImages.length > 0 ? placeImages.map((p) => p.photoUrl) : [street];
    const total = images.length;

    const getCardStyle = (index) => {
        if (index === currentIndex) {
            return { transform: 'translateX(0) scale(1)', opacity: 1, zIndex: 3, boxShadow: '0 20px 40px rgba(0,0,0,0.25)' };
        }
        if (index === (currentIndex + 1) % total) {
            return { transform: 'translateX(35%) scale(0.85)', opacity: 0.7, zIndex: 2 };
        }
        if (index === (currentIndex - 1 + total) % total) {
            return { transform: 'translateX(-35%) scale(0.85)', opacity: 0.7, zIndex: 2 };
        }
        return { transform: 'translateX(0) scale(0.7)', opacity: 0, zIndex: 1 };
    };

    const getCardRole = (index) => {
        if (index === currentIndex) return 'center';
        if (index === (currentIndex + 1) % total) return 'right';
        if (index === (currentIndex - 1 + total) % total) return 'left';
        return 'back';
    };

    const goTo = (index) => setCurrentIndex(((index % total) + total) % total);

    const handleDragStart = (e) => {
        dragState.current.isDragging = true;
        dragState.current.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    };

    const handleDragEnd = (e) => {
        if (!dragState.current.isDragging) return;
        dragState.current.isDragging = false;
        const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].clientX;
        const diff = dragState.current.startX - endX;
        if (Math.abs(diff) > 50) {
            goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
            {/* 카드 떠오르는 애니메이션 (첫번째 코드의 float 키프레임) */}
            <style>{`
                @keyframes mv-float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-10px) scale(1.02); }
                }
                .mv-float-inner {
                    animation: mv-float 6s ease-in-out infinite;
                    width: 100%;
                    height: 100%;
                }
            `}</style>

            <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden">

                {/* 상단 영역 (고정) */}
                <div className="p-4 sm:p-6 pb-2">
                    <Header />
                </div>

                {/* 중간 콘텐츠 영역 (스크롤) */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 pt-0 pb-6">

                    {/* 스택 카드 캐러셀 */}
                    <section className="mt-2 mb-2">
                        <div
                            className="relative h-[300px] w-full flex justify-center items-center overflow-hidden select-none"
                            style={{ perspective: '1000px' }}
                            onMouseDown={handleDragStart}
                            onMouseUp={handleDragEnd}
                            onTouchStart={handleDragStart}
                            onTouchEnd={handleDragEnd}
                        >
                            {images.map((url, index) => {
                                const role = getCardRole(index);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (role === 'right') goTo(currentIndex + 1);
                                            else if (role === 'left') goTo(currentIndex - 1);
                                            else if (role === 'center') navigate('/searchPlaceToMusic');
                                        }}
                                        className="absolute w-[260px] h-[300px] rounded-3xl bg-[#D9D9D9] shadow-lg cursor-pointer transition-all duration-500 ease-out overflow-hidden"
                                        style={getCardStyle(index)}
                                    >
                                        <div
                                            className={role === 'center' ? 'mv-float-inner bg-cover bg-center' : 'bg-cover bg-center w-full h-full'}
                                            style={{ backgroundImage: `url(${url})` }}
                                        ></div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 페이지네이션 도트 */}
                        <div className="flex justify-center space-x-2 mt-3">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    onClick={() => goTo(index)}
                                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                        index === currentIndex ? 'w-5 bg-[#6a5e95]' : 'w-2 bg-gray-300'
                                    }`}
                                ></div>
                            ))}
                        </div>
                    </section>

                    {/* 텍스트 + 버튼 박스: 그라데이션 배경 */}
                    <section className="px-1 mr-3 ml-3 mt-6 mb-8">
                        <div className="rounded-3xl p-4 bg-gradient-to-br from-[#6a5e95] to-[#3b2569] text-white shadow-lg">
                            <h2 className="text-xl font-bold m-2">장소로 음악 찾기</h2>
                            <p className="ml-2 text-[13px] text-purple-100 mb-6 opacity-90">
                                분위기를 기반으로 플레이리스트를 생성합니다.
                            </p>
                            <button
                                className="w-full py-3 bg-white text-[#3b2569] rounded-2xl font-bold text-[15px] text-center cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                                onClick={() => navigate('/searchPlaceToMusic')}
                            >
                                탐색 시작하기
                            </button>
                        </div>
                    </section>
                </div>

                {/* 하단 푸터 (고정) */}
                <Footer />
            </div>
        </div>
    );
};

export default SearchPage;