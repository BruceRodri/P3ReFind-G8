const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const autenticacion = require("../middlewares/autenticacion");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) return cb(null, true);
  cb(new Error("Solo imágenes (jpeg, jpg, png, gif, webp)"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", autenticacion, (req, res) => {
  upload.single("imagen")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No se seleccionó ninguna imagen" });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });
});

module.exports = router;
