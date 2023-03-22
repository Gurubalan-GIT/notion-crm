import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import isEqual from "date-fns/isEqual";
import { EMPTY_VALUE } from "../localization";
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

export const filterConditionActions = {
  is_empty: (databaseProperty: CustomPageObjectResponse) =>
    databaseProperty.actualValue === EMPTY_VALUE,
  is_not_empty: (databaseProperty: CustomPageObjectResponse) =>
    databaseProperty.actualValue !== EMPTY_VALUE,
};

const getDateFilterConditionActions = (property: string) => {
  return {
    is_empty: (_: any, databaseProperty: CustomPageObjectResponse) => {
      return databaseProperty?.actualValue === null;
    },
    is_not_empty: (_: any, databaseProperty: CustomPageObjectResponse) => {
      return databaseProperty?.actualValue !== null;
    },
    equals: (filters: any, databaseProperty: CustomPageObjectResponse) => {
      const date = new Date(filters[property]?.equals);
      return isEqual(databaseProperty.actualValue, date);
    },
    on_or_before: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) => {
      const date = new Date(filters[property]?.on_or_before);
      return (
        isBefore(databaseProperty.actualValue, date) ||
        isEqual(databaseProperty.actualValue, date)
      );
    },
    on_or_after: (filters: any, databaseProperty: CustomPageObjectResponse) => {
      const date = new Date(filters[property]?.on_or_after);
      return (
        isAfter(databaseProperty.actualValue, date) ||
        isEqual(databaseProperty.actualValue, date)
      );
    },
    after: (filters: any, databaseProperty: CustomPageObjectResponse) => {
      const date = new Date(filters[property]?.after);
      return isAfter(databaseProperty.actualValue, date);
    },

    before: (filters: any, databaseProperty: CustomPageObjectResponse) => {
      const date = new Date(filters[property]?.before);
      return isBefore(databaseProperty.actualValue, date);
    },
  };
};

const getTextFilterConditionActions = (property: string) => {
  return {
    contains: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue.includes(filters?.[property].contains),
    does_not_contain: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) =>
      !databaseProperty.actualValue.includes(
        filters?.[property].does_not_contain
      ),
    equals: (filters: any, databaseProperty: CustomPageObjectResponse) => {
      if (filters?.[property].equals === EMPTY_VALUE) return true;
      return databaseProperty.actualValue === filters?.[property].equals;
    },
    ends_with: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue.endsWith(filters?.[property].ends_with),
    starts_with: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue.startsWith(filters?.[property].starts_with),
    is_empty: (_: any, databaseProperty: CustomPageObjectResponse) =>
      filterConditionActions.is_empty(databaseProperty),
    is_not_empty: (_: any, databaseProperty: CustomPageObjectResponse) =>
      filterConditionActions.is_not_empty(databaseProperty),
  };
};

// TODO: Make use of negations better for already written functions / logics

export const filterConditionsActionHashMap: any = {
  checkbox: {
    equals: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      filters?.checkbox?.equals === databaseProperty.actualValue,
    does_not_equal: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) => filters?.checkbox?.does_not_equal !== databaseProperty.actualValue,
    is_not_empty: (_: any, databaseProperty: CustomPageObjectResponse) =>
      filterConditionActions.is_not_empty(databaseProperty),
    is_empty: (_: any, databaseProperty: CustomPageObjectResponse) =>
      filterConditionActions.is_empty(databaseProperty),
  },
  select: getTextFilterConditionActions("select"),
  status: getTextFilterConditionActions("status"),
  title: getTextFilterConditionActions("title"),
  last_edited_time: getDateFilterConditionActions("last_edited_time"),
  date: getDateFilterConditionActions("date"),
  number: {
    is_not_empty: (_: any, databaseProperty: CustomPageObjectResponse) =>
      filterConditionActions.is_not_empty(databaseProperty),
    is_empty: (_: any, databaseProperty: CustomPageObjectResponse) =>
      filterConditionActions.is_empty(databaseProperty),
    equals: (filters: any, databaseProperty: CustomPageObjectResponse) => {
      if (filters?.number.equals === EMPTY_VALUE) return true;
      return databaseProperty.actualValue === filters?.number.equals;
    },
    does_not_equal: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) => filters?.number?.does_not_equal !== databaseProperty.actualValue,
    greater_than: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue > filters?.number?.greater_than,
    greater_than_or_equal_to: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) =>
      databaseProperty.actualValue >= filters?.number?.greater_than_or_equal_to,
    less_than: (filters: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue < filters?.number?.less_than,
    less_than_or_equal_to: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) => databaseProperty.actualValue <= filters?.number?.less_than_or_equal_to,
  },
  rich_text: getTextFilterConditionActions("rich_text"),
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
    does_not_contain: (
      filters: any,
      databaseProperty: CustomPageObjectResponse
    ) => {
      if (filters?.multi_select?.does_not_contain === "") return true;
      const multiSelectFilters = filters?.multi_select?.does_not_contain
        .replace(/\s/g, "")
        .split(",");
      return multiSelectFilters.every(
        (filter: any) => !databaseProperty.actualValue.includes(filter)
      );
    },
    is_empty: (_: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue.length === 0,
    is_not_empty: (_: any, databaseProperty: CustomPageObjectResponse) =>
      databaseProperty.actualValue.length !== 0,
  },
};
