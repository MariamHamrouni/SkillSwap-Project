const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Profile = require('../models/Profile');

// Générer un Token JWT (Expire en 30 jours)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Inscrire un nouvel utilisateur
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // 2. Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. ÉTAPE CLÉ : Créer l'Utilisateur D'ABORD (sans profil pour l'instant)
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            // On ne met pas encore le champ 'profile', il sera ajouté à l'étape 5
        });

        // 4. Créer le Profil MAINTENANT (car on a l'ID de l'user)
        const newProfile = await Profile.create({
            user: user._id, // ✅ Maintenant on a un vrai ID !
            avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            bio: "Nouveau membre de SkillSwap"
        });

        // 5. Mettre à jour l'Utilisateur pour lui lier le profil
        user.profile = newProfile._id;
        await user.save();

        // 6. Réponse (Succès)
        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
                message: "Inscription réussie !"
            });
        }
    } catch (error) {
        console.error(error); // Ajoutez ça pour voir les erreurs dans le terminal
        res.status(500).json({ message: error.message });
    }
};

// @desc    Connecter un utilisateur
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Vérifier l'email
        const user = await User.findOne({ email });

        // 2. Vérifier le mot de passe
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };