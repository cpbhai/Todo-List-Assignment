const boardModel = require("../models/board");
const errorResponse = require("../utils/errorResponse");
const mongoose = require("mongoose");

exports.create = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const board = await boardModel.create(req.body);
    res.status(201).json({
      success: true,
      board,
      message: "Board has been created successfully",
    });
  } catch (err) {
    errorResponse(res, err);
  }
};
exports.get = async (req, res) => {
  try {
    const boards = await boardModel.find({
      user: req.user._id,
      isDeleted: false,
    });
    res.status(200).json({ success: true, data: boards });
  } catch (err) {
    errorResponse(res, err);
  }
};
exports.getSpecific = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params._id))
      throw { message: "Invalid Board Id" };
    const board = await boardModel.findOne({
      _id: req.params._id,
      isDeleted: false,
      user: req.user._id,
    });
    if (!board) throw { message: "No such board found" };
    res.status(200).json({ success: true, data: board });
  } catch (err) {
    errorResponse(res, err);
  }
};
exports.remove = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params._id))
      throw { message: "Invalid Board Id" };
    const board = await boardModel.findOne({
      _id: req.params._id,
      isDeleted: false,
      user: req.user._id,
    });
    if (!board) throw { message: "No such board found" };
    board.isDeleted = true;
    board.save();
    res.status(200).json({ success: true, data: board });
  } catch (err) {
    errorResponse(res, err);
  }
};
