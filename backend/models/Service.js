const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
    // Le Vendeur (Relation 1-to-Many : Un User a plusieurs Services)
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
        type: String, 
        enum: ['Design', 'Development', 'Marketing', 'Writing'], // Catégories fixes
        required: true 
    },
    image: { type: String, required: true }, // Image de couverture du service
    rating: { type: Number, default: 0 },    // Moyenne des notes
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);