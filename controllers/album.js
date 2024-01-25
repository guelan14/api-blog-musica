const Album = require("../models/album");
const artist = require("../models/artist");
const fs = require("fs");
const path = require("path");

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

const upload = (req, res) => {
  let albumId = req.params.id;

  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "la peticion no incluye imagen",
    });
  }
  let image = req.file.originalname;
  const imageSplit = image.split(".");
  const extension = imageSplit[1];

  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "gif" &&
    extension != "jpeg"
  ) {
    const filePath = req.file.path;
    console.log(filePath);
    const fileDeleted = fs.unlinkSync(filePath);

    return res
      .status(404)
      .send({ status: "error", mesage: "la extension no es valida" });
  }

  Album.findOneAndUpdate(
    { _id: albumId },
    { image: req.file.filename },
    { new: true }
  )
    .then((album) => {
      return res.status(200).send({
        status: "succes",
        album: album,
        file: req.file,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "Error en la subida",
      });
    });
};

const image = (req, res) => {
  const file = req.params.file;
  const filePath = "./uploads/albums/" + file;

  console.log(filePath);

  fs.stat(filePath, (error, exists) => {
    if (error || !exists) {
      return res
        .status(404)
        .send({ status: "error", message: "No existe la imagen" });
    }

    return res.sendFile(path.resolve(filePath));
  });
};

module.exports = { prueba, save, one, list, upload, image };
