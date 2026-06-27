exports.getMyPage = async () => {
    return {
        id: 1,
        nickname: "Park",
        email: "park@test.com"
    };
};

exports.updateMyPage = async (data) => {
    return {
        id: 1,
        ...data
    };
};
