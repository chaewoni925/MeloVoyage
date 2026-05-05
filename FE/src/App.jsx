import { BrowserRouter, Routes, Route } from "react-router-dom";
import MapPage from './pages/map/map.jsx';
import MusicPage from './pages/music/music.jsx'
import SearchingPage from './pages/searching/searching.jsx'
import SearchBar from "./components/SearchBar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MusicPage />} />
        
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