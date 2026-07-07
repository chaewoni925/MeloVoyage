const googleMapsService = require("../services/googleMapsService");
const { extractTags } = require("../utils/tagMapper");

exports.searchDestination = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        const places = await googleMapsService.searchPlaces(keyword);

        res.status(200).json({
            success: true,
            data: places
        });
    } catch (err) {
        next(err);
    }
};

const destinationService = require("../services/destinationService");

exports.importDestinations = async (req, res, next) => {
    try {
        const { keyword } = req.body;

        const count = await destinationService.importDestinations(keyword);

        res.status(201).json({
            success: true,
            message: `${count}개의 여행지를 저장했습니다.`
        });

    } catch (err) {
        next(err);
    }
};

exports.getAllDestinations = async (req, res, next) => {
    try {
        const destinations = await destinationService.getAllDestinations();

        res.json({
            success: true,
            data: destinations
        });
    } catch (err) {
        next(err);
    }
};

exports.getDestinationById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const destination = await destinationService.getDestinationById(id);

        if (!destination) {
            return res.status(404).json({
                success: false,
                message: "여행지를 찾을 수 없습니다."
            });
        }

        res.status(200).json({
            success: true,
            data: destination
        });

    } catch (err) {
        next(err);
    }
};

exports.searchDestinations = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        const destinations = await destinationService.searchDestinations(keyword);

        res.status(200).json({
            success: true,
            data: destinations
        });

    } catch (err) {
        next(err);
    }
};

exports.getDestinationReviews = async (req, res, next) => {
    try {
        const { placeId } = req.params;

        const details = await destinationService.getDestinationReviews(placeId);

        const reviews = details.reviews || [];

        const tags = extractTags(reviews);

        const destination = await destinationService.getDestinationByGooglePlaceId(placeId);

        if (destination) {
            await destinationService.saveTags(destination.id, reviews);
        }

        res.status(200).json({
            success: true,
            data: {
                ...details,
                tags
            }
        });

    } catch (err) {
        next(err);
    }
};