import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useColorPalette } from '../utils/useColorPalette';

const Navbar = () => {
  const { dominant, secondary, accent, setColor } = useColorPalette();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="h-[10vh] bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-black text-xl tracking-tighter text-gray-800">
          PREV<span className="text-blue-600">HUES</span>
        </Link>
        <div className="hidden md:flex gap-4 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/palette" className="hover:text-blue-600">Preview</Link>
        </div>
      </div>

      {/* --- RELATIVE WRAPPER FOR POPUP ALIGNMENT --- */}
      <div className="relative">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 transition-all active:scale-95"
        >
          <div className="flex -space-x-2">
            <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: dominant }} />
            <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: secondary }} />
            <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: accent }} />
          </div>
          <span className="hidden sm:inline text-xs font-black uppercase tracking-tight text-gray-600">
            Adjust Palette
          </span>
        </button>

        {isModalOpen && (
          <>
            {/* --- BACKDROP (Handles clicking outside) --- */}
            <div 
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none" 
              onClick={() => setIsModalOpen(false)} 
            />

            {/* --- MODAL / POPUP CONTENT --- */}
            <div 
              className={`
                fixed inset-x-0 top-[20%] z-[70] 
                lg:absolute lg:inset-auto lg:top-full lg:right-0 lg:mt-3 
                bg-white w-[90%] max-w-md mx-auto lg:mx-0 lg:w-96
                rounded-[2.5rem] lg:rounded-3xl p-8 lg:p-6 
                shadow-2xl border border-gray-100
                animate-in zoom-in-95 duration-200
              `}
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking colors/inside
            >
              <div className="flex justify-between items-center mb-6 lg:mb-4">
                <h3 className="font-black text-gray-800 tracking-tight lg:text-sm uppercase">Adjust Colors</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-300 hover:text-gray-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex justify-between items-center gap-2">
                {[
                  { label: 'D', key: 'dominant', value: dominant },
                  { label: 'S', key: 'secondary', value: secondary },
                  { label: 'A', key: 'accent', value: accent }
                ].map((color) => (
                  <div key={color.key} className="flex flex-col items-center gap-2">
                    <label 
                      className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl border-4 border-gray-50 shadow-sm cursor-pointer hover:scale-105 transition-all relative overflow-hidden"
                      style={{ backgroundColor: color.value }}
                    >
                      <input 
                        type="color" 
                        className="absolute inset-0 opacity-0 cursor-pointer scale-[3]" 
                        value={color.value}
                        onChange={(e) => setColor(color.key, e.target.value)}
                      />
                    </label>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{color.label}</span>
                  </div>
                ))}
              </div>

              {/* Hex Display Row (Optional but helpful for designers) */}
              <div className="mt-6 lg:mt-4 pt-4 border-t border-gray-50 flex justify-between text-[10px] font-mono text-gray-400">
                <span>{dominant.toUpperCase()}</span>
                <span>{secondary.toUpperCase()}</span>
                <span>{accent.toUpperCase()}</span>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-6 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold text-sm transition-all"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;