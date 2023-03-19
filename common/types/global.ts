import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { TableColumnsType } from "antd";

export type DataSourceType = {
  key: number;
  company: PageObjectResponse["properties"];
  estimated_value: PageObjectResponse["properties"];
  name: PageObjectResponse["properties"];
  priority: PageObjectResponse["properties"];
  status: PageObjectResponse["properties"];
  field: PageObjectResponse["properties"];
  date: PageObjectResponse["properties"];
  edited_time: PageObjectResponse["properties"];
  progress: PageObjectResponse["properties"];
  done: PageObjectResponse["properties"];
  value: string | number | boolean | Date;
};

export type CanonicalTableDataType = {
  isLoading: boolean;
  columns?: TableColumnsType<DataSourceType>;
  dataSource?: Array<DataSourceType>;
};

export type SortDirection = "ascending" | "descending";

export type SortFields = {
  [key: string]: string | SortDirection;
  property: string;
  direction: SortDirection;
};

export type TableDataOrganizersType = {
  filters: any;
  sorts: Array<SortFields>;
};
