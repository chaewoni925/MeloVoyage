// src/pages/music.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import MusicSection from "../../components/MusicSection";
import MyPlaylistEmptyState from "../../components/MyPlaylistEmptyState.jsx";
import { fetchPopularTracks, fetchMyMusic } from "../../api/music";

const mapTrack = (track) => ({
  id: track.spotifyTrackId,
  title: track.name,
  artist: track.artist,
  img: track.albumImageUrl,
});

const MusicPage = () => {
  const navigate = useNavigate();
  const [popularMusic, setPopularMusic] = useState([]);
  const [myMusic, setMyMusic] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMusic = async () => {
      setLoading(true);

      const [popularResult, myMusicResult] = await Promise.allSettled([
        fetchPopularTracks(),
        fetchMyMusic(),
      ]);

      if (popularResult.status === "fulfilled") {
        setPopularMusic(popularResult.value.map(mapTrack));
      } else {
        console.error("인기 음악 조회 실패:", popularResult.reason);
      }

      if (myMusicResult.status === "fulfilled") {
        setMyMusic((myMusicResult.value.tracks || []).map(mapTrack));
      } else {
        console.error("내 음악 조회 실패:", myMusicResult.reason);
        setMyMusic([]);
      }

      setLoading(false);
    };

    loadMusic();
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
      <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden">
        
        {/* 상단 영역 (고정) */}
        <div className="p-4 sm:p-6 pb-2">
          <Header />
          <div className="mt-4 sm:mt-5">
            <SearchBar placeholder="어떤 음악을 찾으시나요?" />
          </div>
        </div>

        {/* 중간 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto no-scrollbar mt-[-30px] p-4 sm:p-6  pb-6">
          <MusicSection title="인기 음악" musicList={popularMusic} />

          {myMusic.length > 0 ? (
            <div className="mt-8">
              <MusicSection title="내 음악" musicList={myMusic} />
            </div>
          ) : (
            <section className="px-2 mt-[15px]">
              <h1 className="text-lg sm:text-xl font-bold mb-3">내 음악</h1>
              <MyPlaylistEmptyState />
            </section>
          )}
        </div>

        {/* 하단 푸터 (고정) */}
        <Footer />
      </div>
    </div>
  );
};

export default MusicPage;