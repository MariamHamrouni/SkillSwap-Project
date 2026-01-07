const Order = require("../models/Order");
const Service = require("../models/Service");

const createOrder = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // 1. Récupération sécurisée de l'ID de l'acheteur
    // On gère les différents cas (req.user ou req.userId)
    const buyerId = req.user ? req.user._id : req.userId;

    if (!buyerId) {
        return res.status(401).json({ message: "Vous devez être connecté pour commander." });
    }

    // 2. Récupération du service
    const service = await Service.findById(serviceId);
    if (!service) {
        return res.status(404).json({ message: "Service introuvable" });
    }

    // 🚨 3. CORRECTION DU CRASH (Protection contre les services sans vendeur)
    // Si le service n'a pas de champ userId, on arrête tout proprement au lieu de planter.
    if (!service.userId) {
        return res.status(400).json({ 
            message: "Impossible de commander : Ce service n'est rattaché à aucun vendeur valide." 
        });
    }

    // 4. Vérification : On ne peut pas s'acheter soi-même
    // Maintenant que l'on sait que les deux IDs existent, on peut faire toString()
    if (service.userId.toString() === buyerId.toString()) {
        return res.status(400).json({ message: "Vous ne pouvez pas acheter votre propre service." });
    }

    // 5. Création de la commande
    const newOrder = new Order({
        serviceId: serviceId,
        buyerId: buyerId,
        sellerId: service.userId, 
        status: 'completed',
        isPaid: true
    });

    await newOrder.save();

    res.status(201).json({ message: "Commande validée ! Vous pouvez maintenant noter ce service." });

  } catch (error) {
    console.error("ERREUR CREATE ORDER :", error);
    res.status(500).json({ message: "Erreur serveur lors de la commande." });
  }
};
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.userId;

    // 1. Ce que j'ai acheté (Je suis le buyerId)
    const purchases = await Order.find({ buyerId: userId })
      .populate('serviceId', 'title price image') // On récupère les infos du service
      .populate('sellerId', 'username email');   // On récupère les infos du vendeur

    // 2. Ce que j'ai vendu (Je suis le sellerId)
    const sales = await Order.find({ sellerId: userId })
      .populate('serviceId', 'title price')
      .populate('buyerId', 'username email');

    // On renvoie les deux listes
    res.status(200).json({ 
        purchases, // Mes achats
        sales      // Mes ventes
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur récupération commandes" });
  }
};

module.exports = { createOrder, getMyOrders };