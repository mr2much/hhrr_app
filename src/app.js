const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const passport = require('passport');
const localStrategy = require('passport-local');

require('dotenv').config();

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

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

const sessionConfig = {
  secret: 'thisisnotagoodsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

const Recruiter = require('./api/db/models/recruiters/recruiter');
const AppError = require('./lib/AppError');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(Recruiter.authenticate()));

passport.serializeUser((user, done) => {
  const userType = user instanceof Recruiter ? 'recruiter' : 'candidate';

  done(null, { _id: user._id, type: userType });
});

passport.deserializeUser(async (data, done) => {
  try {
    if (data.type === 'recruiter') {
      const recruiter = await Recruiter.findById(data._id);
      done(null, { user: recruiter, type: 'recruiter' });
    } else if (data.type === 'candidate') {
      const candidate = await Candidate.findById(data._id);
      done(null, { user: candidate, type: 'candidate' });
    } else {
      done(new Error('invalid user'));
    }
  } catch (err) {
    done(err);
  }
});

// passport.serializeUser(Recruiter.serializeUser());
// passport.deserializeUser(Recruiter.deserializeUser());

app.use((req, res, next) => {
  console.log(req.user);

  if (req.user) {
    if (req.user.type === 'recruiter') {
      console.log('User is a recruiter');
    } else {
      console.log('User is a candidate');
    }
  }
  res.locals.recruiterUser = req.user;
  // console.log(req);
  // console.log(res.locals);
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
