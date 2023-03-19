import { STRING_SANITIZE_SPACES_REGEX } from "../localization";
import { TableDataOrganizersType } from "./../../types/global";

export const toSnakeCase = (string: string) =>
  string.trim()?.toLowerCase().replace(STRING_SANITIZE_SPACES_REGEX, "_");

export const sortByProperties = (fields: TableDataOrganizersType["sorts"]) => {
  const directions: any = [];
  let i;
  const l = fields.length;

  fields.forEach(function (field, fieldIndex) {
    directions[fieldIndex] = field.direction === "descending" ? -1 : 1;
  });

  return function (a: any, b: any) {
    for (i = 0; i < l; i++) {
      const field = fields[i];
      if (a[field.property].value > b[field.property].value)
        return directions[i];
      if (a[field.property].value < b[field.property].value)
        return -directions[i];
    }
    return 0;
  };
};
