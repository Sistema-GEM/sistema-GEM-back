const User = require("../models/User");

module.exports = {
  async register(req, res) {
    try {
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Nome de usuário já está em uso" });
      }

      const newUser = new User({
        username: req.body.username,
        password: req.body.password,
      });

      await newUser.save();
      res.status(200).json({ message: "Usuário registrado com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao registrar usuário", error: error.message });
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const validPassword = req.body.password === user.password;

      if (!validPassword) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      res.status(200).json({ message: "Usuário logado com sucesso" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao fazer login", error: error.message });
    }
  },
};
