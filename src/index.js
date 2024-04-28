require("dotenv/config");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", routes);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  mongoose.connect(process.env.MONGO_KEY);
  console.log("App running");
});
