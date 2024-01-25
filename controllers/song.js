const Song = require("../models/song");
const fs = require("fs");
const path = require("path");

const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "mensaje desde song",
  });
};

const save = (req, res) => {
  let params = req.body;
  let song = new Song(params);

  song
    .save()
    .then((songStored) => {
      return res.status(200).send({
        status: "succes",
        message: "mensaje desde song",
        songStored,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "error al guardar cancion",
        songStored,
      });
    });
};

module.exports = { prueba, save };
