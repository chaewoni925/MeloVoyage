// src/pages/music.jsx
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';

const SearchPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="bg-white p-6 rounded-b-3xl w-full max-w-md relative">
                <Header />


                {/* 상단 글 */}
                <section className="flex flex-col items-center mt-[40px]">
                    <h1 className="text-[23px]  font-bold ">오늘은 어떤 여행을 하고 싶나요?</h1>
                </section>
        <section className="flex flex-col items-center mt-[20px]">
                    {/* 박스 1: 장소로 음악 찾기 */}
                    <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg h-50 w-[350px] mt-8 overflow-hidden relative"
                    onClick={() => navigate('/searchPlace')} >
                        <div
                            className="absolute inset-0 bg-cover bg-center rounded-lg"
                            style={{ backgroundImage: `url(${street})` }}
                        ></div>
                        <div className="relative z-10 p-2">
                            <h1 className="text-[18px] font-bold text-white mb-2 mt-20">장소로 음악 찾기</h1>
                            <p className="text-[11px] text-white">도시/ 지역 분위기를 기반으로 플레이리스트를 생성합니다</p>
                        </div>
                    </div>

                    {/* 박스 2: 음악으로 여행지 찾기  */}
                    <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg h-50 w-[350px] mt-8 overflow-hidden relative"
                    onClick={() => navigate('/searchMusic')}>
                        <div
                            className="absolute inset-0 bg-cover bg-center rounded-lg"
                            style={{ backgroundImage: `url(${wave})` }}
                        ></div>
                        <div className="relative z-10 p-2">
                            <h1 className="text-[18px] font-bold text-white mb-2 mt-20">음악으로 여행지 찾기</h1>
                            <p className="text-[11px] text-white">음악 분위기를 기반으로 여행지를 추천 합니다</p>
                        </div>
                    </div>
                </section>



                <Footer />
            </div>
        </div>
    );
};

export default SearchPage;