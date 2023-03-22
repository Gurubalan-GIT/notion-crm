import { STRING_SANITIZE_SPACES_REGEX } from "../localization";

export const toSnakeCase = (string: string) =>
  string.trim()?.toLowerCase().replace(STRING_SANITIZE_SPACES_REGEX, "_");

export const isObjectEmpty = (object: object) =>
  Object.keys(object).length === 0;

export const isEmptyValue = (value: string | null | undefined) => value === "";
