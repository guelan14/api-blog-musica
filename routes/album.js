const express = require("express");
const router = express.Router();
const multer = require("multer");

const check = require("../middlewares/auth");
//multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/albums/");
  },
  filename: (req, file, cb) => {
    cb(null, "album-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage: storage });

const AlbumController = require("../controllers/album");

router.get("/prueba", AlbumController.prueba);
router.post("/save", check.auth, AlbumController.save);
router.get("/one/:id", check.auth, AlbumController.one);
router.get("/list/:artistId", check.auth, AlbumController.list);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")],
  AlbumController.upload
);
router.get("/avatar/:file", AlbumController.image);

module.exports = router;
