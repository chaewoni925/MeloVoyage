// src/pages/music.jsx
import { useNavigate } from "react-router-dom";
// src/pages/music.jsx
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import MusicSection from "../../components/MusicSection";
import { popularMusic, myMusic } from "../../api/mock/mockMusic";

const MusicPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="bg-white p-6 rounded-b-3xl w-full max-w-md relative">
        <Header />

        <div className="mt-[20px] mb-6">
          <SearchBar placeholder="어떤 음악을 찾으시나요?" />
        </div>

        <MusicSection title="인기 음악" musicList={popularMusic} />
        <MusicSection title="내 음악" musicList={myMusic} />

        <Footer />
      </div>
    </div>
  );
};

export default MusicPage;