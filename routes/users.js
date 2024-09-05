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
/**
 * @swagger
 * /users/add:
 *   get:
 *     summary: Add a new user
 *     responses:
 *       200:
 *         description: User added successfully
 */
router.get('/add', userCtrl.addUser);

/**
 * @swagger
 * /users/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/users', userCtrl.getUsers);

/**
 * @swagger
 * /users/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/users/:id', userCtrl.getUser);

/**
 * @swagger
 * /users/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/users', userCtrl.postUsers);



// Authentication routes
//router.post('/login', userCtrl.login); // Login to get a JWT

// Protected routes with JWT verification
//app.post('/validate', userValidate.validateSchema, userValidate.validateUser);
// router.delete('/users/:id', userCtrl.deleteUser);
// router.patch('/users/:id', userCtrl.updateUser);

// router.get('/query', userCtrl.queryUser)

// router.get('/finders', userCtrl.findersUser)
// router.get('/get-set-virtual', userCtrl.getSetVirtualUser)
// router.get('/validate', userCtrl.validateUser)
// router.get('/raw-queries', userCtrl.rawQueriesUser)
// router.get('/one-to-one', userCtrl.oneToOneUser)
// router.get('/one-to-many', userCtrl.oneToManyUser)
// router.get('/many-to-many', userCtrl.manyToManyUser)

// router.post('/validate', userValidate.validateSchema, userValidate.validateUser);
// router.get("/sendemail", userCtrl.sendMail);


/**
 * @swagger
 * /users/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', userCtrl.deleteUser);

/**
 * @swagger
 * /users/users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.patch('/users/:id', userCtrl.updateUser);

/**
 * @swagger
 * /users/query:
 *   get:
 *     summary: Query users with specific conditions
 *     responses:
 *       200:
 *         description: User query results
 */
router.get('/query', userCtrl.queryUser);

/**
 * @swagger
 * /users/finders:
 *   get:
 *     summary: Find and count users with a specific last name
 *     responses:
 *       200:
 *         description: User find and count results
 */
router.get('/finders', userCtrl.findersUser);

/**
 * @swagger
 * /users/get-set-virtual:
 *   get:
 *     summary: Get users with virtual fields
 *     responses:
 *       200:
 *         description: User data with virtual fields
 */
router.get('/get-set-virtual', userCtrl.getSetVirtualUser);

/**
 * @swagger
 * /users/validate:
 *   get:
 *     summary: Validate user data
 *     responses:
 *       200:
 *         description: User validation results
 */
router.get('/validate', userCtrl.validateUser);

/**
 * @swagger
 * /users/raw-queries:
 *   get:
 *     summary: Perform raw SQL queries
 *     responses:
 *       200:
 *         description: Raw query results
 */
router.get('/raw-queries', userCtrl.rawQueriesUser);

/**
 * @swagger
 * /users/one-to-one:
 *   get:
 *     summary: Perform one-to-one relationship queries
 *     responses:
 *       200:
 *         description: One-to-one relationship query results
 */
router.get('/one-to-one', userCtrl.oneToOneUser);

/**
 * @swagger
 * /users/one-to-many:
 *   get:
 *     summary: Perform one-to-many relationship queries
 *     responses:
 *       200:
 *         description: One-to-many relationship query results
 */
router.get('/one-to-many', userCtrl.oneToManyUser);

/**
 * @swagger
 * /users/many-to-many:
 *   get:
 *     summary: Perform many-to-many relationship queries
 *     responses:
 *       200:
 *         description: Many-to-many relationship query results
 */
router.get('/many-to-many', userCtrl.manyToManyUser);

/**
 * @swagger
 * /users/sendemail:
 *   post:
 *     summary: Send an email
 *     responses:
 *       200:
 *         description: Email sent successfully
 */
router.post('/sendemail', userCtrl.sendMail);

module.exports = router;

