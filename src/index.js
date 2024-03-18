const express = require("express");
const { ServerMonitoringMode } = require("mongodb");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express()

app.use(express.json())

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    app.use(cors());
    next();
});

const port = 3000

const Caminhao = mongoose.model('Caminhao', {
    ObraID: String,
    NumeroFrota: String,
    Proprietario: String,
    Placa: String,
    Anof: String,
    Marca: String,
    Modelo: String,
    Chassi: String,
    Renavam: String,
    CRV: String,
    CNPJ: String,
    KM: String,
    Horimetro: String,
    Data: String,
    ManutencaoPreventiva: {
        Data: { type: String },
        Km: { type: String },
        Horimetro: { type: String },
        Reponsavel: { type: String },
        Local: { type: String },
        Observacao: { type: String },
        OleoDoMotor: { type: String },
        OleoDaCaixa: { type: String },
        OleoDosDiferenciais: { type: String },
        OleoDeCubos: { type: String },
        FiltroMotor: { type: String },
        FiltroDiesel: { type: String },
        FiltroRacol: { type: String },
        FiltroAr: { type: String },
        FiltroValvula: { type: String },
        Documentos: { type: String },
    },
    ManutencaoCorretiva: {
        Data: { type: String },
        Km: { type: String },
        Horimetro: { type: String },
        GrupoServico: { type: String },
        DescricaoServico: { type: String },
        FornecedorPeca: { type: String },
        ValorPeça: { type: String },
        FornecedorMaoDeObra: { type: String },
        ValorMaoDeObra: { type: String },
        Reponsavel: { type: String },
        Local: { type: String },
        Observacao: { type: String },
        Documentos: { type: String },
    },
    ProtecaoCasco: String,
    SeguradoraCasco: String,
    DataRenovacaoCasco: String,
    TitularCasco: String,

    ProtecaoTerceiros: String,
    SeguradoraTerceiros: String,
    DataRenovacaoTerceiros: String,
    TitularTerceiros: String,

    ProtecaoImplemento: String,
    SeguradoraCasco: String,
    DataRenovacaoCasco: String,
    TitularCasco: String,

});

app.post("/", async (req, res) => {
    const caminhao = new Caminhao({
        ObraID: req.body.ObraID,
        NumeroFrota: req.body.NumeroFrota,
        Proprietario: req.body.Proprietario,
        Placa: req.body.Placa,
        Anof: req.body.Anof,
        Marca: req.body.Marca,
        Modelo: req.body.Modelo,
        Chassi: req.body.Chassi,
        Renavam: req.body.Renavam,
        CRV: req.body.CRV,
        CNPJ: req.body.CNPJ,
        KM: req.body.KM,
        Horimetro: req.body.Horimetro,
        Data: req.body.Data,
        ManutencaoPreventiva: req.body.ManutencaoPreventiva,
        ManutencaoCorretiva: req.body.ManutencaoCorretiva,
        ProtecaoCasco: req.body.ProtecaoCasco,
        SeguradoraCasco: req.body.SeguradoraCasco,
        DataRenovacaoCasco: req.body.DataRenovacaoCasco,
        TitularCasco: req.body.TitularCasco,

        ProtecaoTerceiros: req.body.ProtecaoTerceiros,
        SeguradoraTerceiros: req.body.SeguradoraTerceiros,
        DataRenovacaoTerceiros: req.body.DataRenovacaoTerceiros,
        TitularTerceiros: req.body.TitularTerceiros,

        ProtecaoImplemento: req.body.ProtecaoImplemento,
        SeguradoraCasco: req.body.SeguradoraCasco,
        DataRenovacaoCasco: req.body.DataRenovacaoCasco,
        TitularCasco: req.body.TitularCasco,
    })

    await caminhao.save()
    res.send(caminhao)

})

app.get('/books', (req, res) => {
    const page = req.query.p || 0
    
})


app.get("/caminhao", async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Tamanho da página, padrão é 10
    const skip = (page - 1) * pageSize; // Quantidade de itens para pular

    try {
        const totalItems = await Caminhao.countDocuments();
        const totalPages = Math.ceil(totalItems / pageSize); // Calcula o total de páginas

        const caminhoes = await Caminhao.find()
            .skip(skip) // Pula os itens necessários para a paginação
            .limit(pageSize); // Limita o número de itens por página

        res.json({
            page,
            totalPages,
            totalItems,
            caminhoes
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar os caminhões" });
    }
});

app.delete("/caminhao/:id", async (req,res) => {
    const caminhao = await Caminhao.findByIdAndDelete(req.params.id)
    return res.send(caminhao)
})



app.listen(port, () => {
    mongoose.connect('mongodb+srv://gemtransportessite:O0Xb0p50gkSCMIyT@gembd.mc7cluc.mongodb.net/?retryWrites=true&w=majority&appName=GemBD');
    console.log('App runnig')
})

