import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subject, html }) => {
    try {
        // Create a transporter using environment variables
        // Default to Gmail settings if not specified
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const message = {
            from: process.env.EMAIL_FROM || `"Ping" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(message);
        return info;

    } catch (error) {
        // PRODUCTION: Always throw the error and DO NOT log the OTP
        if (process.env.NODE_ENV === 'production') {
            console.error('Email send failed:', error.message);
            throw new Error('Failed to send verification email. Please try again later.');
        }

        // DEVELOPMENT: Fallback logging
        console.log('\n================================================================');
        console.log('EMAIL SERVICE ALERT (Dev Mode / Failure Fallback)');
        console.log(`To: ${email}`);
        console.log(`Subject: ${subject}`);
        console.log('----------------------------------------------------------------');
        // Extract OTP from HTML if possible for easier reading
        const otpMatch = html.match(/>(\d{6})</);
        if (otpMatch) {
             console.log(`>>> OTP CODE: ${otpMatch[1]} <<<`);
        }
        console.log('----------------------------------------------------------------');
        console.log('Full HTML Content:', html);
        console.log('================================================================\n');
        console.error('Nodemailer Error:', error.message);
        
        return { id: 'mock-email-id', success: true };
    }
};