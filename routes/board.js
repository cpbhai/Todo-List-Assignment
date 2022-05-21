const express = require("express");
const router = express.Router();

const { create, get, getSpecific, remove } = require("../controllers/board.js");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/create", isAuthenticated, create);
router.get("/get", isAuthenticated, get);
router.get("/get/:_id", isAuthenticated, getSpecific);
router.delete("/remove/:_id", isAuthenticated, remove);

module.exports = router;
