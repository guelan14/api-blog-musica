const Artist = require("../models/artist");
const mongoosePaginate = require("mongoose-paginate-v2");
const fs = require("fs");
const path = require("path");
const Song = require("../models/song");
const Album = require("../models/album");

const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "mensaje desde artist",
  });
};

const save = (req, res) => {
  let params = req.body;
  let artist = new Artist(params);

  artist
    .save()
    .then((artistStored) => {
      return res.status(200).send({
        status: "succes",
        message: "Artista guardado",
        artistStored,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "No se ha guardado el artista",
        artist,
      });
    });
};

const one = (req, res) => {
  const artistId = req.params.id;

  Artist.findById(artistId)
    .then((artist) => {
      return res.status(200).send({
        status: "succes",
        message: "mensaje desde artist",
        artist,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "No existe artista",
      });
    });
};

const list = async (req, res) => {
  let page = 1;
  if (req.params.page) {
    page = req.params.page;
  }

  const itemsPerPage = 5;

  Artist.paginate({}, { page, limit: itemsPerPage, sort: { name: "asc" } })
    .then((result) => {
      return res.status(200).send({
        status: "success",
        message: "Mensaje desde list",
        artists: result.docs,
        total: result.totalDocs,
        pages: result.totalPages,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "Error in searching artist",
      });
    });
};

const update = (req, res) => {
  const id = req.params.id;

  const data = req.body;

  Artist.findByIdAndUpdate(id, data, { new: true })
    .then((artist) => {
      return res.status(200).send({
        status: "succes",
        artist,
      });
    })
    .catch((error) => {
      return res.status(500).send({
        status: "error",
        message: "No se pudo actualziar el artista",
      });
    });
};

const remove = async (req, res) => {
  const artistId = req.params.id;
  try {
    const artistRemoved = await Artist.findByIdAndDelete(artistId);
    const albumRemoved = await Album.find({ artist: artistId }).remove();

    
    const songRemoved = await Song.find({ album: albumRemoved._id }).remove();

    if (!artistRemoved) {
      return res.status(500).send({
        status: "error",
        message: "No se pudo eliminar el artista",
      });
    }
    return res.status(200).send({
      status: "succes",
      message: "metodo de borrado",
      artistRemoved,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Error en la db",
    });
  }
};
const upload = (req, res) => {
  let artistId = req.params.id;
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

  Artist.findOneAndUpdate(
    { _id: artistId },
    { image: req.file.filename },
    { new: true }
  )
    .then((artist) => {
      return res.status(200).send({
        status: "succes",
        artist: artist,
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
  const filePath = "./uploads/artists/" + file;

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
module.exports = { prueba, save, one, list, update, remove, upload, image };
