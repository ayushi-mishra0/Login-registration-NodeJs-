//var express = require('express');
const express = require('express');
const userValidate = require('../validators/UserValidation');

var router = express.Router();
const bodyParser = require('body-parser');
//const userValidate = require('./validators/UserValidation');
require('../models');
const userCtrl = require('../controllers/userControllers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//const app = express();

// Middleware
router.use(bodyParser.json());

// Routes
router.get('/', (req, res) => {
  res.send('Hello World');
});

// User routes
router.get('/add', userCtrl.addUser);

router.get('/users', userCtrl.getUsers);
router.get('/users/:id', userCtrl.getUser);
router.post('/users',userValidate.validateSchema, userValidate.validateUser, userCtrl.postUsers);


// Authentication routes
//router.post('/login', userCtrl.login); // Login to get a JWT

// Protected routes with JWT verification
//app.post('/validate', userValidate.validateSchema, userValidate.validateUser);
router.delete('/users/:id', userCtrl.deleteUser);
router.patch('/users/:id',userValidate.validateSchema, userValidate.validateUser, userCtrl.updateUser);

router.get('/query', userCtrl.queryUser)

router.get('/finders', userCtrl.findersUser)
router.get('/get-set-virtual', userCtrl.getSetVirtualUser)
router.get('/validate', userCtrl.validateUser)
router.get('/raw-queries', userCtrl.rawQueriesUser)
router.get('/one-to-one', userCtrl.oneToOneUser)
router.get('/one-to-many', userCtrl.oneToManyUser)
router.get('/many-to-many', userCtrl.manyToManyUser)

router.post('/validate', userValidate.validateSchema, userValidate.validateUser);
router.get("/sendemail", userCtrl.sendMail);


module.exports = router;