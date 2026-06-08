const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


const vehicleRoutes = require('./routes/vehicles.routes');

app.use('/api/vehicles', vehicleRoutes);

app.listen(port, () => {
  console.log(`🚀 Serveur API démarré sur le port ${port}`);
});