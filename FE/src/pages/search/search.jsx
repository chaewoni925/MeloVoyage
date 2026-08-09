// src/pages/search/search.jsx
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';
import compass from '../../assets/compass.png';

const SearchPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
            <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden">

                {/* 상단 영역 (고정) */}
                <div className="p-4 sm:p-6 pb-2">
                    <Header />
                </div>

                {/* 중간 콘텐츠 영역 (스크롤) */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 pt-0 pb-6">

                    {/* 상단 글 */}
                    <section className="flex flex-col items-left ml-[15px] mt-[-18px]">
                        <h1 className="text-[22px] font-bold "> 오늘은 어떤 여행을
                            <br /> 하고 싶나요?</h1>
                    </section>

                    <section className="flex flex-col items-center mt-[20px]">

                        {/* 장소로 음악 찾기 */}
                        <div className="w-full">
                            {/* 사진 영역 */}
                            <div
                                className="cursor-pointer bg-[#D9D9D9] rounded-2xl h-[300px] mr-4 ml-4 overflow-hidden relative"
                                onClick={() => navigate('/searchPlaceToMusic')}
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center rounded-2xl"
                                    style={{ backgroundImage: `url(${street})` }}
                                ></div>
                            </div>

                            {/* 텍스트 + 버튼 박스: 그라데이션 배경 */}
                            <div className="mt-4 ml-4 mr-4 bg-gradient-to-br from-[#928CB1] to-[#6950A2] to-[#24005B] p-4 rounded-2xl">
                                <h2 className="text-white font-bold text-[19px] mt-2 mb-1">장소로 음악 찾기</h2>
                                <p className="text-white/80 text-[11px]">
                                    도시/지역 분위기를 기반으로 플레이리스트를 생성합니다.
                                </p>
                                <button
                                    className="mt-6 w-full py-3 bg-white text-[#630ed4] rounded-2xl font-bold text-[15px] text-center cursor-pointer"
                                    onClick={() => navigate('/searchPlaceToMusic')}
                                >
                                    탐색 시작하기
                                </button>
                            </div>
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