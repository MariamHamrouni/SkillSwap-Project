const Review = require("../models/Review");
const Service = require("../models/Service");
const Order = require("../models/Order");

exports.createReview = async (req, res) => {
  try {
    const { serviceId, star, comment } = req.body;
    const userId = req.userId; // Vient de votre middleware d'auth (JWT)
    const hasOrdered = await Order.findOne({ 
        serviceId, 
        buyerId: userId, 
        status: 'completed' 
    });

    if (!hasOrdered) {
        return res.status(403).json({ message: "Vous devez acheter ce service pour le noter." });
    }

  
    const alreadyReviewed = await Review.findOne({ serviceId, userId });
    if (alreadyReviewed) {
        return res.status(400).json({ message: "Vous avez déjà noté ce service." });
    }

  
    const newReview = new Review({
        serviceId,
        userId,
        star,
        comment
    });
    await newReview.save();

  
    const reviews = await Review.find({ serviceId });
    
   
    const avgRating = reviews.reduce((acc, item) => item.star + acc, 0) / reviews.length;

    await Service.findByIdAndUpdate(serviceId, {
        rating: avgRating,
        numReviews: reviews.length
    });

    res.status(201).json({ message: "Avis ajouté avec succès !" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};