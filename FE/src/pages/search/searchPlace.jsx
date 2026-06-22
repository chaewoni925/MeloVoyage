// src/pages/search/searchplace.jsx

import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import LoadingPage from '../loading/loading.jsx'
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import street from '../../assets/street.png';
import wave from '../../assets/wave.png';

const SearchPlacePage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="bg-white p-6 rounded-b-3xl w-full max-w-md relative">
                <Header />


               

                <Footer />
            </div>
        </div>
    );
};

export default SearchPlacePage;