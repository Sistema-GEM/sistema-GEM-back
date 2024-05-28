const Caminhao = require("../models/Caminhao");

module.exports = {
  async create(req, res) {
    const caminhao = new Caminhao({
      ...req.body,
    });

    await caminhao.save();
    res.send(caminhao);
  },

  async getAll(req, res) {
    const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
    const pageSize = parseInt(req.query.pageSize) || 15; // Tamanho da página, padrão é 10
    const skip = (page - 1) * pageSize; // Quantidade de itens para pular

    // Adiciona o filtro para o campo "proprietário"

    const query = req.query;

    if (query.page) {
      delete query.page;
    }

    if (query.pageSize) {
      delete query.pageSize;
    }

    const filter = { ...query };

    if (filter.status) {
      if (filter.status === "Alugado") {
        filter.obraAtual = { $ne: null };
      } else if (filter.status === "Diponível") {
        filter.obraAtual = null;
      }
      delete filter.status;
    }

    try {
      const totalItems = await Caminhao.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / pageSize); // Calcula o total de páginas

      const caminhoes = await Caminhao.find(filter)
        .skip(skip) // Pula os itens necessários para a paginação
        .limit(pageSize); // Limita o número de itens por página

      res.json({
        page,
        totalPages,
        totalItems,
        caminhoes,
      });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar os caminhões" });
    }
  },

  async getById(req, res) {
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
  },

  async update(req, res) {
    const caminhaoId = req.params.id;
    const updateData = req.body;

    try {
      const caminhao = await Caminhao.findByIdAndUpdate(
        caminhaoId,
        updateData,
        { new: true }
      );
      if (!caminhao) {
        return res.status(404).json({ error: "Caminhão não encontrado" });
      }
      res.json(caminhao);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar o caminhão" });
    }
  },

  async destroy(req, res) {
    try {
      const caminhao = await Caminhao.findByIdAndDelete(req.params.id);
      return res.send(caminhao);
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir o caminhão" });
    }
  },

  async truckCount(req, res) {
    try {
      const filter = req.query;

      if (filter.status) {
        if (filter.status === "Alugado") {
          filter.obraAtual = { $ne: null };
        } else if (filter.status === "Diponível") {
          filter.obraAtual = null;
        }
        delete filter.status;
      }

      const caminhoes = await Caminhao.find(filter);
      const quantidade = {
        disponiveis: 0,
        total: caminhoes.length,
        alugados: 0,
      };

      caminhoes.forEach((e) => {
        if (e.obraAtual) {
          quantidade.alugados++;
        } else {
          quantidade.disponiveis++;
        }
      });

      res.json(quantidade);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao fazer contagem" });
    }
  },

  async list(req, res) {
    try {
      const caminhoes = await Caminhao.find();
      const { fieldName } = req.query;

      const list = caminhoes
        .map((caminhao) => ({
          label: caminhao[fieldName],
          value: caminhao[fieldName],
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

      res.json(list);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao listar caminhoes" });
    }
  },
};
