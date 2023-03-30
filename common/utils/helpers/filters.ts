import { isObjectEmpty } from "@common/utils/helpers/global";
import { filterActions } from "./hashmaps";
export const compoundFilters = {};

export const performFilterAction = (
  rootFilters: any,
  depth: number,
  pathIndex: number,
  nestedFilter: any,
  action: string,
  compoundFilterKey: string
) => {
  let updatedFilters;
  switch (action) {
    case filterActions.DELETE:
      if (!rootFilters.hasOwnProperty(compoundFilterKey)) return rootFilters;
      updatedFilters = [...rootFilters[compoundFilterKey]]?.filter(
        (_: any, rootFilterIndex: number) => rootFilterIndex !== pathIndex
      );

      if (!!updatedFilters.length) {
        return {
          ...rootFilters,
          [compoundFilterKey]: updatedFilters,
        };
      } else {
        delete rootFilters[compoundFilterKey];
        return rootFilters;
      }

    case filterActions.UPDATE:
      if (!rootFilters.hasOwnProperty(compoundFilterKey)) return rootFilters;
      updatedFilters = [...rootFilters[compoundFilterKey]];
      updatedFilters[pathIndex] = nestedFilter;
      return {
        ...rootFilters,
        [compoundFilterKey]: updatedFilters,
      };

    case filterActions.ADD:
      if (!rootFilters.hasOwnProperty(compoundFilterKey)) return rootFilters;
      updatedFilters = [...rootFilters[compoundFilterKey]];
      updatedFilters.push(nestedFilter);
      return {
        ...rootFilters,
        [compoundFilterKey]: updatedFilters,
      };

    case filterActions.UPDATE_COMPOUND_FILTER:
      if (!rootFilters.hasOwnProperty(compoundFilterKey)) return rootFilters;
      const newCompoundFilterKey = compoundFilterKey === "and" ? "or" : "and";
      updatedFilters = [...rootFilters[compoundFilterKey]];
      updatedFilters[pathIndex] = nestedFilter;
      delete rootFilters[compoundFilterKey];
      return {
        ...rootFilters,
        [newCompoundFilterKey]: updatedFilters,
      };
  }
};

export const getNestedUpdate = (
  rootFilters: any,
  depth: number,
  pathIndex: number,
  nestedFilter: any,
  action: string,
  compoundFilterKey: string
) => {
  if (depth === 0) {
    return;
  }

  if (depth === 1) {
    return performFilterAction(
      rootFilters,
      depth,
      pathIndex,
      nestedFilter,
      action,
      compoundFilterKey
    );
  }

  if (rootFilters?.and) {
    const updatedFilters = rootFilters.and
      ?.map((rootFilter: any) =>
        getNestedUpdate(
          rootFilter,
          depth - 1,
          pathIndex,
          nestedFilter,
          action,
          compoundFilterKey
        )
      )
      .filter((rootFilter: any) => rootFilter && !isObjectEmpty(rootFilter));

    if (!!updatedFilters.length) {
      return {
        ...rootFilters,
        and: updatedFilters,
      };
    } else {
      delete rootFilters.and;
      return rootFilters;
    }
  }

  if (rootFilters?.or) {
    const updatedFilters = rootFilters.or
      ?.map((rootFilter: any) =>
        getNestedUpdate(
          rootFilter,
          depth - 1,
          pathIndex,
          nestedFilter,
          action,
          compoundFilterKey
        )
      )
      .filter((rootFilter: any) => rootFilter && !isObjectEmpty(rootFilter));

    if (!!updatedFilters.length) {
      return {
        ...rootFilters,
        or: updatedFilters,
      };
    } else {
      delete rootFilters.or;
      return rootFilters;
    }
  }

  return rootFilters;
};
