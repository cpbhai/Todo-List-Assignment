const mongoose = require("mongoose");
mongoose
  .connect(process.env.CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => console.log("mongodb running on 27017"))
  .catch((err) => console.log(err));
