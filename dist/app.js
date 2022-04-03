"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const path_1 = __importDefault(require("path"));
const key_1 = require("./constants/key");
const cors_1 = require("./controller/cors");
const routes_1 = require("./routes");
const root_1 = require("./utils/root");
const string_1 = require("./utils/string");
const error_1 = require("./controller/error");
const app = (0, express_1.default)();
const handleStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "upload"));
    },
    filename: (req, file, cb) => {
        (0, string_1.randomNumber)((random) => {
            cb(null, random + "-" + (file.filename || file.originalname));
        });
    },
});
cloudinary_1.default.v2.config({
    cloud_name: process.env["CLOUD_NAME"],
    api_key: process.env["CLOUDINARY_KEY"],
    api_secret: process.env["CLOUDINARY_KEY_SECRET"],
    secure: true,
});
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(root_1.root, "static")));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, multer_1.default)({ storage: handleStorage }).array(key_1.KEY_MULTER));
app.use(cors_1.useCors);
app.use("/api/file", routes_1.fileRouter);
app.use('/api/auth', routes_1.authRouter);
app.use('/api/products', routes_1.productRouter);
app.use(error_1.handleError);
mongoose_1.default
    .connect(`mongodb+srv://${process.env["MONGODB_USERNAME"]}:${process.env["MONGODB_PASSWORD"]}@cluster0.bhp9h.mongodb.net/speaker-api?retryWrites=true&w=majority`)
    .then((result) => {
    app.listen(9000);
});
