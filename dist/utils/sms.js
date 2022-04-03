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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const twilio_1 = require("twilio");
const client = new twilio_1.Twilio(process.env["TWILIO_SID"], process.env["TWILIO_AUTH_TOKEN"]);
const sendSMS = (configMessage) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.messages.create({
            body: configMessage.body,
            to: configMessage.to,
            from: process.env["TWILIO_NUMBER"],
        });
        return response;
    }
    catch (err) {
        console.log(err);
    }
});
exports.sendSMS = sendSMS;
