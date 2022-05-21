"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRegexFindObject = exports.generateSortObject = void 0;
const generateSortObject = (key, sort) => {
    return key && sort ? {
        [key]: sort
    } : {};
};
exports.generateSortObject = generateSortObject;
const generateRegexFindObject = (key, value) => {
    if (key && value) {
        return {
            [key]: {
                $regex: value.trim(),
                $options: 'i'
            }
        };
    }
    return {};
};
exports.generateRegexFindObject = generateRegexFindObject;
