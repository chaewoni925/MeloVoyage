const MusicCard = ({ music }) => {
  return (
    <div className="cursor-pointer bg-[#D9D9D9] p-4 rounded-lg flex-shrink-0 w-[160px] shadow-sm snap-start">
      <img
        src={music.img}
        alt={music.title}
        className="w-full h-32 object-cover rounded-md"
      />
      <div className="mt-2">
        <p className="font-bold text-sm truncate">{music.title}</p>
        <p className="text-xs text-gray-500">{music.artist}</p>
      </div>
    </div>
  );
};

export default MusicCard;