import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 추가
import instance from '../../api/axios';

export default function StorageList({ playlist }) {
  const navigate = useNavigate(); // 추가
  
  //삭제팝업 관리
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  //플리 이미지x

  const formattedDate = playlist.createdAt
    ? new Date(playlist.createdAt).toLocaleDateString('ko-KR', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : '';

  // 삭제 로직 처리
  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await instance.delete(`/storage/${playlist.id}`);
      onDelete(playlist.id); // 부모 상태에서 제거
    } catch (error) {
      console.error('플레이리스트 삭제 실패:', error);
      alert(error.response?.data?.message || '삭제에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div
      onClick={() => navigate('/playlist', { state: { playlistId: playlist.id } })}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* 플리 이미지 (MELO 고정) */}
      <div className="w-16 h-16 rounded-xl bg-gray-900 flex-shrink-0 flex items-center justify-center overflow-hidden text-white text-[10px] font-bold tracking-wider">
        <span>MELO</span>
      </div>

      {/* 플레이리스트 정보 */}
      <div className="flex flex-col justify-center min-w-0 flex-1">
        <h3 className="font-bold text-gray-800 text-sm md:text-base leading-snug truncate">
          {playlist.title}
        </h3>
        <p className="text-xs text-gray-400 mt-1 truncate">
          {formattedDate}
        </p>
      </div>

      {/* 우측 더보기 버튼 (⋮) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDeleteModalOpen(true);
        }}
        className="ml-auto text-purple-600 text-xl font-bold p-1 hover:bg-purple-50 rounded-full transition-colors focus:outline-none cursor-pointer"
      >
        ⋮
      </button>

      {/*삭제모달 팝업 */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-xs rounded-2xl p-5 flex flex-col items-center text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-3 text-lg font-bold">
              ⚠️
            </div>
            <h4 className="text-gray-800 font-bold text-base mb-1">플레이리스트 삭제</h4>
            <p className="text-gray-400 text-xs mb-5 leading-relaxed">
              정말 삭제하시겠습니까?
            </p>
            <div className="flex w-full gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(false);
                }}
                disabled={deleting}
                className="flex-1 bg-gray-100 text-gray-600 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer focus:outline-none disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={deleting}
                className="flex-1 bg-red-500 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-red-600 transition-colors shadow-sm shadow-red-200 cursor-pointer focus:outline-none disabled:opacity-50"
              >
                {deleting ? '삭제 중...' : '삭제하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}