const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

async function sendEmail(to, otp) {
  await transporter.sendMail({
    from: `"Auction App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your email",
    text: `Your verification OTP is ${otp}. It expires in 10 minutes.`,
  });
}

module.exports = sendEmail;
