// var db = require('../models');
const { body, validationResult } = require('express-validator');



var registerValidation = [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('phone', 'Please include a valid mobile number').isMobilePhone(),
  body('dob', 'Please include a valid date of birth').isDate(),
  body('address', 'Address is required').not().isEmpty(),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];
// Define the validation rules for the user

const validateImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ errors: [{ msg: 'Image is required' }] });
  }
  next();
};

var loginValidation = [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  
];

var validateSchema = [
  body('firstName')
    .isLength({ min: 2 })
    .withMessage('minimum 2 characters are allowed')
    .isAlpha()
    .withMessage('only alphabets are allowed'),
];


var validateUser = async (req, res, next) => {
  // Log the request body for debugging purposes
  console.log('Request body:', req.body);  // Add this line to see the incoming request data

  // Validate the request
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // Return validation errors
    console.log('Validation errors:', result.array());  // Log validation errors
    return res.status(400).json({ errors: result.array() });
  }

  // try {
  //   // Create a new user
  //   const data = await User.create({
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName
  //   });
  //   console.log('User created successfully:', data);  // Log the created user data
  //   res.status(200).json({ data: data });
  // } catch (error) {
  //   console.error('Error saving to the database:', error);
  //   res.status(500).json({ error: 'Failed to save data' });
  // }

next();
}


module.exports = { 
  validateSchema, 
  validateUser,
  registerValidation,
  validateImage,
  loginValidation
  };
