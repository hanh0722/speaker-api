"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserResponse = void 0;
const field_1 = require("../constants/field");
const getUserResponse = (user) => {
    try {
        const parsedUser = Object.entries(user === null || user === void 0 ? void 0 : user._doc);
        const mapData = parsedUser.reduce((acc, [key, value]) => {
            const dataIsNotValid = field_1.FIELD_FILTER.some((field) => field === key);
            if (!dataIsNotValid) {
                return Object.assign(Object.assign({}, acc), { [key]: value });
            }
            return acc;
        }, {});
        return mapData;
    }
    catch (err) {
        return user;
    }
};
exports.getUserResponse = getUserResponse;
