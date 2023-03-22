import isBefore from "date-fns/isBefore";
import isEqual from "date-fns/isEqual";
import { CustomPageObjectResponse } from "./../../types/global";
export const filterOptionsHashMap = {
  field: ["Management", "Development", "SEO", "Design", "CTO"],
};

export const filterActions = {
  DELETE: "delete",
  UPDATE: "update",
  ADD: "add",
  UPDATE_COMPOUND_FILTER: "update_compound_filter",
};

export const filterConditionsActionHashMap: any = {
  checkbox: {
    equals: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      filters?.checkbox?.equals === databaseProperty.actualValue,
    does_not_equal: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) => filters?.checkbox?.does_not_equal !== databaseProperty.actualValue,
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
      databaseProperty.actualValue === filters?.title.equals,
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
  date: {
    on_or_before: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) => {
      const date = new Date(filters.date?.on_or_before);
      return (
        isBefore(databaseProperty.actualValue, date) ||
        isEqual(databaseProperty.actualValue, date)
      );
    },
  },
  number: {
    does_not_equal: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) => filters?.number?.does_not_equal !== databaseProperty.actualValue,
  },
  rich_text: {
    equals: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue === filters?.rich_text.equals,
  },
  multi_select: {
    contains: (filters: any, databaseProperty: CustomPageObjectResponse) => {
      if (filters?.multi_select?.contains === "") return true;
      const multiSelectFilters = filters?.multi_select?.contains
        .replace(/\s/g, "")
        .split(",");
      return multiSelectFilters.every((filter: any) =>
        databaseProperty.actualValue.includes(filter)
      );
    },
  },
};
