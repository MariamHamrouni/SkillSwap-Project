import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { User, MapPin, Phone, Briefcase, Save, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [profile, setProfile] = useState({
        bio: '',
        location: '',
        phoneNumber: '',
        skills: ''
    });

    // Charger le profil depuis le backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/profiles/me', config);
                setProfile({
                    bio: data.bio || '',
                    location: data.location || '',
                    phoneNumber: data.phoneNumber || '',
                    skills: data.skills ? data.skills.join(', ') : ''
                });
                setLoading(false);
            } catch {
                toast.error("Erreur lors du chargement du profil");
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user.token]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // On transforme la chaîne de caractères des skills en tableau
            const updatedData = { 
                ...profile, 
                skills: profile.skills.split(',').map(s => s.trim()) 
            };
            await axios.put('http://localhost:5000/api/profiles/me', updatedData, config);
            toast.success("Profil mis à jour !");
        } catch  {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="flex justify-center mt-20"><Loader className="animate-spin text-blue-600" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header Profil */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30">
                            <User size={48} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user.username}</h1>
                            <p className="opacity-80">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleUpdate} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Ma Biographie</label>
                        <textarea 
                            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="4"
                            value={profile.bio}
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                            placeholder="Parlez-nous de vous..."
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                            <MapPin size={16}/> Localisation
                        </label>
                        <input 
                            type="text"
                            className="w-full p-3 rounded-xl border border-gray-200"
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                            <Phone size={16}/> Téléphone
                        </label>
                        <input 
                            type="text"
                            className="w-full p-3 rounded-xl border border-gray-200"
                            value={profile.phoneNumber}
                            onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                            <Briefcase size={16}/> Compétences (séparées par des virgules)
                        </label>
                        <input 
                            type="text"
                            className="w-full p-3 rounded-xl border border-gray-200"
                            placeholder="React, Node.js, Design UI..."
                            value={profile.skills}
                            onChange={(e) => setProfile({...profile, skills: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={updating}
                        className="md:col-span-2 bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg"
                    >
                        {updating ? <Loader className="animate-spin" /> : <Save size={20} />}
                        Enregistrer les modifications
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;