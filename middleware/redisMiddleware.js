const Redis = require('ioredis');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

const redisClient = new Redis({
  host: '127.0.0.1',
  port: 6379,
  // password: 'your-redis-password', // Uncomment if your Redis instance is password protected
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user && req.session.user.isAuthenticated) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = {
    redisClient,
    isAuthenticated,
};  
