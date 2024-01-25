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

const list = (req, res) => {
  let albumId = req.params.albumId;
  Song.find({ album: albumId })
    .sort("track")
    .then((song) => {
      return res.status(200).send({
        status: "succes",
        message: "mensaje desde song",
      });
    });

  return res.status(500).send({
    status: "error",
    message: "error al guardar cancion",
  });
};

const remove = (req, res) => {
  const songId = req.params.id;
  Song.findByIdAndRemove(songId)
    .then((songRemoved) => {
      return res.status(200).send({
        status: "succes",
        message: "mensaje desde song",
        songRemoved,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "error al guardar cancion",
      });
    });
};

const upload = (req, res) => {
  let songId = req.params.id;

  if (!req.file) {
    return res.status(404).send({
      status: "error",
      message: "la peticion no incluye imagen",
    });
  }
  let image = req.file.originalname;
  const imageSplit = image.split(".");
  const extension = imageSplit[1];

  if (extension != "mp3" && extension != "ogg") {
    const filePath = req.file.path;
    console.log(filePath);
    const fileDeleted = fs.unlinkSync(filePath);

    return res
      .status(404)
      .send({ status: "error", mesage: "la extension no es valida" });
  }

  Song.findOneAndUpdate(
    { _id: songId },
    { image: req.file.filename },
    { new: true }
  )
    .then((songUpdated) => {
      return res.status(200).send({
        status: "succes",
        song: songUpdated,
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

const audio = (req, res) => {
  const file = req.params.file;
  const filePath = "./uploads/songs/" + file;

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

module.exports = { prueba, save, list, remove, upload, audio };
