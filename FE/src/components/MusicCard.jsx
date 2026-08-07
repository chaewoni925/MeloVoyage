const MusicCard = ({ music }) => {
  return (
    <div className="cursor-pointer bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex-shrink-0 w-40 snap-start">
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <img
          src={music.img}
          alt={music.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 truncate">{music.title}</h3>
        <p className="text-xs text-gray-500 mt-1 truncate">{music.artist}</p>
      </div>
    </div>
  );
};

export default MusicCard;