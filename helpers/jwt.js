const jwt = require("jwt-simple");
const moment = require("moment");

const secret = "CLAVE_SECRETA_de_mi_proyecto_89898891231231";

const createToken = (user) => {
  const payload = {
    id: user._id,
    name: user.name,
    surname: user.surname,
    nick: user.nick,
    email: user.email,
    role: user.rol,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, "days").unix(),
  };

  return jwt.encode(payload, secret);
};



module.exports = {
  secret,
  createToken,
};
