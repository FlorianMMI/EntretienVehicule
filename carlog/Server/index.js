const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


const vehicleRoutes = require('./routes/vehicles.routes');

const stationsRoutes = require('./routes/stations.routes');
app.use('/api/vehicles', vehicleRoutes);


app.use('/api/stations', stationsRoutes);
app.listen(port, () => {
  console.log(`🚀 Serveur API démarré sur le port ${port}`);
});