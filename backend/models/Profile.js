const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    // Référence inverse vers User (Optionnel mais recommandé)
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    bio: { type: String },
    skills: [{ type: String }], // Ex: ['React', 'Logo Design']
    avatar: { type: String },   // URL de l'image
    phone: { type: String }
});

module.exports = mongoose.model('Profile', profileSchema);