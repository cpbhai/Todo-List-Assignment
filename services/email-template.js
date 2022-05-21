exports.sendOtp = (value) => {
  return {
    subject: `OTP For LOGIN - To-Do List`,
    body: `Hi,<br></br>Your OTP for Log In is: ${value}`,
  };
};
