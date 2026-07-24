// src/pages/music.jsx
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';
import compass from '../../assets/compass.png';

const SearchPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="bg-white p-6 rounded-b-3xl w-full max-w-md relative">
                <Header />


                {/* 상단 글 */}
                <section className="flex flex-col items-left ml-[25px] mt-[40px]">
                    <h1 className="text-[20px] font-bold "> 오늘은 어떤 여행을 
                        <br/> 하고 싶나요?</h1>
                </section>


                <section className="flex flex-col items-center mt-[35px]">

                    {/* 장소로 음악 찾기 */}
                    <div className="w-[350px]">
                        {/* 사진 영역 */}
                        <div
                            className="cursor-pointer bg-[#D9D9D9] rounded-lg h-[300px] w-full overflow-hidden relative"
                            onClick={() => navigate('/searchPlaceToMusic')}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center rounded-lg"
                                style={{ backgroundImage: `url(${street})` }}
                            ></div>
                        </div>

                        {/* 텍스트 + 버튼 박스: 그라데이션 배경 */}
                        <div className="mt-4 bg-gradient-to-br from-[#928CB1] to-[#6950A2] to-[#24005B] p-4 rounded-2xl">
                            <h2 className="text-white font-bold text-[19px] mt-2 mb-1">장소로 음악 찾기</h2>
                            <p className="text-white/80 text-[11px]">
                                도시/지역 분위기를 기반으로 플레이리스트를 생성합니다.
                            </p>
                            <button
                                className="mt-6 w-full py-3 bg-white text-[#630ed4] rounded-xl font-bold text-[15px] text-center cursor-pointer"
                                onClick={() => navigate('/searchPlaceToMusic')}
                           >
                                탐색 시작하기
                            </button>
                        </div>
                    </div>
                </section>



                <Footer />
            </div>
        </div>
    );
};

export default SearchPage;