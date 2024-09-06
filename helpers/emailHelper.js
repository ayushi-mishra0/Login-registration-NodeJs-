const nodemailer = require('nodemailer');
require('dotenv').config();  // Ensure environment variables are loaded
//const { User } = require('../models');  // Ensure correct path to your models
//const User = db.userModel;
const db = require('../models');  // Adjust the path as necessary
const User = db.userModel;  // Assuming userModel is exported from models/index.js

const sendRegistrationMail = async (user, subject, text, html) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',  // Use 'gmail' or your email service
        auth: {
            user: "ayushi.mishra@antiersolutions.com",  // Your email address
            pass: "fvuh swmp qscc tguf"  // Your email password or app password
        }
    });

    let mailOptions = {
        from: `"Apni company" <ayushi.mishra@antiersolutions.com>`,  // Sender address
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

const sendReminder = async () => {
    try {
        // Fetch users who have OTPs and the OTP has not been verified
        const users = await User.findAll({
            where: {
                otpExpiresAt: {
                    [db.Sequelize.Op.gt]: new Date()  // OTP not expired
                },
                otp: {
                    [db.Sequelize.Op.ne]: null  // OTP is present
                },
                isVerified: false,  // OTP not verified
                updatedAt: {
                    [db.Sequelize.Op.lte]: new Date(new Date() - 10 * 60 * 1000)  // OTP received more than 10 minutes ago
                }
            }
        });

        if (users.length === 0) {
            console.log('No reminders to send');
            return;
        }

        // Iterate over users and send reminder emails
        for (const user of users) {
            const subject = 'Reminder: Verify Your OTP';
            const text = `Hello ${user.name},\n\nIt seems you haven't verified your OTP yet. Please use the OTP we sent you earlier to verify your email. If you didn't receive it, please request a new OTP.\n\nBest regards,\nAntier Solutions Pvt. Ltd.`;
            const html = `<p>Hello <strong>${user.name}</strong>,</p><p>It seems you haven't verified your OTP yet. Please use the OTP we sent you earlier to verify your email. If you didn't receive it, please request a new OTP.</p><p>Best regards,<br>Antier Solutions Pvt. Ltd.</p>`;

            await sendEmailQueue(user.email, subject, text, html);
        }

        console.log('Reminder emails sent successfully');
    } catch (error) {
        console.error('Error sending reminder emails:', error);
    }
};

module.exports = { sendRegistrationMail, sendEmailQueue, sendReminder };
