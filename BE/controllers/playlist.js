const prisma = require("../config/prisma");
// 유사도 뭐를 받아서 온보딩 반영하고 그걸 받아서 플레이리스트를 생성. 그럼 뭘 매개변수로 받아야할까
// 플리 생성한 걸 저장. 사용자가 저장 버튼 누르면 그제서야 storage로 넘어가는 것 저장하시겠습니까? 예 아니오
// 사용자가 플레이리스트 생성 버튼을 누르면 프론트는 대략 이런 데이터를 보낼 거야.

// POST /recommend/playlist

// {
//     "destinationId": "gangneung123"
// }

const generatePlaylist = async (req,res)=>{

    const { destinationId } = req.body;

    const userId = req.user.id; // 로그인 한 유저의 정보가 필요함

    // 1. 여행지 조회

    // 2. 임베딩

    // 3. 유사도 계산

    // 4. TrackPool Top30

    // 5. Recommendation 생성

    // 6. RecommendedTrack createMany

    // 7. 반환

}