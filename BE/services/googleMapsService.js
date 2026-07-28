const axios = require("axios");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// 세부 관광지 검색
exports.searchPlaces = async (keyword) => {
    const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/textsearch/json",
        {
            params: {
                query: `${keyword} 관광지`,
                type: "tourist_attraction",
                language: "ko",
                key: API_KEY
            }
        }
    );

    return response.data.results;
};

// 도시/지역 자체 검색 (신규 - "관광지" 접미사 없이, locality 우선)
// 5개 메인 여행지(서울/부산/강릉/경주/제주) 등록 시 사용
exports.searchCity = async (cityName) => {
    const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/textsearch/json",
        {
            params: {
                query: cityName, // "관광지" 접미사 없이 도시명 자체로 검색
                language: "ko",
                key: API_KEY
            }
        }
    );
 
    const results = response.data.results;
 
    // locality(행정구역) 타입을 우선으로 선택, 없으면 첫 번째 결과로 대체
    const cityPlace = results.find(p => p.types?.includes("locality")) || results[0];
 
    return cityPlace ?? null;
};

exports.getPlaceDetails = async (placeId) => {
    const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
            params: {
                place_id: placeId,
                fields: "name,reviews,photos",
                language: "ko",
                key: API_KEY
            }
        }
    );

    return response.data.result;
};