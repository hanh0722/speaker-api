"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const countries_1 = require("../controller/countries");
const router = (0, express_1.Router)();
router.get('/get', countries_1.onGetCountryController);
exports.default = router;
