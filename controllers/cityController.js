import City from "../models/city.js";

export const createCity = async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json(city);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCities = async (req, res) => {
  const cities = await City.find();
  res.json(cities);
};
