const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", routes);

const port = 3000;

app.listen(port, () => {
  mongoose.connect(
    // "mongodb+srv://gemtransportessite:O0Xb0p50gkSCMIyT@gembd.mc7cluc.mongodb.net/?retryWrites=true&w=majority&appName=GemBD"
    "mongodb+srv://usercarlos:usercarlos123@gembd.mc7cluc.mongodb.net/?retryWrites=true&w=majority&appName=GemBD"
  );
  console.log("App running");
});
