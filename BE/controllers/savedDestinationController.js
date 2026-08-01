const savedDestinationService = require("../services/savedDestinationService");

// -----------------------------
// GET /map/search?keyword=  (map 탭 검색 - 등록 + 프로필 완성까지)
// -----------------------------
exports.searchAndPrepare = async (req, res) => {
    try {
        const { keyword } = req.query;
        if (!keyword || keyword.trim() === "") {
            return res.status(400).json({ error: "검색어를 입력해주세요." });
        }
        const destination = await savedDestinationService.searchAndPrepareDestination(keyword);
        res.status(200).json(destination);
    } catch (err) {
        console.error(err);
        if (err.message === "여행지를 찾을 수 없습니다.") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "여행지 검색 중 오류가 발생했습니다." });
    }
};

// -----------------------------
// POST /map/destinations/:id/save
// -----------------------------
exports.save = async (req, res) => {
    try {
        const { id } = req.params;
        const saved = await savedDestinationService.saveDestination(req.user.id, id);
        res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        if (err.message === "여행지를 찾을 수 없습니다.") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "저장 중 오류가 발생했습니다." });
    }
};

// -----------------------------
// GET /map/destinations/saved
// -----------------------------
exports.getSaved = async (req, res) => {
    try {
        const destinations = await savedDestinationService.getSavedDestinations(req.user.id);
        res.status(200).json({ destinations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "조회 중 오류가 발생했습니다." });
    }
};

// -----------------------------
// DELETE /map/destinations/:id/save
// -----------------------------
exports.unsave = async (req, res) => {
    try {
        const { id } = req.params;
        await savedDestinationService.unsaveDestination(req.user.id, id);
        res.status(200).json({ message: "저장이 취소되었습니다." });
    } catch (err) {
        console.error(err);
        if (err.message === "저장된 여행지를 찾을 수 없습니다.") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: "저장 취소 중 오류가 발생했습니다." });
    }
};