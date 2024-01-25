const express = require("express");
const router = express.Router();

const SongController = require("../controllers/song");
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

router.get("/prueba", SongController.prueba);
router.post("/save", check.auth, SongController.save);
router.get("/one/:id", check.auth, SongController.one);
router.get("/list/:albumId", check.auth, SongController.list);
router.delete("/remove/:id", check.auth, SongController.remove);
router.post(
  "/upload/:id",
  [check.auth, uploads.single("file0")],
  SongController.upload
);
router.get("/audio/:file", SongController.audio);

module.exports = router;
