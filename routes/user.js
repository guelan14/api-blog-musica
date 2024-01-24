const express = require("express");
const router = express.Router();
const check = require("../middlewares/auth");
const multer = require("multer");

const UserController = require("../controllers/user");

//multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/avatars/");
  },
  filename: (req, file, cb) => {
    cb(null, "avatar-" + Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage: storage });

//Routes
router.get("/prueba", UserController.prueba);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", check.auth, UserController.profile);
router.put("/update/", check.auth, UserController.update);
router.post(
  "/upload/",
  [check.auth, uploads.single("file0")],
  UserController.upload
);
router.get("/avatar/:file", UserController.avatar);

module.exports = router;
