const express = require("express");
const routes = express.Router();

const UserController = require("./controllers/User");
const CaminhaoController = require("./controllers/Caminhao");
const ObraController = require("./controllers/Obras");
const UploadController = require("./controllers/Upload");
const DocumentoController = require("./controllers/Documento");

routes.post("/register", UserController.register);
routes.post("/login", UserController.login);

routes.post("/caminhao", CaminhaoController.create);
routes.get("/caminhao", CaminhaoController.getAll);
routes.get("/caminhao/quantidade", CaminhaoController.truckCount);
routes.get("/caminhao/listar", CaminhaoController.list);
routes.get("/caminhao/:id", CaminhaoController.getById);
routes.put("/caminhao/:id", CaminhaoController.update);
routes.delete("/caminhao/:id", CaminhaoController.destroy);

routes.post("/obras", ObraController.create);
routes.put("/obras/:id", ObraController.update);
routes.get("/obras", ObraController.getAll);
routes.get("/obras/listar", ObraController.list);
routes.get("/obras/:id", ObraController.getById);
routes.post(
  "/obras/verificar-status-caminhao",
  ObraController.verificarAssociacaoCaminhoes
);
routes.delete("/obras/:id", ObraController.destroy);

routes.get("/documento/", DocumentoController.getAll);
routes.post("/documento/", DocumentoController.create);
routes.delete("/documento/:id", DocumentoController.destroy);

routes.post("/upload", UploadController.upload, UploadController.uploadFile);

module.exports = routes;
