// src/pages/loading/RegeneratePage.jsx 

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingPage from "./loading.jsx";
import instance from "../../api/axios";

export default function RegeneratePage() {
    const navigate = useNavigate();
    const { recommendationId } = useParams();
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

                const newId = response.data.recommendationId;

                if (!newId) {
                    throw new Error("새 recommendationId를 받지 못했습니다.");
                }

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
            <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
                <div className="w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-white text-sm text-gray-500">
                    <p>{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-violet-600 font-semibold cursor-pointer"
                    >
                        돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return <LoadingPage />;
}