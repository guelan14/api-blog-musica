const Album = require("../models/album");
const artist = require("../models/artist");
const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "mensaje desde album",
  });
};

const save = (req, res) => {
  let params = req.body;
  let album = new Album(params);
  album
    .save()
    .then((albumStored) => {
      return res.status(200).send({
        status: "succes",
        message: "mensaje desde album",
        album,
      });
    })
    .catch((error) => {
      return res.status(200).send({
        status: "error",
        message: "error al guardar los datos",
      });
    });
};

const one = (req, res) => {
  const albumId = req.params.id;
  Album.findById(albumId)
    .populate({ path: "artist" })
    .then((album) => {
      return res.status(200).send({
        status: "succes",
        message: "mensaje desde album",
        album,
      });
    })
    .catch((error) => {
      return res.status(200).send({
        status: "error",
        message: "No se pudo buscar el album",
      });
    });
};

const list = (req, res) => {
  const artistId = req.params.artistId;
  if (!artistId) {
    return res.status(200).send({
      status: "error",
      message: "No se recibio ningun artista",
    });
  }

  Album.findById({ artist: artistId })
    .populate("artist")
    .then((albums) => {
      return res.status(200).send({
        status: "succes",
        message: "mensaje desde album",
        albums,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "No se pudo buscar el album",
      });
    });
};

module.exports = { prueba, save, one, list };
