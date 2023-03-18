import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { toSnakeCase } from "./global";

export const parseNotionDatabasePropertyTypes = (
  property: PageObjectResponse["properties"]["type"]
) => {
  switch (property.type) {
    case "rich_text":
      return property.rich_text[0].plain_text;
    case "number":
      return property.number;
    case "title":
      return property.title[0].plain_text;
    case "select":
      return property.select?.name;
    default:
      return property;
  }
};

export const getTableDataFromNotionDatabase = (
  results: QueryDatabaseResponse["results"]
) => {
  const columns = Object.keys(
    (results[0] as PageObjectResponse).properties
  ).map((columnName) => {
    return {
      title: <span className="dragHandler">{columnName}</span>,
      dataIndex: toSnakeCase(columnName),
      render: (text: string) => <span>{text}</span>,
      width: 150,
    };
  });

  const dataSource = results.map((queriedRow, queriedRowIndex) => {
    const rowDataSource: any = {};
    const row = queriedRow as PageObjectResponse;
    if (row?.properties) {
      const { properties } = row;
      for (const key in row.properties) {
        if (properties[key]) {
          const snakeCasedKey = toSnakeCase(key);
          const property = properties[key];
          rowDataSource[snakeCasedKey] =
            parseNotionDatabasePropertyTypes(property);
          rowDataSource.key = queriedRowIndex + 1;
        }
      }
    }
    return rowDataSource;
  });

  return { columns, dataSource };
};
