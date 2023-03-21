import { CloseOutlined } from "@ant-design/icons";
import { CustomPageObjectResponse, DataSourceType } from "@common/types/global";
import { filterActions } from "@common/utils/helpers/filters";
import { isObjectEmpty } from "@common/utils/helpers/global";
import { filterOptionsHashMap } from "@common/utils/helpers/memoizers";
import { Button, Col, Input, Select, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
const { Option } = Select;

type Props = {
  filters: any;
  columns: ColumnsType<DataSourceType> | undefined;
  depth?: number;
  pathIndex?: number;
  handleChange?: any;
  compoundFilterKey?: string;
};

const NestedFilters = ({
  filters,
  columns,
  depth = 0,
  pathIndex = 0,
  handleChange,
  compoundFilterKey = filters?.and ? "and" : filters?.or ? "or" : "",
}: Props) => {
  const [columnValue, setColumnValue] = useState(filters?.property);
  const [filterCondition, setFilterCondition] = useState<null | string>(null);

  const handleAddFilter = (isGroupFilter: boolean = false) => {
    const commonNewFilter = {
      property: "name",
      title: {
        contains: "",
      },
    };
    handleChange(
      depth + 1,
      pathIndex,
      isGroupFilter
        ? {
            and: [commonNewFilter],
          }
        : commonNewFilter,
      filterActions.ADD,
      compoundFilterKey
    );
  };

  const handleChangeCompositionFilter = (value: string) => {
    handleChange(
      depth,
      pathIndex,
      filters,
      filterActions.UPDATE_COMPOUND_FILTER,
      compoundFilterKey
    );
  };

  const renderCompoundType = () => {
    switch (pathIndex) {
      case 0:
        return <span>Where</span>;
      case 1:
        return (
          <Select
            style={{ width: 60 }}
            size="small"
            onChange={handleChangeCompositionFilter}
            value={compoundFilterKey}
          >
            <Option key={1} value="and">
              and
            </Option>
            <Option key={2} value="or">
              or
            </Option>
          </Select>
        );
      default:
        return <span>{compoundFilterKey}</span>;
    }
  };

  // TODO: Improve with Composition, wrap common logic in layout for the below

  if (filters?.and) {
    return !!filters.and.length ? (
      <Space>
        {renderCompoundType()}
        <div className="p-[10px] pl-[20px] m-[10px] flex flex-col rounded-sm border-[1px] border-solid border-gray-200 bg-gray-50 shadow-sm shadow-gray-200">
          {filters.and.map((filter: any, filterIndex: number) => (
            <NestedFilters
              key={filterIndex.toString() + depth}
              columns={columns}
              filters={filter}
              depth={depth + 1}
              pathIndex={filterIndex}
              handleChange={handleChange}
              compoundFilterKey="and"
            />
          ))}
          <Space className="pt-[5px]">
            <Button onClick={() => handleAddFilter()} size="small">
              + Add a filter rule
            </Button>
            <Button onClick={() => handleAddFilter(true)} size="small">
              + Add a filter Group
            </Button>
          </Space>
        </div>
      </Space>
    ) : null;
  }

  if (filters?.or) {
    return !!filters.or.length ? (
      <Space>
        {renderCompoundType()}
        <div className="p-[10px] pl-[20px] m-[10px] flex flex-col rounded-sm border-[1px] border-solid border-gray-200 bg-gray-50 shadow-sm shadow-gray-200">
          {filters.or.map((filter: any, filterIndex: number) => (
            <NestedFilters
              key={filterIndex.toString() + depth}
              columns={columns}
              filters={filter}
              depth={depth + 1}
              pathIndex={filterIndex}
              handleChange={handleChange}
              compoundFilterKey="or"
            />
          ))}
          <Space className="pt-[5px]">
            <Button onClick={() => handleAddFilter()} size="small">
              + Add a filter rule
            </Button>
            <Button onClick={() => handleAddFilter(true)} size="small">
              + Add a filter Group
            </Button>
          </Space>
        </div>
      </Space>
    ) : null;
  }

  if (filters && isObjectEmpty(filters)) return null;

  const filterType = (columns as any)?.find(
    (column: any) => column.dataIndex === columnValue
  )?.type;

  const defaultFilterCondition = filterType
    ? filterCondition ?? Object.keys(filterOptionsHashMap[filterType])[0]
    : null;

  const handleInputChange = (value: string) => {
    handleChange(
      depth,
      pathIndex,
      {
        property: columnValue,
        [filterType]: {
          [defaultFilterCondition!]: value,
        },
      },
      filterActions.UPDATE,
      compoundFilterKey
    );
  };

  const renderInputByType = (type: CustomPageObjectResponse["type"]) => {
    switch (type) {
      case "title":
      case "select":
        return (
          <Input
            size="small"
            onChange={(e) => handleInputChange(e.target.value)}
            value={
              filters?.[type]?.[filterCondition ?? defaultFilterCondition!]
            }
          />
        );
      default:
        return <span>Unsupported Type</span>;
    }
  };

  return (
    <Col className="p-[10px] my-[5px] flex-col flex items-start">
      <Space className="items-start" size="small">
        {renderCompoundType()}
        <Col className="flex flex-col">
          <Space>
            <Select
              size="small"
              value={columnValue}
              onChange={(value) => setColumnValue(value)}
              style={{ width: "150px" }}
            >
              {columns?.map((column: any) => (
                <Option key={column?.key} value={column?.dataIndex}>
                  {column?.value}
                </Option>
              ))}
            </Select>
            <Select
              size="small"
              value={filterCondition ?? defaultFilterCondition}
              onChange={(value) => setFilterCondition(value)}
            >
              {filterType &&
                Object.keys(filterOptionsHashMap[filterType]).map(
                  (condition: string, conditionIndex: number) => (
                    <Option key={conditionIndex} value={condition}>
                      {condition}
                    </Option>
                  )
                )}
            </Select>
            {filterType &&
              renderInputByType(filterType as CustomPageObjectResponse["type"])}
          </Space>
        </Col>
        <CloseOutlined
          onClick={() => {
            handleChange(
              depth,
              pathIndex,
              structuredClone(filters),
              filterActions.DELETE,
              compoundFilterKey
            );
          }}
          className="cursor-pointer p-[4px] rounded-sm hover:bg-gray-300"
        />
      </Space>
    </Col>
  );
};

export default NestedFilters;
