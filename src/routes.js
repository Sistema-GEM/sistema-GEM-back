const express = require("express");
const routes = express.Router();

const UserController = require("./controllers/User");
const CaminhaoController = require("./controllers/Caminhao");
const ObraController = require("./controllers/Obras");
const UploadController = require("./controllers/Upload");

routes.post("/register", UserController.register);
routes.post("/login", UserController.login);

routes.post("/caminhao", CaminhaoController.create);
routes.get("/caminhao", CaminhaoController.getAll);
routes.get("/caminhao/:id", CaminhaoController.getById);
routes.put("/caminhao/:id", CaminhaoController.update);
routes.delete("/caminhao/:id", CaminhaoController.destroy);


routes.post("/obras", ObraController.create);
routes.get("/obras", ObraController.getAll);
routes.get("/obras/:id", ObraController.getById);

routes.post("/upload", UploadController.upload, UploadController.uploadFile);

module.exports = routes;
