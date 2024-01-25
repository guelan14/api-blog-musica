const express = require("express");
const router = express.Router();

const SongController = require("../controllers/song");
const check = require("../middlewares/auth");

router.get("/prueba", SongController.prueba);
router.post("/save", check.auth, SongController.save);

module.exports = router;
