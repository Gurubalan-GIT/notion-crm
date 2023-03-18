import { initialCanonicalTableDataState } from "@rematch-notion/state";
import { createModel } from "@rematch/core";
import type { RootModel } from ".";
import { canonicalTableDataType } from "../../common/types/global";

export const canonicalTableData = createModel<RootModel>()({
  state: initialCanonicalTableDataState as canonicalTableDataType,
  reducers: {
    setCanonicalTableData: (_state, payload) => {
      return { ...payload, isLoading: false };
    },
    setTableColumns: (state, payload) => {
      return { ...state, columns: payload };
    },
  },
});
