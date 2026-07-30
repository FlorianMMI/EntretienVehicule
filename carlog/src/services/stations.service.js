// service d'appelle des fonctions pour l'api des stations services (Type loader en react )


export const fetchNearbyStations = async (lat, lon, radius = 10) => {
  const response = await fetch(`http://localhost:3000/api/stations/nearby?lat=${lat}&lon=${lon}&radius=${radius}`);
  if (!response.ok) throw new Error('Erreur de communication avec le serveur');
  return await response.json();
};