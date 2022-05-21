var nodemailer = require("nodemailer");

module.exports = function (mailOptions, cb) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "singhharshvardhan223@gmail.com",
      pass: "xhlxfzudlzaatwst",
    },
  });

  transporter.sendMail(
    mailOptions,
    cb
      ? cb
      : (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
          return info.messageId;
        }
  );
};
