// 테스트용
require("dotenv").config();

const { embed } = require("../services/embeddService");

async function main() {

    const vector = await embed(

        `
        Genre: city pop

        Mood:
        드라이브
        노을
        여름
        레트로
        `
    );

    console.log("차원 :", vector.length);

    console.log(vector.slice(0,10));

}

main();