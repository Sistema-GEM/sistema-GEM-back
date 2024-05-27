function diferenciaCaminhao(a, b) {
  const arrayA = a.caminhoes;
  const arrayB = b.caminhoes;
  const caminhoesB = new Set(arrayB);

  return arrayA.filter((caminhao) => !caminhoesB.has(caminhao));
}

module.exports = {
  diferenciaCaminhao,
};
