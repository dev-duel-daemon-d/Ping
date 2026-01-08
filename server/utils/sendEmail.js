import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, html }) => {
  try {
    const port = parseInt(process.env.SMTP_PORT || "2525");
    // const secure = port === 465;

    // Create a transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: port,
      secure: false, // true for 465, false for other ports

      requireTLS: true,
      logger: true,
      debug: true,
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
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
    if (process.env.NODE_ENV === "production") {
      console.error("Email send failed:", error.message);
      console.error("Error code:", error.code);
      console.error("SMTP Configuration Check:", {
        host: process.env.SMTP_HOST || "NOT SET",
        port: process.env.SMTP_PORT || "NOT SET",
        email: process.env.SMTP_EMAIL ? "✓ Configured" : "✗ MISSING",
        password: process.env.SMTP_PASSWORD ? "✓ Configured" : "✗ MISSING",
      });
      throw new Error(
        "Failed to send verification email. Please try again later.",
      );
    }

    // DEVELOPMENT: Fallback logging
    console.log(
      "\n================================================================",
    );
    console.log("EMAIL SERVICE ALERT (Dev Mode / Failure Fallback)");
    console.log(`To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(
      "----------------------------------------------------------------",
    );
    // Extract OTP from HTML if possible for easier reading
    const otpMatch = html.match(/>(\d{6})</);
    if (otpMatch) {
      console.log(`>>> OTP CODE: ${otpMatch[1]} <<<`);
    }
    console.log(
      "----------------------------------------------------------------",
    );
    console.log("Full HTML Content:", html);
    console.log(
      "================================================================\n",
    );
    console.error("Nodemailer Error:", error.message);

    return { id: "mock-email-id", success: true };
  }
};

