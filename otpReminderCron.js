const cron = require('node-cron');
const db = require('./models/index'); // Adjust the path as necessary
const sendEmail = require('./helpers/emailHelper'); // Adjust the path as necessary

// Load environment variables
require('dotenv').config();

const User = db.userModel;

// Schedule cron job to run every 2 minutes
cron.schedule('*/2 * * * *', async () => {
    try {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        // Find users who have not verified their OTP and were last reminded more than 2 minutes ago
        const usersToRemind = await User.findAll({
            where: {
                otpExpiresAt: {
                    [db.Sequelize.Op.gt]: new Date() // Ensure OTP is still valid
                },
                isVerified: false,
                updatedAt: {
                    [db.Sequelize.Op.lt]: twoMinutesAgo // Ensure we are not sending multiple reminders within 2 minutes
                }
            }
        });

        for (const user of usersToRemind) {
            const subject = 'Reminder: Verify Your Email';
            const text = `Hello ${user.name},\n\nPlease verify your email using the OTP sent to you. Your OTP is still valid for a few more minutes.\n\nBest regards,\nMy App Team`;
            const html = `<p>Hello <strong>${user.name}</strong>,</p><p>Please verify your email using the OTP sent to you. Your OTP is still valid for a few more minutes.</p>`;

            await sendEmail.sendReminder(user.email, subject, text, html);
            // Update user record to indicate a reminder has been sent
            await user.update({ updatedAt: new Date() });
        }
    } catch (error) {
        console.error('Error in cron job:', error);
    }
});
