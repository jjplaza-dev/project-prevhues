import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';
import PaletteMaker from '../components/PaletteMaker';
import { useColorPalette } from '../utils/useColorPalette';

const hexToRgb = (hex) => {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c + c).join('');
  const int = parseInt(cleanHex, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

const hexToHsl = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(v => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h /= 6;
  }
  return [Math.round(h * 360).toString(), Math.round(s * 100) + '%', Math.round(l * 100) + '%'];
};

const PaletteManager = () => {
  const [palettes, setPalettes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  
  const navigate = useNavigate();
  const setPalette = useColorPalette((state) => state.setPalette);

  useEffect(() => {
    fetchPalettes();
  }, []);

  const fetchPalettes = async () => {
    const { data, error } = await supabase
      .from('color_palettes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching:', error);
      return;
    }
    if (data) setPalettes(data);
  };

  const startEditing = (item, colors) => {
    setEditingId(item.id);
    setEditForm({
      name: item.palette_name || '',
      categories: item.palette_category ? item.palette_category.join(', ') : '',
      dominant: colors[0].hex,
      secondary: colors[1].hex,
      accent: colors[2].hex
    });
  };

  const handleUpdate = async (id) => {
    const categoryArray = editForm.categories
      .toString()
      .split(',')
      .map(c => c.trim())
      .filter(c => c !== ''); // Remove empty categories

    const payload = {
      palette_name: editForm.name,
      palette_category: categoryArray,
      color_palette: {
        colors: [
          { hex: editForm.dominant, rgb: hexToRgb(editForm.dominant), hsl: hexToHsl(editForm.dominant) },
          { hex: editForm.secondary, rgb: hexToRgb(editForm.secondary), hsl: hexToHsl(editForm.secondary) },
          { hex: editForm.accent, rgb: hexToRgb(editForm.accent), hsl: hexToHsl(editForm.accent) }
        ]
      }
    };
    
    const { error } = await supabase
      .from('color_palettes')
      .update(payload)
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      fetchPalettes();
    } else {
      console.error("Failed to update:", error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this palette?")) return;
    const { error } = await supabase.from('color_palettes').delete().eq('id', id);
    if (!error) fetchPalettes();
  };

  const applyPaletteAndRedirect = (colors) => {
    setPalette({
      dominant: colors[0].hex,
      secondary: colors[1].hex,
      accent: colors[2].hex
    });
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tight">Design System</h1>
      </header>

      {/* CREATE SECTION */}
      <PaletteMaker onPaletteCreated={fetchPalettes} />

      {/* MANAGE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {palettes.map((item) => {
          // Parse Supabase JSON securely
          const parsedData = typeof item.color_palette === 'string' 
            ? JSON.parse(item.color_palette) 
            : item.color_palette;
          const colors = parsedData?.colors || [ {hex:'#000'}, {hex:'#000'}, {hex:'#000'} ];

          // --- EDIT MODE ---
          if (editingId === item.id) {
            return (
              <div key={item.id} className="bg-white rounded-lg flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-black text-gray-800">Editing Palette</h3>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-800 font-bold">✕</button>
                </div>
                
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border rounded-lg p-2 w-full text-sm font-bold bg-gray-50 outline-none focus:border-blue-500" placeholder="Palette Name" />
                <input type="text" value={editForm.categories} onChange={e => setEditForm({...editForm, categories: e.target.value})} className="border rounded-lg p-2 w-full text-xs bg-gray-50 outline-none focus:border-blue-500" placeholder="Categories (comma separated)" />
                
                {['dominant', 'secondary', 'accent'].map((role) => (
                  <div key={role} className="flex items-center gap-3">
                    <input type="color" value={editForm[role]} onChange={e => setEditForm({...editForm, [role]: e.target.value})} className="w-8 h-8 cursor-pointer flex-shrink-0" />
                    <input type="text" value={editForm[role]} onChange={e => setEditForm({...editForm, [role]: e.target.value})} className="border rounded-lg p-2 w-full text-sm uppercase bg-gray-50 outline-none focus:border-blue-500" />
                  </div>
                ))}
                
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleUpdate(item.id)} className="bg-blue-600 text-white flex-1 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all">Save</button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-100 active:scale-95 transition-all">Delete</button>
                </div>
              </div>
            );
          }

          // --- STANDARD VIEW ---
          return (
            <div key={item.id} className="group flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              
              {/* Vertical 60-30-10 Layout */}
              <div className="h-64 w-full flex flex-col rounded-t-3xl overflow-hidden relative">
                {/* Edit Pencil Icon (Shows on Hover over colors) */}
                <button 
                  onClick={() => startEditing(item, colors)}
                  className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-sm hover:scale-110 active:scale-95 transition-all"
                  title="Edit Palette"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-gray-800">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                  </svg>
                </button>

                <div style={{ height: '60%', backgroundColor: colors[0].hex }} />
                <div style={{ height: '30%', backgroundColor: colors[1].hex }} />
                <div style={{ height: '10%', backgroundColor: colors[2].hex }} />
              </div>

              {/* Info & Actions */}
              <div className="p-5 flex flex-col flex-1 bg-white">
                <h3 className="font-bold text-gray-900 text-lg capitalize truncate mb-2">
                  {item.palette_name || 'Untitled Palette'}
                </h3>
                
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.palette_category && item.palette_category.length > 0 ? (
                    item.palette_category.map((cat, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-100 text-[10px] font-bold uppercase rounded-md text-gray-500 tracking-wider">
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] font-medium italic text-gray-400">No categories</span>
                  )}
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => applyPaletteAndRedirect(colors)}
                  className="mt-auto w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95"
                  style={{ 
                    backgroundColor: `${colors[0].hex}15`, // 15% opacity of dominant
                    color: colors[1].hex // secondary color for text
                  }}
                >
                  Set as Active
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaletteManager;