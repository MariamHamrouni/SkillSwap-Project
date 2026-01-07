import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Ajout de useNavigate
import axios from 'axios';
import toast from 'react-hot-toast'; // Ajout des notifications
import { Star, CheckCircle, User, ArrowLeft, Mail, Loader } from 'lucide-react';

// --- FONCTION DE NETTOYAGE D'IMAGE ---
const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/400";
  let cleanPath = imagePath.replace(/\\/g, '/');
  const index = cleanPath.indexOf('uploads/');
  if (index !== -1) {
    cleanPath = cleanPath.substring(index);
  }
  return `http://localhost:5000/${cleanPath}`;
};

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Pour rediriger si besoin
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false); // État pour le bouton commander

  // Récupérer les détails du service
  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        toast.error("Impossible de charger le service");
      }
    };
    fetchService();
  }, [id]);

  // 👇 FONCTION POUR COMMANDER LE SERVICE
  const handleOrder = async () => {
    // 1. Vérifier si l'utilisateur est connecté
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      toast.error("Connectez-vous pour commander !");
      return navigate("/login");
    }

    // 2. Confirmation (Simulation)
    if (!window.confirm(`Confirmer l'achat pour ${service.price} DT ?`)) return;

    try {
      setOrdering(true); // Active le chargement du bouton

      // 3. Appel à l'API Backend
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      
      // On envoie la requête POST vers la route que nous avons créée
      await axios.post(`http://localhost:5000/api/orders/${service._id}`, {}, config);

      toast.success("Commande réussie ! Vous pouvez maintenant noter ce service.");
      setOrdering(false);
      
      // Optionnel : Rediriger vers une page "Mes Commandes"
      // navigate('/my-orders');

    } catch (error) {
      const message = error.response?.data?.message || "Erreur lors de la commande";
      toast.error(message);
      setOrdering(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!service) return <div className="text-center mt-20 text-xl">Service introuvable 😢</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Bouton Retour */}
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft size={20} className="mr-2" /> Retour aux services
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : Image et Description */}
        <div className="md:col-span-2 space-y-6">
          
          <img 
            src={getImageUrl(service.image)} 
            alt={service.title} 
            className="w-full h-96 object-cover rounded-xl shadow-lg bg-gray-100"
            onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=Erreur+Image"; }}
          />
          
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
            {/* Affichage de la note moyenne */}
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                <Star size={18} className="text-yellow-500 fill-current" />
                <span className="font-bold text-yellow-700">{service.rating?.toFixed(1) || "New"}</span>
                <span className="text-xs text-yellow-600">({service.numReviews || 0} avis)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
             <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {service.category}
             </span>
             <span>• Publié par {service.seller?.username}</span>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-4">À propos de ce service</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {service.description}
            </p>
          </div>

          {/* 👇 C'EST ICI QU'ON POURRA AJOUTER LA SECTION "AVIS CLIENTS" PLUS TARD */}
          {/* <ReviewsList serviceId={service._id} /> */}

        </div>

        {/* COLONNE DROITE : Carte d'achat sticky */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
            
            <div className="flex justify-between items-end mb-6">
               <span className="text-gray-500 font-medium">Prix total</span>
               <span className="text-3xl font-bold text-gray-900">{service.price} DT</span>
            </div>

            {/* 👇 BOUTON COMMANDER ACTIF */}
            <button 
              onClick={handleOrder}
              disabled={ordering} // Désactive le bouton pendant le chargement
              className={`w-full py-3 rounded-lg font-bold text-white transition mb-4 shadow-lg 
                ${ordering ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'}`}
            >
              {ordering ? (
                <span className="flex items-center justify-center gap-2">
                   <Loader className="animate-spin" size={20} /> Traitement...
                </span>
              ) : (
                "Commander maintenant"
              )}
            </button>
            
            <button className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:border-gray-400 transition mb-6">
              Contacter le vendeur
            </button>

            {/* Infos Vendeur */}
            <div className="border-t pt-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        <User size={24} className="text-gray-500"/>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{service.seller?.username || "Vendeur"}</p>
                        <p className="text-sm text-gray-500">Membre certifié</p>
                    </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500"/>
                        <span>Identité vérifiée</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail size={16} className="text-blue-500"/>
                        <span>Email confirmé</span>
                    </div>
                </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetails;