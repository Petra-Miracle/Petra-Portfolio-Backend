import multer from "multer";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/") && file.mimetype !== "application/pdf") {
      cb(new Error("Only image or PDF files are allowed"));
      return;
    }
    cb(null, true);
  },
});
