const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/app-musica");
    console.log("conectado corectamente a la db");
  } catch (error) {
    throw new Error("no se conecto correctamente a la db");
  }
};

module.exports = connection;
