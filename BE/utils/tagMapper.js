const keywordMap = {
    "바다": ["바다", "휴양"],
    "해변": ["바다", "휴양"],
    "조용": ["차분함"],
    "힐링": ["휴양"],
    "시원": ["시원함"],
    "산": ["자연"],
    "숲": ["자연"],
    "공원": ["자연"],
    "야경": ["야경"],
    "사진": ["포토스팟"],
    "포토": ["포토스팟"],
    "카페": ["감성"],
    "예쁘": ["감성"],
    "맛": ["미식"],
    "음식": ["미식"],
    "걷": ["산책"],
    "산책": ["산책"]
};

exports.extractTags = (reviews) => {
    const tags = new Set();

    for (const review of reviews) {

        const text = review.text || "";

        for (const keyword in keywordMap) {

            if (text.includes(keyword)) {

                keywordMap[keyword].forEach(tag => tags.add(tag));

            }

        }

    }

    return [...tags];
};