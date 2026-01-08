import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Star, CheckCircle, User, ArrowLeft, Mail, Loader, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/400";
  let cleanPath = imagePath.replace(/\\/g, '/');
  const index = cleanPath.indexOf('uploads/');
  if (index !== -1) cleanPath = cleanPath.substring(index);
  return `http://localhost:5000/${cleanPath}`;
};

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Récupération de l'utilisateur connecté via le context
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  
  // États pour les avis
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchService = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/services/${id}`);
      setService(data);
      setLoading(false);
    } catch  {
      toast.error("Impossible de charger le service");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      toast.error("Connectez-vous pour commander !");
      return navigate("/login");
    }

    if (!window.confirm(`Confirmer l'achat pour ${service.price} DT ?`)) return;

    try {
      setOrdering(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/orders/${service._id}`, {}, config);
      toast.success("Commande réussie !");
      setOrdering(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la commande");
      setOrdering(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("Connectez-vous pour laisser un avis");
    
    try {
      setSubmittingReview(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/reviews/${id}`, { rating, comment }, config);
      
      toast.success("Avis publié !");
      setComment("");
      fetchService(); // Rafraîchir pour voir la nouvelle note et l'avis
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setSubmittingReview(false);
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
      <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft size={20} className="mr-2" /> Retour aux services
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <img src={getImageUrl(service.image)} alt={service.title} className="w-full h-96 object-cover rounded-xl shadow-lg bg-gray-100" />
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{service.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                 <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase">{service.category}</span>
                 <span className="text-sm text-gray-500">Vendu par {service.seller?.username}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200">
                <Star size={20} className="text-yellow-500 fill-current" />
                <span className="font-bold text-yellow-700 text-lg">{service.rating?.toFixed(1) || "0.0"}</span>
                <span className="text-xs text-yellow-600">({service.numReviews || 0} avis)</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-4">À propos de ce service</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{service.description}</p>
          </div>

          {/* --- SECTION DES AVIS (REVIEW SECTION) --- */}
          <div className="mt-12 space-y-8">
            <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
              <MessageSquare className="text-blue-600" /> Avis des clients
            </h3>

            {/* Formulaire d'avis */}
            {user && (
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h4 className="font-bold mb-4">Laisser une évaluation</h4>
                <div className="flex gap-4 mb-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button 
                      key={num} type="button" 
                      onClick={() => setRating(num)}
                      className={`transition ${rating >= num ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      <Star size={28} fill={rating >= num ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea 
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none mb-4"
                  placeholder="Partagez votre expérience avec ce freelance..."
                  rows="3"
                />
                <button 
                  disabled={submittingReview}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50"
                >
                  {submittingReview ? "Envoi..." : "Publier l'avis"}
                </button>
              </form>
            )}

            <div className="space-y-4">
  {service.reviews && service.reviews.length > 0 ? (
    service.reviews.map((rev) => (
      <div key={rev._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
              {rev.user?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="font-bold text-gray-800">{rev.user?.username}</span>
          </div>
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-sm">{rev.comment}</p>
        <span className="text-[10px] text-gray-400">
          Publié le {new Date(rev.createdAt).toLocaleDateString()}
        </span>
      </div>
    ))
  ) : (
    <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed">
      <p className="text-gray-500">Aucun avis pour le moment. Soyez le premier !</p>
    </div>
  )}
</div>
          </div>
        </div>

        {/* COLONNE DROITE : Achat */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-24">
            <div className="flex justify-between items-end mb-6">
               <span className="text-gray-500 font-medium">Prix total</span>
               <span className="text-3xl font-bold text-gray-900">{service.price} DT</span>
            </div>

            <button 
              onClick={handleOrder}
              disabled={ordering}
              className={`w-full py-4 rounded-xl font-bold text-white transition mb-4 shadow-lg 
                ${ordering ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'}`}
            >
              {ordering ? <Loader className="animate-spin mx-auto" /> : "Commander maintenant"}
            </button>
            
            <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {service.seller?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900">{service.seller?.username}</p>
                        <p className="text-xs text-green-600 flex items-center gap-1"><CheckCircle size={12}/> Vendeur vérifié</p>
                    </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
                   <Mail size={16} /> Contacter le vendeur
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;