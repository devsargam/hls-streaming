"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "..", "/uploads"));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = file.originalname.split(".");
        cb(null, fileName[0] + "-" + uniqueSuffix + fileName[1]);
    },
});
const upload = (0, multer_1.default)({ storage });
app.use((0, cors_1.default)());
app.put("/upload", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file } = req;
    if (!file) {
        res.status(400).json({ message: "Upload failed" });
        return;
    }
    const newUpload = yield db_1.default.upload.create({
        data: {
            uploadUrl: path_1.default.join(__dirname, "uploads", file === null || file === void 0 ? void 0 : file.filename),
        },
    });
    res.json({ message: "Upload successful", uploadId: newUpload.id });
}));
app.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const uploadFromDb = yield db_1.default.upload.findFirst({
        where: { id },
    });
    if (!uploadFromDb) {
        res.status(404).json({ message: "File not found" });
        return;
    }
    res.json({
        status: uploadFromDb.status.toString(),
    });
}));
app.listen(3000, () => {
    console.log("Server is listening at port: 3000");
});
