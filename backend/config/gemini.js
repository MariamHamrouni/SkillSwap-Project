const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // <--- INDISPENSABLE pour lire le .env

// Ajout d'un log pour vérifier si la clé est bien là (regardez votre terminal)
console.log("Clé API chargée :", process.env.GEMINI_API_KEY ? "OUI ✅" : "NON ❌");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

module.exports = { getModel };