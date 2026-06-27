require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());

const userRoutes = require("./routes/userRoutes");

app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`[BE] Server is running on http://localhost:${PORT}`);
});