import { initialCanonicalTableDataState } from "@rematch-notion/state";
import { createModel } from "@rematch/core";
import type { RootModel } from ".";
import { CanonicalTableDataType } from "../../common/types/global";

export const filteredTableData = createModel<RootModel>()({
  state: initialCanonicalTableDataState as CanonicalTableDataType,
  reducers: {
    setFilteredTableData: (_state, payload) => {
      return { ...payload, isLoading: false };
    },
    setFilteredTableDataSource: (state, payload) => {
      return { ...state, dataSource: payload };
    },
    setFilteredTableColumns: (state, payload) => {
      return { ...state, columns: payload };
    },
  },
});
