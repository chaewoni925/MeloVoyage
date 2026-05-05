// src/pages/music.jsx
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import SearchingPage from '../searching/Searching.jsx'
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";


const MusicPage = () => {
  const navigate = useNavigate();

  return (
   <div className="min-h-screen bg-gray-100 flex justify-center">
      
  <div className="bg-white p-6 rounded-b-3xl ">
<Header />
<main className="space-y-2 mt-1 bg-[#FCF9F8] -mx-6 -mt-6 px-6 pt-6">

        <SearchBar placeholder="어떤 음악을 찾으시나요?" />

        <h1 className="text-[20px] font-bold ">인기 음악</h1>
        
        <div className="flex gap-6">
        
        <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg w-[180px] h-55 "></div>
        <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg w-[180px] h-55 "> </div>
        
        </div>

        <h1 className="text-[20px] font-bold"> 내 음악 </h1>

        <div className="flex gap-6">
        <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg w-[180px] h-[220px] "></div>
        <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg w-[180px] h-[220px] "></div>
        </div>

        <h1 className="text-[20px] font-bold"> 사용자 참여형(논의필요) </h1>
        <div className="flex gap-6">
        <div className="cursor-pointer bg-purple-100 p-4 rounded-lg h-45 w-96"></div>
        </div>


      </main>
       <Footer/>
      </div>
    </div>

  );
};

export default MusicPage;