// src/api/recommend.js
import instance from './axios'; // 설정된 axios 인스턴스 사용

// 플레이리스트 생성 이유 조회 API
export const fetchPlaylistExplanation = async (recommendationId) => {
  try {
    const response = await instance.get(`/recommend/explain/playlist/${recommendationId}`, {
      withCredentials: true, // 쿠키 인증 필수
    });
    return response.data;
  } catch (error) {
    console.error("플레이리스트 추천 이유 불러오기 실패:", error);
    throw error;
  }
};