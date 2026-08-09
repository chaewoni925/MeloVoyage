import axiosInstance from "./axios";
// 인기 여행지 (홈 화면용 전체 목록 조회)
export const fetchPopularPlaces = async () => {
  const res = await axiosInstance.get("/destinations/");
  return res.data;
};

// 내 여행지 (저장한 여행지 목록)
export const fetchMyPlaces = async () => {
  const res = await axiosInstance.get("/map/destinations/saved");
  return res.data; // { destinations: [...] }
};

// map 탭 검색 (등록 + 프로필 완성까지)
export const searchDestination = async (keyword) => {
  const res = await axiosInstance.get("/map/search", {
    params: { keyword },
  });
  return res.data;
};

// 여행지 저장
export const savePlace = async (id) => {
  const res = await axiosInstance.post(`/map/destinations/${id}/save`);
  return res.data;
};

// 여행지 저장 취소
export const unsavePlace = async (id) => {
  const res = await axiosInstance.delete(`/map/destinations/${id}/save`);
  return res.data;
};