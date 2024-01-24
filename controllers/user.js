const validate = require("../helpers/validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");
const path = require("path");
const fs = require("fs");
const { fileURLToPath } = require("url");

const prueba = (req, res) => {
  return res.status(200).send({
    status: "succes",
    message: "mensaje desde user",
  });
};

const register = async (req, res) => {
  let params = req.body;

  if (!params.email || !params.name || !params.nick || !params.password) {
    return res.status(404).send({
      status: "error",
      message: "faltaN datos para enviar",
    });
  }

  try {
    validate(params);

    const users = await User.find({
      $or: [
        { email: params.email.toLowerCase() },
        { nick: params.nick.toLowerCase() },
      ],
    }).exec();
    if (users && users.length >= 1) {
      return res.status(500).send({
        status: "error",
        message: "Usuarios duplicados",
      });
    }

    let pwd = await bcrypt.hash(params.password, 10);
    params.password = pwd;

    //Creamos oibjeto usuario
    let userToSave = new User(params);

    //Guardado en al db
    userToSave
      .save()
      .then((userStored) => {
        let userCreated = userStored.toObject();
        delete userCreated.password;
        delete userCreated.role;

        return res.status(200).send({
          message: "registrado al usuario con exito",
          user: userCreated,
        });
      })
      .catch((error) => {
        return res.status(500).send({
          status: "error",
          message: "Error al guardar en db",
        });
      });
  } catch (error) {
    return res.status(400).send({
      status: "error",
      message: "Error al crear el usuario, validacion no valida",
    });
  }
};

const login = (req, res) => {
  const params = req.body;
  if (!params.email || !params.password) {
    return res.status(400).send({
      status: "error",
      message: "Faltan datos por enviar",
    });
  }
  User.findOne({ email: params.email })
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          Status: "Error",
          message: "Usuario no encontrado",
        });
      }

      const pwd = bcrypt.compareSync(params.password, user.password);
      if (!pwd) {
        return res.status(404).send({
          Status: "Error",
          message: "password incorrecta",
        });
      }
      let userIdentity = user.toObject();
      delete userIdentity.password;

      const token = jwt.createToken(user);

      return res.status(200).send({
        Status: "Succes",
        message: "login succesful",
        user: userIdentity,
        token,
      });
    })
    .catch((error) => {
      return res.status(400).send({
        status: "error",
        message: "Error al logearse, usuario no encontrado",
      });
    });
};

const profile = (req, res) => {
  const id = req.params.id;

  User.findById(id)
    .exec()
    .then((user) => {
      let userIdentity = user.toObject();
      delete userIdentity.password;
      delete userIdentity.role;
      return res.status(200).send({
        status: "succes",
        message: "resultados del perfil",
        userIdentity,
      });
    })
    .catch((error) => {
      return res.status(404).send({
        status: "error",
        message: "El usuario no existe",
      });
    });
};

const update = async (req, res) => {
  let userIdentity = req.user;
  let userToUpdate = req.body;
  console.log(userIdentity, userToUpdate);
  //bandera para saber si el usuario existe y no soy yo
  let userIsset = false;

  const users = await User.find({
    $or: [
      { email: userToUpdate.email.toLowerCase() },
      { nick: userToUpdate.nick.toLowerCase() },
    ],
  });

  users.forEach((user) => {
    if (user && user._id != userIdentity.id) userIsset = true;
  });

  if (userIsset) {
    return res.status(200).send({
      status: "error",
      message: "El usuario ya existe",
    });
  }

  if (userToUpdate.password) {
    let pwd = await bcrypt.hash(userToUpdate.password, 10);
    userToUpdate.password = pwd;
  } else {
    delete userToUpdate.password;
  }

  try {
    let userUpdated = await User.findByIdAndUpdate(
      { _id: userIdentity.id },
      userToUpdate,
      { new: true }
    );

    if (!userUpdated) {
      return res.status(404).send({
        status: "error",
        message: "Error al actualizar",
      });
    }
    return res.status(200).send({
      status: "succes",
      user: userUpdated,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Usuario no valido",
    });
  }
};

const upload = (req, res) => {
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

  User.findOneAndUpdate(
    { _id: req.user.id },
    { image: req.file.filename },
    { new: true }
  )
    .then((user) => {
      return res.status(200).send({
        status: "succes",
        user: user,
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

const avatar = (req, res) => {
  const file = req.params.file;
  const filePath = "./uploads/avatars/" + file;
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
module.exports = { prueba, register, login, profile, update, upload, avatar };
