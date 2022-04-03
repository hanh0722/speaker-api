import { FIELD_FILTER } from "../constants/field";
import { UserHandler } from "../types/user";
export const getUserResponse = (user: UserHandler) => {
  try {
    const parsedUser = Object.entries(user?._doc);
    const mapData = parsedUser.reduce((acc: any, [key, value]) => {
      const dataIsNotValid = FIELD_FILTER.some((field) => field === key);
      if (!dataIsNotValid) {
        return {
          ...acc,
          [key]: value,
        };
      }
      return acc;
    }, {});
    return mapData;
  } catch (err) {
    return user;
  }
};
