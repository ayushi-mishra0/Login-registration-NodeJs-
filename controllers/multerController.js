const fs = require('fs');
const path = require('path');
const multer = require('multer');
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/index');  // Ensure the correct path to your models
const sendEmail = require('../helpers/emailHelper');
const { redisClient } = require('../middleware/redisMiddleware');
const { getChannel, exchange } = require('../rabbitmq'); // Adjust path as necessary
const amqp = require('amqplib');

const emailVerifier = require('../helpers/otpHelper');
//const otpStore = {}; // Temporary in-memory storage for OTPs

const User = db.userModel;  // Ensure you use the correct model name

// Load environment variables
require('dotenv').config();

// Setup for file uploads
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Generate JWT token
const generateToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
        throw new Error("Missing JWT_SECRET in environment variables");
    }

    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};

// controllers/multerController.js or wherever your registerUser function is
// const bcrypt = require('bcrypt');
// const { User } = require('../models'); // Adjust the path as needed


// Producer function to send a registration message

// Producer function to send a registration message
const registerUser = async (req, res) => {
    let connection;
    let channel;
    try {
        const { name, email, mobile, dob, address, password } = req.body;
  
        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
  
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.toString(), salt);
  
        const otp = emailVerifier.generateOTP();
        const verificationToken = emailVerifier.generateVerificationToken();
        const expirationTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
  
        // Create a new user record
        const newUser = await User.create({
            name: name,
            email: email,
            mobile: mobile,
            dob: dob,
            address: address,
            image: req.file.filename,
            password: hashedPassword,
            otp: otp,
            otpExpiresAt: expirationTime,
            verificationToken: verificationToken,
            verificationTokenExpiresAt: expirationTime
        });
  
        // RabbitMQ setup
        const exchange = 'Email Notifications';
        const RoutingKey = 'EmailNotificationsKey';
        // const otpRoutingKey = 'otp_email';
        // const verificationRoutingKey = 'verification_email';
  
        connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
  
        await channel.assertExchange(exchange, 'direct', { durable: true });
  
        // Prepare messages
        const welcomeMessage = {
            "name" : newUser.name,
            "email": newUser.email,
            "type": "welcomeMessage",
            "content": "Thank you for registering at My App!"
        };
  
        const otpMessage = {
            "name" : newUser.name,
            "email": newUser.email,
            "type": "verifyEmailOtp",
            "content": "Your OTP code is :",
            "otp" : newUser.otp
        };
  
        const verificationMessage = {
            "name" : newUser.name,
            "email": newUser.email,
            "type": "verifyEmailLink",
            "content": "Click on this link to verify your email:",
            "verificationToken": newUser.verificationToken
        };
  
        // Publish messages
        channel.publish(exchange, RoutingKey, Buffer.from(JSON.stringify(welcomeMessage)), { persistent: true });
        channel.publish(exchange, RoutingKey, Buffer.from(JSON.stringify(otpMessage)), { persistent: true });
        channel.publish(exchange, RoutingKey, Buffer.from(JSON.stringify(verificationMessage)), { persistent: true });
  
        res.status(201).json({ message: 'User registered successfully and email tasks have been queued', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    } finally {
        if (channel) await channel.close();
        if (connection) await connection.close();
    }
  };
  
        
// let registerUser = async (req, res) => {
    
//         try {
//             const { name, email, phone, dob, address, password } = req.body;

//             // Check if the user already exists
//             const existingUser = await User.findOne({ where: { email } });
//             if (existingUser) {
//                 return res.status(400).json({ message: 'Email already in use' });
//             }

//             // Hash the password
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(password.toString(), salt);

//             const otp = emailVerifier.generateOTP();
//         const verificationToken = emailVerifier.generateVerificationToken();
//         const expirationTime = new Date(Date.now() + 30 * 60 * 1000);
//             // Create a new user record
//             const newUser = await User.create({
//                 name,
//                 email,
//                 phone,
//                 dob,
//                 address,
//                 profileImage: req.file ? req.file.filename : null,
//                 password: hashedPassword,
//                 otp: otp,
//                 otpExpiresAt: expirationTime,
//                 verificationToken: verificationToken,
//                 verificationTokenExpiresAt: expirationTime
//             });
//             console.log(newUser);
//             // Send a confirmation email
//             let subject = 'Welcome to Registration Portal'; // Subject line
//         let text = `Hello ${newUser.name},\n\nThank you for registering on My App!,\n\nBest regards,\nAntier Solutions Pvt. Ltd.`; // Plain text body
//         let html = `<p>Hello <strong>${newUser.name}</strong>,</p><p>Thank you for registering and connecting with us.!</p>`; // HTML body
//         await sendEmail.sendRegistrationMail(newUser, subject, text, html);

//         await emailVerifier.sendOtpEmail(newUser);
//         //console.log(newUser);
//         res.status(201).json({ message: 'User registered successfully and email sent on register email', user: newUser });
//     } catch (error) {
//         console.error('Error registering user:', error);
//         res.status(500).json({ message: 'Error registering user', error: error.message });
//         }
// };

// Handle user login

// var loginUser = async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       // Find the user by email
//       const user = await User.findOne({ where: { email } });
  
//       // Check if user exists
//       if (!user) {
//         return res.status(400).json({ message: 'Invalid email or password' });
//       }
  
//       // Verify the password
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(400).json({ message: 'Invalid email or password' });
//       }
  
//       // Generate JWT token (optional if you need it for other purposes)
//       const token = generateToken(user);

//       // Store user data in the session
//       req.session.user = {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           isAuthenticated: true
//       };

//       // Optionally, you can store the JWT token in the session as well
//       req.session.token = token;

//       res.json({ message: 'Login successful', token }); // Optionally return the token
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// };

//------------------Redis-------------------
  // Login user and set session in Redis
// Login user and set session in Redis
var loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);

        // Store user data in the Redis session
        req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            isAuthenticated: true
        };

        req.session.token = token;

        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout user and destroy session in Redis
var logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Session destruction error:', err);
            return res.status(500).render('error', { message: 'Failed to log out', error: err });
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
};


var fetchUserData = (req, res) => {
    if (req.session.user && req.session.user.isAuthenticated) {
        // Return user data from the session
        res.json({
            message: 'User data fetched successfully',
            user: {
                id: req.session.user.id,
                email: req.session.user.email,
                name: req.session.user.name
            }
        });
    } else {
        // If not authenticated, return unauthorized error
        res.status(401).json({ message: 'Unauthorized access' });
    }
};


// Verify OTP
var verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ where: { email, otp } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP or email' });
        }

        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};


//verifyEmail
var verifyEmail = async (req, res) => {
    try {
        const { token, email } = req.query;

        const user = await User.findOne({ where: { email, verificationToken: token } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token or email' });
        }

        if (user.verificationTokenExpiresAt < new Date()) {
            return res.status(400).json({ message: 'Verification link expired' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiresAt = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Error verifying email', error: error.message });
    }
};

// List users (protected)
let listUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        users.forEach(user => {
            if (user.dob) {
                user.dob = moment(user.dob).format('YYYY-MM-DD');
            }
        });

        res.render('listUsers', { users });
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json({ error: 'Error retrieving users: ' + err.message });
    }
};

// Add user form (protected)
let addUserForm = (req, res) => {
    res.render('addUser');
};

// Add user (protected)
let addUser = (req, res) => {
    upload.single('profileImage')(req, res, async (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(500).json({ error: 'Error uploading file: ' + err.message });
        }

        const { name, email, phone, dob, address } = req.body;
        const profileImage = req.file ? req.file.filename : null;
        const formattedDob = dob ? moment(dob, 'YYYY-MM-DD').format('YYYY-MM-DD') : null;

        const newUser = {
            name,
            email,
            phone,
            dob: formattedDob,
            profileImage,
            address
        };

        try {
            await User.create(newUser);
            res.redirect('/users');
        } catch (err) {
            console.error('Error adding user:', err);
            res.status(500).json({ error: 'Error adding user: ' + err.message });
        }
    });
};

// Edit user form (protected)
let editUserForm = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.dob) {
            user.dob = moment(user.dob).format('YYYY-MM-DD');
        }

        res.render('editUser', { user });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Error fetching user: ' + err.message });
    }
};

// Edit user (protected)
let editUser = (req, res) => {
    upload.single('profileImage')(req, res, async (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(500).json({ error: 'Error uploading file: ' + err.message });
        }

        const userId = req.params.id;
        const { name, email, phone, dob, address } = req.body;
        const profileImage = req.file ? req.file.filename : null;
        const formattedDob = dob ? moment(dob, 'YYYY-MM-DD').format('YYYY-MM-DD') : null;

        const updatedUser = {
            name,
            email,
            phone,
            dob: formattedDob,
            profileImage,
            address
        };

        try {
            await User.update(updatedUser, {
                where: { id: userId }
            });
            res.redirect('/users');
        } catch (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ error: 'Error updating user: ' + err.message });
        }
    });
};

// Delete user (protected)
let deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await User.destroy({
            where: { id: userId }
        });
        res.redirect('/users');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Error deleting user: ' + err.message });
    }
};


 module.exports = {
    upload,
    registerUser,
    loginUser,
    fetchUserData,
    logoutUser,
    verifyOtp,
    verifyEmail,
    addUser,
    listUsers,
    addUserForm,
    editUser,
    editUserForm,
    deleteUser
    
}