import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import { useColorPalette } from '../utils/useColorPalette';
import { Heart, Palette, Copy, Check } from 'lucide-react';

const PaletteCategoryPage = () => {
  const { category } = useParams();
  const [palettes, setPalettes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [copiedColor, setCopiedColor] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  const ITEMS_PER_PAGE = 12;
  const navigate = useNavigate();
  const setGlobalPalette = useColorPalette((state) => state.setPalette);

  // --- INITIALIZE FAVORITES FROM LOCAL STORAGE ---
  useEffect(() => {
    const saved = localStorage.getItem('prevhues_favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // --- RESET STATE WHEN CATEGORY CHANGES ---
  useEffect(() => {
    setPalettes([]);
    setPage(0);
    setHasMore(true);
  }, [category]);

  // --- FETCH LOGIC ---
  const fetchPalettesByCategory = useCallback(async (pageNum) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    const from = pageNum * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    try {
      const { data, error } = await supabase
        .from('color_palettes')
        .select('id, palette_name, color_palette, palette_category')
        .contains('palette_category', [category.toLowerCase()])
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        if (data.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }

        setPalettes((prev) => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNewPalettes = data.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNewPalettes];
        });
      }
    } catch (err) {
      console.error('Error fetching filtered palettes:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [category, isLoading, hasMore]);

  useEffect(() => {
    fetchPalettesByCategory(page);
  }, [page, category]); 

  // --- INFINITE SCROLL OBSERVER ---
  const observer = useRef();
  const lastPaletteRef = useCallback((node) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  // --- FAVORITES LOGIC ---
  const toggleFavorite = (e, palette) => {
    e.stopPropagation();
    let updatedFavorites;
    const isFav = favorites.some(fav => fav.id === palette.id);

    if (isFav) {
      updatedFavorites = favorites.filter(fav => fav.id !== palette.id);
    } else {
      updatedFavorites = [...favorites, palette];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('prevhues_favorites', JSON.stringify(updatedFavorites));
  };

  const handleCopy = (colorHex, e) => {
    e.stopPropagation(); 
    navigator.clipboard.writeText(colorHex);
    setCopiedColor(colorHex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const applyPalette = (colors, e) => {
    e.stopPropagation();
    setGlobalPalette({
      dominant: colors[0].hex,
      secondary: colors[1].hex,
      accent: colors[2].hex
    });
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link to="/palettes" className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline mb-2 block">
            ← Latest Palettes
          </Link>
          <h1 className="text-5xl font-black tracking-tighter capitalize text-gray-900">
            {category} <span className="text-gray-300">Palettes</span>
          </h1>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {palettes.map((item, index) => {
          const parsedData = typeof item.color_palette === 'string' 
            ? JSON.parse(item.color_palette) 
            : item.color_palette;
          
          const colors = parsedData.colors;
          const isFavorite = favorites.some(fav => fav.id === item.id);

          return (
            <div 
              key={item.id}
              ref={index === palettes.length - 1 ? lastPaletteRef : null}
              className="group flex flex-col bg-white rounded-2xl transition-all duration-300"
            >
              {/* Proportional Color Display */}
              <div className="h-40 lg:h-60 w-full flex flex-col rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                {colors.map((c, i) => (
                  <div 
                    key={i}
                    onClick={(e) => handleCopy(c.hex, e)}
                    className="w-full relative flex items-center justify-center cursor-pointer group/color"
                    style={{ height: i === 0 ? '40%' : i === 1 ? '35%' : '25%', backgroundColor: c.hex }}
                  >
                    <div className="opacity-0 group-hover/color:opacity-100 flex items-center gap-2 bg-black/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full transition-all">
                      {copiedColor === c.hex ? <Check size={12} /> : <Copy size={12} />}
                      {copiedColor === c.hex ? 'Copied' : c.hex.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Info & Action Area */}
              <div className="flex items-center justify-between pt-5 px-1">
                <div className="flex flex-col pr-4">
                  <h3 className="font-black text-gray-900 capitalize tracking-tight">
                    {item.palette_name || 'Untitled'}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleFavorite(e, item)}
                    className={`p-2.5 rounded-xl transition-all active:scale-90 ${
                      isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Heart size={20} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
                  </button>
                  
                  <button
                    onClick={(e) => applyPalette(colors, e)}
                    className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-all active:scale-90 shadow-lg shadow-gray-200"
                    title="Set as Theme"
                  >
                    <Palette size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* End State or Empty State */}
      {!hasMore && palettes.length > 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-300 font-black uppercase text-[10px] tracking-[0.2em]">
            You've reached the end of {category}
          </p>
        </div>
      )}

      {!isLoading && palettes.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold">No palettes found in this category.</p>
          <Link to="/manager" className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-xl text-sm font-bold">
            Create one now
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaletteCategoryPage;