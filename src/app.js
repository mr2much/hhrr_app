const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();
app
  .use(express.json({ limit: '1mb' }))
  .use(express.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, '../public')))
  .use(cors())
  .use(morgan('dev'))
  .use(helmet())
  .use(helmet.crossOriginEmbedderPolicy({ policy: 'credentialless' }))
  .use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'https://cdn.jsdelivr.net',
          'https://cdnjs.cloudflare.com',
          'https://ajax.googleapis.com',
          'https://cdn.amcharts.com',
          'https://unpkg.com',
          'https://bootswatch.com',
        ],
        imgSrc: [
          "'self'",
          "'self' data:",
          'https://unpkg.com',
          'https://picsum.photos',
          'https://fastly.picsum.photos/',
          '*.openstreetmap.org',
        ],
      },
    })
  )
  .use(methodOverride('_method'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
