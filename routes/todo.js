const express = require("express");
const router = express.Router();

const {
  create,
  getTodosOfBoard,
  getSpecific,
  update,
  remove,
} = require("../controllers/todo.js");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/create", isAuthenticated, create); //create todo
router.get("/get-by-board/:_id", isAuthenticated, getTodosOfBoard); //get todos by board id
router.get("/get-by-task/:_id", isAuthenticated, getSpecific); // get todo by specific id
router.put("/update/:_id", isAuthenticated, update);
router.delete("/remove/:_id", isAuthenticated, remove); //remove todo

module.exports = router;
