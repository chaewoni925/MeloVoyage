const PlaceCard = ({ place, onClick, shadow = false }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex-shrink-0 w-40 snap-start ${
      shadow ? "shadow-xs" : ""
    }`}
  >
    <div className="h-36 bg-gray-100 bg-gray-100 relative overflow-hidden">
      <img
        src={place.img}
        alt={place.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="p-4">
      <h3 className="font-bold text-gray-900 truncate">{place.title}</h3>
      <p className="text-xs text-gray-500 mt-1 truncate">{place.desc}</p>
    </div>
  </div>
);

export default PlaceCard;