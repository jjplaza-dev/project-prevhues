import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useColorPalette } from '../utils/useColorPalette';
import { Heart, Palette, Copy, Check, FolderHeart } from 'lucide-react';

const Favorites = () => {
  const [allFavorites, setAllFavorites] = useState([]); // The full list from localStorage
  const [displayedPalettes, setDisplayedPalettes] = useState([]); // The chunk currently visible
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedColor, setCopiedColor] = useState(null);

  const ITEMS_PER_PAGE = 12;
  const navigate = useNavigate();
  const setGlobalPalette = useColorPalette((state) => state.setPalette);

  // --- LOAD INITIAL DATA ---
  useEffect(() => {
    const saved = localStorage.getItem('prevhues_favorites');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAllFavorites(parsed);
      // Initialize the first batch
      setDisplayedPalettes(parsed.slice(0, ITEMS_PER_PAGE));
      setHasMore(parsed.length > ITEMS_PER_PAGE);
    }
  }, []);

  // --- SIMULATE LOADING MORE (INFINITE SCROLL) ---
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Artificial delay to keep the "feel" consistent with the library
    setTimeout(() => {
      const nextBatchStart = page * ITEMS_PER_PAGE;
      const nextBatchEnd = nextBatchStart + ITEMS_PER_PAGE;
      const nextBatch = allFavorites.slice(nextBatchStart, nextBatchEnd);

      setDisplayedPalettes((prev) => [...prev, ...nextBatch]);
      setPage((prev) => prev + 1);
      setHasMore(allFavorites.length > nextBatchEnd);
      setIsLoading(false);
    }, 500);
  }, [page, allFavorites, isLoading, hasMore]);

  // --- OBSERVER ---
  const observer = useRef();
  const lastPaletteRef = useCallback((node) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMore]);

  // --- ACTIONS ---
  const removeFavorite = (e, id) => {
    e.stopPropagation();
    const updated = allFavorites.filter(fav => fav.id !== id);
    setAllFavorites(updated);
    setDisplayedPalettes(prev => prev.filter(fav => fav.id !== id));
    localStorage.setItem('prevhues_favorites', JSON.stringify(updated));
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <header className="mb-12">
        <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">Saved Palettes</h1>
        <p className="text-gray-500 text-xl max-w-2xl">
          Your personal collection of inspirations, stored locally in your browser.
        </p>
      </header>

      {allFavorites.length === 0 ? (
        <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="flex justify-center mb-4 text-gray-300">
            <FolderHeart size={64} strokeWidth={1} />
          </div>
          <p className="text-gray-400 font-bold text-lg">You haven't saved any palettes yet.</p>
          <Link to="/palettes" className="mt-6 inline-block bg-black text-white px-8 py-3 rounded-2xl text-sm font-black hover:scale-95 transition-transform">
            Browse Library
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {displayedPalettes.map((item, index) => {
            const parsedData = typeof item.color_palette === 'string' 
              ? JSON.parse(item.color_palette) 
              : item.color_palette;
            
            const colors = parsedData.colors;

            return (
              <div 
                key={item.id}
                ref={index === displayedPalettes.length - 1 ? lastPaletteRef : null}
                className="group flex flex-col bg-white rounded-2xl transition-all duration-300"
              >
                {/* Proportional Display */}
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
                      onClick={(e) => removeFavorite(e, item.id)}
                      className="p-2.5 rounded-xl transition-all active:scale-90 text-red-500 bg-red-50 hover:bg-red-100"
                      title="Remove from Favorites"
                    >
                      <Heart size={20} fill="currentColor" strokeWidth={2.5} />
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
      )}

      {/* Loading batch indicator */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      )}

      {!hasMore && allFavorites.length > ITEMS_PER_PAGE && (
        <div className="py-20 text-center">
          <p className="text-gray-300 font-black uppercase text-[10px] tracking-[0.2em]">
            End of your collection
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;