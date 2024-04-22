const Obra = require("../models/Obras");
const Caminhao = require("../models/Caminhao");

module.exports = {
  async create(req, res) {
    const obra = new Obra({
      ...req.body,
    });

    try {
      await obra.save();
      res.send(obra);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar a obra" });
    }
  },

  async getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const filter = { ...req.query };

    try {
      const totalItems = await Obra.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / pageSize);

      const obras = await Obra.find(filter)
        .populate('caminhoes') // Popula os caminhões referenciados
        .skip(skip)
        .limit(pageSize);

      res.json({
        page,
        totalPages,
        totalItems,
        obras,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar as obras" });
    }
  },

  async getById(req, res) {
    const obraId = req.params.id;

    try {
      const obra = await Obra.findById(obraId)
        .populate({
          path: 'caminhoes',
          model: 'Caminhao'
        }); // Popula os caminhões referenciados
      if (!obra) {
        return res.status(404).json({ error: "Obra não encontrada" });
      }
      res.json(obra);
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar a obra por ID" });
    }
  },


  async update(req, res) {
    const obraId = req.params.id;
    const updateData = req.body;

    try {
      const obra = await Obra.findByIdAndUpdate(obraId, updateData, { new: true });
      if (!obra) {
        return res.status(404).json({ error: "Obra não encontrada" });
      }
      res.json(obra);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar a obra" });
    }
  },

  async destroy(req, res) {
    try {
      const obra = await Obra.findByIdAndDelete(req.params.id);
      return res.send(obra);
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir a obra" });
    }
  },
};