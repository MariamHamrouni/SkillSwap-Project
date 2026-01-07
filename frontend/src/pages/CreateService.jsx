import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload, DollarSign, Type, Layers, Loader, Sparkles } from 'lucide-react'; 
import { useAuth } from '../context/AuthContext';

const CreateService = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Design');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false); // Loading spécifique à l'IA

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  // --- FONCTION IA (Appelle le nouveau Controller) ---
  const handleAIGenerate = async () => {
    if (!title) return toast.error("Entrez un titre d'abord !");
    
    setAiLoading(true);
    try {
      // Appel à la route définie dans aiRoutes.js
      const { data } = await axios.post('http://localhost:5000/api/ai/generate-description', {
        title,
        category
      });
      
      setDescription(data.description);
      toast.success("Description générée avec succès ! ✨");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la génération IA");
    } finally {
      setAiLoading(false);
    }
  };
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Une image est obligatoire !");
    if (!title || !description || !price) return toast.error("Remplissez tous les champs");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image', image);

    setLoading(true);

    try {
      const token = user.token;
      await axios.post('http://localhost:5000/api/services', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Service publié avec succès ! 🚀');
      navigate('/'); 
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de la création';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 mb-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="text-blue-600" /> Publier un nouveau service
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Titre */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">Titre du service</label>
          <div className="relative">
            <Type className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Je vais créer votre logo pro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Catégorie & Prix */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Catégorie</label>
            <div className="relative">
              <Layers className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Design">🎨 Design</option>
                <option value="Development">💻 Développement</option>
                <option value="Marketing">📈 Marketing</option>
                <option value="Writing">✍️ Rédaction</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Prix (DT)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="number"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Description + Bouton IA */}
        <div>
          <div className="flex justify-between items-center mb-1">
             <label className="block font-medium text-gray-700">Description détaillée</label>
             {/* BOUTON D'APPEL À L'IA */}
             <button 
                type="button" 
                onClick={handleAIGenerate}
                disabled={aiLoading || !title}
                className={`text-xs flex items-center gap-1 px-3 py-1 rounded-full border transition
                    ${aiLoading ? 'bg-gray-100 text-gray-400' : 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100'}
                `}
             >
                {aiLoading ? <Loader size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                Générer avec IA
             </button>
          </div>
          <textarea
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-48 transition-all"
            placeholder="Décrivez ce que vous offrez..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Upload Image */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition relative">
          <input
            type="file"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
          />
          {preview ? (
            <div className="relative inline-block">
                <img src={preview} alt="Prévisualisation" className="h-40 mx-auto object-cover rounded-md shadow-md" />
                <p className="text-xs text-green-600 mt-2 font-bold">Image chargée ✅</p>
            </div>
          ) : (
            <div className="text-gray-500">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p>Cliquez ou glissez une image ici</p>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5Mo)</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-3 rounded-lg transition shadow-lg flex justify-center items-center gap-2
            ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'}
          `}
        >
          {loading ? (
             <> <Loader className="animate-spin" size={20} /> Publication en cours... </>
          ) : (
             "Publier maintenant"
          )}
        </button>

      </form>
    </div>
  );
};

export default CreateService;