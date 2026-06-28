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

const destinationRoutes = require("./routes/destinationRoutes");
app.use("/destinations", destinationRoutes);

const onboardingRoutes = require("./routes/onboardingRoutes");
app.use("/onboarding", onboardingRoutes);

const recommendRoutes = require("./routes/recommendRoutes");
app.use("/recommend", recommendRoutes);

const storageRoutes = require("./routes/storageRoutes");
app.use("/storage", storageRoutes);