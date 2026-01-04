
import React, { useState } from 'react';
import { STUDIO_ROOMS } from '../constants';
import { ChevronRight, Maximize2, Move } from 'lucide-react';
import { Three360Viewer } from './Three360Viewer';

export const VirtualStudio: React.FC = () => {
  const [activeRoomId, setActiveRoomId] = useState(STUDIO_ROOMS[0].id);
  const activeRoom = STUDIO_ROOMS.find(r => r.id === activeRoomId) || STUDIO_ROOMS[0];

  // 실제 제공해주신 이미지의 스타일과 유사한 고화질 파노라마를 위해 
  // 상용 URL을 사용하거나, 실제 파일 경로를 지정할 수 있습니다.
  const panoramaUrl = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"; 
  // Note: 사용자가 직접 이미지를 업로드한 경로를 'activeRoom.imageUrl'에 넣으시면 됩니다.

  return (
    <section id="tour" className="relative h-screen bg-black flex overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-20 md:w-64 bg-black/90 backdrop-blur-xl border-r border-white/5 z-20 flex flex-col">
        <div className="p-6 border-b border-white/5 hidden md:block">
          <h3 className="text-[10px] font-black tracking-[0.3em] text-neutral-500 uppercase">Studio Rooms</h3>
        </div>
        <div className="flex-1 overflow-y-auto pt-4">
          {STUDIO_ROOMS.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoomId(room.id)}
              className={`w-full p-6 text-left transition-all flex items-center justify-between group relative ${
                activeRoomId === room.id ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold opacity-50 mb-1">{room.id}</span>
                <span className="text-xs font-black tracking-widest uppercase truncate">{room.name}</span>
              </div>
              {activeRoomId === room.id && <div className="absolute left-0 w-1 h-12 bg-white" />}
              <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${activeRoomId === room.id ? 'translate-x-1 opacity-100' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Viewer Area */}
      <div className="flex-1 relative">
        {/* 3D Rendering Layer */}
        <div className="absolute inset-0">
          <Three360Viewer imageUrl={activeRoom.imageUrl} />
        </div>

        {/* Overlay Controls & Info */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12">
          {/* Top Info */}
          <div className="flex justify-between items-start pointer-events-auto">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 max-w-sm">
              <div className="flex items-center gap-2 mb-2 text-white/50">
                <Move className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">360° Interactive View</span>
              </div>
              <h2 className="text-3xl font-bebas tracking-wider text-white mb-2">{activeRoom.name}</h2>
              <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                {activeRoom.description}
              </p>
            </div>
            
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 p-4 text-white transition-all">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Branding (Mimicking the user's logo style) */}
          <div className="flex justify-end items-end select-none opacity-80">
            <div className="text-right border-r-4 border-white pr-6 py-2">
              <div className="text-5xl font-black tracking-tighter leading-none">VA</div>
              <div className="text-[10px] font-black tracking-[0.5em] uppercase mt-1">THEART STUDIO</div>
            </div>
          </div>
        </div>

        {/* Hint for Interaction */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 pointer-events-none animate-pulse">
          <Move className="w-4 h-4 text-white" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Drag to explore the studio</span>
        </div>
      </div>
    </section>
  );
};
