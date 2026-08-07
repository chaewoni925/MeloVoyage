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