// VOYAGE 호출해서 임베딩
require("dotenv").config();

const { VoyageAIClient } = require("voyageai");

const client = new VoyageAIClient({
    apiKey: process.env.VOYAGE_API_KEY,
});

/**
 * 문자열 하나를 Voyage AI 임베딩으로 변환
 * @param {string} text
 * @returns {Promise<number[]>}
 */
async function embed(text) {
    if (!text || text.trim() === "") {
        throw new Error("Embedding text is empty.");
    }

    try {
        const result = await client.embed({
            model: "voyage-3-lite",
            input: [text]
        });

        return result.data[0].embedding;

    } catch (err) {
        console.error("Embedding Error");
        console.error(err);
        throw err;
    }
}

/**
 * 여러 문자열을 한 번의 API 요청으로 임베딩 (rate limit에 훨씬 유리)
 * @param {string[]} texts
 * @returns {Promise<number[][]>} - 입력 순서와 동일한 순서의 임베딩 배열
 */
async function embedBatch(texts) {
    const validTexts = texts.filter(t => t && t.trim() !== "");

    if (validTexts.length !== texts.length) {
        throw new Error("Embedding batch contains empty text(s).");
    }

    if (validTexts.length === 0) {
        return [];
    }

    try {
        const result = await client.embed({
            model: "voyage-3-lite",
            input: validTexts
        });

        return result.data.map(d => d.embedding);

    } catch (err) {
        console.error("Batch Embedding Error");
        console.error(err);
        throw err;
    }
}

module.exports = {
    embed,
    embedBatch
};