import PlaceCard from "./PlaceCard";

{/* 장소 카드들을 가로로 스크롤 가능한 캐러셀 형태로 보여줌 */}
const PlaceCarousel = ({ title, places, onCardClick, shadow = false }) => (
  <section className="pl-2 pr-2">
    <h1 className="text-[20px] font-bold mt-[10px] mb-[10px]">{title}</h1>
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-2">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} shadow={shadow} onClick={() => onCardClick?.(place)} />
      ))}
    </div>
  </section>
);

export default PlaceCarousel;