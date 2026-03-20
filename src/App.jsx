import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './assets/components/Navbar';
import Home from './assets/pages/Home';
import { useColorPalette } from './assets/utils/useColorPalette';
import Footer from './assets/components/Footer';
import ColorPalettes from './assets/pages/ColorPalettes';
import PaletteManager from './assets/pages/PaletteManager';
import PaletteCategoryPage from './assets/pages/PaletteCategoryPage';
import Favorites from './assets/pages/Favorites';

function App() {
  const { dominant, secondary, accent } = useColorPalette();

  return (
    <div 
      style={{
        '--dominant': dominant,
        '--secondary': secondary,
        '--accent': accent,
      }}
      className="min-h-screen transition-colors duration-500"
    >
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/palettes" element={<ColorPalettes />} />
            <Route path="/palettes/:category" element={<PaletteCategoryPage />} />
            <Route path="/manager" element={<PaletteManager />} />
            <Route path="/favorites" element={<Favorites />} />
        </Routes>
        </main>

        <Footer />
      </div>
    </Router>
    </div>
  );
}

export default App;