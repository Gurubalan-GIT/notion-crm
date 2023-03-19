import { initialTableDataOrganizers } from "@rematch-notion/state";
import { createModel } from "@rematch/core";
import type { RootModel } from ".";
import { TableDataOrganizersType } from "../../common/types/global";

export const tableDataOrganizers = createModel<RootModel>()({
  state: initialTableDataOrganizers as TableDataOrganizersType,
  reducers: {
    setTableDataFilters: (_state, payload) => payload,
    setSorts: (state, payload) => {
      return { ...state, sorts: [...payload] };
    },
    updateSorts: (state, payload) => {
      return {
        ...state,
        sorts: [...state.sorts, ...payload],
      };
    },
  },
});
