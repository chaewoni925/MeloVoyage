const MusicCard = ({ music, isDragging, onClick }) => {
  return (
    <div
      onClick={(e) => {
        if (isDragging) return; // 💡 드래그 중 클릭 동작 방지
        onClick?.(music);
      }}
      className="cursor-pointer bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex-shrink-0 w-40 snap-start select-none"
    >
      <div className="h-36 bg-gray-100 relative overflow-hidden pointer-events-none">
        <img
          src={music.img}
          alt={music.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 pointer-events-none">
        <h3 className="font-bold text-gray-900 truncate">{music.title}</h3>
        <p className="text-xs text-gray-500 mt-1 truncate">{music.artist}</p>
      </div>
    </div>
  );
};

export default MusicCard;