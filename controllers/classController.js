import ClassModel from "../models/class.js";

export const createClass = async (req, res) => {
  try {
    const cls = await ClassModel.create(req.body);
    res.status(201).json(cls);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getClasses = async (req, res) => {
  const classes = await ClassModel.find();
  res.json(classes);
};
