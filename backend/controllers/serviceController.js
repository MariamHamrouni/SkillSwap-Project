const Service = require('../models/Service');

// @desc    Créer un nouveau service (Gig)
// @route   POST /api/services
// @access  Privé
const createService = async (req, res) => {
    try {
        const { title, description, price, category } = req.body;

        // Vérifier si une image a été uploadée (Multer)
        const imagePath = req.file ? req.file.path : null;

        if (!title || !description || !price || !category || !imagePath) {
            return res.status(400).json({ message: 'Veuillez remplir tous les champs et ajouter une image' });
        }

        const service = await Service.create({
            seller: req.user._id, // Récupéré grâce au middleware protect
            title,
            description,
            price,
            category,
            image: req.file.path // On stocke le chemin de l'image (ex: uploads/image-123.jpg)
        });

        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Récupérer tous les services (avec recherche & filtre)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i', // Insensible à la casse
                },
            }
            : {};

        // On cherche les services ET on récupère les infos du vendeur (populate)
        const services = await Service.find({ ...keyword }).populate('seller', 'username email');

        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Récupérer un service par son ID
// @route   GET /api/services/:id
const getServiceById = async (req, res) => {
  try {
    // .populate('seller') est MAGIQUE : il va chercher les infos de l'utilisateur qui a créé le service
    const service = await Service.findById(req.params.id).populate('seller', 'username email');

    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
// @route   GET /api/services/my-services
const getMyServices = async (req, res) => {
    try {
        // On cherche les services où le champ 'seller' est égal à MON id
        const services = await Service.find({ seller: req.user._id });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// @desc    Supprimer un service
// @route   DELETE /api/services/:id
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }

        // VÉRIFICATION DE SÉCURITÉ : Est-ce que le vendeur est bien celui qui est connecté ?
        if (service.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Non autorisé à supprimer ce service' });
        }

        await service.deleteOne(); // Suppression
        res.json({ message: 'Service supprimé' });
        
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


module.exports = { createService, getServices, getServiceById , getMyServices, deleteService };
