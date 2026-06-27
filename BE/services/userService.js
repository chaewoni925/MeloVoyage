const prisma = require("../config/prisma");

exports.getMyPage = async () => {
    const user = await prisma.user.findUnique({
        where: {
            id: 1
        }
    });

    return user;
};
    
exports.updateMyPage = async (data) => {
    return {
        id: 1,
        ...data
    };
};
