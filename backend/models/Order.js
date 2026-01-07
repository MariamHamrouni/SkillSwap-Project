const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    buyer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    service: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        required: true 
    },
    
    status: { 
        type: String, 
        enum: ['pending', 'in_progress', 'completed', 'cancelled'], 
        default: 'pending' 
    },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);