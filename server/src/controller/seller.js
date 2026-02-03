const sellerService = require("../service/seller");

exports.createItem = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body); 
    const item = await sellerService.createItem(
      req.user.userId,
      req.body
    );
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyItems = async (req, res) => {
  try {
    const items = await sellerService.getMyItems(
      req.user.userId
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
