const { extractTags } = require("./utils/tagMapper");

const reviews = [

    {
        text: "바다가 정말 예쁘고 조용해서 힐링하기 좋았어요."
    }

];

console.log(extractTags(reviews));