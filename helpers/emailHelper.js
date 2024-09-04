const nodemailer = require('nodemailer');
require('dotenv').config();  // Ensure environment variables are loaded

const sendRegistrationMail = async (user, subject, text, html) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',  // Use 'gmail' or your email service
        auth: {
            user: "ayushi.mishra@antiersolutions.com",  // Your email address
            pass: "fvuh swmp qscc tguf"
            // Your email password or app password
        }
    });

    let mailOptions = {
        from: `"Apni company" <ayushi.mishra@antiersolutions.com}>`,  // Sender address
        to: user.email,  // List of receivers
        subject: subject,  // Subject line
        text: text,  // Plain text body
        html: html  // HTML body
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw error to handle it in the calling function
    }
};
const sendEmailQueue = async (email, subject, text, html) => {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        port: 465,
        auth: {
          user: 'ayushi.mishra@antiersolutions.com', // Replace with your Gmail address
          pass: 'fvuh swmp qscc tguf' // Replace with your Gmail password or app-specific password
        }
      });
  
      const mailOptions = {
        from: '"Antier Solutions Pvt. Ltd." <ayushi.mishra@antiersolutions.com>', // Replace with your sender address
        to: email, // Recipient's email
        subject: subject, // Subject line
        text: text, // Plain text body
        html: html // HTML body
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Could not send welcome email');
    }
  };
  
  module.exports = {sendRegistrationMail, sendEmailQueue};
  
  
  