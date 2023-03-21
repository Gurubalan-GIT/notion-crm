import { DataSourceType } from "@common/types/global";
import isBefore from "date-fns/isBefore";
import isEqual from "date-fns/isEqual";
import {
  CustomPageObjectResponse,
  TableDataOrganizersType,
} from "./../../types/global";

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

export const filterOptionsHashMap: any = {
  checkbox: {
    equals: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      filters?.checkbox?.equals === databaseProperty.actualValue,
  },
  select: {
    contains: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue.includes(filters?.select.contains),
  },
  status: {
    contains: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue.includes(filters?.status.contains),
  },
  title: {
    contains: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue.includes(filters?.title.contains),
    equals: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue === filters?.title.contains,
  },
  last_edited_time: {
    on_or_before: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) => {
      const date = new Date(filters.last_edited_time?.on_or_before);
      return (
        isBefore(databaseProperty.actualValue, date) ||
        isEqual(databaseProperty.actualValue, date)
      );
    },
  },
};

// NOTE: Cognitive complexity is high here
export const filterByProperties = (
  data: DataSourceType,
  filters: any
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
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

    if (filterOptionsHashMap.hasOwnProperty(databaseProperty.type)) {
      const filterConditionKeys = Object.keys(filters[databaseProperty.type]);
      if (!!filterConditionKeys.length) {
        return filterOptionsHashMap[databaseProperty.type][
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
