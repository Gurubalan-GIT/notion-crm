import {
  CanonicalTableDataType,
  TableDataOrganizersType,
} from "@common/types/global";
import { compoundFilters } from "./../common/utils/helpers/filters";

export const initialCanonicalDataState = null;
export const initialCanonicalTableDataState: CanonicalTableDataType = {
  isLoading: true,
  columns: [],
  dataSource: [],
};
export const initialTableDataOrganizers: TableDataOrganizersType = {
  filters: compoundFilters,
  sorts: [],
};
