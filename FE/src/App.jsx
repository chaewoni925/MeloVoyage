import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MapPage from './pages/map/map.jsx';
import MusicPage from './pages/music/music.jsx'
import LoadingPage from './pages/loading/loading.jsx'
import SearchBar from "./components/SearchBar";
import SearchPage from './pages/search/search.jsx'
import SearchMusicToPlacePage from './pages/search/searchMusicToPlace.jsx'
import SearchMusicToPlaceReasonPage from './pages/search/searchMusicToPlaceReason.jsx';
import SearchPlaceToMusicPage from './pages/search/searchPlaceToMusic.jsx'
import SearchPlaceToMusicReasonPage from './pages/search/searchPlaceToMusicReason.jsx'
import AuthMain from "./pages/Auth/AuthMain.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import RegeneratePage from "./pages/loading/RegeneratePage.jsx";
import Onboarding from "./pages/onboarding/onboarding.jsx";

import Storage from "./pages/storage/storagePage.jsx";
import StorageList from "./pages/storage/storageList.jsx";

import PlaylistPage from "./pages/playlist/playlistPage.jsx";

import ProfilePage from './pages/profile/ProfilePage';
import ProfileSettings from './pages/profile/profileSetting';

import { UserProvider } from "./context/userContext.jsx"; //

function App() {
  return (
    <UserProvider>

      <BrowserRouter>
        <Routes>
          {/* 기본주소 접속시  시작화면 나오게 변경*/}
          <Route path="/" element={<AuthMain />} />

          <Route path="/Login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/Music" element={<MusicPage />} />
          <Route path="/Map" element={<MapPage />} />
          {/*<Route path="/" element={<StoragePage />} />*/}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
          <Route path="/Loading/:recommendationId" element={<LoadingPage />} />
          <Route path="/Search" element={<SearchPage />} />
          <Route path="/SearchMusicToPlace" element={<SearchMusicToPlacePage />} />
          <Route path="/SearchMusicToPlaceReason" element={<SearchMusicToPlaceReasonPage />} />
          <Route path="/SearchBar" element={<SearchBar />} />
          <Route path="/Storage" element={<Storage />} />
          <Route path="/SearchPlaceToMusic" element={<SearchPlaceToMusicPage />} />
          {/* recommendationId를 URL 파라미터로 받는 결과 페이지 */}
          <Route path="/SearchPlaceToMusicReason/:recommendationId" element={<SearchPlaceToMusicReasonPage />} />
          {/* id 없이 옛날 주소(브라우저 히스토리/북마크 등)로 들어온 경우 검색 페이지로 돌려보냄 */}
          <Route path="/SearchPlaceToMusicReason" element={<Navigate to="/searchPlaceToMusic" replace />} />
          <Route path="/Playlist" element={<PlaylistPage />} />
          <Route path="/regenerate/:recommendationId" element={<RegeneratePage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}


export default App