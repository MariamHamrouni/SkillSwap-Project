// On importe juste votre nouvelle fonction de configuration
const { getModel } = require('../config/gemini'); 

exports.generateDescription = async (req, res) => {
  try {
    const { title, category } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Le titre est requis." });
    }

    // 👇 C'est ici que la magie opère : on récupère le modèle configuré
    const model = getModel();

    const prompt = `Tu es un expert marketing. Rédige une description courte et vendeuse (max 100 mots) pour un service freelance intitulé : "${title}". La catégorie est : "${category}".`;

    // Appel à l'IA
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ description: text });

  } catch (error) {
    console.error("❌ Erreur Controller IA:", error);
    
    // Si l'erreur mentionne "Not Found" ou "404", c'est souvent un souci de version
    res.status(500).json({ 
        message: "Erreur lors de la génération", 
        details: error.message 
    });
  }
};