import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Trash2, Edit, PlusCircle, Package, 
  ShoppingBag, CheckCircle, Clock, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- UTILITAIRE : Nettoyage d'URL Image ---
const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/150";
  let cleanPath = imagePath.replace(/\\/g, '/');
  const index = cleanPath.indexOf('uploads/');
  if (index !== -1) {
    cleanPath = cleanPath.substring(index);
  }
  return `http://localhost:5000/${cleanPath}`;
};

const Dashboard = () => {
  const { user } = useAuth();
  
  // États pour les données
  const [myServices, setMyServices] = useState([]); // Services que je vends
  const [myPurchases, setMyPurchases] = useState([]); // Services que j'ai achetés
  
  // États pour l'UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('seller'); // 'seller' (Freelance) ou 'buyer' (Client)

  // Charger toutes les données du dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        // On lance les deux requêtes en parallèle pour aller plus vite
        const [servicesRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/services/my-services', config),
          axios.get('http://localhost:5000/api/orders/my-orders', config)
        ]);

        setMyServices(servicesRes.data);
        setMyPurchases(ordersRes.data.purchases || []); // On récupère la liste des achats
      } catch (error) {
        console.error("Erreur Dashboard:", error);
        toast.error("Erreur lors de la récupération des données");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Supprimer un service (Vendeur)
  const handleDeleteService = async (id) => {
    if (!window.confirm("Supprimer définitivement ce service ?")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMyServices(myServices.filter(s => s._id !== id));
      toast.success("Service supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      
      {/* HEADER : Bienvenue & Switcher de rôle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 text-center md:text-left">Mon Tableau de Bord</h1>
          <p className="text-gray-500">Bienvenue, <span className="font-semibold text-blue-600">{user?.username}</span></p>
        </div>

        {/* Sélecteur d'onglets style Apple/SaaS */}
        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('seller')}
            className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'seller' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Mode Vendeur
          </button>
          <button 
            onClick={() => setActiveTab('buyer')}
            className={`flex-1 md:flex-none px-8 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'buyer' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Mode Acheteur
          </button>
        </div>
      </div>

      {/* --- SECTION 1 : VUE VENDEUR (Mes Services) --- */}
      {activeTab === 'seller' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="text-blue-500" /> Mes Services en Vente ({myServices.length})
            </h2>
            <Link to="/create-service" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
              <PlusCircle size={18} /> Nouveau
            </Link>
          </div>

          {myServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 mb-4">Vous n'avez pas encore publié de service.</p>
              <Link to="/create-service" className="text-blue-600 font-bold">Commencez maintenant →</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {myServices.map((service) => (
                <div key={service._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group">
                  <img src={getImageUrl(service.image)} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{service.title}</h3>
                    <p className="text-blue-600 font-bold">{service.price} DT</p>
                  </div>
                  <div className="flex gap-1">
                    <Link to={`/service/${service._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition"><ExternalLink size={20}/></Link>
                    <button onClick={() => handleDeleteService(service._id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- SECTION 2 : VUE ACHETEUR (Mes Commandes Passées) --- */}
      {activeTab === 'buyer' && (
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="text-green-500" /> Historique de mes achats ({myPurchases.length})
            </h2>
          </div>

          {myPurchases.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">Aucun achat effectué pour le moment.</p>
              <Link to="/" className="text-blue-600 font-bold">Explorer les services →</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {myPurchases.map((order) => (
                <div key={order._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                       <img src={getImageUrl(order.serviceId?.image)} className="w-16 h-16 rounded-xl object-cover" />
                       <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full"><CheckCircle size={12}/></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{order.serviceId?.title || "Service supprimé"}</h3>
                      <p className="text-sm text-gray-500">Vendeur : <span className="font-medium text-gray-700">{order.sellerId?.username}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                    <span className="text-lg font-black text-gray-900">{order.serviceId?.price} DT</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                       <Clock size={12}/> {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;