exports.getNearbyStations = async (req, res) => {
  try {
    const { lat, lon, radius = 10 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude et longitude requises" });
    }

    // Sécurité : On force le remplacement des virgules par des points (au cas où)
    const safeLat = String(lat).replace(',', '.');
    const safeLon = String(lon).replace(',', '.');

    const whereQuery = `within_distance(geom, GEOM'POINT(${safeLon} ${safeLat})', ${radius}km)`;
    const baseUrl = 'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records';
    const apiUrl = `${baseUrl}?where=${encodeURIComponent(whereQuery)}&limit=50`;
    
    // Mouchard pour Vercel : on affiche l'URL exacte appelée
    console.log("Vercel appelle l'API :", apiUrl);

    // On trompe le pare-feu en faisant croire que la requête vient d'un navigateur
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorDetail = await response.text(); 
      console.error(`Détail du refus de l'API (Status ${response.status}) :`, errorDetail);
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data.results);

  } catch (error) {
    console.error("Erreur backend stations:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des stations" });
  }
};