const todoModel = require("../models/todo");
const errorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const todo = await todoModel.create(req.body);
    res.status(201).json({
      success: true,
      todo,
      message: "To-do has been added successfully",
    });
  } catch (err) {
    errorResponse(res, err);
  }
};
exports.getTodosOfBoard = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params._id))
      throw { message: "Invalid To-do Id" };
    const todos = await todoModel.find({
      board: req.params._id,
      isDeleted: false,
      user: req.user._id,
    });
    res.status(200).json({ success: true, data: todos });
  } catch (err) {
    errorResponse(res, err);
  }
};
exports.getSpecific = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params._id))
      throw { message: "Invalid To-do Id" };
    const todo = await todoModel.findOne({
      _id: req.params._id,
      isDeleted: false,
      user: req.user._id,
    });
    if (!todo) throw { message: "No such To-do found" };
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    errorResponse(res, err);
  }
};
exports.remove = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params._id))
      throw { message: "Invalid To-do Id" };
    const todo = await todoModel.findOne({
      _id: req.params._id,
      isDeleted: false,
      user: req.user._id,
    });
    if (!todo) throw { message: "No such To-do found" };
    todo.isDeleted = true;
    todo.save();
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    errorResponse(res, err);
  }
};
exports.update = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params._id))
      throw { message: "Invalid To-do Id" };
    const todo = await todoModel.findOne({
      _id: req.params._id,
      isDeleted: false,
      user: req.user._id,
    });
    if (!todo) throw { message: "No such To-do found" };
    if (req.body.status && ["Todo", "Doing", "Done"].includes(req.body.status))
      todo.status = req.body.status;
    if (req.body.task) todo.task = req.body.task;
    todo.save();
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    errorResponse(res, err);
  }
};
