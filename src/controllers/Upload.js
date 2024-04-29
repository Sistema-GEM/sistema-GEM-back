const fs = require("fs");
const multer = require("multer");
const { google } = require("googleapis");

const google_api_pasta = process.env.GOOGLE_DRIVE_API_KEY;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    cb(null, timestamp + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

async function uploadFile(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./googledrive.json",
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const driveService = google.drive({
      version: "v3",
      auth,
    });

    const fileMetaData = {
      name: req.file.originalname,
      parents: [google_api_pasta],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const response = await driveService.files.create({
      resource: fileMetaData,
      media: media,
      fields: "id",
    });

    const fileId = response.data.id;
    const link = await getFileLink(fileId);
    res.json({ fileId: fileId, link: link });
    // Excluir o arquivo após o processo de envio para o Google Drive
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Erro ao excluir o arquivo:", err);
      }
    });
  } catch (err) {
    console.error("Erro ao enviar o arquivo:", err);
    res.status(500).json({ error: "Erro ao enviar o arquivo" });
  }
}

async function getFileLink(fileId) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "./googledrive.json",
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    const driveService = google.drive({
      version: "v3",
      auth,
    });

    const response = await driveService.files.get({
      fileId: fileId,
      fields: "webViewLink",
    });

    return response.data.webViewLink;
  } catch (err) {
    console.error("Erro ao recuperar o link do arquivo:", err);
    throw err;
  }
}

module.exports = {
  upload: upload.single("file"),
  uploadFile,
  getFileLink,
};
