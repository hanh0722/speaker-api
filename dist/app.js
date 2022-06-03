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
const server_1 = __importDefault(require("./config/server"));
const socket_1 = require("./config/socket");
const socket_2 = require("./middleware/socket");
const server = server_1.default.listen(9000);
(0, socket_1.init)(server);
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
server_1.default.use(express_1.default.json());
server_1.default.use(express_1.default.static(path_1.default.join(root_1.root, "static")));
server_1.default.use(express_1.default.urlencoded({ extended: false }));
server_1.default.use((0, multer_1.default)({ storage: handleStorage }).array(key_1.KEY_MULTER));
server_1.default.use(cors_1.useCors);
(0, socket_2.useSocketMiddleWare)();
(0, socket_1.getSocket)().on('connection', socket => {
});
server_1.default.use("/api/file", routes_1.fileRouter);
server_1.default.use("/api/auth", routes_1.authRouter);
server_1.default.use("/api/products", routes_1.productRouter);
server_1.default.use("/api/collections", routes_1.collectionRouter);
server_1.default.use("/api/cart", routes_1.cartRouter);
server_1.default.use("/api/country", routes_1.countryRouter);
server_1.default.use("/api/address", routes_1.addressRouter);
server_1.default.use("/api/checkout", routes_1.checkoutRouter);
server_1.default.use("/api/payment", routes_1.paymentRouter);
server_1.default.use("/api/blog", routes_1.blogRouter);
server_1.default.use('/api/chat', routes_1.chatRouter);
server_1.default.use('/api/user', routes_1.userRouter);
server_1.default.use(error_1.handleError);
mongoose_1.default
    .connect(`mongodb+srv://${process.env["MONGODB_USERNAME"]}:${process.env["MONGODB_PASSWORD"]}@cluster0.bhp9h.mongodb.net/speaker-api?retryWrites=true&w=majority`)
    .then((result) => { });
