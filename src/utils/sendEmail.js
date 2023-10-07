const nodemailerConfig = require("../config/nodemailer");
const nodemailer = require("nodemailer");

module.exports = async (options) => {
  await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  const mailOptions = {
    from: "Admin <admin@mail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
