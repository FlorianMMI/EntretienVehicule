exports.getNearbyStations = async (req, res) => {
  try {
    const { lat, lon, radius = 10 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Latitude et longitude requises" });
    }

    const whereQuery = `within_distance(geom, GEOM'POINT(${lon} ${lat})', ${radius}km)`;
    const baseUrl = 'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records';
    const apiUrl = `${baseUrl}?where=${encodeURIComponent(whereQuery)}&limit=50`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data.results);

  } catch (error) {
    console.error("Erreur backend stations:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des stations" });
  }
};