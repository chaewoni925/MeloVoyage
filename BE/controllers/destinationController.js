const googleMapsService = require("../services/googleMapsService");
const destinationService = require("../services/destinationService");

// exports.searchDestination = async (req, res, next) => {
//     try {
//         const { keyword } = req.query;

//         const places = await googleMapsService.searchPlaces(keyword);

//         res.status(200).json({
//             success: true,
//             data: places
//         });
//     } catch (err) {
//         next(err);
//     }
// };
exports.searchDestinations = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword || keyword.trim() === "") {
            return res.status(400).json({ error: "검색어를 입력해주세요." });
        }

        const destinations = await destinationService.searchDestinations(keyword);

        res.status(200).json({
            success: true,
            data: destinations
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "여행지 검색 중 오류가 발생했습니다." });
    }
};

exports.getAllDestinations = async (req, res) => {
    try {
        const destinations = await destinationService.getAllDestinations();
        res.status(200).json({ destinations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "여행지 목록 조회 중 오류가 발생했습니다." });
    }
};

exports.getDestinationById = async (req, res) => {
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
        console.error(err);
        res.status(500).json({ error: "여행지 조회 중 오류가 발생했습니다." });
    }
};

exports.importDestinations = async (req, res) => {
    try {
        const { keyword } = req.body;

        if (!keyword || keyword.trim() === "") {
            return res.status(400).json({ error: "keyword가 필요합니다." });
        }

        const count = await destinationService.importDestinations(keyword);

        res.status(201).json({
            success: true,
            message: `${count}개의 여행지를 저장했습니다.`
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "여행지 등록 중 오류가 발생했습니다." });
    }
};

// exports.getDestinationReviews = async (req, res, next) => {
//     try {
//         const { placeId } = req.params;

//         const details = await destinationService.getDestinationReviews(placeId);

//         const reviews = details.reviews || [];

//         const tags = extractTags(reviews);

//         const destination = await destinationService.getDestinationByGooglePlaceId(placeId);

//         if (destination) {
//             await destinationService.saveTags(destination.id, reviews);
//         }

//         res.status(200).json({
//             success: true,
//             data: {
//                 ...details,
//                 tags
//             }
//         });

//     } catch (err) {
//         next(err);
//     }
// };