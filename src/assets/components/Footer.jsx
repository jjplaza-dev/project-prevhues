import React, { useState, useEffect } from 'react';
import { useColorPalette } from '../utils/useColorPalette';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dominant, secondary, accent } = useColorPalette();

  const [roleMap, setRoleMap] = useState({
    bg: dominant,
    text: secondary,
    highlight: accent,
  });

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
  const handleDragStart = (e, role) => e.dataTransfer.setData('sourceRole', role);
  const handleDragOver = (e) => e.preventDefault();
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

  // --- DESIGN 1: The Modern Sitemap ---
  const LayoutSitemap = () => (
    <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 animate-fade-in">
      <div className="col-span-2 md:col-span-1">
        <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter" style={{ color: roleMap.text }}>Prev<span style={{ color: roleMap.highlight }}>Hues</span></h3>
        <p className="opacity-60 text-sm leading-relaxed" style={{ color: roleMap.text }}>
          The ultimate tool for designers to visualize color theory on real components.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-6 uppercase text-xs tracking-widest" style={{ color: roleMap.highlight }}>Product</h4>
        <ul className="space-y-4 text-sm font-medium" style={{ color: roleMap.text }}>
          <li className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity">Previewer</li>
          <li className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity">Color Tools</li>
          <li className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity"><Link to='/manager'>Templates</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6 uppercase text-xs tracking-widest" style={{ color: roleMap.highlight }}>Company</h4>
        <ul className="space-y-4 text-sm font-medium" style={{ color: roleMap.text }}>
          <li className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity">About Us</li>
          <li className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity">Careers</li>
          <li className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity">Manager</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-6 uppercase text-xs tracking-widest" style={{ color: roleMap.highlight }}>Social</h4>
        <div className="flex gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer" style={{ backgroundColor: roleMap.text, color: roleMap.bg }}>
              {i === 1 ? '𝕏' : i === 2 ? 'In' : 'Ig'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // --- DESIGN 2: Minimalist Centered ---
  const LayoutMinimal = () => (
    <div className="w-full max-w-4xl mx-auto px-6 text-center animate-fade-in">
      <div className="w-12 h-12 mx-auto mb-8 rounded-xl shadow-lg rotate-12" style={{ backgroundColor: roleMap.highlight }}></div>
      <h3 className="text-xl font-bold mb-6" style={{ color: roleMap.text }}>PREVHUES</h3>
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 text-sm font-semibold tracking-tight" style={{ color: roleMap.text }}>
        <span className="opacity-60 hover:opacity-100 cursor-pointer transition-opacity">Privacy Policy</span>
        <span className="opacity-60 hover:opacity-100 cursor-pointer transition-opacity">Terms of Service</span>
        <span className="opacity-60 hover:opacity-100 cursor-pointer transition-opacity">Cookie Policy</span>
        <span className="opacity-60 hover:opacity-100 cursor-pointer transition-opacity">Security</span>
      </div>
      <p className="text-xs opacity-40 uppercase font-black tracking-widest" style={{ color: roleMap.text }}>
        © 2026 PrevHues Studio. All Rights Reserved.
      </p>
    </div>
  );

  // --- DESIGN 3: Big Brand Statement ---
  const LayoutBigBrand = () => (
    <div className="w-full max-w-7xl mx-auto px-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end pb-12 mb-12">
        <h2 className="text-6xl md:text-[8rem] font-black tracking-tighter leading-none" style={{ color: roleMap.text }}>
          LET'S <br /> <span style={{ color: roleMap.highlight }}>BUILD.</span>
        </h2>
        <div className="mt-8 md:mt-0 text-right">
          <p className="text-lg font-bold mb-2" style={{ color: roleMap.text }}>Have a project in mind?</p>
          <p className="text-sm opacity-60 mb-6" style={{ color: roleMap.text }}>hello@prevhues.com</p>
          <button className="px-8 py-3 rounded-full font-bold transition-all hover:brightness-110 active:scale-95" style={{ backgroundColor: roleMap.highlight, color: roleMap.text }}>
            Get in Touch
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest" style={{ color: roleMap.text }}>
        <span className="opacity-50">Local Time: 11:24 PM</span>
        <span className="opacity-50">Based in Manila, PH</span>
      </div>
    </div>
  );

  const layouts = [<LayoutSitemap key="1" />, <LayoutMinimal key="2" />, <LayoutBigBrand key="3" />];

  return (
    <section 
      className="relative h-[80vh] md:h-[60vh] w-full flex items-center transition-colors duration-500 overflow-hidden border-t"
      style={{ backgroundColor: roleMap.bg, borderColor: `rgba(0,0,0,0.1)` }}
    >
      <div className="w-full h-full flex items-center justify-center pt-8 pb-24 overflow-y-auto no-scrollbar">
        {layouts[currentSlide]}
      </div>

      {/* --- NAVIGATION --- */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20">
        <button onClick={prevSlide} className="p-2 rounded-full hover:scale-110 shadow-lg transition-transform opacity-70 hover:opacity-100" style={{ backgroundColor: roleMap.text, color: roleMap.bg }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <div className="flex gap-3">
          {[0, 1, 2].map(idx => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'scale-125' : 'opacity-40 hover:opacity-100'}`} style={{ backgroundColor: currentSlide === idx ? roleMap.highlight : roleMap.text }} />
          ))}
        </div>
        <button onClick={nextSlide} className="p-2 rounded-full hover:scale-110 shadow-lg transition-transform opacity-70 hover:opacity-100" style={{ backgroundColor: roleMap.text, color: roleMap.bg }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
      </div>

      {/* --- SWAP TRIGGER --- */}
      <button onClick={() => setIsModalOpen(true)} className="absolute bottom-20 right-6 z-30 flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg hover:scale-105 transition-all bg-white border border-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
        <span className="text-xs font-bold text-black">Swap Colors</span>
      </button>

      {/* --- SWAP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl">✕</button>
            <h3 className="text-xl font-black text-center mb-2 text-gray-800">Footer Colors</h3>
            <p className="text-xs text-center text-gray-500 mb-6">Drag and drop to swap color roles.</p>
            <div className="flex justify-between items-center gap-4">
              {[{ l: 'Background', r: 'bg' }, { l: 'Text/UI', r: 'text' }, { l: 'Highlight', r: 'highlight' }].map(item => (
                <div key={item.r} className="flex flex-col items-center gap-2 w-1/3">
                  <div className="w-16 h-16 rounded-2xl border-2 border-gray-100 shadow-sm cursor-grab active:cursor-grabbing hover:scale-105 transition-transform" style={{ backgroundColor: roleMap[item.r] }} draggable onDragStart={e => handleDragStart(e, item.r)} onDragOver={handleDragOver} onDrop={e => handleDrop(e, item.r)} />
                  <span className="text-[10px] font-bold uppercase text-gray-400 text-center leading-tight">{item.l}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setIsModalOpen(false)} className="w-full mt-8 bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors">Done</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Footer;