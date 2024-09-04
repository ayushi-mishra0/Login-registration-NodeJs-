const nodemailer = require('nodemailer');
const crypto = require('crypto');
const sendEmail = require('../helpers/emailHelper');

require('dotenv').config();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};


const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex'); // Generate a random verification token
};

const sendOtpEmail = async (user) => {
    // Send OTP email
    let subject = 'Your OTP Code'; // Subject line
    let text = `Your OTP code is ${user.otp}. It expires in 30 minutes.`; // Plain text body
    let html = `<p>Hello <strong>${user.name}</strong>,</p><p>Your OTP code is ${user.otp}. It expires in 30 minutes.</p><br><p>Best regards</p><p>Antier Solutions Pvt. Ltd.</p>`; // HTML body
    await sendEmail.sendRegistrationMail(user, subject, text, html);

    // Send verification link email
    const verificationLink = `http://localhost:3000/verify-email?token=${user.verificationToken}&email=${user.email}`;
    console.log('Verification link:', verificationLink); // Log to check the link

    subject = 'Email Verification Link'; // Subject line
    text = `Click on this link to verify your email: ${verificationLink}. It expires in 30 minutes.`; // Plain text body
    html = `<p>Hello <strong>${user.name}</strong>,</p><p>Click on this link to verify your email: ${verificationLink}. It expires in 30 minutes.</p><br><p>Best regards</p><p>Antier Solutions Pvt. Ltd.</p>`; // HTML body
    await sendEmail.sendRegistrationMail(user, subject, text, html);
};


module.exports = {generateOTP, generateVerificationToken, sendOtpEmail}




// var otpStore = {}; // Temporary in-memory storage for OTPs

// const sendOtpEmail = async (user, otp) => {
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: "ayushi.mishra@antiersolutions.com", // Your email address
//             pass: "rjhp xtau dggl iehb "   // Your email password or app password
        
//         }
//     });
// console.log("before==============");
//     let mailOptions = {
//         from: `"Antier Solutions" <ayushi.mishra@antiersolutions.com>`,
//         to: user.email,
//         subject: "Your OTP for Login",
//         text: `Your OTP code is: ${otp}`,
//         html: `<p>Your OTP code is: <strong>${otp}</strong></p>`
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         console.log("OTP email sent successfully.");
//     } catch (error) {
//         console.error("Error sending OTP email:", error);
//         throw error;
//     }
// };


// const verifyOtp = (email, otp) => {
//     console.log("=========before")
//     const storedOtp = otpStore[email];
//     console.log("----------after")
//     if (storedOtp && storedOtp === otp) {
//         delete otpStore[email]; // Clear OTP after verification
//         return true;
//     }
//     return false;
// };

// module.exports = { sendOtpEmail, verifyOtp };
