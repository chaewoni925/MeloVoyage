// src/components/MusicSection.jsx
import { useRef, useState } from "react";
import MusicCard from "./MusicCard";

const MusicSection = ({ title, musicList, onTrackClick }) => {
  const scrollRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setIsDragging(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setTimeout(() => setIsDragging(false), 50);
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(x - startX) > 5) {
      setIsDragging(true);
    }
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="pl-2 pr-2">
      <h1 className="text-[20px] font-bold mb-[10px]">{title}</h1>
      
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-4 overflow-x-auto no-scrollbar select-none cursor-grab active:cursor-grabbing"
      >
        {musicList.map((music) => (
          <MusicCard 
            key={music.id} 
            music={music} 
            isDragging={isDragging} 
            onClick={() => onTrackClick?.(music)}
          />
        ))}
      </div>
    </section>
  );
};

export default MusicSection;