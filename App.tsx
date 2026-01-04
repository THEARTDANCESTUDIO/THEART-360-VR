
import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2, Move, Navigation2 } from 'lucide-react';
import { Three360Viewer } from './components/Three360Viewer';
import { STUDIO_ROOMS } from './constants';

const App: React.FC = () => {
  const [activeRoomId, setActiveRoomId] = useState(STUDIO_ROOMS[1].id); // 기본값 Studio A
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeRoom = STUDIO_ROOMS.find(r => r.id === activeRoomId) || STUDIO_ROOMS[0];

  // 전체 화면 상태 변경 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* 360 Viewer Background - key props forcing re-render for smooth texture swap */}
      <div className="absolute inset-0 z-0">
        <Three360Viewer key={activeRoom.imageUrl} imageUrl={activeRoom.imageUrl} />
      </div>

      {/* Minimal UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6 md:p-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 ui-fade-in">
          {/* Logo & Navigation */}
          <div className="flex flex-col gap-8">
            <a 
              href="https://theartdancestudio1120.netlify.app" 
              className="pointer-events-auto block hover:opacity-70 transition-opacity active:scale-95"
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-1">THEART</h1>
              <div className="flex items-center gap-2">
                <div className="w-8 h-px bg-white/50" />
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-70">Dance Studio</p>
              </div>
            </a>

            {/* Room Selector Buttons */}
            <div className="pointer-events-auto flex flex-col gap-2">
              <span className="text-[9px] font-black tracking-[0.3em] uppercase opacity-40 mb-1">Select View</span>
              <div className="flex flex-col gap-px bg-white/10 border border-white/10 overflow-hidden rounded-sm backdrop-blur-md">
                {STUDIO_ROOMS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`px-6 py-3 text-[11px] font-bold tracking-widest uppercase transition-all text-left flex items-center justify-between group ${
                      activeRoomId === room.id 
                        ? 'bg-white text-black' 
                        : 'bg-black/40 text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {room.id === 'LOBBY' ? 'LOBBY' : room.id === 'STUDIO-A' ? 'STUDIO A' : 'STUDIO B'}
                    {activeRoomId === room.id && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pointer-events-auto flex items-center gap-4">
             <button 
                onClick={toggleFullscreen}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 p-4 transition-all rounded-sm flex items-center gap-3 active:scale-95"
             >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 text-white/80" />
                    <span className="hidden md:inline text-[10px] font-bold tracking-widest uppercase">Exit Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 text-white/80" />
                    <span className="hidden md:inline text-[10px] font-bold tracking-widest uppercase">Fullscreen</span>
                  </>
                )}
             </button>
          </div>
        </div>

        {/* Bottom Navigation / Info */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 ui-fade-in">
          <div className="pointer-events-auto bg-black/40 backdrop-blur-3xl border border-white/10 p-6 md:p-8 max-w-sm rounded-sm">
            <div className="flex items-center gap-2 mb-3 text-white/60">
              <Navigation2 className="w-3 h-3 rotate-45" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Virtual Interactive Tour</span>
            </div>
            <h2 className="text-3xl font-bebas tracking-[0.1em] mb-3">{activeRoom.name}</h2>
            <p className="text-[11px] text-neutral-400 font-medium leading-relaxed uppercase tracking-widest">
              {activeRoom.description} Drag to explore the space.
            </p>
          </div>

          <div className="pointer-events-none flex flex-col items-end opacity-40">
            <div className="text-right">
              <span className="text-xs font-bold uppercase tracking-widest block mb-1">Collection</span>
              <span className="text-5xl font-black tracking-tighter uppercase leading-none">
                {activeRoomId === 'LOBBY' ? 'MAIN' : activeRoomId.split('-')[1]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mouse Interaction Hint (Only shows initially or on hover) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="flex flex-col items-center gap-2 text-white/20 animate-pulse">
          <Move className="w-6 h-6" />
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase">Drag to Pan</span>
        </div>
      </div>
    </div>
  );
};

export default App;
