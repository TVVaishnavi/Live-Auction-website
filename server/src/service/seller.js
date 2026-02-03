const AuctionItem = require("../models/auctionItem");

exports.createItem = async (sellerId, data) => {
  const { title, description, startingPrice, images } = data;

  if (!title || !startingPrice) {
    throw new Error("Title and starting price are required");
  }

  if (!images || !Array.isArray(images) || images.length === 0) {
    throw new Error("At least one image is required");
  }

  if (images.length > 5) {
    throw new Error("You can upload a maximum of 5 images");
  }

  images.forEach((url) => {
    if (typeof url !== "string") {
      throw new Error("Invalid image format");
    }
  });

  const item = await AuctionItem.create({
    title,
    description,
    startingPrice,
    images, 
    sellerId,
    status: "AVAILABLE",
  });

  return item;
};

exports.getMyItems = async (sellerId) => {
  return await AuctionItem.find({ sellerId })
    .populate("hostId", "name email")
    .sort({ createdAt: -1 });
};
