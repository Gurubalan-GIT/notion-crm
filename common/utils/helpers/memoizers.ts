import { DataSourceType } from "@common/types/global";
import {
  CustomPageObjectResponse,
  TableDataOrganizersType,
} from "./../../types/global";
import { filterConditionsActionHashMap } from "./hashmaps";

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

export const filterByProperties = (data: DataSourceType, filters: any) => {
  if (filters?.and) {
    return filters.and.every((filter: any) => filterByProperties(data, filter));
  }

  if (filters?.or) {
    return filters.or.some((filter: any) => filterByProperties(data, filter));
  }

  if (filters?.property) {
    const { property } = filters;
    const databaseProperty: CustomPageObjectResponse = data[
      property
    ] as CustomPageObjectResponse;

    if (filterConditionsActionHashMap.hasOwnProperty(databaseProperty.type)) {
      const filterConditionKeys = Object.keys(filters[databaseProperty.type]);
      if (!!filterConditionKeys.length) {
        return filterConditionsActionHashMap[databaseProperty.type][
          filterConditionKeys[0]
        ](filters, databaseProperty);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  return false;
};
