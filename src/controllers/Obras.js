const Obra = require("../models/Obras");
const Caminhao = require("../models/Caminhao");

const { estados } = require("../utils/estados");

module.exports = {
  async create(req, res) {
    const obra = new Obra({
      ...req.body,
      estadoSigla: estados.find((e) => e.nome === req.body.estado)?.sigla,
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

    const query = req.query;

    if (query.page) {
      delete query.page;
    }

    if (query.pageSize) {
      delete query.pageSize;
    }

    const filter = { ...query };

    try {
      const totalItems = await Obra.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / pageSize);

      const obras = await Obra.find(filter)
        .populate("caminhoes") // Popula os caminhões referenciados
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
      const obra = await Obra.findById(obraId).populate({
        path: "caminhoes",
        model: "Caminhao",
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
      const obra = await Obra.findByIdAndUpdate(obraId, updateData, {
        new: true,
      });
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

  async verificarAssociacaoCaminhoes(req, res) {
    const { idCaminhao } = req.body;

    try {
      const obra = await Obra.findOne({
        caminhoes: idCaminhao,
        situacao: "Em andamento",
      }).populate("caminhoes");

      if (!obra) {
        res.json({ associado: false });
      } else {
        const caminhoesAssociados = obra.caminhoes.filter(
          (caminhao) => caminhao.toString() === idCaminhao
        );

        res.json({
          associado: true,
          obra: obra._id,
          descricao: obra.descricao,
          estadoSigla: obra.estadoSigla,
          cidade: obra.cidade,
          caminhoes: caminhoesAssociados,
        });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "Erro ao verificar associação de caminhões" });
    }
  },
};
