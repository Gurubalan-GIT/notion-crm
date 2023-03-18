import { STRING_SANITIZE_SPACES_REGEX } from "../localization";

export const toSnakeCase = (string: string) =>
  string.trim()?.toLowerCase().replace(STRING_SANITIZE_SPACES_REGEX, "_");
