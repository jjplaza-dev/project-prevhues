import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './assets/components/Navbar';
import Home from './assets/pages/Home';
import PalettePage from './assets/pages/PalettePage';
import { useColorPalette } from './assets/utils/useColorPalette';
import Footer from './assets/components/Footer';

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
            <Route path="/palette" element={<PalettePage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
    </div>
  );
}

export default App;