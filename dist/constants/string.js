"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAGE_DEFAULT = exports.PAGE_SIZE = exports.REGEX_PHONE = exports.REGEX_PASSWORD = void 0;
exports.REGEX_PASSWORD = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;
exports.REGEX_PHONE = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
exports.PAGE_SIZE = 10;
exports.PAGE_DEFAULT = 1;
