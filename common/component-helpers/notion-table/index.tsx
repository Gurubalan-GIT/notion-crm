import { DataSourceType } from "@common/types/global";
import { toSnakeCase } from "@common/utils/helpers/global";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Checkbox, Space } from "antd";
import format from "date-fns/format";
import { ReactNode } from "react";
import PropertyTag from "./PropertyTag";

const renderCellContent = (
  text: DataSourceType["value"],
  element: ReactNode,
  returnText: boolean
) => {
  return returnText ? text : element;
};

const renderComponentsByNotionDatabasePropertyTypes = (
  property: PageObjectResponse["properties"]["type"],
  returnText: boolean = false
) => {
  let content: DataSourceType["value"];
  switch (property.type) {
    case "rich_text":
      content = property.rich_text[0].plain_text;
      return renderCellContent(content, <span>{content}</span>, returnText);
    case "number":
      content = property.number!;
      return renderCellContent(content, <span>{content}</span>, returnText);
    case "title":
      content = property.title[0].plain_text;
      return renderCellContent(content, <span>{content}</span>, returnText);
    case "select":
      content = property.select?.name!;
      return renderCellContent(
        property.select?.name!,
        <PropertyTag color={property.select?.color!} text={content} />,
        returnText
      );
    case "status":
      content = property.status?.name!;
      return renderCellContent(
        content,
        <PropertyTag color={property.status?.color!} text={content} />,
        returnText
      );
    case "multi_select":
      content = property.multi_select.length;
      return renderCellContent(
        content,
        <Space size={[4, 4]} wrap>
          {property.multi_select.map((option) => (
            <PropertyTag
              key={option.id}
              color={option.color}
              text={option.name}
            />
          ))}
        </Space>,
        returnText
      );
    case "last_edited_time":
      const date = new Date(property.last_edited_time);
      return renderCellContent(
        date,
        <span>{format(date, "dd/MM/yyyy hh:mm aa")}</span>,
        returnText
      );
    case "date":
      content = new Date(property.date?.start!);
      return renderCellContent(
        content,
        <span>{format(content, "MMM dd, yyyy")}</span>,
        returnText
      );
    case "checkbox":
      content = property.checkbox;
      return renderCellContent(
        content,
        <Checkbox checked={content} disabled />,
        returnText
      );
    default:
      content = "Unsupported Property Format";
      return renderCellContent(content, <span>content</span>, returnText);
  }
};

export const generateTableDataFromNotionDatabase = (
  results: QueryDatabaseResponse["results"]
) => {
  const columns = Object.keys(
    (results[0] as PageObjectResponse).properties
  ).map((columnName, columnIndex) => {
    return {
      title: <span className="dragHandler">{columnName}</span>,
      dataIndex: toSnakeCase(columnName),
      value: columnName,
      render: (property: PageObjectResponse["properties"]["type"]) =>
        renderComponentsByNotionDatabasePropertyTypes(property),
      width: 100,
      key: columnIndex + 1,
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
          rowDataSource[snakeCasedKey] = property;
          rowDataSource[snakeCasedKey].value =
            renderComponentsByNotionDatabasePropertyTypes(property, true);
          rowDataSource.key = queriedRowIndex + 1;
        }
      }
    }
    return rowDataSource;
  });

  return { columns, dataSource };
};
