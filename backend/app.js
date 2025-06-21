require('dotenv').config();
const express = require('express');
const cors = require('cors');
const disasterRoutes = require('./routes/disasterRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/disasters', disasterRoutes);
app.get('/', (req, res) => res.send('Disaster API is running'));

module.exports = app;