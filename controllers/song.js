const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "mensaje desde song",
  });
};

module.exports = { prueba };
