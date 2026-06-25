// src/pages/search/searchMusicReason.jsx

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';
import searchIcon from '../../assets/search.png';


const SearchMusicReasonPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    // 검색 실행 함수: 엔터 입력 시 실행됨
    const handleSearch = (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        if (searchQuery.trim()) {
            // LoadingPage로 이동
            navigate("/Loading");
        }
    };

    return (

        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="bg-white p-6 rounded-b-3xl w-full max-w-md relative">
                <Header />

                {/* 상단 글 */}
                <section className="flex flex-col  mt-[44px]">
                    <h1 className="text-[23px] font-bold mb-2 "> 어떤 장소에 가고 싶나요?</h1>
                    <p>당신의 여행과 함께 할 음악을 찾아보세요 </p>
                </section>


                {/*최근 여행지*/}
                <section>
                    <h1 className="text-purple-600 text-[15px] font-bold mt-[30px] mb-[10px]">
                        최근 여행지 </h1>
                    <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar ">
                        <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-[20px] w-[90px] h-[10px] "></div>
                        <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-[20px] w-[90px] h-[10px] "></div>
                        <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-[20px] w-[90px] h-[10px] "></div>
                        <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-[20px] w-[90px] h-[10px] "></div>



                    </div>
                    <div className="flex justify-end">
                        <p className=" flex flex-col text-gray-600 text-[12px] font-bold mt-[10px] cursor-pointer">
                            모두지우기
                        </p>
                    </div>
                </section>


                {/*추천 박스-회원정보랑 여행지 정보 연결해야함(아직 미연결)*/}
                <section>
                    <div className="flex flex-col mt-[40px] gap-6">
                        <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg w-full h-[220px]  ">
                            <h1 className="mt-[120px] text-[20px] font-bold">ooo님, oo은 어때요?</h1>
                        </div>
                        <div className="mt-[5px] cursor-pointer bg-[#D9D9D9] p-4 rounded-lg w-full h-[220px] ">
                            <h1 className="mt-[120px] text-[20px] font-bold">ooo님, oo은 어때요?</h1>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        </div>
    );
};

export default SearchMusicReasonPage;