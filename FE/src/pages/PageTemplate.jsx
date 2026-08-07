// src/pages/PageTemplate.jsx
//
// 📱 모바일 프레임 레이아웃 공통 템플릿
// 새 페이지 만들 때 이 파일을 복사해서 시작하세요.
// 콘텐츠 영역(④번, "여기부터 페이지별 콘텐츠") 안쪽만 채우면 됩니다.
//
// 지켜야 할 규칙:
// 1. overflow-hidden은 ②(프레임)에, overflow-y-auto는 ④(콘텐츠)에만 사용
// 2. Header / SearchBar는 ③(상단 고정 영역)에 넣기
// 3. 스크롤되는 영역엔 항상 no-scrollbar 클래스 추가

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../../components/Footer.jsx";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";

const PageTemplate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 필요하면 여기에 데이터 fetch 로직 작성
  // useEffect(() => {
  //   const loadData = async () => {
  //     setLoading(true);
  //     // await fetchSomething();
  //     setLoading(false);
  //   };
  //   loadData();
  // }, []);

  // 로딩 상태 화면 (필요 없으면 이 블록 통째로 삭제)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">
        <div className="bg-white w-full h-screen sm:h-auto sm:min-h-[500px] sm:max-w-md p-4 sm:p-6 sm:rounded-3xl sm:shadow-lg relative flex items-center justify-center">
          <p className="text-gray-500 font-medium">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    // ① 바깥 컨테이너: 데스크탑에서 모바일 화면처럼 중앙 정렬
    <div className="min-h-screen bg-gray-100 flex justify-center sm:items-center sm:py-8">

      {/* ② 모바일 프레임 컨테이너: 모바일-풀스크린 / 데스크탑-카드형 고정 크기 */}
      <div className="bg-white w-full h-screen sm:h-[800px] sm:max-w-md sm:rounded-3xl sm:shadow-lg relative flex flex-col overflow-hidden">

        {/* ③ 상단 고정 영역: 스크롤해도 움직이지 않음 */}
        <div className="p-4 sm:p-6 pb-2">
          <Header />
          <div className="mt-4 sm:mt-5">
            <SearchBar placeholder="검색어를 입력하세요" />
          </div>
        </div>

        {/* ④ 스크롤 콘텐츠 영역: 이 안쪽만 스크롤됨 */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 pt-0 pb-6">
          {/* ↓↓↓ 여기부터 페이지별 콘텐츠 작성 ↓↓↓ */}

          <section className="px-2 mt-8">
            <h1 className="text-lg sm:text-xl font-bold mb-3">섹션 제목</h1>
            {/* 카드, 리스트, 캐러셀 등 배치 */}
          </section>

          {/* ↑↑↑ 여기까지 페이지별 콘텐츠 ↑↑↑ */}
        </div>

        {/* ⑤ 하단 고정 영역 (Footer 컴포넌트 자체가 sticky bottom-0 처리됨) */}
        <Footer />
      </div>
    </div>
  );
};

export default PageTemplate;