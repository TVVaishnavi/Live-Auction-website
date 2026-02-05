const User = require("../models/user");

exports.createUser = async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.json(existing);
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.create({ name, email, password, role });
    console.log("data", req.body)
    res.status(201).json(user);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

