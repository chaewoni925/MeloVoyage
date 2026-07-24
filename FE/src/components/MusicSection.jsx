import MusicCard from "./MusicCard";

const MusicSection = ({ title, musicList }) => {
  return (
    <section className="pl-2 pr-2">
      <h1 className="text-[20px] font-bold mt-[10px] mb-[10px]">{title}</h1>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {musicList.map((music) => (
          <MusicCard key={music.id} music={music} />
        ))}
      </div>
    </section>
  );
};

export default MusicSection;