const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json());

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/predios',    require('./routes/predios'));
app.use('/api/areas',      require('./routes/areas'));
app.use('/api/alertas',    require('./routes/alertas'));
app.use('/api/usuarios',   require('./routes/usuarios'));
app.use('/api/telemetria', require('./routes/telemetria'));

app.listen(process.env.PORT, () => {
    console.log(`API corriendo en http://localhost:${process.env.PORT}`);
});