// src/pages/music.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import MusicSection from "../../components/MusicSection";
import MyPlaylistEmptyState from "../../components/MyPlaylistEmptyState.jsx";
import { fetchPopularTracks, fetchMyPlaylists, fetchPlaylistDetail } from "../../api/music";
import instance from "../../api/axios";

const mapTrack = (track) => ({
  id: track.spotifyTrackId || track.id,
  title: track.name,
  artist: track.artist,
  img: track.albumImageUrl,
});

const MusicPage = () => {
  const navigate = useNavigate();
  const [popularMusic, setPopularMusic] = useState([]);
  const [latestTracks, setLatestTracks] = useState([]);
  const [latestPlaylistTitle, setLatestPlaylistTitle] = useState("");
  const [latestPlaylistId, setLatestPlaylistId] = useState(null);
  const [playlistsLoading, setPlaylistsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 💡 마우스 드래그 스크롤 관련 상태 및 Ref
  const scrollRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(x - startX) > 5) {
      setIsDragging(true);
    }
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const loadMusic = async () => {
      setPlaylistsLoading(true);

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
        const playlists = playlistResult.value?.data || playlistResult.value || [];

        if (playlists.length > 0) {
          const sorted = [...playlists].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          const latest = sorted[0];

          setLatestPlaylistId(latest.id);
          setLatestPlaylistTitle(latest.title || "");

          try {
            const detailResult = await fetchPlaylistDetail(latest.id);
            const tracks = detailResult?.data?.tracks || detailResult?.tracks || [];
            setLatestTracks(tracks.map(mapTrack));
          } catch (error) {
            console.error("최근 플리 곡 상세 조회 실패:", error);
            setLatestTracks([]);
          }
        } else {
          setLatestTracks([]);
          setLatestPlaylistTitle("");
          setLatestPlaylistId(null);
        }
      } else {
        console.error("내 플레이리스트 조회 실패:", playlistResult.reason);
        setLatestTracks([]);
        setLatestPlaylistTitle("");
        setLatestPlaylistId(null);
      }

      setPlaylistsLoading(false);
    };

    loadMusic();
  }, []);

  // 💡 서치바 검색 핸들러 (진짜 여행지 이름으로 추천 요청)
  const handleSearch = async (keyword) => {
    const query = (keyword ?? searchQuery).trim();
    if (!query) {
      alert("어떤 여행지를 찾으시는지 입력해주세요!");
      return;
    }

    try {
      const response = await instance.post(
        "/recommend/playlist",
        { destinationQuery: query },
        { withCredentials: true }
      );

      if (response.data.success) {
        const recommendationId = response.data.data.recommendationId;
        navigate(`/loading/${recommendationId}`, {
          state: { nextPath: "/searchPlaceToMusicReason" },
        });
      }
    } catch (error) {
      console.error("추천 요청 실패:", error);
      alert("추천을 불러오는데 실패했어요. 다시 시도해주세요!");
    }
  };

  // 💡 음악/노래 선택 시 -> 여행지 선택 페이지(/searchPlaceToMusic)로 이동해 진짜 여행지 이름으로 추천받게 함
  const handleTrackRecommend = (track) => {
    if (isDragging) return;
    navigate("/searchPlaceToMusic", { state: { selectedTrack: track.title } });
  };

  // 내 음악 카드/제목 클릭 시 -> 내 플레이리스트 상세 페이지(/Playlist)로 이동
  const handleMyTrackClick = () => {
    if (isDragging) return;
    if (latestPlaylistId) {
      navigate('/Playlist', { state: { playlistId: latestPlaylistId } });
    } else {
      navigate('/Storage');
    }
  };

  const filteredMusic = popularMusic.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
      <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden">

        {/* 상단 영역 (고정) */}
        <div className="p-4 sm:p-6 pb-2">
          <Header />
          <div className="mt-4 sm:mt-5">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              placeholder="어떤 여행지를 찾으시나요?"
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* 중간 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto no-scrollbar mt-[-10px] p-4 sm:p-6 pb-6">
          
          {searchQuery.trim() !== "" ? (
            <section className="px-2">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-[18px] font-bold text-gray-900">
                  검색 결과 <span className="text-violet-600">({filteredMusic.length})</span>
                </h1>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    지우기
                  </button>
                )}
              </div>

              {filteredMusic.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredMusic.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => handleTrackRecommend(track)}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-gray-100 hover:border-violet-300 hover:shadow-xs transition-all cursor-pointer group"
                    >
                      {track.img ? (
                        <img
                          src={track.img}
                          alt={track.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-100 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center text-gray-400 font-semibold">
                          ♪
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {track.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {track.artist}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-gray-400">
                  <p className="text-sm font-medium">'{searchQuery}'에 대한 검색 결과가 없습니다.</p>
                  <p className="text-xs text-gray-300 mt-1">다른 음악이나 아티스트 이름으로 검색해보세요.</p>
                </div>
              )}
            </section>
          ) : (
            <>
              {/* 인기 음악 카드 클릭 시 -> 여행지 선택/검색 페이지로 이동해 진짜 여행지 이름으로 추천 요청 */}
              <MusicSection 
                title="인기 음악" 
                musicList={popularMusic} 
                onTrackClick={handleTrackRecommend}
              />

              {playlistsLoading ? (
                <section className="pl-2 pr-2 mt-5">
                  <h1 className="text-[20px] font-bold mb-[10px]">내 음악</h1>
                  <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-40 rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                      >
                        <div className="h-36 bg-gray-100" />
                        <div className="p-4">
                          <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : latestTracks.length > 0 ? (
                <section className="pl-2 pr-2 mt-5">
                  <div 
                    className="flex items-center gap-2 mb-[10px] cursor-pointer group"
                    onClick={handleMyTrackClick}
                  >
                    <h1 className="text-[20px] font-bold text-gray-900 shrink-0 group-hover:text-violet-600 transition-colors">
                      내 음악
                    </h1>
                    {latestPlaylistTitle && (
                      <span className="text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-1 rounded-full truncate max-w-[200px]">
                        {latestPlaylistTitle}
                      </span>
                    )}
                  </div>
                  
                  <div
                    ref={scrollRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className="flex gap-4 overflow-x-auto no-scrollbar select-none cursor-grab active:cursor-grabbing"
                  >
                    {latestTracks.map((track) => (
                      <div
                        key={track.id}
                        onClick={handleMyTrackClick}
                        className="cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex-shrink-0 w-40 snap-start"
                      >
                        <div className="h-36 bg-gray-100 relative overflow-hidden flex items-center justify-center pointer-events-none">
                          {track.img ? (
                            <img
                              src={track.img}
                              alt={track.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-3xl text-gray-300">♪</span>
                          )}
                        </div>

                        <div className="p-4 pointer-events-none">
                          <h3 className="font-bold text-gray-900 truncate">{track.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 truncate">{track.artist}</p>
                        </div>
                      </div>
                    ))}

                    <div
                      onClick={() => {
                        if (isDragging) return;
                        navigate("/search");
                      }}
                      className="flex-shrink-0 w-40 aspect-square rounded-2xl border-[1.5px] border-dashed border-[#C9B8FF] bg-[#F1ECFF] flex flex-col items-center justify-center gap-2.5 cursor-pointer snap-start hover:bg-[#e6ddff] transition-colors"
                    >
                      <div className="w-[38px] h-[38px] rounded-full bg-[#7C4DFF] text-white flex items-center justify-center text-xl leading-none">
                        +
                      </div>
                      <p className="text-[13px] font-semibold text-[#7C4DFF] text-center leading-snug">
                        플레이리스트<br />만들기
                      </p>
                    </div>

                    {latestTracks.length === 1 && (
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
            </>
          )}

        </div>

        {/* 하단 푸터 (고정) */}
        <Footer />
      </div>
    </div>
  );
};

export default MusicPage;