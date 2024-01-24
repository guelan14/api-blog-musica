const express = require("express");
const router = express.Router();
const check = require("../middlewares/auth");
const multer = require("multer");

//multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/artists/");
  },
  filename: (req, file, cb) => {
    cb(null, "artists-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage: storage });

const ArtistController = require("../controllers/artist");

router.get("/prueba", ArtistController.prueba);
router.post("/save", check.auth, ArtistController.save);
router.get("/one/:id", check.auth, ArtistController.one);
router.get("/list/:page?", check.auth, ArtistController.list);
router.put("/update/:id", check.auth, ArtistController.update);
router.delete("/remove/:id", check.auth, ArtistController.remove);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")],
  ArtistController.upload
);
router.get("/avatar/:file", ArtistController.image);

module.exports = router;
