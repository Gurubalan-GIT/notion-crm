import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { ColumnsType } from "antd/es/table";

export type AdditionalPageObjectResponse = {
  value: string | number | boolean | Date | null;
  actualValue: any;
};

export type CustomPageObjectResponse = AdditionalPageObjectResponse &
  PageObjectResponse["properties"]["type"];

export type DataSourceType = {
  [id: string]: CustomPageObjectResponse | number;
  key: number;
  company: CustomPageObjectResponse;
  estimated_value: CustomPageObjectResponse;
  name: CustomPageObjectResponse;
  priority: CustomPageObjectResponse;
  status: CustomPageObjectResponse;
  field: CustomPageObjectResponse;
  date: CustomPageObjectResponse;
  last_edited_time: CustomPageObjectResponse;
  progress: CustomPageObjectResponse;
  done: CustomPageObjectResponse;
};

export type CanonicalTableDataType = {
  isLoading: boolean;
  columns?: ColumnsType<DataSourceType>;
  dataSource?: Array<DataSourceType>;
};

export type SortDirection = "ascending" | "descending";

export type SortFields = {
  [key: string]: string | SortDirection | number | undefined;
  property: string;
  direction: SortDirection;
  key?: number;
};

export type TableDataOrganizersType = {
  filters: any;
  sorts: Array<SortFields>;
};
