import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/home", icon: "🏠" },
    { name: "My Profile", path: "/profile", icon: "👤" },
    { name: "Organize a Hackathon", path: "/organize", icon: "🚀" },
  ];

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:4000/api/v1/logout", {}, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">
            <Link to="/home" className="flex items-center">
              <span className="text-3xl mr-2">⚡</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">HackMate</span>
            </Link>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center hover:text-blue-200 transition-all ${
                location.pathname === link.path 
                  ? "font-semibold text-white border-b-2 border-white pb-1" 
                  : "text-blue-100"
              }`}
            >
              <span className="mr-1">{link.icon}</span>
              {link.name}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition-all flex items-center"
          >
            <span className="mr-1">🚪</span>
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 focus:outline-none"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 bg-blue-700 rounded-lg p-4 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`block py-3 px-4 ${
                location.pathname === link.path 
                  ? "font-semibold bg-blue-800 rounded-md" 
                  : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="mr-2">{link.icon}</span>
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="w-full text-center mt-4 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md font-medium"
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}