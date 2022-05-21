const SendEmail = require("../services/email");
const EmailTemplate = require("../services/email-template");

module.exports = (templateId, payload) => {
  let template = { subject: "", body: "" };
  switch (templateId) {
    case "send-otp":
      template = EmailTemplate.sendOtp(payload.value);
      break;
    default:
      console.log("W");
  }

  let mailOptions = {
    to: payload.email,
    subject: template.subject,
    html: template.body,
  };
  // payload.bcc == undefined ? "" : payload.bcc
  console.log("Sending mail to:", payload.email);
  SendEmail(mailOptions);
};
