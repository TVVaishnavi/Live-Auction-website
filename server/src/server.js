const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const connectDB = require("./config/dbConfig");
const userRoutes = require("./routes/user");
const sellerRoutes = require("./routes/seller");
const hostRoutes = require("./routes/host");
const bidderRoutes = require('./routes/bidder');
const auctionRoutes = require("./routes/auction");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,               
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/items", sellerRoutes, hostRoutes, bidderRoutes);
app.use("/api/auctions", auctionRoutes);

connectDB();

app.listen(process.env.PORT, () => {
  console.log("Server running on", process.env.PORT);
});
