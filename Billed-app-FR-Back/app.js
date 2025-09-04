const express = require('express');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const authMiddleware = require('./middlewares/auth');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const billRoute = require('./routes/bill');

const upload = multer({ dest: 'public/' });
const app = express();

// Configuration CORS pour la production
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:8080',
    'https://billedappbabali.netlify.app',
    'http://localhost:8080' // Pour le développement local
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use('/public', express.static('public'));
app.get('/', (req, res) => {
  res.status(200).send('Bill app backend API v1');
});
app.use(authMiddleware);
app.use(upload.single('file'));
app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/bills', billRoute);

module.exports = app;
