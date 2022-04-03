import crypto from "crypto";
import parsePhoneNumber, { CountryCode } from "libphonenumber-js";
import { REGEX_PHONE } from "../constants/string";
export const randomNumber = (cb: (value: string | null) => void) => {
  return crypto.randomBytes(16, (err, buffer) => {
    if (err) {
      console.log(err);
      cb(null);
    }
    cb(buffer.toString("hex"));
  });
};

export const isEmail = (value: string) =>
  value.trim().length > 0 && value.includes("@");

export const isMobilePhone = (value: string) =>
  value.trim().length > 0 && REGEX_PHONE.test(value);

export const randomNumberByRange = (start: number, finish: number) => {
  return Math.floor(start + (finish - start) * Math.random());
};

export const convertNormalPhoneToCountryCode = (
  phone: string,
  defaultCountry?: CountryCode
) => {
  const transform = parsePhoneNumber(phone, defaultCountry || "VN");
  return transform?.number;
};
export const getToken = (header?: string) => {
  try {
    if (!header) {
      return null;
    }
    return header.split("Bearer ")[1];
  } catch (err) {
    return null;
  }
};
