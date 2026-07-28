require("dotenv").config();

const prisma = require("./config/prisma");
const destinationService = require("./services/destinationService");

const CITIES = ["서울", "부산", "강릉", "경주", "제주"];

async function main() {
    console.log(`📍 ${CITIES.length}개 메인 여행지 등록 시작\n`);

    for (const city of CITIES) {
        try {
            console.log(`🏙️  ${city}`);

            // 이미 등록 + profileText까지 완료된 여행지면 스킵
            const existing = await prisma.destination.findFirst({
                where: { name: city }
            });

            if (existing && existing.profileText) {
                console.log(`  ⏭️  이미 완료됨, 스킵 (id: ${existing.id})`);
                console.log("");
                continue;
            }

            // 1단계: Google Places로 도시 자체 등록 (이미 등록되어 있으면 upsert가 알아서 스킵)
            const destination = existing ?? await destinationService.importMainDestination(city);
            console.log(`  ✓ 등록됨 (id: ${destination.id})`);

            // 2단계: LLM 태그 + profileText + Voyage 임베딩 생성
            const profile = await destinationService.generateDestinationProfile(destination.id);
            console.log(`  ✓ 무드 태그: ${profile.moodTags.join(", ")}`);

        } catch (err) {
            console.error(`  ❌ ${city} 처리 실패:`, err.message);
        }

        console.log("");
    }

    console.log("======================");
    console.log("5개 메인 여행지 세팅 완료");
    console.log("======================");
}

main()
    .catch(err => console.error(err))
    .finally(() => process.exit());