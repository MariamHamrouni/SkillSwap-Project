// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// DB
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const aiRoutes = require("./routes/aiRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profiles', profileRoutes);
// Static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
