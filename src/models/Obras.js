const mongoose = require("mongoose");

const obrasSchema = new mongoose.Schema({
  descricao: String,
  situacao: String,
  cliente: String,
  logoCliente: {
    url: String,
    data: String,
    titulo: String,
  },
  cidade: String,
  estado: String,
  estadoSigla: String,
  dataInicio: String,
  dataTermino: String,
  periodo: String,
  caminhoes: [String],
  documentos: [
    {
      url: String,
      data: String,
      titulo: String,
    },
  ],
});

const Obras = mongoose.model("Obras", obrasSchema);

module.exports = Obras;
