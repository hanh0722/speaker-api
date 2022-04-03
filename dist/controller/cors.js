"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCors = void 0;
const useCors = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, OPTIONS, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
};
exports.useCors = useCors;
