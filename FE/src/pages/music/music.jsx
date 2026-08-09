// src/pages/music.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import MusicSection from "../../components/MusicSection";
import MyPlaylistEmptyState from "../../components/MyPlaylistEmptyState.jsx";
import { fetchPopularTracks, fetchMyPlaylists, fetchPlaylistDetail } from "../../api/music";

const mapTrack = (track) => ({
  id: track.spotifyTrackId,
  title: track.name,
  artist: track.artist,
  img: track.albumImageUrl,
});

const MusicPage = () => {
  const navigate = useNavigate();
  const [popularMusic, setPopularMusic] = useState([]);
  const [myPlaylists, setMyPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMusic = async () => {
      setLoading(true);

      const [popularResult, playlistResult] = await Promise.allSettled([
        fetchPopularTracks(),
        fetchMyPlaylists(),
      ]);

      if (popularResult.status === "fulfilled") {
        const shuffled = [...popularResult.value].sort(() => Math.random() - 0.5);
        setPopularMusic(shuffled.map(mapTrack));
      } else {
        console.error("인기 음악 조회 실패:", popularResult.reason);
      }

      if (playlistResult.status === "fulfilled") {
        const playlists = playlistResult.value.data || [];

        // 각 플레이리스트의 첫 곡 이미지를 가져오기 위해 상세 조회를 병렬로 실행
        const detailResults = await Promise.allSettled(
          playlists.map((p) => fetchPlaylistDetail(p.id))
        );

        const playlistsWithCover = playlists.map((playlist, idx) => {
          const detailResult = detailResults[idx];
          const firstTrack =
            detailResult.status === "fulfilled"
              ? detailResult.value.data?.tracks?.[0]
              : null;

          return {
            ...playlist,
            coverImg: firstTrack?.albumImageUrl || null,
          };
        });

        setMyPlaylists(playlistsWithCover);
      } else {
        console.error("내 플레이리스트 조회 실패:", playlistResult.reason);
        setMyPlaylists([]);
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

          {myPlaylists.length > 0 ? (
            <section className="pl-2 pr-2 mt-5">
              <h1 className="text-[20px] font-bold mb-[10px]">내 음악</h1>
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
                {myPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => navigate(`/storage/${playlist.id}`)}
                    className="cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex-shrink-0 w-40 snap-start"
                  >
                    <div className="h-36 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                      {playlist.coverImg ? (
                        <img
                          src={playlist.coverImg}
                          alt={playlist.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-3xl text-gray-300">♪</span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 truncate">{playlist.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {new Date(playlist.createdAt).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* 플레이리스트 만들기 카드 - 항상 목록 맨 끝에 위치 */}
                <div
                  onClick={() => navigate("/search")}
                  className="flex-shrink-0 w-40 aspect-square rounded-2xl border-[1.5px] border-dashed border-[#C9B8FF] bg-[#F1ECFF] flex flex-col items-center justify-center gap-2.5 cursor-pointer snap-start"
                >
                  <div className="w-[38px] h-[38px] rounded-full bg-[#7C4DFF] text-white flex items-center justify-center text-xl leading-none">
                    +
                  </div>
                  <p className="text-[13px] font-semibold text-[#7C4DFF] text-center leading-snug">
                    플레이리스트<br />만들기
                  </p>
                </div>

                {/* 플리가 1개뿐일 때만 회색 placeholder 카드 하나 추가 */}
                {myPlaylists.length === 1 && (
                  <div className="flex-shrink-0 w-40 aspect-square rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center snap-start">
                    <span className="text-2xl text-gray-300">♪</span>
                  </div>
                )}
              </div>
            </section>
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