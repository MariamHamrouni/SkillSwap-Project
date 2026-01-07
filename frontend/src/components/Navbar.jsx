import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, PlusCircle,User } from 'lucide-react';
// IMPORT DU HOOK
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // ON RECUPERE LE VRAI USER ET LA FONCTION LOGOUT
  const { user, logout } = useAuth(); 

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      {/* ... Le début du code (Logo) ne change pas ... */}
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                <span className="bg-blue-600 text-white p-1 rounded-lg">S</span>
                SkillSwap
            </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition">Explorer</Link>
            
            {user ? (
              <>
                <Link to="/create-service" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <PlusCircle size={20} /> Publier un service
                </Link>
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 ml-4">
                    <User size={20} /> Mon Profil
                </Link>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-sm font-semibold text-gray-700">Bonjour, {user.username}</span>
                  {/* BOUTON LOGOUT BRANCHE SUR LE CONTEXT */}
                  <button 
                    onClick={logout} 
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition"
                  >
                    <LogOut size={18} /> Déconnexion
                  </button>
                </div>
              </>
            ) : (
              // ... Partie Visiteur inchangée ...
             <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Se connecter
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/30">
                  Rejoindre
                </Link>
              </>
            )}
          </div>
          
          {/* ... Bouton Burger inchangé ... */}
           <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-blue-600 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
             <div className="px-4 pt-2 pb-4 space-y-2 flex flex-col">
            {/* ... Liens Mobile ... */}
             {user ? (
                 <>
                    {/* ... Lien Create Service ... */}
                    <button 
                        onClick={() => { logout(); toggleMenu(); }} 
                        className="w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-md"
                    >
                        Déconnexion
                    </button>
                 </>
             ) : (
                 // ... Liens Login/Register ...
                  <>
                    <Link to="/login" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                    Se connecter
                    </Link>
                    <Link to="/register" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700">
                    Rejoindre maintenant
                    </Link>
                </>
             )}
             </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;