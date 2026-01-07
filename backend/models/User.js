const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    // Relation 1-to-1 : Lien vers le Profil
    profile: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Profile' 
    },
    // Relation Many-to-Many : Liste des services favoris
    favorites: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service' 
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);