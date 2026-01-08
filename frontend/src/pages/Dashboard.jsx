import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Trash2, PlusCircle, Package, 
  ShoppingBag, CheckCircle, Clock, ExternalLink,
  Wallet, TrendingUp
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
  const [myServices, setMyServices] = useState([]); 
  const [myPurchases, setMyPurchases] = useState([]); 
  const [totalSpent, setTotalSpent] = useState(0);
  
  // États pour l'UI
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('seller'); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.token) return;
      
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      try {
        // Chargement parallèle des services et des commandes
        const [servicesRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/services/my-services', config),
          axios.get('http://localhost:5000/api/orders/my-orders', config)
        ]);

        setMyServices(servicesRes.data || []);
        setMyPurchases(ordersRes.data.purchases || []);
        setTotalSpent(ordersRes.data.totalSpent || 0);

      } catch (error) {
        console.error("Erreur Dashboard:", error);
        toast.error("Impossible de charger toutes les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
      
      {/* HEADER : Sélecteur de rôle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-500">Compte de <span className="font-semibold text-blue-600">{user?.username}</span></p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200 w-full md:w-auto shadow-inner">
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

      {/* --- STATS GÉNÉRALES --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><Package size={24}/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium italic">En vente</p>
            <h4 className="text-2xl font-bold">{myServices.length} Services</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-600"><Wallet size={24}/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium italic">Dépenses totales</p>
            <h4 className="text-2xl font-bold text-green-600">{totalSpent} DT</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600"><TrendingUp size={24}/></div>
          <div>
            <p className="text-sm text-gray-500 font-medium italic">Commandes passées</p>
            <h4 className="text-2xl font-bold">{myPurchases.length} Achats</h4>
          </div>
        </div>
      </div>

      {/* --- SECTION 1 : VUE VENDEUR --- */}
      {activeTab === 'seller' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="text-blue-500" /> Mes Services Publiés
            </h2>
            <Link to="/create-service" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-md">
              <PlusCircle size={18} /> Ajouter
            </Link>
          </div>

          {myServices.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed">
              <p className="text-gray-500 mb-2">Vous ne vendez aucun service pour le moment.</p>
              <Link to="/create-service" className="text-blue-600 font-bold">Créer mon premier service →</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {myServices.map((service) => (
                <div key={service._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <img src={getImageUrl(service.image)} className="w-16 h-16 rounded-xl object-cover bg-gray-100" />
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

      {/* --- SECTION 2 : VUE ACHETEUR --- */}
      {activeTab === 'buyer' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="text-green-500" /> Mes Achats
            </h2>
          </div>

          {myPurchases.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed">
              <p className="text-gray-500 mb-2">Vous n'avez pas encore acheté de service.</p>
              <Link to="/" className="text-blue-600 font-bold">Explorer les offres →</Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {myPurchases.map((order) => (
                <div key={order._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                       <img src={getImageUrl(order.service?.image)} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                       <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full ring-2 ring-white shadow-sm"><CheckCircle size={10}/></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{order.service?.title || "Service indisponible"}</h3>
                      {/* --- CORRECTION ICI : Accès au vendeur via le service --- */}
                      <p className="text-sm text-gray-500">
                        Vendeur : <span className="font-semibold text-gray-700">
                          {order.service?.seller?.username || 'Anonyme'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                    <span className="text-xl font-black text-gray-900">{order.totalPrice} DT</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                       <Clock size={12}/> {new Date(order.createdAt).toLocaleDateString('fr-FR')}
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