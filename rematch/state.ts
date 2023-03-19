import {
  CanonicalTableDataType,
  TableDataOrganizersType,
} from "@common/types/global";

export const initialCanonicalDataState = null;
export const initialCanonicalTableDataState: CanonicalTableDataType = {
  isLoading: true,
  columns: [],
  dataSource: [],
};
export const initialTableDataOrganizers: TableDataOrganizersType = {
  filters: {},
  sorts: [],
};
