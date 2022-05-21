import { SortBaseProps } from "../types/base";

export const generateSortObject = (key?: string, sort?: SortBaseProps) => {
  return key && sort ? {
    [key]: sort
  } : {}
};

export const generateRegexFindObject = (key?: string, value?: string) => {
  if (key && value) {
    return {
      [key]: {
        $regex: value.trim(),
        $options: 'i'
      }
    }
  }
  return {}
}