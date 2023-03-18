import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { initialCanonicalDataState } from "@rematch-notion/state";
import { createModel } from "@rematch/core";
import type { RootModel } from ".";

export const canonicalData = createModel<RootModel>()({
  state: initialCanonicalDataState as QueryDatabaseResponse["results"] | null,
  reducers: {
    setCanonicalData: (_state, payload) => payload,
  },
});
