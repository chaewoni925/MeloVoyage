// src/pages/search/searchPlaceToMusicReason.jsx

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import NoLogoHeader from "../../components/NoLogoHeader";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';
import searchIcon from '../../assets/search.png';


const SearchPlaceToMusicReasonPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");


    return (
        <div className=" min-h-screen bg-gray-100 flex justify-center">

            <div className="bg-white p-6 rounded-b-3xl w-full max-w-md relative">
                <NoLogoHeader/>
            </div>

        <div className="bg-gray-100 p-6 rounded-b-3xl w-full max-w-md relative">
            
        </div>

        </div>


    );
};

export default SearchPlaceToMusicReasonPage;