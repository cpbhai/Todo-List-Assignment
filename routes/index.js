const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/board", require("./board"));
router.use("/todo", require("./todo"));

module.exports = router;
