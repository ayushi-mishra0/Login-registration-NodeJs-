require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
import newFile from './controllers/new.js'; // Adjust the path based on your folder structure

const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//require('dotenv').config();
const logger = require('morgan');


// Import routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const multerRouter = require('./routes/userRoutes');

const session = require('express-session');
const RedisStore = require('connect-redis').default; // For ESM syntax, use .default
const Redis = require('ioredis'); // Import ioredis
const swaggerUi = require('swagger-ui-express');
//const swaggerSpec = require('./swagger');
const swaggerFile = require('./swagger_output.json'); // Output file from swagger-autogen
const otpReminderCron = require('./otpReminderCron');
const app = express(); // Initialize express application

newFile(); // If `new.js` exports a function to call

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const redisClient = new Redis({
  host: '172.17.0.1', // Redis server host
  port: 6378,        // Redis server port
  // password: 'your-redis-password', // Uncomment if your Redis instance is password protected
});


app.use(
    session({
        store: new RedisStore({ client: redisClient }), // Use the redis client
        secret: process.env.SESSION_SECRET || 'default_secret', // Ensure you have a secret here
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true } // Adjust cookie settings as needed
    })
);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set up static file serving for the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/multer', multerRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
