import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapPage from './pages/map/map.jsx';
import MusicPage from './pages/music/music.jsx'
import SearchingPage from './pages/searching/searching.jsx'
import SearchBar from "./components/SearchBar";

import AuthMain from "./pages/Auth/AuthMain.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본주소 접속시  시작화면 나오게 변경*/}
        <Route path="/" element={<AuthMain />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Music" element={<MusicPage />} />
        <Route path="/Map" element={<MapPage />} />
        {/*<Route path="/" element={<StoragePage />} />*/}
        {/*<Route path="/" element={<ProfilePage />} />*/}
        <Route path="/Searching" element={<SearchingPage />} />
        <Route path="/SearchBar" element={<SearchBar />} />

      </Routes>
    </BrowserRouter>
  );
}


export default App