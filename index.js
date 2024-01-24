const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");
//conexion base de datos
connection();

const app = express();
const port = 3900;

app.use(cors());

//convertir datos a json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
const UserRoutes = require("./routes/user");
const ArtistRoutes = require("./routes/artist");
const AlbumRoutes = require("./routes/album");
const SongRoutes = require("./routes/song");

app.use("/api/user", UserRoutes);
app.use("/api/album", AlbumRoutes);
app.use("/api/song", SongRoutes);
app.use("/api/artist", ArtistRoutes);

app.get("/ruta-probando", (req, res) => {
  return res.status(200).send({ message: "funcionando correctamente" });
});

app.listen(port, () => {
  console.log("Servidor escuchando puerto:", port);
});
