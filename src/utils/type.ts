export const isArray = <T>(value: any): value is Array<T> => {
  return value instanceof Array;
}