// src/services/station.service.js

// On récupère l'URL de base depuis le fichier .env (ou Vercel en production)
const API_URL = import.meta.env.VITE_API_URL;

export const fetchNearbyStations = async (lat, lon, radius = 10) => {

  const response = await fetch(`${API_URL}/stations/nearby?lat=${lat}&lon=${lon}&radius=${radius}`);
  
  if (!response.ok) {
    throw new Error('Erreur de communication avec le serveur');
  }
  
  return await response.json();
};