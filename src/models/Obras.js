const mongoose = require("mongoose");

const obrasSchema = new mongoose.Schema({
    situacao: String,
    cliente: String,
    logoCliente: [
        {
            url: String,
            data: String,
            titulo: String,
        },
    ],
    cidade: String,
    estado: String,
    dataInicial: String,
    dataFinal: String,
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
