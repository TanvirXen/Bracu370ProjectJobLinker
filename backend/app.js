require("dotenv").config();
const express = require("express");
const cors = require("cors");

const aRoutes = require("./routes/route");

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api", aRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
