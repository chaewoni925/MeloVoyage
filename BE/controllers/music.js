const musicService = require("../services/musicService");

exports.getMyMusic = async (req, res) => {
    try {
        const result = await musicService.getMyMusic(req.user.id);
        res.status(200).json(result);

    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: "내 음악 조회 중 오류가 발생하였습니다."});


    }
};

exports.getPopularTracks = async (req, res) => {
    try {
        const tracks = await musicService.getPopularTracks();
        res.status(200).json({ tracks });
    } catch(err) {
         console.error(err);
        res.status(500).json({ error: "인기 음악 조회 중 오류가 발생했습니다." });
    }
};