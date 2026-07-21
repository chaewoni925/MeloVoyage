const axios = require("axios");

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

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