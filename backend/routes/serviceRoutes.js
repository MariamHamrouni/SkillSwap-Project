const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createService, getServices, getServiceById, getMyServices, deleteService } = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

// --- CONFIGURATION MULTER ---
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads')); // Chemin absolu plus sûr
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Pas une image !'), false);
    }
};

const upload = multer({ storage, fileFilter });


// --- ROUTES (ATTENTION À L'ORDRE !!!) ---

// 1. D'ABORD : La route spécifique "Mes Services"
// Important : Mettez bien 'my-services' avec un tiret pour correspondre au Frontend
router.get('/my-services', protect, getMyServices);

// 2. ENSUITE : La route racine
router.route('/')
    .get(getServices)
    .post(protect, upload.single('image'), createService);

// 3. EN DERNIER : La route dynamique (ID)
// Si on met ça avant, ça bloque tout !
router.route('/:id')
    .get(getServiceById)
    .delete(protect, deleteService);

module.exports = router;