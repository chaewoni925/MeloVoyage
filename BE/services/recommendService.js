const prisma = require("../config/prisma");
const destinationService = require("./destinationService");

const RECOMMENDATION_TTL_MINUTES = 30;
const TOP_N = 15;

// 다양성 제약을 적용해 상위 N개 선택
// 그냥 점수 순으로 자르면 특정 장르/아티스트가 몰아서 뽑히는 문제 생김
// (예: 부산 15곡 전부가 city-pop, 그중 3명이 73% 차지)
// 장르/아티스트별 최대 개수를 제한한 뒤, 그래도 못 채우면 제약을 풀고 순위대로 채움

function selectDiverseTopN(sortedCandidates, n, maxPerGenre, maxPerArtist) {
    const selected = [];
    const genreCount = {};
    const artistCount = {};

    // 엄격한 제약(장르당 maxPerGenre, 아티스트당 maxPerArtist)으로 선택
    for (const track of sortedCandidates) {
        if (selected.length >= n) break;
        const g = track.genre;
        const a = track.artist;
        if ((genreCount[g] || 0) >= maxPerGenre) continue;
        if ((artistCount[a] || 0) >= maxPerArtist) continue;
        selected.push(track);
        genreCount[g] = (genreCount[g] || 0) + 1;
        artistCount[a] = (artistCount[a] || 0) + 1;
    }

    // 그래도 부족하면 완전 fallback (제약 없이 순위대로 채움)
    // 후보 풀을 장르별로 고르게 뽑아오므로(아래 쿼리 변경) 이 fallback이 발동할 일은 거의 없음
    if (selected.length < n) {
        const selectedIds = new Set(selected.map(t => t.spotifyTrackId));
        for (const track of sortedCandidates) {
            if (selected.length >= n) break;
            if (!selectedIds.has(track.spotifyTrackId)) {
                selected.push(track);
            }
        }
    }

    return selected;
}
 
    

exports.recommendPlaylist = async (userId, destinationQuery) => {

    // 여행지 결정 (정확 일치 캐시 확인 -> 없으면 Google에서 대표 장소 선정 후 생성)
    let destination = await destinationService.getOrCreateDestinationByQuery(destinationQuery);
 
    // 캐싱 체크: profileText가 아직 없으면 (신규 여행지) 생성
    if (!destination.profileText) {
        destination = await destinationService.generateDestinationProfile(destination.id);
    }

    // 1차: 정확히 이름이 일치하는 것 우선
    // let destination = await prisma.destination.findFirst({
    //     where: { name: destinationQuery }
    // });

    // // 2차: 정확히 일치하는 게 없으면, 포함되는 것 중 하나 (fallback)
    // if (!destination) {
    //     destination = await prisma.destination.findFirst({
    //         where: { name: { contains: destinationQuery, mode: "insensitive" } }
    //     });
    // }

    // // DB에 없으면 Google Maps에서 가져오기
    // if (!destination) {

    //     await destinationService.importDestinations(destinationQuery);

    //     destination = await prisma.destination.findFirst({
    //         where: {
    //             name: {
    //                 contains: destinationQuery,
    //                 mode: "insensitive"
    //             }
    //         }
    //     });

    //     if (!destination) {
    //         throw new Error("여행지를 찾을 수 없습니다.");
    //     }
    // }
    // // 캐싱 체크: profileText가 아직 없으면 service에 있는 함수 호출해서 (신규 여행지) 생성
    // if (!destination.profileText) {
    //     destination = await destinationService.generateDestinationProfile(destination.id);
    // }
 
    // 여행지 임베딩을 텍스트로 조회 (Unsupported 타입은 Prisma Client로 직접 못 읽음)
    const destEmbeddingResult = await prisma.$queryRaw`
        SELECT embedding::text AS embedding_text
        FROM "destinations"
        WHERE id = ${destination.id}
    `;
    const destEmbeddingText = destEmbeddingResult[0]?.embedding_text;
 
    if (!destEmbeddingText) {
        throw new Error("여행지 임베딩이 아직 생성되지 않았습니다.");
    }
    // 온보딩 정보 조회 (사용자가 온보딩을 안 했으면 null일 수 있음)
    const onboarding = await prisma.onboarding.findUnique({
        where: { userId }
    });

    const perGenrePoolSize = 10; // 장르마다 유사도 상위 10곡씩 확보

    const candidates = await prisma.$queryRaw`
        SELECT
            "spotifyTrackId", "name", "artist", "genre", "moodTags",
            "albumImageUrl", "previewUrl", "similarity"
        FROM (
            SELECT
                "spotifyTrackId", "name", "artist", "genre", "moodTags",
                "albumImageUrl", "previewUrl",
                1 - (embedding <=> ${destEmbeddingText}::vector) AS similarity,
                ROW_NUMBER() OVER (
                    PARTITION BY genre
                    ORDER BY embedding <=> ${destEmbeddingText}::vector
                ) AS rn
            FROM "TrackPool"
        ) sub
        WHERE rn <= ${perGenrePoolSize}
        ORDER BY similarity DESC
    `;

    // 온보딩 가중치 부여
    const GENRE_BONUS = 0.05;
    const ARTIST_BONUS = 0.1;
    const MAX_ONBOARDING_BONUS = GENRE_BONUS + ARTIST_BONUS; // 0.15

    const scoredCandidates = candidates.map(track => {
    let bonus = 0;
    if (onboarding?.genres?.includes(track.genre)) bonus += GENRE_BONUS;
        if (onboarding?.artistSeeds?.includes(track.artist)) bonus += ARTIST_BONUS;

        return {
            ...track,
            similarityPercent: Math.round(track.similarity * 100),
            onboardingSimilarityPercent: Math.round((bonus / MAX_ONBOARDING_BONUS) * 100),
            adjustedScore: track.similarity + bonus
        };
    });

    scoredCandidates.sort((a, b) => b.adjustedScore - a.adjustedScore);
    const MAX_PER_GENRE = 8;
    const MAX_PER_ARTIST = 2
      const topTracks = selectDiverseTopN(scoredCandidates, TOP_N, MAX_PER_GENRE, MAX_PER_ARTIST);

    // 매칭된 무드 태그 계산 (설명용)
    const matchedTags = [...new Set(
        topTracks.flatMap(t => t.moodTags.filter(tag => destination.moodTags.includes(tag)))
    )];



    // const scoredCandidates = candidates.map(track => {
    //     let bonus = 0;
    //     if (onboarding?.genres?.includes(track.genre)) bonus += GENRE_BONUS;
    //     if (onboarding?.artistSeeds?.includes(track.artist)) bonus += ARTIST_BONUS;
    //     return { ...track, adjustedScore: track.similarity + bonus };
    // });

    // // 보정된 점수로 재정렬 후 상위 TOP_N개 선택
    // scoredCandidates.sort((a, b) => b.adjustedScore - a.adjustedScore);
    // const topTracks = scoredCandidates.slice(0, TOP_N);

    // // pgvector로 TrackPool과 코사인 유사도 비교
    // const topTracks = await prisma.$queryRaw`
    //     SELECT
    //         "spotifyTrackId",
    //         "name",
    //         "artist",
    //         "genre",
    //         "moodTags",
    //         "albumImageUrl",
    //         "previewUrl"
    //     FROM "TrackPool"
    //     ORDER BY embedding <=> ${destEmbeddingText}::vector
    //     LIMIT ${TOP_N}
    // `;
 
    // 매칭된 무드 태그 계산 (설명용)
    // const matchedTags = [...new Set(
    //     topTracks.flatMap(t => t.moodTags.filter(tag => destination.moodTags.includes(tag)))
    // )];
    // // 추천 이유 나중에 더 보완 필요 (일치율 등)
    // const explanation = matchedTags.length > 0
    //     ? `${destination.name}의 분위기를 담은 플레이리스트를 생성했습니다. 회원님이 선호하는 ${onboarding.genres} 장르와 선호하는 아티스트 ${onboarding.artistSeeds}에 가중치를 주었습니다. 플레이리스트와 매칭된 태그는 ${matchedTags.join(", ")} 입니다.`
    //     // ? `${destination.name}의 ${matchedTags.join(", ")} 분위기에 어울리는 곡들을 추천했습니다.`
    //     : `${destination.name}과(와) 어울리는 곡들을 추천했습니다.`;

    // 추천 이유 - onboarding null 체크 추가, matchedTags 없어도 온보딩 정보는 표시
    // const hasOnboarding = onboarding && (onboarding.genres?.length > 0 || onboarding.artistSeeds?.length > 0);

    // let explanation;
    // // 플레이리스트와 매칭된 태그는 ${matchedTags.join(", ")} 입니다.
    // if (hasOnboarding && matchedTags.length > 0) {
    //     explanation = `${destination.name}의 분위기를 담은 플레이리스트를 생성했습니다. 회원님이 선호하는 ${onboarding.genres.join(", ")} 장르와 선호하는 아티스트 ${onboarding.artistSeeds.join(", ")}에 가중치를 주었습니다.`;
    // } else if (hasOnboarding) {
    //     // 온보딩은 있지만 matchedTags가 비어있는 경우 - 온보딩 반영 사실은 알려주되 태그 나열은 생략
    //     explanation = `${destination.name}의 분위기를 담은 플레이리스트를 생성했습니다. 회원님이 선호하는 ${onboarding.genres.join(", ")} 장르와 선호하는 아티스트 ${onboarding.artistSeeds.join(", ")}에 가중치를 주었습니다.`;
    // } else if (matchedTags.length > 0) {
    //     explanation = `${destination.name}의 ${matchedTags.join(", ")} 분위기에 어울리는 곡들을 추천했습니다.`;
    // } else {
    //     explanation = `${destination.name}과(와) 어울리는 곡들을 추천했습니다.`;
    // }

    // 매칭된 무드 태그 계산 로직 제거 (더이상 안 씀)

    const hasOnboarding = onboarding && (onboarding.genres?.length > 0 || onboarding.artistSeeds?.length > 0);

    // const avgSimilarity = Math.round(
    //     topTracks.reduce((sum, t) => sum + t.similarityPercent, 0) / topTracks.length
    // );

    const avgOnboardingSimilarity = hasOnboarding
        ? Math.round(
              topTracks.reduce((sum, t) => sum + t.onboardingSimilarityPercent, 0) / topTracks.length
          )
        : null;

    let explanation;
    // 여행지와의 평균 일치율은 ${avgSimilarity}%입니다.
    if (hasOnboarding) {
        explanation = `${destination.name}의 분위기를 담은 플레이리스트를 생성했습니다. 회원님이 선호하는 ${onboarding.genres.join(", ")} 장르와 아티스트 ${onboarding.artistSeeds.join(", ")}에 가중치를 주었고, 취향 반영률은 평균 ${avgOnboardingSimilarity}%입니다.`;
    } else {
        explanation = `${destination.name}의 분위기를 담은 플레이리스트를 생성했습니다.`;
    }
 
    const expiresAt = new Date(Date.now() + RECOMMENDATION_TTL_MINUTES * 60 * 1000);
 
    const recommendation = await prisma.recommendation.create({
        data: {
            userId,
            destinationId: destination.id,
            // matchedTags,
            explanation,
            expiresAt,
            tracks: {
                create: topTracks.map((track, index) => ({
                    spotifyTrackId: track.spotifyTrackId,
                    name: track.name,
                    artist: track.artist,
                    albumImageUrl: track.albumImageUrl,
                    previewUrl: track.previewUrl,
                    position: index,
                    // similarity: track.similarityPercent,
                    onboardingSimilarity: track.onboardingSimilarityPercent
                }))
            }
        },
        include: { tracks: true }
    });
 
    return {
        recommendationId: recommendation.id,
        destination: {
            name: destination.name,
            placeId: destination.googlePlaceId,
            description: destination.profileText
        },
        tracks: recommendation.tracks,
        expiresAt: recommendation.expiresAt
    };
};
 
// -----------------------------
// 재생성 (같은 여행지, 이전 곡 제외)
// -----------------------------
exports.regeneratePlaylist = async (recommendationId) => {
    const original = await prisma.recommendation.findUnique({
        where: { id: recommendationId },
        include: { tracks: true, destination: true }
    });
 
    if (!original) {
        throw new Error("기존 추천을 찾을 수 없습니다.");
    }

    const onboarding = await prisma.onboarding.findUnique({
        where: {userId: original.userId}
    });
 
    const destEmbeddingResult = await prisma.$queryRaw`
        SELECT embedding::text AS embedding_text
        FROM "destinations"
        WHERE id = ${original.destinationId}
    `;
    const destEmbeddingText = destEmbeddingResult[0]?.embedding_text;
 
    const excludeIds = original.tracks.map(t => t.spotifyTrackId);
    const excludeList = excludeIds.length > 0 ? excludeIds : ['__none__'];

     // recommendPlaylist와 동일하게 장르별로 고르게 후보 확보 (이전 곡은 제외)
    const perGenrePoolSize = 10;
 
    const candidates = await prisma.$queryRaw`
        SELECT
            "spotifyTrackId", "name", "artist", "genre", "moodTags",
            "albumImageUrl", "previewUrl", "similarity"
        FROM (
            SELECT
                "spotifyTrackId", "name", "artist", "genre", "moodTags",
                "albumImageUrl", "previewUrl",
                1 - (embedding <=> ${destEmbeddingText}::vector) AS similarity,
                ROW_NUMBER() OVER (
                    PARTITION BY genre
                    ORDER BY embedding <=> ${destEmbeddingText}::vector
                ) AS rn
            FROM "TrackPool"
            WHERE "spotifyTrackId" != ALL(${excludeList})
        ) sub
        WHERE rn <= ${perGenrePoolSize}
        ORDER BY similarity DESC
    `;
 
    // 온보딩 가중치 부여 (recommendPlaylist와 동일한 로직)
    const GENRE_BONUS = 0.05;
    const ARTIST_BONUS = 0.1;
    const MAX_ONBOARDING_BONUS = GENRE_BONUS + ARTIST_BONUS;
 
    const scoredCandidates = candidates.map(track => {
        let bonus = 0;
        if (onboarding?.genres?.includes(track.genre)) bonus += GENRE_BONUS;
        if (onboarding?.artistSeeds?.includes(track.artist)) bonus += ARTIST_BONUS;
 
        return {
            ...track,
            onboardingSimilarityPercent: Math.round((bonus / MAX_ONBOARDING_BONUS) * 100),
            adjustedScore: track.similarity + bonus
        };
    });
 
    scoredCandidates.sort((a, b) => b.adjustedScore - a.adjustedScore);
 
    const MAX_PER_GENRE = 8;
    const MAX_PER_ARTIST = 2;
 
    const newTracks = selectDiverseTopN(scoredCandidates, TOP_N, MAX_PER_GENRE, MAX_PER_ARTIST);
 
    // explanation도 새로 계산 (곡이 바뀌면 반영률도 달라짐)
    const hasOnboarding = onboarding && (onboarding.genres?.length > 0 || onboarding.artistSeeds?.length > 0);
 
    const avgOnboardingSimilarity = hasOnboarding
        ? Math.round(
              newTracks.reduce((sum, t) => sum + t.onboardingSimilarityPercent, 0) / newTracks.length
          )
        : null;
 
    let explanation;
    if (hasOnboarding) {
        explanation = `${original.destination.name}의 분위기를 담은 플레이리스트를 생성했습니다. 회원님이 선호하는 ${onboarding.genres.join(", ")} 장르와 아티스트 ${onboarding.artistSeeds.join(", ")}에 가중치를 주었고, 취향 반영률은 평균 ${avgOnboardingSimilarity}%입니다.`;
    } else {
        explanation = `${original.destination.name}의 분위기를 담은 플레이리스트를 생성했습니다.`;
    }
 
    const expiresAt = new Date(Date.now() + RECOMMENDATION_TTL_MINUTES * 60 * 1000);
 
    const recommendation = await prisma.recommendation.create({
        data: {
            userId: original.userId,
            destinationId: original.destinationId,
            explanation,
            expiresAt,
            tracks: {
                create: newTracks.map((track, index) => ({
                    spotifyTrackId: track.spotifyTrackId,
                    name: track.name,
                    artist: track.artist,
                    albumImageUrl: track.albumImageUrl,
                    previewUrl: track.previewUrl,
                    position: index,
                    similarity: Math.round(track.similarity * 100),
                    onboardingSimilarity: track.onboardingSimilarityPercent
                }))
            }
        },
        include: { tracks: true }
    });
 
    return {
        recommendationId: recommendation.id,
        destination: {
            name: original.destination.name,
            placeId: original.destination.googlePlaceId,
            description: original.destination.profileText,
            moodTags: original.destination.moodTags
        },
        tracks: recommendation.tracks.map(t => ({
            spotifyTrackId: t.spotifyTrackId,
            name: t.name,
            artist: t.artist,
            albumImageUrl: t.albumImageUrl,
            previewUrl: t.previewUrl,
            position: t.position
        })),
        expiresAt: recommendation.expiresAt
    };
};
 
// -----------------------------
// 추천 이유 조회 (생성 시점에 저장해둔 값을 그대로 반환)
// -----------------------------
exports.explainRecommendation = async (userId, recommendationId) => {
    const recommendation = await prisma.recommendation.findUnique({
        where: { id: recommendationId },
        include: { destination: true, tracks: true }
    });
 
    if (!recommendation) {
        throw new Error("추천을 찾을 수 없습니다.");
    }
 
    const trackIds = recommendation.tracks.map(t => t.spotifyTrackId);
    const poolTracks = await prisma.trackPool.findMany({
        where: { spotifyTrackId: { in: trackIds } },
        select: { spotifyTrackId: true, moodTags: true }
    });
    const moodTagsMap = new Map(poolTracks.map(t => [t.spotifyTrackId, t.moodTags]));
 
    return {
        destination: recommendation.destination.name,
        destinationMoodTags: recommendation.destination.moodTags,
        message: recommendation.explanation,
        tracks: recommendation.tracks.map(t => ({
            spotifyTrackId: t.spotifyTrackId,
            name: t.name,
            artist: t.artist,
            albumImageUrl: t.albumImageUrl,
            previewUrl: t.previewUrl,
            position: t.position,
            moodTags: moodTagsMap.get(t.spotifyTrackId) ?? []
        })),
        photoUrl: recommendation.destination.photoUrl
    };
};
 