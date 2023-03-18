import { Models } from "@rematch/core";
import { canonicalData } from "./canonicalData";
import { canonicalTableData } from "./canonicalTableData";

export interface RootModel extends Models<RootModel> {
  canonicalData: typeof canonicalData;
  canonicalTableData: typeof canonicalTableData;
}

export const models: RootModel = {
  canonicalData,
  canonicalTableData,
};
