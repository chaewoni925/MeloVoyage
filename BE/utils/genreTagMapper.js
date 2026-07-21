const genreTagMap = {
    jazz: ["감성", "차분함"],
    pop: ["감성", "활기참"],
    rock: ["액티브", "자연"],
    ballad: ["힐링", "차분함"],
    kpop: ["활기참", "포토스팟"],
    hiphop: ["도시", "야경"],
    classical: ["차분함", "문화"],
    edm: ["액티브", "야경"],
    indie: ["감성", "산책"]
};

exports.getTagsFromGenres = (genres) => {
    const tags = new Set();

    for (const genre of genres) {
        const mappedTags = genreTagMap[genre.toLowerCase()];

        if (mappedTags) {
            mappedTags.forEach(tag => tags.add(tag));
        }
    }

    return [...tags];
};