import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter } from 'lucide-react'; // Ajout de l'icône Filter
import ServiceCard from '../components/ServiceCard';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Nouveaux States pour la recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tout");

  const categories = ["Tout", "Design", "Development", "Marketing", "Writing"];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/services');
        setServices(data);
        setLoading(false);
      } catch  {
        setError("Impossible de charger les services.");
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // 2. La Logique de Filtrage (Le Cerveau 🧠)
 const filteredServices = services.filter((service) => {
  // A. Recherche Texte (Sécurisée : on vérifie que les champs existent)
  const title = service.title ? service.title.toLowerCase() : "";
  const desc = service.description ? service.description.toLowerCase() : "";
  const search = searchTerm.toLowerCase();
  
  const matchesSearch = title.includes(search) || desc.includes(search);
  
  // B. Filtre Catégorie (Insensible à la casse)
  const matchesCategory = 
    selectedCategory === "Tout" || 
    (service.category && service.category.toLowerCase() === selectedCategory.toLowerCase());

  return matchesSearch && matchesCategory;
});

  return (
    <div className="space-y-8">
      
      {/* --- HERO SECTION & RECHERCHE --- */}
      <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white text-center shadow-lg shadow-blue-600/20 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Trouvez le freelance <span className="text-yellow-300">idéal</span>
        </h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
          Transformez vos idées en réalité grâce à des talents vérifiés.
        </p>
        
        {/* Barre de Recherche Connectée */}
        <div className="max-w-xl mx-auto relative text-gray-800">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Ex: Logo, Site Web, Article SEO..." 
                className="w-full py-3 pl-12 pr-4 rounded-full shadow-lg outline-none focus:ring-4 focus:ring-blue-400 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // <--- Mise à jour en temps réel
            />
        </div>
      </div>

      {/* --- FILTRES PAR CATEGORIE --- */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium transition duration-200 border ${
              selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- LISTE DES RESULTATS --- */}
      <div>
        <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Résultats</h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-sm font-semibold">
                {filteredServices.length}
            </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded text-center">{error}</div>
        ) : filteredServices.length === 0 ? (
           // État vide (si la recherche ne donne rien)
           <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
             <Filter className="mx-auto h-12 w-12 text-gray-300 mb-3" />
             <p className="text-xl text-gray-500 font-medium">Aucun service trouvé.</p>
             <p className="text-gray-400">Essayez de modifier votre recherche ou la catégorie.</p>
             <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('Tout')}}
                className="mt-4 text-blue-600 font-bold hover:underline"
             >
                Réinitialiser les filtres
             </button>
           </div>
        ) : (
          // Affichage de la grille FILTRÉE
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;