import React, { useState, useEffect } from 'react';
import { useColorPalette } from '../utils/useColorPalette';

const CTASection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dominant, secondary, accent } = useColorPalette();

  // Local state to map global colors to specific roles for this section
  const [roleMap, setRoleMap] = useState({
    bg: dominant,
    text: secondary,
    highlight: accent,
  });

  // Sync local state if global palette changes
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

  // --- DESIGN 1: The High-Contrast Banner ---
  const LayoutBanner = () => (
    <div className="w-full max-w-5xl mx-auto px-6 animate-fade-in">
      <div 
        className="rounded-3xl p-8 md:p-16 text-center shadow-2xl relative overflow-hidden"
        style={{ backgroundColor: roleMap.text }}
      >
        {/* Decorative accent circle */}
        <div 
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20"
          style={{ backgroundColor: roleMap.highlight }}
        ></div>
        
        <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10" style={{ color: roleMap.bg }}>
          Ready to transform <br /> your workflow?
        </h2>
        <p className="text-lg opacity-80 mb-10 max-w-xl mx-auto relative z-10" style={{ color: roleMap.bg }}>
          This banner uses your secondary color as the primary container to grab immediate attention from the rest of the page.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center relative z-10">
          <button 
            className="font-bold px-10 py-4 rounded-xl shadow-lg hover:scale-105 transition-all"
            style={{ backgroundColor: roleMap.highlight, color: roleMap.text }}
          >
            Get Started Now
          </button>
          <button 
            className="font-bold px-10 py-4 rounded-xl hover:opacity-90 transition-all"
            style={{ backgroundColor: roleMap.bg, color: roleMap.text }}
          >
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );

  // --- DESIGN 2: The Inline Newsletter ---
  const LayoutNewsletter = () => (
    <div className="max-w-4xl mx-auto px-6 w-full text-center animate-fade-in">
      <div className="mb-10">
        <span 
          className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ backgroundColor: roleMap.highlight, color: roleMap.text }}
        >
          Newsletter
        </span>
        <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4" style={{ color: roleMap.text }}>
          Stay in the loop.
        </h2>
        <p className="opacity-70" style={{ color: roleMap.text }}>
          Get the latest design trends and updates delivered to your inbox.
        </p>
      </div>
      <form className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="flex-1 px-6 py-4 rounded-xl border-2 bg-transparent outline-none transition-all"
          style={{ 
            borderColor: roleMap.text, 
            color: roleMap.text,
            '--tw-border-opacity': '0.2' 
          }}
        />
        <button 
          className="font-bold px-8 py-4 rounded-xl hover:brightness-110 shadow-lg transition-all"
          style={{ backgroundColor: roleMap.highlight, color: roleMap.text }}
        >
          Subscribe
        </button>
      </form>
    </div>
  );

  // --- DESIGN 3: The Minimalist Card ---
  const LayoutMinimalist = () => (
    <div className="max-w-7xl mx-auto px-6 w-full flex justify-center animate-fade-in">
      <div 
        className="border-4 p-10 md:p-20 rounded-[3rem] text-center max-w-2xl"
        style={{ borderColor: roleMap.text, borderOpacity: 0.1 }}
      >
        <h2 className="text-3xl md:text-5xl font-black mb-6" style={{ color: roleMap.text }}>
          Still have questions?
        </h2>
        <p className="text-lg opacity-60 mb-10" style={{ color: roleMap.text }}>
          Our team is here to help you find the perfect color balance for your next big project.
        </p>
        <button 
          className="w-full md:w-auto font-black px-12 py-5 rounded-2xl text-xl shadow-xl hover:-translate-y-1 transition-all"
          style={{ backgroundColor: roleMap.highlight, color: roleMap.text }}
        >
          Chat with us
        </button>
      </div>
    </div>
  );

  const layouts = [<LayoutBanner key="1" />, <LayoutNewsletter key="2" />, <LayoutMinimalist key="3" />];

  return (
    <section 
      className="relative h-[90vh] w-full flex items-center transition-colors duration-500 overflow-hidden border-t border-opacity-10"
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

      {/* --- SECTION COLOR SWAP TRIGGER --- */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-6 right-6 z-30 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg hover:scale-105 transition-all bg-white border border-gray-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        <span className="text-xs font-bold text-black">Swap Colors</span>
      </button>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl">✕</button>
            <h3 className="text-xl font-black text-center mb-2 text-gray-800">CTA Colors</h3>
            <p className="text-xs text-center text-gray-500 mb-6">Swap the color roles for this specific section.</p>

            <div className="flex justify-between items-center gap-4">
              {[
                { label: 'Background', role: 'bg' },
                { label: 'Text/Base', role: 'text' },
                { label: 'Accent', role: 'highlight' }
              ].map((item) => (
                <div key={item.role} className="flex flex-col items-center gap-2 w-1/3">
                  <div 
                    className="w-16 h-16 rounded-2xl border-2 border-gray-100 shadow-sm cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                    style={{ backgroundColor: roleMap[item.role] }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.role)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, item.role)}
                  />
                  <span className="text-[10px] font-bold uppercase text-gray-400 text-center">{item.label}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-8 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default CTASection;