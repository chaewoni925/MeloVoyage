// src/pages/loading/RegeneratePage.jsx 

import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import LoadingPage from "./loading.jsx";
import instance from "../../api/axios";

export default function RegeneratePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { recommendationId } = useParams(); //URL 파라미터에서 recommendationId를 가져옴
    const [error, setError] = useState(null);

    useEffect(() => {
        const regenerate = async () => {
            if (!recommendationId) {
                navigate("/searchPlaceToMusic", { replace: true });
                return;
            }
            try {
                const response = await instance.post(
                    "/recommend/playlist/regenerate",
                    { recommendationId },
                    { withCredentials: true }
                );

                // 주의: 이 API는 success/data로 안 감싸고 결과를 바로 반환함
                const newId = response.data.recommendationId;

                if (!newId) {
                    throw new Error("새 recommendationId를 받지 못했습니다.");
                }

                // 새 recommendationId를 URL에 실어서 결과 페이지로 이동
                navigate(`/searchPlaceToMusicReason/${newId}`, { replace: true });
            } catch (err) {
                console.error("재생성 실패:", err);
                setError("재생성에 실패했습니다. 다시 시도해주세요.");
            }
        };
        regenerate();
    }, [recommendationId, navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-sm text-gray-500">
                <p>{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="text-violet-600 font-semibold cursor-pointer"
                >
                    돌아가기
                </button>
            </div>
        );
    }

    return <LoadingPage />;
}