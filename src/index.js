const express = require("express");
const { ServerMonitoringMode } = require("mongodb");
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const fs = require('fs');
const { google } = require('googleapis');
const google_api_pasta = '1VGBwa7Nz3QavrXZzXHp9g5auDveVUwmw';

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    app.use(cors());
    next();
});

const port = 3000

const User = mongoose.model('User', {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
  // Rota de registro de usuário
  app.post('/register', async (req, res) => {
    try {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({ message: 'Nome de usuário já está em uso' });
      }
  
      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
      });
  
      await newUser.save();
      res.status(200).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
  
      const validPassword = (req.body.password === user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      res.status(200).json({ message: 'Usuário logado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
  });
  

const Caminhao = mongoose.model('Caminhao', {
    obraAtual: String,
    numeroFrota: String,
    proprietario: String,
    placa: String,
    ano: String,
    marca: String,
    modelo: String,
    chassi: String,
    renavam: String,
    crv: String,
    cnpj: String,
    km: String,
    horimetro: String,
    data: String,
    manutencaoPreventiva: {
        descricao: String,
        data: String,
        km: String,
        horimetro: String,
        responsavel: String,
        local: String,
        observacao: String,
        oleoMotor: String,
        oleoCaixa: String,
        oleoDiferenciais: String,
        oleoCubos: String,
        filtroOleoMotor: String,
        filtroDiesel: String,
        filtroRacol: String,
        filtroAr: String,
        filtroValvulaApu: String,
        documentos: [{
            url: String,
            data: String,
            titulo: String
        }]
    },
    manutencaoCorretiva: {
        data: String,
        km: String,
        horimetro: String,
        grupoServico: String,
        descricao: String,
        fornecedorPeca: String,
        valorPeca: String,
        fornecedorMaoDeObra: String,
        valorMaoDeObra: String,
        responsavel: String,
        local: String,
        observacao: String,
        documentos: [{
            url: String,
            data: String,
            titulo: String
        }]
    },
    protecaoCasco: String,
    seguradoraCasco: String,
    dataRenovacaoCasco: String,
    titularApoliceCasco: String,
    protecaoContraTerceiros: String,
    seguradoraContraTerceiros: String,
    dataRenovacaoContraTerceiros: String,
    titularApoliceContraTerceiros: String,
    protecaoImplemento: String,
    seguradoraImplemento: String,
    dataRenovacaoImplemento: String,
    titularApoliceImplemento: String,
    documentos: [{
        url: String,
        data: String,
        titulo: String
    }]

});

app.post("/caminhao", async (req, res) => {
    const caminhao = new Caminhao({
        ...req.body
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

app.get("/caminhao/:id", async (req, res) => {
    const caminhaoId = req.params.id;

    try {
        const caminhao = await Caminhao.findById(caminhaoId);
        if (!caminhao) {
            return res.status(404).json({ error: "Caminhão não encontrado" });
        }
        res.json(caminhao);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar o caminhão por ID" });
    }
});

app.put("/caminhao/:id", async (req, res) => {
    const caminhaoId = req.params.id;
    const updateData = req.body;

    try {
        const caminhao = await Caminhao.findByIdAndUpdate(caminhaoId, updateData, { new: true });
        if (!caminhao) {
            return res.status(404).json({ error: "Caminhão não encontrado" });
        }
        res.json(caminhao);
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o caminhão" });
    }
});

app.delete("/caminhao/:id", async (req, res) => {
    const caminhao = await Caminhao.findByIdAndDelete(req.params.id)
    return res.send(caminhao)
})


app.listen(port, () => {
    mongoose.connect('mongodb+srv://gemtransportessite:O0Xb0p50gkSCMIyT@gembd.mc7cluc.mongodb.net/?retryWrites=true&w=majority&appName=GemBD');
    console.log('App runnig')
})




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        cb(null, timestamp + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './googledrive.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        });
        const driveService = google.drive({
            version: 'v3',
            auth
        });

        const fileMetaData = {
            'name': req.file.originalname,
            'parents': [google_api_pasta]
        };

        const media = {
            mimeType: req.file.mimetype,
            body: fs.createReadStream(req.file.path)
        };

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        });

        const fileId = response.data.id;
        const link = await getFileLink(fileId);
        res.json({ fileId: fileId, link: link });
        // Excluir o arquivo após o processo de envio para o Google Drive
        fs.unlink(req.file.path, (err) => {
        });
    } catch (err) {
        console.log('Erro ao enviar o arquivo:', err);
        res.status(500).json({ error: 'Erro ao enviar o arquivo' });
    }
});

// Função para obter o link do arquivo no Google Drive
async function getFileLink(fileId) {
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: './googledrive.json',
            scopes: ['https://www.googleapis.com/auth/drive.readonly']
        });
        const driveService = google.drive({
            version: 'v3',
            auth
        });

        const response = await driveService.files.get({
            fileId: fileId,
            fields: 'webViewLink'
        });

        return response.data.webViewLink;
    } catch (err) {
        console.log('Erro ao recuperar o link do arquivo:', err);
        throw err;
    }
}