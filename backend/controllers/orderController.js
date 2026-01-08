const Order = require("../models/Order");
const Service = require("../models/Service");

const createOrder = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    // Identification de l'acheteur
    const buyerId = req.user ? req.user._id : req.userId;

    if (!buyerId) {
      return res.status(401).json({ message: "Vous devez être connecté pour commander." });
    }

    // Récupération du service pour obtenir le prix et le vendeur
    const serviceDetails = await Service.findById(serviceId);
    if (!serviceDetails) {
      return res.status(404).json({ message: "Service introuvable." });
    }

    // Vérification : un utilisateur ne peut pas acheter son propre service
    if (serviceDetails.seller.toString() === buyerId.toString()) {
      return res.status(400).json({ message: "Vous ne pouvez pas acheter votre propre service." });
    }

    
    const newOrder = new Order({
      buyer: buyerId,           
      service: serviceId,       
      totalPrice: serviceDetails.price, 
      status: 'completed'
    });

    await newOrder.save();

    res.status(201).json({ 
      success: true,
      message: "Commande validée avec succès !",
      order: newOrder 
    });

  } catch (error) {
    console.error("ERREUR CREATE ORDER :", error);
    res.status(500).json({ 
      message: "Erreur interne du serveur", 
      error: error.message 
    });
  }
};
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.userId;

    const purchases = await Order.find({ buyer: userId })
      .populate({
        path: 'service',
        // On descend dans le service pour récupérer les infos du vendeur (seller)
        populate: {
          path: 'seller',
          select: 'username email'
        }
      });

    const totalSpent = purchases.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

    res.status(200).json({ 
      purchases, 
      totalSpent 
    });
  } catch (error) {
    console.error("ERREUR FATALE GET_ORDERS :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
module.exports = { createOrder, getMyOrders };