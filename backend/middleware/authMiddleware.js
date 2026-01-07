const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Vérifier si le header Authorization commence par "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Récupérer le token (après "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // Décoder le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Trouver l'utilisateur et l'ajouter à la requête (req.user)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Passer à la suite
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Non autorisé, token invalide' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Non autorisé, pas de token' });
    }
};

module.exports = { protect };