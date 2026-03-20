import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';

// --- COLOR CONVERSION UTILS ---
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

const PaletteMaker = ({ onPaletteCreated }) => {
  const [isOpen, setIsOpen] = useState(false); // Controls form visibility
  const [formData, setFormData] = useState({
    name: '',
    dominant: '#ffffff',
    secondary: '#000000',
    accent: '#3b82f6',
    categories: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const categoryArray = formData.categories
      .split(',')
      .map(cat => cat.trim().toLowerCase())
      .filter(cat => cat !== '');

    const payload = {
      palette_name: formData.name,
      palette_category: categoryArray,
      color_palette: {
        colors: [
          { hex: formData.dominant, rgb: hexToRgb(formData.dominant), hsl: hexToHsl(formData.dominant) },
          { hex: formData.secondary, rgb: hexToRgb(formData.secondary), hsl: hexToHsl(formData.secondary) },
          { hex: formData.accent, rgb: hexToRgb(formData.accent), hsl: hexToHsl(formData.accent) }
        ]
      }
    };

    const { error } = await supabase.from('color_palettes').insert([payload]);

    if (!error) {
      setFormData({ name: '', dominant: '#ffffff', secondary: '#000000', accent: '#3b82f6', categories: '' });
      setIsOpen(false); // Close form after successful creation
      if (onPaletteCreated) onPaletteCreated(); 
    } else {
      console.error("Error saving palette:", error.message);
    }
    setIsSubmitting(false);
  };

  // If not open, show the "Add New" button
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="mb-12 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-md"
      >
        + Create New Palette
      </button>
    );
  }

  return (
    <div className="relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Close Button */}
      <button 
        onClick={() => setIsOpen(false)}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
        title="Close form"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h2 className="text-2xl font-black mb-6 tracking-tight text-gray-900">Create New Palette</h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase text-gray-400">Palette Name</label>
          <input 
            required 
            className="p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-black transition-all"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Midnight Cyber"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase text-gray-400">Categories (comma separated)</label>
          <input 
            className="p-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-black transition-all"
            value={formData.categories}
            onChange={e => setFormData({...formData, categories: e.target.value})}
            placeholder="dark, tech, neon"
          />
        </div>

        {['dominant', 'secondary', 'accent'].map((role) => (
          <div key={role} className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase text-gray-400">{role}</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={formData[role]} 
                onChange={e => setFormData({...formData, [role]: e.target.value})}
                className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 overflow-hidden"
              />
              <input 
                type="text" 
                value={formData[role]} 
                onChange={e => setFormData({...formData, [role]: e.target.value})}
                className="flex-1 p-3 bg-gray-50 rounded-xl border-none outline-none uppercase font-mono text-sm"
              />
            </div>
          </div>
        ))}

        <div className="lg:col-span-3 flex justify-end gap-3 mt-4">
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button 
            disabled={isSubmitting}
            className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Palette'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaletteMaker;