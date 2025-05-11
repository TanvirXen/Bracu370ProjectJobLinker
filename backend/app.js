require("dotenv").config();
const express = require("express");
const cors = require("cors");

const aRoutes = require("./routes/route");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", aRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
