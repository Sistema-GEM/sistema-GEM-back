const mongoose = require("mongoose");

const documentosSchema = new mongoose.Schema({
  url: String,
  data: String,
  titulo: String,
  tipo: String,
});

const Obras = mongoose.model("Documentos", documentosSchema);

module.exports = Obras;
