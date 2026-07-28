const PlaceCard = ({ place, onClick, shadow = false }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer bg-[#D9D9D9] p-4 rounded-lg flex-shrink-0 w-[160px] snap-start ${
      shadow ? "shadow-sm" : ""
    }`}
  >
    <img src={place.img} alt={place.title} className="w-full h-32 object-cover rounded-md" />
    <div className="mt-2">
      <p className="font-bold text-sm truncate">{place.title}</p>
      <p className="text-xs text-gray-500">{place.desc}</p>
    </div>
  </div>
);

export default PlaceCard;