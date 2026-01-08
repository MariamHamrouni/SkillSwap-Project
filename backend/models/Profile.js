const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    // Lien direct avec l'utilisateur (Relation 1-to-1)
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        unique: true // Un seul profil par utilisateur
    },
    bio: { type: String, default: "Passionné par mon domaine..." },
    skills: { type: [String], default: [] }, // Exemple: ["React", "Logo Design"]
    phoneNumber: { type: String },
    avatar: { type: String, default: "" }, // Photo de profil
    location: { type: String, default: "Tunis, Tunisie" },
    languages: { type: [String], default: ["Français"] }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);