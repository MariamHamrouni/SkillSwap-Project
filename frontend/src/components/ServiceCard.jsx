import { Star, User, Image as ImageIcon } from 'lucide-react';
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  // Gestion sécurisée de l'URL de l'image
  const getImageUrl = () => {
    if (!service?.image) return null;
    
  
    let cleanPath = service.image.replace(/\\/g, '/');
    
   
    if (cleanPath.startsWith('http')) return cleanPath;
    
    
    if (!cleanPath.startsWith('uploads/')) {
        cleanPath = `uploads/${cleanPath}`;
    }
    
    // 4. On retourne l'URL complète vers le backend
    return `http://localhost:5000/${cleanPath}`;
  };

  const imageUrl = getImageUrl();
  
  // Gestion sécurisée du nom du vendeur
  const sellerName = service?.seller?.username || "Utilisateur Inconnu";
  
  // Gestion sécurisée des notes
  const rating = service?.rating || 0;
  const numReviews = service?.numReviews || 0;
  
  // Gestion sécurisée des autres champs
  const title = service?.title || "Titre non disponible";
  const category = service?.category || "Non catégorisé";
  const price = service?.price || "0";

  return (
    <Link to={`/service/${service?._id}`} className="block h-full">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 group cursor-pointer border border-gray-100 h-full">
        
        {/* 1. L'Image du Service */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {imageUrl ? (
           <img 
  src={imageUrl} 
  alt={title} 
  className="w-full h-full object-cover..."
  // 👇 Ajout magique : Si l'image plante, on la cache pour afficher l'icône par défaut
  onError={(e) => {
    e.target.style.display = 'none'; 
  }}
/>
          ) : null}
          
          {/* Fallback si l'image ne se charge pas ou n'existe pas */}
          <div 
            className={`absolute inset-0 flex items-center justify-center ${imageUrl ? 'hidden' : 'flex'}`}
          >
            <div className="text-center p-4">
              <ImageIcon size={48} className="text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Image non disponible</p>
            </div>
          </div>
          
          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-gray-700">
            {category}
          </span>
        </div>

        {/* 2. Le Contenu */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Info Vendeur */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              <User size={16} className="text-gray-500" />
            </div>
            <span className="text-sm font-medium text-gray-900 truncate">
              {sellerName}
            </span>
          </div>

          {/* Titre */}
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition flex-grow">
            {title}
          </h3>

          {/* Note (Rating) */}
          <div className="flex items-center gap-1 text-yellow-400 mb-4">
            <Star size={16} fill="currentColor" />
            <span className="text-sm font-bold text-gray-700">
              {rating > 0 ? rating.toFixed(1) : "Nouveau"}
            </span>
            <span className="text-xs text-gray-400">
              ({numReviews} avis{numReviews !== 1 ? 's' : ''})
            </span>
          </div>

          {/* Footer de la carte (Prix) */}
          <div className="flex items-center justify-between border-t pt-3 mt-auto">
            <span className="text-xs text-gray-400 font-medium">À PARTIR DE</span>
            <span className="text-xl font-extrabold text-gray-900">
              {price} <span className="text-sm font-normal">DT</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;