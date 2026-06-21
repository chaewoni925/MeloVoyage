import { BrowserRouter, Routes, Route } from "react-router-dom";
import DestinationsPage from './pages/destinations/destinations.jsx';
import MusicPage from './pages/music/music.jsx'
import SearchingPage from './pages/searching/searching.jsx'
import SearchBar from "./components/SearchBar";

import AuthMain from "./pages/Auth/AuthMain.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";

import Onboarding from "./pages/Onboarding/Onboarding.jsx";

import Storage from "./pages/storage/storagePage.jsx";
import StorageList from "./pages/storage/storageList.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본주소 접속시  시작화면 나오게 변경*/}
        <Route path="/" element={<AuthMain />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/Music" element={<MusicPage />} />
        <Route path="/Map" element={<DestinationsPage />} />
        {/*<Route path="/" element={<StoragePage />} />*/}
        {/*<Route path="/" element={<ProfilePage />} />*/}
        <Route path="/Searching" element={<SearchingPage />} />
        <Route path="/SearchBar" element={<SearchBar />} />
        <Route path="/Storage" element={<Storage />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App