import { AdditionalPageObjectResponse } from "@common/types/global";
import { toSnakeCase } from "@common/utils/helpers/global";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Checkbox, Space } from "antd";
import format from "date-fns/format";
import PropertyTag from "./PropertyTag";

// TODO: Optimize with hashmap, too much cognitive complexity
const renderComponentsByNotionDatabasePropertyTypes = (
  property: PageObjectResponse["properties"]["type"]
) => {
  let content: AdditionalPageObjectResponse["value"];
  switch (property.type) {
    case "rich_text":
      content = !!property.rich_text.length
        ? property.rich_text[0].plain_text
        : null;
      return {
        value: content,
        element: <span>{content ?? ""}</span>,
        actualValue: content ?? "",
      };
    case "number":
      content = property.number!;
      return {
        value: content,
        element: <span>{content ?? ""}</span>,
        actualValue: content ?? "",
      };
    case "title":
      content = !!property.title.length ? property.title[0].plain_text : null;
      return {
        value: content,
        element: <span>{content ?? ""}</span>,
        actualValue: content ?? "",
      };
    case "select":
      content = property.select?.name!;
      return {
        value: content,
        element: content ? (
          <PropertyTag color={property.select?.color!} text={content} />
        ) : (
          ""
        ),
        actualValue: content ?? "",
      };
    case "status":
      content = property.status?.name!;
      return {
        value: content,
        element: content ? (
          <PropertyTag color={property.status?.color!} text={content} />
        ) : (
          ""
        ),
        actualValue: content ?? "",
      };

    case "multi_select":
      content = property.multi_select.length;
      return {
        value: content,
        element: (
          <Space size={[4, 4]} wrap>
            {property.multi_select.map((option) => (
              <PropertyTag
                key={option.id}
                color={option.color}
                text={option.name}
              />
            ))}
          </Space>
        ),
        actualValue: property.multi_select.map((tags) => tags.name),
      };

    case "last_edited_time":
      content = property?.last_edited_time
        ? new Date(property.last_edited_time)
        : null;
      return {
        value: content,
        element: content ? (
          <span>{format(content, "dd/MM/yyyy hh:mm aa")}</span>
        ) : null,
        actualValue: content,
      };
    case "date":
      content = property?.date ? new Date(property.date?.start!) : null;
      return {
        value: content,
        element: content ? (
          <span>{format(content, "MMM dd, yyyy")}</span>
        ) : null,
        actualValue: content,
      };
    case "checkbox":
      content = property.checkbox;
      return {
        value: content,
        element: <Checkbox checked={content} disabled />,
        actualValue: content,
      };
    default:
      content = "Unsupported Property Format";
      return {
        value: "Unsupported Property Format",
        element: <span>{content}</span>,
        actualValue: content,
      };
  }
};

export const generateTableDataFromNotionDatabase = (
  results: QueryDatabaseResponse["results"]
) => {
  const columns = Object.keys(
    (results[0] as PageObjectResponse).properties
  ).map((columnName, columnIndex) => {
    const property = (results[0] as PageObjectResponse).properties[columnName];
    return {
      title: <span className="dragHandler">{columnName}</span>,
      dataIndex: toSnakeCase(columnName),
      value: columnName,
      render: (property: PageObjectResponse["properties"]["type"]) =>
        renderComponentsByNotionDatabasePropertyTypes(property).element,
      width: 100,
      key: columnIndex + 1,
      type: property.type,
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
            renderComponentsByNotionDatabasePropertyTypes(property).value;
          rowDataSource[snakeCasedKey].actualValue =
            renderComponentsByNotionDatabasePropertyTypes(property).actualValue;
          rowDataSource.key = queriedRowIndex + 1;
        }
      }
    }
    return rowDataSource;
  });

  return { columns, dataSource };
};
