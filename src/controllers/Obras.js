const Obra = require("../models/Obras");
const Caminhao = require("../models/Caminhao");

const { estados } = require("../utils/estados");
const { diferenciaCaminhao } = require("../utils/functions");

module.exports = {
  async create(req, res) {
    const { caminhoes, estado, situacao } = req.body;

    const obra = new Obra({
      ...req.body,
      estadoSigla: estados.find((e) => e.nome === estado)?.sigla,
    });

    try {
      await obra.save();
      await Promise.all(
        caminhoes.map(async (caminhaoId) => {
          const caminhao = await Caminhao.findById(caminhaoId);
          if (caminhao) {
            caminhao.obraAtual =
              situacao === "Em andamento" ? obra.descricao : null;
            await caminhao.save();
          }
        })
      );

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
    const { caminhoes, situacao, estado } = req.body;

    try {
      const obraAnterior = await Obra.findById(obraId);
      const caminhoesRemovidos = diferenciaCaminhao(obraAnterior, req.body);
      const obra = await Obra.findByIdAndUpdate(
        obraId,
        {
          ...updateData,
          estadoSigla: estados.find((state) => state.nome === estado)?.sigla,
        },
        {
          new: true,
        }
      );

      await Promise.all(
        caminhoes.map(async (caminhaoId) => {
          const caminhao = await Caminhao.findById(caminhaoId);
          if (caminhao) {
            caminhao.obraAtual =
              situacao === "Em andamento" ? obra.descricao : null;
            await caminhao.save();
          }
        })
      );

      // caso caminhao tenha sido removido da obra
      if (caminhoesRemovidos?.length) {
        await Promise.all(
          caminhoesRemovidos.map(async (caminhaoId) => {
            const caminhao = await Caminhao.findById(caminhaoId);
            if (caminhao) {
              caminhao.obraAtual = null;
              await caminhao.save();
            }
          })
        );
      }

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

  async list(req, res) {
    try {
      const obras = await Obra.find();

      const list = obras.map((obra) => ({
        label: obra.descricao,
        value: obra.descricao,
      }));

      res.json(list);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao listar obras" });
    }
  },
};
