import React, { useState, useEffect } from 'react';
import { useColorPalette } from '../utils/useColorPalette';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dominant, secondary, accent } = useColorPalette();

  // Local state to map global colors to specific roles in this section
  const [roleMap, setRoleMap] = useState({
    bg: dominant,
    text: secondary,
    highlight: accent,
  });

  // Sync local state if global palette changes entirely
  useEffect(() => {
    setRoleMap({
      bg: dominant,
      text: secondary,
      highlight: accent,
    });
  }, [dominant, secondary, accent]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % 3);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + 3) % 3);

  // --- DRAG AND DROP LOGIC ---
  const handleDragStart = (e, role) => {
    e.dataTransfer.setData('sourceRole', role);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, targetRole) => {
    e.preventDefault();
    const sourceRole = e.dataTransfer.getData('sourceRole');
    if (sourceRole === targetRole) return;

    // Swap the colors between the source role and target role
    setRoleMap((prev) => ({
      ...prev,
      [sourceRole]: prev[targetRole],
      [targetRole]: prev[sourceRole],
    }));
  };

  // --- DESIGNS (Using roleMap instead of CSS vars) ---
  const LayoutCentered = () => (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-6 animate-fade-in">
      <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight" style={{ color: roleMap.text }}>
        The Classic Centered Hero
      </h1>
      <p className="text-lg md:text-xl mb-10 opacity-80 leading-relaxed max-w-2xl" style={{ color: roleMap.text }}>
        Perfect for simple, bold statements. The background uses your dominant 60%, the text acts as the 30% secondary, and the button provides that 10% pop.
      </p>
      <button 
        className="font-bold px-10 py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
        style={{ backgroundColor: roleMap.highlight, color: roleMap.text }}
      >
        Primary Action
      </button>
    </div>
  );

  const LayoutSplit = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-6 w-full animate-fade-in">
      <div className="flex flex-col items-start text-left">
        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight" style={{ color: roleMap.text }}>
          Modern Split <br /> Layout Design
        </h1>
        <p className="text-lg mb-8 opacity-80" style={{ color: roleMap.text }}>
          Highly effective for software and apps. Text sits on the left while a product preview sits on the right.
        </p>
        <div className="flex gap-4">
          <button 
            className="font-bold px-8 py-3 rounded-lg shadow-md hover:brightness-110 transition-all"
            style={{ backgroundColor: roleMap.highlight, color: roleMap.text }}
          >
            Get Started
          </button>
          <button 
            className="border-2 font-bold px-8 py-3 rounded-lg hover:brightness-110 transition-all"
            style={{ borderColor: roleMap.text, color: roleMap.text, backgroundColor: 'transparent' }}
          >
            Learn More
          </button>
        </div>
      </div>
      <div 
        className="w-full h-64 md:h-80 rounded-2xl border-4 opacity-20 shadow-2xl relative overflow-hidden"
        style={{ borderColor: roleMap.text, backgroundColor: roleMap.highlight }}
      >
         <div className="absolute top-4 left-4 w-12 h-2 rounded-full opacity-40" style={{ backgroundColor: roleMap.text }}></div>
         <div className="absolute top-10 left-4 w-24 h-2 rounded-full opacity-20" style={{ backgroundColor: roleMap.text }}></div>
      </div>
    </div>
  );

  const LayoutDashboard = () => (
    <div className="flex flex-col items-center max-w-6xl mx-auto px-6 w-full animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ color: roleMap.text }}>The Interface Preview</h2>
        <p className="opacity-70" style={{ color: roleMap.text }}>Testing your accent color on interactive UI elements.</p>
      </div>
      <div className="w-full rounded-t-3xl p-4 md:p-6 shadow-2xl flex gap-4 min-h-[300px]" style={{ backgroundColor: roleMap.text }}>
        <div className="hidden md:flex w-1/4 flex-col gap-3">
          <div className="w-full h-8 rounded-lg opacity-40" style={{ backgroundColor: roleMap.bg }}></div>
          <div className="w-3/4 h-8 rounded-lg opacity-20" style={{ backgroundColor: roleMap.bg }}></div>
          <div className="w-full h-8 rounded-lg opacity-60 mt-auto" style={{ backgroundColor: roleMap.highlight }}></div>
        </div>
        <div className="flex-1 rounded-xl p-4 flex flex-col gap-4" style={{ backgroundColor: roleMap.bg }}>
           <div className="w-1/3 h-6 rounded-md" style={{ backgroundColor: roleMap.highlight }}></div>
           <div className="w-full h-32 rounded-lg opacity-10" style={{ backgroundColor: roleMap.text }}></div>
           <div className="grid grid-cols-3 gap-2">
              <div className="h-12 rounded-lg opacity-20" style={{ backgroundColor: roleMap.text }}></div>
              <div className="h-12 rounded-lg opacity-20" style={{ backgroundColor: roleMap.text }}></div>
              <div className="h-12 rounded-lg" style={{ backgroundColor: roleMap.highlight }}></div>
           </div>
        </div>
      </div>
    </div>
  );

  const layouts = [<LayoutCentered key="1" />, <LayoutSplit key="2" />, <LayoutDashboard key="3" />];

  return (
    <section 
      className="relative h-[90vh] w-full flex items-center transition-colors duration-500 overflow-hidden"
      style={{ backgroundColor: roleMap.bg }}
    >
      
      {/* Main Container */}
      <div className="w-full h-full flex items-center justify-center pt-8 pb-24 overflow-y-auto no-scrollbar">
        {layouts[currentSlide]}
      </div>

      {/* --- UNIFIED BOTTOM CONTROLS --- */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        
        <button 
          onClick={prevSlide}
          className="p-2 rounded-full hover:scale-110 shadow-lg transition-transform focus:outline-none opacity-70 hover:opacity-100"
          style={{ backgroundColor: roleMap.text, color: roleMap.bg }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="flex gap-3">
          {[0, 1, 2].map((idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'scale-125' : 'opacity-40 hover:opacity-100'}`}
              style={{ backgroundColor: currentSlide === idx ? roleMap.highlight : roleMap.text }}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="p-2 rounded-full hover:scale-110 shadow-lg transition-transform focus:outline-none opacity-70 hover:opacity-100"
          style={{ backgroundColor: roleMap.text, color: roleMap.bg }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

      </div>

      {/* --- SECTION COLOR SETTINGS TRIGGER --- */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-6 right-6 z-30 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg hover:scale-105 transition-all"
        style={{ backgroundColor: '#ffffff', color: '#000000', border: '1px solid #e5e7eb' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        <span className="text-xs font-bold">Swap Colors</span>
      </button>

      {/* --- DRAG & DROP COLOR SWAP MODAL --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl"
            >
              ✕
            </button>
            <h3 className="text-xl font-black text-center mb-2 text-gray-800">Section Colors</h3>
            <p className="text-xs text-center text-gray-500 mb-6">Drag and drop to swap colors for this section.</p>

            <div className="flex justify-between items-center gap-4">
              {[
                { label: 'Background', role: 'bg' },
                { label: 'Text/UI', role: 'text' },
                { label: 'Highlight', role: 'highlight' }
              ].map((item) => (
                <div key={item.role} className="flex flex-col items-center gap-2 w-1/3">
                  <div 
                    className="w-16 h-16 rounded-2xl border-2 border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                    style={{ backgroundColor: roleMap[item.role] }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.role)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.role)}
                  />
                  <span className="text-[10px] font-bold uppercase text-gray-500 text-center">{item.label}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-8 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
              Apply Swaps
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default HeroSection;