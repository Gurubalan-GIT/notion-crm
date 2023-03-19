import { Models } from "@rematch/core";
import { canonicalData } from "./canonicalData";
import { canonicalTableData } from "./canonicalTableData";
import { filteredTableData } from "./filteredTableData";
import { tableDataOrganizers } from "./tableDataOrganizers";

export interface RootModel extends Models<RootModel> {
  canonicalData: typeof canonicalData;
  canonicalTableData: typeof canonicalTableData;
  filteredTableData: typeof filteredTableData;
  tableDataOrganizers: typeof tableDataOrganizers;
}

export const models: RootModel = {
  canonicalData,
  canonicalTableData,
  tableDataOrganizers,
  filteredTableData,
};
