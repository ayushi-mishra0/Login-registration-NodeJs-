const express = require('express');
const router = express.Router();
const multerController = require('../controllers/multerController');
//const jwtmdwr = require('../middleware/authMiddleware'); // Import authentication middleware
const { isAuthenticated } = require('../middleware/redisMiddleware');
var registerValid = require('../validators/UserValidation')
const { logoutUser } = require('../controllers/multerController'); // Adjust the path as necessary

// Define routes and associate them with controller functions

// Route to render the registration page
router.get('/register', (req, res) => res.render('addUser'));

// Register user route (public route, does not require authentication)
router.get('/login', (req, res)=>{
    res.render('login');
  });
// Login route (public route, does not require authentication)

router.post('/register',
  multerController.upload.single("profileImage"),
  registerValid.registerValidation,
  registerValid.validateUser, 
  registerValid.validateImage, 
  multerController.registerUser
)

router.post('/login', 
  registerValid.loginValidation,
  registerValid.validateUser,
  multerController.loginUser
)

// Protected routes (require valid JWT token)
//router.use(jwtmdwr.authenticateToken);

router.get('/users', multerController.listUsers);
router.get('/add', multerController.addUserForm);
router.post('/add', multerController.addUser);

router.get('/edit/:id', multerController.editUserForm);
router.post('/edit/:id', multerController.editUser);
router.get('/delete/:id', multerController.deleteUser);
router.get('/verify-otp', (req, res)=>{
  res.render('verifyOtp');
});
router.post('/verify-otp', multerController.verifyOtp);
router.get('/verify-email', multerController.verifyEmail);

// Protected route example
router.get('/protected-route', isAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.session.user });
});

router.get('/fetch-user-data', multerController.fetchUserData);


// Logout route
// Assuming you are using Express and a session middleware like express-session
router.post('/logout', logoutUser);



module.exports = router;
