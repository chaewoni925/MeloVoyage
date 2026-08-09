// src/api/music.js
import instance from "./axios";

export const fetchPopularTracks = async () => {
  const res = await instance.get("/music/popular");
  console.log("popular tracks 응답:", res.data);
  return res.data.tracks;
};

export const fetchMyMusic = async () => {
  const res = await instance.get("/music/mine");
  return res.data;
};

// 저장한 플레이리스트 전체 목록 조회
export const fetchMyPlaylists = async () => {
  const res = await instance.get("/storage/");
  return res.data; // { success, data: [...] }
};

// 특정 플레이리스트 상세 조회 (첫 곡 이미지 등에 사용)
export const fetchPlaylistDetail = async (id) => {
  const res = await instance.get(`/storage/${id}`);
  return res.data; // { success, data: { ...tracks: [...] } }
};