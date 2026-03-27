const express = require('express');

const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const errorController = require('./controllers/error');

const app = express();
const allowedOrigin = 'http://localhost:4200';

app.use(bodyParser.json({ limit: '10mb' }));

const ports = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }

    next();
});

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

app.use(errorController.get404); //404 error handler
app.use(errorController.get500); //server error handler

app.listen(ports, () => {
    console.log(`Server up and running on port ${ports}`);
});
