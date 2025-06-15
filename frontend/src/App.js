import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'animate.css'; 
const App = () => {
  const [formData, setFormData] = useState({
    eventType: '',
    guests: '',
    preferences: [],
    budget: '',
  });
  const [menu, setMenu] = useState(null);
  const [error, setError] = useState('');
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/generate-menu', formData);
      setMenu(response.data);
      setError('');
    } catch (err) {
      setError('Failed to generate menu');
    }
  };

  const handlePreferenceChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      preferences: e.target.checked
        ? [...formData.preferences, value]
        : formData.preferences.filter((p) => p !== value),
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full bg-dark-green text-cream shadow-md z-50 transition-transform duration-300 ease-in-out ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold font-playfair">
            Virtual Catering Now
          </h1>
          <nav className="space-x-6 font-roboto">
            <a href="#" className="text-cream hover:text-gold transition duration-200">
              Home
            </a>
            <a href="#" className="text-cream hover:text-gold transition duration-200">
              Services
            </a>
            <a href="#" className="text-cream hover:text-gold transition duration-200">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="flex-grow flex items-center justify-center bg-cream bg-opacity-90 py-16" 
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop')`,
          backgroundSize: 'auto cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(245, 245, 245, 0.7)',
        }}
      >
        <div className="max-w-lg w-full mx-4 p-8 bg-white rounded-xl shadow-2xl animate__animated animate__fadeIn mt-20">
          <h1 className="text-3xl font-bold text-center text-dark-green mb-6 font-playfair">
            Plan Your Event
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark-gray font-roboto">
                Event Type
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition duration-300 font-roboto"
              >
                <option value="">Select Event Type</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate</option>
                <option value="Birthday">Birthday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-gray font-roboto">
                Number of Guests
              </label>
              <input
                type="number"
                placeholder="e.g., 50"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition duration-300 font-roboto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-gray font-roboto">
                Dietary Preferences
              </label>
              <div className="space-y-3 mt-2">
                {['Vegetarian', 'Vegan', 'Gluten-Free'].map((pref) => (
                  <label key={pref} className="flex items-center font-roboto">
                    <input
                      type="checkbox"
                      value={pref}
                      onChange={handlePreferenceChange}
                      className="mr-2 h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded"
                    />
                    <span className="text-dark-gray">{pref}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-gray font-roboto">
                Budget ($)
              </label>
              <input
                type="number"
                placeholder="e.g., 1000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-gold transition duration-300 font-roboto"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-gold text-white rounded-lg hover:bg-dark-green transition duration-300 font-roboto font-medium "
            >
              Generate Menu
            </button>
          </form>
          {error && (
            <p className="mt-4 text-red-500 text-center font-roboto animate__animated animate__shakeX">
              {error}
            </p>
          )}
          {menu && (
            <div className="mt-6 p-6 bg-cream rounded-lg animate__animated animate__slideInUp">
              <h2 className="text-xl font-bold text-dark-green mb-4 font-playfair">
                Suggested Menu
              </h2>
              <p className="text-dark-gray font-roboto">
                <strong>Appetizer:</strong> {menu.appetizer}
              </p>
              <p className="text-dark-gray font-roboto">
                <strong>Main Course:</strong> {menu.main_course}
              </p>
              <p className="text-dark-gray font-roboto">
                <strong>Dessert:</strong> {menu.dessert}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark-green text-cream py-6 px-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-roboto">
            Contact Us: <a href="mailto:info@virtualcateringnow.com" className="hover:text-gold">info@virtualcateringnow.com</a> | +1-800-555-1234
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-cream hover:text-gold transition duration-200">
              Facebook
            </a>
            <a href="#" className="text-cream hover:text-gold transition duration-200">
              Instagram
            </a>
            <a href="#" className="text-cream hover:text-gold transition duration-200">
              Twitter
            </a>
          </div>
          <p className="mt-4 text-xs font-roboto">
            © 2025 Virtual Catering Now. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;