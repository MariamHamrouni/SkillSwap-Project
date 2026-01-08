const Profile = require('../models/Profile');

// @desc    Récupérer mon profil
exports.getMyProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id });
        
       
        if (!profile) {
            profile = await Profile.create({ 
                user: req.user._id,
                bio: "Nouveau membre",
                skills: [] 
            });
        }
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// @desc    Mettre à jour mon profil
exports.updateProfile = async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { user: req.user._id },
            req.body,
            { new: true, upsert: true }
        );
        res.json(profile);
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la mise à jour" });
    }
};