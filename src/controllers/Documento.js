const Documento = require("../models/Documento");

module.exports = {
  async create(req, res) {
    const doc = new Documento(req.body);

    try {
      await doc.save();

      res.send(doc);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar a documento" });
    }
  },

  async getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 100;
    const skip = (page - 1) * pageSize;

    const query = req.query;

    if (query.page) {
      delete query.page;
    }

    if (query.pageSize) {
      delete query.pageSize;
    }

    const filter = { ...query };

    try {
      const totalItems = await Documento.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / pageSize);

      const documentos = await Documento.find(filter)
        .skip(skip)
        .limit(pageSize);

      res.json({
        page,
        totalPages,
        totalItems,
        documentos,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar os docs" });
    }
  },

  async destroy(req, res) {
    try {
      const doc = await Documento.findByIdAndDelete(req.params.id);
      return res.send(doc);
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir a doc" });
    }
  },
};
