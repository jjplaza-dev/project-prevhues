import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useColorPalette } from '../utils/useColorPalette';
import { supabase } from '../../../supabaseClient';

const Navbar = () => {
  const { dominant, secondary, accent, setColor, setPalette } = useColorPalette();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [latestPalettes, setLatestPalettes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [draggedColorKey, setDraggedColorKey] = useState(null);
  const navigate = useNavigate();

  // --- 1. RESTRICT BODY SCROLL ---
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Fetch data for the Navbar Drawer
  useEffect(() => {
    if (isModalOpen) {
      fetchQuickData();
    }
  }, [isModalOpen]);

  const fetchQuickData = async () => {
    const { data: palettes } = await supabase
      .from('color_palettes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8); // --- 2. LIMIT TO LATEST 8 ---

    if (palettes) {
      setLatestPalettes(palettes);
      const allCats = palettes.flatMap(p => p.palette_category || []);
      setCategories([...new Set(allCats)]);
    }
  };

  const applyAndClose = (item) => {
    const colors = typeof item.color_palette === 'string' ? JSON.parse(item.color_palette).colors : item.color_palette.colors;
    setPalette({
      dominant: colors[0].hex,
      secondary: colors[1].hex,
      accent: colors[2].hex
    });
    setIsModalOpen(false);
    navigate('/');
  };

  // --- 3. DRAG & DROP SWAPPING LOGIC ---
  const colorItems = [
    { label: 'Dom', key: 'dominant', value: dominant },
    { label: 'Sec', key: 'secondary', value: secondary },
    { label: 'Acc', key: 'accent', value: accent }
  ];

  const handleDragStart = (e, key) => {
    setDraggedColorKey(key);
    // Slight transparency effect while dragging
    e.currentTarget.style.opacity = '0.5'; 
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggedColorKey(null);
  };

  const handleDrop = (e, targetKey) => {
    e.preventDefault();
    if (draggedColorKey && draggedColorKey !== targetKey) {
      const sourceValue = colorItems.find(c => c.key === draggedColorKey).value;
      const targetValue = colorItems.find(c => c.key === targetKey).value;
      
      // Swap the colors in global state
      setColor(draggedColorKey, targetValue);
      setColor(targetKey, sourceValue);
    }
  };

  return (
    <nav className="h-[10vh] bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4 sm:gap-8">
        {/* --- 4. DYNAMIC LOGO --- */}
        <Link to="/" className="font-black text-xl tracking-tighter transition-colors duration-300">
          <span style={{ color: dominant }}>PREV</span>
          <span style={{ color: accent }}>HUES</span>
        </Link>
        <div className="flex gap-2 sm:gap-4 text-sm font-medium text-gray-600">
          <Link to="/palettes" className="hover:text-blue-600 transition-colors">Palettes</Link>
          <Link to="/favorites" className="hover:text-blue-600 transition-colors">Favorites</Link>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 transition-all active:scale-95"
        >
          <div className="flex -space-x-2">
            <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm transition-colors duration-300" style={{ backgroundColor: dominant }} />
            <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm transition-colors duration-300" style={{ backgroundColor: secondary }} />
            <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm transition-colors duration-300" style={{ backgroundColor: accent }} />
          </div>
          <span className="hidden sm:inline text-xs font-black uppercase tracking-tight text-gray-600">Adjust</span>
        </button>

        {isModalOpen && (
          <>
            <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:bg-transparent" onClick={() => setIsModalOpen(false)} />

            <div 
              className={`
                fixed inset-x-0 bottom-0 top-[10vh] z-[70] flex flex-col
                lg:absolute lg:inset-auto lg:top-full lg:right-0 lg:mt-3 lg:w-96
                lg:max-h-[85vh] /* Prevents drawer from exceeding screen height on desktop */
                bg-white p-6 lg:rounded-3xl shadow-2xl border-t lg:border border-gray-100
                animate-in slide-in-from-bottom duration-300 lg:zoom-in-95
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* UPPER PART: ADJUST COLORS */}
              <div className="mb-6 shrink-0">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest">Adjust Palette</h3>
                  <button onClick={() => setIsModalOpen(false)} className="lg:hidden text-gray-400">✕</button>
                </div>
                
                <div className="flex justify-around items-center">
                  {colorItems.map((color) => (
                    <div 
                      key={color.key} 
                      className="flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={(e) => handleDragStart(e, color.key)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()} // Must prevent default to allow drop
                      onDrop={(e) => handleDrop(e, color.key)}
                    >
                      <label 
                        className="w-16 h-16 rounded-2xl border-4 border-gray-50 shadow-sm transition-all relative overflow-hidden group hover:scale-105"
                        style={{ backgroundColor: color.value }}
                      >
                        <input 
                          type="color" 
                          className="absolute inset-0 opacity-0 cursor-pointer scale-[3]" 
                          value={color.value}
                          onChange={(e) => setColor(color.key, e.target.value)}
                        />
                      </label>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{color.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- 5. FLEX-1 CONTAINER FOR SCROLLING --- */}
              <div className="flex-1 flex flex-col min-h-0">
                
                {/* Latest Palettes (Fixed Height) */}
                <div className="shrink-0">
                  <h4 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Latest Palettes</h4>
                  <div className="flex gap-4 grid grid-cols-4 pb-2 no-scrollbar">
                    {latestPalettes.map((item) => {
                      const colors = typeof item.color_palette === 'string' ? JSON.parse(item.color_palette).colors : item.color_palette.colors;
                      return (
                        <button 
                          key={item.id}
                          onClick={() => applyAndClose(item)}
                          className="flex-shrink-0 w-16 group"
                        >
                          <div className="h-fit p-2 w-fit flex flex-row rounded-lg border hover:border-black/30 border-transparent transition-all">
                            <div className='w-5 h-5 aspect-square rounded-full translate-x-[30%] z-1' style={{backgroundColor: colors[0].hex }} />
                            <div className='w-5 h-5 aspect-square rounded-full translate-x-[0%] z-[2]' style={{backgroundColor: colors[1].hex }} />
                            <div className='w-5 h-5 aspect-square rounded-full translate-x-[-30%] z-[3]' style={{backgroundColor: colors[2].hex }} />
                          </div>
                          <p className="text-[8px] w-full font-bold truncate mt-1 text-gray-500 uppercase">{item.palette_name}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-black/5 my-6 shrink-0"></div>

                {/* Categories (Fills remaining space, Y-Scrollable) */}
                <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-4 custom-scrollbar">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat, i) => (
                      <button 
                        key={i}
                        onClick={() => {
                          setIsModalOpen(false);
                          navigate(`/palettes/${cat}`);
                        }}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-[10px] font-bold uppercase text-gray-500 transition-colors border border-gray-100"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-50 shrink-0">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black transition-colors"
                >
                  Done Adjusting
                </button>
              </div>

            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;