import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cloudinary from "cloudinary";
import path from "path";
import { KEY_MULTER } from "./constants/key";
import { useCors } from "./controller/cors";
import {
  authRouter,
  fileRouter,
  productRouter,
  collectionRouter,
  cartRouter,
  countryRouter,
  addressRouter,
  checkoutRouter,
  paymentRouter,
  blogRouter,
} from "./routes";
import { root } from "./utils/root";
import { randomNumber } from "./utils/string";
import { handleError } from "./controller/error";
import app from "./config/server";
import { init } from "./config/socket";

const handleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "upload"));
  },
  filename: (req, file, cb) => {
    randomNumber((random) => {
      cb(null, random + "-" + (file.filename || file.originalname));
    });
  },
});

cloudinary.v2.config({
  cloud_name: process.env["CLOUD_NAME"],
  api_key: process.env["CLOUDINARY_KEY"],
  api_secret: process.env["CLOUDINARY_KEY_SECRET"],
  secure: true,
});

app.use(express.json());
app.use(express.static(path.join(root, "static")));
app.use(express.urlencoded({ extended: false }));

app.use(multer({ storage: handleStorage }).array(KEY_MULTER));
app.use(useCors);
app.use("/api/file", fileRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/collections", collectionRouter);
app.use("/api/cart", cartRouter);
app.use("/api/country", countryRouter);
app.use("/api/address", addressRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/blog", blogRouter);

app.use(handleError);
mongoose
  .connect(
    `mongodb+srv://${process.env["MONGODB_USERNAME"]}:${process.env["MONGODB_PASSWORD"]}@cluster0.bhp9h.mongodb.net/speaker-api?retryWrites=true&w=majority`
  )
  .then((result) => {
    const server = app.listen(9000);
    init(server);
  });
