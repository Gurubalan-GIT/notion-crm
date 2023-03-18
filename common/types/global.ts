import { TableColumnsType } from "antd";

export type DataSourceType = {
  key: number;
  company: string;
  estimated_value: number;
  name: string;
  priority: string;
  status: string;
};

export type canonicalTableDataType = {
  isLoading: boolean;
  columns?: TableColumnsType<DataSourceType>;
  dataSource?: Array<DataSourceType>;
};
