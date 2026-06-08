const pool = require('../db');

// 🔍 Récupérer tous les véhicules (SELECT)
const getAllVehicles = async (req, res) => {
  try {
    // On demande à Postgres de tout sélectionner
    const result = await pool.query('SELECT * FROM vehicles ORDER BY id ASC');
    
    // On renvoie les lignes trouvées (result.rows)
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur SELECT:", error);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
};

// ➕ Ajouter un véhicule (INSERT)
const createVehicle = async (req, res) => {
  try {
    // 1. On récupère les 4 champs envoyés par votre formulaire Vue.js
    const { marque, modele, annee, kilometrage } = req.body;

    // 2. On insère les 4 valeurs dans la base de données
    const result = await pool.query(
      'INSERT INTO vehicles (marque, modele, annee, kilometrage) VALUES ($1, $2, $3, $4) RETURNING *',
      [marque, modele, annee, kilometrage]
    );

    res.status(201).json({ 
      message: "✅ Véhicule ajouté avec succès", 
      data: result.rows[0] 
    });
  } catch (error) {
    console.error("Erreur INSERT:", error);
    res.status(500).json({ error: "Erreur lors de la création" });
  }
};

module.exports = {
  getAllVehicles,
  createVehicle
};