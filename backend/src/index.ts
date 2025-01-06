import express from "express";
import multer from "multer";
import cors from "cors";
import db from "./db";
import path from "path";
import { Status } from "@prisma/client";

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = file.originalname.split(".");
    cb(null, fileName[0] + "-" + uniqueSuffix + "." + fileName[1]);
  },
});

const upload = multer({ storage });
app.use(cors());

app.put("/upload", upload.single("file"), async (req, res) => {
  const { file } = req;
  if (!file) {
    res.status(400).json({ message: "Upload failed" });
    return;
  }
  const newUpload = await db.upload.create({
    data: {
      uploadUrl: path.join(__dirname, "uploads", file?.filename),
    },
  });
  res.json({ message: "Upload successful", uploadId: newUpload.id });
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const uploadFromDb = await db.upload.findFirst({
    where: { id },
  });

  if (!uploadFromDb) {
    res.status(404).json({ message: "File not found" });
    return;
  }

  res.json({
    status: uploadFromDb.status.toString(),
  });
});

app.listen(3000, () => {
  console.log("Server is listening at port: 3000");
});
