import React, { useState, useEffect } from 'react';
import { useColorPalette } from '../utils/useColorPalette';

const AboutSection = () => {
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
    e.preventDefault();
  };

  const handleDrop = (e, targetRole) => {
    e.preventDefault();
    const sourceRole = e.dataTransfer.getData('sourceRole');
    if (sourceRole === targetRole) return;

    setRoleMap((prev) => ({
      ...prev,
      [sourceRole]: prev[targetRole],
      [targetRole]: prev[sourceRole],
    }));
  };

  // --- DESIGN 1: The Modern Mission (Side-by-Side) ---
  const LayoutMission = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto px-6 w-full animate-fade-in">
      <div className="relative hidden md:block">
        {/* Decorative background element */}
        <div 
          className="absolute -top-4 -left-4 w-24 h-24 rounded-full opacity-20 blur-2xl"
          style={{ backgroundColor: roleMap.highlight }}
        ></div>
        <div 
          className="w-full aspect-square max-h-80 mx-auto rounded-3xl opacity-10 border-2 flex items-center justify-center relative z-10"
          style={{ backgroundColor: roleMap.text, borderColor: roleMap.text }}
        >
           <span className="font-bold italic" style={{ color: roleMap.bg }}>Image</span>
        </div>
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="font-bold tracking-widest uppercase text-sm mb-4" style={{ color: roleMap.highlight }}>
          Our Mission
        </span>
        <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6" style={{ color: roleMap.text }}>
          Driven by Design, Focused on Detail.
        </h2>
        <p className="text-base md:text-lg opacity-80 leading-relaxed mb-4" style={{ color: roleMap.text }}>
          This layout is the "bread and butter" of About pages. It balances a large visual element with a strong heading and descriptive text. 
        </p>
        <p className="text-base md:text-lg opacity-80 leading-relaxed" style={{ color: roleMap.text }}>
          The dominant color creates a clean canvas, while the secondary color ensures your story is the focal point.
        </p>
      </div>
    </div>
  );

  // --- DESIGN 2: The Core Values (3-Column Grid) ---
  const LayoutValues = () => (
    <div className="max-w-7xl mx-auto px-6 w-full text-center animate-fade-in">
      <h2 className="text-3xl md:text-5xl font-black mb-8 md:mb-16" style={{ color: roleMap.text }}>
        Our Core Values
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3].map((val) => (
          <div 
            key={val} 
            className="p-6 md:p-8 rounded-2xl group hover:-translate-y-2 transition-transform duration-300 shadow-xl"
            style={{ backgroundColor: roleMap.text, color: roleMap.bg }}
          >
            <div 
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg mb-4 md:mb-6 flex items-center justify-center font-bold text-xl mx-auto md:mx-0"
              style={{ backgroundColor: roleMap.highlight, color: roleMap.text }}
            >
              {val}
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Value Item {val}</h3>
            <p className="opacity-90 text-sm md:text-base">
              Notice how the colors flip here. The secondary color becomes the background for these cards.
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  // --- DESIGN 3: The Narrative (Minimalist Content) ---
  const LayoutNarrative = () => (
    <div className="max-w-4xl mx-auto px-6 w-full text-center animate-fade-in">
      <div className="w-16 md:w-20 h-1 mx-auto mb-8 md:mb-10" style={{ backgroundColor: roleMap.highlight }}></div>
      <h2 className="text-2xl md:text-5xl font-serif italic mb-8 md:mb-10 leading-tight" style={{ color: roleMap.text }}>
        "We believe that every pixel should serve a purpose, and every color should tell a story."
      </h2>
      <p className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto" style={{ color: roleMap.text }}>
        This is a narrative-heavy design. It uses plenty of whitespace (your Dominant color) to make the text feel prestigious and high-end.
      </p>
      
      {/* Narrative Author Profile */}
      <div className="mt-8 md:mt-12 flex items-center justify-center gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full opacity-50" style={{ backgroundColor: roleMap.highlight }}></div>
        <div className="text-left">
          <p className="font-bold text-sm md:text-base" style={{ color: roleMap.text }}>John Doe</p>
          <p className="opacity-60 text-xs md:text-sm" style={{ color: roleMap.text }}>Founder of PrevHues</p>
        </div>
      </div>
    </div>
  );

  const layouts = [<LayoutMission key="1" />, <LayoutValues key="2" />, <LayoutNarrative key="3" />];

  return (
    <section 
      className="relative h-[90vh] w-full flex items-center transition-colors duration-500 overflow-hidden border-t"
      style={{ backgroundColor: roleMap.bg, borderColor: roleMap.text }}
    >
      
      {/* Main Content Area */}
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
        className="absolute bottom-20 right-6 z-30 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg hover:scale-105 transition-all"
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

export default AboutSection;