import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    try {
      // 1. Envoi de la requête au Backend
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      login(data);

      // 2. Si succès : Sauvegarde dans le navigateur
      localStorage.setItem('userInfo', JSON.stringify(data));

      // 3. Notification et Redirection
      toast.success('Connexion réussie !');
      navigate('/');
      
      // Petite astuce temporaire pour mettre à jour la Navbar (on fera mieux avec le Context après)
      window.location.reload(); 

    } catch (error) {
      // Gestion des erreurs (ex: mot de passe faux)
      const message = error.response?.data?.message || 'Erreur de connexion';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Bon retour ! 👋</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Mot de passe</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Se connecter
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;