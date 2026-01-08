const Review = require('../models/Review');
const Service = require('../models/Service');

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const serviceId = req.params.serviceId;

        // Vérification si l'avis existe déjà pour cet utilisateur sur ce service
        const alreadyReviewed = await Review.findOne({ 
            user: req.user._id, 
            service: serviceId 
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: "Vous avez déjà noté ce service" });
        }

        const review = new Review({
            user: req.user._id,
            service: serviceId,
            rating: Number(rating),
            comment
        });

        await review.save();

        // Recalculer la moyenne du service
        const reviews = await Review.find({ service: serviceId });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        await Service.findByIdAndUpdate(serviceId, {
            rating: avgRating,
            numReviews: reviews.length
        });

        res.status(201).json({ message: "Avis ajouté !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur lors de l'avis" });
    }
};
module.exports = { addReview };